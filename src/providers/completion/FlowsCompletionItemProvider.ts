import { CancellationToken, CompletionItem, Position, TextDocument } from "vscode";
import { W10CompletionItemProvider } from "./W10CompletionItemProvider";

/**
 * Completion of Flows
 */
export default class FlowsCompletionItemProvider extends W10CompletionItemProvider {
  /**
   * 
   * @param keyword 
   */
  transformKeyWord(keyword: string): string {
    return keyword + '()';
  }

  /**
   * 
   * @param _item 
   * @param _token 
   */
  resolveCompletionItem?(_item: CompletionItem, _token: CancellationToken): import("vscode").ProviderResult<CompletionItem> {
    throw new Error("Method not implemented.");
  }
  /**
   *
   * @param {TextDocument} document
   * @param {Position} position
   * @param {CancellationToken} _token
   */
  public provideCompletionItems(document: TextDocument, position: Position, _token: CancellationToken): Thenable<CompletionItem[]> {
    return super.completionItems(document, position, _token, "flows")
  }
}
