'use strict';

import WarpScriptParser from '../warpScriptParser';
import { TextDocument, CancellationToken, CodeLensProvider, CodeLens } from 'vscode';

export default class WSCodeLensProvider implements CodeLensProvider {

  public async provideCodeLenses(document: TextDocument, cancelToken: CancellationToken): Promise<CodeLens[]> {
    return Promise.resolve(WarpScriptParser.getCodeLenses(document, 20, cancelToken));
  }
}
