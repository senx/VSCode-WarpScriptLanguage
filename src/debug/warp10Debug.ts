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

import {
  Breakpoint,
  BreakpointEvent,
  Handles,
  InitializedEvent,
  InvalidatedEvent,
  Logger,
  LoggingDebugSession,
  MemoryEvent,
  OutputEvent,
  Scope, Source,
  StackFrame,
  StoppedEvent,
  TerminatedEvent,
  Thread,
  logger,
} from "@vscode/debugadapter";
import { DebugProtocol } from "@vscode/debugprotocol";
import { basename } from "path-browserify";
// @ts-ignore
import { Subject } from "await-notify";
import * as base64 from "base64-js";
import { DiagnosticCollection, ExtensionContext, Range, TextDocument, TextEditorDecorationType, Uri, ViewColumn, commands, languages, window, workspace } from "vscode";
import { DiagnosticSeverity } from "vscode-languageclient";
import WarpScriptExtConstants from "../constants";
import { SharedMem } from "../extension";
import ExecCommand from "../features/execCommand";
import { Requester } from "../features/requester";
import { specialCommentCommands } from "../warpScriptParser";
import { TracePluginInfo } from "../webviews/tracePluginInfo";
import { FileAccessor, IRuntimeBreakpoint, IRuntimeVariableType, RuntimeVariable, Warp10DebugRuntime, } from "./warp10DebugRuntime";
import { Mutex, withTimeout } from "async-mutex";

/**
 * This interface describes the mock-debug specific launch attributes
 * (which are not part of the Debug Adapter Protocol).
 * The schema for these attributes lives in the package.json of the mock-debug extension.
 * The interface should always match this schema.
 */
interface ILaunchRequestArguments extends DebugProtocol.LaunchRequestArguments {
  /** An absolute path to the "program" to debug. */
  program: string;
  /** Automatically stop target after launch. If not specified, target does not stop. */
  stopOnEntry?: boolean;
  /** enable logging the Debug Adapter Protocol */
  trace?: boolean;
  /** run without debugging */
  noDebug?: boolean;
  /** if specified, results in a simulated compile error in launch. */
  compileError?: "default" | "show" | "hide";
}

interface IAttachRequestArguments extends ILaunchRequestArguments { }

export class Warp10DebugSession extends LoggingDebugSession {
  private _runtime: Warp10DebugRuntime;
  private _variableHandles = new Handles<"locals" | "globals" | RuntimeVariable>();
  private _configurationDone = new Subject();
  private _cancellationTokens = new Map<number, boolean>();
  private _valuesInHex = false;
  private _useInvalidatedEvent = false;
  //private executedWarpScript: string | undefined;
  private inlineDecoration: TextEditorDecorationType | undefined;
  private context: ExtensionContext;
  static threadID: number = 1;
  private diagnosticCollection: DiagnosticCollection;
  //private program: string;
  private currentProgramUri: string;
  private wswlmReadyMutex = withTimeout(new Mutex(), 10000);
  private wswlmReady = false;

