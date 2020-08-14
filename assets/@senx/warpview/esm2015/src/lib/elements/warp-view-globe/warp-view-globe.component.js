/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, ElementRef, Input, NgZone, Renderer2, ViewEncapsulation } from '@angular/core';
import { WarpViewComponent } from '../warp-view-component';
import { SizeService } from '../../services/resize.service';
import { Logger } from '../../utils/logger';
import { GTSLib } from '../../utils/gts.lib';
import { ColorLib } from '../../utils/color-lib';
import { MapLib } from '../../utils/map-lib';
export class WarpViewGlobeComponent extends WarpViewComponent {
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
        this._type = 'scattergeo';
        this.geoData = [];
        this.LOG = new Logger(WarpViewGlobeComponent, this._debug);
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
        this.geoData = [];
        this.LOG.debug(['convert'], data, this._options, this._type);
        GTSLib.flatDeep(GTSLib.flattenGtsIdArray((/** @type {?} */ (data.data)), 0).res)
            .filter((/**
         * @param {?} g
         * @return {?}
         */
        g => (g.v && GTSLib.isGts(g))))
            .forEach((/**
         * @param {?} gts
         * @param {?} i
         * @return {?}
         */
        (gts, i) => {
            if (gts.v) {
                /** @type {?} */
                const geoData = { path: [] };
                /** @type {?} */
                const label = GTSLib.serializeGtsMetadata(gts);
                /** @type {?} */
                const c = ColorLib.getColor(gts.id, this._options.scheme);
                /** @type {?} */
                const color = ((data.params || [])[i] || { datasetColor: c }).datasetColor || c;
                /** @type {?} */
                const series = {
                    mode: 'lines',
                    type: 'scattergeo',
                    marker: {
                        color: ColorLib.transparentize(color),
                        size: 3,
                        symbol: 'circle',
                        line: {
                            color,
                            width: 0
                        }
                    },
                    line: {
                        color,
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
                value => {
                    if (value.length > 2) {
                        series.lat.push(value[1]);
                        series.lon.push(value[2]);
                        geoData.path.push({ lat: value[1], lon: value[2] });
                    }
                }));
                this.geoData.push(geoData);
                dataset.push(series);
            }
        }));
        return dataset;
    }
    /**
     * @private
     * @return {?}
     */
    buildGraph() {
        this.LOG.debug(['drawChart', 'this.layout'], this._responsive);
        this.LOG.debug(['drawChart', 'this.layout'], this.layout);
        this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig);
        this.layout.showlegend = this._showLegend;
        /** @type {?} */
        const bounds = MapLib.getBoundsArray(this.geoData, [], [], []);
        this.LOG.debug(['drawChart', 'bounds'], bounds);
        this.layout.geo.lonaxis.color = this.getGridColor(this.el.nativeElement);
        this.layout.geo.lataxis.range = [bounds[0][0], bounds[1][0]];
        this.layout.geo.lonaxis.range = [bounds[0][1], bounds[1][1]];
        this.layout.geo.lataxis.color = this.getGridColor(this.el.nativeElement);
        this.layout = Object.assign({}, this.layout);
        this.loading = false;
    }
}
WarpViewGlobeComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-globe',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\" #chartContainer>\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-plotly #graph *ngIf=\"plotlyData?.length > 0\"\n                     [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot()\"\n                     className=\"chart\" (hover)=\"hover($event)\" (unhover)=\"unhover($event)\"\n                     [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                     [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n  <div #toolTip class=\"tooltip\" [ngStyle]=\"getTooltipPosition()\"></div>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}.tooltip{background-color:var(--warp-view-chart-legend-bg)!important;color:var(--warp-view-chart-legend-color)!important;text-align:left;position:absolute;display:none;padding:10px;border:1px solid grey;border-radius:5px;box-shadow:none;pointer-events:none;font-size:10px;min-width:100px;width:auto;max-width:50%;z-index:999;height:auto!important;left:-1000px}.tooltip .chip{border-radius:50%;background-color:#bbb;display:inline-block;width:5px;height:5px;border:2px solid #454545;margin-top:auto;margin-bottom:auto;vertical-align:middle;cursor:pointer}:host{display:block;height:100%}:host #chartContainer{height:100%}:host #chartContainer div{height:100%}:host div.chart{width:var(--warp-view-chart-width);height:var(--warp-view-chart-height)}"]
            }] }
];
/** @nocollapse */
WarpViewGlobeComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: SizeService },
    { type: NgZone }
];
WarpViewGlobeComponent.propDecorators = {
    type: [{ type: Input, args: ['type',] }]
};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LWdsb2JlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzZW54L3dhcnB2aWV3LyIsInNvdXJjZXMiOlsic3JjL2xpYi9lbGVtZW50cy93YXJwLXZpZXctZ2xvYmUvd2FycC12aWV3LWdsb2JlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBVSxTQUFTLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekcsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDekQsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBQzFELE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUcxQyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFFM0MsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9DLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQVEzQyxNQUFNLE9BQU8sc0JBQXVCLFNBQVEsaUJBQWlCOzs7Ozs7O0lBMEMzRCxZQUNTLEVBQWMsRUFDZCxRQUFtQixFQUNuQixXQUF3QixFQUN4QixNQUFjO1FBRXJCLEtBQUssQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUxsQyxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQ2QsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUNuQixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4QixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBdEN2QixXQUFNLEdBQWlCO1lBQ3JCLFVBQVUsRUFBRSxLQUFLO1lBQ2pCLE1BQU0sRUFBRTtnQkFDTixDQUFDLEVBQUUsRUFBRTtnQkFDTCxDQUFDLEVBQUUsRUFBRTtnQkFD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LE9BQU8sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDekUsSUFBSSxDQUFDLE1BQU0scUJBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0lBQ3ZCLENBQUM7OztZQXRJRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGdCQUFnQjtnQkFDMUIsZzhDQUErQztnQkFFL0MsYUFBYSxFQUFFLGlCQUFpQixDQUFDLFNBQVM7O2FBQzNDOzs7O1lBaEJrQixVQUFVO1lBQXlCLFNBQVM7WUFFdkQsV0FBVztZQUZtQixNQUFNOzs7bUJBb0J6QyxLQUFLLFNBQUMsTUFBTTs7OztJQUtiLHdDQThCRTs7Ozs7SUFDRix1Q0FBNkI7Ozs7O0lBQzdCLHlDQUFpRTs7SUFHL0Qsb0NBQXFCOztJQUNyQiwwQ0FBMEI7O0lBQzFCLDZDQUErQjs7SUFDL0Isd0NBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIEVsZW1lbnRSZWYsIElucHV0LCBOZ1pvbmUsIE9uSW5pdCwgUmVuZGVyZXIyLCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1dhcnBWaWV3Q29tcG9uZW50fSBmcm9tICcuLi93YXJwLXZpZXctY29tcG9uZW50JztcbmltcG9ydCB7U2l6ZVNlcnZpY2V9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3Jlc2l6ZS5zZXJ2aWNlJztcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICcuLi8uLi91dGlscy9sb2dnZXInO1xuaW1wb3J0IHtQYXJhbX0gZnJvbSAnLi4vLi4vbW9kZWwvcGFyYW0nO1xuaW1wb3J0IHtEYXRhTW9kZWx9IGZyb20gJy4uLy4uL21vZGVsL2RhdGFNb2RlbCc7XG5pbXBvcnQge0dUU0xpYn0gZnJvbSAnLi4vLi4vdXRpbHMvZ3RzLmxpYic7XG5pbXBvcnQge0dUU30gZnJvbSAnLi4vLi4vbW9kZWwvR1RTJztcbmltcG9ydCB7Q29sb3JMaWJ9IGZyb20gJy4uLy4uL3V0aWxzL2NvbG9yLWxpYic7XG5pbXBvcnQge01hcExpYn0gZnJvbSAnLi4vLi4vdXRpbHMvbWFwLWxpYic7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3dhcnB2aWV3LWdsb2JlJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3dhcnAtdmlldy1nbG9iZS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3dhcnAtdmlldy1nbG9iZS5jb21wb25lbnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5TaGFkb3dEb21cbn0pXG5leHBvcnQgY2xhc3MgV2FycFZpZXdHbG9iZUNvbXBvbmVudCBleHRlbmRzIFdhcnBWaWV3Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuXG4gIEBJbnB1dCgndHlwZScpIHNldCB0eXBlKHR5cGU6IHN0cmluZykge1xuICAgIHRoaXMuX3R5cGUgPSB0eXBlO1xuICAgIHRoaXMuZHJhd0NoYXJ0KCk7XG4gIH1cblxuICBsYXlvdXQ6IFBhcnRpYWw8YW55PiA9IHtcbiAgICBzaG93bGVnZW5kOiBmYWxzZSxcbiAgICBtYXJnaW46IHtcbiAgICAgIHQ6IDEwLFxuICAgICAgYjogMjUsXG4gICAgICByOiAxMCxcbiAgICAgIGw6IDEwXG4gICAgfSxcbiAgICBnZW86IHtcbiAgICAgIHByb2plY3Rpb246IHtcbiAgICAgICAgdHlwZTogJ29ydGhvZ3JhcGhpYycsXG4gICAgICB9LFxuICAgICAgc2hvd2ZyYW1lOiB0cnVlLFxuICAgICAgZml0Ym91bmRzOiAnbG9jYXRpb25zJyxcbiAgICAgIHNob3dvY2VhbjogdHJ1ZSxcbiAgICAgIG9jZWFuY29sb3I6IENvbG9yTGliLnRyYW5zcGFyZW50aXplKCcjMDA0ZWZmJywgMC4yKSxcbiAgICAgIHNob3dsYW5kOiB0cnVlLFxuICAgICAgbGFuZGNvbG9yOiBDb2xvckxpYi50cmFuc3BhcmVudGl6ZSgnIzZGNjk0RScsIDAuMiksXG4gICAgICBzaG93bGFrZXM6IHRydWUsXG4gICAgICBsYWtlY29sb3I6IENvbG9yTGliLnRyYW5zcGFyZW50aXplKCcjMDA0ZWZmJywgMC4yKSxcbiAgICAgIHNob3djb3VudHJpZXM6IHRydWUsXG4gICAgICBsb25heGlzOiB7XG4gICAgICAgIHNob3dncmlkOiB0cnVlLFxuICAgICAgICBncmlkY29sb3I6ICdyZ2IoMTAyLCAxMDIsIDEwMiknXG4gICAgICB9LFxuICAgICAgbGF0YXhpczoge1xuICAgICAgICBzaG93Z3JpZDogdHJ1ZSxcbiAgICAgICAgZ3JpZGNvbG9yOiAncmdiKDEwMiwgMTAyLCAxMDIpJ1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgcHJpdmF0ZSBfdHlwZSA9ICdzY2F0dGVyZ2VvJztcbiAgcHJpdmF0ZSBnZW9EYXRhOiB7IHBhdGg6IHsgbGF0OiBudW1iZXIsIGxvbjogbnVtYmVyIH1bXSB9W10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgZWw6IEVsZW1lbnRSZWYsXG4gICAgcHVibGljIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHVibGljIHNpemVTZXJ2aWNlOiBTaXplU2VydmljZSxcbiAgICBwdWJsaWMgbmdab25lOiBOZ1pvbmVcbiAgKSB7XG4gICAgc3VwZXIoZWwsIHJlbmRlcmVyLCBzaXplU2VydmljZSwgbmdab25lKTtcbiAgICB0aGlzLkxPRyA9IG5ldyBMb2dnZXIoV2FycFZpZXdHbG9iZUNvbXBvbmVudCwgdGhpcy5fZGVidWcpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5kcmF3Q2hhcnQoKTtcbiAgfVxuXG4gIHVwZGF0ZShvcHRpb25zOiBQYXJhbSk6IHZvaWQge1xuICAgIHRoaXMuZHJhd0NoYXJ0KCk7XG4gIH1cblxuICBwcml2YXRlIGRyYXdDaGFydCgpIHtcbiAgICBpZiAoIXRoaXMuaW5pdENoYXJ0KHRoaXMuZWwpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucGxvdGx5Q29uZmlnLnNjcm9sbFpvb20gPSB0cnVlO1xuICAgIHRoaXMuYnVpbGRHcmFwaCgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGNvbnZlcnQoZGF0YTogRGF0YU1vZGVsKTogUGFydGlhbDxhbnk+W10ge1xuICAgIGNvbnN0IGRhdGFzZXQ6IFBhcnRpYWw8YW55PltdID0gW107XG4gICAgdGhpcy5nZW9EYXRhID0gW107XG4gICAgdGhpcy5MT0cuZGVidWcoWydjb252ZXJ0J10sIGRhdGEsIHRoaXMuX29wdGlvbnMsIHRoaXMuX3R5cGUpO1xuICAgIEdUU0xpYi5mbGF0RGVlcChHVFNMaWIuZmxhdHRlbkd0c0lkQXJyYXkoZGF0YS5kYXRhIGFzIGFueVtdLCAwKS5yZXMpXG4gICAgICAuZmlsdGVyKGcgPT4gKGcudiAmJiBHVFNMaWIuaXNHdHMoZykpKVxuICAgICAgLmZvckVhY2goKGd0czogR1RTLCBpKSA9PiB7XG4gICAgICAgIGlmIChndHMudikge1xuICAgICAgICAgIGNvbnN0IGdlb0RhdGEgPSB7cGF0aDogW119O1xuICAgICAgICAgIGNvbnN0IGxhYmVsID0gR1RTTGliLnNlcmlhbGl6ZUd0c01ldGFkYXRhKGd0cyk7XG4gICAgICAgICAgY29uc3QgYyA9IENvbG9yTGliLmdldENvbG9yKGd0cy5pZCwgdGhpcy5fb3B0aW9ucy5zY2hlbWUpO1xuICAgICAgICAgIGNvbnN0IGNvbG9yID0gKChkYXRhLnBhcmFtcyB8fCBbXSlbaV0gfHwge2RhdGFzZXRDb2xvcjogY30pLmRhdGFzZXRDb2xvciB8fCBjO1xuICAgICAgICAgIGNvbnN0IHNlcmllczogUGFydGlhbDxhbnk+ID0ge1xuICAgICAgICAgICAgbW9kZTogJ2xpbmVzJyxcbiAgICAgICAgICAgIHR5cGU6ICdzY2F0dGVyZ2VvJyxcbiAgICAgICAgICAgIG1hcmtlcjoge1xuICAgICAgICAgICAgICBjb2xvcjogQ29sb3JMaWIudHJhbnNwYXJlbnRpemUoY29sb3IpLFxuICAgICAgICAgICAgICBzaXplOiAzLFxuICAgICAgICAgICAgICBzeW1ib2w6ICdjaXJjbGUnLFxuICAgICAgICAgICAgICBsaW5lOiB7XG4gICAgICAgICAgICAgICAgY29sb3IsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDBcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxpbmU6IHtcbiAgICAgICAgICAgICAgY29sb3IsXG4gICAgICAgICAgICAgIHdpZHRoOiAxXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbmFtZTogbGFiZWwsXG4gICAgICAgICAgICBsb246IFtdLFxuICAgICAgICAgICAgbGF0OiBbXSxcbiAgICAgICAgICAgIGhvdmVyaW5mbzogJ25vbmUnLFxuICAgICAgICAgIH07XG4gICAgICAgICAgZ3RzLnYuZm9yRWFjaCh2YWx1ZSA9PiB7XG4gICAgICAgICAgICBpZiAodmFsdWUubGVuZ3RoID4gMikge1xuICAgICAgICAgICAgICBzZXJpZXMubGF0LnB1c2godmFsdWVbMV0pO1xuICAgICAgICAgICAgICBzZXJpZXMubG9uLnB1c2godmFsdWVbMl0pO1xuICAgICAgICAgICAgICBnZW9EYXRhLnBhdGgucHVzaCh7bGF0OiB2YWx1ZVsxXSwgbG9uOiB2YWx1ZVsyXX0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMuZ2VvRGF0YS5wdXNoKGdlb0RhdGEpO1xuICAgICAgICAgIGRhdGFzZXQucHVzaChzZXJpZXMpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICByZXR1cm4gZGF0YXNldDtcbiAgfVxuXG4gIHByaXZhdGUgYnVpbGRHcmFwaCgpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RyYXdDaGFydCcsICd0aGlzLmxheW91dCddLCB0aGlzLl9yZXNwb25zaXZlKTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RyYXdDaGFydCcsICd0aGlzLmxheW91dCddLCB0aGlzLmxheW91dCk7XG4gICAgdGhpcy5MT0cuZGVidWcoWydkcmF3Q2hhcnQnLCAndGhpcy5wbG90bHlDb25maWcnXSwgdGhpcy5wbG90bHlDb25maWcpO1xuICAgIHRoaXMubGF5b3V0LnNob3dsZWdlbmQgPSB0aGlzLl9zaG93TGVnZW5kO1xuICAgIGNvbnN0IGJvdW5kcyA9IE1hcExpYi5nZXRCb3VuZHNBcnJheSh0aGlzLmdlb0RhdGEsIFtdLCBbXSwgW10pO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZHJhd0NoYXJ0JywgJ2JvdW5kcyddLCBib3VuZHMpO1xuICAgIHRoaXMubGF5b3V0Lmdlby5sb25heGlzLmNvbG9yID0gdGhpcy5nZXRHcmlkQ29sb3IodGhpcy5lbC5uYXRpdmVFbGVtZW50KTtcbiAgICB0aGlzLmxheW91dC5nZW8ubGF0YXhpcy5yYW5nZSA9IFtib3VuZHNbMF1bMF0sIGJvdW5kc1sxXVswXV07XG4gICAgdGhpcy5sYXlvdXQuZ2VvLmxvbmF4aXMucmFuZ2UgPSBbYm91bmRzWzBdWzFdLCBib3VuZHNbMV1bMV1dO1xuICAgIHRoaXMubGF5b3V0Lmdlby5sYXRheGlzLmNvbG9yID0gdGhpcy5nZXRHcmlkQ29sb3IodGhpcy5lbC5uYXRpdmVFbGVtZW50KTtcbiAgICB0aGlzLmxheW91dCA9IHsuLi50aGlzLmxheW91dH07XG4gICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gIH1cblxufVxuIl19