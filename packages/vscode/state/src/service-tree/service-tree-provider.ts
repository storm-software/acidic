import { AcidicConfig } from "@acidic/config";
import { DaemonProcessManager } from "@acidic/daemon";
import { StormLog } from "@storm-stack/logging";
import { EMPTY_STRING } from "@storm-stack/utilities";
import { Event, EventEmitter, TreeDataProvider, TreeItem, Uri } from "vscode";
import { ServiceTreeItemStatus, ServiceTreeItemType } from "../types";
import { ServiceTreeItem } from "./service-tree-item";

export class ServiceTreeProvider implements TreeDataProvider<ServiceTreeItem> {
  private _workspaceRoot: string | undefined;
  private _daemon: DaemonProcessManager | undefined;
  private _config: AcidicConfig;
  private _logger: StormLog;

  private _onDidChangeTreeData: EventEmitter<ServiceTreeItem | undefined> =
    new EventEmitter<ServiceTreeItem | undefined>();

  public static create = async (
    config: AcidicConfig,
    logger: StormLog,
    onReadyFn: () => void
  ): Promise<ServiceTreeProvider> => {
    const provider = new ServiceTreeProvider(config, logger, onReadyFn);

    if (provider._workspaceRoot) {
      provider._daemon = await DaemonProcessManager.start(
        config,
        logger,
        onReadyFn
      );
      provider._daemon.onChange(provider.refresh);
    }

    return provider;
  };

  public constructor(
    config: AcidicConfig,
    logger: StormLog,
    onReadyFn: () => void
  ) {
    this._config = config;
    this._logger = logger;
    this._workspaceRoot = this._config.workspaceRoot;
  }

  public readonly onDidChangeTreeData: Event<ServiceTreeItem | undefined> =
    this._onDidChangeTreeData.event;

  public refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  public getTreeItem(element: ServiceTreeItem): TreeItem {
    if (element) {
      return element;
    }

    return new ServiceTreeItem(
      Uri.file(this._workspaceRoot!),
      "workspace",
      "workspace",
      ServiceTreeItemType.WORKSPACE,
      ServiceTreeItemStatus.ACTIVE
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
            Uri.file(this._workspaceRoot!),
            "workspace",
            "workspace",
            ServiceTreeItemType.WORKSPACE,
            ServiceTreeItemStatus.ACTIVE
          )
        ]);
      } else if (element?.type === ServiceTreeItemType.WORKSPACE) {
        return Promise.resolve(
          Array.from(this._daemon.processes.values()).map(
            process =>
              new ServiceTreeItem(
                Uri.file(process.path),
                process.path,
                process.context?.wrapper?.service?.name
                  ? process.context?.wrapper?.service?.name
                  : process.path,
                ServiceTreeItemType.SERVICE,
                process.status,
                process.error
                  ? process.error.print()
                  : process.context?.wrapper?.service?.name
                    ? process.path
                    : EMPTY_STRING
              )
          )
        );
      } else if (element?.type === ServiceTreeItemType.SERVICE) {
        const process = this._daemon.getProcess(element.name);

        const plugins = process?.context?.wrapper?.service?.plugins;
        if (process && Array.isArray(plugins)) {
          return Promise.resolve(
            plugins.map(
              plugin =>
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
