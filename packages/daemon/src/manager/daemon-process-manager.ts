import { AcidicConfig, createAcidicConfig } from "@acidic/config";
import { AcidicSchemaWrapper } from "@acidic/engine";
import { StormError } from "@storm-stack/errors";
import { joinPaths } from "@storm-stack/file-system";
import { StormLog } from "@storm-stack/logging";
import { MaybePromise } from "@storm-stack/utilities";
import { ChildProcess, execFile } from "child_process";
import chokidar from "chokidar";
import { AcidicDaemonErrorCode } from "../errors";
import {
  ActiveMessage,
  BaseMessagePayload,
  ErrorMessage,
  Message,
  MessageIdType
} from "../types";
import { messageBusDecorator } from "../utilities/message-bus-helpers";

type ProcessEventType = "add" | "change" | "remove";
const ProcessEventType = {
  ADD: "add" as ProcessEventType,
  CHANGE: "change" as ProcessEventType,
  REMOVE: "remove" as ProcessEventType
};

type ProcessStatus = "active" | "error" | "loading";
export type DaemonProcess = {
  name: string;
  status: ProcessStatus;
  schemaPath: string;
  schemaWrapper?: AcidicSchemaWrapper;
  error?: StormError;
  process: ChildProcess;
};

export class DaemonProcessManager {
  #config: AcidicConfig;
  #logger: StormLog;
  #watcher: any;
  #processes: Map<string, DaemonProcess> = new Map<string, DaemonProcess>();

  #changedHandlers: Array<(name: string) => MaybePromise<any>> = [];

  public static start = (config?: AcidicConfig, logger?: StormLog) => {
    const daemon = new DaemonProcessManager(config, logger);
    daemon.start();

    return daemon;
  };

  private constructor(config?: AcidicConfig, logger?: StormLog) {
    this.#config = config ?? (createAcidicConfig() as AcidicConfig);

    this.#logger = logger ?? StormLog.create(this.#config, "Acidic Engine");
    this.#logger.info(`Initializing the Acidic Daemon Manager`);

    this.#watcher = chokidar.watch("**/{*.acid,*.acidic}", {
      persistent: true,
      followSymlinks: true,
      cwd: this.#config.storm.workspaceRoot,
      depth: 99,
      interval: 100,
      awaitWriteFinish: {
        stabilityThreshold: 2000,
        pollInterval: 100
      }
    });
  }

  public get processes(): Map<string, DaemonProcess> {
    return this.#processes;
  }

  public getProcess(name: string): DaemonProcess | undefined {
    return Array.from(this.processes.values()).find(proc => proc.name === name);
  }

  public start = () => {
    this.#watcher
      .on("add", this.startChildProcess)
      .on("change", this.changeChildProcess)
      .on("unlink", this.stopChildProcess);
  };

  public stop = () => {
    this.#watcher.close();
    this.#processes.forEach(process => {
      this.stopChildProcess(process.schemaPath);
    });
  };

  public onChange = (handler: (name: string) => MaybePromise<any>) => {
    this.#changedHandlers.push(handler);
  };

  private startChildProcess = (schemaPath: string) => {
    const name = this.formatChildProcessName(schemaPath);
    if (!this.#processes.has(name)) {
      const child = execFile(joinPaths(__dirname, "process.js"), [
        name,
        schemaPath
      ]);

      child.on("error", (error: any) => {
        this.#logger.error(error);
      });
      child.on("exit", (code: any, signal: any) => {
        this.#logger.info(
          `child process exited with code ${code} and signal ${signal}`
        );
      });
      child.on(
        "message",
        messageBusDecorator(
          this.#logger,
          (message: Message<BaseMessagePayload>) => {
            if (message.payload?.name) {
              const process = this.getProcess(message.payload.name);
              if (process) {
                process.status = message.messageId;
                if (message.messageId === MessageIdType.ACTIVE) {
                  const activeMessage = message as ActiveMessage;

                  if (activeMessage.payload?.schema) {
                    process.status = MessageIdType.ACTIVE;
                    process.schemaWrapper = activeMessage.payload?.schema;
                  }
                } else if (message.messageId === MessageIdType.ERROR) {
                  const errorMessage = message as ErrorMessage;

                  process.status = MessageIdType.ERROR;
                  process.error =
                    errorMessage.payload?.error ??
                    new StormError(AcidicDaemonErrorCode.invalid_bus_payload, {
                      message:
                        "No error was provided in the payload of the error message"
                    });
                } else if (message.messageId === MessageIdType.LOADING) {
                  process.status = MessageIdType.LOADING;
                }
              }
            }

            return Promise.resolve(
              this.#changedHandlers.map(handler =>
                handler(message.payload?.name ?? name)
              )
            );
          }
        )
      );

      this.#processes.set(name, {
        name,
        status: "loading",
        schemaPath,
        process: child
      });
    }
  };

  private stopChildProcess = (schemaPath: string) => {
    const name = this.formatChildProcessName(schemaPath);
    if (this.#processes.has(name)) {
      this.#processes.get(name)?.process.unref();
      this.#processes.delete(name);
    }
  };

  private changeChildProcess = (schemaPath: string) => {
    this.stopChildProcess(schemaPath);
    this.startChildProcess(schemaPath);
  };

  private formatChildProcessName = (schemaPath: string) => {
    return schemaPath.replaceAll(/\\/g, "-").replaceAll("/", "-");
  };
}

/*const log = (msg: string) => {
  console.log(msg);

  child.stdout.on("data", (data: any) => {
    console.log(`child stdout:\n${data}`);
  });
  child.stderr.on("data", (data: any) => {
    console.error(`child stderr:\n${data}`);
  });
  child.on("error", (error: any) => {
    console.error(`child error:\n${error}`);
  });
  child.on("exit", (code: any, signal: any) => {
    console.log(`child process exited with code ${code} and signal ${signal}`);
  });
};*/
