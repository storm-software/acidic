import { join } from "path";
import { TreeItem, TreeItemCollapsibleState, TreeView, Uri } from "vscode";

export class ActionsTreeItem extends TreeItem {
  revealWorkspaceRoute(currentWorkspace: TreeView<ActionsTreeItem>) {
    (currentWorkspace.visible
      ? currentWorkspace.reveal(this, {
          select: true,
          focus: true
        })
      : Promise.reject()
    ).then(
      () => {
        // empty
      },
      () => {
        // empty
      }
    ); // Explicitly handle rejection
  }

  constructor(
    readonly commandString: string,
    readonly extensionPath: string,
    readonly generatorType?: any,
    readonly generator?: string
  ) {
    super(commandString, TreeItemCollapsibleState.None);
    this.iconPath = ActionsTreeItem.getIconUri(this.extensionPath);
    this.command = {
      title: commandString,
      command:
        commandString === "generate"
          ? "nxConsole.revealWebViewPanel"
          : "nx.run",
      tooltip: "",
      arguments:
        commandString === "generate"
          ? [this]
          : commandString === "run"
            ? []
            : ["", this.commandString]
    };

    if (commandString === "generate" || commandString === "run") {
      this.contextValue = "nxCommand";
    } else {
      this.contextValue = "runTarget";
    }
  }

  static getIconUri(
    extensionPath: string
  ): { light: Uri; dark: Uri } | undefined {
    return {
      light: Uri.file(join(extensionPath, "assets", "./vscode/test-tube.svg")),
      dark: Uri.file(join(extensionPath, "assets", "./vscode/test-tube.svg"))
    };
  }
}
