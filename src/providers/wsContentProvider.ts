import * as vscode from 'vscode';

export default class WSContentProvider implements vscode.TextDocumentContentProvider {
    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
    private currentDocument: vscode.TextDocument | undefined;

    /**
     * 
     * @param {ExtensionContext} context 
     */
    constructor(private context: vscode.ExtensionContext) { }

    /**
     * 
     */
    public async provideTextDocumentContent(): Promise<string> {
        let rootPath = this.context.asAbsolutePath('.').replace(/\\/g, '/');
        if (this.currentDocument) {
            return `
<script src="file://${rootPath + '/bower_components/quantum-viz/dist/quantumviz.js'}"></script>
<style>
    body { 
        background-color: #fff; 
        color: #000; 
    }
</style>
<div class="container">
    <quantum-plot responsive="true" data='${this.currentDocument.getText()}' showLegend="false" ></quantum-plot>
</div>`
        } else return '';
    }

    get onDidChange(): vscode.Event<vscode.Uri> {
        return this._onDidChange.event;
    }

    /**
     * 
     * @param uri 
     */
    public update(uri: vscode.Uri, document: vscode.TextDocument) {
        this.currentDocument = document
        this._onDidChange.fire(uri);
        vscode.commands.executeCommand('vscode.previewHtml', uri, vscode.ViewColumn.Two, 'GTS Preview')
            .then(() => {
                // nothing
            }, (reason: any) => {
                vscode.window.showErrorMessage(reason)
            });
    }
}