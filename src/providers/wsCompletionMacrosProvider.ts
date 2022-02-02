/**
 * Called by @ or / character. 
 * For the moment, the special @ instructions in the comments are managed
 * Macros need to be done another way, maybe considering a @macropath somewhere ?
 */
import {
  CompletionItemProvider,
  TextDocument,
  Position,
  CancellationToken,
  CompletionItem,
  CompletionItemKind,
  MarkdownString
} from "vscode";



/**
 * Completion of WarpScript
 */
export default class WSCompletionMacrosProvider
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

      // special VSCode instructions completion
      //check if line starts with "// @", then check wether all the lines before are also comments.
      let lineText = document.lineAt(position.line).text;
      if (lineText.match(/^\/\/\s@/)) {
        let linebeforearecomments: boolean = true;
        for (let l = 0; l < position.line; l++) {
          linebeforearecomments = linebeforearecomments && document.lineAt(l).text.startsWith("//");
        }
        if (linebeforearecomments) {
          let item: CompletionItem = new CompletionItem("endpoint", CompletionItemKind.Method)
          item.documentation = new MarkdownString().appendMarkdown("Change the execution endpoint for this script. VS Code will read URL behind:\n\nEx:").appendCodeblock("// @endpoint http://192.168.1.1/api/v0/exec");
          item.detail = "VSCode warpscript instruction";
          result.push(item);

          item = new CompletionItem("localmacrosubstitution", CompletionItemKind.Method)
          item.documentation = new MarkdownString().appendMarkdown("When true or undefined, VSCode will try to substitute macro calls with macros in your current working directory. Set to false to force WarpScript server macros use.\n\nEx:").appendCodeblock("// @localmacrosubstitution false");
          item.detail = "VSCode warpscript instruction";
          result.push(item);

          item = new CompletionItem("timeunit", CompletionItemKind.Method)
          item.documentation = new MarkdownString().appendMarkdown("Change the time unit for GTS Preview. It could be `us`, `ms`, `ns`.  Usefull if you use a Warp 10 platform with a nanosecond or millisecond precision instead of default settings.")
          item.detail = "VSCode warpscript instruction";
          result.push(item);

          item = new CompletionItem("preview", CompletionItemKind.Method)
          item.documentation = new MarkdownString().appendMarkdown("When undefined, GTS preview and Images Tabs are opened in the background. \n- Set to `none` for no preview at all.\n- Set to `gts` to focus on GTS Preview.\n- Set to `image` to focus on the Images tab.\n\nEx:").appendCodeblock("// @preview none");
          item.detail = "VSCode warpscript instruction";
          result.push(item);

          item = new CompletionItem("include macro:", CompletionItemKind.Method)
          item.documentation = new MarkdownString().appendMarkdown("If macro substitution is active, the following local macro path will be prepended to the script, allowing indirect reference with RUN\n\nEx:").appendCodeblock("// @preview macro/test/help\n\n 'macro/test/help' RUN");
          item.detail = "VSCode warpscript instruction";
          result.push(item);

          return resolve(result);
        }
        return resolve(undefined);
      }


      // TODO manage macro completion

      return resolve([]);
    });
  }


}
