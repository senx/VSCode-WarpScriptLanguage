/**
 * Put here every reusable methods of the project
 */

import { tmpdir } from "os";

export default class WarpScriptExtConstants {

  /**
   * This regexp identifies the output files of the WarpScript execution
   */
  public jsonResultRegEx: RegExp = new RegExp(tmpdir().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '[\/\\\\]' + '\\d{3}([nmu])([XGI]?)\\.json', 'gi');

}
