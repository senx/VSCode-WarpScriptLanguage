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
export class WarpViewGtsPopupComponent {
    constructor() {
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
    /**
     * @param {?} options
     * @return {?}
     */
    set options(options) {
        this.LOG.debug(['onOptions'], options);
        if (typeof options === 'string') {
            options = JSON.parse(options);
        }
        if (!deepEqual(options, this._options)) {
            this.LOG.debug(['options', 'changed'], options);
            this._options = (/** @type {?} */ (ChartLib.mergeDeep(this._options, (/** @type {?} */ (options)))));
            this.prepareData();
        }
    }
    /**
     * @param {?} gtsList
     * @return {?}
     */
    set gtsList(gtsList) {
        this._gtsList = gtsList;
        this.LOG.debug(['_gtsList'], this._gtsList);
        this.prepareData();
    }
    /**
     * @return {?}
     */
    get gtslist() {
        return this._gtsList;
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
     * @param {?} data
     * @return {?}
     */
    set data(data) {
        this.LOG.debug(['data'], data);
        if (data) {
            this._data = data;
        }
    }
    /**
     * @return {?}
     */
    get data() {
        return this._data;
    }
    /**
     * @param {?} hiddenData
     * @return {?}
     */
    set hiddenData(hiddenData) {
        this._hiddenData = hiddenData;
        this.prepareData();
    }
    /**
     * @return {?}
     */
    get hiddenData() {
        return this._hiddenData;
    }
    /**
     * @param {?} kbdLastKeyPressed
     * @return {?}
     */
    set kbdLastKeyPressed(kbdLastKeyPressed) {
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
    }
    /**
     * @return {?}
     */
    get kbdLastKeyPressed() {
        return this._kbdLastKeyPressed;
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.prepareData();
    }
    /**
     * @return {?}
     */
    onWarpViewModalOpen() {
        this.modalOpenned = true;
        this.warpViewModalOpen.emit({});
    }
    /**
     * @return {?}
     */
    onWarpViewModalClose() {
        this.modalOpenned = false;
        this.warpViewModalClose.emit({});
    }
    /**
     * @return {?}
     */
    isOpened() {
        return this.modal.isOpened();
    }
    /**
     * @private
     * @return {?}
     */
    showPopup() {
        this.current = 0;
        this.prepareData();
        this.modal.open();
    }
    /**
     * @return {?}
     */
    close() {
        this.modal.close();
    }
    /**
     * @private
     * @return {?}
     */
    prepareData() {
        if (this._gtsList && this._gtsList.data) {
            this._gts = GTSLib.flatDeep([this._gtsList.data]);
            this.displayed = (/** @type {?} */ (this._gts.slice(Math.max(0, Math.min(this.current - this.maxToShow, this._gts.length - 2 * this.maxToShow)), Math.min(this._gts.length, this.current + this.maxToShow + Math.abs(Math.min(this.current - this.maxToShow, 0))))));
            this.LOG.debug(['prepareData'], this.displayed);
        }
    }
    /**
     * @param {?} gts
     * @return {?}
     */
    isHidden(gts) {
        return !this.displayed.find((/**
         * @param {?} g
         * @return {?}
         */
        g => !!gts ? gts.id === g.id : false));
    }
}
WarpViewGtsPopupComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-gts-popup',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<warpview-modal [kbdLastKeyPressed]=\"kbdLastKeyPressed\"\n                modalTitle=\"GTS Selector\"\n                #modal\n                (warpViewModalClose)=\"onWarpViewModalClose()\"\n                (warpViewModalOpen)=\"onWarpViewModalOpen()\">\n  <div class=\"up-arrow\" *ngIf=\"this.current > 0\"></div>\n  <ul>\n    <li *ngFor=\"let g of _gts; index as index\"\n        [ngClass]=\"{ selected: current == index, hidden: isHidden(g.id) }\"\n    >\n      <warpview-chip [node]=\"{gts: g}\" [name]=\"g.c\" [hiddenData]=\"hiddenData\" [options]=\"_options\"></warpview-chip>\n    </li>\n  </ul>\n  <div class=\"down-arrow\" *ngIf=\"current < _gts.length - 1\"></div>\n</warpview-modal>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}"]
            }] }
];
/** @nocollapse */
WarpViewGtsPopupComponent.ctorParameters = () => [];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LWd0cy1wb3B1cC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VueC93YXJwdmlldy8iLCJzb3VyY2VzIjpbInNyYy9saWIvZWxlbWVudHMvd2FycC12aWV3LWd0cy1wb3B1cC93YXJwLXZpZXctZ3RzLXBvcHVwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBQWdCLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDbEgsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ2hELE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUMxQyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDM0MsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0sOENBQThDLENBQUM7QUFDcEYsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ3hDLE9BQU8sU0FBUyxNQUFNLFlBQVksQ0FBQztBQUNuQyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7Ozs7QUFXL0MsTUFBTSxPQUFPLHlCQUF5QjtJQWlIcEM7UUF6RG9CLGNBQVMsR0FBRyxDQUFDLENBQUM7UUFrQ0gsd0JBQW1CLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUNoRCxzQkFBaUIsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBQzNDLHVCQUFrQixHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFFM0UsWUFBTyxHQUFHLENBQUMsQ0FBQzs7UUFFWixTQUFJLEdBQVUsRUFBRSxDQUFDO1FBQ2pCLGFBQVEsR0FBVSxJQUFJLEtBQUssRUFBRSxDQUFDOztRQUd0Qix1QkFBa0IsR0FBYSxFQUFFLENBQUM7O1FBRWxD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OztJQUU1QiwwQ0FBeUI7Ozs7O0lBQ3pCLDhDQUE4Qjs7Ozs7SUFDOUIsaURBQTZCOzs7OztJQUM3Qix3Q0FBb0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogIENvcHlyaWdodCAyMDIwICBTZW5YIFMuQS5TLlxuICpcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICovXG5cbmltcG9ydCB7QWZ0ZXJWaWV3SW5pdCwgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPdXRwdXQsIFZpZXdDaGlsZCwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtEYXRhTW9kZWx9IGZyb20gJy4uLy4uL21vZGVsL2RhdGFNb2RlbCc7XG5pbXBvcnQge0xvZ2dlcn0gZnJvbSAnLi4vLi4vdXRpbHMvbG9nZ2VyJztcbmltcG9ydCB7R1RTTGlifSBmcm9tICcuLi8uLi91dGlscy9ndHMubGliJztcbmltcG9ydCB7V2FycFZpZXdNb2RhbENvbXBvbmVudH0gZnJvbSAnLi4vd2FycC12aWV3LW1vZGFsL3dhcnAtdmlldy1tb2RhbC5jb21wb25lbnQnO1xuaW1wb3J0IHtQYXJhbX0gZnJvbSAnLi4vLi4vbW9kZWwvcGFyYW0nO1xuaW1wb3J0IGRlZXBFcXVhbCBmcm9tICdkZWVwLWVxdWFsJztcbmltcG9ydCB7Q2hhcnRMaWJ9IGZyb20gJy4uLy4uL3V0aWxzL2NoYXJ0LWxpYic7XG5cbi8qKlxuICpcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnd2FycHZpZXctZ3RzLXBvcHVwJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3dhcnAtdmlldy1ndHMtcG9wdXAuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi93YXJwLXZpZXctZ3RzLXBvcHVwLmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLlNoYWRvd0RvbVxufSlcbmV4cG9ydCBjbGFzcyBXYXJwVmlld0d0c1BvcHVwQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCB7XG4gIEBWaWV3Q2hpbGQoJ21vZGFsJywge3N0YXRpYzogdHJ1ZX0pIG1vZGFsOiBXYXJwVmlld01vZGFsQ29tcG9uZW50O1xuXG4gIEBJbnB1dCgnb3B0aW9ucycpIHNldCBvcHRpb25zKG9wdGlvbnM6IFBhcmFtIHwgc3RyaW5nKSB7XG4gICAgdGhpcy5MT0cuZGVidWcoWydvbk9wdGlvbnMnXSwgb3B0aW9ucyk7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnc3RyaW5nJykge1xuICAgICAgb3B0aW9ucyA9IEpTT04ucGFyc2Uob3B0aW9ucyk7XG4gICAgfVxuICAgIGlmICghZGVlcEVxdWFsKG9wdGlvbnMsIHRoaXMuX29wdGlvbnMpKSB7XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ29wdGlvbnMnLCAnY2hhbmdlZCddLCBvcHRpb25zKTtcbiAgICAgIHRoaXMuX29wdGlvbnMgPSBDaGFydExpYi5tZXJnZURlZXAodGhpcy5fb3B0aW9ucywgb3B0aW9ucyBhcyBQYXJhbSkgYXMgUGFyYW07XG4gICAgICB0aGlzLnByZXBhcmVEYXRhKCk7XG4gICAgfVxuICB9XG5cbiAgQElucHV0KCdndHNMaXN0Jykgc2V0IGd0c0xpc3QoZ3RzTGlzdDogRGF0YU1vZGVsKSB7XG4gICAgdGhpcy5fZ3RzTGlzdCA9IGd0c0xpc3Q7XG4gICAgdGhpcy5MT0cuZGVidWcoWydfZ3RzTGlzdCddLCB0aGlzLl9ndHNMaXN0KTtcblxuICAgIHRoaXMucHJlcGFyZURhdGEoKTtcbiAgfVxuXG4gIGdldCBndHNsaXN0KCk6IERhdGFNb2RlbCB7XG4gICAgcmV0dXJuIHRoaXMuX2d0c0xpc3Q7XG4gIH1cblxuICBASW5wdXQoJ2RlYnVnJykgc2V0IGRlYnVnKGRlYnVnOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZGVidWcgPSBkZWJ1ZztcbiAgICB0aGlzLkxPRy5zZXREZWJ1ZyhkZWJ1Zyk7XG4gIH1cblxuICBnZXQgZGVidWcoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RlYnVnO1xuICB9XG5cbiAgQElucHV0KCdkYXRhJykgc2V0IGRhdGEoZGF0YTogRGF0YU1vZGVsKSB7XG4gICAgdGhpcy5MT0cuZGVidWcoWydkYXRhJ10sIGRhdGEpO1xuICAgIGlmIChkYXRhKSB7XG4gICAgICB0aGlzLl9kYXRhID0gZGF0YTtcbiAgICB9XG4gIH1cblxuICBnZXQgZGF0YSgpOiBEYXRhTW9kZWwge1xuICAgIHJldHVybiB0aGlzLl9kYXRhO1xuICB9XG5cblxuICBASW5wdXQoJ2hpZGRlbkRhdGEnKSBzZXQgaGlkZGVuRGF0YShoaWRkZW5EYXRhOiBudW1iZXJbXSkge1xuICAgIHRoaXMuX2hpZGRlbkRhdGEgPSBoaWRkZW5EYXRhO1xuICAgIHRoaXMucHJlcGFyZURhdGEoKTtcbiAgfVxuXG4gIGdldCBoaWRkZW5EYXRhKCk6IG51bWJlcltdIHtcbiAgICByZXR1cm4gdGhpcy5faGlkZGVuRGF0YTtcbiAgfVxuXG4gIEBJbnB1dCgnbWF4VG9TaG93JykgbWF4VG9TaG93ID0gNTtcblxuICBASW5wdXQoJ2tiZExhc3RLZXlQcmVzc2VkJykgc2V0IGtiZExhc3RLZXlQcmVzc2VkKGtiZExhc3RLZXlQcmVzc2VkOiBzdHJpbmdbXSkge1xuICAgIHRoaXMuX2tiZExhc3RLZXlQcmVzc2VkID0ga2JkTGFzdEtleVByZXNzZWQ7XG4gICAgaWYgKGtiZExhc3RLZXlQcmVzc2VkWzBdID09PSAncycgJiYgIXRoaXMubW9kYWxPcGVubmVkKSB7XG4gICAgICB0aGlzLnNob3dQb3B1cCgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5tb2RhbE9wZW5uZWQpIHtcbiAgICAgIHN3aXRjaCAoa2JkTGFzdEtleVByZXNzZWRbMF0pIHtcbiAgICAgICAgY2FzZSdBcnJvd1VwJzpcbiAgICAgICAgY2FzZSdqJzpcbiAgICAgICAgICB0aGlzLmN1cnJlbnQgPSBNYXRoLm1heCgwLCB0aGlzLmN1cnJlbnQgLSAxKTtcbiAgICAgICAgICB0aGlzLnByZXBhcmVEYXRhKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ0Fycm93RG93bic6XG4gICAgICAgIGNhc2UgJ2snOlxuICAgICAgICAgIHRoaXMuY3VycmVudCA9IE1hdGgubWluKHRoaXMuX2d0cy5sZW5ndGggLSAxLCB0aGlzLmN1cnJlbnQgKyAxKTtcbiAgICAgICAgICB0aGlzLnByZXBhcmVEYXRhKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJyAnOlxuICAgICAgICAgIHRoaXMud2FycFZpZXdTZWxlY3RlZEdUUy5lbWl0KHtcbiAgICAgICAgICAgIGd0czogdGhpcy5fZ3RzW3RoaXMuY3VycmVudF0sXG4gICAgICAgICAgICBzZWxlY3RlZDogdGhpcy5oaWRkZW5EYXRhLmluZGV4T2YodGhpcy5fZ3RzW3RoaXMuY3VycmVudF0uaWQpID4gLTFcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0IGtiZExhc3RLZXlQcmVzc2VkKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5fa2JkTGFzdEtleVByZXNzZWQ7XG4gIH1cblxuICBAT3V0cHV0KCd3YXJwVmlld1NlbGVjdGVkR1RTJykgd2FycFZpZXdTZWxlY3RlZEdUUyA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCd3YXJwVmlld01vZGFsT3BlbicpIHdhcnBWaWV3TW9kYWxPcGVuID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoJ3dhcnBWaWV3TW9kYWxDbG9zZScpIHdhcnBWaWV3TW9kYWxDbG9zZSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIGN1cnJlbnQgPSAwO1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZVxuICBfZ3RzOiBhbnlbXSA9IFtdO1xuICBfb3B0aW9uczogUGFyYW0gPSBuZXcgUGFyYW0oKTtcblxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZVxuICBwcml2YXRlIF9rYmRMYXN0S2V5UHJlc3NlZDogc3RyaW5nW10gPSBbXTtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWVcbiAgcHJpdmF0ZSBfaGlkZGVuRGF0YTogbnVtYmVyW10gPSBbXTtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWVcbiAgcHJpdmF0ZSBfZGVidWcgPSBmYWxzZTtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWVcbiAgcHJpdmF0ZSBfZ3RzTGlzdDogRGF0YU1vZGVsO1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZVxuICBwcml2YXRlIF9kYXRhOiBEYXRhTW9kZWw7XG4gIHByaXZhdGUgZGlzcGxheWVkOiBhbnlbXSA9IFtdO1xuICBwcml2YXRlIG1vZGFsT3Blbm5lZCA9IGZhbHNlO1xuICBwcml2YXRlIExPRzogTG9nZ2VyO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuTE9HID0gbmV3IExvZ2dlcihXYXJwVmlld0d0c1BvcHVwQ29tcG9uZW50LCB0aGlzLmRlYnVnKTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLnByZXBhcmVEYXRhKCk7XG4gIH1cblxuICBvbldhcnBWaWV3TW9kYWxPcGVuKCkge1xuICAgIHRoaXMubW9kYWxPcGVubmVkID0gdHJ1ZTtcbiAgICB0aGlzLndhcnBWaWV3TW9kYWxPcGVuLmVtaXQoe30pO1xuICB9XG5cbiAgb25XYXJwVmlld01vZGFsQ2xvc2UoKSB7XG4gICAgdGhpcy5tb2RhbE9wZW5uZWQgPSBmYWxzZTtcbiAgICB0aGlzLndhcnBWaWV3TW9kYWxDbG9zZS5lbWl0KHt9KTtcbiAgfVxuXG4gIHB1YmxpYyBpc09wZW5lZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gdGhpcy5tb2RhbC5pc09wZW5lZCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBzaG93UG9wdXAoKSB7XG4gICAgdGhpcy5jdXJyZW50ID0gMDtcbiAgICB0aGlzLnByZXBhcmVEYXRhKCk7XG4gICAgdGhpcy5tb2RhbC5vcGVuKCk7XG4gIH1cblxuICBwdWJsaWMgY2xvc2UoKSB7XG4gICAgdGhpcy5tb2RhbC5jbG9zZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBwcmVwYXJlRGF0YSgpIHtcbiAgICBpZiAodGhpcy5fZ3RzTGlzdCAmJiB0aGlzLl9ndHNMaXN0LmRhdGEpIHtcbiAgICAgIHRoaXMuX2d0cyA9IEdUU0xpYi5mbGF0RGVlcChbdGhpcy5fZ3RzTGlzdC5kYXRhXSk7XG4gICAgICB0aGlzLmRpc3BsYXllZCA9IHRoaXMuX2d0cy5zbGljZShcbiAgICAgICAgTWF0aC5tYXgoMCwgTWF0aC5taW4odGhpcy5jdXJyZW50IC0gdGhpcy5tYXhUb1Nob3csIHRoaXMuX2d0cy5sZW5ndGggLSAyICogdGhpcy5tYXhUb1Nob3cpKSxcbiAgICAgICAgTWF0aC5taW4odGhpcy5fZ3RzLmxlbmd0aCwgdGhpcy5jdXJyZW50ICsgdGhpcy5tYXhUb1Nob3cgKyBNYXRoLmFicyhNYXRoLm1pbih0aGlzLmN1cnJlbnQgLSB0aGlzLm1heFRvU2hvdywgMCkpKVxuICAgICAgKSBhcyBhbnlbXTtcbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsncHJlcGFyZURhdGEnXSwgdGhpcy5kaXNwbGF5ZWQpO1xuICAgIH1cbiAgfVxuXG4gIGlzSGlkZGVuKGd0cykge1xuICAgIHJldHVybiAhdGhpcy5kaXNwbGF5ZWQuZmluZChnID0+ICEhZ3RzID8gZ3RzLmlkID09PSBnLmlkIDogZmFsc2UpO1xuICB9XG59XG4iXX0=