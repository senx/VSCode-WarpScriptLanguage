# VSCode WarpScript Extension

WarpScript language support

[![Apache License](https://img.shields.io/badge/license-Apache%202.0-orange.svg?style=flat-square)](http://www.apache.org/licenses/LICENSE-2.0)
[![vsmarketplacebadge](https://vsmarketplacebadge.apphb.com/version/senx.warpscript-language.svg)](https://marketplace.visualstudio.com/items?itemName=senx.warpscript-language)

More details on [warp10.io](https://www.warp10.io)

## Features

- Syntax highlighting
- Code completion
- Remote execution (command Ctrl+Shift+P > "Run WarpScript" or Ctrl+Alt+E)
- Remote execution for code selected (command Ctrl+Shift+P > "Run WarpScript on selection" or Ctrl+Alt+A)
- Hover definition
- Workspace macros (@workspace/relative/path/to/macro/file the linked file containing a macro)
- Clickable links to navigate between workspace macros
- Snippets
  - macro
  - mapper
  - bucketize
  - reduce
  - filter
  - apply
- Embedded Quantum Dataviz
- Embedded base 64 image viewer (visible only if returned JSON contains at least one base64 image)
- WarpScript execution history in output window using the format (files are clickable):
  - [EXEC_START_DATE] file:///os_temp_dir/executed_warpscript.mc2 => file:///os_temp_dir/result.json exec_time fetched_data op_count main_filename.mc2 endpoint
  - [EXEC_START_DATE] ERROR /path/to/script/in/error.mc2:error_line reason_of_failure
- WarpScript and resulting JSON are sent gzipped between the client and the server


## Tips

- To slow down autocompletion, you can use VSCode built in configuration `editor.quickSuggestionsDelay`
- `// @endpoint http://xxx/api/v0/exec` at the beginning of the script change the remote execution endpoint
- `// @localmacrosubstitution false` at the beginning of the script deactivate the local macro substitution
- In your settings.json you can add `"proxy.pac": "/path/to/your/proxy.pac"` for this extension to use proxy.pac rules to connect directly or through SOCKS proxies depending on the selected endpoint.

## Graph interactions

- Alt + Mouse wheel : Zoom
- Click + Drag : Select to zoom
- Shift + Click : Pan
- Double Click : Restore zoom

## How to run

```bash
yarn install
bower install
npm run compile
```
