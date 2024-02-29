import {
  DataGrid,
  allComponents,
  provideVSCodeDesignSystem
} from "@vscode/webview-ui-toolkit";

// In order to use all the Webview UI Toolkit web components they
// must be registered with the browser (i.e. webview) using the
// syntax below.
provideVSCodeDesignSystem().register(allComponents);


const vscode = acquireVsCodeApi();
let code = '';

function getFunction(p: any[]) {
  const line = code.split('\n')[p[0] - 3];
  if (!!line) {
    return line.slice(p[1], p[2] + 1);
  } else {
    return p.join('-');
  }
}

function getPerCal(total: any, count: any) {
  return parseFloat(total) / parseFloat(count);
}
// Just like a regular webpage we need to wait for the webview
// DOM to load before we can reference any of the HTML elements
// or toolkit components
window.addEventListener("load", main);
window.addEventListener('message', event => {
  const message = event.data; // The JSON data our extension sent
  code = message.ws;
  //  (document.getElementById('res') as HTMLPreElement).innerHTML = JSON.stringify(message.result, undefined, 2);
  const profile = message.result.filter((p: any[]) => p[0] !== 3);


  (document.getElementById('profile') as DataGrid).rowsData = profile.map((p: any[]) => {
    return { Name: p[3] === 'M' ? 'macro' : getFunction(p), Calls: p[4], 'Total time': p[5] + ' ns', 'Time per call': getPerCal(p[5], p[4]) + ' ns' }
  });

  document.getElementById('profile').addEventListener('mouseout', () => unhighlight());
  setTimeout(() => document.getElementById('profile').querySelectorAll('vscode-data-grid-row').forEach((cn: Element, i) => {
    if (i > 0) {
      cn.addEventListener('mouseover', () => highlight(cn, profile[i - 1]));
    }
  }), 500);
});

function unhighlight() {
  vscode.postMessage({command: 'unhighlight'});
}

function highlight(tr: Element, p: any) {
  const f = tr.querySelectorAll('vscode-data-grid-cell')[0].textContent.trim();
  vscode.postMessage({command: 'highlight',text: f, profile: p});
}

function main() {

}