import { specialCommentCommands } from '../warpScriptParser';
import WarpScriptParser from '../warpScriptParser';
import WSDocumentLinksProvider from '../providers/wsDocumentLinksProvider';
import { OutputChannel, TextDocument, workspace } from 'vscode';

// this helper class manages the macro inclusion.
// It will prepend all the macros that the script refers to when found locally.
// when constructed with substitutionWithLocalMacros = false, the prepended WarpScript is the same as the original input.

// all the line numbers starts at 0 here !

export interface lineInFile {
  file: string;
  line: number;
}

export default class MacroIncluder {


  public finalWarpScript: string[]; // the final WarpScript is stored as lines in this class. public to easily get one line.

  private lines: number[];
  private uris: string[];
  commentsCommands: specialCommentCommands;
  public originalWarpScriptContent: string; // the untouched WarpScript... before any macro inclusion or changes
  originalNumberOfLines: number;

  private outputWin: OutputChannel = undefined;

  constructor(outputWin?: OutputChannel) {
    if (outputWin) {
      this.outputWin = outputWin;
    }
  }

  async loadWarpScript(ws: string, wsUri: string) {

    let executedWarpScript = ws;
    this.originalWarpScriptContent = ws; // keep a copy
    const execDate: string = new Date().toLocaleTimeString();
    this.commentsCommands = WarpScriptParser.extractSpecialComments(executedWarpScript);
    let substitutionWithLocalMacros = !(this.commentsCommands.localmacrosubstitution === false);

    this.uris = [wsUri]
    this.originalNumberOfLines = executedWarpScript.split('\n').length
    this.lines = [this.originalNumberOfLines]


    if (substitutionWithLocalMacros) {

      // first, prepend macros of the special comments "// @include macro: "
      for (let macroName of this.commentsCommands.listOfMacroInclusion ?? []) {
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
              //console.log(prepend.split('\n'))
              // Update lines and uris references
              this.lines.unshift(2);  // 3 '\n' added to define macro so it makes two new lines
              this.uris.unshift('--macroAppend');
              this.lines.unshift(tdoc.lineCount); // 3 '\n' added to define macro so it makes two new lines
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
                  let prepend: string = macroCode + '\n\'' + macroName + '\' STORE // end of ' + uri.toString() + '\n\n';
                  executedWarpScript = prepend + executedWarpScript;
                  //          linesOfMacrosPrepended += prepend.split('\n').length - 1;
                  //console.log(prepend.split('\n'))
                  // Update lines and uris references
                  this.lines.unshift(2);  // 3 '\n' added to define macro so it makes two new lines
                  this.uris.unshift('--macroAppend');
                  this.lines.unshift(tdoc.lineCount);
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
    } else {
      if (this.commentsCommands.listOfMacroInclusion && this.commentsCommands.listOfMacroInclusion.length > 0) {
        if (this.outputWin) {
          this.outputWin.show();
          this.outputWin.append('[' + execDate + '] ');
          this.outputWin.appendLine("warning '// @localmacrosubstitution false' also disables all the '// @include macro:' instructions")
        }

      }
    }

    // the final WarpScript is stored as lines in this class.
    this.finalWarpScript = executedWarpScript.split('\n');


  }

  // returns the warpscript with all the macro prepended.
  public getFinalWS(): string {
    return this.finalWarpScript.join('\n');
  }

  public report() {
    console.warn(this.uris);
    console.warn(this.lines);
  }

  // debug help. prints each line of the full warpscript, with the original file name and original line number.
  public printFullWs() {
    let l = this.finalWarpScript;
    for (let i = 0; i < l.length - 1; i++) {
      console.log(`#${i}:${this.getUriAndLineFromRealLine(i).file}.${this.getUriAndLineFromRealLine(i).line} ${l[i]}`)
    }
  }

  public getNumberOfAppendLines(): number {
    return this.finalWarpScript.length - this.originalNumberOfLines
  }

  // from the execution line, return the original file URI and the original file number
  public getUriAndLineFromRealLine(line: number): lineInFile {
    let targerFile;
    let lineInError = line;
    for (var i = 0; i < this.lines.length; i++) {
      if (lineInError < this.lines[i]) {
        targerFile = this.uris[i];
        break;
      } else {
        lineInError -= this.lines[i];
      }
    }
    return { line: lineInError, file: targerFile }
  }


  // returns the real line number from the uri and the line number.
  // useful to set breakpoints to a line in a file
  // returns -1 for obviously impossible tasks (wrong uri, wrong line number)
  public getRealLineFromUriAndLine(uri: string, line: number) {
    if (line < 0 || line >= this.finalWarpScript.length) {
      return -1;
    }
    if (this.uris.length == 1) {
      return line;
    }
    let prependLineCount = 0;
    for (let i = 0; i < this.uris.length; i++) {
      if (this.uris[i] === uri) {
        if (line >= this.lines[i]) {
          return -1 // when asked for impossible
        }
        return line + prependLineCount;
      }
      prependLineCount += this.lines[i];
    }
    return -1;
  }

  public prependLinesToAll(codeToPrepend: string) {
    let lines = codeToPrepend.split('\n')
    let linecount = lines.length;
    this.finalWarpScript = lines.concat(this.finalWarpScript);
    this.lines.unshift(linecount); // 3 '\n' added to define macro so it makes two new lines
    this.uris.unshift("--globalPrepend");

  }

  public appendLinesToAll(codeToPrepend: string) {
    let lines = codeToPrepend.split('\n')
    let linecount = lines.length;
    this.finalWarpScript = this.finalWarpScript.concat(lines);
    this.lines.push(linecount); // 3 '\n' added to define macro so it makes two new lines
    this.uris.push("--globalAppend");

  }
  // add text at the beginning of a line at a given line in a given file
  public prependTextToLineInFile(uri: string, line: number, textToPrepend: string): boolean {
    let realLine = this.getRealLineFromUriAndLine(uri, line);
    if (realLine < 0) {
      console.warn(`cannot find line number ${line} in file ${uri}`);
      return false;
    } else {
      this.finalWarpScript[realLine] = textToPrepend + this.finalWarpScript[realLine];
      return true;
    };
  }

  // add text at the end of a line at a given line in a given file
  public appendTextToLineInFile(uri: string, line: number, textToAppend: string) {
    let realLine = this.getRealLineFromUriAndLine(uri, line);
    if (realLine < 0) {
      console.warn(`cannot find line number ${line} in file ${uri}`);
    } else {
      this.finalWarpScript[realLine] = this.finalWarpScript[realLine] + textToAppend;
    };
  }

  public isThisFileIncluded(uri: string): boolean {
    return (this.uris.indexOf(uri) >= 0);
  }

  // return the list of files used to build the final warpscript
  public getListOfSourceFiles(): string[] {
    return this.uris.filter(t => t.startsWith("file")).reverse();
  }

}