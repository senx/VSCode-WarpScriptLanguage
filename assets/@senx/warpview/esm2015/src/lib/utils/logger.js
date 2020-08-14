/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
export class Logger {
    /**
     * @param {?} className
     * @param {?=} isDebug
     */
    constructor(className, isDebug = false) {
        this.isDebug = false;
        this.className = className.name;
        this.isDebug = isDebug;
    }
    /**
     * @param {?} debug
     * @return {?}
     */
    setDebug(debug) {
        this.isDebug = debug;
    }
    /**
     * @param {?} level
     * @param {?} methods
     * @param {?} args
     * @return {?}
     */
    log(level, methods, args) {
        /** @type {?} */
        let logChain = [];
        logChain.push(`[${new Date().toISOString()} - [${this.className}] ${methods.join(' - ')}`);
        logChain = logChain.concat(args);
        switch (level) {
            case LEVEL.DEBUG: {
                if (this.isDebug) {
                    console.debug(...logChain);
                }
                break;
            }
            case LEVEL.ERROR: {
                console.error(...logChain);
                break;
            }
            case LEVEL.INFO: {
                console.log(...logChain);
                break;
            }
            case LEVEL.WARN: {
                console.warn(...logChain);
                break;
            }
            default: {
                if (this.isDebug) {
                    console.log(...logChain);
                }
            }
        }
    }
    /**
     * @param {?} methods
     * @param {...?} args
     * @return {?}
     */
    debug(methods, ...args) {
        this.log(LEVEL.DEBUG, methods, args);
    }
    /**
     * @param {?} methods
     * @param {...?} args
     * @return {?}
     */
    error(methods, ...args) {
        this.log(LEVEL.ERROR, methods, args);
    }
    /**
     * @param {?} methods
     * @param {...?} args
     * @return {?}
     */
    warn(methods, ...args) {
        this.log(LEVEL.WARN, methods, args);
    }
    /**
     * @param {?} methods
     * @param {...?} args
     * @return {?}
     */
    info(methods, ...args) {
        this.log(LEVEL.INFO, methods, args);
    }
}
if (false) {
    /** @type {?} */
    Logger.prototype.className;
    /** @type {?} */
    Logger.prototype.isDebug;
}
/** @enum {number} */
const LEVEL = {
    DEBUG: 0, ERROR: 1, WARN: 2, INFO: 3,
};
export { LEVEL };
LEVEL[LEVEL.DEBUG] = 'DEBUG';
LEVEL[LEVEL.ERROR] = 'ERROR';
LEVEL[LEVEL.WARN] = 'WARN';
LEVEL[LEVEL.INFO] = 'INFO';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHNlbngvd2FycHZpZXcvIiwic291cmNlcyI6WyJzcmMvbGliL3V0aWxzL2xvZ2dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQkEsTUFBTSxPQUFPLE1BQU07Ozs7O0lBS2pCLFlBQVksU0FBYyxFQUFFLFVBQW1CLEtBQUs7UUFGcEQsWUFBTyxHQUFHLEtBQUssQ0FBQztRQUdkLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQztRQUNoQyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUN6QixDQUFDOzs7OztJQUVELFFBQVEsQ0FBQyxLQUFjO1FBQ3JCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0lBQ3ZCLENBQUM7Ozs7Ozs7SUFFRCxHQUFHLENBQUMsS0FBWSxFQUFFLE9BQWMsRUFBRSxJQUFXOztZQUN2QyxRQUFRLEdBQUcsRUFBRTtRQUNqQixRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUUsT0FBTyxJQUFJLENBQUMsU0FBUyxLQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzNGLFFBQVEsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pDLFFBQVEsS0FBSyxFQUFFO1lBQ2IsS0FBSyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2hCLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtvQkFDaEIsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDO2lCQUM1QjtnQkFDRCxNQUFNO2FBQ1A7WUFDRCxLQUFLLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDaEIsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDO2dCQUMzQixNQUFNO2FBQ1A7WUFDRCxLQUFLLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDZixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUM7Z0JBQ3pCLE1BQU07YUFDUDtZQUNELEtBQUssS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNmLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQztnQkFDMUIsTUFBTTthQUNQO1lBQ0QsT0FBTyxDQUFDLENBQUM7Z0JBQ1AsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO29CQUNoQixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUM7aUJBQzFCO2FBQ0Y7U0FDRjtJQUNILENBQUM7Ozs7OztJQUVELEtBQUssQ0FBQyxPQUFjLEVBQUUsR0FBRyxJQUFXO1FBQ2xDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDdkMsQ0FBQzs7Ozs7O0lBRUQsS0FBSyxDQUFDLE9BQWMsRUFBRSxHQUFHLElBQVc7UUFDbEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN2QyxDQUFDOzs7Ozs7SUFFRCxJQUFJLENBQUMsT0FBYyxFQUFFLEdBQUcsSUFBVztRQUNqQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3RDLENBQUM7Ozs7OztJQUVELElBQUksQ0FBQyxPQUFjLEVBQUUsR0FBRyxJQUFXO1FBQ2pDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDdEMsQ0FBQztDQUNGOzs7SUExREMsMkJBQWtCOztJQUNsQix5QkFBZ0I7Ozs7SUE0RGhCLFFBQUssRUFBRSxRQUFLLEVBQUUsT0FBSSxFQUFFLE9BQUkiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogIENvcHlyaWdodCAyMDIwICBTZW5YIFMuQS5TLlxuICpcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICovXG5cbi8qIHRzbGludDpkaXNhYmxlOm5vLWNvbnNvbGUgKi9cblxuZXhwb3J0IGNsYXNzIExvZ2dlciB7XG5cbiAgY2xhc3NOYW1lOiBzdHJpbmc7XG4gIGlzRGVidWcgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihjbGFzc05hbWU6IGFueSwgaXNEZWJ1ZzogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgdGhpcy5jbGFzc05hbWUgPSBjbGFzc05hbWUubmFtZTtcbiAgICB0aGlzLmlzRGVidWcgPSBpc0RlYnVnO1xuICB9XG5cbiAgc2V0RGVidWcoZGVidWc6IGJvb2xlYW4pIHtcbiAgICB0aGlzLmlzRGVidWcgPSBkZWJ1ZztcbiAgfVxuXG4gIGxvZyhsZXZlbDogTEVWRUwsIG1ldGhvZHM6IGFueVtdLCBhcmdzOiBhbnlbXSkge1xuICAgIGxldCBsb2dDaGFpbiA9IFtdO1xuICAgIGxvZ0NoYWluLnB1c2goYFske25ldyBEYXRlKCkudG9JU09TdHJpbmcoKX0gLSBbJHt0aGlzLmNsYXNzTmFtZX1dICR7bWV0aG9kcy5qb2luKCcgLSAnKX1gKTtcbiAgICBsb2dDaGFpbiA9IGxvZ0NoYWluLmNvbmNhdChhcmdzKTtcbiAgICBzd2l0Y2ggKGxldmVsKSB7XG4gICAgICBjYXNlIExFVkVMLkRFQlVHOiB7XG4gICAgICAgIGlmICh0aGlzLmlzRGVidWcpIHtcbiAgICAgICAgICBjb25zb2xlLmRlYnVnKC4uLmxvZ0NoYWluKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgTEVWRUwuRVJST1I6IHtcbiAgICAgICAgY29uc29sZS5lcnJvciguLi5sb2dDaGFpbik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBMRVZFTC5JTkZPOiB7XG4gICAgICAgIGNvbnNvbGUubG9nKC4uLmxvZ0NoYWluKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIExFVkVMLldBUk46IHtcbiAgICAgICAgY29uc29sZS53YXJuKC4uLmxvZ0NoYWluKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OiB7XG4gICAgICAgIGlmICh0aGlzLmlzRGVidWcpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyguLi5sb2dDaGFpbik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkZWJ1ZyhtZXRob2RzOiBhbnlbXSwgLi4uYXJnczogYW55W10pIHtcbiAgICB0aGlzLmxvZyhMRVZFTC5ERUJVRywgbWV0aG9kcywgYXJncyk7XG4gIH1cblxuICBlcnJvcihtZXRob2RzOiBhbnlbXSwgLi4uYXJnczogYW55W10pIHtcbiAgICB0aGlzLmxvZyhMRVZFTC5FUlJPUiwgbWV0aG9kcywgYXJncyk7XG4gIH1cblxuICB3YXJuKG1ldGhvZHM6IGFueVtdLCAuLi5hcmdzOiBhbnlbXSkge1xuICAgIHRoaXMubG9nKExFVkVMLldBUk4sIG1ldGhvZHMsIGFyZ3MpO1xuICB9XG5cbiAgaW5mbyhtZXRob2RzOiBhbnlbXSwgLi4uYXJnczogYW55W10pIHtcbiAgICB0aGlzLmxvZyhMRVZFTC5JTkZPLCBtZXRob2RzLCBhcmdzKTtcbiAgfVxufVxuXG5leHBvcnQgZW51bSBMRVZFTCB7XG4gIERFQlVHLCBFUlJPUiwgV0FSTiwgSU5GT1xufVxuIl19