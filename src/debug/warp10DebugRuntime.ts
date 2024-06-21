/*
 *  Copyright 2024  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { EventEmitter } from "events";
import { v4 } from "uuid";
import { specialCommentCommands } from "../warpScriptParser";
import { WebSocket } from "ws";
import { workspace, Uri } from "vscode";
import { Requester } from "../features/requester";
import MacroIncluder from '../features/macroIncluder';
import { lineInFile } from '../features/macroIncluder';
import WSDiagnostics from "../providers/wsDiagnostics";
import { EndPointProp } from "../globals";

export interface FileAccessor {
  isWindows: boolean;
  readFile(path: string): Promise<Uint8Array>;
  writeFile(path: string, contents: Uint8Array): Promise<void>;
}

export interface IRuntimeBreakpoint {
  id: number;
  line: number;
  verified: boolean;
}

interface IRuntimeStepInTargets {
  id: number;
  label: string;
}

interface IRuntimeStackFrame {
  index: number;
  name: string;
  file: string;
  line: number;
  column?: number;
  instruction?: number;
  level?: number;
}

interface IRuntimeStack {
  count: number;
  frames: IRuntimeStackFrame[];
}

interface RuntimeDisassembledInstruction {
  address: number;
  instruction: string;
  line?: number;
}

export type IRuntimeVariableType =
  | number
  | boolean
  | string
  | any
  | RuntimeVariable[];

export class RuntimeVariable {
  private _memory?: Uint8Array;

  public reference?: number;

  public get value() {
    return this._value;
  }

  public set value(value: IRuntimeVariableType) {
    this._value = value;
    this._memory = undefined;
  }

  public get memory() {
    if (this._memory === undefined && typeof this._value === "string") {
      this._memory = new TextEncoder().encode(this._value);
    }
    return this._memory;
  }

  constructor(
    public readonly name: string,
    private _value: IRuntimeVariableType
  ) { }

  public setMemory(data: string, offset = 0) {
    const memory = this.memory;
    if (!memory) {
      return;
    }

    memory.set(new TextEncoder().encode(data), offset);
    this._memory = memory;
  }
}

interface Word {
  name: string;
  line: number;
  index: number;
}

export function timeout(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class Warp10DebugRuntime extends EventEmitter {
  // the initial (and one and only) file we are 'debugging'
  private _sourceFile: string = "";
  private lineInfo: any;
  private errorpos: any;
  private errorMess: any[];
  public get sourceFile() {
    return this._sourceFile;
  }

  private variables: any = {};

  // the contents (= lines) of the one and only file
  private sourceLines: string[] = [];
  private instructions: Word[] = [];

  // This is the next line that will be 'executed'
  private _currentLine = 0;
  private get currentLine() {
    return this._currentLine;
  }
  private set currentLine(x) {
    this._currentLine = x;
  }

  // This is the next instruction that will be 'executed'
  public instruction = 0;

  // maps from sourceFile to array of IRuntimeBreakpoint
  private breakPoints = new Map<string, IRuntimeBreakpoint[]>();

  // all instruction breakpoint addresses
  private instructionBreakpoints = new Set<number>();

  // since we want to send breakpoint events, we will assign an id to every event
  // so that the frontend can match events with breakpoints.
  private breakpointId = 1;

  private breakAddresses = new Map<string, string>();

  private ws: string | undefined;
  private sid: string | undefined;
  private endpoint: string | undefined;
  private webSocket: WebSocket | undefined;
  //private firstCnx = true;
  private commentsCommands: specialCommentCommands | undefined;
  private dataStack: any[] | undefined;
  //private program: string | undefined;
  private inDebug = false;
  private checkWS: any = {};

  // keeps warpscript with local macro. (wswlm)
  public wswlm: MacroIncluder;

  // after getVars(), this stores the current file and current line in file (in case of local macro inclusion)
  private fileAndLine: lineInFile = {
    file: "",
    line: 0
  };

  constructor(private fileAccessor: FileAccessor) {
    super();
  }

  private log(mess: any, popin?: boolean) {
    // type, text, filePath, line, column
    this.sendEvent("output", "prio", mess, this.fileAndLine.file, this.fileAndLine.line, undefined, popin);
  }

  private error(e: any, popin?: boolean) {
    this.sendEvent("output", "err", e, this.fileAndLine.file, this.fileAndLine.line, undefined, popin);
  }

  private debug(e: any) {
    this.sendEvent("output", "out", e, this.fileAndLine.file, this.fileAndLine.line);
  }

  public async getContent(program: string): Promise<string> {
    if (!this.ws) {
      await this.loadSource(this.normalizePathAndCasing(program));
    }
    return this.ws;
  }


  public async loadWarpScript(ws: string, uri: string) {
    this.wswlm = new MacroIncluder();
    await this.wswlm.loadWarpScript(ws, uri);
    this.commentsCommands = this.wswlm.commentsCommands;
    this._sourceFile = uri;
  }

  /**
   * Start executing the given program.
   */
  public async start(checkWS: any): Promise<string> {
    this.checkWS = checkWS;
    //this.firstCnx = true;
    //this.ws = this.wswlm.getFinalWS();
    // Open WebSocket
    this.sid = v4();
    this.endpoint = this.commentsCommands.endpoint || workspace.getConfiguration().get("warpscript.Warp10URL");
    if (!!this.webSocket) {
      this.webSocket.close();
      this.webSocket = undefined;
    }
    let prop: EndPointProp = WSDiagnostics.getEndpointProperties(this.endpoint ?? '');
    if (prop.traceCapAvailableForAll) {
      // add instructions for trace plugin
      this.wswlm.prependLinesToAll(`true STMTPOS '${this.sid}' TRACEMODE`);
    } else {
      const traceToken = (workspace.getConfiguration().get<any>("warpscript.TraceTokensPerWarp10URL") ?? {})[this.endpoint];
      if (!traceToken) {
        this.sendEvent('openTracePluginInfo', 'You must set a token with the "trace" capability', 'openSettings');
        return "";
      }
      this.wswlm.prependLinesToAll(`true STMTPOS '${traceToken}' CAPADD '${this.sid}' TRACEMODE`);
    }



    // add breakpoints
    this.sourceLines = this.wswlm.finalWarpScript;
    const traceURL: string = (checkWS?.extensions ?? {}).traceWSEndpoint;
    if (!traceURL) {
      this.close();
      return this.ws ?? "";
    }
    this.webSocket = new WebSocket(traceURL);
    this.webSocket.on("open", () => this.log(`Connected to server: ${traceURL}`));
    this.webSocket.on("error", (e: any) => {
      console.error("webSocket error", e);
      if (e.code === "ECONNREFUSED" || "ENOTFOUND" === e.code || e.code === "ESOCKETTIMEDOUT") {
        this.error(`${traceURL} seems to be unreachable.`, true);
      } else {
        this.error(e);
      }
      this.close();
    });
    this.webSocket.on("message", async (buf: Buffer) => {
      const msg = buf.toString('utf-8');
      this.debug(`Received message from server: ${msg}`);
      if (msg.startsWith('VERSION')) {
        this.sendtoWS("ATTACH " + this.sid);
      } else if (msg.startsWith("// Maximum number of concurrent sessions reached")) {
        this.close();
        this.error(msg.replace("// ", ""), true);
      } else if (msg.startsWith("OK Attached to session")) {
        this.sendtoWS("CATCH");
        Requester.send(this.endpoint ?? "", this.wswlm.getFinalWS())
          .then((r: any) => {
            this.close();
            this.sendEvent("debugResult", r);
          })
          .catch((e: any) => {
            if ((e.message ?? e).startsWith("Exception at ")) {
              this.error(((e.message ?? e).split("[TOP]")[1] ?? "").replace(/\(/, "").replace(/\)/, ""), true);
            } else {
              this.error(e.message ?? e);
            }
            this.close();
          });
      } else if (msg === "ERROR No paused execution.") {
        // this can legitimely happens when user keeps pressing F5. several CONTINUE order stacks up, and several are sent just after the STEP pause.
      } else if (msg.startsWith("STEP")) {
        // in any case, the trace plugin will stop on first function, for example: STEP 8acd29c6-ce48-4dd6-bf09-7bb09a4a7772 1 66fbf6ae-2b15-4a0b-9ae5-003e71c1481f 0 '%2B' FUNCREF
        // but if the first line has a breakpoint, it will stop on the breakpoint first. so, the first step can be a valid breakpoint !        
        if (this.inDebug || /'BREAKPOINT' FUNCREF/.test(msg)) { // in debug, or breakpoint
          await this.getVars();
          this.sendEvent("stopOnStep");
        } else {
          this.continue(); // avoid the first step, when first line with an instruction is not a breakpoint
        }
        this.inDebug = true;
        // if (this.inDebug) {
        //   await this.getVars();
        // }
        // if (/'BREAKPOINT' FUNCREF/.test(msg)) {
        //   //this.sendEvent("stopOnBreakpoint");
        //   this.sendtoWS('STEP'); // this trick is to force a step after breakpoint ?
        // } else {
        //   if (!this.firstCnx) {
        //     this.sendEvent("stopOnStep");
        //   } else {
        //     this.continue();
        //     this.inDebug = true;
        //     this.firstCnx = false;
        //   }
        // }
      } else if (msg.startsWith('EXCEPTION')) {
        await timeout(500);
        await this.getVars(msg);  // will set the position cursor, and switch to the right editor too... so let it manage the diagnostic too.

        // this.errorpos = this.errorpos ?? this.lineInfo;
        // let errMess = msg;
        // if (this.errorMess && this.errorMess.length > 0) {
        //   errMess = this.errorMess[0].message ?? msg;
        // }
        // if ((this.errorpos ?? []).length > 1) {
        //   const curLine = this.getLine(this.errorpos[0] - 1);
        //   const offset = curLine.startsWith('BREAKPOINT') ? 'BREAKPOINT'.length : -1;
        //   const bps: number[] = [Math.max(this.errorpos[2] - offset, 0)];
        //   errMess = `Error line ${this.errorpos[0] - 1}:${Math.max(this.errorpos[1] - offset, 0)}: ${errMess}`;
        //   this.sendEvent('stopOnException', { // will again set the cursor and a diagnostic underline
        //     e: errMess,
        //     info: {
        //       line: this.errorpos[0] - 1,
        //       colStart: Math.max(this.errorpos[1] - offset, 0),
        //       colEnd: Math.max(this.errorpos[2] - offset, 0),
        //       bps
        //     }
        //   });
        // }
        // this.error(errMess, false);
      }
    });

    this.webSocket.on("close", () => {
      this.log("Disconnected from server");
      this.ws = undefined;
      this.close();
    });
    return this.ws ?? "";
  }

  public close() {
    if (this.webSocket) {
      this.sendtoWS("STOP");
      this.sendtoWS("DETACH " + this.sid);
      this.webSocket.close();
    }
    this.inDebug = false;
    this.sendEvent("end");
  }

  async getVarValue(key: string) {
    return new Promise((resolve, reject) => {
      Requester.send(this.endpoint ?? "", `'${this.sid}' TSESSION TSTACK STACKTOLIST DROP '${key}' LOAD`)
        .then((vars: any) => resolve((vars ?? "[]").replace(/^\[(.*)\]/g, '$1')))
        .catch((e) => reject(e));
    });
  }


  async getStackValue(key: string) {
    return new Promise((resolve, reject) => {
      Requester.send(this.endpoint ?? "", `'${this.sid}' TSESSION TSTACK STACKTOLIST REVERSE ${key} GET`)
        .then((vars: any) => resolve((vars ?? "[]").replace(/^\[(.*)\]/g, '$1')))
        .catch((e) => reject(e));
    });
  }


  public async evaluateInDebugConsole(warpscript: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const ws = `<% '${this.sid}' TSESSION <%
${warpscript}
%> TEVAL TSTACK
%> <% ERROR -1 GET 'message' GET %> <% %> TRY
      `
      Requester.send(this.endpoint ?? "", ws)
        .then((res: any) => {
          // an evaluation can lead to new variables, so refresh them.
          this.getVars().then(() => { resolve(res) }).catch(() => { resolve(res) });
        }).catch(e => {
          console.error('evaluateInDebugConsole', e);
          reject(e);
        });
    });
  }

  private async getVars(exceptionTraceMsg?: string): Promise<any> {
    if (!this.inDebug) return Promise.resolve({});
    return new Promise((resolve, reject) => {
      const ws = `<% '${this.sid}' TSESSION 
<%
'last.stmtpos' STACKATTRIBUTE '.stmtpos' TSTORE 'last.errorpos' STACKATTRIBUTE '.errorpos' TSTORE %> TEVAL
TSTACK SYMBOLS 'symbols' STORE 
STACKTOLIST REVERSE 'stack' STORE
{ 
    'vars' { $symbols <% DUP LOAD TYPEOF %> FOREACH } 
    'stack' $stack <% TYPEOF %> F LMAP
    'lastStmtpos'  '.stmtpos' TLOAD
    'errorpos'  '.errorpos' TLOAD
    'terror' TERROR 
}
%> <% RETHROW %> <% %> TRY`;
      Requester.send(this.endpoint ?? "", ws)
        .then((vars: any) => {
          const data = JSON.parse(vars ?? "[]")[0];
          // this.wswlm.printFullWs()
          // console.warn(data)
          this.variables = data?.vars ?? {};
          this.dataStack = [...(data?.stack ?? [])];
          if (data.lastStmtpos) {
            this.lineInfo = data.lastStmtpos.split(":").map((l: string) => parseInt(l, 10));
            this.errorpos = (data.errorpos ?? data.lastStmtpos).split(":").map((l: string) => parseInt(l, 10));
            this.errorMess = data.terror;
            this.currentLine = this.lineInfo[0];

            if ((this.lineInfo ?? []).length > 0) {
              const curLine = this.wswlm.finalWarpScript[this.lineInfo[0] - 1]; // line sent by lastStmtpos is also starting at 1
              const offset = curLine.startsWith('BREAKPOINT') ? 'BREAKPOINT'.length : -1;
              this.fileAndLine = this.wswlm.getUriAndLineFromRealLine(this.lineInfo[0] - 1) // line sent by lastStmtpos is also starting at 1
              console.log("file and line (0 index)=", this.fileAndLine)

              let showDiagnostic = false;
              let diagMsg = "";
              let diagLine = 0;
              let diagColStart = 0;
              let diagColEnd = 0;


              if (exceptionTraceMsg) {
                let errMess = exceptionTraceMsg;
                if (this.errorMess && this.errorMess.length > 0) {
                  errMess = this.errorMess[0].message ?? exceptionTraceMsg;
                }
                if ((this.errorpos ?? []).length > 1) {
                  const curErrLine = this.wswlm.finalWarpScript[this.errorpos[0]];
                  const errOffset = curErrLine.startsWith('BREAKPOINT') ? 'BREAKPOINT'.length : -1;
                  const errfileAndLine: lineInFile = this.wswlm.getUriAndLineFromRealLine(this.errorpos[0] - 1) // line sent by errorpos is also starting at 1
                  showDiagnostic = true;
                  diagMsg = errMess;
                  diagLine = errfileAndLine.line;
                  diagColStart = Math.max(this.errorpos[1] - errOffset, 0);
                  diagColEnd = Math.max(this.errorpos[2] - errOffset, 0);
                }
              }
              // send event to the frontend
              this.sendEvent('highlightEvent', {
                line: this.fileAndLine.line, // line starts at 0
                colStart: Math.max(this.lineInfo[1] - offset, 0),
                colEnd: Math.max(this.lineInfo[2] - offset, 0),
                path: this.fileAndLine.file,
                showDiagnostic: showDiagnostic,
                diagMsg: diagMsg,
                diagLine: diagLine,
                diagColStart: diagColStart,
                diagColEnd: diagColEnd
              });
            }
          } else {
            this.lineInfo = undefined;
          }
          resolve(data);
        })
        .catch(e => {
          console.error('getVars', e);
          reject(e);
        });
    });
  }

  // private addBreakPoints(ws: string) {
  //   const bps = this.breakPoints.get(this._sourceFile);
  //   const splittedWS = (ws ?? "").split("\n");
  //   (bps ?? []).filter((b) => b.verified)
  //     .forEach((b: any) => splittedWS[b.line] = `BREAKPOINT ${(splittedWS[b.line] ?? '')}`.trim());
  //   return splittedWS.join("\n");
  // }

  private sendtoWS(message: string) {
    if (this.webSocket) {
      this.debug("Send to WebSocket " + message);
      this.webSocket.send(message);
    } else {
      console.error('Socket closed')
    }
  }

  /**
   * Continue execution to the end/beginning.
   */
  public continue() {
    this.sendtoWS("CONTINUE");
  }

  /**
   * Step to the next/previous non empty line.
   */
  public step(_instruction: boolean, _reverse: boolean) {
    this.sendtoWS("STEP");
  }

  public stepIn() {
    // this.sendtoWS("STEPINTO");
  }

  public stepOut() {
    // this.sendtoWS("STEPRETURN");
  }

  public getStepInTargets(frameId: number): IRuntimeStepInTargets[] {
    const line = this.getLine();
    const words = this.getWords(this.currentLine, line);
    // return nothing if frameId is out of range
    if (frameId < 0 || frameId >= words.length) {
      return [];
    }
    const { name, index } = words[frameId];
    return name.split('').map((c, ix) => ({ id: index + ix, label: `target: ${c}` }));
  }

  public stack(_startFrame: number, _endFrame: number): IRuntimeStack {
    const frames: IRuntimeStackFrame[] = [{
      name: 'WarpScript',
      file: Uri.parse(this.fileAndLine.file).fsPath,
      index: 0,
      line: this.currentLine
    }];
    return { frames: frames, count: frames.length };
  }

  public isDebug() {
    return this.inDebug;
  }

  public printAllBreakpoints() {
    console.log("######## dump known breakpoints", this.breakPoints)
    this.breakPoints.forEach((v: IRuntimeBreakpoint[], k: string) => {
      console.log(k, v);
    });
    console.log("# dump breakAddresses", this.breakAddresses);
  }

  // first line is zero. do the shift in the frontend interface before calling this function.
  public setLineBreakPoint(path: string, line: number): boolean {
    // if (!this.inDebug) {
    //   return true; // while not in debugging, frontend just ask to validate the breakpoint. we cannot do more.
    // }
    let uri = this.normalizePathAndCasing(path);
    if (!this.wswlm.isThisFileIncluded(uri)) {
      return false; // the breakpoint is not valid, because this path is not an included macro
    }
    // TODO : check if in multiline or in comment
    return this.wswlm.prependTextToLineInFile(uri, line, "BREAKPOINT ");
  }

  /*
   * Determine possible column breakpoint positions for the given line.
   */
  public async getBreakpoints(_path: string, _line: number): Promise<any> {
    try {
      if ((this.lineInfo ?? []).length === 0) await this.getVars();
    } catch (e) {
      //    console.error(e)
    }
    if ((this.lineInfo ?? []).length > 0) {
      const curLine = this.getLine(this.lineInfo[0] - 1);
      const offset = curLine.startsWith('BREAKPOINT') ? 'BREAKPOINT'.length : -1;
      const bps: number[] = [Math.max(this.lineInfo[2] - offset, 0)];
      return {
        line: this.lineInfo[0] - 1,
        colStart: Math.max(this.lineInfo[1] - offset, 0),
        colEnd: Math.max(this.lineInfo[2] - offset, 0),
        bps
      };
    } else {
      return {
        line: this.currentLine,
        colStart: 0,
        colEnd: 0,
        bps: [0]
      };
    }
  }

  /*
   * Set breakpoint in file with given line.
   */
  public async setBreakPoint(path: string, line: number): Promise<IRuntimeBreakpoint> {
    path = this.normalizePathAndCasing(path);
    const bp: IRuntimeBreakpoint = {
      verified: false,
      line,
      id: this.breakpointId++,
    };
    let bps = this.breakPoints.get(path);
    if (!bps) {
      bps = new Array<IRuntimeBreakpoint>();
      this.breakPoints.set(path, bps);
    }
    if (!this.inDebug) {
      await this.verifyBreakpoints(path);
    }
    bps.push(bp);
    await this.verifyBreakpoints(path);
    return bp;
  }

  /*
   * Clear breakpoint in file with given line.
   */
  public clearBreakPoint(path: string, line: number): IRuntimeBreakpoint | undefined {
    const bps = this.breakPoints.get(this.normalizePathAndCasing(path));
    if (bps) {
      const index = bps.findIndex((bp) => bp.line === line);
      if (index >= 0) {
        const bp = bps[index];
        bps.splice(index, 1);
        return bp;
      }
    }
    return undefined;
  }

  public clearBreakpoints(path: string): void {
    this.breakPoints.delete(this.normalizePathAndCasing(path));
  }

  public setDataBreakpoint(address: string, accessType: "read" | "write" | "readWrite"): boolean {
    const x = accessType === "readWrite" ? "read write" : accessType;
    const t = this.breakAddresses.get(address);
    if (t) {
      if (t !== x) {
        this.breakAddresses.set(address, "read write");
      }
    } else {
      this.breakAddresses.set(address, x);
    }
    return true;
  }

  public clearAllDataBreakpoints(): void {
    this.breakAddresses.clear();
  }

  public setInstructionBreakpoint(address: number): boolean {
    this.instructionBreakpoints.add(address);
    return true;
  }

  public clearInstructionBreakpoints(): void {
    this.instructionBreakpoints.clear();
  }

  public async getGlobalVariables(_cancellationToken?: () => boolean): Promise<RuntimeVariable[]> {
    const globals = [new RuntimeVariable("endpoint", this.endpoint)];
    if (this.commentsCommands?.displayPreviewOpt) {
      globals.push(new RuntimeVariable("displayPreviewOpt", this.commentsCommands.displayPreviewOpt));
    }
    if (this.commentsCommands?.listOfMacroInclusion) {
      globals.push(new RuntimeVariable("listOfMacroInclusion", this.commentsCommands.listOfMacroInclusion.map((m, i) => new RuntimeVariable(`${i}`, m))));
    }
    if (this.commentsCommands?.listOfMacroInclusionRange) {
      globals.push(new RuntimeVariable("listOfMacroInclusionRange", this.commentsCommands.listOfMacroInclusionRange.map((m, i) => new RuntimeVariable(`${i}`, JSON.stringify(m)))));
    }
    if (this.commentsCommands?.localmacrosubstitution) {
      globals.push(new RuntimeVariable("localmacrosubstitution", this.commentsCommands.localmacrosubstitution));
    }
    if (this.commentsCommands?.theme) {
      globals.push(new RuntimeVariable("theme", this.commentsCommands.theme));
    }

    globals.push(new RuntimeVariable("timeunit", this.commentsCommands?.timeunit ?? this.getTimeUnitName(this.checkWS.stu)));
    globals.push(new RuntimeVariable("revision", this.checkWS.rev));

    return globals;
  }

  private getTimeUnitName(stu: number): string {
    switch (stu) {
      case 1000: return 'ms'
      case 1000000: return 'µs'
      case 1000000000: return 'ns'
      default: return 'µs'
    }
  }

  private toRuntimeVariable(k: string, v: any): RuntimeVariable {
    const variable = new RuntimeVariable(k, v);
    return variable;
  }

  public getLocalVariables(): RuntimeVariable[] {
    return Object.keys(this.variables ?? {}).map((k) => this.toRuntimeVariable(k, this.variables[k]));
  }


  public getStack(): RuntimeVariable[] {
    return (this.dataStack ?? []).map((k, i) => this.toRuntimeVariable(String(i), k));
  }

  public getLocalVariable(name: string): RuntimeVariable | undefined {
    if (this.variables[name]) {
      let v = this.variables[name];
      return this.toRuntimeVariable(name, v);
    } else {
      return undefined;
    }
  }

  // should never be called by frontend, marked unsupported
  public disassemble(address: number, instructionCount: number): RuntimeDisassembledInstruction[] {
    const instructions: RuntimeDisassembledInstruction[] = [];
    for (let a = address; a < address + instructionCount; a++) {
      if (a >= 0 && a < this.instructions.length) {
        instructions.push({ address: a, instruction: this.instructions[a].name, line: this.instructions[a].line, });
      } else {
        instructions.push({ address: a, instruction: "nop", });
      }
    }
    return instructions;
  }

  // private methods
  private getLine(line?: number): string {
    return (this.sourceLines[line === undefined ? this.currentLine : line] ?? '').trim();
  }

  private getWords(l: number, line: string): Word[] {
    // break line into words
    const WORD_REGEXP = /[a-z]+/gi;
    const words: Word[] = [];
    let match: RegExpExecArray | null;
    while ((match = WORD_REGEXP.exec(line))) {
      words.push({ name: match[0], line: l, index: match.index });
    }
    return words;
  }

  private async loadSource(file: string): Promise<void> {
    if (this._sourceFile !== file) {
      this._sourceFile = this.normalizePathAndCasing(file);
      if (file.startsWith("file://")) {
        file = Uri.parse(file).path
      }
      this.initializeContents(await this.fileAccessor.readFile(file));
    }
  }

  private initializeContents(memory: Uint8Array) {
    this.ws = new TextDecoder().decode(memory);
    this.sourceLines = this.ws.split(/\r?\n/);
  }

  private async verifyBreakpoints(path: string): Promise<void> {
    const bps = this.breakPoints.get(path);
    if (bps) {
      await this.loadSource(path);
      bps.forEach((bp) => {
        if (!bp.verified && bp.line < this.sourceLines.length) {
          bp.verified = true; // !this.inDebug;
          const srcLine = this.getLine(bp.line);
          // Comments and multiline handling
          if (/<'/.test(srcLine)) bp.verified = false;
          if (/'>/.test(srcLine)) bp.verified = false;
          for (let i = bp.line; i >= 0; i--) {
            if (/'>/.test(this.sourceLines[i]) || /\*\//.test(this.sourceLines[i])) {
              break;
            }
            if (/<'/.test(this.sourceLines[i]) || /\/\*/.test(this.sourceLines[i])) {
              bp.verified = false;
              break;
            }
          }
          this.sendEvent("breakpointValidated", bp);
        }
      });
    }
  }

  private sendEvent(event: string, ...args: any[]): void {
    setTimeout(() => this.emit(event, ...args), 0);
  }


  // inspired by vscode internals
  public pathToUri(path: string) {
    try {
      return Uri.file(path);
    }
    catch (e) {
      return Uri.parse(path);
    }
  }

  public normalizePathAndCasing(path: string) {
    // use URI everywhere. hope it also works in windows... it works.
    if (path.startsWith("file://")) {
      return path
    } else {
      let uri = this.pathToUri(path);
      return uri.toString();
    }
    // previously:
    // if (this.fileAccessor.isWindows) {
    //   return path.replace(/\//g, "\\").toLowerCase();
    // } else {
    //   return path.replace(/\\/g, "/");
    // }
  }
}
