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
                        function () { return _this.layout = tslib_1.__assign({}, _this.layout, layout_1); }));
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
        moment.tz.setDefault(this._options.timeZone);
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
export { WarpViewComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LWNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzZW54L3dhcnB2aWV3LyIsInNvdXJjZXMiOlsic3JjL2xpYi9lbGVtZW50cy93YXJwLXZpZXctY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDNUMsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBSXJDLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUN4QyxPQUFPLEtBQUssTUFBTSxNQUFNLGlCQUFpQixDQUFDO0FBQzFDLE9BQU8sRUFBQyxVQUFVLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBVSxNQUFNLEVBQWEsU0FBUyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3BHLE9BQU8sU0FBUyxNQUFNLFlBQVksQ0FBQztBQUVuQyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sNEJBQTRCLENBQUM7Ozs7QUFLM0Q7SUF3SUUsMkJBQ1MsRUFBYyxFQUNkLFFBQW1CLEVBQ25CLFdBQXdCLEVBQ3hCLE1BQWM7UUFKdkIsaUJBMEJDO1FBekJRLE9BQUUsR0FBRixFQUFFLENBQVk7UUFDZCxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ25CLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLFdBQU0sR0FBTixNQUFNLENBQVE7UUF2SVAsVUFBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUM7UUFDOUIsV0FBTSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUM7UUEwRTdCLGNBQVMsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBRXpELGFBQVEsR0FBVSxJQUFJLEtBQUssRUFBRSxDQUFDO1FBRXBCLGVBQVUsR0FBRyxtQkFBQSxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDdkQsU0FBUyxFQUFF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QUMsWUFBWTt1QkFRbEIsS0FBSyxTQUFDLE1BQU07d0JBU1osS0FBSyxTQUFDLE9BQU87NkJBWWIsS0FBSyxTQUFDLFlBQVk7NkJBV2xCLEtBQUssU0FBQyxZQUFZOzBCQVdsQixLQUFLLFNBQUMsU0FBUzt1QkFZZixLQUFLLFNBQUMsTUFBTTs0QkFTWixNQUFNLFNBQUMsV0FBVzs7SUF5VHJCLHdCQUFDO0NBQUEsQUF6WUQsSUF5WUM7U0F6WXFCLGlCQUFpQjs7O0lBQ3JDLG9DQUEwRDs7SUFDMUQsa0NBQTREOztJQUM1RCwyQ0FBd0U7O0lBRXhFLGtDQUErQzs7SUFDL0MsbUNBQWtEOztJQTBFbEQsc0NBQXlEOztJQUV6RCxxQ0FBOEI7Ozs7O0lBQzlCLGdDQUFzQjs7Ozs7SUFDdEIsdUNBV1k7Ozs7O0lBRVosbUNBQXlCOzs7OztJQUN6Qix3Q0FBOEI7Ozs7O0lBQzlCLHdDQUE2Qjs7Ozs7SUFDN0Isa0NBQXFCOzs7OztJQUNyQixrQ0FBMkI7Ozs7O0lBQzNCLHdDQUE2Qjs7Ozs7SUFDN0Isd0NBQXFDOzs7OztJQUNyQyxvQ0FBMEI7O0lBRTFCLDRDQUEwRDs7SUFDMUQsb0NBQWU7O0lBQ2YsbUNBQWU7O0lBQ2YsbUNBT0U7O0lBQ0YseUNBY0U7O0lBQ0YsdUNBQTJCOzs7OztJQUMzQiw2Q0FBaUM7Ozs7O0lBQ2pDLGlDQUFrQjs7SUFHaEIsK0JBQXFCOztJQUNyQixxQ0FBMEI7O0lBQzFCLHdDQUErQjs7SUFDL0IsbUNBQXFCOzs7Ozs7OztJQXdCdkIscUVBQWtFOzs7Ozs7O0lBRWxFLDBEQUE0RCIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQ29weXJpZ2h0IDIwMjAgIFNlblggUy5BLlMuXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKi9cblxuaW1wb3J0IHtDaGFydExpYn0gZnJvbSAnLi4vdXRpbHMvY2hhcnQtbGliJztcbmltcG9ydCB7UGFyYW19IGZyb20gJy4uL21vZGVsL3BhcmFtJztcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICcuLi91dGlscy9sb2dnZXInO1xuaW1wb3J0IHtEYXRhTW9kZWx9IGZyb20gJy4uL21vZGVsL2RhdGFNb2RlbCc7XG5pbXBvcnQge0dUU30gZnJvbSAnLi4vbW9kZWwvR1RTJztcbmltcG9ydCB7R1RTTGlifSBmcm9tICcuLi91dGlscy9ndHMubGliJztcbmltcG9ydCAqIGFzIG1vbWVudCBmcm9tICdtb21lbnQtdGltZXpvbmUnO1xuaW1wb3J0IHtFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIElucHV0LCBOZ1pvbmUsIE91dHB1dCwgUmVuZGVyZXIyLCBWaWV3Q2hpbGR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IGRlZXBFcXVhbCBmcm9tICdkZWVwLWVxdWFsJztcbmltcG9ydCB7U2l6ZSwgU2l6ZVNlcnZpY2V9IGZyb20gJy4uL3NlcnZpY2VzL3Jlc2l6ZS5zZXJ2aWNlJztcbmltcG9ydCB7UGxvdGx5Q29tcG9uZW50fSBmcm9tICcuLi9wbG90bHkvcGxvdGx5LmNvbXBvbmVudCc7XG5pbXBvcnQge0NvbmZpZ30gZnJvbSAncGxvdGx5LmpzJztcblxuZXhwb3J0IHR5cGUgVmlzaWJpbGl0eVN0YXRlID0gJ3Vua25vd24nIHwgJ25vdGhpbmdQbG90dGFibGUnIHwgJ3Bsb3R0YWJsZXNBbGxIaWRkZW4nIHwgJ3Bsb3R0YWJsZVNob3duJztcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFdhcnBWaWV3Q29tcG9uZW50IHtcbiAgQFZpZXdDaGlsZCgndG9vbFRpcCcsIHtzdGF0aWM6IHRydWV9KSB0b29sVGlwOiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCdncmFwaCcsIHtzdGF0aWM6IGZhbHNlfSkgZ3JhcGg6IFBsb3RseUNvbXBvbmVudDtcbiAgQFZpZXdDaGlsZCgnY2hhcnRDb250YWluZXInLCB7c3RhdGljOiB0cnVlfSkgY2hhcnRDb250YWluZXI6IEVsZW1lbnRSZWY7XG5cbiAgQElucHV0KCd3aWR0aCcpIHdpZHRoID0gQ2hhcnRMaWIuREVGQVVMVF9XSURUSDtcbiAgQElucHV0KCdoZWlnaHQnKSBoZWlnaHQgPSBDaGFydExpYi5ERUZBVUxUX0hFSUdIVDtcblxuICBASW5wdXQoJ2hpZGRlbkRhdGEnKSBzZXQgaGlkZGVuRGF0YShoaWRkZW5EYXRhOiBudW1iZXJbXSkge1xuICAgIHRoaXMuX2hpZGRlbkRhdGEgPSBoaWRkZW5EYXRhO1xuICB9XG5cbiAgZ2V0IGhpZGRlbkRhdGEoKTogbnVtYmVyW10ge1xuICAgIHJldHVybiB0aGlzLl9oaWRkZW5EYXRhO1xuICB9XG5cbiAgQElucHV0KCd1bml0Jykgc2V0IHVuaXQodW5pdDogc3RyaW5nKSB7XG4gICAgdGhpcy5fdW5pdCA9IHVuaXQ7XG4gICAgdGhpcy51cGRhdGUodW5kZWZpbmVkLCBmYWxzZSk7XG4gIH1cblxuICBnZXQgdW5pdCgpIHtcbiAgICByZXR1cm4gdGhpcy5fdW5pdDtcbiAgfVxuXG4gIEBJbnB1dCgnZGVidWcnKSBzZXQgZGVidWcoZGVidWc6IGJvb2xlYW4gfCBzdHJpbmcpIHtcbiAgICBpZiAodHlwZW9mIGRlYnVnID09PSAnc3RyaW5nJykge1xuICAgICAgZGVidWcgPSAndHJ1ZScgPT09IGRlYnVnO1xuICAgIH1cbiAgICB0aGlzLl9kZWJ1ZyA9IGRlYnVnO1xuICAgIHRoaXMuTE9HLnNldERlYnVnKGRlYnVnKTtcbiAgfVxuXG4gIGdldCBkZWJ1ZygpIHtcbiAgICByZXR1cm4gdGhpcy5fZGVidWc7XG4gIH1cblxuICBASW5wdXQoJ3Nob3dMZWdlbmQnKSBzZXQgc2hvd0xlZ2VuZChzaG93TGVnZW5kOiBib29sZWFuIHwgc3RyaW5nKSB7XG4gICAgaWYgKHR5cGVvZiBzaG93TGVnZW5kID09PSAnc3RyaW5nJykge1xuICAgICAgc2hvd0xlZ2VuZCA9ICd0cnVlJyA9PT0gc2hvd0xlZ2VuZDtcbiAgICB9XG4gICAgdGhpcy5fc2hvd0xlZ2VuZCA9IHNob3dMZWdlbmQ7XG4gIH1cblxuICBnZXQgc2hvd0xlZ2VuZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fc2hvd0xlZ2VuZDtcbiAgfVxuXG4gIEBJbnB1dCgncmVzcG9uc2l2ZScpIHNldCByZXNwb25zaXZlKHJlc3BvbnNpdmU6IGJvb2xlYW4gfCBzdHJpbmcpIHtcbiAgICBpZiAodHlwZW9mIHJlc3BvbnNpdmUgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXNwb25zaXZlID0gJ3RydWUnID09PSByZXNwb25zaXZlO1xuICAgIH1cbiAgICB0aGlzLl9yZXNwb25zaXZlID0gcmVzcG9uc2l2ZTtcbiAgfVxuXG4gIGdldCByZXNwb25zaXZlKCkge1xuICAgIHJldHVybiB0aGlzLl9yZXNwb25zaXZlO1xuICB9XG5cbiAgQElucHV0KCdvcHRpb25zJykgc2V0IG9wdGlvbnMob3B0aW9uczogUGFyYW0gfCBzdHJpbmcpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ29uT3B0aW9ucyddLCBvcHRpb25zKTtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdzdHJpbmcnKSB7XG4gICAgICBvcHRpb25zID0gSlNPTi5wYXJzZShvcHRpb25zKTtcbiAgICB9XG4gICAgaWYgKCFkZWVwRXF1YWwob3B0aW9ucywgdGhpcy5fb3B0aW9ucykpIHtcbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsnb25PcHRpb25zJywgJ2NoYW5nZWQnXSwgb3B0aW9ucyk7XG4gICAgICB0aGlzLl9vcHRpb25zID0gQ2hhcnRMaWIubWVyZ2VEZWVwKHRoaXMuX29wdGlvbnMsIG9wdGlvbnMgYXMgUGFyYW0pIGFzIFBhcmFtO1xuICAgICAgdGhpcy51cGRhdGUodGhpcy5fb3B0aW9ucywgZmFsc2UpO1xuICAgIH1cbiAgfVxuXG4gIEBJbnB1dCgnZGF0YScpIHNldCBkYXRhKGRhdGE6IERhdGFNb2RlbCB8IEdUU1tdIHwgc3RyaW5nKSB7XG4gICAgdGhpcy5MT0cuZGVidWcoWydvbkRhdGEnXSwgZGF0YSk7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIHRoaXMuX2RhdGEgPSBHVFNMaWIuZ2V0RGF0YShkYXRhKTtcbiAgICAgIHRoaXMudXBkYXRlKHRoaXMuX29wdGlvbnMsIHRydWUpO1xuICAgICAgdGhpcy5MT0cuZGVidWcoWydvbkRhdGEnXSwgdGhpcy5fZGF0YSk7XG4gICAgfVxuICB9XG5cbiAgQE91dHB1dCgnY2hhcnREcmF3JykgY2hhcnREcmF3ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgX29wdGlvbnM6IFBhcmFtID0gbmV3IFBhcmFtKCk7XG4gIHByb3RlY3RlZCBMT0c6IExvZ2dlcjtcbiAgcHJvdGVjdGVkIGRlZk9wdGlvbnMgPSBDaGFydExpYi5tZXJnZURlZXAodGhpcy5fb3B0aW9ucywge1xuICAgIGRvdHNMaW1pdDogMTAwMCxcbiAgICBoZWF0Q29udHJvbHM6IGZhbHNlLFxuICAgIHRpbWVNb2RlOiAnZGF0ZScsXG4gICAgc2hvd1JhbmdlU2VsZWN0b3I6IHRydWUsXG4gICAgZ3JpZExpbmVDb2xvcjogJyM4ZThlOGUnLFxuICAgIHNob3dEb3RzOiBmYWxzZSxcbiAgICB0aW1lWm9uZTogJ1VUQycsXG4gICAgdGltZVVuaXQ6ICd1cycsXG4gICAgc2hvd0NvbnRyb2xzOiB0cnVlLFxuICAgIGJvdW5kczoge31cbiAgfSkgYXMgUGFyYW07XG5cbiAgcHJvdGVjdGVkIF9kZWJ1ZyA9IGZhbHNlO1xuICBwcm90ZWN0ZWQgX3Nob3dMZWdlbmQgPSBmYWxzZTtcbiAgcHJvdGVjdGVkIF9yZXNwb25zaXZlID0gdHJ1ZTtcbiAgcHJvdGVjdGVkIF91bml0ID0gJyc7XG4gIHByb3RlY3RlZCBfZGF0YTogRGF0YU1vZGVsO1xuICBwcm90ZWN0ZWQgX2F1dG9SZXNpemUgPSB0cnVlO1xuICBwcm90ZWN0ZWQgX2hpZGRlbkRhdGE6IG51bWJlcltdID0gW107XG4gIHByb3RlY3RlZCBkaXZpZGVyOiBudW1iZXI7XG5cbiAgdG9vbHRpcFBvc2l0aW9uOiBhbnkgPSB7dG9wOiAnLTEwMDAwcHgnLCBsZWZ0OiAnLTEwMDBweCd9O1xuICBsb2FkaW5nID0gdHJ1ZTtcbiAgbm9EYXRhID0gZmFsc2U7XG4gIGxheW91dDogUGFydGlhbDxhbnk+ID0ge1xuICAgIG1hcmdpbjoge1xuICAgICAgdDogMTAsXG4gICAgICBiOiAyNSxcbiAgICAgIHI6IDEwLFxuICAgICAgbDogMTBcbiAgICB9XG4gIH07XG4gIHBsb3RseUNvbmZpZzogUGFydGlhbDxDb25maWc+ID0ge1xuICAgIHJlc3BvbnNpdmU6IHRydWUsXG4gICAgc2hvd0F4aXNEcmFnSGFuZGxlczogdHJ1ZSxcbiAgICBzY3JvbGxab29tOiB0cnVlLFxuICAgIGRvdWJsZUNsaWNrOiAncmVzZXQrYXV0b3NpemUnLFxuICAgIHNob3dUaXBzOiB0cnVlLFxuICAgIHBsb3RHbFBpeGVsUmF0aW86IDEsXG4gICAgc3RhdGljUGxvdDogZmFsc2UsXG4gICAgZGlzcGxheWxvZ286IGZhbHNlLFxuICAgIG1vZGVCYXJCdXR0b25zVG9SZW1vdmU6IFtcbiAgICAgICdsYXNzbzJkJywgJ3NlbGVjdDJkJywgJ3RvZ2dsZVNwaWtlbGluZXMnLCAndG9nZ2xlSG92ZXInLCAnaG92ZXJDbG9zZXN0M2QnLCAnYXV0b1NjYWxlMmQnLFxuICAgICAgJ2hvdmVyQ2xvc2VzdEdlbycsICdob3ZlckNsb3Nlc3RHbDJkJywgJ2hvdmVyQ2xvc2VzdFBpZScsICd0b2dnbGVIb3ZlcicsXG4gICAgICAnaG92ZXJDbG9zZXN0Q2FydGVzaWFuJywgJ2hvdmVyQ29tcGFyZUNhcnRlc2lhbidcbiAgICBdXG4gIH07XG4gIHBsb3RseURhdGE6IFBhcnRpYWw8YW55PltdO1xuICBwcml2YXRlIGhpZGVUb29sdGlwVGltZXI6IG51bWJlcjtcbiAgcHJpdmF0ZSByZWN0OiBhbnk7XG5cbiAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBlbDogRWxlbWVudFJlZixcbiAgICBwdWJsaWMgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwdWJsaWMgc2l6ZVNlcnZpY2U6IFNpemVTZXJ2aWNlLFxuICAgIHB1YmxpYyBuZ1pvbmU6IE5nWm9uZVxuICApIHtcbiAgICB0aGlzLnNpemVTZXJ2aWNlLnNpemVDaGFuZ2VkJC5zdWJzY3JpYmUoKHNpemU6IFNpemUpID0+IHtcbiAgICAgIGlmICgoZWwubmF0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudCkucGFyZW50RWxlbWVudCkge1xuICAgICAgICBjb25zdCBwYXJlbnRTaXplID0gKGVsLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLnBhcmVudEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGlmICh0aGlzLl9yZXNwb25zaXZlKSB7XG4gICAgICAgICAgdGhpcy5oZWlnaHQgPSBwYXJlbnRTaXplLmhlaWdodDtcbiAgICAgICAgICB0aGlzLndpZHRoID0gcGFyZW50U2l6ZS53aWR0aDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoISF0aGlzLmdyYXBoICYmIHRoaXMuX3Jlc3BvbnNpdmUgJiYgcGFyZW50U2l6ZS5oZWlnaHQgPiAwKSB7XG4gICAgICAgICAgY29uc3QgbGF5b3V0ID0ge1xuICAgICAgICAgICAgd2lkdGg6IHBhcmVudFNpemUud2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuX2F1dG9SZXNpemUgPyBwYXJlbnRTaXplLmhlaWdodCA6IHRoaXMubGF5b3V0LmhlaWdodFxuICAgICAgICAgIH07XG4gICAgICAgICAgaWYgKHRoaXMubGF5b3V0LndpZHRoICE9PSBsYXlvdXQud2lkdGggfHwgdGhpcy5sYXlvdXQuaGVpZ2h0ICE9PSBsYXlvdXQuaGVpZ2h0KSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMubGF5b3V0ID0gey4uLnRoaXMubGF5b3V0LCAuLi5sYXlvdXR9KTtcbiAgICAgICAgICAgIHRoaXMuTE9HLmRlYnVnKFsnc2l6ZUNoYW5nZWQkJ10sIHRoaXMubGF5b3V0LndpZHRoLCB0aGlzLmxheW91dC5oZWlnaHQpO1xuICAgICAgICAgICAgdGhpcy5ncmFwaC51cGRhdGVQbG90KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgYWJzdHJhY3QgdXBkYXRlKG9wdGlvbnM6IFBhcmFtLCByZWZyZXNoOiBib29sZWFuKTogdm9pZDtcblxuICBwcm90ZWN0ZWQgYWJzdHJhY3QgY29udmVydChkYXRhOiBEYXRhTW9kZWwpOiBQYXJ0aWFsPGFueT5bXTtcblxuICBwcm90ZWN0ZWQgbGVnZW5kRm9ybWF0dGVyKHgsIHNlcmllcywgaGlnaGxpZ2h0ZWQgPSAtMSk6IHN0cmluZyB7XG4gICAgY29uc3QgZGlzcGxheWVkQ3VydmVzID0gW107XG4gICAgaWYgKHggPT09IG51bGwpIHtcbiAgICAgIC8vIFRoaXMgaGFwcGVucyB3aGVuIHRoZXJlJ3Mgbm8gc2VsZWN0aW9uIGFuZCB7bGVnZW5kOiAnYWx3YXlzJ30gaXMgc2V0LlxuICAgICAgcmV0dXJuIGA8YnI+XG4gICAgICAke3Nlcmllcy5tYXAocyA9PiB7XG4gICAgICAgIC8vIEZJWE1FIDogIGlmICghcy5pc1Zpc2libGUpIHJldHVybjtcbiAgICAgICAgbGV0IGxhYmVsZWREYXRhID0gR1RTTGliLmZvcm1hdExhYmVsKHMuZGF0YS50ZXh0IHx8ICcnKSArICc6ICcgKyAoKHRoaXMuX29wdGlvbnMuaG9yaXpvbnRhbCA/IHMueCA6IHMueSkgfHwgcy5yIHx8ICcnKTtcbiAgICAgICAgbGV0IGNvbG9yID0gcy5kYXRhLmxpbmUuY29sb3I7XG4gICAgICAgIGlmICghIXMuZGF0YS5tYXJrZXIpIHtcbiAgICAgICAgICBpZiAoR1RTTGliLmlzQXJyYXkocy5kYXRhLm1hcmtlci5jb2xvcikpIHtcbiAgICAgICAgICAgIGNvbG9yID0gcy5kYXRhLm1hcmtlci5jb2xvclswXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29sb3IgPSBzLmRhdGEubWFya2VyLmNvbG9yO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocy5jdXJ2ZU51bWJlciA9PT0gaGlnaGxpZ2h0ZWQpIHtcbiAgICAgICAgICBsYWJlbGVkRGF0YSA9IGA8aSBjbGFzcz1cImNoaXBcIlxuICAgIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjogJHtjb2xvcn07Ym9yZGVyOiAycHggc29saWQgJHtjb2xvcn07XCI+PC9pPiAke2xhYmVsZWREYXRhfWA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxhYmVsZWREYXRhO1xuICAgICAgfSkuam9pbignPGJyPicpfWA7XG4gICAgfVxuXG4gICAgbGV0IGh0bWwgPSAnJztcbiAgICBpZiAoISFzZXJpZXNbMF0pIHtcbiAgICAgIHggPSBzZXJpZXNbMF0ueCB8fCBzZXJpZXNbMF0udGhldGE7XG4gICAgfVxuICAgIGh0bWwgKz0gYDxiPiR7eH08L2I+PGJyIC8+YDtcbiAgICAvLyBwdXQgdGhlIGhpZ2hsaWdodGVkIG9uZShzPykgZmlyc3QsIGtlZXAgb25seSB2aXNpYmxlcywga2VlcCBvbmx5IDUwIGZpcnN0IG9uZXMuXG4gICAgc2VyaWVzID0gc2VyaWVzLnNvcnQoKHNhLCBzYikgPT4gKHNhLmN1cnZlTnVtYmVyID09PSBoaWdobGlnaHRlZCkgPyAtMSA6IDEpO1xuICAgIHNlcmllc1xuICAgICAgLy8gLmZpbHRlcihzID0+IHMuaXNWaXNpYmxlICYmIHMueUhUTUwpXG4gICAgICAuc2xpY2UoMCwgNTApXG4gICAgICAuZm9yRWFjaCgocywgaSkgPT4ge1xuICAgICAgICBpZiAoZGlzcGxheWVkQ3VydmVzLmluZGV4T2Yocy5jdXJ2ZU51bWJlcikgPD0gLTEpIHtcbiAgICAgICAgICBkaXNwbGF5ZWRDdXJ2ZXMucHVzaChzLmN1cnZlTnVtYmVyKTtcbiAgICAgICAgICBsZXQgdmFsdWUgPSBzZXJpZXNbMF0uZGF0YS5vcmllbnRhdGlvbiA9PT0gJ2gnID8gcy54IDogcy55O1xuICAgICAgICAgIGlmICghdmFsdWUgJiYgdmFsdWUgIT09IDApIHtcbiAgICAgICAgICAgIHZhbHVlID0gcy5yO1xuICAgICAgICAgIH1cbiAgICAgICAgICBsZXQgbGFiZWxlZERhdGEgPSBHVFNMaWIuZm9ybWF0TGFiZWwocy5kYXRhLnRleHQgfHwgJycpICsgJzogJyArIHZhbHVlO1xuICAgICAgICAgIGlmIChzLmN1cnZlTnVtYmVyID09PSBoaWdobGlnaHRlZCkge1xuICAgICAgICAgICAgbGFiZWxlZERhdGEgPSBgPGI+JHtsYWJlbGVkRGF0YX08L2I+YDtcbiAgICAgICAgICB9XG4gICAgICAgICAgbGV0IGNvbG9yID0gcy5kYXRhLmxpbmUgPyBzLmRhdGEubGluZS5jb2xvciA6ICcnO1xuICAgICAgICAgIGlmICghIXMuZGF0YS5tYXJrZXIpIHtcbiAgICAgICAgICAgIGlmIChHVFNMaWIuaXNBcnJheShzLmRhdGEubWFya2VyLmNvbG9yKSkge1xuICAgICAgICAgICAgICBjb2xvciA9IHMuZGF0YS5tYXJrZXIuY29sb3JbMF07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb2xvciA9IHMuZGF0YS5tYXJrZXIuY29sb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGh0bWwgKz0gYDxpIGNsYXNzPVwiY2hpcFwiIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjogJHtjb2xvcn07Ym9yZGVyOiAycHggc29saWQgJHtjb2xvcn07XCI+PC9pPiZuYnNwOyR7bGFiZWxlZERhdGF9YDtcbiAgICAgICAgICBpZiAoaSA8IHNlcmllcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGh0bWwgKz0gJzxicj4nO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgcmV0dXJuIGh0bWw7XG4gIH1cblxuICBwcm90ZWN0ZWQgaW5pdENoYXJ0KGVsOiBFbGVtZW50UmVmKTogYm9vbGVhbiB7XG4gICAgdGhpcy5ub0RhdGEgPSBmYWxzZTtcbiAgICBjb25zdCBwYXJlbnRTaXplID0gKGVsLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBpZiAodGhpcy5fcmVzcG9uc2l2ZSkge1xuICAgICAgdGhpcy5oZWlnaHQgPSBwYXJlbnRTaXplLmhlaWdodDtcbiAgICAgIHRoaXMud2lkdGggPSBwYXJlbnRTaXplLndpZHRoO1xuICAgIH1cbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2luaXRpQ2hhcnQnLCAndGhpcy5fZGF0YSddLCB0aGlzLl9kYXRhLCB0aGlzLl9vcHRpb25zKTtcbiAgICBpZiAoIXRoaXMuX2RhdGEgfHwgIXRoaXMuX2RhdGEuZGF0YSB8fCB0aGlzLl9kYXRhLmRhdGEubGVuZ3RoID09PSAwIHx8ICF0aGlzLl9vcHRpb25zKSB7XG4gICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsnaW5pdGlDaGFydCcsICdub2RhdGEnXSk7XG4gICAgICB0aGlzLm5vRGF0YSA9IHRydWU7XG4gICAgICB0aGlzLmNoYXJ0RHJhdy5lbWl0KCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIG1vbWVudC50ei5zZXREZWZhdWx0KHRoaXMuX29wdGlvbnMudGltZVpvbmUpO1xuICAgIHRoaXMubG9hZGluZyA9IHRydWU7XG4gICAgdGhpcy5fb3B0aW9ucyA9IENoYXJ0TGliLm1lcmdlRGVlcCh0aGlzLmRlZk9wdGlvbnMsIHRoaXMuX29wdGlvbnMgfHwge30pIGFzIFBhcmFtO1xuICAgIGNvbnN0IGRhdGFNb2RlbCA9IHRoaXMuX2RhdGE7XG4gICAgdGhpcy5fb3B0aW9ucyA9IENoYXJ0TGliLm1lcmdlRGVlcCh0aGlzLl9vcHRpb25zIHx8IHt9LCB0aGlzLl9kYXRhLmdsb2JhbFBhcmFtcykgYXMgUGFyYW07XG4gICAgdGhpcy5MT0cuZGVidWcoWydpbml0aUNoYXJ0JywgJ3RoaXMuX29wdGlvbnMnXSwgdGhpcy5fb3B0aW9ucyk7XG4gICAgdGhpcy5fb3B0aW9ucy50aW1lTW9kZSA9IHRoaXMuX29wdGlvbnMudGltZU1vZGUgfHwgJ2RhdGUnO1xuICAgIHRoaXMuZGl2aWRlciA9IEdUU0xpYi5nZXREaXZpZGVyKHRoaXMuX29wdGlvbnMudGltZVVuaXQpO1xuICAgIHRoaXMucGxvdGx5RGF0YSA9IHRoaXMuY29udmVydChkYXRhTW9kZWwpO1xuICAgIHRoaXMucGxvdGx5Q29uZmlnLnJlc3BvbnNpdmUgPSB0aGlzLl9yZXNwb25zaXZlO1xuICAgIHRoaXMubGF5b3V0LnBhcGVyX2JnY29sb3IgPSAncmdiYSgwLDAsMCwwKSc7XG4gICAgdGhpcy5sYXlvdXQucGxvdF9iZ2NvbG9yID0gJ3JnYmEoMCwwLDAsMCknO1xuICAgIGlmICghdGhpcy5fcmVzcG9uc2l2ZSkge1xuICAgICAgdGhpcy5sYXlvdXQud2lkdGggPSB0aGlzLndpZHRoIHx8IENoYXJ0TGliLkRFRkFVTFRfV0lEVEg7XG4gICAgICB0aGlzLmxheW91dC5oZWlnaHQgPSB0aGlzLmhlaWdodCB8fCBDaGFydExpYi5ERUZBVUxUX0hFSUdIVDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sYXlvdXQud2lkdGggPSBwYXJlbnRTaXplLndpZHRoO1xuICAgICAgdGhpcy5sYXlvdXQuaGVpZ2h0ID0gcGFyZW50U2l6ZS5oZWlnaHQ7XG4gICAgfVxuICAgIHRoaXMuTE9HLmRlYnVnKFsnaW5pdENoYXJ0JywgJ2luaXRTaXplJ10sIHRoaXMubGF5b3V0LndpZHRoLCB0aGlzLmxheW91dC5oZWlnaHQsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgICBpZiAodGhpcy5fb3B0aW9ucy5ib3VuZHMgJiYgdGhpcy5fb3B0aW9ucy5ib3VuZHMubWluRGF0ZSAmJiB0aGlzLl9vcHRpb25zLmJvdW5kcy5tYXhEYXRlKSB7XG4gICAgICBkYXRhTW9kZWwuYm91bmRzID0ge1xuICAgICAgICB4bWluOiBNYXRoLmZsb29yKHRoaXMuX29wdGlvbnMuYm91bmRzLm1pbkRhdGUpLFxuICAgICAgICB4bWF4OiBNYXRoLmNlaWwodGhpcy5fb3B0aW9ucy5ib3VuZHMubWF4RGF0ZSksXG4gICAgICAgIHltaW46IHRoaXMuX29wdGlvbnMuYm91bmRzLnlSYW5nZXMgJiYgdGhpcy5fb3B0aW9ucy5ib3VuZHMueVJhbmdlcy5sZW5ndGggPiAwXG4gICAgICAgICAgPyBNYXRoLmZsb29yKHRoaXMuX29wdGlvbnMuYm91bmRzLnlSYW5nZXNbMF0pXG4gICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgIHltYXg6IHRoaXMuX29wdGlvbnMuYm91bmRzLnlSYW5nZXMgJiYgdGhpcy5fb3B0aW9ucy5ib3VuZHMueVJhbmdlcy5sZW5ndGggPiAxXG4gICAgICAgICAgPyBNYXRoLmNlaWwodGhpcy5fb3B0aW9ucy5ib3VuZHMueVJhbmdlc1sxXSlcbiAgICAgICAgICA6IHVuZGVmaW5lZFxuICAgICAgfTtcbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsnaW5pdENoYXJ0JywgJ3VwZGF0ZUJvdW5kcyddLCBkYXRhTW9kZWwuYm91bmRzLnhtaW4sIGRhdGFNb2RlbC5ib3VuZHMueG1heCk7XG4gICAgICBpZiAodGhpcy5fb3B0aW9ucy50aW1lTW9kZSAmJiB0aGlzLl9vcHRpb25zLnRpbWVNb2RlID09PSAndGltZXN0YW1wJykge1xuICAgICAgICB0aGlzLmxheW91dC54YXhpcy5yYW5nZSA9IFtkYXRhTW9kZWwuYm91bmRzLnhtaW4sIGRhdGFNb2RlbC5ib3VuZHMueG1heF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmxheW91dC54YXhpcy5yYW5nZSA9IFtcbiAgICAgICAgICBtb21lbnQudHooZGF0YU1vZGVsLmJvdW5kcy54bWluIC8gdGhpcy5kaXZpZGVyLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKS50b0lTT1N0cmluZyh0cnVlKSxcbiAgICAgICAgICBtb21lbnQudHooZGF0YU1vZGVsLmJvdW5kcy54bWF4IC8gdGhpcy5kaXZpZGVyLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKS50b0lTT1N0cmluZyh0cnVlKV07XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuTE9HLmRlYnVnKFsnaW5pdGlDaGFydCcsICdwbG90bHlEYXRhJ10sIHRoaXMucGxvdGx5RGF0YSk7XG4gICAgaWYgKCF0aGlzLnBsb3RseURhdGEgfHwgdGhpcy5wbG90bHlEYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgICB0aGlzLmNoYXJ0RHJhdy5lbWl0KCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiAhKCF0aGlzLnBsb3RseURhdGEgfHwgdGhpcy5wbG90bHlEYXRhLmxlbmd0aCA9PT0gMCk7XG4gIH1cblxuICBhZnRlclBsb3QocGxvdGx5SW5zdGFuY2U/OiBhbnkpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2FmdGVyUGxvdCcsICdwbG90bHlJbnN0YW5jZSddLCBwbG90bHlJbnN0YW5jZSk7XG4gICAgdGhpcy5jaGFydERyYXcuZW1pdCgpO1xuICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgIHRoaXMucmVjdCA9IHRoaXMuZ3JhcGguZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIH1cblxuICBoaWRlVG9vbHRpcCgpIHtcbiAgICBpZiAoISF0aGlzLmhpZGVUb29sdGlwVGltZXIpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLmhpZGVUb29sdGlwVGltZXIpO1xuICAgIH1cbiAgICB0aGlzLmhpZGVUb29sdGlwVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMudG9vbFRpcC5uYXRpdmVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfSwgMTAwMCk7XG4gIH1cblxuICB1bmhvdmVyKGRhdGE/OiBhbnksIHBvaW50PzogYW55KSB7XG4gICAgdGhpcy5MT0cuZGVidWcoWyd1bmhvdmVyJ10sIGRhdGEpO1xuICAgIGlmICghIXRoaXMuaGlkZVRvb2x0aXBUaW1lcikge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuaGlkZVRvb2x0aXBUaW1lcik7XG4gICAgfVxuICB9XG5cbiAgaG92ZXIoZGF0YTogYW55LCBwb2ludD86IGFueSkge1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnaG92ZXInXSwgZGF0YSk7XG4gICAgdGhpcy50b29sVGlwLm5hdGl2ZUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgaWYgKCEhdGhpcy5oaWRlVG9vbHRpcFRpbWVyKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5oaWRlVG9vbHRpcFRpbWVyKTtcbiAgICB9XG4gICAgbGV0IGRlbHRhID0gTnVtYmVyLk1BWF9WQUxVRTtcbiAgICBjb25zdCBjdXJ2ZXMgPSBbXTtcbiAgICBpZiAoIXBvaW50KSB7XG4gICAgICBpZiAoZGF0YS5wb2ludHNbMF0gJiYgZGF0YS5wb2ludHNbMF0uZGF0YS5vcmllbnRhdGlvbiAhPT0gJ2gnKSB7XG4gICAgICAgIGNvbnN0IHkgPSAoZGF0YS55dmFscyB8fCBbJyddKVswXTtcbiAgICAgICAgZGF0YS5wb2ludHMuZm9yRWFjaChwID0+IHtcbiAgICAgICAgICBjdXJ2ZXMucHVzaChwLmN1cnZlTnVtYmVyKTtcbiAgICAgICAgICBjb25zdCBkID0gTWF0aC5hYnMoKHAueSB8fCBwLnIpIC0geSk7XG4gICAgICAgICAgaWYgKGQgPCBkZWx0YSkge1xuICAgICAgICAgICAgZGVsdGEgPSBkO1xuICAgICAgICAgICAgcG9pbnQgPSBwO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB4OiBudW1iZXIgPSAoZGF0YS54dmFscyB8fCBbJyddKVswXTtcbiAgICAgICAgZGF0YS5wb2ludHMuZm9yRWFjaChwID0+IHtcbiAgICAgICAgICBjdXJ2ZXMucHVzaChwLmN1cnZlTnVtYmVyKTtcbiAgICAgICAgICBjb25zdCBkID0gTWF0aC5hYnMoKHAueCB8fCBwLnIpIC0geCk7XG4gICAgICAgICAgaWYgKGQgPCBkZWx0YSkge1xuICAgICAgICAgICAgZGVsdGEgPSBkO1xuICAgICAgICAgICAgcG9pbnQgPSBwO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwb2ludCkge1xuICAgICAgY29uc3QgY29udGVudCA9IHRoaXMubGVnZW5kRm9ybWF0dGVyKFxuICAgICAgICB0aGlzLl9vcHRpb25zLmhvcml6b250YWwgP1xuICAgICAgICAgIChkYXRhLnl2YWxzIHx8IFsnJ10pWzBdIDpcbiAgICAgICAgICAoZGF0YS54dmFscyB8fCBbJyddKVswXVxuICAgICAgICAsIGRhdGEucG9pbnRzLCBwb2ludC5jdXJ2ZU51bWJlcik7XG4gICAgICBsZXQgbGVmdCA9IChkYXRhLmV2ZW50Lm9mZnNldFggKyAyMCkgKyAncHgnO1xuICAgICAgaWYgKGRhdGEuZXZlbnQub2Zmc2V0WCA+IHRoaXMuY2hhcnRDb250YWluZXIubmF0aXZlRWxlbWVudC5jbGllbnRXaWR0aCAvIDIpIHtcbiAgICAgICAgbGVmdCA9IE1hdGgubWF4KDAsIGRhdGEuZXZlbnQub2Zmc2V0WCAtIHRoaXMudG9vbFRpcC5uYXRpdmVFbGVtZW50LmNsaWVudFdpZHRoIC0gMjApICsgJ3B4JztcbiAgICAgIH1cbiAgICAgIGNvbnN0IHRvcCA9IE1hdGgubWluKFxuICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0IC0gdGhpcy50b29sVGlwLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0IC0gMjAsXG4gICAgICAgIGRhdGEuZXZlbnQueSAtIDIwIC0gdGhpcy5yZWN0LnRvcCkgKyAncHgnO1xuICAgICAgdGhpcy5tb3ZlVG9vbHRpcCh0b3AsIGxlZnQsIGNvbnRlbnQpO1xuICAgIH1cbiAgfVxuXG4gIGdldFRvb2x0aXBQb3NpdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdG9wOiB0aGlzLnRvb2x0aXBQb3NpdGlvbi50b3AsXG4gICAgICBsZWZ0OiB0aGlzLnRvb2x0aXBQb3NpdGlvbi5sZWZ0LFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIG1vdmVUb29sdGlwKHRvcCwgbGVmdCwgY29udGVudCkge1xuICAgIHRoaXMudG9vbHRpcFBvc2l0aW9uID0ge3RvcCwgbGVmdH07XG4gICAgdGhpcy5yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLnRvb2xUaXAubmF0aXZlRWxlbWVudCwgJ2lubmVySFRNTCcsIGNvbnRlbnQpO1xuICB9XG5cbiAgcmVsYXlvdXQoJGV2ZW50OiBhbnkpIHtcblxuICB9XG5cbiAgcHJvdGVjdGVkIGdldExhYmVsQ29sb3IoZWw6IEhUTUxFbGVtZW50KSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0Q1NTQ29sb3IoZWwsICctLXdhcnAtdmlldy1jaGFydC1sYWJlbC1jb2xvcicsICcjOGU4ZThlJykudHJpbSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldEdyaWRDb2xvcihlbDogSFRNTEVsZW1lbnQpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRDU1NDb2xvcihlbCwgJy0td2FycC12aWV3LWNoYXJ0LWdyaWQtY29sb3InLCAnIzhlOGU4ZScpLnRyaW0oKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRDU1NDb2xvcihlbDogSFRNTEVsZW1lbnQsIHByb3BlcnR5OiBzdHJpbmcsIGRlZkNvbG9yOiBzdHJpbmcpIHtcbiAgICBjb25zdCBjb2xvciA9IGdldENvbXB1dGVkU3R5bGUoZWwpLmdldFByb3BlcnR5VmFsdWUocHJvcGVydHkpLnRyaW0oKTtcbiAgICByZXR1cm4gY29sb3IgPT09ICcnID8gZGVmQ29sb3IgOiBjb2xvcjtcbiAgfVxufVxuIl19