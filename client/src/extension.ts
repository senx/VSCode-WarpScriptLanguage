/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';

import * as path from 'path';
import * as vscode from 'vscode';
import * as request from 'request';
import { workspace, ExtensionContext, window } from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient';
import WSHoverProvider from './providers/wsHoverProvider'
import WSDocumentLinksProvider from './providers/wsDocumentLinksProvider'
import WSContentProvider from './providers/wsContentProvider'

export function activate(context: ExtensionContext) {
	let jsonOutput: vscode.TextDocument = undefined

	let outputWin = vscode.window.createOutputChannel('GTS');
	console.log('[client] Congratulations, your extension "Warpscript" is now active! ')
	// The server is implemented in node
	let serverModule = context.asAbsolutePath(path.join('server', 'server.js'));
	// The debug options for the server
	let debugOptions = { execArgv: ["--nolazy", "--inspect=6009"] };


	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	let serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
	}

	// Options to control the language client
	let clientOptions: LanguageClientOptions = {
		// Register the server for warpscript text documents
		documentSelector: [{ scheme: 'file', language: 'warpscript' }],
		synchronize: {
			// Synchronize the setting section 'Warpscript' to the server
			configurationSection: 'warpscript',
			// Notify the server about file changes to '.clientrc files contain in the workspace
			fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
		}
	}
	let provider = new WSContentProvider()
	context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider('gts-preview', provider));
	context.subscriptions.push(new LanguageClient('warpscript', 'Warpscript Language Server', serverOptions, clientOptions).start());
	context.subscriptions.push(vscode.languages.registerHoverProvider('warpscript', new WSHoverProvider()));
	context.subscriptions.push(vscode.languages.registerDocumentLinkProvider('warpscript', new WSDocumentLinksProvider()));

	let cmd = vscode.commands.registerCommand('extension.execWS', () => {
		let Warp10URL: string = vscode.workspace.getConfiguration(null, null).get('warpscript.Warp10URL');
		// The code you place here will be executed every time your command is executed
		var currentlyOpenTabfilePath = vscode.window.activeTextEditor.document.fileName;
		vscode.workspace.openTextDocument(currentlyOpenTabfilePath).then(async (document) => {
			let text = document.getText();
			let macroPattern = /([@][^\s]+)/g;
			let match: RegExpMatchArray | null;
			while ((match = macroPattern.exec(text))) {
				const pre = match[1];
				let macro = WSDocumentLinksProvider.links[pre]
				if (macro) {
					let tdoc = await workspace.openTextDocument(vscode.Uri.parse('file:/' + macro));
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
			}, function (error: any, response: any, body: any) {
				if (error) {
					vscode.window.showErrorMessage(error)
				} else {
					outputWin.show()
					outputWin.appendLine(new Date().toLocaleTimeString())
					outputWin.appendLine('--- Elapsed time : ' + (+response.headers['x-warp10-elapsed'] / 100000) + ' s')
					outputWin.appendLine('--- Data fetched : ' + response.headers['x-warp10-fetched'])
					outputWin.appendLine('--- Ops count : ' + response.headers['x-warp10-ops'])
					if (response.headers['x-warp10-error-message']) {
						let line = parseInt(response.headers['x-warp10-error-line'])
						vscode.window.showErrorMessage('Error at line ' + line + ' : ' + response.headers['x-warp10-error-message'])
						let p: vscode.Position = new vscode.Position(line, 0);
						vscode.window.activeTextEditor.revealRange(new vscode.Range(p, p))
					} else {
						let p: Thenable<vscode.TextDocument>
						if (jsonOutput) {
							p = workspace.openTextDocument(jsonOutput.uri)
						} else {
							p = workspace.openTextDocument({ language: 'json' })
						}

						p.then(doc => {
							jsonOutput = doc
							provider.update(vscode.Uri.parse("gts-preview://authority/gts-preview"), body)
							vscode.commands.executeCommand('vscode.previewHtml', vscode.Uri.parse("gts-preview://authority/gts-preview"), vscode.ViewColumn.Two, 'GTS Preview')
							.then((success) => {
								console.log(success)
							}, (reason) => {
								vscode.window.showErrorMessage(reason);
							});
							window.showTextDocument(doc, vscode.window.activeTextEditor.viewColumn + 1).then(tdoc => {
								tdoc.edit(cb => {
									cb.delete(new vscode.Range(new vscode.Position(0, 0), new vscode.Position(jsonOutput.lineCount, 0)))
									cb.insert(doc.positionAt(0), body)
								})
							}, e => {
								vscode.window.showErrorMessage(e)
							})
						});
					}
				}
			});
		});
	});
	context.subscriptions.push(cmd);
}
