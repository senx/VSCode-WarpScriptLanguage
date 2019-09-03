import { StatusbarUi } from './statusbarUi';
'use strict';

import * as vscode from 'vscode';
import WSHoverProvider from './providers/wsHoverProvider'
//import WSFoldingRangeProvider from './providers/wsFoldingRangeProvider'
import WSCodeLensProvider from './providers/wsCodeLensProvider'
import WSDocumentHighlightsProvider from './providers/wsDocumentHighlightsProviders'
import WSDocumentLinksProvider from './providers/wsDocumentLinksProvider'
//import WSContentProvider from './providers/wsContentProvider'
import WSDocumentFormattingEditProvider from './providers/wsDocumentFormattingEditProvider'
import ExecCommand from './features/execCommand'
import CloseJsonResults from './features/closeJsonResults'
import UnicodeJsonConversion from './features/unicodeJsonConversion'
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
  let previewPanels: { 'image': vscode.WebviewPanel, 'gts': vscode.WebviewPanel } = { 'image': null, 'gts': null }; //constant object ref to pass to closeOpenedWebviews

  context.subscriptions.push(vscode.languages.registerHoverProvider({ language: 'warpscript' }, new WSHoverProvider()));
  context.subscriptions.push(vscode.languages.registerCompletionItemProvider({ language: 'warpscript' }, new WSCompletionItemProvider()));
  context.subscriptions.push(vscode.languages.registerCompletionItemProvider({ language: 'warpscript' }, new WSCompletionVariablesProvider(), "'", "$"));
  context.subscriptions.push(vscode.languages.registerCompletionItemProvider({ language: 'warpscript' }, new WSCompletionMacrosProvider(), "@", "/"));
  //context.subscriptions.push(vscode.languages.registerFoldingRangeProvider({ language: 'warpscript' }, new WSFoldingRangeProvider()));
  context.subscriptions.push(vscode.languages.registerCodeLensProvider({ language: 'warpscript' }, new WSCodeLensProvider()));
  context.subscriptions.push(vscode.languages.registerDocumentHighlightProvider({ language: 'warpscript' }, new WSDocumentHighlightsProvider()));
  context.subscriptions.push(vscode.languages.registerDocumentLinkProvider({ language: 'warpscript' }, new WSDocumentLinksProvider()));
  context.subscriptions.push(vscode.commands.registerCommand('extension.execCloseJsonResults', () => { new CloseJsonResults().exec(previewPanels); }));
  context.subscriptions.push(vscode.commands.registerCommand('extension.execConvertUnicodeInJson', () => { new UnicodeJsonConversion().exec(); }));
  context.subscriptions.push(vscode.commands.registerCommand('extension.execWS', () => { new ExecCommand().exec(outputWin)(""); }));
  context.subscriptions.push(vscode.commands.registerCommand('extension.execWSOnSelection', () => {
    let editor = vscode.window.activeTextEditor;
    if (editor) {
      let selection = editor.selection;
      let text = editor.document.getText(selection);
      new ExecCommand().exec(outputWin)(text);
    }
  }));
  context.subscriptions.push(vscode.commands.registerCommand('extension.jumptoWSoffset', (offset: number) => {
    //console.log("try to jump to offset ", offset)
    //this short command allow to do links inside the document. it jumps to the required text offset, if a word is found. it selects the word.
    let editor = vscode.window.activeTextEditor;
    if (editor) {
      let wordRange: vscode.Range = editor.document.getWordRangeAtPosition(editor.document.positionAt(offset));
      if (wordRange !== undefined) {
        editor.selections = [new vscode.Selection(wordRange.start, wordRange.end)];
        editor.revealRange(wordRange, vscode.TextEditorRevealType.InCenterIfOutsideViewport);
      }
    }
  }));

  new WSDocumentFormattingEditProvider();
  StatusbarUi.Init();




  //webview panels for dataviz. will be created only when needed.
  // let previewPanels.gts: vscode.WebviewPanel = null;
  // let previewPanels.image: vscode.WebviewPanel = null;

  let gtsPreviewWebview = new GTSPreviewWebview(context);
  let imagePreviewWebview = new ImagePreviewWebview(context);
  let jsonResultRegEx = new WarpScriptExtConstants().jsonResultRegEx;
  let latestJSONdisplayed: string = '';

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

      // do not refresh preview when the preview window when selecting the json of the current preview
      let alreadypreviewed: boolean = (latestJSONdisplayed == textEditor.document.fileName);
      latestJSONdisplayed = textEditor.document.fileName;

      if (previewSetting != 'X' && vscode.workspace.getConfiguration().get('warpscript.PreviewTabs') != 'none' && !alreadypreviewed) {

        //gtsPreview panel
        if (previewPanels.gts == null) {
          previewPanels.gts = vscode.window.createWebviewPanel('gtspreview', 'GTS preview',
            { viewColumn: vscode.ViewColumn.Two, preserveFocus: true },
            { enableScripts: true, retainContextWhenHidden: true });
          //the first time the panel appears, it steals focus. restore the view 500ms later.
          if (previewSetting == '') {
            setTimeout(() => {
              vscode.window.showTextDocument(textEditor.document, { preview: true, preserveFocus: false });
            }, 500);
          }
          //when closed by the user
          previewPanels.gts.onDidDispose(() => { previewPanels.gts = null; })
        }
        //refresh gtsPreview 
        gtsPreviewWebview.getHtmlContent(textEditor.document.getText(), timeUnit).then(htmlcontent => {
          previewPanels.gts.webview.html = htmlcontent;
        })

        //imagePreview panel, if one image found
        imagePreviewWebview.findImages(textEditor.document.getText(), textEditor.document.getText().length > 500000).then(imageList => {
          if (imageList.length > 0) {
            if (previewPanels.image == null) {
              previewPanels.image = vscode.window.createWebviewPanel('imagepreview', 'Images',
                { viewColumn: vscode.ViewColumn.Two, preserveFocus: true },
                { enableScripts: true, retainContextWhenHidden: true });
              //the first time the panel appears, it steals focus. restore the view 500ms later.
              if (previewSetting == '') {
                setTimeout(() => {
                  vscode.window.showTextDocument(textEditor.document, { preview: true, preserveFocus: false });
                }, 500);
              }
              //when closed by the user
              previewPanels.image.onDidDispose(() => { previewPanels.image = null; })
            }
            imagePreviewWebview.getHtmlContent(imageList).then(htmlcontent => {
              previewPanels.image.webview.html = htmlcontent;
            })
          }
        })

        //focus if focus forced by option
        if (previewSetting == 'G' && previewPanels.gts != null) {
          setTimeout(() => {
            previewPanels.gts.reveal(vscode.ViewColumn.Two);
          }, 200);
        }
        if (previewSetting == 'I' && previewPanels.image != null) {
          setTimeout(() => {
            previewPanels.image.reveal(vscode.ViewColumn.Two);
          }, 200);
        }
      }
    }
  });
}
