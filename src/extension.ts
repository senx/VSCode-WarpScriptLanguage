import { StatusbarUi } from './statusbarUi';
'use strict';

import * as vscode from 'vscode';
import WSHoverProvider from './providers/wsHoverProvider'
import WSDocumentLinksProvider from './providers/wsDocumentLinksProvider'
//import WSContentProvider from './providers/wsContentProvider'
import WSDocumentFormattingEditProvider from './providers/wsDocumentFormattingEditProvider'
import ExecCommand from './features/execCommand'
import CloseJsonResults from './features/closeJsonResults'
//import WSImagebase64Provider from './providers/wsImagebase64Provider'
import WSCompletionItemProvider from './providers/wsCompletionItemProvider'
import WSCompletionVariablesProvider from './providers/wsCompletionVariablesProvider'
import WSCompletionMacrosProvider from './providers/wsCompletionMacrosProvider' //TODO
import WarpScriptExtConstants from './constants'
import WarpStriptExtGlobals = require('./globals')
import GTSPreviewWebview from './webviews/gtsPreview'
import ImagePreviewWebview from './webviews/imagePreview'


/**
 * Main extension's entrypoint
 *
 * @param context
 */
export function activate(context: vscode.ExtensionContext) {
	let outputWin = vscode.window.createOutputChannel('Warp10');
	// let wscontentprovider = new WSContentProvider(context);
	// let imagebase64provider = new WSImagebase64Provider();
	// context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider('gts-preview', wscontentprovider));
	// context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider('imagebase64-preview', imagebase64provider))
	context.subscriptions.push(vscode.languages.registerHoverProvider({ language: 'warpscript' }, new WSHoverProvider()));
	context.subscriptions.push(vscode.languages.registerCompletionItemProvider({ language: 'warpscript' }, new WSCompletionItemProvider()));
	context.subscriptions.push(vscode.languages.registerCompletionItemProvider({ language: 'warpscript' }, new WSCompletionVariablesProvider(), "'", "$"));
	context.subscriptions.push(vscode.languages.registerCompletionItemProvider({ language: 'warpscript' }, new WSCompletionMacrosProvider(), "@", "/"));
	context.subscriptions.push(vscode.languages.registerDocumentLinkProvider({ language: 'warpscript' }, new WSDocumentLinksProvider()));
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




	//webview panels for dataviz. will be created only when needed.
	let gtsPreviewPanel: vscode.WebviewPanel = null;
	let imagePreviewPanel: vscode.WebviewPanel = null;

	let gtsPreviewWebview = new GTSPreviewWebview(context);
	let imagePreviewWebview = new ImagePreviewWebview();
	let jsonResultRegEx = new WarpScriptExtConstants().jsonResultRegEx;

	//each time focus change, we look at the file type and file name. Json + special name => stack preview.
	vscode.window.onDidChangeActiveTextEditor((textEditor: vscode.TextEditor) => {
		if (!WarpStriptExtGlobals.weAreClosingFilesFlag &&
			typeof textEditor !== 'undefined' &&
			typeof textEditor.document !== 'undefined' &&
			textEditor.document.languageId === 'json' &&
			textEditor.document.uri.fsPath.match(jsonResultRegEx)) {

			let suffixes = jsonResultRegEx.exec(textEditor.document.uri.fsPath);
			//look for a timeUnit indication into the json name
			let timeUnit: string = suffixes[1] || 'u';
			timeUnit = timeUnit + 's';
			//look for a preview setting into the json name
			let previewSetting: string = suffixes[2] || '';
			console.log("preview=" + previewSetting);

			if (previewSetting != 'X' && vscode.workspace.getConfiguration().get('warpscript.PreviewTabs') != 'none') {

				//gtsPreview panel
				if (gtsPreviewPanel == null) {
					gtsPreviewPanel = vscode.window.createWebviewPanel('gtspreview', 'GTS preview',
						{ viewColumn: vscode.ViewColumn.Two, preserveFocus: true },
						{ enableScripts: true });
					//the first time the panel appears, it steals focus. restore the view 500ms later.
					if (previewSetting == '') {
						setTimeout(() => {
							vscode.window.showTextDocument(textEditor.document, { preview: true, preserveFocus: false });
						}, 500);
					}
					//when closed by the user
					gtsPreviewPanel.onDidDispose(() => { gtsPreviewPanel = null; })
				}
				//refresh gtsPreview 
				gtsPreviewWebview.getHtmlContent(textEditor.document.getText(), timeUnit).then(htmlcontent => {
					gtsPreviewPanel.webview.html = htmlcontent;
				})

				//imagePreview panel, if one image found
				imagePreviewWebview.imagesFound(textEditor.document.getText()).then(images => {
					if (images) {
						if (imagePreviewPanel == null) {
							imagePreviewPanel = vscode.window.createWebviewPanel('imagepreview', 'Images',
								{ viewColumn: vscode.ViewColumn.Two, preserveFocus: true },
								{ enableScripts: true });
							//the first time the panel appears, it steals focus. restore the view 500ms later.
							if (previewSetting == '') {
								setTimeout(() => {
									vscode.window.showTextDocument(textEditor.document, { preview: true, preserveFocus: false });
								}, 500);
							}
							//when closed by the user
							imagePreviewPanel.onDidDispose(() => { imagePreviewPanel = null; })
						}
						imagePreviewWebview.getHtmlContent(textEditor.document.getText()).then(htmlcontent => {
							imagePreviewPanel.webview.html = htmlcontent;
						})
					}
				})

				//focus if focus forced by option
				if (previewSetting == 'G' && gtsPreviewPanel != null) {
					setTimeout(() => {
						gtsPreviewPanel.reveal(vscode.ViewColumn.Two);
					}, 200);
				}
				if (previewSetting == 'I' && imagePreviewPanel != null) {
					setTimeout(() => {
						imagePreviewPanel.reveal(vscode.ViewColumn.Two);
					}, 200);
				}
			} else {
				//preview none , close the existing previews.
				if (imagePreviewPanel != null) { imagePreviewPanel.dispose(); }
				if (gtsPreviewPanel != null) { gtsPreviewPanel.dispose(); }
			}
		}
	});
}