  /**
   * Creates a new debug adapter that is used for one debug session.
   * We configure the default implementation of a debug adapter here.
   */
  public constructor(fileAccessor: FileAccessor, context: ExtensionContext) {
    super("warpscript-debug.txt");
    this.context = context;

    // this debugger uses zero-based lines and columns
    this.setDebuggerLinesStartAt1(false);
    this.setDebuggerColumnsStartAt1(false);

    this._runtime = new Warp10DebugRuntime(fileAccessor);

    // setup event handlers
    this._runtime.on('openTracePluginInfo', (mess: string, action: string) => {
      this.sendEvent(new TerminatedEvent());
      if ('openSettings' === action) {
        window.showWarningMessage(mess, ...['Open Settings', 'Cancel']).then(resp => {
          if ('Open Settings' === resp) {
            commands.executeCommand('workbench.action.openSettings', 'Warpscript: Trace Tokens Per Warp10 URL');
          }
        })
      } else {
        window.showWarningMessage(mess);
      }
      TracePluginInfo.render(this.context);
    })
    this._runtime.on("stopOnEntry", () => this.sendEvent(new StoppedEvent("entry", Warp10DebugSession.threadID)));
    this._runtime.on("stopOnStep", () => this.sendEvent(new StoppedEvent("step", Warp10DebugSession.threadID)));
    this._runtime.on("stopOnBreakpoint", () => this.sendEvent(new StoppedEvent("breakpoint", Warp10DebugSession.threadID)));
    this._runtime.on("stopOnDataBreakpoint", () => this.sendEvent(new StoppedEvent("data breakpoint", Warp10DebugSession.threadID)));
    this._runtime.on("stopOnInstructionBreakpoint", () => this.sendEvent(new StoppedEvent("instruction breakpoint", Warp10DebugSession.threadID)));
    // this._runtime.on("stopOnException", exception => {
    //   if (exception) {
    //     if (this._runtime.isDebug() && window.activeTextEditor) {
    //       if (this.inlineDecoration) {
    //         this.inlineDecoration.dispose();
    //       }
    //       this.inlineDecoration = window.createTextEditorDecorationType({ before: { color: "red", contentText: "⯆" } });
    //       window.activeTextEditor.setDecorations(this.inlineDecoration, [
    //         new Range(
    //           Math.max(exception.info.line - 1, 0),
    //           Math.max(exception.info.colStart - 1, 0),
    //           Math.max(exception.info.line - 1, 0),
    //           Math.max(exception.info.colStart - 1, 0)
    //         )
    //       ]);
    //       if (window.activeTextEditor) {
    //         if (this.diagnosticCollection) this.diagnosticCollection.clear();
    //         this.diagnosticCollection = languages.createDiagnosticCollection('WarpScript-debug');
    //         this.diagnosticCollection.set(window.activeTextEditor.document.uri, [{
    //           code: '',
    //           message: exception.e,
    //           range: new Range(
    //             Math.max(exception.info.line - 1, 0),
    //             Math.max(exception.info.colStart - 1, 0),
    //             Math.max(exception.info.line - 1, 0),
    //             Math.max(exception.info.colEnd, 0)
    //           ),
    //           severity: DiagnosticSeverity.Error,
    //           source: window.activeTextEditor.document.uri.toString(),
    //           relatedInformation: []
    //         }]);
    //       }
    //     }
    //     this.sendEvent(new StoppedEvent(`exception(${exception.e})`, Warp10DebugSession.threadID));
    //   } else {
    //     this.sendEvent(new StoppedEvent("exception", Warp10DebugSession.threadID));
    //   }
    // });
    this._runtime.on('highlightEvent', info => {
      //try: console.warn("sending a breakpoint event, just to see, in highlight...", Uri.parse(info.path).fsPath)
      //this.sendEvent(new BreakpointEvent("breakpoint",new Breakpoint(true,1,8,new Source("macro2.mc2",Uri.parse(info.path).fsPath)  )));
      // => no effect on current window. window change on breakpoints or step should be managed manually.
      workspace.openTextDocument(Uri.parse(info.path))
        .then((doc: TextDocument) => {
          window.showTextDocument(doc).then(editor => {
            console.log("yeepee, show decoration in the right file", info)
            if (this.inlineDecoration) {
              this.inlineDecoration.dispose();
            }
            if (this._runtime.isDebug() && editor) {
              this.inlineDecoration = window.createTextEditorDecorationType({ before: { color: "red", contentText: "⯆" } });
              editor.setDecorations(this.inlineDecoration, [
                new Range(
                  Math.max(info.line, 0), // vscode ranges also start at line 0
                  Math.max(info.colStart - 1, 0),
                  Math.max(info.line, 0),
                  Math.max(info.colStart - 1, 0)
                )
              ]);
            }
            if (info.showDiagnostic) {
              if (this.diagnosticCollection) this.diagnosticCollection.clear();
              this.diagnosticCollection = languages.createDiagnosticCollection('WarpScript-debug');
              this.diagnosticCollection.set(window.activeTextEditor.document.uri, [{
                code: '',
                message: info.diagMsg,
                range: new Range(
                  info.diagLine,
                  info.diagColStart - 1,
                  info.diagLine,
                  info.diagColEnd
                ),
                severity: DiagnosticSeverity.Error,
                source: window.activeTextEditor.document.uri.toString(),
                relatedInformation: []
              }]);
              this.sendEvent(new StoppedEvent(`exception(${info.diagMsg})`, Warp10DebugSession.threadID)); // controls the continue/step/pause buttons.
            }
          })
        })
    })
    this._runtime.on("breakpointValidated", (bp: IRuntimeBreakpoint) => this.sendEvent(new BreakpointEvent("changed", { verified: bp.verified, id: bp.id, } as DebugProtocol.Breakpoint)));
    this._runtime.on("output", (type, text, filePath, line, column, popin) => this.log({ text, filePath, line, column, type, popin }));
    this._runtime.on("end", () => {
      if (this.inlineDecoration) {
        this.inlineDecoration.dispose();
      }
      if (this.diagnosticCollection) this.diagnosticCollection.clear();
      this.sendEvent(new TerminatedEvent());
    });
    this._runtime.on("debugResult", (r: any) => this.handleResult(r).then(() => this.sendEvent(new TerminatedEvent())));
  }

  private log(l: any) {
    let category: string;
    switch (l.type) {
      case "prio":
        category = "important";
        break;
      case "out":
        category = "stdout";
        break;
      case "err":
        category = "stderr";
        break;
      default:
        category = "console";
        break;
    }
    if (typeof l.text === "object") {
      l.text = JSON.stringify(l.text);
    }
    const e: DebugProtocol.OutputEvent = new OutputEvent(`${l.text}\n`, category);
    if (l.text === "start" || l.text === "startCollapsed" || l.text === "end") {
      e.body.group = l.text;
      e.body.output = `group-${l.text}\n`;
    }
    if (l.filePath) e.body.source = this.createSource(l.filePath);
    if (l.line !== undefined)
      e.body.line = this.convertDebuggerLineToClient(l.line);
    if (l.column !== undefined)
      e.body.column = this.convertDebuggerColumnToClient(l.column);
    if (l.type === "err" && !!l.popin) {
      window.showErrorMessage(l.text, ...["Cancel"]);
      if (/Unknown function 'STMTPOS'/.test(l.text)) {
        this.sendEvent(new TerminatedEvent());
        window.showWarningMessage("The Warp 10 Trace Plugin is not activated")
        TracePluginInfo.render(this.context);
      }
    } else if (l.type === "err") {
      window.showErrorMessage(l.text);
    }
    this.sendEvent(e);
  }

  /**
   * The 'initialize' request is the first request called by the frontend
   * to interrogate the features the debug adapter provides.
   */
  protected initializeRequest(response: DebugProtocol.InitializeResponse, args: DebugProtocol.InitializeRequestArguments): void {
    console.warn ("gro, args",args)
    if (args.supportsInvalidatedEvent) {
      this._useInvalidatedEvent = true;
    }
    // build and return the capabilities of this debug adapter:
    response.body = response.body || {};
    // the adapter implements the configurationDone request.
    response.body.supportsConfigurationDoneRequest = true;
    // make VS Code use 'evaluate' when hovering over source
    response.body.supportsEvaluateForHovers = true;
    // make VS Code show a 'step back' button
    response.body.supportsStepBack = false;
    // make VS Code support data breakpoints
    response.body.supportsDataBreakpoints = false;
    // make VS Code support completion in REPL
    response.body.supportsCompletionsRequest = false;
    response.body.completionTriggerCharacters = [".", "["];
    // make VS Code send cancel request
    response.body.supportsCancelRequest = true;
    // make VS Code send the breakpointLocations request
    response.body.supportsBreakpointLocationsRequest = true;
    // make VS Code provide "Step in Target" functionality
    response.body.supportsStepInTargetsRequest = false;
    response.body.supportsExceptionFilterOptions = false;
    response.body.exceptionBreakpointFilters = [];
    // make VS Code send exceptionInfo request
    response.body.supportsExceptionInfoRequest = false;
    // make VS Code send setVariable request
    response.body.supportsSetVariable = false;
    // make VS Code send setExpression request
    response.body.supportsSetExpression = false;
    // make VS Code send disassemble request
    response.body.supportsDisassembleRequest = false;
    response.body.supportsSteppingGranularity = false;
    response.body.supportsInstructionBreakpoints = false;
    // make VS Code able to read and write variable memory
    response.body.supportsReadMemoryRequest = false;
    response.body.supportsWriteMemoryRequest = false;
    response.body.supportSuspendDebuggee = true;
    response.body.supportTerminateDebuggee = true;
    response.body.supportsFunctionBreakpoints = false;
    response.body.supportsDelayedStackTraceLoading = false;

    this.sendResponse(response);
    // since this debug adapter can accept configuration requests like 'setBreakpoint' at any time,
    // we request them early by sending an 'initializeRequest' to the frontend.
    // The frontend will end the configuration sequence by calling 'configurationDone' request.
    this.sendEvent(new InitializedEvent());
  }

  /**
   * Called at the end of the configuration sequence.
   * After launchrequest, indicates that all breakpoints etc. have been sent to the DA and that the 'launch' can start.
   */
  protected configurationDoneRequest(response: DebugProtocol.ConfigurationDoneResponse, args: DebugProtocol.ConfigurationDoneArguments): void {
    super.configurationDoneRequest(response, args);
    this._configurationDone.notify();
  }

  private async writeFile(path: string, content: any): Promise<void> {
    if (WarpScriptExtConstants.isVirtualWorkspace) {
      return await workspace.fs.writeFile(Uri.file(path).with({ scheme: workspace.workspaceFolders![0]!.uri.scheme, }), Buffer.from(content, "utf8"));
    } else {
      return await workspace.fs.writeFile(Uri.file(path), Buffer.from(content, "utf8"));
    }
  }

  private async deleteFile(path: string): Promise<void> {
    if (WarpScriptExtConstants.isVirtualWorkspace) {
      return await workspace.fs.delete(Uri.file(path).with({ scheme: workspace.workspaceFolders![0]!.uri.scheme, }));
    } else {
      return await workspace.fs.delete(Uri.file(path));
    }
  }

  private async handleResult(result: string) {
    if (this.inlineDecoration) {
      this.inlineDecoration.dispose();
    }
    // Generate unique filenames, ordered by execution order.
    const uuid = ExecCommand.pad(ExecCommand.execNumber++, 3, "0");
    const wsFilename = `${await WarpScriptExtConstants.findTempFolder()}/${uuid}.mc2`;
    const PreviewTimeUnit: string = workspace
      .getConfiguration()
      .get("warpscript.DefaultTimeUnit") as string;
    const jsonMaxSizeForAutoUnescape: number = workspace
      .getConfiguration()
      .get("warpscript.maxFileSizeForAutomaticUnicodeEscape") as number;
    //
    // keep a simple suffix for the json filename (either n for nanosecond or m for millisecond. nothing for default.)
    let jsonSuffix: string = PreviewTimeUnit.slice(0, 1);
    const commentsCommands: specialCommentCommands = this._runtime.wswlm.commentsCommands;
    // add X after the suffix for no preview at all, add I for focus on images, add G for gts preview.
    let displayPreviewOpt = "";
    displayPreviewOpt = commentsCommands.displayPreviewOpt || displayPreviewOpt;
    commentsCommands.displayPreviewOpt = "";
    jsonSuffix = jsonSuffix + displayPreviewOpt;
    let jsonFilename = `${await WarpScriptExtConstants.findTempFolder()}/${uuid}${jsonSuffix}.json`;
    SharedMem.set(uuid, commentsCommands);

    // Save executed warpscript
    try {
      await this.deleteFile(wsFilename); // Remove overwritten file. If file unexistent, fail silently.
    } catch (e) { }
    try {
      await this.writeFile(wsFilename, this._runtime.wswlm.originalWarpScriptContent);  // it may also be the full warpscript + inclusion... but debug token will leak there.
    } catch (e) {
      this.log({ text: e, filePath: wsFilename, type: "err" });
    }
    // Save resulting JSON
    try {
      await this.deleteFile(jsonFilename); // Remove overwritten file. If file unexistent, fail silently.
    } catch (e) {
      this.log({ text: e, filePath: jsonFilename, type: "err" });
    }

    // if file is small enough (1M), unescape the utf16 encoding that is returned by Warp 10
    let sizeMB: number = Math.round(result.length / 1024 / 1024);
    if (jsonMaxSizeForAutoUnescape > 0 && sizeMB < jsonMaxSizeForAutoUnescape) {
      // Do not unescape \\u nor control characters.
      result = decodeURIComponent(result.replace(/(?<!\\)\\u(?!000)(?!001)([0-9A-Fa-f]{4})/g, "%u$1"));
    }
    // file must be saved whatever its size... but not displayed if too big.
    this.writeFile(jsonFilename, result).then(
      () => this.displayJson(jsonFilename),
      e => {
        if (e) {
          this.log({ text: e, filePath: jsonFilename, type: "err" });
        }
      }
    );
  }

