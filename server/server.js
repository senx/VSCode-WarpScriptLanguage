/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
// Create a connection for the server. The connection uses Node's IPC as a transport
let connection = vscode_languageserver_1.createConnection(new vscode_languageserver_1.IPCMessageReader(process), new vscode_languageserver_1.IPCMessageWriter(process));
// Create a simple text document manager. The text document manager
// supports full document sync only
let documents = new vscode_languageserver_1.TextDocuments();
// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);
console.log('[server] start "Warpscript"');
// After the server has started the client sends an initialize request. The server receives
// in the passed params the rootPath of the workspace plus the client capabilities.
connection.onInitialize((_params) => {
    connection.console.log('[server] Congratulations, your extension "Warpscript" is now active!');
    return {
        capabilities: {
            // Tell the client that the server works in FULL text document sync mode
            textDocumentSync: documents.syncKind,
            // Tell the client that the server support code complete
            completionProvider: {
                resolveProvider: true
            }
        }
    };
});
let warp10url;
// The settings have changed. Is send on server activation
// as well.
connection.onDidChangeConfiguration((change) => {
    let settings = change.settings;
    warp10url = settings.warpscript.warp10url || "";
    console.log(warp10url);
});
connection.onDidChangeWatchedFiles((_change) => {
    // Monitored files have change in VSCode
    connection.console.log('We received an file change event');
});
// This handler provides the initial list of the completion items.
connection.onCompletion((_textDocumentPosition) => {
    // The pass parameter contains the position of the text document in
    // which code complete got requested. For the example we ignore this
    // info and always provide the same completion items.
    return [{ label: 'DOUBLEEXPONENTIALSMOOTHING',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 1 },
        { label: 'EVERY',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 2 },
        { label: 'EXPM1',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 3 },
        { label: 'FINDSETS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 4 },
        { label: 'FUSE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 5 },
        { label: 'GROOVY',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 6 },
        { label: 'HYPOT',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 7 },
        { label: 'IMMUTABLE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 8 },
        { label: 'JS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 9 },
        { label: 'LOG1P',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 10 },
        { label: 'LUA',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 11 },
        { label: 'ONLYBUCKETS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 12 },
        { label: 'PAPPLY',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 13 },
        { label: 'PFILTER',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 14 },
        { label: 'PYTHON',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 15 },
        { label: 'QCONJUGATE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 16 },
        { label: 'QDIVIDE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 17 },
        { label: 'QMULTIPLY',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 18 },
        { label: 'QROTATE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 19 },
        { label: 'QROTATION',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 20 },
        { label: 'R',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 21 },
        { label: 'ROTATIONQ',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 22 },
        { label: 'R->',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 23 },
        { label: 'RUBY',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 24 },
        { label: 'STACKATTRIBUTE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 25 },
        { label: '->Q',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 26 },
        { label: 'ULP',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 27 },
        { label: 'max.tick.sliding.window',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 28 },
        { label: 'max.time.sliding.window',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 29 },
        { label: 'op.and.ignore-nulls',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 30 },
        { label: 'op.or.ignore-nulls',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 31 },
        { label: 'reducer.percentile',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 32 },
        { label: 'reducer.sd.forbid-nulls',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 33 },
        { label: 'reducer.var.forbid-nulls',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 34 },
        { label: 'Macros',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 35 },
        { label: 'SENSISION.EVENT',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 36 },
        { label: 'SENSISION.GET',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 37 },
        { label: 'SENSISION.SET',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 38 },
        { label: 'SENSISION.UPDATE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 39 },
        { label: 'CEVAL',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 40 },
        { label: 'SYNC',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 41 },
        { label: 'JSON->',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 42 },
        { label: 'PICKLE->',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 43 },
        { label: 'TOBIN',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 44 },
        { label: 'TOBOOLEAN',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 45 },
        { label: 'TODOUBLE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 46 },
        { label: 'TOLONG',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 47 },
        { label: 'TOSTRING',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 48 },
        { label: 'TOTIMESTAMP',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 49 },
        { label: 'CALL',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 50 },
        { label: 'CUDF',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 51 },
        { label: 'UDF',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 52 },
        { label: '->BIN',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 53 },
        { label: '->HEX',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 54 },
        { label: 'B64->',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 55 },
        { label: 'B64TOHEX',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 56 },
        { label: 'B64URL->',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 57 },
        { label: 'BIN->',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 58 },
        { label: 'BINTOHEX',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 59 },
        { label: 'BYTES->',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 60 },
        { label: 'FROMBIN',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 61 },
        { label: 'FROMHEX',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 62 },
        { label: 'HASH',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 63 },
        { label: 'HEX->',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 64 },
        { label: 'HEXTOB64',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 65 },
        { label: 'HEXTOBIN',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 66 },
        { label: 'JOIN',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 67 },
        { label: 'MATCH',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 68 },
        { label: 'MATCHER',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 69 },
        { label: 'OBP64->',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 70 },
        { label: 'OPB64TOHEX',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 71 },
        { label: 'REPLACE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 72 },
        { label: 'REPLACEALL',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 73 },
        { label: 'SPLIT',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 74 },
        { label: 'SUBSTRING',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 75 },
        { label: 'TEMPLATE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 76 },
        { label: '->B64',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 77 },
        { label: '->B64URL',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 78 },
        { label: '->BYTES',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 79 },
        { label: 'TOHEX',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 80 },
        { label: 'TOLOWER',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 81 },
        { label: '->OPB64',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 82 },
        { label: 'TOUPPER',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 83 },
        { label: 'TRIM',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 84 },
        { label: 'URLDECODE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 85 },
        { label: 'URLENCODE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 86 },
        { label: 'UUID',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 87 },
        { label: 'ADDDAYS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 88 },
        { label: 'ADDMONTHS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 89 },
        { label: 'ADDYEARS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 90 },
        { label: 'AGO',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 91 },
        { label: 'DURATION',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 92 },
        { label: 'HUMANDURATION',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 93 },
        { label: 'ISO8601',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 94 },
        { label: 'ISODURATION',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 95 },
        { label: 'MSTU',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 96 },
        { label: 'NOTAFTER',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 97 },
        { label: 'NOTBEFORE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 98 },
        { label: 'NOW',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 99 },
        { label: 'STU',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 100 },
        { label: '->TSELEMENTS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 101 },
        { label: 'TSELEMENTS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 102 },
        { label: 'TSELEMENTS->',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 103 },
        { label: 'AESUNWRAP',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 104 },
        { label: 'AESWRAP',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 105 },
        { label: 'MD5',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 106 },
        { label: 'RSADECRYPT',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 107 },
        { label: 'RSAENCRYPT',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 108 },
        { label: 'RSAGEN',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 109 },
        { label: 'RSAPRIVATE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 110 },
        { label: 'RSAPUBLIC',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 111 },
        { label: 'RSASIGN',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 112 },
        { label: 'RSAVERIFY',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 113 },
        { label: 'SHA1',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 114 },
        { label: 'SHA1HMAC',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 115 },
        { label: 'SHA256',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 116 },
        { label: 'SHA256HMAC',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 117 },
        { label: 'GZIP',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 118 },
        { label: '->Z',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 119 },
        { label: 'UNGZIP',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 120 },
        { label: 'Z->',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 121 },
        { label: 'AUTHENTICATE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 122 },
        { label: 'BOOTSTRAP',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 123 },
        { label: 'CLEAR',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 124 },
        { label: 'CLEARDEFS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 125 },
        { label: 'CLEARSYMBOLS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 126 },
        { label: 'CLEARTOMARK',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 127 },
        { label: 'COUNTTOMARK',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 128 },
        { label: 'CSTORE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 129 },
        { label: 'DEBUGOFF',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 130 },
        { label: 'DEBUGON',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 131 },
        { label: 'DEF',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 132 },
        { label: 'DEPTH',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 133 },
        { label: 'DOC',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 134 },
        { label: 'DOCMODE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 135 },
        { label: 'DROP',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 136 },
        { label: 'DROPN',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 137 },
        { label: 'DUP',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 138 },
        { label: 'DUPN',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 139 },
        { label: 'ELAPSED',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 140 },
        { label: 'EXPORT',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 141 },
        { label: 'LOAD',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 142 },
        { label: 'MARK',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 143 },
        { label: 'NDEBUGON',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 144 },
        { label: 'NOTIMINGS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 145 },
        { label: 'PICK',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 146 },
        { label: 'RESET',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 147 },
        { label: 'REXEC',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 148 },
        { label: 'ROLL',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 149 },
        { label: 'ROLLD',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 150 },
        { label: 'ROT',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 151 },
        { label: 'RUN',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 152 },
        { label: 'SNAPSHOT',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 153 },
        { label: 'SNAPSHOTALL',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 154 },
        { label: 'SNAPSHOTALLTOMARK',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 155 },
        { label: 'SNAPSHOTTOMARK',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 156 },
        { label: 'STACKATTRIBUTE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 157 },
        { label: 'STACKTOLIST',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 158 },
        { label: 'STORE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 159 },
        { label: 'SWAP',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 160 },
        { label: 'TIMINGS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 161 },
        { label: 'TYPEOF',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 162 },
        { label: 'EVALSECURE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 163 },
        { label: 'HEADER',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 164 },
        { label: 'IDENT',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 165 },
        { label: 'JSONLOOSE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 166 },
        { label: 'JSONSTRICT',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 167 },
        { label: 'LIMIT',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 168 },
        { label: 'MAXBUCKETS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 169 },
        { label: 'MAXDEPTH',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 170 },
        { label: 'MAXGTS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 171 },
        { label: 'MAXLOOP',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 172 },
        { label: 'MAXOPS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 173 },
        { label: 'MAXSYMBOLS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 174 },
        { label: 'NOOP',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 175 },
        { label: 'OPS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 176 },
        { label: 'RESTORE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 177 },
        { label: 'REV',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 178 },
        { label: 'RTFM',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 179 },
        { label: 'SAVE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 180 },
        { label: 'SECUREKEY',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 181 },
        { label: 'TOKENINFO',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 182 },
        { label: 'UNSECURE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 183 },
        { label: 'URLFETCH',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 184 },
        { label: 'WEBCALL',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 185 },
        { label: 'ABS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 186 },
        { label: 'AND',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 187 },
        { label: '^',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 188 },
        { label: 'CBRT',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 189 },
        { label: 'CEIL',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 190 },
        { label: 'COPYSIGN',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 191 },
        { label: 'DOUBLEBITS->',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 192 },
        { label: 'EXP',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 193 },
        { label: 'FLOATBITS->',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 194 },
        { label: 'FLOOR',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 195 },
        { label: '>',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 196 },
        { label: 'IEEEREMAINDER',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 197 },
        { label: 'ISNULL',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 198 },
        { label: 'ISNaN',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 199 },
        { label: 'LBOUNDS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 200 },
        { label: '<<',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 201 },
        { label: 'LOG',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 202 },
        { label: 'LOG10',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 203 },
        { label: '<',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 204 },
        { label: 'MAX',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 205 },
        { label: 'MIN',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 206 },
        { label: '%',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 207 },
        { label: 'NBOUNDS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 208 },
        { label: 'NEXTAFTER',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 209 },
        { label: 'NEXTUP',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 210 },
        { label: '!',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 211 },
        { label: 'NOT',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 212 },
        { label: 'NPDF',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 213 },
        { label: 'OR',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 214 },
        { label: 'PROBABILITY',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 215 },
        { label: 'RAND',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 216 },
        { label: 'RANDPDF',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 217 },
        { label: 'REVBITS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 218 },
        { label: '>>',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 219 },
        { label: 'RINT',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 220 },
        { label: 'ROUND',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 221 },
        { label: 'SIGNUM',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 222 },
        { label: 'SQRT',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 223 },
        { label: '-',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 224 },
        { label: '->DOUBLEBITS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 225 },
        { label: '->FLOATBITS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 226 },
        { label: '>>>',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 227 },
        { label: '->PICKLE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 228 },
        { label: 'ACOS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 229 },
        { label: 'ASIN',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 230 },
        { label: 'ATAN',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 231 },
        { label: 'COS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 232 },
        { label: 'COSH',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 233 },
        { label: 'SIN',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 234 },
        { label: 'SINH',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 235 },
        { label: 'TAN',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 236 },
        { label: 'TANH',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 237 },
        { label: 'TODEGREES',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 238 },
        { label: 'TORADIANS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 239 },
        { label: 'd',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 240 },
        { label: 'h',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 241 },
        { label: 'm',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 242 },
        { label: 'ms',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 243 },
        { label: 'ns',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 244 },
        { label: 'ps',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 245 },
        { label: 's',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 246 },
        { label: 'us',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 247 },
        { label: 'w',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 248 },
        { label: 'COUNTER',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 249 },
        { label: 'COUNTERDELTA',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 250 },
        { label: 'COUNTERVALUE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 251 },
        { label: 'RANGE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 252 },
        { label: 'QCONJUGATE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 253 },
        { label: 'QDIVIDE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 254 },
        { label: 'QMULTIPLY',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 255 },
        { label: 'QROTATE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 256 },
        { label: 'QROTATION',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 257 },
        { label: 'Q->',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 258 },
        { label: 'ROTATIONQ',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 259 },
        { label: '->Q',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 260 },
        { label: 'BITCOUNT',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 261 },
        { label: 'BITGET',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 262 },
        { label: 'BITSTOBYTES',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 263 },
        { label: 'BYTESTOBITS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 264 },
        { label: 'ASSERT',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 265 },
        { label: 'BREAK',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 266 },
        { label: 'CONTINUE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 267 },
        { label: 'DEFINED',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 268 },
        { label: 'DEFINEDMACRO',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 269 },
        { label: 'EVAL',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 270 },
        { label: 'FAIL',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 271 },
        { label: 'FOR',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 272 },
        { label: 'FOREACH',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 273 },
        { label: 'FORSTEP',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 274 },
        { label: 'IFT',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 275 },
        { label: 'IFTE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 276 },
        { label: 'MSGFAIL',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 277 },
        { label: 'NRETURN',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 278 },
        { label: 'RETURN',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 279 },
        { label: 'STOP',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 280 },
        { label: 'SWITCH',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 281 },
        { label: 'UNTIL',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 282 },
        { label: 'WHILE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 283 },
        { label: 'CLONEREVERSE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 284 },
        { label: 'CONTAINS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 285 },
        { label: 'CONTAINSKEY',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 286 },
        { label: 'CONTAINSVALUE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 287 },
        { label: 'FLATTEN',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 288 },
        { label: 'GET',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 289 },
        { label: 'KEYLIST',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 290 },
        { label: 'LFLATMAP',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 291 },
        { label: 'LIST->',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 292 },
        { label: 'LMAP',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 293 },
        { label: 'MAPID',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 294 },
        { label: 'MAT->',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 295 },
        { label: 'MSORT',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 296 },
        { label: 'PACK',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 297 },
        { label: 'SIZE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 298 },
        { label: 'SUBLIST',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 299 },
        { label: 'SUBMAP',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 300 },
        { label: '->LIST',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 301 },
        { label: '->MAP',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 302 },
        { label: '->MAT',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 303 },
        { label: '->V',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 304 },
        { label: '->VEC',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 305 },
        { label: 'UNIQUE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 306 },
        { label: 'UNLIST',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 307 },
        { label: 'UNMAP',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 308 },
        { label: 'UNPACK',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 309 },
        { label: 'VALUELIST',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 310 },
        { label: 'VEC->',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 311 },
        { label: 'V->',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 312 },
        { label: 'ZIP',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 313 },
        { label: 'DIFFERENCE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 314 },
        { label: 'INTERSECTION',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 315 },
        { label: 'SET',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 316 },
        { label: 'SET->',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 317 },
        { label: '->SET',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 318 },
        { label: 'UNION',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 319 },
        { label: 'APPEND',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 320 },
        { label: 'LSORT',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 321 },
        { label: 'PUT',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 322 },
        { label: 'REMOVE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 323 },
        { label: 'REVERSE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 324 },
        { label: 'GEOHASH->',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 325 },
        { label: 'GEOPACK',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 326 },
        { label: 'GEOREGEXP',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 327 },
        { label: 'GEOUNPACK',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 328 },
        { label: 'GEO.DIFFERENCE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 329 },
        { label: 'GEO.INTERSECTION',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 330 },
        { label: 'GEO.INTERSECTS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 331 },
        { label: 'GEO.JSON',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 332 },
        { label: 'GEO.UNION',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 333 },
        { label: 'GEO.WITHIN',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 334 },
        { label: 'GEO.WKT',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 335 },
        { label: 'HAVERSINE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 336 },
        { label: 'HHCODE->',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 337 },
        { label: '->GEOHASH',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 338 },
        { label: '->HHCODE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 339 },
        { label: 'CHUNK',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 340 },
        { label: 'CLIP',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 341 },
        { label: 'SHRINK',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 342 },
        { label: 'TIMECLIP',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 343 },
        { label: 'TIMEMODULO',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 344 },
        { label: 'TIMESCALE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 345 },
        { label: 'TIMESHIFT',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 346 },
        { label: 'TIMESPLIT',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 347 },
        { label: 'CORRELATE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 348 },
        { label: 'CPROB',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 349 },
        { label: 'ISONORMALIZE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 350 },
        { label: 'LOWESS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 351 },
        { label: 'LTTB',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 352 },
        { label: 'MODE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 353 },
        { label: 'MONOTONIC',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 354 },
        { label: 'MUSIGMA',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 355 },
        { label: 'NORMALIZE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 356 },
        { label: 'NSUMSUMSQ',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 357 },
        { label: 'PROB',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 358 },
        { label: 'RLOWESS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 359 },
        { label: 'SINGLEEXPONENTIALSMOOTHING',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 360 },
        { label: 'STANDARDIZE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 361 },
        { label: 'TLTTB',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 362 },
        { label: 'VALUEHISTOGRAM',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 363 },
        { label: 'DWTSPLIT',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 364 },
        { label: 'FDWT',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 365 },
        { label: 'FFT',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 366 },
        { label: 'FFTAP',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 367 },
        { label: 'IDWT',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 368 },
        { label: 'IFFT',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 369 },
        { label: 'CLONE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 370 },
        { label: 'CLONEEMPTY',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 371 },
        { label: 'COMMONTICKS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 372 },
        { label: 'COMPACT',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 373 },
        { label: 'DEDUP',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 374 },
        { label: 'FILLTICKS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 375 },
        { label: 'INTEGRATE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 376 },
        { label: 'LASTSORT',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 377 },
        { label: 'MERGE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 378 },
        { label: 'NONEMPTY',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 379 },
        { label: 'PARTITION',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 380 },
        { label: 'QUANTIZE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 381 },
        { label: 'RANGECOMPACT',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 382 },
        { label: 'RESETS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 383 },
        { label: 'RSORT',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 384 },
        { label: 'RVALUESORT',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 385 },
        { label: 'SORT',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 386 },
        { label: 'SORTBY',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 387 },
        { label: 'UNWRAP',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 388 },
        { label: 'VALUEDEDUP',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 389 },
        { label: 'VALUESORT',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 390 },
        { label: 'VALUESPLIT',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 391 },
        { label: 'WRAP',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 392 },
        { label: 'WRAPRAW',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 393 },
        { label: 'MAKEGTS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 394 },
        { label: 'NEWGTS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 395 },
        { label: 'PARSE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 396 },
        { label: 'DELETE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 397 },
        { label: 'FETCH',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 398 },
        { label: 'FETCHBOOLEAN',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 399 },
        { label: 'FETCHDOUBLE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 400 },
        { label: 'FETCHLONG',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 401 },
        { label: 'FETCHSTRING',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 402 },
        { label: 'FIND',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 403 },
        { label: 'FINDSTATS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 404 },
        { label: 'UPDATE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 405 },
        { label: 'DISCORDS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 406 },
        { label: 'DTW',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 407 },
        { label: 'OPTDTW',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 408 },
        { label: 'PATTERNDETECTION',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 409 },
        { label: 'PATTERNS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 410 },
        { label: 'ZDISCORDS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 411 },
        { label: 'ZPATTERNDETECTION',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 412 },
        { label: 'ZPATTERNS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 413 },
        { label: 'ZSCORE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 414 },
        { label: 'ESDTEST',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 415 },
        { label: 'GRUBBSTEST',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 416 },
        { label: 'HYBRIDTEST',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 417 },
        { label: 'HYBRIDTEST2',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 418 },
        { label: 'STLESDTEST',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 419 },
        { label: 'THRESHOLDTEST',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 420 },
        { label: 'ZSCORETEST',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 421 },
        { label: 'BBOX',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 422 },
        { label: 'COPYGEO',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 423 },
        { label: 'ELEVATIONS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 424 },
        { label: 'LOCATIONOFFSET',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 425 },
        { label: 'LOCATIONS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 426 },
        { label: 'LOCSTRINGS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 427 },
        { label: 'ATTRIBUTES',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 428 },
        { label: 'LABELS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 429 },
        { label: 'META',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 430 },
        { label: 'METASORT',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 431 },
        { label: 'NAME',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 432 },
        { label: 'PARSESELECTOR',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 433 },
        { label: 'RELABEL',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 434 },
        { label: 'RENAME',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 435 },
        { label: 'SETATTRIBUTES',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 436 },
        { label: 'TOSELECTOR',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 437 },
        { label: 'ADDVALUE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 438 },
        { label: 'ATINDEX',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 439 },
        { label: 'ATTICK',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 440 },
        { label: 'FIRSTTICK',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 441 },
        { label: 'LASTTICK',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 442 },
        { label: 'SETVALUE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 443 },
        { label: 'TICKINDEX',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 444 },
        { label: 'TICKLIST',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 445 },
        { label: 'TICKS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 446 },
        { label: 'VALUES',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 447 },
        { label: 'ATBUCKET',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 448 },
        { label: 'BUCKETCOUNT',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 449 },
        { label: 'BUCKETSPAN',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 450 },
        { label: 'CROP',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 451 },
        { label: 'FILLNEXT',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 452 },
        { label: 'FILLPREVIOUS',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 453 },
        { label: 'FILLVALUE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 454 },
        { label: 'INTERPOLATE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 455 },
        { label: 'LASTBUCKET',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 456 },
        { label: 'STL',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 457 },
        { label: 'UNBUCKETIZE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 458 },
        { label: 'REDUCE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 459 },
        { label: 'MACROREDUCER',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 460 },
        { label: 'reducer.and',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 461 },
        { label: 'reducer.and.exclude-nulls',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 462 },
        { label: 'reducer.argmax',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 463 },
        { label: 'reducer.argmin',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 464 },
        { label: 'reducer.count',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 465 },
        { label: 'reducer.join',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 466 },
        { label: 'reducer.join.forbid-nulls',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 467 },
        { label: 'reducer.max',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 468 },
        { label: 'reducer.max.forbid-nulls',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 469 },
        { label: 'reducer.mean',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 470 },
        { label: 'reducer.mean.exclude-nulls',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 471 },
        { label: 'reducer.median',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 472 },
        { label: 'reducer.min',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 473 },
        { label: 'reducer.min.forbid-nulls',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 474 },
        { label: 'reducer.or',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 475 },
        { label: 'reducer.or.exclude-nulls',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 476 },
        { label: 'reducer.sd',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 477 },
        { label: 'reducer.shannonentropy.0',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 478 },
        { label: 'reducer.shannonentropy.1',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 479 },
        { label: 'reducer.sum',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 480 },
        { label: 'reducer.sum.forbid-nulls',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 481 },
        { label: 'reducer.var',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 482 },
        { label: 'MAP',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 483 },
        { label: 'MACROMAPPER',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 484 },
        { label: 'STRICTMAPPER',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 485 },
        { label: 'mapper.join',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 486 },
        { label: 'mapper.npdf',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 487 },
        { label: 'mapper.percentile',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 488 },
        { label: 'mapper.truecourse',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 489 },
        { label: 'mapper.and',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 490 },
        { label: 'mapper.count',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 491 },
        { label: 'mapper.delta',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 492 },
        { label: 'mapper.dotproduct',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 493 },
        { label: 'mapper.dotproduct.positive',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 494 },
        { label: 'mapper.dotproduct.sigmoid',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 495 },
        { label: 'mapper.dotproduct.tanh',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 496 },
        { label: 'mapper.eq',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 497 },
        { label: 'mapper.first',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 498 },
        { label: 'mapper.ge',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 499 },
        { label: 'mapper.gt',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 500 },
        { label: 'mapper.hdist',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 501 },
        { label: 'mapper.highest',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 502 },
        { label: 'mapper.hspeed',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 503 },
        { label: 'mapper.last',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 504 },
        { label: 'mapper.le',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 505 },
        { label: 'mapper.lowest',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 506 },
        { label: 'mapper.lt',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 507 },
        { label: 'mapper.max.x',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 508 },
        { label: 'mapper.mean',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 509 },
        { label: 'mapper.mean.circular',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 510 },
        { label: 'mapper.median',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 511 },
        { label: 'mapper.min',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 512 },
        { label: 'mapper.min.x',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 513 },
        { label: 'mapper.ne',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 514 },
        { label: 'mapper.or',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 515 },
        { label: 'mapper.product',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 516 },
        { label: 'mapper.rate',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 517 },
        { label: 'mapper.replace',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 518 },
        { label: 'mapper.sd',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 519 },
        { label: 'mapper.sum',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 520 },
        { label: 'mapper.var',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 521 },
        { label: 'mapper.vdist',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 522 },
        { label: 'mapper.vspeed',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 523 },
        { label: 'mapper.abs',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 524 },
        { label: 'mapper.add',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 525 },
        { label: 'mapper.ceil',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 526 },
        { label: 'mapper.day',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 527 },
        { label: 'mapper.exp',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 528 },
        { label: 'mapper.floor',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 529 },
        { label: 'mapper.hour',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 530 },
        { label: 'mapper.log',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 531 },
        { label: 'mapper.minute',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 532 },
        { label: 'mapper.month',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 533 },
        { label: 'mapper.mul',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 534 },
        { label: 'mapper.todouble',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 535 },
        { label: 'mapper.pow',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 536 },
        { label: 'mapper.round',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 537 },
        { label: 'mapper.second',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 538 },
        { label: 'mapper.sigmoid',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 539 },
        { label: 'mapper.tanh',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 540 },
        { label: 'mapper.tick',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 541 },
        { label: 'mapper.toboolean',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 542 },
        { label: 'mapper.todouble',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 543 },
        { label: 'mapper.tolong',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 544 },
        { label: 'mapper.tostring',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 545 },
        { label: 'mapper.weekday',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 546 },
        { label: 'mapper.year',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 547 },
        { label: 'mapper.kernel.cosine',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 548 },
        { label: 'mapper.kernel.epanechnikov',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 549 },
        { label: 'mapper.kernel.gaussian',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 550 },
        { label: 'mapper.kernel.logistic',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 551 },
        { label: 'mapper.kernel.quartic',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 552 },
        { label: 'mapper.kernel.silverman',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 553 },
        { label: 'mapper.kernel.triangular',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 554 },
        { label: 'mapper.kernel.tricube',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 555 },
        { label: 'mapper.kernel.triweight',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 556 },
        { label: 'mapper.kernel.uniform',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 557 },
        { label: 'mapper.kernel.cosine',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 558 },
        { label: 'mapper.kernel.epanechnikov',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 559 },
        { label: 'mapper.kernel.gaussian',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 560 },
        { label: 'mapper.kernel.logistic',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 561 },
        { label: 'mapper.kernel.quartic',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 562 },
        { label: 'mapper.kernel.silverman',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 563 },
        { label: 'mapper.kernel.triangular',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 564 },
        { label: 'mapper.kernel.tricube',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 565 },
        { label: 'mapper.kernel.triweight',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 566 },
        { label: 'mapper.kernel.uniform',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 567 },
        { label: 'mapper.geo.approximate',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 568 },
        { label: 'mapper.geo.clear',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 569 },
        { label: 'mapper.geo.outside',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 570 },
        { label: 'mapper.geo.within',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 571 },
        { label: 'MACROFILTER',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 572 },
        { label: 'filter.byclass',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 573 },
        { label: 'filter.bylabels',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 574 },
        { label: 'filter.last.eq',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 575 },
        { label: 'filter.last.ge',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 576 },
        { label: 'filter.last.gt',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 577 },
        { label: 'filter.last.le',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 578 },
        { label: 'filter.last.lt',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 579 },
        { label: 'filter.last.ne',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 580 },
        { label: 'MACROFILTER',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 581 },
        { label: 'FILTER',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 582 },
        { label: 'bucketizer.percentile',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 583 },
        { label: 'MACROBUCKETIZER',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 584 },
        { label: 'bucketizer.and',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 585 },
        { label: 'bucketizer.count',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 586 },
        { label: 'bucketizer.first',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 587 },
        { label: 'bucketizer.join',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 588 },
        { label: 'bucketizer.last',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 589 },
        { label: 'bucketizer.max',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 590 },
        { label: 'bucketizer.mean',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 591 },
        { label: 'bucketizer.median',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 592 },
        { label: 'bucketizer.min',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 593 },
        { label: 'bucketizer.or',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 594 },
        { label: 'bucketizer.sum',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 595 },
        { label: 'BUCKETIZE',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 596 },
        { label: 'APPLY',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 597 },
        { label: 'op.add',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 598 },
        { label: 'op.and',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 599 },
        { label: 'op.div',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 600 },
        { label: 'op.eq',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 601 },
        { label: 'op.ge',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 602 },
        { label: 'op.gt',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 603 },
        { label: 'op.le',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 604 },
        { label: 'op.lt',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 605 },
        { label: 'op.mask',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 606 },
        { label: 'op.mul',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 607 },
        { label: 'op.ne',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 608 },
        { label: 'op.negmask',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 609 },
        { label: 'op.or',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 610 },
        { label: 'op.sub',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 611 },
        { label: 'MAXLONG',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 612 },
        { label: 'MINLONG',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 613 },
        { label: 'NULL',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 614 },
        { label: 'NaN',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 615 },
        { label: 'PI',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 616 },
        { label: 'e',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 617 },
        { label: 'pi',
            kind: vscode_languageserver_1.CompletionItemKind.Text,
            data: 618 }];
});
// This handler resolve additional information for the item selected in
// the completion list.
connection.onCompletionResolve((item) => {
    if (item.data === 1) {
        item.detail = 'DOUBLEEXPONENTIALSMOOTHING',
            item.documentation = 'Apply double exponential smoothing on a gts.';
    }
    else if (item.data === 2) {
        item.detail = 'EVERY',
            item.documentation = 'Executes the macro at the given interval (Mobius endpoint).';
    }
    else if (item.data === 3) {
        item.detail = 'EXPM1',
            item.documentation = 'Computes exp^x - 1.';
    }
    else if (item.data === 4) {
        item.detail = 'FINDSETS',
            item.documentation = 'Extracts classes and label values of matching GTS.';
    }
    else if (item.data === 5) {
        item.detail = 'FUSE',
            item.documentation = 'Merge chunks of GTS together.';
    }
    else if (item.data === 6) {
        item.detail = 'GROOVY',
            item.documentation = 'Executes a script expressed in Groovy.';
    }
    else if (item.data === 7) {
        item.detail = 'HYPOT',
            item.documentation = 'Returns sqrt(x²+y²) without intermediate overflow or underflow.';
    }
    else if (item.data === 8) {
        item.detail = 'IMMUTABLE',
            item.documentation = 'Replaces a map/list/set with an unmodifiable version.';
    }
    else if (item.data === 9) {
        item.detail = 'JS',
            item.documentation = 'Executes a script expressed in JavaScript.';
    }
    else if (item.data === 10) {
        item.detail = 'LOG1P',
            item.documentation = 'Computes the natural logarithm of the top of the stack plus one.';
    }
    else if (item.data === 11) {
        item.detail = 'LUA',
            item.documentation = 'Executes a script expressed in Lua.';
    }
    else if (item.data === 12) {
        item.detail = 'ONLYBUCKETS',
            item.documentation = 'Removes ticks which do not fall on bucket boundaries.';
    }
    else if (item.data === 13) {
        item.detail = 'PAPPLY',
            item.documentation = 'Behaves like APPLY except returned GTS are grouped by equivalence classes.';
    }
    else if (item.data === 14) {
        item.detail = 'PFILTER',
            item.documentation = 'Behaves like FILTER except returned GTS are grouped by equivalence classes.';
    }
    else if (item.data === 15) {
        item.detail = 'PYTHON',
            item.documentation = 'Executes a script expressed in Python.';
    }
    else if (item.data === 16) {
        item.detail = 'QCONJUGATE',
            item.documentation = 'Compute the conjugate of a quaternion.';
    }
    else if (item.data === 17) {
        item.detail = 'QDIVIDE',
            item.documentation = 'Divide a quaternion q by a quaternion r.';
    }
    else if (item.data === 18) {
        item.detail = 'QMULTIPLY',
            item.documentation = 'Multiply two quaternions.';
    }
    else if (item.data === 19) {
        item.detail = 'QROTATE',
            item.documentation = 'Rotate a vector by a quaternion.';
    }
    else if (item.data === 20) {
        item.detail = 'QROTATION',
            item.documentation = 'Extract the axis and angle of rotation of a quaternion.';
    }
    else if (item.data === 21) {
        item.detail = 'R',
            item.documentation = 'Execute a script in R syntax.';
    }
    else if (item.data === 22) {
        item.detail = 'ROTATIONQ',
            item.documentation = 'Creates a quaternion from a rotation axis and angle.';
    }
    else if (item.data === 23) {
        item.detail = 'R->',
            item.documentation = 'Convert R types back to WarpScript types.';
    }
    else if (item.data === 24) {
        item.detail = 'RUBY',
            item.documentation = 'Executes a script expressed in Ruby.';
    }
    else if (item.data === 25) {
        item.detail = 'STACKATTRIBUTE',
            item.documentation = 'Pushes onto the stack the value of the named attribute.';
    }
    else if (item.data === 26) {
        item.detail = '->Q',
            item.documentation = 'Converts coordinates to a quaternion.';
    }
    else if (item.data === 27) {
        item.detail = 'ULP',
            item.documentation = 'Returns the size of an Units in the Last Place of the top of the stack.';
    }
    else if (item.data === 28) {
        item.detail = 'max.tick.sliding.window',
            item.documentation = 'Max tick value in a sliding window.';
    }
    else if (item.data === 29) {
        item.detail = 'max.time.sliding.window',
            item.documentation = 'Max time of a sliding window.';
    }
    else if (item.data === 30) {
        item.detail = 'op.and.ignore-nulls',
            item.documentation = 'Pushes onto the stack an operator to perform a logical and between values of multiple GTS. Null values will be ignored.';
    }
    else if (item.data === 31) {
        item.detail = 'op.or.ignore-nulls',
            item.documentation = 'Pushes onto the stack an operator to perform a logical or between values of multiple GTS. Null values will be ignored.';
    }
    else if (item.data === 32) {
        item.detail = 'reducer.percentile',
            item.documentation = 'Push onto the stack a reducer to return the Nth percentile of the values for each tick.';
    }
    else if (item.data === 33) {
        item.detail = 'reducer.sd.forbid-nulls',
            item.documentation = 'Push onto the stack a reducer to compute the standard deviation (with or without Bessel\'s correction) of the values for each tick, null values lead to a null result.';
    }
    else if (item.data === 34) {
        item.detail = 'reducer.var.forbid-nulls',
            item.documentation = 'Push onto the stack a reducer to compute the variance (with or without Bessel\'s correction) of the values for each tick. Missing (null) values lead to a null result.';
    }
    else if (item.data === 35) {
        item.detail = 'Macros',
            item.documentation = 'Macros allow users to define new functions combining existing WarpScript functions and operations';
    }
    else if (item.data === 36) {
        item.detail = 'SENSISION.EVENT',
            item.documentation = 'Emits a Sensision event.';
    }
    else if (item.data === 37) {
        item.detail = 'SENSISION.GET',
            item.documentation = 'Set a value for a Sensision metric.';
    }
    else if (item.data === 38) {
        item.detail = 'SENSISION.SET',
            item.documentation = 'Set a value for a Sensision metric.';
    }
    else if (item.data === 39) {
        item.detail = 'SENSISION.UPDATE',
            item.documentation = 'Update a value for a numerical Sensision metric.';
    }
    else if (item.data === 40) {
        item.detail = 'CEVAL',
            item.documentation = 'Execute macros concurrently.';
    }
    else if (item.data === 41) {
        item.detail = 'SYNC',
            item.documentation = 'Execute a macro in a synchronized manner inside of a CEVAL call.';
    }
    else if (item.data === 42) {
        item.detail = 'JSON->',
            item.documentation = 'Parses a string as JSON and pushes the result onto the stack.';
    }
    else if (item.data === 43) {
        item.detail = 'PICKLE->',
            item.documentation = 'Decodes Pickle content.';
    }
    else if (item.data === 44) {
        item.detail = 'TOBIN',
            item.documentation = 'Converts a long to its binary representation.';
    }
    else if (item.data === 45) {
        item.detail = 'TOBOOLEAN',
            item.documentation = 'Converts number or string to boolean';
    }
    else if (item.data === 46) {
        item.detail = 'TODOUBLE',
            item.documentation = 'Convert a number to double';
    }
    else if (item.data === 47) {
        item.detail = 'TOLONG',
            item.documentation = 'Convert a number to long';
    }
    else if (item.data === 48) {
        item.detail = 'TOSTRING',
            item.documentation = 'Convert the argument to string';
    }
    else if (item.data === 49) {
        item.detail = 'TOTIMESTAMP',
            item.documentation = 'Converts an ISO8601 date/time string into a number of time units.';
    }
    else if (item.data === 50) {
        item.detail = 'CALL',
            item.documentation = 'Invoke an external program.';
    }
    else if (item.data === 51) {
        item.detail = 'CUDF',
            item.documentation = 'Invoke a possibly cached version of a UDF.';
    }
    else if (item.data === 52) {
        item.detail = 'UDF',
            item.documentation = 'Invoke a UDF.';
    }
    else if (item.data === 53) {
        item.detail = '->BIN',
            item.documentation = 'Converts a string to its binary representation.';
    }
    else if (item.data === 54) {
        item.detail = '->HEX',
            item.documentation = 'Converts a string to the hexadecimal representation of its UTF-8 encoding.';
    }
    else if (item.data === 55) {
        item.detail = 'B64->',
            item.documentation = 'Decodes a base64 encoded string.';
    }
    else if (item.data === 56) {
        item.detail = 'B64TOHEX',
            item.documentation = 'Decodes a base64 encoded string and immediately re-encode it in hex.';
    }
    else if (item.data === 57) {
        item.detail = 'B64URL->',
            item.documentation = 'Decodes a base64url encoded string.';
    }
    else if (item.data === 58) {
        item.detail = 'BIN->',
            item.documentation = 'Decode a String in binary.';
    }
    else if (item.data === 59) {
        item.detail = 'BINTOHEX',
            item.documentation = 'Decodes a binary encoded string and immediately re-encode it in hex.';
    }
    else if (item.data === 60) {
        item.detail = 'BYTES->',
            item.documentation = 'Converts a bytes array into a string';
    }
    else if (item.data === 61) {
        item.detail = 'FROMBIN',
            item.documentation = 'Converts a binary representation of a long into a long.';
    }
    else if (item.data === 62) {
        item.detail = 'FROMHEX',
            item.documentation = 'Converts an hexadecimal representation into a long.';
    }
    else if (item.data === 63) {
        item.detail = 'HASH',
            item.documentation = 'Computes a 64 bits hash of the string on top of the stack.';
    }
    else if (item.data === 64) {
        item.detail = 'HEX->',
            item.documentation = 'Decodes an hex encoded string.';
    }
    else if (item.data === 65) {
        item.detail = 'HEXTOB64',
            item.documentation = 'Decodes a hex encoded string and immediately re-encode it in base64.';
    }
    else if (item.data === 66) {
        item.detail = 'HEXTOBIN',
            item.documentation = 'Decodes a hex encoded string and immediately re-encode it in binary.';
    }
    else if (item.data === 67) {
        item.detail = 'JOIN',
            item.documentation = 'Join N strings with the given separator';
    }
    else if (item.data === 68) {
        item.detail = 'MATCH',
            item.documentation = 'Apply a regular expression to a string';
    }
    else if (item.data === 69) {
        item.detail = 'MATCHER',
            item.documentation = 'Builds a compiled object form a regular expression.';
    }
    else if (item.data === 70) {
        item.detail = 'OBP64->',
            item.documentation = 'Decodes an order preserving base64 encoded string.';
    }
    else if (item.data === 71) {
        item.detail = 'OPB64TOHEX',
            item.documentation = 'Decodes an order preserving base64 encoded string and immediately re-encode it in hex.';
    }
    else if (item.data === 72) {
        item.detail = 'REPLACE',
            item.documentation = 'Replaces the first substring of the input string that matches the given regular expression with the given replacement.';
    }
    else if (item.data === 73) {
        item.detail = 'REPLACEALL',
            item.documentation = 'Replaces all substrings of the input string that matches the given regular expression with the given replacement.';
    }
    else if (item.data === 74) {
        item.detail = 'SPLIT',
            item.documentation = 'Split a string in segments';
    }
    else if (item.data === 75) {
        item.detail = 'SUBSTRING',
            item.documentation = 'Extracts a substring from a string.';
    }
    else if (item.data === 76) {
        item.detail = 'TEMPLATE',
            item.documentation = 'Fills a template with values contained in a map.';
    }
    else if (item.data === 77) {
        item.detail = '->B64',
            item.documentation = 'Encodes a string in base64.';
    }
    else if (item.data === 78) {
        item.detail = '->B64URL',
            item.documentation = 'Encodes a string in base64url.';
    }
    else if (item.data === 79) {
        item.detail = '->BYTES',
            item.documentation = 'Converts a string into its bytes given a charset';
    }
    else if (item.data === 80) {
        item.detail = 'TOHEX',
            item.documentation = 'Converts a long to its 64 bits hexadecimal representaiton.';
    }
    else if (item.data === 81) {
        item.detail = 'TOLOWER',
            item.documentation = 'Converts the string on top of the stack to lower case.';
    }
    else if (item.data === 82) {
        item.detail = '->OPB64',
            item.documentation = 'Encodes a string in order preserving base64.';
    }
    else if (item.data === 83) {
        item.detail = 'TOUPPER',
            item.documentation = 'Converts the string on top of the stack to upper case.';
    }
    else if (item.data === 84) {
        item.detail = 'TRIM',
            item.documentation = 'Trims whitespaces from both ends of the string on top of the stack.';
    }
    else if (item.data === 85) {
        item.detail = 'URLDECODE',
            item.documentation = 'Decode an URL encoded string';
    }
    else if (item.data === 86) {
        item.detail = 'URLENCODE',
            item.documentation = 'URL Encode a string';
    }
    else if (item.data === 87) {
        item.detail = 'UUID',
            item.documentation = 'Generates a UUID and pushes it on top of the stack.';
    }
    else if (item.data === 88) {
        item.detail = 'ADDDAYS',
            item.documentation = 'Adds a certain number of days to a timestamp.';
    }
    else if (item.data === 89) {
        item.detail = 'ADDMONTHS',
            item.documentation = 'Adds a certain number of months to a timestamp.';
    }
    else if (item.data === 90) {
        item.detail = 'ADDYEARS',
            item.documentation = 'Adds a certain number of years to a timestamp.';
    }
    else if (item.data === 91) {
        item.detail = 'AGO',
            item.documentation = 'Computes a timestamp from an offset in time units.';
    }
    else if (item.data === 92) {
        item.detail = 'DURATION',
            item.documentation = 'Transform an ISO8601 duration into microsecondes';
    }
    else if (item.data === 93) {
        item.detail = 'HUMANDURATION',
            item.documentation = 'Convert a number of time units into a human readable duration.';
    }
    else if (item.data === 94) {
        item.detail = 'ISO8601',
            item.documentation = 'Transform a timestamp into a date in ISO 8601 format';
    }
    else if (item.data === 95) {
        item.detail = 'ISODURATION',
            item.documentation = 'Convert a number of time units into an ISO8601 duration string.';
    }
    else if (item.data === 96) {
        item.detail = 'MSTU',
            item.documentation = 'Push onto the stack a the number of time units in a millisecond';
    }
    else if (item.data === 97) {
        item.detail = 'NOTAFTER',
            item.documentation = 'Checks that the current time is not after the provided timestamp. Fails otherwise.';
    }
    else if (item.data === 98) {
        item.detail = 'NOTBEFORE',
            item.documentation = 'Checks that the current time is not before the provided timestamp. Fails otherwise.';
    }
    else if (item.data === 99) {
        item.detail = 'NOW',
            item.documentation = 'Push on the stack the current time in microseconds since the Unix Epoch';
    }
    else if (item.data === 100) {
        item.detail = 'STU',
            item.documentation = 'Push onto the stack a the number of time units in a second';
    }
    else if (item.data === 101) {
        item.detail = '->TSELEMENTS',
            item.documentation = 'Replaces the timestamp with an array of its elements';
    }
    else if (item.data === 102) {
        item.detail = 'TSELEMENTS',
            item.documentation = 'Replaces the timestamp with an array of its elements';
    }
    else if (item.data === 103) {
        item.detail = 'TSELEMENTS->',
            item.documentation = 'Converts various timestamp\'s elements into a timestamp for a given timezone';
    }
    else if (item.data === 104) {
        item.detail = 'AESUNWRAP',
            item.documentation = 'Unwrap wrapped byte array ';
    }
    else if (item.data === 105) {
        item.detail = 'AESWRAP',
            item.documentation = 'Wrap a byte array or String with AES cypher';
    }
    else if (item.data === 106) {
        item.detail = 'MD5',
            item.documentation = 'Message Digest of a byte array with the cryptographic hash function MD5.';
    }
    else if (item.data === 107) {
        item.detail = 'RSADECRYPT',
            item.documentation = 'Decrypt encoded data using RSA';
    }
    else if (item.data === 108) {
        item.detail = 'RSAENCRYPT',
            item.documentation = 'Encrypt data using RSA keys';
    }
    else if (item.data === 109) {
        item.detail = 'RSAGEN',
            item.documentation = 'Generates a RSA key pair.';
    }
    else if (item.data === 110) {
        item.detail = 'RSAPRIVATE',
            item.documentation = 'Produce a RSA private key from a parameter map.';
    }
    else if (item.data === 111) {
        item.detail = 'RSAPUBLIC',
            item.documentation = 'Produce a RSA public key from a parameter map.';
    }
    else if (item.data === 112) {
        item.detail = 'RSASIGN',
            item.documentation = 'Sign data using RSA and a hash algorithm.';
    }
    else if (item.data === 113) {
        item.detail = 'RSAVERIFY',
            item.documentation = 'Sign data using RSA and a hash algorithm.';
    }
    else if (item.data === 114) {
        item.detail = 'SHA1',
            item.documentation = 'Message Digest of a byte array with the cryptographic hash function SHA1.';
    }
    else if (item.data === 115) {
        item.detail = 'SHA1HMAC',
            item.documentation = 'Computes a Hash-based Message Authentication Code (HMAC) that uses a key in conjunction with a SHA-1 cryptographic hash function.';
    }
    else if (item.data === 116) {
        item.detail = 'SHA256',
            item.documentation = 'Message Digest of a byte array with the cryptographic hash function SHA256.';
    }
    else if (item.data === 117) {
        item.detail = 'SHA256HMAC',
            item.documentation = 'Computes a Hash-based Message Authentication Code (HMAC) that uses a key in conjunction with a SHA-256 cryptographic hash function.';
    }
    else if (item.data === 118) {
        item.detail = 'GZIP',
            item.documentation = 'Compresses a byte array or String';
    }
    else if (item.data === 119) {
        item.detail = '->Z',
            item.documentation = 'Builds a z-value.';
    }
    else if (item.data === 120) {
        item.detail = 'UNGZIP',
            item.documentation = 'Decompresses a compressed byte array.';
    }
    else if (item.data === 121) {
        item.detail = 'Z->',
            item.documentation = 'Decomposes a Z-Value.';
    }
    else if (item.data === 122) {
        item.detail = 'AUTHENTICATE',
            item.documentation = 'Authenticates the current stack.';
    }
    else if (item.data === 123) {
        item.detail = 'BOOTSTRAP',
            item.documentation = 'Function executed before the WarpScript stack becomes available.';
    }
    else if (item.data === 124) {
        item.detail = 'CLEAR',
            item.documentation = 'Remove all elements from the stack';
    }
    else if (item.data === 125) {
        item.detail = 'CLEARDEFS',
            item.documentation = 'Clear redefined WarpScript functions.';
    }
    else if (item.data === 126) {
        item.detail = 'CLEARSYMBOLS',
            item.documentation = 'Clear all symbols name of the stack.';
    }
    else if (item.data === 127) {
        item.detail = 'CLEARTOMARK',
            item.documentation = 'Removes elements from the stack up to and including the first mark encountered.';
    }
    else if (item.data === 128) {
        item.detail = 'COUNTTOMARK',
            item.documentation = 'Counts the number of elements on the stack up to but excluding the first mark encountered.';
    }
    else if (item.data === 129) {
        item.detail = 'CSTORE',
            item.documentation = 'Conditionnaly store the element below the top of the stack under the symbol name on top of the stack';
    }
    else if (item.data === 130) {
        item.detail = 'DEBUGOFF',
            item.documentation = 'Turns off stack debugging.';
    }
    else if (item.data === 131) {
        item.detail = 'DEBUGON',
            item.documentation = 'Turns on stack debugging.';
    }
    else if (item.data === 132) {
        item.detail = 'DEF',
            item.documentation = 'Define or redefine a WarpScript function.';
    }
    else if (item.data === 133) {
        item.detail = 'DEPTH',
            item.documentation = 'Push on the stack the depth of the stack';
    }
    else if (item.data === 134) {
        item.detail = 'DOC',
            item.documentation = 'Defines the documentation string for a macro.';
    }
    else if (item.data === 135) {
        item.detail = 'DOCMODE',
            item.documentation = 'Turns on documentation mode.';
    }
    else if (item.data === 136) {
        item.detail = 'DROP',
            item.documentation = 'Remove the top element from the stack';
    }
    else if (item.data === 137) {
        item.detail = 'DROPN',
            item.documentation = 'Remove the N top elements from the stack';
    }
    else if (item.data === 138) {
        item.detail = 'DUP',
            item.documentation = 'Duplicates the top of the stack';
    }
    else if (item.data === 139) {
        item.detail = 'DUPN',
            item.documentation = 'Duplicates the N top of the stack';
    }
    else if (item.data === 140) {
        item.detail = 'ELAPSED',
            item.documentation = 'Pushes on the stack the collected timing informations.';
    }
    else if (item.data === 141) {
        item.detail = 'EXPORT',
            item.documentation = 'Sets or updates the list of exported symbols';
    }
    else if (item.data === 142) {
        item.detail = 'LOAD',
            item.documentation = 'Pushes onto the stack the value of the symbol whose name is on the stack.';
    }
    else if (item.data === 143) {
        item.detail = 'MARK',
            item.documentation = 'Pushes a mark onto the stack.';
    }
    else if (item.data === 144) {
        item.detail = 'NDEBUGON',
            item.documentation = 'Turns on stack debugging, specifying the number of stack levels to return in case of error.';
    }
    else if (item.data === 145) {
        item.detail = 'NOTIMINGS',
            item.documentation = 'Turns off timing collection.';
    }
    else if (item.data === 146) {
        item.detail = 'PICK',
            item.documentation = 'Copies onto the top of the stack the n-th element of the stack';
    }
    else if (item.data === 147) {
        item.detail = 'RESET',
            item.documentation = 'Reset the stack to a specific depth.';
    }
    else if (item.data === 148) {
        item.detail = 'REXEC',
            item.documentation = 'Executes some WarpScript on a remote Warp 10.';
    }
    else if (item.data === 149) {
        item.detail = 'ROLL',
            item.documentation = 'Moves the N-th element of the stack onto the top';
    }
    else if (item.data === 150) {
        item.detail = 'ROLLD',
            item.documentation = 'Moves the element on top of the stack to the N-th position';
    }
    else if (item.data === 151) {
        item.detail = 'ROT',
            item.documentation = 'Move the third element of the stack onto the top';
    }
    else if (item.data === 152) {
        item.detail = 'RUN',
            item.documentation = 'Executes the macro whose name is on the stack.';
    }
    else if (item.data === 153) {
        item.detail = 'SNAPSHOT',
            item.documentation = 'Converts the content of the stack into WarpScript code.';
    }
    else if (item.data === 154) {
        item.detail = 'SNAPSHOTALL',
            item.documentation = 'Converts the content of the stack and current symbols into WarpScript code.';
    }
    else if (item.data === 155) {
        item.detail = 'SNAPSHOTALLTOMARK',
            item.documentation = 'Converts the content of the stack above a MARK and current symbols into WarpScript code.';
    }
    else if (item.data === 156) {
        item.detail = 'SNAPSHOTTOMARK',
            item.documentation = 'Converts part of the stack into WarpScript code.';
    }
    else if (item.data === 157) {
        item.detail = 'STACKATTRIBUTE',
            item.documentation = 'Extract the stack attributes and push them on top of the stack';
    }
    else if (item.data === 158) {
        item.detail = 'STACKTOLIST',
            item.documentation = 'Convert the whole stack into a list and push this list on the top of the stack.';
    }
    else if (item.data === 159) {
        item.detail = 'STORE',
            item.documentation = 'Store the element below the top of the stack under the symbol name on top of the stack';
    }
    else if (item.data === 160) {
        item.detail = 'SWAP',
            item.documentation = 'Swap the two two elements of the stack';
    }
    else if (item.data === 161) {
        item.detail = 'TIMINGS',
            item.documentation = 'Turns on timing collection.';
    }
    else if (item.data === 162) {
        item.detail = 'TYPEOF',
            item.documentation = 'Pushes onto the stack the type of the element on top of the stack.';
    }
    else if (item.data === 163) {
        item.detail = 'EVALSECURE',
            item.documentation = 'Evaluates the secured script on top of the stack';
    }
    else if (item.data === 164) {
        item.detail = 'HEADER',
            item.documentation = 'Set a header which will be returned with the HTTP response.';
    }
    else if (item.data === 165) {
        item.detail = 'IDENT',
            item.documentation = 'Pushes on the stack the ident string of the running platform.';
    }
    else if (item.data === 166) {
        item.detail = 'JSONLOOSE',
            item.documentation = 'Generate a loose JSON version (with NaN and Infinite values allowed) of the stack';
    }
    else if (item.data === 167) {
        item.detail = 'JSONSTRICT',
            item.documentation = 'Generate a JSON version of the stack';
    }
    else if (item.data === 168) {
        item.detail = 'LIMIT',
            item.documentation = 'Modifies the maximum number of datapoints which can be fetched during a script execution.';
    }
    else if (item.data === 169) {
        item.detail = 'MAXBUCKETS',
            item.documentation = 'Modifies the maximum number of buckets which can be created by a call to BUCKETIZE.';
    }
    else if (item.data === 170) {
        item.detail = 'MAXDEPTH',
            item.documentation = 'Modifies the maximum depth of the stack.';
    }
    else if (item.data === 171) {
        item.detail = 'MAXGTS',
            item.documentation = 'Modifies the maximum number of Geo Time Series which can be retrieved.';
    }
    else if (item.data === 172) {
        item.detail = 'MAXLOOP',
            item.documentation = 'Modifies the upper limit of time which can be spent in a loop.';
    }
    else if (item.data === 173) {
        item.detail = 'MAXOPS',
            item.documentation = 'Modifies the maximum number of WarpScript operations which can be performed during a single execution.';
    }
    else if (item.data === 174) {
        item.detail = 'MAXSYMBOLS',
            item.documentation = 'Modifies the maximum number of symbols which can be created during a single WarpScript execution.';
    }
    else if (item.data === 175) {
        item.detail = 'NOOP',
            item.documentation = 'Does absolutely nothing, but does it well!';
    }
    else if (item.data === 176) {
        item.detail = 'OPS',
            item.documentation = 'Pushes onto the stack the current number of operations which were performed by the WarpScript code execution.';
    }
    else if (item.data === 177) {
        item.detail = 'RESTORE',
            item.documentation = 'Restores the stack context.';
    }
    else if (item.data === 178) {
        item.detail = 'REV',
            item.documentation = 'Pushes on the stack the revision string of the running platform.';
    }
    else if (item.data === 179) {
        item.detail = 'RTFM',
            item.documentation = 'There is always a documentation for your function';
    }
    else if (item.data === 180) {
        item.detail = 'SAVE',
            item.documentation = 'Pushes on the stack its current context.';
    }
    else if (item.data === 181) {
        item.detail = 'SECUREKEY',
            item.documentation = 'Set the secure key for creating secure scripts.';
    }
    else if (item.data === 182) {
        item.detail = 'TOKENINFO',
            item.documentation = 'Extracts information on the token on top of the stack';
    }
    else if (item.data === 183) {
        item.detail = 'UNSECURE',
            item.documentation = 'Retrieve the original script from a secure script.';
    }
    else if (item.data === 184) {
        item.detail = 'URLFETCH',
            item.documentation = 'Retrieves the content of a URL.';
    }
    else if (item.data === 185) {
        item.detail = 'WEBCALL',
            item.documentation = 'Makes an outbound HTTP call.';
    }
    else if (item.data === 186) {
        item.detail = 'ABS',
            item.documentation = 'Calculates the absolute value of a number';
    }
    else if (item.data === 187) {
        item.detail = 'AND',
            item.documentation = 'This is synonymous for &&.';
    }
    else if (item.data === 188) {
        item.detail = '^',
            item.documentation = 'Computes the bitwise XOR of the two arguments';
    }
    else if (item.data === 189) {
        item.detail = 'CBRT',
            item.documentation = 'Calculate the cubic root';
    }
    else if (item.data === 190) {
        item.detail = 'CEIL',
            item.documentation = 'Round a number to the nearest bigger long';
    }
    else if (item.data === 191) {
        item.detail = 'COPYSIGN',
            item.documentation = 'Copies the sign of a number on another one.';
    }
    else if (item.data === 192) {
        item.detail = 'DOUBLEBITS->',
            item.documentation = 'Converts the long on top of the stack to a double by considering the long value as the raw bits of the double.';
    }
    else if (item.data === 193) {
        item.detail = 'EXP',
            item.documentation = 'Return e raised to the power of the argument';
    }
    else if (item.data === 194) {
        item.detail = 'FLOATBITS->',
            item.documentation = 'Converts the long on top of the stack to a double by considering the long value as the raw bits of a float.';
    }
    else if (item.data === 195) {
        item.detail = 'FLOOR',
            item.documentation = 'Round a number to the nearest smaller long';
    }
    else if (item.data === 196) {
        item.detail = '>',
            item.documentation = 'Verify if the first parameter is greater than the second';
    }
    else if (item.data === 197) {
        item.detail = 'IEEEREMAINDER',
            item.documentation = 'For parameters \'f1\' and \'f2\', it calculates the remainder when \'f1\' is divided by \'f2';
    }
    else if (item.data === 198) {
        item.detail = 'ISNULL',
            item.documentation = 'Checks whether the top of the stack is null.';
    }
    else if (item.data === 199) {
        item.detail = 'ISNaN',
            item.documentation = 'Checks whether a double is NaN.';
    }
    else if (item.data === 200) {
        item.detail = 'LBOUNDS',
            item.documentation = 'Pushes onto the stack a list of M+1 bounds defining M intervals between a and b plus the intervals before a and after b.';
    }
    else if (item.data === 201) {
        item.detail = '<<',
            item.documentation = 'Left shifting of bit pattern.';
    }
    else if (item.data === 202) {
        item.detail = 'LOG',
            item.documentation = 'Calculate the natural logarithm';
    }
    else if (item.data === 203) {
        item.detail = 'LOG10',
            item.documentation = 'Calculate the common logarithm';
    }
    else if (item.data === 204) {
        item.detail = '<',
            item.documentation = 'Verify if the first parameter is lesser than the second';
    }
    else if (item.data === 205) {
        item.detail = 'MAX',
            item.documentation = 'Calculates the maximum of two numbers';
    }
    else if (item.data === 206) {
        item.detail = 'MIN',
            item.documentation = 'Calculates the minimum of two numbers';
    }
    else if (item.data === 207) {
        item.detail = '%',
            item.documentation = 'Calculates the remainder of the division of two numbers';
    }
    else if (item.data === 208) {
        item.detail = 'NBOUNDS',
            item.documentation = 'Pushes a list of n-1 bounds defining n intervals with equal area under the bell cureve N(mu,sigma).';
    }
    else if (item.data === 209) {
        item.detail = 'NEXTAFTER',
            item.documentation = 'Returns the DOUBLE adjacent to the first argument in the direction of the second argument';
    }
    else if (item.data === 210) {
        item.detail = 'NEXTUP',
            item.documentation = 'Returns the DOUBLE  adjacent to the argument in the direction of positive infinity';
    }
    else if (item.data === 211) {
        item.detail = '!',
            item.documentation = 'Apply the logical function NOT';
    }
    else if (item.data === 212) {
        item.detail = 'NOT',
            item.documentation = 'Negates the boolean on the stack.';
    }
    else if (item.data === 213) {
        item.detail = 'NPDF',
            item.documentation = 'Parametrable function to create NDPF (Normal Distribution Probability Density Functions)';
    }
    else if (item.data === 214) {
        item.detail = 'OR',
            item.documentation = 'Do a boolean OR between booleans on the stack.';
    }
    else if (item.data === 215) {
        item.detail = 'PROBABILITY',
            item.documentation = 'Pushes on the stack a function which computes probabilities according to a provided value histogram.';
    }
    else if (item.data === 216) {
        item.detail = 'RAND',
            item.documentation = 'Push on the stack a random number between 0 and 1';
    }
    else if (item.data === 217) {
        item.detail = 'RANDPDF',
            item.documentation = 'Pushes on the stack a function which emits values according to a provided value histogram.';
    }
    else if (item.data === 218) {
        item.detail = 'REVBITS',
            item.documentation = 'Reverse the bits of the long on top of the stack.';
    }
    else if (item.data === 219) {
        item.detail = '>>',
            item.documentation = 'Signed right bit shift.';
    }
    else if (item.data === 220) {
        item.detail = 'RINT',
            item.documentation = 'Return the DOUBLE closest to the value and equal to a mathematical integer';
    }
    else if (item.data === 221) {
        item.detail = 'ROUND',
            item.documentation = 'Round a number to the closest long';
    }
    else if (item.data === 222) {
        item.detail = 'SIGNUM',
            item.documentation = 'Return the signum of a number';
    }
    else if (item.data === 223) {
        item.detail = 'SQRT',
            item.documentation = 'Calculate the square root';
    }
    else if (item.data === 224) {
        item.detail = '-',
            item.documentation = 'Substract two numbers';
    }
    else if (item.data === 225) {
        item.detail = '->DOUBLEBITS',
            item.documentation = 'Converts a double to a long value of the raw bits of its representation.';
    }
    else if (item.data === 226) {
        item.detail = '->FLOATBITS',
            item.documentation = 'Converts a double to a long value of the raw bits of its float representation.';
    }
    else if (item.data === 227) {
        item.detail = '>>>',
            item.documentation = 'Unsigned right bit shift, setting the most significant bit to 0.';
    }
    else if (item.data === 228) {
        item.detail = '->PICKLE',
            item.documentation = 'Converts the object on top of the stack to its PICKLE representation.';
    }
    else if (item.data === 229) {
        item.detail = 'ACOS',
            item.documentation = 'Calculate the arccosine';
    }
    else if (item.data === 230) {
        item.detail = 'ASIN',
            item.documentation = 'Calculate the arcsine';
    }
    else if (item.data === 231) {
        item.detail = 'ATAN',
            item.documentation = 'Calculate the arctangent';
    }
    else if (item.data === 232) {
        item.detail = 'COS',
            item.documentation = 'Calculate the cosine';
    }
    else if (item.data === 233) {
        item.detail = 'COSH',
            item.documentation = 'Calculate the hyperbolic cosine';
    }
    else if (item.data === 234) {
        item.detail = 'SIN',
            item.documentation = 'Calculate the sine';
    }
    else if (item.data === 235) {
        item.detail = 'SINH',
            item.documentation = 'Calculate hyperbolic sine';
    }
    else if (item.data === 236) {
        item.detail = 'TAN',
            item.documentation = 'Calculate the tangent';
    }
    else if (item.data === 237) {
        item.detail = 'TANH',
            item.documentation = 'Calculate the hyperbolic tangent';
    }
    else if (item.data === 238) {
        item.detail = 'TODEGREES',
            item.documentation = 'Convert from radians to degrees';
    }
    else if (item.data === 239) {
        item.detail = 'TORADIANS',
            item.documentation = 'Convert from degrees to radians';
    }
    else if (item.data === 240) {
        item.detail = 'd',
            item.documentation = 'Convert a timestamp expressed in days to the time unit used by the platform';
    }
    else if (item.data === 241) {
        item.detail = 'h',
            item.documentation = 'Convert a timestamp expressed in hours to the time unit used by the platform';
    }
    else if (item.data === 242) {
        item.detail = 'm',
            item.documentation = 'Convert a timestamp expressed in minutes to the time unit used by the platform';
    }
    else if (item.data === 243) {
        item.detail = 'ms',
            item.documentation = 'Convert a timestamp expressed in milliseconds to the time unit used by the platform';
    }
    else if (item.data === 244) {
        item.detail = 'ns',
            item.documentation = 'Convert a timestamp expressed in nanoseconds to the time unit used by the platform';
    }
    else if (item.data === 245) {
        item.detail = 'ps',
            item.documentation = 'Convert a timestamp expressed in picoseconds to the time unit used by the platform';
    }
    else if (item.data === 246) {
        item.detail = 's',
            item.documentation = 'Convert a timestamp expressed in seconds to the time unit used by the platform';
    }
    else if (item.data === 247) {
        item.detail = 'us',
            item.documentation = 'Convert a timestamp expressed in microseconds to the time unit used by the platform';
    }
    else if (item.data === 248) {
        item.detail = 'w',
            item.documentation = 'Convert a timestamp expressed in weeks to the time unit used by the platform';
    }
    else if (item.data === 249) {
        item.detail = 'COUNTER',
            item.documentation = 'Push a counter (AtomicLong) onto the stack.';
    }
    else if (item.data === 250) {
        item.detail = 'COUNTERDELTA',
            item.documentation = 'Increment a counter.';
    }
    else if (item.data === 251) {
        item.detail = 'COUNTERVALUE',
            item.documentation = 'Retrieve the value of a counter.';
    }
    else if (item.data === 252) {
        item.detail = 'RANGE',
            item.documentation = 'Pushes onto the stack a list of integers in the given range.';
    }
    else if (item.data === 253) {
        item.detail = 'QCONJUGATE',
            item.documentation = 'Compute the conjugate of a quaternion.';
    }
    else if (item.data === 254) {
        item.detail = 'QDIVIDE',
            item.documentation = 'Divide a quaternion q by a quaternion r';
    }
    else if (item.data === 255) {
        item.detail = 'QMULTIPLY',
            item.documentation = 'Multiply a quaternion q by a quaternion r';
    }
    else if (item.data === 256) {
        item.detail = 'QROTATE',
            item.documentation = 'Rotate a vector by a quaternion';
    }
    else if (item.data === 257) {
        item.detail = 'QROTATION',
            item.documentation = 'Extract the axis and angle of the rotation represented by the quaternion on the stack.';
    }
    else if (item.data === 258) {
        item.detail = 'Q->',
            item.documentation = 'Converts 4 double to a unit quaternion.';
    }
    else if (item.data === 259) {
        item.detail = 'ROTATIONQ',
            item.documentation = 'Create a quaternion from an axis and rotation angle (in degrees)';
    }
    else if (item.data === 260) {
        item.detail = '->Q',
            item.documentation = 'Converts 4 double to a unit quaternion.';
    }
    else if (item.data === 261) {
        item.detail = 'BITCOUNT',
            item.documentation = 'Computes the length of a bitset and the number of bits set.';
    }
    else if (item.data === 262) {
        item.detail = 'BITGET',
            item.documentation = 'Gets a bit in a bits set.';
    }
    else if (item.data === 263) {
        item.detail = 'BITSTOBYTES',
            item.documentation = 'Converts a bitset into a byte array.';
    }
    else if (item.data === 264) {
        item.detail = 'BYTESTOBITS',
            item.documentation = 'Converts a byte array into a bitset.';
    }
    else if (item.data === 265) {
        item.detail = 'ASSERT',
            item.documentation = 'Halt execution of the script if the top of the stack is not the BOOLEAN true';
    }
    else if (item.data === 266) {
        item.detail = 'BREAK',
            item.documentation = 'Break out of the current loop';
    }
    else if (item.data === 267) {
        item.detail = 'CONTINUE',
            item.documentation = 'Immediately start a new iteration in a running loop.';
    }
    else if (item.data === 268) {
        item.detail = 'DEFINED',
            item.documentation = 'Check whether or not a symbol is defined';
    }
    else if (item.data === 269) {
        item.detail = 'DEFINEDMACRO',
            item.documentation = 'Checks if a macro is defined and pushes true or false on the stack accordingly.';
    }
    else if (item.data === 270) {
        item.detail = 'EVAL',
            item.documentation = 'Evaluates the string on top of the stack';
    }
    else if (item.data === 271) {
        item.detail = 'FAIL',
            item.documentation = 'Halt execution of the script';
    }
    else if (item.data === 272) {
        item.detail = 'FOR',
            item.documentation = 'Implement a for loop';
    }
    else if (item.data === 273) {
        item.detail = 'FOREACH',
            item.documentation = 'Implement a foreach loop on a list or map';
    }
    else if (item.data === 274) {
        item.detail = 'FORSTEP',
            item.documentation = 'Implement a for loop with an index step';
    }
    else if (item.data === 275) {
        item.detail = 'IFT',
            item.documentation = 'Implement the if-then conditional';
    }
    else if (item.data === 276) {
        item.detail = 'IFTE',
            item.documentation = 'Implement the if-then-else conditional';
    }
    else if (item.data === 277) {
        item.detail = 'MSGFAIL',
            item.documentation = 'Halt execution of the script, returning the message on top of the stack.';
    }
    else if (item.data === 278) {
        item.detail = 'NRETURN',
            item.documentation = 'Immediately exit N macros being executed.';
    }
    else if (item.data === 279) {
        item.detail = 'RETURN',
            item.documentation = 'Immediately exit the macro being executed.';
    }
    else if (item.data === 280) {
        item.detail = 'STOP',
            item.documentation = 'Immediately stop executing WarpScript.';
    }
    else if (item.data === 281) {
        item.detail = 'SWITCH',
            item.documentation = 'Implement a switch-like conditional';
    }
    else if (item.data === 282) {
        item.detail = 'UNTIL',
            item.documentation = 'Implement an until loop';
    }
    else if (item.data === 283) {
        item.detail = 'WHILE',
            item.documentation = 'Implement a while loop';
    }
    else if (item.data === 284) {
        item.detail = 'CLONEREVERSE',
            item.documentation = 'Clone a LIST and reverse its order';
    }
    else if (item.data === 285) {
        item.detail = 'CONTAINS',
            item.documentation = 'Check if an element is in a LIST';
    }
    else if (item.data === 286) {
        item.detail = 'CONTAINSKEY',
            item.documentation = 'Check if an element is one of the keys of a MAP';
    }
    else if (item.data === 287) {
        item.detail = 'CONTAINSVALUE',
            item.documentation = 'Check if an element is one of the values of a MAP';
    }
    else if (item.data === 288) {
        item.detail = 'FLATTEN',
            item.documentation = 'Flatten a LIST';
    }
    else if (item.data === 289) {
        item.detail = 'GET',
            item.documentation = 'Retrieve a value in a MAP or in a LIST';
    }
    else if (item.data === 290) {
        item.detail = 'KEYLIST',
            item.documentation = 'Extract the keys of a MAP';
    }
    else if (item.data === 291) {
        item.detail = 'LFLATMAP',
            item.documentation = 'Apply a macro on each element of a list';
    }
    else if (item.data === 292) {
        item.detail = 'LIST->',
            item.documentation = 'Extract the elements of a LIST';
    }
    else if (item.data === 293) {
        item.detail = 'LMAP',
            item.documentation = 'Apply a macro on each element of a list';
    }
    else if (item.data === 294) {
        item.detail = 'MAPID',
            item.documentation = 'Generates a fingerprint of a map.';
    }
    else if (item.data === 295) {
        item.detail = 'MAT->',
            item.documentation = 'Converts a Matrix into nested lists';
    }
    else if (item.data === 296) {
        item.detail = 'MSORT',
            item.documentation = 'Sort a MAP';
    }
    else if (item.data === 297) {
        item.detail = 'PACK',
            item.documentation = 'Pack a list of numeric or boolean values according to a specified format';
    }
    else if (item.data === 298) {
        item.detail = 'SIZE',
            item.documentation = 'Push on the stack the size of a LIST, map or GTS';
    }
    else if (item.data === 299) {
        item.detail = 'SUBLIST',
            item.documentation = 'Create a sub-LIST keeping only certain elements';
    }
    else if (item.data === 300) {
        item.detail = 'SUBMAP',
            item.documentation = 'Create a sub-MAP keeping only certain pairs key-value';
    }
    else if (item.data === 301) {
        item.detail = '->LIST',
            item.documentation = 'Creates a LIST with the top `N` elements of the stack';
    }
    else if (item.data === 302) {
        item.detail = '->MAP',
            item.documentation = 'Creates a MAP with the top `N` elements of the stack';
    }
    else if (item.data === 303) {
        item.detail = '->MAT',
            item.documentation = 'Converts nested lists of numbers into a Matrix';
    }
    else if (item.data === 304) {
        item.detail = '->V',
            item.documentation = 'Convert the list on top of the stack into a set';
    }
    else if (item.data === 305) {
        item.detail = '->VEC',
            item.documentation = 'Converts a list of numbers into a Vector';
    }
    else if (item.data === 306) {
        item.detail = 'UNIQUE',
            item.documentation = 'Eliminates duplicate elements on a LIST';
    }
    else if (item.data === 307) {
        item.detail = 'UNLIST',
            item.documentation = 'Push onto the stack all elements of the list on top of a Mark.';
    }
    else if (item.data === 308) {
        item.detail = 'UNMAP',
            item.documentation = 'Deconstructs a map, putting each key/value pair as two elements on the stack on top of a Mark.';
    }
    else if (item.data === 309) {
        item.detail = 'UNPACK',
            item.documentation = 'Unpack a list of numeric or boolean values according to a specified format';
    }
    else if (item.data === 310) {
        item.detail = 'VALUELIST',
            item.documentation = 'Extract the values of a MAP';
    }
    else if (item.data === 311) {
        item.detail = 'VEC->',
            item.documentation = 'Converts a Vector into a list';
    }
    else if (item.data === 312) {
        item.detail = 'V->',
            item.documentation = 'Convert the set on top of the stack into a list';
    }
    else if (item.data === 313) {
        item.detail = 'ZIP',
            item.documentation = '';
    }
    else if (item.data === 314) {
        item.detail = 'DIFFERENCE',
            item.documentation = 'Computes the difference of two sets';
    }
    else if (item.data === 315) {
        item.detail = 'INTERSECTION',
            item.documentation = 'Computes the intersection of two sets.';
    }
    else if (item.data === 316) {
        item.detail = 'SET',
            item.documentation = 'Replace an element in a list';
    }
    else if (item.data === 317) {
        item.detail = 'SET->',
            item.documentation = 'Converts the list on top of the stack into a set';
    }
    else if (item.data === 318) {
        item.detail = '->SET',
            item.documentation = 'Converts the list on top of the stack into a set';
    }
    else if (item.data === 319) {
        item.detail = 'UNION',
            item.documentation = 'Performs the union of two sets.';
    }
    else if (item.data === 320) {
        item.detail = 'APPEND',
            item.documentation = 'Append a LIST or MAP to another';
    }
    else if (item.data === 321) {
        item.detail = 'LSORT',
            item.documentation = 'Sort a LIST';
    }
    else if (item.data === 322) {
        item.detail = 'PUT',
            item.documentation = 'Insert a key-value pair into a MAP';
    }
    else if (item.data === 323) {
        item.detail = 'REMOVE',
            item.documentation = 'Remove an entry from a LIST or MAP';
    }
    else if (item.data === 324) {
        item.detail = 'REVERSE',
            item.documentation = 'Reverse the order of a LIST';
    }
    else if (item.data === 325) {
        item.detail = 'GEOHASH->',
            item.documentation = 'Converts a GeoHash to a lat/lon.';
    }
    else if (item.data === 326) {
        item.detail = 'GEOPACK',
            item.documentation = 'Encode a geo zone into a compact representation.';
    }
    else if (item.data === 327) {
        item.detail = 'GEOREGEXP',
            item.documentation = 'Produces a regexp from a GeoXPShape';
    }
    else if (item.data === 328) {
        item.detail = 'GEOUNPACK',
            item.documentation = 'Decodes a packed geo zone.';
    }
    else if (item.data === 329) {
        item.detail = 'GEO.DIFFERENCE',
            item.documentation = 'Computes the difference of two GeoXP Shapes.';
    }
    else if (item.data === 330) {
        item.detail = 'GEO.INTERSECTION',
            item.documentation = 'Computes the intersection of two GeoXP Shapes.';
    }
    else if (item.data === 331) {
        item.detail = 'GEO.INTERSECTS',
            item.documentation = 'Checks if a Geo Time Series has at least one point within a shape.';
    }
    else if (item.data === 332) {
        item.detail = 'GEO.JSON',
            item.documentation = 'Converts a GeoJSON string into a GeoXP Shape suitable for geo filtering';
    }
    else if (item.data === 333) {
        item.detail = 'GEO.UNION',
            item.documentation = 'Computes the union of two GeoXP Shapes.';
    }
    else if (item.data === 334) {
        item.detail = 'GEO.WITHIN',
            item.documentation = 'Checks if a Geo Time Series has all its points within a shape.';
    }
    else if (item.data === 335) {
        item.detail = 'GEO.WKT',
            item.documentation = 'Converts a Well Known Text String into a GeoXP Shape suitable for geo filtering';
    }
    else if (item.data === 336) {
        item.detail = 'HAVERSINE',
            item.documentation = 'Computes distance between two locations using the Haversine formula.';
    }
    else if (item.data === 337) {
        item.detail = 'HHCODE->',
            item.documentation = 'Converts an HHCode to a lat/lon.';
    }
    else if (item.data === 338) {
        item.detail = '->GEOHASH',
            item.documentation = 'Converts lat/lon to a GeoHash.';
    }
    else if (item.data === 339) {
        item.detail = '->HHCODE',
            item.documentation = 'Converts lat/lon to an Helical Hyperspatial Code (HHCode).';
    }
    else if (item.data === 340) {
        item.detail = 'CHUNK',
            item.documentation = 'Chunks a GTS into partial GTS.';
    }
    else if (item.data === 341) {
        item.detail = 'CLIP',
            item.documentation = 'Clip a Geo Time Series according to a series of limits.';
    }
    else if (item.data === 342) {
        item.detail = 'SHRINK',
            item.documentation = 'Shrink the number of values of a GTS';
    }
    else if (item.data === 343) {
        item.detail = 'TIMECLIP',
            item.documentation = 'Clip a Geo Time Series to only retain ticks that are within a given time range';
    }
    else if (item.data === 344) {
        item.detail = 'TIMEMODULO',
            item.documentation = 'Split a Geo Time Serie into a LIST of GTS whose timestamps are original timestamps modulo a value passed as parameter';
    }
    else if (item.data === 345) {
        item.detail = 'TIMESCALE',
            item.documentation = 'Modify ticks by multiplying them by a scaling factor.';
    }
    else if (item.data === 346) {
        item.detail = 'TIMESHIFT',
            item.documentation = 'Shift the ticks of a Geo Time Series';
    }
    else if (item.data === 347) {
        item.detail = 'TIMESPLIT',
            item.documentation = 'Splits a Geo Time Series at the quiet periods';
    }
    else if (item.data === 348) {
        item.detail = 'CORRELATE',
            item.documentation = 'Compute correlation between Geo Time Series';
    }
    else if (item.data === 349) {
        item.detail = 'CPROB',
            item.documentation = 'Computes a conditional probability of each value in a Geo Time Series';
    }
    else if (item.data === 350) {
        item.detail = 'ISONORMALIZE',
            item.documentation = 'Normalize (between -1 and 1) the values of a Geo Time Series';
    }
    else if (item.data === 351) {
        item.detail = 'LOWESS',
            item.documentation = 'Smooths a Geo Time Series using local regression';
    }
    else if (item.data === 352) {
        item.detail = 'LTTB',
            item.documentation = 'Downsamples a Geo Time Series using \'Least Triangle Three Bucket\'';
    }
    else if (item.data === 353) {
        item.detail = 'MODE',
            item.documentation = 'Compute the mode(s) for a given GTS';
    }
    else if (item.data === 354) {
        item.detail = 'MONOTONIC',
            item.documentation = 'Modifies the values of a Geo Time Series so it is monotonous.';
    }
    else if (item.data === 355) {
        item.detail = 'MUSIGMA',
            item.documentation = 'Calculate the mean and the standard deviation of a Geo Time Series';
    }
    else if (item.data === 356) {
        item.detail = 'NORMALIZE',
            item.documentation = 'Normalize between 0 and 1 the values a Geo Time Series';
    }
    else if (item.data === 357) {
        item.detail = 'NSUMSUMSQ',
            item.documentation = 'Computes the cardinality, sum of values and sum of squared values of a Geo Time Series.';
    }
    else if (item.data === 358) {
        item.detail = 'PROB',
            item.documentation = 'Computes the probability of each value in a Geo Time Series';
    }
    else if (item.data === 359) {
        item.detail = 'RLOWESS',
            item.documentation = 'Robust and iterative smoothing of a Geo Time Series';
    }
    else if (item.data === 360) {
        item.detail = 'SINGLEEXPONENTIALSMOOTHING',
            item.documentation = 'Smooth a Geo Time Series with the given smoothing factor alpha';
    }
    else if (item.data === 361) {
        item.detail = 'STANDARDIZE',
            item.documentation = 'Replace Geo Time Series values with their standardized score';
    }
    else if (item.data === 362) {
        item.detail = 'TLTTB',
            item.documentation = 'Downsamples a Geo Time Series using time based \'Least Triangle Three Bucket\'';
    }
    else if (item.data === 363) {
        item.detail = 'VALUEHISTOGRAM',
            item.documentation = 'Builds a value histogram for a GTS.';
    }
    else if (item.data === 364) {
        item.detail = 'DWTSPLIT',
            item.documentation = 'Split a Geo Time Series produced by FDWT into a set of series based on the resolution level.';
    }
    else if (item.data === 365) {
        item.detail = 'FDWT',
            item.documentation = 'Computes a Forward Discrete Wavelet Transform on a GTS.';
    }
    else if (item.data === 366) {
        item.detail = 'FFT',
            item.documentation = 'Computes a Fast Fourier Transform on a GTS.';
    }
    else if (item.data === 367) {
        item.detail = 'FFTAP',
            item.documentation = 'Computes a Fast Fourier Transform on a GTS, returning amplitude and phase.';
    }
    else if (item.data === 368) {
        item.detail = 'IDWT',
            item.documentation = 'Computes an Inverse Discrete Wavelet Transform on a GTS.';
    }
    else if (item.data === 369) {
        item.detail = 'IFFT',
            item.documentation = 'Computes an Inverse Fast Fourier Transform.';
    }
    else if (item.data === 370) {
        item.detail = 'CLONE',
            item.documentation = 'Make a deep copy of a GTS';
    }
    else if (item.data === 371) {
        item.detail = 'CLONEEMPTY',
            item.documentation = 'Push onto the stack an empty clone of the argument GTS';
    }
    else if (item.data === 372) {
        item.detail = 'COMMONTICKS',
            item.documentation = 'Modifies Geo Time Series so they all have the same ticks, the set of ticks common to all input Geo Time Series.';
    }
    else if (item.data === 373) {
        item.detail = 'COMPACT',
            item.documentation = 'Remove measurements which have the same value, location and elevation as the previous one';
    }
    else if (item.data === 374) {
        item.detail = 'DEDUP',
            item.documentation = 'Remove duplicate timestamps from a Geo Time Series';
    }
    else if (item.data === 375) {
        item.detail = 'FILLTICKS',
            item.documentation = 'Add values to a GTS at given ticks';
    }
    else if (item.data === 376) {
        item.detail = 'INTEGRATE',
            item.documentation = 'Integrate a Geo Time Serie';
    }
    else if (item.data === 377) {
        item.detail = 'LASTSORT',
            item.documentation = 'Sorts a list of Geo Time Series according to their most recent value.';
    }
    else if (item.data === 378) {
        item.detail = 'MERGE',
            item.documentation = 'Merge two Geo Time Series';
    }
    else if (item.data === 379) {
        item.detail = 'NONEMPTY',
            item.documentation = 'Check whether or not a Geo Time Series has values';
    }
    else if (item.data === 380) {
        item.detail = 'PARTITION',
            item.documentation = 'Splits GTS in equivalence classes based on label values.';
    }
    else if (item.data === 381) {
        item.detail = 'QUANTIZE',
            item.documentation = 'Generates a quantified version of a Geo Time Series.';
    }
    else if (item.data === 382) {
        item.detail = 'RANGECOMPACT',
            item.documentation = 'Remove intermediate values on constant ranges of a GTS';
    }
    else if (item.data === 383) {
        item.detail = 'RESETS',
            item.documentation = 'Remove resets in Geo Time Series values';
    }
    else if (item.data === 384) {
        item.detail = 'RSORT',
            item.documentation = 'Sort a Geo Time Series by descending timestamps';
    }
    else if (item.data === 385) {
        item.detail = 'RVALUESORT',
            item.documentation = 'Sorts Geo Time Series by reverse order according to its values';
    }
    else if (item.data === 386) {
        item.detail = 'SORT',
            item.documentation = 'Sort a Geo Time Series by ascending timestamps';
    }
    else if (item.data === 387) {
        item.detail = 'SORTBY',
            item.documentation = 'Sort list of Geo Time Series according to values extracted by a macro';
    }
    else if (item.data === 388) {
        item.detail = 'UNWRAP',
            item.documentation = 'Decode a Geo Time Series previously encoded by WRAP.';
    }
    else if (item.data === 389) {
        item.detail = 'VALUEDEDUP',
            item.documentation = 'Remove duplicate values from a Geo Time Series';
    }
    else if (item.data === 390) {
        item.detail = 'VALUESORT',
            item.documentation = 'Sorts Geo Time Series according to its values.';
    }
    else if (item.data === 391) {
        item.detail = 'VALUESPLIT',
            item.documentation = 'Split a Geo Time Series into N distinct GTS, one for each distinct value';
    }
    else if (item.data === 392) {
        item.detail = 'WRAP',
            item.documentation = 'Efficiently encode a Geo Time Series or a list thereof into strings.';
    }
    else if (item.data === 393) {
        item.detail = 'WRAPRAW',
            item.documentation = 'Efficiently encode a Geo Time Series or a list thereof into byte arrays.';
    }
    else if (item.data === 394) {
        item.detail = 'MAKEGTS',
            item.documentation = 'Builds a GTS from arrays.';
    }
    else if (item.data === 395) {
        item.detail = 'NEWGTS',
            item.documentation = 'Push an empty Geo Time Series onto the stack';
    }
    else if (item.data === 396) {
        item.detail = 'PARSE',
            item.documentation = 'Parse a STRING into a set of Geo Time Series';
    }
    else if (item.data === 397) {
        item.detail = 'DELETE',
            item.documentation = 'Delete a set of GTS.';
    }
    else if (item.data === 398) {
        item.detail = 'FETCH',
            item.documentation = 'Fetch data from Warp10\'s datastore';
    }
    else if (item.data === 399) {
        item.detail = 'FETCHBOOLEAN',
            item.documentation = 'Fetches data from the store, forcing the returned Geo Time Series to be of type BOOLEAN.';
    }
    else if (item.data === 400) {
        item.detail = 'FETCHDOUBLE',
            item.documentation = 'Fetches data from the store, forcing the returned Geo Time Series to be of type DOUBLE.';
    }
    else if (item.data === 401) {
        item.detail = 'FETCHLONG',
            item.documentation = 'Fetches data from the store, forcing the returned Geo Time Series to be of type LONG.';
    }
    else if (item.data === 402) {
        item.detail = 'FETCHSTRING',
            item.documentation = 'Fetches data from the store, forcing the returned Geo Time Series to be of type STRING.';
    }
    else if (item.data === 403) {
        item.detail = 'FIND',
            item.documentation = 'Find Geo Time Series matching some criteria';
    }
    else if (item.data === 404) {
        item.detail = 'FINDSTATS',
            item.documentation = 'Computes statistics on matching GTS.';
    }
    else if (item.data === 405) {
        item.detail = 'UPDATE',
            item.documentation = 'Pushes datapoints to the Warp 10 backend.';
    }
    else if (item.data === 406) {
        item.detail = 'DISCORDS',
            item.documentation = 'Detects discords in a Geo Time Series.';
    }
    else if (item.data === 407) {
        item.detail = 'DTW',
            item.documentation = 'Computes similarity between two Geo Time Series using Dynamic Time Warping.';
    }
    else if (item.data === 408) {
        item.detail = 'OPTDTW',
            item.documentation = 'Find the N optimal matches for a query sequence using Dynamic Time Warping.';
    }
    else if (item.data === 409) {
        item.detail = 'PATTERNDETECTION',
            item.documentation = 'Detect patterns in a Geo Time Series.';
    }
    else if (item.data === 410) {
        item.detail = 'PATTERNS',
            item.documentation = 'Extract patterns from a Geo Time Series.';
    }
    else if (item.data === 411) {
        item.detail = 'ZDISCORDS',
            item.documentation = 'Detects discords in a standardized Geo Time Series.';
    }
    else if (item.data === 412) {
        item.detail = 'ZPATTERNDETECTION',
            item.documentation = 'Detect patterns in a standardized Geo Time Series.';
    }
    else if (item.data === 413) {
        item.detail = 'ZPATTERNS',
            item.documentation = 'Extract patterns from a standardized Geo Time Series.';
    }
    else if (item.data === 414) {
        item.detail = 'ZSCORE',
            item.documentation = 'Normalize by the mean or median, using Z-score';
    }
    else if (item.data === 415) {
        item.detail = 'ESDTEST',
            item.documentation = 'Detect outliers using an generalized extreme studentized deviate test';
    }
    else if (item.data === 416) {
        item.detail = 'GRUBBSTEST',
            item.documentation = 'Detect outliers using a Grubbs\' test';
    }
    else if (item.data === 417) {
        item.detail = 'HYBRIDTEST',
            item.documentation = 'Detect outliers using Seasonal Hybrid ESD test';
    }
    else if (item.data === 418) {
        item.detail = 'HYBRIDTEST2',
            item.documentation = 'Detect outliers using Seasonal Entropy Hybrid ESD test';
    }
    else if (item.data === 419) {
        item.detail = 'STLESDTEST',
            item.documentation = 'Detect outliers using seasonal extract and an generalized extreme studentized deviate test';
    }
    else if (item.data === 420) {
        item.detail = 'THRESHOLDTEST',
            item.documentation = 'Detect outliers using a threshold test';
    }
    else if (item.data === 421) {
        item.detail = 'ZSCORETEST',
            item.documentation = 'Detect outliers using a Zscore test';
    }
    else if (item.data === 422) {
        item.detail = 'BBOX',
            item.documentation = 'Computes the bounding box of a Geo Time Series';
    }
    else if (item.data === 423) {
        item.detail = 'COPYGEO',
            item.documentation = 'Forces the location elements of a GTS onto others.';
    }
    else if (item.data === 424) {
        item.detail = 'ELEVATIONS',
            item.documentation = 'Push Geo Time Series elevations onto the stack';
    }
    else if (item.data === 425) {
        item.detail = 'LOCATIONOFFSET',
            item.documentation = 'Downsamples a Geo Time Series by retaining only those datapoints farther away than a threshold distance';
    }
    else if (item.data === 426) {
        item.detail = 'LOCATIONS',
            item.documentation = 'Push Geo Time Series latitudes and longitudes onto the stack';
    }
    else if (item.data === 427) {
        item.detail = 'LOCSTRINGS',
            item.documentation = 'Pushes encoded locations of Geo Time Series onto the stack';
    }
    else if (item.data === 428) {
        item.detail = 'ATTRIBUTES',
            item.documentation = 'Retrieves the attributes of a GTS.';
    }
    else if (item.data === 429) {
        item.detail = 'LABELS',
            item.documentation = 'Push the labels of a Geo Time Series onto the stack';
    }
    else if (item.data === 430) {
        item.detail = 'META',
            item.documentation = 'Sets the attributes of a list of Geo Time Series in the Warp 10 backend.';
    }
    else if (item.data === 431) {
        item.detail = 'METASORT',
            item.documentation = 'Sorts a list of Geo Time Series according to their metadata (class + labels).';
    }
    else if (item.data === 432) {
        item.detail = 'NAME',
            item.documentation = 'Push the class name of a Geo Time Series onto the stack';
    }
    else if (item.data === 433) {
        item.detail = 'PARSESELECTOR',
            item.documentation = 'Parse a Geo Time Series selector into a class selector and a labels selection MAP';
    }
    else if (item.data === 434) {
        item.detail = 'RELABEL',
            item.documentation = 'Modify the labels of a Geo Time Series';
    }
    else if (item.data === 435) {
        item.detail = 'RENAME',
            item.documentation = 'Rename a Geo Time Series';
    }
    else if (item.data === 436) {
        item.detail = 'SETATTRIBUTES',
            item.documentation = 'Set attributes of a GTS.';
    }
    else if (item.data === 437) {
        item.detail = 'TOSELECTOR',
            item.documentation = 'Transform a class selector and a labels selection MAPs into a Geo Time Series selector';
    }
    else if (item.data === 438) {
        item.detail = 'ADDVALUE',
            item.documentation = 'Add a value to a GTS';
    }
    else if (item.data === 439) {
        item.detail = 'ATINDEX',
            item.documentation = 'Extract the timestamp, longitude, lattitude, elevation and value for the N-th point of the GTS';
    }
    else if (item.data === 440) {
        item.detail = 'ATTICK',
            item.documentation = 'Extract the timestamp, longitude, lattitude, elevation and value for a given timestamp of the GTS';
    }
    else if (item.data === 441) {
        item.detail = 'FIRSTTICK',
            item.documentation = 'Push onto the stack the timestamp of the first tick of a Geo Time Series';
    }
    else if (item.data === 442) {
        item.detail = 'LASTTICK',
            item.documentation = 'Push onto the stack the timestamp of the last tick of a Geo Time Series';
    }
    else if (item.data === 443) {
        item.detail = 'SETVALUE',
            item.documentation = 'Adds a value to a GTS, overwriting the value at the given timestamp.';
    }
    else if (item.data === 444) {
        item.detail = 'TICKINDEX',
            item.documentation = 'Reindex the ticks of Geo Time Series';
    }
    else if (item.data === 445) {
        item.detail = 'TICKLIST',
            item.documentation = 'Push Geo Time Series ticks onto the stack';
    }
    else if (item.data === 446) {
        item.detail = 'TICKS',
            item.documentation = 'Push Geo Time Series timestamps onto the stack';
    }
    else if (item.data === 447) {
        item.detail = 'VALUES',
            item.documentation = 'Push Geo Time Series values onto the stack';
    }
    else if (item.data === 448) {
        item.detail = 'ATBUCKET',
            item.documentation = 'Extracts the data from a bucket of a Geo Time Series';
    }
    else if (item.data === 449) {
        item.detail = 'BUCKETCOUNT',
            item.documentation = 'Extract bucketcount from a bucketized Geo Time Series';
    }
    else if (item.data === 450) {
        item.detail = 'BUCKETSPAN',
            item.documentation = 'Extract bucketspan from a bucketized Geo Time Series';
    }
    else if (item.data === 451) {
        item.detail = 'CROP',
            item.documentation = 'Rebucketize a Geo Time Series';
    }
    else if (item.data === 452) {
        item.detail = 'FILLNEXT',
            item.documentation = 'Fill missing values in a bucketized Geo Time Series with the next known value';
    }
    else if (item.data === 453) {
        item.detail = 'FILLPREVIOUS',
            item.documentation = 'Fill missing values in a bucketized Geo Time Series with the last known value';
    }
    else if (item.data === 454) {
        item.detail = 'FILLVALUE',
            item.documentation = 'Fill missing values in a bucketized Geo Time Series with a constant';
    }
    else if (item.data === 455) {
        item.detail = 'INTERPOLATE',
            item.documentation = 'Fill gaps in bucketized Geo Time Series';
    }
    else if (item.data === 456) {
        item.detail = 'LASTBUCKET',
            item.documentation = 'Push the end timestamp of the last bucket of a bucketized Geo Time Series';
    }
    else if (item.data === 457) {
        item.detail = 'STL',
            item.documentation = 'Apply Seasonal Trend decomposition based on Loess procedure';
    }
    else if (item.data === 458) {
        item.detail = 'UNBUCKETIZE',
            item.documentation = 'Force a Geo Time Series to be un-bucketized';
    }
    else if (item.data === 459) {
        item.detail = 'REDUCE',
            item.documentation = 'Apply a reducer function to a set of Geo Time Series';
    }
    else if (item.data === 460) {
        item.detail = 'MACROREDUCER',
            item.documentation = 'Converts a macro into a reducer';
    }
    else if (item.data === 461) {
        item.detail = 'reducer.and',
            item.documentation = 'Compute and between the values';
    }
    else if (item.data === 462) {
        item.detail = 'reducer.and.exclude-nulls',
            item.documentation = 'Compute and between the values';
    }
    else if (item.data === 463) {
        item.detail = 'reducer.argmax',
            item.documentation = 'Returns the ticks and labels for the maximum value';
    }
    else if (item.data === 464) {
        item.detail = 'reducer.argmin',
            item.documentation = '';
    }
    else if (item.data === 465) {
        item.detail = 'reducer.count',
            item.documentation = 'Return the number of values';
    }
    else if (item.data === 466) {
        item.detail = 'reducer.join',
            item.documentation = 'Return a string concatenating all values';
    }
    else if (item.data === 467) {
        item.detail = 'reducer.join.forbid-nulls',
            item.documentation = 'Return a string concatenating all values excluding nulls';
    }
    else if (item.data === 468) {
        item.detail = 'reducer.max',
            item.documentation = 'Return the maximum of the values';
    }
    else if (item.data === 469) {
        item.detail = 'reducer.max.forbid-nulls',
            item.documentation = 'Return the maximum of the values excluding nulls';
    }
    else if (item.data === 470) {
        item.detail = 'reducer.mean',
            item.documentation = 'Return the mean of the values';
    }
    else if (item.data === 471) {
        item.detail = 'reducer.mean.exclude-nulls',
            item.documentation = 'Return the mean of the values';
    }
    else if (item.data === 472) {
        item.detail = 'reducer.median',
            item.documentation = 'Return the median of the values';
    }
    else if (item.data === 473) {
        item.detail = 'reducer.min',
            item.documentation = 'Return the minimum of the values';
    }
    else if (item.data === 474) {
        item.detail = 'reducer.min.forbid-nulls',
            item.documentation = 'Return the minimum of the values excluding nulls';
    }
    else if (item.data === 475) {
        item.detail = 'reducer.or',
            item.documentation = 'Compute or between the values';
    }
    else if (item.data === 476) {
        item.detail = 'reducer.or.exclude-nulls',
            item.documentation = 'Compute or between the values';
    }
    else if (item.data === 477) {
        item.detail = 'reducer.sd',
            item.documentation = 'Return the standard deviation of the values';
    }
    else if (item.data === 478) {
        item.detail = 'reducer.shannonentropy.0',
            item.documentation = 'Return the entropy of a sliding window. 0 if singleton.';
    }
    else if (item.data === 479) {
        item.detail = 'reducer.shannonentropy.1',
            item.documentation = 'Return the entropy of a sliding window. 1 if singleton.';
    }
    else if (item.data === 480) {
        item.detail = 'reducer.sum',
            item.documentation = 'Return the sum of the values';
    }
    else if (item.data === 481) {
        item.detail = 'reducer.sum.forbid-nulls',
            item.documentation = 'Return the sum of the values excluding nulls';
    }
    else if (item.data === 482) {
        item.detail = 'reducer.var',
            item.documentation = 'Return the variance of the values';
    }
    else if (item.data === 483) {
        item.detail = 'MAP',
            item.documentation = 'Apply a function on values of a Geo Time Series that fall into a sliding window';
    }
    else if (item.data === 484) {
        item.detail = 'MACROMAPPER',
            item.documentation = 'Converts a macro into a mapper';
    }
    else if (item.data === 485) {
        item.detail = 'STRICTMAPPER',
            item.documentation = 'Wrap a mapper to add a condition onto the number of values in the input sliding window';
    }
    else if (item.data === 486) {
        item.detail = 'mapper.join',
            item.documentation = 'Push onto the stack a mapper to return the concatenation of the string representation of values separated by a separator.';
    }
    else if (item.data === 487) {
        item.detail = 'mapper.npdf',
            item.documentation = 'Push onto the stack a mapper to compute the probability of a value within a gaussian distribution with mu/sigma.';
    }
    else if (item.data === 488) {
        item.detail = 'mapper.percentile',
            item.documentation = 'Push onto the stack a mapper to compute the Nth percentile of the values on the interval.';
    }
    else if (item.data === 489) {
        item.detail = 'mapper.truecourse',
            item.documentation = 'Push onto the stack a mapper to compute the true course between points on a great circle.';
    }
    else if (item.data === 490) {
        item.detail = 'mapper.and',
            item.documentation = 'Compute and between the values';
    }
    else if (item.data === 491) {
        item.detail = 'mapper.count',
            item.documentation = 'Counts the number of values';
    }
    else if (item.data === 492) {
        item.detail = 'mapper.delta',
            item.documentation = 'Return the delta between the last and first values';
    }
    else if (item.data === 493) {
        item.detail = 'mapper.dotproduct',
            item.documentation = 'Return the dotproduct of the values with a given LIST';
    }
    else if (item.data === 494) {
        item.detail = 'mapper.dotproduct.positive',
            item.documentation = 'Return the dotproduct of the values with a given LIST';
    }
    else if (item.data === 495) {
        item.detail = 'mapper.dotproduct.sigmoid',
            item.documentation = 'Return the dotproduct of the values with a given LIST';
    }
    else if (item.data === 496) {
        item.detail = 'mapper.dotproduct.tanh',
            item.documentation = 'Return the dotproduct of the values with a given LIST';
    }
    else if (item.data === 497) {
        item.detail = 'mapper.eq',
            item.documentation = 'Return the first value equal to a given value';
    }
    else if (item.data === 498) {
        item.detail = 'mapper.first',
            item.documentation = 'Return the first value';
    }
    else if (item.data === 499) {
        item.detail = 'mapper.ge',
            item.documentation = 'Return the first value greater or equal to a given value';
    }
    else if (item.data === 500) {
        item.detail = 'mapper.gt',
            item.documentation = 'Return the first value greater than a given value';
    }
    else if (item.data === 501) {
        item.detail = 'mapper.hdist',
            item.documentation = 'Return the horizontal distance';
    }
    else if (item.data === 502) {
        item.detail = 'mapper.highest',
            item.documentation = 'Return the value with the highest elevation';
    }
    else if (item.data === 503) {
        item.detail = 'mapper.hspeed',
            item.documentation = 'Return the horizontal speed';
    }
    else if (item.data === 504) {
        item.detail = 'mapper.last',
            item.documentation = 'Return the last value';
    }
    else if (item.data === 505) {
        item.detail = 'mapper.le',
            item.documentation = 'Return the first value lesser or equal to a given value';
    }
    else if (item.data === 506) {
        item.detail = 'mapper.lowest',
            item.documentation = 'Return the value with the highest elevation';
    }
    else if (item.data === 507) {
        item.detail = 'mapper.lt',
            item.documentation = 'Return the first value lesser than a given value';
    }
    else if (item.data === 508) {
        item.detail = 'mapper.max.x',
            item.documentation = 'Return the maximum between a constant and each value';
    }
    else if (item.data === 509) {
        item.detail = 'mapper.mean',
            item.documentation = 'Return the mean of the values';
    }
    else if (item.data === 510) {
        item.detail = 'mapper.mean.circular',
            item.documentation = 'Pushes onto the stack a mapper suitable for computing the circular mean of values';
    }
    else if (item.data === 511) {
        item.detail = 'mapper.median',
            item.documentation = 'Return the median of the values';
    }
    else if (item.data === 512) {
        item.detail = 'mapper.min',
            item.documentation = 'Return the minimum of the values';
    }
    else if (item.data === 513) {
        item.detail = 'mapper.min.x',
            item.documentation = 'Return the minimum between a constant and each value';
    }
    else if (item.data === 514) {
        item.detail = 'mapper.ne',
            item.documentation = 'Return the first value equal to a given value';
    }
    else if (item.data === 515) {
        item.detail = 'mapper.or',
            item.documentation = 'Compute or between the values';
    }
    else if (item.data === 516) {
        item.detail = 'mapper.product',
            item.documentation = 'Return the product of the values';
    }
    else if (item.data === 517) {
        item.detail = 'mapper.rate',
            item.documentation = 'Return the rate of change between the last and first values';
    }
    else if (item.data === 518) {
        item.detail = 'mapper.replace',
            item.documentation = 'Replace value with a constant';
    }
    else if (item.data === 519) {
        item.detail = 'mapper.sd',
            item.documentation = 'Return the standard deviation of the values';
    }
    else if (item.data === 520) {
        item.detail = 'mapper.sum',
            item.documentation = 'Return the sum of the values';
    }
    else if (item.data === 521) {
        item.detail = 'mapper.var',
            item.documentation = 'Return the variance of the values';
    }
    else if (item.data === 522) {
        item.detail = 'mapper.vdist',
            item.documentation = 'Return the vertical distance';
    }
    else if (item.data === 523) {
        item.detail = 'mapper.vspeed',
            item.documentation = 'Return the vertical speed';
    }
    else if (item.data === 524) {
        item.detail = 'mapper.abs',
            item.documentation = 'Return the absolute value of the single value in a sliding window';
    }
    else if (item.data === 525) {
        item.detail = 'mapper.add',
            item.documentation = 'Add a constant to value';
    }
    else if (item.data === 526) {
        item.detail = 'mapper.ceil',
            item.documentation = 'Round the single value in a sliding window to the closests greater LONG';
    }
    else if (item.data === 527) {
        item.detail = 'mapper.day',
            item.documentation = 'Return the day of the tick for which it is computed';
    }
    else if (item.data === 528) {
        item.detail = 'mapper.exp',
            item.documentation = 'Raise a constant to the value power';
    }
    else if (item.data === 529) {
        item.detail = 'mapper.floor',
            item.documentation = 'Round the single value in a sliding window to the closests lower LONG';
    }
    else if (item.data === 530) {
        item.detail = 'mapper.hour',
            item.documentation = 'Return the hour of the tick for which it is computed';
    }
    else if (item.data === 531) {
        item.detail = 'mapper.log',
            item.documentation = 'Take the log of the value';
    }
    else if (item.data === 532) {
        item.detail = 'mapper.minute',
            item.documentation = 'Return the minute of the tick for which it is computed';
    }
    else if (item.data === 533) {
        item.detail = 'mapper.month',
            item.documentation = 'Return the month of the tick for which it is computed';
    }
    else if (item.data === 534) {
        item.detail = 'mapper.mul',
            item.documentation = 'Multiply the value by a constant';
    }
    else if (item.data === 535) {
        item.detail = 'mapper.todouble',
            item.documentation = 'Convert the single value in a sliding window to DOUBLE';
    }
    else if (item.data === 536) {
        item.detail = 'mapper.pow',
            item.documentation = 'Raise the value to a constant power';
    }
    else if (item.data === 537) {
        item.detail = 'mapper.round',
            item.documentation = 'Round the single value in a sliding window to the closests LONG';
    }
    else if (item.data === 538) {
        item.detail = 'mapper.second',
            item.documentation = 'Return the second of the tick for which it is computed';
    }
    else if (item.data === 539) {
        item.detail = 'mapper.sigmoid',
            item.documentation = 'Return the sigmoid of the single value in a sliding window';
    }
    else if (item.data === 540) {
        item.detail = 'mapper.tanh',
            item.documentation = 'Return the hyperbolic tangent of the single value in a sliding window';
    }
    else if (item.data === 541) {
        item.detail = 'mapper.tick',
            item.documentation = 'Return the tick for which it is computed';
    }
    else if (item.data === 542) {
        item.detail = 'mapper.toboolean',
            item.documentation = 'Convert the single value in a sliding window to boolean';
    }
    else if (item.data === 543) {
        item.detail = 'mapper.todouble',
            item.documentation = 'Convert the single value in a sliding window to DOUBLE';
    }
    else if (item.data === 544) {
        item.detail = 'mapper.tolong',
            item.documentation = 'Convert the single value in a sliding window to LONG';
    }
    else if (item.data === 545) {
        item.detail = 'mapper.tostring',
            item.documentation = 'Convert the single value in a sliding window to STRING';
    }
    else if (item.data === 546) {
        item.detail = 'mapper.weekday',
            item.documentation = 'Return the day of the week of the tick for which it is computed';
    }
    else if (item.data === 547) {
        item.detail = 'mapper.year',
            item.documentation = 'Return the year of the tick for which it is computed';
    }
    else if (item.data === 548) {
        item.detail = 'mapper.kernel.cosine',
            item.documentation = 'Pushes onto the stack a mapper which applies a cosine kernel function on the sliding window.';
    }
    else if (item.data === 549) {
        item.detail = 'mapper.kernel.epanechnikov',
            item.documentation = 'Pushes onto the stack a mapper which applies an epanechnikov kernel function on the sliding window.';
    }
    else if (item.data === 550) {
        item.detail = 'mapper.kernel.gaussian',
            item.documentation = 'Pushes onto the stack a mapper which applies a gaussian kernel function on the sliding window.';
    }
    else if (item.data === 551) {
        item.detail = 'mapper.kernel.logistic',
            item.documentation = 'Pushes onto the stack a mapper which applies a logistic kernel function on the sliding window.';
    }
    else if (item.data === 552) {
        item.detail = 'mapper.kernel.quartic',
            item.documentation = 'Pushes onto the stack a mapper which applies a quartic kernel function on the sliding window.';
    }
    else if (item.data === 553) {
        item.detail = 'mapper.kernel.silverman',
            item.documentation = 'Pushes onto the stack a mapper which applies a silverman kernel function on the sliding window.';
    }
    else if (item.data === 554) {
        item.detail = 'mapper.kernel.triangular',
            item.documentation = 'Pushes onto the stack a mapper which applies a triangular kernel function on the sliding window.';
    }
    else if (item.data === 555) {
        item.detail = 'mapper.kernel.tricube',
            item.documentation = 'Pushes onto the stack a mapper which applies a tricube kernel function on the sliding window.';
    }
    else if (item.data === 556) {
        item.detail = 'mapper.kernel.triweight',
            item.documentation = 'Pushes onto the stack a mapper which applies a triweight kernel function on the sliding window.';
    }
    else if (item.data === 557) {
        item.detail = 'mapper.kernel.uniform',
            item.documentation = 'Pushes onto the stack a mapper which applies a uniform kernel function on the sliding window.';
    }
    else if (item.data === 558) {
        item.detail = 'mapper.kernel.cosine',
            item.documentation = 'Push onto the stack a kernel smoothing mapper using a cosine kernel.';
    }
    else if (item.data === 559) {
        item.detail = 'mapper.kernel.epanechnikov',
            item.documentation = 'Push onto the stack a kernel smoothing mapper using an epanechnikov kernel.';
    }
    else if (item.data === 560) {
        item.detail = 'mapper.kernel.gaussian',
            item.documentation = 'Push onto the stack a kernel smoothing mapper using a gaussian kernel.';
    }
    else if (item.data === 561) {
        item.detail = 'mapper.kernel.logistic',
            item.documentation = 'Push onto the stack a kernel smoothing mapper using a logistic kernel.';
    }
    else if (item.data === 562) {
        item.detail = 'mapper.kernel.quartic',
            item.documentation = 'Push onto the stack a kernel smoothing mapper using a quartic kernel.';
    }
    else if (item.data === 563) {
        item.detail = 'mapper.kernel.silverman',
            item.documentation = 'Push onto the stack a kernel smoothing mapper using a silverman kernel.';
    }
    else if (item.data === 564) {
        item.detail = 'mapper.kernel.triangular',
            item.documentation = 'Push onto the stack a kernel smoothing mapper using a triangular kernel.';
    }
    else if (item.data === 565) {
        item.detail = 'mapper.kernel.tricube',
            item.documentation = 'Push onto the stack a kernel smoothing mapper using a tricube kernel.';
    }
    else if (item.data === 566) {
        item.detail = 'mapper.kernel.triweight',
            item.documentation = 'Push onto the stack a kernel smoothing mapper using a triweight kernel.';
    }
    else if (item.data === 567) {
        item.detail = 'mapper.kernel.uniform',
            item.documentation = 'Push onto the stack a kernel smoothing mapper using a uniform kernel.';
    }
    else if (item.data === 568) {
        item.detail = 'mapper.geo.approximate',
            item.documentation = 'Push onto the stack a mapper to approximate a location at the given resolution.';
    }
    else if (item.data === 569) {
        item.detail = 'mapper.geo.clear',
            item.documentation = 'Push onto the stack a mapper to remove the location info from readings.';
    }
    else if (item.data === 570) {
        item.detail = 'mapper.geo.outside',
            item.documentation = 'Filters the GTS, keeping only the points outside a geo zone';
    }
    else if (item.data === 571) {
        item.detail = 'mapper.geo.within',
            item.documentation = 'Filters the GTS, keeping only the points inside a geo zone';
    }
    else if (item.data === 572) {
        item.detail = 'MACROFILTER',
            item.documentation = 'Creates a filter from a macro.';
    }
    else if (item.data === 573) {
        item.detail = 'filter.byclass',
            item.documentation = 'Selects the geo time series whose class name matches the filter parameter';
    }
    else if (item.data === 574) {
        item.detail = 'filter.bylabels',
            item.documentation = 'Selects the geo time series whose labels match the filter parameter';
    }
    else if (item.data === 575) {
        item.detail = 'filter.last.eq',
            item.documentation = 'Selects the geo time series whose last value equals the filter parameter';
    }
    else if (item.data === 576) {
        item.detail = 'filter.last.ge',
            item.documentation = 'Selects the geo time series whose last value is greater or equal to the filter parameter';
    }
    else if (item.data === 577) {
        item.detail = 'filter.last.gt',
            item.documentation = 'Selects the geo time series whose last value is greater than the filter parameter';
    }
    else if (item.data === 578) {
        item.detail = 'filter.last.le',
            item.documentation = 'Selects the geo time series whose last value is less or equal to the filter parameter';
    }
    else if (item.data === 579) {
        item.detail = 'filter.last.lt',
            item.documentation = 'Selects the geo time series whose last value is less than the filter parameter';
    }
    else if (item.data === 580) {
        item.detail = 'filter.last.ne',
            item.documentation = 'Selects the geo time series whose last value does not equal the filter parameter';
    }
    else if (item.data === 581) {
        item.detail = 'MACROFILTER',
            item.documentation = 'Creates a filter from a macro.';
    }
    else if (item.data === 582) {
        item.detail = 'FILTER',
            item.documentation = 'Extract Geo Time Series which match some criteria';
    }
    else if (item.data === 583) {
        item.detail = 'bucketizer.percentile',
            item.documentation = 'Push onto the stack a bucketizer which returns the xth percentile of values in the interval to bucketize.';
    }
    else if (item.data === 584) {
        item.detail = 'MACROBUCKETIZER',
            item.documentation = 'Converts a macro into a bucketizer';
    }
    else if (item.data === 585) {
        item.detail = 'bucketizer.and',
            item.documentation = 'Compute and between the values of the interval';
    }
    else if (item.data === 586) {
        item.detail = 'bucketizer.count',
            item.documentation = 'Return the number of values of the interval';
    }
    else if (item.data === 587) {
        item.detail = 'bucketizer.first',
            item.documentation = 'Return the first value of the interval';
    }
    else if (item.data === 588) {
        item.detail = 'bucketizer.join',
            item.documentation = 'Return a string concatenating all values';
    }
    else if (item.data === 589) {
        item.detail = 'bucketizer.last',
            item.documentation = 'Return the last value of the interval';
    }
    else if (item.data === 590) {
        item.detail = 'bucketizer.max',
            item.documentation = 'Return the maximum of the values of the interval';
    }
    else if (item.data === 591) {
        item.detail = 'bucketizer.mean',
            item.documentation = 'Return the mean of the values of the interval';
    }
    else if (item.data === 592) {
        item.detail = 'bucketizer.median',
            item.documentation = 'Return the median of the values of the interval';
    }
    else if (item.data === 593) {
        item.detail = 'bucketizer.min',
            item.documentation = 'Return the minimum of the values of the interval';
    }
    else if (item.data === 594) {
        item.detail = 'bucketizer.or',
            item.documentation = 'Compute or between the values of the interval';
    }
    else if (item.data === 595) {
        item.detail = 'bucketizer.sum',
            item.documentation = 'Return the sum of the values of the interval';
    }
    else if (item.data === 596) {
        item.detail = 'BUCKETIZE',
            item.documentation = 'Bucketize a Geo Time Series applying a bucketizer function';
    }
    else if (item.data === 597) {
        item.detail = 'APPLY',
            item.documentation = 'Apply a function to a set of Geo Time Series';
    }
    else if (item.data === 598) {
        item.detail = 'op.add',
            item.documentation = 'Produce values which are the sum of all parameter';
    }
    else if (item.data === 599) {
        item.detail = 'op.and',
            item.documentation = 'AND operand on values of multiple Geo Time Series';
    }
    else if (item.data === 600) {
        item.detail = 'op.div',
            item.documentation = 'Compute the division of its first parameter by the second one';
    }
    else if (item.data === 601) {
        item.detail = 'op.eq',
            item.documentation = 'Check values from N time Geo Time Series for equality';
    }
    else if (item.data === 602) {
        item.detail = 'op.ge',
            item.documentation = 'Check that values from N time series are greater opr equal to each other';
    }
    else if (item.data === 603) {
        item.detail = 'op.gt',
            item.documentation = 'Check that values from N time series are greater than each other';
    }
    else if (item.data === 604) {
        item.detail = 'op.le',
            item.documentation = 'Check that values from N time series are lesser or equal to each other';
    }
    else if (item.data === 605) {
        item.detail = 'op.lt',
            item.documentation = 'Check that values from N time series are lesser than each other';
    }
    else if (item.data === 606) {
        item.detail = 'op.mask',
            item.documentation = 'Eliminate values according to a mask';
    }
    else if (item.data === 607) {
        item.detail = 'op.mul',
            item.documentation = 'Produce values which are the product of all parameters';
    }
    else if (item.data === 608) {
        item.detail = 'op.ne',
            item.documentation = 'Check values from N time Geo Time Series for inequality';
    }
    else if (item.data === 609) {
        item.detail = 'op.negmask',
            item.documentation = 'Eliminate values according to a mask';
    }
    else if (item.data === 610) {
        item.detail = 'op.or',
            item.documentation = 'OR operand on values of multiple Geo Time Series';
    }
    else if (item.data === 611) {
        item.detail = 'op.sub',
            item.documentation = 'Compute the difference between its first and second parameters';
    }
    else if (item.data === 612) {
        item.detail = 'MAXLONG',
            item.documentation = 'Push Long.MAX_VALUE onto the stack';
    }
    else if (item.data === 613) {
        item.detail = 'MINLONG',
            item.documentation = 'Push Long.MIN_VALUE onto the stack';
    }
    else if (item.data === 614) {
        item.detail = 'NULL',
            item.documentation = 'Push the symbolic value NULL onto the stack';
    }
    else if (item.data === 615) {
        item.detail = 'NaN',
            item.documentation = 'Push the symbolic value `NaN` (Not a Number) onto the stack';
    }
    else if (item.data === 616) {
        item.detail = 'PI',
            item.documentation = 'Pushes PI onto the stack.';
    }
    else if (item.data === 617) {
        item.detail = 'e',
            item.documentation = 'Push the value of e (2.71828....) onto the stack';
    }
    else if (item.data === 618) {
        item.detail = 'pi',
            item.documentation = 'Push the value of π (3.141592....) onto the stack';
    }
    return item;
});
/*
connection.onDidOpenTextDocument((params) => {
    // A text document got opened in VSCode.
    // params.uri uniquely identifies the document. For documents store on disk this is a file URI.
    // params.text the initial full content of the document.
    connection.console.log(`${params.textDocument.uri} opened.`);
});
connection.onDidChangeTextDocument((params) => {
    // The content of a text document did change in VSCode.
    // params.uri uniquely identifies the document.
    // params.contentChanges describe the content changes to the document.
    connection.console.log(`${params.textDocument.uri} changed: ${JSON.stringify(params.contentChanges)}`);
});
connection.onDidCloseTextDocument((params) => {
    // A text document got closed in VSCode.
    // params.uri uniquely identifies the document.
    connection.console.log(`${params.textDocument.uri} closed.`);
});
*/
// Listen on the connection
connection.listen();
//# sourceMappingURL=server.js.map