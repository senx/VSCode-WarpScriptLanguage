'use strict';

import { TextDocument, CancellationToken, Range, Position, DocumentHighlightProvider, DocumentHighlight, DocumentHighlightKind } from 'vscode';

import WarpScriptParser from '../warpScriptParser';


export default class WSDocumentHighlightsProvider implements DocumentHighlightProvider {

  //table length = number of macros to look for before per interesting statements
  //0 1 2 = different colors of HighlighKind
  // (in a dark theme) 2 = blue  0 = dark grey  1 = sand
  private statementsMacrosSig: { [key: string]: number[] } = {
    'IFT': [2, 0], // 2 then (0 for condition. if not in a macro, won't be highlighted)
    'IFTE': [1, 2, 0], // 1 else , 2 then 
    'FOREACH': [1],
    'LMAP': [1],
    'WHILE': [1],
    'FOR': [1],
    'GROUPBY': [1],
    'FILTERBY': [1],
    'TRY': [0, 2, 1],
    'UNTIL':[1],
    'FORSTEP':[1,0]    
  }

  public async provideDocumentHighlights(document: TextDocument, position: Position, cancelToken: CancellationToken): Promise<DocumentHighlight[]> {

    let currentWord: string = document.getText(document.getWordRangeAtPosition(position))

    //for performance reasons, do not parse text files greater than 0.5 MByte (this function is called on each click on a word)
    if (Object.keys(this.statementsMacrosSig).includes(currentWord) && document.getText().length < 0.5e6) {
      console.log("try to highlight macros before " + currentWord);
      let r: Range[] = WarpScriptParser.getPreviousMacros(document, this.statementsMacrosSig[currentWord].length, document.getWordRangeAtPosition(position).start,cancelToken);
      //highlight color change with Highlight kind...
      //console.log("found " + r.length + " ranges")
      return r.map((range, i) => new DocumentHighlight(range, this.statementsMacrosSig[currentWord][i] as DocumentHighlightKind));
    }
    return undefined;
  }
}