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
import { Component, ElementRef, EventEmitter, HostListener, Input, NgZone, Output, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { WarpViewComponent } from '../warp-view-component';
import { ChartLib } from '../../utils/chart-lib';
import moment from 'moment-timezone';
import { GTSLib } from '../../utils/gts.lib';
import { ColorLib } from '../../utils/color-lib';
import { SizeService } from '../../services/resize.service';
import { Logger } from '../../utils/logger';
import { ChartBounds } from '../../model/chartBounds';
var WarpViewAnnotationComponent = /** @class */ (function (_super) {
    tslib_1.__extends(WarpViewAnnotationComponent, _super);
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
        this.LOG.debug(['updateBounds'], moment.tz(min / this.divider, this._options.timeZone).toISOString(), moment.tz(max / this.divider, this._options.timeZone).toISOString());
        this.minTick = min;
        this.maxTick = max;
        if (this._options.timeMode && this._options.timeMode === 'timestamp') {
            this.layout.xaxis.tick0 = min / this.divider;
            this.layout.xaxis.range = [min / this.divider, max / this.divider];
        }
        else {
            this.layout.xaxis.tick0 = moment.tz(min / this.divider, this._options.timeZone).toISOString();
            this.layout.xaxis.range = [
                moment.tz(min / this.divider, this._options.timeZone).toISOString(),
                moment.tz(max / this.divider, this._options.timeZone).toISOString()
            ];
        }
        this.layout.margin.l = marginLeft;
        this.marginLeft = marginLeft;
        this.layout = tslib_1.__assign({}, this.layout);
        this.LOG.debug(['updateBounds'], tslib_1.__assign({}, this.layout.xaxis.range));
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
            this.layout.xaxis.tick0 = moment.tz(this.minTick / this.divider, this._options.timeZone).toISOString(true);
            this.layout.xaxis.range = [
                moment.tz(this.minTick / this.divider, this._options.timeZone).toISOString(true),
                moment.tz(this.maxTick / this.divider, this._options.timeZone).toISOString(true)
            ];
            this.layout.xaxis.type = 'date';
        }
        this.plotlyConfig.scrollZoom = true;
        this.plotlyConfig = tslib_1.__assign({}, this.plotlyConfig);
        this.layout = tslib_1.__assign({}, this.layout);
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
            this.chartBounds.tsmin = moment.tz(moment(this.chartBounds.msmin), this._options.timeZone).valueOf();
            this.chartBounds.tsmax = moment.tz(moment(this.chartBounds.msmax), this._options.timeZone).valueOf();
        }
        else if (data['xaxis.range[0]'] && data['xaxis.range[1]']) {
            this.LOG.debug(['relayout', 'updateBounds', 'xaxis.range[x]'], data['xaxis.range[0]']);
            this.chartBounds.msmin = data['xaxis.range[0]'];
            this.chartBounds.msmax = data['xaxis.range[1]'];
            this.chartBounds.tsmin = moment.tz(moment(this.chartBounds.msmin), this._options.timeZone).valueOf();
            this.chartBounds.tsmax = moment.tz(moment(this.chartBounds.msmax), this._options.timeZone).valueOf();
        }
        else if (data['xaxis.autorange']) {
            this.LOG.debug(['relayout', 'updateBounds', 'autorange'], data);
            this.chartBounds.tsmin = this.minTick / this.divider;
            this.chartBounds.tsmax = this.maxTick / this.divider;
        }
        this.emitNewBounds(moment.utc(this.chartBounds.tsmin).valueOf(), moment.utc(this.chartBounds.msmax).valueOf());
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
            : (moment(x).utc().toISOString().replace('Z', this._options.timeZone === 'UTC' ? 'Z' : '') || '')) + "</span>\n<ul>\n<li>" + GTSLib.formatLabel(data.points[0].data.name) + ": <span class=\"value\">" + data.points[0].text + "</span></li>\n</ul>\n      </div>";
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
                    min: moment.tz(min, this._options.timeZone).valueOf(),
                    max: moment.tz(max, this._options.timeZone).valueOf()
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
            x.tick0 = moment.tz(this.minTick / this.divider, this._options.timeZone).toISOString(true);
            x.range = [
                moment.tz(this.minTick / this.divider, this._options.timeZone).toISOString(true),
                moment.tz(this.maxTick / this.divider, this._options.timeZone).toISOString(true)
            ];
        }
        this.layout.xaxis = x;
        this.layout = tslib_1.__assign({}, this.layout);
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
export { WarpViewAnnotationComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LWFubm90YXRpb24uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHNlbngvd2FycHZpZXcvIiwic291cmNlcyI6WyJzcmMvbGliL2VsZW1lbnRzL3dhcnAtdmlldy1hbm5vdGF0aW9uL3dhcnAtdmlldy1hbm5vdGF0aW9uLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFlBQVksRUFDWixLQUFLLEVBQ0wsTUFBTSxFQUNOLE1BQU0sRUFDTixTQUFTLEVBQ1QsU0FBUyxFQUNULGlCQUFpQixFQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUV6RCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDL0MsT0FBTyxNQUFNLE1BQU0saUJBQWlCLENBQUM7QUFFckMsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBRTNDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQyxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sK0JBQStCLENBQUM7QUFDMUQsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQzFDLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUVwRDtJQU1pRCx1REFBaUI7SUFnSWhFLHFDQUNTLEVBQWMsRUFDZCxRQUFtQixFQUNuQixXQUF3QixFQUN4QixNQUFjO1FBSnZCLFlBTUUsa0JBQU0sRUFBRSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsTUFBTSxDQUFDLFNBR3pDO1FBUlEsUUFBRSxHQUFGLEVBQUUsQ0FBWTtRQUNkLGNBQVEsR0FBUixRQUFRLENBQVc7UUFDbkIsaUJBQVcsR0FBWCxXQUFXLENB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LFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDcEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7WUFDN0MsZ0JBQWdCLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2xJLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO1FBQzdELElBQUksQ0FBQyxNQUFNLEdBQUcsZ0JBQWdCLENBQUM7UUFDL0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUNqQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzlFLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pELElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVyxFQUFFLGFBQWEsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMxRCxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxJ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QUFFLENBQUMsUUFBUSxDQUFDOzhCQVczQyxZQUFZLFNBQUMsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDLGNBQ2hDLFlBQVksU0FBQyxnQkFBZ0IsRUFBRSxDQUFDLFFBQVEsQ0FBQzs7SUFvVTVDLGtDQUFDO0NBQUEsQUE3YkQsQ0FNaUQsaUJBQWlCLEdBdWJqRTtTQXZiWSwyQkFBMkI7OztJQUN0QyxxREFBd0U7O0lBK0N4RSxpREFBMkQ7O0lBQzNELDBEQUE2RTs7SUFDN0UsZ0RBQXlEOztJQUN6RCxzREFBcUU7O0lBRXJFLHNEQUF1Qjs7Ozs7SUFHdkIsNENBQXVCOzs7OztJQUN2QixpREFBbUM7Ozs7O0lBQ25DLCtDQUF5Qjs7Ozs7SUFDekIsa0RBQTJCOzs7OztJQUMzQiw4Q0FBZ0I7Ozs7O0lBQ2hCLDhDQUFtQzs7Ozs7SUFDbkMsOENBQW1DOzs7OztJQUNuQyxtREFBMEI7Ozs7O0lBQzFCLDRDQUFtQjs7Ozs7SUFDbkIsa0RBQXlCOzs7OztJQUN6QixpREFBd0I7Ozs7O0lBQ3hCLGtEQUFxRDs7SUFDckQsNkNBK0JFOztJQUNGLGlEQUFnQjs7SUE2QmQseUNBQXFCOztJQUNyQiwrQ0FBMEI7O0lBQzFCLGtEQUErQjs7SUFDL0IsNkNBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqICBDb3B5cmlnaHQgMjAyMCAgU2VuWCBTLkEuUy5cbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqL1xuXG5pbXBvcnQge1xuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSG9zdExpc3RlbmVyLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPdXRwdXQsXG4gIFJlbmRlcmVyMixcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7V2FycFZpZXdDb21wb25lbnR9IGZyb20gJy4uL3dhcnAtdmlldy1jb21wb25lbnQnO1xuaW1wb3J0IHtQYXJhbX0gZnJvbSAnLi4vLi4vbW9kZWwvcGFyYW0nO1xuaW1wb3J0IHtDaGFydExpYn0gZnJvbSAnLi4vLi4vdXRpbHMvY2hhcnQtbGliJztcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50LXRpbWV6b25lJztcbmltcG9ydCB7RGF0YU1vZGVsfSBmcm9tICcuLi8uLi9tb2RlbC9kYXRhTW9kZWwnO1xuaW1wb3J0IHtHVFNMaWJ9IGZyb20gJy4uLy4uL3V0aWxzL2d0cy5saWInO1xuaW1wb3J0IHtHVFN9IGZyb20gJy4uLy4uL21vZGVsL0dUUyc7XG5pbXBvcnQge0NvbG9yTGlifSBmcm9tICcuLi8uLi91dGlscy9jb2xvci1saWInO1xuaW1wb3J0IHtTaXplU2VydmljZX0gZnJvbSAnLi4vLi4vc2VydmljZXMvcmVzaXplLnNlcnZpY2UnO1xuaW1wb3J0IHtMb2dnZXJ9IGZyb20gJy4uLy4uL3V0aWxzL2xvZ2dlcic7XG5pbXBvcnQge0NoYXJ0Qm91bmRzfSBmcm9tICcuLi8uLi9tb2RlbC9jaGFydEJvdW5kcyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3dhcnB2aWV3LWFubm90YXRpb24nLFxuICB0ZW1wbGF0ZVVybDogJy4vd2FycC12aWV3LWFubm90YXRpb24uY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi93YXJwLXZpZXctYW5ub3RhdGlvbi5jb21wb25lbnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5TaGFkb3dEb21cbn0pXG5leHBvcnQgY2xhc3MgV2FycFZpZXdBbm5vdGF0aW9uQ29tcG9uZW50IGV4dGVuZHMgV2FycFZpZXdDb21wb25lbnQge1xuICBAVmlld0NoaWxkKCdjaGFydENvbnRhaW5lcicsIHtzdGF0aWM6IHRydWV9KSBjaGFydENvbnRhaW5lcjogRWxlbWVudFJlZjtcblxuICBASW5wdXQoJ2hpZGRlbkRhdGEnKSBzZXQgaGlkZGVuRGF0YShoaWRkZW5EYXRhOiBudW1iZXJbXSkge1xuICAgIGNvbnN0IHByZXZpb3VzVmlzaWJpbGl0eSA9IEpTT04uc3RyaW5naWZ5KHRoaXMudmlzaWJpbGl0eSk7XG4gICAgdGhpcy5MT0cuZGVidWcoWydoaWRkZW5EYXRhJywgJ3ByZXZpb3VzVmlzaWJpbGl0eSddLCBwcmV2aW91c1Zpc2liaWxpdHkpO1xuICAgIHRoaXMuX2hpZGRlbkRhdGEgPSBoaWRkZW5EYXRhO1xuICAgIHRoaXMudmlzaWJpbGl0eSA9IFtdO1xuICAgIHRoaXMudmlzaWJsZUd0c0lkLmZvckVhY2goaWQgPT4gdGhpcy52aXNpYmlsaXR5LnB1c2goaGlkZGVuRGF0YS5pbmRleE9mKGlkKSA8IDAgJiYgKGlkICE9PSAtMSkpKTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2hpZGRlbkRhdGEnLCAnaGlkZGVuZHlncmFwaGZ1bGx2J10sIHRoaXMudmlzaWJpbGl0eSk7XG4gICAgY29uc3QgbmV3VmlzaWJpbGl0eSA9IEpTT04uc3RyaW5naWZ5KHRoaXMudmlzaWJpbGl0eSk7XG4gICAgdGhpcy5MT0cuZGVidWcoWydoaWRkZW5EYXRhJywgJ2pzb24nXSwgcHJldmlvdXNWaXNpYmlsaXR5LCBuZXdWaXNpYmlsaXR5KTtcbiAgICBpZiAocHJldmlvdXNWaXNpYmlsaXR5ICE9PSBuZXdWaXNpYmlsaXR5KSB7XG4gICAgICBjb25zdCB2aXNpYmxlID0gW107XG4gICAgICBjb25zdCBoaWRkZW4gPSBbXTtcbiAgICAgIHRoaXMuZ3RzSWQuZm9yRWFjaCgoaWQsIGkpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuX2hpZGRlbkRhdGEuaW5kZXhPZihpZCkgPiAtMSkge1xuICAgICAgICAgIGhpZGRlbi5wdXNoKGkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZpc2libGUucHVzaChpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBpZiAodmlzaWJsZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRoaXMuZ3JhcGgucmVzdHlsZUNoYXJ0KHt2aXNpYmxlOiB0cnVlfSwgdmlzaWJsZSk7XG4gICAgICB9XG4gICAgICBpZiAoaGlkZGVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGhpcy5ncmFwaC5yZXN0eWxlQ2hhcnQoe3Zpc2libGU6IGZhbHNlfSwgaGlkZGVuKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsnaGlkZGVuZHlncmFwaHRyaWcnLCAnZGVzdHJveSddLCAncmVkcmF3IGJ5IHZpc2liaWxpdHkgY2hhbmdlJyk7XG4gICAgfVxuICB9XG5cbiAgQElucHV0KCd0eXBlJykgc2V0IHR5cGUodHlwZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdHlwZSA9IHR5cGU7XG4gICAgdGhpcy5kcmF3Q2hhcnQoKTtcbiAgfVxuXG4gIEBJbnB1dCgnc3RhbmRhbG9uZScpIHNldCBzdGFuZGFsb25lKGlzU3RhbmRhbG9uZTogYm9vbGVhbikge1xuICAgIGlmICh0aGlzLl9zdGFuZGFsb25lICE9PSBpc1N0YW5kYWxvbmUpIHtcbiAgICAgIHRoaXMuX3N0YW5kYWxvbmUgPSBpc1N0YW5kYWxvbmU7XG4gICAgICB0aGlzLmRyYXdDaGFydCgpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBzdGFuZGFsb25lKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9zdGFuZGFsb25lO1xuICB9XG5cbiAgQE91dHB1dCgncG9pbnRIb3ZlcicpIHBvaW50SG92ZXIgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgnd2FycFZpZXdDaGFydFJlc2l6ZScpIHdhcnBWaWV3Q2hhcnRSZXNpemUgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgnY2hhcnREcmF3JykgY2hhcnREcmF3ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoJ2JvdW5kc0RpZENoYW5nZScpIGJvdW5kc0RpZENoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIGRpc3BsYXlFeHBhbmRlciA9IHRydWU7XG5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWVcbiAgcHJpdmF0ZSBfdHlwZSA9ICdsaW5lJztcbiAgcHJpdmF0ZSB2aXNpYmlsaXR5OiBib29sZWFuW10gPSBbXTtcbiAgcHJpdmF0ZSBleHBhbmRlZCA9IGZhbHNlO1xuICBwcml2YXRlIF9zdGFuZGFsb25lID0gdHJ1ZTtcbiAgcHJpdmF0ZSB0cmltbWVkO1xuICBwcml2YXRlIG1heFRpY2sgPSBOdW1iZXIuTUlOX1ZBTFVFO1xuICBwcml2YXRlIG1pblRpY2sgPSBOdW1iZXIuTUFYX1ZBTFVFO1xuICBwcml2YXRlIHZpc2libGVHdHNJZCA9IFtdO1xuICBwcml2YXRlIGd0c0lkID0gW107XG4gIHByaXZhdGUgZGF0YUhhc2hzZXQgPSB7fTtcbiAgcHJpdmF0ZSBsaW5lSGVpZ2h0ID0gMzA7XG4gIHByaXZhdGUgY2hhcnRCb3VuZHM6IENoYXJ0Qm91bmRzID0gbmV3IENoYXJ0Qm91bmRzKCk7XG4gIGxheW91dDogUGFydGlhbDxhbnk+ID0ge1xuICAgIHNob3dsZWdlbmQ6IGZhbHNlLFxuICAgIGhvdmVybW9kZTogJ2Nsb3Nlc3QnLFxuICAgIHhheGlzOiB7XG4gICAgICBncmlkd2lkdGg6IDEsXG4gICAgICBmaXhlZHJhbmdlOiBmYWxzZSxcbiAgICAgIGF1dG9yYW5nZTogZmFsc2UsXG4gICAgICBhdXRvbWFyZ2luOiBmYWxzZSxcbiAgICAgIHNob3d0aWNrbGFiZWxzOiB0cnVlLFxuICAgIH0sXG4gICAgYXV0b3NpemU6IGZhbHNlLFxuICAgIGF1dG9leHBhbmQ6IGZhbHNlLFxuICAgIHlheGlzOiB7XG4gICAgICBzaG93dGlja2xhYmVsczogZmFsc2UsXG4gICAgICBmaXhlZHJhbmdlOiB0cnVlLFxuICAgICAgZHRpY2s6IDEsXG4gICAgICBncmlkd2lkdGg6IDEsXG4gICAgICB0aWNrMDogMCxcbiAgICAgIG50aWNrczogMixcbiAgICAgIHJhbmdlbW9kZTogJ3RvemVybycsXG4gICAgICB0aWNrc29uOiAnYm91bmRhcmllcycsXG4gICAgICBhdXRvbWFyZ2luOiB0cnVlLFxuICAgICAgc2hvd2xpbmU6IHRydWUsXG4gICAgICB6ZXJvbGluZTogdHJ1ZVxuICAgIH0sXG4gICAgbWFyZ2luOiB7XG4gICAgICB0OiAzMCxcbiAgICAgIGI6IDIsXG4gICAgICByOiAxMCxcbiAgICAgIGw6IDEwXG4gICAgfSxcbiAgfTtcbiAgbWFyZ2luTGVmdCA9IDUwO1xuXG4gIEBIb3N0TGlzdGVuZXIoJ2tleWRvd24nLCBbJyRldmVudCddKVxuICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDprZXlkb3duJywgWyckZXZlbnQnXSlcbiAgaGFuZGxlS2V5RG93bigkZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBpZiAoJGV2ZW50LmtleSA9PT0gJ0NvbnRyb2wnKSB7XG4gICAgICB0aGlzLnRyaW1tZWQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIGlmICghIXRoaXMudG9vbFRpcC5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJyN0b29sdGlwLWJvZHknKSkge1xuICAgICAgICAgIHRoaXMudG9vbFRpcC5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJyN0b29sdGlwLWJvZHknKS5jbGFzc0xpc3QuYWRkKCdmdWxsJyk7XG4gICAgICAgIH1cbiAgICAgIH0sIDEwMCk7XG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcigna2V5dXAnLCBbJyRldmVudCddKVxuICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDprZXl1cCcsIFsnJGV2ZW50J10pXG4gIGhhbmRsZUtleXVwKCRldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZG9jdW1lbnQ6a2V5dXAnXSwgJGV2ZW50KTtcbiAgICBpZiAoJGV2ZW50LmtleSA9PT0gJ0NvbnRyb2wnKSB7XG4gICAgICBpZiAoISF0aGlzLnRvb2xUaXAubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcjdG9vbHRpcC1ib2R5JykpIHtcbiAgICAgICAgaWYgKHRoaXMudHJpbW1lZCkge1xuICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy50cmltbWVkKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRvb2xUaXAubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcjdG9vbHRpcC1ib2R5JykuY2xhc3NMaXN0LnJlbW92ZSgnZnVsbCcpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBlbDogRWxlbWVudFJlZixcbiAgICBwdWJsaWMgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwdWJsaWMgc2l6ZVNlcnZpY2U6IFNpemVTZXJ2aWNlLFxuICAgIHB1YmxpYyBuZ1pvbmU6IE5nWm9uZVxuICApIHtcbiAgICBzdXBlcihlbCwgcmVuZGVyZXIsIHNpemVTZXJ2aWNlLCBuZ1pvbmUpO1xuICAgIHRoaXMuX2F1dG9SZXNpemUgPSBmYWxzZTtcbiAgICB0aGlzLkxPRyA9IG5ldyBMb2dnZXIoV2FycFZpZXdBbm5vdGF0aW9uQ29tcG9uZW50LCB0aGlzLl9kZWJ1Zyk7XG4gIH1cblxuICB1cGRhdGUob3B0aW9uczogUGFyYW0sIHJlZnJlc2g6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBpZiAoISFvcHRpb25zKSB7XG4gICAgICB0aGlzLl9vcHRpb25zID0gQ2hhcnRMaWIubWVyZ2VEZWVwKHRoaXMuX29wdGlvbnMsIG9wdGlvbnMpIGFzIFBhcmFtO1xuICAgIH1cbiAgICB0aGlzLmRyYXdDaGFydChyZWZyZXNoKTtcbiAgfVxuXG4gIHVwZGF0ZUJvdW5kcyhtaW4sIG1heCwgbWFyZ2luTGVmdCkge1xuICAgIHRoaXMuTE9HLmRlYnVnKFsndXBkYXRlQm91bmRzJ10sIG1pbiwgbWF4LCB0aGlzLl9vcHRpb25zKTtcbiAgICB0aGlzLl9vcHRpb25zLmJvdW5kcy5taW5EYXRlID0gbWluO1xuICAgIHRoaXMuX29wdGlvbnMuYm91bmRzLm1heERhdGUgPSBtYXg7XG4gICAgdGhpcy5sYXlvdXQueGF4aXMuYXV0b3JhbmdlID0gZmFsc2U7XG4gICAgdGhpcy5MT0cuZGVidWcoWyd1cGRhdGVCb3VuZHMnXSxcbiAgICAgIG1vbWVudC50eihtaW4gLyB0aGlzLmRpdmlkZXIsIHRoaXMuX29wdGlvbnMudGltZVpvbmUpLnRvSVNPU3RyaW5nKCksXG4gICAgICBtb21lbnQudHoobWF4IC8gdGhpcy5kaXZpZGVyLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKS50b0lTT1N0cmluZygpKTtcbiAgICB0aGlzLm1pblRpY2sgPSBtaW47XG4gICAgdGhpcy5tYXhUaWNrID0gbWF4O1xuICAgIGlmICh0aGlzLl9vcHRpb25zLnRpbWVNb2RlICYmIHRoaXMuX29wdGlvbnMudGltZU1vZGUgPT09ICd0aW1lc3RhbXAnKSB7XG4gICAgICB0aGlzLmxheW91dC54YXhpcy50aWNrMCA9IG1pbiAvIHRoaXMuZGl2aWRlcjtcbiAgICAgIHRoaXMubGF5b3V0LnhheGlzLnJhbmdlID0gW21pbiAvIHRoaXMuZGl2aWRlciwgbWF4IC8gdGhpcy5kaXZpZGVyXTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sYXlvdXQueGF4aXMudGljazAgPSBtb21lbnQudHoobWluIC8gdGhpcy5kaXZpZGVyLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKS50b0lTT1N0cmluZygpO1xuICAgICAgdGhpcy5sYXlvdXQueGF4aXMucmFuZ2UgPSBbXG4gICAgICAgIG1vbWVudC50eihtaW4gLyB0aGlzLmRpdmlkZXIsIHRoaXMuX29wdGlvbnMudGltZVpvbmUpLnRvSVNPU3RyaW5nKCksXG4gICAgICAgIG1vbWVudC50eihtYXggLyB0aGlzLmRpdmlkZXIsIHRoaXMuX29wdGlvbnMudGltZVpvbmUpLnRvSVNPU3RyaW5nKClcbiAgICAgIF07XG4gICAgfVxuICAgIHRoaXMubGF5b3V0Lm1hcmdpbi5sID0gbWFyZ2luTGVmdDtcbiAgICB0aGlzLm1hcmdpbkxlZnQgPSBtYXJnaW5MZWZ0O1xuICAgIHRoaXMubGF5b3V0ID0gey4uLnRoaXMubGF5b3V0fTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3VwZGF0ZUJvdW5kcyddLCB7Li4udGhpcy5sYXlvdXQueGF4aXMucmFuZ2V9KTtcbiAgfVxuXG4gIGRyYXdDaGFydChyZXBhcnNlTmV3RGF0YTogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgaWYgKCF0aGlzLmluaXRDaGFydCh0aGlzLmVsKSkge1xuICAgICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RyYXdDaGFydCcsICd0aGlzLnBsb3RseURhdGEnXSwgdGhpcy5wbG90bHlEYXRhKTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RyYXdDaGFydCcsICdoaWRkZW5EYXRhJ10sIHRoaXMuX2hpZGRlbkRhdGEpO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZHJhd0NoYXJ0JywgJ3RoaXMuX29wdGlvbnMuYm91bmRzJ10sIHRoaXMuX29wdGlvbnMuYm91bmRzKTtcbiAgICB0aGlzLmxheW91dC55YXhpcy5jb2xvciA9IHRoaXMuZ2V0R3JpZENvbG9yKHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XG4gICAgdGhpcy5sYXlvdXQueWF4aXMuZ3JpZGNvbG9yID0gdGhpcy5nZXRHcmlkQ29sb3IodGhpcy5lbC5uYXRpdmVFbGVtZW50KTtcbiAgICB0aGlzLmxheW91dC55YXhpcy5zaG93bGluZSA9ICEhdGhpcy5fc3RhbmRhbG9uZTtcbiAgICB0aGlzLmxheW91dC55YXhpcy56ZXJvbGluZWNvbG9yID0gdGhpcy5nZXRHcmlkQ29sb3IodGhpcy5lbC5uYXRpdmVFbGVtZW50KTtcbiAgICB0aGlzLmxheW91dC54YXhpcy5jb2xvciA9IHRoaXMuZ2V0R3JpZENvbG9yKHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XG4gICAgdGhpcy5sYXlvdXQueGF4aXMuZ3JpZGNvbG9yID0gdGhpcy5nZXRHcmlkQ29sb3IodGhpcy5lbC5uYXRpdmVFbGVtZW50KTtcbiAgICB0aGlzLmxheW91dC54YXhpcy5hdXRvcmFuZ2UgPSAhIXRoaXMuX3N0YW5kYWxvbmU7XG4gICAgdGhpcy5sYXlvdXQueGF4aXMuc2hvd3RpY2tsYWJlbHMgPSAhIXRoaXMuX3N0YW5kYWxvbmU7XG4gICAgdGhpcy5kaXNwbGF5RXhwYW5kZXIgPSAodGhpcy5wbG90bHlEYXRhLmxlbmd0aCA+IDEpO1xuICAgIGNvbnN0IGNvdW50ID0gdGhpcy5wbG90bHlEYXRhLmZpbHRlcihkID0+IGQueS5sZW5ndGggPiAwKS5sZW5ndGg7XG4gICAgdGhpcy5sYXlvdXQubWFyZ2luLmwgPSAhIXRoaXMuX3N0YW5kYWxvbmUgPyAxMCA6IDUwO1xuICAgIHRoaXMubGF5b3V0Lm1hcmdpbi5iID0gISF0aGlzLl9zdGFuZGFsb25lID8gNTAgOiAxO1xuICAgIGNvbnN0IGNhbGN1bGF0ZWRIZWlnaHQgPSAodGhpcy5leHBhbmRlZCA/IHRoaXMubGluZUhlaWdodCAqIGNvdW50IDogdGhpcy5saW5lSGVpZ2h0KSArIHRoaXMubGF5b3V0Lm1hcmdpbi50ICsgdGhpcy5sYXlvdXQubWFyZ2luLmI7XG4gICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LnN0eWxlLmhlaWdodCA9IGNhbGN1bGF0ZWRIZWlnaHQgKyAncHgnO1xuICAgIHRoaXMuaGVpZ2h0ID0gY2FsY3VsYXRlZEhlaWdodDtcbiAgICB0aGlzLmxheW91dC5oZWlnaHQgPSB0aGlzLmhlaWdodDtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RyYXdDaGFydCcsICdoZWlnaHQnXSwgdGhpcy5oZWlnaHQsIGNvdW50LCBjYWxjdWxhdGVkSGVpZ2h0KTtcbiAgICB0aGlzLmxheW91dC55YXhpcy5yYW5nZSA9IFswLCB0aGlzLmV4cGFuZGVkID8gY291bnQgOiAxXTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RyYXdDaGFydCcsICd0aGlzLmxheW91dCddLCB0aGlzLmxheW91dCk7XG4gICAgaWYgKHRoaXMuX29wdGlvbnMudGltZU1vZGUgJiYgdGhpcy5fb3B0aW9ucy50aW1lTW9kZSA9PT0gJ3RpbWVzdGFtcCcpIHtcbiAgICAgIHRoaXMubGF5b3V0LnhheGlzLnRpY2swID0gdGhpcy5taW5UaWNrIC8gdGhpcy5kaXZpZGVyO1xuICAgICAgdGhpcy5sYXlvdXQueGF4aXMucmFuZ2UgPSBbdGhpcy5taW5UaWNrIC8gdGhpcy5kaXZpZGVyLCB0aGlzLm1heFRpY2sgLyB0aGlzLmRpdmlkZXJdO1xuICAgICAgdGhpcy5sYXlvdXQueGF4aXMudHlwZSA9ICdsaW5lYXInO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxheW91dC54YXhpcy50aWNrMCA9IG1vbWVudC50eih0aGlzLm1pblRpY2sgLyB0aGlzLmRpdmlkZXIsIHRoaXMuX29wdGlvbnMudGltZVpvbmUpLnRvSVNPU3RyaW5nKHRydWUpO1xuICAgICAgdGhpcy5sYXlvdXQueGF4aXMucmFuZ2UgPSBbXG4gICAgICAgIG1vbWVudC50eih0aGlzLm1pblRpY2sgLyB0aGlzLmRpdmlkZXIsIHRoaXMuX29wdGlvbnMudGltZVpvbmUpLnRvSVNPU3RyaW5nKHRydWUpLFxuICAgICAgICBtb21lbnQudHoodGhpcy5tYXhUaWNrIC8gdGhpcy5kaXZpZGVyLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKS50b0lTT1N0cmluZyh0cnVlKVxuICAgICAgXTtcbiAgICAgIHRoaXMubGF5b3V0LnhheGlzLnR5cGUgPSAnZGF0ZSc7XG4gICAgfVxuICAgIHRoaXMucGxvdGx5Q29uZmlnLnNjcm9sbFpvb20gPSB0cnVlO1xuICAgIHRoaXMucGxvdGx5Q29uZmlnID0gey4uLnRoaXMucGxvdGx5Q29uZmlnfTtcbiAgICB0aGlzLmxheW91dCA9IHsuLi50aGlzLmxheW91dH07XG4gICAgdGhpcy5MT0cuZGVidWcoWydkcmF3Q2hhcnQnLCAndGhpcy5wbG90bHlDb25maWcnXSwgdGhpcy5wbG90bHlDb25maWcsIHRoaXMucGxvdGx5RGF0YSk7XG4gICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gIH1cblxuICByZWxheW91dChkYXRhOiBhbnkpIHtcbiAgICBpZiAoZGF0YVsneGF4aXMucmFuZ2UnXSAmJiBkYXRhWyd4YXhpcy5yYW5nZSddLmxlbmd0aCA9PT0gMikge1xuICAgICAgdGhpcy5MT0cuZGVidWcoWydyZWxheW91dCcsICd1cGRhdGVCb3VuZHMnLCAneGF4aXMucmFuZ2UnXSwgZGF0YVsneGF4aXMucmFuZ2UnXSk7XG4gICAgICB0aGlzLmNoYXJ0Qm91bmRzLm1zbWluID0gZGF0YVsneGF4aXMucmFuZ2UnXVswXTtcbiAgICAgIHRoaXMuY2hhcnRCb3VuZHMubXNtYXggPSBkYXRhWyd4YXhpcy5yYW5nZSddWzFdO1xuICAgICAgdGhpcy5jaGFydEJvdW5kcy50c21pbiA9IG1vbWVudC50eihtb21lbnQodGhpcy5jaGFydEJvdW5kcy5tc21pbiksIHRoaXMuX29wdGlvbnMudGltZVpvbmUpLnZhbHVlT2YoKTtcbiAgICAgIHRoaXMuY2hhcnRCb3VuZHMudHNtYXggPSBtb21lbnQudHoobW9tZW50KHRoaXMuY2hhcnRCb3VuZHMubXNtYXgpLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKS52YWx1ZU9mKCk7XG4gICAgfSBlbHNlIGlmIChkYXRhWyd4YXhpcy5yYW5nZVswXSddICYmIGRhdGFbJ3hheGlzLnJhbmdlWzFdJ10pIHtcbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsncmVsYXlvdXQnLCAndXBkYXRlQm91bmRzJywgJ3hheGlzLnJhbmdlW3hdJ10sIGRhdGFbJ3hheGlzLnJhbmdlWzBdJ10pO1xuICAgICAgdGhpcy5jaGFydEJvdW5kcy5tc21pbiA9IGRhdGFbJ3hheGlzLnJhbmdlWzBdJ107XG4gICAgICB0aGlzLmNoYXJ0Qm91bmRzLm1zbWF4ID0gZGF0YVsneGF4aXMucmFuZ2VbMV0nXTtcbiAgICAgIHRoaXMuY2hhcnRCb3VuZHMudHNtaW4gPSBtb21lbnQudHoobW9tZW50KHRoaXMuY2hhcnRCb3VuZHMubXNtaW4pLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKS52YWx1ZU9mKCk7XG4gICAgICB0aGlzLmNoYXJ0Qm91bmRzLnRzbWF4ID0gbW9tZW50LnR6KG1vbWVudCh0aGlzLmNoYXJ0Qm91bmRzLm1zbWF4KSwgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSkudmFsdWVPZigpO1xuICAgIH0gZWxzZSBpZiAoZGF0YVsneGF4aXMuYXV0b3JhbmdlJ10pIHtcbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsncmVsYXlvdXQnLCAndXBkYXRlQm91bmRzJywgJ2F1dG9yYW5nZSddLCBkYXRhKTtcbiAgICAgIHRoaXMuY2hhcnRCb3VuZHMudHNtaW4gPSB0aGlzLm1pblRpY2sgLyB0aGlzLmRpdmlkZXI7XG4gICAgICB0aGlzLmNoYXJ0Qm91bmRzLnRzbWF4ID0gdGhpcy5tYXhUaWNrIC8gdGhpcy5kaXZpZGVyO1xuICAgIH1cbiAgICB0aGlzLmVtaXROZXdCb3VuZHMobW9tZW50LnV0Yyh0aGlzLmNoYXJ0Qm91bmRzLnRzbWluKS52YWx1ZU9mKCksIG1vbWVudC51dGModGhpcy5jaGFydEJvdW5kcy5tc21heCkudmFsdWVPZigpKTtcbiAgfVxuXG4gIGhvdmVyKGRhdGE6IGFueSkge1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnaG92ZXInXSwgZGF0YSk7XG4gICAgY29uc3QgdG9vbHRpcCA9IHRoaXMudG9vbFRpcC5uYXRpdmVFbGVtZW50O1xuICAgIHRoaXMucG9pbnRIb3Zlci5lbWl0KHtcbiAgICAgIHg6IGRhdGEuZXZlbnQub2Zmc2V0WCxcbiAgICAgIHk6IGRhdGEuZXZlbnQub2Zmc2V0WVxuICAgIH0pO1xuICAgIGxldCB4ID0gZGF0YS54dmFsc1swXTtcbiAgICBpZiAoISFkYXRhLnBvaW50c1swXSkge1xuICAgICAgeCA9IGRhdGEucG9pbnRzWzBdLng7XG4gICAgfVxuICAgIGNvbnN0IGxheW91dCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBjb3VudCA9IHRoaXMucGxvdGx5RGF0YS5maWx0ZXIoZCA9PiBkLnkubGVuZ3RoID4gMCkubGVuZ3RoO1xuICAgIHRvb2x0aXAuc3R5bGUub3BhY2l0eSA9ICcxJztcbiAgICB0b29sdGlwLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIHRvb2x0aXAuc3R5bGUucGFkZGluZ0xlZnQgPSAodGhpcy5fc3RhbmRhbG9uZSA/IDAgOiA0MCkgKyAncHgnO1xuICAgIHRvb2x0aXAuc3R5bGUudG9wID0gKFxuICAgICAgKHRoaXMuZXhwYW5kZWQgPyBjb3VudCAtIDEgLSAoZGF0YS5wb2ludHNbMF0ueSArIDAuNSkgOiAtMSkgKiAodGhpcy5saW5lSGVpZ2h0KSArIHRoaXMubGF5b3V0Lm1hcmdpbi50XG4gICAgKSArIDYgKyAncHgnO1xuICAgIHRvb2x0aXAuY2xhc3NMaXN0LnJlbW92ZSgncmlnaHQnLCAnbGVmdCcpO1xuICAgIHRvb2x0aXAuaW5uZXJIVE1MID0gYDxkaXYgY2xhc3M9XCJ0b29sdGlwLWJvZHkgdHJpbW1lZFwiIGlkPVwidG9vbHRpcC1ib2R5XCI+XG48c3BhbiBjbGFzcz1cInRvb2x0aXAtZGF0ZVwiPiR7dGhpcy5fb3B0aW9ucy50aW1lTW9kZSA9PT0gJ3RpbWVzdGFtcCdcbiAgICAgID8geFxuICAgICAgOiAobW9tZW50KHgpLnV0YygpLnRvSVNPU3RyaW5nKCkucmVwbGFjZSgnWicsIHRoaXMuX29wdGlvbnMudGltZVpvbmUgPT09ICdVVEMnID8gJ1onIDogJycpIHx8ICcnKX08L3NwYW4+XG48dWw+XG48bGk+JHtHVFNMaWIuZm9ybWF0TGFiZWwoZGF0YS5wb2ludHNbMF0uZGF0YS5uYW1lKX06IDxzcGFuIGNsYXNzPVwidmFsdWVcIj4ke2RhdGEucG9pbnRzWzBdLnRleHR9PC9zcGFuPjwvbGk+XG48L3VsPlxuICAgICAgPC9kaXY+YDtcbiAgICBpZiAoZGF0YS5ldmVudC5vZmZzZXRYID4gbGF5b3V0LndpZHRoIC8gMikge1xuICAgICAgdG9vbHRpcC5jbGFzc0xpc3QuYWRkKCdsZWZ0Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRvb2x0aXAuY2xhc3NMaXN0LmFkZCgncmlnaHQnKTtcbiAgICB9XG4gICAgdG9vbHRpcC5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnO1xuICB9XG5cbiAgdW5ob3ZlcigpIHtcbiAgICB0aGlzLnRvb2xUaXAubmF0aXZlRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICB9XG5cbiAgYWZ0ZXJQbG90KGRpdikge1xuICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgIHRoaXMuY2hhcnRCb3VuZHMudHNtaW4gPSB0aGlzLm1pblRpY2s7XG4gICAgdGhpcy5jaGFydEJvdW5kcy50c21heCA9IHRoaXMubWF4VGljaztcbiAgICB0aGlzLmNoYXJ0RHJhdy5lbWl0KHRoaXMuY2hhcnRCb3VuZHMpO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnYWZ0ZXJQbG90J10sIHRoaXMuY2hhcnRCb3VuZHMsIGRpdik7XG4gIH1cblxuICBwcml2YXRlIGVtaXROZXdCb3VuZHMobWluLCBtYXgpIHtcbiAgICBpZiAodGhpcy5fb3B0aW9ucy50aW1lTW9kZSAmJiB0aGlzLl9vcHRpb25zLnRpbWVNb2RlID09PSAndGltZXN0YW1wJykge1xuICAgICAgdGhpcy5ib3VuZHNEaWRDaGFuZ2UuZW1pdCh7Ym91bmRzOiB7bWluLCBtYXh9LCBzb3VyY2U6ICdhbm5vdGF0aW9uJ30pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmJvdW5kc0RpZENoYW5nZS5lbWl0KHtcbiAgICAgICAgYm91bmRzOiB7XG4gICAgICAgICAgbWluOiBtb21lbnQudHoobWluLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKS52YWx1ZU9mKCksXG4gICAgICAgICAgbWF4OiBtb21lbnQudHoobWF4LCB0aGlzLl9vcHRpb25zLnRpbWVab25lKS52YWx1ZU9mKClcbiAgICAgICAgfSxcbiAgICAgICAgc291cmNlOiAnYW5ub3RhdGlvbidcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBjb252ZXJ0KGRhdGE6IERhdGFNb2RlbCk6IFBhcnRpYWw8YW55PltdIHtcbiAgICBjb25zdCBkYXRhc2V0OiBQYXJ0aWFsPGFueT5bXSA9IFtdO1xuICAgIGxldCBndHNMaXN0ID0gR1RTTGliLmZsYXREZWVwKEdUU0xpYi5mbGF0dGVuR3RzSWRBcnJheShkYXRhLmRhdGEgYXMgYW55W10sIDApLnJlcyk7XG4gICAgdGhpcy5tYXhUaWNrID0gTnVtYmVyLk5FR0FUSVZFX0lORklOSVRZO1xuICAgIHRoaXMubWluVGljayA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWTtcbiAgICB0aGlzLnZpc2libGVHdHNJZCA9IFtdO1xuICAgIHRoaXMuZ3RzSWQgPSBbXTtcbiAgICBjb25zdCBub25QbG90dGFibGUgPSBndHNMaXN0LmZpbHRlcihnID0+IGcudiAmJiBHVFNMaWIuaXNHdHNUb1Bsb3QoZykpO1xuICAgIGd0c0xpc3QgPSBndHNMaXN0LmZpbHRlcihnID0+IGcudiAmJiAhR1RTTGliLmlzR3RzVG9QbG90KGcpKTtcbiAgICBsZXQgdGltZXN0YW1wTW9kZSA9IHRydWU7XG4gICAgY29uc3QgdHNMaW1pdCA9IDEwMCAqIEdUU0xpYi5nZXREaXZpZGVyKHRoaXMuX29wdGlvbnMudGltZVVuaXQpO1xuICAgIGd0c0xpc3QuZm9yRWFjaCgoZ3RzOiBHVFMpID0+IHtcbiAgICAgIGNvbnN0IHRpY2tzID0gZ3RzLnYubWFwKHQgPT4gdFswXSk7XG4gICAgICBjb25zdCBzaXplID0gZ3RzLnYubGVuZ3RoO1xuICAgICAgdGltZXN0YW1wTW9kZSA9IHRpbWVzdGFtcE1vZGUgJiYgKHRpY2tzWzBdID4gLXRzTGltaXQgJiYgdGlja3NbMF0gPCB0c0xpbWl0KTtcbiAgICAgIHRpbWVzdGFtcE1vZGUgPSB0aW1lc3RhbXBNb2RlICYmICh0aWNrc1tzaXplIC0gMV0gPiAtdHNMaW1pdCAmJiB0aWNrc1tzaXplIC0gMV0gPCB0c0xpbWl0KTtcbiAgICB9KTtcbiAgICBpZiAodGltZXN0YW1wTW9kZSB8fCB0aGlzLl9vcHRpb25zLnRpbWVNb2RlID09PSAndGltZXN0YW1wJykge1xuICAgICAgdGhpcy5sYXlvdXQueGF4aXMudHlwZSA9ICdsaW5lYXInO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxheW91dC54YXhpcy50eXBlID0gJ2RhdGUnO1xuICAgIH1cbiAgICBndHNMaXN0LmZvckVhY2goKGd0czogR1RTLCBpKSA9PiB7XG4gICAgICBpZiAoZ3RzLnYpIHtcbiAgICAgICAgY29uc3Qgc2l6ZSA9IGd0cy52Lmxlbmd0aDtcbiAgICAgICAgY29uc3QgbGFiZWwgPSBHVFNMaWIuc2VyaWFsaXplR3RzTWV0YWRhdGEoZ3RzKTtcbiAgICAgICAgY29uc3QgYyA9IENvbG9yTGliLmdldENvbG9yKGd0cy5pZCwgdGhpcy5fb3B0aW9ucy5zY2hlbWUpO1xuICAgICAgICBjb25zdCBjb2xvciA9ICgoZGF0YS5wYXJhbXMgfHwgW10pW2ldIHx8IHtkYXRhc2V0Q29sb3I6IGN9KS5kYXRhc2V0Q29sb3IgfHwgYztcbiAgICAgICAgY29uc3Qgc2VyaWVzOiBQYXJ0aWFsPGFueT4gPSB7XG4gICAgICAgICAgdHlwZTogJ3NjYXR0ZXInLFxuICAgICAgICAgIG1vZGU6ICdtYXJrZXJzJyxcbiAgICAgICAgICBuYW1lOiBsYWJlbCxcbiAgICAgICAgICB4OiBbXSxcbiAgICAgICAgICB5OiBbXSxcbiAgICAgICAgICB0ZXh0OiBbXSxcbiAgICAgICAgICBob3ZlcmluZm86ICdub25lJyxcbiAgICAgICAgICBjb25uZWN0Z2FwczogZmFsc2UsXG4gICAgICAgICAgdmlzaWJsZTogISh0aGlzLl9oaWRkZW5EYXRhLmZpbHRlcihoID0+IGggPT09IGd0cy5pZCkubGVuZ3RoID4gMCksXG4gICAgICAgICAgbGluZToge2NvbG9yfSxcbiAgICAgICAgICBtYXJrZXI6IHtcbiAgICAgICAgICAgIHN5bWJvbDogJ2xpbmUtbnMtb3BlbicsXG4gICAgICAgICAgICBjb2xvcixcbiAgICAgICAgICAgIHNpemU6IDIwLFxuICAgICAgICAgICAgd2lkdGg6IDUsXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnZpc2libGVHdHNJZC5wdXNoKGd0cy5pZCk7XG4gICAgICAgIHRoaXMuZ3RzSWQucHVzaChndHMuaWQpO1xuICAgICAgICBpZiAodGhpcy5fb3B0aW9ucy50aW1lTW9kZSAmJiB0aGlzLl9vcHRpb25zLnRpbWVNb2RlID09PSAndGltZXN0YW1wJykge1xuICAgICAgICAgIHRoaXMubGF5b3V0LnhheGlzLnR5cGUgPSAnbGluZWFyJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmxheW91dC54YXhpcy50eXBlID0gJ2RhdGUnO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHRpY2tzID0gZ3RzLnYubWFwKHQgPT4gdFswXSk7XG4gICAgICAgIHNlcmllcy50ZXh0ID0gZ3RzLnYubWFwKHQgPT4gdFt0Lmxlbmd0aCAtIDFdKTtcbiAgICAgICAgc2VyaWVzLnkgPSBndHMudi5tYXAoKCkgPT4gKHRoaXMuZXhwYW5kZWQgPyBpIDogMCkgKyAwLjUpO1xuICAgICAgICBpZiAoc2l6ZSA+IDApIHtcbiAgICAgICAgICB0aGlzLm1pblRpY2sgPSB0aWNrc1swXTtcbiAgICAgICAgICB0aGlzLm1heFRpY2sgPSB0aWNrc1swXTtcbiAgICAgICAgICBmb3IgKGxldCB2ID0gMTsgdiA8IHNpemU7IHYrKykge1xuICAgICAgICAgICAgY29uc3QgdmFsID0gdGlja3Nbdl07XG4gICAgICAgICAgICB0aGlzLm1pblRpY2sgPSAodmFsIDwgdGhpcy5taW5UaWNrKSA/IHZhbCA6IHRoaXMubWluVGljaztcbiAgICAgICAgICAgIHRoaXMubWF4VGljayA9ICh2YWwgPiB0aGlzLm1heFRpY2spID8gdmFsIDogdGhpcy5tYXhUaWNrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGltZXN0YW1wTW9kZSB8fCB0aGlzLl9vcHRpb25zLnRpbWVNb2RlID09PSAndGltZXN0YW1wJykge1xuICAgICAgICAgIHNlcmllcy54ID0gdGlja3M7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHRoaXMuX29wdGlvbnMudGltZVpvbmUgIT09ICdVVEMnKSB7XG4gICAgICAgICAgICBzZXJpZXMueCA9IHRpY2tzLm1hcCh0ID0+IG1vbWVudC51dGModCAvIHRoaXMuZGl2aWRlcikudHoodGhpcy5fb3B0aW9ucy50aW1lWm9uZSkudG9JU09TdHJpbmcoKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlcmllcy54ID0gdGlja3MubWFwKHQgPT4gbW9tZW50LnV0Yyh0IC8gdGhpcy5kaXZpZGVyKS50b0lTT1N0cmluZygpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNlcmllcy54Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBkYXRhc2V0LnB1c2goc2VyaWVzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChub25QbG90dGFibGUubGVuZ3RoID4gMCkge1xuICAgICAgbm9uUGxvdHRhYmxlLmZvckVhY2goZyA9PiB7XG4gICAgICAgIGcudi5mb3JFYWNoKHZhbHVlID0+IHtcbiAgICAgICAgICBjb25zdCB0cyA9IHZhbHVlWzBdO1xuICAgICAgICAgIGlmICh0cyA8IHRoaXMubWluVGljaykge1xuICAgICAgICAgICAgdGhpcy5taW5UaWNrID0gdHM7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0cyA+IHRoaXMubWF4VGljaykge1xuICAgICAgICAgICAgdGhpcy5tYXhUaWNrID0gdHM7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgLy8gaWYgdGhlcmUgaXMgbm90IGFueSBwbG90dGFibGUgZGF0YSwgd2UgbXVzdCBhZGQgYSBmYWtlIG9uZSB3aXRoIGlkIC0xLiBUaGlzIG9uZSB3aWxsIGFsd2F5cyBiZSBoaWRkZW4uXG4gICAgICBpZiAoMCA9PT0gZ3RzTGlzdC5sZW5ndGgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRhdGFIYXNoc2V0W3RoaXMubWluVGlja10pIHtcbiAgICAgICAgICB0aGlzLmRhdGFIYXNoc2V0W3RoaXMubWluVGlja10gPSBbMF07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmRhdGFIYXNoc2V0W3RoaXMubWF4VGlja10pIHtcbiAgICAgICAgICB0aGlzLmRhdGFIYXNoc2V0W3RoaXMubWF4VGlja10gPSBbMF07XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy52aXNpYmlsaXR5LnB1c2goZmFsc2UpO1xuICAgICAgICB0aGlzLnZpc2libGVHdHNJZC5wdXNoKC0xKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRpbWVzdGFtcE1vZGUpIHtcbiAgICAgIHRoaXMuX29wdGlvbnMudGltZU1vZGUgPSAndGltZXN0YW1wJztcbiAgICB9XG4gICAgcmV0dXJuIGRhdGFzZXQ7XG4gIH1cblxuICB0b2dnbGUoKSB7XG4gICAgdGhpcy5leHBhbmRlZCA9ICF0aGlzLmV4cGFuZGVkO1xuICAgIHRoaXMuZHJhd0NoYXJ0KCk7XG4gIH1cblxuICBzZXRSZWFsQm91bmRzKGNoYXJ0Qm91bmRzOiBDaGFydEJvdW5kcykge1xuICAgIHRoaXMubWluVGljayA9IGNoYXJ0Qm91bmRzLnRzbWluO1xuICAgIHRoaXMubWF4VGljayA9IGNoYXJ0Qm91bmRzLnRzbWF4O1xuICAgIHRoaXMuX29wdGlvbnMuYm91bmRzID0gdGhpcy5fb3B0aW9ucy5ib3VuZHMgfHwge307XG4gICAgdGhpcy5fb3B0aW9ucy5ib3VuZHMubWluRGF0ZSA9IHRoaXMubWluVGljaztcbiAgICB0aGlzLl9vcHRpb25zLmJvdW5kcy5tYXhEYXRlID0gdGhpcy5tYXhUaWNrO1xuICAgIGNvbnN0IHggPSB7XG4gICAgICB0aWNrMDogdW5kZWZpbmVkLFxuICAgICAgcmFuZ2U6IFtdXG4gICAgfTtcbiAgICBpZiAodGhpcy5fb3B0aW9ucy50aW1lTW9kZSAmJiB0aGlzLl9vcHRpb25zLnRpbWVNb2RlID09PSAndGltZXN0YW1wJykge1xuICAgICAgeC50aWNrMCA9IHRoaXMubWluVGljayAvIHRoaXMuZGl2aWRlcjtcbiAgICAgIHgucmFuZ2UgPSBbdGhpcy5taW5UaWNrIC8gdGhpcy5kaXZpZGVyLCB0aGlzLm1heFRpY2sgLyB0aGlzLmRpdmlkZXJdO1xuICAgIH0gZWxzZSB7XG4gICAgICB4LnRpY2swID0gbW9tZW50LnR6KHRoaXMubWluVGljayAvIHRoaXMuZGl2aWRlciwgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSkudG9JU09TdHJpbmcodHJ1ZSk7XG4gICAgICB4LnJhbmdlID0gW1xuICAgICAgICBtb21lbnQudHoodGhpcy5taW5UaWNrIC8gdGhpcy5kaXZpZGVyLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKS50b0lTT1N0cmluZyh0cnVlKSxcbiAgICAgICAgbW9tZW50LnR6KHRoaXMubWF4VGljayAvIHRoaXMuZGl2aWRlciwgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSkudG9JU09TdHJpbmcodHJ1ZSlcbiAgICAgIF07XG4gICAgfVxuICAgIHRoaXMubGF5b3V0LnhheGlzID0geDtcbiAgICB0aGlzLmxheW91dCA9IHsuLi50aGlzLmxheW91dH07XG4gIH1cbn1cbiJdfQ==