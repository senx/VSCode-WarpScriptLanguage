import * as vscode from 'vscode';

export default class WSContentProvider implements vscode.TextDocumentContentProvider {
    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
    private content:string

    /**
     * 
     * @param sourceUri 
     */
    public async provideTextDocumentContent(sourceUri: vscode.Uri): Promise<string> {
        console.log(sourceUri)
        return `
<script src="https://cdn.cityzendata.net/quantum/current/bower_components/webcomponentsjs/webcomponents-loader.js"></script>
<link href="http://polygit.org/polymer+:master/components/polymer/polymer.html" rel="import">
<link rel="import" href="https://cdn.cityzendata.net/quantum/current/bower_components/warp10-quantum-elements/quantum-plot.html">

<style> body { background-color: #fff; }</style>
    <quantum-plot
    name="plot"
    stack="${this.content}"
    debug ></quantum-plot>
    <!--   <warp10-display-chart 
        data='${this.content}'
        debug></warp10-display-chart>
  <pre>${this.content}</pre> -->`
    }

    get onDidChange(): vscode.Event<vscode.Uri> {
        return this._onDidChange.event;
    }

    /**
     * 
     * @param uri 
     */
    public update(uri: vscode.Uri, content: string) {
        this.content = content
        this._onDidChange.fire(uri);
    }
}