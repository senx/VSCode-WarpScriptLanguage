//import { stat } from "fs";
import {
  CompletionItemProvider,
  TextDocument,
  Position,
  CancellationToken,
  CompletionItem,
  TextEdit,
  Range
} from "vscode";
import { CompletionItemKind } from "vscode";
import WarpScriptParser from '../warpScriptParser';
import { Command } from "vscode-languageclient";


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
        let listvar = this.ListVariables(document, _token);
        listvar.forEach(v => {
          //console.log("found varname:" + v);
          result.push(new CompletionItem(firstLetter == '$' ? '$' + v : v, CompletionItemKind.Variable))
        })
        // manage specific variables here
        // in a discovery dashboard:
        if (WarpScriptParser.extractSpecialComments(document.getText()).displayPreviewOpt == "D" && firstLetter == '$') {
          let c = new CompletionItem("$discoveryExecutionTrigger", CompletionItemKind.Variable);
          c.detail = "Special variable in every tiles macros. It contains the event that triggered the macro execution.";
          result.push(c);
        }
      }
      return resolve(result);
    });
  }


  private ListVariables(document: TextDocument, _token: CancellationToken): string[] {

    let statements = WarpScriptParser.parseWarpScriptStatements(document.getText(), _token);

    // look for :
    // STORE or CSTORE with a string before, or with a list before
    // MSTORE or MCSTORE or LSTORE or LCSTORE with a list before, 

    let varlist2: string[] = [];

    for (var i = 0; i < statements.length; i++) {
      if (i > 1 && (statements[i] == "STORE" || statements[i] == "CSTORE") && WarpScriptParser.IsWsLitteralString(statements[i - 1])) {
        let varname = statements[i - 1].slice(1, statements[i - 1].length - 1);
        if (varname.length > 0 && varlist2.indexOf(varname) < 0) {
          varlist2.push(varname);
        }
      }
      if (i > 1 && (statements[i] == "STORE" || statements[i] == "CSTORE" || statements[i] == "LSTORE" || statements[i] == "LCSTORE"
        || statements[i] == "MSTORE" || statements[i] == "MCSTORE") && statements[i - 1] == "]") {
        // look for the index of list start
        let startListidx = -1;
        for (var j = i - 1; j >= 0; j--) {
          if (statements[j] == "[") {
            startListidx = j;
            break;
          }
        }
        //console.log(startListidx, i);
        if (startListidx != -1) {
          for (var j = startListidx + 1; j < i - 1; j++) {
            if (WarpScriptParser.IsWsLitteralString(statements[j])) {
              let varname = statements[j].slice(1, statements[j].length - 1);
              if (varname.length > 0 && varlist2.indexOf(varname) < 0) {
                varlist2.push(varname);
              }
            }
          }
        }
      }
    }

    return varlist2;
  }

}
