/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component, ElementRef, EventEmitter, Input, NgZone, Output, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { WarpViewComponent } from '../warp-view-component';
import { SizeService } from '../../services/resize.service';
import { Logger } from '../../utils/logger';
import deepEqual from 'deep-equal';
import { ChartLib } from '../../utils/chart-lib';
import { ColorLib } from '../../utils/color-lib';
import * as d3 from 'd3';
import eventDrops from 'event-drops';
import { GTSLib } from '../../utils/gts.lib';
import moment from 'moment-timezone';
import { select } from 'd3-selection';
var WarpViewEventDropComponent = /** @class */ (function (_super) {
    tslib_1.__extends(WarpViewEventDropComponent, _super);
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
                        x: d3.event.offsetX,
                        y: d3.event.offsetY
                    });
                    /** @type {?} */
                    var t = d3
                        .select(_this.toolTip.nativeElement);
                    t.transition()
                        .duration(200)
                        .style('opacity', 1)
                        .style('pointer-events', 'auto');
                    t.html("<div class=\"tooltip-body\">\n<b class=\"tooltip-date\">" + (_this._options.timeMode === 'timestamp'
                        ? g.date
                        : (moment(g.date.valueOf()).utc().toISOString() || '')) + "</b>\n<div><i class=\"chip\"  style=\"background-color: " + ColorLib.transparentize(g.color, 0.7) + ";border: 2px solid " + g.color + ";\"></i>\n" + GTSLib.formatLabel(g.name) + ": <span class=\"value\">" + g.value + "</span>\n</div></div>")
                        .style('left', d3.event.offsetX - 30 + "px")
                        .style('top', d3.event.offsetY + 20 + "px");
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
                start: moment.tz(moment.utc(this.minTick / this.divider), this._options.timeZone).toDate(),
                end: moment.tz(moment.utc(this.maxTick / this.divider), this._options.timeZone).toDate(),
            };
        }
        this.eventConf = tslib_1.__assign({}, this.eventConf);
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
                        date: moment.tz(moment.utc(ts / _this.divider), _this._options.timeZone).toDate(),
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
            start: moment.tz(moment.utc(this.minTick / this.divider), this._options.timeZone).toDate(),
            end: moment.tz(moment.utc(this.maxTick / this.divider), this._options.timeZone).toDate(),
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
export { WarpViewEventDropComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LWV2ZW50LWRyb3AuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHNlbngvd2FycHZpZXcvIiwic291cmNlcyI6WyJzcmMvbGliL2VsZW1lbnRzL3dhcnAtdmlldy1ldmVudC1kcm9wL3dhcnAtdmlldy1ldmVudC1kcm9wLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixLQUFLLEVBQ0wsTUFBTSxFQUdOLE1BQU0sRUFDTixTQUFTLEVBQ1QsU0FBUyxFQUNULGlCQUFpQixFQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN6RCxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sK0JBQStCLENBQUM7QUFDMUQsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQzFDLE9BQU8sU0FBUyxNQUFNLFlBQVksQ0FBQztBQUNuQyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFHL0MsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9DLE9BQU8sS0FBSyxFQUFFLE1BQU0sSUFBSSxDQUFDO0FBQ3pCLE9BQU8sVUFBVSxNQUFNLGFBQWEsQ0FBQztBQUNyQyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDM0MsT0FBTyxNQUFNLE1BQU0saUJBQWlCLENBQUM7QUFDckMsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUVwQztJQU1nRCxzREFBaUI7SUFnRi9ELG9DQUNTLEVBQWMsRUFDZCxRQUFtQixFQUNuQixXQUF3QixFQUN4QixNQUFjO1FBSnZCLFlBTUUsa0JBQU0sRUFBRSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsTUFBTSxDQUFDLFNBRXpDO1FBUFEsUUFBRSxHQUFGLEVBQUUsQ0FBWTtRQUNkLGNBQVEsR0FBUixRQUFRLENBQVc7UUFDbkIsaUJBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIsWUFBTSxHQUFOLE1BQU0sQ0FBUTtRQTVERCxnQkFBVSxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFDNUIseUJBQW1CLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUN4RCxlQUFTLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUM5QixxQkFBZSxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFFN0QsZ0JBQVUsR0FBYyxFQUFFLENBQUM7UUFDM0IsYUFBTyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUM7UUFDM0IsYUFBTyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUM7UUFDM0Isa0JBQVksR0FBRyxFQUFFLENBQUM7UUFDbEIsV0FBSyxHQUFHLE9BQU8sQ0FBQztRQUNoQixlQUFTLEdBQUc7WUFDbEIsRUFBRSxJQUFBO1lBQ0YsSUFBSSxFQUFFO2dCQUNKLFlBQVksRUFBRSxJQUFJO2dCQUNsQixXQUFXLEVBQUUsQ0FBQzthQUNmO1lBQ0QsU0FBUyxFQUFFLEtBQUs7WUFDaEIsS0FBSyxFQUFFO2dCQUNMLElBQUk7Ozs7Z0JBQUUsVUFBQSxHQUFHLElBQUksT0FBQSxHQUFHLENBQUMsSUFBSSxFQUFSLENBQVEsQ0FBQTthQUN0QjtZQUNELElBQUksRUFBRTtnQkFDSixJQUFJOzs7O2dCQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFoQixDQUFnQixDQUFBO2dCQUMzQixLQUFLOzs7O2dCQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEtBQUssRUFBUCxDQUFPLENBQUE7Z0JBQ25CLFdBQVc7Ozs7Z0JBQUUsVUFBQSxDQUFDO29CQUNaLEtBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ25DLEtBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO3dCQUNuQixDQUFDLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPO3dCQUNuQixDQUFDLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPO3FCQUNwQixDQUFDLENBQUM7O3dCQUNHLENBQUMsR0FBRyxFQUFFO3lCQUNULE1BQU0sQ0FBQyxLQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQztvQkFDckMsQ0FBQyxDQUFDLFVBQVUsRUFBRTt5QkFDWCxRQUFRLENBQUMsR0FBRyxDQUFDO3lCQUNiLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO3lCQUNuQixLQUFLLENBQUMsZ0JBQWdCLEVBQUUsTUFBTSxDQUFDLENBQUM7b0JBQ25DLENBQUMsQ0FBQyxJQUFJLENBQUMsOERBQ1csS0FBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEtBQUssV0FBVzt3QkFDdEQsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJO3dCQUNSLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsV0FBVyxFQUFFLElBQUksRUFBRSxDQUFDLGlFQUNmLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsMkJBQXNCLENBQUMsQ0FBQyxLQUFLLGtCQUNqSCxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0NBQXlCLENBQUMsQ0FBQyxLQUFLLDBCQUMvQyxDQUNKO3lCQUNFLEtBQUssQ0FBQyxNQUFNLEVBQUssRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsRUFBRSxPQUFJLENBQUM7eUJBQzNDLEtBQUssQ0FBQyxLQUFLLEVBQUssRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsRUFBRSxPQUFJLENBQUMsQ0FBQztnQkFDaEQsQ0FBQyxDQUFBO2dCQUNELFVBQVU7OztnQkFBRTtvQkFDVixNQUFNLENBQUMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7eUJBQy9CLFVBQVUsRUFBRTt5QkFDWixRQUFRLENBQUMsR0FBRyxDQUFDO3lCQUNiLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO3lCQUNuQixLQUFLLENBQUMsZ0JBQWdCLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQ3JDLENBQUMsQ0FBQTthQUNGO1NBQ0YsQ0FBQztRQVNBLEtBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxNQUFNLENBQUMsMEJBQTBCLEVBQUUsS0FBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztJQUNqRSxDQUFDO0lBckZELHNCQUFtQiw0Q0FBSTs7Ozs7UUFBdkIsVUFBd0IsSUFBWTtZQUNsQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztZQUNsQixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDbkIsQ0FBQzs7O09BQUE7SUFHRCxzQkFBeUIsa0RBQVU7Ozs7O1FBQW5DLFVBQW9DLFVBQW9CO1lBQXhELGlCQWFDOztnQkFaTyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7WUFDMUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxZQUFZLEVBQUUsb0JBQW9CLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1lBQ3pFLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO1lBQzlCLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTzs7OztZQUFDLFVBQUEsRUFBRSxJQUFJLE9BQUEsS0FBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUEvRCxDQUErRCxFQUFDLENBQUM7WUFDakcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxZQUFZLEVBQUUsb0JBQW9CLENBQUMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7O2dCQUNoRSxhQUFhLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQ3JELElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsWUFBWSxFQUFFLE1BQU0sQ0FBQyxFQUFFLGtCQUFrQixFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBQzFFLElBQUksa0JBQWtCLEtBQUssYUFBYSxFQUFFO2dCQUN4QyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBQ2pCLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsbUJBQW1CLEVBQUUsU0FBUyxDQUFDLEVBQUUsNkJBQTZCLENBQUMsQ0FBQzthQUNqRjtRQUNILENBQUM7OztPQUFBOzs7O0lBcUVELDZDQUFROzs7SUFBUjtRQUNFLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQ25ELENBQUM7Ozs7SUFFRCxnREFBVzs7O0lBQVg7UUFDRSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ3BCLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQy9DO0lBQ0gsQ0FBQzs7Ozs7O0lBRUQsMkNBQU07Ozs7O0lBQU4sVUFBTyxPQUFPLEVBQUUsT0FBTztRQUNyQixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2hFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUN0QyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUNoRCxJQUFJLENBQUMsUUFBUSxHQUFHLG1CQUFBLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxtQkFBQSxPQUFPLEVBQVMsQ0FBQyxFQUFTLENBQUM7U0FDOUU7UUFDRCxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDbkIsQ0FBQzs7Ozs7O0lBRUQsaURBQVk7Ozs7O0lBQVosVUFBYSxHQUFHLEVBQUUsR0FBRztRQUNuQixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLGNBQWMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7UUFDbkMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztRQUVuQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxLQUFLLFdBQVcsRUFBRTtZQUNwRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFDLENBQUM7U0FDbEQ7YUFBTTtZQUNMLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUc7Z0JBQ3hCLEtBQUssRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLEVBQUU7Z0JBQzFGLEdBQUcsRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLEVBQUU7YUFDekYsQ0FBQztTQUNIO1FBQ0QsSUFBSSxDQUFDLFNBQVMsd0JBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsY0FBYyxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ25ELENBQUM7Ozs7SUFFRCw4Q0FBUzs7O0lBQVQ7UUFBQSxpQkFXQztRQVZDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUM1QixPQUFPO1NBQ1I7UUFDRCxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztRQUNyQixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsRUFBRSxZQUFZLENBQUMsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN6RSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFO1lBQ2hDLFVBQVU7OztZQUFDLGNBQU0sT0FBQSxNQUFNLENBQUMsS0FBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUE3RixDQUE2RixFQUFDLENBQUM7WUFDaEgsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7WUFDckIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUN2QjtJQUNILENBQUM7Ozs7OztJQUVTLDRDQUFPOzs7OztJQUFqQixVQUFrQixJQUFlO1FBQWpDLGlCQXVDQztRQXRDQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDOztZQUM1QixPQUFPLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxtQkFBQSxJQUFJLENBQUMsSUFBSSxFQUFTLENBQUM7O1lBQzdDLFFBQVEsR0FBRyxFQUFFO1FBQ25CLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2hELElBQUksQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDN0QsT0FBTztTQUNSO1FBQ0QsT0FBTyxDQUFDLE9BQU87Ozs7O1FBQUMsVUFBQyxHQUFHLEVBQUUsQ0FBQzs7Z0JBQ2YsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsS0FBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7O2dCQUN4RCxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBQyxZQUFZLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxZQUFZLElBQUksQ0FBQzs7Z0JBQ3ZFLE9BQU8sR0FBRztnQkFDZCxJQUFJLEVBQUUsTUFBTSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQztnQkFDdEMsS0FBSyxPQUFBO2dCQUNMLElBQUksRUFBRSxFQUFFO2FBQ1Q7WUFDRCxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTzs7OztZQUFDLFVBQUEsS0FBSzs7b0JBQ25CLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixLQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDMUMsS0FBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQzFDLElBQUksS0FBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLElBQUksS0FBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEtBQUssV0FBVyxFQUFFO29CQUNwRSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsS0FBSyxPQUFBLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztpQkFDdEU7cUJBQU07b0JBQ0wsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7d0JBQ2hCLElBQUksRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEtBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sRUFBRTt3QkFDL0UsS0FBSyxPQUFBO3dCQUNMLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7d0JBQzlCLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSTtxQkFDbkIsQ0FBQyxDQUFDO2lCQUNKO1lBQ0gsQ0FBQyxFQUFDLENBQUM7WUFDSCxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3pCLENBQUMsRUFBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRztZQUN4QixLQUFLLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFO1lBQzFGLEdBQUcsRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLEVBQUU7U0FDekYsQ0FBQztRQUNGLE9BQU8sUUFBUSxDQUFDO0lBQ2xCLENBQUM7O2dCQXpMRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLHFCQUFxQjtvQkFDL0IsMitCQUFvRDtvQkFFcEQsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7O2lCQUN0Qzs7OztnQkE5QkMsVUFBVTtnQkFPVixTQUFTO2dCQUtILFdBQVc7Z0JBVGpCLE1BQU07Ozs0QkE2QkwsU0FBUyxTQUFDLFdBQVcsRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUM7dUJBRXJDLEtBQUssU0FBQyxNQUFNOzZCQU1aLEtBQUssU0FBQyxZQUFZOzZCQWVsQixNQUFNLFNBQUMsWUFBWTtzQ0FDbkIsTUFBTSxTQUFDLHFCQUFxQjs0QkFDNUIsTUFBTSxTQUFDLFdBQVc7a0NBQ2xCLE1BQU0sU0FBQyxpQkFBaUI7O0lBeUozQixpQ0FBQztDQUFBLEFBMUxELENBTWdELGlCQUFpQixHQW9MaEU7U0FwTFksMEJBQTBCOzs7SUFDckMsK0NBQThEOztJQXVCOUQsZ0RBQTJEOztJQUMzRCx5REFBNkU7O0lBQzdFLCtDQUF5RDs7SUFDekQscURBQXFFOzs7OztJQUVyRSxnREFBbUM7Ozs7O0lBQ25DLDZDQUFtQzs7Ozs7SUFDbkMsNkNBQW1DOzs7OztJQUNuQyxrREFBMEI7Ozs7O0lBQzFCLDJDQUF3Qjs7Ozs7SUFDeEIsK0NBNENFOztJQUdBLHdDQUFxQjs7SUFDckIsOENBQTBCOztJQUMxQixpREFBK0I7O0lBQy9CLDRDQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBSZW5kZXJlcjIsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1dhcnBWaWV3Q29tcG9uZW50fSBmcm9tICcuLi93YXJwLXZpZXctY29tcG9uZW50JztcbmltcG9ydCB7U2l6ZVNlcnZpY2V9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3Jlc2l6ZS5zZXJ2aWNlJztcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICcuLi8uLi91dGlscy9sb2dnZXInO1xuaW1wb3J0IGRlZXBFcXVhbCBmcm9tICdkZWVwLWVxdWFsJztcbmltcG9ydCB7Q2hhcnRMaWJ9IGZyb20gJy4uLy4uL3V0aWxzL2NoYXJ0LWxpYic7XG5pbXBvcnQge1BhcmFtfSBmcm9tICcuLi8uLi9tb2RlbC9wYXJhbSc7XG5pbXBvcnQge0RhdGFNb2RlbH0gZnJvbSAnLi4vLi4vbW9kZWwvZGF0YU1vZGVsJztcbmltcG9ydCB7Q29sb3JMaWJ9IGZyb20gJy4uLy4uL3V0aWxzL2NvbG9yLWxpYic7XG5pbXBvcnQgKiBhcyBkMyBmcm9tICdkMyc7XG5pbXBvcnQgZXZlbnREcm9wcyBmcm9tICdldmVudC1kcm9wcyc7XG5pbXBvcnQge0dUU0xpYn0gZnJvbSAnLi4vLi4vdXRpbHMvZ3RzLmxpYic7XG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudC10aW1lem9uZSc7XG5pbXBvcnQge3NlbGVjdH0gZnJvbSAnZDMtc2VsZWN0aW9uJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnd2FycHZpZXctZXZlbnQtZHJvcCcsXG4gIHRlbXBsYXRlVXJsOiAnLi93YXJwLXZpZXctZXZlbnQtZHJvcC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3dhcnAtdmlldy1ldmVudC1kcm9wLmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgV2FycFZpZXdFdmVudERyb3BDb21wb25lbnQgZXh0ZW5kcyBXYXJwVmlld0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgQFZpZXdDaGlsZCgnZWxlbUNoYXJ0Jywge3N0YXRpYzogdHJ1ZX0pIGVsZW1DaGFydDogRWxlbWVudFJlZjtcblxuICBASW5wdXQoJ3R5cGUnKSBzZXQgdHlwZSh0eXBlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl90eXBlID0gdHlwZTtcbiAgICB0aGlzLmRyYXdDaGFydCgpO1xuICB9XG5cblxuICBASW5wdXQoJ2hpZGRlbkRhdGEnKSBzZXQgaGlkZGVuRGF0YShoaWRkZW5EYXRhOiBudW1iZXJbXSkge1xuICAgIGNvbnN0IHByZXZpb3VzVmlzaWJpbGl0eSA9IEpTT04uc3RyaW5naWZ5KHRoaXMudmlzaWJpbGl0eSk7XG4gICAgdGhpcy5MT0cuZGVidWcoWydoaWRkZW5EYXRhJywgJ3ByZXZpb3VzVmlzaWJpbGl0eSddLCBwcmV2aW91c1Zpc2liaWxpdHkpO1xuICAgIHRoaXMuX2hpZGRlbkRhdGEgPSBoaWRkZW5EYXRhO1xuICAgIHRoaXMudmlzaWJpbGl0eSA9IFtdO1xuICAgIHRoaXMudmlzaWJsZUd0c0lkLmZvckVhY2goaWQgPT4gdGhpcy52aXNpYmlsaXR5LnB1c2goaGlkZGVuRGF0YS5pbmRleE9mKGlkKSA8IDAgJiYgKGlkICE9PSAtMSkpKTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2hpZGRlbkRhdGEnLCAnaGlkZGVuZHlncmFwaGZ1bGx2J10sIHRoaXMudmlzaWJpbGl0eSk7XG4gICAgY29uc3QgbmV3VmlzaWJpbGl0eSA9IEpTT04uc3RyaW5naWZ5KHRoaXMudmlzaWJpbGl0eSk7XG4gICAgdGhpcy5MT0cuZGVidWcoWydoaWRkZW5EYXRhJywgJ2pzb24nXSwgcHJldmlvdXNWaXNpYmlsaXR5LCBuZXdWaXNpYmlsaXR5KTtcbiAgICBpZiAocHJldmlvdXNWaXNpYmlsaXR5ICE9PSBuZXdWaXNpYmlsaXR5KSB7XG4gICAgICB0aGlzLmRyYXdDaGFydCgpO1xuICAgICAgdGhpcy5MT0cuZGVidWcoWydoaWRkZW5keWdyYXBodHJpZycsICdkZXN0cm95J10sICdyZWRyYXcgYnkgdmlzaWJpbGl0eSBjaGFuZ2UnKTtcbiAgICB9XG4gIH1cblxuICBAT3V0cHV0KCdwb2ludEhvdmVyJykgcG9pbnRIb3ZlciA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCd3YXJwVmlld0NoYXJ0UmVzaXplJykgd2FycFZpZXdDaGFydFJlc2l6ZSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCdjaGFydERyYXcnKSBjaGFydERyYXcgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgnYm91bmRzRGlkQ2hhbmdlJykgYm91bmRzRGlkQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgcHJpdmF0ZSB2aXNpYmlsaXR5OiBib29sZWFuW10gPSBbXTtcbiAgcHJpdmF0ZSBtYXhUaWNrID0gTnVtYmVyLk1JTl9WQUxVRTtcbiAgcHJpdmF0ZSBtaW5UaWNrID0gTnVtYmVyLk1BWF9WQUxVRTtcbiAgcHJpdmF0ZSB2aXNpYmxlR3RzSWQgPSBbXTtcbiAgcHJpdmF0ZSBfdHlwZSA9ICdkcm9wcyc7XG4gIHByaXZhdGUgZXZlbnRDb25mID0ge1xuICAgIGQzLFxuICAgIGF4aXM6IHtcbiAgICAgIHZlcnRpY2FsR3JpZDogdHJ1ZSxcbiAgICAgIHRpY2tQYWRkaW5nOiA2LFxuICAgIH0sXG4gICAgaW5kaWNhdG9yOiBmYWxzZSxcbiAgICBsYWJlbDoge1xuICAgICAgdGV4dDogcm93ID0+IHJvdy5uYW1lLFxuICAgIH0sXG4gICAgZHJvcDoge1xuICAgICAgZGF0ZTogZCA9PiBuZXcgRGF0ZShkLmRhdGUpLFxuICAgICAgY29sb3I6IGQgPT4gZC5jb2xvcixcbiAgICAgIG9uTW91c2VPdmVyOiBnID0+IHtcbiAgICAgICAgdGhpcy5MT0cuZGVidWcoWydvbk1vdXNlT3ZlciddLCBnKTtcbiAgICAgICAgdGhpcy5wb2ludEhvdmVyLmVtaXQoe1xuICAgICAgICAgIHg6IGQzLmV2ZW50Lm9mZnNldFgsXG4gICAgICAgICAgeTogZDMuZXZlbnQub2Zmc2V0WVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgdCA9IGQzXG4gICAgICAgICAgLnNlbGVjdCh0aGlzLnRvb2xUaXAubmF0aXZlRWxlbWVudCk7XG4gICAgICAgIHQudHJhbnNpdGlvbigpXG4gICAgICAgICAgLmR1cmF0aW9uKDIwMClcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKVxuICAgICAgICAgIC5zdHlsZSgncG9pbnRlci1ldmVudHMnLCAnYXV0bycpO1xuICAgICAgICB0Lmh0bWwoYDxkaXYgY2xhc3M9XCJ0b29sdGlwLWJvZHlcIj5cbjxiIGNsYXNzPVwidG9vbHRpcC1kYXRlXCI+JHt0aGlzLl9vcHRpb25zLnRpbWVNb2RlID09PSAndGltZXN0YW1wJ1xuICAgICAgICAgID8gZy5kYXRlXG4gICAgICAgICAgOiAobW9tZW50KGcuZGF0ZS52YWx1ZU9mKCkpLnV0YygpLnRvSVNPU3RyaW5nKCkgfHwgJycpfTwvYj5cbjxkaXY+PGkgY2xhc3M9XCJjaGlwXCIgIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjogJHtDb2xvckxpYi50cmFuc3BhcmVudGl6ZShnLmNvbG9yLCAwLjcpfTtib3JkZXI6IDJweCBzb2xpZCAke2cuY29sb3J9O1wiPjwvaT5cbiR7R1RTTGliLmZvcm1hdExhYmVsKGcubmFtZSl9OiA8c3BhbiBjbGFzcz1cInZhbHVlXCI+JHtnLnZhbHVlfTwvc3Bhbj5cbjwvZGl2PjwvZGl2PmBcbiAgICAgICAgKVxuICAgICAgICAgIC5zdHlsZSgnbGVmdCcsIGAke2QzLmV2ZW50Lm9mZnNldFggLSAzMH1weGApXG4gICAgICAgICAgLnN0eWxlKCd0b3AnLCBgJHtkMy5ldmVudC5vZmZzZXRZICsgMjB9cHhgKTtcbiAgICAgIH0sXG4gICAgICBvbk1vdXNlT3V0OiAoKSA9PiB7XG4gICAgICAgIHNlbGVjdCh0aGlzLnRvb2xUaXAubmF0aXZlRWxlbWVudClcbiAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgLmR1cmF0aW9uKDUwMClcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgICAgIC5zdHlsZSgncG9pbnRlci1ldmVudHMnLCAnbm9uZScpO1xuICAgICAgfSxcbiAgICB9LFxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBlbDogRWxlbWVudFJlZixcbiAgICBwdWJsaWMgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwdWJsaWMgc2l6ZVNlcnZpY2U6IFNpemVTZXJ2aWNlLFxuICAgIHB1YmxpYyBuZ1pvbmU6IE5nWm9uZVxuICApIHtcbiAgICBzdXBlcihlbCwgcmVuZGVyZXIsIHNpemVTZXJ2aWNlLCBuZ1pvbmUpO1xuICAgIHRoaXMuTE9HID0gbmV3IExvZ2dlcihXYXJwVmlld0V2ZW50RHJvcENvbXBvbmVudCwgdGhpcy5fZGVidWcpO1xuICB9XG5cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLl9vcHRpb25zID0gdGhpcy5fb3B0aW9ucyB8fCB0aGlzLmRlZk9wdGlvbnM7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBpZiAoISF0aGlzLmVsZW1DaGFydCkge1xuICAgICAgc2VsZWN0KHRoaXMuZWxlbUNoYXJ0Lm5hdGl2ZUVsZW1lbnQpLnJlbW92ZSgpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZShvcHRpb25zLCByZWZyZXNoKTogdm9pZCB7XG4gICAgdGhpcy5MT0cuZGVidWcoWydvbk9wdGlvbnMnLCAnYmVmb3JlJ10sIHRoaXMuX29wdGlvbnMsIG9wdGlvbnMpO1xuICAgIGlmICghZGVlcEVxdWFsKG9wdGlvbnMsIHRoaXMuX29wdGlvbnMpKSB7XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ29wdGlvbnMnLCAnY2hhbmdlZCddLCBvcHRpb25zKTtcbiAgICAgIHRoaXMuX29wdGlvbnMgPSBDaGFydExpYi5tZXJnZURlZXAodGhpcy5fb3B0aW9ucywgb3B0aW9ucyBhcyBQYXJhbSkgYXMgUGFyYW07XG4gICAgfVxuICAgIHRoaXMuZHJhd0NoYXJ0KCk7XG4gIH1cblxuICB1cGRhdGVCb3VuZHMobWluLCBtYXgpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3VwZGF0ZUJvdW5kcyddLCBtaW4sIG1heCwgdGhpcy5fb3B0aW9ucyk7XG4gICAgdGhpcy5fb3B0aW9ucy5ib3VuZHMubWluRGF0ZSA9IG1pbjtcbiAgICB0aGlzLl9vcHRpb25zLmJvdW5kcy5tYXhEYXRlID0gbWF4O1xuXG4gICAgaWYgKHRoaXMuX29wdGlvbnMudGltZU1vZGUgJiYgdGhpcy5fb3B0aW9ucy50aW1lTW9kZSA9PT0gJ3RpbWVzdGFtcCcpIHtcbiAgICAgIHRoaXMuZXZlbnRDb25mWydyYW5nZSddID0ge3N0YXJ0OiBtaW4sIGVuZDogbWF4fTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ldmVudENvbmZbJ3JhbmdlJ10gPSB7XG4gICAgICAgIHN0YXJ0OiBtb21lbnQudHoobW9tZW50LnV0Yyh0aGlzLm1pblRpY2sgLyB0aGlzLmRpdmlkZXIpLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKS50b0RhdGUoKSxcbiAgICAgICAgZW5kOiBtb21lbnQudHoobW9tZW50LnV0Yyh0aGlzLm1heFRpY2sgLyB0aGlzLmRpdmlkZXIpLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKS50b0RhdGUoKSxcbiAgICAgIH07XG4gICAgfVxuICAgIHRoaXMuZXZlbnRDb25mID0gey4uLnRoaXMuZXZlbnRDb25mfTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3VwZGF0ZUJvdW5kcyddLCB0aGlzLmV2ZW50Q29uZik7XG4gIH1cblxuICBkcmF3Q2hhcnQoKSB7XG4gICAgaWYgKCF0aGlzLmluaXRDaGFydCh0aGlzLmVsKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RyYXdDaGFydCcsICdwbG90bHlEYXRhJ10sIHRoaXMucGxvdGx5RGF0YSwgdGhpcy5fdHlwZSk7XG4gICAgaWYgKHRoaXMuZWxlbUNoYXJ0Lm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gc2VsZWN0KHRoaXMuZWxlbUNoYXJ0Lm5hdGl2ZUVsZW1lbnQpLmRhdGEoW3RoaXMucGxvdGx5RGF0YV0pLmNhbGwoZXZlbnREcm9wcyh0aGlzLmV2ZW50Q29uZikpKTtcbiAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgICAgdGhpcy5jaGFydERyYXcuZW1pdCgpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBjb252ZXJ0KGRhdGE6IERhdGFNb2RlbCk6IGFueVtdIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2NvbnZlcnQnXSwgZGF0YSk7XG4gICAgY29uc3QgZ3RzTGlzdCA9IEdUU0xpYi5mbGF0RGVlcChkYXRhLmRhdGEgYXMgYW55W10pO1xuICAgIGNvbnN0IGRhdGFMaXN0ID0gW107XG4gICAgdGhpcy5MT0cuZGVidWcoWydjb252ZXJ0JywgJ2d0c0xpc3QnXSwgZ3RzTGlzdCk7XG4gICAgaWYgKCFndHNMaXN0IHx8IGd0c0xpc3QubGVuZ3RoID09PSAwIHx8IGd0c0xpc3RbMF0ubGVuZ3RoIDwgMikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBndHNMaXN0LmZvckVhY2goKGd0cywgaSkgPT4ge1xuICAgICAgY29uc3QgYyA9IENvbG9yTGliLmdldENvbG9yKGd0cy5pZCB8fCBpLCB0aGlzLl9vcHRpb25zLnNjaGVtZSk7XG4gICAgICBjb25zdCBjb2xvciA9ICgoZGF0YS5wYXJhbXMgfHwgW10pW2ldIHx8IHtkYXRhc2V0Q29sb3I6IGN9KS5kYXRhc2V0Q29sb3IgfHwgYztcbiAgICAgIGNvbnN0IGRhdGFTZXQgPSB7XG4gICAgICAgIG5hbWU6IEdUU0xpYi5zZXJpYWxpemVHdHNNZXRhZGF0YShndHMpLFxuICAgICAgICBjb2xvcixcbiAgICAgICAgZGF0YTogW11cbiAgICAgIH07XG4gICAgICAoZ3RzLnYgfHwgW10pLmZvckVhY2godmFsdWUgPT4ge1xuICAgICAgICBjb25zdCB0cyA9IHZhbHVlWzBdO1xuICAgICAgICB0aGlzLm1pblRpY2sgPSBNYXRoLm1pbih0aGlzLm1pblRpY2ssIHRzKTtcbiAgICAgICAgdGhpcy5tYXhUaWNrID0gTWF0aC5tYXgodGhpcy5tYXhUaWNrLCB0cyk7XG4gICAgICAgIGlmICh0aGlzLl9vcHRpb25zLnRpbWVNb2RlICYmIHRoaXMuX29wdGlvbnMudGltZU1vZGUgPT09ICd0aW1lc3RhbXAnKSB7XG4gICAgICAgICAgZGF0YVNldC5kYXRhLnB1c2goe2RhdGU6IHRzLCBjb2xvciwgdmFsdWU6IHZhbHVlW3ZhbHVlLmxlbmd0aCAtIDFdfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGF0YVNldC5kYXRhLnB1c2goe1xuICAgICAgICAgICAgZGF0ZTogbW9tZW50LnR6KG1vbWVudC51dGModHMgLyB0aGlzLmRpdmlkZXIpLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKS50b0RhdGUoKSxcbiAgICAgICAgICAgIGNvbG9yLFxuICAgICAgICAgICAgdmFsdWU6IHZhbHVlW3ZhbHVlLmxlbmd0aCAtIDFdLFxuICAgICAgICAgICAgbmFtZTogZGF0YVNldC5uYW1lXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgZGF0YUxpc3QucHVzaChkYXRhU2V0KTtcbiAgICB9KTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2NvbnZlcnQnLCAnZGF0YUxpc3QnXSwgZGF0YUxpc3QpO1xuICAgIHRoaXMuZXZlbnRDb25mWydyYW5nZSddID0ge1xuICAgICAgc3RhcnQ6IG1vbWVudC50eihtb21lbnQudXRjKHRoaXMubWluVGljayAvIHRoaXMuZGl2aWRlciksIHRoaXMuX29wdGlvbnMudGltZVpvbmUpLnRvRGF0ZSgpLFxuICAgICAgZW5kOiBtb21lbnQudHoobW9tZW50LnV0Yyh0aGlzLm1heFRpY2sgLyB0aGlzLmRpdmlkZXIpLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKS50b0RhdGUoKSxcbiAgICB9O1xuICAgIHJldHVybiBkYXRhTGlzdDtcbiAgfVxufVxuIl19