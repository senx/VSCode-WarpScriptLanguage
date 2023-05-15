/**
 * Put here every global variables/flags of the project.
 */

 
/**
 * When we launch the "close all json" command, this flag is set to true
 * The content providers won't be updated as long as this flag is true.
 */
export let weAreClosingFilesFlag:boolean = false;

export let sessionName:string = "";

export let endpointsForThisSession:{[key: string]: number} = {};

export interface endPointProp {
  revision: string;
  auditAvailable: boolean;
  ident: string;
  lastRefresh:number; // timestamp of last successful enpoint props query
}

export let endpointsProperties:{[key: string]: endPointProp} = {};
