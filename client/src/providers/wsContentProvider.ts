import * as vscode from 'vscode';

export default class WSContentProvider implements vscode.TextDocumentContentProvider {
    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
    private content: string
    constructor(
        private context: vscode.ExtensionContext
    ) { }

    /**
     * /home/xavier/workspace/VSCode-WarpScriptLangage/client/images/warp10.png
     * @param sourceUri 
     * 
     */
    public async provideTextDocumentContent(): Promise<string> {
        let rootPath = this.context.asAbsolutePath('.')
        if(!rootPath.endsWith('client')) {
            rootPath += '/client'
        }
        return `
<script src="file://${rootPath + '/bower_components/webcomponentsjs/webcomponents-loader.js'}"></script>
<link rel="import" href="file://${rootPath + '/bower_components/shadycss/apply-shim.html'}">
<link rel="import" href="file://${rootPath + '/bower_components/warp10-quantum-elements/quantum-plot.html'}">
<style>
    body { 
        background-color: #fff; 
        color: #000; 
    }
</style>
<div class="container"><quantum-plot name="plot" stack='${this.content}'></quantum-plot></div>`
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