import {
  type ExtensionContext,
  type TreeItem,
  TreeItemCollapsibleState,
  type TreeView,
  type TreeViewExpansionEvent
} from "vscode";
import { WorkspaceConfigStore } from "./workspace-config-store";

export function listenForAndStoreCollapsibleChanges(
  serviceTreeView: TreeView<TreeItem>,
  context: ExtensionContext
) {
  serviceTreeView.onDidCollapseElement(
    (event: TreeViewExpansionEvent<TreeItem>) =>
      TreeItemCollapsibleStore.instance.storeCollapsibleStateChange(
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        event.element.id!,
        TreeItemCollapsibleState.Collapsed
      ),
    context.subscriptions
  );
  serviceTreeView.onDidExpandElement(
    (event: TreeViewExpansionEvent<TreeItem>) =>
      TreeItemCollapsibleStore.instance.storeCollapsibleStateChange(
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        event.element.id!,
        TreeItemCollapsibleState.Expanded
      ),
    context.subscriptions
  );
}

export function getStoredCollapsibleState(treeItemId: string) {
  return TreeItemCollapsibleStore.instance.getStoredCollapsibleState(treeItemId);
}

class TreeItemCollapsibleStore {
  private static _instance: TreeItemCollapsibleStore;
  private workspaceStore: WorkspaceConfigStore;
  private collapsibleMap: Map<string, TreeItemCollapsibleState>;

  static get instance() {
    if (!TreeItemCollapsibleStore._instance) {
      TreeItemCollapsibleStore._instance = new TreeItemCollapsibleStore();
    }
    return TreeItemCollapsibleStore._instance;
  }

  constructor() {
    this.workspaceStore = WorkspaceConfigStore.instance;
    this.collapsibleMap = this.readAndDeserializeCollapsibleMap();
  }

  getStoredCollapsibleState(treeItemId: string): TreeItemCollapsibleState | undefined {
    return this.collapsibleMap.get(treeItemId);
  }

  storeCollapsibleStateChange(treeItemId: string, targetState: TreeItemCollapsibleState) {
    if (targetState === TreeItemCollapsibleState.Collapsed) {
      this.collapsibleMap.delete(treeItemId);
    } else {
      this.collapsibleMap.set(treeItemId, targetState);
    }
    this.serializeAndStoreCollapsibleMap();
  }

  private serializeAndStoreCollapsibleMap() {
    const serializedMap = JSON.stringify(Array.from(this.collapsibleMap.entries()));
    this.workspaceStore.set("projectsViewCollapsibleState", serializedMap);
  }

  private readAndDeserializeCollapsibleMap(): Map<string, TreeItemCollapsibleState> {
    const serializedMap = this.workspaceStore.get("projectsViewCollapsibleState", "[]");
    const deserializedMap = new Map<string, TreeItemCollapsibleState>(JSON.parse(serializedMap));

    return deserializedMap;
  }
}
