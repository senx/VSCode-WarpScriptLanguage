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
var /*
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
Param = /** @class */ (function () {
    function Param() {
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
    return Param;
}());
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
export { Param };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyYW0uanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VueC93YXJwdmlldy8iLCJzb3VyY2VzIjpbInNyYy9saWIvbW9kZWwvcGFyYW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQkE7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBQUE7UUFDRSxXQUFNLEdBQUcsUUFBUSxDQUFDO1FBUWxCLGVBQVUsR0FBRyxLQUFLLENBQUM7UUFDbkIsWUFBTyxHQUFHLEtBQUssQ0FBQztRQU9oQixpQkFBWSxHQUFHLElBQUksQ0FBQztRQUNwQixlQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLGVBQVUsR0FBRyxJQUFJLENBQUM7UUFJbEIsYUFBUSxHQUFHLEtBQUssQ0FBQztRQUVqQixhQUFRLEdBQXVCLElBQUksQ0FBQztRQU1wQyxhQUFRLEdBQUcsS0FBSyxDQUFDO1FBRWpCLFFBQUcsR0FvQkM7WUFDRixLQUFLLEVBQUUsRUFBRTtZQUNULGNBQWMsRUFBRSxLQUFLO1lBQ3JCLGFBQWEsRUFBRSxLQUFLO1lBQ3BCLGNBQWMsRUFBRSxXQUFXO1NBQzVCLENBQUM7UUFDRixXQUFNLEdBSUYsRUFBRSxDQUFDO0lBS1QsQ0FBQztJQUFELFlBQUM7QUFBRCxDQUFDLEFBcEVELElBb0VDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQW5FQyx1QkFBa0I7O0lBQ2xCLHdCQUFpQjs7SUFDakIsNkJBQXNCOztJQUN0QiwwQkFBbUI7O0lBQ25CLDRCQUFxQjs7SUFDckIsOEJBQXVCOztJQUN2QiwyQkFBcUI7O0lBQ3JCLDJCQUFxQjs7SUFDckIsMkJBQW1COztJQUNuQix3QkFBZ0I7O0lBQ2hCLG9CQUFhOztJQUNiLHFCQUFjOztJQUNkLDRCQUFxQjs7SUFDckIscUJBQWM7O0lBQ2Qsa0NBQTRCOztJQUM1Qiw0QkFBcUI7O0lBQ3JCLDZCQUFvQjs7SUFDcEIsMkJBQWtCOztJQUNsQiwyQkFBa0I7O0lBQ2xCLDRCQUFzQjs7SUFDdEIsNEJBQXNCOztJQUN0Qix5QkFBd0Q7O0lBQ3hELHlCQUFpQjs7SUFDakIsc0JBQWU7O0lBQ2YseUJBQW9DOztJQUNwQyx5QkFBa0I7O0lBQ2xCLHlCQUFrQjs7SUFDbEIsc0JBQTBDOztJQUMxQyx5Q0FBa0M7O0lBQ2xDLHlDQUFrQzs7SUFDbEMseUJBQWlCOztJQUNqQiwyQkFBaUI7O0lBQ2pCLG9CQXlCRTs7SUFDRix1QkFJTzs7SUFDUCxzQkFHRSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQ29weXJpZ2h0IDIwMjAgIFNlblggUy5BLlMuXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBQYXJhbSB7XG4gIHNjaGVtZSA9ICdXQVJQMTAnO1xuICBiZ0NvbG9yPzogc3RyaW5nO1xuICBkYXRhc2V0Q29sb3I/OiBzdHJpbmc7XG4gIGZvbnRDb2xvcj86IHN0cmluZztcbiAgYm9yZGVyQ29sb3I/OiBzdHJpbmc7XG4gIGdyaWRMaW5lQ29sb3I/OiBzdHJpbmc7XG4gIHNob3dMZWdlbmQ/OiBib29sZWFuO1xuICByZXNwb25zaXZlPzogYm9vbGVhbjtcbiAgaG9yaXpvbnRhbCA9IGZhbHNlO1xuICBzdGFja2VkID0gZmFsc2U7XG4gIGtleT86IHN0cmluZztcbiAgdW5pdD86IHN0cmluZztcbiAgaW50ZXJwb2xhdGU/OiBzdHJpbmc7XG4gIHR5cGU/OiBzdHJpbmc7XG4gIHNob3dSYW5nZVNlbGVjdG9yPzogYm9vbGVhbjtcbiAgYXV0b1JlZnJlc2g/OiBudW1iZXI7XG4gIHNob3dDb250cm9scyA9IHRydWU7XG4gIHNob3dFcnJvcnMgPSB0cnVlO1xuICBzaG93U3RhdHVzID0gdHJ1ZTtcbiAgc2hvd0dUU1RyZWU/OiBib29sZWFuO1xuICBmb2xkR1RTVHJlZT86IGJvb2xlYW47XG4gIHRpbWVNb2RlPzogJ3RpbWVzdGFtcCcgfCAnZGF0ZScgfCAnY3VzdG9tJyB8ICdkdXJhdGlvbic7XG4gIHNob3dEb3RzID0gZmFsc2U7XG4gIGRlbHRhPzogbnVtYmVyO1xuICB0aW1lVW5pdDogJ3VzJyB8ICdtcycgfCAnbnMnID0gJ3VzJztcbiAgbWluQ29sb3I/OiBzdHJpbmc7XG4gIG1heENvbG9yPzogc3RyaW5nO1xuICBzcGxpdD86ICdZJyB8ICdNJyB8ICdEJyB8ICdoJyB8ICdtJyB8ICdzJztcbiAgcG9wdXBCdXR0b25WYWxpZGF0ZUNsYXNzPzogc3RyaW5nO1xuICBwb3B1cEJ1dHRvblZhbGlkYXRlTGFiZWw/OiBzdHJpbmc7XG4gIHRpbWVab25lID0gJ1VUQyc7XG4gIHByb3BlcnRpZXM/OiBhbnk7XG4gIG1hcD86IHtcbiAgICB0aWxlcz86IHN0cmluZ1tdO1xuICAgIGhlYXRSYWRpdXM/OiBudW1iZXI7XG4gICAgaGVhdEJsdXI/OiBudW1iZXI7XG4gICAgaGVhdE9wYWNpdHk/OiBudW1iZXI7XG4gICAgaGVhdENvbnRyb2xzPzogYm9vbGVhbjtcbiAgICBkb3RzTGltaXQ/OiBudW1iZXI7XG4gICAgbWFwVHlwZT86IHN0cmluZztcbiAgICBzaG93VGltZVNsaWRlcj86IGJvb2xlYW47XG4gICAgc2hvd1RpbWVSYW5nZT86IGJvb2xlYW47XG4gICAgdGltZVNsaWRlck1pbj86IG51bWJlcjtcbiAgICB0aW1lU2xpZGVyTWF4PzogbnVtYmVyO1xuICAgIHRpbWVTbGlkZXJTdGVwPzogbnVtYmVyO1xuICAgIHRpbWVTbGlkZXJNb2RlPzogJ3RpbWVzdGFtcCcgfCAnZGF0ZScgfCAnY3VzdG9tJztcbiAgICB0aW1lU3RhcnQ/OiBudW1iZXIsXG4gICAgdGltZVNwYW4/OiBudW1iZXIsXG4gICAgc3RhcnRMYXQ/OiBudW1iZXI7XG4gICAgc3RhcnRMb25nPzogbnVtYmVyO1xuICAgIHN0YXJ0Wm9vbT86IG51bWJlcjtcbiAgICB0aW1lU3Bhbkxpc3Q/OiBhbnlbXVxuICB9ID0ge1xuICAgIHRpbGVzOiBbXSxcbiAgICBzaG93VGltZVNsaWRlcjogZmFsc2UsXG4gICAgc2hvd1RpbWVSYW5nZTogZmFsc2UsXG4gICAgdGltZVNsaWRlck1vZGU6ICd0aW1lc3RhbXAnXG4gIH07XG4gIGJvdW5kczoge1xuICAgIG1pbkRhdGU/OiBudW1iZXI7XG4gICAgbWF4RGF0ZT86IG51bWJlcjtcbiAgICB5UmFuZ2VzPzogW251bWJlciwgbnVtYmVyXTtcbiAgfSA9IHt9O1xuICBoaXN0bz86IHtcbiAgICBoaXN0bm9ybTogJ3BlcmNlbnQnIHwgJ3Byb2JhYmlsaXR5JyB8ICdkZW5zaXR5JyB8ICdwcm9iYWJpbGl0eSBkZW5zaXR5JztcbiAgICBoaXN0ZnVuYzogJ2NvdW50JyB8ICdzdW0nIHwgJ2F2ZycgfCAnbWluJyB8ICdtYXgnO1xuICB9O1xufVxuIl19