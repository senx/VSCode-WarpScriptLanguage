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
    .container { 
        background-color: #f8f9fa;
        color: #000; 
        margin: 0;
        font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5;
        color: #212529;
        text-align: left;
      }
  
      .container.dark {
        background-color: #343a40;
        --quantum-font-color: #ffffff;
        --quantum-chart-label-color: #ffffff;
        --gts-tree-expanded-icon: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACASURBVGhD7djRCYAwDEXRLOCHWzqKe7lXawIZILQEQ7wH+hl4D5SUCgAA+IMxxjHnPCsdy+Tx4nTo0eFSLJPHi6NIotUiPf4RAAB26PK5dAndlY5l8nhxdh3Q4VIsk8eL61Skx6cFAMAOXT480GWxTB4vjiKJVovwQAcAAD4h8gJ93ZLCEjQrYQAAAABJRU5ErkJggg==');
        --gts-stack-font-color: #ffffff;
        --quantum-switch-inset-color: #000000;
        --quantum-switch-inset-checked-color: darkgreen;
        --quantum-switch-handle-color: #8e8e8e;
        --quantum-switch-handle-checked-color: lime;
      }
</style>
<div class="container ${vscode.workspace.getConfiguration().get('warpscript.theme') === 'dark'? 'dark': ''}">
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