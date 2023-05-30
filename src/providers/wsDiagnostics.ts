import {
    Diagnostic,
    DiagnosticCollection,
    DiagnosticSeverity,
    ExtensionContext,
    languages,
    Position,
    Range,
    TextDocument,
    window,
    workspace
} from 'vscode';
import {endPointProp, endpointsProperties} from '../globals';
import * as request from 'request';
import WarpScriptParser, {specialCommentCommands} from '../warpScriptParser';
//import { Diagnostic } from 'vscode-languageclient';

export default class WSDiagnostics {

    constructor(private context: ExtensionContext) {

    }

    public updateDiagnostics(document: TextDocument, collection: DiagnosticCollection): void {
        // do not audit warpscript greater than 1MB
        if (document && document.languageId == 'warpscript' && document.getText().length < 1000000) {
            // what is the endpoint ?
            let Warp10URL: string = workspace.getConfiguration().get('warpscript.Warp10URL');
            let executedWarpScript = document.getText();
            const commentsCommands: specialCommentCommands = WarpScriptParser.extractSpecialComments(executedWarpScript);
            Warp10URL = commentsCommands.endpoint || Warp10URL;
            // properties of the enpoint ?
            let prop: endPointProp = WSDiagnostics.getEndpointProperties(Warp10URL);
            if (prop && prop.auditAvailable) {
                let ws = "WSAUDITMODE <% \n" + document.getText() + "\n %> CLEAR WSAUDIT";
                var request_options: request.Options = {
                    headers: {
                        'Content-Type': 'text/plain; charset=UTF-8',
                        'Accept': 'application/json'
                    },
                    method: "POST",
                    url: Warp10URL,
                    timeout: 10000,
                    body: ws,
                }
                request.post(request_options, async (error: any, response: any, body: string) => {
                    if (error) { // error is set if server is unreachable or if the request is aborted
                        if (error.aborted) {
                            console.log("cannot audit " + document.uri + " on " + Warp10URL + " (aborted)");
                        }
                    } else if (response.statusCode == 500) {
                        //console.log(response.headers);
                        let lines = document.getText().split('\n');
                        // weird case 1 : user type %>  the error will be on the last line : %> WSAUDIT
                        let errorMessage: string = response.headers['x-warp10-error-message'];
                        if (errorMessage && errorMessage.indexOf("WSAUDIT") > 0) {
                            collection.set(document.uri, [{
                                code: '',
                                message: 'unbalanced macro construction',
                                range: new Range(new Position(lines.length, 0), new Position(lines.length, 0)),
                                severity: DiagnosticSeverity.Error,
                                source: '',
                                relatedInformation: []
                            }]);
                        } else {
                            // unbalanced errors (not catched by WSAUDITMODE)
                            if (response.headers['x-warp10-error-message']) {
                                collection.set(document.uri, [{
                                    code: '',
                                    message: response.headers['x-warp10-error-message'],
                                    range: new Range(new Position(lines.length, 0), new Position(lines.length, 0)),
                                    severity: DiagnosticSeverity.Error,
                                    source: '',
                                    relatedInformation: []
                                }]);
                            }
                        }

                    } else if (response.statusCode == 200) {
                        try {
                            let answer = JSON.parse(body);
                            let lines = document.getText().split('\n'); // original input without WSAUDIT <% prefix
                            let output: Diagnostic[] = [];
                            let errors = answer[0];
                            for (let i = 0; i < errors.length; i++) {
                                let err = errors[i];
                                console.log(err)
                                if (err["type"] == "UNKNOWN") {
                                    output.push({
                                        message: "Unknown function " + err["statement"],
                                        // first line for Warp 10 is 1. this is the line with WSAUDIT <%
                                        // first line for VSCode is 0.
                                        range: this.getRangeFromPositionWithEnd(lines[err["line"] - 2], err["line"] - 2, err["position"], err["position.end"]),
                                        severity: DiagnosticSeverity.Error
                                    })
                                }
                                if (err["type"] == "WS_EXCEPTION") {
                                    output.push({
                                        message: "WarpScript Exception, " + err["statement"],
                                        // first line for Warp 10 is 1. this is the line with WSAUDIT <%
                                        // first line for VSCode is 0.
                                        range: this.getRangeFromPositionWithEnd(lines[err["line"] - 2], err["line"] - 2, err["position"], err["position.end"]),
                                        severity: DiagnosticSeverity.Error
                                    })
                                }
                                if (err["type"] == "WS_WARNING") {
                                    output.push({
                                        message: "WarpScript Warning, " + err["statement"],
                                        // first line for Warp 10 is 1. this is the line with WSAUDIT <%
                                        // first line for VSCode is 0.
                                        range: this.getRangeFromPositionWithEnd(lines[err["line"] - 2], err["line"] - 2, err["position"], err["position.end"]),
                                        severity: DiagnosticSeverity.Warning
                                    })
                                }
                            }
                            collection.set(document.uri, output as readonly Diagnostic[]);
                        } catch (error) {
                            console.log("2 cannot audit " + document.uri + " on " + Warp10URL + " (cannot decode answer)");
                        }
                    } else {
                        console.log("3 cannot audit " + document.uri + " on " + Warp10URL + " status=" + response.statusCode);
                    }

                });

                // TODO: it is possible to add related diagnostic informations.
                // collection.set(document.uri, [{
                // 	code: '',
                // 	message: 'cannot assign twice to immutable variable `x`',
                // 	range: new Range(new Position(3, 4), new Position(3, 10)),
                // 	severity: DiagnosticSeverity.Error,
                // 	source: '',
                // 	relatedInformation: [
                // 		new DiagnosticRelatedInformation(new Location(document.uri, new Range(new Position(1, 8), new Position(1, 9))), 'first assignment to `x`')
                // 	]
                // }]);
            } else {
                collection.clear();
            }


        } else {
            collection.clear();
        }

    }

