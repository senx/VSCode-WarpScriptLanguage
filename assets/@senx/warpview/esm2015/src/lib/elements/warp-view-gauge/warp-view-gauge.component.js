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
import { Component, ElementRef, Input, NgZone, Renderer2, ViewEncapsulation } from '@angular/core';
import { WarpViewComponent } from '../warp-view-component';
import { ColorLib } from '../../utils/color-lib';
import deepEqual from 'deep-equal';
import { SizeService } from '../../services/resize.service';
import { Logger } from '../../utils/logger';
import { ChartLib } from '../../utils/chart-lib';
export class WarpViewGaugeComponent extends WarpViewComponent {
    // gauge or bullet
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
        this.CHART_MARGIN = 0.05;
        // tslint:disable-next-line:variable-name
        this._type = 'gauge'; // gauge or bullet
        this.LOG = new Logger(WarpViewGaugeComponent, this._debug);
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
        this._options = this._options || this.defOptions;
    }
    /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    update(options, refresh) {
        this.LOG.debug(['onOptions', 'before'], this._options, options);
        if (!deepEqual(options, this._options)) {
            this.LOG.debug(['options', 'changed'], options);
            this._options = (/** @type {?} */ (ChartLib.mergeDeep(this._options, (/** @type {?} */ (options)))));
        }
        this.drawChart();
    }
    /**
     * @return {?}
     */
    drawChart() {
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
    }
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    convert(data) {
        this.LOG.debug(['convert'], data);
        /** @type {?} */
        const gtsList = (/** @type {?} */ (data.data));
        /** @type {?} */
        const dataList = [];
        /** @type {?} */
        let max = Number.MIN_VALUE;
        this.LOG.debug(['convert', 'gtsList'], gtsList);
        if (!gtsList || gtsList.length === 0 || gtsList[0].length < 2) {
            return;
        }
        gtsList.forEach((/**
         * @param {?} d
         * @return {?}
         */
        d => max = Math.max(max, d[1])));
        /** @type {?} */
        let x = 0;
        /** @type {?} */
        let y = -1 / (gtsList.length / 2);
        gtsList.forEach((/**
         * @param {?} gts
         * @param {?} i
         * @return {?}
         */
        (gts, i) => {
            if (i % 2 !== 0) {
                x = 0.5;
            }
            else {
                x = 0;
                y += 1 / (gtsList.length / 2);
            }
            /** @type {?} */
            const c = ColorLib.getColor(gts.id || i, this._options.scheme);
            /** @type {?} */
            const color = ((data.params || [])[i] || { datasetColor: c }).datasetColor || c;
            /** @type {?} */
            const domain = gtsList.length > 1 ? {
                x: [x + this.CHART_MARGIN, x + 0.5 - this.CHART_MARGIN],
                y: [y + this.CHART_MARGIN, y + 1 / (gtsList.length / 2) - this.CHART_MARGIN * 2]
            } : {
                x: [0, 1],
                y: [0, 1]
            };
            if (this._type === 'bullet' || (!!data.params && !!data.params[i].type && data.params[i].type === 'bullet')) {
                domain.x = [this.CHART_MARGIN, 1 - this.CHART_MARGIN];
                domain.y = [(i > 0 ? i / gtsList.length : 0) + this.CHART_MARGIN, (i + 1) / gtsList.length - this.CHART_MARGIN];
            }
            dataList.push({
                domain,
                align: 'left',
                value: gts[1],
                delta: {
                    reference: !!data.params && !!data.params[i].delta ? data.params[i].delta + gts[1] : 0,
                    font: { color: this.getLabelColor(this.el.nativeElement) }
                },
                title: {
                    text: gts[0],
                    align: 'center',
                    font: { color: this.getLabelColor(this.el.nativeElement) }
                },
                number: {
                    font: { color: this.getLabelColor(this.el.nativeElement) }
                },
                type: 'indicator',
                mode: !!data.params && !!data.params[i].delta ? 'number+delta+gauge' : 'gauge+number',
                gauge: {
                    bgcolor: 'transparent',
                    shape: !!data.params && !!data.params[i].type ? data.params[i].type : this._type || 'gauge',
                    bordercolor: this.getGridColor(this.el.nativeElement),
                    axis: {
                        range: [null, max],
                        tickcolor: this.getGridColor(this.el.nativeElement),
                        tickfont: { color: this.getGridColor(this.el.nativeElement) }
                    },
                    bar: {
                        color: ColorLib.transparentize(color),
                        line: {
                            width: 1,
                            color
                        }
                    }
                }
            });
            this.LOG.debug(['convert', 'dataList'], i);
        }));
        this.LOG.debug(['convert', 'dataList'], dataList);
        return dataList;
    }
}
WarpViewGaugeComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-gauge',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\">\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-plotly #graph *ngIf=\"plotlyData?.length > 0\"\n                     [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot()\"\n                     (relayout)=\"relayout($event)\"\n                     [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                     [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host{display:block;height:100%}:host #chartContainer{height:100%}:host #chartContainer div{height:100%}:host div.chart{width:var(--warp-view-chart-width,100%);height:var(--warp-view-chart-height,100%)}"]
            }] }
];
/** @nocollapse */
WarpViewGaugeComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: SizeService },
    { type: NgZone }
];
WarpViewGaugeComponent.propDecorators = {
    type: [{ type: Input, args: ['type',] }]
};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LWdhdWdlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzZW54L3dhcnB2aWV3LyIsInNvdXJjZXMiOlsic3JjL2xpYi9lbGVtZW50cy93YXJwLXZpZXctZ2F1Z2Uvd2FycC12aWV3LWdhdWdlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFVLFNBQVMsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN6RyxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUd6RCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDL0MsT0FBTyxTQUFTLE1BQU0sWUFBWSxDQUFDO0FBQ25DLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSwrQkFBK0IsQ0FBQztBQUMxRCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDMUMsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBUy9DLE1BQU0sT0FBTyxzQkFBdUIsU0FBUSxpQkFBaUI7Ozs7Ozs7O0lBVTNELFlBQ1MsRUFBYyxFQUNkLFFBQW1CLEVBQ25CLFdBQXdCLEVBQ3hCLE1BQWM7UUFFckIsS0FBSyxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBTGxDLE9BQUUsR0FBRixFQUFFLENBQVk7UUFDZCxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ25CLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLFdBQU0sR0FBTixNQUFNLENBQVE7UUFSZixpQkFBWSxHQUFHLElBQUksQ0FBQzs7UUFFcEIsVUFBSyxHQUFHLE9BQU8sQ0FBQyxDQUFDLGtCQUFrQjtRQVN6QyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUks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QUUsVUFBVSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDbEQsT0FBTyxRQUFRLENBQUM7SUFDbEIsQ0FBQzs7O1lBMUlGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsZ0JBQWdCO2dCQUMxQix1ekNBQStDO2dCQUUvQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsU0FBUzs7YUFDM0M7Ozs7WUFoQmtCLFVBQVU7WUFBeUIsU0FBUztZQU12RCxXQUFXO1lBTm1CLE1BQU07OzttQkFrQnpDLEtBQUssU0FBQyxNQUFNOzs7Ozs7O0lBS2IsOENBQTRCOzs7OztJQUU1Qix1Q0FBd0I7O0lBR3RCLG9DQUFxQjs7SUFDckIsMENBQTBCOztJQUMxQiw2Q0FBK0I7O0lBQy9CLHdDQUFxQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQ29weXJpZ2h0IDIwMjAgIFNlblggUy5BLlMuXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnQsIEVsZW1lbnRSZWYsIElucHV0LCBOZ1pvbmUsIE9uSW5pdCwgUmVuZGVyZXIyLCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1dhcnBWaWV3Q29tcG9uZW50fSBmcm9tICcuLi93YXJwLXZpZXctY29tcG9uZW50JztcbmltcG9ydCB7RGF0YU1vZGVsfSBmcm9tICcuLi8uLi9tb2RlbC9kYXRhTW9kZWwnO1xuaW1wb3J0IGdhdWdlIGZyb20gJ2NhbnZhcy1nYXVnZXMnO1xuaW1wb3J0IHtDb2xvckxpYn0gZnJvbSAnLi4vLi4vdXRpbHMvY29sb3ItbGliJztcbmltcG9ydCBkZWVwRXF1YWwgZnJvbSAnZGVlcC1lcXVhbCc7XG5pbXBvcnQge1NpemVTZXJ2aWNlfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9yZXNpemUuc2VydmljZSc7XG5pbXBvcnQge0xvZ2dlcn0gZnJvbSAnLi4vLi4vdXRpbHMvbG9nZ2VyJztcbmltcG9ydCB7Q2hhcnRMaWJ9IGZyb20gJy4uLy4uL3V0aWxzL2NoYXJ0LWxpYic7XG5pbXBvcnQge1BhcmFtfSBmcm9tICcuLi8uLi9tb2RlbC9wYXJhbSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3dhcnB2aWV3LWdhdWdlJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3dhcnAtdmlldy1nYXVnZS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3dhcnAtdmlldy1nYXVnZS5jb21wb25lbnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5TaGFkb3dEb21cbn0pXG5leHBvcnQgY2xhc3MgV2FycFZpZXdHYXVnZUNvbXBvbmVudCBleHRlbmRzIFdhcnBWaWV3Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgQElucHV0KCd0eXBlJykgc2V0IHR5cGUodHlwZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdHlwZSA9IHR5cGU7XG4gICAgdGhpcy5kcmF3Q2hhcnQoKTtcbiAgfVxuXG4gIHByaXZhdGUgQ0hBUlRfTUFSR0lOID0gMC4wNTtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWVcbiAgcHJpdmF0ZSBfdHlwZSA9ICdnYXVnZSc7IC8vIGdhdWdlIG9yIGJ1bGxldFxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBlbDogRWxlbWVudFJlZixcbiAgICBwdWJsaWMgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwdWJsaWMgc2l6ZVNlcnZpY2U6IFNpemVTZXJ2aWNlLFxuICAgIHB1YmxpYyBuZ1pvbmU6IE5nWm9uZVxuICApIHtcbiAgICBzdXBlcihlbCwgcmVuZGVyZXIsIHNpemVTZXJ2aWNlLCBuZ1pvbmUpO1xuICAgIHRoaXMuTE9HID0gbmV3IExvZ2dlcihXYXJwVmlld0dhdWdlQ29tcG9uZW50LCB0aGlzLl9kZWJ1Zyk7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLl9vcHRpb25zID0gdGhpcy5fb3B0aW9ucyB8fCB0aGlzLmRlZk9wdGlvbnM7XG4gIH1cblxuICB1cGRhdGUob3B0aW9ucywgcmVmcmVzaCk6IHZvaWQge1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnb25PcHRpb25zJywgJ2JlZm9yZSddLCB0aGlzLl9vcHRpb25zLCBvcHRpb25zKTtcbiAgICBpZiAoIWRlZXBFcXVhbChvcHRpb25zLCB0aGlzLl9vcHRpb25zKSkge1xuICAgICAgdGhpcy5MT0cuZGVidWcoWydvcHRpb25zJywgJ2NoYW5nZWQnXSwgb3B0aW9ucyk7XG4gICAgICB0aGlzLl9vcHRpb25zID0gQ2hhcnRMaWIubWVyZ2VEZWVwKHRoaXMuX29wdGlvbnMsIG9wdGlvbnMgYXMgUGFyYW0pIGFzIFBhcmFtO1xuICAgIH1cbiAgICB0aGlzLmRyYXdDaGFydCgpO1xuICB9XG5cbiAgZHJhd0NoYXJ0KCkge1xuICAgIGlmICghdGhpcy5pbml0Q2hhcnQodGhpcy5lbCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5MT0cuZGVidWcoWydkcmF3Q2hhcnQnLCAncGxvdGx5RGF0YSddLCB0aGlzLnBsb3RseURhdGEsIHRoaXMuX3R5cGUpO1xuICAgIHRoaXMubGF5b3V0LmF1dG9zaXplID0gdHJ1ZTtcbiAgICB0aGlzLmxheW91dC5ncmlkID0ge1xuICAgICAgcm93czogTWF0aC5jZWlsKHRoaXMucGxvdGx5RGF0YS5sZW5ndGggLyAyKSxcbiAgICAgIGNvbHVtbnM6IDIsXG4gICAgICBwYXR0ZXJuOiAnaW5kZXBlbmRlbnQnLFxuICAgICAgeGdhcDogMC4yLFxuICAgICAgeWdhcDogMC4yXG4gICAgfTtcbiAgICB0aGlzLmxheW91dC5tYXJnaW4gPSB7dDogMjUsIHI6IDI1LCBsOiAyNSwgYjogMjV9O1xuICAgIGlmICh0aGlzLl90eXBlID09PSAnYnVsbGV0Jykge1xuICAgICAgdGhpcy5sYXlvdXQuaGVpZ2h0ID0gdGhpcy5wbG90bHlEYXRhLmxlbmd0aCAqIDEwMDtcbiAgICAgICh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTERpdkVsZW1lbnQpLnN0eWxlLmhlaWdodCA9IHRoaXMubGF5b3V0LmhlaWdodCArICdweCc7XG4gICAgICB0aGlzLmxheW91dC5tYXJnaW4ubCA9IDMwMDtcbiAgICAgIHRoaXMubGF5b3V0LnlheGlzID0ge1xuICAgICAgICBhdXRvbWFyZ2luOiB0cnVlXG4gICAgICB9O1xuICAgICAgdGhpcy5sYXlvdXQuZ3JpZCA9IHtyb3dzOiB0aGlzLnBsb3RseURhdGEubGVuZ3RoLCBjb2x1bW5zOiAxLCBwYXR0ZXJuOiAnaW5kZXBlbmRlbnQnfTtcbiAgICB9XG4gICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gIH1cblxuICBwcm90ZWN0ZWQgY29udmVydChkYXRhOiBEYXRhTW9kZWwpOiBhbnlbXSB7XG4gICAgdGhpcy5MT0cuZGVidWcoWydjb252ZXJ0J10sIGRhdGEpO1xuICAgIGNvbnN0IGd0c0xpc3QgPSBkYXRhLmRhdGEgYXMgYW55W107XG4gICAgY29uc3QgZGF0YUxpc3QgPSBbXTtcbiAgICBsZXQgbWF4ID0gTnVtYmVyLk1JTl9WQUxVRTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2NvbnZlcnQnLCAnZ3RzTGlzdCddLCBndHNMaXN0KTtcbiAgICBpZiAoIWd0c0xpc3QgfHwgZ3RzTGlzdC5sZW5ndGggPT09IDAgfHwgZ3RzTGlzdFswXS5sZW5ndGggPCAyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGd0c0xpc3QuZm9yRWFjaChkID0+IG1heCA9IE1hdGgubWF4KG1heCwgZFsxXSkpO1xuICAgIGxldCB4ID0gMDtcbiAgICBsZXQgeSA9IC0xIC8gKGd0c0xpc3QubGVuZ3RoIC8gMik7XG4gICAgZ3RzTGlzdC5mb3JFYWNoKChndHMsIGkpID0+IHtcbiAgICAgIGlmIChpICUgMiAhPT0gMCkge1xuICAgICAgICB4ID0gMC41O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgeCA9IDA7XG4gICAgICAgIHkgKz0gMSAvIChndHNMaXN0Lmxlbmd0aCAvIDIpO1xuICAgICAgfVxuICAgICAgY29uc3QgYyA9IENvbG9yTGliLmdldENvbG9yKGd0cy5pZCB8fCBpLCB0aGlzLl9vcHRpb25zLnNjaGVtZSk7XG4gICAgICBjb25zdCBjb2xvciA9ICgoZGF0YS5wYXJhbXMgfHwgW10pW2ldIHx8IHtkYXRhc2V0Q29sb3I6IGN9KS5kYXRhc2V0Q29sb3IgfHwgYztcbiAgICAgIGNvbnN0IGRvbWFpbiA9IGd0c0xpc3QubGVuZ3RoID4gMSA/IHtcbiAgICAgICAgeDogW3ggKyB0aGlzLkNIQVJUX01BUkdJTiwgeCArIDAuNSAtIHRoaXMuQ0hBUlRfTUFSR0lOXSxcbiAgICAgICAgeTogW3kgKyB0aGlzLkNIQVJUX01BUkdJTiwgeSArIDEgLyAoZ3RzTGlzdC5sZW5ndGggLyAyKSAtIHRoaXMuQ0hBUlRfTUFSR0lOICogMl1cbiAgICAgIH0gOiB7XG4gICAgICAgIHg6IFswLCAxXSxcbiAgICAgICAgeTogWzAsIDFdXG4gICAgICB9O1xuICAgICAgaWYgKHRoaXMuX3R5cGUgPT09ICdidWxsZXQnIHx8ICghIWRhdGEucGFyYW1zICYmICEhZGF0YS5wYXJhbXNbaV0udHlwZSAmJiBkYXRhLnBhcmFtc1tpXS50eXBlID09PSAnYnVsbGV0JykpIHtcbiAgICAgICAgZG9tYWluLnggPSBbdGhpcy5DSEFSVF9NQVJHSU4sIDEgLSB0aGlzLkNIQVJUX01BUkdJTl07XG4gICAgICAgIGRvbWFpbi55ID0gWyhpID4gMCA/IGkgLyBndHNMaXN0Lmxlbmd0aCA6IDApICsgdGhpcy5DSEFSVF9NQVJHSU4sIChpICsgMSkgLyBndHNMaXN0Lmxlbmd0aCAtIHRoaXMuQ0hBUlRfTUFSR0lOXTtcbiAgICAgIH1cbiAgICAgIGRhdGFMaXN0LnB1c2goXG4gICAgICAgIHtcbiAgICAgICAgICBkb21haW4sXG4gICAgICAgICAgYWxpZ246ICdsZWZ0JyxcbiAgICAgICAgICB2YWx1ZTogZ3RzWzFdLFxuICAgICAgICAgIGRlbHRhOiB7XG4gICAgICAgICAgICByZWZlcmVuY2U6ICEhZGF0YS5wYXJhbXMgJiYgISFkYXRhLnBhcmFtc1tpXS5kZWx0YSA/IGRhdGEucGFyYW1zW2ldLmRlbHRhICsgZ3RzWzFdIDogMCxcbiAgICAgICAgICAgIGZvbnQ6IHtjb2xvcjogdGhpcy5nZXRMYWJlbENvbG9yKHRoaXMuZWwubmF0aXZlRWxlbWVudCl9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgdGV4dDogZ3RzWzBdLFxuICAgICAgICAgICAgYWxpZ246ICdjZW50ZXInLFxuICAgICAgICAgICAgZm9udDoge2NvbG9yOiB0aGlzLmdldExhYmVsQ29sb3IodGhpcy5lbC5uYXRpdmVFbGVtZW50KX1cbiAgICAgICAgICB9LFxuICAgICAgICAgIG51bWJlcjoge1xuICAgICAgICAgICAgZm9udDoge2NvbG9yOiB0aGlzLmdldExhYmVsQ29sb3IodGhpcy5lbC5uYXRpdmVFbGVtZW50KX1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHR5cGU6ICdpbmRpY2F0b3InLFxuICAgICAgICAgIG1vZGU6ICEhZGF0YS5wYXJhbXMgJiYgISFkYXRhLnBhcmFtc1tpXS5kZWx0YSA/ICdudW1iZXIrZGVsdGErZ2F1Z2UnIDogJ2dhdWdlK251bWJlcicsXG4gICAgICAgICAgZ2F1Z2U6IHtcbiAgICAgICAgICAgIGJnY29sb3I6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICBzaGFwZTogISFkYXRhLnBhcmFtcyAmJiAhIWRhdGEucGFyYW1zW2ldLnR5cGUgPyBkYXRhLnBhcmFtc1tpXS50eXBlIDogdGhpcy5fdHlwZSB8fCAnZ2F1Z2UnLFxuICAgICAgICAgICAgYm9yZGVyY29sb3I6IHRoaXMuZ2V0R3JpZENvbG9yKHRoaXMuZWwubmF0aXZlRWxlbWVudCksXG4gICAgICAgICAgICBheGlzOiB7XG4gICAgICAgICAgICAgIHJhbmdlOiBbbnVsbCwgbWF4XSxcbiAgICAgICAgICAgICAgdGlja2NvbG9yOiB0aGlzLmdldEdyaWRDb2xvcih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpLFxuICAgICAgICAgICAgICB0aWNrZm9udDoge2NvbG9yOiB0aGlzLmdldEdyaWRDb2xvcih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJhcjoge1xuICAgICAgICAgICAgICBjb2xvcjogQ29sb3JMaWIudHJhbnNwYXJlbnRpemUoY29sb3IpLFxuICAgICAgICAgICAgICBsaW5lOiB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgICAgICAgICAgY29sb3JcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2NvbnZlcnQnLCAnZGF0YUxpc3QnXSwgaSk7XG4gICAgfSk7XG4gICAgdGhpcy5MT0cuZGVidWcoWydjb252ZXJ0JywgJ2RhdGFMaXN0J10sIGRhdGFMaXN0KTtcbiAgICByZXR1cm4gZGF0YUxpc3Q7XG4gIH1cbn1cbiJdfQ==