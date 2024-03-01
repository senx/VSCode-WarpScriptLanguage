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
import { CancellationToken, commands, debug, DebugAdapterDescriptor, DebugAdapterDescriptorFactory, DebugAdapterInlineImplementation, DebugConfiguration, DebugConfigurationProvider, DebugConfigurationProviderTriggerKind, DebugSession, EvaluatableExpression, ExtensionContext, languages, ProviderResult, Range, Selection, TextDocument, TextEdit, TextEditor, TextEditorRevealType, TextLine, Uri, ViewColumn, WebviewPanel, window, workspace, WorkspaceFolder } from 'vscode';
import { userInfo } from 'os';
import { join } from "path";
import WSDiagnostics from './providers/wsDiagnostics';
import { FileAccessor } from './debug/warp10DebugRuntime';
import { Warp10DebugSession } from './debug/warp10Debug';
import ProfilerCommand from './features/profiler';

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
    console.debug('About to load')
    StatusbarUi.Init();
    console.debug('StatusbarUi loaded')
    let outputWin = window.createOutputChannel('Warp10');
    // constant object ref to pass to closeOpenedWebviews
    let previewPanels: { image: WebviewPanel | undefined, gts: WebviewPanel | undefined, discovery: WebviewPanel | undefined } = { image: undefined, gts: undefined, discovery: undefined };

    // Hover providers
    context.subscriptions.push(languages.registerHoverProvider({ language: 'warpscript' }, new WSHoverProvider()));
    context.subscriptions.push(languages.registerHoverProvider({ language: 'flows' }, new FlowsHoverProvider()));
    console.debug('Hover providers loaded');

    // Completion providers
    context.subscriptions.push(languages.registerCompletionItemProvider({ language: 'warpscript' }, new WSCompletionItemProvider()));
    context.subscriptions.push(languages.registerCompletionItemProvider({ language: 'flows' }, new FlowsCompletionItemProvider()));
    context.subscriptions.push(languages.registerCompletionItemProvider({ language: 'warpscript' }, new WSCompletionVariablesProvider(), "'", "$"));
    console.debug('Completion providers loaded');
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
    console.debug('Languages loaded');

    context.subscriptions.push(commands.registerCommand('extension.execCloseJsonResults', () => { new CloseJsonResults().exec(previewPanels); }));
    context.subscriptions.push(commands.registerCommand('extension.execConvertUnicodeInJson', () => { new UnicodeJsonConversion().exec(); }));
    context.subscriptions.push(commands.registerCommand('extension.execWS', () => { new ExecCommand().exec(outputWin)(''); }));
    context.subscriptions.push(commands.registerCommand('extension.profile', () => { new ProfilerCommand().exec(outputWin, context)(''); }));

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
      // this short command allow to do links inside the document. it jumps to the required text offset, if a word is found. it selects the word.
      let editor = window.activeTextEditor;
      if (editor) {
        let wordRange: Range = editor.document.getWordRangeAtPosition(editor.document.positionAt(offset)) as Range;
        if (wordRange !== undefined) {
          editor.selections = [new Selection(wordRange.start, wordRange.end)];
          editor.revealRange(wordRange, TextEditorRevealType.InCenterIfOutsideViewport);
        }
      }
    }));
    console.debug('Commands loaded');

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
    console.debug('FLoWS loaded');

    new WSDocumentFormattingEditProvider();
    // webview panels for dataviz. will be created only when needed.
    let gtsPreviewWebview = new GTSPreviewWebview(context);
    let discoveryPreviewWebview = new DiscoveryPreviewWebview(context);
    let imagePreviewWebview = new ImagePreviewWebview(context);
    let latestJSONdisplayed: string = '';

    // enable diagnostics (audit)
    let wsDiagnostics = new WSDiagnostics(context);
    wsDiagnostics.initializeDiagnostics();

    //each time focus change, we look at the file type and file name. Json + special name => stack preview.
    window.onDidChangeActiveTextEditor((textEditor: TextEditor | undefined) => {
      StatusbarUi.Init();
      if (!WarpScriptExtGlobals.weAreClosingFilesFlag &&
        typeof textEditor !== 'undefined' &&
        typeof textEditor.document !== 'undefined' &&
        textEditor.document.languageId === 'json' &&
        textEditor.document.uri.fsPath.match(jsonResultRegEx)) {

        let suffixes = jsonResultRegEx.exec(textEditor.document.uri.fsPath) ?? [];
        //look for a timeUnit indication into the json name
        const uuid: string = suffixes[1] || '';
        let timeUnit: string = suffixes[2] || 'u';
        timeUnit = timeUnit + 's';
        //look for a preview setting into the json name
        let previewSetting: string = suffixes[3] || '';
        console.debug("preview=" + previewSetting);

        // do not refresh preview when the preview window when selecting the json of the current preview
        let alreadypreviewed: boolean = (latestJSONdisplayed == textEditor.document.fileName);
        latestJSONdisplayed = textEditor.document.fileName;

        if (previewSetting != 'X' && workspace.getConfiguration().get('warpscript.PreviewTabs') !== 'none' && !alreadypreviewed) {

          if (previewSetting == "J") {
            console.debug("format json !")
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
            previewPanels.gts.onDidDispose(() => { previewPanels.gts = undefined; })
          }
          // refresh gtsPreview 
          gtsPreviewWebview.getHtmlContent(textEditor.document.getText(), timeUnit, previewPanels.gts)
            .then(htmlcontent => setTimeout(() => {
              if (previewPanels.gts) {
                previewPanels.gts.webview.html = htmlcontent;
              }
            }))

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
                  previewPanels.image.onDidDispose(() => { previewPanels.image = undefined; })
                }
                imagePreviewWebview.getHtmlContent(imageList, previewPanels.image).then(htmlcontent => {
                  if (previewPanels?.image?.webview) previewPanels.image.webview.html = htmlcontent;
                });
              }
            })

          if (previewSetting == 'D') {
            // SharedMem.log();
            // there is no way to refresh a webview. So if user execute the same dashboard (to update data), webview.html will remain the same, and webview will not update.
            // insert a random comment in html do not help if the webview is hanging on a huge load. It must be closed!
            if (previewPanels.discovery != null) {
              previewPanels.discovery.onDidDispose(() => { }); // no need for callback anymore, extension closes it
              previewPanels.discovery.dispose();
              previewPanels.discovery = undefined;
            }
            // and re open it...
            discoveryPreviewWebview.findDiscovery(textEditor.document.getText(), outputWin).then(json => {
              previewPanels.discovery = window.createWebviewPanel('discoverypreview', 'Discovery',
                { viewColumn: ViewColumn.Two, preserveFocus: true },
                { enableScripts: true, retainContextWhenHidden: true });
              discoveryPreviewWebview.getHtmlContent(json, SharedMem.get(uuid), previewPanels.discovery)
                .then((htmlcontent: string) => {
                  if (previewPanels.discovery) {
                    previewPanels.discovery.webview.html = htmlcontent;
                  }
                });
              previewPanels.discovery.onDidDispose(() => { previewPanels.discovery = undefined; }); // user close it
            });
          }
          //focus if focus forced by optionu
          if (!!previewPanels?.gts && previewSetting === 'G') {
            setTimeout(() => {
              if (previewPanels.gts) {
                previewPanels.gts.reveal(ViewColumn.Two);
              }
            }, 200);
          }
          if (previewSetting === 'I' && previewPanels.image) {
            setTimeout(() => {
              if (previewPanels.image) {
                previewPanels.image.reveal(ViewColumn.Two);
              }
            }, 200);
          }
          if (previewSetting === 'D' && previewPanels.discovery) {
            setTimeout(() => {
              if (previewPanels.discovery) {
                previewPanels.discovery.reveal(ViewColumn.Two);
              }
            }, 200);
          }
        }
      }
    });
    console.debug('Preview loaded');
    try {
      outputWin.appendLine(`Discovery version ${WarpScriptExtConstants.getPackageVersion(context, join('assets', '@senx', 'discovery-widgets', 'package.json'))}`);
    } catch (error) { }

    // define a session name as user name + uuid.
    // remains the same until extension reload, or vscode reload.
    let user: string = 'vscode'
    if (userInfo) {
      user = userInfo().username;
    }
    WarpScriptExtGlobals.sessionName = `${user}-${v4()}`;
    outputWin.appendLine(`Session Name for WarpScript execution: '${WarpScriptExtGlobals.sessionName}'`);
    console.debug(WarpScriptExtGlobals.sessionName);

    const provider = new Warp10DebugConfigurationProvider();
    context.subscriptions.push(debug.registerDebugConfigurationProvider('warpscript', provider));

    // register a dynamic configuration provider for 'mock' debug type
    context.subscriptions.push(debug.registerDebugConfigurationProvider('warpscript', {
      provideDebugConfigurations(_folder: WorkspaceFolder | undefined): ProviderResult<DebugConfiguration[]> {
        return [
          {
            name: "Dynamic Launch",
            request: "launch",
            type: "warpscript",
            program: "${file}"
          },
          {
            name: "Another Dynamic Launch",
            request: "launch",
            type: "warpscript",
            program: "${file}"
          },
          {
            name: "warpscript Launch",
            request: "launch",
            type: "warpscript",
            program: "${file}"
          }
        ];
      }
    }, DebugConfigurationProviderTriggerKind.Dynamic));

    const factory = new InlineDebugAdapterFactory();
    factory.setContext(context);

    context.subscriptions.push(debug.registerDebugAdapterDescriptorFactory('warpscript', factory));
    if ('dispose' in factory) {
      context.subscriptions.push(factory as any);
    }

    // override VS Code's default implementation of the debug hover
    // here we match only Mock "variables", that are words starting with an '$'
    context.subscriptions.push(languages.registerEvaluatableExpressionProvider('warpscript', {
      provideEvaluatableExpression(document: TextDocument, position: any): ProviderResult<EvaluatableExpression> {
        const VARIABLE_REGEXP = /\$[a-z][a-z0-9]*/ig;
        const line = document.lineAt(position.line).text;
        let m: RegExpExecArray | null;
        while (m = VARIABLE_REGEXP.exec(line)) {
          const varRange = new Range(position.line, m.index, position.line, m.index + m[0].length);

          if (varRange.contains(position)) {
            return new EvaluatableExpression(varRange);
          }
        }
        return undefined;
      }
    }));
    commands.executeCommand('setContext', 'senx.warpscript-language.loaded', true);
  });
}

