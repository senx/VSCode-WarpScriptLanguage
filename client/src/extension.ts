'use strict';

import * as path from 'path';
import * as vscode from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient';
import WSHoverProvider from './providers/wsHoverProvider'
import WSDocumentLinksProvider from './providers/wsDocumentLinksProvider'
import WSContentProvider from './providers/wsContentProvider'
import WSDocumentFormattingEditProvider from './providers/wsDocumentFormattingEditProvider'
import ExecCommand from './features/execCommand'
import WSImagebase64Provider from './providers/wsImagebase64Provider'

/**
 * Main extension's entrypoint
 * 
 * @param context 
 */
export function activate(context: vscode.ExtensionContext) {
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
			fileEvents: vscode.workspace.createFileSystemWatcher('**/.clientrc')
		}
	}
	let provider = new WSContentProvider(context)
	context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider('gts-preview', provider));
	let imgprovider = new WSImagebase64Provider(context)
	context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider('data', imgprovider))
	context.subscriptions.push(new LanguageClient('warpscript', 'Warpscript Language Server', serverOptions, clientOptions).start());
	context.subscriptions.push(vscode.languages.registerHoverProvider('warpscript', new WSHoverProvider()));
	context.subscriptions.push(vscode.languages.registerDocumentLinkProvider('warpscript', new WSDocumentLinksProvider()));
	context.subscriptions.push(vscode.commands.registerCommand('extension.execWS', new ExecCommand().exec(outputWin, provider,imgprovider)));
	new WSDocumentFormattingEditProvider();
//	context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider('warpscript', new WSDocumentFormattingEditProvider()));
}