    // very simplified version if Warp 10 parser can return statement absolute position.
    //@ts-ignore
    private getRangeFromPosition(line: string, lineNo: number, position: number): Range {
        // look for next space (or end of line)
        let end = position;
        while (end < line.length && line[end] != ' ') {
            end++;
        }
        return new Range(new Position(lineNo, position), new Position(lineNo, end));
    }

    // very very simplified version if Warp 10 parser can return statement absolute position (PR ongoing)
    private getRangeFromPositionWithEnd(_line: string, lineNo: number, position: number, positionEnd: number): Range {
        return new Range(new Position(lineNo, position), new Position(lineNo, positionEnd));
    }

    // lineNo is the editor line count used to create the range
    // statementNumber is the statement count, 0 for the first statement.
    //@ts-ignore
    private getRangeFromStatementNumber(line: string, lineNo: number, statementNumber: number): Range {

        // first, mimic warpscript sanitizeStrings(), replace with _ instead of %20
        let newstr: string = ""
        let stringsep = '\0';
        let instring: boolean = false;
        for (let i = 0; i < line.length; i++) {
            if (instring && line[i] == stringsep) {
                // If the separator is at the end of the line or
                // followed by a whitespace then we consider we exited the string, otherwise
                // it is just part of the string
                if (i == line.length - 1 || ' ' == line[i + 1]) {
                    instring = false;
                    stringsep = '\0';
                }
            } else if (!instring) {
                if (line[i] == '"') {
                    instring = true;
                    stringsep = '"';
                } else if (line[i] == "'") {
                    instring = true;
                    stringsep = '"';
                }
            }
            if (instring && line[i] == ' ') {
                newstr += "_";
            } else {
                newstr += line[i];
            }
        }

        // then, act as warpscript split(), but create a range when desired statement is found
        if (line.length < 1) {
            return new Range(new Position(lineNo, 0), new Position(lineNo, 1));
        }
        let stmtStart: number = 0;
        let stmtCount: number = 0;
        let i = 0;
        while (newstr[i] == ' ' && i < newstr.length) {
            i++;
        } // first space are ignored (trim)
        for (; i < newstr.length; i++) {
            if (newstr[i] != ' ') {
                stmtStart = i;
                while (newstr[i] != ' ' && i < newstr.length) {
                    i++;
                }
                if (stmtCount == statementNumber) {
                    return new Range(new Position(lineNo, stmtStart), new Position(lineNo, i));
                }
            }
            stmtCount++;
        }

        return new Range(new Position(lineNo, 0), new Position(lineNo, 1)); // at least, range = beginning of the line
    }

