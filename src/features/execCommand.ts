import { StatusbarUi } from './../statusbarUi';
import * as request from 'request';
import WSDocumentLinksProvider from '../providers/wsDocumentLinksProvider';
import { OutputChannel, Progress, ProgressLocation, TextDocument, Uri, ViewColumn, window, workspace } from 'vscode';
import { specialCommentCommands } from '../warpScriptParser';
import WarpScriptParser from '../warpScriptParser';
import { Warp10 } from '@senx/warp10';
import { SocksProxyAgent } from 'socks-proxy-agent';
import * as  ProxyAgent from 'proxy-agent';
import * as  pac from 'pac-resolver';
import * as  dns from 'dns';
import { promisify } from 'util';
import { gzip } from 'zlib';
import { endpointsForThisSession, sessionName } from '../globals';
import WarpScriptExtConstants from '../constants';

let lookupAsync: any;
if (!!dns.lookup) {
  lookupAsync = promisify(dns.lookup);
}

export default class ExecCommand {

  private static execNumber: number = 0;

  public static currentRunningRequests: request.Request[] = [];

  static pad(str: any, size: number, padder: string) { return (padder.repeat(30) + str).substr(-size); }

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

  public exec(outputWin: OutputChannel): any {
    return (selectiontext: string) => {
      // Check current active document is a warpcript
      if (typeof window.activeTextEditor === 'undefined'
        || (
          window.activeTextEditor.document.languageId !== 'warpscript'
          && window.activeTextEditor.document.languageId !== 'flows'
        )
      ) {
        // Not a warpscript, exit early.
        return;
      }
      StatusbarUi.Working('loading...');

      let Warp10URL: string = workspace.getConfiguration().get('warpscript.Warp10URL');
      let PreviewTimeUnit: string = workspace.getConfiguration().get('warpscript.DefaultTimeUnit');
      const jsonMaxSizeForAutoUnescape: number = workspace.getConfiguration().get('warpscript.maxFileSizeForAutomaticUnicodeEscape');
      const jsonMaxSizeBeforeWarning: number = workspace.getConfiguration().get('warpscript.maxFileSizeBeforeJsonWarning');
      const useGZIP: boolean = workspace.getConfiguration().get('warpscript.useGZIP');
      const timeout: number = workspace.getConfiguration().get('warpscript.http.timeout')
      const proxy_pac: string = workspace.getConfiguration().get('warpscript.ProxyPac');
      const proxy_directUrl: string = workspace.getConfiguration().get('warpscript.ProxyURL');
      const execDate: string = new Date().toLocaleTimeString();
      const document: TextDocument = window.activeTextEditor.document;
      const baseFilename: string = document.fileName.split('\\').pop().split('/').pop();

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
          let commentsCommands: specialCommentCommands = WarpScriptParser.extractSpecialComments(executedWarpScript);
          Warp10URL = commentsCommands.endpoint || Warp10URL;
          let substitutionWithLocalMacros = !(commentsCommands.localmacrosubstitution === false);
          PreviewTimeUnit = commentsCommands.timeunit || PreviewTimeUnit;
          displayPreviewOpt = commentsCommands.displayPreviewOpt || displayPreviewOpt;

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

          progress.report({ message: 'Executing ' + baseFilename + ' on ' + Warp10URL });

          let lines: number[] = [document.lineCount]
          let uris: string[] = [document.uri.toString()]
          if (substitutionWithLocalMacros) {
            console.log("liste macro");
            console.log(WarpScriptParser.getListOfMacroCalls(executedWarpScript));
            console.log("fin liste macro");

            // first, prepend macros of the special comments "// @include macro: "
            for (let macroName of commentsCommands.listOfMacroInclusion) {
              if (macroName.startsWith('@')) {
                macroName = macroName.substring(1);
              }
              console.log('-' + macroName + '-');
              await WSDocumentLinksProvider.getMacroURI(macroName).then(
                async (uri) => {
                  if (uris.indexOf(uri.toString()) === -1) {
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
                    lines.unshift(tdoc.lineCount + 2); // 3 '\n' added to define macro so it makes two new lines
                    uris.unshift(uri.toString());
                  }
                }
              ).catch(
                () => {
                  outputWin.show();
                  outputWin.append('[' + execDate + '] ');
                  outputWin.appendLine("warning '" + macroName + "' is explicitly included with // @include macro:, but was not found in the VSCode project. Warp 10 will try its internal resolvers.")
                }
              );
            }

            let allMacroPrepended = false;

            while (!allMacroPrepended) {
              let listOfMacros = WarpScriptParser.getListOfMacroCalls(executedWarpScript);

              if (listOfMacros.length > 0) {
                for (const m of listOfMacros) {
                  const macroName = m.substring(1);
                  console.log('-' + macroName + '-');
                  allMacroPrepended = true;
                  await WSDocumentLinksProvider.getMacroURI(macroName).then(
                    async (uri) => {
                      if (uris.indexOf(uri.toString()) === -1) {
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
                        lines.unshift(tdoc.lineCount + 2); // 3 '\n' added to define macro so it makes two new lines
                        uris.unshift(uri.toString());
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
            if (commentsCommands.listOfMacroInclusion.length > 0) {
              outputWin.show();
              outputWin.append('[' + execDate + '] ');
              outputWin.appendLine("warning '// @localmacrosubstitution false' also disables all the '// @include macro:' instructions")
            }
          }

          if (window.activeTextEditor.document.languageId === 'flows') {
            executedWarpScript = `<'
${executedWarpScript} 
'>
FLOWS
`;
          }
          // log the beginning of the warpscript
          console.log("about to send this WarpScript:", executedWarpScript.slice(0, 10000), 'on', Warp10URL);

          // Gzip the script before sending it.
          gzip(Buffer.from(executedWarpScript, 'utf8'), async (err, gzipWarpScript) => {
            if (err) {
              console.error(err);
            }

            var request_options: request.Options = {
              headers: {
                'Content-Type': useGZIP ? 'application/gzip' : 'text/plain; charset=UTF-8',
                'Accept': 'application/json',
                'X-Warp10-WarpScriptSession': sessionName,
              },
              method: "POST",
              url: Warp10URL,
              gzip: useGZIP,
              timeout: timeout,
              body: useGZIP ? gzipWarpScript : executedWarpScript,
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
                console.log(e);
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
                  console.log("request aborted");
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
                // console.log(error, response, body)
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

                  let fileInError;
                  let lineInError = line;
                  for (var i = 0; i < lines.length; i++) {
                    if (lineInError <= lines[i]) {
                      fileInError = uris[i];
                      break;
                    } else {
                      lineInError -= lines[i];
                    }
                  }
                  errorParam = 'Error in file ' + fileInError + ' at line ' + lineInError + ' : ' + response.headers['x-warp10-error-message'];
                  StatusbarUi.Execute();

                  let errorMessage: string = response.headers['x-warp10-error-message'];
                  // We must substract the number of lines added by prepended macros in the error message.
                  errorMessage = errorMessage.replace(/\[Line #(\d+)\]/g, (_match, _group1) => '[Line #' + lineInError.toString() + ']');
                  outputWin.show();
                  outputWin.append('[' + execDate + '] ');
                  outputWin.append('ERROR file://');
                  outputWin.append(Uri.parse(uris[i]).fsPath + ':' + lineInError);
                  outputWin.appendLine(' ' + errorMessage);
                }
                // If no content-type is specified, response is the JSON representation of the stack
                if (response.body.startsWith('[')) {

                  // Generate unique filenames, ordered by execution order.
                  let uuid = ExecCommand.pad(ExecCommand.execNumber++, 3, '0');
                  let wsFilename = `${await WarpScriptExtConstants.findTempFolder()}/${uuid}.mc2`;
                  let jsonFilename = `${await WarpScriptExtConstants.findTempFolder()}/${uuid}${jsonSuffix}.json`;

                  // Save executed warpscript
                  try {
                    await this.deleteFile(wsFilename); // Remove overwritten file. If file unexistent, fail silently.
                  } catch (e) {
                  }
                  try {
                    await this.writeFile(wsFilename, executedWarpScript);
                    if (err) {
                      window.showErrorMessage(err.message);
                      StatusbarUi.Execute();
                    }
                  } catch (e) {
                    window.showErrorMessage(e.message || e);
                    StatusbarUi.Execute();
                  }
                  // Save resulting JSON
                  try {
                    await this.deleteFile(jsonFilename); // Remove overwritten file. If file unexistent, fail silently.
                  } catch (e) { }

                  // if file is small enough (1M), unescape the utf16 encoding that is returned by Warp 10
                  let sizeMB: number = Math.round(body.length / 1024 / 1024);
                  if (jsonMaxSizeForAutoUnescape > 0 && sizeMB < jsonMaxSizeForAutoUnescape) {
                    // Do not unescape \\u nor control characters.
                    body = unescape(body.replace(/(?<!\\)\\u(?!000)(?!001)([0-9A-Fa-f]{4})/g, "%u\$1"))
                  }
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
                            this.displayJson(jsonFilename, progress, errorParam);
                          }
                        }
                      );
                    } else {
                      this.displayJson(jsonFilename, progress, errorParam);
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
              endpointsForThisSession[req.uri.href]--;
              console.log(endpointsForThisSession)
            });
            ExecCommand.currentRunningRequests.push(req);
            // increase request count on this endpoint, to use it later for session abort
            endpointsForThisSession[req.uri.href] = (endpointsForThisSession[req.uri.href] || 0) + 1;

            StatusbarUi.Working(`${endpointsForThisSession[req.uri.href]} WarpScripts running...`);
          });
        });
      })
    };
  }