  protected disconnectRequest(_response: DebugProtocol.DisconnectResponse, _args: DebugProtocol.DisconnectArguments, _request?: DebugProtocol.Request): void {
    if (!_args.restart && !_args.terminateDebuggee) {
      this.log({ text: "Debugger disconnected by VSCode (end of script, or idle timeout, or overload)", type: "out" })
    }
    // args = {"restart":false,"terminateDebuggee":false} after à 5 minute idle state in vscode, for example paused on a breakpoint.
    this._runtime.close();
  }

  private displayJson(jsonFilename: string) {
    let jsonUri: Uri;
    if (WarpScriptExtConstants.isVirtualWorkspace) {
      jsonUri = Uri.file(jsonFilename).with({ scheme: workspace.workspaceFolders![0]!.uri.scheme, });
    } else {
      jsonUri = Uri.file(jsonFilename);
    }
    workspace.openTextDocument(jsonUri).then((doc: TextDocument) => {
      window.showTextDocument(doc, { viewColumn: ViewColumn.Two, preview: true, preserveFocus: false, })
        .then(
          () => {
            //
          },
          (err: any) => {
            this.log({ text: err, filePath: jsonFilename, type: "err" });
            window.showErrorMessage(err.message);
          }
        );
    });
  }

  protected async attachRequest(response: DebugProtocol.AttachResponse, args: IAttachRequestArguments) {
    // not used with classic F5 start debug
    return this.launchRequest(response, args);
  }

  protected async launchRequest(response: DebugProtocol.LaunchResponse, args: ILaunchRequestArguments) {
    // called with very few context...
    // args = {type: 'warpscript', name: 'Launch', request: 'launch', program: '/home/pierre/warpscriptspp/recursive macro test/tests/inclusion test.mc2', stopOnEntry: true, …}
    this.wswlmReady = false;
    // as macro inclusion needs to be done before adding any breakpoints, take mutex first.
    await this.wswlmReadyMutex.runExclusive(async () => {
      this.currentProgramUri = this._runtime.normalizePathAndCasing(args.program);
      const ws = await this._runtime.getContent(args.program);
      await this._runtime.loadWarpScript(ws, this.currentProgramUri);
      this._runtime.wswlm.printFullWs();
      this.wswlmReady = true;
    });


    // make sure to 'Stop' the buffered logging if 'trace' is not set
    logger.setup(args.trace ? Logger.LogLevel.Verbose : Logger.LogLevel.Stop, false);
    // wait 1 second until configuration has finished (and configurationDoneRequest has been called)
    await this._configurationDone.wait(5000);
    // console.warn("ready to start")
    // this._runtime.wswlm.printFullWs();
    if (!!args.noDebug) {
      console.log('executeCommand', { args });
      commands.executeCommand('extension.execWS').then(() => {
        if (this.inlineDecoration) {
          this.inlineDecoration.dispose();
        }
        this.sendEvent(new TerminatedEvent());
        this.sendResponse(response);
      });
    } else {
      //const ws = await this._runtime.getContent(args.program);
      //this._runtime.printAllBreakpoints();
      const commentsCommands = this._runtime.wswlm.commentsCommands;
      const endpoint = commentsCommands.endpoint ?? workspace.getConfiguration().get("warpscript.Warp10URL");
      Requester.getInstanceInfo(endpoint ?? '').then(async info => {
        // check if trace plugin is active
        const checkWS = JSON.parse(info);
        const hasTrace = (checkWS[0]?.extensions ?? {}).trace;
        if (this.inlineDecoration) {
          this.inlineDecoration.dispose();
        }
        if (!hasTrace || !(checkWS[0]?.extensions ?? {}).traceWSEndpoint) {
          this.sendEvent(new TerminatedEvent());
          window.showWarningMessage("The Warp 10 Trace Plugin is not activated");
          TracePluginInfo.render(this.context);
        } else {
          // start the program in the runtime
          this._runtime.start(checkWS[0])
            .then((_r) => {
              if (this.inlineDecoration) {
                this.inlineDecoration.dispose();
              }
              this.sendResponse(response);
            });
        }
      })
        .catch((e) => {
          window.showErrorMessage(e.message ?? e, ...["Cancel"]);
          this.sendEvent(new TerminatedEvent());
        });
    }
  }

  // should never be called by frontend, marked unsupported
  protected setFunctionBreakPointsRequest(response: DebugProtocol.SetFunctionBreakpointsResponse, _args: DebugProtocol.SetFunctionBreakpointsArguments, _request?: DebugProtocol.Request): void {
    this.sendResponse(response);
  }

