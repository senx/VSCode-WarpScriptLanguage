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

import { EventEmitter } from 'events';
import { v4 } from "uuid";
import WarpScriptParser, { specialCommentCommands } from "../warpScriptParser";
import { WebSocket } from 'ws';
import { workspace } from 'vscode';
import { Requester } from '../features/requester';


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

export type IRuntimeVariableType = number | boolean | string | any | RuntimeVariable[];

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
    if (this._memory === undefined && typeof this._value === 'string') {
      this._memory = new TextEncoder().encode(this._value);
    }
    return this._memory;
  }

  constructor(public readonly name: string, private _value: IRuntimeVariableType) { }

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

export function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class Warp10DebugRuntime extends EventEmitter {

  // the initial (and one and only) file we are 'debugging'
  private _sourceFile: string = '';
  private lineInfo: any;
  public get sourceFile() {
    return this._sourceFile;
  }

  private variables: any = {};

  // the contents (= lines) of the one and only file
  private sourceLines: string[] = [];
  private instructions: Word[] = [];
  private starts: number[] = [];

  // This is the next line that will be 'executed'
  private _currentLine = 0;
  private get currentLine() {
    return this._currentLine;
  }
  private set currentLine(x) {
    this._currentLine = x;
    this.instruction = this.starts[x];
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

  private ws: string;
  private sid: string;
  private endpoint: string;
  private webSocket: WebSocket;
  private firstCnx = true;
  private commentsCommands: specialCommentCommands;
  private dataStack: any[];
  private program: string;
  private inDebug = false;


  constructor(private fileAccessor: FileAccessor) {
    super();
  }

  private log(mess: any) {
    // type, text, filePath, line, column
    this.sendEvent('output', 'prio', mess, this.program, this.currentLine);
  }

  private error(e: any) {
    this.sendEvent('output', 'err', e, this.program, this.currentLine);
  }

  private debug(e: any) {
    this.sendEvent('output', 'out', e, this.program, this.currentLine);
  }


  /**
   * Start executing the given program.
   */
  public async start(program: string): Promise<string> {
    this.program = program;
    this.firstCnx = true;
    this.inDebug = true;
    await this.loadSource(this.normalizePathAndCasing(program));
    // Open WebSocket
    this.sid = v4();
    this.commentsCommands = WarpScriptParser.extractSpecialComments(this.ws ?? '');
    this.endpoint = this.commentsCommands.endpoint || workspace.getConfiguration().get('warpscript.Warp10URL');
    if (!!this.webSocket) {
      this.webSocket.close();
      this.webSocket = undefined;
    }
    const wrapped = `true STMTPOS '${workspace.getConfiguration().get('warpscript.traceToken')}' CAPADD <% ${this.addBreakPoints(this.ws)} %> '${this.sid}' TRACE EVAL`;
    const traceURL: string = workspace.getConfiguration().get('warpscript.traceURL');
    this.webSocket = new WebSocket(traceURL);
    this.webSocket.on('open', () => this.log('Connected to server'));
    this.webSocket.on('error', (e: any) => {
      if (e.code === 'ECONNREFUSED') {
        this.error(`${traceURL} seems to be unreachable.`);
      } else {
        this.error(e);
      }
      this.sendEvent('end');
    });
    this.webSocket.on('message', async (msg: Buffer) => {
      this.debug(`Received message from server: ${msg}`);
      if (msg.toString().startsWith('Welcome to the ')) {
        this.sendtoWS('ATTACH ' + this.sid);
      }
      if (msg.toString().startsWith('// Maximum server capacity ')) {
        this.close();
        this.error(msg.toString());
      }
      if (msg.toString().startsWith('OK Attached to session')) {
        Requester.send(this.endpoint, wrapped)
          .then((r: any) => {
            this.close();
            this.sendEvent('debugResult', r);
          })
          .catch((e: any) => {
            console.error('WS Error', e, wrapped);
            this.error(e.message ?? e);
            this.close();
          });
      } else if (msg.toString() === 'ERROR No paused execution.') {
        this.close();
      } else if (msg.toString().startsWith('STEP')) {
        if (this.firstCnx) {
          this.firstCnx = false;
          this.continue(false);
        } else {
          if (this.inDebug) {
            await this.getVars();
          }
        }
        if (/'BREAKPOINT' FUNCREF/.test(msg.toString())) {
          this.sendEvent('stopOnBreakpoint');
        } else {
          this.sendEvent('stopOnStep');
        }
      }
    });

    this.webSocket.on('close', () => this.log('Disconnected from server'));
    return this.ws;
  }

  public close() {
    this.inDebug = false;
    if (this.webSocket) {
      this.sendtoWS('STOP');
      this.sendtoWS('DETACH ' + this.sid);
      this.webSocket.close();
    }
    this.sendEvent('end');
  }

  async getVarValue(key: string) {
    return new Promise((resolve, reject) => {
      Requester.send(this.endpoint, `'${this.sid}' TSESSION TSTACK STACKTOLIST DROP '${key}' LOAD`)
        .then((vars: any) => {
          const data = JSON.parse(vars ?? '[]')[0];
          resolve(JSON.stringify(data));
        }).catch(e => reject(e));
    });
  }

  private async getVars(): Promise<any> {
    return new Promise((resolve, reject) => {
      Requester.send(this.endpoint, `<% '${this.sid}' TSESSION 
      <% 'last.stmtpos' STACKATTRIBUTE '.stmtpos' TSTORE %> TEVAL
        TSTACK SYMBOLS 'symbols' STORE 
        STACKTOLIST REVERSE 'stack' STORE
        { 
          'vars' { $symbols <% DUP LOAD TYPEOF %> FOREACH } 
          'stack' $stack <% TYPEOF %> F LMAP
          'lastStmtpos'  '.stmtpos' TLOAD
        }
        %> <% RETHROW %> <% %> TRY`)
        .then((vars: any) => {

          const data = JSON.parse(vars ?? '[]')[0];
          this.variables = data?.vars ?? {};
          this.dataStack = [... (data?.stack ?? [])];
          if (data.lastStmtpos) {
            this.lineInfo = data.lastStmtpos.split(':').map((l: string) => parseInt(l, 10));
          } else {
            this.lineInfo = undefined;
          }
          resolve(data);
        }).catch(e => reject(e));
    });
  }

  private addBreakPoints(ws: string) {
    const bps = this.breakPoints.get(this._sourceFile);
    const splittedWS = (ws ?? '').split('\n');
    (bps ?? [])
      .filter(b => b.verified)
      .forEach((b: any) => {
        const line = b.line;
        splittedWS[line] = 'BREAKPOINT ' + splittedWS[line];
      });
    return splittedWS.join('\n');
  }

  private sendtoWS(message: string) {
    this.debug('Send to WebSocket ' + message);
    this.webSocket.send(message);
  }

  /**
   * Continue execution to the end/beginning.
   */
  public continue(reverse: boolean) {
    this.sendtoWS('CONTINUE');
    while (!this.executeLine(this.currentLine, reverse)) {
      if (this.updateCurrentLine(reverse)) {
        break;
      }
      if (this.findNextStatement(reverse)) {
        break;
      }
    }
  }

  /**
   * Step to the next/previous non empty line.
   */
  public step(_instruction: boolean, _reverse: boolean) {
    this.sendtoWS('STEP');
  }

  private updateCurrentLine(reverse: boolean): boolean {
    if (reverse) {
      if (this.currentLine > 0) {
        this.currentLine--;
      } else {
        // no more lines: stop at first line
        this.currentLine = 0;
        this.sendEvent('stopOnEntry');
        return true;
      }
    } else {
      if (this.currentLine < this.sourceLines.length - 1) {
        this.currentLine++;
      } else {
        this.sendEvent('end');
        return true;
      }
    }
    return false;
  }

  public stepIn() {
    this.sendtoWS('STEPINTO');
  }

  public stepOut() {
    this.sendtoWS('STEPRETURN');
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
    const frames: IRuntimeStackFrame[] = [];
    for (let i = 0; i < this.dataStack.length; i++) {
      let f = this.dataStack[i];
      if (typeof f === 'object') {
        f = JSON.stringify(f);
      }
      frames.push({ index: i, name: f, file: this._sourceFile, line: this.currentLine, column: 0 });
    }
    return { frames: frames, count: frames.length };
  }

  /*
   * Determine possible column breakpoint positions for the given line.
   */
  public getBreakpoints(_path: string, _line: number): any {
    if (this.lineInfo) {
      return {
        line: this.lineInfo[0],
        colStart: this.lineInfo[1] + 1,
        colEnd: this.lineInfo[2] + 1
      };
    }
    else return {
      line: this.currentLine,
      colStart: 0,
      colEnd: 0
    }
  }

  /*
   * Set breakpoint in file with given line.
   */
  public async setBreakPoint(path: string, line: number): Promise<IRuntimeBreakpoint> {
    path = this.normalizePathAndCasing(path);
    const bp: IRuntimeBreakpoint = { verified: false, line, id: this.breakpointId++ };
    let bps = this.breakPoints.get(path);
    if (!bps) {
      bps = new Array<IRuntimeBreakpoint>();
      this.breakPoints.set(path, bps);
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
      const index = bps.findIndex(bp => bp.line === line);
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

  public setDataBreakpoint(address: string, accessType: 'read' | 'write' | 'readWrite'): boolean {
    const x = accessType === 'readWrite' ? 'read write' : accessType;
    const t = this.breakAddresses.get(address);
    if (t) {
      if (t !== x) {
        this.breakAddresses.set(address, 'read write');
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
    const globals = [new RuntimeVariable('endpoint', this.endpoint)];
    if (this.commentsCommands.displayPreviewOpt) {
      globals.push(new RuntimeVariable('displayPreviewOpt', this.commentsCommands.displayPreviewOpt));
    }
    if (this.commentsCommands.listOfMacroInclusion) {
      globals.push(new RuntimeVariable('listOfMacroInclusion', this.commentsCommands.listOfMacroInclusion.map((m, i) => new RuntimeVariable(`${i}`, m))));
    }
    if (this.commentsCommands.listOfMacroInclusionRange) {
      globals.push(new RuntimeVariable('listOfMacroInclusionRange', this.commentsCommands.listOfMacroInclusionRange.map((m, i) => new RuntimeVariable(`${i}`, JSON.stringify(m)))));
    }
    if (this.commentsCommands.localmacrosubstitution) {
      globals.push(new RuntimeVariable('localmacrosubstitution', this.commentsCommands.localmacrosubstitution));
    }
    if (this.commentsCommands.theme) {
      globals.push(new RuntimeVariable('theme', this.commentsCommands.theme));
    }
    if (this.commentsCommands.timeunit) {
      globals.push(new RuntimeVariable('timeunit', this.commentsCommands.timeunit));
    }
    return globals;
  }

  private toRuntimeVariable(k: string, v: any): RuntimeVariable {
    const variable = new RuntimeVariable(k, v);
    // variable.setMemory(k);
    return variable;
  }

  public getLocalVariables(): RuntimeVariable[] {
    return Object.keys(this.variables ?? {}).map(k => this.toRuntimeVariable(k, this.variables[k]));
  }

  public getLocalVariable(name: string): RuntimeVariable | undefined {
    if (this.variables[name]) {
      let v = this.variables[name];
      return this.toRuntimeVariable(name, v);
    } else {
      return undefined;
    }
  }

  public disassemble(address: number, instructionCount: number): RuntimeDisassembledInstruction[] {
    const instructions: RuntimeDisassembledInstruction[] = [];
    for (let a = address; a < address + instructionCount; a++) {
      if (a >= 0 && a < this.instructions.length) {
        instructions.push({
          address: a,
          instruction: this.instructions[a].name,
          line: this.instructions[a].line
        });
      } else {
        instructions.push({
          address: a,
          instruction: 'nop'
        });
      }
    }

    return instructions;
  }

  // private methods
  private getLine(line?: number): string {
    return this.sourceLines[line === undefined ? this.currentLine : line].trim();
  }

  private getWords(l: number, line: string): Word[] {
    console.log('getWords', l, line)
    // break line into words
    const WORD_REGEXP = /[a-z]+/ig;
    const words: Word[] = [];
    let match: RegExpExecArray | null;
    while (match = WORD_REGEXP.exec(line)) {
      words.push({ name: match[0], line: l, index: match.index });
    }
    return words;
  }

  private async loadSource(file: string): Promise<void> {
    if (this._sourceFile !== file) {
      this._sourceFile = this.normalizePathAndCasing(file);
      this.initializeContents(await this.fileAccessor.readFile(file));
    }
  }

  private initializeContents(memory: Uint8Array) {
    this.ws = new TextDecoder().decode(memory);
    this.sourceLines = this.ws.split(/\r?\n/);
  }

  /**
   * return true on stop
   */
  private findNextStatement(reverse: boolean, stepEvent?: string): boolean {
    for (let ln = this.currentLine; reverse ? ln >= 0 : ln < this.sourceLines.length; reverse ? ln-- : ln++) {
      // is there a source breakpoint?
      const breakpoints = this.breakPoints.get(this._sourceFile);
      if (breakpoints) {
        const bps = breakpoints.filter(bp => bp.line === ln && bp.verified === true);
        if (bps.length > 0) {
          this.sendEvent('stopOnBreakpoint');
          this.currentLine = ln;
          return true;
        }
      }
      const line = this.getLine(ln);
      if (line.length > 0) {
        this.currentLine = ln;
        break;
      }
    }
    if (stepEvent) {
      this.sendEvent(stepEvent);
      return true;
    }
    return false;
  }

  private executeLine(_ln: number, _reverse: boolean): boolean {
    return false;
  }

  private async verifyBreakpoints(path: string): Promise<void> {
    const bps = this.breakPoints.get(path);
    if (bps) {
      await this.loadSource(path);
      bps.forEach(bp => {
        if (!bp.verified && bp.line < this.sourceLines.length) {
          bp.verified = true;
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
          this.sendEvent('breakpointValidated', bp);
        }
      });
    }
  }

  private sendEvent(event: string, ...args: any[]): void {
    setTimeout(() => this.emit(event, ...args), 0);
  }

  private normalizePathAndCasing(path: string) {
    if (this.fileAccessor.isWindows) {
      return path.replace(/\//g, '\\').toLowerCase();
    } else {
      return path.replace(/\\/g, '/');
    }
  }
}
