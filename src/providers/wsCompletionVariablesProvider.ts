import {
  CompletionItemProvider,
  TextDocument,
  Position,
  CancellationToken,
  CompletionItem
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
      let wordAtPosition = document.getWordRangeAtPosition(position, /(\$|\')[A-Za-z0-9\.]*(\')?/); // 'tB9' , $tB9
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
      const firstLetter = currentWord.charAt(0);
      if ('$' == firstLetter || "'" == firstLetter) { //beginning of a string, or $, list all variables in file and propose them
        let listvar = this.ListVariables(document);
        listvar.forEach(v => {
          console.log("found varname:" + v);
          result.push(new CompletionItem(firstLetter == '$' ? '$' + v : v, CompletionItemKind.Variable))
        })
      }
      return resolve(result);
    });
  }

  private ListVariables(document: TextDocument): string[] {
    let varlist: string[] = [];

    let warpscriptlines = document.getText().split('\n'); //think about windows... \r\n in mc2 files !
    for (let l = 0; l < warpscriptlines.length; l++) {
      let currentline = warpscriptlines[l].replace('\r', '');

      //find and extract variable name can have dots or underscores or dash. 
      //the line must end with STORE (followed by spaces or an // comment)
      let varPattern = /[\'\"]([A-Za-z0-9-_\.]+)[\'\"]\s+STORE\s*/g;
      let lineonMatch: RegExpMatchArray | null;
      let re = RegExp(varPattern);
      while (lineonMatch = re.exec(currentline)) {
        let varname = lineonMatch[1];
        if (varlist.indexOf(varname) < 0) {
          varlist.push(varname);
        }
      }

      //find and extract variable with the new [ 'x' 'y' ] STORE syntax. 
      // A repeated capturing group will only capture the last iteration. 
      // Put a capturing group around the repeated group to capture all iterations
      let multipleVarPattern = /\[((\s+[\'\"]([A-Za-z0-9-_\.]+)[\'\"])+)\s+\]\s+STORE\s*/g;
      re = RegExp(multipleVarPattern, 'g');
      while (lineonMatch = re.exec(currentline)) {
        let listContent: string = lineonMatch[1];
        listContent.split(' ').filter((s) => s !== '').map((s) => s.replace(/[\'\"]/g, '')).forEach((s) => {
          if (varlist.indexOf(s) < 0) {
            varlist.push(s);
          }
        })
      }
    }


    return varlist;
  }

}
