import { joinPaths } from "@storm-stack/file-system";
import { TreeItem, TreeItemCollapsibleState, TreeView, Uri } from "vscode";

const LIGHT_SVG_URL = "cli-light.svg";
const DARK_SVG_URL = "cli-dark.svg";

export enum GeneratorType {
  Application = "application",
  Library = "library",
  Other = "other"
}

export class RunTargetTreeItem extends TreeItem {
  revealWorkspaceRoute(currentWorkspace: TreeView<RunTargetTreeItem>) {
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
    readonly generatorType?: GeneratorType,
    readonly generator?: string
  ) {
    super(commandString, TreeItemCollapsibleState.None);
    this.iconPath = RunTargetTreeItem.getIconUri(this.extensionPath);
    this.command = {
      title: commandString,
      command:
        commandString === "generate"
          ? "acidic.revealWebViewPanel"
          : "acidic.run",
      tooltip: "",
      arguments:
        commandString === "generate"
          ? [this]
          : commandString === "run"
            ? []
            : ["", this.commandString]
    };

    if (commandString === "generate" || commandString === "run") {
      this.contextValue = "acidicCommand";
    } else {
      this.contextValue = "runTarget";
    }
  }

  static getIconUri(
    extensionPath: string
  ): { light: Uri; dark: Uri } | undefined {
    return {
      light: Uri.file(joinPaths(extensionPath, "assets", LIGHT_SVG_URL)),
      dark: Uri.file(joinPaths(extensionPath, "assets", DARK_SVG_URL))
    };
  }
}
