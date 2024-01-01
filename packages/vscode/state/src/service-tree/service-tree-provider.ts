import { AcidicConfig } from "@acidic/config";
import { DaemonProcessManager } from "@acidic/daemon";
import { StormLog } from "@storm-stack/logging";
import { EMPTY_STRING } from "@storm-stack/utilities";
import { Event, EventEmitter, TreeDataProvider, TreeItem, Uri } from "vscode";
import { ServiceTreeItemStatus, ServiceTreeItemType } from "../types";
import { ServiceTreeItem } from "./service-tree-item";

export class ServiceTreeProvider implements TreeDataProvider<ServiceTreeItem> {
  #workspaceRoot: string | undefined;
  #daemon: DaemonProcessManager | undefined;
  #config: AcidicConfig;
  #logger: StormLog;

  private _onDidChangeTreeData: EventEmitter<ServiceTreeItem | undefined> =
    new EventEmitter<ServiceTreeItem | undefined>();

  public constructor(
    config: AcidicConfig,
    logger: StormLog,
    onReadyFn: () => void
  ) {
    this.#config = config;
    this.#logger = logger;

    this.#workspaceRoot = this.#config.workspaceRoot;
    if (this.#workspaceRoot) {
      this.#daemon = DaemonProcessManager.start(
        this.#config,
        this.#logger,
        onReadyFn
      );
      this.#daemon.onChange(this.refresh);
    }
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
      Uri.file(this.#workspaceRoot!),
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
    if (this.#daemon) {
      if (!element) {
        return Promise.resolve([
          new ServiceTreeItem(
            Uri.file(this.#workspaceRoot!),
            "workspace",
            "workspace",
            ServiceTreeItemType.WORKSPACE,
            ServiceTreeItemStatus.ACTIVE
          )
        ]);
      } else if (element?.type === ServiceTreeItemType.WORKSPACE) {
        return Promise.resolve(
          Array.from(this.#daemon.processes.values()).map(
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
        const process = this.#daemon.getProcess(element.name);

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
