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
import os = require('os');

/**
 * Main extension's entrypoint
 * 
 * @param context 
 */
export function activate(context: vscode.ExtensionContext) {
	let outputWin = vscode.window.createOutputChannel('Warp10');
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
	let wscontentprovider = new WSContentProvider(context)
	context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider('gts-preview', wscontentprovider));
	let imagebase64provider = new WSImagebase64Provider()
	context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider('imagebase64-preview', imagebase64provider))
	context.subscriptions.push(new LanguageClient('warpscript', 'Warpscript Language Server', serverOptions, clientOptions).start());
	context.subscriptions.push(vscode.languages.registerHoverProvider('warpscript', new WSHoverProvider()));
	context.subscriptions.push(vscode.languages.registerDocumentLinkProvider('warpscript', new WSDocumentLinksProvider()));
	context.subscriptions.push(vscode.commands.registerCommand('extension.execWS', () => {new ExecCommand().exec(outputWin)("");}));
	context.subscriptions.push(vscode.commands.registerCommand('extension.execWSOnSelection', () => {
			let editor = vscode.window.activeTextEditor;
			let selection = editor.selection;
			let text = editor.document.getText(selection);
			console.log(text);
			new ExecCommand().exec(outputWin)(text);
		}));
	new WSDocumentFormattingEditProvider();
	//	context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider('warpscript', new WSDocumentFormattingEditProvider()));

	let jsonResultRegEx = new RegExp(os.tmpdir().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '\/' + '\\d{3}\\.json', 'g');

	let shouldRefresh = true;

	vscode.window.onDidChangeActiveTextEditor((textEditor: vscode.TextEditor) => {
		if (typeof textEditor !== 'undefined' &&
			typeof textEditor.document !== 'undefined' &&
			textEditor.document.languageId === 'json' &&
			textEditor.document.uri.fsPath.match(jsonResultRegEx)) {

			if (shouldRefresh) {
				imagebase64provider.update(vscode.Uri.parse("imagebase64-preview://authority/imagebase64-preview"), textEditor.document);
				wscontentprovider.update(vscode.Uri.parse("gts-preview://authority/gts-preview"), textEditor.document)

				// Restore focus because the preview-html steals the focus.
				vscode.window.showTextDocument(textEditor.document, { viewColumn: textEditor.viewColumn, preview: true, preserveFocus: false });
			}
			// The focus-stealing only appears when both the JSON and the preview-html are on the same view column (the number two).
			if (textEditor.viewColumn == vscode.ViewColumn.Two) {
				shouldRefresh = !shouldRefresh;
			}
		}
	});
}
