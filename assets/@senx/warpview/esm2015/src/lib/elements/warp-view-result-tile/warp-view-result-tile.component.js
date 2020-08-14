/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, ElementRef, EventEmitter, Input, NgZone, Output, Renderer2 } from '@angular/core';
import { WarpViewComponent } from '../warp-view-component';
import { Size, SizeService } from '../../services/resize.service';
import { Logger } from '../../utils/logger';
import { ChartLib } from '../../utils/chart-lib';
export class WarpViewResultTileComponent extends WarpViewComponent {
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
        this.standalone = true;
        this.pointHover = new EventEmitter();
        this.warpViewChartResize = new EventEmitter();
        this.chartDraw = new EventEmitter();
        this.boundsDidChange = new EventEmitter();
        this.loading = true;
        this.graphs = {
            spectrum: ['histogram2dcontour', 'histogram2d'],
            chart: ['line', 'spline', 'step', 'step-after', 'step-before', 'area', 'scatter'],
            pie: ['pie', 'donut'],
            polar: ['polar'],
            radar: ['radar'],
            bar: ['bar'],
            bubble: ['bubble'],
            annotation: ['annotation'],
            'gts-tree': ['gts-tree'],
            datagrid: ['datagrid'],
            display: ['display'],
            drilldown: ['drilldown'],
            image: ['image'],
            map: ['map'],
            gauge: ['gauge', 'bullet'],
            plot: ['plot'],
            box: ['box', 'box-date'],
            line3d: ['line3d'],
            globe: ['globe'],
            drops: ['drops']
        };
        this.LOG = new Logger(WarpViewResultTileComponent, this._debug);
    }
    /**
     * @param {?} type
     * @return {?}
     */
    set type(type) {
        this._type = type;
    }
    /**
     * @return {?}
     */
    get type() {
        if (this.dataModel && this.dataModel.globalParams) {
            return this.dataModel.globalParams.type || this._type || 'plot';
        }
        else {
            return this._type || 'plot';
        }
    }
    /**
     * @protected
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    update(options, refresh) {
        setTimeout((/**
         * @return {?}
         */
        () => this.loading = true));
        this.LOG.debug(['parseGTS', 'data'], this._data);
        this.dataModel = this._data;
        if (!!this.dataModel) {
            this._options = (/** @type {?} */ (ChartLib.mergeDeep(this._options, options)));
            this._options = (/** @type {?} */ (ChartLib.mergeDeep(ChartLib.mergeDeep(this.defOptions, options), this._data ? this._data.globalParams || {} : {})));
            this.LOG.debug(['parseGTS', 'data'], this._data);
            this.dataModel = this._data;
            if (this._options) {
                this._unit = this._options.unit || this._unit;
                this._type = this._options.type || this._type || 'plot';
            }
            this.LOG.debug(['parseGTS', '_type'], this._type);
            setTimeout((/**
             * @return {?}
             */
            () => this.loading = false));
        }
    }
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    convert(data) {
        setTimeout((/**
         * @return {?}
         */
        () => this.loading = true));
        this.LOG.debug(['convert', 'data'], this._data, data);
        this.dataModel = data;
        if (this.dataModel.globalParams) {
            this._unit = this.dataModel.globalParams.unit || this._unit;
            this._type = this.dataModel.globalParams.type || this._type || 'plot';
        }
        this.LOG.debug(['convert', '_type'], this._type);
        return [];
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onResized(event) {
        this.width = event.newWidth;
        this.height = event.newHeight;
        this.LOG.debug(['onResized'], event.newWidth, event.newHeight);
        this.sizeService.change(new Size(this.width, this.height));
    }
    /**
     * @return {?}
     */
    chartDrawn() {
        this.LOG.debug(['chartDrawn']);
        setTimeout((/**
         * @return {?}
         */
        () => this.loading = false));
        this.chartDraw.emit();
    }
}
WarpViewResultTileComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-result-tile',
                template: "<div class=\"wrapper\" [ngClass]=\"{'full':  responsive}\" (resized)=\"onResized($event)\">\n    <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n    <div style=\"height: 100%\" [hidden]=\"loading\">\n      <warpview-spectrum [debug]=\"debug\" [type]=\"type\" [unit]=\"unit\" [options]=\"_options\"\n                         [showLegend]=\"showLegend\" [data]=\"dataModel\" (chartDraw)=\"chartDrawn()\"\n                         *ngIf=\"graphs['spectrum'].indexOf(type) > -1 && dataModel\"\n                         [responsive]=\"true\"></warpview-spectrum>\n\n      <warpview-chart [debug]=\"debug\" [type]=\"type\" [unit]=\"unit\" [options]=\"_options\"\n                      (chartDraw)=\"chartDrawn()\"\n                      [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                      *ngIf=\"graphs['chart'].indexOf(type) > -1 && dataModel\"\n                      [responsive]=\"true\"></warpview-chart>\n\n      <warpview-plot [debug]=\"debug\" [type]=\"type\" [unit]=\"unit\" [options]=\"_options\"\n                     (chartDraw)=\"chartDrawn()\"\n                     [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                     *ngIf=\"graphs['plot'].indexOf(type) > -1 && dataModel\"\n                     [responsive]=\"true\"></warpview-plot>\n\n      <warpview-bar [debug]=\"debug\" [unit]=\"unit\" [options]=\"_options\"\n                    (chartDraw)=\"chartDrawn()\"\n                    [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                    *ngIf=\"graphs['bar'].indexOf(type) > -1 && dataModel\"\n                    [responsive]=\"true\"></warpview-bar>\n\n      <warpview-bubble [debug]=\"debug\" [unit]=\"unit\" [options]=\"_options\"\n                       (chartDraw)=\"chartDrawn()\"\n                       [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                       *ngIf=\"graphs['bubble'].indexOf(type) > -1 && dataModel\"\n                       [responsive]=\"true\"></warpview-bubble>\n\n      <warpview-datagrid [debug]=\"debug\" [options]=\"_options\"\n                         (chartDraw)=\"chartDrawn()\"\n                         [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                         *ngIf=\"graphs['datagrid'].indexOf(type) > -1 && dataModel\"\n                         [responsive]=\"true\"></warpview-datagrid>\n\n      <warpview-display [debug]=\"debug\" [options]=\"_options\"\n                        (chartDraw)=\"chartDrawn()\"\n                        [showLegend]=\"showLegend\" [data]=\"dataModel\" [unit]=\"unit\"\n                        *ngIf=\"graphs['display'].indexOf(type) > -1 && dataModel\"\n                        [responsive]=\"true\"></warpview-display>\n\n      <warpview-drill-down [debug]=\"debug\" [options]=\"_options\"\n                           (chartDraw)=\"chartDrawn()\"\n                           [showLegend]=\"showLegend\" [data]=\"dataModel\" [unit]=\"unit\"\n                           *ngIf=\"graphs['drilldown'].indexOf(type) > -1 && dataModel\"\n                           [responsive]=\"true\"></warpview-drill-down>\n\n      <warpview-gts-tree *ngIf=\"graphs['gts-tree'].indexOf(type) > -1 && dataModel\"\n                         (chartDraw)=\"chartDrawn()\"\n                         [responsive]=\"true\" [debug]=\"debug\" [data]=\"dataModel\"\n                         [options]=\"_options\"></warpview-gts-tree>\n\n      <warpview-image *ngIf=\"graphs['image'].indexOf(type) > -1 && dataModel\"\n                      (chartDraw)=\"chartDrawn()\"\n                      [responsive]=\"true\" [debug]=\"debug\" [data]=\"dataModel\" [options]=\"_options\"></warpview-image>\n\n      <warpview-map *ngIf=\"graphs['map'].indexOf(type) > -1 && dataModel\" [responsive]=\"true\" [debug]=\"debug\"\n                    (chartDraw)=\"chartDrawn()\"\n                    [data]=\"dataModel\" [options]=\"_options\"></warpview-map>\n\n      <warpview-pie [debug]=\"debug\" [type]=\"type\" [unit]=\"unit\" [options]=\"_options\"\n                    (chartDraw)=\"chartDrawn()\"\n                    [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                    *ngIf=\"graphs['pie'].indexOf(type) > -1 && dataModel\"\n                    [responsive]=\"true\"></warpview-pie>\n\n      <warpview-gauge [debug]=\"debug\" [type]=\"type\" [unit]=\"unit\" [options]=\"_options\"\n                      (chartDraw)=\"chartDrawn()\"\n                      [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                      *ngIf=\"graphs['gauge'].indexOf(type) > -1 && dataModel\"\n                      [responsive]=\"true\"></warpview-gauge>\n\n      <warpview-annotation [debug]=\"debug\" [unit]=\"unit\" [options]=\"_options\"\n                           (chartDraw)=\"chartDrawn()\"\n                           [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                           [standalone]=\"true\" [type]=\"type\"\n                           *ngIf=\"graphs['annotation'].indexOf(type) > -1 && dataModel\"\n                           [responsive]=\"true\"></warpview-annotation>\n\n      <warpview-event-drop [debug]=\"debug\" [unit]=\"unit\" [options]=\"_options\"\n                           (chartDraw)=\"chartDrawn()\"\n                           [showLegend]=\"showLegend\" [data]=\"dataModel\" [type]=\"type\"\n                           *ngIf=\"graphs['drops'].indexOf(type) > -1 && dataModel\"\n                           [responsive]=\"true\"></warpview-event-drop>\n\n      <warpview-polar [debug]=\"debug\" [unit]=\"unit\" [options]=\"_options\"\n                      (chartDraw)=\"chartDrawn()\"\n                      [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                      *ngIf=\"graphs['polar'].indexOf(type) > -1 && dataModel\"\n                      [responsive]=\"true\"></warpview-polar>\n\n      <warpview-radar [debug]=\"debug\" [unit]=\"unit\" [options]=\"_options\"\n                      (chartDraw)=\"chartDrawn()\"\n                      [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                      *ngIf=\"graphs['radar'].indexOf(type) > -1 && dataModel\"\n                      [responsive]=\"true\"></warpview-radar>\n\n      <warpview-box [debug]=\"debug\" [unit]=\"unit\" [options]=\"_options\"\n                    (chartDraw)=\"chartDrawn()\"\n                    [showLegend]=\"showLegend\" [data]=\"dataModel\" [type]=\"type\"\n                    *ngIf=\"graphs['box'].indexOf(type) > -1 && dataModel\"\n                    [responsive]=\"true\"></warpview-box>\n\n      <warpview-3d-line [debug]=\"debug\" [unit]=\"unit\" [options]=\"_options\"\n                        (chartDraw)=\"chartDrawn()\"\n                        [showLegend]=\"showLegend\" [data]=\"dataModel\" [type]=\"type\"\n                        *ngIf=\"graphs['line3d'].indexOf(type) > -1 && dataModel\"\n                        [responsive]=\"true\"></warpview-3d-line>\n      <warpview-globe [debug]=\"debug\" [unit]=\"unit\" [options]=\"_options\"\n                      (chartDraw)=\"chartDrawn()\"\n                      [showLegend]=\"showLegend\" [data]=\"dataModel\" [type]=\"type\"\n                      *ngIf=\"graphs['globe'].indexOf(type) > -1 && dataModel\"\n                      [responsive]=\"true\"></warpview-globe>\n    </div>\n</div>\n",
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host,warp-view-result-tile,warpview-result-tile{width:var(--warp-view-tile-width,100%);max-height:var(--warp-view-tile-height,100%);overflow:auto;min-width:var(--warp-view-tile-width,100%);min-height:var(--warp-view-tile-height,100%)}:host .error,warp-view-result-tile .error,warpview-result-tile .error{width:100%;text-align:center;color:#dc3545;font-weight:700}:host .wrapper,warp-view-result-tile .wrapper,warpview-result-tile .wrapper{opacity:1;min-height:50px;width:var(--warp-view-tile-width,100%);height:var(--warp-view-tile-height,100%)}:host .wrapper.full,warp-view-result-tile .wrapper.full,warpview-result-tile .wrapper.full{width:100%;height:100%}:host .wrapper .tilewrapper,warp-view-result-tile .wrapper .tilewrapper,warpview-result-tile .wrapper .tilewrapper{width:100%;height:100%}:host .wrapper .tilewrapper .tile,warp-view-result-tile .wrapper .tilewrapper .tile,warpview-result-tile .wrapper .tilewrapper .tile{width:100%;height:calc(var(--warp-view-tile-height,100%) - 40px);overflow-y:auto;overflow-x:hidden}:host .wrapper .tilewrapper .notitle,warp-view-result-tile .wrapper .tilewrapper .notitle,warpview-result-tile .wrapper .tilewrapper .notitle{height:100%;overflow:hidden}:host .wrapper .tilewrapper h1,warp-view-result-tile .wrapper .tilewrapper h1,warpview-result-tile .wrapper .tilewrapper h1{font-size:20px;padding:5px;margin:0;color:var(--warp-view-font-color)}:host .wrapper .tilewrapper h1 small,warp-view-result-tile .wrapper .tilewrapper h1 small,warpview-result-tile .wrapper .tilewrapper h1 small{font-size:10px;margin-left:10px}"]
            }] }
];
/** @nocollapse */
WarpViewResultTileComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: SizeService },
    { type: NgZone }
];
WarpViewResultTileComponent.propDecorators = {
    type: [{ type: Input, args: ['type',] }],
    standalone: [{ type: Input, args: ['standalone',] }],
    pointHover: [{ type: Output, args: ['pointHover',] }],
    warpViewChartResize: [{ type: Output, args: ['warpViewChartResize',] }],
    chartDraw: [{ type: Output, args: ['chartDraw',] }],
    boundsDidChange: [{ type: Output, args: ['boundsDidChange',] }]
};
if (false) {
    /** @type {?} */
    WarpViewResultTileComponent.prototype.standalone;
    /** @type {?} */
    WarpViewResultTileComponent.prototype.pointHover;
    /** @type {?} */
    WarpViewResultTileComponent.prototype.warpViewChartResize;
    /** @type {?} */
    WarpViewResultTileComponent.prototype.chartDraw;
    /** @type {?} */
    WarpViewResultTileComponent.prototype.boundsDidChange;
    /** @type {?} */
    WarpViewResultTileComponent.prototype.loading;
    /** @type {?} */
    WarpViewResultTileComponent.prototype.dataModel;
    /** @type {?} */
    WarpViewResultTileComponent.prototype.graphs;
    /**
     * @type {?}
     * @private
     */
    WarpViewResultTileComponent.prototype._type;
    /** @type {?} */
    WarpViewResultTileComponent.prototype.el;
    /** @type {?} */
    WarpViewResultTileComponent.prototype.renderer;
    /** @type {?} */
    WarpViewResultTileComponent.prototype.sizeService;
    /** @type {?} */
    WarpViewResultTileComponent.prototype.ngZone;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LXJlc3VsdC10aWxlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzZW54L3dhcnB2aWV3LyIsInNvdXJjZXMiOlsic3JjL2xpYi9lbGVtZW50cy93YXJwLXZpZXctcmVzdWx0LXRpbGUvd2FycC12aWV3LXJlc3VsdC10aWxlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBb0IsTUFBTSxlQUFlLENBQUM7QUFDdkgsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDekQsT0FBTyxFQUFDLElBQUksRUFBRSxXQUFXLEVBQUMsTUFBTSwrQkFBK0IsQ0FBQztBQUNoRSxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFHMUMsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBUS9DLE1BQU0sT0FBTywyQkFBNEIsU0FBUSxpQkFBaUI7Ozs7Ozs7SUErQ2hFLFlBQ1MsRUFBYyxFQUNkLFFBQW1CLEVBQ25CLFdBQXdCLEVBQ3hCLE1BQWM7UUFFckIsS0FBSyxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBTGxDLE9BQUUsR0FBRixFQUFFLENBQVk7UUFDZCxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ25CLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLFdBQU0sR0FBTixNQUFNLENBQVE7UUFyQ0YsZUFBVSxHQUFHLElBQUksQ0FBQztRQUNqQixlQUFVLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUM1Qix3QkFBbUIsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBQ3hELGNBQVMsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBQzlCLG9CQUFlLEdB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QUMsV0FBVzs4QkFDbEIsTUFBTSxTQUFDLGlCQUFpQjs7OztJQUp6QixpREFBdUM7O0lBQ3ZDLGlEQUEyRDs7SUFDM0QsMERBQTZFOztJQUM3RSxnREFBeUQ7O0lBQ3pELHNEQUFxRTs7SUFFckUsOENBQWU7O0lBQ2YsZ0RBQXFCOztJQUNyQiw2Q0FxQkU7Ozs7O0lBRUYsNENBQWM7O0lBR1oseUNBQXFCOztJQUNyQiwrQ0FBMEI7O0lBQzFCLGtEQUErQjs7SUFDL0IsNkNBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE5nWm9uZSwgT3V0cHV0LCBSZW5kZXJlcjIsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7V2FycFZpZXdDb21wb25lbnR9IGZyb20gJy4uL3dhcnAtdmlldy1jb21wb25lbnQnO1xuaW1wb3J0IHtTaXplLCBTaXplU2VydmljZX0gZnJvbSAnLi4vLi4vc2VydmljZXMvcmVzaXplLnNlcnZpY2UnO1xuaW1wb3J0IHtMb2dnZXJ9IGZyb20gJy4uLy4uL3V0aWxzL2xvZ2dlcic7XG5pbXBvcnQge1BhcmFtfSBmcm9tICcuLi8uLi9tb2RlbC9wYXJhbSc7XG5pbXBvcnQge0RhdGFNb2RlbH0gZnJvbSAnLi4vLi4vbW9kZWwvZGF0YU1vZGVsJztcbmltcG9ydCB7Q2hhcnRMaWJ9IGZyb20gJy4uLy4uL3V0aWxzL2NoYXJ0LWxpYic7XG5pbXBvcnQge1Jlc2l6ZWRFdmVudH0gZnJvbSAnYW5ndWxhci1yZXNpemUtZXZlbnQnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICd3YXJwdmlldy1yZXN1bHQtdGlsZScsXG4gIHRlbXBsYXRlVXJsOiAnLi93YXJwLXZpZXctcmVzdWx0LXRpbGUuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi93YXJwLXZpZXctcmVzdWx0LXRpbGUuY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBXYXJwVmlld1Jlc3VsdFRpbGVDb21wb25lbnQgZXh0ZW5kcyBXYXJwVmlld0NvbXBvbmVudCB7XG5cbiAgQElucHV0KCd0eXBlJykgc2V0IHR5cGUodHlwZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdHlwZSA9IHR5cGU7XG4gIH1cblxuICBnZXQgdHlwZSgpOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLmRhdGFNb2RlbCAmJiB0aGlzLmRhdGFNb2RlbC5nbG9iYWxQYXJhbXMpIHtcbiAgICAgIHJldHVybiB0aGlzLmRhdGFNb2RlbC5nbG9iYWxQYXJhbXMudHlwZSB8fCB0aGlzLl90eXBlIHx8ICdwbG90JztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX3R5cGUgfHwgJ3Bsb3QnO1xuICAgIH1cbiAgfVxuXG4gIEBJbnB1dCgnc3RhbmRhbG9uZScpIHN0YW5kYWxvbmUgPSB0cnVlO1xuICBAT3V0cHV0KCdwb2ludEhvdmVyJykgcG9pbnRIb3ZlciA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCd3YXJwVmlld0NoYXJ0UmVzaXplJykgd2FycFZpZXdDaGFydFJlc2l6ZSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCdjaGFydERyYXcnKSBjaGFydERyYXcgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgnYm91bmRzRGlkQ2hhbmdlJykgYm91bmRzRGlkQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgbG9hZGluZyA9IHRydWU7XG4gIGRhdGFNb2RlbDogRGF0YU1vZGVsO1xuICBncmFwaHMgPSB7XG4gICAgc3BlY3RydW06IFsnaGlzdG9ncmFtMmRjb250b3VyJywgJ2hpc3RvZ3JhbTJkJ10sXG4gICAgY2hhcnQ6IFsnbGluZScsICdzcGxpbmUnLCAnc3RlcCcsICdzdGVwLWFmdGVyJywgJ3N0ZXAtYmVmb3JlJywgJ2FyZWEnLCAnc2NhdHRlciddLFxuICAgIHBpZTogWydwaWUnLCAnZG9udXQnXSxcbiAgICBwb2xhcjogWydwb2xhciddLFxuICAgIHJhZGFyOiBbJ3JhZGFyJ10sXG4gICAgYmFyOiBbJ2JhciddLFxuICAgIGJ1YmJsZTogWydidWJibGUnXSxcbiAgICBhbm5vdGF0aW9uOiBbJ2Fubm90YXRpb24nXSxcbiAgICAnZ3RzLXRyZWUnOiBbJ2d0cy10cmVlJ10sXG4gICAgZGF0YWdyaWQ6IFsnZGF0YWdyaWQnXSxcbiAgICBkaXNwbGF5OiBbJ2Rpc3BsYXknXSxcbiAgICBkcmlsbGRvd246IFsnZHJpbGxkb3duJ10sXG4gICAgaW1hZ2U6IFsnaW1hZ2UnXSxcbiAgICBtYXA6IFsnbWFwJ10sXG4gICAgZ2F1Z2U6IFsnZ2F1Z2UnLCAnYnVsbGV0J10sXG4gICAgcGxvdDogWydwbG90J10sXG4gICAgYm94OiBbJ2JveCcsICdib3gtZGF0ZSddLFxuICAgIGxpbmUzZDogWydsaW5lM2QnXSxcbiAgICBnbG9iZTogWydnbG9iZSddLFxuICAgIGRyb3BzOiBbJ2Ryb3BzJ11cbiAgfTtcblxuICBwcml2YXRlIF90eXBlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBlbDogRWxlbWVudFJlZixcbiAgICBwdWJsaWMgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwdWJsaWMgc2l6ZVNlcnZpY2U6IFNpemVTZXJ2aWNlLFxuICAgIHB1YmxpYyBuZ1pvbmU6IE5nWm9uZVxuICApIHtcbiAgICBzdXBlcihlbCwgcmVuZGVyZXIsIHNpemVTZXJ2aWNlLCBuZ1pvbmUpO1xuICAgIHRoaXMuTE9HID0gbmV3IExvZ2dlcihXYXJwVmlld1Jlc3VsdFRpbGVDb21wb25lbnQsIHRoaXMuX2RlYnVnKTtcbiAgfVxuXG4gIHByb3RlY3RlZCB1cGRhdGUob3B0aW9uczogUGFyYW0sIHJlZnJlc2g6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMubG9hZGluZyA9IHRydWUpO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsncGFyc2VHVFMnLCAnZGF0YSddLCB0aGlzLl9kYXRhKTtcbiAgICB0aGlzLmRhdGFNb2RlbCA9IHRoaXMuX2RhdGE7XG4gICAgaWYgKCEhdGhpcy5kYXRhTW9kZWwpIHtcbiAgICAgIHRoaXMuX29wdGlvbnMgPSBDaGFydExpYi5tZXJnZURlZXAodGhpcy5fb3B0aW9ucywgb3B0aW9ucykgYXMgUGFyYW07XG4gICAgICB0aGlzLl9vcHRpb25zID0gQ2hhcnRMaWIubWVyZ2VEZWVwKENoYXJ0TGliLm1lcmdlRGVlcCh0aGlzLmRlZk9wdGlvbnMsIG9wdGlvbnMpLFxuICAgICAgICB0aGlzLl9kYXRhID8gdGhpcy5fZGF0YS5nbG9iYWxQYXJhbXMgfHwge30gOiB7fSkgYXMgUGFyYW07XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3BhcnNlR1RTJywgJ2RhdGEnXSwgdGhpcy5fZGF0YSk7XG4gICAgICB0aGlzLmRhdGFNb2RlbCA9IHRoaXMuX2RhdGE7XG4gICAgICBpZiAodGhpcy5fb3B0aW9ucykge1xuICAgICAgICB0aGlzLl91bml0ID0gdGhpcy5fb3B0aW9ucy51bml0IHx8IHRoaXMuX3VuaXQ7XG4gICAgICAgIHRoaXMuX3R5cGUgPSB0aGlzLl9vcHRpb25zLnR5cGUgfHwgdGhpcy5fdHlwZSB8fCAncGxvdCc7XG4gICAgICB9XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3BhcnNlR1RTJywgJ190eXBlJ10sIHRoaXMuX3R5cGUpO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmxvYWRpbmcgPSBmYWxzZSk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIGNvbnZlcnQoZGF0YTogRGF0YU1vZGVsKTogUGFydGlhbDxhbnk+W10ge1xuICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5sb2FkaW5nID0gdHJ1ZSk7XG4gICAgdGhpcy5MT0cuZGVidWcoWydjb252ZXJ0JywgJ2RhdGEnXSwgdGhpcy5fZGF0YSwgZGF0YSk7XG4gICAgdGhpcy5kYXRhTW9kZWwgPSBkYXRhO1xuICAgIGlmICh0aGlzLmRhdGFNb2RlbC5nbG9iYWxQYXJhbXMpIHtcbiAgICAgIHRoaXMuX3VuaXQgPSB0aGlzLmRhdGFNb2RlbC5nbG9iYWxQYXJhbXMudW5pdCB8fCB0aGlzLl91bml0O1xuICAgICAgdGhpcy5fdHlwZSA9IHRoaXMuZGF0YU1vZGVsLmdsb2JhbFBhcmFtcy50eXBlIHx8IHRoaXMuX3R5cGUgfHwgJ3Bsb3QnO1xuICAgIH1cbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2NvbnZlcnQnLCAnX3R5cGUnXSwgdGhpcy5fdHlwZSk7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgb25SZXNpemVkKGV2ZW50OiBSZXNpemVkRXZlbnQpIHtcbiAgICB0aGlzLndpZHRoID0gZXZlbnQubmV3V2lkdGg7XG4gICAgdGhpcy5oZWlnaHQgPSBldmVudC5uZXdIZWlnaHQ7XG4gICAgdGhpcy5MT0cuZGVidWcoWydvblJlc2l6ZWQnXSwgZXZlbnQubmV3V2lkdGgsIGV2ZW50Lm5ld0hlaWdodCk7XG4gICAgdGhpcy5zaXplU2VydmljZS5jaGFuZ2UobmV3IFNpemUodGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpKTtcbiAgfVxuXG4gIGNoYXJ0RHJhd24oKSB7XG4gICAgdGhpcy5MT0cuZGVidWcoWydjaGFydERyYXduJ10pO1xuICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5sb2FkaW5nID0gZmFsc2UpO1xuICAgIHRoaXMuY2hhcnREcmF3LmVtaXQoKTtcbiAgfVxufVxuIl19