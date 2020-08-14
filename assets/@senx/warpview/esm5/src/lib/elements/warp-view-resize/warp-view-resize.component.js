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
import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { Logger } from '../../utils/logger';
/**
 *
 */
var WarpViewResizeComponent = /** @class */ (function () {
    function WarpViewResizeComponent(el, renderer) {
        this.el = el;
        this.renderer = renderer;
        this.minHeight = '10';
        this.initialHeight = 100;
        this.resize = new EventEmitter();
        this.dragging = false;
        this._debug = false;
        this.LOG = new Logger(WarpViewResizeComponent, this._debug);
    }
    Object.defineProperty(WarpViewResizeComponent.prototype, "debug", {
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
    /**
     * @return {?}
     */
    WarpViewResizeComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.LOG.debug(['ngAfterViewInit'], this.initialHeight);
        this.renderer.setStyle(this.wrapper.nativeElement, 'height', this.initialHeight + 'px');
        // the click event on the handlebar attach mousemove and mouseup events to document.
        this.handleDiv.nativeElement.addEventListener('mousedown', (/**
         * @param {?} ev
         * @return {?}
         */
        function (ev) {
            if (0 === ev.button) {
                // keep left click only
                _this.moveListener = _this.handleDraggingMove.bind(_this);
                _this.clickUpListener = _this.handleDraggingEnd.bind(_this);
                document.addEventListener('mousemove', _this.moveListener, false);
                document.addEventListener('mouseup', _this.clickUpListener, false);
            }
        }));
    };
    /**
     * @private
     * @return {?}
     */
    WarpViewResizeComponent.prototype.handleDraggingEnd = /**
     * @private
     * @return {?}
     */
    function () {
        this.dragging = false;
        // the mouseup detach mousemove and mouseup events from document.
        if (this.moveListener) {
            document.removeEventListener('mousemove', this.moveListener, false);
            this.moveListener = null;
        }
        if (this.clickUpListener) {
            document.removeEventListener('mouseup', this.clickUpListener, false);
            this.clickUpListener = null;
        }
    };
    /**
     * @private
     * @param {?} ev
     * @return {?}
     */
    WarpViewResizeComponent.prototype.handleDraggingMove = /**
     * @private
     * @param {?} ev
     * @return {?}
     */
    function (ev) {
        ev.preventDefault();
        this.LOG.debug(['handleDraggingMove'], ev);
        // compute Y of the parent div top relative to page
        /** @type {?} */
        var yTopParent = this.handleDiv.nativeElement.parentElement.getBoundingClientRect().top
            - document.body.getBoundingClientRect().top;
        // compute new parent height
        /** @type {?} */
        var h = ev.pageY - yTopParent + this.handleDiv.nativeElement.getBoundingClientRect().height / 2;
        if (h < parseInt(this.minHeight, 10)) {
            h = parseInt(this.minHeight, 10);
        }
        // apply new height
        this.renderer.setStyle(this.handleDiv.nativeElement.parentElement, 'height', h + 'px');
        this.LOG.debug(['handleDraggingMove'], h);
        this.resize.emit(h);
    };
    WarpViewResizeComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-resize',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"wrapper\" #wrapper>\n  <ng-content></ng-content>\n  <div class=\"handle\" #handleDiv></div>\n</div>\n",
                    encapsulation: ViewEncapsulation.None,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host .handle,warp-view-resize .handle,warpview-resize .handle{width:100%;height:var(--warp-view-resize-handle-height);background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=);background-color:var(--warp-view-resize-handle-color);background-repeat:no-repeat;background-position:50%;position:absolute;bottom:0}:host .handle:hover,warp-view-resize .handle:hover,warpview-resize .handle:hover{cursor:row-resize}:host .wrapper,warp-view-resize .wrapper,warpview-resize .wrapper{width:100%;position:relative;padding-bottom:var(--warp-view-resize-handle-height);height:100%}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewResizeComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 }
    ]; };
    WarpViewResizeComponent.propDecorators = {
        handleDiv: [{ type: ViewChild, args: ['handleDiv', { static: true },] }],
        wrapper: [{ type: ViewChild, args: ['wrapper', { static: true },] }],
        minHeight: [{ type: Input, args: ['minHeight',] }],
        initialHeight: [{ type: Input, args: ['initialHeight',] }],
        debug: [{ type: Input, args: ['debug',] }],
        resize: [{ type: Output, args: ['resize',] }]
    };
    return WarpViewResizeComponent;
}());
export { WarpViewResizeComponent };
if (false) {
    /** @type {?} */
    WarpViewResizeComponent.prototype.handleDiv;
    /** @type {?} */
    WarpViewResizeComponent.prototype.wrapper;
    /** @type {?} */
    WarpViewResizeComponent.prototype.minHeight;
    /** @type {?} */
    WarpViewResizeComponent.prototype.initialHeight;
    /** @type {?} */
    WarpViewResizeComponent.prototype.resize;
    /**
     * @type {?}
     * @private
     */
    WarpViewResizeComponent.prototype.dragging;
    /**
     * @type {?}
     * @private
     */
    WarpViewResizeComponent.prototype.moveListener;
    /**
     * @type {?}
     * @private
     */
    WarpViewResizeComponent.prototype.clickUpListener;
    /**
     * @type {?}
     * @private
     */
    WarpViewResizeComponent.prototype.LOG;
    /**
     * @type {?}
     * @private
     */
    WarpViewResizeComponent.prototype._debug;
    /**
     * @type {?}
     * @private
     */
    WarpViewResizeComponent.prototype.el;
    /**
     * @type {?}
     * @private
     */
    WarpViewResizeComponent.prototype.renderer;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LXJlc2l6ZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VueC93YXJwdmlldy8iLCJzb3VyY2VzIjpbInNyYy9saWIvZWxlbWVudHMvd2FycC12aWV3LXJlc2l6ZS93YXJwLXZpZXctcmVzaXplLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBQWdCLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN6SSxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7Ozs7QUFLMUM7SUE2QkUsaUNBQW9CLEVBQWMsRUFBVSxRQUFtQjtRQUEzQyxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQXBCM0MsY0FBUyxHQUFHLElBQUksQ0FBQztRQUNiLGtCQUFhLEdBQUcsR0FBRyxDQUFDO1FBVzFCLFdBQU0sR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBRXRDLGFBQVEsR0FBRyxLQUFLLENBQUM7UUFJakIsV0FBTSxHQUFHLEtBQUssQ0FBQztRQUdyQixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksTUFBTSxDQUFDLHVCQUF1QixFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBbkJELHNCQUFvQiwwQ0FBSzs7OztRQUt6QjtZQUNFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUNyQixDQUFDOzs7OztRQVBELFVBQTBCLEtBQWM7WUFDdEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7WUFDcEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0IsQ0FBQzs7O09BQUE7Ozs7SUFrQkQsaURBQWU7OztJQUFm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Q0FBQyxDQUFDO0lBQ3RCLENBQUM7O2dCQTVFRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLGlCQUFpQjtvQkFDM0IscXdCQUFnRDtvQkFFaEQsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7O2lCQUN0Qzs7OztnQkFYaUMsVUFBVTtnQkFBK0IsU0FBUzs7OzRCQWFqRixTQUFTLFNBQUMsV0FBVyxFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQzswQkFDckMsU0FBUyxTQUFDLFNBQVMsRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUM7NEJBQ25DLEtBQUssU0FBQyxXQUFXO2dDQUNqQixLQUFLLFNBQUMsZUFBZTt3QkFFckIsS0FBSyxTQUFDLE9BQU87eUJBU2IsTUFBTSxTQUFDLFFBQVE7O0lBd0RsQiw4QkFBQztDQUFBLEFBN0VELElBNkVDO1NBdkVZLHVCQUF1Qjs7O0lBQ2xDLDRDQUE4RDs7SUFDOUQsMENBQTBEOztJQUMxRCw0Q0FBcUM7O0lBQ3JDLGdEQUE0Qzs7SUFXNUMseUNBQThDOzs7OztJQUU5QywyQ0FBeUI7Ozs7O0lBQ3pCLCtDQUFvQzs7Ozs7SUFDcEMsa0RBQXVDOzs7OztJQUN2QyxzQ0FBb0I7Ozs7O0lBQ3BCLHlDQUF1Qjs7Ozs7SUFFWCxxQ0FBc0I7Ozs7O0lBQUUsMkNBQTJCIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqICBDb3B5cmlnaHQgMjAyMCAgU2VuWCBTLkEuUy5cbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqL1xuXG5pbXBvcnQge0FmdGVyVmlld0luaXQsIENvbXBvbmVudCwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT3V0cHV0LCBSZW5kZXJlcjIsIFZpZXdDaGlsZCwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtMb2dnZXJ9IGZyb20gJy4uLy4uL3V0aWxzL2xvZ2dlcic7XG5cbi8qKlxuICpcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnd2FycHZpZXctcmVzaXplJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3dhcnAtdmlldy1yZXNpemUuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi93YXJwLXZpZXctcmVzaXplLmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgV2FycFZpZXdSZXNpemVDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcbiAgQFZpZXdDaGlsZCgnaGFuZGxlRGl2Jywge3N0YXRpYzogdHJ1ZX0pIGhhbmRsZURpdjogRWxlbWVudFJlZjtcbiAgQFZpZXdDaGlsZCgnd3JhcHBlcicsIHtzdGF0aWM6IHRydWV9KSB3cmFwcGVyOiBFbGVtZW50UmVmO1xuICBASW5wdXQoJ21pbkhlaWdodCcpIG1pbkhlaWdodCA9ICcxMCc7XG4gIEBJbnB1dCgnaW5pdGlhbEhlaWdodCcpIGluaXRpYWxIZWlnaHQgPSAxMDA7XG5cbiAgQElucHV0KCdkZWJ1ZycpIHNldCBkZWJ1ZyhkZWJ1ZzogYm9vbGVhbikge1xuICAgIHRoaXMuX2RlYnVnID0gZGVidWc7XG4gICAgdGhpcy5MT0cuc2V0RGVidWcoZGVidWcpO1xuICB9XG5cbiAgZ2V0IGRlYnVnKCkge1xuICAgIHJldHVybiB0aGlzLl9kZWJ1ZztcbiAgfVxuXG4gIEBPdXRwdXQoJ3Jlc2l6ZScpIHJlc2l6ZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBwcml2YXRlIGRyYWdnaW5nID0gZmFsc2U7XG4gIHByaXZhdGUgbW92ZUxpc3RlbmVyOiBFdmVudExpc3RlbmVyO1xuICBwcml2YXRlIGNsaWNrVXBMaXN0ZW5lcjogRXZlbnRMaXN0ZW5lcjtcbiAgcHJpdmF0ZSBMT0c6IExvZ2dlcjtcbiAgcHJpdmF0ZSBfZGVidWcgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsOiBFbGVtZW50UmVmLCBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIpIHtcbiAgICB0aGlzLkxPRyA9IG5ldyBMb2dnZXIoV2FycFZpZXdSZXNpemVDb21wb25lbnQsIHRoaXMuX2RlYnVnKTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ25nQWZ0ZXJWaWV3SW5pdCddLCB0aGlzLmluaXRpYWxIZWlnaHQpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy53cmFwcGVyLm5hdGl2ZUVsZW1lbnQsICdoZWlnaHQnLCB0aGlzLmluaXRpYWxIZWlnaHQgKyAncHgnKTtcbiAgICAvLyB0aGUgY2xpY2sgZXZlbnQgb24gdGhlIGhhbmRsZWJhciBhdHRhY2ggbW91c2Vtb3ZlIGFuZCBtb3VzZXVwIGV2ZW50cyB0byBkb2N1bWVudC5cbiAgICB0aGlzLmhhbmRsZURpdi5uYXRpdmVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIChldjogTW91c2VFdmVudCkgPT4ge1xuICAgICAgaWYgKDAgPT09IGV2LmJ1dHRvbikge1xuICAgICAgICAvLyBrZWVwIGxlZnQgY2xpY2sgb25seVxuICAgICAgICB0aGlzLm1vdmVMaXN0ZW5lciA9IHRoaXMuaGFuZGxlRHJhZ2dpbmdNb3ZlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuY2xpY2tVcExpc3RlbmVyID0gdGhpcy5oYW5kbGVEcmFnZ2luZ0VuZC5iaW5kKHRoaXMpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm1vdmVMaXN0ZW5lciwgZmFsc2UpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5jbGlja1VwTGlzdGVuZXIsIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlRHJhZ2dpbmdFbmQoKSB7XG4gICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlO1xuICAgIC8vIHRoZSBtb3VzZXVwIGRldGFjaCBtb3VzZW1vdmUgYW5kIG1vdXNldXAgZXZlbnRzIGZyb20gZG9jdW1lbnQuXG4gICAgaWYgKHRoaXMubW92ZUxpc3RlbmVyKSB7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm1vdmVMaXN0ZW5lciwgZmFsc2UpO1xuICAgICAgdGhpcy5tb3ZlTGlzdGVuZXIgPSBudWxsO1xuICAgIH1cbiAgICBpZiAodGhpcy5jbGlja1VwTGlzdGVuZXIpIHtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmNsaWNrVXBMaXN0ZW5lciwgZmFsc2UpO1xuICAgICAgdGhpcy5jbGlja1VwTGlzdGVuZXIgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlRHJhZ2dpbmdNb3ZlKGV2OiBNb3VzZUV2ZW50KSB7XG4gICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2hhbmRsZURyYWdnaW5nTW92ZSddLCBldik7XG4gICAgLy8gY29tcHV0ZSBZIG9mIHRoZSBwYXJlbnQgZGl2IHRvcCByZWxhdGl2ZSB0byBwYWdlXG4gICAgY29uc3QgeVRvcFBhcmVudCA9IHRoaXMuaGFuZGxlRGl2Lm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3BcbiAgICAgIC0gZG9jdW1lbnQuYm9keS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3A7XG4gICAgLy8gY29tcHV0ZSBuZXcgcGFyZW50IGhlaWdodFxuICAgIGxldCBoID0gZXYucGFnZVkgLSB5VG9wUGFyZW50ICsgdGhpcy5oYW5kbGVEaXYubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgLyAyO1xuICAgIGlmIChoIDwgcGFyc2VJbnQodGhpcy5taW5IZWlnaHQsIDEwKSkge1xuICAgICAgaCA9IHBhcnNlSW50KHRoaXMubWluSGVpZ2h0LCAxMCk7XG4gICAgfVxuICAgIC8vIGFwcGx5IG5ldyBoZWlnaHRcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuaGFuZGxlRGl2Lm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudCwgJ2hlaWdodCcsIGggKyAncHgnKTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2hhbmRsZURyYWdnaW5nTW92ZSddLCBoKTtcbiAgICB0aGlzLnJlc2l6ZS5lbWl0KGgpO1xuICB9XG59XG4iXX0=