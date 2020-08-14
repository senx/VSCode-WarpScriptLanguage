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
import { Component, ElementRef, HostListener, Input, NgZone, Renderer2, ViewEncapsulation } from '@angular/core';
import { WarpViewComponent } from '../warp-view-component';
import { ChartLib } from '../../utils/chart-lib';
import { GTSLib } from '../../utils/gts.lib';
import { SizeService } from '../../services/resize.service';
import { Logger } from '../../utils/logger';
/**
 *
 */
var WarpViewImageComponent = /** @class */ (function (_super) {
    tslib_1.__extends(WarpViewImageComponent, _super);
    function WarpViewImageComponent(el, renderer, sizeService, ngZone) {
        var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
        _this.el = el;
        _this.renderer = renderer;
        _this.sizeService = sizeService;
        _this.ngZone = ngZone;
        _this.imageTitle = '';
        _this.parentWidth = -1;
        _this.LOG = new Logger(WarpViewImageComponent, _this._debug);
        return _this;
    }
    /**
     * @return {?}
     */
    WarpViewImageComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        this.LOG.debug(['ngAfterViewInit'], this._options);
        this.drawChart();
    };
    /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    WarpViewImageComponent.prototype.update = /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    function (options, refresh) {
        this.drawChart();
    };
    /**
     * @return {?}
     */
    WarpViewImageComponent.prototype.onResize = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (this.el.nativeElement.parentElement.clientWidth !== this.parentWidth || this.parentWidth <= 0) {
            this.parentWidth = this.el.nativeElement.parentElement.clientWidth;
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout((/**
             * @return {?}
             */
            function () {
                if (_this.el.nativeElement.parentElement.clientWidth > 0) {
                    _this.LOG.debug(['onResize'], _this.el.nativeElement.parentElement.clientWidth);
                    _this.drawChart();
                }
                else {
                    _this.onResize();
                }
            }), 150);
        }
    };
    /**
     * @private
     * @return {?}
     */
    WarpViewImageComponent.prototype.drawChart = /**
     * @private
     * @return {?}
     */
    function () {
        if (!this._data || !this._data.data || this._data.data.length === 0) {
            return;
        }
        this.initChart(this.el);
        this.toDisplay = [];
        /** @type {?} */
        var gts = this._data;
        this.LOG.debug(['drawChart', 'gts'], gts);
        if (typeof gts === 'string') {
            try {
                gts = JSON.parse((/** @type {?} */ (gts)));
            }
            catch (error) {
                // empty : it's a base64 string
            }
        }
        if (gts.data && gts.data.length > 0 && GTSLib.isEmbeddedImage(gts.data[0])) {
            this._options = (/** @type {?} */ (ChartLib.mergeDeep(this._options, gts.globalParams || {})));
            this.toDisplay.push(gts.data[0]);
        }
        else if (gts.data && GTSLib.isEmbeddedImage(gts.data)) {
            this.toDisplay.push((/** @type {?} */ (gts.data)));
        }
        this.LOG.debug(['drawChart', 'this.data', 'this.toDisplay'], this.data, this.toDisplay);
        this.loading = false;
        this.chartDraw.emit();
    };
    /**
     * @return {?}
     */
    WarpViewImageComponent.prototype.getStyle = /**
     * @return {?}
     */
    function () {
        this.LOG.debug(['getStyle'], this._options);
        if (!this._options) {
            return {};
        }
        else {
            /** @type {?} */
            var style = { 'background-color': this._options.bgColor || 'transparent', width: this.width, height: 'auto' };
            if (this._options.fontColor) {
                style.color = this._options.fontColor;
            }
            this.LOG.debug(['getStyle', 'style'], style);
            return style;
        }
    };
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    WarpViewImageComponent.prototype.convert = /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    function (data) {
        return [];
    };
    WarpViewImageComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-image',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div class=\"chart-container\" id=\"wrapper\" *ngIf=\"toDisplay\">\n    <div *ngFor=\"let img of toDisplay\" [ngStyle]=\"getStyle()\">\n      <img [src]=\"img\" class=\"responsive\" alt=\"Result\"/>\n    </div>\n  </div>\n  <warpview-spinner *ngIf=\"!toDisplay\" message=\"Parsing data\"></warpview-spinner>\n</div>\n",
                    encapsulation: ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host div{height:var(--warp-view-chart-height);width:var(--warp-view-chart-width)}:host .chart-container{width:var(--warp-view-chart-width,100%);height:var(--warp-view-chart-height,100%);position:relative;overflow:hidden}:host .chart-container div{height:99%!important;width:99%;display:block}:host .chart-container div .responsive{width:99%;height:99%;-o-object-fit:scale-down;object-fit:scale-down}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewImageComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: SizeService },
        { type: NgZone }
    ]; };
    WarpViewImageComponent.propDecorators = {
        imageTitle: [{ type: Input, args: ['imageTitle',] }],
        onResize: [{ type: HostListener, args: ['window:resize',] }]
    };
    return WarpViewImageComponent;
}(WarpViewComponent));
export { WarpViewImageComponent };
if (false) {
    /** @type {?} */
    WarpViewImageComponent.prototype.imageTitle;
    /** @type {?} */
    WarpViewImageComponent.prototype.toDisplay;
    /**
     * @type {?}
     * @private
     */
    WarpViewImageComponent.prototype.resizeTimer;
    /**
     * @type {?}
     * @private
     */
    WarpViewImageComponent.prototype.parentWidth;
    /** @type {?} */
    WarpViewImageComponent.prototype.el;
    /** @type {?} */
    WarpViewImageComponent.prototype.renderer;
    /** @type {?} */
    WarpViewImageComponent.prototype.sizeService;
    /** @type {?} */
    WarpViewImageComponent.prototype.ngZone;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LWltYWdlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzZW54L3dhcnB2aWV3LyIsInNvdXJjZXMiOlsic3JjL2xpYi9lbGVtZW50cy93YXJwLXZpZXctaW1hZ2Uvd2FycC12aWV3LWltYWdlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUFnQixTQUFTLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM5SCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUV6RCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFFL0MsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQzNDLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSwrQkFBK0IsQ0FBQztBQUMxRCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7Ozs7QUFLMUM7SUFNNEMsa0RBQWlCO0lBUTNELGdDQUNTLEVBQWMsRUFDZCxRQUFtQixFQUNuQixXQUF3QixFQUN4QixNQUFjO1FBSnZCLFlBTUUsa0JBQU0sRUFBRSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsTUFBTSxDQUFDLFNBRXpDO1FBUFEsUUFBRSxHQUFGLEVBQUUsQ0FBWTtRQUNkLGNBQVEsR0FBUixRQUFRLENBQVc7UUFDbkIsaUJBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIsWUFBTSxHQUFOLE1BQU0sQ0FBUTtRQVhGLGdCQUFVLEdBQUcsRUFBRSxDQUFDO1FBSzdCLGlCQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFTdkIsS0FBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLE1BQU0sQ0FBQyxzQkFBc0IsRUFBRSxLQUFJLENBQUMsTUFBTSxDQUFDLENB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QUUvQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsU0FBUzs7aUJBQzNDOzs7O2dCQWpCaUMsVUFBVTtnQkFBK0IsU0FBUztnQkFNNUUsV0FBVztnQkFOZ0QsTUFBTTs7OzZCQW1CdEUsS0FBSyxTQUFDLFlBQVk7MkJBMEJsQixZQUFZLFNBQUMsZUFBZTs7SUEyRC9CLDZCQUFDO0NBQUEsQUE1RkQsQ0FNNEMsaUJBQWlCLEdBc0Y1RDtTQXRGWSxzQkFBc0I7OztJQUNqQyw0Q0FBcUM7O0lBRXJDLDJDQUFvQjs7Ozs7SUFFcEIsNkNBQW9COzs7OztJQUNwQiw2Q0FBeUI7O0lBR3ZCLG9DQUFxQjs7SUFDckIsMENBQTBCOztJQUMxQiw2Q0FBK0I7O0lBQy9CLHdDQUFxQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQ29weXJpZ2h0IDIwMjAgIFNlblggUy5BLlMuXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKi9cblxuaW1wb3J0IHtBZnRlclZpZXdJbml0LCBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEhvc3RMaXN0ZW5lciwgSW5wdXQsIE5nWm9uZSwgUmVuZGVyZXIyLCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1dhcnBWaWV3Q29tcG9uZW50fSBmcm9tICcuLi93YXJwLXZpZXctY29tcG9uZW50JztcbmltcG9ydCB7UGFyYW19IGZyb20gJy4uLy4uL21vZGVsL3BhcmFtJztcbmltcG9ydCB7Q2hhcnRMaWJ9IGZyb20gJy4uLy4uL3V0aWxzL2NoYXJ0LWxpYic7XG5pbXBvcnQge0RhdGFNb2RlbH0gZnJvbSAnLi4vLi4vbW9kZWwvZGF0YU1vZGVsJztcbmltcG9ydCB7R1RTTGlifSBmcm9tICcuLi8uLi91dGlscy9ndHMubGliJztcbmltcG9ydCB7U2l6ZVNlcnZpY2V9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3Jlc2l6ZS5zZXJ2aWNlJztcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICcuLi8uLi91dGlscy9sb2dnZXInO1xuXG4vKipcbiAqXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3dhcnB2aWV3LWltYWdlJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3dhcnAtdmlldy1pbWFnZS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3dhcnAtdmlldy1pbWFnZS5jb21wb25lbnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5TaGFkb3dEb21cbn0pXG5leHBvcnQgY2xhc3MgV2FycFZpZXdJbWFnZUNvbXBvbmVudCBleHRlbmRzIFdhcnBWaWV3Q29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCB7XG4gIEBJbnB1dCgnaW1hZ2VUaXRsZScpIGltYWdlVGl0bGUgPSAnJztcblxuICB0b0Rpc3BsYXk6IHN0cmluZ1tdO1xuXG4gIHByaXZhdGUgcmVzaXplVGltZXI7XG4gIHByaXZhdGUgcGFyZW50V2lkdGggPSAtMTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgZWw6IEVsZW1lbnRSZWYsXG4gICAgcHVibGljIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHVibGljIHNpemVTZXJ2aWNlOiBTaXplU2VydmljZSxcbiAgICBwdWJsaWMgbmdab25lOiBOZ1pvbmVcbiAgKSB7XG4gICAgc3VwZXIoZWwsIHJlbmRlcmVyLCBzaXplU2VydmljZSwgbmdab25lKTtcbiAgICB0aGlzLkxPRyA9IG5ldyBMb2dnZXIoV2FycFZpZXdJbWFnZUNvbXBvbmVudCwgdGhpcy5fZGVidWcpO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnbmdBZnRlclZpZXdJbml0J10sIHRoaXMuX29wdGlvbnMpO1xuICAgIHRoaXMuZHJhd0NoYXJ0KCk7XG4gIH1cblxuICB1cGRhdGUob3B0aW9uczogUGFyYW0sIHJlZnJlc2g6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmRyYXdDaGFydCgpO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignd2luZG93OnJlc2l6ZScpXG4gIG9uUmVzaXplKCkge1xuICAgIGlmICh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudC5jbGllbnRXaWR0aCAhPT0gdGhpcy5wYXJlbnRXaWR0aCB8fCB0aGlzLnBhcmVudFdpZHRoIDw9IDApIHtcbiAgICAgIHRoaXMucGFyZW50V2lkdGggPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudC5jbGllbnRXaWR0aDtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnJlc2l6ZVRpbWVyKTtcbiAgICAgIHRoaXMucmVzaXplVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuZWwubmF0aXZlRWxlbWVudC5wYXJlbnRFbGVtZW50LmNsaWVudFdpZHRoID4gMCkge1xuICAgICAgICAgIHRoaXMuTE9HLmRlYnVnKFsnb25SZXNpemUnXSwgdGhpcy5lbC5uYXRpdmVFbGVtZW50LnBhcmVudEVsZW1lbnQuY2xpZW50V2lkdGgpO1xuICAgICAgICAgIHRoaXMuZHJhd0NoYXJ0KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5vblJlc2l6ZSgpO1xuICAgICAgICB9XG4gICAgICB9LCAxNTApO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZHJhd0NoYXJ0KCkge1xuICAgIGlmICghdGhpcy5fZGF0YSB8fCAhdGhpcy5fZGF0YS5kYXRhIHx8IHRoaXMuX2RhdGEuZGF0YS5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5pbml0Q2hhcnQodGhpcy5lbCk7XG4gICAgdGhpcy50b0Rpc3BsYXkgPSBbXTtcbiAgICBsZXQgZ3RzOiBEYXRhTW9kZWwgPSB0aGlzLl9kYXRhO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZHJhd0NoYXJ0JywgJ2d0cyddLCBndHMpO1xuICAgIGlmICh0eXBlb2YgZ3RzID09PSAnc3RyaW5nJykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZ3RzID0gSlNPTi5wYXJzZShndHMgYXMgc3RyaW5nKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIC8vIGVtcHR5IDogaXQncyBhIGJhc2U2NCBzdHJpbmdcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGd0cy5kYXRhICYmIGd0cy5kYXRhLmxlbmd0aCA+IDAgJiYgR1RTTGliLmlzRW1iZWRkZWRJbWFnZShndHMuZGF0YVswXSkpIHtcbiAgICAgIHRoaXMuX29wdGlvbnMgPSBDaGFydExpYi5tZXJnZURlZXAodGhpcy5fb3B0aW9ucywgZ3RzLmdsb2JhbFBhcmFtcyB8fCB7fSkgYXMgUGFyYW07XG4gICAgICB0aGlzLnRvRGlzcGxheS5wdXNoKGd0cy5kYXRhWzBdKTtcbiAgICB9IGVsc2UgaWYgKGd0cy5kYXRhICYmIEdUU0xpYi5pc0VtYmVkZGVkSW1hZ2UoZ3RzLmRhdGEpKSB7XG4gICAgICB0aGlzLnRvRGlzcGxheS5wdXNoKGd0cy5kYXRhIGFzIHN0cmluZyk7XG4gICAgfVxuICAgIHRoaXMuTE9HLmRlYnVnKFsnZHJhd0NoYXJ0JywgJ3RoaXMuZGF0YScsICd0aGlzLnRvRGlzcGxheSddLCB0aGlzLmRhdGEsIHRoaXMudG9EaXNwbGF5KTtcbiAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLmNoYXJ0RHJhdy5lbWl0KCk7XG4gIH1cblxuICBnZXRTdHlsZSgpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2dldFN0eWxlJ10sIHRoaXMuX29wdGlvbnMpO1xuICAgIGlmICghdGhpcy5fb3B0aW9ucykge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBzdHlsZTogYW55ID0geydiYWNrZ3JvdW5kLWNvbG9yJzogdGhpcy5fb3B0aW9ucy5iZ0NvbG9yIHx8ICd0cmFuc3BhcmVudCcsIHdpZHRoOiB0aGlzLndpZHRoLCBoZWlnaHQ6ICdhdXRvJ307XG4gICAgICBpZiAodGhpcy5fb3B0aW9ucy5mb250Q29sb3IpIHtcbiAgICAgICAgc3R5bGUuY29sb3IgPSB0aGlzLl9vcHRpb25zLmZvbnRDb2xvcjtcbiAgICAgIH1cbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsnZ2V0U3R5bGUnLCAnc3R5bGUnXSwgc3R5bGUpO1xuICAgICAgcmV0dXJuIHN0eWxlO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBjb252ZXJ0KGRhdGE6IERhdGFNb2RlbCk6IGFueVtdIHtcbiAgICByZXR1cm4gW107XG4gIH1cbn1cbiJdfQ==