import { EventEmitter, Component, ViewEncapsulation, IterableDiffers, ElementRef, KeyValueDiffers, ViewChild, Input, Output, Renderer2, NgZone, Injectable, ɵɵdefineInjectable, ɵɵinject, HostListener, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { __spread, __assign, __extends, __awaiter, __generator } from 'tslib';
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
var DataModel = /** @class */ (function () {
    function DataModel() {
    }
    return DataModel;
}());
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
var Logger = /** @class */ (function () {
    function Logger(className, isDebug) {
        if (isDebug === void 0) { isDebug = false; }
        this.isDebug = false;
        this.className = className.name;
        this.isDebug = isDebug;
    }
    /**
     * @param {?} debug
     * @return {?}
     */
    Logger.prototype.setDebug = /**
     * @param {?} debug
     * @return {?}
     */
    function (debug) {
        this.isDebug = debug;
    };
    /**
     * @param {?} level
     * @param {?} methods
     * @param {?} args
     * @return {?}
     */
    Logger.prototype.log = /**
     * @param {?} level
     * @param {?} methods
     * @param {?} args
     * @return {?}
     */
    function (level, methods, args) {
        /** @type {?} */
        var logChain = [];
        logChain.push("[" + new Date().toISOString() + " - [" + this.className + "] " + methods.join(' - '));
        logChain = logChain.concat(args);
        switch (level) {
            case LEVEL.DEBUG: {
                if (this.isDebug) {
                    console.debug.apply(console, __spread(logChain));
                }
                break;
            }
            case LEVEL.ERROR: {
                console.error.apply(console, __spread(logChain));
                break;
            }
            case LEVEL.INFO: {
                console.log.apply(console, __spread(logChain));
                break;
            }
            case LEVEL.WARN: {
                console.warn.apply(console, __spread(logChain));
                break;
            }
            default: {
                if (this.isDebug) {
                    console.log.apply(console, __spread(logChain));
                }
            }
        }
    };
    /**
     * @param {?} methods
     * @param {...?} args
     * @return {?}
     */
    Logger.prototype.debug = /**
     * @param {?} methods
     * @param {...?} args
     * @return {?}
     */
    function (methods) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.log(LEVEL.DEBUG, methods, args);
    };
    /**
     * @param {?} methods
     * @param {...?} args
     * @return {?}
     */
    Logger.prototype.error = /**
     * @param {?} methods
     * @param {...?} args
     * @return {?}
     */
    function (methods) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.log(LEVEL.ERROR, methods, args);
    };
    /**
     * @param {?} methods
     * @param {...?} args
     * @return {?}
     */
    Logger.prototype.warn = /**
     * @param {?} methods
     * @param {...?} args
     * @return {?}
     */
    function (methods) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.log(LEVEL.WARN, methods, args);
    };
    /**
     * @param {?} methods
     * @param {...?} args
     * @return {?}
     */
    Logger.prototype.info = /**
     * @param {?} methods
     * @param {...?} args
     * @return {?}
     */
    function (methods) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.log(LEVEL.INFO, methods, args);
    };
    return Logger;
}());
if (false) {
    /** @type {?} */
    Logger.prototype.className;
    /** @type {?} */
    Logger.prototype.isDebug;
}
/** @enum {number} */
var LEVEL = {
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
var ChartBounds = /** @class */ (function () {
    function ChartBounds() {
        this.tsmin = 0;
        this.tsmax = 0;
        this.msmin = '';
        this.msmax = '';
        this.marginLeft = 0;
    }
    return ChartBounds;
}());
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
var ColorLib = /** @class */ (function () {
    function ColorLib() {
    }
    /**
     * @param {?} i
     * @param {?} scheme
     * @return {?}
     */
    ColorLib.getColor = /**
     * @param {?} i
     * @param {?} scheme
     * @return {?}
     */
    function (i, scheme) {
        return ColorLib.color[scheme][i % ColorLib.color[scheme].length];
    };
    /**
     * @param {?} id
     * @param {?} scheme
     * @return {?}
     */
    ColorLib.getColorGradient = /**
     * @param {?} id
     * @param {?} scheme
     * @return {?}
     */
    function (id, scheme) {
        return [
            [0, ColorLib.transparentize(ColorLib.getColor(id, scheme), 0)],
            [1, ColorLib.transparentize(ColorLib.getColor(id, scheme), 0.7)]
        ];
    };
    /**
     * @param {?} id
     * @param {?} scheme
     * @param {?=} bg
     * @return {?}
     */
    ColorLib.getBlendedColorGradient = /**
     * @param {?} id
     * @param {?} scheme
     * @param {?=} bg
     * @return {?}
     */
    function (id, scheme, bg) {
        if (bg === void 0) { bg = '#000000'; }
        return [
            [0, ColorLib.blend_colors(bg, ColorLib.getColor(id, scheme), 0)],
            [1, ColorLib.blend_colors(bg, ColorLib.getColor(id, scheme), 1)]
        ];
    };
    /**
     * @param {?} scheme
     * @return {?}
     */
    ColorLib.getColorScale = /**
     * @param {?} scheme
     * @return {?}
     */
    function (scheme) {
        return ColorLib.color[scheme].map((/**
         * @param {?} c
         * @param {?} i
         * @return {?}
         */
        function (c, i) { return [i, c]; }));
    };
    /**
     * @param {?} hex
     * @return {?}
     */
    ColorLib.hexToRgb = /**
     * @param {?} hex
     * @return {?}
     */
    function (hex) {
        /** @type {?} */
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : null;
    };
    /**
     * @param {?} color
     * @param {?=} alpha
     * @return {?}
     */
    ColorLib.transparentize = /**
     * @param {?} color
     * @param {?=} alpha
     * @return {?}
     */
    function (color, alpha) {
        if (alpha === void 0) { alpha = 0.5; }
        return 'rgba(' + ColorLib.hexToRgb(color).concat(alpha).join(',') + ')';
    };
    /**
     * @param {?} num
     * @param {?} scheme
     * @return {?}
     */
    ColorLib.generateColors = /**
     * @param {?} num
     * @param {?} scheme
     * @return {?}
     */
    function (num, scheme) {
        /** @type {?} */
        var color = [];
        for (var i = 0; i < num; i++) {
            color.push(ColorLib.getColor(i, scheme));
        }
        return color;
    };
    /**
     * @param {?} num
     * @param {?} scheme
     * @return {?}
     */
    ColorLib.generateTransparentColors = /**
     * @param {?} num
     * @param {?} scheme
     * @return {?}
     */
    function (num, scheme) {
        /** @type {?} */
        var color = [];
        for (var i = 0; i < num; i++) {
            color.push(ColorLib.transparentize(ColorLib.getColor(i, scheme)));
        }
        return color;
    };
    /**
     * @param {?} c1
     * @param {?} c2
     * @param {?} steps
     * @return {?}
     */
    ColorLib.hsvGradientFromRgbColors = /**
     * @param {?} c1
     * @param {?} c2
     * @param {?} steps
     * @return {?}
     */
    function (c1, c2, steps) {
        /** @type {?} */
        var c1hsv = ColorLib.rgb2hsv(c1.r, c1.g, c1.b);
        /** @type {?} */
        var c2hsv = ColorLib.rgb2hsv(c2.r, c2.g, c2.b);
        c1.h = c1hsv[0];
        c1.s = c1hsv[1];
        c1.v = c1hsv[2];
        c2.h = c2hsv[0];
        c2.s = c2hsv[1];
        c2.v = c2hsv[2];
        /** @type {?} */
        var gradient = ColorLib.hsvGradient(c1, c2, steps);
        for (var i in gradient) {
            if (gradient[i]) {
                gradient[i].rgb = ColorLib.hsv2rgb(gradient[i].h, gradient[i].s, gradient[i].v);
                gradient[i].r = Math.floor(gradient[i].rgb[0]);
                gradient[i].g = Math.floor(gradient[i].rgb[1]);
                gradient[i].b = Math.floor(gradient[i].rgb[2]);
            }
        }
        return gradient;
    };
    /**
     * @private
     * @param {?} r
     * @param {?} g
     * @param {?} b
     * @return {?}
     */
    ColorLib.rgb2hsv = /**
     * @private
     * @param {?} r
     * @param {?} g
     * @param {?} b
     * @return {?}
     */
    function (r, g, b) {
        // Normalize
        /** @type {?} */
        var normR = r / 255.0;
        /** @type {?} */
        var normG = g / 255.0;
        /** @type {?} */
        var normB = b / 255.0;
        /** @type {?} */
        var M = Math.max(normR, normG, normB);
        /** @type {?} */
        var m = Math.min(normR, normG, normB);
        /** @type {?} */
        var d = M - m;
        /** @type {?} */
        var h;
        /** @type {?} */
        var s;
        /** @type {?} */
        var v;
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
    };
    /**
     * @private
     * @param {?} c1
     * @param {?} c2
     * @param {?} steps
     * @return {?}
     */
    ColorLib.hsvGradient = /**
     * @private
     * @param {?} c1
     * @param {?} c2
     * @param {?} steps
     * @return {?}
     */
    function (c1, c2, steps) {
        /** @type {?} */
        var gradient = new Array(steps);
        // determine clockwise and counter-clockwise distance between hues
        /** @type {?} */
        var distCCW = (c1.h >= c2.h) ? c1.h - c2.h : 1 + c1.h - c2.h;
        /** @type {?} */
        var distCW = (c1.h >= c2.h) ? 1 + c2.h - c1.h : c2.h - c1.h;
        // make gradient for this part
        for (var i = 0; i < steps; i++) {
            // interpolate h, s, b
            /** @type {?} */
            var h = (distCW <= distCCW) ? c1.h + (distCW * i / (steps - 1)) : c1.h - (distCCW * i / (steps - 1));
            if (h < 0) {
                h = 1 + h;
            }
            if (h > 1) {
                h = h - 1;
            }
            /** @type {?} */
            var s = (1 - i / (steps - 1)) * c1.s + i / (steps - 1) * c2.s;
            /** @type {?} */
            var v = (1 - i / (steps - 1)) * c1.v + i / (steps - 1) * c2.v;
            // add to gradient array
            gradient[i] = { h: h, s: s, v: v };
        }
        return gradient;
    };
    /**
     * @private
     * @param {?} h
     * @param {?} s
     * @param {?} v
     * @return {?}
     */
    ColorLib.hsv2rgb = /**
     * @private
     * @param {?} h
     * @param {?} s
     * @param {?} v
     * @return {?}
     */
    function (h, s, v) {
        /** @type {?} */
        var r;
        /** @type {?} */
        var g;
        /** @type {?} */
        var b;
        /** @type {?} */
        var i = Math.floor(h * 6);
        /** @type {?} */
        var f = h * 6 - i;
        /** @type {?} */
        var p = v * (1 - s);
        /** @type {?} */
        var q = v * (1 - f * s);
        /** @type {?} */
        var t = v * (1 - (1 - f) * s);
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
    };
    /**
     * @param {?} r
     * @param {?} g
     * @param {?} b
     * @return {?}
     */
    ColorLib.rgb2hex = /**
     * @param {?} r
     * @param {?} g
     * @param {?} b
     * @return {?}
     */
    function (r, g, b) {
        /**
         * @param {?} c
         * @return {?}
         */
        function componentToHex(c) {
            /** @type {?} */
            var hex = c.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }
        return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
    };
    /**
     * @param {?} color1
     * @param {?} color2
     * @param {?} percentage
     * @return {?}
     */
    ColorLib.blend_colors = /**
     * @param {?} color1
     * @param {?} color2
     * @param {?} percentage
     * @return {?}
     */
    function (color1, color2, percentage) {
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
        var color3 = [
            (1 - percentage) * color1[0] + percentage * color2[0],
            (1 - percentage) * color1[1] + percentage * color2[1],
            (1 - percentage) * color1[2] + percentage * color2[2]
        ];
        /** @type {?} */
        var color3Str = '#' + ColorLib.int_to_hex(color3[0]) + ColorLib.int_to_hex(color3[1]) + ColorLib.int_to_hex(color3[2]);
        console.log(color3Str);
        // return hex
        return color3Str;
    };
    /*
        convert a Number to a two character hex string
        must round, or we will end up with more digits than expected (2)
        note: can also result in single digit, which will need to be padded with a 0 to the left
        @param: num         => the number to conver to hex
        @returns: string    => the hex representation of the provided number
    */
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
    ColorLib.int_to_hex = /*
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
    function (num) {
        /** @type {?} */
        var hex = Math.round(num).toString(16);
        if (hex.length === 1) {
            hex = '0' + hex;
        }
        return hex;
    };
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
    return ColorLib;
}());
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
var ChartLib = /** @class */ (function () {
    function ChartLib() {
    }
    /**
     * @template T
     * @param {?} base
     * @param {?} extended
     * @return {?}
     */
    ChartLib.mergeDeep = /**
     * @template T
     * @param {?} base
     * @param {?} extended
     * @return {?}
     */
    function (base, extended) {
        base = base || (/** @type {?} */ ({}));
        for (var prop in extended || {}) {
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
    };
    ChartLib.DEFAULT_WIDTH = 640;
    ChartLib.DEFAULT_HEIGHT = 480;
    return ChartLib;
}());
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
var  /*
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
var PlotlyComponent = /** @class */ (function () {
    function PlotlyComponent(iterableDiffers, el, keyValueDiffers) {
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
    PlotlyComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.createPlot().then((/**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var figure = _this.createFigure();
            _this.LOG.debug(['figure'], figure);
            _this.initialized.emit(_this.plotlyInstance);
        }));
    };
    /**
     * @return {?}
     */
    PlotlyComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        if (typeof this.resizeHandler === 'function') {
            this.getWindow().removeEventListener('resize', (/** @type {?} */ (this.resizeHandler)));
            this.resizeHandler = undefined;
        }
        /** @type {?} */
        var figure = this.createFigure();
        this.purge.emit(figure);
        this.remove(this.plotlyInstance);
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    PlotlyComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        this.LOG.debug(['ngOnChanges'], changes);
        /** @type {?} */
        var revision = changes.revision;
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
    };
    /**
     * @return {?}
     */
    PlotlyComponent.prototype.ngDoCheck = /**
     * @return {?}
     */
    function () {
        if (this.updateOnlyWithRevision) {
            return false;
        }
        /** @type {?} */
        var shouldUpdate = false;
        if (this.updateOnLayoutChange) {
            if (this.layoutDiffer) {
                /** @type {?} */
                var layoutHasDiff = this.layoutDiffer.diff(this.layout);
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
                var dataHasDiff = this.dataDiffer.diff(this.data);
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
    };
    /**
     * @return {?}
     */
    PlotlyComponent.prototype.getWindow = /**
     * @return {?}
     */
    function () {
        return window;
    };
    /**
     * @return {?}
     */
    PlotlyComponent.prototype.getBoundingClientRect = /**
     * @return {?}
     */
    function () {
        return this.rect;
    };
    /**
     * @return {?}
     */
    PlotlyComponent.prototype.getClassName = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var classes = [this.defaultClassName];
        if (Array.isArray(this.className)) {
            classes = classes.concat(this.className);
        }
        else if (this.className) {
            classes.push(this.className);
        }
        return classes.join(' ');
    };
    /**
     * @param {?} properties
     * @param {?} curves
     * @return {?}
     */
    PlotlyComponent.prototype.restyleChart = /**
     * @param {?} properties
     * @param {?} curves
     * @return {?}
     */
    function (properties, curves) {
        restyle(this.plotlyInstance, properties, curves);
    };
    /**
     * @return {?}
     */
    PlotlyComponent.prototype.createPlot = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.LOG.debug(['createPlot'], this.data, this.layout, this.config, this.plotlyInstance);
        return react(this.plotEl.nativeElement, this.data, this.layout, this.config).then((/**
         * @param {?} plotlyInstance
         * @return {?}
         */
        function (plotlyInstance) {
            _this.rect = _this.el.nativeElement.getBoundingClientRect();
            _this.plotlyInstance = plotlyInstance;
            _this.LOG.debug(['plotlyInstance'], plotlyInstance);
            _this.getWindow().gd = _this.debug ? plotlyInstance : undefined;
            _this.eventNames.forEach((/**
             * @param {?} name
             * @return {?}
             */
            function (name) {
                /** @type {?} */
                var eventName = "plotly_" + name.toLowerCase();
                // @ts-ignore
                plotlyInstance.on(eventName, (/**
                 * @param {?} data
                 * @return {?}
                 */
                function (data) {
                    _this.LOG.debug(['plotlyEvent', eventName], data);
                    ((/** @type {?} */ (_this[name]))).emit(data);
                }));
            }));
            plotlyInstance.on('plotly_click', (/**
             * @param {?} data
             * @return {?}
             */
            function (data) {
                _this.click.emit(data);
                _this.plotly_click.emit(data);
            }));
            _this.updateWindowResizeHandler();
            _this.afterPlot.emit(plotlyInstance);
        }), (/**
         * @param {?} err
         * @return {?}
         */
        function (err) {
            console.error('Error while plotting:', err);
            _this.error.emit(err);
        }));
    };
    /**
     * @return {?}
     */
    PlotlyComponent.prototype.createFigure = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var p = this.plotlyInstance;
        return {
            data: p.data,
            layout: p.layout,
            frames: p._transitionData ? p._transitionData._frames : null
        };
    };
    /**
     * @return {?}
     */
    PlotlyComponent.prototype.updatePlot = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.LOG.debug(['updatePlot'], this.data, this.layout, __assign({}, this.config));
        if (!this.plotlyInstance) {
            /** @type {?} */
            var error = new Error("Plotly component wasn't initialized");
            this.error.emit(error);
            return;
        }
        purge(this.plotlyInstance);
        this.createPlot().then((/**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var figure = _this.createFigure();
            _this.update.emit(figure);
        }), (/**
         * @param {?} err
         * @return {?}
         */
        function (err) {
            console.error('Error while updating plot:', err);
            _this.error.emit(err);
        }));
    };
    /**
     * @return {?}
     */
    PlotlyComponent.prototype.updateWindowResizeHandler = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (this.useResizeHandler) {
            if (this.resizeHandler === undefined) {
                this.resizeHandler = (/**
                 * @return {?}
                 */
                function () { return setTimeout((/**
                 * @return {?}
                 */
                function () { return Plots.resize(_this.plotlyInstance); })); });
                this.getWindow().addEventListener('resize', (/** @type {?} */ (this.resizeHandler)));
            }
        }
        else {
            if (typeof this.resizeHandler === 'function') {
                this.getWindow().removeEventListener('resize', (/** @type {?} */ (this.resizeHandler)));
                this.resizeHandler = undefined;
            }
        }
    };
    /**
     * @param {?} _
     * @param {?} item
     * @return {?}
     */
    PlotlyComponent.prototype.dataDifferTrackBy = /**
     * @param {?} _
     * @param {?} item
     * @return {?}
     */
    function (_, item) {
        /** @type {?} */
        var obj = Object.assign({}, item, { uid: '' });
        return JSON.stringify(obj);
    };
    /**
     * @param {?} div
     * @return {?}
     */
    PlotlyComponent.prototype.remove = /**
     * @param {?} div
     * @return {?}
     */
    function (div) {
        purge(div);
        delete this.plotlyInstance;
    };
    PlotlyComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-plotly',
                    template: "<div #plot [attr.id]=\"divId\" [className]=\"getClassName()\" [ngStyle]=\"style\"></div>\n\n",
                    encapsulation: ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}.js-plotly-plot .plotly,.js-plotly-plot .plotly div{direction:ltr;font-family:'Open Sans',verdana,arial,sans-serif;margin:0;padding:0}.js-plotly-plot .plotly button,.js-plotly-plot .plotly input{font-family:'Open Sans',verdana,arial,sans-serif}.js-plotly-plot .plotly button:focus,.js-plotly-plot .plotly input:focus{outline:0}.js-plotly-plot .plotly a,.js-plotly-plot .plotly a:hover{text-decoration:none}.js-plotly-plot .plotly .crisp{shape-rendering:crispEdges}.js-plotly-plot .plotly .user-select-none{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;-o-user-select:none;user-select:none}.js-plotly-plot .plotly svg{overflow:hidden}.js-plotly-plot .plotly svg a{fill:#447adb}.js-plotly-plot .plotly svg a:hover{fill:#3c6dc5}.js-plotly-plot .plotly .main-svg{position:absolute;top:0;left:0;pointer-events:none}.js-plotly-plot .plotly .main-svg .draglayer{pointer-events:all}.js-plotly-plot .plotly .cursor-default{cursor:default}.js-plotly-plot .plotly .cursor-pointer{cursor:pointer}.js-plotly-plot .plotly .cursor-crosshair{cursor:crosshair}.js-plotly-plot .plotly .cursor-move{cursor:move}.js-plotly-plot .plotly .cursor-col-resize{cursor:col-resize}.js-plotly-plot .plotly .cursor-row-resize{cursor:row-resize}.js-plotly-plot .plotly .cursor-ns-resize{cursor:ns-resize}.js-plotly-plot .plotly .cursor-ew-resize{cursor:ew-resize}.js-plotly-plot .plotly .cursor-sw-resize{cursor:sw-resize}.js-plotly-plot .plotly .cursor-s-resize{cursor:s-resize}.js-plotly-plot .plotly .cursor-se-resize{cursor:se-resize}.js-plotly-plot .plotly .cursor-w-resize{cursor:w-resize}.js-plotly-plot .plotly .cursor-e-resize{cursor:e-resize}.js-plotly-plot .plotly .cursor-nw-resize{cursor:nw-resize}.js-plotly-plot .plotly .cursor-n-resize{cursor:n-resize}.js-plotly-plot .plotly .cursor-ne-resize{cursor:ne-resize}.js-plotly-plot .plotly .cursor-grab{cursor:-webkit-grab;cursor:grab}.js-plotly-plot .plotly .modebar{position:absolute;top:2px;right:2px}.js-plotly-plot .plotly .ease-bg{-webkit-transition:background-color .3s;transition:background-color .3s}.js-plotly-plot .plotly .modebar--hover>:not(.watermark){opacity:0;-webkit-transition:opacity .3s;transition:opacity .3s}.js-plotly-plot .plotly:hover .modebar--hover .modebar-group{opacity:1}.js-plotly-plot .plotly .modebar-group{float:left;display:inline-block;box-sizing:border-box;padding-left:8px;position:relative;vertical-align:middle;white-space:nowrap}.js-plotly-plot .plotly .modebar-btn{position:relative;font-size:16px;padding:3px 4px;height:22px;cursor:pointer;line-height:normal;box-sizing:border-box}.js-plotly-plot .plotly .modebar-btn svg{position:relative;top:2px}.js-plotly-plot .plotly .modebar.vertical{display:-webkit-box;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;flex-direction:column;flex-wrap:wrap;align-content:flex-end;max-height:100%}.js-plotly-plot .plotly .modebar.vertical svg{top:-1px}.js-plotly-plot .plotly .modebar.vertical .modebar-group{display:block;float:none;padding-left:0;padding-bottom:8px}.js-plotly-plot .plotly .modebar.vertical .modebar-group .modebar-btn{display:block;text-align:center}.js-plotly-plot .plotly [data-title]:after,.js-plotly-plot .plotly [data-title]:before{position:absolute;-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0);display:none;opacity:0;z-index:1001;pointer-events:none;top:110%;right:50%}.js-plotly-plot .plotly [data-title]:hover:after,.js-plotly-plot .plotly [data-title]:hover:before{display:block;opacity:1}.js-plotly-plot .plotly [data-title]:before{content:'';position:absolute;background:0 0;border:6px solid transparent;z-index:1002;margin-top:-12px;border-bottom-color:#69738a;margin-right:-6px}.js-plotly-plot .plotly [data-title]:after{content:attr(data-title);background:#69738a;color:#fff;padding:8px 10px;font-size:12px;line-height:12px;white-space:nowrap;margin-right:-18px;border-radius:2px}.js-plotly-plot .plotly .vertical [data-title]:after,.js-plotly-plot .plotly .vertical [data-title]:before{top:0;right:200%}.js-plotly-plot .plotly .vertical [data-title]:before{border:6px solid transparent;border-left-color:#69738a;margin-top:8px;margin-right:-30px}.js-plotly-plot .plotly .select-outline{fill:none;stroke-width:1;shape-rendering:crispEdges}.js-plotly-plot .plotly .select-outline-1{stroke:#fff}.js-plotly-plot .plotly .select-outline-2{stroke:#000;stroke-dasharray:2px 2px}.plotly-notifier{font-family:'Open Sans',verdana,arial,sans-serif;position:fixed;top:50px;right:20px;z-index:10000;font-size:10pt;max-width:180px}.plotly-notifier p{margin:0}.plotly-notifier .notifier-note{min-width:180px;max-width:250px;border:1px solid #fff;z-index:3000;margin:0;background-color:rgba(140,151,175,.9);color:#fff;padding:10px;overflow-wrap:break-word;word-wrap:break-word;-ms-hyphens:auto;-webkit-hyphens:auto;hyphens:auto}.plotly-notifier .notifier-close{color:#fff;opacity:.8;float:right;padding:0 5px;background:0 0;border:none;font-size:20px;font-weight:700;line-height:20px}.plotly-notifier .notifier-close:hover{color:#444;text-decoration:none;cursor:pointer}:host .ylines-above{stroke:var(--warp-view-chart-grid-color)!important}:host .xtick>text,:host .ytick>text{fill:var(--warp-view-font-color)!important}:host .modebar-btn path{fill:var(--warp-view-font-color)!important}"]
                }] }
    ];
    /** @nocollapse */
    PlotlyComponent.ctorParameters = function () { return [
        { type: IterableDiffers },
        { type: ElementRef },
        { type: KeyValueDiffers }
    ]; };
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
    return PlotlyComponent;
}());
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
var WarpViewComponent = /** @class */ (function () {
    function WarpViewComponent(el, renderer, sizeService, ngZone) {
        var _this = this;
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
        function (size) {
            if (((/** @type {?} */ (el.nativeElement))).parentElement) {
                /** @type {?} */
                var parentSize = ((/** @type {?} */ (el.nativeElement))).parentElement.getBoundingClientRect();
                if (_this._responsive) {
                    _this.height = parentSize.height;
                    _this.width = parentSize.width;
                }
                if (!!_this.graph && _this._responsive && parentSize.height > 0) {
                    /** @type {?} */
                    var layout_1 = {
                        width: parentSize.width,
                        height: _this._autoResize ? parentSize.height : _this.layout.height
                    };
                    if (_this.layout.width !== layout_1.width || _this.layout.height !== layout_1.height) {
                        setTimeout((/**
                         * @return {?}
                         */
                        function () { return _this.layout = __assign({}, _this.layout, layout_1); }));
                        _this.LOG.debug(['sizeChanged$'], _this.layout.width, _this.layout.height);
                        _this.graph.updatePlot();
                    }
                }
            }
        }));
    }
    Object.defineProperty(WarpViewComponent.prototype, "hiddenData", {
        get: /**
         * @return {?}
         */
        function () {
            return this._hiddenData;
        },
        set: /**
         * @param {?} hiddenData
         * @return {?}
         */
        function (hiddenData) {
            this._hiddenData = hiddenData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarpViewComponent.prototype, "unit", {
        get: /**
         * @return {?}
         */
        function () {
            return this._unit;
        },
        set: /**
         * @param {?} unit
         * @return {?}
         */
        function (unit) {
            this._unit = unit;
            this.update(undefined, false);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarpViewComponent.prototype, "debug", {
        get: /**
         * @return {?}
         */
        function () {
            return this._debug;
        },
        set: /**
         * @param {?} debug
         * @return {?}
         */
        function (debug) {
            if (typeof debug === 'string') {
                debug = 'true' === debug;
            }
            this._debug = debug;
            this.LOG.setDebug(debug);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarpViewComponent.prototype, "showLegend", {
        get: /**
         * @return {?}
         */
        function () {
            return this._showLegend;
        },
        set: /**
         * @param {?} showLegend
         * @return {?}
         */
        function (showLegend) {
            if (typeof showLegend === 'string') {
                showLegend = 'true' === showLegend;
            }
            this._showLegend = showLegend;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarpViewComponent.prototype, "responsive", {
        get: /**
         * @return {?}
         */
        function () {
            return this._responsive;
        },
        set: /**
         * @param {?} responsive
         * @return {?}
         */
        function (responsive) {
            if (typeof responsive === 'string') {
                responsive = 'true' === responsive;
            }
            this._responsive = responsive;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarpViewComponent.prototype, "options", {
        set: /**
         * @param {?} options
         * @return {?}
         */
        function (options) {
            this.LOG.debug(['onOptions'], options);
            if (typeof options === 'string') {
                options = JSON.parse(options);
            }
            if (!deepEqual(options, this._options)) {
                this.LOG.debug(['onOptions', 'changed'], options);
                this._options = (/** @type {?} */ (ChartLib.mergeDeep(this._options, (/** @type {?} */ (options)))));
                this.update(this._options, false);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarpViewComponent.prototype, "data", {
        set: /**
         * @param {?} data
         * @return {?}
         */
        function (data) {
            this.LOG.debug(['onData'], data);
            if (data) {
                this._data = GTSLib.getData(data);
                this.update(this._options, true);
                this.LOG.debug(['onData'], this._data);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @protected
     * @param {?} x
     * @param {?} series
     * @param {?=} highlighted
     * @return {?}
     */
    WarpViewComponent.prototype.legendFormatter = /**
     * @protected
     * @param {?} x
     * @param {?} series
     * @param {?=} highlighted
     * @return {?}
     */
    function (x, series, highlighted) {
        var _this = this;
        if (highlighted === void 0) { highlighted = -1; }
        /** @type {?} */
        var displayedCurves = [];
        if (x === null) {
            // This happens when there's no selection and {legend: 'always'} is set.
            return "<br>\n      " + series.map((/**
             * @param {?} s
             * @return {?}
             */
            function (s) {
                // FIXME :  if (!s.isVisible) return;
                /** @type {?} */
                var labeledData = GTSLib.formatLabel(s.data.text || '') + ': ' + ((_this._options.horizontal ? s.x : s.y) || s.r || '');
                /** @type {?} */
                var color = s.data.line.color;
                if (!!s.data.marker) {
                    if (GTSLib.isArray(s.data.marker.color)) {
                        color = s.data.marker.color[0];
                    }
                    else {
                        color = s.data.marker.color;
                    }
                }
                if (s.curveNumber === highlighted) {
                    labeledData = "<i class=\"chip\"\n    style=\"background-color: " + color + ";border: 2px solid " + color + ";\"></i> " + labeledData;
                }
                return labeledData;
            })).join('<br>');
        }
        /** @type {?} */
        var html = '';
        if (!!series[0]) {
            x = series[0].x || series[0].theta;
        }
        html += "<b>" + x + "</b><br />";
        // put the highlighted one(s?) first, keep only visibles, keep only 50 first ones.
        series = series.sort((/**
         * @param {?} sa
         * @param {?} sb
         * @return {?}
         */
        function (sa, sb) { return (sa.curveNumber === highlighted) ? -1 : 1; }));
        series
            // .filter(s => s.isVisible && s.yHTML)
            .slice(0, 50)
            .forEach((/**
         * @param {?} s
         * @param {?} i
         * @return {?}
         */
        function (s, i) {
            if (displayedCurves.indexOf(s.curveNumber) <= -1) {
                displayedCurves.push(s.curveNumber);
                /** @type {?} */
                var value = series[0].data.orientation === 'h' ? s.x : s.y;
                if (!value && value !== 0) {
                    value = s.r;
                }
                /** @type {?} */
                var labeledData = GTSLib.formatLabel(s.data.text || '') + ': ' + value;
                if (s.curveNumber === highlighted) {
                    labeledData = "<b>" + labeledData + "</b>";
                }
                /** @type {?} */
                var color = s.data.line ? s.data.line.color : '';
                if (!!s.data.marker) {
                    if (GTSLib.isArray(s.data.marker.color)) {
                        color = s.data.marker.color[0];
                    }
                    else {
                        color = s.data.marker.color;
                    }
                }
                html += "<i class=\"chip\" style=\"background-color: " + color + ";border: 2px solid " + color + ";\"></i>&nbsp;" + labeledData;
                if (i < series.length) {
                    html += '<br>';
                }
            }
        }));
        return html;
    };
    /**
     * @protected
     * @param {?} el
     * @return {?}
     */
    WarpViewComponent.prototype.initChart = /**
     * @protected
     * @param {?} el
     * @return {?}
     */
    function (el) {
        this.noData = false;
        /** @type {?} */
        var parentSize = ((/** @type {?} */ (el.nativeElement))).parentElement.parentElement.getBoundingClientRect();
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
        var dataModel = this._data;
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
    };
    /**
     * @param {?=} plotlyInstance
     * @return {?}
     */
    WarpViewComponent.prototype.afterPlot = /**
     * @param {?=} plotlyInstance
     * @return {?}
     */
    function (plotlyInstance) {
        this.LOG.debug(['afterPlot', 'plotlyInstance'], plotlyInstance);
        this.chartDraw.emit();
        this.loading = false;
        this.rect = this.graph.getBoundingClientRect();
    };
    /**
     * @return {?}
     */
    WarpViewComponent.prototype.hideTooltip = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (!!this.hideTooltipTimer) {
            clearTimeout(this.hideTooltipTimer);
        }
        this.hideTooltipTimer = setTimeout((/**
         * @return {?}
         */
        function () {
            _this.toolTip.nativeElement.style.display = 'none';
        }), 1000);
    };
    /**
     * @param {?=} data
     * @param {?=} point
     * @return {?}
     */
    WarpViewComponent.prototype.unhover = /**
     * @param {?=} data
     * @param {?=} point
     * @return {?}
     */
    function (data, point) {
        this.LOG.debug(['unhover'], data);
        if (!!this.hideTooltipTimer) {
            clearTimeout(this.hideTooltipTimer);
        }
    };
    /**
     * @param {?} data
     * @param {?=} point
     * @return {?}
     */
    WarpViewComponent.prototype.hover = /**
     * @param {?} data
     * @param {?=} point
     * @return {?}
     */
    function (data, point) {
        this.LOG.debug(['hover'], data);
        this.toolTip.nativeElement.style.display = 'block';
        if (!!this.hideTooltipTimer) {
            clearTimeout(this.hideTooltipTimer);
        }
        /** @type {?} */
        var delta = Number.MAX_VALUE;
        /** @type {?} */
        var curves = [];
        if (!point) {
            if (data.points[0] && data.points[0].data.orientation !== 'h') {
                /** @type {?} */
                var y_1 = (data.yvals || [''])[0];
                data.points.forEach((/**
                 * @param {?} p
                 * @return {?}
                 */
                function (p) {
                    curves.push(p.curveNumber);
                    /** @type {?} */
                    var d = Math.abs((p.y || p.r) - y_1);
                    if (d < delta) {
                        delta = d;
                        point = p;
                    }
                }));
            }
            else {
                /** @type {?} */
                var x_1 = (data.xvals || [''])[0];
                data.points.forEach((/**
                 * @param {?} p
                 * @return {?}
                 */
                function (p) {
                    curves.push(p.curveNumber);
                    /** @type {?} */
                    var d = Math.abs((p.x || p.r) - x_1);
                    if (d < delta) {
                        delta = d;
                        point = p;
                    }
                }));
            }
        }
        if (point) {
            /** @type {?} */
            var content = this.legendFormatter(this._options.horizontal ?
                (data.yvals || [''])[0] :
                (data.xvals || [''])[0], data.points, point.curveNumber);
            /** @type {?} */
            var left = (data.event.offsetX + 20) + 'px';
            if (data.event.offsetX > this.chartContainer.nativeElement.clientWidth / 2) {
                left = Math.max(0, data.event.offsetX - this.toolTip.nativeElement.clientWidth - 20) + 'px';
            }
            /** @type {?} */
            var top_1 = Math.min(this.el.nativeElement.getBoundingClientRect().height - this.toolTip.nativeElement.getBoundingClientRect().height - 20, data.event.y - 20 - this.rect.top) + 'px';
            this.moveTooltip(top_1, left, content);
        }
    };
    /**
     * @return {?}
     */
    WarpViewComponent.prototype.getTooltipPosition = /**
     * @return {?}
     */
    function () {
        return {
            top: this.tooltipPosition.top,
            left: this.tooltipPosition.left,
        };
    };
    /**
     * @private
     * @param {?} top
     * @param {?} left
     * @param {?} content
     * @return {?}
     */
    WarpViewComponent.prototype.moveTooltip = /**
     * @private
     * @param {?} top
     * @param {?} left
     * @param {?} content
     * @return {?}
     */
    function (top, left, content) {
        this.tooltipPosition = { top: top, left: left };
        this.renderer.setProperty(this.toolTip.nativeElement, 'innerHTML', content);
    };
    /**
     * @param {?} $event
     * @return {?}
     */
    WarpViewComponent.prototype.relayout = /**
     * @param {?} $event
     * @return {?}
     */
    function ($event) {
    };
    /**
     * @protected
     * @param {?} el
     * @return {?}
     */
    WarpViewComponent.prototype.getLabelColor = /**
     * @protected
     * @param {?} el
     * @return {?}
     */
    function (el) {
        return this.getCSSColor(el, '--warp-view-chart-label-color', '#8e8e8e').trim();
    };
    /**
     * @protected
     * @param {?} el
     * @return {?}
     */
    WarpViewComponent.prototype.getGridColor = /**
     * @protected
     * @param {?} el
     * @return {?}
     */
    function (el) {
        return this.getCSSColor(el, '--warp-view-chart-grid-color', '#8e8e8e').trim();
    };
    /**
     * @protected
     * @param {?} el
     * @param {?} property
     * @param {?} defColor
     * @return {?}
     */
    WarpViewComponent.prototype.getCSSColor = /**
     * @protected
     * @param {?} el
     * @param {?} property
     * @param {?} defColor
     * @return {?}
     */
    function (el, property, defColor) {
        /** @type {?} */
        var color = getComputedStyle(el).getPropertyValue(property).trim();
        return color === '' ? defColor : color;
    };
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
    return WarpViewComponent;
}());
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
var Size = /** @class */ (function () {
    function Size(width, height) {
        this.width = width;
        this.height = height;
    }
    return Size;
}());
if (false) {
    /** @type {?} */
    Size.prototype.width;
    /** @type {?} */
    Size.prototype.height;
}
var SizeService = /** @class */ (function () {
    function SizeService() {
        this.sizeChanged$ = new EventEmitter();
    }
    /**
     * @param {?} size
     * @return {?}
     */
    SizeService.prototype.change = /**
     * @param {?} size
     * @return {?}
     */
    function (size) {
        this.sizeChanged$.emit(size);
    };
    return SizeService;
}());
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
var Timsort = /** @class */ (function () {
    function Timsort(array, compare) {
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
    Timsort.log10 = /**
     * @private
     * @param {?} x
     * @return {?}
     */
    function (x) {
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
    };
    /**
     * @private
     * @param {?} n
     * @return {?}
     */
    Timsort.minRunLength = /**
     * @private
     * @param {?} n
     * @return {?}
     */
    function (n) {
        /** @type {?} */
        var r = 0;
        while (n >= Timsort.DEFAULT_MIN_MERGE) {
            r |= (n & 1);
            n >>= 1;
        }
        return n + r;
    };
    /**
     * @private
     * @param {?} array
     * @param {?} lo
     * @param {?} hi
     * @param {?} compare
     * @return {?}
     */
    Timsort.makeAscendingRun = /**
     * @private
     * @param {?} array
     * @param {?} lo
     * @param {?} hi
     * @param {?} compare
     * @return {?}
     */
    function (array, lo, hi, compare) {
        /** @type {?} */
        var runHi = lo + 1;
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
    };
    /**
     * @private
     * @param {?} array
     * @param {?} lo
     * @param {?} hi
     * @return {?}
     */
    Timsort.reverseRun = /**
     * @private
     * @param {?} array
     * @param {?} lo
     * @param {?} hi
     * @return {?}
     */
    function (array, lo, hi) {
        hi--;
        while (lo < hi) {
            /** @type {?} */
            var t = array[lo];
            array[lo++] = array[hi];
            array[hi--] = t;
        }
    };
    /**
     * @private
     * @param {?} array
     * @param {?} lo
     * @param {?} hi
     * @param {?} start
     * @param {?} compare
     * @return {?}
     */
    Timsort.binaryInsertionSort = /**
     * @private
     * @param {?} array
     * @param {?} lo
     * @param {?} hi
     * @param {?} start
     * @param {?} compare
     * @return {?}
     */
    function (array, lo, hi, start, compare) {
        if (start === lo) {
            start++;
        }
        for (; start < hi; start++) {
            /** @type {?} */
            var pivot = array[start];
            // Ranges of the array where pivot belongs
            /** @type {?} */
            var left = lo;
            /** @type {?} */
            var right = start;
            while (left < right) {
                /** @type {?} */
                var mid = (left + right) >>> 1;
                if (compare(pivot, array[mid]) < 0) {
                    right = mid;
                }
                else {
                    left = mid + 1;
                }
            }
            /** @type {?} */
            var n = start - left;
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
    };
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
    Timsort.gallopLeft = /**
     * @private
     * @param {?} value
     * @param {?} array
     * @param {?} start
     * @param {?} length
     * @param {?} hint
     * @param {?} compare
     * @return {?}
     */
    function (value, array, start, length, hint, compare) {
        /** @type {?} */
        var lastOffset = 0;
        /** @type {?} */
        var maxOffset;
        /** @type {?} */
        var offset = 1;
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
            var tmp = lastOffset;
            lastOffset = hint - offset;
            offset = hint - tmp;
        }
        lastOffset++;
        while (lastOffset < offset) {
            /** @type {?} */
            var m = lastOffset + ((offset - lastOffset) >>> 1);
            if (compare(value, array[start + m]) > 0) {
                lastOffset = m + 1;
            }
            else {
                offset = m;
            }
        }
        return offset;
    };
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
    Timsort.gallopRight = /**
     * @private
     * @param {?} value
     * @param {?} array
     * @param {?} start
     * @param {?} length
     * @param {?} hint
     * @param {?} compare
     * @return {?}
     */
    function (value, array, start, length, hint, compare) {
        /** @type {?} */
        var lastOffset = 0;
        /** @type {?} */
        var maxOffset;
        /** @type {?} */
        var offset = 1;
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
            var tmp = lastOffset;
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
            var m = lastOffset + ((offset - lastOffset) >>> 1);
            if (compare(value, array[start + m]) < 0) {
                offset = m;
            }
            else {
                lastOffset = m + 1;
            }
        }
        return offset;
    };
    /**
     * @private
     * @param {?} a
     * @param {?} b
     * @return {?}
     */
    Timsort.alphabeticalCompare = /**
     * @private
     * @param {?} a
     * @param {?} b
     * @return {?}
     */
    function (a, b) {
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
            var al = Timsort.log10(a);
            /** @type {?} */
            var bl = Timsort.log10(b);
            /** @type {?} */
            var t = 0;
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
        var aStr = String(a);
        /** @type {?} */
        var bStr = String(b);
        if (aStr === bStr) {
            return 0;
        }
        return aStr < bStr ? -1 : 1;
    };
    /**
     * @param {?} array
     * @param {?=} compare
     * @param {?=} lo
     * @param {?=} hi
     * @return {?}
     */
    Timsort.sort = /**
     * @param {?} array
     * @param {?=} compare
     * @param {?=} lo
     * @param {?=} hi
     * @return {?}
     */
    function (array, compare, lo, hi) {
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
        var remaining = hi - lo;
        // The array is already sorted
        if (remaining < 2) {
            return;
        }
        /** @type {?} */
        var runLength = 0;
        // On small arrays binary sort can be used directly
        if (remaining < Timsort.DEFAULT_MIN_MERGE) {
            runLength = Timsort.makeAscendingRun(array, lo, hi, compare);
            Timsort.binaryInsertionSort(array, lo, hi, lo + runLength, compare);
            return;
        }
        /** @type {?} */
        var ts = new Timsort(array, compare);
        /** @type {?} */
        var minRun = Timsort.minRunLength(remaining);
        do {
            runLength = Timsort.makeAscendingRun(array, lo, hi, compare);
            if (runLength < minRun) {
                /** @type {?} */
                var force = remaining;
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
    };
    /**
     * @param {?} runStart
     * @param {?} runLength
     * @return {?}
     */
    Timsort.prototype.pushRun = /**
     * @param {?} runStart
     * @param {?} runLength
     * @return {?}
     */
    function (runStart, runLength) {
        this.runStart[this.stackSize] = runStart;
        this.runLength[this.stackSize] = runLength;
        this.stackSize += 1;
    };
    /**
     * @return {?}
     */
    Timsort.prototype.mergeRuns = /**
     * @return {?}
     */
    function () {
        while (this.stackSize > 1) {
            /** @type {?} */
            var n = this.stackSize - 2;
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
    };
    /**
     * @return {?}
     */
    Timsort.prototype.forceMergeRuns = /**
     * @return {?}
     */
    function () {
        while (this.stackSize > 1) {
            /** @type {?} */
            var n = this.stackSize - 2;
            if (n > 0 && this.runLength[n - 1] < this.runLength[n + 1]) {
                n--;
            }
            this.mergeAt(n);
        }
    };
    /**
     * @param {?} i
     * @return {?}
     */
    Timsort.prototype.mergeAt = /**
     * @param {?} i
     * @return {?}
     */
    function (i) {
        /** @type {?} */
        var compare = this.compare;
        /** @type {?} */
        var array = this.array;
        /** @type {?} */
        var start1 = this.runStart[i];
        /** @type {?} */
        var length1 = this.runLength[i];
        /** @type {?} */
        var start2 = this.runStart[i + 1];
        /** @type {?} */
        var length2 = this.runLength[i + 1];
        this.runLength[i] = length1 + length2;
        if (i === this.stackSize - 3) {
            this.runStart[i + 1] = this.runStart[i + 2];
            this.runLength[i + 1] = this.runLength[i + 2];
        }
        this.stackSize--;
        /** @type {?} */
        var k = Timsort.gallopRight(array[start2], array, start1, length1, 0, compare);
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
    };
    /**
     * @param {?} start1
     * @param {?} length1
     * @param {?} start2
     * @param {?} length2
     * @return {?}
     */
    Timsort.prototype.mergeLow = /**
     * @param {?} start1
     * @param {?} length1
     * @param {?} start2
     * @param {?} length2
     * @return {?}
     */
    function (start1, length1, start2, length2) {
        /** @type {?} */
        var compare = this.compare;
        /** @type {?} */
        var array = this.array;
        /** @type {?} */
        var tmp = this.tmp;
        /** @type {?} */
        var i;
        for (i = 0; i < length1; i++) {
            tmp[i] = array[start1 + i];
        }
        /** @type {?} */
        var cursor1 = 0;
        /** @type {?} */
        var cursor2 = start2;
        /** @type {?} */
        var dest = start1;
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
        var minGallop = this.minGallop;
        while (true) {
            /** @type {?} */
            var count1 = 0;
            /** @type {?} */
            var count2 = 0;
            /** @type {?} */
            var exit = false;
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
    };
    /**
     * @param {?} start1
     * @param {?} length1
     * @param {?} start2
     * @param {?} length2
     * @return {?}
     */
    Timsort.prototype.mergeHigh = /**
     * @param {?} start1
     * @param {?} length1
     * @param {?} start2
     * @param {?} length2
     * @return {?}
     */
    function (start1, length1, start2, length2) {
        /** @type {?} */
        var compare = this.compare;
        /** @type {?} */
        var array = this.array;
        /** @type {?} */
        var tmp = this.tmp;
        /** @type {?} */
        var i;
        for (i = 0; i < length2; i++) {
            tmp[i] = array[start2 + i];
        }
        /** @type {?} */
        var cursor1 = start1 + length1 - 1;
        /** @type {?} */
        var cursor2 = length2 - 1;
        /** @type {?} */
        var dest = start2 + length2 - 1;
        /** @type {?} */
        var customCursor = 0;
        /** @type {?} */
        var customDest = 0;
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
        var minGallop = this.minGallop;
        while (true) {
            /** @type {?} */
            var count1 = 0;
            /** @type {?} */
            var count2 = 0;
            /** @type {?} */
            var exit = false;
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
    };
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
    return Timsort;
}());
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
var WarpViewChartComponent = /** @class */ (function (_super) {
    __extends(WarpViewChartComponent, _super);
    function WarpViewChartComponent(el, renderer, sizeService, ngZone) {
        var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
        _this.el = el;
        _this.renderer = renderer;
        _this.sizeService = sizeService;
        _this.ngZone = ngZone;
        _this.standalone = true;
        _this.boundsDidChange = new EventEmitter();
        _this.pointHover = new EventEmitter();
        _this.warpViewChartResize = new EventEmitter();
        // tslint:disable-next-line:variable-name
        _this._type = 'line';
        _this.visibility = [];
        _this.maxTick = 0;
        _this.minTick = 0;
        _this.visibleGtsId = [];
        _this.gtsId = [];
        _this.dataHashset = {};
        _this.chartBounds = new ChartBounds();
        _this.visibilityStatus = 'unknown';
        _this.afterBoundsUpdate = false;
        _this.maxPlottable = 10000;
        _this.parsing = false;
        _this.unhighliteCurve = new Subject();
        _this.highliteCurve = new Subject();
        _this.layout = {
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
        _this.LOG = new Logger(WarpViewChartComponent, _this._debug);
        return _this;
    }
    Object.defineProperty(WarpViewChartComponent.prototype, "hiddenData", {
        set: /**
         * @param {?} hiddenData
         * @return {?}
         */
        function (hiddenData) {
            var _this = this;
            /** @type {?} */
            var previousVisibility = JSON.stringify(this.visibility);
            this.LOG.debug(['hiddenData', 'previousVisibility'], previousVisibility);
            this._hiddenData = hiddenData;
            this.visibility = [];
            this.visibleGtsId.forEach((/**
             * @param {?} id
             * @return {?}
             */
            function (id) { return _this.visibility.push(hiddenData.indexOf(id) < 0 && (id !== -1)); }));
            this.LOG.debug(['hiddenData', 'hiddendygraphfullv'], this.visibility);
            /** @type {?} */
            var newVisibility = JSON.stringify(this.visibility);
            this.LOG.debug(['hiddenData', 'json'], previousVisibility, newVisibility, this._hiddenData);
            if (previousVisibility !== newVisibility) {
                /** @type {?} */
                var visible_1 = [];
                /** @type {?} */
                var hidden_1 = [];
                (this.gtsId || []).forEach((/**
                 * @param {?} id
                 * @param {?} i
                 * @return {?}
                 */
                function (id, i) {
                    if (_this._hiddenData.indexOf(id) > -1) {
                        hidden_1.push(i);
                    }
                    else {
                        visible_1.push(i);
                    }
                }));
                if (visible_1.length > 0) {
                    this.graph.restyleChart({ visible: true }, visible_1);
                }
                if (hidden_1.length > 0) {
                    this.graph.restyleChart({ visible: false }, hidden_1);
                }
                this.LOG.debug(['hiddendygraphtrig', 'destroy'], 'redraw by visibility change', visible_1, hidden_1);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarpViewChartComponent.prototype, "type", {
        set: /**
         * @param {?} type
         * @return {?}
         */
        function (type) {
            this._type = type;
            this.drawChart();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    WarpViewChartComponent.prototype.update = /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    function (options, refresh) {
        this.drawChart(refresh);
    };
    /**
     * @return {?}
     */
    WarpViewChartComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this._options = this._options || this.defOptions;
    };
    /**
     * @return {?}
     */
    WarpViewChartComponent.prototype.getTimeClip = /**
     * @return {?}
     */
    function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise((/**
                     * @param {?} resolve
                     * @return {?}
                     */
                    function (resolve) {
                        _this.LOG.debug(['getTimeClip'], _this.chartBounds);
                        resolve(_this.chartBounds);
                    }))];
            });
        });
    };
    /**
     * @param {?} newHeight
     * @return {?}
     */
    WarpViewChartComponent.prototype.resize = /**
     * @param {?} newHeight
     * @return {?}
     */
    function (newHeight) {
        this.height = newHeight;
        this.layout.height = this.height;
        if (this._options.showRangeSelector) {
            this.layout.xaxis.rangeslider = {
                bgcolor: 'transparent',
                thickness: 40 / this.height
            };
        }
    };
    /**
     * @param {?=} reparseNewData
     * @return {?}
     */
    WarpViewChartComponent.prototype.drawChart = /**
     * @param {?=} reparseNewData
     * @return {?}
     */
    function (reparseNewData) {
        var _this = this;
        if (reparseNewData === void 0) { reparseNewData = false; }
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
        var x = {
            tick0: undefined,
            range: [],
        };
        this.LOG.debug(['drawChart', 'updateBounds'], this.chartBounds);
        /** @type {?} */
        var min = this.chartBounds.tsmin || this.minTick;
        /** @type {?} */
        var max = this.chartBounds.tsmax || this.maxTick;
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
        this.layout = __assign({}, this.layout);
        this.loading = false;
        this.highliteCurve.pipe(debounceTime(200)).subscribe((/**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            Promise.resolve().then((/**
             * @return {?}
             */
            function () {
                _this.graph.restyleChart({ opacity: 0.4 }, value.off);
                _this.graph.restyleChart({ opacity: 1 }, value.on);
            }));
        }));
        this.unhighliteCurve.pipe(debounceTime(200)).subscribe((/**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            Promise.resolve().then((/**
             * @return {?}
             */
            function () {
                _this.graph.restyleChart({ opacity: 1 }, value);
            }));
        }));
    };
    /**
     * @private
     * @param {?} min
     * @param {?} max
     * @param {?} marginLeft
     * @return {?}
     */
    WarpViewChartComponent.prototype.emitNewBounds = /**
     * @private
     * @param {?} min
     * @param {?} max
     * @param {?} marginLeft
     * @return {?}
     */
    function (min, max, marginLeft) {
        if (this._options.timeMode && this._options.timeMode === 'timestamp') {
            this.boundsDidChange.emit({ bounds: { min: min, max: max, marginLeft: marginLeft }, source: 'chart' });
        }
        else {
            this.boundsDidChange.emit({
                bounds: {
                    min: moment__default.tz(min, this._options.timeZone).valueOf(),
                    max: moment__default.tz(max, this._options.timeZone).valueOf(),
                    marginLeft: marginLeft
                }, source: 'chart'
            });
        }
    };
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    WarpViewChartComponent.prototype.convert = /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    function (data) {
        var _this = this;
        this.parsing = true;
        /** @type {?} */
        var dataset = [];
        this.LOG.debug(['convert'], this._options.timeMode);
        this.LOG.debug(['convert', 'this._hiddenData'], this._hiddenData);
        if (GTSLib.isArray(data.data)) {
            /** @type {?} */
            var gtsList = GTSLib.flatDeep(GTSLib.flattenGtsIdArray((/** @type {?} */ (data.data)), 0).res);
            this.maxTick = Number.NEGATIVE_INFINITY;
            this.minTick = Number.POSITIVE_INFINITY;
            this.visibleGtsId = [];
            this.gtsId = [];
            /** @type {?} */
            var nonPlottable = gtsList.filter((/**
             * @param {?} g
             * @return {?}
             */
            function (g) {
                _this.LOG.debug(['convert'], GTSLib.isGtsToPlot(g));
                return (g.v && !GTSLib.isGtsToPlot(g));
            }));
            gtsList = gtsList.filter((/**
             * @param {?} g
             * @return {?}
             */
            function (g) {
                return (g.v && GTSLib.isGtsToPlot(g));
            }));
            // initialize visibility status
            if (this.visibilityStatus === 'unknown') {
                this.visibilityStatus = gtsList.length > 0 ? 'plottableShown' : 'nothingPlottable';
            }
            this.LOG.debug(['convert'], this._options.timeMode);
            /** @type {?} */
            var timestampMode_1 = true;
            /** @type {?} */
            var tsLimit_1 = 100 * GTSLib.getDivider(this._options.timeUnit);
            this.LOG.debug(['convert'], 'forEach GTS');
            gtsList.forEach((/**
             * @param {?} gts
             * @return {?}
             */
            function (gts) {
                /** @type {?} */
                var ticks = gts.v.map((/**
                 * @param {?} t
                 * @return {?}
                 */
                function (t) { return t[0]; }));
                /** @type {?} */
                var size = gts.v.length;
                timestampMode_1 = timestampMode_1 && (ticks[0] > -tsLimit_1 && ticks[0] < tsLimit_1);
                timestampMode_1 = timestampMode_1 && (ticks[size - 1] > -tsLimit_1 && ticks[size - 1] < tsLimit_1);
            }));
            if (timestampMode_1 || this._options.timeMode === 'timestamp') {
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
            function (gts, i) {
                if (gts.v && GTSLib.isGtsToPlot(gts)) {
                    Timsort.sort(gts.v, (/**
                     * @param {?} a
                     * @param {?} b
                     * @return {?}
                     */
                    function (a, b) { return a[0] - b[0]; }));
                    /** @type {?} */
                    var size = gts.v.length;
                    _this.LOG.debug(['convert'], gts);
                    /** @type {?} */
                    var label = GTSLib.serializeGtsMetadata(gts);
                    /** @type {?} */
                    var c = ColorLib.getColor(gts.id, _this._options.scheme);
                    /** @type {?} */
                    var color = ((data.params || [])[i] || { datasetColor: c }).datasetColor || c;
                    /** @type {?} */
                    var series = {
                        type: _this._type === 'spline' ? 'scatter' : 'scattergl',
                        mode: _this._type === 'scatter' ? 'markers' : size > _this.maxPlottable ? 'lines' : 'lines+markers',
                        // name: label,
                        text: label,
                        x: [],
                        y: [],
                        line: { color: color },
                        hoverinfo: 'none',
                        connectgaps: false,
                        visible: !(_this._hiddenData.filter((/**
                         * @param {?} h
                         * @return {?}
                         */
                        function (h) { return h === gts.id; })).length > 0),
                    };
                    if (_this._type === 'scatter' || size < _this.maxPlottable) {
                        series.marker = {
                            size: 15,
                            color: new Array(size).fill(color),
                            line: { color: color, width: 3 },
                            opacity: new Array(size).fill(_this._type === 'scatter' || _this._options.showDots ? 1 : 0)
                        };
                    }
                    switch (_this._type) {
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
                    _this.visibleGtsId.push(gts.id);
                    _this.gtsId.push(gts.id);
                    _this.LOG.debug(['convert'], 'forEach value');
                    /** @type {?} */
                    var ticks = gts.v.map((/**
                     * @param {?} t
                     * @return {?}
                     */
                    function (t) { return t[0]; }));
                    /** @type {?} */
                    var values = gts.v.map((/**
                     * @param {?} t
                     * @return {?}
                     */
                    function (t) { return t[t.length - 1]; }));
                    if (size > 0) {
                        _this.minTick = _this.minTick || ticks[0];
                        _this.maxTick = _this.maxTick || ticks[0];
                        for (var v = 1; v < size; v++) {
                            /** @type {?} */
                            var val = ticks[v];
                            _this.minTick = val <= _this.minTick ? val : _this.minTick;
                            _this.maxTick = val >= _this.maxTick ? val : _this.maxTick;
                        }
                    }
                    if (timestampMode_1 || _this._options.timeMode === 'timestamp') {
                        series.x = ticks;
                    }
                    else {
                        if (_this._options.timeZone !== 'UTC') {
                            series.x = ticks.map((/**
                             * @param {?} t
                             * @return {?}
                             */
                            function (t) { return moment__default.utc(t / _this.divider).tz(_this._options.timeZone).toISOString(); }));
                        }
                        else {
                            series.x = ticks.map((/**
                             * @param {?} t
                             * @return {?}
                             */
                            function (t) { return moment__default.utc(t / _this.divider).toISOString(); }));
                        }
                    }
                    series.y = values;
                    _this.LOG.debug(['convert'], 'forEach value end', _this.minTick, _this.maxTick);
                    dataset.push(series);
                }
            }));
            if (nonPlottable.length > 0 && gtsList.length === 0) {
                nonPlottable.forEach((/**
                 * @param {?} g
                 * @return {?}
                 */
                function (g) {
                    g.v.forEach((/**
                     * @param {?} value
                     * @return {?}
                     */
                    function (value) {
                        /** @type {?} */
                        var ts = value[0];
                        if (ts < _this.minTick) {
                            _this.minTick = ts;
                        }
                        if (ts > _this.maxTick) {
                            _this.maxTick = ts;
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
    };
    /**
     * @param {?} plotlyInstance
     * @return {?}
     */
    WarpViewChartComponent.prototype.afterPlot = /**
     * @param {?} plotlyInstance
     * @return {?}
     */
    function (plotlyInstance) {
        _super.prototype.afterPlot.call(this, plotlyInstance);
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
    };
    /**
     * @param {?} data
     * @return {?}
     */
    WarpViewChartComponent.prototype.relayout = /**
     * @param {?} data
     * @return {?}
     */
    function (data) {
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
    };
    /**
     * @param {?} $event
     * @return {?}
     */
    WarpViewChartComponent.prototype.sliderChange = /**
     * @param {?} $event
     * @return {?}
     */
    function ($event) {
        this.LOG.debug(['sliderChange'], $event);
        console.log($event);
    };
    /**
     * @param {?} min
     * @param {?} max
     * @return {?}
     */
    WarpViewChartComponent.prototype.updateBounds = /**
     * @param {?} min
     * @param {?} max
     * @return {?}
     */
    function (min, max) {
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
        this.layout = __assign({}, this.layout);
        this.LOG.debug(['updateBounds'], this.layout);
        this.afterBoundsUpdate = true;
    };
    /**
     * @param {?} chartBounds
     * @return {?}
     */
    WarpViewChartComponent.prototype.setRealBounds = /**
     * @param {?} chartBounds
     * @return {?}
     */
    function (chartBounds) {
        this.afterBoundsUpdate = true;
        this.minTick = chartBounds.tsmin;
        this.maxTick = chartBounds.tsmax;
        this._options.bounds = this._options.bounds || {};
        this._options.bounds.minDate = this.minTick;
        this._options.bounds.maxDate = this.maxTick;
        /** @type {?} */
        var x = {
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
        this.layout = __assign({}, this.layout);
    };
    /**
     * @param {?} data
     * @return {?}
     */
    WarpViewChartComponent.prototype.hover = /**
     * @param {?} data
     * @return {?}
     */
    function (data) {
        this.LOG.debug(['hover'], data);
        /** @type {?} */
        var delta = Number.MAX_VALUE;
        // tslint:disable-next-line:no-shadowed-variable
        /** @type {?} */
        var point;
        /** @type {?} */
        var curves = [];
        this.toolTip.nativeElement.style.display = 'block';
        if (data.points[0] && data.points[0].data.orientation !== 'h') {
            /** @type {?} */
            var y_1 = (data.yvals || [''])[0];
            data.points.forEach((/**
             * @param {?} p
             * @return {?}
             */
            function (p) {
                curves.push(p.curveNumber);
                /** @type {?} */
                var d = Math.abs(p.y - y_1);
                if (d < delta) {
                    delta = d;
                    point = p;
                }
            }));
        }
        else {
            /** @type {?} */
            var x_1 = (data.xvals || [''])[0];
            data.points.forEach((/**
             * @param {?} p
             * @return {?}
             */
            function (p) {
                curves.push(p.curveNumber);
                /** @type {?} */
                var d = Math.abs(p.x - x_1);
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
        _super.prototype.hover.call(this, data, point);
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
    };
    /**
     * @param {?} data
     * @return {?}
     */
    WarpViewChartComponent.prototype.unhover = /**
     * @param {?} data
     * @return {?}
     */
    function (data) {
        /** @type {?} */
        var delta = Number.MAX_VALUE;
        // tslint:disable-next-line:no-shadowed-variable
        /** @type {?} */
        var point;
        if (data.points[0] && data.points[0].data.orientation !== 'h') {
            /** @type {?} */
            var y_2 = (data.yvals || [''])[0];
            data.points.forEach((/**
             * @param {?} p
             * @return {?}
             */
            function (p) {
                /** @type {?} */
                var d = Math.abs(p.y - y_2);
                if (d < delta) {
                    delta = d;
                    point = p;
                }
            }));
        }
        else {
            /** @type {?} */
            var x_2 = (data.xvals || [''])[0];
            data.points.forEach((/**
             * @param {?} p
             * @return {?}
             */
            function (p) {
                /** @type {?} */
                var d = Math.abs(p.x - x_2);
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
        _super.prototype.unhover.call(this, data, point);
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
    };
    WarpViewChartComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-chart',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\" #chartContainer (mouseleave)=\"hideTooltip()\">\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <p class=\"noData\" *ngIf=\"parsing\">Parsing data</p>\n  <div *ngIf=\"!loading && !noData\" >\n    <warpview-plotly #graph\n                     [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot($event)\"\n                     (relayout)=\"relayout($event)\" (hover)=\"hover($event)\"\n                     [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                     (sliderChange)=\"sliderChange($event)\" (unhover)=\"unhover($event)\"\n                     [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n  <div #toolTip class=\"tooltip\" [ngStyle]=\"getTooltipPosition()\"></div>\n</div>\n",
                    encapsulation: ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}.tooltip{background-color:var(--warp-view-chart-legend-bg)!important;color:var(--warp-view-chart-legend-color)!important;text-align:left;position:absolute;display:none;padding:10px;border:1px solid grey;border-radius:5px;box-shadow:none;pointer-events:none;font-size:10px;min-width:100px;width:auto;max-width:50%;z-index:999;height:auto!important;left:-1000px}.tooltip .chip{border-radius:50%;background-color:#bbb;display:inline-block;width:5px;height:5px;border:2px solid #454545;margin-top:auto;margin-bottom:auto;vertical-align:middle;cursor:pointer}:host{display:block;height:100%}:host #chartContainer{height:100%}:host #chartContainer div{height:100%}:host div.chart{width:var(--warp-view-chart-width);height:var(--warp-view-chart-height)}:host .executionErrorText{color:red;padding:10px;border-radius:3px;background:#faebd7;position:absolute;top:-30px;border:2px solid red}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewChartComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: SizeService },
        { type: NgZone }
    ]; };
    WarpViewChartComponent.propDecorators = {
        hiddenData: [{ type: Input, args: ['hiddenData',] }],
        type: [{ type: Input, args: ['type',] }],
        standalone: [{ type: Input, args: ['standalone',] }],
        boundsDidChange: [{ type: Output, args: ['boundsDidChange',] }],
        pointHover: [{ type: Output, args: ['pointHover',] }],
        warpViewChartResize: [{ type: Output, args: ['warpViewChartResize',] }]
    };
    return WarpViewChartComponent;
}(WarpViewComponent));
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
var HttpErrorHandler = /** @class */ (function () {
    /**
     */
    function HttpErrorHandler() {
        var _this = this;
        this.createHandleError = (/**
         * @param {?=} serviceName
         * @return {?}
         */
        function (serviceName) {
            if (serviceName === void 0) { serviceName = ''; }
            return (
            // tslint:disable-next-line:semicolon
            // tslint:disable-next-line:semicolon
            /**
             * @param {?=} operation
             * @return {?}
             */
            function (operation) {
                if (operation === void 0) { operation = 'operation'; }
                return _this.handleError(serviceName, operation);
            });
        });
        this.LOG = new Logger(HttpErrorHandler, true);
    }
    /**
     * @param {?=} serviceName
     * @param {?=} operation
     * @return {?}
     */
    HttpErrorHandler.prototype.handleError = /**
     * @param {?=} serviceName
     * @param {?=} operation
     * @return {?}
     */
    function (serviceName, operation) {
        var _this = this;
        if (serviceName === void 0) { serviceName = ''; }
        if (operation === void 0) { operation = 'operation'; }
        return (/**
         * @param {?} error
         * @return {?}
         */
        function (error) {
            _this.LOG.error([serviceName], error);
            _this.LOG.error([serviceName], operation + " failed: " + error.statusText);
            /** @type {?} */
            var message = ((error.error || {}).message)
                ? error.error.message
                : error.status ? error.statusText : 'Server error';
            _this.LOG.error([serviceName], message);
            return of(message);
        });
    };
    HttpErrorHandler.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    HttpErrorHandler.ctorParameters = function () { return []; };
    return HttpErrorHandler;
}());
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
    /** @nocollapse */ Warp10Service.ngInjectableDef = ɵɵdefineInjectable({ factory: function Warp10Service_Factory() { return new Warp10Service(ɵɵinject(HttpClient), ɵɵinject(HttpErrorHandler)); }, token: Warp10Service, providedIn: "root" });
    return Warp10Service;
}());
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
var WarpViewTileComponent = /** @class */ (function (_super) {
    __extends(WarpViewTileComponent, _super);
    function WarpViewTileComponent(el, sizeService, renderer, ngZone, warp10Service) {
        var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
        _this.el = el;
        _this.sizeService = sizeService;
        _this.renderer = renderer;
        _this.ngZone = ngZone;
        _this.warp10Service = warp10Service;
        _this.warpscriptResult = new EventEmitter();
        _this.execStatus = new EventEmitter();
        _this.execError = new EventEmitter();
        _this.type = 'line';
        _this.url = '';
        _this.isAlone = false; // used by plot to manage its keyboard events
        _this.loaderMessage = '';
        _this.loading = false;
        _this._gtsFilter = '';
        _this._warpScript = '';
        _this.execUrl = '';
        _this.timeUnit = 'us';
        _this.LOG = new Logger(WarpViewTileComponent, _this._debug);
        return _this;
    }
    Object.defineProperty(WarpViewTileComponent.prototype, "gtsFilter", {
        set: 
        // used by plot to manage its keyboard events
        /**
         * @param {?} gtsFilter
         * @return {?}
         */
        function (gtsFilter) {
            this._gtsFilter = gtsFilter;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarpViewTileComponent.prototype, "warpscript", {
        get: /**
         * @return {?}
         */
        function () {
            return this._warpScript;
        },
        set: /**
         * @param {?} warpScript
         * @return {?}
         */
        function (warpScript) {
            if (!!warpScript && this._warpScript !== warpScript) {
                this._warpScript = warpScript;
                this.execute(true);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    WarpViewTileComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this._options = this._options || this.defOptions;
    };
    /**
     * @return {?}
     */
    WarpViewTileComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        this._warpScript = this._warpScript || this.warpRef.nativeElement.textContent.trim();
        this.LOG.debug(['ngAfterViewInit', 'warpScript'], this._warpScript);
        this.el.nativeElement.style.opacity = '1';
        if (this.warpRef.nativeElement.textContent.trim() !== '') {
            this.execute(false);
        }
    };
    /**
     * @param {?} options
     * @return {?}
     */
    WarpViewTileComponent.prototype.update = /**
     * @param {?} options
     * @return {?}
     */
    function (options) {
        this.LOG.debug(['update', 'options'], options);
    };
    /* Listeners */
    /* Listeners */
    /**
     * @param {?} event
     * @return {?}
     */
    // @HostListener('keydown', ['$event'])
    WarpViewTileComponent.prototype.handleKeyDown = /* Listeners */
    /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (event.key === 'r') {
            this.execute(false);
        }
    };
    /** detect some VSCode special modifiers in the beginnig of the code:
     * @endpoint xxxURLxxx
     * @timeUnit ns
     * warning : the first line is empty (to confirm with other browsers)
     */
    /**
     * detect some VSCode special modifiers in the beginnig of the code:
     * \@endpoint xxxURLxxx
     * \@timeUnit ns
     * warning : the first line is empty (to confirm with other browsers)
     * @private
     * @return {?}
     */
    WarpViewTileComponent.prototype.detectWarpScriptSpecialComments = /**
     * detect some VSCode special modifiers in the beginnig of the code:
     * \@endpoint xxxURLxxx
     * \@timeUnit ns
     * warning : the first line is empty (to confirm with other browsers)
     * @private
     * @return {?}
     */
    function () {
        // analyse the first warpScript lines starting with //
        /** @type {?} */
        var extraParamsPattern = /\s*\/\/\s*@(\w*)\s*(.*)$/g;
        /** @type {?} */
        var warpscriptLines = this._warpScript.split('\n');
        for (var l = 1; l < warpscriptLines.length; l++) {
            /** @type {?} */
            var currentLine = warpscriptLines[l];
            if (currentLine === '' || currentLine.search('//') >= 0) {
                // find and extract // @paramname parameters
                /** @type {?} */
                var lineOnMatch = void 0;
                /** @type {?} */
                var re = RegExp(extraParamsPattern);
                // noinspection JSAssignmentUsedAsCondition
                // tslint:disable-next-line:no-conditional-assignment JSAssignmentUsedAsCondition
                // noinspection JSAssignmentUsedAsCondition
                while (lineOnMatch = re.exec(currentLine)) {
                    /** @type {?} */
                    var parameterName = lineOnMatch[1];
                    /** @type {?} */
                    var parameterValue = lineOnMatch[2];
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
    };
    /**
     * @private
     * @param {?} isRefresh
     * @return {?}
     */
    WarpViewTileComponent.prototype.execute = /**
     * @private
     * @param {?} isRefresh
     * @return {?}
     */
    function (isRefresh) {
        var _this = this;
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
            function (response) {
                _this.loading = false;
                _this.LOG.debug(['execute'], response);
                if (((/** @type {?} */ (response))).body) {
                    try {
                        /** @type {?} */
                        var body_1 = ((/** @type {?} */ (response))).body;
                        _this.warpscriptResult.emit(body_1);
                        /** @type {?} */
                        var headers = ((/** @type {?} */ (response))).headers;
                        _this.status = "Your script execution took\n " + GTSLib.formatElapsedTime(parseInt(headers.get('x-warp10-elapsed'), 10)) + "\n serverside, fetched\n " + headers.get('x-warp10-fetched') + " datapoints and performed\n " + headers.get('x-warp10-ops') + "  WarpScript operations.";
                        _this.execStatus.emit({
                            message: _this.status,
                            ops: parseInt(headers.get('x-warp10-ops'), 10),
                            elapsed: parseInt(headers.get('x-warp10-elapsed'), 10),
                            fetched: parseInt(headers.get('x-warp10-fetched'), 10),
                        });
                        if (_this._autoRefresh !== _this._options.autoRefresh) {
                            _this._autoRefresh = _this._options.autoRefresh;
                            if (_this.timer) {
                                window.clearInterval(_this.timer);
                            }
                            if (_this._autoRefresh && _this._autoRefresh > 0) {
                                _this.timer = window.setInterval((/**
                                 * @return {?}
                                 */
                                function () { return _this.execute(true); }), _this._autoRefresh * 1000);
                            }
                        }
                        setTimeout((/**
                         * @return {?}
                         */
                        function () {
                            _this.execResult = body_1;
                            _this.loading = false;
                        }));
                    }
                    catch (e) {
                        _this.LOG.error(['execute'], e);
                        _this.loading = false;
                    }
                }
                else {
                    _this.LOG.error(['execute'], response);
                    _this.error = response;
                    _this.loading = false;
                    _this.execError.emit(response);
                }
            }), (/**
             * @param {?} e
             * @return {?}
             */
            function (e) {
                _this.loading = false;
                _this.execError.emit(e);
                _this.LOG.error(['execute'], e);
            }));
        }
    };
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    WarpViewTileComponent.prototype.convert = /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    function (data) {
        return [];
    };
    /**
     * @param {?} event
     * @return {?}
     */
    WarpViewTileComponent.prototype.chartDrawn = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.chartDraw.emit(event);
    };
    WarpViewTileComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-tile',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n<div class=\"wrapper\" [ngClass]=\"{'full':  responsive}\">\n  <div class=\"tilewrapper\">\n    <h1 *ngIf=\"chartTitle\">{{chartTitle}}</h1>\n    <div [ngClass]=\"{'tile': true,'notitle':  !chartTitle || chartTitle === ''}\">\n      <warpview-spinner *ngIf=\"loading\" message=\"Requesting data\"></warpview-spinner>\n      <div *ngIf=\"_options.showErrors && error\" style=\"height: calc(100% - 30px); width: 100%\">\n        <warpview-display [responsive]=\"true\" [debug]=\"debug\" [options]=\"_options\"\n                          [data]=\"{ data: error,  globalParams: {\n  timeMode:  'custom', bgColor: '#D32C2E', fontColor: '#ffffff'}}\"></warpview-display>\n      </div>\n      <div *ngIf=\"!error\" style=\"height: 100%; width: 100%\" [hidden]=\"loading\">\n        <warpview-result-tile [debug]=\"debug\" [type]=\"type\" [unit]=\"unit\" [options]=\"_options\"\n                              (chartDraw)=\"chartDrawn($event)\"\n                              [showLegend]=\"showLegend\" [data]=\"execResult\"></warpview-result-tile>\n      </div>\n    </div>\n  </div>\n  <small *ngIf=\"_options.showStatus\" class=\"status\">{{status}}</small>\n</div>\n\n<div #warpRef style=\"display: none\">\n  <ng-content></ng-content>\n</div>\n",
                    providers: [HttpErrorHandler],
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host,warp-view-tile,warpview-tile{width:var(--warp-view-tile-width,100%);max-height:var(--warp-view-tile-height,100%);overflow:auto;min-width:var(--warp-view-tile-width,100%);min-height:var(--warp-view-tile-height,100%)}:host .error,warp-view-tile .error,warpview-tile .error{width:100%;text-align:center;color:#dc3545;font-weight:700}:host .wrapper,warp-view-tile .wrapper,warpview-tile .wrapper{opacity:1;min-height:50px;width:var(--warp-view-tile-width,100%);height:var(--warp-view-tile-height,100%)}:host .wrapper .status,warp-view-tile .wrapper .status,warpview-tile .wrapper .status{position:absolute;z-index:999;bottom:20px;background-color:rgba(255,255,255,.7);padding:1px 5px;font-size:11px;color:#000}:host .wrapper.full,warp-view-tile .wrapper.full,warpview-tile .wrapper.full{width:100%;height:100%;display:-webkit-box;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;flex-direction:column;justify-content:space-around}:host .wrapper .tilewrapper,warp-view-tile .wrapper .tilewrapper,warpview-tile .wrapper .tilewrapper{width:100%;height:100%}:host .wrapper .tilewrapper .tile,warp-view-tile .wrapper .tilewrapper .tile,warpview-tile .wrapper .tilewrapper .tile{width:100%;height:calc(var(--warp-view-tile-height,100%) - 40px);overflow-y:auto;overflow-x:hidden;position:relative}:host .wrapper .tilewrapper .notitle,warp-view-tile .wrapper .tilewrapper .notitle,warpview-tile .wrapper .tilewrapper .notitle{height:100%}:host .wrapper .tilewrapper h1,warp-view-tile .wrapper .tilewrapper h1,warpview-tile .wrapper .tilewrapper h1{font-size:20px;padding:5px;margin:0;color:var(--warp-view-font-color)}:host .wrapper .tilewrapper h1 small,warp-view-tile .wrapper .tilewrapper h1 small,warpview-tile .wrapper .tilewrapper h1 small{font-size:10px;margin-left:10px}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewTileComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: SizeService },
        { type: Renderer2 },
        { type: NgZone },
        { type: Warp10Service }
    ]; };
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
    return WarpViewTileComponent;
}(WarpViewComponent));
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
var WarpViewSpinnerComponent = /** @class */ (function () {
    function WarpViewSpinnerComponent() {
        this.message = 'Loading and parsing data...';
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
    return WarpViewSpinnerComponent;
}());
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
var WarpViewToggleComponent = /** @class */ (function () {
    function WarpViewToggleComponent(el) {
        this.el = el;
        this.text1 = '';
        this.text2 = '';
        this.stateChange = new EventEmitter();
        this.state = false;
    }
    Object.defineProperty(WarpViewToggleComponent.prototype, "checked", {
        get: /**
         * @return {?}
         */
        function () {
            return this.state;
        },
        set: /**
         * @param {?} state
         * @return {?}
         */
        function (state) {
            this.state = state;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    WarpViewToggleComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.state = this.checked;
    };
    /**
     * @return {?}
     */
    WarpViewToggleComponent.prototype.switched = /**
     * @return {?}
     */
    function () {
        this.state = !this.state;
        this.stateChange.emit({ state: this.state, id: this.el.nativeElement.id });
    };
    WarpViewToggleComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-toggle',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"container\">\n  <div class=\"text\">{{text1}}</div>\n  <label class=\"switch\">\n    <input type=\"checkbox\" class=\"switch-input\" [checked]=\"state\" (click)=\"switched()\"/>\n    <span class=\"switch-label\"></span>\n    <span class=\"switch-handle\"></span>\n  </label>\n  <div class=\"text\">{{text2}}</div>\n</div>\n",
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host .switch{position:relative;margin-top:auto;margin-bottom:auto;display:block;width:var(--warp-view-switch-width);height:var(--warp-view-switch-height);padding:3px;border-radius:var(--warp-view-switch-radius);cursor:pointer}:host .switch-input{display:none}:host .switch-label{position:relative;display:block;height:inherit;text-transform:uppercase;background:var(--warp-view-switch-inset-color);border-radius:inherit;box-shadow:inset 0 1px 2px rgba(0,0,0,.12),inset 0 0 2px rgba(0,0,0,.15)}:host .switch-input:checked~.switch-label{background:var(--warp-view-switch-inset-checked-color);box-shadow:inset 0 1px 2px rgba(0,0,0,.15),inset 0 0 3px rgba(0,0,0,.2)}:host .switch-handle{position:absolute;top:4px;left:4px;width:calc(var(--warp-view-switch-height) - 2px);height:calc(var(--warp-view-switch-height) - 2px);background:var(--warp-view-switch-handle-color);border-radius:100%;box-shadow:1px 1px 5px rgba(0,0,0,.2)}:host .switch-input:checked~.switch-handle{left:calc(var(--warp-view-switch-width) - var(--warp-view-switch-height) - 2px);background:var(--warp-view-switch-handle-checked-color);box-shadow:-1px 1px 5px rgba(0,0,0,.2)}:host .switch-handle,:host .switch-label{-webkit-transition:All .3s;transition:All .3s;-moz-transition:All .3s;-o-transition:All .3s}:host .container{display:-webkit-box;display:flex}:host .text{color:var(--warp-view-font-color);padding:7px}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewToggleComponent.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    WarpViewToggleComponent.propDecorators = {
        checked: [{ type: Input, args: ['checked',] }],
        text1: [{ type: Input, args: ['text1',] }],
        text2: [{ type: Input, args: ['text2',] }],
        stateChange: [{ type: Output, args: ['stateChange',] }]
    };
    return WarpViewToggleComponent;
}());
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
var WarpViewBarComponent = /** @class */ (function (_super) {
    __extends(WarpViewBarComponent, _super);
    function WarpViewBarComponent(el, renderer, sizeService, ngZone) {
        var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
        _this.el = el;
        _this.renderer = renderer;
        _this.sizeService = sizeService;
        _this.ngZone = ngZone;
        _this.layout = {
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
        _this.LOG = new Logger(WarpViewBarComponent, _this._debug);
        return _this;
    }
    /**
     * @return {?}
     */
    WarpViewBarComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.drawChart();
    };
    /**
     * @param {?} options
     * @return {?}
     */
    WarpViewBarComponent.prototype.update = /**
     * @param {?} options
     * @return {?}
     */
    function (options) {
        this.drawChart();
    };
    /**
     * @private
     * @return {?}
     */
    WarpViewBarComponent.prototype.drawChart = /**
     * @private
     * @return {?}
     */
    function () {
        if (!this.initChart(this.el)) {
            return;
        }
        this.plotlyConfig.scrollZoom = true;
        this.buildGraph();
    };
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    WarpViewBarComponent.prototype.convert = /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    function (data) {
        var _this = this;
        /** @type {?} */
        var gtsList = [];
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
        var dataset = [];
        gtsList.forEach((/**
         * @param {?} gts
         * @param {?} i
         * @return {?}
         */
        function (gts, i) {
            _this.LOG.debug(['convert', 'gts item'], gts);
            if (gts.v) {
                Timsort.sort(gts.v, (/**
                 * @param {?} a
                 * @param {?} b
                 * @return {?}
                 */
                function (a, b) { return a[0] - b[0]; }));
                /** @type {?} */
                var label = GTSLib.serializeGtsMetadata(gts);
                /** @type {?} */
                var c = ColorLib.getColor(gts.id || i, _this._options.scheme);
                /** @type {?} */
                var color = ((data.params || [])[i] || { datasetColor: c }).datasetColor || c;
                /** @type {?} */
                var series_1 = {
                    type: 'bar',
                    mode: 'lines+markers',
                    name: label,
                    text: label,
                    orientation: _this._options.horizontal ? 'h' : 'v',
                    x: [],
                    y: [],
                    hoverinfo: 'none',
                    marker: {
                        color: ColorLib.transparentize(color),
                        line: {
                            color: color,
                            width: 1
                        }
                    }
                };
                gts.v.forEach((/**
                 * @param {?} value
                 * @return {?}
                 */
                function (value) {
                    /** @type {?} */
                    var ts = value[0];
                    if (!_this._options.horizontal) {
                        series_1.y.push(value[value.length - 1]);
                        if (_this._options.timeMode && _this._options.timeMode === 'timestamp') {
                            series_1.x.push(ts);
                        }
                        else {
                            series_1.x.push(moment__default.tz(moment__default.utc(ts / _this.divider), _this._options.timeZone).toISOString());
                        }
                    }
                    else {
                        series_1.x.push(value[value.length - 1]);
                        if (_this._options.timeMode && _this._options.timeMode === 'timestamp') {
                            series_1.y.push(ts);
                        }
                        else {
                            series_1.y.push(moment__default.tz(moment__default.utc(ts / _this.divider), _this._options.timeZone).toISOString());
                        }
                    }
                }));
                dataset.push(series_1);
            }
            else {
                _this._options.timeMode = 'custom';
                _this.LOG.debug(['convert', 'gts'], gts);
                (gts.columns || []).forEach((/**
                 * @param {?} label
                 * @param {?} index
                 * @return {?}
                 */
                function (label, index) {
                    /** @type {?} */
                    var c = ColorLib.getColor(gts.id || index, _this._options.scheme);
                    /** @type {?} */
                    var color = ((data.params || [])[index] || { datasetColor: c }).datasetColor || c;
                    /** @type {?} */
                    var series = {
                        type: 'bar',
                        mode: 'lines+markers',
                        name: label,
                        text: label,
                        orientation: _this._options.horizontal ? 'h' : 'v',
                        x: [],
                        y: [],
                        hoverinfo: 'none',
                        marker: {
                            color: ColorLib.transparentize(color),
                            line: {
                                color: color,
                                width: 1
                            }
                        }
                    };
                    if (_this._options.horizontal) {
                        (gts.rows || []).forEach((/**
                         * @param {?} r
                         * @return {?}
                         */
                        function (r) {
                            series.y.unshift(r[0]);
                            series.x.push(r[index + 1]);
                        }));
                    }
                    else {
                        (gts.rows || []).forEach((/**
                         * @param {?} r
                         * @return {?}
                         */
                        function (r) {
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
    };
    /**
     * @private
     * @return {?}
     */
    WarpViewBarComponent.prototype.buildGraph = /**
     * @private
     * @return {?}
     */
    function () {
        this.LOG.debug(['buildGraph', 'this.layout'], this.responsive);
        this.LOG.debug(['buildGraph', 'this.layout'], this.layout);
        this.LOG.debug(['buildGraph', 'this.plotlyConfig'], this.plotlyConfig);
        this.layout.showlegend = this._showLegend;
        this.layout.barmode = this._options.stacked ? 'stack' : 'group';
        this.layout.yaxis.color = this.getGridColor(this.el.nativeElement);
        this.layout.xaxis.color = this.getGridColor(this.el.nativeElement);
        this.loading = false;
    };
    WarpViewBarComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-bar',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\" #chartContainer (mouseleave)=\"hideTooltip()\">\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display or wrong data format.</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-plotly #graph *ngIf=\"plotlyData?.length > 0\"\n                 [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot()\"\n                 className=\"chart\" (hover)=\"hover($event)\" (unhover)=\"unhover($event)\"\n                 [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                 [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n  <div #toolTip class=\"tooltip\" [ngStyle]=\"getTooltipPosition()\"></div>\n</div>\n",
                    encapsulation: ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}.tooltip{background-color:var(--warp-view-chart-legend-bg)!important;color:var(--warp-view-chart-legend-color)!important;text-align:left;position:absolute;display:none;padding:10px;border:1px solid grey;border-radius:5px;box-shadow:none;pointer-events:none;font-size:10px;min-width:100px;width:auto;max-width:50%;z-index:999;height:auto!important;left:-1000px}.tooltip .chip{border-radius:50%;background-color:#bbb;display:inline-block;width:5px;height:5px;border:2px solid #454545;margin-top:auto;margin-bottom:auto;vertical-align:middle;cursor:pointer}:host{display:block;height:100%}:host .modebar-group path{fill:var(--warp-view-font-color)}:host #chartContainer{height:100%}:host #chartContainer div{height:100%}:host div.chart{width:var(--warp-view-chart-width);height:var(--warp-view-chart-height)}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewBarComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: SizeService },
        { type: NgZone }
    ]; };
    return WarpViewBarComponent;
}(WarpViewComponent));
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
var WarpViewBubbleComponent = /** @class */ (function (_super) {
    __extends(WarpViewBubbleComponent, _super);
    function WarpViewBubbleComponent(el, renderer, sizeService, ngZone) {
        var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
        _this.el = el;
        _this.renderer = renderer;
        _this.sizeService = sizeService;
        _this.ngZone = ngZone;
        _this.layout = {
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
        _this.LOG = new Logger(WarpViewBubbleComponent, _this._debug);
        return _this;
    }
    /**
     * @return {?}
     */
    WarpViewBubbleComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.drawChart();
    };
    /**
     * @param {?} options
     * @return {?}
     */
    WarpViewBubbleComponent.prototype.update = /**
     * @param {?} options
     * @return {?}
     */
    function (options) {
        this.drawChart();
    };
    /**
     * @private
     * @return {?}
     */
    WarpViewBubbleComponent.prototype.drawChart = /**
     * @private
     * @return {?}
     */
    function () {
        if (!this.initChart(this.el)) {
            return;
        }
        this.plotlyConfig.scrollZoom = true;
        this.buildGraph();
    };
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    WarpViewBubbleComponent.prototype.convert = /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    function (data) {
        var _this = this;
        /** @type {?} */
        var dataset = [];
        GTSLib.flatDeep((/** @type {?} */ (data.data))).forEach((/**
         * @param {?} gts
         * @param {?} i
         * @return {?}
         */
        function (gts, i) {
            /** @type {?} */
            var label = Object.keys(gts)[0];
            /** @type {?} */
            var c = ColorLib.getColor(gts.id || i, _this._options.scheme);
            /** @type {?} */
            var color = ((data.params || [])[i] || { datasetColor: c }).datasetColor || c;
            /** @type {?} */
            var series = {
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
                        color: color
                    },
                    size: []
                }
            };
            if (GTSLib.isGts(gts)) {
                /** @type {?} */
                var ticks = gts.v.map((/**
                 * @param {?} t
                 * @return {?}
                 */
                function (t) { return t[0]; }));
                /** @type {?} */
                var values = gts.v.map((/**
                 * @param {?} t
                 * @return {?}
                 */
                function (t) { return t[t.length - 1]; }));
                /** @type {?} */
                var sizes = new Array(gts.v.length).fill(10);
                if (_this._options.timeMode === 'timestamp') {
                    series.x = ticks;
                }
                else {
                    if (_this._options.timeZone !== 'UTC') {
                        series.x = ticks.map((/**
                         * @param {?} t
                         * @return {?}
                         */
                        function (t) { return moment__default.utc(t / _this.divider).tz(_this._options.timeZone).toISOString(); }));
                    }
                    else {
                        series.x = ticks.map((/**
                         * @param {?} t
                         * @return {?}
                         */
                        function (t) { return moment__default.utc(t / _this.divider).toISOString(); }));
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
                function (value) {
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
    };
    /**
     * @private
     * @return {?}
     */
    WarpViewBubbleComponent.prototype.buildGraph = /**
     * @private
     * @return {?}
     */
    function () {
        this.LOG.debug(['drawChart', 'this.responsive'], this._responsive);
        this.LOG.debug(['drawChart', 'this.layout'], this.layout);
        this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig);
        this.layout.showlegend = this.showLegend;
        this.layout.yaxis.color = this.getGridColor(this.el.nativeElement);
        this.layout.xaxis.color = this.getGridColor(this.el.nativeElement);
        this.loading = false;
    };
    WarpViewBubbleComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-bubble',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\" #chartContainer (mouseleave)=\"hideTooltip()\">\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display or wrong data format.</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-plotly #graph *ngIf=\"plotlyData?.length > 0\"\n                 [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot()\"\n                 className=\"chart\" (hover)=\"hover($event)\" (unhover)=\"unhover($event)\"\n                 [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                 [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n  <div #toolTip class=\"tooltip\" [ngStyle]=\"getTooltipPosition()\"></div>\n</div>\n",
                    encapsulation: ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}.tooltip{background-color:var(--warp-view-chart-legend-bg)!important;color:var(--warp-view-chart-legend-color)!important;text-align:left;position:absolute;display:none;padding:10px;border:1px solid grey;border-radius:5px;box-shadow:none;pointer-events:none;font-size:10px;min-width:100px;width:auto;max-width:50%;z-index:999;height:auto!important;left:-1000px}.tooltip .chip{border-radius:50%;background-color:#bbb;display:inline-block;width:5px;height:5px;border:2px solid #454545;margin-top:auto;margin-bottom:auto;vertical-align:middle;cursor:pointer}:host{display:block;height:100%}:host #chartContainer{height:100%}:host #chartContainer div{height:100%}:host div.chart{width:var(--warp-view-chart-width);height:var(--warp-view-chart-height)}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewBubbleComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: SizeService },
        { type: NgZone }
    ]; };
    return WarpViewBubbleComponent;
}(WarpViewComponent));
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
var WarpViewDatagridComponent = /** @class */ (function (_super) {
    __extends(WarpViewDatagridComponent, _super);
    function WarpViewDatagridComponent(el, renderer, sizeService, ngZone) {
        var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
        _this.el = el;
        _this.renderer = renderer;
        _this.sizeService = sizeService;
        _this.ngZone = ngZone;
        _this.elemsCount = 15;
        // tslint:disable-next-line:variable-name
        _this._tabularData = [];
        _this.LOG = new Logger(WarpViewDatagridComponent, _this._debug);
        return _this;
    }
    /**
     * @return {?}
     */
    WarpViewDatagridComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.drawChart();
    };
    /**
     * @param {?} options
     * @return {?}
     */
    WarpViewDatagridComponent.prototype.update = /**
     * @param {?} options
     * @return {?}
     */
    function (options) {
        this.drawChart();
    };
    /**
     * @private
     * @return {?}
     */
    WarpViewDatagridComponent.prototype.drawChart = /**
     * @private
     * @return {?}
     */
    function () {
        this.loading = false;
        this.chartDraw.emit();
        if (!this.initChart(this.el)) {
            return;
        }
    };
    /**
     * @private
     * @param {?} i
     * @param {?} j
     * @param {?} key
     * @param {?} def
     * @return {?}
     */
    WarpViewDatagridComponent.prototype.getHeaderParam = /**
     * @private
     * @param {?} i
     * @param {?} j
     * @param {?} key
     * @param {?} def
     * @return {?}
     */
    function (i, j, key, def) {
        return this._data.params && this._data.params[i] && this._data.params[i][key] && this._data.params[i][key][j]
            ? this._data.params[i][key][j]
            : this._data.globalParams && this._data.globalParams[key] && this._data.globalParams[key][j]
                ? this._data.globalParams[key][j]
                : def;
    };
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    WarpViewDatagridComponent.prototype.convert = /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    function (data) {
        if (GTSLib.isArray(data.data)) {
            /** @type {?} */
            var dataList = GTSLib.flatDeep((/** @type {?} */ (this._data.data)));
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
    };
    /**
     * @private
     * @param {?} data
     * @return {?}
     */
    WarpViewDatagridComponent.prototype.parseCustomData = /**
     * @private
     * @param {?} data
     * @return {?}
     */
    function (data) {
        /** @type {?} */
        var flatData = [];
        data.forEach((/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            /** @type {?} */
            var dataSet = {
                name: d.title || '',
                values: d.rows,
                headers: d.columns,
            };
            flatData.push(dataSet);
        }));
        this.LOG.debug(['parseCustomData', 'flatData'], flatData);
        return flatData;
    };
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    WarpViewDatagridComponent.prototype.parseData = /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    function (data) {
        var _this = this;
        /** @type {?} */
        var flatData = [];
        this.LOG.debug(['parseData'], data);
        data.forEach((/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        function (d, i) {
            /** @type {?} */
            var dataSet = {
                name: '',
                values: [],
                headers: []
            };
            if (GTSLib.isGts(d)) {
                _this.LOG.debug(['parseData', 'isGts'], d);
                dataSet.name = GTSLib.serializeGtsMetadata(d);
                dataSet.values = d.v.map((/**
                 * @param {?} v
                 * @return {?}
                 */
                function (v) { return [_this.formatDate(v[0])].concat(v.slice(1, v.length)); }));
            }
            else {
                _this.LOG.debug(['parseData', 'is not a Gts'], d);
                dataSet.values = GTSLib.isArray(d) ? d : [d];
            }
            dataSet.headers = [_this.getHeaderParam(i, 0, 'headers', 'Date')];
            if (d.v && d.v.length > 0 && d.v[0].length > 2) {
                dataSet.headers.push(_this.getHeaderParam(i, 1, 'headers', 'Latitude'));
            }
            if (d.v && d.v.length > 0 && d.v[0].length > 3) {
                dataSet.headers.push(_this.getHeaderParam(i, 2, 'headers', 'Longitude'));
            }
            if (d.v && d.v.length > 0 && d.v[0].length > 4) {
                dataSet.headers.push(_this.getHeaderParam(i, 3, 'headers', 'Elevation'));
            }
            if (d.v && d.v.length > 0) {
                dataSet.headers.push(_this.getHeaderParam(i, d.v[0].length - 1, 'headers', 'Value'));
            }
            if (dataSet.values.length > 0) {
                flatData.push(dataSet);
            }
        }));
        this.LOG.debug(['parseData', 'flatData'], flatData, this._options.timeMode);
        return flatData;
    };
    /**
     * @param {?} date
     * @return {?}
     */
    WarpViewDatagridComponent.prototype.formatDate = /**
     * @param {?} date
     * @return {?}
     */
    function (date) {
        return this._options.timeMode === 'date' ? moment__default.tz(date / this.divider, this._options.timeZone).toISOString() : date.toString();
    };
    WarpViewDatagridComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-datagrid',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"wrapper\" style=\"overflow: auto; height: 100%\">\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-paginable\n      *ngFor=\"let data of _tabularData\"\n      [data]=\"data\" [options]=\"_options\"\n      [debug]=\"debug\"></warpview-paginable>\n  </div>\n</div>\n",
                    encapsulation: ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewDatagridComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: SizeService },
        { type: NgZone }
    ]; };
    WarpViewDatagridComponent.propDecorators = {
        elemsCount: [{ type: Input, args: ['elemsCount',] }]
    };
    return WarpViewDatagridComponent;
}(WarpViewComponent));
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
var WarpViewPaginableComponent = /** @class */ (function () {
    function WarpViewPaginableComponent() {
        this.elemsCount = 15;
        this.windowed = 5;
        this.page = 0;
        this.pages = [];
        this.displayedValues = [];
        // tslint:disable-next-line:variable-name
        this._debug = false;
        // tslint:disable-next-line:variable-name
        this._options = __assign({}, new Param(), {
            timeMode: 'date',
            timeZone: 'UTC',
            timeUnit: 'us',
            bounds: {}
        });
        this.LOG = new Logger(WarpViewPaginableComponent, this.debug);
    }
    Object.defineProperty(WarpViewPaginableComponent.prototype, "debug", {
        get: /**
         * @return {?}
         */
        function () {
            return this._debug;
        },
        set: /**
         * @param {?} debug
         * @return {?}
         */
        function (debug) {
            this._debug = debug;
            this.LOG.setDebug(debug);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarpViewPaginableComponent.prototype, "options", {
        set: /**
         * @param {?} options
         * @return {?}
         */
        function (options) {
            if (!deepEqual(options, this._options)) {
                this.drawGridData();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarpViewPaginableComponent.prototype, "data", {
        set: /**
         * @param {?} data
         * @return {?}
         */
        function (data) {
            if (data) {
                this._data = data;
                this.drawGridData();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} page
     * @return {?}
     */
    WarpViewPaginableComponent.prototype.goto = /**
     * @param {?} page
     * @return {?}
     */
    function (page) {
        this.page = page;
        this.drawGridData();
    };
    /**
     * @return {?}
     */
    WarpViewPaginableComponent.prototype.next = /**
     * @return {?}
     */
    function () {
        this.page = Math.min(this.page + 1, this._data.values.length - 1);
        this.drawGridData();
    };
    /**
     * @return {?}
     */
    WarpViewPaginableComponent.prototype.prev = /**
     * @return {?}
     */
    function () {
        this.page = Math.max(this.page - 1, 0);
        this.drawGridData();
    };
    /**
     * @private
     * @return {?}
     */
    WarpViewPaginableComponent.prototype.drawGridData = /**
     * @private
     * @return {?}
     */
    function () {
        this._options = (/** @type {?} */ (ChartLib.mergeDeep(this._options, this.options)));
        this.LOG.debug(['drawGridData', '_options'], this._options);
        if (!this._data) {
            return;
        }
        this.pages = [];
        for (var i = 0; i < (this._data.values || []).length / this.elemsCount; i++) {
            this.pages.push(i);
        }
        this.displayedValues = (this._data.values || []).slice(Math.max(0, this.elemsCount * this.page), Math.min(this.elemsCount * (this.page + 1), (this._data.values || []).length));
        this.LOG.debug(['drawGridData', '_data'], this._data);
    };
    /**
     * @param {?} str
     * @return {?}
     */
    WarpViewPaginableComponent.prototype.decodeURIComponent = /**
     * @param {?} str
     * @return {?}
     */
    function (str) {
        return decodeURIComponent(str);
    };
    /**
     * @return {?}
     */
    WarpViewPaginableComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.drawGridData();
    };
    /**
     * @param {?} name
     * @return {?}
     */
    WarpViewPaginableComponent.prototype.formatLabel = /**
     * @param {?} name
     * @return {?}
     */
    function (name) {
        return GTSLib.formatLabel(name);
    };
    WarpViewPaginableComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-paginable',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div>\n  <div class=\"heading\" [innerHTML]=\"formatLabel(_data.name)\"></div>\n  <table>\n    <thead>\n    <th *ngFor=\"let h of _data.headers\">{{h}}</th>\n    </thead>\n    <tbody>\n    <tr *ngFor=\"let value of displayedValues; even as isEven; odd as isOdd\" [ngClass]=\"{ odd: isOdd, even: isEven}\">\n      <td *ngFor=\"let v of value\">\n        <span [innerHTML]=\"v\"></span>\n      </td>\n    </tr>\n    </tbody>\n  </table>\n  <div class=\"center\">\n    <div class=\"pagination\">\n      <div class=\"prev hoverable\" (click)=\"prev()\" *ngIf=\"page !== 0\">&lt;</div>\n      <div class=\"index disabled\" *ngIf=\"page - windowed > 0\">...</div>\n      <span *ngFor=\"let c of pages\">\n        <span *ngIf=\" c >= page - windowed && c <= page + windowed\"\n             [ngClass]=\"{ index: true, hoverable: page !== c, active: page === c}\" (click)=\"goto(c)\">{{c}}</span>\n      </span>\n      <div class=\"index disabled\" *ngIf=\"page + windowed < pages.length\">...</div>\n      <div class=\"next hoverable\" (click)=\"next()\" *ngIf=\"page + windowed < (_data.values ||\u00A0[]).length - 1\">&gt;</div>\n    </div>\n  </div>\n</div>\n",
                    encapsulation: ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host table{width:100%;color:var(--warp-view-font-color)}:host table td,:host table th{padding:var(--warp-view-datagrid-cell-padding)}:host table .odd{background-color:var(--warp-view-datagrid-odd-bg-color);color:var(--warp-view-datagrid-odd-color)}:host table .even{background-color:var(--warp-view-datagrid-even-bg-color);color:var(--warp-view-datagrid-even-color)}:host .center{text-align:center}:host .center .pagination{display:inline-block}:host .center .pagination .index,:host .center .pagination .next,:host .center .pagination .prev{color:var(--warp-view-font-color);float:left;padding:8px 16px;text-decoration:none;-webkit-transition:background-color .3s;transition:background-color .3s;border:1px solid var(--warp-view-pagination-border-color);margin:0;cursor:pointer;background-color:var(--warp-view-pagination-bg-color)}:host .center .pagination .index.active,:host .center .pagination .next.active,:host .center .pagination .prev.active{background-color:var(--warp-view-pagination-active-bg-color);color:var(--warp-view-pagination-active-color);border:1px solid var(--warp-view-pagination-active-border-color)}:host .center .pagination .index.hoverable:hover,:host .center .pagination .next.hoverable:hover,:host .center .pagination .prev.hoverable:hover{background-color:var(--warp-view-pagination-hover-bg-color);color:var(--warp-view-pagination-hover-color);border:1px solid var(--warp-view-pagination-hover-border-color)}:host .center .pagination .index.disabled,:host .center .pagination .next.disabled,:host .center .pagination .prev.disabled{cursor:auto;color:var(--warp-view-pagination-disabled-color)}:host .gts-classname{color:var(--gts-classname-font-color,#0074d9)}:host .gts-labelname{color:var(--gts-labelname-font-color,#19a979)}:host .gts-attrname{color:var(--gts-labelname-font-color,#ed4a7b)}:host .gts-separator{color:var(--gts-separator-font-color,#bbb)}:host .gts-labelvalue{color:var(--gts-labelvalue-font-color,#aaa);font-style:italic}:host .gts-attrvalue{color:var(--gts-labelvalue-font-color,#aaa);font-style:italic}:host .round{border-radius:50%;background-color:#bbb;display:inline-block;width:12px;height:12px;border:2px solid #454545}:host ul{list-style:none}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewPaginableComponent.ctorParameters = function () { return []; };
    WarpViewPaginableComponent.propDecorators = {
        debug: [{ type: Input, args: ['debug',] }],
        options: [{ type: Input, args: ['options',] }],
        data: [{ type: Input, args: ['data',] }],
        elemsCount: [{ type: Input, args: ['elemsCount',] }],
        windowed: [{ type: Input, args: ['windowed',] }]
    };
    return WarpViewPaginableComponent;
}());
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
var WarpViewDisplayComponent = /** @class */ (function (_super) {
    __extends(WarpViewDisplayComponent, _super);
    function WarpViewDisplayComponent(el, renderer, sizeService, ngZone) {
        var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
        _this.el = el;
        _this.renderer = renderer;
        _this.sizeService = sizeService;
        _this.ngZone = ngZone;
        _this.toDisplay = '';
        _this.defOptions = (/** @type {?} */ ({
            timeMode: 'custom'
        }));
        _this.LOG = new Logger(WarpViewDisplayComponent, _this._debug);
        return _this;
    }
    /**
     * @return {?}
     */
    WarpViewDisplayComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.drawChart();
    };
    /**
     * @return {?}
     */
    WarpViewDisplayComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        if (this.timer) {
            clearInterval(this.timer);
        }
    };
    /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    WarpViewDisplayComponent.prototype.update = /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    function (options, refresh) {
        this.drawChart();
        this.flexFont();
    };
    /**
     * @private
     * @return {?}
     */
    WarpViewDisplayComponent.prototype.drawChart = /**
     * @private
     * @return {?}
     */
    function () {
        this.LOG.debug(['drawChart'], this._options, this.defOptions);
        this.initChart(this.el);
        this._options = ChartLib.mergeDeep(this.defOptions, this._options);
        this.LOG.debug(['drawChart', 'afterInit'], this._options, this.defOptions, this.height);
        this.LOG.debug(['drawChart'], this._data, this.toDisplay);
        this.flexFont();
        this.chartDraw.emit();
    };
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    WarpViewDisplayComponent.prototype.convert = /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    function (data) {
        this._options = ChartLib.mergeDeep(this.defOptions, this._options);
        this.LOG.debug(['convert'], this._options.timeMode);
        /** @type {?} */
        var display;
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
                var start = moment__default.tz(parseInt(display, 10) / this.divider, this._options.timeZone);
                this.displayDuration(start);
                break;
            case 'custom':
            case 'timestamp':
                this.toDisplay = display;
        }
        return [];
    };
    /**
     * @return {?}
     */
    WarpViewDisplayComponent.prototype.getStyle = /**
     * @return {?}
     */
    function () {
        if (!this._options) {
            return {};
        }
        else {
            /** @type {?} */
            var style = { 'background-color': this._options.bgColor || 'transparent' };
            if (this._options.fontColor) {
                style.color = this._options.fontColor;
            }
            return style;
        }
    };
    /**
     * @return {?}
     */
    WarpViewDisplayComponent.prototype.flexFont = /**
     * @return {?}
     */
    function () {
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
    };
    /**
     * @private
     * @param {?} start
     * @return {?}
     */
    WarpViewDisplayComponent.prototype.displayDuration = /**
     * @private
     * @param {?} start
     * @return {?}
     */
    function (start) {
        var _this = this;
        this.timer = setInterval((/**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var now = moment__default();
            _this.toDisplay = moment__default.duration(start.diff(now)).humanize(true);
        }), 1000);
    };
    WarpViewDisplayComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-display',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"chart-container\" (resized)=\"flexFont()\" [ngStyle]=\"getStyle()\">\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <div class=\"value\" #wrapper [hidden]=\"loading\">\n    <span [innerHTML]=\"toDisplay\"></span><small>{{unit}}</small>\n  </div>\n</div>\n",
                    encapsulation: ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host{width:var(--warp-view-chart-width,100%);height:var(--warp-view-chart-height,100%);color:var(--warp-view-font-color);position:relative;overflow:hidden}:host .chart-container{text-align:center;height:calc(100% - 20px);width:100%;justify-items:stretch;min-height:100%;-webkit-box-pack:center;justify-content:center;display:-webkit-box;display:flex;overflow:hidden}:host .chart-container .value{padding:10px;text-align:center;white-space:nowrap;overflow:hidden;display:inline-block;vertical-align:middle;-ms-grid-row-align:center;align-self:center}:host .chart-container .value span{min-height:100%}:host .chart-container .value small{font-size:.5em}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewDisplayComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: SizeService },
        { type: NgZone }
    ]; };
    WarpViewDisplayComponent.propDecorators = {
        wrapper: [{ type: ViewChild, args: ['wrapper', { static: true },] }]
    };
    return WarpViewDisplayComponent;
}(WarpViewComponent));
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
var WarpViewDrillDownComponent = /** @class */ (function (_super) {
    __extends(WarpViewDrillDownComponent, _super);
    function WarpViewDrillDownComponent(el, renderer, sizeService, ngZone) {
        var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
        _this.el = el;
        _this.renderer = renderer;
        _this.sizeService = sizeService;
        _this.ngZone = ngZone;
        _this.parentWidth = -1;
        _this.LOG = new Logger(WarpViewDrillDownComponent, _this._debug);
        return _this;
    }
    /**
     * @return {?}
     */
    WarpViewDrillDownComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        this.drawChart();
    };
    /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    WarpViewDrillDownComponent.prototype.update = /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    function (options, refresh) {
        this.drawChart();
    };
    /**
     * @return {?}
     */
    WarpViewDrillDownComponent.prototype.onResize = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (this.el.nativeElement.parentElement.clientWidth !== this.parentWidth || this.parentWidth <= 0) {
            this.parentWidth = this.el.nativeElement.parentElement.clientWidth;
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout((/**
             * @return {?}
             */
            function () {
                if (_this.el.nativeElement.parentElement.clientWidth > 0) {
                    _this.LOG.debug(['onResize'], _this.el.nativeElement.parentElement.clientWidth);
                    _this.drawChart();
                }
                else {
                    _this.onResize();
                }
            }), 150);
        }
    };
    /**
     * @private
     * @return {?}
     */
    WarpViewDrillDownComponent.prototype.drawChart = /**
     * @private
     * @return {?}
     */
    function () {
        this.loading = false;
        this.chartDraw.emit();
        if (!this.initChart(this.el)) {
            return;
        }
    };
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    WarpViewDrillDownComponent.prototype.convert = /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    function (data) {
        /** @type {?} */
        var dataList = (/** @type {?} */ (this._data.data));
        this.heatMapData = this.parseData(GTSLib.flatDeep(dataList));
        return [];
    };
    /**
     * @private
     * @param {?} dataList
     * @return {?}
     */
    WarpViewDrillDownComponent.prototype.parseData = /**
     * @private
     * @param {?} dataList
     * @return {?}
     */
    function (dataList) {
        var _this = this;
        /** @type {?} */
        var details = [];
        /** @type {?} */
        var values = [];
        /** @type {?} */
        var dates = [];
        /** @type {?} */
        var data = {};
        /** @type {?} */
        var reducer = (/**
         * @param {?} accumulator
         * @param {?} currentValue
         * @return {?}
         */
        function (accumulator, currentValue) { return accumulator + parseInt(currentValue, 10); });
        this.LOG.debug(['parseData'], dataList);
        dataList.forEach((/**
         * @param {?} gts
         * @param {?} i
         * @return {?}
         */
        function (gts, i) {
            /** @type {?} */
            var name = GTSLib.serializeGtsMetadata(gts);
            gts.v.forEach((/**
             * @param {?} v
             * @return {?}
             */
            function (v) {
                /** @type {?} */
                var refDate = moment.utc(v[0] / 1000).startOf('day').toISOString();
                if (!data[refDate]) {
                    data[refDate] = [];
                }
                if (!values[refDate]) {
                    values[refDate] = [];
                }
                dates.push(v[0] / 1000);
                values[refDate].push(v[v.length - 1]);
                data[refDate].push({
                    name: name,
                    date: v[0] / 1000,
                    value: v[v.length - 1],
                    color: ColorLib.getColor(i, _this._options.scheme),
                    id: i
                });
            }));
        }));
        Object.keys(data).forEach((/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            details.push({
                date: moment.utc(d),
                total: values[d].reduce(reducer),
                details: data[d],
                summary: []
            });
        }));
        return details;
    };
    WarpViewDrillDownComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-drill-down',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"wrapper\">\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div *ngIf=\"!loading && !noData\">\n    <calendar-heatmap [data]=\"heatMapData\" overview=\"global\"\n                      [debug]=\"debug\"\n                      [minColor]=\"_options.minColor\"\n                      [maxColor]=\"_options.maxColor\"></calendar-heatmap>\n  </div>\n</div>\n",
                    encapsulation: ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host .wrapper{position:relative;width:100%;height:100%}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewDrillDownComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: SizeService },
        { type: NgZone }
    ]; };
    WarpViewDrillDownComponent.propDecorators = {
        onResize: [{ type: HostListener, args: ['window:resize',] }]
    };
    return WarpViewDrillDownComponent;
}(WarpViewComponent));
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
var /**
 *
 */
Datum = /** @class */ (function () {
    function Datum() {
    }
    return Datum;
}());
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
var /**
 *
 */
Summary = /** @class */ (function () {
    function Summary() {
    }
    return Summary;
}());
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
var /**
 *
 */
Detail = /** @class */ (function () {
    function Detail() {
    }
    return Detail;
}());
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
var CalendarHeatmapComponent = /** @class */ (function () {
    function CalendarHeatmapComponent(el) {
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
        function (d) {
            /** @type {?} */
            var tooltipHtml = '<div class="header"><strong>' + d.date.format('dddd, MMM Do YYYY HH:mm') + '</strong></div><ul>';
            (d.summary || []).forEach((/**
             * @param {?} s
             * @return {?}
             */
            function (s) {
                tooltipHtml += "<li>\n  <div class=\"round\" style=\"background-color:" + ColorLib.transparentize(s.color) + "; border-color:" + s.color + "\"></div>\n" + GTSLib.formatLabel(s.name) + ": " + s.total + "</li>";
            }));
            if (d.total !== undefined && d.name) {
                tooltipHtml += "<li><div class=\"round\"\nstyle=\"background-color: " + ColorLib.transparentize(d.color) + "; border-color: " + d.color + "\"\n></div> " + GTSLib.formatLabel(d.name) + ": " + d.total + "</li>";
            }
            tooltipHtml += '</ul>';
            return tooltipHtml;
        });
        this.LOG = new Logger(CalendarHeatmapComponent, this.debug);
    }
    Object.defineProperty(CalendarHeatmapComponent.prototype, "debug", {
        get: /**
         * @return {?}
         */
        function () {
            return this._debug;
        },
        set: /**
         * @param {?} debug
         * @return {?}
         */
        function (debug) {
            this._debug = debug;
            this.LOG.setDebug(debug);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CalendarHeatmapComponent.prototype, "data", {
        get: /**
         * @return {?}
         */
        function () {
            return this._data;
        },
        set: /**
         * @param {?} data
         * @return {?}
         */
        function (data) {
            this.LOG.debug(['data'], data);
            if (data) {
                this._data = data;
                this.calculateDimensions();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CalendarHeatmapComponent.prototype, "minColor", {
        get: /**
         * @return {?}
         */
        function () {
            return this._minColor;
        },
        set: /**
         * @param {?} minColor
         * @return {?}
         */
        function (minColor) {
            this._minColor = minColor;
            this.calculateDimensions();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CalendarHeatmapComponent.prototype, "maxColor", {
        get: /**
         * @return {?}
         */
        function () {
            return this._maxColor;
        },
        set: /**
         * @param {?} maxColor
         * @return {?}
         */
        function (maxColor) {
            this._maxColor = maxColor;
            this.calculateDimensions();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    CalendarHeatmapComponent.getNumberOfWeeks = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var dayIndex = Math.round((+moment.utc() - +moment.utc().subtract(1, 'year').startOf('week')) / 86400000);
        return Math.trunc(dayIndex / 7) + 1;
    };
    /**
     * @return {?}
     */
    CalendarHeatmapComponent.prototype.onResize = /**
     * @return {?}
     */
    function () {
        if (this.el.nativeElement.parentElement.clientWidth !== this.parentWidth) {
            this.calculateDimensions();
        }
    };
    /**
     * @return {?}
     */
    CalendarHeatmapComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
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
    };
    /**
     * @return {?}
     */
    CalendarHeatmapComponent.prototype.calculateDimensions = /**
     * @return {?}
     */
    function () {
        var _this = this;
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout((/**
         * @return {?}
         */
        function () {
            if (_this.el.nativeElement.parentElement.clientWidth !== 0) {
                _this.gWidth = _this.chart.clientWidth < 1000 ? 1000 : _this.chart.clientWidth;
                _this.itemSize = ((_this.gWidth - _this.labelPadding) / CalendarHeatmapComponent.getNumberOfWeeks() - _this.gutter);
                _this.gHeight = _this.labelPadding + 7 * (_this.itemSize + _this.gutter);
                _this.svg.attr('width', _this.gWidth).attr('height', _this.gHeight);
                _this.LOG.debug(['calculateDimensions'], _this._data);
                if (!!_this._data && !!_this._data[0] && !!_this._data[0].summary) {
                    _this.drawChart();
                }
            }
            else {
                _this.calculateDimensions();
            }
        }), 250);
    };
    /**
     * @private
     * @param {?} xs
     * @param {?} key
     * @return {?}
     */
    CalendarHeatmapComponent.prototype.groupBy = /**
     * @private
     * @param {?} xs
     * @param {?} key
     * @return {?}
     */
    function (xs, key) {
        return xs.reduce((/**
         * @param {?} rv
         * @param {?} x
         * @return {?}
         */
        function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }), {});
    };
    /**
     * @return {?}
     */
    CalendarHeatmapComponent.prototype.updateDataSummary = /**
     * @return {?}
     */
    function () {
        // Get daily summary if that was not provided
        if (!this._data[0].summary) {
            this._data.map((/**
             * @param {?} d
             * @return {?}
             */
            function (d) {
                /** @type {?} */
                var summary = d.details.reduce((/**
                 * @param {?} uniques
                 * @param {?} project
                 * @return {?}
                 */
                function (uniques, project) {
                    if (!uniques[project.name]) {
                        uniques[project.name] = { value: project.value };
                    }
                    else {
                        uniques[project.name].value += project.value;
                    }
                    return uniques;
                }), {});
                /** @type {?} */
                var unsortedSummary = Object.keys(summary).map((/**
                 * @param {?} key
                 * @return {?}
                 */
                function (key) {
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
                function (a, b) {
                    return b.total - a.total;
                }));
                return d;
            }));
        }
    };
    /**
     * @return {?}
     */
    CalendarHeatmapComponent.prototype.drawChart = /**
     * @return {?}
     */
    function () {
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
    };
    /**
     * @return {?}
     */
    CalendarHeatmapComponent.prototype.drawGlobalOverview = /**
     * @return {?}
     */
    function () {
        var _this = this;
        // Add current overview to the history
        if (this.history[this.history.length - 1] !== this.overview) {
            this.history.push(this.overview);
        }
        // Define start and end of the dataset
        /** @type {?} */
        var startPeriod = moment.utc(this._data[0].date.startOf('y'));
        /** @type {?} */
        var endPeriod = moment.utc(this._data[this._data.length - 1].date.endOf('y'));
        // Define array of years and total values
        /** @type {?} */
        var yData = this._data.filter((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d.date.isBetween(startPeriod, endPeriod, null, '[]'); }));
        yData.forEach((/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            /** @type {?} */
            var summary = [];
            /** @type {?} */
            var group = _this.groupBy(d.details, 'name');
            Object.keys(group).forEach((/**
             * @param {?} k
             * @return {?}
             */
            function (k) {
                summary.push({
                    name: k,
                    total: group[k].reduce((/**
                     * @param {?} acc
                     * @param {?} o
                     * @return {?}
                     */
                    function (acc, o) {
                        return acc + o.value;
                    }), 0),
                    color: group[k][0].color,
                    id: group[k][0].id,
                });
            }));
            d.summary = summary;
        }));
        /** @type {?} */
        var duration = Math.ceil(moment.duration(endPeriod.diff(startPeriod)).asYears());
        /** @type {?} */
        var scale = [];
        for (var i = 0; i < duration; i++) {
            /** @type {?} */
            var d = moment.utc().year(startPeriod.year() + i).month(0).date(1).startOf('y');
            scale.push(d);
        }
        /** @type {?} */
        var yearData = yData.map((/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            /** @type {?} */
            var date = d.date;
            return {
                date: date,
                total: yData.reduce((/**
                 * @param {?} prev
                 * @param {?} current
                 * @return {?}
                 */
                function (prev, current) {
                    if (((/** @type {?} */ (current.date))).year() === date.year()) {
                        prev += current.total;
                    }
                    return prev;
                }), 0),
                summary: ((/**
                 * @return {?}
                 */
                function () {
                    /** @type {?} */
                    var summary = yData.reduce((/**
                     * @param {?} s
                     * @param {?} data
                     * @return {?}
                     */
                    function (s, data) {
                        if (((/** @type {?} */ (data.date))).year() === date.year()) {
                            data.summary.forEach((/**
                             * @param {?} _summary
                             * @return {?}
                             */
                            function (_summary) {
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
                    var unsortedSummary = Object.keys(summary).map((/**
                     * @param {?} key
                     * @return {?}
                     */
                    function (key) {
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
                    function (a, b) { return b.total - a.total; }));
                }))(),
            };
        }));
        // Calculate max value of all the years in the dataset
        yearData = GTSLib.cleanArray(yearData);
        /** @type {?} */
        var maxValue = max(yearData, (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d.total; }));
        // Define year labels and axis
        /** @type {?} */
        var yearLabels = scale.map((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d; }));
        /** @type {?} */
        var yearScale = scaleBand()
            .rangeRound([0, this.gWidth])
            .padding(0.05)
            .domain(yearLabels.map((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d.year().toString(); })));
        /** @type {?} */
        var color = scaleLinear()
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
        function () { return (_this.gWidth - _this.labelPadding) / yearLabels.length - _this.gutter * 5; }))
            .attr('height', (/**
         * @return {?}
         */
        function () { return _this.gHeight - _this.labelPadding; }))
            .attr('transform', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return 'translate(' + yearScale(((/** @type {?} */ (d.date))).year().toString()) + ',' + _this.tooltipPadding * 2 + ')'; }))
            .attr('fill', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return color(d.total) || CalendarHeatmapComponent.DEF_MAX_COLOR; }))
            .on('click', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            if (_this.inTransition) {
                return;
            }
            // Set in_transition flag
            _this.inTransition = true;
            // Set selected date to the one clicked on
            _this.selected = d;
            // Hide tooltip
            _this.hideTooltip();
            // Remove all global overview related items and labels
            _this.removeGlobalOverview();
            // Redraw the chart
            _this.overview = 'year';
            _this.drawChart();
        }))
            .style('opacity', 0)
            .on('mouseover', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            if (_this.inTransition) {
                return;
            }
            // Calculate tooltip position
            /** @type {?} */
            var x = yearScale(d.date.year().toString()) + _this.tooltipPadding * 2;
            while (_this.gWidth - x < (_this.tooltipWidth + _this.tooltipPadding * 5)) {
                x -= 10;
            }
            /** @type {?} */
            var y = _this.tooltipPadding * 4;
            // Show tooltip
            _this.tooltip.html(_this.getTooltip(d))
                .style('left', x + 'px')
                .style('top', y + 'px')
                .transition()
                .duration(_this.transitionDuration / 2)
                .ease(easeLinear)
                .style('opacity', 1);
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        function () {
            if (_this.inTransition) {
                return;
            }
            _this.hideTooltip();
        }))
            .transition()
            .delay((/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        function (d, i) { return _this.transitionDuration * (i + 1) / 10; }))
            .duration((/**
         * @return {?}
         */
        function () { return _this.transitionDuration; }))
            .ease(easeLinear)
            .style('opacity', 1)
            .call((/**
         * @param {?} transition
         * @param {?} callback
         * @return {?}
         */
        function (transition, callback) {
            if (transition.empty()) {
                callback();
            }
            /** @type {?} */
            var n = 0;
            transition.each((/**
             * @return {?}
             */
            function () { return ++n; })).on('end', (/**
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
        function () { return _this.inTransition = false; }));
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
        function () { return Math.floor(_this.labelPadding / 3) + 'px'; }))
            .text((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d.year(); }))
            .attr('x', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return yearScale(d.year().toString()); }))
            .attr('y', this.labelPadding / 2)
            .on('mouseenter', (/**
         * @param {?} yearLabel
         * @return {?}
         */
        function (yearLabel) {
            if (_this.inTransition) {
                return;
            }
            _this.items.selectAll('.item-block-year')
                .transition()
                .duration(_this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) { return (d.date.year() === yearLabel.year()) ? 1 : 0.1; }));
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        function () {
            if (_this.inTransition) {
                return;
            }
            _this.items.selectAll('.item-block-year')
                .transition()
                .duration(_this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', 1);
        }))
            .on('click', (/**
         * @return {?}
         */
        function () {
            if (_this.inTransition) {
                return;
            }
            // Set in_transition flag
            _this.inTransition = true;
            // Set selected year to the one clicked on
            _this.selected = yearData[0];
            // Hide tooltip
            _this.hideTooltip();
            // Remove all global overview related items and labels
            _this.removeGlobalOverview();
            // Redraw the chart
            _this.overview = 'year';
            _this.drawChart();
        }));
    };
    /**
     * Draw year overview
     */
    /**
     * Draw year overview
     * @return {?}
     */
    CalendarHeatmapComponent.prototype.drawYearOverview = /**
     * Draw year overview
     * @return {?}
     */
    function () {
        var _this = this;
        // Add current overview to the history
        if (this.history[this.history.length - 1] !== this.overview) {
            this.history.push(this.overview);
        }
        // Define start and end date of the selected year
        /** @type {?} */
        var startOfYear = moment(this.selected.date).startOf('year');
        /** @type {?} */
        var endOfYear = moment(this.selected.date).endOf('year');
        // Filter data down to the selected year
        /** @type {?} */
        var yearData = this._data.filter((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d.date.isBetween(startOfYear, endOfYear, null, '[]'); }));
        yearData.forEach((/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            /** @type {?} */
            var summary = [];
            /** @type {?} */
            var group = _this.groupBy(d.details, 'name');
            Object.keys(group).forEach((/**
             * @param {?} k
             * @return {?}
             */
            function (k) {
                summary.push({
                    name: k,
                    total: group[k].reduce((/**
                     * @param {?} acc
                     * @param {?} o
                     * @return {?}
                     */
                    function (acc, o) {
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
        var maxValue = max(yearData, (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d.total; }));
        /** @type {?} */
        var color = scaleLinear()
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
        function (d) { return _this.calcItemX(d, startOfYear) + (_this.itemSize - _this.calcItemSize(d, maxValue)) / 2; }))
            .attr('y', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return _this.calcItemY(d) + (_this.itemSize - _this.calcItemSize(d, maxValue)) / 2; }))
            .attr('rx', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return _this.calcItemSize(d, maxValue); }))
            .attr('ry', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return _this.calcItemSize(d, maxValue); }))
            .attr('width', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return _this.calcItemSize(d, maxValue); }))
            .attr('height', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return _this.calcItemSize(d, maxValue); }))
            .attr('fill', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return (d.total > 0) ? color(d.total) : 'transparent'; }))
            .on('click', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            if (_this.inTransition) {
                return;
            }
            // Don't transition if there is no data to show
            if (d.total === 0) {
                return;
            }
            _this.inTransition = true;
            // Set selected date to the one clicked on
            _this.selected = d;
            // Hide tooltip
            _this.hideTooltip();
            // Remove all year overview related items and labels
            _this.removeYearOverview();
            // Redraw the chart
            _this.overview = 'day';
            _this.drawChart();
        }))
            .on('mouseover', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            if (_this.inTransition) {
                return;
            }
            // Pulsating animation
            /** @type {?} */
            var circle = select(event.currentTarget);
            /** @type {?} */
            var repeat = (/**
             * @return {?}
             */
            function () {
                circle.transition()
                    .duration(_this.transitionDuration)
                    .ease(easeLinear)
                    .attr('x', (/**
                 * @param {?} data
                 * @return {?}
                 */
                function (data) { return _this.calcItemX(data, startOfYear) - (_this.itemSize * 1.1 - _this.itemSize) / 2; }))
                    .attr('y', (/**
                 * @param {?} data
                 * @return {?}
                 */
                function (data) { return _this.calcItemY(data) - (_this.itemSize * 1.1 - _this.itemSize) / 2; }))
                    .attr('width', _this.itemSize * 1.1)
                    .attr('height', _this.itemSize * 1.1)
                    .transition()
                    .duration(_this.transitionDuration)
                    .ease(easeLinear)
                    .attr('x', (/**
                 * @param {?} data
                 * @return {?}
                 */
                function (data) { return _this.calcItemX(data, startOfYear) + (_this.itemSize - _this.calcItemSize(data, maxValue)) / 2; }))
                    .attr('y', (/**
                 * @param {?} data
                 * @return {?}
                 */
                function (data) { return _this.calcItemY(data) + (_this.itemSize - _this.calcItemSize(data, maxValue)) / 2; }))
                    .attr('width', (/**
                 * @param {?} data
                 * @return {?}
                 */
                function (data) { return _this.calcItemSize(data, maxValue); }))
                    .attr('height', (/**
                 * @param {?} data
                 * @return {?}
                 */
                function (data) { return _this.calcItemSize(data, maxValue); }))
                    .on('end', repeat);
            });
            repeat();
            // Construct tooltip
            // Calculate tooltip position
            /** @type {?} */
            var x = _this.calcItemX(d, startOfYear) + _this.itemSize / 2;
            if (_this.gWidth - x < (_this.tooltipWidth + _this.tooltipPadding * 3)) {
                x -= _this.tooltipWidth + _this.tooltipPadding * 2;
            }
            /** @type {?} */
            var y = _this.calcItemY(d) + _this.itemSize / 2;
            // Show tooltip
            _this.tooltip.html(_this.getTooltip(d))
                .style('left', x + 'px')
                .style('top', y + 'px')
                .transition()
                .duration(_this.transitionDuration / 2)
                .ease(easeLinear)
                .style('opacity', 1);
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        function () {
            if (_this.inTransition) {
                return;
            }
            // Set circle radius back to what it's supposed to be
            select(event.currentTarget).transition()
                .duration(_this.transitionDuration / 2)
                .ease(easeLinear)
                .attr('x', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) { return _this.calcItemX(d, startOfYear) + (_this.itemSize - _this.calcItemSize(d, maxValue)) / 2; }))
                .attr('y', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) { return _this.calcItemY(d) + (_this.itemSize - _this.calcItemSize(d, maxValue)) / 2; }))
                .attr('width', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) { return _this.calcItemSize(d, maxValue); }))
                .attr('height', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) { return _this.calcItemSize(d, maxValue); }));
            // Hide tooltip
            _this.hideTooltip();
        }))
            .transition()
            .delay((/**
         * @return {?}
         */
        function () { return (Math.cos(Math.PI * Math.random()) + 1) * _this.transitionDuration; }))
            .duration((/**
         * @return {?}
         */
        function () { return _this.transitionDuration; }))
            .ease(easeLinear)
            .style('opacity', 1)
            .call((/**
         * @param {?} transition
         * @param {?} callback
         * @return {?}
         */
        function (transition, callback) {
            if (transition.empty()) {
                callback();
            }
            /** @type {?} */
            var n = 0;
            transition.each((/**
             * @return {?}
             */
            function () { return ++n; })).on('end', (/**
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
        function () { return _this.inTransition = false; }));
        // Add month labels
        /** @type {?} */
        var duration = Math.ceil(moment.duration(endOfYear.diff(startOfYear)).asMonths());
        /** @type {?} */
        var monthLabels = [];
        for (var i = 1; i < duration; i++) {
            monthLabels.push(moment(this.selected.date).month((startOfYear.month() + i) % 12).startOf('month'));
        }
        /** @type {?} */
        var monthScale = scaleLinear().range([0, this.gWidth]).domain([0, monthLabels.length]);
        this.labels.selectAll('.label-month').remove();
        this.labels.selectAll('.label-month')
            .data(monthLabels)
            .enter()
            .append('text')
            .attr('class', 'label label-month')
            .attr('font-size', (/**
         * @return {?}
         */
        function () { return Math.floor(_this.labelPadding / 3) + 'px'; }))
            .text((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d.format('MMM'); }))
            .attr('x', (/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        function (d, i) { return monthScale(i) + (monthScale(i) - monthScale(i - 1)) / 2; }))
            .attr('y', this.labelPadding / 2)
            .on('mouseenter', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            if (_this.inTransition) {
                return;
            }
            /** @type {?} */
            var selectedMonth = moment(d);
            _this.items.selectAll('.item-circle')
                .transition()
                .duration(_this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', (/**
             * @param {?} data
             * @return {?}
             */
            function (data) { return moment(data.date).isSame(selectedMonth, 'month') ? 1 : 0.1; }));
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        function () {
            if (_this.inTransition) {
                return;
            }
            _this.items.selectAll('.item-circle')
                .transition()
                .duration(_this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', 1);
        }))
            .on('click', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            if (_this.inTransition) {
                return;
            }
            // Check month data
            /** @type {?} */
            var monthData = _this._data.filter((/**
             * @param {?} e
             * @return {?}
             */
            function (e) { return e.date.isBetween(moment(d).startOf('month'), moment(d).endOf('month'), null, '[]'); }));
            // Don't transition if there is no data to show
            if (!monthData.length) {
                return;
            }
            // Set selected month to the one clicked on
            _this.selected = { date: d };
            _this.inTransition = true;
            // Hide tooltip
            _this.hideTooltip();
            // Remove all year overview related items and labels
            _this.removeYearOverview();
            // Redraw the chart
            _this.overview = 'month';
            _this.drawChart();
        }));
        // Add day labels
        /** @type {?} */
        var dayLabels = timeDays(moment.utc().startOf('week').toDate(), moment.utc().endOf('week').toDate());
        /** @type {?} */
        var dayScale = scaleBand()
            .rangeRound([this.labelPadding, this.gHeight])
            .domain(dayLabels.map((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return moment.utc(d).weekday().toString(); })));
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
        function (d, i) { return dayScale(i.toString()) + dayScale.bandwidth() / 1.75; }))
            .style('text-anchor', 'left')
            .attr('font-size', (/**
         * @return {?}
         */
        function () { return Math.floor(_this.labelPadding / 3) + 'px'; }))
            .text((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return moment.utc(d).format('dddd')[0]; }))
            .on('mouseenter', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            if (_this.inTransition) {
                return;
            }
            /** @type {?} */
            var selectedDay = moment.utc(d);
            _this.items.selectAll('.item-circle')
                .transition()
                .duration(_this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', (/**
             * @param {?} data
             * @return {?}
             */
            function (data) { return (moment(data.date).day() === selectedDay.day()) ? 1 : 0.1; }));
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        function () {
            if (_this.inTransition) {
                return;
            }
            _this.items.selectAll('.item-circle')
                .transition()
                .duration(_this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', 1);
        }));
        // Add button to switch back to previous overview
        this.drawButton();
    };
    /**
     * @return {?}
     */
    CalendarHeatmapComponent.prototype.drawMonthOverview = /**
     * @return {?}
     */
    function () {
        var _this = this;
        // Add current overview to the history
        if (this.history[this.history.length - 1] !== this.overview) {
            this.history.push(this.overview);
        }
        // Define beginning and end of the month
        /** @type {?} */
        var startOfMonth = moment(this.selected.date).startOf('month');
        /** @type {?} */
        var endOfMonth = moment(this.selected.date).endOf('month');
        // Filter data down to the selected month
        /** @type {?} */
        var monthData = [];
        this._data.filter((/**
         * @param {?} data
         * @return {?}
         */
        function (data) { return data.date.isBetween(startOfMonth, endOfMonth, null, '[]'); }))
            .map((/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            /** @type {?} */
            var scale = [];
            d.details.forEach((/**
             * @param {?} det
             * @return {?}
             */
            function (det) {
                /** @type {?} */
                var date = moment.utc(det.date);
                /** @type {?} */
                var i = Math.floor(date.hours() / 3);
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
            function (s) {
                /** @type {?} */
                var group = _this.groupBy(s.details, 'name');
                Object.keys(group).forEach((/**
                 * @param {?} k
                 * @return {?}
                 */
                function (k) {
                    s.summary.push({
                        name: k,
                        total: sum(group[k], (/**
                         * @param {?} data
                         * @return {?}
                         */
                        function (data) { return data.total; })),
                        color: group[k][0].color
                    });
                }));
            }));
            monthData = monthData.concat(scale);
        }));
        monthData = GTSLib.cleanArray(monthData);
        this.LOG.debug(['drawMonthOverview'], [this.overview, this.selected, monthData]);
        /** @type {?} */
        var maxValue = max(monthData, (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d.total; }));
        // Define day labels and axis
        /** @type {?} */
        var dayLabels = timeDays(moment(this.selected.date).startOf('week').toDate(), moment(this.selected.date).endOf('week').toDate());
        /** @type {?} */
        var dayScale = scaleBand()
            .rangeRound([this.labelPadding, this.gHeight])
            .domain(dayLabels.map((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return moment.utc(d).weekday().toString(); })));
        // Define week labels and axis
        /** @type {?} */
        var weekLabels = [startOfMonth];
        /** @type {?} */
        var incWeek = moment(startOfMonth);
        while (incWeek.week() !== endOfMonth.week()) {
            weekLabels.push(moment(incWeek.add(1, 'week')));
        }
        monthData.forEach((/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            /** @type {?} */
            var summary = [];
            /** @type {?} */
            var group = _this.groupBy(d.details, 'name');
            Object.keys(group).forEach((/**
             * @param {?} k
             * @return {?}
             */
            function (k) {
                summary.push({
                    name: k,
                    total: group[k].reduce((/**
                     * @param {?} acc
                     * @param {?} o
                     * @return {?}
                     */
                    function (acc, o) { return acc + o.value; }), 0),
                    color: group[k][0].color,
                    id: group[k][0].id,
                });
            }));
            d.summary = summary;
        }));
        /** @type {?} */
        var weekScale = scaleBand()
            .rangeRound([this.labelPadding, this.gWidth])
            .padding(0.05)
            .domain(weekLabels.map((/**
         * @param {?} weekday
         * @return {?}
         */
        function (weekday) { return weekday.week() + ''; })));
        /** @type {?} */
        var color = scaleLinear()
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
        function (d) { return _this.calcItemY(d)
            + (_this.itemSize - _this.calcItemSize(d, maxValue)) / 2; }))
            .attr('x', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return _this.calcItemXMonth(d, startOfMonth, weekScale(d.date.week().toString()))
            + (_this.itemSize - _this.calcItemSize(d, maxValue)) / 2; }))
            .attr('rx', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return _this.calcItemSize(d, maxValue); }))
            .attr('ry', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return _this.calcItemSize(d, maxValue); }))
            .attr('width', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return _this.calcItemSize(d, maxValue); }))
            .attr('height', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return _this.calcItemSize(d, maxValue); }))
            .attr('fill', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return (d.total > 0) ? color(d.total) : 'transparent'; }))
            .on('click', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            if (_this.inTransition) {
                return;
            }
            // Don't transition if there is no data to show
            if (d.total === 0) {
                return;
            }
            _this.inTransition = true;
            // Set selected date to the one clicked on
            _this.selected = d;
            // Hide tooltip
            _this.hideTooltip();
            // Remove all month overview related items and labels
            _this.removeMonthOverview();
            // Redraw the chart
            _this.overview = 'day';
            _this.drawChart();
        }))
            .on('mouseover', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            if (_this.inTransition) {
                return;
            }
            // Construct tooltip
            // Calculate tooltip position
            /** @type {?} */
            var x = weekScale(d.date.week().toString()) + _this.tooltipPadding;
            while (_this.gWidth - x < (_this.tooltipWidth + _this.tooltipPadding * 3)) {
                x -= 10;
            }
            /** @type {?} */
            var y = dayScale(d.date.weekday().toString()) + _this.tooltipPadding;
            // Show tooltip
            _this.tooltip.html(_this.getTooltip(d))
                .style('left', x + 'px')
                .style('top', y + 'px')
                .transition()
                .duration(_this.transitionDuration / 2)
                .ease(easeLinear)
                .style('opacity', 1);
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        function () {
            if (_this.inTransition) {
                return;
            }
            _this.hideTooltip();
        }))
            .transition()
            .delay((/**
         * @return {?}
         */
        function () { return (Math.cos(Math.PI * Math.random()) + 1) * _this.transitionDuration; }))
            .duration((/**
         * @return {?}
         */
        function () { return _this.transitionDuration; }))
            .ease(easeLinear)
            .style('opacity', 1)
            .call((/**
         * @param {?} transition
         * @param {?} callback
         * @return {?}
         */
        function (transition, callback) {
            if (transition.empty()) {
                callback();
            }
            /** @type {?} */
            var n = 0;
            transition.each((/**
             * @return {?}
             */
            function () { return ++n; })).on('end', (/**
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
        function () { return _this.inTransition = false; }));
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
        function () { return Math.floor(_this.labelPadding / 3) + 'px'; }))
            .text((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return 'Week ' + d.week(); }))
            .attr('x', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return weekScale(d.week().toString()); }))
            .attr('y', this.labelPadding / 2)
            .on('mouseenter', (/**
         * @param {?} weekday
         * @return {?}
         */
        function (weekday) {
            if (_this.inTransition) {
                return;
            }
            _this.items.selectAll('.item-block-month')
                .transition()
                .duration(_this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) {
                return (moment(d.date).week() === weekday.week()) ? 1 : 0.1;
            }));
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        function () {
            if (_this.inTransition) {
                return;
            }
            _this.items.selectAll('.item-block-month')
                .transition()
                .duration(_this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', 1);
        }))
            .on('click', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            if (_this.inTransition) {
                return;
            }
            _this.inTransition = true;
            // Set selected month to the one clicked on
            _this.selected = { date: d };
            // Hide tooltip
            _this.hideTooltip();
            // Remove all year overview related items and labels
            _this.removeMonthOverview();
            // Redraw the chart
            _this.overview = 'week';
            _this.drawChart();
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
        function (d, i) { return dayScale(i) + dayScale.bandwidth() / 1.75; }))
            .style('text-anchor', 'left')
            .attr('font-size', (/**
         * @return {?}
         */
        function () { return Math.floor(_this.labelPadding / 3) + 'px'; }))
            .text((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return moment.utc(d).format('dddd')[0]; }))
            .on('mouseenter', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            if (_this.inTransition) {
                return;
            }
            /** @type {?} */
            var selectedDay = moment.utc(d);
            _this.items.selectAll('.item-block-month')
                .transition()
                .duration(_this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', (/**
             * @param {?} data
             * @return {?}
             */
            function (data) { return (moment(data.date).day() === selectedDay.day()) ? 1 : 0.1; }));
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        function () {
            if (_this.inTransition) {
                return;
            }
            _this.items.selectAll('.item-block-month')
                .transition()
                .duration(_this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', 1);
        }));
        // Add button to switch back to previous overview
        this.drawButton();
    };
    /**
     * @return {?}
     */
    CalendarHeatmapComponent.prototype.drawWeekOverview = /**
     * @return {?}
     */
    function () {
        var _this = this;
        // Add current overview to the history
        if (this.history[this.history.length - 1] !== this.overview) {
            this.history.push(this.overview);
        }
        // Define beginning and end of the week
        /** @type {?} */
        var startOfWeek = moment(this.selected.date).startOf('week');
        /** @type {?} */
        var endOfWeek = moment(this.selected.date).endOf('week');
        // Filter data down to the selected week
        /** @type {?} */
        var weekData = [];
        this._data.filter((/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            return d.date.isBetween(startOfWeek, endOfWeek, null, '[]');
        })).map((/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            /** @type {?} */
            var scale = [];
            d.details.forEach((/**
             * @param {?} det
             * @return {?}
             */
            function (det) {
                /** @type {?} */
                var date = moment(det.date);
                /** @type {?} */
                var i = date.hours();
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
            function (s) {
                /** @type {?} */
                var group = _this.groupBy(s.details, 'name');
                Object.keys(group).forEach((/**
                 * @param {?} k
                 * @return {?}
                 */
                function (k) {
                    return s.summary.push({
                        name: k,
                        total: sum(group[k], (/**
                         * @param {?} data
                         * @return {?}
                         */
                        function (data) { return data.value; })),
                        color: group[k][0].color
                    });
                }));
            }));
            weekData = weekData.concat(scale);
        }));
        weekData = GTSLib.cleanArray(weekData);
        /** @type {?} */
        var maxValue = max(weekData, (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d.total; }));
        // Define day labels and axis
        /** @type {?} */
        var dayLabels = timeDays(moment.utc().startOf('week').toDate(), moment.utc().endOf('week').toDate());
        /** @type {?} */
        var dayScale = scaleBand()
            .rangeRound([this.labelPadding, this.gHeight])
            .domain(dayLabels.map((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return moment.utc(d).weekday().toString(); })));
        // Define hours labels and axis
        /** @type {?} */
        var hoursLabels = [];
        range(0, 24).forEach((/**
         * @param {?} h
         * @return {?}
         */
        function (h) { return hoursLabels.push(moment.utc().hours(h).startOf('hour').format('HH:mm')); }));
        /** @type {?} */
        var hourScale = scaleBand().rangeRound([this.labelPadding, this.gWidth]).padding(0.01).domain(hoursLabels);
        /** @type {?} */
        var color = scaleLinear()
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
        function (d) { return _this.calcItemY(d)
            + (_this.itemSize - _this.calcItemSize(d, maxValue)) / 2; }))
            .attr('x', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return _this.gutter
            + hourScale(moment(d.date).startOf('hour').format('HH:mm'))
            + (_this.itemSize - _this.calcItemSize(d, maxValue)) / 2; }))
            .attr('rx', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return _this.calcItemSize(d, maxValue); }))
            .attr('ry', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return _this.calcItemSize(d, maxValue); }))
            .attr('width', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return _this.calcItemSize(d, maxValue); }))
            .attr('height', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return _this.calcItemSize(d, maxValue); }))
            .attr('fill', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return (d.total > 0) ? color(d.total) : 'transparent'; }))
            .on('click', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            if (_this.inTransition) {
                return;
            }
            // Don't transition if there is no data to show
            if (d.total === 0) {
                return;
            }
            _this.inTransition = true;
            // Set selected date to the one clicked on
            _this.selected = d;
            // Hide tooltip
            _this.hideTooltip();
            // Remove all week overview related items and labels
            _this.removeWeekOverview();
            // Redraw the chart
            _this.overview = 'day';
            _this.drawChart();
        })).on('mouseover', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            if (_this.inTransition) {
                return;
            }
            // Calculate tooltip position
            /** @type {?} */
            var x = hourScale(moment(d.date).startOf('hour').format('HH:mm')) + _this.tooltipPadding;
            while (_this.gWidth - x < (_this.tooltipWidth + _this.tooltipPadding * 3)) {
                x -= 10;
            }
            /** @type {?} */
            var y = dayScale(d.date.weekday().toString()) + _this.tooltipPadding;
            // Show tooltip
            _this.tooltip.html(_this.getTooltip(d))
                .style('left', x + 'px')
                .style('top', y + 'px')
                .transition()
                .duration(_this.transitionDuration / 2)
                .ease(easeLinear)
                .style('opacity', 1);
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        function () {
            if (_this.inTransition) {
                return;
            }
            _this.hideTooltip();
        }))
            .transition()
            .delay((/**
         * @return {?}
         */
        function () { return (Math.cos(Math.PI * Math.random()) + 1) * _this.transitionDuration; }))
            .duration((/**
         * @return {?}
         */
        function () { return _this.transitionDuration; }))
            .ease(easeLinear)
            .style('opacity', 1)
            .call((/**
         * @param {?} transition
         * @param {?} callback
         * @return {?}
         */
        function (transition, callback) {
            if (transition.empty()) {
                callback();
            }
            /** @type {?} */
            var n = 0;
            transition.each((/**
             * @return {?}
             */
            function () { return ++n; })).on('end', (/**
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
        function () { return _this.inTransition = false; }));
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
        function () { return Math.floor(_this.labelPadding / 3) + 'px'; }))
            .text((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d; }))
            .attr('x', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return hourScale(d); }))
            .attr('y', this.labelPadding / 2)
            .on('mouseenter', (/**
         * @param {?} hour
         * @return {?}
         */
        function (hour) {
            if (_this.inTransition) {
                return;
            }
            _this.items.selectAll('.item-block-week')
                .transition()
                .duration(_this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) { return (moment(d.date).startOf('hour').format('HH:mm') === hour) ? 1 : 0.1; }));
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        function () {
            if (_this.inTransition) {
                return;
            }
            _this.items.selectAll('.item-block-week')
                .transition()
                .duration(_this.transitionDuration)
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
        function (d, i) { return dayScale(i.toString()) + dayScale.bandwidth() / 1.75; }))
            .style('text-anchor', 'left')
            .attr('font-size', (/**
         * @return {?}
         */
        function () { return Math.floor(_this.labelPadding / 3) + 'px'; }))
            .text((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return moment.utc(d).format('dddd')[0]; }))
            .on('mouseenter', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            if (_this.inTransition) {
                return;
            }
            /** @type {?} */
            var selectedDay = moment.utc(d);
            _this.items.selectAll('.item-block-week')
                .transition()
                .duration(_this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', (/**
             * @param {?} data
             * @return {?}
             */
            function (data) { return (moment(data.date).day() === selectedDay.day()) ? 1 : 0.1; }));
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        function () {
            if (_this.inTransition) {
                return;
            }
            _this.items.selectAll('.item-block-week')
                .transition()
                .duration(_this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', 1);
        }));
        // Add button to switch back to previous overview
        this.drawButton();
    };
    /**
     * @return {?}
     */
    CalendarHeatmapComponent.prototype.drawDayOverview = /**
     * @return {?}
     */
    function () {
        var _this = this;
        // Add current overview to the history
        if (this.history[this.history.length - 1] !== this.overview) {
            this.history.push(this.overview);
        }
        // Initialize selected date to today if it was not set
        if (!Object.keys(this.selected).length) {
            this.selected = this._data[this._data.length - 1];
        }
        /** @type {?} */
        var startOfDay = moment(this.selected.date).startOf('day');
        /** @type {?} */
        var endOfDay = moment(this.selected.date).endOf('day');
        // Filter data down to the selected month
        /** @type {?} */
        var dayData = [];
        this._data.filter((/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            return d.date.isBetween(startOfDay, endOfDay, null, '[]');
        })).map((/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            /** @type {?} */
            var scale = [];
            d.details.forEach((/**
             * @param {?} det
             * @return {?}
             */
            function (det) {
                /** @type {?} */
                var date = moment(det.date);
                /** @type {?} */
                var i = date.hours();
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
            function (s) {
                /** @type {?} */
                var group = _this.groupBy(s.details, 'name');
                Object.keys(group).forEach((/**
                 * @param {?} k
                 * @return {?}
                 */
                function (k) {
                    s.summary.push({
                        name: k,
                        total: sum(group[k], (/**
                         * @param {?} item
                         * @return {?}
                         */
                        function (item) { return item.value; })),
                        color: group[k][0].color
                    });
                }));
            }));
            dayData = dayData.concat(scale);
        }));
        /** @type {?} */
        var data = [];
        dayData.forEach((/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            /** @type {?} */
            var date = d.date;
            d.summary.forEach((/**
             * @param {?} s
             * @return {?}
             */
            function (s) {
                s.date = date;
                data.push(s);
            }));
        }));
        dayData = GTSLib.cleanArray(dayData);
        /** @type {?} */
        var maxValue = max(data, (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d.total; }));
        /** @type {?} */
        var gtsNames = this.selected.summary.map((/**
         * @param {?} summary
         * @return {?}
         */
        function (summary) { return summary.name; }));
        /** @type {?} */
        var gtsNameScale = scaleBand().rangeRound([this.labelPadding, this.gHeight]).domain(gtsNames);
        /** @type {?} */
        var hourLabels = [];
        range(0, 24).forEach((/**
         * @param {?} h
         * @return {?}
         */
        function (h) { return hourLabels.push(moment.utc().hours(h).startOf('hour').format('HH:mm')); }));
        /** @type {?} */
        var dayScale = scaleBand()
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
        function (d) { return _this.gutter
            + dayScale(moment(d.date).startOf('hour').format('HH:mm'))
            + (_this.itemSize - _this.calcItemSize(d, maxValue)) / 2; }))
            .attr('y', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            return (gtsNameScale(d.name) || 1) - (_this.itemSize - _this.calcItemSize(d, maxValue)) / 2;
        }))
            .attr('rx', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return _this.calcItemSize(d, maxValue); }))
            .attr('ry', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return _this.calcItemSize(d, maxValue); }))
            .attr('width', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return _this.calcItemSize(d, maxValue); }))
            .attr('height', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return _this.calcItemSize(d, maxValue); }))
            .attr('fill', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            /** @type {?} */
            var color = scaleLinear()
                .range(['#ffffff', d.color || CalendarHeatmapComponent.DEF_MIN_COLOR])
                .domain([-0.5 * maxValue, maxValue]);
            return color(d.total);
        }))
            .style('opacity', 0)
            .on('mouseover', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            if (_this.inTransition) {
                return;
            }
            // Calculate tooltip position
            /** @type {?} */
            var x = dayScale(moment(d.date).startOf('hour').format('HH:mm')) + _this.tooltipPadding;
            while (_this.gWidth - x < (_this.tooltipWidth + _this.tooltipPadding * 3)) {
                x -= 10;
            }
            /** @type {?} */
            var y = gtsNameScale(d.name) + _this.tooltipPadding;
            // Show tooltip
            _this.tooltip.html(_this.getTooltip(d))
                .style('left', x + 'px')
                .style('top', y + 'px')
                .transition()
                .duration(_this.transitionDuration / 2)
                .ease(easeLinear)
                .style('opacity', 1);
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        function () {
            if (_this.inTransition) {
                return;
            }
            _this.hideTooltip();
        }))
            .on('click', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            if (_this.handler) {
                _this.handler.emit(d);
            }
        }))
            .transition()
            .delay((/**
         * @return {?}
         */
        function () { return (Math.cos(Math.PI * Math.random()) + 1) * _this.transitionDuration; }))
            .duration((/**
         * @return {?}
         */
        function () { return _this.transitionDuration; }))
            .ease(easeLinear)
            .style('opacity', 1)
            .call((/**
         * @param {?} transition
         * @param {?} callback
         * @return {?}
         */
        function (transition, callback) {
            if (transition.empty()) {
                callback();
            }
            /** @type {?} */
            var n = 0;
            transition.each((/**
             * @return {?}
             */
            function () { return ++n; })).on('end', (/**
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
        function () { return _this.inTransition = false; }));
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
        function () { return Math.floor(_this.labelPadding / 3) + 'px'; }))
            .text((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d; }))
            .attr('x', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return dayScale(d); }))
            .attr('y', this.labelPadding / 2)
            .on('mouseenter', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            if (_this.inTransition) {
                return;
            }
            /** @type {?} */
            var selected = d;
            // const selected = itemScale(moment.utc(d));
            _this.items.selectAll('.item-block')
                .transition()
                .duration(_this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', (/**
             * @param {?} item
             * @return {?}
             */
            function (item) { return (item.date.format('HH:mm') === selected) ? 1 : 0.1; }));
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        function () {
            if (_this.inTransition) {
                return;
            }
            _this.items.selectAll('.item-block')
                .transition()
                .duration(_this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', 1);
        }));
        // Add project labels
        /** @type {?} */
        var labelPadding = this.labelPadding;
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
        function (d) { return gtsNameScale(d) + _this.itemSize / 2; }))
            .attr('min-height', (/**
         * @return {?}
         */
        function () { return gtsNameScale.bandwidth(); }))
            .style('text-anchor', 'left')
            .attr('font-size', (/**
         * @return {?}
         */
        function () { return Math.floor(_this.labelPadding / 3) + 'px'; }))
            .text((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d; }))
            .each((/**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var obj = select(this);
            /** @type {?} */
            var textLength = obj.node().getComputedTextLength();
            /** @type {?} */
            var text = obj.text();
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
        function (gtsName) {
            if (_this.inTransition) {
                return;
            }
            _this.items.selectAll('.item-block')
                .transition()
                .duration(_this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) { return (d.name === gtsName) ? 1 : 0.1; }));
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        function () {
            if (_this.inTransition) {
                return;
            }
            _this.items.selectAll('.item-block')
                .transition()
                .duration(_this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', 1);
        }));
        // Add button to switch back to previous overview
        this.drawButton();
    };
    /**
     * @private
     * @param {?} d
     * @param {?} startOfYear
     * @return {?}
     */
    CalendarHeatmapComponent.prototype.calcItemX = /**
     * @private
     * @param {?} d
     * @param {?} startOfYear
     * @return {?}
     */
    function (d, startOfYear) {
        /** @type {?} */
        var dayIndex = Math.round((+moment(d.date) - +startOfYear.startOf('week')) / 86400000);
        /** @type {?} */
        var colIndex = Math.trunc(dayIndex / 7);
        return colIndex * (this.itemSize + this.gutter) + this.labelPadding;
    };
    /**
     * @private
     * @param {?} d
     * @param {?} start
     * @param {?} offset
     * @return {?}
     */
    CalendarHeatmapComponent.prototype.calcItemXMonth = /**
     * @private
     * @param {?} d
     * @param {?} start
     * @param {?} offset
     * @return {?}
     */
    function (d, start, offset) {
        /** @type {?} */
        var hourIndex = moment(d.date).hours();
        /** @type {?} */
        var colIndex = Math.trunc(hourIndex / 3);
        return colIndex * (this.itemSize + this.gutter) + offset;
    };
    /**
     * @private
     * @param {?} d
     * @return {?}
     */
    CalendarHeatmapComponent.prototype.calcItemY = /**
     * @private
     * @param {?} d
     * @return {?}
     */
    function (d) {
        return this.labelPadding + d.date.weekday() * (this.itemSize + this.gutter);
    };
    /**
     * @private
     * @param {?} d
     * @param {?} m
     * @return {?}
     */
    CalendarHeatmapComponent.prototype.calcItemSize = /**
     * @private
     * @param {?} d
     * @param {?} m
     * @return {?}
     */
    function (d, m) {
        if (m <= 0) {
            return this.itemSize;
        }
        return this.itemSize * 0.75 + (this.itemSize * d.total / m) * 0.25;
    };
    /**
     * @private
     * @return {?}
     */
    CalendarHeatmapComponent.prototype.drawButton = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        this.buttons.selectAll('.button').remove();
        /** @type {?} */
        var button = this.buttons.append('g')
            .attr('class', 'button button-back')
            .style('opacity', 0)
            .on('click', (/**
         * @return {?}
         */
        function () {
            if (_this.inTransition) {
                return;
            }
            // Set transition boolean
            _this.inTransition = true;
            // Clean the canvas from whichever overview type was on
            if (_this.overview === 'year') {
                _this.removeYearOverview();
            }
            else if (_this.overview === 'month') {
                _this.removeMonthOverview();
            }
            else if (_this.overview === 'week') {
                _this.removeWeekOverview();
            }
            else if (_this.overview === 'day') {
                _this.removeDayOverview();
            }
            // Redraw the chart
            _this.history.pop();
            _this.overview = _this.history.pop();
            _this.drawChart();
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
        function () {
            return Math.floor(_this.gWidth / 100) / 3;
        }))
            .attr('font-size', (/**
         * @return {?}
         */
        function () {
            return Math.floor(_this.labelPadding / 3) + 'px';
        }))
            .html('&#x2190;');
        button.transition()
            .duration(this.transitionDuration)
            .ease(easeLinear)
            .style('opacity', 1);
    };
    /**
     * @private
     * @return {?}
     */
    CalendarHeatmapComponent.prototype.removeGlobalOverview = /**
     * @private
     * @return {?}
     */
    function () {
        this.items.selectAll('.item-block-year')
            .transition()
            .duration(this.transitionDuration)
            .ease(easeLinear)
            .style('opacity', 0)
            .remove();
        this.labels.selectAll('.label-year').remove();
    };
    /**
     * @private
     * @return {?}
     */
    CalendarHeatmapComponent.prototype.removeYearOverview = /**
     * @private
     * @return {?}
     */
    function () {
        this.items.selectAll('.item-circle')
            .transition()
            .duration(this.transitionDuration)
            .ease(easeLinear)
            .style('opacity', 0)
            .remove();
        this.labels.selectAll('.label-day').remove();
        this.labels.selectAll('.label-month').remove();
        this.hideBackButton();
    };
    /**
     * @private
     * @return {?}
     */
    CalendarHeatmapComponent.prototype.removeMonthOverview = /**
     * @private
     * @return {?}
     */
    function () {
        this.items.selectAll('.item-block-month')
            .transition()
            .duration(this.transitionDuration)
            .ease(easeLinear)
            .style('opacity', 0)
            .remove();
        this.labels.selectAll('.label-day').remove();
        this.labels.selectAll('.label-week').remove();
        this.hideBackButton();
    };
    /**
     * @private
     * @return {?}
     */
    CalendarHeatmapComponent.prototype.removeWeekOverview = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
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
        function (d, i) { return (i % 2 === 0) ? -_this.gWidth / 3 : _this.gWidth / 3; }))
            .remove();
        this.labels.selectAll('.label-day').remove();
        this.labels.selectAll('.label-week').remove();
        this.hideBackButton();
    };
    /**
     * @private
     * @return {?}
     */
    CalendarHeatmapComponent.prototype.removeDayOverview = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
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
        function (d, i) { return (i % 2 === 0) ? -_this.gWidth / 3 : _this.gWidth / 3; }))
            .remove();
        this.labels.selectAll('.label-time').remove();
        this.labels.selectAll('.label-project').remove();
        this.hideBackButton();
    };
    /**
     * @private
     * @return {?}
     */
    CalendarHeatmapComponent.prototype.hideTooltip = /**
     * @private
     * @return {?}
     */
    function () {
        this.tooltip.transition()
            .duration(this.transitionDuration / 2)
            .ease(easeLinear)
            .style('opacity', 0);
    };
    /**
     * Helper function to hide the back button
     */
    /**
     * Helper function to hide the back button
     * @private
     * @return {?}
     */
    CalendarHeatmapComponent.prototype.hideBackButton = /**
     * Helper function to hide the back button
     * @private
     * @return {?}
     */
    function () {
        this.buttons.selectAll('.button')
            .transition()
            .duration(this.transitionDuration)
            .ease(easeLinear)
            .style('opacity', 0)
            .remove();
    };
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
    CalendarHeatmapComponent.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
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
    return CalendarHeatmapComponent;
}());
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
var WarpViewModalComponent = /** @class */ (function () {
    function WarpViewModalComponent(el) {
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
    WarpViewModalComponent.prototype.open = /**
     * @return {?}
     */
    function () {
        this.el.nativeElement.style.display = 'block';
        this.el.nativeElement.style.zIndex = '999999';
        this.opened = true;
        this.warpViewModalOpen.emit({});
    };
    /**
     * @return {?}
     */
    WarpViewModalComponent.prototype.close = /**
     * @return {?}
     */
    function () {
        this.el.nativeElement.style.display = 'none';
        this.el.nativeElement.style.zIndex = '-1';
        this.opened = false;
        this.warpViewModalClose.emit({});
    };
    /**
     * @return {?}
     */
    WarpViewModalComponent.prototype.isOpened = /**
     * @return {?}
     */
    function () {
        var _this = this;
        return new Promise((/**
         * @param {?} resolve
         * @return {?}
         */
        function (resolve) {
            resolve(_this.opened);
        }));
    };
    /**
     * @param {?} $event
     * @return {?}
     */
    WarpViewModalComponent.prototype.handleKeyDown = /**
     * @param {?} $event
     * @return {?}
     */
    function ($event) {
        if ('Escape' === $event[0]) {
            this.close();
        }
    };
    /**
     * @return {?}
     */
    WarpViewModalComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.el.nativeElement.addEventListener('click', (/**
         * @param {?} event
         * @return {?}
         */
        function (event) {
            if (event.path[0].nodeName === 'WARP-VIEW-MODAL') {
                _this.close();
            }
        }));
    };
    WarpViewModalComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-modal',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"popup\">\n  <div class=\"header\">\n    <div class=\"title\" [innerHTML]=\"modalTitle\"></div>\n    <div class=\"close\" (click)=\"close()\">&times;</div>\n  </div>\n  <div class=\"body\">\n    <ng-content></ng-content>\n  </div>\n</div>\n",
                    encapsulation: ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host{position:fixed;top:0;left:0;z-index:0;display:none;width:100%;height:100%;overflow:hidden;outline:0;background-color:rgba(0,0,0,.3)}:host .popup{position:relative;width:100%;height:auto;background-color:var(--warp-view-popup-bg-color);top:10%;z-index:999999;background-clip:padding-box;border:1px solid var(--warp-view-popup-border-color);border-radius:.3rem;display:-webkit-box;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;flex-direction:column;pointer-events:auto;outline:0;margin:1.75rem auto}@media (min-width:576px){:host .popup{max-width:800px}}:host .popup .header{background-color:var(--warp-view-popup-header-bg-color);display:-webkit-box;display:flex;-webkit-box-align:start;align-items:flex-start;-webkit-box-pack:justify;justify-content:space-between;padding:1rem;border-bottom:1px solid #e9ecef;border-top-left-radius:.3rem;border-top-right-radius:.3rem}:host .popup .header .title{margin-bottom:0;line-height:1.5;color:var(--warp-view-popup-title-color)}:host .popup .header .close{padding:1rem;margin:-1rem -1rem -1rem auto;cursor:pointer;color:var(--warp-view-popup-close-color)}:host .popup .body{position:relative;background-color:var(--warp-view-popup-body-bg-color);color:var(--warp-view-popup-body-color);height:auto;padding:10px}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewModalComponent.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    WarpViewModalComponent.propDecorators = {
        modalTitle: [{ type: Input, args: ['modalTitle',] }],
        kbdLastKeyPressed: [{ type: Input, args: ['kbdLastKeyPressed',] }],
        warpViewModalOpen: [{ type: Output, args: ['warpViewModalOpen',] }],
        warpViewModalClose: [{ type: Output, args: ['warpViewModalClose',] }],
        handleKeyDown: [{ type: HostListener, args: ['kbdLastKeyPressed', ['$event'],] }]
    };
    return WarpViewModalComponent;
}());
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
var WarpViewGtsPopupComponent = /** @class */ (function () {
    function WarpViewGtsPopupComponent() {
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
    Object.defineProperty(WarpViewGtsPopupComponent.prototype, "options", {
        set: /**
         * @param {?} options
         * @return {?}
         */
        function (options) {
            this.LOG.debug(['onOptions'], options);
            if (typeof options === 'string') {
                options = JSON.parse(options);
            }
            if (!deepEqual(options, this._options)) {
                this.LOG.debug(['options', 'changed'], options);
                this._options = (/** @type {?} */ (ChartLib.mergeDeep(this._options, (/** @type {?} */ (options)))));
                this.prepareData();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarpViewGtsPopupComponent.prototype, "gtsList", {
        set: /**
         * @param {?} gtsList
         * @return {?}
         */
        function (gtsList) {
            this._gtsList = gtsList;
            this.LOG.debug(['_gtsList'], this._gtsList);
            this.prepareData();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarpViewGtsPopupComponent.prototype, "gtslist", {
        get: /**
         * @return {?}
         */
        function () {
            return this._gtsList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarpViewGtsPopupComponent.prototype, "debug", {
        get: /**
         * @return {?}
         */
        function () {
            return this._debug;
        },
        set: /**
         * @param {?} debug
         * @return {?}
         */
        function (debug) {
            this._debug = debug;
            this.LOG.setDebug(debug);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarpViewGtsPopupComponent.prototype, "data", {
        get: /**
         * @return {?}
         */
        function () {
            return this._data;
        },
        set: /**
         * @param {?} data
         * @return {?}
         */
        function (data) {
            this.LOG.debug(['data'], data);
            if (data) {
                this._data = data;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarpViewGtsPopupComponent.prototype, "hiddenData", {
        get: /**
         * @return {?}
         */
        function () {
            return this._hiddenData;
        },
        set: /**
         * @param {?} hiddenData
         * @return {?}
         */
        function (hiddenData) {
            this._hiddenData = hiddenData;
            this.prepareData();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarpViewGtsPopupComponent.prototype, "kbdLastKeyPressed", {
        get: /**
         * @return {?}
         */
        function () {
            return this._kbdLastKeyPressed;
        },
        set: /**
         * @param {?} kbdLastKeyPressed
         * @return {?}
         */
        function (kbdLastKeyPressed) {
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
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    WarpViewGtsPopupComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        this.prepareData();
    };
    /**
     * @return {?}
     */
    WarpViewGtsPopupComponent.prototype.onWarpViewModalOpen = /**
     * @return {?}
     */
    function () {
        this.modalOpenned = true;
        this.warpViewModalOpen.emit({});
    };
    /**
     * @return {?}
     */
    WarpViewGtsPopupComponent.prototype.onWarpViewModalClose = /**
     * @return {?}
     */
    function () {
        this.modalOpenned = false;
        this.warpViewModalClose.emit({});
    };
    /**
     * @return {?}
     */
    WarpViewGtsPopupComponent.prototype.isOpened = /**
     * @return {?}
     */
    function () {
        return this.modal.isOpened();
    };
    /**
     * @private
     * @return {?}
     */
    WarpViewGtsPopupComponent.prototype.showPopup = /**
     * @private
     * @return {?}
     */
    function () {
        this.current = 0;
        this.prepareData();
        this.modal.open();
    };
    /**
     * @return {?}
     */
    WarpViewGtsPopupComponent.prototype.close = /**
     * @return {?}
     */
    function () {
        this.modal.close();
    };
    /**
     * @private
     * @return {?}
     */
    WarpViewGtsPopupComponent.prototype.prepareData = /**
     * @private
     * @return {?}
     */
    function () {
        if (this._gtsList && this._gtsList.data) {
            this._gts = GTSLib.flatDeep([this._gtsList.data]);
            this.displayed = (/** @type {?} */ (this._gts.slice(Math.max(0, Math.min(this.current - this.maxToShow, this._gts.length - 2 * this.maxToShow)), Math.min(this._gts.length, this.current + this.maxToShow + Math.abs(Math.min(this.current - this.maxToShow, 0))))));
            this.LOG.debug(['prepareData'], this.displayed);
        }
    };
    /**
     * @param {?} gts
     * @return {?}
     */
    WarpViewGtsPopupComponent.prototype.isHidden = /**
     * @param {?} gts
     * @return {?}
     */
    function (gts) {
        return !this.displayed.find((/**
         * @param {?} g
         * @return {?}
         */
        function (g) { return !!gts ? gts.id === g.id : false; }));
    };
    WarpViewGtsPopupComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-gts-popup',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<warpview-modal [kbdLastKeyPressed]=\"kbdLastKeyPressed\"\n                modalTitle=\"GTS Selector\"\n                #modal\n                (warpViewModalClose)=\"onWarpViewModalClose()\"\n                (warpViewModalOpen)=\"onWarpViewModalOpen()\">\n  <div class=\"up-arrow\" *ngIf=\"this.current > 0\"></div>\n  <ul>\n    <li *ngFor=\"let g of _gts; index as index\"\n        [ngClass]=\"{ selected: current == index, hidden: isHidden(g.id) }\"\n    >\n      <warpview-chip [node]=\"{gts: g}\" [name]=\"g.c\" [hiddenData]=\"hiddenData\" [options]=\"_options\"></warpview-chip>\n    </li>\n  </ul>\n  <div class=\"down-arrow\" *ngIf=\"current < _gts.length - 1\"></div>\n</warpview-modal>\n",
                    encapsulation: ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewGtsPopupComponent.ctorParameters = function () { return []; };
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
    return WarpViewGtsPopupComponent;
}());
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
var WarpViewGtsTreeComponent = /** @class */ (function (_super) {
    __extends(WarpViewGtsTreeComponent, _super);
    function WarpViewGtsTreeComponent(el, renderer, sizeService, ngZone) {
        var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
        _this.el = el;
        _this.renderer = renderer;
        _this.sizeService = sizeService;
        _this.ngZone = ngZone;
        _this.kbdLastKeyPressed = [];
        _this.warpViewSelectedGTS = new EventEmitter();
        _this._gtsFilter = 'x';
        _this.gtsList = [];
        _this.params = (/** @type {?} */ ([]));
        _this.expand = false;
        _this.initOpen = new Subject();
        _this.LOG = new Logger(WarpViewGtsTreeComponent, _this._debug);
        return _this;
    }
    Object.defineProperty(WarpViewGtsTreeComponent.prototype, "gtsFilter", {
        get: /**
         * @return {?}
         */
        function () {
            return this._gtsFilter;
        },
        set: /**
         * @param {?} gtsFilter
         * @return {?}
         */
        function (gtsFilter) {
            this._gtsFilter = gtsFilter;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    WarpViewGtsTreeComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
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
    };
    /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    WarpViewGtsTreeComponent.prototype.update = /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    function (options, refresh) {
        this.doRender();
        if (!!this._options.foldGTSTree && !this.expand) {
            this.foldAll();
        }
    };
    /**
     * @private
     * @return {?}
     */
    WarpViewGtsTreeComponent.prototype.doRender = /**
     * @private
     * @return {?}
     */
    function () {
        this.LOG.debug(['doRender', 'gtsList'], this._data);
        this._options = (/** @type {?} */ (ChartLib.mergeDeep(this.defOptions, this._options)));
        if (!this._data) {
            return;
        }
        /** @type {?} */
        var dataList = GTSLib.getData(this._data).data;
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
    };
    /**
     * @private
     * @return {?}
     */
    WarpViewGtsTreeComponent.prototype.foldAll = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        if (!this.root) {
            setTimeout((/**
             * @return {?}
             */
            function () { return _this.foldAll(); }));
        }
        else {
            this.expand = false;
        }
    };
    /**
     * @return {?}
     */
    WarpViewGtsTreeComponent.prototype.toggleVisibility = /**
     * @return {?}
     */
    function () {
        this.expand = !this.expand;
    };
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    WarpViewGtsTreeComponent.prototype.convert = /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    function (data) {
        return [];
    };
    /**
     * @param {?} event
     * @return {?}
     */
    WarpViewGtsTreeComponent.prototype.warpViewSelectedGTSHandler = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.LOG.debug(['warpViewSelectedGTS'], event);
        this.warpViewSelectedGTS.emit(event);
    };
    WarpViewGtsTreeComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-gts-tree',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"wrapper\">\n  <div class=\"stack-level\" (click)=\"toggleVisibility()\">\n    <span [ngClass]=\"{expanded: this.expand, collapsed: !this.expand}\" #root></span> Results\n  </div>\n  <warpview-tree-view [events]=\"initOpen.asObservable()\"\n                      [gtsList]=\"gtsList\" [branch]=\"false\" *ngIf=\"expand\" [params]=\"params\"\n                      [options]=\"_options\" (warpViewSelectedGTS)=\"warpViewSelectedGTSHandler($event)\"\n                      [debug]=\"debug\" [hiddenData]=\"hiddenData\" [gtsFilter]=\"gtsFilter\"\n                      [kbdLastKeyPressed]=\"kbdLastKeyPressed\"></warpview-tree-view>\n</div>\n",
                    encapsulation: ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host .wrapper{text-align:left}:host .stack-level{font-size:1em;padding-top:5px;cursor:pointer;color:var(--gts-stack-font-color)}:host .stack-level+div{padding-left:25px}:host .expanded{padding:1px 10px;margin-right:5px;background-image:var(--gts-tree-expanded-icon);background-position:center left;background-repeat:no-repeat}:host .collapsed{padding:1px 10px;margin-right:5px;background-image:var(--gts-tree-collapsed-icon);background-repeat:no-repeat;background-position:center left}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewGtsTreeComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: SizeService },
        { type: NgZone }
    ]; };
    WarpViewGtsTreeComponent.propDecorators = {
        root: [{ type: ViewChild, args: ['root', { static: true },] }],
        kbdLastKeyPressed: [{ type: Input, args: ['kbdLastKeyPressed',] }],
        gtsFilter: [{ type: Input, args: ['gtsFilter',] }],
        warpViewSelectedGTS: [{ type: Output, args: ['warpViewSelectedGTS',] }]
    };
    return WarpViewGtsTreeComponent;
}(WarpViewComponent));
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
var WarpViewTreeViewComponent = /** @class */ (function () {
    function WarpViewTreeViewComponent() {
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
    Object.defineProperty(WarpViewTreeViewComponent.prototype, "debug", {
        get: /**
         * @return {?}
         */
        function () {
            return this._debug;
        },
        set: /**
         * @param {?} debug
         * @return {?}
         */
        function (debug) {
            this._debug = debug;
            this.LOG.setDebug(debug);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarpViewTreeViewComponent.prototype, "hiddenData", {
        get: /**
         * @return {?}
         */
        function () {
            return this._hiddenData;
        },
        set: /**
         * @param {?} hiddenData
         * @return {?}
         */
        function (hiddenData) {
            this._hiddenData = __spread(hiddenData);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    WarpViewTreeViewComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.LOG.debug(['ngOnInit'], this.gtsList);
        this.gtsList.forEach((/**
         * @param {?} g
         * @param {?} index
         * @return {?}
         */
        function (g, index) {
            _this.hide[index + ''] = false;
        }));
        this.eventsSubscription = this.events.subscribe((/**
         * @return {?}
         */
        function () { return _this.open(); }));
    };
    /**
     * @return {?}
     */
    WarpViewTreeViewComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.eventsSubscription.unsubscribe();
    };
    /**
     * @param {?} index
     * @return {?}
     */
    WarpViewTreeViewComponent.prototype.toggleVisibility = /**
     * @param {?} index
     * @return {?}
     */
    function (index) {
        this.LOG.debug(['toggleVisibility'], index, this.hide);
        this.hide[index + ''] = !this.hide[index + ''];
    };
    /**
     * @param {?} index
     * @return {?}
     */
    WarpViewTreeViewComponent.prototype.isHidden = /**
     * @param {?} index
     * @return {?}
     */
    function (index) {
        if (!!this.hide[index + '']) {
            return this.hide[index + ''];
        }
        else {
            return false;
        }
    };
    /**
     * @param {?} node
     * @return {?}
     */
    WarpViewTreeViewComponent.prototype.isGts = /**
     * @param {?} node
     * @return {?}
     */
    function (node) {
        return GTSLib.isGts(node);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    WarpViewTreeViewComponent.prototype.warpViewSelectedGTSHandler = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.LOG.debug(['warpViewSelectedGTS'], event);
        this.warpViewSelectedGTS.emit(event);
    };
    /**
     * @return {?}
     */
    WarpViewTreeViewComponent.prototype.open = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.gtsList.forEach((/**
         * @param {?} g
         * @param {?} index
         * @return {?}
         */
        function (g, index) {
            _this.hide[index + ''] = true;
        }));
        setTimeout((/**
         * @return {?}
         */
        function () { return _this.initOpen.next(); }));
    };
    WarpViewTreeViewComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-tree-view',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"list\">\n  <ul *ngIf=\"gtsList\">\n    <li *ngFor=\"let gts of gtsList; index as index; first as first\" >\n      <warpview-chip\n        *ngIf=\"isGts(gts)\"\n        [options]=\"options\" (warpViewSelectedGTS)=\"warpViewSelectedGTSHandler($event)\" [param]=\"params[gts.id]\"\n        [node]=\"{gts: gts}\" [name]=\"gts.c\" [gtsFilter]=\"gtsFilter\" [debug]=\"debug\" [hiddenData]=\"hiddenData\"\n        [kbdLastKeyPressed]=\"kbdLastKeyPressed\"></warpview-chip>\n      <span *ngIf=\"!isGts(gts)\">\n        <span *ngIf=\"gts\">\n          <span *ngIf=\"branch\">\n            <span>\n            <span [ngClass]=\"{expanded:  hide[index + ''], collapsed: !hide[index + '']}\"\n                  (click)=\"toggleVisibility(index)\" [id]=\"'span-' + index\"> </span>\n                    <small (click)=\"toggleVisibility(index)\"> List of {{gts.length}}\n                      item{{gts.length > 1 ? 's' : ''}}</small>\n           </span>\n          </span>\n          <span *ngIf=\"!branch\">\n            <span class=\"stack-level\">\n              <span [ngClass]=\"{expanded: hide[index + ''], collapsed: !hide[index + '']}\"\n                    (click)=\"toggleVisibility(index)\" [id]=\"'span-' + index\"></span>\n              <span (click)=\"toggleVisibility(index)\">{{first ? '[TOP]' : '[' + (index + 1) + ']'}}&nbsp;\n                <small [id]=\"'inner-' + index\">List of {{gts.length}} item{{gts.length > 1 ? 's' : ''}}</small>\n              </span>\n                  </span>\n          </span>\n    <warpview-tree-view [gtsList]=\"gts\" [branch]=\"true\" *ngIf=\"isHidden(index)\"\n                        [debug]=\"debug\" [gtsFilter]=\"gtsFilter\" [params]=\"params\"\n                        [events]=\"initOpen.asObservable()\"\n                        [options]=\"options\" (warpViewSelectedGTS)=\"warpViewSelectedGTSHandler($event)\"\n                        [kbdLastKeyPressed]=\"kbdLastKeyPressed\" [hiddenData]=\"hiddenData\"></warpview-tree-view>\n        </span>\n      </span>\n    </li>\n  </ul>\n</div>\n",
                    encapsulation: ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host ul{margin:0;padding:0;list-style:none;border:none;overflow:hidden}:host li{color:var(--gts-stack-font-color,#000);position:relative;padding:0 0 0 20px;line-height:20px}:host .list,:host li .stack-level{font-size:1em;padding-top:5px}:host .list+div,:host li .stack-level+div{padding-left:25px}:host li .expanded{padding:1px 10px;margin-right:5px;background-image:var(--gts-tree-expanded-icon,url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==));background-position:center left;background-repeat:no-repeat}:host li .collapsed{padding:1px 10px;margin-right:5px;background-image:var(--gts-tree-collapsed-icon,url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=));background-repeat:no-repeat;background-position:center left}:host li .gtsInfo{white-space:normal;word-wrap:break-word}:host li .gtsInfo[disabled]{color:#aaa;cursor:not-allowed}:host li .normal{border-radius:50%;background-color:#bbb;display:inline-block}:host li i,:host li span{cursor:pointer}:host li .selected{background-color:#adf;font-weight:700;padding:1px 5px}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewTreeViewComponent.ctorParameters = function () { return []; };
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
    return WarpViewTreeViewComponent;
}());
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
var GTS = /** @class */ (function () {
    function GTS() {
    }
    return GTS;
}());
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
var WarpViewChipComponent = /** @class */ (function () {
    function WarpViewChipComponent() {
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
    Object.defineProperty(WarpViewChipComponent.prototype, "debug", {
        get: /**
         * @return {?}
         */
        function () {
            return this._debug;
        },
        set: /**
         * @param {?} debug
         * @return {?}
         */
        function (debug) {
            this._debug = debug;
            this.LOG.setDebug(debug);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarpViewChipComponent.prototype, "hiddenData", {
        get: /**
         * @return {?}
         */
        function () {
            return this._hiddenData;
        },
        set: /**
         * @param {?} hiddenData
         * @return {?}
         */
        function (hiddenData) {
            this._hiddenData = hiddenData;
            this.LOG.debug(['hiddenData'], hiddenData, this._node, this._node.gts, this._node.gts.c);
            if (this._node && this._node.gts && this._node.gts.c) {
                this._node = __assign({}, this._node, { selected: this.hiddenData.indexOf(this._node.gts.id) === -1, label: GTSLib.serializeGtsMetadata(this._node.gts) });
                this.LOG.debug(['hiddenData'], this._node);
                this.colorizeChip();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarpViewChipComponent.prototype, "gtsFilter", {
        get: /**
         * @return {?}
         */
        function () {
            return this._gtsFilter;
        },
        set: /**
         * @param {?} gtsFilter
         * @return {?}
         */
        function (gtsFilter) {
            this._gtsFilter = gtsFilter;
            if (this._gtsFilter.slice(1) !== '') {
                this.setState(new RegExp(this._gtsFilter.slice(1), 'gi').test(GTSLib.serializeGtsMetadata(this._node.gts)));
            }
            else {
                this.setState(true);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarpViewChipComponent.prototype, "kbdLastKeyPressed", {
        set: /**
         * @param {?} kbdLastKeyPressed
         * @return {?}
         */
        function (kbdLastKeyPressed) {
            this._kbdLastKeyPressed = kbdLastKeyPressed;
            if (kbdLastKeyPressed[0] === 'a') {
                this.setState(true);
            }
            if (kbdLastKeyPressed[0] === 'n') {
                this.setState(false);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    WarpViewChipComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this._node = __assign({}, this.node, { selected: this.hiddenData.indexOf(this.node.gts.id) === -1 });
    };
    /**
     * @return {?}
     */
    WarpViewChipComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        if (this.gtsFilter.slice(1) !== '' && new RegExp(this.gtsFilter.slice(1), 'gi').test(GTSLib.serializeGtsMetadata(this._node.gts))
            || this.hiddenData.indexOf(this._node.gts.id) > -1) {
            this.setState(false);
        }
        this.colorizeChip();
    };
    /**
     * @private
     * @return {?}
     */
    WarpViewChipComponent.prototype.colorizeChip = /**
     * @private
     * @return {?}
     */
    function () {
        if (this.chip) {
            if (this._node.selected && this.chip.nativeElement) {
                /** @type {?} */
                var c = ColorLib.getColor(this._node.gts.id, this.options.scheme);
                /** @type {?} */
                var color = (this.param || { datasetColor: c }).datasetColor || c;
                this.chip.nativeElement.style.setProperty('background-color', ColorLib.transparentize(color));
                this.chip.nativeElement.style.setProperty('border-color', color);
            }
            else {
                this.chip.nativeElement.style.setProperty('background-color', '#eeeeee');
            }
            this.refreshCounter++;
        }
    };
    /**
     * @param {?} obj
     * @return {?}
     */
    WarpViewChipComponent.prototype.toArray = /**
     * @param {?} obj
     * @return {?}
     */
    function (obj) {
        if (obj === undefined) {
            return [];
        }
        return Object.keys(obj).map((/**
         * @param {?} key
         * @return {?}
         */
        function (key) { return ({ name: key, value: obj[key] }); }));
    };
    /**
     * @param {?} event
     * @return {?}
     */
    WarpViewChipComponent.prototype.switchPlotState = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        event.preventDefault();
        this.setState(!this._node.selected);
        return false;
    };
    /**
     * @private
     * @param {?} state
     * @return {?}
     */
    WarpViewChipComponent.prototype.setState = /**
     * @private
     * @param {?} state
     * @return {?}
     */
    function (state) {
        if (this._node && this._node.gts) {
            this._node = __assign({}, this._node, { selected: state, label: GTSLib.serializeGtsMetadata(this._node.gts) });
            this.LOG.debug(['switchPlotState'], this._node);
            this.colorizeChip();
            this.warpViewSelectedGTS.emit(this._node);
        }
    };
    WarpViewChipComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-chip',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div>\n   <span (click)=\"switchPlotState($event)\" *ngIf=\"_node && _node.gts && _node.gts.l\">\n     <i class=\"normal\" #chip></i>\n     <span class=\"gtsInfo\">\n       <span class='gts-classname'>&nbsp; {{_node.gts.c}}</span>\n       <span class='gts-separator'>&#x007B; </span>\n       <span *ngFor=\"let label of toArray(_node.gts.l); index as index; last as last\">\n         <span class='gts-labelname'>{{label.name}}</span>\n         <span class='gts-separator'>=</span>\n         <span class='gts-labelvalue'>{{label.value}}</span>\n         <span [hidden]=\"last\">, </span>\n       </span>\n       <span class=\"gts-separator\"> &#x007D; </span>\n         <span class='gts-separator'>&#x007B; </span>\n         <span *ngFor=\"let label of toArray(_node.gts.a); index as index; last as last\">\n           <span class='gts-attrname'>{{label.name}}</span>\n           <span class='gts-separator'>=</span>\n           <span class='gts-attrvalue'>{{label.value}}</span>\n           <span [hidden]=\"last\">, </span>\n         </span>\n       <span class=\"gts-separator\"> &#x007D;</span>\n       </span>\n   </span>\n</div>\n",
                    encapsulation: ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}:host div span{cursor:pointer}:host .normal{border-radius:50%;background-color:#bbb;display:inline-block;width:5px;height:5px;border:2px solid #454545;margin-top:auto;margin-bottom:auto;vertical-align:middle;cursor:pointer}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewChipComponent.ctorParameters = function () { return []; };
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
    return WarpViewChipComponent;
}());
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
var WarpViewImageComponent = /** @class */ (function (_super) {
    __extends(WarpViewImageComponent, _super);
    function WarpViewImageComponent(el, renderer, sizeService, ngZone) {
        var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
        _this.el = el;
        _this.renderer = renderer;
        _this.sizeService = sizeService;
        _this.ngZone = ngZone;
        _this.imageTitle = '';
        _this.parentWidth = -1;
        _this.LOG = new Logger(WarpViewImageComponent, _this._debug);
        return _this;
    }
    /**
     * @return {?}
     */
    WarpViewImageComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        this.LOG.debug(['ngAfterViewInit'], this._options);
        this.drawChart();
    };
    /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    WarpViewImageComponent.prototype.update = /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    function (options, refresh) {
        this.drawChart();
    };
    /**
     * @return {?}
     */
    WarpViewImageComponent.prototype.onResize = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (this.el.nativeElement.parentElement.clientWidth !== this.parentWidth || this.parentWidth <= 0) {
            this.parentWidth = this.el.nativeElement.parentElement.clientWidth;
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout((/**
             * @return {?}
             */
            function () {
                if (_this.el.nativeElement.parentElement.clientWidth > 0) {
                    _this.LOG.debug(['onResize'], _this.el.nativeElement.parentElement.clientWidth);
                    _this.drawChart();
                }
                else {
                    _this.onResize();
                }
            }), 150);
        }
    };
    /**
     * @private
     * @return {?}
     */
    WarpViewImageComponent.prototype.drawChart = /**
     * @private
     * @return {?}
     */
    function () {
        if (!this._data || !this._data.data || this._data.data.length === 0) {
            return;
        }
        this.initChart(this.el);
        this.toDisplay = [];
        /** @type {?} */
        var gts = this._data;
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
    };
    /**
     * @return {?}
     */
    WarpViewImageComponent.prototype.getStyle = /**
     * @return {?}
     */
    function () {
        this.LOG.debug(['getStyle'], this._options);
        if (!this._options) {
            return {};
        }
        else {
            /** @type {?} */
            var style = { 'background-color': this._options.bgColor || 'transparent', width: this.width, height: 'auto' };
            if (this._options.fontColor) {
                style.color = this._options.fontColor;
            }
            this.LOG.debug(['getStyle', 'style'], style);
            return style;
        }
    };
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    WarpViewImageComponent.prototype.convert = /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    function (data) {
        return [];
    };
    WarpViewImageComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-image',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div class=\"chart-container\" id=\"wrapper\" *ngIf=\"toDisplay\">\n    <div *ngFor=\"let img of toDisplay\" [ngStyle]=\"getStyle()\">\n      <img [src]=\"img\" class=\"responsive\" alt=\"Result\"/>\n    </div>\n  </div>\n  <warpview-spinner *ngIf=\"!toDisplay\" message=\"Parsing data\"></warpview-spinner>\n</div>\n",
                    encapsulation: ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host div{height:var(--warp-view-chart-height);width:var(--warp-view-chart-width)}:host .chart-container{width:var(--warp-view-chart-width,100%);height:var(--warp-view-chart-height,100%);position:relative;overflow:hidden}:host .chart-container div{height:99%!important;width:99%;display:block}:host .chart-container div .responsive{width:99%;height:99%;-o-object-fit:scale-down;object-fit:scale-down}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewImageComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: SizeService },
        { type: NgZone }
    ]; };
    WarpViewImageComponent.propDecorators = {
        imageTitle: [{ type: Input, args: ['imageTitle',] }],
        onResize: [{ type: HostListener, args: ['window:resize',] }]
    };
    return WarpViewImageComponent;
}(WarpViewComponent));
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
var MapLib = /** @class */ (function () {
    function MapLib() {
    }
    /**
     * @param {?} data
     * @param {?} hiddenData
     * @param {?=} divider
     * @param {?=} scheme
     * @return {?}
     */
    MapLib.toLeafletMapPaths = /**
     * @param {?} data
     * @param {?} hiddenData
     * @param {?=} divider
     * @param {?=} scheme
     * @return {?}
     */
    function (data, hiddenData, divider, scheme) {
        if (divider === void 0) { divider = 1000; }
        /** @type {?} */
        var paths = [];
        /** @type {?} */
        var size = (data.gts || []).length;
        var _loop_1 = function (i) {
            /** @type {?} */
            var gts = data.gts[i];
            if (GTSLib.isGtsToPlotOnMap(gts) && (hiddenData || []).filter((/**
             * @param {?} id
             * @return {?}
             */
            function (id) { return id === gts.id; })).length === 0) {
                /** @type {?} */
                var path = {};
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
        };
        for (var i = 0; i < size; i++) {
            _loop_1(i);
        }
        return paths;
    };
    /**
     * @param {?} gts
     * @param {?=} divider
     * @return {?}
     */
    MapLib.gtsToPath = /**
     * @param {?} gts
     * @param {?=} divider
     * @return {?}
     */
    function (gts, divider) {
        if (divider === void 0) { divider = 1000; }
        /** @type {?} */
        var path = [];
        /** @type {?} */
        var size = (gts.v || []).length;
        for (var i = 0; i < size; i++) {
            /** @type {?} */
            var v = gts.v[i];
            /** @type {?} */
            var l = v.length;
            if (l >= 4) {
                // timestamp, lat, lon, elev?, value
                path.push({ ts: Math.floor(v[0] / divider), lat: v[1], lon: v[2], val: v[l - 1] });
            }
        }
        return path;
    };
    /**
     * @param {?} data
     * @param {?} hiddenData
     * @param {?=} divider
     * @param {?=} scheme
     * @return {?}
     */
    MapLib.annotationsToLeafletPositions = /**
     * @param {?} data
     * @param {?} hiddenData
     * @param {?=} divider
     * @param {?=} scheme
     * @return {?}
     */
    function (data, hiddenData, divider, scheme) {
        if (divider === void 0) { divider = 1000; }
        /** @type {?} */
        var annotations = [];
        /** @type {?} */
        var size = (data.gts || []).length;
        var _loop_2 = function (i) {
            /** @type {?} */
            var gts = data.gts[i];
            if (GTSLib.isGtsToAnnotate(gts) && (hiddenData || []).filter((/**
             * @param {?} id
             * @return {?}
             */
            function (id) { return id === gts.id; })).length === 0) {
                this_1.LOG.debug(['annotationsToLeafletPositions'], gts);
                /** @type {?} */
                var annotation = {};
                /** @type {?} */
                var params = (data.params || [])[i];
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
                this_1.LOG.debug(['annotationsToLeafletPositions', 'annotations'], annotation);
                annotations.push(annotation);
            }
        };
        var this_1 = this;
        for (var i = 0; i < size; i++) {
            _loop_2(i);
        }
        return annotations;
    };
    /**
     * @private
     * @param {?} obj
     * @param {?} params
     * @param {?} index
     * @param {?} scheme
     * @return {?}
     */
    MapLib.extractCommonParameters = /**
     * @private
     * @param {?} obj
     * @param {?} params
     * @param {?} index
     * @param {?} scheme
     * @return {?}
     */
    function (obj, params, index, scheme) {
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
    };
    /**
     * @private
     * @param {?} posArray
     * @param {?} params
     * @return {?}
     */
    MapLib.validateWeightedDotsPositionArray = /**
     * @private
     * @param {?} posArray
     * @param {?} params
     * @return {?}
     */
    function (posArray, params) {
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
        var step = (posArray.maxValue - posArray.minValue) / posArray.numSteps;
        /** @type {?} */
        var steps = [];
        for (var i = 0; i < posArray.numSteps - 1; i++) {
            steps[i] = posArray.minValue + (i + 1) * step;
        }
        steps[posArray.numSteps - 1] = posArray.maxValue;
        /** @type {?} */
        var size = (posArray || []).length;
        for (var i = 0; i < size; i++) {
            /** @type {?} */
            var pos = posArray[i];
            /** @type {?} */
            var value = pos[2];
            pos[4] = posArray.numSteps - 1;
            for (var k in steps) {
                if (value <= steps[k]) {
                    pos[4] = k;
                    break;
                }
            }
        }
        return true;
    };
    /**
     * @param {?} data
     * @param {?} hiddenData
     * @param {?} scheme
     * @return {?}
     */
    MapLib.toLeafletMapPositionArray = /**
     * @param {?} data
     * @param {?} hiddenData
     * @param {?} scheme
     * @return {?}
     */
    function (data, hiddenData, scheme) {
        /** @type {?} */
        var positions = [];
        /** @type {?} */
        var size = (data.gts || []).length;
        var _loop_3 = function (i) {
            /** @type {?} */
            var gts = data.gts[i];
            if (GTSLib.isPositionArray(gts) && (hiddenData || []).filter((/**
             * @param {?} id
             * @return {?}
             */
            function (id) { return id === gts.id; })).length === 0) {
                this_2.LOG.debug(['toLeafletMapPositionArray'], gts, data.params[i]);
                /** @type {?} */
                var posArray = gts;
                /** @type {?} */
                var params = data.params[i] || {};
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
                this_2.LOG.debug(['toLeafletMapPositionArray', 'posArray'], posArray);
                positions.push(posArray);
            }
        };
        var this_2 = this;
        for (var i = 0; i < size; i++) {
            _loop_3(i);
        }
        return positions;
    };
    /**
     * @private
     * @param {?} posArray
     * @param {?} params
     * @return {?}
     */
    MapLib.validateWeightedColoredDotsPositionArray = /**
     * @private
     * @param {?} posArray
     * @param {?} params
     * @return {?}
     */
    function (posArray, params) {
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
        var re = /^#(?:[0-9a-f]{3}){1,2}$/i;
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
        var step = (posArray.maxColorValue - posArray.minColorValue) / posArray.numColorSteps;
        /** @type {?} */
        var steps = [];
        for (var j = 0; j < posArray.numColorSteps; j++) {
            steps[j] = posArray.minColorValue + (j + 1) * step;
        }
        posArray.steps = steps;
        posArray.positions.forEach((/**
         * @param {?} pos
         * @return {?}
         */
        function (pos) {
            /** @type {?} */
            var colorValue = pos[3];
            pos[5] = posArray.numColorSteps - 1;
            for (var k = 0; k < steps.length - 1; k++) {
                if (colorValue < steps[k]) {
                    pos[5] = k;
                    break;
                }
            }
        }));
    };
    /**
     * @param {?} paths
     * @param {?} positionsData
     * @param {?} annotationsData
     * @param {?} geoJson
     * @return {?}
     */
    MapLib.getBoundsArray = /**
     * @param {?} paths
     * @param {?} positionsData
     * @param {?} annotationsData
     * @param {?} geoJson
     * @return {?}
     */
    function (paths, positionsData, annotationsData, geoJson) {
        /** @type {?} */
        var pointsArray = [];
        /** @type {?} */
        var size;
        this.LOG.debug(['getBoundsArray', 'paths'], paths);
        size = (paths || []).length;
        for (var i = 0; i < size; i++) {
            /** @type {?} */
            var path = paths[i];
            /** @type {?} */
            var s = (path.path || []).length;
            for (var j = 0; j < s; j++) {
                /** @type {?} */
                var p = path.path[j];
                pointsArray.push([p.lat, p.lon]);
            }
        }
        this.LOG.debug(['getBoundsArray', 'positionsData'], positionsData);
        size = (positionsData || []).length;
        for (var i = 0; i < size; i++) {
            /** @type {?} */
            var position = positionsData[i];
            /** @type {?} */
            var s = (position.positions || []).length;
            for (var j = 0; j < s; j++) {
                /** @type {?} */
                var p = position.positions[j];
                pointsArray.push([p[0], p[1]]);
            }
        }
        this.LOG.debug(['getBoundsArray', 'annotationsData'], annotationsData);
        size = (annotationsData || []).length;
        for (var i = 0; i < size; i++) {
            /** @type {?} */
            var annotation = annotationsData[i];
            /** @type {?} */
            var s = (annotation.path || []).length;
            for (var j = 0; j < s; j++) {
                /** @type {?} */
                var p = annotation.path[j];
                pointsArray.push([p.lat, p.lon]);
            }
        }
        size = (geoJson || []).length;
        for (var i = 0; i < size; i++) {
            /** @type {?} */
            var g = geoJson[i];
            switch (g.geometry.type) {
                case 'MultiPolygon':
                    g.geometry.coordinates.forEach((/**
                     * @param {?} c
                     * @return {?}
                     */
                    function (c) { return c.forEach((/**
                     * @param {?} m
                     * @return {?}
                     */
                    function (m) { return m.forEach((/**
                     * @param {?} p
                     * @return {?}
                     */
                    function (p) { return pointsArray.push([p[1], p[0]]); })); })); }));
                    break;
                case 'Polygon':
                    g.geometry.coordinates.forEach((/**
                     * @param {?} c
                     * @return {?}
                     */
                    function (c) { return c.forEach((/**
                     * @param {?} p
                     * @return {?}
                     */
                    function (p) { return pointsArray.push([p[1], p[0]]); })); }));
                    break;
                case 'LineString':
                    g.geometry.coordinates.forEach((/**
                     * @param {?} p
                     * @return {?}
                     */
                    function (p) { return pointsArray.push([p[1], p[0]]); }));
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
        var south = 90;
        /** @type {?} */
        var west = -180;
        /** @type {?} */
        var north = -90;
        /** @type {?} */
        var east = 180;
        this.LOG.debug(['getBoundsArray'], pointsArray);
        size = (pointsArray || []).length;
        for (var i = 0; i < size; i++) {
            /** @type {?} */
            var point = pointsArray[i];
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
    };
    /**
     * @param {?} pathData
     * @param {?} options
     * @return {?}
     */
    MapLib.pathDataToLeaflet = /**
     * @param {?} pathData
     * @param {?} options
     * @return {?}
     */
    function (pathData, options) {
        /** @type {?} */
        var path = [];
        /** @type {?} */
        var firstIndex = ((options === undefined) ||
            (options.from === undefined) ||
            (options.from < 0)) ? 0 : options.from;
        /** @type {?} */
        var lastIndex = ((options === undefined) || (options.to === undefined) || (options.to >= pathData.length)) ?
            pathData.length - 1 : options.to;
        for (var i = firstIndex; i <= lastIndex; i++) {
            path.push([pathData[i].lat, pathData[i].lon]);
        }
        return path;
    };
    /**
     * @param {?} data
     * @return {?}
     */
    MapLib.toGeoJSON = /**
     * @param {?} data
     * @return {?}
     */
    function (data) {
        /** @type {?} */
        var defShapes = ['Point', 'LineString', 'Polygon', 'MultiPolygon'];
        /** @type {?} */
        var geoJsons = [];
        data.gts.forEach((/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            if (d.type && d.type === 'Feature' && d.geometry && d.geometry.type && defShapes.indexOf(d.geometry.type) > -1) {
                geoJsons.push(d);
            }
            else if (d.type && defShapes.indexOf(d.type) > -1) {
                geoJsons.push({ type: 'Feature', geometry: d });
            }
        }));
        return geoJsons;
    };
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
            attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors, Tiles\n style by <a href=\"https://www.hotosm.org/\" target=\"_blank\">Humanitarian OpenStreetMap Team</a> hosted by\n <a href=\"https://openstreetmap.fr/\" target=\"_blank\">OpenStreetMap France</a>"
        },
        TOPO: {
            link: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
            attribution: "Map data: &copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors,\n <a href=\"http://viewfinderpanoramas.org\">SRTM</a> | Map style: &copy; <a href=\"https://opentopomap.org\">OpenTopoMap</a>\n  (<a href=\"https://creativecommons.org/licenses/by-sa/3.0/\">CC-BY-SA</a>)"
        },
        TOPO2: {
            link: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
            attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN,\n       GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community"
        },
        SURFER: {
            link: 'https://maps.heigit.org/openmapsurfer/tiles/roads/webmercator/{z}/{x}/{y}.png',
            attribution: "Imagery from <a href=\"http://giscience.uni-hd.de/\">GIScience Research Group @ University of\n Heidelberg</a> | Map data &copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors"
        },
        HYDRA: {
            link: 'https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png',
            attribution: "Tiles courtesy of <a href=\"http://openstreetmap.se/\" target=\"_blank\">OpenStreetMap Sweden</a>\n &mdash; Map data &copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors"
        },
        HYDRA2: {
            link: 'https://{s}.tile.openstreetmap.se/hydda/base/{z}/{x}/{y}.png',
            attribution: "Tiles courtesy of <a href=\"http://openstreetmap.se/\" target=\"_blank\">OpenStreetMap Sweden</a>\n &mdash; Map data &copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors"
        },
        TONER: {
            link: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png',
            attribution: "Map tiles by <a href=\"http://stamen.com\">Stamen Design</a>,\n <a href=\"http://creativecommons.org/licenses/by/3.0\">CC BY 3.0</a> &mdash; Map data &copy;\n  <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
            subdomains: 'abcd'
        },
        TONER_LITE: {
            link: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.png',
            attribution: "Map tiles by <a href=\"http://stamen.com\">Stamen Design</a>,\n <a href=\"http://creativecommons.org/licenses/by/3.0\">CC BY 3.0</a> &mdash; Map data &copy;\n  <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
            subdomains: 'abcd',
        },
        TERRAIN: {
            link: 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png',
            attribution: "Map tiles by <a href=\"http://stamen.com\">Stamen Design</a>,\n <a href=\"http://creativecommons.org/licenses/by/3.0\">CC BY 3.0</a> &mdash; Map data &copy;\n <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
            subdomains: 'abcd',
        },
        ESRI: {
            link: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
            attribution: "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan,\n METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
        },
        SATELLITE: {
            link: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN,\n IGP, UPR-EGP, and the GIS User Community"
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
            attribution: "Map tiles by <a href=\"http://stamen.com\">Stamen Design</a>,\n <a href=\"http://creativecommons.org/licenses/by/3.0\">CC BY 3.0</a> &mdash; Map data &copy;\n  <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
            subdomains: 'abcd',
        },
        CARTODB: {
            link: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
            attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors &copy;\n <a href=\"https://carto.com/attributions\">CartoDB</a>",
            subdomains: 'abcd',
        },
        CARTODB_DARK: {
            link: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
            attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors &copy;\n <a href=\"https://carto.com/attributions\">CartoDB</a>",
            subdomains: 'abcd',
        },
    };
    return MapLib;
}());
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
var WarpViewMapComponent = /** @class */ (function () {
    function WarpViewMapComponent(el, sizeService, renderer) {
        var _this = this;
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
        function () {
            if (_this._map) {
                _this.resizeMe();
            }
        }));
    }
    Object.defineProperty(WarpViewMapComponent.prototype, "debug", {
        get: /**
         * @return {?}
         */
        function () {
            return this._debug;
        },
        set: /**
         * @param {?} debug
         * @return {?}
         */
        function (debug) {
            this._debug = debug;
            this.LOG.setDebug(debug);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarpViewMapComponent.prototype, "options", {
        set: /**
         * @param {?} options
         * @return {?}
         */
        function (options) {
            this.LOG.debug(['onOptions'], options);
            if (!deepEqual(this._options, options)) {
                /** @type {?} */
                var reZoom = options.map.startZoom !== this._options.map.startZoom
                    || options.map.startLat !== this._options.map.startLat
                    || options.map.startLong !== this._options.map.startLong;
                this._options = options;
                this.divider = GTSLib.getDivider(this._options.timeUnit);
                this.drawMap(reZoom);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarpViewMapComponent.prototype, "data", {
        get: /**
         * @return {?}
         */
        function () {
            return this._data;
        },
        set: /**
         * @param {?} data
         * @return {?}
         */
        function (data) {
            this.LOG.debug(['onData'], data);
            this.currentValuesMarkers = [];
            this.annotationsMarkers = [];
            this.positionArraysMarkers = [];
            if (!!data) {
                this._data = data;
                this.drawMap(true);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarpViewMapComponent.prototype, "hiddenData", {
        get: /**
         * @return {?}
         */
        function () {
            return this._hiddenData;
        },
        set: /**
         * @param {?} hiddenData
         * @return {?}
         */
        function (hiddenData) {
            this._hiddenData = hiddenData;
            this.drawMap(false);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    WarpViewMapComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this._options = (/** @type {?} */ (ChartLib.mergeDeep(this._options, this.defOptions)));
    };
    /**
     * @return {?}
     */
    WarpViewMapComponent.prototype.resizeMe = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.LOG.debug(['resizeMe'], this.wrapper.nativeElement.parentElement.getBoundingClientRect());
        /** @type {?} */
        var height = this.wrapper.nativeElement.parentElement.getBoundingClientRect().height;
        /** @type {?} */
        var width = this.wrapper.nativeElement.parentElement.getBoundingClientRect().width;
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
            function () { return _this._map.invalidateSize(); }));
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    WarpViewMapComponent.prototype.heatRadiusDidChange = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this._heatLayer.setOptions({ radius: event.detail.valueAsNumber });
        this.LOG.debug(['heatRadiusDidChange'], event.detail.valueAsNumber);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    WarpViewMapComponent.prototype.heatBlurDidChange = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this._heatLayer.setOptions({ blur: event.detail.valueAsNumber });
        this.LOG.debug(['heatBlurDidChange'], event.detail.valueAsNumber);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    WarpViewMapComponent.prototype.heatOpacityDidChange = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        /** @type {?} */
        var minOpacity = event.detail.valueAsNumber / 100;
        this._heatLayer.setOptions({ minOpacity: minOpacity });
        this.LOG.debug(['heatOpacityDidChange'], event.detail.valueAsNumber);
    };
    /**
     * @private
     * @param {?} reZoom
     * @return {?}
     */
    WarpViewMapComponent.prototype.drawMap = /**
     * @private
     * @param {?} reZoom
     * @return {?}
     */
    function (reZoom) {
        this.LOG.debug(['drawMap'], this._data);
        this._options = ChartLib.mergeDeep(this._options, this.defOptions);
        this.timeStart = this._options.map.timeStart;
        moment__default.tz.setDefault(this._options.timeZone);
        /** @type {?} */
        var gts = this._data;
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
        var dataList;
        /** @type {?} */
        var params;
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
        var flattenGTS = GTSLib.flatDeep(dataList);
        /** @type {?} */
        var size = flattenGTS.length;
        for (var i = 0; i < size; i++) {
            /** @type {?} */
            var item = flattenGTS[i];
            if (item.v) {
                Timsort.sort(item.v, (/**
                 * @param {?} a
                 * @param {?} b
                 * @return {?}
                 */
                function (a, b) { return a[0] - b[0]; }));
                item.i = i;
                i++;
            }
        }
        this.LOG.debug(['GTSLib.flatDeep(dataList)'], flattenGTS);
        this.displayMap({ gts: flattenGTS, params: params }, reZoom);
    };
    /**
     * @private
     * @param {?} color
     * @param {?=} marker
     * @return {?}
     */
    WarpViewMapComponent.prototype.icon = /**
     * @private
     * @param {?} color
     * @param {?=} marker
     * @return {?}
     */
    function (color, marker) {
        if (marker === void 0) { marker = ''; }
        /** @type {?} */
        var c = "" + color.slice(1);
        /** @type {?} */
        var m = marker !== '' ? marker : 'circle';
        return Leaflet.icon({
            iconUrl: "https://cdn.mapmarker.io/api/v1/font-awesome/v4/pin?icon=fa-" + m + "&iconSize=17&size=40&hoffset=" + (m === 'circle' ? 0 : -1) + "&voffset=-4&color=fff&background=" + c,
            iconAnchor: this._iconAnchor,
            popupAnchor: this._popupAnchor
        });
    };
    /**
     * @private
     * @return {?}
     */
    WarpViewMapComponent.prototype.patchMapTileGapBug = /**
     * @private
     * @return {?}
     */
    function () {
        // Workaround for 1px lines appearing in some browsers due to fractional transforms
        // and resulting anti-aliasing. adapted from @cmulders' solution:
        // https://github.com/Leaflet/Leaflet/issues/3575#issuecomment-150544739
        // @ts-ignore
        /** @type {?} */
        var originalInitTile = Leaflet.GridLayer.prototype._initTile;
        if (originalInitTile.isPatched) {
            return;
        }
        Leaflet.GridLayer.include({
            _initTile: /**
             * @param {?} tile
             * @return {?}
             */
            function (tile) {
                originalInitTile.call(this, tile);
                /** @type {?} */
                var tileSize = this.getTileSize();
                tile.style.width = tileSize.x + 1.5 + 'px';
                tile.style.height = tileSize.y + 1 + 'px';
            }
        });
        // @ts-ignore
        Leaflet.GridLayer.prototype._initTile.isPatched = true;
    };
    /**
     * @private
     * @param {?} data
     * @param {?=} reDraw
     * @return {?}
     */
    WarpViewMapComponent.prototype.displayMap = /**
     * @private
     * @param {?} data
     * @param {?=} reDraw
     * @return {?}
     */
    function (data, reDraw) {
        var _this = this;
        if (reDraw === void 0) { reDraw = false; }
        this.currentValuesMarkers = [];
        this.LOG.debug(['drawMap'], data, this._options, this._hiddenData || []);
        if (!this.lowerTimeBound) {
            this.lowerTimeBound = this._options.map.timeSliderMin / this.divider;
            this.upperTimeBound = this._options.map.timeSliderMax / this.divider;
        }
        /** @type {?} */
        var height = this.height || ChartLib.DEFAULT_HEIGHT;
        /** @type {?} */
        var width = this.width || ChartLib.DEFAULT_WIDTH;
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
            var map = MapLib.mapTypes[this._options.map.mapType || 'DEFAULT'];
            /** @type {?} */
            var mapOpts = {
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
            function () { return _this.LOG.debug(['displayMap', 'load'], _this._map.getCenter().lng, _this.currentLong, _this._map.getZoom()); }));
            this._map.on('zoomend', (/**
             * @return {?}
             */
            function () {
                if (!_this.firstDraw) {
                    _this.LOG.debug(['moveend'], _this._map.getCenter());
                    _this.currentZoom = _this._map.getZoom();
                }
            }));
            this._map.on('moveend', (/**
             * @return {?}
             */
            function () {
                if (!_this.firstDraw) {
                    _this.LOG.debug(['moveend'], _this._map.getCenter());
                    _this.currentLat = _this._map.getCenter().lat;
                    _this.currentLong = _this._map.getCenter().lng;
                }
            }));
        }
        /** @type {?} */
        var size = (this.pathData || []).length;
        this.LOG.debug(['displayMap'], 'build map done', size);
        for (var i = 0; i < size; i++) {
            /** @type {?} */
            var d = this.pathData[i];
            if (!!d) {
                /** @type {?} */
                var plottedGts = this.updateGtsPath(d);
                if (!!plottedGts) {
                    this.currentValuesMarkers.push(plottedGts.beforeCurrentValue);
                    this.currentValuesMarkers.push(plottedGts.afterCurrentValue);
                    this.currentValuesMarkers.push(plottedGts.currentValue);
                }
            }
        }
        this.LOG.debug(['displayMap'], 'this.pathData', this.pathData);
        size = (this.annotationsData || []).length;
        for (var i = 0; i < size; i++) {
            /** @type {?} */
            var d = this.annotationsData[i];
            /** @type {?} */
            var plottedGts = this.updateGtsPath(d);
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
        for (var i = 0; i < size; i++) {
            /** @type {?} */
            var d = this.positionData[i];
            this.positionArraysMarkers = this.positionArraysMarkers.concat(this.updatePositionArray(d));
        }
        this.LOG.debug(['displayMap'], 'this.po sitionData');
        size = (this.annotationsData || []).length;
        for (var i = 0; i < size; i++) {
            /** @type {?} */
            var d = this.annotationsData[i];
            this.positionArraysMarkers = this.positionArraysMarkers.concat(this.updateAnnotation(d));
        }
        this.LOG.debug(['displayMap'], 'this.annotationsData');
        (this._options.map.tiles || []).forEach((/**
         * @param {?} t
         * @return {?}
         */
        function (t) {
            _this.LOG.debug(['displayMap'], t);
            if (_this._options.map.showTimeRange) {
                _this.tileLayerGroup.addLayer(Leaflet.tileLayer(t
                    .replace('{start}', moment__default(_this.timeStart).toISOString())
                    .replace('{end}', moment__default(_this.timeEnd).toISOString()), {
                    subdomains: 'abcd',
                    maxNativeZoom: 19,
                    maxZoom: 40
                }));
            }
            else {
                _this.tileLayerGroup.addLayer(Leaflet.tileLayer(t, {
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
        for (var i = 0; i < size; i++) {
            /** @type {?} */
            var m = this.positionArraysMarkers[i];
            m.addTo(this.positionDataLayer);
        }
        size = (this.annotationsMarkers || []).length;
        for (var i = 0; i < size; i++) {
            /** @type {?} */
            var m = this.annotationsMarkers[i];
            m.addTo(this.annotationsDataLayer);
        }
        this.LOG.debug(['displayMap', 'geoJson'], this.geoJson);
        size = (this.geoJson || []).length;
        var _loop_1 = function (i) {
            /** @type {?} */
            var m = this_1.geoJson[i];
            /** @type {?} */
            var color = ColorLib.getColor(i, this_1._options.scheme);
            /** @type {?} */
            var opts = (/** @type {?} */ ({
                style: (/**
                 * @return {?}
                 */
                function () { return ({
                    color: (data.params && data.params[i]) ? data.params[i].color || color : color,
                    fillColor: (data.params && data.params[i])
                        ? ColorLib.transparentize(data.params[i].fillColor || color)
                        : ColorLib.transparentize(color),
                }); })
            }));
            if (m.geometry.type === 'Point') {
                opts.pointToLayer = (/**
                 * @param {?} geoJsonPoint
                 * @param {?} latlng
                 * @return {?}
                 */
                function (geoJsonPoint, latlng) { return Leaflet.marker(latlng, {
                    icon: _this.icon(color, (data.params && data.params[i]) ? data.params[i].marker : 'circle'),
                    opacity: 1,
                }); });
            }
            /** @type {?} */
            var display = '';
            /** @type {?} */
            var geoShape = Leaflet.geoJSON(m, opts);
            if (m.properties) {
                Object.keys(m.properties).forEach((/**
                 * @param {?} k
                 * @return {?}
                 */
                function (k) { return display += "<b>" + k + "</b>: " + m.properties[k] + "<br />"; }));
                geoShape.bindPopup(display);
            }
            geoShape.addTo(this_1.geoJsonLayer);
        };
        var this_1 = this;
        for (var i = 0; i < size; i++) {
            _loop_1(i);
        }
        if (this.pathData.length > 0 || this.positionData.length > 0 || this.annotationsData.length > 0 || this.geoJson.length > 0) {
            // Fit map to curves
            /** @type {?} */
            var group = Leaflet.featureGroup([this.geoJsonLayer, this.annotationsDataLayer, this.positionDataLayer, this.pathDataLayer]);
            this.LOG.debug(['displayMap', 'setView'], 'fitBounds', group.getBounds());
            this.LOG.debug(['displayMap', 'setView'], { lat: this.currentLat, lng: this.currentLong }, {
                lat: this._options.map.startLat,
                lng: this._options.map.startLong
            });
            this.bounds = group.getBounds();
            setTimeout((/**
             * @return {?}
             */
            function () {
                if (!!_this.bounds && _this.bounds.isValid()) {
                    if ((_this.currentLat || _this._options.map.startLat) && (_this.currentLong || _this._options.map.startLong)) {
                        _this._map.setView({
                            lat: _this.currentLat || _this._options.map.startLat || 0,
                            lng: _this.currentLong || _this._options.map.startLong || 0
                        }, _this.currentZoom || _this._options.map.startZoom || 10, { animate: false, duration: 500 });
                    }
                    else {
                        _this._map.fitBounds(_this.bounds, { padding: [1, 1], animate: false, duration: 0 });
                        //   this.currentZoom = this._map.getBoundsZoom(this.bounds, false);
                    }
                    _this.currentLat = _this._map.getCenter().lat;
                    _this.currentLong = _this._map.getCenter().lng;
                    //  this.currentZoom = this._map.getZoom();
                }
                else {
                    _this.LOG.debug(['displayMap', 'setView'], { lat: _this.currentLat, lng: _this.currentLong });
                    _this._map.setView({
                        lat: _this.currentLat || _this._options.map.startLat || 0,
                        lng: _this.currentLong || _this._options.map.startLong || 0
                    }, _this.currentZoom || _this._options.map.startZoom || 10, {
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
    };
    /**
     * @param {?} gts
     * @return {?}
     */
    WarpViewMapComponent.prototype.updateAnnotation = /**
     * @param {?} gts
     * @return {?}
     */
    function (gts) {
        /** @type {?} */
        var positions = [];
        /** @type {?} */
        var icon;
        /** @type {?} */
        var size;
        switch (gts.render) {
            case 'marker':
                icon = this.icon(gts.color, gts.marker);
                size = (gts.path || []).length;
                for (var i = 0; i < size; i++) {
                    /** @type {?} */
                    var g = gts.path[i];
                    /** @type {?} */
                    var marker = Leaflet.marker(g, { icon: icon, opacity: 1 });
                    marker.bindPopup(g.val.toString());
                    positions.push(marker);
                }
                break;
            case 'weightedDots':
                size = (gts.path || []).length;
                for (var i = 0; i < size; i++) {
                    /** @type {?} */
                    var p = gts.path[i];
                    if ((this._hiddenData || []).filter((/**
                     * @param {?} h
                     * @return {?}
                     */
                    function (h) { return h === gts.key; })).length === 0) {
                        /** @type {?} */
                        var v = parseInt(p.val, 10);
                        if (isNaN(v)) {
                            v = 0;
                        }
                        /** @type {?} */
                        var radius = (v - (gts.minValue || 0)) * 50 / (gts.maxValue || 50);
                        /** @type {?} */
                        var marker = Leaflet.circleMarker(p, {
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
                for (var i = 0; i < size; i++) {
                    /** @type {?} */
                    var g = gts.path[i];
                    /** @type {?} */
                    var marker = Leaflet.circleMarker(g, {
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
    };
    /**
     * @private
     * @param {?} gts
     * @return {?}
     */
    WarpViewMapComponent.prototype.updateGtsPath = /**
     * @private
     * @param {?} gts
     * @return {?}
     */
    function (gts) {
        /** @type {?} */
        var beforeCurrentValue = Leaflet.polyline(MapLib.pathDataToLeaflet(gts.path, { to: 0 }), {
            color: gts.color,
            opacity: 1,
        });
        /** @type {?} */
        var afterCurrentValue = Leaflet.polyline(MapLib.pathDataToLeaflet(gts.path, { from: 0 }), {
            color: gts.color,
            opacity: 0.7,
        });
        /** @type {?} */
        var currentValue;
        // Let's verify we have a path... No path, no marker
        /** @type {?} */
        var size = (gts.path || []).length;
        for (var i = 0; i < size; i++) {
            /** @type {?} */
            var p = gts.path[i];
            /** @type {?} */
            var date = void 0;
            if (this._options.timeMode && this._options.timeMode === 'timestamp') {
                date = parseInt(p.ts, 10);
            }
            else {
                date = (moment__default(parseInt(p.ts, 10))
                    .utc(true).toISOString() || '')
                    .replace('Z', this._options.timeZone === 'UTC' ? 'Z' : '');
            }
            currentValue = Leaflet.circleMarker([p.lat, p.lon], { radius: MapLib.BASE_RADIUS, color: gts.color, fillColor: gts.color, fillOpacity: 0.7 })
                .bindPopup("<p>" + date + "</p><p><b>" + gts.key + "</b>: " + p.val.toString() + "</p>");
        }
        if (size > 0) {
            return {
                beforeCurrentValue: beforeCurrentValue,
                afterCurrentValue: afterCurrentValue,
                currentValue: currentValue,
            };
        }
        else {
            return undefined;
        }
    };
    /**
     * @private
     * @param {?} positionData
     * @param {?} value
     * @param {?} marker
     * @return {?}
     */
    WarpViewMapComponent.prototype.addPopup = /**
     * @private
     * @param {?} positionData
     * @param {?} value
     * @param {?} marker
     * @return {?}
     */
    function (positionData, value, marker) {
        if (!!positionData) {
            /** @type {?} */
            var content_1 = '';
            if (positionData.key) {
                content_1 = "<p><b>" + positionData.key + "</b>: " + (value || 'na') + "</p>";
            }
            Object.keys(positionData.properties || []).forEach((/**
             * @param {?} k
             * @return {?}
             */
            function (k) { return content_1 += "<b>" + k + "</b>: " + positionData.properties[k] + "<br />"; }));
            marker.bindPopup(content_1);
        }
    };
    /**
     * @private
     * @param {?} positionData
     * @return {?}
     */
    WarpViewMapComponent.prototype.updatePositionArray = /**
     * @private
     * @param {?} positionData
     * @return {?}
     */
    function (positionData) {
        /** @type {?} */
        var positions = [];
        /** @type {?} */
        var polyline;
        /** @type {?} */
        var icon;
        /** @type {?} */
        var result;
        /** @type {?} */
        var inStep;
        /** @type {?} */
        var size;
        this.LOG.debug(['updatePositionArray'], positionData);
        switch (positionData.render) {
            case 'path':
                polyline = Leaflet.polyline(positionData.positions, { color: positionData.color, opacity: 1 });
                positions.push(polyline);
                break;
            case 'marker':
                icon = this.icon(positionData.color, positionData.marker);
                size = (positionData.positions || []).length;
                for (var i = 0; i < size; i++) {
                    /** @type {?} */
                    var p = positionData.positions[i];
                    if ((this.hiddenData || []).filter((/**
                     * @param {?} h
                     * @return {?}
                     */
                    function (h) { return h === positionData.key; })).length === 0) {
                        /** @type {?} */
                        var marker = Leaflet.marker({ lat: p[0], lng: p[1] }, { icon: icon, opacity: 1 });
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
                for (var j = 0; j < positionData.numColorSteps; j++) {
                    result[j] = 0;
                    inStep[j] = 0;
                }
                size = (positionData.positions || []).length;
                for (var i = 0; i < size; i++) {
                    /** @type {?} */
                    var p = positionData.positions[i];
                    if ((this._hiddenData || []).filter((/**
                     * @param {?} h
                     * @return {?}
                     */
                    function (h) { return h === positionData.key; })).length === 0) {
                        this.LOG.debug(['updatePositionArray', 'coloredWeightedDots', 'radius'], positionData.baseRadius * p[4]);
                        /** @type {?} */
                        var marker = Leaflet.circleMarker({ lat: p[0], lng: p[1] }, {
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
                for (var i = 0; i < size; i++) {
                    /** @type {?} */
                    var p = positionData.positions[i];
                    if ((this._hiddenData || []).filter((/**
                     * @param {?} h
                     * @return {?}
                     */
                    function (h) { return h === positionData.key; })).length === 0) {
                        /** @type {?} */
                        var marker = Leaflet.circleMarker({ lat: p[0], lng: p[1] }, {
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
                for (var i = 0; i < size; i++) {
                    /** @type {?} */
                    var p = positionData.positions[i];
                    if ((this._hiddenData || []).filter((/**
                     * @param {?} h
                     * @return {?}
                     */
                    function (h) { return h === positionData.key; })).length === 0) {
                        /** @type {?} */
                        var marker = Leaflet.circleMarker({ lat: p[0], lng: p[1] }, {
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
    };
    /**
     * @return {?}
     */
    WarpViewMapComponent.prototype.resize = /**
     * @return {?}
     */
    function () {
        var _this = this;
        return new Promise((/**
         * @param {?} resolve
         * @return {?}
         */
        function (resolve) {
            _this.resizeMe();
            resolve(true);
        }));
    };
    /**
     * @param {?} event
     * @return {?}
     */
    WarpViewMapComponent.prototype.onRangeSliderChange = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.LOG.debug(['onRangeSliderChange'], event);
        this.timeStart = event.value || moment__default().valueOf();
        this.timeEnd = event.highValue || moment__default().valueOf();
        this.drawMap(true);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    WarpViewMapComponent.prototype.onRangeSliderWindowChange = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.LOG.debug(['onRangeSliderWindowChange'], event);
        if (this.lowerTimeBound !== event.min || this.upperTimeBound !== event.max) {
            this.lowerTimeBound = event.min;
            this.upperTimeBound = event.max;
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    WarpViewMapComponent.prototype.onSliderChange = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
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
    };
    /**
     * @param {?} event
     * @return {?}
     */
    WarpViewMapComponent.prototype.updateTimeSpan = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.LOG.debug(['updateTimeSpan'], event.target.value);
        if (this.timeSpan !== event.target.value) {
            this.timeSpan = event.target.value;
            this.timeStart = (this.timeEnd || moment__default().valueOf()) - this.timeSpan / this.divider;
            this.drawMap(true);
        }
    };
    WarpViewMapComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-map',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"wrapper\" #wrapper (resized)=\"resizeMe()\">\n  <div class=\"map-container\">\n    <div #mapDiv></div>\n    <div *ngIf=\"_options.map.showTimeSlider && !_options.map.showTimeRange\" #timeSlider>\n      <warpview-slider\n        [min]=\"_options.map.timeSliderMin / divider\" [max]=\"_options.map.timeSliderMax / divider\"\n        [value]=\"minTimeValue / divider\"\n        [step]=\"_options.map.timeSliderStep\" [mode]=\"_options.map.timeSliderMode\"\n        (change)=\"onSliderChange($event)\"\n        [debug]=\"debug\"\n      ></warpview-slider>\n    </div>\n    <div *ngIf=\"_options.map.showTimeSlider && _options.map.showTimeRange\" #timeRangeSlider>\n      <!--    <warpview-range-slider *ngIf=\"!_options.map.timeSpan && lowerTimeBound\"\n                                  [min]=\"lowerTimeBound\" [max]=\"upperTimeBound\"\n                                  [minValue]=\"minTimeValue / divider\"\n                                  [maxValue]=\"maxTimeValue / divider\"\n                                  [step]=\"_options.map.timeSliderStep\"\n                                  [mode]=\"_options.map.timeSliderMode\"\n                                  [debug]=\"_debug\"\n                                  (change)=\"onRangeSliderChange($event)\"\n           ></warpview-range-slider>-->\n\n      <warpview-range-slider\n        [min]=\"(_options.map.timeSliderMin / divider)\" [max]=\"(_options.map.timeSliderMax / divider)\"\n        [minValue]=\"minTimeValue / divider\"\n        [maxValue]=\"maxTimeValue / divider\"\n        [mode]=\"_options.map.timeSliderMode\"\n        [debug]=\"debug\"\n        (change)=\"onRangeSliderWindowChange($event)\"\n      ></warpview-range-slider>\n      <warpview-slider *ngIf=\"_options.map.timeSpan && lowerTimeBound\"\n                       [min]=\"lowerTimeBound\" [max]=\"upperTimeBound\"\n                       [step]=\"(this.timeSpan || this._options.map.timeSpan) / divider\"\n                       [mode]=\"_options.map.timeSliderMode\"\n                       [debug]=\"debug\"\n                       (change)=\"onSliderChange($event)\"\n      ></warpview-slider>\n      <div *ngIf=\"_options.map?.timeSpan\">\n        <label for=\"timeSpan\">Timespan: </label>\n        <select id=\"timeSpan\" (change)=\"updateTimeSpan($event)\">\n          <option *ngFor=\"let ts of _options.map.timeSpanList\" [value]=\"ts.value\">{{ts.label}}</option>\n        </select>\n      </div>\n    </div>\n    <warpview-heatmap-sliders\n      *ngIf=\"_options.map.heatControls\"\n      (heatRadiusDidChange)=\"heatRadiusDidChange($event)\"\n      (heatBlurDidChange)=\"heatBlurDidChange($event)\"\n      (heatOpacityDidChange)=\"heatOpacityDidChange($event)\"\n    ></warpview-heatmap-sliders>\n  </div>\n\n</div>\n",
                    encapsulation: ViewEncapsulation.None,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host,warp-view-map,warpview-map{width:100%;height:100%;min-height:100px}:host div.wrapper,warp-view-map div.wrapper,warpview-map div.wrapper{width:100%;height:100%;min-height:100px;padding:var(--warp-view-map-margin);overflow:hidden}:host div.wrapper div.leaflet-container,:host div.wrapper div.map-container,warp-view-map div.wrapper div.leaflet-container,warp-view-map div.wrapper div.map-container,warpview-map div.wrapper div.leaflet-container,warpview-map div.wrapper div.map-container{min-width:100%;min-height:100px;width:100%;height:100%;position:relative;overflow:hidden}:host div.wrapper .leaflet-container,warp-view-map div.wrapper .leaflet-container,warpview-map div.wrapper .leaflet-container{min-width:100%;min-height:100%;width:100%;height:100%}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewMapComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: SizeService },
        { type: Renderer2 }
    ]; };
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
    return WarpViewMapComponent;
}());
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
var WarpViewHeatmapSlidersComponent = /** @class */ (function () {
    function WarpViewHeatmapSlidersComponent() {
        this.heatRadiusDidChange = new EventEmitter();
        this.heatBlurDidChange = new EventEmitter();
        this.heatOpacityDidChange = new EventEmitter();
    }
    /**
     * @param {?} value
     * @return {?}
     */
    WarpViewHeatmapSlidersComponent.prototype.radiusChanged = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        this.heatRadiusDidChange.emit(value);
    };
    /**
     * @param {?} value
     * @return {?}
     */
    WarpViewHeatmapSlidersComponent.prototype.blurChanged = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        this.heatBlurDidChange.emit(value);
    };
    /**
     * @param {?} value
     * @return {?}
     */
    WarpViewHeatmapSlidersComponent.prototype.opacityChanged = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        this.heatOpacityDidChange.emit(value);
    };
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
    return WarpViewHeatmapSlidersComponent;
}());
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
var WarpViewPieComponent = /** @class */ (function (_super) {
    __extends(WarpViewPieComponent, _super);
    function WarpViewPieComponent(el, renderer, sizeService, ngZone) {
        var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
        _this.el = el;
        _this.renderer = renderer;
        _this.sizeService = sizeService;
        _this.ngZone = ngZone;
        _this.chartDraw = new EventEmitter();
        _this._type = 'pie';
        _this.layout = {
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
        _this.LOG = new Logger(WarpViewPieComponent, _this._debug);
        return _this;
    }
    Object.defineProperty(WarpViewPieComponent.prototype, "type", {
        set: /**
         * @param {?} type
         * @return {?}
         */
        function (type) {
            this._type = type;
            this.drawChart();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    WarpViewPieComponent.prototype.update = /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    function (options, refresh) {
        this.LOG.debug(['onOptions', 'before'], this._options, options);
        if (!deepEqual(options, this._options)) {
            this.LOG.debug(['options', 'changed'], options);
            this._options = (/** @type {?} */ (ChartLib.mergeDeep(this._options, (/** @type {?} */ (options)))));
        }
        this.drawChart();
    };
    /**
     * @return {?}
     */
    WarpViewPieComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this._options = this._options || this.defOptions;
    };
    /**
     * @return {?}
     */
    WarpViewPieComponent.prototype.drawChart = /**
     * @return {?}
     */
    function () {
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
    };
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    WarpViewPieComponent.prototype.convert = /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    function (data) {
        var _this = this;
        /** @type {?} */
        var gtsList = (/** @type {?} */ (data.data));
        /** @type {?} */
        var plotData = (/** @type {?} */ ([]));
        this.LOG.debug(['convert', 'gtsList'], gtsList);
        /** @type {?} */
        var pieData = (/** @type {?} */ ({
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
        function (d, i) {
            if (!GTSLib.isGts(d)) {
                /** @type {?} */
                var c = ColorLib.getColor(i, _this._options.scheme);
                /** @type {?} */
                var color = ((data.params || [])[i] || { datasetColor: c }).datasetColor || c;
                pieData.values.push(d[1]);
                pieData.labels.push(d[0]);
                pieData.marker.colors.push(ColorLib.transparentize(color));
                pieData.marker.line.color.push(color);
                if (_this._type === 'donut') {
                    pieData.hole = 0.5;
                }
                if (_this.unit) {
                    pieData.title = {
                        text: _this.unit
                    };
                }
            }
        }));
        if (pieData.values.length > 0) {
            plotData.push(pieData);
        }
        this.noData = plotData.length === 0;
        return plotData;
    };
    WarpViewPieComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-pie',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\" #chartContainer>\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display or wrong data format.</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-plotly #graph *ngIf=\"plotlyData?.length > 0\"\n                     [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot()\"\n                     (relayout)=\"relayout($event)\"\n                     [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                     [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n</div>\n",
                    encapsulation: ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host{display:block;height:100%}:host #chartContainer{height:100%}:host #chartContainer div{height:100%}:host div.chart{width:var(--warp-view-chart-width);height:var(--warp-view-chart-height)}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewPieComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: SizeService },
        { type: NgZone }
    ]; };
    WarpViewPieComponent.propDecorators = {
        type: [{ type: Input, args: ['type',] }],
        chartDraw: [{ type: Output, args: ['chartDraw',] }]
    };
    return WarpViewPieComponent;
}(WarpViewComponent));
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
var WarpViewGaugeComponent = /** @class */ (function (_super) {
    __extends(WarpViewGaugeComponent, _super);
    function WarpViewGaugeComponent(el, renderer, sizeService, ngZone) {
        var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
        _this.el = el;
        _this.renderer = renderer;
        _this.sizeService = sizeService;
        _this.ngZone = ngZone;
        _this.CHART_MARGIN = 0.05;
        // tslint:disable-next-line:variable-name
        _this._type = 'gauge'; // gauge or bullet
        _this.LOG = new Logger(WarpViewGaugeComponent, _this._debug);
        return _this;
    }
    Object.defineProperty(WarpViewGaugeComponent.prototype, "type", {
        set: /**
         * @param {?} type
         * @return {?}
         */
        function (type) {
            this._type = type;
            this.drawChart();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    WarpViewGaugeComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this._options = this._options || this.defOptions;
    };
    /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    WarpViewGaugeComponent.prototype.update = /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    function (options, refresh) {
        this.LOG.debug(['onOptions', 'before'], this._options, options);
        if (!deepEqual(options, this._options)) {
            this.LOG.debug(['options', 'changed'], options);
            this._options = (/** @type {?} */ (ChartLib.mergeDeep(this._options, (/** @type {?} */ (options)))));
        }
        this.drawChart();
    };
    /**
     * @return {?}
     */
    WarpViewGaugeComponent.prototype.drawChart = /**
     * @return {?}
     */
    function () {
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
    };
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    WarpViewGaugeComponent.prototype.convert = /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    function (data) {
        var _this = this;
        this.LOG.debug(['convert'], data);
        /** @type {?} */
        var gtsList = (/** @type {?} */ (data.data));
        /** @type {?} */
        var dataList = [];
        /** @type {?} */
        var max = Number.MIN_VALUE;
        this.LOG.debug(['convert', 'gtsList'], gtsList);
        if (!gtsList || gtsList.length === 0 || gtsList[0].length < 2) {
            return;
        }
        gtsList.forEach((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return max = Math.max(max, d[1]); }));
        /** @type {?} */
        var x = 0;
        /** @type {?} */
        var y = -1 / (gtsList.length / 2);
        gtsList.forEach((/**
         * @param {?} gts
         * @param {?} i
         * @return {?}
         */
        function (gts, i) {
            if (i % 2 !== 0) {
                x = 0.5;
            }
            else {
                x = 0;
                y += 1 / (gtsList.length / 2);
            }
            /** @type {?} */
            var c = ColorLib.getColor(gts.id || i, _this._options.scheme);
            /** @type {?} */
            var color = ((data.params || [])[i] || { datasetColor: c }).datasetColor || c;
            /** @type {?} */
            var domain = gtsList.length > 1 ? {
                x: [x + _this.CHART_MARGIN, x + 0.5 - _this.CHART_MARGIN],
                y: [y + _this.CHART_MARGIN, y + 1 / (gtsList.length / 2) - _this.CHART_MARGIN * 2]
            } : {
                x: [0, 1],
                y: [0, 1]
            };
            if (_this._type === 'bullet' || (!!data.params && !!data.params[i].type && data.params[i].type === 'bullet')) {
                domain.x = [_this.CHART_MARGIN, 1 - _this.CHART_MARGIN];
                domain.y = [(i > 0 ? i / gtsList.length : 0) + _this.CHART_MARGIN, (i + 1) / gtsList.length - _this.CHART_MARGIN];
            }
            dataList.push({
                domain: domain,
                align: 'left',
                value: gts[1],
                delta: {
                    reference: !!data.params && !!data.params[i].delta ? data.params[i].delta + gts[1] : 0,
                    font: { color: _this.getLabelColor(_this.el.nativeElement) }
                },
                title: {
                    text: gts[0],
                    align: 'center',
                    font: { color: _this.getLabelColor(_this.el.nativeElement) }
                },
                number: {
                    font: { color: _this.getLabelColor(_this.el.nativeElement) }
                },
                type: 'indicator',
                mode: !!data.params && !!data.params[i].delta ? 'number+delta+gauge' : 'gauge+number',
                gauge: {
                    bgcolor: 'transparent',
                    shape: !!data.params && !!data.params[i].type ? data.params[i].type : _this._type || 'gauge',
                    bordercolor: _this.getGridColor(_this.el.nativeElement),
                    axis: {
                        range: [null, max],
                        tickcolor: _this.getGridColor(_this.el.nativeElement),
                        tickfont: { color: _this.getGridColor(_this.el.nativeElement) }
                    },
                    bar: {
                        color: ColorLib.transparentize(color),
                        line: {
                            width: 1,
                            color: color
                        }
                    }
                }
            });
            _this.LOG.debug(['convert', 'dataList'], i);
        }));
        this.LOG.debug(['convert', 'dataList'], dataList);
        return dataList;
    };
    WarpViewGaugeComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-gauge',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\">\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-plotly #graph *ngIf=\"plotlyData?.length > 0\"\n                     [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot()\"\n                     (relayout)=\"relayout($event)\"\n                     [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                     [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n</div>\n",
                    encapsulation: ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host{display:block;height:100%}:host #chartContainer{height:100%}:host #chartContainer div{height:100%}:host div.chart{width:var(--warp-view-chart-width,100%);height:var(--warp-view-chart-height,100%)}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewGaugeComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: SizeService },
        { type: NgZone }
    ]; };
    WarpViewGaugeComponent.propDecorators = {
        type: [{ type: Input, args: ['type',] }]
    };
    return WarpViewGaugeComponent;
}(WarpViewComponent));
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
var WarpViewAnnotationComponent = /** @class */ (function (_super) {
    __extends(WarpViewAnnotationComponent, _super);
    function WarpViewAnnotationComponent(el, renderer, sizeService, ngZone) {
        var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
        _this.el = el;
        _this.renderer = renderer;
        _this.sizeService = sizeService;
        _this.ngZone = ngZone;
        _this.pointHover = new EventEmitter();
        _this.warpViewChartResize = new EventEmitter();
        _this.chartDraw = new EventEmitter();
        _this.boundsDidChange = new EventEmitter();
        _this.displayExpander = true;
        // tslint:disable-next-line:variable-name
        _this._type = 'line';
        _this.visibility = [];
        _this.expanded = false;
        _this._standalone = true;
        _this.maxTick = Number.MIN_VALUE;
        _this.minTick = Number.MAX_VALUE;
        _this.visibleGtsId = [];
        _this.gtsId = [];
        _this.dataHashset = {};
        _this.lineHeight = 30;
        _this.chartBounds = new ChartBounds();
        _this.layout = {
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
        _this.marginLeft = 50;
        _this._autoResize = false;
        _this.LOG = new Logger(WarpViewAnnotationComponent, _this._debug);
        return _this;
    }
    Object.defineProperty(WarpViewAnnotationComponent.prototype, "hiddenData", {
        set: /**
         * @param {?} hiddenData
         * @return {?}
         */
        function (hiddenData) {
            var _this = this;
            /** @type {?} */
            var previousVisibility = JSON.stringify(this.visibility);
            this.LOG.debug(['hiddenData', 'previousVisibility'], previousVisibility);
            this._hiddenData = hiddenData;
            this.visibility = [];
            this.visibleGtsId.forEach((/**
             * @param {?} id
             * @return {?}
             */
            function (id) { return _this.visibility.push(hiddenData.indexOf(id) < 0 && (id !== -1)); }));
            this.LOG.debug(['hiddenData', 'hiddendygraphfullv'], this.visibility);
            /** @type {?} */
            var newVisibility = JSON.stringify(this.visibility);
            this.LOG.debug(['hiddenData', 'json'], previousVisibility, newVisibility);
            if (previousVisibility !== newVisibility) {
                /** @type {?} */
                var visible_1 = [];
                /** @type {?} */
                var hidden_1 = [];
                this.gtsId.forEach((/**
                 * @param {?} id
                 * @param {?} i
                 * @return {?}
                 */
                function (id, i) {
                    if (_this._hiddenData.indexOf(id) > -1) {
                        hidden_1.push(i);
                    }
                    else {
                        visible_1.push(i);
                    }
                }));
                if (visible_1.length > 0) {
                    this.graph.restyleChart({ visible: true }, visible_1);
                }
                if (hidden_1.length > 0) {
                    this.graph.restyleChart({ visible: false }, hidden_1);
                }
                this.LOG.debug(['hiddendygraphtrig', 'destroy'], 'redraw by visibility change');
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarpViewAnnotationComponent.prototype, "type", {
        set: /**
         * @param {?} type
         * @return {?}
         */
        function (type) {
            this._type = type;
            this.drawChart();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarpViewAnnotationComponent.prototype, "standalone", {
        get: /**
         * @return {?}
         */
        function () {
            return this._standalone;
        },
        set: /**
         * @param {?} isStandalone
         * @return {?}
         */
        function (isStandalone) {
            if (this._standalone !== isStandalone) {
                this._standalone = isStandalone;
                this.drawChart();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} $event
     * @return {?}
     */
    WarpViewAnnotationComponent.prototype.handleKeyDown = /**
     * @param {?} $event
     * @return {?}
     */
    function ($event) {
        var _this = this;
        if ($event.key === 'Control') {
            this.trimmed = setInterval((/**
             * @return {?}
             */
            function () {
                if (!!_this.toolTip.nativeElement.querySelector('#tooltip-body')) {
                    _this.toolTip.nativeElement.querySelector('#tooltip-body').classList.add('full');
                }
            }), 100);
        }
    };
    /**
     * @param {?} $event
     * @return {?}
     */
    WarpViewAnnotationComponent.prototype.handleKeyup = /**
     * @param {?} $event
     * @return {?}
     */
    function ($event) {
        this.LOG.debug(['document:keyup'], $event);
        if ($event.key === 'Control') {
            if (!!this.toolTip.nativeElement.querySelector('#tooltip-body')) {
                if (this.trimmed) {
                    clearInterval(this.trimmed);
                }
                this.toolTip.nativeElement.querySelector('#tooltip-body').classList.remove('full');
            }
        }
    };
    /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    WarpViewAnnotationComponent.prototype.update = /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    function (options, refresh) {
        if (!!options) {
            this._options = (/** @type {?} */ (ChartLib.mergeDeep(this._options, options)));
        }
        this.drawChart(refresh);
    };
    /**
     * @param {?} min
     * @param {?} max
     * @param {?} marginLeft
     * @return {?}
     */
    WarpViewAnnotationComponent.prototype.updateBounds = /**
     * @param {?} min
     * @param {?} max
     * @param {?} marginLeft
     * @return {?}
     */
    function (min, max, marginLeft) {
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
        this.layout = __assign({}, this.layout);
        this.LOG.debug(['updateBounds'], __assign({}, this.layout.xaxis.range));
    };
    /**
     * @param {?=} reparseNewData
     * @return {?}
     */
    WarpViewAnnotationComponent.prototype.drawChart = /**
     * @param {?=} reparseNewData
     * @return {?}
     */
    function (reparseNewData) {
        if (reparseNewData === void 0) { reparseNewData = false; }
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
        var count = this.plotlyData.filter((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d.y.length > 0; })).length;
        this.layout.margin.l = !!this._standalone ? 10 : 50;
        this.layout.margin.b = !!this._standalone ? 50 : 1;
        /** @type {?} */
        var calculatedHeight = (this.expanded ? this.lineHeight * count : this.lineHeight) + this.layout.margin.t + this.layout.margin.b;
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
        this.plotlyConfig = __assign({}, this.plotlyConfig);
        this.layout = __assign({}, this.layout);
        this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig, this.plotlyData);
        this.loading = false;
    };
    /**
     * @param {?} data
     * @return {?}
     */
    WarpViewAnnotationComponent.prototype.relayout = /**
     * @param {?} data
     * @return {?}
     */
    function (data) {
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
    };
    /**
     * @param {?} data
     * @return {?}
     */
    WarpViewAnnotationComponent.prototype.hover = /**
     * @param {?} data
     * @return {?}
     */
    function (data) {
        this.LOG.debug(['hover'], data);
        /** @type {?} */
        var tooltip = this.toolTip.nativeElement;
        this.pointHover.emit({
            x: data.event.offsetX,
            y: data.event.offsetY
        });
        /** @type {?} */
        var x = data.xvals[0];
        if (!!data.points[0]) {
            x = data.points[0].x;
        }
        /** @type {?} */
        var layout = this.el.nativeElement.getBoundingClientRect();
        /** @type {?} */
        var count = this.plotlyData.filter((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d.y.length > 0; })).length;
        tooltip.style.opacity = '1';
        tooltip.style.display = 'block';
        tooltip.style.paddingLeft = (this._standalone ? 0 : 40) + 'px';
        tooltip.style.top = ((this.expanded ? count - 1 - (data.points[0].y + 0.5) : -1) * (this.lineHeight) + this.layout.margin.t) + 6 + 'px';
        tooltip.classList.remove('right', 'left');
        tooltip.innerHTML = "<div class=\"tooltip-body trimmed\" id=\"tooltip-body\">\n<span class=\"tooltip-date\">" + (this._options.timeMode === 'timestamp'
            ? x
            : (moment__default(x).utc().toISOString().replace('Z', this._options.timeZone === 'UTC' ? 'Z' : '') || '')) + "</span>\n<ul>\n<li>" + GTSLib.formatLabel(data.points[0].data.name) + ": <span class=\"value\">" + data.points[0].text + "</span></li>\n</ul>\n      </div>";
        if (data.event.offsetX > layout.width / 2) {
            tooltip.classList.add('left');
        }
        else {
            tooltip.classList.add('right');
        }
        tooltip.style.pointerEvents = 'none';
    };
    /**
     * @return {?}
     */
    WarpViewAnnotationComponent.prototype.unhover = /**
     * @return {?}
     */
    function () {
        this.toolTip.nativeElement.style.display = 'none';
    };
    /**
     * @param {?} div
     * @return {?}
     */
    WarpViewAnnotationComponent.prototype.afterPlot = /**
     * @param {?} div
     * @return {?}
     */
    function (div) {
        this.loading = false;
        this.chartBounds.tsmin = this.minTick;
        this.chartBounds.tsmax = this.maxTick;
        this.chartDraw.emit(this.chartBounds);
        this.LOG.debug(['afterPlot'], this.chartBounds, div);
    };
    /**
     * @private
     * @param {?} min
     * @param {?} max
     * @return {?}
     */
    WarpViewAnnotationComponent.prototype.emitNewBounds = /**
     * @private
     * @param {?} min
     * @param {?} max
     * @return {?}
     */
    function (min, max) {
        if (this._options.timeMode && this._options.timeMode === 'timestamp') {
            this.boundsDidChange.emit({ bounds: { min: min, max: max }, source: 'annotation' });
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
    };
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    WarpViewAnnotationComponent.prototype.convert = /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    function (data) {
        var _this = this;
        /** @type {?} */
        var dataset = [];
        /** @type {?} */
        var gtsList = GTSLib.flatDeep(GTSLib.flattenGtsIdArray((/** @type {?} */ (data.data)), 0).res);
        this.maxTick = Number.NEGATIVE_INFINITY;
        this.minTick = Number.POSITIVE_INFINITY;
        this.visibleGtsId = [];
        this.gtsId = [];
        /** @type {?} */
        var nonPlottable = gtsList.filter((/**
         * @param {?} g
         * @return {?}
         */
        function (g) { return g.v && GTSLib.isGtsToPlot(g); }));
        gtsList = gtsList.filter((/**
         * @param {?} g
         * @return {?}
         */
        function (g) { return g.v && !GTSLib.isGtsToPlot(g); }));
        /** @type {?} */
        var timestampMode = true;
        /** @type {?} */
        var tsLimit = 100 * GTSLib.getDivider(this._options.timeUnit);
        gtsList.forEach((/**
         * @param {?} gts
         * @return {?}
         */
        function (gts) {
            /** @type {?} */
            var ticks = gts.v.map((/**
             * @param {?} t
             * @return {?}
             */
            function (t) { return t[0]; }));
            /** @type {?} */
            var size = gts.v.length;
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
        function (gts, i) {
            if (gts.v) {
                /** @type {?} */
                var size = gts.v.length;
                /** @type {?} */
                var label = GTSLib.serializeGtsMetadata(gts);
                /** @type {?} */
                var c = ColorLib.getColor(gts.id, _this._options.scheme);
                /** @type {?} */
                var color = ((data.params || [])[i] || { datasetColor: c }).datasetColor || c;
                /** @type {?} */
                var series = {
                    type: 'scatter',
                    mode: 'markers',
                    name: label,
                    x: [],
                    y: [],
                    text: [],
                    hoverinfo: 'none',
                    connectgaps: false,
                    visible: !(_this._hiddenData.filter((/**
                     * @param {?} h
                     * @return {?}
                     */
                    function (h) { return h === gts.id; })).length > 0),
                    line: { color: color },
                    marker: {
                        symbol: 'line-ns-open',
                        color: color,
                        size: 20,
                        width: 5,
                    }
                };
                _this.visibleGtsId.push(gts.id);
                _this.gtsId.push(gts.id);
                if (_this._options.timeMode && _this._options.timeMode === 'timestamp') {
                    _this.layout.xaxis.type = 'linear';
                }
                else {
                    _this.layout.xaxis.type = 'date';
                }
                /** @type {?} */
                var ticks = gts.v.map((/**
                 * @param {?} t
                 * @return {?}
                 */
                function (t) { return t[0]; }));
                series.text = gts.v.map((/**
                 * @param {?} t
                 * @return {?}
                 */
                function (t) { return t[t.length - 1]; }));
                series.y = gts.v.map((/**
                 * @return {?}
                 */
                function () { return (_this.expanded ? i : 0) + 0.5; }));
                if (size > 0) {
                    _this.minTick = ticks[0];
                    _this.maxTick = ticks[0];
                    for (var v = 1; v < size; v++) {
                        /** @type {?} */
                        var val = ticks[v];
                        _this.minTick = (val < _this.minTick) ? val : _this.minTick;
                        _this.maxTick = (val > _this.maxTick) ? val : _this.maxTick;
                    }
                }
                if (timestampMode || _this._options.timeMode === 'timestamp') {
                    series.x = ticks;
                }
                else {
                    if (_this._options.timeZone !== 'UTC') {
                        series.x = ticks.map((/**
                         * @param {?} t
                         * @return {?}
                         */
                        function (t) { return moment__default.utc(t / _this.divider).tz(_this._options.timeZone).toISOString(); }));
                    }
                    else {
                        series.x = ticks.map((/**
                         * @param {?} t
                         * @return {?}
                         */
                        function (t) { return moment__default.utc(t / _this.divider).toISOString(); }));
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
            function (g) {
                g.v.forEach((/**
                 * @param {?} value
                 * @return {?}
                 */
                function (value) {
                    /** @type {?} */
                    var ts = value[0];
                    if (ts < _this.minTick) {
                        _this.minTick = ts;
                    }
                    if (ts > _this.maxTick) {
                        _this.maxTick = ts;
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
    };
    /**
     * @return {?}
     */
    WarpViewAnnotationComponent.prototype.toggle = /**
     * @return {?}
     */
    function () {
        this.expanded = !this.expanded;
        this.drawChart();
    };
    /**
     * @param {?} chartBounds
     * @return {?}
     */
    WarpViewAnnotationComponent.prototype.setRealBounds = /**
     * @param {?} chartBounds
     * @return {?}
     */
    function (chartBounds) {
        this.minTick = chartBounds.tsmin;
        this.maxTick = chartBounds.tsmax;
        this._options.bounds = this._options.bounds || {};
        this._options.bounds.minDate = this.minTick;
        this._options.bounds.maxDate = this.maxTick;
        /** @type {?} */
        var x = {
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
        this.layout = __assign({}, this.layout);
    };
    WarpViewAnnotationComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-annotation',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\" #chartContainer (mouseleave)=\"hideTooltip()\">\n  <button *ngIf=\"displayExpander && plotlyData && plotlyData.length > 1\" class=\"expander\" (click)=\"toggle()\"\n          title=\"collapse/expand\">+/-</button>\n  <div #toolTip class=\"tooltip\"></div>\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <div *ngIf=\"!loading && !noData\">\n    <div class=\"upperLine\" [ngStyle]=\"{left: standalone? '10px': marginLeft + 'px'}\"></div>\n    <warpview-plotly #graph\n                     [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot($event)\"\n                     (relayout)=\"relayout($event)\" className=\"chart\" (hover)=\"hover($event)\" (unhover)=\"unhover()\"\n                     [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                     [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n</div>\n",
                    encapsulation: ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}:host{display:block}:host .expander{position:absolute;top:0;left:0;width:35px;z-index:9}:host #chartContainer{height:auto;position:relative}:host #chartContainer div.upperLine{position:absolute;top:30px;left:0;height:0;border-bottom:1px solid var(--warp-view-chart-grid-color,#8e8e8e);right:10px}:host .date{text-align:right;display:block;height:20px;vertical-align:middle;line-height:20px;position:absolute;top:0;left:40px}:host .chart{width:var(--warp-view-chart-width);height:var(--warp-view-chart-height)}:host .tooltip{position:absolute;width:calc(100% - 50px);z-index:999;margin-left:10px;top:-1000px}:host .tooltip .tooltip-body{background-color:#ffffffcc;padding-left:10px;padding-right:10px;width:auto;max-width:100%;vertical-align:middle;line-height:20px;height:50px;overflow:visible;margin:1px;color:var(--warp-view-annotationtooltip-font-color)}:host .tooltip .tooltip-body ul{list-style:none;padding-top:0;margin-top:10px}:host .tooltip .tooltip-body.trimmed{max-width:49%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}:host .tooltip .tooltip-body.full{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}:host .tooltip .tooltip-body .timestamp{font-size:1rem}:host .tooltip .tooltip-body .value{color:var(--warp-view-annotationtooltip-value-font-color)}:host .tooltip .tooltip-body .tooltip-date{font-weight:700;font-size:.8rem;text-align:left;display:block;width:100%;height:.8rem;padding-top:5px;vertical-align:middle;line-height:.8rem}:host .tooltip .tooltip-body .round{border-radius:50%;background-color:#bbb;display:inline-block;width:5px;height:5px;border:2px solid #454545;margin-top:auto;margin-bottom:auto;vertical-align:middle;margin-right:5px}:host .tooltip.left .tooltip-body{text-align:left;float:left}:host .tooltip.left .tooltip-body .tooltip-date{text-align:left}:host .tooltip.right .tooltip-body{text-align:right;float:right}:host .tooltip.right .tooltip-body .tooltip-date{text-align:right}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewAnnotationComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: SizeService },
        { type: NgZone }
    ]; };
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
    return WarpViewAnnotationComponent;
}(WarpViewComponent));
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
var WarpViewPolarComponent = /** @class */ (function (_super) {
    __extends(WarpViewPolarComponent, _super);
    function WarpViewPolarComponent(el, renderer, sizeService, ngZone) {
        var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
        _this.el = el;
        _this.renderer = renderer;
        _this.sizeService = sizeService;
        _this.ngZone = ngZone;
        _this.layout = {
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
        _this.LOG = new Logger(WarpViewPolarComponent, _this._debug);
        return _this;
    }
    /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    WarpViewPolarComponent.prototype.update = /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    function (options, refresh) {
        this.LOG.debug(['onOptions', 'before'], this._options, options);
        if (!deepEqual(options, this._options)) {
            this.LOG.debug(['options', 'changed'], options);
            this._options = (/** @type {?} */ (ChartLib.mergeDeep(this._options, (/** @type {?} */ (options)))));
        }
        this.drawChart();
    };
    /**
     * @return {?}
     */
    WarpViewPolarComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this._options = this._options || this.defOptions;
    };
    /**
     * @private
     * @return {?}
     */
    WarpViewPolarComponent.prototype.drawChart = /**
     * @private
     * @return {?}
     */
    function () {
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
    };
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    WarpViewPolarComponent.prototype.convert = /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    function (data) {
        var _this = this;
        /** @type {?} */
        var dataset = [];
        /** @type {?} */
        var divider = GTSLib.getDivider(this._options.timeUnit);
        /** @type {?} */
        var gtsList = GTSLib.flatDeep(GTSLib.flattenGtsIdArray((/** @type {?} */ (data.data)), 0).res);
        this.LOG.debug(['convert', 'gtsList'], gtsList);
        /** @type {?} */
        var minVal = Number.MAX_VALUE;
        /** @type {?} */
        var maxVal = Number.MIN_VALUE;
        gtsList.forEach((/**
         * @param {?} gts
         * @param {?} i
         * @return {?}
         */
        function (gts, i) {
            /** @type {?} */
            var c = ColorLib.getColor(i, _this._options.scheme);
            /** @type {?} */
            var color = ((data.params || [])[gts.id] || { datasetColor: c }).datasetColor || c;
            /** @type {?} */
            var series = {
                r: [],
                theta: [],
                marker: {
                    line: { color: color, width: 1 },
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
            function (value) {
                /** @type {?} */
                var ts = value[0];
                minVal = Math.min(minVal, value[value.length - 1]);
                maxVal = Math.max(maxVal, value[value.length - 1]);
                series.r.push(value[value.length - 1]);
                if (_this._options.timeMode && _this._options.timeMode === 'timestamp') {
                    series.theta.push(ts.toString());
                }
                else {
                    series.theta.push(moment__default.tz(moment__default.utc(ts / _this.divider), _this._options.timeZone).toISOString());
                }
            }));
            if (_this.unit) {
                series.title = {
                    text: _this.unit
                };
            }
            dataset.push(series);
        }));
        this.layout.polar.radialaxis.range = [minVal, maxVal];
        return dataset;
    };
    WarpViewPolarComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-polar',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\" #chartContainer>\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-plotly #graph *ngIf=\"plotlyData?.length > 0\"\n                     [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot()\"\n                     (relayout)=\"relayout($event)\" (hover)=\"hover($event)\" (unhover)=\"unhover($event)\"\n                     [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                     [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n  <div #toolTip class=\"tooltip\" [ngStyle]=\"getTooltipPosition()\"></div>\n</div>\n",
                    encapsulation: ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}.tooltip{background-color:var(--warp-view-chart-legend-bg)!important;color:var(--warp-view-chart-legend-color)!important;text-align:left;position:absolute;display:none;padding:10px;border:1px solid grey;border-radius:5px;box-shadow:none;pointer-events:none;font-size:10px;min-width:100px;width:auto;max-width:50%;z-index:999;height:auto!important;left:-1000px}.tooltip .chip{border-radius:50%;background-color:#bbb;display:inline-block;width:5px;height:5px;border:2px solid #454545;margin-top:auto;margin-bottom:auto;vertical-align:middle;cursor:pointer}:host{display:block;height:100%}:host .bglayer{display:none}:host #chartContainer{height:100%}:host #chartContainer div{height:100%}:host div.chart{width:var(--warp-view-chart-width);height:var(--warp-view-chart-height)}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewPolarComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: SizeService },
        { type: NgZone }
    ]; };
    return WarpViewPolarComponent;
}(WarpViewComponent));
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
var WarpViewRadarComponent = /** @class */ (function (_super) {
    __extends(WarpViewRadarComponent, _super);
    function WarpViewRadarComponent(el, renderer, sizeService, ngZone) {
        var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
        _this.el = el;
        _this.renderer = renderer;
        _this.sizeService = sizeService;
        _this.ngZone = ngZone;
        _this.layout = {
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
        _this.LOG = new Logger(WarpViewRadarComponent, _this._debug);
        return _this;
    }
    /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    WarpViewRadarComponent.prototype.update = /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    function (options, refresh) {
        this.LOG.debug(['onOptions', 'before'], this._options, options);
        if (!deepEqual(options, this._options)) {
            this.LOG.debug(['options', 'changed'], options);
            this._options = (/** @type {?} */ (ChartLib.mergeDeep(this._options, (/** @type {?} */ (options)))));
        }
        this.drawChart();
    };
    /**
     * @return {?}
     */
    WarpViewRadarComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this._options = this._options || this.defOptions;
    };
    /**
     * @private
     * @return {?}
     */
    WarpViewRadarComponent.prototype.drawChart = /**
     * @private
     * @return {?}
     */
    function () {
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
    };
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    WarpViewRadarComponent.prototype.convert = /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    function (data) {
        var _this = this;
        /** @type {?} */
        var dataset = [];
        /** @type {?} */
        var divider = GTSLib.getDivider(this._options.timeUnit);
        /** @type {?} */
        var gtsList = GTSLib.flatDeep(GTSLib.flattenGtsIdArray((/** @type {?} */ (data.data)), 0).res);
        this.LOG.debug(['convert', 'gtsList'], gtsList);
        /** @type {?} */
        var minVal = Number.MAX_VALUE;
        /** @type {?} */
        var maxVal = Number.MIN_VALUE;
        gtsList.forEach((/**
         * @param {?} gts
         * @param {?} i
         * @return {?}
         */
        function (gts, i) {
            /** @type {?} */
            var c = ColorLib.getColor(i, _this._options.scheme);
            /** @type {?} */
            var color = ((data.params || [])[gts.id] || { datasetColor: c }).datasetColor || c;
            /** @type {?} */
            var series = {
                r: [],
                theta: [],
                line: { color: color },
                marker: {
                    line: { color: color, width: 1 },
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
            function (value) {
                /** @type {?} */
                var ts = value[0];
                series.r.push(value[value.length - 1]);
                minVal = Math.min(minVal, value[value.length - 1]);
                maxVal = Math.max(maxVal, value[value.length - 1]);
                if (_this._options.timeMode && _this._options.timeMode === 'timestamp') {
                    series.theta.push(ts.toString());
                }
                else {
                    series.theta.push(moment__default.tz(moment__default.utc(ts / _this.divider), _this._options.timeZone).toISOString());
                }
            }));
            dataset.push(series);
        }));
        this.layout.polar.radialaxis.range = [minVal, maxVal];
        return dataset;
    };
    WarpViewRadarComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-radar',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\" #chartContainer>\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-plotly #graph *ngIf=\"plotlyData?.length > 0\"\n                     [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot()\"\n                     (relayout)=\"relayout($event)\" (hover)=\"hover($event)\" (unhover)=\"unhover($event)\"\n                     [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                     [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n  <div #toolTip class=\"tooltip\" [ngStyle]=\"getTooltipPosition()\"></div>\n</div>\n",
                    encapsulation: ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}.tooltip{background-color:var(--warp-view-chart-legend-bg)!important;color:var(--warp-view-chart-legend-color)!important;text-align:left;position:absolute;display:none;padding:10px;border:1px solid grey;border-radius:5px;box-shadow:none;pointer-events:none;font-size:10px;min-width:100px;width:auto;max-width:50%;z-index:999;height:auto!important;left:-1000px}.tooltip .chip{border-radius:50%;background-color:#bbb;display:inline-block;width:5px;height:5px;border:2px solid #454545;margin-top:auto;margin-bottom:auto;vertical-align:middle;cursor:pointer}:host{display:block;height:100%}:host .bglayer{display:none}:host #chartContainer{height:100%}:host #chartContainer div{height:100%}:host div.chart{width:var(--warp-view-chart-width);height:var(--warp-view-chart-height)}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewRadarComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: SizeService },
        { type: NgZone }
    ]; };
    return WarpViewRadarComponent;
}(WarpViewComponent));
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
var WarpViewPlotComponent = /** @class */ (function (_super) {
    __extends(WarpViewPlotComponent, _super);
    function WarpViewPlotComponent(el, renderer, sizeService, ngZone) {
        var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
        _this.el = el;
        _this.renderer = renderer;
        _this.sizeService = sizeService;
        _this.ngZone = ngZone;
        _this.showLine = false;
        _this.isAlone = false;
        _this.initialChartHeight = 400;
        _this.initialMapHeight = 400;
        _this.warpViewChartResize = new EventEmitter();
        _this._options = __assign({}, new Param(), {
            showControls: true,
            showGTSTree: true,
            showDots: true,
            timeZone: 'UTC',
            timeUnit: 'us',
            timeMode: 'date',
            bounds: {}
        });
        _this._toHide = [];
        _this.showChart = true;
        _this.showMap = false;
        _this.timeClipValue = '';
        _this.kbdLastKeyPressed = [];
        _this.warningMessage = '';
        _this.loading = false;
        _this.gtsIdList = [];
        _this.kbdCounter = 0;
        _this.gtsFilterCount = 0;
        _this.gtsBrowserIndex = -1;
        _this._gtsFilter = 'x';
        _this._type = 'line';
        _this.chartBounds = {
            tsmin: Number.MAX_VALUE,
            tsmax: Number.MIN_VALUE,
            msmax: '',
            msmin: '',
            marginLeft: 0
        };
        // key event are trapped in plot component.
        // if one of this key is pressed, default action is prevented.
        _this.preventDefaultKeyList = ['Escape', '/'];
        _this.preventDefaultKeyListInModals = ['Escape', 'ArrowUp', 'ArrowDown', ' ', '/'];
        _this.LOG = new Logger(WarpViewPlotComponent, _this._debug);
        return _this;
    }
    Object.defineProperty(WarpViewPlotComponent.prototype, "type", {
        get: /**
         * @return {?}
         */
        function () {
            return this._type;
        },
        set: /**
         * @param {?} type
         * @return {?}
         */
        function (type) {
            this._type = type;
            this.drawChart();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarpViewPlotComponent.prototype, "gtsFilter", {
        get: /**
         * @return {?}
         */
        function () {
            return this._gtsFilter;
        },
        set: /**
         * @param {?} gtsFilter
         * @return {?}
         */
        function (gtsFilter) {
            this._gtsFilter = gtsFilter;
            this.drawChart();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    WarpViewPlotComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this._options = this._options || this.defOptions;
    };
    /**
     * @return {?}
     */
    WarpViewPlotComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        this.drawChart(true);
        this.resizeArea();
    };
    /**
     * @param {?} ev
     * @return {?}
     */
    WarpViewPlotComponent.prototype.handleKeydown = /**
     * @param {?} ev
     * @return {?}
     */
    function (ev) {
        this.LOG.debug(['handleKeydown'], ev);
        if (!this.isAlone) {
            this.handleKeyPress(ev).then((/**
             * @return {?}
             */
            function () {
                // empty
            }));
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    WarpViewPlotComponent.prototype.stateChange = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        var _this = this;
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
                    function () { return _this.map.resize(); }));
                }
                break;
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    WarpViewPlotComponent.prototype.boundsDidChange = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
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
    };
    /**
     * @return {?}
     */
    WarpViewPlotComponent.prototype.onWarpViewModalClose = /**
     * @return {?}
     */
    function () {
        this.mainPlotDiv.nativeElement.focus();
    };
    /**
     * @param {?} event
     * @return {?}
     */
    WarpViewPlotComponent.prototype.warpViewSelectedGTS = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        var _this = this;
        this.LOG.debug(['warpViewSelectedGTS'], event);
        if (!this._toHide.find((/**
         * @param {?} i
         * @return {?}
         */
        function (i) {
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
                function (i) {
                    return i !== event.gts.id;
                }));
            }
        }
        this.LOG.debug(['warpViewSelectedGTS', 'this._toHide'], this._toHide);
        this.ngZone.run((/**
         * @return {?}
         */
        function () {
            _this._toHide = __spread(_this._toHide);
        }));
    };
    /**
     * @param {?} evt
     * @return {?}
     */
    WarpViewPlotComponent.prototype.handleMouseMove = /**
     * @param {?} evt
     * @return {?}
     */
    function (evt) {
        evt.preventDefault();
        if (this.showLine && this.line) {
            this.line.nativeElement.style.left = Math.max(evt.pageX - this.left, 50) + 'px';
        }
    };
    /**
     * @param {?} evt
     * @return {?}
     */
    WarpViewPlotComponent.prototype.handleMouseEnter = /**
     * @param {?} evt
     * @return {?}
     */
    function (evt) {
        evt.preventDefault();
        this.left = this.left || this.main.nativeElement.getBoundingClientRect().left;
        this.showLine = true;
        if (this.line) {
            this.renderer.setStyle(this.line.nativeElement, 'display', 'block');
        }
    };
    /**
     * @param {?} evt
     * @return {?}
     */
    WarpViewPlotComponent.prototype.handleMouseOut = /**
     * @param {?} evt
     * @return {?}
     */
    function (evt) {
        // evt.preventDefault();
        if (this.line) {
            this.showLine = false;
            this.renderer.setStyle(this.line.nativeElement, 'left', '-100px');
            this.renderer.setStyle(this.line.nativeElement, 'display', 'none');
        }
    };
    /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    WarpViewPlotComponent.prototype.update = /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    function (options, refresh) {
        var _this = this;
        if (options) {
            /** @type {?} */
            var optionChanged_1 = false;
            Object.keys(options).forEach((/**
             * @param {?} opt
             * @return {?}
             */
            function (opt) {
                if (_this._options.hasOwnProperty(opt)) {
                    optionChanged_1 = optionChanged_1 || !deepEqual(options[opt], _this._options[opt]);
                }
                else {
                    optionChanged_1 = true; // new unknown option
                }
            }));
            if (this.LOG) {
                this.LOG.debug(['onOptions', 'optionChanged'], optionChanged_1);
            }
            if (optionChanged_1) {
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
    };
    /**
     * @param {?} e
     * @return {?}
     */
    WarpViewPlotComponent.prototype.inputTextKeyboardEvents = /**
     * @param {?} e
     * @return {?}
     */
    function (e) {
        e.stopImmediatePropagation();
        if (e.key === 'Enter') {
            this.applyFilter();
        }
        else if (e.key === 'Escape') {
            this.pushKbdEvent('Escape');
            this.modal.close();
        }
    };
    /**
     * @return {?}
     */
    WarpViewPlotComponent.prototype.tzSelected = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var timeZone = this.tzSelector.nativeElement.value;
        this.LOG.debug(['timezone', 'tzselect'], timeZone);
        this._options.timeZone = timeZone;
        this.tzSelector.nativeElement.setAttribute('class', timeZone === 'UTC' ? 'defaulttz' : 'customtz');
        this.drawChart();
    };
    /**
     * @return {?}
     */
    WarpViewPlotComponent.prototype.getTimeClip = /**
     * @return {?}
     */
    function () {
        this.LOG.debug(['getTimeClip'], this.chart.getTimeClip());
        return this.chart.getTimeClip();
    };
    /**
     * @param {?} event
     * @return {?}
     */
    WarpViewPlotComponent.prototype.resizeChart = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.LOG.debug(['resizeChart'], event);
        this.sizeService.change(new Size(this.width, event));
    };
    /**
     * @param {?=} firstDraw
     * @return {?}
     */
    WarpViewPlotComponent.prototype.drawChart = /**
     * @param {?=} firstDraw
     * @return {?}
     */
    function (firstDraw) {
        var _this = this;
        if (firstDraw === void 0) { firstDraw = false; }
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
            var tsLimit_1 = 100 * GTSLib.getDivider(this._options.timeUnit);
            /** @type {?} */
            var dataList = this._data.data;
            if (dataList) {
                /** @type {?} */
                var gtsList = GTSLib.flattenGtsIdArray((/** @type {?} */ (dataList)), 0).res;
                gtsList = GTSLib.flatDeep(gtsList);
                /** @type {?} */
                var timestampMode_1 = true;
                /** @type {?} */
                var totalDatapoints_1 = 0;
                gtsList.forEach((/**
                 * @param {?} g
                 * @return {?}
                 */
                function (g) {
                    _this.gtsIdList.push(g.id); // usefull for gts browse shortcut
                    if (g.v.length > 0) { // if gts not empty
                        timestampMode_1 = timestampMode_1 && (g.v[0][0] > -tsLimit_1 && g.v[0][0] < tsLimit_1);
                        timestampMode_1 = timestampMode_1 && (g.v[g.v.length - 1][0] > -tsLimit_1 && g.v[g.v.length - 1][0] < tsLimit_1);
                        totalDatapoints_1 += g.v.length;
                    }
                }));
                if (timestampMode_1) {
                    this._options.timeMode = 'timestamp';
                }
                this.LOG.debug(['drawCharts', 'parsed', 'timestampMode'], timestampMode_1);
            }
        }
        this.gtsList = this._data;
        this._options = __assign({}, this._options);
        this.LOG.debug(['drawCharts', 'parsed'], this._data, this._options);
        this.resizeArea();
    };
    /**
     * @param {?} event
     * @return {?}
     */
    WarpViewPlotComponent.prototype.focus = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        // read the first 4 letters of id of all elements in the click tree
        /** @type {?} */
        var idListClicked = event.path.map((/**
         * @param {?} el
         * @return {?}
         */
        function (el) { return (el.id || '').slice(0, 4); }));
        // if not alone on the page, and click is not on the timezone selector and not on the map, force focus.
        if (!this.isAlone && idListClicked.indexOf('tzSe') < 0 && idListClicked.indexOf('map-') < 0) {
            this.mainPlotDiv.nativeElement.focus();
        } // prevent stealing focus of the timezone selector.
    };
    /**
     * @private
     * @param {?} ev
     * @return {?}
     */
    WarpViewPlotComponent.prototype.handleKeyPress = /**
     * @private
     * @param {?} ev
     * @return {?}
     */
    function (ev) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.LOG.debug(['handleKeyPress'], ev);
                        if (this.preventDefaultKeyList.indexOf(ev.key) >= 0) {
                            ev.preventDefault();
                        }
                        return [4 /*yield*/, this.timeClip.isOpened()];
                    case 1:
                        _b = (_c.sent());
                        if (_b) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.modal.isOpened()];
                    case 2:
                        _b = (_c.sent());
                        _c.label = 3;
                    case 3:
                        _a = _b;
                        if (_a) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.gtsPopupModal.isOpened()];
                    case 4:
                        _a = (_c.sent());
                        _c.label = 5;
                    case 5:
                        if (_a) {
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
                            function (tc) {
                                _this.timeClipValue = "<p>keep data between\n          " + (_this._options.timeMode === 'timestamp' ? tc.tsmin : moment__default.tz(tc.tsmin, _this._options.timeZone).toLocaleString()) + " and\n          " + (_this._options.timeMode === 'timestamp' ? tc.tsmax : moment__default.tz(tc.tsmax, _this._options.timeZone).toLocaleString()) + "\n          " + (_this._options.timeUnit !== 'us' ? ' (for a ' + _this._options.timeUnit + ' platform)' : '') + "</p>\n          <pre><code>" + Math.round(tc.tsmax) + " " + Math.round(tc.tsmax - tc.tsmin) + " TIMECLIP</code></pre>";
                                _this.timeClip.open();
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
                            function (v) { return v !== _this.gtsIdList[_this.gtsBrowserIndex]; })); // hide all but one
                        }
                        else if (ev.key === 'n') {
                            this._toHide = __spread(this.gtsIdList);
                            return [2 /*return*/, false];
                        }
                        else if (ev.key === 'a') {
                            this._toHide = [];
                        }
                        else if (ev.key === 'Escape') {
                            this.timeClip.isOpened().then((/**
                             * @param {?} r
                             * @return {?}
                             */
                            function (r) {
                                if (r) {
                                    _this.timeClip.close();
                                }
                            }));
                            this.modal.isOpened().then((/**
                             * @param {?} r
                             * @return {?}
                             */
                            function (r) {
                                if (r) {
                                    _this.modal.close();
                                }
                            }));
                            this.gtsPopupModal.isOpened().then((/**
                             * @param {?} r
                             * @return {?}
                             */
                            function (r) {
                                if (r) {
                                    _this.gtsPopupModal.close();
                                }
                            }));
                        }
                        else {
                            this.pushKbdEvent(ev.key);
                        }
                        this.LOG.debug(['handleKeyPress', 'this.gtsIdList'], this._toHide, this.gtsBrowserIndex);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @return {?}
     */
    WarpViewPlotComponent.prototype.applyFilter = /**
     * @return {?}
     */
    function () {
        this.gtsFilterCount++;
        this._gtsFilter = this.gtsFilterCount.toString().slice(0, 1) + this.filterInput.nativeElement.value;
        this.modal.close();
    };
    /**
     * @private
     * @param {?} key
     * @return {?}
     */
    WarpViewPlotComponent.prototype.pushKbdEvent = /**
     * @private
     * @param {?} key
     * @return {?}
     */
    function (key) {
        this.kbdCounter++;
        this.kbdLastKeyPressed = [key, this.kbdCounter.toString()];
    };
    /**
     * @return {?}
     */
    WarpViewPlotComponent.prototype.getTZ = /**
     * @return {?}
     */
    function () {
        return moment__default.tz.names();
    };
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    WarpViewPlotComponent.prototype.convert = /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    function (data) {
        return [];
    };
    /**
     * @param {?} $event
     * @return {?}
     */
    WarpViewPlotComponent.prototype.onChartDraw = /**
     * @param {?} $event
     * @return {?}
     */
    function ($event) {
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
    };
    /**
     * @private
     * @return {?}
     */
    WarpViewPlotComponent.prototype.resizeArea = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        setTimeout((/**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var h = _this.el.nativeElement.getBoundingClientRect().height;
            if (h > 0) {
                if (!!_this.GTSTree) {
                    h -= _this.GTSTree.nativeElement.getBoundingClientRect().height;
                }
                if (!!_this.controls) {
                    h -= _this.controls.nativeElement.getBoundingClientRect().height;
                }
                _this.initialChartHeight = h;
            }
        }));
    };
    WarpViewPlotComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-plot',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div #mainPlotDiv tabindex=\"0\" (click)=\"focus($event)\" id=\"focusablePlotDiv\">\n  <warpview-modal [kbdLastKeyPressed]=\"kbdLastKeyPressed\" modalTitle=\"TimeClip\" #timeClip\n                  (warpViewModalClose)=\"onWarpViewModalClose()\"\n  >\n    <div #timeClipElement [innerHTML]=\"timeClipValue\"></div>\n  </warpview-modal>\n  <warpview-modal [kbdLastKeyPressed]=\"kbdLastKeyPressed\" modalTitle=\"GTS Filter\" #modal\n                  (warpViewModalClose)=\"onWarpViewModalClose()\"\n  >\n    <label for=\"filterInput\">Enter a regular expression to filter GTS.</label>\n    <br />\n    <input tabindex=\"1\" type=\"text\" (keypress)=\"inputTextKeyboardEvents($event)\" #filterInput id=\"filterInput\"\n           (keydown)=\"inputTextKeyboardEvents($event)\" (keyup)=\"inputTextKeyboardEvents($event)\"\n           [value]=\"gtsFilter.slice(1)\"/>\n    <button (click)=\"applyFilter()\" [innerHTML]=\"_options.popupButtonValidateLabel || 'Apply'\"\n            class=\"{{_options.popupButtonValidateClass}}\" tabindex=\"2\"\n            type=\"button\">\n    </button>\n  </warpview-modal>\n  <warpview-gts-popup [maxToShow]=\"5\" [hiddenData]=\"_toHide\" [gtsList]=\"gtsList\"\n                      [kbdLastKeyPressed]=\"kbdLastKeyPressed\"\n                      [options]=\"_options\" [debug]=\"debug\"\n                      (warpViewModalClose)=\"onWarpViewModalClose()\"\n                      (warpViewSelectedGTS)=\"warpViewSelectedGTS($event)\"\n                      #gtsPopupModal></warpview-gts-popup>\n  <div class=\"inline\" *ngIf=\"_options.showControls\" #controls>\n    <warpview-toggle id=\"timeSwitch\" text1=\"Date\" text2=\"Timestamp\"\n                     (stateChange)=\"stateChange($event)\"\n                     [checked]=\"_options.timeMode === 'timestamp'\"></warpview-toggle>\n    <warpview-toggle id=\"typeSwitch\" text1=\"Line\" text2=\"Step\"\n                     (stateChange)=\"stateChange($event)\"></warpview-toggle>\n    <warpview-toggle id=\"chartSwitch\" text1=\"Hide chart\" text2=\"Display chart\"\n                     (stateChange)=\"stateChange($event)\"\n                     [checked]=\"showChart\"></warpview-toggle>\n    <warpview-toggle id=\"mapSwitch\" text1=\"Hide map\" text2=\"Display map\"\n                     (stateChange)=\"stateChange($event)\" [checked]=\"showMap\"></warpview-toggle>\n    <div class=\"tzcontainer\">\n      <label for=\"tzSelector\"></label>\n      <select id=\"tzSelector\" class=\"defaulttz\" #tzSelector (change)=\"tzSelected()\">\n        <option *ngFor=\"let z of getTZ()\" [value]=\"z\" [selected]=\"z === 'UTC'\"\n                [ngClass]=\"{'defaulttz' :z === 'UTC','customtz': z !== 'UTC'}\">{{z}}</option>\n      </select>\n    </div>\n  </div>\n  <div *ngIf=\"warningMessage\" class=\"warningMessage\">{{warningMessage}}</div>\n  <warpview-gts-tree\n    *ngIf=\"_options.showGTSTree\"\n    [data]=\"gtsList\" id=\"tree\" [gtsFilter]=\"gtsFilter\" [debug]=\"debug\" #GTSTree\n    (warpViewSelectedGTS)=\"warpViewSelectedGTS($event)\"\n    [hiddenData]=\"_toHide\" [options]=\"_options\"\n    [kbdLastKeyPressed]=\"kbdLastKeyPressed\"\n  ></warpview-gts-tree>\n  <div *ngIf=\"showChart\" #main class=\"main-container\"\n       (mouseleave)=\"handleMouseOut($event)\"\n       (mousemove)=\"handleMouseMove($event)\"\n       (mouseenter)=\"handleMouseEnter($event)\">\n    <div class=\"bar\" #line></div>\n    <div class=\"annotation\">\n      <warpview-annotation #annotation\n                           [data]=\"gtsList\" [responsive]=\"true\"\n                           (boundsDidChange)=\"boundsDidChange($event)\"\n                           (chartDraw)=\"onChartDraw($event)\"\n                           [showLegend]='showLegend' [debug]=\"debug\" [standalone]=\"false\"\n                           [hiddenData]=\"_toHide\" [options]=\"_options\"\n      ></warpview-annotation>\n    </div>\n    <warpview-resize minHeight=\"100\" [initialHeight]=\"initialChartHeight\" [debug]=\"debug\"\n                     (resize)=\"resizeChart($event)\"\n    >\n      <warpview-chart [responsive]=\"true\" [standalone]=\"false\" [data]=\"gtsList\"\n                      [showLegend]=\"showLegend\"\n                      (boundsDidChange)=\"boundsDidChange($event)\"\n                      (chartDraw)=\"onChartDraw($event)\"\n                      #chart [debug]=\"debug\" [hiddenData]=\"_toHide\" [type]=\"type\" [options]=\"_options\"\n      ></warpview-chart>\n    </warpview-resize>\n  </div>\n  <warpview-resize *ngIf=\"showMap\" minHeight=\"100\" [initialHeight]=\"initialMapHeight\" [debug]=\"debug\">\n    <div class=\"map-container\">\n      <warpview-map [options]=\"_options\" #map [data]=\"gtsList\" [debug]=\"debug\" [responsive]=\"true\"\n                    [hiddenData]=\"_toHide\"\n      ></warpview-map>\n    </div>\n  </warpview-resize>\n</div>\n",
                    encapsulation: ViewEncapsulation.None,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host,warp-view-plot,warpview-plot{position:relative;height:100%}:host .main-container,warp-view-plot .main-container,warpview-plot .main-container{position:relative}:host .map-container,warp-view-plot .map-container,warpview-plot .map-container{height:100%;width:100%;margin-right:20px;position:relative}:host .bar,warp-view-plot .bar,warpview-plot .bar{width:1px;left:-100px;position:absolute;background-color:transparent;-webkit-backface-visibility:hidden;backface-visibility:hidden;top:0;bottom:55px;overflow:hidden;display:none;z-index:0;pointer-events:none;border-left:dashed 2px var(--warp-view-bar-color)}:host .inline,warp-view-plot .inline,warpview-plot .inline{display:-webkit-inline-box;display:inline-flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;flex-direction:row;flex-wrap:wrap;-webkit-box-pack:space-evenly;justify-content:space-evenly;-webkit-box-align:stretch;align-items:stretch;width:100%}:host label,warp-view-plot label,warpview-plot label{display:inline-block}:host input,warp-view-plot input,warpview-plot input{display:block;width:calc(100% - 20px);padding:5px;font-size:1rem;font-weight:400;line-height:1.5}:host .annotation,warp-view-plot .annotation,warpview-plot .annotation{max-width:100%;padding-top:20px;margin-bottom:0}:host #focusablePlotDiv:focus,warp-view-plot #focusablePlotDiv:focus,warpview-plot #focusablePlotDiv:focus{outline:0}:host #tzSelector,warp-view-plot #tzSelector,warpview-plot #tzSelector{height:var(--warp-view-switch-height);border-radius:var(--warp-view-switch-radius);padding-left:calc(var(--warp-view-switch-radius)/ 2);padding-right:5px;box-shadow:inset 0 1px 2px rgba(0,0,0,.12),inset 0 0 2px rgba(0,0,0,.15);color:var(--warp-view-font-color);border:none;margin:auto}:host .defaulttz,warp-view-plot .defaulttz,warpview-plot .defaulttz{background:var(--warp-view-switch-inset-color)}:host .customtz,warp-view-plot .customtz,warpview-plot .customtz{background:var(--warp-view-switch-inset-checked-color)}:host .tzcontainer,warp-view-plot .tzcontainer,warpview-plot .tzcontainer{display:-webkit-box;display:flex}:host .chart-container,warp-view-plot .chart-container,warpview-plot .chart-container{height:var(--warp-view-plot-chart-height);width:100%}:host #bottomPlaceHolder,warp-view-plot #bottomPlaceHolder,warpview-plot #bottomPlaceHolder{height:200px;width:100%}:host .warningMessage,warp-view-plot .warningMessage,warpview-plot .warningMessage{color:orange;padding:10px;border-radius:3px;background:#faebd7;margin:1em;display:block;border:2px solid orange}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewPlotComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: SizeService },
        { type: NgZone }
    ]; };
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
    return WarpViewPlotComponent;
}(WarpViewComponent));
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
var WarpViewResizeComponent = /** @class */ (function () {
    function WarpViewResizeComponent(el, renderer) {
        this.el = el;
        this.renderer = renderer;
        this.minHeight = '10';
        this.initialHeight = 100;
        this.resize = new EventEmitter();
        this.dragging = false;
        this._debug = false;
        this.LOG = new Logger(WarpViewResizeComponent, this._debug);
    }
    Object.defineProperty(WarpViewResizeComponent.prototype, "debug", {
        get: /**
         * @return {?}
         */
        function () {
            return this._debug;
        },
        set: /**
         * @param {?} debug
         * @return {?}
         */
        function (debug) {
            this._debug = debug;
            this.LOG.setDebug(debug);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    WarpViewResizeComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.LOG.debug(['ngAfterViewInit'], this.initialHeight);
        this.renderer.setStyle(this.wrapper.nativeElement, 'height', this.initialHeight + 'px');
        // the click event on the handlebar attach mousemove and mouseup events to document.
        this.handleDiv.nativeElement.addEventListener('mousedown', (/**
         * @param {?} ev
         * @return {?}
         */
        function (ev) {
            if (0 === ev.button) {
                // keep left click only
                _this.moveListener = _this.handleDraggingMove.bind(_this);
                _this.clickUpListener = _this.handleDraggingEnd.bind(_this);
                document.addEventListener('mousemove', _this.moveListener, false);
                document.addEventListener('mouseup', _this.clickUpListener, false);
            }
        }));
    };
    /**
     * @private
     * @return {?}
     */
    WarpViewResizeComponent.prototype.handleDraggingEnd = /**
     * @private
     * @return {?}
     */
    function () {
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
    };
    /**
     * @private
     * @param {?} ev
     * @return {?}
     */
    WarpViewResizeComponent.prototype.handleDraggingMove = /**
     * @private
     * @param {?} ev
     * @return {?}
     */
    function (ev) {
        ev.preventDefault();
        this.LOG.debug(['handleDraggingMove'], ev);
        // compute Y of the parent div top relative to page
        /** @type {?} */
        var yTopParent = this.handleDiv.nativeElement.parentElement.getBoundingClientRect().top
            - document.body.getBoundingClientRect().top;
        // compute new parent height
        /** @type {?} */
        var h = ev.pageY - yTopParent + this.handleDiv.nativeElement.getBoundingClientRect().height / 2;
        if (h < parseInt(this.minHeight, 10)) {
            h = parseInt(this.minHeight, 10);
        }
        // apply new height
        this.renderer.setStyle(this.handleDiv.nativeElement.parentElement, 'height', h + 'px');
        this.LOG.debug(['handleDraggingMove'], h);
        this.resize.emit(h);
    };
    WarpViewResizeComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-resize',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"wrapper\" #wrapper>\n  <ng-content></ng-content>\n  <div class=\"handle\" #handleDiv></div>\n</div>\n",
                    encapsulation: ViewEncapsulation.None,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host .handle,warp-view-resize .handle,warpview-resize .handle{width:100%;height:var(--warp-view-resize-handle-height);background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=);background-color:var(--warp-view-resize-handle-color);background-repeat:no-repeat;background-position:50%;position:absolute;bottom:0}:host .handle:hover,warp-view-resize .handle:hover,warpview-resize .handle:hover{cursor:row-resize}:host .wrapper,warp-view-resize .wrapper,warpview-resize .wrapper{width:100%;position:relative;padding-bottom:var(--warp-view-resize-handle-height);height:100%}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewResizeComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 }
    ]; };
    WarpViewResizeComponent.propDecorators = {
        handleDiv: [{ type: ViewChild, args: ['handleDiv', { static: true },] }],
        wrapper: [{ type: ViewChild, args: ['wrapper', { static: true },] }],
        minHeight: [{ type: Input, args: ['minHeight',] }],
        initialHeight: [{ type: Input, args: ['initialHeight',] }],
        debug: [{ type: Input, args: ['debug',] }],
        resize: [{ type: Output, args: ['resize',] }]
    };
    return WarpViewResizeComponent;
}());
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
var WarpViewSliderComponent = /** @class */ (function () {
    function WarpViewSliderComponent() {
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
    Object.defineProperty(WarpViewSliderComponent.prototype, "min", {
        get: /**
         * @return {?}
         */
        function () {
            return this._min;
        },
        set: /**
         * @param {?} m
         * @return {?}
         */
        function (m) {
            this.LOG.debug(['min'], m);
            this._min = m;
            this.setOptions();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarpViewSliderComponent.prototype, "max", {
        get: /**
         * @return {?}
         */
        function () {
            return this._max;
        },
        set: /**
         * @param {?} m
         * @return {?}
         */
        function (m) {
            this.LOG.debug(['max'], m);
            this._max = m;
            this.setOptions();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarpViewSliderComponent.prototype, "step", {
        get: /**
         * @return {?}
         */
        function () {
            return this._step;
        },
        set: /**
         * @param {?} step
         * @return {?}
         */
        function (step) {
            this.LOG.debug(['step'], step);
            if (this._step !== step) {
                this._step = step;
                this.setOptions();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarpViewSliderComponent.prototype, "debug", {
        get: /**
         * @return {?}
         */
        function () {
            return this._debug;
        },
        set: /**
         * @param {?} debug
         * @return {?}
         */
        function (debug) {
            this._debug = debug;
            this.LOG.setDebug(debug);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    WarpViewSliderComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        this.loaded = false;
        this.setOptions();
    };
    /**
     * @protected
     * @return {?}
     */
    WarpViewSliderComponent.prototype.setOptions = /**
     * @protected
     * @return {?}
     */
    function () {
        var _this = this;
        if (!this._min && !this._max) {
            return;
        }
        this.LOG.debug(['_step'], this._step);
        /** @type {?} */
        var tmpVAl = Math.min(Math.max(this.value || Number.MIN_VALUE, this._min), this._max);
        if (tmpVAl !== this.value && this.loaded) {
            this.change.emit(tmpVAl);
        }
        this.value = tmpVAl;
        this.loaded = true;
        this.LOG.debug(['noUiSlider'], this.slider);
        if (this.slider) {
            if (!this._uiSlider) {
                /** @type {?} */
                var opts = (/** @type {?} */ ({
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
                function (event) {
                    _this.LOG.debug(['onChange'], event);
                    _this.value = parseInt(event[0], 10);
                    _this.change.emit({ value: parseInt(event[0], 10) });
                }));
            }
            else {
                this.updateSliderOptions();
            }
        }
    };
    /**
     * @protected
     * @return {?}
     */
    WarpViewSliderComponent.prototype.updateSliderOptions = /**
     * @protected
     * @return {?}
     */
    function () {
        // tslint:disable-next-line:no-string-literal
        this.slider.nativeElement['noUiSlider'].set([this.value]);
        /** @type {?} */
        var opts = (/** @type {?} */ ({ range: { min: [this._min], max: [this._max] } }));
        if (!!this._step && this._step > 0) {
            opts.step = Math.floor((this._max - this._min) / this._step);
        }
        // tslint:disable-next-line:no-string-literal
        this.slider.nativeElement['noUiSlider'].updateOptions(opts);
    };
    /**
     * @param {?} value
     * @return {?}
     */
    WarpViewSliderComponent.prototype.format = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        if (this.mode !== 'timestamp') {
            return moment(value).utc(true).format('YYYY/MM/DD hh:mm:ss');
        }
        else {
            return value.toString();
        }
    };
    /**
     * @protected
     * @return {?}
     */
    WarpViewSliderComponent.prototype.getFormat = /**
     * @protected
     * @return {?}
     */
    function () {
        var _this = this;
        return {
            to: (/**
             * @param {?} value
             * @return {?}
             */
            function (value) { return _this.format(value); }),
            from: (/**
             * @param {?} value
             * @return {?}
             */
            function (value) { return value.replace(',-', ''); })
        };
    };
    WarpViewSliderComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-slider',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"custom-slider\" *ngIf=\"loaded\">\n  <div style=\"display: flex; width: 100%;justify-content: flex-start;\">\n    <div>{{format(_min)}}</div>\n    <div #slider style=\"flex-grow: 4\"></div>\n    <div>{{format(_max)}}</div>\n  </div>\n</div>\n",
                    encapsulation: ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.noUi-origin{left:100%}.noUi-target{max-width:100%;margin:0 20px 40px}.noUi-connect{left:0;background:var(--warp-slider-connect-color)}.noUi-handle{background:var(--warp-slider-handle-bg-color);border:1px solid var(--warp-slider-handle-color);border-radius:3px;cursor:pointer;box-shadow:var(--warp-slider-handle-shadow)}.noUi-handle:after,.noUi-handle:before{background:var(--warp-slider-handle-color)}.noUi-tooltip{display:none}.noUi-active .noUi-tooltip{display:block}:host .custom-slider{margin-top:50px}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewSliderComponent.ctorParameters = function () { return []; };
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
    return WarpViewSliderComponent;
}());
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
var WarpViewRangeSliderComponent = /** @class */ (function (_super) {
    __extends(WarpViewRangeSliderComponent, _super);
    function WarpViewRangeSliderComponent() {
        var _this = _super.call(this) || this;
        _this.LOG = new Logger(WarpViewRangeSliderComponent, _this.debug);
        _this.LOG.debug(['constructor'], _this.debug);
        return _this;
    }
    /**
     * @return {?}
     */
    WarpViewRangeSliderComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.setOptions();
        this.minValue = this.minValue || this._min;
        this.maxValue = this.maxValue || this._max;
    };
    /**
     * @return {?}
     */
    WarpViewRangeSliderComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        this.loaded = false;
        this.setOptions();
    };
    /**
     * @param {?} val
     * @return {?}
     */
    WarpViewRangeSliderComponent.prototype.onChange = /**
     * @param {?} val
     * @return {?}
     */
    function (val) {
        this.change.emit({ value: this.minValue, highValue: this.maxValue });
        this.LOG.debug(['onChange'], val, { value: this.minValue, highValue: this.maxValue });
    };
    /**
     * @protected
     * @return {?}
     */
    WarpViewRangeSliderComponent.prototype.setOptions = /**
     * @protected
     * @return {?}
     */
    function () {
        var _this = this;
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
                var opts = (/** @type {?} */ ({
                    start: [this.minValue, this.maxValue],
                    connect: true,
                    tooltips: [this.getFormat(), this.getFormat()],
                    range: { min: [this._min], max: [this._max] }
                }));
                if (!!this._step && this._step > 0) {
                    opts.step = Math.floor((this._max - this._min) / this._step);
                }
                /** @type {?} */
                var uiSlider = create(this.slider.nativeElement, opts);
                uiSlider.on('end', (/**
                 * @param {?} event
                 * @return {?}
                 */
                function (event) {
                    _this.LOG.debug(['onChange'], event);
                    _this.change.emit({
                        min: parseInt(event[0], 10),
                        max: parseInt(event[1], 10)
                    });
                }));
            }
            else {
                this.updateSliderOptions();
            }
        }
    };
    WarpViewRangeSliderComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-range-slider',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"custom-slider\" *ngIf=\"loaded\">\n  <div style=\"display: flex; width: 100%;justify-content: flex-start;\">\n    <div>{{format(_min)}}</div>\n    <div #slider style=\"flex-grow: 4\"></div>\n    <div>{{format(_max)}}</div>\n  </div>\n</div>\n",
                    encapsulation: ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.noUi-origin{left:100%}.noUi-target{max-width:100%;margin:0 20px 40px}.noUi-connect{left:0;background:var(--warp-slider-connect-color)}.noUi-handle{background:var(--warp-slider-handle-bg-color);border:1px solid var(--warp-slider-handle-color);border-radius:3px;cursor:pointer;box-shadow:var(--warp-slider-handle-shadow)}.noUi-handle:after,.noUi-handle:before{background:var(--warp-slider-handle-color)}.noUi-tooltip{display:none}.noUi-active .noUi-tooltip{display:block}:host .custom-slider{margin-top:50px}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewRangeSliderComponent.ctorParameters = function () { return []; };
    WarpViewRangeSliderComponent.propDecorators = {
        slider: [{ type: ViewChild, args: ['slider', { static: false },] }],
        minValue: [{ type: Input, args: ['minValue',] }],
        maxValue: [{ type: Input, args: ['maxValue',] }]
    };
    return WarpViewRangeSliderComponent;
}(WarpViewSliderComponent));
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
var WarpViewSpectrumComponent = /** @class */ (function (_super) {
    __extends(WarpViewSpectrumComponent, _super);
    function WarpViewSpectrumComponent(el, renderer, sizeService, ngZone) {
        var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
        _this.el = el;
        _this.renderer = renderer;
        _this.sizeService = sizeService;
        _this.ngZone = ngZone;
        _this.layout = {
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
        _this._type = 'histogram2d';
        _this.visibility = [];
        _this.visibilityStatus = 'unknown';
        _this.maxTick = 0;
        _this.minTick = 0;
        _this.visibleGtsId = [];
        _this.LOG = new Logger(WarpViewSpectrumComponent, _this._debug);
        return _this;
    }
    Object.defineProperty(WarpViewSpectrumComponent.prototype, "type", {
        set: /**
         * @param {?} type
         * @return {?}
         */
        function (type) {
            this._type = type;
            this.drawChart();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} options
     * @return {?}
     */
    WarpViewSpectrumComponent.prototype.update = /**
     * @param {?} options
     * @return {?}
     */
    function (options) {
        this.drawChart();
    };
    /**
     * @private
     * @return {?}
     */
    WarpViewSpectrumComponent.prototype.drawChart = /**
     * @private
     * @return {?}
     */
    function () {
        if (!this.initChart(this.el)) {
            return;
        }
        this.plotlyConfig.scrollZoom = true;
        this.buildGraph();
    };
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    WarpViewSpectrumComponent.prototype.convert = /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    function (data) {
        var _this = this;
        /** @type {?} */
        var type = this._options.histo || { histnorm: 'density', histfunc: 'count' };
        /** @type {?} */
        var dataset = [];
        this.LOG.debug(['convert'], this._options);
        this.visibility = [];
        /** @type {?} */
        var gtsList = GTSLib.flatDeep(GTSLib.flattenGtsIdArray((/** @type {?} */ ([data.data])), 0).res) || [];
        this.maxTick = Number.NEGATIVE_INFINITY;
        this.minTick = Number.POSITIVE_INFINITY;
        this.visibleGtsId = [];
        /** @type {?} */
        var nonPlottable = gtsList.filter((/**
         * @param {?} g
         * @return {?}
         */
        function (g) {
            _this.LOG.debug(['convert'], GTSLib.isGtsToPlot(g));
            return (g.v && !GTSLib.isGtsToPlot(g));
        }));
        gtsList = gtsList.filter((/**
         * @param {?} g
         * @return {?}
         */
        function (g) {
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
        function (gts, i) {
            if (gts.v && GTSLib.isGtsToPlot(gts)) {
                /** @type {?} */
                var label = GTSLib.serializeGtsMetadata(gts);
                /** @type {?} */
                var c = ColorLib.getColor(i, _this._options.scheme);
                /** @type {?} */
                var color = ((data.params || [])[gts.id] || { datasetColor: c }).datasetColor || c;
                /** @type {?} */
                var series_1 = {
                    type: _this._type,
                    histnorm: type.histnorm || 'density',
                    histfunc: type.histfunc || 'count',
                    contours: {
                        showlabels: true,
                        labelfont: {
                            color: 'white'
                        }
                    },
                    colorbar: {
                        tickcolor: _this.getGridColor(_this.el.nativeElement),
                        thickness: 0,
                        tickfont: {
                            color: _this.getLabelColor(_this.el.nativeElement)
                        },
                        x: 1 + gts.id / 20,
                        xpad: 0
                    },
                    showscale: _this.showLegend,
                    colorscale: ColorLib.getColorGradient(gts.id, _this._options.scheme),
                    autocolorscale: false,
                    name: label,
                    text: label,
                    x: [],
                    y: [],
                    line: { color: color },
                    hoverinfo: 'none',
                    connectgaps: false,
                    visible: _this._hiddenData.filter((/**
                     * @param {?} h
                     * @return {?}
                     */
                    function (h) { return h === gts.id; })).length >= 0,
                };
                gts.v.forEach((/**
                 * @param {?} value
                 * @return {?}
                 */
                function (value) {
                    /** @type {?} */
                    var ts = value[0];
                    series_1.y.push(value[value.length - 1]);
                    if (_this._options.timeMode && _this._options.timeMode === 'timestamp') {
                        series_1.x.push(ts);
                    }
                    else {
                        series_1.x.push(moment__default.tz(moment__default.utc(ts / _this.divider), _this._options.timeZone).toISOString());
                    }
                }));
                dataset.push(series_1);
            }
        }));
        this.LOG.debug(['convert', 'dataset'], dataset);
        return dataset;
    };
    /**
     * @private
     * @return {?}
     */
    WarpViewSpectrumComponent.prototype.buildGraph = /**
     * @private
     * @return {?}
     */
    function () {
        this.LOG.debug(['drawChart', 'this.layout'], this.responsive);
        this.LOG.debug(['drawChart', 'this.layout'], this.layout);
        this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig);
        this.layout.showlegend = this.showLegend;
        this.layout.yaxis.color = this.getGridColor(this.el.nativeElement);
        this.layout.xaxis.color = this.getGridColor(this.el.nativeElement);
        this.loading = false;
    };
    WarpViewSpectrumComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-spectrum',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\" #chartContainer>\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-plotly #graph\n                     [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot()\"\n                     (relayout)=\"relayout($event)\" (hover)=\"hover($event)\" (unhover)=\"unhover($event)\"\n                     [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                     [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n  <div #toolTip class=\"tooltip\" [ngStyle]=\"getTooltipPosition()\"></div>\n</div>\n",
                    encapsulation: ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}.tooltip{background-color:var(--warp-view-chart-legend-bg)!important;color:var(--warp-view-chart-legend-color)!important;text-align:left;position:absolute;display:none;padding:10px;border:1px solid grey;border-radius:5px;box-shadow:none;pointer-events:none;font-size:10px;min-width:100px;width:auto;max-width:50%;z-index:999;height:auto!important;left:-1000px}.tooltip .chip{border-radius:50%;background-color:#bbb;display:inline-block;width:5px;height:5px;border:2px solid #454545;margin-top:auto;margin-bottom:auto;vertical-align:middle;cursor:pointer}:host{display:block;height:100%}:host #chartContainer{height:100%}:host #chartContainer div{height:100%}:host div.chart{width:var(--warp-view-chart-width);height:var(--warp-view-chart-height)}:host .executionErrorText{color:red;padding:10px;border-radius:3px;background:#faebd7;position:absolute;top:-30px;border:2px solid red}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewSpectrumComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: SizeService },
        { type: NgZone }
    ]; };
    WarpViewSpectrumComponent.propDecorators = {
        type: [{ type: Input, args: ['type',] }]
    };
    return WarpViewSpectrumComponent;
}(WarpViewComponent));
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
var WarpViewBoxComponent = /** @class */ (function (_super) {
    __extends(WarpViewBoxComponent, _super);
    function WarpViewBoxComponent(el, renderer, sizeService, ngZone) {
        var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
        _this.el = el;
        _this.renderer = renderer;
        _this.sizeService = sizeService;
        _this.ngZone = ngZone;
        _this.layout = {
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
        _this._type = 'box';
        _this.LOG = new Logger(WarpViewBoxComponent, _this._debug);
        return _this;
    }
    Object.defineProperty(WarpViewBoxComponent.prototype, "type", {
        set: /**
         * @param {?} type
         * @return {?}
         */
        function (type) {
            this._type = type;
            this.drawChart();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    WarpViewBoxComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.drawChart();
    };
    /**
     * @param {?} options
     * @return {?}
     */
    WarpViewBoxComponent.prototype.update = /**
     * @param {?} options
     * @return {?}
     */
    function (options) {
        this.drawChart();
    };
    /**
     * @private
     * @return {?}
     */
    WarpViewBoxComponent.prototype.drawChart = /**
     * @private
     * @return {?}
     */
    function () {
        if (!this.initChart(this.el)) {
            return;
        }
        this.plotlyConfig.scrollZoom = true;
        this.buildGraph();
    };
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    WarpViewBoxComponent.prototype.convert = /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    function (data) {
        var _this = this;
        /** @type {?} */
        var dataset = [];
        this.LOG.debug(['convert'], this._options, this._type);
        /** @type {?} */
        var gtsList = GTSLib.flatDeep(GTSLib.flattenGtsIdArray((/** @type {?} */ (data.data)), 0).res);
        gtsList = gtsList.filter((/**
         * @param {?} g
         * @return {?}
         */
        function (g) {
            return (g.v && GTSLib.isGtsToPlot(g));
        }));
        /** @type {?} */
        var pattern = 'YYYY/MM/DD hh:mm:ss';
        /** @type {?} */
        var format = pattern.slice(0, pattern.lastIndexOf(this._options.split || 'D') + 1);
        gtsList.forEach((/**
         * @param {?} gts
         * @param {?} i
         * @return {?}
         */
        function (gts, i) {
            if (gts.v) {
                /** @type {?} */
                var label = GTSLib.serializeGtsMetadata(gts);
                /** @type {?} */
                var c = ColorLib.getColor(gts.id, _this._options.scheme);
                /** @type {?} */
                var color = ((data.params || [])[i] || { datasetColor: c }).datasetColor || c;
                /** @type {?} */
                var series_1 = {
                    type: 'box',
                    boxmean: 'sd',
                    marker: { color: color },
                    name: label,
                    x: _this._type === 'box' ? undefined : [],
                    y: [],
                    //  hoverinfo: 'none',
                    boxpoints: false
                };
                if (!!_this._options.showDots) {
                    series_1.boxpoints = 'all';
                }
                gts.v.forEach((/**
                 * @param {?} value
                 * @return {?}
                 */
                function (value) {
                    series_1.y.push(value[value.length - 1]);
                    if (_this._type === 'box-date') {
                        series_1.x.push(moment__default.tz(moment__default.utc(value[0] / _this.divider), _this._options.timeZone).toISOString());
                    }
                }));
                dataset.push(series_1);
            }
        }));
        this.LOG.debug(['convert', 'dataset'], dataset, format);
        return dataset;
    };
    /**
     * @private
     * @return {?}
     */
    WarpViewBoxComponent.prototype.buildGraph = /**
     * @private
     * @return {?}
     */
    function () {
        this.LOG.debug(['drawChart', 'this.layout'], this.responsive);
        this.LOG.debug(['drawChart', 'this.layout'], this.layout);
        this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig);
        this.layout.showlegend = this.showLegend;
        this.layout.xaxis.showticklabels = this._type === 'box-date';
        this.layout.yaxis.color = this.getGridColor(this.el.nativeElement);
        this.layout.xaxis.color = this.getGridColor(this.el.nativeElement);
        this.loading = false;
    };
    /**
     * @param {?} data
     * @return {?}
     */
    WarpViewBoxComponent.prototype.hover = /**
     * @param {?} data
     * @return {?}
     */
    function (data) {
    };
    WarpViewBoxComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-box',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\" #chartContainer>\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-plotly #graph *ngIf=\"plotlyData?.length > 0\"\n                     [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot()\"\n                     className=\"chart\" (hover)=\"hover($event)\" (unhover)=\"unhover($event)\"\n                     [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                     [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n  <div #toolTip class=\"tooltip\" [ngStyle]=\"getTooltipPosition()\"></div>\n</div>\n",
                    encapsulation: ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}.tooltip{background-color:var(--warp-view-chart-legend-bg)!important;color:var(--warp-view-chart-legend-color)!important;text-align:left;position:absolute;display:none;padding:10px;border:1px solid grey;border-radius:5px;box-shadow:none;pointer-events:none;font-size:10px;min-width:100px;width:auto;max-width:50%;z-index:999;height:auto!important;left:-1000px}.tooltip .chip{border-radius:50%;background-color:#bbb;display:inline-block;width:5px;height:5px;border:2px solid #454545;margin-top:auto;margin-bottom:auto;vertical-align:middle;cursor:pointer}:host{display:block;height:100%}:host #chartContainer{height:100%}:host #chartContainer div{height:100%}:host div.chart{width:var(--warp-view-chart-width);height:var(--warp-view-chart-height)}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewBoxComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: SizeService },
        { type: NgZone }
    ]; };
    WarpViewBoxComponent.propDecorators = {
        type: [{ type: Input, args: ['type',] }]
    };
    return WarpViewBoxComponent;
}(WarpViewComponent));
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
var WarpView3dLineComponent = /** @class */ (function (_super) {
    __extends(WarpView3dLineComponent, _super);
    function WarpView3dLineComponent(el, renderer, sizeService, ngZone) {
        var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
        _this.el = el;
        _this.renderer = renderer;
        _this.sizeService = sizeService;
        _this.ngZone = ngZone;
        _this.layout = {
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
        _this._type = 'line3d';
        _this.LOG = new Logger(WarpView3dLineComponent, _this._debug);
        return _this;
    }
    Object.defineProperty(WarpView3dLineComponent.prototype, "type", {
        set: /**
         * @param {?} type
         * @return {?}
         */
        function (type) {
            this._type = type;
            this.drawChart();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    WarpView3dLineComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.drawChart();
    };
    /**
     * @param {?} options
     * @return {?}
     */
    WarpView3dLineComponent.prototype.update = /**
     * @param {?} options
     * @return {?}
     */
    function (options) {
        this.drawChart();
    };
    /**
     * @private
     * @return {?}
     */
    WarpView3dLineComponent.prototype.drawChart = /**
     * @private
     * @return {?}
     */
    function () {
        if (!this.initChart(this.el)) {
            return;
        }
        this.plotlyConfig.scrollZoom = true;
        this.buildGraph();
    };
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    WarpView3dLineComponent.prototype.convert = /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    function (data) {
        var _this = this;
        /** @type {?} */
        var dataset = [];
        this.LOG.debug(['convert'], data, this._options, this._type);
        GTSLib.flatDeep(GTSLib.flattenGtsIdArray((/** @type {?} */ (data.data)), 0).res)
            .filter((/**
         * @param {?} g
         * @return {?}
         */
        function (g) { return (g.v && GTSLib.isGts(g)); }))
            .forEach((/**
         * @param {?} gts
         * @param {?} i
         * @return {?}
         */
        function (gts, i) {
            if (gts.v) {
                /** @type {?} */
                var label = GTSLib.serializeGtsMetadata(gts);
                /** @type {?} */
                var c = ColorLib.getColor(gts.id, _this._options.scheme);
                /** @type {?} */
                var color = ((data.params || [])[i] || { datasetColor: c }).datasetColor || c;
                /** @type {?} */
                var series_1 = {
                    mode: 'line',
                    type: 'scatter3d',
                    marker: {
                        color: ColorLib.transparentize(color),
                        size: 3,
                        symbol: 'circle',
                        line: {
                            color: color,
                            width: 0
                        }
                    },
                    line: {
                        color: color,
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
                function (value) {
                    if (value.length > 2) { // lat lon
                        series_1.x.push(value[1]);
                        series_1.y.push(value[2]);
                        if (value.length > 4) {
                            series_1.z.push(value[3]);
                        }
                        else {
                            series_1.z.push(0);
                        }
                    }
                    else {
                        series_1.x.push(value[0]);
                        series_1.y.push(value[1]);
                        series_1.z.push(0);
                    }
                }));
                dataset.push(series_1);
            }
        }));
        return dataset;
    };
    /**
     * @private
     * @return {?}
     */
    WarpView3dLineComponent.prototype.buildGraph = /**
     * @private
     * @return {?}
     */
    function () {
        this.LOG.debug(['drawChart', 'this.layout'], this.responsive);
        this.LOG.debug(['drawChart', 'this.layout'], this.layout);
        this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig);
        this.layout.showlegend = this.showLegend;
        this.layout.yaxis.color = this.getGridColor(this.el.nativeElement);
        this.layout.xaxis.color = this.getGridColor(this.el.nativeElement);
        this.layout.zaxis.color = this.getGridColor(this.el.nativeElement);
        this.loading = false;
    };
    WarpView3dLineComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-3d-line',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\" #chartContainer>\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-plotly #graph *ngIf=\"plotlyData?.length > 0\"\n                     [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot()\"\n                     className=\"chart\" (hover)=\"hover($event)\" (unhover)=\"unhover($event)\"\n                     [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                     [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n  <div #toolTip class=\"tooltip\" [ngStyle]=\"getTooltipPosition()\"></div>\n</div>\n",
                    encapsulation: ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}.tooltip{background-color:var(--warp-view-chart-legend-bg)!important;color:var(--warp-view-chart-legend-color)!important;text-align:left;position:absolute;display:none;padding:10px;border:1px solid grey;border-radius:5px;box-shadow:none;pointer-events:none;font-size:10px;min-width:100px;width:auto;max-width:50%;z-index:999;height:auto!important;left:-1000px}.tooltip .chip{border-radius:50%;background-color:#bbb;display:inline-block;width:5px;height:5px;border:2px solid #454545;margin-top:auto;margin-bottom:auto;vertical-align:middle;cursor:pointer}:host{display:block;height:100%}:host #chartContainer{height:100%}:host #chartContainer div{height:100%}:host div.chart{width:var(--warp-view-chart-width);height:var(--warp-view-chart-height)}"]
                }] }
    ];
    /** @nocollapse */
    WarpView3dLineComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: SizeService },
        { type: NgZone }
    ]; };
    WarpView3dLineComponent.propDecorators = {
        type: [{ type: Input, args: ['type',] }]
    };
    return WarpView3dLineComponent;
}(WarpViewComponent));
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
var WarpViewGlobeComponent = /** @class */ (function (_super) {
    __extends(WarpViewGlobeComponent, _super);
    function WarpViewGlobeComponent(el, renderer, sizeService, ngZone) {
        var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
        _this.el = el;
        _this.renderer = renderer;
        _this.sizeService = sizeService;
        _this.ngZone = ngZone;
        _this.layout = {
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
        _this._type = 'scattergeo';
        _this.geoData = [];
        _this.LOG = new Logger(WarpViewGlobeComponent, _this._debug);
        return _this;
    }
    Object.defineProperty(WarpViewGlobeComponent.prototype, "type", {
        set: /**
         * @param {?} type
         * @return {?}
         */
        function (type) {
            this._type = type;
            this.drawChart();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    WarpViewGlobeComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.drawChart();
    };
    /**
     * @param {?} options
     * @return {?}
     */
    WarpViewGlobeComponent.prototype.update = /**
     * @param {?} options
     * @return {?}
     */
    function (options) {
        this.drawChart();
    };
    /**
     * @private
     * @return {?}
     */
    WarpViewGlobeComponent.prototype.drawChart = /**
     * @private
     * @return {?}
     */
    function () {
        if (!this.initChart(this.el)) {
            return;
        }
        this.plotlyConfig.scrollZoom = true;
        this.buildGraph();
    };
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    WarpViewGlobeComponent.prototype.convert = /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    function (data) {
        var _this = this;
        /** @type {?} */
        var dataset = [];
        this.geoData = [];
        this.LOG.debug(['convert'], data, this._options, this._type);
        GTSLib.flatDeep(GTSLib.flattenGtsIdArray((/** @type {?} */ (data.data)), 0).res)
            .filter((/**
         * @param {?} g
         * @return {?}
         */
        function (g) { return (g.v && GTSLib.isGts(g)); }))
            .forEach((/**
         * @param {?} gts
         * @param {?} i
         * @return {?}
         */
        function (gts, i) {
            if (gts.v) {
                /** @type {?} */
                var geoData_1 = { path: [] };
                /** @type {?} */
                var label = GTSLib.serializeGtsMetadata(gts);
                /** @type {?} */
                var c = ColorLib.getColor(gts.id, _this._options.scheme);
                /** @type {?} */
                var color = ((data.params || [])[i] || { datasetColor: c }).datasetColor || c;
                /** @type {?} */
                var series_1 = {
                    mode: 'lines',
                    type: 'scattergeo',
                    marker: {
                        color: ColorLib.transparentize(color),
                        size: 3,
                        symbol: 'circle',
                        line: {
                            color: color,
                            width: 0
                        }
                    },
                    line: {
                        color: color,
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
                function (value) {
                    if (value.length > 2) {
                        series_1.lat.push(value[1]);
                        series_1.lon.push(value[2]);
                        geoData_1.path.push({ lat: value[1], lon: value[2] });
                    }
                }));
                _this.geoData.push(geoData_1);
                dataset.push(series_1);
            }
        }));
        return dataset;
    };
    /**
     * @private
     * @return {?}
     */
    WarpViewGlobeComponent.prototype.buildGraph = /**
     * @private
     * @return {?}
     */
    function () {
        this.LOG.debug(['drawChart', 'this.layout'], this._responsive);
        this.LOG.debug(['drawChart', 'this.layout'], this.layout);
        this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig);
        this.layout.showlegend = this._showLegend;
        /** @type {?} */
        var bounds = MapLib.getBoundsArray(this.geoData, [], [], []);
        this.LOG.debug(['drawChart', 'bounds'], bounds);
        this.layout.geo.lonaxis.color = this.getGridColor(this.el.nativeElement);
        this.layout.geo.lataxis.range = [bounds[0][0], bounds[1][0]];
        this.layout.geo.lonaxis.range = [bounds[0][1], bounds[1][1]];
        this.layout.geo.lataxis.color = this.getGridColor(this.el.nativeElement);
        this.layout = __assign({}, this.layout);
        this.loading = false;
    };
    WarpViewGlobeComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-globe',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\" #chartContainer>\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-plotly #graph *ngIf=\"plotlyData?.length > 0\"\n                     [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot()\"\n                     className=\"chart\" (hover)=\"hover($event)\" (unhover)=\"unhover($event)\"\n                     [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                     [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n  <div #toolTip class=\"tooltip\" [ngStyle]=\"getTooltipPosition()\"></div>\n</div>\n",
                    encapsulation: ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}.tooltip{background-color:var(--warp-view-chart-legend-bg)!important;color:var(--warp-view-chart-legend-color)!important;text-align:left;position:absolute;display:none;padding:10px;border:1px solid grey;border-radius:5px;box-shadow:none;pointer-events:none;font-size:10px;min-width:100px;width:auto;max-width:50%;z-index:999;height:auto!important;left:-1000px}.tooltip .chip{border-radius:50%;background-color:#bbb;display:inline-block;width:5px;height:5px;border:2px solid #454545;margin-top:auto;margin-bottom:auto;vertical-align:middle;cursor:pointer}:host{display:block;height:100%}:host #chartContainer{height:100%}:host #chartContainer div{height:100%}:host div.chart{width:var(--warp-view-chart-width);height:var(--warp-view-chart-height)}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewGlobeComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: SizeService },
        { type: NgZone }
    ]; };
    WarpViewGlobeComponent.propDecorators = {
        type: [{ type: Input, args: ['type',] }]
    };
    return WarpViewGlobeComponent;
}(WarpViewComponent));
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
var WarpViewEventDropComponent = /** @class */ (function (_super) {
    __extends(WarpViewEventDropComponent, _super);
    function WarpViewEventDropComponent(el, renderer, sizeService, ngZone) {
        var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
        _this.el = el;
        _this.renderer = renderer;
        _this.sizeService = sizeService;
        _this.ngZone = ngZone;
        _this.pointHover = new EventEmitter();
        _this.warpViewChartResize = new EventEmitter();
        _this.chartDraw = new EventEmitter();
        _this.boundsDidChange = new EventEmitter();
        _this.visibility = [];
        _this.maxTick = Number.MIN_VALUE;
        _this.minTick = Number.MAX_VALUE;
        _this.visibleGtsId = [];
        _this._type = 'drops';
        _this.eventConf = {
            d3: d3,
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
                function (row) { return row.name; }),
            },
            drop: {
                date: (/**
                 * @param {?} d
                 * @return {?}
                 */
                function (d) { return new Date(d.date); }),
                color: (/**
                 * @param {?} d
                 * @return {?}
                 */
                function (d) { return d.color; }),
                onMouseOver: (/**
                 * @param {?} g
                 * @return {?}
                 */
                function (g) {
                    _this.LOG.debug(['onMouseOver'], g);
                    _this.pointHover.emit({
                        x: event$1.offsetX,
                        y: event$1.offsetY
                    });
                    /** @type {?} */
                    var t = select$1(_this.toolTip.nativeElement);
                    t.transition()
                        .duration(200)
                        .style('opacity', 1)
                        .style('pointer-events', 'auto');
                    t.html("<div class=\"tooltip-body\">\n<b class=\"tooltip-date\">" + (_this._options.timeMode === 'timestamp'
                        ? g.date
                        : (moment__default(g.date.valueOf()).utc().toISOString() || '')) + "</b>\n<div><i class=\"chip\"  style=\"background-color: " + ColorLib.transparentize(g.color, 0.7) + ";border: 2px solid " + g.color + ";\"></i>\n" + GTSLib.formatLabel(g.name) + ": <span class=\"value\">" + g.value + "</span>\n</div></div>")
                        .style('left', event$1.offsetX - 30 + "px")
                        .style('top', event$1.offsetY + 20 + "px");
                }),
                onMouseOut: (/**
                 * @return {?}
                 */
                function () {
                    select(_this.toolTip.nativeElement)
                        .transition()
                        .duration(500)
                        .style('opacity', 0)
                        .style('pointer-events', 'none');
                }),
            },
        };
        _this.LOG = new Logger(WarpViewEventDropComponent, _this._debug);
        return _this;
    }
    Object.defineProperty(WarpViewEventDropComponent.prototype, "type", {
        set: /**
         * @param {?} type
         * @return {?}
         */
        function (type) {
            this._type = type;
            this.drawChart();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarpViewEventDropComponent.prototype, "hiddenData", {
        set: /**
         * @param {?} hiddenData
         * @return {?}
         */
        function (hiddenData) {
            var _this = this;
            /** @type {?} */
            var previousVisibility = JSON.stringify(this.visibility);
            this.LOG.debug(['hiddenData', 'previousVisibility'], previousVisibility);
            this._hiddenData = hiddenData;
            this.visibility = [];
            this.visibleGtsId.forEach((/**
             * @param {?} id
             * @return {?}
             */
            function (id) { return _this.visibility.push(hiddenData.indexOf(id) < 0 && (id !== -1)); }));
            this.LOG.debug(['hiddenData', 'hiddendygraphfullv'], this.visibility);
            /** @type {?} */
            var newVisibility = JSON.stringify(this.visibility);
            this.LOG.debug(['hiddenData', 'json'], previousVisibility, newVisibility);
            if (previousVisibility !== newVisibility) {
                this.drawChart();
                this.LOG.debug(['hiddendygraphtrig', 'destroy'], 'redraw by visibility change');
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    WarpViewEventDropComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this._options = this._options || this.defOptions;
    };
    /**
     * @return {?}
     */
    WarpViewEventDropComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        if (!!this.elemChart) {
            select(this.elemChart.nativeElement).remove();
        }
    };
    /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    WarpViewEventDropComponent.prototype.update = /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    function (options, refresh) {
        this.LOG.debug(['onOptions', 'before'], this._options, options);
        if (!deepEqual(options, this._options)) {
            this.LOG.debug(['options', 'changed'], options);
            this._options = (/** @type {?} */ (ChartLib.mergeDeep(this._options, (/** @type {?} */ (options)))));
        }
        this.drawChart();
    };
    /**
     * @param {?} min
     * @param {?} max
     * @return {?}
     */
    WarpViewEventDropComponent.prototype.updateBounds = /**
     * @param {?} min
     * @param {?} max
     * @return {?}
     */
    function (min, max) {
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
        this.eventConf = __assign({}, this.eventConf);
        this.LOG.debug(['updateBounds'], this.eventConf);
    };
    /**
     * @return {?}
     */
    WarpViewEventDropComponent.prototype.drawChart = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (!this.initChart(this.el)) {
            return;
        }
        this.loading = false;
        this.LOG.debug(['drawChart', 'plotlyData'], this.plotlyData, this._type);
        if (this.elemChart.nativeElement) {
            setTimeout((/**
             * @return {?}
             */
            function () { return select(_this.elemChart.nativeElement).data([_this.plotlyData]).call(eventDrops(_this.eventConf)); }));
            this.loading = false;
            this.chartDraw.emit();
        }
    };
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    WarpViewEventDropComponent.prototype.convert = /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    function (data) {
        var _this = this;
        this.LOG.debug(['convert'], data);
        /** @type {?} */
        var gtsList = GTSLib.flatDeep((/** @type {?} */ (data.data)));
        /** @type {?} */
        var dataList = [];
        this.LOG.debug(['convert', 'gtsList'], gtsList);
        if (!gtsList || gtsList.length === 0 || gtsList[0].length < 2) {
            return;
        }
        gtsList.forEach((/**
         * @param {?} gts
         * @param {?} i
         * @return {?}
         */
        function (gts, i) {
            /** @type {?} */
            var c = ColorLib.getColor(gts.id || i, _this._options.scheme);
            /** @type {?} */
            var color = ((data.params || [])[i] || { datasetColor: c }).datasetColor || c;
            /** @type {?} */
            var dataSet = {
                name: GTSLib.serializeGtsMetadata(gts),
                color: color,
                data: []
            };
            (gts.v || []).forEach((/**
             * @param {?} value
             * @return {?}
             */
            function (value) {
                /** @type {?} */
                var ts = value[0];
                _this.minTick = Math.min(_this.minTick, ts);
                _this.maxTick = Math.max(_this.maxTick, ts);
                if (_this._options.timeMode && _this._options.timeMode === 'timestamp') {
                    dataSet.data.push({ date: ts, color: color, value: value[value.length - 1] });
                }
                else {
                    dataSet.data.push({
                        date: moment__default.tz(moment__default.utc(ts / _this.divider), _this._options.timeZone).toDate(),
                        color: color,
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
    };
    WarpViewEventDropComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-event-drop',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\">\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <div #toolTip class=\"tooltip trimmed\"></div>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div #elemChart style=\"width: 100%;height: 100%\"></div>\n  <div *ngIf=\"!loading && !noData\">\n  </div>\n</div>\n",
                    encapsulation: ViewEncapsulation.None,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}:host,warp-view-event-drop,warpview-event-drop{display:block;height:100%;width:100%}:host #chartContainer,warp-view-event-drop #chartContainer,warpview-event-drop #chartContainer{height:100%;width:100%;position:relative}:host div.chart,warp-view-event-drop div.chart,warpview-event-drop div.chart{width:var(--warp-view-chart-width);height:var(--warp-view-chart-height)}:host .tooltip,warp-view-event-drop .tooltip,warpview-event-drop .tooltip{position:absolute;background-color:var(--warp-view-chart-legend-bg)!important;color:var(--warp-view-chart-legend-color)!important;line-height:1.4rem;padding:10px;border:1px solid grey;border-radius:5px;box-shadow:none;pointer-events:none;font-size:10px;min-width:100px;width:auto;z-index:999;height:auto!important;opacity:0}:host .tooltip .chip,warp-view-event-drop .tooltip .chip,warpview-event-drop .tooltip .chip{border-radius:50%;background-color:#bbb;display:inline-block;width:5px;height:5px;border:2px solid #454545;margin-top:auto;margin-bottom:auto;vertical-align:middle;cursor:pointer}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewEventDropComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: SizeService },
        { type: NgZone }
    ]; };
    WarpViewEventDropComponent.propDecorators = {
        elemChart: [{ type: ViewChild, args: ['elemChart', { static: true },] }],
        type: [{ type: Input, args: ['type',] }],
        hiddenData: [{ type: Input, args: ['hiddenData',] }],
        pointHover: [{ type: Output, args: ['pointHover',] }],
        warpViewChartResize: [{ type: Output, args: ['warpViewChartResize',] }],
        chartDraw: [{ type: Output, args: ['chartDraw',] }],
        boundsDidChange: [{ type: Output, args: ['boundsDidChange',] }]
    };
    return WarpViewEventDropComponent;
}(WarpViewComponent));
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
var WarpViewResultTileComponent = /** @class */ (function (_super) {
    __extends(WarpViewResultTileComponent, _super);
    function WarpViewResultTileComponent(el, renderer, sizeService, ngZone) {
        var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
        _this.el = el;
        _this.renderer = renderer;
        _this.sizeService = sizeService;
        _this.ngZone = ngZone;
        _this.standalone = true;
        _this.pointHover = new EventEmitter();
        _this.warpViewChartResize = new EventEmitter();
        _this.chartDraw = new EventEmitter();
        _this.boundsDidChange = new EventEmitter();
        _this.loading = true;
        _this.graphs = {
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
        _this.LOG = new Logger(WarpViewResultTileComponent, _this._debug);
        return _this;
    }
    Object.defineProperty(WarpViewResultTileComponent.prototype, "type", {
        get: /**
         * @return {?}
         */
        function () {
            if (this.dataModel && this.dataModel.globalParams) {
                return this.dataModel.globalParams.type || this._type || 'plot';
            }
            else {
                return this._type || 'plot';
            }
        },
        set: /**
         * @param {?} type
         * @return {?}
         */
        function (type) {
            this._type = type;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @protected
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    WarpViewResultTileComponent.prototype.update = /**
     * @protected
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    function (options, refresh) {
        var _this = this;
        setTimeout((/**
         * @return {?}
         */
        function () { return _this.loading = true; }));
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
            function () { return _this.loading = false; }));
        }
    };
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    WarpViewResultTileComponent.prototype.convert = /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    function (data) {
        var _this = this;
        setTimeout((/**
         * @return {?}
         */
        function () { return _this.loading = true; }));
        this.LOG.debug(['convert', 'data'], this._data, data);
        this.dataModel = data;
        if (this.dataModel.globalParams) {
            this._unit = this.dataModel.globalParams.unit || this._unit;
            this._type = this.dataModel.globalParams.type || this._type || 'plot';
        }
        this.LOG.debug(['convert', '_type'], this._type);
        return [];
    };
    /**
     * @param {?} event
     * @return {?}
     */
    WarpViewResultTileComponent.prototype.onResized = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.width = event.newWidth;
        this.height = event.newHeight;
        this.LOG.debug(['onResized'], event.newWidth, event.newHeight);
        this.sizeService.change(new Size(this.width, this.height));
    };
    /**
     * @return {?}
     */
    WarpViewResultTileComponent.prototype.chartDrawn = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.LOG.debug(['chartDrawn']);
        setTimeout((/**
         * @return {?}
         */
        function () { return _this.loading = false; }));
        this.chartDraw.emit();
    };
    WarpViewResultTileComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-result-tile',
                    template: "<div class=\"wrapper\" [ngClass]=\"{'full':  responsive}\" (resized)=\"onResized($event)\">\n    <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n    <div style=\"height: 100%\" [hidden]=\"loading\">\n      <warpview-spectrum [debug]=\"debug\" [type]=\"type\" [unit]=\"unit\" [options]=\"_options\"\n                         [showLegend]=\"showLegend\" [data]=\"dataModel\" (chartDraw)=\"chartDrawn()\"\n                         *ngIf=\"graphs['spectrum'].indexOf(type) > -1 && dataModel\"\n                         [responsive]=\"true\"></warpview-spectrum>\n\n      <warpview-chart [debug]=\"debug\" [type]=\"type\" [unit]=\"unit\" [options]=\"_options\"\n                      (chartDraw)=\"chartDrawn()\"\n                      [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                      *ngIf=\"graphs['chart'].indexOf(type) > -1 && dataModel\"\n                      [responsive]=\"true\"></warpview-chart>\n\n      <warpview-plot [debug]=\"debug\" [type]=\"type\" [unit]=\"unit\" [options]=\"_options\"\n                     (chartDraw)=\"chartDrawn()\"\n                     [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                     *ngIf=\"graphs['plot'].indexOf(type) > -1 && dataModel\"\n                     [responsive]=\"true\"></warpview-plot>\n\n      <warpview-bar [debug]=\"debug\" [unit]=\"unit\" [options]=\"_options\"\n                    (chartDraw)=\"chartDrawn()\"\n                    [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                    *ngIf=\"graphs['bar'].indexOf(type) > -1 && dataModel\"\n                    [responsive]=\"true\"></warpview-bar>\n\n      <warpview-bubble [debug]=\"debug\" [unit]=\"unit\" [options]=\"_options\"\n                       (chartDraw)=\"chartDrawn()\"\n                       [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                       *ngIf=\"graphs['bubble'].indexOf(type) > -1 && dataModel\"\n                       [responsive]=\"true\"></warpview-bubble>\n\n      <warpview-datagrid [debug]=\"debug\" [options]=\"_options\"\n                         (chartDraw)=\"chartDrawn()\"\n                         [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                         *ngIf=\"graphs['datagrid'].indexOf(type) > -1 && dataModel\"\n                         [responsive]=\"true\"></warpview-datagrid>\n\n      <warpview-display [debug]=\"debug\" [options]=\"_options\"\n                        (chartDraw)=\"chartDrawn()\"\n                        [showLegend]=\"showLegend\" [data]=\"dataModel\" [unit]=\"unit\"\n                        *ngIf=\"graphs['display'].indexOf(type) > -1 && dataModel\"\n                        [responsive]=\"true\"></warpview-display>\n\n      <warpview-drill-down [debug]=\"debug\" [options]=\"_options\"\n                           (chartDraw)=\"chartDrawn()\"\n                           [showLegend]=\"showLegend\" [data]=\"dataModel\" [unit]=\"unit\"\n                           *ngIf=\"graphs['drilldown'].indexOf(type) > -1 && dataModel\"\n                           [responsive]=\"true\"></warpview-drill-down>\n\n      <warpview-gts-tree *ngIf=\"graphs['gts-tree'].indexOf(type) > -1 && dataModel\"\n                         (chartDraw)=\"chartDrawn()\"\n                         [responsive]=\"true\" [debug]=\"debug\" [data]=\"dataModel\"\n                         [options]=\"_options\"></warpview-gts-tree>\n\n      <warpview-image *ngIf=\"graphs['image'].indexOf(type) > -1 && dataModel\"\n                      (chartDraw)=\"chartDrawn()\"\n                      [responsive]=\"true\" [debug]=\"debug\" [data]=\"dataModel\" [options]=\"_options\"></warpview-image>\n\n      <warpview-map *ngIf=\"graphs['map'].indexOf(type) > -1 && dataModel\" [responsive]=\"true\" [debug]=\"debug\"\n                    (chartDraw)=\"chartDrawn()\"\n                    [data]=\"dataModel\" [options]=\"_options\"></warpview-map>\n\n      <warpview-pie [debug]=\"debug\" [type]=\"type\" [unit]=\"unit\" [options]=\"_options\"\n                    (chartDraw)=\"chartDrawn()\"\n                    [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                    *ngIf=\"graphs['pie'].indexOf(type) > -1 && dataModel\"\n                    [responsive]=\"true\"></warpview-pie>\n\n      <warpview-gauge [debug]=\"debug\" [type]=\"type\" [unit]=\"unit\" [options]=\"_options\"\n                      (chartDraw)=\"chartDrawn()\"\n                      [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                      *ngIf=\"graphs['gauge'].indexOf(type) > -1 && dataModel\"\n                      [responsive]=\"true\"></warpview-gauge>\n\n      <warpview-annotation [debug]=\"debug\" [unit]=\"unit\" [options]=\"_options\"\n                           (chartDraw)=\"chartDrawn()\"\n                           [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                           [standalone]=\"true\" [type]=\"type\"\n                           *ngIf=\"graphs['annotation'].indexOf(type) > -1 && dataModel\"\n                           [responsive]=\"true\"></warpview-annotation>\n\n      <warpview-event-drop [debug]=\"debug\" [unit]=\"unit\" [options]=\"_options\"\n                           (chartDraw)=\"chartDrawn()\"\n                           [showLegend]=\"showLegend\" [data]=\"dataModel\" [type]=\"type\"\n                           *ngIf=\"graphs['drops'].indexOf(type) > -1 && dataModel\"\n                           [responsive]=\"true\"></warpview-event-drop>\n\n      <warpview-polar [debug]=\"debug\" [unit]=\"unit\" [options]=\"_options\"\n                      (chartDraw)=\"chartDrawn()\"\n                      [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                      *ngIf=\"graphs['polar'].indexOf(type) > -1 && dataModel\"\n                      [responsive]=\"true\"></warpview-polar>\n\n      <warpview-radar [debug]=\"debug\" [unit]=\"unit\" [options]=\"_options\"\n                      (chartDraw)=\"chartDrawn()\"\n                      [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                      *ngIf=\"graphs['radar'].indexOf(type) > -1 && dataModel\"\n                      [responsive]=\"true\"></warpview-radar>\n\n      <warpview-box [debug]=\"debug\" [unit]=\"unit\" [options]=\"_options\"\n                    (chartDraw)=\"chartDrawn()\"\n                    [showLegend]=\"showLegend\" [data]=\"dataModel\" [type]=\"type\"\n                    *ngIf=\"graphs['box'].indexOf(type) > -1 && dataModel\"\n                    [responsive]=\"true\"></warpview-box>\n\n      <warpview-3d-line [debug]=\"debug\" [unit]=\"unit\" [options]=\"_options\"\n                        (chartDraw)=\"chartDrawn()\"\n                        [showLegend]=\"showLegend\" [data]=\"dataModel\" [type]=\"type\"\n                        *ngIf=\"graphs['line3d'].indexOf(type) > -1 && dataModel\"\n                        [responsive]=\"true\"></warpview-3d-line>\n      <warpview-globe [debug]=\"debug\" [unit]=\"unit\" [options]=\"_options\"\n                      (chartDraw)=\"chartDrawn()\"\n                      [showLegend]=\"showLegend\" [data]=\"dataModel\" [type]=\"type\"\n                      *ngIf=\"graphs['globe'].indexOf(type) > -1 && dataModel\"\n                      [responsive]=\"true\"></warpview-globe>\n    </div>\n</div>\n",
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host,warp-view-result-tile,warpview-result-tile{width:var(--warp-view-tile-width,100%);max-height:var(--warp-view-tile-height,100%);overflow:auto;min-width:var(--warp-view-tile-width,100%);min-height:var(--warp-view-tile-height,100%)}:host .error,warp-view-result-tile .error,warpview-result-tile .error{width:100%;text-align:center;color:#dc3545;font-weight:700}:host .wrapper,warp-view-result-tile .wrapper,warpview-result-tile .wrapper{opacity:1;min-height:50px;width:var(--warp-view-tile-width,100%);height:var(--warp-view-tile-height,100%)}:host .wrapper.full,warp-view-result-tile .wrapper.full,warpview-result-tile .wrapper.full{width:100%;height:100%}:host .wrapper .tilewrapper,warp-view-result-tile .wrapper .tilewrapper,warpview-result-tile .wrapper .tilewrapper{width:100%;height:100%}:host .wrapper .tilewrapper .tile,warp-view-result-tile .wrapper .tilewrapper .tile,warpview-result-tile .wrapper .tilewrapper .tile{width:100%;height:calc(var(--warp-view-tile-height,100%) - 40px);overflow-y:auto;overflow-x:hidden}:host .wrapper .tilewrapper .notitle,warp-view-result-tile .wrapper .tilewrapper .notitle,warpview-result-tile .wrapper .tilewrapper .notitle{height:100%;overflow:hidden}:host .wrapper .tilewrapper h1,warp-view-result-tile .wrapper .tilewrapper h1,warpview-result-tile .wrapper .tilewrapper h1{font-size:20px;padding:5px;margin:0;color:var(--warp-view-font-color)}:host .wrapper .tilewrapper h1 small,warp-view-result-tile .wrapper .tilewrapper h1 small,warpview-result-tile .wrapper .tilewrapper h1 small{font-size:10px;margin-left:10px}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewResultTileComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: SizeService },
        { type: NgZone }
    ]; };
    WarpViewResultTileComponent.propDecorators = {
        type: [{ type: Input, args: ['type',] }],
        standalone: [{ type: Input, args: ['standalone',] }],
        pointHover: [{ type: Output, args: ['pointHover',] }],
        warpViewChartResize: [{ type: Output, args: ['warpViewChartResize',] }],
        chartDraw: [{ type: Output, args: ['chartDraw',] }],
        boundsDidChange: [{ type: Output, args: ['boundsDidChange',] }]
    };
    return WarpViewResultTileComponent;
}(WarpViewComponent));
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
var WarpViewAngularModule = /** @class */ (function () {
    function WarpViewAngularModule() {
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
    return WarpViewAngularModule;
}());

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
