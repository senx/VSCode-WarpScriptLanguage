'use strict';

import { HoverProvider, Hover, MarkedString, TextDocument, CancellationToken, Position } from 'vscode';
import wsGlobals = require('./wsGlobals');
//import { textToMarkedString } from './utils/markedTextUtil';

export default class WSHoverProvider implements HoverProvider {

	public provideHover(document: TextDocument, position: Position, _token: CancellationToken): Hover | undefined {
        let wordRange = document.getWordRangeAtPosition(position, /[^\s]+/);
		if (!wordRange) {
			return undefined;
		}
		let name = document.getText(wordRange);
        var entry = wsGlobals.globalfunctions[name];
		if (entry && entry.description) {
			let signature = name + (entry.signature || '');
			let contents: MarkedString[] = [entry.description, { language: 'warpscript', value: signature }];
			return new Hover(contents, wordRange);
		}

		return undefined;
	}
}