import { StatusbarUi } from './../statusbarUi';
import * as vscode from 'vscode';
import * as request from 'request';
import WSDocumentLinksProvider from '../providers/wsDocumentLinksProvider';
import { Uri } from 'vscode';
import fs = require('fs');
import os = require('os');
import zlib = require("zlib");
const SocksProxyAgent = require('socks-proxy-agent');
const ProxyAgent = require('proxy-agent');
const pac = require('pac-resolver');
const dns = require('dns');
const promisify = require('util.promisify');
var lookupAsync = promisify(dns.lookup);

export default class ExecCommand {

  private static execNumber: number = 0;

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
      let jsonMaxSizeForAutoUnescape: number = Number(vscode.workspace.getConfiguration('warpscript',null).get('maxFileSizeForAutomaticUnicodeEscape'));
      let jsonMaxSizeBeforeWarning: number = Number(vscode.workspace.getConfiguration('warpscript',null).get('maxFileSizeBeforeJsonWarning'));
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
          let substitutionWithLocalMacros = true;
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
          let warpscriptlines = executedWarpScript.split('\n');
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
                    Warp10URL = parametervalue;   // overrides the Warp10URL configuration
                    console.log(Warp10URL);
                    break;
                  case "localmacrosubstitution":
                    substitutionWithLocalMacros = ("true" === parametervalue.toLowerCase());   // overrides the substitutionWithLocalMacros
                    console.log("substitutionWithLocalMacros=" + substitutionWithLocalMacros);
                    break;
                  case "timeunit":
                    if (['us', 'ms', 'ns'].indexOf(parametervalue.trim()) > -1) {
                      PreviewTimeUnit = parametervalue.trim();
                    }
                    break;
                  case "preview":
                    switch (parametervalue.toLowerCase().substr(0, 4)) {
                      case "none": displayPreviewOpt = 'X'; break;
                      case "gts": displayPreviewOpt = 'G'; break;
                      case "imag": displayPreviewOpt = 'I'; break;
                      default: displayPreviewOpt = ''; break;
                    }
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

          if(substitutionWithLocalMacros) {
            while ((match = macroURIPattern.exec(executedWarpScript))) {
              const macroName = match[1];
              console.log('-'+macroName+'-');
              await WSDocumentLinksProvider.getMacroURI(macroName).then(
                async (uri) => {
                  if (uris.indexOf(uri.toString()) === -1) {
                    //outputWin.show();
                    //outputWin.appendLine('Appending ' + uri + ' as ' + macroName);
                    let tdoc: vscode.TextDocument = await vscode.workspace.openTextDocument(uri);
                    let macroCode: string = tdoc.getText()
                    // Prepend the macro, store it and then append the rest of the script.
                    executedWarpScript = macroCode + '\n\'' + macroName + '\' STORE\n\n' + executedWarpScript
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
          // Gzip the script before sending it.
          zlib.gzip(Buffer.from(executedWarpScript,'utf8'), async function (err, gzipWarpScript) {
            if (err) {
              console.error(err);
            }
            let headers = { 'Content-Type': 'application/gzip', 'Transfer-Encoding': 'chunked' };
            if (!useGZIP) {
              headers['Content-Type'] = 'text/plain; charset=UTF-8';
            }

            var request_options = {
              headers: headers,
              method:"POST",
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
            
            request.post(request_options, async (error: any, response: any, body: string) => {
              if (error) {
                vscode.window.showErrorMessage(error.message)
                console.error(error)
                StatusbarUi.Execute();
                return e(error)
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
                    }
                    else {
                      lineInError -= lines[i];
                    }
                  }
                  errorParam = 'Error in file ' + fileInError + ' at line ' + lineInError + ' : ' + response.headers['x-warp10-error-message'];
                  StatusbarUi.Execute();
                  outputWin.show();
                  outputWin.append('[' + execDate + '] ');
                  outputWin.append('ERROR ');
                  outputWin.append(Uri.parse(uris[i]).fsPath + ':' + lineInError);
                  outputWin.appendLine(' ' + response.headers['x-warp10-error-message']);
                }
                // If no content-type is specified, response is the JSON representation of the stack
                if (!response.headers['content-type'] || "application/json" === response.headers['content-type']) {

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
                    let sizeMB:number = Math.round(body.length / 1024 / 1024);
                    if (jsonMaxSizeForAutoUnescape > 0 && sizeMB < jsonMaxSizeForAutoUnescape) {
                      // Do not unescape \\u nor control characters. 
                      body = unescape(body.replace(/(?<!\\)\\u(?!000)(?!001)([0-9A-Fa-f]{4})/g,"%u\$1"))
                    }                    
                    let noDisplay:boolean = jsonMaxSizeBeforeWarning > 0 && sizeMB > jsonMaxSizeBeforeWarning;
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
                          outputWin.appendLine(`file://${wsFilename} is over ${jsonMaxSizeBeforeWarning}MB and was not opened. See Max File Size Before JSON Warning preference.`);
                          vscode.window.showWarningMessage(`WarpScript: please confirm you really want to parse a ${sizeMB}MB file, esc to cancel`,"I am sure", "Nooooo !").then(
                            (answer) => { 
                              if (answer==="I am sure"){
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

                }
                if (errorParam) {
                  e(errorParam)
                } else {
                  c(true)
                }
              }
            });
          });
        })
      })
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