import { AcidicConfig } from "@acidic/config";
import { AcidicContext, AcidicEngine } from "@acidic/engine";
import { StormError, getCauseFromUnknown } from "@storm-stack/errors";
import { StormLog } from "@storm-stack/logging";
import { MaybePromise, isError } from "@storm-stack/utilities";
import chokidar, { FSWatcher } from "chokidar";
import { globSync } from "glob";
import lockfile from "proper-lockfile";

type ProcessEventType = "add" | "change" | "remove";
const ProcessEventType = {
  ADD: "add" as ProcessEventType,
  CHANGE: "change" as ProcessEventType,
  REMOVE: "remove" as ProcessEventType
};

type ProcessStatus = "active" | "error" | "loading";
export type DaemonProcess = {
  path: string;
  status: ProcessStatus;
  context?: AcidicContext;
  error: StormError | null;
};

export class DaemonProcessManager {
  private _config: AcidicConfig;
  private _logger: StormLog;
  private _watcher: FSWatcher;
  private _engine: AcidicEngine;
  private _processes: Map<string, DaemonProcess> = new Map<
    string,
    DaemonProcess
  >();

  private _changedHandlers: Array<(name: string) => MaybePromise<any>> = [];
  private _readyHandlers: Array<() => MaybePromise<any>> = [];

  public static start = async (
    config: AcidicConfig,
    logger: StormLog,
    onReadyFn: () => void
  ): Promise<DaemonProcessManager> => {
    const daemon = new DaemonProcessManager(config, logger);
    daemon._engine = await AcidicEngine.create(config, logger);

    daemon.onReady(onReadyFn);
    daemon.start();

    return daemon;
  };

  private constructor(config: AcidicConfig, logger: StormLog) {
    this._config = config;

    this._logger = logger ?? StormLog.create(this._config, "Acidic Engine");
    this._logger.info(`Initializing the Acidic Daemon Manager`);

    this._watcher = chokidar.watch(this._config.extensions.acidic.input, {
      cwd: this._config.workspaceRoot,
      ignoreInitial: true,
      usePolling: true,
      interval: 1000,
      ignored: this._config.extensions.acidic.ignored
    });
  }

  public get processes(): Map<string, DaemonProcess> {
    return this._processes;
  }

  public getProcess(schemaPath: string): DaemonProcess | undefined {
    return Array.from(this.processes.values()).find(
      proc => proc.path === schemaPath
    );
  }

  public start = async () => {
    this._watcher
      .on("ready", this.handleReady)
      .on("add", this.handleStart)
      .on("change", this.handleChange)
      .on("unlink", this.handleStop);
  };

  public stop = () => {
    this._watcher.close();
    this._processes.forEach(process => {
      this.handleStop(process.path);
    });
  };

  public onChange = (handler: (name: string) => void) => {
    this._changedHandlers.push(handler);
  };

  public onReady = (handler: () => void) => {
    this._readyHandlers.push(handler);
  };

  private handleStart = async (schemaPath: string) => {
    if (!this._processes.has(schemaPath)) {
      this.setProcess(schemaPath, {
        path: schemaPath,
        status: "loading",
        error: null
      });

      this.executeEngine(schemaPath)
        .then(() => {
          this.setProcess(schemaPath, {
            status: "active",
            error: null
          });
        })
        .catch(() => {
          this.setProcess(schemaPath, {
            status: "error",
            error: null
          });
        });
    }
  };

  private handleStop = (schemaPath: string) => {
    if (this._processes.has(schemaPath)) {
      this._processes.delete(schemaPath);
    }
  };

  private handleChange = (schemaPath: string) => {
    this.handleStop(schemaPath);
    this.handleStart(schemaPath);
  };

  private handleReady = () => {
    const watched = globSync(this._config.extensions.acidic.input, {
      cwd: this._config.workspaceRoot,
      ignore: this._config.extensions.acidic.ignored,
      absolute: true
    });

    return Promise.all(
      watched.map(watch => this.prepareEngine(watch.replaceAll("\\", "/")))
    ).then(() => {
      return this._readyHandlers.forEach(handler => handler());
    });
  };

  private prepareEngine = (schemaPath: string) => {
    return lockfile.lock(schemaPath).then(release =>
      this._engine
        .prepare({
          schema: schemaPath,
          packageManager: this._config.packageManager,
          outputPath: this._config.runtimePath
        })
        .then(result => {
          if (isError(result)) {
            this.setProcess(schemaPath, {
              status: "error",
              error: getCauseFromUnknown(result)
            });
          } else {
            this.setProcess(schemaPath, {
              context: result,
              status: "active",
              error: null
            });
          }
        })
        .catch(e => {
          this._logger.error(e);

          this.setProcess(schemaPath, {
            status: "error",
            error: getCauseFromUnknown(e)
          });
        })
        .finally(() => release())
    );
  };

  private executeEngine = (schemaPath: string) => {
    return lockfile.lock(schemaPath).then(release =>
      this._engine
        .execute({
          schema: schemaPath,
          packageManager: this._config.packageManager,
          outputPath: this._config.runtimePath
        })
        .then(result => {
          if (isError(result)) {
            this.setProcess(schemaPath, {
              status: "error",
              error: getCauseFromUnknown(result)
            });
          } else {
            this.setProcess(schemaPath, {
              context: result,
              status: "active",
              error: null
            });
          }
        })
        .catch(e => {
          this._logger.error(e);

          this.setProcess(schemaPath, {
            status: "error",
            error: getCauseFromUnknown(e)
          });
        })
        .finally(() => release())
    );
  };

  private setProcess = async (
    schemaPath: string,
    daemonProcess: Partial<DaemonProcess>
  ) => {
    this._processes.set(schemaPath, {
      path: schemaPath,
      status: "loading",
      error: null,
      ...this._processes.get(schemaPath),
      ...daemonProcess
    });

    this._readyHandlers.forEach(handler => handler());
  };
}
