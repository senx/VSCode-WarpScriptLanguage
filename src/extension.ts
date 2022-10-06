// 'use strict';
import { StatusbarUi } from './statusbarUi';
import { WSHoverProvider } from './providers/hover/WSHoverProvider'
import WSCodeLensProvider from './providers/wsCodeLensProvider'
import WSDocumentHighlightsProvider from './providers/wsDocumentHighlightsProviders'
import WSDocumentLinksProvider from './providers/wsDocumentLinksProvider'
import WSDocumentFormattingEditProvider from './providers/wsDocumentFormattingEditProvider'
import ExecCommand from './features/execCommand'
import CloseJsonResults from './features/closeJsonResults'
import UnicodeJsonConversion from './features/unicodeJsonConversion'
import WSCompletionItemProvider from './providers/completion/WSCompletionItemProvider'
import WSCompletionVariablesProvider from './providers/wsCompletionVariablesProvider'
import WSCompletionMacrosProvider from './providers/wsCompletionMacrosProvider' // TODO
import WarpScriptExtConstants from './constants'
import WarpScriptExtGlobals = require('./globals')
import GTSPreviewWebview from './webviews/gtsPreview'
import ImagePreviewWebview from './webviews/imagePreview'
import DiscoveryPreviewWebview from './webviews/discoveryPreview'
import { v4 } from 'uuid';
import FlowsCompletionItemProvider from './providers/completion/FlowsCompletionItemProvider';
import { FlowsHoverProvider } from './providers/hover/FlowsHoverProvider';
import { FLoWSBeautifier } from '@senx/flows-beautifier';
import { commands, ExtensionContext, languages, Range, Selection, TextDocument, TextEdit, TextEditor, TextEditorRevealType, TextLine, ViewColumn, WebviewPanel, window, workspace } from 'vscode';
import { userInfo } from 'os';


export class SharedMem {
  private static registry: any = {};
  public static set(uid: string, content: any) {
    SharedMem.registry[uid] = content;
  }
  public static get(uid: string): any {
    return SharedMem.registry[uid];
  }

  public static log() {
    console.log({ registry: SharedMem.registry })
  }
}

/**
 * Main extension's entrypoint
 *
 * @param context
 */
