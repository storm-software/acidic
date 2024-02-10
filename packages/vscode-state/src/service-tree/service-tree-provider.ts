import { DaemonProcessManager } from "@acidic/engine";
import type { AcidicConfig } from "@acidic/definition";
import type { StormTrace } from "@storm-stack/telemetry";
import { EMPTY_STRING } from "@storm-stack/utilities";
import { type Event, EventEmitter, type TreeDataProvider, type TreeItem, Uri } from "vscode";
import { ServiceTreeItemType } from "../types";
import { ServiceTreeItem } from "./service-tree-item";
import { ServiceSchemaStatus } from "@acidic/messages";

export class ServiceTreeProvider implements TreeDataProvider<ServiceTreeItem> {
  private _workspaceRoot: string | undefined;
  private _daemon: DaemonProcessManager | undefined;
  private _config: AcidicConfig;
  private _logger: StormTrace;

  #onDidChangeTreeData: EventEmitter<ServiceTreeItem | undefined> = new EventEmitter<
    ServiceTreeItem | undefined
  >();

  public static create = async (
    config: AcidicConfig,
    logger: StormTrace,
    onReadyFn: () => void
  ): Promise<ServiceTreeProvider> => {
    const provider = new ServiceTreeProvider(config, logger, onReadyFn);

    logger.info("Starting Daemon Process Manager");
    if (provider._workspaceRoot) {
      provider._daemon = await DaemonProcessManager.start(config, logger, onReadyFn);
      provider._daemon.onChange(provider.refresh);
    }

    return provider;
  };

  public constructor(config: AcidicConfig, logger: StormTrace, _onReadyFn: () => void) {
    this._config = config;
    this._logger = logger;
    this._workspaceRoot = this._config.workspaceRoot;
  }

  public readonly onDidChangeTreeData: Event<ServiceTreeItem | undefined> =
    this.#onDidChangeTreeData.event;

  public refresh(): void {
    this.#onDidChangeTreeData.fire();
  }

  public getTreeItem(element: ServiceTreeItem): TreeItem {
    if (element) {
      return element;
    }

    return new ServiceTreeItem(
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      Uri.file(this._workspaceRoot!),
      "workspace",
      "workspace",
      ServiceTreeItemType.WORKSPACE,
      ServiceSchemaStatus.ACTIVE
    );
  }

  public getParent() {
    // not implemented, because the reveal API is not needed for the projects view
    return null;
  }

  public getChildren(element?: ServiceTreeItem) {
    if (this._daemon) {
      if (!element) {
        return Promise.resolve([
          new ServiceTreeItem(
            // biome-ignore lint/style/noNonNullAssertion: <explanation>
            Uri.file(this._workspaceRoot!),
            "workspace",
            "workspace",
            ServiceTreeItemType.WORKSPACE,
            ServiceSchemaStatus.ACTIVE
          )
        ]);
      }

      if (element?.type === ServiceTreeItemType.WORKSPACE) {
        return Promise.resolve(
          Array.from(this._daemon.processes.values()).map(
            (process) =>
              new ServiceTreeItem(
                Uri.file(process.path),
                process.path,
                process.context?.definition?.service?.name
                  ? process.context?.definition?.service?.name
                  : process.path,
                ServiceTreeItemType.SERVICE,
                process.status,
                process.error
                  ? process.error
                  : process.context?.definition?.service?.name
                    ? process.path
                    : EMPTY_STRING
              )
          )
        );
      }

      if (element?.type === ServiceTreeItemType.SERVICE) {
        const process = this._daemon.getProcess(element.name);

        const plugins = process?.context?.definition?.service?.plugins;
        if (process && Array.isArray(plugins)) {
          return Promise.resolve(
            plugins.map(
              (plugin) =>
                new ServiceTreeItem(
                  Uri.file(process.path),
                  plugin.name,
                  plugin.name,
                  ServiceTreeItemType.PLUGIN,
                  process.status
                )
            )
          );
        }
      }
    }

    return Promise.resolve([]);
  }
}
