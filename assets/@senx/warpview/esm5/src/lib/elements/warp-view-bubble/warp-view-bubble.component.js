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
import { ColorLib } from '../../utils/color-lib';
import { SizeService } from '../../services/resize.service';
import { Logger } from '../../utils/logger';
import { GTSLib } from '../../utils/gts.lib';
import moment from 'moment-timezone';
var WarpViewBubbleComponent = /** @class */ (function (_super) {
    tslib_1.__extends(WarpViewBubbleComponent, _super);
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
export { WarpViewBubbleComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LWJ1YmJsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VueC93YXJwdmlldy8iLCJzb3VyY2VzIjpbInNyYy9saWIvZWxlbWVudHMvd2FycC12aWV3LWJ1YmJsZS93YXJwLXZpZXctYnViYmxlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFVLFNBQVMsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNsRyxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUd6RCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDL0MsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBQzFELE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUMxQyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDM0MsT0FBTyxNQUFNLE1BQU0saUJBQWlCLENBQUM7QUFFckM7SUFNNkMsbURBQWlCO0lBZ0I1RCxpQ0FDUyxFQUFjLEVBQ2QsUUFBbUIsRUFDbkIsV0FBd0IsRUFDeEIsTUFBYztRQUp2QixZQU1FLGtCQUFNLEVBQUUsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLE1BQU0sQ0FBQyxTQUV6QztRQVBRLFFBQUUsR0FBRixFQUFFLENBQVk7UUFDZCxjQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ25CLGlCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLFlBQU0sR0FBTixNQUFNLENBQVE7UUFsQnZCLFlBQU0sR0FBaUI7WUFDckIsVUFBVSxFQUFFLEtBQUs7WUFDakIsS0FBSyxFQUFFLEVBQUU7WUFDVCxTQUFTLEVBQUUsU0FBUztZQUNwQixhQUFhLEVBQUUsRUFBRTtZQUNqQixLQUFLLEVBQUUsRUFB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LEdBc0c3RDtTQXRHWSx1QkFBdUI7OztJQUVsQyx5Q0FZRTs7SUFHQSxxQ0FBcUI7O0lBQ3JCLDJDQUEwQjs7SUFDMUIsOENBQStCOztJQUMvQix5Q0FBcUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogIENvcHlyaWdodCAyMDIwICBTZW5YIFMuQS5TLlxuICpcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50LCBFbGVtZW50UmVmLCBOZ1pvbmUsIE9uSW5pdCwgUmVuZGVyZXIyLCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1dhcnBWaWV3Q29tcG9uZW50fSBmcm9tICcuLi93YXJwLXZpZXctY29tcG9uZW50JztcbmltcG9ydCB7UGFyYW19IGZyb20gJy4uLy4uL21vZGVsL3BhcmFtJztcbmltcG9ydCB7RGF0YU1vZGVsfSBmcm9tICcuLi8uLi9tb2RlbC9kYXRhTW9kZWwnO1xuaW1wb3J0IHtDb2xvckxpYn0gZnJvbSAnLi4vLi4vdXRpbHMvY29sb3ItbGliJztcbmltcG9ydCB7U2l6ZVNlcnZpY2V9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3Jlc2l6ZS5zZXJ2aWNlJztcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICcuLi8uLi91dGlscy9sb2dnZXInO1xuaW1wb3J0IHtHVFNMaWJ9IGZyb20gJy4uLy4uL3V0aWxzL2d0cy5saWInO1xuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQtdGltZXpvbmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICd3YXJwdmlldy1idWJibGUnLFxuICB0ZW1wbGF0ZVVybDogJy4vd2FycC12aWV3LWJ1YmJsZS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3dhcnAtdmlldy1idWJibGUuY29tcG9uZW50LnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uU2hhZG93RG9tXG59KVxuZXhwb3J0IGNsYXNzIFdhcnBWaWV3QnViYmxlQ29tcG9uZW50IGV4dGVuZHMgV2FycFZpZXdDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIGxheW91dDogUGFydGlhbDxhbnk+ID0ge1xuICAgIHNob3dsZWdlbmQ6IGZhbHNlLFxuICAgIHhheGlzOiB7fSxcbiAgICBob3Zlcm1vZGU6ICdjbG9zZXN0JyxcbiAgICBob3ZlcmRpc3RhbmNlOiAyMCxcbiAgICB5YXhpczoge30sXG4gICAgbWFyZ2luOiB7XG4gICAgICB0OiAxMCxcbiAgICAgIGI6IDI1LFxuICAgICAgcjogMTAsXG4gICAgICBsOiA1MFxuICAgIH1cbiAgfTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgZWw6IEVsZW1lbnRSZWYsXG4gICAgcHVibGljIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHVibGljIHNpemVTZXJ2aWNlOiBTaXplU2VydmljZSxcbiAgICBwdWJsaWMgbmdab25lOiBOZ1pvbmVcbiAgKSB7XG4gICAgc3VwZXIoZWwsIHJlbmRlcmVyLCBzaXplU2VydmljZSwgbmdab25lKTtcbiAgICB0aGlzLkxPRyA9IG5ldyBMb2dnZXIoV2FycFZpZXdCdWJibGVDb21wb25lbnQsIHRoaXMuX2RlYnVnKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuZHJhd0NoYXJ0KCk7XG4gIH1cblxuICB1cGRhdGUob3B0aW9uczogUGFyYW0pOiB2b2lkIHtcbiAgICB0aGlzLmRyYXdDaGFydCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBkcmF3Q2hhcnQoKSB7XG4gICAgaWYgKCF0aGlzLmluaXRDaGFydCh0aGlzLmVsKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnBsb3RseUNvbmZpZy5zY3JvbGxab29tID0gdHJ1ZTtcbiAgICB0aGlzLmJ1aWxkR3JhcGgoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBjb252ZXJ0KGRhdGE6IERhdGFNb2RlbCk6IFBhcnRpYWw8YW55PltdIHtcbiAgICBjb25zdCBkYXRhc2V0ID0gW107XG4gICAgR1RTTGliLmZsYXREZWVwKGRhdGEuZGF0YSBhcyBhbnkgW10pLmZvckVhY2goKGd0cywgaSkgPT4ge1xuICAgICAgY29uc3QgbGFiZWwgPSBPYmplY3Qua2V5cyhndHMpWzBdO1xuICAgICAgY29uc3QgYyA9IENvbG9yTGliLmdldENvbG9yKGd0cy5pZCB8fCBpLCB0aGlzLl9vcHRpb25zLnNjaGVtZSk7XG4gICAgICBjb25zdCBjb2xvciA9ICgoZGF0YS5wYXJhbXMgfHwgW10pW2ldIHx8IHtkYXRhc2V0Q29sb3I6IGN9KS5kYXRhc2V0Q29sb3IgfHwgYztcbiAgICAgIGNvbnN0IHNlcmllczogUGFydGlhbDxhbnk+ID0ge1xuICAgICAgICB0eXBlOiAnc2NhdHRlcmdsJyxcbiAgICAgICAgbW9kZTogJ21hcmtlcnMnLFxuICAgICAgICBuYW1lOiBsYWJlbCxcbiAgICAgICAgdGV4dDogbGFiZWwsXG4gICAgICAgIHg6IFtdLFxuICAgICAgICB5OiBbXSxcbiAgICAgICAgaG92ZXJpbmZvOiAnbm9uZScsXG4gICAgICAgIG1hcmtlcjoge1xuICAgICAgICAgIGNvbG9yOiBDb2xvckxpYi50cmFuc3BhcmVudGl6ZShjb2xvciksXG4gICAgICAgICAgbGluZToge1xuICAgICAgICAgICAgY29sb3JcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNpemU6IFtdXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBpZiAoR1RTTGliLmlzR3RzKGd0cykpIHtcbiAgICAgICAgY29uc3QgdGlja3MgPSBndHMudi5tYXAodCA9PiB0WzBdKTtcbiAgICAgICAgY29uc3QgdmFsdWVzID0gZ3RzLnYubWFwKHQgPT4gdFt0Lmxlbmd0aCAtIDFdKTtcbiAgICAgICAgY29uc3Qgc2l6ZXMgPSBuZXcgQXJyYXkoZ3RzLnYubGVuZ3RoKS5maWxsKDEwKTtcbiAgICAgICAgaWYgKHRoaXMuX29wdGlvbnMudGltZU1vZGUgPT09ICd0aW1lc3RhbXAnKSB7XG4gICAgICAgICAgc2VyaWVzLnggPSB0aWNrcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAodGhpcy5fb3B0aW9ucy50aW1lWm9uZSAhPT0gJ1VUQycpIHtcbiAgICAgICAgICAgIHNlcmllcy54ID0gdGlja3MubWFwKHQgPT4gbW9tZW50LnV0Yyh0IC8gdGhpcy5kaXZpZGVyKS50eih0aGlzLl9vcHRpb25zLnRpbWVab25lKS50b0lTT1N0cmluZygpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VyaWVzLnggPSB0aWNrcy5tYXAodCA9PiBtb21lbnQudXRjKHQgLyB0aGlzLmRpdmlkZXIpLnRvSVNPU3RyaW5nKCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzZXJpZXMueSA9IHZhbHVlcztcbiAgICAgICAgc2VyaWVzLm1hcmtlci5zaXplID0gc2l6ZXM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBndHNbbGFiZWxdLmZvckVhY2godmFsdWUgPT4ge1xuICAgICAgICAgIHNlcmllcy55LnB1c2godmFsdWVbMF0pO1xuICAgICAgICAgIHNlcmllcy54LnB1c2godmFsdWVbMV0pO1xuICAgICAgICAgIHNlcmllcy5tYXJrZXIuc2l6ZS5wdXNoKHZhbHVlWzJdKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBkYXRhc2V0LnB1c2goc2VyaWVzKTtcbiAgICB9KTtcbiAgICB0aGlzLm5vRGF0YSA9IGRhdGFzZXQubGVuZ3RoID09PSAwO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnY29udmVydCcsICdkYXRhc2V0J10sIGRhdGFzZXQpO1xuICAgIHJldHVybiBkYXRhc2V0O1xuICB9XG5cbiAgcHJpdmF0ZSBidWlsZEdyYXBoKCkge1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZHJhd0NoYXJ0JywgJ3RoaXMucmVzcG9uc2l2ZSddLCB0aGlzLl9yZXNwb25zaXZlKTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RyYXdDaGFydCcsICd0aGlzLmxheW91dCddLCB0aGlzLmxheW91dCk7XG4gICAgdGhpcy5MT0cuZGVidWcoWydkcmF3Q2hhcnQnLCAndGhpcy5wbG90bHlDb25maWcnXSwgdGhpcy5wbG90bHlDb25maWcpO1xuICAgIHRoaXMubGF5b3V0LnNob3dsZWdlbmQgPSB0aGlzLnNob3dMZWdlbmQ7XG4gICAgdGhpcy5sYXlvdXQueWF4aXMuY29sb3IgPSB0aGlzLmdldEdyaWRDb2xvcih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgIHRoaXMubGF5b3V0LnhheGlzLmNvbG9yID0gdGhpcy5nZXRHcmlkQ29sb3IodGhpcy5lbC5uYXRpdmVFbGVtZW50KTtcbiAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgfVxufVxuIl19