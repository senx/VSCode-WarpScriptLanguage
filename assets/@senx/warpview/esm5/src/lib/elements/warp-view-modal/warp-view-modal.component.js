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
import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewEncapsulation } from '@angular/core';
var WarpViewModalComponent = /** @class */ (function () {
    function WarpViewModalComponent(el) {
        this.el = el;
        this.modalTitle = '';
        this.kbdLastKeyPressed = [];
        this.warpViewModalOpen = new EventEmitter();
        this.warpViewModalClose = new EventEmitter();
        this.opened = false;
    }
    /**
     * @return {?}
     */
    WarpViewModalComponent.prototype.open = /**
     * @return {?}
     */
    function () {
        this.el.nativeElement.style.display = 'block';
        this.el.nativeElement.style.zIndex = '999999';
        this.opened = true;
        this.warpViewModalOpen.emit({});
    };
    /**
     * @return {?}
     */
    WarpViewModalComponent.prototype.close = /**
     * @return {?}
     */
    function () {
        this.el.nativeElement.style.display = 'none';
        this.el.nativeElement.style.zIndex = '-1';
        this.opened = false;
        this.warpViewModalClose.emit({});
    };
    /**
     * @return {?}
     */
    WarpViewModalComponent.prototype.isOpened = /**
     * @return {?}
     */
    function () {
        var _this = this;
        return new Promise((/**
         * @param {?} resolve
         * @return {?}
         */
        function (resolve) {
            resolve(_this.opened);
        }));
    };
    /**
     * @param {?} $event
     * @return {?}
     */
    WarpViewModalComponent.prototype.handleKeyDown = /**
     * @param {?} $event
     * @return {?}
     */
    function ($event) {
        if ('Escape' === $event[0]) {
            this.close();
        }
    };
    /**
     * @return {?}
     */
    WarpViewModalComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.el.nativeElement.addEventListener('click', (/**
         * @param {?} event
         * @return {?}
         */
        function (event) {
            if (event.path[0].nodeName === 'WARP-VIEW-MODAL') {
                _this.close();
            }
        }));
    };
    WarpViewModalComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-modal',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"popup\">\n  <div class=\"header\">\n    <div class=\"title\" [innerHTML]=\"modalTitle\"></div>\n    <div class=\"close\" (click)=\"close()\">&times;</div>\n  </div>\n  <div class=\"body\">\n    <ng-content></ng-content>\n  </div>\n</div>\n",
                    encapsulation: ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host{position:fixed;top:0;left:0;z-index:0;display:none;width:100%;height:100%;overflow:hidden;outline:0;background-color:rgba(0,0,0,.3)}:host .popup{position:relative;width:100%;height:auto;background-color:var(--warp-view-popup-bg-color);top:10%;z-index:999999;background-clip:padding-box;border:1px solid var(--warp-view-popup-border-color);border-radius:.3rem;display:-webkit-box;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;flex-direction:column;pointer-events:auto;outline:0;margin:1.75rem auto}@media (min-width:576px){:host .popup{max-width:800px}}:host .popup .header{background-color:var(--warp-view-popup-header-bg-color);display:-webkit-box;display:flex;-webkit-box-align:start;align-items:flex-start;-webkit-box-pack:justify;justify-content:space-between;padding:1rem;border-bottom:1px solid #e9ecef;border-top-left-radius:.3rem;border-top-right-radius:.3rem}:host .popup .header .title{margin-bottom:0;line-height:1.5;color:var(--warp-view-popup-title-color)}:host .popup .header .close{padding:1rem;margin:-1rem -1rem -1rem auto;cursor:pointer;color:var(--warp-view-popup-close-color)}:host .popup .body{position:relative;background-color:var(--warp-view-popup-body-bg-color);color:var(--warp-view-popup-body-color);height:auto;padding:10px}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewModalComponent.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    WarpViewModalComponent.propDecorators = {
        modalTitle: [{ type: Input, args: ['modalTitle',] }],
        kbdLastKeyPressed: [{ type: Input, args: ['kbdLastKeyPressed',] }],
        warpViewModalOpen: [{ type: Output, args: ['warpViewModalOpen',] }],
        warpViewModalClose: [{ type: Output, args: ['warpViewModalClose',] }],
        handleKeyDown: [{ type: HostListener, args: ['kbdLastKeyPressed', ['$event'],] }]
    };
    return WarpViewModalComponent;
}());
export { WarpViewModalComponent };
if (false) {
    /** @type {?} */
    WarpViewModalComponent.prototype.modalTitle;
    /** @type {?} */
    WarpViewModalComponent.prototype.kbdLastKeyPressed;
    /** @type {?} */
    WarpViewModalComponent.prototype.warpViewModalOpen;
    /** @type {?} */
    WarpViewModalComponent.prototype.warpViewModalClose;
    /**
     * @type {?}
     * @private
     */
    WarpViewModalComponent.prototype.opened;
    /** @type {?} */
    WarpViewModalComponent.prototype.el;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LW1vZGFsLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzZW54L3dhcnB2aWV3LyIsInNvdXJjZXMiOlsic3JjL2xpYi9lbGVtZW50cy93YXJwLXZpZXctbW9kYWwvd2FycC12aWV3LW1vZGFsLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBQWdCLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRWpJO0lBNENFLGdDQUFtQixFQUFjO1FBQWQsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQW5DWixlQUFVLEdBQUcsRUFBRSxDQUFDO1FBQ1Qsc0JBQWlCLEdBQWEsRUFBRSxDQUFDO1FBRWhDLHNCQUFpQixHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFDM0MsdUJBQWtCLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUVuRSxXQUFNLEdBQUcsS0FBSyxDQUFDO0lBOEJ2QixDQUFDOzs7O0lBNUJNLHFDQUFJOzs7SUFBWDtRQUNFLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQzlDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDO1FBQzlDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ25CLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDbEMsQ0FBQzs7OztJQUVNLHNDQUFLOzs7SUFBWjtRQUNFLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQzdDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQzFDLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDbkMsQ0FBQzs7OztJQUVNLHlDQUFROzs7SUFBZjtRQUFBLGlCQUlDO1FBSEMsT0FBTyxJQUFJLE9BQU87Ozs7UUFBVSxVQUFBLE9BQU87WUFDakMsT0FBTyxDQUFDLEtBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN2QixDQUFDLEVBQUMsQ0FBQztJQUNMLENBQUM7Ozs7O0lBR0QsOENBQWE7Ozs7SUFEYixVQUNjLE1BQWdCO1FBQzVCLElBQUksUUFBUSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUMxQixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDZDtJQUNILENBQUM7Ozs7SUFLRCxnREFBZTs7O0lBQWY7UUFBQSxpQkFNQztRQUxDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLE9BQU87Ozs7UUFBRSxVQUFDLEtBQVU7WUFDekQsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsS0FBSyxpQkFBaUIsRUFBRTtnQkFDaEQsS0FBSSxDQUFDLEtBQUssRUFBRSxDQUFDO2FBQ2Q7UUFDSCxDQUFDLEVBQUMsQ0FBQztJQUNMLENBQUM7O2dCQXJERixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLGdCQUFnQjtvQkFDMUIsKzRCQUErQztvQkFFL0MsYUFBYSxFQUFFLGlCQUFpQixDQUFDLFNBQVM7O2lCQUMzQzs7OztnQkFQaUMsVUFBVTs7OzZCQVd6QyxLQUFLLFNBQUMsWUFBWTtvQ0FDbEIsS0FBSyxTQUFDLG1CQUFtQjtvQ0FFekIsTUFBTSxTQUFDLG1CQUFtQjtxQ0FDMUIsTUFBTSxTQUFDLG9CQUFvQjtnQ0F3QjNCLFlBQVksU0FBQyxtQkFBbUIsRUFBRSxDQUFDLFFBQVEsQ0FBQzs7SUFpQi9DLDZCQUFDO0NBQUEsQUF0REQsSUFzREM7U0FoRFksc0JBQXNCOzs7SUFHakMsNENBQXFDOztJQUNyQyxtREFBNkQ7O0lBRTdELG1EQUF5RTs7SUFDekUsb0RBQTJFOzs7OztJQUUzRSx3Q0FBdUI7O0lBNkJYLG9DQUFxQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQ29weXJpZ2h0IDIwMjAgIFNlblggUy5BLlMuXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKi9cblxuaW1wb3J0IHtBZnRlclZpZXdJbml0LCBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSG9zdExpc3RlbmVyLCBJbnB1dCwgT3V0cHV0LCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3dhcnB2aWV3LW1vZGFsJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3dhcnAtdmlldy1tb2RhbC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3dhcnAtdmlldy1tb2RhbC5jb21wb25lbnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5TaGFkb3dEb21cbn0pXG5leHBvcnQgY2xhc3MgV2FycFZpZXdNb2RhbENvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xuXG5cbiAgQElucHV0KCdtb2RhbFRpdGxlJykgbW9kYWxUaXRsZSA9ICcnO1xuICBASW5wdXQoJ2tiZExhc3RLZXlQcmVzc2VkJykga2JkTGFzdEtleVByZXNzZWQ6IHN0cmluZ1tdID0gW107XG5cbiAgQE91dHB1dCgnd2FycFZpZXdNb2RhbE9wZW4nKSB3YXJwVmlld01vZGFsT3BlbiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCd3YXJwVmlld01vZGFsQ2xvc2UnKSB3YXJwVmlld01vZGFsQ2xvc2UgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBwcml2YXRlIG9wZW5lZCA9IGZhbHNlO1xuXG4gIHB1YmxpYyBvcGVuKCkge1xuICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuc3R5bGUuekluZGV4ID0gJzk5OTk5OSc7XG4gICAgdGhpcy5vcGVuZWQgPSB0cnVlO1xuICAgIHRoaXMud2FycFZpZXdNb2RhbE9wZW4uZW1pdCh7fSk7XG4gIH1cblxuICBwdWJsaWMgY2xvc2UoKSB7XG4gICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LnN0eWxlLnpJbmRleCA9ICctMSc7XG4gICAgdGhpcy5vcGVuZWQgPSBmYWxzZTtcbiAgICB0aGlzLndhcnBWaWV3TW9kYWxDbG9zZS5lbWl0KHt9KTtcbiAgfVxuXG4gIHB1YmxpYyBpc09wZW5lZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2U8Ym9vbGVhbj4ocmVzb2x2ZSA9PiB7XG4gICAgICByZXNvbHZlKHRoaXMub3BlbmVkKTtcbiAgICB9KTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2tiZExhc3RLZXlQcmVzc2VkJywgWyckZXZlbnQnXSlcbiAgaGFuZGxlS2V5RG93bigkZXZlbnQ6IHN0cmluZ1tdKSB7XG4gICAgaWYgKCdFc2NhcGUnID09PSAkZXZlbnRbMF0pIHtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9XG4gIH1cblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgZWw6IEVsZW1lbnRSZWYpIHtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQ6IGFueSkgPT4ge1xuICAgICAgaWYgKGV2ZW50LnBhdGhbMF0ubm9kZU5hbWUgPT09ICdXQVJQLVZJRVctTU9EQUwnKSB7XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIl19