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
import { Component, ElementRef, Input, NgZone, Renderer2, ViewEncapsulation } from '@angular/core';
import { WarpViewComponent } from '../warp-view-component';
import { ColorLib } from '../../utils/color-lib';
import { GTSLib } from '../../utils/gts.lib';
import moment from 'moment-timezone';
import { SizeService } from '../../services/resize.service';
import { Logger } from '../../utils/logger';
var WarpViewSpectrumComponent = /** @class */ (function (_super) {
    tslib_1.__extends(WarpViewSpectrumComponent, _super);
    function WarpViewSpectrumComponent(el, renderer, sizeService, ngZone) {
        var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
        _this.el = el;
        _this.renderer = renderer;
        _this.sizeService = sizeService;
        _this.ngZone = ngZone;
        _this.layout = {
            showlegend: false,
            xaxis: {},
            yaxis: {},
            margin: {
                t: 10,
                b: 25,
                r: 10,
                l: 50
            }
        };
        _this._type = 'histogram2d';
        _this.visibility = [];
        _this.visibilityStatus = 'unknown';
        _this.maxTick = 0;
        _this.minTick = 0;
        _this.visibleGtsId = [];
        _this.LOG = new Logger(WarpViewSpectrumComponent, _this._debug);
        return _this;
    }
    Object.defineProperty(WarpViewSpectrumComponent.prototype, "type", {
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
     * @param {?} options
     * @return {?}
     */
    WarpViewSpectrumComponent.prototype.update = /**
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
    WarpViewSpectrumComponent.prototype.drawChart = /**
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
    WarpViewSpectrumComponent.prototype.convert = /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    function (data) {
        var _this = this;
        /** @type {?} */
        var type = this._options.histo || { histnorm: 'density', histfunc: 'count' };
        /** @type {?} */
        var dataset = [];
        this.LOG.debug(['convert'], this._options);
        this.visibility = [];
        /** @type {?} */
        var gtsList = GTSLib.flatDeep(GTSLib.flattenGtsIdArray((/** @type {?} */ ([data.data])), 0).res) || [];
        this.maxTick = Number.NEGATIVE_INFINITY;
        this.minTick = Number.POSITIVE_INFINITY;
        this.visibleGtsId = [];
        /** @type {?} */
        var nonPlottable = gtsList.filter((/**
         * @param {?} g
         * @return {?}
         */
        function (g) {
            _this.LOG.debug(['convert'], GTSLib.isGtsToPlot(g));
            return (g.v && !GTSLib.isGtsToPlot(g));
        }));
        gtsList = gtsList.filter((/**
         * @param {?} g
         * @return {?}
         */
        function (g) {
            return (g.v && GTSLib.isGtsToPlot(g));
        }));
        // initialize visibility status
        if (this.visibilityStatus === 'unknown') {
            this.visibilityStatus = gtsList.length > 0 ? 'plottableShown' : 'nothingPlottable';
        }
        if (this._options.timeMode && this._options.timeMode === 'timestamp') {
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
            if (gts.v && GTSLib.isGtsToPlot(gts)) {
                /** @type {?} */
                var label = GTSLib.serializeGtsMetadata(gts);
                /** @type {?} */
                var c = ColorLib.getColor(i, _this._options.scheme);
                /** @type {?} */
                var color = ((data.params || [])[gts.id] || { datasetColor: c }).datasetColor || c;
                /** @type {?} */
                var series_1 = {
                    type: _this._type,
                    histnorm: type.histnorm || 'density',
                    histfunc: type.histfunc || 'count',
                    contours: {
                        showlabels: true,
                        labelfont: {
                            color: 'white'
                        }
                    },
                    colorbar: {
                        tickcolor: _this.getGridColor(_this.el.nativeElement),
                        thickness: 0,
                        tickfont: {
                            color: _this.getLabelColor(_this.el.nativeElement)
                        },
                        x: 1 + gts.id / 20,
                        xpad: 0
                    },
                    showscale: _this.showLegend,
                    colorscale: ColorLib.getColorGradient(gts.id, _this._options.scheme),
                    autocolorscale: false,
                    name: label,
                    text: label,
                    x: [],
                    y: [],
                    line: { color: color },
                    hoverinfo: 'none',
                    connectgaps: false,
                    visible: _this._hiddenData.filter((/**
                     * @param {?} h
                     * @return {?}
                     */
                    function (h) { return h === gts.id; })).length >= 0,
                };
                gts.v.forEach((/**
                 * @param {?} value
                 * @return {?}
                 */
                function (value) {
                    /** @type {?} */
                    var ts = value[0];
                    series_1.y.push(value[value.length - 1]);
                    if (_this._options.timeMode && _this._options.timeMode === 'timestamp') {
                        series_1.x.push(ts);
                    }
                    else {
                        series_1.x.push(moment.tz(moment.utc(ts / _this.divider), _this._options.timeZone).toISOString());
                    }
                }));
                dataset.push(series_1);
            }
        }));
        this.LOG.debug(['convert', 'dataset'], dataset);
        return dataset;
    };
    /**
     * @private
     * @return {?}
     */
    WarpViewSpectrumComponent.prototype.buildGraph = /**
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
        this.loading = false;
    };
    WarpViewSpectrumComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-spectrum',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\" #chartContainer>\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-plotly #graph\n                     [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot()\"\n                     (relayout)=\"relayout($event)\" (hover)=\"hover($event)\" (unhover)=\"unhover($event)\"\n                     [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                     [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n  <div #toolTip class=\"tooltip\" [ngStyle]=\"getTooltipPosition()\"></div>\n</div>\n",
                    encapsulation: ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}.tooltip{background-color:var(--warp-view-chart-legend-bg)!important;color:var(--warp-view-chart-legend-color)!important;text-align:left;position:absolute;display:none;padding:10px;border:1px solid grey;border-radius:5px;box-shadow:none;pointer-events:none;font-size:10px;min-width:100px;width:auto;max-width:50%;z-index:999;height:auto!important;left:-1000px}.tooltip .chip{border-radius:50%;background-color:#bbb;display:inline-block;width:5px;height:5px;border:2px solid #454545;margin-top:auto;margin-bottom:auto;vertical-align:middle;cursor:pointer}:host{display:block;height:100%}:host #chartContainer{height:100%}:host #chartContainer div{height:100%}:host div.chart{width:var(--warp-view-chart-width);height:var(--warp-view-chart-height)}:host .executionErrorText{color:red;padding:10px;border-radius:3px;background:#faebd7;position:absolute;top:-30px;border:2px solid red}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewSpectrumComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: SizeService },
        { type: NgZone }
    ]; };
    WarpViewSpectrumComponent.propDecorators = {
        type: [{ type: Input, args: ['type',] }]
    };
    return WarpViewSpectrumComponent;
}(WarpViewComponent));
export { WarpViewSpectrumComponent };
if (false) {
    /** @type {?} */
    WarpViewSpectrumComponent.prototype.layout;
    /**
     * @type {?}
     * @private
     */
    WarpViewSpectrumComponent.prototype._type;
    /**
     * @type {?}
     * @private
     */
    WarpViewSpectrumComponent.prototype.visibility;
    /**
     * @type {?}
     * @private
     */
    WarpViewSpectrumComponent.prototype.visibilityStatus;
    /**
     * @type {?}
     * @private
     */
    WarpViewSpectrumComponent.prototype.maxTick;
    /**
     * @type {?}
     * @private
     */
    WarpViewSpectrumComponent.prototype.minTick;
    /**
     * @type {?}
     * @private
     */
    WarpViewSpectrumComponent.prototype.visibleGtsId;
    /** @type {?} */
    WarpViewSpectrumComponent.prototype.el;
    /** @type {?} */
    WarpViewSpectrumComponent.prototype.renderer;
    /** @type {?} */
    WarpViewSpectrumComponent.prototype.sizeService;
    /** @type {?} */
    WarpViewSpectrumComponent.prototype.ngZone;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LXNwZWN0cnVtLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzZW54L3dhcnB2aWV3LyIsInNvdXJjZXMiOlsic3JjL2xpYi9lbGVtZW50cy93YXJwLXZpZXctc3BlY3RydW0vd2FycC12aWV3LXNwZWN0cnVtLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDakcsT0FBTyxFQUFrQixpQkFBaUIsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBRzFFLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFFM0MsT0FBTyxNQUFNLE1BQU0saUJBQWlCLENBQUM7QUFDckMsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBQzFELE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUUxQztJQU0rQyxxREFBaUI7SUF5QjlELG1DQUNTLEVBQWMsRUFDZCxRQUFtQixFQUNuQixXQUF3QixFQUN4QixNQUFjO1FBSnZCLFlBTUUsa0JBQU0sRUFBRSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsTUFBTSxDQUFDLFNBRXpDO1FBUFEsUUFBRSxHQUFGLEVBQUUsQ0FBWTtRQUNkLGNBQVEsR0FBUixRQUFRLENBQVc7UUFDbkIsaUJBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIsWUFBTSxHQUFOLE1BQU0sQ0FBUTtRQXRCdkIsWUFBTSxHQUFpQjtZQUNyQixVQUFVLEVBQUUsS0FBSztZQUNqQixLQUFLLEVBQUUsRUFBRTtZQUNULEtBQUssRUFBRSxFQUFFO1lBQ1QsTUFBTSxFQUFFO2dCQUNOLENB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QUFDO1FBQ25FLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDbkUsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7SUFDdkIsQ0FBQzs7Z0JBNUlGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsbUJBQW1CO29CQUM3QiwyNkNBQWtEO29CQUVsRCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsU0FBUzs7aUJBQzNDOzs7O2dCQWhCa0IsVUFBVTtnQkFBaUIsU0FBUztnQkFRL0MsV0FBVztnQkFSbUIsTUFBTTs7O3VCQW1CekMsS0FBSyxTQUFDLE1BQU07O0lBcUlmLGdDQUFDO0NBQUEsQUE3SUQsQ0FNK0MsaUJBQWlCLEdBdUkvRDtTQXZJWSx5QkFBeUI7OztJQU9wQywyQ0FVRTs7Ozs7SUFDRiwwQ0FBOEI7Ozs7O0lBQzlCLCtDQUFtQzs7Ozs7SUFDbkMscURBQXNEOzs7OztJQUN0RCw0Q0FBb0I7Ozs7O0lBQ3BCLDRDQUFvQjs7Ozs7SUFDcEIsaURBQTBCOztJQUd4Qix1Q0FBcUI7O0lBQ3JCLDZDQUEwQjs7SUFDMUIsZ0RBQStCOztJQUMvQiwyQ0FBcUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogIENvcHlyaWdodCAyMDIwICBTZW5YIFMuQS5TLlxuICpcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50LCBFbGVtZW50UmVmLCBJbnB1dCwgTmdab25lLCBSZW5kZXJlcjIsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7VmlzaWJpbGl0eVN0YXRlLCBXYXJwVmlld0NvbXBvbmVudH0gZnJvbSAnLi4vd2FycC12aWV3LWNvbXBvbmVudCc7XG5pbXBvcnQge0RhdGFNb2RlbH0gZnJvbSAnLi4vLi4vbW9kZWwvZGF0YU1vZGVsJztcbmltcG9ydCB7UGFyYW19IGZyb20gJy4uLy4uL21vZGVsL3BhcmFtJztcbmltcG9ydCB7Q29sb3JMaWJ9IGZyb20gJy4uLy4uL3V0aWxzL2NvbG9yLWxpYic7XG5pbXBvcnQge0dUU0xpYn0gZnJvbSAnLi4vLi4vdXRpbHMvZ3RzLmxpYic7XG5pbXBvcnQge0dUU30gZnJvbSAnLi4vLi4vbW9kZWwvR1RTJztcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50LXRpbWV6b25lJztcbmltcG9ydCB7U2l6ZVNlcnZpY2V9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3Jlc2l6ZS5zZXJ2aWNlJztcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICcuLi8uLi91dGlscy9sb2dnZXInO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICd3YXJwdmlldy1zcGVjdHJ1bScsXG4gIHRlbXBsYXRlVXJsOiAnLi93YXJwLXZpZXctc3BlY3RydW0uY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi93YXJwLXZpZXctc3BlY3RydW0uY29tcG9uZW50LnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uU2hhZG93RG9tXG59KVxuZXhwb3J0IGNsYXNzIFdhcnBWaWV3U3BlY3RydW1Db21wb25lbnQgZXh0ZW5kcyBXYXJwVmlld0NvbXBvbmVudCB7XG5cbiAgQElucHV0KCd0eXBlJykgc2V0IHR5cGUodHlwZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdHlwZSA9IHR5cGU7XG4gICAgdGhpcy5kcmF3Q2hhcnQoKTtcbiAgfVxuXG4gIGxheW91dDogUGFydGlhbDxhbnk+ID0ge1xuICAgIHNob3dsZWdlbmQ6IGZhbHNlLFxuICAgIHhheGlzOiB7fSxcbiAgICB5YXhpczoge30sXG4gICAgbWFyZ2luOiB7XG4gICAgICB0OiAxMCxcbiAgICAgIGI6IDI1LFxuICAgICAgcjogMTAsXG4gICAgICBsOiA1MFxuICAgIH1cbiAgfTtcbiAgcHJpdmF0ZSBfdHlwZSA9ICdoaXN0b2dyYW0yZCc7XG4gIHByaXZhdGUgdmlzaWJpbGl0eTogYm9vbGVhbltdID0gW107XG4gIHByaXZhdGUgdmlzaWJpbGl0eVN0YXR1czogVmlzaWJpbGl0eVN0YXRlID0gJ3Vua25vd24nO1xuICBwcml2YXRlIG1heFRpY2sgPSAwO1xuICBwcml2YXRlIG1pblRpY2sgPSAwO1xuICBwcml2YXRlIHZpc2libGVHdHNJZCA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBlbDogRWxlbWVudFJlZixcbiAgICBwdWJsaWMgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwdWJsaWMgc2l6ZVNlcnZpY2U6IFNpemVTZXJ2aWNlLFxuICAgIHB1YmxpYyBuZ1pvbmU6IE5nWm9uZVxuICApIHtcbiAgICBzdXBlcihlbCwgcmVuZGVyZXIsIHNpemVTZXJ2aWNlLCBuZ1pvbmUpO1xuICAgIHRoaXMuTE9HID0gbmV3IExvZ2dlcihXYXJwVmlld1NwZWN0cnVtQ29tcG9uZW50LCB0aGlzLl9kZWJ1Zyk7XG4gIH1cblxuICB1cGRhdGUob3B0aW9uczogUGFyYW0pOiB2b2lkIHtcbiAgICB0aGlzLmRyYXdDaGFydCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBkcmF3Q2hhcnQoKSB7XG4gICAgaWYgKCF0aGlzLmluaXRDaGFydCh0aGlzLmVsKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnBsb3RseUNvbmZpZy5zY3JvbGxab29tID0gdHJ1ZTtcbiAgICB0aGlzLmJ1aWxkR3JhcGgoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBjb252ZXJ0KGRhdGE6IERhdGFNb2RlbCk6IFBhcnRpYWw8YW55PltdIHtcbiAgICBjb25zdCB0eXBlID0gdGhpcy5fb3B0aW9ucy5oaXN0byB8fCB7aGlzdG5vcm06ICdkZW5zaXR5JywgaGlzdGZ1bmM6ICdjb3VudCd9O1xuICAgIGNvbnN0IGRhdGFzZXQ6IFBhcnRpYWw8YW55PltdID0gW107XG4gICAgdGhpcy5MT0cuZGVidWcoWydjb252ZXJ0J10sIHRoaXMuX29wdGlvbnMpO1xuICAgIHRoaXMudmlzaWJpbGl0eSA9IFtdO1xuICAgIGxldCBndHNMaXN0ID0gR1RTTGliLmZsYXREZWVwKEdUU0xpYi5mbGF0dGVuR3RzSWRBcnJheShbIGRhdGEuZGF0YV0gYXMgYW55W10sIDApLnJlcykgfHwgW107XG4gICAgdGhpcy5tYXhUaWNrID0gTnVtYmVyLk5FR0FUSVZFX0lORklOSVRZO1xuICAgIHRoaXMubWluVGljayA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWTtcbiAgICB0aGlzLnZpc2libGVHdHNJZCA9IFtdO1xuICAgIGNvbnN0IG5vblBsb3R0YWJsZSA9IGd0c0xpc3QuZmlsdGVyKGcgPT4ge1xuICAgICAgdGhpcy5MT0cuZGVidWcoWydjb252ZXJ0J10sIEdUU0xpYi5pc0d0c1RvUGxvdChnKSk7XG4gICAgICByZXR1cm4gKGcudiAmJiAhR1RTTGliLmlzR3RzVG9QbG90KGcpKTtcbiAgICB9KTtcbiAgICBndHNMaXN0ID0gZ3RzTGlzdC5maWx0ZXIoZyA9PiB7XG4gICAgICByZXR1cm4gKGcudiAmJiBHVFNMaWIuaXNHdHNUb1Bsb3QoZykpO1xuICAgIH0pO1xuICAgIC8vIGluaXRpYWxpemUgdmlzaWJpbGl0eSBzdGF0dXNcbiAgICBpZiAodGhpcy52aXNpYmlsaXR5U3RhdHVzID09PSAndW5rbm93bicpIHtcbiAgICAgIHRoaXMudmlzaWJpbGl0eVN0YXR1cyA9IGd0c0xpc3QubGVuZ3RoID4gMCA/ICdwbG90dGFibGVTaG93bicgOiAnbm90aGluZ1Bsb3R0YWJsZSc7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX29wdGlvbnMudGltZU1vZGUgJiYgdGhpcy5fb3B0aW9ucy50aW1lTW9kZSA9PT0gJ3RpbWVzdGFtcCcpIHtcbiAgICAgIHRoaXMubGF5b3V0LnhheGlzLnR5cGUgPSAnbGluZWFyJztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sYXlvdXQueGF4aXMudHlwZSA9ICdkYXRlJztcbiAgICB9XG4gICAgZ3RzTGlzdC5mb3JFYWNoKChndHM6IEdUUywgaSkgPT4ge1xuICAgICAgaWYgKGd0cy52ICYmIEdUU0xpYi5pc0d0c1RvUGxvdChndHMpKSB7XG4gICAgICAgIGNvbnN0IGxhYmVsID0gR1RTTGliLnNlcmlhbGl6ZUd0c01ldGFkYXRhKGd0cyk7XG4gICAgICAgIGNvbnN0IGMgPSBDb2xvckxpYi5nZXRDb2xvcihpLCB0aGlzLl9vcHRpb25zLnNjaGVtZSk7XG4gICAgICAgIGNvbnN0IGNvbG9yID0gKChkYXRhLnBhcmFtcyB8fCBbXSlbZ3RzLmlkXSB8fCB7ZGF0YXNldENvbG9yOiBjfSkuZGF0YXNldENvbG9yIHx8IGM7XG4gICAgICAgIGNvbnN0IHNlcmllczogUGFydGlhbDxhbnk+ID0ge1xuICAgICAgICAgIHR5cGU6IHRoaXMuX3R5cGUsXG4gICAgICAgICAgaGlzdG5vcm06IHR5cGUuaGlzdG5vcm0gfHwgJ2RlbnNpdHknLFxuICAgICAgICAgIGhpc3RmdW5jOiB0eXBlLmhpc3RmdW5jIHx8ICdjb3VudCcsXG4gICAgICAgICAgY29udG91cnM6IHtcbiAgICAgICAgICAgIHNob3dsYWJlbHM6IHRydWUsXG4gICAgICAgICAgICBsYWJlbGZvbnQ6IHtcbiAgICAgICAgICAgICAgY29sb3I6ICd3aGl0ZSdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGNvbG9yYmFyOiB7XG4gICAgICAgICAgICB0aWNrY29sb3I6IHRoaXMuZ2V0R3JpZENvbG9yKHRoaXMuZWwubmF0aXZlRWxlbWVudCksXG4gICAgICAgICAgICB0aGlja25lc3M6IDAsXG4gICAgICAgICAgICB0aWNrZm9udDoge1xuICAgICAgICAgICAgICBjb2xvcjogdGhpcy5nZXRMYWJlbENvbG9yKHRoaXMuZWwubmF0aXZlRWxlbWVudClcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB4OiAxICsgZ3RzLmlkIC8gMjAsXG4gICAgICAgICAgICB4cGFkOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzaG93c2NhbGU6IHRoaXMuc2hvd0xlZ2VuZCxcbiAgICAgICAgICBjb2xvcnNjYWxlOiBDb2xvckxpYi5nZXRDb2xvckdyYWRpZW50KGd0cy5pZCwgdGhpcy5fb3B0aW9ucy5zY2hlbWUpLFxuICAgICAgICAgIGF1dG9jb2xvcnNjYWxlOiBmYWxzZSxcbiAgICAgICAgICBuYW1lOiBsYWJlbCxcbiAgICAgICAgICB0ZXh0OiBsYWJlbCxcbiAgICAgICAgICB4OiBbXSxcbiAgICAgICAgICB5OiBbXSxcbiAgICAgICAgICBsaW5lOiB7Y29sb3J9LFxuICAgICAgICAgIGhvdmVyaW5mbzogJ25vbmUnLFxuICAgICAgICAgIGNvbm5lY3RnYXBzOiBmYWxzZSxcbiAgICAgICAgICB2aXNpYmxlOiB0aGlzLl9oaWRkZW5EYXRhLmZpbHRlcihoID0+IGggPT09IGd0cy5pZCkubGVuZ3RoID49IDAsXG4gICAgICAgIH07XG4gICAgICAgIGd0cy52LmZvckVhY2godmFsdWUgPT4ge1xuICAgICAgICAgIGNvbnN0IHRzID0gdmFsdWVbMF07XG4gICAgICAgICAgc2VyaWVzLnkucHVzaCh2YWx1ZVt2YWx1ZS5sZW5ndGggLSAxXSk7XG4gICAgICAgICAgaWYgKHRoaXMuX29wdGlvbnMudGltZU1vZGUgJiYgdGhpcy5fb3B0aW9ucy50aW1lTW9kZSA9PT0gJ3RpbWVzdGFtcCcpIHtcbiAgICAgICAgICAgIHNlcmllcy54LnB1c2godHMpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZXJpZXMueC5wdXNoKG1vbWVudC50eihtb21lbnQudXRjKHRzIC8gdGhpcy5kaXZpZGVyKSwgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSkudG9JU09TdHJpbmcoKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZGF0YXNldC5wdXNoKHNlcmllcyk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5MT0cuZGVidWcoWydjb252ZXJ0JywgJ2RhdGFzZXQnXSwgZGF0YXNldCk7XG5cbiAgICByZXR1cm4gZGF0YXNldDtcbiAgfVxuXG4gIHByaXZhdGUgYnVpbGRHcmFwaCgpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RyYXdDaGFydCcsICd0aGlzLmxheW91dCddLCB0aGlzLnJlc3BvbnNpdmUpO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZHJhd0NoYXJ0JywgJ3RoaXMubGF5b3V0J10sIHRoaXMubGF5b3V0KTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RyYXdDaGFydCcsICd0aGlzLnBsb3RseUNvbmZpZyddLCB0aGlzLnBsb3RseUNvbmZpZyk7XG4gICAgdGhpcy5sYXlvdXQuc2hvd2xlZ2VuZCA9IHRoaXMuc2hvd0xlZ2VuZDtcbiAgICB0aGlzLmxheW91dC55YXhpcy5jb2xvciA9IHRoaXMuZ2V0R3JpZENvbG9yKHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XG4gICAgdGhpcy5sYXlvdXQueGF4aXMuY29sb3IgPSB0aGlzLmdldEdyaWRDb2xvcih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICB9XG59XG4iXX0=