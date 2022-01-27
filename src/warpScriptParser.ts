import { TextDocument, Range, Position, CancellationToken, CodeLens } from 'vscode';
import { CancellationTokenSource } from 'vscode-languageclient';

/**
 * Parsing result of // @command parameter  in the beginning of the WarpScript
 */
export interface specialCommentCommands {
  endpoint?: string;
  timeunit?: string;
  localmacrosubstitution?: boolean,
  displayPreviewOpt?: string,
  listOfMacroInclusion?: string[]
}

/**
 * Little class to store statement and its offset in the text
 */
export class wsStatement {
  public statement: string;
  public offset: number;
  constructor(statement: string, offset: number) {
    this.statement = statement;
    this.offset = offset;
  }
}

export default class WarpScriptParser {

  /**
   * Look for macros before a statement
   * 
   * @param doc warpscript opened doc
   * @param numberOfMacros the number of macros you want to find before beforePosition
   * @param beforePosition absolute position in the text (offset)
   */
  public static getPreviousMacros(doc: TextDocument, numberOfMacros: number, beforePosition: Position, cancelToken: CancellationToken): Range[] {
    console.log("start to parse ws doc");

    let macrosPositions: any = this.parseWarpScriptMacros(doc.getText(), 0, doc, cancelToken);
    console.log("look for statement at offset" + doc.offsetAt(doc.getWordRangeAtPosition(beforePosition).start))
    let rawRanges = this.findMacrosBeforePosition(macrosPositions, doc.offsetAt(doc.getWordRangeAtPosition(beforePosition).start), numberOfMacros, cancelToken);
    // console.log(macrosPositions)
    // console.log(rawRanges)
    return rawRanges.map(r => new Range(doc.positionAt(r[0] + 2), doc.positionAt(r[1] - 1)));
  }

  /**
   * Look for a statement position in the recursive tree of macros markers.
   * 
   * @param macroPositions the table of macro positions (output of parseWarpScriptMacros)
   * @param offset the absolute position of the start of statement you are looking for
   * @param numberOfMacros the expected number of macros
   */
  public static findMacrosBeforePosition(macroPositions: any, offset: number, numberOfMacros: number, cancelToken: CancellationToken): any[] {

    for (let idx = 0; idx < macroPositions.length; idx++) {
      if (cancelToken.isCancellationRequested) {
        return null;
      }
      if (macroPositions[idx] instanceof wsStatement && (macroPositions[idx] as wsStatement).offset == offset) {
        //found the statement. need to return previous macros as ranges
        let pidx = idx - 1;
        let c = 0;
        let startEndList: any[] = [];
        while (pidx >= 0 && c < numberOfMacros) {
          if (macroPositions[pidx] instanceof wsStatement) {
            break;
          } else {
            if (typeof (macroPositions[pidx]) !== "number") {
              startEndList.push([macroPositions[pidx][0], macroPositions[pidx][macroPositions[pidx].length - 1]]);
              c++;
            }
          }
          pidx--;
        }
        return startEndList;
      } else if (typeof (macroPositions[idx]) === "number") {
        // console.log("not in this block")
      } else {
        let r = this.findMacrosBeforePosition(macroPositions[idx], offset, numberOfMacros, cancelToken);
        if (null !== r) { return r; }
      }

    }
    return null;
  }


