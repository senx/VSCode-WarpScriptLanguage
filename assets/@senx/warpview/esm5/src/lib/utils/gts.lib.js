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
import { DataModel } from '../model/dataModel';
import { Logger } from './logger';
// @dynamic
var GTSLib = /** @class */ (function () {
    function GTSLib() {
    }
    /**
     * @param {?} actual
     * @return {?}
     */
    GTSLib.cleanArray = /**
     * @param {?} actual
     * @return {?}
     */
    function (actual) {
        return actual.filter((/**
         * @param {?} i
         * @return {?}
         */
        function (i) { return !!i; }));
    };
    /**
     * @param {?} arr
     * @return {?}
     */
    GTSLib.unique = /**
     * @param {?} arr
     * @return {?}
     */
    function (arr) {
        /** @type {?} */
        var u = {};
        /** @type {?} */
        var a = [];
        for (var i = 0, l = arr.length; i < l; ++i) {
            if (!u.hasOwnProperty(arr[i])) {
                a.push(arr[i]);
                u[arr[i]] = 1;
            }
        }
        return a;
    };
    /**
     * @param {?} value
     * @return {?}
     */
    GTSLib.isArray = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        return value && typeof value === 'object' && value instanceof Array && typeof value.length === 'number'
            && typeof value.splice === 'function' && !(value.propertyIsEnumerable('length'));
    };
    /**
     * @param {?} elapsed
     * @return {?}
     */
    GTSLib.formatElapsedTime = /**
     * @param {?} elapsed
     * @return {?}
     */
    function (elapsed) {
        if (elapsed < 1000) {
            return elapsed.toFixed(3) + ' ns';
        }
        if (elapsed < 1000000) {
            return (elapsed / 1000).toFixed(3) + ' μs';
        }
        if (elapsed < 1000000000) {
            return (elapsed / 1000000).toFixed(3) + ' ms';
        }
        if (elapsed < 1000000000000) {
            return (elapsed / 1000000000).toFixed(3) + ' s ';
        }
        // Max exec time for nice output: 999.999 minutes (should be OK, timeout should happen before that).
        return (elapsed / 60000000000).toFixed(3) + ' m ';
    };
    /**
     * @param {?} data
     * @return {?}
     */
    GTSLib.isValidResponse = /**
     * @param {?} data
     * @return {?}
     */
    function (data) {
        /** @type {?} */
        var response;
        try {
            response = JSON.parse(data);
        }
        catch (e) {
            this.LOG.error(['isValidResponse'], 'Response non JSON compliant', data);
            return false;
        }
        if (!GTSLib.isArray(response)) {
            this.LOG.error(['isValidResponse'], 'Response isn\'t an Array', response);
            return false;
        }
        return true;
    };
    /**
     * @param {?} item
     * @return {?}
     */
    GTSLib.isEmbeddedImage = /**
     * @param {?} item
     * @return {?}
     */
    function (item) {
        return !(typeof item !== 'string' || !/^data:image/.test(item));
    };
    /**
     * @param {?} item
     * @return {?}
     */
    GTSLib.isEmbeddedImageObject = /**
     * @param {?} item
     * @return {?}
     */
    function (item) {
        return !((item === null) || (item.image === null) ||
            (item.caption === null) || !GTSLib.isEmbeddedImage(item.image));
    };
    /**
     * @param {?} item
     * @return {?}
     */
    GTSLib.isPositionArray = /**
     * @param {?} item
     * @return {?}
     */
    function (item) {
        if (!item || !item.positions) {
            return false;
        }
        if (GTSLib.isPositionsArrayWithValues(item) || GTSLib.isPositionsArrayWithTwoValues(item)) {
            return true;
        }
        (item.positions || []).forEach((/**
         * @param {?} p
         * @return {?}
         */
        function (p) {
            if (p.length < 2 || p.length > 3) {
                return false;
            }
            for (var j in p) {
                if (typeof p[j] !== 'number') {
                    return false;
                }
            }
        }));
        return true;
    };
    /**
     * @param {?} item
     * @return {?}
     */
    GTSLib.isPositionsArrayWithValues = /**
     * @param {?} item
     * @return {?}
     */
    function (item) {
        if ((item === null) || (item.positions === null)) {
            return false;
        }
        (item.positions || []).forEach((/**
         * @param {?} p
         * @return {?}
         */
        function (p) {
            if (p.length !== 3) {
                return false;
            }
            for (var j in p) {
                if (typeof p[j] !== 'number') {
                    return false;
                }
            }
        }));
        return true;
    };
    /**
     * @param {?} item
     * @return {?}
     */
    GTSLib.isPositionsArrayWithTwoValues = /**
     * @param {?} item
     * @return {?}
     */
    function (item) {
        if ((item === null) || (item.positions === null)) {
            return false;
        }
        (item.positions || []).forEach((/**
         * @param {?} p
         * @return {?}
         */
        function (p) {
            if (p.length !== 4) {
                return false;
            }
            for (var j in p) {
                if (typeof p[j] !== 'number') {
                    return false;
                }
            }
        }));
        return true;
    };
    /**
     * @param {?} json
     * @param {?} id
     * @return {?}
     */
    GTSLib.gtsFromJSON = /**
     * @param {?} json
     * @param {?} id
     * @return {?}
     */
    function (json, id) {
        return { gts: { c: json.c, l: json.l, a: json.a, v: json.v, id: id } };
    };
    /**
     * @param {?} jsonList
     * @param {?} prefixId
     * @return {?}
     */
    GTSLib.gtsFromJSONList = /**
     * @param {?} jsonList
     * @param {?} prefixId
     * @return {?}
     */
    function (jsonList, prefixId) {
        /** @type {?} */
        var gtsList = [];
        /** @type {?} */
        var id;
        (jsonList || []).forEach((/**
         * @param {?} item
         * @param {?} i
         * @return {?}
         */
        function (item, i) {
            /** @type {?} */
            var gts = item;
            if (item.gts) {
                gts = item.gts;
            }
            if ((prefixId !== undefined) && (prefixId !== '')) {
                id = prefixId + '-' + i;
            }
            else {
                id = i;
            }
            if (GTSLib.isArray(gts)) {
                gtsList.push(GTSLib.gtsFromJSONList(gts, id));
            }
            if (GTSLib.isGts(gts)) {
                gtsList.push(GTSLib.gtsFromJSON(gts, id));
            }
            if (GTSLib.isEmbeddedImage(gts)) {
                gtsList.push({ image: gts, caption: 'Image', id: id });
            }
            if (GTSLib.isEmbeddedImageObject(gts)) {
                gtsList.push({ image: gts.image, caption: gts.caption, id: id });
            }
        }));
        return {
            content: gtsList || [],
        };
    };
    /**
     * @param {?} arr1
     * @return {?}
     */
    GTSLib.flatDeep = /**
     * @param {?} arr1
     * @return {?}
     */
    function (arr1) {
        if (!GTSLib.isArray(arr1)) {
            arr1 = [arr1];
        }
        return arr1.reduce((/**
         * @param {?} acc
         * @param {?} val
         * @return {?}
         */
        function (acc, val) { return Array.isArray(val) ? acc.concat(GTSLib.flatDeep(val)) : acc.concat(val); }), []);
    };
    /**
     * @param {?} a
     * @param {?} r
     * @return {?}
     */
    GTSLib.flattenGtsIdArray = /**
     * @param {?} a
     * @param {?} r
     * @return {?}
     */
    function (a, r) {
        /** @type {?} */
        var res = [];
        if (GTSLib.isGts(a)) {
            a = [a];
        }
        (a || []).forEach((/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            if (GTSLib.isArray(d)) {
                /** @type {?} */
                var walk = GTSLib.flattenGtsIdArray(d, r);
                res.push(walk.res);
                r = walk.r;
            }
            else if (d && d.v) {
                d.id = r;
                res.push(d);
                r++;
            }
        }));
        return { res: res, r: r };
    };
    /**
     * @param {?} input
     * @return {?}
     */
    GTSLib.sanitizeNames = /**
     * @param {?} input
     * @return {?}
     */
    function (input) {
        return (input || '').replace(/{/g, '&#123;')
            .replace(/}/g, '&#125;')
            .replace(/,/g, '&#44;')
            .replace(/>/g, '&#62;')
            .replace(/</g, '&#60;')
            .replace(/"/g, '&#34;')
            .replace(/'/g, '&#39;');
    };
    /**
     * @param {?} gts
     * @return {?}
     */
    GTSLib.serializeGtsMetadata = /**
     * @param {?} gts
     * @return {?}
     */
    function (gts) {
        var _this = this;
        /** @type {?} */
        var serializedLabels = [];
        /** @type {?} */
        var serializedAttributes = [];
        if (gts.l) {
            Object.keys(gts.l).forEach((/**
             * @param {?} key
             * @return {?}
             */
            function (key) {
                serializedLabels.push(_this.sanitizeNames(key + '=' + gts.l[key]));
            }));
        }
        if (gts.a) {
            Object.keys(gts.a).forEach((/**
             * @param {?} key
             * @return {?}
             */
            function (key) {
                serializedAttributes.push(_this.sanitizeNames(key + '=' + gts.a[key]));
            }));
        }
        // tslint:disable-next-line:max-line-length
        return this.sanitizeNames(gts.c) + "{" + serializedLabels.join(',') + (serializedAttributes.length > 0 ? ',' : '') + serializedAttributes.join(',') + "}";
    };
    /**
     * @param {?} item
     * @return {?}
     */
    GTSLib.isGts = /**
     * @param {?} item
     * @return {?}
     */
    function (item) {
        return !!item && (item.c === '' || !!item.c) && !!item.v && GTSLib.isArray(item.v);
    };
    /**
     * @param {?} gts
     * @return {?}
     */
    GTSLib.isGtsToPlot = /**
     * @param {?} gts
     * @return {?}
     */
    function (gts) {
        if (!GTSLib.isGts(gts) || gts.v.length === 0) {
            return false;
        }
        // We look at the first non-null value, if it's a String or Boolean it's an annotation GTS,
        // if it's a number it's a GTS to plot
        return (gts.v || []).some((/**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            // noinspection JSPotentiallyInvalidConstructorUsage
            return typeof v[v.length - 1] === 'number' || !!v[v.length - 1].constructor.prototype.toFixed;
        }));
    };
    /**
     * @param {?} gts
     * @return {?}
     */
    GTSLib.isGtsToPlotOnMap = /**
     * @param {?} gts
     * @return {?}
     */
    function (gts) {
        if (!GTSLib.isGts(gts) || gts.v.length === 0) {
            return false;
        }
        // We look at the first non-null value, if it's a String or Boolean it's an annotation GTS,
        // if it's a number it's a GTS to plot
        return (gts.v || []).some((/**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            // noinspection JSPotentiallyInvalidConstructorUsage
            return v.length >= 3 && (typeof v[v.length - 1] === 'number' || !!v[v.length - 1].constructor.prototype.toFixed);
        }));
    };
    /**
     * @param {?} gts
     * @return {?}
     */
    GTSLib.isSingletonGTS = /**
     * @param {?} gts
     * @return {?}
     */
    function (gts) {
        if (!GTSLib.isGts(gts) || gts.v.length === 0) {
            return false;
        }
        return (gts.v || []).length === 1;
    };
    /**
     * @param {?} gts
     * @return {?}
     */
    GTSLib.isGtsToAnnotate = /**
     * @param {?} gts
     * @return {?}
     */
    function (gts) {
        if (!GTSLib.isGts(gts) || gts.v.length === 0) {
            return false;
        }
        // We look at the first non-null value, if it's a String or Boolean it's an annotation GTS,
        // if it's a number it's a GTS to plot
        return (gts.v || []).some((/**
         * @param {?} v
         * @return {?}
         */
        function (v) {
            if (v[v.length - 1] !== null) {
                // noinspection JSPotentiallyInvalidConstructorUsage
                return typeof (v[v.length - 1]) !== 'number' &&
                    (!!v[v.length - 1].constructor && v[v.length - 1].constructor.name !== 'Big') &&
                    v[v.length - 1].constructor.prototype.toFixed === undefined;
            }
        }));
    };
    /**
     * @param {?} gts
     * @return {?}
     */
    GTSLib.gtsSort = /**
     * @param {?} gts
     * @return {?}
     */
    function (gts) {
        if (gts.isSorted) {
            return;
        }
        gts.v = gts.v.sort((/**
         * @param {?} a
         * @param {?} b
         * @return {?}
         */
        function (a, b) { return a[0] - b[0]; }));
        gts.isSorted = true;
    };
    /**
     * @param {?} data
     * @return {?}
     */
    GTSLib.getData = /**
     * @param {?} data
     * @return {?}
     */
    function (data) {
        if (typeof data === 'string') {
            return GTSLib.getData(JSON.parse((/** @type {?} */ (data))));
        }
        else if (data && data.hasOwnProperty('data')) {
            if (!GTSLib.isArray(data.data)) {
                data.data = [data.data];
            }
            return (/** @type {?} */ (data));
        }
        else if (GTSLib.isArray(data) && data.length > 0 && data[0].data) {
            return (/** @type {?} */ (data[0]));
        }
        else if (GTSLib.isArray(data)) {
            return (/** @type {?} */ ({ data: (/** @type {?} */ (data)) }));
        }
        return new DataModel();
    };
    /**
     * @param {?} timeUnit
     * @return {?}
     */
    GTSLib.getDivider = /**
     * @param {?} timeUnit
     * @return {?}
     */
    function (timeUnit) {
        /** @type {?} */
        var timestampDivider = 1000;
        if (timeUnit === 'ms') {
            timestampDivider = 1;
        }
        if (timeUnit === 'ns') {
            timestampDivider = 1000000;
        }
        return timestampDivider;
    };
    GTSLib.LOG = new Logger(GTSLib);
    GTSLib.formatLabel = (/**
     * @param {?} data
     * @return {?}
     */
    function (data) {
        /** @type {?} */
        var serializedGTS = data.split('{');
        /** @type {?} */
        var display = "<span class=\"gtsInfo\"><span class='gts-classname'>" + serializedGTS[0] + "</span>";
        if (serializedGTS.length > 1) {
            display += "<span class='gts-separator'>{</span>";
            /** @type {?} */
            var labels_1 = serializedGTS[1].substr(0, serializedGTS[1].length - 1).split(',');
            if (labels_1.length > 0) {
                labels_1.forEach((/**
                 * @param {?} l
                 * @param {?} i
                 * @return {?}
                 */
                function (l, i) {
                    /** @type {?} */
                    var label = l.split('=');
                    if (l.length > 1) {
                        display += "<span><span class='gts-labelname'>" + label[0] + "</span>\n<span class='gts-separator'>=</span><span class='gts-labelvalue'>" + label[1] + "</span>";
                        if (i !== labels_1.length - 1) {
                            display += "<span>, </span>";
                        }
                    }
                }));
            }
            display += "<span class='gts-separator'>}</span>";
        }
        if (serializedGTS.length > 2) {
            display += "<span class='gts-separator'>{</span>";
            /** @type {?} */
            var labels_2 = serializedGTS[2].substr(0, serializedGTS[2].length - 1).split(',');
            if (labels_2.length > 0) {
                labels_2.forEach((/**
                 * @param {?} l
                 * @param {?} i
                 * @return {?}
                 */
                function (l, i) {
                    /** @type {?} */
                    var label = l.split('=');
                    if (l.length > 1) {
                        display += "<span><span class='gts-attrname'>" + label[0] + "</span>\n<span class='gts-separator'>=</span><span class='gts-attrvalue'>" + label[1] + "</span>";
                        if (i !== labels_2.length - 1) {
                            display += "<span>, </span>";
                        }
                    }
                }));
            }
            display += "<span class='gts-separator'>}</span>";
        }
        display += '</span>';
        return display;
    });
    return GTSLib;
}());
export { GTSLib };
if (false) {
    /**
     * @type {?}
     * @private
     */
    GTSLib.LOG;
    /** @type {?} */
    GTSLib.formatLabel;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3RzLmxpYi5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzZW54L3dhcnB2aWV3LyIsInNvdXJjZXMiOlsic3JjL2xpYi91dGlscy9ndHMubGliLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUU3QyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sVUFBVSxDQUFDOztBQUdoQztJQUFBO0lBNFVBLENBQUM7Ozs7O0lBelVRLGlCQUFVOzs7O0lBQWpCLFVBQWtCLE1BQWE7UUFDN0IsT0FBTyxNQUFNLENBQUMsTUFBTTs7OztRQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxDQUFDLENBQUMsRUFBSCxDQUFHLEVBQUMsQ0FBQztJQUNuQyxDQUFDOzs7OztJQUVNLGFBQU07Ozs7SUFBYixVQUFjLEdBQUc7O1lBQ1QsQ0FBQyxHQUFHLEVBQUU7O1lBQ04sQ0FBQyxHQUFHLEVBQUU7UUFDWixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO1lBQzFDLElBQUksQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUM3QixDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNmLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDZjtTQUNGO1FBQ0QsT0FBTyxDQUFDLENBQUM7SUFDWCxDQUFDOzs7OztJQUVNLGNBQU87Ozs7SUFBZCxVQUFlLEtBQUs7UUFDbEIsT0FBTyxLQUFLLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLEtBQUssWUFBWSxLQUFLLElBQUksT0FBTyxLQUFLLENBQUMs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QUcsQ0FBQztvQkFDMUIsSUFBSSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTt3QkFDaEIsT0FBTyxJQUFJLHNDQUFvQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGlGQUNELEtBQUssQ0FBQyxDQUFDLENBQUMsWUFBUyxDQUFDO3dCQUN4RSxJQUFJLENBQUMsS0FBSyxRQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTs0QkFDM0IsT0FBTyxJQUFJLGlCQUFpQixDQUFDO3lCQUM5QjtxQkFDRjtnQkFDSCxDQUFDLEVBQUMsQ0FBQzthQUNKO1lBQ0QsT0FBTyxJQUFJLHNDQUFzQyxDQUFDO1NBQ25EO1FBQ0QsT0FBTyxJQUFJLFNBQVMsQ0FBQztRQUNyQixPQUFPLE9BQU8sQ0FBQztJQUNqQixDQUFDLEVBQUM7SUFDSixhQUFDO0NBQUEsQUE1VUQsSUE0VUM7U0E1VVksTUFBTTs7Ozs7O0lBQ2pCLFdBQWdEOztJQW1TaEQsbUJBdUNFIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqICBDb3B5cmlnaHQgMjAyMCAgU2VuWCBTLkEuUy5cbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqL1xuXG5pbXBvcnQge0RhdGFNb2RlbH0gZnJvbSAnLi4vbW9kZWwvZGF0YU1vZGVsJztcbmltcG9ydCB7R1RTfSBmcm9tICcuLi9tb2RlbC9HVFMnO1xuaW1wb3J0IHtMb2dnZXJ9IGZyb20gJy4vbG9nZ2VyJztcblxuLy8gQGR5bmFtaWNcbmV4cG9ydCBjbGFzcyBHVFNMaWIge1xuICBwcml2YXRlIHN0YXRpYyBMT0c6IExvZ2dlciA9IG5ldyBMb2dnZXIoR1RTTGliKTtcblxuICBzdGF0aWMgY2xlYW5BcnJheShhY3R1YWw6IGFueVtdKSB7XG4gICAgcmV0dXJuIGFjdHVhbC5maWx0ZXIoKGkpID0+ICEhaSk7XG4gIH1cblxuICBzdGF0aWMgdW5pcXVlKGFycikge1xuICAgIGNvbnN0IHUgPSB7fTtcbiAgICBjb25zdCBhID0gW107XG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSBhcnIubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICBpZiAoIXUuaGFzT3duUHJvcGVydHkoYXJyW2ldKSkge1xuICAgICAgICBhLnB1c2goYXJyW2ldKTtcbiAgICAgICAgdVthcnJbaV1dID0gMTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGE7XG4gIH1cblxuICBzdGF0aWMgaXNBcnJheSh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlIGluc3RhbmNlb2YgQXJyYXkgJiYgdHlwZW9mIHZhbHVlLmxlbmd0aCA9PT0gJ251bWJlcidcbiAgICAgICYmIHR5cGVvZiB2YWx1ZS5zcGxpY2UgPT09ICdmdW5jdGlvbicgJiYgISh2YWx1ZS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgnbGVuZ3RoJykpO1xuICB9XG5cbiAgc3RhdGljIGZvcm1hdEVsYXBzZWRUaW1lKGVsYXBzZWQ6IG51bWJlcikge1xuICAgIGlmIChlbGFwc2VkIDwgMTAwMCkge1xuICAgICAgcmV0dXJuIGVsYXBzZWQudG9GaXhlZCgzKSArICcgbnMnO1xuICAgIH1cbiAgICBpZiAoZWxhcHNlZCA8IDEwMDAwMDApIHtcbiAgICAgIHJldHVybiAoZWxhcHNlZCAvIDEwMDApLnRvRml4ZWQoMykgKyAnIM68cyc7XG4gICAgfVxuICAgIGlmIChlbGFwc2VkIDwgMTAwMDAwMDAwMCkge1xuICAgICAgcmV0dXJuIChlbGFwc2VkIC8gMTAwMDAwMCkudG9GaXhlZCgzKSArICcgbXMnO1xuICAgIH1cbiAgICBpZiAoZWxhcHNlZCA8IDEwMDAwMDAwMDAwMDApIHtcbiAgICAgIHJldHVybiAoZWxhcHNlZCAvIDEwMDAwMDAwMDApLnRvRml4ZWQoMykgKyAnIHMgJztcbiAgICB9XG4gICAgLy8gTWF4IGV4ZWMgdGltZSBmb3IgbmljZSBvdXRwdXQ6IDk5OS45OTkgbWludXRlcyAoc2hvdWxkIGJlIE9LLCB0aW1lb3V0IHNob3VsZCBoYXBwZW4gYmVmb3JlIHRoYXQpLlxuICAgIHJldHVybiAoZWxhcHNlZCAvIDYwMDAwMDAwMDAwKS50b0ZpeGVkKDMpICsgJyBtICc7XG4gIH1cblxuICBzdGF0aWMgaXNWYWxpZFJlc3BvbnNlKGRhdGEpIHtcbiAgICBsZXQgcmVzcG9uc2U7XG4gICAgdHJ5IHtcbiAgICAgIHJlc3BvbnNlID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aGlzLkxPRy5lcnJvcihbJ2lzVmFsaWRSZXNwb25zZSddLCAnUmVzcG9uc2Ugbm9uIEpTT04gY29tcGxpYW50JywgZGF0YSk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICghR1RTTGliLmlzQXJyYXkocmVzcG9uc2UpKSB7XG4gICAgICB0aGlzLkxPRy5lcnJvcihbJ2lzVmFsaWRSZXNwb25zZSddLCAnUmVzcG9uc2UgaXNuXFwndCBhbiBBcnJheScsIHJlc3BvbnNlKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBzdGF0aWMgaXNFbWJlZGRlZEltYWdlKGl0ZW0pIHtcbiAgICByZXR1cm4gISh0eXBlb2YgaXRlbSAhPT0gJ3N0cmluZycgfHwgIS9eZGF0YTppbWFnZS8udGVzdChpdGVtKSk7XG4gIH1cblxuICBzdGF0aWMgaXNFbWJlZGRlZEltYWdlT2JqZWN0KGl0ZW0pIHtcbiAgICByZXR1cm4gISgoaXRlbSA9PT0gbnVsbCkgfHwgKGl0ZW0uaW1hZ2UgPT09IG51bGwpIHx8XG4gICAgICAoaXRlbS5jYXB0aW9uID09PSBudWxsKSB8fCAhR1RTTGliLmlzRW1iZWRkZWRJbWFnZShpdGVtLmltYWdlKSk7XG4gIH1cblxuICBzdGF0aWMgaXNQb3NpdGlvbkFycmF5KGl0ZW0pIHtcbiAgICBpZiAoIWl0ZW0gfHwgIWl0ZW0ucG9zaXRpb25zKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChHVFNMaWIuaXNQb3NpdGlvbnNBcnJheVdpdGhWYWx1ZXMoaXRlbSkgfHwgR1RTTGliLmlzUG9zaXRpb25zQXJyYXlXaXRoVHdvVmFsdWVzKGl0ZW0pKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgKGl0ZW0ucG9zaXRpb25zIHx8IFtdKS5mb3JFYWNoKHAgPT4ge1xuICAgICAgaWYgKHAubGVuZ3RoIDwgMiB8fCBwLmxlbmd0aCA+IDMpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgZm9yIChjb25zdCBqIGluIHApIHtcbiAgICAgICAgaWYgKHR5cGVvZiBwW2pdICE9PSAnbnVtYmVyJykge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgc3RhdGljIGlzUG9zaXRpb25zQXJyYXlXaXRoVmFsdWVzKGl0ZW0pIHtcbiAgICBpZiAoKGl0ZW0gPT09IG51bGwpIHx8IChpdGVtLnBvc2l0aW9ucyA9PT0gbnVsbCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgKGl0ZW0ucG9zaXRpb25zIHx8IFtdKS5mb3JFYWNoKHAgPT4ge1xuICAgICAgaWYgKHAubGVuZ3RoICE9PSAzKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGZvciAoY29uc3QgaiBpbiBwKSB7XG4gICAgICAgIGlmICh0eXBlb2YgcFtqXSAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHN0YXRpYyBpc1Bvc2l0aW9uc0FycmF5V2l0aFR3b1ZhbHVlcyhpdGVtKSB7XG4gICAgaWYgKChpdGVtID09PSBudWxsKSB8fCAoaXRlbS5wb3NpdGlvbnMgPT09IG51bGwpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIChpdGVtLnBvc2l0aW9ucyB8fCBbXSkuZm9yRWFjaChwID0+IHtcbiAgICAgIGlmIChwLmxlbmd0aCAhPT0gNCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBmb3IgKGNvbnN0IGogaW4gcCkge1xuICAgICAgICBpZiAodHlwZW9mIHBbal0gIT09ICdudW1iZXInKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBzdGF0aWMgZ3RzRnJvbUpTT04oanNvbiwgaWQpIHtcbiAgICByZXR1cm4ge2d0czoge2M6IGpzb24uYywgbDoganNvbi5sLCBhOiBqc29uLmEsIHY6IGpzb24udiwgaWR9fTtcbiAgfVxuXG4gIHN0YXRpYyBndHNGcm9tSlNPTkxpc3QoanNvbkxpc3QsIHByZWZpeElkKSB7XG4gICAgY29uc3QgZ3RzTGlzdCA9IFtdO1xuICAgIGxldCBpZDtcbiAgICAoanNvbkxpc3QgfHwgW10pLmZvckVhY2goKGl0ZW0sIGkpID0+IHtcbiAgICAgIGxldCBndHMgPSBpdGVtO1xuICAgICAgaWYgKGl0ZW0uZ3RzKSB7XG4gICAgICAgIGd0cyA9IGl0ZW0uZ3RzO1xuICAgICAgfVxuICAgICAgaWYgKChwcmVmaXhJZCAhPT0gdW5kZWZpbmVkKSAmJiAocHJlZml4SWQgIT09ICcnKSkge1xuICAgICAgICBpZCA9IHByZWZpeElkICsgJy0nICsgaTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlkID0gaTtcbiAgICAgIH1cbiAgICAgIGlmIChHVFNMaWIuaXNBcnJheShndHMpKSB7XG4gICAgICAgIGd0c0xpc3QucHVzaChHVFNMaWIuZ3RzRnJvbUpTT05MaXN0KGd0cywgaWQpKTtcbiAgICAgIH1cbiAgICAgIGlmIChHVFNMaWIuaXNHdHMoZ3RzKSkge1xuICAgICAgICBndHNMaXN0LnB1c2goR1RTTGliLmd0c0Zyb21KU09OKGd0cywgaWQpKTtcbiAgICAgIH1cbiAgICAgIGlmIChHVFNMaWIuaXNFbWJlZGRlZEltYWdlKGd0cykpIHtcbiAgICAgICAgZ3RzTGlzdC5wdXNoKHtpbWFnZTogZ3RzLCBjYXB0aW9uOiAnSW1hZ2UnLCBpZH0pO1xuICAgICAgfVxuICAgICAgaWYgKEdUU0xpYi5pc0VtYmVkZGVkSW1hZ2VPYmplY3QoZ3RzKSkge1xuICAgICAgICBndHNMaXN0LnB1c2goe2ltYWdlOiBndHMuaW1hZ2UsIGNhcHRpb246IGd0cy5jYXB0aW9uLCBpZH0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB7XG4gICAgICBjb250ZW50OiBndHNMaXN0IHx8IFtdLFxuICAgIH07XG4gIH1cblxuICBzdGF0aWMgZmxhdERlZXAoYXJyMTogYW55W10pOiBhbnlbXSB7XG4gICAgaWYgKCFHVFNMaWIuaXNBcnJheShhcnIxKSkge1xuICAgICAgYXJyMSA9IFthcnIxXTtcbiAgICB9XG4gICAgcmV0dXJuIGFycjEucmVkdWNlKChhY2MsIHZhbCkgPT4gQXJyYXkuaXNBcnJheSh2YWwpID8gYWNjLmNvbmNhdChHVFNMaWIuZmxhdERlZXAodmFsKSkgOiBhY2MuY29uY2F0KHZhbCksIFtdKTtcbiAgfVxuXG4gIHN0YXRpYyBmbGF0dGVuR3RzSWRBcnJheShhOiBhbnlbXSwgcjogbnVtYmVyKTogeyByZXM6IGFueVtdLCByOiBudW1iZXIgfSB7XG4gICAgY29uc3QgcmVzID0gW107XG4gICAgaWYgKEdUU0xpYi5pc0d0cyhhKSkge1xuICAgICAgYSA9IFthXTtcbiAgICB9XG4gICAgKGEgfHwgW10pLmZvckVhY2goZCA9PiB7XG4gICAgICBpZiAoR1RTTGliLmlzQXJyYXkoZCkpIHtcbiAgICAgICAgY29uc3Qgd2FsayA9IEdUU0xpYi5mbGF0dGVuR3RzSWRBcnJheShkLCByKTtcbiAgICAgICAgcmVzLnB1c2god2Fsay5yZXMpO1xuICAgICAgICByID0gd2Fsay5yO1xuICAgICAgfSBlbHNlIGlmIChkICYmIGQudikge1xuICAgICAgICBkLmlkID0gcjtcbiAgICAgICAgcmVzLnB1c2goZCk7XG4gICAgICAgIHIrKztcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4ge3Jlcywgcn07XG4gIH1cblxuICBzdGF0aWMgc2FuaXRpemVOYW1lcyhpbnB1dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gKGlucHV0IHx8ICcnKS5yZXBsYWNlKC97L2csICcmIzEyMzsnKVxuICAgICAgLnJlcGxhY2UoL30vZywgJyYjMTI1OycpXG4gICAgICAucmVwbGFjZSgvLC9nLCAnJiM0NDsnKVxuICAgICAgLnJlcGxhY2UoLz4vZywgJyYjNjI7JylcbiAgICAgIC5yZXBsYWNlKC88L2csICcmIzYwOycpXG4gICAgICAucmVwbGFjZSgvXCIvZywgJyYjMzQ7JylcbiAgICAgIC5yZXBsYWNlKC8nL2csICcmIzM5OycpO1xuICB9XG5cbiAgc3RhdGljIHNlcmlhbGl6ZUd0c01ldGFkYXRhKGd0cykge1xuICAgIGNvbnN0IHNlcmlhbGl6ZWRMYWJlbHMgPSBbXTtcbiAgICBjb25zdCBzZXJpYWxpemVkQXR0cmlidXRlcyA9IFtdO1xuICAgIGlmIChndHMubCkge1xuICAgICAgT2JqZWN0LmtleXMoZ3RzLmwpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICBzZXJpYWxpemVkTGFiZWxzLnB1c2godGhpcy5zYW5pdGl6ZU5hbWVzKGtleSArICc9JyArIGd0cy5sW2tleV0pKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoZ3RzLmEpIHtcbiAgICAgIE9iamVjdC5rZXlzKGd0cy5hKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgc2VyaWFsaXplZEF0dHJpYnV0ZXMucHVzaCh0aGlzLnNhbml0aXplTmFtZXMoa2V5ICsgJz0nICsgZ3RzLmFba2V5XSkpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtbGluZS1sZW5ndGhcbiAgICByZXR1cm4gYCR7dGhpcy5zYW5pdGl6ZU5hbWVzKGd0cy5jKX17JHtzZXJpYWxpemVkTGFiZWxzLmpvaW4oJywnKX0ke3NlcmlhbGl6ZWRBdHRyaWJ1dGVzLmxlbmd0aCA+IDAgPyAnLCcgOiAnJ30ke3NlcmlhbGl6ZWRBdHRyaWJ1dGVzLmpvaW4oJywnKX19YDtcbiAgfVxuXG4gIHN0YXRpYyBpc0d0cyhpdGVtKSB7XG4gICAgcmV0dXJuICEhaXRlbSAmJiAoaXRlbS5jID09PSAnJyB8fCAhIWl0ZW0uYykgJiYgISFpdGVtLnYgJiYgR1RTTGliLmlzQXJyYXkoaXRlbS52KTtcbiAgfVxuXG4gIHN0YXRpYyBpc0d0c1RvUGxvdChndHMpIHtcbiAgICBpZiAoIUdUU0xpYi5pc0d0cyhndHMpIHx8IGd0cy52Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBXZSBsb29rIGF0IHRoZSBmaXJzdCBub24tbnVsbCB2YWx1ZSwgaWYgaXQncyBhIFN0cmluZyBvciBCb29sZWFuIGl0J3MgYW4gYW5ub3RhdGlvbiBHVFMsXG4gICAgLy8gaWYgaXQncyBhIG51bWJlciBpdCdzIGEgR1RTIHRvIHBsb3RcbiAgICByZXR1cm4gKGd0cy52IHx8IFtdKS5zb21lKHYgPT4ge1xuICAgICAgLy8gbm9pbnNwZWN0aW9uIEpTUG90ZW50aWFsbHlJbnZhbGlkQ29uc3RydWN0b3JVc2FnZVxuICAgICAgcmV0dXJuIHR5cGVvZiB2W3YubGVuZ3RoIC0gMV0gPT09ICdudW1iZXInIHx8ICEhdlt2Lmxlbmd0aCAtIDFdLmNvbnN0cnVjdG9yLnByb3RvdHlwZS50b0ZpeGVkO1xuICAgIH0pO1xuICB9XG4gIHN0YXRpYyBpc0d0c1RvUGxvdE9uTWFwKGd0cykge1xuICAgIGlmICghR1RTTGliLmlzR3RzKGd0cykgfHwgZ3RzLnYubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIFdlIGxvb2sgYXQgdGhlIGZpcnN0IG5vbi1udWxsIHZhbHVlLCBpZiBpdCdzIGEgU3RyaW5nIG9yIEJvb2xlYW4gaXQncyBhbiBhbm5vdGF0aW9uIEdUUyxcbiAgICAvLyBpZiBpdCdzIGEgbnVtYmVyIGl0J3MgYSBHVFMgdG8gcGxvdFxuICAgIHJldHVybiAoZ3RzLnYgfHwgW10pLnNvbWUodiA9PiB7XG4gICAgICAvLyBub2luc3BlY3Rpb24gSlNQb3RlbnRpYWxseUludmFsaWRDb25zdHJ1Y3RvclVzYWdlXG4gICAgICByZXR1cm4gdi5sZW5ndGggPj0gMyAmJiAodHlwZW9mIHZbdi5sZW5ndGggLSAxXSA9PT0gJ251bWJlcicgfHwgISF2W3YubGVuZ3RoIC0gMV0uY29uc3RydWN0b3IucHJvdG90eXBlLnRvRml4ZWQpO1xuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIGlzU2luZ2xldG9uR1RTKGd0cykge1xuICAgIGlmICghR1RTTGliLmlzR3RzKGd0cykgfHwgZ3RzLnYubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiAoZ3RzLnYgfHwgW10pLmxlbmd0aCA9PT0gMTtcbiAgfVxuXG4gIHN0YXRpYyBpc0d0c1RvQW5ub3RhdGUoZ3RzKSB7XG4gICAgaWYgKCFHVFNMaWIuaXNHdHMoZ3RzKSB8fCBndHMudi5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8gV2UgbG9vayBhdCB0aGUgZmlyc3Qgbm9uLW51bGwgdmFsdWUsIGlmIGl0J3MgYSBTdHJpbmcgb3IgQm9vbGVhbiBpdCdzIGFuIGFubm90YXRpb24gR1RTLFxuICAgIC8vIGlmIGl0J3MgYSBudW1iZXIgaXQncyBhIEdUUyB0byBwbG90XG4gICAgcmV0dXJuIChndHMudiB8fCBbXSkuc29tZSh2ID0+IHtcbiAgICAgIGlmICh2W3YubGVuZ3RoIC0gMV0gIT09IG51bGwpIHtcbiAgICAgICAgLy8gbm9pbnNwZWN0aW9uIEpTUG90ZW50aWFsbHlJbnZhbGlkQ29uc3RydWN0b3JVc2FnZVxuICAgICAgICByZXR1cm4gdHlwZW9mICh2W3YubGVuZ3RoIC0gMV0pICE9PSAnbnVtYmVyJyAmJlxuICAgICAgICAgICghIXZbdi5sZW5ndGggLSAxXS5jb25zdHJ1Y3RvciAmJiB2W3YubGVuZ3RoIC0gMV0uY29uc3RydWN0b3IubmFtZSAhPT0gJ0JpZycpICYmXG4gICAgICAgICAgdlt2Lmxlbmd0aCAtIDFdLmNvbnN0cnVjdG9yLnByb3RvdHlwZS50b0ZpeGVkID09PSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgZ3RzU29ydChndHMpIHtcbiAgICBpZiAoZ3RzLmlzU29ydGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGd0cy52ID0gZ3RzLnYuc29ydCgoYSwgYikgPT4gYVswXSAtIGJbMF0pO1xuICAgIGd0cy5pc1NvcnRlZCA9IHRydWU7XG4gIH1cblxuICBzdGF0aWMgZ2V0RGF0YShkYXRhOiBhbnkpOiBEYXRhTW9kZWwge1xuICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBHVFNMaWIuZ2V0RGF0YShKU09OLnBhcnNlKGRhdGEgYXMgc3RyaW5nKSk7XG4gICAgfSBlbHNlIGlmIChkYXRhICYmIGRhdGEuaGFzT3duUHJvcGVydHkoJ2RhdGEnKSkge1xuICAgICAgaWYgKCFHVFNMaWIuaXNBcnJheShkYXRhLmRhdGEpKSB7XG4gICAgICAgIGRhdGEuZGF0YSA9IFtkYXRhLmRhdGFdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRhdGEgYXMgRGF0YU1vZGVsO1xuICAgIH0gZWxzZSBpZiAoR1RTTGliLmlzQXJyYXkoZGF0YSkgJiYgZGF0YS5sZW5ndGggPiAwICYmIGRhdGFbMF0uZGF0YSkge1xuICAgICAgcmV0dXJuIGRhdGFbMF0gYXMgRGF0YU1vZGVsO1xuICAgIH0gZWxzZSBpZiAoR1RTTGliLmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgIHJldHVybiB7ZGF0YTogZGF0YSBhcyBHVFNbXX0gYXMgRGF0YU1vZGVsO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IERhdGFNb2RlbCgpO1xuICB9XG5cbiAgc3RhdGljIGdldERpdmlkZXIodGltZVVuaXQ6IHN0cmluZyk6IG51bWJlciB7XG4gICAgbGV0IHRpbWVzdGFtcERpdmlkZXIgPSAxMDAwOyAvLyBkZWZhdWx0IGZvciDCtXMgdGltZXVuaXRcbiAgICBpZiAodGltZVVuaXQgPT09ICdtcycpIHtcbiAgICAgIHRpbWVzdGFtcERpdmlkZXIgPSAxO1xuICAgIH1cbiAgICBpZiAodGltZVVuaXQgPT09ICducycpIHtcbiAgICAgIHRpbWVzdGFtcERpdmlkZXIgPSAxMDAwMDAwO1xuICAgIH1cbiAgICByZXR1cm4gdGltZXN0YW1wRGl2aWRlcjtcbiAgfVxuXG4gIHN0YXRpYyBmb3JtYXRMYWJlbCA9IChkYXRhOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIGNvbnN0IHNlcmlhbGl6ZWRHVFMgPSBkYXRhLnNwbGl0KCd7Jyk7XG4gICAgbGV0IGRpc3BsYXkgPSBgPHNwYW4gY2xhc3M9XCJndHNJbmZvXCI+PHNwYW4gY2xhc3M9J2d0cy1jbGFzc25hbWUnPiR7c2VyaWFsaXplZEdUU1swXX08L3NwYW4+YDtcbiAgICBpZiAoc2VyaWFsaXplZEdUUy5sZW5ndGggPiAxKSB7XG4gICAgICBkaXNwbGF5ICs9IGA8c3BhbiBjbGFzcz0nZ3RzLXNlcGFyYXRvcic+ezwvc3Bhbj5gO1xuICAgICAgY29uc3QgbGFiZWxzID0gc2VyaWFsaXplZEdUU1sxXS5zdWJzdHIoMCwgc2VyaWFsaXplZEdUU1sxXS5sZW5ndGggLSAxKS5zcGxpdCgnLCcpO1xuICAgICAgaWYgKGxhYmVscy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGxhYmVscy5mb3JFYWNoKChsLCBpKSA9PiB7XG4gICAgICAgICAgY29uc3QgbGFiZWwgPSBsLnNwbGl0KCc9Jyk7XG4gICAgICAgICAgaWYgKGwubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgZGlzcGxheSArPSBgPHNwYW4+PHNwYW4gY2xhc3M9J2d0cy1sYWJlbG5hbWUnPiR7bGFiZWxbMF19PC9zcGFuPlxuPHNwYW4gY2xhc3M9J2d0cy1zZXBhcmF0b3InPj08L3NwYW4+PHNwYW4gY2xhc3M9J2d0cy1sYWJlbHZhbHVlJz4ke2xhYmVsWzFdfTwvc3Bhbj5gO1xuICAgICAgICAgICAgaWYgKGkgIT09IGxhYmVscy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgIGRpc3BsYXkgKz0gYDxzcGFuPiwgPC9zcGFuPmA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGRpc3BsYXkgKz0gYDxzcGFuIGNsYXNzPSdndHMtc2VwYXJhdG9yJz59PC9zcGFuPmA7XG4gICAgfVxuICAgIGlmIChzZXJpYWxpemVkR1RTLmxlbmd0aCA+IDIpIHtcbiAgICAgIGRpc3BsYXkgKz0gYDxzcGFuIGNsYXNzPSdndHMtc2VwYXJhdG9yJz57PC9zcGFuPmA7XG4gICAgICBjb25zdCBsYWJlbHMgPSBzZXJpYWxpemVkR1RTWzJdLnN1YnN0cigwLCBzZXJpYWxpemVkR1RTWzJdLmxlbmd0aCAtIDEpLnNwbGl0KCcsJyk7XG4gICAgICBpZiAobGFiZWxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgbGFiZWxzLmZvckVhY2goKGwsIGkpID0+IHtcbiAgICAgICAgICBjb25zdCBsYWJlbCA9IGwuc3BsaXQoJz0nKTtcbiAgICAgICAgICBpZiAobC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICBkaXNwbGF5ICs9IGA8c3Bhbj48c3BhbiBjbGFzcz0nZ3RzLWF0dHJuYW1lJz4ke2xhYmVsWzBdfTwvc3Bhbj5cbjxzcGFuIGNsYXNzPSdndHMtc2VwYXJhdG9yJz49PC9zcGFuPjxzcGFuIGNsYXNzPSdndHMtYXR0cnZhbHVlJz4ke2xhYmVsWzFdfTwvc3Bhbj5gO1xuICAgICAgICAgICAgaWYgKGkgIT09IGxhYmVscy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgIGRpc3BsYXkgKz0gYDxzcGFuPiwgPC9zcGFuPmA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGRpc3BsYXkgKz0gYDxzcGFuIGNsYXNzPSdndHMtc2VwYXJhdG9yJz59PC9zcGFuPmA7XG4gICAgfVxuICAgIGRpc3BsYXkgKz0gJzwvc3Bhbj4nO1xuICAgIHJldHVybiBkaXNwbGF5O1xuICB9O1xufVxuIl19