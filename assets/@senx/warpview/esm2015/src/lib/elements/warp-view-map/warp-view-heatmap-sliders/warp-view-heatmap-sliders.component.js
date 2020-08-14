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
export class WarpViewHeatmapSlidersComponent {
    constructor() {
        this.heatRadiusDidChange = new EventEmitter();
        this.heatBlurDidChange = new EventEmitter();
        this.heatOpacityDidChange = new EventEmitter();
    }
    /**
     * @param {?} value
     * @return {?}
     */
    radiusChanged(value) {
        this.heatRadiusDidChange.emit(value);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    blurChanged(value) {
        this.heatBlurDidChange.emit(value);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    opacityChanged(value) {
        this.heatOpacityDidChange.emit(value);
    }
}
WarpViewHeatmapSlidersComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-heatmap-sliders',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div>\n  <div class=\"container\">\n    <div class=\"options\">\n      <label for=\"radius\">Radius </label>\n      <input type=\"number\" id=\"radius\" value=\"25\" min=\"10\" max=\"50\" (click)=\"radiusChanged($event.target)\"/>\n      <br/>\n      <label for=\"blur\">Blur </label>\n      <input type=\"number\" id=\"blur\" value=\"15\" min=\"10\" max=\"50\" (click)=\"blurChanged($event.target)\"/>\n      <br/>\n      <label for=\"opacity\">Opacity </label>\n      <input type=\"number\" id=\"opacity\" value=\"50\" min=\"10\" max=\"100\" (click)=\"opacityChanged($event.target)\"/>\n    </div>\n  </div>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}"]
            }] }
];
WarpViewHeatmapSlidersComponent.propDecorators = {
    radiusValue: [{ type: Input, args: ['radiusValue',] }],
    minRadiusValue: [{ type: Input, args: ['minRadiusValue',] }],
    maxRadiusValue: [{ type: Input, args: ['maxRadiusValue',] }],
    blurValue: [{ type: Input, args: ['blurValue',] }],
    minBlurValue: [{ type: Input, args: ['minBlurValue',] }],
    maxBlurValue: [{ type: Input, args: ['maxBlurValue',] }],
    heatRadiusDidChange: [{ type: Output, args: ['heatRadiusDidChange',] }],
    heatBlurDidChange: [{ type: Output, args: ['heatBlurDidChange',] }],
    heatOpacityDidChange: [{ type: Output, args: ['heatOpacityDidChange',] }]
};
if (false) {
    /** @type {?} */
    WarpViewHeatmapSlidersComponent.prototype.radiusValue;
    /** @type {?} */
    WarpViewHeatmapSlidersComponent.prototype.minRadiusValue;
    /** @type {?} */
    WarpViewHeatmapSlidersComponent.prototype.maxRadiusValue;
    /** @type {?} */
    WarpViewHeatmapSlidersComponent.prototype.blurValue;
    /** @type {?} */
    WarpViewHeatmapSlidersComponent.prototype.minBlurValue;
    /** @type {?} */
    WarpViewHeatmapSlidersComponent.prototype.maxBlurValue;
    /** @type {?} */
    WarpViewHeatmapSlidersComponent.prototype.heatRadiusDidChange;
    /** @type {?} */
    WarpViewHeatmapSlidersComponent.prototype.heatBlurDidChange;
    /** @type {?} */
    WarpViewHeatmapSlidersComponent.prototype.heatOpacityDidChange;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LWhlYXRtYXAtc2xpZGVycy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VueC93YXJwdmlldy8iLCJzb3VyY2VzIjpbInNyYy9saWIvZWxlbWVudHMvd2FycC12aWV3LW1hcC93YXJwLXZpZXctaGVhdG1hcC1zbGlkZXJzL3dhcnAtdmlldy1oZWF0bWFwLXNsaWRlcnMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFReEYsTUFBTSxPQUFPLCtCQUErQjtJQU41QztRQWVpQyx3QkFBbUIsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBQ2hELHNCQUFpQixHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFDekMseUJBQW9CLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztJQWFqRixDQUFDOzs7OztJQVhDLGFBQWEsQ0FBQyxLQUFLO1FBQ2pCLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdkMsQ0FBQzs7Ozs7SUFFRCxXQUFXLENBQUMsS0FBSztRQUNmLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDckMsQ0FBQzs7Ozs7SUFFRCxjQUFjLENBQUMsS0FBSztRQUNsQixJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hDLENBQUM7OztZQTdCRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLDBCQUEwQjtnQkFDcEMsOHZDQUF5RDtnQkFFekQsYUFBYSxFQUFFLGlCQUFpQixDQUFDLFNBQVM7O2FBQzNDOzs7MEJBR0UsS0FBSyxTQUFDLGFBQWE7NkJBQ25CLEtBQUssU0FBQyxnQkFBZ0I7NkJBQ3RCLEtBQUssU0FBQyxnQkFBZ0I7d0JBQ3RCLEtBQUssU0FBQyxXQUFXOzJCQUNqQixLQUFLLFNBQUMsY0FBYzsyQkFDcEIsS0FBSyxTQUFDLGNBQWM7a0NBRXBCLE1BQU0sU0FBQyxxQkFBcUI7Z0NBQzVCLE1BQU0sU0FBQyxtQkFBbUI7bUNBQzFCLE1BQU0sU0FBQyxzQkFBc0I7Ozs7SUFUOUIsc0RBQTBDOztJQUMxQyx5REFBZ0Q7O0lBQ2hELHlEQUFnRDs7SUFDaEQsb0RBQXNDOztJQUN0Qyx1REFBNEM7O0lBQzVDLHVEQUE0Qzs7SUFFNUMsOERBQTZFOztJQUM3RSw0REFBeUU7O0lBQ3pFLCtEQUErRSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQ29weXJpZ2h0IDIwMjAgIFNlblggUy5BLlMuXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE91dHB1dCwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICd3YXJwdmlldy1oZWF0bWFwLXNsaWRlcnMnLFxuICB0ZW1wbGF0ZVVybDogJy4vd2FycC12aWV3LWhlYXRtYXAtc2xpZGVycy5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3dhcnAtdmlldy1oZWF0bWFwLXNsaWRlcnMuY29tcG9uZW50LnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uU2hhZG93RG9tXG59KVxuZXhwb3J0IGNsYXNzIFdhcnBWaWV3SGVhdG1hcFNsaWRlcnNDb21wb25lbnQge1xuXG4gIEBJbnB1dCgncmFkaXVzVmFsdWUnKSByYWRpdXNWYWx1ZTogbnVtYmVyO1xuICBASW5wdXQoJ21pblJhZGl1c1ZhbHVlJykgbWluUmFkaXVzVmFsdWU6IG51bWJlcjtcbiAgQElucHV0KCdtYXhSYWRpdXNWYWx1ZScpIG1heFJhZGl1c1ZhbHVlOiBudW1iZXI7XG4gIEBJbnB1dCgnYmx1clZhbHVlJykgYmx1clZhbHVlOiBudW1iZXI7XG4gIEBJbnB1dCgnbWluQmx1clZhbHVlJykgbWluQmx1clZhbHVlOiBudW1iZXI7XG4gIEBJbnB1dCgnbWF4Qmx1clZhbHVlJykgbWF4Qmx1clZhbHVlOiBudW1iZXI7XG5cbiAgQE91dHB1dCgnaGVhdFJhZGl1c0RpZENoYW5nZScpIGhlYXRSYWRpdXNEaWRDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgnaGVhdEJsdXJEaWRDaGFuZ2UnKSBoZWF0Qmx1ckRpZENoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCdoZWF0T3BhY2l0eURpZENoYW5nZScpIGhlYXRPcGFjaXR5RGlkQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgcmFkaXVzQ2hhbmdlZCh2YWx1ZSkge1xuICAgIHRoaXMuaGVhdFJhZGl1c0RpZENoYW5nZS5lbWl0KHZhbHVlKTtcbiAgfVxuXG4gIGJsdXJDaGFuZ2VkKHZhbHVlKSB7XG4gICAgdGhpcy5oZWF0Qmx1ckRpZENoYW5nZS5lbWl0KHZhbHVlKTtcbiAgfVxuXG4gIG9wYWNpdHlDaGFuZ2VkKHZhbHVlKSB7XG4gICAgdGhpcy5oZWF0T3BhY2l0eURpZENoYW5nZS5lbWl0KHZhbHVlKTtcbiAgfVxufVxuIl19