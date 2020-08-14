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
import { Component, ElementRef, HostListener, NgZone, Renderer2, ViewEncapsulation } from '@angular/core';
import { WarpViewComponent } from '../warp-view-component';
import moment from 'moment';
import { GTSLib } from '../../utils/gts.lib';
import { ColorLib } from '../../utils/color-lib';
import { SizeService } from '../../services/resize.service';
import { Logger } from '../../utils/logger';
/**
 *
 */
export class WarpViewDrillDownComponent extends WarpViewComponent {
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
        this.parentWidth = -1;
        this.LOG = new Logger(WarpViewDrillDownComponent, this._debug);
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.drawChart();
    }
    /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    update(options, refresh) {
        this.drawChart();
    }
    /**
     * @return {?}
     */
    onResize() {
        if (this.el.nativeElement.parentElement.clientWidth !== this.parentWidth || this.parentWidth <= 0) {
            this.parentWidth = this.el.nativeElement.parentElement.clientWidth;
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout((/**
             * @return {?}
             */
            () => {
                if (this.el.nativeElement.parentElement.clientWidth > 0) {
                    this.LOG.debug(['onResize'], this.el.nativeElement.parentElement.clientWidth);
                    this.drawChart();
                }
                else {
                    this.onResize();
                }
            }), 150);
        }
    }
    /**
     * @private
     * @return {?}
     */
    drawChart() {
        this.loading = false;
        this.chartDraw.emit();
        if (!this.initChart(this.el)) {
            return;
        }
    }
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    convert(data) {
        /** @type {?} */
        const dataList = (/** @type {?} */ (this._data.data));
        this.heatMapData = this.parseData(GTSLib.flatDeep(dataList));
        return [];
    }
    /**
     * @private
     * @param {?} dataList
     * @return {?}
     */
    parseData(dataList) {
        /** @type {?} */
        const details = [];
        /** @type {?} */
        const values = [];
        /** @type {?} */
        const dates = [];
        /** @type {?} */
        const data = {};
        /** @type {?} */
        const reducer = (/**
         * @param {?} accumulator
         * @param {?} currentValue
         * @return {?}
         */
        (accumulator, currentValue) => accumulator + parseInt(currentValue, 10));
        this.LOG.debug(['parseData'], dataList);
        dataList.forEach((/**
         * @param {?} gts
         * @param {?} i
         * @return {?}
         */
        (gts, i) => {
            /** @type {?} */
            const name = GTSLib.serializeGtsMetadata(gts);
            gts.v.forEach((/**
             * @param {?} v
             * @return {?}
             */
            v => {
                /** @type {?} */
                const refDate = moment.utc(v[0] / 1000).startOf('day').toISOString();
                if (!data[refDate]) {
                    data[refDate] = [];
                }
                if (!values[refDate]) {
                    values[refDate] = [];
                }
                dates.push(v[0] / 1000);
                values[refDate].push(v[v.length - 1]);
                data[refDate].push({
                    name,
                    date: v[0] / 1000,
                    value: v[v.length - 1],
                    color: ColorLib.getColor(i, this._options.scheme),
                    id: i
                });
            }));
        }));
        Object.keys(data).forEach((/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            details.push({
                date: moment.utc(d),
                total: values[d].reduce(reducer),
                details: data[d],
                summary: []
            });
        }));
        return details;
    }
}
WarpViewDrillDownComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-drill-down',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"wrapper\">\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div *ngIf=\"!loading && !noData\">\n    <calendar-heatmap [data]=\"heatMapData\" overview=\"global\"\n                      [debug]=\"debug\"\n                      [minColor]=\"_options.minColor\"\n                      [maxColor]=\"_options.maxColor\"></calendar-heatmap>\n  </div>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host .wrapper{position:relative;width:100%;height:100%}"]
            }] }
];
/** @nocollapse */
WarpViewDrillDownComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: SizeService },
    { type: NgZone }
];
WarpViewDrillDownComponent.propDecorators = {
    onResize: [{ type: HostListener, args: ['window:resize',] }]
};
if (false) {
    /** @type {?} */
    WarpViewDrillDownComponent.prototype.heatMapData;
    /**
     * @type {?}
     * @private
     */
    WarpViewDrillDownComponent.prototype.parentWidth;
    /**
     * @type {?}
     * @private
     */
    WarpViewDrillDownComponent.prototype.resizeTimer;
    /** @type {?} */
    WarpViewDrillDownComponent.prototype.el;
    /** @type {?} */
    WarpViewDrillDownComponent.prototype.renderer;
    /** @type {?} */
    WarpViewDrillDownComponent.prototype.sizeService;
    /** @type {?} */
    WarpViewDrillDownComponent.prototype.ngZone;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LWRyaWxsLWRvd24uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHNlbngvd2FycHZpZXcvIiwic291cmNlcyI6WyJzcmMvbGliL2VsZW1lbnRzL3dhcnAtdmlldy1kcmlsbC1kb3duL3dhcnAtdmlldy1kcmlsbC1kb3duLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBQWdCLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkgsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFFekQsT0FBTyxNQUFNLE1BQU0sUUFBUSxDQUFDO0FBQzVCLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUMzQyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFFL0MsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBQzFELE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQzs7OztBQVcxQyxNQUFNLE9BQU8sMEJBQTJCLFNBQVEsaUJBQWlCOzs7Ozs7O0lBTS9ELFlBQ1MsRUFBYyxFQUNkLFFBQW1CLEVBQ25CLFdBQXdCLEVBQ3hCLE1BQWM7UUFFckIsS0FBSyxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBTGxDLE9BQUUsR0FBRixFQUFFLENBQVk7UUFDZCxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ25CLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLFdBQU0sR0FBTixNQUFNLENBQVE7UUFQZixnQkFBVyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBVXZCLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxNQUFNLENBQUMsMEJBQTBC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QUFDO2dCQUNULFFBQVEsRUFBRSxxQkFBcUI7Z0JBQy9CLHVtQ0FBb0Q7Z0JBRXBELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxTQUFTOzthQUMzQzs7OztZQWxCaUMsVUFBVTtZQUF3QixTQUFTO1lBT3JFLFdBQVc7WUFQeUMsTUFBTTs7O3VCQTJDL0QsWUFBWSxTQUFDLGVBQWU7Ozs7SUF0QjdCLGlEQUFpQjs7Ozs7SUFDakIsaURBQXlCOzs7OztJQUN6QixpREFBb0I7O0lBR2xCLHdDQUFxQjs7SUFDckIsOENBQTBCOztJQUMxQixpREFBK0I7O0lBQy9CLDRDQUFxQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQ29weXJpZ2h0IDIwMjAgIFNlblggUy5BLlMuXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKi9cblxuaW1wb3J0IHtBZnRlclZpZXdJbml0LCBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEhvc3RMaXN0ZW5lciwgTmdab25lLCBSZW5kZXJlcjIsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7V2FycFZpZXdDb21wb25lbnR9IGZyb20gJy4uL3dhcnAtdmlldy1jb21wb25lbnQnO1xuaW1wb3J0IHtQYXJhbX0gZnJvbSAnLi4vLi4vbW9kZWwvcGFyYW0nO1xuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuaW1wb3J0IHtHVFNMaWJ9IGZyb20gJy4uLy4uL3V0aWxzL2d0cy5saWInO1xuaW1wb3J0IHtDb2xvckxpYn0gZnJvbSAnLi4vLi4vdXRpbHMvY29sb3ItbGliJztcbmltcG9ydCB7RGF0YU1vZGVsfSBmcm9tICcuLi8uLi9tb2RlbC9kYXRhTW9kZWwnO1xuaW1wb3J0IHtTaXplU2VydmljZX0gZnJvbSAnLi4vLi4vc2VydmljZXMvcmVzaXplLnNlcnZpY2UnO1xuaW1wb3J0IHtMb2dnZXJ9IGZyb20gJy4uLy4uL3V0aWxzL2xvZ2dlcic7XG5cbi8qKlxuICpcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnd2FycHZpZXctZHJpbGwtZG93bicsXG4gIHRlbXBsYXRlVXJsOiAnLi93YXJwLXZpZXctZHJpbGwtZG93bi5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3dhcnAtdmlldy1kcmlsbC1kb3duLmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLlNoYWRvd0RvbVxufSlcbmV4cG9ydCBjbGFzcyBXYXJwVmlld0RyaWxsRG93bkNvbXBvbmVudCBleHRlbmRzIFdhcnBWaWV3Q29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCB7XG5cbiAgaGVhdE1hcERhdGE6IGFueTtcbiAgcHJpdmF0ZSBwYXJlbnRXaWR0aCA9IC0xO1xuICBwcml2YXRlIHJlc2l6ZVRpbWVyO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBlbDogRWxlbWVudFJlZixcbiAgICBwdWJsaWMgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwdWJsaWMgc2l6ZVNlcnZpY2U6IFNpemVTZXJ2aWNlLFxuICAgIHB1YmxpYyBuZ1pvbmU6IE5nWm9uZVxuICApIHtcbiAgICBzdXBlcihlbCwgcmVuZGVyZXIsIHNpemVTZXJ2aWNlLCBuZ1pvbmUpO1xuICAgIHRoaXMuTE9HID0gbmV3IExvZ2dlcihXYXJwVmlld0RyaWxsRG93bkNvbXBvbmVudCwgdGhpcy5fZGVidWcpO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuZHJhd0NoYXJ0KCk7XG4gIH1cblxuICB1cGRhdGUob3B0aW9uczogUGFyYW0sIHJlZnJlc2g6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmRyYXdDaGFydCgpO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignd2luZG93OnJlc2l6ZScpXG4gIG9uUmVzaXplKCkge1xuICAgIGlmICh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudC5jbGllbnRXaWR0aCAhPT0gdGhpcy5wYXJlbnRXaWR0aCB8fCB0aGlzLnBhcmVudFdpZHRoIDw9IDApIHtcbiAgICAgIHRoaXMucGFyZW50V2lkdGggPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudC5jbGllbnRXaWR0aDtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnJlc2l6ZVRpbWVyKTtcbiAgICAgIHRoaXMucmVzaXplVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuZWwubmF0aXZlRWxlbWVudC5wYXJlbnRFbGVtZW50LmNsaWVudFdpZHRoID4gMCkge1xuICAgICAgICAgIHRoaXMuTE9HLmRlYnVnKFsnb25SZXNpemUnXSwgdGhpcy5lbC5uYXRpdmVFbGVtZW50LnBhcmVudEVsZW1lbnQuY2xpZW50V2lkdGgpO1xuICAgICAgICAgIHRoaXMuZHJhd0NoYXJ0KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5vblJlc2l6ZSgpO1xuICAgICAgICB9XG4gICAgICB9LCAxNTApO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZHJhd0NoYXJ0KCkge1xuICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgIHRoaXMuY2hhcnREcmF3LmVtaXQoKTtcbiAgICBpZiAoIXRoaXMuaW5pdENoYXJ0KHRoaXMuZWwpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIGNvbnZlcnQoZGF0YTogRGF0YU1vZGVsKTogYW55W10ge1xuICAgIGNvbnN0IGRhdGFMaXN0ID0gdGhpcy5fZGF0YS5kYXRhIGFzIGFueVtdO1xuICAgIHRoaXMuaGVhdE1hcERhdGEgPSB0aGlzLnBhcnNlRGF0YShHVFNMaWIuZmxhdERlZXAoZGF0YUxpc3QpKTtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBwcml2YXRlIHBhcnNlRGF0YShkYXRhTGlzdDogYW55W10pIHtcbiAgICBjb25zdCBkZXRhaWxzID0gW107XG4gICAgY29uc3QgdmFsdWVzID0gW107XG4gICAgY29uc3QgZGF0ZXMgPSBbXTtcbiAgICBjb25zdCBkYXRhID0ge307XG4gICAgY29uc3QgcmVkdWNlciA9IChhY2N1bXVsYXRvciwgY3VycmVudFZhbHVlKSA9PiBhY2N1bXVsYXRvciArIHBhcnNlSW50KGN1cnJlbnRWYWx1ZSwgMTApO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsncGFyc2VEYXRhJ10sIGRhdGFMaXN0KTtcbiAgICBkYXRhTGlzdC5mb3JFYWNoKChndHMsIGkpID0+IHtcbiAgICAgIGNvbnN0IG5hbWUgPSBHVFNMaWIuc2VyaWFsaXplR3RzTWV0YWRhdGEoZ3RzKTtcbiAgICAgIGd0cy52LmZvckVhY2godiA9PiB7XG4gICAgICAgIGNvbnN0IHJlZkRhdGUgPSBtb21lbnQudXRjKHZbMF0gLyAxMDAwKS5zdGFydE9mKCdkYXknKS50b0lTT1N0cmluZygpO1xuICAgICAgICBpZiAoIWRhdGFbcmVmRGF0ZV0pIHtcbiAgICAgICAgICBkYXRhW3JlZkRhdGVdID0gW107XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF2YWx1ZXNbcmVmRGF0ZV0pIHtcbiAgICAgICAgICB2YWx1ZXNbcmVmRGF0ZV0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBkYXRlcy5wdXNoKHZbMF0gLyAxMDAwKTtcbiAgICAgICAgdmFsdWVzW3JlZkRhdGVdLnB1c2godlt2Lmxlbmd0aCAtIDFdKTtcbiAgICAgICAgZGF0YVtyZWZEYXRlXS5wdXNoKHtcbiAgICAgICAgICBuYW1lLFxuICAgICAgICAgIGRhdGU6IHZbMF0gLyAxMDAwLFxuICAgICAgICAgIHZhbHVlOiB2W3YubGVuZ3RoIC0gMV0sXG4gICAgICAgICAgY29sb3I6IENvbG9yTGliLmdldENvbG9yKGksIHRoaXMuX29wdGlvbnMuc2NoZW1lKSxcbiAgICAgICAgICBpZDogaVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIE9iamVjdC5rZXlzKGRhdGEpLmZvckVhY2goKGQ6IHN0cmluZykgPT4ge1xuICAgICAgZGV0YWlscy5wdXNoKHtcbiAgICAgICAgZGF0ZTogbW9tZW50LnV0YyhkKSxcbiAgICAgICAgdG90YWw6IHZhbHVlc1tkXS5yZWR1Y2UocmVkdWNlciksXG4gICAgICAgIGRldGFpbHM6IGRhdGFbZF0sXG4gICAgICAgIHN1bW1hcnk6IFtdXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gZGV0YWlscztcbiAgfVxufVxuIl19