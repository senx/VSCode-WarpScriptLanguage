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
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { Logger } from '../../../utils/logger';
import { GTSLib } from '../../../utils/gts.lib';
import { Param } from '../../../model/param';
import { Observable, Subject } from 'rxjs';
export class WarpViewTreeViewComponent {
    constructor() {
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
     * @param {?} hiddenData
     * @return {?}
     */
    set hiddenData(hiddenData) {
        this._hiddenData = [...hiddenData];
    }
    /**
     * @return {?}
     */
    get hiddenData() {
        return this._hiddenData;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.LOG.debug(['ngOnInit'], this.gtsList);
        this.gtsList.forEach((/**
         * @param {?} g
         * @param {?} index
         * @return {?}
         */
        (g, index) => {
            this.hide[index + ''] = false;
        }));
        this.eventsSubscription = this.events.subscribe((/**
         * @return {?}
         */
        () => this.open()));
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.eventsSubscription.unsubscribe();
    }
    /**
     * @param {?} index
     * @return {?}
     */
    toggleVisibility(index) {
        this.LOG.debug(['toggleVisibility'], index, this.hide);
        this.hide[index + ''] = !this.hide[index + ''];
    }
    /**
     * @param {?} index
     * @return {?}
     */
    isHidden(index) {
        if (!!this.hide[index + '']) {
            return this.hide[index + ''];
        }
        else {
            return false;
        }
    }
    /**
     * @param {?} node
     * @return {?}
     */
    isGts(node) {
        return GTSLib.isGts(node);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    warpViewSelectedGTSHandler(event) {
        this.LOG.debug(['warpViewSelectedGTS'], event);
        this.warpViewSelectedGTS.emit(event);
    }
    /**
     * @return {?}
     */
    open() {
        this.gtsList.forEach((/**
         * @param {?} g
         * @param {?} index
         * @return {?}
         */
        (g, index) => {
            this.hide[index + ''] = true;
        }));
        setTimeout((/**
         * @return {?}
         */
        () => this.initOpen.next()));
    }
}
WarpViewTreeViewComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-tree-view',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"list\">\n  <ul *ngIf=\"gtsList\">\n    <li *ngFor=\"let gts of gtsList; index as index; first as first\" >\n      <warpview-chip\n        *ngIf=\"isGts(gts)\"\n        [options]=\"options\" (warpViewSelectedGTS)=\"warpViewSelectedGTSHandler($event)\" [param]=\"params[gts.id]\"\n        [node]=\"{gts: gts}\" [name]=\"gts.c\" [gtsFilter]=\"gtsFilter\" [debug]=\"debug\" [hiddenData]=\"hiddenData\"\n        [kbdLastKeyPressed]=\"kbdLastKeyPressed\"></warpview-chip>\n      <span *ngIf=\"!isGts(gts)\">\n        <span *ngIf=\"gts\">\n          <span *ngIf=\"branch\">\n            <span>\n            <span [ngClass]=\"{expanded:  hide[index + ''], collapsed: !hide[index + '']}\"\n                  (click)=\"toggleVisibility(index)\" [id]=\"'span-' + index\"> </span>\n                    <small (click)=\"toggleVisibility(index)\"> List of {{gts.length}}\n                      item{{gts.length > 1 ? 's' : ''}}</small>\n           </span>\n          </span>\n          <span *ngIf=\"!branch\">\n            <span class=\"stack-level\">\n              <span [ngClass]=\"{expanded: hide[index + ''], collapsed: !hide[index + '']}\"\n                    (click)=\"toggleVisibility(index)\" [id]=\"'span-' + index\"></span>\n              <span (click)=\"toggleVisibility(index)\">{{first ? '[TOP]' : '[' + (index + 1) + ']'}}&nbsp;\n                <small [id]=\"'inner-' + index\">List of {{gts.length}} item{{gts.length > 1 ? 's' : ''}}</small>\n              </span>\n                  </span>\n          </span>\n    <warpview-tree-view [gtsList]=\"gts\" [branch]=\"true\" *ngIf=\"isHidden(index)\"\n                        [debug]=\"debug\" [gtsFilter]=\"gtsFilter\" [params]=\"params\"\n                        [events]=\"initOpen.asObservable()\"\n                        [options]=\"options\" (warpViewSelectedGTS)=\"warpViewSelectedGTSHandler($event)\"\n                        [kbdLastKeyPressed]=\"kbdLastKeyPressed\" [hiddenData]=\"hiddenData\"></warpview-tree-view>\n        </span>\n      </span>\n    </li>\n  </ul>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host ul{margin:0;padding:0;list-style:none;border:none;overflow:hidden}:host li{color:var(--gts-stack-font-color,#000);position:relative;padding:0 0 0 20px;line-height:20px}:host .list,:host li .stack-level{font-size:1em;padding-top:5px}:host .list+div,:host li .stack-level+div{padding-left:25px}:host li .expanded{padding:1px 10px;margin-right:5px;background-image:var(--gts-tree-expanded-icon,url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==));background-position:center left;background-repeat:no-repeat}:host li .collapsed{padding:1px 10px;margin-right:5px;background-image:var(--gts-tree-collapsed-icon,url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=));background-repeat:no-repeat;background-position:center left}:host li .gtsInfo{white-space:normal;word-wrap:break-word}:host li .gtsInfo[disabled]{color:#aaa;cursor:not-allowed}:host li .normal{border-radius:50%;background-color:#bbb;display:inline-block}:host li i,:host li span{cursor:pointer}:host li .selected{background-color:#adf;font-weight:700;padding:1px 5px}"]
            }] }
];
/** @nocollapse */
WarpViewTreeViewComponent.ctorParameters = () => [];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LXRyZWUtdmlldy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VueC93YXJwdmlldy8iLCJzb3VyY2VzIjpbInNyYy9saWIvZWxlbWVudHMvd2FycC12aWV3LWd0cy10cmVlL3dhcnAtdmlldy10cmVlLXZpZXcvd2FycC12aWV3LXRyZWUtdmlldy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFxQixNQUFNLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDM0csT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzdDLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUM5QyxPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDM0MsT0FBTyxFQUFDLFVBQVUsRUFBRSxPQUFPLEVBQWUsTUFBTSxNQUFNLENBQUM7QUFRdkQsTUFBTSxPQUFPLHlCQUF5QjtJQXFDcEM7UUFqQm9CLGNBQVMsR0FBRyxHQUFHLENBQUM7UUFHbkIsV0FBTSxHQUFHLEtBQUssQ0FBQztRQUNmLFdBQU0sR0FBRyxLQUFLLENBQUM7UUFHSixzQkFBaUIsR0FBYSxFQUFFLENBQUM7UUFDOUIsd0JBQW1CLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUU3RSxTQUFJLEdBQVEsRUFBRSxDQUFDO1FBQ2YsYUFBUSxHQUFrQixJQUFJLE9BQU8sRUFBUSxDQUFDO1FBRXRDLFdBQU0sR0FBRyxLQUFLLENBQUM7UUFDZixnQkFBVyxHQUFhLEVBQUUsQ0FBQztRQUlqQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksTUFBTSxDQUFDLHlCQUF5QixFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMvRCxDQUFDOzs7OztJQXJDRCxJQUFvQixLQUFLLENB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c0JBUWxCLEtBQUssU0FBQyxTQUFTO3dCQUNmLEtBQUssU0FBQyxXQUFXO3NCQUNqQixLQUFLLFNBQUMsU0FBUztxQkFDZixLQUFLLFNBQUMsUUFBUTtxQkFDZCxLQUFLLFNBQUMsUUFBUTtxQkFDZCxLQUFLLFNBQUMsUUFBUTtxQkFDZCxLQUFLO2dDQUVMLEtBQUssU0FBQyxtQkFBbUI7a0NBQ3pCLE1BQU0sU0FBQyxxQkFBcUI7Ozs7SUFUN0IsNENBQWlDOztJQUNqQyw4Q0FBb0M7O0lBQ3BDLDRDQUFpQzs7SUFDakMsMkNBQWlDOztJQUNqQywyQ0FBZ0M7O0lBQ2hDLDJDQUFnQzs7SUFDaEMsMkNBQWtDOztJQUVsQyxzREFBNkQ7O0lBQzdELHdEQUE2RTs7SUFFN0UseUNBQWU7O0lBQ2YsNkNBQThDOzs7OztJQUM5Qyx3Q0FBb0I7Ozs7O0lBQ3BCLDJDQUF1Qjs7Ozs7SUFDdkIsZ0RBQW1DOzs7OztJQUNuQyx1REFBeUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogIENvcHlyaWdodCAyMDIwICBTZW5YIFMuQS5TLlxuICpcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCwgT3V0cHV0LCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0xvZ2dlcn0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvbG9nZ2VyJztcbmltcG9ydCB7R1RTTGlifSBmcm9tICcuLi8uLi8uLi91dGlscy9ndHMubGliJztcbmltcG9ydCB7UGFyYW19IGZyb20gJy4uLy4uLy4uL21vZGVsL3BhcmFtJztcbmltcG9ydCB7T2JzZXJ2YWJsZSwgU3ViamVjdCwgU3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnd2FycHZpZXctdHJlZS12aWV3JyxcbiAgdGVtcGxhdGVVcmw6ICcuL3dhcnAtdmlldy10cmVlLXZpZXcuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi93YXJwLXZpZXctdHJlZS12aWV3LmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLlNoYWRvd0RvbVxufSlcbmV4cG9ydCBjbGFzcyBXYXJwVmlld1RyZWVWaWV3Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuXG4gIEBJbnB1dCgnZGVidWcnKSBzZXQgZGVidWcoZGVidWc6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9kZWJ1ZyA9IGRlYnVnO1xuICAgIHRoaXMuTE9HLnNldERlYnVnKGRlYnVnKTtcbiAgfVxuXG4gIGdldCBkZWJ1ZygpIHtcbiAgICByZXR1cm4gdGhpcy5fZGVidWc7XG4gIH1cblxuICBASW5wdXQoJ2hpZGRlbkRhdGEnKSBzZXQgaGlkZGVuRGF0YShoaWRkZW5EYXRhOiBudW1iZXJbXSkge1xuICAgIHRoaXMuX2hpZGRlbkRhdGEgPSBbLi4uaGlkZGVuRGF0YV07XG4gIH1cblxuICBnZXQgaGlkZGVuRGF0YSgpOiBudW1iZXJbXSB7XG4gICAgcmV0dXJuIHRoaXMuX2hpZGRlbkRhdGE7XG4gIH1cblxuICBASW5wdXQoJ29wdGlvbnMnKSBvcHRpb25zOiBQYXJhbTtcbiAgQElucHV0KCdndHNGaWx0ZXInKSBndHNGaWx0ZXIgPSAneCc7XG4gIEBJbnB1dCgnZ3RzTGlzdCcpIGd0c0xpc3Q6IGFueVtdO1xuICBASW5wdXQoJ3BhcmFtcycpIHBhcmFtczogUGFyYW1bXTtcbiAgQElucHV0KCdicmFuY2gnKSBicmFuY2ggPSBmYWxzZTtcbiAgQElucHV0KCdoaWRkZW4nKSBoaWRkZW4gPSBmYWxzZTtcbiAgQElucHV0KCkgZXZlbnRzOiBPYnNlcnZhYmxlPHZvaWQ+O1xuXG4gIEBJbnB1dCgna2JkTGFzdEtleVByZXNzZWQnKSBrYmRMYXN0S2V5UHJlc3NlZDogc3RyaW5nW10gPSBbXTtcbiAgQE91dHB1dCgnd2FycFZpZXdTZWxlY3RlZEdUUycpIHdhcnBWaWV3U2VsZWN0ZWRHVFMgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBoaWRlOiBhbnkgPSB7fTtcbiAgaW5pdE9wZW46IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICBwcml2YXRlIExPRzogTG9nZ2VyO1xuICBwcml2YXRlIF9kZWJ1ZyA9IGZhbHNlO1xuICBwcml2YXRlIF9oaWRkZW5EYXRhOiBudW1iZXJbXSA9IFtdO1xuICBwcml2YXRlIGV2ZW50c1N1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuTE9HID0gbmV3IExvZ2dlcihXYXJwVmlld1RyZWVWaWV3Q29tcG9uZW50LCB0aGlzLmRlYnVnKTtcbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnbmdPbkluaXQnXSwgdGhpcy5ndHNMaXN0KTtcbiAgICB0aGlzLmd0c0xpc3QuZm9yRWFjaCgoZywgaW5kZXgpID0+IHtcbiAgICAgIHRoaXMuaGlkZVtpbmRleCArICcnXSA9IGZhbHNlO1xuICAgIH0pO1xuICAgIHRoaXMuZXZlbnRzU3Vic2NyaXB0aW9uID0gdGhpcy5ldmVudHMuc3Vic2NyaWJlKCgpID0+IHRoaXMub3BlbigpKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuZXZlbnRzU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICB0b2dnbGVWaXNpYmlsaXR5KGluZGV4OiBudW1iZXIpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3RvZ2dsZVZpc2liaWxpdHknXSwgaW5kZXgsIHRoaXMuaGlkZSk7XG4gICAgdGhpcy5oaWRlW2luZGV4ICsgJyddID0gIXRoaXMuaGlkZVtpbmRleCArICcnXTtcbiAgfVxuXG4gIGlzSGlkZGVuKGluZGV4OiBudW1iZXIpIHtcbiAgICBpZiAoISF0aGlzLmhpZGVbaW5kZXggKyAnJ10pIHtcbiAgICAgIHJldHVybiB0aGlzLmhpZGVbaW5kZXggKyAnJ107XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBpc0d0cyhub2RlKSB7XG4gICAgcmV0dXJuIEdUU0xpYi5pc0d0cyhub2RlKTtcbiAgfVxuXG4gIHdhcnBWaWV3U2VsZWN0ZWRHVFNIYW5kbGVyKGV2ZW50KSB7XG4gICAgdGhpcy5MT0cuZGVidWcoWyd3YXJwVmlld1NlbGVjdGVkR1RTJ10sIGV2ZW50KTtcbiAgICB0aGlzLndhcnBWaWV3U2VsZWN0ZWRHVFMuZW1pdChldmVudCk7XG4gIH1cblxuICBvcGVuKCkge1xuICAgIHRoaXMuZ3RzTGlzdC5mb3JFYWNoKChnLCBpbmRleCkgPT4ge1xuICAgICAgdGhpcy5oaWRlW2luZGV4ICsgJyddID0gdHJ1ZTtcbiAgICB9KTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuaW5pdE9wZW4ubmV4dCgpKTtcbiAgfVxufVxuIl19