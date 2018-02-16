'use strict';

import { TextDocument, CancellationToken, workspace, DocumentLinkProvider, DocumentLink, Uri, Range } from 'vscode';

export default class WSDocumentLinksProvider implements DocumentLinkProvider {
    private _linkPattern = /([@][^\s]+)/g;
    public static links: any = {};

    public async provideDocumentLinks(document: TextDocument, _token: CancellationToken): Promise<DocumentLink[]> {
        const results: DocumentLink[] = []
        const text = document.getText();
        WSDocumentLinksProvider.links = {};
        this._linkPattern.lastIndex = 0;
        let match: RegExpMatchArray | null;
        let macroNames = []
        while ((match = this._linkPattern.exec(text))) {
            const pre = match[1];
            const offset = match.index;
            const linkStart = document.positionAt(offset);
            const linkEnd = document.positionAt(offset + pre.length);
            macroNames.push(pre.replace('@', ''))
            const doc = await workspace.findFiles('**/' + pre.replace('@', '') + '.mc2', '**/node_modules/**', 1)
            let uri = Uri.parse('file:/' + doc[0].path);
            WSDocumentLinksProvider.links[pre] = doc[0].path
            results.push(new DocumentLink(new Range(linkStart, linkEnd), uri));
        }
        return Promise.resolve(results);
    }
}