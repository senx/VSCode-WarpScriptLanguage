// Type definitions for js_beautify v1.5.6
// Project: https://github.com/beautify-web/js-beautify/
// Definitions by: Josh Goldberg <https://github.com/JoshuaKGoldberg/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
/*

  The MIT License (MIT)

  Copyright (c) 2007-2013 Einar Lielmanis and contributors.

  Permission is hereby granted, free of charge, to any person
  obtaining a copy of this software and associated documentation files
  (the "Software"), to deal in the Software without restriction,
  including without limitation the rights to use, copy, modify, merge,
  publish, distribute, sublicense, and/or sell copies of the Software,
  and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
  BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
  ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.

*/

declare var define: any;
declare var exports: any;


declare var js_beautify: {
    (js_source_text: string, options?: {
        "indent_size"?: number;
        "indent_char"?: string;
        "preserve_newlines"?: boolean;
        "max_preserve_newlines"?: number;
        "jslint_happy"?: boolean;
        "brace_style"?: string;
        "space_before_conditional"?: boolean;
        "unescape_strings"?: boolean;
        "wrap_line_length"?: number;
    })
};
