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
import { Component, ElementRef, Input, NgZone, Renderer2, ViewEncapsulation } from '@angular/core';
import { WarpViewComponent } from '../warp-view-component';
import { GTSLib } from '../../utils/gts.lib';
import { SizeService } from '../../services/resize.service';
import { Logger } from '../../utils/logger';
import moment from 'moment-timezone';
var WarpViewDatagridComponent = /** @class */ (function (_super) {
    tslib_1.__extends(WarpViewDatagridComponent, _super);
    function WarpViewDatagridComponent(el, renderer, sizeService, ngZone) {
        var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
        _this.el = el;
        _this.renderer = renderer;
        _this.sizeService = sizeService;
        _this.ngZone = ngZone;
        _this.elemsCount = 15;
        // tslint:disable-next-line:variable-name
        _this._tabularData = [];
        _this.LOG = new Logger(WarpViewDatagridComponent, _this._debug);
        return _this;
    }
    /**
     * @return {?}
     */
    WarpViewDatagridComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.drawChart();
    };
    /**
     * @param {?} options
     * @return {?}
     */
    WarpViewDatagridComponent.prototype.update = /**
     * @param {?} options
     * @return {?}
     */
    function (options) {
        this.drawChart();
    };
    /**
     * @private
     * @return {?}
     */
    WarpViewDatagridComponent.prototype.drawChart = /**
     * @private
     * @return {?}
     */
    function () {
        this.loading = false;
        this.chartDraw.emit();
        if (!this.initChart(this.el)) {
            return;
        }
    };
    /**
     * @private
     * @param {?} i
     * @param {?} j
     * @param {?} key
     * @param {?} def
     * @return {?}
     */
    WarpViewDatagridComponent.prototype.getHeaderParam = /**
     * @private
     * @param {?} i
     * @param {?} j
     * @param {?} key
     * @param {?} def
     * @return {?}
     */
    function (i, j, key, def) {
        return this._data.params && this._data.params[i] && this._data.params[i][key] && this._data.params[i][key][j]
            ? this._data.params[i][key][j]
            : this._data.globalParams && this._data.globalParams[key] && this._data.globalParams[key][j]
                ? this._data.globalParams[key][j]
                : def;
    };
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    WarpViewDatagridComponent.prototype.convert = /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    function (data) {
        if (GTSLib.isArray(data.data)) {
            /** @type {?} */
            var dataList = GTSLib.flatDeep((/** @type {?} */ (this._data.data)));
            this.LOG.debug(['convert', 'isArray'], dataList);
            if (data.data.length > 0 && GTSLib.isGts(dataList[0])) {
                this._tabularData = this.parseData(dataList);
            }
            else {
                this._tabularData = this.parseCustomData(dataList);
            }
        }
        else {
            this._tabularData = this.parseCustomData([(/** @type {?} */ (data.data))]);
        }
        return [];
    };
    /**
     * @private
     * @param {?} data
     * @return {?}
     */
    WarpViewDatagridComponent.prototype.parseCustomData = /**
     * @private
     * @param {?} data
     * @return {?}
     */
    function (data) {
        /** @type {?} */
        var flatData = [];
        data.forEach((/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            /** @type {?} */
            var dataSet = {
                name: d.title || '',
                values: d.rows,
                headers: d.columns,
            };
            flatData.push(dataSet);
        }));
        this.LOG.debug(['parseCustomData', 'flatData'], flatData);
        return flatData;
    };
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    WarpViewDatagridComponent.prototype.parseData = /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    function (data) {
        var _this = this;
        /** @type {?} */
        var flatData = [];
        this.LOG.debug(['parseData'], data);
        data.forEach((/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        function (d, i) {
            /** @type {?} */
            var dataSet = {
                name: '',
                values: [],
                headers: []
            };
            if (GTSLib.isGts(d)) {
                _this.LOG.debug(['parseData', 'isGts'], d);
                dataSet.name = GTSLib.serializeGtsMetadata(d);
                dataSet.values = d.v.map((/**
                 * @param {?} v
                 * @return {?}
                 */
                function (v) { return [_this.formatDate(v[0])].concat(v.slice(1, v.length)); }));
            }
            else {
                _this.LOG.debug(['parseData', 'is not a Gts'], d);
                dataSet.values = GTSLib.isArray(d) ? d : [d];
            }
            dataSet.headers = [_this.getHeaderParam(i, 0, 'headers', 'Date')];
            if (d.v && d.v.length > 0 && d.v[0].length > 2) {
                dataSet.headers.push(_this.getHeaderParam(i, 1, 'headers', 'Latitude'));
            }
            if (d.v && d.v.length > 0 && d.v[0].length > 3) {
                dataSet.headers.push(_this.getHeaderParam(i, 2, 'headers', 'Longitude'));
            }
            if (d.v && d.v.length > 0 && d.v[0].length > 4) {
                dataSet.headers.push(_this.getHeaderParam(i, 3, 'headers', 'Elevation'));
            }
            if (d.v && d.v.length > 0) {
                dataSet.headers.push(_this.getHeaderParam(i, d.v[0].length - 1, 'headers', 'Value'));
            }
            if (dataSet.values.length > 0) {
                flatData.push(dataSet);
            }
        }));
        this.LOG.debug(['parseData', 'flatData'], flatData, this._options.timeMode);
        return flatData;
    };
    /**
     * @param {?} date
     * @return {?}
     */
    WarpViewDatagridComponent.prototype.formatDate = /**
     * @param {?} date
     * @return {?}
     */
    function (date) {
        return this._options.timeMode === 'date' ? moment.tz(date / this.divider, this._options.timeZone).toISOString() : date.toString();
    };
    WarpViewDatagridComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-datagrid',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"wrapper\" style=\"overflow: auto; height: 100%\">\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-paginable\n      *ngFor=\"let data of _tabularData\"\n      [data]=\"data\" [options]=\"_options\"\n      [debug]=\"debug\"></warpview-paginable>\n  </div>\n</div>\n",
                    encapsulation: ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewDatagridComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: SizeService },
        { type: NgZone }
    ]; };
    WarpViewDatagridComponent.propDecorators = {
        elemsCount: [{ type: Input, args: ['elemsCount',] }]
    };
    return WarpViewDatagridComponent;
}(WarpViewComponent));
export { WarpViewDatagridComponent };
if (false) {
    /** @type {?} */
    WarpViewDatagridComponent.prototype.elemsCount;
    /** @type {?} */
    WarpViewDatagridComponent.prototype._tabularData;
    /** @type {?} */
    WarpViewDatagridComponent.prototype.el;
    /** @type {?} */
    WarpViewDatagridComponent.prototype.renderer;
    /** @type {?} */
    WarpViewDatagridComponent.prototype.sizeService;
    /** @type {?} */
    WarpViewDatagridComponent.prototype.ngZone;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LWRhdGFncmlkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzZW54L3dhcnB2aWV3LyIsInNvdXJjZXMiOlsic3JjL2xpYi9lbGVtZW50cy93YXJwLXZpZXctZGF0YWdyaWQvd2FycC12aWV3LWRhdGFncmlkLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBVSxTQUFTLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekcsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFFekQsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBRTNDLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSwrQkFBK0IsQ0FBQztBQUMxRCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDMUMsT0FBTyxNQUFNLE1BQU0saUJBQWlCLENBQUM7QUFFckM7SUFNK0MscURBQWlCO0lBUTlELG1DQUNTLEVBQWMsRUFDZCxRQUFtQixFQUNuQixXQUF3QixFQUN4QixNQUFjO1FBSnZCLFlBTUUsa0JBQU0sRUFBRSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsTUFBTSxDQUFDLFNBRXpDO1FBUFEsUUFBRSxHQUFGLEVBQUUsQ0FBWTtRQUNkLGNBQVEsR0FBUixRQUFRLENBQVc7UUFDbkIsaUJBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIsWUFBTSxHQUFOLE1BQU0sQ0FBUTtRQVRGLGdCQUFVLEdBQUcsRUFBRSxDQUFDOztRQUdyQyxrQkFBWSxHQUF5RCxFQUFFLENBQUM7UUFTdEUsS0FBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLE1BQU0sQ0FBQyx5QkFBeUIsRUFBRSxLQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7O0lBQ2hFLENBQUM7Ozs7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bEQsYUFBYSxFQUFFLGlCQUFpQixDQUFDLFNBQVM7O2lCQUMzQzs7OztnQkFka0IsVUFBVTtnQkFBeUIsU0FBUztnQkFLdkQsV0FBVztnQkFMbUIsTUFBTTs7OzZCQWtCekMsS0FBSyxTQUFDLFlBQVk7O0lBNkdyQixnQ0FBQztDQUFBLEFBdEhELENBTStDLGlCQUFpQixHQWdIL0Q7U0FoSFkseUJBQXlCOzs7SUFHcEMsK0NBQXFDOztJQUdyQyxpREFBd0U7O0lBR3RFLHVDQUFxQjs7SUFDckIsNkNBQTBCOztJQUMxQixnREFBK0I7O0lBQy9CLDJDQUFxQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQ29weXJpZ2h0IDIwMjAgIFNlblggUy5BLlMuXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnQsIEVsZW1lbnRSZWYsIElucHV0LCBOZ1pvbmUsIE9uSW5pdCwgUmVuZGVyZXIyLCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1dhcnBWaWV3Q29tcG9uZW50fSBmcm9tICcuLi93YXJwLXZpZXctY29tcG9uZW50JztcbmltcG9ydCB7UGFyYW19IGZyb20gJy4uLy4uL21vZGVsL3BhcmFtJztcbmltcG9ydCB7R1RTTGlifSBmcm9tICcuLi8uLi91dGlscy9ndHMubGliJztcbmltcG9ydCB7RGF0YU1vZGVsfSBmcm9tICcuLi8uLi9tb2RlbC9kYXRhTW9kZWwnO1xuaW1wb3J0IHtTaXplU2VydmljZX0gZnJvbSAnLi4vLi4vc2VydmljZXMvcmVzaXplLnNlcnZpY2UnO1xuaW1wb3J0IHtMb2dnZXJ9IGZyb20gJy4uLy4uL3V0aWxzL2xvZ2dlcic7XG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudC10aW1lem9uZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3dhcnB2aWV3LWRhdGFncmlkJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3dhcnAtdmlldy1kYXRhZ3JpZC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3dhcnAtdmlldy1kYXRhZ3JpZC5jb21wb25lbnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5TaGFkb3dEb21cbn0pXG5leHBvcnQgY2xhc3MgV2FycFZpZXdEYXRhZ3JpZENvbXBvbmVudCBleHRlbmRzIFdhcnBWaWV3Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuXG4gIEBJbnB1dCgnZWxlbXNDb3VudCcpIGVsZW1zQ291bnQgPSAxNTtcblxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZVxuICBfdGFidWxhckRhdGE6IHsgbmFtZTogc3RyaW5nLCB2YWx1ZXM6IGFueVtdLCBoZWFkZXJzOiBzdHJpbmdbXSB9W10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgZWw6IEVsZW1lbnRSZWYsXG4gICAgcHVibGljIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHVibGljIHNpemVTZXJ2aWNlOiBTaXplU2VydmljZSxcbiAgICBwdWJsaWMgbmdab25lOiBOZ1pvbmVcbiAgKSB7XG4gICAgc3VwZXIoZWwsIHJlbmRlcmVyLCBzaXplU2VydmljZSwgbmdab25lKTtcbiAgICB0aGlzLkxPRyA9IG5ldyBMb2dnZXIoV2FycFZpZXdEYXRhZ3JpZENvbXBvbmVudCwgdGhpcy5fZGVidWcpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5kcmF3Q2hhcnQoKTtcbiAgfVxuXG4gIHVwZGF0ZShvcHRpb25zOiBQYXJhbSk6IHZvaWQge1xuICAgIHRoaXMuZHJhd0NoYXJ0KCk7XG4gIH1cblxuICBwcml2YXRlIGRyYXdDaGFydCgpIHtcbiAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLmNoYXJ0RHJhdy5lbWl0KCk7XG4gICAgaWYgKCF0aGlzLmluaXRDaGFydCh0aGlzLmVsKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0SGVhZGVyUGFyYW0oaTogbnVtYmVyLCBqOiBudW1iZXIsIGtleTogc3RyaW5nLCBkZWY6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGEucGFyYW1zICYmIHRoaXMuX2RhdGEucGFyYW1zW2ldICYmIHRoaXMuX2RhdGEucGFyYW1zW2ldW2tleV0gJiYgdGhpcy5fZGF0YS5wYXJhbXNbaV1ba2V5XVtqXVxuICAgICAgPyB0aGlzLl9kYXRhLnBhcmFtc1tpXVtrZXldW2pdXG4gICAgICA6IHRoaXMuX2RhdGEuZ2xvYmFsUGFyYW1zICYmIHRoaXMuX2RhdGEuZ2xvYmFsUGFyYW1zW2tleV0gJiYgdGhpcy5fZGF0YS5nbG9iYWxQYXJhbXNba2V5XVtqXVxuICAgICAgICA/IHRoaXMuX2RhdGEuZ2xvYmFsUGFyYW1zW2tleV1bal1cbiAgICAgICAgOiBkZWY7XG4gIH1cblxuICBwcm90ZWN0ZWQgY29udmVydChkYXRhOiBEYXRhTW9kZWwpOiBhbnlbXSB7XG4gICAgaWYgKEdUU0xpYi5pc0FycmF5KGRhdGEuZGF0YSkpIHtcbiAgICAgIGNvbnN0IGRhdGFMaXN0ID0gR1RTTGliLmZsYXREZWVwKHRoaXMuX2RhdGEuZGF0YSBhcyBhbnlbXSk7XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2NvbnZlcnQnLCAnaXNBcnJheSddLCBkYXRhTGlzdCk7XG4gICAgICBpZiAoZGF0YS5kYXRhLmxlbmd0aCA+IDAgJiYgR1RTTGliLmlzR3RzKGRhdGFMaXN0WzBdKSkge1xuICAgICAgICB0aGlzLl90YWJ1bGFyRGF0YSA9IHRoaXMucGFyc2VEYXRhKGRhdGFMaXN0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3RhYnVsYXJEYXRhID0gdGhpcy5wYXJzZUN1c3RvbURhdGEoZGF0YUxpc3QpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl90YWJ1bGFyRGF0YSA9IHRoaXMucGFyc2VDdXN0b21EYXRhKFtkYXRhLmRhdGEgYXMgYW55XSk7XG4gICAgfVxuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIHByaXZhdGUgcGFyc2VDdXN0b21EYXRhKGRhdGE6IGFueVtdKTogeyBuYW1lOiBzdHJpbmcsIHZhbHVlczogYW55W10sIGhlYWRlcnM6IHN0cmluZ1tdIH1bXSB7XG4gICAgY29uc3QgZmxhdERhdGE6IHsgbmFtZTogc3RyaW5nLCB2YWx1ZXM6IGFueVtdLCBoZWFkZXJzOiBzdHJpbmdbXSB9W10gPSBbXTtcbiAgICBkYXRhLmZvckVhY2goZCA9PiB7XG4gICAgICBjb25zdCBkYXRhU2V0OiB7IG5hbWU6IHN0cmluZywgdmFsdWVzOiBhbnlbXSwgaGVhZGVyczogc3RyaW5nW10gfSA9IHtcbiAgICAgICAgbmFtZTogZC50aXRsZSB8fCAnJyxcbiAgICAgICAgdmFsdWVzOiBkLnJvd3MsXG4gICAgICAgIGhlYWRlcnM6IGQuY29sdW1ucyxcbiAgICAgIH07XG4gICAgICBmbGF0RGF0YS5wdXNoKGRhdGFTZXQpO1xuICAgIH0pO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsncGFyc2VDdXN0b21EYXRhJywgJ2ZsYXREYXRhJ10sIGZsYXREYXRhKTtcbiAgICByZXR1cm4gZmxhdERhdGE7XG4gIH1cblxuICBwcm90ZWN0ZWQgcGFyc2VEYXRhKGRhdGE6IGFueVtdKTogeyBuYW1lOiBzdHJpbmcsIHZhbHVlczogYW55W10sIGhlYWRlcnM6IHN0cmluZ1tdIH1bXSB7XG4gICAgY29uc3QgZmxhdERhdGE6IHsgbmFtZTogc3RyaW5nLCB2YWx1ZXM6IGFueVtdLCBoZWFkZXJzOiBzdHJpbmdbXSB9W10gPSBbXTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3BhcnNlRGF0YSddLCBkYXRhKTtcbiAgICBkYXRhLmZvckVhY2goKGQsIGkpID0+IHtcbiAgICAgIGNvbnN0IGRhdGFTZXQ6IHsgbmFtZTogc3RyaW5nLCB2YWx1ZXM6IGFueVtdLCBoZWFkZXJzOiBzdHJpbmdbXSB9ID0ge1xuICAgICAgICBuYW1lOiAnJyxcbiAgICAgICAgdmFsdWVzOiBbXSxcbiAgICAgICAgaGVhZGVyczogW11cbiAgICAgIH07XG4gICAgICBpZiAoR1RTTGliLmlzR3RzKGQpKSB7XG4gICAgICAgIHRoaXMuTE9HLmRlYnVnKFsncGFyc2VEYXRhJywgJ2lzR3RzJ10sIGQpO1xuICAgICAgICBkYXRhU2V0Lm5hbWUgPSBHVFNMaWIuc2VyaWFsaXplR3RzTWV0YWRhdGEoZCk7XG4gICAgICAgIGRhdGFTZXQudmFsdWVzID0gZC52Lm1hcCh2ID0+IFt0aGlzLmZvcm1hdERhdGUodlswXSldLmNvbmNhdCh2LnNsaWNlKDEsIHYubGVuZ3RoKSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5MT0cuZGVidWcoWydwYXJzZURhdGEnLCAnaXMgbm90IGEgR3RzJ10sIGQpO1xuICAgICAgICBkYXRhU2V0LnZhbHVlcyA9IEdUU0xpYi5pc0FycmF5KGQpID8gZCA6IFtkXTtcbiAgICAgIH1cbiAgICAgIGRhdGFTZXQuaGVhZGVycyA9IFt0aGlzLmdldEhlYWRlclBhcmFtKGksIDAsICdoZWFkZXJzJywgJ0RhdGUnKV07XG4gICAgICBpZiAoZC52ICYmIGQudi5sZW5ndGggPiAwICYmIGQudlswXS5sZW5ndGggPiAyKSB7XG4gICAgICAgIGRhdGFTZXQuaGVhZGVycy5wdXNoKHRoaXMuZ2V0SGVhZGVyUGFyYW0oaSwgMSwgJ2hlYWRlcnMnLCAnTGF0aXR1ZGUnKSk7XG4gICAgICB9XG4gICAgICBpZiAoZC52ICYmIGQudi5sZW5ndGggPiAwICYmIGQudlswXS5sZW5ndGggPiAzKSB7XG4gICAgICAgIGRhdGFTZXQuaGVhZGVycy5wdXNoKHRoaXMuZ2V0SGVhZGVyUGFyYW0oaSwgMiwgJ2hlYWRlcnMnLCAnTG9uZ2l0dWRlJykpO1xuICAgICAgfVxuICAgICAgaWYgKGQudiAmJiBkLnYubGVuZ3RoID4gMCAmJiBkLnZbMF0ubGVuZ3RoID4gNCkge1xuICAgICAgICBkYXRhU2V0LmhlYWRlcnMucHVzaCh0aGlzLmdldEhlYWRlclBhcmFtKGksIDMsICdoZWFkZXJzJywgJ0VsZXZhdGlvbicpKTtcbiAgICAgIH1cbiAgICAgIGlmIChkLnYgJiYgZC52Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgZGF0YVNldC5oZWFkZXJzLnB1c2godGhpcy5nZXRIZWFkZXJQYXJhbShpLCBkLnZbMF0ubGVuZ3RoIC0gMSwgJ2hlYWRlcnMnLCAnVmFsdWUnKSk7XG4gICAgICB9XG4gICAgICBpZiAoZGF0YVNldC52YWx1ZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBmbGF0RGF0YS5wdXNoKGRhdGFTZXQpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsncGFyc2VEYXRhJywgJ2ZsYXREYXRhJ10sIGZsYXREYXRhLCB0aGlzLl9vcHRpb25zLnRpbWVNb2RlKTtcbiAgICByZXR1cm4gZmxhdERhdGE7XG4gIH1cblxuICBmb3JtYXREYXRlKGRhdGU6IG51bWJlcik6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX29wdGlvbnMudGltZU1vZGUgPT09ICdkYXRlJyA/IG1vbWVudC50eihkYXRlIC8gdGhpcy5kaXZpZGVyLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKS50b0lTT1N0cmluZygpIDogZGF0ZS50b1N0cmluZygpO1xuICB9XG59XG4iXX0=