  // right avec launchrequest, the frontend send all the breakpoints defined in all files, in lexicographic order (or no order ?)
  // backend will say if these are valid breakpoints. When invalid, frontend gray them out.
  // to know that they are valid, we must know what macros will be included... so we must wait the list of included macro to be ready.
  protected async setBreakPointsRequest(response: DebugProtocol.SetBreakpointsResponse, args: DebugProtocol.SetBreakpointsArguments): Promise<void> {
    const path = args.source.path as string;

    // wait for ws with local macro to be ready... and make sure setBreakPointsRequest are processed one by one.
    await this.wswlmReadyMutex.runExclusive(async () => {
      console.warn(path, response, args);

      if (!this.wswlmReady) { // it should be true ! otherwise, it means frontend called setBreakPointsRequest before launchRequest, or that mutex 10s limit reached
        console.error("frontend called setBreakPointsRequest before launchRequest, or more than 10s to process warpscript local macro inclusion ?!!")
        let r: DebugProtocol.ErrorResponse = {
          body: {
            error: undefined
          },
          request_seq: 0,
          success: false,
          command: "",
          seq: 0,
          type: ""
        }
        this.sendErrorResponse(r, 507);
      } else {
        console.log(`processing breakpoints for ${path}`)
        // clear all breakpoints for this file
        //this._runtime.clearBreakpoints(path);
        const clientLines = args.lines || [];
        const breakpoints = clientLines.map(l => {
          let valid = this._runtime.setLineBreakPoint(path, l - 1); // vscode starts counting line at 1
          return new Breakpoint(valid, l) as DebugProtocol.Breakpoint
        })
        response.body = { breakpoints: breakpoints };
        this.sendResponse(response);
      }
    });



    // if (!this._runtime.wswlm.isThisFileIncluded(this._runtime.normalizePathAndCasing(path))) { // à faire dans runtime en fait.
    //   response.body = { breakpoints: [] };
    //   this.sendResponse(response);
    //   console.error(`file ${path} NOT included by macro inclusion`) // c'est pété comme manière de faire, il faut lui renvoyer son tableau avec "invalid"
    // } else {


    //   // set and verify breakpoint locations
    //   const actualBreakpoints0 = clientLines.map(async (l) => {
    //     const { verified, line, id } = await this._runtime.setBreakPoint(path, this.convertClientLineToDebugger(l));
    //     const bp = new Breakpoint(verified, this.convertDebuggerLineToClient(line)) as DebugProtocol.Breakpoint;
    //     bp.id = id;
    //     return bp;
    //   });
    //   const actualBreakpoints = await Promise.all<DebugProtocol.Breakpoint>(actualBreakpoints0);
    //   // send back the actual breakpoint positions
    //   response.body = { breakpoints: actualBreakpoints };
    //   this.sendResponse(response);
    // }
  }

  protected async breakpointLocationsRequest(response: DebugProtocol.BreakpointLocationsResponse, args: DebugProtocol.BreakpointLocationsArguments, _request?: DebugProtocol.Request): Promise<void> {
    let breakpoints: DebugProtocol.BreakpointLocation[] = [];
    if (args.source.path) {
      const info = await this._runtime.getBreakpoints(args.source.path, this.convertClientLineToDebugger(args.line));
      breakpoints = info.bps.map(() => ({ line: args.line }));
    }
    response.body = { breakpoints };
    this.sendResponse(response);
  }


  protected async setExceptionBreakPointsRequest(response: DebugProtocol.SetExceptionBreakpointsResponse, _args: DebugProtocol.SetExceptionBreakpointsArguments): Promise<void> {
    this.sendResponse(response);
  }

  protected exceptionInfoRequest(response: DebugProtocol.ExceptionInfoResponse, _args: DebugProtocol.ExceptionInfoArguments) {
    response.body = {
      exceptionId: "Exception ID",
      description: "This is a descriptive description of the exception.",
      breakMode: "always",
      details: {
        message: "Message contained in the exception.",
        typeName: "Short type name of the exception object",
        stackTrace: "stack frame 1\nstack frame 2",
      },
    };
    this.sendResponse(response);
  }

  protected threadsRequest(response: DebugProtocol.ThreadsResponse): void {
    // runtime supports no threads so just return a default thread.
    response.body = { threads: [new Thread(Warp10DebugSession.threadID, "Warp 10")], };
    this.sendResponse(response);
  }

  protected stackTraceRequest(response: DebugProtocol.StackTraceResponse, args: DebugProtocol.StackTraceArguments): void {
    const startFrame = typeof args.startFrame === "number" ? args.startFrame : 0;
    const maxLevels = typeof args.levels === "number" ? args.levels : 1000;
    const endFrame = startFrame + maxLevels;
    const stk = this._runtime.stack(startFrame, endFrame);
    response.body = {
      stackFrames: stk.frames.map((f, ix) => new StackFrame(ix, f.name, this.createSource(f.file), this.convertDebuggerLineToClient(f.line))), // TODO: problem in createSource Path must be a string
      // 4 options for 'totalFrames':
      // omit totalFrames property: 	// VS Code has to probe/guess. Should result in a max. of two requests
      totalFrames: stk.frames.length, // stk.count is the correct size, should result in a max. of two requests
      // totalFrames: 1000000 			// not the correct size, should result in a max. of two requests
      // totalFrames: endFrame + 20 	// dynamically increases the size with every requested chunk, results in paging
    };
    this.sendResponse(response);
  }

