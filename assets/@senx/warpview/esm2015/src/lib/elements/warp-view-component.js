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
import { ChartLib } from '../utils/chart-lib';
import { Param } from '../model/param';
import { GTSLib } from '../utils/gts.lib';
import * as moment from 'moment-timezone';
import { ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import deepEqual from 'deep-equal';
import { PlotlyComponent } from '../plotly/plotly.component';
/**
 * @abstract
 */
export class WarpViewComponent {
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
        moment.tz.setDefault(this._options.timeZone);
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
                    moment.tz(dataModel.bounds.xmin / this.divider, this._options.timeZone).toISOString(true),
                    moment.tz(dataModel.bounds.xmax / this.divider, this._options.timeZone).toISOString(true)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LWNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzZW54L3dhcnB2aWV3LyIsInNvdXJjZXMiOlsic3JjL2xpYi9lbGVtZW50cy93YXJwLXZpZXctY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUM1QyxPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFJckMsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBQ3hDLE9BQU8sS0FBSyxNQUFNLE1BQU0saUJBQWlCLENBQUM7QUFDMUMsT0FBTyxFQUFDLFVBQVUsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFVLE1BQU0sRUFBYSxTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDcEcsT0FBTyxTQUFTLE1BQU0sWUFBWSxDQUFDO0FBRW5DLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSw0QkFBNEIsQ0FBQzs7OztBQUszRCxNQUFNLE9BQWdCLGlCQUFpQjs7Ozs7Ozs7SUF3SXJDLFlBQ1MsRUFBYyxFQUNkLFFBQW1CLEVBQ25CLFdBQXdCLEVBQ3hCLE1BQWM7UUFIZCxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQ2QsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUNuQixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4QixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBdklQLFVBQUssR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDO1FBQzlCLFdBQU0sR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDO1FBMEU3QixjQUFTLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUV6RCxhQUFRLEdBQVUsSUFBSSxLQUFLLEVBQUUsQ0FBQztRQUVwQixlQUFVLEdBQUcsbUJBQUEsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ3ZE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LDJDQUF3RTs7SUFFeEUsa0NBQStDOztJQUMvQyxtQ0FBa0Q7O0lBMEVsRCxzQ0FBeUQ7O0lBRXpELHFDQUE4Qjs7Ozs7SUFDOUIsZ0NBQXNCOzs7OztJQUN0Qix1Q0FXWTs7Ozs7SUFFWixtQ0FBeUI7Ozs7O0lBQ3pCLHdDQUE4Qjs7Ozs7SUFDOUIsd0NBQTZCOzs7OztJQUM3QixrQ0FBcUI7Ozs7O0lBQ3JCLGtDQUEyQjs7Ozs7SUFDM0Isd0NBQTZCOzs7OztJQUM3Qix3Q0FBcUM7Ozs7O0lBQ3JDLG9DQUEwQjs7SUFFMUIsNENBQTBEOztJQUMxRCxvQ0FBZTs7SUFDZixtQ0FBZTs7SUFDZixtQ0FPRTs7SUFDRix5Q0FjRTs7SUFDRix1Q0FBMkI7Ozs7O0lBQzNCLDZDQUFpQzs7Ozs7SUFDakMsaUNBQWtCOztJQUdoQiwrQkFBcUI7O0lBQ3JCLHFDQUEwQjs7SUFDMUIsd0NBQStCOztJQUMvQixtQ0FBcUI7Ozs7Ozs7O0lBd0J2QixxRUFBa0U7Ozs7Ozs7SUFFbEUsMERBQTREIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqICBDb3B5cmlnaHQgMjAyMCAgU2VuWCBTLkEuUy5cbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqL1xuXG5pbXBvcnQge0NoYXJ0TGlifSBmcm9tICcuLi91dGlscy9jaGFydC1saWInO1xuaW1wb3J0IHtQYXJhbX0gZnJvbSAnLi4vbW9kZWwvcGFyYW0nO1xuaW1wb3J0IHtMb2dnZXJ9IGZyb20gJy4uL3V0aWxzL2xvZ2dlcic7XG5pbXBvcnQge0RhdGFNb2RlbH0gZnJvbSAnLi4vbW9kZWwvZGF0YU1vZGVsJztcbmltcG9ydCB7R1RTfSBmcm9tICcuLi9tb2RlbC9HVFMnO1xuaW1wb3J0IHtHVFNMaWJ9IGZyb20gJy4uL3V0aWxzL2d0cy5saWInO1xuaW1wb3J0ICogYXMgbW9tZW50IGZyb20gJ21vbWVudC10aW1lem9uZSc7XG5pbXBvcnQge0VsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE5nWm9uZSwgT3V0cHV0LCBSZW5kZXJlcjIsIFZpZXdDaGlsZH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgZGVlcEVxdWFsIGZyb20gJ2RlZXAtZXF1YWwnO1xuaW1wb3J0IHtTaXplLCBTaXplU2VydmljZX0gZnJvbSAnLi4vc2VydmljZXMvcmVzaXplLnNlcnZpY2UnO1xuaW1wb3J0IHtQbG90bHlDb21wb25lbnR9IGZyb20gJy4uL3Bsb3RseS9wbG90bHkuY29tcG9uZW50JztcbmltcG9ydCB7Q29uZmlnfSBmcm9tICdwbG90bHkuanMnO1xuXG5leHBvcnQgdHlwZSBWaXNpYmlsaXR5U3RhdGUgPSAndW5rbm93bicgfCAnbm90aGluZ1Bsb3R0YWJsZScgfCAncGxvdHRhYmxlc0FsbEhpZGRlbicgfCAncGxvdHRhYmxlU2hvd24nO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgV2FycFZpZXdDb21wb25lbnQge1xuICBAVmlld0NoaWxkKCd0b29sVGlwJywge3N0YXRpYzogdHJ1ZX0pIHRvb2xUaXA6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ2dyYXBoJywge3N0YXRpYzogZmFsc2V9KSBncmFwaDogUGxvdGx5Q29tcG9uZW50O1xuICBAVmlld0NoaWxkKCdjaGFydENvbnRhaW5lcicsIHtzdGF0aWM6IHRydWV9KSBjaGFydENvbnRhaW5lcjogRWxlbWVudFJlZjtcblxuICBASW5wdXQoJ3dpZHRoJykgd2lkdGggPSBDaGFydExpYi5ERUZBVUxUX1dJRFRIO1xuICBASW5wdXQoJ2hlaWdodCcpIGhlaWdodCA9IENoYXJ0TGliLkRFRkFVTFRfSEVJR0hUO1xuXG4gIEBJbnB1dCgnaGlkZGVuRGF0YScpIHNldCBoaWRkZW5EYXRhKGhpZGRlbkRhdGE6IG51bWJlcltdKSB7XG4gICAgdGhpcy5faGlkZGVuRGF0YSA9IGhpZGRlbkRhdGE7XG4gIH1cblxuICBnZXQgaGlkZGVuRGF0YSgpOiBudW1iZXJbXSB7XG4gICAgcmV0dXJuIHRoaXMuX2hpZGRlbkRhdGE7XG4gIH1cblxuICBASW5wdXQoJ3VuaXQnKSBzZXQgdW5pdCh1bml0OiBzdHJpbmcpIHtcbiAgICB0aGlzLl91bml0ID0gdW5pdDtcbiAgICB0aGlzLnVwZGF0ZSh1bmRlZmluZWQsIGZhbHNlKTtcbiAgfVxuXG4gIGdldCB1bml0KCkge1xuICAgIHJldHVybiB0aGlzLl91bml0O1xuICB9XG5cbiAgQElucHV0KCdkZWJ1ZycpIHNldCBkZWJ1ZyhkZWJ1ZzogYm9vbGVhbiB8IHN0cmluZykge1xuICAgIGlmICh0eXBlb2YgZGVidWcgPT09ICdzdHJpbmcnKSB7XG4gICAgICBkZWJ1ZyA9ICd0cnVlJyA9PT0gZGVidWc7XG4gICAgfVxuICAgIHRoaXMuX2RlYnVnID0gZGVidWc7XG4gICAgdGhpcy5MT0cuc2V0RGVidWcoZGVidWcpO1xuICB9XG5cbiAgZ2V0IGRlYnVnKCkge1xuICAgIHJldHVybiB0aGlzLl9kZWJ1ZztcbiAgfVxuXG4gIEBJbnB1dCgnc2hvd0xlZ2VuZCcpIHNldCBzaG93TGVnZW5kKHNob3dMZWdlbmQ6IGJvb2xlYW4gfCBzdHJpbmcpIHtcbiAgICBpZiAodHlwZW9mIHNob3dMZWdlbmQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBzaG93TGVnZW5kID0gJ3RydWUnID09PSBzaG93TGVnZW5kO1xuICAgIH1cbiAgICB0aGlzLl9zaG93TGVnZW5kID0gc2hvd0xlZ2VuZDtcbiAgfVxuXG4gIGdldCBzaG93TGVnZW5kKCkge1xuICAgIHJldHVybiB0aGlzLl9zaG93TGVnZW5kO1xuICB9XG5cbiAgQElucHV0KCdyZXNwb25zaXZlJykgc2V0IHJlc3BvbnNpdmUocmVzcG9uc2l2ZTogYm9vbGVhbiB8IHN0cmluZykge1xuICAgIGlmICh0eXBlb2YgcmVzcG9uc2l2ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJlc3BvbnNpdmUgPSAndHJ1ZScgPT09IHJlc3BvbnNpdmU7XG4gICAgfVxuICAgIHRoaXMuX3Jlc3BvbnNpdmUgPSByZXNwb25zaXZlO1xuICB9XG5cbiAgZ2V0IHJlc3BvbnNpdmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Jlc3BvbnNpdmU7XG4gIH1cblxuICBASW5wdXQoJ29wdGlvbnMnKSBzZXQgb3B0aW9ucyhvcHRpb25zOiBQYXJhbSB8IHN0cmluZykge1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnb25PcHRpb25zJ10sIG9wdGlvbnMpO1xuICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIG9wdGlvbnMgPSBKU09OLnBhcnNlKG9wdGlvbnMpO1xuICAgIH1cbiAgICBpZiAoIWRlZXBFcXVhbChvcHRpb25zLCB0aGlzLl9vcHRpb25zKSkge1xuICAgICAgdGhpcy5MT0cuZGVidWcoWydvbk9wdGlvbnMnLCAnY2hhbmdlZCddLCBvcHRpb25zKTtcbiAgICAgIHRoaXMuX29wdGlvbnMgPSBDaGFydExpYi5tZXJnZURlZXAodGhpcy5fb3B0aW9ucywgb3B0aW9ucyBhcyBQYXJhbSkgYXMgUGFyYW07XG4gICAgICB0aGlzLnVwZGF0ZSh0aGlzLl9vcHRpb25zLCBmYWxzZSk7XG4gICAgfVxuICB9XG5cbiAgQElucHV0KCdkYXRhJykgc2V0IGRhdGEoZGF0YTogRGF0YU1vZGVsIHwgR1RTW10gfCBzdHJpbmcpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ29uRGF0YSddLCBkYXRhKTtcbiAgICBpZiAoZGF0YSkge1xuICAgICAgdGhpcy5fZGF0YSA9IEdUU0xpYi5nZXREYXRhKGRhdGEpO1xuICAgICAgdGhpcy51cGRhdGUodGhpcy5fb3B0aW9ucywgdHJ1ZSk7XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ29uRGF0YSddLCB0aGlzLl9kYXRhKTtcbiAgICB9XG4gIH1cblxuICBAT3V0cHV0KCdjaGFydERyYXcnKSBjaGFydERyYXcgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBfb3B0aW9uczogUGFyYW0gPSBuZXcgUGFyYW0oKTtcbiAgcHJvdGVjdGVkIExPRzogTG9nZ2VyO1xuICBwcm90ZWN0ZWQgZGVmT3B0aW9ucyA9IENoYXJ0TGliLm1lcmdlRGVlcCh0aGlzLl9vcHRpb25zLCB7XG4gICAgZG90c0xpbWl0OiAxMDAwLFxuICAgIGhlYXRDb250cm9sczogZmFsc2UsXG4gICAgdGltZU1vZGU6ICdkYXRlJyxcbiAgICBzaG93UmFuZ2VTZWxlY3RvcjogdHJ1ZSxcbiAgICBncmlkTGluZUNvbG9yOiAnIzhlOGU4ZScsXG4gICAgc2hvd0RvdHM6IGZhbHNlLFxuICAgIHRpbWVab25lOiAnVVRDJyxcbiAgICB0aW1lVW5pdDogJ3VzJyxcbiAgICBzaG93Q29udHJvbHM6IHRydWUsXG4gICAgYm91bmRzOiB7fVxuICB9KSBhcyBQYXJhbTtcblxuICBwcm90ZWN0ZWQgX2RlYnVnID0gZmFsc2U7XG4gIHByb3RlY3RlZCBfc2hvd0xlZ2VuZCA9IGZhbHNlO1xuICBwcm90ZWN0ZWQgX3Jlc3BvbnNpdmUgPSB0cnVlO1xuICBwcm90ZWN0ZWQgX3VuaXQgPSAnJztcbiAgcHJvdGVjdGVkIF9kYXRhOiBEYXRhTW9kZWw7XG4gIHByb3RlY3RlZCBfYXV0b1Jlc2l6ZSA9IHRydWU7XG4gIHByb3RlY3RlZCBfaGlkZGVuRGF0YTogbnVtYmVyW10gPSBbXTtcbiAgcHJvdGVjdGVkIGRpdmlkZXI6IG51bWJlcjtcblxuICB0b29sdGlwUG9zaXRpb246IGFueSA9IHt0b3A6ICctMTAwMDBweCcsIGxlZnQ6ICctMTAwMHB4J307XG4gIGxvYWRpbmcgPSB0cnVlO1xuICBub0RhdGEgPSBmYWxzZTtcbiAgbGF5b3V0OiBQYXJ0aWFsPGFueT4gPSB7XG4gICAgbWFyZ2luOiB7XG4gICAgICB0OiAxMCxcbiAgICAgIGI6IDI1LFxuICAgICAgcjogMTAsXG4gICAgICBsOiAxMFxuICAgIH1cbiAgfTtcbiAgcGxvdGx5Q29uZmlnOiBQYXJ0aWFsPENvbmZpZz4gPSB7XG4gICAgcmVzcG9uc2l2ZTogdHJ1ZSxcbiAgICBzaG93QXhpc0RyYWdIYW5kbGVzOiB0cnVlLFxuICAgIHNjcm9sbFpvb206IHRydWUsXG4gICAgZG91YmxlQ2xpY2s6ICdyZXNldCthdXRvc2l6ZScsXG4gICAgc2hvd1RpcHM6IHRydWUsXG4gICAgcGxvdEdsUGl4ZWxSYXRpbzogMSxcbiAgICBzdGF0aWNQbG90OiBmYWxzZSxcbiAgICBkaXNwbGF5bG9nbzogZmFsc2UsXG4gICAgbW9kZUJhckJ1dHRvbnNUb1JlbW92ZTogW1xuICAgICAgJ2xhc3NvMmQnLCAnc2VsZWN0MmQnLCAndG9nZ2xlU3Bpa2VsaW5lcycsICd0b2dnbGVIb3ZlcicsICdob3ZlckNsb3Nlc3QzZCcsICdhdXRvU2NhbGUyZCcsXG4gICAgICAnaG92ZXJDbG9zZXN0R2VvJywgJ2hvdmVyQ2xvc2VzdEdsMmQnLCAnaG92ZXJDbG9zZXN0UGllJywgJ3RvZ2dsZUhvdmVyJyxcbiAgICAgICdob3ZlckNsb3Nlc3RDYXJ0ZXNpYW4nLCAnaG92ZXJDb21wYXJlQ2FydGVzaWFuJ1xuICAgIF1cbiAgfTtcbiAgcGxvdGx5RGF0YTogUGFydGlhbDxhbnk+W107XG4gIHByaXZhdGUgaGlkZVRvb2x0aXBUaW1lcjogbnVtYmVyO1xuICBwcml2YXRlIHJlY3Q6IGFueTtcblxuICBwcm90ZWN0ZWQgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGVsOiBFbGVtZW50UmVmLFxuICAgIHB1YmxpYyByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHB1YmxpYyBzaXplU2VydmljZTogU2l6ZVNlcnZpY2UsXG4gICAgcHVibGljIG5nWm9uZTogTmdab25lXG4gICkge1xuICAgIHRoaXMuc2l6ZVNlcnZpY2Uuc2l6ZUNoYW5nZWQkLnN1YnNjcmliZSgoc2l6ZTogU2l6ZSkgPT4ge1xuICAgICAgaWYgKChlbC5uYXRpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50KS5wYXJlbnRFbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IHBhcmVudFNpemUgPSAoZWwubmF0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudCkucGFyZW50RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgaWYgKHRoaXMuX3Jlc3BvbnNpdmUpIHtcbiAgICAgICAgICB0aGlzLmhlaWdodCA9IHBhcmVudFNpemUuaGVpZ2h0O1xuICAgICAgICAgIHRoaXMud2lkdGggPSBwYXJlbnRTaXplLndpZHRoO1xuICAgICAgICB9XG4gICAgICAgIGlmICghIXRoaXMuZ3JhcGggJiYgdGhpcy5fcmVzcG9uc2l2ZSAmJiBwYXJlbnRTaXplLmhlaWdodCA+IDApIHtcbiAgICAgICAgICBjb25zdCBsYXlvdXQgPSB7XG4gICAgICAgICAgICB3aWR0aDogcGFyZW50U2l6ZS53aWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5fYXV0b1Jlc2l6ZSA/IHBhcmVudFNpemUuaGVpZ2h0IDogdGhpcy5sYXlvdXQuaGVpZ2h0XG4gICAgICAgICAgfTtcbiAgICAgICAgICBpZiAodGhpcy5sYXlvdXQud2lkdGggIT09IGxheW91dC53aWR0aCB8fCB0aGlzLmxheW91dC5oZWlnaHQgIT09IGxheW91dC5oZWlnaHQpIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5sYXlvdXQgPSB7Li4udGhpcy5sYXlvdXQsIC4uLmxheW91dH0pO1xuICAgICAgICAgICAgdGhpcy5MT0cuZGVidWcoWydzaXplQ2hhbmdlZCQnXSwgdGhpcy5sYXlvdXQud2lkdGgsIHRoaXMubGF5b3V0LmhlaWdodCk7XG4gICAgICAgICAgICB0aGlzLmdyYXBoLnVwZGF0ZVBsb3QoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBhYnN0cmFjdCB1cGRhdGUob3B0aW9uczogUGFyYW0sIHJlZnJlc2g6IGJvb2xlYW4pOiB2b2lkO1xuXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBjb252ZXJ0KGRhdGE6IERhdGFNb2RlbCk6IFBhcnRpYWw8YW55PltdO1xuXG4gIHByb3RlY3RlZCBsZWdlbmRGb3JtYXR0ZXIoeCwgc2VyaWVzLCBoaWdobGlnaHRlZCA9IC0xKTogc3RyaW5nIHtcbiAgICBjb25zdCBkaXNwbGF5ZWRDdXJ2ZXMgPSBbXTtcbiAgICBpZiAoeCA9PT0gbnVsbCkge1xuICAgICAgLy8gVGhpcyBoYXBwZW5zIHdoZW4gdGhlcmUncyBubyBzZWxlY3Rpb24gYW5kIHtsZWdlbmQ6ICdhbHdheXMnfSBpcyBzZXQuXG4gICAgICByZXR1cm4gYDxicj5cbiAgICAgICR7c2VyaWVzLm1hcChzID0+IHtcbiAgICAgICAgLy8gRklYTUUgOiAgaWYgKCFzLmlzVmlzaWJsZSkgcmV0dXJuO1xuICAgICAgICBsZXQgbGFiZWxlZERhdGEgPSBHVFNMaWIuZm9ybWF0TGFiZWwocy5kYXRhLnRleHQgfHwgJycpICsgJzogJyArICgodGhpcy5fb3B0aW9ucy5ob3Jpem9udGFsID8gcy54IDogcy55KSB8fCBzLnIgfHwgJycpO1xuICAgICAgICBsZXQgY29sb3IgPSBzLmRhdGEubGluZS5jb2xvcjtcbiAgICAgICAgaWYgKCEhcy5kYXRhLm1hcmtlcikge1xuICAgICAgICAgIGlmIChHVFNMaWIuaXNBcnJheShzLmRhdGEubWFya2VyLmNvbG9yKSkge1xuICAgICAgICAgICAgY29sb3IgPSBzLmRhdGEubWFya2VyLmNvbG9yWzBdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb2xvciA9IHMuZGF0YS5tYXJrZXIuY29sb3I7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChzLmN1cnZlTnVtYmVyID09PSBoaWdobGlnaHRlZCkge1xuICAgICAgICAgIGxhYmVsZWREYXRhID0gYDxpIGNsYXNzPVwiY2hpcFwiXG4gICAgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOiAke2NvbG9yfTtib3JkZXI6IDJweCBzb2xpZCAke2NvbG9yfTtcIj48L2k+ICR7bGFiZWxlZERhdGF9YDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbGFiZWxlZERhdGE7XG4gICAgICB9KS5qb2luKCc8YnI+Jyl9YDtcbiAgICB9XG5cbiAgICBsZXQgaHRtbCA9ICcnO1xuICAgIGlmICghIXNlcmllc1swXSkge1xuICAgICAgeCA9IHNlcmllc1swXS54IHx8IHNlcmllc1swXS50aGV0YTtcbiAgICB9XG4gICAgaHRtbCArPSBgPGI+JHt4fTwvYj48YnIgLz5gO1xuICAgIC8vIHB1dCB0aGUgaGlnaGxpZ2h0ZWQgb25lKHM/KSBmaXJzdCwga2VlcCBvbmx5IHZpc2libGVzLCBrZWVwIG9ubHkgNTAgZmlyc3Qgb25lcy5cbiAgICBzZXJpZXMgPSBzZXJpZXMuc29ydCgoc2EsIHNiKSA9PiAoc2EuY3VydmVOdW1iZXIgPT09IGhpZ2hsaWdodGVkKSA/IC0xIDogMSk7XG4gICAgc2VyaWVzXG4gICAgICAvLyAuZmlsdGVyKHMgPT4gcy5pc1Zpc2libGUgJiYgcy55SFRNTClcbiAgICAgIC5zbGljZSgwLCA1MClcbiAgICAgIC5mb3JFYWNoKChzLCBpKSA9PiB7XG4gICAgICAgIGlmIChkaXNwbGF5ZWRDdXJ2ZXMuaW5kZXhPZihzLmN1cnZlTnVtYmVyKSA8PSAtMSkge1xuICAgICAgICAgIGRpc3BsYXllZEN1cnZlcy5wdXNoKHMuY3VydmVOdW1iZXIpO1xuICAgICAgICAgIGxldCB2YWx1ZSA9IHNlcmllc1swXS5kYXRhLm9yaWVudGF0aW9uID09PSAnaCcgPyBzLnggOiBzLnk7XG4gICAgICAgICAgaWYgKCF2YWx1ZSAmJiB2YWx1ZSAhPT0gMCkge1xuICAgICAgICAgICAgdmFsdWUgPSBzLnI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGxldCBsYWJlbGVkRGF0YSA9IEdUU0xpYi5mb3JtYXRMYWJlbChzLmRhdGEudGV4dCB8fCAnJykgKyAnOiAnICsgdmFsdWU7XG4gICAgICAgICAgaWYgKHMuY3VydmVOdW1iZXIgPT09IGhpZ2hsaWdodGVkKSB7XG4gICAgICAgICAgICBsYWJlbGVkRGF0YSA9IGA8Yj4ke2xhYmVsZWREYXRhfTwvYj5gO1xuICAgICAgICAgIH1cbiAgICAgICAgICBsZXQgY29sb3IgPSBzLmRhdGEubGluZSA/IHMuZGF0YS5saW5lLmNvbG9yIDogJyc7XG4gICAgICAgICAgaWYgKCEhcy5kYXRhLm1hcmtlcikge1xuICAgICAgICAgICAgaWYgKEdUU0xpYi5pc0FycmF5KHMuZGF0YS5tYXJrZXIuY29sb3IpKSB7XG4gICAgICAgICAgICAgIGNvbG9yID0gcy5kYXRhLm1hcmtlci5jb2xvclswXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbG9yID0gcy5kYXRhLm1hcmtlci5jb2xvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaHRtbCArPSBgPGkgY2xhc3M9XCJjaGlwXCIgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOiAke2NvbG9yfTtib3JkZXI6IDJweCBzb2xpZCAke2NvbG9yfTtcIj48L2k+Jm5ic3A7JHtsYWJlbGVkRGF0YX1gO1xuICAgICAgICAgIGlmIChpIDwgc2VyaWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgaHRtbCArPSAnPGJyPic7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICByZXR1cm4gaHRtbDtcbiAgfVxuXG4gIHByb3RlY3RlZCBpbml0Q2hhcnQoZWw6IEVsZW1lbnRSZWYpOiBib29sZWFuIHtcbiAgICB0aGlzLm5vRGF0YSA9IGZhbHNlO1xuICAgIGNvbnN0IHBhcmVudFNpemUgPSAoZWwubmF0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudCkucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGlmICh0aGlzLl9yZXNwb25zaXZlKSB7XG4gICAgICB0aGlzLmhlaWdodCA9IHBhcmVudFNpemUuaGVpZ2h0O1xuICAgICAgdGhpcy53aWR0aCA9IHBhcmVudFNpemUud2lkdGg7XG4gICAgfVxuICAgIHRoaXMuTE9HLmRlYnVnKFsnaW5pdGlDaGFydCcsICd0aGlzLl9kYXRhJ10sIHRoaXMuX2RhdGEsIHRoaXMuX29wdGlvbnMpO1xuICAgIGlmICghdGhpcy5fZGF0YSB8fCAhdGhpcy5fZGF0YS5kYXRhIHx8IHRoaXMuX2RhdGEuZGF0YS5sZW5ndGggPT09IDAgfHwgIXRoaXMuX29wdGlvbnMpIHtcbiAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgICAgdGhpcy5MT0cuZGVidWcoWydpbml0aUNoYXJ0JywgJ25vZGF0YSddKTtcbiAgICAgIHRoaXMubm9EYXRhID0gdHJ1ZTtcbiAgICAgIHRoaXMuY2hhcnREcmF3LmVtaXQoKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgbW9tZW50LnR6LnNldERlZmF1bHQodGhpcy5fb3B0aW9ucy50aW1lWm9uZSk7XG4gICAgdGhpcy5sb2FkaW5nID0gdHJ1ZTtcbiAgICB0aGlzLl9vcHRpb25zID0gQ2hhcnRMaWIubWVyZ2VEZWVwKHRoaXMuZGVmT3B0aW9ucywgdGhpcy5fb3B0aW9ucyB8fCB7fSkgYXMgUGFyYW07XG4gICAgY29uc3QgZGF0YU1vZGVsID0gdGhpcy5fZGF0YTtcbiAgICB0aGlzLl9vcHRpb25zID0gQ2hhcnRMaWIubWVyZ2VEZWVwKHRoaXMuX29wdGlvbnMgfHwge30sIHRoaXMuX2RhdGEuZ2xvYmFsUGFyYW1zKSBhcyBQYXJhbTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2luaXRpQ2hhcnQnLCAndGhpcy5fb3B0aW9ucyddLCB0aGlzLl9vcHRpb25zKTtcbiAgICB0aGlzLl9vcHRpb25zLnRpbWVNb2RlID0gdGhpcy5fb3B0aW9ucy50aW1lTW9kZSB8fCAnZGF0ZSc7XG4gICAgdGhpcy5kaXZpZGVyID0gR1RTTGliLmdldERpdmlkZXIodGhpcy5fb3B0aW9ucy50aW1lVW5pdCk7XG4gICAgdGhpcy5wbG90bHlEYXRhID0gdGhpcy5jb252ZXJ0KGRhdGFNb2RlbCk7XG4gICAgdGhpcy5wbG90bHlDb25maWcucmVzcG9uc2l2ZSA9IHRoaXMuX3Jlc3BvbnNpdmU7XG4gICAgdGhpcy5sYXlvdXQucGFwZXJfYmdjb2xvciA9ICdyZ2JhKDAsMCwwLDApJztcbiAgICB0aGlzLmxheW91dC5wbG90X2JnY29sb3IgPSAncmdiYSgwLDAsMCwwKSc7XG4gICAgaWYgKCF0aGlzLl9yZXNwb25zaXZlKSB7XG4gICAgICB0aGlzLmxheW91dC53aWR0aCA9IHRoaXMud2lkdGggfHwgQ2hhcnRMaWIuREVGQVVMVF9XSURUSDtcbiAgICAgIHRoaXMubGF5b3V0LmhlaWdodCA9IHRoaXMuaGVpZ2h0IHx8IENoYXJ0TGliLkRFRkFVTFRfSEVJR0hUO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxheW91dC53aWR0aCA9IHBhcmVudFNpemUud2lkdGg7XG4gICAgICB0aGlzLmxheW91dC5oZWlnaHQgPSBwYXJlbnRTaXplLmhlaWdodDtcbiAgICB9XG4gICAgdGhpcy5MT0cuZGVidWcoWydpbml0Q2hhcnQnLCAnaW5pdFNpemUnXSwgdGhpcy5sYXlvdXQud2lkdGgsIHRoaXMubGF5b3V0LmhlaWdodCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgIGlmICh0aGlzLl9vcHRpb25zLmJvdW5kcyAmJiB0aGlzLl9vcHRpb25zLmJvdW5kcy5taW5EYXRlICYmIHRoaXMuX29wdGlvbnMuYm91bmRzLm1heERhdGUpIHtcbiAgICAgIGRhdGFNb2RlbC5ib3VuZHMgPSB7XG4gICAgICAgIHhtaW46IE1hdGguZmxvb3IodGhpcy5fb3B0aW9ucy5ib3VuZHMubWluRGF0ZSksXG4gICAgICAgIHhtYXg6IE1hdGguY2VpbCh0aGlzLl9vcHRpb25zLmJvdW5kcy5tYXhEYXRlKSxcbiAgICAgICAgeW1pbjogdGhpcy5fb3B0aW9ucy5ib3VuZHMueVJhbmdlcyAmJiB0aGlzLl9vcHRpb25zLmJvdW5kcy55UmFuZ2VzLmxlbmd0aCA+IDBcbiAgICAgICAgICA/IE1hdGguZmxvb3IodGhpcy5fb3B0aW9ucy5ib3VuZHMueVJhbmdlc1swXSlcbiAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgeW1heDogdGhpcy5fb3B0aW9ucy5ib3VuZHMueVJhbmdlcyAmJiB0aGlzLl9vcHRpb25zLmJvdW5kcy55UmFuZ2VzLmxlbmd0aCA+IDFcbiAgICAgICAgICA/IE1hdGguY2VpbCh0aGlzLl9vcHRpb25zLmJvdW5kcy55UmFuZ2VzWzFdKVxuICAgICAgICAgIDogdW5kZWZpbmVkXG4gICAgICB9O1xuICAgICAgdGhpcy5MT0cuZGVidWcoWydpbml0Q2hhcnQnLCAndXBkYXRlQm91bmRzJ10sIGRhdGFNb2RlbC5ib3VuZHMueG1pbiwgZGF0YU1vZGVsLmJvdW5kcy54bWF4KTtcbiAgICAgIGlmICh0aGlzLl9vcHRpb25zLnRpbWVNb2RlICYmIHRoaXMuX29wdGlvbnMudGltZU1vZGUgPT09ICd0aW1lc3RhbXAnKSB7XG4gICAgICAgIHRoaXMubGF5b3V0LnhheGlzLnJhbmdlID0gW2RhdGFNb2RlbC5ib3VuZHMueG1pbiwgZGF0YU1vZGVsLmJvdW5kcy54bWF4XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubGF5b3V0LnhheGlzLnJhbmdlID0gW1xuICAgICAgICAgIG1vbWVudC50eihkYXRhTW9kZWwuYm91bmRzLnhtaW4gLyB0aGlzLmRpdmlkZXIsIHRoaXMuX29wdGlvbnMudGltZVpvbmUpLnRvSVNPU3RyaW5nKHRydWUpLFxuICAgICAgICAgIG1vbWVudC50eihkYXRhTW9kZWwuYm91bmRzLnhtYXggLyB0aGlzLmRpdmlkZXIsIHRoaXMuX29wdGlvbnMudGltZVpvbmUpLnRvSVNPU3RyaW5nKHRydWUpXTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5MT0cuZGVidWcoWydpbml0aUNoYXJ0JywgJ3Bsb3RseURhdGEnXSwgdGhpcy5wbG90bHlEYXRhKTtcbiAgICBpZiAoIXRoaXMucGxvdGx5RGF0YSB8fCB0aGlzLnBsb3RseURhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMuY2hhcnREcmF3LmVtaXQoKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuICEoIXRoaXMucGxvdGx5RGF0YSB8fCB0aGlzLnBsb3RseURhdGEubGVuZ3RoID09PSAwKTtcbiAgfVxuXG4gIGFmdGVyUGxvdChwbG90bHlJbnN0YW5jZT86IGFueSkge1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnYWZ0ZXJQbG90JywgJ3Bsb3RseUluc3RhbmNlJ10sIHBsb3RseUluc3RhbmNlKTtcbiAgICB0aGlzLmNoYXJ0RHJhdy5lbWl0KCk7XG4gICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgdGhpcy5yZWN0ID0gdGhpcy5ncmFwaC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgfVxuXG4gIGhpZGVUb29sdGlwKCkge1xuICAgIGlmICghIXRoaXMuaGlkZVRvb2x0aXBUaW1lcikge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuaGlkZVRvb2x0aXBUaW1lcik7XG4gICAgfVxuICAgIHRoaXMuaGlkZVRvb2x0aXBUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy50b29sVGlwLm5hdGl2ZUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB9LCAxMDAwKTtcbiAgfVxuXG4gIHVuaG92ZXIoZGF0YT86IGFueSwgcG9pbnQ/OiBhbnkpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3VuaG92ZXInXSwgZGF0YSk7XG4gICAgaWYgKCEhdGhpcy5oaWRlVG9vbHRpcFRpbWVyKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5oaWRlVG9vbHRpcFRpbWVyKTtcbiAgICB9XG4gIH1cblxuICBob3ZlcihkYXRhOiBhbnksIHBvaW50PzogYW55KSB7XG4gICAgdGhpcy5MT0cuZGVidWcoWydob3ZlciddLCBkYXRhKTtcbiAgICB0aGlzLnRvb2xUaXAubmF0aXZlRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICBpZiAoISF0aGlzLmhpZGVUb29sdGlwVGltZXIpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLmhpZGVUb29sdGlwVGltZXIpO1xuICAgIH1cbiAgICBsZXQgZGVsdGEgPSBOdW1iZXIuTUFYX1ZBTFVFO1xuICAgIGNvbnN0IGN1cnZlcyA9IFtdO1xuICAgIGlmICghcG9pbnQpIHtcbiAgICAgIGlmIChkYXRhLnBvaW50c1swXSAmJiBkYXRhLnBvaW50c1swXS5kYXRhLm9yaWVudGF0aW9uICE9PSAnaCcpIHtcbiAgICAgICAgY29uc3QgeSA9IChkYXRhLnl2YWxzIHx8IFsnJ10pWzBdO1xuICAgICAgICBkYXRhLnBvaW50cy5mb3JFYWNoKHAgPT4ge1xuICAgICAgICAgIGN1cnZlcy5wdXNoKHAuY3VydmVOdW1iZXIpO1xuICAgICAgICAgIGNvbnN0IGQgPSBNYXRoLmFicygocC55IHx8IHAucikgLSB5KTtcbiAgICAgICAgICBpZiAoZCA8IGRlbHRhKSB7XG4gICAgICAgICAgICBkZWx0YSA9IGQ7XG4gICAgICAgICAgICBwb2ludCA9IHA7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHg6IG51bWJlciA9IChkYXRhLnh2YWxzIHx8IFsnJ10pWzBdO1xuICAgICAgICBkYXRhLnBvaW50cy5mb3JFYWNoKHAgPT4ge1xuICAgICAgICAgIGN1cnZlcy5wdXNoKHAuY3VydmVOdW1iZXIpO1xuICAgICAgICAgIGNvbnN0IGQgPSBNYXRoLmFicygocC54IHx8IHAucikgLSB4KTtcbiAgICAgICAgICBpZiAoZCA8IGRlbHRhKSB7XG4gICAgICAgICAgICBkZWx0YSA9IGQ7XG4gICAgICAgICAgICBwb2ludCA9IHA7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHBvaW50KSB7XG4gICAgICBjb25zdCBjb250ZW50ID0gdGhpcy5sZWdlbmRGb3JtYXR0ZXIoXG4gICAgICAgIHRoaXMuX29wdGlvbnMuaG9yaXpvbnRhbCA/XG4gICAgICAgICAgKGRhdGEueXZhbHMgfHwgWycnXSlbMF0gOlxuICAgICAgICAgIChkYXRhLnh2YWxzIHx8IFsnJ10pWzBdXG4gICAgICAgICwgZGF0YS5wb2ludHMsIHBvaW50LmN1cnZlTnVtYmVyKTtcbiAgICAgIGxldCBsZWZ0ID0gKGRhdGEuZXZlbnQub2Zmc2V0WCArIDIwKSArICdweCc7XG4gICAgICBpZiAoZGF0YS5ldmVudC5vZmZzZXRYID4gdGhpcy5jaGFydENvbnRhaW5lci5uYXRpdmVFbGVtZW50LmNsaWVudFdpZHRoIC8gMikge1xuICAgICAgICBsZWZ0ID0gTWF0aC5tYXgoMCwgZGF0YS5ldmVudC5vZmZzZXRYIC0gdGhpcy50b29sVGlwLm5hdGl2ZUVsZW1lbnQuY2xpZW50V2lkdGggLSAyMCkgKyAncHgnO1xuICAgICAgfVxuICAgICAgY29uc3QgdG9wID0gTWF0aC5taW4oXG4gICAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgLSB0aGlzLnRvb2xUaXAubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgLSAyMCxcbiAgICAgICAgZGF0YS5ldmVudC55IC0gMjAgLSB0aGlzLnJlY3QudG9wKSArICdweCc7XG4gICAgICB0aGlzLm1vdmVUb29sdGlwKHRvcCwgbGVmdCwgY29udGVudCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0VG9vbHRpcFBvc2l0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICB0b3A6IHRoaXMudG9vbHRpcFBvc2l0aW9uLnRvcCxcbiAgICAgIGxlZnQ6IHRoaXMudG9vbHRpcFBvc2l0aW9uLmxlZnQsXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgbW92ZVRvb2x0aXAodG9wLCBsZWZ0LCBjb250ZW50KSB7XG4gICAgdGhpcy50b29sdGlwUG9zaXRpb24gPSB7dG9wLCBsZWZ0fTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFByb3BlcnR5KHRoaXMudG9vbFRpcC5uYXRpdmVFbGVtZW50LCAnaW5uZXJIVE1MJywgY29udGVudCk7XG4gIH1cblxuICByZWxheW91dCgkZXZlbnQ6IGFueSkge1xuXG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0TGFiZWxDb2xvcihlbDogSFRNTEVsZW1lbnQpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRDU1NDb2xvcihlbCwgJy0td2FycC12aWV3LWNoYXJ0LWxhYmVsLWNvbG9yJywgJyM4ZThlOGUnKS50cmltKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0R3JpZENvbG9yKGVsOiBIVE1MRWxlbWVudCkge1xuICAgIHJldHVybiB0aGlzLmdldENTU0NvbG9yKGVsLCAnLS13YXJwLXZpZXctY2hhcnQtZ3JpZC1jb2xvcicsICcjOGU4ZThlJykudHJpbSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldENTU0NvbG9yKGVsOiBIVE1MRWxlbWVudCwgcHJvcGVydHk6IHN0cmluZywgZGVmQ29sb3I6IHN0cmluZykge1xuICAgIGNvbnN0IGNvbG9yID0gZ2V0Q29tcHV0ZWRTdHlsZShlbCkuZ2V0UHJvcGVydHlWYWx1ZShwcm9wZXJ0eSkudHJpbSgpO1xuICAgIHJldHVybiBjb2xvciA9PT0gJycgPyBkZWZDb2xvciA6IGNvbG9yO1xuICB9XG59XG4iXX0=