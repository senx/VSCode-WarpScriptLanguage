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
import { GTSLib } from '../../utils/gts.lib';
import moment from 'moment-timezone';
import { SizeService } from '../../services/resize.service';
import { Logger } from '../../utils/logger';
export class WarpViewSpectrumComponent extends WarpViewComponent {
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
            yaxis: {},
            margin: {
                t: 10,
                b: 25,
                r: 10,
                l: 50
            }
        };
        this._type = 'histogram2d';
        this.visibility = [];
        this.visibilityStatus = 'unknown';
        this.maxTick = 0;
        this.minTick = 0;
        this.visibleGtsId = [];
        this.LOG = new Logger(WarpViewSpectrumComponent, this._debug);
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
        const type = this._options.histo || { histnorm: 'density', histfunc: 'count' };
        /** @type {?} */
        const dataset = [];
        this.LOG.debug(['convert'], this._options);
        this.visibility = [];
        /** @type {?} */
        let gtsList = GTSLib.flatDeep(GTSLib.flattenGtsIdArray((/** @type {?} */ ([data.data])), 0).res) || [];
        this.maxTick = Number.NEGATIVE_INFINITY;
        this.minTick = Number.POSITIVE_INFINITY;
        this.visibleGtsId = [];
        /** @type {?} */
        const nonPlottable = gtsList.filter((/**
         * @param {?} g
         * @return {?}
         */
        g => {
            this.LOG.debug(['convert'], GTSLib.isGtsToPlot(g));
            return (g.v && !GTSLib.isGtsToPlot(g));
        }));
        gtsList = gtsList.filter((/**
         * @param {?} g
         * @return {?}
         */
        g => {
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
        (gts, i) => {
            if (gts.v && GTSLib.isGtsToPlot(gts)) {
                /** @type {?} */
                const label = GTSLib.serializeGtsMetadata(gts);
                /** @type {?} */
                const c = ColorLib.getColor(i, this._options.scheme);
                /** @type {?} */
                const color = ((data.params || [])[gts.id] || { datasetColor: c }).datasetColor || c;
                /** @type {?} */
                const series = {
                    type: this._type,
                    histnorm: type.histnorm || 'density',
                    histfunc: type.histfunc || 'count',
                    contours: {
                        showlabels: true,
                        labelfont: {
                            color: 'white'
                        }
                    },
                    colorbar: {
                        tickcolor: this.getGridColor(this.el.nativeElement),
                        thickness: 0,
                        tickfont: {
                            color: this.getLabelColor(this.el.nativeElement)
                        },
                        x: 1 + gts.id / 20,
                        xpad: 0
                    },
                    showscale: this.showLegend,
                    colorscale: ColorLib.getColorGradient(gts.id, this._options.scheme),
                    autocolorscale: false,
                    name: label,
                    text: label,
                    x: [],
                    y: [],
                    line: { color },
                    hoverinfo: 'none',
                    connectgaps: false,
                    visible: this._hiddenData.filter((/**
                     * @param {?} h
                     * @return {?}
                     */
                    h => h === gts.id)).length >= 0,
                };
                gts.v.forEach((/**
                 * @param {?} value
                 * @return {?}
                 */
                value => {
                    /** @type {?} */
                    const ts = value[0];
                    series.y.push(value[value.length - 1]);
                    if (this._options.timeMode && this._options.timeMode === 'timestamp') {
                        series.x.push(ts);
                    }
                    else {
                        series.x.push(moment.tz(moment.utc(ts / this.divider), this._options.timeZone).toISOString());
                    }
                }));
                dataset.push(series);
            }
        }));
        this.LOG.debug(['convert', 'dataset'], dataset);
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
        this.layout.yaxis.color = this.getGridColor(this.el.nativeElement);
        this.layout.xaxis.color = this.getGridColor(this.el.nativeElement);
        this.loading = false;
    }
}
WarpViewSpectrumComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-spectrum',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\" #chartContainer>\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-plotly #graph\n                     [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot()\"\n                     (relayout)=\"relayout($event)\" (hover)=\"hover($event)\" (unhover)=\"unhover($event)\"\n                     [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                     [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n  <div #toolTip class=\"tooltip\" [ngStyle]=\"getTooltipPosition()\"></div>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}.tooltip{background-color:var(--warp-view-chart-legend-bg)!important;color:var(--warp-view-chart-legend-color)!important;text-align:left;position:absolute;display:none;padding:10px;border:1px solid grey;border-radius:5px;box-shadow:none;pointer-events:none;font-size:10px;min-width:100px;width:auto;max-width:50%;z-index:999;height:auto!important;left:-1000px}.tooltip .chip{border-radius:50%;background-color:#bbb;display:inline-block;width:5px;height:5px;border:2px solid #454545;margin-top:auto;margin-bottom:auto;vertical-align:middle;cursor:pointer}:host{display:block;height:100%}:host #chartContainer{height:100%}:host #chartContainer div{height:100%}:host div.chart{width:var(--warp-view-chart-width);height:var(--warp-view-chart-height)}:host .executionErrorText{color:red;padding:10px;border-radius:3px;background:#faebd7;position:absolute;top:-30px;border:2px solid red}"]
            }] }
];
/** @nocollapse */
WarpViewSpectrumComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: SizeService },
    { type: NgZone }
];
WarpViewSpectrumComponent.propDecorators = {
    type: [{ type: Input, args: ['type',] }]
};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LXNwZWN0cnVtLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzZW54L3dhcnB2aWV3LyIsInNvdXJjZXMiOlsic3JjL2xpYi9lbGVtZW50cy93YXJwLXZpZXctc3BlY3RydW0vd2FycC12aWV3LXNwZWN0cnVtLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNqRyxPQUFPLEVBQWtCLGlCQUFpQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFHMUUsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9DLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUUzQyxPQUFPLE1BQU0sTUFBTSxpQkFBaUIsQ0FBQztBQUNyQyxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sK0JBQStCLENBQUM7QUFDMUQsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBUTFDLE1BQU0sT0FBTyx5QkFBMEIsU0FBUSxpQkFBaUI7Ozs7Ozs7SUF5QjlELFlBQ1MsRUFBYyxFQUNkLFFBQW1CLEVBQ25CLFdBQXdCLEVBQ3hCLE1BQWM7UUFFckIsS0FBSyxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBTGxDLE9BQUUsR0FBRixFQUFFLENBQVk7UUFDZCxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ25CLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLFdBQU0sR0FBTixNQUFNLENBQVE7UUF0QnZCLFdBQU0sR0FBaUI7WUFDckIsVUFBVSxFQUFFLEtBQUs7WUFDakIsS0FBSyxFQUFFLEVBQUU7WUFDVCxLQUFLLEVBQUUsRUFBRTtZQUNU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QUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDbkUsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7SUFDdkIsQ0FBQzs7O1lBNUlGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsbUJBQW1CO2dCQUM3QiwyNkNBQWtEO2dCQUVsRCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsU0FBUzs7YUFDM0M7Ozs7WUFoQmtCLFVBQVU7WUFBaUIsU0FBUztZQVEvQyxXQUFXO1lBUm1CLE1BQU07OzttQkFtQnpDLEtBQUssU0FBQyxNQUFNOzs7O0lBS2IsMkNBVUU7Ozs7O0lBQ0YsMENBQThCOzs7OztJQUM5QiwrQ0FBbUM7Ozs7O0lBQ25DLHFEQUFzRDs7Ozs7SUFDdEQsNENBQW9COzs7OztJQUNwQiw0Q0FBb0I7Ozs7O0lBQ3BCLGlEQUEwQjs7SUFHeEIsdUNBQXFCOztJQUNyQiw2Q0FBMEI7O0lBQzFCLGdEQUErQjs7SUFDL0IsMkNBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqICBDb3B5cmlnaHQgMjAyMCAgU2VuWCBTLkEuUy5cbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudCwgRWxlbWVudFJlZiwgSW5wdXQsIE5nWm9uZSwgUmVuZGVyZXIyLCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1Zpc2liaWxpdHlTdGF0ZSwgV2FycFZpZXdDb21wb25lbnR9IGZyb20gJy4uL3dhcnAtdmlldy1jb21wb25lbnQnO1xuaW1wb3J0IHtEYXRhTW9kZWx9IGZyb20gJy4uLy4uL21vZGVsL2RhdGFNb2RlbCc7XG5pbXBvcnQge1BhcmFtfSBmcm9tICcuLi8uLi9tb2RlbC9wYXJhbSc7XG5pbXBvcnQge0NvbG9yTGlifSBmcm9tICcuLi8uLi91dGlscy9jb2xvci1saWInO1xuaW1wb3J0IHtHVFNMaWJ9IGZyb20gJy4uLy4uL3V0aWxzL2d0cy5saWInO1xuaW1wb3J0IHtHVFN9IGZyb20gJy4uLy4uL21vZGVsL0dUUyc7XG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudC10aW1lem9uZSc7XG5pbXBvcnQge1NpemVTZXJ2aWNlfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9yZXNpemUuc2VydmljZSc7XG5pbXBvcnQge0xvZ2dlcn0gZnJvbSAnLi4vLi4vdXRpbHMvbG9nZ2VyJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnd2FycHZpZXctc3BlY3RydW0nLFxuICB0ZW1wbGF0ZVVybDogJy4vd2FycC12aWV3LXNwZWN0cnVtLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vd2FycC12aWV3LXNwZWN0cnVtLmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLlNoYWRvd0RvbVxufSlcbmV4cG9ydCBjbGFzcyBXYXJwVmlld1NwZWN0cnVtQ29tcG9uZW50IGV4dGVuZHMgV2FycFZpZXdDb21wb25lbnQge1xuXG4gIEBJbnB1dCgndHlwZScpIHNldCB0eXBlKHR5cGU6IHN0cmluZykge1xuICAgIHRoaXMuX3R5cGUgPSB0eXBlO1xuICAgIHRoaXMuZHJhd0NoYXJ0KCk7XG4gIH1cblxuICBsYXlvdXQ6IFBhcnRpYWw8YW55PiA9IHtcbiAgICBzaG93bGVnZW5kOiBmYWxzZSxcbiAgICB4YXhpczoge30sXG4gICAgeWF4aXM6IHt9LFxuICAgIG1hcmdpbjoge1xuICAgICAgdDogMTAsXG4gICAgICBiOiAyNSxcbiAgICAgIHI6IDEwLFxuICAgICAgbDogNTBcbiAgICB9XG4gIH07XG4gIHByaXZhdGUgX3R5cGUgPSAnaGlzdG9ncmFtMmQnO1xuICBwcml2YXRlIHZpc2liaWxpdHk6IGJvb2xlYW5bXSA9IFtdO1xuICBwcml2YXRlIHZpc2liaWxpdHlTdGF0dXM6IFZpc2liaWxpdHlTdGF0ZSA9ICd1bmtub3duJztcbiAgcHJpdmF0ZSBtYXhUaWNrID0gMDtcbiAgcHJpdmF0ZSBtaW5UaWNrID0gMDtcbiAgcHJpdmF0ZSB2aXNpYmxlR3RzSWQgPSBbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgZWw6IEVsZW1lbnRSZWYsXG4gICAgcHVibGljIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHVibGljIHNpemVTZXJ2aWNlOiBTaXplU2VydmljZSxcbiAgICBwdWJsaWMgbmdab25lOiBOZ1pvbmVcbiAgKSB7XG4gICAgc3VwZXIoZWwsIHJlbmRlcmVyLCBzaXplU2VydmljZSwgbmdab25lKTtcbiAgICB0aGlzLkxPRyA9IG5ldyBMb2dnZXIoV2FycFZpZXdTcGVjdHJ1bUNvbXBvbmVudCwgdGhpcy5fZGVidWcpO1xuICB9XG5cbiAgdXBkYXRlKG9wdGlvbnM6IFBhcmFtKTogdm9pZCB7XG4gICAgdGhpcy5kcmF3Q2hhcnQoKTtcbiAgfVxuXG4gIHByaXZhdGUgZHJhd0NoYXJ0KCkge1xuICAgIGlmICghdGhpcy5pbml0Q2hhcnQodGhpcy5lbCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5wbG90bHlDb25maWcuc2Nyb2xsWm9vbSA9IHRydWU7XG4gICAgdGhpcy5idWlsZEdyYXBoKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgY29udmVydChkYXRhOiBEYXRhTW9kZWwpOiBQYXJ0aWFsPGFueT5bXSB7XG4gICAgY29uc3QgdHlwZSA9IHRoaXMuX29wdGlvbnMuaGlzdG8gfHwge2hpc3Rub3JtOiAnZGVuc2l0eScsIGhpc3RmdW5jOiAnY291bnQnfTtcbiAgICBjb25zdCBkYXRhc2V0OiBQYXJ0aWFsPGFueT5bXSA9IFtdO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnY29udmVydCddLCB0aGlzLl9vcHRpb25zKTtcbiAgICB0aGlzLnZpc2liaWxpdHkgPSBbXTtcbiAgICBsZXQgZ3RzTGlzdCA9IEdUU0xpYi5mbGF0RGVlcChHVFNMaWIuZmxhdHRlbkd0c0lkQXJyYXkoWyBkYXRhLmRhdGFdIGFzIGFueVtdLCAwKS5yZXMpIHx8IFtdO1xuICAgIHRoaXMubWF4VGljayA9IE51bWJlci5ORUdBVElWRV9JTkZJTklUWTtcbiAgICB0aGlzLm1pblRpY2sgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFk7XG4gICAgdGhpcy52aXNpYmxlR3RzSWQgPSBbXTtcbiAgICBjb25zdCBub25QbG90dGFibGUgPSBndHNMaXN0LmZpbHRlcihnID0+IHtcbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsnY29udmVydCddLCBHVFNMaWIuaXNHdHNUb1Bsb3QoZykpO1xuICAgICAgcmV0dXJuIChnLnYgJiYgIUdUU0xpYi5pc0d0c1RvUGxvdChnKSk7XG4gICAgfSk7XG4gICAgZ3RzTGlzdCA9IGd0c0xpc3QuZmlsdGVyKGcgPT4ge1xuICAgICAgcmV0dXJuIChnLnYgJiYgR1RTTGliLmlzR3RzVG9QbG90KGcpKTtcbiAgICB9KTtcbiAgICAvLyBpbml0aWFsaXplIHZpc2liaWxpdHkgc3RhdHVzXG4gICAgaWYgKHRoaXMudmlzaWJpbGl0eVN0YXR1cyA9PT0gJ3Vua25vd24nKSB7XG4gICAgICB0aGlzLnZpc2liaWxpdHlTdGF0dXMgPSBndHNMaXN0Lmxlbmd0aCA+IDAgPyAncGxvdHRhYmxlU2hvd24nIDogJ25vdGhpbmdQbG90dGFibGUnO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9vcHRpb25zLnRpbWVNb2RlICYmIHRoaXMuX29wdGlvbnMudGltZU1vZGUgPT09ICd0aW1lc3RhbXAnKSB7XG4gICAgICB0aGlzLmxheW91dC54YXhpcy50eXBlID0gJ2xpbmVhcic7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubGF5b3V0LnhheGlzLnR5cGUgPSAnZGF0ZSc7XG4gICAgfVxuICAgIGd0c0xpc3QuZm9yRWFjaCgoZ3RzOiBHVFMsIGkpID0+IHtcbiAgICAgIGlmIChndHMudiAmJiBHVFNMaWIuaXNHdHNUb1Bsb3QoZ3RzKSkge1xuICAgICAgICBjb25zdCBsYWJlbCA9IEdUU0xpYi5zZXJpYWxpemVHdHNNZXRhZGF0YShndHMpO1xuICAgICAgICBjb25zdCBjID0gQ29sb3JMaWIuZ2V0Q29sb3IoaSwgdGhpcy5fb3B0aW9ucy5zY2hlbWUpO1xuICAgICAgICBjb25zdCBjb2xvciA9ICgoZGF0YS5wYXJhbXMgfHwgW10pW2d0cy5pZF0gfHwge2RhdGFzZXRDb2xvcjogY30pLmRhdGFzZXRDb2xvciB8fCBjO1xuICAgICAgICBjb25zdCBzZXJpZXM6IFBhcnRpYWw8YW55PiA9IHtcbiAgICAgICAgICB0eXBlOiB0aGlzLl90eXBlLFxuICAgICAgICAgIGhpc3Rub3JtOiB0eXBlLmhpc3Rub3JtIHx8ICdkZW5zaXR5JyxcbiAgICAgICAgICBoaXN0ZnVuYzogdHlwZS5oaXN0ZnVuYyB8fCAnY291bnQnLFxuICAgICAgICAgIGNvbnRvdXJzOiB7XG4gICAgICAgICAgICBzaG93bGFiZWxzOiB0cnVlLFxuICAgICAgICAgICAgbGFiZWxmb250OiB7XG4gICAgICAgICAgICAgIGNvbG9yOiAnd2hpdGUnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjb2xvcmJhcjoge1xuICAgICAgICAgICAgdGlja2NvbG9yOiB0aGlzLmdldEdyaWRDb2xvcih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpLFxuICAgICAgICAgICAgdGhpY2tuZXNzOiAwLFxuICAgICAgICAgICAgdGlja2ZvbnQ6IHtcbiAgICAgICAgICAgICAgY29sb3I6IHRoaXMuZ2V0TGFiZWxDb2xvcih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgeDogMSArIGd0cy5pZCAvIDIwLFxuICAgICAgICAgICAgeHBhZDogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgc2hvd3NjYWxlOiB0aGlzLnNob3dMZWdlbmQsXG4gICAgICAgICAgY29sb3JzY2FsZTogQ29sb3JMaWIuZ2V0Q29sb3JHcmFkaWVudChndHMuaWQsIHRoaXMuX29wdGlvbnMuc2NoZW1lKSxcbiAgICAgICAgICBhdXRvY29sb3JzY2FsZTogZmFsc2UsXG4gICAgICAgICAgbmFtZTogbGFiZWwsXG4gICAgICAgICAgdGV4dDogbGFiZWwsXG4gICAgICAgICAgeDogW10sXG4gICAgICAgICAgeTogW10sXG4gICAgICAgICAgbGluZToge2NvbG9yfSxcbiAgICAgICAgICBob3ZlcmluZm86ICdub25lJyxcbiAgICAgICAgICBjb25uZWN0Z2FwczogZmFsc2UsXG4gICAgICAgICAgdmlzaWJsZTogdGhpcy5faGlkZGVuRGF0YS5maWx0ZXIoaCA9PiBoID09PSBndHMuaWQpLmxlbmd0aCA+PSAwLFxuICAgICAgICB9O1xuICAgICAgICBndHMudi5mb3JFYWNoKHZhbHVlID0+IHtcbiAgICAgICAgICBjb25zdCB0cyA9IHZhbHVlWzBdO1xuICAgICAgICAgIHNlcmllcy55LnB1c2godmFsdWVbdmFsdWUubGVuZ3RoIC0gMV0pO1xuICAgICAgICAgIGlmICh0aGlzLl9vcHRpb25zLnRpbWVNb2RlICYmIHRoaXMuX29wdGlvbnMudGltZU1vZGUgPT09ICd0aW1lc3RhbXAnKSB7XG4gICAgICAgICAgICBzZXJpZXMueC5wdXNoKHRzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VyaWVzLngucHVzaChtb21lbnQudHoobW9tZW50LnV0Yyh0cyAvIHRoaXMuZGl2aWRlciksIHRoaXMuX29wdGlvbnMudGltZVpvbmUpLnRvSVNPU3RyaW5nKCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGRhdGFzZXQucHVzaChzZXJpZXMpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnY29udmVydCcsICdkYXRhc2V0J10sIGRhdGFzZXQpO1xuXG4gICAgcmV0dXJuIGRhdGFzZXQ7XG4gIH1cblxuICBwcml2YXRlIGJ1aWxkR3JhcGgoKSB7XG4gICAgdGhpcy5MT0cuZGVidWcoWydkcmF3Q2hhcnQnLCAndGhpcy5sYXlvdXQnXSwgdGhpcy5yZXNwb25zaXZlKTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RyYXdDaGFydCcsICd0aGlzLmxheW91dCddLCB0aGlzLmxheW91dCk7XG4gICAgdGhpcy5MT0cuZGVidWcoWydkcmF3Q2hhcnQnLCAndGhpcy5wbG90bHlDb25maWcnXSwgdGhpcy5wbG90bHlDb25maWcpO1xuICAgIHRoaXMubGF5b3V0LnNob3dsZWdlbmQgPSB0aGlzLnNob3dMZWdlbmQ7XG4gICAgdGhpcy5sYXlvdXQueWF4aXMuY29sb3IgPSB0aGlzLmdldEdyaWRDb2xvcih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgIHRoaXMubGF5b3V0LnhheGlzLmNvbG9yID0gdGhpcy5nZXRHcmlkQ29sb3IodGhpcy5lbC5uYXRpdmVFbGVtZW50KTtcbiAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgfVxufVxuIl19