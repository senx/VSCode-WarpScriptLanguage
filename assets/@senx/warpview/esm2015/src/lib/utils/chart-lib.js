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
// @dynamic
export class ChartLib {
    /**
     * @template T
     * @param {?} base
     * @param {?} extended
     * @return {?}
     */
    static mergeDeep(base, extended) {
        base = base || (/** @type {?} */ ({}));
        for (const prop in extended || {}) {
            if (extended.hasOwnProperty(prop)) {
                // If property is an object, merge properties
                if (Object.prototype.toString.call(extended[prop]) === '[object Object]') {
                    base[prop] = ChartLib.mergeDeep(base[prop], extended[prop]);
                }
                else {
                    base[prop] = extended[prop];
                }
            }
        }
        return (/** @type {?} */ (base));
    }
}
ChartLib.DEFAULT_WIDTH = 640;
ChartLib.DEFAULT_HEIGHT = 480;
if (false) {
    /** @type {?} */
    ChartLib.DEFAULT_WIDTH;
    /** @type {?} */
    ChartLib.DEFAULT_HEIGHT;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcnQtbGliLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHNlbngvd2FycHZpZXcvIiwic291cmNlcyI6WyJzcmMvbGliL3V0aWxzL2NoYXJ0LWxpYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrQkEsTUFBTSxPQUFPLFFBQVE7Ozs7Ozs7SUFLbkIsTUFBTSxDQUFDLFNBQVMsQ0FBSSxJQUFPLEVBQUUsUUFBYTtRQUN4QyxJQUFJLEdBQUcsSUFBSSxJQUFJLG1CQUFBLEVBQUUsRUFBSyxDQUFDO1FBQ3ZCLEtBQUssTUFBTSxJQUFJLElBQUksUUFBUSxJQUFJLEVBQUUsRUFBRTtZQUNqQyxJQUFJLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ2pDLDZDQUE2QztnQkFDN0MsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssaUJBQWlCLEVBQUU7b0JBQ3hFLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztpQkFDaEU7cUJBQU07b0JBQ0wsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDN0I7YUFDRjtTQUNGO1FBQ0QsT0FBTyxtQkFBQSxJQUFJLEVBQUssQ0FBQztJQUNuQixDQUFDOztBQWhCTSxzQkFBYSxHQUFHLEdBQUcsQ0FBQztBQUNwQix1QkFBYyxHQUFHLEdBQUcsQ0FBQzs7O0lBRDVCLHVCQUEyQjs7SUFDM0Isd0JBQTRCIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqICBDb3B5cmlnaHQgMjAyMCAgU2VuWCBTLkEuUy5cbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqL1xuXG4vLyBAZHluYW1pY1xuZXhwb3J0IGNsYXNzIENoYXJ0TGliIHtcblxuICBzdGF0aWMgREVGQVVMVF9XSURUSCA9IDY0MDtcbiAgc3RhdGljIERFRkFVTFRfSEVJR0hUID0gNDgwO1xuXG4gIHN0YXRpYyBtZXJnZURlZXA8VD4oYmFzZTogVCwgZXh0ZW5kZWQ6IGFueSkge1xuICAgIGJhc2UgPSBiYXNlIHx8IHt9IGFzIFQ7XG4gICAgZm9yIChjb25zdCBwcm9wIGluIGV4dGVuZGVkIHx8IHt9KSB7XG4gICAgICBpZiAoZXh0ZW5kZWQuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgLy8gSWYgcHJvcGVydHkgaXMgYW4gb2JqZWN0LCBtZXJnZSBwcm9wZXJ0aWVzXG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZXh0ZW5kZWRbcHJvcF0pID09PSAnW29iamVjdCBPYmplY3RdJykge1xuICAgICAgICAgIGJhc2VbcHJvcF0gPSBDaGFydExpYi5tZXJnZURlZXA8VD4oYmFzZVtwcm9wXSwgZXh0ZW5kZWRbcHJvcF0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJhc2VbcHJvcF0gPSBleHRlbmRlZFtwcm9wXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYmFzZSBhcyBUO1xuICB9XG59XG4iXX0=