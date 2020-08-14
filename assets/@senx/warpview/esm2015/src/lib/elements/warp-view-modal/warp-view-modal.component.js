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
export class WarpViewModalComponent {
    /**
     * @param {?} el
     */
    constructor(el) {
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
    open() {
        this.el.nativeElement.style.display = 'block';
        this.el.nativeElement.style.zIndex = '999999';
        this.opened = true;
        this.warpViewModalOpen.emit({});
    }
    /**
     * @return {?}
     */
    close() {
        this.el.nativeElement.style.display = 'none';
        this.el.nativeElement.style.zIndex = '-1';
        this.opened = false;
        this.warpViewModalClose.emit({});
    }
    /**
     * @return {?}
     */
    isOpened() {
        return new Promise((/**
         * @param {?} resolve
         * @return {?}
         */
        resolve => {
            resolve(this.opened);
        }));
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    handleKeyDown($event) {
        if ('Escape' === $event[0]) {
            this.close();
        }
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.el.nativeElement.addEventListener('click', (/**
         * @param {?} event
         * @return {?}
         */
        (event) => {
            if (event.path[0].nodeName === 'WARP-VIEW-MODAL') {
                this.close();
            }
        }));
    }
}
WarpViewModalComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-modal',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"popup\">\n  <div class=\"header\">\n    <div class=\"title\" [innerHTML]=\"modalTitle\"></div>\n    <div class=\"close\" (click)=\"close()\">&times;</div>\n  </div>\n  <div class=\"body\">\n    <ng-content></ng-content>\n  </div>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host{position:fixed;top:0;left:0;z-index:0;display:none;width:100%;height:100%;overflow:hidden;outline:0;background-color:rgba(0,0,0,.3)}:host .popup{position:relative;width:100%;height:auto;background-color:var(--warp-view-popup-bg-color);top:10%;z-index:999999;background-clip:padding-box;border:1px solid var(--warp-view-popup-border-color);border-radius:.3rem;display:-webkit-box;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;flex-direction:column;pointer-events:auto;outline:0;margin:1.75rem auto}@media (min-width:576px){:host .popup{max-width:800px}}:host .popup .header{background-color:var(--warp-view-popup-header-bg-color);display:-webkit-box;display:flex;-webkit-box-align:start;align-items:flex-start;-webkit-box-pack:justify;justify-content:space-between;padding:1rem;border-bottom:1px solid #e9ecef;border-top-left-radius:.3rem;border-top-right-radius:.3rem}:host .popup .header .title{margin-bottom:0;line-height:1.5;color:var(--warp-view-popup-title-color)}:host .popup .header .close{padding:1rem;margin:-1rem -1rem -1rem auto;cursor:pointer;color:var(--warp-view-popup-close-color)}:host .popup .body{position:relative;background-color:var(--warp-view-popup-body-bg-color);color:var(--warp-view-popup-body-color);height:auto;padding:10px}"]
            }] }
];
/** @nocollapse */
WarpViewModalComponent.ctorParameters = () => [
    { type: ElementRef }
];
WarpViewModalComponent.propDecorators = {
    modalTitle: [{ type: Input, args: ['modalTitle',] }],
    kbdLastKeyPressed: [{ type: Input, args: ['kbdLastKeyPressed',] }],
    warpViewModalOpen: [{ type: Output, args: ['warpViewModalOpen',] }],
    warpViewModalClose: [{ type: Output, args: ['warpViewModalClose',] }],
    handleKeyDown: [{ type: HostListener, args: ['kbdLastKeyPressed', ['$event'],] }]
};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LW1vZGFsLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzZW54L3dhcnB2aWV3LyIsInNvdXJjZXMiOlsic3JjL2xpYi9lbGVtZW50cy93YXJwLXZpZXctbW9kYWwvd2FycC12aWV3LW1vZGFsLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBQWdCLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBUWpJLE1BQU0sT0FBTyxzQkFBc0I7Ozs7SUFzQ2pDLFlBQW1CLEVBQWM7UUFBZCxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBbkNaLGVBQVUsR0FBRyxFQUFFLENBQUM7UUFDVCxzQkFBaUIsR0FBYSxFQUFFLENBQUM7UUFFaEMsc0JBQWlCLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUMzQyx1QkFBa0IsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBRW5FLFdBQU0sR0FBRyxLQUFLLENBQUM7SUE4QnZCLENBQUM7Ozs7SUE1Qk0sSUFBSTtRQUNULElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQzlDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDO1FBQzlDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ25CLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDbEMsQ0FBQzs7OztJQUVNLEtBQUs7UUFDVixJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUM3QyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztRQUMxQyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUNwQixJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ25DLENBQUM7Ozs7SUFFTSxRQUFRO1FBQ2IsT0FBTyxJQUFJLE9BQU87Ozs7UUFBVSxPQUFPLENBQUMsRUFBRTtZQUNwQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZCLENBQUMsRUFBQyxDQUFDO0lBQ0wsQ0FBQzs7Ozs7SUFHRCxhQUFhLENBQUMsTUFBZ0I7UUFDNUIsSUFBSSxRQUFRLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQzFCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUNkO0lBQ0gsQ0FBQzs7OztJQUtELGVBQWU7UUFDYixJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPOzs7O1FBQUUsQ0FBQyxLQUFVLEVBQUUsRUFBRTtZQUM3RCxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxLQUFLLGlCQUFpQixFQUFFO2dCQUNoRCxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7YUFDZDtRQUNILENBQUMsRUFBQyxDQUFDO0lBQ0wsQ0FBQzs7O1lBckRGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsZ0JBQWdCO2dCQUMxQiwrNEJBQStDO2dCQUUvQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsU0FBUzs7YUFDM0M7Ozs7WUFQaUMsVUFBVTs7O3lCQVd6QyxLQUFLLFNBQUMsWUFBWTtnQ0FDbEIsS0FBSyxTQUFDLG1CQUFtQjtnQ0FFekIsTUFBTSxTQUFDLG1CQUFtQjtpQ0FDMUIsTUFBTSxTQUFDLG9CQUFvQjs0QkF3QjNCLFlBQVksU0FBQyxtQkFBbUIsRUFBRSxDQUFDLFFBQVEsQ0FBQzs7OztJQTVCN0MsNENBQXFDOztJQUNyQyxtREFBNkQ7O0lBRTdELG1EQUF5RTs7SUFDekUsb0RBQTJFOzs7OztJQUUzRSx3Q0FBdUI7O0lBNkJYLG9DQUFxQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQ29weXJpZ2h0IDIwMjAgIFNlblggUy5BLlMuXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKi9cblxuaW1wb3J0IHtBZnRlclZpZXdJbml0LCBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSG9zdExpc3RlbmVyLCBJbnB1dCwgT3V0cHV0LCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3dhcnB2aWV3LW1vZGFsJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3dhcnAtdmlldy1tb2RhbC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3dhcnAtdmlldy1tb2RhbC5jb21wb25lbnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5TaGFkb3dEb21cbn0pXG5leHBvcnQgY2xhc3MgV2FycFZpZXdNb2RhbENvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xuXG5cbiAgQElucHV0KCdtb2RhbFRpdGxlJykgbW9kYWxUaXRsZSA9ICcnO1xuICBASW5wdXQoJ2tiZExhc3RLZXlQcmVzc2VkJykga2JkTGFzdEtleVByZXNzZWQ6IHN0cmluZ1tdID0gW107XG5cbiAgQE91dHB1dCgnd2FycFZpZXdNb2RhbE9wZW4nKSB3YXJwVmlld01vZGFsT3BlbiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCd3YXJwVmlld01vZGFsQ2xvc2UnKSB3YXJwVmlld01vZGFsQ2xvc2UgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBwcml2YXRlIG9wZW5lZCA9IGZhbHNlO1xuXG4gIHB1YmxpYyBvcGVuKCkge1xuICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuc3R5bGUuekluZGV4ID0gJzk5OTk5OSc7XG4gICAgdGhpcy5vcGVuZWQgPSB0cnVlO1xuICAgIHRoaXMud2FycFZpZXdNb2RhbE9wZW4uZW1pdCh7fSk7XG4gIH1cblxuICBwdWJsaWMgY2xvc2UoKSB7XG4gICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LnN0eWxlLnpJbmRleCA9ICctMSc7XG4gICAgdGhpcy5vcGVuZWQgPSBmYWxzZTtcbiAgICB0aGlzLndhcnBWaWV3TW9kYWxDbG9zZS5lbWl0KHt9KTtcbiAgfVxuXG4gIHB1YmxpYyBpc09wZW5lZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2U8Ym9vbGVhbj4ocmVzb2x2ZSA9PiB7XG4gICAgICByZXNvbHZlKHRoaXMub3BlbmVkKTtcbiAgICB9KTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2tiZExhc3RLZXlQcmVzc2VkJywgWyckZXZlbnQnXSlcbiAgaGFuZGxlS2V5RG93bigkZXZlbnQ6IHN0cmluZ1tdKSB7XG4gICAgaWYgKCdFc2NhcGUnID09PSAkZXZlbnRbMF0pIHtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9XG4gIH1cblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgZWw6IEVsZW1lbnRSZWYpIHtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQ6IGFueSkgPT4ge1xuICAgICAgaWYgKGV2ZW50LnBhdGhbMF0ubm9kZU5hbWUgPT09ICdXQVJQLVZJRVctTU9EQUwnKSB7XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIl19