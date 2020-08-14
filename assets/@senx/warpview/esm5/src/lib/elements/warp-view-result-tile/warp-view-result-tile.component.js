/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component, ElementRef, EventEmitter, Input, NgZone, Output, Renderer2 } from '@angular/core';
import { WarpViewComponent } from '../warp-view-component';
import { Size, SizeService } from '../../services/resize.service';
import { Logger } from '../../utils/logger';
import { ChartLib } from '../../utils/chart-lib';
var WarpViewResultTileComponent = /** @class */ (function (_super) {
    tslib_1.__extends(WarpViewResultTileComponent, _super);
    function WarpViewResultTileComponent(el, renderer, sizeService, ngZone) {
        var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
        _this.el = el;
        _this.renderer = renderer;
        _this.sizeService = sizeService;
        _this.ngZone = ngZone;
        _this.standalone = true;
        _this.pointHover = new EventEmitter();
        _this.warpViewChartResize = new EventEmitter();
        _this.chartDraw = new EventEmitter();
        _this.boundsDidChange = new EventEmitter();
        _this.loading = true;
        _this.graphs = {
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
        _this.LOG = new Logger(WarpViewResultTileComponent, _this._debug);
        return _this;
    }
    Object.defineProperty(WarpViewResultTileComponent.prototype, "type", {
        get: /**
         * @return {?}
         */
        function () {
            if (this.dataModel && this.dataModel.globalParams) {
                return this.dataModel.globalParams.type || this._type || 'plot';
            }
            else {
                return this._type || 'plot';
            }
        },
        set: /**
         * @param {?} type
         * @return {?}
         */
        function (type) {
            this._type = type;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @protected
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    WarpViewResultTileComponent.prototype.update = /**
     * @protected
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    function (options, refresh) {
        var _this = this;
        setTimeout((/**
         * @return {?}
         */
        function () { return _this.loading = true; }));
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
            function () { return _this.loading = false; }));
        }
    };
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    WarpViewResultTileComponent.prototype.convert = /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    function (data) {
        var _this = this;
        setTimeout((/**
         * @return {?}
         */
        function () { return _this.loading = true; }));
        this.LOG.debug(['convert', 'data'], this._data, data);
        this.dataModel = data;
        if (this.dataModel.globalParams) {
            this._unit = this.dataModel.globalParams.unit || this._unit;
            this._type = this.dataModel.globalParams.type || this._type || 'plot';
        }
        this.LOG.debug(['convert', '_type'], this._type);
        return [];
    };
    /**
     * @param {?} event
     * @return {?}
     */
    WarpViewResultTileComponent.prototype.onResized = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.width = event.newWidth;
        this.height = event.newHeight;
        this.LOG.debug(['onResized'], event.newWidth, event.newHeight);
        this.sizeService.change(new Size(this.width, this.height));
    };
    /**
     * @return {?}
     */
    WarpViewResultTileComponent.prototype.chartDrawn = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.LOG.debug(['chartDrawn']);
        setTimeout((/**
         * @return {?}
         */
        function () { return _this.loading = false; }));
        this.chartDraw.emit();
    };
    WarpViewResultTileComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-result-tile',
                    template: "<div class=\"wrapper\" [ngClass]=\"{'full':  responsive}\" (resized)=\"onResized($event)\">\n    <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n    <div style=\"height: 100%\" [hidden]=\"loading\">\n      <warpview-spectrum [debug]=\"debug\" [type]=\"type\" [unit]=\"unit\" [options]=\"_options\"\n                         [showLegend]=\"showLegend\" [data]=\"dataModel\" (chartDraw)=\"chartDrawn()\"\n                         *ngIf=\"graphs['spectrum'].indexOf(type) > -1 && dataModel\"\n                         [responsive]=\"true\"></warpview-spectrum>\n\n      <warpview-chart [debug]=\"debug\" [type]=\"type\" [unit]=\"unit\" [options]=\"_options\"\n                      (chartDraw)=\"chartDrawn()\"\n                      [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                      *ngIf=\"graphs['chart'].indexOf(type) > -1 && dataModel\"\n                      [responsive]=\"true\"></warpview-chart>\n\n      <warpview-plot [debug]=\"debug\" [type]=\"type\" [unit]=\"unit\" [options]=\"_options\"\n                     (chartDraw)=\"chartDrawn()\"\n                     [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                     *ngIf=\"graphs['plot'].indexOf(type) > -1 && dataModel\"\n                     [responsive]=\"true\"></warpview-plot>\n\n      <warpview-bar [debug]=\"debug\" [unit]=\"unit\" [options]=\"_options\"\n                    (chartDraw)=\"chartDrawn()\"\n                    [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                    *ngIf=\"graphs['bar'].indexOf(type) > -1 && dataModel\"\n                    [responsive]=\"true\"></warpview-bar>\n\n      <warpview-bubble [debug]=\"debug\" [unit]=\"unit\" [options]=\"_options\"\n                       (chartDraw)=\"chartDrawn()\"\n                       [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                       *ngIf=\"graphs['bubble'].indexOf(type) > -1 && dataModel\"\n                       [responsive]=\"true\"></warpview-bubble>\n\n      <warpview-datagrid [debug]=\"debug\" [options]=\"_options\"\n                         (chartDraw)=\"chartDrawn()\"\n                         [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                         *ngIf=\"graphs['datagrid'].indexOf(type) > -1 && dataModel\"\n                         [responsive]=\"true\"></warpview-datagrid>\n\n      <warpview-display [debug]=\"debug\" [options]=\"_options\"\n                        (chartDraw)=\"chartDrawn()\"\n                        [showLegend]=\"showLegend\" [data]=\"dataModel\" [unit]=\"unit\"\n                        *ngIf=\"graphs['display'].indexOf(type) > -1 && dataModel\"\n                        [responsive]=\"true\"></warpview-display>\n\n      <warpview-drill-down [debug]=\"debug\" [options]=\"_options\"\n                           (chartDraw)=\"chartDrawn()\"\n                           [showLegend]=\"showLegend\" [data]=\"dataModel\" [unit]=\"unit\"\n                           *ngIf=\"graphs['drilldown'].indexOf(type) > -1 && dataModel\"\n                           [responsive]=\"true\"></warpview-drill-down>\n\n      <warpview-gts-tree *ngIf=\"graphs['gts-tree'].indexOf(type) > -1 && dataModel\"\n                         (chartDraw)=\"chartDrawn()\"\n                         [responsive]=\"true\" [debug]=\"debug\" [data]=\"dataModel\"\n                         [options]=\"_options\"></warpview-gts-tree>\n\n      <warpview-image *ngIf=\"graphs['image'].indexOf(type) > -1 && dataModel\"\n                      (chartDraw)=\"chartDrawn()\"\n                      [responsive]=\"true\" [debug]=\"debug\" [data]=\"dataModel\" [options]=\"_options\"></warpview-image>\n\n      <warpview-map *ngIf=\"graphs['map'].indexOf(type) > -1 && dataModel\" [responsive]=\"true\" [debug]=\"debug\"\n                    (chartDraw)=\"chartDrawn()\"\n                    [data]=\"dataModel\" [options]=\"_options\"></warpview-map>\n\n      <warpview-pie [debug]=\"debug\" [type]=\"type\" [unit]=\"unit\" [options]=\"_options\"\n                    (chartDraw)=\"chartDrawn()\"\n                    [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                    *ngIf=\"graphs['pie'].indexOf(type) > -1 && dataModel\"\n                    [responsive]=\"true\"></warpview-pie>\n\n      <warpview-gauge [debug]=\"debug\" [type]=\"type\" [unit]=\"unit\" [options]=\"_options\"\n                      (chartDraw)=\"chartDrawn()\"\n                      [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                      *ngIf=\"graphs['gauge'].indexOf(type) > -1 && dataModel\"\n                      [responsive]=\"true\"></warpview-gauge>\n\n      <warpview-annotation [debug]=\"debug\" [unit]=\"unit\" [options]=\"_options\"\n                           (chartDraw)=\"chartDrawn()\"\n                           [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                           [standalone]=\"true\" [type]=\"type\"\n                           *ngIf=\"graphs['annotation'].indexOf(type) > -1 && dataModel\"\n                           [responsive]=\"true\"></warpview-annotation>\n\n      <warpview-event-drop [debug]=\"debug\" [unit]=\"unit\" [options]=\"_options\"\n                           (chartDraw)=\"chartDrawn()\"\n                           [showLegend]=\"showLegend\" [data]=\"dataModel\" [type]=\"type\"\n                           *ngIf=\"graphs['drops'].indexOf(type) > -1 && dataModel\"\n                           [responsive]=\"true\"></warpview-event-drop>\n\n      <warpview-polar [debug]=\"debug\" [unit]=\"unit\" [options]=\"_options\"\n                      (chartDraw)=\"chartDrawn()\"\n                      [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                      *ngIf=\"graphs['polar'].indexOf(type) > -1 && dataModel\"\n                      [responsive]=\"true\"></warpview-polar>\n\n      <warpview-radar [debug]=\"debug\" [unit]=\"unit\" [options]=\"_options\"\n                      (chartDraw)=\"chartDrawn()\"\n                      [showLegend]=\"showLegend\" [data]=\"dataModel\"\n                      *ngIf=\"graphs['radar'].indexOf(type) > -1 && dataModel\"\n                      [responsive]=\"true\"></warpview-radar>\n\n      <warpview-box [debug]=\"debug\" [unit]=\"unit\" [options]=\"_options\"\n                    (chartDraw)=\"chartDrawn()\"\n                    [showLegend]=\"showLegend\" [data]=\"dataModel\" [type]=\"type\"\n                    *ngIf=\"graphs['box'].indexOf(type) > -1 && dataModel\"\n                    [responsive]=\"true\"></warpview-box>\n\n      <warpview-3d-line [debug]=\"debug\" [unit]=\"unit\" [options]=\"_options\"\n                        (chartDraw)=\"chartDrawn()\"\n                        [showLegend]=\"showLegend\" [data]=\"dataModel\" [type]=\"type\"\n                        *ngIf=\"graphs['line3d'].indexOf(type) > -1 && dataModel\"\n                        [responsive]=\"true\"></warpview-3d-line>\n      <warpview-globe [debug]=\"debug\" [unit]=\"unit\" [options]=\"_options\"\n                      (chartDraw)=\"chartDrawn()\"\n                      [showLegend]=\"showLegend\" [data]=\"dataModel\" [type]=\"type\"\n                      *ngIf=\"graphs['globe'].indexOf(type) > -1 && dataModel\"\n                      [responsive]=\"true\"></warpview-globe>\n    </div>\n</div>\n",
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host,warp-view-result-tile,warpview-result-tile{width:var(--warp-view-tile-width,100%);max-height:var(--warp-view-tile-height,100%);overflow:auto;min-width:var(--warp-view-tile-width,100%);min-height:var(--warp-view-tile-height,100%)}:host .error,warp-view-result-tile .error,warpview-result-tile .error{width:100%;text-align:center;color:#dc3545;font-weight:700}:host .wrapper,warp-view-result-tile .wrapper,warpview-result-tile .wrapper{opacity:1;min-height:50px;width:var(--warp-view-tile-width,100%);height:var(--warp-view-tile-height,100%)}:host .wrapper.full,warp-view-result-tile .wrapper.full,warpview-result-tile .wrapper.full{width:100%;height:100%}:host .wrapper .tilewrapper,warp-view-result-tile .wrapper .tilewrapper,warpview-result-tile .wrapper .tilewrapper{width:100%;height:100%}:host .wrapper .tilewrapper .tile,warp-view-result-tile .wrapper .tilewrapper .tile,warpview-result-tile .wrapper .tilewrapper .tile{width:100%;height:calc(var(--warp-view-tile-height,100%) - 40px);overflow-y:auto;overflow-x:hidden}:host .wrapper .tilewrapper .notitle,warp-view-result-tile .wrapper .tilewrapper .notitle,warpview-result-tile .wrapper .tilewrapper .notitle{height:100%;overflow:hidden}:host .wrapper .tilewrapper h1,warp-view-result-tile .wrapper .tilewrapper h1,warpview-result-tile .wrapper .tilewrapper h1{font-size:20px;padding:5px;margin:0;color:var(--warp-view-font-color)}:host .wrapper .tilewrapper h1 small,warp-view-result-tile .wrapper .tilewrapper h1 small,warpview-result-tile .wrapper .tilewrapper h1 small{font-size:10px;margin-left:10px}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewResultTileComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: SizeService },
        { type: NgZone }
    ]; };
    WarpViewResultTileComponent.propDecorators = {
        type: [{ type: Input, args: ['type',] }],
        standalone: [{ type: Input, args: ['standalone',] }],
        pointHover: [{ type: Output, args: ['pointHover',] }],
        warpViewChartResize: [{ type: Output, args: ['warpViewChartResize',] }],
        chartDraw: [{ type: Output, args: ['chartDraw',] }],
        boundsDidChange: [{ type: Output, args: ['boundsDidChange',] }]
    };
    return WarpViewResultTileComponent;
}(WarpViewComponent));
export { WarpViewResultTileComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LXJlc3VsdC10aWxlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzZW54L3dhcnB2aWV3LyIsInNvdXJjZXMiOlsic3JjL2xpYi9lbGVtZW50cy93YXJwLXZpZXctcmVzdWx0LXRpbGUvd2FycC12aWV3LXJlc3VsdC10aWxlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQW9CLE1BQU0sZUFBZSxDQUFDO0FBQ3ZILE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3pELE9BQU8sRUFBQyxJQUFJLEVBQUUsV0FBVyxFQUFDLE1BQU0sK0JBQStCLENBQUM7QUFDaEUsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBRzFDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUcvQztJQUtpRCx1REFBaUI7SUErQ2hFLHFDQUNTLEVBQWMsRUFDZCxRQUFtQixFQUNuQixXQUF3QixFQUN4QixNQUFjO1FBSnZCLFlBTUUsa0JBQU0sRUFBRSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsTUFBTSxDQUFDLFNBRXpDO1FBUFEsUUFBRSxHQUFGLEVBQUUsQ0FBWTtRQUNkLGNBQVEsR0FBUixRQUFRLENBQVc7UUFDbkIsaUJBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIsWUFBTSxHQUFOLE1BQU0sQ0FBUTtRQXJDRixnQkFBVSxHQUFHLElBQUksQ0FBQztRQUNqQixnQkFBVSxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFDNUIseUJBQW1CLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUN4RCxlQUFTLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUM5QixxQkFBZSxHQUFHLElBQUksWUFBWSxFQUFP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QkFnQnZELEtBQUssU0FBQyxNQUFNOzZCQVlaLEtBQUssU0FBQyxZQUFZOzZCQUNsQixNQUFNLFNBQUMsWUFBWTtzQ0FDbkIsTUFBTSxTQUFDLHFCQUFxQjs0QkFDNUIsTUFBTSxTQUFDLFdBQVc7a0NBQ2xCLE1BQU0sU0FBQyxpQkFBaUI7O0lBa0YzQixrQ0FBQztDQUFBLEFBekdELENBS2lELGlCQUFpQixHQW9HakU7U0FwR1ksMkJBQTJCOzs7SUFjdEMsaURBQXVDOztJQUN2QyxpREFBMkQ7O0lBQzNELDBEQUE2RTs7SUFDN0UsZ0RBQXlEOztJQUN6RCxzREFBcUU7O0lBRXJFLDhDQUFlOztJQUNmLGdEQUFxQjs7SUFDckIsNkNBcUJFOzs7OztJQUVGLDRDQUFjOztJQUdaLHlDQUFxQjs7SUFDckIsK0NBQTBCOztJQUMxQixrREFBK0I7O0lBQy9CLDZDQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIElucHV0LCBOZ1pvbmUsIE91dHB1dCwgUmVuZGVyZXIyLCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1dhcnBWaWV3Q29tcG9uZW50fSBmcm9tICcuLi93YXJwLXZpZXctY29tcG9uZW50JztcbmltcG9ydCB7U2l6ZSwgU2l6ZVNlcnZpY2V9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3Jlc2l6ZS5zZXJ2aWNlJztcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICcuLi8uLi91dGlscy9sb2dnZXInO1xuaW1wb3J0IHtQYXJhbX0gZnJvbSAnLi4vLi4vbW9kZWwvcGFyYW0nO1xuaW1wb3J0IHtEYXRhTW9kZWx9IGZyb20gJy4uLy4uL21vZGVsL2RhdGFNb2RlbCc7XG5pbXBvcnQge0NoYXJ0TGlifSBmcm9tICcuLi8uLi91dGlscy9jaGFydC1saWInO1xuaW1wb3J0IHtSZXNpemVkRXZlbnR9IGZyb20gJ2FuZ3VsYXItcmVzaXplLWV2ZW50JztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnd2FycHZpZXctcmVzdWx0LXRpbGUnLFxuICB0ZW1wbGF0ZVVybDogJy4vd2FycC12aWV3LXJlc3VsdC10aWxlLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vd2FycC12aWV3LXJlc3VsdC10aWxlLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgV2FycFZpZXdSZXN1bHRUaWxlQ29tcG9uZW50IGV4dGVuZHMgV2FycFZpZXdDb21wb25lbnQge1xuXG4gIEBJbnB1dCgndHlwZScpIHNldCB0eXBlKHR5cGU6IHN0cmluZykge1xuICAgIHRoaXMuX3R5cGUgPSB0eXBlO1xuICB9XG5cbiAgZ2V0IHR5cGUoKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5kYXRhTW9kZWwgJiYgdGhpcy5kYXRhTW9kZWwuZ2xvYmFsUGFyYW1zKSB7XG4gICAgICByZXR1cm4gdGhpcy5kYXRhTW9kZWwuZ2xvYmFsUGFyYW1zLnR5cGUgfHwgdGhpcy5fdHlwZSB8fCAncGxvdCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl90eXBlIHx8ICdwbG90JztcbiAgICB9XG4gIH1cblxuICBASW5wdXQoJ3N0YW5kYWxvbmUnKSBzdGFuZGFsb25lID0gdHJ1ZTtcbiAgQE91dHB1dCgncG9pbnRIb3ZlcicpIHBvaW50SG92ZXIgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgnd2FycFZpZXdDaGFydFJlc2l6ZScpIHdhcnBWaWV3Q2hhcnRSZXNpemUgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgnY2hhcnREcmF3JykgY2hhcnREcmF3ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoJ2JvdW5kc0RpZENoYW5nZScpIGJvdW5kc0RpZENoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIGxvYWRpbmcgPSB0cnVlO1xuICBkYXRhTW9kZWw6IERhdGFNb2RlbDtcbiAgZ3JhcGhzID0ge1xuICAgIHNwZWN0cnVtOiBbJ2hpc3RvZ3JhbTJkY29udG91cicsICdoaXN0b2dyYW0yZCddLFxuICAgIGNoYXJ0OiBbJ2xpbmUnLCAnc3BsaW5lJywgJ3N0ZXAnLCAnc3RlcC1hZnRlcicsICdzdGVwLWJlZm9yZScsICdhcmVhJywgJ3NjYXR0ZXInXSxcbiAgICBwaWU6IFsncGllJywgJ2RvbnV0J10sXG4gICAgcG9sYXI6IFsncG9sYXInXSxcbiAgICByYWRhcjogWydyYWRhciddLFxuICAgIGJhcjogWydiYXInXSxcbiAgICBidWJibGU6IFsnYnViYmxlJ10sXG4gICAgYW5ub3RhdGlvbjogWydhbm5vdGF0aW9uJ10sXG4gICAgJ2d0cy10cmVlJzogWydndHMtdHJlZSddLFxuICAgIGRhdGFncmlkOiBbJ2RhdGFncmlkJ10sXG4gICAgZGlzcGxheTogWydkaXNwbGF5J10sXG4gICAgZHJpbGxkb3duOiBbJ2RyaWxsZG93biddLFxuICAgIGltYWdlOiBbJ2ltYWdlJ10sXG4gICAgbWFwOiBbJ21hcCddLFxuICAgIGdhdWdlOiBbJ2dhdWdlJywgJ2J1bGxldCddLFxuICAgIHBsb3Q6IFsncGxvdCddLFxuICAgIGJveDogWydib3gnLCAnYm94LWRhdGUnXSxcbiAgICBsaW5lM2Q6IFsnbGluZTNkJ10sXG4gICAgZ2xvYmU6IFsnZ2xvYmUnXSxcbiAgICBkcm9wczogWydkcm9wcyddXG4gIH07XG5cbiAgcHJpdmF0ZSBfdHlwZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgZWw6IEVsZW1lbnRSZWYsXG4gICAgcHVibGljIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHVibGljIHNpemVTZXJ2aWNlOiBTaXplU2VydmljZSxcbiAgICBwdWJsaWMgbmdab25lOiBOZ1pvbmVcbiAgKSB7XG4gICAgc3VwZXIoZWwsIHJlbmRlcmVyLCBzaXplU2VydmljZSwgbmdab25lKTtcbiAgICB0aGlzLkxPRyA9IG5ldyBMb2dnZXIoV2FycFZpZXdSZXN1bHRUaWxlQ29tcG9uZW50LCB0aGlzLl9kZWJ1Zyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgdXBkYXRlKG9wdGlvbnM6IFBhcmFtLCByZWZyZXNoOiBib29sZWFuKTogdm9pZCB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmxvYWRpbmcgPSB0cnVlKTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3BhcnNlR1RTJywgJ2RhdGEnXSwgdGhpcy5fZGF0YSk7XG4gICAgdGhpcy5kYXRhTW9kZWwgPSB0aGlzLl9kYXRhO1xuICAgIGlmICghIXRoaXMuZGF0YU1vZGVsKSB7XG4gICAgICB0aGlzLl9vcHRpb25zID0gQ2hhcnRMaWIubWVyZ2VEZWVwKHRoaXMuX29wdGlvbnMsIG9wdGlvbnMpIGFzIFBhcmFtO1xuICAgICAgdGhpcy5fb3B0aW9ucyA9IENoYXJ0TGliLm1lcmdlRGVlcChDaGFydExpYi5tZXJnZURlZXAodGhpcy5kZWZPcHRpb25zLCBvcHRpb25zKSxcbiAgICAgICAgdGhpcy5fZGF0YSA/IHRoaXMuX2RhdGEuZ2xvYmFsUGFyYW1zIHx8IHt9IDoge30pIGFzIFBhcmFtO1xuICAgICAgdGhpcy5MT0cuZGVidWcoWydwYXJzZUdUUycsICdkYXRhJ10sIHRoaXMuX2RhdGEpO1xuICAgICAgdGhpcy5kYXRhTW9kZWwgPSB0aGlzLl9kYXRhO1xuICAgICAgaWYgKHRoaXMuX29wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5fdW5pdCA9IHRoaXMuX29wdGlvbnMudW5pdCB8fCB0aGlzLl91bml0O1xuICAgICAgICB0aGlzLl90eXBlID0gdGhpcy5fb3B0aW9ucy50eXBlIHx8IHRoaXMuX3R5cGUgfHwgJ3Bsb3QnO1xuICAgICAgfVxuICAgICAgdGhpcy5MT0cuZGVidWcoWydwYXJzZUdUUycsICdfdHlwZSddLCB0aGlzLl90eXBlKTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5sb2FkaW5nID0gZmFsc2UpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBjb252ZXJ0KGRhdGE6IERhdGFNb2RlbCk6IFBhcnRpYWw8YW55PltdIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMubG9hZGluZyA9IHRydWUpO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnY29udmVydCcsICdkYXRhJ10sIHRoaXMuX2RhdGEsIGRhdGEpO1xuICAgIHRoaXMuZGF0YU1vZGVsID0gZGF0YTtcbiAgICBpZiAodGhpcy5kYXRhTW9kZWwuZ2xvYmFsUGFyYW1zKSB7XG4gICAgICB0aGlzLl91bml0ID0gdGhpcy5kYXRhTW9kZWwuZ2xvYmFsUGFyYW1zLnVuaXQgfHwgdGhpcy5fdW5pdDtcbiAgICAgIHRoaXMuX3R5cGUgPSB0aGlzLmRhdGFNb2RlbC5nbG9iYWxQYXJhbXMudHlwZSB8fCB0aGlzLl90eXBlIHx8ICdwbG90JztcbiAgICB9XG4gICAgdGhpcy5MT0cuZGVidWcoWydjb252ZXJ0JywgJ190eXBlJ10sIHRoaXMuX3R5cGUpO1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIG9uUmVzaXplZChldmVudDogUmVzaXplZEV2ZW50KSB7XG4gICAgdGhpcy53aWR0aCA9IGV2ZW50Lm5ld1dpZHRoO1xuICAgIHRoaXMuaGVpZ2h0ID0gZXZlbnQubmV3SGVpZ2h0O1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnb25SZXNpemVkJ10sIGV2ZW50Lm5ld1dpZHRoLCBldmVudC5uZXdIZWlnaHQpO1xuICAgIHRoaXMuc2l6ZVNlcnZpY2UuY2hhbmdlKG5ldyBTaXplKHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KSk7XG4gIH1cblxuICBjaGFydERyYXduKCkge1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnY2hhcnREcmF3biddKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMubG9hZGluZyA9IGZhbHNlKTtcbiAgICB0aGlzLmNoYXJ0RHJhdy5lbWl0KCk7XG4gIH1cbn1cbiJdfQ==