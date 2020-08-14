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
var WarpViewDisplayComponent = /** @class */ (function (_super) {
    tslib_1.__extends(WarpViewDisplayComponent, _super);
    function WarpViewDisplayComponent(el, renderer, sizeService, ngZone) {
        var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
        _this.el = el;
        _this.renderer = renderer;
        _this.sizeService = sizeService;
        _this.ngZone = ngZone;
        _this.toDisplay = '';
        _this.defOptions = (/** @type {?} */ ({
            timeMode: 'custom'
        }));
        _this.LOG = new Logger(WarpViewDisplayComponent, _this._debug);
        return _this;
    }
    /**
     * @return {?}
     */
    WarpViewDisplayComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.drawChart();
    };
    /**
     * @return {?}
     */
    WarpViewDisplayComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        if (this.timer) {
            clearInterval(this.timer);
        }
    };
    /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    WarpViewDisplayComponent.prototype.update = /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    function (options, refresh) {
        this.drawChart();
        this.flexFont();
    };
    /**
     * @private
     * @return {?}
     */
    WarpViewDisplayComponent.prototype.drawChart = /**
     * @private
     * @return {?}
     */
    function () {
        this.LOG.debug(['drawChart'], this._options, this.defOptions);
        this.initChart(this.el);
        this._options = ChartLib.mergeDeep(this.defOptions, this._options);
        this.LOG.debug(['drawChart', 'afterInit'], this._options, this.defOptions, this.height);
        this.LOG.debug(['drawChart'], this._data, this.toDisplay);
        this.flexFont();
        this.chartDraw.emit();
    };
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    WarpViewDisplayComponent.prototype.convert = /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    function (data) {
        this._options = ChartLib.mergeDeep(this.defOptions, this._options);
        this.LOG.debug(['convert'], this._options.timeMode);
        /** @type {?} */
        var display;
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
                var start = moment.tz(parseInt(display, 10) / this.divider, this._options.timeZone);
                this.displayDuration(start);
                break;
            case 'custom':
            case 'timestamp':
                this.toDisplay = display;
        }
        return [];
    };
    /**
     * @return {?}
     */
    WarpViewDisplayComponent.prototype.getStyle = /**
     * @return {?}
     */
    function () {
        if (!this._options) {
            return {};
        }
        else {
            /** @type {?} */
            var style = { 'background-color': this._options.bgColor || 'transparent' };
            if (this._options.fontColor) {
                style.color = this._options.fontColor;
            }
            return style;
        }
    };
    /**
     * @return {?}
     */
    WarpViewDisplayComponent.prototype.flexFont = /**
     * @return {?}
     */
    function () {
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
    };
    /**
     * @private
     * @param {?} start
     * @return {?}
     */
    WarpViewDisplayComponent.prototype.displayDuration = /**
     * @private
     * @param {?} start
     * @return {?}
     */
    function (start) {
        var _this = this;
        this.timer = setInterval((/**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var now = moment();
            _this.toDisplay = moment.duration(start.diff(now)).humanize(true);
        }), 1000);
    };
    WarpViewDisplayComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-display',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"chart-container\" (resized)=\"flexFont()\" [ngStyle]=\"getStyle()\">\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <div class=\"value\" #wrapper [hidden]=\"loading\">\n    <span [innerHTML]=\"toDisplay\"></span><small>{{unit}}</small>\n  </div>\n</div>\n",
                    encapsulation: ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host{width:var(--warp-view-chart-width,100%);height:var(--warp-view-chart-height,100%);color:var(--warp-view-font-color);position:relative;overflow:hidden}:host .chart-container{text-align:center;height:calc(100% - 20px);width:100%;justify-items:stretch;min-height:100%;-webkit-box-pack:center;justify-content:center;display:-webkit-box;display:flex;overflow:hidden}:host .chart-container .value{padding:10px;text-align:center;white-space:nowrap;overflow:hidden;display:inline-block;vertical-align:middle;-ms-grid-row-align:center;align-self:center}:host .chart-container .value span{min-height:100%}:host .chart-container .value small{font-size:.5em}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewDisplayComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: SizeService },
        { type: NgZone }
    ]; };
    WarpViewDisplayComponent.propDecorators = {
        wrapper: [{ type: ViewChild, args: ['wrapper', { static: true },] }]
    };
    return WarpViewDisplayComponent;
}(WarpViewComponent));
export { WarpViewDisplayComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LWRpc3BsYXkuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHNlbngvd2FycHZpZXcvIiwic291cmNlcyI6WyJzcmMvbGliL2VsZW1lbnRzL3dhcnAtdmlldy1kaXNwbGF5L3dhcnAtdmlldy1kaXNwbGF5LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFxQixTQUFTLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3hILE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBRXpELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFFM0MsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBQzFELE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUMxQyxPQUFPLEtBQXNCLE1BQU0sT0FBTyxDQUFDO0FBQzNDLE9BQU8sTUFBTSxNQUFNLGlCQUFpQixDQUFDOzs7O0FBS3JDO0lBTThDLG9EQUFpQjtJQVU3RCxrQ0FDUyxFQUFjLEVBQ2QsUUFBbUIsRUFDbkIsV0FBd0IsRUFDeEIsTUFBYztRQUp2QixZQU1FLGtCQUFNLEVBQUUsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLE1BQU0sQ0FBQyxTQUV6QztRQVBRLFFBQUUsR0FBRixFQUFFLENBQVk7UUFDZCxjQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ25CLGlCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLFlBQU0sR0FBTixNQUFNLENBQVE7UUFadkIsZUFBUyxHQUFHLEVBQUUsQ0FBQztRQUNmLGdCQUFVLEdBQUcsbUJBQUE7WUFDWCxRQUFRLEVBQUUsUUFBUTtTQUNu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Q0FFVzs7Ozs7SUFFWCwyQ0FBK0I7Ozs7O0lBQy9CLHlDQUFjOztJQUdaLHNDQUFxQjs7SUFDckIsNENBQTBCOztJQUMxQiwrQ0FBK0I7O0lBQy9CLDBDQUFxQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQ29weXJpZ2h0IDIwMjAgIFNlblggUy5BLlMuXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnQsIEVsZW1lbnRSZWYsIE5nWm9uZSwgT25EZXN0cm95LCBPbkluaXQsIFJlbmRlcmVyMiwgVmlld0NoaWxkLCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1dhcnBWaWV3Q29tcG9uZW50fSBmcm9tICcuLi93YXJwLXZpZXctY29tcG9uZW50JztcbmltcG9ydCB7UGFyYW19IGZyb20gJy4uLy4uL21vZGVsL3BhcmFtJztcbmltcG9ydCB7Q2hhcnRMaWJ9IGZyb20gJy4uLy4uL3V0aWxzL2NoYXJ0LWxpYic7XG5pbXBvcnQge0dUU0xpYn0gZnJvbSAnLi4vLi4vdXRpbHMvZ3RzLmxpYic7XG5pbXBvcnQge0RhdGFNb2RlbH0gZnJvbSAnLi4vLi4vbW9kZWwvZGF0YU1vZGVsJztcbmltcG9ydCB7U2l6ZVNlcnZpY2V9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3Jlc2l6ZS5zZXJ2aWNlJztcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICcuLi8uLi91dGlscy9sb2dnZXInO1xuaW1wb3J0IGZpdHR5LCB7Rml0dHlJbnN0YW5jZX0gZnJvbSAnZml0dHknO1xuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQtdGltZXpvbmUnO1xuXG4vKipcbiAqXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3dhcnB2aWV3LWRpc3BsYXknLFxuICB0ZW1wbGF0ZVVybDogJy4vd2FycC12aWV3LWRpc3BsYXkuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi93YXJwLXZpZXctZGlzcGxheS5jb21wb25lbnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5TaGFkb3dEb21cbn0pXG5leHBvcnQgY2xhc3MgV2FycFZpZXdEaXNwbGF5Q29tcG9uZW50IGV4dGVuZHMgV2FycFZpZXdDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIEBWaWV3Q2hpbGQoJ3dyYXBwZXInLCB7c3RhdGljOiB0cnVlfSkgd3JhcHBlcjogRWxlbWVudFJlZjtcbiAgdG9EaXNwbGF5ID0gJyc7XG4gIGRlZk9wdGlvbnMgPSB7XG4gICAgdGltZU1vZGU6ICdjdXN0b20nXG4gIH0gYXMgUGFyYW07XG5cbiAgcHJpdmF0ZSBmaXR0aWVzOiBGaXR0eUluc3RhbmNlO1xuICBwcml2YXRlIHRpbWVyO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBlbDogRWxlbWVudFJlZixcbiAgICBwdWJsaWMgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwdWJsaWMgc2l6ZVNlcnZpY2U6IFNpemVTZXJ2aWNlLFxuICAgIHB1YmxpYyBuZ1pvbmU6IE5nWm9uZVxuICApIHtcbiAgICBzdXBlcihlbCwgcmVuZGVyZXIsIHNpemVTZXJ2aWNlLCBuZ1pvbmUpO1xuICAgIHRoaXMuTE9HID0gbmV3IExvZ2dlcihXYXJwVmlld0Rpc3BsYXlDb21wb25lbnQsIHRoaXMuX2RlYnVnKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuZHJhd0NoYXJ0KCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy50aW1lcikge1xuICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVyKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGUob3B0aW9uczogUGFyYW0sIHJlZnJlc2g6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmRyYXdDaGFydCgpO1xuICAgIHRoaXMuZmxleEZvbnQoKTtcbiAgfVxuXG4gIHByaXZhdGUgZHJhd0NoYXJ0KCkge1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZHJhd0NoYXJ0J10sIHRoaXMuX29wdGlvbnMsIHRoaXMuZGVmT3B0aW9ucyk7XG4gICAgdGhpcy5pbml0Q2hhcnQodGhpcy5lbCk7XG4gICAgdGhpcy5fb3B0aW9ucyA9IENoYXJ0TGliLm1lcmdlRGVlcCh0aGlzLmRlZk9wdGlvbnMsIHRoaXMuX29wdGlvbnMpO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZHJhd0NoYXJ0JywgJ2FmdGVySW5pdCddLCB0aGlzLl9vcHRpb25zLCB0aGlzLmRlZk9wdGlvbnMsIHRoaXMuaGVpZ2h0KTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RyYXdDaGFydCddLCB0aGlzLl9kYXRhLCB0aGlzLnRvRGlzcGxheSk7XG4gICAgdGhpcy5mbGV4Rm9udCgpO1xuICAgIHRoaXMuY2hhcnREcmF3LmVtaXQoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBjb252ZXJ0KGRhdGE6IERhdGFNb2RlbCk6IGFueVtdIHtcbiAgICB0aGlzLl9vcHRpb25zID0gQ2hhcnRMaWIubWVyZ2VEZWVwKHRoaXMuZGVmT3B0aW9ucywgdGhpcy5fb3B0aW9ucyk7XG4gICAgdGhpcy5MT0cuZGVidWcoWydjb252ZXJ0J10sIHRoaXMuX29wdGlvbnMudGltZU1vZGUpO1xuICAgIGxldCBkaXNwbGF5OiBzdHJpbmc7XG4gICAgaWYgKHRoaXMuX2RhdGEuZGF0YSkge1xuICAgICAgZGlzcGxheSA9IEdUU0xpYi5pc0FycmF5KHRoaXMuX2RhdGEuZGF0YSkgPyB0aGlzLl9kYXRhLmRhdGFbMF0gOiB0aGlzLl9kYXRhLmRhdGE7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRpc3BsYXkgPSBHVFNMaWIuaXNBcnJheSh0aGlzLl9kYXRhKSA/IHRoaXMuX2RhdGFbMF0gOiB0aGlzLl9kYXRhO1xuICAgIH1cbiAgICBzd2l0Y2ggKHRoaXMuX29wdGlvbnMudGltZU1vZGUpIHtcbiAgICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgICB0aGlzLnRvRGlzcGxheSA9IG1vbWVudC50eihwYXJzZUludChkaXNwbGF5LCAxMCkgLyB0aGlzLmRpdmlkZXIsIHRoaXMuX29wdGlvbnMudGltZVpvbmUpLnRvSVNPU3RyaW5nKHRydWUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2R1cmF0aW9uJzpcbiAgICAgICAgY29uc3Qgc3RhcnQgPSBtb21lbnQudHoocGFyc2VJbnQoZGlzcGxheSwgMTApIC8gdGhpcy5kaXZpZGVyLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5RHVyYXRpb24oc3RhcnQpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2N1c3RvbSc6XG4gICAgICBjYXNlICd0aW1lc3RhbXAnOlxuICAgICAgICB0aGlzLnRvRGlzcGxheSA9IGRpc3BsYXk7XG4gICAgfVxuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGdldFN0eWxlKCkge1xuICAgIGlmICghdGhpcy5fb3B0aW9ucykge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBzdHlsZTogYW55ID0geydiYWNrZ3JvdW5kLWNvbG9yJzogdGhpcy5fb3B0aW9ucy5iZ0NvbG9yIHx8ICd0cmFuc3BhcmVudCd9O1xuICAgICAgaWYgKHRoaXMuX29wdGlvbnMuZm9udENvbG9yKSB7XG4gICAgICAgIHN0eWxlLmNvbG9yID0gdGhpcy5fb3B0aW9ucy5mb250Q29sb3I7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3R5bGU7XG4gICAgfVxuICB9XG5cbiAgZmxleEZvbnQoKSB7XG4gICAgaWYgKCEhdGhpcy53cmFwcGVyKSB7XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2ZsZXhGb250J10sIHRoaXMuaGVpZ2h0KTtcbiAgICAgIGlmICh0aGlzLmZpdHRpZXMpIHtcbiAgICAgICAgdGhpcy5maXR0aWVzLnVuc3Vic2NyaWJlKCk7XG4gICAgICB9XG4gICAgICB0aGlzLmZpdHRpZXMgPSBmaXR0eSh0aGlzLndyYXBwZXIubmF0aXZlRWxlbWVudCwge1xuICAgICAgICBtYXhTaXplOiAodGhpcy5lbC5uYXRpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50KS5wYXJlbnRFbGVtZW50LmNsaWVudEhlaWdodCAqIDAuODAsXG4gICAgICAgIG1pblNpemU6IDE0XG4gICAgICB9KTtcbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsnZmxleEZvbnQnXSwgJ29rJywgKHRoaXMuZWwubmF0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudCkucGFyZW50RWxlbWVudC5jbGllbnRIZWlnaHQpO1xuICAgICAgdGhpcy5maXR0aWVzLmZpdCgpO1xuICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBkaXNwbGF5RHVyYXRpb24oc3RhcnQ6IGFueSkge1xuICAgIHRoaXMudGltZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICBjb25zdCBub3cgPSBtb21lbnQoKTtcbiAgICAgIHRoaXMudG9EaXNwbGF5ID0gbW9tZW50LmR1cmF0aW9uKHN0YXJ0LmRpZmYobm93KSkuaHVtYW5pemUodHJ1ZSk7XG4gICAgfSwgMTAwMCk7XG4gIH1cbn1cbiJdfQ==