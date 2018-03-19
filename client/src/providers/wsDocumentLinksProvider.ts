'use strict';

import { TextDocument, CancellationToken, workspace, DocumentLinkProvider, DocumentLink, Uri, Range } from 'vscode';

export default class WSDocumentLinksProvider implements DocumentLinkProvider {
    private _linkPattern = /@([^\s]+)/g;

    public async provideDocumentLinks(document: TextDocument, _token: CancellationToken): Promise<DocumentLink[]> {
        const results: DocumentLink[] = []
        const text = document.getText();
        this._linkPattern.lastIndex = 0;
        let match: RegExpMatchArray | null;
        let macroNames = []
        while ((match = this._linkPattern.exec(text))) {
            const macroLinkName = match[0];
            const macroName = match[1];
            const offset = match.index;
            const linkStart = document.positionAt(offset);
            const linkEnd = document.positionAt(offset + macroLinkName.length);
            macroNames.push(macroName)
            await WSDocumentLinksProvider.getMacroURI(macroName).then(
                (uri) => results.push(new DocumentLink(new Range(linkStart, linkEnd), uri))
            );
        }
        return Promise.resolve(results);
    }

    public static async getMacroURI(macroName: string): Promise<Uri>{
        return new Promise<Uri>(async (resolve, reject) => {
            const doc = await workspace.findFiles('**/' + macroName + '.mc2', '**/node_modules/**', 1)
            if (doc[0]) {
                let uri = Uri.parse('file:/' + doc[0].path);
                resolve(uri);
            }
            reject();
        });
    }
}