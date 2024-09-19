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
import WarpScriptParser from '../warpScriptParser';




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
          item.documentation = new MarkdownString().appendMarkdown("When undefined, GTS preview and Images Tabs are opened in the background. \n- Set to `none` for no preview at all.\n- Set to `gts` to focus on GTS Preview.\n- Set to `image` to focus on the Images tab.\n- Set to `json` to format json output.\n- Set to `discovery` to render the layout with `@senx/discovery2/render` macro and display the dynamic dashboard output.\n\nEx:").appendCodeblock("// @preview none");
          item.detail = "VSCode warpscript instruction";
          result.push(item);

          item = new CompletionItem("include macro:", CompletionItemKind.Method)
          item.documentation = new MarkdownString().appendMarkdown("If macro substitution is active, the following local macro path will be prepended to the script, allowing indirect reference with RUN\n\nEx:").appendCodeblock("// @include macro:test/help\n\n 'test/help' RUN");
          item.detail = "VSCode warpscript instruction";
          result.push(item);

          item = new CompletionItem("oauth", CompletionItemKind.Method)
          item.documentation = new MarkdownString().appendMarkdown("When using SenX SaaS api/saas/warp endpoint, set the authentication server.\n\nEx:").appendCodeblock("// @oauth https://auth.senx.io/");
          item.detail = "VSCode warpscript instruction";
          result.push(item);

          item = new CompletionItem("realm", CompletionItemKind.Method)
          item.documentation = new MarkdownString().appendMarkdown("When using SenX SaaS api/saas/warp endpoint, set the realm for authentication.\n\nEx:").appendCodeblock("// @realm senx");
          item.detail = "VSCode warpscript instruction";
          result.push(item);

          item = new CompletionItem("user", CompletionItemKind.Method)
          item.documentation = new MarkdownString().appendMarkdown("When using SenX SaaS api/saas/warp endpoint, set the user for authentication.\n\nEx:").appendCodeblock("// @user john@senx.io");
          item.detail = "VSCode warpscript instruction";
          result.push(item);

          item = new CompletionItem("totp", CompletionItemKind.Method)
          item.documentation = new MarkdownString().appendMarkdown("When using SenX SaaS api/saas/warp endpoint, if the user configured 2FA, set totp option to true.\n\nEx:").appendCodeblock("// @totp true");
          item.detail = "VSCode warpscript instruction";
          result.push(item);

          item = new CompletionItem("clientid", CompletionItemKind.Method)
          item.documentation = new MarkdownString().appendMarkdown("When using SenX SaaS api/saas/warp endpoint, provides an m2m authentication with client id and client secret.\n\nEx:").appendCodeblock("// @totp true");
          item.detail = "VSCode warpscript instruction";
          result.push(item);

          return resolve(result);
        }
        return resolve([]);
      }


      // simple explicitly declared macro completion
      let explicitMacroList: string[] = this.FindMacroExplicitNames(document, _token);
      if (explicitMacroList.length > 0) {
        let result: CompletionItem[] = [];
        for (var i = 0; i < explicitMacroList.length; i++) {
          let item: CompletionItem = new CompletionItem(explicitMacroList[i], CompletionItemKind.Method);
          result.push(item);
        }
        return resolve(result);
      }


      return resolve([]);
    });
  }


  private FindMacroExplicitNames(document: TextDocument, _token: CancellationToken): string[] {

    let macrolist: string[] = [];
    let statements = WarpScriptParser.parseWarpScriptStatements(document.getText(), _token);

    // find explicit macro names.
    // %> 'xxx' STORE 

    for (var i = 0; i < statements.length; i++) {
      if (i > 2 && statements[i] == "STORE" && statements[i - 2] == "%>" && WarpScriptParser.IsWsLitteralString(statements[i - 1])) {
        let varname = statements[i - 1].slice(1, statements[i - 1].length - 1);
        if (varname.length > 0 && macrolist.indexOf(varname) < 0) {
          macrolist.push(varname);
        }
      }
    }

    return macrolist;
  }

}
