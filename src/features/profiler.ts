import { StatusbarUi } from './../statusbarUi';
import request from 'request';
import { ExtensionContext, OutputChannel, Progress, ProgressLocation, TextDocument, TextEditor, Uri, ViewColumn, window, workspace, WebviewPanel, commands } from 'vscode';
import { specialCommentCommands } from '../warpScriptParser';
import WarpScriptParser from '../warpScriptParser';
import { Warp10 } from '@senx/warp10';
import { SocksProxyAgent } from 'socks-proxy-agent';
import ProxyAgent from 'proxy-agent';
import pac from 'pac-resolver';
import dns from 'dns';
import { promisify } from 'util';
import { gzip } from 'zlib';
import { EndPointProp, WarpScriptExtGlobals } from '../globals';
import WarpScriptExtConstants from '../constants';
import { SharedMem } from '../extension';
import ExecCommand from './execCommand';
import { ProfilerWebview } from '../webviews/profilerWebview';
import { TracePluginInfo } from '../webviews/tracePluginInfo';
import { Requester } from './requester';
import MacroIncluder from '../features/macroIncluder';
import { lineInFile } from '../features/macroIncluder';
import WSDiagnostics from '../providers/wsDiagnostics';

let lookupAsync: any;
if (!!dns.lookup) {
  lookupAsync = promisify(dns.lookup);
}

export default class ProfilerCommand {

  private async writeFile(path: string, content: any): Promise<void> {
    if (WarpScriptExtConstants.isVirtualWorkspace) {
      return await workspace.fs.writeFile(Uri.file(path).with({ scheme: workspace.workspaceFolders![0]!.uri.scheme }), Buffer.from(content, 'utf8'));
    } else {
      return await workspace.fs.writeFile(Uri.file(path), Buffer.from(content, 'utf8'));
    }
  }

  private async deleteFile(path: string): Promise<void> {
    if (WarpScriptExtConstants.isVirtualWorkspace) {
      return await workspace.fs.delete(Uri.file(path).with({ scheme: workspace.workspaceFolders![0]!.uri.scheme }));
    } else {
      return await workspace.fs.delete(Uri.file(path));
    }
  }

