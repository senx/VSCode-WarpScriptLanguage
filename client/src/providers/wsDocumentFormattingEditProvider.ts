'use strict';
import vscode = require('vscode');

export default class WSDocumentFormattingEditProvider implements vscode.DocumentFormattingEditProvider {

  private _blockStart = /\s*(\[|\{|<%|<')/;
  private _blockEnd = /\s*(\]|\}|%>|'>\s?)/;


  provideDocumentFormattingEdits(document: vscode.TextDocument, _options: vscode.FormattingOptions, _token: vscode.CancellationToken): vscode.ProviderResult<vscode.TextEdit[]> {
    let text = document.getText()
    let match: RegExpMatchArray | null;
    let indent: number = 0
    let doc = ''
    for (let i = 0; i < document.lineCount; i++) {
      let line: string = document.lineAt(i).text

      let indentStr = new Array(indent * 2)
      indentStr.fill(' ')

      line = this._replaceAll(line, '\s+', ' ')
      line = indentStr.join('') + line.replace(/\s+$/, '')
      let tmpLine = line;

      match = this._blockStart.exec(tmpLine)
      if (match) {
        console.log(indent, match[1])
        indent++
        indentStr = new Array(indent * 2)
        indentStr.fill(' ')
        line = line.replace(match[1] +' ', match[1] + '\n' +  indentStr.join(''))
      }
      match = this._blockEnd.exec(tmpLine)
      if (match) {
        console.log(indent, match[1])
        indent--
        indentStr = new Array(Math.max(indent, 0) * 2)
        indentStr.fill(' ')
        line = line.replace(match[1], '\n'+ indentStr.join('') + match[1] )
      }
      doc += line + '\n'

    }
    console.log('doc', doc)

    const start = document.positionAt(0);
    const end = document.positionAt(text.length);
    let range = new vscode.Range(start, end)
    return [vscode.TextEdit.replace(range, doc)];
  }

  private _replaceAll = function (str: string, target: string | RegExp, replacement: string) {
    return str.split(target).join(replacement);
  };
}