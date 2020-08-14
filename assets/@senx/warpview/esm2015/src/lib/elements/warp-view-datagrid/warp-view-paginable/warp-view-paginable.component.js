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
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Logger } from '../../../utils/logger';
import { Param } from '../../../model/param';
import { ChartLib } from '../../../utils/chart-lib';
import deepEqual from 'deep-equal';
import { GTSLib } from '../../../utils/gts.lib';
export class WarpViewPaginableComponent {
    constructor() {
        this.elemsCount = 15;
        this.windowed = 5;
        this.page = 0;
        this.pages = [];
        this.displayedValues = [];
        // tslint:disable-next-line:variable-name
        this._debug = false;
        // tslint:disable-next-line:variable-name
        this._options = Object.assign({}, new Param(), {
            timeMode: 'date',
            timeZone: 'UTC',
            timeUnit: 'us',
            bounds: {}
        });
        this.LOG = new Logger(WarpViewPaginableComponent, this.debug);
    }
    /**
     * @param {?} debug
     * @return {?}
     */
    set debug(debug) {
        this._debug = debug;
        this.LOG.setDebug(debug);
    }
    /**
     * @return {?}
     */
    get debug() {
        return this._debug;
    }
    /**
     * @param {?} options
     * @return {?}
     */
    set options(options) {
        if (!deepEqual(options, this._options)) {
            this.drawGridData();
        }
    }
    /**
     * @param {?} data
     * @return {?}
     */
    set data(data) {
        if (data) {
            this._data = data;
            this.drawGridData();
        }
    }
    /**
     * @param {?} page
     * @return {?}
     */
    goto(page) {
        this.page = page;
        this.drawGridData();
    }
    /**
     * @return {?}
     */
    next() {
        this.page = Math.min(this.page + 1, this._data.values.length - 1);
        this.drawGridData();
    }
    /**
     * @return {?}
     */
    prev() {
        this.page = Math.max(this.page - 1, 0);
        this.drawGridData();
    }
    /**
     * @private
     * @return {?}
     */
    drawGridData() {
        this._options = (/** @type {?} */ (ChartLib.mergeDeep(this._options, this.options)));
        this.LOG.debug(['drawGridData', '_options'], this._options);
        if (!this._data) {
            return;
        }
        this.pages = [];
        for (let i = 0; i < (this._data.values || []).length / this.elemsCount; i++) {
            this.pages.push(i);
        }
        this.displayedValues = (this._data.values || []).slice(Math.max(0, this.elemsCount * this.page), Math.min(this.elemsCount * (this.page + 1), (this._data.values || []).length));
        this.LOG.debug(['drawGridData', '_data'], this._data);
    }
    /**
     * @param {?} str
     * @return {?}
     */
    decodeURIComponent(str) {
        return decodeURIComponent(str);
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.drawGridData();
    }
    /**
     * @param {?} name
     * @return {?}
     */
    formatLabel(name) {
        return GTSLib.formatLabel(name);
    }
}
WarpViewPaginableComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-paginable',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div>\n  <div class=\"heading\" [innerHTML]=\"formatLabel(_data.name)\"></div>\n  <table>\n    <thead>\n    <th *ngFor=\"let h of _data.headers\">{{h}}</th>\n    </thead>\n    <tbody>\n    <tr *ngFor=\"let value of displayedValues; even as isEven; odd as isOdd\" [ngClass]=\"{ odd: isOdd, even: isEven}\">\n      <td *ngFor=\"let v of value\">\n        <span [innerHTML]=\"v\"></span>\n      </td>\n    </tr>\n    </tbody>\n  </table>\n  <div class=\"center\">\n    <div class=\"pagination\">\n      <div class=\"prev hoverable\" (click)=\"prev()\" *ngIf=\"page !== 0\">&lt;</div>\n      <div class=\"index disabled\" *ngIf=\"page - windowed > 0\">...</div>\n      <span *ngFor=\"let c of pages\">\n        <span *ngIf=\" c >= page - windowed && c <= page + windowed\"\n             [ngClass]=\"{ index: true, hoverable: page !== c, active: page === c}\" (click)=\"goto(c)\">{{c}}</span>\n      </span>\n      <div class=\"index disabled\" *ngIf=\"page + windowed < pages.length\">...</div>\n      <div class=\"next hoverable\" (click)=\"next()\" *ngIf=\"page + windowed < (_data.values ||\u00A0[]).length - 1\">&gt;</div>\n    </div>\n  </div>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host table{width:100%;color:var(--warp-view-font-color)}:host table td,:host table th{padding:var(--warp-view-datagrid-cell-padding)}:host table .odd{background-color:var(--warp-view-datagrid-odd-bg-color);color:var(--warp-view-datagrid-odd-color)}:host table .even{background-color:var(--warp-view-datagrid-even-bg-color);color:var(--warp-view-datagrid-even-color)}:host .center{text-align:center}:host .center .pagination{display:inline-block}:host .center .pagination .index,:host .center .pagination .next,:host .center .pagination .prev{color:var(--warp-view-font-color);float:left;padding:8px 16px;text-decoration:none;-webkit-transition:background-color .3s;transition:background-color .3s;border:1px solid var(--warp-view-pagination-border-color);margin:0;cursor:pointer;background-color:var(--warp-view-pagination-bg-color)}:host .center .pagination .index.active,:host .center .pagination .next.active,:host .center .pagination .prev.active{background-color:var(--warp-view-pagination-active-bg-color);color:var(--warp-view-pagination-active-color);border:1px solid var(--warp-view-pagination-active-border-color)}:host .center .pagination .index.hoverable:hover,:host .center .pagination .next.hoverable:hover,:host .center .pagination .prev.hoverable:hover{background-color:var(--warp-view-pagination-hover-bg-color);color:var(--warp-view-pagination-hover-color);border:1px solid var(--warp-view-pagination-hover-border-color)}:host .center .pagination .index.disabled,:host .center .pagination .next.disabled,:host .center .pagination .prev.disabled{cursor:auto;color:var(--warp-view-pagination-disabled-color)}:host .gts-classname{color:var(--gts-classname-font-color,#0074d9)}:host .gts-labelname{color:var(--gts-labelname-font-color,#19a979)}:host .gts-attrname{color:var(--gts-labelname-font-color,#ed4a7b)}:host .gts-separator{color:var(--gts-separator-font-color,#bbb)}:host .gts-labelvalue{color:var(--gts-labelvalue-font-color,#aaa);font-style:italic}:host .gts-attrvalue{color:var(--gts-labelvalue-font-color,#aaa);font-style:italic}:host .round{border-radius:50%;background-color:#bbb;display:inline-block;width:12px;height:12px;border:2px solid #454545}:host ul{list-style:none}"]
            }] }
];
/** @nocollapse */
WarpViewPaginableComponent.ctorParameters = () => [];
WarpViewPaginableComponent.propDecorators = {
    debug: [{ type: Input, args: ['debug',] }],
    options: [{ type: Input, args: ['options',] }],
    data: [{ type: Input, args: ['data',] }],
    elemsCount: [{ type: Input, args: ['elemsCount',] }],
    windowed: [{ type: Input, args: ['windowed',] }]
};
if (false) {
    /** @type {?} */
    WarpViewPaginableComponent.prototype.elemsCount;
    /** @type {?} */
    WarpViewPaginableComponent.prototype.windowed;
    /** @type {?} */
    WarpViewPaginableComponent.prototype.page;
    /** @type {?} */
    WarpViewPaginableComponent.prototype.pages;
    /** @type {?} */
    WarpViewPaginableComponent.prototype._data;
    /** @type {?} */
    WarpViewPaginableComponent.prototype.displayedValues;
    /**
     * @type {?}
     * @private
     */
    WarpViewPaginableComponent.prototype.LOG;
    /**
     * @type {?}
     * @private
     */
    WarpViewPaginableComponent.prototype._debug;
    /**
     * @type {?}
     * @private
     */
    WarpViewPaginableComponent.prototype._options;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LXBhZ2luYWJsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VueC93YXJwdmlldy8iLCJzb3VyY2VzIjpbInNyYy9saWIvZWxlbWVudHMvd2FycC12aWV3LWRhdGFncmlkL3dhcnAtdmlldy1wYWdpbmFibGUvd2FycC12aWV3LXBhZ2luYWJsZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQVUsaUJBQWlCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDMUUsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzdDLE9BQU8sRUFBQyxLQUFLLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUMzQyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDbEQsT0FBTyxTQUFTLE1BQU0sWUFBWSxDQUFDO0FBQ25DLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQVE5QyxNQUFNLE9BQU8sMEJBQTBCO0lBQ3JDO1FBMEJxQixlQUFVLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLGFBQVEsR0FBRyxDQUFDLENBQUM7UUFFaEMsU0FBSSxHQUFHLENBQUMsQ0FBQztRQUNULFVBQUssR0FBYSxFQUFFLENBQUM7UUFHckIsb0JBQWUsR0FBVSxFQUFFLENBQUM7O1FBR3BCLFdBQU0sR0FBRyxLQUFLLENBQUM7O1FBRWYsYUFBUSxxQkFDWCxJQUFJLEtBQUssRUFBRSxFQUFLO1lBQ2pCLFFBQVEsRUFBRSxNQUFNO1lBQ2hCLFFBQVEsRUFBRSxLQUFLO1lBQ2YsUUFBUSxFQUFFLElBQUk7WUFDZCxNQUFNLEVBQUUsRUFBRTtTQUNYLEVBQ0Q7UUE1Q0EsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLE1BQU0sQ0FBQywwQkFBMEIsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFD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QUFDOzs7OztJQUVELGtCQUFrQixDQUFDLEdBQVc7UUFDNUIsT0FBTyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNqQyxDQUFDOzs7O0lBRUQsUUFBUTtRQUNOLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN0QixDQUFDOzs7OztJQUVELFdBQVcsQ0FBQyxJQUFZO1FBQ3RCLE9BQU8sTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNsQyxDQUFDOzs7WUFoR0YsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxvQkFBb0I7Z0JBQzlCLHF4REFBbUQ7Z0JBRW5ELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxTQUFTOzthQUMzQzs7Ozs7b0JBTUUsS0FBSyxTQUFDLE9BQU87c0JBU2IsS0FBSyxTQUFDLFNBQVM7bUJBTWYsS0FBSyxTQUFDLE1BQU07eUJBT1osS0FBSyxTQUFDLFlBQVk7dUJBQ2xCLEtBQUssU0FBQyxVQUFVOzs7O0lBRGpCLGdEQUFxQzs7SUFDckMsOENBQWdDOztJQUVoQywwQ0FBUzs7SUFDVCwyQ0FBcUI7O0lBRXJCLDJDQUEwRDs7SUFDMUQscURBQTRCOzs7OztJQUM1Qix5Q0FBb0I7Ozs7O0lBRXBCLDRDQUF1Qjs7Ozs7SUFFdkIsOENBT0UiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogIENvcHlyaWdodCAyMDIwICBTZW5YIFMuQS5TLlxuICpcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50LCBJbnB1dCwgT25Jbml0LCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0xvZ2dlcn0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvbG9nZ2VyJztcbmltcG9ydCB7UGFyYW19IGZyb20gJy4uLy4uLy4uL21vZGVsL3BhcmFtJztcbmltcG9ydCB7Q2hhcnRMaWJ9IGZyb20gJy4uLy4uLy4uL3V0aWxzL2NoYXJ0LWxpYic7XG5pbXBvcnQgZGVlcEVxdWFsIGZyb20gJ2RlZXAtZXF1YWwnO1xuaW1wb3J0IHtHVFNMaWJ9IGZyb20gJy4uLy4uLy4uL3V0aWxzL2d0cy5saWInO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICd3YXJwdmlldy1wYWdpbmFibGUnLFxuICB0ZW1wbGF0ZVVybDogJy4vd2FycC12aWV3LXBhZ2luYWJsZS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3dhcnAtdmlldy1wYWdpbmFibGUuY29tcG9uZW50LnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uU2hhZG93RG9tXG59KVxuZXhwb3J0IGNsYXNzIFdhcnBWaWV3UGFnaW5hYmxlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5MT0cgPSBuZXcgTG9nZ2VyKFdhcnBWaWV3UGFnaW5hYmxlQ29tcG9uZW50LCB0aGlzLmRlYnVnKTtcbiAgfVxuXG4gIEBJbnB1dCgnZGVidWcnKSBzZXQgZGVidWcoZGVidWc6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9kZWJ1ZyA9IGRlYnVnO1xuICAgIHRoaXMuTE9HLnNldERlYnVnKGRlYnVnKTtcbiAgfVxuXG4gIGdldCBkZWJ1ZygpIHtcbiAgICByZXR1cm4gdGhpcy5fZGVidWc7XG4gIH1cblxuICBASW5wdXQoJ29wdGlvbnMnKSBzZXQgb3B0aW9ucyhvcHRpb25zOiBQYXJhbSkge1xuICAgIGlmICghZGVlcEVxdWFsKG9wdGlvbnMsIHRoaXMuX29wdGlvbnMpKSB7XG4gICAgICB0aGlzLmRyYXdHcmlkRGF0YSgpO1xuICAgIH1cbiAgfVxuXG4gIEBJbnB1dCgnZGF0YScpIHNldCBkYXRhKGRhdGE6IHsgbmFtZTogc3RyaW5nLCB2YWx1ZXM6IGFueVtdLCBoZWFkZXJzOiBzdHJpbmdbXSB9KSB7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIHRoaXMuX2RhdGEgPSBkYXRhO1xuICAgICAgdGhpcy5kcmF3R3JpZERhdGEoKTtcbiAgICB9XG4gIH1cblxuICBASW5wdXQoJ2VsZW1zQ291bnQnKSBlbGVtc0NvdW50ID0gMTU7XG4gIEBJbnB1dCgnd2luZG93ZWQnKSB3aW5kb3dlZCA9IDU7XG5cbiAgcGFnZSA9IDA7XG4gIHBhZ2VzOiBudW1iZXJbXSA9IFtdO1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZVxuICBfZGF0YTogeyBuYW1lOiBzdHJpbmcsIHZhbHVlczogYW55W10sIGhlYWRlcnM6IHN0cmluZ1tdIH07XG4gIGRpc3BsYXllZFZhbHVlczogYW55W10gPSBbXTtcbiAgcHJpdmF0ZSBMT0c6IExvZ2dlcjtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWVcbiAgcHJpdmF0ZSBfZGVidWcgPSBmYWxzZTtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWVcbiAgcHJpdmF0ZSBfb3B0aW9uczogUGFyYW0gPSB7XG4gICAgLi4ubmV3IFBhcmFtKCksIC4uLntcbiAgICAgIHRpbWVNb2RlOiAnZGF0ZScsXG4gICAgICB0aW1lWm9uZTogJ1VUQycsXG4gICAgICB0aW1lVW5pdDogJ3VzJyxcbiAgICAgIGJvdW5kczoge31cbiAgICB9XG4gIH07XG5cbiAgZ290byhwYWdlOiBudW1iZXIpIHtcbiAgICB0aGlzLnBhZ2UgPSBwYWdlO1xuICAgIHRoaXMuZHJhd0dyaWREYXRhKCk7XG4gIH1cblxuICBuZXh0KCkge1xuICAgIHRoaXMucGFnZSA9IE1hdGgubWluKHRoaXMucGFnZSArIDEsIHRoaXMuX2RhdGEudmFsdWVzLmxlbmd0aCAtIDEpO1xuICAgIHRoaXMuZHJhd0dyaWREYXRhKCk7XG4gIH1cblxuICBwcmV2KCkge1xuICAgIHRoaXMucGFnZSA9IE1hdGgubWF4KHRoaXMucGFnZSAtIDEsIDApO1xuICAgIHRoaXMuZHJhd0dyaWREYXRhKCk7XG4gIH1cblxuICBwcml2YXRlIGRyYXdHcmlkRGF0YSgpIHtcbiAgICB0aGlzLl9vcHRpb25zID0gQ2hhcnRMaWIubWVyZ2VEZWVwKHRoaXMuX29wdGlvbnMsIHRoaXMub3B0aW9ucykgYXMgUGFyYW07XG4gICAgdGhpcy5MT0cuZGVidWcoWydkcmF3R3JpZERhdGEnLCAnX29wdGlvbnMnXSwgdGhpcy5fb3B0aW9ucyk7XG4gICAgaWYgKCF0aGlzLl9kYXRhKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucGFnZXMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8ICh0aGlzLl9kYXRhLnZhbHVlcyB8fMKgW10gKS5sZW5ndGggLyB0aGlzLmVsZW1zQ291bnQ7IGkrKykge1xuICAgICAgdGhpcy5wYWdlcy5wdXNoKGkpO1xuICAgIH1cbiAgICB0aGlzLmRpc3BsYXllZFZhbHVlcyA9ICh0aGlzLl9kYXRhLnZhbHVlcyB8fMKgW10gKS5zbGljZShcbiAgICAgIE1hdGgubWF4KDAsIHRoaXMuZWxlbXNDb3VudCAqIHRoaXMucGFnZSksXG4gICAgICBNYXRoLm1pbih0aGlzLmVsZW1zQ291bnQgKiAodGhpcy5wYWdlICsgMSksICh0aGlzLl9kYXRhLnZhbHVlcyB8fMKgW10gKS5sZW5ndGgpXG4gICAgKTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RyYXdHcmlkRGF0YScsICdfZGF0YSddLCB0aGlzLl9kYXRhKTtcbiAgfVxuXG4gIGRlY29kZVVSSUNvbXBvbmVudChzdHI6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChzdHIpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5kcmF3R3JpZERhdGEoKTtcbiAgfVxuXG4gIGZvcm1hdExhYmVsKG5hbWU6IHN0cmluZykge1xuICAgIHJldHVybiBHVFNMaWIuZm9ybWF0TGFiZWwobmFtZSk7XG4gIH1cbn1cbiJdfQ==