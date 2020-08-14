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
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { GTS } from '../../../model/GTS';
import { Logger } from '../../../utils/logger';
import { GTSLib } from '../../../utils/gts.lib';
import { ColorLib } from '../../../utils/color-lib';
import { Param } from '../../../model/param';
/**
 *
 */
export class WarpViewChipComponent {
    constructor() {
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
        this._hiddenData = hiddenData;
        this.LOG.debug(['hiddenData'], hiddenData, this._node, this._node.gts, this._node.gts.c);
        if (this._node && this._node.gts && this._node.gts.c) {
            this._node = Object.assign({}, this._node, { selected: this.hiddenData.indexOf(this._node.gts.id) === -1, label: GTSLib.serializeGtsMetadata(this._node.gts) });
            this.LOG.debug(['hiddenData'], this._node);
            this.colorizeChip();
        }
    }
    /**
     * @return {?}
     */
    get hiddenData() {
        return this._hiddenData;
    }
    /**
     * @param {?} gtsFilter
     * @return {?}
     */
    set gtsFilter(gtsFilter) {
        this._gtsFilter = gtsFilter;
        if (this._gtsFilter.slice(1) !== '') {
            this.setState(new RegExp(this._gtsFilter.slice(1), 'gi').test(GTSLib.serializeGtsMetadata(this._node.gts)));
        }
        else {
            this.setState(true);
        }
    }
    /**
     * @return {?}
     */
    get gtsFilter() {
        return this._gtsFilter;
    }
    /**
     * @param {?} kbdLastKeyPressed
     * @return {?}
     */
    set kbdLastKeyPressed(kbdLastKeyPressed) {
        this._kbdLastKeyPressed = kbdLastKeyPressed;
        if (kbdLastKeyPressed[0] === 'a') {
            this.setState(true);
        }
        if (kbdLastKeyPressed[0] === 'n') {
            this.setState(false);
        }
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this._node = Object.assign({}, this.node, { selected: this.hiddenData.indexOf(this.node.gts.id) === -1 });
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        if (this.gtsFilter.slice(1) !== '' && new RegExp(this.gtsFilter.slice(1), 'gi').test(GTSLib.serializeGtsMetadata(this._node.gts))
            || this.hiddenData.indexOf(this._node.gts.id) > -1) {
            this.setState(false);
        }
        this.colorizeChip();
    }
    /**
     * @private
     * @return {?}
     */
    colorizeChip() {
        if (this.chip) {
            if (this._node.selected && this.chip.nativeElement) {
                /** @type {?} */
                const c = ColorLib.getColor(this._node.gts.id, this.options.scheme);
                /** @type {?} */
                const color = (this.param || { datasetColor: c }).datasetColor || c;
                this.chip.nativeElement.style.setProperty('background-color', ColorLib.transparentize(color));
                this.chip.nativeElement.style.setProperty('border-color', color);
            }
            else {
                this.chip.nativeElement.style.setProperty('background-color', '#eeeeee');
            }
            this.refreshCounter++;
        }
    }
    /**
     * @param {?} obj
     * @return {?}
     */
    toArray(obj) {
        if (obj === undefined) {
            return [];
        }
        return Object.keys(obj).map((/**
         * @param {?} key
         * @return {?}
         */
        key => ({ name: key, value: obj[key] })));
    }
    /**
     * @param {?} event
     * @return {?}
     */
    switchPlotState(event) {
        event.preventDefault();
        this.setState(!this._node.selected);
        return false;
    }
    /**
     * @private
     * @param {?} state
     * @return {?}
     */
    setState(state) {
        if (this._node && this._node.gts) {
            this._node = Object.assign({}, this._node, { selected: state, label: GTSLib.serializeGtsMetadata(this._node.gts) });
            this.LOG.debug(['switchPlotState'], this._node);
            this.colorizeChip();
            this.warpViewSelectedGTS.emit(this._node);
        }
    }
}
WarpViewChipComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-chip',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div>\n   <span (click)=\"switchPlotState($event)\" *ngIf=\"_node && _node.gts && _node.gts.l\">\n     <i class=\"normal\" #chip></i>\n     <span class=\"gtsInfo\">\n       <span class='gts-classname'>&nbsp; {{_node.gts.c}}</span>\n       <span class='gts-separator'>&#x007B; </span>\n       <span *ngFor=\"let label of toArray(_node.gts.l); index as index; last as last\">\n         <span class='gts-labelname'>{{label.name}}</span>\n         <span class='gts-separator'>=</span>\n         <span class='gts-labelvalue'>{{label.value}}</span>\n         <span [hidden]=\"last\">, </span>\n       </span>\n       <span class=\"gts-separator\"> &#x007D; </span>\n         <span class='gts-separator'>&#x007B; </span>\n         <span *ngFor=\"let label of toArray(_node.gts.a); index as index; last as last\">\n           <span class='gts-attrname'>{{label.name}}</span>\n           <span class='gts-separator'>=</span>\n           <span class='gts-attrvalue'>{{label.value}}</span>\n           <span [hidden]=\"last\">, </span>\n         </span>\n       <span class=\"gts-separator\"> &#x007D;</span>\n       </span>\n   </span>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}:host div span{cursor:pointer}:host .normal{border-radius:50%;background-color:#bbb;display:inline-block;width:5px;height:5px;border:2px solid #454545;margin-top:auto;margin-bottom:auto;vertical-align:middle;cursor:pointer}"]
            }] }
];
/** @nocollapse */
WarpViewChipComponent.ctorParameters = () => [];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LWNoaXAuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHNlbngvd2FycHZpZXcvIiwic291cmNlcyI6WyJzcmMvbGliL2VsZW1lbnRzL3dhcnAtdmlldy1ndHMtdHJlZS93YXJwLXZpZXctY2hpcC93YXJwLXZpZXctY2hpcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUFnQixTQUFTLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQVUsTUFBTSxFQUFFLFNBQVMsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN0SSxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDdkMsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzdDLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUM5QyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDbEQsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLHNCQUFzQixDQUFDOzs7O0FBVzNDLE1BQU0sT0FBTyxxQkFBcUI7SUF5RWhDO1FBbkVnQixVQUFLLEdBQVUsSUFBSSxLQUFLLEVBQUUsQ0FBQztRQUN6QixZQUFPLEdBQVUsSUFBSSxLQUFLLEVBQUUsQ0FBQztRQW9EaEIsd0JBQW1CLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUdyRSxtQkFBYyxHQUFHLENBQUMsQ0FBQzs7UUFFbkIsZUFBVSxHQUFHLEdBQUcsQ0FBQztRQUNqQixXQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ2YsdUJBQWtCLEdBQWEsRUFBRSxDQUFDO1FBQ2xDLGdCQUFXLEdBQWEsRUFBRSxDQUFDO1FBQ25DLFVBQUssR0FBUTtZQUNYLFFBQVEsRUFBRSxJQUFJO1lBQ2QsR0FBRyxFQUFFLEdBQUc7U0FDVCxDQUFDO1FBR0EsSUFBSSxDQUFD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QUFDLENBQUMsaUJBQWlCLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDaEQsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3BCLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzNDO0lBQ0gsQ0FBQzs7O1lBcklGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsZUFBZTtnQkFDekIsa3dEQUE4QztnQkFFOUMsYUFBYSxFQUFFLGlCQUFpQixDQUFDLFNBQVM7O2FBQzNDOzs7OzttQkFHRSxTQUFTLFNBQUMsTUFBTSxFQUFFLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQzttQkFFakMsS0FBSyxTQUFDLE1BQU07bUJBQ1osS0FBSyxTQUFDLE1BQU07b0JBQ1osS0FBSyxTQUFDLE9BQU87c0JBQ2IsS0FBSyxTQUFDLFNBQVM7b0JBRWYsS0FBSyxTQUFDLE9BQU87eUJBU2IsS0FBSyxTQUFDLFlBQVk7d0JBa0JsQixLQUFLLFNBQUMsV0FBVztnQ0FhakIsS0FBSyxTQUFDLG1CQUFtQjtrQ0FVekIsTUFBTSxTQUFDLHFCQUFxQjs7OztJQXpEN0IscUNBQXFEOztJQUVyRCxxQ0FBNEI7O0lBQzVCLHFDQUF5Qjs7SUFDekIsc0NBQTJDOztJQUMzQyx3Q0FBK0M7O0lBb0QvQyxvREFBNkU7Ozs7O0lBRTdFLG9DQUFvQjs7Ozs7SUFDcEIsK0NBQTJCOzs7OztJQUUzQiwyQ0FBeUI7Ozs7O0lBQ3pCLHVDQUF1Qjs7Ozs7SUFDdkIsbURBQTBDOzs7OztJQUMxQyw0Q0FBbUM7O0lBQ25DLHNDQUdFIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqICBDb3B5cmlnaHQgMjAyMCAgU2VuWCBTLkEuUy5cbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqL1xuXG5pbXBvcnQge0FmdGVyVmlld0luaXQsIENvbXBvbmVudCwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25Jbml0LCBPdXRwdXQsIFZpZXdDaGlsZCwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtHVFN9IGZyb20gJy4uLy4uLy4uL21vZGVsL0dUUyc7XG5pbXBvcnQge0xvZ2dlcn0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvbG9nZ2VyJztcbmltcG9ydCB7R1RTTGlifSBmcm9tICcuLi8uLi8uLi91dGlscy9ndHMubGliJztcbmltcG9ydCB7Q29sb3JMaWJ9IGZyb20gJy4uLy4uLy4uL3V0aWxzL2NvbG9yLWxpYic7XG5pbXBvcnQge1BhcmFtfSBmcm9tICcuLi8uLi8uLi9tb2RlbC9wYXJhbSc7XG5cbi8qKlxuICpcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnd2FycHZpZXctY2hpcCcsXG4gIHRlbXBsYXRlVXJsOiAnLi93YXJwLXZpZXctY2hpcC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3dhcnAtdmlldy1jaGlwLmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLlNoYWRvd0RvbVxufSlcbmV4cG9ydCBjbGFzcyBXYXJwVmlld0NoaXBDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQge1xuXG4gIEBWaWV3Q2hpbGQoJ2NoaXAnLCB7c3RhdGljOiBmYWxzZX0pIGNoaXA6IEVsZW1lbnRSZWY7XG5cbiAgQElucHV0KCduYW1lJykgbmFtZTogc3RyaW5nO1xuICBASW5wdXQoJ25vZGUnKSBub2RlOiBhbnk7XG4gIEBJbnB1dCgncGFyYW0nKSBwYXJhbTogUGFyYW0gPSBuZXcgUGFyYW0oKTtcbiAgQElucHV0KCdvcHRpb25zJykgb3B0aW9uczogUGFyYW0gPSBuZXcgUGFyYW0oKTtcblxuICBASW5wdXQoJ2RlYnVnJykgc2V0IGRlYnVnKGRlYnVnOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZGVidWcgPSBkZWJ1ZztcbiAgICB0aGlzLkxPRy5zZXREZWJ1ZyhkZWJ1Zyk7XG4gIH1cblxuICBnZXQgZGVidWcoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RlYnVnO1xuICB9XG5cbiAgQElucHV0KCdoaWRkZW5EYXRhJykgc2V0IGhpZGRlbkRhdGEoaGlkZGVuRGF0YTogbnVtYmVyW10pIHtcbiAgICB0aGlzLl9oaWRkZW5EYXRhID0gaGlkZGVuRGF0YTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2hpZGRlbkRhdGEnXSwgaGlkZGVuRGF0YSwgdGhpcy5fbm9kZSwgdGhpcy5fbm9kZS5ndHMsIHRoaXMuX25vZGUuZ3RzLmMpO1xuICAgIGlmICh0aGlzLl9ub2RlICYmIHRoaXMuX25vZGUuZ3RzICYmIHRoaXMuX25vZGUuZ3RzLmMpIHtcbiAgICAgIHRoaXMuX25vZGUgPSB7XG4gICAgICAgIC4uLnRoaXMuX25vZGUsXG4gICAgICAgIHNlbGVjdGVkOiB0aGlzLmhpZGRlbkRhdGEuaW5kZXhPZih0aGlzLl9ub2RlLmd0cy5pZCkgPT09IC0xLFxuICAgICAgICBsYWJlbDogR1RTTGliLnNlcmlhbGl6ZUd0c01ldGFkYXRhKHRoaXMuX25vZGUuZ3RzKVxuICAgICAgfTtcbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsnaGlkZGVuRGF0YSddLCB0aGlzLl9ub2RlKTtcbiAgICAgIHRoaXMuY29sb3JpemVDaGlwKCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGhpZGRlbkRhdGEoKTogbnVtYmVyW10ge1xuICAgIHJldHVybiB0aGlzLl9oaWRkZW5EYXRhO1xuICB9XG5cbiAgQElucHV0KCdndHNGaWx0ZXInKSBzZXQgZ3RzRmlsdGVyKGd0c0ZpbHRlcjogc3RyaW5nKSB7XG4gICAgdGhpcy5fZ3RzRmlsdGVyID0gZ3RzRmlsdGVyO1xuICAgIGlmICh0aGlzLl9ndHNGaWx0ZXIuc2xpY2UoMSkgIT09ICcnKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKG5ldyBSZWdFeHAodGhpcy5fZ3RzRmlsdGVyLnNsaWNlKDEpLCAnZ2knKS50ZXN0KEdUU0xpYi5zZXJpYWxpemVHdHNNZXRhZGF0YSh0aGlzLl9ub2RlLmd0cykpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh0cnVlKTtcbiAgICB9XG4gIH1cblxuICBnZXQgZ3RzRmlsdGVyKCkge1xuICAgIHJldHVybiB0aGlzLl9ndHNGaWx0ZXI7XG4gIH1cblxuICBASW5wdXQoJ2tiZExhc3RLZXlQcmVzc2VkJykgc2V0IGtiZExhc3RLZXlQcmVzc2VkKGtiZExhc3RLZXlQcmVzc2VkOiBzdHJpbmdbXSkge1xuICAgIHRoaXMuX2tiZExhc3RLZXlQcmVzc2VkID0ga2JkTGFzdEtleVByZXNzZWQ7XG4gICAgaWYgKGtiZExhc3RLZXlQcmVzc2VkWzBdID09PSAnYScpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUodHJ1ZSk7XG4gICAgfVxuICAgIGlmIChrYmRMYXN0S2V5UHJlc3NlZFswXSA9PT0gJ24nKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKGZhbHNlKTtcbiAgICB9XG4gIH1cblxuICBAT3V0cHV0KCd3YXJwVmlld1NlbGVjdGVkR1RTJykgd2FycFZpZXdTZWxlY3RlZEdUUyA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIHByaXZhdGUgTE9HOiBMb2dnZXI7XG4gIHByaXZhdGUgcmVmcmVzaENvdW50ZXIgPSAwO1xuICAvLyB0aGUgZmlyc3QgY2hhcmFjdGVyIHRyaWdnZXJzIGNoYW5nZSBlYWNoIGZpbHRlciBhcHBseSB0byB0cmlnZ2VyIGV2ZW50cy4gaXQgbXVzdCBiZSBkaXNjYXJkZWQuXG4gIHByaXZhdGUgX2d0c0ZpbHRlciA9ICd4JztcbiAgcHJpdmF0ZSBfZGVidWcgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfa2JkTGFzdEtleVByZXNzZWQ6IHN0cmluZ1tdID0gW107XG4gIHByaXZhdGUgX2hpZGRlbkRhdGE6IG51bWJlcltdID0gW107XG4gIF9ub2RlOiBhbnkgPSB7XG4gICAgc2VsZWN0ZWQ6IHRydWUsXG4gICAgZ3RzOiBHVFMsXG4gIH07XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5MT0cgPSBuZXcgTG9nZ2VyKFdhcnBWaWV3Q2hpcENvbXBvbmVudCwgdGhpcy5kZWJ1Zyk7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLl9ub2RlID0gey4uLnRoaXMubm9kZSwgc2VsZWN0ZWQ6IHRoaXMuaGlkZGVuRGF0YS5pbmRleE9mKHRoaXMubm9kZS5ndHMuaWQpID09PSAtMX07XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgaWYgKHRoaXMuZ3RzRmlsdGVyLnNsaWNlKDEpICE9PSAnJyAmJiBuZXcgUmVnRXhwKHRoaXMuZ3RzRmlsdGVyLnNsaWNlKDEpLCAnZ2knKS50ZXN0KEdUU0xpYi5zZXJpYWxpemVHdHNNZXRhZGF0YSh0aGlzLl9ub2RlLmd0cykpXG4gICAgICB8fCB0aGlzLmhpZGRlbkRhdGEuaW5kZXhPZih0aGlzLl9ub2RlLmd0cy5pZCkgPiAtMSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZShmYWxzZSk7XG4gICAgfVxuICAgIHRoaXMuY29sb3JpemVDaGlwKCk7XG4gIH1cblxuICBwcml2YXRlIGNvbG9yaXplQ2hpcCgpIHtcbiAgICBpZiAodGhpcy5jaGlwKSB7XG4gICAgICBpZiAodGhpcy5fbm9kZS5zZWxlY3RlZCAmJiB0aGlzLmNoaXAubmF0aXZlRWxlbWVudCkge1xuICAgICAgICBjb25zdCBjID0gQ29sb3JMaWIuZ2V0Q29sb3IodGhpcy5fbm9kZS5ndHMuaWQsIHRoaXMub3B0aW9ucy5zY2hlbWUpO1xuICAgICAgICBjb25zdCBjb2xvciA9ICh0aGlzLnBhcmFtIHx8IHtkYXRhc2V0Q29sb3I6IGN9KS5kYXRhc2V0Q29sb3IgfHwgYztcbiAgICAgICAgdGhpcy5jaGlwLm5hdGl2ZUVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoJ2JhY2tncm91bmQtY29sb3InLCBDb2xvckxpYi50cmFuc3BhcmVudGl6ZShjb2xvcikpO1xuICAgICAgICB0aGlzLmNoaXAubmF0aXZlRWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eSgnYm9yZGVyLWNvbG9yJywgY29sb3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jaGlwLm5hdGl2ZUVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoJ2JhY2tncm91bmQtY29sb3InLCAnI2VlZWVlZScpO1xuICAgICAgfVxuICAgICAgdGhpcy5yZWZyZXNoQ291bnRlcisrO1xuICAgIH1cbiAgfVxuXG4gIHRvQXJyYXkob2JqKSB7XG4gICAgaWYgKG9iaiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIHJldHVybiBPYmplY3Qua2V5cyhvYmopLm1hcChrZXkgPT4gKHtuYW1lOiBrZXksIHZhbHVlOiBvYmpba2V5XX0pKTtcbiAgfVxuXG4gIHN3aXRjaFBsb3RTdGF0ZShldmVudDogVUlFdmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5zZXRTdGF0ZSghdGhpcy5fbm9kZS5zZWxlY3RlZCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRTdGF0ZShzdGF0ZTogYm9vbGVhbikge1xuICAgIGlmICh0aGlzLl9ub2RlICYmIHRoaXMuX25vZGUuZ3RzKSB7XG4gICAgICB0aGlzLl9ub2RlID0ge1xuICAgICAgICAuLi50aGlzLl9ub2RlLFxuICAgICAgICBzZWxlY3RlZDogc3RhdGUsXG4gICAgICAgIGxhYmVsOiBHVFNMaWIuc2VyaWFsaXplR3RzTWV0YWRhdGEodGhpcy5fbm9kZS5ndHMpXG4gICAgICB9O1xuICAgICAgdGhpcy5MT0cuZGVidWcoWydzd2l0Y2hQbG90U3RhdGUnXSwgdGhpcy5fbm9kZSk7XG4gICAgICB0aGlzLmNvbG9yaXplQ2hpcCgpO1xuICAgICAgdGhpcy53YXJwVmlld1NlbGVjdGVkR1RTLmVtaXQodGhpcy5fbm9kZSk7XG4gICAgfVxuICB9XG59XG4iXX0=