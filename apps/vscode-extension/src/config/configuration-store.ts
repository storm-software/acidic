import { StormLog } from "@storm-stack/logging";
import { ExtensionContext, Memento } from "vscode";
import { Store } from "./store";

let CONFIG_STORE: ConfigurationStore;

/**
 * Configuration store that has config related to the opened workspace in vscode
 */
export class ConfigurationStore implements Store {
  static fromContext(
    context: ExtensionContext,
    logger: StormLog
  ): ConfigurationStore {
    CONFIG_STORE = new ConfigurationStore(context.workspaceState);
    return CONFIG_STORE;
  }

  /**
   * Returns the instance of WorkspaceConfigurationStore
   */
  static get instance() {
    if (!CONFIG_STORE) {
      throw Error(
        "Please create a configuration store with `fromContext` first"
      );
    }
    return CONFIG_STORE;
  }

  constructor(private readonly state: Memento) {}

  delete(key: string): void {
    this.state.update(key, undefined);
  }

  get<T>(key: string, defaultValue: T) {
    const config = this.state.get(key, defaultValue);
    return typeof config === "undefined" ? defaultValue : config;
  }

  set<T>(key: string, value: T): void {
    this.state.update(key, value);
  }
}