  /**
   * a method to parse a warpscript document. it returns a complex range structure (one range for each macro)
   * 
   * returns a list of list with macros start/end positions in the text. ignore comments and strings
   *   [ [ 10 22 ] wsStatement [ 25 [ 25 35 ] [ 37 [ 40 49 ] wsStatement 52 ] 92 ] wsStatement ]
   *  
   * very most of the time, there is a wsStatement instance behind the end of a macro. It contains the next statement after %> and its position.
   *    * position = last character position ( the % for macro start, the > for macro end ) 
   */
  private static parseWarpScriptMacros(ws: String, startPosition: number, doc: TextDocument, cancelToken: CancellationToken): any {

    let i: number = startPosition;
    let result: any[] = [];
    let justAfterMacro: boolean = false;

    while (i < ws.length - 1 && !cancelToken.isCancellationRequested) { //often test 2 characters
      if (ws.charAt(i) == '<' && ws.charAt(i + 1) == "'") { //start of a multiline, look for end
        // console.log(i, 'start of multiline');
        justAfterMacro = false;
        let lines: string[] = ws.substring(i, ws.length).split('\n');
        let lc = 0;
        while (lc < lines.length && lines[lc].trim() != "'>") { i += lines[lc].length + 1; lc++; }
        i += lines[lc].length + 1;
        // console.log(i, 'end of multiline');
      }
      if (ws.charAt(i) == '/' && ws.charAt(i + 1) == '*') { //start one multiline comment, seek for end of line
        // console.log(i, 'start of multiline comment');
        i++;
        while (i < ws.length - 1 && !(ws.charAt(i) == '*' && ws.charAt(i + 1) == '/')) { i++; }
        i += 2;
        // console.log(i, 'end of multiline comment');
      }
      if (ws.charAt(i) == '/' && ws.charAt(i + 1) == '/') { //start single line comment, seek for end of line
        // console.log(i, 'start of a comment');
        i++;
        while (i < ws.length - 1 && (ws.charAt(i) != '\n')) { i++; }
        // console.log(i, 'end of a comment');
      }

      if (ws.charAt(i) == "'") { //start of string, seek for end
        // console.log(i, 'start of string');
        i++;
        while (i < ws.length && ws.charAt(i) != "'" && ws.charAt(i) != '\n') { i++; }
        // console.log(i, 'end of string');
      }
      if (ws.charAt(i) == '"') { //start of string, seek for end
        // console.log(i, 'start of string');
        i++;
        while (i < ws.length && ws.charAt(i) != '"' && ws.charAt(i) != '\n') { i++; }
        // console.log(i, 'end of string');
      }

      if (ws.charAt(i) == '<' && ws.charAt(i + 1) == '%') { //start of a macro.
        // console.log(i, 'start of macro');
        result.push([i].concat(this.parseWarpScriptMacros(ws, i + 1, doc, cancelToken)));
        let flattened = [].concat.apply([], result);
        // if there is a non complete macro, the structure may not end with a position number, but with a statement, or nothing
        if (typeof (flattened[flattened.length - 1]) == 'number') {
          i = flattened[flattened.length - 1] + 1;
          // console.log("End of macro found, skip to ", i)
        } else if (flattened[flattened.length - 1] instanceof wsStatement) {
          // console.log("Unbalanced macro structure, early return");
          return result;
        } else {
          // should never happen
          // console.log("Weird unbalanced macro structure, halt parsing at ", i);
          return result;
        }
        justAfterMacro = true;
      }

      if (ws.charAt(i) == '%' && ws.charAt(i + 1) == '>') { //end of a macro.
        // console.log(i, 'end of macro');
        result.push(i + 1)
        return (result);
      }

      //try to find the next statement after each macro, to help for construction
      if (justAfterMacro && ws.charAt(i) != ' ' && ws.charAt(i) != '"' && ws.charAt(i) != "'" && ws.charAt(i) != '\n') {
        // console.log('statement', ws.charAt(i), doc.getText(doc.getWordRangeAtPosition(doc.positionAt(i))));
        if (undefined !== doc.getWordRangeAtPosition(doc.positionAt(i))) {
          let st = doc.getText(doc.getWordRangeAtPosition(doc.positionAt(i)))
          result.push(new wsStatement(st, i))
          i += st.length;
        } else {
          result.push(new wsStatement('', i))
        }
        justAfterMacro = false;
      }

      i++;
    }

    return result;
  }


