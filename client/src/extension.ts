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
import WSHoverProvider from './wsHoverProvider'
import WSDocumentLinksProvider from './wsDocumentLinksProvider'

export function activate(context: ExtensionContext) {

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

	context.subscriptions.push( new LanguageClient('warpscript', 'Warpscript Language Server', serverOptions, clientOptions).start());
	context.subscriptions.push(vscode.languages.registerHoverProvider('warpscript', new WSHoverProvider()));
	context.subscriptions.push(vscode.languages.registerDocumentLinkProvider('warpscript', new WSDocumentLinksProvider()));

	let cmd = vscode.commands.registerCommand('extension.execWS', () => {
		let Warp10URL: string = vscode.workspace.getConfiguration().get('warpscript.Warp10URL');
		// The code you place here will be executed every time your command is executed
		var currentlyOpenTabfilePath = vscode.window.activeTextEditor.document.fileName;
		console.log(currentlyOpenTabfilePath)
		vscode.workspace.openTextDocument(currentlyOpenTabfilePath).then((document) => {
			let text = document.getText();
			console.log(text)
			request.post({
				headers: {},
				url: Warp10URL,
				body: text
			}, function (error: any, response: any, body: any) {
				if (error) {
					vscode.window.showErrorMessage(error)
				} else {
					//vscode.window.showInformationMessage('Warpscript executed');
					outputWin.show()
					outputWin.appendLine(new Date().toLocaleTimeString())
					outputWin.appendLine('--- Elapsed time : ' + (+response.headers['x-warp10-elapsed'] / 100000) + ' s')
					outputWin.appendLine('--- Data fetched : ' + response.headers['x-warp10-fetched'])
					outputWin.appendLine('--- Ops count : ' + response.headers['x-warp10-ops'])
					workspace.openTextDocument({ language: 'json' }).then(doc => {
						window.showTextDocument(doc, vscode.window.activeTextEditor.viewColumn + 1).then(tdoc => {
							tdoc.edit(cb => {
								cb.insert(doc.positionAt(0), body)
							})
						})
					});
				}
			});
		});
	});
	context.subscriptions.push(cmd);
}
