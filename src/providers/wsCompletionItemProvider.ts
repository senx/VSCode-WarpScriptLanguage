import {
  CompletionItemProvider,
  TextDocument,
  Position,
  CancellationToken,
  CompletionItem,
  MarkdownString
} from "vscode";
import { WarpScript } from "../ref";
import { CompletionItemKind } from "vscode";

/**
 * Completion of WarpScript
 */
export default class WSCompletionItemProvider
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
      if (lineText.match(/^\s*\/\//)) {
        return resolve([]);
      }
      let wordAtPosition = document.getWordRangeAtPosition(position, /(\->|\$|\@)?[A-Za-z]+\.?[A-Za-z]*/);
      let currentWord = "";
      if (wordAtPosition && wordAtPosition.start.character < position.character) {
        let word = document.getText(wordAtPosition);
        currentWord = word.substr(0, position.character - wordAtPosition.start.character);
      }
      if (currentWord.match(/^\d+$/)) {
        return resolve([]);
      }
      if (currentWord.startsWith('$')) {
        return resolve([]);
      } 
      if (currentWord.startsWith('@')) {
        return resolve([]);
      }
      WarpScript.reference
        .filter(d => new RegExp(currentWord).exec(d.name))
        .forEach(keyword => {
          let item = new CompletionItem(
            keyword.name,
            this.getType(keyword.tags, keyword.name)
          );
          item.detail = keyword.name;
          item.range = wordAtPosition;
          item.documentation = new MarkdownString()
            .appendText("Since : " + keyword.since)
            .appendCodeblock(keyword.detail, "warpscript")
            .appendMarkdown(keyword.documentation);

          result.push(item);
        });
      //Add true and false in the list
      result.push(new CompletionItem("true", CompletionItemKind.Constant))
      result.push(new CompletionItem("false", CompletionItemKind.Constant))
      return resolve(result);
    });
  }

  private getType(tags: string[], name: string): CompletionItemKind {
    let t = tags.join(" ");
    if (t.indexOf("constant") > -1) {
      return CompletionItemKind.Constant;
    } else if (t.indexOf("reducer") > -1 && name !== "REDUCE") {
      return CompletionItemKind.Interface;
    } else if (t.indexOf("mapper") > -1 && name !== "MAP") {
      return CompletionItemKind.Interface;
    } else if (t.indexOf("bucketize") > -1 && name !== "BUCKETIZE") {
      return CompletionItemKind.Interface;
    } else if (t.indexOf("filter") > -1 && name !== "FILTER") {
      return CompletionItemKind.Interface;
    } else if (t.indexOf("control") > -1) {
      return CompletionItemKind.Keyword;
    } else if (t.indexOf("operators") > -1) {
      return CompletionItemKind.Operator;
    } else if (t.indexOf("stack") > -1) {
      return CompletionItemKind.Event;
    } else {
      return CompletionItemKind.Function;
    }
  }
}
