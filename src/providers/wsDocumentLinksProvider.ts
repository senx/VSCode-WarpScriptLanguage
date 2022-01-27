'use strict';

import { DocumentLink, DocumentLinkProvider, TextDocument, CancellationToken, workspace, Uri, Range } from 'vscode';
import WarpScriptParser from '../warpScriptParser';

export default class WSDocumentLinksProvider implements DocumentLinkProvider {

  public async provideDocumentLinks(document: TextDocument, _token: CancellationToken): Promise<DocumentLink[]> {
    const results: DocumentLink[] = []
    const text = document.getText();
    const macros = WarpScriptParser.getListOfMacroCallsWithPosition(text);
    for (let i = 0;i<macros.length;i++) {
      const macroLinkName = macros[i][0];
      const macroName = macroLinkName.substring(1);
      console.log("###" + macroName)
      const linkStart = document.positionAt(macros[i][1]);
      const linkEnd = document.positionAt(macros[i][2]);
      await WSDocumentLinksProvider.getMacroURI(macroName).then(
             (uri) => results.push(new DocumentLink(new Range(linkStart, linkEnd), uri))
           ).catch(() => { /* Ignore missing macros */ });
    }
    return Promise.resolve(results);
  }

  public static async getMacroURI(macroName: string): Promise<Uri> {
    return new Promise<Uri>(async (resolve, reject) => {
      const doc = await workspace.findFiles('**/' + macroName + '.mc2', '**/node_modules/**', 1)
      if (doc[0]) {
        let uri = Uri.parse('file://' + doc[0].path);
        resolve(uri);
      } else {
        reject(macroName);
      }
    });
  }
}