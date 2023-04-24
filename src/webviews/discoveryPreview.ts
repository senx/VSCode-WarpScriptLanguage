import { OutputChannel, WebviewPanel } from "vscode";
import { ExtensionContext, workspace } from "vscode";
import GTSPreviewWebview from './gtsPreview'
import WarpScriptExtConstants from "../constants";
import { join } from "path";
import { specialCommentCommands } from "../warpScriptParser";

export interface themeList {
  light?: string;
  dark?: string;
  green?: string;
  fresh?: string;
  darkblue?: string;
  vintage?: string;
  chalk?: string;
}

export default class DiscoveryPreviewWebview {


  /**
   * 
   * @param {ExtensionContext} context 
   */
  constructor(private context: ExtensionContext) {
    console.log(context.extensionUri)
  }

  public async findDiscovery(data: string, outputWin: OutputChannel): Promise<any> {
    let discoveryStruct: string = "";
    try {
      let objlist = JSON.parse(data);
      discoveryStruct = objlist[0];
    } catch (error) {
      outputWin.appendLine("Unable to parse json output for discovery. Try to disable unicode unescape feature: In the settings, set 'max File Size For Automatic Unicode Escape' to zero.")
    }
    console.log("found html that could be a discovery dashboard")
    return discoveryStruct;
  }

  private escapeHTML(unsafe: string) {
    return unsafe.replace(/[&<"']/g, function (m) {
      switch (m) {
        case '&':
          return '&amp;';
        case '<':
          return '&lt;';
        case '"':
          return '&quot;';
        default:
          return '&#039;';
      }
    });
  }


  public async getHtmlContent(discoveryJSON: any, opts: specialCommentCommands, webviewPanel: WebviewPanel): Promise<string> {
    // manipulate html here if needed
    const vscodetheme: string = workspace.getConfiguration().get("workbench.colorTheme")
    let ideTheme = 'dark';
    if (GTSPreviewWebview.LightThemesList.indexOf(vscodetheme) > -1) {
      ideTheme = 'light';
    }
    const discoveryPathNoModule: string = WarpScriptExtConstants.getRessource(this.context, join('assets', '@senx', 'discovery-widgets', 'dist', 'discovery', 'discovery.js'), webviewPanel);
    const discoveryPathModule: string = WarpScriptExtConstants.getRessource(this.context, join('assets', '@senx', 'discovery-widgets', 'dist', 'discovery', 'discovery.esm.js'), webviewPanel);
    const discoveryTheme: string = WarpScriptExtConstants.getRessource(this.context, join('assets', 'themes.css'), webviewPanel);
    let theme = opts.theme || ideTheme;
    if (ideTheme === 'light' && !opts.theme) {
      theme = 'default';
    }
    const darkLogo: string = WarpScriptExtConstants.getRessource(this.context, join('images', 'senx_header_dark.png'), webviewPanel);
    const whiteLogo: string = WarpScriptExtConstants.getRessource(this.context, join('images', 'senx_header_light.png'), webviewPanel);
    let senxLogo = "light";
    switch (theme) {
      case 'dark':
      case 'green':
      case 'chalk':
      case 'dark-blue':
        senxLogo = "dark";
        break;
      default:
        senxLogo = "light";
    }

    return `<html>
  <head>
    <title>Test</title>
    <link href="${discoveryTheme}" rel="stylesheet"></link>
    <style>
    .heading {
      padding: 15px;
    }
    body {
      margin: 0;
      padding: 0;
    }
    .dashboard-panel {
      min-height: calc(100vh - 32px);
      height: auto !important;
      width:  calc(100% - 32px);
      padding: 0;
    }
    </style>
  </head>
  <body>
    <div class="theme-${theme}">
      <div class="dashboard-panel">
        <div class="heading">
          <a href="https://senx.io" target="_blank"><img src="${senxLogo == "dark" ? whiteLogo : darkLogo}" alt="SenX" ></a>
        </div>
        <discovery-dashboard url="${opts.endpoint}" data="${this.escapeHTML(JSON.stringify(discoveryJSON))}"></discovery-dashboard>
      </div>
    </div>
    <script nomodule src="${discoveryPathNoModule}"></script>
    <script type="module" src="${discoveryPathModule}"></script>
  </body>
</html>`;
  }
}