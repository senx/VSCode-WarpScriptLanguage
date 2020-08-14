/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
/*
 *  Copyright 2020  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */
/* tslint:disable:no-console */
var Logger = /** @class */ (function () {
    function Logger(className, isDebug) {
        if (isDebug === void 0) { isDebug = false; }
        this.isDebug = false;
        this.className = className.name;
        this.isDebug = isDebug;
    }
    /**
     * @param {?} debug
     * @return {?}
     */
    Logger.prototype.setDebug = /**
     * @param {?} debug
     * @return {?}
     */
    function (debug) {
        this.isDebug = debug;
    };
    /**
     * @param {?} level
     * @param {?} methods
     * @param {?} args
     * @return {?}
     */
    Logger.prototype.log = /**
     * @param {?} level
     * @param {?} methods
     * @param {?} args
     * @return {?}
     */
    function (level, methods, args) {
        /** @type {?} */
        var logChain = [];
        logChain.push("[" + new Date().toISOString() + " - [" + this.className + "] " + methods.join(' - '));
        logChain = logChain.concat(args);
        switch (level) {
            case LEVEL.DEBUG: {
                if (this.isDebug) {
                    console.debug.apply(console, tslib_1.__spread(logChain));
                }
                break;
            }
            case LEVEL.ERROR: {
                console.error.apply(console, tslib_1.__spread(logChain));
                break;
            }
            case LEVEL.INFO: {
                console.log.apply(console, tslib_1.__spread(logChain));
                break;
            }
            case LEVEL.WARN: {
                console.warn.apply(console, tslib_1.__spread(logChain));
                break;
            }
            default: {
                if (this.isDebug) {
                    console.log.apply(console, tslib_1.__spread(logChain));
                }
            }
        }
    };
    /**
     * @param {?} methods
     * @param {...?} args
     * @return {?}
     */
    Logger.prototype.debug = /**
     * @param {?} methods
     * @param {...?} args
     * @return {?}
     */
    function (methods) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.log(LEVEL.DEBUG, methods, args);
    };
    /**
     * @param {?} methods
     * @param {...?} args
     * @return {?}
     */
    Logger.prototype.error = /**
     * @param {?} methods
     * @param {...?} args
     * @return {?}
     */
    function (methods) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.log(LEVEL.ERROR, methods, args);
    };
    /**
     * @param {?} methods
     * @param {...?} args
     * @return {?}
     */
    Logger.prototype.warn = /**
     * @param {?} methods
     * @param {...?} args
     * @return {?}
     */
    function (methods) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.log(LEVEL.WARN, methods, args);
    };
    /**
     * @param {?} methods
     * @param {...?} args
     * @return {?}
     */
    Logger.prototype.info = /**
     * @param {?} methods
     * @param {...?} args
     * @return {?}
     */
    function (methods) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.log(LEVEL.INFO, methods, args);
    };
    return Logger;
}());
export { Logger };
if (false) {
    /** @type {?} */
    Logger.prototype.className;
    /** @type {?} */
    Logger.prototype.isDebug;
}
/** @enum {number} */
var LEVEL = {
    DEBUG: 0, ERROR: 1, WARN: 2, INFO: 3,
};
export { LEVEL };
LEVEL[LEVEL.DEBUG] = 'DEBUG';
LEVEL[LEVEL.ERROR] = 'ERROR';
LEVEL[LEVEL.WARN] = 'WARN';
LEVEL[LEVEL.INFO] = 'INFO';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHNlbngvd2FycHZpZXcvIiwic291cmNlcyI6WyJzcmMvbGliL3V0aWxzL2xvZ2dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJBO0lBS0UsZ0JBQVksU0FBYyxFQUFFLE9BQXdCO1FBQXhCLHdCQUFBLEVBQUEsZUFBd0I7UUFGcEQsWUFBTyxHQUFHLEtBQUssQ0FBQztRQUdkLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQztRQUNoQyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUN6QixDQUFDOzs7OztJQUVELHlCQUFROzs7O0lBQVIsVUFBUyxLQUFjO1FBQ3JCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0lBQ3ZCLENBQUM7Ozs7Ozs7SUFFRCxvQkFBRzs7Ozs7O0lBQUgsVUFBSSxLQUFZLEVBQUUsT0FBYyxFQUFFLElBQVc7O1lBQ3ZDLFFBQVEsR0FBRyxFQUFFO1FBQ2pCLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBSSxJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxZQUFPLElBQUksQ0FBQyxTQUFTLFVBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUcsQ0FBQyxDQUFDO1FBQzNGLFFBQVEsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pDLFFBQVEsS0FBSyxFQUFFO1lBQ2IsS0FBSyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2hCLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtvQkFDaEIsT0FBTyxDQUFDLEtBQUssT0FBYixPQUFPLG1CQUFVLFFBQVEsR0FBRTtpQkFDNUI7Z0JBQ0QsTUFBTTthQUNQO1lBQ0QsS0FBSyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2hCLE9BQU8sQ0FBQyxLQUFLLE9BQWIsT0FBTyxtQkFBVSxRQUFRLEdBQUU7Z0JBQzNCLE1BQU07YUFDUDtZQUNELEtBQUssS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNmLE9BQU8sQ0FBQyxHQUFHLE9BQVgsT0FBTyxtQkFBUSxRQUFRLEdBQUU7Z0JBQ3pCLE1BQU07YUFDUDtZQUNELEtBQUssS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNmLE9BQU8sQ0FBQyxJQUFJLE9BQVosT0FBTyxtQkFBUyxRQUFRLEdBQUU7Z0JBQzFCLE1BQU07YUFDUDtZQUNELE9BQU8sQ0FBQyxDQUFDO2dCQUNQLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtvQkFDaEIsT0FBTyxDQUFDLEdBQUcsT0FBWCxPQUFPLG1CQUFRLFFBQVEsR0FBRTtpQkFDMUI7YUFDRjtTQUNGO0lBQ0gsQ0FBQzs7Ozs7O0lBRUQsc0JBQUs7Ozs7O0lBQUwsVUFBTSxPQUFjO1FBQUUsY0FBYzthQUFkLFVBQWMsRUFBZCxxQkFBYyxFQUFkLElBQWM7WUFBZCw2QkFBYzs7UUFDbEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN2QyxDQUFDOzs7Ozs7SUFFRCxzQkFBSzs7Ozs7SUFBTCxVQUFNLE9BQWM7UUFBRSxjQUFjO2FBQWQsVUFBYyxFQUFkLHFCQUFjLEVBQWQsSUFBYztZQUFkLDZCQUFjOztRQUNsQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7Ozs7OztJQUVELHFCQUFJOzs7OztJQUFKLFVBQUssT0FBYztRQUFFLGNBQWM7YUFBZCxVQUFjLEVBQWQscUJBQWMsRUFBZCxJQUFjO1lBQWQsNkJBQWM7O1FBQ2pDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDdEMsQ0FBQzs7Ozs7O0lBRUQscUJBQUk7Ozs7O0lBQUosVUFBSyxPQUFjO1FBQUUsY0FBYzthQUFkLFVBQWMsRUFBZCxxQkFBYyxFQUFkLElBQWM7WUFBZCw2QkFBYzs7UUFDakMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBQ0gsYUFBQztBQUFELENBQUMsQUE1REQsSUE0REM7Ozs7SUExREMsMkJBQWtCOztJQUNsQix5QkFBZ0I7Ozs7SUE0RGhCLFFBQUssRUFBRSxRQUFLLEVBQUUsT0FBSSxFQUFFLE9BQUkiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogIENvcHlyaWdodCAyMDIwICBTZW5YIFMuQS5TLlxuICpcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICovXG5cbi8qIHRzbGludDpkaXNhYmxlOm5vLWNvbnNvbGUgKi9cblxuZXhwb3J0IGNsYXNzIExvZ2dlciB7XG5cbiAgY2xhc3NOYW1lOiBzdHJpbmc7XG4gIGlzRGVidWcgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihjbGFzc05hbWU6IGFueSwgaXNEZWJ1ZzogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgdGhpcy5jbGFzc05hbWUgPSBjbGFzc05hbWUubmFtZTtcbiAgICB0aGlzLmlzRGVidWcgPSBpc0RlYnVnO1xuICB9XG5cbiAgc2V0RGVidWcoZGVidWc6IGJvb2xlYW4pIHtcbiAgICB0aGlzLmlzRGVidWcgPSBkZWJ1ZztcbiAgfVxuXG4gIGxvZyhsZXZlbDogTEVWRUwsIG1ldGhvZHM6IGFueVtdLCBhcmdzOiBhbnlbXSkge1xuICAgIGxldCBsb2dDaGFpbiA9IFtdO1xuICAgIGxvZ0NoYWluLnB1c2goYFske25ldyBEYXRlKCkudG9JU09TdHJpbmcoKX0gLSBbJHt0aGlzLmNsYXNzTmFtZX1dICR7bWV0aG9kcy5qb2luKCcgLSAnKX1gKTtcbiAgICBsb2dDaGFpbiA9IGxvZ0NoYWluLmNvbmNhdChhcmdzKTtcbiAgICBzd2l0Y2ggKGxldmVsKSB7XG4gICAgICBjYXNlIExFVkVMLkRFQlVHOiB7XG4gICAgICAgIGlmICh0aGlzLmlzRGVidWcpIHtcbiAgICAgICAgICBjb25zb2xlLmRlYnVnKC4uLmxvZ0NoYWluKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgTEVWRUwuRVJST1I6IHtcbiAgICAgICAgY29uc29sZS5lcnJvciguLi5sb2dDaGFpbik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBMRVZFTC5JTkZPOiB7XG4gICAgICAgIGNvbnNvbGUubG9nKC4uLmxvZ0NoYWluKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIExFVkVMLldBUk46IHtcbiAgICAgICAgY29uc29sZS53YXJuKC4uLmxvZ0NoYWluKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OiB7XG4gICAgICAgIGlmICh0aGlzLmlzRGVidWcpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyguLi5sb2dDaGFpbik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkZWJ1ZyhtZXRob2RzOiBhbnlbXSwgLi4uYXJnczogYW55W10pIHtcbiAgICB0aGlzLmxvZyhMRVZFTC5ERUJVRywgbWV0aG9kcywgYXJncyk7XG4gIH1cblxuICBlcnJvcihtZXRob2RzOiBhbnlbXSwgLi4uYXJnczogYW55W10pIHtcbiAgICB0aGlzLmxvZyhMRVZFTC5FUlJPUiwgbWV0aG9kcywgYXJncyk7XG4gIH1cblxuICB3YXJuKG1ldGhvZHM6IGFueVtdLCAuLi5hcmdzOiBhbnlbXSkge1xuICAgIHRoaXMubG9nKExFVkVMLldBUk4sIG1ldGhvZHMsIGFyZ3MpO1xuICB9XG5cbiAgaW5mbyhtZXRob2RzOiBhbnlbXSwgLi4uYXJnczogYW55W10pIHtcbiAgICB0aGlzLmxvZyhMRVZFTC5JTkZPLCBtZXRob2RzLCBhcmdzKTtcbiAgfVxufVxuXG5leHBvcnQgZW51bSBMRVZFTCB7XG4gIERFQlVHLCBFUlJPUiwgV0FSTiwgSU5GT1xufVxuIl19