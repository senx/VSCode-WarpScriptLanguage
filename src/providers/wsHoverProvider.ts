'use strict';

import { HoverProvider, Hover, MarkedString, TextDocument, CancellationToken, Position } from 'vscode';
import wsGlobals = require('../wsGlobals');

/**
 * Profive addition informations
 */
export default class WSHoverProvider implements HoverProvider {

	/**
	 * 
	 * @param {TextDocument} document 
	 * @param {Position} position 
	 * @param {CancellationToken} _token 
	 */
	public provideHover(document: TextDocument, position: Position, _token: CancellationToken): Hover | undefined {
		let wordRange = document.getWordRangeAtPosition(position, /[^\s]+/);
		if (!wordRange) {
			return undefined;
		}
		let name = document.getText(wordRange);
		var entry = wsGlobals.globalfunctions[name];
		if (entry && entry.description) {
			let signature = (entry.signature || '');
			let contents: MarkedString[] = ['### ' + name, { language: 'warpscript', value: signature }, entry.description];
			return new Hover(contents, wordRange);
		}

		return undefined;
	}
}