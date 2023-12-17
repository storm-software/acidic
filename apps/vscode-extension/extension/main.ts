import { createStormConfig } from "@storm-software/config-tools";
import { getCauseFromUnknown } from "@storm-stack/errors";
import * as vscode from "vscode";
import { ExtensionContext, WebviewPanel, window, workspace } from "vscode";
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind
} from "vscode-languageclient/node";
import { createLogger } from "../src/config/create-logger";
import { ReactPanel } from "../src/webview/react-panel";

let client: LanguageClient;

export function activate(context: vscode.ExtensionContext) {
  window.showInformationMessage("Acidic Engine is preparing to activate");

  const stormConfig = createStormConfig();
  const logger = createLogger(stormConfig);

  try {
    let panel: WebviewPanel | undefined = undefined;
    context.subscriptions.push(
      vscode.commands.registerCommand(
        "acidic-workspace.onStartupFinished",
        () => {
          ReactPanel.createOrShow({ ...context, logger }, "Acidic Workspace");
        }
      )
    );

    client = startLanguageClient(context);
  } catch (error) {
    logger.error(getCauseFromUnknown(error));

    window.showErrorMessage(
      "Acidic Engine encountered an error when activating (see output panel)"
    );
    logger.error(
      `Acidic Engine encountered an error when activating \n\nStack Trace: \n${
        getCauseFromUnknown(error).stack
      }`
    );
  }
}

// This function is called when the extension is deactivated.
export function deactivate() {
  if (client) {
    return client.stop();
  }
  return undefined;
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
