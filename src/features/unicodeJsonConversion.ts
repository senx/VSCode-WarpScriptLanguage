import * as vscode from 'vscode';

/**
 * This function convert all the \uXXXX unicode escapes into the right character.
 * 
 */

export default class UnicodeJsonConversion {

  public exec(): any {
    const document = vscode.window.activeTextEditor.document;
    
    let unescapedText:string = unescape(document.getText().replace(/\\u([0-9A-Fa-f]{4})/g,"%u\$1"));
    vscode.window.activeTextEditor.edit( textEditor => {
      textEditor.delete(new vscode.Range(document.positionAt(0),document.positionAt(document.getText().length)));
      textEditor.insert(document.positionAt(0),unescapedText);
    })
  }
}
