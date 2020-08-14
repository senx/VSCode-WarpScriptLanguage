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
export class WarpViewChartComponent extends WarpViewComponent {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
            x.tick0 = moment.tz(min / this.divider, this._options.timeZone).toISOString(true);
            x.range = [
                moment.tz(min / this.divider, this._options.timeZone).toISOString(true),
                moment.tz(max / this.divider, this._options.timeZone).toISOString(true)
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
                    min: moment.tz(min, this._options.timeZone).valueOf(),
                    max: moment.tz(max, this._options.timeZone).valueOf(),
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
                            t => moment.utc(t / this.divider).tz(this._options.timeZone).toISOString()));
                        }
                        else {
                            series.x = ticks.map((/**
                             * @param {?} t
                             * @return {?}
                             */
                            t => moment.utc(t / this.divider).toISOString()));
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
            x.tick0 = moment.tz(this.minTick / this.divider, this._options.timeZone).toISOString(true);
            x.range = [
                moment.tz(this.minTick / this.divider, this._options.timeZone).toISOString(true),
                moment.tz(this.maxTick / this.divider, this._options.timeZone).toISOString(true)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LWNoYXJ0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzZW54L3dhcnB2aWV3LyIsInNvdXJjZXMiOlsic3JjL2xpYi9lbGVtZW50cy93YXJwLXZpZXctY2hhcnQvd2FycC12aWV3LWNoYXJ0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQVUsTUFBTSxFQUFFLFNBQVMsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUcvSCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDM0MsT0FBTyxNQUFNLE1BQU0saUJBQWlCLENBQUM7QUFDckMsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBQ3BELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQyxPQUFPLEVBQWtCLGlCQUFpQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDMUUsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBQzFELE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUMxQyxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzdCLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUM1QyxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFRNUMsTUFBTSxPQUFPLHNCQUF1QixTQUFRLGlCQUFpQjs7Ozs7OztJQXFGM0QsWUFDUyxFQUFjLEVBQ2QsUUFBbUIsRUFDbkIsV0FBd0IsRUFDeEIsTUFBYztRQUVyQixLQUFLLENBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFMbEMs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aURBQTBDOztJQUMxQywrQ0FBK0Q7O0lBQy9ELHdDQXFCRTs7Ozs7SUFDRiw2Q0FBeUI7O0lBT3ZCLG9DQUFxQjs7SUFDckIsMENBQTBCOztJQUMxQiw2Q0FBK0I7O0lBQy9CLHdDQUFxQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQ29weXJpZ2h0IDIwMjAgIFNlblggUy5BLlMuXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE5nWm9uZSwgT25Jbml0LCBPdXRwdXQsIFJlbmRlcmVyMiwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtEYXRhTW9kZWx9IGZyb20gJy4uLy4uL21vZGVsL2RhdGFNb2RlbCc7XG5pbXBvcnQge0dUU30gZnJvbSAnLi4vLi4vbW9kZWwvR1RTJztcbmltcG9ydCB7R1RTTGlifSBmcm9tICcuLi8uLi91dGlscy9ndHMubGliJztcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50LXRpbWV6b25lJztcbmltcG9ydCB7Q2hhcnRCb3VuZHN9IGZyb20gJy4uLy4uL21vZGVsL2NoYXJ0Qm91bmRzJztcbmltcG9ydCB7Q29sb3JMaWJ9IGZyb20gJy4uLy4uL3V0aWxzL2NvbG9yLWxpYic7XG5pbXBvcnQge1Zpc2liaWxpdHlTdGF0ZSwgV2FycFZpZXdDb21wb25lbnR9IGZyb20gJy4uL3dhcnAtdmlldy1jb21wb25lbnQnO1xuaW1wb3J0IHtTaXplU2VydmljZX0gZnJvbSAnLi4vLi4vc2VydmljZXMvcmVzaXplLnNlcnZpY2UnO1xuaW1wb3J0IHtMb2dnZXJ9IGZyb20gJy4uLy4uL3V0aWxzL2xvZ2dlcic7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtkZWJvdW5jZVRpbWV9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7VGltc29ydH0gZnJvbSAnLi4vLi4vdXRpbHMvdGltc29ydCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3dhcnB2aWV3LWNoYXJ0JyxcbiAgdGVtcGxhdGVVcmw6ICcuL3dhcnAtdmlldy1jaGFydC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3dhcnAtdmlldy1jaGFydC5jb21wb25lbnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5TaGFkb3dEb21cbn0pXG5leHBvcnQgY2xhc3MgV2FycFZpZXdDaGFydENvbXBvbmVudCBleHRlbmRzIFdhcnBWaWV3Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICBASW5wdXQoJ2hpZGRlbkRhdGEnKSBzZXQgaGlkZGVuRGF0YShoaWRkZW5EYXRhOiBudW1iZXJbXSkge1xuICAgIGNvbnN0IHByZXZpb3VzVmlzaWJpbGl0eSA9IEpTT04uc3RyaW5naWZ5KHRoaXMudmlzaWJpbGl0eSk7XG4gICAgdGhpcy5MT0cuZGVidWcoWydoaWRkZW5EYXRhJywgJ3ByZXZpb3VzVmlzaWJpbGl0eSddLCBwcmV2aW91c1Zpc2liaWxpdHkpO1xuICAgIHRoaXMuX2hpZGRlbkRhdGEgPSBoaWRkZW5EYXRhO1xuICAgIHRoaXMudmlzaWJpbGl0eSA9IFtdO1xuICAgIHRoaXMudmlzaWJsZUd0c0lkLmZvckVhY2goaWQgPT4gdGhpcy52aXNpYmlsaXR5LnB1c2goaGlkZGVuRGF0YS5pbmRleE9mKGlkKSA8IDAgJiYgKGlkICE9PSAtMSkpKTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2hpZGRlbkRhdGEnLCAnaGlkZGVuZHlncmFwaGZ1bGx2J10sIHRoaXMudmlzaWJpbGl0eSk7XG4gICAgY29uc3QgbmV3VmlzaWJpbGl0eSA9IEpTT04uc3RyaW5naWZ5KHRoaXMudmlzaWJpbGl0eSk7XG4gICAgdGhpcy5MT0cuZGVidWcoWydoaWRkZW5EYXRhJywgJ2pzb24nXSwgcHJldmlvdXNWaXNpYmlsaXR5LCBuZXdWaXNpYmlsaXR5LCB0aGlzLl9oaWRkZW5EYXRhKTtcbiAgICBpZiAocHJldmlvdXNWaXNpYmlsaXR5ICE9PSBuZXdWaXNpYmlsaXR5KSB7XG4gICAgICBjb25zdCB2aXNpYmxlID0gW107XG4gICAgICBjb25zdCBoaWRkZW4gPSBbXTtcbiAgICAgICh0aGlzLmd0c0lkIHx8IFtdKS5mb3JFYWNoKChpZCwgaSkgPT4ge1xuICAgICAgICBpZiAodGhpcy5faGlkZGVuRGF0YS5pbmRleE9mKGlkKSA+IC0xKSB7XG4gICAgICAgICAgaGlkZGVuLnB1c2goaSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmlzaWJsZS5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGlmICh2aXNpYmxlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGhpcy5ncmFwaC5yZXN0eWxlQ2hhcnQoe3Zpc2libGU6IHRydWV9LCB2aXNpYmxlKTtcbiAgICAgIH1cbiAgICAgIGlmIChoaWRkZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICB0aGlzLmdyYXBoLnJlc3R5bGVDaGFydCh7dmlzaWJsZTogZmFsc2V9LCBoaWRkZW4pO1xuICAgICAgfVxuICAgICAgdGhpcy5MT0cuZGVidWcoWydoaWRkZW5keWdyYXBodHJpZycsICdkZXN0cm95J10sICdyZWRyYXcgYnkgdmlzaWJpbGl0eSBjaGFuZ2UnLCB2aXNpYmxlLCBoaWRkZW4pO1xuICAgIH1cbiAgfVxuXG4gIEBJbnB1dCgndHlwZScpIHNldCB0eXBlKHR5cGU6IHN0cmluZykge1xuICAgIHRoaXMuX3R5cGUgPSB0eXBlO1xuICAgIHRoaXMuZHJhd0NoYXJ0KCk7XG4gIH1cblxuICBASW5wdXQoJ3N0YW5kYWxvbmUnKSBzdGFuZGFsb25lID0gdHJ1ZTtcbiAgQE91dHB1dCgnYm91bmRzRGlkQ2hhbmdlJykgYm91bmRzRGlkQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoJ3BvaW50SG92ZXInKSBwb2ludEhvdmVyID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoJ3dhcnBWaWV3Q2hhcnRSZXNpemUnKSB3YXJwVmlld0NoYXJ0UmVzaXplID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWVcbiAgcHJpdmF0ZSBfdHlwZSA9ICdsaW5lJztcbiAgcHJpdmF0ZSB2aXNpYmlsaXR5OiBib29sZWFuW10gPSBbXTtcbiAgcHJpdmF0ZSBtYXhUaWNrID0gMDtcbiAgcHJpdmF0ZSBtaW5UaWNrID0gMDtcbiAgcHJpdmF0ZSB2aXNpYmxlR3RzSWQgPSBbXTtcbiAgcHJpdmF0ZSBndHNJZCA9IFtdO1xuICBwcml2YXRlIGRhdGFIYXNoc2V0ID0ge307XG4gIHByaXZhdGUgY2hhcnRCb3VuZHM6IENoYXJ0Qm91bmRzID0gbmV3IENoYXJ0Qm91bmRzKCk7XG4gIHByaXZhdGUgdmlzaWJpbGl0eVN0YXR1czogVmlzaWJpbGl0eVN0YXRlID0gJ3Vua25vd24nO1xuICBwcml2YXRlIGFmdGVyQm91bmRzVXBkYXRlID0gZmFsc2U7XG4gIHByaXZhdGUgbWFyZ2luTGVmdDogbnVtYmVyO1xuICBwcml2YXRlIG1heFBsb3R0YWJsZSA9IDEwMDAwO1xuICBwYXJzaW5nID0gZmFsc2U7XG4gIHVuaGlnaGxpdGVDdXJ2ZSA9IG5ldyBTdWJqZWN0PG51bWJlcltdPigpO1xuICBoaWdobGl0ZUN1cnZlID0gbmV3IFN1YmplY3Q8eyBvbjogbnVtYmVyW10sIG9mZjogbnVtYmVyW10gfT4oKTtcbiAgbGF5b3V0OiBQYXJ0aWFsPGFueT4gPSB7XG4gICAgc2hvd2xlZ2VuZDogZmFsc2UsXG4gICAgYXV0b3NpemU6IHRydWUsXG4gICAgaG92ZXJtb2RlOiAneCcsXG4gICAgaG92ZXJkaXN0YW5jZTogMjAsXG4gICAgeGF4aXM6IHtcbiAgICAgIGZvbnQ6IHt9XG4gICAgfSxcbiAgICB5YXhpczoge1xuICAgICAgZXhwb25lbnRmb3JtYXQ6ICdub25lJyxcbiAgICAgIGZpeGVkcmFuZ2U6IHRydWUsXG4gICAgICBhdXRvbWFyZ2luOiB0cnVlLFxuICAgICAgc2hvd2xpbmU6IHRydWUsXG4gICAgICBmb250OiB7fVxuICAgIH0sXG4gICAgbWFyZ2luOiB7XG4gICAgICB0OiAwLFxuICAgICAgYjogMzAsXG4gICAgICByOiAxMCxcbiAgICAgIGw6IDUwXG4gICAgfSxcbiAgfTtcbiAgcHJpdmF0ZSBoaWdobGlnaHRlZDogYW55O1xuXG4gIHVwZGF0ZShvcHRpb25zLCByZWZyZXNoKTogdm9pZCB7XG4gICAgdGhpcy5kcmF3Q2hhcnQocmVmcmVzaCk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgZWw6IEVsZW1lbnRSZWYsXG4gICAgcHVibGljIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHVibGljIHNpemVTZXJ2aWNlOiBTaXplU2VydmljZSxcbiAgICBwdWJsaWMgbmdab25lOiBOZ1pvbmVcbiAgKSB7XG4gICAgc3VwZXIoZWwsIHJlbmRlcmVyLCBzaXplU2VydmljZSwgbmdab25lKTtcbiAgICB0aGlzLkxPRyA9IG5ldyBMb2dnZXIoV2FycFZpZXdDaGFydENvbXBvbmVudCwgdGhpcy5fZGVidWcpO1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5fb3B0aW9ucyA9IHRoaXMuX29wdGlvbnMgfHwgdGhpcy5kZWZPcHRpb25zO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldFRpbWVDbGlwKCk6IFByb21pc2U8Q2hhcnRCb3VuZHM+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2U8Q2hhcnRCb3VuZHM+KHJlc29sdmUgPT4ge1xuICAgICAgdGhpcy5MT0cuZGVidWcoWydnZXRUaW1lQ2xpcCddLCB0aGlzLmNoYXJ0Qm91bmRzKTtcbiAgICAgIHJlc29sdmUodGhpcy5jaGFydEJvdW5kcyk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgcmVzaXplKG5ld0hlaWdodDogbnVtYmVyKSB7XG4gICAgdGhpcy5oZWlnaHQgPSBuZXdIZWlnaHQ7XG4gICAgdGhpcy5sYXlvdXQuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG4gICAgaWYgKHRoaXMuX29wdGlvbnMuc2hvd1JhbmdlU2VsZWN0b3IpIHtcbiAgICAgIHRoaXMubGF5b3V0LnhheGlzLnJhbmdlc2xpZGVyID0ge1xuICAgICAgICBiZ2NvbG9yOiAndHJhbnNwYXJlbnQnLFxuICAgICAgICB0aGlja25lc3M6IDQwIC8gdGhpcy5oZWlnaHRcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgZHJhd0NoYXJ0KHJlcGFyc2VOZXdEYXRhOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RyYXdDaGFydCcsICd0aGlzLmxheW91dCcsICd0aGlzLm9wdGlvbnMnXSwgdGhpcy5sYXlvdXQsIHRoaXMuX29wdGlvbnMpO1xuICAgIGlmICghdGhpcy5pbml0Q2hhcnQodGhpcy5lbCkpIHtcbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsnZHJhd0NoYXJ0JywgJ2luaXRDaGFydCddLCB0aGlzLl9vcHRpb25zKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5wbG90bHlDb25maWcuc2Nyb2xsWm9vbSA9IHRydWU7XG4gICAgaWYgKCEhdGhpcy5fb3B0aW9ucy50aW1lTW9kZSAmJiB0aGlzLl9vcHRpb25zLnRpbWVNb2RlID09PSAndGltZXN0YW1wJykge1xuICAgICAgdGhpcy5sYXlvdXQueGF4aXMudHlwZSA9ICdsaW5lYXInO1xuICAgICAgdGhpcy5sYXlvdXQueGF4aXMudGljazAgPSB0aGlzLm1pblRpY2sgLyB0aGlzLmRpdmlkZXI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubGF5b3V0LnhheGlzLnR5cGUgPSAnZGF0ZSc7XG4gICAgICB0aGlzLmxheW91dC54YXhpcy50aWNrMCA9IG1vbWVudC50eih0aGlzLm1pblRpY2sgLyB0aGlzLmRpdmlkZXIsIHRoaXMuX29wdGlvbnMudGltZVpvbmUpLnRvSVNPU3RyaW5nKHRydWUpO1xuICAgIH1cbiAgICB0aGlzLmxheW91dC55YXhpcy5ncmlkY29sb3IgPSB0aGlzLmdldEdyaWRDb2xvcih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgIHRoaXMubGF5b3V0LnhheGlzLmdyaWRjb2xvciA9IHRoaXMuZ2V0R3JpZENvbG9yKHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XG4gICAgdGhpcy5sYXlvdXQueWF4aXMuemVyb2xpbmVjb2xvciA9IHRoaXMuZ2V0R3JpZENvbG9yKHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XG4gICAgdGhpcy5sYXlvdXQueGF4aXMuemVyb2xpbmVjb2xvciA9IHRoaXMuZ2V0R3JpZENvbG9yKHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XG4gICAgdGhpcy5sYXlvdXQubWFyZ2luLnQgPSB0aGlzLnN0YW5kYWxvbmUgPyAyMCA6IDEwO1xuICAgIHRoaXMubGF5b3V0LnNob3dsZWdlbmQgPSB0aGlzLl9zaG93TGVnZW5kO1xuICAgIGlmICghdGhpcy5fcmVzcG9uc2l2ZSkge1xuICAgICAgdGhpcy5sYXlvdXQud2lkdGggPSB0aGlzLndpZHRoO1xuICAgICAgdGhpcy5sYXlvdXQuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG4gICAgfVxuICAgIHRoaXMuTE9HLmRlYnVnKFsnZHJhd0NoYXJ0JywgJ3RoaXMub3B0aW9ucyddLCB0aGlzLmxheW91dCwgdGhpcy5fb3B0aW9ucyk7XG4gICAgdGhpcy5MT0cuZGVidWcoWydkcmF3Q2hhcnQnLCAndGhpcy5sYXlvdXQnXSwgdGhpcy5sYXlvdXQpO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZHJhd0NoYXJ0JywgJ3RoaXMucGxvdGx5Q29uZmlnJ10sIHRoaXMucGxvdGx5Q29uZmlnKTtcbiAgICBpZiAodGhpcy5fb3B0aW9ucy5zaG93UmFuZ2VTZWxlY3Rvcikge1xuICAgICAgdGhpcy5sYXlvdXQueGF4aXMucmFuZ2VzbGlkZXIgPSB7XG4gICAgICAgIGJnY29sb3I6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgIHRoaWNrbmVzczogNDAgLyB0aGlzLmhlaWdodFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sYXlvdXQubWFyZ2luLmIgPSAzMDtcbiAgICB9XG4gICAgY29uc3QgeDogYW55ID0ge1xuICAgICAgdGljazA6IHVuZGVmaW5lZCxcbiAgICAgIHJhbmdlOiBbXSxcbiAgICB9O1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZHJhd0NoYXJ0JywgJ3VwZGF0ZUJvdW5kcyddLCB0aGlzLmNoYXJ0Qm91bmRzKTtcbiAgICBjb25zdCBtaW4gPSB0aGlzLmNoYXJ0Qm91bmRzLnRzbWluIHx8IHRoaXMubWluVGljaztcbiAgICBjb25zdCBtYXggPSB0aGlzLmNoYXJ0Qm91bmRzLnRzbWF4IHx8IHRoaXMubWF4VGljaztcbiAgICBpZiAodGhpcy5fb3B0aW9ucy50aW1lTW9kZSAmJiB0aGlzLl9vcHRpb25zLnRpbWVNb2RlID09PSAndGltZXN0YW1wJykge1xuICAgICAgeC50aWNrMCA9IG1pbiAvIHRoaXMuZGl2aWRlcjtcbiAgICAgIHgucmFuZ2UgPSBbbWluLCBtYXhdO1xuICAgIH0gZWxzZSB7XG4gICAgICB4LnRpY2swID0gbW9tZW50LnR6KG1pbiAvIHRoaXMuZGl2aWRlciwgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSkudG9JU09TdHJpbmcodHJ1ZSk7XG4gICAgICB4LnJhbmdlID0gW1xuICAgICAgICBtb21lbnQudHoobWluIC8gdGhpcy5kaXZpZGVyLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKS50b0lTT1N0cmluZyh0cnVlKSxcbiAgICAgICAgbW9tZW50LnR6KG1heCAvIHRoaXMuZGl2aWRlciwgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSkudG9JU09TdHJpbmcodHJ1ZSlcbiAgICAgIF07XG4gICAgfVxuICAgIHRoaXMubGF5b3V0LnhheGlzID0geDtcbiAgICB0aGlzLmxheW91dCA9IHsuLi50aGlzLmxheW91dH07XG4gICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgdGhpcy5oaWdobGl0ZUN1cnZlLnBpcGUoZGVib3VuY2VUaW1lKDIwMCkpLnN1YnNjcmliZSh2YWx1ZSA9PiB7XG4gICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgdGhpcy5ncmFwaC5yZXN0eWxlQ2hhcnQoe29wYWNpdHk6IDAuNH0sIHZhbHVlLm9mZik7XG4gICAgICAgIHRoaXMuZ3JhcGgucmVzdHlsZUNoYXJ0KHtvcGFjaXR5OiAxfSwgdmFsdWUub24pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgdGhpcy51bmhpZ2hsaXRlQ3VydmUucGlwZShkZWJvdW5jZVRpbWUoMjAwKSkuc3Vic2NyaWJlKHZhbHVlID0+IHtcbiAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICB0aGlzLmdyYXBoLnJlc3R5bGVDaGFydCh7b3BhY2l0eTogMX0sIHZhbHVlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBlbWl0TmV3Qm91bmRzKG1pbiwgbWF4LCBtYXJnaW5MZWZ0KSB7XG4gICAgaWYgKHRoaXMuX29wdGlvbnMudGltZU1vZGUgJiYgdGhpcy5fb3B0aW9ucy50aW1lTW9kZSA9PT0gJ3RpbWVzdGFtcCcpIHtcbiAgICAgIHRoaXMuYm91bmRzRGlkQ2hhbmdlLmVtaXQoe2JvdW5kczoge21pbiwgbWF4LCBtYXJnaW5MZWZ0fSwgc291cmNlOiAnY2hhcnQnfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYm91bmRzRGlkQ2hhbmdlLmVtaXQoe1xuICAgICAgICBib3VuZHM6IHtcbiAgICAgICAgICBtaW46IG1vbWVudC50eihtaW4sIHRoaXMuX29wdGlvbnMudGltZVpvbmUpLnZhbHVlT2YoKSxcbiAgICAgICAgICBtYXg6IG1vbWVudC50eihtYXgsIHRoaXMuX29wdGlvbnMudGltZVpvbmUpLnZhbHVlT2YoKSxcbiAgICAgICAgICBtYXJnaW5MZWZ0XG4gICAgICAgIH0sIHNvdXJjZTogJ2NoYXJ0J1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIGNvbnZlcnQoZGF0YTogRGF0YU1vZGVsKTogUGFydGlhbDxhbnk+W10ge1xuICAgIHRoaXMucGFyc2luZyA9IHRydWU7XG4gICAgY29uc3QgZGF0YXNldDogUGFydGlhbDxhbnk+W10gPSBbXTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2NvbnZlcnQnXSwgdGhpcy5fb3B0aW9ucy50aW1lTW9kZSk7XG4gICAgdGhpcy5MT0cuZGVidWcoWydjb252ZXJ0JywgJ3RoaXMuX2hpZGRlbkRhdGEnXSwgdGhpcy5faGlkZGVuRGF0YSk7XG4gICAgaWYgKEdUU0xpYi5pc0FycmF5KGRhdGEuZGF0YSkpIHtcbiAgICAgIGxldCBndHNMaXN0ID0gR1RTTGliLmZsYXREZWVwKEdUU0xpYi5mbGF0dGVuR3RzSWRBcnJheShkYXRhLmRhdGEgYXMgYW55W10sIDApLnJlcyk7XG4gICAgICB0aGlzLm1heFRpY2sgPSBOdW1iZXIuTkVHQVRJVkVfSU5GSU5JVFk7XG4gICAgICB0aGlzLm1pblRpY2sgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFk7XG4gICAgICB0aGlzLnZpc2libGVHdHNJZCA9IFtdO1xuICAgICAgdGhpcy5ndHNJZCA9IFtdO1xuICAgICAgY29uc3Qgbm9uUGxvdHRhYmxlID0gZ3RzTGlzdC5maWx0ZXIoZyA9PiB7XG4gICAgICAgIHRoaXMuTE9HLmRlYnVnKFsnY29udmVydCddLCBHVFNMaWIuaXNHdHNUb1Bsb3QoZykpO1xuICAgICAgICByZXR1cm4gKGcudiAmJiAhR1RTTGliLmlzR3RzVG9QbG90KGcpKTtcbiAgICAgIH0pO1xuICAgICAgZ3RzTGlzdCA9IGd0c0xpc3QuZmlsdGVyKGcgPT4ge1xuICAgICAgICByZXR1cm4gKGcudiAmJiBHVFNMaWIuaXNHdHNUb1Bsb3QoZykpO1xuICAgICAgfSk7XG4gICAgICAvLyBpbml0aWFsaXplIHZpc2liaWxpdHkgc3RhdHVzXG4gICAgICBpZiAodGhpcy52aXNpYmlsaXR5U3RhdHVzID09PSAndW5rbm93bicpIHtcbiAgICAgICAgdGhpcy52aXNpYmlsaXR5U3RhdHVzID0gZ3RzTGlzdC5sZW5ndGggPiAwID8gJ3Bsb3R0YWJsZVNob3duJyA6ICdub3RoaW5nUGxvdHRhYmxlJztcbiAgICAgIH1cblxuICAgICAgdGhpcy5MT0cuZGVidWcoWydjb252ZXJ0J10sIHRoaXMuX29wdGlvbnMudGltZU1vZGUpO1xuICAgICAgbGV0IHRpbWVzdGFtcE1vZGUgPSB0cnVlO1xuICAgICAgY29uc3QgdHNMaW1pdCA9IDEwMCAqIEdUU0xpYi5nZXREaXZpZGVyKHRoaXMuX29wdGlvbnMudGltZVVuaXQpO1xuICAgICAgdGhpcy5MT0cuZGVidWcoWydjb252ZXJ0J10sICdmb3JFYWNoIEdUUycpO1xuICAgICAgZ3RzTGlzdC5mb3JFYWNoKChndHM6IEdUUykgPT4ge1xuICAgICAgICBjb25zdCB0aWNrcyA9IGd0cy52Lm1hcCh0ID0+IHRbMF0pO1xuICAgICAgICBjb25zdCBzaXplID0gZ3RzLnYubGVuZ3RoO1xuICAgICAgICB0aW1lc3RhbXBNb2RlID0gdGltZXN0YW1wTW9kZSAmJiAodGlja3NbMF0gPiAtdHNMaW1pdCAmJiB0aWNrc1swXSA8IHRzTGltaXQpO1xuICAgICAgICB0aW1lc3RhbXBNb2RlID0gdGltZXN0YW1wTW9kZSAmJiAodGlja3Nbc2l6ZSAtIDFdID4gLXRzTGltaXQgJiYgdGlja3Nbc2l6ZSAtIDFdIDwgdHNMaW1pdCk7XG4gICAgICB9KTtcbiAgICAgIGlmICh0aW1lc3RhbXBNb2RlIHx8IHRoaXMuX29wdGlvbnMudGltZU1vZGUgPT09ICd0aW1lc3RhbXAnKSB7XG4gICAgICAgIHRoaXMubGF5b3V0LnhheGlzLnR5cGUgPSAnbGluZWFyJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubGF5b3V0LnhheGlzLnR5cGUgPSAnZGF0ZSc7XG4gICAgICB9XG4gICAgICBndHNMaXN0LmZvckVhY2goKGd0czogR1RTLCBpKSA9PiB7XG4gICAgICAgIGlmIChndHMudiAmJiBHVFNMaWIuaXNHdHNUb1Bsb3QoZ3RzKSkge1xuICAgICAgICAgIFRpbXNvcnQuc29ydChndHMudiwgKGEsIGIpID0+IGFbMF0gLSBiWzBdKTtcbiAgICAgICAgICBjb25zdCBzaXplID0gZ3RzLnYubGVuZ3RoO1xuICAgICAgICAgIHRoaXMuTE9HLmRlYnVnKFsnY29udmVydCddLCBndHMpO1xuICAgICAgICAgIGNvbnN0IGxhYmVsID0gR1RTTGliLnNlcmlhbGl6ZUd0c01ldGFkYXRhKGd0cyk7XG4gICAgICAgICAgY29uc3QgYyA9IENvbG9yTGliLmdldENvbG9yKGd0cy5pZCwgdGhpcy5fb3B0aW9ucy5zY2hlbWUpO1xuICAgICAgICAgIGNvbnN0IGNvbG9yID0gKChkYXRhLnBhcmFtcyB8fCBbXSlbaV0gfHwge2RhdGFzZXRDb2xvcjogY30pLmRhdGFzZXRDb2xvciB8fCBjO1xuICAgICAgICAgIGNvbnN0IHNlcmllczogUGFydGlhbDxhbnk+ID0ge1xuICAgICAgICAgICAgdHlwZTogdGhpcy5fdHlwZSA9PT0gJ3NwbGluZScgPyAnc2NhdHRlcicgOiAnc2NhdHRlcmdsJyxcbiAgICAgICAgICAgIG1vZGU6IHRoaXMuX3R5cGUgPT09ICdzY2F0dGVyJyA/ICdtYXJrZXJzJyA6IHNpemUgPiB0aGlzLm1heFBsb3R0YWJsZSA/ICdsaW5lcycgOiAnbGluZXMrbWFya2VycycsXG4gICAgICAgICAgICAvLyBuYW1lOiBsYWJlbCxcbiAgICAgICAgICAgIHRleHQ6IGxhYmVsLFxuICAgICAgICAgICAgeDogW10sXG4gICAgICAgICAgICB5OiBbXSxcbiAgICAgICAgICAgIGxpbmU6IHtjb2xvcn0sXG4gICAgICAgICAgICBob3ZlcmluZm86ICdub25lJyxcbiAgICAgICAgICAgIGNvbm5lY3RnYXBzOiBmYWxzZSxcbiAgICAgICAgICAgIHZpc2libGU6ICEodGhpcy5faGlkZGVuRGF0YS5maWx0ZXIoaCA9PiBoID09PSBndHMuaWQpLmxlbmd0aCA+IDApLFxuICAgICAgICAgIH07XG4gICAgICAgICAgaWYgKHRoaXMuX3R5cGUgPT09ICdzY2F0dGVyJyB8fCBzaXplIDwgdGhpcy5tYXhQbG90dGFibGUpIHtcbiAgICAgICAgICAgIHNlcmllcy5tYXJrZXIgPSB7XG4gICAgICAgICAgICAgIHNpemU6IDE1LFxuICAgICAgICAgICAgICBjb2xvcjogbmV3IEFycmF5KHNpemUpLmZpbGwoY29sb3IpLFxuICAgICAgICAgICAgICBsaW5lOiB7Y29sb3IsIHdpZHRoOiAzfSxcbiAgICAgICAgICAgICAgb3BhY2l0eTogbmV3IEFycmF5KHNpemUpLmZpbGwodGhpcy5fdHlwZSA9PT0gJ3NjYXR0ZXInIHx8IHRoaXMuX29wdGlvbnMuc2hvd0RvdHMgPyAxIDogMClcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICAgIHN3aXRjaCAodGhpcy5fdHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnc3BsaW5lJzpcbiAgICAgICAgICAgICAgc2VyaWVzLmxpbmUuc2hhcGUgPSAnc3BsaW5lJztcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdhcmVhJzpcbiAgICAgICAgICAgICAgc2VyaWVzLmZpbGwgPSAndG96ZXJveSc7XG4gICAgICAgICAgICAgIHNlcmllcy5maWxsY29sb3IgPSBDb2xvckxpYi50cmFuc3BhcmVudGl6ZShjb2xvciwgMC4zKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdzdGVwJzpcbiAgICAgICAgICAgICAgc2VyaWVzLmxpbmUuc2hhcGUgPSAnaHZoJztcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdzdGVwLWJlZm9yZSc6XG4gICAgICAgICAgICAgIHNlcmllcy5saW5lLnNoYXBlID0gJ3ZoJztcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdzdGVwLWFmdGVyJzpcbiAgICAgICAgICAgICAgc2VyaWVzLmxpbmUuc2hhcGUgPSAnaHYnO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy52aXNpYmxlR3RzSWQucHVzaChndHMuaWQpO1xuICAgICAgICAgIHRoaXMuZ3RzSWQucHVzaChndHMuaWQpO1xuICAgICAgICAgIHRoaXMuTE9HLmRlYnVnKFsnY29udmVydCddLCAnZm9yRWFjaCB2YWx1ZScpO1xuICAgICAgICAgIGNvbnN0IHRpY2tzID0gZ3RzLnYubWFwKHQgPT4gdFswXSk7XG4gICAgICAgICAgY29uc3QgdmFsdWVzID0gZ3RzLnYubWFwKHQgPT4gdFt0Lmxlbmd0aCAtIDFdKTtcblxuICAgICAgICAgIGlmIChzaXplID4gMCkge1xuICAgICAgICAgICAgdGhpcy5taW5UaWNrID0gdGhpcy5taW5UaWNrIHx8IHRpY2tzWzBdO1xuICAgICAgICAgICAgdGhpcy5tYXhUaWNrID0gdGhpcy5tYXhUaWNrIHx8IHRpY2tzWzBdO1xuICAgICAgICAgICAgZm9yIChsZXQgdiA9IDE7IHYgPCBzaXplOyB2KyspIHtcbiAgICAgICAgICAgICAgY29uc3QgdmFsID0gdGlja3Nbdl07XG4gICAgICAgICAgICAgIHRoaXMubWluVGljayA9IHZhbCA8PSB0aGlzLm1pblRpY2sgPyB2YWwgOiB0aGlzLm1pblRpY2s7XG4gICAgICAgICAgICAgIHRoaXMubWF4VGljayA9IHZhbCA+PSB0aGlzLm1heFRpY2sgPyB2YWwgOiB0aGlzLm1heFRpY2s7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0aW1lc3RhbXBNb2RlIHx8IHRoaXMuX29wdGlvbnMudGltZU1vZGUgPT09ICd0aW1lc3RhbXAnKSB7XG4gICAgICAgICAgICBzZXJpZXMueCA9IHRpY2tzO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fb3B0aW9ucy50aW1lWm9uZSAhPT0gJ1VUQycpIHtcbiAgICAgICAgICAgICAgc2VyaWVzLnggPSB0aWNrcy5tYXAodCA9PiBtb21lbnQudXRjKHQgLyB0aGlzLmRpdmlkZXIpLnR6KHRoaXMuX29wdGlvbnMudGltZVpvbmUpLnRvSVNPU3RyaW5nKCkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc2VyaWVzLnggPSB0aWNrcy5tYXAodCA9PiBtb21lbnQudXRjKHQgLyB0aGlzLmRpdmlkZXIpLnRvSVNPU3RyaW5nKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBzZXJpZXMueSA9IHZhbHVlcztcbiAgICAgICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2NvbnZlcnQnXSwgJ2ZvckVhY2ggdmFsdWUgZW5kJywgdGhpcy5taW5UaWNrLCB0aGlzLm1heFRpY2spO1xuICAgICAgICAgIGRhdGFzZXQucHVzaChzZXJpZXMpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGlmIChub25QbG90dGFibGUubGVuZ3RoID4gMCAmJiBndHNMaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBub25QbG90dGFibGUuZm9yRWFjaChnID0+IHtcbiAgICAgICAgICBnLnYuZm9yRWFjaCh2YWx1ZSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0cyA9IHZhbHVlWzBdO1xuICAgICAgICAgICAgaWYgKHRzIDwgdGhpcy5taW5UaWNrKSB7XG4gICAgICAgICAgICAgIHRoaXMubWluVGljayA9IHRzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRzID4gdGhpcy5tYXhUaWNrKSB7XG4gICAgICAgICAgICAgIHRoaXMubWF4VGljayA9IHRzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gaWYgdGhlcmUgaXMgbm90IGFueSBwbG90dGFibGUgZGF0YSwgd2UgbXVzdCBhZGQgYSBmYWtlIG9uZSB3aXRoIGlkIC0xLiBUaGlzIG9uZSB3aWxsIGFsd2F5cyBiZSBoaWRkZW4uXG4gICAgICAgIGlmICgwID09PSBndHNMaXN0Lmxlbmd0aCkge1xuICAgICAgICAgIGlmICghdGhpcy5kYXRhSGFzaHNldFt0aGlzLm1pblRpY2tdKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGFIYXNoc2V0W3RoaXMubWluVGlja10gPSBbMF07XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghdGhpcy5kYXRhSGFzaHNldFt0aGlzLm1heFRpY2tdKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGFIYXNoc2V0W3RoaXMubWF4VGlja10gPSBbMF07XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMudmlzaWJpbGl0eS5wdXNoKGZhbHNlKTtcbiAgICAgICAgICB0aGlzLnZpc2libGVHdHNJZC5wdXNoKC0xKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnBhcnNpbmcgPSBmYWxzZTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2NvbnZlcnQnXSwgJ2VuZCcsIGRhdGFzZXQpO1xuICAgIHRoaXMubm9EYXRhID0gZGF0YXNldC5sZW5ndGggPT09IDA7XG4gICAgcmV0dXJuIGRhdGFzZXQ7XG4gIH1cblxuICBhZnRlclBsb3QocGxvdGx5SW5zdGFuY2UpIHtcbiAgICBzdXBlci5hZnRlclBsb3QocGxvdGx5SW5zdGFuY2UpO1xuICAgIHRoaXMubWFyZ2luTGVmdCA9IHBhcnNlSW50KCh0aGlzLmdyYXBoLnBsb3RFbC5uYXRpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50KS5xdWVyeVNlbGVjdG9yKCdnLmJnbGF5ZXIgPiByZWN0JykuZ2V0QXR0cmlidXRlKCd4JyksIDEwKTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3Bsb3RseV9hZnRlclBsb3QnXSk7XG4gICAgaWYgKHRoaXMuY2hhcnRCb3VuZHMudHNtaW4gIT09IHRoaXMubWluVGljayB8fCB0aGlzLmNoYXJ0Qm91bmRzLnRzbWF4ICE9PSB0aGlzLm1heFRpY2spIHtcbiAgICAgIHRoaXMuY2hhcnRCb3VuZHMudHNtaW4gPSB0aGlzLm1pblRpY2s7XG4gICAgICB0aGlzLmNoYXJ0Qm91bmRzLnRzbWF4ID0gdGhpcy5tYXhUaWNrO1xuICAgICAgdGhpcy5jaGFydEJvdW5kcy5tYXJnaW5MZWZ0ID0gdGhpcy5tYXJnaW5MZWZ0O1xuICAgICAgdGhpcy5jaGFydERyYXcuZW1pdCh0aGlzLmNoYXJ0Qm91bmRzKTtcbiAgICAgIGlmICh0aGlzLmFmdGVyQm91bmRzVXBkYXRlIHx8IHRoaXMuc3RhbmRhbG9uZSkge1xuICAgICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2FmdGVyUGxvdCcsICd1cGRhdGVCb3VuZHMnXSwgdGhpcy5taW5UaWNrLCB0aGlzLm1heFRpY2spO1xuICAgICAgICB0aGlzLmVtaXROZXdCb3VuZHModGhpcy5taW5UaWNrLCB0aGlzLm1heFRpY2ssIHRoaXMubWFyZ2luTGVmdCk7XG4gICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmFmdGVyQm91bmRzVXBkYXRlID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHJlbGF5b3V0KGRhdGE6IGFueSkge1xuICAgIGlmIChkYXRhWyd4YXhpcy5yYW5nZSddICYmIGRhdGFbJ3hheGlzLnJhbmdlJ10ubGVuZ3RoID09PSAyKSB7XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3JlbGF5b3V0JywgJ3VwZGF0ZUJvdW5kcycsICd4YXhpcy5yYW5nZSddLCBkYXRhWyd4YXhpcy5yYW5nZSddKTtcbiAgICAgIHRoaXMuY2hhcnRCb3VuZHMubXNtaW4gPSBkYXRhWyd4YXhpcy5yYW5nZSddWzBdO1xuICAgICAgdGhpcy5jaGFydEJvdW5kcy5tc21heCA9IGRhdGFbJ3hheGlzLnJhbmdlJ11bMV07XG4gICAgICB0aGlzLmNoYXJ0Qm91bmRzLnRzbWluID0gbW9tZW50LnR6KG1vbWVudCh0aGlzLmNoYXJ0Qm91bmRzLm1zbWluKSwgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSkudmFsdWVPZigpICogdGhpcy5kaXZpZGVyO1xuICAgICAgdGhpcy5jaGFydEJvdW5kcy50c21heCA9IG1vbWVudC50eihtb21lbnQodGhpcy5jaGFydEJvdW5kcy5tc21heCksIHRoaXMuX29wdGlvbnMudGltZVpvbmUpLnZhbHVlT2YoKSAqIHRoaXMuZGl2aWRlcjtcbiAgICB9IGVsc2UgaWYgKGRhdGFbJ3hheGlzLnJhbmdlWzBdJ10gJiYgZGF0YVsneGF4aXMucmFuZ2VbMV0nXSkge1xuICAgICAgdGhpcy5MT0cuZGVidWcoWydyZWxheW91dCcsICd1cGRhdGVCb3VuZHMnLCAneGF4aXMucmFuZ2VbeF0nXSwgZGF0YVsneGF4aXMucmFuZ2VbMF0nXSk7XG4gICAgICB0aGlzLmNoYXJ0Qm91bmRzLm1zbWluID0gZGF0YVsneGF4aXMucmFuZ2VbMF0nXTtcbiAgICAgIHRoaXMuY2hhcnRCb3VuZHMubXNtYXggPSBkYXRhWyd4YXhpcy5yYW5nZVsxXSddO1xuICAgICAgdGhpcy5jaGFydEJvdW5kcy50c21pbiA9IG1vbWVudC50eihtb21lbnQodGhpcy5jaGFydEJvdW5kcy5tc21pbiksIHRoaXMuX29wdGlvbnMudGltZVpvbmUpLnZhbHVlT2YoKSAqIHRoaXMuZGl2aWRlcjtcbiAgICAgIHRoaXMuY2hhcnRCb3VuZHMudHNtYXggPSBtb21lbnQudHoobW9tZW50KHRoaXMuY2hhcnRCb3VuZHMubXNtYXgpLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKS52YWx1ZU9mKCkgKiB0aGlzLmRpdmlkZXI7XG4gICAgfSBlbHNlIGlmIChkYXRhWyd4YXhpcy5hdXRvcmFuZ2UnXSkge1xuICAgICAgdGhpcy5MT0cuZGVidWcoWydyZWxheW91dCcsICd1cGRhdGVCb3VuZHMnLCAnYXV0b3JhbmdlJ10sIGRhdGEsIHRoaXMubWluVGljaywgdGhpcy5tYXhUaWNrKTtcbiAgICAgIHRoaXMuY2hhcnRCb3VuZHMudHNtaW4gPSB0aGlzLm1pblRpY2s7XG4gICAgICB0aGlzLmNoYXJ0Qm91bmRzLnRzbWF4ID0gdGhpcy5tYXhUaWNrO1xuICAgIH1cbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3JlbGF5b3V0JywgJ3VwZGF0ZUJvdW5kcyddLCB0aGlzLmNoYXJ0Qm91bmRzKTtcbiAgICB0aGlzLmVtaXROZXdCb3VuZHModGhpcy5jaGFydEJvdW5kcy50c21pbiwgdGhpcy5jaGFydEJvdW5kcy50c21heCwgdGhpcy5tYXJnaW5MZWZ0KTtcbiAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLmFmdGVyQm91bmRzVXBkYXRlID0gZmFsc2U7XG5cbiAgfVxuXG4gIHNsaWRlckNoYW5nZSgkZXZlbnQ6IGFueSkge1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnc2xpZGVyQ2hhbmdlJ10sICRldmVudCk7XG4gICAgY29uc29sZS5sb2coJGV2ZW50KTtcbiAgfVxuXG4gIHVwZGF0ZUJvdW5kcyhtaW4sIG1heCkge1xuICAgIHRoaXMuTE9HLmRlYnVnKFsndXBkYXRlQm91bmRzJ10sIG1pbiwgbWF4LCB0aGlzLl9vcHRpb25zKTtcbiAgICBtaW4gPSBtaW4gfHwgdGhpcy5taW5UaWNrIC8gdGhpcy5kaXZpZGVyO1xuICAgIG1heCA9IG1heCB8fCB0aGlzLm1heFRpY2sgLyB0aGlzLmRpdmlkZXI7XG4gICAgdGhpcy5sYXlvdXQueGF4aXMuYXV0b3JhbmdlID0gZmFsc2U7XG4gICAgdGhpcy5MT0cuZGVidWcoWyd1cGRhdGVCb3VuZHMnXSxcbiAgICAgIG1vbWVudC50eihtaW4sIHRoaXMuX29wdGlvbnMudGltZVpvbmUpLnRvSVNPU3RyaW5nKCksXG4gICAgICBtb21lbnQudHoobWF4LCB0aGlzLl9vcHRpb25zLnRpbWVab25lKS50b0lTT1N0cmluZygpKTtcbiAgICBpZiAodGhpcy5fb3B0aW9ucy50aW1lTW9kZSAmJiB0aGlzLl9vcHRpb25zLnRpbWVNb2RlID09PSAndGltZXN0YW1wJykge1xuICAgICAgdGhpcy5sYXlvdXQueGF4aXMucmFuZ2UgPSBbbWluLCBtYXhdO1xuICAgICAgdGhpcy5sYXlvdXQueGF4aXMudGljazAgPSBtaW47XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubGF5b3V0LnhheGlzLnJhbmdlID0gW1xuICAgICAgICBtb21lbnQudHoobWluLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKS50b0lTT1N0cmluZygpLFxuICAgICAgICBtb21lbnQudHoobWF4LCB0aGlzLl9vcHRpb25zLnRpbWVab25lKS50b0lTT1N0cmluZygpXG4gICAgICBdO1xuICAgICAgdGhpcy5sYXlvdXQueGF4aXMudGljazAgPSBtb21lbnQudHoobWluLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKS50b0lTT1N0cmluZygpO1xuICAgIH1cbiAgICB0aGlzLmxheW91dCA9IHsuLi50aGlzLmxheW91dH07XG4gICAgdGhpcy5MT0cuZGVidWcoWyd1cGRhdGVCb3VuZHMnXSwgdGhpcy5sYXlvdXQpO1xuICAgIHRoaXMuYWZ0ZXJCb3VuZHNVcGRhdGUgPSB0cnVlO1xuICB9XG5cblxuICBzZXRSZWFsQm91bmRzKGNoYXJ0Qm91bmRzOiBDaGFydEJvdW5kcykge1xuICAgIHRoaXMuYWZ0ZXJCb3VuZHNVcGRhdGUgPSB0cnVlO1xuICAgIHRoaXMubWluVGljayA9IGNoYXJ0Qm91bmRzLnRzbWluO1xuICAgIHRoaXMubWF4VGljayA9IGNoYXJ0Qm91bmRzLnRzbWF4O1xuICAgIHRoaXMuX29wdGlvbnMuYm91bmRzID0gdGhpcy5fb3B0aW9ucy5ib3VuZHMgfHwge307XG4gICAgdGhpcy5fb3B0aW9ucy5ib3VuZHMubWluRGF0ZSA9IHRoaXMubWluVGljaztcbiAgICB0aGlzLl9vcHRpb25zLmJvdW5kcy5tYXhEYXRlID0gdGhpcy5tYXhUaWNrO1xuICAgIGNvbnN0IHg6IGFueSA9IHtcbiAgICAgIHRpY2swOiB1bmRlZmluZWQsXG4gICAgICByYW5nZTogW10sXG4gICAgfTtcbiAgICBpZiAodGhpcy5fb3B0aW9ucy5zaG93UmFuZ2VTZWxlY3Rvcikge1xuICAgICAgeC5yYW5nZXNsaWRlciA9IHtcbiAgICAgICAgYmdjb2xvcjogJ3RyYW5zcGFyZW50JyxcbiAgICAgICAgdGhpY2tuZXNzOiA0MCAvIHRoaXMuaGVpZ2h0XG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAodGhpcy5fb3B0aW9ucy50aW1lTW9kZSAmJiB0aGlzLl9vcHRpb25zLnRpbWVNb2RlID09PSAndGltZXN0YW1wJykge1xuICAgICAgeC50aWNrMCA9IHRoaXMubWluVGljayAvIHRoaXMuZGl2aWRlcjtcbiAgICAgIHgucmFuZ2UgPSBbdGhpcy5taW5UaWNrLCB0aGlzLm1heFRpY2tdO1xuICAgIH0gZWxzZSB7XG4gICAgICB4LnRpY2swID0gbW9tZW50LnR6KHRoaXMubWluVGljayAvIHRoaXMuZGl2aWRlciwgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSkudG9JU09TdHJpbmcodHJ1ZSk7XG4gICAgICB4LnJhbmdlID0gW1xuICAgICAgICBtb21lbnQudHoodGhpcy5taW5UaWNrIC8gdGhpcy5kaXZpZGVyLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKS50b0lTT1N0cmluZyh0cnVlKSxcbiAgICAgICAgbW9tZW50LnR6KHRoaXMubWF4VGljayAvIHRoaXMuZGl2aWRlciwgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSkudG9JU09TdHJpbmcodHJ1ZSlcbiAgICAgIF07XG4gICAgfVxuICAgIHRoaXMubGF5b3V0LnhheGlzID0geDtcbiAgICB0aGlzLmxheW91dCA9IHsuLi50aGlzLmxheW91dH07XG4gIH1cblxuICBob3ZlcihkYXRhOiBhbnkpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2hvdmVyJ10sIGRhdGEpO1xuICAgIGxldCBkZWx0YSA9IE51bWJlci5NQVhfVkFMVUU7XG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLXNoYWRvd2VkLXZhcmlhYmxlXG4gICAgbGV0IHBvaW50O1xuICAgIGNvbnN0IGN1cnZlcyA9IFtdO1xuICAgIHRoaXMudG9vbFRpcC5uYXRpdmVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIGlmIChkYXRhLnBvaW50c1swXSAmJiBkYXRhLnBvaW50c1swXS5kYXRhLm9yaWVudGF0aW9uICE9PSAnaCcpIHtcbiAgICAgIGNvbnN0IHkgPSAoZGF0YS55dmFscyB8fCBbJyddKVswXTtcbiAgICAgIGRhdGEucG9pbnRzLmZvckVhY2gocCA9PiB7XG4gICAgICAgIGN1cnZlcy5wdXNoKHAuY3VydmVOdW1iZXIpO1xuICAgICAgICBjb25zdCBkID0gTWF0aC5hYnMocC55IC0geSk7XG4gICAgICAgIGlmIChkIDwgZGVsdGEpIHtcbiAgICAgICAgICBkZWx0YSA9IGQ7XG4gICAgICAgICAgcG9pbnQgPSBwO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgeDogbnVtYmVyID0gKGRhdGEueHZhbHMgfHwgWycnXSlbMF07XG4gICAgICBkYXRhLnBvaW50cy5mb3JFYWNoKHAgPT4ge1xuICAgICAgICBjdXJ2ZXMucHVzaChwLmN1cnZlTnVtYmVyKTtcbiAgICAgICAgY29uc3QgZCA9IE1hdGguYWJzKHAueCAtIHgpO1xuICAgICAgICBpZiAoZCA8IGRlbHRhKSB7XG4gICAgICAgICAgZGVsdGEgPSBkO1xuICAgICAgICAgIHBvaW50ID0gcDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChwb2ludCAmJiB0aGlzLmhpZ2hsaWdodGVkICE9PSBwb2ludC5jdXJ2ZU51bWJlcikge1xuICAgICAgdGhpcy5oaWdobGl0ZUN1cnZlLm5leHQoe29uOiBbcG9pbnQuY3VydmVOdW1iZXJdLCBvZmY6IGN1cnZlc30pO1xuICAgICAgdGhpcy5oaWdobGlnaHRlZCA9IHBvaW50LmN1cnZlTnVtYmVyO1xuICAgIH1cbiAgICBzdXBlci5ob3ZlcihkYXRhLCBwb2ludCk7XG4gICAgdGhpcy5wb2ludEhvdmVyLmVtaXQoZGF0YS5ldmVudCk7XG4gICAgLypzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGxldCBwbiA9IC0xO1xuICAgICAgbGV0IHRuID0gLTE7XG4gICAgICBsZXQgY29sb3IgPSBbXTtcbiAgICAgIGxldCBsaW5lID0ge307XG4gICAgICBsZXQgb3BhY2l0eSA9IFtdO1xuICAgICAgZGF0YS5wb2ludHMuZm9yRWFjaChwID0+IHtcbiAgICAgICAgaWYgKCEhcC5kYXRhLm1hcmtlcikge1xuICAgICAgICAgIGNvbG9yID0gcC5kYXRhLm1hcmtlci5jb2xvcjtcbiAgICAgICAgICBvcGFjaXR5ID0gcC5kYXRhLm1hcmtlci5vcGFjaXR5O1xuICAgICAgICAgIGxpbmUgPSBwLmRhdGEubWFya2VyLmxpbmU7XG4gICAgICAgICAgcG4gPSBwLnBvaW50TnVtYmVyO1xuICAgICAgICAgIHRuID0gcC5jdXJ2ZU51bWJlcjtcbiAgICAgICAgICBpZiAocG4gPj0gMCkge1xuICAgICAgICAgICAgY29sb3JbcG5dID0gJ3RyYW5zcGFyZW50JztcbiAgICAgICAgICAgIG9wYWNpdHlbcG5dID0gMTtcbiAgICAgICAgICAgIGNvbnN0IHVwZGF0ZSA9IHttYXJrZXI6IHtjb2xvciwgb3BhY2l0eSwgbGluZSwgc2l6ZTogMTV9fTtcbiAgICAgICAgICAgIHRoaXMuZ3JhcGgucmVzdHlsZUNoYXJ0KHVwZGF0ZSwgW3RuXSk7XG4gICAgICAgICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2hvdmVyJ10sICdyZXN0eWxlQ2hhcnQgaW5uZXInLCB1cGRhdGUsIFt0bl0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSkqL1xuICB9XG5cbiAgdW5ob3ZlcihkYXRhOiBhbnkpIHtcbiAgICBsZXQgZGVsdGEgPSBOdW1iZXIuTUFYX1ZBTFVFO1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1zaGFkb3dlZC12YXJpYWJsZVxuICAgIGxldCBwb2ludDtcbiAgICBpZiAoZGF0YS5wb2ludHNbMF0gJiYgZGF0YS5wb2ludHNbMF0uZGF0YS5vcmllbnRhdGlvbiAhPT0gJ2gnKSB7XG4gICAgICBjb25zdCB5ID0gKGRhdGEueXZhbHMgfHwgWycnXSlbMF07XG4gICAgICBkYXRhLnBvaW50cy5mb3JFYWNoKHAgPT4ge1xuICAgICAgICBjb25zdCBkID0gTWF0aC5hYnMocC55IC0geSk7XG4gICAgICAgIGlmIChkIDwgZGVsdGEpIHtcbiAgICAgICAgICBkZWx0YSA9IGQ7XG4gICAgICAgICAgcG9pbnQgPSBwO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgeDogbnVtYmVyID0gKGRhdGEueHZhbHMgfHwgWycnXSlbMF07XG4gICAgICBkYXRhLnBvaW50cy5mb3JFYWNoKHAgPT4ge1xuICAgICAgICBjb25zdCBkID0gTWF0aC5hYnMocC54IC0geCk7XG4gICAgICAgIGlmIChkIDwgZGVsdGEpIHtcbiAgICAgICAgICBkZWx0YSA9IGQ7XG4gICAgICAgICAgcG9pbnQgPSBwO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKCEhcG9pbnQgJiYgdGhpcy5oaWdobGlnaHRlZCAhPT0gcG9pbnQuY3VydmVOdW1iZXIpIHtcbiAgICAgIHRoaXMudW5oaWdobGl0ZUN1cnZlLm5leHQoW3RoaXMuaGlnaGxpZ2h0ZWRdKTtcbiAgICAgIHRoaXMuaGlnaGxpZ2h0ZWQgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHN1cGVyLnVuaG92ZXIoZGF0YSwgcG9pbnQpO1xuICAgIC8qc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBsZXQgcG4gPSAtMTtcbiAgICAgIGxldCB0biA9IC0xO1xuICAgICAgbGV0IGNvbG9yID0gW107XG4gICAgICBsZXQgbGluZSA9IHt9O1xuICAgICAgbGV0IG9wYWNpdHkgPSBbXTtcbiAgICAgIGRhdGEucG9pbnRzLmZvckVhY2gocCA9PiB7XG4gICAgICAgIGlmICghIXAuZGF0YS5tYXJrZXIpIHtcbiAgICAgICAgICBwbiA9IHAucG9pbnROdW1iZXI7XG4gICAgICAgICAgdG4gPSBwLmN1cnZlTnVtYmVyO1xuICAgICAgICAgIGNvbG9yID0gcC5kYXRhLm1hcmtlci5jb2xvcjtcbiAgICAgICAgICBvcGFjaXR5ID0gcC5kYXRhLm1hcmtlci5vcGFjaXR5O1xuICAgICAgICAgIGxpbmUgPSBwLmRhdGEubWFya2VyLmxpbmU7XG4gICAgICAgICAgaWYgKHBuID49IDApIHtcbiAgICAgICAgICAgIGNvbG9yW3BuXSA9IHAuZGF0YS5saW5lLmNvbG9yO1xuICAgICAgICAgICAgb3BhY2l0eVtwbl0gPSB0aGlzLl9vcHRpb25zLnNob3dEb3RzID8gMSA6IDA7XG4gICAgICAgICAgICBjb25zdCB1cGRhdGUgPSB7bWFya2VyOiB7Y29sb3IsIG9wYWNpdHksIGxpbmUsIHNpemU6IDE1fX07XG4gICAgICAgICAgICB0aGlzLmdyYXBoLnJlc3R5bGVDaGFydCh1cGRhdGUsIFt0bl0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSkqL1xuICB9XG59XG4iXX0=