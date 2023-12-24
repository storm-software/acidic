import { DaemonProcessManager } from "@acidic/daemon";
import { globSync } from "glob";
import { join } from "path";
import {
  Event,
  EventEmitter,
  TreeDataProvider,
  TreeItem,
  Uri,
  window
} from "vscode";
import { ServiceTreeItemType } from "../types";
import { ServiceTreeItem } from "./service-tree-item";

export class ServiceTreeProvider implements TreeDataProvider<ServiceTreeItem> {
  #schemaPaths: string[] = [];
  #workspaceRoot: string | undefined;
  #daemon: DaemonProcessManager;

  private _onDidChangeTreeData: EventEmitter<ServiceTreeItem | undefined> =
    new EventEmitter<ServiceTreeItem | undefined>();

  public readonly onDidChangeTreeData: Event<ServiceTreeItem | undefined> =
    this._onDidChangeTreeData.event;

  constructor(workspaceRoot: string) {
    this.#workspaceRoot = workspaceRoot;
    this.#schemaPaths = globSync(
      [
        join(this.#workspaceRoot, "**/*.acid"),
        join(this.#workspaceRoot, "**/*.acidic")
      ],
      {
        withFileTypes: false
      }
    );

    this.#daemon = DaemonProcessManager.start();
    this.#daemon.onChange(this.refresh);
  }

  public refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  public getTreeItem(element: ServiceTreeItem): TreeItem {
    return element;
  }

  public getChildren(element?: ServiceTreeItem) {
    if (!this.#workspaceRoot) {
      window.showInformationMessage("No dependency in empty workspace");
      return Promise.resolve([]);
    }

    if (element?.type === ServiceTreeItemType.SCHEMA) {
      const process = this.#daemon.getProcess(element.name);

      const plugins = process?.schemaWrapper?.service?.plugins;
      if (process && Array.isArray(plugins)) {
        return Promise.resolve(
          plugins.map(
            plugin =>
              new ServiceTreeItem(
                Uri.file(process.schemaPath),
                plugin.name,
                ServiceTreeItemType.PLUGIN,
                process.status
              )
          )
        );
      }
    }

    return Promise.resolve([]);
  }
}
