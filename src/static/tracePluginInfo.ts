import {
  Button,
  allComponents,
  provideVSCodeDesignSystem
} from "@vscode/webview-ui-toolkit";

// In order to use all the Webview UI Toolkit web components they
// must be registered with the browser (i.e. webview) using the
// syntax below.
provideVSCodeDesignSystem().register(allComponents);

// Just like a regular webpage we need to wait for the webview
// DOM to load before we can reference any of the HTML elements
// or toolkit components
window.addEventListener("load", main);

function main() {
  const contact = document.getElementById("contact") as Button;
  const settings = document.getElementById("settings") as Button;
  contact.addEventListener('click', () => acquireVsCodeApi().postMessage({ 'link': 'https://senx.io/contact' }));
  settings.addEventListener('click', () => acquireVsCodeApi().postMessage({ 'action': 'settings' }));
}