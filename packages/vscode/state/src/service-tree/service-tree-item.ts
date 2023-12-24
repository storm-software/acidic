import { titleCase } from "@storm-stack/utilities";
import { TreeItem, TreeItemCollapsibleState, Uri } from "vscode";
import { ServiceTreeItemStatus, ServiceTreeItemType } from "../types";

export class ServiceTreeItem extends TreeItem {
  #name: string;
  #type: ServiceTreeItemType;
  #status: ServiceTreeItemStatus;

  public constructor(
    public override resourceUri: Uri,
    name: string,
    type: ServiceTreeItemType,
    status: ServiceTreeItemStatus = ServiceTreeItemStatus.LOADING
  ) {
    super(titleCase(name)!, TreeItemCollapsibleState.Collapsed);

    this.#name = name;
    this.#type = type;
    this.#status = status;

    this.id = name;
    this.contextValue = `${this.#type}_${this.#status}`;

    this.iconPath = this.getIconPath();
    this.label = titleCase(this.#name);
    this.tooltip = `${this.label} ${
      this.#type === ServiceTreeItemType.SCHEMA ? "Schema" : "Plugin"
    }`;
    this.description = `${this.label} ${
      this.#type === ServiceTreeItemType.SCHEMA ? "Schema" : "Plugin"
    }`;
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

    if (this.#type === ServiceTreeItemType.SCHEMA) {
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