  protected scopesRequest(response: DebugProtocol.ScopesResponse, _args: DebugProtocol.ScopesArguments): void {
    response.body = {
      scopes: [
        new Scope("Environment", this._variableHandles.create("globals"), false),
        new Scope("Variables", this._variableHandles.create("locals"), false),
        new Scope("Stack", this._variableHandles.create(new RuntimeVariable("stack", [])), false),
      ],
    };
    this.sendResponse(response);
  }

  protected async writeMemoryRequest(response: DebugProtocol.WriteMemoryResponse, { data, memoryReference, offset = 0 }: DebugProtocol.WriteMemoryArguments) {
    const variable = this._variableHandles.get(Number(memoryReference));
    if (typeof variable === "object") {
      variable.setMemory(data, offset);
      response.body = { bytesWritten: data.length };
    } else {
      response.body = { bytesWritten: 0 };
    }
    this.sendResponse(response);
    this.sendEvent(new InvalidatedEvent(["variables"]));
  }

  protected async readMemoryRequest(response: DebugProtocol.ReadMemoryResponse, { offset = 0, count, memoryReference }: DebugProtocol.ReadMemoryArguments) {
    const variable = this._variableHandles.get(Number(memoryReference));
    if (typeof variable === "object" && variable.memory) {
      const memory = variable.memory.subarray(
        Math.min(offset, variable.memory.length),
        Math.min(offset + count, variable.memory.length)
      );
      response.body = {
        address: offset.toString(),
        data: base64.fromByteArray(memory),
        unreadableBytes: count - memory.length,
      };
    } else {
      response.body = {
        address: offset.toString(),
        data: "",
        unreadableBytes: count,
      };
    }
    this.sendResponse(response);
  }

  protected async variablesRequest(response: DebugProtocol.VariablesResponse, args: DebugProtocol.VariablesArguments, request?: DebugProtocol.Request): Promise<void> {
    let vs: RuntimeVariable[] = [];
    const v = this._variableHandles.get(args.variablesReference);
    if (v === "locals") {
      vs = this._runtime.getLocalVariables();
      response.body = {
        variables: vs.map((v) => {
          let dapVariable: DebugProtocol.Variable = {
            name: `${v.name}`,
            value: v.value,
            type: v.value,
            variablesReference: 0,
            evaluateName: v.name,
            presentationHint: { lazy: true },
          };
          v.reference ??= this._variableHandles.create(new RuntimeVariable("stackVariable", v.name));
          dapVariable.variablesReference = v.reference;
          return dapVariable;
        }),
      };
    } else if (v === "globals") {
      if (request) {
        this._cancellationTokens.set(request.seq, false);
        vs = await this._runtime.getGlobalVariables(() => !!this._cancellationTokens.get(request.seq));
        this._cancellationTokens.delete(request.seq);
      } else {
        vs = await this._runtime.getGlobalVariables();
      }
      response.body = {
        variables: vs.map((v) => {
          let dapVariable: DebugProtocol.Variable = {
            name: `${v.name}`,
            value: typeof v.value === "string" ? v.value : JSON.stringify(v.value),
            type: typeof v.value,
            variablesReference: 0,
            evaluateName: v.name,
          };
          return dapVariable;
        }),
      };
    } else if ("stackVariable" === v.name) {
      const realValue = await this._runtime.getVarValue(v.value);
      response.body = { variables: [this.convertFromRuntime(realValue, v.value)] };
    } else if ("stackStack" === v.name) {
      const realValue = await this._runtime.getStackValue(v.value);
      response.body = { variables: [this.convertFromRuntime(realValue, v.value)] };
    } else if ("stack" === v.name) {
      vs = this._runtime.getStack();
      response.body = {
        variables: vs.map((v) => {
          let dapVariable: DebugProtocol.Variable = {
            name: `${v.name}`,
            value: v.value,
            type: v.value,
            variablesReference: 0,
            evaluateName: v.name,
            presentationHint: { lazy: true },
          };
          v.reference ??= this._variableHandles.create(new RuntimeVariable("stackStack", v.name));
          dapVariable.variablesReference = v.reference;
          return dapVariable;
        }),
      };
    } else {
      response.body = { variables: v.value };
    }

    this.sendResponse(response);
  }

  protected setVariableRequest(response: DebugProtocol.SetVariableResponse, args: DebugProtocol.SetVariableArguments): void {
    const container = this._variableHandles.get(args.variablesReference);
    const rv = container === "locals"
      ? this._runtime.getLocalVariable(args.name)
      : container instanceof RuntimeVariable &&
        container.value instanceof Array
        ? container.value.find((v) => v.name === args.name)
        : undefined;

    if (rv) {
      rv.value = this.convertToRuntime(args.value);
      response.body = this.convertFromRuntime(rv, "");

      if (rv.memory && rv.reference) {
        this.sendEvent(new MemoryEvent(String(rv.reference), 0, rv.memory.length));
      }
    }

    this.sendResponse(response);
  }

  protected continueRequest(response: DebugProtocol.ContinueResponse, _args: DebugProtocol.ContinueArguments): void {
    this._runtime.continue();
    this.sendResponse(response);
  }

  protected reverseContinueRequest(response: DebugProtocol.ReverseContinueResponse, _args: DebugProtocol.ReverseContinueArguments): void {
    // this._runtime.continue();
    this.sendResponse(response);
  }

  protected nextRequest(response: DebugProtocol.NextResponse, args: DebugProtocol.NextArguments): void {
    this._runtime.step(args.granularity !== "instruction", false);
    this.sendResponse(response);
  }

