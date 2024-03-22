import { Disposable, Webview, WebviewPanel, window, Uri, ViewColumn, ExtensionContext, workspace, env, commands } from "vscode";
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
          if (message.link) {
            env.openExternal(Uri.parse(message.link));
          }
          if (message.action === 'settings') {
            commands.executeCommand('workbench.action.openSettings', 'WarpScript');
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
      let vscodetheme: string = workspace.getConfiguration().get("workbench.colorTheme") ?? 'light';
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
    const spectreUri = this.getUri(webview, extensionUri, ["out", 'static', "spectre.css"]);

    return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="stylesheet" href="${codiconUri}">
          <link rel="stylesheet" href="${spectreUri}">
          <link rel="stylesheet" href="${cssUri}">
          <title>Trace Plugin</title>
        </head>
        <body class="theme-${theme}">
        <header class="navbar">
            <section class="navbar-section">
                <img src="${LogoPath}" class="logo">
            </section>
            <section class="navbar-section">
              <a href="https://senx.io" target="_blank">SenX</a>
              <a href="https://www.warp10.io" target="_blank">Warp 10</a>
            </section>
        </header>
        <div class="container">
          <h1>The Warp 10 TracePlugin</h1>
          <h2>Trace Your Path to Impeccable Code</h2>
          <vscode-divider></vscode-divider>
          <p>Explore new frontiers in debugging and profiling with TracePlugin, your ultimate ally for understanding, optimizing, and perfecting your code. TracePlugin combines advanced features of breakpoint positioning, variable monitoring, step-by-step debugging, call stack analysis, and profiling to provide you with an unparalleled development experience.</p>
          <h3>Key Features:</h3>
          <ul style="margin-bottom: 1.2em;">
            <li><b>Smart Breakpoints</b>: Place breakpoints precisely where you need them, for total immersion in your code during debugging</li>
            <li><b>Dynamic Variable Monitoring</b>: Get real-time data on variable states, enabling an in-depth understanding of your code's behavior during execution.</li>
            <li><b>Intuitive Step-by-Step</b>: Navigate through your code seamlessly, inspecting each line for quick error detection and optimization zones.</li>
            <li><b>Call Stack Analysis</b>: Visualize the hierarchy of running functions, understand relationships, and identify potential failure points.</li>
            <li><b>Powerful Profiling</b>: Measure your code's performance, pinpoint bottlenecks, and optimize your application for outstanding results.</li>
          </ul>

          <h3>Why Choose TracePlugin?</h3>
          <ul style="margin-bottom: 1.2em;">
            <li><b>In-Depth Code Understanding</b>: Explore your code in detail with advanced debugging features, allowing you to understand its internal workings.</li>
            <li><b>Increased Productivity</b>: Save time with intuitive tools that simplify the debugging process, from placing breakpoints to analyzing the call stack.</li>
            <li><b>Performance Optimization</b>: Identify critical areas of your code with advanced profiling for targeted optimization and more responsive applications.</li>
          </ul>
          <vscode-divider></vscode-divider>
          <h3>Configuration keys</h3>
          <ul style="margin-bottom: 1.2em;">
            <li><b>traceToken</b>: a valid trace token with the "trace" capability</li>
            <li><b>traceURL</b>: the trace WebSocket url</li>
          </ul>
          <div style="margin-bottom: 1.2em;">
            <vscode-button appearance="secondary" id="settings">
              Open settings
              <span slot="start" class="codicon codicon-settings-gear"></span>
            </vscode-button>  
          </div>
          <vscode-divider></vscode-divider>
          <div class="columns">
            <div class="hero hero-sm text-center col-8 col-mx-auto">
              <h5 class="text-center py-2">Dive into an unparalleled debugging and profiling experience with TracePlugin. Download now and trace your path to impeccable code. Transform your development process with TracePlugin.</h5>
              <div><vscode-button appearance="primary" id="contact">Contact sales</vscode-button></div>
            </div>
          </div>
          <vscode-divider></vscode-divider>

          </div>
          <script>var exports = {"__esModule": true};</script>
          <script type="module" src="${webviewUri}"></script>
        </body>
      </html>
    `;
  }
}