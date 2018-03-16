import * as vscode from 'vscode';

export default class WSImagebase64Provider implements vscode.TextDocumentContentProvider {
    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
    private content: string
    constructor(
        private context: vscode.ExtensionContext
    ) { }

    
    /**
     * 
     * @param sourceUri 
     * 
     */
    public async provideTextDocumentContent(uri: vscode.Uri): string {
        
        //regexp for base 64 image surrounded by double quotes
        let imgb64Pattern = /"(data:image\/png;base64,(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?)"/g;
        let match: RegExpMatchArray | null;
        let imgcounter=1
        
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
            //console.log("found " + String(i))
            //console.log(match[1])
            htmlContent += `<h2>Image ${imgcounter} </h2>`
            htmlContent += `<img src="${match[1]}" /><br/>`
            
            //link test 1
            htmlContent += '<a href="' + match[1] + '" > download </a>'

            //link test 2
            //https://code.visualstudio.com/docs/extensionAPI/vscode-api-commands#_working-with-the-html-preview
            //let imglink=encodeURI('command:vscode.previewHtml?' + match[1]);
            //htmlContent += '<a href="' + imglink + '" > download </a>'
                            
                            
            //vscode.commands.executeCommand('vscode.previewHtml', vscode.Uri.parse(match[1]), vscode.ViewColumn.Two, 'Image ' + String(imgcounter))
            imgcounter++;

        }
        //htmlContent+=JSON.stringify(this.content,null,3)
        htmlContent+='<br/></br>stack bottom</body>'

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