  protected stepBackRequest(response: DebugProtocol.StepBackResponse, args: DebugProtocol.StepBackArguments): void {
    this._runtime.step(args.granularity === "instruction", true);
    this.sendResponse(response);
  }

  protected stepInTargetsRequest(response: DebugProtocol.StepInTargetsResponse, args: DebugProtocol.StepInTargetsArguments) {
    const targets = this._runtime.getStepInTargets(args.frameId);
    response.body = {
      targets: targets.map((t) => {
        return { id: t.id, label: t.label };
      }),
    };
    this.sendResponse(response);
  }

  protected stepInRequest(response: DebugProtocol.StepInResponse, _args: DebugProtocol.StepInArguments): void {
    this._runtime.stepIn();
    this.sendResponse(response);
  }

  protected stepOutRequest(response: DebugProtocol.StepOutResponse, _args: DebugProtocol.StepOutArguments): void {
    this._runtime.stepOut();
    this.sendResponse(response);
  }

  protected async evaluateRequest(response: DebugProtocol.EvaluateResponse, args: DebugProtocol.EvaluateArguments): Promise<void> {
    let reply: string | undefined;
    let rv: RuntimeVariable = undefined;

    switch (args.context) {
      case "repl":  // right click, evaluate in debug console, or type directly into the console
        await this._runtime.evaluateInDebugConsole(args.expression).then(res => {
          reply = res;
        }).catch(e => { reply = `Execution error, ${e.message}` });
        this.sendEvent(new StoppedEvent("step", Warp10DebugSession.threadID)); // this refresh the pane with variables, stack view.
        break;
      case "hover": // hovering on a variable $xx : display the content.
        if (args.expression.startsWith("$")) {
          rv = this._runtime.getLocalVariable(args.expression.substr(1));
        }
        break;
    }

    if (rv) {
      const v = this.convertFromRuntime(rv, "");
      response.body = {
        result: v.value,
        type: v.type,
        variablesReference: v.variablesReference,
        presentationHint: v.presentationHint,
      };
    } else {
      if (reply && reply.length > 10000) {
        reply = reply.slice(1, 10000) + "(...truncated)"
      }
      response.body = { result: reply ? reply : `cannot evaluate: '${args.expression}'`, variablesReference: 0 }; // display first 10 000 characters only
    }

    this.sendResponse(response);
  }

  protected setExpressionRequest(response: DebugProtocol.SetExpressionResponse, args: DebugProtocol.SetExpressionArguments): void {
    if (args.expression.startsWith("$")) {
      const rv = this._runtime.getLocalVariable(args.expression.substr(1));
      if (rv) {
        rv.value = this.convertToRuntime(args.value);
        response.body = this.convertFromRuntime(rv, "");
        this.sendResponse(response);
      } else {
        this.sendErrorResponse(response, {
          id: 1002,
          format: `variable '{lexpr}' not found`,
          variables: { lexpr: args.expression },
          showUser: true,
        });
      }
    } else {
      this.sendErrorResponse(response, {
        id: 1003,
        format: `'{lexpr}' not an assignable expression`,
        variables: { lexpr: args.expression },
        showUser: true,
      });
    }
  }

 
  protected dataBreakpointInfoRequest(response: DebugProtocol.DataBreakpointInfoResponse, args: DebugProtocol.DataBreakpointInfoArguments): void {
    response.body = {
      dataId: null,
      description: "cannot break on data access",
      accessTypes: undefined,
      canPersist: false,
    };

    if (args.variablesReference && args.name) {
      const v = this._variableHandles.get(args.variablesReference);
      if (v === "globals") {
        response.body.dataId = args.name;
        response.body.description = args.name;
        response.body.accessTypes = ["write"];
        response.body.canPersist = true;
      } else {
        response.body.dataId = args.name;
        response.body.description = args.name;
        response.body.accessTypes = ["read", "write", "readWrite"];
        response.body.canPersist = true;
      }
    }

    this.sendResponse(response);
  }

  protected setDataBreakpointsRequest(response: DebugProtocol.SetDataBreakpointsResponse, args: DebugProtocol.SetDataBreakpointsArguments): void {
    // clear all data breakpoints
    this._runtime.clearAllDataBreakpoints();
    response.body = {
      breakpoints: [],
    };

    for (const dbp of args.breakpoints) {
      const ok = this._runtime.setDataBreakpoint(
        dbp.dataId,
        dbp.accessType || "write"
      );
      response.body.breakpoints.push({
        verified: ok,
      });
    }

    this.sendResponse(response);
  }

  protected completionsRequest(response: DebugProtocol.CompletionsResponse, _args: DebugProtocol.CompletionsArguments): void {
    response.body = { targets: [] };
    this.sendResponse(response);
  }

  protected cancelRequest(_response: DebugProtocol.CancelResponse, args: DebugProtocol.CancelArguments) {
    if (args.requestId) {
      this._cancellationTokens.set(args.requestId, true);
    }
    // sent by vscode to speed up interface. But technically, we cannot speed up http requests, and closing them will not speed up.
    // in any case, do not close the websocket here.
  }

