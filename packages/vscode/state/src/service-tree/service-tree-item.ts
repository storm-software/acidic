import { TreeItem, TreeItemCollapsibleState, Uri } from "vscode";
import { ServiceTreeItemStatus, ServiceTreeItemType } from "../types";
import { getStoredCollapsibleState } from "../utilities/tree-item-collapsible-store";

export class ServiceTreeItem extends TreeItem {
  #name: string;
  #type: ServiceTreeItemType;
  #status: ServiceTreeItemStatus;

  public constructor(
    public override resourceUri: Uri,
    id: string,
    label: string,
    type: ServiceTreeItemType,
    status: ServiceTreeItemStatus = ServiceTreeItemStatus.LOADING,
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

  public get status(): ServiceTreeItemStatus {
    return this.#status;
  }

  public getIconPath() {
    if (this.#status === ServiceTreeItemStatus.LOADING) {
      return "$(loading~spin)";
    }

    if (this.#type === ServiceTreeItemType.WORKSPACE) {
      if (this.#status === ServiceTreeItemStatus.ERROR) {
        return "$(error)";
      } else {
        return "$(folder)";
      }
    } else if (this.#type === ServiceTreeItemType.SERVICE) {
      if (this.#status === ServiceTreeItemStatus.ERROR) {
        return "$(bracket-error)";
      } else {
        return "$(bracket)";
      }
    } else {
      if (this.#status === ServiceTreeItemStatus.ERROR) {
        return "$(pass-filled)";
      } else if (this.#status === ServiceTreeItemStatus.ACTIVE) {
        return "$(error)";
      } else {
        return "$(plug)";
      }
    }
  }
}
