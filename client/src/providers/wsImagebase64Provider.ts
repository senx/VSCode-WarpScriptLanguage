import * as vscode from 'vscode';

export default class WSImagebase64Provider implements vscode.TextDocumentContentProvider {
    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
    private content: string
    constructor() { }


    /**
     * 
     * @param sourceUri 
     * 
     */
    public async provideTextDocumentContent(): Promise<string> {
        //regexp for base 64 image surrounded by double quotes
        let imgb64Pattern = /"(data:image\/png;base64,(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?)"/g;
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

        while ((match = imgb64Pattern.exec(this.content))) {
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
    public update(uri: vscode.Uri, content: string) {
        this.content = content
        this._onDidChange.fire(uri);
    }
}