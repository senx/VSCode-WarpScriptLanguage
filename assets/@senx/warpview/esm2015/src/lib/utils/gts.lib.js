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
export class GTSLib {
    /**
     * @param {?} actual
     * @return {?}
     */
    static cleanArray(actual) {
        return actual.filter((/**
         * @param {?} i
         * @return {?}
         */
        (i) => !!i));
    }
    /**
     * @param {?} arr
     * @return {?}
     */
    static unique(arr) {
        /** @type {?} */
        const u = {};
        /** @type {?} */
        const a = [];
        for (let i = 0, l = arr.length; i < l; ++i) {
            if (!u.hasOwnProperty(arr[i])) {
                a.push(arr[i]);
                u[arr[i]] = 1;
            }
        }
        return a;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    static isArray(value) {
        return value && typeof value === 'object' && value instanceof Array && typeof value.length === 'number'
            && typeof value.splice === 'function' && !(value.propertyIsEnumerable('length'));
    }
    /**
     * @param {?} elapsed
     * @return {?}
     */
    static formatElapsedTime(elapsed) {
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
    }
    /**
     * @param {?} data
     * @return {?}
     */
    static isValidResponse(data) {
        /** @type {?} */
        let response;
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
    }
    /**
     * @param {?} item
     * @return {?}
     */
    static isEmbeddedImage(item) {
        return !(typeof item !== 'string' || !/^data:image/.test(item));
    }
    /**
     * @param {?} item
     * @return {?}
     */
    static isEmbeddedImageObject(item) {
        return !((item === null) || (item.image === null) ||
            (item.caption === null) || !GTSLib.isEmbeddedImage(item.image));
    }
    /**
     * @param {?} item
     * @return {?}
     */
    static isPositionArray(item) {
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
        p => {
            if (p.length < 2 || p.length > 3) {
                return false;
            }
            for (const j in p) {
                if (typeof p[j] !== 'number') {
                    return false;
                }
            }
        }));
        return true;
    }
    /**
     * @param {?} item
     * @return {?}
     */
    static isPositionsArrayWithValues(item) {
        if ((item === null) || (item.positions === null)) {
            return false;
        }
        (item.positions || []).forEach((/**
         * @param {?} p
         * @return {?}
         */
        p => {
            if (p.length !== 3) {
                return false;
            }
            for (const j in p) {
                if (typeof p[j] !== 'number') {
                    return false;
                }
            }
        }));
        return true;
    }
    /**
     * @param {?} item
     * @return {?}
     */
    static isPositionsArrayWithTwoValues(item) {
        if ((item === null) || (item.positions === null)) {
            return false;
        }
        (item.positions || []).forEach((/**
         * @param {?} p
         * @return {?}
         */
        p => {
            if (p.length !== 4) {
                return false;
            }
            for (const j in p) {
                if (typeof p[j] !== 'number') {
                    return false;
                }
            }
        }));
        return true;
    }
    /**
     * @param {?} json
     * @param {?} id
     * @return {?}
     */
    static gtsFromJSON(json, id) {
        return { gts: { c: json.c, l: json.l, a: json.a, v: json.v, id } };
    }
    /**
     * @param {?} jsonList
     * @param {?} prefixId
     * @return {?}
     */
    static gtsFromJSONList(jsonList, prefixId) {
        /** @type {?} */
        const gtsList = [];
        /** @type {?} */
        let id;
        (jsonList || []).forEach((/**
         * @param {?} item
         * @param {?} i
         * @return {?}
         */
        (item, i) => {
            /** @type {?} */
            let gts = item;
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
                gtsList.push({ image: gts, caption: 'Image', id });
            }
            if (GTSLib.isEmbeddedImageObject(gts)) {
                gtsList.push({ image: gts.image, caption: gts.caption, id });
            }
        }));
        return {
            content: gtsList || [],
        };
    }
    /**
     * @param {?} arr1
     * @return {?}
     */
    static flatDeep(arr1) {
        if (!GTSLib.isArray(arr1)) {
            arr1 = [arr1];
        }
        return arr1.reduce((/**
         * @param {?} acc
         * @param {?} val
         * @return {?}
         */
        (acc, val) => Array.isArray(val) ? acc.concat(GTSLib.flatDeep(val)) : acc.concat(val)), []);
    }
    /**
     * @param {?} a
     * @param {?} r
     * @return {?}
     */
    static flattenGtsIdArray(a, r) {
        /** @type {?} */
        const res = [];
        if (GTSLib.isGts(a)) {
            a = [a];
        }
        (a || []).forEach((/**
         * @param {?} d
         * @return {?}
         */
        d => {
            if (GTSLib.isArray(d)) {
                /** @type {?} */
                const walk = GTSLib.flattenGtsIdArray(d, r);
                res.push(walk.res);
                r = walk.r;
            }
            else if (d && d.v) {
                d.id = r;
                res.push(d);
                r++;
            }
        }));
        return { res, r };
    }
    /**
     * @param {?} input
     * @return {?}
     */
    static sanitizeNames(input) {
        return (input || '').replace(/{/g, '&#123;')
            .replace(/}/g, '&#125;')
            .replace(/,/g, '&#44;')
            .replace(/>/g, '&#62;')
            .replace(/</g, '&#60;')
            .replace(/"/g, '&#34;')
            .replace(/'/g, '&#39;');
    }
    /**
     * @param {?} gts
     * @return {?}
     */
    static serializeGtsMetadata(gts) {
        /** @type {?} */
        const serializedLabels = [];
        /** @type {?} */
        const serializedAttributes = [];
        if (gts.l) {
            Object.keys(gts.l).forEach((/**
             * @param {?} key
             * @return {?}
             */
            (key) => {
                serializedLabels.push(this.sanitizeNames(key + '=' + gts.l[key]));
            }));
        }
        if (gts.a) {
            Object.keys(gts.a).forEach((/**
             * @param {?} key
             * @return {?}
             */
            (key) => {
                serializedAttributes.push(this.sanitizeNames(key + '=' + gts.a[key]));
            }));
        }
        // tslint:disable-next-line:max-line-length
        return `${this.sanitizeNames(gts.c)}{${serializedLabels.join(',')}${serializedAttributes.length > 0 ? ',' : ''}${serializedAttributes.join(',')}}`;
    }
    /**
     * @param {?} item
     * @return {?}
     */
    static isGts(item) {
        return !!item && (item.c === '' || !!item.c) && !!item.v && GTSLib.isArray(item.v);
    }
    /**
     * @param {?} gts
     * @return {?}
     */
    static isGtsToPlot(gts) {
        if (!GTSLib.isGts(gts) || gts.v.length === 0) {
            return false;
        }
        // We look at the first non-null value, if it's a String or Boolean it's an annotation GTS,
        // if it's a number it's a GTS to plot
        return (gts.v || []).some((/**
         * @param {?} v
         * @return {?}
         */
        v => {
            // noinspection JSPotentiallyInvalidConstructorUsage
            return typeof v[v.length - 1] === 'number' || !!v[v.length - 1].constructor.prototype.toFixed;
        }));
    }
    /**
     * @param {?} gts
     * @return {?}
     */
    static isGtsToPlotOnMap(gts) {
        if (!GTSLib.isGts(gts) || gts.v.length === 0) {
            return false;
        }
        // We look at the first non-null value, if it's a String or Boolean it's an annotation GTS,
        // if it's a number it's a GTS to plot
        return (gts.v || []).some((/**
         * @param {?} v
         * @return {?}
         */
        v => {
            // noinspection JSPotentiallyInvalidConstructorUsage
            return v.length >= 3 && (typeof v[v.length - 1] === 'number' || !!v[v.length - 1].constructor.prototype.toFixed);
        }));
    }
    /**
     * @param {?} gts
     * @return {?}
     */
    static isSingletonGTS(gts) {
        if (!GTSLib.isGts(gts) || gts.v.length === 0) {
            return false;
        }
        return (gts.v || []).length === 1;
    }
    /**
     * @param {?} gts
     * @return {?}
     */
    static isGtsToAnnotate(gts) {
        if (!GTSLib.isGts(gts) || gts.v.length === 0) {
            return false;
        }
        // We look at the first non-null value, if it's a String or Boolean it's an annotation GTS,
        // if it's a number it's a GTS to plot
        return (gts.v || []).some((/**
         * @param {?} v
         * @return {?}
         */
        v => {
            if (v[v.length - 1] !== null) {
                // noinspection JSPotentiallyInvalidConstructorUsage
                return typeof (v[v.length - 1]) !== 'number' &&
                    (!!v[v.length - 1].constructor && v[v.length - 1].constructor.name !== 'Big') &&
                    v[v.length - 1].constructor.prototype.toFixed === undefined;
            }
        }));
    }
    /**
     * @param {?} gts
     * @return {?}
     */
    static gtsSort(gts) {
        if (gts.isSorted) {
            return;
        }
        gts.v = gts.v.sort((/**
         * @param {?} a
         * @param {?} b
         * @return {?}
         */
        (a, b) => a[0] - b[0]));
        gts.isSorted = true;
    }
    /**
     * @param {?} data
     * @return {?}
     */
    static getData(data) {
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
    }
    /**
     * @param {?} timeUnit
     * @return {?}
     */
    static getDivider(timeUnit) {
        /** @type {?} */
        let timestampDivider = 1000;
        if (timeUnit === 'ms') {
            timestampDivider = 1;
        }
        if (timeUnit === 'ns') {
            timestampDivider = 1000000;
        }
        return timestampDivider;
    }
}
GTSLib.LOG = new Logger(GTSLib);
GTSLib.formatLabel = (/**
 * @param {?} data
 * @return {?}
 */
(data) => {
    /** @type {?} */
    const serializedGTS = data.split('{');
    /** @type {?} */
    let display = `<span class="gtsInfo"><span class='gts-classname'>${serializedGTS[0]}</span>`;
    if (serializedGTS.length > 1) {
        display += `<span class='gts-separator'>{</span>`;
        /** @type {?} */
        const labels = serializedGTS[1].substr(0, serializedGTS[1].length - 1).split(',');
        if (labels.length > 0) {
            labels.forEach((/**
             * @param {?} l
             * @param {?} i
             * @return {?}
             */
            (l, i) => {
                /** @type {?} */
                const label = l.split('=');
                if (l.length > 1) {
                    display += `<span><span class='gts-labelname'>${label[0]}</span>
<span class='gts-separator'>=</span><span class='gts-labelvalue'>${label[1]}</span>`;
                    if (i !== labels.length - 1) {
                        display += `<span>, </span>`;
                    }
                }
            }));
        }
        display += `<span class='gts-separator'>}</span>`;
    }
    if (serializedGTS.length > 2) {
        display += `<span class='gts-separator'>{</span>`;
        /** @type {?} */
        const labels = serializedGTS[2].substr(0, serializedGTS[2].length - 1).split(',');
        if (labels.length > 0) {
            labels.forEach((/**
             * @param {?} l
             * @param {?} i
             * @return {?}
             */
            (l, i) => {
                /** @type {?} */
                const label = l.split('=');
                if (l.length > 1) {
                    display += `<span><span class='gts-attrname'>${label[0]}</span>
<span class='gts-separator'>=</span><span class='gts-attrvalue'>${label[1]}</span>`;
                    if (i !== labels.length - 1) {
                        display += `<span>, </span>`;
                    }
                }
            }));
        }
        display += `<span class='gts-separator'>}</span>`;
    }
    display += '</span>';
    return display;
});
if (false) {
    /**
     * @type {?}
     * @private
     */
    GTSLib.LOG;
    /** @type {?} */
    GTSLib.formatLabel;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3RzLmxpYi5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzZW54L3dhcnB2aWV3LyIsInNvdXJjZXMiOlsic3JjL2xpYi91dGlscy9ndHMubGliLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUU3QyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sVUFBVSxDQUFDOztBQUdoQyxNQUFNLE9BQU8sTUFBTTs7Ozs7SUFHakIsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFhO1FBQzdCLE9BQU8sTUFBTSxDQUFDLE1BQU07Ozs7UUFBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDO0lBQ25DLENBQUM7Ozs7O0lBRUQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHOztjQUNULENBQUMsR0FBRyxFQUFFOztjQUNOLENBQUMsR0FBRyxFQUFFO1FBQ1osS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRTtZQUMxQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDN0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDZixDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ2Y7U0FDRjtRQUNELE9BQU8sQ0FBQyxDQUFDO0lBQ1gsQ0FBQzs7Ozs7SUFFRCxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUs7UUFDbEIsT0FBTyxLQUFLLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLEtBQUssWUFBWSxLQUFLLElBQUksT0FBTyxLQUFLLENBQUMsTUFB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c0JBQ2hCLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztnQkFDMUIsSUFBSSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtvQkFDaEIsT0FBTyxJQUFJLG9DQUFvQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2tFQUNELEtBQUssQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO29CQUN4RSxJQUFJLENBQUMsS0FBSyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTt3QkFDM0IsT0FBTyxJQUFJLGlCQUFpQixDQUFDO3FCQUM5QjtpQkFDRjtZQUNILENBQUMsRUFBQyxDQUFDO1NBQ0o7UUFDRCxPQUFPLElBQUksc0NBQXNDLENBQUM7S0FDbkQ7SUFDRCxPQUFPLElBQUksU0FBUyxDQUFDO0lBQ3JCLE9BQU8sT0FBTyxDQUFDO0FBQ2pCLENBQUMsRUFBQzs7Ozs7O0lBMVVGLFdBQWdEOztJQW1TaEQsbUJBdUNFIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqICBDb3B5cmlnaHQgMjAyMCAgU2VuWCBTLkEuUy5cbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqL1xuXG5pbXBvcnQge0RhdGFNb2RlbH0gZnJvbSAnLi4vbW9kZWwvZGF0YU1vZGVsJztcbmltcG9ydCB7R1RTfSBmcm9tICcuLi9tb2RlbC9HVFMnO1xuaW1wb3J0IHtMb2dnZXJ9IGZyb20gJy4vbG9nZ2VyJztcblxuLy8gQGR5bmFtaWNcbmV4cG9ydCBjbGFzcyBHVFNMaWIge1xuICBwcml2YXRlIHN0YXRpYyBMT0c6IExvZ2dlciA9IG5ldyBMb2dnZXIoR1RTTGliKTtcblxuICBzdGF0aWMgY2xlYW5BcnJheShhY3R1YWw6IGFueVtdKSB7XG4gICAgcmV0dXJuIGFjdHVhbC5maWx0ZXIoKGkpID0+ICEhaSk7XG4gIH1cblxuICBzdGF0aWMgdW5pcXVlKGFycikge1xuICAgIGNvbnN0IHUgPSB7fTtcbiAgICBjb25zdCBhID0gW107XG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSBhcnIubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICBpZiAoIXUuaGFzT3duUHJvcGVydHkoYXJyW2ldKSkge1xuICAgICAgICBhLnB1c2goYXJyW2ldKTtcbiAgICAgICAgdVthcnJbaV1dID0gMTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGE7XG4gIH1cblxuICBzdGF0aWMgaXNBcnJheSh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlIGluc3RhbmNlb2YgQXJyYXkgJiYgdHlwZW9mIHZhbHVlLmxlbmd0aCA9PT0gJ251bWJlcidcbiAgICAgICYmIHR5cGVvZiB2YWx1ZS5zcGxpY2UgPT09ICdmdW5jdGlvbicgJiYgISh2YWx1ZS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgnbGVuZ3RoJykpO1xuICB9XG5cbiAgc3RhdGljIGZvcm1hdEVsYXBzZWRUaW1lKGVsYXBzZWQ6IG51bWJlcikge1xuICAgIGlmIChlbGFwc2VkIDwgMTAwMCkge1xuICAgICAgcmV0dXJuIGVsYXBzZWQudG9GaXhlZCgzKSArICcgbnMnO1xuICAgIH1cbiAgICBpZiAoZWxhcHNlZCA8IDEwMDAwMDApIHtcbiAgICAgIHJldHVybiAoZWxhcHNlZCAvIDEwMDApLnRvRml4ZWQoMykgKyAnIM68cyc7XG4gICAgfVxuICAgIGlmIChlbGFwc2VkIDwgMTAwMDAwMDAwMCkge1xuICAgICAgcmV0dXJuIChlbGFwc2VkIC8gMTAwMDAwMCkudG9GaXhlZCgzKSArICcgbXMnO1xuICAgIH1cbiAgICBpZiAoZWxhcHNlZCA8IDEwMDAwMDAwMDAwMDApIHtcbiAgICAgIHJldHVybiAoZWxhcHNlZCAvIDEwMDAwMDAwMDApLnRvRml4ZWQoMykgKyAnIHMgJztcbiAgICB9XG4gICAgLy8gTWF4IGV4ZWMgdGltZSBmb3IgbmljZSBvdXRwdXQ6IDk5OS45OTkgbWludXRlcyAoc2hvdWxkIGJlIE9LLCB0aW1lb3V0IHNob3VsZCBoYXBwZW4gYmVmb3JlIHRoYXQpLlxuICAgIHJldHVybiAoZWxhcHNlZCAvIDYwMDAwMDAwMDAwKS50b0ZpeGVkKDMpICsgJyBtICc7XG4gIH1cblxuICBzdGF0aWMgaXNWYWxpZFJlc3BvbnNlKGRhdGEpIHtcbiAgICBsZXQgcmVzcG9uc2U7XG4gICAgdHJ5IHtcbiAgICAgIHJlc3BvbnNlID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aGlzLkxPRy5lcnJvcihbJ2lzVmFsaWRSZXNwb25zZSddLCAnUmVzcG9uc2Ugbm9uIEpTT04gY29tcGxpYW50JywgZGF0YSk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICghR1RTTGliLmlzQXJyYXkocmVzcG9uc2UpKSB7XG4gICAgICB0aGlzLkxPRy5lcnJvcihbJ2lzVmFsaWRSZXNwb25zZSddLCAnUmVzcG9uc2UgaXNuXFwndCBhbiBBcnJheScsIHJlc3BvbnNlKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBzdGF0aWMgaXNFbWJlZGRlZEltYWdlKGl0ZW0pIHtcbiAgICByZXR1cm4gISh0eXBlb2YgaXRlbSAhPT0gJ3N0cmluZycgfHwgIS9eZGF0YTppbWFnZS8udGVzdChpdGVtKSk7XG4gIH1cblxuICBzdGF0aWMgaXNFbWJlZGRlZEltYWdlT2JqZWN0KGl0ZW0pIHtcbiAgICByZXR1cm4gISgoaXRlbSA9PT0gbnVsbCkgfHwgKGl0ZW0uaW1hZ2UgPT09IG51bGwpIHx8XG4gICAgICAoaXRlbS5jYXB0aW9uID09PSBudWxsKSB8fCAhR1RTTGliLmlzRW1iZWRkZWRJbWFnZShpdGVtLmltYWdlKSk7XG4gIH1cblxuICBzdGF0aWMgaXNQb3NpdGlvbkFycmF5KGl0ZW0pIHtcbiAgICBpZiAoIWl0ZW0gfHwgIWl0ZW0ucG9zaXRpb25zKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChHVFNMaWIuaXNQb3NpdGlvbnNBcnJheVdpdGhWYWx1ZXMoaXRlbSkgfHwgR1RTTGliLmlzUG9zaXRpb25zQXJyYXlXaXRoVHdvVmFsdWVzKGl0ZW0pKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgKGl0ZW0ucG9zaXRpb25zIHx8IFtdKS5mb3JFYWNoKHAgPT4ge1xuICAgICAgaWYgKHAubGVuZ3RoIDwgMiB8fCBwLmxlbmd0aCA+IDMpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgZm9yIChjb25zdCBqIGluIHApIHtcbiAgICAgICAgaWYgKHR5cGVvZiBwW2pdICE9PSAnbnVtYmVyJykge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgc3RhdGljIGlzUG9zaXRpb25zQXJyYXlXaXRoVmFsdWVzKGl0ZW0pIHtcbiAgICBpZiAoKGl0ZW0gPT09IG51bGwpIHx8IChpdGVtLnBvc2l0aW9ucyA9PT0gbnVsbCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgKGl0ZW0ucG9zaXRpb25zIHx8IFtdKS5mb3JFYWNoKHAgPT4ge1xuICAgICAgaWYgKHAubGVuZ3RoICE9PSAzKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGZvciAoY29uc3QgaiBpbiBwKSB7XG4gICAgICAgIGlmICh0eXBlb2YgcFtqXSAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHN0YXRpYyBpc1Bvc2l0aW9uc0FycmF5V2l0aFR3b1ZhbHVlcyhpdGVtKSB7XG4gICAgaWYgKChpdGVtID09PSBudWxsKSB8fCAoaXRlbS5wb3NpdGlvbnMgPT09IG51bGwpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIChpdGVtLnBvc2l0aW9ucyB8fCBbXSkuZm9yRWFjaChwID0+IHtcbiAgICAgIGlmIChwLmxlbmd0aCAhPT0gNCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBmb3IgKGNvbnN0IGogaW4gcCkge1xuICAgICAgICBpZiAodHlwZW9mIHBbal0gIT09ICdudW1iZXInKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBzdGF0aWMgZ3RzRnJvbUpTT04oanNvbiwgaWQpIHtcbiAgICByZXR1cm4ge2d0czoge2M6IGpzb24uYywgbDoganNvbi5sLCBhOiBqc29uLmEsIHY6IGpzb24udiwgaWR9fTtcbiAgfVxuXG4gIHN0YXRpYyBndHNGcm9tSlNPTkxpc3QoanNvbkxpc3QsIHByZWZpeElkKSB7XG4gICAgY29uc3QgZ3RzTGlzdCA9IFtdO1xuICAgIGxldCBpZDtcbiAgICAoanNvbkxpc3QgfHwgW10pLmZvckVhY2goKGl0ZW0sIGkpID0+IHtcbiAgICAgIGxldCBndHMgPSBpdGVtO1xuICAgICAgaWYgKGl0ZW0uZ3RzKSB7XG4gICAgICAgIGd0cyA9IGl0ZW0uZ3RzO1xuICAgICAgfVxuICAgICAgaWYgKChwcmVmaXhJZCAhPT0gdW5kZWZpbmVkKSAmJiAocHJlZml4SWQgIT09ICcnKSkge1xuICAgICAgICBpZCA9IHByZWZpeElkICsgJy0nICsgaTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlkID0gaTtcbiAgICAgIH1cbiAgICAgIGlmIChHVFNMaWIuaXNBcnJheShndHMpKSB7XG4gICAgICAgIGd0c0xpc3QucHVzaChHVFNMaWIuZ3RzRnJvbUpTT05MaXN0KGd0cywgaWQpKTtcbiAgICAgIH1cbiAgICAgIGlmIChHVFNMaWIuaXNHdHMoZ3RzKSkge1xuICAgICAgICBndHNMaXN0LnB1c2goR1RTTGliLmd0c0Zyb21KU09OKGd0cywgaWQpKTtcbiAgICAgIH1cbiAgICAgIGlmIChHVFNMaWIuaXNFbWJlZGRlZEltYWdlKGd0cykpIHtcbiAgICAgICAgZ3RzTGlzdC5wdXNoKHtpbWFnZTogZ3RzLCBjYXB0aW9uOiAnSW1hZ2UnLCBpZH0pO1xuICAgICAgfVxuICAgICAgaWYgKEdUU0xpYi5pc0VtYmVkZGVkSW1hZ2VPYmplY3QoZ3RzKSkge1xuICAgICAgICBndHNMaXN0LnB1c2goe2ltYWdlOiBndHMuaW1hZ2UsIGNhcHRpb246IGd0cy5jYXB0aW9uLCBpZH0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB7XG4gICAgICBjb250ZW50OiBndHNMaXN0IHx8IFtdLFxuICAgIH07XG4gIH1cblxuICBzdGF0aWMgZmxhdERlZXAoYXJyMTogYW55W10pOiBhbnlbXSB7XG4gICAgaWYgKCFHVFNMaWIuaXNBcnJheShhcnIxKSkge1xuICAgICAgYXJyMSA9IFthcnIxXTtcbiAgICB9XG4gICAgcmV0dXJuIGFycjEucmVkdWNlKChhY2MsIHZhbCkgPT4gQXJyYXkuaXNBcnJheSh2YWwpID8gYWNjLmNvbmNhdChHVFNMaWIuZmxhdERlZXAodmFsKSkgOiBhY2MuY29uY2F0KHZhbCksIFtdKTtcbiAgfVxuXG4gIHN0YXRpYyBmbGF0dGVuR3RzSWRBcnJheShhOiBhbnlbXSwgcjogbnVtYmVyKTogeyByZXM6IGFueVtdLCByOiBudW1iZXIgfSB7XG4gICAgY29uc3QgcmVzID0gW107XG4gICAgaWYgKEdUU0xpYi5pc0d0cyhhKSkge1xuICAgICAgYSA9IFthXTtcbiAgICB9XG4gICAgKGEgfHwgW10pLmZvckVhY2goZCA9PiB7XG4gICAgICBpZiAoR1RTTGliLmlzQXJyYXkoZCkpIHtcbiAgICAgICAgY29uc3Qgd2FsayA9IEdUU0xpYi5mbGF0dGVuR3RzSWRBcnJheShkLCByKTtcbiAgICAgICAgcmVzLnB1c2god2Fsay5yZXMpO1xuICAgICAgICByID0gd2Fsay5yO1xuICAgICAgfSBlbHNlIGlmIChkICYmIGQudikge1xuICAgICAgICBkLmlkID0gcjtcbiAgICAgICAgcmVzLnB1c2goZCk7XG4gICAgICAgIHIrKztcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4ge3Jlcywgcn07XG4gIH1cblxuICBzdGF0aWMgc2FuaXRpemVOYW1lcyhpbnB1dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gKGlucHV0IHx8ICcnKS5yZXBsYWNlKC97L2csICcmIzEyMzsnKVxuICAgICAgLnJlcGxhY2UoL30vZywgJyYjMTI1OycpXG4gICAgICAucmVwbGFjZSgvLC9nLCAnJiM0NDsnKVxuICAgICAgLnJlcGxhY2UoLz4vZywgJyYjNjI7JylcbiAgICAgIC5yZXBsYWNlKC88L2csICcmIzYwOycpXG4gICAgICAucmVwbGFjZSgvXCIvZywgJyYjMzQ7JylcbiAgICAgIC5yZXBsYWNlKC8nL2csICcmIzM5OycpO1xuICB9XG5cbiAgc3RhdGljIHNlcmlhbGl6ZUd0c01ldGFkYXRhKGd0cykge1xuICAgIGNvbnN0IHNlcmlhbGl6ZWRMYWJlbHMgPSBbXTtcbiAgICBjb25zdCBzZXJpYWxpemVkQXR0cmlidXRlcyA9IFtdO1xuICAgIGlmIChndHMubCkge1xuICAgICAgT2JqZWN0LmtleXMoZ3RzLmwpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICBzZXJpYWxpemVkTGFiZWxzLnB1c2godGhpcy5zYW5pdGl6ZU5hbWVzKGtleSArICc9JyArIGd0cy5sW2tleV0pKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoZ3RzLmEpIHtcbiAgICAgIE9iamVjdC5rZXlzKGd0cy5hKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgc2VyaWFsaXplZEF0dHJpYnV0ZXMucHVzaCh0aGlzLnNhbml0aXplTmFtZXMoa2V5ICsgJz0nICsgZ3RzLmFba2V5XSkpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtbGluZS1sZW5ndGhcbiAgICByZXR1cm4gYCR7dGhpcy5zYW5pdGl6ZU5hbWVzKGd0cy5jKX17JHtzZXJpYWxpemVkTGFiZWxzLmpvaW4oJywnKX0ke3NlcmlhbGl6ZWRBdHRyaWJ1dGVzLmxlbmd0aCA+IDAgPyAnLCcgOiAnJ30ke3NlcmlhbGl6ZWRBdHRyaWJ1dGVzLmpvaW4oJywnKX19YDtcbiAgfVxuXG4gIHN0YXRpYyBpc0d0cyhpdGVtKSB7XG4gICAgcmV0dXJuICEhaXRlbSAmJiAoaXRlbS5jID09PSAnJyB8fCAhIWl0ZW0uYykgJiYgISFpdGVtLnYgJiYgR1RTTGliLmlzQXJyYXkoaXRlbS52KTtcbiAgfVxuXG4gIHN0YXRpYyBpc0d0c1RvUGxvdChndHMpIHtcbiAgICBpZiAoIUdUU0xpYi5pc0d0cyhndHMpIHx8IGd0cy52Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBXZSBsb29rIGF0IHRoZSBmaXJzdCBub24tbnVsbCB2YWx1ZSwgaWYgaXQncyBhIFN0cmluZyBvciBCb29sZWFuIGl0J3MgYW4gYW5ub3RhdGlvbiBHVFMsXG4gICAgLy8gaWYgaXQncyBhIG51bWJlciBpdCdzIGEgR1RTIHRvIHBsb3RcbiAgICByZXR1cm4gKGd0cy52IHx8IFtdKS5zb21lKHYgPT4ge1xuICAgICAgLy8gbm9pbnNwZWN0aW9uIEpTUG90ZW50aWFsbHlJbnZhbGlkQ29uc3RydWN0b3JVc2FnZVxuICAgICAgcmV0dXJuIHR5cGVvZiB2W3YubGVuZ3RoIC0gMV0gPT09ICdudW1iZXInIHx8ICEhdlt2Lmxlbmd0aCAtIDFdLmNvbnN0cnVjdG9yLnByb3RvdHlwZS50b0ZpeGVkO1xuICAgIH0pO1xuICB9XG4gIHN0YXRpYyBpc0d0c1RvUGxvdE9uTWFwKGd0cykge1xuICAgIGlmICghR1RTTGliLmlzR3RzKGd0cykgfHwgZ3RzLnYubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIFdlIGxvb2sgYXQgdGhlIGZpcnN0IG5vbi1udWxsIHZhbHVlLCBpZiBpdCdzIGEgU3RyaW5nIG9yIEJvb2xlYW4gaXQncyBhbiBhbm5vdGF0aW9uIEdUUyxcbiAgICAvLyBpZiBpdCdzIGEgbnVtYmVyIGl0J3MgYSBHVFMgdG8gcGxvdFxuICAgIHJldHVybiAoZ3RzLnYgfHwgW10pLnNvbWUodiA9PiB7XG4gICAgICAvLyBub2luc3BlY3Rpb24gSlNQb3RlbnRpYWxseUludmFsaWRDb25zdHJ1Y3RvclVzYWdlXG4gICAgICByZXR1cm4gdi5sZW5ndGggPj0gMyAmJiAodHlwZW9mIHZbdi5sZW5ndGggLSAxXSA9PT0gJ251bWJlcicgfHwgISF2W3YubGVuZ3RoIC0gMV0uY29uc3RydWN0b3IucHJvdG90eXBlLnRvRml4ZWQpO1xuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIGlzU2luZ2xldG9uR1RTKGd0cykge1xuICAgIGlmICghR1RTTGliLmlzR3RzKGd0cykgfHwgZ3RzLnYubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiAoZ3RzLnYgfHwgW10pLmxlbmd0aCA9PT0gMTtcbiAgfVxuXG4gIHN0YXRpYyBpc0d0c1RvQW5ub3RhdGUoZ3RzKSB7XG4gICAgaWYgKCFHVFNMaWIuaXNHdHMoZ3RzKSB8fCBndHMudi5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8gV2UgbG9vayBhdCB0aGUgZmlyc3Qgbm9uLW51bGwgdmFsdWUsIGlmIGl0J3MgYSBTdHJpbmcgb3IgQm9vbGVhbiBpdCdzIGFuIGFubm90YXRpb24gR1RTLFxuICAgIC8vIGlmIGl0J3MgYSBudW1iZXIgaXQncyBhIEdUUyB0byBwbG90XG4gICAgcmV0dXJuIChndHMudiB8fCBbXSkuc29tZSh2ID0+IHtcbiAgICAgIGlmICh2W3YubGVuZ3RoIC0gMV0gIT09IG51bGwpIHtcbiAgICAgICAgLy8gbm9pbnNwZWN0aW9uIEpTUG90ZW50aWFsbHlJbnZhbGlkQ29uc3RydWN0b3JVc2FnZVxuICAgICAgICByZXR1cm4gdHlwZW9mICh2W3YubGVuZ3RoIC0gMV0pICE9PSAnbnVtYmVyJyAmJlxuICAgICAgICAgICghIXZbdi5sZW5ndGggLSAxXS5jb25zdHJ1Y3RvciAmJiB2W3YubGVuZ3RoIC0gMV0uY29uc3RydWN0b3IubmFtZSAhPT0gJ0JpZycpICYmXG4gICAgICAgICAgdlt2Lmxlbmd0aCAtIDFdLmNvbnN0cnVjdG9yLnByb3RvdHlwZS50b0ZpeGVkID09PSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgZ3RzU29ydChndHMpIHtcbiAgICBpZiAoZ3RzLmlzU29ydGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGd0cy52ID0gZ3RzLnYuc29ydCgoYSwgYikgPT4gYVswXSAtIGJbMF0pO1xuICAgIGd0cy5pc1NvcnRlZCA9IHRydWU7XG4gIH1cblxuICBzdGF0aWMgZ2V0RGF0YShkYXRhOiBhbnkpOiBEYXRhTW9kZWwge1xuICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBHVFNMaWIuZ2V0RGF0YShKU09OLnBhcnNlKGRhdGEgYXMgc3RyaW5nKSk7XG4gICAgfSBlbHNlIGlmIChkYXRhICYmIGRhdGEuaGFzT3duUHJvcGVydHkoJ2RhdGEnKSkge1xuICAgICAgaWYgKCFHVFNMaWIuaXNBcnJheShkYXRhLmRhdGEpKSB7XG4gICAgICAgIGRhdGEuZGF0YSA9IFtkYXRhLmRhdGFdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRhdGEgYXMgRGF0YU1vZGVsO1xuICAgIH0gZWxzZSBpZiAoR1RTTGliLmlzQXJyYXkoZGF0YSkgJiYgZGF0YS5sZW5ndGggPiAwICYmIGRhdGFbMF0uZGF0YSkge1xuICAgICAgcmV0dXJuIGRhdGFbMF0gYXMgRGF0YU1vZGVsO1xuICAgIH0gZWxzZSBpZiAoR1RTTGliLmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgIHJldHVybiB7ZGF0YTogZGF0YSBhcyBHVFNbXX0gYXMgRGF0YU1vZGVsO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IERhdGFNb2RlbCgpO1xuICB9XG5cbiAgc3RhdGljIGdldERpdmlkZXIodGltZVVuaXQ6IHN0cmluZyk6IG51bWJlciB7XG4gICAgbGV0IHRpbWVzdGFtcERpdmlkZXIgPSAxMDAwOyAvLyBkZWZhdWx0IGZvciDCtXMgdGltZXVuaXRcbiAgICBpZiAodGltZVVuaXQgPT09ICdtcycpIHtcbiAgICAgIHRpbWVzdGFtcERpdmlkZXIgPSAxO1xuICAgIH1cbiAgICBpZiAodGltZVVuaXQgPT09ICducycpIHtcbiAgICAgIHRpbWVzdGFtcERpdmlkZXIgPSAxMDAwMDAwO1xuICAgIH1cbiAgICByZXR1cm4gdGltZXN0YW1wRGl2aWRlcjtcbiAgfVxuXG4gIHN0YXRpYyBmb3JtYXRMYWJlbCA9IChkYXRhOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgIGNvbnN0IHNlcmlhbGl6ZWRHVFMgPSBkYXRhLnNwbGl0KCd7Jyk7XG4gICAgbGV0IGRpc3BsYXkgPSBgPHNwYW4gY2xhc3M9XCJndHNJbmZvXCI+PHNwYW4gY2xhc3M9J2d0cy1jbGFzc25hbWUnPiR7c2VyaWFsaXplZEdUU1swXX08L3NwYW4+YDtcbiAgICBpZiAoc2VyaWFsaXplZEdUUy5sZW5ndGggPiAxKSB7XG4gICAgICBkaXNwbGF5ICs9IGA8c3BhbiBjbGFzcz0nZ3RzLXNlcGFyYXRvcic+ezwvc3Bhbj5gO1xuICAgICAgY29uc3QgbGFiZWxzID0gc2VyaWFsaXplZEdUU1sxXS5zdWJzdHIoMCwgc2VyaWFsaXplZEdUU1sxXS5sZW5ndGggLSAxKS5zcGxpdCgnLCcpO1xuICAgICAgaWYgKGxhYmVscy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGxhYmVscy5mb3JFYWNoKChsLCBpKSA9PiB7XG4gICAgICAgICAgY29uc3QgbGFiZWwgPSBsLnNwbGl0KCc9Jyk7XG4gICAgICAgICAgaWYgKGwubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgZGlzcGxheSArPSBgPHNwYW4+PHNwYW4gY2xhc3M9J2d0cy1sYWJlbG5hbWUnPiR7bGFiZWxbMF19PC9zcGFuPlxuPHNwYW4gY2xhc3M9J2d0cy1zZXBhcmF0b3InPj08L3NwYW4+PHNwYW4gY2xhc3M9J2d0cy1sYWJlbHZhbHVlJz4ke2xhYmVsWzFdfTwvc3Bhbj5gO1xuICAgICAgICAgICAgaWYgKGkgIT09IGxhYmVscy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgIGRpc3BsYXkgKz0gYDxzcGFuPiwgPC9zcGFuPmA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGRpc3BsYXkgKz0gYDxzcGFuIGNsYXNzPSdndHMtc2VwYXJhdG9yJz59PC9zcGFuPmA7XG4gICAgfVxuICAgIGlmIChzZXJpYWxpemVkR1RTLmxlbmd0aCA+IDIpIHtcbiAgICAgIGRpc3BsYXkgKz0gYDxzcGFuIGNsYXNzPSdndHMtc2VwYXJhdG9yJz57PC9zcGFuPmA7XG4gICAgICBjb25zdCBsYWJlbHMgPSBzZXJpYWxpemVkR1RTWzJdLnN1YnN0cigwLCBzZXJpYWxpemVkR1RTWzJdLmxlbmd0aCAtIDEpLnNwbGl0KCcsJyk7XG4gICAgICBpZiAobGFiZWxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgbGFiZWxzLmZvckVhY2goKGwsIGkpID0+IHtcbiAgICAgICAgICBjb25zdCBsYWJlbCA9IGwuc3BsaXQoJz0nKTtcbiAgICAgICAgICBpZiAobC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICBkaXNwbGF5ICs9IGA8c3Bhbj48c3BhbiBjbGFzcz0nZ3RzLWF0dHJuYW1lJz4ke2xhYmVsWzBdfTwvc3Bhbj5cbjxzcGFuIGNsYXNzPSdndHMtc2VwYXJhdG9yJz49PC9zcGFuPjxzcGFuIGNsYXNzPSdndHMtYXR0cnZhbHVlJz4ke2xhYmVsWzFdfTwvc3Bhbj5gO1xuICAgICAgICAgICAgaWYgKGkgIT09IGxhYmVscy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgIGRpc3BsYXkgKz0gYDxzcGFuPiwgPC9zcGFuPmA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGRpc3BsYXkgKz0gYDxzcGFuIGNsYXNzPSdndHMtc2VwYXJhdG9yJz59PC9zcGFuPmA7XG4gICAgfVxuICAgIGRpc3BsYXkgKz0gJzwvc3Bhbj4nO1xuICAgIHJldHVybiBkaXNwbGF5O1xuICB9O1xufVxuIl19