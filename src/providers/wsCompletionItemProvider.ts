import { CompletionItemProvider, TextDocument, Position, CancellationToken, CompletionItem, ExtensionContext, MarkdownString } from "vscode";
import { WarpScript } from '../ref';
import { CompletionItemKind } from "vscode";

export default class WSCompletionItemProvider implements CompletionItemProvider {
  public provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken): Thenable<CompletionItem[]> {
    return new Promise<CompletionItem[]>((resolve, reject) => {
      let result: CompletionItem[] = [];
      let lineText = document.lineAt(position.line).text;
      if (lineText.match(/^\s*\/\//)) {
        return resolve([]);
      }
      let wordAtPosition = document.getWordRangeAtPosition(position);
      let currentWord = '';
      if (wordAtPosition && wordAtPosition.start.character < position.character) {
        let word = document.getText(wordAtPosition);
        currentWord = word.substr(0, position.character - wordAtPosition.start.character);
      }
      if (currentWord.match(/^\d+$/)) {
        return resolve([]);
      }

      WarpScript.reference.filter(d => new RegExp(currentWord).exec(d.name)).forEach(keyword => {
        let documentation = new MarkdownString(keyword.documentation);
        documentation.isTrusted = true;
        let item = new CompletionItem(keyword.name);
        item.kind = CompletionItemKind.Keyword;
        item.detail = keyword.detail;
        item.documentation = documentation.value;
        result.push(item);
      });
      return resolve(result);
    });
  }
}