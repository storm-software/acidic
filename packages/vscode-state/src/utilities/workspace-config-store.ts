import type { AcidicConfig } from "@acidic/definition";
import { createAcidicConfig } from "@acidic/engine";
import type { StormTrace } from "@storm-stack/telemetry";
import type { ExtensionContext, Memento } from "vscode";

let CONFIG_STORE: WorkspaceConfigStore;

/**
 * Configuration store that has config related to the opened workspace in vscode
 */
export class WorkspaceConfigStore {
  #config: AcidicConfig | undefined;
  #state: Memento;
  #logger: StormTrace;
  #context: ExtensionContext;

  public static fromContext(context: ExtensionContext, logger: StormTrace): WorkspaceConfigStore {
    CONFIG_STORE = new WorkspaceConfigStore(context.workspaceState, context, logger);
    return CONFIG_STORE;
  }

  /**
   * Returns the instance of WorkspaceConfigStore
   */
  public static get instance() {
    if (!CONFIG_STORE) {
      throw Error("Please create a configuration store with `fromContext` first");
    }
    return CONFIG_STORE;
  }

  constructor(state: Memento, context: ExtensionContext, logger: StormTrace) {
    this.#state = state;
    this.#logger = logger;
    this.#context = context;

    this.updateConfig();
  }

  public get config(): AcidicConfig | undefined {
    return this.#config;
  }

  public get workspaceRoot(): string | undefined {
    return this.config?.storm.workspaceRoot;
  }

  public set workspaceRoot(workspaceRoot: string) {
    this.updateConfig(workspaceRoot);
  }

  public get context(): ExtensionContext {
    return this.#context;
  }

  public set context(context: ExtensionContext) {
    this.#context = context;
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

  private async updateConfig(workspaceRoot?: string) {
    try {
      this.#config = await createAcidicConfig(workspaceRoot);
    } catch (e) {
      this.#logger?.error(e);
      this.#config = undefined;
    }
  }
}
