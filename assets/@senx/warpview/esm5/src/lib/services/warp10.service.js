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
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { HttpErrorHandler } from './http-error-handler.service';
import { Logger } from '../utils/logger';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "./http-error-handler.service";
var Warp10Service = /** @class */ (function () {
    function Warp10Service(http, httpErrorHandler) {
        this.http = http;
        this.httpErrorHandler = httpErrorHandler;
        this.LOG = new Logger(Warp10Service, true);
        this.handleError = httpErrorHandler.createHandleError('Warp10Service');
    }
    /**
     * @param {?} warpScript
     * @param {?} url
     * @return {?}
     */
    Warp10Service.prototype.exec = /**
     * @param {?} warpScript
     * @param {?} url
     * @return {?}
     */
    function (warpScript, url) {
        var _this = this;
        this.LOG.debug(['exec', 'warpScript'], url, warpScript);
        return this.http.post(url, warpScript, {
            // @ts-ignore
            observe: 'response',
            // @ts-ignore
            responseType: 'text'
        })
            .pipe(tap((/**
         * @param {?} r
         * @return {?}
         */
        function (r) { return _this.LOG.debug(['exec', 'result'], r); })), catchError(this.handleError('exec')));
    };
    Warp10Service.decorators = [
        { type: Injectable, args: [{ providedIn: 'root' },] }
    ];
    /** @nocollapse */
    Warp10Service.ctorParameters = function () { return [
        { type: HttpClient },
        { type: HttpErrorHandler }
    ]; };
    /** @nocollapse */ Warp10Service.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function Warp10Service_Factory() { return new Warp10Service(i0.ɵɵinject(i1.HttpClient), i0.ɵɵinject(i2.HttpErrorHandler)); }, token: Warp10Service, providedIn: "root" });
    return Warp10Service;
}());
export { Warp10Service };
if (false) {
    /**
     * @type {?}
     * @private
     */
    Warp10Service.prototype.LOG;
    /**
     * @type {?}
     * @private
     */
    Warp10Service.prototype.handleError;
    /**
     * @type {?}
     * @private
     */
    Warp10Service.prototype.http;
    /**
     * @type {?}
     * @private
     */
    Warp10Service.prototype.httpErrorHandler;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycDEwLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VueC93YXJwdmlldy8iLCJzb3VyY2VzIjpbInNyYy9saWIvc2VydmljZXMvd2FycDEwLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUFDLFVBQVUsRUFBZSxNQUFNLHNCQUFzQixDQUFDO0FBQzlELE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUMvQyxPQUFPLEVBQWMsZ0JBQWdCLEVBQUMsTUFBTSw4QkFBOEIsQ0FBQztBQUMzRSxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0saUJBQWlCLENBQUM7Ozs7QUFHdkM7SUFNRSx1QkFDVSxJQUFnQixFQUNoQixnQkFBa0M7UUFEbEMsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUNoQixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQzFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxNQUFNLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxXQUFXLEdBQUcsZ0JBQWdCLENBQUMsaUJBQWlCLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDekUsQ0FBQzs7Ozs7O0lBRUQsNEJBQUk7Ozs7O0lBQUosVUFBSyxVQUFrQixFQUFFLEdBQVc7UUFBcEMsaUJBWUM7UUFYQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUMsRUFBRSxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDeEQsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBUyxHQUFHLEVBQUUsVUFBVSxFQUFFOztZQUU3QyxPQUFPLEVBQUUsVUFBVTs7WUFFbkIsWUFBWSxFQUFFLE1BQU07U0FDckIsQ0FBQzthQUNDLElBQUksQ0FDSCxHQUFHOzs7O1FBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxLQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBckMsQ0FBcUMsRUFBQyxFQUMvQyxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUNyQyxDQUFDO0lBQ04sQ0FBQzs7Z0JBekJGLFVBQVUsU0FBQyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUM7Ozs7Z0JBUHhCLFVBQVU7Z0JBR0csZ0JBQWdCOzs7d0JBcEJyQztDQWtEQyxBQTFCRCxJQTBCQztTQXpCWSxhQUFhOzs7Ozs7SUFFeEIsNEJBQW9COzs7OztJQUNwQixvQ0FBMEM7Ozs7O0lBR3hDLDZCQUF3Qjs7Ozs7SUFDeEIseUNBQTBDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqICBDb3B5cmlnaHQgMjAyMCAgU2VuWCBTLkEuUy5cbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqL1xuXG5pbXBvcnQge0h0dHBDbGllbnQsIEh0dHBSZXNwb25zZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Y2F0Y2hFcnJvciwgdGFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge0hhbmRsZUVycm9yLCBIdHRwRXJyb3JIYW5kbGVyfSBmcm9tICcuL2h0dHAtZXJyb3ItaGFuZGxlci5zZXJ2aWNlJztcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICcuLi91dGlscy9sb2dnZXInO1xuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcblxuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgV2FycDEwU2VydmljZSB7XG5cbiAgcHJpdmF0ZSBMT0c6IExvZ2dlcjtcbiAgcHJpdmF0ZSByZWFkb25seSBoYW5kbGVFcnJvcjogSGFuZGxlRXJyb3I7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LFxuICAgIHByaXZhdGUgaHR0cEVycm9ySGFuZGxlcjogSHR0cEVycm9ySGFuZGxlcikge1xuICAgIHRoaXMuTE9HID0gbmV3IExvZ2dlcihXYXJwMTBTZXJ2aWNlLCB0cnVlKTtcbiAgICB0aGlzLmhhbmRsZUVycm9yID0gaHR0cEVycm9ySGFuZGxlci5jcmVhdGVIYW5kbGVFcnJvcignV2FycDEwU2VydmljZScpO1xuICB9XG5cbiAgZXhlYyh3YXJwU2NyaXB0OiBzdHJpbmcsIHVybDogc3RyaW5nKTogT2JzZXJ2YWJsZTxIdHRwUmVzcG9uc2U8c3RyaW5nPj4ge1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZXhlYycsICd3YXJwU2NyaXB0J10sIHVybCwgd2FycFNjcmlwdCk7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0PHN0cmluZz4odXJsLCB3YXJwU2NyaXB0LCB7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBvYnNlcnZlOiAncmVzcG9uc2UnLFxuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgcmVzcG9uc2VUeXBlOiAndGV4dCdcbiAgICB9KVxuICAgICAgLnBpcGUoXG4gICAgICAgIHRhcChyID0+IHRoaXMuTE9HLmRlYnVnKFsnZXhlYycsICdyZXN1bHQnXSwgcikpLFxuICAgICAgICBjYXRjaEVycm9yKHRoaXMuaGFuZGxlRXJyb3IoJ2V4ZWMnKSlcbiAgICAgICk7XG4gIH1cbn1cbiJdfQ==