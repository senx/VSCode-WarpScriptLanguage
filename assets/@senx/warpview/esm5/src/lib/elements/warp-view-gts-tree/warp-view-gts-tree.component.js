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
import { Component, ElementRef, EventEmitter, Input, NgZone, Output, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { WarpViewComponent } from '../warp-view-component';
import { ChartLib } from '../../utils/chart-lib';
import { GTSLib } from '../../utils/gts.lib';
import { SizeService } from '../../services/resize.service';
import { Logger } from '../../utils/logger';
import { Subject } from 'rxjs';
/**
 *
 */
var WarpViewGtsTreeComponent = /** @class */ (function (_super) {
    tslib_1.__extends(WarpViewGtsTreeComponent, _super);
    function WarpViewGtsTreeComponent(el, renderer, sizeService, ngZone) {
        var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
        _this.el = el;
        _this.renderer = renderer;
        _this.sizeService = sizeService;
        _this.ngZone = ngZone;
        _this.kbdLastKeyPressed = [];
        _this.warpViewSelectedGTS = new EventEmitter();
        _this._gtsFilter = 'x';
        _this.gtsList = [];
        _this.params = (/** @type {?} */ ([]));
        _this.expand = false;
        _this.initOpen = new Subject();
        _this.LOG = new Logger(WarpViewGtsTreeComponent, _this._debug);
        return _this;
    }
    Object.defineProperty(WarpViewGtsTreeComponent.prototype, "gtsFilter", {
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
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    WarpViewGtsTreeComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        this.LOG.debug(['componentDidLoad', 'data'], this._data);
        if (this._data) {
            this.doRender();
        }
        if (!!this._options.foldGTSTree && !this.expand) {
            this.foldAll();
        }
        if (!this._options.foldGTSTree) {
            this.initOpen.next();
        }
    };
    /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    WarpViewGtsTreeComponent.prototype.update = /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    function (options, refresh) {
        this.doRender();
        if (!!this._options.foldGTSTree && !this.expand) {
            this.foldAll();
        }
    };
    /**
     * @private
     * @return {?}
     */
    WarpViewGtsTreeComponent.prototype.doRender = /**
     * @private
     * @return {?}
     */
    function () {
        this.LOG.debug(['doRender', 'gtsList'], this._data);
        this._options = (/** @type {?} */ (ChartLib.mergeDeep(this.defOptions, this._options)));
        if (!this._data) {
            return;
        }
        /** @type {?} */
        var dataList = GTSLib.getData(this._data).data;
        this.params = this._data.params || [];
        this.LOG.debug(['doRender', 'gtsList', 'dataList'], dataList);
        if (!dataList) {
            return;
        }
        this.expand = !this._options.foldGTSTree;
        this.gtsList = GTSLib.flattenGtsIdArray((/** @type {?} */ (dataList)), 0).res;
        this.LOG.debug(['doRender', 'gtsList'], this.gtsList, this._options.foldGTSTree, this.expand);
        this.loading = false;
        this.chartDraw.emit();
    };
    /**
     * @private
     * @return {?}
     */
    WarpViewGtsTreeComponent.prototype.foldAll = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        if (!this.root) {
            setTimeout((/**
             * @return {?}
             */
            function () { return _this.foldAll(); }));
        }
        else {
            this.expand = false;
        }
    };
    /**
     * @return {?}
     */
    WarpViewGtsTreeComponent.prototype.toggleVisibility = /**
     * @return {?}
     */
    function () {
        this.expand = !this.expand;
    };
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    WarpViewGtsTreeComponent.prototype.convert = /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    function (data) {
        return [];
    };
    /**
     * @param {?} event
     * @return {?}
     */
    WarpViewGtsTreeComponent.prototype.warpViewSelectedGTSHandler = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.LOG.debug(['warpViewSelectedGTS'], event);
        this.warpViewSelectedGTS.emit(event);
    };
    WarpViewGtsTreeComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-gts-tree',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"wrapper\">\n  <div class=\"stack-level\" (click)=\"toggleVisibility()\">\n    <span [ngClass]=\"{expanded: this.expand, collapsed: !this.expand}\" #root></span> Results\n  </div>\n  <warpview-tree-view [events]=\"initOpen.asObservable()\"\n                      [gtsList]=\"gtsList\" [branch]=\"false\" *ngIf=\"expand\" [params]=\"params\"\n                      [options]=\"_options\" (warpViewSelectedGTS)=\"warpViewSelectedGTSHandler($event)\"\n                      [debug]=\"debug\" [hiddenData]=\"hiddenData\" [gtsFilter]=\"gtsFilter\"\n                      [kbdLastKeyPressed]=\"kbdLastKeyPressed\"></warpview-tree-view>\n</div>\n",
                    encapsulation: ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host .wrapper{text-align:left}:host .stack-level{font-size:1em;padding-top:5px;cursor:pointer;color:var(--gts-stack-font-color)}:host .stack-level+div{padding-left:25px}:host .expanded{padding:1px 10px;margin-right:5px;background-image:var(--gts-tree-expanded-icon);background-position:center left;background-repeat:no-repeat}:host .collapsed{padding:1px 10px;margin-right:5px;background-image:var(--gts-tree-collapsed-icon);background-repeat:no-repeat;background-position:center left}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewGtsTreeComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: SizeService },
        { type: NgZone }
    ]; };
    WarpViewGtsTreeComponent.propDecorators = {
        root: [{ type: ViewChild, args: ['root', { static: true },] }],
        kbdLastKeyPressed: [{ type: Input, args: ['kbdLastKeyPressed',] }],
        gtsFilter: [{ type: Input, args: ['gtsFilter',] }],
        warpViewSelectedGTS: [{ type: Output, args: ['warpViewSelectedGTS',] }]
    };
    return WarpViewGtsTreeComponent;
}(WarpViewComponent));
export { WarpViewGtsTreeComponent };
if (false) {
    /** @type {?} */
    WarpViewGtsTreeComponent.prototype.root;
    /** @type {?} */
    WarpViewGtsTreeComponent.prototype.kbdLastKeyPressed;
    /** @type {?} */
    WarpViewGtsTreeComponent.prototype.warpViewSelectedGTS;
    /**
     * @type {?}
     * @private
     */
    WarpViewGtsTreeComponent.prototype._gtsFilter;
    /** @type {?} */
    WarpViewGtsTreeComponent.prototype.gtsList;
    /** @type {?} */
    WarpViewGtsTreeComponent.prototype.params;
    /** @type {?} */
    WarpViewGtsTreeComponent.prototype.expand;
    /** @type {?} */
    WarpViewGtsTreeComponent.prototype.initOpen;
    /** @type {?} */
    WarpViewGtsTreeComponent.prototype.el;
    /** @type {?} */
    WarpViewGtsTreeComponent.prototype.renderer;
    /** @type {?} */
    WarpViewGtsTreeComponent.prototype.sizeService;
    /** @type {?} */
    WarpViewGtsTreeComponent.prototype.ngZone;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LWd0cy10cmVlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzZW54L3dhcnB2aWV3LyIsInNvdXJjZXMiOlsic3JjL2xpYi9lbGVtZW50cy93YXJwLXZpZXctZ3RzLXRyZWUvd2FycC12aWV3LWd0cy10cmVlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUVMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLEtBQUssRUFDTCxNQUFNLEVBQ04sTUFBTSxFQUNOLFNBQVMsRUFDVCxTQUFTLEVBQ1QsaUJBQWlCLEVBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBRXpELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFFM0MsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBQzFELE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUMxQyxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDOzs7O0FBSzdCO0lBTThDLG9EQUFpQjtJQXFCN0Qsa0NBQ1MsRUFBYyxFQUNkLFFBQW1CLEVBQ25CLFdBQXdCLEVBQ3hCLE1BQWM7UUFKdkIsWUFNRSxrQkFBTSxFQUFFLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxNQUFNLENBQUMsU0FFekM7UUFQUSxRQUFFLEdBQUYsRUFBRSxDQUFZO1FBQ2QsY0FBUSxHQUFSLFFBQVEsQ0FBVztRQUNuQixpQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4QixZQUFNLEdBQU4sTUFBTSxDQUFRO1FBdEJLLHVCQUFpQixHQUFhLEVBQUUsQ0FBQztRQVU5Qix5QkFBbUIsR0FBRyxJQUFJLFlBQVksRUFBTyxD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LCtCQUFDO0NBQUEsQUFqR0QsQ0FNOEMsaUJBQWlCLEdBMkY5RDtTQTNGWSx3QkFBd0I7OztJQUNuQyx3Q0FBb0Q7O0lBRXBELHFEQUE2RDs7SUFVN0QsdURBQTZFOzs7OztJQUU3RSw4Q0FBeUI7O0lBQ3pCLDJDQUFvQjs7SUFDcEIsMENBQWdDOztJQUNoQywwQ0FBZTs7SUFFZiw0Q0FBOEM7O0lBRTVDLHNDQUFxQjs7SUFDckIsNENBQTBCOztJQUMxQiwrQ0FBK0I7O0lBQy9CLDBDQUFxQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQ29weXJpZ2h0IDIwMjAgIFNlblggUy5BLlMuXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKi9cblxuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE91dHB1dCxcbiAgUmVuZGVyZXIyLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtXYXJwVmlld0NvbXBvbmVudH0gZnJvbSAnLi4vd2FycC12aWV3LWNvbXBvbmVudCc7XG5pbXBvcnQge1BhcmFtfSBmcm9tICcuLi8uLi9tb2RlbC9wYXJhbSc7XG5pbXBvcnQge0NoYXJ0TGlifSBmcm9tICcuLi8uLi91dGlscy9jaGFydC1saWInO1xuaW1wb3J0IHtHVFNMaWJ9IGZyb20gJy4uLy4uL3V0aWxzL2d0cy5saWInO1xuaW1wb3J0IHtEYXRhTW9kZWx9IGZyb20gJy4uLy4uL21vZGVsL2RhdGFNb2RlbCc7XG5pbXBvcnQge1NpemVTZXJ2aWNlfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9yZXNpemUuc2VydmljZSc7XG5pbXBvcnQge0xvZ2dlcn0gZnJvbSAnLi4vLi4vdXRpbHMvbG9nZ2VyJztcbmltcG9ydCB7U3ViamVjdH0gZnJvbSAncnhqcyc7XG5cbi8qKlxuICpcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnd2FycHZpZXctZ3RzLXRyZWUnLFxuICB0ZW1wbGF0ZVVybDogJy4vd2FycC12aWV3LWd0cy10cmVlLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vd2FycC12aWV3LWd0cy10cmVlLmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLlNoYWRvd0RvbVxufSlcbmV4cG9ydCBjbGFzcyBXYXJwVmlld0d0c1RyZWVDb21wb25lbnQgZXh0ZW5kcyBXYXJwVmlld0NvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xuICBAVmlld0NoaWxkKCdyb290Jywge3N0YXRpYzogdHJ1ZX0pIHJvb3Q6IEVsZW1lbnRSZWY7XG5cbiAgQElucHV0KCdrYmRMYXN0S2V5UHJlc3NlZCcpIGtiZExhc3RLZXlQcmVzc2VkOiBzdHJpbmdbXSA9IFtdO1xuXG4gIEBJbnB1dCgnZ3RzRmlsdGVyJykgc2V0IGd0c0ZpbHRlcihndHNGaWx0ZXI6IHN0cmluZykge1xuICAgIHRoaXMuX2d0c0ZpbHRlciA9IGd0c0ZpbHRlcjtcbiAgfVxuXG4gIGdldCBndHNGaWx0ZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2d0c0ZpbHRlcjtcbiAgfVxuXG4gIEBPdXRwdXQoJ3dhcnBWaWV3U2VsZWN0ZWRHVFMnKSB3YXJwVmlld1NlbGVjdGVkR1RTID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgcHJpdmF0ZSBfZ3RzRmlsdGVyID0gJ3gnO1xuICBndHNMaXN0OiBhbnlbXSA9IFtdO1xuICBwYXJhbXM6IFBhcmFtW10gPSBbXSBhcyBQYXJhbVtdO1xuICBleHBhbmQgPSBmYWxzZTtcblxuICBpbml0T3BlbjogU3ViamVjdDx2b2lkPiA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBlbDogRWxlbWVudFJlZixcbiAgICBwdWJsaWMgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwdWJsaWMgc2l6ZVNlcnZpY2U6IFNpemVTZXJ2aWNlLFxuICAgIHB1YmxpYyBuZ1pvbmU6IE5nWm9uZVxuICApIHtcbiAgICBzdXBlcihlbCwgcmVuZGVyZXIsIHNpemVTZXJ2aWNlLCBuZ1pvbmUpO1xuICAgIHRoaXMuTE9HID0gbmV3IExvZ2dlcihXYXJwVmlld0d0c1RyZWVDb21wb25lbnQsIHRoaXMuX2RlYnVnKTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2NvbXBvbmVudERpZExvYWQnLCAnZGF0YSddLCB0aGlzLl9kYXRhKTtcbiAgICBpZiAodGhpcy5fZGF0YSkge1xuICAgICAgdGhpcy5kb1JlbmRlcigpO1xuICAgIH1cbiAgICBpZiAoISF0aGlzLl9vcHRpb25zLmZvbGRHVFNUcmVlICYmICF0aGlzLmV4cGFuZCkge1xuICAgICAgdGhpcy5mb2xkQWxsKCk7XG4gICAgfVxuICAgIGlmICghdGhpcy5fb3B0aW9ucy5mb2xkR1RTVHJlZSkge1xuICAgICAgdGhpcy5pbml0T3Blbi5uZXh0KCk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlKG9wdGlvbnM6IFBhcmFtLCByZWZyZXNoOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5kb1JlbmRlcigpO1xuICAgIGlmICghIXRoaXMuX29wdGlvbnMuZm9sZEdUU1RyZWUgJiYgIXRoaXMuZXhwYW5kKSB7XG4gICAgICB0aGlzLmZvbGRBbGwoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGRvUmVuZGVyKCkge1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZG9SZW5kZXInLCAnZ3RzTGlzdCddLCB0aGlzLl9kYXRhKTtcbiAgICB0aGlzLl9vcHRpb25zID0gQ2hhcnRMaWIubWVyZ2VEZWVwKHRoaXMuZGVmT3B0aW9ucywgdGhpcy5fb3B0aW9ucykgYXMgUGFyYW07XG4gICAgaWYgKCF0aGlzLl9kYXRhKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGRhdGFMaXN0ID0gR1RTTGliLmdldERhdGEodGhpcy5fZGF0YSkuZGF0YTtcbiAgICB0aGlzLnBhcmFtcyA9IHRoaXMuX2RhdGEucGFyYW1zIHx8IFtdO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZG9SZW5kZXInLCAnZ3RzTGlzdCcsICdkYXRhTGlzdCddLCBkYXRhTGlzdCk7XG4gICAgaWYgKCFkYXRhTGlzdCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmV4cGFuZCA9ICF0aGlzLl9vcHRpb25zLmZvbGRHVFNUcmVlO1xuICAgIHRoaXMuZ3RzTGlzdCA9IEdUU0xpYi5mbGF0dGVuR3RzSWRBcnJheShkYXRhTGlzdCBhcyBhbnlbXSwgMCkucmVzO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZG9SZW5kZXInLCAnZ3RzTGlzdCddLCB0aGlzLmd0c0xpc3QsIHRoaXMuX29wdGlvbnMuZm9sZEdUU1RyZWUsIHRoaXMuZXhwYW5kKTtcbiAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLmNoYXJ0RHJhdy5lbWl0KCk7XG4gIH1cblxuICBwcml2YXRlIGZvbGRBbGwoKSB7XG4gICAgaWYgKCF0aGlzLnJvb3QpIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5mb2xkQWxsKCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmV4cGFuZCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHRvZ2dsZVZpc2liaWxpdHkoKSB7XG4gICAgdGhpcy5leHBhbmQgPSAhdGhpcy5leHBhbmQ7XG4gIH1cblxuICBwcm90ZWN0ZWQgY29udmVydChkYXRhOiBEYXRhTW9kZWwpOiBhbnlbXSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgd2FycFZpZXdTZWxlY3RlZEdUU0hhbmRsZXIoZXZlbnQpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3dhcnBWaWV3U2VsZWN0ZWRHVFMnXSwgZXZlbnQpO1xuICAgIHRoaXMud2FycFZpZXdTZWxlY3RlZEdUUy5lbWl0KGV2ZW50KTtcbiAgfVxuXG59XG4iXX0=