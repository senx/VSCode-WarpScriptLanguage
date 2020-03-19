import { StatusbarUi } from './../statusbarUi';
import * as vscode from 'vscode';
import * as request from 'request';
import WSDocumentLinksProvider from '../providers/wsDocumentLinksProvider';
import { Uri } from 'vscode';
import fs = require('fs');
import os = require('os');
import zlib = require("zlib");
import { specialCommentCommands } from '../warpScriptParser';
import WarpScriptParser from '../warpScriptParser';
import WarpScriptExtGlobals = require('../globals')
import { Warp10 } from "@senx/warp10";
const SocksProxyAgent = require('socks-proxy-agent');
const ProxyAgent = require('proxy-agent');
const pac = require('pac-resolver');
const dns = require('dns');
const promisify = require('util.promisify');
var lookupAsync = promisify(dns.lookup);

export default class ExecCommand {

  private static execNumber: number = 0;

  public static currentRunningRequests: request.Request[] = [];

  static pad(str: any, size: number, padder: string) { return (padder.repeat(30) + str).substr(-size); }

  public exec(outputWin: vscode.OutputChannel): any {
    return (selectiontext: string) => {
      // Check current active document is a warpcript
      if (typeof vscode.window.activeTextEditor === 'undefined' || vscode.window.activeTextEditor.document.languageId !== 'warpscript') {
        // Not a warpscript, exit early.
        return;
      }
      StatusbarUi.Working('loading...');

      let Warp10URL: string = vscode.workspace.getConfiguration('warpscript', null).get('Warp10URL');
      let PreviewTimeUnit: string = vscode.workspace.getConfiguration('warpscript', null).get('DefaultTimeUnit');
      let jsonMaxSizeForAutoUnescape: number = Number(vscode.workspace.getConfiguration('warpscript', null).get('maxFileSizeForAutomaticUnicodeEscape'));
      let jsonMaxSizeBeforeWarning: number = Number(vscode.workspace.getConfiguration('warpscript', null).get('maxFileSizeBeforeJsonWarning'));
      const useGZIP: boolean = vscode.workspace.getConfiguration('warpscript', null).get('useGZIP');
      const execDate: string = new Date().toLocaleTimeString();
      const document: vscode.TextDocument = vscode.window.activeTextEditor.document;
      const baseFilename: string = document.fileName.split('\\').pop().split('/').pop();

      vscode.window.withProgress<boolean>({
        location: vscode.ProgressLocation.Window,
        title: 'WarpScript'
      }, (progress: vscode.Progress<{ message?: string; }>) => {
        return new Promise(async (c, e) => {
          let executedWarpScript = "";
          let displayPreviewOpt = '';

          if (selectiontext === "") {
            executedWarpScript = document.getText(); //if executed with empty string, take the full text
          }
          else {
            executedWarpScript = selectiontext;
          }
          //
          //analyse the first warpscript lines starting with //
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
          //find the hostname in Warp10URL.
          //
          let Warp10URLhostname = Warp10URL; //if regexp fail, keep the full URL
          let hostnamePattern = /https?\:\/\/((([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9]))[\/\:].*/g;  // Captures the lines sections name
          let lineonMatch: RegExpMatchArray | null; // https://www.regextester.com/ for easy tests
          let re = RegExp(hostnamePattern)
          while (lineonMatch = re.exec(Warp10URL)) {
            Warp10URLhostname = lineonMatch[1]; //group 1
          }

          progress.report({ message: 'Executing ' + baseFilename + ' on ' + Warp10URL });

          let macroURIPattern = /\s@([^\s]+)/g;  // Captures the macro name
          let match: RegExpMatchArray | null;
          let lines: number[] = [document.lineCount]
          let uris: string[] = [document.uri.toString()]
          let linesOfMacrosPrepended: number = 0;

          if (substitutionWithLocalMacros) {
            while ((match = macroURIPattern.exec(executedWarpScript))) {
              const macroName = match[1];
              console.log('-' + macroName + '-');
              await WSDocumentLinksProvider.getMacroURI(macroName).then(
                async (uri) => {
                  if (uris.indexOf(uri.toString()) === -1) {
                    //outputWin.show();
                    //outputWin.appendLine('Appending ' + uri + ' as ' + macroName);
                    let tdoc: vscode.TextDocument = await vscode.workspace.openTextDocument(uri);
                    let macroCode: string = tdoc.getText()
                    // Prepend the macro, store it and then append the rest of the script.
                    let prepend: string = macroCode + '\n\'' + macroName + '\' STORE\n\n';
                    executedWarpScript = prepend + executedWarpScript;
                    linesOfMacrosPrepended += prepend.split('\n').length - 1;
                    console.log(prepend.split('\n'))
                    // Update lines and uris references
                    lines.unshift(tdoc.lineCount + 2); // 3 '\n' added to define macro so it makes two new lines
                    uris.unshift(uri.toString());
                    macroURIPattern.lastIndex = 0; // Restart the regex matching at the start of the string.
                  }
                }
              ).catch(
                () => { /* Ignore missing macros */ }
              );
            }
          }

          // log the beginning of the warpscript
          console.log("about to send this WarpScript:", executedWarpScript.slice(0, 10000));
          // Gzip the script before sending it.
          zlib.gzip(Buffer.from(executedWarpScript, 'utf8'), async function (err, gzipWarpScript) {
            if (err) {
              console.error(err);
            }

            var request_options: request.Options = {
              headers: {
                'Content-Type': useGZIP ? 'application/gzip' : 'text/plain; charset=UTF-8',
                'Accept': 'application/json',
                'X-Warp10-WarpScriptSession': WarpScriptExtGlobals.sessionName,
                'x-warp10-line-count-offset': linesOfMacrosPrepended.toString()
              },
              method: "POST",
              url: Warp10URL,
              gzip: useGZIP,
              timeout: 3600000, // 1 hour
              body: useGZIP ? gzipWarpScript : executedWarpScript,
              rejectUnauthorized: false
            }

            let proxy_pac: string = vscode.workspace.getConfiguration().get('warpscript.ProxyPac');
            let proxy_directUrl: string = vscode.workspace.getConfiguration().get('warpscript.ProxyURL');

            // If a local proxy.pac is define, use it
            if (proxy_pac !== "") {
              // so simple... if only it was supporting socks5. Ends up with an error for SOCKS5 lines.
              //(request_options as any).agent = new ProxyAgent("pac+" + proxy_pac);

              let proxy_pac_resp: string = 'DIRECT'; // Fallback
              try {
                let proxy_pac_text: vscode.TextDocument = await vscode.workspace.openTextDocument(proxy_pac);
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
                proxy_split[1] = (await lookupAsync(host_port[0])).address + ':' + host_port[1];
              }

              if ('PROXY' == proxy_split[0]) {
                (request_options as any).agent = new ProxyAgent('http://' + proxy_split[1]);  //not really tested, should do the job.
              } else if ('SOCKS' == proxy_split[0] || 'SOCKS5' == proxy_split[0] || 'SOCKS4' == proxy_split[0]) {
                (request_options as any).agent = new SocksProxyAgent('socks://' + proxy_split[1]);
              }
            }

            //if ProxyURL is defined, override the proxy setting. may support pac+file:// syntax too, or pac+http://
            //  see https://www.npmjs.com/package/proxy-agent
            if (proxy_directUrl !== "") {
              (request_options as any).agent = new ProxyAgent(proxy_directUrl); //tested with authentication, OK.
            }

            //console.log(request_options)

            let req: request.Request = request.post(request_options, async (error: any, response: any, body: string) => {
              if (error) { // error is set if server is unreachable or if the request is aborted
                if (error.aborted) {
                  console.log("request aborted");
                  StatusbarUi.Execute();
                  progress.report({ message: 'Aborted' });
                  return c(true)
                } else {
                  vscode.window.showErrorMessage("Cannot find or reach server, check your Warp 10 server endpoint:" + error.message)
                  console.error(error)
                  StatusbarUi.Execute();
                  progress.report({ message: 'Done' });
                  return e(error)
                }
              } else if (response.statusCode == 301) {
                vscode.window.showErrorMessage("Check your Warp 10 server endpoint (" + response.request.uri.href + "), you may have forgotten the api/v0/exec in the URL");
                console.error(response.body);
                StatusbarUi.Execute();
                return e(true)
              } else if (response.statusCode != 200 && response.statusCode != 500) { // manage non 200 answers here
                vscode.window.showErrorMessage("Error, server answered code " + response.statusCode + " :" + (String)(response.body).slice(0, 1000));
                console.error(response.body);
                StatusbarUi.Execute();
                return e(true)
              } else if (response.statusCode == 500 && !response.headers['x-warp10-error-message']) {
                //received a 500 error without any x-warp10-error-message. Could also be a endpoint error.
                vscode.window.showErrorMessage("Error, error 500 without any WarpScript error. Are you sure you are using a WarpScript exec endpoint ? Endpoint: " + response.request.uri.href + " :" + (String)(response.body).slice(0, 1000));
                console.error(response.body);
                StatusbarUi.Execute();
                return e(true)
              } else {
                // console.log(error, response, body)
                let errorParam: any = null
                progress.report({ message: 'Parsing response' });
                let lineOffset: number = parseInt(response.request.headers['x-warp10-line-count-offset']);
                console.log('lineoffset', lineOffset);
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
                    }
                    else {
                      lineInError -= lines[i];
                    }
                  }
                  errorParam = 'Error in file ' + fileInError + ' at line ' + lineInError + ' : ' + response.headers['x-warp10-error-message'];
                  StatusbarUi.Execute();

                  let errorMessage: string = response.headers['x-warp10-error-message'];
                  // We must substract the number of lines added by prepended macros in the error message.
                  errorMessage = errorMessage.replace(/\[Line #(\d+)\]/g, (_match, group1) => '[Line #' + (Number.parseInt(group1) - lineOffset).toString() + ']');

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
                  let wsFilename = os.tmpdir() + '/' + uuid + '.mc2';
                  let jsonFilename = os.tmpdir() + '/' + uuid + jsonSuffix + '.json';

                  // Save executed warpscript
                  fs.unlink(wsFilename, () => { // Remove overwritten file. If file unexistent, fail silently.
                    fs.writeFile(wsFilename, executedWarpScript, { mode: 0o0400 }, function (err) {
                      if (err) {
                        vscode.window.showErrorMessage(err.message);
                        StatusbarUi.Execute();
                      }
                    });
                  });

                  //will be called later
                  function displayJson() {
                    vscode.workspace.openTextDocument(jsonFilename).then((doc: vscode.TextDocument) => {
                      vscode.window.showTextDocument(doc, { viewColumn: vscode.ViewColumn.Two, preview: true, preserveFocus: false }).then(
                        () => {
                          progress.report({ message: 'Done' });
                          StatusbarUi.Execute();
                        },
                        (err: any) => {
                          console.error(err)
                          vscode.window.showErrorMessage(err.message);
                          errorParam = err;
                          StatusbarUi.Execute();
                        });
                    });
                  }

                  // Save resulting JSON
                  fs.unlink(jsonFilename, () => { // Remove overwritten file. If file unexistent, fail silently.
                    //if file is small enough (1M), unescape the utf16 encoding that is returned by Warp 10
                    let sizeMB: number = Math.round(body.length / 1024 / 1024);
                    if (jsonMaxSizeForAutoUnescape > 0 && sizeMB < jsonMaxSizeForAutoUnescape) {
                      // Do not unescape \\u nor control characters.
                      body = unescape(body.replace(/(?<!\\)\\u(?!000)(?!001)([0-9A-Fa-f]{4})/g, "%u\$1"))
                    }
                    let noDisplay: boolean = jsonMaxSizeBeforeWarning > 0 && sizeMB > jsonMaxSizeBeforeWarning;
                    //file must be saved whatever its size... but not displayed if too big.
                    fs.writeFile(jsonFilename, body, { mode: 0o0400 }, function (err) {
                      if (err) {
                        vscode.window.showErrorMessage(err.message);
                        errorParam = err.message;
                        StatusbarUi.Execute();
                      }
                      else {
                        StatusbarUi.Execute();
                        outputWin.show();
                        outputWin.append('[' + execDate + '] ');
                        outputWin.append('file://' + wsFilename);
                        outputWin.append(' => ' + 'file://' + jsonFilename);
                        outputWin.append(' ' + ExecCommand.formatElapsedTime(response.headers['x-warp10-elapsed']));
                        outputWin.append(' ' + ExecCommand.pad(response.headers['x-warp10-fetched'], 10, ' ') + ' fetched ');
                        outputWin.append(ExecCommand.pad(response.headers['x-warp10-ops'], 10, ' ') + ' ops ');
                        outputWin.append(ExecCommand.pad(baseFilename, 23, ' '));
                        outputWin.appendLine(' @' + Warp10URLhostname.substr(0, 30));
                        if (noDisplay) {
                          outputWin.appendLine(`file://${jsonFilename} is over ${jsonMaxSizeBeforeWarning}MB and was not opened. See Max File Size Before JSON Warning preference.`);
                          vscode.window.showWarningMessage(`WarpScript: please confirm you really want to parse a ${sizeMB}MB file, esc to cancel`, "I am sure", "Nooooo !").then(
                            (answer) => {
                              if (answer === "I am sure") {
                                //size warning confirmed, display the json.
                                displayJson();
                              }
                            }
                          );
                        } else {
                          displayJson();
                        }
                      }
                    });
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
              console.log(WarpScriptExtGlobals.endpointsForThisSession)
            });
            ExecCommand.currentRunningRequests.push(req);
            // increase request count on this endpoint, to use it later for session abort
            WarpScriptExtGlobals.endpointsForThisSession[req.uri.href] = (WarpScriptExtGlobals.endpointsForThisSession[req.uri.href] || 0) + 1;
          });
        })
      })
    }
  }

  public abortAllRequests(outputWin: vscode.OutputChannel) {
    return () => {
      outputWin.show();
      outputWin.append('[' + new Date().toLocaleTimeString() + '] ');
      outputWin.appendLine("Sending WSABORT to endpoints... 10s before killing every connections.");

      // 3 seconds to abort on every endpoints
      Object.keys(WarpScriptExtGlobals.endpointsForThisSession).forEach(endpoint => {
        let req = new Warp10(endpoint, 3000, 3000, 1); // 3 second timeout
        req.exec(` "${WarpScriptExtGlobals.sessionName}" WSABORTE `).then(answer => {
          outputWin.appendLine(` Send abortion signal successfully to ${answer.result[0]} script${answer.result[0] > 1 ? 's' : ''} on ${endpoint}`);
        }, _error => {
          outputWin.appendLine(" Unable to WSABORT on " + endpoint + " Did you activate StackPSWarpScriptExtension ?");
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
        WarpScriptExtGlobals.endpointsForThisSession = {};
        outputWin.appendLine("Done. WarpScripts may be still running on the server, but VSCode closed every connections.")

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