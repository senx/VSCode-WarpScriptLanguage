/**
 * Put here every reusable methods of the project
 */

import os = require('os');


export default class WarpScriptExtConstants {

  /**
   * This regexp identifies the output files of the WarpScript execution
   */
  public jsonResultRegEx: RegExp = new RegExp(os.tmpdir().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '[\/\\\\]' + '\\d{3}([nmu])([XGI]?)\\.json', 'gi');

}
