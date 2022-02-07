import { HoverProvider, Hover, TextDocument, CancellationToken, Position, MarkdownString } from 'vscode';
import { specialCommentCommands } from '../../warpScriptParser';
import WarpScriptParser from '../../warpScriptParser';
import * as vscode from 'vscode';
import * as request from 'request';
import { SocksProxyAgent } from 'socks-proxy-agent';
import * as ProxyAgent from 'proxy-agent';
import * as pac from 'pac-resolver';
import * as  dns from 'dns';
import { promisify } from 'util';

let lookupAsync: any;
if(!!dns.lookup) {
  lookupAsync = promisify(dns.lookup);
}
/**
 * Parameters needed to generate doc locally with studio
 */
export interface docGenerationParams { macroName: string; wfRepos: string[], endpoint: string }

export abstract class W10HoverProvider  implements HoverProvider {
    abstract provideHover(document: TextDocument, position: Position, _token: CancellationToken): Hover | undefined | Promise<Hover>;
    abstract getReference(): any;

    protected getHover(document: TextDocument, position: Position, _token: CancellationToken, lang: string, pattern: RegExp): Hover | undefined | Promise<Hover> {
        let wordRange = document.getWordRangeAtPosition(position,pattern);
        if (!wordRange) {
          return undefined;
        }
        let name = document.getText(wordRange);
        var entry = this.getReference().globalfunctions[name];
        if (entry && entry.description) {
          let signature = (entry.signature || '');
          let contents: MarkdownString = new MarkdownString().appendMarkdown(`### ${name}\n`)
            .appendText(`Since : ${entry.since}\n\n`)
            .appendMarkdown(`\n\n[Online documentation](https://www.warp10.io/doc/${entry.OPB64name})\n\n`)
            .appendCodeblock(signature, lang)
            .appendMarkdown(entry.description.replace(/(\/doc\/\w+)/g, (x: string) => `https://www.warp10.io${x}`));
          return new Hover(contents, wordRange);
        }
    
            /**
             * Deals with internal VSCode documentation
             * This part could not be in wsGlobals
             */
        let otherKeywordsDoc = JSON.parse(`{
                "@localmacrosubstitution": {
                    "sig": "@localmacrosubstitution true|false",
                    "help": "When false, deactivate the inline macro substitution done by VSCode Warpscript plugin, including _include macro:_ instructions. "
                },
                "@endpoint": {
                    "sig": "@endpoint URL:STRING",
                    "help": "Override the _warpscript.Warp10URL_ settings in VSCode. Typical Warp 10 URL is http://127.0.0.1/api/v0/exec"
          },
                "@preview": {
                    "sig": "@preview none|gts|image",
                    "help": "When undefined, GTS preview and Images Tabs are opened in the background. Set to none for no preview at all. Set to gts to focus on GTS Preview. Set to image to focus on the Images tab."
          },
                "@timeunit": {
                    "sig": "@timeunit us|ms|ns",
                    "help": "Change the time unit for GTS Preview. It could be us, ms, ns.  Usefull if you use a Warp 10 platform with a nanosecond or millisecond precision instead of default settings."
          },
          "@include": {
              "sig": "@include macro:macroPath",
              "help": "When the argument starts with _macro:_ Force inclusion of the specified local macro in the script before execution. Allow to execute dynamic calls such as \`'macro' 'Path' + RUN\`.  Macros called with \`@macroPath\` are automatically substituted when found in the current project scope. A link is added to the path to check easily what will be included."
          }      
            }`);
    
        let help = otherKeywordsDoc[name];
        if (help) {
          let contents: MarkdownString[] = ['### ' + name, { language: lang, value: help["sig"] }, help["help"]];
          return new Hover(contents, wordRange);
        }
    
        /**
         * Deals with macro documentation. A bit tricky, we need to execute the macro on the choosen endpoint with 
         * their warpfleet repos, if any. 
         * 
         * We also consider that macro without path, like @name, are local (not on the endpoint)
         */
    
        if (name.startsWith('@') && name.indexOf('/') > 0) {
          // find the endpoint
          let commentsCommands: specialCommentCommands = WarpScriptParser.extractSpecialComments(document.getText());
          let endpointURL = commentsCommands.endpoint || vscode.workspace.getConfiguration('warpscript', null).get('Warp10URL');
    
          // find the repos, if any (added with WF.ADDREPO). 
          let repos: string[] = [];
          let statements: string[] = WarpScriptParser.parseWarpScriptStatements(document.getText(), _token);

          // TODO: adapt to FLoWS
          statements.forEach((st, i) => {
            if (st == "WF.ADDREPO" && i > 0) {
              let previousstatement = statements[i - 1];
              if ((previousstatement.startsWith('"') && previousstatement.endsWith('"')) || (previousstatement.startsWith("'") && previousstatement.endsWith("'"))) {
                //this is a valid string.
                repos.push(previousstatement.substring(1, previousstatement.length - 1));
              }
            }
          })
          // console.log("WarpFleet repositories added:", repos, "endpoint:", endpointURL);
    
          // forge a WarpScript to ask for macro documentation
          let ws: string = 'INFOMODE\n'
          repos.forEach((r) => ws += '"' + r + '" WF.ADDREPO\n')
          ws += name;
          // console.log("warpscript to send:", ws);
    
          // do the request and return a promise of hover
          return new Promise(async (resolve) => {
    
            var request_options: request.Options = {
              headers: {
                'Content-Type': 'text/plain; charset=UTF-8'
              },
              method: "POST",
              url: endpointURL,
              timeout: 10000, // 10s
              body: ws,
              rejectUnauthorized: false
            }
    
            let proxy_pac: string = vscode.workspace.getConfiguration().get('warpscript.ProxyPac');
            let proxy_directUrl: string = vscode.workspace.getConfiguration().get('warpscript.ProxyURL');
    
            // If a local proxy.pac is define, use it
            if (proxy_pac !== "") {
              // so simple... if only it was supporting socks5. Ends up with an error for SOCKS5 lines.
              // (request_options as any).agent = new ProxyAgent("pac+" + proxy_pac);
    
              let proxy_pac_resp: string = 'DIRECT'; // Fallback
              try {
                let proxy_pac_text: vscode.TextDocument = await vscode.workspace.openTextDocument(proxy_pac);
                let FindProxyForURL = pac(proxy_pac_text.getText());
                proxy_pac_resp = await FindProxyForURL(endpointURL);
              } catch (e) {
                console.log(e);
              }
    
              // Only handle one proxy for now
              let proxy: string = proxy_pac_resp.split(';')[0];
              let proxy_split: string[] = proxy.split(' ');
    
              // If a proxy is defined, make sure it is specified as an IP because SocksProxyAgent does not DNS resolve
              if (1 < proxy_split.length) {
                let host_port = proxy_split[1].split(':');
                if(!!lookupAsync) {
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
    
            //console.log(request_options)
    
            request.post(request_options, async (error: any, response: any, body: string) => {
              if (error) { // error is set if server is unreachable
                //console.log("server unreachable");
                let contents: MarkdownString = new MarkdownString().appendMarkdown('### Error \n\n Unable to find help for this macro on server : ' + endpointURL + ' (server unreachable in 10 seconds)');
                resolve(new Hover(contents, wordRange));
              } else if (response.statusCode >= 400 && response.statusCode !== 500) { // manage non 200 answers here
                //console.log("server error " + response.statusCode);
                let contents: MarkdownString = new MarkdownString().appendMarkdown('### Error \n\n Unable to find help for this macro on server : ' + endpointURL + '\n\nserver replied ' + response.statusCode + (String)(response.body).slice(0, 1000));
                resolve(new Hover(contents, wordRange));
              } else { //manage success and other errors here.
                //console.log(error, response, body)
                if (response.headers['x-warp10-error-message']) {
                  let contents: MarkdownString = new MarkdownString().appendMarkdown('### Error \n\n This macro may not exist on server ' + endpointURL + '\n\nserver replied ' + response.headers['x-warp10-error-message']);
                  resolve(new Hover(contents, wordRange));
                }
                if (!response.headers['content-type'] || "application/json" === response.headers['content-type']) {
                  let doc = JSON.parse(body);
                  // console.log("found doc for macro " + name, doc);
                  // parse the json... that may contains lots of holes.
                  if (doc.length == 0) {
                    let contents: MarkdownString = new MarkdownString().appendMarkdown(`### ${name}\n`)
                      .appendCodeblock('signature is not documented', 'warpscript')
                      .appendMarkdown('macro documentation is empty. look at macro documentation [here](https://www.warp10.io/doc/INFO), and try the macro snippet in VSCode to get a documented macro skeleton.');
                    resolve(new Hover(contents, wordRange));
                  } else {
                    let onlineDocGenerationParams: docGenerationParams = { endpoint: endpointURL, macroName: name, wfRepos: repos };
                    let contents: MarkdownString = new MarkdownString().appendMarkdown(`### ${name}\n`)
                      .appendMarkdown(`\n\n[Online documentation](http://studio.senx.io/#/doc/${this.b64encode(JSON.stringify(onlineDocGenerationParams))})\n\n`);
                    if (doc[0]['sig']) {
                      let signature = this.generateSig(doc[0], name);
                      contents.appendCodeblock(signature, 'warpscript');
                    } else {
                      contents.appendCodeblock('signature is not documented', 'warpscript');
                    }
                    if (doc[0]['desc']) {
                      contents.appendMarkdown(doc[0]['desc']);
                    } else {
                      contents.appendMarkdown('desc is empty in macro INFO. look at macro documentation [here](https://www.warp10.io/doc/INFO), and try the macro snippet in VSCode to get a documented macro skeleton.');
                    }
                    resolve(new Hover(contents, wordRange));
                  }
    
                }
              }
            });
          })
        }
        // no hover for this word
        return undefined;
      }
      
      abstract generateSig(fn: any, macroname: string):string;    
    
      protected prepend(source: any, data: any) {
        return data + source;
      }
    
      protected b64encode(s: string) {
        let b: Buffer = Buffer.from(s, 'utf8');
        return b.toString('base64')
      }
}