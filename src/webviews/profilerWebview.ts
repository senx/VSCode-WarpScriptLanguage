import { join } from "path";
import { Disposable, ExtensionContext, Range, TextEditor, TextEditorDecorationType, TextEditorRevealType, Uri, ViewColumn, Webview, WebviewPanel, window, workspace } from "vscode";
import WarpScriptExtConstants from "../constants";
import GTSPreviewWebview from "./gtsPreview";
export class ProfilerWebview {
  public static currentPanel: ProfilerWebview | undefined;
  private readonly _panel: WebviewPanel;
  private _disposables: Disposable[] = [];
  private context: ExtensionContext;
  result: any;
  activeTextEditor: TextEditor;
  macros: any = {};
  lastMacros: any[] = [];
  totalTime = 0;
  profileFnDecoration = window.createTextEditorDecorationType({
    borderWidth: '1px',
    borderStyle: 'solid'
  });


  profileMacroDecoration: TextEditorDecorationType;
  afterFnDecoration: TextEditorDecorationType;

  private constructor(panel: WebviewPanel, extensionUri: Uri, context: ExtensionContext, result: any[], activeTextEditor: TextEditor) {
    this._panel = panel;
    this.result = result;
    this.context = context;
    this.activeTextEditor = activeTextEditor;
    this.macros = {};
    this.profileMacroDecoration = window.createTextEditorDecorationType({ gutterIconPath: context.asAbsolutePath('images/line.svg') });
    // Set an event listener to listen for when the panel is disposed (i.e. when the user closes
    // the panel or when the panel is closed programmatically)
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);


    // Set the HTML content for the webview panel
    this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri);
    let code = '';
    const global = this.result.filter((p: string[]) => p[3].startsWith('m'))[0];
    this.totalTime = (global ?? [])[5];
    this.result = this.result
      .filter((p: any[]) => p[4] > 0)
      .filter((p: any[]) => p[0] < activeTextEditor.document.lineCount + 1 && p[0] > 2);
    this.result.forEach((p: any[]) => p[3] = p[3].replace(/:/g, '_').replace(/-/g, '_'));

    //const profs: any[] = [...result].sort((a: any[], b: any[]) => a[0] - b[0]);
    for (let i = 0; i < activeTextEditor.document.lineCount; i++) {
      let profIndex = 0;
      const profLine = result.filter((p: any[]) => p[0] - 1 === i).sort((a: any[], b: any[]) => a[1] - b[1]) ?? [];
      const line = activeTextEditor.document.lineAt(i).text;
      line.split('').forEach((char, c) => {
        if ((profLine[profIndex] ?? []).length > 0 && c === profLine[profIndex][1]) {
          if ('M' === profLine[profIndex][3][0]) {
            this.lastMacros.push(profLine[profIndex].join('-'));
            this.macros[profLine[profIndex].join('-')] = { start: i + 1 };
          }
        }
        code += char;
        if (code.endsWith('%>')) {
          const m = this.lastMacros.pop();
          if (this.macros[m]) this.macros[m].end = i + 1;
        }
        if ((profLine[profIndex] ?? []).length > 0 && c === profLine[profIndex][2]) {
          profIndex++;
        }
      });
      code += '\n';
    }
    //  this.macros[global.join('-')] = { start: 1, end: activeTextEditor.document.lineCount };
  }

  public static render(context: ExtensionContext, result: any[], activeTextEditor: TextEditor) {
    if (ProfilerWebview.currentPanel) {
      // If the webview panel already exists reveal it
      ProfilerWebview.currentPanel._panel.reveal(ViewColumn.Two);
    } else {
      // If a webview panel does not already exist create and show a new one
      const panel = window.createWebviewPanel(
        // Panel view type
        "ProfilerWebview",
        // Panel title
        "Profiler Results",
        // The editor column the panel should be displayed in
        ViewColumn.Two,
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
          if (message.command === 'highlight') {
            ProfilerWebview.currentPanel.highlight(message.profile);
          }
          if (message.command === 'unhighlight') {
            ProfilerWebview.currentPanel.unhighlight();
          }
        },
        undefined,
        context.subscriptions
      );
      ProfilerWebview.currentPanel = new ProfilerWebview(panel, context.extensionUri, context, result, activeTextEditor);
    }

    ProfilerWebview.currentPanel._panel.onDidChangeViewState(e => {
      if (e.webviewPanel.active) {
        ProfilerWebview.currentPanel._panel.webview.postMessage({ result, ws: activeTextEditor.document.getText() });
      }
    })
  }

  unhighlight() {
    this.activeTextEditor.setDecorations(this.profileFnDecoration, []);
    this.activeTextEditor.setDecorations(this.profileMacroDecoration, []);
    if (this.afterFnDecoration) {
      this.afterFnDecoration.dispose();
    }
  }

  getPerCal(total: number, count: number) {
    return total / count;
  }

  highlight(profile: any[]) {
    this.unhighlight();
    if ('M' === profile[3][0]) {
      const m = this.macros[profile.join('-')];
      const ranges = [];
      for (let i = m.start - 2; i < (m.end ?? (m.start - 1)); i++) {
        ranges.push(new Range(i, 0, i, 0));
      }

      this.activeTextEditor.revealRange(ranges[0], TextEditorRevealType.InCenterIfOutsideViewport);
      this.activeTextEditor.setDecorations(this.profileMacroDecoration, ranges);

      this.afterFnDecoration = window.createTextEditorDecorationType({
        after: {
          contentText: this.getProfileResult(profile),
          color: '#404040',
          margin: '5px'
        }
      });
      this.activeTextEditor.setDecorations(this.afterFnDecoration, [new Range(m.start - 2, profile[2] + 1, m.start - 2, profile[2] + 1)]);
    } else if ('F' === profile[3][0]) {
      const range = new Range(profile[0] - 2, profile[1], profile[0] - 2, profile[2] + 1);
      this.activeTextEditor.revealRange(range, TextEditorRevealType.InCenterIfOutsideViewport);
      this.activeTextEditor.setDecorations(this.profileFnDecoration, [{ range }]);

      this.afterFnDecoration = window.createTextEditorDecorationType({
        after: {
          contentText: this.getProfileResult(profile),
          color: '#404040',
          margin: '5px'
        }
      });
      this.activeTextEditor.setDecorations(this.afterFnDecoration, [{ range }]);
    }
  }


  getProfileResult(profile: any[]): string {
    return `${profile[4]} call${profile[4] > 1 ? 's' : ''}, ${profile[5]} ns${profile[4] > 1 ? `, ${Math.round(this.getPerCal(profile[5], profile[4]) * 100) / 100} ns per op.` : ''}`;
  }

  /**
   * Cleans up and disposes of webview resources when the webview panel is closed.
   */
  public dispose() {
    ProfilerWebview.currentPanel = undefined;
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

    const webviewUri = this.getUri(webview, extensionUri, ["out", 'static', "profile.js"]);
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
          <h1>Profile</h1>
          <vscode-data-grid id="profile" aria-label="Profile"  generate-header="sticky"></vscode-data-grid>
          <script>var exports = {"__esModule": true};</script>
          <script type="module" src="${webviewUri}"></script>
        </body>
      </html>
    `;
  }
}