  /**
   * Unlike parseWarpScriptMacros, this function return a very simple list of statements (as strings), ignoring comments. 
   * [ '"HELLO"' '"WORLD"' '+' '2' '2' '*' ]
   * 
   * When called with withPosition true, it returns a list of list than include start and end position of the statement:
   * [ [ '"HELLO"' 4 11 ] [ '"WORLD"' 22 29 ]  ]
   */
  public static parseWarpScriptStatements(ws: String, cancelToken: CancellationToken, withPosition = false): any[] {

    let i: number = 0;
    let result: any[] = [];

    while (i < ws.length - 1 && !cancelToken.isCancellationRequested) { //often test 2 characters
      if (ws.charAt(i) == '<' && ws.charAt(i + 1) == "'") { //start of a multiline, look for end
        // console.log(i, 'start of multiline');
        let lines: string[] = ws.substring(i, ws.length).split('\n');
        let lc = 0;
        while (lc < lines.length && lines[lc].trim() != "'>") { i += lines[lc].length + 1; lc++; }
        i += lines[lc].length + 1;
        // console.log(i, 'end of multiline');
      }
      if (ws.charAt(i) == '/' && ws.charAt(i + 1) == '*') { //start one multiline comment, seek for end of comment
        // console.log(i, 'start of multiline comment');
        i++;
        while (i < ws.length - 1 && !(ws.charAt(i) == '*' && ws.charAt(i + 1) == '/')) { i++; }
        i += 2;
        // console.log(i, 'end of multiline comment');
      }
      if (ws.charAt(i) == '/' && ws.charAt(i + 1) == '/') { //start single line comment, seek for end of line
        // console.log(i, 'start of a comment');
        i++;
        while (i < ws.length - 1 && (ws.charAt(i) != '\n')) { i++; }
        // console.log(i, 'end of a comment');
      }

      if (ws.charAt(i) == "'") { //start of string, seek for end
        // console.log(i, 'start of string');
        let start = i;
        i++;
        while (i < ws.length && ws.charAt(i) != "'" && ws.charAt(i) != '\n') { i++; }
        i++;
        result.push(ws.substring(start, i));
        // console.log(i, 'end of string');
      }
      if (ws.charAt(i) == '"') { //start of string, seek for end
        // console.log(i, 'start of string');
        let start = i;
        i++;
        while (i < ws.length && ws.charAt(i) != '"' && ws.charAt(i) != '\n') { i++; }
        // console.log(i, 'end of string');
        i++;
        result.push(ws.substring(start, i));
      }

      if (ws.charAt(i) == '<' && ws.charAt(i + 1) == '%') { //start of a macro.
        // console.log(i, 'start of macro');
        result.push("<%");
        i += 2;
      }

      if (ws.charAt(i) == '%' && ws.charAt(i + 1) == '>') { //end of a macro.
        // console.log(i, 'end of macro');
        result.push("%>");
        i += 2;
      }

      if (ws.charAt(i) != ' ' && ws.charAt(i) != '\n') {
        let start = i;
        while (i < ws.length && ws.charAt(i) != ' ' && ws.charAt(i) != '\n') { i++; }
        if (withPosition) {
          result.push([ws.substring(start, i), start, i]);
        } else {
          result.push(ws.substring(start, i));
        }
      }
      i++;
    }

    return result;
  }

  public static getListOfMacroCallsWithPosition(ws: String): any[] {
    let c = new CancellationTokenSource();
    return this.parseWarpScriptStatements(ws, c.token, true).filter(s => { return s[0].startsWith('@') });
  }

  public static getListOfMacroCalls(ws: String): any[] {
    let c = new CancellationTokenSource();
    return this.parseWarpScriptStatements(ws, c.token).filter(s => { return s.startsWith('@') });
  }

  private static codeLensStatements: { [key: string]: string[] } = {
    'IFT': ['then...', 'if...'],
    'IFTE': ['else...', 'then...', 'if...'],
    'FOREACH': ['for each...'],
    'LMAP': ['lmap...'],
    'WHILE': ['while...'],
    'FOR': ['for...'],
    'GROUPBY': ['group by...'],
    'FILTERBY': ['filter by...'],
    'TRY': ['finally...', 'catch...', 'try...'],
    'UNTIL': ['until...', 'do...'],
    'FORSTEP': ['for...', 'FORSTEP step...']
  }

  /**
   * Code Lenses are little links inserted between lines. The idea is to insert links to help readability 
   * and understanding of very long macros (more than 20 lines)
   * For example, "try..."  "then..." "else..." at the beginning of the macro. clicking on these select the statement (TRY or IFTE)
   * 
   * @param doc current warpscript doc
   * @param cancelToken 
   */
  public static getCodeLenses(doc: TextDocument, minimumLineNumber: number, cancelToken: CancellationToken): CodeLens[] {

    //parse the doc
    let macrosPositions: any = this.parseWarpScriptMacros(doc.getText(), 0, doc, cancelToken);
    //console.log("RAW DATA",macrosPositions);
    let lenses: CodeLens[] = this.searchForLongMacros(macrosPositions, minimumLineNumber, doc, cancelToken);
    //console.log("final lenses array", lenses);

    return lenses;
  }

