import { join } from "path";
import * as vscode from "vscode";
import { AcidicWorkspaceContext } from "../../client/types";

/**
 * Manages react webview panels
 */
export class ReactPanel {
  /**
   * Track the currently panel. Only allow a single panel to exist at a time.
   */
  public static currentPanel: ReactPanel | undefined;
  private static readonly viewType = "react";

  #context: AcidicWorkspaceContext;
  #panel: vscode.WebviewPanel;
  #extensionPath: string;
  #disposables: vscode.Disposable[] = [];

  public static createOrShow(context: AcidicWorkspaceContext, title: string) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    // If we already have a panel, show it.
    // Otherwise, create a new panel.
    if (ReactPanel.currentPanel) {
      ReactPanel.currentPanel.#panel.reveal(column);
    } else {
      ReactPanel.currentPanel = new ReactPanel(
        context,
        column || vscode.ViewColumn.One,
        title
      );
    }
  }

  private constructor(
    context: AcidicWorkspaceContext,
    column: vscode.ViewColumn,
    title: string
  ) {
    this.#context = context;
    this.#extensionPath = this.#context.extensionPath;

    this.#context.logger.info(`Creating React Panel at ${this.#extensionPath}`);

    // Create and show a new webview panel
    this.#panel = vscode.window.createWebviewPanel(
      ReactPanel.viewType,
      title,
      column,
      {
        // Enable javascript in the webview
        enableScripts: true,

        // And restric the webview to only loading content from our extension's `media` directory.
        localResourceRoots: [vscode.Uri.file(this.#extensionPath)],
        retainContextWhenHidden: true
      }
    );

    // Set the webview's initial html content
    this.#panel.webview.html = this.getHtmlForWebview();

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programatically
    this.#panel.onDidDispose(() => this.dispose(), null, this.#disposables);

    // Handle messages from the webview
    this.#panel.webview.onDidReceiveMessage(
      message => {
        switch (message.command) {
          case "alert":
            vscode.window.showErrorMessage(message.text);
            return;
        }
      },
      null,
      this.#disposables
    );
  }

  public doRefactor() {
    // Send a message to the webview webview.
    // You can send any JSON serializable data.
    this.#panel.webview.postMessage({ command: "refactor" });
  }

  public dispose() {
    ReactPanel.currentPanel = undefined;

    // Clean up our resources
    this.#panel.dispose();

    while (this.#disposables.length) {
      const disposable = this.#disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }

  private getHtmlForWebview() {
    const scriptPathOnDisk = vscode.Uri.file(
      join(this.#extensionPath, "client/main.js")
    );
    const scriptUri = scriptPathOnDisk.with({ scheme: "vscode-resource" });
    const stylePathOnDisk = vscode.Uri.file(
      join(this.#extensionPath, "client/main.css")
    );
    const styleUri = stylePathOnDisk.with({ scheme: "vscode-resource" });

    // Use a nonce to whitelist which scripts can be run
    const nonce = getNonce();

    return `<!doctype html>
			<html lang="en">
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
				<meta name="theme-color" content="${process.env.THEME_PRIMARY_COLOR}">
				<title>Acidic Workspace</title>
				<link rel="stylesheet" type="text/css" href="${styleUri}">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src vscode-resource: https:; script-src 'nonce-${nonce}';style-src vscode-resource: 'unsafe-inline' http: https: data:;">
				<base href="${vscode.Uri.file(this.#extensionPath).with({
          scheme: "vscode-resource"
        })}/">
			</head>

			<body>
				<noscript>You need to enable JavaScript to run this extension.</noscript>
				<div id="root"></div>

				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
  }
}

function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