    // try to retrieve properties from an enpoint. Request if needed.
    public static getEndpointProperties(url: string): endPointProp {
        if (endpointsProperties[url] && (endpointsProperties[url].lastRefresh + 600000) > Date.now()) { // new try every 10 minutes
            return endpointsProperties[url];
        }

        let ws: string = "IDENT DUP ISNULL <% DROP '' %> IFT  REV <% 'WSAUDITMODE' EVAL true %> <% false %> <% %> TRY ";

        var request_options: request.Options = {
            headers: {
                'Content-Type': 'text/plain; charset=UTF-8',
                'Accept': 'application/json'
            },
            method: "POST",
            url: url,
            timeout: 3000,
            body: ws,
        }

        request.post(request_options, async (error: any, response: any, body: string) => {
            if (error) { // error is set if server is unreachable or if the request is aborted
                if (error.aborted) {
                    console.log("cannot request " + url + " revision");
                }
            } else if (response.statusCode == 200) {
                try {
                    let answer = JSON.parse(body);
                    let props: endPointProp = {
                        auditAvailable: answer[0],
                        revision: answer[1],
                        ident: answer[2],
                        lastRefresh: Date.now()
                    };
                    endpointsProperties[url] = props;
                    console.log(props)
                } catch (error) {
                    console.log("cannot request " + url + " revision");
                }
            } else {
                console.log("cannot request " + url + " revision");
            }

        });

        // on first request, this function will return undefined (because request async answer will not be yet processed)
        return endpointsProperties[url];
    }

    private noChangeTimer: NodeJS.Timer;
    private debounceTime: number;


    private refreshConfig() {
        // read debounce time from config, default to 5000
        this.debounceTime = workspace.getConfiguration().get("warpscript.debounceTimeBeforeAudit") || 5000;
        if (this.debounceTime < 1000) {
            this.debounceTime = 1000;
        }
        console.log("debounce time = %d", this.debounceTime);
    }

    public initializeDiagnostics() {
        // fetch configuration
        this.refreshConfig();

        // create diagnostic collection
        const wsDiagnosticsCollection = languages.createDiagnosticCollection('wsdiagnostics');
        this.context.subscriptions.push(wsDiagnosticsCollection);


        // diagnostics should be refreshed when editor change, or when user stop typing during debounce time.
        if (window.activeTextEditor) {
            this.updateDiagnostics(window.activeTextEditor.document, wsDiagnosticsCollection);
        }
        this.context.subscriptions.push(window.onDidChangeActiveTextEditor(editor => {
            if (editor) {
                wsDiagnosticsCollection.clear();
                this.updateDiagnostics(editor.document, wsDiagnosticsCollection);
            }
        }));
        this.context.subscriptions.push(workspace.onDidChangeTextDocument(editor => {
            if (editor) {
                wsDiagnosticsCollection.clear();

                clearTimeout(this.noChangeTimer);
                this.noChangeTimer = setTimeout(() => {
                    this.updateDiagnostics(editor.document, wsDiagnosticsCollection);
                }, this.debounceTime);

            }
        }));

        // also listen for configuration change
        this.context.subscriptions.push(workspace.onDidChangeConfiguration(_e => {
            this.refreshConfig();
        }));

    }


}

