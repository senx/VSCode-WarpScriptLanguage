import { OutputChannel } from "vscode";

export default class DiscoveryPreviewWebview {

  constructor() { }

  public async findDiscoveryHtml(data: string, outputWin: OutputChannel): Promise<String> {
    let discoveryHtml: String = "";
    if (data.startsWith('["<!DOCTYPE html>') && data.endsWith('</body></html>"]')) {
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

  public async getHtmlContent(discoveryHtml: String): Promise<string> {
    // manipulate html here if needed
    let htmlContent = ` ${discoveryHtml.toString()} `;
    return htmlContent;
  }

}