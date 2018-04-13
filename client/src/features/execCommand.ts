import * as vscode from 'vscode';
import * as request from 'request';
import WSDocumentLinksProvider from '../providers/wsDocumentLinksProvider';
import { Uri } from 'vscode';
import fs = require('fs');
import os = require('os');

export default class ExecCommand {

    private static execNumber: number = 0;

    static pad(str: any, size: number, padder: string) { return (padder.repeat(30) + str).substr(-size); }

    public exec(outputWin: vscode.OutputChannel): any {
        return () => {
            // Check current active document is a warpcript
            if (typeof vscode.window.activeTextEditor === 'undefined' || vscode.window.activeTextEditor.document.languageId !== 'warpscript') {
                // Not a warpscript, exit early.
                return;
            }

            let Warp10URL: string = vscode.workspace.getConfiguration(null, null).get('warpscript.Warp10URL');
            let execDate: string = new Date().toLocaleTimeString();
            let document = vscode.window.activeTextEditor.document;
            let baseFilename = document.fileName.split('\\').pop().split('/').pop();

            vscode.window.withProgress<boolean>({
                location: vscode.ProgressLocation.Window,
                title: 'Executing ' + baseFilename + ' on ' + Warp10URL
            }, (progress: vscode.Progress<{ message?: string; }>) => {
                return new Promise(async (c, e) => {
                    progress.report({ message: 'Executing ' + baseFilename + ' on ' + Warp10URL });

                    let executedWarpScript = document.getText();
                    let macroPattern = /@([^\s]+)/g;  // Captures the macro name
                    let match: RegExpMatchArray | null;
                    let lines: number[] = [document.lineCount]
                    let uris: string[] = [document.uri.toString()]

                    while ((match = macroPattern.exec(executedWarpScript))) {  // When text is modified, the search restart from the beggining.
                        const macroName = match[1];
                        await WSDocumentLinksProvider.getMacroURI(macroName).then(
                            async (uri) => {
                                if (uris.indexOf(uri.toString()) === -1) {
                                    let tdoc = await vscode.workspace.openTextDocument(uri);
                                    let macroCode = tdoc.getText()
                                    // Prepend the macro, store it and then append the rest of the script.
                                    executedWarpScript = macroCode + '\n\'' + macroName + '\' STORE\n\n' + executedWarpScript
                                    // Update lines and uris references
                                    lines.unshift(tdoc.lineCount + 2); // 3 '\n' added to define macro so it makes two new lines
                                    uris.unshift(uri.toString());
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
                        timeout: 3600000, // 1 hour
                        body: executedWarpScript
                    }, async (error: any, response: any, body: string) => {
                        if (error) {
                            vscode.window.showErrorMessage(error.message)
                            console.error(error)
                            return e(error)
                        } else {
                            let errorParam: any = null
                            progress.report({ message: 'Parsing response' });

                            if (response.headers['x-warp10-error-message']) {
                                let line = parseInt(response.headers['x-warp10-error-line'])
                                let fileInError;
                                let lineInError = line;
                                for (var i = 0; i < lines.length; i++) {
                                    if (lineInError <= lines[i]) {
                                        fileInError = uris[i];
                                        break;
                                    }
                                    else {
                                        lineInError -= lines[i];
                                    }
                                }
                                errorParam = 'Error in file ' + fileInError + ' at line ' + lineInError + ' : ' + response.headers['x-warp10-error-message'];

                                outputWin.show();
                                outputWin.append('[' + execDate + '] ');
                                outputWin.append('ERROR ');
                                outputWin.append(Uri.parse(uris[i]).fsPath + ':' + lineInError);
                                outputWin.appendLine(' ' + response.headers['x-warp10-error-message']);
                            }
                            if (!response.headers['content-type']) { // If no content-type is specified, response is the JSON representation of the stack

                                // Generate unique filenames, ordered by execution order.
                                let uuid = ExecCommand.pad(ExecCommand.execNumber++, 3, '0');
                                let wsFilename = os.tmpdir() + '/' + uuid + '.mc2';
                                let jsonFilename = os.tmpdir() + '/' + uuid + '.json';

                                // Save executed warpscript
                                fs.unlink(wsFilename, () => { // Remove overwritten file. If file unexistent, fail silently.
                                    fs.writeFile(wsFilename, executedWarpScript, { mode: 0o0400 }, function (err) {
                                        if (err) {
                                            vscode.window.showErrorMessage(err.message);
                                        }
                                    });
                                });


                                // Save resulting JSON
                                fs.unlink(jsonFilename, () => { // Remove overwritten file. If file unexistent, fail silently.
                                    fs.writeFile(jsonFilename, body, { mode: 0o0400 }, function (err) {
                                        if (err) {
                                            vscode.window.showErrorMessage(err.message);
                                            errorParam = err.message;
                                        }
                                        else {
                                            // Display JSON result
                                            vscode.workspace.openTextDocument(jsonFilename).then((doc: vscode.TextDocument) => {
                                                vscode.window.showTextDocument(doc, { viewColumn: vscode.ViewColumn.Two, preview: true, preserveFocus: false }).then(
                                                    () => {
                                                        progress.report({ message: 'Done' });
                                                    },
                                                    (err: any) => {
                                                        vscode.window.showErrorMessage(err.message);
                                                        errorParam = err;
                                                    });
                                            });
                                        }
                                    });
                                });

                                outputWin.show();
                                outputWin.append('[' + execDate + '] ');
                                outputWin.append('file://' + wsFilename);
                                outputWin.append(' => ' + 'file://' + jsonFilename);
                                outputWin.append(' ' + ExecCommand.formatElapsedTime(response.headers['x-warp10-elapsed']));
                                outputWin.append(' ' + ExecCommand.pad(response.headers['x-warp10-fetched'], 10, ' ') + ' fetched ');
                                outputWin.append(ExecCommand.pad(response.headers['x-warp10-ops'], 10, ' ') + ' ops ');
                                outputWin.appendLine(ExecCommand.pad(baseFilename, 23, ' '));
                            }
                            if (errorParam) {
                                e(errorParam)
                            } else {
                                c(true)
                            }
                        }
                    });
                })
            })
        }
    }


    private static formatElapsedTime(elapsed: number) {
        if (elapsed < 1000) {
            return ExecCommand.pad(elapsed.toFixed(3), 7, ' ') + ' ns';
        }
        if (elapsed < 1000000) {
            return ExecCommand.pad((elapsed / 1000).toFixed(3), 7, ' ') + ' μs';
        }
        if (elapsed < 1000000000) {
            return ExecCommand.pad((elapsed / 1000000).toFixed(3), 7, ' ') + ' ms';
        }
        if (elapsed < 1000000000000) {
            return ExecCommand.pad((elapsed / 1000000000).toFixed(3), 7, ' ') + ' s ';
        }
        // Max exec time for nice output: 999.999 minutes (should be OK, timeout should happen before that).
        return ExecCommand.pad((elapsed / 60000000000).toFixed(3), 7, ' ') + ' m ';
    }
}