# VSCode Warpscript Extension

Warpscript language support

[![Apache License](https://img.shields.io/badge/license-Apache%202.0-orange.svg?style=flat-square)](http://www.apache.org/licenses/LICENSE-2.0)
[![vsmarketplacebadge](https://vsmarketplacebadge.apphb.com/version/xavmarin.warpscript-language.svg)](https://marketplace.visualstudio.com/items?itemName=xavmarin.warpscript-language)

More details on [warp10.io](http://www.warp10.io)

## Features

- Syntax highlighting
- Code completion
- Remote execution ( command ctrl+shif+p > "Run warpscript" or ctrl+alt+e )
- Hover definition
- Workspace macros ( @workspace/relative/path/to/macro/file the linked file containing a macro )
- Clickable links to navigate between workspace macros 
- Snippets
  - macro
  - mapper 
  - bucketize
  - reduce
  - filter
  - apply
- Embedded Quantum Dataviz
- Embedded base 64 image viewer ( visible only if returned JSON contains at least one base64 image )
- Warpscript execution history in output window using the format (files are clickable):
  - [EXEC_START_DATE] file:///os_temp_dir/executed_warpscript.mc2 => file:///os_temp_dir/result.json exec_time fetched_data op_count main_filename.mc2
  - [EXEC_START_DATE] ERROR /path/to/script/in/error.mc2:error_line reason_of_failure
- WarpScript and resulting JSON are sent gzipped between the client and the server

## How to run 

```bash
yarn install
bower install
npm run compile
```
