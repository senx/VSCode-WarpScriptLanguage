/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, ElementRef, Input, NgZone, Renderer2, ViewEncapsulation } from '@angular/core';
import { WarpViewComponent } from '../warp-view-component';
import { SizeService } from '../../services/resize.service';
import { Logger } from '../../utils/logger';
import { ColorLib } from '../../utils/color-lib';
import { GTSLib } from '../../utils/gts.lib';
import moment from 'moment-timezone';
export class WarpViewBoxComponent extends WarpViewComponent {
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
            xaxis: {
                type: '-'
            },
            yaxis: { zeroline: false },
            boxmode: 'group',
            margin: {
                t: 10,
                b: 25,
                r: 10,
                l: 10
            }
        };
        this._type = 'box';
        this.LOG = new Logger(WarpViewBoxComponent, this._debug);
    }
    /**
     * @param {?} type
     * @return {?}
     */
    set type(type) {
        this._type = type;
        this.drawChart();
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
        const dataset = [];
        this.LOG.debug(['convert'], this._options, this._type);
        /** @type {?} */
        let gtsList = GTSLib.flatDeep(GTSLib.flattenGtsIdArray((/** @type {?} */ (data.data)), 0).res);
        gtsList = gtsList.filter((/**
         * @param {?} g
         * @return {?}
         */
        g => {
            return (g.v && GTSLib.isGtsToPlot(g));
        }));
        /** @type {?} */
        const pattern = 'YYYY/MM/DD hh:mm:ss';
        /** @type {?} */
        const format = pattern.slice(0, pattern.lastIndexOf(this._options.split || 'D') + 1);
        gtsList.forEach((/**
         * @param {?} gts
         * @param {?} i
         * @return {?}
         */
        (gts, i) => {
            if (gts.v) {
                /** @type {?} */
                const label = GTSLib.serializeGtsMetadata(gts);
                /** @type {?} */
                const c = ColorLib.getColor(gts.id, this._options.scheme);
                /** @type {?} */
                const color = ((data.params || [])[i] || { datasetColor: c }).datasetColor || c;
                /** @type {?} */
                const series = {
                    type: 'box',
                    boxmean: 'sd',
                    marker: { color },
                    name: label,
                    x: this._type === 'box' ? undefined : [],
                    y: [],
                    //  hoverinfo: 'none',
                    boxpoints: false
                };
                if (!!this._options.showDots) {
                    series.boxpoints = 'all';
                }
                gts.v.forEach((/**
                 * @param {?} value
                 * @return {?}
                 */
                value => {
                    series.y.push(value[value.length - 1]);
                    if (this._type === 'box-date') {
                        series.x.push(moment.tz(moment.utc(value[0] / this.divider), this._options.timeZone).toISOString());
                    }
                }));
                dataset.push(series);
            }
        }));
        this.LOG.debug(['convert', 'dataset'], dataset, format);
        return dataset;
    }
    /**
     * @private
     * @return {?}
     */
    buildGraph() {
        this.LOG.debug(['drawChart', 'this.layout'], this.responsive);
        this.LOG.debug(['drawChart', 'this.layout'], this.layout);
        this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig);
        this.layout.showlegend = this.showLegend;
        this.layout.xaxis.showticklabels = this._type === 'box-date';
        this.layout.yaxis.color = this.getGridColor(this.el.nativeElement);
        this.layout.xaxis.color = this.getGridColor(this.el.nativeElement);
        this.loading = false;
    }
    /**
     * @param {?} data
     * @return {?}
     */
    hover(data) {
    }
}
WarpViewBoxComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-box',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\" #chartContainer>\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-plotly #graph *ngIf=\"plotlyData?.length > 0\"\n                     [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot()\"\n                     className=\"chart\" (hover)=\"hover($event)\" (unhover)=\"unhover($event)\"\n                     [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                     [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n  <div #toolTip class=\"tooltip\" [ngStyle]=\"getTooltipPosition()\"></div>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}.tooltip{background-color:var(--warp-view-chart-legend-bg)!important;color:var(--warp-view-chart-legend-color)!important;text-align:left;position:absolute;display:none;padding:10px;border:1px solid grey;border-radius:5px;box-shadow:none;pointer-events:none;font-size:10px;min-width:100px;width:auto;max-width:50%;z-index:999;height:auto!important;left:-1000px}.tooltip .chip{border-radius:50%;background-color:#bbb;display:inline-block;width:5px;height:5px;border:2px solid #454545;margin-top:auto;margin-bottom:auto;vertical-align:middle;cursor:pointer}:host{display:block;height:100%}:host #chartContainer{height:100%}:host #chartContainer div{height:100%}:host div.chart{width:var(--warp-view-chart-width);height:var(--warp-view-chart-height)}"]
            }] }
];
/** @nocollapse */
WarpViewBoxComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: SizeService },
    { type: NgZone }
];
WarpViewBoxComponent.propDecorators = {
    type: [{ type: Input, args: ['type',] }]
};
if (false) {
    /** @type {?} */
    WarpViewBoxComponent.prototype.layout;
    /**
     * @type {?}
     * @private
     */
    WarpViewBoxComponent.prototype._type;
    /** @type {?} */
    WarpViewBoxComponent.prototype.el;
    /** @type {?} */
    WarpViewBoxComponent.prototype.renderer;
    /** @type {?} */
    WarpViewBoxComponent.prototype.sizeService;
    /** @type {?} */
    WarpViewBoxComponent.prototype.ngZone;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LWJveC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VueC93YXJwdmlldy8iLCJzb3VyY2VzIjpbInNyYy9saWIvZWxlbWVudHMvd2FycC12aWV3LWJveC93YXJwLXZpZXctYm94LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBVSxTQUFTLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekcsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFHekQsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBQzFELE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUMxQyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDL0MsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBRTNDLE9BQU8sTUFBTSxNQUFNLGlCQUFpQixDQUFDO0FBUXJDLE1BQU0sT0FBTyxvQkFBcUIsU0FBUSxpQkFBaUI7Ozs7Ozs7SUF1QnpELFlBQ1MsRUFBYyxFQUNkLFFBQW1CLEVBQ25CLFdBQXdCLEVBQ3hCLE1BQWM7UUFFckIsS0FBSyxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBTGxDLE9BQUUsR0FBRixFQUFFLENBQVk7UUFDZCxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ25CLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLFdBQU0sR0FBTixNQUFNLENBQVE7UUFwQnZCLFdBQU0sR0FBaUI7WUFDckIsVUFBVSxFQUFFLEtBQUs7WUFDakIsS0FBSyxFQUFFO2dCQUNMLElBQUksRUFBRSxHQUFHO2FBQ1Y7WUFDRCxLQUFLLEVBQUUsRUFBQyxRQUFRLEVBQUUsS0FBSyxFQUFDO1lBQ3hCLE9BQU8sRUFBRSxPQUFPO1lBQ2hCLE1BQU0sRUFBRTtnQkFDTixDQUFDLEVBQUUsRUFBRTtnQkFDTCxDQUFDLEVBQUUsRUFBRTtnQkFDTCxDQUFDLEVBQUUsRUFBRTtnQkFDTCxDQUFDLEVBQUUsRUFBRTthQUNOO1NBQ0YsQ0FBQztRQUNNLFVBQUssR0FBRyxLQUFLLENBQUM7UUFTcEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDM0QsQ0FBQzs7Ozs7SUE3QkQsSUFBbUIsSUFBSSxDQUFDLElBQVk7UUFDbEMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ25CLENBQUM7Ozs7SUE0QkQsUUFBUTtRQUNOLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNuQixDQUFDOzs7OztJQUVELE1BQU0sQ0FBQyxPQUFjO1FBQ25CLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNuQixDQUFDOzs7OztJQUVPLFNBQVM7UUFDZixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUU7WUFDNUIsT0FBTztTQUNSO1FBQ0QsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUNwQixDQUFDOzs7Ozs7SUFFUyxPQUFPLENBQUMsSUFBZTs7Y0FDekIsT0FBTyxHQUFtQixFQUFFO1FBQ2xDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7O1lBQ25ELE9BQU8sR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxtQkFBQSxJQUFJLENBQUMsSUFBSSxFQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQ2xGLE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBTTs7OztRQUFDLENBQUMsQ0FBQyxFQUFFO1lBQzNCLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QyxDQUFDLEVBQUMsQ0FBQzs7Y0FDRyxPQUFPLEdBQUcscUJBQXFCOztjQUMvQixNQUFNLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDcEYsT0FBTyxDQUFDLE9BQU87Ozs7O1FBQUMsQ0FBQyxHQUFRLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDOUIsSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUFFOztzQkFDSCxLQUFLLEdBQUcsTUFBTSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQzs7c0JBQ3hDLENBQUMsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7O3NCQUNuRCxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBQyxZQUFZLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxZQUFZLElBQUksQ0FBQzs7c0JBQ3ZFLE1BQU0sR0FBaUI7b0JBQzNCLElBQUksRUFBRSxLQUFLO29CQUNYLE9BQU8sRUFBRSxJQUFJO29CQUNiLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBQztvQkFDZixJQUFJLEVBQUUsS0FBSztvQkFDWCxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRTtvQkFDeEMsQ0FBQyxFQUFFLEVBQUU7O29CQUVMLFNBQVMsRUFBRSxLQUFLO2lCQUNqQjtnQkFDRCxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRTtvQkFDNUIsTUFBTSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7aUJBQzFCO2dCQUNELEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTzs7OztnQkFBQyxLQUFLLENBQUMsRUFBRTtvQkFDcEIsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdkMsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLFVBQVUsRUFBRTt3QkFDN0IsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO3FCQUNyRztnQkFDSCxDQUFDLEVBQUMsQ0FBQztnQkFDSCxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ3RCO1FBQ0gsQ0FBQyxFQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDeEQsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQzs7Ozs7SUFFTyxVQUFVO1FBQ2hCLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVyxFQUFFLGFBQWEsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM5RCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsRUFBRSxhQUFhLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLEVBQUUsbUJBQW1CLENBQUMsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDdEUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUN6QyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLEtBQUssS0FBSyxVQUFVLENBQUM7UUFDN0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNuRSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ25FLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0lBQ3ZCLENBQUM7Ozs7O0lBRUQsS0FBSyxDQUFDLElBQVM7SUFFZixDQUFDOzs7WUE1R0YsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxjQUFjO2dCQUN4QixnOENBQTZDO2dCQUU3QyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsU0FBUzs7YUFDM0M7Ozs7WUFoQmtCLFVBQVU7WUFBeUIsU0FBUztZQUl2RCxXQUFXO1lBSm1CLE1BQU07OzttQkFtQnpDLEtBQUssU0FBQyxNQUFNOzs7O0lBS2Isc0NBYUU7Ozs7O0lBQ0YscUNBQXNCOztJQUdwQixrQ0FBcUI7O0lBQ3JCLHdDQUEwQjs7SUFDMUIsMkNBQStCOztJQUMvQixzQ0FBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvbmVudCwgRWxlbWVudFJlZiwgSW5wdXQsIE5nWm9uZSwgT25Jbml0LCBSZW5kZXJlcjIsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7V2FycFZpZXdDb21wb25lbnR9IGZyb20gJy4uL3dhcnAtdmlldy1jb21wb25lbnQnO1xuaW1wb3J0IHtEYXRhTW9kZWx9IGZyb20gJy4uLy4uL21vZGVsL2RhdGFNb2RlbCc7XG5pbXBvcnQge1BhcmFtfSBmcm9tICcuLi8uLi9tb2RlbC9wYXJhbSc7XG5pbXBvcnQge1NpemVTZXJ2aWNlfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9yZXNpemUuc2VydmljZSc7XG5pbXBvcnQge0xvZ2dlcn0gZnJvbSAnLi4vLi4vdXRpbHMvbG9nZ2VyJztcbmltcG9ydCB7Q29sb3JMaWJ9IGZyb20gJy4uLy4uL3V0aWxzL2NvbG9yLWxpYic7XG5pbXBvcnQge0dUU0xpYn0gZnJvbSAnLi4vLi4vdXRpbHMvZ3RzLmxpYic7XG5pbXBvcnQge0dUU30gZnJvbSAnLi4vLi4vbW9kZWwvR1RTJztcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50LXRpbWV6b25lJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnd2FycHZpZXctYm94JyxcbiAgdGVtcGxhdGVVcmw6ICcuL3dhcnAtdmlldy1ib3guY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi93YXJwLXZpZXctYm94LmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLlNoYWRvd0RvbVxufSlcbmV4cG9ydCBjbGFzcyBXYXJwVmlld0JveENvbXBvbmVudCBleHRlbmRzIFdhcnBWaWV3Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICBASW5wdXQoJ3R5cGUnKSBzZXQgdHlwZSh0eXBlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl90eXBlID0gdHlwZTtcbiAgICB0aGlzLmRyYXdDaGFydCgpO1xuICB9XG5cbiAgbGF5b3V0OiBQYXJ0aWFsPGFueT4gPSB7XG4gICAgc2hvd2xlZ2VuZDogZmFsc2UsXG4gICAgeGF4aXM6IHtcbiAgICAgIHR5cGU6ICctJ1xuICAgIH0sXG4gICAgeWF4aXM6IHt6ZXJvbGluZTogZmFsc2V9LFxuICAgIGJveG1vZGU6ICdncm91cCcsXG4gICAgbWFyZ2luOiB7XG4gICAgICB0OiAxMCxcbiAgICAgIGI6IDI1LFxuICAgICAgcjogMTAsXG4gICAgICBsOiAxMFxuICAgIH1cbiAgfTtcbiAgcHJpdmF0ZSBfdHlwZSA9ICdib3gnO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBlbDogRWxlbWVudFJlZixcbiAgICBwdWJsaWMgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwdWJsaWMgc2l6ZVNlcnZpY2U6IFNpemVTZXJ2aWNlLFxuICAgIHB1YmxpYyBuZ1pvbmU6IE5nWm9uZVxuICApIHtcbiAgICBzdXBlcihlbCwgcmVuZGVyZXIsIHNpemVTZXJ2aWNlLCBuZ1pvbmUpO1xuICAgIHRoaXMuTE9HID0gbmV3IExvZ2dlcihXYXJwVmlld0JveENvbXBvbmVudCwgdGhpcy5fZGVidWcpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5kcmF3Q2hhcnQoKTtcbiAgfVxuXG4gIHVwZGF0ZShvcHRpb25zOiBQYXJhbSk6IHZvaWQge1xuICAgIHRoaXMuZHJhd0NoYXJ0KCk7XG4gIH1cblxuICBwcml2YXRlIGRyYXdDaGFydCgpIHtcbiAgICBpZiAoIXRoaXMuaW5pdENoYXJ0KHRoaXMuZWwpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucGxvdGx5Q29uZmlnLnNjcm9sbFpvb20gPSB0cnVlO1xuICAgIHRoaXMuYnVpbGRHcmFwaCgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGNvbnZlcnQoZGF0YTogRGF0YU1vZGVsKTogUGFydGlhbDxhbnk+W10ge1xuICAgIGNvbnN0IGRhdGFzZXQ6IFBhcnRpYWw8YW55PltdID0gW107XG4gICAgdGhpcy5MT0cuZGVidWcoWydjb252ZXJ0J10sIHRoaXMuX29wdGlvbnMsIHRoaXMuX3R5cGUpO1xuICAgIGxldCBndHNMaXN0ID0gR1RTTGliLmZsYXREZWVwKEdUU0xpYi5mbGF0dGVuR3RzSWRBcnJheShkYXRhLmRhdGEgYXMgYW55W10sIDApLnJlcyk7XG4gICAgZ3RzTGlzdCA9IGd0c0xpc3QuZmlsdGVyKGcgPT4ge1xuICAgICAgcmV0dXJuIChnLnYgJiYgR1RTTGliLmlzR3RzVG9QbG90KGcpKTtcbiAgICB9KTtcbiAgICBjb25zdCBwYXR0ZXJuID0gJ1lZWVkvTU0vREQgaGg6bW06c3MnO1xuICAgIGNvbnN0IGZvcm1hdCA9IHBhdHRlcm4uc2xpY2UoMCwgcGF0dGVybi5sYXN0SW5kZXhPZih0aGlzLl9vcHRpb25zLnNwbGl0IHx8ICdEJykgKyAxKTtcbiAgICBndHNMaXN0LmZvckVhY2goKGd0czogR1RTLCBpKSA9PiB7XG4gICAgICBpZiAoZ3RzLnYpIHtcbiAgICAgICAgY29uc3QgbGFiZWwgPSBHVFNMaWIuc2VyaWFsaXplR3RzTWV0YWRhdGEoZ3RzKTtcbiAgICAgICAgY29uc3QgYyA9IENvbG9yTGliLmdldENvbG9yKGd0cy5pZCwgdGhpcy5fb3B0aW9ucy5zY2hlbWUpO1xuICAgICAgICBjb25zdCBjb2xvciA9ICgoZGF0YS5wYXJhbXMgfHwgW10pW2ldIHx8IHtkYXRhc2V0Q29sb3I6IGN9KS5kYXRhc2V0Q29sb3IgfHwgYztcbiAgICAgICAgY29uc3Qgc2VyaWVzOiBQYXJ0aWFsPGFueT4gPSB7XG4gICAgICAgICAgdHlwZTogJ2JveCcsXG4gICAgICAgICAgYm94bWVhbjogJ3NkJyxcbiAgICAgICAgICBtYXJrZXI6IHtjb2xvcn0sXG4gICAgICAgICAgbmFtZTogbGFiZWwsXG4gICAgICAgICAgeDogdGhpcy5fdHlwZSA9PT0gJ2JveCcgPyB1bmRlZmluZWQgOiBbXSxcbiAgICAgICAgICB5OiBbXSxcbiAgICAgICAgICAvLyAgaG92ZXJpbmZvOiAnbm9uZScsXG4gICAgICAgICAgYm94cG9pbnRzOiBmYWxzZVxuICAgICAgICB9O1xuICAgICAgICBpZiAoISF0aGlzLl9vcHRpb25zLnNob3dEb3RzKSB7XG4gICAgICAgICAgc2VyaWVzLmJveHBvaW50cyA9ICdhbGwnO1xuICAgICAgICB9XG4gICAgICAgIGd0cy52LmZvckVhY2godmFsdWUgPT4ge1xuICAgICAgICAgIHNlcmllcy55LnB1c2godmFsdWVbdmFsdWUubGVuZ3RoIC0gMV0pO1xuICAgICAgICAgIGlmICh0aGlzLl90eXBlID09PSAnYm94LWRhdGUnKSB7XG4gICAgICAgICAgICBzZXJpZXMueC5wdXNoKG1vbWVudC50eihtb21lbnQudXRjKHZhbHVlWzBdIC8gdGhpcy5kaXZpZGVyKSwgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSkudG9JU09TdHJpbmcoKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZGF0YXNldC5wdXNoKHNlcmllcyk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5MT0cuZGVidWcoWydjb252ZXJ0JywgJ2RhdGFzZXQnXSwgZGF0YXNldCwgZm9ybWF0KTtcbiAgICByZXR1cm4gZGF0YXNldDtcbiAgfVxuXG4gIHByaXZhdGUgYnVpbGRHcmFwaCgpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RyYXdDaGFydCcsICd0aGlzLmxheW91dCddLCB0aGlzLnJlc3BvbnNpdmUpO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZHJhd0NoYXJ0JywgJ3RoaXMubGF5b3V0J10sIHRoaXMubGF5b3V0KTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RyYXdDaGFydCcsICd0aGlzLnBsb3RseUNvbmZpZyddLCB0aGlzLnBsb3RseUNvbmZpZyk7XG4gICAgdGhpcy5sYXlvdXQuc2hvd2xlZ2VuZCA9IHRoaXMuc2hvd0xlZ2VuZDtcbiAgICB0aGlzLmxheW91dC54YXhpcy5zaG93dGlja2xhYmVscyA9IHRoaXMuX3R5cGUgPT09ICdib3gtZGF0ZSc7XG4gICAgdGhpcy5sYXlvdXQueWF4aXMuY29sb3IgPSB0aGlzLmdldEdyaWRDb2xvcih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgIHRoaXMubGF5b3V0LnhheGlzLmNvbG9yID0gdGhpcy5nZXRHcmlkQ29sb3IodGhpcy5lbC5uYXRpdmVFbGVtZW50KTtcbiAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgfVxuXG4gIGhvdmVyKGRhdGE6IGFueSkge1xuXG4gIH1cbn1cbiJdfQ==