  public exec(outputWin: OutputChannel, context: ExtensionContext): any {

    return (selectiontext: string) => {
      // Check current active document is a warpcript
      if (typeof window.activeTextEditor === 'undefined' || window.activeTextEditor.document.languageId !== 'warpscript') {
        // Not a warpscript, exit early.
        return;
      }
      StatusbarUi.Working('loading...');

      let Warp10URL: string = workspace.getConfiguration().get('warpscript.Warp10URL') as string;
      let PreviewTimeUnit: string = workspace.getConfiguration().get('warpscript.DefaultTimeUnit') as string;
      const jsonMaxSizeBeforeWarning: number = workspace.getConfiguration().get('warpscript.maxFileSizeBeforeJsonWarning') as number;
      const useGZIP: boolean = !!workspace.getConfiguration().get('warpscript.useGZIP');
      const timeout: number = workspace.getConfiguration().get('warpscript.http.timeout') as number;
      const proxy_pac: string = workspace.getConfiguration().get('warpscript.ProxyPac') as string;
      const proxy_directUrl: string = workspace.getConfiguration().get('warpscript.ProxyURL') as string;
      const execDate: string = new Date().toLocaleTimeString();
      const document: TextDocument = window.activeTextEditor.document;
      const baseFilename: string = !!document ? ((document.fileName ?? '').split('\\').pop() ?? '').split('/').pop() ?? '' as string : '';

      window.withProgress<boolean>({
        location: ProgressLocation.Window,
        title: window.activeTextEditor.document.languageId === 'warpscript' ? 'WarpScript' : 'FLoWS'
      }, (progress: Progress<{ message?: string; }>) => {
        return new Promise(async (c, e) => {
          let executedWarpScript = "";
          let displayPreviewOpt = '';

          if (selectiontext === "") {
            executedWarpScript = document.getText(); // if executed with empty string, take the full text
          }
          else {
            executedWarpScript = selectiontext;
          }
          //
          // analyse the first warpscript lines starting with //
          //
          const commentsCommands: specialCommentCommands = WarpScriptParser.extractSpecialComments(executedWarpScript);
          Warp10URL = commentsCommands.endpoint || Warp10URL;
          commentsCommands.endpoint = Warp10URL; // commentsCommand should be up to date in shared memory later on.
          PreviewTimeUnit = commentsCommands.timeunit || PreviewTimeUnit;
          commentsCommands.timeunit = PreviewTimeUnit;
          displayPreviewOpt = commentsCommands.displayPreviewOpt || displayPreviewOpt;
          commentsCommands.displayPreviewOpt = '';
          //
          // keep a simple suffix for the json filename (either n for nanosecond or m for millisecond. nothing for default.)
          let jsonSuffix: string = PreviewTimeUnit.substr(0, 1);
          // add X after the suffix for no preview at all, add I for focus on images, add G for gts preview.
          jsonSuffix = jsonSuffix + displayPreviewOpt
          //
          // find the hostname in Warp10URL.
          //
          let Warp10URLhostname = Warp10URL; //if regexp fail, keep the full URL
          // Captures the lines sections name
          let hostnamePattern = /https?\:\/\/((([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9]))[\/\:].*/g;
          let lineonMatch: RegExpMatchArray | null; // https://www.regextester.com/ for easy tests
          let re = RegExp(hostnamePattern)
          while (lineonMatch = re.exec(Warp10URL)) {
            Warp10URLhostname = lineonMatch[1]; //group 1
          }
          const info = await Requester.getInstanceInfo(Warp10URL);
          const checkWS = JSON.parse(info);
          const hasTrace = (checkWS[0]?.extensions ?? {}).trace;

          if (!hasTrace || !(checkWS[0]?.extensions ?? {}).traceWSEndpoint) {
            window.showWarningMessage("The Warp 10 Trace Plugin is not activated");
            TracePluginInfo.render(context);
          } else {


            progress.report({ message: 'Executing ' + baseFilename + ' on ' + Warp10URL });


            // build warpscript with local macro. (wswlm)
            let wswlm: MacroIncluder = new MacroIncluder(outputWin);
            await wswlm.loadWarpScript(document.getText(), document.uri.toString());
            executedWarpScript = wswlm.getFinalWS();



            // log the beginning of the warpscript
            console.debug("about to send this WarpScript:", executedWarpScript.slice(0, 10000), 'on', Warp10URL);

            // wrap with capability on PROFILEMODE
            let prop: EndPointProp = WSDiagnostics.getEndpointProperties(Warp10URL ?? '');
            if (prop.traceCapAvailableForAll) {
              // add instructions for trace plugin
              wswlm.prependLinesToAll(`true STMTPOS PROFILEMODE`);
            } else {
              const traceToken = (workspace.getConfiguration().get<any>("warpscript.TraceTokensPerWarp10URL") ?? {})[Warp10URL];
              if (!traceToken) {
                window.showWarningMessage('You must set a token with the "trace" capability', ...['Open Settings', 'Cancel']).then(resp => {
                  if ('Open Settings' === resp) {
                    commands.executeCommand('workbench.action.openSettings', 'Warpscript: Trace Tokens Per Warp10 URL');
                  }
                })
                TracePluginInfo.render(context);
                return c(true);
              }
              wswlm.prependLinesToAll(`'${traceToken}' CAPADD true STMTPOS PROFILEMODE`);
            }
            let wrappedWarpScript = executedWarpScript;
            wswlm.appendLinesToAll(`NULL PROFILE.RESULTS 'profile' STORE STACKTOLIST ->JSON 'stack' STORE { 'profile' $profile 'stack' $stack }`);
            wrappedWarpScript = wswlm.getFinalWS();
            // Gzip the script before sending it.
            gzip(Buffer.from(wrappedWarpScript, 'utf8'), async (err, gzipWarpScript) => {
              if (err) {
                console.error(err);
              }

              var request_options: request.Options = {
                headers: {
                  'Content-Type': useGZIP ? 'application/gzip' : 'text/plain; charset=UTF-8',
                  'Accept': 'application/json',
                  'X-Warp10-WarpScriptSession': WarpScriptExtGlobals.sessionName,
                },
                method: "POST",
                url: Warp10URL,
                gzip: useGZIP,
                timeout: timeout,
                body: useGZIP ? gzipWarpScript : wrappedWarpScript,
                rejectUnauthorized: false
              }

              // If a local proxy.pac is define, use it
              if (proxy_pac !== "") {
                // so simple... if only it was supporting socks5. Ends up with an error for SOCKS5 lines.
                // (request_options as any).agent = new ProxyAgent("pac+" + proxy_pac);

                let proxy_pac_resp: string = 'DIRECT'; // Fallback
                try {
                  let proxy_pac_text: TextDocument = await workspace.openTextDocument(proxy_pac);
                  let FindProxyForURL = pac(proxy_pac_text.getText());
                  proxy_pac_resp = await FindProxyForURL(Warp10URL);
                } catch (e) {
                  console.error(e);
                  StatusbarUi.Execute();
                }

                // Only handle one proxy for now
                let proxy: string = proxy_pac_resp.split(';')[0];
                let proxy_split: string[] = proxy.split(' ');

                // If a proxy is defined, make sure it is specified as an IP because SocksProxyAgent does not DNS resolve
                if (1 < proxy_split.length) {
                  let host_port = proxy_split[1].split(':');
                  if (!!lookupAsync) {
                    proxy_split[1] = (await lookupAsync(host_port[0])).address + ':' + host_port[1];
                  }
                }
                if ('PROXY' == proxy_split[0]) {
                  (request_options as any).agent = new ProxyAgent('http://' + proxy_split[1]);  //not really tested, should do the job.
                } else if ('SOCKS' == proxy_split[0] || 'SOCKS5' == proxy_split[0] || 'SOCKS4' == proxy_split[0]) {
                  (request_options as any).agent = new SocksProxyAgent('socks://' + proxy_split[1]);
                }
              }

              // if ProxyURL is defined, override the proxy setting. may support pac+file:// syntax too, or pac+http://
              // see https://www.npmjs.com/package/proxy-agent
              if (proxy_directUrl !== "") {
                (request_options as any).agent = new ProxyAgent(proxy_directUrl); //tested with authentication, OK.
              }

              let req: request.Request = request.post(request_options, async (error: any, response: any, body: string) => {
                if (error) { // error is set if server is unreachable or if the request is aborted
                  if (error.aborted) {
                    console.debug("request aborted");
                    StatusbarUi.Execute();
                    progress.report({ message: 'Aborted' });
                    return c(true)
                  } else {
                    window.showErrorMessage("Cannot find or reach server, check your Warp 10 server endpoint:" + error.message)
                    console.error(error)
                    StatusbarUi.Execute();
                    progress.report({ message: 'Done' });
                    return e(error)
                  }
                } else if (response.statusCode == 301) {
                  window.showErrorMessage("Check your Warp 10 server endpoint (" + response.request.uri.href + "), you may have forgotten the api/v0/exec in the URL");
                  console.error(response.body);
                  StatusbarUi.Execute();
                  return e(true)
                } else if (response.statusCode != 200 && response.statusCode != 500) { // manage non 200 answers here
                  window.showErrorMessage("Error, server answered code " + response.statusCode + " :" + (String)(response.body).slice(0, 1000));
                  console.error(response.body);
                  StatusbarUi.Execute();
                  return e(true)
                } else if (response.statusCode == 500 && !response.headers['x-warp10-error-message']) {
                  //received a 500 error without any x-warp10-error-message. Could also be a endpoint error.
                  window.showErrorMessage("Error, error 500 without any error. Are you sure you are using an exec endpoint ? Endpoint: " + response.request.uri.href + " :" + (String)(response.body).slice(0, 1000));
                  console.error(response.body);
                  StatusbarUi.Execute();
                  return e(true)
                } else {
                  let errorParam: any = null
                  progress.report({ message: 'Parsing response' });
                  if (response.headers['x-warp10-error-message']) {
                    let line = parseInt(response.headers['x-warp10-error-line'])

                    // Check if error message contains infos from LINEON
                    let lineonPattern = /\[Line #(\d+)\]/g;  // Captures the lines sections name
                    let lineonMatch: RegExpMatchArray | null;
                    while ((lineonMatch = lineonPattern.exec(response.headers['x-warp10-error-message']))) {
                      line = parseInt(lineonMatch[1]);
                    }

                    let pos: lineInFile = wswlm.getUriAndLineFromRealLine(line);

                    errorParam = 'Error in file ' + pos.file + ' at line ' + pos.line + ' : ' + response.headers['x-warp10-error-message'];
                    StatusbarUi.Execute();

                    let errorMessage: string = response.headers['x-warp10-error-message'];
                    // We must substract the number of lines added by prepended macros in the error message.
                    errorMessage = errorMessage.replace(/\[Line #(\d+)\]/g, (_match, _group1) => '[Line #' + pos.line.toString() + ']');
                    outputWin.show();
                    outputWin.append('[' + execDate + '] ');
                    outputWin.append('ERROR ');
                    outputWin.append(pos.file + '#' + pos.line);
                    outputWin.appendLine(' ' + errorMessage);
                    if (/Unknown function 'PROFILE'/.test(errorMessage)) {
                      window
                        .showWarningMessage('The Warp 10 Trace Plugin is not activated', ...['Learn more', 'Cancel'])
                        .then(selection => {
                          if ('Learn more' === selection) {
                            TracePluginInfo.render(context);
                          }
                        });
                    }
                  }
                  // If no content-type is specified, response is the JSON representation of the stack
                  if (response.body.startsWith('[')) {

                    // Generate unique filenames, ordered by execution order.
                    let uuid = ExecCommand.pad(ExecCommand.execNumber++, 3, '0');
                    let wsFilename = `${await WarpScriptExtConstants.findTempFolder()}/${uuid}.mc2`;
                    let jsonFilename = `${await WarpScriptExtConstants.findTempFolder()}/${uuid}${jsonSuffix}.json`;
                    SharedMem.set(uuid, commentsCommands);

                    // Save executed warpscript
                    try {
                      await this.deleteFile(wsFilename); // Remove overwritten file. If file unexistent, fail silently.
                    } catch (e) {
                    }
                    try {
                      await this.writeFile(wsFilename, executedWarpScript); // the full warpscript !
                      if (err) {
                        window.showErrorMessage(err.message);
                        StatusbarUi.Execute();
                      }
                    } catch (e: any) {
                      window.showErrorMessage(e.message || e);
                      StatusbarUi.Execute();
                    }

                    // the full warpscript, with all macros, will be displayed on the first column, and it will be used by the profiler.
                    let warpscriptEditorForProfiler: TextEditor;

                    await workspace.openTextDocument(Uri.parse(wsFilename).fsPath)
                      .then((doc: TextDocument) => {
                        window.showTextDocument(doc, { viewColumn: ViewColumn.One, preview: true, preserveFocus: false })
                          .then((editor) => {
                            warpscriptEditorForProfiler = editor;
                            progress.report({ message: 'Done' });
                            StatusbarUi.Init();
                          },
                            (err: any) => {
                              console.error(err)
                              window.showErrorMessage(err.message);
                              errorParam = err;
                              StatusbarUi.Init();
                            });
                      });

                    // Save resulting JSON
                    try {
                      await this.deleteFile(jsonFilename); // Remove overwritten file. If file unexistent, fail silently.
                    } catch (e) { }
                    console.log(body)
                    const profileResult = JSON.parse(body)[0];

                    const profilerView = ProfilerWebview.render(context, profileResult.profile ?? [], warpscriptEditorForProfiler, wswlm.getListOfSourceFiles(), Uri.parse(wsFilename).toString());
                    body = profileResult.stack ?? '[]';

                    let sizeMB: number = Math.round(body.length / 1024 / 1024);

                    let noDisplay: boolean = jsonMaxSizeBeforeWarning > 0 && sizeMB > jsonMaxSizeBeforeWarning;
                    // file must be saved whatever its size... but not displayed if too big.
                    this.writeFile(jsonFilename, body).then(() => {
                      StatusbarUi.Execute();
                      outputWin.show();
                      outputWin.append('[' + execDate + '] ');
                      outputWin.append((WarpScriptExtConstants.isVirtualWorkspace ? '' : 'file://') + wsFilename);
                      outputWin.append(' => ' + (WarpScriptExtConstants.isVirtualWorkspace ? '' : 'file://') + jsonFilename);
                      outputWin.append(' ' + ExecCommand.formatElapsedTime(response.headers['x-warp10-elapsed']));
                      outputWin.append(' ' + ExecCommand.pad(response.headers['x-warp10-fetched'], 10, ' ') + ' fetched ');
                      outputWin.append(ExecCommand.pad(response.headers['x-warp10-ops'], 10, ' ') + ' ops ');
                      outputWin.append(ExecCommand.pad(baseFilename, 23, ' '));
                      outputWin.appendLine(' @' + Warp10URLhostname.substr(0, 30));
                      if (noDisplay) {
                        outputWin.appendLine(`${(WarpScriptExtConstants.isVirtualWorkspace ? '' : 'file://')}${jsonFilename} is over ${jsonMaxSizeBeforeWarning}MB and was not opened. See Max File Size Before JSON Warning preference.`);
                        window.showWarningMessage(`WarpScript: please confirm you really want to parse a ${sizeMB}MB file, esc to cancel`, "I am sure", "Nooooo !").then(
                          (answer) => {
                            if (answer === "I am sure") {
                              //size warning confirmed, display the json.
                              this.displayJson(jsonFilename, profilerView, progress, errorParam);
                            }
                          }
                        );
                      } else {
                        this.displayJson(jsonFilename, profilerView, progress, errorParam);
                      }
                    }, (err) => {
                      if (err) {
                        window.showErrorMessage(err.message);
                        errorParam = err.message;
                        StatusbarUi.Execute();
                      }
                    });
                  } else {
                    // not a json, or empty body (in case of warpscript error)
                    console.debug("requests did not return anything intesting in the body")
                  }
                  if (errorParam) {
                    e(errorParam)
                  } else {
                    c(true)
                  }
                  StatusbarUi.Execute();
                }
                // decrease request count on this endpoint
                WarpScriptExtGlobals.endpointsForThisSession[req.uri.href]--;
                console.debug(WarpScriptExtGlobals.endpointsForThisSession)
              });
              ExecCommand.currentRunningRequests.push(req);
              // increase request count on this endpoint, to use it later for session abort
              WarpScriptExtGlobals.endpointsForThisSession[req.uri.href] = (WarpScriptExtGlobals.endpointsForThisSession[req.uri.href] || 0) + 1;

              StatusbarUi.Working(`${WarpScriptExtGlobals.endpointsForThisSession[req.uri.href]} WarpScripts running...`);
            });
          }
        });
      });
    };
  }

  private displayJson(jsonFilename: string, focusOnThisPanel: WebviewPanel, progress: Progress<{ message?: string; }>, errorParam: any) {
    console.debug(errorParam)
    let jsonUri: Uri;
    if (WarpScriptExtConstants.isVirtualWorkspace) {
      jsonUri = Uri.file(jsonFilename).with({ scheme: workspace.workspaceFolders![0]!.uri.scheme });
    } else {
      jsonUri = Uri.file(jsonFilename);
    }
    workspace.openTextDocument(jsonUri)
      .then((doc: TextDocument) => {
        window.showTextDocument(doc, { viewColumn: ViewColumn.Two, preview: true, preserveFocus: true })
          .then(() => {
            progress.report({ message: 'Done' });
            StatusbarUi.Init();
            focusOnThisPanel.reveal();
          },
            (err: any) => {
              console.error(err)
              window.showErrorMessage(err.message);
              errorParam = err;
              StatusbarUi.Init();
            });
      });
  }

  public abortAllRequests(outputWin: OutputChannel) {
    return () => {
      outputWin.show();
      outputWin.append('[' + new Date().toLocaleTimeString() + '] ');
      outputWin.appendLine("Sending WSKILLSESSION to endpoints... 10s before killing every connections.");

      // 3 seconds to abort on every endpoints
      Object.keys(WarpScriptExtGlobals.endpointsForThisSession).forEach(endpoint => {
        let req = new Warp10({ endpoint }); // 3 second timeout
        req.exec(`<% "${WarpScriptExtGlobals.sessionName}" 'WSKILLSESSION' EVAL %> <% -1 %> <% %> TRY`)
          .then((answer: any) => {
            if (answer.result[0]) {
              if (answer.result[0] === 0) {
                outputWin.appendLine(` It appears that ${endpoint} is running on multiple backend`);
              } else if (answer.result[0] === -1) {
                outputWin.appendLine(` Unable to WSKILLSESSION on ${endpoint}. Did you activate StackPSWarpScriptExtension?`);
              } else {
                outputWin.appendLine(` Send abortion signal successfully to ${answer.result[0]} script${answer.result[0] > 1 ? 's' : ''} on ${endpoint}`);
              }
            }
          }, (_error: any) => {
            outputWin.appendLine(` Unable to WSKILLSESSION on ${endpoint}. Did you activate StackPSWarpScriptExtension?`);
          });
      })

      // 10 seconds to kill every remaining connections
      setTimeout(() => {
        // abort all requests, execute the callback with an error manually set. 
        ExecCommand.currentRunningRequests.forEach(req => {
          req.abort();
          // @ts-ignore
          req.callback({ 'aborted': 'true' }, undefined, undefined);
        });
        ExecCommand.currentRunningRequests = [];
        for (let prop in WarpScriptExtGlobals.endpointsForThisSession) {
          delete WarpScriptExtGlobals.endpointsForThisSession[prop];
        }
        outputWin.appendLine("Done. WarpScripts may be still running on the server, but VSCode closed every connections.");
      }, 10000)
    }
  }
}
