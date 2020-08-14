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
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import moment from 'moment';
import { Logger } from '../../utils/logger';
import * as noUiSlider from 'nouislider';
/**
 *
 */
var WarpViewSliderComponent = /** @class */ (function () {
    function WarpViewSliderComponent() {
        this.mode = 'timestamp';
        this.change = new EventEmitter();
        this.show = false;
        this._step = 0;
        this.loaded = false;
        this.manualRefresh = new EventEmitter();
        this._debug = false;
        this.LOG = new Logger(WarpViewSliderComponent, this.debug);
        this.LOG.debug(['constructor'], this.debug);
    }
    Object.defineProperty(WarpViewSliderComponent.prototype, "min", {
        get: /**
         * @return {?}
         */
        function () {
            return this._min;
        },
        set: /**
         * @param {?} m
         * @return {?}
         */
        function (m) {
            this.LOG.debug(['min'], m);
            this._min = m;
            this.setOptions();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarpViewSliderComponent.prototype, "max", {
        get: /**
         * @return {?}
         */
        function () {
            return this._max;
        },
        set: /**
         * @param {?} m
         * @return {?}
         */
        function (m) {
            this.LOG.debug(['max'], m);
            this._max = m;
            this.setOptions();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarpViewSliderComponent.prototype, "step", {
        get: /**
         * @return {?}
         */
        function () {
            return this._step;
        },
        set: /**
         * @param {?} step
         * @return {?}
         */
        function (step) {
            this.LOG.debug(['step'], step);
            if (this._step !== step) {
                this._step = step;
                this.setOptions();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarpViewSliderComponent.prototype, "debug", {
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
    WarpViewSliderComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        this.loaded = false;
        this.setOptions();
    };
    /**
     * @protected
     * @return {?}
     */
    WarpViewSliderComponent.prototype.setOptions = /**
     * @protected
     * @return {?}
     */
    function () {
        var _this = this;
        if (!this._min && !this._max) {
            return;
        }
        this.LOG.debug(['_step'], this._step);
        /** @type {?} */
        var tmpVAl = Math.min(Math.max(this.value || Number.MIN_VALUE, this._min), this._max);
        if (tmpVAl !== this.value && this.loaded) {
            this.change.emit(tmpVAl);
        }
        this.value = tmpVAl;
        this.loaded = true;
        this.LOG.debug(['noUiSlider'], this.slider);
        if (this.slider) {
            if (!this._uiSlider) {
                /** @type {?} */
                var opts = (/** @type {?} */ ({
                    start: [this.value + 1],
                    tooltips: [this.getFormat()],
                    range: { min: [this._min], max: [this._max] }
                }));
                if (!!this._step && this._step > 0) {
                    opts.step = Math.floor((this._max - this._min) / this._step);
                }
                this._uiSlider = noUiSlider.create(this.slider.nativeElement, opts);
                this._uiSlider.on('end', (/**
                 * @param {?} event
                 * @return {?}
                 */
                function (event) {
                    _this.LOG.debug(['onChange'], event);
                    _this.value = parseInt(event[0], 10);
                    _this.change.emit({ value: parseInt(event[0], 10) });
                }));
            }
            else {
                this.updateSliderOptions();
            }
        }
    };
    /**
     * @protected
     * @return {?}
     */
    WarpViewSliderComponent.prototype.updateSliderOptions = /**
     * @protected
     * @return {?}
     */
    function () {
        // tslint:disable-next-line:no-string-literal
        this.slider.nativeElement['noUiSlider'].set([this.value]);
        /** @type {?} */
        var opts = (/** @type {?} */ ({ range: { min: [this._min], max: [this._max] } }));
        if (!!this._step && this._step > 0) {
            opts.step = Math.floor((this._max - this._min) / this._step);
        }
        // tslint:disable-next-line:no-string-literal
        this.slider.nativeElement['noUiSlider'].updateOptions(opts);
    };
    /**
     * @param {?} value
     * @return {?}
     */
    WarpViewSliderComponent.prototype.format = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        if (this.mode !== 'timestamp') {
            return moment(value).utc(true).format('YYYY/MM/DD hh:mm:ss');
        }
        else {
            return value.toString();
        }
    };
    /**
     * @protected
     * @return {?}
     */
    WarpViewSliderComponent.prototype.getFormat = /**
     * @protected
     * @return {?}
     */
    function () {
        var _this = this;
        return {
            to: (/**
             * @param {?} value
             * @return {?}
             */
            function (value) { return _this.format(value); }),
            from: (/**
             * @param {?} value
             * @return {?}
             */
            function (value) { return value.replace(',-', ''); })
        };
    };
    WarpViewSliderComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-slider',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"custom-slider\" *ngIf=\"loaded\">\n  <div style=\"display: flex; width: 100%;justify-content: flex-start;\">\n    <div>{{format(_min)}}</div>\n    <div #slider style=\"flex-grow: 4\"></div>\n    <div>{{format(_max)}}</div>\n  </div>\n</div>\n",
                    encapsulation: ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.noUi-origin{left:100%}.noUi-target{max-width:100%;margin:0 20px 40px}.noUi-connect{left:0;background:var(--warp-slider-connect-color)}.noUi-handle{background:var(--warp-slider-handle-bg-color);border:1px solid var(--warp-slider-handle-color);border-radius:3px;cursor:pointer;box-shadow:var(--warp-slider-handle-shadow)}.noUi-handle:after,.noUi-handle:before{background:var(--warp-slider-handle-color)}.noUi-tooltip{display:none}.noUi-active .noUi-tooltip{display:block}:host .custom-slider{margin-top:50px}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewSliderComponent.ctorParameters = function () { return []; };
    WarpViewSliderComponent.propDecorators = {
        slider: [{ type: ViewChild, args: ['slider', { static: false },] }],
        min: [{ type: Input, args: ['min',] }],
        max: [{ type: Input, args: ['max',] }],
        value: [{ type: Input, args: ['value',] }],
        step: [{ type: Input, args: ['step',] }],
        mode: [{ type: Input, args: ['mode',] }],
        debug: [{ type: Input, args: ['debug',] }],
        change: [{ type: Output, args: ['change',] }]
    };
    return WarpViewSliderComponent;
}());
export { WarpViewSliderComponent };
if (false) {
    /** @type {?} */
    WarpViewSliderComponent.prototype.slider;
    /** @type {?} */
    WarpViewSliderComponent.prototype.value;
    /** @type {?} */
    WarpViewSliderComponent.prototype.mode;
    /** @type {?} */
    WarpViewSliderComponent.prototype.change;
    /** @type {?} */
    WarpViewSliderComponent.prototype._min;
    /** @type {?} */
    WarpViewSliderComponent.prototype._max;
    /** @type {?} */
    WarpViewSliderComponent.prototype.show;
    /**
     * @type {?}
     * @protected
     */
    WarpViewSliderComponent.prototype._uiSlider;
    /**
     * @type {?}
     * @protected
     */
    WarpViewSliderComponent.prototype._step;
    /**
     * @type {?}
     * @protected
     */
    WarpViewSliderComponent.prototype.LOG;
    /** @type {?} */
    WarpViewSliderComponent.prototype.loaded;
    /**
     * @type {?}
     * @protected
     */
    WarpViewSliderComponent.prototype.manualRefresh;
    /**
     * @type {?}
     * @protected
     */
    WarpViewSliderComponent.prototype._debug;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LXNsaWRlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VueC93YXJwdmlldy8iLCJzb3VyY2VzIjpbInNyYy9saWIvZWxlbWVudHMvd2FycC12aWV3LXNsaWRlci93YXJwLXZpZXctc2xpZGVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWdCQSxPQUFPLEVBQWdCLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzlILE9BQU8sTUFBTSxNQUFNLFFBQVEsQ0FBQztBQUM1QixPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDMUMsT0FBTyxLQUFLLFVBQVUsTUFBTSxZQUFZLENBQUM7Ozs7QUFLekM7SUFtRUU7UUF2QmUsU0FBSSxHQUFHLFdBQVcsQ0FBQztRQVdoQixXQUFNLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUk5QyxTQUFJLEdBQUcsS0FBSyxDQUFDO1FBRUgsVUFBSyxHQUFHLENBQUMsQ0FBQztRQUVwQixXQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ0wsa0JBQWEsR0FBdUIsSUFBSSxZQUFZLEVBQVEsQ0FBQztRQUM3RCxXQUFNLEdBQUcsS0FBSyxDQUFDO1FBR3ZCLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxNQUFNLENBQUMsdUJBQXVCLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNELElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUE3REQsc0JBQWtCLHdDQUFHOzs7O1FBTXJCO1lBQ0UsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ25CLENBQUM7Ozs7O1FBUkQsVUFBc0IsQ0FBQztZQUNyQixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzNCLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1lBQ2QsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ3BCLENBQUM7OztPQUFBO0lBTUQsc0JBQWtCLHdDQUFHOzs7O1FBTXJCO1lBQ0UsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ25CLENBQUM7Ozs7O1FBUkQsVUFBc0IsQ0FBQztZQUNyQixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzNCLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1lBQ2QsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ3BCLENBQUM7OztPQUFBO0lBU0Qsc0JBQW1CLHlDQUFJOzs7O1FBUXZCO1lBQ0UsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3BCLENBQUM7Ozs7O1FBVkQsVUFBd0IsSUFBWTtZQUNsQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQy9CLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLEVBQUU7Z0JBQ3ZCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO2dCQUNsQixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7YUFDbkI7UUFDSCxDQUFDOzs7T0FBQTtJQVFELHNCQUFvQiwwQ0FBSzs7OztRQUt6QjtZQUNFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUNyQixDQUFDOzs7OztRQVBELFVBQTBCLEtBQWM7WUFDdEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7WUFDcEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0IsQ0FBQzs7O09BQUE7Ozs7SUF1QkQsaURBQWU7OztJQUFmO1FBQ0UsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDcEIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3BCLENBQUM7Ozs7O0lBRVMsNENBQVU7Ozs7SUFBcEI7UUFBQSxpQkFnQ0M7UUEvQkMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQzVCLE9BQU87U0FDUjtRQUNELElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDOztZQUNoQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksTUFBTSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQztRQUN2RixJQUFJLE1BQU0sS0FBSyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDeEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDMUI7UUFDRCxJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztRQUNwQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztRQUNuQixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLFlBQVksQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM1QyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDZixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTs7b0JBQ2IsSUFBSSxHQUFHLG1CQUFBO29CQUNYLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO29CQUN2QixRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7b0JBQzVCLEtBQUssRUFBRSxFQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUM7aUJBQzVDLEVBQU87Z0JBQ1IsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRTtvQkFDbEMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUM5RDtnQkFDRCxJQUFJLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3BFLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLEtBQUs7Ozs7Z0JBQUUsVUFBQSxLQUFLO29CQUM1QixLQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUNwQyxLQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBQ3BDLEtBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDO2dCQUNwRCxDQUFDLEVBQUMsQ0FBQzthQUNKO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO2FBQzVCO1NBQ0Y7SUFDSCxDQUFDOzs7OztJQUVTLHFEQUFtQjs7OztJQUE3QjtRQUNFLDZDQUE2QztRQUM3QyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs7WUFDcEQsSUFBSSxHQUFHLG1CQUFBLEVBQUMsS0FBSyxFQUFFLEVBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBQyxFQUFDLEVBQU87UUFDakUsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRTtZQUNsQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDOUQ7UUFDRCw2Q0FBNkM7UUFDN0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlELENBQUM7Ozs7O0lBRUQsd0NBQU07Ozs7SUFBTixVQUFPLEtBQWE7UUFDbEIsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLFdBQVcsRUFBRTtZQUM3QixPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUM7U0FDOUQ7YUFBTTtZQUNMLE9BQU8sS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ3pCO0lBQ0gsQ0FBQzs7Ozs7SUFFUywyQ0FBUzs7OztJQUFuQjtRQUFBLGlCQUtDO1FBSkMsT0FBTztZQUNMLEVBQUU7Ozs7WUFBRSxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQWxCLENBQWtCLENBQUE7WUFDL0IsSUFBSTs7OztZQUFFLFVBQUEsS0FBSyxJQUFJLE9BQUEsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQXZCLENBQXVCLENBQUE7U0FDdkMsQ0FBQztJQUNKLENBQUM7O2dCQXZJRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLGlCQUFpQjtvQkFDM0IsazVCQUFnRDtvQkFFaEQsYUFBYSxFQUFFLGlCQUFpQixDQUFDLFNBQVM7O2lCQUMzQzs7Ozs7eUJBRUUsU0FBUyxTQUFDLFFBQVEsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7c0JBRXJDLEtBQUssU0FBQyxLQUFLO3NCQVVYLEtBQUssU0FBQyxLQUFLO3dCQVdYLEtBQUssU0FBQyxPQUFPO3VCQUViLEtBQUssU0FBQyxNQUFNO3VCQVlaLEtBQUssU0FBQyxNQUFNO3dCQUVaLEtBQUssU0FBQyxPQUFPO3lCQVNiLE1BQU0sU0FBQyxRQUFROztJQWlGbEIsOEJBQUM7Q0FBQSxBQXhJRCxJQXdJQztTQWxJWSx1QkFBdUI7OztJQUNsQyx5Q0FBMkU7O0lBdUIzRSx3Q0FBOEI7O0lBYzlCLHVDQUFrQzs7SUFXbEMseUNBQThDOztJQUU5Qyx1Q0FBYTs7SUFDYix1Q0FBYTs7SUFDYix1Q0FBYTs7Ozs7SUFDYiw0Q0FBb0I7Ozs7O0lBQ3BCLHdDQUFvQjs7Ozs7SUFDcEIsc0NBQXNCOztJQUN0Qix5Q0FBZTs7Ozs7SUFDZixnREFBdUU7Ozs7O0lBQ3ZFLHlDQUF5QiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQ29weXJpZ2h0IDIwMjAgIFNlblggUy5BLlMuXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKi9cbmltcG9ydCB7QWZ0ZXJWaWV3SW5pdCwgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIElucHV0LCBPdXRwdXQsIFZpZXdDaGlsZCwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuaW1wb3J0IHtMb2dnZXJ9IGZyb20gJy4uLy4uL3V0aWxzL2xvZ2dlcic7XG5pbXBvcnQgKiBhcyBub1VpU2xpZGVyIGZyb20gJ25vdWlzbGlkZXInO1xuXG4vKipcbiAqXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3dhcnB2aWV3LXNsaWRlcicsXG4gIHRlbXBsYXRlVXJsOiAnLi93YXJwLXZpZXctc2xpZGVyLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vd2FycC12aWV3LXNsaWRlci5jb21wb25lbnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5TaGFkb3dEb21cbn0pXG5leHBvcnQgY2xhc3MgV2FycFZpZXdTbGlkZXJDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcbiAgQFZpZXdDaGlsZCgnc2xpZGVyJywgeyBzdGF0aWM6IGZhbHNlIH0pIHNsaWRlcjogRWxlbWVudFJlZjxIVE1MRGl2RWxlbWVudD47XG5cbiAgQElucHV0KCdtaW4nKSBzZXQgbWluKG0pIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ21pbiddLCBtKTtcbiAgICB0aGlzLl9taW4gPSBtO1xuICAgIHRoaXMuc2V0T3B0aW9ucygpO1xuICB9XG5cbiAgZ2V0IG1pbigpIHtcbiAgICByZXR1cm4gdGhpcy5fbWluO1xuICB9XG5cbiAgQElucHV0KCdtYXgnKSBzZXQgbWF4KG0pIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ21heCddLCBtKTtcbiAgICB0aGlzLl9tYXggPSBtO1xuICAgIHRoaXMuc2V0T3B0aW9ucygpO1xuICB9XG5cbiAgZ2V0IG1heCgpIHtcbiAgICByZXR1cm4gdGhpcy5fbWF4O1xuICB9XG5cblxuICBASW5wdXQoJ3ZhbHVlJykgdmFsdWU6IG51bWJlcjtcblxuICBASW5wdXQoJ3N0ZXAnKSBzZXQgc3RlcChzdGVwOiBudW1iZXIpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3N0ZXAnXSwgc3RlcCk7XG4gICAgaWYgKHRoaXMuX3N0ZXAgIT09IHN0ZXApIHtcbiAgICAgIHRoaXMuX3N0ZXAgPSBzdGVwO1xuICAgICAgdGhpcy5zZXRPcHRpb25zKCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHN0ZXAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0ZXA7XG4gIH1cblxuICBASW5wdXQoJ21vZGUnKSBtb2RlID0gJ3RpbWVzdGFtcCc7XG5cbiAgQElucHV0KCdkZWJ1ZycpIHNldCBkZWJ1ZyhkZWJ1ZzogYm9vbGVhbikge1xuICAgIHRoaXMuX2RlYnVnID0gZGVidWc7XG4gICAgdGhpcy5MT0cuc2V0RGVidWcoZGVidWcpO1xuICB9XG5cbiAgZ2V0IGRlYnVnKCkge1xuICAgIHJldHVybiB0aGlzLl9kZWJ1ZztcbiAgfVxuXG4gIEBPdXRwdXQoJ2NoYW5nZScpIGNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBfbWluOiBudW1iZXI7XG4gIF9tYXg6IG51bWJlcjtcbiAgc2hvdyA9IGZhbHNlO1xuICBwcm90ZWN0ZWQgX3VpU2xpZGVyO1xuICBwcm90ZWN0ZWQgX3N0ZXAgPSAwO1xuICBwcm90ZWN0ZWQgTE9HOiBMb2dnZXI7XG4gIGxvYWRlZCA9IGZhbHNlO1xuICBwcm90ZWN0ZWQgbWFudWFsUmVmcmVzaDogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuICBwcm90ZWN0ZWQgX2RlYnVnID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5MT0cgPSBuZXcgTG9nZ2VyKFdhcnBWaWV3U2xpZGVyQ29tcG9uZW50LCB0aGlzLmRlYnVnKTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2NvbnN0cnVjdG9yJ10sIHRoaXMuZGVidWcpO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHRoaXMubG9hZGVkID0gZmFsc2U7XG4gICAgdGhpcy5zZXRPcHRpb25zKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgc2V0T3B0aW9ucygpIHtcbiAgICBpZiAoIXRoaXMuX21pbiAmJiAhdGhpcy5fbWF4KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuTE9HLmRlYnVnKFsnX3N0ZXAnXSwgdGhpcy5fc3RlcCk7XG4gICAgY29uc3QgdG1wVkFsID0gTWF0aC5taW4oTWF0aC5tYXgodGhpcy52YWx1ZSB8fCBOdW1iZXIuTUlOX1ZBTFVFLCB0aGlzLl9taW4pLCB0aGlzLl9tYXgpO1xuICAgIGlmICh0bXBWQWwgIT09IHRoaXMudmFsdWUgJiYgdGhpcy5sb2FkZWQpIHtcbiAgICAgIHRoaXMuY2hhbmdlLmVtaXQodG1wVkFsKTtcbiAgICB9XG4gICAgdGhpcy52YWx1ZSA9IHRtcFZBbDtcbiAgICB0aGlzLmxvYWRlZCA9IHRydWU7XG4gICAgdGhpcy5MT0cuZGVidWcoWydub1VpU2xpZGVyJ10sIHRoaXMuc2xpZGVyKTtcbiAgICBpZiAodGhpcy5zbGlkZXIpIHtcbiAgICAgIGlmICghdGhpcy5fdWlTbGlkZXIpIHtcbiAgICAgICAgY29uc3Qgb3B0cyA9IHtcbiAgICAgICAgICBzdGFydDogW3RoaXMudmFsdWUgKyAxXSxcbiAgICAgICAgICB0b29sdGlwczogW3RoaXMuZ2V0Rm9ybWF0KCldLFxuICAgICAgICAgIHJhbmdlOiB7bWluOiBbdGhpcy5fbWluXSwgbWF4OiBbdGhpcy5fbWF4XX1cbiAgICAgICAgfSBhcyBhbnk7XG4gICAgICAgIGlmICghIXRoaXMuX3N0ZXAgJiYgdGhpcy5fc3RlcCA+IDApIHtcbiAgICAgICAgICBvcHRzLnN0ZXAgPSBNYXRoLmZsb29yKCh0aGlzLl9tYXggLSB0aGlzLl9taW4pIC8gdGhpcy5fc3RlcCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdWlTbGlkZXIgPSBub1VpU2xpZGVyLmNyZWF0ZSh0aGlzLnNsaWRlci5uYXRpdmVFbGVtZW50LCBvcHRzKTtcbiAgICAgICAgdGhpcy5fdWlTbGlkZXIub24oJ2VuZCcsIGV2ZW50ID0+IHtcbiAgICAgICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ29uQ2hhbmdlJ10sIGV2ZW50KTtcbiAgICAgICAgICB0aGlzLnZhbHVlID0gcGFyc2VJbnQoZXZlbnRbMF0sIDEwKTtcbiAgICAgICAgICB0aGlzLmNoYW5nZS5lbWl0KHt2YWx1ZTogcGFyc2VJbnQoZXZlbnRbMF0sIDEwKX0pO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudXBkYXRlU2xpZGVyT3B0aW9ucygpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCB1cGRhdGVTbGlkZXJPcHRpb25zKCkge1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1zdHJpbmctbGl0ZXJhbFxuICAgIHRoaXMuc2xpZGVyLm5hdGl2ZUVsZW1lbnRbJ25vVWlTbGlkZXInXS5zZXQoW3RoaXMudmFsdWVdKTtcbiAgICBjb25zdCBvcHRzID0ge3JhbmdlOiB7bWluOiBbdGhpcy5fbWluXSwgbWF4OiBbdGhpcy5fbWF4XX19IGFzIGFueTtcbiAgICBpZiAoISF0aGlzLl9zdGVwICYmIHRoaXMuX3N0ZXAgPiAwKSB7XG4gICAgICBvcHRzLnN0ZXAgPSBNYXRoLmZsb29yKCh0aGlzLl9tYXggLSB0aGlzLl9taW4pIC8gdGhpcy5fc3RlcCk7XG4gICAgfVxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1zdHJpbmctbGl0ZXJhbFxuICAgIHRoaXMuc2xpZGVyLm5hdGl2ZUVsZW1lbnRbJ25vVWlTbGlkZXInXS51cGRhdGVPcHRpb25zKG9wdHMpO1xuICB9XG5cbiAgZm9ybWF0KHZhbHVlOiBudW1iZXIpIHtcbiAgICBpZiAodGhpcy5tb2RlICE9PSAndGltZXN0YW1wJykge1xuICAgICAgcmV0dXJuIG1vbWVudCh2YWx1ZSkudXRjKHRydWUpLmZvcm1hdCgnWVlZWS9NTS9ERCBoaDptbTpzcycpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdmFsdWUudG9TdHJpbmcoKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0Rm9ybWF0KCkge1xuICAgIHJldHVybiB7XG4gICAgICB0bzogdmFsdWUgPT4gdGhpcy5mb3JtYXQodmFsdWUpLFxuICAgICAgZnJvbTogdmFsdWUgPT4gdmFsdWUucmVwbGFjZSgnLC0nLCAnJylcbiAgICB9O1xuICB9XG59XG4iXX0=