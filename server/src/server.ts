/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';

import {
	IPCMessageReader, IPCMessageWriter, createConnection, IConnection, TextDocuments, TextDocument,
	Diagnostic, DiagnosticSeverity, InitializeResult, TextDocumentPositionParams, CompletionItem,
	CompletionItemKind
} from 'vscode-languageserver';

// Create a connection for the server. The connection uses Node's IPC as a transport
let connection: IConnection = createConnection(new IPCMessageReader(process), new IPCMessageWriter(process));

// Create a simple text document manager. The text document manager
// supports full document sync only
let documents: TextDocuments = new TextDocuments();
// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// After the server has started the client sends an initialize request. The server receives
// in the passed params the rootPath of the workspace plus the client capabilities.
connection.onInitialize((_params): InitializeResult => {
	return {
		capabilities: {
			// Tell the client that the server works in FULL text document sync mode
			textDocumentSync: documents.syncKind,
			// Tell the client that the server support code complete
			completionProvider: {
				resolveProvider: true
			}
		}
	}
});

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent((change) => {
	validateTextDocument(change.document);
});

// The settings interface describe the server relevant settings part
interface Settings {
	lspSample: ExampleSettings;
}

// These are the example settings we defined in the client's package.json
// file
interface ExampleSettings {
	maxNumberOfProblems: number;
}

// hold the maxNumberOfProblems setting
let maxNumberOfProblems: number;
// The settings have changed. Is send on server activation
// as well.
connection.onDidChangeConfiguration((change) => {
	let settings = <Settings>change.settings;
	maxNumberOfProblems = settings.lspSample.maxNumberOfProblems || 100;
	// Revalidate any open text documents
	documents.all().forEach(validateTextDocument);
});

function validateTextDocument(textDocument: TextDocument): void {
	let diagnostics: Diagnostic[] = [];
	let lines = textDocument.getText().split(/\r?\n/g);
	let problems = 0;
/*	for (var i = 0; i < lines.length && problems < maxNumberOfProblems; i++) {
		let line = lines[i];
		let index = line.indexOf('typescript');
		if (index >= 0) {
			problems++;
			diagnostics.push({
				severity: DiagnosticSeverity.Warning,
				range: {
					start: { line: i, character: index },
					end: { line: i, character: index + 10 }
				},
				message: `${line.substr(index, 10)} should be spelled TypeScript`,
				source: 'ex'
			});
		}
	}  */
	// Send the computed diagnostics to VSCode.
	connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}

connection.onDidChangeWatchedFiles((_change) => {
	// Monitored files have change in VSCode
	connection.console.log('We received an file change event');
});


