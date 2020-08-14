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
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { GTS } from '../../../model/GTS';
import { Logger } from '../../../utils/logger';
import { GTSLib } from '../../../utils/gts.lib';
import { ColorLib } from '../../../utils/color-lib';
import { Param } from '../../../model/param';
/**
 *
 */
var WarpViewChipComponent = /** @class */ (function () {
    function WarpViewChipComponent() {
        this.param = new Param();
        this.options = new Param();
        this.warpViewSelectedGTS = new EventEmitter();
        this.refreshCounter = 0;
        // the first character triggers change each filter apply to trigger events. it must be discarded.
        this._gtsFilter = 'x';
        this._debug = false;
        this._kbdLastKeyPressed = [];
        this._hiddenData = [];
        this._node = {
            selected: true,
            gts: GTS,
        };
        this.LOG = new Logger(WarpViewChipComponent, this.debug);
    }
    Object.defineProperty(WarpViewChipComponent.prototype, "debug", {
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
    Object.defineProperty(WarpViewChipComponent.prototype, "hiddenData", {
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
            this.LOG.debug(['hiddenData'], hiddenData, this._node, this._node.gts, this._node.gts.c);
            if (this._node && this._node.gts && this._node.gts.c) {
                this._node = tslib_1.__assign({}, this._node, { selected: this.hiddenData.indexOf(this._node.gts.id) === -1, label: GTSLib.serializeGtsMetadata(this._node.gts) });
                this.LOG.debug(['hiddenData'], this._node);
                this.colorizeChip();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarpViewChipComponent.prototype, "gtsFilter", {
        get: /**
         * @return {?}
         */
        function () {
            return this._gtsFilter;
        },
        set: /**
         * @param {?} gtsFilter
         * @return {?}
         */
        function (gtsFilter) {
            this._gtsFilter = gtsFilter;
            if (this._gtsFilter.slice(1) !== '') {
                this.setState(new RegExp(this._gtsFilter.slice(1), 'gi').test(GTSLib.serializeGtsMetadata(this._node.gts)));
            }
            else {
                this.setState(true);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarpViewChipComponent.prototype, "kbdLastKeyPressed", {
        set: /**
         * @param {?} kbdLastKeyPressed
         * @return {?}
         */
        function (kbdLastKeyPressed) {
            this._kbdLastKeyPressed = kbdLastKeyPressed;
            if (kbdLastKeyPressed[0] === 'a') {
                this.setState(true);
            }
            if (kbdLastKeyPressed[0] === 'n') {
                this.setState(false);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    WarpViewChipComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this._node = tslib_1.__assign({}, this.node, { selected: this.hiddenData.indexOf(this.node.gts.id) === -1 });
    };
    /**
     * @return {?}
     */
    WarpViewChipComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        if (this.gtsFilter.slice(1) !== '' && new RegExp(this.gtsFilter.slice(1), 'gi').test(GTSLib.serializeGtsMetadata(this._node.gts))
            || this.hiddenData.indexOf(this._node.gts.id) > -1) {
            this.setState(false);
        }
        this.colorizeChip();
    };
    /**
     * @private
     * @return {?}
     */
    WarpViewChipComponent.prototype.colorizeChip = /**
     * @private
     * @return {?}
     */
    function () {
        if (this.chip) {
            if (this._node.selected && this.chip.nativeElement) {
                /** @type {?} */
                var c = ColorLib.getColor(this._node.gts.id, this.options.scheme);
                /** @type {?} */
                var color = (this.param || { datasetColor: c }).datasetColor || c;
                this.chip.nativeElement.style.setProperty('background-color', ColorLib.transparentize(color));
                this.chip.nativeElement.style.setProperty('border-color', color);
            }
            else {
                this.chip.nativeElement.style.setProperty('background-color', '#eeeeee');
            }
            this.refreshCounter++;
        }
    };
    /**
     * @param {?} obj
     * @return {?}
     */
    WarpViewChipComponent.prototype.toArray = /**
     * @param {?} obj
     * @return {?}
     */
    function (obj) {
        if (obj === undefined) {
            return [];
        }
        return Object.keys(obj).map((/**
         * @param {?} key
         * @return {?}
         */
        function (key) { return ({ name: key, value: obj[key] }); }));
    };
    /**
     * @param {?} event
     * @return {?}
     */
    WarpViewChipComponent.prototype.switchPlotState = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        event.preventDefault();
        this.setState(!this._node.selected);
        return false;
    };
    /**
     * @private
     * @param {?} state
     * @return {?}
     */
    WarpViewChipComponent.prototype.setState = /**
     * @private
     * @param {?} state
     * @return {?}
     */
    function (state) {
        if (this._node && this._node.gts) {
            this._node = tslib_1.__assign({}, this._node, { selected: state, label: GTSLib.serializeGtsMetadata(this._node.gts) });
            this.LOG.debug(['switchPlotState'], this._node);
            this.colorizeChip();
            this.warpViewSelectedGTS.emit(this._node);
        }
    };
    WarpViewChipComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-chip',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div>\n   <span (click)=\"switchPlotState($event)\" *ngIf=\"_node && _node.gts && _node.gts.l\">\n     <i class=\"normal\" #chip></i>\n     <span class=\"gtsInfo\">\n       <span class='gts-classname'>&nbsp; {{_node.gts.c}}</span>\n       <span class='gts-separator'>&#x007B; </span>\n       <span *ngFor=\"let label of toArray(_node.gts.l); index as index; last as last\">\n         <span class='gts-labelname'>{{label.name}}</span>\n         <span class='gts-separator'>=</span>\n         <span class='gts-labelvalue'>{{label.value}}</span>\n         <span [hidden]=\"last\">, </span>\n       </span>\n       <span class=\"gts-separator\"> &#x007D; </span>\n         <span class='gts-separator'>&#x007B; </span>\n         <span *ngFor=\"let label of toArray(_node.gts.a); index as index; last as last\">\n           <span class='gts-attrname'>{{label.name}}</span>\n           <span class='gts-separator'>=</span>\n           <span class='gts-attrvalue'>{{label.value}}</span>\n           <span [hidden]=\"last\">, </span>\n         </span>\n       <span class=\"gts-separator\"> &#x007D;</span>\n       </span>\n   </span>\n</div>\n",
                    encapsulation: ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}:host div span{cursor:pointer}:host .normal{border-radius:50%;background-color:#bbb;display:inline-block;width:5px;height:5px;border:2px solid #454545;margin-top:auto;margin-bottom:auto;vertical-align:middle;cursor:pointer}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewChipComponent.ctorParameters = function () { return []; };
    WarpViewChipComponent.propDecorators = {
        chip: [{ type: ViewChild, args: ['chip', { static: false },] }],
        name: [{ type: Input, args: ['name',] }],
        node: [{ type: Input, args: ['node',] }],
        param: [{ type: Input, args: ['param',] }],
        options: [{ type: Input, args: ['options',] }],
        debug: [{ type: Input, args: ['debug',] }],
        hiddenData: [{ type: Input, args: ['hiddenData',] }],
        gtsFilter: [{ type: Input, args: ['gtsFilter',] }],
        kbdLastKeyPressed: [{ type: Input, args: ['kbdLastKeyPressed',] }],
        warpViewSelectedGTS: [{ type: Output, args: ['warpViewSelectedGTS',] }]
    };
    return WarpViewChipComponent;
}());
export { WarpViewChipComponent };
if (false) {
    /** @type {?} */
    WarpViewChipComponent.prototype.chip;
    /** @type {?} */
    WarpViewChipComponent.prototype.name;
    /** @type {?} */
    WarpViewChipComponent.prototype.node;
    /** @type {?} */
    WarpViewChipComponent.prototype.param;
    /** @type {?} */
    WarpViewChipComponent.prototype.options;
    /** @type {?} */
    WarpViewChipComponent.prototype.warpViewSelectedGTS;
    /**
     * @type {?}
     * @private
     */
    WarpViewChipComponent.prototype.LOG;
    /**
     * @type {?}
     * @private
     */
    WarpViewChipComponent.prototype.refreshCounter;
    /**
     * @type {?}
     * @private
     */
    WarpViewChipComponent.prototype._gtsFilter;
    /**
     * @type {?}
     * @private
     */
    WarpViewChipComponent.prototype._debug;
    /**
     * @type {?}
     * @private
     */
    WarpViewChipComponent.prototype._kbdLastKeyPressed;
    /**
     * @type {?}
     * @private
     */
    WarpViewChipComponent.prototype._hiddenData;
    /** @type {?} */
    WarpViewChipComponent.prototype._node;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LWNoaXAuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHNlbngvd2FycHZpZXcvIiwic291cmNlcyI6WyJzcmMvbGliL2VsZW1lbnRzL3dhcnAtdmlldy1ndHMtdHJlZS93YXJwLXZpZXctY2hpcC93YXJwLXZpZXctY2hpcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBZ0IsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFVLE1BQU0sRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdEksT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDOUMsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ2xELE9BQU8sRUFBQyxLQUFLLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQzs7OztBQUszQztJQStFRTtRQW5FZ0IsVUFBSyxHQUFVLElBQUksS0FBSyxFQUFFLENBQUM7UUFDekIsWUFBTyxHQUFVLElBQUksS0FBSyxFQUFFLENBQUM7UUFvRGhCLHdCQUFtQixHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFHckUsbUJBQWMsR0FBRyxDQUFDLENBQUM7O1FBRW5CLGVBQVUsR0FBRyxHQUFHLENBQUM7UUFDakIsV0FBTSxHQUFHLEtBQUssQ0FBQztRQUNmLHVCQUFrQixHQUFhLEVBQUUsQ0FBQztRQUNsQyxnQkFBVyxHQUFhLEVBQUUsQ0FBQztRQUNuQyxVQUFLLEdBQVE7WUFDWCxRQUFRLEVBQUUsSUFBSTtZQUNkLEdBQUcsRUFBRSxHQUFHO1NBQ1QsQ0FBQztRQUdBLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxN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LlMuXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKi9cblxuaW1wb3J0IHtBZnRlclZpZXdJbml0LCBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE9uSW5pdCwgT3V0cHV0LCBWaWV3Q2hpbGQsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7R1RTfSBmcm9tICcuLi8uLi8uLi9tb2RlbC9HVFMnO1xuaW1wb3J0IHtMb2dnZXJ9IGZyb20gJy4uLy4uLy4uL3V0aWxzL2xvZ2dlcic7XG5pbXBvcnQge0dUU0xpYn0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvZ3RzLmxpYic7XG5pbXBvcnQge0NvbG9yTGlifSBmcm9tICcuLi8uLi8uLi91dGlscy9jb2xvci1saWInO1xuaW1wb3J0IHtQYXJhbX0gZnJvbSAnLi4vLi4vLi4vbW9kZWwvcGFyYW0nO1xuXG4vKipcbiAqXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3dhcnB2aWV3LWNoaXAnLFxuICB0ZW1wbGF0ZVVybDogJy4vd2FycC12aWV3LWNoaXAuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi93YXJwLXZpZXctY2hpcC5jb21wb25lbnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5TaGFkb3dEb21cbn0pXG5leHBvcnQgY2xhc3MgV2FycFZpZXdDaGlwQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0IHtcblxuICBAVmlld0NoaWxkKCdjaGlwJywge3N0YXRpYzogZmFsc2V9KSBjaGlwOiBFbGVtZW50UmVmO1xuXG4gIEBJbnB1dCgnbmFtZScpIG5hbWU6IHN0cmluZztcbiAgQElucHV0KCdub2RlJykgbm9kZTogYW55O1xuICBASW5wdXQoJ3BhcmFtJykgcGFyYW06IFBhcmFtID0gbmV3IFBhcmFtKCk7XG4gIEBJbnB1dCgnb3B0aW9ucycpIG9wdGlvbnM6IFBhcmFtID0gbmV3IFBhcmFtKCk7XG5cbiAgQElucHV0KCdkZWJ1ZycpIHNldCBkZWJ1ZyhkZWJ1ZzogYm9vbGVhbikge1xuICAgIHRoaXMuX2RlYnVnID0gZGVidWc7XG4gICAgdGhpcy5MT0cuc2V0RGVidWcoZGVidWcpO1xuICB9XG5cbiAgZ2V0IGRlYnVnKCkge1xuICAgIHJldHVybiB0aGlzLl9kZWJ1ZztcbiAgfVxuXG4gIEBJbnB1dCgnaGlkZGVuRGF0YScpIHNldCBoaWRkZW5EYXRhKGhpZGRlbkRhdGE6IG51bWJlcltdKSB7XG4gICAgdGhpcy5faGlkZGVuRGF0YSA9IGhpZGRlbkRhdGE7XG4gICAgdGhpcy5MT0cuZGVidWcoWydoaWRkZW5EYXRhJ10sIGhpZGRlbkRhdGEsIHRoaXMuX25vZGUsIHRoaXMuX25vZGUuZ3RzLCB0aGlzLl9ub2RlLmd0cy5jKTtcbiAgICBpZiAodGhpcy5fbm9kZSAmJiB0aGlzLl9ub2RlLmd0cyAmJiB0aGlzLl9ub2RlLmd0cy5jKSB7XG4gICAgICB0aGlzLl9ub2RlID0ge1xuICAgICAgICAuLi50aGlzLl9ub2RlLFxuICAgICAgICBzZWxlY3RlZDogdGhpcy5oaWRkZW5EYXRhLmluZGV4T2YodGhpcy5fbm9kZS5ndHMuaWQpID09PSAtMSxcbiAgICAgICAgbGFiZWw6IEdUU0xpYi5zZXJpYWxpemVHdHNNZXRhZGF0YSh0aGlzLl9ub2RlLmd0cylcbiAgICAgIH07XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2hpZGRlbkRhdGEnXSwgdGhpcy5fbm9kZSk7XG4gICAgICB0aGlzLmNvbG9yaXplQ2hpcCgpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBoaWRkZW5EYXRhKCk6IG51bWJlcltdIHtcbiAgICByZXR1cm4gdGhpcy5faGlkZGVuRGF0YTtcbiAgfVxuXG4gIEBJbnB1dCgnZ3RzRmlsdGVyJykgc2V0IGd0c0ZpbHRlcihndHNGaWx0ZXI6IHN0cmluZykge1xuICAgIHRoaXMuX2d0c0ZpbHRlciA9IGd0c0ZpbHRlcjtcbiAgICBpZiAodGhpcy5fZ3RzRmlsdGVyLnNsaWNlKDEpICE9PSAnJykge1xuICAgICAgdGhpcy5zZXRTdGF0ZShuZXcgUmVnRXhwKHRoaXMuX2d0c0ZpbHRlci5zbGljZSgxKSwgJ2dpJykudGVzdChHVFNMaWIuc2VyaWFsaXplR3RzTWV0YWRhdGEodGhpcy5fbm9kZS5ndHMpKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUodHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGd0c0ZpbHRlcigpIHtcbiAgICByZXR1cm4gdGhpcy5fZ3RzRmlsdGVyO1xuICB9XG5cbiAgQElucHV0KCdrYmRMYXN0S2V5UHJlc3NlZCcpIHNldCBrYmRMYXN0S2V5UHJlc3NlZChrYmRMYXN0S2V5UHJlc3NlZDogc3RyaW5nW10pIHtcbiAgICB0aGlzLl9rYmRMYXN0S2V5UHJlc3NlZCA9IGtiZExhc3RLZXlQcmVzc2VkO1xuICAgIGlmIChrYmRMYXN0S2V5UHJlc3NlZFswXSA9PT0gJ2EnKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHRydWUpO1xuICAgIH1cbiAgICBpZiAoa2JkTGFzdEtleVByZXNzZWRbMF0gPT09ICduJykge1xuICAgICAgdGhpcy5zZXRTdGF0ZShmYWxzZSk7XG4gICAgfVxuICB9XG5cbiAgQE91dHB1dCgnd2FycFZpZXdTZWxlY3RlZEdUUycpIHdhcnBWaWV3U2VsZWN0ZWRHVFMgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBwcml2YXRlIExPRzogTG9nZ2VyO1xuICBwcml2YXRlIHJlZnJlc2hDb3VudGVyID0gMDtcbiAgLy8gdGhlIGZpcnN0IGNoYXJhY3RlciB0cmlnZ2VycyBjaGFuZ2UgZWFjaCBmaWx0ZXIgYXBwbHkgdG8gdHJpZ2dlciBldmVudHMuIGl0IG11c3QgYmUgZGlzY2FyZGVkLlxuICBwcml2YXRlIF9ndHNGaWx0ZXIgPSAneCc7XG4gIHByaXZhdGUgX2RlYnVnID0gZmFsc2U7XG4gIHByaXZhdGUgX2tiZExhc3RLZXlQcmVzc2VkOiBzdHJpbmdbXSA9IFtdO1xuICBwcml2YXRlIF9oaWRkZW5EYXRhOiBudW1iZXJbXSA9IFtdO1xuICBfbm9kZTogYW55ID0ge1xuICAgIHNlbGVjdGVkOiB0cnVlLFxuICAgIGd0czogR1RTLFxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuTE9HID0gbmV3IExvZ2dlcihXYXJwVmlld0NoaXBDb21wb25lbnQsIHRoaXMuZGVidWcpO1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5fbm9kZSA9IHsuLi50aGlzLm5vZGUsIHNlbGVjdGVkOiB0aGlzLmhpZGRlbkRhdGEuaW5kZXhPZih0aGlzLm5vZGUuZ3RzLmlkKSA9PT0gLTF9O1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGlmICh0aGlzLmd0c0ZpbHRlci5zbGljZSgxKSAhPT0gJycgJiYgbmV3IFJlZ0V4cCh0aGlzLmd0c0ZpbHRlci5zbGljZSgxKSwgJ2dpJykudGVzdChHVFNMaWIuc2VyaWFsaXplR3RzTWV0YWRhdGEodGhpcy5fbm9kZS5ndHMpKVxuICAgICAgfHwgdGhpcy5oaWRkZW5EYXRhLmluZGV4T2YodGhpcy5fbm9kZS5ndHMuaWQpID4gLTEpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoZmFsc2UpO1xuICAgIH1cbiAgICB0aGlzLmNvbG9yaXplQ2hpcCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBjb2xvcml6ZUNoaXAoKSB7XG4gICAgaWYgKHRoaXMuY2hpcCkge1xuICAgICAgaWYgKHRoaXMuX25vZGUuc2VsZWN0ZWQgJiYgdGhpcy5jaGlwLm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgY29uc3QgYyA9IENvbG9yTGliLmdldENvbG9yKHRoaXMuX25vZGUuZ3RzLmlkLCB0aGlzLm9wdGlvbnMuc2NoZW1lKTtcbiAgICAgICAgY29uc3QgY29sb3IgPSAodGhpcy5wYXJhbSB8fCB7ZGF0YXNldENvbG9yOiBjfSkuZGF0YXNldENvbG9yIHx8IGM7XG4gICAgICAgIHRoaXMuY2hpcC5uYXRpdmVFbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KCdiYWNrZ3JvdW5kLWNvbG9yJywgQ29sb3JMaWIudHJhbnNwYXJlbnRpemUoY29sb3IpKTtcbiAgICAgICAgdGhpcy5jaGlwLm5hdGl2ZUVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoJ2JvcmRlci1jb2xvcicsIGNvbG9yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY2hpcC5uYXRpdmVFbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KCdiYWNrZ3JvdW5kLWNvbG9yJywgJyNlZWVlZWUnKTtcbiAgICAgIH1cbiAgICAgIHRoaXMucmVmcmVzaENvdW50ZXIrKztcbiAgICB9XG4gIH1cblxuICB0b0FycmF5KG9iaikge1xuICAgIGlmIChvYmogPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5tYXAoa2V5ID0+ICh7bmFtZToga2V5LCB2YWx1ZTogb2JqW2tleV19KSk7XG4gIH1cblxuICBzd2l0Y2hQbG90U3RhdGUoZXZlbnQ6IFVJRXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMuc2V0U3RhdGUoIXRoaXMuX25vZGUuc2VsZWN0ZWQpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0U3RhdGUoc3RhdGU6IGJvb2xlYW4pIHtcbiAgICBpZiAodGhpcy5fbm9kZSAmJiB0aGlzLl9ub2RlLmd0cykge1xuICAgICAgdGhpcy5fbm9kZSA9IHtcbiAgICAgICAgLi4udGhpcy5fbm9kZSxcbiAgICAgICAgc2VsZWN0ZWQ6IHN0YXRlLFxuICAgICAgICBsYWJlbDogR1RTTGliLnNlcmlhbGl6ZUd0c01ldGFkYXRhKHRoaXMuX25vZGUuZ3RzKVxuICAgICAgfTtcbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsnc3dpdGNoUGxvdFN0YXRlJ10sIHRoaXMuX25vZGUpO1xuICAgICAgdGhpcy5jb2xvcml6ZUNoaXAoKTtcbiAgICAgIHRoaXMud2FycFZpZXdTZWxlY3RlZEdUUy5lbWl0KHRoaXMuX25vZGUpO1xuICAgIH1cbiAgfVxufVxuIl19