  private displayJson(jsonFilename: string, progress: Progress<{ message?: string; }>, errorParam: any) {
    console.debug(errorParam)
    let jsonUri: Uri;
    if (WarpScriptExtConstants.isVirtualWorkspace) {
      jsonUri = Uri.file(jsonFilename).with({ scheme: workspace.workspaceFolders![0]!.uri.scheme });
    } else {
      jsonUri = Uri.file(jsonFilename);
    }
    workspace.openTextDocument(jsonUri)
      .then((doc: TextDocument) => {
        window.showTextDocument(doc, { viewColumn: ViewColumn.Two, preview: true, preserveFocus: false })
          .then(() => {
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
  }

  public abortAllRequests(outputWin: OutputChannel) {
    return () => {
      outputWin.show();
      outputWin.append('[' + new Date().toLocaleTimeString() + '] ');
      outputWin.appendLine("Sending WSKILLSESSION to endpoints... 10s before killing every connections.");

      // 3 seconds to abort on every endpoints
      Object.keys(endpointsForThisSession).forEach(endpoint => {
        let req = new Warp10(endpoint); // 3 second timeout
        req.exec(`<% "${sessionName}" 'WSKILLSESSION' EVAL %> <% -1 %> <% %> TRY`)
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
          req.callback({ 'aborted': 'true' }, undefined, undefined);
        });
        ExecCommand.currentRunningRequests = [];
        for (let prop in endpointsForThisSession) {
          delete endpointsForThisSession[prop];
        }
        outputWin.appendLine("Done. WarpScripts may be still running on the server, but VSCode closed every connections.");
      }, 10000)
    }
  }

  private static formatElapsedTime(elapsed: number) {
    if (elapsed < 1000) {
      return ExecCommand.pad(elapsed.toFixed(3), 7, ' ') + ' ns';
    }
    if (elapsed < 1000000) {
      return ExecCommand.pad((elapsed / 1000).toFixed(3), 7, ' ') + ' μs';
    }
    if (elapsed < 1000000000) {
      return ExecCommand.pad((elapsed / 1000000).toFixed(3), 7, ' ') + ' ms';
    }
    if (elapsed < 1000000000000) {
      return ExecCommand.pad((elapsed / 1000000000).toFixed(3), 7, ' ') + ' s ';
    }
    // Max exec time for nice output: 999.999 minutes (should be OK, timeout should happen before that).
    return ExecCommand.pad((elapsed / 60000000000).toFixed(3), 7, ' ') + ' m ';
  }

}