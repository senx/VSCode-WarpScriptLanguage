import { specialCommentCommands } from '../warpScriptParser';
import WarpScriptParser from '../warpScriptParser';
import WSDocumentLinksProvider from '../providers/wsDocumentLinksProvider';
import { OutputChannel, TextDocument, Uri, workspace } from 'vscode';

// this helper class manages the macro inclusion.
// It will prepend all the macros that the script refers to when found locally.
// when constructed with substitutionWithLocalMacros = false, the prepended WarpScript is the same as the original input.

export interface lineInFile {
  file:string;
  line:number;
}

export default class MacroIncluder {


  prependedWs: string;
  lines: number[];
  uris: string[];

  outputWin: OutputChannel = undefined;

  constructor(outputWin?: OutputChannel) {
    if (outputWin) {
      this.outputWin = outputWin;
    }
  }

  async processMacros(ws: string, wsUri: string) {

    let executedWarpScript = ws;
    const execDate: string = new Date().toLocaleTimeString();
    const commentsCommands: specialCommentCommands = WarpScriptParser.extractSpecialComments(executedWarpScript);
    let substitutionWithLocalMacros = !(commentsCommands.localmacrosubstitution === false);

    this.uris = [wsUri]
    this.lines = [executedWarpScript.split('\n').length]
    this.prependedWs = ws;

    if (substitutionWithLocalMacros) {

      // first, prepend macros of the special comments "// @include macro: "
      for (let macroName of commentsCommands.listOfMacroInclusion ?? []) {
        if (macroName.startsWith('@')) {
          macroName = macroName.substring(1);
        }
        console.log('-' + macroName + '-');
        await WSDocumentLinksProvider.getMacroURI(macroName).then(
          async (uri) => {
            if (this.uris.indexOf(uri.toString()) === -1) {
              // outputWin.show();
              // outputWin.appendLine('Appending ' + uri + ' as ' + macroName);
              let tdoc: TextDocument = await workspace.openTextDocument(uri);
              let macroCode: string = tdoc.getText()
              // Prepend the macro, store it and then append the rest of the script.
              let prepend: string = macroCode + '\n\'' + macroName + '\' STORE\n\n';
              executedWarpScript = prepend + executedWarpScript;
              //          linesOfMacrosPrepended += prepend.split('\n').length - 1;
              console.log(prepend.split('\n'))
              // Update lines and uris references
              this.lines.unshift(tdoc.lineCount + 2); // 3 '\n' added to define macro so it makes two new lines
              this.uris.unshift(uri.toString());
            }
          }
        ).catch(
          () => {
            if (this.outputWin) {
              this.outputWin.show();
              this.outputWin.append('[' + execDate + '] ');
              this.outputWin.appendLine("warning '" + macroName + "' is explicitly included with // @include macro:, but was not found in the VSCode project. Warp 10 will try its internal resolvers.")
            }
          }
        );
      }

      let allMacroPrepended = false;

      while (!allMacroPrepended) {
        let listOfMacros = WarpScriptParser.getListOfMacroCalls(executedWarpScript);

        if (listOfMacros.length > 0) {
          allMacroPrepended = true;
          for (const m of listOfMacros) {
            const macroName = m.substring(1);
            console.log('-' + macroName + '-');
            await WSDocumentLinksProvider.getMacroURI(macroName).then(
              async (uri) => {
                if (this.uris.indexOf(uri.toString()) === -1) {
                  // outputWin.show();
                  // outputWin.appendLine('Appending ' + uri + ' as ' + macroName);
                  let tdoc: TextDocument = await workspace.openTextDocument(uri);
                  let macroCode: string = tdoc.getText()
                  // Prepend the macro, store it and then append the rest of the script.
                  let prepend: string = macroCode + '\n\'' + macroName + '\' STORE\n\n';
                  executedWarpScript = prepend + executedWarpScript;
                  //          linesOfMacrosPrepended += prepend.split('\n').length - 1;
                  console.log(prepend.split('\n'))
                  // Update lines and uris references
                  this.lines.unshift(tdoc.lineCount + 2); // 3 '\n' added to define macro so it makes two new lines
                  this.uris.unshift(uri.toString());
                  allMacroPrepended = false;
                }
              }
            ).catch(
              () => { /* Ignore missing macros */ }
            );
          }
        } else {
          allMacroPrepended = true;
        }
      }
      this.prependedWs = executedWarpScript;
    } else {
      if (commentsCommands.listOfMacroInclusion && commentsCommands.listOfMacroInclusion.length > 0) {
        if (this.outputWin) {
          this.outputWin.show();
          this.outputWin.append('[' + execDate + '] ');
          this.outputWin.appendLine("warning '// @localmacrosubstitution false' also disables all the '// @include macro:' instructions")
        }

      }
    }



  }

  public getPrependedWarpScript(): string {
    return this.prependedWs;
  }

  public report() {
    console.warn(this.uris);
    console.warn(this.lines);
  }

  public printFullWs() {
    let l = this.prependedWs.split('\n');
    for (let i=0;i<l.length;i++) {
      console.log(`#${i}:${this.getUriAndLineFromRealLine(i).file}.${this.getUriAndLineFromRealLine(i).line} ${l[i]}`)
    }
  }

  public getUriAndLineFromRealLine(line:number):lineInFile{
    let fileInError;
    let lineInError = line;
    for (var i = 0; i < this.lines.length; i++) {
      if (lineInError <= this.lines[i]) {
        fileInError = this.uris[i];
        break;
      } else {
        lineInError -= this.lines[i];
      }
    }
    return { line:lineInError, file:fileInError}
  }

}