  private static searchForLongMacros(macroPositions: any, minimumLineCount: number, doc: TextDocument, cancelToken: CancellationToken): any[] {
    let rangesResult: any[] = [];
    for (let idx = 0; idx < macroPositions.length; idx++) {
      if (cancelToken.isCancellationRequested) {
        console.log("canceled by vscode")
        return [];
      }
      //found a statement that match our codeLens list.
      if (macroPositions[idx] instanceof wsStatement) {
        if (Object.keys(this.codeLensStatements).includes((macroPositions[idx] as wsStatement).statement)) {
          // console.log("found a " + (macroPositions[idx] as wsStatement).statement)
          //found a statement. if previous macros are very long, push a codeLens
          let pidx = idx - 1;
          let c = 0;
          while (pidx >= 0 && c < this.codeLensStatements[(macroPositions[idx] as wsStatement).statement].length) {
            if (macroPositions[pidx] instanceof wsStatement) {
              break;
            } else {
              let mstart: Position = doc.positionAt(macroPositions[pidx][0]);
              let mend: Position = doc.positionAt(macroPositions[pidx][macroPositions[pidx].length - 1]);
              // console.log(mstart, mend);
              if (mend.line - mstart.line > minimumLineCount) {
                // console.log("found long block")
                rangesResult.push(new CodeLens(new Range(mstart, mstart), {
                  title: this.codeLensStatements[(macroPositions[idx] as wsStatement).statement][c],
                  command: "extension.jumptoWSoffset",
                  arguments: [(macroPositions[idx] as wsStatement).offset]
                }));
              }
              c++;
            }
            pidx--;
          }
        }
      } else if (typeof (macroPositions[idx]) === "number") {
      } else {
        rangesResult = rangesResult.concat(this.searchForLongMacros(macroPositions[idx], minimumLineCount, doc, cancelToken));
      }
    }
    return rangesResult;
  }



  public static extractSpecialComments(executedWarpScript: string): specialCommentCommands {
    let result: specialCommentCommands = {};
    let warpscriptlines = executedWarpScript.split('\n');
    result.listOfMacroInclusion = [];
    for (let l = 0; l < warpscriptlines.length; l++) {
      let currentline = warpscriptlines[l];
      if (currentline.startsWith("//")) {
        //find and extract // @paramname parameters
        let extraparamsPattern = /\/\/\s*@(\w*)\s*(.*)$/g;
        let lineonMatch: RegExpMatchArray | null;
        let re = RegExp(extraparamsPattern);
        while (lineonMatch = re.exec(currentline.replace('\r', ''))) {  //think about windows... \r\n in mc2 files !
          let parametername = lineonMatch[1];
          let parametervalue = lineonMatch[2];
          switch (parametername) {
            case "endpoint":        //        // @endpoint http://mywarp10server/api/v0/exec
              result.endpoint = parametervalue;   // overrides the Warp10URL configuration
              break;
            case "localmacrosubstitution":
              result.localmacrosubstitution = ("true" === parametervalue.trim().toLowerCase());   // overrides the substitutionWithLocalMacros
              break;
            case "timeunit":
              if (['us', 'ms', 'ns'].indexOf(parametervalue.trim()) > -1) {
                result.timeunit = parametervalue.trim();
              }
              break;
            case "preview":
              switch (parametervalue.toLowerCase().substr(0, 4)) {
                case "none": result.displayPreviewOpt = 'X'; break;
                case "gts": result.displayPreviewOpt = 'G'; break;
                case "imag": result.displayPreviewOpt = 'I'; break;
                default: result.displayPreviewOpt = ''; break;
              }
              break;
            case "includeLocalMacro":
              result.listOfMacroInclusion.push(parametervalue.trim());
              break;
            default:
              break;
          }
        }
      }
      else {
        break; //no more comments at the beginning of the file
      }
    }
    return result;
  }
}