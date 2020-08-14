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
import { Component, ElementRef, EventEmitter, Input, NgZone, Output, Renderer2, ViewEncapsulation } from '@angular/core';
import { WarpViewComponent } from '../warp-view-component';
import { ColorLib } from '../../utils/color-lib';
import deepEqual from 'deep-equal';
import { SizeService } from '../../services/resize.service';
import { Logger } from '../../utils/logger';
import { ChartLib } from '../../utils/chart-lib';
import { GTSLib } from '../../utils/gts.lib';
export class WarpViewPieComponent extends WarpViewComponent {
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
        this.chartDraw = new EventEmitter();
        this._type = 'pie';
        this.layout = {
            showlegend: true,
            legend: {
                orientation: 'h',
                bgcolor: 'transparent',
            },
            orientation: 270,
            margin: {
                t: 10,
                b: 25,
                r: 10,
                l: 10
            }
        };
        this.LOG = new Logger(WarpViewPieComponent, this._debug);
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
    ngOnInit() {
        this._options = this._options || this.defOptions;
    }
    /**
     * @return {?}
     */
    drawChart() {
        if (!this.initChart(this.el)) {
            return;
        }
        this.LOG.debug(['drawChart', 'this.layout'], this.layout);
        this.LOG.debug(['drawChart', 'this.plotlyConfig'], this.plotlyConfig);
        this.LOG.debug(['drawChart', 'this.plotlyData'], this.plotlyData);
        this.layout.legend.font = {
            color: this.getCSSColor(this.el.nativeElement, '--warp-view-font-color', '#000')
        };
        this.layout.textfont = {
            color: this.getCSSColor(this.el.nativeElement, '--warp-view-font-color', '#000')
        };
        this.loading = false;
    }
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    convert(data) {
        /** @type {?} */
        const gtsList = (/** @type {?} */ (data.data));
        /** @type {?} */
        const plotData = (/** @type {?} */ ([]));
        this.LOG.debug(['convert', 'gtsList'], gtsList);
        /** @type {?} */
        const pieData = (/** @type {?} */ ({
            values: [],
            labels: [],
            marker: {
                colors: [],
                line: {
                    width: 3,
                    color: [],
                }
            },
            textfont: {
                color: this.getLabelColor(this.el.nativeElement)
            },
            hoverlabel: {
                bgcolor: this.getCSSColor(this.el.nativeElement, '--warp-view-chart-legend-bg', '#000000'),
                bordercolor: 'grey',
                font: {
                    color: this.getCSSColor(this.el.nativeElement, '--warp-view-chart-legend-color', '#ffffff')
                }
            },
            type: 'pie'
        }));
        gtsList.forEach((/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        (d, i) => {
            if (!GTSLib.isGts(d)) {
                /** @type {?} */
                const c = ColorLib.getColor(i, this._options.scheme);
                /** @type {?} */
                const color = ((data.params || [])[i] || { datasetColor: c }).datasetColor || c;
                pieData.values.push(d[1]);
                pieData.labels.push(d[0]);
                pieData.marker.colors.push(ColorLib.transparentize(color));
                pieData.marker.line.color.push(color);
                if (this._type === 'donut') {
                    pieData.hole = 0.5;
                }
                if (this.unit) {
                    pieData.title = {
                        text: this.unit
                    };
                }
            }
        }));
        if (pieData.values.length > 0) {
            plotData.push(pieData);
        }
        this.noData = plotData.length === 0;
        return plotData;
    }
}
WarpViewPieComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-pie',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div id=\"chartContainer\" #chartContainer>\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display or wrong data format.</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-plotly #graph *ngIf=\"plotlyData?.length > 0\"\n                     [data]=\"plotlyData\" [layout]=\"layout\" [config]=\"plotlyConfig\" (afterPlot)=\"afterPlot()\"\n                     (relayout)=\"relayout($event)\"\n                     [updateOnLayoutChange]=\"true\" [updateOnDataChange]=\"true\" [debug]=\"debug\"\n                     [style]=\"{position: 'relative', width: '100%', height: '100%'}\"></warpview-plotly>\n  </div>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host{display:block;height:100%}:host #chartContainer{height:100%}:host #chartContainer div{height:100%}:host div.chart{width:var(--warp-view-chart-width);height:var(--warp-view-chart-height)}"]
            }] }
];
/** @nocollapse */
WarpViewPieComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: SizeService },
    { type: NgZone }
];
WarpViewPieComponent.propDecorators = {
    type: [{ type: Input, args: ['type',] }],
    chartDraw: [{ type: Output, args: ['chartDraw',] }]
};
if (false) {
    /** @type {?} */
    WarpViewPieComponent.prototype.chartDraw;
    /**
     * @type {?}
     * @private
     */
    WarpViewPieComponent.prototype._type;
    /** @type {?} */
    WarpViewPieComponent.prototype.layout;
    /** @type {?} */
    WarpViewPieComponent.prototype.el;
    /** @type {?} */
    WarpViewPieComponent.prototype.renderer;
    /** @type {?} */
    WarpViewPieComponent.prototype.sizeService;
    /** @type {?} */
    WarpViewPieComponent.prototype.ngZone;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LXBpZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VueC93YXJwdmlldy8iLCJzb3VyY2VzIjpbInNyYy9saWIvZWxlbWVudHMvd2FycC12aWV3LXBpZS93YXJwLXZpZXctcGllLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBVSxNQUFNLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQy9ILE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBRXpELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQyxPQUFPLFNBQVMsTUFBTSxZQUFZLENBQUM7QUFDbkMsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBQzFELE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUMxQyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFFL0MsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBUTNDLE1BQU0sT0FBTyxvQkFBcUIsU0FBUSxpQkFBaUI7Ozs7Ozs7SUFrQ3pELFlBQ1MsRUFBYyxFQUNkLFFBQW1CLEVBQ25CLFdBQXdCLEVBQ3hCLE1BQWM7UUFFckIsS0FBSyxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBTGxDLE9BQUUsR0FBRixFQUFFLENBQVk7UUFDZCxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ25CLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLFdBQU0sR0FBTixNQUFNLENBQVE7UUEvQkYsY0FBUyxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFF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LHFDQUFzQjs7SUFDdEIsc0NBYUU7O0lBWUEsa0NBQXFCOztJQUNyQix3Q0FBMEI7O0lBQzFCLDJDQUErQjs7SUFDL0Isc0NBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqICBDb3B5cmlnaHQgMjAyMCAgU2VuWCBTLkEuUy5cbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudCwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgTmdab25lLCBPbkluaXQsIE91dHB1dCwgUmVuZGVyZXIyLCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1dhcnBWaWV3Q29tcG9uZW50fSBmcm9tICcuLi93YXJwLXZpZXctY29tcG9uZW50JztcbmltcG9ydCB7RGF0YU1vZGVsfSBmcm9tICcuLi8uLi9tb2RlbC9kYXRhTW9kZWwnO1xuaW1wb3J0IHtDb2xvckxpYn0gZnJvbSAnLi4vLi4vdXRpbHMvY29sb3ItbGliJztcbmltcG9ydCBkZWVwRXF1YWwgZnJvbSAnZGVlcC1lcXVhbCc7XG5pbXBvcnQge1NpemVTZXJ2aWNlfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9yZXNpemUuc2VydmljZSc7XG5pbXBvcnQge0xvZ2dlcn0gZnJvbSAnLi4vLi4vdXRpbHMvbG9nZ2VyJztcbmltcG9ydCB7Q2hhcnRMaWJ9IGZyb20gJy4uLy4uL3V0aWxzL2NoYXJ0LWxpYic7XG5pbXBvcnQge1BhcmFtfSBmcm9tICcuLi8uLi9tb2RlbC9wYXJhbSc7XG5pbXBvcnQge0dUU0xpYn0gZnJvbSAnLi4vLi4vdXRpbHMvZ3RzLmxpYic7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3dhcnB2aWV3LXBpZScsXG4gIHRlbXBsYXRlVXJsOiAnLi93YXJwLXZpZXctcGllLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vd2FycC12aWV3LXBpZS5jb21wb25lbnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5TaGFkb3dEb21cbn0pXG5leHBvcnQgY2xhc3MgV2FycFZpZXdQaWVDb21wb25lbnQgZXh0ZW5kcyBXYXJwVmlld0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgQElucHV0KCd0eXBlJykgc2V0IHR5cGUodHlwZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdHlwZSA9IHR5cGU7XG4gICAgdGhpcy5kcmF3Q2hhcnQoKTtcbiAgfVxuXG4gIEBPdXRwdXQoJ2NoYXJ0RHJhdycpIGNoYXJ0RHJhdyA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIHByaXZhdGUgX3R5cGUgPSAncGllJztcbiAgbGF5b3V0OiBQYXJ0aWFsPGFueT4gPSB7XG4gICAgc2hvd2xlZ2VuZDogdHJ1ZSxcbiAgICBsZWdlbmQ6IHtcbiAgICAgIG9yaWVudGF0aW9uOiAnaCcsXG4gICAgICBiZ2NvbG9yOiAndHJhbnNwYXJlbnQnLFxuICAgIH0sXG4gICAgb3JpZW50YXRpb246IDI3MCxcbiAgICBtYXJnaW46IHtcbiAgICAgIHQ6IDEwLFxuICAgICAgYjogMjUsXG4gICAgICByOiAxMCxcbiAgICAgIGw6IDEwXG4gICAgfVxuICB9O1xuXG4gIHVwZGF0ZShvcHRpb25zLCByZWZyZXNoKTogdm9pZCB7XG4gICAgdGhpcy5MT0cuZGVidWcoWydvbk9wdGlvbnMnLCAnYmVmb3JlJ10sIHRoaXMuX29wdGlvbnMsIG9wdGlvbnMpO1xuICAgIGlmICghZGVlcEVxdWFsKG9wdGlvbnMsIHRoaXMuX29wdGlvbnMpKSB7XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ29wdGlvbnMnLCAnY2hhbmdlZCddLCBvcHRpb25zKTtcbiAgICAgIHRoaXMuX29wdGlvbnMgPSBDaGFydExpYi5tZXJnZURlZXAodGhpcy5fb3B0aW9ucywgb3B0aW9ucyBhcyBQYXJhbSkgYXMgUGFyYW07XG4gICAgfVxuICAgIHRoaXMuZHJhd0NoYXJ0KCk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgZWw6IEVsZW1lbnRSZWYsXG4gICAgcHVibGljIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHVibGljIHNpemVTZXJ2aWNlOiBTaXplU2VydmljZSxcbiAgICBwdWJsaWMgbmdab25lOiBOZ1pvbmVcbiAgKSB7XG4gICAgc3VwZXIoZWwsIHJlbmRlcmVyLCBzaXplU2VydmljZSwgbmdab25lKTtcbiAgICB0aGlzLkxPRyA9IG5ldyBMb2dnZXIoV2FycFZpZXdQaWVDb21wb25lbnQsIHRoaXMuX2RlYnVnKTtcbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuX29wdGlvbnMgPSB0aGlzLl9vcHRpb25zIHx8IHRoaXMuZGVmT3B0aW9ucztcbiAgfVxuXG4gIGRyYXdDaGFydCgpIHtcbiAgICBpZiAoIXRoaXMuaW5pdENoYXJ0KHRoaXMuZWwpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuTE9HLmRlYnVnKFsnZHJhd0NoYXJ0JywgJ3RoaXMubGF5b3V0J10sIHRoaXMubGF5b3V0KTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RyYXdDaGFydCcsICd0aGlzLnBsb3RseUNvbmZpZyddLCB0aGlzLnBsb3RseUNvbmZpZyk7XG4gICAgdGhpcy5MT0cuZGVidWcoWydkcmF3Q2hhcnQnLCAndGhpcy5wbG90bHlEYXRhJ10sIHRoaXMucGxvdGx5RGF0YSk7XG4gICAgdGhpcy5sYXlvdXQubGVnZW5kLmZvbnQgPSB7XG4gICAgICBjb2xvcjogdGhpcy5nZXRDU1NDb2xvcih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICctLXdhcnAtdmlldy1mb250LWNvbG9yJywgJyMwMDAnKVxuICAgIH07XG4gICAgdGhpcy5sYXlvdXQudGV4dGZvbnQgPSB7XG4gICAgICBjb2xvcjogdGhpcy5nZXRDU1NDb2xvcih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICctLXdhcnAtdmlldy1mb250LWNvbG9yJywgJyMwMDAnKVxuICAgIH07XG4gICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gIH1cblxuICBwcm90ZWN0ZWQgY29udmVydChkYXRhOiBEYXRhTW9kZWwpOiBQYXJ0aWFsPGFueT5bXSB7XG4gICAgY29uc3QgZ3RzTGlzdCA9IGRhdGEuZGF0YSBhcyBhbnlbXTtcbiAgICBjb25zdCBwbG90RGF0YSA9IFtdIGFzIFBhcnRpYWw8YW55PltdO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnY29udmVydCcsICdndHNMaXN0J10sIGd0c0xpc3QpO1xuICAgIGNvbnN0IHBpZURhdGEgPSB7XG4gICAgICB2YWx1ZXM6IFtdLFxuICAgICAgbGFiZWxzOiBbXSxcbiAgICAgIG1hcmtlcjoge1xuICAgICAgICBjb2xvcnM6IFtdLFxuICAgICAgICBsaW5lOiB7XG4gICAgICAgICAgd2lkdGg6IDMsXG4gICAgICAgICAgY29sb3I6IFtdLFxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdGV4dGZvbnQ6IHtcbiAgICAgICAgY29sb3I6IHRoaXMuZ2V0TGFiZWxDb2xvcih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpXG4gICAgICB9LFxuICAgICAgaG92ZXJsYWJlbDoge1xuICAgICAgICBiZ2NvbG9yOiB0aGlzLmdldENTU0NvbG9yKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJy0td2FycC12aWV3LWNoYXJ0LWxlZ2VuZC1iZycsICcjMDAwMDAwJyksXG4gICAgICAgIGJvcmRlcmNvbG9yOiAnZ3JleScsXG4gICAgICAgIGZvbnQ6IHtcbiAgICAgICAgICBjb2xvcjogdGhpcy5nZXRDU1NDb2xvcih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICctLXdhcnAtdmlldy1jaGFydC1sZWdlbmQtY29sb3InLCAnI2ZmZmZmZicpXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB0eXBlOiAncGllJ1xuICAgIH0gYXMgYW55O1xuICAgIGd0c0xpc3QuZm9yRWFjaCgoZDogYW55LCBpKSA9PiB7XG4gICAgICBpZiAoIUdUU0xpYi5pc0d0cyhkKSkge1xuICAgICAgICBjb25zdCBjID0gQ29sb3JMaWIuZ2V0Q29sb3IoaSwgdGhpcy5fb3B0aW9ucy5zY2hlbWUpO1xuICAgICAgICBjb25zdCBjb2xvciA9ICgoZGF0YS5wYXJhbXMgfHwgW10pW2ldIHx8IHtkYXRhc2V0Q29sb3I6IGN9KS5kYXRhc2V0Q29sb3IgfHwgYztcbiAgICAgICAgcGllRGF0YS52YWx1ZXMucHVzaChkWzFdKTtcbiAgICAgICAgcGllRGF0YS5sYWJlbHMucHVzaChkWzBdKTtcbiAgICAgICAgcGllRGF0YS5tYXJrZXIuY29sb3JzLnB1c2goQ29sb3JMaWIudHJhbnNwYXJlbnRpemUoY29sb3IpKTtcbiAgICAgICAgcGllRGF0YS5tYXJrZXIubGluZS5jb2xvci5wdXNoKGNvbG9yKTtcbiAgICAgICAgaWYgKHRoaXMuX3R5cGUgPT09ICdkb251dCcpIHtcbiAgICAgICAgICBwaWVEYXRhLmhvbGUgPSAwLjU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMudW5pdCkge1xuICAgICAgICAgIHBpZURhdGEudGl0bGUgPSB7XG4gICAgICAgICAgICB0ZXh0OiB0aGlzLnVuaXRcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHBpZURhdGEudmFsdWVzLmxlbmd0aCA+IDApIHtcbiAgICAgIHBsb3REYXRhLnB1c2gocGllRGF0YSk7XG4gICAgfVxuICAgIHRoaXMubm9EYXRhID0gcGxvdERhdGEubGVuZ3RoID09PSAwO1xuICAgIHJldHVybiBwbG90RGF0YTtcbiAgfVxufVxuIl19