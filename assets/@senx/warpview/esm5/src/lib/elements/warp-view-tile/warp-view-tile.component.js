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
import { Component, ElementRef, EventEmitter, HostListener, Input, NgZone, Output, Renderer2, ViewChild } from '@angular/core';
import { GTSLib } from '../../utils/gts.lib';
import { HttpErrorHandler } from '../../services/http-error-handler.service';
import { WarpViewComponent } from '../warp-view-component';
import { SizeService } from '../../services/resize.service';
import { Warp10Service } from '../../services/warp10.service';
import { Logger } from '../../utils/logger';
var WarpViewTileComponent = /** @class */ (function (_super) {
    tslib_1.__extends(WarpViewTileComponent, _super);
    function WarpViewTileComponent(el, sizeService, renderer, ngZone, warp10Service) {
        var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
        _this.el = el;
        _this.sizeService = sizeService;
        _this.renderer = renderer;
        _this.ngZone = ngZone;
        _this.warp10Service = warp10Service;
        _this.warpscriptResult = new EventEmitter();
        _this.execStatus = new EventEmitter();
        _this.execError = new EventEmitter();
        _this.type = 'line';
        _this.url = '';
        _this.isAlone = false; // used by plot to manage its keyboard events
        _this.loaderMessage = '';
        _this.loading = false;
        _this._gtsFilter = '';
        _this._warpScript = '';
        _this.execUrl = '';
        _this.timeUnit = 'us';
        _this.LOG = new Logger(WarpViewTileComponent, _this._debug);
        return _this;
    }
    Object.defineProperty(WarpViewTileComponent.prototype, "gtsFilter", {
        set: 
        // used by plot to manage its keyboard events
        /**
         * @param {?} gtsFilter
         * @return {?}
         */
        function (gtsFilter) {
            this._gtsFilter = gtsFilter;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarpViewTileComponent.prototype, "warpscript", {
        get: /**
         * @return {?}
         */
        function () {
            return this._warpScript;
        },
        set: /**
         * @param {?} warpScript
         * @return {?}
         */
        function (warpScript) {
            if (!!warpScript && this._warpScript !== warpScript) {
                this._warpScript = warpScript;
                this.execute(true);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    WarpViewTileComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this._options = this._options || this.defOptions;
    };
    /**
     * @return {?}
     */
    WarpViewTileComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        this._warpScript = this._warpScript || this.warpRef.nativeElement.textContent.trim();
        this.LOG.debug(['ngAfterViewInit', 'warpScript'], this._warpScript);
        this.el.nativeElement.style.opacity = '1';
        if (this.warpRef.nativeElement.textContent.trim() !== '') {
            this.execute(false);
        }
    };
    /**
     * @param {?} options
     * @return {?}
     */
    WarpViewTileComponent.prototype.update = /**
     * @param {?} options
     * @return {?}
     */
    function (options) {
        this.LOG.debug(['update', 'options'], options);
    };
    /* Listeners */
    /* Listeners */
    /**
     * @param {?} event
     * @return {?}
     */
    // @HostListener('keydown', ['$event'])
    WarpViewTileComponent.prototype.handleKeyDown = /* Listeners */
    /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (event.key === 'r') {
            this.execute(false);
        }
    };
    /** detect some VSCode special modifiers in the beginnig of the code:
     * @endpoint xxxURLxxx
     * @timeUnit ns
     * warning : the first line is empty (to confirm with other browsers)
     */
    /**
     * detect some VSCode special modifiers in the beginnig of the code:
     * \@endpoint xxxURLxxx
     * \@timeUnit ns
     * warning : the first line is empty (to confirm with other browsers)
     * @private
     * @return {?}
     */
    WarpViewTileComponent.prototype.detectWarpScriptSpecialComments = /**
     * detect some VSCode special modifiers in the beginnig of the code:
     * \@endpoint xxxURLxxx
     * \@timeUnit ns
     * warning : the first line is empty (to confirm with other browsers)
     * @private
     * @return {?}
     */
    function () {
        // analyse the first warpScript lines starting with //
        /** @type {?} */
        var extraParamsPattern = /\s*\/\/\s*@(\w*)\s*(.*)$/g;
        /** @type {?} */
        var warpscriptLines = this._warpScript.split('\n');
        for (var l = 1; l < warpscriptLines.length; l++) {
            /** @type {?} */
            var currentLine = warpscriptLines[l];
            if (currentLine === '' || currentLine.search('//') >= 0) {
                // find and extract // @paramname parameters
                /** @type {?} */
                var lineOnMatch = void 0;
                /** @type {?} */
                var re = RegExp(extraParamsPattern);
                // noinspection JSAssignmentUsedAsCondition
                // tslint:disable-next-line:no-conditional-assignment JSAssignmentUsedAsCondition
                // noinspection JSAssignmentUsedAsCondition
                while (lineOnMatch = re.exec(currentLine)) {
                    /** @type {?} */
                    var parameterName = lineOnMatch[1];
                    /** @type {?} */
                    var parameterValue = lineOnMatch[2];
                    switch (parameterName) {
                        case 'endpoint': //        // @endpoint http://mywarp10server/api/v0/exec
                            this.execUrl = parameterValue;
                            break;
                        case 'timeUnit':
                            this.timeUnit = parameterValue.toLowerCase(); // set the time unit for graphs
                            break;
                        default:
                            break;
                    }
                }
            }
            else {
                break; // no more comments at the beginning of the file
            }
        }
    };
    /**
     * @private
     * @param {?} isRefresh
     * @return {?}
     */
    WarpViewTileComponent.prototype.execute = /**
     * @private
     * @param {?} isRefresh
     * @return {?}
     */
    function (isRefresh) {
        var _this = this;
        if (!!this._warpScript && this._warpScript.trim() !== '') {
            this.LOG.debug(['execute'], isRefresh);
            this.error = undefined;
            this.loading = !isRefresh;
            this.execResult = undefined;
            this.loaderMessage = 'Requesting data';
            this.execUrl = this.url;
            //  this.execResult = undefined;
            this.detectWarpScriptSpecialComments();
            this.LOG.debug(['execute', 'warpScript'], this._warpScript);
            this.warp10Service.exec(this._warpScript, this.execUrl).subscribe((/**
             * @param {?} response
             * @return {?}
             */
            function (response) {
                _this.loading = false;
                _this.LOG.debug(['execute'], response);
                if (((/** @type {?} */ (response))).body) {
                    try {
                        /** @type {?} */
                        var body_1 = ((/** @type {?} */ (response))).body;
                        _this.warpscriptResult.emit(body_1);
                        /** @type {?} */
                        var headers = ((/** @type {?} */ (response))).headers;
                        _this.status = "Your script execution took\n " + GTSLib.formatElapsedTime(parseInt(headers.get('x-warp10-elapsed'), 10)) + "\n serverside, fetched\n " + headers.get('x-warp10-fetched') + " datapoints and performed\n " + headers.get('x-warp10-ops') + "  WarpScript operations.";
                        _this.execStatus.emit({
                            message: _this.status,
                            ops: parseInt(headers.get('x-warp10-ops'), 10),
                            elapsed: parseInt(headers.get('x-warp10-elapsed'), 10),
                            fetched: parseInt(headers.get('x-warp10-fetched'), 10),
                        });
                        if (_this._autoRefresh !== _this._options.autoRefresh) {
                            _this._autoRefresh = _this._options.autoRefresh;
                            if (_this.timer) {
                                window.clearInterval(_this.timer);
                            }
                            if (_this._autoRefresh && _this._autoRefresh > 0) {
                                _this.timer = window.setInterval((/**
                                 * @return {?}
                                 */
                                function () { return _this.execute(true); }), _this._autoRefresh * 1000);
                            }
                        }
                        setTimeout((/**
                         * @return {?}
                         */
                        function () {
                            _this.execResult = body_1;
                            _this.loading = false;
                        }));
                    }
                    catch (e) {
                        _this.LOG.error(['execute'], e);
                        _this.loading = false;
                    }
                }
                else {
                    _this.LOG.error(['execute'], response);
                    _this.error = response;
                    _this.loading = false;
                    _this.execError.emit(response);
                }
            }), (/**
             * @param {?} e
             * @return {?}
             */
            function (e) {
                _this.loading = false;
                _this.execError.emit(e);
                _this.LOG.error(['execute'], e);
            }));
        }
    };
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    WarpViewTileComponent.prototype.convert = /**
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
    WarpViewTileComponent.prototype.chartDrawn = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.chartDraw.emit(event);
    };
    WarpViewTileComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-tile',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n<div class=\"wrapper\" [ngClass]=\"{'full':  responsive}\">\n  <div class=\"tilewrapper\">\n    <h1 *ngIf=\"chartTitle\">{{chartTitle}}</h1>\n    <div [ngClass]=\"{'tile': true,'notitle':  !chartTitle || chartTitle === ''}\">\n      <warpview-spinner *ngIf=\"loading\" message=\"Requesting data\"></warpview-spinner>\n      <div *ngIf=\"_options.showErrors && error\" style=\"height: calc(100% - 30px); width: 100%\">\n        <warpview-display [responsive]=\"true\" [debug]=\"debug\" [options]=\"_options\"\n                          [data]=\"{ data: error,  globalParams: {\n  timeMode:  'custom', bgColor: '#D32C2E', fontColor: '#ffffff'}}\"></warpview-display>\n      </div>\n      <div *ngIf=\"!error\" style=\"height: 100%; width: 100%\" [hidden]=\"loading\">\n        <warpview-result-tile [debug]=\"debug\" [type]=\"type\" [unit]=\"unit\" [options]=\"_options\"\n                              (chartDraw)=\"chartDrawn($event)\"\n                              [showLegend]=\"showLegend\" [data]=\"execResult\"></warpview-result-tile>\n      </div>\n    </div>\n  </div>\n  <small *ngIf=\"_options.showStatus\" class=\"status\">{{status}}</small>\n</div>\n\n<div #warpRef style=\"display: none\">\n  <ng-content></ng-content>\n</div>\n",
                    providers: [HttpErrorHandler],
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host,warp-view-tile,warpview-tile{width:var(--warp-view-tile-width,100%);max-height:var(--warp-view-tile-height,100%);overflow:auto;min-width:var(--warp-view-tile-width,100%);min-height:var(--warp-view-tile-height,100%)}:host .error,warp-view-tile .error,warpview-tile .error{width:100%;text-align:center;color:#dc3545;font-weight:700}:host .wrapper,warp-view-tile .wrapper,warpview-tile .wrapper{opacity:1;min-height:50px;width:var(--warp-view-tile-width,100%);height:var(--warp-view-tile-height,100%)}:host .wrapper .status,warp-view-tile .wrapper .status,warpview-tile .wrapper .status{position:absolute;z-index:999;bottom:20px;background-color:rgba(255,255,255,.7);padding:1px 5px;font-size:11px;color:#000}:host .wrapper.full,warp-view-tile .wrapper.full,warpview-tile .wrapper.full{width:100%;height:100%;display:-webkit-box;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;flex-direction:column;justify-content:space-around}:host .wrapper .tilewrapper,warp-view-tile .wrapper .tilewrapper,warpview-tile .wrapper .tilewrapper{width:100%;height:100%}:host .wrapper .tilewrapper .tile,warp-view-tile .wrapper .tilewrapper .tile,warpview-tile .wrapper .tilewrapper .tile{width:100%;height:calc(var(--warp-view-tile-height,100%) - 40px);overflow-y:auto;overflow-x:hidden;position:relative}:host .wrapper .tilewrapper .notitle,warp-view-tile .wrapper .tilewrapper .notitle,warpview-tile .wrapper .tilewrapper .notitle{height:100%}:host .wrapper .tilewrapper h1,warp-view-tile .wrapper .tilewrapper h1,warpview-tile .wrapper .tilewrapper h1{font-size:20px;padding:5px;margin:0;color:var(--warp-view-font-color)}:host .wrapper .tilewrapper h1 small,warp-view-tile .wrapper .tilewrapper h1 small,warpview-tile .wrapper .tilewrapper h1 small{font-size:10px;margin-left:10px}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewTileComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: SizeService },
        { type: Renderer2 },
        { type: NgZone },
        { type: Warp10Service }
    ]; };
    WarpViewTileComponent.propDecorators = {
        warpRef: [{ type: ViewChild, args: ['warpRef', { static: true },] }],
        warpscriptResult: [{ type: Output, args: ['warpscriptResult',] }],
        execStatus: [{ type: Output, args: ['execStatus',] }],
        execError: [{ type: Output, args: ['execError',] }],
        type: [{ type: Input, args: ['type',] }],
        chartTitle: [{ type: Input, args: ['chartTitle',] }],
        url: [{ type: Input, args: ['url',] }],
        isAlone: [{ type: Input, args: ['isAlone',] }],
        gtsFilter: [{ type: Input, args: ['gtsFilter',] }],
        warpscript: [{ type: Input }],
        handleKeyDown: [{ type: HostListener, args: ['document:keyup', ['$event'],] }]
    };
    return WarpViewTileComponent;
}(WarpViewComponent));
export { WarpViewTileComponent };
if (false) {
    /** @type {?} */
    WarpViewTileComponent.prototype.warpRef;
    /** @type {?} */
    WarpViewTileComponent.prototype.warpscriptResult;
    /** @type {?} */
    WarpViewTileComponent.prototype.execStatus;
    /** @type {?} */
    WarpViewTileComponent.prototype.execError;
    /** @type {?} */
    WarpViewTileComponent.prototype.type;
    /** @type {?} */
    WarpViewTileComponent.prototype.chartTitle;
    /** @type {?} */
    WarpViewTileComponent.prototype.url;
    /** @type {?} */
    WarpViewTileComponent.prototype.isAlone;
    /** @type {?} */
    WarpViewTileComponent.prototype.loaderMessage;
    /** @type {?} */
    WarpViewTileComponent.prototype.error;
    /** @type {?} */
    WarpViewTileComponent.prototype.status;
    /** @type {?} */
    WarpViewTileComponent.prototype.loading;
    /** @type {?} */
    WarpViewTileComponent.prototype.execResult;
    /**
     * @type {?}
     * @private
     */
    WarpViewTileComponent.prototype.timer;
    /**
     * @type {?}
     * @private
     */
    WarpViewTileComponent.prototype._autoRefresh;
    /**
     * @type {?}
     * @private
     */
    WarpViewTileComponent.prototype._gtsFilter;
    /**
     * @type {?}
     * @private
     */
    WarpViewTileComponent.prototype._warpScript;
    /**
     * @type {?}
     * @private
     */
    WarpViewTileComponent.prototype.execUrl;
    /**
     * @type {?}
     * @private
     */
    WarpViewTileComponent.prototype.timeUnit;
    /** @type {?} */
    WarpViewTileComponent.prototype.el;
    /** @type {?} */
    WarpViewTileComponent.prototype.sizeService;
    /** @type {?} */
    WarpViewTileComponent.prototype.renderer;
    /** @type {?} */
    WarpViewTileComponent.prototype.ngZone;
    /**
     * @type {?}
     * @private
     */
    WarpViewTileComponent.prototype.warp10Service;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LXRpbGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHNlbngvd2FycHZpZXcvIiwic291cmNlcyI6WyJzcmMvbGliL2VsZW1lbnRzL3dhcnAtdmlldy10aWxlL3dhcnAtdmlldy10aWxlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUVMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFlBQVksRUFDWixLQUFLLEVBQ0wsTUFBTSxFQUVOLE1BQU0sRUFDTixTQUFTLEVBQ1QsU0FBUyxFQUNWLE1BQU0sZUFBZSxDQUFDO0FBR3ZCLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUMzQyxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSwyQ0FBMkMsQ0FBQztBQUMzRSxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN6RCxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sK0JBQStCLENBQUM7QUFDMUQsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBQzVELE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUcxQztJQU8yQyxpREFBaUI7SUF1QzFELCtCQUNTLEVBQWMsRUFDZCxXQUF3QixFQUN4QixRQUFtQixFQUNuQixNQUFjLEVBQ2IsYUFBNEI7UUFMdEMsWUFPRSxrQkFBTSxFQUFFLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxNQUFNLENBQUMsU0FFekM7UUFSUSxRQUFFLEdBQUYsRUFBRSxDQUFZO1FBQ2QsaUJBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIsY0FBUSxHQUFSLFFBQVEsQ0FBVztRQUNuQixZQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2IsbUJBQWEsR0FBYixhQUFhLENBQWU7UUExQ1Ysc0JBQWdCLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztR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TUFBTSxTQUFDLFlBQVk7NEJBQ25CLE1BQU0sU0FBQyxXQUFXO3VCQUVsQixLQUFLLFNBQUMsTUFBTTs2QkFDWixLQUFLLFNBQUMsWUFBWTtzQkFDbEIsS0FBSyxTQUFDLEtBQUs7MEJBQ1gsS0FBSyxTQUFDLFNBQVM7NEJBQ2YsS0FBSyxTQUFDLFdBQVc7NkJBSWpCLEtBQUs7Z0NBc0RMLFlBQVksU0FBQyxnQkFBZ0IsRUFBRSxDQUFDLFFBQVEsQ0FBQzs7SUFpSDVDLDRCQUFDO0NBQUEsQUE1TEQsQ0FPMkMsaUJBQWlCLEdBcUwzRDtTQXJMWSxxQkFBcUI7OztJQUNoQyx3Q0FBMEQ7O0lBQzFELGlEQUF1RTs7SUFDdkUsMkNBQTJEOztJQUMzRCwwQ0FBeUQ7O0lBRXpELHFDQUE2Qjs7SUFDN0IsMkNBQWdDOztJQUNoQyxvQ0FBdUI7O0lBQ3ZCLHdDQUFrQzs7SUFpQmxDLDhDQUFtQjs7SUFDbkIsc0NBQVc7O0lBQ1gsdUNBQWU7O0lBQ2Ysd0NBQWdCOztJQUNoQiwyQ0FBbUI7Ozs7O0lBRW5CLHNDQUFtQjs7Ozs7SUFDbkIsNkNBQXFCOzs7OztJQUNyQiwyQ0FBd0I7Ozs7O0lBQ3hCLDRDQUF5Qjs7Ozs7SUFDekIsd0NBQXFCOzs7OztJQUNyQix5Q0FBd0I7O0lBR3RCLG1DQUFxQjs7SUFDckIsNENBQStCOztJQUMvQix5Q0FBMEI7O0lBQzFCLHVDQUFxQjs7Ozs7SUFDckIsOENBQW9DIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqICBDb3B5cmlnaHQgMjAyMCAgU2VuWCBTLkEuUy5cbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqL1xuXG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSG9zdExpc3RlbmVyLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgUmVuZGVyZXIyLFxuICBWaWV3Q2hpbGRcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1BhcmFtfSBmcm9tICcuLi8uLi9tb2RlbC9wYXJhbSc7XG5pbXBvcnQge0RhdGFNb2RlbH0gZnJvbSAnLi4vLi4vbW9kZWwvZGF0YU1vZGVsJztcbmltcG9ydCB7R1RTTGlifSBmcm9tICcuLi8uLi91dGlscy9ndHMubGliJztcbmltcG9ydCB7SHR0cEVycm9ySGFuZGxlcn0gZnJvbSAnLi4vLi4vc2VydmljZXMvaHR0cC1lcnJvci1oYW5kbGVyLnNlcnZpY2UnO1xuaW1wb3J0IHtXYXJwVmlld0NvbXBvbmVudH0gZnJvbSAnLi4vd2FycC12aWV3LWNvbXBvbmVudCc7XG5pbXBvcnQge1NpemVTZXJ2aWNlfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9yZXNpemUuc2VydmljZSc7XG5pbXBvcnQge1dhcnAxMFNlcnZpY2V9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3dhcnAxMC5zZXJ2aWNlJztcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICcuLi8uLi91dGlscy9sb2dnZXInO1xuaW1wb3J0IHtIdHRwUmVzcG9uc2V9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnd2FycHZpZXctdGlsZScsXG4gIHRlbXBsYXRlVXJsOiAnLi93YXJwLXZpZXctdGlsZS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3dhcnAtdmlldy10aWxlLmNvbXBvbmVudC5zY3NzJ10sXG4gIHByb3ZpZGVyczogW0h0dHBFcnJvckhhbmRsZXJdLFxuICAvLyBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXG59KVxuZXhwb3J0IGNsYXNzIFdhcnBWaWV3VGlsZUNvbXBvbmVudCBleHRlbmRzIFdhcnBWaWV3Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0IHtcbiAgQFZpZXdDaGlsZCgnd2FycFJlZicsIHtzdGF0aWM6IHRydWV9KSB3YXJwUmVmOiBFbGVtZW50UmVmO1xuICBAT3V0cHV0KCd3YXJwc2NyaXB0UmVzdWx0Jykgd2FycHNjcmlwdFJlc3VsdCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCdleGVjU3RhdHVzJykgZXhlY1N0YXR1cyA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCdleGVjRXJyb3InKSBleGVjRXJyb3IgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBASW5wdXQoJ3R5cGUnKSB0eXBlID0gJ2xpbmUnO1xuICBASW5wdXQoJ2NoYXJ0VGl0bGUnKSBjaGFydFRpdGxlO1xuICBASW5wdXQoJ3VybCcpIHVybCA9ICcnO1xuICBASW5wdXQoJ2lzQWxvbmUnKSBpc0Fsb25lID0gZmFsc2U7IC8vIHVzZWQgYnkgcGxvdCB0byBtYW5hZ2UgaXRzIGtleWJvYXJkIGV2ZW50c1xuICBASW5wdXQoJ2d0c0ZpbHRlcicpIHNldCBndHNGaWx0ZXIoZ3RzRmlsdGVyOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9ndHNGaWx0ZXIgPSBndHNGaWx0ZXI7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgd2FycHNjcmlwdCh3YXJwU2NyaXB0OiBzdHJpbmcpIHtcbiAgICBpZiAoISF3YXJwU2NyaXB0ICYmIHRoaXMuX3dhcnBTY3JpcHQgIT09IHdhcnBTY3JpcHQpIHtcbiAgICAgIHRoaXMuX3dhcnBTY3JpcHQgPSB3YXJwU2NyaXB0O1xuICAgICAgdGhpcy5leGVjdXRlKHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIGdldCB3YXJwc2NyaXB0KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3dhcnBTY3JpcHQ7XG4gIH1cblxuICBsb2FkZXJNZXNzYWdlID0gJyc7XG4gIGVycm9yOiBhbnk7XG4gIHN0YXR1czogc3RyaW5nO1xuICBsb2FkaW5nID0gZmFsc2U7XG4gIGV4ZWNSZXN1bHQ6IHN0cmluZztcblxuICBwcml2YXRlIHRpbWVyOiBhbnk7XG4gIHByaXZhdGUgX2F1dG9SZWZyZXNoO1xuICBwcml2YXRlIF9ndHNGaWx0ZXIgPSAnJztcbiAgcHJpdmF0ZSBfd2FycFNjcmlwdCA9ICcnO1xuICBwcml2YXRlIGV4ZWNVcmwgPSAnJztcbiAgcHJpdmF0ZSB0aW1lVW5pdCA9ICd1cyc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGVsOiBFbGVtZW50UmVmLFxuICAgIHB1YmxpYyBzaXplU2VydmljZTogU2l6ZVNlcnZpY2UsXG4gICAgcHVibGljIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHVibGljIG5nWm9uZTogTmdab25lLFxuICAgIHByaXZhdGUgd2FycDEwU2VydmljZTogV2FycDEwU2VydmljZSxcbiAgKSB7XG4gICAgc3VwZXIoZWwsIHJlbmRlcmVyLCBzaXplU2VydmljZSwgbmdab25lKTtcbiAgICB0aGlzLkxPRyA9IG5ldyBMb2dnZXIoV2FycFZpZXdUaWxlQ29tcG9uZW50LCB0aGlzLl9kZWJ1Zyk7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLl9vcHRpb25zID0gdGhpcy5fb3B0aW9ucyB8fCB0aGlzLmRlZk9wdGlvbnM7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5fd2FycFNjcmlwdCA9IHRoaXMuX3dhcnBTY3JpcHQgfHwgdGhpcy53YXJwUmVmLm5hdGl2ZUVsZW1lbnQudGV4dENvbnRlbnQudHJpbSgpO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnbmdBZnRlclZpZXdJbml0JywgJ3dhcnBTY3JpcHQnXSwgdGhpcy5fd2FycFNjcmlwdCk7XG4gICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAnMSc7XG4gICAgaWYgKHRoaXMud2FycFJlZi5uYXRpdmVFbGVtZW50LnRleHRDb250ZW50LnRyaW0oKSAhPT0gJycpIHtcbiAgICAgIHRoaXMuZXhlY3V0ZShmYWxzZSk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlKG9wdGlvbnM6IFBhcmFtKTogdm9pZCB7XG4gICAgdGhpcy5MT0cuZGVidWcoWyd1cGRhdGUnLCAnb3B0aW9ucyddLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qIExpc3RlbmVycyAqL1xuICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDprZXl1cCcsIFsnJGV2ZW50J10pXG4gIC8vIEBIb3N0TGlzdGVuZXIoJ2tleWRvd24nLCBbJyRldmVudCddKVxuICBoYW5kbGVLZXlEb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LmtleSA9PT0gJ3InKSB7XG4gICAgICB0aGlzLmV4ZWN1dGUoZmFsc2UpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBkZXRlY3Qgc29tZSBWU0NvZGUgc3BlY2lhbCBtb2RpZmllcnMgaW4gdGhlIGJlZ2lubmlnIG9mIHRoZSBjb2RlOlxuICAgKiBAZW5kcG9pbnQgeHh4VVJMeHh4XG4gICAqIEB0aW1lVW5pdCBuc1xuICAgKiB3YXJuaW5nIDogdGhlIGZpcnN0IGxpbmUgaXMgZW1wdHkgKHRvIGNvbmZpcm0gd2l0aCBvdGhlciBicm93c2VycylcbiAgICovXG4gIHByaXZhdGUgZGV0ZWN0V2FycFNjcmlwdFNwZWNpYWxDb21tZW50cygpIHtcbiAgICAvLyBhbmFseXNlIHRoZSBmaXJzdCB3YXJwU2NyaXB0IGxpbmVzIHN0YXJ0aW5nIHdpdGggLy9cbiAgICBjb25zdCBleHRyYVBhcmFtc1BhdHRlcm4gPSAvXFxzKlxcL1xcL1xccypAKFxcdyopXFxzKiguKikkL2c7XG4gICAgY29uc3Qgd2FycHNjcmlwdExpbmVzID0gdGhpcy5fd2FycFNjcmlwdC5zcGxpdCgnXFxuJyk7XG4gICAgZm9yIChsZXQgbCA9IDE7IGwgPCB3YXJwc2NyaXB0TGluZXMubGVuZ3RoOyBsKyspIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRMaW5lID0gd2FycHNjcmlwdExpbmVzW2xdO1xuICAgICAgaWYgKGN1cnJlbnRMaW5lID09PSAnJyB8fCBjdXJyZW50TGluZS5zZWFyY2goJy8vJykgPj0gMCkge1xuICAgICAgICAvLyBmaW5kIGFuZCBleHRyYWN0IC8vIEBwYXJhbW5hbWUgcGFyYW1ldGVyc1xuICAgICAgICBsZXQgbGluZU9uTWF0Y2g6IFJlZ0V4cE1hdGNoQXJyYXkgfCBudWxsO1xuICAgICAgICBjb25zdCByZSA9IFJlZ0V4cChleHRyYVBhcmFtc1BhdHRlcm4pO1xuICAgICAgICAvLyBub2luc3BlY3Rpb24gSlNBc3NpZ25tZW50VXNlZEFzQ29uZGl0aW9uXG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1jb25kaXRpb25hbC1hc3NpZ25tZW50IEpTQXNzaWdubWVudFVzZWRBc0NvbmRpdGlvblxuICAgICAgICAvLyBub2luc3BlY3Rpb24gSlNBc3NpZ25tZW50VXNlZEFzQ29uZGl0aW9uXG4gICAgICAgIHdoaWxlIChsaW5lT25NYXRjaCA9IHJlLmV4ZWMoY3VycmVudExpbmUpKSB7XG4gICAgICAgICAgY29uc3QgcGFyYW1ldGVyTmFtZSA9IGxpbmVPbk1hdGNoWzFdO1xuICAgICAgICAgIGNvbnN0IHBhcmFtZXRlclZhbHVlID0gbGluZU9uTWF0Y2hbMl07XG4gICAgICAgICAgc3dpdGNoIChwYXJhbWV0ZXJOYW1lKSB7XG4gICAgICAgICAgICBjYXNlICdlbmRwb2ludCc6ICAgICAgICAvLyAgICAgICAgLy8gQGVuZHBvaW50IGh0dHA6Ly9teXdhcnAxMHNlcnZlci9hcGkvdjAvZXhlY1xuICAgICAgICAgICAgICB0aGlzLmV4ZWNVcmwgPSBwYXJhbWV0ZXJWYWx1ZTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICd0aW1lVW5pdCc6XG4gICAgICAgICAgICAgIHRoaXMudGltZVVuaXQgPSBwYXJhbWV0ZXJWYWx1ZS50b0xvd2VyQ2FzZSgpOyAgIC8vIHNldCB0aGUgdGltZSB1bml0IGZvciBncmFwaHNcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJyZWFrOyAvLyBubyBtb3JlIGNvbW1lbnRzIGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIGZpbGVcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGV4ZWN1dGUoaXNSZWZyZXNoOiBib29sZWFuKSB7XG4gICAgaWYgKCEhdGhpcy5fd2FycFNjcmlwdCAmJiB0aGlzLl93YXJwU2NyaXB0LnRyaW0oKSAhPT0gJycpIHtcbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsnZXhlY3V0ZSddLCBpc1JlZnJlc2gpO1xuICAgICAgdGhpcy5lcnJvciA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMubG9hZGluZyA9ICFpc1JlZnJlc2g7XG4gICAgICB0aGlzLmV4ZWNSZXN1bHQgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLmxvYWRlck1lc3NhZ2UgPSAnUmVxdWVzdGluZyBkYXRhJztcbiAgICAgIHRoaXMuZXhlY1VybCA9IHRoaXMudXJsO1xuICAgICAgLy8gIHRoaXMuZXhlY1Jlc3VsdCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuZGV0ZWN0V2FycFNjcmlwdFNwZWNpYWxDb21tZW50cygpO1xuICAgICAgdGhpcy5MT0cuZGVidWcoWydleGVjdXRlJywgJ3dhcnBTY3JpcHQnXSwgdGhpcy5fd2FycFNjcmlwdCk7XG4gICAgICB0aGlzLndhcnAxMFNlcnZpY2UuZXhlYyh0aGlzLl93YXJwU2NyaXB0LCB0aGlzLmV4ZWNVcmwpLnN1YnNjcmliZSgocmVzcG9uc2U6IEh0dHBSZXNwb25zZTxzdHJpbmc+IHwgc3RyaW5nKSA9PiB7XG4gICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2V4ZWN1dGUnXSwgcmVzcG9uc2UpO1xuICAgICAgICBpZiAoKHJlc3BvbnNlIGFzIEh0dHBSZXNwb25zZTxzdHJpbmc+KS5ib2R5KSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGJvZHkgPSAocmVzcG9uc2UgYXMgSHR0cFJlc3BvbnNlPHN0cmluZz4pLmJvZHk7XG4gICAgICAgICAgICB0aGlzLndhcnBzY3JpcHRSZXN1bHQuZW1pdChib2R5KTtcbiAgICAgICAgICAgIGNvbnN0IGhlYWRlcnMgPSAocmVzcG9uc2UgYXMgSHR0cFJlc3BvbnNlPHN0cmluZz4pLmhlYWRlcnM7XG4gICAgICAgICAgICB0aGlzLnN0YXR1cyA9IGBZb3VyIHNjcmlwdCBleGVjdXRpb24gdG9va1xuICR7R1RTTGliLmZvcm1hdEVsYXBzZWRUaW1lKHBhcnNlSW50KGhlYWRlcnMuZ2V0KCd4LXdhcnAxMC1lbGFwc2VkJyksIDEwKSl9XG4gc2VydmVyc2lkZSwgZmV0Y2hlZFxuICR7aGVhZGVycy5nZXQoJ3gtd2FycDEwLWZldGNoZWQnKX0gZGF0YXBvaW50cyBhbmQgcGVyZm9ybWVkXG4gJHtoZWFkZXJzLmdldCgneC13YXJwMTAtb3BzJyl9ICBXYXJwU2NyaXB0IG9wZXJhdGlvbnMuYDtcbiAgICAgICAgICAgIHRoaXMuZXhlY1N0YXR1cy5lbWl0KHtcbiAgICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5zdGF0dXMsXG4gICAgICAgICAgICAgIG9wczogcGFyc2VJbnQoaGVhZGVycy5nZXQoJ3gtd2FycDEwLW9wcycpLCAxMCksXG4gICAgICAgICAgICAgIGVsYXBzZWQ6IHBhcnNlSW50KGhlYWRlcnMuZ2V0KCd4LXdhcnAxMC1lbGFwc2VkJyksIDEwKSxcbiAgICAgICAgICAgICAgZmV0Y2hlZDogcGFyc2VJbnQoaGVhZGVycy5nZXQoJ3gtd2FycDEwLWZldGNoZWQnKSwgMTApLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAodGhpcy5fYXV0b1JlZnJlc2ggIT09IHRoaXMuX29wdGlvbnMuYXV0b1JlZnJlc2gpIHtcbiAgICAgICAgICAgICAgdGhpcy5fYXV0b1JlZnJlc2ggPSB0aGlzLl9vcHRpb25zLmF1dG9SZWZyZXNoO1xuICAgICAgICAgICAgICBpZiAodGhpcy50aW1lcikge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKHRoaXMudGltZXIpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmICh0aGlzLl9hdXRvUmVmcmVzaCAmJiB0aGlzLl9hdXRvUmVmcmVzaCA+IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVyID0gd2luZG93LnNldEludGVydmFsKCgpID0+IHRoaXMuZXhlY3V0ZSh0cnVlKSwgdGhpcy5fYXV0b1JlZnJlc2ggKiAxMDAwKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuZXhlY1Jlc3VsdCA9IGJvZHk7XG4gICAgICAgICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhpcy5MT0cuZXJyb3IoWydleGVjdXRlJ10sIGUpO1xuICAgICAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuTE9HLmVycm9yKFsnZXhlY3V0ZSddLCByZXNwb25zZSk7XG4gICAgICAgICAgdGhpcy5lcnJvciA9IHJlc3BvbnNlO1xuICAgICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMuZXhlY0Vycm9yLmVtaXQocmVzcG9uc2UpO1xuICAgICAgICB9XG4gICAgICB9LCBlID0+IHtcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZXhlY0Vycm9yLmVtaXQoZSk7XG4gICAgICAgIHRoaXMuTE9HLmVycm9yKFsnZXhlY3V0ZSddLCBlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBjb252ZXJ0KGRhdGE6IERhdGFNb2RlbCk6IGFueVtdIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgY2hhcnREcmF3bihldmVudCkge1xuICAgIHRoaXMuY2hhcnREcmF3LmVtaXQoZXZlbnQpO1xuICB9XG59XG4iXX0=