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
import { Component, ElementRef, NgZone, Renderer2, ViewEncapsulation } from '@angular/core';
import { WarpViewComponent } from '../warp-view-component';
import { GTSLib } from '../../utils/gts.lib';
import { ColorLib } from '../../utils/color-lib';
import moment from 'moment-timezone';
import { SizeService } from '../../services/resize.service';
import { Logger } from '../../utils/logger';
import { Timsort } from '../../utils/timsort';
export class WarpViewBarComponent extends WarpViewComponent {
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
        this.layout = {
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
        this.LOG = new Logger(WarpViewBarComponent, this._debug);
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.drawChart();
    }
    /**
     * @param {?} options
     * @return {?}
     */
    update(options) {
        this.drawChart();
    }
    /**
     * @private
     * @return {?}
     */
    drawChart() {
        if (!this.initChart(this.el)) {
            return;
        }
        this.plotlyConfig.scrollZoom = true;
        this.buildGraph();
    }
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    convert(data) {
        /** @type {?} */
        let gtsList = [];
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
        const dataset = [];
        gtsList.forEach((/**
         * @param {?} gts
         * @param {?} i
         * @return {?}
         */
        (gts, i) => {
            this.LOG.debug(['convert', 'gts item'], gts);
            if (gts.v) {
                Timsort.sort(gts.v, (/**
                 * @param {?} a
                 * @param {?} b
                 * @return {?}
                 */
                (a, b) => a[0] - b[0]));
                /** @type {?} */
                const label = GTSLib.serializeGtsMetadata(gts);
                /** @type {?} */
                const c = ColorLib.getColor(gts.id || i, this._options.scheme);
                /** @type {?} */
                const color = ((data.params || [])[i] || { datasetColor: c }).datasetColor || c;
                /** @type {?} */
                const series = {
                    type: 'bar',
                    mode: 'lines+markers',
                    name: label,
                    text: label,
                    orientation: this._options.horizontal ? 'h' : 'v',
                    x: [],
                    y: [],
                    hoverinfo: 'none',
                    marker: {
                        color: ColorLib.transparentize(color),
                        line: {
                            color,
                            width: 1
                        }
                    }
                };
                gts.v.forEach((/**
                 * @param {?} value
                 * @return {?}
                 */
                value => {
                    /** @type {?} */
                    const ts = value[0];
                    if (!this._options.horizontal) {
                        series.y.push(value[value.length - 1]);
                        if (this._options.timeMode && this._options.timeMode === 'timestamp') {
                            series.x.push(ts);
                        }
                        else {
                            series.x.push(moment.tz(moment.utc(ts / this.divider), this._options.timeZone).toISOString());
                        }
                    }
                    else {
                        series.x.push(value[value.length - 1]);
                        if (this._options.timeMode && this._options.timeMode === 'timestamp') {
                            series.y.push(ts);
                        }
                        else {
                            series.y.push(moment.tz(moment.utc(ts / this.divider), this._options.timeZone).toISOString());
                        }
                    }
                }));
                dataset.push(series);
            }
            else {
                this._options.timeMode = 'custom';
                this.LOG.debug(['convert', 'gts'], gts);
                (gts.columns || []).forEach((/**
                 * @param {?} label
                 * @param {?} index
                 * @return {?}
                 */
                (label, index) => {
                    /** @type {?} */
                    const c = ColorLib.getColor(gts.id || index, this._options.scheme);
                    /** @type {?} */
                    const color = ((data.params || [])[index] || { datasetColor: c }).datasetColor || c;
                    /** @type {?} */
                    const series = {
                        type: 'bar',
                        mode: 'lines+markers',
                        name: label,
                        text: label,
                        orientation: this._options.horizontal ? 'h' : 'v',
                        x: [],
                        y: [],
                        hoverinfo: 'none',
                        marker: {
                            color: ColorLib.transparentize(color),
                            line: {
                                color,
                                width: 1
                            }
                        }
                    };
                    if (this._options.horizontal) {
                        (gts.rows || []).forEach((/**
                         * @param {?} r
                         * @return {?}
                         */
                        r => {
                            series.y.unshift(r[0]);
                            series.x.push(r[index + 1]);
                        }));
                    }
                    else {
                        (gts.rows || []).forEach((/**
                         * @param {?} r
                         * @return {?}
                         */
                        r => {
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
    }
    /**
     * @private
     * @return {?}
     */
    buildGraph() {
        this.LOG.debug(['buildGraph', 'this.layout'], this.responsive);
        this.LOG.debug(['buildGraph', 'this.layout'], this.layout);
        this.LOG.debug(['buildGraph', 'this.plotlyConfig'], this.plotlyConfig);
        this.layout.showlegend = this._showLegend;
        this.layout.barmode = this._options.stacked ? 'stack' : 'group';
        this.layout.yaxis.color = this.getGridColor(this.el.nativeElement);
        this.layout.xaxis.color = this.getGridColor(this.el.nativeElement);
        this.loading = false;
    }
}
WarpViewBarComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-bar',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\" #chartContainer (mouseleave)=\"hideTooltip()\">\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display or wrong data format.</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-plotly #graph *ngIf=\"plotlyData?.length > 0\"\n                 [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot()\"\n                 className=\"chart\" (hover)=\"hover($event)\" (unhover)=\"unhover($event)\"\n                 [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                 [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n  <div #toolTip class=\"tooltip\" [ngStyle]=\"getTooltipPosition()\"></div>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}.tooltip{background-color:var(--warp-view-chart-legend-bg)!important;color:var(--warp-view-chart-legend-color)!important;text-align:left;position:absolute;display:none;padding:10px;border:1px solid grey;border-radius:5px;box-shadow:none;pointer-events:none;font-size:10px;min-width:100px;width:auto;max-width:50%;z-index:999;height:auto!important;left:-1000px}.tooltip .chip{border-radius:50%;background-color:#bbb;display:inline-block;width:5px;height:5px;border:2px solid #454545;margin-top:auto;margin-bottom:auto;vertical-align:middle;cursor:pointer}:host{display:block;height:100%}:host .modebar-group path{fill:var(--warp-view-font-color)}:host #chartContainer{height:100%}:host #chartContainer div{height:100%}:host div.chart{width:var(--warp-view-chart-width);height:var(--warp-view-chart-height)}"]
            }] }
];
/** @nocollapse */
WarpViewBarComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: SizeService },
    { type: NgZone }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LWJhci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VueC93YXJwdmlldy8iLCJzb3VyY2VzIjpbInNyYy9saWIvZWxlbWVudHMvd2FycC12aWV3LWJhci93YXJwLXZpZXctYmFyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQVUsU0FBUyxFQUFFLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ2xHLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBR3pELE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUMzQyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDL0MsT0FBTyxNQUFNLE1BQU0saUJBQWlCLENBQUM7QUFDckMsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBQzFELE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUMxQyxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFRNUMsTUFBTSxPQUFPLG9CQUFxQixTQUFRLGlCQUFpQjs7Ozs7OztJQWtCekQsWUFDUyxFQUFjLEVBQ2QsUUFBbUIsRUFDbkIsV0FBd0IsRUFDeEIsTUFBYztRQUVyQixLQUFLLENBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFMbEMsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUNkLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDbkIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQXBCdkIsV0FBTSxHQUFpQjtZQUNyQixVQUFVLEVBQUUsS0FBSztZQUNqQixLQUFLLEVBQUUsRUFBRTtZQUNULEtB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QU0sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUMxQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFDaEUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNuRSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ25FLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0lBQ3ZCLENBQUM7OztZQWxLRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGNBQWM7Z0JBQ3hCLHErQ0FBNkM7Z0JBRTdDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxTQUFTOzthQUMzQzs7OztZQWhCa0IsVUFBVTtZQUFrQixTQUFTO1lBT2hELFdBQVc7WUFQWSxNQUFNOzs7O0lBbUJuQyxzQ0FjRTs7SUFHQSxrQ0FBcUI7O0lBQ3JCLHdDQUEwQjs7SUFDMUIsMkNBQStCOztJQUMvQixzQ0FBcUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogIENvcHlyaWdodCAyMDIwICBTZW5YIFMuQS5TLlxuICpcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50LCBFbGVtZW50UmVmLCBOZ1pvbmUsIE9uSW5pdCwgUmVuZGVyZXIyLCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1dhcnBWaWV3Q29tcG9uZW50fSBmcm9tICcuLi93YXJwLXZpZXctY29tcG9uZW50JztcbmltcG9ydCB7UGFyYW19IGZyb20gJy4uLy4uL21vZGVsL3BhcmFtJztcbmltcG9ydCB7RGF0YU1vZGVsfSBmcm9tICcuLi8uLi9tb2RlbC9kYXRhTW9kZWwnO1xuaW1wb3J0IHtHVFNMaWJ9IGZyb20gJy4uLy4uL3V0aWxzL2d0cy5saWInO1xuaW1wb3J0IHtDb2xvckxpYn0gZnJvbSAnLi4vLi4vdXRpbHMvY29sb3ItbGliJztcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50LXRpbWV6b25lJztcbmltcG9ydCB7U2l6ZVNlcnZpY2V9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3Jlc2l6ZS5zZXJ2aWNlJztcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICcuLi8uLi91dGlscy9sb2dnZXInO1xuaW1wb3J0IHtUaW1zb3J0fSBmcm9tICcuLi8uLi91dGlscy90aW1zb3J0JztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnd2FycHZpZXctYmFyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3dhcnAtdmlldy1iYXIuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi93YXJwLXZpZXctYmFyLmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLlNoYWRvd0RvbVxufSlcbmV4cG9ydCBjbGFzcyBXYXJwVmlld0JhckNvbXBvbmVudCBleHRlbmRzIFdhcnBWaWV3Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICBsYXlvdXQ6IFBhcnRpYWw8YW55PiA9IHtcbiAgICBzaG93bGVnZW5kOiBmYWxzZSxcbiAgICB4YXhpczoge30sXG4gICAgeWF4aXM6IHtcbiAgICAgIGV4cG9uZW50Zm9ybWF0OiAnbm9uZScsXG4gICAgICBmaXhlZHJhbmdlOiB0cnVlLFxuICAgICAgc2hvd2xpbmU6IHRydWVcbiAgICB9LFxuICAgIG1hcmdpbjoge1xuICAgICAgdDogMTAsXG4gICAgICBiOiA0MCxcbiAgICAgIHI6IDEwLFxuICAgICAgbDogNTBcbiAgICB9XG4gIH07XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGVsOiBFbGVtZW50UmVmLFxuICAgIHB1YmxpYyByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHB1YmxpYyBzaXplU2VydmljZTogU2l6ZVNlcnZpY2UsXG4gICAgcHVibGljIG5nWm9uZTogTmdab25lXG4gICkge1xuICAgIHN1cGVyKGVsLCByZW5kZXJlciwgc2l6ZVNlcnZpY2UsIG5nWm9uZSk7XG4gICAgdGhpcy5MT0cgPSBuZXcgTG9nZ2VyKFdhcnBWaWV3QmFyQ29tcG9uZW50LCB0aGlzLl9kZWJ1Zyk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmRyYXdDaGFydCgpO1xuICB9XG5cbiAgdXBkYXRlKG9wdGlvbnM6IFBhcmFtKTogdm9pZCB7XG4gICAgdGhpcy5kcmF3Q2hhcnQoKTtcbiAgfVxuXG4gIHByaXZhdGUgZHJhd0NoYXJ0KCkge1xuICAgIGlmICghdGhpcy5pbml0Q2hhcnQodGhpcy5lbCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5wbG90bHlDb25maWcuc2Nyb2xsWm9vbSA9IHRydWU7XG4gICAgdGhpcy5idWlsZEdyYXBoKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgY29udmVydChkYXRhOiBEYXRhTW9kZWwpOiBQYXJ0aWFsPGFueT5bXSB7XG4gICAgbGV0IGd0c0xpc3QgPSBbXTtcbiAgICBpZiAoR1RTTGliLmlzQXJyYXkoZGF0YS5kYXRhKSkge1xuICAgICAgZGF0YS5kYXRhID0gR1RTTGliLmZsYXREZWVwKGRhdGEuZGF0YSBhcyBhbnlbXSk7XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2NvbnZlcnQnLCAnaXNBcnJheSddKTtcbiAgICAgIGlmIChkYXRhLmRhdGEubGVuZ3RoID4gMCAmJiBHVFNMaWIuaXNHdHMoZGF0YS5kYXRhWzBdKSkge1xuICAgICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2NvbnZlcnQnLCAnaXNBcnJheSAyJ10pO1xuICAgICAgICBndHNMaXN0ID0gR1RTTGliLmZsYXR0ZW5HdHNJZEFycmF5KGRhdGEuZGF0YSBhcyBhbnlbXSwgMCkucmVzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5MT0cuZGVidWcoWydjb252ZXJ0JywgJ2lzQXJyYXkgMyddKTtcbiAgICAgICAgZ3RzTGlzdCA9IGRhdGEuZGF0YSBhcyBhbnlbXTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5MT0cuZGVidWcoWydjb252ZXJ0JywgJ25vdCBhcnJheSddKTtcbiAgICAgIGd0c0xpc3QgPSBbZGF0YS5kYXRhXTtcbiAgICB9XG4gICAgdGhpcy5MT0cuZGVidWcoWydjb252ZXJ0JywgJ2d0c0xpc3QnXSwgZ3RzTGlzdCk7XG4gICAgY29uc3QgZGF0YXNldCA9IFtdO1xuICAgIGd0c0xpc3QuZm9yRWFjaCgoZ3RzLCBpKSA9PiB7XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2NvbnZlcnQnLCAnZ3RzIGl0ZW0nXSwgZ3RzKTtcbiAgICAgIGlmIChndHMudikge1xuICAgICAgICBUaW1zb3J0LnNvcnQoZ3RzLnYsIChhLCBiKSA9PiBhWzBdIC0gYlswXSk7XG4gICAgICAgIGNvbnN0IGxhYmVsID0gR1RTTGliLnNlcmlhbGl6ZUd0c01ldGFkYXRhKGd0cyk7XG4gICAgICAgIGNvbnN0IGMgPSBDb2xvckxpYi5nZXRDb2xvcihndHMuaWQgfHwgaSwgdGhpcy5fb3B0aW9ucy5zY2hlbWUpO1xuICAgICAgICBjb25zdCBjb2xvciA9ICgoZGF0YS5wYXJhbXMgfHwgW10pW2ldIHx8IHtkYXRhc2V0Q29sb3I6IGN9KS5kYXRhc2V0Q29sb3IgfHwgYztcbiAgICAgICAgY29uc3Qgc2VyaWVzOiBQYXJ0aWFsPGFueT4gPSB7XG4gICAgICAgICAgdHlwZTogJ2JhcicsXG4gICAgICAgICAgbW9kZTogJ2xpbmVzK21hcmtlcnMnLFxuICAgICAgICAgIG5hbWU6IGxhYmVsLFxuICAgICAgICAgIHRleHQ6IGxhYmVsLFxuICAgICAgICAgIG9yaWVudGF0aW9uOiB0aGlzLl9vcHRpb25zLmhvcml6b250YWwgPyAnaCcgOiAndicsXG4gICAgICAgICAgeDogW10sXG4gICAgICAgICAgeTogW10sXG4gICAgICAgICAgaG92ZXJpbmZvOiAnbm9uZScsXG4gICAgICAgICAgbWFya2VyOiB7XG4gICAgICAgICAgICBjb2xvcjogQ29sb3JMaWIudHJhbnNwYXJlbnRpemUoY29sb3IpLFxuICAgICAgICAgICAgbGluZToge1xuICAgICAgICAgICAgICBjb2xvcixcbiAgICAgICAgICAgICAgd2lkdGg6IDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGd0cy52LmZvckVhY2godmFsdWUgPT4ge1xuICAgICAgICAgIGNvbnN0IHRzID0gdmFsdWVbMF07XG4gICAgICAgICAgaWYgKCF0aGlzLl9vcHRpb25zLmhvcml6b250YWwpIHtcbiAgICAgICAgICAgIHNlcmllcy55LnB1c2godmFsdWVbdmFsdWUubGVuZ3RoIC0gMV0pO1xuICAgICAgICAgICAgaWYgKHRoaXMuX29wdGlvbnMudGltZU1vZGUgJiYgdGhpcy5fb3B0aW9ucy50aW1lTW9kZSA9PT0gJ3RpbWVzdGFtcCcpIHtcbiAgICAgICAgICAgICAgc2VyaWVzLngucHVzaCh0cyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzZXJpZXMueC5wdXNoKG1vbWVudC50eihtb21lbnQudXRjKHRzIC8gdGhpcy5kaXZpZGVyKSwgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSkudG9JU09TdHJpbmcoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlcmllcy54LnB1c2godmFsdWVbdmFsdWUubGVuZ3RoIC0gMV0pO1xuICAgICAgICAgICAgaWYgKHRoaXMuX29wdGlvbnMudGltZU1vZGUgJiYgdGhpcy5fb3B0aW9ucy50aW1lTW9kZSA9PT0gJ3RpbWVzdGFtcCcpIHtcbiAgICAgICAgICAgICAgc2VyaWVzLnkucHVzaCh0cyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzZXJpZXMueS5wdXNoKG1vbWVudC50eihtb21lbnQudXRjKHRzIC8gdGhpcy5kaXZpZGVyKSwgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSkudG9JU09TdHJpbmcoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZGF0YXNldC5wdXNoKHNlcmllcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9vcHRpb25zLnRpbWVNb2RlID0gJ2N1c3RvbSc7XG4gICAgICAgIHRoaXMuTE9HLmRlYnVnKFsnY29udmVydCcsICdndHMnXSwgZ3RzKTtcbiAgICAgICAgKGd0cy5jb2x1bW5zIHx8IFtdKS5mb3JFYWNoKChsYWJlbCwgaW5kZXgpID0+IHtcbiAgICAgICAgICBjb25zdCBjID0gQ29sb3JMaWIuZ2V0Q29sb3IoZ3RzLmlkIHx8IGluZGV4LCB0aGlzLl9vcHRpb25zLnNjaGVtZSk7XG4gICAgICAgICAgY29uc3QgY29sb3IgPSAoKGRhdGEucGFyYW1zIHx8IFtdKVtpbmRleF0gfHwge2RhdGFzZXRDb2xvcjogY30pLmRhdGFzZXRDb2xvciB8fCBjO1xuICAgICAgICAgIGNvbnN0IHNlcmllczogUGFydGlhbDxhbnk+ID0ge1xuICAgICAgICAgICAgdHlwZTogJ2JhcicsXG4gICAgICAgICAgICBtb2RlOiAnbGluZXMrbWFya2VycycsXG4gICAgICAgICAgICBuYW1lOiBsYWJlbCxcbiAgICAgICAgICAgIHRleHQ6IGxhYmVsLFxuICAgICAgICAgICAgb3JpZW50YXRpb246IHRoaXMuX29wdGlvbnMuaG9yaXpvbnRhbCA/ICdoJyA6ICd2JyxcbiAgICAgICAgICAgIHg6IFtdLFxuICAgICAgICAgICAgeTogW10sXG4gICAgICAgICAgICBob3ZlcmluZm86ICdub25lJyxcbiAgICAgICAgICAgIG1hcmtlcjoge1xuICAgICAgICAgICAgICBjb2xvcjogQ29sb3JMaWIudHJhbnNwYXJlbnRpemUoY29sb3IpLFxuICAgICAgICAgICAgICBsaW5lOiB7XG4gICAgICAgICAgICAgICAgY29sb3IsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgICAgaWYgKHRoaXMuX29wdGlvbnMuaG9yaXpvbnRhbCkge1xuICAgICAgICAgICAgKGd0cy5yb3dzIHx8IFtdKS5mb3JFYWNoKHIgPT4ge1xuICAgICAgICAgICAgICBzZXJpZXMueS51bnNoaWZ0KHJbMF0pO1xuICAgICAgICAgICAgICBzZXJpZXMueC5wdXNoKHJbaW5kZXggKyAxXSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgKGd0cy5yb3dzIHx8IFtdKS5mb3JFYWNoKHIgPT4ge1xuICAgICAgICAgICAgICBzZXJpZXMueC5wdXNoKHJbMF0pO1xuICAgICAgICAgICAgICBzZXJpZXMueS5wdXNoKHJbaW5kZXggKyAxXSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZGF0YXNldC5wdXNoKHNlcmllcyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnY29udmVydCcsICdkYXRhc2V0J10sIGRhdGFzZXQsIHRoaXMuX29wdGlvbnMuaG9yaXpvbnRhbCk7XG4gICAgcmV0dXJuIGRhdGFzZXQ7XG4gIH1cblxuICBwcml2YXRlIGJ1aWxkR3JhcGgoKSB7XG4gICAgdGhpcy5MT0cuZGVidWcoWydidWlsZEdyYXBoJywgJ3RoaXMubGF5b3V0J10sIHRoaXMucmVzcG9uc2l2ZSk7XG4gICAgdGhpcy5MT0cuZGVidWcoWydidWlsZEdyYXBoJywgJ3RoaXMubGF5b3V0J10sIHRoaXMubGF5b3V0KTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2J1aWxkR3JhcGgnLCAndGhpcy5wbG90bHlDb25maWcnXSwgdGhpcy5wbG90bHlDb25maWcpO1xuICAgIHRoaXMubGF5b3V0LnNob3dsZWdlbmQgPSB0aGlzLl9zaG93TGVnZW5kO1xuICAgIHRoaXMubGF5b3V0LmJhcm1vZGUgPSB0aGlzLl9vcHRpb25zLnN0YWNrZWQgPyAnc3RhY2snIDogJ2dyb3VwJztcbiAgICB0aGlzLmxheW91dC55YXhpcy5jb2xvciA9IHRoaXMuZ2V0R3JpZENvbG9yKHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XG4gICAgdGhpcy5sYXlvdXQueGF4aXMuY29sb3IgPSB0aGlzLmdldEdyaWRDb2xvcih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICB9XG59XG4iXX0=