import { AcidicConfig, createAcidicConfig } from "@acidic/config";
import { StormLog } from "@storm-stack/logging";
import { ExtensionContext, Memento } from "vscode";

let CONFIG_STORE: WorkspaceConfigStore;

/**
 * Configuration store that has config related to the opened workspace in vscode
 */
export class WorkspaceConfigStore {
  #config: AcidicConfig | undefined;
  #state: Memento;
  #logger: StormLog;

  public static fromContext(
    context: ExtensionContext,
    logger: StormLog
  ): WorkspaceConfigStore {
    CONFIG_STORE = new WorkspaceConfigStore(context.workspaceState, logger);
    return CONFIG_STORE;
  }

  /**
   * Returns the instance of WorkspaceConfigStore
   */
  public static get instance() {
    if (!CONFIG_STORE) {
      throw Error(
        "Please create a configuration store with `fromContext` first"
      );
    }
    return CONFIG_STORE;
  }

  constructor(state: Memento, logger: StormLog) {
    this.#state = state;
    this.#logger = logger;

    this.updateConfig();
  }

  public get config(): AcidicConfig | undefined {
    return this.#config;
  }

  public get workspaceRoot(): string | undefined {
    return this.config?.storm.workspaceRoot;
  }

  public async setWorkspaceRoot(workspaceRoot: string) {
    this.updateConfig(workspaceRoot);
  }

  public delete(key: string): void {
    this.#state.update(key, undefined);
  }

  public get<T>(key: string, defaultValue: T) {
    const config = this.#state.get(key, defaultValue);
    return typeof config === "undefined" ? defaultValue : config;
  }

  public set<T>(key: string, value: T): void {
    this.#state.update(key, value);
  }

  private updateConfig(workspaceRoot?: string) {
    try {
      this.#config = createAcidicConfig(workspaceRoot);
    } catch (e) {
      this.#logger?.error(e);
      this.#config = undefined;
    }
  }
}