  // should never be called by frontend, marked unsupported
  protected disassembleRequest(response: DebugProtocol.DisassembleResponse, args: DebugProtocol.DisassembleArguments) {
    const memoryInt = args.memoryReference.slice(3);
    const baseAddress = parseInt(memoryInt);
    const offset = args.instructionOffset || 0;
    const count = args.instructionCount;

    const isHex = memoryInt.startsWith("0x");
    const pad = isHex ? memoryInt.length - 2 : memoryInt.length;

    const loc = this.createSource(this._runtime.sourceFile);

    let lastLine = -1;

    const instructions = this._runtime
      .disassemble(baseAddress + offset, count)
      .map((instruction) => {
        let address = Math.abs(instruction.address).toString(isHex ? 16 : 10).padStart(pad, "0");
        const sign = instruction.address < 0 ? "-" : "";
        const instr: DebugProtocol.DisassembledInstruction = {
          address: sign + (isHex ? `0x${address}` : `${address}`),
          instruction: instruction.instruction,
        };
        // if instruction's source starts on a new line add the source to instruction
        if (instruction.line !== undefined && lastLine !== instruction.line) {
          lastLine = instruction.line;
          instr.location = loc;
          instr.line = this.convertDebuggerLineToClient(instruction.line);
        }
        return instr;
      });

    response.body = { instructions: instructions, };
    this.sendResponse(response);
  }

  protected setInstructionBreakpointsRequest(response: DebugProtocol.SetInstructionBreakpointsResponse, args: DebugProtocol.SetInstructionBreakpointsArguments) {
    // clear all instruction breakpoints
    this._runtime.clearInstructionBreakpoints();

    // set instruction breakpoints
    const breakpoints = args.breakpoints.map((ibp) => {
      const address = parseInt(ibp.instructionReference.slice(3));
      const offset = ibp.offset || 0;
      return <DebugProtocol.Breakpoint>{
        verified: this._runtime.setInstructionBreakpoint(address + offset),
      };
    });

    response.body = { breakpoints: breakpoints, };
    this.sendResponse(response);
  }

  protected customRequest(command: string, response: DebugProtocol.Response, args: any) {
    if (command === "toggleFormatting") {
      this._valuesInHex = !this._valuesInHex;
      if (this._useInvalidatedEvent) {
        this.sendEvent(new InvalidatedEvent(["variables"]));
      }
      this.sendResponse(response);
    } else {
      super.customRequest(command, response, args);
    }
  }

  //---- helpers

  private convertToRuntime(value: string): IRuntimeVariableType {
    value = value.trim();
    if (value === "true") {
      return true;
    }
    if (value === "false") {
      return false;
    }
    if (value[0] === "'" || value[0] === '"') {
      return value.substr(1, value.length - 2);
    }
    const n = parseFloat(value);
    if (!isNaN(n)) {
      return n;
    }
    return value;
  }

  private convertFromRuntime(v: any, name: string): DebugProtocol.Variable {
    if (v["_value"] !== undefined && v.name !== undefined) {
      let dapVariable: DebugProtocol.Variable = {
        name: `${name}`,
        value: v.value,
        type: typeof v.value === "string" ? v.value : typeof v.value,
        variablesReference: 0,
        evaluateName: v.name,
        presentationHint: { lazy: true },
      };
      v.reference ??= this._variableHandles.create(new RuntimeVariable("stackVariable", v.name));
      dapVariable.variablesReference = v.reference;
      return dapVariable;
    } else {
      let dapVariable: DebugProtocol.Variable = {
        name,
        value: v,
        variablesReference: 0,
        presentationHint: { lazy: false },
      };
      return dapVariable;
    }
  }

  convertObject(o: any, key: string): any {
    if (typeof o === 'string') {
      if (o.startsWith('[') || o.startsWith('{')) {
        let d = JSON.parse(o);
        if (o.startsWith('[')) {
          return {
            name: key,
            value: d.map((item: any, i: number) => this.convertObject(item, String(i))),
            type: 'Array',
            variablesReference: 0,
            presentationHint: { lazy: false, kind: 'Array' },
          }
        }
        if (o.startsWith('{')) {
          return {
            name: key,
            value: Object.keys(d).map((i: any) => this.convertObject(d[i], i)),
            type: 'Object',
            variablesReference: 0,
            presentationHint: { lazy: false, kind: 'Object' },
          }
        }
      } else {
        return {
          name: key,
          value: o,
          type: 'string',
          variablesReference: 0,
          presentationHint: { lazy: false, kind: 'String' },
        } as DebugProtocol.Variable
      }
    } else {
      if (typeof o === 'number') {
        return {
          name: key,
          value: String(o),
          type: 'number',
          variablesReference: 0,
          presentationHint: { lazy: false, kind: 'Number' },
        }
      } else {
        return this.convertObject(JSON.stringify(o), key);
      }
    }
  }

  private convertToRuntimeVariable(v: any, index: number, name?: string): RuntimeVariable {
    if (Array.isArray(v)) {
      return new RuntimeVariable(name ?? "Array(" + v.length + ")", v.map((item, i) => this.convertToRuntimeVariable(item, i)));
    } else if (typeof v === "object") {
      return new RuntimeVariable(Warp10DebugSession.isGts(v) ? "GTS" : name ?? "Object", Object.keys(v).map((k, i) => this.convertToRuntimeVariable(v[k], i, k)));
    } else {
      return new RuntimeVariable(name ?? String(index), v);
    }
  }

  static isGts(item: any) {
    return (!!item && (item.c === "" || !!item.c) && !!item.v && Array.isArray(item.v));
  }

  private createSource(filePath: string): Source {
    return new Source(
      basename(filePath),
      this.convertDebuggerPathToClient(filePath),
      undefined,
      undefined,
      "warpscript-adapter-data"
    );
  }
}
