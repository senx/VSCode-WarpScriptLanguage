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
import { Component, ElementRef, EventEmitter, HostListener, Input, NgZone, Output, Renderer2, ViewChild } from '@angular/core';
import { GTSLib } from '../../utils/gts.lib';
import { HttpErrorHandler } from '../../services/http-error-handler.service';
import { WarpViewComponent } from '../warp-view-component';
import { SizeService } from '../../services/resize.service';
import { Warp10Service } from '../../services/warp10.service';
import { Logger } from '../../utils/logger';
export class WarpViewTileComponent extends WarpViewComponent {
    /**
     * @param {?} el
     * @param {?} sizeService
     * @param {?} renderer
     * @param {?} ngZone
     * @param {?} warp10Service
     */
    constructor(el, sizeService, renderer, ngZone, warp10Service) {
        super(el, renderer, sizeService, ngZone);
        this.el = el;
        this.sizeService = sizeService;
        this.renderer = renderer;
        this.ngZone = ngZone;
        this.warp10Service = warp10Service;
        this.warpscriptResult = new EventEmitter();
        this.execStatus = new EventEmitter();
        this.execError = new EventEmitter();
        this.type = 'line';
        this.url = '';
        this.isAlone = false; // used by plot to manage its keyboard events
        this.loaderMessage = '';
        this.loading = false;
        this._gtsFilter = '';
        this._warpScript = '';
        this.execUrl = '';
        this.timeUnit = 'us';
        this.LOG = new Logger(WarpViewTileComponent, this._debug);
    }
    // used by plot to manage its keyboard events
    /**
     * @param {?} gtsFilter
     * @return {?}
     */
    set gtsFilter(gtsFilter) {
        this._gtsFilter = gtsFilter;
    }
    /**
     * @param {?} warpScript
     * @return {?}
     */
    set warpscript(warpScript) {
        if (!!warpScript && this._warpScript !== warpScript) {
            this._warpScript = warpScript;
            this.execute(true);
        }
    }
    /**
     * @return {?}
     */
    get warpscript() {
        return this._warpScript;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this._options = this._options || this.defOptions;
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this._warpScript = this._warpScript || this.warpRef.nativeElement.textContent.trim();
        this.LOG.debug(['ngAfterViewInit', 'warpScript'], this._warpScript);
        this.el.nativeElement.style.opacity = '1';
        if (this.warpRef.nativeElement.textContent.trim() !== '') {
            this.execute(false);
        }
    }
    /**
     * @param {?} options
     * @return {?}
     */
    update(options) {
        this.LOG.debug(['update', 'options'], options);
    }
    /* Listeners */
    /**
     * @param {?} event
     * @return {?}
     */
    // @HostListener('keydown', ['$event'])
    handleKeyDown(event) {
        if (event.key === 'r') {
            this.execute(false);
        }
    }
    /**
     * detect some VSCode special modifiers in the beginnig of the code:
     * \@endpoint xxxURLxxx
     * \@timeUnit ns
     * warning : the first line is empty (to confirm with other browsers)
     * @private
     * @return {?}
     */
    detectWarpScriptSpecialComments() {
        // analyse the first warpScript lines starting with //
        /** @type {?} */
        const extraParamsPattern = /\s*\/\/\s*@(\w*)\s*(.*)$/g;
        /** @type {?} */
        const warpscriptLines = this._warpScript.split('\n');
        for (let l = 1; l < warpscriptLines.length; l++) {
            /** @type {?} */
            const currentLine = warpscriptLines[l];
            if (currentLine === '' || currentLine.search('//') >= 0) {
                // find and extract // @paramname parameters
                /** @type {?} */
                let lineOnMatch;
                /** @type {?} */
                const re = RegExp(extraParamsPattern);
                // noinspection JSAssignmentUsedAsCondition
                // tslint:disable-next-line:no-conditional-assignment JSAssignmentUsedAsCondition
                // noinspection JSAssignmentUsedAsCondition
                while (lineOnMatch = re.exec(currentLine)) {
                    /** @type {?} */
                    const parameterName = lineOnMatch[1];
                    /** @type {?} */
                    const parameterValue = lineOnMatch[2];
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
    }
    /**
     * @private
     * @param {?} isRefresh
     * @return {?}
     */
    execute(isRefresh) {
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
            (response) => {
                this.loading = false;
                this.LOG.debug(['execute'], response);
                if (((/** @type {?} */ (response))).body) {
                    try {
                        /** @type {?} */
                        const body = ((/** @type {?} */ (response))).body;
                        this.warpscriptResult.emit(body);
                        /** @type {?} */
                        const headers = ((/** @type {?} */ (response))).headers;
                        this.status = `Your script execution took
 ${GTSLib.formatElapsedTime(parseInt(headers.get('x-warp10-elapsed'), 10))}
 serverside, fetched
 ${headers.get('x-warp10-fetched')} datapoints and performed
 ${headers.get('x-warp10-ops')}  WarpScript operations.`;
                        this.execStatus.emit({
                            message: this.status,
                            ops: parseInt(headers.get('x-warp10-ops'), 10),
                            elapsed: parseInt(headers.get('x-warp10-elapsed'), 10),
                            fetched: parseInt(headers.get('x-warp10-fetched'), 10),
                        });
                        if (this._autoRefresh !== this._options.autoRefresh) {
                            this._autoRefresh = this._options.autoRefresh;
                            if (this.timer) {
                                window.clearInterval(this.timer);
                            }
                            if (this._autoRefresh && this._autoRefresh > 0) {
                                this.timer = window.setInterval((/**
                                 * @return {?}
                                 */
                                () => this.execute(true)), this._autoRefresh * 1000);
                            }
                        }
                        setTimeout((/**
                         * @return {?}
                         */
                        () => {
                            this.execResult = body;
                            this.loading = false;
                        }));
                    }
                    catch (e) {
                        this.LOG.error(['execute'], e);
                        this.loading = false;
                    }
                }
                else {
                    this.LOG.error(['execute'], response);
                    this.error = response;
                    this.loading = false;
                    this.execError.emit(response);
                }
            }), (/**
             * @param {?} e
             * @return {?}
             */
            e => {
                this.loading = false;
                this.execError.emit(e);
                this.LOG.error(['execute'], e);
            }));
        }
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
    chartDrawn(event) {
        this.chartDraw.emit(event);
    }
}
WarpViewTileComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-tile',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n<div class=\"wrapper\" [ngClass]=\"{'full':  responsive}\">\n  <div class=\"tilewrapper\">\n    <h1 *ngIf=\"chartTitle\">{{chartTitle}}</h1>\n    <div [ngClass]=\"{'tile': true,'notitle':  !chartTitle || chartTitle === ''}\">\n      <warpview-spinner *ngIf=\"loading\" message=\"Requesting data\"></warpview-spinner>\n      <div *ngIf=\"_options.showErrors && error\" style=\"height: calc(100% - 30px); width: 100%\">\n        <warpview-display [responsive]=\"true\" [debug]=\"debug\" [options]=\"_options\"\n                          [data]=\"{ data: error,  globalParams: {\n  timeMode:  'custom', bgColor: '#D32C2E', fontColor: '#ffffff'}}\"></warpview-display>\n      </div>\n      <div *ngIf=\"!error\" style=\"height: 100%; width: 100%\" [hidden]=\"loading\">\n        <warpview-result-tile [debug]=\"debug\" [type]=\"type\" [unit]=\"unit\" [options]=\"_options\"\n                              (chartDraw)=\"chartDrawn($event)\"\n                              [showLegend]=\"showLegend\" [data]=\"execResult\"></warpview-result-tile>\n      </div>\n    </div>\n  </div>\n  <small *ngIf=\"_options.showStatus\" class=\"status\">{{status}}</small>\n</div>\n\n<div #warpRef style=\"display: none\">\n  <ng-content></ng-content>\n</div>\n",
                providers: [HttpErrorHandler],
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host,warp-view-tile,warpview-tile{width:var(--warp-view-tile-width,100%);max-height:var(--warp-view-tile-height,100%);overflow:auto;min-width:var(--warp-view-tile-width,100%);min-height:var(--warp-view-tile-height,100%)}:host .error,warp-view-tile .error,warpview-tile .error{width:100%;text-align:center;color:#dc3545;font-weight:700}:host .wrapper,warp-view-tile .wrapper,warpview-tile .wrapper{opacity:1;min-height:50px;width:var(--warp-view-tile-width,100%);height:var(--warp-view-tile-height,100%)}:host .wrapper .status,warp-view-tile .wrapper .status,warpview-tile .wrapper .status{position:absolute;z-index:999;bottom:20px;background-color:rgba(255,255,255,.7);padding:1px 5px;font-size:11px;color:#000}:host .wrapper.full,warp-view-tile .wrapper.full,warpview-tile .wrapper.full{width:100%;height:100%;display:-webkit-box;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;flex-direction:column;justify-content:space-around}:host .wrapper .tilewrapper,warp-view-tile .wrapper .tilewrapper,warpview-tile .wrapper .tilewrapper{width:100%;height:100%}:host .wrapper .tilewrapper .tile,warp-view-tile .wrapper .tilewrapper .tile,warpview-tile .wrapper .tilewrapper .tile{width:100%;height:calc(var(--warp-view-tile-height,100%) - 40px);overflow-y:auto;overflow-x:hidden;position:relative}:host .wrapper .tilewrapper .notitle,warp-view-tile .wrapper .tilewrapper .notitle,warpview-tile .wrapper .tilewrapper .notitle{height:100%}:host .wrapper .tilewrapper h1,warp-view-tile .wrapper .tilewrapper h1,warpview-tile .wrapper .tilewrapper h1{font-size:20px;padding:5px;margin:0;color:var(--warp-view-font-color)}:host .wrapper .tilewrapper h1 small,warp-view-tile .wrapper .tilewrapper h1 small,warpview-tile .wrapper .tilewrapper h1 small{font-size:10px;margin-left:10px}"]
            }] }
];
/** @nocollapse */
WarpViewTileComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: SizeService },
    { type: Renderer2 },
    { type: NgZone },
    { type: Warp10Service }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LXRpbGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHNlbngvd2FycHZpZXcvIiwic291cmNlcyI6WyJzcmMvbGliL2VsZW1lbnRzL3dhcnAtdmlldy10aWxlL3dhcnAtdmlldy10aWxlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBRUwsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osWUFBWSxFQUNaLEtBQUssRUFDTCxNQUFNLEVBRU4sTUFBTSxFQUNOLFNBQVMsRUFDVCxTQUFTLEVBQ1YsTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQzNDLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLDJDQUEyQyxDQUFDO0FBQzNFLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3pELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSwrQkFBK0IsQ0FBQztBQUMxRCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sK0JBQStCLENBQUM7QUFDNUQsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBVTFDLE1BQU0sT0FBTyxxQkFBc0IsU0FBUSxpQkFBaUI7Ozs7Ozs7O0lBdUMxRCxZQUNTLEVBQWMsRUFDZCxXQUF3QixFQUN4QixRQUFtQixFQUNuQixNQUFjLEVBQ2IsYUFBNEI7UUFFcEMsS0FBSyxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBTmxDLE9BQUUsR0FBRixFQUFFLENBQVk7UUFDZCxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4QixhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ25CLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDYixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQTFDVixxQkFBZ0IsR0FBRyxJ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QyxTQUFTO3dCQUNmLEtBQUssU0FBQyxXQUFXO3lCQUlqQixLQUFLOzRCQXNETCxZQUFZLFNBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxRQUFRLENBQUM7Ozs7SUFuRTFDLHdDQUEwRDs7SUFDMUQsaURBQXVFOztJQUN2RSwyQ0FBMkQ7O0lBQzNELDBDQUF5RDs7SUFFekQscUNBQTZCOztJQUM3QiwyQ0FBZ0M7O0lBQ2hDLG9DQUF1Qjs7SUFDdkIsd0NBQWtDOztJQWlCbEMsOENBQW1COztJQUNuQixzQ0FBVzs7SUFDWCx1Q0FBZTs7SUFDZix3Q0FBZ0I7O0lBQ2hCLDJDQUFtQjs7Ozs7SUFFbkIsc0NBQW1COzs7OztJQUNuQiw2Q0FBcUI7Ozs7O0lBQ3JCLDJDQUF3Qjs7Ozs7SUFDeEIsNENBQXlCOzs7OztJQUN6Qix3Q0FBcUI7Ozs7O0lBQ3JCLHlDQUF3Qjs7SUFHdEIsbUNBQXFCOztJQUNyQiw0Q0FBK0I7O0lBQy9CLHlDQUEwQjs7SUFDMUIsdUNBQXFCOzs7OztJQUNyQiw4Q0FBb0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogIENvcHlyaWdodCAyMDIwICBTZW5YIFMuQS5TLlxuICpcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICovXG5cbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBIb3N0TGlzdGVuZXIsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBSZW5kZXJlcjIsXG4gIFZpZXdDaGlsZFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7UGFyYW19IGZyb20gJy4uLy4uL21vZGVsL3BhcmFtJztcbmltcG9ydCB7RGF0YU1vZGVsfSBmcm9tICcuLi8uLi9tb2RlbC9kYXRhTW9kZWwnO1xuaW1wb3J0IHtHVFNMaWJ9IGZyb20gJy4uLy4uL3V0aWxzL2d0cy5saWInO1xuaW1wb3J0IHtIdHRwRXJyb3JIYW5kbGVyfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9odHRwLWVycm9yLWhhbmRsZXIuc2VydmljZSc7XG5pbXBvcnQge1dhcnBWaWV3Q29tcG9uZW50fSBmcm9tICcuLi93YXJwLXZpZXctY29tcG9uZW50JztcbmltcG9ydCB7U2l6ZVNlcnZpY2V9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3Jlc2l6ZS5zZXJ2aWNlJztcbmltcG9ydCB7V2FycDEwU2VydmljZX0gZnJvbSAnLi4vLi4vc2VydmljZXMvd2FycDEwLnNlcnZpY2UnO1xuaW1wb3J0IHtMb2dnZXJ9IGZyb20gJy4uLy4uL3V0aWxzL2xvZ2dlcic7XG5pbXBvcnQge0h0dHBSZXNwb25zZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICd3YXJwdmlldy10aWxlJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3dhcnAtdmlldy10aWxlLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vd2FycC12aWV3LXRpbGUuY29tcG9uZW50LnNjc3MnXSxcbiAgcHJvdmlkZXJzOiBbSHR0cEVycm9ySGFuZGxlcl0sXG4gIC8vIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgV2FycFZpZXdUaWxlQ29tcG9uZW50IGV4dGVuZHMgV2FycFZpZXdDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQge1xuICBAVmlld0NoaWxkKCd3YXJwUmVmJywge3N0YXRpYzogdHJ1ZX0pIHdhcnBSZWY6IEVsZW1lbnRSZWY7XG4gIEBPdXRwdXQoJ3dhcnBzY3JpcHRSZXN1bHQnKSB3YXJwc2NyaXB0UmVzdWx0ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoJ2V4ZWNTdGF0dXMnKSBleGVjU3RhdHVzID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoJ2V4ZWNFcnJvcicpIGV4ZWNFcnJvciA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIEBJbnB1dCgndHlwZScpIHR5cGUgPSAnbGluZSc7XG4gIEBJbnB1dCgnY2hhcnRUaXRsZScpIGNoYXJ0VGl0bGU7XG4gIEBJbnB1dCgndXJsJykgdXJsID0gJyc7XG4gIEBJbnB1dCgnaXNBbG9uZScpIGlzQWxvbmUgPSBmYWxzZTsgLy8gdXNlZCBieSBwbG90IHRvIG1hbmFnZSBpdHMga2V5Ym9hcmQgZXZlbnRzXG4gIEBJbnB1dCgnZ3RzRmlsdGVyJykgc2V0IGd0c0ZpbHRlcihndHNGaWx0ZXI6IHN0cmluZykge1xuICAgIHRoaXMuX2d0c0ZpbHRlciA9IGd0c0ZpbHRlcjtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHNldCB3YXJwc2NyaXB0KHdhcnBTY3JpcHQ6IHN0cmluZykge1xuICAgIGlmICghIXdhcnBTY3JpcHQgJiYgdGhpcy5fd2FycFNjcmlwdCAhPT0gd2FycFNjcmlwdCkge1xuICAgICAgdGhpcy5fd2FycFNjcmlwdCA9IHdhcnBTY3JpcHQ7XG4gICAgICB0aGlzLmV4ZWN1dGUodHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHdhcnBzY3JpcHQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fd2FycFNjcmlwdDtcbiAgfVxuXG4gIGxvYWRlck1lc3NhZ2UgPSAnJztcbiAgZXJyb3I6IGFueTtcbiAgc3RhdHVzOiBzdHJpbmc7XG4gIGxvYWRpbmcgPSBmYWxzZTtcbiAgZXhlY1Jlc3VsdDogc3RyaW5nO1xuXG4gIHByaXZhdGUgdGltZXI6IGFueTtcbiAgcHJpdmF0ZSBfYXV0b1JlZnJlc2g7XG4gIHByaXZhdGUgX2d0c0ZpbHRlciA9ICcnO1xuICBwcml2YXRlIF93YXJwU2NyaXB0ID0gJyc7XG4gIHByaXZhdGUgZXhlY1VybCA9ICcnO1xuICBwcml2YXRlIHRpbWVVbml0ID0gJ3VzJztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgZWw6IEVsZW1lbnRSZWYsXG4gICAgcHVibGljIHNpemVTZXJ2aWNlOiBTaXplU2VydmljZSxcbiAgICBwdWJsaWMgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwdWJsaWMgbmdab25lOiBOZ1pvbmUsXG4gICAgcHJpdmF0ZSB3YXJwMTBTZXJ2aWNlOiBXYXJwMTBTZXJ2aWNlLFxuICApIHtcbiAgICBzdXBlcihlbCwgcmVuZGVyZXIsIHNpemVTZXJ2aWNlLCBuZ1pvbmUpO1xuICAgIHRoaXMuTE9HID0gbmV3IExvZ2dlcihXYXJwVmlld1RpbGVDb21wb25lbnQsIHRoaXMuX2RlYnVnKTtcbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuX29wdGlvbnMgPSB0aGlzLl9vcHRpb25zIHx8IHRoaXMuZGVmT3B0aW9ucztcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLl93YXJwU2NyaXB0ID0gdGhpcy5fd2FycFNjcmlwdCB8fCB0aGlzLndhcnBSZWYubmF0aXZlRWxlbWVudC50ZXh0Q29udGVudC50cmltKCk7XG4gICAgdGhpcy5MT0cuZGVidWcoWyduZ0FmdGVyVmlld0luaXQnLCAnd2FycFNjcmlwdCddLCB0aGlzLl93YXJwU2NyaXB0KTtcbiAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuc3R5bGUub3BhY2l0eSA9ICcxJztcbiAgICBpZiAodGhpcy53YXJwUmVmLm5hdGl2ZUVsZW1lbnQudGV4dENvbnRlbnQudHJpbSgpICE9PSAnJykge1xuICAgICAgdGhpcy5leGVjdXRlKGZhbHNlKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGUob3B0aW9uczogUGFyYW0pOiB2b2lkIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3VwZGF0ZScsICdvcHRpb25zJ10sIG9wdGlvbnMpO1xuICB9XG5cbiAgLyogTGlzdGVuZXJzICovXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50OmtleXVwJywgWyckZXZlbnQnXSlcbiAgLy8gQEhvc3RMaXN0ZW5lcigna2V5ZG93bicsIFsnJGV2ZW50J10pXG4gIGhhbmRsZUtleURvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBpZiAoZXZlbnQua2V5ID09PSAncicpIHtcbiAgICAgIHRoaXMuZXhlY3V0ZShmYWxzZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIGRldGVjdCBzb21lIFZTQ29kZSBzcGVjaWFsIG1vZGlmaWVycyBpbiB0aGUgYmVnaW5uaWcgb2YgdGhlIGNvZGU6XG4gICAqIEBlbmRwb2ludCB4eHhVUkx4eHhcbiAgICogQHRpbWVVbml0IG5zXG4gICAqIHdhcm5pbmcgOiB0aGUgZmlyc3QgbGluZSBpcyBlbXB0eSAodG8gY29uZmlybSB3aXRoIG90aGVyIGJyb3dzZXJzKVxuICAgKi9cbiAgcHJpdmF0ZSBkZXRlY3RXYXJwU2NyaXB0U3BlY2lhbENvbW1lbnRzKCkge1xuICAgIC8vIGFuYWx5c2UgdGhlIGZpcnN0IHdhcnBTY3JpcHQgbGluZXMgc3RhcnRpbmcgd2l0aCAvL1xuICAgIGNvbnN0IGV4dHJhUGFyYW1zUGF0dGVybiA9IC9cXHMqXFwvXFwvXFxzKkAoXFx3KilcXHMqKC4qKSQvZztcbiAgICBjb25zdCB3YXJwc2NyaXB0TGluZXMgPSB0aGlzLl93YXJwU2NyaXB0LnNwbGl0KCdcXG4nKTtcbiAgICBmb3IgKGxldCBsID0gMTsgbCA8IHdhcnBzY3JpcHRMaW5lcy5sZW5ndGg7IGwrKykge1xuICAgICAgY29uc3QgY3VycmVudExpbmUgPSB3YXJwc2NyaXB0TGluZXNbbF07XG4gICAgICBpZiAoY3VycmVudExpbmUgPT09ICcnIHx8IGN1cnJlbnRMaW5lLnNlYXJjaCgnLy8nKSA+PSAwKSB7XG4gICAgICAgIC8vIGZpbmQgYW5kIGV4dHJhY3QgLy8gQHBhcmFtbmFtZSBwYXJhbWV0ZXJzXG4gICAgICAgIGxldCBsaW5lT25NYXRjaDogUmVnRXhwTWF0Y2hBcnJheSB8IG51bGw7XG4gICAgICAgIGNvbnN0IHJlID0gUmVnRXhwKGV4dHJhUGFyYW1zUGF0dGVybik7XG4gICAgICAgIC8vIG5vaW5zcGVjdGlvbiBKU0Fzc2lnbm1lbnRVc2VkQXNDb25kaXRpb25cbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWNvbmRpdGlvbmFsLWFzc2lnbm1lbnQgSlNBc3NpZ25tZW50VXNlZEFzQ29uZGl0aW9uXG4gICAgICAgIC8vIG5vaW5zcGVjdGlvbiBKU0Fzc2lnbm1lbnRVc2VkQXNDb25kaXRpb25cbiAgICAgICAgd2hpbGUgKGxpbmVPbk1hdGNoID0gcmUuZXhlYyhjdXJyZW50TGluZSkpIHtcbiAgICAgICAgICBjb25zdCBwYXJhbWV0ZXJOYW1lID0gbGluZU9uTWF0Y2hbMV07XG4gICAgICAgICAgY29uc3QgcGFyYW1ldGVyVmFsdWUgPSBsaW5lT25NYXRjaFsyXTtcbiAgICAgICAgICBzd2l0Y2ggKHBhcmFtZXRlck5hbWUpIHtcbiAgICAgICAgICAgIGNhc2UgJ2VuZHBvaW50JzogICAgICAgIC8vICAgICAgICAvLyBAZW5kcG9pbnQgaHR0cDovL215d2FycDEwc2VydmVyL2FwaS92MC9leGVjXG4gICAgICAgICAgICAgIHRoaXMuZXhlY1VybCA9IHBhcmFtZXRlclZhbHVlO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3RpbWVVbml0JzpcbiAgICAgICAgICAgICAgdGhpcy50aW1lVW5pdCA9IHBhcmFtZXRlclZhbHVlLnRvTG93ZXJDYXNlKCk7ICAgLy8gc2V0IHRoZSB0aW1lIHVuaXQgZm9yIGdyYXBoc1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYnJlYWs7IC8vIG5vIG1vcmUgY29tbWVudHMgYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgZmlsZVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZXhlY3V0ZShpc1JlZnJlc2g6IGJvb2xlYW4pIHtcbiAgICBpZiAoISF0aGlzLl93YXJwU2NyaXB0ICYmIHRoaXMuX3dhcnBTY3JpcHQudHJpbSgpICE9PSAnJykge1xuICAgICAgdGhpcy5MT0cuZGVidWcoWydleGVjdXRlJ10sIGlzUmVmcmVzaCk7XG4gICAgICB0aGlzLmVycm9yID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5sb2FkaW5nID0gIWlzUmVmcmVzaDtcbiAgICAgIHRoaXMuZXhlY1Jlc3VsdCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMubG9hZGVyTWVzc2FnZSA9ICdSZXF1ZXN0aW5nIGRhdGEnO1xuICAgICAgdGhpcy5leGVjVXJsID0gdGhpcy51cmw7XG4gICAgICAvLyAgdGhpcy5leGVjUmVzdWx0ID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5kZXRlY3RXYXJwU2NyaXB0U3BlY2lhbENvbW1lbnRzKCk7XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2V4ZWN1dGUnLCAnd2FycFNjcmlwdCddLCB0aGlzLl93YXJwU2NyaXB0KTtcbiAgICAgIHRoaXMud2FycDEwU2VydmljZS5leGVjKHRoaXMuX3dhcnBTY3JpcHQsIHRoaXMuZXhlY1VybCkuc3Vic2NyaWJlKChyZXNwb25zZTogSHR0cFJlc3BvbnNlPHN0cmluZz4gfCBzdHJpbmcpID0+IHtcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuTE9HLmRlYnVnKFsnZXhlY3V0ZSddLCByZXNwb25zZSk7XG4gICAgICAgIGlmICgocmVzcG9uc2UgYXMgSHR0cFJlc3BvbnNlPHN0cmluZz4pLmJvZHkpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgYm9keSA9IChyZXNwb25zZSBhcyBIdHRwUmVzcG9uc2U8c3RyaW5nPikuYm9keTtcbiAgICAgICAgICAgIHRoaXMud2FycHNjcmlwdFJlc3VsdC5lbWl0KGJvZHkpO1xuICAgICAgICAgICAgY29uc3QgaGVhZGVycyA9IChyZXNwb25zZSBhcyBIdHRwUmVzcG9uc2U8c3RyaW5nPikuaGVhZGVycztcbiAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gYFlvdXIgc2NyaXB0IGV4ZWN1dGlvbiB0b29rXG4gJHtHVFNMaWIuZm9ybWF0RWxhcHNlZFRpbWUocGFyc2VJbnQoaGVhZGVycy5nZXQoJ3gtd2FycDEwLWVsYXBzZWQnKSwgMTApKX1cbiBzZXJ2ZXJzaWRlLCBmZXRjaGVkXG4gJHtoZWFkZXJzLmdldCgneC13YXJwMTAtZmV0Y2hlZCcpfSBkYXRhcG9pbnRzIGFuZCBwZXJmb3JtZWRcbiAke2hlYWRlcnMuZ2V0KCd4LXdhcnAxMC1vcHMnKX0gIFdhcnBTY3JpcHQgb3BlcmF0aW9ucy5gO1xuICAgICAgICAgICAgdGhpcy5leGVjU3RhdHVzLmVtaXQoe1xuICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLnN0YXR1cyxcbiAgICAgICAgICAgICAgb3BzOiBwYXJzZUludChoZWFkZXJzLmdldCgneC13YXJwMTAtb3BzJyksIDEwKSxcbiAgICAgICAgICAgICAgZWxhcHNlZDogcGFyc2VJbnQoaGVhZGVycy5nZXQoJ3gtd2FycDEwLWVsYXBzZWQnKSwgMTApLFxuICAgICAgICAgICAgICBmZXRjaGVkOiBwYXJzZUludChoZWFkZXJzLmdldCgneC13YXJwMTAtZmV0Y2hlZCcpLCAxMCksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmICh0aGlzLl9hdXRvUmVmcmVzaCAhPT0gdGhpcy5fb3B0aW9ucy5hdXRvUmVmcmVzaCkge1xuICAgICAgICAgICAgICB0aGlzLl9hdXRvUmVmcmVzaCA9IHRoaXMuX29wdGlvbnMuYXV0b1JlZnJlc2g7XG4gICAgICAgICAgICAgIGlmICh0aGlzLnRpbWVyKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy50aW1lcik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKHRoaXMuX2F1dG9SZWZyZXNoICYmIHRoaXMuX2F1dG9SZWZyZXNoID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMudGltZXIgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4gdGhpcy5leGVjdXRlKHRydWUpLCB0aGlzLl9hdXRvUmVmcmVzaCAqIDEwMDApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5leGVjUmVzdWx0ID0gYm9keTtcbiAgICAgICAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aGlzLkxPRy5lcnJvcihbJ2V4ZWN1dGUnXSwgZSk7XG4gICAgICAgICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5MT0cuZXJyb3IoWydleGVjdXRlJ10sIHJlc3BvbnNlKTtcbiAgICAgICAgICB0aGlzLmVycm9yID0gcmVzcG9uc2U7XG4gICAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5leGVjRXJyb3IuZW1pdChyZXNwb25zZSk7XG4gICAgICAgIH1cbiAgICAgIH0sIGUgPT4ge1xuICAgICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5leGVjRXJyb3IuZW1pdChlKTtcbiAgICAgICAgdGhpcy5MT0cuZXJyb3IoWydleGVjdXRlJ10sIGUpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIGNvbnZlcnQoZGF0YTogRGF0YU1vZGVsKTogYW55W10ge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICBjaGFydERyYXduKGV2ZW50KSB7XG4gICAgdGhpcy5jaGFydERyYXcuZW1pdChldmVudCk7XG4gIH1cbn1cbiJdfQ==