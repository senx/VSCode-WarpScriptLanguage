const fs = require("fs");
const _ = require("lodash");
const request = require("request");
const zlib = require("zlib");
const Warp10URL = "http://127.0.0.1:8080/api/v0/exec";
let executedWarpScript = `
INFOMODE LINEON
@doc/index
'doc' STORE 
[] 'doclist' STORE $doc
<% 'macro' STORE [ 
    <%  '@doc/' $macro + EVAL %>
    <%   %>
    <% 
        <% 
        DUP
             'sig' GET
                <% DROP <% DROP <% DROP DUP TYPEOF 'java.util.HashSet' ==  <% SET-> LIST-> '|' SWAP JOIN %> IFT %> LMAP %> LMAP %> LMAP 
        %>
        <%  
        '@doc/' $macro + DUP SECTION EVAL 
        %>
        <%   %>
        TRY
        'sig' PUT
        $macro '_id' PUT
    %> 
    TRY  ] $doclist APPEND 'doclist' STORE 
%> FOREACH
$doclist
`;

zlib.gzip(executedWarpScript, function(err, gzipWarpScript) {
  if (err) {
    console.error(err);
  }
  request.post(
    {
      headers: {
        "Content-Type": "application/gzip",
        "Transfer-Encoding": "chunked"
      },
      url: Warp10URL,
      gzip: true,
      timeout: 3600000, // 1 hour
      body: gzipWarpScript
    },
    async (error, response, body) => {
      if (error) {
        vscode.window.showErrorMessage(error.message);
        console.error(error);
        return e(error);
      } else {
        let functions = [];
        let funcmap = {};
        let monarch = {
          keywords: [],
          constants: [],
          functions: [],
          control: [],
          operators: [
            "&",
            "^",
            "|",
            ">>>",
            "~",
            "<<",
            ">>",
            "!=",
            "<",
            ">",
            "~=",
            "<=",
            "==",
            ">=",
            "%",
            "*",
            "+",
            "-",
            "/",
            "**",
            "!",
            "&&",
            "AND",
            "OR",
            "NOT",
            "|",
            "&",
            "^",
            "|",
            ">>>",
            "~",
            "<<",
            ">>"
          ],
          escapes:
            "\\\\(?:[abfnrtv\\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})",
          tokenizer: {
            root: [
              ["\\@[A-Za-z0-9._\\/]+", "variable"],
              ["\\$[A-Za-z0-9._\\/]+", "variable"],
              ["true|false", "number"],
              [
                "[A-Za-z_][.\\w$]*",
                {
                  cases: {
                    "@constants": "regexp",
                    "@keywords": "keyword",
                    "@functions": "type",
                    "@control": "metatag",
                    "@default": "identifier"
                  }
                }
              ],
              ["[{}()[\\]]", "@brackets"],
              ["\\d*\\.\\d+([eE][\\-+]?\\d+)?[fFdD]?", "number.float"],
              ["0[xX][0-9a-fA-F_]*[0-9a-fA-F][Ll]?", "number.hex"],
              ["0[0-7_]*[0-7][Ll]?", "number.octal"],
              ["0[bB][0-1_]*[0-1][Ll]?", "number.binary"],
              ["\\d+[lL]?", "number"],
              { include: "@whitespace" },
              ['"([^"\\\\]|\\\\.)*$', "string.invalid"],
              ['"', "string", "@string"],
              ["'([^'\\\\]|\\\\.)*$", "string.invalid"],
              ["'", "string", "@string2"],

              ["<'", "string", "@string3"]
            ],
            whitespace: [
              ["[ \\t\\r\\n]+", "white"],
              ["\\/\\*", "comment", "@comment"],
              ["\\/\\/.*$", "comment"]
            ],
            comment: [
              ["[^\\/*]+", "comment"],
              ["\\/\\*", "comment.invalid"],
              ["\\*/", "comment", "@pop"],
              ["[\\/*]", "comment"]
            ],
            string: [
              ['[^\\"]+', "string"],
              ["@escapes", "string.escape"],
              ["\\.", "string.escape.invalid"],
              ['"', "string", "@pop"]
            ],
            string2: [
              ["[^\\']+", "string"],
              ["@escapes", "string.escape"],
              ["\\.", "string.escape.invalid"],
              ["'", "string", "@pop"]
            ],
            string3: [["[^\\(<')]+", "string"], ["'>", "string", "@pop"]]
          }
        };

        let syntax = {
          $schema:
            "https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json",
          name: "WarpScript",
          patterns: [],
          repository: {
            comments: {
              patterns: [
                {
                  captures: { "0": { name: "punctuation.definition.comment" } },
                  match: "/\\*\\*/",
                  name: "comment.block.empty"
                },
                { include: "text.html.javadoc" },
                { include: "#comments-inline" }
              ]
            },
            "comments-inline": {
              patterns: [
                {
                  begin: "/\\*",
                  captures: { "0": { name: "punctuation.definition.comment" } },
                  end: "(\\s)*\\*/",
                  name: "comment.block"
                },
                {
                  begin: "(^[\\s\\t]+)?(?=//)",
                  beginCaptures: {
                    "1": { name: "punctuation.whitespace.comment.leading" }
                  },
                  end: "(?!\\G)",
                  patterns: [
                    {
                      begin: "(\\s)*//",
                      beginCaptures: {
                        "0": { name: "punctuation.definition.comment" }
                      },
                      end: "\\n",
                      name: "comment.line.double-slash"
                    }
                  ]
                },
                {
                  begin: "(^[\\s\\t]+)?(?=#)",
                  beginCaptures: {
                    "1": { name: "punctuation.whitespace.comment.leading" }
                  },
                  end: "(?!\\G)",
                  patterns: [
                    {
                      begin: "(\\s)*#",
                      beginCaptures: {
                        "0": { name: "punctuation.definition.comment" }
                      },
                      end: "\\n",
                      name: "comment.line.double-slash"
                    }
                  ]
                }
              ]
            },
            variables: {
              patterns: [{ match: "\\$([^ ]+)", name: "variable" }]
            },
            macros: { patterns: [{ match: "\\@([^ ]+)", name: "variable" }] },
            numbers: {
              patterns: [
                { match: "(?<!\\S)((-)?[0-9.])+\\b", name: "constant.numeric" },
                {
                  match: "(?<!\\S)(true|false)(?!\\S)",
                  name: "constant.numeric"
                },
                {
                  match: "(?<!\\S)0x[0-9ABCDEFabcdef]+\\b",
                  name: "constant.numeric"
                }
              ]
            },
            types: {
              patterns: [
                {
                  match:
                    "(<LIST(<.+>)?>|<STRING>|<GTS>|<BUCKETIZER>|<MAPPER>|<FILTER>|<REDUCER>|<LONG>|<DOUBLE>|<ANY>|<NUMBER>|<MAP>|<VECTOR>|<BYTES>|<BITSET>)(?!\\S)",
                  name: "entity.name.type"
                }
              ]
            },
            string1: {
              name: "string.quoted.double",
              begin: '"',
              end: '"',
              patterns: [{ name: "constant.character.escape", match: "\\\\." }]
            },
            string2: {
              name: "string.quoted.double",
              begin: "'",
              end: "'",
              patterns: [{ name: "constant.character.escape", match: "\\\\." }]
            },
            string3: {
              name: "string.quoted.double",
              begin: "^\\s*<'",
              end: "'>",
              patterns: [{ name: "constant.character.escape", match: "\\\\." }]
            },
            operator: {
              patterns: [
                {
                  match: "(?<!\\S)(!=|<|>|~=|<=|==|>=)(?!\\S)",
                  name: "keyword.operator.comparison"
                },
                {
                  match: "(?<!\\S)(%|\\*|\\+|-|/|\\*\\*)(?!\\S)",
                  name: "keyword.operator.arithmetic"
                },
                {
                  match: "(?<!\\S)(!|&&|AND|OR|NOT|\\|\\|)(?!\\S)",
                  name: "keyword.operator.logical"
                },
                {
                  match: "(?<!\\S)(&|\\^|\\||>>>|~|<<|>>)(?!\\S)",
                  name: "keyword.operator.bitwise"
                }
              ]
            }
          },
          scopeName: "source.warpscript"
        };
        let tags = {};
        JSON.parse(body)[0].forEach(fn => {
          let sig = generateSig(fn);
          sig = sig.substr(0, sig.lastIndexOf("\n"));
          functions.push({
            name: fn.name,
            detail: sig,
            documentation: fn.desc + "\n\n" + getParams(fn.params),
            tags: fn.tags,
            since: fn.since
          });
          funcmap[fn.name] = {
            description: fn.desc + "\n\n" + getParams(fn.params),
            signature: sig,
            tags: fn.tags,
            since: fn.since
          };
          fn.tags.forEach(t => {
            if (!tags[t]) {
              tags[t] = [];
            }
            tags[t].push(fn.name);
          });
        });

        [
          { include: "#comments" },
          { include: "#variables" },
          { include: "#macros" },
          { include: "#numbers" },
          { include: "#string1" },
          { include: "#string2" },
          { include: "#string3" },
          { include: "#types" },
          { include: "#operator" }
        ].forEach(s => {
          syntax.patterns.push(s);
        });

        monarch.keywords = monarch.keywords.concat(
          "MAP|FILTER|APPLY|REDUCE|BUCKETIZE".split("|")
        );
        syntax.repository["frameworks"] = {
          patterns: [
            {
              match: "(?<!\\S)(MAP|FILTER|APPLY|REDUCE|BUCKETIZE)(?!\\S)",
              name: "entity.name.function"
            }
          ]
        };

        Object.keys(tags).forEach(tag => {
          syntax.patterns.push({ include: "#" + tag });
          syntax.repository[tag] = { patterns: [] };

          switch (tag) {
            case "control":
              syntax.repository[tag].patterns.push({
                match:
                  "(?<!\\S)(" +
                  tags[tag]
                    .map(f => {
                      return f.replace(
                        /(\.|\||\[|\]|\(|\)|\$|\^|\}|\{|\*|\+)/gi,
                        "\\$1"
                      );
                    })
                    .join("|") +
                  ")(?!\\S)",
                name: "keyword.control.default"
              });
              monarch.control = monarch.control.concat(tags[tag]);
              break;
            case "constants":
              syntax.repository[tag].patterns.push({
                match:
                  "(?<!\\S)(" +
                  tags[tag]
                    .map(f => {
                      return f.replace(
                        /(\.|\||\[|\]|\(|\)|\$|\^|\}|\{|\*|\+)/gi,
                        "\\$1"
                      );
                    })
                    .join("|") +
                  ")(?!\\S)",
                name: "constant.language"
              });

              monarch.constants = monarch.constants.concat(tags[tag]);
              break;
            case "reducer":
              syntax.repository[tag].patterns.push({
                match:
                  "(?<!\\S)(" +
                  tags[tag].filter(i => i !== "REDUCE").join("|") +
                  ")(?!\\S)",
                name: "support.function"
              });
              monarch.functions = monarch.functions.concat(tags[tag]);
              break;
            case "mapper":
              syntax.repository[tag].patterns.push({
                match:
                  "(?<!\\S)(" +
                  tags[tag].filter(i => i !== "MAP").join("|") +
                  ")(?!\\S)",
                name: "support.function"
              });
              monarch.functions = monarch.functions.concat(tags[tag]);
              break;
            case "bucketizer":
              syntax.repository[tag].patterns.push({
                match:
                  "(?<!\\S)(" +
                  tags[tag].filter(i => i !== "BUCKETIZE").join("|") +
                  ")(?!\\S)",
                name: "support.function"
              });
              monarch.functions = monarch.functions.concat(tags[tag]);
              break;
            case "filter":
              syntax.repository[tag].patterns.push({
                match:
                  "(?<!\\S)(" +
                  tags[tag].filter(i => i !== "FILTER").join("|") +
                  ")(?!\\S)",
                name: "support.function"
              });
              monarch.functions = monarch.functions.concat(tags[tag]);
              break;
            default:
              syntax.repository[tag].patterns.push({
                match:
                  "(?<!\\S)(" +
                  tags[tag]
                    .map(f => {
                      return f.replace(
                        /(\.|\||\[|\]|\(|\)|\$|\^|\}|\{|\*|\+)/gi,
                        "\\$1"
                      );
                    })
                    .join("|") +
                  ")(?!\\S)",
                name: "keyword"
              });
              monarch.keywords = monarch.keywords.concat(tags[tag]);
              break;
          }
        });

        fs.writeFileSync(
          "src/ref.ts",
          `export class WarpScript {
  static reference:any[] = ${JSON.stringify(functions)};
}
      `
        );

        fs.writeFileSync(
          "monarch.ts",
          `export class Monarch {
        public static rules:any =  ${JSON.stringify(monarch, null, 4)};
      }`
        );

        syntax.repository.operator.patterns.push({
          match: "\\[|\\{|\\}|\\(|\\)|\\[|\\]|\\]",
          name: "punctuation.definition.bracket"
        });
        fs.writeFileSync(
          "syntaxes/warpscript.tmLanguage.json",
          JSON.stringify(syntax)
        );
        fs.writeFileSync(
          "src/wsGlobals.ts",
          `export interface IEntry { description?: string; signature?: string; tags?: string[], since: string}
export interface IEntries { [name: string]: IEntry; }            
export var globalfunctions: IEntries = ${JSON.stringify(funcmap)};
            `
        );
      }
    }
  );
});