class Warp10DebugConfigurationProvider implements DebugConfigurationProvider {

  /**
   * Massage a debug configuration just before a debug session is being launched,
   * e.g. add all missing attributes to the debug configuration.
   */
  resolveDebugConfiguration(_folder: WorkspaceFolder | undefined, config: DebugConfiguration, _token?: CancellationToken): ProviderResult<DebugConfiguration> {

    // if launch.json is missing or empty
    if (!config.type && !config.request && !config.name) {
      const editor = window.activeTextEditor;
      if (editor && editor.document.languageId === 'warpscript') {
        config.type = 'warpscript';
        config.name = 'Launch';
        config.request = 'launch';
        config.program = '${file}';
        config.stopOnEntry = true;
      }
    }

    if (!config.program) {
      return window.showInformationMessage("Cannot find a program to debug").then(_ => {
        return undefined;	// abort launch
      });
    }

    return config;
  }
}

export const workspaceFileAccessor: FileAccessor = {
  isWindows: typeof process !== 'undefined' && process.platform === 'win32',
  async readFile(path: string): Promise<Uint8Array> {
    let uri: Uri;
    try {
      uri = pathToUri(path);
    } catch (e) {
      return new TextEncoder().encode(`cannot read '${path}'`);
    }

    return await workspace.fs.readFile(uri);
  },
  async writeFile(path: string, contents: Uint8Array) {
    await workspace.fs.writeFile(pathToUri(path), contents);
  }
};

function pathToUri(path: string) {
  try {
    return Uri.file(path);
  } catch (e) {
    return Uri.parse(path);
  }
}

class InlineDebugAdapterFactory implements DebugAdapterDescriptorFactory {
  context: ExtensionContext;
  setContext(context: ExtensionContext) {
    this.context = context;
  }
  createDebugAdapterDescriptor(_session: DebugSession): ProviderResult<DebugAdapterDescriptor> {
    return new DebugAdapterInlineImplementation(new Warp10DebugSession(workspaceFileAccessor, this.context));
  }
}