// This handler provides the initial list of the completion items.
connection.onCompletion((_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
	// The pass parameter contains the position of the text document in
	// which code complete got requested. For the example we ignore this
	// info and always provide the same completion items.
	return [{ "label": "DOUBLEEXPONENTIALSMOOTHING", "kind": CompletionItemKind.Text, "data": 0 }, { "label": "EVERY", "kind": CompletionItemKind.Text, "data": 1 }, { "label": "EXPM1", "kind": CompletionItemKind.Text, "data": 2 }, { "label": "FINDSETS", "kind": CompletionItemKind.Text, "data": 3 }, { "label": "FUSE", "kind": CompletionItemKind.Text, "data": 4 }, { "label": "GROOVY", "kind": CompletionItemKind.Text, "data": 5 }, { "label": "HYPOT", "kind": CompletionItemKind.Text, "data": 6 }, { "label": "IMMUTABLE", "kind": CompletionItemKind.Text, "data": 7 }, { "label": "JS", "kind": CompletionItemKind.Text, "data": 8 }, { "label": "LOG1P", "kind": CompletionItemKind.Text, "data": 9 }, { "label": "LUA", "kind": CompletionItemKind.Text, "data": 10 }, { "label": "ONLYBUCKETS", "kind": CompletionItemKind.Text, "data": 11 }, { "label": "PAPPLY", "kind": CompletionItemKind.Text, "data": 12 }, { "label": "PFILTER", "kind": CompletionItemKind.Text, "data": 13 }, { "label": "PYTHON", "kind": CompletionItemKind.Text, "data": 14 }, { "label": "QCONJUGATE", "kind": CompletionItemKind.Text, "data": 15 }, { "label": "QDIVIDE", "kind": CompletionItemKind.Text, "data": 16 }, { "label": "QMULTIPLY", "kind": CompletionItemKind.Text, "data": 17 }, { "label": "QROTATE", "kind": CompletionItemKind.Text, "data": 18 }, { "label": "QROTATION", "kind": CompletionItemKind.Text, "data": 19 }, { "label": "R", "kind": CompletionItemKind.Text, "data": 20 }, { "label": "ROTATIONQ", "kind": CompletionItemKind.Text, "data": 21 }, { "label": "RTO", "kind": CompletionItemKind.Text, "data": 22 }, { "label": "RUBY", "kind": CompletionItemKind.Text, "data": 23 }, { "label": "STACKATTRIBUTE", "kind": CompletionItemKind.Text, "data": 24 }, { "label": "TOQ", "kind": CompletionItemKind.Text, "data": 25 }, { "label": "ULP", "kind": CompletionItemKind.Text, "data": 26 }, { "label": "SENSISIONEVENT", "kind": CompletionItemKind.Text, "data": 27 }, { "label": "SENSISIONGET", "kind": CompletionItemKind.Text, "data": 28 }, { "label": "SENSISIONSET", "kind": CompletionItemKind.Text, "data": 29 }, { "label": "SENSISIONUPDATE", "kind": CompletionItemKind.Text, "data": 30 }, { "label": "CEVAL", "kind": CompletionItemKind.Text, "data": 31 }, { "label": "SYNC", "kind": CompletionItemKind.Text, "data": 32 }, { "label": "JSONTO", "kind": CompletionItemKind.Text, "data": 33 }, { "label": "PICKLETO", "kind": CompletionItemKind.Text, "data": 34 }, { "label": "TOBIN", "kind": CompletionItemKind.Text, "data": 35 }, { "label": "TOBOOLEAN", "kind": CompletionItemKind.Text, "data": 36 }, { "label": "TODOUBLE", "kind": CompletionItemKind.Text, "data": 37 }, { "label": "TOLONG", "kind": CompletionItemKind.Text, "data": 38 }, { "label": "TOSTRING", "kind": CompletionItemKind.Text, "data": 39 }, { "label": "TOTIMESTAMP", "kind": CompletionItemKind.Text, "data": 40 }, { "label": "CALL", "kind": CompletionItemKind.Text, "data": 41 }, { "label": "CUDF", "kind": CompletionItemKind.Text, "data": 42 }, { "label": "UDF", "kind": CompletionItemKind.Text, "data": 43 }, { "label": "2BIN", "kind": CompletionItemKind.Text, "data": 44 }, { "label": "2HEX", "kind": CompletionItemKind.Text, "data": 45 }, { "label": "B64TO", "kind": CompletionItemKind.Text, "data": 46 }, { "label": "B64TOHEX", "kind": CompletionItemKind.Text, "data": 47 }, { "label": "B64URL", "kind": CompletionItemKind.Text, "data": 48 }, { "label": "BIN2", "kind": CompletionItemKind.Text, "data": 49 }, { "label": "BINTOHEX", "kind": CompletionItemKind.Text, "data": 50 }, { "label": "BYTESTO", "kind": CompletionItemKind.Text, "data": 51 }, { "label": "FROMBIN", "kind": CompletionItemKind.Text, "data": 52 }, { "label": "FROMHEX", "kind": CompletionItemKind.Text, "data": 53 }, { "label": "HASH", "kind": CompletionItemKind.Text, "data": 54 }, { "label": "HEXTO", "kind": CompletionItemKind.Text, "data": 55 }, { "label": "HEXTOB64", "kind": CompletionItemKind.Text, "data": 56 }, { "label": "HEXTOBIN", "kind": CompletionItemKind.Text, "data": 57 }, { "label": "JOIN", "kind": CompletionItemKind.Text, "data": 58 }, { "label": "MATCH", "kind": CompletionItemKind.Text, "data": 59 }, { "label": "MATCHER", "kind": CompletionItemKind.Text, "data": 60 }, { "label": "OPB64TO", "kind": CompletionItemKind.Text, "data": 61 }, { "label": "OPB64TOHEX", "kind": CompletionItemKind.Text, "data": 62 }, { "label": "REPLACE", "kind": CompletionItemKind.Text, "data": 63 }, { "label": "REPLACEALL", "kind": CompletionItemKind.Text, "data": 64 }, { "label": "SPLIT", "kind": CompletionItemKind.Text, "data": 65 }, { "label": "SUBSTRING", "kind": CompletionItemKind.Text, "data": 66 }, { "label": "TEMPLATE", "kind": CompletionItemKind.Text, "data": 67 }, { "label": "TOB64", "kind": CompletionItemKind.Text, "data": 68 }, { "label": "TOB64URL", "kind": CompletionItemKind.Text, "data": 69 }, { "label": "TOBYTES", "kind": CompletionItemKind.Text, "data": 70 }, { "label": "TOHEX", "kind": CompletionItemKind.Text, "data": 71 }, { "label": "TOLOWER", "kind": CompletionItemKind.Text, "data": 72 }, { "label": "TOOPB64", "kind": CompletionItemKind.Text, "data": 73 }, { "label": "TOUPPER", "kind": CompletionItemKind.Text, "data": 74 }, { "label": "TRIM", "kind": CompletionItemKind.Text, "data": 75 }, { "label": "URLDECODE", "kind": CompletionItemKind.Text, "data": 76 }, { "label": "URLENCODE", "kind": CompletionItemKind.Text, "data": 77 }, { "label": "UUID", "kind": CompletionItemKind.Text, "data": 78 }, { "label": "ADDDAYS", "kind": CompletionItemKind.Text, "data": 79 }, { "label": "ADDMONTHS", "kind": CompletionItemKind.Text, "data": 80 }, { "label": "ADDYEARS", "kind": CompletionItemKind.Text, "data": 81 }, { "label": "AGO", "kind": CompletionItemKind.Text, "data": 82 }, { "label": "DURATION", "kind": CompletionItemKind.Text, "data": 83 }, { "label": "HUMANDURATION", "kind": CompletionItemKind.Text, "data": 84 }, { "label": "ISO8601", "kind": CompletionItemKind.Text, "data": 85 }, { "label": "ISODURATION", "kind": CompletionItemKind.Text, "data": 86 }, { "label": "MSTU", "kind": CompletionItemKind.Text, "data": 87 }, { "label": "NOTAFTER", "kind": CompletionItemKind.Text, "data": 88 }, { "label": "NOTBEFORE", "kind": CompletionItemKind.Text, "data": 89 }, { "label": "NOW", "kind": CompletionItemKind.Text, "data": 90 }, { "label": "STU", "kind": CompletionItemKind.Text, "data": 91 }, { "label": "TOTSELEMENTS", "kind": CompletionItemKind.Text, "data": 92 }, { "label": "TSELEMENTS", "kind": CompletionItemKind.Text, "data": 93 }, { "label": "TSELEMENTSTO", "kind": CompletionItemKind.Text, "data": 94 }, { "label": "AESUNWRAP", "kind": CompletionItemKind.Text, "data": 95 }, { "label": "AESWRAP", "kind": CompletionItemKind.Text, "data": 96 }, { "label": "MD5", "kind": CompletionItemKind.Text, "data": 97 }, { "label": "RSADECRYPT", "kind": CompletionItemKind.Text, "data": 98 }, { "label": "RSAENCRYPT", "kind": CompletionItemKind.Text, "data": 99 }, { "label": "RSAGEN", "kind": CompletionItemKind.Text, "data": 100 }, { "label": "RSAPRIVATE", "kind": CompletionItemKind.Text, "data": 101 }, { "label": "RSAPUBLIC", "kind": CompletionItemKind.Text, "data": 102 }, { "label": "RSASIGN", "kind": CompletionItemKind.Text, "data": 103 }, { "label": "RSAVERIFY", "kind": CompletionItemKind.Text, "data": 104 }, { "label": "SHA1", "kind": CompletionItemKind.Text, "data": 105 }, { "label": "SHA1HMAC", "kind": CompletionItemKind.Text, "data": 106 }, { "label": "SHA256", "kind": CompletionItemKind.Text, "data": 107 }, { "label": "SHA256HMAC", "kind": CompletionItemKind.Text, "data": 108 }, { "label": "GZIP", "kind": CompletionItemKind.Text, "data": 109 }, { "label": "TOZ", "kind": CompletionItemKind.Text, "data": 110 }, { "label": "UNGZIP", "kind": CompletionItemKind.Text, "data": 111 }, { "label": "ZTO", "kind": CompletionItemKind.Text, "data": 112 }, { "label": "AUTHENTICATE", "kind": CompletionItemKind.Text, "data": 113 }, { "label": "BOOTSTRAP", "kind": CompletionItemKind.Text, "data": 114 }, { "label": "CLEAR", "kind": CompletionItemKind.Text, "data": 115 }, { "label": "CLEARDEFS", "kind": CompletionItemKind.Text, "data": 116 }, { "label": "CLEARSYMBOLS", "kind": CompletionItemKind.Text, "data": 117 }, { "label": "CLEARTOMARK", "kind": CompletionItemKind.Text, "data": 118 }, { "label": "CLOSE_BRACKET", "kind": CompletionItemKind.Text, "data": 119 }, { "label": "CLOSE_MARK", "kind": CompletionItemKind.Text, "data": 120 }, { "label": "COUNTTOMARK", "kind": CompletionItemKind.Text, "data": 121 }, { "label": "CSTORE", "kind": CompletionItemKind.Text, "data": 122 }, { "label": "DEBUGOFF", "kind": CompletionItemKind.Text, "data": 123 }, { "label": "DEBUGON", "kind": CompletionItemKind.Text, "data": 124 }, { "label": "DEF", "kind": CompletionItemKind.Text, "data": 125 }, { "label": "DEPTH", "kind": CompletionItemKind.Text, "data": 126 }, { "label": "DOC", "kind": CompletionItemKind.Text, "data": 127 }, { "label": "DOCMODE", "kind": CompletionItemKind.Text, "data": 128 }, { "label": "DROP", "kind": CompletionItemKind.Text, "data": 129 }, { "label": "DROPN", "kind": CompletionItemKind.Text, "data": 130 }, { "label": "DUP", "kind": CompletionItemKind.Text, "data": 131 }, { "label": "DUPN", "kind": CompletionItemKind.Text, "data": 132 }, { "label": "ELAPSED", "kind": CompletionItemKind.Text, "data": 133 }, { "label": "EXPORT", "kind": CompletionItemKind.Text, "data": 134 }, { "label": "FORGET", "kind": CompletionItemKind.Text, "data": 135 }, { "label": "LOAD", "kind": CompletionItemKind.Text, "data": 136 }, { "label": "MARK", "kind": CompletionItemKind.Text, "data": 137 }, { "label": "NDEBUGON", "kind": CompletionItemKind.Text, "data": 138 }, { "label": "NOTIMINGS", "kind": CompletionItemKind.Text, "data": 139 }, { "label": "OPEN_BRACKET", "kind": CompletionItemKind.Text, "data": 140 }, { "label": "OPEN_MARK", "kind": CompletionItemKind.Text, "data": 141 }, { "label": "PICK", "kind": CompletionItemKind.Text, "data": 142 }, { "label": "RESET", "kind": CompletionItemKind.Text, "data": 143 }, { "label": "REXEC", "kind": CompletionItemKind.Text, "data": 144 }, { "label": "ROLL", "kind": CompletionItemKind.Text, "data": 145 }, { "label": "ROLLD", "kind": CompletionItemKind.Text, "data": 146 }, { "label": "ROT", "kind": CompletionItemKind.Text, "data": 147 }, { "label": "RUN", "kind": CompletionItemKind.Text, "data": 148 }, { "label": "SNAPSHOT", "kind": CompletionItemKind.Text, "data": 149 }, { "label": "SNAPSHOTALL", "kind": CompletionItemKind.Text, "data": 150 }, { "label": "SNAPSHOTALLTOMARK", "kind": CompletionItemKind.Text, "data": 151 }, { "label": "SNAPSHOTTOMARK", "kind": CompletionItemKind.Text, "data": 152 }, { "label": "STACKATTRIBUTE", "kind": CompletionItemKind.Text, "data": 153 }, { "label": "STACKTOLIST", "kind": CompletionItemKind.Text, "data": 154 }, { "label": "STORE", "kind": CompletionItemKind.Text, "data": 155 }, { "label": "SWAP", "kind": CompletionItemKind.Text, "data": 156 }, { "label": "TIMINGS", "kind": CompletionItemKind.Text, "data": 157 }, { "label": "TYPEOF", "kind": CompletionItemKind.Text, "data": 158 }, { "label": "EVALSECURE", "kind": CompletionItemKind.Text, "data": 159 }, { "label": "HEADER", "kind": CompletionItemKind.Text, "data": 160 }, { "label": "IDENT", "kind": CompletionItemKind.Text, "data": 161 }, { "label": "JSONLOOSE", "kind": CompletionItemKind.Text, "data": 162 }, { "label": "JSONSTRICT", "kind": CompletionItemKind.Text, "data": 163 }, { "label": "LIMIT", "kind": CompletionItemKind.Text, "data": 164 }, { "label": "MAXBUCKETS", "kind": CompletionItemKind.Text, "data": 165 }, { "label": "MAXDEPTH", "kind": CompletionItemKind.Text, "data": 166 }, { "label": "MAXGTS", "kind": CompletionItemKind.Text, "data": 167 }, { "label": "MAXLOOP", "kind": CompletionItemKind.Text, "data": 168 }, { "label": "MAXOPS", "kind": CompletionItemKind.Text, "data": 169 }, { "label": "MAXSYMBOLS", "kind": CompletionItemKind.Text, "data": 170 }, { "label": "NOOP", "kind": CompletionItemKind.Text, "data": 171 }, { "label": "OPS", "kind": CompletionItemKind.Text, "data": 172 }, { "label": "RESTORE", "kind": CompletionItemKind.Text, "data": 173 }, { "label": "REV", "kind": CompletionItemKind.Text, "data": 174 }, { "label": "RTFM", "kind": CompletionItemKind.Text, "data": 175 }, { "label": "SAVE", "kind": CompletionItemKind.Text, "data": 176 }, { "label": "SECUREKEY", "kind": CompletionItemKind.Text, "data": 177 }, { "label": "TOKENINFO", "kind": CompletionItemKind.Text, "data": 178 }, { "label": "UNSECURE", "kind": CompletionItemKind.Text, "data": 179 }, { "label": "URLFETCH", "kind": CompletionItemKind.Text, "data": 180 }, { "label": "WEBCALL", "kind": CompletionItemKind.Text, "data": 181 }, { "label": "ABS", "kind": CompletionItemKind.Text, "data": 182 }, { "label": "ADD", "kind": CompletionItemKind.Text, "data": 183 }, { "label": "ALMOSTEQ", "kind": CompletionItemKind.Text, "data": 184 }, { "label": "AND", "kind": CompletionItemKind.Text, "data": 185 }, { "label": "BITWISE_AND", "kind": CompletionItemKind.Text, "data": 186 }, { "label": "BITWISE_COMPLEMENT", "kind": CompletionItemKind.Text, "data": 187 }, { "label": "BITWISE_OR", "kind": CompletionItemKind.Text, "data": 188 }, { "label": "BITWISE_XOR", "kind": CompletionItemKind.Text, "data": 189 }, { "label": "CBRT", "kind": CompletionItemKind.Text, "data": 190 }, { "label": "CEIL", "kind": CompletionItemKind.Text, "data": 191 }, { "label": "COND_AND", "kind": CompletionItemKind.Text, "data": 192 }, { "label": "COND_OR", "kind": CompletionItemKind.Text, "data": 193 }, { "label": "COPYSIGN", "kind": CompletionItemKind.Text, "data": 194 }, { "label": "DIV", "kind": CompletionItemKind.Text, "data": 195 }, { "label": "DOUBLEBITSTO", "kind": CompletionItemKind.Text, "data": 196 }, { "label": "EQ", "kind": CompletionItemKind.Text, "data": 197 }, { "label": "EXP", "kind": CompletionItemKind.Text, "data": 198 }, { "label": "FLOATBITSTO", "kind": CompletionItemKind.Text, "data": 199 }, { "label": "FLOOR", "kind": CompletionItemKind.Text, "data": 200 }, { "label": "GE", "kind": CompletionItemKind.Text, "data": 201 }, { "label": "GT", "kind": CompletionItemKind.Text, "data": 202 }, { "label": "IEEEREMAINDER", "kind": CompletionItemKind.Text, "data": 203 }, { "label": "INPLACEADD", "kind": CompletionItemKind.Text, "data": 204 }, { "label": "ISNULL", "kind": CompletionItemKind.Text, "data": 205 }, { "label": "LBOUNDS", "kind": CompletionItemKind.Text, "data": 206 }, { "label": "LE", "kind": CompletionItemKind.Text, "data": 207 }, { "label": "LEFT_SHIFT", "kind": CompletionItemKind.Text, "data": 208 }, { "label": "LOG", "kind": CompletionItemKind.Text, "data": 209 }, { "label": "LOG10", "kind": CompletionItemKind.Text, "data": 210 }, { "label": "LT", "kind": CompletionItemKind.Text, "data": 211 }, { "label": "MAX", "kind": CompletionItemKind.Text, "data": 212 }, { "label": "MIN", "kind": CompletionItemKind.Text, "data": 213 }, { "label": "MOD", "kind": CompletionItemKind.Text, "data": 214 }, { "label": "MUL", "kind": CompletionItemKind.Text, "data": 215 }, { "label": "NBOUNDS", "kind": CompletionItemKind.Text, "data": 216 }, { "label": "NE", "kind": CompletionItemKind.Text, "data": 217 }, { "label": "NEXTAFTER", "kind": CompletionItemKind.Text, "data": 218 }, { "label": "NEXTUP", "kind": CompletionItemKind.Text, "data": 219 }, { "label": "NOT", "kind": CompletionItemKind.Text, "data": 220 }, { "label": "NOT_TXT", "kind": CompletionItemKind.Text, "data": 221 }, { "label": "NPDF", "kind": CompletionItemKind.Text, "data": 222 }, { "label": "OR", "kind": CompletionItemKind.Text, "data": 223 }, { "label": "POW", "kind": CompletionItemKind.Text, "data": 224 }, { "label": "PROBABILITY", "kind": CompletionItemKind.Text, "data": 225 }, { "label": "RAND", "kind": CompletionItemKind.Text, "data": 226 }, { "label": "RANDPDF", "kind": CompletionItemKind.Text, "data": 227 }, { "label": "REVBITS", "kind": CompletionItemKind.Text, "data": 228 }, { "label": "RIGHT_SHIFT", "kind": CompletionItemKind.Text, "data": 229 }, { "label": "RINT", "kind": CompletionItemKind.Text, "data": 230 }, { "label": "ROUND", "kind": CompletionItemKind.Text, "data": 231 }, { "label": "SIGNUM", "kind": CompletionItemKind.Text, "data": 232 }, { "label": "SQRT", "kind": CompletionItemKind.Text, "data": 233 }, { "label": "SUB", "kind": CompletionItemKind.Text, "data": 234 }, { "label": "TODOUBLEBITS", "kind": CompletionItemKind.Text, "data": 235 }, { "label": "TOFLOATBITS", "kind": CompletionItemKind.Text, "data": 236 }, { "label": "UNSIGNED_RIGHT_SHIFT", "kind": CompletionItemKind.Text, "data": 237 }, { "label": "TOPICKLE", "kind": CompletionItemKind.Text, "data": 238 }, { "label": "ACOS", "kind": CompletionItemKind.Text, "data": 239 }, { "label": "ASIN", "kind": CompletionItemKind.Text, "data": 240 }, { "label": "ATAN", "kind": CompletionItemKind.Text, "data": 241 }, { "label": "COS", "kind": CompletionItemKind.Text, "data": 242 }, { "label": "COSH", "kind": CompletionItemKind.Text, "data": 243 }, { "label": "SIN", "kind": CompletionItemKind.Text, "data": 244 }, { "label": "SINH", "kind": CompletionItemKind.Text, "data": 245 }, { "label": "TAN", "kind": CompletionItemKind.Text, "data": 246 }, { "label": "TANH", "kind": CompletionItemKind.Text, "data": 247 }, { "label": "TODEGREES", "kind": CompletionItemKind.Text, "data": 248 }, { "label": "TORADIANS", "kind": CompletionItemKind.Text, "data": 249 }, { "label": "COUNTER", "kind": CompletionItemKind.Text, "data": 250 }, { "label": "COUNTERDELTA", "kind": CompletionItemKind.Text, "data": 251 }, { "label": "COUNTERVALUE", "kind": CompletionItemKind.Text, "data": 252 }, { "label": "RANGE", "kind": CompletionItemKind.Text, "data": 253 }, { "label": "QCONJUGATE", "kind": CompletionItemKind.Text, "data": 254 }, { "label": "QDIVIDE", "kind": CompletionItemKind.Text, "data": 255 }, { "label": "QMULTIPLY", "kind": CompletionItemKind.Text, "data": 256 }, { "label": "QROTATE", "kind": CompletionItemKind.Text, "data": 257 }, { "label": "QROTATION", "kind": CompletionItemKind.Text, "data": 258 }, { "label": "QTO", "kind": CompletionItemKind.Text, "data": 259 }, { "label": "ROTATIONQ", "kind": CompletionItemKind.Text, "data": 260 }, { "label": "TOQ", "kind": CompletionItemKind.Text, "data": 261 }, { "label": "BITCOUNT", "kind": CompletionItemKind.Text, "data": 262 }, { "label": "BITGET", "kind": CompletionItemKind.Text, "data": 263 }, { "label": "BITSTOBYTES", "kind": CompletionItemKind.Text, "data": 264 }, { "label": "BYTESTOBITS", "kind": CompletionItemKind.Text, "data": 265 }, { "label": "ASSERT", "kind": CompletionItemKind.Text, "data": 266 }, { "label": "BREAK", "kind": CompletionItemKind.Text, "data": 267 }, { "label": "CONTINUE", "kind": CompletionItemKind.Text, "data": 268 }, { "label": "DEFINED", "kind": CompletionItemKind.Text, "data": 269 }, { "label": "DEFINEDMACRO", "kind": CompletionItemKind.Text, "data": 270 }, { "label": "EVAL", "kind": CompletionItemKind.Text, "data": 271 }, { "label": "FAIL", "kind": CompletionItemKind.Text, "data": 272 }, { "label": "FOR", "kind": CompletionItemKind.Text, "data": 273 }, { "label": "FOREACH", "kind": CompletionItemKind.Text, "data": 274 }, { "label": "FORSTEP", "kind": CompletionItemKind.Text, "data": 275 }, { "label": "IFT", "kind": CompletionItemKind.Text, "data": 276 }, { "label": "IFTE", "kind": CompletionItemKind.Text, "data": 277 }, { "label": "MSGFAIL", "kind": CompletionItemKind.Text, "data": 278 }, { "label": "NRETURN", "kind": CompletionItemKind.Text, "data": 279 }, { "label": "RETURN", "kind": CompletionItemKind.Text, "data": 280 }, { "label": "STOP", "kind": CompletionItemKind.Text, "data": 281 }, { "label": "SWITCH", "kind": CompletionItemKind.Text, "data": 282 }, { "label": "UNTIL", "kind": CompletionItemKind.Text, "data": 283 }, { "label": "WHILE", "kind": CompletionItemKind.Text, "data": 284 }, { "label": "CLONEREVERSE", "kind": CompletionItemKind.Text, "data": 285 }, { "label": "CONTAINS", "kind": CompletionItemKind.Text, "data": 286 }, { "label": "CONTAINSKEY", "kind": CompletionItemKind.Text, "data": 287 }, { "label": "CONTAINSVALUE", "kind": CompletionItemKind.Text, "data": 288 }, { "label": "EMPTYLIST", "kind": CompletionItemKind.Text, "data": 289 }, { "label": "EMPTYMAP", "kind": CompletionItemKind.Text, "data": 290 }, { "label": "FLATTEN", "kind": CompletionItemKind.Text, "data": 291 }, { "label": "GET", "kind": CompletionItemKind.Text, "data": 292 }, { "label": "KEYLIST", "kind": CompletionItemKind.Text, "data": 293 }, { "label": "LFLATMAP", "kind": CompletionItemKind.Text, "data": 294 }, { "label": "LISTTO", "kind": CompletionItemKind.Text, "data": 295 }, { "label": "LMAP", "kind": CompletionItemKind.Text, "data": 296 }, { "label": "MAPID", "kind": CompletionItemKind.Text, "data": 297 }, { "label": "MAPTO", "kind": CompletionItemKind.Text, "data": 298 }, { "label": "MATTO", "kind": CompletionItemKind.Text, "data": 299 }, { "label": "MSORT", "kind": CompletionItemKind.Text, "data": 300 }, { "label": "PACK", "kind": CompletionItemKind.Text, "data": 301 }, { "label": "SIZE", "kind": CompletionItemKind.Text, "data": 302 }, { "label": "SUBLIST", "kind": CompletionItemKind.Text, "data": 303 }, { "label": "SUBMAP", "kind": CompletionItemKind.Text, "data": 304 }, { "label": "TOLIST", "kind": CompletionItemKind.Text, "data": 305 }, { "label": "TOMAP", "kind": CompletionItemKind.Text, "data": 306 }, { "label": "TOMAT", "kind": CompletionItemKind.Text, "data": 307 }, { "label": "TOV", "kind": CompletionItemKind.Text, "data": 308 }, { "label": "TOVEC", "kind": CompletionItemKind.Text, "data": 309 }, { "label": "UNIQUE", "kind": CompletionItemKind.Text, "data": 310 }, { "label": "UNLIST", "kind": CompletionItemKind.Text, "data": 311 }, { "label": "UNMAP", "kind": CompletionItemKind.Text, "data": 312 }, { "label": "UNPACK", "kind": CompletionItemKind.Text, "data": 313 }, { "label": "VALUELIST", "kind": CompletionItemKind.Text, "data": 314 }, { "label": "VECTO", "kind": CompletionItemKind.Text, "data": 315 }, { "label": "VTO", "kind": CompletionItemKind.Text, "data": 316 }, { "label": "ZIP", "kind": CompletionItemKind.Text, "data": 317 }, { "label": "DIFFERENCE", "kind": CompletionItemKind.Text, "data": 318 }, { "label": "INTERSECTION", "kind": CompletionItemKind.Text, "data": 319 }, { "label": "SET", "kind": CompletionItemKind.Text, "data": 320 }, { "label": "SETTO", "kind": CompletionItemKind.Text, "data": 321 }, { "label": "TOSET", "kind": CompletionItemKind.Text, "data": 322 }, { "label": "UNION", "kind": CompletionItemKind.Text, "data": 323 }, { "label": "APPEND", "kind": CompletionItemKind.Text, "data": 324 }, { "label": "LSORT", "kind": CompletionItemKind.Text, "data": 325 }, { "label": "PUT", "kind": CompletionItemKind.Text, "data": 326 }, { "label": "REMOVE", "kind": CompletionItemKind.Text, "data": 327 }, { "label": "REVERSE", "kind": CompletionItemKind.Text, "data": 328 }, { "label": "GEOHASHTO", "kind": CompletionItemKind.Text, "data": 329 }, { "label": "GEOPACK", "kind": CompletionItemKind.Text, "data": 330 }, { "label": "GEOREGEXP", "kind": CompletionItemKind.Text, "data": 331 }, { "label": "GEOUNPACK", "kind": CompletionItemKind.Text, "data": 332 }, { "label": "GEO_DIFFERENCE", "kind": CompletionItemKind.Text, "data": 333 }, { "label": "GEO_INTERSECTION", "kind": CompletionItemKind.Text, "data": 334 }, { "label": "GEO_INTERSECTS", "kind": CompletionItemKind.Text, "data": 335 }, { "label": "GEO_JSON", "kind": CompletionItemKind.Text, "data": 336 }, { "label": "GEO_UNION", "kind": CompletionItemKind.Text, "data": 337 }, { "label": "GEO_WITHIN", "kind": CompletionItemKind.Text, "data": 338 }, { "label": "GEO_WKT", "kind": CompletionItemKind.Text, "data": 339 }, { "label": "HAVERSINE", "kind": CompletionItemKind.Text, "data": 340 }, { "label": "HHCODETO", "kind": CompletionItemKind.Text, "data": 341 }, { "label": "TOGEOHASH", "kind": CompletionItemKind.Text, "data": 342 }, { "label": "TOHHCODE", "kind": CompletionItemKind.Text, "data": 343 }, { "label": "CHUNK", "kind": CompletionItemKind.Text, "data": 344 }, { "label": "CLIP", "kind": CompletionItemKind.Text, "data": 345 }, { "label": "SHRINK", "kind": CompletionItemKind.Text, "data": 346 }, { "label": "TIMECLIP", "kind": CompletionItemKind.Text, "data": 347 }, { "label": "TIMEMODULO", "kind": CompletionItemKind.Text, "data": 348 }, { "label": "TIMESCALE", "kind": CompletionItemKind.Text, "data": 349 }, { "label": "TIMESHIFT", "kind": CompletionItemKind.Text, "data": 350 }, { "label": "TIMESPLIT", "kind": CompletionItemKind.Text, "data": 351 }, { "label": "CORRELATE", "kind": CompletionItemKind.Text, "data": 352 }, { "label": "CPROB", "kind": CompletionItemKind.Text, "data": 353 }, { "label": "ISONORMALIZE", "kind": CompletionItemKind.Text, "data": 354 }, { "label": "LOWESS", "kind": CompletionItemKind.Text, "data": 355 }, { "label": "LTTB", "kind": CompletionItemKind.Text, "data": 356 }, { "label": "MODE", "kind": CompletionItemKind.Text, "data": 357 }, { "label": "MONOTONIC", "kind": CompletionItemKind.Text, "data": 358 }, { "label": "MUSIGMA", "kind": CompletionItemKind.Text, "data": 359 }, { "label": "NORMALIZE", "kind": CompletionItemKind.Text, "data": 360 }, { "label": "NSUMSUMSQ", "kind": CompletionItemKind.Text, "data": 361 }, { "label": "PROB", "kind": CompletionItemKind.Text, "data": 362 }, { "label": "RLOWESS", "kind": CompletionItemKind.Text, "data": 363 }, { "label": "SINGLEEXPONENTIALSMOOTHING", "kind": CompletionItemKind.Text, "data": 364 }, { "label": "STANDARDIZE", "kind": CompletionItemKind.Text, "data": 365 }, { "label": "TLTTB", "kind": CompletionItemKind.Text, "data": 366 }, { "label": "VALUEHISTOGRAM", "kind": CompletionItemKind.Text, "data": 367 }, { "label": "DWTSPLIT", "kind": CompletionItemKind.Text, "data": 368 }, { "label": "FDWT", "kind": CompletionItemKind.Text, "data": 369 }, { "label": "FFT", "kind": CompletionItemKind.Text, "data": 370 }, { "label": "FFTAP", "kind": CompletionItemKind.Text, "data": 371 }, { "label": "IDWT", "kind": CompletionItemKind.Text, "data": 372 }, { "label": "IFFT", "kind": CompletionItemKind.Text, "data": 373 }, { "label": "CLONE", "kind": CompletionItemKind.Text, "data": 374 }, { "label": "CLONEEMPTY", "kind": CompletionItemKind.Text, "data": 375 }, { "label": "COMMONTICKS", "kind": CompletionItemKind.Text, "data": 376 }, { "label": "COMPACT", "kind": CompletionItemKind.Text, "data": 377 }, { "label": "DEDUP", "kind": CompletionItemKind.Text, "data": 378 }, { "label": "FILLTICKS", "kind": CompletionItemKind.Text, "data": 379 }, { "label": "INTEGRATE", "kind": CompletionItemKind.Text, "data": 380 }, { "label": "LASTSORT", "kind": CompletionItemKind.Text, "data": 381 }, { "label": "MERGE", "kind": CompletionItemKind.Text, "data": 382 }, { "label": "NONEMPTY", "kind": CompletionItemKind.Text, "data": 383 }, { "label": "PARTITION", "kind": CompletionItemKind.Text, "data": 384 }, { "label": "QUANTIZE", "kind": CompletionItemKind.Text, "data": 385 }, { "label": "RANGECOMPACT", "kind": CompletionItemKind.Text, "data": 386 }, { "label": "RESETS", "kind": CompletionItemKind.Text, "data": 387 }, { "label": "RSORT", "kind": CompletionItemKind.Text, "data": 388 }, { "label": "RVALUESORT", "kind": CompletionItemKind.Text, "data": 389 }, { "label": "SORT", "kind": CompletionItemKind.Text, "data": 390 }, { "label": "SORTBY", "kind": CompletionItemKind.Text, "data": 391 }, { "label": "UNWRAP", "kind": CompletionItemKind.Text, "data": 392 }, { "label": "VALUEDEDUP", "kind": CompletionItemKind.Text, "data": 393 }, { "label": "VALUESORT", "kind": CompletionItemKind.Text, "data": 394 }, { "label": "VALUESPLIT", "kind": CompletionItemKind.Text, "data": 395 }, { "label": "WRAP", "kind": CompletionItemKind.Text, "data": 396 }, { "label": "WRAPRAW", "kind": CompletionItemKind.Text, "data": 397 }, { "label": "MAKEGTS", "kind": CompletionItemKind.Text, "data": 398 }, { "label": "NEWGTS", "kind": CompletionItemKind.Text, "data": 399 }, { "label": "PARSE", "kind": CompletionItemKind.Text, "data": 400 }, { "label": "DELETE", "kind": CompletionItemKind.Text, "data": 401 }, { "label": "FETCH", "kind": CompletionItemKind.Text, "data": 402 }, { "label": "FETCHBOOLEAN", "kind": CompletionItemKind.Text, "data": 403 }, { "label": "FETCHDOUBLE", "kind": CompletionItemKind.Text, "data": 404 }, { "label": "FETCHLONG", "kind": CompletionItemKind.Text, "data": 405 }, { "label": "FETCHSTRING", "kind": CompletionItemKind.Text, "data": 406 }, { "label": "FIND", "kind": CompletionItemKind.Text, "data": 407 }, { "label": "FINDSTATS", "kind": CompletionItemKind.Text, "data": 408 }, { "label": "UPDATE", "kind": CompletionItemKind.Text, "data": 409 }, { "label": "DISCORDS", "kind": CompletionItemKind.Text, "data": 410 }, { "label": "DTW", "kind": CompletionItemKind.Text, "data": 411 }, { "label": "OPTDTW", "kind": CompletionItemKind.Text, "data": 412 }, { "label": "PATTERNDETECTION", "kind": CompletionItemKind.Text, "data": 413 }, { "label": "PATTERNS", "kind": CompletionItemKind.Text, "data": 414 }, { "label": "ZDISCORDS", "kind": CompletionItemKind.Text, "data": 415 }, { "label": "ZPATTERNDETECTION", "kind": CompletionItemKind.Text, "data": 416 }, { "label": "ZPATTERNS", "kind": CompletionItemKind.Text, "data": 417 }, { "label": "ZSCORE", "kind": CompletionItemKind.Text, "data": 418 }, { "label": "ESDTEST", "kind": CompletionItemKind.Text, "data": 419 }, { "label": "GRUBBSTEST", "kind": CompletionItemKind.Text, "data": 420 }, { "label": "HYBRIDTEST", "kind": CompletionItemKind.Text, "data": 421 }, { "label": "HYBRIDTEST2", "kind": CompletionItemKind.Text, "data": 422 }, { "label": "STLESDTEST", "kind": CompletionItemKind.Text, "data": 423 }, { "label": "THRESHOLDTEST", "kind": CompletionItemKind.Text, "data": 424 }, { "label": "ZSCORETEST", "kind": CompletionItemKind.Text, "data": 425 }, { "label": "BBOX", "kind": CompletionItemKind.Text, "data": 426 }, { "label": "COPYGEO", "kind": CompletionItemKind.Text, "data": 427 }, { "label": "ELEVATIONS", "kind": CompletionItemKind.Text, "data": 428 }, { "label": "LOCATIONOFFSET", "kind": CompletionItemKind.Text, "data": 429 }, { "label": "LOCATIONS", "kind": CompletionItemKind.Text, "data": 430 }, { "label": "LOCSTRINGS", "kind": CompletionItemKind.Text, "data": 431 }, { "label": "ATTRIBUTES", "kind": CompletionItemKind.Text, "data": 432 }, { "label": "LABELS", "kind": CompletionItemKind.Text, "data": 433 }, { "label": "META", "kind": CompletionItemKind.Text, "data": 434 }, { "label": "METASORT", "kind": CompletionItemKind.Text, "data": 435 }, { "label": "NAME", "kind": CompletionItemKind.Text, "data": 436 }, { "label": "PARSESELECTOR", "kind": CompletionItemKind.Text, "data": 437 }, { "label": "RELABEL", "kind": CompletionItemKind.Text, "data": 438 }, { "label": "RENAME", "kind": CompletionItemKind.Text, "data": 439 }, { "label": "SETATTRIBUTES", "kind": CompletionItemKind.Text, "data": 440 }, { "label": "TOSELECTOR", "kind": CompletionItemKind.Text, "data": 441 }, { "label": "ADDVALUE", "kind": CompletionItemKind.Text, "data": 442 }, { "label": "ATINDEX", "kind": CompletionItemKind.Text, "data": 443 }, { "label": "ATTICK", "kind": CompletionItemKind.Text, "data": 444 }, { "label": "FIRSTTICK", "kind": CompletionItemKind.Text, "data": 445 }, { "label": "LASTTICK", "kind": CompletionItemKind.Text, "data": 446 }, { "label": "SETVALUE", "kind": CompletionItemKind.Text, "data": 447 }, { "label": "TICKINDEX", "kind": CompletionItemKind.Text, "data": 448 }, { "label": "TICKLIST", "kind": CompletionItemKind.Text, "data": 449 }, { "label": "TICKS", "kind": CompletionItemKind.Text, "data": 450 }, { "label": "VALUES", "kind": CompletionItemKind.Text, "data": 451 }, { "label": "ATBUCKET", "kind": CompletionItemKind.Text, "data": 452 }, { "label": "BUCKETCOUNT", "kind": CompletionItemKind.Text, "data": 453 }, { "label": "BUCKETSPAN", "kind": CompletionItemKind.Text, "data": 454 }, { "label": "CROP", "kind": CompletionItemKind.Text, "data": 455 }, { "label": "FILLNEXT", "kind": CompletionItemKind.Text, "data": 456 }, { "label": "FILLPREVIOUS", "kind": CompletionItemKind.Text, "data": 457 }, { "label": "FILLVALUE", "kind": CompletionItemKind.Text, "data": 458 }, { "label": "INTERPOLATE", "kind": CompletionItemKind.Text, "data": 459 }, { "label": "LASTBUCKET", "kind": CompletionItemKind.Text, "data": 460 }, { "label": "STL", "kind": CompletionItemKind.Text, "data": 461 }, { "label": "UNBUCKETIZE", "kind": CompletionItemKind.Text, "data": 462 }, { "label": "MACROFILTER", "kind": CompletionItemKind.Text, "data": 463 }, { "label": "MAXLONG", "kind": CompletionItemKind.Text, "data": 464 }, { "label": "MINLONG", "kind": CompletionItemKind.Text, "data": 465 }, { "label": "NULL", "kind": CompletionItemKind.Text, "data": 466 }, { "label": "PI_UC", "kind": CompletionItemKind.Text, "data": 467 }]
});

