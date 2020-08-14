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
import deepEqual from 'deep-equal';
import { SizeService } from '../../services/resize.service';
import { Logger } from '../../utils/logger';
import { ChartLib } from '../../utils/chart-lib';
var WarpViewGaugeComponent = /** @class */ (function (_super) {
    tslib_1.__extends(WarpViewGaugeComponent, _super);
    function WarpViewGaugeComponent(el, renderer, sizeService, ngZone) {
        var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
        _this.el = el;
        _this.renderer = renderer;
        _this.sizeService = sizeService;
        _this.ngZone = ngZone;
        _this.CHART_MARGIN = 0.05;
        // tslint:disable-next-line:variable-name
        _this._type = 'gauge'; // gauge or bullet
        _this.LOG = new Logger(WarpViewGaugeComponent, _this._debug);
        return _this;
    }
    Object.defineProperty(WarpViewGaugeComponent.prototype, "type", {
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
    WarpViewGaugeComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this._options = this._options || this.defOptions;
    };
    /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    WarpViewGaugeComponent.prototype.update = /**
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
     * @return {?}
     */
    WarpViewGaugeComponent.prototype.drawChart = /**
     * @return {?}
     */
    function () {
        if (!this.initChart(this.el)) {
            return;
        }
        this.LOG.debug(['drawChart', 'plotlyData'], this.plotlyData, this._type);
        this.layout.autosize = true;
        this.layout.grid = {
            rows: Math.ceil(this.plotlyData.length / 2),
            columns: 2,
            pattern: 'independent',
            xgap: 0.2,
            ygap: 0.2
        };
        this.layout.margin = { t: 25, r: 25, l: 25, b: 25 };
        if (this._type === 'bullet') {
            this.layout.height = this.plotlyData.length * 100;
            ((/** @type {?} */ (this.el.nativeElement))).style.height = this.layout.height + 'px';
            this.layout.margin.l = 300;
            this.layout.yaxis = {
                automargin: true
            };
            this.layout.grid = { rows: this.plotlyData.length, columns: 1, pattern: 'independent' };
        }
        this.loading = false;
    };
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    WarpViewGaugeComponent.prototype.convert = /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    function (data) {
        var _this = this;
        this.LOG.debug(['convert'], data);
        /** @type {?} */
        var gtsList = (/** @type {?} */ (data.data));
        /** @type {?} */
        var dataList = [];
        /** @type {?} */
        var max = Number.MIN_VALUE;
        this.LOG.debug(['convert', 'gtsList'], gtsList);
        if (!gtsList || gtsList.length === 0 || gtsList[0].length < 2) {
            return;
        }
        gtsList.forEach((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return max = Math.max(max, d[1]); }));
        /** @type {?} */
        var x = 0;
        /** @type {?} */
        var y = -1 / (gtsList.length / 2);
        gtsList.forEach((/**
         * @param {?} gts
         * @param {?} i
         * @return {?}
         */
        function (gts, i) {
            if (i % 2 !== 0) {
                x = 0.5;
            }
            else {
                x = 0;
                y += 1 / (gtsList.length / 2);
            }
            /** @type {?} */
            var c = ColorLib.getColor(gts.id || i, _this._options.scheme);
            /** @type {?} */
            var color = ((data.params || [])[i] || { datasetColor: c }).datasetColor || c;
            /** @type {?} */
            var domain = gtsList.length > 1 ? {
                x: [x + _this.CHART_MARGIN, x + 0.5 - _this.CHART_MARGIN],
                y: [y + _this.CHART_MARGIN, y + 1 / (gtsList.length / 2) - _this.CHART_MARGIN * 2]
            } : {
                x: [0, 1],
                y: [0, 1]
            };
            if (_this._type === 'bullet' || (!!data.params && !!data.params[i].type && data.params[i].type === 'bullet')) {
                domain.x = [_this.CHART_MARGIN, 1 - _this.CHART_MARGIN];
                domain.y = [(i > 0 ? i / gtsList.length : 0) + _this.CHART_MARGIN, (i + 1) / gtsList.length - _this.CHART_MARGIN];
            }
            dataList.push({
                domain: domain,
                align: 'left',
                value: gts[1],
                delta: {
                    reference: !!data.params && !!data.params[i].delta ? data.params[i].delta + gts[1] : 0,
                    font: { color: _this.getLabelColor(_this.el.nativeElement) }
                },
                title: {
                    text: gts[0],
                    align: 'center',
                    font: { color: _this.getLabelColor(_this.el.nativeElement) }
                },
                number: {
                    font: { color: _this.getLabelColor(_this.el.nativeElement) }
                },
                type: 'indicator',
                mode: !!data.params && !!data.params[i].delta ? 'number+delta+gauge' : 'gauge+number',
                gauge: {
                    bgcolor: 'transparent',
                    shape: !!data.params && !!data.params[i].type ? data.params[i].type : _this._type || 'gauge',
                    bordercolor: _this.getGridColor(_this.el.nativeElement),
                    axis: {
                        range: [null, max],
                        tickcolor: _this.getGridColor(_this.el.nativeElement),
                        tickfont: { color: _this.getGridColor(_this.el.nativeElement) }
                    },
                    bar: {
                        color: ColorLib.transparentize(color),
                        line: {
                            width: 1,
                            color: color
                        }
                    }
                }
            });
            _this.LOG.debug(['convert', 'dataList'], i);
        }));
        this.LOG.debug(['convert', 'dataList'], dataList);
        return dataList;
    };
    WarpViewGaugeComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-gauge',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\">\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-plotly #graph *ngIf=\"plotlyData?.length > 0\"\n                     [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot()\"\n                     (relayout)=\"relayout($event)\"\n                     [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                     [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n</div>\n",
                    encapsulation: ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host{display:block;height:100%}:host #chartContainer{height:100%}:host #chartContainer div{height:100%}:host div.chart{width:var(--warp-view-chart-width,100%);height:var(--warp-view-chart-height,100%)}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewGaugeComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: SizeService },
        { type: NgZone }
    ]; };
    WarpViewGaugeComponent.propDecorators = {
        type: [{ type: Input, args: ['type',] }]
    };
    return WarpViewGaugeComponent;
}(WarpViewComponent));
export { WarpViewGaugeComponent };
if (false) {
    /**
     * @type {?}
     * @private
     */
    WarpViewGaugeComponent.prototype.CHART_MARGIN;
    /**
     * @type {?}
     * @private
     */
    WarpViewGaugeComponent.prototype._type;
    /** @type {?} */
    WarpViewGaugeComponent.prototype.el;
    /** @type {?} */
    WarpViewGaugeComponent.prototype.renderer;
    /** @type {?} */
    WarpViewGaugeComponent.prototype.sizeService;
    /** @type {?} */
    WarpViewGaugeComponent.prototype.ngZone;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LWdhdWdlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzZW54L3dhcnB2aWV3LyIsInNvdXJjZXMiOlsic3JjL2xpYi9lbGVtZW50cy93YXJwLXZpZXctZ2F1Z2Uvd2FycC12aWV3LWdhdWdlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBVSxTQUFTLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekcsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFHekQsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9DLE9BQU8sU0FBUyxNQUFNLFlBQVksQ0FBQztBQUNuQyxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sK0JBQStCLENBQUM7QUFDMUQsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQzFDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUcvQztJQU00QyxrREFBaUI7SUFVM0QsZ0NBQ1MsRUFBYyxFQUNkLFFBQW1CLEVBQ25CLFdBQXdCLEVBQ3hCLE1BQWM7UUFKdkIsWUFNRSxrQkFBTSxFQUFFLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxNQUFNLENBQUMsU0FFekM7UUFQUSxRQUFFLEdBQUYsRUFBRSxDQUFZO1FBQ2QsY0FBUSxHQUFSLFFBQVEsQ0FBVztRQUNuQixpQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4QixZQUFNLEdBQU4sTUFBTSxDQUFRO1FBUmYsa0JBQVksR0FBRyxJQUFJLENBQUM7O1FBRXBCLFdBQUssR0FBRyxPQUFPLENBQUMsQ0FBQyxrQkFBa0I7UUFTekMsS0FBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLE1BQU0sQ0FBQyxzQkFBc0IsRUFB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QUMsRUFBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDbEQsT0FBTyxRQUFRLENBQUM7SUFDbEIsQ0FBQzs7Z0JBMUlGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsZ0JBQWdCO29CQUMxQix1ekNBQStDO29CQUUvQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsU0FBUzs7aUJBQzNDOzs7O2dCQWhCa0IsVUFBVTtnQkFBeUIsU0FBUztnQkFNdkQsV0FBVztnQkFObUIsTUFBTTs7O3VCQWtCekMsS0FBSyxTQUFDLE1BQU07O0lBb0lmLDZCQUFDO0NBQUEsQUEzSUQsQ0FNNEMsaUJBQWlCLEdBcUk1RDtTQXJJWSxzQkFBc0I7Ozs7OztJQU1qQyw4Q0FBNEI7Ozs7O0lBRTVCLHVDQUF3Qjs7SUFHdEIsb0NBQXFCOztJQUNyQiwwQ0FBMEI7O0lBQzFCLDZDQUErQjs7SUFDL0Isd0NBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqICBDb3B5cmlnaHQgMjAyMCAgU2VuWCBTLkEuUy5cbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudCwgRWxlbWVudFJlZiwgSW5wdXQsIE5nWm9uZSwgT25Jbml0LCBSZW5kZXJlcjIsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7V2FycFZpZXdDb21wb25lbnR9IGZyb20gJy4uL3dhcnAtdmlldy1jb21wb25lbnQnO1xuaW1wb3J0IHtEYXRhTW9kZWx9IGZyb20gJy4uLy4uL21vZGVsL2RhdGFNb2RlbCc7XG5pbXBvcnQgZ2F1Z2UgZnJvbSAnY2FudmFzLWdhdWdlcyc7XG5pbXBvcnQge0NvbG9yTGlifSBmcm9tICcuLi8uLi91dGlscy9jb2xvci1saWInO1xuaW1wb3J0IGRlZXBFcXVhbCBmcm9tICdkZWVwLWVxdWFsJztcbmltcG9ydCB7U2l6ZVNlcnZpY2V9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3Jlc2l6ZS5zZXJ2aWNlJztcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICcuLi8uLi91dGlscy9sb2dnZXInO1xuaW1wb3J0IHtDaGFydExpYn0gZnJvbSAnLi4vLi4vdXRpbHMvY2hhcnQtbGliJztcbmltcG9ydCB7UGFyYW19IGZyb20gJy4uLy4uL21vZGVsL3BhcmFtJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnd2FycHZpZXctZ2F1Z2UnLFxuICB0ZW1wbGF0ZVVybDogJy4vd2FycC12aWV3LWdhdWdlLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vd2FycC12aWV3LWdhdWdlLmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLlNoYWRvd0RvbVxufSlcbmV4cG9ydCBjbGFzcyBXYXJwVmlld0dhdWdlQ29tcG9uZW50IGV4dGVuZHMgV2FycFZpZXdDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBASW5wdXQoJ3R5cGUnKSBzZXQgdHlwZSh0eXBlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl90eXBlID0gdHlwZTtcbiAgICB0aGlzLmRyYXdDaGFydCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBDSEFSVF9NQVJHSU4gPSAwLjA1O1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZVxuICBwcml2YXRlIF90eXBlID0gJ2dhdWdlJzsgLy8gZ2F1Z2Ugb3IgYnVsbGV0XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGVsOiBFbGVtZW50UmVmLFxuICAgIHB1YmxpYyByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHB1YmxpYyBzaXplU2VydmljZTogU2l6ZVNlcnZpY2UsXG4gICAgcHVibGljIG5nWm9uZTogTmdab25lXG4gICkge1xuICAgIHN1cGVyKGVsLCByZW5kZXJlciwgc2l6ZVNlcnZpY2UsIG5nWm9uZSk7XG4gICAgdGhpcy5MT0cgPSBuZXcgTG9nZ2VyKFdhcnBWaWV3R2F1Z2VDb21wb25lbnQsIHRoaXMuX2RlYnVnKTtcbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuX29wdGlvbnMgPSB0aGlzLl9vcHRpb25zIHx8IHRoaXMuZGVmT3B0aW9ucztcbiAgfVxuXG4gIHVwZGF0ZShvcHRpb25zLCByZWZyZXNoKTogdm9pZCB7XG4gICAgdGhpcy5MT0cuZGVidWcoWydvbk9wdGlvbnMnLCAnYmVmb3JlJ10sIHRoaXMuX29wdGlvbnMsIG9wdGlvbnMpO1xuICAgIGlmICghZGVlcEVxdWFsKG9wdGlvbnMsIHRoaXMuX29wdGlvbnMpKSB7XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ29wdGlvbnMnLCAnY2hhbmdlZCddLCBvcHRpb25zKTtcbiAgICAgIHRoaXMuX29wdGlvbnMgPSBDaGFydExpYi5tZXJnZURlZXAodGhpcy5fb3B0aW9ucywgb3B0aW9ucyBhcyBQYXJhbSkgYXMgUGFyYW07XG4gICAgfVxuICAgIHRoaXMuZHJhd0NoYXJ0KCk7XG4gIH1cblxuICBkcmF3Q2hhcnQoKSB7XG4gICAgaWYgKCF0aGlzLmluaXRDaGFydCh0aGlzLmVsKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RyYXdDaGFydCcsICdwbG90bHlEYXRhJ10sIHRoaXMucGxvdGx5RGF0YSwgdGhpcy5fdHlwZSk7XG4gICAgdGhpcy5sYXlvdXQuYXV0b3NpemUgPSB0cnVlO1xuICAgIHRoaXMubGF5b3V0LmdyaWQgPSB7XG4gICAgICByb3dzOiBNYXRoLmNlaWwodGhpcy5wbG90bHlEYXRhLmxlbmd0aCAvIDIpLFxuICAgICAgY29sdW1uczogMixcbiAgICAgIHBhdHRlcm46ICdpbmRlcGVuZGVudCcsXG4gICAgICB4Z2FwOiAwLjIsXG4gICAgICB5Z2FwOiAwLjJcbiAgICB9O1xuICAgIHRoaXMubGF5b3V0Lm1hcmdpbiA9IHt0OiAyNSwgcjogMjUsIGw6IDI1LCBiOiAyNX07XG4gICAgaWYgKHRoaXMuX3R5cGUgPT09ICdidWxsZXQnKSB7XG4gICAgICB0aGlzLmxheW91dC5oZWlnaHQgPSB0aGlzLnBsb3RseURhdGEubGVuZ3RoICogMTAwO1xuICAgICAgKHRoaXMuZWwubmF0aXZlRWxlbWVudCBhcyBIVE1MRGl2RWxlbWVudCkuc3R5bGUuaGVpZ2h0ID0gdGhpcy5sYXlvdXQuaGVpZ2h0ICsgJ3B4JztcbiAgICAgIHRoaXMubGF5b3V0Lm1hcmdpbi5sID0gMzAwO1xuICAgICAgdGhpcy5sYXlvdXQueWF4aXMgPSB7XG4gICAgICAgIGF1dG9tYXJnaW46IHRydWVcbiAgICAgIH07XG4gICAgICB0aGlzLmxheW91dC5ncmlkID0ge3Jvd3M6IHRoaXMucGxvdGx5RGF0YS5sZW5ndGgsIGNvbHVtbnM6IDEsIHBhdHRlcm46ICdpbmRlcGVuZGVudCd9O1xuICAgIH1cbiAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgfVxuXG4gIHByb3RlY3RlZCBjb252ZXJ0KGRhdGE6IERhdGFNb2RlbCk6IGFueVtdIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2NvbnZlcnQnXSwgZGF0YSk7XG4gICAgY29uc3QgZ3RzTGlzdCA9IGRhdGEuZGF0YSBhcyBhbnlbXTtcbiAgICBjb25zdCBkYXRhTGlzdCA9IFtdO1xuICAgIGxldCBtYXggPSBOdW1iZXIuTUlOX1ZBTFVFO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnY29udmVydCcsICdndHNMaXN0J10sIGd0c0xpc3QpO1xuICAgIGlmICghZ3RzTGlzdCB8fCBndHNMaXN0Lmxlbmd0aCA9PT0gMCB8fCBndHNMaXN0WzBdLmxlbmd0aCA8IDIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZ3RzTGlzdC5mb3JFYWNoKGQgPT4gbWF4ID0gTWF0aC5tYXgobWF4LCBkWzFdKSk7XG4gICAgbGV0IHggPSAwO1xuICAgIGxldCB5ID0gLTEgLyAoZ3RzTGlzdC5sZW5ndGggLyAyKTtcbiAgICBndHNMaXN0LmZvckVhY2goKGd0cywgaSkgPT4ge1xuICAgICAgaWYgKGkgJSAyICE9PSAwKSB7XG4gICAgICAgIHggPSAwLjU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB4ID0gMDtcbiAgICAgICAgeSArPSAxIC8gKGd0c0xpc3QubGVuZ3RoIC8gMik7XG4gICAgICB9XG4gICAgICBjb25zdCBjID0gQ29sb3JMaWIuZ2V0Q29sb3IoZ3RzLmlkIHx8IGksIHRoaXMuX29wdGlvbnMuc2NoZW1lKTtcbiAgICAgIGNvbnN0IGNvbG9yID0gKChkYXRhLnBhcmFtcyB8fCBbXSlbaV0gfHwge2RhdGFzZXRDb2xvcjogY30pLmRhdGFzZXRDb2xvciB8fCBjO1xuICAgICAgY29uc3QgZG9tYWluID0gZ3RzTGlzdC5sZW5ndGggPiAxID8ge1xuICAgICAgICB4OiBbeCArIHRoaXMuQ0hBUlRfTUFSR0lOLCB4ICsgMC41IC0gdGhpcy5DSEFSVF9NQVJHSU5dLFxuICAgICAgICB5OiBbeSArIHRoaXMuQ0hBUlRfTUFSR0lOLCB5ICsgMSAvIChndHNMaXN0Lmxlbmd0aCAvIDIpIC0gdGhpcy5DSEFSVF9NQVJHSU4gKiAyXVxuICAgICAgfSA6IHtcbiAgICAgICAgeDogWzAsIDFdLFxuICAgICAgICB5OiBbMCwgMV1cbiAgICAgIH07XG4gICAgICBpZiAodGhpcy5fdHlwZSA9PT0gJ2J1bGxldCcgfHwgKCEhZGF0YS5wYXJhbXMgJiYgISFkYXRhLnBhcmFtc1tpXS50eXBlICYmIGRhdGEucGFyYW1zW2ldLnR5cGUgPT09ICdidWxsZXQnKSkge1xuICAgICAgICBkb21haW4ueCA9IFt0aGlzLkNIQVJUX01BUkdJTiwgMSAtIHRoaXMuQ0hBUlRfTUFSR0lOXTtcbiAgICAgICAgZG9tYWluLnkgPSBbKGkgPiAwID8gaSAvIGd0c0xpc3QubGVuZ3RoIDogMCkgKyB0aGlzLkNIQVJUX01BUkdJTiwgKGkgKyAxKSAvIGd0c0xpc3QubGVuZ3RoIC0gdGhpcy5DSEFSVF9NQVJHSU5dO1xuICAgICAgfVxuICAgICAgZGF0YUxpc3QucHVzaChcbiAgICAgICAge1xuICAgICAgICAgIGRvbWFpbixcbiAgICAgICAgICBhbGlnbjogJ2xlZnQnLFxuICAgICAgICAgIHZhbHVlOiBndHNbMV0sXG4gICAgICAgICAgZGVsdGE6IHtcbiAgICAgICAgICAgIHJlZmVyZW5jZTogISFkYXRhLnBhcmFtcyAmJiAhIWRhdGEucGFyYW1zW2ldLmRlbHRhID8gZGF0YS5wYXJhbXNbaV0uZGVsdGEgKyBndHNbMV0gOiAwLFxuICAgICAgICAgICAgZm9udDoge2NvbG9yOiB0aGlzLmdldExhYmVsQ29sb3IodGhpcy5lbC5uYXRpdmVFbGVtZW50KX1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHRpdGxlOiB7XG4gICAgICAgICAgICB0ZXh0OiBndHNbMF0sXG4gICAgICAgICAgICBhbGlnbjogJ2NlbnRlcicsXG4gICAgICAgICAgICBmb250OiB7Y29sb3I6IHRoaXMuZ2V0TGFiZWxDb2xvcih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgbnVtYmVyOiB7XG4gICAgICAgICAgICBmb250OiB7Y29sb3I6IHRoaXMuZ2V0TGFiZWxDb2xvcih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgdHlwZTogJ2luZGljYXRvcicsXG4gICAgICAgICAgbW9kZTogISFkYXRhLnBhcmFtcyAmJiAhIWRhdGEucGFyYW1zW2ldLmRlbHRhID8gJ251bWJlcitkZWx0YStnYXVnZScgOiAnZ2F1Z2UrbnVtYmVyJyxcbiAgICAgICAgICBnYXVnZToge1xuICAgICAgICAgICAgYmdjb2xvcjogJ3RyYW5zcGFyZW50JyxcbiAgICAgICAgICAgIHNoYXBlOiAhIWRhdGEucGFyYW1zICYmICEhZGF0YS5wYXJhbXNbaV0udHlwZSA/IGRhdGEucGFyYW1zW2ldLnR5cGUgOiB0aGlzLl90eXBlIHx8ICdnYXVnZScsXG4gICAgICAgICAgICBib3JkZXJjb2xvcjogdGhpcy5nZXRHcmlkQ29sb3IodGhpcy5lbC5uYXRpdmVFbGVtZW50KSxcbiAgICAgICAgICAgIGF4aXM6IHtcbiAgICAgICAgICAgICAgcmFuZ2U6IFtudWxsLCBtYXhdLFxuICAgICAgICAgICAgICB0aWNrY29sb3I6IHRoaXMuZ2V0R3JpZENvbG9yKHRoaXMuZWwubmF0aXZlRWxlbWVudCksXG4gICAgICAgICAgICAgIHRpY2tmb250OiB7Y29sb3I6IHRoaXMuZ2V0R3JpZENvbG9yKHRoaXMuZWwubmF0aXZlRWxlbWVudCl9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYmFyOiB7XG4gICAgICAgICAgICAgIGNvbG9yOiBDb2xvckxpYi50cmFuc3BhcmVudGl6ZShjb2xvciksXG4gICAgICAgICAgICAgIGxpbmU6IHtcbiAgICAgICAgICAgICAgICB3aWR0aDogMSxcbiAgICAgICAgICAgICAgICBjb2xvclxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsnY29udmVydCcsICdkYXRhTGlzdCddLCBpKTtcbiAgICB9KTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2NvbnZlcnQnLCAnZGF0YUxpc3QnXSwgZGF0YUxpc3QpO1xuICAgIHJldHVybiBkYXRhTGlzdDtcbiAgfVxufVxuIl19