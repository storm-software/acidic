import { createAcidicConfig } from "@acidic/config";
import { CommandName, getCommandId } from "@acidic/vscode-rpc";
import {
  LOCATE_YOUR_WORKSPACE,
  SupportTreeProvider,
  WorkspaceConfigStore,
  createLogger,
  initServiceTree
} from "@acidic/vscode-state";
import {
  findWorkspaceRootSafe,
  loadStormConfig
} from "@storm-software/config-tools";
import { StormError } from "@storm-stack/errors";
import { StormLog } from "@storm-stack/logging";
import { dirname } from "path";
import {
  ExtensionContext,
  FileSystemWatcher,
  RelativePattern,
  commands,
  window,
  workspace
} from "vscode";
import {
  CancellationStrategy,
  LanguageClient,
  TransportKind
} from "vscode-languageclient/node";
import { ReactPanel } from "./webview/react-panel";

let client: LanguageClient;
let context: ExtensionContext;
let logger: StormLog;

let hasWorkspaceRoot = false;
let workspaceFileWatcher: FileSystemWatcher | undefined;

export async function activate(_context: ExtensionContext) {
  try {
    window.setStatusBarMessage("$(sync~spin) Starting Acidic Workspace");
    commands.executeCommand("setContext", "hasWorkspaceRoot", false);
    commands.executeCommand("setContext", "isWorkspaceLoading", true);

    context = _context;

    context.subscriptions.push(
      commands.registerCommand(
        LOCATE_YOUR_WORKSPACE.command?.command || "",
        async () => manuallySelectWorkspaceDefinition()
      )
    );

    context.subscriptions.push(
      window.createTreeView("acidicWorkspace.views.support", {
        treeDataProvider: new SupportTreeProvider(context)
      })
    );

    const workspaceRoot = findWorkspaceRootSafe(
      workspace.workspaceFolders && workspace.workspaceFolders.length > 0
        ? workspace.workspaceFolders[0]?.uri.fsPath
        : undefined
    );
    if (workspaceRoot) {
      await loadAcidicWorkspace(workspaceRoot);
    } else {
      writeStatusBarMessage("Acidic Workspace is ready");
    }
  } catch (error) {
    const stormError = StormError.create(error);
    window.showErrorMessage(stormError.print());
  }
}

// This function is called when the extension is deactivated.
export function deactivate() {
  if (client) {
    return client.stop();
  }
  return undefined;
}

function writeStatusBarMessage(message: string) {
  window.setStatusBarMessage(message);
  setTimeout(() => {
    window.setStatusBarMessage("");
  }, 3000);
}

async function startLanguageClient(
  context: ExtensionContext,
  workspaceRoot: string
): Promise<LanguageClient> {
  // The debug options for the server
  // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging.
  // By setting `process.env.DEBUG_BREAK` to a truthy value, the language server will wait until a debugger is attached.

  const fileSystemWatcher = workspace.createFileSystemWatcher("**/*.acid");
  context.subscriptions.push(fileSystemWatcher);

  // Create the language client and start the client.
  const client = new LanguageClient(
    "acidic",
    "Acidic Language Server",
    {
      run: {
        module: context.asAbsolutePath("language-server/main.js"),
        transport: TransportKind.ipc
      },
      debug: {
        module: context.asAbsolutePath("language-server/main.js"),
        transport: TransportKind.ipc,
        options: {
          execArgv: [
            "--nolazy",
            `--inspect${process.env.DEBUG_BREAK ? "-brk" : ""}=${
              process.env.DEBUG_SOCKET || "6009"
            }`
          ],
          cwd: workspaceRoot
        }
      }
    },
    {
      documentSelector: [{ scheme: "file", language: "acidic" }],
      synchronize: {
        // Notify the server about file changes to files contained in the workspace
        fileEvents: fileSystemWatcher
      },
      connectionOptions: {
        cancellationStrategy: CancellationStrategy.Message,
        maxRestartCount: 5
      },
      progressOnInitialization: true
    },
    true
  );

  // Start the client. This will also launch the server
  await client.start();
  return client;
}

function manuallySelectWorkspaceDefinition() {
  if (workspace.workspaceFolders && workspace.workspaceFolders.length > 0) {
    return window
      .showOpenDialog({
        canSelectFolders: true,
        canSelectFiles: false,
        canSelectMany: false,
        openLabel: "Select workspace directory"
      })
      .then(value => {
        if (value && value[0]) {
          loadAcidicWorkspace(value[0].fsPath);
        }
      });
  } else {
    window.showInformationMessage(
      "Cannot select a workspace root directory when no folders are opened in the explorer"
    );
  }

  return Promise.resolve();
}

async function loadAcidicWorkspace(workspaceRoot: string) {
  const success = await loadWorkspaceRoot(workspaceRoot);
  if (success) {
    writeStatusBarMessage("Acidic Workspace has loaded");
  } else {
    writeStatusBarMessage("Acidic Workspace failed to load");
  }
}

function handleWorkspaceReady() {
  commands.executeCommand("setContext", "isWorkspaceLoading", false);
  ReactPanel.createOrShow(context, "Acidic Workspace");

  window.showInformationMessage(
    "Acidic Workspace successfully loaded services"
  );
}

async function loadWorkspaceRoot(workspacePath: string): Promise<boolean> {
  try {
    if (
      workspacePath.match(
        /(workspace|angular|nx|project|turbo|storm.config)\.json$/
      )
    ) {
      workspacePath = dirname(workspacePath);
    }

    if (process.platform == "win32") {
      workspacePath = workspacePath.replace(/\//g, "\\");
    }

    const workspaceRoot = findWorkspaceRootSafe(workspacePath);
    if (workspaceRoot) {
      process.env.STORM_WORKSPACE_ROOT = workspaceRoot;

      hasWorkspaceRoot = true;
      commands.executeCommand("setContext", "hasWorkspaceRoot", true);

      await loadStormConfig(workspaceRoot);
      const config = createAcidicConfig(workspaceRoot);
      logger = createLogger(config);

      WorkspaceConfigStore.fromContext(context, logger);
      WorkspaceConfigStore.instance.setWorkspaceRoot(workspaceRoot);

      client = await startLanguageClient(context, workspaceRoot);

      context.subscriptions.push(
        commands.registerCommand(
          getCommandId(CommandName.ON_WORKSPACE_READY),
          handleWorkspaceReady
        )
      );

      initServiceTree(context, config, logger, handleWorkspaceReady);
      if (workspaceFileWatcher) {
        workspaceFileWatcher.dispose();
      }

      const fileWatcher = workspace.createFileSystemWatcher(
        new RelativePattern(
          workspaceRoot,
          "{workspace,angular,nx,project,turbo,storm.config}.json"
        )
      );
      context.subscriptions.push(
        fileWatcher.onDidChange(() => {
          if (!hasWorkspaceRoot) {
            setTimeout(() => {
              loadWorkspaceRoot(workspaceRoot);
            }, 2500);
          }
        })
      );

      if (workspaceRoot !== workspacePath) {
        window.showWarningMessage(
          `Acidic Workspace could not use "${workspacePath}" as a workspace root directory; however, parent folder "${workspaceRoot}" was successfully use to initialize.`
        );
      }

      return true;
    } else {
      window.showErrorMessage(`Unable to load workspace from ${workspacePath}`);
    }
  } catch (error) {
    console.error(error);
    window.showErrorMessage(
      `Error occured while loading workspace from ${workspacePath} \n${StormError.create(
        error
      )}`
    );

    if (logger) {
      logger.error(error);
    }
  }

  return false;
}
