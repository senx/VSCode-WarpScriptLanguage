/**
 * Put here every global variables/flags of the project.
 */


/**
 * When we launch the "close all json" command, this flag is set to true
 * The content providers won't be updated as long as this flag is true.
 */

export interface EndPointProp {
  revision: string;
  auditAvailable: boolean;
  ident: string;
  lastRefresh: number; // timestamp of last successful enpoint props query
}
export class WarpScriptExtGlobals {
  public static weAreClosingFilesFlag: boolean = false;
  public static sessionName: string = "";
  public static endpointsForThisSession: { [key: string]: number } = {};
  public static endpointsProperties: { [key: string]: EndPointProp } = {};
}