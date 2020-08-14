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
import { MapLib } from '../../utils/map-lib';
var WarpViewGlobeComponent = /** @class */ (function (_super) {
    tslib_1.__extends(WarpViewGlobeComponent, _super);
    function WarpViewGlobeComponent(el, renderer, sizeService, ngZone) {
        var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
        _this.el = el;
        _this.renderer = renderer;
        _this.sizeService = sizeService;
        _this.ngZone = ngZone;
        _this.layout = {
            showlegend: false,
            margin: {
                t: 10,
                b: 25,
                r: 10,
                l: 10
            },
            geo: {
                projection: {
                    type: 'orthographic',
                },
                showframe: true,
                fitbounds: 'locations',
                showocean: true,
                oceancolor: ColorLib.transparentize('#004eff', 0.2),
                showland: true,
                landcolor: ColorLib.transparentize('#6F694E', 0.2),
                showlakes: true,
                lakecolor: ColorLib.transparentize('#004eff', 0.2),
                showcountries: true,
                lonaxis: {
                    showgrid: true,
                    gridcolor: 'rgb(102, 102, 102)'
                },
                lataxis: {
                    showgrid: true,
                    gridcolor: 'rgb(102, 102, 102)'
                }
            }
        };
        _this._type = 'scattergeo';
        _this.geoData = [];
        _this.LOG = new Logger(WarpViewGlobeComponent, _this._debug);
        return _this;
    }
    Object.defineProperty(WarpViewGlobeComponent.prototype, "type", {
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
    WarpViewGlobeComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.drawChart();
    };
    /**
     * @param {?} options
     * @return {?}
     */
    WarpViewGlobeComponent.prototype.update = /**
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
    WarpViewGlobeComponent.prototype.drawChart = /**
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
    WarpViewGlobeComponent.prototype.convert = /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    function (data) {
        var _this = this;
        /** @type {?} */
        var dataset = [];
        this.geoData = [];
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
                var geoData_1 = { path: [] };
                /** @type {?} */
                var label = GTSLib.serializeGtsMetadata(gts);
                /** @type {?} */
                var c = ColorLib.getColor(gts.id, _this._options.scheme);
                /** @type {?} */
                var color = ((data.params || [])[i] || { datasetColor: c }).datasetColor || c;
                /** @type {?} */
                var series_1 = {
                    mode: 'lines',
                    type: 'scattergeo',
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
                    lon: [],
                    lat: [],
                    hoverinfo: 'none',
                };
                gts.v.forEach((/**
                 * @param {?} value
                 * @return {?}
                 */
                function (value) {
                    if (value.length > 2) {
                        series_1.lat.push(value[1]);
                        series_1.lon.push(value[2]);
                        geoData_1.path.push({ lat: value[1], lon: value[2] });
                    }
                }));
                _this.geoData.push(geoData_1);
                dataset.push(series_1);
            }
        }));
        return dataset;
    };
    /**
     * @private
     * @return {?}
     */
    WarpViewGlobeComponent.prototype.buildGraph = /**
     * @private
     * @return {?}
     */
    function () {
        this.LOG.debug(['drawChart', 'this.layout'], this._responsive);
        this.LOG.debug(['drawChart', 'this.layout'], this.layout);
        this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig);
        this.layout.showlegend = this._showLegend;
        /** @type {?} */
        var bounds = MapLib.getBoundsArray(this.geoData, [], [], []);
        this.LOG.debug(['drawChart', 'bounds'], bounds);
        this.layout.geo.lonaxis.color = this.getGridColor(this.el.nativeElement);
        this.layout.geo.lataxis.range = [bounds[0][0], bounds[1][0]];
        this.layout.geo.lonaxis.range = [bounds[0][1], bounds[1][1]];
        this.layout.geo.lataxis.color = this.getGridColor(this.el.nativeElement);
        this.layout = tslib_1.__assign({}, this.layout);
        this.loading = false;
    };
    WarpViewGlobeComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-globe',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\" #chartContainer>\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-plotly #graph *ngIf=\"plotlyData?.length > 0\"\n                     [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot()\"\n                     className=\"chart\" (hover)=\"hover($event)\" (unhover)=\"unhover($event)\"\n                     [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                     [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n  <div #toolTip class=\"tooltip\" [ngStyle]=\"getTooltipPosition()\"></div>\n</div>\n",
                    encapsulation: ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}.tooltip{background-color:var(--warp-view-chart-legend-bg)!important;color:var(--warp-view-chart-legend-color)!important;text-align:left;position:absolute;display:none;padding:10px;border:1px solid grey;border-radius:5px;box-shadow:none;pointer-events:none;font-size:10px;min-width:100px;width:auto;max-width:50%;z-index:999;height:auto!important;left:-1000px}.tooltip .chip{border-radius:50%;background-color:#bbb;display:inline-block;width:5px;height:5px;border:2px solid #454545;margin-top:auto;margin-bottom:auto;vertical-align:middle;cursor:pointer}:host{display:block;height:100%}:host #chartContainer{height:100%}:host #chartContainer div{height:100%}:host div.chart{width:var(--warp-view-chart-width);height:var(--warp-view-chart-height)}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewGlobeComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: SizeService },
        { type: NgZone }
    ]; };
    WarpViewGlobeComponent.propDecorators = {
        type: [{ type: Input, args: ['type',] }]
    };
    return WarpViewGlobeComponent;
}(WarpViewComponent));
export { WarpViewGlobeComponent };
if (false) {
    /** @type {?} */
    WarpViewGlobeComponent.prototype.layout;
    /**
     * @type {?}
     * @private
     */
    WarpViewGlobeComponent.prototype._type;
    /**
     * @type {?}
     * @private
     */
    WarpViewGlobeComponent.prototype.geoData;
    /** @type {?} */
    WarpViewGlobeComponent.prototype.el;
    /** @type {?} */
    WarpViewGlobeComponent.prototype.renderer;
    /** @type {?} */
    WarpViewGlobeComponent.prototype.sizeService;
    /** @type {?} */
    WarpViewGlobeComponent.prototype.ngZone;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LWdsb2JlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzZW54L3dhcnB2aWV3LyIsInNvdXJjZXMiOlsic3JjL2xpYi9lbGVtZW50cy93YXJwLXZpZXctZ2xvYmUvd2FycC12aWV3LWdsb2JlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQVUsU0FBUyxFQUFFLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pHLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3pELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSwrQkFBK0IsQ0FBQztBQUMxRCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFHMUMsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBRTNDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFFM0M7SUFNNEMsa0RBQWlCO0lBMEMzRCxnQ0FDUyxFQUFjLEVBQ2QsUUFBbUIsRUFDbkIsV0FBd0IsRUFDeEIsTUFBYztRQUp2QixZQU1FLGtCQUFNLEVBQUUsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLE1BQU0sQ0FBQyxTQUV6QztRQVBRLFFBQUUsR0FBRixFQUFFLENBQVk7UUFDZCxjQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ25CLGlCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLFlBQU0sR0FBTixNQUFNLENBQVE7UUF0Q3ZCLFlBQU0sR0FBaUI7WUFDckIsVUFBVSxFQUFFLEtBQUs7WUFDakIsTUFBTSxFQUFFO2dCQUNOLENBQUMsRUFBRSxFQUFFO2dCQUNMLENBQUMsRUFBRSxFQUFFO2dCQUNMLENBQUMsRUFBRSxFQUFFO2dCQUNMLENBQUMsRUFBRSxFQUFFO2FBQ047WUFDRCxHQUFHLEVBQUU7Z0JBQ0gsVUFBVSxFQUFFO29CQUNWLElBQUksRUFBRSxjQUFjO2lCQUNyQjtnQkFDRCxTQUFTLEVBQUUsSUFBSTtnQkFDZixTQUFTLEVBQUUsV0FBVztnQkFDdEIsU0FBUyxFQUFFLElBQUk7Z0JBQ2YsVUFBVSxFQUFFLFFBQVEsQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQztnQkFDbkQsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsU0FBUyxFQUFFLFFBQVEsQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQztnQkFDbEQsU0FBUyxFQUFFLElBQUk7Z0JBQ2YsU0FBUyxFQUFFLFFBQVEsQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQztnQkFDbEQsYUFBYSxFQUFFLElBQUk7Z0JBQ25CLE9BQU8sRUFBRTtvQkFDUCxRQUFRLEVBQUUsSUFBSTtvQkFDZCxTQUFTLEVBQUUsb0JBQW9CO2lCQUNoQztnQkFDRCxPQUFPLEVBQUU7b0JBQ1AsUUFBUSxFQUFFLElBQUk7b0JBQ2QsU0FBUyxFQUFFLG9CQUFvQjtpQkFDaEM7YUFDRjtTQUNGLENBQUM7UUFDTSxXQUFLLEdBQUcsWUFBWSxDQUFDO1FBQ3JCLGFBQU8sR0FBK0MsRUFBRSxDQUFDO1FBUy9ELEtBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxNQUFNLENBQUMsc0JBQXNCLEVBQUUsS0FBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztJQUM3RCxDQUFDO0lBL0NELHNCQUFtQix3Q0FBSTs7Ozs7UUFBdkIsVUFBd0IsSUFBWTtZQUNsQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztZQUNsQixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDbkIsQ0FBQzs7O09BQUE7Ozs7SUE4Q0QseUNBQVE7OztJQUFSO1FBQ0UsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ25CLENBQUM7Ozs7O0lBRUQsdUNBQU07Ozs7SUFBTixVQUFPLE9BQWM7UUFDbkIsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ25CLENBQUM7Ozs7O0lBRU8sMENBQVM7Ozs7SUFBakI7UUFDRSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUU7WUFDNUIsT0FBTztTQUNSO1FBQ0QsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUNwQixDQUFDOzs7Ozs7SUFFUyx3Q0FBTzs7Ozs7SUFBakIsVUFBa0IsSUFBZTtRQUFqQyxpQkE2Q0M7O1lBNUNPLE9BQU8sR0FBbUIsRUFBRTtRQUNsQyxJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNsQixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM3RCxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxtQkFBQSxJQUFJLENBQUMsSUFBSSxFQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO2FBQ2pFLE1BQU07Ozs7UUFBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQXhCLENBQXdCLEVBQUM7YUFDckMsT0FBTzs7Ozs7UUFBQyxVQUFDLEdBQVEsRUFBRSxDQUFDO1lBQ25CLElBQUksR0FBRyxDQUFDLENBQUMsRUFBRTs7b0JBQ0gsU0FBTyxHQUFHLEVBQUMsSUFBSSxFQUFFLEVBQUUsRUFBQzs7b0JBQ3BCLEtBQUssR0FBRyxNQUFNLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDOztvQkFDeEMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxLQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzs7b0JBQ25ELEtBQUssR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFDLFlBQVksRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLFlBQVksSUFBSSxDQUFDOztvQkFDdkUsUUFBTSxHQUFpQjtvQkFDM0IsSUFBSSxFQUFFLE9BQU87b0JBQ2IsSUFBSSxFQUFFLFlBQVk7b0JBQ2xCLE1BQU0sRUFBRTt3QkFDTixLQUFLLEVBQUUsUUFBUSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUM7d0JBQ3JDLElBQUksRUFBRSxDQUFDO3dCQUNQLE1BQU0sRUFBRSxRQUFRO3dCQUNoQixJQUFJLEVBQUU7NEJBQ0osS0FBSyxPQUFBOzRCQUNMLEtBQUssRUFBRSxDQUFDO3lCQUNUO3FCQUNGO29CQUNELElBQUksRUFBRTt3QkFDSixLQUFLLE9BQUE7d0JBQ0wsS0FBSyxFQUFFLENBQUM7cUJBQ1Q7b0JBQ0QsSUFBSSxFQUFFLEtBQUs7b0JBQ1gsR0FBRyxFQUFFLEVBQUU7b0JBQ1AsR0FBRyxFQUFFLEVBQUU7b0JBQ1AsU0FBUyxFQUFFLE1BQU07aUJBQ2xCO2dCQUNELEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTzs7OztnQkFBQyxVQUFBLEtBQUs7b0JBQ2pCLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7d0JBQ3BCLFFBQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUMxQixRQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDMUIsU0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO3FCQUNuRDtnQkFDSCxDQUFDLEVBQUMsQ0FBQztnQkFDSCxLQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFPLENBQUMsQ0FBQztnQkFDM0IsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFNLENBQUMsQ0FBQzthQUN0QjtRQUNILENBQUMsRUFBQyxDQUFDO1FBQ0wsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQzs7Ozs7SUFFTywyQ0FBVTs7OztJQUFsQjtRQUNFLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVyxFQUFFLGFBQWEsQ0FBQyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUMvRCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsRUFBRSxhQUFhLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLEVBQUUsbUJBQW1CLENBQUMsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDdEUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQzs7WUFDcEMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztRQUM5RCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNoRCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUN6RSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdELElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDekUsSUFBSSxDQUFDLE1BQU0sd0JBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0lBQ3ZCLENBQUM7O2dCQXRJRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLGdCQUFnQjtvQkFDMUIsZzhDQUErQztvQkFFL0MsYUFBYSxFQUFFLGlCQUFpQixDQUFDLFNBQVM7O2lCQUMzQzs7OztnQkFoQmtCLFVBQVU7Z0JBQXlCLFNBQVM7Z0JBRXZELFdBQVc7Z0JBRm1CLE1BQU07Ozt1QkFvQnpDLEtBQUssU0FBQyxNQUFNOztJQStIZiw2QkFBQztDQUFBLEFBeElELENBTTRDLGlCQUFpQixHQWtJNUQ7U0FsSVksc0JBQXNCOzs7SUFRakMsd0NBOEJFOzs7OztJQUNGLHVDQUE2Qjs7Ozs7SUFDN0IseUNBQWlFOztJQUcvRCxvQ0FBcUI7O0lBQ3JCLDBDQUEwQjs7SUFDMUIsNkNBQStCOztJQUMvQix3Q0FBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvbmVudCwgRWxlbWVudFJlZiwgSW5wdXQsIE5nWm9uZSwgT25Jbml0LCBSZW5kZXJlcjIsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7V2FycFZpZXdDb21wb25lbnR9IGZyb20gJy4uL3dhcnAtdmlldy1jb21wb25lbnQnO1xuaW1wb3J0IHtTaXplU2VydmljZX0gZnJvbSAnLi4vLi4vc2VydmljZXMvcmVzaXplLnNlcnZpY2UnO1xuaW1wb3J0IHtMb2dnZXJ9IGZyb20gJy4uLy4uL3V0aWxzL2xvZ2dlcic7XG5pbXBvcnQge1BhcmFtfSBmcm9tICcuLi8uLi9tb2RlbC9wYXJhbSc7XG5pbXBvcnQge0RhdGFNb2RlbH0gZnJvbSAnLi4vLi4vbW9kZWwvZGF0YU1vZGVsJztcbmltcG9ydCB7R1RTTGlifSBmcm9tICcuLi8uLi91dGlscy9ndHMubGliJztcbmltcG9ydCB7R1RTfSBmcm9tICcuLi8uLi9tb2RlbC9HVFMnO1xuaW1wb3J0IHtDb2xvckxpYn0gZnJvbSAnLi4vLi4vdXRpbHMvY29sb3ItbGliJztcbmltcG9ydCB7TWFwTGlifSBmcm9tICcuLi8uLi91dGlscy9tYXAtbGliJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnd2FycHZpZXctZ2xvYmUnLFxuICB0ZW1wbGF0ZVVybDogJy4vd2FycC12aWV3LWdsb2JlLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vd2FycC12aWV3LWdsb2JlLmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLlNoYWRvd0RvbVxufSlcbmV4cG9ydCBjbGFzcyBXYXJwVmlld0dsb2JlQ29tcG9uZW50IGV4dGVuZHMgV2FycFZpZXdDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG5cbiAgQElucHV0KCd0eXBlJykgc2V0IHR5cGUodHlwZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdHlwZSA9IHR5cGU7XG4gICAgdGhpcy5kcmF3Q2hhcnQoKTtcbiAgfVxuXG4gIGxheW91dDogUGFydGlhbDxhbnk+ID0ge1xuICAgIHNob3dsZWdlbmQ6IGZhbHNlLFxuICAgIG1hcmdpbjoge1xuICAgICAgdDogMTAsXG4gICAgICBiOiAyNSxcbiAgICAgIHI6IDEwLFxuICAgICAgbDogMTBcbiAgICB9LFxuICAgIGdlbzoge1xuICAgICAgcHJvamVjdGlvbjoge1xuICAgICAgICB0eXBlOiAnb3J0aG9ncmFwaGljJyxcbiAgICAgIH0sXG4gICAgICBzaG93ZnJhbWU6IHRydWUsXG4gICAgICBmaXRib3VuZHM6ICdsb2NhdGlvbnMnLFxuICAgICAgc2hvd29jZWFuOiB0cnVlLFxuICAgICAgb2NlYW5jb2xvcjogQ29sb3JMaWIudHJhbnNwYXJlbnRpemUoJyMwMDRlZmYnLCAwLjIpLFxuICAgICAgc2hvd2xhbmQ6IHRydWUsXG4gICAgICBsYW5kY29sb3I6IENvbG9yTGliLnRyYW5zcGFyZW50aXplKCcjNkY2OTRFJywgMC4yKSxcbiAgICAgIHNob3dsYWtlczogdHJ1ZSxcbiAgICAgIGxha2Vjb2xvcjogQ29sb3JMaWIudHJhbnNwYXJlbnRpemUoJyMwMDRlZmYnLCAwLjIpLFxuICAgICAgc2hvd2NvdW50cmllczogdHJ1ZSxcbiAgICAgIGxvbmF4aXM6IHtcbiAgICAgICAgc2hvd2dyaWQ6IHRydWUsXG4gICAgICAgIGdyaWRjb2xvcjogJ3JnYigxMDIsIDEwMiwgMTAyKSdcbiAgICAgIH0sXG4gICAgICBsYXRheGlzOiB7XG4gICAgICAgIHNob3dncmlkOiB0cnVlLFxuICAgICAgICBncmlkY29sb3I6ICdyZ2IoMTAyLCAxMDIsIDEwMiknXG4gICAgICB9XG4gICAgfVxuICB9O1xuICBwcml2YXRlIF90eXBlID0gJ3NjYXR0ZXJnZW8nO1xuICBwcml2YXRlIGdlb0RhdGE6IHsgcGF0aDogeyBsYXQ6IG51bWJlciwgbG9uOiBudW1iZXIgfVtdIH1bXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBlbDogRWxlbWVudFJlZixcbiAgICBwdWJsaWMgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwdWJsaWMgc2l6ZVNlcnZpY2U6IFNpemVTZXJ2aWNlLFxuICAgIHB1YmxpYyBuZ1pvbmU6IE5nWm9uZVxuICApIHtcbiAgICBzdXBlcihlbCwgcmVuZGVyZXIsIHNpemVTZXJ2aWNlLCBuZ1pvbmUpO1xuICAgIHRoaXMuTE9HID0gbmV3IExvZ2dlcihXYXJwVmlld0dsb2JlQ29tcG9uZW50LCB0aGlzLl9kZWJ1Zyk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmRyYXdDaGFydCgpO1xuICB9XG5cbiAgdXBkYXRlKG9wdGlvbnM6IFBhcmFtKTogdm9pZCB7XG4gICAgdGhpcy5kcmF3Q2hhcnQoKTtcbiAgfVxuXG4gIHByaXZhdGUgZHJhd0NoYXJ0KCkge1xuICAgIGlmICghdGhpcy5pbml0Q2hhcnQodGhpcy5lbCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5wbG90bHlDb25maWcuc2Nyb2xsWm9vbSA9IHRydWU7XG4gICAgdGhpcy5idWlsZEdyYXBoKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgY29udmVydChkYXRhOiBEYXRhTW9kZWwpOiBQYXJ0aWFsPGFueT5bXSB7XG4gICAgY29uc3QgZGF0YXNldDogUGFydGlhbDxhbnk+W10gPSBbXTtcbiAgICB0aGlzLmdlb0RhdGEgPSBbXTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2NvbnZlcnQnXSwgZGF0YSwgdGhpcy5fb3B0aW9ucywgdGhpcy5fdHlwZSk7XG4gICAgR1RTTGliLmZsYXREZWVwKEdUU0xpYi5mbGF0dGVuR3RzSWRBcnJheShkYXRhLmRhdGEgYXMgYW55W10sIDApLnJlcylcbiAgICAgIC5maWx0ZXIoZyA9PiAoZy52ICYmIEdUU0xpYi5pc0d0cyhnKSkpXG4gICAgICAuZm9yRWFjaCgoZ3RzOiBHVFMsIGkpID0+IHtcbiAgICAgICAgaWYgKGd0cy52KSB7XG4gICAgICAgICAgY29uc3QgZ2VvRGF0YSA9IHtwYXRoOiBbXX07XG4gICAgICAgICAgY29uc3QgbGFiZWwgPSBHVFNMaWIuc2VyaWFsaXplR3RzTWV0YWRhdGEoZ3RzKTtcbiAgICAgICAgICBjb25zdCBjID0gQ29sb3JMaWIuZ2V0Q29sb3IoZ3RzLmlkLCB0aGlzLl9vcHRpb25zLnNjaGVtZSk7XG4gICAgICAgICAgY29uc3QgY29sb3IgPSAoKGRhdGEucGFyYW1zIHx8IFtdKVtpXSB8fCB7ZGF0YXNldENvbG9yOiBjfSkuZGF0YXNldENvbG9yIHx8IGM7XG4gICAgICAgICAgY29uc3Qgc2VyaWVzOiBQYXJ0aWFsPGFueT4gPSB7XG4gICAgICAgICAgICBtb2RlOiAnbGluZXMnLFxuICAgICAgICAgICAgdHlwZTogJ3NjYXR0ZXJnZW8nLFxuICAgICAgICAgICAgbWFya2VyOiB7XG4gICAgICAgICAgICAgIGNvbG9yOiBDb2xvckxpYi50cmFuc3BhcmVudGl6ZShjb2xvciksXG4gICAgICAgICAgICAgIHNpemU6IDMsXG4gICAgICAgICAgICAgIHN5bWJvbDogJ2NpcmNsZScsXG4gICAgICAgICAgICAgIGxpbmU6IHtcbiAgICAgICAgICAgICAgICBjb2xvcixcbiAgICAgICAgICAgICAgICB3aWR0aDogMFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbGluZToge1xuICAgICAgICAgICAgICBjb2xvcixcbiAgICAgICAgICAgICAgd2lkdGg6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBuYW1lOiBsYWJlbCxcbiAgICAgICAgICAgIGxvbjogW10sXG4gICAgICAgICAgICBsYXQ6IFtdLFxuICAgICAgICAgICAgaG92ZXJpbmZvOiAnbm9uZScsXG4gICAgICAgICAgfTtcbiAgICAgICAgICBndHMudi5mb3JFYWNoKHZhbHVlID0+IHtcbiAgICAgICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPiAyKSB7XG4gICAgICAgICAgICAgIHNlcmllcy5sYXQucHVzaCh2YWx1ZVsxXSk7XG4gICAgICAgICAgICAgIHNlcmllcy5sb24ucHVzaCh2YWx1ZVsyXSk7XG4gICAgICAgICAgICAgIGdlb0RhdGEucGF0aC5wdXNoKHtsYXQ6IHZhbHVlWzFdLCBsb246IHZhbHVlWzJdfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy5nZW9EYXRhLnB1c2goZ2VvRGF0YSk7XG4gICAgICAgICAgZGF0YXNldC5wdXNoKHNlcmllcyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIHJldHVybiBkYXRhc2V0O1xuICB9XG5cbiAgcHJpdmF0ZSBidWlsZEdyYXBoKCkge1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZHJhd0NoYXJ0JywgJ3RoaXMubGF5b3V0J10sIHRoaXMuX3Jlc3BvbnNpdmUpO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZHJhd0NoYXJ0JywgJ3RoaXMubGF5b3V0J10sIHRoaXMubGF5b3V0KTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RyYXdDaGFydCcsICd0aGlzLnBsb3RseUNvbmZpZyddLCB0aGlzLnBsb3RseUNvbmZpZyk7XG4gICAgdGhpcy5sYXlvdXQuc2hvd2xlZ2VuZCA9IHRoaXMuX3Nob3dMZWdlbmQ7XG4gICAgY29uc3QgYm91bmRzID0gTWFwTGliLmdldEJvdW5kc0FycmF5KHRoaXMuZ2VvRGF0YSwgW10sIFtdLCBbXSk7XG4gICAgdGhpcy5MT0cuZGVidWcoWydkcmF3Q2hhcnQnLCAnYm91bmRzJ10sIGJvdW5kcyk7XG4gICAgdGhpcy5sYXlvdXQuZ2VvLmxvbmF4aXMuY29sb3IgPSB0aGlzLmdldEdyaWRDb2xvcih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgIHRoaXMubGF5b3V0Lmdlby5sYXRheGlzLnJhbmdlID0gW2JvdW5kc1swXVswXSwgYm91bmRzWzFdWzBdXTtcbiAgICB0aGlzLmxheW91dC5nZW8ubG9uYXhpcy5yYW5nZSA9IFtib3VuZHNbMF1bMV0sIGJvdW5kc1sxXVsxXV07XG4gICAgdGhpcy5sYXlvdXQuZ2VvLmxhdGF4aXMuY29sb3IgPSB0aGlzLmdldEdyaWRDb2xvcih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgIHRoaXMubGF5b3V0ID0gey4uLnRoaXMubGF5b3V0fTtcbiAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgfVxuXG59XG4iXX0=