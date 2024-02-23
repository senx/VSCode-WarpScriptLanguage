import { Disposable, Webview, WebviewPanel, window, Uri, ViewColumn, ExtensionContext, workspace, env } from "vscode";
import WarpScriptExtConstants from "../constants";
import { join } from "path";
import GTSPreviewWebview from "./gtsPreview";

export class TracePluginInfo {
  public static currentPanel: TracePluginInfo | undefined;
  private readonly _panel: WebviewPanel;
  private _disposables: Disposable[] = [];

  private context: ExtensionContext;

  private constructor(panel: WebviewPanel, extensionUri: Uri, context: ExtensionContext) {
    this._panel = panel;
    this.context = context;
    // Set an event listener to listen for when the panel is disposed (i.e. when the user closes
    // the panel or when the panel is closed programmatically)
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // Set the HTML content for the webview panel
    this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri);
  }

  public static render(context: ExtensionContext) {
    if (TracePluginInfo.currentPanel) {
      // If the webview panel already exists reveal it
      TracePluginInfo.currentPanel._panel.reveal(ViewColumn.One);
    } else {
      // If a webview panel does not already exist create and show a new one
      const panel = window.createWebviewPanel(
        // Panel view type
        "TracePluginInfo",
        // Panel title
        "Trace Plugin",
        // The editor column the panel should be displayed in
        ViewColumn.One,
        // Extra panel configurations
        {
          // Enable JavaScript in the webview
          enableScripts: true,
          // Restrict the webview to only load resources from the `out` directory
          localResourceRoots: [Uri.joinPath(context.extensionUri, "out")],
        }
      );
      panel.webview.onDidReceiveMessage(
        message => {
          if(message.link) {
            env.openExternal(Uri.parse(message.link));
          }
        },
        undefined,
        context.subscriptions
      );

      TracePluginInfo.currentPanel = new TracePluginInfo(panel, context.extensionUri, context);
    }
  }

  /**
   * Cleans up and disposes of webview resources when the webview panel is closed.
   */
  public dispose() {
    TracePluginInfo.currentPanel = undefined;
    // Dispose of the current webview panel
    this._panel.dispose();
    // Dispose of all disposables (i.e. commands) associated with the current webview panel
    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }

  private getUri(webview: Webview, extensionUri: Uri, pathList: string[]) {
    return webview.asWebviewUri(Uri.joinPath(extensionUri, ...pathList));
  }

  private _getWebviewContent(webview: Webview, extensionUri: Uri) {
    let theme = workspace.getConfiguration().get('warpscript.theme');
    if (theme == "auto") {
      let vscodetheme: string = workspace.getConfiguration().get("workbench.colorTheme");
      if (GTSPreviewWebview.LightThemesList.indexOf(vscodetheme) > -1) {
        theme = "light";
      }
      else { theme = "dark"; }
    }

    const webviewUri = this.getUri(webview, extensionUri, ["out", 'static', "tracePluginInfo.js"]);
    const codiconUri: string = WarpScriptExtConstants.getRessource(this.context, join('out', 'static', 'codicon.css'), this._panel);
    const LogoPath: string = theme === 'light' 
    ? WarpScriptExtConstants.getRessource(this.context, join('out', 'images', 'senx_header_dark.png'), this._panel)
    : WarpScriptExtConstants.getRessource(this.context, join('out', 'images', 'senx_header_light.png'), this._panel);
    const cssUri = this.getUri(webview, extensionUri, ["out", 'static', "style.css"]);
    
    return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="stylesheet" href="${codiconUri}">
          <link rel="stylesheet" href="${cssUri}">
          <title>Trace Plugin</title>
        </head>
        <body>
        <header class="navbar">
            <section class="navbar-section">
                <img src="${LogoPath}" class="logo">
            </section>
            <section class="navbar-section">
              <a href="https://senx.io" target="_blank">SenX</a>
              <a href="https://www.warp10.io" target="_blank">Warp 10</a>
            </section>
        </header>
          <h1>The Warp 10 Trace Plugin</h1>
          <vscode-divider></vscode-divider>
          <p>The Warp 10 Trace Plugin is a commercial plugin that aims to trace code execution.</p>
          <p>Thanks to that plugin, you will be able to:</p>
          <ul style="margin-bottom: 1.2em;">
            <li>Debug <ul class="checks">
              <li>Add breakpoints</li>
              <li>Navigate to nex breakpoint</li>
              <li>Navigate step by step</li>
              <li>Explore variables values</li>
              <li>See the stack state during execution</li>
              </ul></li>
            <li>Profile <ul class="checks">
              <li>See time spend per function/macro</li>
              <li>Discover iteration counts</li>
            </ul></li>
          </ul>
          <vscode-divider style="margin-bottom: 1.2em;"></vscode-divider>
          <vscode-button appearance="primary" id="contact">Contact sales</vscode-button>
          <script>var exports = {"__esModule": true};</script>
          <script type="module" src="${webviewUri}"></script>
        </body>
      </html>
    `;
  }
}