export function activate(context: ExtensionContext) {
  WarpScriptExtConstants.jsonResultRegEx().then(jsonResultRegEx => {
    console.log('About to load')
    StatusbarUi.Init();
    console.log('StatusbarUi loaded')
    let outputWin = window.createOutputChannel('Warp10');
    // constant object ref to pass to closeOpenedWebviews
    let previewPanels: { 'image': WebviewPanel, 'gts': WebviewPanel, 'discovery': WebviewPanel } = { 'image': null, 'gts': null, 'discovery': null };

    // Hover providers
    context.subscriptions.push(languages.registerHoverProvider({ language: 'warpscript' }, new WSHoverProvider()));
    context.subscriptions.push(languages.registerHoverProvider({ language: 'flows' }, new FlowsHoverProvider()));
    console.log('Hover providers loaded');

    // Completion providers
    context.subscriptions.push(languages.registerCompletionItemProvider({ language: 'warpscript' }, new WSCompletionItemProvider()));
    context.subscriptions.push(languages.registerCompletionItemProvider({ language: 'flows' }, new FlowsCompletionItemProvider()));
    context.subscriptions.push(languages.registerCompletionItemProvider({ language: 'warpscript' }, new WSCompletionVariablesProvider(), "'", "$"));
    console.log('Completion providers loaded');
    // TODO
    // context.subscriptions.push(vscode.languages.registerCompletionItemProvider({ language: 'flows' }, new WSCompletionVariablesProvider(), "'"));
    context.subscriptions.push(languages.registerCompletionItemProvider({ language: 'warpscript' }, new WSCompletionMacrosProvider(), "@", "/"));
    context.subscriptions.push(languages.registerCompletionItemProvider({ language: 'flows' }, new WSCompletionMacrosProvider(), "@", "/"));

    // TODO
    // context.subscriptions.push(vscode.languages.registerFoldingRangeProvider({ language: 'warpscript' }, new WSFoldingRangeProvider()));
    // these providers could be disabled:
    if (workspace.getConfiguration().get("warpscript.enableInlineHelpers")) {
      context.subscriptions.push(languages.registerCodeLensProvider({ language: 'warpscript' }, new WSCodeLensProvider()));
      context.subscriptions.push(languages.registerDocumentHighlightProvider({ language: 'warpscript' }, new WSDocumentHighlightsProvider()));
    }
    context.subscriptions.push(languages.registerDocumentLinkProvider({ language: 'warpscript' }, new WSDocumentLinksProvider()));
    console.log('Languages loaded');

    context.subscriptions.push(commands.registerCommand('extension.execCloseJsonResults', () => { new CloseJsonResults().exec(previewPanels); }));
    context.subscriptions.push(commands.registerCommand('extension.execConvertUnicodeInJson', () => { new UnicodeJsonConversion().exec(); }));
    context.subscriptions.push(commands.registerCommand('extension.execWS', () => { new ExecCommand().exec(outputWin)(''); }));
    context.subscriptions.push(commands.registerCommand('extension.abortAllWS', () => { new ExecCommand().abortAllRequests(outputWin)(); }))
    context.subscriptions.push(commands.registerCommand('extension.execWSOnSelection', () => {
      let editor = window.activeTextEditor;
      if (editor) {
        let selection = editor.selection;
        let text = editor.document.getText(selection);
        new ExecCommand().exec(outputWin)(text);
      }
    }));
    context.subscriptions.push(commands.registerCommand('extension.jumptoWSoffset', (offset: number) => {
      // console.log("try to jump to offset ", offset)
      // this short command allow to do links inside the document. it jumps to the required text offset, if a word is found. it selects the word.
      let editor = window.activeTextEditor;
      if (editor) {
        let wordRange: Range = editor.document.getWordRangeAtPosition(editor.document.positionAt(offset));
        if (wordRange !== undefined) {
          editor.selections = [new Selection(wordRange.start, wordRange.end)];
          editor.revealRange(wordRange, TextEditorRevealType.InCenterIfOutsideViewport);
        }
      }
    }));
    console.log('Commands loaded');

    context.subscriptions.push(
      languages.registerDocumentFormattingEditProvider('flows', {
        provideDocumentFormattingEdits(document: TextDocument): TextEdit[] {

          let firstLine: TextLine = document.lineAt(0);
          let lastLine: TextLine = document.lineAt(document.lineCount - 1);
          let textRange: Range = new Range(firstLine.range.start, lastLine.range.end);
          let beautifier: FLoWSBeautifier = new FLoWSBeautifier();
          let newCode: string = beautifier.flowsBeautify(document.getText());
          // brutal replace all.
          return [TextEdit.replace(textRange, newCode)];
        }
      })
    );
    console.log('FLoWS loaded');

    new WSDocumentFormattingEditProvider();
    // webview panels for dataviz. will be created only when needed.
    // let previewPanels.gts: vscode.WebviewPanel = null;
    // let previewPanels.image: vscode.WebviewPanel = null;
    let gtsPreviewWebview = new GTSPreviewWebview(context);
    let discoveryPreviewWebview = new DiscoveryPreviewWebview(context);
    let imagePreviewWebview = new ImagePreviewWebview(context);
    let latestJSONdisplayed: string = '';

    //each time focus change, we look at the file type and file name. Json + special name => stack preview.
    window.onDidChangeActiveTextEditor((textEditor: TextEditor) => {
      StatusbarUi.Init();
      if (!WarpScriptExtGlobals.weAreClosingFilesFlag &&
        typeof textEditor !== 'undefined' &&
        typeof textEditor.document !== 'undefined' &&
        textEditor.document.languageId === 'json' &&
        textEditor.document.uri.fsPath.match(jsonResultRegEx)) {

        let suffixes = jsonResultRegEx.exec(textEditor.document.uri.fsPath);
        //look for a timeUnit indication into the json name
        const uuid: string = suffixes[1] || '';
        let timeUnit: string = suffixes[2] || 'u';
        timeUnit = timeUnit + 's';
        //look for a preview setting into the json name
        let previewSetting: string = suffixes[3] || '';
        console.log("preview=" + previewSetting);

        // do not refresh preview when the preview window when selecting the json of the current preview
        let alreadypreviewed: boolean = (latestJSONdisplayed == textEditor.document.fileName);
        latestJSONdisplayed = textEditor.document.fileName;

        if (previewSetting != 'X' && workspace.getConfiguration().get('warpscript.PreviewTabs') !== 'none' && !alreadypreviewed) {

          if (previewSetting == "J") {
            console.log("format json !")
            commands.executeCommand("editor.action.formatDocument");
          }
          // gtsPreview panel
          if (previewPanels.gts == null) {
            previewPanels.gts = window.createWebviewPanel('gtspreview', 'GTS preview',
              { viewColumn: ViewColumn.Two, preserveFocus: true },
              { enableScripts: true, retainContextWhenHidden: true });
            // the first time the panel appears, it steals focus. restore the view 500ms later.
            if (previewSetting == '') {
              setTimeout(() => window.showTextDocument(textEditor.document, { preview: true, preserveFocus: false }), 500);
            }
            // when closed by the user
            previewPanels.gts.onDidDispose(() => { previewPanels.gts = null; })
          }
          // refresh gtsPreview 
          gtsPreviewWebview.getHtmlContent(textEditor.document.getText(), timeUnit).then(htmlcontent => setTimeout(() => previewPanels.gts.webview.html = htmlcontent))

          // imagePreview panel, if one image found
          imagePreviewWebview.findImages(textEditor.document.getText(), textEditor.document.getText().length > 500000)
            .then(imageList => {
              if (imageList.length > 0) {
                if (previewPanels.image == null) {
                  previewPanels.image = window.createWebviewPanel('imagepreview', 'Images',
                    { viewColumn: ViewColumn.Two, preserveFocus: true },
                    { enableScripts: true, retainContextWhenHidden: true });
                  // the first time the panel appears, it steals focus. restore the view 500ms later.
                  if (previewSetting == '') {
                    setTimeout(() => window.showTextDocument(textEditor.document, { preview: true, preserveFocus: false }), 500);
                  }
                  // when closed by the user
                  previewPanels.image.onDidDispose(() => { previewPanels.image = null; })
                }
                imagePreviewWebview.getHtmlContent(imageList).then(htmlcontent => previewPanels.image.webview.html = htmlcontent);
              }
            })

          if (previewSetting == 'D') {
            // SharedMem.log();
            // there is no way to refresh a webview. So if user execute the same dashboard (to update data), webview.html will remain the same, and webview will not update.
            // insert a random comment in html do not help if the webview is hanging on a huge load. It must be closed!
            if (previewPanels.discovery != null) {
              previewPanels.discovery.onDidDispose(() => { }); // no need for callback anymore, extension closes it
              previewPanels.discovery.dispose();
              previewPanels.discovery = null;
            }
            // and re open it...
            discoveryPreviewWebview.findDiscovery(textEditor.document.getText(), outputWin).then(json => {
              discoveryPreviewWebview.getHtmlContent(json, SharedMem.get(uuid)).then((htmlcontent: string) => previewPanels.discovery.webview.html = htmlcontent);
              previewPanels.discovery = window.createWebviewPanel('discoverypreview', 'Discovery',
                { viewColumn: ViewColumn.Two, preserveFocus: true },
                { enableScripts: true, retainContextWhenHidden: true });
              previewPanels.discovery.onDidDispose(() => { previewPanels.discovery = null; }); // user close it
            });
          }
          //focus if focus forced by option
          if (previewSetting == 'G' && previewPanels.gts != null) {
            setTimeout(() => previewPanels.gts.reveal(ViewColumn.Two), 200);
          }
          if (previewSetting == 'I' && previewPanels.image != null) {
            setTimeout(() => previewPanels.image.reveal(ViewColumn.Two), 200);
          }
          if (previewSetting == 'D' && previewPanels.discovery != null) {
            setTimeout(() => previewPanels.discovery.reveal(ViewColumn.Two), 200);
          }
        }
      }
    });
    console.log('Preview loaded');

    // define a session name as user name + uuid.
    // remains the same until extension reload, or vscode reload.
    let user: string = 'vscode'
    if (userInfo) {
      user = userInfo().username;
    }
    WarpScriptExtGlobals.sessionName = `${user}-${v4()}`;
    outputWin.appendLine(`Session Name for WarpScript execution: '${WarpScriptExtGlobals.sessionName}'`);
    console.log(WarpScriptExtGlobals.sessionName);
  });
}
