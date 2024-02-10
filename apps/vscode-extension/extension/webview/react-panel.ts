import {
  type Disposable,
  type ExtensionContext,
  Uri,
  ViewColumn,
  type WebviewPanel,
  window
} from "vscode";
import { getUri } from "./get-uri";
import type { StormTrace } from "@storm-stack/telemetry";
import { createAcidicStore, type AcidicStore } from "@acidic/engine";
import { stringifyService, type AcidicConfig } from "@acidic/definition";

/**
 * Manages react webview panels
 */
export class ReactPanel {
  /**
   * Track the currently panel. Only allow a single panel to exist at a time.
   */
  public static currentPanel: ReactPanel | undefined;
  private static readonly viewType = "react";

  #context: ExtensionContext;
  #panel: WebviewPanel;
  #extensionPath: string;
  #disposables: Disposable[] = [];

  #config: AcidicConfig;
  #logger: StormTrace;
  #store!: AcidicStore;
  #unsubscribe!: () => void;

  public static async createOrShow(
    context: ExtensionContext,
    config: AcidicConfig,
    logger: StormTrace,
    title: string
  ) {
    const column = window.activeTextEditor ? window.activeTextEditor.viewColumn : undefined;

    if (ReactPanel.currentPanel) {
      ReactPanel.currentPanel.#panel.reveal(column);
    } else {
      ReactPanel.currentPanel = new ReactPanel(
        context,
        config,
        logger,
        title,
        column || { viewColumn: ViewColumn.Active, preserveFocus: false }
      );
      await ReactPanel.currentPanel.setup();
      await ReactPanel.currentPanel.sync();
    }
  }

  private constructor(
    context: ExtensionContext,
    config: AcidicConfig,
    logger: StormTrace,
    title: string,
    column:
      | ViewColumn
      | {
          viewColumn: ViewColumn;
          preserveFocus?: boolean | undefined;
        }
  ) {
    this.#context = context;
    this.#config = config;
    this.#logger = logger;
    this.#extensionPath = this.#context.extensionPath;

    this.#panel = window.createWebviewPanel(ReactPanel.viewType, title, column, {
      // Enable javascript in the webview
      enableScripts: true,
      enableCommandUris: true,
      retainContextWhenHidden: true,
      localResourceRoots: [Uri.file(this.#extensionPath)]
    });

    this.#panel.webview.html = this.getHtmlForWebview();
    this.#panel.iconPath = {
      light: getUri(this.#panel.webview, this.#extensionPath, "assets/logos/test-tube.png"),
      dark: getUri(this.#panel.webview, this.#extensionPath, "assets/logos/test-tube.png")
    };

    this.#panel.onDidDispose(() => this.dispose(), null, this.#disposables);
    this.#panel.webview.onDidReceiveMessage(
      (message) => {
        switch (message.command) {
          case "startup":
            console.log("message received");
            break;
          case "alert":
            window.showErrorMessage(message.text);
            return;
        }
      },
      null,
      this.#disposables
    );
  }

  public async sync() {
    const services = await this.#store.getServices();
    this.#logger.info(`Syncing client with ${services.length} services`);

    this.#panel.webview.postMessage({
      command: "updateServices",
      data: {
        services: services
          .filter((service) => !!service?.definition)
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          .map((service) => stringifyService(service.definition!))
      }
    });
  }

  public dispose() {
    ReactPanel.currentPanel = undefined;
    this.#unsubscribe();
    this.#panel.dispose();

    while (this.#disposables.length) {
      const disposable = this.#disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }

  private async setup() {
    this.#store = await createAcidicStore(this.#config, this.#logger);
    this.#unsubscribe = this.#store.subscribe(
      async (args: {
        key: string;
        store: string;
        value: any;
      }) => {
        this.#logger.info(`Store updated: ${args.key}`);
        if (args.key.includes("service")) {
          await this.sync();
        }
      }
    );
  }

  private getHtmlForWebview() {
    const nonce = getNonce();

    /*const scriptUri = webview.asWebviewUri(
			Uri.joinPath(this.extensionPath, "script", "left-webview-provider.js")
		);
		const constantUri = webview.asWebviewUri(
			Uri.joinPath(this.extensionPath, "script", "constant.js")
		);*/

    const htmlResult = `<!doctype html>
			<html lang="en">
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
				<meta name="theme-color" content="#000000">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src vscode-resource: https:; script-src 'nonce-${nonce}';style-src vscode-resource: 'unsafe-inline' http: https: data:;">
        <title>Acidic Workspace</title>
        <link rel="icon" href={${getUri(
          this.#panel.webview,
          this.#extensionPath,
          "assets/logos/test-tube.png"
        )} />

				<link rel="stylesheet" type="text/css" href="${getUri(
          this.#panel.webview,
          this.#extensionPath,
          "client/main.css"
        )}">

			</head>

			<body className="w-full h-full min-h-[300px]">
				<noscript>You need to enable JavaScript to run this extension.</noscript>
        <div id="root"></div>

				<script nonce="${nonce}" src="${getUri(
          this.#panel.webview,
          this.#extensionPath,
          "client/main.js"
        )}"></script>
			</body>
			</html>`;

    return htmlResult;
  }

  /*private loadingSpinner() {
    return html`
      <style>
        .lds-roller {
          display: inline-block;
          position: relative;
          width: 80px;
          height: 80px;
        }

        .lds-roller div {
          animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
          transform-origin: 40px 40px;
        }

        .lds-roller div:after {
          content: " ";
          display: block;
          position: absolute;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--vscode-editor-foreground);
          margin: -4px 0 0 -4px;
        }

        .lds-roller div:nth-child(1) {
          animation-delay: -0.036s;
        }

        .lds-roller div:nth-child(1):after {
          top: 63px;
          left: 63px;
        }

        .lds-roller div:nth-child(2) {
          animation-delay: -0.072s;
        }

        .lds-roller div:nth-child(2):after {
          top: 68px;
          left: 56px;
        }

        .lds-roller div:nth-child(3) {
          animation-delay: -0.108s;
        }

        .lds-roller div:nth-child(3):after {
          top: 71px;
          left: 48px;
        }

        .lds-roller div:nth-child(4) {
          animation-delay: -0.144s;
        }

        .lds-roller div:nth-child(4):after {
          top: 72px;
          left: 40px;
        }

        .lds-roller div:nth-child(5) {
          animation-delay: -0.18s;
        }

        .lds-roller div:nth-child(5):after {
          top: 71px;
          left: 32px;
        }

        .lds-roller div:nth-child(6) {
          animation-delay: -0.216s;
        }

        .lds-roller div:nth-child(6):after {
          top: 68px;
          left: 24px;
        }

        .lds-roller div:nth-child(7) {
          animation-delay: -0.252s;
        }

        .lds-roller div:nth-child(7):after {
          top: 63px;
          left: 17px;
        }

        .lds-roller div:nth-child(8) {
          animation-delay: -0.288s;
        }

        .lds-roller div:nth-child(8):after {
          top: 56px;
          left: 12px;
        }

        @keyframes lds-roller {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        main {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
        }
      </style>
      <main>
        <div class="lds-roller">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </main>
    `;
  }*/
}

function getNonce() {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
