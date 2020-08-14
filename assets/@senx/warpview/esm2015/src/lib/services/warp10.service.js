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
export class Warp10Service {
    /**
     * @param {?} http
     * @param {?} httpErrorHandler
     */
    constructor(http, httpErrorHandler) {
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
    exec(warpScript, url) {
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
        r => this.LOG.debug(['exec', 'result'], r))), catchError(this.handleError('exec')));
    }
}
Warp10Service.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
/** @nocollapse */
Warp10Service.ctorParameters = () => [
    { type: HttpClient },
    { type: HttpErrorHandler }
];
/** @nocollapse */ Warp10Service.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function Warp10Service_Factory() { return new Warp10Service(i0.ɵɵinject(i1.HttpClient), i0.ɵɵinject(i2.HttpErrorHandler)); }, token: Warp10Service, providedIn: "root" });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycDEwLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VueC93YXJwdmlldy8iLCJzb3VyY2VzIjpbInNyYy9saWIvc2VydmljZXMvd2FycDEwLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUFDLFVBQVUsRUFBZSxNQUFNLHNCQUFzQixDQUFDO0FBQzlELE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUMvQyxPQUFPLEVBQWMsZ0JBQWdCLEVBQUMsTUFBTSw4QkFBOEIsQ0FBQztBQUMzRSxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0saUJBQWlCLENBQUM7Ozs7QUFJdkMsTUFBTSxPQUFPLGFBQWE7Ozs7O0lBS3hCLFlBQ1UsSUFBZ0IsRUFDaEIsZ0JBQWtDO1FBRGxDLFNBQUksR0FBSixJQUFJLENBQVk7UUFDaEIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUMxQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksTUFBTSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsV0FBVyxHQUFHLGdCQUFnQixDQUFDLGlCQUFpQixDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7Ozs7OztJQUVELElBQUksQ0FBQyxVQUFrQixFQUFFLEdBQVc7UUFDbEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDLEVBQUUsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3hELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQVMsR0FBRyxFQUFFLFVBQVUsRUFBRTs7WUFFN0MsT0FBTyxFQUFFLFVBQVU7O1lBRW5CLFlBQVksRUFBRSxNQUFNO1NBQ3JCLENBQUM7YUFDQyxJQUFJLENBQ0gsR0FBRzs7OztRQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUMsRUFDL0MsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FDckMsQ0FBQztJQUNOLENBQUM7OztZQXpCRixVQUFVLFNBQUMsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDOzs7O1lBUHhCLFVBQVU7WUFHRyxnQkFBZ0I7Ozs7Ozs7O0lBT25DLDRCQUFvQjs7Ozs7SUFDcEIsb0NBQTBDOzs7OztJQUd4Qyw2QkFBd0I7Ozs7O0lBQ3hCLHlDQUEwQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQ29weXJpZ2h0IDIwMjAgIFNlblggUy5BLlMuXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKi9cblxuaW1wb3J0IHtIdHRwQ2xpZW50LCBIdHRwUmVzcG9uc2V9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2NhdGNoRXJyb3IsIHRhcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtIYW5kbGVFcnJvciwgSHR0cEVycm9ySGFuZGxlcn0gZnJvbSAnLi9odHRwLWVycm9yLWhhbmRsZXIuc2VydmljZSc7XG5pbXBvcnQge0xvZ2dlcn0gZnJvbSAnLi4vdXRpbHMvbG9nZ2VyJztcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIFdhcnAxMFNlcnZpY2Uge1xuXG4gIHByaXZhdGUgTE9HOiBMb2dnZXI7XG4gIHByaXZhdGUgcmVhZG9ubHkgaGFuZGxlRXJyb3I6IEhhbmRsZUVycm9yO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCxcbiAgICBwcml2YXRlIGh0dHBFcnJvckhhbmRsZXI6IEh0dHBFcnJvckhhbmRsZXIpIHtcbiAgICB0aGlzLkxPRyA9IG5ldyBMb2dnZXIoV2FycDEwU2VydmljZSwgdHJ1ZSk7XG4gICAgdGhpcy5oYW5kbGVFcnJvciA9IGh0dHBFcnJvckhhbmRsZXIuY3JlYXRlSGFuZGxlRXJyb3IoJ1dhcnAxMFNlcnZpY2UnKTtcbiAgfVxuXG4gIGV4ZWMod2FycFNjcmlwdDogc3RyaW5nLCB1cmw6IHN0cmluZyk6IE9ic2VydmFibGU8SHR0cFJlc3BvbnNlPHN0cmluZz4+IHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2V4ZWMnLCAnd2FycFNjcmlwdCddLCB1cmwsIHdhcnBTY3JpcHQpO1xuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdDxzdHJpbmc+KHVybCwgd2FycFNjcmlwdCwge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgb2JzZXJ2ZTogJ3Jlc3BvbnNlJyxcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHJlc3BvbnNlVHlwZTogJ3RleHQnXG4gICAgfSlcbiAgICAgIC5waXBlKFxuICAgICAgICB0YXAociA9PiB0aGlzLkxPRy5kZWJ1ZyhbJ2V4ZWMnLCAncmVzdWx0J10sIHIpKSxcbiAgICAgICAgY2F0Y2hFcnJvcih0aGlzLmhhbmRsZUVycm9yKCdleGVjJykpXG4gICAgICApO1xuICB9XG59XG4iXX0=