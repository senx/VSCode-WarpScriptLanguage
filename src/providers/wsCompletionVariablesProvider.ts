import {
  CompletionItemProvider,
  TextDocument,
  Position,
  CancellationToken,
  CompletionItem,
  MarkdownString
} from "vscode";
import { CompletionItemKind } from "vscode";


/**
 * Completion of WarpScript
 */
export default class WSCompletionVariablesProvider
  implements CompletionItemProvider {
  /**
   *
   * @param {TextDocument} document
   * @param {Position} position
   * @param {CancellationToken} _token
   */
  public provideCompletionItems(document: TextDocument, position: Position, _token: CancellationToken): Thenable<CompletionItem[]> {
    return new Promise<CompletionItem[]>(resolve => {
      let result: CompletionItem[] = [];
      let lineText = document.lineAt(position.line).text;
      //console.log('called $');
      if (lineText.match(/^\s*\/\//)) { //no variable completion in comments
        return resolve([]);
      }
      let wordAtPosition = document.getWordRangeAtPosition(position, /(\$|\')[A-Za-z0-9]*(\')?/); // 'tB9' , $tB9
      let currentWord = "";
      //console.log("line" + lineText);
      if (wordAtPosition && wordAtPosition.start.character < position.character) {
        let word = document.getText(wordAtPosition);
        currentWord = word.substr(0, position.character - wordAtPosition.start.character);
      }
      //console.log("word="+currentWord);
      if (currentWord.length > 2 && currentWord.endsWith("'")) { //end of a valid string, propose " STORE"
        return resolve([new CompletionItem("\ STORE", CompletionItemKind.Event)]);
      }
      //console.log(currentWord);
      if (currentWord.startsWith('$') || currentWord.startsWith("'")) { //beginning of a string, or $, list all variables in file and propose them
        let listvar = this.ListVariables(document);
        listvar.forEach(v => {
          //console.log("found varname:" + v);
          result.push(new CompletionItem(v, CompletionItemKind.Variable))
        })
      }
      return resolve(result);
    });
  }

  private ListVariables(document: TextDocument): string[] {
    let varlist: string[] = [];

    let warpscriptlines = document.getText().split('\n');
    for (let l = 0; l < warpscriptlines.length; l++) {
      let currentline = warpscriptlines[l];

      //find and extract // @paramname parameters
      let varPattern = /\'([A-Za-z0-9]+)\'\s+STORE(\/\/.*)?$/g;
      let lineonMatch: RegExpMatchArray | null;
      let re = RegExp(varPattern);
      while (lineonMatch = re.exec(currentline)) {
        let varname = lineonMatch[1];
        if (varlist.indexOf(varname) < 0) {
          varlist.push(varname);
        }
      }

    }


    return varlist;
  }

}
