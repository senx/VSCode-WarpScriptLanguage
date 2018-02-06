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
console.log('[server] start "Warpscript"')

// After the server has started the client sends an initialize request. The server receives
// in the passed params the rootPath of the workspace plus the client capabilities.
connection.onInitialize((_params): InitializeResult => {
	connection.console.log('[server] Congratulations, your extension "Warpscript" is now active!')
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
/*documents.onDidChangeContent((change) => {
	validateTextDocument(change.document);
});
*/
// The settings interface describe the server relevant settings part
interface Settings {
	warpscript: ExampleSettings;
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
	maxNumberOfProblems = settings.warpscript.maxNumberOfProblems || 100;
	// Revalidate any open text documents
	documents.all().forEach(validateTextDocument);
});

function validateTextDocument(textDocument: TextDocument): void {
	let diagnostics: Diagnostic[] = [];
	let lines = textDocument.getText().split(/\r?\n/g);
	let problems = 0;
	for (var i = 0; i < lines.length && problems < maxNumberOfProblems; i++) {
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
	}
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
	connection.console.log(_textDocumentPosition.textDocument.uri)
	return [{label:'DOUBLEEXPONENTIALSMOOTHING',
	kind:CompletionItemKind.Text,
	data:1},
	{label:'EVERY',
	kind:CompletionItemKind.Text,
	data:2},
	{label:'EXPM1',
	kind:CompletionItemKind.Text,
	data:3},
	{label:'FINDSETS',
	kind:CompletionItemKind.Text,
	data:4},
	{label:'FUSE',
	kind:CompletionItemKind.Text,
	data:5},
	{label:'GROOVY',
	kind:CompletionItemKind.Text,
	data:6},
	{label:'HYPOT',
	kind:CompletionItemKind.Text,
	data:7},
	{label:'IMMUTABLE',
	kind:CompletionItemKind.Text,
	data:8},
	{label:'JS',
	kind:CompletionItemKind.Text,
	data:9},
	{label:'LOG1P',
	kind:CompletionItemKind.Text,
	data:10},
	{label:'LUA',
	kind:CompletionItemKind.Text,
	data:11},
	{label:'ONLYBUCKETS',
	kind:CompletionItemKind.Text,
	data:12},
	{label:'PAPPLY',
	kind:CompletionItemKind.Text,
	data:13},
	{label:'PFILTER',
	kind:CompletionItemKind.Text,
	data:14},
	{label:'PYTHON',
	kind:CompletionItemKind.Text,
	data:15},
	{label:'QCONJUGATE',
	kind:CompletionItemKind.Text,
	data:16},
	{label:'QDIVIDE',
	kind:CompletionItemKind.Text,
	data:17},
	{label:'QMULTIPLY',
	kind:CompletionItemKind.Text,
	data:18},
	{label:'QROTATE',
	kind:CompletionItemKind.Text,
	data:19},
	{label:'QROTATION',
	kind:CompletionItemKind.Text,
	data:20},
	{label:'R',
	kind:CompletionItemKind.Text,
	data:21},
	{label:'ROTATIONQ',
	kind:CompletionItemKind.Text,
	data:22},
	{label:'RTO',
	kind:CompletionItemKind.Text,
	data:23},
	{label:'RUBY',
	kind:CompletionItemKind.Text,
	data:24},
	{label:'STACKATTRIBUTE',
	kind:CompletionItemKind.Text,
	data:25},
	{label:'TOQ',
	kind:CompletionItemKind.Text,
	data:26},
	{label:'ULP',
	kind:CompletionItemKind.Text,
	data:27},
	{label:'SENSISIONEVENT',
	kind:CompletionItemKind.Text,
	data:28},
	{label:'SENSISIONGET',
	kind:CompletionItemKind.Text,
	data:29},
	{label:'SENSISIONSET',
	kind:CompletionItemKind.Text,
	data:30},
	{label:'SENSISIONUPDATE',
	kind:CompletionItemKind.Text,
	data:31},
	{label:'CEVAL',
	kind:CompletionItemKind.Text,
	data:32},
	{label:'SYNC',
	kind:CompletionItemKind.Text,
	data:33},
	{label:'JSONTO',
	kind:CompletionItemKind.Text,
	data:34},
	{label:'PICKLETO',
	kind:CompletionItemKind.Text,
	data:35},
	{label:'TOBIN',
	kind:CompletionItemKind.Text,
	data:36},
	{label:'TOBOOLEAN',
	kind:CompletionItemKind.Text,
	data:37},
	{label:'TODOUBLE',
	kind:CompletionItemKind.Text,
	data:38},
	{label:'TOLONG',
	kind:CompletionItemKind.Text,
	data:39},
	{label:'TOSTRING',
	kind:CompletionItemKind.Text,
	data:40},
	{label:'TOTIMESTAMP',
	kind:CompletionItemKind.Text,
	data:41},
	{label:'CALL',
	kind:CompletionItemKind.Text,
	data:42},
	{label:'CUDF',
	kind:CompletionItemKind.Text,
	data:43},
	{label:'UDF',
	kind:CompletionItemKind.Text,
	data:44},
	{label:'2BIN',
	kind:CompletionItemKind.Text,
	data:45},
	{label:'2HEX',
	kind:CompletionItemKind.Text,
	data:46},
	{label:'B64TO',
	kind:CompletionItemKind.Text,
	data:47},
	{label:'B64TOHEX',
	kind:CompletionItemKind.Text,
	data:48},
	{label:'B64URL',
	kind:CompletionItemKind.Text,
	data:49},
	{label:'BIN2',
	kind:CompletionItemKind.Text,
	data:50},
	{label:'BINTOHEX',
	kind:CompletionItemKind.Text,
	data:51},
	{label:'BYTESTO',
	kind:CompletionItemKind.Text,
	data:52},
	{label:'FROMBIN',
	kind:CompletionItemKind.Text,
	data:53},
	{label:'FROMHEX',
	kind:CompletionItemKind.Text,
	data:54},
	{label:'HASH',
	kind:CompletionItemKind.Text,
	data:55},
	{label:'HEXTO',
	kind:CompletionItemKind.Text,
	data:56},
	{label:'HEXTOB64',
	kind:CompletionItemKind.Text,
	data:57},
	{label:'HEXTOBIN',
	kind:CompletionItemKind.Text,
	data:58},
	{label:'JOIN',
	kind:CompletionItemKind.Text,
	data:59},
	{label:'MATCH',
	kind:CompletionItemKind.Text,
	data:60},
	{label:'MATCHER',
	kind:CompletionItemKind.Text,
	data:61},
	{label:'OPB64TO',
	kind:CompletionItemKind.Text,
	data:62},
	{label:'OPB64TOHEX',
	kind:CompletionItemKind.Text,
	data:63},
	{label:'REPLACE',
	kind:CompletionItemKind.Text,
	data:64},
	{label:'REPLACEALL',
	kind:CompletionItemKind.Text,
	data:65},
	{label:'SPLIT',
	kind:CompletionItemKind.Text,
	data:66},
	{label:'SUBSTRING',
	kind:CompletionItemKind.Text,
	data:67},
	{label:'TEMPLATE',
	kind:CompletionItemKind.Text,
	data:68},
	{label:'TOB64',
	kind:CompletionItemKind.Text,
	data:69},
	{label:'TOB64URL',
	kind:CompletionItemKind.Text,
	data:70},
	{label:'TOBYTES',
	kind:CompletionItemKind.Text,
	data:71},
	{label:'TOHEX',
	kind:CompletionItemKind.Text,
	data:72},
	{label:'TOLOWER',
	kind:CompletionItemKind.Text,
	data:73},
	{label:'TOOPB64',
	kind:CompletionItemKind.Text,
	data:74},
	{label:'TOUPPER',
	kind:CompletionItemKind.Text,
	data:75},
	{label:'TRIM',
	kind:CompletionItemKind.Text,
	data:76},
	{label:'URLDECODE',
	kind:CompletionItemKind.Text,
	data:77},
	{label:'URLENCODE',
	kind:CompletionItemKind.Text,
	data:78},
	{label:'UUID',
	kind:CompletionItemKind.Text,
	data:79},
	{label:'ADDDAYS',
	kind:CompletionItemKind.Text,
	data:80},
	{label:'ADDMONTHS',
	kind:CompletionItemKind.Text,
	data:81},
	{label:'ADDYEARS',
	kind:CompletionItemKind.Text,
	data:82},
	{label:'AGO',
	kind:CompletionItemKind.Text,
	data:83},
	{label:'DURATION',
	kind:CompletionItemKind.Text,
	data:84},
	{label:'HUMANDURATION',
	kind:CompletionItemKind.Text,
	data:85},
	{label:'ISO8601',
	kind:CompletionItemKind.Text,
	data:86},
	{label:'ISODURATION',
	kind:CompletionItemKind.Text,
	data:87},
	{label:'MSTU',
	kind:CompletionItemKind.Text,
	data:88},
	{label:'NOTAFTER',
	kind:CompletionItemKind.Text,
	data:89},
	{label:'NOTBEFORE',
	kind:CompletionItemKind.Text,
	data:90},
	{label:'NOW',
	kind:CompletionItemKind.Text,
	data:91},
	{label:'STU',
	kind:CompletionItemKind.Text,
	data:92},
	{label:'TOTSELEMENTS',
	kind:CompletionItemKind.Text,
	data:93},
	{label:'TSELEMENTS',
	kind:CompletionItemKind.Text,
	data:94},
	{label:'TSELEMENTSTO',
	kind:CompletionItemKind.Text,
	data:95},
	{label:'AESUNWRAP',
	kind:CompletionItemKind.Text,
	data:96},
	{label:'AESWRAP',
	kind:CompletionItemKind.Text,
	data:97},
	{label:'MD5',
	kind:CompletionItemKind.Text,
	data:98},
	{label:'RSADECRYPT',
	kind:CompletionItemKind.Text,
	data:99},
	{label:'RSAENCRYPT',
	kind:CompletionItemKind.Text,
	data:100},
	{label:'RSAGEN',
	kind:CompletionItemKind.Text,
	data:101},
	{label:'RSAPRIVATE',
	kind:CompletionItemKind.Text,
	data:102},
	{label:'RSAPUBLIC',
	kind:CompletionItemKind.Text,
	data:103},
	{label:'RSASIGN',
	kind:CompletionItemKind.Text,
	data:104},
	{label:'RSAVERIFY',
	kind:CompletionItemKind.Text,
	data:105},
	{label:'SHA1',
	kind:CompletionItemKind.Text,
	data:106},
	{label:'SHA1HMAC',
	kind:CompletionItemKind.Text,
	data:107},
	{label:'SHA256',
	kind:CompletionItemKind.Text,
	data:108},
	{label:'SHA256HMAC',
	kind:CompletionItemKind.Text,
	data:109},
	{label:'GZIP',
	kind:CompletionItemKind.Text,
	data:110},
	{label:'TOZ',
	kind:CompletionItemKind.Text,
	data:111},
	{label:'UNGZIP',
	kind:CompletionItemKind.Text,
	data:112},
	{label:'ZTO',
	kind:CompletionItemKind.Text,
	data:113},
	{label:'AUTHENTICATE',
	kind:CompletionItemKind.Text,
	data:114},
	{label:'BOOTSTRAP',
	kind:CompletionItemKind.Text,
	data:115},
	{label:'CLEAR',
	kind:CompletionItemKind.Text,
	data:116},
	{label:'CLEARDEFS',
	kind:CompletionItemKind.Text,
	data:117},
	{label:'CLEARSYMBOLS',
	kind:CompletionItemKind.Text,
	data:118},
	{label:'CLEARTOMARK',
	kind:CompletionItemKind.Text,
	data:119},
	{label:'CLOSE_BRACKET',
	kind:CompletionItemKind.Text,
	data:120},
	{label:'CLOSE_MARK',
	kind:CompletionItemKind.Text,
	data:121},
	{label:'COUNTTOMARK',
	kind:CompletionItemKind.Text,
	data:122},
	{label:'CSTORE',
	kind:CompletionItemKind.Text,
	data:123},
	{label:'DEBUGOFF',
	kind:CompletionItemKind.Text,
	data:124},
	{label:'DEBUGON',
	kind:CompletionItemKind.Text,
	data:125},
	{label:'DEF',
	kind:CompletionItemKind.Text,
	data:126},
	{label:'DEPTH',
	kind:CompletionItemKind.Text,
	data:127},
	{label:'DOC',
	kind:CompletionItemKind.Text,
	data:128},
	{label:'DOCMODE',
	kind:CompletionItemKind.Text,
	data:129},
	{label:'DROP',
	kind:CompletionItemKind.Text,
	data:130},
	{label:'DROPN',
	kind:CompletionItemKind.Text,
	data:131},
	{label:'DUP',
	kind:CompletionItemKind.Text,
	data:132},
	{label:'DUPN',
	kind:CompletionItemKind.Text,
	data:133},
	{label:'ELAPSED',
	kind:CompletionItemKind.Text,
	data:134},
	{label:'EXPORT',
	kind:CompletionItemKind.Text,
	data:135},
	{label:'FORGET',
	kind:CompletionItemKind.Text,
	data:136},
	{label:'LOAD',
	kind:CompletionItemKind.Text,
	data:137},
	{label:'MARK',
	kind:CompletionItemKind.Text,
	data:138},
	{label:'NDEBUGON',
	kind:CompletionItemKind.Text,
	data:139},
	{label:'NOTIMINGS',
	kind:CompletionItemKind.Text,
	data:140},
	{label:'OPEN_BRACKET',
	kind:CompletionItemKind.Text,
	data:141},
	{label:'OPEN_MARK',
	kind:CompletionItemKind.Text,
	data:142},
	{label:'PICK',
	kind:CompletionItemKind.Text,
	data:143},
	{label:'RESET',
	kind:CompletionItemKind.Text,
	data:144},
	{label:'REXEC',
	kind:CompletionItemKind.Text,
	data:145},
	{label:'ROLL',
	kind:CompletionItemKind.Text,
	data:146},
	{label:'ROLLD',
	kind:CompletionItemKind.Text,
	data:147},
	{label:'ROT',
	kind:CompletionItemKind.Text,
	data:148},
	{label:'RUN',
	kind:CompletionItemKind.Text,
	data:149},
	{label:'SNAPSHOT',
	kind:CompletionItemKind.Text,
	data:150},
	{label:'SNAPSHOTALL',
	kind:CompletionItemKind.Text,
	data:151},
	{label:'SNAPSHOTALLTOMARK',
	kind:CompletionItemKind.Text,
	data:152},
	{label:'SNAPSHOTTOMARK',
	kind:CompletionItemKind.Text,
	data:153},
	{label:'STACKATTRIBUTE',
	kind:CompletionItemKind.Text,
	data:154},
	{label:'STACKTOLIST',
	kind:CompletionItemKind.Text,
	data:155},
	{label:'STORE',
	kind:CompletionItemKind.Text,
	data:156},
	{label:'SWAP',
	kind:CompletionItemKind.Text,
	data:157},
	{label:'TIMINGS',
	kind:CompletionItemKind.Text,
	data:158},
	{label:'TYPEOF',
	kind:CompletionItemKind.Text,
	data:159},
	{label:'EVALSECURE',
	kind:CompletionItemKind.Text,
	data:160},
	{label:'HEADER',
	kind:CompletionItemKind.Text,
	data:161},
	{label:'IDENT',
	kind:CompletionItemKind.Text,
	data:162},
	{label:'JSONLOOSE',
	kind:CompletionItemKind.Text,
	data:163},
	{label:'JSONSTRICT',
	kind:CompletionItemKind.Text,
	data:164},
	{label:'LIMIT',
	kind:CompletionItemKind.Text,
	data:165},
	{label:'MAXBUCKETS',
	kind:CompletionItemKind.Text,
	data:166},
	{label:'MAXDEPTH',
	kind:CompletionItemKind.Text,
	data:167},
	{label:'MAXGTS',
	kind:CompletionItemKind.Text,
	data:168},
	{label:'MAXLOOP',
	kind:CompletionItemKind.Text,
	data:169},
	{label:'MAXOPS',
	kind:CompletionItemKind.Text,
	data:170},
	{label:'MAXSYMBOLS',
	kind:CompletionItemKind.Text,
	data:171},
	{label:'NOOP',
	kind:CompletionItemKind.Text,
	data:172},
	{label:'OPS',
	kind:CompletionItemKind.Text,
	data:173},
	{label:'RESTORE',
	kind:CompletionItemKind.Text,
	data:174},
	{label:'REV',
	kind:CompletionItemKind.Text,
	data:175},
	{label:'RTFM',
	kind:CompletionItemKind.Text,
	data:176},
	{label:'SAVE',
	kind:CompletionItemKind.Text,
	data:177},
	{label:'SECUREKEY',
	kind:CompletionItemKind.Text,
	data:178},
	{label:'TOKENINFO',
	kind:CompletionItemKind.Text,
	data:179},
	{label:'UNSECURE',
	kind:CompletionItemKind.Text,
	data:180},
	{label:'URLFETCH',
	kind:CompletionItemKind.Text,
	data:181},
	{label:'WEBCALL',
	kind:CompletionItemKind.Text,
	data:182},
	{label:'ABS',
	kind:CompletionItemKind.Text,
	data:183},
	{label:'ADD',
	kind:CompletionItemKind.Text,
	data:184},
	{label:'ALMOSTEQ',
	kind:CompletionItemKind.Text,
	data:185},
	{label:'AND',
	kind:CompletionItemKind.Text,
	data:186},
	{label:'BITWISE_AND',
	kind:CompletionItemKind.Text,
	data:187},
	{label:'BITWISE_COMPLEMENT',
	kind:CompletionItemKind.Text,
	data:188},
	{label:'BITWISE_OR',
	kind:CompletionItemKind.Text,
	data:189},
	{label:'BITWISE_XOR',
	kind:CompletionItemKind.Text,
	data:190},
	{label:'CBRT',
	kind:CompletionItemKind.Text,
	data:191},
	{label:'CEIL',
	kind:CompletionItemKind.Text,
	data:192},
	{label:'COND_AND',
	kind:CompletionItemKind.Text,
	data:193},
	{label:'COND_OR',
	kind:CompletionItemKind.Text,
	data:194},
	{label:'COPYSIGN',
	kind:CompletionItemKind.Text,
	data:195},
	{label:'DIV',
	kind:CompletionItemKind.Text,
	data:196},
	{label:'DOUBLEBITSTO',
	kind:CompletionItemKind.Text,
	data:197},
	{label:'EQ',
	kind:CompletionItemKind.Text,
	data:198},
	{label:'EXP',
	kind:CompletionItemKind.Text,
	data:199},
	{label:'FLOATBITSTO',
	kind:CompletionItemKind.Text,
	data:200},
	{label:'FLOOR',
	kind:CompletionItemKind.Text,
	data:201},
	{label:'GE',
	kind:CompletionItemKind.Text,
	data:202},
	{label:'GT',
	kind:CompletionItemKind.Text,
	data:203},
	{label:'IEEEREMAINDER',
	kind:CompletionItemKind.Text,
	data:204},
	{label:'INPLACEADD',
	kind:CompletionItemKind.Text,
	data:205},
	{label:'ISNULL',
	kind:CompletionItemKind.Text,
	data:206},
	{label:'LBOUNDS',
	kind:CompletionItemKind.Text,
	data:207},
	{label:'LE',
	kind:CompletionItemKind.Text,
	data:208},
	{label:'LEFT_SHIFT',
	kind:CompletionItemKind.Text,
	data:209},
	{label:'LOG',
	kind:CompletionItemKind.Text,
	data:210},
	{label:'LOG10',
	kind:CompletionItemKind.Text,
	data:211},
	{label:'LT',
	kind:CompletionItemKind.Text,
	data:212},
	{label:'MAX',
	kind:CompletionItemKind.Text,
	data:213},
	{label:'MIN',
	kind:CompletionItemKind.Text,
	data:214},
	{label:'MOD',
	kind:CompletionItemKind.Text,
	data:215},
	{label:'MUL',
	kind:CompletionItemKind.Text,
	data:216},
	{label:'NBOUNDS',
	kind:CompletionItemKind.Text,
	data:217},
	{label:'NE',
	kind:CompletionItemKind.Text,
	data:218},
	{label:'NEXTAFTER',
	kind:CompletionItemKind.Text,
	data:219},
	{label:'NEXTUP',
	kind:CompletionItemKind.Text,
	data:220},
	{label:'NOT',
	kind:CompletionItemKind.Text,
	data:221},
	{label:'NOT_TXT',
	kind:CompletionItemKind.Text,
	data:222},
	{label:'NPDF',
	kind:CompletionItemKind.Text,
	data:223},
	{label:'OR',
	kind:CompletionItemKind.Text,
	data:224},
	{label:'POW',
	kind:CompletionItemKind.Text,
	data:225},
	{label:'PROBABILITY',
	kind:CompletionItemKind.Text,
	data:226},
	{label:'RAND',
	kind:CompletionItemKind.Text,
	data:227},
	{label:'RANDPDF',
	kind:CompletionItemKind.Text,
	data:228},
	{label:'REVBITS',
	kind:CompletionItemKind.Text,
	data:229},
	{label:'RIGHT_SHIFT',
	kind:CompletionItemKind.Text,
	data:230},
	{label:'RINT',
	kind:CompletionItemKind.Text,
	data:231},
	{label:'ROUND',
	kind:CompletionItemKind.Text,
	data:232},
	{label:'SIGNUM',
	kind:CompletionItemKind.Text,
	data:233},
	{label:'SQRT',
	kind:CompletionItemKind.Text,
	data:234},
	{label:'SUB',
	kind:CompletionItemKind.Text,
	data:235},
	{label:'TODOUBLEBITS',
	kind:CompletionItemKind.Text,
	data:236},
	{label:'TOFLOATBITS',
	kind:CompletionItemKind.Text,
	data:237},
	{label:'UNSIGNED_RIGHT_SHIFT',
	kind:CompletionItemKind.Text,
	data:238},
	{label:'TOPICKLE',
	kind:CompletionItemKind.Text,
	data:239},
	{label:'ACOS',
	kind:CompletionItemKind.Text,
	data:240},
	{label:'ASIN',
	kind:CompletionItemKind.Text,
	data:241},
	{label:'ATAN',
	kind:CompletionItemKind.Text,
	data:242},
	{label:'COS',
	kind:CompletionItemKind.Text,
	data:243},
	{label:'COSH',
	kind:CompletionItemKind.Text,
	data:244},
	{label:'SIN',
	kind:CompletionItemKind.Text,
	data:245},
	{label:'SINH',
	kind:CompletionItemKind.Text,
	data:246},
	{label:'TAN',
	kind:CompletionItemKind.Text,
	data:247},
	{label:'TANH',
	kind:CompletionItemKind.Text,
	data:248},
	{label:'TODEGREES',
	kind:CompletionItemKind.Text,
	data:249},
	{label:'TORADIANS',
	kind:CompletionItemKind.Text,
	data:250},
	{label:'COUNTER',
	kind:CompletionItemKind.Text,
	data:251},
	{label:'COUNTERDELTA',
	kind:CompletionItemKind.Text,
	data:252},
	{label:'COUNTERVALUE',
	kind:CompletionItemKind.Text,
	data:253},
	{label:'RANGE',
	kind:CompletionItemKind.Text,
	data:254},
	{label:'QCONJUGATE',
	kind:CompletionItemKind.Text,
	data:255},
	{label:'QDIVIDE',
	kind:CompletionItemKind.Text,
	data:256},
	{label:'QMULTIPLY',
	kind:CompletionItemKind.Text,
	data:257},
	{label:'QROTATE',
	kind:CompletionItemKind.Text,
	data:258},
	{label:'QROTATION',
	kind:CompletionItemKind.Text,
	data:259},
	{label:'QTO',
	kind:CompletionItemKind.Text,
	data:260},
	{label:'ROTATIONQ',
	kind:CompletionItemKind.Text,
	data:261},
	{label:'TOQ',
	kind:CompletionItemKind.Text,
	data:262},
	{label:'BITCOUNT',
	kind:CompletionItemKind.Text,
	data:263},
	{label:'BITGET',
	kind:CompletionItemKind.Text,
	data:264},
	{label:'BITSTOBYTES',
	kind:CompletionItemKind.Text,
	data:265},
	{label:'BYTESTOBITS',
	kind:CompletionItemKind.Text,
	data:266},
	{label:'ASSERT',
	kind:CompletionItemKind.Text,
	data:267},
	{label:'BREAK',
	kind:CompletionItemKind.Text,
	data:268},
	{label:'CONTINUE',
	kind:CompletionItemKind.Text,
	data:269},
	{label:'DEFINED',
	kind:CompletionItemKind.Text,
	data:270},
	{label:'DEFINEDMACRO',
	kind:CompletionItemKind.Text,
	data:271},
	{label:'EVAL',
	kind:CompletionItemKind.Text,
	data:272},
	{label:'FAIL',
	kind:CompletionItemKind.Text,
	data:273},
	{label:'FOR',
	kind:CompletionItemKind.Text,
	data:274},
	{label:'FOREACH',
	kind:CompletionItemKind.Text,
	data:275},
	{label:'FORSTEP',
	kind:CompletionItemKind.Text,
	data:276},
	{label:'IFT',
	kind:CompletionItemKind.Text,
	data:277},
	{label:'IFTE',
	kind:CompletionItemKind.Text,
	data:278},
	{label:'MSGFAIL',
	kind:CompletionItemKind.Text,
	data:279},
	{label:'NRETURN',
	kind:CompletionItemKind.Text,
	data:280},
	{label:'RETURN',
	kind:CompletionItemKind.Text,
	data:281},
	{label:'STOP',
	kind:CompletionItemKind.Text,
	data:282},
	{label:'SWITCH',
	kind:CompletionItemKind.Text,
	data:283},
	{label:'UNTIL',
	kind:CompletionItemKind.Text,
	data:284},
	{label:'WHILE',
	kind:CompletionItemKind.Text,
	data:285},
	{label:'CLONEREVERSE',
	kind:CompletionItemKind.Text,
	data:286},
	{label:'CONTAINS',
	kind:CompletionItemKind.Text,
	data:287},
	{label:'CONTAINSKEY',
	kind:CompletionItemKind.Text,
	data:288},
	{label:'CONTAINSVALUE',
	kind:CompletionItemKind.Text,
	data:289},
	{label:'EMPTYLIST',
	kind:CompletionItemKind.Text,
	data:290},
	{label:'EMPTYMAP',
	kind:CompletionItemKind.Text,
	data:291},
	{label:'FLATTEN',
	kind:CompletionItemKind.Text,
	data:292},
	{label:'GET',
	kind:CompletionItemKind.Text,
	data:293},
	{label:'KEYLIST',
	kind:CompletionItemKind.Text,
	data:294},
	{label:'LFLATMAP',
	kind:CompletionItemKind.Text,
	data:295},
	{label:'LISTTO',
	kind:CompletionItemKind.Text,
	data:296},
	{label:'LMAP',
	kind:CompletionItemKind.Text,
	data:297},
	{label:'MAPID',
	kind:CompletionItemKind.Text,
	data:298},
	{label:'MAPTO',
	kind:CompletionItemKind.Text,
	data:299},
	{label:'MATTO',
	kind:CompletionItemKind.Text,
	data:300},
	{label:'MSORT',
	kind:CompletionItemKind.Text,
	data:301},
	{label:'PACK',
	kind:CompletionItemKind.Text,
	data:302},
	{label:'SIZE',
	kind:CompletionItemKind.Text,
	data:303},
	{label:'SUBLIST',
	kind:CompletionItemKind.Text,
	data:304},
	{label:'SUBMAP',
	kind:CompletionItemKind.Text,
	data:305},
	{label:'TOLIST',
	kind:CompletionItemKind.Text,
	data:306},
	{label:'TOMAP',
	kind:CompletionItemKind.Text,
	data:307},
	{label:'TOMAT',
	kind:CompletionItemKind.Text,
	data:308},
	{label:'TOV',
	kind:CompletionItemKind.Text,
	data:309},
	{label:'TOVEC',
	kind:CompletionItemKind.Text,
	data:310},
	{label:'UNIQUE',
	kind:CompletionItemKind.Text,
	data:311},
	{label:'UNLIST',
	kind:CompletionItemKind.Text,
	data:312},
	{label:'UNMAP',
	kind:CompletionItemKind.Text,
	data:313},
	{label:'UNPACK',
	kind:CompletionItemKind.Text,
	data:314},
	{label:'VALUELIST',
	kind:CompletionItemKind.Text,
	data:315},
	{label:'VECTO',
	kind:CompletionItemKind.Text,
	data:316},
	{label:'VTO',
	kind:CompletionItemKind.Text,
	data:317},
	{label:'ZIP',
	kind:CompletionItemKind.Text,
	data:318},
	{label:'DIFFERENCE',
	kind:CompletionItemKind.Text,
	data:319},
	{label:'INTERSECTION',
	kind:CompletionItemKind.Text,
	data:320},
	{label:'SET',
	kind:CompletionItemKind.Text,
	data:321},
	{label:'SETTO',
	kind:CompletionItemKind.Text,
	data:322},
	{label:'TOSET',
	kind:CompletionItemKind.Text,
	data:323},
	{label:'UNION',
	kind:CompletionItemKind.Text,
	data:324},
	{label:'APPEND',
	kind:CompletionItemKind.Text,
	data:325},
	{label:'LSORT',
	kind:CompletionItemKind.Text,
	data:326},
	{label:'PUT',
	kind:CompletionItemKind.Text,
	data:327},
	{label:'REMOVE',
	kind:CompletionItemKind.Text,
	data:328},
	{label:'REVERSE',
	kind:CompletionItemKind.Text,
	data:329},
	{label:'GEOHASHTO',
	kind:CompletionItemKind.Text,
	data:330},
	{label:'GEOPACK',
	kind:CompletionItemKind.Text,
	data:331},
	{label:'GEOREGEXP',
	kind:CompletionItemKind.Text,
	data:332},
	{label:'GEOUNPACK',
	kind:CompletionItemKind.Text,
	data:333},
	{label:'GEO_DIFFERENCE',
	kind:CompletionItemKind.Text,
	data:334},
	{label:'GEO_INTERSECTION',
	kind:CompletionItemKind.Text,
	data:335},
	{label:'GEO_INTERSECTS',
	kind:CompletionItemKind.Text,
	data:336},
	{label:'GEO_JSON',
	kind:CompletionItemKind.Text,
	data:337},
	{label:'GEO_UNION',
	kind:CompletionItemKind.Text,
	data:338},
	{label:'GEO_WITHIN',
	kind:CompletionItemKind.Text,
	data:339},
	{label:'GEO_WKT',
	kind:CompletionItemKind.Text,
	data:340},
	{label:'HAVERSINE',
	kind:CompletionItemKind.Text,
	data:341},
	{label:'HHCODETO',
	kind:CompletionItemKind.Text,
	data:342},
	{label:'TOGEOHASH',
	kind:CompletionItemKind.Text,
	data:343},
	{label:'TOHHCODE',
	kind:CompletionItemKind.Text,
	data:344},
	{label:'CHUNK',
	kind:CompletionItemKind.Text,
	data:345},
	{label:'CLIP',
	kind:CompletionItemKind.Text,
	data:346},
	{label:'SHRINK',
	kind:CompletionItemKind.Text,
	data:347},
	{label:'TIMECLIP',
	kind:CompletionItemKind.Text,
	data:348},
	{label:'TIMEMODULO',
	kind:CompletionItemKind.Text,
	data:349},
	{label:'TIMESCALE',
	kind:CompletionItemKind.Text,
	data:350},
	{label:'TIMESHIFT',
	kind:CompletionItemKind.Text,
	data:351},
	{label:'TIMESPLIT',
	kind:CompletionItemKind.Text,
	data:352},
	{label:'CORRELATE',
	kind:CompletionItemKind.Text,
	data:353},
	{label:'CPROB',
	kind:CompletionItemKind.Text,
	data:354},
	{label:'ISONORMALIZE',
	kind:CompletionItemKind.Text,
	data:355},
	{label:'LOWESS',
	kind:CompletionItemKind.Text,
	data:356},
	{label:'LTTB',
	kind:CompletionItemKind.Text,
	data:357},
	{label:'MODE',
	kind:CompletionItemKind.Text,
	data:358},
	{label:'MONOTONIC',
	kind:CompletionItemKind.Text,
	data:359},
	{label:'MUSIGMA',
	kind:CompletionItemKind.Text,
	data:360},
	{label:'NORMALIZE',
	kind:CompletionItemKind.Text,
	data:361},
	{label:'NSUMSUMSQ',
	kind:CompletionItemKind.Text,
	data:362},
	{label:'PROB',
	kind:CompletionItemKind.Text,
	data:363},
	{label:'RLOWESS',
	kind:CompletionItemKind.Text,
	data:364},
	{label:'SINGLEEXPONENTIALSMOOTHING',
	kind:CompletionItemKind.Text,
	data:365},
	{label:'STANDARDIZE',
	kind:CompletionItemKind.Text,
	data:366},
	{label:'TLTTB',
	kind:CompletionItemKind.Text,
	data:367},
	{label:'VALUEHISTOGRAM',
	kind:CompletionItemKind.Text,
	data:368},
	{label:'DWTSPLIT',
	kind:CompletionItemKind.Text,
	data:369},
	{label:'FDWT',
	kind:CompletionItemKind.Text,
	data:370},
	{label:'FFT',
	kind:CompletionItemKind.Text,
	data:371},
	{label:'FFTAP',
	kind:CompletionItemKind.Text,
	data:372},
	{label:'IDWT',
	kind:CompletionItemKind.Text,
	data:373},
	{label:'IFFT',
	kind:CompletionItemKind.Text,
	data:374},
	{label:'CLONE',
	kind:CompletionItemKind.Text,
	data:375},
	{label:'CLONEEMPTY',
	kind:CompletionItemKind.Text,
	data:376},
	{label:'COMMONTICKS',
	kind:CompletionItemKind.Text,
	data:377},
	{label:'COMPACT',
	kind:CompletionItemKind.Text,
	data:378},
	{label:'DEDUP',
	kind:CompletionItemKind.Text,
	data:379},
	{label:'FILLTICKS',
	kind:CompletionItemKind.Text,
	data:380},
	{label:'INTEGRATE',
	kind:CompletionItemKind.Text,
	data:381},
	{label:'LASTSORT',
	kind:CompletionItemKind.Text,
	data:382},
	{label:'MERGE',
	kind:CompletionItemKind.Text,
	data:383},
	{label:'NONEMPTY',
	kind:CompletionItemKind.Text,
	data:384},
	{label:'PARTITION',
	kind:CompletionItemKind.Text,
	data:385},
	{label:'QUANTIZE',
	kind:CompletionItemKind.Text,
	data:386},
	{label:'RANGECOMPACT',
	kind:CompletionItemKind.Text,
	data:387},
	{label:'RESETS',
	kind:CompletionItemKind.Text,
	data:388},
	{label:'RSORT',
	kind:CompletionItemKind.Text,
	data:389},
	{label:'RVALUESORT',
	kind:CompletionItemKind.Text,
	data:390},
	{label:'SORT',
	kind:CompletionItemKind.Text,
	data:391},
	{label:'SORTBY',
	kind:CompletionItemKind.Text,
	data:392},
	{label:'UNWRAP',
	kind:CompletionItemKind.Text,
	data:393},
	{label:'VALUEDEDUP',
	kind:CompletionItemKind.Text,
	data:394},
	{label:'VALUESORT',
	kind:CompletionItemKind.Text,
	data:395},
	{label:'VALUESPLIT',
	kind:CompletionItemKind.Text,
	data:396},
	{label:'WRAP',
	kind:CompletionItemKind.Text,
	data:397},
	{label:'WRAPRAW',
	kind:CompletionItemKind.Text,
	data:398},
	{label:'MAKEGTS',
	kind:CompletionItemKind.Text,
	data:399},
	{label:'NEWGTS',
	kind:CompletionItemKind.Text,
	data:400},
	{label:'PARSE',
	kind:CompletionItemKind.Text,
	data:401},
	{label:'DELETE',
	kind:CompletionItemKind.Text,
	data:402},
	{label:'FETCH',
	kind:CompletionItemKind.Text,
	data:403},
	{label:'FETCHBOOLEAN',
	kind:CompletionItemKind.Text,
	data:404},
	{label:'FETCHDOUBLE',
	kind:CompletionItemKind.Text,
	data:405},
	{label:'FETCHLONG',
	kind:CompletionItemKind.Text,
	data:406},
	{label:'FETCHSTRING',
	kind:CompletionItemKind.Text,
	data:407},
	{label:'FIND',
	kind:CompletionItemKind.Text,
	data:408},
	{label:'FINDSTATS',
	kind:CompletionItemKind.Text,
	data:409},
	{label:'UPDATE',
	kind:CompletionItemKind.Text,
	data:410},
	{label:'DISCORDS',
	kind:CompletionItemKind.Text,
	data:411},
	{label:'DTW',
	kind:CompletionItemKind.Text,
	data:412},
	{label:'OPTDTW',
	kind:CompletionItemKind.Text,
	data:413},
	{label:'PATTERNDETECTION',
	kind:CompletionItemKind.Text,
	data:414},
	{label:'PATTERNS',
	kind:CompletionItemKind.Text,
	data:415},
	{label:'ZDISCORDS',
	kind:CompletionItemKind.Text,
	data:416},
	{label:'ZPATTERNDETECTION',
	kind:CompletionItemKind.Text,
	data:417},
	{label:'ZPATTERNS',
	kind:CompletionItemKind.Text,
	data:418},
	{label:'ZSCORE',
	kind:CompletionItemKind.Text,
	data:419},
	{label:'ESDTEST',
	kind:CompletionItemKind.Text,
	data:420},
	{label:'GRUBBSTEST',
	kind:CompletionItemKind.Text,
	data:421},
	{label:'HYBRIDTEST',
	kind:CompletionItemKind.Text,
	data:422},
	{label:'HYBRIDTEST2',
	kind:CompletionItemKind.Text,
	data:423},
	{label:'STLESDTEST',
	kind:CompletionItemKind.Text,
	data:424},
	{label:'THRESHOLDTEST',
	kind:CompletionItemKind.Text,
	data:425},
	{label:'ZSCORETEST',
	kind:CompletionItemKind.Text,
	data:426},
	{label:'BBOX',
	kind:CompletionItemKind.Text,
	data:427},
	{label:'COPYGEO',
	kind:CompletionItemKind.Text,
	data:428},
	{label:'ELEVATIONS',
	kind:CompletionItemKind.Text,
	data:429},
	{label:'LOCATIONOFFSET',
	kind:CompletionItemKind.Text,
	data:430},
	{label:'LOCATIONS',
	kind:CompletionItemKind.Text,
	data:431},
	{label:'LOCSTRINGS',
	kind:CompletionItemKind.Text,
	data:432},
	{label:'ATTRIBUTES',
	kind:CompletionItemKind.Text,
	data:433},
	{label:'LABELS',
	kind:CompletionItemKind.Text,
	data:434},
	{label:'META',
	kind:CompletionItemKind.Text,
	data:435},
	{label:'METASORT',
	kind:CompletionItemKind.Text,
	data:436},
	{label:'NAME',
	kind:CompletionItemKind.Text,
	data:437},
	{label:'PARSESELECTOR',
	kind:CompletionItemKind.Text,
	data:438},
	{label:'RELABEL',
	kind:CompletionItemKind.Text,
	data:439},
	{label:'RENAME',
	kind:CompletionItemKind.Text,
	data:440},
	{label:'SETATTRIBUTES',
	kind:CompletionItemKind.Text,
	data:441},
	{label:'TOSELECTOR',
	kind:CompletionItemKind.Text,
	data:442},
	{label:'ADDVALUE',
	kind:CompletionItemKind.Text,
	data:443},
	{label:'ATINDEX',
	kind:CompletionItemKind.Text,
	data:444},
	{label:'ATTICK',
	kind:CompletionItemKind.Text,
	data:445},
	{label:'FIRSTTICK',
	kind:CompletionItemKind.Text,
	data:446},
	{label:'LASTTICK',
	kind:CompletionItemKind.Text,
	data:447},
	{label:'SETVALUE',
	kind:CompletionItemKind.Text,
	data:448},
	{label:'TICKINDEX',
	kind:CompletionItemKind.Text,
	data:449},
	{label:'TICKLIST',
	kind:CompletionItemKind.Text,
	data:450},
	{label:'TICKS',
	kind:CompletionItemKind.Text,
	data:451},
	{label:'VALUES',
	kind:CompletionItemKind.Text,
	data:452},
	{label:'ATBUCKET',
	kind:CompletionItemKind.Text,
	data:453},
	{label:'BUCKETCOUNT',
	kind:CompletionItemKind.Text,
	data:454},
	{label:'BUCKETSPAN',
	kind:CompletionItemKind.Text,
	data:455},
	{label:'CROP',
	kind:CompletionItemKind.Text,
	data:456},
	{label:'FILLNEXT',
	kind:CompletionItemKind.Text,
	data:457},
	{label:'FILLPREVIOUS',
	kind:CompletionItemKind.Text,
	data:458},
	{label:'FILLVALUE',
	kind:CompletionItemKind.Text,
	data:459},
	{label:'INTERPOLATE',
	kind:CompletionItemKind.Text,
	data:460},
	{label:'LASTBUCKET',
	kind:CompletionItemKind.Text,
	data:461},
	{label:'STL',
	kind:CompletionItemKind.Text,
	data:462},
	{label:'UNBUCKETIZE',
	kind:CompletionItemKind.Text,
	data:463},
	{label:'MACROFILTER',
	kind:CompletionItemKind.Text,
	data:464},
	{label:'MAXLONG',
	kind:CompletionItemKind.Text,
	data:465},
	{label:'MINLONG',
	kind:CompletionItemKind.Text,
	data:466},
	{label:'NULL',
	kind:CompletionItemKind.Text,
	data:467},
	{label:'PI_UC',
	kind:CompletionItemKind.Text,
	data:468}]
});

