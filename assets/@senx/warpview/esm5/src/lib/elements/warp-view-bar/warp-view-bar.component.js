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
import { Component, ElementRef, NgZone, Renderer2, ViewEncapsulation } from '@angular/core';
import { WarpViewComponent } from '../warp-view-component';
import { GTSLib } from '../../utils/gts.lib';
import { ColorLib } from '../../utils/color-lib';
import moment from 'moment-timezone';
import { SizeService } from '../../services/resize.service';
import { Logger } from '../../utils/logger';
import { Timsort } from '../../utils/timsort';
var WarpViewBarComponent = /** @class */ (function (_super) {
    tslib_1.__extends(WarpViewBarComponent, _super);
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
                            series_1.x.push(moment.tz(moment.utc(ts / _this.divider), _this._options.timeZone).toISOString());
                        }
                    }
                    else {
                        series_1.x.push(value[value.length - 1]);
                        if (_this._options.timeMode && _this._options.timeMode === 'timestamp') {
                            series_1.y.push(ts);
                        }
                        else {
                            series_1.y.push(moment.tz(moment.utc(ts / _this.divider), _this._options.timeZone).toISOString());
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
export { WarpViewBarComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LWJhci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VueC93YXJwdmlldy8iLCJzb3VyY2VzIjpbInNyYy9saWIvZWxlbWVudHMvd2FycC12aWV3LWJhci93YXJwLXZpZXctYmFyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFVLFNBQVMsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNsRyxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUd6RCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDM0MsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9DLE9BQU8sTUFBTSxNQUFNLGlCQUFpQixDQUFDO0FBQ3JDLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSwrQkFBK0IsQ0FBQztBQUMxRCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDMUMsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBRTVDO0lBTTBDLGdEQUFpQjtJQWtCekQsOEJBQ1MsRUFBYyxFQUNkLFFBQW1CLEVBQ25CLFdBQXdCLEVBQ3hCLE1BQWM7UUFKdkIsWUFNRSxrQkFBTSxFQUFFLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxNQUFNLENBQUMsU0FFekM7UUFQUSxRQUFFLEdBQUYsRUFBRSxDQUFZO1FBQ2QsY0FBUSxHQUFSLFFBQVEsQ0FBVztRQUNuQixpQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4QixZQUFNLEdBQU4sTUFBTSxDQUFRO1FBcEJ2QixZQUFNLEdBQWlCO1lBQ3JCLFVBQVUsRUFBRSxLQUFLO1lBQ2pCLEtBQUssRUFBRSxFQUFFO1lBQ1QsS0FBSyxFQUFFO2dCQUNMLGNBQWMs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Q0FBQztRQUN2RSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQzFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUNoRSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ25FLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDbkUsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7SUFDdkIsQ0FBQzs7Z0JBbEtGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsY0FBYztvQkFDeEIscStDQUE2QztvQkFFN0MsYUFBYSxFQUFFLGlCQUFpQixDQUFDLFNBQVM7O2lCQUMzQzs7OztnQkFoQmtCLFVBQVU7Z0JBQWtCLFNBQVM7Z0JBT2hELFdBQVc7Z0JBUFksTUFBTTs7SUE4S3JDLDJCQUFDO0NBQUEsQUFuS0QsQ0FNMEMsaUJBQWlCLEdBNkoxRDtTQTdKWSxvQkFBb0I7OztJQUUvQixzQ0FjRTs7SUFHQSxrQ0FBcUI7O0lBQ3JCLHdDQUEwQjs7SUFDMUIsMkNBQStCOztJQUMvQixzQ0FBcUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogIENvcHlyaWdodCAyMDIwICBTZW5YIFMuQS5TLlxuICpcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50LCBFbGVtZW50UmVmLCBOZ1pvbmUsIE9uSW5pdCwgUmVuZGVyZXIyLCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1dhcnBWaWV3Q29tcG9uZW50fSBmcm9tICcuLi93YXJwLXZpZXctY29tcG9uZW50JztcbmltcG9ydCB7UGFyYW19IGZyb20gJy4uLy4uL21vZGVsL3BhcmFtJztcbmltcG9ydCB7RGF0YU1vZGVsfSBmcm9tICcuLi8uLi9tb2RlbC9kYXRhTW9kZWwnO1xuaW1wb3J0IHtHVFNMaWJ9IGZyb20gJy4uLy4uL3V0aWxzL2d0cy5saWInO1xuaW1wb3J0IHtDb2xvckxpYn0gZnJvbSAnLi4vLi4vdXRpbHMvY29sb3ItbGliJztcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50LXRpbWV6b25lJztcbmltcG9ydCB7U2l6ZVNlcnZpY2V9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3Jlc2l6ZS5zZXJ2aWNlJztcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICcuLi8uLi91dGlscy9sb2dnZXInO1xuaW1wb3J0IHtUaW1zb3J0fSBmcm9tICcuLi8uLi91dGlscy90aW1zb3J0JztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnd2FycHZpZXctYmFyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3dhcnAtdmlldy1iYXIuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi93YXJwLXZpZXctYmFyLmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLlNoYWRvd0RvbVxufSlcbmV4cG9ydCBjbGFzcyBXYXJwVmlld0JhckNvbXBvbmVudCBleHRlbmRzIFdhcnBWaWV3Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICBsYXlvdXQ6IFBhcnRpYWw8YW55PiA9IHtcbiAgICBzaG93bGVnZW5kOiBmYWxzZSxcbiAgICB4YXhpczoge30sXG4gICAgeWF4aXM6IHtcbiAgICAgIGV4cG9uZW50Zm9ybWF0OiAnbm9uZScsXG4gICAgICBmaXhlZHJhbmdlOiB0cnVlLFxuICAgICAgc2hvd2xpbmU6IHRydWVcbiAgICB9LFxuICAgIG1hcmdpbjoge1xuICAgICAgdDogMTAsXG4gICAgICBiOiA0MCxcbiAgICAgIHI6IDEwLFxuICAgICAgbDogNTBcbiAgICB9XG4gIH07XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGVsOiBFbGVtZW50UmVmLFxuICAgIHB1YmxpYyByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHB1YmxpYyBzaXplU2VydmljZTogU2l6ZVNlcnZpY2UsXG4gICAgcHVibGljIG5nWm9uZTogTmdab25lXG4gICkge1xuICAgIHN1cGVyKGVsLCByZW5kZXJlciwgc2l6ZVNlcnZpY2UsIG5nWm9uZSk7XG4gICAgdGhpcy5MT0cgPSBuZXcgTG9nZ2VyKFdhcnBWaWV3QmFyQ29tcG9uZW50LCB0aGlzLl9kZWJ1Zyk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmRyYXdDaGFydCgpO1xuICB9XG5cbiAgdXBkYXRlKG9wdGlvbnM6IFBhcmFtKTogdm9pZCB7XG4gICAgdGhpcy5kcmF3Q2hhcnQoKTtcbiAgfVxuXG4gIHByaXZhdGUgZHJhd0NoYXJ0KCkge1xuICAgIGlmICghdGhpcy5pbml0Q2hhcnQodGhpcy5lbCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5wbG90bHlDb25maWcuc2Nyb2xsWm9vbSA9IHRydWU7XG4gICAgdGhpcy5idWlsZEdyYXBoKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgY29udmVydChkYXRhOiBEYXRhTW9kZWwpOiBQYXJ0aWFsPGFueT5bXSB7XG4gICAgbGV0IGd0c0xpc3QgPSBbXTtcbiAgICBpZiAoR1RTTGliLmlzQXJyYXkoZGF0YS5kYXRhKSkge1xuICAgICAgZGF0YS5kYXRhID0gR1RTTGliLmZsYXREZWVwKGRhdGEuZGF0YSBhcyBhbnlbXSk7XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2NvbnZlcnQnLCAnaXNBcnJheSddKTtcbiAgICAgIGlmIChkYXRhLmRhdGEubGVuZ3RoID4gMCAmJiBHVFNMaWIuaXNHdHMoZGF0YS5kYXRhWzBdKSkge1xuICAgICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2NvbnZlcnQnLCAnaXNBcnJheSAyJ10pO1xuICAgICAgICBndHNMaXN0ID0gR1RTTGliLmZsYXR0ZW5HdHNJZEFycmF5KGRhdGEuZGF0YSBhcyBhbnlbXSwgMCkucmVzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5MT0cuZGVidWcoWydjb252ZXJ0JywgJ2lzQXJyYXkgMyddKTtcbiAgICAgICAgZ3RzTGlzdCA9IGRhdGEuZGF0YSBhcyBhbnlbXTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5MT0cuZGVidWcoWydjb252ZXJ0JywgJ25vdCBhcnJheSddKTtcbiAgICAgIGd0c0xpc3QgPSBbZGF0YS5kYXRhXTtcbiAgICB9XG4gICAgdGhpcy5MT0cuZGVidWcoWydjb252ZXJ0JywgJ2d0c0xpc3QnXSwgZ3RzTGlzdCk7XG4gICAgY29uc3QgZGF0YXNldCA9IFtdO1xuICAgIGd0c0xpc3QuZm9yRWFjaCgoZ3RzLCBpKSA9PiB7XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2NvbnZlcnQnLCAnZ3RzIGl0ZW0nXSwgZ3RzKTtcbiAgICAgIGlmIChndHMudikge1xuICAgICAgICBUaW1zb3J0LnNvcnQoZ3RzLnYsIChhLCBiKSA9PiBhWzBdIC0gYlswXSk7XG4gICAgICAgIGNvbnN0IGxhYmVsID0gR1RTTGliLnNlcmlhbGl6ZUd0c01ldGFkYXRhKGd0cyk7XG4gICAgICAgIGNvbnN0IGMgPSBDb2xvckxpYi5nZXRDb2xvcihndHMuaWQgfHwgaSwgdGhpcy5fb3B0aW9ucy5zY2hlbWUpO1xuICAgICAgICBjb25zdCBjb2xvciA9ICgoZGF0YS5wYXJhbXMgfHwgW10pW2ldIHx8IHtkYXRhc2V0Q29sb3I6IGN9KS5kYXRhc2V0Q29sb3IgfHwgYztcbiAgICAgICAgY29uc3Qgc2VyaWVzOiBQYXJ0aWFsPGFueT4gPSB7XG4gICAgICAgICAgdHlwZTogJ2JhcicsXG4gICAgICAgICAgbW9kZTogJ2xpbmVzK21hcmtlcnMnLFxuICAgICAgICAgIG5hbWU6IGxhYmVsLFxuICAgICAgICAgIHRleHQ6IGxhYmVsLFxuICAgICAgICAgIG9yaWVudGF0aW9uOiB0aGlzLl9vcHRpb25zLmhvcml6b250YWwgPyAnaCcgOiAndicsXG4gICAgICAgICAgeDogW10sXG4gICAgICAgICAgeTogW10sXG4gICAgICAgICAgaG92ZXJpbmZvOiAnbm9uZScsXG4gICAgICAgICAgbWFya2VyOiB7XG4gICAgICAgICAgICBjb2xvcjogQ29sb3JMaWIudHJhbnNwYXJlbnRpemUoY29sb3IpLFxuICAgICAgICAgICAgbGluZToge1xuICAgICAgICAgICAgICBjb2xvcixcbiAgICAgICAgICAgICAgd2lkdGg6IDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGd0cy52LmZvckVhY2godmFsdWUgPT4ge1xuICAgICAgICAgIGNvbnN0IHRzID0gdmFsdWVbMF07XG4gICAgICAgICAgaWYgKCF0aGlzLl9vcHRpb25zLmhvcml6b250YWwpIHtcbiAgICAgICAgICAgIHNlcmllcy55LnB1c2godmFsdWVbdmFsdWUubGVuZ3RoIC0gMV0pO1xuICAgICAgICAgICAgaWYgKHRoaXMuX29wdGlvbnMudGltZU1vZGUgJiYgdGhpcy5fb3B0aW9ucy50aW1lTW9kZSA9PT0gJ3RpbWVzdGFtcCcpIHtcbiAgICAgICAgICAgICAgc2VyaWVzLngucHVzaCh0cyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzZXJpZXMueC5wdXNoKG1vbWVudC50eihtb21lbnQudXRjKHRzIC8gdGhpcy5kaXZpZGVyKSwgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSkudG9JU09TdHJpbmcoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlcmllcy54LnB1c2godmFsdWVbdmFsdWUubGVuZ3RoIC0gMV0pO1xuICAgICAgICAgICAgaWYgKHRoaXMuX29wdGlvbnMudGltZU1vZGUgJiYgdGhpcy5fb3B0aW9ucy50aW1lTW9kZSA9PT0gJ3RpbWVzdGFtcCcpIHtcbiAgICAgICAgICAgICAgc2VyaWVzLnkucHVzaCh0cyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzZXJpZXMueS5wdXNoKG1vbWVudC50eihtb21lbnQudXRjKHRzIC8gdGhpcy5kaXZpZGVyKSwgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSkudG9JU09TdHJpbmcoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZGF0YXNldC5wdXNoKHNlcmllcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9vcHRpb25zLnRpbWVNb2RlID0gJ2N1c3RvbSc7XG4gICAgICAgIHRoaXMuTE9HLmRlYnVnKFsnY29udmVydCcsICdndHMnXSwgZ3RzKTtcbiAgICAgICAgKGd0cy5jb2x1bW5zIHx8IFtdKS5mb3JFYWNoKChsYWJlbCwgaW5kZXgpID0+IHtcbiAgICAgICAgICBjb25zdCBjID0gQ29sb3JMaWIuZ2V0Q29sb3IoZ3RzLmlkIHx8IGluZGV4LCB0aGlzLl9vcHRpb25zLnNjaGVtZSk7XG4gICAgICAgICAgY29uc3QgY29sb3IgPSAoKGRhdGEucGFyYW1zIHx8IFtdKVtpbmRleF0gfHwge2RhdGFzZXRDb2xvcjogY30pLmRhdGFzZXRDb2xvciB8fCBjO1xuICAgICAgICAgIGNvbnN0IHNlcmllczogUGFydGlhbDxhbnk+ID0ge1xuICAgICAgICAgICAgdHlwZTogJ2JhcicsXG4gICAgICAgICAgICBtb2RlOiAnbGluZXMrbWFya2VycycsXG4gICAgICAgICAgICBuYW1lOiBsYWJlbCxcbiAgICAgICAgICAgIHRleHQ6IGxhYmVsLFxuICAgICAgICAgICAgb3JpZW50YXRpb246IHRoaXMuX29wdGlvbnMuaG9yaXpvbnRhbCA/ICdoJyA6ICd2JyxcbiAgICAgICAgICAgIHg6IFtdLFxuICAgICAgICAgICAgeTogW10sXG4gICAgICAgICAgICBob3ZlcmluZm86ICdub25lJyxcbiAgICAgICAgICAgIG1hcmtlcjoge1xuICAgICAgICAgICAgICBjb2xvcjogQ29sb3JMaWIudHJhbnNwYXJlbnRpemUoY29sb3IpLFxuICAgICAgICAgICAgICBsaW5lOiB7XG4gICAgICAgICAgICAgICAgY29sb3IsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgICAgaWYgKHRoaXMuX29wdGlvbnMuaG9yaXpvbnRhbCkge1xuICAgICAgICAgICAgKGd0cy5yb3dzIHx8IFtdKS5mb3JFYWNoKHIgPT4ge1xuICAgICAgICAgICAgICBzZXJpZXMueS51bnNoaWZ0KHJbMF0pO1xuICAgICAgICAgICAgICBzZXJpZXMueC5wdXNoKHJbaW5kZXggKyAxXSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgKGd0cy5yb3dzIHx8IFtdKS5mb3JFYWNoKHIgPT4ge1xuICAgICAgICAgICAgICBzZXJpZXMueC5wdXNoKHJbMF0pO1xuICAgICAgICAgICAgICBzZXJpZXMueS5wdXNoKHJbaW5kZXggKyAxXSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZGF0YXNldC5wdXNoKHNlcmllcyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnY29udmVydCcsICdkYXRhc2V0J10sIGRhdGFzZXQsIHRoaXMuX29wdGlvbnMuaG9yaXpvbnRhbCk7XG4gICAgcmV0dXJuIGRhdGFzZXQ7XG4gIH1cblxuICBwcml2YXRlIGJ1aWxkR3JhcGgoKSB7XG4gICAgdGhpcy5MT0cuZGVidWcoWydidWlsZEdyYXBoJywgJ3RoaXMubGF5b3V0J10sIHRoaXMucmVzcG9uc2l2ZSk7XG4gICAgdGhpcy5MT0cuZGVidWcoWydidWlsZEdyYXBoJywgJ3RoaXMubGF5b3V0J10sIHRoaXMubGF5b3V0KTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2J1aWxkR3JhcGgnLCAndGhpcy5wbG90bHlDb25maWcnXSwgdGhpcy5wbG90bHlDb25maWcpO1xuICAgIHRoaXMubGF5b3V0LnNob3dsZWdlbmQgPSB0aGlzLl9zaG93TGVnZW5kO1xuICAgIHRoaXMubGF5b3V0LmJhcm1vZGUgPSB0aGlzLl9vcHRpb25zLnN0YWNrZWQgPyAnc3RhY2snIDogJ2dyb3VwJztcbiAgICB0aGlzLmxheW91dC55YXhpcy5jb2xvciA9IHRoaXMuZ2V0R3JpZENvbG9yKHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XG4gICAgdGhpcy5sYXlvdXQueGF4aXMuY29sb3IgPSB0aGlzLmdldEdyaWRDb2xvcih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICB9XG59XG4iXX0=