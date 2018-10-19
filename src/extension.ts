import { StatusbarUi } from './statusbarUi';
'use strict';

import * as vscode from 'vscode';
import WSHoverProvider from './providers/wsHoverProvider'
import WSDocumentLinksProvider from './providers/wsDocumentLinksProvider'
import WSContentProvider from './providers/wsContentProvider'
import WSDocumentFormattingEditProvider from './providers/wsDocumentFormattingEditProvider'
import ExecCommand from './features/execCommand'
import WSImagebase64Provider from './providers/wsImagebase64Provider'
import WSCompletionItemProvider from './providers/wsCompletionItemProvider'
import WSCompletionVariablesProvider from './providers/wsCompletionVariablesProvider'
import WSCompletionMacrosProvider from './providers/wsCompletionMacrosProvider' //TODO
import os = require('os');
/**
 * Main extension's entrypoint
 *
 * @param context
 */
export function activate(context: vscode.ExtensionContext) {
	let outputWin = vscode.window.createOutputChannel('Warp10');
	let wscontentprovider = new WSContentProvider(context);
	let imagebase64provider = new WSImagebase64Provider();
	context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider('gts-preview', wscontentprovider));
	context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider('imagebase64-preview', imagebase64provider))
	context.subscriptions.push(vscode.languages.registerHoverProvider('warpscript', new WSHoverProvider()));
	context.subscriptions.push(vscode.languages.registerCompletionItemProvider('warpscript', new WSCompletionItemProvider()));
	context.subscriptions.push(vscode.languages.registerCompletionItemProvider('warpscript', new WSCompletionVariablesProvider(),"'","$"));
	context.subscriptions.push(vscode.languages.registerCompletionItemProvider('warpscript', new WSCompletionMacrosProvider(),"@","/"));
	context.subscriptions.push(vscode.languages.registerDocumentLinkProvider('warpscript', new WSDocumentLinksProvider()));
	context.subscriptions.push(vscode.commands.registerCommand('extension.execWS', () => { new ExecCommand().exec(outputWin)(""); }));
	context.subscriptions.push(vscode.commands.registerCommand('extension.execWSOnSelection', () => {
		let editor = vscode.window.activeTextEditor;
		if (editor) {
			let selection = editor.selection;
			let text = editor.document.getText(selection);
			new ExecCommand().exec(outputWin)(text);
		}
	}));
	new WSDocumentFormattingEditProvider();
	StatusbarUi.Init();
	//	context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider('warpscript', new WSDocumentFormattingEditProvider()));

	let jsonResultRegEx = new RegExp(os.tmpdir().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '[\/\\\\]' + '\\d{3}\\.json', 'gi');

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
