import { createAcidicConfig } from "@acidic/config";
import {
  CommandName,
  LOCATE_YOUR_WORKSPACE,
  ServiceTreeProvider,
  SupportTreeProvider,
  WorkspaceConfigStore,
  getCommandId
} from "@acidic/vscode-state";
import {
  findWorkspaceRootSafe,
  loadStormConfig
} from "@storm-software/config-tools";
import { getCauseFromUnknown } from "@storm-stack/errors";
import { StormLog } from "@storm-stack/logging";
import { dirname } from "path";
import {
  ExtensionContext,
  FileSystemWatcher,
  RelativePattern,
  WebviewPanel,
  commands,
  window,
  workspace
} from "vscode";
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind
} from "vscode-languageclient/node";
import { ReactPanel } from "./webview/react-panel";

let client: LanguageClient;
let context: ExtensionContext;
let logger: StormLog;

let hasWorkspaceRoot = false;
let workspaceFileWatcher: FileSystemWatcher | undefined;

export function activate(_context: ExtensionContext) {
  try {
    window.setStatusBarMessage("Starting Acidic Workspace");
    commands.executeCommand("setContext", "hasWorkspaceRoot", false);

    context = _context;

    context.subscriptions.push(
      commands.registerCommand(
        LOCATE_YOUR_WORKSPACE.command?.command || "",
        () => manuallySelectWorkspaceDefinition()
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
      loadAcidicWorkspace(workspaceRoot);
    } else {
      writeStatusBarMessage("Acidic Workspace is ready");
    }
  } catch (error) {
    const stormError = getCauseFromUnknown(error);
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

function startLanguageClient(context: ExtensionContext): LanguageClient {
  const serverModule = context.asAbsolutePath("langauge-server/main.js");

  // The debug options for the server
  // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging.
  // By setting `process.env.DEBUG_BREAK` to a truthy value, the language server will wait until a debugger is attached.
  const debugOptions = {
    execArgv: [
      "--nolazy",
      `--inspect${process.env.DEBUG_BREAK ? "-brk" : ""}=${
        process.env.DEBUG_SOCKET || "6009"
      }`
    ]
  };

  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: debugOptions
    }
  };

  const fileSystemWatcher = workspace.createFileSystemWatcher(
    "**/{*.acid,*.acidic}"
  );
  context.subscriptions.push(fileSystemWatcher);

  // Options to control the language client
  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: "file", language: "acidic" }],
    synchronize: {
      // Notify the server about file changes to files contained in the workspace
      fileEvents: fileSystemWatcher
    }
  };

  // Create the language client and start the client.
  const client = new LanguageClient(
    "AcidicLanguageClient",
    "Acidic Language Client",
    serverOptions,
    clientOptions
  );

  // Start the client. This will also launch the server
  client.start();
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

      await loadStormConfig(workspaceRoot);
      const config = createAcidicConfig(workspaceRoot);
      // logger = createLogger(config);

      WorkspaceConfigStore.fromContext(context, logger);
      WorkspaceConfigStore.instance.setWorkspaceRoot(workspaceRoot);

      client = startLanguageClient(context);

      const serviceExplorerProvider = new ServiceTreeProvider(workspaceRoot);
      window.registerTreeDataProvider(
        "acidicWorkspace.views.services",
        serviceExplorerProvider
      );
      commands.registerCommand(
        getCommandId(CommandName.REFRESH_SCHEMA_START),
        () => serviceExplorerProvider.refresh()
      );

      let panel: WebviewPanel | undefined = undefined;
      context.subscriptions.push(
        commands.registerCommand(
          getCommandId(CommandName.OPEN_SCHEMA_EXPLORER),
          () => {
            ReactPanel.createOrShow({ ...context, logger }, "Acidic Workspace");
          }
        )
      );

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

      if (workspaceRoot === workspacePath) {
        window.showInformationMessage(
          `Acidic Workspace successfully initialized from ${workspaceRoot}`
        );
      } else {
        window.showWarningMessage(
          `Acidic Workspace could not use "${workspacePath}" as a workspace root directory; however, parent folder "${workspaceRoot}" was successfully use to initialize.`
        );
      }

      return true;
    } else {
      window.showErrorMessage(`Unable to load workspace from ${workspacePath}`);
    }

    commands.executeCommand("setContext", "hasWorkspaceRoot", hasWorkspaceRoot);
  } catch (error) {
    console.error(error);
    window.showErrorMessage(
      `Error occured while loading workspace from ${workspacePath}`
    );

    if (logger) {
      logger.error(error);
    }
  }

  return false;
}
