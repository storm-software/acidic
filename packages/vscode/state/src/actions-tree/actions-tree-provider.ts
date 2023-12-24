import { TreeItem } from "vscode";

const SCANNING_FOR_WORKSPACE = new TreeItem(
  "Scanning for your Nx Workspace..."
);
export const LOCATE_YOUR_WORKSPACE = new TreeItem("Select workspace");
LOCATE_YOUR_WORKSPACE.command = {
  tooltip: "Select an workspace directory to open",
  title: "Select workspace",
  command: "acidicWorkspace.selectWorkspaceManually"
};
export const CHANGE_WORKSPACE = new TreeItem("Change workspace");
CHANGE_WORKSPACE.command = {
  tooltip: "Select an workspace json file to open",
  title: "Change workspace",
  command: "acidicWorkspace.selectWorkspaceManually"
};

/*export class SetupTreeProvider extends implements TreeDataProvider<SetupTreeItem> {
  private extensionPath: string;


  constructor(readonly context: ExtensionContext) {
    const extensionPath = context.extensionPath;
    this.extensionPath = extensionPath;
    LOCATE_YOUR_WORKSPACE.iconPath = {
      light: join(extensionPath, "assets", "nx-console-light.svg"),
      dark: join(extensionPath, "assets", "nx-console-dark.svg")
    };
    CHANGE_WORKSPACE.iconPath = {
      light: join(extensionPath, "assets", "nx-console-light.svg"),
      dark: join(extensionPath, "assets", "nx-console-dark.svg")
    };
    onWorkspaceRefreshed(() => this.refresh());
  }

  onDidChangeTreeData?: Event<any> | undefined;
  getTreeItem(element: SetupTreeItem): TreeItem | Thenable<TreeItem> {
    throw new Error("Method not implemented.");
  }

  getParent() {
    return null;
  }

  async getChildren() {
    let workspacePath = null;
    try {
      workspacePath = (await getNxWorkspace()).workspacePath;
    } catch (error) {
      getOutputChannel().appendLine(
        `Unable to load workspace path: ${getCauseFromUnknown(error).stack}`
      );
      return [LOCATE_YOUR_WORKSPACE];
    }

    CHANGE_WORKSPACE.description = "Current: " + workspacePath;

    return [
      CHANGE_WORKSPACE
    ];
  }
}
*/
