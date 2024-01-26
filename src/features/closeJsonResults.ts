import { commands, TextEditor, WebviewPanel, window } from 'vscode';
import { Disposable } from 'vscode-jsonrpc';
import WarpScriptExtConstants from '../constants';
import WarpScriptExtGlobals = require('../globals')
/**
 * This functions browse all the opened documents.
 * If the filename match the /tmp/xxxx.json pattern used for the WarpScript output, it close them without any confirmation.
 * 
 * Trick to browse opened files : we must focus on them to get the document properties. 
 * So we trigger a workbench.action.nextEditor, then a callback onDidChangeActiveTextEditor.
 * 
 * In order not to mess with onDidChangeActiveTextEditor dedicated to the content provider refresh (in extension.ts), 
 * there is global variable called weAreClosingFilesFlag
 * 
 * In case of a long loop or endless loop, there is a five second timeout security
 */

export default class CloseJsonResults {
  /**
   * 
   * @param previewPanels 
   */
  public exec(previewPanels: { image: WebviewPanel | undefined, gts: WebviewPanel | undefined, discovery: WebviewPanel | undefined }): any {

    // the current opened file. usefull to detect the end of "nextEditor" loop.
    let activefilepath: string | undefined = window?.activeTextEditor?.document.uri.toString();
    // because one loop is not enough :(
    let firstLoop: boolean = true;


    let closeIfOutputJson: Function = async (editor: TextEditor) => {
      // unsaved document => unpredictable behavior of editor
      if (editor.document === undefined) {
        commands.executeCommand("workbench.action.nextEditor");
      } else {
        console.log(editor.document);
        let filename: string = editor.document.fileName;
        if (filename.match(await WarpScriptExtConstants.jsonResultRegEx())) {
          console.log(`${filename} could be closed ! closing...`);
          commands.executeCommand("workbench.action.revertAndCloseActiveEditor");
        }
        else {
          if (activefilepath === editor.document.uri.toString()) {
            console.log('end of close cycle?');
            if (firstLoop) {
              firstLoop = false;
              commands.executeCommand("workbench.action.nextEditor");
            } else {
              if (onchangecallback) { onchangecallback.dispose(); }
              WarpScriptExtGlobals.weAreClosingFilesFlag = false;
            }
          } else {
            commands.executeCommand("workbench.action.nextEditor");
          }
        }
      }

    }

    // callback on change active editor (called after one is closed OR after nextEditor)
    let onchangecallback: Disposable = window.onDidChangeActiveTextEditor(editor => { closeIfOutputJson(editor); });


    // security : if endless loop (not seen), end all.
    setTimeout(() => {
      if (onchangecallback) { onchangecallback.dispose(); }
      WarpScriptExtGlobals.weAreClosingFilesFlag = false;
    }, 5000);

    // set the flag to disable the content provider update
    WarpScriptExtGlobals.weAreClosingFilesFlag = true;

    // close any opened webview.
    if (!this.isNullOrUndefined(previewPanels.gts)) {
      previewPanels.gts.dispose();
    }
    if (!this.isNullOrUndefined(previewPanels.image)) {
      previewPanels.image.dispose();
    }
    if (!this.isNullOrUndefined(previewPanels.discovery)) {
      previewPanels.discovery.dispose();
    }
    // initiate the loop
    closeIfOutputJson(window.activeTextEditor);

  }

  isNullOrUndefined(value: WebviewPanel) {
    return value === undefined || value === null;
  }
}
