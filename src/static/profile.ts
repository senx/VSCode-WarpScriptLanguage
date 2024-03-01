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
  const message = event.data; // The JSON data our extension sent
  code = message.ws;
  const profile = message.result.filter((p: any[]) => p[4] > 0);
  totalTime = (profile[0] ?? [])[5];
  (document.getElementById('profile') as DataGrid).rowsData = profile.map((p: any[]) => {
    return { Name: getName(p), Calls: p[4], 'Total time': p[5] + ' ns', '% of total time': getPercent(p[5]) + '%', 'Time per call': getPerCal(p[5], p[4]) + ' ns' }
  });

  document.getElementById('profile').addEventListener('mouseout', () => unhighlight());
  setTimeout(() => document.getElementById('profile').querySelectorAll('vscode-data-grid-row').forEach((cn: Element, i) => {
    if (i > 0) {
      cn.addEventListener('mouseover', () => highlight(cn, profile[i - 1]));
    }
  }), 500);
});

function unhighlight() {
  vscode.postMessage({ command: 'unhighlight' });
}

function highlight(tr: Element, p: any) {
  const f = tr.querySelectorAll('vscode-data-grid-cell')[0].textContent.trim();
  vscode.postMessage({ command: 'highlight', text: f, profile: p });
}

function getName(p: any[]) {
  switch (p[3]) {
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



function getPercent(time: any) {
  return Math.round(time / totalTime * 10000) / 100;
}