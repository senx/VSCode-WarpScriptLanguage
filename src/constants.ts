/**
 * Put here every reusable methods of the project
 */

import { tmpdir } from "os";
import { join } from "path";
import { ExtensionContext, Uri, workspace } from "vscode";

export default class WarpScriptExtConstants {


  public static isVirtualWorkspace = workspace.workspaceFolders && workspace.workspaceFolders.every(f => f.uri.scheme !== 'file');

  public static async findTempFolder(): Promise<string> {
    if (WarpScriptExtConstants.isVirtualWorkspace) {
      const uri = { ...workspace.workspaceFolders![0]!.uri, path: '/.tmp' } as Uri;
      try {
        await workspace.fs.stat(uri);
      } catch (e) {
        await workspace.fs.createDirectory(uri)
      }
      return '/.tmp';
    } else {
      return tmpdir();
    }
  }

  /**
   * This regexp identifies the output files of the WarpScript execution
   */
  public static async jsonResultRegEx(): Promise<RegExp> {
    const tmp = await WarpScriptExtConstants.findTempFolder();
    return new RegExp(tmp.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '[\/\\\\]' + '(\\d{3})([nmu])([XGIJD]?)\\.json', 'gi');
  }

  public static getRessource(context: ExtensionContext, path: string) {
    let onDiskPath = { ...context.extensionUri, path: join(context.extensionUri.path, path) } as Uri;
    return WarpScriptExtConstants.isVirtualWorkspace
      ? onDiskPath.scheme + '://' + onDiskPath.authority + onDiskPath.path
      : Uri.file(join(context.extensionUri.path, path)).with({ scheme: 'vscode-resource' }).toString()
  }

}
