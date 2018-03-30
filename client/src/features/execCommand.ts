import * as vscode from 'vscode';
import * as request from 'request';
import WSDocumentLinksProvider from '../providers/wsDocumentLinksProvider';
import WSContentProvider from '../providers/wsContentProvider';
import WSImagebase64Provider from '../providers/wsImagebase64Provider';

export default class ExecCommand {
    public exec(outputWin: vscode.OutputChannel, provider: WSContentProvider, imagebase64provider: WSImagebase64Provider): any {
        return () => {
            let Warp10URL: string = vscode.workspace.getConfiguration(null, null).get('warpscript.Warp10URL');
            vscode.window.withProgress<boolean>({
                location: vscode.ProgressLocation.Window,
                title: 'Executing Warpscript on ' + Warp10URL
            }, (progress: vscode.Progress<{ message?: string; }>) => {
                return new Promise((c, e) => {
                    progress.report({ message: 'Executing Warpscript on ' + Warp10URL });
                    var currentlyOpenTabUri = vscode.window.activeTextEditor.document.uri;
                    vscode.workspace.openTextDocument(currentlyOpenTabUri).then(async (document: vscode.TextDocument) => {
                        let text = document.getText();
                        let alreadyLoadedMacros: string[] = []
                        let macroPattern = /@([^\s]+)/g;  // Captures the macro name
                        let match: RegExpMatchArray | null;
                        console.log('Looking for macros...')

                        while ((match = macroPattern.exec(text))) {  // When text is modified, the search restart from the beggining.
                            const macroName = match[1];
                            await WSDocumentLinksProvider.getMacroURI(macroName).then(
                                async (uri) => {
                                    console.log('Found used macro', macroName);
                                    if (uri !== currentlyOpenTabUri && alreadyLoadedMacros.indexOf(uri.path) === -1) {
                                        console.log('Included macro', uri.path)
                                        alreadyLoadedMacros.push(uri.path)
                                        let tdoc = await vscode.workspace.openTextDocument(uri);
                                        let macroCode = tdoc.getText()
                                        // Prepend the macro, store it and then append the rest of the script.
                                        text = macroCode + '\n\'' + macroName + '\' STORE\n\n' + text
                                    }
                                }
                            ).catch(
                                () => { /* Ignore missing macros */ }
                            );

                        }
                        request.post({
                            headers: {},
                            url: Warp10URL, 
                            gzip: true,
                            body: text
                        }, (error: any, response: any, body: string) => {
                            if (error) {
                                vscode.window.showErrorMessage(error)
                                console.error(error)
                                return e(error)
                            } else {
                                let errorParam: any = null
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
                                    errorParam = 'Error at line ' + line + ' : ' + response.headers['x-warp10-error-message']
                                } 
                                if (!response.headers['content-type']) { // If no content-type is specified, response is the JSON representation of the stack
                                    provider.update(vscode.Uri.parse("gts-preview://authority/gts-preview"), body)
                                    imagebase64provider.update(vscode.Uri.parse("data:image/png;base64"), body);

                                    vscode.commands.executeCommand('vscode.previewHtml', vscode.Uri.parse("gts-preview://authority/gts-preview"), vscode.ViewColumn.Two, 'GTS Preview')
                                        .then(() => {
                                            // nothing
                                        }, (reason: any) => {
                                            vscode.window.showErrorMessage(reason)
                                        });        
                                        
                                    vscode.workspace.openTextDocument({ language: 'json' }).then((doc: vscode.TextDocument) => {
                                        vscode.window.showTextDocument(doc, vscode.ViewColumn.Two, true).then((tdoc: vscode.TextEditor) => {
                                            tdoc.edit((cb: vscode.TextEditorEdit) => {
                                                cb.insert(doc.positionAt(0), body)
                                                progress.report({ message: 'Done' });
                                            })
                                        }, (e: any) => {
                                            vscode.window.showErrorMessage(e)
                                            errorParam = e
                                        });

                                    });

                                    vscode.commands.executeCommand('vscode.previewHtml', vscode.Uri.parse("data:image/png;base64"), vscode.ViewColumn.Two, 'Image Preview')
                                        .then(() => {
                                            // nothing
                                        }, (reason: any) => {
                                            vscode.window.showErrorMessage(reason)
                                        });
                                }

                                if (errorParam) {
                                    e(errorParam)
                                } else {
                                    c(true)
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