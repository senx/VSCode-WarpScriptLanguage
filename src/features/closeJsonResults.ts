import * as vscode from 'vscode';
import WarpScriptExtConstants from '../constants';
import WarpStriptExtGlobals = require('../globals')
import { isNullOrUndefined } from 'util';
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
  public exec(previewPanels: { 'image': vscode.WebviewPanel, 'gts': vscode.WebviewPanel }): any {

    //the current opened file. usefull to detect the end of "nextEditor" loop.
    let activefilepath: string = vscode.window.activeTextEditor.document.uri.toString();
    //because one loop is not enough :(
    let firstLoop: boolean = true;


    let closeIfOutputJson: Function = (editor: vscode.TextEditor) => {
      console.log(editor.document);
      let filename: string = editor.document.fileName;
      if (filename.match(new WarpScriptExtConstants().jsonResultRegEx)) {
        console.log(filename + ' could be closed ! closing...');
        vscode.commands.executeCommand("workbench.action.revertAndCloseActiveEditor");
      }
      else {
        if (activefilepath === editor.document.uri.toString()) {
          console.log('end of close cycle?');
          if (firstLoop) {
            firstLoop = false;
            vscode.commands.executeCommand("workbench.action.nextEditor");
          } else {
            if (onchangecallback) { onchangecallback.dispose(); }
            WarpStriptExtGlobals.weAreClosingFilesFlag = false;
          }
        } else {
          vscode.commands.executeCommand("workbench.action.nextEditor");
        }
      }
    }

    // callback on change active editor (called after one is closed OR after nextEditor)
    let onchangecallback: vscode.Disposable = vscode.window.onDidChangeActiveTextEditor(editor => { closeIfOutputJson(editor); });


    //security : if endless loop (not seen), end all.
    setTimeout(function () {
      if (onchangecallback) { onchangecallback.dispose(); }
      WarpStriptExtGlobals.weAreClosingFilesFlag = false;
    }, 5000);

    //set the flag to disable the content provider update
    WarpStriptExtGlobals.weAreClosingFilesFlag = true;

    //close any opened webview.
    if (!isNullOrUndefined(previewPanels.gts)) {
      previewPanels.gts.dispose();
    }
    if (!isNullOrUndefined(previewPanels.image)) {
      previewPanels.image.dispose();
    }

    //initiate the loop
    closeIfOutputJson(vscode.window.activeTextEditor);

  }
}
