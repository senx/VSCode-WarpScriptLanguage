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
export class Param {
    constructor() {
        this.scheme = 'WARP10';
        this.horizontal = false;
        this.stacked = false;
        this.showControls = true;
        this.showErrors = true;
        this.showStatus = true;
        this.showDots = false;
        this.timeUnit = 'us';
        this.timeZone = 'UTC';
        this.map = {
            tiles: [],
            showTimeSlider: false,
            showTimeRange: false,
            timeSliderMode: 'timestamp'
        };
        this.bounds = {};
    }
}
if (false) {
    /** @type {?} */
    Param.prototype.scheme;
    /** @type {?} */
    Param.prototype.bgColor;
    /** @type {?} */
    Param.prototype.datasetColor;
    /** @type {?} */
    Param.prototype.fontColor;
    /** @type {?} */
    Param.prototype.borderColor;
    /** @type {?} */
    Param.prototype.gridLineColor;
    /** @type {?} */
    Param.prototype.showLegend;
    /** @type {?} */
    Param.prototype.responsive;
    /** @type {?} */
    Param.prototype.horizontal;
    /** @type {?} */
    Param.prototype.stacked;
    /** @type {?} */
    Param.prototype.key;
    /** @type {?} */
    Param.prototype.unit;
    /** @type {?} */
    Param.prototype.interpolate;
    /** @type {?} */
    Param.prototype.type;
    /** @type {?} */
    Param.prototype.showRangeSelector;
    /** @type {?} */
    Param.prototype.autoRefresh;
    /** @type {?} */
    Param.prototype.showControls;
    /** @type {?} */
    Param.prototype.showErrors;
    /** @type {?} */
    Param.prototype.showStatus;
    /** @type {?} */
    Param.prototype.showGTSTree;
    /** @type {?} */
    Param.prototype.foldGTSTree;
    /** @type {?} */
    Param.prototype.timeMode;
    /** @type {?} */
    Param.prototype.showDots;
    /** @type {?} */
    Param.prototype.delta;
    /** @type {?} */
    Param.prototype.timeUnit;
    /** @type {?} */
    Param.prototype.minColor;
    /** @type {?} */
    Param.prototype.maxColor;
    /** @type {?} */
    Param.prototype.split;
    /** @type {?} */
    Param.prototype.popupButtonValidateClass;
    /** @type {?} */
    Param.prototype.popupButtonValidateLabel;
    /** @type {?} */
    Param.prototype.timeZone;
    /** @type {?} */
    Param.prototype.properties;
    /** @type {?} */
    Param.prototype.map;
    /** @type {?} */
    Param.prototype.bounds;
    /** @type {?} */
    Param.prototype.histo;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyYW0uanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VueC93YXJwdmlldy8iLCJzb3VyY2VzIjpbInNyYy9saWIvbW9kZWwvcGFyYW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQkEsTUFBTSxPQUFPLEtBQUs7SUFBbEI7UUFDRSxXQUFNLEdBQUcsUUFBUSxDQUFDO1FBUWxCLGVBQVUsR0FBRyxLQUFLLENBQUM7UUFDbkIsWUFBTyxHQUFHLEtBQUssQ0FBQztRQU9oQixpQkFBWSxHQUFHLElBQUksQ0FBQztRQUNwQixlQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLGVBQVUsR0FBRyxJQUFJLENBQUM7UUFJbEIsYUFBUSxHQUFHLEtBQUssQ0FBQztRQUVqQixhQUFRLEdBQXVCLElBQUksQ0FBQztRQU1wQyxhQUFRLEdBQUcsS0FBSyxDQUFDO1FBRWpCLFFBQUcsR0FvQkM7WUFDRixLQUFLLEVBQUUsRUFBRTtZQUNULGNBQWMsRUFBRSxLQUFLO1lBQ3JCLGFBQWEsRUFBRSxLQUFLO1lBQ3BCLGNBQWMsRUFBRSxXQUFXO1NBQzVCLENBQUM7UUFDRixXQUFNLEdBSUYsRUFBRSxDQUFDO0lBS1QsQ0FBQztDQUFBOzs7SUFuRUMsdUJBQWtCOztJQUNsQix3QkFBaUI7O0lBQ2pCLDZCQUFzQjs7SUFDdEIsMEJBQW1COztJQUNuQiw0QkFBcUI7O0lBQ3JCLDhCQUF1Qjs7SUFDdkIsMkJBQXFCOztJQUNyQiwyQkFBcUI7O0lBQ3JCLDJCQUFtQjs7SUFDbkIsd0JBQWdCOztJQUNoQixvQkFBYTs7SUFDYixxQkFBYzs7SUFDZCw0QkFBcUI7O0lBQ3JCLHFCQUFjOztJQUNkLGtDQUE0Qjs7SUFDNUIsNEJBQXFCOztJQUNyQiw2QkFBb0I7O0lBQ3BCLDJCQUFrQjs7SUFDbEIsMkJBQWtCOztJQUNsQiw0QkFBc0I7O0lBQ3RCLDRCQUFzQjs7SUFDdEIseUJBQXdEOztJQUN4RCx5QkFBaUI7O0lBQ2pCLHNCQUFlOztJQUNmLHlCQUFvQzs7SUFDcEMseUJBQWtCOztJQUNsQix5QkFBa0I7O0lBQ2xCLHNCQUEwQzs7SUFDMUMseUNBQWtDOztJQUNsQyx5Q0FBa0M7O0lBQ2xDLHlCQUFpQjs7SUFDakIsMkJBQWlCOztJQUNqQixvQkF5QkU7O0lBQ0YsdUJBSU87O0lBQ1Asc0JBR0UiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogIENvcHlyaWdodCAyMDIwICBTZW5YIFMuQS5TLlxuICpcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICovXG5leHBvcnQgY2xhc3MgUGFyYW0ge1xuICBzY2hlbWUgPSAnV0FSUDEwJztcbiAgYmdDb2xvcj86IHN0cmluZztcbiAgZGF0YXNldENvbG9yPzogc3RyaW5nO1xuICBmb250Q29sb3I/OiBzdHJpbmc7XG4gIGJvcmRlckNvbG9yPzogc3RyaW5nO1xuICBncmlkTGluZUNvbG9yPzogc3RyaW5nO1xuICBzaG93TGVnZW5kPzogYm9vbGVhbjtcbiAgcmVzcG9uc2l2ZT86IGJvb2xlYW47XG4gIGhvcml6b250YWwgPSBmYWxzZTtcbiAgc3RhY2tlZCA9IGZhbHNlO1xuICBrZXk/OiBzdHJpbmc7XG4gIHVuaXQ/OiBzdHJpbmc7XG4gIGludGVycG9sYXRlPzogc3RyaW5nO1xuICB0eXBlPzogc3RyaW5nO1xuICBzaG93UmFuZ2VTZWxlY3Rvcj86IGJvb2xlYW47XG4gIGF1dG9SZWZyZXNoPzogbnVtYmVyO1xuICBzaG93Q29udHJvbHMgPSB0cnVlO1xuICBzaG93RXJyb3JzID0gdHJ1ZTtcbiAgc2hvd1N0YXR1cyA9IHRydWU7XG4gIHNob3dHVFNUcmVlPzogYm9vbGVhbjtcbiAgZm9sZEdUU1RyZWU/OiBib29sZWFuO1xuICB0aW1lTW9kZT86ICd0aW1lc3RhbXAnIHwgJ2RhdGUnIHwgJ2N1c3RvbScgfCAnZHVyYXRpb24nO1xuICBzaG93RG90cyA9IGZhbHNlO1xuICBkZWx0YT86IG51bWJlcjtcbiAgdGltZVVuaXQ6ICd1cycgfCAnbXMnIHwgJ25zJyA9ICd1cyc7XG4gIG1pbkNvbG9yPzogc3RyaW5nO1xuICBtYXhDb2xvcj86IHN0cmluZztcbiAgc3BsaXQ/OiAnWScgfCAnTScgfCAnRCcgfCAnaCcgfCAnbScgfCAncyc7XG4gIHBvcHVwQnV0dG9uVmFsaWRhdGVDbGFzcz86IHN0cmluZztcbiAgcG9wdXBCdXR0b25WYWxpZGF0ZUxhYmVsPzogc3RyaW5nO1xuICB0aW1lWm9uZSA9ICdVVEMnO1xuICBwcm9wZXJ0aWVzPzogYW55O1xuICBtYXA/OiB7XG4gICAgdGlsZXM/OiBzdHJpbmdbXTtcbiAgICBoZWF0UmFkaXVzPzogbnVtYmVyO1xuICAgIGhlYXRCbHVyPzogbnVtYmVyO1xuICAgIGhlYXRPcGFjaXR5PzogbnVtYmVyO1xuICAgIGhlYXRDb250cm9scz86IGJvb2xlYW47XG4gICAgZG90c0xpbWl0PzogbnVtYmVyO1xuICAgIG1hcFR5cGU/OiBzdHJpbmc7XG4gICAgc2hvd1RpbWVTbGlkZXI/OiBib29sZWFuO1xuICAgIHNob3dUaW1lUmFuZ2U/OiBib29sZWFuO1xuICAgIHRpbWVTbGlkZXJNaW4/OiBudW1iZXI7XG4gICAgdGltZVNsaWRlck1heD86IG51bWJlcjtcbiAgICB0aW1lU2xpZGVyU3RlcD86IG51bWJlcjtcbiAgICB0aW1lU2xpZGVyTW9kZT86ICd0aW1lc3RhbXAnIHwgJ2RhdGUnIHwgJ2N1c3RvbSc7XG4gICAgdGltZVN0YXJ0PzogbnVtYmVyLFxuICAgIHRpbWVTcGFuPzogbnVtYmVyLFxuICAgIHN0YXJ0TGF0PzogbnVtYmVyO1xuICAgIHN0YXJ0TG9uZz86IG51bWJlcjtcbiAgICBzdGFydFpvb20/OiBudW1iZXI7XG4gICAgdGltZVNwYW5MaXN0PzogYW55W11cbiAgfSA9IHtcbiAgICB0aWxlczogW10sXG4gICAgc2hvd1RpbWVTbGlkZXI6IGZhbHNlLFxuICAgIHNob3dUaW1lUmFuZ2U6IGZhbHNlLFxuICAgIHRpbWVTbGlkZXJNb2RlOiAndGltZXN0YW1wJ1xuICB9O1xuICBib3VuZHM6IHtcbiAgICBtaW5EYXRlPzogbnVtYmVyO1xuICAgIG1heERhdGU/OiBudW1iZXI7XG4gICAgeVJhbmdlcz86IFtudW1iZXIsIG51bWJlcl07XG4gIH0gPSB7fTtcbiAgaGlzdG8/OiB7XG4gICAgaGlzdG5vcm06ICdwZXJjZW50JyB8ICdwcm9iYWJpbGl0eScgfCAnZGVuc2l0eScgfCAncHJvYmFiaWxpdHkgZGVuc2l0eSc7XG4gICAgaGlzdGZ1bmM6ICdjb3VudCcgfCAnc3VtJyB8ICdhdmcnIHwgJ21pbicgfCAnbWF4JztcbiAgfTtcbn1cbiJdfQ==