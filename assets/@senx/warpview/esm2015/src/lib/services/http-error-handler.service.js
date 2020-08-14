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
import { Injectable } from '@angular/core';
import { of } from 'rxjs/internal/observable/of';
import { Logger } from '../utils/logger';
// noinspection UnterminatedStatementJS
/**
 * Handles HttpClient errors
 */
export class HttpErrorHandler {
    /**
     *
     */
    constructor() {
        this.createHandleError = (/**
         * @param {?=} serviceName
         * @return {?}
         */
        (serviceName = '') => (
        // tslint:disable-next-line:semicolon
        /**
         * @param {?=} operation
         * @return {?}
         */
        (operation = 'operation') => this.handleError(serviceName, operation)));
        this.LOG = new Logger(HttpErrorHandler, true);
    }
    /**
     * @param {?=} serviceName
     * @param {?=} operation
     * @return {?}
     */
    handleError(serviceName = '', operation = 'operation') {
        return (/**
         * @param {?} error
         * @return {?}
         */
        (error) => {
            this.LOG.error([serviceName], error);
            this.LOG.error([serviceName], `${operation} failed: ${error.statusText}`);
            /** @type {?} */
            const message = ((error.error || {}).message)
                ? error.error.message
                : error.status ? error.statusText : 'Server error';
            this.LOG.error([serviceName], message);
            return of(message);
        });
    }
}
HttpErrorHandler.decorators = [
    { type: Injectable }
];
/** @nocollapse */
HttpErrorHandler.ctorParameters = () => [];
if (false) {
    /**
     * @type {?}
     * @private
     */
    HttpErrorHandler.prototype.LOG;
    /** @type {?} */
    HttpErrorHandler.prototype.createHandleError;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC1lcnJvci1oYW5kbGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VueC93YXJwdmlldy8iLCJzb3VyY2VzIjpbInNyYy9saWIvc2VydmljZXMvaHR0cC1lcnJvci1oYW5kbGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUl6QyxPQUFPLEVBQUMsRUFBRSxFQUFDLE1BQU0sNkJBQTZCLENBQUM7QUFDL0MsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLGlCQUFpQixDQUFDOzs7OztBQVN2QyxNQUFNLE9BQU8sZ0JBQWdCOzs7O0lBSzNCO1FBSUEsc0JBQWlCOzs7O1FBQUcsQ0FBQyxXQUFXLEdBQUcsRUFBRSxFQUFFLEVBQUU7Ozs7OztRQUV2QyxDQUFDLFNBQVMsR0FBRyxXQUFXLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFBLEVBQUM7UUFMdEUsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNoRCxDQUFDOzs7Ozs7SUFNRCxXQUFXLENBQUMsV0FBVyxHQUFHLEVBQUUsRUFBRSxTQUFTLEdBQUcsV0FBVztRQUNuRDs7OztRQUFPLENBQUMsS0FBd0IsRUFBc0IsRUFBRTtZQUN0RCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3JDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVyxDQUFDLEVBQUUsR0FBRyxTQUFTLFlBQVksS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7O2tCQUNwRSxPQUFPLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUMzQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPO2dCQUNyQixDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsY0FBYztZQUNwRCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ3ZDLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3JCLENBQUMsRUFBQztJQUNKLENBQUM7OztZQXhCRixVQUFVOzs7Ozs7Ozs7SUFFVCwrQkFBb0I7O0lBUXBCLDZDQUV3RSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQ29weXJpZ2h0IDIwMjAgIFNlblggUy5BLlMuXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7SHR0cEVycm9yUmVzcG9uc2V9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcblxuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzL2ludGVybmFsL09ic2VydmFibGUnO1xuaW1wb3J0IHtvZn0gZnJvbSAncnhqcy9pbnRlcm5hbC9vYnNlcnZhYmxlL29mJztcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICcuLi91dGlscy9sb2dnZXInO1xuXG5cbi8qKiBUeXBlIG9mIHRoZSBoYW5kbGVFcnJvciBmdW5jdGlvbiByZXR1cm5lZCBieSBIdHRwRXJyb3JIYW5kbGVyLmNyZWF0ZUhhbmRsZUVycm9yICovXG5leHBvcnQgdHlwZSBIYW5kbGVFcnJvciA9IChvcGVyYXRpb24/OiBzdHJpbmcpID0+IChlcnJvcjogSHR0cEVycm9yUmVzcG9uc2UpID0+IE9ic2VydmFibGU8c3RyaW5nPjtcblxuLy8gbm9pbnNwZWN0aW9uIFVudGVybWluYXRlZFN0YXRlbWVudEpTXG4vKiogSGFuZGxlcyBIdHRwQ2xpZW50IGVycm9ycyAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEh0dHBFcnJvckhhbmRsZXIge1xuICBwcml2YXRlIExPRzogTG9nZ2VyO1xuXG4gIC8qKlxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5MT0cgPSBuZXcgTG9nZ2VyKEh0dHBFcnJvckhhbmRsZXIsIHRydWUpO1xuICB9XG5cbiAgY3JlYXRlSGFuZGxlRXJyb3IgPSAoc2VydmljZU5hbWUgPSAnJykgPT5cbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6c2VtaWNvbG9uXG4gICAgKG9wZXJhdGlvbiA9ICdvcGVyYXRpb24nKSA9PiB0aGlzLmhhbmRsZUVycm9yKHNlcnZpY2VOYW1lLCBvcGVyYXRpb24pO1xuXG4gIGhhbmRsZUVycm9yKHNlcnZpY2VOYW1lID0gJycsIG9wZXJhdGlvbiA9ICdvcGVyYXRpb24nKSB7XG4gICAgcmV0dXJuIChlcnJvcjogSHR0cEVycm9yUmVzcG9uc2UpOiBPYnNlcnZhYmxlPHN0cmluZz4gPT4ge1xuICAgICAgdGhpcy5MT0cuZXJyb3IoW3NlcnZpY2VOYW1lXSwgZXJyb3IpO1xuICAgICAgdGhpcy5MT0cuZXJyb3IoW3NlcnZpY2VOYW1lXSwgYCR7b3BlcmF0aW9ufSBmYWlsZWQ6ICR7ZXJyb3Iuc3RhdHVzVGV4dH1gKTtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSAoKGVycm9yLmVycm9yIHx8IHt9KS5tZXNzYWdlKVxuICAgICAgICA/IGVycm9yLmVycm9yLm1lc3NhZ2VcbiAgICAgICAgOiBlcnJvci5zdGF0dXMgPyBlcnJvci5zdGF0dXNUZXh0IDogJ1NlcnZlciBlcnJvcic7XG4gICAgICB0aGlzLkxPRy5lcnJvcihbc2VydmljZU5hbWVdLCBtZXNzYWdlKTtcbiAgICAgIHJldHVybiBvZihtZXNzYWdlKTtcbiAgICB9O1xuICB9XG59XG4iXX0=