function getParams(p) {
  let params = "";
  _.forIn(p, (value, key) => {
    params += "@param `" + key + "` " + value + "\n\n";
  });
  return params;
}

function generateSig(fn) {
  let sig = "";
  fn.sig.forEach((sigItem, sigIndex) => {
    sig +=
      populateInput(sigItem[0]) +
      " " +
      fn.name +
      " " +
      populateOutput(sigItem[1]) +
      "\n";
  });
  return sig;
}

function prepend(source, data) {
  return data + source;
}

function populateInput(sigItem) {
  let sigArea = "";
  sigItem.forEach((s, i) => {
    if (typeof s === "string" && s.indexOf("|") > 0) {
      var p = "(";
      s.split("|").forEach(function(i) {
        p += i.split(":")[0] + "|";
      });
      p = p.substring(0, p.length - 1) + ")";
      sigArea = prepend(sigArea, p + " (" + i.split(":")[1] + ") ");
    } else {
      if (_.isPlainObject(s)) {
        sigArea = prepend(sigArea, "} ");
        _.forIn(s, (key, value) => {
          sigArea = prepend(
            sigArea,
            value.split(":")[1] + key + "' " + value.split(":")[0]
          );
        });
        sigArea = prepend(sigArea, "{\n\n");
      } else {
        if (_.isArray(s)) {
          sigArea = prepend(sigArea, "] ");
          s.forEach((value, i) => {
            sigArea = prepend(
              sigArea,
              value.split(":")[0] + "<" + value.split(":")[1] + "> "
            );
          });
          sigArea = prepend(sigArea, "[ ");
        } else {
          sigArea = prepend(
            sigArea,
            s.split(":")[0] + "<" + s.split(":")[1] + "> "
          );
        }
      }
    }
  });
  return sigArea;
}

function populateOutput(sigItem) {
  let sigArea = "";
  sigItem.reverse().forEach((s, i) => {
    if (typeof s === "string" && s.indexOf("|") > 0) {
      var p = "(";
      s.split("|").forEach(i => {
        p += i.split(":")[0] + "|";
      });
      p = p.substring(0, p.length - 1) + ")";
      sigArea += p + "<" + i.split(":")[1] + "> ";
    } else {
      if (_.isPlainObject(s)) {
        sigArea += " {";
        s.forEach((key, value) => {
          sigArea +=
            " " +
            key +
            "' " +
            value.split(":")[0] +
            "<" +
            value.split(":")[1] +
            "> \n\n";
        });
        sigArea += " }\n\n";
      } else {
        if (_.isArray(s)) {
          sigArea += " [ ";
          s.forEach((value, i) => {
            sigArea +=
              " " + value.split(":")[0] + "<" + value.split(":")[1] + "> ";
          });
          sigArea += " ]";
        } else {
          sigArea += " " + s.split(":")[0] + "<" + s.split(":")[1] + ">";
        }
      }
    }
  });
  return sigArea;
}