// This handler resolve additional information for the item selected in
// the completion list.
connection.onCompletionResolve((item: CompletionItem): CompletionItem => {
	if (item.data === 1) {
		item.detail = 'DOUBLEEXPONENTIALSMOOTHING',
			item.documentation = 'Apply double exponential smoothing on a gts.'
	} else if (item.data === 2) {
		item.detail = 'EVERY',
			item.documentation = 'Executes the macro at the given interval (Mobius endpoint).'
	} else if (item.data === 3) {
		item.detail = 'EXPM1',
			item.documentation = 'Computes exp^x - 1.'
	} else if (item.data === 4) {
		item.detail = 'FINDSETS',
			item.documentation = 'Extracts classes and label values of matching GTS.'
	} else if (item.data === 5) {
		item.detail = 'FUSE',
			item.documentation = 'Merge chunks of GTS together.'
	} else if (item.data === 6) {
		item.detail = 'GROOVY',
			item.documentation = 'Executes a script expressed in Groovy.'
	} else if (item.data === 7) {
		item.detail = 'HYPOT',
			item.documentation = 'Returns sqrt(x²+y²) without intermediate overflow or underflow.'
	} else if (item.data === 8) {
		item.detail = 'IMMUTABLE',
			item.documentation = 'Replaces a map/list/set with an unmodifiable version.'
	} else if (item.data === 9) {
		item.detail = 'JS',
			item.documentation = 'Executes a script expressed in JavaScript.'
	} else if (item.data === 10) {
		item.detail = 'LOG1P',
			item.documentation = 'Computes the natural logarithm of the top of the stack plus one.'
	} else if (item.data === 11) {
		item.detail = 'LUA',
			item.documentation = 'Executes a script expressed in Lua.'
	} else if (item.data === 12) {
		item.detail = 'ONLYBUCKETS',
			item.documentation = 'Removes ticks which do not fall on bucket boundaries.'
	} else if (item.data === 13) {
		item.detail = 'PAPPLY',
			item.documentation = 'Behaves like APPLY except returned GTS are grouped by equivalence classes.'
	} else if (item.data === 14) {
		item.detail = 'PFILTER',
			item.documentation = 'Behaves like FILTER except returned GTS are grouped by equivalence classes.'
	} else if (item.data === 15) {
		item.detail = 'PYTHON',
			item.documentation = 'Executes a script expressed in Python.'
	} else if (item.data === 16) {
		item.detail = 'QCONJUGATE',
			item.documentation = 'Compute the conjugate of a quaternion.'
	} else if (item.data === 17) {
		item.detail = 'QDIVIDE',
			item.documentation = 'Divide a quaternion q by a quaternion r.'
	} else if (item.data === 18) {
		item.detail = 'QMULTIPLY',
			item.documentation = 'Multiply two quaternions.'
	} else if (item.data === 19) {
		item.detail = 'QROTATE',
			item.documentation = 'Rotate a vector by a quaternion.'
	} else if (item.data === 20) {
		item.detail = 'QROTATION',
			item.documentation = 'Extract the axis and angle of rotation of a quaternion.'
	} else if (item.data === 21) {
		item.detail = 'R',
			item.documentation = 'Execute a script in R syntax.'
	} else if (item.data === 22) {
		item.detail = 'ROTATIONQ',
			item.documentation = 'Creates a quaternion from a rotation axis and angle.'
	} else if (item.data === 23) {
		item.detail = 'RTO',
			item.documentation = 'Convert R types back to WarpScript types.'
	} else if (item.data === 24) {
		item.detail = 'RUBY',
			item.documentation = 'Executes a script expressed in Ruby.'
	} else if (item.data === 25) {
		item.detail = 'STACKATTRIBUTE',
			item.documentation = 'Pushes onto the stack the value of the named attribute.'
	} else if (item.data === 26) {
		item.detail = 'TOQ',
			item.documentation = 'Converts coordinates to a quaternion.'
	} else if (item.data === 27) {
		item.detail = 'ULP',
			item.documentation = 'Returns the size of an Units in the Last Place of the top of the stack.'
	} else if (item.data === 28) {
		item.detail = 'SENSISIONEVENT',
			item.documentation = 'Emits a Sensision event.'
	} else if (item.data === 29) {
		item.detail = 'SENSISIONGET',
			item.documentation = 'Set a value for a Sensision metric.'
	} else if (item.data === 30) {
		item.detail = 'SENSISIONSET',
			item.documentation = 'Set a value for a Sensision metric.'
	} else if (item.data === 31) {
		item.detail = 'SENSISIONUPDATE',
			item.documentation = 'Update a value for a numerical Sensision metric.'
	} else if (item.data === 32) {
		item.detail = 'CEVAL',
			item.documentation = 'Execute macros concurrently.'
	} else if (item.data === 33) {
		item.detail = 'SYNC',
			item.documentation = 'Execute a macro in a synchronized manner inside of a CEVAL call.'
	} else if (item.data === 34) {
		item.detail = 'JSONTO',
			item.documentation = 'Parses a string as JSON and pushes the result onto the stack.'
	} else if (item.data === 35) {
		item.detail = 'PICKLETO',
			item.documentation = 'Decodes Pickle content.'
	} else if (item.data === 36) {
		item.detail = 'TOBIN',
			item.documentation = 'Converts a long to its binary representation.'
	} else if (item.data === 37) {
		item.detail = 'TOBOOLEAN',
			item.documentation = 'Converts number or string to boolean'
	} else if (item.data === 38) {
		item.detail = 'TODOUBLE',
			item.documentation = 'Convert a number to double'
	} else if (item.data === 39) {
		item.detail = 'TOLONG',
			item.documentation = 'Convert a number to long'
	} else if (item.data === 40) {
		item.detail = 'TOSTRING',
			item.documentation = 'Convert the argument to string'
	} else if (item.data === 41) {
		item.detail = 'TOTIMESTAMP',
			item.documentation = 'Converts an ISO8601 date/time string into a number of time units.'
	} else if (item.data === 42) {
		item.detail = 'CALL',
			item.documentation = 'Invoke an external program.'
	} else if (item.data === 43) {
		item.detail = 'CUDF',
			item.documentation = 'Invoke a possibly cached version of a UDF.'
	} else if (item.data === 44) {
		item.detail = 'UDF',
			item.documentation = 'Invoke a UDF.'
	} else if (item.data === 45) {
		item.detail = '2BIN',
			item.documentation = 'Converts a string to its binary representation.'
	} else if (item.data === 46) {
		item.detail = '2HEX',
			item.documentation = 'Converts a string to the hexadecimal representation of its UTF-8 encoding.'
	} else if (item.data === 47) {
		item.detail = 'B64TO',
			item.documentation = 'Decodes a base64 encoded string.'
	} else if (item.data === 48) {
		item.detail = 'B64TOHEX',
			item.documentation = 'Decodes a base64 encoded string and immediately re-encode it in hex.'
	} else if (item.data === 49) {
		item.detail = 'B64URL',
			item.documentation = 'Decodes a base64url encoded string.'
	} else if (item.data === 50) {
		item.detail = 'BIN2',
			item.documentation = 'Decode a String in binary.'
	} else if (item.data === 51) {
		item.detail = 'BINTOHEX',
			item.documentation = 'Decodes a binary encoded string and immediately re-encode it in hex.'
	} else if (item.data === 52) {
		item.detail = 'BYTESTO',
			item.documentation = 'Converts a bytes array into a string'
	} else if (item.data === 53) {
		item.detail = 'FROMBIN',
			item.documentation = 'Converts a binary representation of a long into a long.'
	} else if (item.data === 54) {
		item.detail = 'FROMHEX',
			item.documentation = 'Converts an hexadecimal representation into a long.'
	} else if (item.data === 55) {
		item.detail = 'HASH',
			item.documentation = 'Computes a 64 bits hash of the string on top of the stack.'
	} else if (item.data === 56) {
		item.detail = 'HEXTO',
			item.documentation = 'Decodes an hex encoded string.'
	} else if (item.data === 57) {
		item.detail = 'HEXTOB64',
			item.documentation = 'Decodes a hex encoded string and immediately re-encode it in base64.'
	} else if (item.data === 58) {
		item.detail = 'HEXTOBIN',
			item.documentation = 'Decodes a hex encoded string and immediately re-encode it in binary.'
	} else if (item.data === 59) {
		item.detail = 'JOIN',
			item.documentation = 'Join N strings with the given separator'
	} else if (item.data === 60) {
		item.detail = 'MATCH',
			item.documentation = 'Apply a regular expression to a string'
	} else if (item.data === 61) {
		item.detail = 'MATCHER',
			item.documentation = 'Builds a compiled object form a regular expression.'
	} else if (item.data === 62) {
		item.detail = 'OPB64TO',
			item.documentation = 'Decodes an order preserving base64 encoded string.'
	} else if (item.data === 63) {
		item.detail = 'OPB64TOHEX',
			item.documentation = 'Decodes an order preserving base64 encoded string and immediately re-encode it in hex.'
	} else if (item.data === 64) {
		item.detail = 'REPLACE',
			item.documentation = 'Replaces the first substring of the input string that matches the given regular expression with the given replacement.'
	} else if (item.data === 65) {
		item.detail = 'REPLACEALL',
			item.documentation = 'Replaces all substrings of the input string that matches the given regular expression with the given replacement.'
	} else if (item.data === 66) {
		item.detail = 'SPLIT',
			item.documentation = 'Split a string in segments'
	} else if (item.data === 67) {
		item.detail = 'SUBSTRING',
			item.documentation = 'Extracts a substring from a string.'
	} else if (item.data === 68) {
		item.detail = 'TEMPLATE',
			item.documentation = 'Fills a template with values contained in a map.'
	} else if (item.data === 69) {
		item.detail = 'TOB64',
			item.documentation = 'Encodes a string in base64.'
	} else if (item.data === 70) {
		item.detail = 'TOB64URL',
			item.documentation = 'Encodes a string in base64url.'
	} else if (item.data === 71) {
		item.detail = 'TOBYTES',
			item.documentation = 'Converts a string into its bytes given a charset'
	} else if (item.data === 72) {
		item.detail = 'TOHEX',
			item.documentation = 'Converts a long to its 64 bits hexadecimal representaiton.'
	} else if (item.data === 73) {
		item.detail = 'TOLOWER',
			item.documentation = 'Converts the string on top of the stack to lower case.'
	} else if (item.data === 74) {
		item.detail = 'TOOPB64',
			item.documentation = 'Encodes a string in order preserving base64.'
	} else if (item.data === 75) {
		item.detail = 'TOUPPER',
			item.documentation = 'Converts the string on top of the stack to upper case.'
	} else if (item.data === 76) {
		item.detail = 'TRIM',
			item.documentation = 'Trims whitespaces from both ends of the string on top of the stack.'
	} else if (item.data === 77) {
		item.detail = 'URLDECODE',
			item.documentation = 'Decode an URL encoded string'
	} else if (item.data === 78) {
		item.detail = 'URLENCODE',
			item.documentation = 'URL Encode a string'
	} else if (item.data === 79) {
		item.detail = 'UUID',
			item.documentation = 'Generates a UUID and pushes it on top of the stack.'
	} else if (item.data === 80) {
		item.detail = 'ADDDAYS',
			item.documentation = 'Adds a certain number of days to a timestamp.'
	} else if (item.data === 81) {
		item.detail = 'ADDMONTHS',
			item.documentation = 'Adds a certain number of months to a timestamp.'
	} else if (item.data === 82) {
		item.detail = 'ADDYEARS',
			item.documentation = 'Adds a certain number of years to a timestamp.'
	} else if (item.data === 83) {
		item.detail = 'AGO',
			item.documentation = 'Computes a timestamp from an offset in time units.'
	} else if (item.data === 84) {
		item.detail = 'DURATION',
			item.documentation = 'Transform an ISO8601 duration into microsecondes'
	} else if (item.data === 85) {
		item.detail = 'HUMANDURATION',
			item.documentation = 'Convert a number of time units into a human readable duration.'
	} else if (item.data === 86) {
		item.detail = 'ISO8601',
			item.documentation = 'Transform a timestamp into a date in ISO 8601 format'
	} else if (item.data === 87) {
		item.detail = 'ISODURATION',
			item.documentation = 'Convert a number of time units into an ISO8601 duration string.'
	} else if (item.data === 88) {
		item.detail = 'MSTU',
			item.documentation = 'Push onto the stack a the number of time units in a millisecond'
	} else if (item.data === 89) {
		item.detail = 'NOTAFTER',
			item.documentation = 'Checks that the current time is not after the provided timestamp. Fails otherwise.'
	} else if (item.data === 90) {
		item.detail = 'NOTBEFORE',
			item.documentation = 'Checks that the current time is not before the provided timestamp. Fails otherwise.'
	} else if (item.data === 91) {
		item.detail = 'NOW',
			item.documentation = 'Push on the stack the current time in microseconds since the Unix Epoch'
	} else if (item.data === 92) {
		item.detail = 'STU',
			item.documentation = 'Push onto the stack a the number of time units in a second'
	} else if (item.data === 93) {
		item.detail = 'TOTSELEMENTS',
			item.documentation = 'Replaces the timestamp with an array of its elements'
	} else if (item.data === 94) {
		item.detail = 'TSELEMENTS',
			item.documentation = 'Replaces the timestamp with an array of its elements'
	} else if (item.data === 95) {
		item.detail = 'TSELEMENTSTO',
			item.documentation = 'Converts various timestamp\'s elements into a timestamp for a given timezone'
	} else if (item.data === 96) {
		item.detail = 'AESUNWRAP',
			item.documentation = 'Unwrap wrapped byte array '
	} else if (item.data === 97) {
		item.detail = 'AESWRAP',
			item.documentation = 'Wrap a byte array or String with AES cypher'
	} else if (item.data === 98) {
		item.detail = 'MD5',
			item.documentation = 'Message Digest of a byte array with the cryptographic hash function MD5.'
	} else if (item.data === 99) {
		item.detail = 'RSADECRYPT',
			item.documentation = 'Decrypt encoded data using RSA'
	} else if (item.data === 100) {
		item.detail = 'RSAENCRYPT',
			item.documentation = 'Encrypt data using RSA keys'
	} else if (item.data === 101) {
		item.detail = 'RSAGEN',
			item.documentation = 'Generates a RSA key pair.'
	} else if (item.data === 102) {
		item.detail = 'RSAPRIVATE',
			item.documentation = 'Produce a RSA private key from a parameter map.'
	} else if (item.data === 103) {
		item.detail = 'RSAPUBLIC',
			item.documentation = 'Produce a RSA public key from a parameter map.'
	} else if (item.data === 104) {
		item.detail = 'RSASIGN',
			item.documentation = 'Sign data using RSA and a hash algorithm.'
	} else if (item.data === 105) {
		item.detail = 'RSAVERIFY',
			item.documentation = 'Sign data using RSA and a hash algorithm.'
	} else if (item.data === 106) {
		item.detail = 'SHA1',
			item.documentation = 'Message Digest of a byte array with the cryptographic hash function SHA1.'
	} else if (item.data === 107) {
		item.detail = 'SHA1HMAC',
			item.documentation = 'Computes a Hash-based Message Authentication Code (HMAC) that uses a key in conjunction with a SHA-1 cryptographic hash function.'
	} else if (item.data === 108) {
		item.detail = 'SHA256',
			item.documentation = 'Message Digest of a byte array with the cryptographic hash function SHA256.'
	} else if (item.data === 109) {
		item.detail = 'SHA256HMAC',
			item.documentation = 'Computes a Hash-based Message Authentication Code (HMAC) that uses a key in conjunction with a SHA-256 cryptographic hash function.'
	} else if (item.data === 110) {
		item.detail = 'GZIP',
			item.documentation = 'Compresses a byte array or String'
	} else if (item.data === 111) {
		item.detail = 'TOZ',
			item.documentation = 'Builds a z-value.'
	} else if (item.data === 112) {
		item.detail = 'UNGZIP',
			item.documentation = 'Decompresses a compressed byte array.'
	} else if (item.data === 113) {
		item.detail = 'ZTO',
			item.documentation = 'Decomposes a Z-Value.'
	} else if (item.data === 114) {
		item.detail = 'AUTHENTICATE',
			item.documentation = 'Authenticates the current stack.'
	} else if (item.data === 115) {
		item.detail = 'BOOTSTRAP',
			item.documentation = 'Function executed before the WarpScript stack becomes available.'
	} else if (item.data === 116) {
		item.detail = 'CLEAR',
			item.documentation = 'Remove all elements from the stack'
	} else if (item.data === 117) {
		item.detail = 'CLEARDEFS',
			item.documentation = 'Clear redefined WarpScript functions.'
	} else if (item.data === 118) {
		item.detail = 'CLEARSYMBOLS',
			item.documentation = 'Clear all symbols name of the stack.'
	} else if (item.data === 119) {
		item.detail = 'CLEARTOMARK',
			item.documentation = 'Removes elements from the stack up to and including the first mark encountered.'
	} else if (item.data === 120) {
		item.detail = 'CLOSE_BRACKET',
			item.documentation = 'Closes an open list.'
	} else if (item.data === 121) {
		item.detail = 'CLOSE_MARK',
			item.documentation = 'Closes an open list.'
	} else if (item.data === 122) {
		item.detail = 'COUNTTOMARK',
			item.documentation = 'Counts the number of elements on the stack up to but excluding the first mark encountered.'
	} else if (item.data === 123) {
		item.detail = 'CSTORE',
			item.documentation = 'Conditionnaly store the element below the top of the stack under the symbol name on top of the stack'
	} else if (item.data === 124) {
		item.detail = 'DEBUGOFF',
			item.documentation = 'Turns off stack debugging.'
	} else if (item.data === 125) {
		item.detail = 'DEBUGON',
			item.documentation = 'Turns on stack debugging.'
	} else if (item.data === 126) {
		item.detail = 'DEF',
			item.documentation = 'Define or redefine a WarpScript function.'
	} else if (item.data === 127) {
		item.detail = 'DEPTH',
			item.documentation = 'Push on the stack the depth of the stack'
	} else if (item.data === 128) {
		item.detail = 'DOC',
			item.documentation = 'Defines the documentation string for a macro.'
	} else if (item.data === 129) {
		item.detail = 'DOCMODE',
			item.documentation = 'Turns on documentation mode.'
	} else if (item.data === 130) {
		item.detail = 'DROP',
			item.documentation = 'Remove the top element from the stack'
	} else if (item.data === 131) {
		item.detail = 'DROPN',
			item.documentation = 'Remove the N top elements from the stack'
	} else if (item.data === 132) {
		item.detail = 'DUP',
			item.documentation = 'Duplicates the top of the stack'
	} else if (item.data === 133) {
		item.detail = 'DUPN',
			item.documentation = 'Duplicates the N top of the stack'
	} else if (item.data === 134) {
		item.detail = 'ELAPSED',
			item.documentation = 'Pushes on the stack the collected timing informations.'
	} else if (item.data === 135) {
		item.detail = 'EXPORT',
			item.documentation = 'Sets or updates the list of exported symbols'
	} else if (item.data === 136) {
		item.detail = 'FORGET',
			item.documentation = ''
	} else if (item.data === 137) {
		item.detail = 'LOAD',
			item.documentation = 'Pushes onto the stack the value of the symbol whose name is on the stack.'
	} else if (item.data === 138) {
		item.detail = 'MARK',
			item.documentation = 'Pushes a mark onto the stack.'
	} else if (item.data === 139) {
		item.detail = 'NDEBUGON',
			item.documentation = 'Turns on stack debugging, specifying the number of stack levels to return in case of error.'
	} else if (item.data === 140) {
		item.detail = 'NOTIMINGS',
			item.documentation = 'Turns off timing collection.'
	} else if (item.data === 141) {
		item.detail = 'OPEN_BRACKET',
			item.documentation = 'Starts a list by pushing a mark onto the stack.'
	} else if (item.data === 142) {
		item.detail = 'OPEN_MARK',
			item.documentation = 'Starts a map by pushing a mark onto the stack.'
	} else if (item.data === 143) {
		item.detail = 'PICK',
			item.documentation = 'Copies onto the top of the stack the n-th element of the stack'
	} else if (item.data === 144) {
		item.detail = 'RESET',
			item.documentation = 'Reset the stack to a specific depth.'
	} else if (item.data === 145) {
		item.detail = 'REXEC',
			item.documentation = 'Executes some WarpScript on a remote Warp 10.'
	} else if (item.data === 146) {
		item.detail = 'ROLL',
			item.documentation = 'Moves the N-th element of the stack onto the top'
	} else if (item.data === 147) {
		item.detail = 'ROLLD',
			item.documentation = 'Moves the element on top of the stack to the N-th position'
	} else if (item.data === 148) {
		item.detail = 'ROT',
			item.documentation = 'Move the third element of the stack onto the top'
	} else if (item.data === 149) {
		item.detail = 'RUN',
			item.documentation = 'Executes the macro whose name is on the stack.'
	} else if (item.data === 150) {
		item.detail = 'SNAPSHOT',
			item.documentation = 'Converts the content of the stack into WarpScript code.'
	} else if (item.data === 151) {
		item.detail = 'SNAPSHOTALL',
			item.documentation = 'Converts the content of the stack and current symbols into WarpScript code.'
	} else if (item.data === 152) {
		item.detail = 'SNAPSHOTALLTOMARK',
			item.documentation = 'Converts the content of the stack above a MARK and current symbols into WarpScript code.'
	} else if (item.data === 153) {
		item.detail = 'SNAPSHOTTOMARK',
			item.documentation = 'Converts part of the stack into WarpScript code.'
	} else if (item.data === 154) {
		item.detail = 'STACKATTRIBUTE',
			item.documentation = 'Extract the stack attributes and push them on top of the stack'
	} else if (item.data === 155) {
		item.detail = 'STACKTOLIST',
			item.documentation = 'Convert the whole stack into a list and push this list on the top of the stack.'
	} else if (item.data === 156) {
		item.detail = 'STORE',
			item.documentation = 'Store the element below the top of the stack under the symbol name on top of the stack'
	} else if (item.data === 157) {
		item.detail = 'SWAP',
			item.documentation = 'Swap the two two elements of the stack'
	} else if (item.data === 158) {
		item.detail = 'TIMINGS',
			item.documentation = 'Turns on timing collection.'
	} else if (item.data === 159) {
		item.detail = 'TYPEOF',
			item.documentation = 'Pushes onto the stack the type of the element on top of the stack.'
	} else if (item.data === 160) {
		item.detail = 'EVALSECURE',
			item.documentation = 'Evaluates the secured script on top of the stack'
	} else if (item.data === 161) {
		item.detail = 'HEADER',
			item.documentation = 'Set a header which will be returned with the HTTP response.'
	} else if (item.data === 162) {
		item.detail = 'IDENT',
			item.documentation = 'Pushes on the stack the ident string of the running platform.'
	} else if (item.data === 163) {
		item.detail = 'JSONLOOSE',
			item.documentation = 'Generate a loose JSON version (with NaN and Infinite values allowed) of the stack'
	} else if (item.data === 164) {
		item.detail = 'JSONSTRICT',
			item.documentation = 'Generate a JSON version of the stack'
	} else if (item.data === 165) {
		item.detail = 'LIMIT',
			item.documentation = 'Modifies the maximum number of datapoints which can be fetched during a script execution.'
	} else if (item.data === 166) {
		item.detail = 'MAXBUCKETS',
			item.documentation = 'Modifies the maximum number of buckets which can be created by a call to BUCKETIZE.'
	} else if (item.data === 167) {
		item.detail = 'MAXDEPTH',
			item.documentation = 'Modifies the maximum depth of the stack.'
	} else if (item.data === 168) {
		item.detail = 'MAXGTS',
			item.documentation = 'Modifies the maximum number of Geo Time Series which can be retrieved.'
	} else if (item.data === 169) {
		item.detail = 'MAXLOOP',
			item.documentation = 'Modifies the upper limit of time which can be spent in a loop.'
	} else if (item.data === 170) {
		item.detail = 'MAXOPS',
			item.documentation = 'Modifies the maximum number of WarpScript operations which can be performed during a single execution.'
	} else if (item.data === 171) {
		item.detail = 'MAXSYMBOLS',
			item.documentation = 'Modifies the maximum number of symbols which can be created during a single WarpScript execution.'
	} else if (item.data === 172) {
		item.detail = 'NOOP',
			item.documentation = 'Does absolutely nothing, but does it well!'
	} else if (item.data === 173) {
		item.detail = 'OPS',
			item.documentation = 'Pushes onto the stack the current number of operations which were performed by the WarpScript code execution.'
	} else if (item.data === 174) {
		item.detail = 'RESTORE',
			item.documentation = 'Restores the stack context.'
	} else if (item.data === 175) {
		item.detail = 'REV',
			item.documentation = 'Pushes on the stack the revision string of the running platform.'
	} else if (item.data === 176) {
		item.detail = 'RTFM',
			item.documentation = 'There is always a documentation for your function'
	} else if (item.data === 177) {
		item.detail = 'SAVE',
			item.documentation = 'Pushes on the stack its current context.'
	} else if (item.data === 178) {
		item.detail = 'SECUREKEY',
			item.documentation = 'Set the secure key for creating secure scripts.'
	} else if (item.data === 179) {
		item.detail = 'TOKENINFO',
			item.documentation = 'Extracts information on the token on top of the stack'
	} else if (item.data === 180) {
		item.detail = 'UNSECURE',
			item.documentation = 'Retrieve the original script from a secure script.'
	} else if (item.data === 181) {
		item.detail = 'URLFETCH',
			item.documentation = 'Retrieves the content of a URL.'
	} else if (item.data === 182) {
		item.detail = 'WEBCALL',
			item.documentation = 'Makes an outbound HTTP call.'
	} else if (item.data === 183) {
		item.detail = 'ABS',
			item.documentation = 'Calculates the absolute value of a number'
	} else if (item.data === 184) {
		item.detail = 'ADD',
			item.documentation = 'Add two parameters'
	} else if (item.data === 185) {
		item.detail = 'ALMOSTEQ',
			item.documentation = 'Verify if the difference between two numbers is lesser than a third argument'
	} else if (item.data === 186) {
		item.detail = 'AND',
			item.documentation = 'This is synonymous for &&.'
	} else if (item.data === 187) {
		item.detail = 'BITWISE_AND',
			item.documentation = 'Computes the bitwise AND of the two arguments'
	} else if (item.data === 188) {
		item.detail = 'BITWISE_COMPLEMENT',
			item.documentation = 'Computes the unary bitwise complement of the long value on top of the stack.'
	} else if (item.data === 189) {
		item.detail = 'BITWISE_OR',
			item.documentation = 'Computes the bitwise OR of the two arguments'
	} else if (item.data === 190) {
		item.detail = 'BITWISE_XOR',
			item.documentation = 'Computes the bitwise XOR of the two arguments'
	} else if (item.data === 191) {
		item.detail = 'CBRT',
			item.documentation = 'Calculate the cubic root'
	} else if (item.data === 192) {
		item.detail = 'CEIL',
			item.documentation = 'Round a number to the nearest bigger long'
	} else if (item.data === 193) {
		item.detail = 'COND_AND',
			item.documentation = 'Computes the conditional AND of the two arguments'
	} else if (item.data === 194) {
		item.detail = 'COND_OR',
			item.documentation = 'Computes the conditional OR of the two arguments'
	} else if (item.data === 195) {
		item.detail = 'COPYSIGN',
			item.documentation = 'Copies the sign of a number on another one.'
	} else if (item.data === 196) {
		item.detail = 'DIV',
			item.documentation = 'Divide a number by another'
	} else if (item.data === 197) {
		item.detail = 'DOUBLEBITSTO',
			item.documentation = 'Converts the long on top of the stack to a double by considering the long value as the raw bits of the double.'
	} else if (item.data === 198) {
		item.detail = 'EQ',
			item.documentation = 'Verify the equality of two parameters'
	} else if (item.data === 199) {
		item.detail = 'EXP',
			item.documentation = 'Return e raised to the power of the argument'
	} else if (item.data === 200) {
		item.detail = 'FLOATBITSTO',
			item.documentation = 'Converts the long on top of the stack to a double by considering the long value as the raw bits of a float.'
	} else if (item.data === 201) {
		item.detail = 'FLOOR',
			item.documentation = 'Round a number to the nearest smaller long'
	} else if (item.data === 202) {
		item.detail = 'GE',
			item.documentation = 'Verify if the first parameter is greater or equal than the second'
	} else if (item.data === 203) {
		item.detail = 'GT',
			item.documentation = 'Verify if the first parameter is greater than the second'
	} else if (item.data === 204) {
		item.detail = 'IEEEREMAINDER',
			item.documentation = 'For parameters \'f1\' and \'f2\', it calculates the remainder when \'f1\' is divided by \'f2'
	} else if (item.data === 205) {
		item.detail = 'INPLACEADD',
			item.documentation = 'Adds an element to an existing list or set'
	} else if (item.data === 206) {
		item.detail = 'ISNULL',
			item.documentation = 'Checks whether the top of the stack is null.'
	} else if (item.data === 207) {
		item.detail = 'LBOUNDS',
			item.documentation = 'Pushes onto the stack a list of M+1 bounds defining M intervals between a and b plus the intervals before a and after b.'
	} else if (item.data === 208) {
		item.detail = 'LE',
			item.documentation = 'Verify than the first parameter is lesser or equal to the second'
	} else if (item.data === 209) {
		item.detail = 'LEFT_SHIFT',
			item.documentation = 'Left shifting of bit pattern.'
	} else if (item.data === 210) {
		item.detail = 'LOG',
			item.documentation = 'Calculate the natural logarithm'
	} else if (item.data === 211) {
		item.detail = 'LOG10',
			item.documentation = 'Calculate the common logarithm'
	} else if (item.data === 212) {
		item.detail = 'LT',
			item.documentation = 'Verify if the first parameter is lesser than the second'
	} else if (item.data === 213) {
		item.detail = 'MAX',
			item.documentation = 'Calculates the maximum of two numbers'
	} else if (item.data === 214) {
		item.detail = 'MIN',
			item.documentation = 'Calculates the minimum of two numbers'
	} else if (item.data === 215) {
		item.detail = 'MOD',
			item.documentation = 'Calculates the remainder of the division of two numbers'
	} else if (item.data === 216) {
		item.detail = 'MUL',
			item.documentation = 'Multiply two numbers'
	} else if (item.data === 217) {
		item.detail = 'NBOUNDS',
			item.documentation = 'Pushes a list of n-1 bounds defining n intervals with equal area under the bell cureve N(mu,sigma).'
	} else if (item.data === 218) {
		item.detail = 'NE',
			item.documentation = 'Verify if two parameters aren\'t equal'
	} else if (item.data === 219) {
		item.detail = 'NEXTAFTER',
			item.documentation = 'Returns the DOUBLE adjacent to the first argument in the direction of the second argument'
	} else if (item.data === 220) {
		item.detail = 'NEXTUP',
			item.documentation = 'Returns the DOUBLE  adjacent to the argument in the direction of positive infinity'
	} else if (item.data === 221) {
		item.detail = 'NOT',
			item.documentation = 'Apply the logical function NOT'
	} else if (item.data === 222) {
		item.detail = 'NOT_TXT',
			item.documentation = 'Negates the boolean on the stack.'
	} else if (item.data === 223) {
		item.detail = 'NPDF',
			item.documentation = 'Parametrable function to create NDPF (Normal Distribution Probability Density Functions)'
	} else if (item.data === 224) {
		item.detail = 'OR',
			item.documentation = 'Do a boolean OR between booleans on the stack.'
	} else if (item.data === 225) {
		item.detail = 'POW',
			item.documentation = 'For parameters a\' and \'b\', it calculates \'a\' raised to the power \'b'
	} else if (item.data === 226) {
		item.detail = 'PROBABILITY',
			item.documentation = 'Pushes on the stack a function which computes probabilities according to a provided value histogram.'
	} else if (item.data === 227) {
		item.detail = 'RAND',
			item.documentation = 'Push on the stack a random number between 0 and 1'
	} else if (item.data === 228) {
		item.detail = 'RANDPDF',
			item.documentation = 'Pushes on the stack a function which emits values according to a provided value histogram.'
	} else if (item.data === 229) {
		item.detail = 'REVBITS',
			item.documentation = 'Reverse the bits of the long on top of the stack.'
	} else if (item.data === 230) {
		item.detail = 'RIGHT_SHIFT',
			item.documentation = 'Signed right bit shift.'
	} else if (item.data === 231) {
		item.detail = 'RINT',
			item.documentation = 'Return the DOUBLE closest to the value and equal to a mathematical integer'
	} else if (item.data === 232) {
		item.detail = 'ROUND',
			item.documentation = 'Round a number to the closest long'
	} else if (item.data === 233) {
		item.detail = 'SIGNUM',
			item.documentation = 'Return the signum of a number'
	} else if (item.data === 234) {
		item.detail = 'SQRT',
			item.documentation = 'Calculate the square root'
	} else if (item.data === 235) {
		item.detail = 'SUB',
			item.documentation = 'Substract two numbers'
	} else if (item.data === 236) {
		item.detail = 'TODOUBLEBITS',
			item.documentation = 'Converts a double to a long value of the raw bits of its representation.'
	} else if (item.data === 237) {
		item.detail = 'TOFLOATBITS',
			item.documentation = 'Converts a double to a long value of the raw bits of its float representation.'
	} else if (item.data === 238) {
		item.detail = 'UNSIGNED_RIGHT_SHIFT',
			item.documentation = 'Unsigned right bit shift, setting the most significant bit to 0.'
	} else if (item.data === 239) {
		item.detail = 'TOPICKLE',
			item.documentation = 'Converts the object on top of the stack to its PICKLE representation.'
	} else if (item.data === 240) {
		item.detail = 'ACOS',
			item.documentation = 'Calculate the arccosine'
	} else if (item.data === 241) {
		item.detail = 'ASIN',
			item.documentation = 'Calculate the arcsine'
	} else if (item.data === 242) {
		item.detail = 'ATAN',
			item.documentation = 'Calculate the arctangent'
	} else if (item.data === 243) {
		item.detail = 'COS',
			item.documentation = 'Calculate the cosine'
	} else if (item.data === 244) {
		item.detail = 'COSH',
			item.documentation = 'Calculate the hyperbolic cosine'
	} else if (item.data === 245) {
		item.detail = 'SIN',
			item.documentation = 'Calculate the sine'
	} else if (item.data === 246) {
		item.detail = 'SINH',
			item.documentation = 'Calculate hyperbolic sine'
	} else if (item.data === 247) {
		item.detail = 'TAN',
			item.documentation = 'Calculate the tangent'
	} else if (item.data === 248) {
		item.detail = 'TANH',
			item.documentation = 'Calculate the hyperbolic tangent'
	} else if (item.data === 249) {
		item.detail = 'TODEGREES',
			item.documentation = 'Convert from radians to degrees'
	} else if (item.data === 250) {
		item.detail = 'TORADIANS',
			item.documentation = 'Convert from degrees to radians'
	} else if (item.data === 251) {
		item.detail = 'COUNTER',
			item.documentation = 'Push a counter (AtomicLong) onto the stack.'
	} else if (item.data === 252) {
		item.detail = 'COUNTERDELTA',
			item.documentation = 'Increment a counter.'
	} else if (item.data === 253) {
		item.detail = 'COUNTERVALUE',
			item.documentation = 'Retrieve the value of a counter.'
	} else if (item.data === 254) {
		item.detail = 'RANGE',
			item.documentation = 'Pushes onto the stack a list of integers in the given range.'
	} else if (item.data === 255) {
		item.detail = 'QCONJUGATE',
			item.documentation = 'Compute the conjugate of a quaternion.'
	} else if (item.data === 256) {
		item.detail = 'QDIVIDE',
			item.documentation = 'Divide a quaternion q by a quaternion r'
	} else if (item.data === 257) {
		item.detail = 'QMULTIPLY',
			item.documentation = 'Multiply a quaternion q by a quaternion r'
	} else if (item.data === 258) {
		item.detail = 'QROTATE',
			item.documentation = 'Rotate a vector by a quaternion'
	} else if (item.data === 259) {
		item.detail = 'QROTATION',
			item.documentation = 'Extract the axis and angle of the rotation represented by the quaternion on the stack.'
	} else if (item.data === 260) {
		item.detail = 'QTO',
			item.documentation = 'Converts 4 double to a unit quaternion.'
	} else if (item.data === 261) {
		item.detail = 'ROTATIONQ',
			item.documentation = 'Create a quaternion from an axis and rotation angle (in degrees)'
	} else if (item.data === 262) {
		item.detail = 'TOQ',
			item.documentation = 'Converts 4 double to a unit quaternion.'
	} else if (item.data === 263) {
		item.detail = 'BITCOUNT',
			item.documentation = 'Computes the length of a bitset and the number of bits set.'
	} else if (item.data === 264) {
		item.detail = 'BITGET',
			item.documentation = 'Gets a bit in a bits set.'
	} else if (item.data === 265) {
		item.detail = 'BITSTOBYTES',
			item.documentation = 'Converts a bitset into a byte array.'
	} else if (item.data === 266) {
		item.detail = 'BYTESTOBITS',
			item.documentation = 'Converts a byte array into a bitset.'
	} else if (item.data === 267) {
		item.detail = 'ASSERT',
			item.documentation = 'Halt execution of the script if the top of the stack is not the BOOLEAN true'
	} else if (item.data === 268) {
		item.detail = 'BREAK',
			item.documentation = 'Break out of the current loop'
	} else if (item.data === 269) {
		item.detail = 'CONTINUE',
			item.documentation = 'Immediately start a new iteration in a running loop.'
	} else if (item.data === 270) {
		item.detail = 'DEFINED',
			item.documentation = 'Check whether or not a symbol is defined'
	} else if (item.data === 271) {
		item.detail = 'DEFINEDMACRO',
			item.documentation = 'Checks if a macro is defined and pushes true or false on the stack accordingly.'
	} else if (item.data === 272) {
		item.detail = 'EVAL',
			item.documentation = 'Evaluates the string on top of the stack'
	} else if (item.data === 273) {
		item.detail = 'FAIL',
			item.documentation = 'Halt execution of the script'
	} else if (item.data === 274) {
		item.detail = 'FOR',
			item.documentation = 'Implement a for loop'
	} else if (item.data === 275) {
		item.detail = 'FOREACH',
			item.documentation = 'Implement a foreach loop on a list or map'
	} else if (item.data === 276) {
		item.detail = 'FORSTEP',
			item.documentation = 'Implement a for loop with an index step'
	} else if (item.data === 277) {
		item.detail = 'IFT',
			item.documentation = 'Implement the if-then conditional'
	} else if (item.data === 278) {
		item.detail = 'IFTE',
			item.documentation = 'Implement the if-then-else conditional'
	} else if (item.data === 279) {
		item.detail = 'MSGFAIL',
			item.documentation = 'Halt execution of the script, returning the message on top of the stack.'
	} else if (item.data === 280) {
		item.detail = 'NRETURN',
			item.documentation = 'Immediately exit N macros being executed.'
	} else if (item.data === 281) {
		item.detail = 'RETURN',
			item.documentation = 'Immediately exit the macro being executed.'
	} else if (item.data === 282) {
		item.detail = 'STOP',
			item.documentation = 'Immediately stop executing WarpScript.'
	} else if (item.data === 283) {
		item.detail = 'SWITCH',
			item.documentation = 'Implement a switch-like conditional'
	} else if (item.data === 284) {
		item.detail = 'UNTIL',
			item.documentation = 'Implement an until loop'
	} else if (item.data === 285) {
		item.detail = 'WHILE',
			item.documentation = 'Implement a while loop'
	} else if (item.data === 286) {
		item.detail = 'CLONEREVERSE',
			item.documentation = 'Clone a LIST and reverse its order'
	} else if (item.data === 287) {
		item.detail = 'CONTAINS',
			item.documentation = 'Check if an element is in a LIST'
	} else if (item.data === 288) {
		item.detail = 'CONTAINSKEY',
			item.documentation = 'Check if an element is one of the keys of a MAP'
	} else if (item.data === 289) {
		item.detail = 'CONTAINSVALUE',
			item.documentation = 'Check if an element is one of the values of a MAP'
	} else if (item.data === 290) {
		item.detail = 'EMPTYLIST',
			item.documentation = 'Push an empty LIST on top of the stack'
	} else if (item.data === 291) {
		item.detail = 'EMPTYMAP',
			item.documentation = 'Push an empty MAP on top of the stack'
	} else if (item.data === 292) {
		item.detail = 'FLATTEN',
			item.documentation = 'Flatten a LIST'
	} else if (item.data === 293) {
		item.detail = 'GET',
			item.documentation = 'Retrieve a value in a MAP or in a LIST'
	} else if (item.data === 294) {
		item.detail = 'KEYLIST',
			item.documentation = 'Extract the keys of a MAP'
	} else if (item.data === 295) {
		item.detail = 'LFLATMAP',
			item.documentation = 'Apply a macro on each element of a list'
	} else if (item.data === 296) {
		item.detail = 'LISTTO',
			item.documentation = 'Extract the elements of a LIST'
	} else if (item.data === 297) {
		item.detail = 'LMAP',
			item.documentation = 'Apply a macro on each element of a list'
	} else if (item.data === 298) {
		item.detail = 'MAPID',
			item.documentation = 'Generates a fingerprint of a map.'
	} else if (item.data === 299) {
		item.detail = 'MAPTO',
			item.documentation = ''
	} else if (item.data === 300) {
		item.detail = 'MATTO',
			item.documentation = 'Converts a Matrix into nested lists'
	} else if (item.data === 301) {
		item.detail = 'MSORT',
			item.documentation = 'Sort a MAP'
	} else if (item.data === 302) {
		item.detail = 'PACK',
			item.documentation = 'Pack a list of numeric or boolean values according to a specified format'
	} else if (item.data === 303) {
		item.detail = 'SIZE',
			item.documentation = 'Push on the stack the size of a LIST, map or GTS'
	} else if (item.data === 304) {
		item.detail = 'SUBLIST',
			item.documentation = 'Create a sub-LIST keeping only certain elements'
	} else if (item.data === 305) {
		item.detail = 'SUBMAP',
			item.documentation = 'Create a sub-MAP keeping only certain pairs key-value'
	} else if (item.data === 306) {
		item.detail = 'TOLIST',
			item.documentation = 'Creates a LIST with the top `N` elements of the stack'
	} else if (item.data === 307) {
		item.detail = 'TOMAP',
			item.documentation = 'Creates a MAP with the top `N` elements of the stack'
	} else if (item.data === 308) {
		item.detail = 'TOMAT',
			item.documentation = 'Converts nested lists of numbers into a Matrix'
	} else if (item.data === 309) {
		item.detail = 'TOV',
			item.documentation = 'Convert the list on top of the stack into a set'
	} else if (item.data === 310) {
		item.detail = 'TOVEC',
			item.documentation = 'Converts a list of numbers into a Vector'
	} else if (item.data === 311) {
		item.detail = 'UNIQUE',
			item.documentation = 'Eliminates duplicate elements on a LIST'
	} else if (item.data === 312) {
		item.detail = 'UNLIST',
			item.documentation = 'Push onto the stack all elements of the list on top of a Mark.'
	} else if (item.data === 313) {
		item.detail = 'UNMAP',
			item.documentation = 'Deconstructs a map, putting each key/value pair as two elements on the stack on top of a Mark.'
	} else if (item.data === 314) {
		item.detail = 'UNPACK',
			item.documentation = 'Unpack a list of numeric or boolean values according to a specified format'
	} else if (item.data === 315) {
		item.detail = 'VALUELIST',
			item.documentation = 'Extract the values of a MAP'
	} else if (item.data === 316) {
		item.detail = 'VECTO',
			item.documentation = 'Converts a Vector into a list'
	} else if (item.data === 317) {
		item.detail = 'VTO',
			item.documentation = 'Convert the set on top of the stack into a list'
	} else if (item.data === 318) {
		item.detail = 'ZIP',
			item.documentation = ''
	} else if (item.data === 319) {
		item.detail = 'DIFFERENCE',
			item.documentation = 'Computes the difference of two sets'
	} else if (item.data === 320) {
		item.detail = 'INTERSECTION',
			item.documentation = 'Computes the intersection of two sets.'
	} else if (item.data === 321) {
		item.detail = 'SET',
			item.documentation = 'Replace an element in a list'
	} else if (item.data === 322) {
		item.detail = 'SETTO',
			item.documentation = 'Converts the list on top of the stack into a set'
	} else if (item.data === 323) {
		item.detail = 'TOSET',
			item.documentation = 'Converts the list on top of the stack into a set'
	} else if (item.data === 324) {
		item.detail = 'UNION',
			item.documentation = 'Performs the union of two sets.'
	} else if (item.data === 325) {
		item.detail = 'APPEND',
			item.documentation = 'Append a LIST or MAP to another'
	} else if (item.data === 326) {
		item.detail = 'LSORT',
			item.documentation = 'Sort a LIST'
	} else if (item.data === 327) {
		item.detail = 'PUT',
			item.documentation = 'Insert a key-value pair into a MAP'
	} else if (item.data === 328) {
		item.detail = 'REMOVE',
			item.documentation = 'Remove an entry from a LIST or MAP'
	} else if (item.data === 329) {
		item.detail = 'REVERSE',
			item.documentation = 'Reverse the order of a LIST'
	} else if (item.data === 330) {
		item.detail = 'GEOHASHTO',
			item.documentation = 'Converts a GeoHash to a lat/lon.'
	} else if (item.data === 331) {
		item.detail = 'GEOPACK',
			item.documentation = 'Encode a geo zone into a compact representation.'
	} else if (item.data === 332) {
		item.detail = 'GEOREGEXP',
			item.documentation = 'Produces a regexp from a GeoXPShape'
	} else if (item.data === 333) {
		item.detail = 'GEOUNPACK',
			item.documentation = 'Decodes a packed geo zone.'
	} else if (item.data === 334) {
		item.detail = 'GEO_DIFFERENCE',
			item.documentation = 'Computes the difference of two GeoXP Shapes.'
	} else if (item.data === 335) {
		item.detail = 'GEO_INTERSECTION',
			item.documentation = 'Computes the intersection of two GeoXP Shapes.'
	} else if (item.data === 336) {
		item.detail = 'GEO_INTERSECTS',
			item.documentation = 'Checks if a Geo Time Series has at least one point within a shape.'
	} else if (item.data === 337) {
		item.detail = 'GEO_JSON',
			item.documentation = 'Converts a GeoJSON string into a GeoXP Shape suitable for geo filtering'
	} else if (item.data === 338) {
		item.detail = 'GEO_UNION',
			item.documentation = 'Computes the union of two GeoXP Shapes.'
	} else if (item.data === 339) {
		item.detail = 'GEO_WITHIN',
			item.documentation = 'Checks if a Geo Time Series has all its points within a shape.'
	} else if (item.data === 340) {
		item.detail = 'GEO_WKT',
			item.documentation = 'Converts a Well Known Text String into a GeoXP Shape suitable for geo filtering'
	} else if (item.data === 341) {
		item.detail = 'HAVERSINE',
			item.documentation = 'Computes distance between two locations using the Haversine formula.'
	} else if (item.data === 342) {
		item.detail = 'HHCODETO',
			item.documentation = 'Converts an HHCode to a lat/lon.'
	} else if (item.data === 343) {
		item.detail = 'TOGEOHASH',
			item.documentation = 'Converts lat/lon to a GeoHash.'
	} else if (item.data === 344) {
		item.detail = 'TOHHCODE',
			item.documentation = 'Converts lat/lon to an Helical Hyperspatial Code (HHCode).'
	} else if (item.data === 345) {
		item.detail = 'CHUNK',
			item.documentation = 'Chunks a GTS into partial GTS.'
	} else if (item.data === 346) {
		item.detail = 'CLIP',
			item.documentation = 'Clip a Geo Time Series according to a series of limits.'
	} else if (item.data === 347) {
		item.detail = 'SHRINK',
			item.documentation = 'Shrink the number of values of a GTS'
	} else if (item.data === 348) {
		item.detail = 'TIMECLIP',
			item.documentation = 'Clip a Geo Time Series to only retain ticks that are within a given time range'
	} else if (item.data === 349) {
		item.detail = 'TIMEMODULO',
			item.documentation = 'Split a Geo Time Serie into a LIST of GTS whose timestamps are original timestamps modulo a value passed as parameter'
	} else if (item.data === 350) {
		item.detail = 'TIMESCALE',
			item.documentation = 'Modify ticks by multiplying them by a scaling factor.'
	} else if (item.data === 351) {
		item.detail = 'TIMESHIFT',
			item.documentation = 'Shift the ticks of a Geo Time Series'
	} else if (item.data === 352) {
		item.detail = 'TIMESPLIT',
			item.documentation = 'Splits a Geo Time Series at the quiet periods'
	} else if (item.data === 353) {
		item.detail = 'CORRELATE',
			item.documentation = 'Compute correlation between Geo Time Series'
	} else if (item.data === 354) {
		item.detail = 'CPROB',
			item.documentation = 'Computes a conditional probability of each value in a Geo Time Series'
	} else if (item.data === 355) {
		item.detail = 'ISONORMALIZE',
			item.documentation = 'Normalize (between -1 and 1) the values of a Geo Time Series'
	} else if (item.data === 356) {
		item.detail = 'LOWESS',
			item.documentation = 'Smooths a Geo Time Series using local regression'
	} else if (item.data === 357) {
		item.detail = 'LTTB',
			item.documentation = 'Downsamples a Geo Time Series using \'Least Triangle Three Bucket\''
	} else if (item.data === 358) {
		item.detail = 'MODE',
			item.documentation = 'Compute the mode(s) for a given GTS'
	} else if (item.data === 359) {
		item.detail = 'MONOTONIC',
			item.documentation = 'Modifies the values of a Geo Time Series so it is monotonous.'
	} else if (item.data === 360) {
		item.detail = 'MUSIGMA',
			item.documentation = 'Calculate the mean and the standard deviation of a Geo Time Series'
	} else if (item.data === 361) {
		item.detail = 'NORMALIZE',
			item.documentation = 'Normalize between 0 and 1 the values a Geo Time Series'
	} else if (item.data === 362) {
		item.detail = 'NSUMSUMSQ',
			item.documentation = 'Computes the cardinality, sum of values and sum of squared values of a Geo Time Series.'
	} else if (item.data === 363) {
		item.detail = 'PROB',
			item.documentation = 'Computes the probability of each value in a Geo Time Series'
	} else if (item.data === 364) {
		item.detail = 'RLOWESS',
			item.documentation = 'Robust and iterative smoothing of a Geo Time Series'
	} else if (item.data === 365) {
		item.detail = 'SINGLEEXPONENTIALSMOOTHING',
			item.documentation = 'Smooth a Geo Time Series with the given smoothing factor alpha'
	} else if (item.data === 366) {
		item.detail = 'STANDARDIZE',
			item.documentation = 'Replace Geo Time Series values with their standardized score'
	} else if (item.data === 367) {
		item.detail = 'TLTTB',
			item.documentation = 'Downsamples a Geo Time Series using time based \'Least Triangle Three Bucket\''
	} else if (item.data === 368) {
		item.detail = 'VALUEHISTOGRAM',
			item.documentation = 'Builds a value histogram for a GTS.'
	} else if (item.data === 369) {
		item.detail = 'DWTSPLIT',
			item.documentation = 'Split a Geo Time Series produced by FDWT into a set of series based on the resolution level.'
	} else if (item.data === 370) {
		item.detail = 'FDWT',
			item.documentation = 'Computes a Forward Discrete Wavelet Transform on a GTS.'
	} else if (item.data === 371) {
		item.detail = 'FFT',
			item.documentation = 'Computes a Fast Fourier Transform on a GTS.'
	} else if (item.data === 372) {
		item.detail = 'FFTAP',
			item.documentation = 'Computes a Fast Fourier Transform on a GTS, returning amplitude and phase.'
	} else if (item.data === 373) {
		item.detail = 'IDWT',
			item.documentation = 'Computes an Inverse Discrete Wavelet Transform on a GTS.'
	} else if (item.data === 374) {
		item.detail = 'IFFT',
			item.documentation = 'Computes an Inverse Fast Fourier Transform.'
	} else if (item.data === 375) {
		item.detail = 'CLONE',
			item.documentation = 'Make a deep copy of a GTS'
	} else if (item.data === 376) {
		item.detail = 'CLONEEMPTY',
			item.documentation = 'Push onto the stack an empty clone of the argument GTS'
	} else if (item.data === 377) {
		item.detail = 'COMMONTICKS',
			item.documentation = 'Modifies Geo Time Series so they all have the same ticks, the set of ticks common to all input Geo Time Series.'
	} else if (item.data === 378) {
		item.detail = 'COMPACT',
			item.documentation = 'Remove measurements which have the same value, location and elevation as the previous one'
	} else if (item.data === 379) {
		item.detail = 'DEDUP',
			item.documentation = 'Remove duplicate timestamps from a Geo Time Series'
	} else if (item.data === 380) {
		item.detail = 'FILLTICKS',
			item.documentation = 'Add values to a GTS at given ticks'
	} else if (item.data === 381) {
		item.detail = 'INTEGRATE',
			item.documentation = 'Integrate a Geo Time Serie'
	} else if (item.data === 382) {
		item.detail = 'LASTSORT',
			item.documentation = 'Sorts a list of Geo Time Series according to their most recent value.'
	} else if (item.data === 383) {
		item.detail = 'MERGE',
			item.documentation = 'Merge two Geo Time Series'
	} else if (item.data === 384) {
		item.detail = 'NONEMPTY',
			item.documentation = 'Check whether or not a Geo Time Series has values'
	} else if (item.data === 385) {
		item.detail = 'PARTITION',
			item.documentation = 'Splits GTS in equivalence classes based on label values.'
	} else if (item.data === 386) {
		item.detail = 'QUANTIZE',
			item.documentation = 'Generates a quantified version of a Geo Time Series.'
	} else if (item.data === 387) {
		item.detail = 'RANGECOMPACT',
			item.documentation = 'Remove intermediate values on constant ranges of a GTS'
	} else if (item.data === 388) {
		item.detail = 'RESETS',
			item.documentation = 'Remove resets in Geo Time Series values'
	} else if (item.data === 389) {
		item.detail = 'RSORT',
			item.documentation = 'Sort a Geo Time Series by descending timestamps'
	} else if (item.data === 390) {
		item.detail = 'RVALUESORT',
			item.documentation = 'Sorts Geo Time Series by reverse order according to its values'
	} else if (item.data === 391) {
		item.detail = 'SORT',
			item.documentation = 'Sort a Geo Time Series by ascending timestamps'
	} else if (item.data === 392) {
		item.detail = 'SORTBY',
			item.documentation = 'Sort list of Geo Time Series according to values extracted by a macro'
	} else if (item.data === 393) {
		item.detail = 'UNWRAP',
			item.documentation = 'Decode a Geo Time Series previously encoded by WRAP.'
	} else if (item.data === 394) {
		item.detail = 'VALUEDEDUP',
			item.documentation = 'Remove duplicate values from a Geo Time Series'
	} else if (item.data === 395) {
		item.detail = 'VALUESORT',
			item.documentation = 'Sorts Geo Time Series according to its values.'
	} else if (item.data === 396) {
		item.detail = 'VALUESPLIT',
			item.documentation = 'Split a Geo Time Series into N distinct GTS, one for each distinct value'
	} else if (item.data === 397) {
		item.detail = 'WRAP',
			item.documentation = 'Efficiently encode a Geo Time Series or a list thereof into strings.'
	} else if (item.data === 398) {
		item.detail = 'WRAPRAW',
			item.documentation = 'Efficiently encode a Geo Time Series or a list thereof into byte arrays.'
	} else if (item.data === 399) {
		item.detail = 'MAKEGTS',
			item.documentation = 'Builds a GTS from arrays.'
	} else if (item.data === 400) {
		item.detail = 'NEWGTS',
			item.documentation = 'Push an empty Geo Time Series onto the stack'
	} else if (item.data === 401) {
		item.detail = 'PARSE',
			item.documentation = 'Parse a STRING into a set of Geo Time Series'
	} else if (item.data === 402) {
		item.detail = 'DELETE',
			item.documentation = 'Delete a set of GTS.'
	} else if (item.data === 403) {
		item.detail = 'FETCH',
			item.documentation = 'Fetch data from Warp10\'s datastore'
	} else if (item.data === 404) {
		item.detail = 'FETCHBOOLEAN',
			item.documentation = 'Fetches data from the store, forcing the returned Geo Time Series to be of type BOOLEAN.'
	} else if (item.data === 405) {
		item.detail = 'FETCHDOUBLE',
			item.documentation = 'Fetches data from the store, forcing the returned Geo Time Series to be of type DOUBLE.'
	} else if (item.data === 406) {
		item.detail = 'FETCHLONG',
			item.documentation = 'Fetches data from the store, forcing the returned Geo Time Series to be of type LONG.'
	} else if (item.data === 407) {
		item.detail = 'FETCHSTRING',
			item.documentation = 'Fetches data from the store, forcing the returned Geo Time Series to be of type STRING.'
	} else if (item.data === 408) {
		item.detail = 'FIND',
			item.documentation = 'Find Geo Time Series matching some criteria'
	} else if (item.data === 409) {
		item.detail = 'FINDSTATS',
			item.documentation = 'Computes statistics on matching GTS.'
	} else if (item.data === 410) {
		item.detail = 'UPDATE',
			item.documentation = 'Pushes datapoints to the Warp 10 backend.'
	} else if (item.data === 411) {
		item.detail = 'DISCORDS',
			item.documentation = 'Detects discords in a Geo Time Series.'
	} else if (item.data === 412) {
		item.detail = 'DTW',
			item.documentation = 'Computes similarity between two Geo Time Series using Dynamic Time Warping.'
	} else if (item.data === 413) {
		item.detail = 'OPTDTW',
			item.documentation = 'Find the N optimal matches for a query sequence using Dynamic Time Warping.'
	} else if (item.data === 414) {
		item.detail = 'PATTERNDETECTION',
			item.documentation = 'Detect patterns in a Geo Time Series.'
	} else if (item.data === 415) {
		item.detail = 'PATTERNS',
			item.documentation = 'Extract patterns from a Geo Time Series.'
	} else if (item.data === 416) {
		item.detail = 'ZDISCORDS',
			item.documentation = 'Detects discords in a standardized Geo Time Series.'
	} else if (item.data === 417) {
		item.detail = 'ZPATTERNDETECTION',
			item.documentation = 'Detect patterns in a standardized Geo Time Series.'
	} else if (item.data === 418) {
		item.detail = 'ZPATTERNS',
			item.documentation = 'Extract patterns from a standardized Geo Time Series.'
	} else if (item.data === 419) {
		item.detail = 'ZSCORE',
			item.documentation = 'Normalize by the mean or median, using Z-score'
	} else if (item.data === 420) {
		item.detail = 'ESDTEST',
			item.documentation = 'Detect outliers using an generalized extreme studentized deviate test'
	} else if (item.data === 421) {
		item.detail = 'GRUBBSTEST',
			item.documentation = 'Detect outliers using a Grubbs\' test'
	} else if (item.data === 422) {
		item.detail = 'HYBRIDTEST',
			item.documentation = 'Detect outliers using Seasonal Hybrid ESD test'
	} else if (item.data === 423) {
		item.detail = 'HYBRIDTEST2',
			item.documentation = 'Detect outliers using Seasonal Entropy Hybrid ESD test'
	} else if (item.data === 424) {
		item.detail = 'STLESDTEST',
			item.documentation = 'Detect outliers using seasonal extract and an generalized extreme studentized deviate test'
	} else if (item.data === 425) {
		item.detail = 'THRESHOLDTEST',
			item.documentation = 'Detect outliers using a threshold test'
	} else if (item.data === 426) {
		item.detail = 'ZSCORETEST',
			item.documentation = 'Detect outliers using a Zscore test'
	} else if (item.data === 427) {
		item.detail = 'BBOX',
			item.documentation = 'Computes the bounding box of a Geo Time Series'
	} else if (item.data === 428) {
		item.detail = 'COPYGEO',
			item.documentation = 'Forces the location elements of a GTS onto others.'
	} else if (item.data === 429) {
		item.detail = 'ELEVATIONS',
			item.documentation = 'Push Geo Time Series elevations onto the stack'
	} else if (item.data === 430) {
		item.detail = 'LOCATIONOFFSET',
			item.documentation = 'Downsamples a Geo Time Series by retaining only those datapoints farther away than a threshold distance'
	} else if (item.data === 431) {
		item.detail = 'LOCATIONS',
			item.documentation = 'Push Geo Time Series latitudes and longitudes onto the stack'
	} else if (item.data === 432) {
		item.detail = 'LOCSTRINGS',
			item.documentation = 'Pushes encoded locations of Geo Time Series onto the stack'
	} else if (item.data === 433) {
		item.detail = 'ATTRIBUTES',
			item.documentation = 'Retrieves the attributes of a GTS.'
	} else if (item.data === 434) {
		item.detail = 'LABELS',
			item.documentation = 'Push the labels of a Geo Time Series onto the stack'
	} else if (item.data === 435) {
		item.detail = 'META',
			item.documentation = 'Sets the attributes of a list of Geo Time Series in the Warp 10 backend.'
	} else if (item.data === 436) {
		item.detail = 'METASORT',
			item.documentation = 'Sorts a list of Geo Time Series according to their metadata (class + labels).'
	} else if (item.data === 437) {
		item.detail = 'NAME',
			item.documentation = 'Push the class name of a Geo Time Series onto the stack'
	} else if (item.data === 438) {
		item.detail = 'PARSESELECTOR',
			item.documentation = 'Parse a Geo Time Series selector into a class selector and a labels selection MAP'
	} else if (item.data === 439) {
		item.detail = 'RELABEL',
			item.documentation = 'Modify the labels of a Geo Time Series'
	} else if (item.data === 440) {
		item.detail = 'RENAME',
			item.documentation = 'Rename a Geo Time Series'
	} else if (item.data === 441) {
		item.detail = 'SETATTRIBUTES',
			item.documentation = 'Set attributes of a GTS.'
	} else if (item.data === 442) {
		item.detail = 'TOSELECTOR',
			item.documentation = 'Transform a class selector and a labels selection MAPs into a Geo Time Series selector'
	} else if (item.data === 443) {
		item.detail = 'ADDVALUE',
			item.documentation = 'Add a value to a GTS'
	} else if (item.data === 444) {
		item.detail = 'ATINDEX',
			item.documentation = 'Extract the timestamp, longitude, lattitude, elevation and value for the N-th point of the GTS'
	} else if (item.data === 445) {
		item.detail = 'ATTICK',
			item.documentation = 'Extract the timestamp, longitude, lattitude, elevation and value for a given timestamp of the GTS'
	} else if (item.data === 446) {
		item.detail = 'FIRSTTICK',
			item.documentation = 'Push onto the stack the timestamp of the first tick of a Geo Time Series'
	} else if (item.data === 447) {
		item.detail = 'LASTTICK',
			item.documentation = 'Push onto the stack the timestamp of the last tick of a Geo Time Series'
	} else if (item.data === 448) {
		item.detail = 'SETVALUE',
			item.documentation = 'Adds a value to a GTS, overwriting the value at the given timestamp.'
	} else if (item.data === 449) {
		item.detail = 'TICKINDEX',
			item.documentation = 'Reindex the ticks of Geo Time Series'
	} else if (item.data === 450) {
		item.detail = 'TICKLIST',
			item.documentation = 'Push Geo Time Series ticks onto the stack'
	} else if (item.data === 451) {
		item.detail = 'TICKS',
			item.documentation = 'Push Geo Time Series timestamps onto the stack'
	} else if (item.data === 452) {
		item.detail = 'VALUES',
			item.documentation = 'Push Geo Time Series values onto the stack'
	} else if (item.data === 453) {
		item.detail = 'ATBUCKET',
			item.documentation = 'Extracts the data from a bucket of a Geo Time Series'
	} else if (item.data === 454) {
		item.detail = 'BUCKETCOUNT',
			item.documentation = 'Extract bucketcount from a bucketized Geo Time Series'
	} else if (item.data === 455) {
		item.detail = 'BUCKETSPAN',
			item.documentation = 'Extract bucketspan from a bucketized Geo Time Series'
	} else if (item.data === 456) {
		item.detail = 'CROP',
			item.documentation = 'Rebucketize a Geo Time Series'
	} else if (item.data === 457) {
		item.detail = 'FILLNEXT',
			item.documentation = 'Fill missing values in a bucketized Geo Time Series with the next known value'
	} else if (item.data === 458) {
		item.detail = 'FILLPREVIOUS',
			item.documentation = 'Fill missing values in a bucketized Geo Time Series with the last known value'
	} else if (item.data === 459) {
		item.detail = 'FILLVALUE',
			item.documentation = 'Fill missing values in a bucketized Geo Time Series with a constant'
	} else if (item.data === 460) {
		item.detail = 'INTERPOLATE',
			item.documentation = 'Fill gaps in bucketized Geo Time Series'
	} else if (item.data === 461) {
		item.detail = 'LASTBUCKET',
			item.documentation = 'Push the end timestamp of the last bucket of a bucketized Geo Time Series'
	} else if (item.data === 462) {
		item.detail = 'STL',
			item.documentation = 'Apply Seasonal Trend decomposition based on Loess procedure'
	} else if (item.data === 463) {
		item.detail = 'UNBUCKETIZE',
			item.documentation = 'Force a Geo Time Series to be un-bucketized'
	} else if (item.data === 464) {
		item.detail = 'MACROFILTER',
			item.documentation = 'Creates a filter from a macro.'
	} else if (item.data === 465) {
		item.detail = 'MAXLONG',
			item.documentation = 'Push Long.MAX_VALUE onto the stack'
	} else if (item.data === 466) {
		item.detail = 'MINLONG',
			item.documentation = 'Push Long.MIN_VALUE onto the stack'
	} else if (item.data === 467) {
		item.detail = 'NULL',
			item.documentation = 'Push the symbolic value NULL onto the stack'
	} else if (item.data === 468) {
		item.detail = 'PI_UC',
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
