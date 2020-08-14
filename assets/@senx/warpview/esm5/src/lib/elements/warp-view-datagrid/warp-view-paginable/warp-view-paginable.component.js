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
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Logger } from '../../../utils/logger';
import { Param } from '../../../model/param';
import { ChartLib } from '../../../utils/chart-lib';
import deepEqual from 'deep-equal';
import { GTSLib } from '../../../utils/gts.lib';
var WarpViewPaginableComponent = /** @class */ (function () {
    function WarpViewPaginableComponent() {
        this.elemsCount = 15;
        this.windowed = 5;
        this.page = 0;
        this.pages = [];
        this.displayedValues = [];
        // tslint:disable-next-line:variable-name
        this._debug = false;
        // tslint:disable-next-line:variable-name
        this._options = tslib_1.__assign({}, new Param(), {
            timeMode: 'date',
            timeZone: 'UTC',
            timeUnit: 'us',
            bounds: {}
        });
        this.LOG = new Logger(WarpViewPaginableComponent, this.debug);
    }
    Object.defineProperty(WarpViewPaginableComponent.prototype, "debug", {
        get: /**
         * @return {?}
         */
        function () {
            return this._debug;
        },
        set: /**
         * @param {?} debug
         * @return {?}
         */
        function (debug) {
            this._debug = debug;
            this.LOG.setDebug(debug);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarpViewPaginableComponent.prototype, "options", {
        set: /**
         * @param {?} options
         * @return {?}
         */
        function (options) {
            if (!deepEqual(options, this._options)) {
                this.drawGridData();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarpViewPaginableComponent.prototype, "data", {
        set: /**
         * @param {?} data
         * @return {?}
         */
        function (data) {
            if (data) {
                this._data = data;
                this.drawGridData();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} page
     * @return {?}
     */
    WarpViewPaginableComponent.prototype.goto = /**
     * @param {?} page
     * @return {?}
     */
    function (page) {
        this.page = page;
        this.drawGridData();
    };
    /**
     * @return {?}
     */
    WarpViewPaginableComponent.prototype.next = /**
     * @return {?}
     */
    function () {
        this.page = Math.min(this.page + 1, this._data.values.length - 1);
        this.drawGridData();
    };
    /**
     * @return {?}
     */
    WarpViewPaginableComponent.prototype.prev = /**
     * @return {?}
     */
    function () {
        this.page = Math.max(this.page - 1, 0);
        this.drawGridData();
    };
    /**
     * @private
     * @return {?}
     */
    WarpViewPaginableComponent.prototype.drawGridData = /**
     * @private
     * @return {?}
     */
    function () {
        this._options = (/** @type {?} */ (ChartLib.mergeDeep(this._options, this.options)));
        this.LOG.debug(['drawGridData', '_options'], this._options);
        if (!this._data) {
            return;
        }
        this.pages = [];
        for (var i = 0; i < (this._data.values || []).length / this.elemsCount; i++) {
            this.pages.push(i);
        }
        this.displayedValues = (this._data.values || []).slice(Math.max(0, this.elemsCount * this.page), Math.min(this.elemsCount * (this.page + 1), (this._data.values || []).length));
        this.LOG.debug(['drawGridData', '_data'], this._data);
    };
    /**
     * @param {?} str
     * @return {?}
     */
    WarpViewPaginableComponent.prototype.decodeURIComponent = /**
     * @param {?} str
     * @return {?}
     */
    function (str) {
        return decodeURIComponent(str);
    };
    /**
     * @return {?}
     */
    WarpViewPaginableComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.drawGridData();
    };
    /**
     * @param {?} name
     * @return {?}
     */
    WarpViewPaginableComponent.prototype.formatLabel = /**
     * @param {?} name
     * @return {?}
     */
    function (name) {
        return GTSLib.formatLabel(name);
    };
    WarpViewPaginableComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-paginable',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div>\n  <div class=\"heading\" [innerHTML]=\"formatLabel(_data.name)\"></div>\n  <table>\n    <thead>\n    <th *ngFor=\"let h of _data.headers\">{{h}}</th>\n    </thead>\n    <tbody>\n    <tr *ngFor=\"let value of displayedValues; even as isEven; odd as isOdd\" [ngClass]=\"{ odd: isOdd, even: isEven}\">\n      <td *ngFor=\"let v of value\">\n        <span [innerHTML]=\"v\"></span>\n      </td>\n    </tr>\n    </tbody>\n  </table>\n  <div class=\"center\">\n    <div class=\"pagination\">\n      <div class=\"prev hoverable\" (click)=\"prev()\" *ngIf=\"page !== 0\">&lt;</div>\n      <div class=\"index disabled\" *ngIf=\"page - windowed > 0\">...</div>\n      <span *ngFor=\"let c of pages\">\n        <span *ngIf=\" c >= page - windowed && c <= page + windowed\"\n             [ngClass]=\"{ index: true, hoverable: page !== c, active: page === c}\" (click)=\"goto(c)\">{{c}}</span>\n      </span>\n      <div class=\"index disabled\" *ngIf=\"page + windowed < pages.length\">...</div>\n      <div class=\"next hoverable\" (click)=\"next()\" *ngIf=\"page + windowed < (_data.values ||\u00A0[]).length - 1\">&gt;</div>\n    </div>\n  </div>\n</div>\n",
                    encapsulation: ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host table{width:100%;color:var(--warp-view-font-color)}:host table td,:host table th{padding:var(--warp-view-datagrid-cell-padding)}:host table .odd{background-color:var(--warp-view-datagrid-odd-bg-color);color:var(--warp-view-datagrid-odd-color)}:host table .even{background-color:var(--warp-view-datagrid-even-bg-color);color:var(--warp-view-datagrid-even-color)}:host .center{text-align:center}:host .center .pagination{display:inline-block}:host .center .pagination .index,:host .center .pagination .next,:host .center .pagination .prev{color:var(--warp-view-font-color);float:left;padding:8px 16px;text-decoration:none;-webkit-transition:background-color .3s;transition:background-color .3s;border:1px solid var(--warp-view-pagination-border-color);margin:0;cursor:pointer;background-color:var(--warp-view-pagination-bg-color)}:host .center .pagination .index.active,:host .center .pagination .next.active,:host .center .pagination .prev.active{background-color:var(--warp-view-pagination-active-bg-color);color:var(--warp-view-pagination-active-color);border:1px solid var(--warp-view-pagination-active-border-color)}:host .center .pagination .index.hoverable:hover,:host .center .pagination .next.hoverable:hover,:host .center .pagination .prev.hoverable:hover{background-color:var(--warp-view-pagination-hover-bg-color);color:var(--warp-view-pagination-hover-color);border:1px solid var(--warp-view-pagination-hover-border-color)}:host .center .pagination .index.disabled,:host .center .pagination .next.disabled,:host .center .pagination .prev.disabled{cursor:auto;color:var(--warp-view-pagination-disabled-color)}:host .gts-classname{color:var(--gts-classname-font-color,#0074d9)}:host .gts-labelname{color:var(--gts-labelname-font-color,#19a979)}:host .gts-attrname{color:var(--gts-labelname-font-color,#ed4a7b)}:host .gts-separator{color:var(--gts-separator-font-color,#bbb)}:host .gts-labelvalue{color:var(--gts-labelvalue-font-color,#aaa);font-style:italic}:host .gts-attrvalue{color:var(--gts-labelvalue-font-color,#aaa);font-style:italic}:host .round{border-radius:50%;background-color:#bbb;display:inline-block;width:12px;height:12px;border:2px solid #454545}:host ul{list-style:none}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewPaginableComponent.ctorParameters = function () { return []; };
    WarpViewPaginableComponent.propDecorators = {
        debug: [{ type: Input, args: ['debug',] }],
        options: [{ type: Input, args: ['options',] }],
        data: [{ type: Input, args: ['data',] }],
        elemsCount: [{ type: Input, args: ['elemsCount',] }],
        windowed: [{ type: Input, args: ['windowed',] }]
    };
    return WarpViewPaginableComponent;
}());
export { WarpViewPaginableComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LXBhZ2luYWJsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VueC93YXJwdmlldy8iLCJzb3VyY2VzIjpbInNyYy9saWIvZWxlbWVudHMvd2FycC12aWV3LWRhdGFncmlkL3dhcnAtdmlldy1wYWdpbmFibGUvd2FycC12aWV3LXBhZ2luYWJsZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFVLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzFFLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDM0MsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ2xELE9BQU8sU0FBUyxNQUFNLFlBQVksQ0FBQztBQUNuQyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFFOUM7SUFPRTtRQTBCcUIsZUFBVSxHQUFHLEVBQUUsQ0FBQztRQUNsQixhQUFRLEdBQUcsQ0FBQyxDQUFDO1FBRWhDLFNBQUksR0FBRyxDQUFDLENBQUM7UUFDVCxVQUFLLEdBQWEsRUFBRSxDQUFDO1FBR3JCLG9CQUFlLEdBQVUsRUFBRSxDQUFDOztRQUdwQixXQUFNLEdBQUcsS0FBSyxDQUFDOztRQUVmLGFBQVEsd0JBQ1gsSUFBSSxLQUFLLEVBQUUsRUFBSztZQUNqQixRQUFRLEVBQUUsTUFBTTtZQUNoQixRQUFRLEVBQUUsS0FBSztZQUNmLFFBQVEsRUFBRSxJQUFJO1lBQ2QsTUFBTSxFQUFFLEVBQUU7U0FDWCxFQUNEO1FBNUNBLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxNQUFNLENBQUMsMEJBQTBCLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFRCxzQkFB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LGNBQWMsRUFBRSxPQUFPLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDeEQsQ0FBQzs7Ozs7SUFFRCx1REFBa0I7Ozs7SUFBbEIsVUFBbUIsR0FBVztRQUM1QixPQUFPLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2pDLENBQUM7Ozs7SUFFRCw2Q0FBUTs7O0lBQVI7UUFDRSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDdEIsQ0FBQzs7Ozs7SUFFRCxnREFBVzs7OztJQUFYLFVBQVksSUFBWTtRQUN0QixPQUFPLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEMsQ0FBQzs7Z0JBaEdGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsb0JBQW9CO29CQUM5QixxeERBQW1EO29CQUVuRCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsU0FBUzs7aUJBQzNDOzs7Ozt3QkFNRSxLQUFLLFNBQUMsT0FBTzswQkFTYixLQUFLLFNBQUMsU0FBUzt1QkFNZixLQUFLLFNBQUMsTUFBTTs2QkFPWixLQUFLLFNBQUMsWUFBWTsyQkFDbEIsS0FBSyxTQUFDLFVBQVU7O0lBK0RuQixpQ0FBQztDQUFBLEFBakdELElBaUdDO1NBM0ZZLDBCQUEwQjs7O0lBMkJyQyxnREFBcUM7O0lBQ3JDLDhDQUFnQzs7SUFFaEMsMENBQVM7O0lBQ1QsMkNBQXFCOztJQUVyQiwyQ0FBMEQ7O0lBQzFELHFEQUE0Qjs7Ozs7SUFDNUIseUNBQW9COzs7OztJQUVwQiw0Q0FBdUI7Ozs7O0lBRXZCLDhDQU9FIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqICBDb3B5cmlnaHQgMjAyMCAgU2VuWCBTLkEuUy5cbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudCwgSW5wdXQsIE9uSW5pdCwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtMb2dnZXJ9IGZyb20gJy4uLy4uLy4uL3V0aWxzL2xvZ2dlcic7XG5pbXBvcnQge1BhcmFtfSBmcm9tICcuLi8uLi8uLi9tb2RlbC9wYXJhbSc7XG5pbXBvcnQge0NoYXJ0TGlifSBmcm9tICcuLi8uLi8uLi91dGlscy9jaGFydC1saWInO1xuaW1wb3J0IGRlZXBFcXVhbCBmcm9tICdkZWVwLWVxdWFsJztcbmltcG9ydCB7R1RTTGlifSBmcm9tICcuLi8uLi8uLi91dGlscy9ndHMubGliJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnd2FycHZpZXctcGFnaW5hYmxlJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3dhcnAtdmlldy1wYWdpbmFibGUuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi93YXJwLXZpZXctcGFnaW5hYmxlLmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLlNoYWRvd0RvbVxufSlcbmV4cG9ydCBjbGFzcyBXYXJwVmlld1BhZ2luYWJsZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuTE9HID0gbmV3IExvZ2dlcihXYXJwVmlld1BhZ2luYWJsZUNvbXBvbmVudCwgdGhpcy5kZWJ1Zyk7XG4gIH1cblxuICBASW5wdXQoJ2RlYnVnJykgc2V0IGRlYnVnKGRlYnVnOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZGVidWcgPSBkZWJ1ZztcbiAgICB0aGlzLkxPRy5zZXREZWJ1ZyhkZWJ1Zyk7XG4gIH1cblxuICBnZXQgZGVidWcoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RlYnVnO1xuICB9XG5cbiAgQElucHV0KCdvcHRpb25zJykgc2V0IG9wdGlvbnMob3B0aW9uczogUGFyYW0pIHtcbiAgICBpZiAoIWRlZXBFcXVhbChvcHRpb25zLCB0aGlzLl9vcHRpb25zKSkge1xuICAgICAgdGhpcy5kcmF3R3JpZERhdGEoKTtcbiAgICB9XG4gIH1cblxuICBASW5wdXQoJ2RhdGEnKSBzZXQgZGF0YShkYXRhOiB7IG5hbWU6IHN0cmluZywgdmFsdWVzOiBhbnlbXSwgaGVhZGVyczogc3RyaW5nW10gfSkge1xuICAgIGlmIChkYXRhKSB7XG4gICAgICB0aGlzLl9kYXRhID0gZGF0YTtcbiAgICAgIHRoaXMuZHJhd0dyaWREYXRhKCk7XG4gICAgfVxuICB9XG5cbiAgQElucHV0KCdlbGVtc0NvdW50JykgZWxlbXNDb3VudCA9IDE1O1xuICBASW5wdXQoJ3dpbmRvd2VkJykgd2luZG93ZWQgPSA1O1xuXG4gIHBhZ2UgPSAwO1xuICBwYWdlczogbnVtYmVyW10gPSBbXTtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWVcbiAgX2RhdGE6IHsgbmFtZTogc3RyaW5nLCB2YWx1ZXM6IGFueVtdLCBoZWFkZXJzOiBzdHJpbmdbXSB9O1xuICBkaXNwbGF5ZWRWYWx1ZXM6IGFueVtdID0gW107XG4gIHByaXZhdGUgTE9HOiBMb2dnZXI7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lXG4gIHByaXZhdGUgX2RlYnVnID0gZmFsc2U7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lXG4gIHByaXZhdGUgX29wdGlvbnM6IFBhcmFtID0ge1xuICAgIC4uLm5ldyBQYXJhbSgpLCAuLi57XG4gICAgICB0aW1lTW9kZTogJ2RhdGUnLFxuICAgICAgdGltZVpvbmU6ICdVVEMnLFxuICAgICAgdGltZVVuaXQ6ICd1cycsXG4gICAgICBib3VuZHM6IHt9XG4gICAgfVxuICB9O1xuXG4gIGdvdG8ocGFnZTogbnVtYmVyKSB7XG4gICAgdGhpcy5wYWdlID0gcGFnZTtcbiAgICB0aGlzLmRyYXdHcmlkRGF0YSgpO1xuICB9XG5cbiAgbmV4dCgpIHtcbiAgICB0aGlzLnBhZ2UgPSBNYXRoLm1pbih0aGlzLnBhZ2UgKyAxLCB0aGlzLl9kYXRhLnZhbHVlcy5sZW5ndGggLSAxKTtcbiAgICB0aGlzLmRyYXdHcmlkRGF0YSgpO1xuICB9XG5cbiAgcHJldigpIHtcbiAgICB0aGlzLnBhZ2UgPSBNYXRoLm1heCh0aGlzLnBhZ2UgLSAxLCAwKTtcbiAgICB0aGlzLmRyYXdHcmlkRGF0YSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBkcmF3R3JpZERhdGEoKSB7XG4gICAgdGhpcy5fb3B0aW9ucyA9IENoYXJ0TGliLm1lcmdlRGVlcCh0aGlzLl9vcHRpb25zLCB0aGlzLm9wdGlvbnMpIGFzIFBhcmFtO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZHJhd0dyaWREYXRhJywgJ19vcHRpb25zJ10sIHRoaXMuX29wdGlvbnMpO1xuICAgIGlmICghdGhpcy5fZGF0YSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnBhZ2VzID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAodGhpcy5fZGF0YS52YWx1ZXMgfHzCoFtdICkubGVuZ3RoIC8gdGhpcy5lbGVtc0NvdW50OyBpKyspIHtcbiAgICAgIHRoaXMucGFnZXMucHVzaChpKTtcbiAgICB9XG4gICAgdGhpcy5kaXNwbGF5ZWRWYWx1ZXMgPSAodGhpcy5fZGF0YS52YWx1ZXMgfHzCoFtdICkuc2xpY2UoXG4gICAgICBNYXRoLm1heCgwLCB0aGlzLmVsZW1zQ291bnQgKiB0aGlzLnBhZ2UpLFxuICAgICAgTWF0aC5taW4odGhpcy5lbGVtc0NvdW50ICogKHRoaXMucGFnZSArIDEpLCAodGhpcy5fZGF0YS52YWx1ZXMgfHzCoFtdICkubGVuZ3RoKVxuICAgICk7XG4gICAgdGhpcy5MT0cuZGVidWcoWydkcmF3R3JpZERhdGEnLCAnX2RhdGEnXSwgdGhpcy5fZGF0YSk7XG4gIH1cblxuICBkZWNvZGVVUklDb21wb25lbnQoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoc3RyKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuZHJhd0dyaWREYXRhKCk7XG4gIH1cblxuICBmb3JtYXRMYWJlbChuYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gR1RTTGliLmZvcm1hdExhYmVsKG5hbWUpO1xuICB9XG59XG4iXX0=