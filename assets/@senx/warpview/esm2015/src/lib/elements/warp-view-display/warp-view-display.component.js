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
import { Component, ElementRef, NgZone, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { WarpViewComponent } from '../warp-view-component';
import { ChartLib } from '../../utils/chart-lib';
import { GTSLib } from '../../utils/gts.lib';
import { SizeService } from '../../services/resize.service';
import { Logger } from '../../utils/logger';
import fitty from 'fitty';
import moment from 'moment-timezone';
/**
 *
 */
export class WarpViewDisplayComponent extends WarpViewComponent {
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
        this.toDisplay = '';
        this.defOptions = (/** @type {?} */ ({
            timeMode: 'custom'
        }));
        this.LOG = new Logger(WarpViewDisplayComponent, this._debug);
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.drawChart();
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
    /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    update(options, refresh) {
        this.drawChart();
        this.flexFont();
    }
    /**
     * @private
     * @return {?}
     */
    drawChart() {
        this.LOG.debug(['drawChart'], this._options, this.defOptions);
        this.initChart(this.el);
        this._options = ChartLib.mergeDeep(this.defOptions, this._options);
        this.LOG.debug(['drawChart', 'afterInit'], this._options, this.defOptions, this.height);
        this.LOG.debug(['drawChart'], this._data, this.toDisplay);
        this.flexFont();
        this.chartDraw.emit();
    }
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    convert(data) {
        this._options = ChartLib.mergeDeep(this.defOptions, this._options);
        this.LOG.debug(['convert'], this._options.timeMode);
        /** @type {?} */
        let display;
        if (this._data.data) {
            display = GTSLib.isArray(this._data.data) ? this._data.data[0] : this._data.data;
        }
        else {
            display = GTSLib.isArray(this._data) ? this._data[0] : this._data;
        }
        switch (this._options.timeMode) {
            case 'date':
                this.toDisplay = moment.tz(parseInt(display, 10) / this.divider, this._options.timeZone).toISOString(true);
                break;
            case 'duration':
                /** @type {?} */
                const start = moment.tz(parseInt(display, 10) / this.divider, this._options.timeZone);
                this.displayDuration(start);
                break;
            case 'custom':
            case 'timestamp':
                this.toDisplay = display;
        }
        return [];
    }
    /**
     * @return {?}
     */
    getStyle() {
        if (!this._options) {
            return {};
        }
        else {
            /** @type {?} */
            const style = { 'background-color': this._options.bgColor || 'transparent' };
            if (this._options.fontColor) {
                style.color = this._options.fontColor;
            }
            return style;
        }
    }
    /**
     * @return {?}
     */
    flexFont() {
        if (!!this.wrapper) {
            this.LOG.debug(['flexFont'], this.height);
            if (this.fitties) {
                this.fitties.unsubscribe();
            }
            this.fitties = fitty(this.wrapper.nativeElement, {
                maxSize: ((/** @type {?} */ (this.el.nativeElement))).parentElement.clientHeight * 0.80,
                minSize: 14
            });
            this.LOG.debug(['flexFont'], 'ok', ((/** @type {?} */ (this.el.nativeElement))).parentElement.clientHeight);
            this.fitties.fit();
            this.loading = false;
        }
    }
    /**
     * @private
     * @param {?} start
     * @return {?}
     */
    displayDuration(start) {
        this.timer = setInterval((/**
         * @return {?}
         */
        () => {
            /** @type {?} */
            const now = moment();
            this.toDisplay = moment.duration(start.diff(now)).humanize(true);
        }), 1000);
    }
}
WarpViewDisplayComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-display',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"chart-container\" (resized)=\"flexFont()\" [ngStyle]=\"getStyle()\">\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <div class=\"value\" #wrapper [hidden]=\"loading\">\n    <span [innerHTML]=\"toDisplay\"></span><small>{{unit}}</small>\n  </div>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host{width:var(--warp-view-chart-width,100%);height:var(--warp-view-chart-height,100%);color:var(--warp-view-font-color);position:relative;overflow:hidden}:host .chart-container{text-align:center;height:calc(100% - 20px);width:100%;justify-items:stretch;min-height:100%;-webkit-box-pack:center;justify-content:center;display:-webkit-box;display:flex;overflow:hidden}:host .chart-container .value{padding:10px;text-align:center;white-space:nowrap;overflow:hidden;display:inline-block;vertical-align:middle;-ms-grid-row-align:center;align-self:center}:host .chart-container .value span{min-height:100%}:host .chart-container .value small{font-size:.5em}"]
            }] }
];
/** @nocollapse */
WarpViewDisplayComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: SizeService },
    { type: NgZone }
];
WarpViewDisplayComponent.propDecorators = {
    wrapper: [{ type: ViewChild, args: ['wrapper', { static: true },] }]
};
if (false) {
    /** @type {?} */
    WarpViewDisplayComponent.prototype.wrapper;
    /** @type {?} */
    WarpViewDisplayComponent.prototype.toDisplay;
    /** @type {?} */
    WarpViewDisplayComponent.prototype.defOptions;
    /**
     * @type {?}
     * @private
     */
    WarpViewDisplayComponent.prototype.fitties;
    /**
     * @type {?}
     * @private
     */
    WarpViewDisplayComponent.prototype.timer;
    /** @type {?} */
    WarpViewDisplayComponent.prototype.el;
    /** @type {?} */
    WarpViewDisplayComponent.prototype.renderer;
    /** @type {?} */
    WarpViewDisplayComponent.prototype.sizeService;
    /** @type {?} */
    WarpViewDisplayComponent.prototype.ngZone;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LWRpc3BsYXkuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHNlbngvd2FycHZpZXcvIiwic291cmNlcyI6WyJzcmMvbGliL2VsZW1lbnRzL3dhcnAtdmlldy1kaXNwbGF5L3dhcnAtdmlldy1kaXNwbGF5LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQXFCLFNBQVMsRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDeEgsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFFekQsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9DLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUUzQyxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sK0JBQStCLENBQUM7QUFDMUQsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQzFDLE9BQU8sS0FBc0IsTUFBTSxPQUFPLENBQUM7QUFDM0MsT0FBTyxNQUFNLE1BQU0saUJBQWlCLENBQUM7Ozs7QUFXckMsTUFBTSxPQUFPLHdCQUF5QixTQUFRLGlCQUFpQjs7Ozs7OztJQVU3RCxZQUNTLEVBQWMsRUFDZCxRQUFtQixFQUNuQixXQUF3QixFQUN4QixNQUFjO1FBRXJCLEtBQUssQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUxsQyxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQ2QsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUNuQixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4QixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBWnZCLGNBQVMsR0FBRyxFQUFFLENBQUM7UUFDZixlQUFVLEdBQUcsbUJBQUE7WUFDWCxR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cHlyaWdodCAyMDIwICBTZW5YIFMuQS5TLlxuICpcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50LCBFbGVtZW50UmVmLCBOZ1pvbmUsIE9uRGVzdHJveSwgT25Jbml0LCBSZW5kZXJlcjIsIFZpZXdDaGlsZCwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtXYXJwVmlld0NvbXBvbmVudH0gZnJvbSAnLi4vd2FycC12aWV3LWNvbXBvbmVudCc7XG5pbXBvcnQge1BhcmFtfSBmcm9tICcuLi8uLi9tb2RlbC9wYXJhbSc7XG5pbXBvcnQge0NoYXJ0TGlifSBmcm9tICcuLi8uLi91dGlscy9jaGFydC1saWInO1xuaW1wb3J0IHtHVFNMaWJ9IGZyb20gJy4uLy4uL3V0aWxzL2d0cy5saWInO1xuaW1wb3J0IHtEYXRhTW9kZWx9IGZyb20gJy4uLy4uL21vZGVsL2RhdGFNb2RlbCc7XG5pbXBvcnQge1NpemVTZXJ2aWNlfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9yZXNpemUuc2VydmljZSc7XG5pbXBvcnQge0xvZ2dlcn0gZnJvbSAnLi4vLi4vdXRpbHMvbG9nZ2VyJztcbmltcG9ydCBmaXR0eSwge0ZpdHR5SW5zdGFuY2V9IGZyb20gJ2ZpdHR5JztcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50LXRpbWV6b25lJztcblxuLyoqXG4gKlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICd3YXJwdmlldy1kaXNwbGF5JyxcbiAgdGVtcGxhdGVVcmw6ICcuL3dhcnAtdmlldy1kaXNwbGF5LmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vd2FycC12aWV3LWRpc3BsYXkuY29tcG9uZW50LnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uU2hhZG93RG9tXG59KVxuZXhwb3J0IGNsYXNzIFdhcnBWaWV3RGlzcGxheUNvbXBvbmVudCBleHRlbmRzIFdhcnBWaWV3Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICBAVmlld0NoaWxkKCd3cmFwcGVyJywge3N0YXRpYzogdHJ1ZX0pIHdyYXBwZXI6IEVsZW1lbnRSZWY7XG4gIHRvRGlzcGxheSA9ICcnO1xuICBkZWZPcHRpb25zID0ge1xuICAgIHRpbWVNb2RlOiAnY3VzdG9tJ1xuICB9IGFzIFBhcmFtO1xuXG4gIHByaXZhdGUgZml0dGllczogRml0dHlJbnN0YW5jZTtcbiAgcHJpdmF0ZSB0aW1lcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgZWw6IEVsZW1lbnRSZWYsXG4gICAgcHVibGljIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHVibGljIHNpemVTZXJ2aWNlOiBTaXplU2VydmljZSxcbiAgICBwdWJsaWMgbmdab25lOiBOZ1pvbmVcbiAgKSB7XG4gICAgc3VwZXIoZWwsIHJlbmRlcmVyLCBzaXplU2VydmljZSwgbmdab25lKTtcbiAgICB0aGlzLkxPRyA9IG5ldyBMb2dnZXIoV2FycFZpZXdEaXNwbGF5Q29tcG9uZW50LCB0aGlzLl9kZWJ1Zyk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmRyYXdDaGFydCgpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgaWYgKHRoaXMudGltZXIpIHtcbiAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy50aW1lcik7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlKG9wdGlvbnM6IFBhcmFtLCByZWZyZXNoOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5kcmF3Q2hhcnQoKTtcbiAgICB0aGlzLmZsZXhGb250KCk7XG4gIH1cblxuICBwcml2YXRlIGRyYXdDaGFydCgpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RyYXdDaGFydCddLCB0aGlzLl9vcHRpb25zLCB0aGlzLmRlZk9wdGlvbnMpO1xuICAgIHRoaXMuaW5pdENoYXJ0KHRoaXMuZWwpO1xuICAgIHRoaXMuX29wdGlvbnMgPSBDaGFydExpYi5tZXJnZURlZXAodGhpcy5kZWZPcHRpb25zLCB0aGlzLl9vcHRpb25zKTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RyYXdDaGFydCcsICdhZnRlckluaXQnXSwgdGhpcy5fb3B0aW9ucywgdGhpcy5kZWZPcHRpb25zLCB0aGlzLmhlaWdodCk7XG4gICAgdGhpcy5MT0cuZGVidWcoWydkcmF3Q2hhcnQnXSwgdGhpcy5fZGF0YSwgdGhpcy50b0Rpc3BsYXkpO1xuICAgIHRoaXMuZmxleEZvbnQoKTtcbiAgICB0aGlzLmNoYXJ0RHJhdy5lbWl0KCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgY29udmVydChkYXRhOiBEYXRhTW9kZWwpOiBhbnlbXSB7XG4gICAgdGhpcy5fb3B0aW9ucyA9IENoYXJ0TGliLm1lcmdlRGVlcCh0aGlzLmRlZk9wdGlvbnMsIHRoaXMuX29wdGlvbnMpO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnY29udmVydCddLCB0aGlzLl9vcHRpb25zLnRpbWVNb2RlKTtcbiAgICBsZXQgZGlzcGxheTogc3RyaW5nO1xuICAgIGlmICh0aGlzLl9kYXRhLmRhdGEpIHtcbiAgICAgIGRpc3BsYXkgPSBHVFNMaWIuaXNBcnJheSh0aGlzLl9kYXRhLmRhdGEpID8gdGhpcy5fZGF0YS5kYXRhWzBdIDogdGhpcy5fZGF0YS5kYXRhO1xuICAgIH0gZWxzZSB7XG4gICAgICBkaXNwbGF5ID0gR1RTTGliLmlzQXJyYXkodGhpcy5fZGF0YSkgPyB0aGlzLl9kYXRhWzBdIDogdGhpcy5fZGF0YTtcbiAgICB9XG4gICAgc3dpdGNoICh0aGlzLl9vcHRpb25zLnRpbWVNb2RlKSB7XG4gICAgICBjYXNlICdkYXRlJzpcbiAgICAgICAgdGhpcy50b0Rpc3BsYXkgPSBtb21lbnQudHoocGFyc2VJbnQoZGlzcGxheSwgMTApIC8gdGhpcy5kaXZpZGVyLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKS50b0lTT1N0cmluZyh0cnVlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdkdXJhdGlvbic6XG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gbW9tZW50LnR6KHBhcnNlSW50KGRpc3BsYXksIDEwKSAvIHRoaXMuZGl2aWRlciwgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSk7XG4gICAgICAgIHRoaXMuZGlzcGxheUR1cmF0aW9uKHN0YXJ0KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjdXN0b20nOlxuICAgICAgY2FzZSAndGltZXN0YW1wJzpcbiAgICAgICAgdGhpcy50b0Rpc3BsYXkgPSBkaXNwbGF5O1xuICAgIH1cbiAgICByZXR1cm4gW107XG4gIH1cblxuICBnZXRTdHlsZSgpIHtcbiAgICBpZiAoIXRoaXMuX29wdGlvbnMpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgc3R5bGU6IGFueSA9IHsnYmFja2dyb3VuZC1jb2xvcic6IHRoaXMuX29wdGlvbnMuYmdDb2xvciB8fCAndHJhbnNwYXJlbnQnfTtcbiAgICAgIGlmICh0aGlzLl9vcHRpb25zLmZvbnRDb2xvcikge1xuICAgICAgICBzdHlsZS5jb2xvciA9IHRoaXMuX29wdGlvbnMuZm9udENvbG9yO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN0eWxlO1xuICAgIH1cbiAgfVxuXG4gIGZsZXhGb250KCkge1xuICAgIGlmICghIXRoaXMud3JhcHBlcikge1xuICAgICAgdGhpcy5MT0cuZGVidWcoWydmbGV4Rm9udCddLCB0aGlzLmhlaWdodCk7XG4gICAgICBpZiAodGhpcy5maXR0aWVzKSB7XG4gICAgICAgIHRoaXMuZml0dGllcy51bnN1YnNjcmliZSgpO1xuICAgICAgfVxuICAgICAgdGhpcy5maXR0aWVzID0gZml0dHkodGhpcy53cmFwcGVyLm5hdGl2ZUVsZW1lbnQsIHtcbiAgICAgICAgbWF4U2l6ZTogKHRoaXMuZWwubmF0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudCkucGFyZW50RWxlbWVudC5jbGllbnRIZWlnaHQgKiAwLjgwLFxuICAgICAgICBtaW5TaXplOiAxNFxuICAgICAgfSk7XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2ZsZXhGb250J10sICdvaycsICh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLnBhcmVudEVsZW1lbnQuY2xpZW50SGVpZ2h0KTtcbiAgICAgIHRoaXMuZml0dGllcy5maXQoKTtcbiAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZGlzcGxheUR1cmF0aW9uKHN0YXJ0OiBhbnkpIHtcbiAgICB0aGlzLnRpbWVyID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgY29uc3Qgbm93ID0gbW9tZW50KCk7XG4gICAgICB0aGlzLnRvRGlzcGxheSA9IG1vbWVudC5kdXJhdGlvbihzdGFydC5kaWZmKG5vdykpLmh1bWFuaXplKHRydWUpO1xuICAgIH0sIDEwMDApO1xuICB9XG59XG4iXX0=