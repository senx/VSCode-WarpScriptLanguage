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
export class WarpViewGtsTreeComponent extends WarpViewComponent {
    /**
     * @param {?} el
     * @param {?} renderer
     * @param {?} sizeService
     * @param {?} ngZone
     */
    constructor(el, renderer, sizeService, ngZone) {
        super(el, renderer, sizeService, ngZone);
        this.el = el;
        this.renderer = renderer;
        this.sizeService = sizeService;
        this.ngZone = ngZone;
        this.kbdLastKeyPressed = [];
        this.warpViewSelectedGTS = new EventEmitter();
        this._gtsFilter = 'x';
        this.gtsList = [];
        this.params = (/** @type {?} */ ([]));
        this.expand = false;
        this.initOpen = new Subject();
        this.LOG = new Logger(WarpViewGtsTreeComponent, this._debug);
    }
    /**
     * @param {?} gtsFilter
     * @return {?}
     */
    set gtsFilter(gtsFilter) {
        this._gtsFilter = gtsFilter;
    }
    /**
     * @return {?}
     */
    get gtsFilter() {
        return this._gtsFilter;
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
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
    }
    /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    update(options, refresh) {
        this.doRender();
        if (!!this._options.foldGTSTree && !this.expand) {
            this.foldAll();
        }
    }
    /**
     * @private
     * @return {?}
     */
    doRender() {
        this.LOG.debug(['doRender', 'gtsList'], this._data);
        this._options = (/** @type {?} */ (ChartLib.mergeDeep(this.defOptions, this._options)));
        if (!this._data) {
            return;
        }
        /** @type {?} */
        const dataList = GTSLib.getData(this._data).data;
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
    }
    /**
     * @private
     * @return {?}
     */
    foldAll() {
        if (!this.root) {
            setTimeout((/**
             * @return {?}
             */
            () => this.foldAll()));
        }
        else {
            this.expand = false;
        }
    }
    /**
     * @return {?}
     */
    toggleVisibility() {
        this.expand = !this.expand;
    }
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    convert(data) {
        return [];
    }
    /**
     * @param {?} event
     * @return {?}
     */
    warpViewSelectedGTSHandler(event) {
        this.LOG.debug(['warpViewSelectedGTS'], event);
        this.warpViewSelectedGTS.emit(event);
    }
}
WarpViewGtsTreeComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-gts-tree',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"wrapper\">\n  <div class=\"stack-level\" (click)=\"toggleVisibility()\">\n    <span [ngClass]=\"{expanded: this.expand, collapsed: !this.expand}\" #root></span> Results\n  </div>\n  <warpview-tree-view [events]=\"initOpen.asObservable()\"\n                      [gtsList]=\"gtsList\" [branch]=\"false\" *ngIf=\"expand\" [params]=\"params\"\n                      [options]=\"_options\" (warpViewSelectedGTS)=\"warpViewSelectedGTSHandler($event)\"\n                      [debug]=\"debug\" [hiddenData]=\"hiddenData\" [gtsFilter]=\"gtsFilter\"\n                      [kbdLastKeyPressed]=\"kbdLastKeyPressed\"></warpview-tree-view>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host .wrapper{text-align:left}:host .stack-level{font-size:1em;padding-top:5px;cursor:pointer;color:var(--gts-stack-font-color)}:host .stack-level+div{padding-left:25px}:host .expanded{padding:1px 10px;margin-right:5px;background-image:var(--gts-tree-expanded-icon);background-position:center left;background-repeat:no-repeat}:host .collapsed{padding:1px 10px;margin-right:5px;background-image:var(--gts-tree-collapsed-icon);background-repeat:no-repeat;background-position:center left}"]
            }] }
];
/** @nocollapse */
WarpViewGtsTreeComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: SizeService },
    { type: NgZone }
];
WarpViewGtsTreeComponent.propDecorators = {
    root: [{ type: ViewChild, args: ['root', { static: true },] }],
    kbdLastKeyPressed: [{ type: Input, args: ['kbdLastKeyPressed',] }],
    gtsFilter: [{ type: Input, args: ['gtsFilter',] }],
    warpViewSelectedGTS: [{ type: Output, args: ['warpViewSelectedGTS',] }]
};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LWd0cy10cmVlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzZW54L3dhcnB2aWV3LyIsInNvdXJjZXMiOlsic3JjL2xpYi9lbGVtZW50cy93YXJwLXZpZXctZ3RzLXRyZWUvd2FycC12aWV3LWd0cy10cmVlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBRUwsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osS0FBSyxFQUNMLE1BQU0sRUFDTixNQUFNLEVBQ04sU0FBUyxFQUNULFNBQVMsRUFDVCxpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFFekQsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9DLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUUzQyxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sK0JBQStCLENBQUM7QUFDMUQsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQzFDLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7Ozs7QUFXN0IsTUFBTSxPQUFPLHdCQUF5QixTQUFRLGlCQUFpQjs7Ozs7OztJQXFCN0QsWUFDUyxFQUFjLEVBQ2QsUUFBbUIsRUFDbkIsV0FBd0IsRUFDeEIsTUFBYztRQUVyQixLQUFLLENBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFMbEMsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUNkLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDbkIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQXRCSyxzQkFBaUIsR0FBYSxFQUFFLENBQUM7UUFVOUIsd0JBQW1CLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUVyRSxlQUFVLEdBQUcsR0FBRyxDQUFDO1FBQ3pCLFlBQU8sR0FBVSxFQUFFLENBQUM7UUFDcEIsV0FBTSxHQUFZLG1CQUFBLEVBQUUsRUFBVyxDQUFDO1FBQ2hDLFdBQU0sR0FBRyxLQUFLLENBQUM7UUFFZixhQUFRLEdBQWtCLElBQUksT0FBTyxFQUFRLENBQUM7UUFRNUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLE1BQU0sQ0FBQyx3QkFBd0IsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDL0QsQ0FBQzs7Ozs7SUF4QkQsSUFBd0IsU0FBUyxDQUFDLFNBQWlCO1FBQ2pELElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO0lBQzlCLENBQUM7Ozs7SUFFRCxJQUFJLFNBQVM7UUFDWCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDekIsQ0FBQzs7OztJQW9CRCxlQUFlO1FBQ2IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxNQUFNLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekQsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ2QsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ2pCO1FBQ0QsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQy9DLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUNoQjtRQUNELElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRTtZQUM5QixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ3RCO0lBQ0gsQ0FBQzs7Ozs7O0lBRUQsTUFBTSxDQUFDLE9BQWMsRUFBRSxPQUFnQjtRQUNyQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDaEIsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQy9DLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUNoQjtJQUNILENBQUM7Ozs7O0lBRU8sUUFBUTtRQUNkLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsVUFBVSxFQUFFLFNBQVMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNwRCxJQUFJLENBQUMsUUFBUSxHQUFHLG1CQUFBLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQVMsQ0FBQztRQUM1RSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNmLE9BQU87U0FDUjs7Y0FDSyxRQUFRLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSTtRQUNoRCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQztRQUN0QyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLFVBQVUsRUFBRSxTQUFTLEVBQUUsVUFBVSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDOUQsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNiLE9BQU87U0FDUjtRQUNELElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQztRQUN6QyxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxtQkFBQSxRQUFRLEVBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7UUFDbEUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDOUYsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFDckIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN4QixDQUFDOzs7OztJQUVPLE9BQU87UUFDYixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNkLFVBQVU7OztZQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBQyxDQUFDO1NBQ2xDO2FBQU07WUFDTCxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztTQUNyQjtJQUNILENBQUM7Ozs7SUFFRCxnQkFBZ0I7UUFDZCxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUM3QixDQUFDOzs7Ozs7SUFFUyxPQUFPLENBQUMsSUFBZTtRQUMvQixPQUFPLEVBQUUsQ0FBQztJQUNaLENBQUM7Ozs7O0lBRUQsMEJBQTBCLENBQUMsS0FBSztRQUM5QixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN2QyxDQUFDOzs7WUEvRkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxtQkFBbUI7Z0JBQzdCLDh4Q0FBa0Q7Z0JBRWxELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxTQUFTOzthQUMzQzs7OztZQTFCQyxVQUFVO1lBS1YsU0FBUztZQVNILFdBQVc7WUFYakIsTUFBTTs7O21CQXlCTCxTQUFTLFNBQUMsTUFBTSxFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQztnQ0FFaEMsS0FBSyxTQUFDLG1CQUFtQjt3QkFFekIsS0FBSyxTQUFDLFdBQVc7a0NBUWpCLE1BQU0sU0FBQyxxQkFBcUI7Ozs7SUFaN0Isd0NBQW9EOztJQUVwRCxxREFBNkQ7O0lBVTdELHVEQUE2RTs7Ozs7SUFFN0UsOENBQXlCOztJQUN6QiwyQ0FBb0I7O0lBQ3BCLDBDQUFnQzs7SUFDaEMsMENBQWU7O0lBRWYsNENBQThDOztJQUU1QyxzQ0FBcUI7O0lBQ3JCLDRDQUEwQjs7SUFDMUIsK0NBQStCOztJQUMvQiwwQ0FBcUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogIENvcHlyaWdodCAyMDIwICBTZW5YIFMuQS5TLlxuICpcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICovXG5cbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPdXRwdXQsXG4gIFJlbmRlcmVyMixcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7V2FycFZpZXdDb21wb25lbnR9IGZyb20gJy4uL3dhcnAtdmlldy1jb21wb25lbnQnO1xuaW1wb3J0IHtQYXJhbX0gZnJvbSAnLi4vLi4vbW9kZWwvcGFyYW0nO1xuaW1wb3J0IHtDaGFydExpYn0gZnJvbSAnLi4vLi4vdXRpbHMvY2hhcnQtbGliJztcbmltcG9ydCB7R1RTTGlifSBmcm9tICcuLi8uLi91dGlscy9ndHMubGliJztcbmltcG9ydCB7RGF0YU1vZGVsfSBmcm9tICcuLi8uLi9tb2RlbC9kYXRhTW9kZWwnO1xuaW1wb3J0IHtTaXplU2VydmljZX0gZnJvbSAnLi4vLi4vc2VydmljZXMvcmVzaXplLnNlcnZpY2UnO1xuaW1wb3J0IHtMb2dnZXJ9IGZyb20gJy4uLy4uL3V0aWxzL2xvZ2dlcic7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuXG4vKipcbiAqXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3dhcnB2aWV3LWd0cy10cmVlJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3dhcnAtdmlldy1ndHMtdHJlZS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3dhcnAtdmlldy1ndHMtdHJlZS5jb21wb25lbnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5TaGFkb3dEb21cbn0pXG5leHBvcnQgY2xhc3MgV2FycFZpZXdHdHNUcmVlQ29tcG9uZW50IGV4dGVuZHMgV2FycFZpZXdDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcbiAgQFZpZXdDaGlsZCgncm9vdCcsIHtzdGF0aWM6IHRydWV9KSByb290OiBFbGVtZW50UmVmO1xuXG4gIEBJbnB1dCgna2JkTGFzdEtleVByZXNzZWQnKSBrYmRMYXN0S2V5UHJlc3NlZDogc3RyaW5nW10gPSBbXTtcblxuICBASW5wdXQoJ2d0c0ZpbHRlcicpIHNldCBndHNGaWx0ZXIoZ3RzRmlsdGVyOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9ndHNGaWx0ZXIgPSBndHNGaWx0ZXI7XG4gIH1cblxuICBnZXQgZ3RzRmlsdGVyKCkge1xuICAgIHJldHVybiB0aGlzLl9ndHNGaWx0ZXI7XG4gIH1cblxuICBAT3V0cHV0KCd3YXJwVmlld1NlbGVjdGVkR1RTJykgd2FycFZpZXdTZWxlY3RlZEdUUyA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIHByaXZhdGUgX2d0c0ZpbHRlciA9ICd4JztcbiAgZ3RzTGlzdDogYW55W10gPSBbXTtcbiAgcGFyYW1zOiBQYXJhbVtdID0gW10gYXMgUGFyYW1bXTtcbiAgZXhwYW5kID0gZmFsc2U7XG5cbiAgaW5pdE9wZW46IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgZWw6IEVsZW1lbnRSZWYsXG4gICAgcHVibGljIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHVibGljIHNpemVTZXJ2aWNlOiBTaXplU2VydmljZSxcbiAgICBwdWJsaWMgbmdab25lOiBOZ1pvbmVcbiAgKSB7XG4gICAgc3VwZXIoZWwsIHJlbmRlcmVyLCBzaXplU2VydmljZSwgbmdab25lKTtcbiAgICB0aGlzLkxPRyA9IG5ldyBMb2dnZXIoV2FycFZpZXdHdHNUcmVlQ29tcG9uZW50LCB0aGlzLl9kZWJ1Zyk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgdGhpcy5MT0cuZGVidWcoWydjb21wb25lbnREaWRMb2FkJywgJ2RhdGEnXSwgdGhpcy5fZGF0YSk7XG4gICAgaWYgKHRoaXMuX2RhdGEpIHtcbiAgICAgIHRoaXMuZG9SZW5kZXIoKTtcbiAgICB9XG4gICAgaWYgKCEhdGhpcy5fb3B0aW9ucy5mb2xkR1RTVHJlZSAmJiAhdGhpcy5leHBhbmQpIHtcbiAgICAgIHRoaXMuZm9sZEFsbCgpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuX29wdGlvbnMuZm9sZEdUU1RyZWUpIHtcbiAgICAgIHRoaXMuaW5pdE9wZW4ubmV4dCgpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZShvcHRpb25zOiBQYXJhbSwgcmVmcmVzaDogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuZG9SZW5kZXIoKTtcbiAgICBpZiAoISF0aGlzLl9vcHRpb25zLmZvbGRHVFNUcmVlICYmICF0aGlzLmV4cGFuZCkge1xuICAgICAgdGhpcy5mb2xkQWxsKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBkb1JlbmRlcigpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RvUmVuZGVyJywgJ2d0c0xpc3QnXSwgdGhpcy5fZGF0YSk7XG4gICAgdGhpcy5fb3B0aW9ucyA9IENoYXJ0TGliLm1lcmdlRGVlcCh0aGlzLmRlZk9wdGlvbnMsIHRoaXMuX29wdGlvbnMpIGFzIFBhcmFtO1xuICAgIGlmICghdGhpcy5fZGF0YSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBkYXRhTGlzdCA9IEdUU0xpYi5nZXREYXRhKHRoaXMuX2RhdGEpLmRhdGE7XG4gICAgdGhpcy5wYXJhbXMgPSB0aGlzLl9kYXRhLnBhcmFtcyB8fCBbXTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RvUmVuZGVyJywgJ2d0c0xpc3QnLCAnZGF0YUxpc3QnXSwgZGF0YUxpc3QpO1xuICAgIGlmICghZGF0YUxpc3QpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5leHBhbmQgPSAhdGhpcy5fb3B0aW9ucy5mb2xkR1RTVHJlZTtcbiAgICB0aGlzLmd0c0xpc3QgPSBHVFNMaWIuZmxhdHRlbkd0c0lkQXJyYXkoZGF0YUxpc3QgYXMgYW55W10sIDApLnJlcztcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RvUmVuZGVyJywgJ2d0c0xpc3QnXSwgdGhpcy5ndHNMaXN0LCB0aGlzLl9vcHRpb25zLmZvbGRHVFNUcmVlLCB0aGlzLmV4cGFuZCk7XG4gICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgdGhpcy5jaGFydERyYXcuZW1pdCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBmb2xkQWxsKCkge1xuICAgIGlmICghdGhpcy5yb290KSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuZm9sZEFsbCgpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5leHBhbmQgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICB0b2dnbGVWaXNpYmlsaXR5KCkge1xuICAgIHRoaXMuZXhwYW5kID0gIXRoaXMuZXhwYW5kO1xuICB9XG5cbiAgcHJvdGVjdGVkIGNvbnZlcnQoZGF0YTogRGF0YU1vZGVsKTogYW55W10ge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIHdhcnBWaWV3U2VsZWN0ZWRHVFNIYW5kbGVyKGV2ZW50KSB7XG4gICAgdGhpcy5MT0cuZGVidWcoWyd3YXJwVmlld1NlbGVjdGVkR1RTJ10sIGV2ZW50KTtcbiAgICB0aGlzLndhcnBWaWV3U2VsZWN0ZWRHVFMuZW1pdChldmVudCk7XG4gIH1cblxufVxuIl19