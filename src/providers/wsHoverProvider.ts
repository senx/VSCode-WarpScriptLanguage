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
			let contents: MarkedString[] = ['### [' + name + '](https://www.warp10.io/doc/'+entry.OPB64name+')', { language: 'warpscript', value: signature }, 
			entry.description.replace(/(\/doc\/\w+)/g, x => `https://www.warp10.io${x}`)];
			return new Hover(contents, wordRange);
		}

		/**
		 * Deals with internal VSCode documentation
		 * This part could not be in wsGlobals
		 */
		let otherKeywordsDoc = JSON.parse(`{
			"@localmacrosubstitution": {
				"sig": "@localmacrosubstitution b:BOOLEAN",
				"help": "When false, deactivate the inline macro substitution done by VSCode Warpscript plugin. "
			},
			"@endpoint": {
				"sig": "@endpoint URL:STRING",
				"help": "Override the _warpscript.Warp10URL_ settings in VSCode. Typical Warp 10 URL is http://127.0.0.1/api/v0/exec"
			} 
		}`);

		let help = otherKeywordsDoc[name];
		if (help) {
			let contents: MarkedString[] = ['### ' + name, { language: 'warpscript', value: help["sig"] }, help["help"]];
			return new Hover(contents, wordRange);
		}

		return undefined;
	}
}