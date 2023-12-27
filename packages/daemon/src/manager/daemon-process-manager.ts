import { AcidicConfig } from "@acidic/config";
import { AcidicEngine, AcidicSchemaWrapper } from "@acidic/engine";
import { StormError, getCauseFromUnknown } from "@storm-stack/errors";
import { joinPaths } from "@storm-stack/file-system";
import { StormLog } from "@storm-stack/logging";
import { MaybePromise, isError } from "@storm-stack/utilities";
import chokidar, { FSWatcher } from "chokidar";
import { globSync } from "glob";

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
  schema?: AcidicSchemaWrapper;
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
      this.#processes.set(schemaPath, {
        path: schemaPath,
        status: "loading",
        error: null
      });
      this.handleChange(schemaPath);

      this.executeEngine(schemaPath).then(() => {
        this.handleChange(schemaPath);
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
    const watched = globSync(
      joinPaths(
        this.#config.workspaceRoot,
        this.#config.extensions.acidic.input
      ),
      {
        ignore: this.#config.extensions.acidic.ignored,
        absolute: true,
        allowWindowsEscape: true,
        follow: true
      }
    );

    return Promise.all(
      watched.map(schemaPath => this.executeEngine(schemaPath))
    ).then(() => {
      return this.#readyHandlers.forEach(handler => handler());
    });
  };

  private executeEngine = async (schemaPath: string) => {
    return this.#engine
      .execute({
        schema: schemaPath,
        packageManager: this.#config.packageManager,
        outputPath: this.#config.runtimePath
      })
      .then(result => {
        if (isError(result)) {
          this.#processes.set(schemaPath, {
            path: schemaPath,
            status: "error",
            error: getCauseFromUnknown(result)
          });
        } else {
          this.#processes.set(schemaPath, {
            path: schemaPath,
            schema: result,
            status: "active",
            error: null
          });
        }
      })
      .catch(e => {
        this.#logger.error(e);

        this.#processes.set(schemaPath, {
          path: schemaPath,
          status: "error",
          error: getCauseFromUnknown(e)
        });
      });
  };
}
