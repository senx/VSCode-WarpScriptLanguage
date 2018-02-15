/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';

import * as path from 'path';
import * as vscode from 'vscode';
import { workspace, ExtensionContext } from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient';

export function activate(context: ExtensionContext) {
	const Warp10URL = vscode.workspace.getConfiguration().get('warpscript.Warp10URL');
	console.log('[client] Congratulations, your extension "Warpscript" is now active! ', Warp10URL)
	// The server is implemented in node
	let serverModule = context.asAbsolutePath(path.join('server', 'server.js'));
	// The debug options for the server
	let debugOptions = { execArgv: ["--nolazy", "--inspect=6009"] };
	
	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	let serverOptions: ServerOptions = {
		run : { module: serverModule, transport: TransportKind.ipc },
		debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
	}
	
	// Options to control the language client
	let clientOptions: LanguageClientOptions = {
		// Register the server for warpscript text documents
		documentSelector: [{scheme: 'file', language: 'warpscript' }],
		synchronize: {
			// Synchronize the setting section 'Warpscript' to the server
			configurationSection: 'warpscript',
			// Notify the server about file changes to '.clientrc files contain in the workspace
			fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
		}
	}
	
	// Create the language client and start the client.
	let disposable = new LanguageClient('warpscript', 'Warpscript Language Server', serverOptions, clientOptions).start();
	
	// Push the disposable to the context's subscriptions so that the 
	// client can be deactivated on extension deactivation
	context.subscriptions.push(disposable);

	let cmd = vscode.commands.registerCommand('extension.execWS', () => {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
		vscode.window.showInformationMessage('Hello World!');
		var currentlyOpenTabfilePath = vscode.window.activeTextEditor.document.fileName;
		console.log(currentlyOpenTabfilePath)
		vscode.workspace.openTextDocument(currentlyOpenTabfilePath).then((document) => {
			let text = document.getText();
			console.log(text)
		//	vscode.window.showInformationMessage(text);
		  }); 
    });
	context.subscriptions.push(cmd);
}
