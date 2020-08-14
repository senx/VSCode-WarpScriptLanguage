import { EventEmitter, Component, ViewEncapsulation, IterableDiffers, ElementRef, KeyValueDiffers, ViewChild, Input, Output, Renderer2, NgZone, Injectable, ɵɵdefineInjectable, ɵɵinject, HostListener, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { __awaiter } from 'tslib';
import moment__default, { tz } from 'moment-timezone';
import deepEqual from 'deep-equal';
import { restyle, react, purge } from 'plotly.js/dist/plotly';
import { Plots } from 'plotly.js';
import { Subject } from 'rxjs';
import { debounceTime, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import fitty from 'fitty';
import moment from 'moment';
import * as d3 from 'd3';
import { max, scaleBand, scaleLinear, easeLinear, timeDays, sum, range, event as event$1, select as select$1 } from 'd3';
import { select, event } from 'd3-selection';
import Leaflet from 'leaflet';
import 'leaflet.heat';
import 'leaflet.markercluster';
import { create } from 'nouislider';
import { FormsModule } from '@angular/forms';
import { AngularResizedEventModule } from 'angular-resize-event';
import eventDrops from 'event-drops';

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
class DataModel {
}
if (false) {
    /** @type {?} */
    DataModel.prototype.data;
    /** @type {?} */
    DataModel.prototype.params;
    /** @type {?} */
    DataModel.prototype.globalParams;
    /** @type {?} */
    DataModel.prototype.bounds;
}

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
class Logger {
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
LEVEL[LEVEL.DEBUG] = 'DEBUG';
LEVEL[LEVEL.ERROR] = 'ERROR';
LEVEL[LEVEL.WARN] = 'WARN';
LEVEL[LEVEL.INFO] = 'INFO';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// @dynamic
class GTSLib {
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
class ChartBounds {
    constructor() {
        this.tsmin = 0;
        this.tsmax = 0;
        this.msmin = '';
        this.msmax = '';
        this.marginLeft = 0;
    }
}
if (false) {
    /** @type {?} */
    ChartBounds.prototype.tsmin;
    /** @type {?} */
    ChartBounds.prototype.tsmax;
    /** @type {?} */
    ChartBounds.prototype.msmin;
    /** @type {?} */
    ChartBounds.prototype.msmax;
    /** @type {?} */
    ChartBounds.prototype.marginLeft;
}

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
class ColorLib {
    /**
     * @param {?} i
     * @param {?} scheme
     * @return {?}
     */
    static getColor(i, scheme) {
        return ColorLib.color[scheme][i % ColorLib.color[scheme].length];
    }
    /**
     * @param {?} id
     * @param {?} scheme
     * @return {?}
     */
    static getColorGradient(id, scheme) {
        return [
            [0, ColorLib.transparentize(ColorLib.getColor(id, scheme), 0)],
            [1, ColorLib.transparentize(ColorLib.getColor(id, scheme), 0.7)]
        ];
    }
    /**
     * @param {?} id
     * @param {?} scheme
     * @param {?=} bg
     * @return {?}
     */
    static getBlendedColorGradient(id, scheme, bg = '#000000') {
        return [
            [0, ColorLib.blend_colors(bg, ColorLib.getColor(id, scheme), 0)],
            [1, ColorLib.blend_colors(bg, ColorLib.getColor(id, scheme), 1)]
        ];
    }
    /**
     * @param {?} scheme
     * @return {?}
     */
    static getColorScale(scheme) {
        return ColorLib.color[scheme].map((/**
         * @param {?} c
         * @param {?} i
         * @return {?}
         */
        (c, i) => [i, c]));
    }
    /**
     * @param {?} hex
     * @return {?}
     */
    static hexToRgb(hex) {
        /** @type {?} */
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : null;
    }
    /**
     * @param {?} color
     * @param {?=} alpha
     * @return {?}
     */
    static transparentize(color, alpha = 0.5) {
        return 'rgba(' + ColorLib.hexToRgb(color).concat(alpha).join(',') + ')';
    }
    /**
     * @param {?} num
     * @param {?} scheme
     * @return {?}
     */
    static generateColors(num, scheme) {
        /** @type {?} */
        const color = [];
        for (let i = 0; i < num; i++) {
            color.push(ColorLib.getColor(i, scheme));
        }
        return color;
    }
    /**
     * @param {?} num
     * @param {?} scheme
     * @return {?}
     */
    static generateTransparentColors(num, scheme) {
        /** @type {?} */
        const color = [];
        for (let i = 0; i < num; i++) {
            color.push(ColorLib.transparentize(ColorLib.getColor(i, scheme)));
        }
        return color;
    }
    /**
     * @param {?} c1
     * @param {?} c2
     * @param {?} steps
     * @return {?}
     */
    static hsvGradientFromRgbColors(c1, c2, steps) {
        /** @type {?} */
        const c1hsv = ColorLib.rgb2hsv(c1.r, c1.g, c1.b);
        /** @type {?} */
        const c2hsv = ColorLib.rgb2hsv(c2.r, c2.g, c2.b);
        c1.h = c1hsv[0];
        c1.s = c1hsv[1];
        c1.v = c1hsv[2];
        c2.h = c2hsv[0];
        c2.s = c2hsv[1];
        c2.v = c2hsv[2];
        /** @type {?} */
        const gradient = ColorLib.hsvGradient(c1, c2, steps);
        for (const i in gradient) {
            if (gradient[i]) {
                gradient[i].rgb = ColorLib.hsv2rgb(gradient[i].h, gradient[i].s, gradient[i].v);
                gradient[i].r = Math.floor(gradient[i].rgb[0]);
                gradient[i].g = Math.floor(gradient[i].rgb[1]);
                gradient[i].b = Math.floor(gradient[i].rgb[2]);
            }
        }
        return gradient;
    }
    /**
     * @private
     * @param {?} r
     * @param {?} g
     * @param {?} b
     * @return {?}
     */
    static rgb2hsv(r, g, b) {
        // Normalize
        /** @type {?} */
        const normR = r / 255.0;
        /** @type {?} */
        const normG = g / 255.0;
        /** @type {?} */
        const normB = b / 255.0;
        /** @type {?} */
        const M = Math.max(normR, normG, normB);
        /** @type {?} */
        const m = Math.min(normR, normG, normB);
        /** @type {?} */
        const d = M - m;
        /** @type {?} */
        let h;
        /** @type {?} */
        let s;
        /** @type {?} */
        let v;
        v = M;
        if (d === 0) {
            h = 0;
            s = 0;
        }
        else {
            s = d / v;
            switch (M) {
                case normR:
                    h = ((normG - normB) + d * (normG < normB ? 6 : 0)) / 6 * d;
                    break;
                case normG:
                    h = ((normB - normR) + d * 2) / 6 * d;
                    break;
                case normB:
                    h = ((normR - normG) + d * 4) / 6 * d;
                    break;
            }
        }
        return [h, s, v];
    }
    /**
     * @private
     * @param {?} c1
     * @param {?} c2
     * @param {?} steps
     * @return {?}
     */
    static hsvGradient(c1, c2, steps) {
        /** @type {?} */
        const gradient = new Array(steps);
        // determine clockwise and counter-clockwise distance between hues
        /** @type {?} */
        const distCCW = (c1.h >= c2.h) ? c1.h - c2.h : 1 + c1.h - c2.h;
        /** @type {?} */
        const distCW = (c1.h >= c2.h) ? 1 + c2.h - c1.h : c2.h - c1.h;
        // make gradient for this part
        for (let i = 0; i < steps; i++) {
            // interpolate h, s, b
            /** @type {?} */
            let h = (distCW <= distCCW) ? c1.h + (distCW * i / (steps - 1)) : c1.h - (distCCW * i / (steps - 1));
            if (h < 0) {
                h = 1 + h;
            }
            if (h > 1) {
                h = h - 1;
            }
            /** @type {?} */
            const s = (1 - i / (steps - 1)) * c1.s + i / (steps - 1) * c2.s;
            /** @type {?} */
            const v = (1 - i / (steps - 1)) * c1.v + i / (steps - 1) * c2.v;
            // add to gradient array
            gradient[i] = { h, s, v };
        }
        return gradient;
    }
    /**
     * @private
     * @param {?} h
     * @param {?} s
     * @param {?} v
     * @return {?}
     */
    static hsv2rgb(h, s, v) {
        /** @type {?} */
        let r;
        /** @type {?} */
        let g;
        /** @type {?} */
        let b;
        /** @type {?} */
        const i = Math.floor(h * 6);
        /** @type {?} */
        const f = h * 6 - i;
        /** @type {?} */
        const p = v * (1 - s);
        /** @type {?} */
        const q = v * (1 - f * s);
        /** @type {?} */
        const t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0:
                r = v;
                g = t;
                b = p;
                break;
            case 1:
                r = q;
                g = v;
                b = p;
                break;
            case 2:
                r = p;
                g = v;
                b = t;
                break;
            case 3:
                r = p;
                g = q;
                b = v;
                break;
            case 4:
                r = t;
                g = p;
                b = v;
                break;
            case 5:
                r = v;
                g = p;
                b = q;
                break;
        }
        return [r * 255, g * 255, b * 255];
    }
    /**
     * @param {?} r
     * @param {?} g
     * @param {?} b
     * @return {?}
     */
    static rgb2hex(r, g, b) {
        /**
         * @param {?} c
         * @return {?}
         */
        function componentToHex(c) {
            /** @type {?} */
            const hex = c.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }
        return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }
    /**
     * @param {?} color1
     * @param {?} color2
     * @param {?} percentage
     * @return {?}
     */
    static blend_colors(color1, color2, percentage) {
        // check input
        color1 = color1 || '#000000';
        color2 = color2 || '#ffffff';
        percentage = percentage || 0.5;
        // 1: validate input, make sure we have provided a valid hex
        if (color1.length !== 4 && color1.length !== 7) {
            throw new Error('colors must be provided as hexes');
        }
        if (color2.length !== 4 && color2.length !== 7) {
            throw new Error('colors must be provided as hexes');
        }
        if (percentage > 1 || percentage < 0) {
            throw new Error('percentage must be between 0 and 1');
        }
        // 2: check to see if we need to convert 3 char hex to 6 char hex, else slice off hash
        //      the three character hex is just a representation of the 6 hex where each character is repeated
        //      ie: #060 => #006600 (green)
        if (color1.length === 4) {
            color1 = color1[1] + color1[1] + color1[2] + color1[2] + color1[3] + color1[3];
        }
        else {
            color1 = color1.substring(1);
        }
        if (color2.length === 4) {
            color2 = color2[1] + color2[1] + color2[2] + color2[2] + color2[3] + color2[3];
        }
        else {
            color2 = color2.substring(1);
        }
        console.log('valid: c1 => ' + color1 + ', c2 => ' + color2);
        // 3: we have valid input, convert colors to rgb
        color1 = [parseInt(color1[0] + color1[1], 16), parseInt(color1[2] + color1[3], 16), parseInt(color1[4] + color1[5], 16)];
        color2 = [parseInt(color2[0] + color2[1], 16), parseInt(color2[2] + color2[3], 16), parseInt(color2[4] + color2[5], 16)];
        console.log('hex -> rgba: c1 => [' + color1.join(', ') + '], c2 => [' + color2.join(', ') + ']');
        // 4: blend
        /** @type {?} */
        const color3 = [
            (1 - percentage) * color1[0] + percentage * color2[0],
            (1 - percentage) * color1[1] + percentage * color2[1],
            (1 - percentage) * color1[2] + percentage * color2[2]
        ];
        /** @type {?} */
        const color3Str = '#' + ColorLib.int_to_hex(color3[0]) + ColorLib.int_to_hex(color3[1]) + ColorLib.int_to_hex(color3[2]);
        console.log(color3Str);
        // return hex
        return color3Str;
    }
    /*
          convert a Number to a two character hex string
          must round, or we will end up with more digits than expected (2)
          note: can also result in single digit, which will need to be padded with a 0 to the left
          @param: num         => the number to conver to hex
          @returns: string    => the hex representation of the provided number
      */
    /**
     * @param {?} num
     * @return {?}
     */
    static int_to_hex(num) {
        /** @type {?} */
        let hex = Math.round(num).toString(16);
        if (hex.length === 1) {
            hex = '0' + hex;
        }
        return hex;
    }
}
ColorLib.color = {
    COHESIVE: [
        '#F2D354',
        '#E4612F',
        '#D32C2E',
        '#6D2627',
        '#6C7F55',
        '#934FC6',
        '#F07A5D',
        '#ED8371',
        '#94E751',
        '#C457F7',
        '#973AF7',
        '#B6FF7A',
        '#C7FFD5',
        '#90E4D0',
        '#E09234',
        '#D2FF91',
        '#17B201'
    ],
    COHESIVE_2: [
        '#6F694E',
        '#65D0B2',
        '#D8F546',
        '#FF724B',
        '#D6523E',
        '#F9F470',
        '#F4BC78',
        '#B1D637',
        '#FFCFC8',
        '#56CDAB',
        '#CFDD22',
        '#B3F5D2',
        '#97DB29',
        '#9DC5EE',
        '#CFC0F5',
        '#EDEA29',
        '#5EC027',
        '#386C94'
    ],
    BELIZE: [
        '#5899DA',
        '#E8743B',
        '#19A979',
        '#ED4A7B',
        '#945ECF',
        '#13A4B4',
        '#525DF4',
        '#BF399E',
        '#6C8893',
        '#EE6868',
        '#2F6497'
    ],
    VIRIDIS: [
        '#440154',
        '#481f70',
        '#443983',
        '#3b528b',
        '#31688e',
        '#287c8e',
        '#21918c',
        '#20a486',
        '#35b779',
        '#5ec962',
        '#90d743',
        '#c8e020',
    ],
    MAGMA: [
        '#000004',
        '#100b2d',
        '#2c115f',
        '#51127c',
        '#721f81',
        '#932b80',
        '#b73779',
        '#d8456c',
        '#f1605d',
        '#fc8961',
        '#feb078',
        '#fed799',
    ],
    INFERNO: [
        '#000004',
        '#110a30',
        '#320a5e',
        '#57106e',
        '#781c6d',
        '#9a2865',
        '#bc3754',
        '#d84c3e',
        '#ed6925',
        '#f98e09',
        '#fbb61a',
        '#f4df53',
    ],
    PLASMA: [
        '#0d0887',
        '#3a049a',
        '#5c01a6',
        '#7e03a8',
        '#9c179e',
        '#b52f8c',
        '#cc4778',
        '#de5f65',
        '#ed7953',
        '#f89540',
        '#fdb42f',
        '#fbd524',
    ],
    YL_OR_RD: [
        '#ffffcc',
        '#ffeda0',
        '#fed976',
        '#feb24c',
        '#fd8d3c',
        '#fc4e2a',
        '#e31a1c',
        '#bd0026',
        '#800026',
    ],
    YL_GN_BU: [
        '#ffffd9',
        '#edf8b1',
        '#c7e9b4',
        '#7fcdbb',
        '#41b6c4',
        '#1d91c0',
        '#225ea8',
        '#253494',
        '#081d58',
    ],
    BU_GN: [
        '#f7fcfd',
        '#ebf7fa',
        '#dcf2f2',
        '#c8eae4',
        '#aadfd2',
        '#88d1bc',
        '#68c2a3',
        '#4eb485',
        '#37a266',
        '#228c49',
        '#0d7635',
        '#025f27',
    ],
    WARP10: [
        '#ff9900',
        '#004eff',
        '#E53935',
        '#7CB342',
        '#F4511E',
        '#039BE5',
        '#D81B60',
        '#C0CA33',
        '#6D4C41',
        '#8E24AA',
        '#00ACC1',
        '#FDD835',
        '#5E35B1',
        '#00897B',
        '#FFB300',
        '#3949AB',
        '#43A047',
        '#1E88E5',
    ],
    NINETEEN_EIGHTY_FOUR: ['#31C0F6', '#A500A5', '#FF7E27'],
    ATLANTIS: ['#74D495', '#3F3FBA', '#FF4D9E'],
    DO_ANDROIDS_DREAM: ['#8F8AF4', '#A51414', '#F4CF31'],
    DELOREAN: ['#FD7A5D', '#5F1CF2', '#4CE09A'],
    CTHULHU: ['#FDC44F', '#007C76', '#8983FF'],
    ECTOPLASM: ['#DA6FF1', '#00717A', '#ACFF76'],
    T_MAX_400_FILM: ['#F6F6F8', '#A4A8B6', '#545667']
};
if (false) {
    /** @type {?} */
    ColorLib.color;
}

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
class ChartLib {
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
class Param {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @record
 */
function Figure() { }
if (false) {
    /** @type {?} */
    Figure.prototype.data;
    /** @type {?} */
    Figure.prototype.layout;
    /** @type {?} */
    Figure.prototype.frames;
}
class PlotlyComponent {
    /**
     * @param {?} iterableDiffers
     * @param {?} el
     * @param {?} keyValueDiffers
     */
    constructor(iterableDiffers, el, keyValueDiffers) {
        this.iterableDiffers = iterableDiffers;
        this.el = el;
        this.keyValueDiffers = keyValueDiffers;
        this.defaultClassName = 'js-plotly-plot';
        this.revision = 0;
        this.debug = false;
        this.useResizeHandler = false;
        this.updateOnLayoutChange = true;
        this.updateOnDataChange = true;
        this.updateOnlyWithRevision = true;
        this.initialized = new EventEmitter();
        this.update = new EventEmitter();
        this.purge = new EventEmitter();
        this.error = new EventEmitter();
        this.afterExport = new EventEmitter();
        this.afterPlot = new EventEmitter();
        this.animated = new EventEmitter();
        this.animatingFrame = new EventEmitter();
        this.animationInterrupted = new EventEmitter();
        this.autoSize = new EventEmitter();
        this.beforeExport = new EventEmitter();
        this.buttonClicked = new EventEmitter();
        this.click = new EventEmitter();
        this.plotly_click = new EventEmitter();
        this.clickAnnotation = new EventEmitter();
        this.deselect = new EventEmitter();
        this.doubleClick = new EventEmitter();
        this.framework = new EventEmitter();
        this.hover = new EventEmitter();
        this.legendClick = new EventEmitter();
        this.legendDoubleClick = new EventEmitter();
        this.relayout = new EventEmitter();
        this.restyle = new EventEmitter();
        this.redraw = new EventEmitter();
        this.selected = new EventEmitter();
        this.selecting = new EventEmitter();
        this.sliderChange = new EventEmitter();
        this.sliderEnd = new EventEmitter();
        this.sliderStart = new EventEmitter();
        this.transitioning = new EventEmitter();
        this.transitionInterrupted = new EventEmitter();
        this.unhover = new EventEmitter();
        this.relayouting = new EventEmitter();
        this.eventNames = [
            // 'afterExport',
            //   'afterPlot', // 'animated', 'animatingFrame', 'animationInterrupted', 'autoSize',
            // 'beforeExport', 'buttonClicked', 'clickAnnotation', 'deselect', 'doubleClick', 'framework',
            'hover', 'unhover',
            // 'legendClick', 'legendDoubleClick',
            'relayout',
        ];
        this.LOG = new Logger(PlotlyComponent, this.debug);
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.createPlot().then((/**
         * @return {?}
         */
        () => {
            /** @type {?} */
            const figure = this.createFigure();
            this.LOG.debug(['figure'], figure);
            this.initialized.emit(this.plotlyInstance);
        }));
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (typeof this.resizeHandler === 'function') {
            this.getWindow().removeEventListener('resize', (/** @type {?} */ (this.resizeHandler)));
            this.resizeHandler = undefined;
        }
        /** @type {?} */
        const figure = this.createFigure();
        this.purge.emit(figure);
        this.remove(this.plotlyInstance);
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        this.LOG.debug(['ngOnChanges'], changes);
        /** @type {?} */
        const revision = changes.revision;
        if (changes.debug) {
            this.debug = changes.debug.currentValue;
        }
        if ((revision && !revision.isFirstChange()) || !!changes.layout || !!changes.data || !!changes.config) {
            this.updatePlot();
        }
        if (!!changes.debug) {
            this.LOG.setDebug(changes.debug.currentValue);
        }
        this.updateWindowResizeHandler();
        this.LOG.debug(['ngOnChanges'], changes);
    }
    /**
     * @return {?}
     */
    ngDoCheck() {
        if (this.updateOnlyWithRevision) {
            return false;
        }
        /** @type {?} */
        let shouldUpdate = false;
        if (this.updateOnLayoutChange) {
            if (this.layoutDiffer) {
                /** @type {?} */
                const layoutHasDiff = this.layoutDiffer.diff(this.layout);
                if (layoutHasDiff) {
                    shouldUpdate = true;
                }
            }
            else if (this.layout) {
                this.layoutDiffer = this.keyValueDiffers.find(this.layout).create();
            }
            else {
                this.layoutDiffer = undefined;
            }
        }
        if (this.updateOnDataChange) {
            if (this.dataDiffer) {
                /** @type {?} */
                const dataHasDiff = this.dataDiffer.diff(this.data);
                if (dataHasDiff) {
                    shouldUpdate = true;
                }
            }
            else if (Array.isArray(this.data)) {
                this.dataDiffer = this.iterableDiffers.find(this.data).create(this.dataDifferTrackBy);
            }
            else {
                this.dataDiffer = undefined;
            }
        }
        if (shouldUpdate && this.plotlyInstance) {
            this.updatePlot();
        }
    }
    /**
     * @return {?}
     */
    getWindow() {
        return window;
    }
    /**
     * @return {?}
     */
    getBoundingClientRect() {
        return this.rect;
    }
    /**
     * @return {?}
     */
    getClassName() {
        /** @type {?} */
        let classes = [this.defaultClassName];
        if (Array.isArray(this.className)) {
            classes = classes.concat(this.className);
        }
        else if (this.className) {
            classes.push(this.className);
        }
        return classes.join(' ');
    }
    /**
     * @param {?} properties
     * @param {?} curves
     * @return {?}
     */
    restyleChart(properties, curves) {
        restyle(this.plotlyInstance, properties, curves);
    }
    /**
     * @return {?}
     */
    createPlot() {
        this.LOG.debug(['createPlot'], this.data, this.layout, this.config, this.plotlyInstance);
        return react(this.plotEl.nativeElement, this.data, this.layout, this.config).then((/**
         * @param {?} plotlyInstance
         * @return {?}
         */
        plotlyInstance => {
            this.rect = this.el.nativeElement.getBoundingClientRect();
            this.plotlyInstance = plotlyInstance;
            this.LOG.debug(['plotlyInstance'], plotlyInstance);
            this.getWindow().gd = this.debug ? plotlyInstance : undefined;
            this.eventNames.forEach((/**
             * @param {?} name
             * @return {?}
             */
            name => {
                /** @type {?} */
                const eventName = `plotly_${name.toLowerCase()}`;
                // @ts-ignore
                plotlyInstance.on(eventName, (/**
                 * @param {?} data
                 * @return {?}
                 */
                (data) => {
                    this.LOG.debug(['plotlyEvent', eventName], data);
                    ((/** @type {?} */ (this[name]))).emit(data);
                }));
            }));
            plotlyInstance.on('plotly_click', (/**
             * @param {?} data
             * @return {?}
             */
            (data) => {
                this.click.emit(data);
                this.plotly_click.emit(data);
            }));
            this.updateWindowResizeHandler();
            this.afterPlot.emit(plotlyInstance);
        }), (/**
         * @param {?} err
         * @return {?}
         */
        err => {
            console.error('Error while plotting:', err);
            this.error.emit(err);
        }));
    }
    /**
     * @return {?}
     */
    createFigure() {
        /** @type {?} */
        const p = this.plotlyInstance;
        return {
            data: p.data,
            layout: p.layout,
            frames: p._transitionData ? p._transitionData._frames : null
        };
    }
    /**
     * @return {?}
     */
    updatePlot() {
        this.LOG.debug(['updatePlot'], this.data, this.layout, Object.assign({}, this.config));
        if (!this.plotlyInstance) {
            /** @type {?} */
            const error = new Error(`Plotly component wasn't initialized`);
            this.error.emit(error);
            return;
        }
        purge(this.plotlyInstance);
        this.createPlot().then((/**
         * @return {?}
         */
        () => {
            /** @type {?} */
            const figure = this.createFigure();
            this.update.emit(figure);
        }), (/**
         * @param {?} err
         * @return {?}
         */
        err => {
            console.error('Error while updating plot:', err);
            this.error.emit(err);
        }));
    }
    /**
     * @return {?}
     */
    updateWindowResizeHandler() {
        if (this.useResizeHandler) {
            if (this.resizeHandler === undefined) {
                this.resizeHandler = (/**
                 * @return {?}
                 */
                () => setTimeout((/**
                 * @return {?}
                 */
                () => Plots.resize(this.plotlyInstance))));
                this.getWindow().addEventListener('resize', (/** @type {?} */ (this.resizeHandler)));
            }
        }
        else {
            if (typeof this.resizeHandler === 'function') {
                this.getWindow().removeEventListener('resize', (/** @type {?} */ (this.resizeHandler)));
                this.resizeHandler = undefined;
            }
        }
    }
    /**
     * @param {?} _
     * @param {?} item
     * @return {?}
     */
    dataDifferTrackBy(_, item) {
        /** @type {?} */
        const obj = Object.assign({}, item, { uid: '' });
        return JSON.stringify(obj);
    }
    /**
     * @param {?} div
     * @return {?}
     */
    remove(div) {
        purge(div);
        delete this.plotlyInstance;
    }
}
PlotlyComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-plotly',
                template: "<div #plot [attr.id]=\"divId\" [className]=\"getClassName()\" [ngStyle]=\"style\"></div>\n\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}.js-plotly-plot .plotly,.js-plotly-plot .plotly div{direction:ltr;font-family:'Open Sans',verdana,arial,sans-serif;margin:0;padding:0}.js-plotly-plot .plotly button,.js-plotly-plot .plotly input{font-family:'Open Sans',verdana,arial,sans-serif}.js-plotly-plot .plotly button:focus,.js-plotly-plot .plotly input:focus{outline:0}.js-plotly-plot .plotly a,.js-plotly-plot .plotly a:hover{text-decoration:none}.js-plotly-plot .plotly .crisp{shape-rendering:crispEdges}.js-plotly-plot .plotly .user-select-none{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;-o-user-select:none;user-select:none}.js-plotly-plot .plotly svg{overflow:hidden}.js-plotly-plot .plotly svg a{fill:#447adb}.js-plotly-plot .plotly svg a:hover{fill:#3c6dc5}.js-plotly-plot .plotly .main-svg{position:absolute;top:0;left:0;pointer-events:none}.js-plotly-plot .plotly .main-svg .draglayer{pointer-events:all}.js-plotly-plot .plotly .cursor-default{cursor:default}.js-plotly-plot .plotly .cursor-pointer{cursor:pointer}.js-plotly-plot .plotly .cursor-crosshair{cursor:crosshair}.js-plotly-plot .plotly .cursor-move{cursor:move}.js-plotly-plot .plotly .cursor-col-resize{cursor:col-resize}.js-plotly-plot .plotly .cursor-row-resize{cursor:row-resize}.js-plotly-plot .plotly .cursor-ns-resize{cursor:ns-resize}.js-plotly-plot .plotly .cursor-ew-resize{cursor:ew-resize}.js-plotly-plot .plotly .cursor-sw-resize{cursor:sw-resize}.js-plotly-plot .plotly .cursor-s-resize{cursor:s-resize}.js-plotly-plot .plotly .cursor-se-resize{cursor:se-resize}.js-plotly-plot .plotly .cursor-w-resize{cursor:w-resize}.js-plotly-plot .plotly .cursor-e-resize{cursor:e-resize}.js-plotly-plot .plotly .cursor-nw-resize{cursor:nw-resize}.js-plotly-plot .plotly .cursor-n-resize{cursor:n-resize}.js-plotly-plot .plotly .cursor-ne-resize{cursor:ne-resize}.js-plotly-plot .plotly .cursor-grab{cursor:-webkit-grab;cursor:grab}.js-plotly-plot .plotly .modebar{position:absolute;top:2px;right:2px}.js-plotly-plot .plotly .ease-bg{-webkit-transition:background-color .3s;transition:background-color .3s}.js-plotly-plot .plotly .modebar--hover>:not(.watermark){opacity:0;-webkit-transition:opacity .3s;transition:opacity .3s}.js-plotly-plot .plotly:hover .modebar--hover .modebar-group{opacity:1}.js-plotly-plot .plotly .modebar-group{float:left;display:inline-block;box-sizing:border-box;padding-left:8px;position:relative;vertical-align:middle;white-space:nowrap}.js-plotly-plot .plotly .modebar-btn{position:relative;font-size:16px;padding:3px 4px;height:22px;cursor:pointer;line-height:normal;box-sizing:border-box}.js-plotly-plot .plotly .modebar-btn svg{position:relative;top:2px}.js-plotly-plot .plotly .modebar.vertical{display:-webkit-box;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;flex-direction:column;flex-wrap:wrap;align-content:flex-end;max-height:100%}.js-plotly-plot .plotly .modebar.vertical svg{top:-1px}.js-plotly-plot .plotly .modebar.vertical .modebar-group{display:block;float:none;padding-left:0;padding-bottom:8px}.js-plotly-plot .plotly .modebar.vertical .modebar-group .modebar-btn{display:block;text-align:center}.js-plotly-plot .plotly [data-title]:after,.js-plotly-plot .plotly [data-title]:before{position:absolute;-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0);display:none;opacity:0;z-index:1001;pointer-events:none;top:110%;right:50%}.js-plotly-plot .plotly [data-title]:hover:after,.js-plotly-plot .plotly [data-title]:hover:before{display:block;opacity:1}.js-plotly-plot .plotly [data-title]:before{content:'';position:absolute;background:0 0;border:6px solid transparent;z-index:1002;margin-top:-12px;border-bottom-color:#69738a;margin-right:-6px}.js-plotly-plot .plotly [data-title]:after{content:attr(data-title);background:#69738a;color:#fff;padding:8px 10px;font-size:12px;line-height:12px;white-space:nowrap;margin-right:-18px;border-radius:2px}.js-plotly-plot .plotly .vertical [data-title]:after,.js-plotly-plot .plotly .vertical [data-title]:before{top:0;right:200%}.js-plotly-plot .plotly .vertical [data-title]:before{border:6px solid transparent;border-left-color:#69738a;margin-top:8px;margin-right:-30px}.js-plotly-plot .plotly .select-outline{fill:none;stroke-width:1;shape-rendering:crispEdges}.js-plotly-plot .plotly .select-outline-1{stroke:#fff}.js-plotly-plot .plotly .select-outline-2{stroke:#000;stroke-dasharray:2px 2px}.plotly-notifier{font-family:'Open Sans',verdana,arial,sans-serif;position:fixed;top:50px;right:20px;z-index:10000;font-size:10pt;max-width:180px}.plotly-notifier p{margin:0}.plotly-notifier .notifier-note{min-width:180px;max-width:250px;border:1px solid #fff;z-index:3000;margin:0;background-color:rgba(140,151,175,.9);color:#fff;padding:10px;overflow-wrap:break-word;word-wrap:break-word;-ms-hyphens:auto;-webkit-hyphens:auto;hyphens:auto}.plotly-notifier .notifier-close{color:#fff;opacity:.8;float:right;padding:0 5px;background:0 0;border:none;font-size:20px;font-weight:700;line-height:20px}.plotly-notifier .notifier-close:hover{color:#444;text-decoration:none;cursor:pointer}:host .ylines-above{stroke:var(--warp-view-chart-grid-color)!important}:host .xtick>text,:host .ytick>text{fill:var(--warp-view-font-color)!important}:host .modebar-btn path{fill:var(--warp-view-font-color)!important}"]
            }] }
];
/** @nocollapse */
PlotlyComponent.ctorParameters = () => [
    { type: IterableDiffers },
    { type: ElementRef },
    { type: KeyValueDiffers }
];
PlotlyComponent.propDecorators = {
    plotEl: [{ type: ViewChild, args: ['plot', { static: true },] }],
    data: [{ type: Input }],
    layout: [{ type: Input }],
    config: [{ type: Input }],
    frames: [{ type: Input }],
    style: [{ type: Input }],
    divId: [{ type: Input }],
    revision: [{ type: Input }],
    className: [{ type: Input }],
    debug: [{ type: Input }],
    useResizeHandler: [{ type: Input }],
    updateOnLayoutChange: [{ type: Input }],
    updateOnDataChange: [{ type: Input }],
    updateOnlyWithRevision: [{ type: Input }],
    initialized: [{ type: Output }],
    update: [{ type: Output }],
    purge: [{ type: Output }],
    error: [{ type: Output }],
    afterExport: [{ type: Output }],
    afterPlot: [{ type: Output }],
    animated: [{ type: Output }],
    animatingFrame: [{ type: Output }],
    animationInterrupted: [{ type: Output }],
    autoSize: [{ type: Output }],
    beforeExport: [{ type: Output }],
    buttonClicked: [{ type: Output }],
    click: [{ type: Output }],
    plotly_click: [{ type: Output }],
    clickAnnotation: [{ type: Output }],
    deselect: [{ type: Output }],
    doubleClick: [{ type: Output }],
    framework: [{ type: Output }],
    hover: [{ type: Output }],
    legendClick: [{ type: Output }],
    legendDoubleClick: [{ type: Output }],
    relayout: [{ type: Output }],
    restyle: [{ type: Output }],
    redraw: [{ type: Output }],
    selected: [{ type: Output }],
    selecting: [{ type: Output }],
    sliderChange: [{ type: Output }],
    sliderEnd: [{ type: Output }],
    sliderStart: [{ type: Output }],
    transitioning: [{ type: Output }],
    transitionInterrupted: [{ type: Output }],
    unhover: [{ type: Output }],
    relayouting: [{ type: Output }]
};
if (false) {
    /**
     * @type {?}
     * @protected
     */
    PlotlyComponent.prototype.defaultClassName;
    /**
     * @type {?}
     * @protected
     */
    PlotlyComponent.prototype.LOG;
    /** @type {?} */
    PlotlyComponent.prototype.plotlyInstance;
    /** @type {?} */
    PlotlyComponent.prototype.resizeHandler;
    /** @type {?} */
    PlotlyComponent.prototype.layoutDiffer;
    /** @type {?} */
    PlotlyComponent.prototype.dataDiffer;
    /** @type {?} */
    PlotlyComponent.prototype.plotEl;
    /** @type {?} */
    PlotlyComponent.prototype.data;
    /** @type {?} */
    PlotlyComponent.prototype.layout;
    /** @type {?} */
    PlotlyComponent.prototype.config;
    /** @type {?} */
    PlotlyComponent.prototype.frames;
    /** @type {?} */
    PlotlyComponent.prototype.style;
    /** @type {?} */
    PlotlyComponent.prototype.divId;
    /** @type {?} */
    PlotlyComponent.prototype.revision;
    /** @type {?} */
    PlotlyComponent.prototype.className;
    /** @type {?} */
    PlotlyComponent.prototype.debug;
    /** @type {?} */
    PlotlyComponent.prototype.useResizeHandler;
    /** @type {?} */
    PlotlyComponent.prototype.updateOnLayoutChange;
    /** @type {?} */
    PlotlyComponent.prototype.updateOnDataChange;
    /** @type {?} */
    PlotlyComponent.prototype.updateOnlyWithRevision;
    /** @type {?} */
    PlotlyComponent.prototype.initialized;
    /** @type {?} */
    PlotlyComponent.prototype.update;
    /** @type {?} */
    PlotlyComponent.prototype.purge;
    /** @type {?} */
    PlotlyComponent.prototype.error;
    /** @type {?} */
    PlotlyComponent.prototype.afterExport;
    /** @type {?} */
    PlotlyComponent.prototype.afterPlot;
    /** @type {?} */
    PlotlyComponent.prototype.animated;
    /** @type {?} */
    PlotlyComponent.prototype.animatingFrame;
    /** @type {?} */
    PlotlyComponent.prototype.animationInterrupted;
    /** @type {?} */
    PlotlyComponent.prototype.autoSize;
    /** @type {?} */
    PlotlyComponent.prototype.beforeExport;
    /** @type {?} */
    PlotlyComponent.prototype.buttonClicked;
    /** @type {?} */
    PlotlyComponent.prototype.click;
    /** @type {?} */
    PlotlyComponent.prototype.plotly_click;
    /** @type {?} */
    PlotlyComponent.prototype.clickAnnotation;
    /** @type {?} */
    PlotlyComponent.prototype.deselect;
    /** @type {?} */
    PlotlyComponent.prototype.doubleClick;
    /** @type {?} */
    PlotlyComponent.prototype.framework;
    /** @type {?} */
    PlotlyComponent.prototype.hover;
    /** @type {?} */
    PlotlyComponent.prototype.legendClick;
    /** @type {?} */
    PlotlyComponent.prototype.legendDoubleClick;
    /** @type {?} */
    PlotlyComponent.prototype.relayout;
    /** @type {?} */
    PlotlyComponent.prototype.restyle;
    /** @type {?} */
    PlotlyComponent.prototype.redraw;
    /** @type {?} */
    PlotlyComponent.prototype.selected;
    /** @type {?} */
    PlotlyComponent.prototype.selecting;
    /** @type {?} */
    PlotlyComponent.prototype.sliderChange;
    /** @type {?} */
    PlotlyComponent.prototype.sliderEnd;
    /** @type {?} */
    PlotlyComponent.prototype.sliderStart;
    /** @type {?} */
    PlotlyComponent.prototype.transitioning;
    /** @type {?} */
    PlotlyComponent.prototype.transitionInterrupted;
    /** @type {?} */
    PlotlyComponent.prototype.unhover;
    /** @type {?} */
    PlotlyComponent.prototype.relayouting;
    /** @type {?} */
    PlotlyComponent.prototype.eventNames;
    /** @type {?} */
    PlotlyComponent.prototype.rect;
    /** @type {?} */
    PlotlyComponent.prototype.iterableDiffers;
    /** @type {?} */
    PlotlyComponent.prototype.el;
    /** @type {?} */
    PlotlyComponent.prototype.keyValueDiffers;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @abstract
 */
class WarpViewComponent {
    /**
     * @protected
     * @param {?} el
     * @param {?} renderer
     * @param {?} sizeService
     * @param {?} ngZone
     */
    constructor(el, renderer, sizeService, ngZone) {
        this.el = el;
        this.renderer = renderer;
        this.sizeService = sizeService;
        this.ngZone = ngZone;
        this.width = ChartLib.DEFAULT_WIDTH;
        this.height = ChartLib.DEFAULT_HEIGHT;
        this.chartDraw = new EventEmitter();
        this._options = new Param();
        this.defOptions = (/** @type {?} */ (ChartLib.mergeDeep(this._options, {
            dotsLimit: 1000,
            heatControls: false,
            timeMode: 'date',
            showRangeSelector: true,
            gridLineColor: '#8e8e8e',
            showDots: false,
            timeZone: 'UTC',
            timeUnit: 'us',
            showControls: true,
            bounds: {}
        })));
        this._debug = false;
        this._showLegend = false;
        this._responsive = true;
        this._unit = '';
        this._autoResize = true;
        this._hiddenData = [];
        this.tooltipPosition = { top: '-10000px', left: '-1000px' };
        this.loading = true;
        this.noData = false;
        this.layout = {
            margin: {
                t: 10,
                b: 25,
                r: 10,
                l: 10
            }
        };
        this.plotlyConfig = {
            responsive: true,
            showAxisDragHandles: true,
            scrollZoom: true,
            doubleClick: 'reset+autosize',
            showTips: true,
            plotGlPixelRatio: 1,
            staticPlot: false,
            displaylogo: false,
            modeBarButtonsToRemove: [
                'lasso2d', 'select2d', 'toggleSpikelines', 'toggleHover', 'hoverClosest3d', 'autoScale2d',
                'hoverClosestGeo', 'hoverClosestGl2d', 'hoverClosestPie', 'toggleHover',
                'hoverClosestCartesian', 'hoverCompareCartesian'
            ]
        };
        this.sizeService.sizeChanged$.subscribe((/**
         * @param {?} size
         * @return {?}
         */
        (size) => {
            if (((/** @type {?} */ (el.nativeElement))).parentElement) {
                /** @type {?} */
                const parentSize = ((/** @type {?} */ (el.nativeElement))).parentElement.getBoundingClientRect();
                if (this._responsive) {
                    this.height = parentSize.height;
                    this.width = parentSize.width;
                }
                if (!!this.graph && this._responsive && parentSize.height > 0) {
                    /** @type {?} */
                    const layout = {
                        width: parentSize.width,
                        height: this._autoResize ? parentSize.height : this.layout.height
                    };
                    if (this.layout.width !== layout.width || this.layout.height !== layout.height) {
                        setTimeout((/**
                         * @return {?}
                         */
                        () => this.layout = Object.assign({}, this.layout, layout)));
                        this.LOG.debug(['sizeChanged$'], this.layout.width, this.layout.height);
                        this.graph.updatePlot();
                    }
                }
            }
        }));
    }
    /**
     * @param {?} hiddenData
     * @return {?}
     */
    set hiddenData(hiddenData) {
        this._hiddenData = hiddenData;
    }
    /**
     * @return {?}
     */
    get hiddenData() {
        return this._hiddenData;
    }
    /**
     * @param {?} unit
     * @return {?}
     */
    set unit(unit) {
        this._unit = unit;
        this.update(undefined, false);
    }
    /**
     * @return {?}
     */
    get unit() {
        return this._unit;
    }
    /**
     * @param {?} debug
     * @return {?}
     */
    set debug(debug) {
        if (typeof debug === 'string') {
            debug = 'true' === debug;
        }
        this._debug = debug;
        this.LOG.setDebug(debug);
    }
    /**
     * @return {?}
     */
    get debug() {
        return this._debug;
    }
    /**
     * @param {?} showLegend
     * @return {?}
     */
    set showLegend(showLegend) {
        if (typeof showLegend === 'string') {
            showLegend = 'true' === showLegend;
        }
        this._showLegend = showLegend;
    }
    /**
     * @return {?}
     */
    get showLegend() {
        return this._showLegend;
    }
    /**
     * @param {?} responsive
     * @return {?}
     */
    set responsive(responsive) {
        if (typeof responsive === 'string') {
            responsive = 'true' === responsive;
        }
        this._responsive = responsive;
    }
    /**
     * @return {?}
     */
    get responsive() {
        return this._responsive;
    }
    /**
     * @param {?} options
     * @return {?}
     */
    set options(options) {
        this.LOG.debug(['onOptions'], options);
        if (typeof options === 'string') {
            options = JSON.parse(options);
        }
        if (!deepEqual(options, this._options)) {
            this.LOG.debug(['onOptions', 'changed'], options);
            this._options = (/** @type {?} */ (ChartLib.mergeDeep(this._options, (/** @type {?} */ (options)))));
            this.update(this._options, false);
        }
    }
    /**
     * @param {?} data
     * @return {?}
     */
    set data(data) {
        this.LOG.debug(['onData'], data);
        if (data) {
            this._data = GTSLib.getData(data);
            this.update(this._options, true);
            this.LOG.debug(['onData'], this._data);
        }
    }
    /**
     * @protected
     * @param {?} x
     * @param {?} series
     * @param {?=} highlighted
     * @return {?}
     */
    legendFormatter(x, series, highlighted = -1) {
        /** @type {?} */
        const displayedCurves = [];
        if (x === null) {
            // This happens when there's no selection and {legend: 'always'} is set.
            return `<br>
      ${series.map((/**
             * @param {?} s
             * @return {?}
             */
            s => {
                // FIXME :  if (!s.isVisible) return;
                /** @type {?} */
                let labeledData = GTSLib.formatLabel(s.data.text || '') + ': ' + ((this._options.horizontal ? s.x : s.y) || s.r || '');
                /** @type {?} */
                let color = s.data.line.color;
                if (!!s.data.marker) {
                    if (GTSLib.isArray(s.data.marker.color)) {
                        color = s.data.marker.color[0];
                    }
                    else {
                        color = s.data.marker.color;
                    }
                }
                if (s.curveNumber === highlighted) {
                    labeledData = `<i class="chip"
    style="background-color: ${color};border: 2px solid ${color};"></i> ${labeledData}`;
                }
                return labeledData;
            })).join('<br>')}`;
        }
        /** @type {?} */
        let html = '';
        if (!!series[0]) {
            x = series[0].x || series[0].theta;
        }
        html += `<b>${x}</b><br />`;
        // put the highlighted one(s?) first, keep only visibles, keep only 50 first ones.
        series = series.sort((/**
         * @param {?} sa
         * @param {?} sb
         * @return {?}
         */
        (sa, sb) => (sa.curveNumber === highlighted) ? -1 : 1));
        series
            // .filter(s => s.isVisible && s.yHTML)
            .slice(0, 50)
            .forEach((/**
         * @param {?} s
         * @param {?} i
         * @return {?}
         */
        (s, i) => {
            if (displayedCurves.indexOf(s.curveNumber) <= -1) {
                displayedCurves.push(s.curveNumber);
                /** @type {?} */
                let value = series[0].data.orientation === 'h' ? s.x : s.y;
                if (!value && value !== 0) {
                    value = s.r;
                }
                /** @type {?} */
                let labeledData = GTSLib.formatLabel(s.data.text || '') + ': ' + value;
                if (s.curveNumber === highlighted) {
                    labeledData = `<b>${labeledData}</b>`;
                }
                /** @type {?} */
                let color = s.data.line ? s.data.line.color : '';
                if (!!s.data.marker) {
                    if (GTSLib.isArray(s.data.marker.color)) {
                        color = s.data.marker.color[0];
                    }
                    else {
                        color = s.data.marker.color;
                    }
                }
                html += `<i class="chip" style="background-color: ${color};border: 2px solid ${color};"></i>&nbsp;${labeledData}`;
                if (i < series.length) {
                    html += '<br>';
                }
            }
        }));
        return html;
    }
    /**
     * @protected
     * @param {?} el
     * @return {?}
     */
    initChart(el) {
        this.noData = false;
        /** @type {?} */
        const parentSize = ((/** @type {?} */ (el.nativeElement))).parentElement.parentElement.getBoundingClientRect();
        if (this._responsive) {
            this.height = parentSize.height;
            this.width = parentSize.width;
        }
        this.LOG.debug(['initiChart', 'this._data'], this._data, this._options);
        if (!this._data || !this._data.data || this._data.data.length === 0 || !this._options) {
            this.loading = false;
            this.LOG.debug(['initiChart', 'nodata']);
            this.noData = true;
            this.chartDraw.emit();
            return false;
        }
        tz.setDefault(this._options.timeZone);
        this.loading = true;
        this._options = (/** @type {?} */ (ChartLib.mergeDeep(this.defOptions, this._options || {})));
        /** @type {?} */
        const dataModel = this._data;
        this._options = (/** @type {?} */ (ChartLib.mergeDeep(this._options || {}, this._data.globalParams)));
        this.LOG.debug(['initiChart', 'this._options'], this._options);
        this._options.timeMode = this._options.timeMode || 'date';
        this.divider = GTSLib.getDivider(this._options.timeUnit);
        this.plotlyData = this.convert(dataModel);
        this.plotlyConfig.responsive = this._responsive;
        this.layout.paper_bgcolor = 'rgba(0,0,0,0)';
        this.layout.plot_bgcolor = 'rgba(0,0,0,0)';
        if (!this._responsive) {
            this.layout.width = this.width || ChartLib.DEFAULT_WIDTH;
            this.layout.height = this.height || ChartLib.DEFAULT_HEIGHT;
        }
        else {
            this.layout.width = parentSize.width;
            this.layout.height = parentSize.height;
        }
        this.LOG.debug(['initChart', 'initSize'], this.layout.width, this.layout.height, this.width, this.height);
        if (this._options.bounds && this._options.bounds.minDate && this._options.bounds.maxDate) {
            dataModel.bounds = {
                xmin: Math.floor(this._options.bounds.minDate),
                xmax: Math.ceil(this._options.bounds.maxDate),
                ymin: this._options.bounds.yRanges && this._options.bounds.yRanges.length > 0
                    ? Math.floor(this._options.bounds.yRanges[0])
                    : undefined,
                ymax: this._options.bounds.yRanges && this._options.bounds.yRanges.length > 1
                    ? Math.ceil(this._options.bounds.yRanges[1])
                    : undefined
            };
            this.LOG.debug(['initChart', 'updateBounds'], dataModel.bounds.xmin, dataModel.bounds.xmax);
            if (this._options.timeMode && this._options.timeMode === 'timestamp') {
                this.layout.xaxis.range = [dataModel.bounds.xmin, dataModel.bounds.xmax];
            }
            else {
                this.layout.xaxis.range = [
                    tz(dataModel.bounds.xmin / this.divider, this._options.timeZone).toISOString(true),
                    tz(dataModel.bounds.xmax / this.divider, this._options.timeZone).toISOString(true)
                ];
            }
        }
        this.LOG.debug(['initiChart', 'plotlyData'], this.plotlyData);
        if (!this.plotlyData || this.plotlyData.length === 0) {
            this.loading = false;
            this.chartDraw.emit();
            return false;
        }
        return !(!this.plotlyData || this.plotlyData.length === 0);
    }
    /**
     * @param {?=} plotlyInstance
     * @return {?}
     */
    afterPlot(plotlyInstance) {
        this.LOG.debug(['afterPlot', 'plotlyInstance'], plotlyInstance);
        this.chartDraw.emit();
        this.loading = false;
        this.rect = this.graph.getBoundingClientRect();
    }
    /**
     * @return {?}
     */
    hideTooltip() {
        if (!!this.hideTooltipTimer) {
            clearTimeout(this.hideTooltipTimer);
        }
        this.hideTooltipTimer = setTimeout((/**
         * @return {?}
         */
        () => {
            this.toolTip.nativeElement.style.display = 'none';
        }), 1000);
    }
    /**
     * @param {?=} data
     * @param {?=} point
     * @return {?}
     */
    unhover(data, point) {
        this.LOG.debug(['unhover'], data);
        if (!!this.hideTooltipTimer) {
            clearTimeout(this.hideTooltipTimer);
        }
    }
    /**
     * @param {?} data
     * @param {?=} point
     * @return {?}
     */
    hover(data, point) {
        this.LOG.debug(['hover'], data);
        this.toolTip.nativeElement.style.display = 'block';
        if (!!this.hideTooltipTimer) {
            clearTimeout(this.hideTooltipTimer);
        }
        /** @type {?} */
        let delta = Number.MAX_VALUE;
        /** @type {?} */
        const curves = [];
        if (!point) {
            if (data.points[0] && data.points[0].data.orientation !== 'h') {
                /** @type {?} */
                const y = (data.yvals || [''])[0];
                data.points.forEach((/**
                 * @param {?} p
                 * @return {?}
                 */
                p => {
                    curves.push(p.curveNumber);
                    /** @type {?} */
                    const d = Math.abs((p.y || p.r) - y);
                    if (d < delta) {
                        delta = d;
                        point = p;
                    }
                }));
            }
            else {
                /** @type {?} */
                const x = (data.xvals || [''])[0];
                data.points.forEach((/**
                 * @param {?} p
                 * @return {?}
                 */
                p => {
                    curves.push(p.curveNumber);
                    /** @type {?} */
                    const d = Math.abs((p.x || p.r) - x);
                    if (d < delta) {
                        delta = d;
                        point = p;
                    }
                }));
            }
        }
        if (point) {
            /** @type {?} */
            const content = this.legendFormatter(this._options.horizontal ?
                (data.yvals || [''])[0] :
                (data.xvals || [''])[0], data.points, point.curveNumber);
            /** @type {?} */
            let left = (data.event.offsetX + 20) + 'px';
            if (data.event.offsetX > this.chartContainer.nativeElement.clientWidth / 2) {
                left = Math.max(0, data.event.offsetX - this.toolTip.nativeElement.clientWidth - 20) + 'px';
            }
            /** @type {?} */
            const top = Math.min(this.el.nativeElement.getBoundingClientRect().height - this.toolTip.nativeElement.getBoundingClientRect().height - 20, data.event.y - 20 - this.rect.top) + 'px';
            this.moveTooltip(top, left, content);
        }
    }
    /**
     * @return {?}
     */
    getTooltipPosition() {
        return {
            top: this.tooltipPosition.top,
            left: this.tooltipPosition.left,
        };
    }
    /**
     * @private
     * @param {?} top
     * @param {?} left
     * @param {?} content
     * @return {?}
     */
    moveTooltip(top, left, content) {
        this.tooltipPosition = { top, left };
        this.renderer.setProperty(this.toolTip.nativeElement, 'innerHTML', content);
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    relayout($event) {
    }
    /**
     * @protected
     * @param {?} el
     * @return {?}
     */
    getLabelColor(el) {
        return this.getCSSColor(el, '--warp-view-chart-label-color', '#8e8e8e').trim();
    }
    /**
     * @protected
     * @param {?} el
     * @return {?}
     */
    getGridColor(el) {
        return this.getCSSColor(el, '--warp-view-chart-grid-color', '#8e8e8e').trim();
    }
    /**
     * @protected
     * @param {?} el
     * @param {?} property
     * @param {?} defColor
     * @return {?}
     */
    getCSSColor(el, property, defColor) {
        /** @type {?} */
        const color = getComputedStyle(el).getPropertyValue(property).trim();
        return color === '' ? defColor : color;
    }
}
WarpViewComponent.propDecorators = {
    toolTip: [{ type: ViewChild, args: ['toolTip', { static: true },] }],
    graph: [{ type: ViewChild, args: ['graph', { static: false },] }],
    chartContainer: [{ type: ViewChild, args: ['chartContainer', { static: true },] }],
    width: [{ type: Input, args: ['width',] }],
    height: [{ type: Input, args: ['height',] }],
    hiddenData: [{ type: Input, args: ['hiddenData',] }],
    unit: [{ type: Input, args: ['unit',] }],
    debug: [{ type: Input, args: ['debug',] }],
    showLegend: [{ type: Input, args: ['showLegend',] }],
    responsive: [{ type: Input, args: ['responsive',] }],
    options: [{ type: Input, args: ['options',] }],
    data: [{ type: Input, args: ['data',] }],
    chartDraw: [{ type: Output, args: ['chartDraw',] }]
};
if (false) {
    /** @type {?} */
    WarpViewComponent.prototype.toolTip;
    /** @type {?} */
    WarpViewComponent.prototype.graph;
    /** @type {?} */
    WarpViewComponent.prototype.chartContainer;
    /** @type {?} */
    WarpViewComponent.prototype.width;
    /** @type {?} */
    WarpViewComponent.prototype.height;
    /** @type {?} */
    WarpViewComponent.prototype.chartDraw;
    /** @type {?} */
    WarpViewComponent.prototype._options;
    /**
     * @type {?}
     * @protected
     */
    WarpViewComponent.prototype.LOG;
    /**
     * @type {?}
     * @protected
     */
    WarpViewComponent.prototype.defOptions;
    /**
     * @type {?}
     * @protected
     */
    WarpViewComponent.prototype._debug;
    /**
     * @type {?}
     * @protected
     */
    WarpViewComponent.prototype._showLegend;
    /**
     * @type {?}
     * @protected
     */
    WarpViewComponent.prototype._responsive;
    /**
     * @type {?}
     * @protected
     */
    WarpViewComponent.prototype._unit;
    /**
     * @type {?}
     * @protected
     */
    WarpViewComponent.prototype._data;
    /**
     * @type {?}
     * @protected
     */
    WarpViewComponent.prototype._autoResize;
    /**
     * @type {?}
     * @protected
     */
    WarpViewComponent.prototype._hiddenData;
    /**
     * @type {?}
     * @protected
     */
    WarpViewComponent.prototype.divider;
    /** @type {?} */
    WarpViewComponent.prototype.tooltipPosition;
    /** @type {?} */
    WarpViewComponent.prototype.loading;
    /** @type {?} */
    WarpViewComponent.prototype.noData;
    /** @type {?} */
    WarpViewComponent.prototype.layout;
    /** @type {?} */
    WarpViewComponent.prototype.plotlyConfig;
    /** @type {?} */
    WarpViewComponent.prototype.plotlyData;
    /**
     * @type {?}
     * @private
     */
    WarpViewComponent.prototype.hideTooltipTimer;
    /**
     * @type {?}
     * @private
     */
    WarpViewComponent.prototype.rect;
    /** @type {?} */
    WarpViewComponent.prototype.el;
    /** @type {?} */
    WarpViewComponent.prototype.renderer;
    /** @type {?} */
    WarpViewComponent.prototype.sizeService;
    /** @type {?} */
    WarpViewComponent.prototype.ngZone;
    /**
     * @abstract
     * @protected
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    WarpViewComponent.prototype.update = function (options, refresh) { };
    /**
     * @abstract
     * @protected
     * @param {?} data
     * @return {?}
     */
    WarpViewComponent.prototype.convert = function (data) { };
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class Size {
    /**
     * @param {?} width
     * @param {?} height
     */
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
}
if (false) {
    /** @type {?} */
    Size.prototype.width;
    /** @type {?} */
    Size.prototype.height;
}
class SizeService {
    constructor() {
        this.sizeChanged$ = new EventEmitter();
    }
    /**
     * @param {?} size
     * @return {?}
     */
    change(size) {
        this.sizeChanged$.emit(size);
    }
}
if (false) {
    /** @type {?} */
    SizeService.prototype.sizeChanged$;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/* tslint:disable:no-bitwise */
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
class Timsort {
    /**
     * @param {?} array
     * @param {?} compare
     */
    constructor(array, compare) {
        this.array = null;
        this.compare = null;
        this.minGallop = Timsort.DEFAULT_MIN_GALLOPING;
        this.length = 0;
        this.tmpStorageLength = Timsort.DEFAULT_TMP_STORAGE_LENGTH;
        this.stackLength = 0;
        this.runStart = null;
        this.runLength = null;
        this.stackSize = 0;
        this.array = array;
        this.compare = compare;
        this.length = array.length;
        if (this.length < 2 * Timsort.DEFAULT_TMP_STORAGE_LENGTH) {
            this.tmpStorageLength = this.length >>> 1;
        }
        this.tmp = new Array(this.tmpStorageLength);
        this.stackLength = (this.length < 120 ? 5 : this.length < 1542 ? 10 : this.length < 119151 ? 19 : 40);
        this.runStart = new Array(this.stackLength);
        this.runLength = new Array(this.stackLength);
    }
    /**
     * @private
     * @param {?} x
     * @return {?}
     */
    static log10(x) {
        if (x < 1e5) {
            if (x < 1e2) {
                return x < 1e1 ? 0 : 1;
            }
            if (x < 1e4) {
                return x < 1e3 ? 2 : 3;
            }
            return 4;
        }
        if (x < 1e7) {
            return x < 1e6 ? 5 : 6;
        }
        if (x < 1e9) {
            return x < 1e8 ? 7 : 8;
        }
        return 9;
    }
    /**
     * @private
     * @param {?} n
     * @return {?}
     */
    static minRunLength(n) {
        /** @type {?} */
        let r = 0;
        while (n >= Timsort.DEFAULT_MIN_MERGE) {
            r |= (n & 1);
            n >>= 1;
        }
        return n + r;
    }
    /**
     * @private
     * @param {?} array
     * @param {?} lo
     * @param {?} hi
     * @param {?} compare
     * @return {?}
     */
    static makeAscendingRun(array, lo, hi, compare) {
        /** @type {?} */
        let runHi = lo + 1;
        if (runHi === hi) {
            return 1;
        }
        // Descending
        if (compare(array[runHi++], array[lo]) < 0) {
            while (runHi < hi && compare(array[runHi], array[runHi - 1]) < 0) {
                runHi++;
            }
            Timsort.reverseRun(array, lo, runHi);
            // Ascending
        }
        else {
            while (runHi < hi && compare(array[runHi], array[runHi - 1]) >= 0) {
                runHi++;
            }
        }
        return runHi - lo;
    }
    /**
     * @private
     * @param {?} array
     * @param {?} lo
     * @param {?} hi
     * @return {?}
     */
    static reverseRun(array, lo, hi) {
        hi--;
        while (lo < hi) {
            /** @type {?} */
            const t = array[lo];
            array[lo++] = array[hi];
            array[hi--] = t;
        }
    }
    /**
     * @private
     * @param {?} array
     * @param {?} lo
     * @param {?} hi
     * @param {?} start
     * @param {?} compare
     * @return {?}
     */
    static binaryInsertionSort(array, lo, hi, start, compare) {
        if (start === lo) {
            start++;
        }
        for (; start < hi; start++) {
            /** @type {?} */
            const pivot = array[start];
            // Ranges of the array where pivot belongs
            /** @type {?} */
            let left = lo;
            /** @type {?} */
            let right = start;
            while (left < right) {
                /** @type {?} */
                const mid = (left + right) >>> 1;
                if (compare(pivot, array[mid]) < 0) {
                    right = mid;
                }
                else {
                    left = mid + 1;
                }
            }
            /** @type {?} */
            let n = start - left;
            // Switch is just an optimization for small arrays
            switch (n) {
                case 3:
                    array[left + 3] = array[left + 2];
                /* falls through */
                case 2:
                    array[left + 2] = array[left + 1];
                /* falls through */
                case 1:
                    array[left + 1] = array[left];
                    break;
                default:
                    while (n > 0) {
                        array[left + n] = array[left + n - 1];
                        n--;
                    }
            }
            array[left] = pivot;
        }
    }
    /**
     * @private
     * @param {?} value
     * @param {?} array
     * @param {?} start
     * @param {?} length
     * @param {?} hint
     * @param {?} compare
     * @return {?}
     */
    static gallopLeft(value, array, start, length, hint, compare) {
        /** @type {?} */
        let lastOffset = 0;
        /** @type {?} */
        let maxOffset;
        /** @type {?} */
        let offset = 1;
        if (compare(value, array[start + hint]) > 0) {
            maxOffset = length - hint;
            while (offset < maxOffset && compare(value, array[start + hint + offset]) > 0) {
                lastOffset = offset;
                offset = (offset << 1) + 1;
                if (offset <= 0) {
                    offset = maxOffset;
                }
            }
            if (offset > maxOffset) {
                offset = maxOffset;
            }
            // Make offsets relative to start
            lastOffset += hint;
            offset += hint;
            // value <= array[start + hint]
        }
        else {
            maxOffset = hint + 1;
            while (offset < maxOffset && compare(value, array[start + hint - offset]) <= 0) {
                lastOffset = offset;
                offset = (offset << 1) + 1;
                if (offset <= 0) {
                    offset = maxOffset;
                }
            }
            if (offset > maxOffset) {
                offset = maxOffset;
            }
            // Make offsets relative to start
            /** @type {?} */
            const tmp = lastOffset;
            lastOffset = hint - offset;
            offset = hint - tmp;
        }
        lastOffset++;
        while (lastOffset < offset) {
            /** @type {?} */
            const m = lastOffset + ((offset - lastOffset) >>> 1);
            if (compare(value, array[start + m]) > 0) {
                lastOffset = m + 1;
            }
            else {
                offset = m;
            }
        }
        return offset;
    }
    /**
     * @private
     * @param {?} value
     * @param {?} array
     * @param {?} start
     * @param {?} length
     * @param {?} hint
     * @param {?} compare
     * @return {?}
     */
    static gallopRight(value, array, start, length, hint, compare) {
        /** @type {?} */
        let lastOffset = 0;
        /** @type {?} */
        let maxOffset;
        /** @type {?} */
        let offset = 1;
        if (compare(value, array[start + hint]) < 0) {
            maxOffset = hint + 1;
            while (offset < maxOffset && compare(value, array[start + hint - offset]) < 0) {
                lastOffset = offset;
                offset = (offset << 1) + 1;
                if (offset <= 0) {
                    offset = maxOffset;
                }
            }
            if (offset > maxOffset) {
                offset = maxOffset;
            }
            // Make offsets relative to start
            /** @type {?} */
            const tmp = lastOffset;
            lastOffset = hint - offset;
            offset = hint - tmp;
            // value >= array[start + hint]
        }
        else {
            maxOffset = length - hint;
            while (offset < maxOffset && compare(value, array[start + hint + offset]) >= 0) {
                lastOffset = offset;
                offset = (offset << 1) + 1;
                if (offset <= 0) {
                    offset = maxOffset;
                }
            }
            if (offset > maxOffset) {
                offset = maxOffset;
            }
            // Make offsets relative to start
            lastOffset += hint;
            offset += hint;
        }
        lastOffset++;
        while (lastOffset < offset) {
            /** @type {?} */
            const m = lastOffset + ((offset - lastOffset) >>> 1);
            if (compare(value, array[start + m]) < 0) {
                offset = m;
            }
            else {
                lastOffset = m + 1;
            }
        }
        return offset;
    }
    /**
     * @private
     * @param {?} a
     * @param {?} b
     * @return {?}
     */
    static alphabeticalCompare(a, b) {
        if (a === b) {
            return 0;
        }
        if (~~a === a && ~~b === b) {
            if (a === 0 || b === 0) {
                return a < b ? -1 : 1;
            }
            if (a < 0 || b < 0) {
                if (b >= 0) {
                    return -1;
                }
                if (a >= 0) {
                    return 1;
                }
                a = -a;
                b = -b;
            }
            /** @type {?} */
            const al = Timsort.log10(a);
            /** @type {?} */
            const bl = Timsort.log10(b);
            /** @type {?} */
            let t = 0;
            if (al < bl) {
                a *= Timsort.POWERS_OF_TEN[bl - al - 1];
                b /= 10;
                t = -1;
            }
            else if (al > bl) {
                b *= Timsort.POWERS_OF_TEN[al - bl - 1];
                a /= 10;
                t = 1;
            }
            if (a === b) {
                return t;
            }
            return a < b ? -1 : 1;
        }
        /** @type {?} */
        const aStr = String(a);
        /** @type {?} */
        const bStr = String(b);
        if (aStr === bStr) {
            return 0;
        }
        return aStr < bStr ? -1 : 1;
    }
    /**
     * @param {?} array
     * @param {?=} compare
     * @param {?=} lo
     * @param {?=} hi
     * @return {?}
     */
    static sort(array, compare, lo, hi) {
        if (!Array.isArray(array)) {
            throw new TypeError('Can only sort arrays');
        }
        if (!compare) {
            compare = Timsort.alphabeticalCompare;
        }
        else if (typeof compare !== 'function') {
            hi = lo;
            lo = compare;
            compare = Timsort.alphabeticalCompare;
        }
        if (!lo) {
            lo = 0;
        }
        if (!hi) {
            hi = array.length;
        }
        /** @type {?} */
        let remaining = hi - lo;
        // The array is already sorted
        if (remaining < 2) {
            return;
        }
        /** @type {?} */
        let runLength = 0;
        // On small arrays binary sort can be used directly
        if (remaining < Timsort.DEFAULT_MIN_MERGE) {
            runLength = Timsort.makeAscendingRun(array, lo, hi, compare);
            Timsort.binaryInsertionSort(array, lo, hi, lo + runLength, compare);
            return;
        }
        /** @type {?} */
        const ts = new Timsort(array, compare);
        /** @type {?} */
        const minRun = Timsort.minRunLength(remaining);
        do {
            runLength = Timsort.makeAscendingRun(array, lo, hi, compare);
            if (runLength < minRun) {
                /** @type {?} */
                let force = remaining;
                if (force > minRun) {
                    force = minRun;
                }
                Timsort.binaryInsertionSort(array, lo, lo + force, lo + runLength, compare);
                runLength = force;
            }
            // Push new run and merge if necessary
            ts.pushRun(lo, runLength);
            ts.mergeRuns();
            // Go find next run
            remaining -= runLength;
            lo += runLength;
        } while (remaining !== 0);
        // Force merging of remaining runs
        ts.forceMergeRuns();
    }
    /**
     * @param {?} runStart
     * @param {?} runLength
     * @return {?}
     */
    pushRun(runStart, runLength) {
        this.runStart[this.stackSize] = runStart;
        this.runLength[this.stackSize] = runLength;
        this.stackSize += 1;
    }
    /**
     * @return {?}
     */
    mergeRuns() {
        while (this.stackSize > 1) {
            /** @type {?} */
            let n = this.stackSize - 2;
            if ((n >= 1 && this.runLength[n - 1] <= this.runLength[n] + this.runLength[n + 1])
                || (n >= 2 && this.runLength[n - 2] <= this.runLength[n] + this.runLength[n - 1])) {
                if (this.runLength[n - 1] < this.runLength[n + 1]) {
                    n--;
                }
            }
            else if (this.runLength[n] > this.runLength[n + 1]) {
                break;
            }
            this.mergeAt(n);
        }
    }
    /**
     * @return {?}
     */
    forceMergeRuns() {
        while (this.stackSize > 1) {
            /** @type {?} */
            let n = this.stackSize - 2;
            if (n > 0 && this.runLength[n - 1] < this.runLength[n + 1]) {
                n--;
            }
            this.mergeAt(n);
        }
    }
    /**
     * @param {?} i
     * @return {?}
     */
    mergeAt(i) {
        /** @type {?} */
        const compare = this.compare;
        /** @type {?} */
        const array = this.array;
        /** @type {?} */
        let start1 = this.runStart[i];
        /** @type {?} */
        let length1 = this.runLength[i];
        /** @type {?} */
        const start2 = this.runStart[i + 1];
        /** @type {?} */
        let length2 = this.runLength[i + 1];
        this.runLength[i] = length1 + length2;
        if (i === this.stackSize - 3) {
            this.runStart[i + 1] = this.runStart[i + 2];
            this.runLength[i + 1] = this.runLength[i + 2];
        }
        this.stackSize--;
        /** @type {?} */
        const k = Timsort.gallopRight(array[start2], array, start1, length1, 0, compare);
        start1 += k;
        length1 -= k;
        if (length1 === 0) {
            return;
        }
        length2 = Timsort.gallopLeft(array[start1 + length1 - 1], array, start2, length2, length2 - 1, compare);
        if (length2 === 0) {
            return;
        }
        if (length1 <= length2) {
            this.mergeLow(start1, length1, start2, length2);
        }
        else {
            this.mergeHigh(start1, length1, start2, length2);
        }
    }
    /**
     * @param {?} start1
     * @param {?} length1
     * @param {?} start2
     * @param {?} length2
     * @return {?}
     */
    mergeLow(start1, length1, start2, length2) {
        /** @type {?} */
        const compare = this.compare;
        /** @type {?} */
        const array = this.array;
        /** @type {?} */
        const tmp = this.tmp;
        /** @type {?} */
        let i;
        for (i = 0; i < length1; i++) {
            tmp[i] = array[start1 + i];
        }
        /** @type {?} */
        let cursor1 = 0;
        /** @type {?} */
        let cursor2 = start2;
        /** @type {?} */
        let dest = start1;
        array[dest++] = array[cursor2++];
        if (--length2 === 0) {
            for (i = 0; i < length1; i++) {
                array[dest + i] = tmp[cursor1 + i];
            }
            return;
        }
        if (length1 === 1) {
            for (i = 0; i < length2; i++) {
                array[dest + i] = array[cursor2 + i];
            }
            array[dest + length2] = tmp[cursor1];
            return;
        }
        /** @type {?} */
        let minGallop = this.minGallop;
        while (true) {
            /** @type {?} */
            let count1 = 0;
            /** @type {?} */
            let count2 = 0;
            /** @type {?} */
            let exit = false;
            do {
                if (compare(array[cursor2], tmp[cursor1]) < 0) {
                    array[dest++] = array[cursor2++];
                    count2++;
                    count1 = 0;
                    if (--length2 === 0) {
                        exit = true;
                        break;
                    }
                }
                else {
                    array[dest++] = tmp[cursor1++];
                    count1++;
                    count2 = 0;
                    if (--length1 === 1) {
                        exit = true;
                        break;
                    }
                }
            } while ((count1 | count2) < minGallop);
            if (exit) {
                break;
            }
            do {
                count1 = Timsort.gallopRight(array[cursor2], tmp, cursor1, length1, 0, compare);
                if (count1 !== 0) {
                    for (i = 0; i < count1; i++) {
                        array[dest + i] = tmp[cursor1 + i];
                    }
                    dest += count1;
                    cursor1 += count1;
                    length1 -= count1;
                    if (length1 <= 1) {
                        exit = true;
                        break;
                    }
                }
                array[dest++] = array[cursor2++];
                if (--length2 === 0) {
                    exit = true;
                    break;
                }
                count2 = Timsort.gallopLeft(tmp[cursor1], array, cursor2, length2, 0, compare);
                if (count2 !== 0) {
                    for (i = 0; i < count2; i++) {
                        array[dest + i] = array[cursor2 + i];
                    }
                    dest += count2;
                    cursor2 += count2;
                    length2 -= count2;
                    if (length2 === 0) {
                        exit = true;
                        break;
                    }
                }
                array[dest++] = tmp[cursor1++];
                if (--length1 === 1) {
                    exit = true;
                    break;
                }
                minGallop--;
            } while (count1 >= Timsort.DEFAULT_MIN_GALLOPING || count2 >= Timsort.DEFAULT_MIN_GALLOPING);
            if (exit) {
                break;
            }
            if (minGallop < 0) {
                minGallop = 0;
            }
            minGallop += 2;
        }
        this.minGallop = minGallop;
        if (minGallop < 1) {
            this.minGallop = 1;
        }
        if (length1 === 1) {
            for (i = 0; i < length2; i++) {
                array[dest + i] = array[cursor2 + i];
            }
            array[dest + length2] = tmp[cursor1];
        }
        else if (length1 === 0) {
            throw new Error('mergeLow preconditions were not respected');
        }
        else {
            for (i = 0; i < length1; i++) {
                array[dest + i] = tmp[cursor1 + i];
            }
        }
    }
    /**
     * @param {?} start1
     * @param {?} length1
     * @param {?} start2
     * @param {?} length2
     * @return {?}
     */
    mergeHigh(start1, length1, start2, length2) {
        /** @type {?} */
        const compare = this.compare;
        /** @type {?} */
        const array = this.array;
        /** @type {?} */
        const tmp = this.tmp;
        /** @type {?} */
        let i;
        for (i = 0; i < length2; i++) {
            tmp[i] = array[start2 + i];
        }
        /** @type {?} */
        let cursor1 = start1 + length1 - 1;
        /** @type {?} */
        let cursor2 = length2 - 1;
        /** @type {?} */
        let dest = start2 + length2 - 1;
        /** @type {?} */
        let customCursor = 0;
        /** @type {?} */
        let customDest = 0;
        array[dest--] = array[cursor1--];
        if (--length1 === 0) {
            customCursor = dest - (length2 - 1);
            for (i = 0; i < length2; i++) {
                array[customCursor + i] = tmp[i];
            }
            return;
        }
        if (length2 === 1) {
            dest -= length1;
            cursor1 -= length1;
            customDest = dest + 1;
            customCursor = cursor1 + 1;
            for (i = length1 - 1; i >= 0; i--) {
                array[customDest + i] = array[customCursor + i];
            }
            array[dest] = tmp[cursor2];
            return;
        }
        /** @type {?} */
        let minGallop = this.minGallop;
        while (true) {
            /** @type {?} */
            let count1 = 0;
            /** @type {?} */
            let count2 = 0;
            /** @type {?} */
            let exit = false;
            do {
                if (compare(tmp[cursor2], array[cursor1]) < 0) {
                    array[dest--] = array[cursor1--];
                    count1++;
                    count2 = 0;
                    if (--length1 === 0) {
                        exit = true;
                        break;
                    }
                }
                else {
                    array[dest--] = tmp[cursor2--];
                    count2++;
                    count1 = 0;
                    if (--length2 === 1) {
                        exit = true;
                        break;
                    }
                }
            } while ((count1 | count2) < minGallop);
            if (exit) {
                break;
            }
            do {
                count1 = length1 - Timsort.gallopRight(tmp[cursor2], array, start1, length1, length1 - 1, compare);
                if (count1 !== 0) {
                    dest -= count1;
                    cursor1 -= count1;
                    length1 -= count1;
                    customDest = dest + 1;
                    customCursor = cursor1 + 1;
                    for (i = count1 - 1; i >= 0; i--) {
                        array[customDest + i] = array[customCursor + i];
                    }
                    if (length1 === 0) {
                        exit = true;
                        break;
                    }
                }
                array[dest--] = tmp[cursor2--];
                if (--length2 === 1) {
                    exit = true;
                    break;
                }
                count2 = length2 - Timsort.gallopLeft(array[cursor1], tmp, 0, length2, length2 - 1, compare);
                if (count2 !== 0) {
                    dest -= count2;
                    cursor2 -= count2;
                    length2 -= count2;
                    customDest = dest + 1;
                    customCursor = cursor2 + 1;
                    for (i = 0; i < count2; i++) {
                        array[customDest + i] = tmp[customCursor + i];
                    }
                    if (length2 <= 1) {
                        exit = true;
                        break;
                    }
                }
                array[dest--] = array[cursor1--];
                if (--length1 === 0) {
                    exit = true;
                    break;
                }
                minGallop--;
            } while (count1 >= Timsort.DEFAULT_MIN_GALLOPING || count2 >= Timsort.DEFAULT_MIN_GALLOPING);
            if (exit) {
                break;
            }
            if (minGallop < 0) {
                minGallop = 0;
            }
            minGallop += 2;
        }
        this.minGallop = minGallop;
        if (minGallop < 1) {
            this.minGallop = 1;
        }
        if (length2 === 1) {
            dest -= length1;
            cursor1 -= length1;
            customDest = dest + 1;
            customCursor = cursor1 + 1;
            for (i = length1 - 1; i >= 0; i--) {
                array[customDest + i] = array[customCursor + i];
            }
            array[dest] = tmp[cursor2];
        }
        else if (length2 === 0) {
            throw new Error('mergeHigh preconditions were not respected');
        }
        else {
            customCursor = dest - (length2 - 1);
            for (i = 0; i < length2; i++) {
                array[customCursor + i] = tmp[i];
            }
        }
    }
}
/**
 * Default minimum size of a run.
 */
Timsort.DEFAULT_MIN_MERGE = 32;
/**
 * Minimum ordered subsequece required to do galloping.
 */
Timsort.DEFAULT_MIN_GALLOPING = 7;
/**
 * Default tmp storage length. Can increase depending on the size of the
 * smallest run to merge.
 */
Timsort.DEFAULT_TMP_STORAGE_LENGTH = 256;
/**
 * Pre-computed powers of 10 for efficient lexicographic comparison of
 * small integers.
 */
Timsort.POWERS_OF_TEN = [1e0, 1e1, 1e2, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9];
if (false) {
    /**
     * Default minimum size of a run.
     * @type {?}
     * @private
     */
    Timsort.DEFAULT_MIN_MERGE;
    /**
     * Minimum ordered subsequece required to do galloping.
     * @type {?}
     * @private
     */
    Timsort.DEFAULT_MIN_GALLOPING;
    /**
     * Default tmp storage length. Can increase depending on the size of the
     * smallest run to merge.
     * @type {?}
     * @private
     */
    Timsort.DEFAULT_TMP_STORAGE_LENGTH;
    /**
     * Pre-computed powers of 10 for efficient lexicographic comparison of
     * small integers.
     * @type {?}
     * @private
     */
    Timsort.POWERS_OF_TEN;
    /**
     * @type {?}
     * @private
     */
    Timsort.prototype.array;
    /**
     * @type {?}
     * @private
     */
    Timsort.prototype.compare;
    /**
     * @type {?}
     * @private
     */
    Timsort.prototype.minGallop;
    /**
     * @type {?}
     * @private
     */
    Timsort.prototype.length;
    /**
     * @type {?}
     * @private
     */
    Timsort.prototype.tmpStorageLength;
    /**
     * @type {?}
     * @private
     */
    Timsort.prototype.stackLength;
    /**
     * @type {?}
     * @private
     */
    Timsort.prototype.runStart;
    /**
     * @type {?}
     * @private
     */
    Timsort.prototype.runLength;
    /**
     * @type {?}
     * @private
     */
    Timsort.prototype.stackSize;
    /**
     * @type {?}
     * @private
     */
    Timsort.prototype.tmp;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class WarpViewChartComponent extends WarpViewComponent {
    /**
     * @param {?} el
     * @param {?} renderer
     * @param {?} sizeService
     * @param {?} ngZone
     */
    constructor(el, renderer, sizeService, ngZone) {
        super(el, renderer, sizeService, ngZone);
        this.el = el;
        this.renderer = renderer;
        this.sizeService = sizeService;
        this.ngZone = ngZone;
        this.standalone = true;
        this.boundsDidChange = new EventEmitter();
        this.pointHover = new EventEmitter();
        this.warpViewChartResize = new EventEmitter();
        // tslint:disable-next-line:variable-name
        this._type = 'line';
        this.visibility = [];
        this.maxTick = 0;
        this.minTick = 0;
        this.visibleGtsId = [];
        this.gtsId = [];
        this.dataHashset = {};
        this.chartBounds = new ChartBounds();
        this.visibilityStatus = 'unknown';
        this.afterBoundsUpdate = false;
        this.maxPlottable = 10000;
        this.parsing = false;
        this.unhighliteCurve = new Subject();
        this.highliteCurve = new Subject();
        this.layout = {
            showlegend: false,
            autosize: true,
            hovermode: 'x',
            hoverdistance: 20,
            xaxis: {
                font: {}
            },
            yaxis: {
                exponentformat: 'none',
                fixedrange: true,
                automargin: true,
                showline: true,
                font: {}
            },
            margin: {
                t: 0,
                b: 30,
                r: 10,
                l: 50
            },
        };
        this.LOG = new Logger(WarpViewChartComponent, this._debug);
    }
    /**
     * @param {?} hiddenData
     * @return {?}
     */
    set hiddenData(hiddenData) {
        /** @type {?} */
        const previousVisibility = JSON.stringify(this.visibility);
        this.LOG.debug(['hiddenData', 'previousVisibility'], previousVisibility);
        this._hiddenData = hiddenData;
        this.visibility = [];
        this.visibleGtsId.forEach((/**
         * @param {?} id
         * @return {?}
         */
        id => this.visibility.push(hiddenData.indexOf(id) < 0 && (id !== -1))));
        this.LOG.debug(['hiddenData', 'hiddendygraphfullv'], this.visibility);
        /** @type {?} */
        const newVisibility = JSON.stringify(this.visibility);
        this.LOG.debug(['hiddenData', 'json'], previousVisibility, newVisibility, this._hiddenData);
        if (previousVisibility !== newVisibility) {
            /** @type {?} */
            const visible = [];
            /** @type {?} */
            const hidden = [];
            (this.gtsId || []).forEach((/**
             * @param {?} id
             * @param {?} i
             * @return {?}
             */
            (id, i) => {
                if (this._hiddenData.indexOf(id) > -1) {
                    hidden.push(i);
                }
                else {
                    visible.push(i);
                }
            }));
            if (visible.length > 0) {
                this.graph.restyleChart({ visible: true }, visible);
            }
            if (hidden.length > 0) {
                this.graph.restyleChart({ visible: false }, hidden);
            }
            this.LOG.debug(['hiddendygraphtrig', 'destroy'], 'redraw by visibility change', visible, hidden);
        }
    }
    /**
     * @param {?} type
     * @return {?}
     */
    set type(type) {
        this._type = type;
        this.drawChart();
    }
    /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    update(options, refresh) {
        this.drawChart(refresh);
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this._options = this._options || this.defOptions;
    }
    /**
     * @return {?}
     */
    getTimeClip() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((/**
             * @param {?} resolve
             * @return {?}
             */
            resolve => {
                this.LOG.debug(['getTimeClip'], this.chartBounds);
                resolve(this.chartBounds);
            }));
        });
    }
    /**
     * @param {?} newHeight
     * @return {?}
     */
    resize(newHeight) {
        this.height = newHeight;
        this.layout.height = this.height;
        if (this._options.showRangeSelector) {
            this.layout.xaxis.rangeslider = {
                bgcolor: 'transparent',
                thickness: 40 / this.height
            };
        }
    }
    /**
     * @param {?=} reparseNewData
     * @return {?}
     */
    drawChart(reparseNewData = false) {
        this.LOG.debug(['drawChart', 'this.layout', 'this.options'], this.layout, this._options);
        if (!this.initChart(this.el)) {
            this.LOG.debug(['drawChart', 'initChart'], this._options);
            return;
        }
        this.plotlyConfig.scrollZoom = true;
        if (!!this._options.timeMode && this._options.timeMode === 'timestamp') {
            this.layout.xaxis.type = 'linear';
            this.layout.xaxis.tick0 = this.minTick / this.divider;
        }
        else {
            this.layout.xaxis.type = 'date';
            this.layout.xaxis.tick0 = moment__default.tz(this.minTick / this.divider, this._options.timeZone).toISOString(true);
        }
        this.layout.yaxis.gridcolor = this.getGridColor(this.el.nativeElement);
        this.layout.xaxis.gridcolor = this.getGridColor(this.el.nativeElement);
        this.layout.yaxis.zerolinecolor = this.getGridColor(this.el.nativeElement);
        this.layout.xaxis.zerolinecolor = this.getGridColor(this.el.nativeElement);
        this.layout.margin.t = this.standalone ? 20 : 10;
        this.layout.showlegend = this._showLegend;
        if (!this._responsive) {
            this.layout.width = this.width;
            this.layout.height = this.height;
        }
        this.LOG.debug(['drawChart', 'this.options'], this.layout, this._options);
        this.LOG.debug(['drawChart', 'this.layout'], this.layout);
        this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig);
        if (this._options.showRangeSelector) {
            this.layout.xaxis.rangeslider = {
                bgcolor: 'transparent',
                thickness: 40 / this.height
            };
        }
        else {
            this.layout.margin.b = 30;
        }
        /** @type {?} */
        const x = {
            tick0: undefined,
            range: [],
        };
        this.LOG.debug(['drawChart', 'updateBounds'], this.chartBounds);
        /** @type {?} */
        const min = this.chartBounds.tsmin || this.minTick;
        /** @type {?} */
        const max = this.chartBounds.tsmax || this.maxTick;
        if (this._options.timeMode && this._options.timeMode === 'timestamp') {
            x.tick0 = min / this.divider;
            x.range = [min, max];
        }
        else {
            x.tick0 = moment__default.tz(min / this.divider, this._options.timeZone).toISOString(true);
            x.range = [
                moment__default.tz(min / this.divider, this._options.timeZone).toISOString(true),
                moment__default.tz(max / this.divider, this._options.timeZone).toISOString(true)
            ];
        }
        this.layout.xaxis = x;
        this.layout = Object.assign({}, this.layout);
        this.loading = false;
        this.highliteCurve.pipe(debounceTime(200)).subscribe((/**
         * @param {?} value
         * @return {?}
         */
        value => {
            Promise.resolve().then((/**
             * @return {?}
             */
            () => {
                this.graph.restyleChart({ opacity: 0.4 }, value.off);
                this.graph.restyleChart({ opacity: 1 }, value.on);
            }));
        }));
        this.unhighliteCurve.pipe(debounceTime(200)).subscribe((/**
         * @param {?} value
         * @return {?}
         */
        value => {
            Promise.resolve().then((/**
             * @return {?}
             */
            () => {
                this.graph.restyleChart({ opacity: 1 }, value);
            }));
        }));
    }
    /**
     * @private
     * @param {?} min
     * @param {?} max
     * @param {?} marginLeft
     * @return {?}
     */
    emitNewBounds(min, max, marginLeft) {
        if (this._options.timeMode && this._options.timeMode === 'timestamp') {
            this.boundsDidChange.emit({ bounds: { min, max, marginLeft }, source: 'chart' });
        }
        else {
            this.boundsDidChange.emit({
                bounds: {
                    min: moment__default.tz(min, this._options.timeZone).valueOf(),
                    max: moment__default.tz(max, this._options.timeZone).valueOf(),
                    marginLeft
                }, source: 'chart'
            });
        }
    }
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    convert(data) {
        this.parsing = true;
        /** @type {?} */
        const dataset = [];
        this.LOG.debug(['convert'], this._options.timeMode);
        this.LOG.debug(['convert', 'this._hiddenData'], this._hiddenData);
        if (GTSLib.isArray(data.data)) {
            /** @type {?} */
            let gtsList = GTSLib.flatDeep(GTSLib.flattenGtsIdArray((/** @type {?} */ (data.data)), 0).res);
            this.maxTick = Number.NEGATIVE_INFINITY;
            this.minTick = Number.POSITIVE_INFINITY;
            this.visibleGtsId = [];
            this.gtsId = [];
            /** @type {?} */
            const nonPlottable = gtsList.filter((/**
             * @param {?} g
             * @return {?}
             */
            g => {
                this.LOG.debug(['convert'], GTSLib.isGtsToPlot(g));
                return (g.v && !GTSLib.isGtsToPlot(g));
            }));
            gtsList = gtsList.filter((/**
             * @param {?} g
             * @return {?}
             */
            g => {
                return (g.v && GTSLib.isGtsToPlot(g));
            }));
            // initialize visibility status
            if (this.visibilityStatus === 'unknown') {
                this.visibilityStatus = gtsList.length > 0 ? 'plottableShown' : 'nothingPlottable';
            }
            this.LOG.debug(['convert'], this._options.timeMode);
            /** @type {?} */
            let timestampMode = true;
            /** @type {?} */
            const tsLimit = 100 * GTSLib.getDivider(this._options.timeUnit);
            this.LOG.debug(['convert'], 'forEach GTS');
            gtsList.forEach((/**
             * @param {?} gts
             * @return {?}
             */
            (gts) => {
                /** @type {?} */
                const ticks = gts.v.map((/**
                 * @param {?} t
                 * @return {?}
                 */
                t => t[0]));
                /** @type {?} */
                const size = gts.v.length;
                timestampMode = timestampMode && (ticks[0] > -tsLimit && ticks[0] < tsLimit);
                timestampMode = timestampMode && (ticks[size - 1] > -tsLimit && ticks[size - 1] < tsLimit);
            }));
            if (timestampMode || this._options.timeMode === 'timestamp') {
                this.layout.xaxis.type = 'linear';
            }
            else {
                this.layout.xaxis.type = 'date';
            }
            gtsList.forEach((/**
             * @param {?} gts
             * @param {?} i
             * @return {?}
             */
            (gts, i) => {
                if (gts.v && GTSLib.isGtsToPlot(gts)) {
                    Timsort.sort(gts.v, (/**
                     * @param {?} a
                     * @param {?} b
                     * @return {?}
                     */
                    (a, b) => a[0] - b[0]));
                    /** @type {?} */
                    const size = gts.v.length;
                    this.LOG.debug(['convert'], gts);
                    /** @type {?} */
                    const label = GTSLib.serializeGtsMetadata(gts);
                    /** @type {?} */
                    const c = ColorLib.getColor(gts.id, this._options.scheme);
                    /** @type {?} */
                    const color = ((data.params || [])[i] || { datasetColor: c }).datasetColor || c;
                    /** @type {?} */
                    const series = {
                        type: this._type === 'spline' ? 'scatter' : 'scattergl',
                        mode: this._type === 'scatter' ? 'markers' : size > this.maxPlottable ? 'lines' : 'lines+markers',
                        // name: label,
                        text: label,
                        x: [],
                        y: [],
                        line: { color },
                        hoverinfo: 'none',
                        connectgaps: false,
                        visible: !(this._hiddenData.filter((/**
                         * @param {?} h
                         * @return {?}
                         */
                        h => h === gts.id)).length > 0),
                    };
                    if (this._type === 'scatter' || size < this.maxPlottable) {
                        series.marker = {
                            size: 15,
                            color: new Array(size).fill(color),
                            line: { color, width: 3 },
                            opacity: new Array(size).fill(this._type === 'scatter' || this._options.showDots ? 1 : 0)
                        };
                    }
                    switch (this._type) {
                        case 'spline':
                            series.line.shape = 'spline';
                            break;
                        case 'area':
                            series.fill = 'tozeroy';
                            series.fillcolor = ColorLib.transparentize(color, 0.3);
                            break;
                        case 'step':
                            series.line.shape = 'hvh';
                            break;
                        case 'step-before':
                            series.line.shape = 'vh';
                            break;
                        case 'step-after':
                            series.line.shape = 'hv';
                            break;
                    }
                    this.visibleGtsId.push(gts.id);
                    this.gtsId.push(gts.id);
                    this.LOG.debug(['convert'], 'forEach value');
                    /** @type {?} */
                    const ticks = gts.v.map((/**
                     * @param {?} t
                     * @return {?}
                     */
                    t => t[0]));
                    /** @type {?} */
                    const values = gts.v.map((/**
                     * @param {?} t
                     * @return {?}
                     */
                    t => t[t.length - 1]));
                    if (size > 0) {
                        this.minTick = this.minTick || ticks[0];
                        this.maxTick = this.maxTick || ticks[0];
                        for (let v = 1; v < size; v++) {
                            /** @type {?} */
                            const val = ticks[v];
                            this.minTick = val <= this.minTick ? val : this.minTick;
                            this.maxTick = val >= this.maxTick ? val : this.maxTick;
                        }
                    }
                    if (timestampMode || this._options.timeMode === 'timestamp') {
                        series.x = ticks;
                    }
                    else {
                        if (this._options.timeZone !== 'UTC') {
                            series.x = ticks.map((/**
                             * @param {?} t
                             * @return {?}
                             */
                            t => moment__default.utc(t / this.divider).tz(this._options.timeZone).toISOString()));
                        }
                        else {
                            series.x = ticks.map((/**
                             * @param {?} t
                             * @return {?}
                             */
                            t => moment__default.utc(t / this.divider).toISOString()));
                        }
                    }
                    series.y = values;
                    this.LOG.debug(['convert'], 'forEach value end', this.minTick, this.maxTick);
                    dataset.push(series);
                }
            }));
            if (nonPlottable.length > 0 && gtsList.length === 0) {
                nonPlottable.forEach((/**
                 * @param {?} g
                 * @return {?}
                 */
                g => {
                    g.v.forEach((/**
                     * @param {?} value
                     * @return {?}
                     */
                    value => {
                        /** @type {?} */
                        const ts = value[0];
                        if (ts < this.minTick) {
                            this.minTick = ts;
                        }
                        if (ts > this.maxTick) {
                            this.maxTick = ts;
                        }
                    }));
                }));
                // if there is not any plottable data, we must add a fake one with id -1. This one will always be hidden.
                if (0 === gtsList.length) {
                    if (!this.dataHashset[this.minTick]) {
                        this.dataHashset[this.minTick] = [0];
                    }
                    if (!this.dataHashset[this.maxTick]) {
                        this.dataHashset[this.maxTick] = [0];
                    }
                    this.visibility.push(false);
                    this.visibleGtsId.push(-1);
                }
            }
        }
        this.parsing = false;
        this.LOG.debug(['convert'], 'end', dataset);
        this.noData = dataset.length === 0;
        return dataset;
    }
    /**
     * @param {?} plotlyInstance
     * @return {?}
     */
    afterPlot(plotlyInstance) {
        super.afterPlot(plotlyInstance);
        this.marginLeft = parseInt(((/** @type {?} */ (this.graph.plotEl.nativeElement))).querySelector('g.bglayer > rect').getAttribute('x'), 10);
        this.LOG.debug(['plotly_afterPlot']);
        if (this.chartBounds.tsmin !== this.minTick || this.chartBounds.tsmax !== this.maxTick) {
            this.chartBounds.tsmin = this.minTick;
            this.chartBounds.tsmax = this.maxTick;
            this.chartBounds.marginLeft = this.marginLeft;
            this.chartDraw.emit(this.chartBounds);
            if (this.afterBoundsUpdate || this.standalone) {
                this.LOG.debug(['afterPlot', 'updateBounds'], this.minTick, this.maxTick);
                this.emitNewBounds(this.minTick, this.maxTick, this.marginLeft);
                this.loading = false;
                this.afterBoundsUpdate = false;
            }
        }
        else {
            this.loading = false;
        }
    }
    /**
     * @param {?} data
     * @return {?}
     */
    relayout(data) {
        if (data['xaxis.range'] && data['xaxis.range'].length === 2) {
            this.LOG.debug(['relayout', 'updateBounds', 'xaxis.range'], data['xaxis.range']);
            this.chartBounds.msmin = data['xaxis.range'][0];
            this.chartBounds.msmax = data['xaxis.range'][1];
            this.chartBounds.tsmin = moment__default.tz(moment__default(this.chartBounds.msmin), this._options.timeZone).valueOf() * this.divider;
            this.chartBounds.tsmax = moment__default.tz(moment__default(this.chartBounds.msmax), this._options.timeZone).valueOf() * this.divider;
        }
        else if (data['xaxis.range[0]'] && data['xaxis.range[1]']) {
            this.LOG.debug(['relayout', 'updateBounds', 'xaxis.range[x]'], data['xaxis.range[0]']);
            this.chartBounds.msmin = data['xaxis.range[0]'];
            this.chartBounds.msmax = data['xaxis.range[1]'];
            this.chartBounds.tsmin = moment__default.tz(moment__default(this.chartBounds.msmin), this._options.timeZone).valueOf() * this.divider;
            this.chartBounds.tsmax = moment__default.tz(moment__default(this.chartBounds.msmax), this._options.timeZone).valueOf() * this.divider;
        }
        else if (data['xaxis.autorange']) {
            this.LOG.debug(['relayout', 'updateBounds', 'autorange'], data, this.minTick, this.maxTick);
            this.chartBounds.tsmin = this.minTick;
            this.chartBounds.tsmax = this.maxTick;
        }
        this.LOG.debug(['relayout', 'updateBounds'], this.chartBounds);
        this.emitNewBounds(this.chartBounds.tsmin, this.chartBounds.tsmax, this.marginLeft);
        this.loading = false;
        this.afterBoundsUpdate = false;
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    sliderChange($event) {
        this.LOG.debug(['sliderChange'], $event);
        console.log($event);
    }
    /**
     * @param {?} min
     * @param {?} max
     * @return {?}
     */
    updateBounds(min, max) {
        this.LOG.debug(['updateBounds'], min, max, this._options);
        min = min || this.minTick / this.divider;
        max = max || this.maxTick / this.divider;
        this.layout.xaxis.autorange = false;
        this.LOG.debug(['updateBounds'], moment__default.tz(min, this._options.timeZone).toISOString(), moment__default.tz(max, this._options.timeZone).toISOString());
        if (this._options.timeMode && this._options.timeMode === 'timestamp') {
            this.layout.xaxis.range = [min, max];
            this.layout.xaxis.tick0 = min;
        }
        else {
            this.layout.xaxis.range = [
                moment__default.tz(min, this._options.timeZone).toISOString(),
                moment__default.tz(max, this._options.timeZone).toISOString()
            ];
            this.layout.xaxis.tick0 = moment__default.tz(min, this._options.timeZone).toISOString();
        }
        this.layout = Object.assign({}, this.layout);
        this.LOG.debug(['updateBounds'], this.layout);
        this.afterBoundsUpdate = true;
    }
    /**
     * @param {?} chartBounds
     * @return {?}
     */
    setRealBounds(chartBounds) {
        this.afterBoundsUpdate = true;
        this.minTick = chartBounds.tsmin;
        this.maxTick = chartBounds.tsmax;
        this._options.bounds = this._options.bounds || {};
        this._options.bounds.minDate = this.minTick;
        this._options.bounds.maxDate = this.maxTick;
        /** @type {?} */
        const x = {
            tick0: undefined,
            range: [],
        };
        if (this._options.showRangeSelector) {
            x.rangeslider = {
                bgcolor: 'transparent',
                thickness: 40 / this.height
            };
        }
        if (this._options.timeMode && this._options.timeMode === 'timestamp') {
            x.tick0 = this.minTick / this.divider;
            x.range = [this.minTick, this.maxTick];
        }
        else {
            x.tick0 = moment__default.tz(this.minTick / this.divider, this._options.timeZone).toISOString(true);
            x.range = [
                moment__default.tz(this.minTick / this.divider, this._options.timeZone).toISOString(true),
                moment__default.tz(this.maxTick / this.divider, this._options.timeZone).toISOString(true)
            ];
        }
        this.layout.xaxis = x;
        this.layout = Object.assign({}, this.layout);
    }
    /**
     * @param {?} data
     * @return {?}
     */
    hover(data) {
        this.LOG.debug(['hover'], data);
        /** @type {?} */
        let delta = Number.MAX_VALUE;
        // tslint:disable-next-line:no-shadowed-variable
        /** @type {?} */
        let point;
        /** @type {?} */
        const curves = [];
        this.toolTip.nativeElement.style.display = 'block';
        if (data.points[0] && data.points[0].data.orientation !== 'h') {
            /** @type {?} */
            const y = (data.yvals || [''])[0];
            data.points.forEach((/**
             * @param {?} p
             * @return {?}
             */
            p => {
                curves.push(p.curveNumber);
                /** @type {?} */
                const d = Math.abs(p.y - y);
                if (d < delta) {
                    delta = d;
                    point = p;
                }
            }));
        }
        else {
            /** @type {?} */
            const x = (data.xvals || [''])[0];
            data.points.forEach((/**
             * @param {?} p
             * @return {?}
             */
            p => {
                curves.push(p.curveNumber);
                /** @type {?} */
                const d = Math.abs(p.x - x);
                if (d < delta) {
                    delta = d;
                    point = p;
                }
            }));
        }
        if (point && this.highlighted !== point.curveNumber) {
            this.highliteCurve.next({ on: [point.curveNumber], off: curves });
            this.highlighted = point.curveNumber;
        }
        super.hover(data, point);
        this.pointHover.emit(data.event);
        /*setTimeout(() => {
          let pn = -1;
          let tn = -1;
          let color = [];
          let line = {};
          let opacity = [];
          data.points.forEach(p => {
            if (!!p.data.marker) {
              color = p.data.marker.color;
              opacity = p.data.marker.opacity;
              line = p.data.marker.line;
              pn = p.pointNumber;
              tn = p.curveNumber;
              if (pn >= 0) {
                color[pn] = 'transparent';
                opacity[pn] = 1;
                const update = {marker: {color, opacity, line, size: 15}};
                this.graph.restyleChart(update, [tn]);
                this.LOG.debug(['hover'], 'restyleChart inner', update, [tn]);
              }
            }
          });
        })*/
    }
    /**
     * @param {?} data
     * @return {?}
     */
    unhover(data) {
        /** @type {?} */
        let delta = Number.MAX_VALUE;
        // tslint:disable-next-line:no-shadowed-variable
        /** @type {?} */
        let point;
        if (data.points[0] && data.points[0].data.orientation !== 'h') {
            /** @type {?} */
            const y = (data.yvals || [''])[0];
            data.points.forEach((/**
             * @param {?} p
             * @return {?}
             */
            p => {
                /** @type {?} */
                const d = Math.abs(p.y - y);
                if (d < delta) {
                    delta = d;
                    point = p;
                }
            }));
        }
        else {
            /** @type {?} */
            const x = (data.xvals || [''])[0];
            data.points.forEach((/**
             * @param {?} p
             * @return {?}
             */
            p => {
                /** @type {?} */
                const d = Math.abs(p.x - x);
                if (d < delta) {
                    delta = d;
                    point = p;
                }
            }));
        }
        if (!!point && this.highlighted !== point.curveNumber) {
            this.unhighliteCurve.next([this.highlighted]);
            this.highlighted = undefined;
        }
        super.unhover(data, point);
        /*setTimeout(() => {
          let pn = -1;
          let tn = -1;
          let color = [];
          let line = {};
          let opacity = [];
          data.points.forEach(p => {
            if (!!p.data.marker) {
              pn = p.pointNumber;
              tn = p.curveNumber;
              color = p.data.marker.color;
              opacity = p.data.marker.opacity;
              line = p.data.marker.line;
              if (pn >= 0) {
                color[pn] = p.data.line.color;
                opacity[pn] = this._options.showDots ? 1 : 0;
                const update = {marker: {color, opacity, line, size: 15}};
                this.graph.restyleChart(update, [tn]);
              }
            }
          });
        })*/
    }
}
WarpViewChartComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-chart',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\" #chartContainer (mouseleave)=\"hideTooltip()\">\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <p class=\"noData\" *ngIf=\"parsing\">Parsing data</p>\n  <div *ngIf=\"!loading && !noData\" >\n    <warpview-plotly #graph\n                     [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot($event)\"\n                     (relayout)=\"relayout($event)\" (hover)=\"hover($event)\"\n                     [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                     (sliderChange)=\"sliderChange($event)\" (unhover)=\"unhover($event)\"\n                     [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n  <div #toolTip class=\"tooltip\" [ngStyle]=\"getTooltipPosition()\"></div>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}.tooltip{background-color:var(--warp-view-chart-legend-bg)!important;color:var(--warp-view-chart-legend-color)!important;text-align:left;position:absolute;display:none;padding:10px;border:1px solid grey;border-radius:5px;box-shadow:none;pointer-events:none;font-size:10px;min-width:100px;width:auto;max-width:50%;z-index:999;height:auto!important;left:-1000px}.tooltip .chip{border-radius:50%;background-color:#bbb;display:inline-block;width:5px;height:5px;border:2px solid #454545;margin-top:auto;margin-bottom:auto;vertical-align:middle;cursor:pointer}:host{display:block;height:100%}:host #chartContainer{height:100%}:host #chartContainer div{height:100%}:host div.chart{width:var(--warp-view-chart-width);height:var(--warp-view-chart-height)}:host .executionErrorText{color:red;padding:10px;border-radius:3px;background:#faebd7;position:absolute;top:-30px;border:2px solid red}"]
            }] }
];
/** @nocollapse */
WarpViewChartComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: SizeService },
    { type: NgZone }
];
WarpViewChartComponent.propDecorators = {
    hiddenData: [{ type: Input, args: ['hiddenData',] }],
    type: [{ type: Input, args: ['type',] }],
    standalone: [{ type: Input, args: ['standalone',] }],
    boundsDidChange: [{ type: Output, args: ['boundsDidChange',] }],
    pointHover: [{ type: Output, args: ['pointHover',] }],
    warpViewChartResize: [{ type: Output, args: ['warpViewChartResize',] }]
};
if (false) {
    /** @type {?} */
    WarpViewChartComponent.prototype.standalone;
    /** @type {?} */
    WarpViewChartComponent.prototype.boundsDidChange;
    /** @type {?} */
    WarpViewChartComponent.prototype.pointHover;
    /** @type {?} */
    WarpViewChartComponent.prototype.warpViewChartResize;
    /**
     * @type {?}
     * @private
     */
    WarpViewChartComponent.prototype._type;
    /**
     * @type {?}
     * @private
     */
    WarpViewChartComponent.prototype.visibility;
    /**
     * @type {?}
     * @private
     */
    WarpViewChartComponent.prototype.maxTick;
    /**
     * @type {?}
     * @private
     */
    WarpViewChartComponent.prototype.minTick;
    /**
     * @type {?}
     * @private
     */
    WarpViewChartComponent.prototype.visibleGtsId;
    /**
     * @type {?}
     * @private
     */
    WarpViewChartComponent.prototype.gtsId;
    /**
     * @type {?}
     * @private
     */
    WarpViewChartComponent.prototype.dataHashset;
    /**
     * @type {?}
     * @private
     */
    WarpViewChartComponent.prototype.chartBounds;
    /**
     * @type {?}
     * @private
     */
    WarpViewChartComponent.prototype.visibilityStatus;
    /**
     * @type {?}
     * @private
     */
    WarpViewChartComponent.prototype.afterBoundsUpdate;
    /**
     * @type {?}
     * @private
     */
    WarpViewChartComponent.prototype.marginLeft;
    /**
     * @type {?}
     * @private
     */
    WarpViewChartComponent.prototype.maxPlottable;
    /** @type {?} */
    WarpViewChartComponent.prototype.parsing;
    /** @type {?} */
    WarpViewChartComponent.prototype.unhighliteCurve;
    /** @type {?} */
    WarpViewChartComponent.prototype.highliteCurve;
    /** @type {?} */
    WarpViewChartComponent.prototype.layout;
    /**
     * @type {?}
     * @private
     */
    WarpViewChartComponent.prototype.highlighted;
    /** @type {?} */
    WarpViewChartComponent.prototype.el;
    /** @type {?} */
    WarpViewChartComponent.prototype.renderer;
    /** @type {?} */
    WarpViewChartComponent.prototype.sizeService;
    /** @type {?} */
    WarpViewChartComponent.prototype.ngZone;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// noinspection UnterminatedStatementJS
/**
 * Handles HttpClient errors
 */
class HttpErrorHandler {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class Warp10Service {
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
/** @nocollapse */ Warp10Service.ngInjectableDef = ɵɵdefineInjectable({ factory: function Warp10Service_Factory() { return new Warp10Service(ɵɵinject(HttpClient), ɵɵinject(HttpErrorHandler)); }, token: Warp10Service, providedIn: "root" });
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class WarpViewTileComponent extends WarpViewComponent {
    /**
     * @param {?} el
     * @param {?} sizeService
     * @param {?} renderer
     * @param {?} ngZone
     * @param {?} warp10Service
     */
    constructor(el, sizeService, renderer, ngZone, warp10Service) {
        super(el, renderer, sizeService, ngZone);
        this.el = el;
        this.sizeService = sizeService;
        this.renderer = renderer;
        this.ngZone = ngZone;
        this.warp10Service = warp10Service;
        this.warpscriptResult = new EventEmitter();
        this.execStatus = new EventEmitter();
        this.execError = new EventEmitter();
        this.type = 'line';
        this.url = '';
        this.isAlone = false; // used by plot to manage its keyboard events
        this.loaderMessage = '';
        this.loading = false;
        this._gtsFilter = '';
        this._warpScript = '';
        this.execUrl = '';
        this.timeUnit = 'us';
        this.LOG = new Logger(WarpViewTileComponent, this._debug);
    }
    // used by plot to manage its keyboard events
    /**
     * @param {?} gtsFilter
     * @return {?}
     */
    set gtsFilter(gtsFilter) {
        this._gtsFilter = gtsFilter;
    }
    /**
     * @param {?} warpScript
     * @return {?}
     */
    set warpscript(warpScript) {
        if (!!warpScript && this._warpScript !== warpScript) {
            this._warpScript = warpScript;
            this.execute(true);
        }
    }
    /**
     * @return {?}
     */
    get warpscript() {
        return this._warpScript;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this._options = this._options || this.defOptions;
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this._warpScript = this._warpScript || this.warpRef.nativeElement.textContent.trim();
        this.LOG.debug(['ngAfterViewInit', 'warpScript'], this._warpScript);
        this.el.nativeElement.style.opacity = '1';
        if (this.warpRef.nativeElement.textContent.trim() !== '') {
            this.execute(false);
        }
    }
    /**
     * @param {?} options
     * @return {?}
     */
    update(options) {
        this.LOG.debug(['update', 'options'], options);
    }
    /* Listeners */
    /**
     * @param {?} event
     * @return {?}
     */
    // @HostListener('keydown', ['$event'])
    handleKeyDown(event) {
        if (event.key === 'r') {
            this.execute(false);
        }
    }
    /**
     * detect some VSCode special modifiers in the beginnig of the code:
     * \@endpoint xxxURLxxx
     * \@timeUnit ns
     * warning : the first line is empty (to confirm with other browsers)
     * @private
     * @return {?}
     */
    detectWarpScriptSpecialComments() {
        // analyse the first warpScript lines starting with //
        /** @type {?} */
        const extraParamsPattern = /\s*\/\/\s*@(\w*)\s*(.*)$/g;
        /** @type {?} */
        const warpscriptLines = this._warpScript.split('\n');
        for (let l = 1; l < warpscriptLines.length; l++) {
            /** @type {?} */
            const currentLine = warpscriptLines[l];
            if (currentLine === '' || currentLine.search('//') >= 0) {
                // find and extract // @paramname parameters
                /** @type {?} */
                let lineOnMatch;
                /** @type {?} */
                const re = RegExp(extraParamsPattern);
                // noinspection JSAssignmentUsedAsCondition
                // tslint:disable-next-line:no-conditional-assignment JSAssignmentUsedAsCondition
                // noinspection JSAssignmentUsedAsCondition
                while (lineOnMatch = re.exec(currentLine)) {
                    /** @type {?} */
                    const parameterName = lineOnMatch[1];
                    /** @type {?} */
                    const parameterValue = lineOnMatch[2];
                    switch (parameterName) {
                        case 'endpoint': //        // @endpoint http://mywarp10server/api/v0/exec
                            this.execUrl = parameterValue;
                            break;
                        case 'timeUnit':
                            this.timeUnit = parameterValue.toLowerCase(); // set the time unit for graphs
                            break;
                        default:
                            break;
                    }
                }
            }
            else {
                break; // no more comments at the beginning of the file
            }
        }
    }
    /**
     * @private
     * @param {?} isRefresh
     * @return {?}
     */
    execute(isRefresh) {
        if (!!this._warpScript && this._warpScript.trim() !== '') {
            this.LOG.debug(['execute'], isRefresh);
            this.error = undefined;
            this.loading = !isRefresh;
            this.execResult = undefined;
            this.loaderMessage = 'Requesting data';
            this.execUrl = this.url;
            //  this.execResult = undefined;
            this.detectWarpScriptSpecialComments();
            this.LOG.debug(['execute', 'warpScript'], this._warpScript);
            this.warp10Service.exec(this._warpScript, this.execUrl).subscribe((/**
             * @param {?} response
             * @return {?}
             */
            (response) => {
                this.loading = false;
                this.LOG.debug(['execute'], response);
                if (((/** @type {?} */ (response))).body) {
                    try {
                        /** @type {?} */
                        const body = ((/** @type {?} */ (response))).body;
                        this.warpscriptResult.emit(body);
                        /** @type {?} */
                        const headers = ((/** @type {?} */ (response))).headers;
                        this.status = `Your script execution took
 ${GTSLib.formatElapsedTime(parseInt(headers.get('x-warp10-elapsed'), 10))}
 serverside, fetched
 ${headers.get('x-warp10-fetched')} datapoints and performed
 ${headers.get('x-warp10-ops')}  WarpScript operations.`;
                        this.execStatus.emit({
                            message: this.status,
                            ops: parseInt(headers.get('x-warp10-ops'), 10),
                            elapsed: parseInt(headers.get('x-warp10-elapsed'), 10),
                            fetched: parseInt(headers.get('x-warp10-fetched'), 10),
                        });
                        if (this._autoRefresh !== this._options.autoRefresh) {
                            this._autoRefresh = this._options.autoRefresh;
                            if (this.timer) {
                                window.clearInterval(this.timer);
                            }
                            if (this._autoRefresh && this._autoRefresh > 0) {
                                this.timer = window.setInterval((/**
                                 * @return {?}
                                 */
                                () => this.execute(true)), this._autoRefresh * 1000);
                            }
                        }
                        setTimeout((/**
                         * @return {?}
                         */
                        () => {
                            this.execResult = body;
                            this.loading = false;
                        }));
                    }
                    catch (e) {
                        this.LOG.error(['execute'], e);
                        this.loading = false;
                    }
                }
                else {
                    this.LOG.error(['execute'], response);
                    this.error = response;
                    this.loading = false;
                    this.execError.emit(response);
                }
            }), (/**
             * @param {?} e
             * @return {?}
             */
            e => {
                this.loading = false;
                this.execError.emit(e);
                this.LOG.error(['execute'], e);
            }));
        }
    }
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    convert(data) {
        return [];
    }
    /**
     * @param {?} event
     * @return {?}
     */
    chartDrawn(event) {
        this.chartDraw.emit(event);
    }
}
WarpViewTileComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-tile',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n<div class=\"wrapper\" [ngClass]=\"{'full':  responsive}\">\n  <div class=\"tilewrapper\">\n    <h1 *ngIf=\"chartTitle\">{{chartTitle}}</h1>\n    <div [ngClass]=\"{'tile': true,'notitle':  !chartTitle || chartTitle === ''}\">\n      <warpview-spinner *ngIf=\"loading\" message=\"Requesting data\"></warpview-spinner>\n      <div *ngIf=\"_options.showErrors && error\" style=\"height: calc(100% - 30px); width: 100%\">\n        <warpview-display [responsive]=\"true\" [debug]=\"debug\" [options]=\"_options\"\n                          [data]=\"{ data: error,  globalParams: {\n  timeMode:  'custom', bgColor: '#D32C2E', fontColor: '#ffffff'}}\"></warpview-display>\n      </div>\n      <div *ngIf=\"!error\" style=\"height: 100%; width: 100%\" [hidden]=\"loading\">\n        <warpview-result-tile [debug]=\"debug\" [type]=\"type\" [unit]=\"unit\" [options]=\"_options\"\n                              (chartDraw)=\"chartDrawn($event)\"\n                              [showLegend]=\"showLegend\" [data]=\"execResult\"></warpview-result-tile>\n      </div>\n    </div>\n  </div>\n  <small *ngIf=\"_options.showStatus\" class=\"status\">{{status}}</small>\n</div>\n\n<div #warpRef style=\"display: none\">\n  <ng-content></ng-content>\n</div>\n",
                providers: [HttpErrorHandler],
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host,warp-view-tile,warpview-tile{width:var(--warp-view-tile-width,100%);max-height:var(--warp-view-tile-height,100%);overflow:auto;min-width:var(--warp-view-tile-width,100%);min-height:var(--warp-view-tile-height,100%)}:host .error,warp-view-tile .error,warpview-tile .error{width:100%;text-align:center;color:#dc3545;font-weight:700}:host .wrapper,warp-view-tile .wrapper,warpview-tile .wrapper{opacity:1;min-height:50px;width:var(--warp-view-tile-width,100%);height:var(--warp-view-tile-height,100%)}:host .wrapper .status,warp-view-tile .wrapper .status,warpview-tile .wrapper .status{position:absolute;z-index:999;bottom:20px;background-color:rgba(255,255,255,.7);padding:1px 5px;font-size:11px;color:#000}:host .wrapper.full,warp-view-tile .wrapper.full,warpview-tile .wrapper.full{width:100%;height:100%;display:-webkit-box;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;flex-direction:column;justify-content:space-around}:host .wrapper .tilewrapper,warp-view-tile .wrapper .tilewrapper,warpview-tile .wrapper .tilewrapper{width:100%;height:100%}:host .wrapper .tilewrapper .tile,warp-view-tile .wrapper .tilewrapper .tile,warpview-tile .wrapper .tilewrapper .tile{width:100%;height:calc(var(--warp-view-tile-height,100%) - 40px);overflow-y:auto;overflow-x:hidden;position:relative}:host .wrapper .tilewrapper .notitle,warp-view-tile .wrapper .tilewrapper .notitle,warpview-tile .wrapper .tilewrapper .notitle{height:100%}:host .wrapper .tilewrapper h1,warp-view-tile .wrapper .tilewrapper h1,warpview-tile .wrapper .tilewrapper h1{font-size:20px;padding:5px;margin:0;color:var(--warp-view-font-color)}:host .wrapper .tilewrapper h1 small,warp-view-tile .wrapper .tilewrapper h1 small,warpview-tile .wrapper .tilewrapper h1 small{font-size:10px;margin-left:10px}"]
            }] }
];
/** @nocollapse */
WarpViewTileComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: SizeService },
    { type: Renderer2 },
    { type: NgZone },
    { type: Warp10Service }
];
WarpViewTileComponent.propDecorators = {
    warpRef: [{ type: ViewChild, args: ['warpRef', { static: true },] }],
    warpscriptResult: [{ type: Output, args: ['warpscriptResult',] }],
    execStatus: [{ type: Output, args: ['execStatus',] }],
    execError: [{ type: Output, args: ['execError',] }],
    type: [{ type: Input, args: ['type',] }],
    chartTitle: [{ type: Input, args: ['chartTitle',] }],
    url: [{ type: Input, args: ['url',] }],
    isAlone: [{ type: Input, args: ['isAlone',] }],
    gtsFilter: [{ type: Input, args: ['gtsFilter',] }],
    warpscript: [{ type: Input }],
    handleKeyDown: [{ type: HostListener, args: ['document:keyup', ['$event'],] }]
};
if (false) {
    /** @type {?} */
    WarpViewTileComponent.prototype.warpRef;
    /** @type {?} */
    WarpViewTileComponent.prototype.warpscriptResult;
    /** @type {?} */
    WarpViewTileComponent.prototype.execStatus;
    /** @type {?} */
    WarpViewTileComponent.prototype.execError;
    /** @type {?} */
    WarpViewTileComponent.prototype.type;
    /** @type {?} */
    WarpViewTileComponent.prototype.chartTitle;
    /** @type {?} */
    WarpViewTileComponent.prototype.url;
    /** @type {?} */
    WarpViewTileComponent.prototype.isAlone;
    /** @type {?} */
    WarpViewTileComponent.prototype.loaderMessage;
    /** @type {?} */
    WarpViewTileComponent.prototype.error;
    /** @type {?} */
    WarpViewTileComponent.prototype.status;
    /** @type {?} */
    WarpViewTileComponent.prototype.loading;
    /** @type {?} */
    WarpViewTileComponent.prototype.execResult;
    /**
     * @type {?}
     * @private
     */
    WarpViewTileComponent.prototype.timer;
    /**
     * @type {?}
     * @private
     */
    WarpViewTileComponent.prototype._autoRefresh;
    /**
     * @type {?}
     * @private
     */
    WarpViewTileComponent.prototype._gtsFilter;
    /**
     * @type {?}
     * @private
     */
    WarpViewTileComponent.prototype._warpScript;
    /**
     * @type {?}
     * @private
     */
    WarpViewTileComponent.prototype.execUrl;
    /**
     * @type {?}
     * @private
     */
    WarpViewTileComponent.prototype.timeUnit;
    /** @type {?} */
    WarpViewTileComponent.prototype.el;
    /** @type {?} */
    WarpViewTileComponent.prototype.sizeService;
    /** @type {?} */
    WarpViewTileComponent.prototype.renderer;
    /** @type {?} */
    WarpViewTileComponent.prototype.ngZone;
    /**
     * @type {?}
     * @private
     */
    WarpViewTileComponent.prototype.warp10Service;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class WarpViewSpinnerComponent {
    constructor() {
        this.message = 'Loading and parsing data...';
    }
}
WarpViewSpinnerComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-spinner',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"wrapper\">\n  <div class=\"lds-ring\">\n    <div></div>\n    <div></div>\n    <div></div>\n    <div></div>\n  </div>\n  <h2>{{message}}</h2>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host .wrapper{position:relative;width:100%;height:100%;min-height:230px}:host .wrapper h2{text-align:center;display:inline-block;position:absolute;width:50%;height:64px;margin:auto;bottom:0;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}:host .wrapper .lds-ring{display:inline-block;position:absolute;width:64px;height:64px;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}:host .wrapper .lds-ring div{box-sizing:border-box;display:block;position:absolute;width:51px;height:51px;margin:6px;border:6px solid;border-radius:50%;-webkit-animation:1.2s cubic-bezier(.5,0,.5,1) infinite lds-ring;animation:1.2s cubic-bezier(.5,0,.5,1) infinite lds-ring;border-color:var(--warp-view-spinner-color) transparent transparent transparent}:host .wrapper .lds-ring div:nth-child(1){-webkit-animation-delay:-.45s;animation-delay:-.45s}:host .wrapper .lds-ring div:nth-child(2){-webkit-animation-delay:-.3s;animation-delay:-.3s}:host .wrapper .lds-ring div:nth-child(3){-webkit-animation-delay:-.15s;animation-delay:-.15s}@-webkit-keyframes lds-ring{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes lds-ring{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}"]
            }] }
];
WarpViewSpinnerComponent.propDecorators = {
    message: [{ type: Input, args: ['message',] }]
};
if (false) {
    /** @type {?} */
    WarpViewSpinnerComponent.prototype.message;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *
 */
class WarpViewToggleComponent {
    /**
     * @param {?} el
     */
    constructor(el) {
        this.el = el;
        this.text1 = '';
        this.text2 = '';
        this.stateChange = new EventEmitter();
        this.state = false;
    }
    /**
     * @param {?} state
     * @return {?}
     */
    set checked(state) {
        this.state = state;
    }
    /**
     * @return {?}
     */
    get checked() {
        return this.state;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.state = this.checked;
    }
    /**
     * @return {?}
     */
    switched() {
        this.state = !this.state;
        this.stateChange.emit({ state: this.state, id: this.el.nativeElement.id });
    }
}
WarpViewToggleComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-toggle',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"container\">\n  <div class=\"text\">{{text1}}</div>\n  <label class=\"switch\">\n    <input type=\"checkbox\" class=\"switch-input\" [checked]=\"state\" (click)=\"switched()\"/>\n    <span class=\"switch-label\"></span>\n    <span class=\"switch-handle\"></span>\n  </label>\n  <div class=\"text\">{{text2}}</div>\n</div>\n",
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host .switch{position:relative;margin-top:auto;margin-bottom:auto;display:block;width:var(--warp-view-switch-width);height:var(--warp-view-switch-height);padding:3px;border-radius:var(--warp-view-switch-radius);cursor:pointer}:host .switch-input{display:none}:host .switch-label{position:relative;display:block;height:inherit;text-transform:uppercase;background:var(--warp-view-switch-inset-color);border-radius:inherit;box-shadow:inset 0 1px 2px rgba(0,0,0,.12),inset 0 0 2px rgba(0,0,0,.15)}:host .switch-input:checked~.switch-label{background:var(--warp-view-switch-inset-checked-color);box-shadow:inset 0 1px 2px rgba(0,0,0,.15),inset 0 0 3px rgba(0,0,0,.2)}:host .switch-handle{position:absolute;top:4px;left:4px;width:calc(var(--warp-view-switch-height) - 2px);height:calc(var(--warp-view-switch-height) - 2px);background:var(--warp-view-switch-handle-color);border-radius:100%;box-shadow:1px 1px 5px rgba(0,0,0,.2)}:host .switch-input:checked~.switch-handle{left:calc(var(--warp-view-switch-width) - var(--warp-view-switch-height) - 2px);background:var(--warp-view-switch-handle-checked-color);box-shadow:-1px 1px 5px rgba(0,0,0,.2)}:host .switch-handle,:host .switch-label{-webkit-transition:All .3s;transition:All .3s;-moz-transition:All .3s;-o-transition:All .3s}:host .container{display:-webkit-box;display:flex}:host .text{color:var(--warp-view-font-color);padding:7px}"]
            }] }
];
/** @nocollapse */
WarpViewToggleComponent.ctorParameters = () => [
    { type: ElementRef }
];
WarpViewToggleComponent.propDecorators = {
    checked: [{ type: Input, args: ['checked',] }],
    text1: [{ type: Input, args: ['text1',] }],
    text2: [{ type: Input, args: ['text2',] }],
    stateChange: [{ type: Output, args: ['stateChange',] }]
};
if (false) {
    /** @type {?} */
    WarpViewToggleComponent.prototype.text1;
    /** @type {?} */
    WarpViewToggleComponent.prototype.text2;
    /** @type {?} */
    WarpViewToggleComponent.prototype.stateChange;
    /** @type {?} */
    WarpViewToggleComponent.prototype.state;
    /** @type {?} */
    WarpViewToggleComponent.prototype.el;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class WarpViewBarComponent extends WarpViewComponent {
    /**
     * @param {?} el
     * @param {?} renderer
     * @param {?} sizeService
     * @param {?} ngZone
     */
    constructor(el, renderer, sizeService, ngZone) {
        super(el, renderer, sizeService, ngZone);
        this.el = el;
        this.renderer = renderer;
        this.sizeService = sizeService;
        this.ngZone = ngZone;
        this.layout = {
            showlegend: false,
            xaxis: {},
            yaxis: {
                exponentformat: 'none',
                fixedrange: true,
                showline: true
            },
            margin: {
                t: 10,
                b: 40,
                r: 10,
                l: 50
            }
        };
        this.LOG = new Logger(WarpViewBarComponent, this._debug);
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.drawChart();
    }
    /**
     * @param {?} options
     * @return {?}
     */
    update(options) {
        this.drawChart();
    }
    /**
     * @private
     * @return {?}
     */
    drawChart() {
        if (!this.initChart(this.el)) {
            return;
        }
        this.plotlyConfig.scrollZoom = true;
        this.buildGraph();
    }
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    convert(data) {
        /** @type {?} */
        let gtsList = [];
        if (GTSLib.isArray(data.data)) {
            data.data = GTSLib.flatDeep((/** @type {?} */ (data.data)));
            this.LOG.debug(['convert', 'isArray']);
            if (data.data.length > 0 && GTSLib.isGts(data.data[0])) {
                this.LOG.debug(['convert', 'isArray 2']);
                gtsList = GTSLib.flattenGtsIdArray((/** @type {?} */ (data.data)), 0).res;
            }
            else {
                this.LOG.debug(['convert', 'isArray 3']);
                gtsList = (/** @type {?} */ (data.data));
            }
        }
        else {
            this.LOG.debug(['convert', 'not array']);
            gtsList = [data.data];
        }
        this.LOG.debug(['convert', 'gtsList'], gtsList);
        /** @type {?} */
        const dataset = [];
        gtsList.forEach((/**
         * @param {?} gts
         * @param {?} i
         * @return {?}
         */
        (gts, i) => {
            this.LOG.debug(['convert', 'gts item'], gts);
            if (gts.v) {
                Timsort.sort(gts.v, (/**
                 * @param {?} a
                 * @param {?} b
                 * @return {?}
                 */
                (a, b) => a[0] - b[0]));
                /** @type {?} */
                const label = GTSLib.serializeGtsMetadata(gts);
                /** @type {?} */
                const c = ColorLib.getColor(gts.id || i, this._options.scheme);
                /** @type {?} */
                const color = ((data.params || [])[i] || { datasetColor: c }).datasetColor || c;
                /** @type {?} */
                const series = {
                    type: 'bar',
                    mode: 'lines+markers',
                    name: label,
                    text: label,
                    orientation: this._options.horizontal ? 'h' : 'v',
                    x: [],
                    y: [],
                    hoverinfo: 'none',
                    marker: {
                        color: ColorLib.transparentize(color),
                        line: {
                            color,
                            width: 1
                        }
                    }
                };
                gts.v.forEach((/**
                 * @param {?} value
                 * @return {?}
                 */
                value => {
                    /** @type {?} */
                    const ts = value[0];
                    if (!this._options.horizontal) {
                        series.y.push(value[value.length - 1]);
                        if (this._options.timeMode && this._options.timeMode === 'timestamp') {
                            series.x.push(ts);
                        }
                        else {
                            series.x.push(moment__default.tz(moment__default.utc(ts / this.divider), this._options.timeZone).toISOString());
                        }
                    }
                    else {
                        series.x.push(value[value.length - 1]);
                        if (this._options.timeMode && this._options.timeMode === 'timestamp') {
                            series.y.push(ts);
                        }
                        else {
                            series.y.push(moment__default.tz(moment__default.utc(ts / this.divider), this._options.timeZone).toISOString());
                        }
                    }
                }));
                dataset.push(series);
            }
            else {
                this._options.timeMode = 'custom';
                this.LOG.debug(['convert', 'gts'], gts);
                (gts.columns || []).forEach((/**
                 * @param {?} label
                 * @param {?} index
                 * @return {?}
                 */
                (label, index) => {
                    /** @type {?} */
                    const c = ColorLib.getColor(gts.id || index, this._options.scheme);
                    /** @type {?} */
                    const color = ((data.params || [])[index] || { datasetColor: c }).datasetColor || c;
                    /** @type {?} */
                    const series = {
                        type: 'bar',
                        mode: 'lines+markers',
                        name: label,
                        text: label,
                        orientation: this._options.horizontal ? 'h' : 'v',
                        x: [],
                        y: [],
                        hoverinfo: 'none',
                        marker: {
                            color: ColorLib.transparentize(color),
                            line: {
                                color,
                                width: 1
                            }
                        }
                    };
                    if (this._options.horizontal) {
                        (gts.rows || []).forEach((/**
                         * @param {?} r
                         * @return {?}
                         */
                        r => {
                            series.y.unshift(r[0]);
                            series.x.push(r[index + 1]);
                        }));
                    }
                    else {
                        (gts.rows || []).forEach((/**
                         * @param {?} r
                         * @return {?}
                         */
                        r => {
                            series.x.push(r[0]);
                            series.y.push(r[index + 1]);
                        }));
                    }
                    dataset.push(series);
                }));
            }
        }));
        this.LOG.debug(['convert', 'dataset'], dataset, this._options.horizontal);
        return dataset;
    }
    /**
     * @private
     * @return {?}
     */
    buildGraph() {
        this.LOG.debug(['buildGraph', 'this.layout'], this.responsive);
        this.LOG.debug(['buildGraph', 'this.layout'], this.layout);
        this.LOG.debug(['buildGraph', 'this.plotlyConfig'], this.plotlyConfig);
        this.layout.showlegend = this._showLegend;
        this.layout.barmode = this._options.stacked ? 'stack' : 'group';
        this.layout.yaxis.color = this.getGridColor(this.el.nativeElement);
        this.layout.xaxis.color = this.getGridColor(this.el.nativeElement);
        this.loading = false;
    }
}
WarpViewBarComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-bar',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\" #chartContainer (mouseleave)=\"hideTooltip()\">\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display or wrong data format.</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-plotly #graph *ngIf=\"plotlyData?.length > 0\"\n                 [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot()\"\n                 className=\"chart\" (hover)=\"hover($event)\" (unhover)=\"unhover($event)\"\n                 [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                 [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n  <div #toolTip class=\"tooltip\" [ngStyle]=\"getTooltipPosition()\"></div>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}.tooltip{background-color:var(--warp-view-chart-legend-bg)!important;color:var(--warp-view-chart-legend-color)!important;text-align:left;position:absolute;display:none;padding:10px;border:1px solid grey;border-radius:5px;box-shadow:none;pointer-events:none;font-size:10px;min-width:100px;width:auto;max-width:50%;z-index:999;height:auto!important;left:-1000px}.tooltip .chip{border-radius:50%;background-color:#bbb;display:inline-block;width:5px;height:5px;border:2px solid #454545;margin-top:auto;margin-bottom:auto;vertical-align:middle;cursor:pointer}:host{display:block;height:100%}:host .modebar-group path{fill:var(--warp-view-font-color)}:host #chartContainer{height:100%}:host #chartContainer div{height:100%}:host div.chart{width:var(--warp-view-chart-width);height:var(--warp-view-chart-height)}"]
            }] }
];
/** @nocollapse */
WarpViewBarComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: SizeService },
    { type: NgZone }
];
if (false) {
    /** @type {?} */
    WarpViewBarComponent.prototype.layout;
    /** @type {?} */
    WarpViewBarComponent.prototype.el;
    /** @type {?} */
    WarpViewBarComponent.prototype.renderer;
    /** @type {?} */
    WarpViewBarComponent.prototype.sizeService;
    /** @type {?} */
    WarpViewBarComponent.prototype.ngZone;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class WarpViewBubbleComponent extends WarpViewComponent {
    /**
     * @param {?} el
     * @param {?} renderer
     * @param {?} sizeService
     * @param {?} ngZone
     */
    constructor(el, renderer, sizeService, ngZone) {
        super(el, renderer, sizeService, ngZone);
        this.el = el;
        this.renderer = renderer;
        this.sizeService = sizeService;
        this.ngZone = ngZone;
        this.layout = {
            showlegend: false,
            xaxis: {},
            hovermode: 'closest',
            hoverdistance: 20,
            yaxis: {},
            margin: {
                t: 10,
                b: 25,
                r: 10,
                l: 50
            }
        };
        this.LOG = new Logger(WarpViewBubbleComponent, this._debug);
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.drawChart();
    }
    /**
     * @param {?} options
     * @return {?}
     */
    update(options) {
        this.drawChart();
    }
    /**
     * @private
     * @return {?}
     */
    drawChart() {
        if (!this.initChart(this.el)) {
            return;
        }
        this.plotlyConfig.scrollZoom = true;
        this.buildGraph();
    }
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    convert(data) {
        /** @type {?} */
        const dataset = [];
        GTSLib.flatDeep((/** @type {?} */ (data.data))).forEach((/**
         * @param {?} gts
         * @param {?} i
         * @return {?}
         */
        (gts, i) => {
            /** @type {?} */
            const label = Object.keys(gts)[0];
            /** @type {?} */
            const c = ColorLib.getColor(gts.id || i, this._options.scheme);
            /** @type {?} */
            const color = ((data.params || [])[i] || { datasetColor: c }).datasetColor || c;
            /** @type {?} */
            const series = {
                type: 'scattergl',
                mode: 'markers',
                name: label,
                text: label,
                x: [],
                y: [],
                hoverinfo: 'none',
                marker: {
                    color: ColorLib.transparentize(color),
                    line: {
                        color
                    },
                    size: []
                }
            };
            if (GTSLib.isGts(gts)) {
                /** @type {?} */
                const ticks = gts.v.map((/**
                 * @param {?} t
                 * @return {?}
                 */
                t => t[0]));
                /** @type {?} */
                const values = gts.v.map((/**
                 * @param {?} t
                 * @return {?}
                 */
                t => t[t.length - 1]));
                /** @type {?} */
                const sizes = new Array(gts.v.length).fill(10);
                if (this._options.timeMode === 'timestamp') {
                    series.x = ticks;
                }
                else {
                    if (this._options.timeZone !== 'UTC') {
                        series.x = ticks.map((/**
                         * @param {?} t
                         * @return {?}
                         */
                        t => moment__default.utc(t / this.divider).tz(this._options.timeZone).toISOString()));
                    }
                    else {
                        series.x = ticks.map((/**
                         * @param {?} t
                         * @return {?}
                         */
                        t => moment__default.utc(t / this.divider).toISOString()));
                    }
                }
                series.y = values;
                series.marker.size = sizes;
            }
            else {
                gts[label].forEach((/**
                 * @param {?} value
                 * @return {?}
                 */
                value => {
                    series.y.push(value[0]);
                    series.x.push(value[1]);
                    series.marker.size.push(value[2]);
                }));
            }
            dataset.push(series);
        }));
        this.noData = dataset.length === 0;
        this.LOG.debug(['convert', 'dataset'], dataset);
        return dataset;
    }
    /**
     * @private
     * @return {?}
     */
    buildGraph() {
        this.LOG.debug(['drawChart', 'this.responsive'], this._responsive);
        this.LOG.debug(['drawChart', 'this.layout'], this.layout);
        this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig);
        this.layout.showlegend = this.showLegend;
        this.layout.yaxis.color = this.getGridColor(this.el.nativeElement);
        this.layout.xaxis.color = this.getGridColor(this.el.nativeElement);
        this.loading = false;
    }
}
WarpViewBubbleComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-bubble',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\" #chartContainer (mouseleave)=\"hideTooltip()\">\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display or wrong data format.</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-plotly #graph *ngIf=\"plotlyData?.length > 0\"\n                 [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot()\"\n                 className=\"chart\" (hover)=\"hover($event)\" (unhover)=\"unhover($event)\"\n                 [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                 [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n  <div #toolTip class=\"tooltip\" [ngStyle]=\"getTooltipPosition()\"></div>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}.tooltip{background-color:var(--warp-view-chart-legend-bg)!important;color:var(--warp-view-chart-legend-color)!important;text-align:left;position:absolute;display:none;padding:10px;border:1px solid grey;border-radius:5px;box-shadow:none;pointer-events:none;font-size:10px;min-width:100px;width:auto;max-width:50%;z-index:999;height:auto!important;left:-1000px}.tooltip .chip{border-radius:50%;background-color:#bbb;display:inline-block;width:5px;height:5px;border:2px solid #454545;margin-top:auto;margin-bottom:auto;vertical-align:middle;cursor:pointer}:host{display:block;height:100%}:host #chartContainer{height:100%}:host #chartContainer div{height:100%}:host div.chart{width:var(--warp-view-chart-width);height:var(--warp-view-chart-height)}"]
            }] }
];
/** @nocollapse */
WarpViewBubbleComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: SizeService },
    { type: NgZone }
];
if (false) {
    /** @type {?} */
    WarpViewBubbleComponent.prototype.layout;
    /** @type {?} */
    WarpViewBubbleComponent.prototype.el;
    /** @type {?} */
    WarpViewBubbleComponent.prototype.renderer;
    /** @type {?} */
    WarpViewBubbleComponent.prototype.sizeService;
    /** @type {?} */
    WarpViewBubbleComponent.prototype.ngZone;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class WarpViewDatagridComponent extends WarpViewComponent {
    /**
     * @param {?} el
     * @param {?} renderer
     * @param {?} sizeService
     * @param {?} ngZone
     */
    constructor(el, renderer, sizeService, ngZone) {
        super(el, renderer, sizeService, ngZone);
        this.el = el;
        this.renderer = renderer;
        this.sizeService = sizeService;
        this.ngZone = ngZone;
        this.elemsCount = 15;
        // tslint:disable-next-line:variable-name
        this._tabularData = [];
        this.LOG = new Logger(WarpViewDatagridComponent, this._debug);
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.drawChart();
    }
    /**
     * @param {?} options
     * @return {?}
     */
    update(options) {
        this.drawChart();
    }
    /**
     * @private
     * @return {?}
     */
    drawChart() {
        this.loading = false;
        this.chartDraw.emit();
        if (!this.initChart(this.el)) {
            return;
        }
    }
    /**
     * @private
     * @param {?} i
     * @param {?} j
     * @param {?} key
     * @param {?} def
     * @return {?}
     */
    getHeaderParam(i, j, key, def) {
        return this._data.params && this._data.params[i] && this._data.params[i][key] && this._data.params[i][key][j]
            ? this._data.params[i][key][j]
            : this._data.globalParams && this._data.globalParams[key] && this._data.globalParams[key][j]
                ? this._data.globalParams[key][j]
                : def;
    }
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    convert(data) {
        if (GTSLib.isArray(data.data)) {
            /** @type {?} */
            const dataList = GTSLib.flatDeep((/** @type {?} */ (this._data.data)));
            this.LOG.debug(['convert', 'isArray'], dataList);
            if (data.data.length > 0 && GTSLib.isGts(dataList[0])) {
                this._tabularData = this.parseData(dataList);
            }
            else {
                this._tabularData = this.parseCustomData(dataList);
            }
        }
        else {
            this._tabularData = this.parseCustomData([(/** @type {?} */ (data.data))]);
        }
        return [];
    }
    /**
     * @private
     * @param {?} data
     * @return {?}
     */
    parseCustomData(data) {
        /** @type {?} */
        const flatData = [];
        data.forEach((/**
         * @param {?} d
         * @return {?}
         */
        d => {
            /** @type {?} */
            const dataSet = {
                name: d.title || '',
                values: d.rows,
                headers: d.columns,
            };
            flatData.push(dataSet);
        }));
        this.LOG.debug(['parseCustomData', 'flatData'], flatData);
        return flatData;
    }
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    parseData(data) {
        /** @type {?} */
        const flatData = [];
        this.LOG.debug(['parseData'], data);
        data.forEach((/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        (d, i) => {
            /** @type {?} */
            const dataSet = {
                name: '',
                values: [],
                headers: []
            };
            if (GTSLib.isGts(d)) {
                this.LOG.debug(['parseData', 'isGts'], d);
                dataSet.name = GTSLib.serializeGtsMetadata(d);
                dataSet.values = d.v.map((/**
                 * @param {?} v
                 * @return {?}
                 */
                v => [this.formatDate(v[0])].concat(v.slice(1, v.length))));
            }
            else {
                this.LOG.debug(['parseData', 'is not a Gts'], d);
                dataSet.values = GTSLib.isArray(d) ? d : [d];
            }
            dataSet.headers = [this.getHeaderParam(i, 0, 'headers', 'Date')];
            if (d.v && d.v.length > 0 && d.v[0].length > 2) {
                dataSet.headers.push(this.getHeaderParam(i, 1, 'headers', 'Latitude'));
            }
            if (d.v && d.v.length > 0 && d.v[0].length > 3) {
                dataSet.headers.push(this.getHeaderParam(i, 2, 'headers', 'Longitude'));
            }
            if (d.v && d.v.length > 0 && d.v[0].length > 4) {
                dataSet.headers.push(this.getHeaderParam(i, 3, 'headers', 'Elevation'));
            }
            if (d.v && d.v.length > 0) {
                dataSet.headers.push(this.getHeaderParam(i, d.v[0].length - 1, 'headers', 'Value'));
            }
            if (dataSet.values.length > 0) {
                flatData.push(dataSet);
            }
        }));
        this.LOG.debug(['parseData', 'flatData'], flatData, this._options.timeMode);
        return flatData;
    }
    /**
     * @param {?} date
     * @return {?}
     */
    formatDate(date) {
        return this._options.timeMode === 'date' ? moment__default.tz(date / this.divider, this._options.timeZone).toISOString() : date.toString();
    }
}
WarpViewDatagridComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-datagrid',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"wrapper\" style=\"overflow: auto; height: 100%\">\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-paginable\n      *ngFor=\"let data of _tabularData\"\n      [data]=\"data\" [options]=\"_options\"\n      [debug]=\"debug\"></warpview-paginable>\n  </div>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}"]
            }] }
];
/** @nocollapse */
WarpViewDatagridComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: SizeService },
    { type: NgZone }
];
WarpViewDatagridComponent.propDecorators = {
    elemsCount: [{ type: Input, args: ['elemsCount',] }]
};
if (false) {
    /** @type {?} */
    WarpViewDatagridComponent.prototype.elemsCount;
    /** @type {?} */
    WarpViewDatagridComponent.prototype._tabularData;
    /** @type {?} */
    WarpViewDatagridComponent.prototype.el;
    /** @type {?} */
    WarpViewDatagridComponent.prototype.renderer;
    /** @type {?} */
    WarpViewDatagridComponent.prototype.sizeService;
    /** @type {?} */
    WarpViewDatagridComponent.prototype.ngZone;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class WarpViewPaginableComponent {
    constructor() {
        this.elemsCount = 15;
        this.windowed = 5;
        this.page = 0;
        this.pages = [];
        this.displayedValues = [];
        // tslint:disable-next-line:variable-name
        this._debug = false;
        // tslint:disable-next-line:variable-name
        this._options = Object.assign({}, new Param(), {
            timeMode: 'date',
            timeZone: 'UTC',
            timeUnit: 'us',
            bounds: {}
        });
        this.LOG = new Logger(WarpViewPaginableComponent, this.debug);
    }
    /**
     * @param {?} debug
     * @return {?}
     */
    set debug(debug) {
        this._debug = debug;
        this.LOG.setDebug(debug);
    }
    /**
     * @return {?}
     */
    get debug() {
        return this._debug;
    }
    /**
     * @param {?} options
     * @return {?}
     */
    set options(options) {
        if (!deepEqual(options, this._options)) {
            this.drawGridData();
        }
    }
    /**
     * @param {?} data
     * @return {?}
     */
    set data(data) {
        if (data) {
            this._data = data;
            this.drawGridData();
        }
    }
    /**
     * @param {?} page
     * @return {?}
     */
    goto(page) {
        this.page = page;
        this.drawGridData();
    }
    /**
     * @return {?}
     */
    next() {
        this.page = Math.min(this.page + 1, this._data.values.length - 1);
        this.drawGridData();
    }
    /**
     * @return {?}
     */
    prev() {
        this.page = Math.max(this.page - 1, 0);
        this.drawGridData();
    }
    /**
     * @private
     * @return {?}
     */
    drawGridData() {
        this._options = (/** @type {?} */ (ChartLib.mergeDeep(this._options, this.options)));
        this.LOG.debug(['drawGridData', '_options'], this._options);
        if (!this._data) {
            return;
        }
        this.pages = [];
        for (let i = 0; i < (this._data.values || []).length / this.elemsCount; i++) {
            this.pages.push(i);
        }
        this.displayedValues = (this._data.values || []).slice(Math.max(0, this.elemsCount * this.page), Math.min(this.elemsCount * (this.page + 1), (this._data.values || []).length));
        this.LOG.debug(['drawGridData', '_data'], this._data);
    }
    /**
     * @param {?} str
     * @return {?}
     */
    decodeURIComponent(str) {
        return decodeURIComponent(str);
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.drawGridData();
    }
    /**
     * @param {?} name
     * @return {?}
     */
    formatLabel(name) {
        return GTSLib.formatLabel(name);
    }
}
WarpViewPaginableComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-paginable',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div>\n  <div class=\"heading\" [innerHTML]=\"formatLabel(_data.name)\"></div>\n  <table>\n    <thead>\n    <th *ngFor=\"let h of _data.headers\">{{h}}</th>\n    </thead>\n    <tbody>\n    <tr *ngFor=\"let value of displayedValues; even as isEven; odd as isOdd\" [ngClass]=\"{ odd: isOdd, even: isEven}\">\n      <td *ngFor=\"let v of value\">\n        <span [innerHTML]=\"v\"></span>\n      </td>\n    </tr>\n    </tbody>\n  </table>\n  <div class=\"center\">\n    <div class=\"pagination\">\n      <div class=\"prev hoverable\" (click)=\"prev()\" *ngIf=\"page !== 0\">&lt;</div>\n      <div class=\"index disabled\" *ngIf=\"page - windowed > 0\">...</div>\n      <span *ngFor=\"let c of pages\">\n        <span *ngIf=\" c >= page - windowed && c <= page + windowed\"\n             [ngClass]=\"{ index: true, hoverable: page !== c, active: page === c}\" (click)=\"goto(c)\">{{c}}</span>\n      </span>\n      <div class=\"index disabled\" *ngIf=\"page + windowed < pages.length\">...</div>\n      <div class=\"next hoverable\" (click)=\"next()\" *ngIf=\"page + windowed < (_data.values ||\u00A0[]).length - 1\">&gt;</div>\n    </div>\n  </div>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host table{width:100%;color:var(--warp-view-font-color)}:host table td,:host table th{padding:var(--warp-view-datagrid-cell-padding)}:host table .odd{background-color:var(--warp-view-datagrid-odd-bg-color);color:var(--warp-view-datagrid-odd-color)}:host table .even{background-color:var(--warp-view-datagrid-even-bg-color);color:var(--warp-view-datagrid-even-color)}:host .center{text-align:center}:host .center .pagination{display:inline-block}:host .center .pagination .index,:host .center .pagination .next,:host .center .pagination .prev{color:var(--warp-view-font-color);float:left;padding:8px 16px;text-decoration:none;-webkit-transition:background-color .3s;transition:background-color .3s;border:1px solid var(--warp-view-pagination-border-color);margin:0;cursor:pointer;background-color:var(--warp-view-pagination-bg-color)}:host .center .pagination .index.active,:host .center .pagination .next.active,:host .center .pagination .prev.active{background-color:var(--warp-view-pagination-active-bg-color);color:var(--warp-view-pagination-active-color);border:1px solid var(--warp-view-pagination-active-border-color)}:host .center .pagination .index.hoverable:hover,:host .center .pagination .next.hoverable:hover,:host .center .pagination .prev.hoverable:hover{background-color:var(--warp-view-pagination-hover-bg-color);color:var(--warp-view-pagination-hover-color);border:1px solid var(--warp-view-pagination-hover-border-color)}:host .center .pagination .index.disabled,:host .center .pagination .next.disabled,:host .center .pagination .prev.disabled{cursor:auto;color:var(--warp-view-pagination-disabled-color)}:host .gts-classname{color:var(--gts-classname-font-color,#0074d9)}:host .gts-labelname{color:var(--gts-labelname-font-color,#19a979)}:host .gts-attrname{color:var(--gts-labelname-font-color,#ed4a7b)}:host .gts-separator{color:var(--gts-separator-font-color,#bbb)}:host .gts-labelvalue{color:var(--gts-labelvalue-font-color,#aaa);font-style:italic}:host .gts-attrvalue{color:var(--gts-labelvalue-font-color,#aaa);font-style:italic}:host .round{border-radius:50%;background-color:#bbb;display:inline-block;width:12px;height:12px;border:2px solid #454545}:host ul{list-style:none}"]
            }] }
];
/** @nocollapse */
WarpViewPaginableComponent.ctorParameters = () => [];
WarpViewPaginableComponent.propDecorators = {
    debug: [{ type: Input, args: ['debug',] }],
    options: [{ type: Input, args: ['options',] }],
    data: [{ type: Input, args: ['data',] }],
    elemsCount: [{ type: Input, args: ['elemsCount',] }],
    windowed: [{ type: Input, args: ['windowed',] }]
};
if (false) {
    /** @type {?} */
    WarpViewPaginableComponent.prototype.elemsCount;
    /** @type {?} */
    WarpViewPaginableComponent.prototype.windowed;
    /** @type {?} */
    WarpViewPaginableComponent.prototype.page;
    /** @type {?} */
    WarpViewPaginableComponent.prototype.pages;
    /** @type {?} */
    WarpViewPaginableComponent.prototype._data;
    /** @type {?} */
    WarpViewPaginableComponent.prototype.displayedValues;
    /**
     * @type {?}
     * @private
     */
    WarpViewPaginableComponent.prototype.LOG;
    /**
     * @type {?}
     * @private
     */
    WarpViewPaginableComponent.prototype._debug;
    /**
     * @type {?}
     * @private
     */
    WarpViewPaginableComponent.prototype._options;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *
 */
class WarpViewDisplayComponent extends WarpViewComponent {
    /**
     * @param {?} el
     * @param {?} renderer
     * @param {?} sizeService
     * @param {?} ngZone
     */
    constructor(el, renderer, sizeService, ngZone) {
        super(el, renderer, sizeService, ngZone);
        this.el = el;
        this.renderer = renderer;
        this.sizeService = sizeService;
        this.ngZone = ngZone;
        this.toDisplay = '';
        this.defOptions = (/** @type {?} */ ({
            timeMode: 'custom'
        }));
        this.LOG = new Logger(WarpViewDisplayComponent, this._debug);
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.drawChart();
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
    /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    update(options, refresh) {
        this.drawChart();
        this.flexFont();
    }
    /**
     * @private
     * @return {?}
     */
    drawChart() {
        this.LOG.debug(['drawChart'], this._options, this.defOptions);
        this.initChart(this.el);
        this._options = ChartLib.mergeDeep(this.defOptions, this._options);
        this.LOG.debug(['drawChart', 'afterInit'], this._options, this.defOptions, this.height);
        this.LOG.debug(['drawChart'], this._data, this.toDisplay);
        this.flexFont();
        this.chartDraw.emit();
    }
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    convert(data) {
        this._options = ChartLib.mergeDeep(this.defOptions, this._options);
        this.LOG.debug(['convert'], this._options.timeMode);
        /** @type {?} */
        let display;
        if (this._data.data) {
            display = GTSLib.isArray(this._data.data) ? this._data.data[0] : this._data.data;
        }
        else {
            display = GTSLib.isArray(this._data) ? this._data[0] : this._data;
        }
        switch (this._options.timeMode) {
            case 'date':
                this.toDisplay = moment__default.tz(parseInt(display, 10) / this.divider, this._options.timeZone).toISOString(true);
                break;
            case 'duration':
                /** @type {?} */
                const start = moment__default.tz(parseInt(display, 10) / this.divider, this._options.timeZone);
                this.displayDuration(start);
                break;
            case 'custom':
            case 'timestamp':
                this.toDisplay = display;
        }
        return [];
    }
    /**
     * @return {?}
     */
    getStyle() {
        if (!this._options) {
            return {};
        }
        else {
            /** @type {?} */
            const style = { 'background-color': this._options.bgColor || 'transparent' };
            if (this._options.fontColor) {
                style.color = this._options.fontColor;
            }
            return style;
        }
    }
    /**
     * @return {?}
     */
    flexFont() {
        if (!!this.wrapper) {
            this.LOG.debug(['flexFont'], this.height);
            if (this.fitties) {
                this.fitties.unsubscribe();
            }
            this.fitties = fitty(this.wrapper.nativeElement, {
                maxSize: ((/** @type {?} */ (this.el.nativeElement))).parentElement.clientHeight * 0.80,
                minSize: 14
            });
            this.LOG.debug(['flexFont'], 'ok', ((/** @type {?} */ (this.el.nativeElement))).parentElement.clientHeight);
            this.fitties.fit();
            this.loading = false;
        }
    }
    /**
     * @private
     * @param {?} start
     * @return {?}
     */
    displayDuration(start) {
        this.timer = setInterval((/**
         * @return {?}
         */
        () => {
            /** @type {?} */
            const now = moment__default();
            this.toDisplay = moment__default.duration(start.diff(now)).humanize(true);
        }), 1000);
    }
}
WarpViewDisplayComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-display',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"chart-container\" (resized)=\"flexFont()\" [ngStyle]=\"getStyle()\">\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <div class=\"value\" #wrapper [hidden]=\"loading\">\n    <span [innerHTML]=\"toDisplay\"></span><small>{{unit}}</small>\n  </div>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host{width:var(--warp-view-chart-width,100%);height:var(--warp-view-chart-height,100%);color:var(--warp-view-font-color);position:relative;overflow:hidden}:host .chart-container{text-align:center;height:calc(100% - 20px);width:100%;justify-items:stretch;min-height:100%;-webkit-box-pack:center;justify-content:center;display:-webkit-box;display:flex;overflow:hidden}:host .chart-container .value{padding:10px;text-align:center;white-space:nowrap;overflow:hidden;display:inline-block;vertical-align:middle;-ms-grid-row-align:center;align-self:center}:host .chart-container .value span{min-height:100%}:host .chart-container .value small{font-size:.5em}"]
            }] }
];
/** @nocollapse */
WarpViewDisplayComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: SizeService },
    { type: NgZone }
];
WarpViewDisplayComponent.propDecorators = {
    wrapper: [{ type: ViewChild, args: ['wrapper', { static: true },] }]
};
if (false) {
    /** @type {?} */
    WarpViewDisplayComponent.prototype.wrapper;
    /** @type {?} */
    WarpViewDisplayComponent.prototype.toDisplay;
    /** @type {?} */
    WarpViewDisplayComponent.prototype.defOptions;
    /**
     * @type {?}
     * @private
     */
    WarpViewDisplayComponent.prototype.fitties;
    /**
     * @type {?}
     * @private
     */
    WarpViewDisplayComponent.prototype.timer;
    /** @type {?} */
    WarpViewDisplayComponent.prototype.el;
    /** @type {?} */
    WarpViewDisplayComponent.prototype.renderer;
    /** @type {?} */
    WarpViewDisplayComponent.prototype.sizeService;
    /** @type {?} */
    WarpViewDisplayComponent.prototype.ngZone;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *
 */
class WarpViewDrillDownComponent extends WarpViewComponent {
    /**
     * @param {?} el
     * @param {?} renderer
     * @param {?} sizeService
     * @param {?} ngZone
     */
    constructor(el, renderer, sizeService, ngZone) {
        super(el, renderer, sizeService, ngZone);
        this.el = el;
        this.renderer = renderer;
        this.sizeService = sizeService;
        this.ngZone = ngZone;
        this.parentWidth = -1;
        this.LOG = new Logger(WarpViewDrillDownComponent, this._debug);
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.drawChart();
    }
    /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    update(options, refresh) {
        this.drawChart();
    }
    /**
     * @return {?}
     */
    onResize() {
        if (this.el.nativeElement.parentElement.clientWidth !== this.parentWidth || this.parentWidth <= 0) {
            this.parentWidth = this.el.nativeElement.parentElement.clientWidth;
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout((/**
             * @return {?}
             */
            () => {
                if (this.el.nativeElement.parentElement.clientWidth > 0) {
                    this.LOG.debug(['onResize'], this.el.nativeElement.parentElement.clientWidth);
                    this.drawChart();
                }
                else {
                    this.onResize();
                }
            }), 150);
        }
    }
    /**
     * @private
     * @return {?}
     */
    drawChart() {
        this.loading = false;
        this.chartDraw.emit();
        if (!this.initChart(this.el)) {
            return;
        }
    }
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    convert(data) {
        /** @type {?} */
        const dataList = (/** @type {?} */ (this._data.data));
        this.heatMapData = this.parseData(GTSLib.flatDeep(dataList));
        return [];
    }
    /**
     * @private
     * @param {?} dataList
     * @return {?}
     */
    parseData(dataList) {
        /** @type {?} */
        const details = [];
        /** @type {?} */
        const values = [];
        /** @type {?} */
        const dates = [];
        /** @type {?} */
        const data = {};
        /** @type {?} */
        const reducer = (/**
         * @param {?} accumulator
         * @param {?} currentValue
         * @return {?}
         */
        (accumulator, currentValue) => accumulator + parseInt(currentValue, 10));
        this.LOG.debug(['parseData'], dataList);
        dataList.forEach((/**
         * @param {?} gts
         * @param {?} i
         * @return {?}
         */
        (gts, i) => {
            /** @type {?} */
            const name = GTSLib.serializeGtsMetadata(gts);
            gts.v.forEach((/**
             * @param {?} v
             * @return {?}
             */
            v => {
                /** @type {?} */
                const refDate = moment.utc(v[0] / 1000).startOf('day').toISOString();
                if (!data[refDate]) {
                    data[refDate] = [];
                }
                if (!values[refDate]) {
                    values[refDate] = [];
                }
                dates.push(v[0] / 1000);
                values[refDate].push(v[v.length - 1]);
                data[refDate].push({
                    name,
                    date: v[0] / 1000,
                    value: v[v.length - 1],
                    color: ColorLib.getColor(i, this._options.scheme),
                    id: i
                });
            }));
        }));
        Object.keys(data).forEach((/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            details.push({
                date: moment.utc(d),
                total: values[d].reduce(reducer),
                details: data[d],
                summary: []
            });
        }));
        return details;
    }
}
WarpViewDrillDownComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-drill-down',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"wrapper\">\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div *ngIf=\"!loading && !noData\">\n    <calendar-heatmap [data]=\"heatMapData\" overview=\"global\"\n                      [debug]=\"debug\"\n                      [minColor]=\"_options.minColor\"\n                      [maxColor]=\"_options.maxColor\"></calendar-heatmap>\n  </div>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host .wrapper{position:relative;width:100%;height:100%}"]
            }] }
];
/** @nocollapse */
WarpViewDrillDownComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: SizeService },
    { type: NgZone }
];
WarpViewDrillDownComponent.propDecorators = {
    onResize: [{ type: HostListener, args: ['window:resize',] }]
};
if (false) {
    /** @type {?} */
    WarpViewDrillDownComponent.prototype.heatMapData;
    /**
     * @type {?}
     * @private
     */
    WarpViewDrillDownComponent.prototype.parentWidth;
    /**
     * @type {?}
     * @private
     */
    WarpViewDrillDownComponent.prototype.resizeTimer;
    /** @type {?} */
    WarpViewDrillDownComponent.prototype.el;
    /** @type {?} */
    WarpViewDrillDownComponent.prototype.renderer;
    /** @type {?} */
    WarpViewDrillDownComponent.prototype.sizeService;
    /** @type {?} */
    WarpViewDrillDownComponent.prototype.ngZone;
}

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
/**
 *
 */
class Datum {
}
if (false) {
    /** @type {?} */
    Datum.prototype.date;
    /** @type {?} */
    Datum.prototype.summary;
    /** @type {?} */
    Datum.prototype.total;
    /** @type {?} */
    Datum.prototype.details;
}
/**
 *
 */
class Summary {
}
if (false) {
    /** @type {?} */
    Summary.prototype.color;
    /** @type {?} */
    Summary.prototype.id;
    /** @type {?} */
    Summary.prototype.name;
    /** @type {?} */
    Summary.prototype.total;
    /** @type {?} */
    Summary.prototype.date;
}
/**
 *
 */
class Detail {
}
if (false) {
    /** @type {?} */
    Detail.prototype.color;
    /** @type {?} */
    Detail.prototype.date;
    /** @type {?} */
    Detail.prototype.id;
    /** @type {?} */
    Detail.prototype.name;
    /** @type {?} */
    Detail.prototype.value;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class CalendarHeatmapComponent {
    /**
     * @param {?} el
     */
    constructor(el) {
        this.el = el;
        this.width = ChartLib.DEFAULT_WIDTH;
        this.height = ChartLib.DEFAULT_HEIGHT;
        this.overview = 'global';
        this.handler = new EventEmitter();
        this.change = new EventEmitter();
        // tslint:disable-next-line:variable-name
        this._debug = false;
        // tslint:disable-next-line:variable-name
        this._minColor = CalendarHeatmapComponent.DEF_MIN_COLOR;
        // tslint:disable-next-line:variable-name
        this._maxColor = CalendarHeatmapComponent.DEF_MAX_COLOR;
        // Defaults
        this.gutter = 5;
        this.gWidth = 1000;
        this.gHeight = 200;
        this.itemSize = 10;
        this.labelPadding = 40;
        this.transitionDuration = 250;
        this.inTransition = false;
        // Tooltip defaults
        this.tooltipWidth = 450;
        this.tooltipPadding = 15;
        // Overview defaults
        this.history = ['global'];
        this.selected = new Datum();
        this.parentWidth = -1;
        this.getTooltip = (/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            /** @type {?} */
            let tooltipHtml = '<div class="header"><strong>' + d.date.format('dddd, MMM Do YYYY HH:mm') + '</strong></div><ul>';
            (d.summary || []).forEach((/**
             * @param {?} s
             * @return {?}
             */
            s => {
                tooltipHtml += `<li>
  <div class="round" style="background-color:${ColorLib.transparentize(s.color)}; border-color:${s.color}"></div>
${GTSLib.formatLabel(s.name)}: ${s.total}</li>`;
            }));
            if (d.total !== undefined && d.name) {
                tooltipHtml += `<li><div class="round"
style="background-color: ${ColorLib.transparentize(d.color)}; border-color: ${d.color}"
></div> ${GTSLib.formatLabel(d.name)}: ${d.total}</li>`;
            }
            tooltipHtml += '</ul>';
            return tooltipHtml;
        });
        this.LOG = new Logger(CalendarHeatmapComponent, this.debug);
    }
    /**
     * @param {?} debug
     * @return {?}
     */
    set debug(debug) {
        this._debug = debug;
        this.LOG.setDebug(debug);
    }
    /**
     * @return {?}
     */
    get debug() {
        return this._debug;
    }
    /**
     * @param {?} data
     * @return {?}
     */
    set data(data) {
        this.LOG.debug(['data'], data);
        if (data) {
            this._data = data;
            this.calculateDimensions();
        }
    }
    /**
     * @return {?}
     */
    get data() {
        return this._data;
    }
    /**
     * @param {?} minColor
     * @return {?}
     */
    set minColor(minColor) {
        this._minColor = minColor;
        this.calculateDimensions();
    }
    /**
     * @return {?}
     */
    get minColor() {
        return this._minColor;
    }
    /**
     * @param {?} maxColor
     * @return {?}
     */
    set maxColor(maxColor) {
        this._maxColor = maxColor;
        this.calculateDimensions();
    }
    /**
     * @return {?}
     */
    get maxColor() {
        return this._maxColor;
    }
    /**
     * @return {?}
     */
    static getNumberOfWeeks() {
        /** @type {?} */
        const dayIndex = Math.round((+moment.utc() - +moment.utc().subtract(1, 'year').startOf('week')) / 86400000);
        return Math.trunc(dayIndex / 7) + 1;
    }
    /**
     * @return {?}
     */
    onResize() {
        if (this.el.nativeElement.parentElement.clientWidth !== this.parentWidth) {
            this.calculateDimensions();
        }
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.chart = (/** @type {?} */ (this.div.nativeElement));
        // Initialize svg element
        this.svg = select(this.chart).append('svg').attr('class', 'svg');
        // Initialize main svg elements
        this.items = this.svg.append('g');
        this.labels = this.svg.append('g');
        this.buttons = this.svg.append('g');
        // Add tooltip to the same element as main svg
        this.tooltip = select(this.chart)
            .append('div')
            .attr('class', 'heatmap-tooltip')
            .style('opacity', 0);
        // Calculate chart dimensions
        this.calculateDimensions();
        //  this.drawChart();
    }
    /**
     * @return {?}
     */
    calculateDimensions() {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout((/**
         * @return {?}
         */
        () => {
            if (this.el.nativeElement.parentElement.clientWidth !== 0) {
                this.gWidth = this.chart.clientWidth < 1000 ? 1000 : this.chart.clientWidth;
                this.itemSize = ((this.gWidth - this.labelPadding) / CalendarHeatmapComponent.getNumberOfWeeks() - this.gutter);
                this.gHeight = this.labelPadding + 7 * (this.itemSize + this.gutter);
                this.svg.attr('width', this.gWidth).attr('height', this.gHeight);
                this.LOG.debug(['calculateDimensions'], this._data);
                if (!!this._data && !!this._data[0] && !!this._data[0].summary) {
                    this.drawChart();
                }
            }
            else {
                this.calculateDimensions();
            }
        }), 250);
    }
    /**
     * @private
     * @param {?} xs
     * @param {?} key
     * @return {?}
     */
    groupBy(xs, key) {
        return xs.reduce((/**
         * @param {?} rv
         * @param {?} x
         * @return {?}
         */
        (rv, x) => {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }), {});
    }
    /**
     * @return {?}
     */
    updateDataSummary() {
        // Get daily summary if that was not provided
        if (!this._data[0].summary) {
            this._data.map((/**
             * @param {?} d
             * @return {?}
             */
            (d) => {
                /** @type {?} */
                const summary = d.details.reduce((/**
                 * @param {?} uniques
                 * @param {?} project
                 * @return {?}
                 */
                (uniques, project) => {
                    if (!uniques[project.name]) {
                        uniques[project.name] = { value: project.value };
                    }
                    else {
                        uniques[project.name].value += project.value;
                    }
                    return uniques;
                }), {});
                /** @type {?} */
                const unsortedSummary = Object.keys(summary).map((/**
                 * @param {?} key
                 * @return {?}
                 */
                (key) => {
                    return {
                        name: key,
                        total: summary[key].value
                    };
                }));
                d.summary = unsortedSummary.sort((/**
                 * @param {?} a
                 * @param {?} b
                 * @return {?}
                 */
                (a, b) => {
                    return b.total - a.total;
                }));
                return d;
            }));
        }
    }
    /**
     * @return {?}
     */
    drawChart() {
        if (!this.svg || !this._data) {
            return;
        }
        this.LOG.debug(['drawChart'], [this.overview, this.selected]);
        switch (this.overview) {
            case 'global':
                this.drawGlobalOverview();
                this.change.emit({
                    overview: this.overview,
                    start: moment(this._data[0].date),
                    end: moment(this._data[this._data.length - 1].date),
                });
                break;
            case 'year':
                this.drawYearOverview();
                this.change.emit({
                    overview: this.overview,
                    start: moment(this.selected.date).startOf('year'),
                    end: moment(this.selected.date).endOf('year'),
                });
                break;
            case 'month':
                this.drawMonthOverview();
                this.change.emit({
                    overview: this.overview,
                    start: moment(this.selected.date).startOf('month'),
                    end: moment(this.selected.date).endOf('month'),
                });
                break;
            case 'week':
                this.drawWeekOverview();
                this.change.emit({
                    overview: this.overview,
                    start: moment(this.selected.date).startOf('week'),
                    end: moment(this.selected.date).endOf('week'),
                });
                break;
            case 'day':
                this.drawDayOverview();
                this.change.emit({
                    overview: this.overview,
                    start: moment(this.selected.date).startOf('day'),
                    end: moment(this.selected.date).endOf('day'),
                });
                break;
            default:
                break;
        }
    }
    /**
     * @return {?}
     */
    drawGlobalOverview() {
        // Add current overview to the history
        if (this.history[this.history.length - 1] !== this.overview) {
            this.history.push(this.overview);
        }
        // Define start and end of the dataset
        /** @type {?} */
        const startPeriod = moment.utc(this._data[0].date.startOf('y'));
        /** @type {?} */
        const endPeriod = moment.utc(this._data[this._data.length - 1].date.endOf('y'));
        // Define array of years and total values
        /** @type {?} */
        const yData = this._data.filter((/**
         * @param {?} d
         * @return {?}
         */
        (d) => d.date.isBetween(startPeriod, endPeriod, null, '[]')));
        yData.forEach((/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            /** @type {?} */
            const summary = [];
            /** @type {?} */
            const group = this.groupBy(d.details, 'name');
            Object.keys(group).forEach((/**
             * @param {?} k
             * @return {?}
             */
            k => {
                summary.push({
                    name: k,
                    total: group[k].reduce((/**
                     * @param {?} acc
                     * @param {?} o
                     * @return {?}
                     */
                    (acc, o) => {
                        return acc + o.value;
                    }), 0),
                    color: group[k][0].color,
                    id: group[k][0].id,
                });
            }));
            d.summary = summary;
        }));
        /** @type {?} */
        const duration = Math.ceil(moment.duration(endPeriod.diff(startPeriod)).asYears());
        /** @type {?} */
        const scale = [];
        for (let i = 0; i < duration; i++) {
            /** @type {?} */
            const d = moment.utc().year(startPeriod.year() + i).month(0).date(1).startOf('y');
            scale.push(d);
        }
        /** @type {?} */
        let yearData = yData.map((/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            /** @type {?} */
            const date = d.date;
            return {
                date,
                total: yData.reduce((/**
                 * @param {?} prev
                 * @param {?} current
                 * @return {?}
                 */
                (prev, current) => {
                    if (((/** @type {?} */ (current.date))).year() === date.year()) {
                        prev += current.total;
                    }
                    return prev;
                }), 0),
                summary: ((/**
                 * @return {?}
                 */
                () => {
                    /** @type {?} */
                    const summary = yData.reduce((/**
                     * @param {?} s
                     * @param {?} data
                     * @return {?}
                     */
                    (s, data) => {
                        if (((/** @type {?} */ (data.date))).year() === date.year()) {
                            data.summary.forEach((/**
                             * @param {?} _summary
                             * @return {?}
                             */
                            _summary => {
                                if (!s[_summary.name]) {
                                    s[_summary.name] = {
                                        total: _summary.total,
                                        color: _summary.color,
                                    };
                                }
                                else {
                                    s[_summary.name].total += _summary.total;
                                }
                            }));
                        }
                        return s;
                    }), {});
                    /** @type {?} */
                    const unsortedSummary = Object.keys(summary).map((/**
                     * @param {?} key
                     * @return {?}
                     */
                    (key) => {
                        return {
                            name: key,
                            total: summary[key].total,
                            color: summary[key].color,
                        };
                    }));
                    return unsortedSummary.sort((/**
                     * @param {?} a
                     * @param {?} b
                     * @return {?}
                     */
                    (a, b) => b.total - a.total));
                }))(),
            };
        }));
        // Calculate max value of all the years in the dataset
        yearData = GTSLib.cleanArray(yearData);
        /** @type {?} */
        const maxValue = max(yearData, (/**
         * @param {?} d
         * @return {?}
         */
        (d) => d.total));
        // Define year labels and axis
        /** @type {?} */
        const yearLabels = scale.map((/**
         * @param {?} d
         * @return {?}
         */
        (d) => d));
        /** @type {?} */
        const yearScale = scaleBand()
            .rangeRound([0, this.gWidth])
            .padding(0.05)
            .domain(yearLabels.map((/**
         * @param {?} d
         * @return {?}
         */
        (d) => d.year().toString())));
        /** @type {?} */
        const color = scaleLinear()
            .range([this.minColor || CalendarHeatmapComponent.DEF_MIN_COLOR, this.maxColor || CalendarHeatmapComponent.DEF_MAX_COLOR])
            .domain([-0.15 * maxValue, maxValue]);
        // Add global data items to the overview
        this.items.selectAll('.item-block-year').remove();
        this.items.selectAll('.item-block-year')
            .data(yearData)
            .enter()
            .append('rect')
            .attr('class', 'item item-block-year')
            .attr('width', (/**
         * @return {?}
         */
        () => (this.gWidth - this.labelPadding) / yearLabels.length - this.gutter * 5))
            .attr('height', (/**
         * @return {?}
         */
        () => this.gHeight - this.labelPadding))
            .attr('transform', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => 'translate(' + yearScale(((/** @type {?} */ (d.date))).year().toString()) + ',' + this.tooltipPadding * 2 + ')'))
            .attr('fill', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => color(d.total) || CalendarHeatmapComponent.DEF_MAX_COLOR))
            .on('click', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            if (this.inTransition) {
                return;
            }
            // Set in_transition flag
            this.inTransition = true;
            // Set selected date to the one clicked on
            this.selected = d;
            // Hide tooltip
            this.hideTooltip();
            // Remove all global overview related items and labels
            this.removeGlobalOverview();
            // Redraw the chart
            this.overview = 'year';
            this.drawChart();
        }))
            .style('opacity', 0)
            .on('mouseover', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            if (this.inTransition) {
                return;
            }
            // Calculate tooltip position
            /** @type {?} */
            let x = yearScale(d.date.year().toString()) + this.tooltipPadding * 2;
            while (this.gWidth - x < (this.tooltipWidth + this.tooltipPadding * 5)) {
                x -= 10;
            }
            /** @type {?} */
            const y = this.tooltipPadding * 4;
            // Show tooltip
            this.tooltip.html(this.getTooltip(d))
                .style('left', x + 'px')
                .style('top', y + 'px')
                .transition()
                .duration(this.transitionDuration / 2)
                .ease(easeLinear)
                .style('opacity', 1);
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        () => {
            if (this.inTransition) {
                return;
            }
            this.hideTooltip();
        }))
            .transition()
            .delay((/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        (d, i) => this.transitionDuration * (i + 1) / 10))
            .duration((/**
         * @return {?}
         */
        () => this.transitionDuration))
            .ease(easeLinear)
            .style('opacity', 1)
            .call((/**
         * @param {?} transition
         * @param {?} callback
         * @return {?}
         */
        (transition, callback) => {
            if (transition.empty()) {
                callback();
            }
            /** @type {?} */
            let n = 0;
            transition.each((/**
             * @return {?}
             */
            () => ++n)).on('end', (/**
             * @return {?}
             */
            function () {
                if (!--n) {
                    callback.apply(this, arguments);
                }
            }));
        }), (/**
         * @return {?}
         */
        () => this.inTransition = false));
        // Add year labels
        this.labels.selectAll('.label-year').remove();
        this.labels.selectAll('.label-year')
            .data(yearLabels)
            .enter()
            .append('text')
            .attr('class', 'label label-year')
            .attr('font-size', (/**
         * @return {?}
         */
        () => Math.floor(this.labelPadding / 3) + 'px'))
            .text((/**
         * @param {?} d
         * @return {?}
         */
        (d) => d.year()))
            .attr('x', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => yearScale(d.year().toString())))
            .attr('y', this.labelPadding / 2)
            .on('mouseenter', (/**
         * @param {?} yearLabel
         * @return {?}
         */
        (yearLabel) => {
            if (this.inTransition) {
                return;
            }
            this.items.selectAll('.item-block-year')
                .transition()
                .duration(this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', (/**
             * @param {?} d
             * @return {?}
             */
            (d) => (d.date.year() === yearLabel.year()) ? 1 : 0.1));
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        () => {
            if (this.inTransition) {
                return;
            }
            this.items.selectAll('.item-block-year')
                .transition()
                .duration(this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', 1);
        }))
            .on('click', (/**
         * @return {?}
         */
        () => {
            if (this.inTransition) {
                return;
            }
            // Set in_transition flag
            this.inTransition = true;
            // Set selected year to the one clicked on
            this.selected = yearData[0];
            // Hide tooltip
            this.hideTooltip();
            // Remove all global overview related items and labels
            this.removeGlobalOverview();
            // Redraw the chart
            this.overview = 'year';
            this.drawChart();
        }));
    }
    /**
     * Draw year overview
     * @return {?}
     */
    drawYearOverview() {
        // Add current overview to the history
        if (this.history[this.history.length - 1] !== this.overview) {
            this.history.push(this.overview);
        }
        // Define start and end date of the selected year
        /** @type {?} */
        const startOfYear = moment(this.selected.date).startOf('year');
        /** @type {?} */
        const endOfYear = moment(this.selected.date).endOf('year');
        // Filter data down to the selected year
        /** @type {?} */
        let yearData = this._data.filter((/**
         * @param {?} d
         * @return {?}
         */
        (d) => d.date.isBetween(startOfYear, endOfYear, null, '[]')));
        yearData.forEach((/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            /** @type {?} */
            const summary = [];
            /** @type {?} */
            const group = this.groupBy(d.details, 'name');
            Object.keys(group).forEach((/**
             * @param {?} k
             * @return {?}
             */
            k => {
                summary.push({
                    name: k,
                    total: group[k].reduce((/**
                     * @param {?} acc
                     * @param {?} o
                     * @return {?}
                     */
                    (acc, o) => {
                        return acc + o.value;
                    }), 0),
                    color: group[k][0].color,
                    id: group[k][0].id,
                });
            }));
            d.summary = summary;
        }));
        yearData = GTSLib.cleanArray(yearData);
        // Calculate max value of the year data
        /** @type {?} */
        const maxValue = max(yearData, (/**
         * @param {?} d
         * @return {?}
         */
        (d) => d.total));
        /** @type {?} */
        const color = scaleLinear()
            .range([this.minColor || CalendarHeatmapComponent.DEF_MIN_COLOR, this.maxColor || CalendarHeatmapComponent.DEF_MAX_COLOR])
            .domain([-0.15 * maxValue, maxValue]);
        this.items.selectAll('.item-circle').remove();
        this.items.selectAll('.item-circle')
            .data(yearData)
            .enter()
            .append('rect')
            .attr('class', 'item item-circle').style('opacity', 0)
            .attr('x', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => this.calcItemX(d, startOfYear) + (this.itemSize - this.calcItemSize(d, maxValue)) / 2))
            .attr('y', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => this.calcItemY(d) + (this.itemSize - this.calcItemSize(d, maxValue)) / 2))
            .attr('rx', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => this.calcItemSize(d, maxValue)))
            .attr('ry', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => this.calcItemSize(d, maxValue)))
            .attr('width', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => this.calcItemSize(d, maxValue)))
            .attr('height', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => this.calcItemSize(d, maxValue)))
            .attr('fill', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => (d.total > 0) ? color(d.total) : 'transparent'))
            .on('click', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            if (this.inTransition) {
                return;
            }
            // Don't transition if there is no data to show
            if (d.total === 0) {
                return;
            }
            this.inTransition = true;
            // Set selected date to the one clicked on
            this.selected = d;
            // Hide tooltip
            this.hideTooltip();
            // Remove all year overview related items and labels
            this.removeYearOverview();
            // Redraw the chart
            this.overview = 'day';
            this.drawChart();
        }))
            .on('mouseover', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            if (this.inTransition) {
                return;
            }
            // Pulsating animation
            /** @type {?} */
            const circle = select(event.currentTarget);
            /** @type {?} */
            const repeat = (/**
             * @return {?}
             */
            () => {
                circle.transition()
                    .duration(this.transitionDuration)
                    .ease(easeLinear)
                    .attr('x', (/**
                 * @param {?} data
                 * @return {?}
                 */
                (data) => this.calcItemX(data, startOfYear) - (this.itemSize * 1.1 - this.itemSize) / 2))
                    .attr('y', (/**
                 * @param {?} data
                 * @return {?}
                 */
                (data) => this.calcItemY(data) - (this.itemSize * 1.1 - this.itemSize) / 2))
                    .attr('width', this.itemSize * 1.1)
                    .attr('height', this.itemSize * 1.1)
                    .transition()
                    .duration(this.transitionDuration)
                    .ease(easeLinear)
                    .attr('x', (/**
                 * @param {?} data
                 * @return {?}
                 */
                (data) => this.calcItemX(data, startOfYear) + (this.itemSize - this.calcItemSize(data, maxValue)) / 2))
                    .attr('y', (/**
                 * @param {?} data
                 * @return {?}
                 */
                (data) => this.calcItemY(data) + (this.itemSize - this.calcItemSize(data, maxValue)) / 2))
                    .attr('width', (/**
                 * @param {?} data
                 * @return {?}
                 */
                (data) => this.calcItemSize(data, maxValue)))
                    .attr('height', (/**
                 * @param {?} data
                 * @return {?}
                 */
                (data) => this.calcItemSize(data, maxValue)))
                    .on('end', repeat);
            });
            repeat();
            // Construct tooltip
            // Calculate tooltip position
            /** @type {?} */
            let x = this.calcItemX(d, startOfYear) + this.itemSize / 2;
            if (this.gWidth - x < (this.tooltipWidth + this.tooltipPadding * 3)) {
                x -= this.tooltipWidth + this.tooltipPadding * 2;
            }
            /** @type {?} */
            const y = this.calcItemY(d) + this.itemSize / 2;
            // Show tooltip
            this.tooltip.html(this.getTooltip(d))
                .style('left', x + 'px')
                .style('top', y + 'px')
                .transition()
                .duration(this.transitionDuration / 2)
                .ease(easeLinear)
                .style('opacity', 1);
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        () => {
            if (this.inTransition) {
                return;
            }
            // Set circle radius back to what it's supposed to be
            select(event.currentTarget).transition()
                .duration(this.transitionDuration / 2)
                .ease(easeLinear)
                .attr('x', (/**
             * @param {?} d
             * @return {?}
             */
            (d) => this.calcItemX(d, startOfYear) + (this.itemSize - this.calcItemSize(d, maxValue)) / 2))
                .attr('y', (/**
             * @param {?} d
             * @return {?}
             */
            (d) => this.calcItemY(d) + (this.itemSize - this.calcItemSize(d, maxValue)) / 2))
                .attr('width', (/**
             * @param {?} d
             * @return {?}
             */
            (d) => this.calcItemSize(d, maxValue)))
                .attr('height', (/**
             * @param {?} d
             * @return {?}
             */
            (d) => this.calcItemSize(d, maxValue)));
            // Hide tooltip
            this.hideTooltip();
        }))
            .transition()
            .delay((/**
         * @return {?}
         */
        () => (Math.cos(Math.PI * Math.random()) + 1) * this.transitionDuration))
            .duration((/**
         * @return {?}
         */
        () => this.transitionDuration))
            .ease(easeLinear)
            .style('opacity', 1)
            .call((/**
         * @param {?} transition
         * @param {?} callback
         * @return {?}
         */
        (transition, callback) => {
            if (transition.empty()) {
                callback();
            }
            /** @type {?} */
            let n = 0;
            transition.each((/**
             * @return {?}
             */
            () => ++n)).on('end', (/**
             * @return {?}
             */
            function () {
                if (!--n) {
                    callback.apply(this, arguments);
                }
            }));
        }), (/**
         * @return {?}
         */
        () => this.inTransition = false));
        // Add month labels
        /** @type {?} */
        const duration = Math.ceil(moment.duration(endOfYear.diff(startOfYear)).asMonths());
        /** @type {?} */
        const monthLabels = [];
        for (let i = 1; i < duration; i++) {
            monthLabels.push(moment(this.selected.date).month((startOfYear.month() + i) % 12).startOf('month'));
        }
        /** @type {?} */
        const monthScale = scaleLinear().range([0, this.gWidth]).domain([0, monthLabels.length]);
        this.labels.selectAll('.label-month').remove();
        this.labels.selectAll('.label-month')
            .data(monthLabels)
            .enter()
            .append('text')
            .attr('class', 'label label-month')
            .attr('font-size', (/**
         * @return {?}
         */
        () => Math.floor(this.labelPadding / 3) + 'px'))
            .text((/**
         * @param {?} d
         * @return {?}
         */
        (d) => d.format('MMM')))
            .attr('x', (/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        (d, i) => monthScale(i) + (monthScale(i) - monthScale(i - 1)) / 2))
            .attr('y', this.labelPadding / 2)
            .on('mouseenter', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            if (this.inTransition) {
                return;
            }
            /** @type {?} */
            const selectedMonth = moment(d);
            this.items.selectAll('.item-circle')
                .transition()
                .duration(this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', (/**
             * @param {?} data
             * @return {?}
             */
            (data) => moment(data.date).isSame(selectedMonth, 'month') ? 1 : 0.1));
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        () => {
            if (this.inTransition) {
                return;
            }
            this.items.selectAll('.item-circle')
                .transition()
                .duration(this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', 1);
        }))
            .on('click', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            if (this.inTransition) {
                return;
            }
            // Check month data
            /** @type {?} */
            const monthData = this._data.filter((/**
             * @param {?} e
             * @return {?}
             */
            (e) => e.date.isBetween(moment(d).startOf('month'), moment(d).endOf('month'), null, '[]')));
            // Don't transition if there is no data to show
            if (!monthData.length) {
                return;
            }
            // Set selected month to the one clicked on
            this.selected = { date: d };
            this.inTransition = true;
            // Hide tooltip
            this.hideTooltip();
            // Remove all year overview related items and labels
            this.removeYearOverview();
            // Redraw the chart
            this.overview = 'month';
            this.drawChart();
        }));
        // Add day labels
        /** @type {?} */
        const dayLabels = timeDays(moment.utc().startOf('week').toDate(), moment.utc().endOf('week').toDate());
        /** @type {?} */
        const dayScale = scaleBand()
            .rangeRound([this.labelPadding, this.gHeight])
            .domain(dayLabels.map((/**
         * @param {?} d
         * @return {?}
         */
        (d) => moment.utc(d).weekday().toString())));
        this.labels.selectAll('.label-day').remove();
        this.labels.selectAll('.label-day')
            .data(dayLabels)
            .enter()
            .append('text')
            .attr('class', 'label label-day')
            .attr('x', this.labelPadding / 3)
            .attr('y', (/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        (d, i) => dayScale(i.toString()) + dayScale.bandwidth() / 1.75))
            .style('text-anchor', 'left')
            .attr('font-size', (/**
         * @return {?}
         */
        () => Math.floor(this.labelPadding / 3) + 'px'))
            .text((/**
         * @param {?} d
         * @return {?}
         */
        (d) => moment.utc(d).format('dddd')[0]))
            .on('mouseenter', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            if (this.inTransition) {
                return;
            }
            /** @type {?} */
            const selectedDay = moment.utc(d);
            this.items.selectAll('.item-circle')
                .transition()
                .duration(this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', (/**
             * @param {?} data
             * @return {?}
             */
            (data) => (moment(data.date).day() === selectedDay.day()) ? 1 : 0.1));
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        () => {
            if (this.inTransition) {
                return;
            }
            this.items.selectAll('.item-circle')
                .transition()
                .duration(this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', 1);
        }));
        // Add button to switch back to previous overview
        this.drawButton();
    }
    /**
     * @return {?}
     */
    drawMonthOverview() {
        // Add current overview to the history
        if (this.history[this.history.length - 1] !== this.overview) {
            this.history.push(this.overview);
        }
        // Define beginning and end of the month
        /** @type {?} */
        const startOfMonth = moment(this.selected.date).startOf('month');
        /** @type {?} */
        const endOfMonth = moment(this.selected.date).endOf('month');
        // Filter data down to the selected month
        /** @type {?} */
        let monthData = [];
        this._data.filter((/**
         * @param {?} data
         * @return {?}
         */
        (data) => data.date.isBetween(startOfMonth, endOfMonth, null, '[]')))
            .map((/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            /** @type {?} */
            const scale = [];
            d.details.forEach((/**
             * @param {?} det
             * @return {?}
             */
            (det) => {
                /** @type {?} */
                const date = moment.utc(det.date);
                /** @type {?} */
                const i = Math.floor(date.hours() / 3);
                if (!scale[i]) {
                    scale[i] = {
                        date: date.startOf('hour'),
                        total: 0,
                        details: [],
                        summary: []
                    };
                }
                scale[i].total += det.value;
                scale[i].details.push(det);
            }));
            scale.forEach((/**
             * @param {?} s
             * @return {?}
             */
            (s) => {
                /** @type {?} */
                const group = this.groupBy(s.details, 'name');
                Object.keys(group).forEach((/**
                 * @param {?} k
                 * @return {?}
                 */
                (k) => {
                    s.summary.push({
                        name: k,
                        total: sum(group[k], (/**
                         * @param {?} data
                         * @return {?}
                         */
                        (data) => data.total)),
                        color: group[k][0].color
                    });
                }));
            }));
            monthData = monthData.concat(scale);
        }));
        monthData = GTSLib.cleanArray(monthData);
        this.LOG.debug(['drawMonthOverview'], [this.overview, this.selected, monthData]);
        /** @type {?} */
        const maxValue = max(monthData, (/**
         * @param {?} d
         * @return {?}
         */
        (d) => d.total));
        // Define day labels and axis
        /** @type {?} */
        const dayLabels = timeDays(moment(this.selected.date).startOf('week').toDate(), moment(this.selected.date).endOf('week').toDate());
        /** @type {?} */
        const dayScale = scaleBand()
            .rangeRound([this.labelPadding, this.gHeight])
            .domain(dayLabels.map((/**
         * @param {?} d
         * @return {?}
         */
        (d) => moment.utc(d).weekday().toString())));
        // Define week labels and axis
        /** @type {?} */
        const weekLabels = [startOfMonth];
        /** @type {?} */
        const incWeek = moment(startOfMonth);
        while (incWeek.week() !== endOfMonth.week()) {
            weekLabels.push(moment(incWeek.add(1, 'week')));
        }
        monthData.forEach((/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            /** @type {?} */
            const summary = [];
            /** @type {?} */
            const group = this.groupBy(d.details, 'name');
            Object.keys(group).forEach((/**
             * @param {?} k
             * @return {?}
             */
            (k) => {
                summary.push({
                    name: k,
                    total: group[k].reduce((/**
                     * @param {?} acc
                     * @param {?} o
                     * @return {?}
                     */
                    (acc, o) => acc + o.value), 0),
                    color: group[k][0].color,
                    id: group[k][0].id,
                });
            }));
            d.summary = summary;
        }));
        /** @type {?} */
        const weekScale = scaleBand()
            .rangeRound([this.labelPadding, this.gWidth])
            .padding(0.05)
            .domain(weekLabels.map((/**
         * @param {?} weekday
         * @return {?}
         */
        (weekday) => weekday.week() + '')));
        /** @type {?} */
        const color = scaleLinear()
            .range([this.minColor || CalendarHeatmapComponent.DEF_MIN_COLOR, this.maxColor || CalendarHeatmapComponent.DEF_MAX_COLOR])
            .domain([-0.15 * maxValue, maxValue]);
        // Add month data items to the overview
        this.items.selectAll('.item-block-month').remove();
        this.items.selectAll('.item-block-month')
            .data(monthData)
            .enter().append('rect')
            .style('opacity', 0)
            .attr('class', 'item item-block-month')
            .attr('y', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => this.calcItemY(d)
            + (this.itemSize - this.calcItemSize(d, maxValue)) / 2))
            .attr('x', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => this.calcItemXMonth(d, startOfMonth, weekScale(d.date.week().toString()))
            + (this.itemSize - this.calcItemSize(d, maxValue)) / 2))
            .attr('rx', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => this.calcItemSize(d, maxValue)))
            .attr('ry', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => this.calcItemSize(d, maxValue)))
            .attr('width', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => this.calcItemSize(d, maxValue)))
            .attr('height', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => this.calcItemSize(d, maxValue)))
            .attr('fill', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => (d.total > 0) ? color(d.total) : 'transparent'))
            .on('click', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            if (this.inTransition) {
                return;
            }
            // Don't transition if there is no data to show
            if (d.total === 0) {
                return;
            }
            this.inTransition = true;
            // Set selected date to the one clicked on
            this.selected = d;
            // Hide tooltip
            this.hideTooltip();
            // Remove all month overview related items and labels
            this.removeMonthOverview();
            // Redraw the chart
            this.overview = 'day';
            this.drawChart();
        }))
            .on('mouseover', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            if (this.inTransition) {
                return;
            }
            // Construct tooltip
            // Calculate tooltip position
            /** @type {?} */
            let x = weekScale(d.date.week().toString()) + this.tooltipPadding;
            while (this.gWidth - x < (this.tooltipWidth + this.tooltipPadding * 3)) {
                x -= 10;
            }
            /** @type {?} */
            const y = dayScale(d.date.weekday().toString()) + this.tooltipPadding;
            // Show tooltip
            this.tooltip.html(this.getTooltip(d))
                .style('left', x + 'px')
                .style('top', y + 'px')
                .transition()
                .duration(this.transitionDuration / 2)
                .ease(easeLinear)
                .style('opacity', 1);
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        () => {
            if (this.inTransition) {
                return;
            }
            this.hideTooltip();
        }))
            .transition()
            .delay((/**
         * @return {?}
         */
        () => (Math.cos(Math.PI * Math.random()) + 1) * this.transitionDuration))
            .duration((/**
         * @return {?}
         */
        () => this.transitionDuration))
            .ease(easeLinear)
            .style('opacity', 1)
            .call((/**
         * @param {?} transition
         * @param {?} callback
         * @return {?}
         */
        (transition, callback) => {
            if (transition.empty()) {
                callback();
            }
            /** @type {?} */
            let n = 0;
            transition.each((/**
             * @return {?}
             */
            () => ++n)).on('end', (/**
             * @return {?}
             */
            function () {
                if (!--n) {
                    callback.apply(this, arguments);
                }
            }));
        }), (/**
         * @return {?}
         */
        () => this.inTransition = false));
        // Add week labels
        this.labels.selectAll('.label-week').remove();
        this.labels.selectAll('.label-week')
            .data(weekLabels)
            .enter()
            .append('text')
            .attr('class', 'label label-week')
            .attr('font-size', (/**
         * @return {?}
         */
        () => Math.floor(this.labelPadding / 3) + 'px'))
            .text((/**
         * @param {?} d
         * @return {?}
         */
        (d) => 'Week ' + d.week()))
            .attr('x', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => weekScale(d.week().toString())))
            .attr('y', this.labelPadding / 2)
            .on('mouseenter', (/**
         * @param {?} weekday
         * @return {?}
         */
        (weekday) => {
            if (this.inTransition) {
                return;
            }
            this.items.selectAll('.item-block-month')
                .transition()
                .duration(this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', (/**
             * @param {?} d
             * @return {?}
             */
            (d) => {
                return (moment(d.date).week() === weekday.week()) ? 1 : 0.1;
            }));
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        () => {
            if (this.inTransition) {
                return;
            }
            this.items.selectAll('.item-block-month')
                .transition()
                .duration(this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', 1);
        }))
            .on('click', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            if (this.inTransition) {
                return;
            }
            this.inTransition = true;
            // Set selected month to the one clicked on
            this.selected = { date: d };
            // Hide tooltip
            this.hideTooltip();
            // Remove all year overview related items and labels
            this.removeMonthOverview();
            // Redraw the chart
            this.overview = 'week';
            this.drawChart();
        }));
        // Add day labels
        this.labels.selectAll('.label-day').remove();
        this.labels.selectAll('.label-day')
            .data(dayLabels)
            .enter()
            .append('text')
            .attr('class', 'label label-day')
            .attr('x', this.labelPadding / 3)
            .attr('y', (/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        (d, i) => dayScale(i) + dayScale.bandwidth() / 1.75))
            .style('text-anchor', 'left')
            .attr('font-size', (/**
         * @return {?}
         */
        () => Math.floor(this.labelPadding / 3) + 'px'))
            .text((/**
         * @param {?} d
         * @return {?}
         */
        (d) => moment.utc(d).format('dddd')[0]))
            .on('mouseenter', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            if (this.inTransition) {
                return;
            }
            /** @type {?} */
            const selectedDay = moment.utc(d);
            this.items.selectAll('.item-block-month')
                .transition()
                .duration(this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', (/**
             * @param {?} data
             * @return {?}
             */
            (data) => (moment(data.date).day() === selectedDay.day()) ? 1 : 0.1));
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        () => {
            if (this.inTransition) {
                return;
            }
            this.items.selectAll('.item-block-month')
                .transition()
                .duration(this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', 1);
        }));
        // Add button to switch back to previous overview
        this.drawButton();
    }
    /**
     * @return {?}
     */
    drawWeekOverview() {
        // Add current overview to the history
        if (this.history[this.history.length - 1] !== this.overview) {
            this.history.push(this.overview);
        }
        // Define beginning and end of the week
        /** @type {?} */
        const startOfWeek = moment(this.selected.date).startOf('week');
        /** @type {?} */
        const endOfWeek = moment(this.selected.date).endOf('week');
        // Filter data down to the selected week
        /** @type {?} */
        let weekData = [];
        this._data.filter((/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            return d.date.isBetween(startOfWeek, endOfWeek, null, '[]');
        })).map((/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            /** @type {?} */
            const scale = [];
            d.details.forEach((/**
             * @param {?} det
             * @return {?}
             */
            (det) => {
                /** @type {?} */
                const date = moment(det.date);
                /** @type {?} */
                const i = date.hours();
                if (!scale[i]) {
                    scale[i] = {
                        date: date.startOf('hour'),
                        total: 0,
                        details: [],
                        summary: []
                    };
                }
                scale[i].total += det.value;
                scale[i].details.push(det);
            }));
            scale.forEach((/**
             * @param {?} s
             * @return {?}
             */
            s => {
                /** @type {?} */
                const group = this.groupBy(s.details, 'name');
                Object.keys(group).forEach((/**
                 * @param {?} k
                 * @return {?}
                 */
                k => s.summary.push({
                    name: k,
                    total: sum(group[k], (/**
                     * @param {?} data
                     * @return {?}
                     */
                    (data) => data.value)),
                    color: group[k][0].color
                })));
            }));
            weekData = weekData.concat(scale);
        }));
        weekData = GTSLib.cleanArray(weekData);
        /** @type {?} */
        const maxValue = max(weekData, (/**
         * @param {?} d
         * @return {?}
         */
        (d) => d.total));
        // Define day labels and axis
        /** @type {?} */
        const dayLabels = timeDays(moment.utc().startOf('week').toDate(), moment.utc().endOf('week').toDate());
        /** @type {?} */
        const dayScale = scaleBand()
            .rangeRound([this.labelPadding, this.gHeight])
            .domain(dayLabels.map((/**
         * @param {?} d
         * @return {?}
         */
        (d) => moment.utc(d).weekday().toString())));
        // Define hours labels and axis
        /** @type {?} */
        const hoursLabels = [];
        range(0, 24).forEach((/**
         * @param {?} h
         * @return {?}
         */
        h => hoursLabels.push(moment.utc().hours(h).startOf('hour').format('HH:mm'))));
        /** @type {?} */
        const hourScale = scaleBand().rangeRound([this.labelPadding, this.gWidth]).padding(0.01).domain(hoursLabels);
        /** @type {?} */
        const color = scaleLinear()
            .range([this.minColor || CalendarHeatmapComponent.DEF_MIN_COLOR, this.maxColor || CalendarHeatmapComponent.DEF_MAX_COLOR])
            .domain([-0.15 * maxValue, maxValue]);
        // Add week data items to the overview
        this.items.selectAll('.item-block-week').remove();
        this.items.selectAll('.item-block-week')
            .data(weekData)
            .enter()
            .append('rect')
            .style('opacity', 0)
            .attr('class', 'item item-block-week')
            .attr('y', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => this.calcItemY(d)
            + (this.itemSize - this.calcItemSize(d, maxValue)) / 2))
            .attr('x', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => this.gutter
            + hourScale(moment(d.date).startOf('hour').format('HH:mm'))
            + (this.itemSize - this.calcItemSize(d, maxValue)) / 2))
            .attr('rx', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => this.calcItemSize(d, maxValue)))
            .attr('ry', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => this.calcItemSize(d, maxValue)))
            .attr('width', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => this.calcItemSize(d, maxValue)))
            .attr('height', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => this.calcItemSize(d, maxValue)))
            .attr('fill', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => (d.total > 0) ? color(d.total) : 'transparent'))
            .on('click', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            if (this.inTransition) {
                return;
            }
            // Don't transition if there is no data to show
            if (d.total === 0) {
                return;
            }
            this.inTransition = true;
            // Set selected date to the one clicked on
            this.selected = d;
            // Hide tooltip
            this.hideTooltip();
            // Remove all week overview related items and labels
            this.removeWeekOverview();
            // Redraw the chart
            this.overview = 'day';
            this.drawChart();
        })).on('mouseover', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            if (this.inTransition) {
                return;
            }
            // Calculate tooltip position
            /** @type {?} */
            let x = hourScale(moment(d.date).startOf('hour').format('HH:mm')) + this.tooltipPadding;
            while (this.gWidth - x < (this.tooltipWidth + this.tooltipPadding * 3)) {
                x -= 10;
            }
            /** @type {?} */
            const y = dayScale(d.date.weekday().toString()) + this.tooltipPadding;
            // Show tooltip
            this.tooltip.html(this.getTooltip(d))
                .style('left', x + 'px')
                .style('top', y + 'px')
                .transition()
                .duration(this.transitionDuration / 2)
                .ease(easeLinear)
                .style('opacity', 1);
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        () => {
            if (this.inTransition) {
                return;
            }
            this.hideTooltip();
        }))
            .transition()
            .delay((/**
         * @return {?}
         */
        () => (Math.cos(Math.PI * Math.random()) + 1) * this.transitionDuration))
            .duration((/**
         * @return {?}
         */
        () => this.transitionDuration))
            .ease(easeLinear)
            .style('opacity', 1)
            .call((/**
         * @param {?} transition
         * @param {?} callback
         * @return {?}
         */
        (transition, callback) => {
            if (transition.empty()) {
                callback();
            }
            /** @type {?} */
            let n = 0;
            transition.each((/**
             * @return {?}
             */
            () => ++n)).on('end', (/**
             * @return {?}
             */
            function () {
                if (!--n) {
                    callback.apply(this, arguments);
                }
            }));
        }), (/**
         * @return {?}
         */
        () => this.inTransition = false));
        // Add week labels
        this.labels.selectAll('.label-week').remove();
        this.labels.selectAll('.label-week')
            .data(hoursLabels)
            .enter()
            .append('text')
            .attr('class', 'label label-week')
            .attr('font-size', (/**
         * @return {?}
         */
        () => Math.floor(this.labelPadding / 3) + 'px'))
            .text((/**
         * @param {?} d
         * @return {?}
         */
        (d) => d))
            .attr('x', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => hourScale(d)))
            .attr('y', this.labelPadding / 2)
            .on('mouseenter', (/**
         * @param {?} hour
         * @return {?}
         */
        (hour) => {
            if (this.inTransition) {
                return;
            }
            this.items.selectAll('.item-block-week')
                .transition()
                .duration(this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', (/**
             * @param {?} d
             * @return {?}
             */
            (d) => (moment(d.date).startOf('hour').format('HH:mm') === hour) ? 1 : 0.1));
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        () => {
            if (this.inTransition) {
                return;
            }
            this.items.selectAll('.item-block-week')
                .transition()
                .duration(this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', 1);
        }));
        // Add day labels
        this.labels.selectAll('.label-day').remove();
        this.labels.selectAll('.label-day')
            .data(dayLabels)
            .enter()
            .append('text')
            .attr('class', 'label label-day')
            .attr('x', this.labelPadding / 3)
            .attr('y', (/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        (d, i) => dayScale(i.toString()) + dayScale.bandwidth() / 1.75))
            .style('text-anchor', 'left')
            .attr('font-size', (/**
         * @return {?}
         */
        () => Math.floor(this.labelPadding / 3) + 'px'))
            .text((/**
         * @param {?} d
         * @return {?}
         */
        (d) => moment.utc(d).format('dddd')[0]))
            .on('mouseenter', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            if (this.inTransition) {
                return;
            }
            /** @type {?} */
            const selectedDay = moment.utc(d);
            this.items.selectAll('.item-block-week')
                .transition()
                .duration(this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', (/**
             * @param {?} data
             * @return {?}
             */
            (data) => (moment(data.date).day() === selectedDay.day()) ? 1 : 0.1));
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        () => {
            if (this.inTransition) {
                return;
            }
            this.items.selectAll('.item-block-week')
                .transition()
                .duration(this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', 1);
        }));
        // Add button to switch back to previous overview
        this.drawButton();
    }
    /**
     * @return {?}
     */
    drawDayOverview() {
        // Add current overview to the history
        if (this.history[this.history.length - 1] !== this.overview) {
            this.history.push(this.overview);
        }
        // Initialize selected date to today if it was not set
        if (!Object.keys(this.selected).length) {
            this.selected = this._data[this._data.length - 1];
        }
        /** @type {?} */
        const startOfDay = moment(this.selected.date).startOf('day');
        /** @type {?} */
        const endOfDay = moment(this.selected.date).endOf('day');
        // Filter data down to the selected month
        /** @type {?} */
        let dayData = [];
        this._data.filter((/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            return d.date.isBetween(startOfDay, endOfDay, null, '[]');
        })).map((/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            /** @type {?} */
            const scale = [];
            d.details.forEach((/**
             * @param {?} det
             * @return {?}
             */
            (det) => {
                /** @type {?} */
                const date = moment(det.date);
                /** @type {?} */
                const i = date.hours();
                if (!scale[i]) {
                    scale[i] = {
                        date: date.startOf('hour'),
                        total: 0,
                        details: [],
                        summary: []
                    };
                }
                scale[i].total += det.value;
                scale[i].details.push(det);
            }));
            scale.forEach((/**
             * @param {?} s
             * @return {?}
             */
            s => {
                /** @type {?} */
                const group = this.groupBy(s.details, 'name');
                Object.keys(group).forEach((/**
                 * @param {?} k
                 * @return {?}
                 */
                k => {
                    s.summary.push({
                        name: k,
                        total: sum(group[k], (/**
                         * @param {?} item
                         * @return {?}
                         */
                        (item) => item.value)),
                        color: group[k][0].color
                    });
                }));
            }));
            dayData = dayData.concat(scale);
        }));
        /** @type {?} */
        const data = [];
        dayData.forEach((/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            /** @type {?} */
            const date = d.date;
            d.summary.forEach((/**
             * @param {?} s
             * @return {?}
             */
            (s) => {
                s.date = date;
                data.push(s);
            }));
        }));
        dayData = GTSLib.cleanArray(dayData);
        /** @type {?} */
        const maxValue = max(data, (/**
         * @param {?} d
         * @return {?}
         */
        (d) => d.total));
        /** @type {?} */
        const gtsNames = this.selected.summary.map((/**
         * @param {?} summary
         * @return {?}
         */
        (summary) => summary.name));
        /** @type {?} */
        const gtsNameScale = scaleBand().rangeRound([this.labelPadding, this.gHeight]).domain(gtsNames);
        /** @type {?} */
        const hourLabels = [];
        range(0, 24).forEach((/**
         * @param {?} h
         * @return {?}
         */
        h => hourLabels.push(moment.utc().hours(h).startOf('hour').format('HH:mm'))));
        /** @type {?} */
        const dayScale = scaleBand()
            .rangeRound([this.labelPadding, this.gWidth])
            .padding(0.01)
            .domain(hourLabels);
        this.items.selectAll('.item-block').remove();
        this.items.selectAll('.item-block')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'item item-block')
            .attr('x', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => this.gutter
            + dayScale(moment(d.date).startOf('hour').format('HH:mm'))
            + (this.itemSize - this.calcItemSize(d, maxValue)) / 2))
            .attr('y', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            return (gtsNameScale(d.name) || 1) - (this.itemSize - this.calcItemSize(d, maxValue)) / 2;
        }))
            .attr('rx', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => this.calcItemSize(d, maxValue)))
            .attr('ry', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => this.calcItemSize(d, maxValue)))
            .attr('width', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => this.calcItemSize(d, maxValue)))
            .attr('height', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => this.calcItemSize(d, maxValue)))
            .attr('fill', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            /** @type {?} */
            const color = scaleLinear()
                .range(['#ffffff', d.color || CalendarHeatmapComponent.DEF_MIN_COLOR])
                .domain([-0.5 * maxValue, maxValue]);
            return color(d.total);
        }))
            .style('opacity', 0)
            .on('mouseover', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            if (this.inTransition) {
                return;
            }
            // Calculate tooltip position
            /** @type {?} */
            let x = dayScale(moment(d.date).startOf('hour').format('HH:mm')) + this.tooltipPadding;
            while (this.gWidth - x < (this.tooltipWidth + this.tooltipPadding * 3)) {
                x -= 10;
            }
            /** @type {?} */
            const y = gtsNameScale(d.name) + this.tooltipPadding;
            // Show tooltip
            this.tooltip.html(this.getTooltip(d))
                .style('left', x + 'px')
                .style('top', y + 'px')
                .transition()
                .duration(this.transitionDuration / 2)
                .ease(easeLinear)
                .style('opacity', 1);
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        () => {
            if (this.inTransition) {
                return;
            }
            this.hideTooltip();
        }))
            .on('click', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            if (this.handler) {
                this.handler.emit(d);
            }
        }))
            .transition()
            .delay((/**
         * @return {?}
         */
        () => (Math.cos(Math.PI * Math.random()) + 1) * this.transitionDuration))
            .duration((/**
         * @return {?}
         */
        () => this.transitionDuration))
            .ease(easeLinear)
            .style('opacity', 1)
            .call((/**
         * @param {?} transition
         * @param {?} callback
         * @return {?}
         */
        (transition, callback) => {
            if (transition.empty()) {
                callback();
            }
            /** @type {?} */
            let n = 0;
            transition.each((/**
             * @return {?}
             */
            () => ++n)).on('end', (/**
             * @return {?}
             */
            function () {
                if (!--n) {
                    callback.apply(this, arguments);
                }
            }));
        }), (/**
         * @return {?}
         */
        () => this.inTransition = false));
        // Add time labels
        this.labels.selectAll('.label-time').remove();
        this.labels.selectAll('.label-time')
            .data(hourLabels)
            .enter()
            .append('text')
            .attr('class', 'label label-time')
            .attr('font-size', (/**
         * @return {?}
         */
        () => Math.floor(this.labelPadding / 3) + 'px'))
            .text((/**
         * @param {?} d
         * @return {?}
         */
        (d) => d))
            .attr('x', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => dayScale(d)))
            .attr('y', this.labelPadding / 2)
            .on('mouseenter', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            if (this.inTransition) {
                return;
            }
            /** @type {?} */
            const selected = d;
            // const selected = itemScale(moment.utc(d));
            this.items.selectAll('.item-block')
                .transition()
                .duration(this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', (/**
             * @param {?} item
             * @return {?}
             */
            (item) => (item.date.format('HH:mm') === selected) ? 1 : 0.1));
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        () => {
            if (this.inTransition) {
                return;
            }
            this.items.selectAll('.item-block')
                .transition()
                .duration(this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', 1);
        }));
        // Add project labels
        /** @type {?} */
        const labelPadding = this.labelPadding;
        this.labels.selectAll('.label-project').remove();
        this.labels.selectAll('.label-project')
            .data(gtsNames)
            .enter()
            .append('text')
            .attr('class', 'label label-project')
            .attr('x', this.gutter)
            .attr('y', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => gtsNameScale(d) + this.itemSize / 2))
            .attr('min-height', (/**
         * @return {?}
         */
        () => gtsNameScale.bandwidth()))
            .style('text-anchor', 'left')
            .attr('font-size', (/**
         * @return {?}
         */
        () => Math.floor(this.labelPadding / 3) + 'px'))
            .text((/**
         * @param {?} d
         * @return {?}
         */
        (d) => d))
            .each((/**
         * @return {?}
         */
        function () {
            /** @type {?} */
            const obj = select(this);
            /** @type {?} */
            let textLength = obj.node().getComputedTextLength();
            /** @type {?} */
            let text = obj.text();
            while (textLength > (labelPadding * 1.5) && text.length > 0) {
                text = text.slice(0, -1);
                obj.text(text + '...');
                textLength = obj.node().getComputedTextLength();
            }
        }))
            .on('mouseenter', (/**
         * @param {?} gtsName
         * @return {?}
         */
        (gtsName) => {
            if (this.inTransition) {
                return;
            }
            this.items.selectAll('.item-block')
                .transition()
                .duration(this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', (/**
             * @param {?} d
             * @return {?}
             */
            (d) => (d.name === gtsName) ? 1 : 0.1));
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        () => {
            if (this.inTransition) {
                return;
            }
            this.items.selectAll('.item-block')
                .transition()
                .duration(this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', 1);
        }));
        // Add button to switch back to previous overview
        this.drawButton();
    }
    /**
     * @private
     * @param {?} d
     * @param {?} startOfYear
     * @return {?}
     */
    calcItemX(d, startOfYear) {
        /** @type {?} */
        const dayIndex = Math.round((+moment(d.date) - +startOfYear.startOf('week')) / 86400000);
        /** @type {?} */
        const colIndex = Math.trunc(dayIndex / 7);
        return colIndex * (this.itemSize + this.gutter) + this.labelPadding;
    }
    /**
     * @private
     * @param {?} d
     * @param {?} start
     * @param {?} offset
     * @return {?}
     */
    calcItemXMonth(d, start, offset) {
        /** @type {?} */
        const hourIndex = moment(d.date).hours();
        /** @type {?} */
        const colIndex = Math.trunc(hourIndex / 3);
        return colIndex * (this.itemSize + this.gutter) + offset;
    }
    /**
     * @private
     * @param {?} d
     * @return {?}
     */
    calcItemY(d) {
        return this.labelPadding + d.date.weekday() * (this.itemSize + this.gutter);
    }
    /**
     * @private
     * @param {?} d
     * @param {?} m
     * @return {?}
     */
    calcItemSize(d, m) {
        if (m <= 0) {
            return this.itemSize;
        }
        return this.itemSize * 0.75 + (this.itemSize * d.total / m) * 0.25;
    }
    /**
     * @private
     * @return {?}
     */
    drawButton() {
        this.buttons.selectAll('.button').remove();
        /** @type {?} */
        const button = this.buttons.append('g')
            .attr('class', 'button button-back')
            .style('opacity', 0)
            .on('click', (/**
         * @return {?}
         */
        () => {
            if (this.inTransition) {
                return;
            }
            // Set transition boolean
            this.inTransition = true;
            // Clean the canvas from whichever overview type was on
            if (this.overview === 'year') {
                this.removeYearOverview();
            }
            else if (this.overview === 'month') {
                this.removeMonthOverview();
            }
            else if (this.overview === 'week') {
                this.removeWeekOverview();
            }
            else if (this.overview === 'day') {
                this.removeDayOverview();
            }
            // Redraw the chart
            this.history.pop();
            this.overview = this.history.pop();
            this.drawChart();
        }));
        button.append('circle')
            .attr('cx', this.labelPadding / 2.25)
            .attr('cy', this.labelPadding / 2.5)
            .attr('r', this.itemSize / 2);
        button.append('text')
            .attr('x', this.labelPadding / 2.25)
            .attr('y', this.labelPadding / 2.5)
            .attr('dy', (/**
         * @return {?}
         */
        () => {
            return Math.floor(this.gWidth / 100) / 3;
        }))
            .attr('font-size', (/**
         * @return {?}
         */
        () => {
            return Math.floor(this.labelPadding / 3) + 'px';
        }))
            .html('&#x2190;');
        button.transition()
            .duration(this.transitionDuration)
            .ease(easeLinear)
            .style('opacity', 1);
    }
    /**
     * @private
     * @return {?}
     */
    removeGlobalOverview() {
        this.items.selectAll('.item-block-year')
            .transition()
            .duration(this.transitionDuration)
            .ease(easeLinear)
            .style('opacity', 0)
            .remove();
        this.labels.selectAll('.label-year').remove();
    }
    /**
     * @private
     * @return {?}
     */
    removeYearOverview() {
        this.items.selectAll('.item-circle')
            .transition()
            .duration(this.transitionDuration)
            .ease(easeLinear)
            .style('opacity', 0)
            .remove();
        this.labels.selectAll('.label-day').remove();
        this.labels.selectAll('.label-month').remove();
        this.hideBackButton();
    }
    /**
     * @private
     * @return {?}
     */
    removeMonthOverview() {
        this.items.selectAll('.item-block-month')
            .transition()
            .duration(this.transitionDuration)
            .ease(easeLinear)
            .style('opacity', 0)
            .remove();
        this.labels.selectAll('.label-day').remove();
        this.labels.selectAll('.label-week').remove();
        this.hideBackButton();
    }
    /**
     * @private
     * @return {?}
     */
    removeWeekOverview() {
        this.items.selectAll('.item-block-week')
            .transition()
            .duration(this.transitionDuration)
            .ease(easeLinear)
            .style('opacity', 0)
            .attr('x', (/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        (d, i) => (i % 2 === 0) ? -this.gWidth / 3 : this.gWidth / 3))
            .remove();
        this.labels.selectAll('.label-day').remove();
        this.labels.selectAll('.label-week').remove();
        this.hideBackButton();
    }
    /**
     * @private
     * @return {?}
     */
    removeDayOverview() {
        this.items.selectAll('.item-block')
            .transition()
            .duration(this.transitionDuration)
            .ease(easeLinear)
            .style('opacity', 0)
            .attr('x', (/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        (d, i) => (i % 2 === 0) ? -this.gWidth / 3 : this.gWidth / 3))
            .remove();
        this.labels.selectAll('.label-time').remove();
        this.labels.selectAll('.label-project').remove();
        this.hideBackButton();
    }
    /**
     * @private
     * @return {?}
     */
    hideTooltip() {
        this.tooltip.transition()
            .duration(this.transitionDuration / 2)
            .ease(easeLinear)
            .style('opacity', 0);
    }
    /**
     * Helper function to hide the back button
     * @private
     * @return {?}
     */
    hideBackButton() {
        this.buttons.selectAll('.button')
            .transition()
            .duration(this.transitionDuration)
            .ease(easeLinear)
            .style('opacity', 0)
            .remove();
    }
}
CalendarHeatmapComponent.DEF_MIN_COLOR = '#ffffff';
CalendarHeatmapComponent.DEF_MAX_COLOR = '#333333';
CalendarHeatmapComponent.decorators = [
    { type: Component, args: [{
                selector: 'calendar-heatmap',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div #chart></div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}:host{position:relative;user-select:none;-ms-user-select:none;-moz-user-select:none;-webkit-user-select:none}:host .item{cursor:pointer}:host .label{cursor:pointer;fill:#aaa;font-family:Helvetica,arial,'Open Sans',sans-serif}:host .button{cursor:pointer;fill:transparent;stroke-width:2;stroke:#aaa}:host .button text{stroke-width:1;text-anchor:middle;fill:#aaa}:host .heatmap-tooltip{pointer-events:none;position:absolute;z-index:9999;width:450px;max-width:650px;overflow:hidden;padding:15px;font-size:12px;line-height:14px;color:#fff;font-family:Helvetica,arial,'Open Sans',sans-serif;background:rgba(0,0,0,.75)}:host .heatmap-tooltip ul{list-style:none;padding:0}:host .heatmap-tooltip ul li{padding:0}:host .heatmap-tooltip ul li .gtsInfo{padding-left:20px;width:auto;max-width:650px}:host .heatmap-tooltip .header strong{display:inline-block;width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}:host .heatmap-tooltip .round{border-radius:50%;background-color:#bbb;display:inline-block;width:12px;height:12px;border:2px solid #454545}"]
            }] }
];
/** @nocollapse */
CalendarHeatmapComponent.ctorParameters = () => [
    { type: ElementRef }
];
CalendarHeatmapComponent.propDecorators = {
    debug: [{ type: Input, args: ['debug',] }],
    data: [{ type: Input, args: ['data',] }],
    minColor: [{ type: Input, args: ['minColor',] }],
    maxColor: [{ type: Input, args: ['maxColor',] }],
    div: [{ type: ViewChild, args: ['chart', { static: true },] }],
    width: [{ type: Input, args: ['width',] }],
    height: [{ type: Input, args: ['height',] }],
    overview: [{ type: Input, args: ['overview',] }],
    handler: [{ type: Output, args: ['handler',] }],
    change: [{ type: Output, args: ['change',] }],
    onResize: [{ type: HostListener, args: ['window:resize',] }]
};
if (false) {
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.DEF_MIN_COLOR;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.DEF_MAX_COLOR;
    /** @type {?} */
    CalendarHeatmapComponent.prototype.div;
    /** @type {?} */
    CalendarHeatmapComponent.prototype.width;
    /** @type {?} */
    CalendarHeatmapComponent.prototype.height;
    /** @type {?} */
    CalendarHeatmapComponent.prototype.overview;
    /** @type {?} */
    CalendarHeatmapComponent.prototype.handler;
    /** @type {?} */
    CalendarHeatmapComponent.prototype.change;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype.LOG;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype._data;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype._debug;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype._minColor;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype._maxColor;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype.gutter;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype.gWidth;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype.gHeight;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype.itemSize;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype.labelPadding;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype.transitionDuration;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype.inTransition;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype.tooltipWidth;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype.tooltipPadding;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype.history;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype.selected;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype.svg;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype.items;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype.labels;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype.buttons;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype.tooltip;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype.parentWidth;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype.chart;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype.resizeTimer;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype.getTooltip;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype.el;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class WarpViewModalComponent {
    /**
     * @param {?} el
     */
    constructor(el) {
        this.el = el;
        this.modalTitle = '';
        this.kbdLastKeyPressed = [];
        this.warpViewModalOpen = new EventEmitter();
        this.warpViewModalClose = new EventEmitter();
        this.opened = false;
    }
    /**
     * @return {?}
     */
    open() {
        this.el.nativeElement.style.display = 'block';
        this.el.nativeElement.style.zIndex = '999999';
        this.opened = true;
        this.warpViewModalOpen.emit({});
    }
    /**
     * @return {?}
     */
    close() {
        this.el.nativeElement.style.display = 'none';
        this.el.nativeElement.style.zIndex = '-1';
        this.opened = false;
        this.warpViewModalClose.emit({});
    }
    /**
     * @return {?}
     */
    isOpened() {
        return new Promise((/**
         * @param {?} resolve
         * @return {?}
         */
        resolve => {
            resolve(this.opened);
        }));
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    handleKeyDown($event) {
        if ('Escape' === $event[0]) {
            this.close();
        }
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.el.nativeElement.addEventListener('click', (/**
         * @param {?} event
         * @return {?}
         */
        (event) => {
            if (event.path[0].nodeName === 'WARP-VIEW-MODAL') {
                this.close();
            }
        }));
    }
}
WarpViewModalComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-modal',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"popup\">\n  <div class=\"header\">\n    <div class=\"title\" [innerHTML]=\"modalTitle\"></div>\n    <div class=\"close\" (click)=\"close()\">&times;</div>\n  </div>\n  <div class=\"body\">\n    <ng-content></ng-content>\n  </div>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host{position:fixed;top:0;left:0;z-index:0;display:none;width:100%;height:100%;overflow:hidden;outline:0;background-color:rgba(0,0,0,.3)}:host .popup{position:relative;width:100%;height:auto;background-color:var(--warp-view-popup-bg-color);top:10%;z-index:999999;background-clip:padding-box;border:1px solid var(--warp-view-popup-border-color);border-radius:.3rem;display:-webkit-box;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;flex-direction:column;pointer-events:auto;outline:0;margin:1.75rem auto}@media (min-width:576px){:host .popup{max-width:800px}}:host .popup .header{background-color:var(--warp-view-popup-header-bg-color);display:-webkit-box;display:flex;-webkit-box-align:start;align-items:flex-start;-webkit-box-pack:justify;justify-content:space-between;padding:1rem;border-bottom:1px solid #e9ecef;border-top-left-radius:.3rem;border-top-right-radius:.3rem}:host .popup .header .title{margin-bottom:0;line-height:1.5;color:var(--warp-view-popup-title-color)}:host .popup .header .close{padding:1rem;margin:-1rem -1rem -1rem auto;cursor:pointer;color:var(--warp-view-popup-close-color)}:host .popup .body{position:relative;background-color:var(--warp-view-popup-body-bg-color);color:var(--warp-view-popup-body-color);height:auto;padding:10px}"]
            }] }
];
/** @nocollapse */
WarpViewModalComponent.ctorParameters = () => [
    { type: ElementRef }
];
WarpViewModalComponent.propDecorators = {
    modalTitle: [{ type: Input, args: ['modalTitle',] }],
    kbdLastKeyPressed: [{ type: Input, args: ['kbdLastKeyPressed',] }],
    warpViewModalOpen: [{ type: Output, args: ['warpViewModalOpen',] }],
    warpViewModalClose: [{ type: Output, args: ['warpViewModalClose',] }],
    handleKeyDown: [{ type: HostListener, args: ['kbdLastKeyPressed', ['$event'],] }]
};
if (false) {
    /** @type {?} */
    WarpViewModalComponent.prototype.modalTitle;
    /** @type {?} */
    WarpViewModalComponent.prototype.kbdLastKeyPressed;
    /** @type {?} */
    WarpViewModalComponent.prototype.warpViewModalOpen;
    /** @type {?} */
    WarpViewModalComponent.prototype.warpViewModalClose;
    /**
     * @type {?}
     * @private
     */
    WarpViewModalComponent.prototype.opened;
    /** @type {?} */
    WarpViewModalComponent.prototype.el;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *
 */
class WarpViewGtsPopupComponent {
    constructor() {
        this.maxToShow = 5;
        this.warpViewSelectedGTS = new EventEmitter();
        this.warpViewModalOpen = new EventEmitter();
        this.warpViewModalClose = new EventEmitter();
        this.current = 0;
        // tslint:disable-next-line:variable-name
        this._gts = [];
        this._options = new Param();
        // tslint:disable-next-line:variable-name
        this._kbdLastKeyPressed = [];
        // tslint:disable-next-line:variable-name
        this._hiddenData = [];
        // tslint:disable-next-line:variable-name
        this._debug = false;
        this.displayed = [];
        this.modalOpenned = false;
        this.LOG = new Logger(WarpViewGtsPopupComponent, this.debug);
    }
    /**
     * @param {?} options
     * @return {?}
     */
    set options(options) {
        this.LOG.debug(['onOptions'], options);
        if (typeof options === 'string') {
            options = JSON.parse(options);
        }
        if (!deepEqual(options, this._options)) {
            this.LOG.debug(['options', 'changed'], options);
            this._options = (/** @type {?} */ (ChartLib.mergeDeep(this._options, (/** @type {?} */ (options)))));
            this.prepareData();
        }
    }
    /**
     * @param {?} gtsList
     * @return {?}
     */
    set gtsList(gtsList) {
        this._gtsList = gtsList;
        this.LOG.debug(['_gtsList'], this._gtsList);
        this.prepareData();
    }
    /**
     * @return {?}
     */
    get gtslist() {
        return this._gtsList;
    }
    /**
     * @param {?} debug
     * @return {?}
     */
    set debug(debug) {
        this._debug = debug;
        this.LOG.setDebug(debug);
    }
    /**
     * @return {?}
     */
    get debug() {
        return this._debug;
    }
    /**
     * @param {?} data
     * @return {?}
     */
    set data(data) {
        this.LOG.debug(['data'], data);
        if (data) {
            this._data = data;
        }
    }
    /**
     * @return {?}
     */
    get data() {
        return this._data;
    }
    /**
     * @param {?} hiddenData
     * @return {?}
     */
    set hiddenData(hiddenData) {
        this._hiddenData = hiddenData;
        this.prepareData();
    }
    /**
     * @return {?}
     */
    get hiddenData() {
        return this._hiddenData;
    }
    /**
     * @param {?} kbdLastKeyPressed
     * @return {?}
     */
    set kbdLastKeyPressed(kbdLastKeyPressed) {
        this._kbdLastKeyPressed = kbdLastKeyPressed;
        if (kbdLastKeyPressed[0] === 's' && !this.modalOpenned) {
            this.showPopup();
        }
        else if (this.modalOpenned) {
            switch (kbdLastKeyPressed[0]) {
                case 'ArrowUp':
                case 'j':
                    this.current = Math.max(0, this.current - 1);
                    this.prepareData();
                    break;
                case 'ArrowDown':
                case 'k':
                    this.current = Math.min(this._gts.length - 1, this.current + 1);
                    this.prepareData();
                    break;
                case ' ':
                    this.warpViewSelectedGTS.emit({
                        gts: this._gts[this.current],
                        selected: this.hiddenData.indexOf(this._gts[this.current].id) > -1
                    });
                    break;
                default:
                    return;
            }
        }
    }
    /**
     * @return {?}
     */
    get kbdLastKeyPressed() {
        return this._kbdLastKeyPressed;
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.prepareData();
    }
    /**
     * @return {?}
     */
    onWarpViewModalOpen() {
        this.modalOpenned = true;
        this.warpViewModalOpen.emit({});
    }
    /**
     * @return {?}
     */
    onWarpViewModalClose() {
        this.modalOpenned = false;
        this.warpViewModalClose.emit({});
    }
    /**
     * @return {?}
     */
    isOpened() {
        return this.modal.isOpened();
    }
    /**
     * @private
     * @return {?}
     */
    showPopup() {
        this.current = 0;
        this.prepareData();
        this.modal.open();
    }
    /**
     * @return {?}
     */
    close() {
        this.modal.close();
    }
    /**
     * @private
     * @return {?}
     */
    prepareData() {
        if (this._gtsList && this._gtsList.data) {
            this._gts = GTSLib.flatDeep([this._gtsList.data]);
            this.displayed = (/** @type {?} */ (this._gts.slice(Math.max(0, Math.min(this.current - this.maxToShow, this._gts.length - 2 * this.maxToShow)), Math.min(this._gts.length, this.current + this.maxToShow + Math.abs(Math.min(this.current - this.maxToShow, 0))))));
            this.LOG.debug(['prepareData'], this.displayed);
        }
    }
    /**
     * @param {?} gts
     * @return {?}
     */
    isHidden(gts) {
        return !this.displayed.find((/**
         * @param {?} g
         * @return {?}
         */
        g => !!gts ? gts.id === g.id : false));
    }
}
WarpViewGtsPopupComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-gts-popup',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<warpview-modal [kbdLastKeyPressed]=\"kbdLastKeyPressed\"\n                modalTitle=\"GTS Selector\"\n                #modal\n                (warpViewModalClose)=\"onWarpViewModalClose()\"\n                (warpViewModalOpen)=\"onWarpViewModalOpen()\">\n  <div class=\"up-arrow\" *ngIf=\"this.current > 0\"></div>\n  <ul>\n    <li *ngFor=\"let g of _gts; index as index\"\n        [ngClass]=\"{ selected: current == index, hidden: isHidden(g.id) }\"\n    >\n      <warpview-chip [node]=\"{gts: g}\" [name]=\"g.c\" [hiddenData]=\"hiddenData\" [options]=\"_options\"></warpview-chip>\n    </li>\n  </ul>\n  <div class=\"down-arrow\" *ngIf=\"current < _gts.length - 1\"></div>\n</warpview-modal>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}"]
            }] }
];
/** @nocollapse */
WarpViewGtsPopupComponent.ctorParameters = () => [];
WarpViewGtsPopupComponent.propDecorators = {
    modal: [{ type: ViewChild, args: ['modal', { static: true },] }],
    options: [{ type: Input, args: ['options',] }],
    gtsList: [{ type: Input, args: ['gtsList',] }],
    debug: [{ type: Input, args: ['debug',] }],
    data: [{ type: Input, args: ['data',] }],
    hiddenData: [{ type: Input, args: ['hiddenData',] }],
    maxToShow: [{ type: Input, args: ['maxToShow',] }],
    kbdLastKeyPressed: [{ type: Input, args: ['kbdLastKeyPressed',] }],
    warpViewSelectedGTS: [{ type: Output, args: ['warpViewSelectedGTS',] }],
    warpViewModalOpen: [{ type: Output, args: ['warpViewModalOpen',] }],
    warpViewModalClose: [{ type: Output, args: ['warpViewModalClose',] }]
};
if (false) {
    /** @type {?} */
    WarpViewGtsPopupComponent.prototype.modal;
    /** @type {?} */
    WarpViewGtsPopupComponent.prototype.maxToShow;
    /** @type {?} */
    WarpViewGtsPopupComponent.prototype.warpViewSelectedGTS;
    /** @type {?} */
    WarpViewGtsPopupComponent.prototype.warpViewModalOpen;
    /** @type {?} */
    WarpViewGtsPopupComponent.prototype.warpViewModalClose;
    /** @type {?} */
    WarpViewGtsPopupComponent.prototype.current;
    /** @type {?} */
    WarpViewGtsPopupComponent.prototype._gts;
    /** @type {?} */
    WarpViewGtsPopupComponent.prototype._options;
    /**
     * @type {?}
     * @private
     */
    WarpViewGtsPopupComponent.prototype._kbdLastKeyPressed;
    /**
     * @type {?}
     * @private
     */
    WarpViewGtsPopupComponent.prototype._hiddenData;
    /**
     * @type {?}
     * @private
     */
    WarpViewGtsPopupComponent.prototype._debug;
    /**
     * @type {?}
     * @private
     */
    WarpViewGtsPopupComponent.prototype._gtsList;
    /**
     * @type {?}
     * @private
     */
    WarpViewGtsPopupComponent.prototype._data;
    /**
     * @type {?}
     * @private
     */
    WarpViewGtsPopupComponent.prototype.displayed;
    /**
     * @type {?}
     * @private
     */
    WarpViewGtsPopupComponent.prototype.modalOpenned;
    /**
     * @type {?}
     * @private
     */
    WarpViewGtsPopupComponent.prototype.LOG;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *
 */
class WarpViewGtsTreeComponent extends WarpViewComponent {
    /**
     * @param {?} el
     * @param {?} renderer
     * @param {?} sizeService
     * @param {?} ngZone
     */
    constructor(el, renderer, sizeService, ngZone) {
        super(el, renderer, sizeService, ngZone);
        this.el = el;
        this.renderer = renderer;
        this.sizeService = sizeService;
        this.ngZone = ngZone;
        this.kbdLastKeyPressed = [];
        this.warpViewSelectedGTS = new EventEmitter();
        this._gtsFilter = 'x';
        this.gtsList = [];
        this.params = (/** @type {?} */ ([]));
        this.expand = false;
        this.initOpen = new Subject();
        this.LOG = new Logger(WarpViewGtsTreeComponent, this._debug);
    }
    /**
     * @param {?} gtsFilter
     * @return {?}
     */
    set gtsFilter(gtsFilter) {
        this._gtsFilter = gtsFilter;
    }
    /**
     * @return {?}
     */
    get gtsFilter() {
        return this._gtsFilter;
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.LOG.debug(['componentDidLoad', 'data'], this._data);
        if (this._data) {
            this.doRender();
        }
        if (!!this._options.foldGTSTree && !this.expand) {
            this.foldAll();
        }
        if (!this._options.foldGTSTree) {
            this.initOpen.next();
        }
    }
    /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    update(options, refresh) {
        this.doRender();
        if (!!this._options.foldGTSTree && !this.expand) {
            this.foldAll();
        }
    }
    /**
     * @private
     * @return {?}
     */
    doRender() {
        this.LOG.debug(['doRender', 'gtsList'], this._data);
        this._options = (/** @type {?} */ (ChartLib.mergeDeep(this.defOptions, this._options)));
        if (!this._data) {
            return;
        }
        /** @type {?} */
        const dataList = GTSLib.getData(this._data).data;
        this.params = this._data.params || [];
        this.LOG.debug(['doRender', 'gtsList', 'dataList'], dataList);
        if (!dataList) {
            return;
        }
        this.expand = !this._options.foldGTSTree;
        this.gtsList = GTSLib.flattenGtsIdArray((/** @type {?} */ (dataList)), 0).res;
        this.LOG.debug(['doRender', 'gtsList'], this.gtsList, this._options.foldGTSTree, this.expand);
        this.loading = false;
        this.chartDraw.emit();
    }
    /**
     * @private
     * @return {?}
     */
    foldAll() {
        if (!this.root) {
            setTimeout((/**
             * @return {?}
             */
            () => this.foldAll()));
        }
        else {
            this.expand = false;
        }
    }
    /**
     * @return {?}
     */
    toggleVisibility() {
        this.expand = !this.expand;
    }
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    convert(data) {
        return [];
    }
    /**
     * @param {?} event
     * @return {?}
     */
    warpViewSelectedGTSHandler(event) {
        this.LOG.debug(['warpViewSelectedGTS'], event);
        this.warpViewSelectedGTS.emit(event);
    }
}
WarpViewGtsTreeComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-gts-tree',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"wrapper\">\n  <div class=\"stack-level\" (click)=\"toggleVisibility()\">\n    <span [ngClass]=\"{expanded: this.expand, collapsed: !this.expand}\" #root></span> Results\n  </div>\n  <warpview-tree-view [events]=\"initOpen.asObservable()\"\n                      [gtsList]=\"gtsList\" [branch]=\"false\" *ngIf=\"expand\" [params]=\"params\"\n                      [options]=\"_options\" (warpViewSelectedGTS)=\"warpViewSelectedGTSHandler($event)\"\n                      [debug]=\"debug\" [hiddenData]=\"hiddenData\" [gtsFilter]=\"gtsFilter\"\n                      [kbdLastKeyPressed]=\"kbdLastKeyPressed\"></warpview-tree-view>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host .wrapper{text-align:left}:host .stack-level{font-size:1em;padding-top:5px;cursor:pointer;color:var(--gts-stack-font-color)}:host .stack-level+div{padding-left:25px}:host .expanded{padding:1px 10px;margin-right:5px;background-image:var(--gts-tree-expanded-icon);background-position:center left;background-repeat:no-repeat}:host .collapsed{padding:1px 10px;margin-right:5px;background-image:var(--gts-tree-collapsed-icon);background-repeat:no-repeat;background-position:center left}"]
            }] }
];
/** @nocollapse */
WarpViewGtsTreeComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: SizeService },
    { type: NgZone }
];
WarpViewGtsTreeComponent.propDecorators = {
    root: [{ type: ViewChild, args: ['root', { static: true },] }],
    kbdLastKeyPressed: [{ type: Input, args: ['kbdLastKeyPressed',] }],
    gtsFilter: [{ type: Input, args: ['gtsFilter',] }],
    warpViewSelectedGTS: [{ type: Output, args: ['warpViewSelectedGTS',] }]
};
if (false) {
    /** @type {?} */
    WarpViewGtsTreeComponent.prototype.root;
    /** @type {?} */
    WarpViewGtsTreeComponent.prototype.kbdLastKeyPressed;
    /** @type {?} */
    WarpViewGtsTreeComponent.prototype.warpViewSelectedGTS;
    /**
     * @type {?}
     * @private
     */
    WarpViewGtsTreeComponent.prototype._gtsFilter;
    /** @type {?} */
    WarpViewGtsTreeComponent.prototype.gtsList;
    /** @type {?} */
    WarpViewGtsTreeComponent.prototype.params;
    /** @type {?} */
    WarpViewGtsTreeComponent.prototype.expand;
    /** @type {?} */
    WarpViewGtsTreeComponent.prototype.initOpen;
    /** @type {?} */
    WarpViewGtsTreeComponent.prototype.el;
    /** @type {?} */
    WarpViewGtsTreeComponent.prototype.renderer;
    /** @type {?} */
    WarpViewGtsTreeComponent.prototype.sizeService;
    /** @type {?} */
    WarpViewGtsTreeComponent.prototype.ngZone;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class WarpViewTreeViewComponent {
    constructor() {
        this.gtsFilter = 'x';
        this.branch = false;
        this.hidden = false;
        this.kbdLastKeyPressed = [];
        this.warpViewSelectedGTS = new EventEmitter();
        this.hide = {};
        this.initOpen = new Subject();
        this._debug = false;
        this._hiddenData = [];
        this.LOG = new Logger(WarpViewTreeViewComponent, this.debug);
    }
    /**
     * @param {?} debug
     * @return {?}
     */
    set debug(debug) {
        this._debug = debug;
        this.LOG.setDebug(debug);
    }
    /**
     * @return {?}
     */
    get debug() {
        return this._debug;
    }
    /**
     * @param {?} hiddenData
     * @return {?}
     */
    set hiddenData(hiddenData) {
        this._hiddenData = [...hiddenData];
    }
    /**
     * @return {?}
     */
    get hiddenData() {
        return this._hiddenData;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.LOG.debug(['ngOnInit'], this.gtsList);
        this.gtsList.forEach((/**
         * @param {?} g
         * @param {?} index
         * @return {?}
         */
        (g, index) => {
            this.hide[index + ''] = false;
        }));
        this.eventsSubscription = this.events.subscribe((/**
         * @return {?}
         */
        () => this.open()));
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.eventsSubscription.unsubscribe();
    }
    /**
     * @param {?} index
     * @return {?}
     */
    toggleVisibility(index) {
        this.LOG.debug(['toggleVisibility'], index, this.hide);
        this.hide[index + ''] = !this.hide[index + ''];
    }
    /**
     * @param {?} index
     * @return {?}
     */
    isHidden(index) {
        if (!!this.hide[index + '']) {
            return this.hide[index + ''];
        }
        else {
            return false;
        }
    }
    /**
     * @param {?} node
     * @return {?}
     */
    isGts(node) {
        return GTSLib.isGts(node);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    warpViewSelectedGTSHandler(event) {
        this.LOG.debug(['warpViewSelectedGTS'], event);
        this.warpViewSelectedGTS.emit(event);
    }
    /**
     * @return {?}
     */
    open() {
        this.gtsList.forEach((/**
         * @param {?} g
         * @param {?} index
         * @return {?}
         */
        (g, index) => {
            this.hide[index + ''] = true;
        }));
        setTimeout((/**
         * @return {?}
         */
        () => this.initOpen.next()));
    }
}
WarpViewTreeViewComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-tree-view',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"list\">\n  <ul *ngIf=\"gtsList\">\n    <li *ngFor=\"let gts of gtsList; index as index; first as first\" >\n      <warpview-chip\n        *ngIf=\"isGts(gts)\"\n        [options]=\"options\" (warpViewSelectedGTS)=\"warpViewSelectedGTSHandler($event)\" [param]=\"params[gts.id]\"\n        [node]=\"{gts: gts}\" [name]=\"gts.c\" [gtsFilter]=\"gtsFilter\" [debug]=\"debug\" [hiddenData]=\"hiddenData\"\n        [kbdLastKeyPressed]=\"kbdLastKeyPressed\"></warpview-chip>\n      <span *ngIf=\"!isGts(gts)\">\n        <span *ngIf=\"gts\">\n          <span *ngIf=\"branch\">\n            <span>\n            <span [ngClass]=\"{expanded:  hide[index + ''], collapsed: !hide[index + '']}\"\n                  (click)=\"toggleVisibility(index)\" [id]=\"'span-' + index\"> </span>\n                    <small (click)=\"toggleVisibility(index)\"> List of {{gts.length}}\n                      item{{gts.length > 1 ? 's' : ''}}</small>\n           </span>\n          </span>\n          <span *ngIf=\"!branch\">\n            <span class=\"stack-level\">\n              <span [ngClass]=\"{expanded: hide[index + ''], collapsed: !hide[index + '']}\"\n                    (click)=\"toggleVisibility(index)\" [id]=\"'span-' + index\"></span>\n              <span (click)=\"toggleVisibility(index)\">{{first ? '[TOP]' : '[' + (index + 1) + ']'}}&nbsp;\n                <small [id]=\"'inner-' + index\">List of {{gts.length}} item{{gts.length > 1 ? 's' : ''}}</small>\n              </span>\n                  </span>\n          </span>\n    <warpview-tree-view [gtsList]=\"gts\" [branch]=\"true\" *ngIf=\"isHidden(index)\"\n                        [debug]=\"debug\" [gtsFilter]=\"gtsFilter\" [params]=\"params\"\n                        [events]=\"initOpen.asObservable()\"\n                        [options]=\"options\" (warpViewSelectedGTS)=\"warpViewSelectedGTSHandler($event)\"\n                        [kbdLastKeyPressed]=\"kbdLastKeyPressed\" [hiddenData]=\"hiddenData\"></warpview-tree-view>\n        </span>\n      </span>\n    </li>\n  </ul>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host ul{margin:0;padding:0;list-style:none;border:none;overflow:hidden}:host li{color:var(--gts-stack-font-color,#000);position:relative;padding:0 0 0 20px;line-height:20px}:host .list,:host li .stack-level{font-size:1em;padding-top:5px}:host .list+div,:host li .stack-level+div{padding-left:25px}:host li .expanded{padding:1px 10px;margin-right:5px;background-image:var(--gts-tree-expanded-icon,url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==));background-position:center left;background-repeat:no-repeat}:host li .collapsed{padding:1px 10px;margin-right:5px;background-image:var(--gts-tree-collapsed-icon,url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=));background-repeat:no-repeat;background-position:center left}:host li .gtsInfo{white-space:normal;word-wrap:break-word}:host li .gtsInfo[disabled]{color:#aaa;cursor:not-allowed}:host li .normal{border-radius:50%;background-color:#bbb;display:inline-block}:host li i,:host li span{cursor:pointer}:host li .selected{background-color:#adf;font-weight:700;padding:1px 5px}"]
            }] }
];
/** @nocollapse */
WarpViewTreeViewComponent.ctorParameters = () => [];
WarpViewTreeViewComponent.propDecorators = {
    debug: [{ type: Input, args: ['debug',] }],
    hiddenData: [{ type: Input, args: ['hiddenData',] }],
    options: [{ type: Input, args: ['options',] }],
    gtsFilter: [{ type: Input, args: ['gtsFilter',] }],
    gtsList: [{ type: Input, args: ['gtsList',] }],
    params: [{ type: Input, args: ['params',] }],
    branch: [{ type: Input, args: ['branch',] }],
    hidden: [{ type: Input, args: ['hidden',] }],
    events: [{ type: Input }],
    kbdLastKeyPressed: [{ type: Input, args: ['kbdLastKeyPressed',] }],
    warpViewSelectedGTS: [{ type: Output, args: ['warpViewSelectedGTS',] }]
};
if (false) {
    /** @type {?} */
    WarpViewTreeViewComponent.prototype.options;
    /** @type {?} */
    WarpViewTreeViewComponent.prototype.gtsFilter;
    /** @type {?} */
    WarpViewTreeViewComponent.prototype.gtsList;
    /** @type {?} */
    WarpViewTreeViewComponent.prototype.params;
    /** @type {?} */
    WarpViewTreeViewComponent.prototype.branch;
    /** @type {?} */
    WarpViewTreeViewComponent.prototype.hidden;
    /** @type {?} */
    WarpViewTreeViewComponent.prototype.events;
    /** @type {?} */
    WarpViewTreeViewComponent.prototype.kbdLastKeyPressed;
    /** @type {?} */
    WarpViewTreeViewComponent.prototype.warpViewSelectedGTS;
    /** @type {?} */
    WarpViewTreeViewComponent.prototype.hide;
    /** @type {?} */
    WarpViewTreeViewComponent.prototype.initOpen;
    /**
     * @type {?}
     * @private
     */
    WarpViewTreeViewComponent.prototype.LOG;
    /**
     * @type {?}
     * @private
     */
    WarpViewTreeViewComponent.prototype._debug;
    /**
     * @type {?}
     * @private
     */
    WarpViewTreeViewComponent.prototype._hiddenData;
    /**
     * @type {?}
     * @private
     */
    WarpViewTreeViewComponent.prototype.eventsSubscription;
}

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
class GTS {
}
if (false) {
    /** @type {?} */
    GTS.prototype.c;
    /** @type {?} */
    GTS.prototype.l;
    /** @type {?} */
    GTS.prototype.a;
    /** @type {?} */
    GTS.prototype.v;
    /** @type {?} */
    GTS.prototype.id;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *
 */
class WarpViewChipComponent {
    constructor() {
        this.param = new Param();
        this.options = new Param();
        this.warpViewSelectedGTS = new EventEmitter();
        this.refreshCounter = 0;
        // the first character triggers change each filter apply to trigger events. it must be discarded.
        this._gtsFilter = 'x';
        this._debug = false;
        this._kbdLastKeyPressed = [];
        this._hiddenData = [];
        this._node = {
            selected: true,
            gts: GTS,
        };
        this.LOG = new Logger(WarpViewChipComponent, this.debug);
    }
    /**
     * @param {?} debug
     * @return {?}
     */
    set debug(debug) {
        this._debug = debug;
        this.LOG.setDebug(debug);
    }
    /**
     * @return {?}
     */
    get debug() {
        return this._debug;
    }
    /**
     * @param {?} hiddenData
     * @return {?}
     */
    set hiddenData(hiddenData) {
        this._hiddenData = hiddenData;
        this.LOG.debug(['hiddenData'], hiddenData, this._node, this._node.gts, this._node.gts.c);
        if (this._node && this._node.gts && this._node.gts.c) {
            this._node = Object.assign({}, this._node, { selected: this.hiddenData.indexOf(this._node.gts.id) === -1, label: GTSLib.serializeGtsMetadata(this._node.gts) });
            this.LOG.debug(['hiddenData'], this._node);
            this.colorizeChip();
        }
    }
    /**
     * @return {?}
     */
    get hiddenData() {
        return this._hiddenData;
    }
    /**
     * @param {?} gtsFilter
     * @return {?}
     */
    set gtsFilter(gtsFilter) {
        this._gtsFilter = gtsFilter;
        if (this._gtsFilter.slice(1) !== '') {
            this.setState(new RegExp(this._gtsFilter.slice(1), 'gi').test(GTSLib.serializeGtsMetadata(this._node.gts)));
        }
        else {
            this.setState(true);
        }
    }
    /**
     * @return {?}
     */
    get gtsFilter() {
        return this._gtsFilter;
    }
    /**
     * @param {?} kbdLastKeyPressed
     * @return {?}
     */
    set kbdLastKeyPressed(kbdLastKeyPressed) {
        this._kbdLastKeyPressed = kbdLastKeyPressed;
        if (kbdLastKeyPressed[0] === 'a') {
            this.setState(true);
        }
        if (kbdLastKeyPressed[0] === 'n') {
            this.setState(false);
        }
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this._node = Object.assign({}, this.node, { selected: this.hiddenData.indexOf(this.node.gts.id) === -1 });
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        if (this.gtsFilter.slice(1) !== '' && new RegExp(this.gtsFilter.slice(1), 'gi').test(GTSLib.serializeGtsMetadata(this._node.gts))
            || this.hiddenData.indexOf(this._node.gts.id) > -1) {
            this.setState(false);
        }
        this.colorizeChip();
    }
    /**
     * @private
     * @return {?}
     */
    colorizeChip() {
        if (this.chip) {
            if (this._node.selected && this.chip.nativeElement) {
                /** @type {?} */
                const c = ColorLib.getColor(this._node.gts.id, this.options.scheme);
                /** @type {?} */
                const color = (this.param || { datasetColor: c }).datasetColor || c;
                this.chip.nativeElement.style.setProperty('background-color', ColorLib.transparentize(color));
                this.chip.nativeElement.style.setProperty('border-color', color);
            }
            else {
                this.chip.nativeElement.style.setProperty('background-color', '#eeeeee');
            }
            this.refreshCounter++;
        }
    }
    /**
     * @param {?} obj
     * @return {?}
     */
    toArray(obj) {
        if (obj === undefined) {
            return [];
        }
        return Object.keys(obj).map((/**
         * @param {?} key
         * @return {?}
         */
        key => ({ name: key, value: obj[key] })));
    }
    /**
     * @param {?} event
     * @return {?}
     */
    switchPlotState(event) {
        event.preventDefault();
        this.setState(!this._node.selected);
        return false;
    }
    /**
     * @private
     * @param {?} state
     * @return {?}
     */
    setState(state) {
        if (this._node && this._node.gts) {
            this._node = Object.assign({}, this._node, { selected: state, label: GTSLib.serializeGtsMetadata(this._node.gts) });
            this.LOG.debug(['switchPlotState'], this._node);
            this.colorizeChip();
            this.warpViewSelectedGTS.emit(this._node);
        }
    }
}
WarpViewChipComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-chip',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div>\n   <span (click)=\"switchPlotState($event)\" *ngIf=\"_node && _node.gts && _node.gts.l\">\n     <i class=\"normal\" #chip></i>\n     <span class=\"gtsInfo\">\n       <span class='gts-classname'>&nbsp; {{_node.gts.c}}</span>\n       <span class='gts-separator'>&#x007B; </span>\n       <span *ngFor=\"let label of toArray(_node.gts.l); index as index; last as last\">\n         <span class='gts-labelname'>{{label.name}}</span>\n         <span class='gts-separator'>=</span>\n         <span class='gts-labelvalue'>{{label.value}}</span>\n         <span [hidden]=\"last\">, </span>\n       </span>\n       <span class=\"gts-separator\"> &#x007D; </span>\n         <span class='gts-separator'>&#x007B; </span>\n         <span *ngFor=\"let label of toArray(_node.gts.a); index as index; last as last\">\n           <span class='gts-attrname'>{{label.name}}</span>\n           <span class='gts-separator'>=</span>\n           <span class='gts-attrvalue'>{{label.value}}</span>\n           <span [hidden]=\"last\">, </span>\n         </span>\n       <span class=\"gts-separator\"> &#x007D;</span>\n       </span>\n   </span>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}:host div span{cursor:pointer}:host .normal{border-radius:50%;background-color:#bbb;display:inline-block;width:5px;height:5px;border:2px solid #454545;margin-top:auto;margin-bottom:auto;vertical-align:middle;cursor:pointer}"]
            }] }
];
/** @nocollapse */
WarpViewChipComponent.ctorParameters = () => [];
WarpViewChipComponent.propDecorators = {
    chip: [{ type: ViewChild, args: ['chip', { static: false },] }],
    name: [{ type: Input, args: ['name',] }],
    node: [{ type: Input, args: ['node',] }],
    param: [{ type: Input, args: ['param',] }],
    options: [{ type: Input, args: ['options',] }],
    debug: [{ type: Input, args: ['debug',] }],
    hiddenData: [{ type: Input, args: ['hiddenData',] }],
    gtsFilter: [{ type: Input, args: ['gtsFilter',] }],
    kbdLastKeyPressed: [{ type: Input, args: ['kbdLastKeyPressed',] }],
    warpViewSelectedGTS: [{ type: Output, args: ['warpViewSelectedGTS',] }]
};
if (false) {
    /** @type {?} */
    WarpViewChipComponent.prototype.chip;
    /** @type {?} */
    WarpViewChipComponent.prototype.name;
    /** @type {?} */
    WarpViewChipComponent.prototype.node;
    /** @type {?} */
    WarpViewChipComponent.prototype.param;
    /** @type {?} */
    WarpViewChipComponent.prototype.options;
    /** @type {?} */
    WarpViewChipComponent.prototype.warpViewSelectedGTS;
    /**
     * @type {?}
     * @private
     */
    WarpViewChipComponent.prototype.LOG;
    /**
     * @type {?}
     * @private
     */
    WarpViewChipComponent.prototype.refreshCounter;
    /**
     * @type {?}
     * @private
     */
    WarpViewChipComponent.prototype._gtsFilter;
    /**
     * @type {?}
     * @private
     */
    WarpViewChipComponent.prototype._debug;
    /**
     * @type {?}
     * @private
     */
    WarpViewChipComponent.prototype._kbdLastKeyPressed;
    /**
     * @type {?}
     * @private
     */
    WarpViewChipComponent.prototype._hiddenData;
    /** @type {?} */
    WarpViewChipComponent.prototype._node;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *
 */
class WarpViewImageComponent extends WarpViewComponent {
    /**
     * @param {?} el
     * @param {?} renderer
     * @param {?} sizeService
     * @param {?} ngZone
     */
    constructor(el, renderer, sizeService, ngZone) {
        super(el, renderer, sizeService, ngZone);
        this.el = el;
        this.renderer = renderer;
        this.sizeService = sizeService;
        this.ngZone = ngZone;
        this.imageTitle = '';
        this.parentWidth = -1;
        this.LOG = new Logger(WarpViewImageComponent, this._debug);
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.LOG.debug(['ngAfterViewInit'], this._options);
        this.drawChart();
    }
    /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    update(options, refresh) {
        this.drawChart();
    }
    /**
     * @return {?}
     */
    onResize() {
        if (this.el.nativeElement.parentElement.clientWidth !== this.parentWidth || this.parentWidth <= 0) {
            this.parentWidth = this.el.nativeElement.parentElement.clientWidth;
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout((/**
             * @return {?}
             */
            () => {
                if (this.el.nativeElement.parentElement.clientWidth > 0) {
                    this.LOG.debug(['onResize'], this.el.nativeElement.parentElement.clientWidth);
                    this.drawChart();
                }
                else {
                    this.onResize();
                }
            }), 150);
        }
    }
    /**
     * @private
     * @return {?}
     */
    drawChart() {
        if (!this._data || !this._data.data || this._data.data.length === 0) {
            return;
        }
        this.initChart(this.el);
        this.toDisplay = [];
        /** @type {?} */
        let gts = this._data;
        this.LOG.debug(['drawChart', 'gts'], gts);
        if (typeof gts === 'string') {
            try {
                gts = JSON.parse((/** @type {?} */ (gts)));
            }
            catch (error) {
                // empty : it's a base64 string
            }
        }
        if (gts.data && gts.data.length > 0 && GTSLib.isEmbeddedImage(gts.data[0])) {
            this._options = (/** @type {?} */ (ChartLib.mergeDeep(this._options, gts.globalParams || {})));
            this.toDisplay.push(gts.data[0]);
        }
        else if (gts.data && GTSLib.isEmbeddedImage(gts.data)) {
            this.toDisplay.push((/** @type {?} */ (gts.data)));
        }
        this.LOG.debug(['drawChart', 'this.data', 'this.toDisplay'], this.data, this.toDisplay);
        this.loading = false;
        this.chartDraw.emit();
    }
    /**
     * @return {?}
     */
    getStyle() {
        this.LOG.debug(['getStyle'], this._options);
        if (!this._options) {
            return {};
        }
        else {
            /** @type {?} */
            const style = { 'background-color': this._options.bgColor || 'transparent', width: this.width, height: 'auto' };
            if (this._options.fontColor) {
                style.color = this._options.fontColor;
            }
            this.LOG.debug(['getStyle', 'style'], style);
            return style;
        }
    }
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    convert(data) {
        return [];
    }
}
WarpViewImageComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-image',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div class=\"chart-container\" id=\"wrapper\" *ngIf=\"toDisplay\">\n    <div *ngFor=\"let img of toDisplay\" [ngStyle]=\"getStyle()\">\n      <img [src]=\"img\" class=\"responsive\" alt=\"Result\"/>\n    </div>\n  </div>\n  <warpview-spinner *ngIf=\"!toDisplay\" message=\"Parsing data\"></warpview-spinner>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host div{height:var(--warp-view-chart-height);width:var(--warp-view-chart-width)}:host .chart-container{width:var(--warp-view-chart-width,100%);height:var(--warp-view-chart-height,100%);position:relative;overflow:hidden}:host .chart-container div{height:99%!important;width:99%;display:block}:host .chart-container div .responsive{width:99%;height:99%;-o-object-fit:scale-down;object-fit:scale-down}"]
            }] }
];
/** @nocollapse */
WarpViewImageComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: SizeService },
    { type: NgZone }
];
WarpViewImageComponent.propDecorators = {
    imageTitle: [{ type: Input, args: ['imageTitle',] }],
    onResize: [{ type: HostListener, args: ['window:resize',] }]
};
if (false) {
    /** @type {?} */
    WarpViewImageComponent.prototype.imageTitle;
    /** @type {?} */
    WarpViewImageComponent.prototype.toDisplay;
    /**
     * @type {?}
     * @private
     */
    WarpViewImageComponent.prototype.resizeTimer;
    /**
     * @type {?}
     * @private
     */
    WarpViewImageComponent.prototype.parentWidth;
    /** @type {?} */
    WarpViewImageComponent.prototype.el;
    /** @type {?} */
    WarpViewImageComponent.prototype.renderer;
    /** @type {?} */
    WarpViewImageComponent.prototype.sizeService;
    /** @type {?} */
    WarpViewImageComponent.prototype.ngZone;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class MapLib {
    /**
     * @param {?} data
     * @param {?} hiddenData
     * @param {?=} divider
     * @param {?=} scheme
     * @return {?}
     */
    static toLeafletMapPaths(data, hiddenData, divider = 1000, scheme) {
        /** @type {?} */
        const paths = [];
        /** @type {?} */
        const size = (data.gts || []).length;
        for (let i = 0; i < size; i++) {
            /** @type {?} */
            const gts = data.gts[i];
            if (GTSLib.isGtsToPlotOnMap(gts) && (hiddenData || []).filter((/**
             * @param {?} id
             * @return {?}
             */
            id => id === gts.id)).length === 0) {
                /** @type {?} */
                const path = {};
                path.path = MapLib.gtsToPath(gts, divider);
                if (data.params && data.params[i] && data.params[i].key) {
                    path.key = data.params[i].key;
                }
                else {
                    path.key = GTSLib.serializeGtsMetadata(gts);
                }
                if (data.params && data.params[i] && data.params[i].color) {
                    path.color = data.params[i].color;
                }
                else {
                    path.color = ColorLib.getColor(i, scheme);
                }
                paths.push(path);
            }
        }
        return paths;
    }
    /**
     * @param {?} gts
     * @param {?=} divider
     * @return {?}
     */
    static gtsToPath(gts, divider = 1000) {
        /** @type {?} */
        const path = [];
        /** @type {?} */
        const size = (gts.v || []).length;
        for (let i = 0; i < size; i++) {
            /** @type {?} */
            const v = gts.v[i];
            /** @type {?} */
            const l = v.length;
            if (l >= 4) {
                // timestamp, lat, lon, elev?, value
                path.push({ ts: Math.floor(v[0] / divider), lat: v[1], lon: v[2], val: v[l - 1] });
            }
        }
        return path;
    }
    /**
     * @param {?} data
     * @param {?} hiddenData
     * @param {?=} divider
     * @param {?=} scheme
     * @return {?}
     */
    static annotationsToLeafletPositions(data, hiddenData, divider = 1000, scheme) {
        /** @type {?} */
        const annotations = [];
        /** @type {?} */
        const size = (data.gts || []).length;
        for (let i = 0; i < size; i++) {
            /** @type {?} */
            const gts = data.gts[i];
            if (GTSLib.isGtsToAnnotate(gts) && (hiddenData || []).filter((/**
             * @param {?} id
             * @return {?}
             */
            id => id === gts.id)).length === 0) {
                this.LOG.debug(['annotationsToLeafletPositions'], gts);
                /** @type {?} */
                const annotation = {};
                /** @type {?} */
                let params = (data.params || [])[i];
                if (!params) {
                    params = {};
                }
                annotation.path = MapLib.gtsToPath(gts, divider);
                MapLib.extractCommonParameters(annotation, params, i, scheme);
                if (params.render) {
                    annotation.render = params.render;
                }
                if (annotation.render === 'marker') {
                    annotation.marker = (data.params && data.params[i]) ? data.params[i].marker : 'circle';
                }
                if (annotation.render === 'weightedDots') {
                    MapLib.validateWeightedDotsPositionArray(annotation, params);
                }
                this.LOG.debug(['annotationsToLeafletPositions', 'annotations'], annotation);
                annotations.push(annotation);
            }
        }
        return annotations;
    }
    /**
     * @private
     * @param {?} obj
     * @param {?} params
     * @param {?} index
     * @param {?} scheme
     * @return {?}
     */
    static extractCommonParameters(obj, params, index, scheme) {
        params = params || {};
        obj.key = params.key || '';
        obj.color = params.color || ColorLib.getColor(index, scheme);
        obj.borderColor = params.borderColor || '#000';
        obj.properties = params.properties || {};
        if (params.baseRadius === undefined
            || isNaN(parseInt(params.baseRadius, 10))
            || parseInt(params.baseRadius, 10) < 0) {
            obj.baseRadius = MapLib.BASE_RADIUS;
        }
        else {
            obj.baseRadius = params.baseRadius;
        }
    }
    /**
     * @private
     * @param {?} posArray
     * @param {?} params
     * @return {?}
     */
    static validateWeightedDotsPositionArray(posArray, params) {
        if (params.minValue === undefined || params.maxValue === undefined) {
            MapLib.LOG.error(['validateWeightedDotsPositionArray'], 'When using \'weightedDots\' or ' +
                '\'weightedColoredDots\' rendering, \'maxValue\' and \'minValue\' parameters are compulsory');
            posArray.render = undefined;
            return;
        }
        posArray.maxValue = params.maxValue;
        posArray.minValue = params.minValue;
        if (typeof posArray.minValue !== 'number' ||
            typeof posArray.maxValue !== 'number' ||
            posArray.minValue >= posArray.maxValue) {
            MapLib.LOG.error(['validateWeightedDotsPositionArray'], 'When using \'weightedDots\' or ' +
                '\'weightedColoredDots\' rendering, \'maxValue\' and \'minValue\' must be numbers and \'maxValue\' ' +
                'must be greater than \'minValue\'');
            posArray.render = undefined;
            return;
        }
        if (!GTSLib.isPositionsArrayWithValues(posArray) && !GTSLib.isPositionsArrayWithTwoValues(posArray)) {
            MapLib.LOG.error(['validateWeightedDotsPositionArray'], 'When using \'weightedDots\' or ' +
                '\'weightedColoredDots\' rendering, positions must have an associated value');
            posArray.render = undefined;
            return;
        }
        if (params.numSteps === undefined || isNaN(parseInt(params.numSteps, 10)) || parseInt(params.numSteps, 10) < 0) {
            posArray.numSteps = 5;
        }
        else {
            posArray.numSteps = params.numSteps;
        }
        /** @type {?} */
        const step = (posArray.maxValue - posArray.minValue) / posArray.numSteps;
        /** @type {?} */
        const steps = [];
        for (let i = 0; i < posArray.numSteps - 1; i++) {
            steps[i] = posArray.minValue + (i + 1) * step;
        }
        steps[posArray.numSteps - 1] = posArray.maxValue;
        /** @type {?} */
        const size = (posArray || []).length;
        for (let i = 0; i < size; i++) {
            /** @type {?} */
            const pos = posArray[i];
            /** @type {?} */
            const value = pos[2];
            pos[4] = posArray.numSteps - 1;
            for (const k in steps) {
                if (value <= steps[k]) {
                    pos[4] = k;
                    break;
                }
            }
        }
        return true;
    }
    /**
     * @param {?} data
     * @param {?} hiddenData
     * @param {?} scheme
     * @return {?}
     */
    static toLeafletMapPositionArray(data, hiddenData, scheme) {
        /** @type {?} */
        const positions = [];
        /** @type {?} */
        const size = (data.gts || []).length;
        for (let i = 0; i < size; i++) {
            /** @type {?} */
            const gts = data.gts[i];
            if (GTSLib.isPositionArray(gts) && (hiddenData || []).filter((/**
             * @param {?} id
             * @return {?}
             */
            id => id === gts.id)).length === 0) {
                this.LOG.debug(['toLeafletMapPositionArray'], gts, data.params[i]);
                /** @type {?} */
                const posArray = gts;
                /** @type {?} */
                const params = data.params[i] || {};
                MapLib.extractCommonParameters(posArray, params, i, scheme);
                if (params.render !== undefined) {
                    posArray.render = params.render;
                }
                if (posArray.render === 'weightedDots') {
                    MapLib.validateWeightedDotsPositionArray(posArray, params);
                }
                if (posArray.render === 'coloredWeightedDots') {
                    MapLib.validateWeightedColoredDotsPositionArray(posArray, params);
                }
                if (posArray.render === 'marker') {
                    posArray.marker = params.marker;
                }
                this.LOG.debug(['toLeafletMapPositionArray', 'posArray'], posArray);
                positions.push(posArray);
            }
        }
        return positions;
    }
    /**
     * @private
     * @param {?} posArray
     * @param {?} params
     * @return {?}
     */
    static validateWeightedColoredDotsPositionArray(posArray, params) {
        if (!MapLib.validateWeightedDotsPositionArray(posArray, params)) {
            return;
        }
        if (params.minColorValue === undefined ||
            params.maxColorValue === undefined ||
            params.startColor === undefined ||
            params.endColor === undefined) {
            MapLib.LOG.error(['validateWeightedColoredDotsPositionArray'], 'When using ' +
                '\'weightedColoredDots\' rendering, \'maxColorValue\', \'minColorValue\', \'startColor\' ' +
                'and \'endColor\' parameters are compulsory');
            posArray.render = undefined;
            return;
        }
        posArray.maxColorValue = params.maxColorValue;
        posArray.minColorValue = params.minColorValue;
        if (typeof posArray.minColorValue !== 'number' ||
            typeof posArray.maxColorValue !== 'number' ||
            posArray.minColorValue >= posArray.maxColorValue) {
            MapLib.LOG.error(['validateWeightedColoredDotsPositionArray'], ['When using ' +
                    'weightedColoredDots\' rendering, \'maxColorValue\' and \'minColorValue\' must be numbers ' +
                    'and \'maxColorValue\' must be greater than \'minColorValue\'', {
                    maxColorValue: posArray.maxColorValue,
                    minColorValue: posArray.minColorValue,
                }]);
            posArray.render = undefined;
            return;
        }
        /** @type {?} */
        const re = /^#(?:[0-9a-f]{3}){1,2}$/i;
        if (typeof params.startColor !== 'string'
            || typeof params.endColor !== 'string'
            || !re.test(params.startColor)
            || !re.test(params.endColor)) {
            MapLib.LOG.error(['validateWeightedColoredDotsPositionArray'], ['When using ' +
                    'weightedColoredDots\' rendering, \'startColor\' and \'endColor\' parameters must be RGB ' +
                    'colors in #rrggbb format', {
                    startColor: params.startColor,
                    endColor: params.endColor,
                    tests: [
                        typeof params.startColor,
                        typeof params.endColor,
                        re.test(params.startColor),
                        re.test(params.endColor),
                        re.test(params.startColor),
                    ],
                }]);
            posArray.render = undefined;
            return;
        }
        posArray.startColor = {
            r: parseInt(params.startColor.substring(1, 3), 16),
            g: parseInt(params.startColor.substring(3, 5), 16),
            b: parseInt(params.startColor.substring(5, 7), 16),
        };
        posArray.endColor = {
            r: parseInt(params.endColor.substring(1, 3), 16),
            g: parseInt(params.endColor.substring(3, 5), 16),
            b: parseInt(params.endColor.substring(5, 7), 16),
        };
        if (params.numColorSteps === undefined ||
            isNaN(parseInt(params.numColorSteps, 10)) ||
            parseInt(params.numColorSteps, 10) < 0) {
            posArray.numColorSteps = 5;
        }
        else {
            posArray.numColorSteps = params.numColorSteps;
        }
        posArray.colorGradient = ColorLib.hsvGradientFromRgbColors(posArray.startColor, posArray.endColor, posArray.numColorSteps);
        /** @type {?} */
        const step = (posArray.maxColorValue - posArray.minColorValue) / posArray.numColorSteps;
        /** @type {?} */
        const steps = [];
        for (let j = 0; j < posArray.numColorSteps; j++) {
            steps[j] = posArray.minColorValue + (j + 1) * step;
        }
        posArray.steps = steps;
        posArray.positions.forEach((/**
         * @param {?} pos
         * @return {?}
         */
        pos => {
            /** @type {?} */
            const colorValue = pos[3];
            pos[5] = posArray.numColorSteps - 1;
            for (let k = 0; k < steps.length - 1; k++) {
                if (colorValue < steps[k]) {
                    pos[5] = k;
                    break;
                }
            }
        }));
    }
    /**
     * @param {?} paths
     * @param {?} positionsData
     * @param {?} annotationsData
     * @param {?} geoJson
     * @return {?}
     */
    static getBoundsArray(paths, positionsData, annotationsData, geoJson) {
        /** @type {?} */
        const pointsArray = [];
        /** @type {?} */
        let size;
        this.LOG.debug(['getBoundsArray', 'paths'], paths);
        size = (paths || []).length;
        for (let i = 0; i < size; i++) {
            /** @type {?} */
            const path = paths[i];
            /** @type {?} */
            const s = (path.path || []).length;
            for (let j = 0; j < s; j++) {
                /** @type {?} */
                const p = path.path[j];
                pointsArray.push([p.lat, p.lon]);
            }
        }
        this.LOG.debug(['getBoundsArray', 'positionsData'], positionsData);
        size = (positionsData || []).length;
        for (let i = 0; i < size; i++) {
            /** @type {?} */
            const position = positionsData[i];
            /** @type {?} */
            const s = (position.positions || []).length;
            for (let j = 0; j < s; j++) {
                /** @type {?} */
                const p = position.positions[j];
                pointsArray.push([p[0], p[1]]);
            }
        }
        this.LOG.debug(['getBoundsArray', 'annotationsData'], annotationsData);
        size = (annotationsData || []).length;
        for (let i = 0; i < size; i++) {
            /** @type {?} */
            const annotation = annotationsData[i];
            /** @type {?} */
            const s = (annotation.path || []).length;
            for (let j = 0; j < s; j++) {
                /** @type {?} */
                const p = annotation.path[j];
                pointsArray.push([p.lat, p.lon]);
            }
        }
        size = (geoJson || []).length;
        for (let i = 0; i < size; i++) {
            /** @type {?} */
            const g = geoJson[i];
            switch (g.geometry.type) {
                case 'MultiPolygon':
                    g.geometry.coordinates.forEach((/**
                     * @param {?} c
                     * @return {?}
                     */
                    c => c.forEach((/**
                     * @param {?} m
                     * @return {?}
                     */
                    m => m.forEach((/**
                     * @param {?} p
                     * @return {?}
                     */
                    p => pointsArray.push([p[1], p[0]])))))));
                    break;
                case 'Polygon':
                    g.geometry.coordinates.forEach((/**
                     * @param {?} c
                     * @return {?}
                     */
                    c => c.forEach((/**
                     * @param {?} p
                     * @return {?}
                     */
                    p => pointsArray.push([p[1], p[0]])))));
                    break;
                case 'LineString':
                    g.geometry.coordinates.forEach((/**
                     * @param {?} p
                     * @return {?}
                     */
                    p => pointsArray.push([p[1], p[0]])));
                    break;
                case 'Point':
                    pointsArray.push([g.geometry.coordinates[1], g.geometry.coordinates[0]]);
                    break;
            }
        }
        if (pointsArray.length === 1) {
            return pointsArray;
        }
        /** @type {?} */
        let south = 90;
        /** @type {?} */
        let west = -180;
        /** @type {?} */
        let north = -90;
        /** @type {?} */
        let east = 180;
        this.LOG.debug(['getBoundsArray'], pointsArray);
        size = (pointsArray || []).length;
        for (let i = 0; i < size; i++) {
            /** @type {?} */
            const point = pointsArray[i];
            if (point[0] > north) {
                north = point[0];
            }
            if (point[0] < south) {
                south = point[0];
            }
            if (point[1] > west) {
                west = point[1];
            }
            if (point[1] < east) {
                east = point[1];
            }
        }
        return [[south, west], [north, east]];
    }
    /**
     * @param {?} pathData
     * @param {?} options
     * @return {?}
     */
    static pathDataToLeaflet(pathData, options) {
        /** @type {?} */
        const path = [];
        /** @type {?} */
        const firstIndex = ((options === undefined) ||
            (options.from === undefined) ||
            (options.from < 0)) ? 0 : options.from;
        /** @type {?} */
        const lastIndex = ((options === undefined) || (options.to === undefined) || (options.to >= pathData.length)) ?
            pathData.length - 1 : options.to;
        for (let i = firstIndex; i <= lastIndex; i++) {
            path.push([pathData[i].lat, pathData[i].lon]);
        }
        return path;
    }
    /**
     * @param {?} data
     * @return {?}
     */
    static toGeoJSON(data) {
        /** @type {?} */
        const defShapes = ['Point', 'LineString', 'Polygon', 'MultiPolygon'];
        /** @type {?} */
        const geoJsons = [];
        data.gts.forEach((/**
         * @param {?} d
         * @return {?}
         */
        d => {
            if (d.type && d.type === 'Feature' && d.geometry && d.geometry.type && defShapes.indexOf(d.geometry.type) > -1) {
                geoJsons.push(d);
            }
            else if (d.type && defShapes.indexOf(d.type) > -1) {
                geoJsons.push({ type: 'Feature', geometry: d });
            }
        }));
        return geoJsons;
    }
}
MapLib.BASE_RADIUS = 2;
MapLib.LOG = new Logger(MapLib, true);
MapLib.mapTypes = {
    NONE: undefined,
    DEFAULT: {
        link: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    HOT: {
        link: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        attribution: `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles
 style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by
 <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>`
    },
    TOPO: {
        link: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        attribution: `Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors,
 <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>
  (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)`
    },
    TOPO2: {
        link: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        attribution: `Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN,
       GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community`
    },
    SURFER: {
        link: 'https://maps.heigit.org/openmapsurfer/tiles/roads/webmercator/{z}/{x}/{y}.png',
        attribution: `Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of
 Heidelberg</a> | Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`
    },
    HYDRA: {
        link: 'https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png',
        attribution: `Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a>
 &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`
    },
    HYDRA2: {
        link: 'https://{s}.tile.openstreetmap.se/hydda/base/{z}/{x}/{y}.png',
        attribution: `Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a>
 &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`
    },
    TONER: {
        link: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png',
        attribution: `Map tiles by <a href="http://stamen.com">Stamen Design</a>,
 <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy;
  <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`,
        subdomains: 'abcd'
    },
    TONER_LITE: {
        link: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.png',
        attribution: `Map tiles by <a href="http://stamen.com">Stamen Design</a>,
 <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy;
  <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`,
        subdomains: 'abcd',
    },
    TERRAIN: {
        link: 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png',
        attribution: `Map tiles by <a href="http://stamen.com">Stamen Design</a>,
 <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy;
 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`,
        subdomains: 'abcd',
    },
    ESRI: {
        link: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
        attribution: `Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan,
 METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012`
    },
    SATELLITE: {
        link: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: `Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN,
 IGP, UPR-EGP, and the GIS User Community`
    },
    OCEANS: {
        link: 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri',
    },
    GRAY: {
        link: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        attibs: ''
    },
    GRAYSCALE: {
        link: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    },
    WATERCOLOR: {
        link: 'https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg',
        attribution: `Map tiles by <a href="http://stamen.com">Stamen Design</a>,
 <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy;
  <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`,
        subdomains: 'abcd',
    },
    CARTODB: {
        link: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        attribution: `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy;
 <a href="https://carto.com/attributions">CartoDB</a>`,
        subdomains: 'abcd',
    },
    CARTODB_DARK: {
        link: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
        attribution: `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy;
 <a href="https://carto.com/attributions">CartoDB</a>`,
        subdomains: 'abcd',
    },
};
if (false) {
    /** @type {?} */
    MapLib.BASE_RADIUS;
    /**
     * @type {?}
     * @private
     */
    MapLib.LOG;
    /** @type {?} */
    MapLib.mapTypes;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *
 */
class WarpViewMapComponent {
    /**
     * @param {?} el
     * @param {?} sizeService
     * @param {?} renderer
     */
    constructor(el, sizeService, renderer) {
        this.el = el;
        this.sizeService = sizeService;
        this.renderer = renderer;
        this.heatData = [];
        this.responsive = false;
        this.showLegend = true;
        this.width = ChartLib.DEFAULT_WIDTH;
        this.height = ChartLib.DEFAULT_HEIGHT;
        this.change = new EventEmitter();
        this.chartDraw = new EventEmitter();
        this.divider = 1;
        this._options = new Param();
        this._firstDraw = true;
        this._debug = false;
        this.defOptions = ChartLib.mergeDeep(new Param(), {
            map: {
                heatControls: false,
                tiles: [],
                dotsLimit: 1000,
            },
            timeMode: 'date',
            showRangeSelector: true,
            gridLineColor: '#8e8e8e',
            showDots: false,
            timeZone: 'UTC',
            timeUnit: 'us',
            bounds: {}
        });
        this.currentValuesMarkers = [];
        this.annotationsMarkers = [];
        this.positionArraysMarkers = [];
        this._iconAnchor = [20, 52];
        this._popupAnchor = [0, -50];
        this.pathData = [];
        this.annotationsData = [];
        this.positionData = [];
        this.geoJson = [];
        this.firstDraw = true;
        this.finalHeight = 0;
        // Layers
        this.pathDataLayer = Leaflet.featureGroup();
        this.annotationsDataLayer = Leaflet.featureGroup();
        this.positionDataLayer = Leaflet.featureGroup();
        this.tileLayerGroup = Leaflet.featureGroup();
        this.geoJsonLayer = Leaflet.featureGroup();
        this.LOG = new Logger(WarpViewMapComponent, this.debug);
        this.LOG.debug(['constructor'], this.debug);
        this.sizeService.sizeChanged$.subscribe((/**
         * @return {?}
         */
        () => {
            if (this._map) {
                this.resizeMe();
            }
        }));
    }
    /**
     * @param {?} debug
     * @return {?}
     */
    set debug(debug) {
        this._debug = debug;
        this.LOG.setDebug(debug);
    }
    /**
     * @return {?}
     */
    get debug() {
        return this._debug;
    }
    /**
     * @param {?} options
     * @return {?}
     */
    set options(options) {
        this.LOG.debug(['onOptions'], options);
        if (!deepEqual(this._options, options)) {
            /** @type {?} */
            const reZoom = options.map.startZoom !== this._options.map.startZoom
                || options.map.startLat !== this._options.map.startLat
                || options.map.startLong !== this._options.map.startLong;
            this._options = options;
            this.divider = GTSLib.getDivider(this._options.timeUnit);
            this.drawMap(reZoom);
        }
    }
    /**
     * @param {?} data
     * @return {?}
     */
    set data(data) {
        this.LOG.debug(['onData'], data);
        this.currentValuesMarkers = [];
        this.annotationsMarkers = [];
        this.positionArraysMarkers = [];
        if (!!data) {
            this._data = data;
            this.drawMap(true);
        }
    }
    /**
     * @return {?}
     */
    get data() {
        return this._data;
    }
    /**
     * @param {?} hiddenData
     * @return {?}
     */
    set hiddenData(hiddenData) {
        this._hiddenData = hiddenData;
        this.drawMap(false);
    }
    /**
     * @return {?}
     */
    get hiddenData() {
        return this._hiddenData;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this._options = (/** @type {?} */ (ChartLib.mergeDeep(this._options, this.defOptions)));
    }
    /**
     * @return {?}
     */
    resizeMe() {
        this.LOG.debug(['resizeMe'], this.wrapper.nativeElement.parentElement.getBoundingClientRect());
        /** @type {?} */
        let height = this.wrapper.nativeElement.parentElement.getBoundingClientRect().height;
        /** @type {?} */
        const width = this.wrapper.nativeElement.parentElement.getBoundingClientRect().width;
        if (this._options.map.showTimeSlider && this.timeSlider && this.timeSlider.nativeElement) {
            height -= this.timeSlider.nativeElement.getBoundingClientRect().height;
        }
        if (this._options.map.showTimeRange && this.timeRangeSlider && this.timeRangeSlider.nativeElement) {
            height -= this.timeRangeSlider.nativeElement.getBoundingClientRect().height;
        }
        this.finalHeight = height;
        this.renderer.setStyle(this.mapDiv.nativeElement, 'width', 'calc(' + width + 'px - '
            + getComputedStyle(this.wrapper.nativeElement).getPropertyValue('--warp-view-map-margin').trim()
            + ' - '
            + getComputedStyle(this.wrapper.nativeElement).getPropertyValue('--warp-view-map-margin').trim()
            + ')');
        this.renderer.setStyle(this.mapDiv.nativeElement, 'height', 'calc(' + height + 'px - '
            + getComputedStyle(this.wrapper.nativeElement).getPropertyValue('--warp-view-map-margin').trim()
            + ' - '
            + getComputedStyle(this.wrapper.nativeElement).getPropertyValue('--warp-view-map-margin').trim()
            + ')');
        this.width = width;
        this.height = height;
        if (!!this._map) {
            setTimeout((/**
             * @return {?}
             */
            () => this._map.invalidateSize()));
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    heatRadiusDidChange(event) {
        this._heatLayer.setOptions({ radius: event.detail.valueAsNumber });
        this.LOG.debug(['heatRadiusDidChange'], event.detail.valueAsNumber);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    heatBlurDidChange(event) {
        this._heatLayer.setOptions({ blur: event.detail.valueAsNumber });
        this.LOG.debug(['heatBlurDidChange'], event.detail.valueAsNumber);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    heatOpacityDidChange(event) {
        /** @type {?} */
        const minOpacity = event.detail.valueAsNumber / 100;
        this._heatLayer.setOptions({ minOpacity });
        this.LOG.debug(['heatOpacityDidChange'], event.detail.valueAsNumber);
    }
    /**
     * @private
     * @param {?} reZoom
     * @return {?}
     */
    drawMap(reZoom) {
        this.LOG.debug(['drawMap'], this._data);
        this._options = ChartLib.mergeDeep(this._options, this.defOptions);
        this.timeStart = this._options.map.timeStart;
        moment__default.tz.setDefault(this._options.timeZone);
        /** @type {?} */
        let gts = this._data;
        if (!gts) {
            return;
        }
        if (typeof gts === 'string') {
            try {
                gts = JSON.parse((/** @type {?} */ (gts)));
            }
            catch (error) {
                return;
            }
        }
        if (GTSLib.isArray(gts) && gts[0] && (gts[0] instanceof DataModel || gts[0].hasOwnProperty('data'))) {
            gts = gts[0];
        }
        if (!!this._map) {
            this._map.invalidateSize(true);
        }
        /** @type {?} */
        let dataList;
        /** @type {?} */
        let params;
        if (gts.data) {
            dataList = (/** @type {?} */ (gts.data));
            this._options = ChartLib.mergeDeep(gts.globalParams || {}, this._options);
            this.timeSpan = this.timeSpan || this._options.map.timeSpan;
            params = gts.params;
        }
        else {
            dataList = gts;
            params = [];
        }
        this.divider = GTSLib.getDivider(this._options.timeUnit);
        this.LOG.debug(['drawMap'], dataList, this._options, gts.globalParams);
        /** @type {?} */
        const flattenGTS = GTSLib.flatDeep(dataList);
        /** @type {?} */
        const size = flattenGTS.length;
        for (let i = 0; i < size; i++) {
            /** @type {?} */
            const item = flattenGTS[i];
            if (item.v) {
                Timsort.sort(item.v, (/**
                 * @param {?} a
                 * @param {?} b
                 * @return {?}
                 */
                (a, b) => a[0] - b[0]));
                item.i = i;
                i++;
            }
        }
        this.LOG.debug(['GTSLib.flatDeep(dataList)'], flattenGTS);
        this.displayMap({ gts: flattenGTS, params }, reZoom);
    }
    /**
     * @private
     * @param {?} color
     * @param {?=} marker
     * @return {?}
     */
    icon(color, marker = '') {
        /** @type {?} */
        const c = `${color.slice(1)}`;
        /** @type {?} */
        const m = marker !== '' ? marker : 'circle';
        return Leaflet.icon({
            iconUrl: `https://cdn.mapmarker.io/api/v1/font-awesome/v4/pin?icon=fa-${m}&iconSize=17&size=40&hoffset=${m === 'circle' ? 0 : -1}&voffset=-4&color=fff&background=${c}`,
            iconAnchor: this._iconAnchor,
            popupAnchor: this._popupAnchor
        });
    }
    /**
     * @private
     * @return {?}
     */
    patchMapTileGapBug() {
        // Workaround for 1px lines appearing in some browsers due to fractional transforms
        // and resulting anti-aliasing. adapted from @cmulders' solution:
        // https://github.com/Leaflet/Leaflet/issues/3575#issuecomment-150544739
        // @ts-ignore
        /** @type {?} */
        const originalInitTile = Leaflet.GridLayer.prototype._initTile;
        if (originalInitTile.isPatched) {
            return;
        }
        Leaflet.GridLayer.include({
            /**
             * @param {?} tile
             * @return {?}
             */
            _initTile(tile) {
                originalInitTile.call(this, tile);
                /** @type {?} */
                const tileSize = this.getTileSize();
                tile.style.width = tileSize.x + 1.5 + 'px';
                tile.style.height = tileSize.y + 1 + 'px';
            }
        });
        // @ts-ignore
        Leaflet.GridLayer.prototype._initTile.isPatched = true;
    }
    /**
     * @private
     * @param {?} data
     * @param {?=} reDraw
     * @return {?}
     */
    displayMap(data, reDraw = false) {
        this.currentValuesMarkers = [];
        this.LOG.debug(['drawMap'], data, this._options, this._hiddenData || []);
        if (!this.lowerTimeBound) {
            this.lowerTimeBound = this._options.map.timeSliderMin / this.divider;
            this.upperTimeBound = this._options.map.timeSliderMax / this.divider;
        }
        /** @type {?} */
        let height = this.height || ChartLib.DEFAULT_HEIGHT;
        /** @type {?} */
        const width = this.width || ChartLib.DEFAULT_WIDTH;
        if (this.responsive && this.finalHeight === 0) {
            this.resizeMe();
        }
        else {
            if (this._options.map.showTimeSlider && this.timeSlider && this.timeSlider.nativeElement) {
                height -= this.timeSlider.nativeElement.getBoundingClientRect().height;
            }
            if (this._options.map.showTimeRange && this.timeRangeSlider && this.timeRangeSlider.nativeElement) {
                height -= this.timeRangeSlider.nativeElement.getBoundingClientRect().height;
            }
        }
        this.width = width;
        this.height = height;
        if (data.gts.length === 0) {
            return;
        }
        this.pathData = MapLib.toLeafletMapPaths(data, this._hiddenData || [], this.divider, this._options.scheme) || [];
        this.annotationsData = MapLib.annotationsToLeafletPositions(data, this._hiddenData, this.divider, this._options.scheme) || [];
        this.positionData = MapLib.toLeafletMapPositionArray(data, this._hiddenData || [], this._options.scheme) || [];
        this.geoJson = MapLib.toGeoJSON(data);
        this.LOG.debug(['displayMap'], this.pathData, this.annotationsData, this.positionData);
        if (this._options.map.mapType !== 'NONE') {
            /** @type {?} */
            const map = MapLib.mapTypes[this._options.map.mapType || 'DEFAULT'];
            /** @type {?} */
            const mapOpts = {
                maxZoom: 24,
                maxNativeZoom: 19,
            };
            if (map.attribution) {
                mapOpts.attribution = map.attribution;
            }
            if (map.subdomains) {
                mapOpts.subdomains = map.subdomains;
            }
            this.tilesLayer = Leaflet.tileLayer(map.link, mapOpts);
        }
        if (!!this._map) {
            this.LOG.debug(['displayMap'], 'map exists');
            this.pathDataLayer.clearLayers();
            this.annotationsDataLayer.clearLayers();
            this.positionDataLayer.clearLayers();
            this.geoJsonLayer.clearLayers();
            this.tileLayerGroup.clearLayers();
        }
        else {
            this.LOG.debug(['displayMap'], 'build map');
            this._map = Leaflet.map(this.mapDiv.nativeElement, {
                preferCanvas: true,
                layers: [this.tileLayerGroup, this.geoJsonLayer, this.pathDataLayer, this.annotationsDataLayer, this.positionDataLayer],
                zoomAnimation: true,
                maxZoom: 24
            });
            this.tilesLayer.addTo(this._map);
            this.LOG.debug(['displayMap'], 'build map', this.tilesLayer);
            this.geoJsonLayer.bringToBack();
            this.tilesLayer.bringToBack(); // TODO: tester
            this._map.on('load', (/**
             * @return {?}
             */
            () => this.LOG.debug(['displayMap', 'load'], this._map.getCenter().lng, this.currentLong, this._map.getZoom())));
            this._map.on('zoomend', (/**
             * @return {?}
             */
            () => {
                if (!this.firstDraw) {
                    this.LOG.debug(['moveend'], this._map.getCenter());
                    this.currentZoom = this._map.getZoom();
                }
            }));
            this._map.on('moveend', (/**
             * @return {?}
             */
            () => {
                if (!this.firstDraw) {
                    this.LOG.debug(['moveend'], this._map.getCenter());
                    this.currentLat = this._map.getCenter().lat;
                    this.currentLong = this._map.getCenter().lng;
                }
            }));
        }
        /** @type {?} */
        let size = (this.pathData || []).length;
        this.LOG.debug(['displayMap'], 'build map done', size);
        for (let i = 0; i < size; i++) {
            /** @type {?} */
            const d = this.pathData[i];
            if (!!d) {
                /** @type {?} */
                const plottedGts = this.updateGtsPath(d);
                if (!!plottedGts) {
                    this.currentValuesMarkers.push(plottedGts.beforeCurrentValue);
                    this.currentValuesMarkers.push(plottedGts.afterCurrentValue);
                    this.currentValuesMarkers.push(plottedGts.currentValue);
                }
            }
        }
        this.LOG.debug(['displayMap'], 'this.pathData', this.pathData);
        size = (this.annotationsData || []).length;
        for (let i = 0; i < size; i++) {
            /** @type {?} */
            const d = this.annotationsData[i];
            /** @type {?} */
            const plottedGts = this.updateGtsPath(d);
            if (!!plottedGts) {
                if (d.render === 'line') {
                    this.currentValuesMarkers.push(plottedGts.beforeCurrentValue);
                    this.currentValuesMarkers.push(plottedGts.afterCurrentValue);
                }
                this.currentValuesMarkers.push(plottedGts.currentValue);
            }
        }
        if (!!this._map) {
            this.pathDataLayer = Leaflet.featureGroup(this.currentValuesMarkers || []).addTo(this._map);
        }
        this.LOG.debug(['displayMap', 'annotationsMarkers'], this.annotationsMarkers);
        this.LOG.debug(['displayMap', 'this.hiddenData'], this.hiddenData);
        this.LOG.debug(['displayMap', 'this.positionData'], this.positionData);
        // Create the positions arrays
        size = (this.positionData || []).length;
        for (let i = 0; i < size; i++) {
            /** @type {?} */
            const d = this.positionData[i];
            this.positionArraysMarkers = this.positionArraysMarkers.concat(this.updatePositionArray(d));
        }
        this.LOG.debug(['displayMap'], 'this.po sitionData');
        size = (this.annotationsData || []).length;
        for (let i = 0; i < size; i++) {
            /** @type {?} */
            const d = this.annotationsData[i];
            this.positionArraysMarkers = this.positionArraysMarkers.concat(this.updateAnnotation(d));
        }
        this.LOG.debug(['displayMap'], 'this.annotationsData');
        (this._options.map.tiles || []).forEach((/**
         * @param {?} t
         * @return {?}
         */
        (t) => {
            this.LOG.debug(['displayMap'], t);
            if (this._options.map.showTimeRange) {
                this.tileLayerGroup.addLayer(Leaflet.tileLayer(t
                    .replace('{start}', moment__default(this.timeStart).toISOString())
                    .replace('{end}', moment__default(this.timeEnd).toISOString()), {
                    subdomains: 'abcd',
                    maxNativeZoom: 19,
                    maxZoom: 40
                }));
            }
            else {
                this.tileLayerGroup.addLayer(Leaflet.tileLayer(t, {
                    subdomains: 'abcd',
                    maxNativeZoom: 19,
                    maxZoom: 40
                }));
            }
        }));
        this.LOG.debug(['displayMap'], 'this.tiles');
        this.LOG.debug(['displayMap', 'positionArraysMarkers'], this.positionArraysMarkers);
        this.LOG.debug(['displayMap', 'annotationsMarkers'], this.annotationsMarkers);
        size = (this.positionArraysMarkers || []).length;
        for (let i = 0; i < size; i++) {
            /** @type {?} */
            const m = this.positionArraysMarkers[i];
            m.addTo(this.positionDataLayer);
        }
        size = (this.annotationsMarkers || []).length;
        for (let i = 0; i < size; i++) {
            /** @type {?} */
            const m = this.annotationsMarkers[i];
            m.addTo(this.annotationsDataLayer);
        }
        this.LOG.debug(['displayMap', 'geoJson'], this.geoJson);
        size = (this.geoJson || []).length;
        for (let i = 0; i < size; i++) {
            /** @type {?} */
            const m = this.geoJson[i];
            /** @type {?} */
            const color = ColorLib.getColor(i, this._options.scheme);
            /** @type {?} */
            const opts = (/** @type {?} */ ({
                style: (/**
                 * @return {?}
                 */
                () => ({
                    color: (data.params && data.params[i]) ? data.params[i].color || color : color,
                    fillColor: (data.params && data.params[i])
                        ? ColorLib.transparentize(data.params[i].fillColor || color)
                        : ColorLib.transparentize(color),
                }))
            }));
            if (m.geometry.type === 'Point') {
                opts.pointToLayer = (/**
                 * @param {?} geoJsonPoint
                 * @param {?} latlng
                 * @return {?}
                 */
                (geoJsonPoint, latlng) => Leaflet.marker(latlng, {
                    icon: this.icon(color, (data.params && data.params[i]) ? data.params[i].marker : 'circle'),
                    opacity: 1,
                }));
            }
            /** @type {?} */
            let display = '';
            /** @type {?} */
            const geoShape = Leaflet.geoJSON(m, opts);
            if (m.properties) {
                Object.keys(m.properties).forEach((/**
                 * @param {?} k
                 * @return {?}
                 */
                k => display += `<b>${k}</b>: ${m.properties[k]}<br />`));
                geoShape.bindPopup(display);
            }
            geoShape.addTo(this.geoJsonLayer);
        }
        if (this.pathData.length > 0 || this.positionData.length > 0 || this.annotationsData.length > 0 || this.geoJson.length > 0) {
            // Fit map to curves
            /** @type {?} */
            const group = Leaflet.featureGroup([this.geoJsonLayer, this.annotationsDataLayer, this.positionDataLayer, this.pathDataLayer]);
            this.LOG.debug(['displayMap', 'setView'], 'fitBounds', group.getBounds());
            this.LOG.debug(['displayMap', 'setView'], { lat: this.currentLat, lng: this.currentLong }, {
                lat: this._options.map.startLat,
                lng: this._options.map.startLong
            });
            this.bounds = group.getBounds();
            setTimeout((/**
             * @return {?}
             */
            () => {
                if (!!this.bounds && this.bounds.isValid()) {
                    if ((this.currentLat || this._options.map.startLat) && (this.currentLong || this._options.map.startLong)) {
                        this._map.setView({
                            lat: this.currentLat || this._options.map.startLat || 0,
                            lng: this.currentLong || this._options.map.startLong || 0
                        }, this.currentZoom || this._options.map.startZoom || 10, { animate: false, duration: 500 });
                    }
                    else {
                        this._map.fitBounds(this.bounds, { padding: [1, 1], animate: false, duration: 0 });
                        //   this.currentZoom = this._map.getBoundsZoom(this.bounds, false);
                    }
                    this.currentLat = this._map.getCenter().lat;
                    this.currentLong = this._map.getCenter().lng;
                    //  this.currentZoom = this._map.getZoom();
                }
                else {
                    this.LOG.debug(['displayMap', 'setView'], { lat: this.currentLat, lng: this.currentLong });
                    this._map.setView({
                        lat: this.currentLat || this._options.map.startLat || 0,
                        lng: this.currentLong || this._options.map.startLong || 0
                    }, this.currentZoom || this._options.map.startZoom || 10, {
                        animate: false,
                        duration: 500
                    });
                }
            }), 10);
        }
        else {
            this.LOG.debug(['displayMap', 'lost'], 'lost', this.currentZoom, this._options.map.startZoom);
            this._map.setView([
                this.currentLat || this._options.map.startLat || 0,
                this.currentLong || this._options.map.startLong || 0
            ], this.currentZoom || this._options.map.startZoom || 2, {
                animate: false,
                duration: 0
            });
        }
        if (this.heatData && this.heatData.length > 0) {
            this._heatLayer = ((/** @type {?} */ (Leaflet))).heatLayer(this.heatData, {
                radius: this._options.map.heatRadius,
                blur: this._options.map.heatBlur,
                minOpacity: this._options.map.heatOpacity
            });
            this._heatLayer.addTo(this._map);
        }
        this.firstDraw = false;
        this.resizeMe();
        this.patchMapTileGapBug();
        this.chartDraw.emit(true);
    }
    /**
     * @param {?} gts
     * @return {?}
     */
    updateAnnotation(gts) {
        /** @type {?} */
        const positions = [];
        /** @type {?} */
        let icon;
        /** @type {?} */
        let size;
        switch (gts.render) {
            case 'marker':
                icon = this.icon(gts.color, gts.marker);
                size = (gts.path || []).length;
                for (let i = 0; i < size; i++) {
                    /** @type {?} */
                    const g = gts.path[i];
                    /** @type {?} */
                    const marker = Leaflet.marker(g, { icon, opacity: 1 });
                    marker.bindPopup(g.val.toString());
                    positions.push(marker);
                }
                break;
            case 'weightedDots':
                size = (gts.path || []).length;
                for (let i = 0; i < size; i++) {
                    /** @type {?} */
                    const p = gts.path[i];
                    if ((this._hiddenData || []).filter((/**
                     * @param {?} h
                     * @return {?}
                     */
                    h => h === gts.key)).length === 0) {
                        /** @type {?} */
                        let v = parseInt(p.val, 10);
                        if (isNaN(v)) {
                            v = 0;
                        }
                        /** @type {?} */
                        const radius = (v - (gts.minValue || 0)) * 50 / (gts.maxValue || 50);
                        /** @type {?} */
                        const marker = Leaflet.circleMarker(p, {
                            radius: radius === 0 ? 1 : radius,
                            color: gts.borderColor,
                            fillColor: gts.color, fillOpacity: 0.5,
                            weight: 1
                        });
                        this.addPopup(gts, p.val, marker);
                        positions.push(marker);
                    }
                }
                break;
            case 'dots':
            default:
                size = (gts.path || []).length;
                for (let i = 0; i < size; i++) {
                    /** @type {?} */
                    const g = gts.path[i];
                    /** @type {?} */
                    const marker = Leaflet.circleMarker(g, {
                        radius: gts.baseRadius,
                        color: gts.color,
                        fillColor: gts.color,
                        fillOpacity: 1
                    });
                    marker.bindPopup(g.val.toString());
                    positions.push(marker);
                }
                break;
        }
        return positions;
    }
    /**
     * @private
     * @param {?} gts
     * @return {?}
     */
    updateGtsPath(gts) {
        /** @type {?} */
        const beforeCurrentValue = Leaflet.polyline(MapLib.pathDataToLeaflet(gts.path, { to: 0 }), {
            color: gts.color,
            opacity: 1,
        });
        /** @type {?} */
        const afterCurrentValue = Leaflet.polyline(MapLib.pathDataToLeaflet(gts.path, { from: 0 }), {
            color: gts.color,
            opacity: 0.7,
        });
        /** @type {?} */
        let currentValue;
        // Let's verify we have a path... No path, no marker
        /** @type {?} */
        const size = (gts.path || []).length;
        for (let i = 0; i < size; i++) {
            /** @type {?} */
            const p = gts.path[i];
            /** @type {?} */
            let date;
            if (this._options.timeMode && this._options.timeMode === 'timestamp') {
                date = parseInt(p.ts, 10);
            }
            else {
                date = (moment__default(parseInt(p.ts, 10))
                    .utc(true).toISOString() || '')
                    .replace('Z', this._options.timeZone === 'UTC' ? 'Z' : '');
            }
            currentValue = Leaflet.circleMarker([p.lat, p.lon], { radius: MapLib.BASE_RADIUS, color: gts.color, fillColor: gts.color, fillOpacity: 0.7 })
                .bindPopup(`<p>${date}</p><p><b>${gts.key}</b>: ${p.val.toString()}</p>`);
        }
        if (size > 0) {
            return {
                beforeCurrentValue,
                afterCurrentValue,
                currentValue,
            };
        }
        else {
            return undefined;
        }
    }
    /**
     * @private
     * @param {?} positionData
     * @param {?} value
     * @param {?} marker
     * @return {?}
     */
    addPopup(positionData, value, marker) {
        if (!!positionData) {
            /** @type {?} */
            let content = '';
            if (positionData.key) {
                content = `<p><b>${positionData.key}</b>: ${value || 'na'}</p>`;
            }
            Object.keys(positionData.properties || []).forEach((/**
             * @param {?} k
             * @return {?}
             */
            k => content += `<b>${k}</b>: ${positionData.properties[k]}<br />`));
            marker.bindPopup(content);
        }
    }
    /**
     * @private
     * @param {?} positionData
     * @return {?}
     */
    updatePositionArray(positionData) {
        /** @type {?} */
        const positions = [];
        /** @type {?} */
        let polyline;
        /** @type {?} */
        let icon;
        /** @type {?} */
        let result;
        /** @type {?} */
        let inStep;
        /** @type {?} */
        let size;
        this.LOG.debug(['updatePositionArray'], positionData);
        switch (positionData.render) {
            case 'path':
                polyline = Leaflet.polyline(positionData.positions, { color: positionData.color, opacity: 1 });
                positions.push(polyline);
                break;
            case 'marker':
                icon = this.icon(positionData.color, positionData.marker);
                size = (positionData.positions || []).length;
                for (let i = 0; i < size; i++) {
                    /** @type {?} */
                    const p = positionData.positions[i];
                    if ((this.hiddenData || []).filter((/**
                     * @param {?} h
                     * @return {?}
                     */
                    h => h === positionData.key)).length === 0) {
                        /** @type {?} */
                        const marker = Leaflet.marker({ lat: p[0], lng: p[1] }, { icon, opacity: 1 });
                        this.addPopup(positionData, p[2], marker);
                        positions.push(marker);
                    }
                    this.LOG.debug(['updatePositionArray', 'build marker'], icon);
                }
                break;
            case 'coloredWeightedDots':
                this.LOG.debug(['updatePositionArray', 'coloredWeightedDots'], positionData);
                result = [];
                inStep = [];
                for (let j = 0; j < positionData.numColorSteps; j++) {
                    result[j] = 0;
                    inStep[j] = 0;
                }
                size = (positionData.positions || []).length;
                for (let i = 0; i < size; i++) {
                    /** @type {?} */
                    const p = positionData.positions[i];
                    if ((this._hiddenData || []).filter((/**
                     * @param {?} h
                     * @return {?}
                     */
                    h => h === positionData.key)).length === 0) {
                        this.LOG.debug(['updatePositionArray', 'coloredWeightedDots', 'radius'], positionData.baseRadius * p[4]);
                        /** @type {?} */
                        const marker = Leaflet.circleMarker({ lat: p[0], lng: p[1] }, {
                            radius: positionData.baseRadius * (parseInt(p[4], 10) + 1),
                            color: positionData.borderColor,
                            fillColor: ColorLib.rgb2hex(positionData.colorGradient[p[5]].r, positionData.colorGradient[p[5]].g, positionData.colorGradient[p[5]].b),
                            fillOpacity: 0.7,
                        });
                        this.addPopup(positionData, p[2], marker);
                        positions.push(marker);
                    }
                }
                break;
            case 'weightedDots':
                size = (positionData.positions || []).length;
                for (let i = 0; i < size; i++) {
                    /** @type {?} */
                    const p = positionData.positions[i];
                    if ((this._hiddenData || []).filter((/**
                     * @param {?} h
                     * @return {?}
                     */
                    h => h === positionData.key)).length === 0) {
                        /** @type {?} */
                        const marker = Leaflet.circleMarker({ lat: p[0], lng: p[1] }, {
                            radius: positionData.baseRadius * (parseInt(p[4], 10) + 1),
                            color: positionData.borderColor,
                            fillColor: positionData.color, fillOpacity: 0.7,
                        });
                        this.addPopup(positionData, p[2], marker);
                        positions.push(marker);
                    }
                }
                break;
            case 'dots':
            default:
                size = (positionData.positions || []).length;
                for (let i = 0; i < size; i++) {
                    /** @type {?} */
                    const p = positionData.positions[i];
                    if ((this._hiddenData || []).filter((/**
                     * @param {?} h
                     * @return {?}
                     */
                    h => h === positionData.key)).length === 0) {
                        /** @type {?} */
                        const marker = Leaflet.circleMarker({ lat: p[0], lng: p[1] }, {
                            radius: positionData.baseRadius,
                            color: positionData.borderColor,
                            fillColor: positionData.color,
                            fillOpacity: 1,
                        });
                        this.addPopup(positionData, p[2], marker);
                        positions.push(marker);
                    }
                }
                break;
        }
        return positions;
    }
    /**
     * @return {?}
     */
    resize() {
        return new Promise((/**
         * @param {?} resolve
         * @return {?}
         */
        resolve => {
            this.resizeMe();
            resolve(true);
        }));
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onRangeSliderChange(event) {
        this.LOG.debug(['onRangeSliderChange'], event);
        this.timeStart = event.value || moment__default().valueOf();
        this.timeEnd = event.highValue || moment__default().valueOf();
        this.drawMap(true);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onRangeSliderWindowChange(event) {
        this.LOG.debug(['onRangeSliderWindowChange'], event);
        if (this.lowerTimeBound !== event.min || this.upperTimeBound !== event.max) {
            this.lowerTimeBound = event.min;
            this.upperTimeBound = event.max;
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onSliderChange(event) {
        this.LOG.debug(['onSliderChange'], event, moment__default(event.value).toISOString());
        this._firstDraw = false;
        if (this.timeEnd !== event.value) {
            this.timeSpan = this.timeSpan || this._options.map.timeSpan;
            this.timeEnd = event.value || moment__default().valueOf();
            this.timeStart = (event.value || moment__default().valueOf()) - this.timeSpan / this.divider;
            this.LOG.debug(['onSliderChange'], moment__default(this.timeStart).toISOString(), moment__default(this.timeEnd).toISOString());
            this.change.emit(this.timeStart);
            this.drawMap(true);
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    updateTimeSpan(event) {
        this.LOG.debug(['updateTimeSpan'], event.target.value);
        if (this.timeSpan !== event.target.value) {
            this.timeSpan = event.target.value;
            this.timeStart = (this.timeEnd || moment__default().valueOf()) - this.timeSpan / this.divider;
            this.drawMap(true);
        }
    }
}
WarpViewMapComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-map',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"wrapper\" #wrapper (resized)=\"resizeMe()\">\n  <div class=\"map-container\">\n    <div #mapDiv></div>\n    <div *ngIf=\"_options.map.showTimeSlider && !_options.map.showTimeRange\" #timeSlider>\n      <warpview-slider\n        [min]=\"_options.map.timeSliderMin / divider\" [max]=\"_options.map.timeSliderMax / divider\"\n        [value]=\"minTimeValue / divider\"\n        [step]=\"_options.map.timeSliderStep\" [mode]=\"_options.map.timeSliderMode\"\n        (change)=\"onSliderChange($event)\"\n        [debug]=\"debug\"\n      ></warpview-slider>\n    </div>\n    <div *ngIf=\"_options.map.showTimeSlider && _options.map.showTimeRange\" #timeRangeSlider>\n      <!--    <warpview-range-slider *ngIf=\"!_options.map.timeSpan && lowerTimeBound\"\n                                  [min]=\"lowerTimeBound\" [max]=\"upperTimeBound\"\n                                  [minValue]=\"minTimeValue / divider\"\n                                  [maxValue]=\"maxTimeValue / divider\"\n                                  [step]=\"_options.map.timeSliderStep\"\n                                  [mode]=\"_options.map.timeSliderMode\"\n                                  [debug]=\"_debug\"\n                                  (change)=\"onRangeSliderChange($event)\"\n           ></warpview-range-slider>-->\n\n      <warpview-range-slider\n        [min]=\"(_options.map.timeSliderMin / divider)\" [max]=\"(_options.map.timeSliderMax / divider)\"\n        [minValue]=\"minTimeValue / divider\"\n        [maxValue]=\"maxTimeValue / divider\"\n        [mode]=\"_options.map.timeSliderMode\"\n        [debug]=\"debug\"\n        (change)=\"onRangeSliderWindowChange($event)\"\n      ></warpview-range-slider>\n      <warpview-slider *ngIf=\"_options.map.timeSpan && lowerTimeBound\"\n                       [min]=\"lowerTimeBound\" [max]=\"upperTimeBound\"\n                       [step]=\"(this.timeSpan || this._options.map.timeSpan) / divider\"\n                       [mode]=\"_options.map.timeSliderMode\"\n                       [debug]=\"debug\"\n                       (change)=\"onSliderChange($event)\"\n      ></warpview-slider>\n      <div *ngIf=\"_options.map?.timeSpan\">\n        <label for=\"timeSpan\">Timespan: </label>\n        <select id=\"timeSpan\" (change)=\"updateTimeSpan($event)\">\n          <option *ngFor=\"let ts of _options.map.timeSpanList\" [value]=\"ts.value\">{{ts.label}}</option>\n        </select>\n      </div>\n    </div>\n    <warpview-heatmap-sliders\n      *ngIf=\"_options.map.heatControls\"\n      (heatRadiusDidChange)=\"heatRadiusDidChange($event)\"\n      (heatBlurDidChange)=\"heatBlurDidChange($event)\"\n      (heatOpacityDidChange)=\"heatOpacityDidChange($event)\"\n    ></warpview-heatmap-sliders>\n  </div>\n\n</div>\n",
                encapsulation: ViewEncapsulation.None,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host,warp-view-map,warpview-map{width:100%;height:100%;min-height:100px}:host div.wrapper,warp-view-map div.wrapper,warpview-map div.wrapper{width:100%;height:100%;min-height:100px;padding:var(--warp-view-map-margin);overflow:hidden}:host div.wrapper div.leaflet-container,:host div.wrapper div.map-container,warp-view-map div.wrapper div.leaflet-container,warp-view-map div.wrapper div.map-container,warpview-map div.wrapper div.leaflet-container,warpview-map div.wrapper div.map-container{min-width:100%;min-height:100px;width:100%;height:100%;position:relative;overflow:hidden}:host div.wrapper .leaflet-container,warp-view-map div.wrapper .leaflet-container,warpview-map div.wrapper .leaflet-container{min-width:100%;min-height:100%;width:100%;height:100%}"]
            }] }
];
/** @nocollapse */
WarpViewMapComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: SizeService },
    { type: Renderer2 }
];
WarpViewMapComponent.propDecorators = {
    mapDiv: [{ type: ViewChild, args: ['mapDiv', { static: true },] }],
    wrapper: [{ type: ViewChild, args: ['wrapper', { static: true },] }],
    timeSlider: [{ type: ViewChild, args: ['timeSlider', { static: false },] }],
    timeRangeSlider: [{ type: ViewChild, args: ['timeRangeSlider', { static: false },] }],
    heatData: [{ type: Input, args: ['heatData',] }],
    responsive: [{ type: Input, args: ['responsive',] }],
    showLegend: [{ type: Input, args: ['showLegend',] }],
    width: [{ type: Input, args: ['width',] }],
    height: [{ type: Input, args: ['height',] }],
    debug: [{ type: Input, args: ['debug',] }],
    options: [{ type: Input, args: ['options',] }],
    data: [{ type: Input, args: ['data',] }],
    hiddenData: [{ type: Input, args: ['hiddenData',] }],
    change: [{ type: Output, args: ['change',] }],
    chartDraw: [{ type: Output, args: ['chartDraw',] }]
};
if (false) {
    /** @type {?} */
    WarpViewMapComponent.prototype.mapDiv;
    /** @type {?} */
    WarpViewMapComponent.prototype.wrapper;
    /** @type {?} */
    WarpViewMapComponent.prototype.timeSlider;
    /** @type {?} */
    WarpViewMapComponent.prototype.timeRangeSlider;
    /** @type {?} */
    WarpViewMapComponent.prototype.heatData;
    /** @type {?} */
    WarpViewMapComponent.prototype.responsive;
    /** @type {?} */
    WarpViewMapComponent.prototype.showLegend;
    /** @type {?} */
    WarpViewMapComponent.prototype.width;
    /** @type {?} */
    WarpViewMapComponent.prototype.height;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype.bounds;
    /** @type {?} */
    WarpViewMapComponent.prototype.change;
    /** @type {?} */
    WarpViewMapComponent.prototype.chartDraw;
    /** @type {?} */
    WarpViewMapComponent.prototype.currentZoom;
    /** @type {?} */
    WarpViewMapComponent.prototype.currentLat;
    /** @type {?} */
    WarpViewMapComponent.prototype.currentLong;
    /** @type {?} */
    WarpViewMapComponent.prototype.minTimeValue;
    /** @type {?} */
    WarpViewMapComponent.prototype.maxTimeValue;
    /** @type {?} */
    WarpViewMapComponent.prototype.divider;
    /** @type {?} */
    WarpViewMapComponent.prototype.lowerTimeBound;
    /** @type {?} */
    WarpViewMapComponent.prototype.upperTimeBound;
    /** @type {?} */
    WarpViewMapComponent.prototype.timeSpan;
    /** @type {?} */
    WarpViewMapComponent.prototype._options;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype._firstDraw;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype.LOG;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype._data;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype._debug;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype.defOptions;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype._map;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype._hiddenData;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype.currentValuesMarkers;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype.annotationsMarkers;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype.positionArraysMarkers;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype._iconAnchor;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype._popupAnchor;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype._heatLayer;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype.pathData;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype.annotationsData;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype.positionData;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype.geoJson;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype.timeStart;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype.timeEnd;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype.firstDraw;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype.finalHeight;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype.pathDataLayer;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype.annotationsDataLayer;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype.positionDataLayer;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype.tileLayerGroup;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype.geoJsonLayer;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype.tilesLayer;
    /** @type {?} */
    WarpViewMapComponent.prototype.el;
    /** @type {?} */
    WarpViewMapComponent.prototype.sizeService;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype.renderer;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class WarpViewHeatmapSlidersComponent {
    constructor() {
        this.heatRadiusDidChange = new EventEmitter();
        this.heatBlurDidChange = new EventEmitter();
        this.heatOpacityDidChange = new EventEmitter();
    }
    /**
     * @param {?} value
     * @return {?}
     */
    radiusChanged(value) {
        this.heatRadiusDidChange.emit(value);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    blurChanged(value) {
        this.heatBlurDidChange.emit(value);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    opacityChanged(value) {
        this.heatOpacityDidChange.emit(value);
    }
}
WarpViewHeatmapSlidersComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-heatmap-sliders',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div>\n  <div class=\"container\">\n    <div class=\"options\">\n      <label for=\"radius\">Radius </label>\n      <input type=\"number\" id=\"radius\" value=\"25\" min=\"10\" max=\"50\" (click)=\"radiusChanged($event.target)\"/>\n      <br/>\n      <label for=\"blur\">Blur </label>\n      <input type=\"number\" id=\"blur\" value=\"15\" min=\"10\" max=\"50\" (click)=\"blurChanged($event.target)\"/>\n      <br/>\n      <label for=\"opacity\">Opacity </label>\n      <input type=\"number\" id=\"opacity\" value=\"50\" min=\"10\" max=\"100\" (click)=\"opacityChanged($event.target)\"/>\n    </div>\n  </div>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}"]
            }] }
];
WarpViewHeatmapSlidersComponent.propDecorators = {
    radiusValue: [{ type: Input, args: ['radiusValue',] }],
    minRadiusValue: [{ type: Input, args: ['minRadiusValue',] }],
    maxRadiusValue: [{ type: Input, args: ['maxRadiusValue',] }],
    blurValue: [{ type: Input, args: ['blurValue',] }],
    minBlurValue: [{ type: Input, args: ['minBlurValue',] }],
    maxBlurValue: [{ type: Input, args: ['maxBlurValue',] }],
    heatRadiusDidChange: [{ type: Output, args: ['heatRadiusDidChange',] }],
    heatBlurDidChange: [{ type: Output, args: ['heatBlurDidChange',] }],
    heatOpacityDidChange: [{ type: Output, args: ['heatOpacityDidChange',] }]
};
if (false) {
    /** @type {?} */
    WarpViewHeatmapSlidersComponent.prototype.radiusValue;
    /** @type {?} */
    WarpViewHeatmapSlidersComponent.prototype.minRadiusValue;
    /** @type {?} */
    WarpViewHeatmapSlidersComponent.prototype.maxRadiusValue;
    /** @type {?} */
    WarpViewHeatmapSlidersComponent.prototype.blurValue;
    /** @type {?} */
    WarpViewHeatmapSlidersComponent.prototype.minBlurValue;
    /** @type {?} */
    WarpViewHeatmapSlidersComponent.prototype.maxBlurValue;
    /** @type {?} */
    WarpViewHeatmapSlidersComponent.prototype.heatRadiusDidChange;
    /** @type {?} */
    WarpViewHeatmapSlidersComponent.prototype.heatBlurDidChange;
    /** @type {?} */
    WarpViewHeatmapSlidersComponent.prototype.heatOpacityDidChange;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class WarpViewPieComponent extends WarpViewComponent {
    /**
     * @param {?} el
     * @param {?} renderer
     * @param {?} sizeService
     * @param {?} ngZone
     */
    constructor(el, renderer, sizeService, ngZone) {
        super(el, renderer, sizeService, ngZone);
        this.el = el;
        this.renderer = renderer;
        this.sizeService = sizeService;
        this.ngZone = ngZone;
        this.chartDraw = new EventEmitter();
        this._type = 'pie';
        this.layout = {
            showlegend: true,
            legend: {
                orientation: 'h',
                bgcolor: 'transparent',
            },
            orientation: 270,
            margin: {
                t: 10,
                b: 25,
                r: 10,
                l: 10
            }
        };
        this.LOG = new Logger(WarpViewPieComponent, this._debug);
    }
    /**
     * @param {?} type
     * @return {?}
     */
    set type(type) {
        this._type = type;
        this.drawChart();
    }
    /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    update(options, refresh) {
        this.LOG.debug(['onOptions', 'before'], this._options, options);
        if (!deepEqual(options, this._options)) {
            this.LOG.debug(['options', 'changed'], options);
            this._options = (/** @type {?} */ (ChartLib.mergeDeep(this._options, (/** @type {?} */ (options)))));
        }
        this.drawChart();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this._options = this._options || this.defOptions;
    }
    /**
     * @return {?}
     */
    drawChart() {
        if (!this.initChart(this.el)) {
            return;
        }
        this.LOG.debug(['drawChart', 'this.layout'], this.layout);
        this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig);
        this.LOG.debug(['drawChart', 'this.plotlyData'], this.plotlyData);
        this.layout.legend.font = {
            color: this.getCSSColor(this.el.nativeElement, '--warp-view-font-color', '#000')
        };
        this.layout.textfont = {
            color: this.getCSSColor(this.el.nativeElement, '--warp-view-font-color', '#000')
        };
        this.loading = false;
    }
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    convert(data) {
        /** @type {?} */
        const gtsList = (/** @type {?} */ (data.data));
        /** @type {?} */
        const plotData = (/** @type {?} */ ([]));
        this.LOG.debug(['convert', 'gtsList'], gtsList);
        /** @type {?} */
        const pieData = (/** @type {?} */ ({
            values: [],
            labels: [],
            marker: {
                colors: [],
                line: {
                    width: 3,
                    color: [],
                }
            },
            textfont: {
                color: this.getLabelColor(this.el.nativeElement)
            },
            hoverlabel: {
                bgcolor: this.getCSSColor(this.el.nativeElement, '--warp-view-chart-legend-bg', '#000000'),
                bordercolor: 'grey',
                font: {
                    color: this.getCSSColor(this.el.nativeElement, '--warp-view-chart-legend-color', '#ffffff')
                }
            },
            type: 'pie'
        }));
        gtsList.forEach((/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        (d, i) => {
            if (!GTSLib.isGts(d)) {
                /** @type {?} */
                const c = ColorLib.getColor(i, this._options.scheme);
                /** @type {?} */
                const color = ((data.params || [])[i] || { datasetColor: c }).datasetColor || c;
                pieData.values.push(d[1]);
                pieData.labels.push(d[0]);
                pieData.marker.colors.push(ColorLib.transparentize(color));
                pieData.marker.line.color.push(color);
                if (this._type === 'donut') {
                    pieData.hole = 0.5;
                }
                if (this.unit) {
                    pieData.title = {
                        text: this.unit
                    };
                }
            }
        }));
        if (pieData.values.length > 0) {
            plotData.push(pieData);
        }
        this.noData = plotData.length === 0;
        return plotData;
    }
}
WarpViewPieComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-pie',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\" #chartContainer>\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display or wrong data format.</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-plotly #graph *ngIf=\"plotlyData?.length > 0\"\n                     [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot()\"\n                     (relayout)=\"relayout($event)\"\n                     [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                     [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host{display:block;height:100%}:host #chartContainer{height:100%}:host #chartContainer div{height:100%}:host div.chart{width:var(--warp-view-chart-width);height:var(--warp-view-chart-height)}"]
            }] }
];
/** @nocollapse */
WarpViewPieComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: SizeService },
    { type: NgZone }
];
WarpViewPieComponent.propDecorators = {
    type: [{ type: Input, args: ['type',] }],
    chartDraw: [{ type: Output, args: ['chartDraw',] }]
};
if (false) {
    /** @type {?} */
    WarpViewPieComponent.prototype.chartDraw;
    /**
     * @type {?}
     * @private
     */
    WarpViewPieComponent.prototype._type;
    /** @type {?} */
    WarpViewPieComponent.prototype.layout;
    /** @type {?} */
    WarpViewPieComponent.prototype.el;
    /** @type {?} */
    WarpViewPieComponent.prototype.renderer;
    /** @type {?} */
    WarpViewPieComponent.prototype.sizeService;
    /** @type {?} */
    WarpViewPieComponent.prototype.ngZone;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class WarpViewGaugeComponent extends WarpViewComponent {
    // gauge or bullet
    /**
     * @param {?} el
     * @param {?} renderer
     * @param {?} sizeService
     * @param {?} ngZone
     */
    constructor(el, renderer, sizeService, ngZone) {
        super(el, renderer, sizeService, ngZone);
        this.el = el;
        this.renderer = renderer;
        this.sizeService = sizeService;
        this.ngZone = ngZone;
        this.CHART_MARGIN = 0.05;
        // tslint:disable-next-line:variable-name
        this._type = 'gauge'; // gauge or bullet
        this.LOG = new Logger(WarpViewGaugeComponent, this._debug);
    }
    /**
     * @param {?} type
     * @return {?}
     */
    set type(type) {
        this._type = type;
        this.drawChart();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this._options = this._options || this.defOptions;
    }
    /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    update(options, refresh) {
        this.LOG.debug(['onOptions', 'before'], this._options, options);
        if (!deepEqual(options, this._options)) {
            this.LOG.debug(['options', 'changed'], options);
            this._options = (/** @type {?} */ (ChartLib.mergeDeep(this._options, (/** @type {?} */ (options)))));
        }
        this.drawChart();
    }
    /**
     * @return {?}
     */
    drawChart() {
        if (!this.initChart(this.el)) {
            return;
        }
        this.LOG.debug(['drawChart', 'plotlyData'], this.plotlyData, this._type);
        this.layout.autosize = true;
        this.layout.grid = {
            rows: Math.ceil(this.plotlyData.length / 2),
            columns: 2,
            pattern: 'independent',
            xgap: 0.2,
            ygap: 0.2
        };
        this.layout.margin = { t: 25, r: 25, l: 25, b: 25 };
        if (this._type === 'bullet') {
            this.layout.height = this.plotlyData.length * 100;
            ((/** @type {?} */ (this.el.nativeElement))).style.height = this.layout.height + 'px';
            this.layout.margin.l = 300;
            this.layout.yaxis = {
                automargin: true
            };
            this.layout.grid = { rows: this.plotlyData.length, columns: 1, pattern: 'independent' };
        }
        this.loading = false;
    }
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    convert(data) {
        this.LOG.debug(['convert'], data);
        /** @type {?} */
        const gtsList = (/** @type {?} */ (data.data));
        /** @type {?} */
        const dataList = [];
        /** @type {?} */
        let max = Number.MIN_VALUE;
        this.LOG.debug(['convert', 'gtsList'], gtsList);
        if (!gtsList || gtsList.length === 0 || gtsList[0].length < 2) {
            return;
        }
        gtsList.forEach((/**
         * @param {?} d
         * @return {?}
         */
        d => max = Math.max(max, d[1])));
        /** @type {?} */
        let x = 0;
        /** @type {?} */
        let y = -1 / (gtsList.length / 2);
        gtsList.forEach((/**
         * @param {?} gts
         * @param {?} i
         * @return {?}
         */
        (gts, i) => {
            if (i % 2 !== 0) {
                x = 0.5;
            }
            else {
                x = 0;
                y += 1 / (gtsList.length / 2);
            }
            /** @type {?} */
            const c = ColorLib.getColor(gts.id || i, this._options.scheme);
            /** @type {?} */
            const color = ((data.params || [])[i] || { datasetColor: c }).datasetColor || c;
            /** @type {?} */
            const domain = gtsList.length > 1 ? {
                x: [x + this.CHART_MARGIN, x + 0.5 - this.CHART_MARGIN],
                y: [y + this.CHART_MARGIN, y + 1 / (gtsList.length / 2) - this.CHART_MARGIN * 2]
            } : {
                x: [0, 1],
                y: [0, 1]
            };
            if (this._type === 'bullet' || (!!data.params && !!data.params[i].type && data.params[i].type === 'bullet')) {
                domain.x = [this.CHART_MARGIN, 1 - this.CHART_MARGIN];
                domain.y = [(i > 0 ? i / gtsList.length : 0) + this.CHART_MARGIN, (i + 1) / gtsList.length - this.CHART_MARGIN];
            }
            dataList.push({
                domain,
                align: 'left',
                value: gts[1],
                delta: {
                    reference: !!data.params && !!data.params[i].delta ? data.params[i].delta + gts[1] : 0,
                    font: { color: this.getLabelColor(this.el.nativeElement) }
                },
                title: {
                    text: gts[0],
                    align: 'center',
                    font: { color: this.getLabelColor(this.el.nativeElement) }
                },
                number: {
                    font: { color: this.getLabelColor(this.el.nativeElement) }
                },
                type: 'indicator',
                mode: !!data.params && !!data.params[i].delta ? 'number+delta+gauge' : 'gauge+number',
                gauge: {
                    bgcolor: 'transparent',
                    shape: !!data.params && !!data.params[i].type ? data.params[i].type : this._type || 'gauge',
                    bordercolor: this.getGridColor(this.el.nativeElement),
                    axis: {
                        range: [null, max],
                        tickcolor: this.getGridColor(this.el.nativeElement),
                        tickfont: { color: this.getGridColor(this.el.nativeElement) }
                    },
                    bar: {
                        color: ColorLib.transparentize(color),
                        line: {
                            width: 1,
                            color
                        }
                    }
                }
            });
            this.LOG.debug(['convert', 'dataList'], i);
        }));
        this.LOG.debug(['convert', 'dataList'], dataList);
        return dataList;
    }
}
WarpViewGaugeComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-gauge',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\">\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-plotly #graph *ngIf=\"plotlyData?.length > 0\"\n                     [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot()\"\n                     (relayout)=\"relayout($event)\"\n                     [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                     [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host{display:block;height:100%}:host #chartContainer{height:100%}:host #chartContainer div{height:100%}:host div.chart{width:var(--warp-view-chart-width,100%);height:var(--warp-view-chart-height,100%)}"]
            }] }
];
/** @nocollapse */
WarpViewGaugeComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: SizeService },
    { type: NgZone }
];
WarpViewGaugeComponent.propDecorators = {
    type: [{ type: Input, args: ['type',] }]
};
if (false) {
    /**
     * @type {?}
     * @private
     */
    WarpViewGaugeComponent.prototype.CHART_MARGIN;
    /**
     * @type {?}
     * @private
     */
    WarpViewGaugeComponent.prototype._type;
    /** @type {?} */
    WarpViewGaugeComponent.prototype.el;
    /** @type {?} */
    WarpViewGaugeComponent.prototype.renderer;
    /** @type {?} */
    WarpViewGaugeComponent.prototype.sizeService;
    /** @type {?} */
    WarpViewGaugeComponent.prototype.ngZone;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class WarpViewAnnotationComponent extends WarpViewComponent {
    /**
     * @param {?} el
     * @param {?} renderer
     * @param {?} sizeService
     * @param {?} ngZone
     */
    constructor(el, renderer, sizeService, ngZone) {
        super(el, renderer, sizeService, ngZone);
        this.el = el;
        this.renderer = renderer;
        this.sizeService = sizeService;
        this.ngZone = ngZone;
        this.pointHover = new EventEmitter();
        this.warpViewChartResize = new EventEmitter();
        this.chartDraw = new EventEmitter();
        this.boundsDidChange = new EventEmitter();
        this.displayExpander = true;
        // tslint:disable-next-line:variable-name
        this._type = 'line';
        this.visibility = [];
        this.expanded = false;
        this._standalone = true;
        this.maxTick = Number.MIN_VALUE;
        this.minTick = Number.MAX_VALUE;
        this.visibleGtsId = [];
        this.gtsId = [];
        this.dataHashset = {};
        this.lineHeight = 30;
        this.chartBounds = new ChartBounds();
        this.layout = {
            showlegend: false,
            hovermode: 'closest',
            xaxis: {
                gridwidth: 1,
                fixedrange: false,
                autorange: false,
                automargin: false,
                showticklabels: true,
            },
            autosize: false,
            autoexpand: false,
            yaxis: {
                showticklabels: false,
                fixedrange: true,
                dtick: 1,
                gridwidth: 1,
                tick0: 0,
                nticks: 2,
                rangemode: 'tozero',
                tickson: 'boundaries',
                automargin: true,
                showline: true,
                zeroline: true
            },
            margin: {
                t: 30,
                b: 2,
                r: 10,
                l: 10
            },
        };
        this.marginLeft = 50;
        this._autoResize = false;
        this.LOG = new Logger(WarpViewAnnotationComponent, this._debug);
    }
    /**
     * @param {?} hiddenData
     * @return {?}
     */
    set hiddenData(hiddenData) {
        /** @type {?} */
        const previousVisibility = JSON.stringify(this.visibility);
        this.LOG.debug(['hiddenData', 'previousVisibility'], previousVisibility);
        this._hiddenData = hiddenData;
        this.visibility = [];
        this.visibleGtsId.forEach((/**
         * @param {?} id
         * @return {?}
         */
        id => this.visibility.push(hiddenData.indexOf(id) < 0 && (id !== -1))));
        this.LOG.debug(['hiddenData', 'hiddendygraphfullv'], this.visibility);
        /** @type {?} */
        const newVisibility = JSON.stringify(this.visibility);
        this.LOG.debug(['hiddenData', 'json'], previousVisibility, newVisibility);
        if (previousVisibility !== newVisibility) {
            /** @type {?} */
            const visible = [];
            /** @type {?} */
            const hidden = [];
            this.gtsId.forEach((/**
             * @param {?} id
             * @param {?} i
             * @return {?}
             */
            (id, i) => {
                if (this._hiddenData.indexOf(id) > -1) {
                    hidden.push(i);
                }
                else {
                    visible.push(i);
                }
            }));
            if (visible.length > 0) {
                this.graph.restyleChart({ visible: true }, visible);
            }
            if (hidden.length > 0) {
                this.graph.restyleChart({ visible: false }, hidden);
            }
            this.LOG.debug(['hiddendygraphtrig', 'destroy'], 'redraw by visibility change');
        }
    }
    /**
     * @param {?} type
     * @return {?}
     */
    set type(type) {
        this._type = type;
        this.drawChart();
    }
    /**
     * @param {?} isStandalone
     * @return {?}
     */
    set standalone(isStandalone) {
        if (this._standalone !== isStandalone) {
            this._standalone = isStandalone;
            this.drawChart();
        }
    }
    /**
     * @return {?}
     */
    get standalone() {
        return this._standalone;
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    handleKeyDown($event) {
        if ($event.key === 'Control') {
            this.trimmed = setInterval((/**
             * @return {?}
             */
            () => {
                if (!!this.toolTip.nativeElement.querySelector('#tooltip-body')) {
                    this.toolTip.nativeElement.querySelector('#tooltip-body').classList.add('full');
                }
            }), 100);
        }
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    handleKeyup($event) {
        this.LOG.debug(['document:keyup'], $event);
        if ($event.key === 'Control') {
            if (!!this.toolTip.nativeElement.querySelector('#tooltip-body')) {
                if (this.trimmed) {
                    clearInterval(this.trimmed);
                }
                this.toolTip.nativeElement.querySelector('#tooltip-body').classList.remove('full');
            }
        }
    }
    /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    update(options, refresh) {
        if (!!options) {
            this._options = (/** @type {?} */ (ChartLib.mergeDeep(this._options, options)));
        }
        this.drawChart(refresh);
    }
    /**
     * @param {?} min
     * @param {?} max
     * @param {?} marginLeft
     * @return {?}
     */
    updateBounds(min, max, marginLeft) {
        this.LOG.debug(['updateBounds'], min, max, this._options);
        this._options.bounds.minDate = min;
        this._options.bounds.maxDate = max;
        this.layout.xaxis.autorange = false;
        this.LOG.debug(['updateBounds'], moment__default.tz(min / this.divider, this._options.timeZone).toISOString(), moment__default.tz(max / this.divider, this._options.timeZone).toISOString());
        this.minTick = min;
        this.maxTick = max;
        if (this._options.timeMode && this._options.timeMode === 'timestamp') {
            this.layout.xaxis.tick0 = min / this.divider;
            this.layout.xaxis.range = [min / this.divider, max / this.divider];
        }
        else {
            this.layout.xaxis.tick0 = moment__default.tz(min / this.divider, this._options.timeZone).toISOString();
            this.layout.xaxis.range = [
                moment__default.tz(min / this.divider, this._options.timeZone).toISOString(),
                moment__default.tz(max / this.divider, this._options.timeZone).toISOString()
            ];
        }
        this.layout.margin.l = marginLeft;
        this.marginLeft = marginLeft;
        this.layout = Object.assign({}, this.layout);
        this.LOG.debug(['updateBounds'], Object.assign({}, this.layout.xaxis.range));
    }
    /**
     * @param {?=} reparseNewData
     * @return {?}
     */
    drawChart(reparseNewData = false) {
        if (!this.initChart(this.el)) {
            this.el.nativeElement.style.display = 'none';
            return;
        }
        this.el.nativeElement.style.display = 'block';
        this.LOG.debug(['drawChart', 'this.plotlyData'], this.plotlyData);
        this.LOG.debug(['drawChart', 'hiddenData'], this._hiddenData);
        this.LOG.debug(['drawChart', 'this._options.bounds'], this._options.bounds);
        this.layout.yaxis.color = this.getGridColor(this.el.nativeElement);
        this.layout.yaxis.gridcolor = this.getGridColor(this.el.nativeElement);
        this.layout.yaxis.showline = !!this._standalone;
        this.layout.yaxis.zerolinecolor = this.getGridColor(this.el.nativeElement);
        this.layout.xaxis.color = this.getGridColor(this.el.nativeElement);
        this.layout.xaxis.gridcolor = this.getGridColor(this.el.nativeElement);
        this.layout.xaxis.autorange = !!this._standalone;
        this.layout.xaxis.showticklabels = !!this._standalone;
        this.displayExpander = (this.plotlyData.length > 1);
        /** @type {?} */
        const count = this.plotlyData.filter((/**
         * @param {?} d
         * @return {?}
         */
        d => d.y.length > 0)).length;
        this.layout.margin.l = !!this._standalone ? 10 : 50;
        this.layout.margin.b = !!this._standalone ? 50 : 1;
        /** @type {?} */
        const calculatedHeight = (this.expanded ? this.lineHeight * count : this.lineHeight) + this.layout.margin.t + this.layout.margin.b;
        this.el.nativeElement.style.height = calculatedHeight + 'px';
        this.height = calculatedHeight;
        this.layout.height = this.height;
        this.LOG.debug(['drawChart', 'height'], this.height, count, calculatedHeight);
        this.layout.yaxis.range = [0, this.expanded ? count : 1];
        this.LOG.debug(['drawChart', 'this.layout'], this.layout);
        if (this._options.timeMode && this._options.timeMode === 'timestamp') {
            this.layout.xaxis.tick0 = this.minTick / this.divider;
            this.layout.xaxis.range = [this.minTick / this.divider, this.maxTick / this.divider];
            this.layout.xaxis.type = 'linear';
        }
        else {
            this.layout.xaxis.tick0 = moment__default.tz(this.minTick / this.divider, this._options.timeZone).toISOString(true);
            this.layout.xaxis.range = [
                moment__default.tz(this.minTick / this.divider, this._options.timeZone).toISOString(true),
                moment__default.tz(this.maxTick / this.divider, this._options.timeZone).toISOString(true)
            ];
            this.layout.xaxis.type = 'date';
        }
        this.plotlyConfig.scrollZoom = true;
        this.plotlyConfig = Object.assign({}, this.plotlyConfig);
        this.layout = Object.assign({}, this.layout);
        this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig, this.plotlyData);
        this.loading = false;
    }
    /**
     * @param {?} data
     * @return {?}
     */
    relayout(data) {
        if (data['xaxis.range'] && data['xaxis.range'].length === 2) {
            this.LOG.debug(['relayout', 'updateBounds', 'xaxis.range'], data['xaxis.range']);
            this.chartBounds.msmin = data['xaxis.range'][0];
            this.chartBounds.msmax = data['xaxis.range'][1];
            this.chartBounds.tsmin = moment__default.tz(moment__default(this.chartBounds.msmin), this._options.timeZone).valueOf();
            this.chartBounds.tsmax = moment__default.tz(moment__default(this.chartBounds.msmax), this._options.timeZone).valueOf();
        }
        else if (data['xaxis.range[0]'] && data['xaxis.range[1]']) {
            this.LOG.debug(['relayout', 'updateBounds', 'xaxis.range[x]'], data['xaxis.range[0]']);
            this.chartBounds.msmin = data['xaxis.range[0]'];
            this.chartBounds.msmax = data['xaxis.range[1]'];
            this.chartBounds.tsmin = moment__default.tz(moment__default(this.chartBounds.msmin), this._options.timeZone).valueOf();
            this.chartBounds.tsmax = moment__default.tz(moment__default(this.chartBounds.msmax), this._options.timeZone).valueOf();
        }
        else if (data['xaxis.autorange']) {
            this.LOG.debug(['relayout', 'updateBounds', 'autorange'], data);
            this.chartBounds.tsmin = this.minTick / this.divider;
            this.chartBounds.tsmax = this.maxTick / this.divider;
        }
        this.emitNewBounds(moment__default.utc(this.chartBounds.tsmin).valueOf(), moment__default.utc(this.chartBounds.msmax).valueOf());
    }
    /**
     * @param {?} data
     * @return {?}
     */
    hover(data) {
        this.LOG.debug(['hover'], data);
        /** @type {?} */
        const tooltip = this.toolTip.nativeElement;
        this.pointHover.emit({
            x: data.event.offsetX,
            y: data.event.offsetY
        });
        /** @type {?} */
        let x = data.xvals[0];
        if (!!data.points[0]) {
            x = data.points[0].x;
        }
        /** @type {?} */
        const layout = this.el.nativeElement.getBoundingClientRect();
        /** @type {?} */
        const count = this.plotlyData.filter((/**
         * @param {?} d
         * @return {?}
         */
        d => d.y.length > 0)).length;
        tooltip.style.opacity = '1';
        tooltip.style.display = 'block';
        tooltip.style.paddingLeft = (this._standalone ? 0 : 40) + 'px';
        tooltip.style.top = ((this.expanded ? count - 1 - (data.points[0].y + 0.5) : -1) * (this.lineHeight) + this.layout.margin.t) + 6 + 'px';
        tooltip.classList.remove('right', 'left');
        tooltip.innerHTML = `<div class="tooltip-body trimmed" id="tooltip-body">
<span class="tooltip-date">${this._options.timeMode === 'timestamp'
            ? x
            : (moment__default(x).utc().toISOString().replace('Z', this._options.timeZone === 'UTC' ? 'Z' : '') || '')}</span>
<ul>
<li>${GTSLib.formatLabel(data.points[0].data.name)}: <span class="value">${data.points[0].text}</span></li>
</ul>
      </div>`;
        if (data.event.offsetX > layout.width / 2) {
            tooltip.classList.add('left');
        }
        else {
            tooltip.classList.add('right');
        }
        tooltip.style.pointerEvents = 'none';
    }
    /**
     * @return {?}
     */
    unhover() {
        this.toolTip.nativeElement.style.display = 'none';
    }
    /**
     * @param {?} div
     * @return {?}
     */
    afterPlot(div) {
        this.loading = false;
        this.chartBounds.tsmin = this.minTick;
        this.chartBounds.tsmax = this.maxTick;
        this.chartDraw.emit(this.chartBounds);
        this.LOG.debug(['afterPlot'], this.chartBounds, div);
    }
    /**
     * @private
     * @param {?} min
     * @param {?} max
     * @return {?}
     */
    emitNewBounds(min, max) {
        if (this._options.timeMode && this._options.timeMode === 'timestamp') {
            this.boundsDidChange.emit({ bounds: { min, max }, source: 'annotation' });
        }
        else {
            this.boundsDidChange.emit({
                bounds: {
                    min: moment__default.tz(min, this._options.timeZone).valueOf(),
                    max: moment__default.tz(max, this._options.timeZone).valueOf()
                },
                source: 'annotation'
            });
        }
    }
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    convert(data) {
        /** @type {?} */
        const dataset = [];
        /** @type {?} */
        let gtsList = GTSLib.flatDeep(GTSLib.flattenGtsIdArray((/** @type {?} */ (data.data)), 0).res);
        this.maxTick = Number.NEGATIVE_INFINITY;
        this.minTick = Number.POSITIVE_INFINITY;
        this.visibleGtsId = [];
        this.gtsId = [];
        /** @type {?} */
        const nonPlottable = gtsList.filter((/**
         * @param {?} g
         * @return {?}
         */
        g => g.v && GTSLib.isGtsToPlot(g)));
        gtsList = gtsList.filter((/**
         * @param {?} g
         * @return {?}
         */
        g => g.v && !GTSLib.isGtsToPlot(g)));
        /** @type {?} */
        let timestampMode = true;
        /** @type {?} */
        const tsLimit = 100 * GTSLib.getDivider(this._options.timeUnit);
        gtsList.forEach((/**
         * @param {?} gts
         * @return {?}
         */
        (gts) => {
            /** @type {?} */
            const ticks = gts.v.map((/**
             * @param {?} t
             * @return {?}
             */
            t => t[0]));
            /** @type {?} */
            const size = gts.v.length;
            timestampMode = timestampMode && (ticks[0] > -tsLimit && ticks[0] < tsLimit);
            timestampMode = timestampMode && (ticks[size - 1] > -tsLimit && ticks[size - 1] < tsLimit);
        }));
        if (timestampMode || this._options.timeMode === 'timestamp') {
            this.layout.xaxis.type = 'linear';
        }
        else {
            this.layout.xaxis.type = 'date';
        }
        gtsList.forEach((/**
         * @param {?} gts
         * @param {?} i
         * @return {?}
         */
        (gts, i) => {
            if (gts.v) {
                /** @type {?} */
                const size = gts.v.length;
                /** @type {?} */
                const label = GTSLib.serializeGtsMetadata(gts);
                /** @type {?} */
                const c = ColorLib.getColor(gts.id, this._options.scheme);
                /** @type {?} */
                const color = ((data.params || [])[i] || { datasetColor: c }).datasetColor || c;
                /** @type {?} */
                const series = {
                    type: 'scatter',
                    mode: 'markers',
                    name: label,
                    x: [],
                    y: [],
                    text: [],
                    hoverinfo: 'none',
                    connectgaps: false,
                    visible: !(this._hiddenData.filter((/**
                     * @param {?} h
                     * @return {?}
                     */
                    h => h === gts.id)).length > 0),
                    line: { color },
                    marker: {
                        symbol: 'line-ns-open',
                        color,
                        size: 20,
                        width: 5,
                    }
                };
                this.visibleGtsId.push(gts.id);
                this.gtsId.push(gts.id);
                if (this._options.timeMode && this._options.timeMode === 'timestamp') {
                    this.layout.xaxis.type = 'linear';
                }
                else {
                    this.layout.xaxis.type = 'date';
                }
                /** @type {?} */
                const ticks = gts.v.map((/**
                 * @param {?} t
                 * @return {?}
                 */
                t => t[0]));
                series.text = gts.v.map((/**
                 * @param {?} t
                 * @return {?}
                 */
                t => t[t.length - 1]));
                series.y = gts.v.map((/**
                 * @return {?}
                 */
                () => (this.expanded ? i : 0) + 0.5));
                if (size > 0) {
                    this.minTick = ticks[0];
                    this.maxTick = ticks[0];
                    for (let v = 1; v < size; v++) {
                        /** @type {?} */
                        const val = ticks[v];
                        this.minTick = (val < this.minTick) ? val : this.minTick;
                        this.maxTick = (val > this.maxTick) ? val : this.maxTick;
                    }
                }
                if (timestampMode || this._options.timeMode === 'timestamp') {
                    series.x = ticks;
                }
                else {
                    if (this._options.timeZone !== 'UTC') {
                        series.x = ticks.map((/**
                         * @param {?} t
                         * @return {?}
                         */
                        t => moment__default.utc(t / this.divider).tz(this._options.timeZone).toISOString()));
                    }
                    else {
                        series.x = ticks.map((/**
                         * @param {?} t
                         * @return {?}
                         */
                        t => moment__default.utc(t / this.divider).toISOString()));
                    }
                }
                if (series.x.length > 0) {
                    dataset.push(series);
                }
            }
        }));
        if (nonPlottable.length > 0) {
            nonPlottable.forEach((/**
             * @param {?} g
             * @return {?}
             */
            g => {
                g.v.forEach((/**
                 * @param {?} value
                 * @return {?}
                 */
                value => {
                    /** @type {?} */
                    const ts = value[0];
                    if (ts < this.minTick) {
                        this.minTick = ts;
                    }
                    if (ts > this.maxTick) {
                        this.maxTick = ts;
                    }
                }));
            }));
            // if there is not any plottable data, we must add a fake one with id -1. This one will always be hidden.
            if (0 === gtsList.length) {
                if (!this.dataHashset[this.minTick]) {
                    this.dataHashset[this.minTick] = [0];
                }
                if (!this.dataHashset[this.maxTick]) {
                    this.dataHashset[this.maxTick] = [0];
                }
                this.visibility.push(false);
                this.visibleGtsId.push(-1);
            }
        }
        if (timestampMode) {
            this._options.timeMode = 'timestamp';
        }
        return dataset;
    }
    /**
     * @return {?}
     */
    toggle() {
        this.expanded = !this.expanded;
        this.drawChart();
    }
    /**
     * @param {?} chartBounds
     * @return {?}
     */
    setRealBounds(chartBounds) {
        this.minTick = chartBounds.tsmin;
        this.maxTick = chartBounds.tsmax;
        this._options.bounds = this._options.bounds || {};
        this._options.bounds.minDate = this.minTick;
        this._options.bounds.maxDate = this.maxTick;
        /** @type {?} */
        const x = {
            tick0: undefined,
            range: []
        };
        if (this._options.timeMode && this._options.timeMode === 'timestamp') {
            x.tick0 = this.minTick / this.divider;
            x.range = [this.minTick / this.divider, this.maxTick / this.divider];
        }
        else {
            x.tick0 = moment__default.tz(this.minTick / this.divider, this._options.timeZone).toISOString(true);
            x.range = [
                moment__default.tz(this.minTick / this.divider, this._options.timeZone).toISOString(true),
                moment__default.tz(this.maxTick / this.divider, this._options.timeZone).toISOString(true)
            ];
        }
        this.layout.xaxis = x;
        this.layout = Object.assign({}, this.layout);
    }
}
WarpViewAnnotationComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-annotation',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\" #chartContainer (mouseleave)=\"hideTooltip()\">\n  <button *ngIf=\"displayExpander && plotlyData && plotlyData.length > 1\" class=\"expander\" (click)=\"toggle()\"\n          title=\"collapse/expand\">+/-</button>\n  <div #toolTip class=\"tooltip\"></div>\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <div *ngIf=\"!loading && !noData\">\n    <div class=\"upperLine\" [ngStyle]=\"{left: standalone? '10px': marginLeft + 'px'}\"></div>\n    <warpview-plotly #graph\n                     [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot($event)\"\n                     (relayout)=\"relayout($event)\" className=\"chart\" (hover)=\"hover($event)\" (unhover)=\"unhover()\"\n                     [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                     [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}:host{display:block}:host .expander{position:absolute;top:0;left:0;width:35px;z-index:9}:host #chartContainer{height:auto;position:relative}:host #chartContainer div.upperLine{position:absolute;top:30px;left:0;height:0;border-bottom:1px solid var(--warp-view-chart-grid-color,#8e8e8e);right:10px}:host .date{text-align:right;display:block;height:20px;vertical-align:middle;line-height:20px;position:absolute;top:0;left:40px}:host .chart{width:var(--warp-view-chart-width);height:var(--warp-view-chart-height)}:host .tooltip{position:absolute;width:calc(100% - 50px);z-index:999;margin-left:10px;top:-1000px}:host .tooltip .tooltip-body{background-color:#ffffffcc;padding-left:10px;padding-right:10px;width:auto;max-width:100%;vertical-align:middle;line-height:20px;height:50px;overflow:visible;margin:1px;color:var(--warp-view-annotationtooltip-font-color)}:host .tooltip .tooltip-body ul{list-style:none;padding-top:0;margin-top:10px}:host .tooltip .tooltip-body.trimmed{max-width:49%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}:host .tooltip .tooltip-body.full{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}:host .tooltip .tooltip-body .timestamp{font-size:1rem}:host .tooltip .tooltip-body .value{color:var(--warp-view-annotationtooltip-value-font-color)}:host .tooltip .tooltip-body .tooltip-date{font-weight:700;font-size:.8rem;text-align:left;display:block;width:100%;height:.8rem;padding-top:5px;vertical-align:middle;line-height:.8rem}:host .tooltip .tooltip-body .round{border-radius:50%;background-color:#bbb;display:inline-block;width:5px;height:5px;border:2px solid #454545;margin-top:auto;margin-bottom:auto;vertical-align:middle;margin-right:5px}:host .tooltip.left .tooltip-body{text-align:left;float:left}:host .tooltip.left .tooltip-body .tooltip-date{text-align:left}:host .tooltip.right .tooltip-body{text-align:right;float:right}:host .tooltip.right .tooltip-body .tooltip-date{text-align:right}"]
            }] }
];
/** @nocollapse */
WarpViewAnnotationComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: SizeService },
    { type: NgZone }
];
WarpViewAnnotationComponent.propDecorators = {
    chartContainer: [{ type: ViewChild, args: ['chartContainer', { static: true },] }],
    hiddenData: [{ type: Input, args: ['hiddenData',] }],
    type: [{ type: Input, args: ['type',] }],
    standalone: [{ type: Input, args: ['standalone',] }],
    pointHover: [{ type: Output, args: ['pointHover',] }],
    warpViewChartResize: [{ type: Output, args: ['warpViewChartResize',] }],
    chartDraw: [{ type: Output, args: ['chartDraw',] }],
    boundsDidChange: [{ type: Output, args: ['boundsDidChange',] }],
    handleKeyDown: [{ type: HostListener, args: ['keydown', ['$event'],] }, { type: HostListener, args: ['document:keydown', ['$event'],] }],
    handleKeyup: [{ type: HostListener, args: ['keyup', ['$event'],] }, { type: HostListener, args: ['document:keyup', ['$event'],] }]
};
if (false) {
    /** @type {?} */
    WarpViewAnnotationComponent.prototype.chartContainer;
    /** @type {?} */
    WarpViewAnnotationComponent.prototype.pointHover;
    /** @type {?} */
    WarpViewAnnotationComponent.prototype.warpViewChartResize;
    /** @type {?} */
    WarpViewAnnotationComponent.prototype.chartDraw;
    /** @type {?} */
    WarpViewAnnotationComponent.prototype.boundsDidChange;
    /** @type {?} */
    WarpViewAnnotationComponent.prototype.displayExpander;
    /**
     * @type {?}
     * @private
     */
    WarpViewAnnotationComponent.prototype._type;
    /**
     * @type {?}
     * @private
     */
    WarpViewAnnotationComponent.prototype.visibility;
    /**
     * @type {?}
     * @private
     */
    WarpViewAnnotationComponent.prototype.expanded;
    /**
     * @type {?}
     * @private
     */
    WarpViewAnnotationComponent.prototype._standalone;
    /**
     * @type {?}
     * @private
     */
    WarpViewAnnotationComponent.prototype.trimmed;
    /**
     * @type {?}
     * @private
     */
    WarpViewAnnotationComponent.prototype.maxTick;
    /**
     * @type {?}
     * @private
     */
    WarpViewAnnotationComponent.prototype.minTick;
    /**
     * @type {?}
     * @private
     */
    WarpViewAnnotationComponent.prototype.visibleGtsId;
    /**
     * @type {?}
     * @private
     */
    WarpViewAnnotationComponent.prototype.gtsId;
    /**
     * @type {?}
     * @private
     */
    WarpViewAnnotationComponent.prototype.dataHashset;
    /**
     * @type {?}
     * @private
     */
    WarpViewAnnotationComponent.prototype.lineHeight;
    /**
     * @type {?}
     * @private
     */
    WarpViewAnnotationComponent.prototype.chartBounds;
    /** @type {?} */
    WarpViewAnnotationComponent.prototype.layout;
    /** @type {?} */
    WarpViewAnnotationComponent.prototype.marginLeft;
    /** @type {?} */
    WarpViewAnnotationComponent.prototype.el;
    /** @type {?} */
    WarpViewAnnotationComponent.prototype.renderer;
    /** @type {?} */
    WarpViewAnnotationComponent.prototype.sizeService;
    /** @type {?} */
    WarpViewAnnotationComponent.prototype.ngZone;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *
 */
class WarpViewPolarComponent extends WarpViewComponent {
    /**
     * @param {?} el
     * @param {?} renderer
     * @param {?} sizeService
     * @param {?} ngZone
     */
    constructor(el, renderer, sizeService, ngZone) {
        super(el, renderer, sizeService, ngZone);
        this.el = el;
        this.renderer = renderer;
        this.sizeService = sizeService;
        this.ngZone = ngZone;
        this.layout = {
            paper_bgcolor: 'rgba(0,0,0,0)',
            showlegend: true,
            legend: { orientation: 'h' },
            font: { size: 12, familly: '\'Quicksand\', sans-serif' },
            polar: {
                bgcolor: 'rgba(0,0,0,0)',
                angularaxis: {
                    type: 'category'
                },
                radialaxis: {
                    visible: true,
                }
            },
            orientation: 270,
            margin: {
                t: 10,
                b: 25,
                r: 10,
                l: 10
            }
        };
        this.LOG = new Logger(WarpViewPolarComponent, this._debug);
    }
    /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    update(options, refresh) {
        this.LOG.debug(['onOptions', 'before'], this._options, options);
        if (!deepEqual(options, this._options)) {
            this.LOG.debug(['options', 'changed'], options);
            this._options = (/** @type {?} */ (ChartLib.mergeDeep(this._options, (/** @type {?} */ (options)))));
        }
        this.drawChart();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this._options = this._options || this.defOptions;
    }
    /**
     * @private
     * @return {?}
     */
    drawChart() {
        if (!this.initChart(this.el)) {
            return;
        }
        this.layout.polar.radialaxis.color = this.getGridColor(this.el.nativeElement);
        this.layout.polar.angularaxis.color = this.getGridColor(this.el.nativeElement);
        this.layout.showlegend = !!this.showLegend;
        this.LOG.debug(['drawChart', 'this.layout'], this.layout);
        this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig);
        this.LOG.debug(['drawChart', 'this.plotlyData'], this.plotlyData);
        this.loading = false;
    }
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    convert(data) {
        /** @type {?} */
        const dataset = [];
        /** @type {?} */
        const divider = GTSLib.getDivider(this._options.timeUnit);
        /** @type {?} */
        const gtsList = GTSLib.flatDeep(GTSLib.flattenGtsIdArray((/** @type {?} */ (data.data)), 0).res);
        this.LOG.debug(['convert', 'gtsList'], gtsList);
        /** @type {?} */
        let minVal = Number.MAX_VALUE;
        /** @type {?} */
        let maxVal = Number.MIN_VALUE;
        gtsList.forEach((/**
         * @param {?} gts
         * @param {?} i
         * @return {?}
         */
        (gts, i) => {
            /** @type {?} */
            const c = ColorLib.getColor(i, this._options.scheme);
            /** @type {?} */
            const color = ((data.params || [])[gts.id] || { datasetColor: c }).datasetColor || c;
            /** @type {?} */
            const series = {
                r: [],
                theta: [],
                marker: {
                    line: { color, width: 1 },
                    color: ColorLib.transparentize(color),
                },
                fillcolor: ColorLib.transparentize(color),
                hoverinfo: 'none',
                name: GTSLib.serializeGtsMetadata(gts),
                text: GTSLib.serializeGtsMetadata(gts),
                fill: 'toself',
                type: 'barpolar',
            };
            gts.v.forEach((/**
             * @param {?} value
             * @return {?}
             */
            value => {
                /** @type {?} */
                const ts = value[0];
                minVal = Math.min(minVal, value[value.length - 1]);
                maxVal = Math.max(maxVal, value[value.length - 1]);
                series.r.push(value[value.length - 1]);
                if (this._options.timeMode && this._options.timeMode === 'timestamp') {
                    series.theta.push(ts.toString());
                }
                else {
                    series.theta.push(moment__default.tz(moment__default.utc(ts / this.divider), this._options.timeZone).toISOString());
                }
            }));
            if (this.unit) {
                series.title = {
                    text: this.unit
                };
            }
            dataset.push(series);
        }));
        this.layout.polar.radialaxis.range = [minVal, maxVal];
        return dataset;
    }
}
WarpViewPolarComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-polar',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\" #chartContainer>\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-plotly #graph *ngIf=\"plotlyData?.length > 0\"\n                     [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot()\"\n                     (relayout)=\"relayout($event)\" (hover)=\"hover($event)\" (unhover)=\"unhover($event)\"\n                     [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                     [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n  <div #toolTip class=\"tooltip\" [ngStyle]=\"getTooltipPosition()\"></div>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}.tooltip{background-color:var(--warp-view-chart-legend-bg)!important;color:var(--warp-view-chart-legend-color)!important;text-align:left;position:absolute;display:none;padding:10px;border:1px solid grey;border-radius:5px;box-shadow:none;pointer-events:none;font-size:10px;min-width:100px;width:auto;max-width:50%;z-index:999;height:auto!important;left:-1000px}.tooltip .chip{border-radius:50%;background-color:#bbb;display:inline-block;width:5px;height:5px;border:2px solid #454545;margin-top:auto;margin-bottom:auto;vertical-align:middle;cursor:pointer}:host{display:block;height:100%}:host .bglayer{display:none}:host #chartContainer{height:100%}:host #chartContainer div{height:100%}:host div.chart{width:var(--warp-view-chart-width);height:var(--warp-view-chart-height)}"]
            }] }
];
/** @nocollapse */
WarpViewPolarComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: SizeService },
    { type: NgZone }
];
if (false) {
    /** @type {?} */
    WarpViewPolarComponent.prototype.layout;
    /** @type {?} */
    WarpViewPolarComponent.prototype.el;
    /** @type {?} */
    WarpViewPolarComponent.prototype.renderer;
    /** @type {?} */
    WarpViewPolarComponent.prototype.sizeService;
    /** @type {?} */
    WarpViewPolarComponent.prototype.ngZone;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *
 */
class WarpViewRadarComponent extends WarpViewComponent {
    /**
     * @param {?} el
     * @param {?} renderer
     * @param {?} sizeService
     * @param {?} ngZone
     */
    constructor(el, renderer, sizeService, ngZone) {
        super(el, renderer, sizeService, ngZone);
        this.el = el;
        this.renderer = renderer;
        this.sizeService = sizeService;
        this.ngZone = ngZone;
        this.layout = {
            paper_bgcolor: 'transparent',
            showlegend: true,
            legend: { orientation: 'h' },
            font: { size: 12 },
            polar: {
                bgcolor: 'transparent',
                angularaxis: { type: 'category' },
                radialaxis: { visible: true }
            },
            margin: {
                t: 0,
                b: 25,
                r: 10,
                l: 10
            }
        };
        this.LOG = new Logger(WarpViewRadarComponent, this._debug);
    }
    /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    update(options, refresh) {
        this.LOG.debug(['onOptions', 'before'], this._options, options);
        if (!deepEqual(options, this._options)) {
            this.LOG.debug(['options', 'changed'], options);
            this._options = (/** @type {?} */ (ChartLib.mergeDeep(this._options, (/** @type {?} */ (options)))));
        }
        this.drawChart();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this._options = this._options || this.defOptions;
    }
    /**
     * @private
     * @return {?}
     */
    drawChart() {
        if (!this.initChart(this.el)) {
            return;
        }
        this.layout.polar.radialaxis.color = this.getGridColor(this.el.nativeElement);
        this.layout.polar.angularaxis.color = this.getGridColor(this.el.nativeElement);
        this.layout.showlegend = this.showLegend;
        this.LOG.debug(['drawChart', 'this.layout'], this.layout);
        this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig);
        this.LOG.debug(['drawChart', 'this.plotlyData'], this.plotlyData);
        this.loading = false;
    }
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    convert(data) {
        /** @type {?} */
        const dataset = [];
        /** @type {?} */
        const divider = GTSLib.getDivider(this._options.timeUnit);
        /** @type {?} */
        const gtsList = GTSLib.flatDeep(GTSLib.flattenGtsIdArray((/** @type {?} */ (data.data)), 0).res);
        this.LOG.debug(['convert', 'gtsList'], gtsList);
        /** @type {?} */
        let minVal = Number.MAX_VALUE;
        /** @type {?} */
        let maxVal = Number.MIN_VALUE;
        gtsList.forEach((/**
         * @param {?} gts
         * @param {?} i
         * @return {?}
         */
        (gts, i) => {
            /** @type {?} */
            const c = ColorLib.getColor(i, this._options.scheme);
            /** @type {?} */
            const color = ((data.params || [])[gts.id] || { datasetColor: c }).datasetColor || c;
            /** @type {?} */
            const series = {
                r: [],
                theta: [],
                line: { color },
                marker: {
                    line: { color, width: 1 },
                    color: ColorLib.transparentize(color)
                },
                fillcolor: ColorLib.transparentize(color),
                hoverinfo: 'none',
                name: GTSLib.serializeGtsMetadata(gts),
                text: GTSLib.serializeGtsMetadata(gts),
                type: 'scatterpolar',
                fill: 'toself'
            };
            gts.v.forEach((/**
             * @param {?} value
             * @return {?}
             */
            value => {
                /** @type {?} */
                const ts = value[0];
                series.r.push(value[value.length - 1]);
                minVal = Math.min(minVal, value[value.length - 1]);
                maxVal = Math.max(maxVal, value[value.length - 1]);
                if (this._options.timeMode && this._options.timeMode === 'timestamp') {
                    series.theta.push(ts.toString());
                }
                else {
                    series.theta.push(moment__default.tz(moment__default.utc(ts / this.divider), this._options.timeZone).toISOString());
                }
            }));
            dataset.push(series);
        }));
        this.layout.polar.radialaxis.range = [minVal, maxVal];
        return dataset;
    }
}
WarpViewRadarComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-radar',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\" #chartContainer>\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-plotly #graph *ngIf=\"plotlyData?.length > 0\"\n                     [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot()\"\n                     (relayout)=\"relayout($event)\" (hover)=\"hover($event)\" (unhover)=\"unhover($event)\"\n                     [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                     [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n  <div #toolTip class=\"tooltip\" [ngStyle]=\"getTooltipPosition()\"></div>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}.tooltip{background-color:var(--warp-view-chart-legend-bg)!important;color:var(--warp-view-chart-legend-color)!important;text-align:left;position:absolute;display:none;padding:10px;border:1px solid grey;border-radius:5px;box-shadow:none;pointer-events:none;font-size:10px;min-width:100px;width:auto;max-width:50%;z-index:999;height:auto!important;left:-1000px}.tooltip .chip{border-radius:50%;background-color:#bbb;display:inline-block;width:5px;height:5px;border:2px solid #454545;margin-top:auto;margin-bottom:auto;vertical-align:middle;cursor:pointer}:host{display:block;height:100%}:host .bglayer{display:none}:host #chartContainer{height:100%}:host #chartContainer div{height:100%}:host div.chart{width:var(--warp-view-chart-width);height:var(--warp-view-chart-height)}"]
            }] }
];
/** @nocollapse */
WarpViewRadarComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: SizeService },
    { type: NgZone }
];
if (false) {
    /** @type {?} */
    WarpViewRadarComponent.prototype.layout;
    /** @type {?} */
    WarpViewRadarComponent.prototype.el;
    /** @type {?} */
    WarpViewRadarComponent.prototype.renderer;
    /** @type {?} */
    WarpViewRadarComponent.prototype.sizeService;
    /** @type {?} */
    WarpViewRadarComponent.prototype.ngZone;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *
 */
class WarpViewPlotComponent extends WarpViewComponent {
    /**
     * @param {?} el
     * @param {?} renderer
     * @param {?} sizeService
     * @param {?} ngZone
     */
    constructor(el, renderer, sizeService, ngZone) {
        super(el, renderer, sizeService, ngZone);
        this.el = el;
        this.renderer = renderer;
        this.sizeService = sizeService;
        this.ngZone = ngZone;
        this.showLine = false;
        this.isAlone = false;
        this.initialChartHeight = 400;
        this.initialMapHeight = 400;
        this.warpViewChartResize = new EventEmitter();
        this._options = Object.assign({}, new Param(), {
            showControls: true,
            showGTSTree: true,
            showDots: true,
            timeZone: 'UTC',
            timeUnit: 'us',
            timeMode: 'date',
            bounds: {}
        });
        this._toHide = [];
        this.showChart = true;
        this.showMap = false;
        this.timeClipValue = '';
        this.kbdLastKeyPressed = [];
        this.warningMessage = '';
        this.loading = false;
        this.gtsIdList = [];
        this.kbdCounter = 0;
        this.gtsFilterCount = 0;
        this.gtsBrowserIndex = -1;
        this._gtsFilter = 'x';
        this._type = 'line';
        this.chartBounds = {
            tsmin: Number.MAX_VALUE,
            tsmax: Number.MIN_VALUE,
            msmax: '',
            msmin: '',
            marginLeft: 0
        };
        // key event are trapped in plot component.
        // if one of this key is pressed, default action is prevented.
        this.preventDefaultKeyList = ['Escape', '/'];
        this.preventDefaultKeyListInModals = ['Escape', 'ArrowUp', 'ArrowDown', ' ', '/'];
        this.LOG = new Logger(WarpViewPlotComponent, this._debug);
    }
    /**
     * @param {?} type
     * @return {?}
     */
    set type(type) {
        this._type = type;
        this.drawChart();
    }
    /**
     * @return {?}
     */
    get type() {
        return this._type;
    }
    /**
     * @param {?} gtsFilter
     * @return {?}
     */
    set gtsFilter(gtsFilter) {
        this._gtsFilter = gtsFilter;
        this.drawChart();
    }
    /**
     * @return {?}
     */
    get gtsFilter() {
        return this._gtsFilter;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this._options = this._options || this.defOptions;
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.drawChart(true);
        this.resizeArea();
    }
    /**
     * @param {?} ev
     * @return {?}
     */
    handleKeydown(ev) {
        this.LOG.debug(['handleKeydown'], ev);
        if (!this.isAlone) {
            this.handleKeyPress(ev).then((/**
             * @return {?}
             */
            () => {
                // empty
            }));
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    stateChange(event) {
        this.LOG.debug(['stateChange'], event);
        switch (event.id) {
            case 'timeSwitch':
                if (event.state) {
                    this._options.timeMode = 'timestamp';
                }
                else {
                    this._options.timeMode = 'date';
                }
                this.drawChart();
                break;
            case 'typeSwitch':
                if (event.state) {
                    this._type = 'step';
                }
                else {
                    this._type = 'line';
                }
                this.drawChart();
                break;
            case 'chartSwitch':
                this.showChart = event.state;
                this.drawChart();
                break;
            case 'mapSwitch':
                this.showMap = event.state;
                if (this.showMap) {
                    requestAnimationFrame((/**
                     * @return {?}
                     */
                    () => this.map.resize()));
                }
                break;
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    boundsDidChange(event) {
        this.LOG.debug(['updateBounds'], event);
        this._options.bounds = this._options.bounds || {};
        if (this._options.bounds.minDate !== event.bounds.min && this._options.bounds.maxDate !== event.bounds.max) {
            this._options.bounds = this._options.bounds || {};
            this._options.bounds.minDate = event.bounds.min;
            this._options.bounds.maxDate = event.bounds.max;
            if (event.source === 'chart') {
                this.annotation.updateBounds(event.bounds.min, event.bounds.max, event.bounds.marginLeft);
            }
            else if (event.source === 'annotation') {
                this.chart.updateBounds(event.bounds.min, event.bounds.max);
            }
            this.LOG.debug(['updateBounds'], moment__default.tz(event.bounds.min, this._options.timeZone).toDate(), moment__default.tz(event.bounds.max, this._options.timeZone).toDate());
            this.line.nativeElement.style.left = '-100px';
        }
    }
    /**
     * @return {?}
     */
    onWarpViewModalClose() {
        this.mainPlotDiv.nativeElement.focus();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    warpViewSelectedGTS(event) {
        this.LOG.debug(['warpViewSelectedGTS'], event);
        if (!this._toHide.find((/**
         * @param {?} i
         * @return {?}
         */
        i => {
            return i === event.gts.id;
        })) && !event.selected) { // if not in toHide and state false, put id in toHide
            this._toHide.push(event.gts.id);
        }
        else {
            if (event.selected) { // if in toHide and state true, remove it from toHide
                this._toHide = this._toHide.filter((/**
                 * @param {?} i
                 * @return {?}
                 */
                i => {
                    return i !== event.gts.id;
                }));
            }
        }
        this.LOG.debug(['warpViewSelectedGTS', 'this._toHide'], this._toHide);
        this.ngZone.run((/**
         * @return {?}
         */
        () => {
            this._toHide = [...this._toHide];
        }));
    }
    /**
     * @param {?} evt
     * @return {?}
     */
    handleMouseMove(evt) {
        evt.preventDefault();
        if (this.showLine && this.line) {
            this.line.nativeElement.style.left = Math.max(evt.pageX - this.left, 50) + 'px';
        }
    }
    /**
     * @param {?} evt
     * @return {?}
     */
    handleMouseEnter(evt) {
        evt.preventDefault();
        this.left = this.left || this.main.nativeElement.getBoundingClientRect().left;
        this.showLine = true;
        if (this.line) {
            this.renderer.setStyle(this.line.nativeElement, 'display', 'block');
        }
    }
    /**
     * @param {?} evt
     * @return {?}
     */
    handleMouseOut(evt) {
        // evt.preventDefault();
        if (this.line) {
            this.showLine = false;
            this.renderer.setStyle(this.line.nativeElement, 'left', '-100px');
            this.renderer.setStyle(this.line.nativeElement, 'display', 'none');
        }
    }
    /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    update(options, refresh) {
        if (options) {
            /** @type {?} */
            let optionChanged = false;
            Object.keys(options).forEach((/**
             * @param {?} opt
             * @return {?}
             */
            opt => {
                if (this._options.hasOwnProperty(opt)) {
                    optionChanged = optionChanged || !deepEqual(options[opt], this._options[opt]);
                }
                else {
                    optionChanged = true; // new unknown option
                }
            }));
            if (this.LOG) {
                this.LOG.debug(['onOptions', 'optionChanged'], optionChanged);
            }
            if (optionChanged) {
                if (this.LOG) {
                    this.LOG.debug(['onOptions', 'options'], options);
                }
                this._options = options;
                this.drawChart(false);
            }
            this.drawChart(refresh);
        }
        else {
            this.drawChart(refresh);
        }
    }
    /**
     * @param {?} e
     * @return {?}
     */
    inputTextKeyboardEvents(e) {
        e.stopImmediatePropagation();
        if (e.key === 'Enter') {
            this.applyFilter();
        }
        else if (e.key === 'Escape') {
            this.pushKbdEvent('Escape');
            this.modal.close();
        }
    }
    /**
     * @return {?}
     */
    tzSelected() {
        /** @type {?} */
        const timeZone = this.tzSelector.nativeElement.value;
        this.LOG.debug(['timezone', 'tzselect'], timeZone);
        this._options.timeZone = timeZone;
        this.tzSelector.nativeElement.setAttribute('class', timeZone === 'UTC' ? 'defaulttz' : 'customtz');
        this.drawChart();
    }
    /**
     * @return {?}
     */
    getTimeClip() {
        this.LOG.debug(['getTimeClip'], this.chart.getTimeClip());
        return this.chart.getTimeClip();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    resizeChart(event) {
        this.LOG.debug(['resizeChart'], event);
        this.sizeService.change(new Size(this.width, event));
    }
    /**
     * @param {?=} firstDraw
     * @return {?}
     */
    drawChart(firstDraw = false) {
        this.LOG.debug(['drawCharts'], this._data, this._options);
        if (!this._data || !this._data.data || this._data.data.length === 0) {
            return;
        }
        if (this.timeClip) {
            this.timeClip.close();
        }
        if (this.modal) {
            this.modal.close();
        }
        this.LOG.debug(['PPts'], 'firstdraw ', firstDraw);
        if (firstDraw) { // on the first draw, we can set some default options.
            // on the first draw, we can set some default options.
            // automatically switch to timestamp mode
            // when the first tick and last tick of all the series are in the interval [-100ms 100ms]
            /** @type {?} */
            const tsLimit = 100 * GTSLib.getDivider(this._options.timeUnit);
            /** @type {?} */
            const dataList = this._data.data;
            if (dataList) {
                /** @type {?} */
                let gtsList = GTSLib.flattenGtsIdArray((/** @type {?} */ (dataList)), 0).res;
                gtsList = GTSLib.flatDeep(gtsList);
                /** @type {?} */
                let timestampMode = true;
                /** @type {?} */
                let totalDatapoints = 0;
                gtsList.forEach((/**
                 * @param {?} g
                 * @return {?}
                 */
                g => {
                    this.gtsIdList.push(g.id); // usefull for gts browse shortcut
                    if (g.v.length > 0) { // if gts not empty
                        timestampMode = timestampMode && (g.v[0][0] > -tsLimit && g.v[0][0] < tsLimit);
                        timestampMode = timestampMode && (g.v[g.v.length - 1][0] > -tsLimit && g.v[g.v.length - 1][0] < tsLimit);
                        totalDatapoints += g.v.length;
                    }
                }));
                if (timestampMode) {
                    this._options.timeMode = 'timestamp';
                }
                this.LOG.debug(['drawCharts', 'parsed', 'timestampMode'], timestampMode);
            }
        }
        this.gtsList = this._data;
        this._options = Object.assign({}, this._options);
        this.LOG.debug(['drawCharts', 'parsed'], this._data, this._options);
        this.resizeArea();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    focus(event) {
        // read the first 4 letters of id of all elements in the click tree
        /** @type {?} */
        const idListClicked = event.path.map((/**
         * @param {?} el
         * @return {?}
         */
        el => (el.id || '').slice(0, 4)));
        // if not alone on the page, and click is not on the timezone selector and not on the map, force focus.
        if (!this.isAlone && idListClicked.indexOf('tzSe') < 0 && idListClicked.indexOf('map-') < 0) {
            this.mainPlotDiv.nativeElement.focus();
        } // prevent stealing focus of the timezone selector.
    }
    /**
     * @private
     * @param {?} ev
     * @return {?}
     */
    handleKeyPress(ev) {
        return __awaiter(this, void 0, void 0, function* () {
            this.LOG.debug(['handleKeyPress'], ev);
            if (this.preventDefaultKeyList.indexOf(ev.key) >= 0) {
                ev.preventDefault();
            }
            if ((yield this.timeClip.isOpened()) || (yield this.modal.isOpened()) || (yield this.gtsPopupModal.isOpened())) {
                if (this.preventDefaultKeyListInModals.indexOf(ev.key) >= 0) {
                    ev.preventDefault();
                }
            }
            if (ev.key === '/') {
                this.modal.open();
                this.filterInput.nativeElement.focus();
                this.filterInput.nativeElement.select();
            }
            else if (ev.key === 't') {
                this.chart.getTimeClip().then((/**
                 * @param {?} tc
                 * @return {?}
                 */
                tc => {
                    this.timeClipValue = `<p>keep data between
          ${this._options.timeMode === 'timestamp' ? tc.tsmin : moment__default.tz(tc.tsmin, this._options.timeZone).toLocaleString()} and
          ${this._options.timeMode === 'timestamp' ? tc.tsmax : moment__default.tz(tc.tsmax, this._options.timeZone).toLocaleString()}
          ${this._options.timeUnit !== 'us' ? ' (for a ' + this._options.timeUnit + ' platform)' : ''}</p>
          <pre><code>${Math.round(tc.tsmax)} ${Math.round(tc.tsmax - tc.tsmin)} TIMECLIP</code></pre>`;
                    this.timeClip.open();
                }));
            }
            else if (ev.key === 'b' || ev.key === 'B') { // browse among all gts
                if (this.gtsBrowserIndex < 0) {
                    this.gtsBrowserIndex = 0;
                }
                if (ev.key === 'b') { // increment index
                    this.gtsBrowserIndex++;
                    if (this.gtsBrowserIndex === this.gtsIdList.length) {
                        this.gtsBrowserIndex = 0;
                    }
                }
                else { // decrement index
                    this.gtsBrowserIndex--;
                    if (this.gtsBrowserIndex < 0) {
                        this.gtsBrowserIndex = this.gtsIdList.length - 1;
                    }
                }
                this._toHide = this.gtsIdList.filter((/**
                 * @param {?} v
                 * @return {?}
                 */
                v => v !== this.gtsIdList[this.gtsBrowserIndex])); // hide all but one
            }
            else if (ev.key === 'n') {
                this._toHide = [...this.gtsIdList];
                return false;
            }
            else if (ev.key === 'a') {
                this._toHide = [];
            }
            else if (ev.key === 'Escape') {
                this.timeClip.isOpened().then((/**
                 * @param {?} r
                 * @return {?}
                 */
                r => {
                    if (r) {
                        this.timeClip.close();
                    }
                }));
                this.modal.isOpened().then((/**
                 * @param {?} r
                 * @return {?}
                 */
                r => {
                    if (r) {
                        this.modal.close();
                    }
                }));
                this.gtsPopupModal.isOpened().then((/**
                 * @param {?} r
                 * @return {?}
                 */
                r => {
                    if (r) {
                        this.gtsPopupModal.close();
                    }
                }));
            }
            else {
                this.pushKbdEvent(ev.key);
            }
            this.LOG.debug(['handleKeyPress', 'this.gtsIdList'], this._toHide, this.gtsBrowserIndex);
        });
    }
    /**
     * @return {?}
     */
    applyFilter() {
        this.gtsFilterCount++;
        this._gtsFilter = this.gtsFilterCount.toString().slice(0, 1) + this.filterInput.nativeElement.value;
        this.modal.close();
    }
    /**
     * @private
     * @param {?} key
     * @return {?}
     */
    pushKbdEvent(key) {
        this.kbdCounter++;
        this.kbdLastKeyPressed = [key, this.kbdCounter.toString()];
    }
    /**
     * @return {?}
     */
    getTZ() {
        return moment__default.tz.names();
    }
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    convert(data) {
        return [];
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    onChartDraw($event) {
        if (this.chartBounds
            && $event
            && this.chartBounds.tsmin !== Math.min(this.chartBounds.tsmin, $event.tsmin)
            && this.chartBounds.tsmax !== Math.max(this.chartBounds.tsmax, $event.tsmax)) {
            this.chartBounds.tsmin = Math.min(this.chartBounds.tsmin, $event.tsmin);
            this.chartBounds.tsmax = Math.max(this.chartBounds.tsmax, $event.tsmax);
            this.annotation.setRealBounds(this.chartBounds);
            this.chart.setRealBounds(this.chartBounds);
            this.chartDraw.emit();
            this.LOG.debug(['onChartDraw', 'this.chartBounds'], this.chartBounds, $event);
        }
        this.chartDraw.emit($event);
    }
    /**
     * @private
     * @return {?}
     */
    resizeArea() {
        setTimeout((/**
         * @return {?}
         */
        () => {
            /** @type {?} */
            let h = this.el.nativeElement.getBoundingClientRect().height;
            if (h > 0) {
                if (!!this.GTSTree) {
                    h -= this.GTSTree.nativeElement.getBoundingClientRect().height;
                }
                if (!!this.controls) {
                    h -= this.controls.nativeElement.getBoundingClientRect().height;
                }
                this.initialChartHeight = h;
            }
        }));
    }
}
WarpViewPlotComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-plot',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div #mainPlotDiv tabindex=\"0\" (click)=\"focus($event)\" id=\"focusablePlotDiv\">\n  <warpview-modal [kbdLastKeyPressed]=\"kbdLastKeyPressed\" modalTitle=\"TimeClip\" #timeClip\n                  (warpViewModalClose)=\"onWarpViewModalClose()\"\n  >\n    <div #timeClipElement [innerHTML]=\"timeClipValue\"></div>\n  </warpview-modal>\n  <warpview-modal [kbdLastKeyPressed]=\"kbdLastKeyPressed\" modalTitle=\"GTS Filter\" #modal\n                  (warpViewModalClose)=\"onWarpViewModalClose()\"\n  >\n    <label for=\"filterInput\">Enter a regular expression to filter GTS.</label>\n    <br />\n    <input tabindex=\"1\" type=\"text\" (keypress)=\"inputTextKeyboardEvents($event)\" #filterInput id=\"filterInput\"\n           (keydown)=\"inputTextKeyboardEvents($event)\" (keyup)=\"inputTextKeyboardEvents($event)\"\n           [value]=\"gtsFilter.slice(1)\"/>\n    <button (click)=\"applyFilter()\" [innerHTML]=\"_options.popupButtonValidateLabel || 'Apply'\"\n            class=\"{{_options.popupButtonValidateClass}}\" tabindex=\"2\"\n            type=\"button\">\n    </button>\n  </warpview-modal>\n  <warpview-gts-popup [maxToShow]=\"5\" [hiddenData]=\"_toHide\" [gtsList]=\"gtsList\"\n                      [kbdLastKeyPressed]=\"kbdLastKeyPressed\"\n                      [options]=\"_options\" [debug]=\"debug\"\n                      (warpViewModalClose)=\"onWarpViewModalClose()\"\n                      (warpViewSelectedGTS)=\"warpViewSelectedGTS($event)\"\n                      #gtsPopupModal></warpview-gts-popup>\n  <div class=\"inline\" *ngIf=\"_options.showControls\" #controls>\n    <warpview-toggle id=\"timeSwitch\" text1=\"Date\" text2=\"Timestamp\"\n                     (stateChange)=\"stateChange($event)\"\n                     [checked]=\"_options.timeMode === 'timestamp'\"></warpview-toggle>\n    <warpview-toggle id=\"typeSwitch\" text1=\"Line\" text2=\"Step\"\n                     (stateChange)=\"stateChange($event)\"></warpview-toggle>\n    <warpview-toggle id=\"chartSwitch\" text1=\"Hide chart\" text2=\"Display chart\"\n                     (stateChange)=\"stateChange($event)\"\n                     [checked]=\"showChart\"></warpview-toggle>\n    <warpview-toggle id=\"mapSwitch\" text1=\"Hide map\" text2=\"Display map\"\n                     (stateChange)=\"stateChange($event)\" [checked]=\"showMap\"></warpview-toggle>\n    <div class=\"tzcontainer\">\n      <label for=\"tzSelector\"></label>\n      <select id=\"tzSelector\" class=\"defaulttz\" #tzSelector (change)=\"tzSelected()\">\n        <option *ngFor=\"let z of getTZ()\" [value]=\"z\" [selected]=\"z === 'UTC'\"\n                [ngClass]=\"{'defaulttz' :z === 'UTC','customtz': z !== 'UTC'}\">{{z}}</option>\n      </select>\n    </div>\n  </div>\n  <div *ngIf=\"warningMessage\" class=\"warningMessage\">{{warningMessage}}</div>\n  <warpview-gts-tree\n    *ngIf=\"_options.showGTSTree\"\n    [data]=\"gtsList\" id=\"tree\" [gtsFilter]=\"gtsFilter\" [debug]=\"debug\" #GTSTree\n    (warpViewSelectedGTS)=\"warpViewSelectedGTS($event)\"\n    [hiddenData]=\"_toHide\" [options]=\"_options\"\n    [kbdLastKeyPressed]=\"kbdLastKeyPressed\"\n  ></warpview-gts-tree>\n  <div *ngIf=\"showChart\" #main class=\"main-container\"\n       (mouseleave)=\"handleMouseOut($event)\"\n       (mousemove)=\"handleMouseMove($event)\"\n       (mouseenter)=\"handleMouseEnter($event)\">\n    <div class=\"bar\" #line></div>\n    <div class=\"annotation\">\n      <warpview-annotation #annotation\n                           [data]=\"gtsList\" [responsive]=\"true\"\n                           (boundsDidChange)=\"boundsDidChange($event)\"\n                           (chartDraw)=\"onChartDraw($event)\"\n                           [showLegend]='showLegend' [debug]=\"debug\" [standalone]=\"false\"\n                           [hiddenData]=\"_toHide\" [options]=\"_options\"\n      ></warpview-annotation>\n    </div>\n    <warpview-resize minHeight=\"100\" [initialHeight]=\"initialChartHeight\" [debug]=\"debug\"\n                     (resize)=\"resizeChart($event)\"\n    >\n      <warpview-chart [responsive]=\"true\" [standalone]=\"false\" [data]=\"gtsList\"\n                      [showLegend]=\"showLegend\"\n                      (boundsDidChange)=\"boundsDidChange($event)\"\n                      (chartDraw)=\"onChartDraw($event)\"\n                      #chart [debug]=\"debug\" [hiddenData]=\"_toHide\" [type]=\"type\" [options]=\"_options\"\n      ></warpview-chart>\n    </warpview-resize>\n  </div>\n  <warpview-resize *ngIf=\"showMap\" minHeight=\"100\" [initialHeight]=\"initialMapHeight\" [debug]=\"debug\">\n    <div class=\"map-container\">\n      <warpview-map [options]=\"_options\" #map [data]=\"gtsList\" [debug]=\"debug\" [responsive]=\"true\"\n                    [hiddenData]=\"_toHide\"\n      ></warpview-map>\n    </div>\n  </warpview-resize>\n</div>\n",
                encapsulation: ViewEncapsulation.None,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host,warp-view-plot,warpview-plot{position:relative;height:100%}:host .main-container,warp-view-plot .main-container,warpview-plot .main-container{position:relative}:host .map-container,warp-view-plot .map-container,warpview-plot .map-container{height:100%;width:100%;margin-right:20px;position:relative}:host .bar,warp-view-plot .bar,warpview-plot .bar{width:1px;left:-100px;position:absolute;background-color:transparent;-webkit-backface-visibility:hidden;backface-visibility:hidden;top:0;bottom:55px;overflow:hidden;display:none;z-index:0;pointer-events:none;border-left:dashed 2px var(--warp-view-bar-color)}:host .inline,warp-view-plot .inline,warpview-plot .inline{display:-webkit-inline-box;display:inline-flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;flex-direction:row;flex-wrap:wrap;-webkit-box-pack:space-evenly;justify-content:space-evenly;-webkit-box-align:stretch;align-items:stretch;width:100%}:host label,warp-view-plot label,warpview-plot label{display:inline-block}:host input,warp-view-plot input,warpview-plot input{display:block;width:calc(100% - 20px);padding:5px;font-size:1rem;font-weight:400;line-height:1.5}:host .annotation,warp-view-plot .annotation,warpview-plot .annotation{max-width:100%;padding-top:20px;margin-bottom:0}:host #focusablePlotDiv:focus,warp-view-plot #focusablePlotDiv:focus,warpview-plot #focusablePlotDiv:focus{outline:0}:host #tzSelector,warp-view-plot #tzSelector,warpview-plot #tzSelector{height:var(--warp-view-switch-height);border-radius:var(--warp-view-switch-radius);padding-left:calc(var(--warp-view-switch-radius)/ 2);padding-right:5px;box-shadow:inset 0 1px 2px rgba(0,0,0,.12),inset 0 0 2px rgba(0,0,0,.15);color:var(--warp-view-font-color);border:none;margin:auto}:host .defaulttz,warp-view-plot .defaulttz,warpview-plot .defaulttz{background:var(--warp-view-switch-inset-color)}:host .customtz,warp-view-plot .customtz,warpview-plot .customtz{background:var(--warp-view-switch-inset-checked-color)}:host .tzcontainer,warp-view-plot .tzcontainer,warpview-plot .tzcontainer{display:-webkit-box;display:flex}:host .chart-container,warp-view-plot .chart-container,warpview-plot .chart-container{height:var(--warp-view-plot-chart-height);width:100%}:host #bottomPlaceHolder,warp-view-plot #bottomPlaceHolder,warpview-plot #bottomPlaceHolder{height:200px;width:100%}:host .warningMessage,warp-view-plot .warningMessage,warpview-plot .warningMessage{color:orange;padding:10px;border-radius:3px;background:#faebd7;margin:1em;display:block;border:2px solid orange}"]
            }] }
];
/** @nocollapse */
WarpViewPlotComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: SizeService },
    { type: NgZone }
];
WarpViewPlotComponent.propDecorators = {
    mainPlotDiv: [{ type: ViewChild, args: ['mainPlotDiv', { static: true },] }],
    timeClip: [{ type: ViewChild, args: ['timeClip', { static: true },] }],
    modal: [{ type: ViewChild, args: ['modal', { static: true },] }],
    chart: [{ type: ViewChild, args: ['chart', { static: false },] }],
    gtsPopupModal: [{ type: ViewChild, args: ['gtsPopupModal', { static: false },] }],
    annotation: [{ type: ViewChild, args: ['annotation', { static: false },] }],
    map: [{ type: ViewChild, args: ['map', { static: false },] }],
    timeClipElement: [{ type: ViewChild, args: ['timeClipElement', { static: true },] }],
    GTSTree: [{ type: ViewChild, args: ['GTSTree', { static: true },] }],
    controls: [{ type: ViewChild, args: ['controls', { static: true },] }],
    filterInput: [{ type: ViewChild, args: ['filterInput', { static: true },] }],
    tzSelector: [{ type: ViewChild, args: ['tzSelector', { static: false },] }],
    line: [{ type: ViewChild, args: ['line', { static: false },] }],
    main: [{ type: ViewChild, args: ['main', { static: false },] }],
    type: [{ type: Input, args: ['type',] }],
    gtsFilter: [{ type: Input, args: ['gtsFilter',] }],
    isAlone: [{ type: Input, args: ['isAlone',] }],
    initialChartHeight: [{ type: Input, args: ['initialChartHeight',] }],
    initialMapHeight: [{ type: Input, args: ['initialMapHeight',] }],
    warpViewChartResize: [{ type: Output, args: ['warpViewChartResize',] }],
    handleKeydown: [{ type: HostListener, args: ['keydown', ['$event'],] }]
};
if (false) {
    /** @type {?} */
    WarpViewPlotComponent.prototype.mainPlotDiv;
    /** @type {?} */
    WarpViewPlotComponent.prototype.timeClip;
    /** @type {?} */
    WarpViewPlotComponent.prototype.modal;
    /** @type {?} */
    WarpViewPlotComponent.prototype.chart;
    /** @type {?} */
    WarpViewPlotComponent.prototype.gtsPopupModal;
    /** @type {?} */
    WarpViewPlotComponent.prototype.annotation;
    /** @type {?} */
    WarpViewPlotComponent.prototype.map;
    /** @type {?} */
    WarpViewPlotComponent.prototype.timeClipElement;
    /** @type {?} */
    WarpViewPlotComponent.prototype.GTSTree;
    /** @type {?} */
    WarpViewPlotComponent.prototype.controls;
    /** @type {?} */
    WarpViewPlotComponent.prototype.filterInput;
    /** @type {?} */
    WarpViewPlotComponent.prototype.tzSelector;
    /** @type {?} */
    WarpViewPlotComponent.prototype.line;
    /** @type {?} */
    WarpViewPlotComponent.prototype.main;
    /**
     * @type {?}
     * @private
     */
    WarpViewPlotComponent.prototype.showLine;
    /**
     * @type {?}
     * @private
     */
    WarpViewPlotComponent.prototype.left;
    /** @type {?} */
    WarpViewPlotComponent.prototype.isAlone;
    /** @type {?} */
    WarpViewPlotComponent.prototype.initialChartHeight;
    /** @type {?} */
    WarpViewPlotComponent.prototype.initialMapHeight;
    /** @type {?} */
    WarpViewPlotComponent.prototype.warpViewChartResize;
    /** @type {?} */
    WarpViewPlotComponent.prototype._options;
    /** @type {?} */
    WarpViewPlotComponent.prototype._toHide;
    /** @type {?} */
    WarpViewPlotComponent.prototype.showChart;
    /** @type {?} */
    WarpViewPlotComponent.prototype.showMap;
    /** @type {?} */
    WarpViewPlotComponent.prototype.timeClipValue;
    /** @type {?} */
    WarpViewPlotComponent.prototype.kbdLastKeyPressed;
    /** @type {?} */
    WarpViewPlotComponent.prototype.warningMessage;
    /** @type {?} */
    WarpViewPlotComponent.prototype.loading;
    /** @type {?} */
    WarpViewPlotComponent.prototype.gtsIdList;
    /**
     * @type {?}
     * @private
     */
    WarpViewPlotComponent.prototype.kbdCounter;
    /**
     * @type {?}
     * @private
     */
    WarpViewPlotComponent.prototype.gtsFilterCount;
    /**
     * @type {?}
     * @private
     */
    WarpViewPlotComponent.prototype.gtsBrowserIndex;
    /**
     * @type {?}
     * @private
     */
    WarpViewPlotComponent.prototype._gtsFilter;
    /**
     * @type {?}
     * @private
     */
    WarpViewPlotComponent.prototype._type;
    /**
     * @type {?}
     * @private
     */
    WarpViewPlotComponent.prototype.chartBounds;
    /**
     * @type {?}
     * @private
     */
    WarpViewPlotComponent.prototype.preventDefaultKeyList;
    /**
     * @type {?}
     * @private
     */
    WarpViewPlotComponent.prototype.preventDefaultKeyListInModals;
    /** @type {?} */
    WarpViewPlotComponent.prototype.gtsList;
    /** @type {?} */
    WarpViewPlotComponent.prototype.el;
    /** @type {?} */
    WarpViewPlotComponent.prototype.renderer;
    /** @type {?} */
    WarpViewPlotComponent.prototype.sizeService;
    /** @type {?} */
    WarpViewPlotComponent.prototype.ngZone;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *
 */
class WarpViewResizeComponent {
    /**
     * @param {?} el
     * @param {?} renderer
     */
    constructor(el, renderer) {
        this.el = el;
        this.renderer = renderer;
        this.minHeight = '10';
        this.initialHeight = 100;
        this.resize = new EventEmitter();
        this.dragging = false;
        this._debug = false;
        this.LOG = new Logger(WarpViewResizeComponent, this._debug);
    }
    /**
     * @param {?} debug
     * @return {?}
     */
    set debug(debug) {
        this._debug = debug;
        this.LOG.setDebug(debug);
    }
    /**
     * @return {?}
     */
    get debug() {
        return this._debug;
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.LOG.debug(['ngAfterViewInit'], this.initialHeight);
        this.renderer.setStyle(this.wrapper.nativeElement, 'height', this.initialHeight + 'px');
        // the click event on the handlebar attach mousemove and mouseup events to document.
        this.handleDiv.nativeElement.addEventListener('mousedown', (/**
         * @param {?} ev
         * @return {?}
         */
        (ev) => {
            if (0 === ev.button) {
                // keep left click only
                this.moveListener = this.handleDraggingMove.bind(this);
                this.clickUpListener = this.handleDraggingEnd.bind(this);
                document.addEventListener('mousemove', this.moveListener, false);
                document.addEventListener('mouseup', this.clickUpListener, false);
            }
        }));
    }
    /**
     * @private
     * @return {?}
     */
    handleDraggingEnd() {
        this.dragging = false;
        // the mouseup detach mousemove and mouseup events from document.
        if (this.moveListener) {
            document.removeEventListener('mousemove', this.moveListener, false);
            this.moveListener = null;
        }
        if (this.clickUpListener) {
            document.removeEventListener('mouseup', this.clickUpListener, false);
            this.clickUpListener = null;
        }
    }
    /**
     * @private
     * @param {?} ev
     * @return {?}
     */
    handleDraggingMove(ev) {
        ev.preventDefault();
        this.LOG.debug(['handleDraggingMove'], ev);
        // compute Y of the parent div top relative to page
        /** @type {?} */
        const yTopParent = this.handleDiv.nativeElement.parentElement.getBoundingClientRect().top
            - document.body.getBoundingClientRect().top;
        // compute new parent height
        /** @type {?} */
        let h = ev.pageY - yTopParent + this.handleDiv.nativeElement.getBoundingClientRect().height / 2;
        if (h < parseInt(this.minHeight, 10)) {
            h = parseInt(this.minHeight, 10);
        }
        // apply new height
        this.renderer.setStyle(this.handleDiv.nativeElement.parentElement, 'height', h + 'px');
        this.LOG.debug(['handleDraggingMove'], h);
        this.resize.emit(h);
    }
}
WarpViewResizeComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-resize',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"wrapper\" #wrapper>\n  <ng-content></ng-content>\n  <div class=\"handle\" #handleDiv></div>\n</div>\n",
                encapsulation: ViewEncapsulation.None,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host .handle,warp-view-resize .handle,warpview-resize .handle{width:100%;height:var(--warp-view-resize-handle-height);background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=);background-color:var(--warp-view-resize-handle-color);background-repeat:no-repeat;background-position:50%;position:absolute;bottom:0}:host .handle:hover,warp-view-resize .handle:hover,warpview-resize .handle:hover{cursor:row-resize}:host .wrapper,warp-view-resize .wrapper,warpview-resize .wrapper{width:100%;position:relative;padding-bottom:var(--warp-view-resize-handle-height);height:100%}"]
            }] }
];
/** @nocollapse */
WarpViewResizeComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 }
];
WarpViewResizeComponent.propDecorators = {
    handleDiv: [{ type: ViewChild, args: ['handleDiv', { static: true },] }],
    wrapper: [{ type: ViewChild, args: ['wrapper', { static: true },] }],
    minHeight: [{ type: Input, args: ['minHeight',] }],
    initialHeight: [{ type: Input, args: ['initialHeight',] }],
    debug: [{ type: Input, args: ['debug',] }],
    resize: [{ type: Output, args: ['resize',] }]
};
if (false) {
    /** @type {?} */
    WarpViewResizeComponent.prototype.handleDiv;
    /** @type {?} */
    WarpViewResizeComponent.prototype.wrapper;
    /** @type {?} */
    WarpViewResizeComponent.prototype.minHeight;
    /** @type {?} */
    WarpViewResizeComponent.prototype.initialHeight;
    /** @type {?} */
    WarpViewResizeComponent.prototype.resize;
    /**
     * @type {?}
     * @private
     */
    WarpViewResizeComponent.prototype.dragging;
    /**
     * @type {?}
     * @private
     */
    WarpViewResizeComponent.prototype.moveListener;
    /**
     * @type {?}
     * @private
     */
    WarpViewResizeComponent.prototype.clickUpListener;
    /**
     * @type {?}
     * @private
     */
    WarpViewResizeComponent.prototype.LOG;
    /**
     * @type {?}
     * @private
     */
    WarpViewResizeComponent.prototype._debug;
    /**
     * @type {?}
     * @private
     */
    WarpViewResizeComponent.prototype.el;
    /**
     * @type {?}
     * @private
     */
    WarpViewResizeComponent.prototype.renderer;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *
 */
class WarpViewSliderComponent {
    constructor() {
        this.mode = 'timestamp';
        this.change = new EventEmitter();
        this.show = false;
        this._step = 0;
        this.loaded = false;
        this.manualRefresh = new EventEmitter();
        this._debug = false;
        this.LOG = new Logger(WarpViewSliderComponent, this.debug);
        this.LOG.debug(['constructor'], this.debug);
    }
    /**
     * @param {?} m
     * @return {?}
     */
    set min(m) {
        this.LOG.debug(['min'], m);
        this._min = m;
        this.setOptions();
    }
    /**
     * @return {?}
     */
    get min() {
        return this._min;
    }
    /**
     * @param {?} m
     * @return {?}
     */
    set max(m) {
        this.LOG.debug(['max'], m);
        this._max = m;
        this.setOptions();
    }
    /**
     * @return {?}
     */
    get max() {
        return this._max;
    }
    /**
     * @param {?} step
     * @return {?}
     */
    set step(step) {
        this.LOG.debug(['step'], step);
        if (this._step !== step) {
            this._step = step;
            this.setOptions();
        }
    }
    /**
     * @return {?}
     */
    get step() {
        return this._step;
    }
    /**
     * @param {?} debug
     * @return {?}
     */
    set debug(debug) {
        this._debug = debug;
        this.LOG.setDebug(debug);
    }
    /**
     * @return {?}
     */
    get debug() {
        return this._debug;
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.loaded = false;
        this.setOptions();
    }
    /**
     * @protected
     * @return {?}
     */
    setOptions() {
        if (!this._min && !this._max) {
            return;
        }
        this.LOG.debug(['_step'], this._step);
        /** @type {?} */
        const tmpVAl = Math.min(Math.max(this.value || Number.MIN_VALUE, this._min), this._max);
        if (tmpVAl !== this.value && this.loaded) {
            this.change.emit(tmpVAl);
        }
        this.value = tmpVAl;
        this.loaded = true;
        this.LOG.debug(['noUiSlider'], this.slider);
        if (this.slider) {
            if (!this._uiSlider) {
                /** @type {?} */
                const opts = (/** @type {?} */ ({
                    start: [this.value + 1],
                    tooltips: [this.getFormat()],
                    range: { min: [this._min], max: [this._max] }
                }));
                if (!!this._step && this._step > 0) {
                    opts.step = Math.floor((this._max - this._min) / this._step);
                }
                this._uiSlider = create(this.slider.nativeElement, opts);
                this._uiSlider.on('end', (/**
                 * @param {?} event
                 * @return {?}
                 */
                event => {
                    this.LOG.debug(['onChange'], event);
                    this.value = parseInt(event[0], 10);
                    this.change.emit({ value: parseInt(event[0], 10) });
                }));
            }
            else {
                this.updateSliderOptions();
            }
        }
    }
    /**
     * @protected
     * @return {?}
     */
    updateSliderOptions() {
        // tslint:disable-next-line:no-string-literal
        this.slider.nativeElement['noUiSlider'].set([this.value]);
        /** @type {?} */
        const opts = (/** @type {?} */ ({ range: { min: [this._min], max: [this._max] } }));
        if (!!this._step && this._step > 0) {
            opts.step = Math.floor((this._max - this._min) / this._step);
        }
        // tslint:disable-next-line:no-string-literal
        this.slider.nativeElement['noUiSlider'].updateOptions(opts);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    format(value) {
        if (this.mode !== 'timestamp') {
            return moment(value).utc(true).format('YYYY/MM/DD hh:mm:ss');
        }
        else {
            return value.toString();
        }
    }
    /**
     * @protected
     * @return {?}
     */
    getFormat() {
        return {
            to: (/**
             * @param {?} value
             * @return {?}
             */
            value => this.format(value)),
            from: (/**
             * @param {?} value
             * @return {?}
             */
            value => value.replace(',-', ''))
        };
    }
}
WarpViewSliderComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-slider',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"custom-slider\" *ngIf=\"loaded\">\n  <div style=\"display: flex; width: 100%;justify-content: flex-start;\">\n    <div>{{format(_min)}}</div>\n    <div #slider style=\"flex-grow: 4\"></div>\n    <div>{{format(_max)}}</div>\n  </div>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.noUi-origin{left:100%}.noUi-target{max-width:100%;margin:0 20px 40px}.noUi-connect{left:0;background:var(--warp-slider-connect-color)}.noUi-handle{background:var(--warp-slider-handle-bg-color);border:1px solid var(--warp-slider-handle-color);border-radius:3px;cursor:pointer;box-shadow:var(--warp-slider-handle-shadow)}.noUi-handle:after,.noUi-handle:before{background:var(--warp-slider-handle-color)}.noUi-tooltip{display:none}.noUi-active .noUi-tooltip{display:block}:host .custom-slider{margin-top:50px}"]
            }] }
];
/** @nocollapse */
WarpViewSliderComponent.ctorParameters = () => [];
WarpViewSliderComponent.propDecorators = {
    slider: [{ type: ViewChild, args: ['slider', { static: false },] }],
    min: [{ type: Input, args: ['min',] }],
    max: [{ type: Input, args: ['max',] }],
    value: [{ type: Input, args: ['value',] }],
    step: [{ type: Input, args: ['step',] }],
    mode: [{ type: Input, args: ['mode',] }],
    debug: [{ type: Input, args: ['debug',] }],
    change: [{ type: Output, args: ['change',] }]
};
if (false) {
    /** @type {?} */
    WarpViewSliderComponent.prototype.slider;
    /** @type {?} */
    WarpViewSliderComponent.prototype.value;
    /** @type {?} */
    WarpViewSliderComponent.prototype.mode;
    /** @type {?} */
    WarpViewSliderComponent.prototype.change;
    /** @type {?} */
    WarpViewSliderComponent.prototype._min;
    /** @type {?} */
    WarpViewSliderComponent.prototype._max;
    /** @type {?} */
    WarpViewSliderComponent.prototype.show;
    /**
     * @type {?}
     * @protected
     */
    WarpViewSliderComponent.prototype._uiSlider;
    /**
     * @type {?}
     * @protected
     */
    WarpViewSliderComponent.prototype._step;
    /**
     * @type {?}
     * @protected
     */
    WarpViewSliderComponent.prototype.LOG;
    /** @type {?} */
    WarpViewSliderComponent.prototype.loaded;
    /**
     * @type {?}
     * @protected
     */
    WarpViewSliderComponent.prototype.manualRefresh;
    /**
     * @type {?}
     * @protected
     */
    WarpViewSliderComponent.prototype._debug;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *
 */
class WarpViewRangeSliderComponent extends WarpViewSliderComponent {
    constructor() {
        super();
        this.LOG = new Logger(WarpViewRangeSliderComponent, this.debug);
        this.LOG.debug(['constructor'], this.debug);
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.setOptions();
        this.minValue = this.minValue || this._min;
        this.maxValue = this.maxValue || this._max;
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.loaded = false;
        this.setOptions();
    }
    /**
     * @param {?} val
     * @return {?}
     */
    onChange(val) {
        this.change.emit({ value: this.minValue, highValue: this.maxValue });
        this.LOG.debug(['onChange'], val, { value: this.minValue, highValue: this.maxValue });
    }
    /**
     * @protected
     * @return {?}
     */
    setOptions() {
        this.LOG.debug(['setOptions'], this._min, this._max);
        if (!this._min && !this._max) {
            return;
        }
        this.loaded = true;
        this.value = Math.max(this.value || Number.MIN_VALUE, this._min);
        this.LOG.debug(['noUiSlider'], this.slider);
        if (this.slider) {
            if (!this._uiSlider) {
                /** @type {?} */
                const opts = (/** @type {?} */ ({
                    start: [this.minValue, this.maxValue],
                    connect: true,
                    tooltips: [this.getFormat(), this.getFormat()],
                    range: { min: [this._min], max: [this._max] }
                }));
                if (!!this._step && this._step > 0) {
                    opts.step = Math.floor((this._max - this._min) / this._step);
                }
                /** @type {?} */
                const uiSlider = create(this.slider.nativeElement, opts);
                uiSlider.on('end', (/**
                 * @param {?} event
                 * @return {?}
                 */
                event => {
                    this.LOG.debug(['onChange'], event);
                    this.change.emit({
                        min: parseInt(event[0], 10),
                        max: parseInt(event[1], 10)
                    });
                }));
            }
            else {
                this.updateSliderOptions();
            }
        }
    }
}
WarpViewRangeSliderComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-range-slider',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"custom-slider\" *ngIf=\"loaded\">\n  <div style=\"display: flex; width: 100%;justify-content: flex-start;\">\n    <div>{{format(_min)}}</div>\n    <div #slider style=\"flex-grow: 4\"></div>\n    <div>{{format(_max)}}</div>\n  </div>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.noUi-origin{left:100%}.noUi-target{max-width:100%;margin:0 20px 40px}.noUi-connect{left:0;background:var(--warp-slider-connect-color)}.noUi-handle{background:var(--warp-slider-handle-bg-color);border:1px solid var(--warp-slider-handle-color);border-radius:3px;cursor:pointer;box-shadow:var(--warp-slider-handle-shadow)}.noUi-handle:after,.noUi-handle:before{background:var(--warp-slider-handle-color)}.noUi-tooltip{display:none}.noUi-active .noUi-tooltip{display:block}:host .custom-slider{margin-top:50px}"]
            }] }
];
/** @nocollapse */
WarpViewRangeSliderComponent.ctorParameters = () => [];
WarpViewRangeSliderComponent.propDecorators = {
    slider: [{ type: ViewChild, args: ['slider', { static: false },] }],
    minValue: [{ type: Input, args: ['minValue',] }],
    maxValue: [{ type: Input, args: ['maxValue',] }]
};
if (false) {
    /** @type {?} */
    WarpViewRangeSliderComponent.prototype.slider;
    /** @type {?} */
    WarpViewRangeSliderComponent.prototype.minValue;
    /** @type {?} */
    WarpViewRangeSliderComponent.prototype.maxValue;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class WarpViewSpectrumComponent extends WarpViewComponent {
    /**
     * @param {?} el
     * @param {?} renderer
     * @param {?} sizeService
     * @param {?} ngZone
     */
    constructor(el, renderer, sizeService, ngZone) {
        super(el, renderer, sizeService, ngZone);
        this.el = el;
        this.renderer = renderer;
        this.sizeService = sizeService;
        this.ngZone = ngZone;
        this.layout = {
            showlegend: false,
            xaxis: {},
            yaxis: {},
            margin: {
                t: 10,
                b: 25,
                r: 10,
                l: 50
            }
        };
        this._type = 'histogram2d';
        this.visibility = [];
        this.visibilityStatus = 'unknown';
        this.maxTick = 0;
        this.minTick = 0;
        this.visibleGtsId = [];
        this.LOG = new Logger(WarpViewSpectrumComponent, this._debug);
    }
    /**
     * @param {?} type
     * @return {?}
     */
    set type(type) {
        this._type = type;
        this.drawChart();
    }
    /**
     * @param {?} options
     * @return {?}
     */
    update(options) {
        this.drawChart();
    }
    /**
     * @private
     * @return {?}
     */
    drawChart() {
        if (!this.initChart(this.el)) {
            return;
        }
        this.plotlyConfig.scrollZoom = true;
        this.buildGraph();
    }
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    convert(data) {
        /** @type {?} */
        const type = this._options.histo || { histnorm: 'density', histfunc: 'count' };
        /** @type {?} */
        const dataset = [];
        this.LOG.debug(['convert'], this._options);
        this.visibility = [];
        /** @type {?} */
        let gtsList = GTSLib.flatDeep(GTSLib.flattenGtsIdArray((/** @type {?} */ ([data.data])), 0).res) || [];
        this.maxTick = Number.NEGATIVE_INFINITY;
        this.minTick = Number.POSITIVE_INFINITY;
        this.visibleGtsId = [];
        /** @type {?} */
        const nonPlottable = gtsList.filter((/**
         * @param {?} g
         * @return {?}
         */
        g => {
            this.LOG.debug(['convert'], GTSLib.isGtsToPlot(g));
            return (g.v && !GTSLib.isGtsToPlot(g));
        }));
        gtsList = gtsList.filter((/**
         * @param {?} g
         * @return {?}
         */
        g => {
            return (g.v && GTSLib.isGtsToPlot(g));
        }));
        // initialize visibility status
        if (this.visibilityStatus === 'unknown') {
            this.visibilityStatus = gtsList.length > 0 ? 'plottableShown' : 'nothingPlottable';
        }
        if (this._options.timeMode && this._options.timeMode === 'timestamp') {
            this.layout.xaxis.type = 'linear';
        }
        else {
            this.layout.xaxis.type = 'date';
        }
        gtsList.forEach((/**
         * @param {?} gts
         * @param {?} i
         * @return {?}
         */
        (gts, i) => {
            if (gts.v && GTSLib.isGtsToPlot(gts)) {
                /** @type {?} */
                const label = GTSLib.serializeGtsMetadata(gts);
                /** @type {?} */
                const c = ColorLib.getColor(i, this._options.scheme);
                /** @type {?} */
                const color = ((data.params || [])[gts.id] || { datasetColor: c }).datasetColor || c;
                /** @type {?} */
                const series = {
                    type: this._type,
                    histnorm: type.histnorm || 'density',
                    histfunc: type.histfunc || 'count',
                    contours: {
                        showlabels: true,
                        labelfont: {
                            color: 'white'
                        }
                    },
                    colorbar: {
                        tickcolor: this.getGridColor(this.el.nativeElement),
                        thickness: 0,
                        tickfont: {
                            color: this.getLabelColor(this.el.nativeElement)
                        },
                        x: 1 + gts.id / 20,
                        xpad: 0
                    },
                    showscale: this.showLegend,
                    colorscale: ColorLib.getColorGradient(gts.id, this._options.scheme),
                    autocolorscale: false,
                    name: label,
                    text: label,
                    x: [],
                    y: [],
                    line: { color },
                    hoverinfo: 'none',
                    connectgaps: false,
                    visible: this._hiddenData.filter((/**
                     * @param {?} h
                     * @return {?}
                     */
                    h => h === gts.id)).length >= 0,
                };
                gts.v.forEach((/**
                 * @param {?} value
                 * @return {?}
                 */
                value => {
                    /** @type {?} */
                    const ts = value[0];
                    series.y.push(value[value.length - 1]);
                    if (this._options.timeMode && this._options.timeMode === 'timestamp') {
                        series.x.push(ts);
                    }
                    else {
                        series.x.push(moment__default.tz(moment__default.utc(ts / this.divider), this._options.timeZone).toISOString());
                    }
                }));
                dataset.push(series);
            }
        }));
        this.LOG.debug(['convert', 'dataset'], dataset);
        return dataset;
    }
    /**
     * @private
     * @return {?}
     */
    buildGraph() {
        this.LOG.debug(['drawChart', 'this.layout'], this.responsive);
        this.LOG.debug(['drawChart', 'this.layout'], this.layout);
        this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig);
        this.layout.showlegend = this.showLegend;
        this.layout.yaxis.color = this.getGridColor(this.el.nativeElement);
        this.layout.xaxis.color = this.getGridColor(this.el.nativeElement);
        this.loading = false;
    }
}
WarpViewSpectrumComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-spectrum',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\" #chartContainer>\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-plotly #graph\n                     [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot()\"\n                     (relayout)=\"relayout($event)\" (hover)=\"hover($event)\" (unhover)=\"unhover($event)\"\n                     [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                     [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n  <div #toolTip class=\"tooltip\" [ngStyle]=\"getTooltipPosition()\"></div>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}.tooltip{background-color:var(--warp-view-chart-legend-bg)!important;color:var(--warp-view-chart-legend-color)!important;text-align:left;position:absolute;display:none;padding:10px;border:1px solid grey;border-radius:5px;box-shadow:none;pointer-events:none;font-size:10px;min-width:100px;width:auto;max-width:50%;z-index:999;height:auto!important;left:-1000px}.tooltip .chip{border-radius:50%;background-color:#bbb;display:inline-block;width:5px;height:5px;border:2px solid #454545;margin-top:auto;margin-bottom:auto;vertical-align:middle;cursor:pointer}:host{display:block;height:100%}:host #chartContainer{height:100%}:host #chartContainer div{height:100%}:host div.chart{width:var(--warp-view-chart-width);height:var(--warp-view-chart-height)}:host .executionErrorText{color:red;padding:10px;border-radius:3px;background:#faebd7;position:absolute;top:-30px;border:2px solid red}"]
            }] }
];
/** @nocollapse */
WarpViewSpectrumComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: SizeService },
    { type: NgZone }
];
WarpViewSpectrumComponent.propDecorators = {
    type: [{ type: Input, args: ['type',] }]
};
if (false) {
    /** @type {?} */
    WarpViewSpectrumComponent.prototype.layout;
    /**
     * @type {?}
     * @private
     */
    WarpViewSpectrumComponent.prototype._type;
    /**
     * @type {?}
     * @private
     */
    WarpViewSpectrumComponent.prototype.visibility;
    /**
     * @type {?}
     * @private
     */
    WarpViewSpectrumComponent.prototype.visibilityStatus;
    /**
     * @type {?}
     * @private
     */
    WarpViewSpectrumComponent.prototype.maxTick;
    /**
     * @type {?}
     * @private
     */
    WarpViewSpectrumComponent.prototype.minTick;
    /**
     * @type {?}
     * @private
     */
    WarpViewSpectrumComponent.prototype.visibleGtsId;
    /** @type {?} */
    WarpViewSpectrumComponent.prototype.el;
    /** @type {?} */
    WarpViewSpectrumComponent.prototype.renderer;
    /** @type {?} */
    WarpViewSpectrumComponent.prototype.sizeService;
    /** @type {?} */
    WarpViewSpectrumComponent.prototype.ngZone;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class WarpViewBoxComponent extends WarpViewComponent {
    /**
     * @param {?} el
     * @param {?} renderer
     * @param {?} sizeService
     * @param {?} ngZone
     */
    constructor(el, renderer, sizeService, ngZone) {
        super(el, renderer, sizeService, ngZone);
        this.el = el;
        this.renderer = renderer;
        this.sizeService = sizeService;
        this.ngZone = ngZone;
        this.layout = {
            showlegend: false,
            xaxis: {
                type: '-'
            },
            yaxis: { zeroline: false },
            boxmode: 'group',
            margin: {
                t: 10,
                b: 25,
                r: 10,
                l: 10
            }
        };
        this._type = 'box';
        this.LOG = new Logger(WarpViewBoxComponent, this._debug);
    }
    /**
     * @param {?} type
     * @return {?}
     */
    set type(type) {
        this._type = type;
        this.drawChart();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.drawChart();
    }
    /**
     * @param {?} options
     * @return {?}
     */
    update(options) {
        this.drawChart();
    }
    /**
     * @private
     * @return {?}
     */
    drawChart() {
        if (!this.initChart(this.el)) {
            return;
        }
        this.plotlyConfig.scrollZoom = true;
        this.buildGraph();
    }
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    convert(data) {
        /** @type {?} */
        const dataset = [];
        this.LOG.debug(['convert'], this._options, this._type);
        /** @type {?} */
        let gtsList = GTSLib.flatDeep(GTSLib.flattenGtsIdArray((/** @type {?} */ (data.data)), 0).res);
        gtsList = gtsList.filter((/**
         * @param {?} g
         * @return {?}
         */
        g => {
            return (g.v && GTSLib.isGtsToPlot(g));
        }));
        /** @type {?} */
        const pattern = 'YYYY/MM/DD hh:mm:ss';
        /** @type {?} */
        const format = pattern.slice(0, pattern.lastIndexOf(this._options.split || 'D') + 1);
        gtsList.forEach((/**
         * @param {?} gts
         * @param {?} i
         * @return {?}
         */
        (gts, i) => {
            if (gts.v) {
                /** @type {?} */
                const label = GTSLib.serializeGtsMetadata(gts);
                /** @type {?} */
                const c = ColorLib.getColor(gts.id, this._options.scheme);
                /** @type {?} */
                const color = ((data.params || [])[i] || { datasetColor: c }).datasetColor || c;
                /** @type {?} */
                const series = {
                    type: 'box',
                    boxmean: 'sd',
                    marker: { color },
                    name: label,
                    x: this._type === 'box' ? undefined : [],
                    y: [],
                    //  hoverinfo: 'none',
                    boxpoints: false
                };
                if (!!this._options.showDots) {
                    series.boxpoints = 'all';
                }
                gts.v.forEach((/**
                 * @param {?} value
                 * @return {?}
                 */
                value => {
                    series.y.push(value[value.length - 1]);
                    if (this._type === 'box-date') {
                        series.x.push(moment__default.tz(moment__default.utc(value[0] / this.divider), this._options.timeZone).toISOString());
                    }
                }));
                dataset.push(series);
            }
        }));
        this.LOG.debug(['convert', 'dataset'], dataset, format);
        return dataset;
    }
    /**
     * @private
     * @return {?}
     */
    buildGraph() {
        this.LOG.debug(['drawChart', 'this.layout'], this.responsive);
        this.LOG.debug(['drawChart', 'this.layout'], this.layout);
        this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig);
        this.layout.showlegend = this.showLegend;
        this.layout.xaxis.showticklabels = this._type === 'box-date';
        this.layout.yaxis.color = this.getGridColor(this.el.nativeElement);
        this.layout.xaxis.color = this.getGridColor(this.el.nativeElement);
        this.loading = false;
    }
    /**
     * @param {?} data
     * @return {?}
     */
    hover(data) {
    }
}
WarpViewBoxComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-box',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\" #chartContainer>\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-plotly #graph *ngIf=\"plotlyData?.length > 0\"\n                     [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot()\"\n                     className=\"chart\" (hover)=\"hover($event)\" (unhover)=\"unhover($event)\"\n                     [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                     [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n  <div #toolTip class=\"tooltip\" [ngStyle]=\"getTooltipPosition()\"></div>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}.tooltip{background-color:var(--warp-view-chart-legend-bg)!important;color:var(--warp-view-chart-legend-color)!important;text-align:left;position:absolute;display:none;padding:10px;border:1px solid grey;border-radius:5px;box-shadow:none;pointer-events:none;font-size:10px;min-width:100px;width:auto;max-width:50%;z-index:999;height:auto!important;left:-1000px}.tooltip .chip{border-radius:50%;background-color:#bbb;display:inline-block;width:5px;height:5px;border:2px solid #454545;margin-top:auto;margin-bottom:auto;vertical-align:middle;cursor:pointer}:host{display:block;height:100%}:host #chartContainer{height:100%}:host #chartContainer div{height:100%}:host div.chart{width:var(--warp-view-chart-width);height:var(--warp-view-chart-height)}"]
            }] }
];
/** @nocollapse */
WarpViewBoxComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: SizeService },
    { type: NgZone }
];
WarpViewBoxComponent.propDecorators = {
    type: [{ type: Input, args: ['type',] }]
};
if (false) {
    /** @type {?} */
    WarpViewBoxComponent.prototype.layout;
    /**
     * @type {?}
     * @private
     */
    WarpViewBoxComponent.prototype._type;
    /** @type {?} */
    WarpViewBoxComponent.prototype.el;
    /** @type {?} */
    WarpViewBoxComponent.prototype.renderer;
    /** @type {?} */
    WarpViewBoxComponent.prototype.sizeService;
    /** @type {?} */
    WarpViewBoxComponent.prototype.ngZone;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class WarpView3dLineComponent extends WarpViewComponent {
    /**
     * @param {?} el
     * @param {?} renderer
     * @param {?} sizeService
     * @param {?} ngZone
     */
    constructor(el, renderer, sizeService, ngZone) {
        super(el, renderer, sizeService, ngZone);
        this.el = el;
        this.renderer = renderer;
        this.sizeService = sizeService;
        this.ngZone = ngZone;
        this.layout = {
            showlegend: false,
            xaxis: {},
            yaxis: {},
            zaxis: {},
            margin: {
                t: 10,
                b: 25,
                r: 10,
                l: 10
            }
        };
        this._type = 'line3d';
        this.LOG = new Logger(WarpView3dLineComponent, this._debug);
    }
    /**
     * @param {?} type
     * @return {?}
     */
    set type(type) {
        this._type = type;
        this.drawChart();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.drawChart();
    }
    /**
     * @param {?} options
     * @return {?}
     */
    update(options) {
        this.drawChart();
    }
    /**
     * @private
     * @return {?}
     */
    drawChart() {
        if (!this.initChart(this.el)) {
            return;
        }
        this.plotlyConfig.scrollZoom = true;
        this.buildGraph();
    }
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    convert(data) {
        /** @type {?} */
        const dataset = [];
        this.LOG.debug(['convert'], data, this._options, this._type);
        GTSLib.flatDeep(GTSLib.flattenGtsIdArray((/** @type {?} */ (data.data)), 0).res)
            .filter((/**
         * @param {?} g
         * @return {?}
         */
        g => (g.v && GTSLib.isGts(g))))
            .forEach((/**
         * @param {?} gts
         * @param {?} i
         * @return {?}
         */
        (gts, i) => {
            if (gts.v) {
                /** @type {?} */
                const label = GTSLib.serializeGtsMetadata(gts);
                /** @type {?} */
                const c = ColorLib.getColor(gts.id, this._options.scheme);
                /** @type {?} */
                const color = ((data.params || [])[i] || { datasetColor: c }).datasetColor || c;
                /** @type {?} */
                const series = {
                    mode: 'line',
                    type: 'scatter3d',
                    marker: {
                        color: ColorLib.transparentize(color),
                        size: 3,
                        symbol: 'circle',
                        line: {
                            color,
                            width: 0
                        }
                    },
                    line: {
                        color,
                        width: 1
                    },
                    name: label,
                    x: [],
                    y: [],
                    z: [],
                };
                gts.v.forEach((/**
                 * @param {?} value
                 * @return {?}
                 */
                value => {
                    if (value.length > 2) { // lat lon
                        series.x.push(value[1]);
                        series.y.push(value[2]);
                        if (value.length > 4) {
                            series.z.push(value[3]);
                        }
                        else {
                            series.z.push(0);
                        }
                    }
                    else {
                        series.x.push(value[0]);
                        series.y.push(value[1]);
                        series.z.push(0);
                    }
                }));
                dataset.push(series);
            }
        }));
        return dataset;
    }
    /**
     * @private
     * @return {?}
     */
    buildGraph() {
        this.LOG.debug(['drawChart', 'this.layout'], this.responsive);
        this.LOG.debug(['drawChart', 'this.layout'], this.layout);
        this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig);
        this.layout.showlegend = this.showLegend;
        this.layout.yaxis.color = this.getGridColor(this.el.nativeElement);
        this.layout.xaxis.color = this.getGridColor(this.el.nativeElement);
        this.layout.zaxis.color = this.getGridColor(this.el.nativeElement);
        this.loading = false;
    }
}
WarpView3dLineComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-3d-line',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\" #chartContainer>\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-plotly #graph *ngIf=\"plotlyData?.length > 0\"\n                     [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot()\"\n                     className=\"chart\" (hover)=\"hover($event)\" (unhover)=\"unhover($event)\"\n                     [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                     [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n  <div #toolTip class=\"tooltip\" [ngStyle]=\"getTooltipPosition()\"></div>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}.tooltip{background-color:var(--warp-view-chart-legend-bg)!important;color:var(--warp-view-chart-legend-color)!important;text-align:left;position:absolute;display:none;padding:10px;border:1px solid grey;border-radius:5px;box-shadow:none;pointer-events:none;font-size:10px;min-width:100px;width:auto;max-width:50%;z-index:999;height:auto!important;left:-1000px}.tooltip .chip{border-radius:50%;background-color:#bbb;display:inline-block;width:5px;height:5px;border:2px solid #454545;margin-top:auto;margin-bottom:auto;vertical-align:middle;cursor:pointer}:host{display:block;height:100%}:host #chartContainer{height:100%}:host #chartContainer div{height:100%}:host div.chart{width:var(--warp-view-chart-width);height:var(--warp-view-chart-height)}"]
            }] }
];
/** @nocollapse */
WarpView3dLineComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: SizeService },
    { type: NgZone }
];
WarpView3dLineComponent.propDecorators = {
    type: [{ type: Input, args: ['type',] }]
};
if (false) {
    /** @type {?} */
    WarpView3dLineComponent.prototype.layout;
    /**
     * @type {?}
     * @private
     */
    WarpView3dLineComponent.prototype._type;
    /** @type {?} */
    WarpView3dLineComponent.prototype.el;
    /** @type {?} */
    WarpView3dLineComponent.prototype.renderer;
    /** @type {?} */
    WarpView3dLineComponent.prototype.sizeService;
    /** @type {?} */
    WarpView3dLineComponent.prototype.ngZone;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class WarpViewGlobeComponent extends WarpViewComponent {
    /**
     * @param {?} el
     * @param {?} renderer
     * @param {?} sizeService
     * @param {?} ngZone
     */
    constructor(el, renderer, sizeService, ngZone) {
        super(el, renderer, sizeService, ngZone);
        this.el = el;
        this.renderer = renderer;
        this.sizeService = sizeService;
        this.ngZone = ngZone;
        this.layout = {
            showlegend: false,
            margin: {
                t: 10,
                b: 25,
                r: 10,
                l: 10
            },
            geo: {
                projection: {
                    type: 'orthographic',
                },
                showframe: true,
                fitbounds: 'locations',
                showocean: true,
                oceancolor: ColorLib.transparentize('#004eff', 0.2),
                showland: true,
                landcolor: ColorLib.transparentize('#6F694E', 0.2),
                showlakes: true,
                lakecolor: ColorLib.transparentize('#004eff', 0.2),
                showcountries: true,
                lonaxis: {
                    showgrid: true,
                    gridcolor: 'rgb(102, 102, 102)'
                },
                lataxis: {
                    showgrid: true,
                    gridcolor: 'rgb(102, 102, 102)'
                }
            }
        };
        this._type = 'scattergeo';
        this.geoData = [];
        this.LOG = new Logger(WarpViewGlobeComponent, this._debug);
    }
    /**
     * @param {?} type
     * @return {?}
     */
    set type(type) {
        this._type = type;
        this.drawChart();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.drawChart();
    }
    /**
     * @param {?} options
     * @return {?}
     */
    update(options) {
        this.drawChart();
    }
    /**
     * @private
     * @return {?}
     */
    drawChart() {
        if (!this.initChart(this.el)) {
            return;
        }
        this.plotlyConfig.scrollZoom = true;
        this.buildGraph();
    }
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    convert(data) {
        /** @type {?} */
        const dataset = [];
        this.geoData = [];
        this.LOG.debug(['convert'], data, this._options, this._type);
        GTSLib.flatDeep(GTSLib.flattenGtsIdArray((/** @type {?} */ (data.data)), 0).res)
            .filter((/**
         * @param {?} g
         * @return {?}
         */
        g => (g.v && GTSLib.isGts(g))))
            .forEach((/**
         * @param {?} gts
         * @param {?} i
         * @return {?}
         */
        (gts, i) => {
            if (gts.v) {
                /** @type {?} */
                const geoData = { path: [] };
                /** @type {?} */
                const label = GTSLib.serializeGtsMetadata(gts);
                /** @type {?} */
                const c = ColorLib.getColor(gts.id, this._options.scheme);
                /** @type {?} */
                const color = ((data.params || [])[i] || { datasetColor: c }).datasetColor || c;
                /** @type {?} */
                const series = {
                    mode: 'lines',
                    type: 'scattergeo',
                    marker: {
                        color: ColorLib.transparentize(color),
                        size: 3,
                        symbol: 'circle',
                        line: {
                            color,
                            width: 0
                        }
                    },
                    line: {
                        color,
                        width: 1
                    },
                    name: label,
                    lon: [],
                    lat: [],
                    hoverinfo: 'none',
                };
                gts.v.forEach((/**
                 * @param {?} value
                 * @return {?}
                 */
                value => {
                    if (value.length > 2) {
                        series.lat.push(value[1]);
                        series.lon.push(value[2]);
                        geoData.path.push({ lat: value[1], lon: value[2] });
                    }
                }));
                this.geoData.push(geoData);
                dataset.push(series);
            }
        }));
        return dataset;
    }
    /**
     * @private
     * @return {?}
     */
    buildGraph() {
        this.LOG.debug(['drawChart', 'this.layout'], this._responsive);
        this.LOG.debug(['drawChart', 'this.layout'], this.layout);
        this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig);
        this.layout.showlegend = this._showLegend;
        /** @type {?} */
        const bounds = MapLib.getBoundsArray(this.geoData, [], [], []);
        this.LOG.debug(['drawChart', 'bounds'], bounds);
        this.layout.geo.lonaxis.color = this.getGridColor(this.el.nativeElement);
        this.layout.geo.lataxis.range = [bounds[0][0], bounds[1][0]];
        this.layout.geo.lonaxis.range = [bounds[0][1], bounds[1][1]];
        this.layout.geo.lataxis.color = this.getGridColor(this.el.nativeElement);
        this.layout = Object.assign({}, this.layout);
        this.loading = false;
    }
}
WarpViewGlobeComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-globe',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\" #chartContainer>\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-plotly #graph *ngIf=\"plotlyData?.length > 0\"\n                     [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot()\"\n                     className=\"chart\" (hover)=\"hover($event)\" (unhover)=\"unhover($event)\"\n                     [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                     [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n  <div #toolTip class=\"tooltip\" [ngStyle]=\"getTooltipPosition()\"></div>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}.tooltip{background-color:var(--warp-view-chart-legend-bg)!important;color:var(--warp-view-chart-legend-color)!important;text-align:left;position:absolute;display:none;padding:10px;border:1px solid grey;border-radius:5px;box-shadow:none;pointer-events:none;font-size:10px;min-width:100px;width:auto;max-width:50%;z-index:999;height:auto!important;left:-1000px}.tooltip .chip{border-radius:50%;background-color:#bbb;display:inline-block;width:5px;height:5px;border:2px solid #454545;margin-top:auto;margin-bottom:auto;vertical-align:middle;cursor:pointer}:host{display:block;height:100%}:host #chartContainer{height:100%}:host #chartContainer div{height:100%}:host div.chart{width:var(--warp-view-chart-width);height:var(--warp-view-chart-height)}"]
            }] }
];
/** @nocollapse */
WarpViewGlobeComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: SizeService },
    { type: NgZone }
];
WarpViewGlobeComponent.propDecorators = {
    type: [{ type: Input, args: ['type',] }]
};
if (false) {
    /** @type {?} */
    WarpViewGlobeComponent.prototype.layout;
    /**
     * @type {?}
     * @private
     */
    WarpViewGlobeComponent.prototype._type;
    /**
     * @type {?}
     * @private
     */
    WarpViewGlobeComponent.prototype.geoData;
    /** @type {?} */
    WarpViewGlobeComponent.prototype.el;
    /** @type {?} */
    WarpViewGlobeComponent.prototype.renderer;
    /** @type {?} */
    WarpViewGlobeComponent.prototype.sizeService;
    /** @type {?} */
    WarpViewGlobeComponent.prototype.ngZone;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class WarpViewEventDropComponent extends WarpViewComponent {
    /**
     * @param {?} el
     * @param {?} renderer
     * @param {?} sizeService
     * @param {?} ngZone
     */
    constructor(el, renderer, sizeService, ngZone) {
        super(el, renderer, sizeService, ngZone);
        this.el = el;
        this.renderer = renderer;
        this.sizeService = sizeService;
        this.ngZone = ngZone;
        this.pointHover = new EventEmitter();
        this.warpViewChartResize = new EventEmitter();
        this.chartDraw = new EventEmitter();
        this.boundsDidChange = new EventEmitter();
        this.visibility = [];
        this.maxTick = Number.MIN_VALUE;
        this.minTick = Number.MAX_VALUE;
        this.visibleGtsId = [];
        this._type = 'drops';
        this.eventConf = {
            d3,
            axis: {
                verticalGrid: true,
                tickPadding: 6,
            },
            indicator: false,
            label: {
                text: (/**
                 * @param {?} row
                 * @return {?}
                 */
                row => row.name),
            },
            drop: {
                date: (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => new Date(d.date)),
                color: (/**
                 * @param {?} d
                 * @return {?}
                 */
                d => d.color),
                onMouseOver: (/**
                 * @param {?} g
                 * @return {?}
                 */
                g => {
                    this.LOG.debug(['onMouseOver'], g);
                    this.pointHover.emit({
                        x: event$1.offsetX,
                        y: event$1.offsetY
                    });
                    /** @type {?} */
                    const t = select$1(this.toolTip.nativeElement);
                    t.transition()
                        .duration(200)
                        .style('opacity', 1)
                        .style('pointer-events', 'auto');
                    t.html(`<div class="tooltip-body">
<b class="tooltip-date">${this._options.timeMode === 'timestamp'
                        ? g.date
                        : (moment__default(g.date.valueOf()).utc().toISOString() || '')}</b>
<div><i class="chip"  style="background-color: ${ColorLib.transparentize(g.color, 0.7)};border: 2px solid ${g.color};"></i>
${GTSLib.formatLabel(g.name)}: <span class="value">${g.value}</span>
</div></div>`)
                        .style('left', `${event$1.offsetX - 30}px`)
                        .style('top', `${event$1.offsetY + 20}px`);
                }),
                onMouseOut: (/**
                 * @return {?}
                 */
                () => {
                    select(this.toolTip.nativeElement)
                        .transition()
                        .duration(500)
                        .style('opacity', 0)
                        .style('pointer-events', 'none');
                }),
            },
        };
        this.LOG = new Logger(WarpViewEventDropComponent, this._debug);
    }
    /**
     * @param {?} type
     * @return {?}
     */
    set type(type) {
        this._type = type;
        this.drawChart();
    }
    /**
     * @param {?} hiddenData
     * @return {?}
     */
    set hiddenData(hiddenData) {
        /** @type {?} */
        const previousVisibility = JSON.stringify(this.visibility);
        this.LOG.debug(['hiddenData', 'previousVisibility'], previousVisibility);
        this._hiddenData = hiddenData;
        this.visibility = [];
        this.visibleGtsId.forEach((/**
         * @param {?} id
         * @return {?}
         */
        id => this.visibility.push(hiddenData.indexOf(id) < 0 && (id !== -1))));
        this.LOG.debug(['hiddenData', 'hiddendygraphfullv'], this.visibility);
        /** @type {?} */
        const newVisibility = JSON.stringify(this.visibility);
        this.LOG.debug(['hiddenData', 'json'], previousVisibility, newVisibility);
        if (previousVisibility !== newVisibility) {
            this.drawChart();
            this.LOG.debug(['hiddendygraphtrig', 'destroy'], 'redraw by visibility change');
        }
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this._options = this._options || this.defOptions;
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (!!this.elemChart) {
            select(this.elemChart.nativeElement).remove();
        }
    }
    /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    update(options, refresh) {
        this.LOG.debug(['onOptions', 'before'], this._options, options);
        if (!deepEqual(options, this._options)) {
            this.LOG.debug(['options', 'changed'], options);
            this._options = (/** @type {?} */ (ChartLib.mergeDeep(this._options, (/** @type {?} */ (options)))));
        }
        this.drawChart();
    }
    /**
     * @param {?} min
     * @param {?} max
     * @return {?}
     */
    updateBounds(min, max) {
        this.LOG.debug(['updateBounds'], min, max, this._options);
        this._options.bounds.minDate = min;
        this._options.bounds.maxDate = max;
        if (this._options.timeMode && this._options.timeMode === 'timestamp') {
            this.eventConf['range'] = { start: min, end: max };
        }
        else {
            this.eventConf['range'] = {
                start: moment__default.tz(moment__default.utc(this.minTick / this.divider), this._options.timeZone).toDate(),
                end: moment__default.tz(moment__default.utc(this.maxTick / this.divider), this._options.timeZone).toDate(),
            };
        }
        this.eventConf = Object.assign({}, this.eventConf);
        this.LOG.debug(['updateBounds'], this.eventConf);
    }
    /**
     * @return {?}
     */
    drawChart() {
        if (!this.initChart(this.el)) {
            return;
        }
        this.loading = false;
        this.LOG.debug(['drawChart', 'plotlyData'], this.plotlyData, this._type);
        if (this.elemChart.nativeElement) {
            setTimeout((/**
             * @return {?}
             */
            () => select(this.elemChart.nativeElement).data([this.plotlyData]).call(eventDrops(this.eventConf))));
            this.loading = false;
            this.chartDraw.emit();
        }
    }
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    convert(data) {
        this.LOG.debug(['convert'], data);
        /** @type {?} */
        const gtsList = GTSLib.flatDeep((/** @type {?} */ (data.data)));
        /** @type {?} */
        const dataList = [];
        this.LOG.debug(['convert', 'gtsList'], gtsList);
        if (!gtsList || gtsList.length === 0 || gtsList[0].length < 2) {
            return;
        }
        gtsList.forEach((/**
         * @param {?} gts
         * @param {?} i
         * @return {?}
         */
        (gts, i) => {
            /** @type {?} */
            const c = ColorLib.getColor(gts.id || i, this._options.scheme);
            /** @type {?} */
            const color = ((data.params || [])[i] || { datasetColor: c }).datasetColor || c;
            /** @type {?} */
            const dataSet = {
                name: GTSLib.serializeGtsMetadata(gts),
                color,
                data: []
            };
            (gts.v || []).forEach((/**
             * @param {?} value
             * @return {?}
             */
            value => {
                /** @type {?} */
                const ts = value[0];
                this.minTick = Math.min(this.minTick, ts);
                this.maxTick = Math.max(this.maxTick, ts);
                if (this._options.timeMode && this._options.timeMode === 'timestamp') {
                    dataSet.data.push({ date: ts, color, value: value[value.length - 1] });
                }
                else {
                    dataSet.data.push({
                        date: moment__default.tz(moment__default.utc(ts / this.divider), this._options.timeZone).toDate(),
                        color,
                        value: value[value.length - 1],
                        name: dataSet.name
                    });
                }
            }));
            dataList.push(dataSet);
        }));
        this.LOG.debug(['convert', 'dataList'], dataList);
        this.eventConf['range'] = {
            start: moment__default.tz(moment__default.utc(this.minTick / this.divider), this._options.timeZone).toDate(),
            end: moment__default.tz(moment__default.utc(this.maxTick / this.divider), this._options.timeZone).toDate(),
        };
        return dataList;
    }
}
WarpViewEventDropComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-event-drop',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\">\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <div #toolTip class=\"tooltip trimmed\"></div>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div #elemChart style=\"width: 100%;height: 100%\"></div>\n  <div *ngIf=\"!loading && !noData\">\n  </div>\n</div>\n",
                encapsulation: ViewEncapsulation.None,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}:host,warp-view-event-drop,warpview-event-drop{display:block;height:100%;width:100%}:host #chartContainer,warp-view-event-drop #chartContainer,warpview-event-drop #chartContainer{height:100%;width:100%;position:relative}:host div.chart,warp-view-event-drop div.chart,warpview-event-drop div.chart{width:var(--warp-view-chart-width);height:var(--warp-view-chart-height)}:host .tooltip,warp-view-event-drop .tooltip,warpview-event-drop .tooltip{position:absolute;background-color:var(--warp-view-chart-legend-bg)!important;color:var(--warp-view-chart-legend-color)!important;line-height:1.4rem;padding:10px;border:1px solid grey;border-radius:5px;box-shadow:none;pointer-events:none;font-size:10px;min-width:100px;width:auto;z-index:999;height:auto!important;opacity:0}:host .tooltip .chip,warp-view-event-drop .tooltip .chip,warpview-event-drop .tooltip .chip{border-radius:50%;background-color:#bbb;display:inline-block;width:5px;height:5px;border:2px solid #454545;margin-top:auto;margin-bottom:auto;vertical-align:middle;cursor:pointer}"]
            }] }
];
/** @nocollapse */
WarpViewEventDropComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: SizeService },
    { type: NgZone }
];
WarpViewEventDropComponent.propDecorators = {
    elemChart: [{ type: ViewChild, args: ['elemChart', { static: true },] }],
    type: [{ type: Input, args: ['type',] }],
    hiddenData: [{ type: Input, args: ['hiddenData',] }],
    pointHover: [{ type: Output, args: ['pointHover',] }],
    warpViewChartResize: [{ type: Output, args: ['warpViewChartResize',] }],
    chartDraw: [{ type: Output, args: ['chartDraw',] }],
    boundsDidChange: [{ type: Output, args: ['boundsDidChange',] }]
};
if (false) {
    /** @type {?} */
    WarpViewEventDropComponent.prototype.elemChart;
    /** @type {?} */
    WarpViewEventDropComponent.prototype.pointHover;
    /** @type {?} */
    WarpViewEventDropComponent.prototype.warpViewChartResize;
    /** @type {?} */
    WarpViewEventDropComponent.prototype.chartDraw;
    /** @type {?} */
    WarpViewEventDropComponent.prototype.boundsDidChange;
    /**
     * @type {?}
     * @private
     */
    WarpViewEventDropComponent.prototype.visibility;
    /**
     * @type {?}
     * @private
     */
    WarpViewEventDropComponent.prototype.maxTick;
    /**
     * @type {?}
     * @private
     */
    WarpViewEventDropComponent.prototype.minTick;
    /**
     * @type {?}
     * @private
     */
    WarpViewEventDropComponent.prototype.visibleGtsId;
    /**
     * @type {?}
     * @private
     */
    WarpViewEventDropComponent.prototype._type;
    /**
     * @type {?}
     * @private
     */
    WarpViewEventDropComponent.prototype.eventConf;
    /** @type {?} */
    WarpViewEventDropComponent.prototype.el;
    /** @type {?} */
    WarpViewEventDropComponent.prototype.renderer;
    /** @type {?} */
    WarpViewEventDropComponent.prototype.sizeService;
    /** @type {?} */
    WarpViewEventDropComponent.prototype.ngZone;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class WarpViewResultTileComponent extends WarpViewComponent {
    /**
     * @param {?} el
     * @param {?} renderer
     * @param {?} sizeService
     * @param {?} ngZone
     */
    constructor(el, renderer, sizeService, ngZone) {
        super(el, renderer, sizeService, ngZone);
        this.el = el;
        this.renderer = renderer;
        this.sizeService = sizeService;
        this.ngZone = ngZone;
        this.standalone = true;
        this.pointHover = new EventEmitter();
        this.warpViewChartResize = new EventEmitter();
        this.chartDraw = new EventEmitter();
        this.boundsDidChange = new EventEmitter();
        this.loading = true;
        this.graphs = {
            spectrum: ['histogram2dcontour', 'histogram2d'],
            chart: ['line', 'spline', 'step', 'step-after', 'step-before', 'area', 'scatter'],
            pie: ['pie', 'donut'],
            polar: ['polar'],
            radar: ['radar'],
            bar: ['bar'],
            bubble: ['bubble'],
            annotation: ['annotation'],
            'gts-tree': ['gts-tree'],
            datagrid: ['datagrid'],
            display: ['display'],
            drilldown: ['drilldown'],
            image: ['image'],
            map: ['map'],
            gauge: ['gauge', 'bullet'],
            plot: ['plot'],
            box: ['box', 'box-date'],
            line3d: ['line3d'],
            globe: ['globe'],
            drops: ['drops']
        };
        this.LOG = new Logger(WarpViewResultTileComponent, this._debug);
    }
    /**
     * @param {?} type
     * @return {?}
     */
    set type(type) {
        this._type = type;
    }
    /**
     * @return {?}
     */
    get type() {
        if (this.dataModel && this.dataModel.globalParams) {
            return this.dataModel.globalParams.type || this._type || 'plot';
        }
        else {
            return this._type || 'plot';
        }
    }
    /**
     * @protected
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    update(options, refresh) {
        setTimeout((/**
         * @return {?}
         */
        () => this.loading = true));
        this.LOG.debug(['parseGTS', 'data'], this._data);
        this.dataModel = this._data;
        if (!!this.dataModel) {
            this._options = (/** @type {?} */ (ChartLib.mergeDeep(this._options, options)));
            this._options = (/** @type {?} */ (ChartLib.mergeDeep(ChartLib.mergeDeep(this.defOptions, options), this._data ? this._data.globalParams || {} : {})));
            this.LOG.debug(['parseGTS', 'data'], this._data);
            this.dataModel = this._data;
            if (this._options) {
                this._unit = this._options.unit || this._unit;
                this._type = this._options.type || this._type || 'plot';
            }
            this.LOG.debug(['parseGTS', '_type'], this._type);
            setTimeout((/**
             * @return {?}
             */
            () => this.loading = false));
        }
    }
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    convert(data) {
        setTimeout((/**
         * @return {?}
         */
        () => this.loading = true));
        this.LOG.debug(['convert', 'data'], this._data, data);
        this.dataModel = data;
        if (this.dataModel.globalParams) {
            this._unit = this.dataModel.globalParams.unit || this._unit;
            this._type = this.dataModel.globalParams.type || this._type || 'plot';
        }
        this.LOG.debug(['convert', '_type'], this._type);
        return [];
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onResized(event) {
        this.width = event.newWidth;
        this.height = event.newHeight;
        this.LOG.debug(['onResized'], event.newWidth, event.newHeight);
        this.sizeService.change(new Size(this.width, this.height));
    }
    /**
     * @return {?}
     */
    chartDrawn() {
        this.LOG.debug(['chartDrawn']);
        setTimeout((/**
         * @return {?}
         */
        () => this.loading = false));
        this.chartDraw.emit();
    }
}
WarpViewResultTileComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-result-tile',
                template: "<div class=\"wrapper\" [ngClass]=\"{'full':  responsive}\" (resized)=\"onResized($event)\">\n    <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n    <div style=\"height: 100%\" [hidden]=\"loading\">\n      <warpview-spectrum [debug]=\"debug\" [type]=\"type\" [unit]=\"unit\" [options]=\"_options\"\n                         [showLegend]=\"showLegend\" [data]=\"dataModel\" (chartDraw)=\"chartDrawn()\"\n                         *ngIf=\"graphs['spectrum'].indexOf(type) > -1 && dataModel\"\n                         [responsive]=\"true\"></warpview-spectrum>\n\n      <warpview-chart [debug]=\"debug\" [type]=\"type\" [unit]=\"unit\" [options]=\"_options\"\n                      (chartDraw)=\"chartDrawn()\"\n                      [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                      *ngIf=\"graphs['chart'].indexOf(type) > -1 && dataModel\"\n                      [responsive]=\"true\"></warpview-chart>\n\n      <warpview-plot [debug]=\"debug\" [type]=\"type\" [unit]=\"unit\" [options]=\"_options\"\n                     (chartDraw)=\"chartDrawn()\"\n                     [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                     *ngIf=\"graphs['plot'].indexOf(type) > -1 && dataModel\"\n                     [responsive]=\"true\"></warpview-plot>\n\n      <warpview-bar [debug]=\"debug\" [unit]=\"unit\" [options]=\"_options\"\n                    (chartDraw)=\"chartDrawn()\"\n                    [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                    *ngIf=\"graphs['bar'].indexOf(type) > -1 && dataModel\"\n                    [responsive]=\"true\"></warpview-bar>\n\n      <warpview-bubble [debug]=\"debug\" [unit]=\"unit\" [options]=\"_options\"\n                       (chartDraw)=\"chartDrawn()\"\n                       [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                       *ngIf=\"graphs['bubble'].indexOf(type) > -1 && dataModel\"\n                       [responsive]=\"true\"></warpview-bubble>\n\n      <warpview-datagrid [debug]=\"debug\" [options]=\"_options\"\n                         (chartDraw)=\"chartDrawn()\"\n                         [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                         *ngIf=\"graphs['datagrid'].indexOf(type) > -1 && dataModel\"\n                         [responsive]=\"true\"></warpview-datagrid>\n\n      <warpview-display [debug]=\"debug\" [options]=\"_options\"\n                        (chartDraw)=\"chartDrawn()\"\n                        [showLegend]=\"showLegend\" [data]=\"dataModel\" [unit]=\"unit\"\n                        *ngIf=\"graphs['display'].indexOf(type) > -1 && dataModel\"\n                        [responsive]=\"true\"></warpview-display>\n\n      <warpview-drill-down [debug]=\"debug\" [options]=\"_options\"\n                           (chartDraw)=\"chartDrawn()\"\n                           [showLegend]=\"showLegend\" [data]=\"dataModel\" [unit]=\"unit\"\n                           *ngIf=\"graphs['drilldown'].indexOf(type) > -1 && dataModel\"\n                           [responsive]=\"true\"></warpview-drill-down>\n\n      <warpview-gts-tree *ngIf=\"graphs['gts-tree'].indexOf(type) > -1 && dataModel\"\n                         (chartDraw)=\"chartDrawn()\"\n                         [responsive]=\"true\" [debug]=\"debug\" [data]=\"dataModel\"\n                         [options]=\"_options\"></warpview-gts-tree>\n\n      <warpview-image *ngIf=\"graphs['image'].indexOf(type) > -1 && dataModel\"\n                      (chartDraw)=\"chartDrawn()\"\n                      [responsive]=\"true\" [debug]=\"debug\" [data]=\"dataModel\" [options]=\"_options\"></warpview-image>\n\n      <warpview-map *ngIf=\"graphs['map'].indexOf(type) > -1 && dataModel\" [responsive]=\"true\" [debug]=\"debug\"\n                    (chartDraw)=\"chartDrawn()\"\n                    [data]=\"dataModel\" [options]=\"_options\"></warpview-map>\n\n      <warpview-pie [debug]=\"debug\" [type]=\"type\" [unit]=\"unit\" [options]=\"_options\"\n                    (chartDraw)=\"chartDrawn()\"\n                    [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                    *ngIf=\"graphs['pie'].indexOf(type) > -1 && dataModel\"\n                    [responsive]=\"true\"></warpview-pie>\n\n      <warpview-gauge [debug]=\"debug\" [type]=\"type\" [unit]=\"unit\" [options]=\"_options\"\n                      (chartDraw)=\"chartDrawn()\"\n                      [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                      *ngIf=\"graphs['gauge'].indexOf(type) > -1 && dataModel\"\n                      [responsive]=\"true\"></warpview-gauge>\n\n      <warpview-annotation [debug]=\"debug\" [unit]=\"unit\" [options]=\"_options\"\n                           (chartDraw)=\"chartDrawn()\"\n                           [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                           [standalone]=\"true\" [type]=\"type\"\n                           *ngIf=\"graphs['annotation'].indexOf(type) > -1 && dataModel\"\n                           [responsive]=\"true\"></warpview-annotation>\n\n      <warpview-event-drop [debug]=\"debug\" [unit]=\"unit\" [options]=\"_options\"\n                           (chartDraw)=\"chartDrawn()\"\n                           [showLegend]=\"showLegend\" [data]=\"dataModel\" [type]=\"type\"\n                           *ngIf=\"graphs['drops'].indexOf(type) > -1 && dataModel\"\n                           [responsive]=\"true\"></warpview-event-drop>\n\n      <warpview-polar [debug]=\"debug\" [unit]=\"unit\" [options]=\"_options\"\n                      (chartDraw)=\"chartDrawn()\"\n                      [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                      *ngIf=\"graphs['polar'].indexOf(type) > -1 && dataModel\"\n                      [responsive]=\"true\"></warpview-polar>\n\n      <warpview-radar [debug]=\"debug\" [unit]=\"unit\" [options]=\"_options\"\n                      (chartDraw)=\"chartDrawn()\"\n                      [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                      *ngIf=\"graphs['radar'].indexOf(type) > -1 && dataModel\"\n                      [responsive]=\"true\"></warpview-radar>\n\n      <warpview-box [debug]=\"debug\" [unit]=\"unit\" [options]=\"_options\"\n                    (chartDraw)=\"chartDrawn()\"\n                    [showLegend]=\"showLegend\" [data]=\"dataModel\" [type]=\"type\"\n                    *ngIf=\"graphs['box'].indexOf(type) > -1 && dataModel\"\n                    [responsive]=\"true\"></warpview-box>\n\n      <warpview-3d-line [debug]=\"debug\" [unit]=\"unit\" [options]=\"_options\"\n                        (chartDraw)=\"chartDrawn()\"\n                        [showLegend]=\"showLegend\" [data]=\"dataModel\" [type]=\"type\"\n                        *ngIf=\"graphs['line3d'].indexOf(type) > -1 && dataModel\"\n                        [responsive]=\"true\"></warpview-3d-line>\n      <warpview-globe [debug]=\"debug\" [unit]=\"unit\" [options]=\"_options\"\n                      (chartDraw)=\"chartDrawn()\"\n                      [showLegend]=\"showLegend\" [data]=\"dataModel\" [type]=\"type\"\n                      *ngIf=\"graphs['globe'].indexOf(type) > -1 && dataModel\"\n                      [responsive]=\"true\"></warpview-globe>\n    </div>\n</div>\n",
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host,warp-view-result-tile,warpview-result-tile{width:var(--warp-view-tile-width,100%);max-height:var(--warp-view-tile-height,100%);overflow:auto;min-width:var(--warp-view-tile-width,100%);min-height:var(--warp-view-tile-height,100%)}:host .error,warp-view-result-tile .error,warpview-result-tile .error{width:100%;text-align:center;color:#dc3545;font-weight:700}:host .wrapper,warp-view-result-tile .wrapper,warpview-result-tile .wrapper{opacity:1;min-height:50px;width:var(--warp-view-tile-width,100%);height:var(--warp-view-tile-height,100%)}:host .wrapper.full,warp-view-result-tile .wrapper.full,warpview-result-tile .wrapper.full{width:100%;height:100%}:host .wrapper .tilewrapper,warp-view-result-tile .wrapper .tilewrapper,warpview-result-tile .wrapper .tilewrapper{width:100%;height:100%}:host .wrapper .tilewrapper .tile,warp-view-result-tile .wrapper .tilewrapper .tile,warpview-result-tile .wrapper .tilewrapper .tile{width:100%;height:calc(var(--warp-view-tile-height,100%) - 40px);overflow-y:auto;overflow-x:hidden}:host .wrapper .tilewrapper .notitle,warp-view-result-tile .wrapper .tilewrapper .notitle,warpview-result-tile .wrapper .tilewrapper .notitle{height:100%;overflow:hidden}:host .wrapper .tilewrapper h1,warp-view-result-tile .wrapper .tilewrapper h1,warpview-result-tile .wrapper .tilewrapper h1{font-size:20px;padding:5px;margin:0;color:var(--warp-view-font-color)}:host .wrapper .tilewrapper h1 small,warp-view-result-tile .wrapper .tilewrapper h1 small,warpview-result-tile .wrapper .tilewrapper h1 small{font-size:10px;margin-left:10px}"]
            }] }
];
/** @nocollapse */
WarpViewResultTileComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: SizeService },
    { type: NgZone }
];
WarpViewResultTileComponent.propDecorators = {
    type: [{ type: Input, args: ['type',] }],
    standalone: [{ type: Input, args: ['standalone',] }],
    pointHover: [{ type: Output, args: ['pointHover',] }],
    warpViewChartResize: [{ type: Output, args: ['warpViewChartResize',] }],
    chartDraw: [{ type: Output, args: ['chartDraw',] }],
    boundsDidChange: [{ type: Output, args: ['boundsDidChange',] }]
};
if (false) {
    /** @type {?} */
    WarpViewResultTileComponent.prototype.standalone;
    /** @type {?} */
    WarpViewResultTileComponent.prototype.pointHover;
    /** @type {?} */
    WarpViewResultTileComponent.prototype.warpViewChartResize;
    /** @type {?} */
    WarpViewResultTileComponent.prototype.chartDraw;
    /** @type {?} */
    WarpViewResultTileComponent.prototype.boundsDidChange;
    /** @type {?} */
    WarpViewResultTileComponent.prototype.loading;
    /** @type {?} */
    WarpViewResultTileComponent.prototype.dataModel;
    /** @type {?} */
    WarpViewResultTileComponent.prototype.graphs;
    /**
     * @type {?}
     * @private
     */
    WarpViewResultTileComponent.prototype._type;
    /** @type {?} */
    WarpViewResultTileComponent.prototype.el;
    /** @type {?} */
    WarpViewResultTileComponent.prototype.renderer;
    /** @type {?} */
    WarpViewResultTileComponent.prototype.sizeService;
    /** @type {?} */
    WarpViewResultTileComponent.prototype.ngZone;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class WarpViewAngularModule {
}
WarpViewAngularModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    WarpViewTileComponent,
                    WarpViewChartComponent,
                    WarpViewSpinnerComponent,
                    WarpViewToggleComponent,
                    WarpViewBarComponent,
                    WarpViewBubbleComponent,
                    WarpViewDatagridComponent,
                    WarpViewPaginableComponent,
                    WarpViewDisplayComponent,
                    WarpViewDrillDownComponent,
                    CalendarHeatmapComponent,
                    WarpViewGtsPopupComponent,
                    WarpViewModalComponent,
                    WarpViewGtsTreeComponent,
                    WarpViewTreeViewComponent,
                    WarpViewChipComponent,
                    WarpViewImageComponent,
                    WarpViewMapComponent,
                    WarpViewHeatmapSlidersComponent,
                    WarpViewPieComponent,
                    WarpViewGaugeComponent,
                    WarpViewAnnotationComponent,
                    WarpViewPolarComponent,
                    WarpViewRadarComponent,
                    WarpViewPlotComponent,
                    WarpViewResizeComponent,
                    WarpViewSliderComponent,
                    WarpViewRangeSliderComponent,
                    WarpViewSpectrumComponent,
                    PlotlyComponent,
                    WarpViewBoxComponent,
                    WarpView3dLineComponent,
                    WarpViewGlobeComponent,
                    WarpViewEventDropComponent,
                    WarpViewResultTileComponent
                ],
                imports: [
                    CommonModule,
                    HttpClientModule,
                    AngularResizedEventModule,
                    FormsModule
                ],
                exports: [
                    WarpViewTileComponent,
                    WarpViewChartComponent,
                    WarpViewSpinnerComponent,
                    WarpViewToggleComponent,
                    WarpViewBarComponent,
                    WarpViewBubbleComponent,
                    WarpViewDatagridComponent,
                    WarpViewPaginableComponent,
                    WarpViewDisplayComponent,
                    WarpViewDrillDownComponent,
                    CalendarHeatmapComponent,
                    WarpViewGtsPopupComponent,
                    WarpViewModalComponent,
                    WarpViewGtsTreeComponent,
                    WarpViewTreeViewComponent,
                    WarpViewChipComponent,
                    WarpViewImageComponent,
                    WarpViewMapComponent,
                    WarpViewHeatmapSlidersComponent,
                    WarpViewPieComponent,
                    WarpViewGaugeComponent,
                    WarpViewAnnotationComponent,
                    WarpViewPolarComponent,
                    WarpViewRadarComponent,
                    WarpViewPlotComponent,
                    WarpViewResizeComponent,
                    WarpViewSliderComponent,
                    WarpViewRangeSliderComponent,
                    WarpViewSpectrumComponent,
                    WarpViewBoxComponent,
                    WarpView3dLineComponent,
                    WarpViewGlobeComponent,
                    WarpViewEventDropComponent,
                    WarpViewResultTileComponent
                ],
                providers: [HttpErrorHandler, SizeService],
                entryComponents: [
                    WarpViewTileComponent,
                    WarpViewChartComponent,
                    WarpViewSpinnerComponent,
                    WarpViewToggleComponent,
                    WarpViewBarComponent,
                    WarpViewBubbleComponent,
                    WarpViewDatagridComponent,
                    WarpViewPaginableComponent,
                    WarpViewDisplayComponent,
                    WarpViewDrillDownComponent,
                    CalendarHeatmapComponent,
                    WarpViewGtsPopupComponent,
                    WarpViewModalComponent,
                    WarpViewGtsTreeComponent,
                    WarpViewTreeViewComponent,
                    WarpViewChipComponent,
                    WarpViewImageComponent,
                    WarpViewMapComponent,
                    WarpViewHeatmapSlidersComponent,
                    WarpViewPieComponent,
                    WarpViewGaugeComponent,
                    WarpViewAnnotationComponent,
                    WarpViewPolarComponent,
                    WarpViewRadarComponent,
                    WarpViewPlotComponent,
                    WarpViewResizeComponent,
                    WarpViewSliderComponent,
                    WarpViewRangeSliderComponent,
                    WarpViewSpectrumComponent,
                    PlotlyComponent,
                    WarpViewBoxComponent,
                    WarpView3dLineComponent,
                    WarpViewGlobeComponent,
                    WarpViewEventDropComponent,
                    WarpViewResultTileComponent
                ]
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { Param, WarpViewAngularModule, WarpViewTileComponent as ɵa, WarpViewComponent as ɵb, WarpViewPolarComponent as ɵba, WarpViewRadarComponent as ɵbb, WarpViewPlotComponent as ɵbc, WarpViewResizeComponent as ɵbd, WarpViewSliderComponent as ɵbe, WarpViewRangeSliderComponent as ɵbf, WarpViewSpectrumComponent as ɵbg, PlotlyComponent as ɵbh, WarpViewBoxComponent as ɵbi, WarpView3dLineComponent as ɵbj, WarpViewGlobeComponent as ɵbk, WarpViewEventDropComponent as ɵbl, WarpViewResultTileComponent as ɵbm, SizeService as ɵc, HttpErrorHandler as ɵd, Warp10Service as ɵe, WarpViewChartComponent as ɵf, WarpViewSpinnerComponent as ɵg, WarpViewToggleComponent as ɵh, WarpViewBarComponent as ɵi, WarpViewBubbleComponent as ɵj, WarpViewDatagridComponent as ɵk, WarpViewPaginableComponent as ɵl, WarpViewDisplayComponent as ɵm, WarpViewDrillDownComponent as ɵn, CalendarHeatmapComponent as ɵo, WarpViewGtsPopupComponent as ɵp, WarpViewModalComponent as ɵq, WarpViewGtsTreeComponent as ɵr, WarpViewTreeViewComponent as ɵs, WarpViewChipComponent as ɵt, WarpViewImageComponent as ɵu, WarpViewMapComponent as ɵv, WarpViewHeatmapSlidersComponent as ɵw, WarpViewPieComponent as ɵx, WarpViewGaugeComponent as ɵy, WarpViewAnnotationComponent as ɵz };
//# sourceMappingURL=warpview.js.map
