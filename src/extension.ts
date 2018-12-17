import { StatusbarUi } from './statusbarUi';
'use strict';

import * as vscode from 'vscode';
import WSHoverProvider from './providers/wsHoverProvider'
import WSDocumentLinksProvider from './providers/wsDocumentLinksProvider'
import WSContentProvider from './providers/wsContentProvider'
import WSDocumentFormattingEditProvider from './providers/wsDocumentFormattingEditProvider'
import ExecCommand from './features/execCommand'
import CloseJsonResults from './features/closeJsonResults'
import WSImagebase64Provider from './providers/wsImagebase64Provider'
import WSCompletionItemProvider from './providers/wsCompletionItemProvider'
import WSCompletionVariablesProvider from './providers/wsCompletionVariablesProvider'
import WSCompletionMacrosProvider from './providers/wsCompletionMacrosProvider' //TODO
import WarpScriptExtConstants from './constants'
import WarpStriptExtGlobals = require('./globals')
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
	context.subscriptions.push(vscode.languages.registerCompletionItemProvider('warpscript', new WSCompletionVariablesProvider(), "'", "$"));
	context.subscriptions.push(vscode.languages.registerCompletionItemProvider('warpscript', new WSCompletionMacrosProvider(), "@", "/"));
	context.subscriptions.push(vscode.languages.registerDocumentLinkProvider('warpscript', new WSDocumentLinksProvider()));
	context.subscriptions.push(vscode.commands.registerCommand('extension.execCloseJsonResults', () => { new CloseJsonResults().exec(); }));
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

	let jsonResultRegEx = new WarpScriptExtConstants().jsonResultRegEx;

	let shouldRefresh = true;

	vscode.window.onDidChangeActiveTextEditor((textEditor: vscode.TextEditor) => {
		if (!WarpStriptExtGlobals.weAreClosingFilesFlag &&
			typeof textEditor !== 'undefined' &&
			typeof textEditor.document !== 'undefined' &&
			textEditor.document.languageId === 'json' &&
			textEditor.document.uri.fsPath.match(jsonResultRegEx)) {
			//look for a timeUnit indication into the json name
			let timeUnit: string = jsonResultRegEx.exec(textEditor.document.uri.fsPath)[1] || 'u';
			timeUnit = timeUnit + 's';
			if (shouldRefresh) {
				imagebase64provider.update(vscode.Uri.parse("imagebase64-preview://authority/imagebase64-preview"), textEditor.document);
				wscontentprovider.update(vscode.Uri.parse(`gts-preview://authority/gts-preview?timeUnit=${timeUnit}`), textEditor.document).then(() => {
					shouldRefresh = false;
					vscode.window.showTextDocument(textEditor.document, { preview: true, preserveFocus: false }).then(() => {
						setTimeout(() => {
							shouldRefresh = true;
						}, 500);
					});
				});
			}
		}
	});
}
