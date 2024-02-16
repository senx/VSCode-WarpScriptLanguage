import { Disposable, Webview, WebviewPanel, window, Uri, ViewColumn, ExtensionContext } from "vscode";
import WarpScriptExtConstants from "../constants";
import { join } from "path";

export class ProfileView {
  public static currentPanel: ProfileView | undefined;
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

  public static render(extensionUri: Uri,  context: ExtensionContext) {
    if (ProfileView.currentPanel) {
      // If the webview panel already exists reveal it
      ProfileView.currentPanel._panel.reveal(ViewColumn.One);
    } else {
      // If a webview panel does not already exist create and show a new one
      const panel = window.createWebviewPanel(
        // Panel view type
        "showGallery",
        // Panel title
        "Component Gallery",
        // The editor column the panel should be displayed in
        ViewColumn.One,
        // Extra panel configurations
        {
          // Enable JavaScript in the webview
          enableScripts: true,
          // Restrict the webview to only load resources from the `out` directory
          localResourceRoots: [Uri.joinPath(extensionUri, "out")],
        }
      );
   //   panel.webview.postMessage({ command: 'refactor' });

      ProfileView.currentPanel = new ProfileView(panel, extensionUri, context);
    }
  }

  /**
   * Cleans up and disposes of webview resources when the webview panel is closed.
   */
  public dispose() {
    ProfileView.currentPanel = undefined;

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
    const webviewUri = this.getUri(webview, extensionUri, ["out", 'static', "profile.js"]);
    // const styleUri: string = WarpScriptExtConstants.getRessource(this.context, join('out', 'static','style.css'), this._panel);
    const codiconUri: string = WarpScriptExtConstants.getRessource(this.context, join('out', 'static','codicon.css'), this._panel);
    return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="stylesheet" href="${codiconUri}">
          <title>Component Gallery</title>
        </head>
        <body>
          <h1>Webview UI Toolkit Component Gallery</h1>
          <section id="data-grid-row">
          <section class="component-container">
          <h2>Data Grid</h2>
          <section class="component-example">
            <p>Default Data Grid</p>
            <vscode-data-grid id="default-grid" grid-template-columns="1fr 1fr 1fr 1fr" aria-label="Default"></vscode-data-grid>
          </section>
          <section class="component-example">
            <p>With Custom Titles</p>
            <vscode-data-grid class="basic-grid" grid-template-columns="1fr 1fr 1fr 1fr" aria-label="With Custom Titles"></vscode-data-grid>
          </section>
          <section class="component-example">
            <p>With Sticky Header</p>
            <vscode-data-grid class="basic-grid" generate-header="sticky" grid-template-columns="1fr 1fr 1fr 1fr" aria-label="With Sticky Header"></vscode-data-grid>
          </section>
          <section class="component-example">
            <p>With Custom Column Widths</p>
            <vscode-data-grid class="basic-grid" grid-template-columns="1fr 120px 1fr 2fr" aria-label="With Custom Column Widths"></vscode-data-grid>
          </section>
        </section>
          </section>
          <script>var exports = {"__esModule": true};</script>
          <script type="module" src="${webviewUri}"></script>
        </body>
      </html>
    `;
  }
}