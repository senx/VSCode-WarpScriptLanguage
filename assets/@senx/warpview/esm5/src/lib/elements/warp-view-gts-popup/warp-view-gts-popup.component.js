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
import { Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { DataModel } from '../../model/dataModel';
import { Logger } from '../../utils/logger';
import { GTSLib } from '../../utils/gts.lib';
import { WarpViewModalComponent } from '../warp-view-modal/warp-view-modal.component';
import { Param } from '../../model/param';
import deepEqual from 'deep-equal';
import { ChartLib } from '../../utils/chart-lib';
/**
 *
 */
var WarpViewGtsPopupComponent = /** @class */ (function () {
    function WarpViewGtsPopupComponent() {
        this.maxToShow = 5;
        this.warpViewSelectedGTS = new EventEmitter();
        this.warpViewModalOpen = new EventEmitter();
        this.warpViewModalClose = new EventEmitter();
        this.current = 0;
        // tslint:disable-next-line:variable-name
        this._gts = [];
        this._options = new Param();
        // tslint:disable-next-line:variable-name
        this._kbdLastKeyPressed = [];
        // tslint:disable-next-line:variable-name
        this._hiddenData = [];
        // tslint:disable-next-line:variable-name
        this._debug = false;
        this.displayed = [];
        this.modalOpenned = false;
        this.LOG = new Logger(WarpViewGtsPopupComponent, this.debug);
    }
    Object.defineProperty(WarpViewGtsPopupComponent.prototype, "options", {
        set: /**
         * @param {?} options
         * @return {?}
         */
        function (options) {
            this.LOG.debug(['onOptions'], options);
            if (typeof options === 'string') {
                options = JSON.parse(options);
            }
            if (!deepEqual(options, this._options)) {
                this.LOG.debug(['options', 'changed'], options);
                this._options = (/** @type {?} */ (ChartLib.mergeDeep(this._options, (/** @type {?} */ (options)))));
                this.prepareData();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarpViewGtsPopupComponent.prototype, "gtsList", {
        set: /**
         * @param {?} gtsList
         * @return {?}
         */
        function (gtsList) {
            this._gtsList = gtsList;
            this.LOG.debug(['_gtsList'], this._gtsList);
            this.prepareData();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarpViewGtsPopupComponent.prototype, "gtslist", {
        get: /**
         * @return {?}
         */
        function () {
            return this._gtsList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarpViewGtsPopupComponent.prototype, "debug", {
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
    Object.defineProperty(WarpViewGtsPopupComponent.prototype, "data", {
        get: /**
         * @return {?}
         */
        function () {
            return this._data;
        },
        set: /**
         * @param {?} data
         * @return {?}
         */
        function (data) {
            this.LOG.debug(['data'], data);
            if (data) {
                this._data = data;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarpViewGtsPopupComponent.prototype, "hiddenData", {
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
            this._hiddenData = hiddenData;
            this.prepareData();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarpViewGtsPopupComponent.prototype, "kbdLastKeyPressed", {
        get: /**
         * @return {?}
         */
        function () {
            return this._kbdLastKeyPressed;
        },
        set: /**
         * @param {?} kbdLastKeyPressed
         * @return {?}
         */
        function (kbdLastKeyPressed) {
            this._kbdLastKeyPressed = kbdLastKeyPressed;
            if (kbdLastKeyPressed[0] === 's' && !this.modalOpenned) {
                this.showPopup();
            }
            else if (this.modalOpenned) {
                switch (kbdLastKeyPressed[0]) {
                    case 'ArrowUp':
                    case 'j':
                        this.current = Math.max(0, this.current - 1);
                        this.prepareData();
                        break;
                    case 'ArrowDown':
                    case 'k':
                        this.current = Math.min(this._gts.length - 1, this.current + 1);
                        this.prepareData();
                        break;
                    case ' ':
                        this.warpViewSelectedGTS.emit({
                            gts: this._gts[this.current],
                            selected: this.hiddenData.indexOf(this._gts[this.current].id) > -1
                        });
                        break;
                    default:
                        return;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    WarpViewGtsPopupComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        this.prepareData();
    };
    /**
     * @return {?}
     */
    WarpViewGtsPopupComponent.prototype.onWarpViewModalOpen = /**
     * @return {?}
     */
    function () {
        this.modalOpenned = true;
        this.warpViewModalOpen.emit({});
    };
    /**
     * @return {?}
     */
    WarpViewGtsPopupComponent.prototype.onWarpViewModalClose = /**
     * @return {?}
     */
    function () {
        this.modalOpenned = false;
        this.warpViewModalClose.emit({});
    };
    /**
     * @return {?}
     */
    WarpViewGtsPopupComponent.prototype.isOpened = /**
     * @return {?}
     */
    function () {
        return this.modal.isOpened();
    };
    /**
     * @private
     * @return {?}
     */
    WarpViewGtsPopupComponent.prototype.showPopup = /**
     * @private
     * @return {?}
     */
    function () {
        this.current = 0;
        this.prepareData();
        this.modal.open();
    };
    /**
     * @return {?}
     */
    WarpViewGtsPopupComponent.prototype.close = /**
     * @return {?}
     */
    function () {
        this.modal.close();
    };
    /**
     * @private
     * @return {?}
     */
    WarpViewGtsPopupComponent.prototype.prepareData = /**
     * @private
     * @return {?}
     */
    function () {
        if (this._gtsList && this._gtsList.data) {
            this._gts = GTSLib.flatDeep([this._gtsList.data]);
            this.displayed = (/** @type {?} */ (this._gts.slice(Math.max(0, Math.min(this.current - this.maxToShow, this._gts.length - 2 * this.maxToShow)), Math.min(this._gts.length, this.current + this.maxToShow + Math.abs(Math.min(this.current - this.maxToShow, 0))))));
            this.LOG.debug(['prepareData'], this.displayed);
        }
    };
    /**
     * @param {?} gts
     * @return {?}
     */
    WarpViewGtsPopupComponent.prototype.isHidden = /**
     * @param {?} gts
     * @return {?}
     */
    function (gts) {
        return !this.displayed.find((/**
         * @param {?} g
         * @return {?}
         */
        function (g) { return !!gts ? gts.id === g.id : false; }));
    };
    WarpViewGtsPopupComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-gts-popup',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<warpview-modal [kbdLastKeyPressed]=\"kbdLastKeyPressed\"\n                modalTitle=\"GTS Selector\"\n                #modal\n                (warpViewModalClose)=\"onWarpViewModalClose()\"\n                (warpViewModalOpen)=\"onWarpViewModalOpen()\">\n  <div class=\"up-arrow\" *ngIf=\"this.current > 0\"></div>\n  <ul>\n    <li *ngFor=\"let g of _gts; index as index\"\n        [ngClass]=\"{ selected: current == index, hidden: isHidden(g.id) }\"\n    >\n      <warpview-chip [node]=\"{gts: g}\" [name]=\"g.c\" [hiddenData]=\"hiddenData\" [options]=\"_options\"></warpview-chip>\n    </li>\n  </ul>\n  <div class=\"down-arrow\" *ngIf=\"current < _gts.length - 1\"></div>\n</warpview-modal>\n",
                    encapsulation: ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewGtsPopupComponent.ctorParameters = function () { return []; };
    WarpViewGtsPopupComponent.propDecorators = {
        modal: [{ type: ViewChild, args: ['modal', { static: true },] }],
        options: [{ type: Input, args: ['options',] }],
        gtsList: [{ type: Input, args: ['gtsList',] }],
        debug: [{ type: Input, args: ['debug',] }],
        data: [{ type: Input, args: ['data',] }],
        hiddenData: [{ type: Input, args: ['hiddenData',] }],
        maxToShow: [{ type: Input, args: ['maxToShow',] }],
        kbdLastKeyPressed: [{ type: Input, args: ['kbdLastKeyPressed',] }],
        warpViewSelectedGTS: [{ type: Output, args: ['warpViewSelectedGTS',] }],
        warpViewModalOpen: [{ type: Output, args: ['warpViewModalOpen',] }],
        warpViewModalClose: [{ type: Output, args: ['warpViewModalClose',] }]
    };
    return WarpViewGtsPopupComponent;
}());
export { WarpViewGtsPopupComponent };
if (false) {
    /** @type {?} */
    WarpViewGtsPopupComponent.prototype.modal;
    /** @type {?} */
    WarpViewGtsPopupComponent.prototype.maxToShow;
    /** @type {?} */
    WarpViewGtsPopupComponent.prototype.warpViewSelectedGTS;
    /** @type {?} */
    WarpViewGtsPopupComponent.prototype.warpViewModalOpen;
    /** @type {?} */
    WarpViewGtsPopupComponent.prototype.warpViewModalClose;
    /** @type {?} */
    WarpViewGtsPopupComponent.prototype.current;
    /** @type {?} */
    WarpViewGtsPopupComponent.prototype._gts;
    /** @type {?} */
    WarpViewGtsPopupComponent.prototype._options;
    /**
     * @type {?}
     * @private
     */
    WarpViewGtsPopupComponent.prototype._kbdLastKeyPressed;
    /**
     * @type {?}
     * @private
     */
    WarpViewGtsPopupComponent.prototype._hiddenData;
    /**
     * @type {?}
     * @private
     */
    WarpViewGtsPopupComponent.prototype._debug;
    /**
     * @type {?}
     * @private
     */
    WarpViewGtsPopupComponent.prototype._gtsList;
    /**
     * @type {?}
     * @private
     */
    WarpViewGtsPopupComponent.prototype._data;
    /**
     * @type {?}
     * @private
     */
    WarpViewGtsPopupComponent.prototype.displayed;
    /**
     * @type {?}
     * @private
     */
    WarpViewGtsPopupComponent.prototype.modalOpenned;
    /**
     * @type {?}
     * @private
     */
    WarpViewGtsPopupComponent.prototype.LOG;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LWd0cy1wb3B1cC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VueC93YXJwdmlldy8iLCJzb3VyY2VzIjpbInNyYy9saWIvZWxlbWVudHMvd2FycC12aWV3LWd0cy1wb3B1cC93YXJwLXZpZXctZ3RzLXBvcHVwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBQWdCLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDbEgsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ2hELE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUMxQyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDM0MsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0sOENBQThDLENBQUM7QUFDcEYsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ3hDLE9BQU8sU0FBUyxNQUFNLFlBQVksQ0FBQztBQUNuQyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7Ozs7QUFLL0M7SUF1SEU7UUF6RG9CLGNBQVMsR0FBRyxDQUFDLENBQUM7UUFrQ0gsd0JBQW1CLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUNoRCxzQkFBaUIsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBQzNDLHVCQUFrQixHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFFM0UsWUFBTyxHQUFHLENBQUMsQ0FBQzs7UUFFWixTQUFJLEdBQVUsRUFBRSxDQUFDO1FBQ2pCLGFBQVEsR0FBVSxJQUFJLEtBQUssRUFBRSxDQUFDOztRQUd0Qix1QkFBa0IsR0FBYSxFQUFFLENBQUM7O1FBRWxDLGdCQUFXLEdBQWEsRUFBRSxD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QUNwQywwQ0FBa0U7O0lBdURsRSw4Q0FBa0M7O0lBa0NsQyx3REFBNkU7O0lBQzdFLHNEQUF5RTs7SUFDekUsdURBQTJFOztJQUUzRSw0Q0FBWTs7SUFFWix5Q0FBaUI7O0lBQ2pCLDZDQUE4Qjs7Ozs7SUFHOUIsdURBQTBDOzs7OztJQUUxQyxnREFBbUM7Ozs7O0lBRW5DLDJDQUF1Qjs7Ozs7SUFFdkIsNkNBQTRCOzs7OztJQUU1QiwwQ0FBeUI7Ozs7O0lBQ3pCLDhDQUE4Qjs7Ozs7SUFDOUIsaURBQTZCOzs7OztJQUM3Qix3Q0FBb0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogIENvcHlyaWdodCAyMDIwICBTZW5YIFMuQS5TLlxuICpcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICovXG5cbmltcG9ydCB7QWZ0ZXJWaWV3SW5pdCwgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPdXRwdXQsIFZpZXdDaGlsZCwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtEYXRhTW9kZWx9IGZyb20gJy4uLy4uL21vZGVsL2RhdGFNb2RlbCc7XG5pbXBvcnQge0xvZ2dlcn0gZnJvbSAnLi4vLi4vdXRpbHMvbG9nZ2VyJztcbmltcG9ydCB7R1RTTGlifSBmcm9tICcuLi8uLi91dGlscy9ndHMubGliJztcbmltcG9ydCB7V2FycFZpZXdNb2RhbENvbXBvbmVudH0gZnJvbSAnLi4vd2FycC12aWV3LW1vZGFsL3dhcnAtdmlldy1tb2RhbC5jb21wb25lbnQnO1xuaW1wb3J0IHtQYXJhbX0gZnJvbSAnLi4vLi4vbW9kZWwvcGFyYW0nO1xuaW1wb3J0IGRlZXBFcXVhbCBmcm9tICdkZWVwLWVxdWFsJztcbmltcG9ydCB7Q2hhcnRMaWJ9IGZyb20gJy4uLy4uL3V0aWxzL2NoYXJ0LWxpYic7XG5cbi8qKlxuICpcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnd2FycHZpZXctZ3RzLXBvcHVwJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3dhcnAtdmlldy1ndHMtcG9wdXAuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi93YXJwLXZpZXctZ3RzLXBvcHVwLmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLlNoYWRvd0RvbVxufSlcbmV4cG9ydCBjbGFzcyBXYXJwVmlld0d0c1BvcHVwQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCB7XG4gIEBWaWV3Q2hpbGQoJ21vZGFsJywge3N0YXRpYzogdHJ1ZX0pIG1vZGFsOiBXYXJwVmlld01vZGFsQ29tcG9uZW50O1xuXG4gIEBJbnB1dCgnb3B0aW9ucycpIHNldCBvcHRpb25zKG9wdGlvbnM6IFBhcmFtIHwgc3RyaW5nKSB7XG4gICAgdGhpcy5MT0cuZGVidWcoWydvbk9wdGlvbnMnXSwgb3B0aW9ucyk7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnc3RyaW5nJykge1xuICAgICAgb3B0aW9ucyA9IEpTT04ucGFyc2Uob3B0aW9ucyk7XG4gICAgfVxuICAgIGlmICghZGVlcEVxdWFsKG9wdGlvbnMsIHRoaXMuX29wdGlvbnMpKSB7XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ29wdGlvbnMnLCAnY2hhbmdlZCddLCBvcHRpb25zKTtcbiAgICAgIHRoaXMuX29wdGlvbnMgPSBDaGFydExpYi5tZXJnZURlZXAodGhpcy5fb3B0aW9ucywgb3B0aW9ucyBhcyBQYXJhbSkgYXMgUGFyYW07XG4gICAgICB0aGlzLnByZXBhcmVEYXRhKCk7XG4gICAgfVxuICB9XG5cbiAgQElucHV0KCdndHNMaXN0Jykgc2V0IGd0c0xpc3QoZ3RzTGlzdDogRGF0YU1vZGVsKSB7XG4gICAgdGhpcy5fZ3RzTGlzdCA9IGd0c0xpc3Q7XG4gICAgdGhpcy5MT0cuZGVidWcoWydfZ3RzTGlzdCddLCB0aGlzLl9ndHNMaXN0KTtcblxuICAgIHRoaXMucHJlcGFyZURhdGEoKTtcbiAgfVxuXG4gIGdldCBndHNsaXN0KCk6IERhdGFNb2RlbCB7XG4gICAgcmV0dXJuIHRoaXMuX2d0c0xpc3Q7XG4gIH1cblxuICBASW5wdXQoJ2RlYnVnJykgc2V0IGRlYnVnKGRlYnVnOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZGVidWcgPSBkZWJ1ZztcbiAgICB0aGlzLkxPRy5zZXREZWJ1ZyhkZWJ1Zyk7XG4gIH1cblxuICBnZXQgZGVidWcoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RlYnVnO1xuICB9XG5cbiAgQElucHV0KCdkYXRhJykgc2V0IGRhdGEoZGF0YTogRGF0YU1vZGVsKSB7XG4gICAgdGhpcy5MT0cuZGVidWcoWydkYXRhJ10sIGRhdGEpO1xuICAgIGlmIChkYXRhKSB7XG4gICAgICB0aGlzLl9kYXRhID0gZGF0YTtcbiAgICB9XG4gIH1cblxuICBnZXQgZGF0YSgpOiBEYXRhTW9kZWwge1xuICAgIHJldHVybiB0aGlzLl9kYXRhO1xuICB9XG5cblxuICBASW5wdXQoJ2hpZGRlbkRhdGEnKSBzZXQgaGlkZGVuRGF0YShoaWRkZW5EYXRhOiBudW1iZXJbXSkge1xuICAgIHRoaXMuX2hpZGRlbkRhdGEgPSBoaWRkZW5EYXRhO1xuICAgIHRoaXMucHJlcGFyZURhdGEoKTtcbiAgfVxuXG4gIGdldCBoaWRkZW5EYXRhKCk6IG51bWJlcltdIHtcbiAgICByZXR1cm4gdGhpcy5faGlkZGVuRGF0YTtcbiAgfVxuXG4gIEBJbnB1dCgnbWF4VG9TaG93JykgbWF4VG9TaG93ID0gNTtcblxuICBASW5wdXQoJ2tiZExhc3RLZXlQcmVzc2VkJykgc2V0IGtiZExhc3RLZXlQcmVzc2VkKGtiZExhc3RLZXlQcmVzc2VkOiBzdHJpbmdbXSkge1xuICAgIHRoaXMuX2tiZExhc3RLZXlQcmVzc2VkID0ga2JkTGFzdEtleVByZXNzZWQ7XG4gICAgaWYgKGtiZExhc3RLZXlQcmVzc2VkWzBdID09PSAncycgJiYgIXRoaXMubW9kYWxPcGVubmVkKSB7XG4gICAgICB0aGlzLnNob3dQb3B1cCgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5tb2RhbE9wZW5uZWQpIHtcbiAgICAgIHN3aXRjaCAoa2JkTGFzdEtleVByZXNzZWRbMF0pIHtcbiAgICAgICAgY2FzZSdBcnJvd1VwJzpcbiAgICAgICAgY2FzZSdqJzpcbiAgICAgICAgICB0aGlzLmN1cnJlbnQgPSBNYXRoLm1heCgwLCB0aGlzLmN1cnJlbnQgLSAxKTtcbiAgICAgICAgICB0aGlzLnByZXBhcmVEYXRhKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ0Fycm93RG93bic6XG4gICAgICAgIGNhc2UgJ2snOlxuICAgICAgICAgIHRoaXMuY3VycmVudCA9IE1hdGgubWluKHRoaXMuX2d0cy5sZW5ndGggLSAxLCB0aGlzLmN1cnJlbnQgKyAxKTtcbiAgICAgICAgICB0aGlzLnByZXBhcmVEYXRhKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJyAnOlxuICAgICAgICAgIHRoaXMud2FycFZpZXdTZWxlY3RlZEdUUy5lbWl0KHtcbiAgICAgICAgICAgIGd0czogdGhpcy5fZ3RzW3RoaXMuY3VycmVudF0sXG4gICAgICAgICAgICBzZWxlY3RlZDogdGhpcy5oaWRkZW5EYXRhLmluZGV4T2YodGhpcy5fZ3RzW3RoaXMuY3VycmVudF0uaWQpID4gLTFcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0IGtiZExhc3RLZXlQcmVzc2VkKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5fa2JkTGFzdEtleVByZXNzZWQ7XG4gIH1cblxuICBAT3V0cHV0KCd3YXJwVmlld1NlbGVjdGVkR1RTJykgd2FycFZpZXdTZWxlY3RlZEdUUyA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCd3YXJwVmlld01vZGFsT3BlbicpIHdhcnBWaWV3TW9kYWxPcGVuID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoJ3dhcnBWaWV3TW9kYWxDbG9zZScpIHdhcnBWaWV3TW9kYWxDbG9zZSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIGN1cnJlbnQgPSAwO1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZVxuICBfZ3RzOiBhbnlbXSA9IFtdO1xuICBfb3B0aW9uczogUGFyYW0gPSBuZXcgUGFyYW0oKTtcblxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZVxuICBwcml2YXRlIF9rYmRMYXN0S2V5UHJlc3NlZDogc3RyaW5nW10gPSBbXTtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWVcbiAgcHJpdmF0ZSBfaGlkZGVuRGF0YTogbnVtYmVyW10gPSBbXTtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWVcbiAgcHJpdmF0ZSBfZGVidWcgPSBmYWxzZTtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWVcbiAgcHJpdmF0ZSBfZ3RzTGlzdDogRGF0YU1vZGVsO1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZVxuICBwcml2YXRlIF9kYXRhOiBEYXRhTW9kZWw7XG4gIHByaXZhdGUgZGlzcGxheWVkOiBhbnlbXSA9IFtdO1xuICBwcml2YXRlIG1vZGFsT3Blbm5lZCA9IGZhbHNlO1xuICBwcml2YXRlIExPRzogTG9nZ2VyO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuTE9HID0gbmV3IExvZ2dlcihXYXJwVmlld0d0c1BvcHVwQ29tcG9uZW50LCB0aGlzLmRlYnVnKTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLnByZXBhcmVEYXRhKCk7XG4gIH1cblxuICBvbldhcnBWaWV3TW9kYWxPcGVuKCkge1xuICAgIHRoaXMubW9kYWxPcGVubmVkID0gdHJ1ZTtcbiAgICB0aGlzLndhcnBWaWV3TW9kYWxPcGVuLmVtaXQoe30pO1xuICB9XG5cbiAgb25XYXJwVmlld01vZGFsQ2xvc2UoKSB7XG4gICAgdGhpcy5tb2RhbE9wZW5uZWQgPSBmYWxzZTtcbiAgICB0aGlzLndhcnBWaWV3TW9kYWxDbG9zZS5lbWl0KHt9KTtcbiAgfVxuXG4gIHB1YmxpYyBpc09wZW5lZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gdGhpcy5tb2RhbC5pc09wZW5lZCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBzaG93UG9wdXAoKSB7XG4gICAgdGhpcy5jdXJyZW50ID0gMDtcbiAgICB0aGlzLnByZXBhcmVEYXRhKCk7XG4gICAgdGhpcy5tb2RhbC5vcGVuKCk7XG4gIH1cblxuICBwdWJsaWMgY2xvc2UoKSB7XG4gICAgdGhpcy5tb2RhbC5jbG9zZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBwcmVwYXJlRGF0YSgpIHtcbiAgICBpZiAodGhpcy5fZ3RzTGlzdCAmJiB0aGlzLl9ndHNMaXN0LmRhdGEpIHtcbiAgICAgIHRoaXMuX2d0cyA9IEdUU0xpYi5mbGF0RGVlcChbdGhpcy5fZ3RzTGlzdC5kYXRhXSk7XG4gICAgICB0aGlzLmRpc3BsYXllZCA9IHRoaXMuX2d0cy5zbGljZShcbiAgICAgICAgTWF0aC5tYXgoMCwgTWF0aC5taW4odGhpcy5jdXJyZW50IC0gdGhpcy5tYXhUb1Nob3csIHRoaXMuX2d0cy5sZW5ndGggLSAyICogdGhpcy5tYXhUb1Nob3cpKSxcbiAgICAgICAgTWF0aC5taW4odGhpcy5fZ3RzLmxlbmd0aCwgdGhpcy5jdXJyZW50ICsgdGhpcy5tYXhUb1Nob3cgKyBNYXRoLmFicyhNYXRoLm1pbih0aGlzLmN1cnJlbnQgLSB0aGlzLm1heFRvU2hvdywgMCkpKVxuICAgICAgKSBhcyBhbnlbXTtcbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsncHJlcGFyZURhdGEnXSwgdGhpcy5kaXNwbGF5ZWQpO1xuICAgIH1cbiAgfVxuXG4gIGlzSGlkZGVuKGd0cykge1xuICAgIHJldHVybiAhdGhpcy5kaXNwbGF5ZWQuZmluZChnID0+ICEhZ3RzID8gZ3RzLmlkID09PSBnLmlkIDogZmFsc2UpO1xuICB9XG59XG4iXX0=