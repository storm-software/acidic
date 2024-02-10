import type { AcidicConfig } from "@acidic/definition";
import { createAcidicConfig } from "@acidic/engine";
import { CommandId, getCommandId } from "@acidic/messages";
import {
  LOCATE_YOUR_WORKSPACE,
  SupportTreeProvider,
  WorkspaceConfigStore,
  createLogger,
  initServiceTree
} from "@acidic/vscode-state";
import { findWorkspaceRootSafe } from "@storm-software/config-tools";
import { StormError } from "@storm-stack/errors";
import type { StormTrace } from "@storm-stack/telemetry";
import { dirname } from "node:path";
import { type ExtensionContext, RelativePattern, commands, window, workspace } from "vscode";
import type { LanguageClient } from "vscode-languageclient/node";
import { ReactPanel } from "./webview/react-panel";

let client: LanguageClient;
let context: ExtensionContext;
let logger: StormTrace;

let hasWorkspaceRoot = false;
// let fileSystemWatcher: FileSystemWatcher | undefined;

export async function activate(_context: ExtensionContext) {
  try {
    window.setStatusBarMessage("$(sync~spin) Starting Acidic Workspace");
    commands.executeCommand("setContext", "hasWorkspaceRoot", false);
    commands.executeCommand("setContext", "isWorkspaceLoading", true);

    context = _context;

    context.subscriptions.push(
      commands.registerCommand(LOCATE_YOUR_WORKSPACE.command?.command || "", async () =>
        manuallySelectWorkspaceDefinition()
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

// async function startLanguageClient(
//   context: ExtensionContext,
//   logger: StormLog
// ): Promise<LanguageClient> {
//   // The debug options for the server
//   // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging.
//   // By setting `process.env.DEBUG_BREAK` to a truthy value, the language server will wait until a debugger is attached.

//   fileSystemWatcher = workspace.createFileSystemWatcher("**/{*.acid,*.acidic}");
//   context.subscriptions.push(fileSystemWatcher);

//   logger.info(
//     `*** Server path: ${context.asAbsolutePath(joinPaths("language-server", "main.js"))}`
//   );

//   // Create the language client and start the client.
//   const client = new LanguageClient(
//     "acidic",
//     "Acidic Language Server",
//     {
//       run: {
//         module: context.asAbsolutePath(joinPaths("language-server", "main.js")),
//         transport: TransportKind.ipc
//       },
//       debug: {
//         module: context.asAbsolutePath(joinPaths("language-server", "main.js")),
//         transport: TransportKind.ipc,
//         options: {
//           execArgv: [
//             "--nolazy",
//             `--inspect${process.env.DEBUG_BREAK ? "-brk" : ""}=${
//               process.env.DEBUG_SOCKET || "6009"
//             }`
//           ]
//         }
//       }
//     },
//     {
//       documentSelector: [{ scheme: "file", language: "acidic" }],
//       synchronize: {
//         // Notify the server about file changes to files contained in the workspace
//         fileEvents: fileSystemWatcher
//       },
//       connectionOptions: {
//         cancellationStrategy: CancellationStrategy.Message,
//         maxRestartCount: 5
//       }
//     }
//   );

//   // Start the client. This will also launch the server
//   await client.start();

//   logger.info("Started the Acidic Langauge Server");

//   return client;
// }

function manuallySelectWorkspaceDefinition() {
  if (workspace.workspaceFolders && workspace.workspaceFolders.length > 0) {
    return window
      .showOpenDialog({
        canSelectFolders: true,
        canSelectFiles: false,
        canSelectMany: false,
        openLabel: "Select workspace directory"
      })
      .then((value) => {
        if (value?.[0]) {
          loadAcidicWorkspace(value[0].fsPath);
        }
      });
  }

  window.showInformationMessage(
    "Cannot select a workspace root directory when no folders are opened in the explorer"
  );

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

async function handleWorkspaceReady(config: AcidicConfig, logger: StormTrace) {
  commands.executeCommand("setContext", "isWorkspaceLoading", false);
  await ReactPanel.createOrShow(context, config, logger, "Acidic Workspace");

  window.showInformationMessage("Acidic Workspace successfully loaded services");
}

async function loadWorkspaceRoot(_workspacePath: string): Promise<boolean> {
  let workspacePath = _workspacePath;
  try {
    if (workspacePath.match(/(workspace|angular|nx|project|turbo|storm.config)\.json$/)) {
      workspacePath = dirname(workspacePath);
    }

    if (process.platform === "win32") {
      workspacePath = workspacePath.replace(/\//g, "\\");
    }

    const workspaceRoot = findWorkspaceRootSafe(workspacePath);
    if (workspaceRoot) {
      process.env.STORM_WORKSPACE_ROOT = workspaceRoot;

      hasWorkspaceRoot = true;
      commands.executeCommand("setContext", "hasWorkspaceRoot", true);

      const config = await createAcidicConfig(workspaceRoot);
      logger = createLogger(config);

      WorkspaceConfigStore.fromContext(context, logger);
      WorkspaceConfigStore.instance.workspaceRoot = workspaceRoot;

      logger.info(`Starting Acidic Language Service from directory: ${workspaceRoot}`);
      // client = await startLanguageClient(context, logger);

      context.subscriptions.push(
        commands.registerCommand(getCommandId(CommandId.ON_WORKSPACE_READY), handleWorkspaceReady)
      );

      await initServiceTree(context, config, logger, () => handleWorkspaceReady(config, logger));

      const fileWatcher = workspace.createFileSystemWatcher(
        new RelativePattern(workspaceRoot, "{workspace,angular,nx,project,turbo,storm.config}.json")
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
    }

    window.showErrorMessage(`Unable to load workspace from ${workspacePath}`);
  } catch (error) {
    console.error(error);
    window.showErrorMessage(
      `Error occured while loading workspace from ${workspacePath} \n${StormError.create(error)}`
    );

    if (logger) {
      logger.error(error);
    }
  }

  return false;
}
