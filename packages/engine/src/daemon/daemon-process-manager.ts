import type { AcidicConfig } from "@acidic/definition";
import { AcidicEngine } from "../engine";
import type { AcidicContext } from "../types";
import { type AcidicStore, createAcidicStore, type ServiceStoreItem } from "@acidic/engine";
import { ServiceSchemaStatus } from "@acidic/messages";
import { getCauseFromUnknown } from "@storm-stack/errors";
import { StormTrace } from "@storm-stack/telemetry";
import { type MaybePromise, isError } from "@storm-stack/utilities";
import chokidar, { type FSWatcher } from "chokidar";
import { globSync } from "glob";
// import lockfile from "proper-lockfile";

export interface DaemonProcess extends ServiceStoreItem {
  context: AcidicContext | null;
}

export class DaemonProcessManager implements Disposable {
  private _config: AcidicConfig;
  private _logger: StormTrace;
  private _watcher: FSWatcher;
  private _engine: AcidicEngine | undefined;
  private _store!: AcidicStore;
  private _processes: Map<string, DaemonProcess> = new Map<string, DaemonProcess>();

  private _changedHandlers: Array<(name: string) => MaybePromise<any>> = [];
  private _readyHandlers: Array<() => MaybePromise<any>> = [];

  public static start = async (
    config: AcidicConfig,
    logger: StormTrace,
    onReadyFn: () => void
  ): Promise<DaemonProcessManager> => {
    const daemon = new DaemonProcessManager(config, logger);
    daemon._engine = await AcidicEngine.create(config, logger);

    await daemon.prepare();
    daemon.onReady(onReadyFn);
    daemon.start();

    return daemon;
  };

  private constructor(config: AcidicConfig, logger: StormTrace) {
    this._config = config;

    this._logger = logger ?? StormTrace.create(this._config, "Acidic Engine");
    this._logger.info("Initializing the Acidic Daemon Manager");

    this._watcher = chokidar.watch(this._config.extensions.acidic.input, {
      cwd: this._config.workspaceRoot,
      ignoreInitial: true,
      usePolling: true,
      interval: 1000,
      ignored: this._config.extensions.acidic.ignored as string[]
    });
  }

  public get processes(): Map<string, DaemonProcess> {
    return this._processes;
  }

  public getProcess(schemaPath: string): DaemonProcess | undefined {
    return Array.from(this.processes.values()).find((proc) => proc.path === schemaPath);
  }

  public onChange = (handler: (name: string) => void) => {
    this._changedHandlers.push(handler);
  };

  public onReady = (handler: () => void) => {
    this._readyHandlers.push(handler);
  };

  private prepare = async () => {
    this._store = await createAcidicStore(this._config, this._logger);
  };

  private start = () => {
    this._watcher
      .on("ready", this.handleReady)
      .on("add", this.handleStart)
      .on("change", this.handleChange)
      .on("unlink", this.handleStop);
  };

  private stop = () => {
    this._watcher.close();

    for (const process of this._processes.values()) {
      this.handleStop(process.path);
    }
  };

  private handleStart = async (schemaPath: string) => {
    if (!this._processes.has(schemaPath)) {
      await this.setProcess(schemaPath, {
        path: schemaPath,
        status: "loading",
        error: null
      });

      await this.executeEngine(schemaPath);
    }
  };

  private handleStop = (schemaPath: string) => {
    if (this._processes.has(schemaPath)) {
      this._processes.delete(schemaPath);
    }
  };

  private handleChange = async (schemaPath: string) => {
    this.handleStop(schemaPath);
    await this.handleStart(schemaPath);
  };

  private handleReady = () => {
    const watched = globSync(this._config.extensions.acidic.input as string[], {
      cwd: this._config.workspaceRoot,
      ignore: this._config.extensions.acidic.ignored as string[],
      absolute: true
    });

    return Promise.all(
      watched.map((watch) => this.prepareEngine(watch.replaceAll("\\", "/")))
    ).then(() => {
      for (const handler of this._readyHandlers.values()) {
        handler();
      }
    });
  };

  private prepareEngine = async (schemaPath: string) => {
    /*const release = await lockfile.lock(schemaPath, {
      lockfilePath: joinPaths(this._config.workspaceRoot, "acidic")
    });*/
    try {
      const result = await this._engine?.prepare({
        schema: schemaPath,
        packageManager: this._config.packageManager,
        outputPath: this._config.runtimePath
      });
      if (isError(result)) {
        await this.setProcess(schemaPath, {
          status: "error",
          error: getCauseFromUnknown(result).print()
        });
      } else {
        await this.setProcess(schemaPath, {
          context: result,
          status: "active",
          error: null
        });
      }
    } catch (e) {
      this._logger.error(e);

      await this.setProcess(schemaPath, {
        status: "error",
        error: getCauseFromUnknown(e).print()
      });
    } finally {
      // await release();
    }
  };

  private executeEngine = async (schemaPath: string) => {
    /*const release = await lockfile.lock(schemaPath, {
      lockfilePath: joinPaths(this._config.workspaceRoot, "acidic")
    });*/
    try {
      const result = await this._engine?.execute({
        schema: schemaPath,
        packageManager: this._config.packageManager,
        outputPath: this._config.runtimePath
      });
      if (isError(result)) {
        await this.setProcess(schemaPath, {
          status: "error",
          error: getCauseFromUnknown(result).print()
        });
      } else {
        await this.setProcess(schemaPath, {
          context: result,
          status: "active",
          error: null
        });
      }
    } catch (e) {
      this._logger.error(e);

      await this.setProcess(schemaPath, {
        status: "error",
        error: getCauseFromUnknown(e).print()
      });
    } finally {
      // await release();
    }
  };

  private setProcess = async (schemaPath: string, daemonProcess: Partial<DaemonProcess>) => {
    try {
      const process: DaemonProcess = {
        path: schemaPath,
        status: ServiceSchemaStatus.LOADING,
        ...daemonProcess,
        error: daemonProcess.error ?? null,
        definition: daemonProcess.context?.definition.service ?? null,
        context: daemonProcess.context ?? null
      };
      this._processes.set(schemaPath, process);

      this._logger.info(
        `Daemon Process: ${schemaPath} - writing status to store ${process.status}`
      );
      await this._store.setService(schemaPath, {
        path: process.path,
        status: process.status,
        definition: process.definition,
        error: process.error
      });

      this._logger.info(`Daemon Process: ${schemaPath} - Calling handlers`);
      for (const handler of this._readyHandlers.values()) {
        handler();
      }
    } catch (e) {
      this._logger.error(e);

      await this.setProcess(schemaPath, {
        status: "error",
        error: getCauseFromUnknown(e).print()
      });
    }
  };

  [Symbol.dispose](): void;
  [Symbol.dispose](): void;
  [Symbol.dispose](): void {
    this.stop();
  }
}
