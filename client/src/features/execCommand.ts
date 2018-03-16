import * as vscode from 'vscode';
import * as request from 'request';
import WSDocumentLinksProvider from '../providers/wsDocumentLinksProvider';
import WSContentProvider from '../providers/wsContentProvider';
import WSImagebase64Provider from '../providers/wsImagebase64Provider';

export default class ExecCommand {

    private _macrosLoaded: string[] = []

    public exec(outputWin: vscode.OutputChannel, provider: WSContentProvider, imagebase64provider : WSImagebase64Provider): any {
        this._macrosLoaded = []
        return () => {
            let Warp10URL: string = vscode.workspace.getConfiguration(null, null).get('warpscript.Warp10URL');
            vscode.window.withProgress<boolean>({
                location: vscode.ProgressLocation.Window,
                title: 'Executing Warpscript on ' + Warp10URL
            }, (progress: vscode.Progress<{ message?: string; }>) => {
                return new Promise((c, e) => {
                    progress.report({ message: 'Executing Warpscript on ' + Warp10URL });
                    var currentlyOpenTabfilePath = vscode.window.activeTextEditor.document.fileName;
                    vscode.workspace.openTextDocument(currentlyOpenTabfilePath).then(async (document: vscode.TextDocument) => {
                        let text = document.getText();
                        let macroPattern = /([@][^\s]+)/g;
                        let match: RegExpMatchArray | null;
                        while ((match = macroPattern.exec(text))) {
                            const pre = match[1];
                            let macro = WSDocumentLinksProvider.links[pre]
                            if (macro && '/' + macro !== currentlyOpenTabfilePath && this._macrosLoaded.indexOf(macro) === -1) {
                                console.log('found', macro)
                                this._macrosLoaded.push(macro)
                                let tdoc = await vscode.workspace.openTextDocument(vscode.Uri.parse('file:/' + macro));
                                let macroCode = tdoc.getText()
                                if (macroCode.trim().match(/[^\s]+$/)) {
                                    macroCode += ' EVAL'
                                }
                                text = text.replace(pre, '\n' + macroCode + ' \n')
                            }
                        }
                        request.post({
                            headers: {},
                            url: Warp10URL,
                            body: text
                        }, (error: any, response: any, body: string) => {
                            if (error) {
                                vscode.window.showErrorMessage(error)
                                console.error(error)
                                return e(error)
                            } else {
                                progress.report({ message: 'Parsing response' });
                                outputWin.show()
                                outputWin.appendLine(new Date().toLocaleTimeString())
                                outputWin.appendLine(`--- Elapsed time : ${this._formatElapsedTime(response.headers['x-warp10-elapsed'])}`)
                                outputWin.appendLine('--- Data fetched : ' + response.headers['x-warp10-fetched'])
                                outputWin.appendLine('--- Ops count : ' + response.headers['x-warp10-ops'])
                                if (response.headers['x-warp10-error-message']) {
                                    let line = parseInt(response.headers['x-warp10-error-line'])
                                    vscode.window.showErrorMessage('Error at line ' + line + ' : ' + response.headers['x-warp10-error-message'])
                                    let p: vscode.Position = new vscode.Position(line, 0);
                                    vscode.window.activeTextEditor.revealRange(new vscode.Range(p, p))
                                    return e('Error at line ' + line + ' : ' + response.headers['x-warp10-error-message'])
                                } else {
                                    provider.update(vscode.Uri.parse("gts-preview://authority/gts-preview"), body)
                                    imagebase64provider.update(vscode.Uri.parse("data:image/png;base64"), body);
                                    vscode.commands.executeCommand('vscode.previewHtml', vscode.Uri.parse("gts-preview://authority/gts-preview"), vscode.ViewColumn.Two, 'GTS Preview')
                                        .then(() => {
                                            // nothing
                                        }, (reason: any) => {
                                            vscode.window.showErrorMessage(reason)
                                        });

         
                                        
                                    vscode.workspace.openTextDocument({ language: 'json' }).then((doc: vscode.TextDocument) => {
                                        
                                        vscode.window.showTextDocument(doc, vscode.window.activeTextEditor.viewColumn + 1,true).then((tdoc: vscode.TextEditor) => {
                                            tdoc.edit((cb: vscode.TextEditorEdit) => {
                                                cb.insert(doc.positionAt(0), body)
                                                progress.report({ message: 'Done' });
                                                return c(true)
                                            })
                                        }, (e: any) => {
                                            vscode.window.showErrorMessage(e)
                                            return e(e)
                                        });
                                        
                                    });
                                    
                                    vscode.commands.executeCommand('vscode.previewHtml',vscode.Uri.parse("data:image/png;base64"), vscode.ViewColumn.Two,'Image Preview')
                                        .then(() => {
                                            // nothing
                                        }, (reason: any) => {
                                            vscode.window.showErrorMessage(reason)
                                        });  
                                }
                            }
                        });
                    }, (e: any) => {
                        console.error(e)
                        vscode.window.showErrorMessage(e)
                        return e(e)
                    });
                })
            })
        }
    }
    private _formatElapsedTime(elapsed: number) {
        if (elapsed < 1000) {
            return '' + elapsed + ' ns';
        }
        if (elapsed < 1000000) {
            return '' + (elapsed / 1000).toFixed(3) + ' μs';
        }
        if (elapsed < 1000000000) {
            return '' + (elapsed / 1000000).toFixed(3) + ' ms';
        }
        return '' + (elapsed / 1000000000).toFixed(3) + ' s';
    }
}