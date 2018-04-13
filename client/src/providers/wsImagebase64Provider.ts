import * as vscode from 'vscode';

export default class WSImagebase64Provider implements vscode.TextDocumentContentProvider {
    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
    private currentDocument: vscode.TextDocument;
    private static imgb64Pattern: string = '"(data:image\/png;base64,(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?)"';

    constructor() { }


    /**
     * 
     * @param sourceUri 
     * 
     */
    public async provideTextDocumentContent(): Promise<string> {
        //regexp for base 64 image surrounded by double quotes
        let match: RegExpMatchArray | null;
        let imgcounter = 1

        let htmlContent = `<head>
        
        <title>Stack images</title>
        <style media="screen" type="text/css">

        img {
            border-style: dashed;
            border-color: red;
            border-width: 1px;
        }
        
        </style>
        </head>
        <body> Warp10 base64 images output, TOP to BOTTOM of stack`
        let re = RegExp(WSImagebase64Provider.imgb64Pattern, 'g')
        while ((match = re.exec(this.currentDocument.getText()))) {
            htmlContent += `<h2>Image ${imgcounter} </h2>`
            htmlContent += `<img src="${match[1]}" /><br/>`
            //link test 1
            imgcounter++;

        }
        htmlContent += '<br/></br>stack bottom</body>'

        return htmlContent
    }

    get onDidChange(): vscode.Event<vscode.Uri> {
        return this._onDidChange.event;
    }

    /**
     * 
     * @param uri 
     */
    public update(uri: vscode.Uri, document: vscode.TextDocument) {
        let re = RegExp(WSImagebase64Provider.imgb64Pattern, 'g');

        // Only update if there is data.
        if (re.exec(document.getText()) !== null) {
            this.currentDocument = document
            this._onDidChange.fire(uri);

            vscode.commands.executeCommand('vscode.previewHtml', uri, vscode.ViewColumn.Two, 'Image Preview')
                .then(() => {
                    // nothing
                }, (reason: any) => {
                    vscode.window.showErrorMessage(reason)
                });
        }
    }
}