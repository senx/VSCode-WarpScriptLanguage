/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
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
import { Component, ElementRef, EventEmitter, Input, NgZone, Output, Renderer2, ViewEncapsulation } from '@angular/core';
import { GTSLib } from '../../utils/gts.lib';
import moment from 'moment-timezone';
import { ChartBounds } from '../../model/chartBounds';
import { ColorLib } from '../../utils/color-lib';
import { WarpViewComponent } from '../warp-view-component';
import { SizeService } from '../../services/resize.service';
import { Logger } from '../../utils/logger';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Timsort } from '../../utils/timsort';
var WarpViewChartComponent = /** @class */ (function (_super) {
    tslib_1.__extends(WarpViewChartComponent, _super);
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
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
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
            this.layout.xaxis.tick0 = moment.tz(this.minTick / this.divider, this._options.timeZone).toISOString(true);
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
            x.tick0 = moment.tz(min / this.divider, this._options.timeZone).toISOString(true);
            x.range = [
                moment.tz(min / this.divider, this._options.timeZone).toISOString(true),
                moment.tz(max / this.divider, this._options.timeZone).toISOString(true)
            ];
        }
        this.layout.xaxis = x;
        this.layout = tslib_1.__assign({}, this.layout);
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
                    min: moment.tz(min, this._options.timeZone).valueOf(),
                    max: moment.tz(max, this._options.timeZone).valueOf(),
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
                            function (t) { return moment.utc(t / _this.divider).tz(_this._options.timeZone).toISOString(); }));
                        }
                        else {
                            series.x = ticks.map((/**
                             * @param {?} t
                             * @return {?}
                             */
                            function (t) { return moment.utc(t / _this.divider).toISOString(); }));
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
            this.chartBounds.tsmin = moment.tz(moment(this.chartBounds.msmin), this._options.timeZone).valueOf() * this.divider;
            this.chartBounds.tsmax = moment.tz(moment(this.chartBounds.msmax), this._options.timeZone).valueOf() * this.divider;
        }
        else if (data['xaxis.range[0]'] && data['xaxis.range[1]']) {
            this.LOG.debug(['relayout', 'updateBounds', 'xaxis.range[x]'], data['xaxis.range[0]']);
            this.chartBounds.msmin = data['xaxis.range[0]'];
            this.chartBounds.msmax = data['xaxis.range[1]'];
            this.chartBounds.tsmin = moment.tz(moment(this.chartBounds.msmin), this._options.timeZone).valueOf() * this.divider;
            this.chartBounds.tsmax = moment.tz(moment(this.chartBounds.msmax), this._options.timeZone).valueOf() * this.divider;
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
        this.LOG.debug(['updateBounds'], moment.tz(min, this._options.timeZone).toISOString(), moment.tz(max, this._options.timeZone).toISOString());
        if (this._options.timeMode && this._options.timeMode === 'timestamp') {
            this.layout.xaxis.range = [min, max];
            this.layout.xaxis.tick0 = min;
        }
        else {
            this.layout.xaxis.range = [
                moment.tz(min, this._options.timeZone).toISOString(),
                moment.tz(max, this._options.timeZone).toISOString()
            ];
            this.layout.xaxis.tick0 = moment.tz(min, this._options.timeZone).toISOString();
        }
        this.layout = tslib_1.__assign({}, this.layout);
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
            x.tick0 = moment.tz(this.minTick / this.divider, this._options.timeZone).toISOString(true);
            x.range = [
                moment.tz(this.minTick / this.divider, this._options.timeZone).toISOString(true),
                moment.tz(this.maxTick / this.divider, this._options.timeZone).toISOString(true)
            ];
        }
        this.layout.xaxis = x;
        this.layout = tslib_1.__assign({}, this.layout);
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
export { WarpViewChartComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LWNoYXJ0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzZW54L3dhcnB2aWV3LyIsInNvdXJjZXMiOlsic3JjL2xpYi9lbGVtZW50cy93YXJwLXZpZXctY2hhcnQvd2FycC12aWV3LWNoYXJ0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQVUsTUFBTSxFQUFFLFNBQVMsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUcvSCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDM0MsT0FBTyxNQUFNLE1BQU0saUJBQWlCLENBQUM7QUFDckMsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBQ3BELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQyxPQUFPLEVBQWtCLGlCQUFpQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDMUUsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBQzFELE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUMxQyxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzdCLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUM1QyxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFFNUM7SUFNNEMsa0RBQWlCO0lBcUYzRCxnQ0FDUyxFQUFjLEVBQ2QsUUFBbUIsRUFDbkIsV0FBd0IsRUFDeEIsTUFBYztRQUp2QixZQU1FLGtCQUFNLEVBQUUsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLE1BQU0sQ0FBQyxTQUV6QztRQVBRLFFBQUUsR0FBRixFQUFFLENBQVk7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NENBQXVDOztJQUN2QyxpREFBcUU7O0lBQ3JFLDRDQUEyRDs7SUFDM0QscURBQTZFOzs7OztJQUc3RSx1Q0FBdUI7Ozs7O0lBQ3ZCLDRDQUFtQzs7Ozs7SUFDbkMseUNBQW9COzs7OztJQUNwQix5Q0FBb0I7Ozs7O0lBQ3BCLDhDQUEwQjs7Ozs7SUFDMUIsdUNBQW1COzs7OztJQUNuQiw2Q0FBeUI7Ozs7O0lBQ3pCLDZDQUFxRDs7Ozs7SUFDckQsa0RBQXNEOzs7OztJQUN0RCxtREFBa0M7Ozs7O0lBQ2xDLDRDQUEyQjs7Ozs7SUFDM0IsOENBQTZCOztJQUM3Qix5Q0FBZ0I7O0lBQ2hCLGlEQUEwQzs7SUFDMUMsK0NBQStEOztJQUMvRCx3Q0FxQkU7Ozs7O0lBQ0YsNkNBQXlCOztJQU92QixvQ0FBcUI7O0lBQ3JCLDBDQUEwQjs7SUFDMUIsNkNBQStCOztJQUMvQix3Q0FBcUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogIENvcHlyaWdodCAyMDIwICBTZW5YIFMuQS5TLlxuICpcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50LCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIElucHV0LCBOZ1pvbmUsIE9uSW5pdCwgT3V0cHV0LCBSZW5kZXJlcjIsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7RGF0YU1vZGVsfSBmcm9tICcuLi8uLi9tb2RlbC9kYXRhTW9kZWwnO1xuaW1wb3J0IHtHVFN9IGZyb20gJy4uLy4uL21vZGVsL0dUUyc7XG5pbXBvcnQge0dUU0xpYn0gZnJvbSAnLi4vLi4vdXRpbHMvZ3RzLmxpYic7XG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudC10aW1lem9uZSc7XG5pbXBvcnQge0NoYXJ0Qm91bmRzfSBmcm9tICcuLi8uLi9tb2RlbC9jaGFydEJvdW5kcyc7XG5pbXBvcnQge0NvbG9yTGlifSBmcm9tICcuLi8uLi91dGlscy9jb2xvci1saWInO1xuaW1wb3J0IHtWaXNpYmlsaXR5U3RhdGUsIFdhcnBWaWV3Q29tcG9uZW50fSBmcm9tICcuLi93YXJwLXZpZXctY29tcG9uZW50JztcbmltcG9ydCB7U2l6ZVNlcnZpY2V9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3Jlc2l6ZS5zZXJ2aWNlJztcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICcuLi8uLi91dGlscy9sb2dnZXInO1xuaW1wb3J0IHtTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7ZGVib3VuY2VUaW1lfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge1RpbXNvcnR9IGZyb20gJy4uLy4uL3V0aWxzL3RpbXNvcnQnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICd3YXJwdmlldy1jaGFydCcsXG4gIHRlbXBsYXRlVXJsOiAnLi93YXJwLXZpZXctY2hhcnQuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi93YXJwLXZpZXctY2hhcnQuY29tcG9uZW50LnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uU2hhZG93RG9tXG59KVxuZXhwb3J0IGNsYXNzIFdhcnBWaWV3Q2hhcnRDb21wb25lbnQgZXh0ZW5kcyBXYXJwVmlld0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgQElucHV0KCdoaWRkZW5EYXRhJykgc2V0IGhpZGRlbkRhdGEoaGlkZGVuRGF0YTogbnVtYmVyW10pIHtcbiAgICBjb25zdCBwcmV2aW91c1Zpc2liaWxpdHkgPSBKU09OLnN0cmluZ2lmeSh0aGlzLnZpc2liaWxpdHkpO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnaGlkZGVuRGF0YScsICdwcmV2aW91c1Zpc2liaWxpdHknXSwgcHJldmlvdXNWaXNpYmlsaXR5KTtcbiAgICB0aGlzLl9oaWRkZW5EYXRhID0gaGlkZGVuRGF0YTtcbiAgICB0aGlzLnZpc2liaWxpdHkgPSBbXTtcbiAgICB0aGlzLnZpc2libGVHdHNJZC5mb3JFYWNoKGlkID0+IHRoaXMudmlzaWJpbGl0eS5wdXNoKGhpZGRlbkRhdGEuaW5kZXhPZihpZCkgPCAwICYmIChpZCAhPT0gLTEpKSk7XG4gICAgdGhpcy5MT0cuZGVidWcoWydoaWRkZW5EYXRhJywgJ2hpZGRlbmR5Z3JhcGhmdWxsdiddLCB0aGlzLnZpc2liaWxpdHkpO1xuICAgIGNvbnN0IG5ld1Zpc2liaWxpdHkgPSBKU09OLnN0cmluZ2lmeSh0aGlzLnZpc2liaWxpdHkpO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnaGlkZGVuRGF0YScsICdqc29uJ10sIHByZXZpb3VzVmlzaWJpbGl0eSwgbmV3VmlzaWJpbGl0eSwgdGhpcy5faGlkZGVuRGF0YSk7XG4gICAgaWYgKHByZXZpb3VzVmlzaWJpbGl0eSAhPT0gbmV3VmlzaWJpbGl0eSkge1xuICAgICAgY29uc3QgdmlzaWJsZSA9IFtdO1xuICAgICAgY29uc3QgaGlkZGVuID0gW107XG4gICAgICAodGhpcy5ndHNJZCB8fCBbXSkuZm9yRWFjaCgoaWQsIGkpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuX2hpZGRlbkRhdGEuaW5kZXhPZihpZCkgPiAtMSkge1xuICAgICAgICAgIGhpZGRlbi5wdXNoKGkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZpc2libGUucHVzaChpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBpZiAodmlzaWJsZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRoaXMuZ3JhcGgucmVzdHlsZUNoYXJ0KHt2aXNpYmxlOiB0cnVlfSwgdmlzaWJsZSk7XG4gICAgICB9XG4gICAgICBpZiAoaGlkZGVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGhpcy5ncmFwaC5yZXN0eWxlQ2hhcnQoe3Zpc2libGU6IGZhbHNlfSwgaGlkZGVuKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsnaGlkZGVuZHlncmFwaHRyaWcnLCAnZGVzdHJveSddLCAncmVkcmF3IGJ5IHZpc2liaWxpdHkgY2hhbmdlJywgdmlzaWJsZSwgaGlkZGVuKTtcbiAgICB9XG4gIH1cblxuICBASW5wdXQoJ3R5cGUnKSBzZXQgdHlwZSh0eXBlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl90eXBlID0gdHlwZTtcbiAgICB0aGlzLmRyYXdDaGFydCgpO1xuICB9XG5cbiAgQElucHV0KCdzdGFuZGFsb25lJykgc3RhbmRhbG9uZSA9IHRydWU7XG4gIEBPdXRwdXQoJ2JvdW5kc0RpZENoYW5nZScpIGJvdW5kc0RpZENoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCdwb2ludEhvdmVyJykgcG9pbnRIb3ZlciA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCd3YXJwVmlld0NoYXJ0UmVzaXplJykgd2FycFZpZXdDaGFydFJlc2l6ZSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lXG4gIHByaXZhdGUgX3R5cGUgPSAnbGluZSc7XG4gIHByaXZhdGUgdmlzaWJpbGl0eTogYm9vbGVhbltdID0gW107XG4gIHByaXZhdGUgbWF4VGljayA9IDA7XG4gIHByaXZhdGUgbWluVGljayA9IDA7XG4gIHByaXZhdGUgdmlzaWJsZUd0c0lkID0gW107XG4gIHByaXZhdGUgZ3RzSWQgPSBbXTtcbiAgcHJpdmF0ZSBkYXRhSGFzaHNldCA9IHt9O1xuICBwcml2YXRlIGNoYXJ0Qm91bmRzOiBDaGFydEJvdW5kcyA9IG5ldyBDaGFydEJvdW5kcygpO1xuICBwcml2YXRlIHZpc2liaWxpdHlTdGF0dXM6IFZpc2liaWxpdHlTdGF0ZSA9ICd1bmtub3duJztcbiAgcHJpdmF0ZSBhZnRlckJvdW5kc1VwZGF0ZSA9IGZhbHNlO1xuICBwcml2YXRlIG1hcmdpbkxlZnQ6IG51bWJlcjtcbiAgcHJpdmF0ZSBtYXhQbG90dGFibGUgPSAxMDAwMDtcbiAgcGFyc2luZyA9IGZhbHNlO1xuICB1bmhpZ2hsaXRlQ3VydmUgPSBuZXcgU3ViamVjdDxudW1iZXJbXT4oKTtcbiAgaGlnaGxpdGVDdXJ2ZSA9IG5ldyBTdWJqZWN0PHsgb246IG51bWJlcltdLCBvZmY6IG51bWJlcltdIH0+KCk7XG4gIGxheW91dDogUGFydGlhbDxhbnk+ID0ge1xuICAgIHNob3dsZWdlbmQ6IGZhbHNlLFxuICAgIGF1dG9zaXplOiB0cnVlLFxuICAgIGhvdmVybW9kZTogJ3gnLFxuICAgIGhvdmVyZGlzdGFuY2U6IDIwLFxuICAgIHhheGlzOiB7XG4gICAgICBmb250OiB7fVxuICAgIH0sXG4gICAgeWF4aXM6IHtcbiAgICAgIGV4cG9uZW50Zm9ybWF0OiAnbm9uZScsXG4gICAgICBmaXhlZHJhbmdlOiB0cnVlLFxuICAgICAgYXV0b21hcmdpbjogdHJ1ZSxcbiAgICAgIHNob3dsaW5lOiB0cnVlLFxuICAgICAgZm9udDoge31cbiAgICB9LFxuICAgIG1hcmdpbjoge1xuICAgICAgdDogMCxcbiAgICAgIGI6IDMwLFxuICAgICAgcjogMTAsXG4gICAgICBsOiA1MFxuICAgIH0sXG4gIH07XG4gIHByaXZhdGUgaGlnaGxpZ2h0ZWQ6IGFueTtcblxuICB1cGRhdGUob3B0aW9ucywgcmVmcmVzaCk6IHZvaWQge1xuICAgIHRoaXMuZHJhd0NoYXJ0KHJlZnJlc2gpO1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGVsOiBFbGVtZW50UmVmLFxuICAgIHB1YmxpYyByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHB1YmxpYyBzaXplU2VydmljZTogU2l6ZVNlcnZpY2UsXG4gICAgcHVibGljIG5nWm9uZTogTmdab25lXG4gICkge1xuICAgIHN1cGVyKGVsLCByZW5kZXJlciwgc2l6ZVNlcnZpY2UsIG5nWm9uZSk7XG4gICAgdGhpcy5MT0cgPSBuZXcgTG9nZ2VyKFdhcnBWaWV3Q2hhcnRDb21wb25lbnQsIHRoaXMuX2RlYnVnKTtcbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuX29wdGlvbnMgPSB0aGlzLl9vcHRpb25zIHx8IHRoaXMuZGVmT3B0aW9ucztcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBnZXRUaW1lQ2xpcCgpOiBQcm9taXNlPENoYXJ0Qm91bmRzPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPENoYXJ0Qm91bmRzPihyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsnZ2V0VGltZUNsaXAnXSwgdGhpcy5jaGFydEJvdW5kcyk7XG4gICAgICByZXNvbHZlKHRoaXMuY2hhcnRCb3VuZHMpO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIHJlc2l6ZShuZXdIZWlnaHQ6IG51bWJlcikge1xuICAgIHRoaXMuaGVpZ2h0ID0gbmV3SGVpZ2h0O1xuICAgIHRoaXMubGF5b3V0LmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuICAgIGlmICh0aGlzLl9vcHRpb25zLnNob3dSYW5nZVNlbGVjdG9yKSB7XG4gICAgICB0aGlzLmxheW91dC54YXhpcy5yYW5nZXNsaWRlciA9IHtcbiAgICAgICAgYmdjb2xvcjogJ3RyYW5zcGFyZW50JyxcbiAgICAgICAgdGhpY2tuZXNzOiA0MCAvIHRoaXMuaGVpZ2h0XG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIGRyYXdDaGFydChyZXBhcnNlTmV3RGF0YTogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgdGhpcy5MT0cuZGVidWcoWydkcmF3Q2hhcnQnLCAndGhpcy5sYXlvdXQnLCAndGhpcy5vcHRpb25zJ10sIHRoaXMubGF5b3V0LCB0aGlzLl9vcHRpb25zKTtcbiAgICBpZiAoIXRoaXMuaW5pdENoYXJ0KHRoaXMuZWwpKSB7XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RyYXdDaGFydCcsICdpbml0Q2hhcnQnXSwgdGhpcy5fb3B0aW9ucyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucGxvdGx5Q29uZmlnLnNjcm9sbFpvb20gPSB0cnVlO1xuICAgIGlmICghIXRoaXMuX29wdGlvbnMudGltZU1vZGUgJiYgdGhpcy5fb3B0aW9ucy50aW1lTW9kZSA9PT0gJ3RpbWVzdGFtcCcpIHtcbiAgICAgIHRoaXMubGF5b3V0LnhheGlzLnR5cGUgPSAnbGluZWFyJztcbiAgICAgIHRoaXMubGF5b3V0LnhheGlzLnRpY2swID0gdGhpcy5taW5UaWNrIC8gdGhpcy5kaXZpZGVyO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxheW91dC54YXhpcy50eXBlID0gJ2RhdGUnO1xuICAgICAgdGhpcy5sYXlvdXQueGF4aXMudGljazAgPSBtb21lbnQudHoodGhpcy5taW5UaWNrIC8gdGhpcy5kaXZpZGVyLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKS50b0lTT1N0cmluZyh0cnVlKTtcbiAgICB9XG4gICAgdGhpcy5sYXlvdXQueWF4aXMuZ3JpZGNvbG9yID0gdGhpcy5nZXRHcmlkQ29sb3IodGhpcy5lbC5uYXRpdmVFbGVtZW50KTtcbiAgICB0aGlzLmxheW91dC54YXhpcy5ncmlkY29sb3IgPSB0aGlzLmdldEdyaWRDb2xvcih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgIHRoaXMubGF5b3V0LnlheGlzLnplcm9saW5lY29sb3IgPSB0aGlzLmdldEdyaWRDb2xvcih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgIHRoaXMubGF5b3V0LnhheGlzLnplcm9saW5lY29sb3IgPSB0aGlzLmdldEdyaWRDb2xvcih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgIHRoaXMubGF5b3V0Lm1hcmdpbi50ID0gdGhpcy5zdGFuZGFsb25lID8gMjAgOiAxMDtcbiAgICB0aGlzLmxheW91dC5zaG93bGVnZW5kID0gdGhpcy5fc2hvd0xlZ2VuZDtcbiAgICBpZiAoIXRoaXMuX3Jlc3BvbnNpdmUpIHtcbiAgICAgIHRoaXMubGF5b3V0LndpZHRoID0gdGhpcy53aWR0aDtcbiAgICAgIHRoaXMubGF5b3V0LmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuICAgIH1cbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RyYXdDaGFydCcsICd0aGlzLm9wdGlvbnMnXSwgdGhpcy5sYXlvdXQsIHRoaXMuX29wdGlvbnMpO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZHJhd0NoYXJ0JywgJ3RoaXMubGF5b3V0J10sIHRoaXMubGF5b3V0KTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RyYXdDaGFydCcsICd0aGlzLnBsb3RseUNvbmZpZyddLCB0aGlzLnBsb3RseUNvbmZpZyk7XG4gICAgaWYgKHRoaXMuX29wdGlvbnMuc2hvd1JhbmdlU2VsZWN0b3IpIHtcbiAgICAgIHRoaXMubGF5b3V0LnhheGlzLnJhbmdlc2xpZGVyID0ge1xuICAgICAgICBiZ2NvbG9yOiAndHJhbnNwYXJlbnQnLFxuICAgICAgICB0aGlja25lc3M6IDQwIC8gdGhpcy5oZWlnaHRcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubGF5b3V0Lm1hcmdpbi5iID0gMzA7XG4gICAgfVxuICAgIGNvbnN0IHg6IGFueSA9IHtcbiAgICAgIHRpY2swOiB1bmRlZmluZWQsXG4gICAgICByYW5nZTogW10sXG4gICAgfTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RyYXdDaGFydCcsICd1cGRhdGVCb3VuZHMnXSwgdGhpcy5jaGFydEJvdW5kcyk7XG4gICAgY29uc3QgbWluID0gdGhpcy5jaGFydEJvdW5kcy50c21pbiB8fCB0aGlzLm1pblRpY2s7XG4gICAgY29uc3QgbWF4ID0gdGhpcy5jaGFydEJvdW5kcy50c21heCB8fCB0aGlzLm1heFRpY2s7XG4gICAgaWYgKHRoaXMuX29wdGlvbnMudGltZU1vZGUgJiYgdGhpcy5fb3B0aW9ucy50aW1lTW9kZSA9PT0gJ3RpbWVzdGFtcCcpIHtcbiAgICAgIHgudGljazAgPSBtaW4gLyB0aGlzLmRpdmlkZXI7XG4gICAgICB4LnJhbmdlID0gW21pbiwgbWF4XTtcbiAgICB9IGVsc2Uge1xuICAgICAgeC50aWNrMCA9IG1vbWVudC50eihtaW4gLyB0aGlzLmRpdmlkZXIsIHRoaXMuX29wdGlvbnMudGltZVpvbmUpLnRvSVNPU3RyaW5nKHRydWUpO1xuICAgICAgeC5yYW5nZSA9IFtcbiAgICAgICAgbW9tZW50LnR6KG1pbiAvIHRoaXMuZGl2aWRlciwgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSkudG9JU09TdHJpbmcodHJ1ZSksXG4gICAgICAgIG1vbWVudC50eihtYXggLyB0aGlzLmRpdmlkZXIsIHRoaXMuX29wdGlvbnMudGltZVpvbmUpLnRvSVNPU3RyaW5nKHRydWUpXG4gICAgICBdO1xuICAgIH1cbiAgICB0aGlzLmxheW91dC54YXhpcyA9IHg7XG4gICAgdGhpcy5sYXlvdXQgPSB7Li4udGhpcy5sYXlvdXR9O1xuICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgIHRoaXMuaGlnaGxpdGVDdXJ2ZS5waXBlKGRlYm91bmNlVGltZSgyMDApKS5zdWJzY3JpYmUodmFsdWUgPT4ge1xuICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMuZ3JhcGgucmVzdHlsZUNoYXJ0KHtvcGFjaXR5OiAwLjR9LCB2YWx1ZS5vZmYpO1xuICAgICAgICB0aGlzLmdyYXBoLnJlc3R5bGVDaGFydCh7b3BhY2l0eTogMX0sIHZhbHVlLm9uKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHRoaXMudW5oaWdobGl0ZUN1cnZlLnBpcGUoZGVib3VuY2VUaW1lKDIwMCkpLnN1YnNjcmliZSh2YWx1ZSA9PiB7XG4gICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgdGhpcy5ncmFwaC5yZXN0eWxlQ2hhcnQoe29wYWNpdHk6IDF9LCB2YWx1ZSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZW1pdE5ld0JvdW5kcyhtaW4sIG1heCwgbWFyZ2luTGVmdCkge1xuICAgIGlmICh0aGlzLl9vcHRpb25zLnRpbWVNb2RlICYmIHRoaXMuX29wdGlvbnMudGltZU1vZGUgPT09ICd0aW1lc3RhbXAnKSB7XG4gICAgICB0aGlzLmJvdW5kc0RpZENoYW5nZS5lbWl0KHtib3VuZHM6IHttaW4sIG1heCwgbWFyZ2luTGVmdH0sIHNvdXJjZTogJ2NoYXJ0J30pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmJvdW5kc0RpZENoYW5nZS5lbWl0KHtcbiAgICAgICAgYm91bmRzOiB7XG4gICAgICAgICAgbWluOiBtb21lbnQudHoobWluLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKS52YWx1ZU9mKCksXG4gICAgICAgICAgbWF4OiBtb21lbnQudHoobWF4LCB0aGlzLl9vcHRpb25zLnRpbWVab25lKS52YWx1ZU9mKCksXG4gICAgICAgICAgbWFyZ2luTGVmdFxuICAgICAgICB9LCBzb3VyY2U6ICdjaGFydCdcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBjb252ZXJ0KGRhdGE6IERhdGFNb2RlbCk6IFBhcnRpYWw8YW55PltdIHtcbiAgICB0aGlzLnBhcnNpbmcgPSB0cnVlO1xuICAgIGNvbnN0IGRhdGFzZXQ6IFBhcnRpYWw8YW55PltdID0gW107XG4gICAgdGhpcy5MT0cuZGVidWcoWydjb252ZXJ0J10sIHRoaXMuX29wdGlvbnMudGltZU1vZGUpO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnY29udmVydCcsICd0aGlzLl9oaWRkZW5EYXRhJ10sIHRoaXMuX2hpZGRlbkRhdGEpO1xuICAgIGlmIChHVFNMaWIuaXNBcnJheShkYXRhLmRhdGEpKSB7XG4gICAgICBsZXQgZ3RzTGlzdCA9IEdUU0xpYi5mbGF0RGVlcChHVFNMaWIuZmxhdHRlbkd0c0lkQXJyYXkoZGF0YS5kYXRhIGFzIGFueVtdLCAwKS5yZXMpO1xuICAgICAgdGhpcy5tYXhUaWNrID0gTnVtYmVyLk5FR0FUSVZFX0lORklOSVRZO1xuICAgICAgdGhpcy5taW5UaWNrID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZO1xuICAgICAgdGhpcy52aXNpYmxlR3RzSWQgPSBbXTtcbiAgICAgIHRoaXMuZ3RzSWQgPSBbXTtcbiAgICAgIGNvbnN0IG5vblBsb3R0YWJsZSA9IGd0c0xpc3QuZmlsdGVyKGcgPT4ge1xuICAgICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2NvbnZlcnQnXSwgR1RTTGliLmlzR3RzVG9QbG90KGcpKTtcbiAgICAgICAgcmV0dXJuIChnLnYgJiYgIUdUU0xpYi5pc0d0c1RvUGxvdChnKSk7XG4gICAgICB9KTtcbiAgICAgIGd0c0xpc3QgPSBndHNMaXN0LmZpbHRlcihnID0+IHtcbiAgICAgICAgcmV0dXJuIChnLnYgJiYgR1RTTGliLmlzR3RzVG9QbG90KGcpKTtcbiAgICAgIH0pO1xuICAgICAgLy8gaW5pdGlhbGl6ZSB2aXNpYmlsaXR5IHN0YXR1c1xuICAgICAgaWYgKHRoaXMudmlzaWJpbGl0eVN0YXR1cyA9PT0gJ3Vua25vd24nKSB7XG4gICAgICAgIHRoaXMudmlzaWJpbGl0eVN0YXR1cyA9IGd0c0xpc3QubGVuZ3RoID4gMCA/ICdwbG90dGFibGVTaG93bicgOiAnbm90aGluZ1Bsb3R0YWJsZSc7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsnY29udmVydCddLCB0aGlzLl9vcHRpb25zLnRpbWVNb2RlKTtcbiAgICAgIGxldCB0aW1lc3RhbXBNb2RlID0gdHJ1ZTtcbiAgICAgIGNvbnN0IHRzTGltaXQgPSAxMDAgKiBHVFNMaWIuZ2V0RGl2aWRlcih0aGlzLl9vcHRpb25zLnRpbWVVbml0KTtcbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsnY29udmVydCddLCAnZm9yRWFjaCBHVFMnKTtcbiAgICAgIGd0c0xpc3QuZm9yRWFjaCgoZ3RzOiBHVFMpID0+IHtcbiAgICAgICAgY29uc3QgdGlja3MgPSBndHMudi5tYXAodCA9PiB0WzBdKTtcbiAgICAgICAgY29uc3Qgc2l6ZSA9IGd0cy52Lmxlbmd0aDtcbiAgICAgICAgdGltZXN0YW1wTW9kZSA9IHRpbWVzdGFtcE1vZGUgJiYgKHRpY2tzWzBdID4gLXRzTGltaXQgJiYgdGlja3NbMF0gPCB0c0xpbWl0KTtcbiAgICAgICAgdGltZXN0YW1wTW9kZSA9IHRpbWVzdGFtcE1vZGUgJiYgKHRpY2tzW3NpemUgLSAxXSA+IC10c0xpbWl0ICYmIHRpY2tzW3NpemUgLSAxXSA8IHRzTGltaXQpO1xuICAgICAgfSk7XG4gICAgICBpZiAodGltZXN0YW1wTW9kZSB8fCB0aGlzLl9vcHRpb25zLnRpbWVNb2RlID09PSAndGltZXN0YW1wJykge1xuICAgICAgICB0aGlzLmxheW91dC54YXhpcy50eXBlID0gJ2xpbmVhcic7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmxheW91dC54YXhpcy50eXBlID0gJ2RhdGUnO1xuICAgICAgfVxuICAgICAgZ3RzTGlzdC5mb3JFYWNoKChndHM6IEdUUywgaSkgPT4ge1xuICAgICAgICBpZiAoZ3RzLnYgJiYgR1RTTGliLmlzR3RzVG9QbG90KGd0cykpIHtcbiAgICAgICAgICBUaW1zb3J0LnNvcnQoZ3RzLnYsIChhLCBiKSA9PiBhWzBdIC0gYlswXSk7XG4gICAgICAgICAgY29uc3Qgc2l6ZSA9IGd0cy52Lmxlbmd0aDtcbiAgICAgICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2NvbnZlcnQnXSwgZ3RzKTtcbiAgICAgICAgICBjb25zdCBsYWJlbCA9IEdUU0xpYi5zZXJpYWxpemVHdHNNZXRhZGF0YShndHMpO1xuICAgICAgICAgIGNvbnN0IGMgPSBDb2xvckxpYi5nZXRDb2xvcihndHMuaWQsIHRoaXMuX29wdGlvbnMuc2NoZW1lKTtcbiAgICAgICAgICBjb25zdCBjb2xvciA9ICgoZGF0YS5wYXJhbXMgfHwgW10pW2ldIHx8IHtkYXRhc2V0Q29sb3I6IGN9KS5kYXRhc2V0Q29sb3IgfHwgYztcbiAgICAgICAgICBjb25zdCBzZXJpZXM6IFBhcnRpYWw8YW55PiA9IHtcbiAgICAgICAgICAgIHR5cGU6IHRoaXMuX3R5cGUgPT09ICdzcGxpbmUnID8gJ3NjYXR0ZXInIDogJ3NjYXR0ZXJnbCcsXG4gICAgICAgICAgICBtb2RlOiB0aGlzLl90eXBlID09PSAnc2NhdHRlcicgPyAnbWFya2VycycgOiBzaXplID4gdGhpcy5tYXhQbG90dGFibGUgPyAnbGluZXMnIDogJ2xpbmVzK21hcmtlcnMnLFxuICAgICAgICAgICAgLy8gbmFtZTogbGFiZWwsXG4gICAgICAgICAgICB0ZXh0OiBsYWJlbCxcbiAgICAgICAgICAgIHg6IFtdLFxuICAgICAgICAgICAgeTogW10sXG4gICAgICAgICAgICBsaW5lOiB7Y29sb3J9LFxuICAgICAgICAgICAgaG92ZXJpbmZvOiAnbm9uZScsXG4gICAgICAgICAgICBjb25uZWN0Z2FwczogZmFsc2UsXG4gICAgICAgICAgICB2aXNpYmxlOiAhKHRoaXMuX2hpZGRlbkRhdGEuZmlsdGVyKGggPT4gaCA9PT0gZ3RzLmlkKS5sZW5ndGggPiAwKSxcbiAgICAgICAgICB9O1xuICAgICAgICAgIGlmICh0aGlzLl90eXBlID09PSAnc2NhdHRlcicgfHwgc2l6ZSA8IHRoaXMubWF4UGxvdHRhYmxlKSB7XG4gICAgICAgICAgICBzZXJpZXMubWFya2VyID0ge1xuICAgICAgICAgICAgICBzaXplOiAxNSxcbiAgICAgICAgICAgICAgY29sb3I6IG5ldyBBcnJheShzaXplKS5maWxsKGNvbG9yKSxcbiAgICAgICAgICAgICAgbGluZToge2NvbG9yLCB3aWR0aDogM30sXG4gICAgICAgICAgICAgIG9wYWNpdHk6IG5ldyBBcnJheShzaXplKS5maWxsKHRoaXMuX3R5cGUgPT09ICdzY2F0dGVyJyB8fCB0aGlzLl9vcHRpb25zLnNob3dEb3RzID8gMSA6IDApXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgICBzd2l0Y2ggKHRoaXMuX3R5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3NwbGluZSc6XG4gICAgICAgICAgICAgIHNlcmllcy5saW5lLnNoYXBlID0gJ3NwbGluZSc7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYXJlYSc6XG4gICAgICAgICAgICAgIHNlcmllcy5maWxsID0gJ3RvemVyb3knO1xuICAgICAgICAgICAgICBzZXJpZXMuZmlsbGNvbG9yID0gQ29sb3JMaWIudHJhbnNwYXJlbnRpemUoY29sb3IsIDAuMyk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnc3RlcCc6XG4gICAgICAgICAgICAgIHNlcmllcy5saW5lLnNoYXBlID0gJ2h2aCc7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnc3RlcC1iZWZvcmUnOlxuICAgICAgICAgICAgICBzZXJpZXMubGluZS5zaGFwZSA9ICd2aCc7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnc3RlcC1hZnRlcic6XG4gICAgICAgICAgICAgIHNlcmllcy5saW5lLnNoYXBlID0gJ2h2JztcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMudmlzaWJsZUd0c0lkLnB1c2goZ3RzLmlkKTtcbiAgICAgICAgICB0aGlzLmd0c0lkLnB1c2goZ3RzLmlkKTtcbiAgICAgICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2NvbnZlcnQnXSwgJ2ZvckVhY2ggdmFsdWUnKTtcbiAgICAgICAgICBjb25zdCB0aWNrcyA9IGd0cy52Lm1hcCh0ID0+IHRbMF0pO1xuICAgICAgICAgIGNvbnN0IHZhbHVlcyA9IGd0cy52Lm1hcCh0ID0+IHRbdC5sZW5ndGggLSAxXSk7XG5cbiAgICAgICAgICBpZiAoc2l6ZSA+IDApIHtcbiAgICAgICAgICAgIHRoaXMubWluVGljayA9IHRoaXMubWluVGljayB8fCB0aWNrc1swXTtcbiAgICAgICAgICAgIHRoaXMubWF4VGljayA9IHRoaXMubWF4VGljayB8fCB0aWNrc1swXTtcbiAgICAgICAgICAgIGZvciAobGV0IHYgPSAxOyB2IDwgc2l6ZTsgdisrKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHZhbCA9IHRpY2tzW3ZdO1xuICAgICAgICAgICAgICB0aGlzLm1pblRpY2sgPSB2YWwgPD0gdGhpcy5taW5UaWNrID8gdmFsIDogdGhpcy5taW5UaWNrO1xuICAgICAgICAgICAgICB0aGlzLm1heFRpY2sgPSB2YWwgPj0gdGhpcy5tYXhUaWNrID8gdmFsIDogdGhpcy5tYXhUaWNrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodGltZXN0YW1wTW9kZSB8fCB0aGlzLl9vcHRpb25zLnRpbWVNb2RlID09PSAndGltZXN0YW1wJykge1xuICAgICAgICAgICAgc2VyaWVzLnggPSB0aWNrcztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMuX29wdGlvbnMudGltZVpvbmUgIT09ICdVVEMnKSB7XG4gICAgICAgICAgICAgIHNlcmllcy54ID0gdGlja3MubWFwKHQgPT4gbW9tZW50LnV0Yyh0IC8gdGhpcy5kaXZpZGVyKS50eih0aGlzLl9vcHRpb25zLnRpbWVab25lKS50b0lTT1N0cmluZygpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHNlcmllcy54ID0gdGlja3MubWFwKHQgPT4gbW9tZW50LnV0Yyh0IC8gdGhpcy5kaXZpZGVyKS50b0lTT1N0cmluZygpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgc2VyaWVzLnkgPSB2YWx1ZXM7XG4gICAgICAgICAgdGhpcy5MT0cuZGVidWcoWydjb252ZXJ0J10sICdmb3JFYWNoIHZhbHVlIGVuZCcsIHRoaXMubWluVGljaywgdGhpcy5tYXhUaWNrKTtcbiAgICAgICAgICBkYXRhc2V0LnB1c2goc2VyaWVzKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBpZiAobm9uUGxvdHRhYmxlLmxlbmd0aCA+IDAgJiYgZ3RzTGlzdC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgbm9uUGxvdHRhYmxlLmZvckVhY2goZyA9PiB7XG4gICAgICAgICAgZy52LmZvckVhY2godmFsdWUgPT4ge1xuICAgICAgICAgICAgY29uc3QgdHMgPSB2YWx1ZVswXTtcbiAgICAgICAgICAgIGlmICh0cyA8IHRoaXMubWluVGljaykge1xuICAgICAgICAgICAgICB0aGlzLm1pblRpY2sgPSB0cztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0cyA+IHRoaXMubWF4VGljaykge1xuICAgICAgICAgICAgICB0aGlzLm1heFRpY2sgPSB0cztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIGlmIHRoZXJlIGlzIG5vdCBhbnkgcGxvdHRhYmxlIGRhdGEsIHdlIG11c3QgYWRkIGEgZmFrZSBvbmUgd2l0aCBpZCAtMS4gVGhpcyBvbmUgd2lsbCBhbHdheXMgYmUgaGlkZGVuLlxuICAgICAgICBpZiAoMCA9PT0gZ3RzTGlzdC5sZW5ndGgpIHtcbiAgICAgICAgICBpZiAoIXRoaXMuZGF0YUhhc2hzZXRbdGhpcy5taW5UaWNrXSkge1xuICAgICAgICAgICAgdGhpcy5kYXRhSGFzaHNldFt0aGlzLm1pblRpY2tdID0gWzBdO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIXRoaXMuZGF0YUhhc2hzZXRbdGhpcy5tYXhUaWNrXSkge1xuICAgICAgICAgICAgdGhpcy5kYXRhSGFzaHNldFt0aGlzLm1heFRpY2tdID0gWzBdO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnZpc2liaWxpdHkucHVzaChmYWxzZSk7XG4gICAgICAgICAgdGhpcy52aXNpYmxlR3RzSWQucHVzaCgtMSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5wYXJzaW5nID0gZmFsc2U7XG4gICAgdGhpcy5MT0cuZGVidWcoWydjb252ZXJ0J10sICdlbmQnLCBkYXRhc2V0KTtcbiAgICB0aGlzLm5vRGF0YSA9IGRhdGFzZXQubGVuZ3RoID09PSAwO1xuICAgIHJldHVybiBkYXRhc2V0O1xuICB9XG5cbiAgYWZ0ZXJQbG90KHBsb3RseUluc3RhbmNlKSB7XG4gICAgc3VwZXIuYWZ0ZXJQbG90KHBsb3RseUluc3RhbmNlKTtcbiAgICB0aGlzLm1hcmdpbkxlZnQgPSBwYXJzZUludCgodGhpcy5ncmFwaC5wbG90RWwubmF0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudCkucXVlcnlTZWxlY3RvcignZy5iZ2xheWVyID4gcmVjdCcpLmdldEF0dHJpYnV0ZSgneCcpLCAxMCk7XG4gICAgdGhpcy5MT0cuZGVidWcoWydwbG90bHlfYWZ0ZXJQbG90J10pO1xuICAgIGlmICh0aGlzLmNoYXJ0Qm91bmRzLnRzbWluICE9PSB0aGlzLm1pblRpY2sgfHwgdGhpcy5jaGFydEJvdW5kcy50c21heCAhPT0gdGhpcy5tYXhUaWNrKSB7XG4gICAgICB0aGlzLmNoYXJ0Qm91bmRzLnRzbWluID0gdGhpcy5taW5UaWNrO1xuICAgICAgdGhpcy5jaGFydEJvdW5kcy50c21heCA9IHRoaXMubWF4VGljaztcbiAgICAgIHRoaXMuY2hhcnRCb3VuZHMubWFyZ2luTGVmdCA9IHRoaXMubWFyZ2luTGVmdDtcbiAgICAgIHRoaXMuY2hhcnREcmF3LmVtaXQodGhpcy5jaGFydEJvdW5kcyk7XG4gICAgICBpZiAodGhpcy5hZnRlckJvdW5kc1VwZGF0ZSB8fCB0aGlzLnN0YW5kYWxvbmUpIHtcbiAgICAgICAgdGhpcy5MT0cuZGVidWcoWydhZnRlclBsb3QnLCAndXBkYXRlQm91bmRzJ10sIHRoaXMubWluVGljaywgdGhpcy5tYXhUaWNrKTtcbiAgICAgICAgdGhpcy5lbWl0TmV3Qm91bmRzKHRoaXMubWluVGljaywgdGhpcy5tYXhUaWNrLCB0aGlzLm1hcmdpbkxlZnQpO1xuICAgICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5hZnRlckJvdW5kc1VwZGF0ZSA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICByZWxheW91dChkYXRhOiBhbnkpIHtcbiAgICBpZiAoZGF0YVsneGF4aXMucmFuZ2UnXSAmJiBkYXRhWyd4YXhpcy5yYW5nZSddLmxlbmd0aCA9PT0gMikge1xuICAgICAgdGhpcy5MT0cuZGVidWcoWydyZWxheW91dCcsICd1cGRhdGVCb3VuZHMnLCAneGF4aXMucmFuZ2UnXSwgZGF0YVsneGF4aXMucmFuZ2UnXSk7XG4gICAgICB0aGlzLmNoYXJ0Qm91bmRzLm1zbWluID0gZGF0YVsneGF4aXMucmFuZ2UnXVswXTtcbiAgICAgIHRoaXMuY2hhcnRCb3VuZHMubXNtYXggPSBkYXRhWyd4YXhpcy5yYW5nZSddWzFdO1xuICAgICAgdGhpcy5jaGFydEJvdW5kcy50c21pbiA9IG1vbWVudC50eihtb21lbnQodGhpcy5jaGFydEJvdW5kcy5tc21pbiksIHRoaXMuX29wdGlvbnMudGltZVpvbmUpLnZhbHVlT2YoKSAqIHRoaXMuZGl2aWRlcjtcbiAgICAgIHRoaXMuY2hhcnRCb3VuZHMudHNtYXggPSBtb21lbnQudHoobW9tZW50KHRoaXMuY2hhcnRCb3VuZHMubXNtYXgpLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKS52YWx1ZU9mKCkgKiB0aGlzLmRpdmlkZXI7XG4gICAgfSBlbHNlIGlmIChkYXRhWyd4YXhpcy5yYW5nZVswXSddICYmIGRhdGFbJ3hheGlzLnJhbmdlWzFdJ10pIHtcbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsncmVsYXlvdXQnLCAndXBkYXRlQm91bmRzJywgJ3hheGlzLnJhbmdlW3hdJ10sIGRhdGFbJ3hheGlzLnJhbmdlWzBdJ10pO1xuICAgICAgdGhpcy5jaGFydEJvdW5kcy5tc21pbiA9IGRhdGFbJ3hheGlzLnJhbmdlWzBdJ107XG4gICAgICB0aGlzLmNoYXJ0Qm91bmRzLm1zbWF4ID0gZGF0YVsneGF4aXMucmFuZ2VbMV0nXTtcbiAgICAgIHRoaXMuY2hhcnRCb3VuZHMudHNtaW4gPSBtb21lbnQudHoobW9tZW50KHRoaXMuY2hhcnRCb3VuZHMubXNtaW4pLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKS52YWx1ZU9mKCkgKiB0aGlzLmRpdmlkZXI7XG4gICAgICB0aGlzLmNoYXJ0Qm91bmRzLnRzbWF4ID0gbW9tZW50LnR6KG1vbWVudCh0aGlzLmNoYXJ0Qm91bmRzLm1zbWF4KSwgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSkudmFsdWVPZigpICogdGhpcy5kaXZpZGVyO1xuICAgIH0gZWxzZSBpZiAoZGF0YVsneGF4aXMuYXV0b3JhbmdlJ10pIHtcbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsncmVsYXlvdXQnLCAndXBkYXRlQm91bmRzJywgJ2F1dG9yYW5nZSddLCBkYXRhLCB0aGlzLm1pblRpY2ssIHRoaXMubWF4VGljayk7XG4gICAgICB0aGlzLmNoYXJ0Qm91bmRzLnRzbWluID0gdGhpcy5taW5UaWNrO1xuICAgICAgdGhpcy5jaGFydEJvdW5kcy50c21heCA9IHRoaXMubWF4VGljaztcbiAgICB9XG4gICAgdGhpcy5MT0cuZGVidWcoWydyZWxheW91dCcsICd1cGRhdGVCb3VuZHMnXSwgdGhpcy5jaGFydEJvdW5kcyk7XG4gICAgdGhpcy5lbWl0TmV3Qm91bmRzKHRoaXMuY2hhcnRCb3VuZHMudHNtaW4sIHRoaXMuY2hhcnRCb3VuZHMudHNtYXgsIHRoaXMubWFyZ2luTGVmdCk7XG4gICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgdGhpcy5hZnRlckJvdW5kc1VwZGF0ZSA9IGZhbHNlO1xuXG4gIH1cblxuICBzbGlkZXJDaGFuZ2UoJGV2ZW50OiBhbnkpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3NsaWRlckNoYW5nZSddLCAkZXZlbnQpO1xuICAgIGNvbnNvbGUubG9nKCRldmVudCk7XG4gIH1cblxuICB1cGRhdGVCb3VuZHMobWluLCBtYXgpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3VwZGF0ZUJvdW5kcyddLCBtaW4sIG1heCwgdGhpcy5fb3B0aW9ucyk7XG4gICAgbWluID0gbWluIHx8IHRoaXMubWluVGljayAvIHRoaXMuZGl2aWRlcjtcbiAgICBtYXggPSBtYXggfHwgdGhpcy5tYXhUaWNrIC8gdGhpcy5kaXZpZGVyO1xuICAgIHRoaXMubGF5b3V0LnhheGlzLmF1dG9yYW5nZSA9IGZhbHNlO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsndXBkYXRlQm91bmRzJ10sXG4gICAgICBtb21lbnQudHoobWluLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKS50b0lTT1N0cmluZygpLFxuICAgICAgbW9tZW50LnR6KG1heCwgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSkudG9JU09TdHJpbmcoKSk7XG4gICAgaWYgKHRoaXMuX29wdGlvbnMudGltZU1vZGUgJiYgdGhpcy5fb3B0aW9ucy50aW1lTW9kZSA9PT0gJ3RpbWVzdGFtcCcpIHtcbiAgICAgIHRoaXMubGF5b3V0LnhheGlzLnJhbmdlID0gW21pbiwgbWF4XTtcbiAgICAgIHRoaXMubGF5b3V0LnhheGlzLnRpY2swID0gbWluO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxheW91dC54YXhpcy5yYW5nZSA9IFtcbiAgICAgICAgbW9tZW50LnR6KG1pbiwgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgbW9tZW50LnR6KG1heCwgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSkudG9JU09TdHJpbmcoKVxuICAgICAgXTtcbiAgICAgIHRoaXMubGF5b3V0LnhheGlzLnRpY2swID0gbW9tZW50LnR6KG1pbiwgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSkudG9JU09TdHJpbmcoKTtcbiAgICB9XG4gICAgdGhpcy5sYXlvdXQgPSB7Li4udGhpcy5sYXlvdXR9O1xuICAgIHRoaXMuTE9HLmRlYnVnKFsndXBkYXRlQm91bmRzJ10sIHRoaXMubGF5b3V0KTtcbiAgICB0aGlzLmFmdGVyQm91bmRzVXBkYXRlID0gdHJ1ZTtcbiAgfVxuXG5cbiAgc2V0UmVhbEJvdW5kcyhjaGFydEJvdW5kczogQ2hhcnRCb3VuZHMpIHtcbiAgICB0aGlzLmFmdGVyQm91bmRzVXBkYXRlID0gdHJ1ZTtcbiAgICB0aGlzLm1pblRpY2sgPSBjaGFydEJvdW5kcy50c21pbjtcbiAgICB0aGlzLm1heFRpY2sgPSBjaGFydEJvdW5kcy50c21heDtcbiAgICB0aGlzLl9vcHRpb25zLmJvdW5kcyA9IHRoaXMuX29wdGlvbnMuYm91bmRzIHx8IHt9O1xuICAgIHRoaXMuX29wdGlvbnMuYm91bmRzLm1pbkRhdGUgPSB0aGlzLm1pblRpY2s7XG4gICAgdGhpcy5fb3B0aW9ucy5ib3VuZHMubWF4RGF0ZSA9IHRoaXMubWF4VGljaztcbiAgICBjb25zdCB4OiBhbnkgPSB7XG4gICAgICB0aWNrMDogdW5kZWZpbmVkLFxuICAgICAgcmFuZ2U6IFtdLFxuICAgIH07XG4gICAgaWYgKHRoaXMuX29wdGlvbnMuc2hvd1JhbmdlU2VsZWN0b3IpIHtcbiAgICAgIHgucmFuZ2VzbGlkZXIgPSB7XG4gICAgICAgIGJnY29sb3I6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgIHRoaWNrbmVzczogNDAgLyB0aGlzLmhlaWdodFxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX29wdGlvbnMudGltZU1vZGUgJiYgdGhpcy5fb3B0aW9ucy50aW1lTW9kZSA9PT0gJ3RpbWVzdGFtcCcpIHtcbiAgICAgIHgudGljazAgPSB0aGlzLm1pblRpY2sgLyB0aGlzLmRpdmlkZXI7XG4gICAgICB4LnJhbmdlID0gW3RoaXMubWluVGljaywgdGhpcy5tYXhUaWNrXTtcbiAgICB9IGVsc2Uge1xuICAgICAgeC50aWNrMCA9IG1vbWVudC50eih0aGlzLm1pblRpY2sgLyB0aGlzLmRpdmlkZXIsIHRoaXMuX29wdGlvbnMudGltZVpvbmUpLnRvSVNPU3RyaW5nKHRydWUpO1xuICAgICAgeC5yYW5nZSA9IFtcbiAgICAgICAgbW9tZW50LnR6KHRoaXMubWluVGljayAvIHRoaXMuZGl2aWRlciwgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSkudG9JU09TdHJpbmcodHJ1ZSksXG4gICAgICAgIG1vbWVudC50eih0aGlzLm1heFRpY2sgLyB0aGlzLmRpdmlkZXIsIHRoaXMuX29wdGlvbnMudGltZVpvbmUpLnRvSVNPU3RyaW5nKHRydWUpXG4gICAgICBdO1xuICAgIH1cbiAgICB0aGlzLmxheW91dC54YXhpcyA9IHg7XG4gICAgdGhpcy5sYXlvdXQgPSB7Li4udGhpcy5sYXlvdXR9O1xuICB9XG5cbiAgaG92ZXIoZGF0YTogYW55KSB7XG4gICAgdGhpcy5MT0cuZGVidWcoWydob3ZlciddLCBkYXRhKTtcbiAgICBsZXQgZGVsdGEgPSBOdW1iZXIuTUFYX1ZBTFVFO1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1zaGFkb3dlZC12YXJpYWJsZVxuICAgIGxldCBwb2ludDtcbiAgICBjb25zdCBjdXJ2ZXMgPSBbXTtcbiAgICB0aGlzLnRvb2xUaXAubmF0aXZlRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICBpZiAoZGF0YS5wb2ludHNbMF0gJiYgZGF0YS5wb2ludHNbMF0uZGF0YS5vcmllbnRhdGlvbiAhPT0gJ2gnKSB7XG4gICAgICBjb25zdCB5ID0gKGRhdGEueXZhbHMgfHwgWycnXSlbMF07XG4gICAgICBkYXRhLnBvaW50cy5mb3JFYWNoKHAgPT4ge1xuICAgICAgICBjdXJ2ZXMucHVzaChwLmN1cnZlTnVtYmVyKTtcbiAgICAgICAgY29uc3QgZCA9IE1hdGguYWJzKHAueSAtIHkpO1xuICAgICAgICBpZiAoZCA8IGRlbHRhKSB7XG4gICAgICAgICAgZGVsdGEgPSBkO1xuICAgICAgICAgIHBvaW50ID0gcDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHg6IG51bWJlciA9IChkYXRhLnh2YWxzIHx8IFsnJ10pWzBdO1xuICAgICAgZGF0YS5wb2ludHMuZm9yRWFjaChwID0+IHtcbiAgICAgICAgY3VydmVzLnB1c2gocC5jdXJ2ZU51bWJlcik7XG4gICAgICAgIGNvbnN0IGQgPSBNYXRoLmFicyhwLnggLSB4KTtcbiAgICAgICAgaWYgKGQgPCBkZWx0YSkge1xuICAgICAgICAgIGRlbHRhID0gZDtcbiAgICAgICAgICBwb2ludCA9IHA7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAocG9pbnQgJiYgdGhpcy5oaWdobGlnaHRlZCAhPT0gcG9pbnQuY3VydmVOdW1iZXIpIHtcbiAgICAgIHRoaXMuaGlnaGxpdGVDdXJ2ZS5uZXh0KHtvbjogW3BvaW50LmN1cnZlTnVtYmVyXSwgb2ZmOiBjdXJ2ZXN9KTtcbiAgICAgIHRoaXMuaGlnaGxpZ2h0ZWQgPSBwb2ludC5jdXJ2ZU51bWJlcjtcbiAgICB9XG4gICAgc3VwZXIuaG92ZXIoZGF0YSwgcG9pbnQpO1xuICAgIHRoaXMucG9pbnRIb3Zlci5lbWl0KGRhdGEuZXZlbnQpO1xuICAgIC8qc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBsZXQgcG4gPSAtMTtcbiAgICAgIGxldCB0biA9IC0xO1xuICAgICAgbGV0IGNvbG9yID0gW107XG4gICAgICBsZXQgbGluZSA9IHt9O1xuICAgICAgbGV0IG9wYWNpdHkgPSBbXTtcbiAgICAgIGRhdGEucG9pbnRzLmZvckVhY2gocCA9PiB7XG4gICAgICAgIGlmICghIXAuZGF0YS5tYXJrZXIpIHtcbiAgICAgICAgICBjb2xvciA9IHAuZGF0YS5tYXJrZXIuY29sb3I7XG4gICAgICAgICAgb3BhY2l0eSA9IHAuZGF0YS5tYXJrZXIub3BhY2l0eTtcbiAgICAgICAgICBsaW5lID0gcC5kYXRhLm1hcmtlci5saW5lO1xuICAgICAgICAgIHBuID0gcC5wb2ludE51bWJlcjtcbiAgICAgICAgICB0biA9IHAuY3VydmVOdW1iZXI7XG4gICAgICAgICAgaWYgKHBuID49IDApIHtcbiAgICAgICAgICAgIGNvbG9yW3BuXSA9ICd0cmFuc3BhcmVudCc7XG4gICAgICAgICAgICBvcGFjaXR5W3BuXSA9IDE7XG4gICAgICAgICAgICBjb25zdCB1cGRhdGUgPSB7bWFya2VyOiB7Y29sb3IsIG9wYWNpdHksIGxpbmUsIHNpemU6IDE1fX07XG4gICAgICAgICAgICB0aGlzLmdyYXBoLnJlc3R5bGVDaGFydCh1cGRhdGUsIFt0bl0pO1xuICAgICAgICAgICAgdGhpcy5MT0cuZGVidWcoWydob3ZlciddLCAncmVzdHlsZUNoYXJ0IGlubmVyJywgdXBkYXRlLCBbdG5dKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pKi9cbiAgfVxuXG4gIHVuaG92ZXIoZGF0YTogYW55KSB7XG4gICAgbGV0IGRlbHRhID0gTnVtYmVyLk1BWF9WQUxVRTtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tc2hhZG93ZWQtdmFyaWFibGVcbiAgICBsZXQgcG9pbnQ7XG4gICAgaWYgKGRhdGEucG9pbnRzWzBdICYmIGRhdGEucG9pbnRzWzBdLmRhdGEub3JpZW50YXRpb24gIT09ICdoJykge1xuICAgICAgY29uc3QgeSA9IChkYXRhLnl2YWxzIHx8IFsnJ10pWzBdO1xuICAgICAgZGF0YS5wb2ludHMuZm9yRWFjaChwID0+IHtcbiAgICAgICAgY29uc3QgZCA9IE1hdGguYWJzKHAueSAtIHkpO1xuICAgICAgICBpZiAoZCA8IGRlbHRhKSB7XG4gICAgICAgICAgZGVsdGEgPSBkO1xuICAgICAgICAgIHBvaW50ID0gcDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHg6IG51bWJlciA9IChkYXRhLnh2YWxzIHx8IFsnJ10pWzBdO1xuICAgICAgZGF0YS5wb2ludHMuZm9yRWFjaChwID0+IHtcbiAgICAgICAgY29uc3QgZCA9IE1hdGguYWJzKHAueCAtIHgpO1xuICAgICAgICBpZiAoZCA8IGRlbHRhKSB7XG4gICAgICAgICAgZGVsdGEgPSBkO1xuICAgICAgICAgIHBvaW50ID0gcDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmICghIXBvaW50ICYmIHRoaXMuaGlnaGxpZ2h0ZWQgIT09IHBvaW50LmN1cnZlTnVtYmVyKSB7XG4gICAgICB0aGlzLnVuaGlnaGxpdGVDdXJ2ZS5uZXh0KFt0aGlzLmhpZ2hsaWdodGVkXSk7XG4gICAgICB0aGlzLmhpZ2hsaWdodGVkID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBzdXBlci51bmhvdmVyKGRhdGEsIHBvaW50KTtcbiAgICAvKnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgbGV0IHBuID0gLTE7XG4gICAgICBsZXQgdG4gPSAtMTtcbiAgICAgIGxldCBjb2xvciA9IFtdO1xuICAgICAgbGV0IGxpbmUgPSB7fTtcbiAgICAgIGxldCBvcGFjaXR5ID0gW107XG4gICAgICBkYXRhLnBvaW50cy5mb3JFYWNoKHAgPT4ge1xuICAgICAgICBpZiAoISFwLmRhdGEubWFya2VyKSB7XG4gICAgICAgICAgcG4gPSBwLnBvaW50TnVtYmVyO1xuICAgICAgICAgIHRuID0gcC5jdXJ2ZU51bWJlcjtcbiAgICAgICAgICBjb2xvciA9IHAuZGF0YS5tYXJrZXIuY29sb3I7XG4gICAgICAgICAgb3BhY2l0eSA9IHAuZGF0YS5tYXJrZXIub3BhY2l0eTtcbiAgICAgICAgICBsaW5lID0gcC5kYXRhLm1hcmtlci5saW5lO1xuICAgICAgICAgIGlmIChwbiA+PSAwKSB7XG4gICAgICAgICAgICBjb2xvcltwbl0gPSBwLmRhdGEubGluZS5jb2xvcjtcbiAgICAgICAgICAgIG9wYWNpdHlbcG5dID0gdGhpcy5fb3B0aW9ucy5zaG93RG90cyA/IDEgOiAwO1xuICAgICAgICAgICAgY29uc3QgdXBkYXRlID0ge21hcmtlcjoge2NvbG9yLCBvcGFjaXR5LCBsaW5lLCBzaXplOiAxNX19O1xuICAgICAgICAgICAgdGhpcy5ncmFwaC5yZXN0eWxlQ2hhcnQodXBkYXRlLCBbdG5dKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pKi9cbiAgfVxufVxuIl19