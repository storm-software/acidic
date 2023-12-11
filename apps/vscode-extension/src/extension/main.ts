import { createStormConfig } from "@storm-software/config-tools";
import { getCauseFromUnknown } from "@storm-stack/errors";
import { StormLog } from "@storm-stack/logging";
import * as path from "path";
import { ExtensionContext, WebviewPanel, window, workspace } from "vscode";
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind
} from "vscode-languageclient/node";
import { ConfigurationStore } from "../config/configuration-store";
import { getOutputChannel } from "../config/logger";

let client: LanguageClient;

// This function is called when the extension is activated.
export function activate(context: ExtensionContext): void {
  const stormConfig = createStormConfig();
  const logger = StormLog.create(stormConfig, "Acidic Engine");

  try {
    let panel: WebviewPanel | undefined = undefined;

    //const notepadDataProvider = new NotepadDataProvider(notes);

    ConfigurationStore.fromContext(context, logger);

    // Create a tree view to contain the list of schema notes
    const treeView = window.createTreeView("acidicWorkspace.schemaList", {
      treeDataProvider: {} as any,
      showCollapseAll: false
    });

    // Command to render a webview-based note view
    /*const openNote = commands.registerCommand(
      "acidicWorkspace.showNoteDetailView",
      () => {
        const selectedTreeViewItem = treeView.selection[0];
        const matchingNote = notes.find(
          note => note.id === selectedTreeViewItem.id
        );
        if (!matchingNote) {
          window.showErrorMessage("No matching note found");
          return;
        }

        // If no panel is open, create a new one and update the HTML
        if (!panel) {
          panel = window.createWebviewPanel(
            "noteDetailView",
            matchingNote.title,
            ViewColumn.One,
            {
              // Enable JavaScript in the webview
              enableScripts: true,
              // Restrict the webview to only load resources from the `out` directory
              localResourceRoots: [Uri.joinPath(context.extensionUri, "out")]
            }
          );
        }

        // If a panel is open, update the HTML with the selected item's content
        panel.title = matchingNote.title;
        panel.webview.html = getWebviewContent(
          panel.webview,
          context.extensionUri,
          matchingNote
        );

        // If a panel is open and receives an update message, update the notes array and the panel title/html
        panel.webview.onDidReceiveMessage(message => {
          const command = message.command;
          const note = message.note;
          switch (command) {
            case "updateNote":
              const updatedNoteId = note.id;
              const copyOfNotesArray = [...notes];
              const matchingNoteIndex = copyOfNotesArray.findIndex(
                note => note.id === updatedNoteId
              );
              copyOfNotesArray[matchingNoteIndex] = note;
              notes = copyOfNotesArray;
              notepadDataProvider.refresh(notes);
              panel
                ? ((panel.title = note.title),
                  (panel.webview.html = getWebviewContent(
                    panel.webview,
                    context.extensionUri,
                    note
                  )))
                : null;
              break;
          }
        });

        panel.onDidDispose(
          () => {
            // When the panel is closed, cancel any future updates to the webview content
            panel = undefined;
          },
          null,
          context.subscriptions
        );
      }
    );*/

    client = startLanguageClient(context);
  } catch (error) {
    logger.error(error);

    window.showErrorMessage(
      "Acidic Engine encountered an error when activating (see output panel)"
    );
    getOutputChannel().appendLine(
      "Acidic Engine encountered an error when activating"
    );
    getOutputChannel().appendLine(getCauseFromUnknown(error).stack);
  }
}

// This function is called when the extension is deactivated.
export function deactivate(): Thenable<void> | undefined {
  if (client) {
    return client.stop();
  }
  return undefined;
}

function startLanguageClient(context: ExtensionContext): LanguageClient {
  const serverModule = context.asAbsolutePath(
    path.join("out", "language", "main")
  );
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