// This handler resolve additional information for the item selected in
// the completion list.
connection.onCompletionResolve((item: CompletionItem): CompletionItem => {
	if (item.data === 0) {
		item.detail = 'DOUBLEEXPONENTIALSMOOTHING details',
			item.documentation = 'Apply double exponential smoothing on a gts.'
	} else if (item.data === 1) {
		item.detail = 'EVERY details',
			item.documentation = 'Executes the macro at the given interval (Mobius endpoint).'
	} else if (item.data === 2) {
		item.detail = 'EXPM1 details',
			item.documentation = 'Computes exp^x - 1.'
	} else if (item.data === 3) {
		item.detail = 'FINDSETS details',
			item.documentation = 'Extracts classes and label values of matching GTS.'
	} else if (item.data === 4) {
		item.detail = 'FUSE details',
			item.documentation = 'Merge chunks of GTS together.'
	} else if (item.data === 5) {
		item.detail = 'GROOVY details',
			item.documentation = 'Executes a script expressed in Groovy.'
	} else if (item.data === 6) {
		item.detail = 'HYPOT details',
			item.documentation = 'Returns sqrt(x²+y²) without intermediate overflow or underflow.'
	} else if (item.data === 7) {
		item.detail = 'IMMUTABLE details',
			item.documentation = 'Replaces a map/list/set with an unmodifiable version.'
	} else if (item.data === 8) {
		item.detail = 'JS details',
			item.documentation = 'Executes a script expressed in JavaScript.'
	} else if (item.data === 9) {
		item.detail = 'LOG1P details',
			item.documentation = 'Computes the natural logarithm of the top of the stack plus one.'
	} else if (item.data === 10) {
		item.detail = 'LUA details',
			item.documentation = 'Executes a script expressed in Lua.'
	} else if (item.data === 11) {
		item.detail = 'ONLYBUCKETS details',
			item.documentation = 'Removes ticks which do not fall on bucket boundaries.'
	} else if (item.data === 12) {
		item.detail = 'PAPPLY details',
			item.documentation = 'Behaves like APPLY except returned GTS are grouped by equivalence classes.'
	} else if (item.data === 13) {
		item.detail = 'PFILTER details',
			item.documentation = 'Behaves like FILTER except returned GTS are grouped by equivalence classes.'
	} else if (item.data === 14) {
		item.detail = 'PYTHON details',
			item.documentation = 'Executes a script expressed in Python.'
	} else if (item.data === 15) {
		item.detail = 'QCONJUGATE details',
			item.documentation = 'Compute the conjugate of a quaternion.'
	} else if (item.data === 16) {
		item.detail = 'QDIVIDE details',
			item.documentation = 'Divide a quaternion q by a quaternion r.'
	} else if (item.data === 17) {
		item.detail = 'QMULTIPLY details',
			item.documentation = 'Multiply two quaternions.'
	} else if (item.data === 18) {
		item.detail = 'QROTATE details',
			item.documentation = 'Rotate a vector by a quaternion.'
	} else if (item.data === 19) {
		item.detail = 'QROTATION details',
			item.documentation = 'Extract the axis and angle of rotation of a quaternion.'
	} else if (item.data === 20) {
		item.detail = 'R details',
			item.documentation = 'Execute a script in R syntax.'
	} else if (item.data === 21) {
		item.detail = 'ROTATIONQ details',
			item.documentation = 'Creates a quaternion from a rotation axis and angle.'
	} else if (item.data === 22) {
		item.detail = 'RTO details',
			item.documentation = 'Convert R types back to WarpScript types.'
	} else if (item.data === 23) {
		item.detail = 'RUBY details',
			item.documentation = 'Executes a script expressed in Ruby.'
	} else if (item.data === 24) {
		item.detail = 'STACKATTRIBUTE details',
			item.documentation = 'Pushes onto the stack the value of the named attribute.'
	} else if (item.data === 25) {
		item.detail = 'TOQ details',
			item.documentation = 'Converts coordinates to a quaternion.'
	} else if (item.data === 26) {
		item.detail = 'ULP details',
			item.documentation = 'Returns the size of an Units in the Last Place of the top of the stack.'
	} else if (item.data === 27) {
		item.detail = 'SENSISIONEVENT details',
			item.documentation = 'Emits a Sensision event.'
	} else if (item.data === 28) {
		item.detail = 'SENSISIONGET details',
			item.documentation = 'Set a value for a Sensision metric.'
	} else if (item.data === 29) {
		item.detail = 'SENSISIONSET details',
			item.documentation = 'Set a value for a Sensision metric.'
	} else if (item.data === 30) {
		item.detail = 'SENSISIONUPDATE details',
			item.documentation = 'Update a value for a numerical Sensision metric.'
	} else if (item.data === 31) {
		item.detail = 'CEVAL details',
			item.documentation = 'Execute macros concurrently.'
	} else if (item.data === 32) {
		item.detail = 'SYNC details',
			item.documentation = 'Execute a macro in a synchronized manner inside of a CEVAL call.'
	} else if (item.data === 33) {
		item.detail = 'JSONTO details',
			item.documentation = 'Parses a string as JSON and pushes the result onto the stack.'
	} else if (item.data === 34) {
		item.detail = 'PICKLETO details',
			item.documentation = 'Decodes Pickle content.'
	} else if (item.data === 35) {
		item.detail = 'TOBIN details',
			item.documentation = 'Converts a long to its binary representation.'
	} else if (item.data === 36) {
		item.detail = 'TOBOOLEAN details',
			item.documentation = 'Converts number or string to boolean'
	} else if (item.data === 37) {
		item.detail = 'TODOUBLE details',
			item.documentation = 'Convert a number to double'
	} else if (item.data === 38) {
		item.detail = 'TOLONG details',
			item.documentation = 'Convert a number to long'
	} else if (item.data === 39) {
		item.detail = 'TOSTRING details',
			item.documentation = 'Convert the argument to string'
	} else if (item.data === 40) {
		item.detail = 'TOTIMESTAMP details',
			item.documentation = 'Converts an ISO8601 date/time string into a number of time units.'
	} else if (item.data === 41) {
		item.detail = 'CALL details',
			item.documentation = 'Invoke an external program.'
	} else if (item.data === 42) {
		item.detail = 'CUDF details',
			item.documentation = 'Invoke a possibly cached version of a UDF.'
	} else if (item.data === 43) {
		item.detail = 'UDF details',
			item.documentation = 'Invoke a UDF.'
	} else if (item.data === 44) {
		item.detail = '2BIN details',
			item.documentation = 'Converts a string to its binary representation.'
	} else if (item.data === 45) {
		item.detail = '2HEX details',
			item.documentation = 'Converts a string to the hexadecimal representation of its UTF-8 encoding.'
	} else if (item.data === 46) {
		item.detail = 'B64TO details',
			item.documentation = 'Decodes a base64 encoded string.'
	} else if (item.data === 47) {
		item.detail = 'B64TOHEX details',
			item.documentation = 'Decodes a base64 encoded string and immediately re-encode it in hex.'
	} else if (item.data === 48) {
		item.detail = 'B64URL details',
			item.documentation = 'Decodes a base64url encoded string.'
	} else if (item.data === 49) {
		item.detail = 'BIN2 details',
			item.documentation = 'Decode a String in binary.'
	} else if (item.data === 50) {
		item.detail = 'BINTOHEX details',
			item.documentation = 'Decodes a binary encoded string and immediately re-encode it in hex.'
	} else if (item.data === 51) {
		item.detail = 'BYTESTO details',
			item.documentation = 'Converts a bytes array into a string'
	} else if (item.data === 52) {
		item.detail = 'FROMBIN details',
			item.documentation = 'Converts a binary representation of a long into a long.'
	} else if (item.data === 53) {
		item.detail = 'FROMHEX details',
			item.documentation = 'Converts an hexadecimal representation into a long.'
	} else if (item.data === 54) {
		item.detail = 'HASH details',
			item.documentation = 'Computes a 64 bits hash of the string on top of the stack.'
	} else if (item.data === 55) {
		item.detail = 'HEXTO details',
			item.documentation = 'Decodes an hex encoded string.'
	} else if (item.data === 56) {
		item.detail = 'HEXTOB64 details',
			item.documentation = 'Decodes a hex encoded string and immediately re-encode it in base64.'
	} else if (item.data === 57) {
		item.detail = 'HEXTOBIN details',
			item.documentation = 'Decodes a hex encoded string and immediately re-encode it in binary.'
	} else if (item.data === 58) {
		item.detail = 'JOIN details',
			item.documentation = 'Join N strings with the given separator'
	} else if (item.data === 59) {
		item.detail = 'MATCH details',
			item.documentation = 'Apply a regular expression to a string'
	} else if (item.data === 60) {
		item.detail = 'MATCHER details',
			item.documentation = 'Builds a compiled object form a regular expression.'
	} else if (item.data === 61) {
		item.detail = 'OPB64TO details',
			item.documentation = 'Decodes an order preserving base64 encoded string.'
	} else if (item.data === 62) {
		item.detail = 'OPB64TOHEX details',
			item.documentation = 'Decodes an order preserving base64 encoded string and immediately re-encode it in hex.'
	} else if (item.data === 63) {
		item.detail = 'REPLACE details',
			item.documentation = 'Replaces the first substring of the input string that matches the given regular expression with the given replacement.'
	} else if (item.data === 64) {
		item.detail = 'REPLACEALL details',
			item.documentation = 'Replaces all substrings of the input string that matches the given regular expression with the given replacement.'
	} else if (item.data === 65) {
		item.detail = 'SPLIT details',
			item.documentation = 'Split a string in segments'
	} else if (item.data === 66) {
		item.detail = 'SUBSTRING details',
			item.documentation = 'Extracts a substring from a string.'
	} else if (item.data === 67) {
		item.detail = 'TEMPLATE details',
			item.documentation = 'Fills a template with values contained in a map.'
	} else if (item.data === 68) {
		item.detail = 'TOB64 details',
			item.documentation = 'Encodes a string in base64.'
	} else if (item.data === 69) {
		item.detail = 'TOB64URL details',
			item.documentation = 'Encodes a string in base64url.'
	} else if (item.data === 70) {
		item.detail = 'TOBYTES details',
			item.documentation = 'Converts a string into its bytes given a charset'
	} else if (item.data === 71) {
		item.detail = 'TOHEX details',
			item.documentation = 'Converts a long to its 64 bits hexadecimal representaiton.'
	} else if (item.data === 72) {
		item.detail = 'TOLOWER details',
			item.documentation = 'Converts the string on top of the stack to lower case.'
	} else if (item.data === 73) {
		item.detail = 'TOOPB64 details',
			item.documentation = 'Encodes a string in order preserving base64.'
	} else if (item.data === 74) {
		item.detail = 'TOUPPER details',
			item.documentation = 'Converts the string on top of the stack to upper case.'
	} else if (item.data === 75) {
		item.detail = 'TRIM details',
			item.documentation = 'Trims whitespaces from both ends of the string on top of the stack.'
	} else if (item.data === 76) {
		item.detail = 'URLDECODE details',
			item.documentation = 'Decode an URL encoded string'
	} else if (item.data === 77) {
		item.detail = 'URLENCODE details',
			item.documentation = 'URL Encode a string'
	} else if (item.data === 78) {
		item.detail = 'UUID details',
			item.documentation = 'Generates a UUID and pushes it on top of the stack.'
	} else if (item.data === 79) {
		item.detail = 'ADDDAYS details',
			item.documentation = 'Adds a certain number of days to a timestamp.'
	} else if (item.data === 80) {
		item.detail = 'ADDMONTHS details',
			item.documentation = 'Adds a certain number of months to a timestamp.'
	} else if (item.data === 81) {
		item.detail = 'ADDYEARS details',
			item.documentation = 'Adds a certain number of years to a timestamp.'
	} else if (item.data === 82) {
		item.detail = 'AGO details',
			item.documentation = 'Computes a timestamp from an offset in time units.'
	} else if (item.data === 83) {
		item.detail = 'DURATION details',
			item.documentation = 'Transform an ISO8601 duration into microsecondes'
	} else if (item.data === 84) {
		item.detail = 'HUMANDURATION details',
			item.documentation = 'Convert a number of time units into a human readable duration.'
	} else if (item.data === 85) {
		item.detail = 'ISO8601 details',
			item.documentation = 'Transform a timestamp into a date in ISO 8601 format'
	} else if (item.data === 86) {
		item.detail = 'ISODURATION details',
			item.documentation = 'Convert a number of time units into an ISO8601 duration string.'
	} else if (item.data === 87) {
		item.detail = 'MSTU details',
			item.documentation = 'Push onto the stack a the number of time units in a millisecond'
	} else if (item.data === 88) {
		item.detail = 'NOTAFTER details',
			item.documentation = 'Checks that the current time is not after the provided timestamp. Fails otherwise.'
	} else if (item.data === 89) {
		item.detail = 'NOTBEFORE details',
			item.documentation = 'Checks that the current time is not before the provided timestamp. Fails otherwise.'
	} else if (item.data === 90) {
		item.detail = 'NOW details',
			item.documentation = 'Push on the stack the current time in microseconds since the Unix Epoch'
	} else if (item.data === 91) {
		item.detail = 'STU details',
			item.documentation = 'Push onto the stack a the number of time units in a second'
	} else if (item.data === 92) {
		item.detail = 'TOTSELEMENTS details',
			item.documentation = 'Replaces the timestamp with an array of its elements'
	} else if (item.data === 93) {
		item.detail = 'TSELEMENTS details',
			item.documentation = 'Replaces the timestamp with an array of its elements'
	} else if (item.data === 94) {
		item.detail = 'TSELEMENTSTO details',
			item.documentation = 'Converts various timestamp\'s elements into a timestamp for a given timezone'
	} else if (item.data === 95) {
		item.detail = 'AESUNWRAP details',
			item.documentation = 'Unwrap wrapped byte array '
	} else if (item.data === 96) {
		item.detail = 'AESWRAP details',
			item.documentation = 'Wrap a byte array or String with AES cypher'
	} else if (item.data === 97) {
		item.detail = 'MD5 details',
			item.documentation = 'Message Digest of a byte array with the cryptographic hash function MD5.'
	} else if (item.data === 98) {
		item.detail = 'RSADECRYPT details',
			item.documentation = 'Decrypt encoded data using RSA'
	} else if (item.data === 99) {
		item.detail = 'RSAENCRYPT details',
			item.documentation = 'Encrypt data using RSA keys'
	} else if (item.data === 100) {
		item.detail = 'RSAGEN details',
			item.documentation = 'Generates a RSA key pair.'
	} else if (item.data === 101) {
		item.detail = 'RSAPRIVATE details',
			item.documentation = 'Produce a RSA private key from a parameter map.'
	} else if (item.data === 102) {
		item.detail = 'RSAPUBLIC details',
			item.documentation = 'Produce a RSA public key from a parameter map.'
	} else if (item.data === 103) {
		item.detail = 'RSASIGN details',
			item.documentation = 'Sign data using RSA and a hash algorithm.'
	} else if (item.data === 104) {
		item.detail = 'RSAVERIFY details',
			item.documentation = 'Sign data using RSA and a hash algorithm.'
	} else if (item.data === 105) {
		item.detail = 'SHA1 details',
			item.documentation = 'Message Digest of a byte array with the cryptographic hash function SHA1.'
	} else if (item.data === 106) {
		item.detail = 'SHA1HMAC details',
			item.documentation = 'Computes a Hash-based Message Authentication Code (HMAC) that uses a key in conjunction with a SHA-1 cryptographic hash function.'
	} else if (item.data === 107) {
		item.detail = 'SHA256 details',
			item.documentation = 'Message Digest of a byte array with the cryptographic hash function SHA256.'
	} else if (item.data === 108) {
		item.detail = 'SHA256HMAC details',
			item.documentation = 'Computes a Hash-based Message Authentication Code (HMAC) that uses a key in conjunction with a SHA-256 cryptographic hash function.'
	} else if (item.data === 109) {
		item.detail = 'GZIP details',
			item.documentation = 'Compresses a byte array or String'
	} else if (item.data === 110) {
		item.detail = 'TOZ details',
			item.documentation = 'Builds a z-value.'
	} else if (item.data === 111) {
		item.detail = 'UNGZIP details',
			item.documentation = 'Decompresses a compressed byte array.'
	} else if (item.data === 112) {
		item.detail = 'ZTO details',
			item.documentation = 'Decomposes a Z-Value.'
	} else if (item.data === 113) {
		item.detail = 'AUTHENTICATE details',
			item.documentation = 'Authenticates the current stack.'
	} else if (item.data === 114) {
		item.detail = 'BOOTSTRAP details',
			item.documentation = 'Function executed before the WarpScript stack becomes available.'
	} else if (item.data === 115) {
		item.detail = 'CLEAR details',
			item.documentation = 'Remove all elements from the stack'
	} else if (item.data === 116) {
		item.detail = 'CLEARDEFS details',
			item.documentation = 'Clear redefined WarpScript functions.'
	} else if (item.data === 117) {
		item.detail = 'CLEARSYMBOLS details',
			item.documentation = 'Clear all symbols name of the stack.'
	} else if (item.data === 118) {
		item.detail = 'CLEARTOMARK details',
			item.documentation = 'Removes elements from the stack up to and including the first mark encountered.'
	} else if (item.data === 119) {
		item.detail = 'CLOSE_BRACKET details',
			item.documentation = 'Closes an open list.'
	} else if (item.data === 120) {
		item.detail = 'CLOSE_MARK details',
			item.documentation = 'Closes an open list.'
	} else if (item.data === 121) {
		item.detail = 'COUNTTOMARK details',
			item.documentation = 'Counts the number of elements on the stack up to but excluding the first mark encountered.'
	} else if (item.data === 122) {
		item.detail = 'CSTORE details',
			item.documentation = 'Conditionnaly store the element below the top of the stack under the symbol name on top of the stack'
	} else if (item.data === 123) {
		item.detail = 'DEBUGOFF details',
			item.documentation = 'Turns off stack debugging.'
	} else if (item.data === 124) {
		item.detail = 'DEBUGON details',
			item.documentation = 'Turns on stack debugging.'
	} else if (item.data === 125) {
		item.detail = 'DEF details',
			item.documentation = 'Define or redefine a WarpScript function.'
	} else if (item.data === 126) {
		item.detail = 'DEPTH details',
			item.documentation = 'Push on the stack the depth of the stack'
	} else if (item.data === 127) {
		item.detail = 'DOC details',
			item.documentation = 'Defines the documentation string for a macro.'
	} else if (item.data === 128) {
		item.detail = 'DOCMODE details',
			item.documentation = 'Turns on documentation mode.'
	} else if (item.data === 129) {
		item.detail = 'DROP details',
			item.documentation = 'Remove the top element from the stack'
	} else if (item.data === 130) {
		item.detail = 'DROPN details',
			item.documentation = 'Remove the N top elements from the stack'
	} else if (item.data === 131) {
		item.detail = 'DUP details',
			item.documentation = 'Duplicates the top of the stack'
	} else if (item.data === 132) {
		item.detail = 'DUPN details',
			item.documentation = 'Duplicates the N top of the stack'
	} else if (item.data === 133) {
		item.detail = 'ELAPSED details',
			item.documentation = 'Pushes on the stack the collected timing informations.'
	} else if (item.data === 134) {
		item.detail = 'EXPORT details',
			item.documentation = 'Sets or updates the list of exported symbols'
	} else if (item.data === 135) {
		item.detail = 'FORGET details',
			item.documentation = ''
	} else if (item.data === 136) {
		item.detail = 'LOAD details',
			item.documentation = 'Pushes onto the stack the value of the symbol whose name is on the stack.'
	} else if (item.data === 137) {
		item.detail = 'MARK details',
			item.documentation = 'Pushes a mark onto the stack.'
	} else if (item.data === 138) {
		item.detail = 'NDEBUGON details',
			item.documentation = 'Turns on stack debugging, specifying the number of stack levels to return in case of error.'
	} else if (item.data === 139) {
		item.detail = 'NOTIMINGS details',
			item.documentation = 'Turns off timing collection.'
	} else if (item.data === 140) {
		item.detail = 'OPEN_BRACKET details',
			item.documentation = 'Starts a list by pushing a mark onto the stack.'
	} else if (item.data === 141) {
		item.detail = 'OPEN_MARK details',
			item.documentation = 'Starts a map by pushing a mark onto the stack.'
	} else if (item.data === 142) {
		item.detail = 'PICK details',
			item.documentation = 'Copies onto the top of the stack the n-th element of the stack'
	} else if (item.data === 143) {
		item.detail = 'RESET details',
			item.documentation = 'Reset the stack to a specific depth.'
	} else if (item.data === 144) {
		item.detail = 'REXEC details',
			item.documentation = 'Executes some WarpScript on a remote Warp 10.'
	} else if (item.data === 145) {
		item.detail = 'ROLL details',
			item.documentation = 'Moves the N-th element of the stack onto the top'
	} else if (item.data === 146) {
		item.detail = 'ROLLD details',
			item.documentation = 'Moves the element on top of the stack to the N-th position'
	} else if (item.data === 147) {
		item.detail = 'ROT details',
			item.documentation = 'Move the third element of the stack onto the top'
	} else if (item.data === 148) {
		item.detail = 'RUN details',
			item.documentation = 'Executes the macro whose name is on the stack.'
	} else if (item.data === 149) {
		item.detail = 'SNAPSHOT details',
			item.documentation = 'Converts the content of the stack into WarpScript code.'
	} else if (item.data === 150) {
		item.detail = 'SNAPSHOTALL details',
			item.documentation = 'Converts the content of the stack and current symbols into WarpScript code.'
	} else if (item.data === 151) {
		item.detail = 'SNAPSHOTALLTOMARK details',
			item.documentation = 'Converts the content of the stack above a MARK and current symbols into WarpScript code.'
	} else if (item.data === 152) {
		item.detail = 'SNAPSHOTTOMARK details',
			item.documentation = 'Converts part of the stack into WarpScript code.'
	} else if (item.data === 153) {
		item.detail = 'STACKATTRIBUTE details',
			item.documentation = 'Extract the stack attributes and push them on top of the stack'
	} else if (item.data === 154) {
		item.detail = 'STACKTOLIST details',
			item.documentation = 'Convert the whole stack into a list and push this list on the top of the stack.'
	} else if (item.data === 155) {
		item.detail = 'STORE details',
			item.documentation = 'Store the element below the top of the stack under the symbol name on top of the stack'
	} else if (item.data === 156) {
		item.detail = 'SWAP details',
			item.documentation = 'Swap the two two elements of the stack'
	} else if (item.data === 157) {
		item.detail = 'TIMINGS details',
			item.documentation = 'Turns on timing collection.'
	} else if (item.data === 158) {
		item.detail = 'TYPEOF details',
			item.documentation = 'Pushes onto the stack the type of the element on top of the stack.'
	} else if (item.data === 159) {
		item.detail = 'EVALSECURE details',
			item.documentation = 'Evaluates the secured script on top of the stack'
	} else if (item.data === 160) {
		item.detail = 'HEADER details',
			item.documentation = 'Set a header which will be returned with the HTTP response.'
	} else if (item.data === 161) {
		item.detail = 'IDENT details',
			item.documentation = 'Pushes on the stack the ident string of the running platform.'
	} else if (item.data === 162) {
		item.detail = 'JSONLOOSE details',
			item.documentation = 'Generate a loose JSON version (with NaN and Infinite values allowed) of the stack'
	} else if (item.data === 163) {
		item.detail = 'JSONSTRICT details',
			item.documentation = 'Generate a JSON version of the stack'
	} else if (item.data === 164) {
		item.detail = 'LIMIT details',
			item.documentation = 'Modifies the maximum number of datapoints which can be fetched during a script execution.'
	} else if (item.data === 165) {
		item.detail = 'MAXBUCKETS details',
			item.documentation = 'Modifies the maximum number of buckets which can be created by a call to BUCKETIZE.'
	} else if (item.data === 166) {
		item.detail = 'MAXDEPTH details',
			item.documentation = 'Modifies the maximum depth of the stack.'
	} else if (item.data === 167) {
		item.detail = 'MAXGTS details',
			item.documentation = 'Modifies the maximum number of Geo Time Series which can be retrieved.'
	} else if (item.data === 168) {
		item.detail = 'MAXLOOP details',
			item.documentation = 'Modifies the upper limit of time which can be spent in a loop.'
	} else if (item.data === 169) {
		item.detail = 'MAXOPS details',
			item.documentation = 'Modifies the maximum number of WarpScript operations which can be performed during a single execution.'
	} else if (item.data === 170) {
		item.detail = 'MAXSYMBOLS details',
			item.documentation = 'Modifies the maximum number of symbols which can be created during a single WarpScript execution.'
	} else if (item.data === 171) {
		item.detail = 'NOOP details',
			item.documentation = 'Does absolutely nothing, but does it well!'
	} else if (item.data === 172) {
		item.detail = 'OPS details',
			item.documentation = 'Pushes onto the stack the current number of operations which were performed by the WarpScript code execution.'
	} else if (item.data === 173) {
		item.detail = 'RESTORE details',
			item.documentation = 'Restores the stack context.'
	} else if (item.data === 174) {
		item.detail = 'REV details',
			item.documentation = 'Pushes on the stack the revision string of the running platform.'
	} else if (item.data === 175) {
		item.detail = 'RTFM details',
			item.documentation = 'There is always a documentation for your function'
	} else if (item.data === 176) {
		item.detail = 'SAVE details',
			item.documentation = 'Pushes on the stack its current context.'
	} else if (item.data === 177) {
		item.detail = 'SECUREKEY details',
			item.documentation = 'Set the secure key for creating secure scripts.'
	} else if (item.data === 178) {
		item.detail = 'TOKENINFO details',
			item.documentation = 'Extracts information on the token on top of the stack'
	} else if (item.data === 179) {
		item.detail = 'UNSECURE details',
			item.documentation = 'Retrieve the original script from a secure script.'
	} else if (item.data === 180) {
		item.detail = 'URLFETCH details',
			item.documentation = 'Retrieves the content of a URL.'
	} else if (item.data === 181) {
		item.detail = 'WEBCALL details',
			item.documentation = 'Makes an outbound HTTP call.'
	} else if (item.data === 182) {
		item.detail = 'ABS details',
			item.documentation = 'Calculates the absolute value of a number'
	} else if (item.data === 183) {
		item.detail = 'ADD details',
			item.documentation = 'Add two parameters'
	} else if (item.data === 184) {
		item.detail = 'ALMOSTEQ details',
			item.documentation = 'Verify if the difference between two numbers is lesser than a third argument'
	} else if (item.data === 185) {
		item.detail = 'AND details',
			item.documentation = 'This is synonymous for &&.'
	} else if (item.data === 186) {
		item.detail = 'BITWISE_AND details',
			item.documentation = 'Computes the bitwise AND of the two arguments'
	} else if (item.data === 187) {
		item.detail = 'BITWISE_COMPLEMENT details',
			item.documentation = 'Computes the unary bitwise complement of the long value on top of the stack.'
	} else if (item.data === 188) {
		item.detail = 'BITWISE_OR details',
			item.documentation = 'Computes the bitwise OR of the two arguments'
	} else if (item.data === 189) {
		item.detail = 'BITWISE_XOR details',
			item.documentation = 'Computes the bitwise XOR of the two arguments'
	} else if (item.data === 190) {
		item.detail = 'CBRT details',
			item.documentation = 'Calculate the cubic root'
	} else if (item.data === 191) {
		item.detail = 'CEIL details',
			item.documentation = 'Round a number to the nearest bigger long'
	} else if (item.data === 192) {
		item.detail = 'COND_AND details',
			item.documentation = 'Computes the conditional AND of the two arguments'
	} else if (item.data === 193) {
		item.detail = 'COND_OR details',
			item.documentation = 'Computes the conditional OR of the two arguments'
	} else if (item.data === 194) {
		item.detail = 'COPYSIGN details',
			item.documentation = 'Copies the sign of a number on another one.'
	} else if (item.data === 195) {
		item.detail = 'DIV details',
			item.documentation = 'Divide a number by another'
	} else if (item.data === 196) {
		item.detail = 'DOUBLEBITSTO details',
			item.documentation = 'Converts the long on top of the stack to a double by considering the long value as the raw bits of the double.'
	} else if (item.data === 197) {
		item.detail = 'EQ details',
			item.documentation = 'Verify the equality of two parameters'
	} else if (item.data === 198) {
		item.detail = 'EXP details',
			item.documentation = 'Return e raised to the power of the argument'
	} else if (item.data === 199) {
		item.detail = 'FLOATBITSTO details',
			item.documentation = 'Converts the long on top of the stack to a double by considering the long value as the raw bits of a float.'
	} else if (item.data === 200) {
		item.detail = 'FLOOR details',
			item.documentation = 'Round a number to the nearest smaller long'
	} else if (item.data === 201) {
		item.detail = 'GE details',
			item.documentation = 'Verify if the first parameter is greater or equal than the second'
	} else if (item.data === 202) {
		item.detail = 'GT details',
			item.documentation = 'Verify if the first parameter is greater than the second'
	} else if (item.data === 203) {
		item.detail = 'IEEEREMAINDER details',
			item.documentation = 'For parameters \'f1' and 'f2', it calculates the remainder when 'f1' is divided by 'f2'
	} else if (item.data === 204) {
		item.detail = 'INPLACEADD details',
			item.documentation = 'Adds an element to an existing list or set'
	} else if (item.data === 205) {
		item.detail = 'ISNULL details',
			item.documentation = 'Checks whether the top of the stack is null.'
	} else if (item.data === 206) {
		item.detail = 'LBOUNDS details',
			item.documentation = 'Pushes onto the stack a list of M+1 bounds defining M intervals between a and b plus the intervals before a and after b.'
	} else if (item.data === 207) {
		item.detail = 'LE details',
			item.documentation = 'Verify than the first parameter is lesser or equal to the second'
	} else if (item.data === 208) {
		item.detail = 'LEFT_SHIFT details',
			item.documentation = 'Left shifting of bit pattern.'
	} else if (item.data === 209) {
		item.detail = 'LOG details',
			item.documentation = 'Calculate the natural logarithm'
	} else if (item.data === 210) {
		item.detail = 'LOG10 details',
			item.documentation = 'Calculate the common logarithm'
	} else if (item.data === 211) {
		item.detail = 'LT details',
			item.documentation = 'Verify if the first parameter is lesser than the second'
	} else if (item.data === 212) {
		item.detail = 'MAX details',
			item.documentation = 'Calculates the maximum of two numbers'
	} else if (item.data === 213) {
		item.detail = 'MIN details',
			item.documentation = 'Calculates the minimum of two numbers'
	} else if (item.data === 214) {
		item.detail = 'MOD details',
			item.documentation = 'Calculates the remainder of the division of two numbers'
	} else if (item.data === 215) {
		item.detail = 'MUL details',
			item.documentation = 'Multiply two numbers'
	} else if (item.data === 216) {
		item.detail = 'NBOUNDS details',
			item.documentation = 'Pushes a list of n-1 bounds defining n intervals with equal area under the bell cureve N(mu,sigma).'
	} else if (item.data === 217) {
		item.detail = 'NE details',
			item.documentation = 'Verify if two parameters aren\'t equal'
	} else if (item.data === 218) {
		item.detail = 'NEXTAFTER details',
			item.documentation = 'Returns the DOUBLE adjacent to the first argument in the direction of the second argument'
	} else if (item.data === 219) {
		item.detail = 'NEXTUP details',
			item.documentation = 'Returns the DOUBLE  adjacent to the argument in the direction of positive infinity'
	} else if (item.data === 220) {
		item.detail = 'NOT details',
			item.documentation = 'Apply the logical function NOT'
	} else if (item.data === 221) {
		item.detail = 'NOT_TXT details',
			item.documentation = 'Negates the boolean on the stack.'
	} else if (item.data === 222) {
		item.detail = 'NPDF details',
			item.documentation = 'Parametrable function to create NDPF (Normal Distribution Probability Density Functions)'
	} else if (item.data === 223) {
		item.detail = 'OR details',
			item.documentation = 'Do a boolean OR between booleans on the stack.'
	} else if (item.data === 224) {
		item.detail = 'POW details',
			item.documentation = 'For parameters a\' and 'b', it calculates 'a' raised to the power 'b'
	} else if (item.data === 225) {
		item.detail = 'PROBABILITY details',
			item.documentation = 'Pushes on the stack a function which computes probabilities according to a provided value histogram.'
	} else if (item.data === 226) {
		item.detail = 'RAND details',
			item.documentation = 'Push on the stack a random number between 0 and 1'
	} else if (item.data === 227) {
		item.detail = 'RANDPDF details',
			item.documentation = 'Pushes on the stack a function which emits values according to a provided value histogram.'
	} else if (item.data === 228) {
		item.detail = 'REVBITS details',
			item.documentation = 'Reverse the bits of the long on top of the stack.'
	} else if (item.data === 229) {
		item.detail = 'RIGHT_SHIFT details',
			item.documentation = 'Signed right bit shift.'
	} else if (item.data === 230) {
		item.detail = 'RINT details',
			item.documentation = 'Return the DOUBLE closest to the value and equal to a mathematical integer'
	} else if (item.data === 231) {
		item.detail = 'ROUND details',
			item.documentation = 'Round a number to the closest long'
	} else if (item.data === 232) {
		item.detail = 'SIGNUM details',
			item.documentation = 'Return the signum of a number'
	} else if (item.data === 233) {
		item.detail = 'SQRT details',
			item.documentation = 'Calculate the square root'
	} else if (item.data === 234) {
		item.detail = 'SUB details',
			item.documentation = 'Substract two numbers'
	} else if (item.data === 235) {
		item.detail = 'TODOUBLEBITS details',
			item.documentation = 'Converts a double to a long value of the raw bits of its representation.'
	} else if (item.data === 236) {
		item.detail = 'TOFLOATBITS details',
			item.documentation = 'Converts a double to a long value of the raw bits of its float representation.'
	} else if (item.data === 237) {
		item.detail = 'UNSIGNED_RIGHT_SHIFT details',
			item.documentation = 'Unsigned right bit shift, setting the most significant bit to 0.'
	} else if (item.data === 238) {
		item.detail = 'TOPICKLE details',
			item.documentation = 'Converts the object on top of the stack to its PICKLE representation.'
	} else if (item.data === 239) {
		item.detail = 'ACOS details',
			item.documentation = 'Calculate the arccosine'
	} else if (item.data === 240) {
		item.detail = 'ASIN details',
			item.documentation = 'Calculate the arcsine'
	} else if (item.data === 241) {
		item.detail = 'ATAN details',
			item.documentation = 'Calculate the arctangent'
	} else if (item.data === 242) {
		item.detail = 'COS details',
			item.documentation = 'Calculate the cosine'
	} else if (item.data === 243) {
		item.detail = 'COSH details',
			item.documentation = 'Calculate the hyperbolic cosine'
	} else if (item.data === 244) {
		item.detail = 'SIN details',
			item.documentation = 'Calculate the sine'
	} else if (item.data === 245) {
		item.detail = 'SINH details',
			item.documentation = 'Calculate hyperbolic sine'
	} else if (item.data === 246) {
		item.detail = 'TAN details',
			item.documentation = 'Calculate the tangent'
	} else if (item.data === 247) {
		item.detail = 'TANH details',
			item.documentation = 'Calculate the hyperbolic tangent'
	} else if (item.data === 248) {
		item.detail = 'TODEGREES details',
			item.documentation = 'Convert from radians to degrees'
	} else if (item.data === 249) {
		item.detail = 'TORADIANS details',
			item.documentation = 'Convert from degrees to radians'
	} else if (item.data === 250) {
		item.detail = 'COUNTER details',
			item.documentation = 'Push a counter (AtomicLong) onto the stack.'
	} else if (item.data === 251) {
		item.detail = 'COUNTERDELTA details',
			item.documentation = 'Increment a counter.'
	} else if (item.data === 252) {
		item.detail = 'COUNTERVALUE details',
			item.documentation = 'Retrieve the value of a counter.'
	} else if (item.data === 253) {
		item.detail = 'RANGE details',
			item.documentation = 'Pushes onto the stack a list of integers in the given range.'
	} else if (item.data === 254) {
		item.detail = 'QCONJUGATE details',
			item.documentation = 'Compute the conjugate of a quaternion.'
	} else if (item.data === 255) {
		item.detail = 'QDIVIDE details',
			item.documentation = 'Divide a quaternion q by a quaternion r'
	} else if (item.data === 256) {
		item.detail = 'QMULTIPLY details',
			item.documentation = 'Multiply a quaternion q by a quaternion r'
	} else if (item.data === 257) {
		item.detail = 'QROTATE details',
			item.documentation = 'Rotate a vector by a quaternion'
	} else if (item.data === 258) {
		item.detail = 'QROTATION details',
			item.documentation = 'Extract the axis and angle of the rotation represented by the quaternion on the stack.'
	} else if (item.data === 259) {
		item.detail = 'QTO details',
			item.documentation = 'Converts 4 double to a unit quaternion.'
	} else if (item.data === 260) {
		item.detail = 'ROTATIONQ details',
			item.documentation = 'Create a quaternion from an axis and rotation angle (in degrees)'
	} else if (item.data === 261) {
		item.detail = 'TOQ details',
			item.documentation = 'Converts 4 double to a unit quaternion.'
	} else if (item.data === 262) {
		item.detail = 'BITCOUNT details',
			item.documentation = 'Computes the length of a bitset and the number of bits set.'
	} else if (item.data === 263) {
		item.detail = 'BITGET details',
			item.documentation = 'Gets a bit in a bits set.'
	} else if (item.data === 264) {
		item.detail = 'BITSTOBYTES details',
			item.documentation = 'Converts a bitset into a byte array.'
	} else if (item.data === 265) {
		item.detail = 'BYTESTOBITS details',
			item.documentation = 'Converts a byte array into a bitset.'
	} else if (item.data === 266) {
		item.detail = 'ASSERT details',
			item.documentation = 'Halt execution of the script if the top of the stack is not the BOOLEAN true'
	} else if (item.data === 267) {
		item.detail = 'BREAK details',
			item.documentation = 'Break out of the current loop'
	} else if (item.data === 268) {
		item.detail = 'CONTINUE details',
			item.documentation = 'Immediately start a new iteration in a running loop.'
	} else if (item.data === 269) {
		item.detail = 'DEFINED details',
			item.documentation = 'Check whether or not a symbol is defined'
	} else if (item.data === 270) {
		item.detail = 'DEFINEDMACRO details',
			item.documentation = 'Checks if a macro is defined and pushes true or false on the stack accordingly.'
	} else if (item.data === 271) {
		item.detail = 'EVAL details',
			item.documentation = 'Evaluates the string on top of the stack'
	} else if (item.data === 272) {
		item.detail = 'FAIL details',
			item.documentation = 'Halt execution of the script'
	} else if (item.data === 273) {
		item.detail = 'FOR details',
			item.documentation = 'Implement a for loop'
	} else if (item.data === 274) {
		item.detail = 'FOREACH details',
			item.documentation = 'Implement a foreach loop on a list or map'
	} else if (item.data === 275) {
		item.detail = 'FORSTEP details',
			item.documentation = 'Implement a for loop with an index step'
	} else if (item.data === 276) {
		item.detail = 'IFT details',
			item.documentation = 'Implement the if-then conditional'
	} else if (item.data === 277) {
		item.detail = 'IFTE details',
			item.documentation = 'Implement the if-then-else conditional'
	} else if (item.data === 278) {
		item.detail = 'MSGFAIL details',
			item.documentation = 'Halt execution of the script, returning the message on top of the stack.'
	} else if (item.data === 279) {
		item.detail = 'NRETURN details',
			item.documentation = 'Immediately exit N macros being executed.'
	} else if (item.data === 280) {
		item.detail = 'RETURN details',
			item.documentation = 'Immediately exit the macro being executed.'
	} else if (item.data === 281) {
		item.detail = 'STOP details',
			item.documentation = 'Immediately stop executing WarpScript.'
	} else if (item.data === 282) {
		item.detail = 'SWITCH details',
			item.documentation = 'Implement a switch-like conditional'
	} else if (item.data === 283) {
		item.detail = 'UNTIL details',
			item.documentation = 'Implement an until loop'
	} else if (item.data === 284) {
		item.detail = 'WHILE details',
			item.documentation = 'Implement a while loop'
	} else if (item.data === 285) {
		item.detail = 'CLONEREVERSE details',
			item.documentation = 'Clone a LIST and reverse its order'
	} else if (item.data === 286) {
		item.detail = 'CONTAINS details',
			item.documentation = 'Check if an element is in a LIST'
	} else if (item.data === 287) {
		item.detail = 'CONTAINSKEY details',
			item.documentation = 'Check if an element is one of the keys of a MAP'
	} else if (item.data === 288) {
		item.detail = 'CONTAINSVALUE details',
			item.documentation = 'Check if an element is one of the values of a MAP'
	} else if (item.data === 289) {
		item.detail = 'EMPTYLIST details',
			item.documentation = 'Push an empty LIST on top of the stack'
	} else if (item.data === 290) {
		item.detail = 'EMPTYMAP details',
			item.documentation = 'Push an empty MAP on top of the stack'
	} else if (item.data === 291) {
		item.detail = 'FLATTEN details',
			item.documentation = 'Flatten a LIST'
	} else if (item.data === 292) {
		item.detail = 'GET details',
			item.documentation = 'Retrieve a value in a MAP or in a LIST'
	} else if (item.data === 293) {
		item.detail = 'KEYLIST details',
			item.documentation = 'Extract the keys of a MAP'
	} else if (item.data === 294) {
		item.detail = 'LFLATMAP details',
			item.documentation = 'Apply a macro on each element of a list'
	} else if (item.data === 295) {
		item.detail = 'LISTTO details',
			item.documentation = 'Extract the elements of a LIST'
	} else if (item.data === 296) {
		item.detail = 'LMAP details',
			item.documentation = 'Apply a macro on each element of a list'
	} else if (item.data === 297) {
		item.detail = 'MAPID details',
			item.documentation = 'Generates a fingerprint of a map.'
	} else if (item.data === 298) {
		item.detail = 'MAPTO details',
			item.documentation = ''
	} else if (item.data === 299) {
		item.detail = 'MATTO details',
			item.documentation = 'Converts a Matrix into nested lists'
	} else if (item.data === 300) {
		item.detail = 'MSORT details',
			item.documentation = 'Sort a MAP'
	} else if (item.data === 301) {
		item.detail = 'PACK details',
			item.documentation = 'Pack a list of numeric or boolean values according to a specified format'
	} else if (item.data === 302) {
		item.detail = 'SIZE details',
			item.documentation = 'Push on the stack the size of a LIST, map or GTS'
	} else if (item.data === 303) {
		item.detail = 'SUBLIST details',
			item.documentation = 'Create a sub-LIST keeping only certain elements'
	} else if (item.data === 304) {
		item.detail = 'SUBMAP details',
			item.documentation = 'Create a sub-MAP keeping only certain pairs key-value'
	} else if (item.data === 305) {
		item.detail = 'TOLIST details',
			item.documentation = 'Creates a LIST with the top `N` elements of the stack'
	} else if (item.data === 306) {
		item.detail = 'TOMAP details',
			item.documentation = 'Creates a MAP with the top `N` elements of the stack'
	} else if (item.data === 307) {
		item.detail = 'TOMAT details',
			item.documentation = 'Converts nested lists of numbers into a Matrix'
	} else if (item.data === 308) {
		item.detail = 'TOV details',
			item.documentation = 'Convert the list on top of the stack into a set'
	} else if (item.data === 309) {
		item.detail = 'TOVEC details',
			item.documentation = 'Converts a list of numbers into a Vector'
	} else if (item.data === 310) {
		item.detail = 'UNIQUE details',
			item.documentation = 'Eliminates duplicate elements on a LIST'
	} else if (item.data === 311) {
		item.detail = 'UNLIST details',
			item.documentation = 'Push onto the stack all elements of the list on top of a Mark.'
	} else if (item.data === 312) {
		item.detail = 'UNMAP details',
			item.documentation = 'Deconstructs a map, putting each key/value pair as two elements on the stack on top of a Mark.'
	} else if (item.data === 313) {
		item.detail = 'UNPACK details',
			item.documentation = 'Unpack a list of numeric or boolean values according to a specified format'
	} else if (item.data === 314) {
		item.detail = 'VALUELIST details',
			item.documentation = 'Extract the values of a MAP'
	} else if (item.data === 315) {
		item.detail = 'VECTO details',
			item.documentation = 'Converts a Vector into a list'
	} else if (item.data === 316) {
		item.detail = 'VTO details',
			item.documentation = 'Convert the set on top of the stack into a list'
	} else if (item.data === 317) {
		item.detail = 'ZIP details',
			item.documentation = ''
	} else if (item.data === 318) {
		item.detail = 'DIFFERENCE details',
			item.documentation = 'Computes the difference of two sets'
	} else if (item.data === 319) {
		item.detail = 'INTERSECTION details',
			item.documentation = 'Computes the intersection of two sets.'
	} else if (item.data === 320) {
		item.detail = 'SET details',
			item.documentation = 'Replace an element in a list'
	} else if (item.data === 321) {
		item.detail = 'SETTO details',
			item.documentation = 'Converts the list on top of the stack into a set'
	} else if (item.data === 322) {
		item.detail = 'TOSET details',
			item.documentation = 'Converts the list on top of the stack into a set'
	} else if (item.data === 323) {
		item.detail = 'UNION details',
			item.documentation = 'Performs the union of two sets.'
	} else if (item.data === 324) {
		item.detail = 'APPEND details',
			item.documentation = 'Append a LIST or MAP to another'
	} else if (item.data === 325) {
		item.detail = 'LSORT details',
			item.documentation = 'Sort a LIST'
	} else if (item.data === 326) {
		item.detail = 'PUT details',
			item.documentation = 'Insert a key-value pair into a MAP'
	} else if (item.data === 327) {
		item.detail = 'REMOVE details',
			item.documentation = 'Remove an entry from a LIST or MAP'
	} else if (item.data === 328) {
		item.detail = 'REVERSE details',
			item.documentation = 'Reverse the order of a LIST'
	} else if (item.data === 329) {
		item.detail = 'GEOHASHTO details',
			item.documentation = 'Converts a GeoHash to a lat/lon.'
	} else if (item.data === 330) {
		item.detail = 'GEOPACK details',
			item.documentation = 'Encode a geo zone into a compact representation.'
	} else if (item.data === 331) {
		item.detail = 'GEOREGEXP details',
			item.documentation = 'Produces a regexp from a GeoXPShape'
	} else if (item.data === 332) {
		item.detail = 'GEOUNPACK details',
			item.documentation = 'Decodes a packed geo zone.'
	} else if (item.data === 333) {
		item.detail = 'GEO_DIFFERENCE details',
			item.documentation = 'Computes the difference of two GeoXP Shapes.'
	} else if (item.data === 334) {
		item.detail = 'GEO_INTERSECTION details',
			item.documentation = 'Computes the intersection of two GeoXP Shapes.'
	} else if (item.data === 335) {
		item.detail = 'GEO_INTERSECTS details',
			item.documentation = 'Checks if a Geo Time Series has at least one point within a shape.'
	} else if (item.data === 336) {
		item.detail = 'GEO_JSON details',
			item.documentation = 'Converts a GeoJSON string into a GeoXP Shape suitable for geo filtering'
	} else if (item.data === 337) {
		item.detail = 'GEO_UNION details',
			item.documentation = 'Computes the union of two GeoXP Shapes.'
	} else if (item.data === 338) {
		item.detail = 'GEO_WITHIN details',
			item.documentation = 'Checks if a Geo Time Series has all its points within a shape.'
	} else if (item.data === 339) {
		item.detail = 'GEO_WKT details',
			item.documentation = 'Converts a Well Known Text String into a GeoXP Shape suitable for geo filtering'
	} else if (item.data === 340) {
		item.detail = 'HAVERSINE details',
			item.documentation = 'Computes distance between two locations using the Haversine formula.'
	} else if (item.data === 341) {
		item.detail = 'HHCODETO details',
			item.documentation = 'Converts an HHCode to a lat/lon.'
	} else if (item.data === 342) {
		item.detail = 'TOGEOHASH details',
			item.documentation = 'Converts lat/lon to a GeoHash.'
	} else if (item.data === 343) {
		item.detail = 'TOHHCODE details',
			item.documentation = 'Converts lat/lon to an Helical Hyperspatial Code (HHCode).'
	} else if (item.data === 344) {
		item.detail = 'CHUNK details',
			item.documentation = 'Chunks a GTS into partial GTS.'
	} else if (item.data === 345) {
		item.detail = 'CLIP details',
			item.documentation = 'Clip a Geo Time Series according to a series of limits.'
	} else if (item.data === 346) {
		item.detail = 'SHRINK details',
			item.documentation = 'Shrink the number of values of a GTS'
	} else if (item.data === 347) {
		item.detail = 'TIMECLIP details',
			item.documentation = 'Clip a Geo Time Series to only retain ticks that are within a given time range'
	} else if (item.data === 348) {
		item.detail = 'TIMEMODULO details',
			item.documentation = 'Split a Geo Time Serie into a LIST of GTS whose timestamps are original timestamps modulo a value passed as parameter'
	} else if (item.data === 349) {
		item.detail = 'TIMESCALE details',
			item.documentation = 'Modify ticks by multiplying them by a scaling factor.'
	} else if (item.data === 350) {
		item.detail = 'TIMESHIFT details',
			item.documentation = 'Shift the ticks of a Geo Time Series'
	} else if (item.data === 351) {
		item.detail = 'TIMESPLIT details',
			item.documentation = 'Splits a Geo Time Series at the quiet periods'
	} else if (item.data === 352) {
		item.detail = 'CORRELATE details',
			item.documentation = 'Compute correlation between Geo Time Series'
	} else if (item.data === 353) {
		item.detail = 'CPROB details',
			item.documentation = 'Computes a conditional probability of each value in a Geo Time Series'
	} else if (item.data === 354) {
		item.detail = 'ISONORMALIZE details',
			item.documentation = 'Normalize (between -1 and 1) the values of a Geo Time Series'
	} else if (item.data === 355) {
		item.detail = 'LOWESS details',
			item.documentation = 'Smooths a Geo Time Series using local regression'
	} else if (item.data === 356) {
		item.detail = 'LTTB details',
			item.documentation = 'Downsamples a Geo Time Series using \'Least Triangle Three Bucket''
	} else if (item.data === 357) {
		item.detail = 'MODE details',
			item.documentation = 'Compute the mode(s) for a given GTS'
	} else if (item.data === 358) {
		item.detail = 'MONOTONIC details',
			item.documentation = 'Modifies the values of a Geo Time Series so it is monotonous.'
	} else if (item.data === 359) {
		item.detail = 'MUSIGMA details',
			item.documentation = 'Calculate the mean and the standard deviation of a Geo Time Series'
	} else if (item.data === 360) {
		item.detail = 'NORMALIZE details',
			item.documentation = 'Normalize between 0 and 1 the values a Geo Time Series'
	} else if (item.data === 361) {
		item.detail = 'NSUMSUMSQ details',
			item.documentation = 'Computes the cardinality, sum of values and sum of squared values of a Geo Time Series.'
	} else if (item.data === 362) {
		item.detail = 'PROB details',
			item.documentation = 'Computes the probability of each value in a Geo Time Series'
	} else if (item.data === 363) {
		item.detail = 'RLOWESS details',
			item.documentation = 'Robust and iterative smoothing of a Geo Time Series'
	} else if (item.data === 364) {
		item.detail = 'SINGLEEXPONENTIALSMOOTHING details',
			item.documentation = 'Smooth a Geo Time Series with the given smoothing factor alpha'
	} else if (item.data === 365) {
		item.detail = 'STANDARDIZE details',
			item.documentation = 'Replace Geo Time Series values with their standardized score'
	} else if (item.data === 366) {
		item.detail = 'TLTTB details',
			item.documentation = 'Downsamples a Geo Time Series using time based \'Least Triangle Three Bucket''
	} else if (item.data === 367) {
		item.detail = 'VALUEHISTOGRAM details',
			item.documentation = 'Builds a value histogram for a GTS.'
	} else if (item.data === 368) {
		item.detail = 'DWTSPLIT details',
			item.documentation = 'Split a Geo Time Series produced by FDWT into a set of series based on the resolution level.'
	} else if (item.data === 369) {
		item.detail = 'FDWT details',
			item.documentation = 'Computes a Forward Discrete Wavelet Transform on a GTS.'
	} else if (item.data === 370) {
		item.detail = 'FFT details',
			item.documentation = 'Computes a Fast Fourier Transform on a GTS.'
	} else if (item.data === 371) {
		item.detail = 'FFTAP details',
			item.documentation = 'Computes a Fast Fourier Transform on a GTS, returning amplitude and phase.'
	} else if (item.data === 372) {
		item.detail = 'IDWT details',
			item.documentation = 'Computes an Inverse Discrete Wavelet Transform on a GTS.'
	} else if (item.data === 373) {
		item.detail = 'IFFT details',
			item.documentation = 'Computes an Inverse Fast Fourier Transform.'
	} else if (item.data === 374) {
		item.detail = 'CLONE details',
			item.documentation = 'Make a deep copy of a GTS'
	} else if (item.data === 375) {
		item.detail = 'CLONEEMPTY details',
			item.documentation = 'Push onto the stack an empty clone of the argument GTS'
	} else if (item.data === 376) {
		item.detail = 'COMMONTICKS details',
			item.documentation = 'Modifies Geo Time Series so they all have the same ticks, the set of ticks common to all input Geo Time Series.'
	} else if (item.data === 377) {
		item.detail = 'COMPACT details',
			item.documentation = 'Remove measurements which have the same value, location and elevation as the previous one'
	} else if (item.data === 378) {
		item.detail = 'DEDUP details',
			item.documentation = 'Remove duplicate timestamps from a Geo Time Series'
	} else if (item.data === 379) {
		item.detail = 'FILLTICKS details',
			item.documentation = 'Add values to a GTS at given ticks'
	} else if (item.data === 380) {
		item.detail = 'INTEGRATE details',
			item.documentation = 'Integrate a Geo Time Serie'
	} else if (item.data === 381) {
		item.detail = 'LASTSORT details',
			item.documentation = 'Sorts a list of Geo Time Series according to their most recent value.'
	} else if (item.data === 382) {
		item.detail = 'MERGE details',
			item.documentation = 'Merge two Geo Time Series'
	} else if (item.data === 383) {
		item.detail = 'NONEMPTY details',
			item.documentation = 'Check whether or not a Geo Time Series has values'
	} else if (item.data === 384) {
		item.detail = 'PARTITION details',
			item.documentation = 'Splits GTS in equivalence classes based on label values.'
	} else if (item.data === 385) {
		item.detail = 'QUANTIZE details',
			item.documentation = 'Generates a quantified version of a Geo Time Series.'
	} else if (item.data === 386) {
		item.detail = 'RANGECOMPACT details',
			item.documentation = 'Remove intermediate values on constant ranges of a GTS'
	} else if (item.data === 387) {
		item.detail = 'RESETS details',
			item.documentation = 'Remove resets in Geo Time Series values'
	} else if (item.data === 388) {
		item.detail = 'RSORT details',
			item.documentation = 'Sort a Geo Time Series by descending timestamps'
	} else if (item.data === 389) {
		item.detail = 'RVALUESORT details',
			item.documentation = 'Sorts Geo Time Series by reverse order according to its values'
	} else if (item.data === 390) {
		item.detail = 'SORT details',
			item.documentation = 'Sort a Geo Time Series by ascending timestamps'
	} else if (item.data === 391) {
		item.detail = 'SORTBY details',
			item.documentation = 'Sort list of Geo Time Series according to values extracted by a macro'
	} else if (item.data === 392) {
		item.detail = 'UNWRAP details',
			item.documentation = 'Decode a Geo Time Series previously encoded by WRAP.'
	} else if (item.data === 393) {
		item.detail = 'VALUEDEDUP details',
			item.documentation = 'Remove duplicate values from a Geo Time Series'
	} else if (item.data === 394) {
		item.detail = 'VALUESORT details',
			item.documentation = 'Sorts Geo Time Series according to its values.'
	} else if (item.data === 395) {
		item.detail = 'VALUESPLIT details',
			item.documentation = 'Split a Geo Time Series into N distinct GTS, one for each distinct value'
	} else if (item.data === 396) {
		item.detail = 'WRAP details',
			item.documentation = 'Efficiently encode a Geo Time Series or a list thereof into strings.'
	} else if (item.data === 397) {
		item.detail = 'WRAPRAW details',
			item.documentation = 'Efficiently encode a Geo Time Series or a list thereof into byte arrays.'
	} else if (item.data === 398) {
		item.detail = 'MAKEGTS details',
			item.documentation = 'Builds a GTS from arrays.'
	} else if (item.data === 399) {
		item.detail = 'NEWGTS details',
			item.documentation = 'Push an empty Geo Time Series onto the stack'
	} else if (item.data === 400) {
		item.detail = 'PARSE details',
			item.documentation = 'Parse a STRING into a set of Geo Time Series'
	} else if (item.data === 401) {
		item.detail = 'DELETE details',
			item.documentation = 'Delete a set of GTS.'
	} else if (item.data === 402) {
		item.detail = 'FETCH details',
			item.documentation = 'Fetch data from Warp10\'s datastore'
	} else if (item.data === 403) {
		item.detail = 'FETCHBOOLEAN details',
			item.documentation = 'Fetches data from the store, forcing the returned Geo Time Series to be of type BOOLEAN.'
	} else if (item.data === 404) {
		item.detail = 'FETCHDOUBLE details',
			item.documentation = 'Fetches data from the store, forcing the returned Geo Time Series to be of type DOUBLE.'
	} else if (item.data === 405) {
		item.detail = 'FETCHLONG details',
			item.documentation = 'Fetches data from the store, forcing the returned Geo Time Series to be of type LONG.'
	} else if (item.data === 406) {
		item.detail = 'FETCHSTRING details',
			item.documentation = 'Fetches data from the store, forcing the returned Geo Time Series to be of type STRING.'
	} else if (item.data === 407) {
		item.detail = 'FIND details',
			item.documentation = 'Find Geo Time Series matching some criteria'
	} else if (item.data === 408) {
		item.detail = 'FINDSTATS details',
			item.documentation = 'Computes statistics on matching GTS.'
	} else if (item.data === 409) {
		item.detail = 'UPDATE details',
			item.documentation = 'Pushes datapoints to the Warp 10 backend.'
	} else if (item.data === 410) {
		item.detail = 'DISCORDS details',
			item.documentation = 'Detects discords in a Geo Time Series.'
	} else if (item.data === 411) {
		item.detail = 'DTW details',
			item.documentation = 'Computes similarity between two Geo Time Series using Dynamic Time Warping.'
	} else if (item.data === 412) {
		item.detail = 'OPTDTW details',
			item.documentation = 'Find the N optimal matches for a query sequence using Dynamic Time Warping.'
	} else if (item.data === 413) {
		item.detail = 'PATTERNDETECTION details',
			item.documentation = 'Detect patterns in a Geo Time Series.'
	} else if (item.data === 414) {
		item.detail = 'PATTERNS details',
			item.documentation = 'Extract patterns from a Geo Time Series.'
	} else if (item.data === 415) {
		item.detail = 'ZDISCORDS details',
			item.documentation = 'Detects discords in a standardized Geo Time Series.'
	} else if (item.data === 416) {
		item.detail = 'ZPATTERNDETECTION details',
			item.documentation = 'Detect patterns in a standardized Geo Time Series.'
	} else if (item.data === 417) {
		item.detail = 'ZPATTERNS details',
			item.documentation = 'Extract patterns from a standardized Geo Time Series.'
	} else if (item.data === 418) {
		item.detail = 'ZSCORE details',
			item.documentation = 'Normalize by the mean or median, using Z-score'
	} else if (item.data === 419) {
		item.detail = 'ESDTEST details',
			item.documentation = 'Detect outliers using an generalized extreme studentized deviate test'
	} else if (item.data === 420) {
		item.detail = 'GRUBBSTEST details',
			item.documentation = 'Detect outliers using a Grubbs\' test'
	} else if (item.data === 421) {
		item.detail = 'HYBRIDTEST details',
			item.documentation = 'Detect outliers using Seasonal Hybrid ESD test'
	} else if (item.data === 422) {
		item.detail = 'HYBRIDTEST2 details',
			item.documentation = 'Detect outliers using Seasonal Entropy Hybrid ESD test'
	} else if (item.data === 423) {
		item.detail = 'STLESDTEST details',
			item.documentation = 'Detect outliers using seasonal extract and an generalized extreme studentized deviate test'
	} else if (item.data === 424) {
		item.detail = 'THRESHOLDTEST details',
			item.documentation = 'Detect outliers using a threshold test'
	} else if (item.data === 425) {
		item.detail = 'ZSCORETEST details',
			item.documentation = 'Detect outliers using a Zscore test'
	} else if (item.data === 426) {
		item.detail = 'BBOX details',
			item.documentation = 'Computes the bounding box of a Geo Time Series'
	} else if (item.data === 427) {
		item.detail = 'COPYGEO details',
			item.documentation = 'Forces the location elements of a GTS onto others.'
	} else if (item.data === 428) {
		item.detail = 'ELEVATIONS details',
			item.documentation = 'Push Geo Time Series elevations onto the stack'
	} else if (item.data === 429) {
		item.detail = 'LOCATIONOFFSET details',
			item.documentation = 'Downsamples a Geo Time Series by retaining only those datapoints farther away than a threshold distance'
	} else if (item.data === 430) {
		item.detail = 'LOCATIONS details',
			item.documentation = 'Push Geo Time Series latitudes and longitudes onto the stack'
	} else if (item.data === 431) {
		item.detail = 'LOCSTRINGS details',
			item.documentation = 'Pushes encoded locations of Geo Time Series onto the stack'
	} else if (item.data === 432) {
		item.detail = 'ATTRIBUTES details',
			item.documentation = 'Retrieves the attributes of a GTS.'
	} else if (item.data === 433) {
		item.detail = 'LABELS details',
			item.documentation = 'Push the labels of a Geo Time Series onto the stack'
	} else if (item.data === 434) {
		item.detail = 'META details',
			item.documentation = 'Sets the attributes of a list of Geo Time Series in the Warp 10 backend.'
	} else if (item.data === 435) {
		item.detail = 'METASORT details',
			item.documentation = 'Sorts a list of Geo Time Series according to their metadata (class + labels).'
	} else if (item.data === 436) {
		item.detail = 'NAME details',
			item.documentation = 'Push the class name of a Geo Time Series onto the stack'
	} else if (item.data === 437) {
		item.detail = 'PARSESELECTOR details',
			item.documentation = 'Parse a Geo Time Series selector into a class selector and a labels selection MAP'
	} else if (item.data === 438) {
		item.detail = 'RELABEL details',
			item.documentation = 'Modify the labels of a Geo Time Series'
	} else if (item.data === 439) {
		item.detail = 'RENAME details',
			item.documentation = 'Rename a Geo Time Series'
	} else if (item.data === 440) {
		item.detail = 'SETATTRIBUTES details',
			item.documentation = 'Set attributes of a GTS.'
	} else if (item.data === 441) {
		item.detail = 'TOSELECTOR details',
			item.documentation = 'Transform a class selector and a labels selection MAPs into a Geo Time Series selector'
	} else if (item.data === 442) {
		item.detail = 'ADDVALUE details',
			item.documentation = 'Add a value to a GTS'
	} else if (item.data === 443) {
		item.detail = 'ATINDEX details',
			item.documentation = 'Extract the timestamp, longitude, lattitude, elevation and value for the N-th point of the GTS'
	} else if (item.data === 444) {
		item.detail = 'ATTICK details',
			item.documentation = 'Extract the timestamp, longitude, lattitude, elevation and value for a given timestamp of the GTS'
	} else if (item.data === 445) {
		item.detail = 'FIRSTTICK details',
			item.documentation = 'Push onto the stack the timestamp of the first tick of a Geo Time Series'
	} else if (item.data === 446) {
		item.detail = 'LASTTICK details',
			item.documentation = 'Push onto the stack the timestamp of the last tick of a Geo Time Series'
	} else if (item.data === 447) {
		item.detail = 'SETVALUE details',
			item.documentation = 'Adds a value to a GTS, overwriting the value at the given timestamp.'
	} else if (item.data === 448) {
		item.detail = 'TICKINDEX details',
			item.documentation = 'Reindex the ticks of Geo Time Series'
	} else if (item.data === 449) {
		item.detail = 'TICKLIST details',
			item.documentation = 'Push Geo Time Series ticks onto the stack'
	} else if (item.data === 450) {
		item.detail = 'TICKS details',
			item.documentation = 'Push Geo Time Series timestamps onto the stack'
	} else if (item.data === 451) {
		item.detail = 'VALUES details',
			item.documentation = 'Push Geo Time Series values onto the stack'
	} else if (item.data === 452) {
		item.detail = 'ATBUCKET details',
			item.documentation = 'Extracts the data from a bucket of a Geo Time Series'
	} else if (item.data === 453) {
		item.detail = 'BUCKETCOUNT details',
			item.documentation = 'Extract bucketcount from a bucketized Geo Time Series'
	} else if (item.data === 454) {
		item.detail = 'BUCKETSPAN details',
			item.documentation = 'Extract bucketspan from a bucketized Geo Time Series'
	} else if (item.data === 455) {
		item.detail = 'CROP details',
			item.documentation = 'Rebucketize a Geo Time Series'
	} else if (item.data === 456) {
		item.detail = 'FILLNEXT details',
			item.documentation = 'Fill missing values in a bucketized Geo Time Series with the next known value'
	} else if (item.data === 457) {
		item.detail = 'FILLPREVIOUS details',
			item.documentation = 'Fill missing values in a bucketized Geo Time Series with the last known value'
	} else if (item.data === 458) {
		item.detail = 'FILLVALUE details',
			item.documentation = 'Fill missing values in a bucketized Geo Time Series with a constant'
	} else if (item.data === 459) {
		item.detail = 'INTERPOLATE details',
			item.documentation = 'Fill gaps in bucketized Geo Time Series'
	} else if (item.data === 460) {
		item.detail = 'LASTBUCKET details',
			item.documentation = 'Push the end timestamp of the last bucket of a bucketized Geo Time Series'
	} else if (item.data === 461) {
		item.detail = 'STL details',
			item.documentation = 'Apply Seasonal Trend decomposition based on Loess procedure'
	} else if (item.data === 462) {
		item.detail = 'UNBUCKETIZE details',
			item.documentation = 'Force a Geo Time Series to be un-bucketized'
	} else if (item.data === 463) {
		item.detail = 'MACROFILTER details',
			item.documentation = 'Creates a filter from a macro.'
	} else if (item.data === 464) {
		item.detail = 'MAXLONG details',
			item.documentation = 'Push Long.MAX_VALUE onto the stack'
	} else if (item.data === 465) {
		item.detail = 'MINLONG details',
			item.documentation = 'Push Long.MIN_VALUE onto the stack'
	} else if (item.data === 466) {
		item.detail = 'NULL details',
			item.documentation = 'Push the symbolic value NULL onto the stack'
	} else if (item.data === 467) {
		item.detail = 'PI_UC details',
			item.documentation = 'Pushes PI onto the stack.'
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
