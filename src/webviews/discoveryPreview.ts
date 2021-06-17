
export default class DiscoveryPreviewWebview {

  constructor() { }

  public async findDiscoveryHtml(data: string): Promise<String> {
    let discoveryHtml: String = "";
    if (data.startsWith('["<!DOCTYPE html>') && data.endsWith('</body></html>"]')) {
      let objlist = JSON.parse(data);
      discoveryHtml = objlist[0];
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