import { TextDocument, workspace } from "vscode";
import { gzip } from "zlib";
import { sessionName } from '../globals';
import pac from 'pac-resolver';
import { StatusbarUi } from "../statusbarUi";
import dns from 'dns';
import { promisify } from 'util';
import { SocksProxyAgent } from 'socks-proxy-agent';
import ProxyAgent from 'proxy-agent';
import * as request from 'request';

let lookupAsync: any;
if (!!dns?.lookup) {
  lookupAsync = promisify(dns.lookup);
}

export class Requester {

  public static send(url: string, ws: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const useGZIP: boolean = workspace.getConfiguration().get('warpscript.useGZIP');
      const timeout: number = workspace.getConfiguration().get('warpscript.http.timeout');
      const proxy_pac: string = workspace.getConfiguration().get('warpscript.ProxyPac');
      const proxy_directUrl: string = workspace.getConfiguration().get('warpscript.ProxyURL');

      gzip(Buffer.from(ws, 'utf8'), async (err, gzipWarpScript) => {
        if (err) {
          console.error(err);
        }

        const request_options: request.Options = {
          headers: {
            'Content-Type': useGZIP ? 'application/gzip' : 'text/plain; charset=UTF-8',
            'Accept': 'application/json',
            'X-Warp10-WarpScriptSession': sessionName,
          },
          method: "POST",
          url,
          gzip: useGZIP,
          timeout,
          body: useGZIP ? gzipWarpScript : ws,
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
            proxy_pac_resp = await FindProxyForURL(url);
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
        request.post(request_options, (error: any, response: any, _body: string) => {
          if (error) {
            // error is set if server is unreachable or if the request is aborted
            console.error(error);
            if (error.aborted) {
              reject({ message: 'Aborted' });
            } else {
              reject({ message: `Cannot find or reach server, check your Warp 10 server endpoint: ${error.message}` });
            }
          } else if (response.statusCode == 301) {
            reject({ message: `Check your Warp 10 server endpoint ("${response.request.uri.href}), you may have forgotten the api/v0/exec in the URL` });
          } else if (response.statusCode != 200 && response.statusCode != 500) {
            // manage non 200 answers here
            reject({ message: `Error, server answered code ${response.statusCode}: ${response.body.toString().slice(0, 1000)}` });
          } else if (response.statusCode == 500 && !response.headers['x-warp10-error-message']) {
            // received a 500 error without any x-warp10-error-message. Could also be a endpoint error.
            reject({ message: `Error, error 500 without any error. Are you sure you are using an exec endpoint ? Endpoint: ${response.request.uri.href}: ${response.body.toString().slice(0, 1000)}` });
          } else if (response.headers['x-warp10-error-message']) {
            let line = parseInt(response.headers['x-warp10-error-line'])
            // Check if error message contains infos from LINEON
            let lineonPattern = /\[Line #(\d+)\]/g;  // Captures the lines sections name
            let lineonMatch: RegExpMatchArray | null;
            while ((lineonMatch = lineonPattern.exec(response.headers['x-warp10-error-message']))) {
              line = parseInt(lineonMatch[1]);
            }
            reject({ message: response.headers['x-warp10-error-message'], line });
          } else {
            resolve(response.body);
          }
        });
      });
    });
  }
}