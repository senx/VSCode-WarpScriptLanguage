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
import { Component, ElementRef, EventEmitter, HostListener, Input, NgZone, Output, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { WarpViewComponent } from '../warp-view-component';
import { ChartLib } from '../../utils/chart-lib';
import moment from 'moment-timezone';
import { GTSLib } from '../../utils/gts.lib';
import { ColorLib } from '../../utils/color-lib';
import { SizeService } from '../../services/resize.service';
import { Logger } from '../../utils/logger';
import { ChartBounds } from '../../model/chartBounds';
export class WarpViewAnnotationComponent extends WarpViewComponent {
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
            this.layout.xaxis.tick0 = moment.tz(this.minTick / this.divider, this._options.timeZone).toISOString(true);
            this.layout.xaxis.range = [
                moment.tz(this.minTick / this.divider, this._options.timeZone).toISOString(true),
                moment.tz(this.maxTick / this.divider, this._options.timeZone).toISOString(true)
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
            : (moment(x).utc().toISOString().replace('Z', this._options.timeZone === 'UTC' ? 'Z' : '') || '')}</span>
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
                    min: moment.tz(min, this._options.timeZone).valueOf(),
                    max: moment.tz(max, this._options.timeZone).valueOf()
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
            x.tick0 = moment.tz(this.minTick / this.divider, this._options.timeZone).toISOString(true);
            x.range = [
                moment.tz(this.minTick / this.divider, this._options.timeZone).toISOString(true),
                moment.tz(this.maxTick / this.divider, this._options.timeZone).toISOString(true)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LWFubm90YXRpb24uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHNlbngvd2FycHZpZXcvIiwic291cmNlcyI6WyJzcmMvbGliL2VsZW1lbnRzL3dhcnAtdmlldy1hbm5vdGF0aW9uL3dhcnAtdmlldy1hbm5vdGF0aW9uLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBQ0wsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osWUFBWSxFQUNaLEtBQUssRUFDTCxNQUFNLEVBQ04sTUFBTSxFQUNOLFNBQVMsRUFDVCxTQUFTLEVBQ1QsaUJBQWlCLEVBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBRXpELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQyxPQUFPLE1BQU0sTUFBTSxpQkFBaUIsQ0FBQztBQUVyQyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFFM0MsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9DLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSwrQkFBK0IsQ0FBQztBQUMxRCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDMUMsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBUXBELE1BQU0sT0FBTywyQkFBNEIsU0FBUSxpQkFBaUI7Ozs7Ozs7SUFnSWhFLFlBQ1MsRUFBYyxFQUNkLFFBQW1CLEVBQ25CLFdBQXdCLEVBQ3hCLE1BQWM7UUFFckIsS0FBSyxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBTGxDLE9BQUUsR0FBRixFQUFFLENBQVk7UUFDZCxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ25C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bkMsbURBQTBCOzs7OztJQUMxQiw0Q0FBbUI7Ozs7O0lBQ25CLGtEQUF5Qjs7Ozs7SUFDekIsaURBQXdCOzs7OztJQUN4QixrREFBcUQ7O0lBQ3JELDZDQStCRTs7SUFDRixpREFBZ0I7O0lBNkJkLHlDQUFxQjs7SUFDckIsK0NBQTBCOztJQUMxQixrREFBK0I7O0lBQy9CLDZDQUFxQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQ29weXJpZ2h0IDIwMjAgIFNlblggUy5BLlMuXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKi9cblxuaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEhvc3RMaXN0ZW5lcixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT3V0cHV0LFxuICBSZW5kZXJlcjIsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1dhcnBWaWV3Q29tcG9uZW50fSBmcm9tICcuLi93YXJwLXZpZXctY29tcG9uZW50JztcbmltcG9ydCB7UGFyYW19IGZyb20gJy4uLy4uL21vZGVsL3BhcmFtJztcbmltcG9ydCB7Q2hhcnRMaWJ9IGZyb20gJy4uLy4uL3V0aWxzL2NoYXJ0LWxpYic7XG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudC10aW1lem9uZSc7XG5pbXBvcnQge0RhdGFNb2RlbH0gZnJvbSAnLi4vLi4vbW9kZWwvZGF0YU1vZGVsJztcbmltcG9ydCB7R1RTTGlifSBmcm9tICcuLi8uLi91dGlscy9ndHMubGliJztcbmltcG9ydCB7R1RTfSBmcm9tICcuLi8uLi9tb2RlbC9HVFMnO1xuaW1wb3J0IHtDb2xvckxpYn0gZnJvbSAnLi4vLi4vdXRpbHMvY29sb3ItbGliJztcbmltcG9ydCB7U2l6ZVNlcnZpY2V9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3Jlc2l6ZS5zZXJ2aWNlJztcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICcuLi8uLi91dGlscy9sb2dnZXInO1xuaW1wb3J0IHtDaGFydEJvdW5kc30gZnJvbSAnLi4vLi4vbW9kZWwvY2hhcnRCb3VuZHMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICd3YXJwdmlldy1hbm5vdGF0aW9uJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3dhcnAtdmlldy1hbm5vdGF0aW9uLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vd2FycC12aWV3LWFubm90YXRpb24uY29tcG9uZW50LnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uU2hhZG93RG9tXG59KVxuZXhwb3J0IGNsYXNzIFdhcnBWaWV3QW5ub3RhdGlvbkNvbXBvbmVudCBleHRlbmRzIFdhcnBWaWV3Q29tcG9uZW50IHtcbiAgQFZpZXdDaGlsZCgnY2hhcnRDb250YWluZXInLCB7c3RhdGljOiB0cnVlfSkgY2hhcnRDb250YWluZXI6IEVsZW1lbnRSZWY7XG5cbiAgQElucHV0KCdoaWRkZW5EYXRhJykgc2V0IGhpZGRlbkRhdGEoaGlkZGVuRGF0YTogbnVtYmVyW10pIHtcbiAgICBjb25zdCBwcmV2aW91c1Zpc2liaWxpdHkgPSBKU09OLnN0cmluZ2lmeSh0aGlzLnZpc2liaWxpdHkpO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnaGlkZGVuRGF0YScsICdwcmV2aW91c1Zpc2liaWxpdHknXSwgcHJldmlvdXNWaXNpYmlsaXR5KTtcbiAgICB0aGlzLl9oaWRkZW5EYXRhID0gaGlkZGVuRGF0YTtcbiAgICB0aGlzLnZpc2liaWxpdHkgPSBbXTtcbiAgICB0aGlzLnZpc2libGVHdHNJZC5mb3JFYWNoKGlkID0+IHRoaXMudmlzaWJpbGl0eS5wdXNoKGhpZGRlbkRhdGEuaW5kZXhPZihpZCkgPCAwICYmIChpZCAhPT0gLTEpKSk7XG4gICAgdGhpcy5MT0cuZGVidWcoWydoaWRkZW5EYXRhJywgJ2hpZGRlbmR5Z3JhcGhmdWxsdiddLCB0aGlzLnZpc2liaWxpdHkpO1xuICAgIGNvbnN0IG5ld1Zpc2liaWxpdHkgPSBKU09OLnN0cmluZ2lmeSh0aGlzLnZpc2liaWxpdHkpO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnaGlkZGVuRGF0YScsICdqc29uJ10sIHByZXZpb3VzVmlzaWJpbGl0eSwgbmV3VmlzaWJpbGl0eSk7XG4gICAgaWYgKHByZXZpb3VzVmlzaWJpbGl0eSAhPT0gbmV3VmlzaWJpbGl0eSkge1xuICAgICAgY29uc3QgdmlzaWJsZSA9IFtdO1xuICAgICAgY29uc3QgaGlkZGVuID0gW107XG4gICAgICB0aGlzLmd0c0lkLmZvckVhY2goKGlkLCBpKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLl9oaWRkZW5EYXRhLmluZGV4T2YoaWQpID4gLTEpIHtcbiAgICAgICAgICBoaWRkZW4ucHVzaChpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2aXNpYmxlLnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgaWYgKHZpc2libGUubGVuZ3RoID4gMCkge1xuICAgICAgICB0aGlzLmdyYXBoLnJlc3R5bGVDaGFydCh7dmlzaWJsZTogdHJ1ZX0sIHZpc2libGUpO1xuICAgICAgfVxuICAgICAgaWYgKGhpZGRlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRoaXMuZ3JhcGgucmVzdHlsZUNoYXJ0KHt2aXNpYmxlOiBmYWxzZX0sIGhpZGRlbik7XG4gICAgICB9XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2hpZGRlbmR5Z3JhcGh0cmlnJywgJ2Rlc3Ryb3knXSwgJ3JlZHJhdyBieSB2aXNpYmlsaXR5IGNoYW5nZScpO1xuICAgIH1cbiAgfVxuXG4gIEBJbnB1dCgndHlwZScpIHNldCB0eXBlKHR5cGU6IHN0cmluZykge1xuICAgIHRoaXMuX3R5cGUgPSB0eXBlO1xuICAgIHRoaXMuZHJhd0NoYXJ0KCk7XG4gIH1cblxuICBASW5wdXQoJ3N0YW5kYWxvbmUnKSBzZXQgc3RhbmRhbG9uZShpc1N0YW5kYWxvbmU6IGJvb2xlYW4pIHtcbiAgICBpZiAodGhpcy5fc3RhbmRhbG9uZSAhPT0gaXNTdGFuZGFsb25lKSB7XG4gICAgICB0aGlzLl9zdGFuZGFsb25lID0gaXNTdGFuZGFsb25lO1xuICAgICAgdGhpcy5kcmF3Q2hhcnQoKTtcbiAgICB9XG4gIH1cblxuICBnZXQgc3RhbmRhbG9uZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhbmRhbG9uZTtcbiAgfVxuXG4gIEBPdXRwdXQoJ3BvaW50SG92ZXInKSBwb2ludEhvdmVyID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoJ3dhcnBWaWV3Q2hhcnRSZXNpemUnKSB3YXJwVmlld0NoYXJ0UmVzaXplID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoJ2NoYXJ0RHJhdycpIGNoYXJ0RHJhdyA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCdib3VuZHNEaWRDaGFuZ2UnKSBib3VuZHNEaWRDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBkaXNwbGF5RXhwYW5kZXIgPSB0cnVlO1xuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lXG4gIHByaXZhdGUgX3R5cGUgPSAnbGluZSc7XG4gIHByaXZhdGUgdmlzaWJpbGl0eTogYm9vbGVhbltdID0gW107XG4gIHByaXZhdGUgZXhwYW5kZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfc3RhbmRhbG9uZSA9IHRydWU7XG4gIHByaXZhdGUgdHJpbW1lZDtcbiAgcHJpdmF0ZSBtYXhUaWNrID0gTnVtYmVyLk1JTl9WQUxVRTtcbiAgcHJpdmF0ZSBtaW5UaWNrID0gTnVtYmVyLk1BWF9WQUxVRTtcbiAgcHJpdmF0ZSB2aXNpYmxlR3RzSWQgPSBbXTtcbiAgcHJpdmF0ZSBndHNJZCA9IFtdO1xuICBwcml2YXRlIGRhdGFIYXNoc2V0ID0ge307XG4gIHByaXZhdGUgbGluZUhlaWdodCA9IDMwO1xuICBwcml2YXRlIGNoYXJ0Qm91bmRzOiBDaGFydEJvdW5kcyA9IG5ldyBDaGFydEJvdW5kcygpO1xuICBsYXlvdXQ6IFBhcnRpYWw8YW55PiA9IHtcbiAgICBzaG93bGVnZW5kOiBmYWxzZSxcbiAgICBob3Zlcm1vZGU6ICdjbG9zZXN0JyxcbiAgICB4YXhpczoge1xuICAgICAgZ3JpZHdpZHRoOiAxLFxuICAgICAgZml4ZWRyYW5nZTogZmFsc2UsXG4gICAgICBhdXRvcmFuZ2U6IGZhbHNlLFxuICAgICAgYXV0b21hcmdpbjogZmFsc2UsXG4gICAgICBzaG93dGlja2xhYmVsczogdHJ1ZSxcbiAgICB9LFxuICAgIGF1dG9zaXplOiBmYWxzZSxcbiAgICBhdXRvZXhwYW5kOiBmYWxzZSxcbiAgICB5YXhpczoge1xuICAgICAgc2hvd3RpY2tsYWJlbHM6IGZhbHNlLFxuICAgICAgZml4ZWRyYW5nZTogdHJ1ZSxcbiAgICAgIGR0aWNrOiAxLFxuICAgICAgZ3JpZHdpZHRoOiAxLFxuICAgICAgdGljazA6IDAsXG4gICAgICBudGlja3M6IDIsXG4gICAgICByYW5nZW1vZGU6ICd0b3plcm8nLFxuICAgICAgdGlja3NvbjogJ2JvdW5kYXJpZXMnLFxuICAgICAgYXV0b21hcmdpbjogdHJ1ZSxcbiAgICAgIHNob3dsaW5lOiB0cnVlLFxuICAgICAgemVyb2xpbmU6IHRydWVcbiAgICB9LFxuICAgIG1hcmdpbjoge1xuICAgICAgdDogMzAsXG4gICAgICBiOiAyLFxuICAgICAgcjogMTAsXG4gICAgICBsOiAxMFxuICAgIH0sXG4gIH07XG4gIG1hcmdpbkxlZnQgPSA1MDtcblxuICBASG9zdExpc3RlbmVyKCdrZXlkb3duJywgWyckZXZlbnQnXSlcbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6a2V5ZG93bicsIFsnJGV2ZW50J10pXG4gIGhhbmRsZUtleURvd24oJGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgaWYgKCRldmVudC5rZXkgPT09ICdDb250cm9sJykge1xuICAgICAgdGhpcy50cmltbWVkID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICBpZiAoISF0aGlzLnRvb2xUaXAubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcjdG9vbHRpcC1ib2R5JykpIHtcbiAgICAgICAgICB0aGlzLnRvb2xUaXAubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcjdG9vbHRpcC1ib2R5JykuY2xhc3NMaXN0LmFkZCgnZnVsbCcpO1xuICAgICAgICB9XG4gICAgICB9LCAxMDApO1xuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2tleXVwJywgWyckZXZlbnQnXSlcbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6a2V5dXAnLCBbJyRldmVudCddKVxuICBoYW5kbGVLZXl1cCgkZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RvY3VtZW50OmtleXVwJ10sICRldmVudCk7XG4gICAgaWYgKCRldmVudC5rZXkgPT09ICdDb250cm9sJykge1xuICAgICAgaWYgKCEhdGhpcy50b29sVGlwLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignI3Rvb2x0aXAtYm9keScpKSB7XG4gICAgICAgIGlmICh0aGlzLnRyaW1tZWQpIHtcbiAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMudHJpbW1lZCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50b29sVGlwLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignI3Rvb2x0aXAtYm9keScpLmNsYXNzTGlzdC5yZW1vdmUoJ2Z1bGwnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgZWw6IEVsZW1lbnRSZWYsXG4gICAgcHVibGljIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHVibGljIHNpemVTZXJ2aWNlOiBTaXplU2VydmljZSxcbiAgICBwdWJsaWMgbmdab25lOiBOZ1pvbmVcbiAgKSB7XG4gICAgc3VwZXIoZWwsIHJlbmRlcmVyLCBzaXplU2VydmljZSwgbmdab25lKTtcbiAgICB0aGlzLl9hdXRvUmVzaXplID0gZmFsc2U7XG4gICAgdGhpcy5MT0cgPSBuZXcgTG9nZ2VyKFdhcnBWaWV3QW5ub3RhdGlvbkNvbXBvbmVudCwgdGhpcy5fZGVidWcpO1xuICB9XG5cbiAgdXBkYXRlKG9wdGlvbnM6IFBhcmFtLCByZWZyZXNoOiBib29sZWFuKTogdm9pZCB7XG4gICAgaWYgKCEhb3B0aW9ucykge1xuICAgICAgdGhpcy5fb3B0aW9ucyA9IENoYXJ0TGliLm1lcmdlRGVlcCh0aGlzLl9vcHRpb25zLCBvcHRpb25zKSBhcyBQYXJhbTtcbiAgICB9XG4gICAgdGhpcy5kcmF3Q2hhcnQocmVmcmVzaCk7XG4gIH1cblxuICB1cGRhdGVCb3VuZHMobWluLCBtYXgsIG1hcmdpbkxlZnQpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3VwZGF0ZUJvdW5kcyddLCBtaW4sIG1heCwgdGhpcy5fb3B0aW9ucyk7XG4gICAgdGhpcy5fb3B0aW9ucy5ib3VuZHMubWluRGF0ZSA9IG1pbjtcbiAgICB0aGlzLl9vcHRpb25zLmJvdW5kcy5tYXhEYXRlID0gbWF4O1xuICAgIHRoaXMubGF5b3V0LnhheGlzLmF1dG9yYW5nZSA9IGZhbHNlO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsndXBkYXRlQm91bmRzJ10sXG4gICAgICBtb21lbnQudHoobWluIC8gdGhpcy5kaXZpZGVyLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKS50b0lTT1N0cmluZygpLFxuICAgICAgbW9tZW50LnR6KG1heCAvIHRoaXMuZGl2aWRlciwgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSkudG9JU09TdHJpbmcoKSk7XG4gICAgdGhpcy5taW5UaWNrID0gbWluO1xuICAgIHRoaXMubWF4VGljayA9IG1heDtcbiAgICBpZiAodGhpcy5fb3B0aW9ucy50aW1lTW9kZSAmJiB0aGlzLl9vcHRpb25zLnRpbWVNb2RlID09PSAndGltZXN0YW1wJykge1xuICAgICAgdGhpcy5sYXlvdXQueGF4aXMudGljazAgPSBtaW4gLyB0aGlzLmRpdmlkZXI7XG4gICAgICB0aGlzLmxheW91dC54YXhpcy5yYW5nZSA9IFttaW4gLyB0aGlzLmRpdmlkZXIsIG1heCAvIHRoaXMuZGl2aWRlcl07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubGF5b3V0LnhheGlzLnRpY2swID0gbW9tZW50LnR6KG1pbiAvIHRoaXMuZGl2aWRlciwgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSkudG9JU09TdHJpbmcoKTtcbiAgICAgIHRoaXMubGF5b3V0LnhheGlzLnJhbmdlID0gW1xuICAgICAgICBtb21lbnQudHoobWluIC8gdGhpcy5kaXZpZGVyLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKS50b0lTT1N0cmluZygpLFxuICAgICAgICBtb21lbnQudHoobWF4IC8gdGhpcy5kaXZpZGVyLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKS50b0lTT1N0cmluZygpXG4gICAgICBdO1xuICAgIH1cbiAgICB0aGlzLmxheW91dC5tYXJnaW4ubCA9IG1hcmdpbkxlZnQ7XG4gICAgdGhpcy5tYXJnaW5MZWZ0ID0gbWFyZ2luTGVmdDtcbiAgICB0aGlzLmxheW91dCA9IHsuLi50aGlzLmxheW91dH07XG4gICAgdGhpcy5MT0cuZGVidWcoWyd1cGRhdGVCb3VuZHMnXSwgey4uLnRoaXMubGF5b3V0LnhheGlzLnJhbmdlfSk7XG4gIH1cblxuICBkcmF3Q2hhcnQocmVwYXJzZU5ld0RhdGE6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgIGlmICghdGhpcy5pbml0Q2hhcnQodGhpcy5lbCkpIHtcbiAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgdGhpcy5MT0cuZGVidWcoWydkcmF3Q2hhcnQnLCAndGhpcy5wbG90bHlEYXRhJ10sIHRoaXMucGxvdGx5RGF0YSk7XG4gICAgdGhpcy5MT0cuZGVidWcoWydkcmF3Q2hhcnQnLCAnaGlkZGVuRGF0YSddLCB0aGlzLl9oaWRkZW5EYXRhKTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RyYXdDaGFydCcsICd0aGlzLl9vcHRpb25zLmJvdW5kcyddLCB0aGlzLl9vcHRpb25zLmJvdW5kcyk7XG4gICAgdGhpcy5sYXlvdXQueWF4aXMuY29sb3IgPSB0aGlzLmdldEdyaWRDb2xvcih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgIHRoaXMubGF5b3V0LnlheGlzLmdyaWRjb2xvciA9IHRoaXMuZ2V0R3JpZENvbG9yKHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XG4gICAgdGhpcy5sYXlvdXQueWF4aXMuc2hvd2xpbmUgPSAhIXRoaXMuX3N0YW5kYWxvbmU7XG4gICAgdGhpcy5sYXlvdXQueWF4aXMuemVyb2xpbmVjb2xvciA9IHRoaXMuZ2V0R3JpZENvbG9yKHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XG4gICAgdGhpcy5sYXlvdXQueGF4aXMuY29sb3IgPSB0aGlzLmdldEdyaWRDb2xvcih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgIHRoaXMubGF5b3V0LnhheGlzLmdyaWRjb2xvciA9IHRoaXMuZ2V0R3JpZENvbG9yKHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XG4gICAgdGhpcy5sYXlvdXQueGF4aXMuYXV0b3JhbmdlID0gISF0aGlzLl9zdGFuZGFsb25lO1xuICAgIHRoaXMubGF5b3V0LnhheGlzLnNob3d0aWNrbGFiZWxzID0gISF0aGlzLl9zdGFuZGFsb25lO1xuICAgIHRoaXMuZGlzcGxheUV4cGFuZGVyID0gKHRoaXMucGxvdGx5RGF0YS5sZW5ndGggPiAxKTtcbiAgICBjb25zdCBjb3VudCA9IHRoaXMucGxvdGx5RGF0YS5maWx0ZXIoZCA9PiBkLnkubGVuZ3RoID4gMCkubGVuZ3RoO1xuICAgIHRoaXMubGF5b3V0Lm1hcmdpbi5sID0gISF0aGlzLl9zdGFuZGFsb25lID8gMTAgOiA1MDtcbiAgICB0aGlzLmxheW91dC5tYXJnaW4uYiA9ICEhdGhpcy5fc3RhbmRhbG9uZSA/IDUwIDogMTtcbiAgICBjb25zdCBjYWxjdWxhdGVkSGVpZ2h0ID0gKHRoaXMuZXhwYW5kZWQgPyB0aGlzLmxpbmVIZWlnaHQgKiBjb3VudCA6IHRoaXMubGluZUhlaWdodCkgKyB0aGlzLmxheW91dC5tYXJnaW4udCArIHRoaXMubGF5b3V0Lm1hcmdpbi5iO1xuICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5zdHlsZS5oZWlnaHQgPSBjYWxjdWxhdGVkSGVpZ2h0ICsgJ3B4JztcbiAgICB0aGlzLmhlaWdodCA9IGNhbGN1bGF0ZWRIZWlnaHQ7XG4gICAgdGhpcy5sYXlvdXQuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG4gICAgdGhpcy5MT0cuZGVidWcoWydkcmF3Q2hhcnQnLCAnaGVpZ2h0J10sIHRoaXMuaGVpZ2h0LCBjb3VudCwgY2FsY3VsYXRlZEhlaWdodCk7XG4gICAgdGhpcy5sYXlvdXQueWF4aXMucmFuZ2UgPSBbMCwgdGhpcy5leHBhbmRlZCA/IGNvdW50IDogMV07XG4gICAgdGhpcy5MT0cuZGVidWcoWydkcmF3Q2hhcnQnLCAndGhpcy5sYXlvdXQnXSwgdGhpcy5sYXlvdXQpO1xuICAgIGlmICh0aGlzLl9vcHRpb25zLnRpbWVNb2RlICYmIHRoaXMuX29wdGlvbnMudGltZU1vZGUgPT09ICd0aW1lc3RhbXAnKSB7XG4gICAgICB0aGlzLmxheW91dC54YXhpcy50aWNrMCA9IHRoaXMubWluVGljayAvIHRoaXMuZGl2aWRlcjtcbiAgICAgIHRoaXMubGF5b3V0LnhheGlzLnJhbmdlID0gW3RoaXMubWluVGljayAvIHRoaXMuZGl2aWRlciwgdGhpcy5tYXhUaWNrIC8gdGhpcy5kaXZpZGVyXTtcbiAgICAgIHRoaXMubGF5b3V0LnhheGlzLnR5cGUgPSAnbGluZWFyJztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sYXlvdXQueGF4aXMudGljazAgPSBtb21lbnQudHoodGhpcy5taW5UaWNrIC8gdGhpcy5kaXZpZGVyLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKS50b0lTT1N0cmluZyh0cnVlKTtcbiAgICAgIHRoaXMubGF5b3V0LnhheGlzLnJhbmdlID0gW1xuICAgICAgICBtb21lbnQudHoodGhpcy5taW5UaWNrIC8gdGhpcy5kaXZpZGVyLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKS50b0lTT1N0cmluZyh0cnVlKSxcbiAgICAgICAgbW9tZW50LnR6KHRoaXMubWF4VGljayAvIHRoaXMuZGl2aWRlciwgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSkudG9JU09TdHJpbmcodHJ1ZSlcbiAgICAgIF07XG4gICAgICB0aGlzLmxheW91dC54YXhpcy50eXBlID0gJ2RhdGUnO1xuICAgIH1cbiAgICB0aGlzLnBsb3RseUNvbmZpZy5zY3JvbGxab29tID0gdHJ1ZTtcbiAgICB0aGlzLnBsb3RseUNvbmZpZyA9IHsuLi50aGlzLnBsb3RseUNvbmZpZ307XG4gICAgdGhpcy5sYXlvdXQgPSB7Li4udGhpcy5sYXlvdXR9O1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZHJhd0NoYXJ0JywgJ3RoaXMucGxvdGx5Q29uZmlnJ10sIHRoaXMucGxvdGx5Q29uZmlnLCB0aGlzLnBsb3RseURhdGEpO1xuICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICB9XG5cbiAgcmVsYXlvdXQoZGF0YTogYW55KSB7XG4gICAgaWYgKGRhdGFbJ3hheGlzLnJhbmdlJ10gJiYgZGF0YVsneGF4aXMucmFuZ2UnXS5sZW5ndGggPT09IDIpIHtcbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsncmVsYXlvdXQnLCAndXBkYXRlQm91bmRzJywgJ3hheGlzLnJhbmdlJ10sIGRhdGFbJ3hheGlzLnJhbmdlJ10pO1xuICAgICAgdGhpcy5jaGFydEJvdW5kcy5tc21pbiA9IGRhdGFbJ3hheGlzLnJhbmdlJ11bMF07XG4gICAgICB0aGlzLmNoYXJ0Qm91bmRzLm1zbWF4ID0gZGF0YVsneGF4aXMucmFuZ2UnXVsxXTtcbiAgICAgIHRoaXMuY2hhcnRCb3VuZHMudHNtaW4gPSBtb21lbnQudHoobW9tZW50KHRoaXMuY2hhcnRCb3VuZHMubXNtaW4pLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKS52YWx1ZU9mKCk7XG4gICAgICB0aGlzLmNoYXJ0Qm91bmRzLnRzbWF4ID0gbW9tZW50LnR6KG1vbWVudCh0aGlzLmNoYXJ0Qm91bmRzLm1zbWF4KSwgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSkudmFsdWVPZigpO1xuICAgIH0gZWxzZSBpZiAoZGF0YVsneGF4aXMucmFuZ2VbMF0nXSAmJiBkYXRhWyd4YXhpcy5yYW5nZVsxXSddKSB7XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3JlbGF5b3V0JywgJ3VwZGF0ZUJvdW5kcycsICd4YXhpcy5yYW5nZVt4XSddLCBkYXRhWyd4YXhpcy5yYW5nZVswXSddKTtcbiAgICAgIHRoaXMuY2hhcnRCb3VuZHMubXNtaW4gPSBkYXRhWyd4YXhpcy5yYW5nZVswXSddO1xuICAgICAgdGhpcy5jaGFydEJvdW5kcy5tc21heCA9IGRhdGFbJ3hheGlzLnJhbmdlWzFdJ107XG4gICAgICB0aGlzLmNoYXJ0Qm91bmRzLnRzbWluID0gbW9tZW50LnR6KG1vbWVudCh0aGlzLmNoYXJ0Qm91bmRzLm1zbWluKSwgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSkudmFsdWVPZigpO1xuICAgICAgdGhpcy5jaGFydEJvdW5kcy50c21heCA9IG1vbWVudC50eihtb21lbnQodGhpcy5jaGFydEJvdW5kcy5tc21heCksIHRoaXMuX29wdGlvbnMudGltZVpvbmUpLnZhbHVlT2YoKTtcbiAgICB9IGVsc2UgaWYgKGRhdGFbJ3hheGlzLmF1dG9yYW5nZSddKSB7XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3JlbGF5b3V0JywgJ3VwZGF0ZUJvdW5kcycsICdhdXRvcmFuZ2UnXSwgZGF0YSk7XG4gICAgICB0aGlzLmNoYXJ0Qm91bmRzLnRzbWluID0gdGhpcy5taW5UaWNrIC8gdGhpcy5kaXZpZGVyO1xuICAgICAgdGhpcy5jaGFydEJvdW5kcy50c21heCA9IHRoaXMubWF4VGljayAvIHRoaXMuZGl2aWRlcjtcbiAgICB9XG4gICAgdGhpcy5lbWl0TmV3Qm91bmRzKG1vbWVudC51dGModGhpcy5jaGFydEJvdW5kcy50c21pbikudmFsdWVPZigpLCBtb21lbnQudXRjKHRoaXMuY2hhcnRCb3VuZHMubXNtYXgpLnZhbHVlT2YoKSk7XG4gIH1cblxuICBob3ZlcihkYXRhOiBhbnkpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2hvdmVyJ10sIGRhdGEpO1xuICAgIGNvbnN0IHRvb2x0aXAgPSB0aGlzLnRvb2xUaXAubmF0aXZlRWxlbWVudDtcbiAgICB0aGlzLnBvaW50SG92ZXIuZW1pdCh7XG4gICAgICB4OiBkYXRhLmV2ZW50Lm9mZnNldFgsXG4gICAgICB5OiBkYXRhLmV2ZW50Lm9mZnNldFlcbiAgICB9KTtcbiAgICBsZXQgeCA9IGRhdGEueHZhbHNbMF07XG4gICAgaWYgKCEhZGF0YS5wb2ludHNbMF0pIHtcbiAgICAgIHggPSBkYXRhLnBvaW50c1swXS54O1xuICAgIH1cbiAgICBjb25zdCBsYXlvdXQgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgY291bnQgPSB0aGlzLnBsb3RseURhdGEuZmlsdGVyKGQgPT4gZC55Lmxlbmd0aCA+IDApLmxlbmd0aDtcbiAgICB0b29sdGlwLnN0eWxlLm9wYWNpdHkgPSAnMSc7XG4gICAgdG9vbHRpcC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICB0b29sdGlwLnN0eWxlLnBhZGRpbmdMZWZ0ID0gKHRoaXMuX3N0YW5kYWxvbmUgPyAwIDogNDApICsgJ3B4JztcbiAgICB0b29sdGlwLnN0eWxlLnRvcCA9IChcbiAgICAgICh0aGlzLmV4cGFuZGVkID8gY291bnQgLSAxIC0gKGRhdGEucG9pbnRzWzBdLnkgKyAwLjUpIDogLTEpICogKHRoaXMubGluZUhlaWdodCkgKyB0aGlzLmxheW91dC5tYXJnaW4udFxuICAgICkgKyA2ICsgJ3B4JztcbiAgICB0b29sdGlwLmNsYXNzTGlzdC5yZW1vdmUoJ3JpZ2h0JywgJ2xlZnQnKTtcbiAgICB0b29sdGlwLmlubmVySFRNTCA9IGA8ZGl2IGNsYXNzPVwidG9vbHRpcC1ib2R5IHRyaW1tZWRcIiBpZD1cInRvb2x0aXAtYm9keVwiPlxuPHNwYW4gY2xhc3M9XCJ0b29sdGlwLWRhdGVcIj4ke3RoaXMuX29wdGlvbnMudGltZU1vZGUgPT09ICd0aW1lc3RhbXAnXG4gICAgICA/IHhcbiAgICAgIDogKG1vbWVudCh4KS51dGMoKS50b0lTT1N0cmluZygpLnJlcGxhY2UoJ1onLCB0aGlzLl9vcHRpb25zLnRpbWVab25lID09PSAnVVRDJyA/ICdaJyA6ICcnKSB8fCAnJyl9PC9zcGFuPlxuPHVsPlxuPGxpPiR7R1RTTGliLmZvcm1hdExhYmVsKGRhdGEucG9pbnRzWzBdLmRhdGEubmFtZSl9OiA8c3BhbiBjbGFzcz1cInZhbHVlXCI+JHtkYXRhLnBvaW50c1swXS50ZXh0fTwvc3Bhbj48L2xpPlxuPC91bD5cbiAgICAgIDwvZGl2PmA7XG4gICAgaWYgKGRhdGEuZXZlbnQub2Zmc2V0WCA+IGxheW91dC53aWR0aCAvIDIpIHtcbiAgICAgIHRvb2x0aXAuY2xhc3NMaXN0LmFkZCgnbGVmdCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0b29sdGlwLmNsYXNzTGlzdC5hZGQoJ3JpZ2h0Jyk7XG4gICAgfVxuICAgIHRvb2x0aXAuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdub25lJztcbiAgfVxuXG4gIHVuaG92ZXIoKSB7XG4gICAgdGhpcy50b29sVGlwLm5hdGl2ZUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgfVxuXG4gIGFmdGVyUGxvdChkaXYpIHtcbiAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLmNoYXJ0Qm91bmRzLnRzbWluID0gdGhpcy5taW5UaWNrO1xuICAgIHRoaXMuY2hhcnRCb3VuZHMudHNtYXggPSB0aGlzLm1heFRpY2s7XG4gICAgdGhpcy5jaGFydERyYXcuZW1pdCh0aGlzLmNoYXJ0Qm91bmRzKTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2FmdGVyUGxvdCddLCB0aGlzLmNoYXJ0Qm91bmRzLCBkaXYpO1xuICB9XG5cbiAgcHJpdmF0ZSBlbWl0TmV3Qm91bmRzKG1pbiwgbWF4KSB7XG4gICAgaWYgKHRoaXMuX29wdGlvbnMudGltZU1vZGUgJiYgdGhpcy5fb3B0aW9ucy50aW1lTW9kZSA9PT0gJ3RpbWVzdGFtcCcpIHtcbiAgICAgIHRoaXMuYm91bmRzRGlkQ2hhbmdlLmVtaXQoe2JvdW5kczoge21pbiwgbWF4fSwgc291cmNlOiAnYW5ub3RhdGlvbid9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ib3VuZHNEaWRDaGFuZ2UuZW1pdCh7XG4gICAgICAgIGJvdW5kczoge1xuICAgICAgICAgIG1pbjogbW9tZW50LnR6KG1pbiwgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSkudmFsdWVPZigpLFxuICAgICAgICAgIG1heDogbW9tZW50LnR6KG1heCwgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSkudmFsdWVPZigpXG4gICAgICAgIH0sXG4gICAgICAgIHNvdXJjZTogJ2Fubm90YXRpb24nXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgY29udmVydChkYXRhOiBEYXRhTW9kZWwpOiBQYXJ0aWFsPGFueT5bXSB7XG4gICAgY29uc3QgZGF0YXNldDogUGFydGlhbDxhbnk+W10gPSBbXTtcbiAgICBsZXQgZ3RzTGlzdCA9IEdUU0xpYi5mbGF0RGVlcChHVFNMaWIuZmxhdHRlbkd0c0lkQXJyYXkoZGF0YS5kYXRhIGFzIGFueVtdLCAwKS5yZXMpO1xuICAgIHRoaXMubWF4VGljayA9IE51bWJlci5ORUdBVElWRV9JTkZJTklUWTtcbiAgICB0aGlzLm1pblRpY2sgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFk7XG4gICAgdGhpcy52aXNpYmxlR3RzSWQgPSBbXTtcbiAgICB0aGlzLmd0c0lkID0gW107XG4gICAgY29uc3Qgbm9uUGxvdHRhYmxlID0gZ3RzTGlzdC5maWx0ZXIoZyA9PiBnLnYgJiYgR1RTTGliLmlzR3RzVG9QbG90KGcpKTtcbiAgICBndHNMaXN0ID0gZ3RzTGlzdC5maWx0ZXIoZyA9PiBnLnYgJiYgIUdUU0xpYi5pc0d0c1RvUGxvdChnKSk7XG4gICAgbGV0IHRpbWVzdGFtcE1vZGUgPSB0cnVlO1xuICAgIGNvbnN0IHRzTGltaXQgPSAxMDAgKiBHVFNMaWIuZ2V0RGl2aWRlcih0aGlzLl9vcHRpb25zLnRpbWVVbml0KTtcbiAgICBndHNMaXN0LmZvckVhY2goKGd0czogR1RTKSA9PiB7XG4gICAgICBjb25zdCB0aWNrcyA9IGd0cy52Lm1hcCh0ID0+IHRbMF0pO1xuICAgICAgY29uc3Qgc2l6ZSA9IGd0cy52Lmxlbmd0aDtcbiAgICAgIHRpbWVzdGFtcE1vZGUgPSB0aW1lc3RhbXBNb2RlICYmICh0aWNrc1swXSA+IC10c0xpbWl0ICYmIHRpY2tzWzBdIDwgdHNMaW1pdCk7XG4gICAgICB0aW1lc3RhbXBNb2RlID0gdGltZXN0YW1wTW9kZSAmJiAodGlja3Nbc2l6ZSAtIDFdID4gLXRzTGltaXQgJiYgdGlja3Nbc2l6ZSAtIDFdIDwgdHNMaW1pdCk7XG4gICAgfSk7XG4gICAgaWYgKHRpbWVzdGFtcE1vZGUgfHwgdGhpcy5fb3B0aW9ucy50aW1lTW9kZSA9PT0gJ3RpbWVzdGFtcCcpIHtcbiAgICAgIHRoaXMubGF5b3V0LnhheGlzLnR5cGUgPSAnbGluZWFyJztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sYXlvdXQueGF4aXMudHlwZSA9ICdkYXRlJztcbiAgICB9XG4gICAgZ3RzTGlzdC5mb3JFYWNoKChndHM6IEdUUywgaSkgPT4ge1xuICAgICAgaWYgKGd0cy52KSB7XG4gICAgICAgIGNvbnN0IHNpemUgPSBndHMudi5sZW5ndGg7XG4gICAgICAgIGNvbnN0IGxhYmVsID0gR1RTTGliLnNlcmlhbGl6ZUd0c01ldGFkYXRhKGd0cyk7XG4gICAgICAgIGNvbnN0IGMgPSBDb2xvckxpYi5nZXRDb2xvcihndHMuaWQsIHRoaXMuX29wdGlvbnMuc2NoZW1lKTtcbiAgICAgICAgY29uc3QgY29sb3IgPSAoKGRhdGEucGFyYW1zIHx8IFtdKVtpXSB8fCB7ZGF0YXNldENvbG9yOiBjfSkuZGF0YXNldENvbG9yIHx8IGM7XG4gICAgICAgIGNvbnN0IHNlcmllczogUGFydGlhbDxhbnk+ID0ge1xuICAgICAgICAgIHR5cGU6ICdzY2F0dGVyJyxcbiAgICAgICAgICBtb2RlOiAnbWFya2VycycsXG4gICAgICAgICAgbmFtZTogbGFiZWwsXG4gICAgICAgICAgeDogW10sXG4gICAgICAgICAgeTogW10sXG4gICAgICAgICAgdGV4dDogW10sXG4gICAgICAgICAgaG92ZXJpbmZvOiAnbm9uZScsXG4gICAgICAgICAgY29ubmVjdGdhcHM6IGZhbHNlLFxuICAgICAgICAgIHZpc2libGU6ICEodGhpcy5faGlkZGVuRGF0YS5maWx0ZXIoaCA9PiBoID09PSBndHMuaWQpLmxlbmd0aCA+IDApLFxuICAgICAgICAgIGxpbmU6IHtjb2xvcn0sXG4gICAgICAgICAgbWFya2VyOiB7XG4gICAgICAgICAgICBzeW1ib2w6ICdsaW5lLW5zLW9wZW4nLFxuICAgICAgICAgICAgY29sb3IsXG4gICAgICAgICAgICBzaXplOiAyMCxcbiAgICAgICAgICAgIHdpZHRoOiA1LFxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy52aXNpYmxlR3RzSWQucHVzaChndHMuaWQpO1xuICAgICAgICB0aGlzLmd0c0lkLnB1c2goZ3RzLmlkKTtcbiAgICAgICAgaWYgKHRoaXMuX29wdGlvbnMudGltZU1vZGUgJiYgdGhpcy5fb3B0aW9ucy50aW1lTW9kZSA9PT0gJ3RpbWVzdGFtcCcpIHtcbiAgICAgICAgICB0aGlzLmxheW91dC54YXhpcy50eXBlID0gJ2xpbmVhcic7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5sYXlvdXQueGF4aXMudHlwZSA9ICdkYXRlJztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB0aWNrcyA9IGd0cy52Lm1hcCh0ID0+IHRbMF0pO1xuICAgICAgICBzZXJpZXMudGV4dCA9IGd0cy52Lm1hcCh0ID0+IHRbdC5sZW5ndGggLSAxXSk7XG4gICAgICAgIHNlcmllcy55ID0gZ3RzLnYubWFwKCgpID0+ICh0aGlzLmV4cGFuZGVkID8gaSA6IDApICsgMC41KTtcbiAgICAgICAgaWYgKHNpemUgPiAwKSB7XG4gICAgICAgICAgdGhpcy5taW5UaWNrID0gdGlja3NbMF07XG4gICAgICAgICAgdGhpcy5tYXhUaWNrID0gdGlja3NbMF07XG4gICAgICAgICAgZm9yIChsZXQgdiA9IDE7IHYgPCBzaXplOyB2KyspIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbCA9IHRpY2tzW3ZdO1xuICAgICAgICAgICAgdGhpcy5taW5UaWNrID0gKHZhbCA8IHRoaXMubWluVGljaykgPyB2YWwgOiB0aGlzLm1pblRpY2s7XG4gICAgICAgICAgICB0aGlzLm1heFRpY2sgPSAodmFsID4gdGhpcy5tYXhUaWNrKSA/IHZhbCA6IHRoaXMubWF4VGljaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRpbWVzdGFtcE1vZGUgfHwgdGhpcy5fb3B0aW9ucy50aW1lTW9kZSA9PT0gJ3RpbWVzdGFtcCcpIHtcbiAgICAgICAgICBzZXJpZXMueCA9IHRpY2tzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh0aGlzLl9vcHRpb25zLnRpbWVab25lICE9PSAnVVRDJykge1xuICAgICAgICAgICAgc2VyaWVzLnggPSB0aWNrcy5tYXAodCA9PiBtb21lbnQudXRjKHQgLyB0aGlzLmRpdmlkZXIpLnR6KHRoaXMuX29wdGlvbnMudGltZVpvbmUpLnRvSVNPU3RyaW5nKCkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZXJpZXMueCA9IHRpY2tzLm1hcCh0ID0+IG1vbWVudC51dGModCAvIHRoaXMuZGl2aWRlcikudG9JU09TdHJpbmcoKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChzZXJpZXMueC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZGF0YXNldC5wdXNoKHNlcmllcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAobm9uUGxvdHRhYmxlLmxlbmd0aCA+IDApIHtcbiAgICAgIG5vblBsb3R0YWJsZS5mb3JFYWNoKGcgPT4ge1xuICAgICAgICBnLnYuZm9yRWFjaCh2YWx1ZSA9PiB7XG4gICAgICAgICAgY29uc3QgdHMgPSB2YWx1ZVswXTtcbiAgICAgICAgICBpZiAodHMgPCB0aGlzLm1pblRpY2spIHtcbiAgICAgICAgICAgIHRoaXMubWluVGljayA9IHRzO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodHMgPiB0aGlzLm1heFRpY2spIHtcbiAgICAgICAgICAgIHRoaXMubWF4VGljayA9IHRzO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIC8vIGlmIHRoZXJlIGlzIG5vdCBhbnkgcGxvdHRhYmxlIGRhdGEsIHdlIG11c3QgYWRkIGEgZmFrZSBvbmUgd2l0aCBpZCAtMS4gVGhpcyBvbmUgd2lsbCBhbHdheXMgYmUgaGlkZGVuLlxuICAgICAgaWYgKDAgPT09IGd0c0xpc3QubGVuZ3RoKSB7XG4gICAgICAgIGlmICghdGhpcy5kYXRhSGFzaHNldFt0aGlzLm1pblRpY2tdKSB7XG4gICAgICAgICAgdGhpcy5kYXRhSGFzaHNldFt0aGlzLm1pblRpY2tdID0gWzBdO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5kYXRhSGFzaHNldFt0aGlzLm1heFRpY2tdKSB7XG4gICAgICAgICAgdGhpcy5kYXRhSGFzaHNldFt0aGlzLm1heFRpY2tdID0gWzBdO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudmlzaWJpbGl0eS5wdXNoKGZhbHNlKTtcbiAgICAgICAgdGhpcy52aXNpYmxlR3RzSWQucHVzaCgtMSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aW1lc3RhbXBNb2RlKSB7XG4gICAgICB0aGlzLl9vcHRpb25zLnRpbWVNb2RlID0gJ3RpbWVzdGFtcCc7XG4gICAgfVxuICAgIHJldHVybiBkYXRhc2V0O1xuICB9XG5cbiAgdG9nZ2xlKCkge1xuICAgIHRoaXMuZXhwYW5kZWQgPSAhdGhpcy5leHBhbmRlZDtcbiAgICB0aGlzLmRyYXdDaGFydCgpO1xuICB9XG5cbiAgc2V0UmVhbEJvdW5kcyhjaGFydEJvdW5kczogQ2hhcnRCb3VuZHMpIHtcbiAgICB0aGlzLm1pblRpY2sgPSBjaGFydEJvdW5kcy50c21pbjtcbiAgICB0aGlzLm1heFRpY2sgPSBjaGFydEJvdW5kcy50c21heDtcbiAgICB0aGlzLl9vcHRpb25zLmJvdW5kcyA9IHRoaXMuX29wdGlvbnMuYm91bmRzIHx8IHt9O1xuICAgIHRoaXMuX29wdGlvbnMuYm91bmRzLm1pbkRhdGUgPSB0aGlzLm1pblRpY2s7XG4gICAgdGhpcy5fb3B0aW9ucy5ib3VuZHMubWF4RGF0ZSA9IHRoaXMubWF4VGljaztcbiAgICBjb25zdCB4ID0ge1xuICAgICAgdGljazA6IHVuZGVmaW5lZCxcbiAgICAgIHJhbmdlOiBbXVxuICAgIH07XG4gICAgaWYgKHRoaXMuX29wdGlvbnMudGltZU1vZGUgJiYgdGhpcy5fb3B0aW9ucy50aW1lTW9kZSA9PT0gJ3RpbWVzdGFtcCcpIHtcbiAgICAgIHgudGljazAgPSB0aGlzLm1pblRpY2sgLyB0aGlzLmRpdmlkZXI7XG4gICAgICB4LnJhbmdlID0gW3RoaXMubWluVGljayAvIHRoaXMuZGl2aWRlciwgdGhpcy5tYXhUaWNrIC8gdGhpcy5kaXZpZGVyXTtcbiAgICB9IGVsc2Uge1xuICAgICAgeC50aWNrMCA9IG1vbWVudC50eih0aGlzLm1pblRpY2sgLyB0aGlzLmRpdmlkZXIsIHRoaXMuX29wdGlvbnMudGltZVpvbmUpLnRvSVNPU3RyaW5nKHRydWUpO1xuICAgICAgeC5yYW5nZSA9IFtcbiAgICAgICAgbW9tZW50LnR6KHRoaXMubWluVGljayAvIHRoaXMuZGl2aWRlciwgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSkudG9JU09TdHJpbmcodHJ1ZSksXG4gICAgICAgIG1vbWVudC50eih0aGlzLm1heFRpY2sgLyB0aGlzLmRpdmlkZXIsIHRoaXMuX29wdGlvbnMudGltZVpvbmUpLnRvSVNPU3RyaW5nKHRydWUpXG4gICAgICBdO1xuICAgIH1cbiAgICB0aGlzLmxheW91dC54YXhpcyA9IHg7XG4gICAgdGhpcy5sYXlvdXQgPSB7Li4udGhpcy5sYXlvdXR9O1xuICB9XG59XG4iXX0=