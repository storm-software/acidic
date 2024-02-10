import { TreeItem, TreeItemCollapsibleState, Uri } from "vscode";
import { ServiceTreeItemType } from "../types";
import { getStoredCollapsibleState } from "../utilities/tree-item-collapsible-store";
import { ServiceSchemaStatus } from "@acidic/messages";
import { joinPaths } from "@storm-stack/file-system";
import { WorkspaceConfigStore } from "../utilities/workspace-config-store";
import type { ExtensionContext } from "vscode";

export class ServiceTreeItem extends TreeItem {
  #name: string;
  #type: ServiceTreeItemType;
  #status: ServiceSchemaStatus;
  #context: ExtensionContext;

  public constructor(
    public override resourceUri: Uri,
    id: string,
    label: string,
    type: ServiceTreeItemType,
    status: ServiceSchemaStatus = ServiceSchemaStatus.LOADING,
    description?: string
  ) {
    let collapsibleState: TreeItemCollapsibleState;
    if (type === ServiceTreeItemType.PLUGIN) {
      collapsibleState = TreeItemCollapsibleState.None;
    } else {
      collapsibleState =
        getStoredCollapsibleState(id) ?? type === ServiceTreeItemType.WORKSPACE
          ? TreeItemCollapsibleState.Expanded
          : TreeItemCollapsibleState.Collapsed;
    }
    super(label, collapsibleState);

    this.#context = WorkspaceConfigStore.instance.context;
    this.#name = id;
    this.id = id;

    this.#type = type;
    this.#status = status;

    this.contextValue = `${this.#type}_${this.#status}`;
    this.iconPath = this.getIconPath();

    if (this.#type === ServiceTreeItemType.WORKSPACE) {
      this.label = "Workspace";
      this.tooltip = "Workspace Root Directory";
      this.description = "Workspace Root Directory";
    } else {
      this.label = label;
      this.description = description
        ? description
        : this.#type === ServiceTreeItemType.SERVICE
          ? "Service"
          : "Plugin";

      this.tooltip = `${label} - ${this.description}`;
    }
  }

  public get name(): string {
    return this.#name;
  }

  public get type(): ServiceTreeItemType {
    return this.#type;
  }

  public get status(): ServiceSchemaStatus {
    return this.#status;
  }

  public getIconPath() {
    if (this.#type === ServiceTreeItemType.WORKSPACE) {
      if (this.#status === ServiceSchemaStatus.ERROR) {
        return {
          light: Uri.file(this.#context.asAbsolutePath(joinPaths("assets", "light", "error.svg"))),
          dark: Uri.file(this.#context.asAbsolutePath(joinPaths("assets", "dark", "error.svg")))
        };
      }

      return {
        light: Uri.file(
          this.#context.asAbsolutePath(joinPaths("assets", "light", "workspace.svg"))
        ),
        dark: Uri.file(this.#context.asAbsolutePath(joinPaths("assets", "dark", "workspace.svg")))
      };
    }
    if (this.#type === ServiceTreeItemType.SERVICE) {
      if (this.#status === ServiceSchemaStatus.ERROR) {
        return {
          light: Uri.file(this.#context.asAbsolutePath(joinPaths("assets", "light", "error.svg"))),
          dark: Uri.file(this.#context.asAbsolutePath(joinPaths("assets", "dark", "error.svg")))
        };
      }

      // if (this.#status === ServiceTreeItemStatus.ACTIVE) {
      //   return {
      //     light: Uri.file(
      //       this.#context.asAbsolutePath(joinPaths("assets", "light", "success.svg"))
      //     ),
      //     dark: Uri.file(this.#context.asAbsolutePath(joinPaths("assets", "dark", "success.svg")))
      //   };
      // }

      return {
        light: Uri.file(this.#context.asAbsolutePath(joinPaths("assets", "light", "service.svg"))),
        dark: Uri.file(this.#context.asAbsolutePath(joinPaths("assets", "dark", "service.svg")))
      };
    }
    if (this.#status === ServiceSchemaStatus.ERROR) {
      return {
        light: Uri.file(this.#context.asAbsolutePath(joinPaths("assets", "light", "error.svg"))),
        dark: Uri.file(this.#context.asAbsolutePath(joinPaths("assets", "dark", "error.svg")))
      };
    }

    if (this.#status === ServiceSchemaStatus.ACTIVE) {
      return {
        light: Uri.file(this.#context.asAbsolutePath(joinPaths("assets", "light", "success.svg"))),
        dark: Uri.file(this.#context.asAbsolutePath(joinPaths("assets", "dark", "success.svg")))
      };
    }

    return {
      light: Uri.file(this.#context.asAbsolutePath(joinPaths("assets", "light", "plugin.svg"))),
      dark: Uri.file(this.#context.asAbsolutePath(joinPaths("assets", "dark", "plugin.svg")))
    };
  }
}
