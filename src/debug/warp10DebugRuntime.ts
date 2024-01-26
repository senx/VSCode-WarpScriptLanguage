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

export type IRuntimeVariableType = number | boolean | string | RuntimeVariable[];

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

  public setMemory(data: Uint8Array, offset = 0) {
    const memory = this.memory;
    if (!memory) {
      return;
    }

    memory.set(data, offset);
    this._memory = memory;
    this._value = new TextDecoder().decode(memory);
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
  public get sourceFile() {
    return this._sourceFile;
  }

  private variables: any = {};

  // the contents (= lines) of the one and only file
  private sourceLines: string[] = [];
  private instructions: Word[] = [];
  private starts: number[] = [];
  private ends: number[] = [];

  // This is the next line that will be 'executed'
  private _currentLine = 0;
  private get currentLine() {
    return this._currentLine;
  }
  private set currentLine(x) {
    this._currentLine = x;
    this.instruction = this.starts[x];
  }
  private currentColumn: number | undefined;

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

  private dataStack: any[];


  constructor(private fileAccessor: FileAccessor) {
    super();
  }

  /**
   * Start executing the given program.
   */
  public async start(program: string, stopOnEntry: boolean, debug: boolean): Promise<string> {
    console.log({ program, stopOnEntry, debug })

    await this.loadSource(this.normalizePathAndCasing(program));
    console.log({ ws: this.ws });

    // Open WebSocket
    this.sid = v4();
    const commentsCommands: specialCommentCommands = WarpScriptParser.extractSpecialComments(this.ws);
    this.endpoint = commentsCommands.endpoint || workspace.getConfiguration().get('warpscript.Warp10URL');
    if (!!this.webSocket) {
      this.webSocket.close();
      this.webSocket = undefined;
    }
    const wrapped = `'${workspace.getConfiguration().get('warpscript.traceToken')}' CAPADD <% ${this.addBreakPoints(this.ws)} %> '${this.sid}' TRACE EVAL`;


    const traceURL: string = workspace.getConfiguration().get('warpscript.traceURL');
    this.webSocket = new WebSocket(traceURL);
    this.webSocket.on('open', () => {
      console.log('Connected to server');
    });
    this.webSocket.on('message', (msg: Buffer) => {
      console.log(`Received message from server: ${msg}`);
      if (msg.toString().startsWith('Welcome to the ')) {
        this.sendtoWS('ATTACH ' + this.sid);
      }
      if (msg.toString().startsWith('OK Attached to session')) {
        // this.sendtoWS('CATCH');
        Requester.send(this.endpoint, wrapped).then((r: any) => {
          console.log('ended?', r);
        }).catch((e: any) => console.error(e));

      } else if (msg.toString() === 'ERROR No paused execution.') {
        // this.log(msg.toString());
      } else {
        this.getVars().then(() => {
          // empty
        });
        if (this.firstCnx && msg.toString().startsWith('STEP')) {
          this.firstCnx = false;
          this.continue(false);
        } else {
          this.getVars().then(() => {
            // empty
          });
        }
        //     })
        //     .catch(e => console.error(e));
      }
    });

    this.webSocket.on('close', () => {
      console.log('Disconnected from server');
    });

    /*
        if (debug) {
          await this.verifyBreakpoints(this._sourceFile);
          this.continue(false);
        } else {
          this.continue(false);
        } */
        return this.ws;
  }

  public async close(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.webSocket) {

        this.getVars().then((d) => {
          console.log({ d })
          this.sendtoWS('STOP');
          this.sendtoWS('DETACH ' + this.sid);
          this.webSocket.close();
          console.log('the end', this.dataStack)
          resolve(this.dataStack);
        }).catch(e => reject(e));
      } else {
        resolve(this.dataStack);
      }
    });
  }

  private async getVars(): Promise<any> {
    return new Promise((resolve, reject) => {
      Requester.send(this.endpoint, `<%
    '${this.sid}' TSESSION TSTACK SYMBOLS 
    '${this.sid.replace('-', '')}Symbols' STORE STACKTOLIST REVERSE 
    '${this.sid.replace('-', '')}Stack' STORE
    { 
      'vars' { $${this.sid.replace('-', '')}Symbols <% DUP LOAD %> FOREACH } 
      'stack' $${this.sid.replace('-', '')}Stack 
    }
    %> <% RETHROW %> <% %> TRY
        `)
        .then((vars: any) => {
          const data = JSON.parse(vars ?? '[]')[0];
          this.variables = data?.vars ?? {};
          this.dataStack = [... (data?.stack ?? [])];
          resolve(data);
        }).catch(e => reject(e));
    });
  }

  private addBreakPoints(ws: string) {
    const bps = this.breakPoints.get(this._sourceFile);
    console.log(bps)
    const splittedWS = (ws ?? '').split('\n');
    (bps ?? [])
      .filter(b => b.verified)
      .forEach((b: any) => {
        const line = b.line;
        splittedWS[line] = 'BREAKPOINT ' + splittedWS[line];
      });
    splittedWS.push('BREAKPOINT ');
    return splittedWS.join('\n');
  }

  private sendtoWS(message: string) {
    console.log('Send to WebSocket ' + message);
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
    this.sendEvent('stopOnStep');
  }

  private updateCurrentLine(reverse: boolean): boolean {
    if (reverse) {
      if (this.currentLine > 0) {
        this.currentLine--;
      } else {
        // no more lines: stop at first line
        this.currentLine = 0;
        this.currentColumn = undefined;
        this.sendEvent('stopOnEntry');
        return true;
      }
    } else {
      if (this.currentLine < this.sourceLines.length - 1) {
        this.currentLine++;
      } else {
        // no more lines: run to end
        this.currentColumn = undefined;
        this.sendEvent('end');
        return true;
      }
    }
    return false;
  }

  /**
   * "Step into" for Mock debug means: go to next character
   */
  public stepIn(targetId: number | undefined) {
    if (typeof targetId === 'number') {
      this.currentColumn = targetId;
      this.sendEvent('stopOnStep');
    } else {
      if (typeof this.currentColumn === 'number') {
        if (this.currentColumn <= this.sourceLines[this.currentLine].length) {
          this.currentColumn += 1;
        }
      } else {
        this.currentColumn = 1;
      }
      this.sendEvent('stopOnStep');
    }
  }

  /**
   * "Step out" for Mock debug means: go to previous character
   */
  public stepOut() {
    if (typeof this.currentColumn === 'number') {
      this.currentColumn -= 1;
      if (this.currentColumn === 0) {
        this.currentColumn = undefined;
      }
    }
    this.sendEvent('stopOnStep');
  }

  public getStepInTargets(frameId: number): IRuntimeStepInTargets[] {

    const line = this.getLine();
    const words = this.getWords(this.currentLine, line);

    // return nothing if frameId is out of range
    if (frameId < 0 || frameId >= words.length) {
      return [];
    }

    const { name, index } = words[frameId];

    // make every character of the frame a potential "step in" target
    return name.split('').map((c, ix) => {
      return {
        id: index + ix,
        label: `target: ${c}`
      };
    });
  }

  /**
   * Returns a fake 'stacktrace' where every 'stackframe' is a word from the current line.
   */
  public stack(_startFrame: number, _endFrame: number): IRuntimeStack {
    const frames: IRuntimeStackFrame[] = [];
    // every word of the current line becomes a stack frame.
    for (let i = 0; i < this.dataStack.length; i++) {
      const stackFrame: IRuntimeStackFrame = {
        index: i,
        name: `${this.dataStack[i]}`,	// use a word of the line as the stackframe name
        file: this._sourceFile,
        line: this.currentLine,
        column: 0, // words[i].index
        instruction: this.dataStack[i]
      };
      frames.push(stackFrame);
    }

    console.log({ frames })
    return { frames: frames, count: frames.length };
  }

  /*
   * Determine possible column breakpoint positions for the given line.
   * Here we return the start location of words with more than 8 characters.
   */
  public getBreakpoints(_path: string, line: number): number[] {
    return this.getWords(line, this.getLine(line)).filter(w => w.name.length > 8).map(w => w.index);
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

  public setExceptionsFilters(_namedException: string | undefined, _otherExceptions: boolean): void {
 
    
  }

  public setInstructionBreakpoint(address: number): boolean {
    this.instructionBreakpoints.add(address);
    return true;
  }

  public clearInstructionBreakpoints(): void {
    this.instructionBreakpoints.clear();
  }

  public async getGlobalVariables(_cancellationToken?: () => boolean): Promise<RuntimeVariable[]> {
    return [new RuntimeVariable('endpoint', this.endpoint)];
  }

  private toRuntimeVariable(k: string, v: any): RuntimeVariable {
    console.log('toRuntimeVariable', k, typeof v);
    if (Array.isArray(v) || typeof v === 'object') {

      return new RuntimeVariable(k, JSON.stringify(v));
    }
    return new RuntimeVariable(k, v);

  }

  public getLocalVariables(): RuntimeVariable[] {
    return Object.keys(this.variables ?? {}).map(k => {
      return this.toRuntimeVariable(k, this.variables[k]);
    });
  }

  public getLocalVariable(name: string): RuntimeVariable | undefined {
    if (this.variables[name]) {
      let v = this.variables[name]
      /* if (typeof v === 'object') {
         v = JSON.stringify(this.variables[name]).slice(0, 50);
         if (v.length === 50) v = v + '...';
       }*/
      return this.toRuntimeVariable(name, v);
    } else {
      return undefined;
    }
  }

  /**
   * Return words of the given address range as "instructions"
   */
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

    this.instructions = [];

    this.starts = [];
    this.instructions = [];
    this.ends = [];

    for (let l = 0; l < this.sourceLines.length; l++) {
      this.starts.push(this.instructions.length);
      const words = this.getWords(l, this.sourceLines[l]);
      for (let word of words) {
        this.instructions.push(word);
      }
      this.ends.push(this.instructions.length);
    }
  }

  /**
   * return true on stop
   */
  private findNextStatement(reverse: boolean, stepEvent?: string): boolean {

    for (let ln = this.currentLine; reverse ? ln >= 0 : ln < this.sourceLines.length; reverse ? ln-- : ln++) {

      // is there a source breakpoint?
      const breakpoints = this.breakPoints.get(this._sourceFile);
      if (breakpoints) {
        const bps = breakpoints.filter(bp => bp.line === ln);
        if (bps.length > 0) {

          // send 'stopped' event
          this.sendEvent('stopOnBreakpoint');

          // the following shows the use of 'breakpoint' events to update properties of a breakpoint in the UI
          // if breakpoint is not yet verified, verify it now and send a 'breakpoint' update event
          if (!bps[0].verified) {
            bps[0].verified = true;
            this.sendEvent('breakpointValidated', bps[0]);
          }

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

  /**
   * "execute a line" of the readme markdown.
   * Returns true if execution sent out a stopped event and needs to stop.
   */
  private executeLine(_ln: number, _reverse: boolean): boolean {

    return false;
    /*

    // first "execute" the instructions associated with this line and potentially hit instruction breakpoints
    while (reverse ? this.instruction >= this.starts[ln] : this.instruction < this.ends[ln]) {
      reverse ? this.instruction-- : this.instruction++;
      if (this.instructionBreakpoints.has(this.instruction)) {
        this.sendEvent('stopOnInstructionBreakpoint');
        return true;
      }
    }

    const line = this.getLine(ln);

    // find variable accesses
    let reg0 = /\$([a-z][a-z0-9]*)(=(false|true|[0-9]+(\.[0-9]+)?|\".*\"|\{.*\}))?/ig;
    let matches0: RegExpExecArray | null;
    while (matches0 = reg0.exec(line)) {
      if (matches0.length === 5) {
        let access: string | undefined;
        const name = matches0[1];
        const value = matches0[3];
        console.log('executeLine', { name, value })
        let v = new RuntimeVariable(name, this.variables[name]);

        if (value && value.length > 0) {

          if (value === 'true') {
            v.value = true;
          } else if (value === 'false') {
            v.value = false;
          } else if (value[0] === '"') {
            v.value = value.slice(1, -1);
          } else if (value[0] === '{') {
            v.value = [
              new RuntimeVariable('fBool', true),
              new RuntimeVariable('fInteger', 123),
              new RuntimeVariable('fString', 'hello'),
              new RuntimeVariable('flazyInteger', 321)
            ];
          } else {
            v.value = parseFloat(value);
          }

          if (this.variables[name]) {
            // the first write access to a variable is the "declaration" and not a "write access"
            access = 'read';
          }
          // this.variables[name], v;
        } else {
          if (this.variables[name]) {
            // variable must exist in order to trigger a read access
            access = 'read';
          }
        }

        const accessType = this.breakAddresses.get(name);
        if (access && accessType && accessType.indexOf(access) >= 0) {
          this.sendEvent('stopOnDataBreakpoint', access);
          return true;
        }
      }
    }
    // nothing interesting found -> continue
    return false;

    */
  }

  private async verifyBreakpoints(path: string): Promise<void> {
    const bps = this.breakPoints.get(path);
    if (bps) {
      await this.loadSource(path);
      bps.forEach(bp => {
        if (!bp.verified && bp.line < this.sourceLines.length) {
          const srcLine = this.getLine(bp.line);

          // TODO: gestion des commentaires et des multilignes

          // if a line is empty or starts with '/*' we don't allow to set a breakpoint but move the breakpoint down
          if (srcLine.length === 0 || srcLine.indexOf('/*') === 0) {
            bp.line++;
          }
          // if a line starts with '#' we don't allow to set a breakpoint but move the breakpoint up
          if (srcLine.indexOf('#') === 0) {
            bp.line--;
          }
          bp.verified = true;
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
