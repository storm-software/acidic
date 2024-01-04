import { AcidicConfig } from "@acidic/config";
import { AcidicEngine, Context } from "@acidic/engine";
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
  context?: Context;
  error: StormError | null;
};

export class DaemonProcessManager {
  #config: AcidicConfig;
  #logger: StormLog;

  #watcher: FSWatcher;
  #engine: AcidicEngine;

  #processes: Map<string, DaemonProcess> = new Map<string, DaemonProcess>();

  #changedHandlers: Array<(name: string) => MaybePromise<any>> = [];
  #readyHandlers: Array<() => MaybePromise<any>> = [];

  public static start = (
    config: AcidicConfig,
    logger: StormLog,
    onReadyFn: () => void
  ) => {
    const daemon = new DaemonProcessManager(config, logger);

    daemon.onReady(onReadyFn);
    daemon.start();

    return daemon;
  };

  private constructor(config: AcidicConfig, logger: StormLog) {
    this.#config = config;

    this.#logger = logger ?? StormLog.create(this.#config, "Acidic Engine");
    this.#logger.info(`Initializing the Acidic Daemon Manager`);

    this.#watcher = chokidar.watch(this.#config.extensions.acidic.input, {
      cwd: this.#config.workspaceRoot,
      ignoreInitial: true,
      usePolling: true,
      interval: 1000,
      ignored: this.#config.extensions.acidic.ignored
    });
    this.#engine = AcidicEngine.create(this.#config, this.#logger);
  }

  public get processes(): Map<string, DaemonProcess> {
    return this.#processes;
  }

  public getProcess(schemaPath: string): DaemonProcess | undefined {
    return Array.from(this.processes.values()).find(
      proc => proc.path === schemaPath
    );
  }

  public start = async () => {
    this.#watcher
      .on("ready", this.handleReady)
      .on("add", this.handleStart)
      .on("change", this.handleChange)
      .on("unlink", this.handleStop);
  };

  public stop = () => {
    this.#watcher.close();
    this.#processes.forEach(process => {
      this.handleStop(process.path);
    });
  };

  public onChange = (handler: (name: string) => void) => {
    this.#changedHandlers.push(handler);
  };

  public onReady = (handler: () => void) => {
    this.#readyHandlers.push(handler);
  };

  private handleStart = async (schemaPath: string) => {
    if (!this.#processes.has(schemaPath)) {
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
    if (this.#processes.has(schemaPath)) {
      this.#processes.delete(schemaPath);
    }
  };

  private handleChange = (schemaPath: string) => {
    this.handleStop(schemaPath);
    this.handleStart(schemaPath);
  };

  private handleReady = () => {
    const watched = globSync(this.#config.extensions.acidic.input, {
      cwd: this.#config.workspaceRoot,
      ignore: this.#config.extensions.acidic.ignored,
      absolute: true
    });

    return Promise.all(
      watched.map(watch => this.prepareEngine(watch.replaceAll("\\", "/")))
    ).then(() => {
      return this.#readyHandlers.forEach(handler => handler());
    });
  };

  private prepareEngine = (schemaPath: string) => {
    return lockfile.lock(schemaPath).then(release =>
      this.#engine
        .prepare({
          schema: schemaPath,
          packageManager: this.#config.packageManager,
          outputPath: this.#config.runtimePath
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
          this.#logger.error(e);

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
      this.#engine
        .execute({
          schema: schemaPath,
          packageManager: this.#config.packageManager,
          outputPath: this.#config.runtimePath
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
          this.#logger.error(e);

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
    this.#processes.set(schemaPath, {
      path: schemaPath,
      status: "loading",
      error: null,
      ...this.#processes.get(schemaPath),
      ...daemonProcess
    });

    this.#readyHandlers.forEach(handler => handler());
  };
}
