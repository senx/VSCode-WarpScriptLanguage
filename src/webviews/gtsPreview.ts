import { join } from 'path';
import { ExtensionContext, workspace } from 'vscode';
import WarpScriptExtConstants from '../constants';

export default class GTSPreviewWebview {


  private replaceAll(target: string, search: string, replacement: string) {
    return target.replace(new RegExp(search, 'g'), replacement);
  };

  /**
   * 
   * @param {ExtensionContext} context 
   */
  constructor(private context: ExtensionContext) {
    console.log(context.extensionUri)
  }
  //dark themes : Default Dark+, Visual Studio Dark, Abyss, Kimbie Dark, Monokai, Monokai Dimmed, Red, Solarized Dark, Tomorrow Night Blue, Default High Contrast

  LightThemesList: string[] = [
    "Visual Studio Light",
    "Default Light+",
    "Quiet Light",
    "Solarized Light"
  ];
  /**
   * 
   */
  public async getHtmlContent(data: string, timeUnit: string): Promise<string> {

    //define the theme
    let theme = workspace.getConfiguration().get('warpscript.theme');
    let showDots = workspace.getConfiguration().get('warpscript.showDots');
    if (theme == "auto") {
      let vscodetheme: string = workspace.getConfiguration().get("workbench.colorTheme");
      if (this.LightThemesList.indexOf(vscodetheme) > -1) {
        theme = "light";
      }
      else { theme = "dark"; }
    }

    //get the default values for GTSPreview
    //let alwaysShowMap = vscode.workspace.getConfiguration().get('warpscript.PreviewAlwaysShowMap');
    let chartHeight = workspace.getConfiguration().get('warpscript.PreviewDefaultChartHeight');
    let mapHeight = workspace.getConfiguration().get('warpscript.PreviewDefaultMapHeight');

    //build the webcomponent path, the webview way.
    const warpviewPath: string = WarpScriptExtConstants.getRessource(this.context, join('assets', '@senx', 'warpview', 'elements', 'warpview-elements.js'));
    //build the logo path, the webview way.
    const LogoPath: string = WarpScriptExtConstants.getRessource(this.context, join('images', 'warpstudio.png'));
    const LogoWhitePath: string = WarpScriptExtConstants.getRessource(this.context, join('images', 'warpstudio-white.png'));
    //build the spectre css path, the webview way.
    const spectreCSSPath: string = WarpScriptExtConstants.getRessource(this.context, join('assets', 'spectre.css', 'dist', 'spectre.min.css'));

    //build a time unit warning
    let TimeUnitWarning: string = '';
    if (timeUnit != 'us') {
      TimeUnitWarning = `<div class="timeunitwarning">(${timeUnit} time units)</div>`
    }

    const dataEscaped: string = this.replaceAll(data, '"', '&#34;')
    const chartOptions = {
      showGTSTree: true,
      timeUnit: timeUnit,
      showDots: showDots,
      foldGTSTree: true,
      map: {}
    }
    if (theme === 'dark') {
      chartOptions.map = { mapType: 'CARTODB_DARK' };
    }

    const chartTypes = [
      'histogram2dcontour', 'histogram2d', 'line', 'spline', 'step', 'step-after', 'step-before', 'area',
      'scatter', 'pie', 'donut', 'polar', 'radar', 'bar', 'bubble', 'annotation', 'datagrid', 'display',
      'drilldown', 'image', 'map', 'gauge', 'bullet', 'plot', 'box', 'box-date', 'line3d', 'drops',
    ].sort().map(t => {
      return { value: t, label: t };
    });

    let chartSelector = '<div class="form-group"><select id="chartTypes" class="form-select select-sm" onchange="changeChartType(this)">';
    chartTypes.forEach(c => chartSelector += `<option value="${c.value}" ${c.value === 'plot' ? 'selected' : ''}>${c.label}</option>`);
    chartSelector += '</select></div>';

    return `<link href="${spectreCSSPath}" rel="stylesheet">
<style>

    body { 
        background-color: ${theme === 'light' ? '#fff' : '#222'}; 
        color: #000;
        padding: 0;
        --warp-view-switch-height: 20px;
        --warp-view-switch-width: 40px;
        --warp-view-switch-radius: 10px;
        --warp-view-switch-inset-checked-color: #1e7e34;
        --warp-view-switch-handle-checked-color: #28a745; 
        --warp-view-resize-handle-color: #e6e6e6;
    }
    header {
        background-color: ${theme === 'light' ? '#fff' : '#222'}; 
        color: ${theme !== 'light' ? '#fff' : '#222'}; 
        padding: 5px;
    }

    .navbar-section a, .navbar-section a:hover, .navbar-section a:visited {
        color: ${theme !== 'light' ? '#fff' : '#004eff'} !important; 
    }

    .bar { 
      height: 100%;
    }
    img.logo {
        height: 50px;
        width: auto;
    }
    .links {
        width: auto;
    }

    .light {
        background-color: #fff; 
        color: #000; 
        --warp-view-chart-legend-bg: #000;
        --warp-view-switch-inset-checked-color: #00cd00;        
        --warp-view-chart-legend-bg: #fafafa;  /*#fffbef;*/
        --gts-labelvalue-font-color: #666;
        --gts-separator-font-color: #000;
        --gts-labelname-font-color: rgb(17, 141, 100);
        --gts-classname-font-color: rgb(0, 137, 255);
        --warp-view-chart-legend-color: #000;
    }
    .dark {
        background-color: #222; 
        color: #cccccc;
        --warp-view-font-color: #ffffff;
        --warp-view-chart-label-color: #ffffff;
        --gts-tree-expanded-icon: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAhnpUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHjadY7BDcQwCAT/VHElYMCLKSeKYikdXPmHz7H8yjxgtYIFur53p8+gsJBVbwiAEwsLOVI0nihzES6jZ508XUsq2TapTIFozrYH7fEXVdHQ3dxRceKUTJdL9V9zh0Yqjzdih6wrrC/++uIHPv4sDZt0gnUAAAoCaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA0LjQuMC1FeGl2MiI+CiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIKICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICBleGlmOlBpeGVsWERpbWVuc2lvbj0iMTYiCiAgIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSIxNiIKICAgdGlmZjpJbWFnZVdpZHRoPSIxNiIKICAgdGlmZjpJbWFnZUhlaWdodD0iMTYiCiAgIHRpZmY6T3JpZW50YXRpb249IjEiLz4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PvkekNoAAAAEc0JJVAgICAh8CGSIAAAAf0lEQVQ4y2NgGAUo4P///5q/f/8WwKOE8f////r////nwZD5/ft38n8IuPf//395HJpboGouffr0iQvd9o3/EQDdEGTNMKCJboDS////H2ExBJvmGlxhoIzFkMlommsJBSS6IcRrJmBILalRimxIDVnp4vfv3wI/fvzQGubJHwDuCeYQWCJWzwAAAABJRU5ErkJggg==');
        --gts-tree-collapsed-icon: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAhnpUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHjadY7BDcQwCAT/VHElYMCLKSeKYikdXPmHz7H8yjxgtYIFur53p8+gsJBVbwiAEwsLOVI0nihzES6jZ508XUsq2TapTIFozrYH7fEXVdHQ3dxRceKUTJdL9V9zh0Yqjzdih6wrrC/++uIHPv4sDZt0gnUAAAoCaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA0LjQuMC1FeGl2MiI+CiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIKICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICBleGlmOlBpeGVsWERpbWVuc2lvbj0iMTYiCiAgIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSIxNiIKICAgdGlmZjpJbWFnZVdpZHRoPSIxNiIKICAgdGlmZjpJbWFnZUhlaWdodD0iMTYiCiAgIHRpZmY6T3JpZW50YXRpb249IjEiLz4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PvkekNoAAAAEc0JJVAgICAh8CGSIAAAAZElEQVQ4y82Ruw2AMAwFAzMyAgUjpMgPFkZB1BwlwRVxKHKdZb17km1MlwALcAJOK8g8JI3A8mbVSLyQbBpJ+EMShWQq9+MHxyDmq6Y9ifbYEg4tH/C1hzuKsNNcfgZ2wJruuQHPyrmaqCioTAAAAABJRU5ErkJggg==');
        --gts-stack-font-color: #ffffff;
        --warp-view-switch-inset-color: #545b62;
        --warp-view-switch-handle-color: #6c757d;
        --warp-view-spinner-color: #5899DA;
        --gts-separator-font-color: #8e8e8e;
        --warp-view-resize-handle-color: #111111;
        --warp-view-tooltip-bg: #333;
        --warp-view-tooltip-color: #fff;
        --warp-view-annotationtooltip-value-font-color: #fff;
        --warp-view-chart-legend-bg:#333;
        --warp-view-chart-legend-color: #fff;
        --gts-labelvalue-font-color: #fff;
        --gts-separator-font-color: rgb(127, 225, 255);
        --gts-labelname-font-color: rgb(127, 255, 185);
        --gts-classname-font-color: rgb(127, 225, 255);
    }
    .form-select {
      color: #000 !important;
    }
    .timeunitwarning {
        margin: 10px;
    }
</style>
<header class="navbar">
    <section class="navbar-section">
        <img src="${theme === 'light' ? LogoPath : LogoWhitePath}" class="logo">
    </section>
    <section class="navbar-section">
      ${chartSelector}
      <a href="https://senx.io" target="_blank" class="btn btn-link">SenX</a>
      <a href="https://www.warp10.io" target="_blank" class="btn btn-link">Warp 10</a>
    </section>
</header>
<div class="${theme}">
${TimeUnitWarning}
<div class="warpview-container">
  <warp-view-result-tile
    responsive="true" 
    type="plot"
    initial-chart-height="${chartHeight}" 
    initial-map-height="${mapHeight}" 
    data="${dataEscaped}" 
    showLegend="false"
    id="viewer"
    options='${JSON.stringify(chartOptions)}' ></warp-view-result-tile>
  </div>
  <script src="${warpviewPath}"></script>
  <script language="javascript">
    function changeChartType(option) {
      document.querySelector('#viewer').setAttribute('type', option.value);
    };
  </script>
</div>`;
  }
}