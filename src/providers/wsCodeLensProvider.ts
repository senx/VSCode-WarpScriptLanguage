'use strict';

import WarpScriptParser from '../warpScriptParser';
import { TextDocument, CancellationToken, workspace,Command,CodeLensProvider, Uri, Range, Position, FoldingContext, FoldingRange, FoldingRangeKind, CodeLens, commands, ProviderResult } from 'vscode';
import { version } from 'punycode';

export default class WSCodeLensProvider implements CodeLensProvider {

  public async provideCodeLenses(document: TextDocument, cancelToken: CancellationToken): Promise<CodeLens[]> {

    console.log("beuar");

    return Promise.resolve(WarpScriptParser.getCodeLenses(document,cancelToken));

    let u:CodeLens=new CodeLens(new Range(2,0,2,0),{
      title:"dans con cul",
      command: "",
      arguments: []
    });
    
    let u2:CodeLens=new CodeLens(new Range(17,0,17,0),{
      title:"au fond à droite",
      command: "extension.jumptoWSoffset",
      arguments: [ 60 ] 
    });

    let u3:CodeLens=new CodeLens(new Range(17,1,17,1),{
      title:"aseg",
      command: "revealLine",
      arguments: [ 170,'bottom'] 
    });
    return Promise.resolve([u,u2,u3]);

  }

  public resolveCodeLens(codeLens:CodeLens,token:CancellationToken):ProviderResult<CodeLens> {    
    codeLens.isResolved
    console.log("beuar2");
    return codeLens;

  }
}
