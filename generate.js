const fs = require('fs');
const _ = require('lodash');
const request = require('request');
const zlib = require("zlib");
const Warp10URL = 'http://127.0.0.1:8080/api/v0/exec';
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

zlib.gzip(executedWarpScript, function (err, gzipWarpScript) {
  if (err) {
    console.error(err);
  }
  request.post({
    headers: { 'Content-Type': 'application/gzip', 'Transfer-Encoding': 'chunked' },
    url: Warp10URL,
    gzip: true,
    timeout: 3600000, // 1 hour
    body: gzipWarpScript
  }, async (error, response, body) => {
    if (error) {
      vscode.window.showErrorMessage(error.message)
      console.error(error)
      return e(error)
    } else {
      let functions = [];
      let funcmap = {};
      let syntax = {
        '$schema': 'https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json',
        name: 'WarpScript',
        patterns: [

        ],
        repository: {
          comments: {
            patterns: [
              { captures: { '0': { name: "punctuation.definition.comment.java" } }, match: "/\\*\\*/", name: "comment.block.empty.java" },
              { include: "text.html.javadoc" },
              { include: "#comments-inline" }
            ]
          },
          'comments-inline': {
            patterns: [
              { begin: "/\\*", captures: { '0': { name: "punctuation.definition.comment.java" } }, end: "(\\s)*\\*/", name: "comment.block.java" },
              {
                begin: "(^[\\s\\t]+)?(?=//)", beginCaptures: { "1": { name: "punctuation.whitespace.comment.leading.java" } }, end: "(?!\\G)", patterns: [
                  { begin: "(\\s)*//", beginCaptures: { "0": { name: "punctuation.definition.comment.java" } }, end: "\\n", name: "comment.line.double-slash.java" }
                ]
              }
            ]
          },
          variables: { patterns: [{ match: "\\$([A-Za-z0-9._]+)", name: "constant.other.reference.link.warpscript" }] },
          macros: { patterns: [{ match: "\\@([A-Za-z0-9._]+)", name: "constant.other.reference.link.warpscript" }] },
          numbers: { patterns: [{ match: "(?<!\\S)(-)?[0-9.]+\\b", name: "constant.numeric.warpscript" }, { match: "(?<!\\S)0x[0-9ABCDEFabcdef]+\\b", name: "constant.numeric.warpscript" }] },
          types: { patterns: [{ match: "(<LIST(<.+>)?>|<STRING>|<GTS>|<BUCKETIZER>|<MAPPER>|<FILTER>|<REDUCER>|<LONG>|<DOUBLE>|<ANY>|<NUMBER>|<MAP>|<VECTOR>|<BYTES>|<BITSET>)(?!\\S)", name: "entity.name.type" }] },
          string1: { name: "string.quoted.double.warpscript", begin: '"', end: '"', patterns: [{ name: "constant.character.escape.warpscript", match: "\\\\." }] },
          string2: { name: "string.quoted.double.warpscript", begin: "'", end: "'", patterns: [{ name: "constant.character.escape.warpscript", match: "\\\\." }] },
          string3: { name: "string.quoted.double.warpscript", begin: "^\\s*<'", end: "'>", patterns: [{ name: "constant.character.escape.warpscript", match: "\\\\." }] },
          operator: {
            patterns: [
              { match: "(?<!\\S)(!=|<|>|~=|<=|==|>=)(?!\\S)", name: "keyword.operator.comparison.warpscript" },
              { match: "(?<!\\S)(%|\\*|\\+|-|/|\\*\\*)(?!\\S)", name: "keyword.operator.arithmetic.warpscript" },
              { match: "(?<!\\S)(!|&&|AND|OR|NOT|\\|\\|)(?!\\S)", name: "keyword.operator.logical.warpscript" },
              { match: "(?<!\\S)(&|\\^|\\||>>>|~|<<|>>)(?!\\S)", name: "keyword.operator.bitwise.warpscript" }
            ]
          },
        },
        scopeName: "source.warpscript"
      }
      let tags = {};
      JSON.parse(body)[0].forEach(fn => {
        let sig = generateSig(fn);
        sig = sig.substr(0, sig.lastIndexOf('\n'));
        functions.push({
          name: fn.name,
          detail: sig,
          documentation: fn.desc + '\n\n' + getParams(fn.params),
          tags: fn.tags
        });
        funcmap[fn.name] = {
          description: fn.desc + '\n\n' + getParams(fn.params),
          signature: sig,
          tags: fn.tags
        }
        fn.tags.forEach(t => {
          if (!tags[t]) {
            tags[t] = [];
          }
          tags[t].push(fn.name.replace(/(\.|\||\[|\]|\(|\)|\$|\^|\}|\{|\*|\+)/gi, '\\$1').replace());
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
        { include: "#operator" }].forEach(s => {
          syntax.patterns.push(s);
        });
      Object.keys(tags).forEach(tag => {
        syntax.patterns.push({ include: '#' + tag });
        syntax.repository[tag] = { patterns: [] };
        syntax.repository['frameworks'] = {
          patterns: [{
            match: '(?<!\\S)(MAP|FILTER|APPLY|REDUCE|BUCKETIZE)(?!\\S)',
            name: 'entity.name.function.warpscript'
          }]
        };
        switch (tag) {
          case 'control':
            syntax.repository[tag].patterns.push({
              match: '(?<!\\S)(' + tags[tag].join('|') + '|true|false)(?!\\S)',
              name: 'keyword.control.warpscript'
            });
            break;
          case 'constants':
            syntax.repository[tag].patterns.push({
              match: '(?<!\\S)(' + tags[tag].join('|') + ')(?!\\S)',
              name: 'constant.language.warpscript'
            });
            break;
          case 'reducer':
            syntax.repository[tag].patterns.push({
              match: '(?<!\\S)(' + tags[tag].filter(i => i !== 'REDUCE').join('|') + ')(?!\\S)',
              name: 'entity.name.typePi'
            });
            break;
          case 'mapper':
            syntax.repository[tag].patterns.push({
              match: '(?<!\\S)(' + tags[tag].filter(i => i !== 'MAP').join('|') + ')(?!\\S)',
              name: 'entity.name.type'
            });
            break;
          case 'bucketize':
            syntax.repository[tag].patterns.push({
              match: '(?<!\\S)(' + tags[tag].filter(i => i !== 'BUCKETIZE').join('|') + ')(?!\\S)',
              name: 'entity.name.type'
            });
            break;
          case 'filter':
            syntax.repository[tag].patterns.push({
              match: '(?<!\\S)(' + tags[tag].filter(i => i !== 'FILTER').join('|') + ')(?!\\S)',
              name: 'entity.name.type'
            });
            break;
          default:
            syntax.repository[tag].patterns.push({
              match: '(?<!\\S)(' + tags[tag].join('|') + ')(?!\\S)',
              name: "entity.name.function.warpscript"
            });
            break;
        }
      });

      fs.writeFileSync('src/ref.ts', `export class WarpScript {
  static reference:any[] = ${JSON.stringify(functions)};
}
      `);
      fs.writeFileSync('syntaxes/warpscript.tmLanguage.json', JSON.stringify(syntax));
      fs.writeFileSync('src/wsGlobals.ts', `export interface IEntry { description?: string; signature?: string; tags?: string[]}
export interface IEntries { [name: string]: IEntry; }            
export var globalfunctions: IEntries = ${JSON.stringify(funcmap)};
            `);

    }
  }
  );
});

function getParams(p) {
  let params = '';
  _.forIn(p, (value, key) => {
    params += '@param `' + key + '` ' + value + '\n\n';
  });
  return params;
}

function generateSig(fn) {
  let sig = '';
  fn.sig.forEach((sigItem, sigIndex) => {
    sig += populateInput(sigItem[0]) + ' ' + fn.name + ' ' + populateOutput(sigItem[1]) + '\n';
  });
  return sig;
}

function prepend(source, data) {
  return data + source;
}

function populateInput(sigItem) {
  let sigArea = '';
  sigItem.forEach((s, i) => {
    if (typeof s === 'string' && s.indexOf('|') > 0) {
      var p = '(';
      s.split('|').forEach(function (i) {
        p += i.split(':')[0] + '|'
      });
      p = p.substring(0, p.length - 1) + ')';
      sigArea = prepend(sigArea, p + ' (' + i.split(':')[1] + ') ');
    } else {
      if (_.isPlainObject(s)) {
        sigArea = prepend(sigArea, '} ');
        _.forIn(s, (key, value) => {
          sigArea = prepend(sigArea, value.split(':')[1] + key + '\' ' + value.split(':')[0]);
        });
        sigArea = prepend(sigArea, '{\n\n');
      } else {
        if (_.isArray(s)) {
          sigArea = prepend(sigArea, '] ');
          s.forEach((value, i) => {
            sigArea = prepend(sigArea, value.split(':')[0] + '<' + value.split(':')[1] + '> ');
          });
          sigArea = prepend(sigArea, '[ ');
        } else {
          sigArea = prepend(sigArea, s.split(':')[0] + '<' + s.split(':')[1] + '> ');
        }
      }
    }
  });
  return sigArea;
}

function populateOutput(sigItem) {
  let sigArea = '';
  sigItem.forEach((s, i) => {
    if (typeof s === 'string' && s.indexOf('|') > 0) {
      var p = '(';
      s.split('|').forEach(i => {
        p += i.split(':')[0] + '|'
      });
      p = p.substring(0, p.length - 1) + ')';
      sigArea += p + '<' + i.split(':')[1] + '> ';
    } else {
      if (_.isPlainObject(s)) {
        sigArea += ' {';
        s.forEach((key, value) => {
          sigArea += ' ' + key + '\' ' + value.split(':')[0] + '<' + value.split(':')[1] + '> \n\n';
        });
        sigArea += ' }\n\n';
      } else {
        if (_.isArray(s)) {
          sigArea += ' [ ';
          s.forEach((value, i) => {
            sigArea += ' ' + value.split(':')[0] + '<' + value.split(':')[1] + '> ';
          });
          sigArea += ' ]';
        } else {
          sigArea += ' ' + s.split(':')[0] + '<' + s.split(':')[1] + '>';
        }
      }
    }
  });
  return sigArea;
}