import {
  DataGrid,
  allComponents,
  provideVSCodeDesignSystem
} from "@vscode/webview-ui-toolkit";

provideVSCodeDesignSystem().register(allComponents);


const vscode = acquireVsCodeApi();
let code = '';
let totalTime = 0;

window.addEventListener('message', event => {
  //document.getElementById('debug').innerHTML = JSON.stringify(event.data);
  const message = event.data; // The JSON data our extension sent
  code = message.ws;
  const numberofLines = code.split('\n').length;

  totalTime = (message.result[0] ?? [])[5];
  const profile = message.result.filter((p: any[]) => p[4] > 0)
    .filter((p: any[]) => p[3][0] !== 'm')
    .filter((p: any[]) => p[0] < numberofLines + 2 && p[0] >= 2);
  (document.getElementById('profile') as DataGrid).rowsData = profile.map((p: any[]) => ({
    Name: getName(p),
   // Line: p[0],
   // Start: p[1],
   // End: p[2],
    Calls: p[4],
    'Total time': p[5] + ' ns',
    'Time per call': (Math.round(getPerCal(p[5], p[4]) * 100) / 100) + ' ns'
  }));

  document.getElementById('profile').addEventListener('mouseout', () => unhighlight());
  setTimeout(() => document.getElementById('profile').querySelectorAll('vscode-data-grid-row')
    .forEach((cn: Element, i) => {  // pray that it is ordered. seems to be.
      if (i > 0) {
        cn.addEventListener('mouseover', () => highlight(cn, profile[i-1])); // number 0 is the column title !
      }
    }), 500);
});

function unhighlight() {
  vscode.postMessage({ command: 'unhighlight' });
}

function highlight(tr: Element, p: any) {
  const f = tr.querySelectorAll('vscode-data-grid-cell')[0].textContent.trim();
  console.log({ command: 'highlight', text: f, profile: p });
  vscode.postMessage({ command: 'highlight', text: f, profile: p });
}

function getName(p: any[]) {
  switch (p[3][0]) {
    case 'm':
      return 'Total';
    case 'M':
      const comments = code.split('\n')[p[0] - 2].split('#');
      if (comments.length > 1) {
        return `Macro (${comments[1].trim()})`
      } else {
        return 'Macro';
      }
    default:
      const line = code.split('\n')[p[0] - 2];
      if (!!line) {
        return line.slice(p[1], p[2] + 1);
      } else {
        return p.join('-');
      }
  }
}

function getPerCal(total: any, count: any) {
  return count > 0 ? parseFloat(total) / parseFloat(count) : total;
}