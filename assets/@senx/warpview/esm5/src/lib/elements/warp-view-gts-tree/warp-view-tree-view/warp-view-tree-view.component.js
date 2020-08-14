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
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { Logger } from '../../../utils/logger';
import { GTSLib } from '../../../utils/gts.lib';
import { Param } from '../../../model/param';
import { Observable, Subject } from 'rxjs';
var WarpViewTreeViewComponent = /** @class */ (function () {
    function WarpViewTreeViewComponent() {
        this.gtsFilter = 'x';
        this.branch = false;
        this.hidden = false;
        this.kbdLastKeyPressed = [];
        this.warpViewSelectedGTS = new EventEmitter();
        this.hide = {};
        this.initOpen = new Subject();
        this._debug = false;
        this._hiddenData = [];
        this.LOG = new Logger(WarpViewTreeViewComponent, this.debug);
    }
    Object.defineProperty(WarpViewTreeViewComponent.prototype, "debug", {
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
    Object.defineProperty(WarpViewTreeViewComponent.prototype, "hiddenData", {
        get: /**
         * @return {?}
         */
        function () {
            return this._hiddenData;
        },
        set: /**
         * @param {?} hiddenData
         * @return {?}
         */
        function (hiddenData) {
            this._hiddenData = tslib_1.__spread(hiddenData);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    WarpViewTreeViewComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.LOG.debug(['ngOnInit'], this.gtsList);
        this.gtsList.forEach((/**
         * @param {?} g
         * @param {?} index
         * @return {?}
         */
        function (g, index) {
            _this.hide[index + ''] = false;
        }));
        this.eventsSubscription = this.events.subscribe((/**
         * @return {?}
         */
        function () { return _this.open(); }));
    };
    /**
     * @return {?}
     */
    WarpViewTreeViewComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.eventsSubscription.unsubscribe();
    };
    /**
     * @param {?} index
     * @return {?}
     */
    WarpViewTreeViewComponent.prototype.toggleVisibility = /**
     * @param {?} index
     * @return {?}
     */
    function (index) {
        this.LOG.debug(['toggleVisibility'], index, this.hide);
        this.hide[index + ''] = !this.hide[index + ''];
    };
    /**
     * @param {?} index
     * @return {?}
     */
    WarpViewTreeViewComponent.prototype.isHidden = /**
     * @param {?} index
     * @return {?}
     */
    function (index) {
        if (!!this.hide[index + '']) {
            return this.hide[index + ''];
        }
        else {
            return false;
        }
    };
    /**
     * @param {?} node
     * @return {?}
     */
    WarpViewTreeViewComponent.prototype.isGts = /**
     * @param {?} node
     * @return {?}
     */
    function (node) {
        return GTSLib.isGts(node);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    WarpViewTreeViewComponent.prototype.warpViewSelectedGTSHandler = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.LOG.debug(['warpViewSelectedGTS'], event);
        this.warpViewSelectedGTS.emit(event);
    };
    /**
     * @return {?}
     */
    WarpViewTreeViewComponent.prototype.open = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.gtsList.forEach((/**
         * @param {?} g
         * @param {?} index
         * @return {?}
         */
        function (g, index) {
            _this.hide[index + ''] = true;
        }));
        setTimeout((/**
         * @return {?}
         */
        function () { return _this.initOpen.next(); }));
    };
    WarpViewTreeViewComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-tree-view',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"list\">\n  <ul *ngIf=\"gtsList\">\n    <li *ngFor=\"let gts of gtsList; index as index; first as first\" >\n      <warpview-chip\n        *ngIf=\"isGts(gts)\"\n        [options]=\"options\" (warpViewSelectedGTS)=\"warpViewSelectedGTSHandler($event)\" [param]=\"params[gts.id]\"\n        [node]=\"{gts: gts}\" [name]=\"gts.c\" [gtsFilter]=\"gtsFilter\" [debug]=\"debug\" [hiddenData]=\"hiddenData\"\n        [kbdLastKeyPressed]=\"kbdLastKeyPressed\"></warpview-chip>\n      <span *ngIf=\"!isGts(gts)\">\n        <span *ngIf=\"gts\">\n          <span *ngIf=\"branch\">\n            <span>\n            <span [ngClass]=\"{expanded:  hide[index + ''], collapsed: !hide[index + '']}\"\n                  (click)=\"toggleVisibility(index)\" [id]=\"'span-' + index\"> </span>\n                    <small (click)=\"toggleVisibility(index)\"> List of {{gts.length}}\n                      item{{gts.length > 1 ? 's' : ''}}</small>\n           </span>\n          </span>\n          <span *ngIf=\"!branch\">\n            <span class=\"stack-level\">\n              <span [ngClass]=\"{expanded: hide[index + ''], collapsed: !hide[index + '']}\"\n                    (click)=\"toggleVisibility(index)\" [id]=\"'span-' + index\"></span>\n              <span (click)=\"toggleVisibility(index)\">{{first ? '[TOP]' : '[' + (index + 1) + ']'}}&nbsp;\n                <small [id]=\"'inner-' + index\">List of {{gts.length}} item{{gts.length > 1 ? 's' : ''}}</small>\n              </span>\n                  </span>\n          </span>\n    <warpview-tree-view [gtsList]=\"gts\" [branch]=\"true\" *ngIf=\"isHidden(index)\"\n                        [debug]=\"debug\" [gtsFilter]=\"gtsFilter\" [params]=\"params\"\n                        [events]=\"initOpen.asObservable()\"\n                        [options]=\"options\" (warpViewSelectedGTS)=\"warpViewSelectedGTSHandler($event)\"\n                        [kbdLastKeyPressed]=\"kbdLastKeyPressed\" [hiddenData]=\"hiddenData\"></warpview-tree-view>\n        </span>\n      </span>\n    </li>\n  </ul>\n</div>\n",
                    encapsulation: ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host ul{margin:0;padding:0;list-style:none;border:none;overflow:hidden}:host li{color:var(--gts-stack-font-color,#000);position:relative;padding:0 0 0 20px;line-height:20px}:host .list,:host li .stack-level{font-size:1em;padding-top:5px}:host .list+div,:host li .stack-level+div{padding-left:25px}:host li .expanded{padding:1px 10px;margin-right:5px;background-image:var(--gts-tree-expanded-icon,url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==));background-position:center left;background-repeat:no-repeat}:host li .collapsed{padding:1px 10px;margin-right:5px;background-image:var(--gts-tree-collapsed-icon,url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=));background-repeat:no-repeat;background-position:center left}:host li .gtsInfo{white-space:normal;word-wrap:break-word}:host li .gtsInfo[disabled]{color:#aaa;cursor:not-allowed}:host li .normal{border-radius:50%;background-color:#bbb;display:inline-block}:host li i,:host li span{cursor:pointer}:host li .selected{background-color:#adf;font-weight:700;padding:1px 5px}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewTreeViewComponent.ctorParameters = function () { return []; };
    WarpViewTreeViewComponent.propDecorators = {
        debug: [{ type: Input, args: ['debug',] }],
        hiddenData: [{ type: Input, args: ['hiddenData',] }],
        options: [{ type: Input, args: ['options',] }],
        gtsFilter: [{ type: Input, args: ['gtsFilter',] }],
        gtsList: [{ type: Input, args: ['gtsList',] }],
        params: [{ type: Input, args: ['params',] }],
        branch: [{ type: Input, args: ['branch',] }],
        hidden: [{ type: Input, args: ['hidden',] }],
        events: [{ type: Input }],
        kbdLastKeyPressed: [{ type: Input, args: ['kbdLastKeyPressed',] }],
        warpViewSelectedGTS: [{ type: Output, args: ['warpViewSelectedGTS',] }]
    };
    return WarpViewTreeViewComponent;
}());
export { WarpViewTreeViewComponent };
if (false) {
    /** @type {?} */
    WarpViewTreeViewComponent.prototype.options;
    /** @type {?} */
    WarpViewTreeViewComponent.prototype.gtsFilter;
    /** @type {?} */
    WarpViewTreeViewComponent.prototype.gtsList;
    /** @type {?} */
    WarpViewTreeViewComponent.prototype.params;
    /** @type {?} */
    WarpViewTreeViewComponent.prototype.branch;
    /** @type {?} */
    WarpViewTreeViewComponent.prototype.hidden;
    /** @type {?} */
    WarpViewTreeViewComponent.prototype.events;
    /** @type {?} */
    WarpViewTreeViewComponent.prototype.kbdLastKeyPressed;
    /** @type {?} */
    WarpViewTreeViewComponent.prototype.warpViewSelectedGTS;
    /** @type {?} */
    WarpViewTreeViewComponent.prototype.hide;
    /** @type {?} */
    WarpViewTreeViewComponent.prototype.initOpen;
    /**
     * @type {?}
     * @private
     */
    WarpViewTreeViewComponent.prototype.LOG;
    /**
     * @type {?}
     * @private
     */
    WarpViewTreeViewComponent.prototype._debug;
    /**
     * @type {?}
     * @private
     */
    WarpViewTreeViewComponent.prototype._hiddenData;
    /**
     * @type {?}
     * @private
     */
    WarpViewTreeViewComponent.prototype.eventsSubscription;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LXRyZWUtdmlldy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VueC93YXJwdmlldy8iLCJzb3VyY2VzIjpbInNyYy9saWIvZWxlbWVudHMvd2FycC12aWV3LWd0cy10cmVlL3dhcnAtdmlldy10cmVlLXZpZXcvd2FycC12aWV3LXRyZWUtdmlldy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBcUIsTUFBTSxFQUFFLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzNHLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDOUMsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQzNDLE9BQU8sRUFBQyxVQUFVLEVBQUUsT0FBTyxFQUFlLE1BQU0sTUFBTSxDQUFDO0FBRXZEO0lBMkNFO1FBakJvQixjQUFTLEdBQUcsR0FBRyxDQUFDO1FBR25CLFdBQU0sR0FBRyxLQUFLLENBQUM7UUFDZixXQUFNLEdBQUcsS0FBSyxDQUFDO1FBR0osc0JBQWlCLEdBQWEsRUFBRSxDQUFDO1FBQzlCLHdCQUFtQixHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFFN0UsU0FBSSxHQUFRLEVBQUUsQ0FBQztRQUNmLGFBQVEsR0FBa0IsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQUV0QyxXQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ2YsZ0JBQVcsR0FBYSxFQUFFLENBQUM7UUFJakMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLE1BQU0sQ0FBQyx5QkFBeUIsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQXJDRCxzQkFBb0IsNENBQUs7Ozs7UUFLekI7WUFDRSxPQUFPLElB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QUFDLFNBQVM7O2lCQUMzQzs7Ozs7d0JBR0UsS0FBSyxTQUFDLE9BQU87NkJBU2IsS0FBSyxTQUFDLFlBQVk7MEJBUWxCLEtBQUssU0FBQyxTQUFTOzRCQUNmLEtBQUssU0FBQyxXQUFXOzBCQUNqQixLQUFLLFNBQUMsU0FBUzt5QkFDZixLQUFLLFNBQUMsUUFBUTt5QkFDZCxLQUFLLFNBQUMsUUFBUTt5QkFDZCxLQUFLLFNBQUMsUUFBUTt5QkFDZCxLQUFLO29DQUVMLEtBQUssU0FBQyxtQkFBbUI7c0NBQ3pCLE1BQU0sU0FBQyxxQkFBcUI7O0lBcUQvQixnQ0FBQztDQUFBLEFBdkZELElBdUZDO1NBakZZLHlCQUF5Qjs7O0lBbUJwQyw0Q0FBaUM7O0lBQ2pDLDhDQUFvQzs7SUFDcEMsNENBQWlDOztJQUNqQywyQ0FBaUM7O0lBQ2pDLDJDQUFnQzs7SUFDaEMsMkNBQWdDOztJQUNoQywyQ0FBa0M7O0lBRWxDLHNEQUE2RDs7SUFDN0Qsd0RBQTZFOztJQUU3RSx5Q0FBZTs7SUFDZiw2Q0FBOEM7Ozs7O0lBQzlDLHdDQUFvQjs7Ozs7SUFDcEIsMkNBQXVCOzs7OztJQUN2QixnREFBbUM7Ozs7O0lBQ25DLHVEQUF5QyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQ29weXJpZ2h0IDIwMjAgIFNlblggUy5BLlMuXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE9uRGVzdHJveSwgT25Jbml0LCBPdXRwdXQsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICcuLi8uLi8uLi91dGlscy9sb2dnZXInO1xuaW1wb3J0IHtHVFNMaWJ9IGZyb20gJy4uLy4uLy4uL3V0aWxzL2d0cy5saWInO1xuaW1wb3J0IHtQYXJhbX0gZnJvbSAnLi4vLi4vLi4vbW9kZWwvcGFyYW0nO1xuaW1wb3J0IHtPYnNlcnZhYmxlLCBTdWJqZWN0LCBTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICd3YXJwdmlldy10cmVlLXZpZXcnLFxuICB0ZW1wbGF0ZVVybDogJy4vd2FycC12aWV3LXRyZWUtdmlldy5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3dhcnAtdmlldy10cmVlLXZpZXcuY29tcG9uZW50LnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uU2hhZG93RG9tXG59KVxuZXhwb3J0IGNsYXNzIFdhcnBWaWV3VHJlZVZpZXdDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG5cbiAgQElucHV0KCdkZWJ1ZycpIHNldCBkZWJ1ZyhkZWJ1ZzogYm9vbGVhbikge1xuICAgIHRoaXMuX2RlYnVnID0gZGVidWc7XG4gICAgdGhpcy5MT0cuc2V0RGVidWcoZGVidWcpO1xuICB9XG5cbiAgZ2V0IGRlYnVnKCkge1xuICAgIHJldHVybiB0aGlzLl9kZWJ1ZztcbiAgfVxuXG4gIEBJbnB1dCgnaGlkZGVuRGF0YScpIHNldCBoaWRkZW5EYXRhKGhpZGRlbkRhdGE6IG51bWJlcltdKSB7XG4gICAgdGhpcy5faGlkZGVuRGF0YSA9IFsuLi5oaWRkZW5EYXRhXTtcbiAgfVxuXG4gIGdldCBoaWRkZW5EYXRhKCk6IG51bWJlcltdIHtcbiAgICByZXR1cm4gdGhpcy5faGlkZGVuRGF0YTtcbiAgfVxuXG4gIEBJbnB1dCgnb3B0aW9ucycpIG9wdGlvbnM6IFBhcmFtO1xuICBASW5wdXQoJ2d0c0ZpbHRlcicpIGd0c0ZpbHRlciA9ICd4JztcbiAgQElucHV0KCdndHNMaXN0JykgZ3RzTGlzdDogYW55W107XG4gIEBJbnB1dCgncGFyYW1zJykgcGFyYW1zOiBQYXJhbVtdO1xuICBASW5wdXQoJ2JyYW5jaCcpIGJyYW5jaCA9IGZhbHNlO1xuICBASW5wdXQoJ2hpZGRlbicpIGhpZGRlbiA9IGZhbHNlO1xuICBASW5wdXQoKSBldmVudHM6IE9ic2VydmFibGU8dm9pZD47XG5cbiAgQElucHV0KCdrYmRMYXN0S2V5UHJlc3NlZCcpIGtiZExhc3RLZXlQcmVzc2VkOiBzdHJpbmdbXSA9IFtdO1xuICBAT3V0cHV0KCd3YXJwVmlld1NlbGVjdGVkR1RTJykgd2FycFZpZXdTZWxlY3RlZEdUUyA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIGhpZGU6IGFueSA9IHt9O1xuICBpbml0T3BlbjogU3ViamVjdDx2b2lkPiA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gIHByaXZhdGUgTE9HOiBMb2dnZXI7XG4gIHByaXZhdGUgX2RlYnVnID0gZmFsc2U7XG4gIHByaXZhdGUgX2hpZGRlbkRhdGE6IG51bWJlcltdID0gW107XG4gIHByaXZhdGUgZXZlbnRzU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5MT0cgPSBuZXcgTG9nZ2VyKFdhcnBWaWV3VHJlZVZpZXdDb21wb25lbnQsIHRoaXMuZGVidWcpO1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5MT0cuZGVidWcoWyduZ09uSW5pdCddLCB0aGlzLmd0c0xpc3QpO1xuICAgIHRoaXMuZ3RzTGlzdC5mb3JFYWNoKChnLCBpbmRleCkgPT4ge1xuICAgICAgdGhpcy5oaWRlW2luZGV4ICsgJyddID0gZmFsc2U7XG4gICAgfSk7XG4gICAgdGhpcy5ldmVudHNTdWJzY3JpcHRpb24gPSB0aGlzLmV2ZW50cy5zdWJzY3JpYmUoKCkgPT4gdGhpcy5vcGVuKCkpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5ldmVudHNTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIHRvZ2dsZVZpc2liaWxpdHkoaW5kZXg6IG51bWJlcikge1xuICAgIHRoaXMuTE9HLmRlYnVnKFsndG9nZ2xlVmlzaWJpbGl0eSddLCBpbmRleCwgdGhpcy5oaWRlKTtcbiAgICB0aGlzLmhpZGVbaW5kZXggKyAnJ10gPSAhdGhpcy5oaWRlW2luZGV4ICsgJyddO1xuICB9XG5cbiAgaXNIaWRkZW4oaW5kZXg6IG51bWJlcikge1xuICAgIGlmICghIXRoaXMuaGlkZVtpbmRleCArICcnXSkge1xuICAgICAgcmV0dXJuIHRoaXMuaGlkZVtpbmRleCArICcnXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGlzR3RzKG5vZGUpIHtcbiAgICByZXR1cm4gR1RTTGliLmlzR3RzKG5vZGUpO1xuICB9XG5cbiAgd2FycFZpZXdTZWxlY3RlZEdUU0hhbmRsZXIoZXZlbnQpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3dhcnBWaWV3U2VsZWN0ZWRHVFMnXSwgZXZlbnQpO1xuICAgIHRoaXMud2FycFZpZXdTZWxlY3RlZEdUUy5lbWl0KGV2ZW50KTtcbiAgfVxuXG4gIG9wZW4oKSB7XG4gICAgdGhpcy5ndHNMaXN0LmZvckVhY2goKGcsIGluZGV4KSA9PiB7XG4gICAgICB0aGlzLmhpZGVbaW5kZXggKyAnJ10gPSB0cnVlO1xuICAgIH0pO1xuICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5pbml0T3Blbi5uZXh0KCkpO1xuICB9XG59XG4iXX0=