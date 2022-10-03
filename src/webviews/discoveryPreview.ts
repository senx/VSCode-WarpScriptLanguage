import { OutputChannel } from "vscode";
import { ExtensionContext, workspace } from "vscode";
import GTSPreviewWebview from './gtsPreview'
import WarpScriptExtConstants from "../constants";
import { join } from "path";

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

  constructor() { }

  public static seemsToBeDiscoveryHtml(data: string) {
    return (data.startsWith('["<!DOCTYPE html>') && data.endsWith('</body></html>"]'));
  }

  public async findDiscoveryHtml(data: string, outputWin: OutputChannel): Promise<String> {
    let discoveryHtml: String = "";
    if (DiscoveryPreviewWebview.seemsToBeDiscoveryHtml(data)) {
      try {
        let objlist = JSON.parse(data);
        discoveryHtml = objlist[0];
      } catch (error) {
        outputWin.appendLine("Unable to parse json output for discovery. Try to disable unicode unescape feature: In the settings, set 'max File Size For Automatic Unicode Escape' to zero.")
      }
    }

    console.log("found html that could be a discovery dashboard")
    return (discoveryHtml);
  }


  static themeCss = {
    light: `
    
    .dashboard-panel {
      font-family: 'Quicksand', sans-serif;
      background-color: #eee;
      --warp-view-bg-color: #fff;
      color: #404040;
      --warp-view-dashboard-background:  #eee;
      --warp-view-font-color: #404040;
      --warp-view-chart-label-color: #6c757d;
      --warp-view-chart-legend-color: #6c757d;
      --warp-view-tile-background: #fff;
      --warp-view-chart-grid-color: #6c757d;
      font-size: 12px;
      line-height: 1.52;
      padding: 1rem;
    }
    `,
    vintage: `

    .dashboard-panel {
      font-family: 'Quicksand', sans-serif;
      background-color: rgba(254, 248, 239, 1);
      color: #333333;
      font-size: 12px;
      line-height: 1.52;
  
      // General
      --warp-view-font-color: #333333;
      --warp-view-chart-label-color: #333333;
      --warp-view-chart-grid-color: #666666;
      --warp-view-spinner-color: #d87c7c;
  
      // modals
      --warp-view-modal-bg-color: rgba(254, 248, 239, 1);
  
      // Buttons
      --warp-view-button-border-color: #6e7074;
      --warp-view-button-label-color: #fff;
      --warp-view-button-bg-color: #333333;
      --warp-view-button-secondary-border-color: #6e7074;
      --warp-view-button-secondary-bg-color: #333333;
      --warp-view-button-secondary-label-color: #fff;
      --warp-view-button-inactive-label-color: #6c757d;
  
      // Inputs
      --warp-view-input-border-color: #ccc;
      --warp-view-input-label-color: #333333;
      --warp-view-input-bg-color: #fff;
      --warp-view-active-input-bg-color: #fff;
      --warp-view-handle-bg-color: #d87c7c;
  
      // Tooltips
      --warp-view-tooltip-bg-color: #333333;
      --warp-view-tooltip-label-color: #fff;
      --warp-view-tooltip-border-color: #333333;
  
  
      // Dashboards
      --warp-view-dashboard-background: rgba(254, 248, 239, 1);
  
      --warp-view-tile-border: none;
      --warp-view-tile-shadow: none;
      --warp-view-tile-background: transparent;
  
      // Data grid
      --warp-view-datagrid-odd-bg-color: #61a0a8;
      --warp-view-datagrid-odd-color: #fff;
      --warp-view-datagrid-even-bg-color: transparent;
      --warp-view-datagrid-even-color: #333333;
      --warp-view-pagination-border-color: #ccc;
      --warp-view-pagination-bg-color: transparent;
      --warp-view-pagination-active-bg-color: #d87c7c;
      --warp-view-pagination-active-color: #fff;
      --warp-view-pagination-active-border-color: #ccc;
      --warp-view-pagination-hover-bg-color: #61a0a8;
      --warp-view-pagination-hover-color: #fff;
      --warp-view-pagination-hover-border-color: #fff;
      --warp-view-pagination-disabled-color: #aaaaaa;
      
    }`,
    green: `
    .dashboard-panel {
      --wc-split-gutter-color: #404040;
      --warp-view-pagination-bg-color: #343a40 !important;
      --warp-view-pagination-border-color: #6c757d;
      --warp-view-datagrid-odd-bg-color: rgba(255, 255, 255, .05);
      --warp-view-datagrid-odd-color: #FFFFFF;
      --warp-view-datagrid-even-bg-color: #212529;
      --warp-view-datagrid-even-color: #FFFFFF;
      --warp-view-font-color: #FFFFFF;
      --warp-view-chart-label-color: #FFFFFF;
      --gts-stack-font-color: #FFFFFF;
      --warp-view-resize-handle-color: #111111;
      --warp-view-chart-legend-bg: #000;
      --gts-labelvalue-font-color: #ccc;
      --gts-separator-font-color: #FFFFFF;
      --gts-labelname-font-color: rgb(105, 223, 184);
      --gts-classname-font-color: rgb(126, 189, 245);
      --warp-view-chart-legend-color: #FFFFFF;
      --wc-tab-header-color: #FFFFFF;
      --wc-tab-header-selected-color: #404040;
      --warp-view-tile-background: #40404066;
      --warp-view-dashboard-background: transparent;
      // Buttons
      --warp-view-button-border-color: #1F4A4F;
      --warp-view-button-label-color: #1D434C;
      --warp-view-button-bg-color: #3BBC7D;
      --warp-view-button-secondary-border-color: #ccc;
      --warp-view-button-secondary-bg-color: #ccc;
      --warp-view-button-secondary-label-color: rgba(41, 52, 65, 1);
      --warp-view-button-inactive-label-color: #ccc;
      --warp-view-button-inactive-bg-color: #1F4A4F;
      --warp-view-chart-grid-color:#c0c0c0;
      font-size: 12px;
      line-height: 1.52;
      color: #1b1b1b;
      background: #FAFBFF linear-gradient(40deg, #3BBC7D, #1D434C) fixed;
      padding: 1rem;
      height: calc(100vh - 2rem);
    }  
    
    `,
    fresh: `
    .dashboard-panel {
      --wc-split-gutter-color: #404040;
      --warp-view-pagination-bg-color: #343a40 !important;
      --warp-view-pagination-border-color: #6c757d;
      --warp-view-datagrid-odd-bg-color: rgba(255, 255, 255, .05);
      --warp-view-datagrid-odd-color: #FFFFFF;
      --warp-view-datagrid-even-bg-color: #212529;
      --warp-view-datagrid-even-color: #FFFFFF;
  
      --warp-view-font-color: #AEAEDD;
      --warp-view-chart-label-color: #AEAEDD;
      --gts-stack-font-color: #AEAEDD;
      --warp-view-resize-handle-color: #111111;
      --warp-view-chart-legend-bg: #000;
      --gts-labelvalue-font-color: #ccc;
  
      --gts-separator-font-color: #AEAEDD;
      --gts-labelname-font-color: rgb(105, 223, 184);
      --gts-classname-font-color: rgb(126, 189, 245);
      --warp-view-chart-legend-color: #AEAEDD;
      --warp-view-tile-background: #FAFCFF;
      --warp-view-dashboard-background: transparent;
      --warp-view-tile-border: none;
      --warp-view-tile-shadow: none;
  
  
  
      // Buttons
      --warp-view-button-border-color: #AEAEDD;
      --warp-view-button-label-color: #fff;
      --warp-view-button-bg-color: #AEAEDD;
      --warp-view-button-secondary-border-color: #6e7074;
      --warp-view-button-secondary-bg-color: #333333;
      --warp-view-button-secondary-label-color: #fff;
      --warp-view-button-inactive-label-color: #AEAEDD;
      --warp-view-chart-grid-color:#AEAEDD;
      font-family: 'Quicksand', sans-serif;
      font-size: 12px;
      line-height: 1.52;
      color: #AEAEDD;
      background: #fff;
      padding: 1rem;
      height: calc(100vh - 2rem);
    }
    ` ,
    dark: `
  .dashboard-panel {
    font-family: 'Quicksand', sans-serif;
    font-size: 12px;
    line-height: 1.52;
    background-color: #333540;
    --warp-view-bg-color: #3A3C46;
    color: #FFFFFF;
    --warp-view-dashboard-background:  #333540;
    --wc-split-gutter-color: #404040;
    --warp-view-pagination-bg-color: #343a40 !important;
    --warp-view-pagination-border-color: #6c757d;
    --warp-view-datagrid-odd-bg-color: rgba(255, 255, 255, .05);
    --warp-view-datagrid-odd-color: #FFFFFF;
    --warp-view-datagrid-even-bg-color: #212529;
    --warp-view-datagrid-even-color: #FFFFFF;
    --warp-view-font-color: #FFFFFF;
    --warp-view-chart-label-color: #FFFFFF;
    --gts-stack-font-color: #FFFFFF;
    --warp-view-resize-handle-color: #111111;
    --warp-view-chart-legend-bg: #000;
    --gts-labelvalue-font-color: #ccc;
    --gts-separator-font-color: #FFFFFF;
    --gts-labelname-font-color: rgb(105, 223, 184);
    --gts-classname-font-color: rgb(126, 189, 245);
    --warp-view-chart-legend-color: #FFFFFF;
    --warp-view-tile-background: #3A3C46;
    --warp-view-modal-bg-color: #333540;
    --warp-view-button-bg-color: #343a40;
    --warp-view-button-label-color: #FFFFFF;
    --warp-view-button-border-color: #6c757d;
    --warp-view-button-inactive-label-color: #6c757d;
    --warp-view-chart-grid-color:#808080;
  }  
  `,
    darkblue: `
  .dashboard-panel {
    --wc-split-gutter-color: #404040;
    --warp-view-pagination-bg-color: #343a40 !important;
    --warp-view-pagination-border-color: #6c757d;
    --warp-view-datagrid-odd-bg-color: rgba(255, 255, 255, .05);
    --warp-view-datagrid-odd-color: #FFFFFF;
    --warp-view-datagrid-even-bg-color: #212529;
    --warp-view-datagrid-even-color: #FFFFFF;

    --warp-view-font-color: #FFFFFF;
    --warp-view-chart-label-color: #FFFFFF;
    --gts-stack-font-color: #FFFFFF;
    --warp-view-resize-handle-color: #111111;
    --warp-view-chart-legend-bg: #000;
    --gts-labelvalue-font-color: #ccc;
    // Buttons
    --warp-view-button-border-color: #02253C;
    --warp-view-button-label-color: #fff;
    --warp-view-button-bg-color: #045F9C;
    --warp-view-button-secondary-border-color: #ccc;
    --warp-view-button-secondary-bg-color: #ccc;
    --warp-view-button-secondary-label-color: rgba(41, 52, 65, 1);
    --warp-view-button-inactive-label-color: #ccc;
    --warp-view-button-inactive-bg-color: #02253C;
    --warp-view-chart-grid-color:#808080;
    
    --gts-separator-font-color: #fff;
    --gts-labelname-font-color: rgb(105, 223, 184);
    --gts-classname-font-color: rgb(126, 189, 245);
    --warp-view-chart-legend-color: #fff;
    --warp-view-tile-background: linear-gradient(127.09deg, rgba(6, 11, 40, 0.94) 19.41%, rgba(10, 14, 35, 0.49) 76.65%) border-box;
    --warp-view-dashboard-background: transparent;
    --warp-view-tile-border: none;
    --warp-view-tile-shadow: rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem;
    --warp-view-tile-border-radius: 1rem;
    font-family: 'Quicksand', sans-serif;
    font-size: 12px;
    line-height: 1.52;
    color: #fff;
    background: #000000 linear-gradient(147deg, #000000 0%, #04619f 74%);
    padding: 1rem;
    height: calc(100vh - 2rem);
  }
  `,
    chalk: `
  .dashboard-panel {
    font-family: 'Quicksand', sans-serif;
    background-color: #293441;
    color: #ffffff;
    font-size: 12px;
    line-height: 1.52;

    // General
    --warp-view-font-color: #ffffff;
    --warp-view-chart-label-color: #ffffff;
    --warp-view-chart-grid-color: #666666;
    --warp-view-spinner-color: #ffffff;

    // modals
    --warp-view-modal-bg-color: #72CCFF33;

    // Buttons
    --warp-view-button-border-color: #76f2f2;
    --warp-view-button-label-color: #293441;
    --warp-view-button-bg-color: #72ccff;
    --warp-view-button-secondary-border-color: #ccc;
    --warp-view-button-secondary-bg-color: #ccc;
    --warp-view-button-secondary-label-color: #293441;
    --warp-view-button-inactive-label-color: #ccc;
    --warp-view-button-inactive-bg-color: #293441;

    // Inputs
    --warp-view-input-border-color: #ccc;
    --warp-view-input-label-color: #ffffff;
    --warp-view-input-bg-color: #293441;
    --warp-view-active-input-bg-color: #293441;
    --warp-view-handle-bg-color: #72ccff;

    // Tooltips
    --warp-view-tooltip-bg-color: #72ccff;
    --warp-view-tooltip-label-color: #293441;
    --warp-view-tooltip-border-color: #76f2f2;


    // Dashboards
    --warp-view-dashboard-background: #293441;

    --warp-view-tile-border: #ccc;
    --warp-view-tile-shadow: none;
    --warp-view-tile-background: transparent;

    // Data grid
    --warp-view-datagrid-odd-bg-color: #72CCFF33;
    --warp-view-datagrid-odd-color: #fff;
    --warp-view-datagrid-even-bg-color: transparent;
    --warp-view-datagrid-even-color: #fff;
    --warp-view-pagination-border-color: #ccc;
    --warp-view-pagination-bg-color: transparent;
    --warp-view-pagination-active-bg-color: #72CCFF33;
    --warp-view-pagination-active-color: #fff;
    --warp-view-pagination-active-border-color: #ccc;
    --warp-view-pagination-hover-bg-color: #72ccff;
    --warp-view-pagination-hover-color: #293441;
    --warp-view-pagination-hover-border-color: #293441;
    --warp-view-pagination-disabled-color: #293441;
    padding: 1rem;
  }
  `
  } as themeList;




  public async getHtmlContent(discoveryHtml: String): Promise<string> {
    // manipulate html here if needed
    let htmlContent = ` ${discoveryHtml.toString()} `;
    return htmlContent;
  }


  public static getTemplate(context: ExtensionContext, _theme: String): String {

    // define the html template
    let discoveryLibPath: string = WarpScriptExtConstants.getRessource(context, join('node_modules', '@senx', 'discovery-widgets', 'dist', 'discovery', 'discovery.js'));
    let darkLogo: string = WarpScriptExtConstants.getRessource(context, join('images', 'senx_header_dark.png'));
    let whiteLogo: string = WarpScriptExtConstants.getRessource(context, join('images', 'senx_header_light.png'));
    let senxLogo = "light";
    // look for theme
    let css = DiscoveryPreviewWebview.themeCss.dark;
    switch (_theme) {
      case "dark":
        css = DiscoveryPreviewWebview.themeCss.dark;
        senxLogo = "dark";
        break;
      case "light":
        css = DiscoveryPreviewWebview.themeCss.light;
        break;
      case "green":
        css = DiscoveryPreviewWebview.themeCss.green;
        senxLogo = "dark";
        break;
      case "fresh":
        css = DiscoveryPreviewWebview.themeCss.fresh;
        break;
      case "chalk":
        css = DiscoveryPreviewWebview.themeCss.fresh;
        break;
      case "dark-blue":
        css = DiscoveryPreviewWebview.themeCss.darkblue;
        senxLogo = "dark";
        break;
      default:
        // no theme predefined. choose the best one from vscode theme:
        let vscodetheme: string = workspace.getConfiguration().get("workbench.colorTheme");
        if (GTSPreviewWebview.LightThemesList.indexOf(vscodetheme) > -1) {
          css = DiscoveryPreviewWebview.themeCss.light;
          console.log("theme default to light")
        } else {
          css = DiscoveryPreviewWebview.themeCss.dark;
          senxLogo = "dark";
          console.log("theme default to dark")
        }

    }

    let htmlTemplate = `<!DOCTYPE html><html><head><meta charset="utf-8" /><title id="pageTitle">{{{TITLE}}}</title>
      <style>
        ${css}
        .dashboard-panel {
          padding: 1rem;
        }
      </style>
    </head>
    <body>

    <div class="dashboard-panel">    
    <div class="heading">
    <a href="https://senx.io" target="_blank"><img src="${senxLogo == "dark" ? whiteLogo : darkLogo}" alt="SenX" ></a>
    </div>
    {{{HEADER}}}
    <discovery-dashboard url="{{{URL}}}" dashboard-title="{{{TITLE}}}" cols="{{{COLS}}}" cell-height="{{{CELL_HEIGHT}}}">
    {{{BOOTSTRAP}}}
    {{{DATA}}}
    </discovery-dashboard>
    {{{FOOTER}}}
    </div>
    <script src="${discoveryLibPath}"></script>
    </body></html>`;



    return htmlTemplate;
  }
}