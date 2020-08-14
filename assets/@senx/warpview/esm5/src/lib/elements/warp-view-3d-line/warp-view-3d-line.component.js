/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component, ElementRef, Input, NgZone, Renderer2, ViewEncapsulation } from '@angular/core';
import { WarpViewComponent } from '../warp-view-component';
import { SizeService } from '../../services/resize.service';
import { Logger } from '../../utils/logger';
import { GTSLib } from '../../utils/gts.lib';
import { ColorLib } from '../../utils/color-lib';
var WarpView3dLineComponent = /** @class */ (function (_super) {
    tslib_1.__extends(WarpView3dLineComponent, _super);
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
export { WarpView3dLineComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LTNkLWxpbmUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHNlbngvd2FycHZpZXcvIiwic291cmNlcyI6WyJzcmMvbGliL2VsZW1lbnRzL3dhcnAtdmlldy0zZC1saW5lL3dhcnAtdmlldy0zZC1saW5lLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQVUsU0FBUyxFQUFFLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pHLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3pELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSwrQkFBK0IsQ0FBQztBQUMxRCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFHMUMsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBRTNDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUUvQztJQU02QyxtREFBaUI7SUFxQjVELGlDQUNTLEVBQWMsRUFDZCxRQUFtQixFQUNuQixXQUF3QixFQUN4QixNQUFjO1FBSnZCLFlBTUUsa0JBQU0sRUFBRSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsTUFBTSxDQUFDLFNBRXpDO1FBUFEsUUFBRSxHQUFGLEVBQUUsQ0FBWTtRQUNkLGNBQVEsR0FBUixRQUFRLENBQVc7UUFDbkIsaUJBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIsWUFBTSxHQUFOLE1BQU0sQ0FBUTtRQWxCdkIsWUFBTSxHQUFpQjtZQUNyQixVQUFVLEVBQUUsS0FBSztZQUNqQixLQUFLLEVBQUUsRUFBRTtZQUNULEtBQUssRUFBRSxFQUFFO1lBQ1QsS0FBSyxFQUFFLEVBQUU7WUFDVCxNQUFNLEVBQUU7Z0JBQ04sQ0FBQyxFQUFFLEVBQUU7Z0JBQ0wsQ0FBQyxFQUFFLEVBQUU7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Q0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVyxFQUFFLG1CQUFtQixDQUFDLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDekMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNuRSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ25FLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDbkUsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7SUFDdkIsQ0FBQzs7Z0JBbkhGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsa0JBQWtCO29CQUM1QixnOENBQWlEO29CQUVqRCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsU0FBUzs7aUJBQzNDOzs7O2dCQWZrQixVQUFVO2dCQUF5QixTQUFTO2dCQUV2RCxXQUFXO2dCQUZtQixNQUFNOzs7dUJBa0J6QyxLQUFLLFNBQUMsTUFBTTs7SUE0R2YsOEJBQUM7Q0FBQSxBQXBIRCxDQU02QyxpQkFBaUIsR0E4RzdEO1NBOUdZLHVCQUF1Qjs7O0lBT2xDLHlDQVdFOzs7OztJQUNGLHdDQUF5Qjs7SUFHdkIscUNBQXFCOztJQUNyQiwyQ0FBMEI7O0lBQzFCLDhDQUErQjs7SUFDL0IseUNBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIEVsZW1lbnRSZWYsIElucHV0LCBOZ1pvbmUsIE9uSW5pdCwgUmVuZGVyZXIyLCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1dhcnBWaWV3Q29tcG9uZW50fSBmcm9tICcuLi93YXJwLXZpZXctY29tcG9uZW50JztcbmltcG9ydCB7U2l6ZVNlcnZpY2V9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3Jlc2l6ZS5zZXJ2aWNlJztcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICcuLi8uLi91dGlscy9sb2dnZXInO1xuaW1wb3J0IHtQYXJhbX0gZnJvbSAnLi4vLi4vbW9kZWwvcGFyYW0nO1xuaW1wb3J0IHtEYXRhTW9kZWx9IGZyb20gJy4uLy4uL21vZGVsL2RhdGFNb2RlbCc7XG5pbXBvcnQge0dUU0xpYn0gZnJvbSAnLi4vLi4vdXRpbHMvZ3RzLmxpYic7XG5pbXBvcnQge0dUU30gZnJvbSAnLi4vLi4vbW9kZWwvR1RTJztcbmltcG9ydCB7Q29sb3JMaWJ9IGZyb20gJy4uLy4uL3V0aWxzL2NvbG9yLWxpYic7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3dhcnB2aWV3LTNkLWxpbmUnLFxuICB0ZW1wbGF0ZVVybDogJy4vd2FycC12aWV3LTNkLWxpbmUuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi93YXJwLXZpZXctM2QtbGluZS5jb21wb25lbnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5TaGFkb3dEb21cbn0pXG5leHBvcnQgY2xhc3MgV2FycFZpZXczZExpbmVDb21wb25lbnQgZXh0ZW5kcyBXYXJwVmlld0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgQElucHV0KCd0eXBlJykgc2V0IHR5cGUodHlwZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdHlwZSA9IHR5cGU7XG4gICAgdGhpcy5kcmF3Q2hhcnQoKTtcbiAgfVxuXG4gIGxheW91dDogUGFydGlhbDxhbnk+ID0ge1xuICAgIHNob3dsZWdlbmQ6IGZhbHNlLFxuICAgIHhheGlzOiB7fSxcbiAgICB5YXhpczoge30sXG4gICAgemF4aXM6IHt9LFxuICAgIG1hcmdpbjoge1xuICAgICAgdDogMTAsXG4gICAgICBiOiAyNSxcbiAgICAgIHI6IDEwLFxuICAgICAgbDogMTBcbiAgICB9XG4gIH07XG4gIHByaXZhdGUgX3R5cGUgPSAnbGluZTNkJztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgZWw6IEVsZW1lbnRSZWYsXG4gICAgcHVibGljIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHVibGljIHNpemVTZXJ2aWNlOiBTaXplU2VydmljZSxcbiAgICBwdWJsaWMgbmdab25lOiBOZ1pvbmVcbiAgKSB7XG4gICAgc3VwZXIoZWwsIHJlbmRlcmVyLCBzaXplU2VydmljZSwgbmdab25lKTtcbiAgICB0aGlzLkxPRyA9IG5ldyBMb2dnZXIoV2FycFZpZXczZExpbmVDb21wb25lbnQsIHRoaXMuX2RlYnVnKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuZHJhd0NoYXJ0KCk7XG4gIH1cblxuICB1cGRhdGUob3B0aW9uczogUGFyYW0pOiB2b2lkIHtcbiAgICB0aGlzLmRyYXdDaGFydCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBkcmF3Q2hhcnQoKSB7XG4gICAgaWYgKCF0aGlzLmluaXRDaGFydCh0aGlzLmVsKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnBsb3RseUNvbmZpZy5zY3JvbGxab29tID0gdHJ1ZTtcbiAgICB0aGlzLmJ1aWxkR3JhcGgoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBjb252ZXJ0KGRhdGE6IERhdGFNb2RlbCk6IFBhcnRpYWw8YW55PltdIHtcbiAgICBjb25zdCBkYXRhc2V0OiBQYXJ0aWFsPGFueT5bXSA9IFtdO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnY29udmVydCddLCBkYXRhLCB0aGlzLl9vcHRpb25zLCB0aGlzLl90eXBlKTtcbiAgICBHVFNMaWIuZmxhdERlZXAoR1RTTGliLmZsYXR0ZW5HdHNJZEFycmF5KGRhdGEuZGF0YSBhcyBhbnlbXSwgMCkucmVzKVxuICAgICAgLmZpbHRlcihnID0+IChnLnYgJiYgR1RTTGliLmlzR3RzKGcpKSlcbiAgICAgIC5mb3JFYWNoKChndHM6IEdUUywgaSkgPT4ge1xuICAgICAgICBpZiAoZ3RzLnYpIHtcbiAgICAgICAgICBjb25zdCBsYWJlbCA9IEdUU0xpYi5zZXJpYWxpemVHdHNNZXRhZGF0YShndHMpO1xuICAgICAgICAgIGNvbnN0IGMgPSBDb2xvckxpYi5nZXRDb2xvcihndHMuaWQsIHRoaXMuX29wdGlvbnMuc2NoZW1lKTtcbiAgICAgICAgICBjb25zdCBjb2xvciA9ICgoZGF0YS5wYXJhbXMgfHwgW10pW2ldIHx8IHtkYXRhc2V0Q29sb3I6IGN9KS5kYXRhc2V0Q29sb3IgfHwgYztcbiAgICAgICAgICBjb25zdCBzZXJpZXM6IFBhcnRpYWw8YW55PiA9IHtcbiAgICAgICAgICAgIG1vZGU6ICdsaW5lJyxcbiAgICAgICAgICAgIHR5cGU6ICdzY2F0dGVyM2QnLFxuICAgICAgICAgICAgbWFya2VyOiB7XG4gICAgICAgICAgICAgIGNvbG9yOiBDb2xvckxpYi50cmFuc3BhcmVudGl6ZShjb2xvciksXG4gICAgICAgICAgICAgIHNpemU6IDMsXG4gICAgICAgICAgICAgIHN5bWJvbDogJ2NpcmNsZScsXG4gICAgICAgICAgICAgIGxpbmU6IHtcbiAgICAgICAgICAgICAgICBjb2xvcixcbiAgICAgICAgICAgICAgICB3aWR0aDogMFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbGluZToge1xuICAgICAgICAgICAgICBjb2xvcixcbiAgICAgICAgICAgICAgd2lkdGg6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBuYW1lOiBsYWJlbCxcbiAgICAgICAgICAgIHg6IFtdLFxuICAgICAgICAgICAgeTogW10sXG4gICAgICAgICAgICB6OiBbXSxcbiAgICAgICAgICAgIC8vICAgICBob3ZlcmluZm86ICdub25lJyxcbiAgICAgICAgICB9O1xuICAgICAgICAgIGd0cy52LmZvckVhY2godmFsdWUgPT4ge1xuICAgICAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA+IDIpIHsgLy8gbGF0IGxvblxuICAgICAgICAgICAgICBzZXJpZXMueC5wdXNoKHZhbHVlWzFdKTtcbiAgICAgICAgICAgICAgc2VyaWVzLnkucHVzaCh2YWx1ZVsyXSk7XG4gICAgICAgICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPiA0KSB7XG4gICAgICAgICAgICAgICAgc2VyaWVzLnoucHVzaCh2YWx1ZVszXSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VyaWVzLnoucHVzaCgwKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc2VyaWVzLngucHVzaCh2YWx1ZVswXSk7XG4gICAgICAgICAgICAgIHNlcmllcy55LnB1c2godmFsdWVbMV0pO1xuICAgICAgICAgICAgICBzZXJpZXMuei5wdXNoKDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGRhdGFzZXQucHVzaChzZXJpZXMpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICByZXR1cm4gZGF0YXNldDtcbiAgfVxuXG4gIHByaXZhdGUgYnVpbGRHcmFwaCgpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RyYXdDaGFydCcsICd0aGlzLmxheW91dCddLCB0aGlzLnJlc3BvbnNpdmUpO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZHJhd0NoYXJ0JywgJ3RoaXMubGF5b3V0J10sIHRoaXMubGF5b3V0KTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RyYXdDaGFydCcsICd0aGlzLnBsb3RseUNvbmZpZyddLCB0aGlzLnBsb3RseUNvbmZpZyk7XG4gICAgdGhpcy5sYXlvdXQuc2hvd2xlZ2VuZCA9IHRoaXMuc2hvd0xlZ2VuZDtcbiAgICB0aGlzLmxheW91dC55YXhpcy5jb2xvciA9IHRoaXMuZ2V0R3JpZENvbG9yKHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XG4gICAgdGhpcy5sYXlvdXQueGF4aXMuY29sb3IgPSB0aGlzLmdldEdyaWRDb2xvcih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgIHRoaXMubGF5b3V0LnpheGlzLmNvbG9yID0gdGhpcy5nZXRHcmlkQ29sb3IodGhpcy5lbC5uYXRpdmVFbGVtZW50KTtcbiAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgfVxufVxuIl19