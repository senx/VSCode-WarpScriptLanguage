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
export class WarpViewSliderComponent {
    constructor() {
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
    /**
     * @param {?} m
     * @return {?}
     */
    set min(m) {
        this.LOG.debug(['min'], m);
        this._min = m;
        this.setOptions();
    }
    /**
     * @return {?}
     */
    get min() {
        return this._min;
    }
    /**
     * @param {?} m
     * @return {?}
     */
    set max(m) {
        this.LOG.debug(['max'], m);
        this._max = m;
        this.setOptions();
    }
    /**
     * @return {?}
     */
    get max() {
        return this._max;
    }
    /**
     * @param {?} step
     * @return {?}
     */
    set step(step) {
        this.LOG.debug(['step'], step);
        if (this._step !== step) {
            this._step = step;
            this.setOptions();
        }
    }
    /**
     * @return {?}
     */
    get step() {
        return this._step;
    }
    /**
     * @param {?} debug
     * @return {?}
     */
    set debug(debug) {
        this._debug = debug;
        this.LOG.setDebug(debug);
    }
    /**
     * @return {?}
     */
    get debug() {
        return this._debug;
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.loaded = false;
        this.setOptions();
    }
    /**
     * @protected
     * @return {?}
     */
    setOptions() {
        if (!this._min && !this._max) {
            return;
        }
        this.LOG.debug(['_step'], this._step);
        /** @type {?} */
        const tmpVAl = Math.min(Math.max(this.value || Number.MIN_VALUE, this._min), this._max);
        if (tmpVAl !== this.value && this.loaded) {
            this.change.emit(tmpVAl);
        }
        this.value = tmpVAl;
        this.loaded = true;
        this.LOG.debug(['noUiSlider'], this.slider);
        if (this.slider) {
            if (!this._uiSlider) {
                /** @type {?} */
                const opts = (/** @type {?} */ ({
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
                event => {
                    this.LOG.debug(['onChange'], event);
                    this.value = parseInt(event[0], 10);
                    this.change.emit({ value: parseInt(event[0], 10) });
                }));
            }
            else {
                this.updateSliderOptions();
            }
        }
    }
    /**
     * @protected
     * @return {?}
     */
    updateSliderOptions() {
        // tslint:disable-next-line:no-string-literal
        this.slider.nativeElement['noUiSlider'].set([this.value]);
        /** @type {?} */
        const opts = (/** @type {?} */ ({ range: { min: [this._min], max: [this._max] } }));
        if (!!this._step && this._step > 0) {
            opts.step = Math.floor((this._max - this._min) / this._step);
        }
        // tslint:disable-next-line:no-string-literal
        this.slider.nativeElement['noUiSlider'].updateOptions(opts);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    format(value) {
        if (this.mode !== 'timestamp') {
            return moment(value).utc(true).format('YYYY/MM/DD hh:mm:ss');
        }
        else {
            return value.toString();
        }
    }
    /**
     * @protected
     * @return {?}
     */
    getFormat() {
        return {
            to: (/**
             * @param {?} value
             * @return {?}
             */
            value => this.format(value)),
            from: (/**
             * @param {?} value
             * @return {?}
             */
            value => value.replace(',-', ''))
        };
    }
}
WarpViewSliderComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-slider',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"custom-slider\" *ngIf=\"loaded\">\n  <div style=\"display: flex; width: 100%;justify-content: flex-start;\">\n    <div>{{format(_min)}}</div>\n    <div #slider style=\"flex-grow: 4\"></div>\n    <div>{{format(_max)}}</div>\n  </div>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.noUi-origin{left:100%}.noUi-target{max-width:100%;margin:0 20px 40px}.noUi-connect{left:0;background:var(--warp-slider-connect-color)}.noUi-handle{background:var(--warp-slider-handle-bg-color);border:1px solid var(--warp-slider-handle-color);border-radius:3px;cursor:pointer;box-shadow:var(--warp-slider-handle-shadow)}.noUi-handle:after,.noUi-handle:before{background:var(--warp-slider-handle-color)}.noUi-tooltip{display:none}.noUi-active .noUi-tooltip{display:block}:host .custom-slider{margin-top:50px}"]
            }] }
];
/** @nocollapse */
WarpViewSliderComponent.ctorParameters = () => [];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LXNsaWRlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VueC93YXJwdmlldy8iLCJzb3VyY2VzIjpbInNyYy9saWIvZWxlbWVudHMvd2FycC12aWV3LXNsaWRlci93YXJwLXZpZXctc2xpZGVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWdCQSxPQUFPLEVBQWdCLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzlILE9BQU8sTUFBTSxNQUFNLFFBQVEsQ0FBQztBQUM1QixPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDMUMsT0FBTyxLQUFLLFVBQVUsTUFBTSxZQUFZLENBQUM7Ozs7QUFXekMsTUFBTSxPQUFPLHVCQUF1QjtJQTZEbEM7UUF2QmUsU0FBSSxHQUFHLFdBQVcsQ0FBQztRQVdoQixXQUFNLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUk5QyxTQUFJLEdBQUcsS0FBSyxDQUFDO1FBRUgsVUFBSyxHQUFHLENBQUMsQ0FBQztRQUVwQixXQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ0wsa0JBQWEsR0FBdUIsSUFBSSxZQUFZLEVBQVEsQ0FBQztRQUM3RCxXQUFNLEdBQUcsS0FBSyxDQUFDO1FBR3ZCLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxNQUFNLENBQUMsdUJBQXVCLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNELElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzlDLENBQUM7Ozs7O0lBN0RELElBQWtCLEdBQUcsQ0FBQyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMs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aUJBQWlCLENBQUMsU0FBUzs7YUFDM0M7Ozs7O3FCQUVFLFNBQVMsU0FBQyxRQUFRLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO2tCQUVyQyxLQUFLLFNBQUMsS0FBSztrQkFVWCxLQUFLLFNBQUMsS0FBSztvQkFXWCxLQUFLLFNBQUMsT0FBTzttQkFFYixLQUFLLFNBQUMsTUFBTTttQkFZWixLQUFLLFNBQUMsTUFBTTtvQkFFWixLQUFLLFNBQUMsT0FBTztxQkFTYixNQUFNLFNBQUMsUUFBUTs7OztJQWhEaEIseUNBQTJFOztJQXVCM0Usd0NBQThCOztJQWM5Qix1Q0FBa0M7O0lBV2xDLHlDQUE4Qzs7SUFFOUMsdUNBQWE7O0lBQ2IsdUNBQWE7O0lBQ2IsdUNBQWE7Ozs7O0lBQ2IsNENBQW9COzs7OztJQUNwQix3Q0FBb0I7Ozs7O0lBQ3BCLHNDQUFzQjs7SUFDdEIseUNBQWU7Ozs7O0lBQ2YsZ0RBQXVFOzs7OztJQUN2RSx5Q0FBeUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogIENvcHlyaWdodCAyMDIwICBTZW5YIFMuQS5TLlxuICpcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICovXG5pbXBvcnQge0FmdGVyVmlld0luaXQsIENvbXBvbmVudCwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT3V0cHV0LCBWaWV3Q2hpbGQsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICcuLi8uLi91dGlscy9sb2dnZXInO1xuaW1wb3J0ICogYXMgbm9VaVNsaWRlciBmcm9tICdub3Vpc2xpZGVyJztcblxuLyoqXG4gKlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICd3YXJwdmlldy1zbGlkZXInLFxuICB0ZW1wbGF0ZVVybDogJy4vd2FycC12aWV3LXNsaWRlci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3dhcnAtdmlldy1zbGlkZXIuY29tcG9uZW50LnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uU2hhZG93RG9tXG59KVxuZXhwb3J0IGNsYXNzIFdhcnBWaWV3U2xpZGVyQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCB7XG4gIEBWaWV3Q2hpbGQoJ3NsaWRlcicsIHsgc3RhdGljOiBmYWxzZSB9KSBzbGlkZXI6IEVsZW1lbnRSZWY8SFRNTERpdkVsZW1lbnQ+O1xuXG4gIEBJbnB1dCgnbWluJykgc2V0IG1pbihtKSB7XG4gICAgdGhpcy5MT0cuZGVidWcoWydtaW4nXSwgbSk7XG4gICAgdGhpcy5fbWluID0gbTtcbiAgICB0aGlzLnNldE9wdGlvbnMoKTtcbiAgfVxuXG4gIGdldCBtaW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuX21pbjtcbiAgfVxuXG4gIEBJbnB1dCgnbWF4Jykgc2V0IG1heChtKSB7XG4gICAgdGhpcy5MT0cuZGVidWcoWydtYXgnXSwgbSk7XG4gICAgdGhpcy5fbWF4ID0gbTtcbiAgICB0aGlzLnNldE9wdGlvbnMoKTtcbiAgfVxuXG4gIGdldCBtYXgoKSB7XG4gICAgcmV0dXJuIHRoaXMuX21heDtcbiAgfVxuXG5cbiAgQElucHV0KCd2YWx1ZScpIHZhbHVlOiBudW1iZXI7XG5cbiAgQElucHV0KCdzdGVwJykgc2V0IHN0ZXAoc3RlcDogbnVtYmVyKSB7XG4gICAgdGhpcy5MT0cuZGVidWcoWydzdGVwJ10sIHN0ZXApO1xuICAgIGlmICh0aGlzLl9zdGVwICE9PSBzdGVwKSB7XG4gICAgICB0aGlzLl9zdGVwID0gc3RlcDtcbiAgICAgIHRoaXMuc2V0T3B0aW9ucygpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBzdGVwKCkge1xuICAgIHJldHVybiB0aGlzLl9zdGVwO1xuICB9XG5cbiAgQElucHV0KCdtb2RlJykgbW9kZSA9ICd0aW1lc3RhbXAnO1xuXG4gIEBJbnB1dCgnZGVidWcnKSBzZXQgZGVidWcoZGVidWc6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9kZWJ1ZyA9IGRlYnVnO1xuICAgIHRoaXMuTE9HLnNldERlYnVnKGRlYnVnKTtcbiAgfVxuXG4gIGdldCBkZWJ1ZygpIHtcbiAgICByZXR1cm4gdGhpcy5fZGVidWc7XG4gIH1cblxuICBAT3V0cHV0KCdjaGFuZ2UnKSBjaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgX21pbjogbnVtYmVyO1xuICBfbWF4OiBudW1iZXI7XG4gIHNob3cgPSBmYWxzZTtcbiAgcHJvdGVjdGVkIF91aVNsaWRlcjtcbiAgcHJvdGVjdGVkIF9zdGVwID0gMDtcbiAgcHJvdGVjdGVkIExPRzogTG9nZ2VyO1xuICBsb2FkZWQgPSBmYWxzZTtcbiAgcHJvdGVjdGVkIG1hbnVhbFJlZnJlc2g6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcbiAgcHJvdGVjdGVkIF9kZWJ1ZyA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuTE9HID0gbmV3IExvZ2dlcihXYXJwVmlld1NsaWRlckNvbXBvbmVudCwgdGhpcy5kZWJ1Zyk7XG4gICAgdGhpcy5MT0cuZGVidWcoWydjb25zdHJ1Y3RvciddLCB0aGlzLmRlYnVnKTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmxvYWRlZCA9IGZhbHNlO1xuICAgIHRoaXMuc2V0T3B0aW9ucygpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHNldE9wdGlvbnMoKSB7XG4gICAgaWYgKCF0aGlzLl9taW4gJiYgIXRoaXMuX21heCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ19zdGVwJ10sIHRoaXMuX3N0ZXApO1xuICAgIGNvbnN0IHRtcFZBbCA9IE1hdGgubWluKE1hdGgubWF4KHRoaXMudmFsdWUgfHwgTnVtYmVyLk1JTl9WQUxVRSwgdGhpcy5fbWluKSwgdGhpcy5fbWF4KTtcbiAgICBpZiAodG1wVkFsICE9PSB0aGlzLnZhbHVlICYmIHRoaXMubG9hZGVkKSB7XG4gICAgICB0aGlzLmNoYW5nZS5lbWl0KHRtcFZBbCk7XG4gICAgfVxuICAgIHRoaXMudmFsdWUgPSB0bXBWQWw7XG4gICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnbm9VaVNsaWRlciddLCB0aGlzLnNsaWRlcik7XG4gICAgaWYgKHRoaXMuc2xpZGVyKSB7XG4gICAgICBpZiAoIXRoaXMuX3VpU2xpZGVyKSB7XG4gICAgICAgIGNvbnN0IG9wdHMgPSB7XG4gICAgICAgICAgc3RhcnQ6IFt0aGlzLnZhbHVlICsgMV0sXG4gICAgICAgICAgdG9vbHRpcHM6IFt0aGlzLmdldEZvcm1hdCgpXSxcbiAgICAgICAgICByYW5nZToge21pbjogW3RoaXMuX21pbl0sIG1heDogW3RoaXMuX21heF19XG4gICAgICAgIH0gYXMgYW55O1xuICAgICAgICBpZiAoISF0aGlzLl9zdGVwICYmIHRoaXMuX3N0ZXAgPiAwKSB7XG4gICAgICAgICAgb3B0cy5zdGVwID0gTWF0aC5mbG9vcigodGhpcy5fbWF4IC0gdGhpcy5fbWluKSAvIHRoaXMuX3N0ZXApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3VpU2xpZGVyID0gbm9VaVNsaWRlci5jcmVhdGUodGhpcy5zbGlkZXIubmF0aXZlRWxlbWVudCwgb3B0cyk7XG4gICAgICAgIHRoaXMuX3VpU2xpZGVyLm9uKCdlbmQnLCBldmVudCA9PiB7XG4gICAgICAgICAgdGhpcy5MT0cuZGVidWcoWydvbkNoYW5nZSddLCBldmVudCk7XG4gICAgICAgICAgdGhpcy52YWx1ZSA9IHBhcnNlSW50KGV2ZW50WzBdLCAxMCk7XG4gICAgICAgICAgdGhpcy5jaGFuZ2UuZW1pdCh7dmFsdWU6IHBhcnNlSW50KGV2ZW50WzBdLCAxMCl9KTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnVwZGF0ZVNsaWRlck9wdGlvbnMoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgdXBkYXRlU2xpZGVyT3B0aW9ucygpIHtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tc3RyaW5nLWxpdGVyYWxcbiAgICB0aGlzLnNsaWRlci5uYXRpdmVFbGVtZW50Wydub1VpU2xpZGVyJ10uc2V0KFt0aGlzLnZhbHVlXSk7XG4gICAgY29uc3Qgb3B0cyA9IHtyYW5nZToge21pbjogW3RoaXMuX21pbl0sIG1heDogW3RoaXMuX21heF19fSBhcyBhbnk7XG4gICAgaWYgKCEhdGhpcy5fc3RlcCAmJiB0aGlzLl9zdGVwID4gMCkge1xuICAgICAgb3B0cy5zdGVwID0gTWF0aC5mbG9vcigodGhpcy5fbWF4IC0gdGhpcy5fbWluKSAvIHRoaXMuX3N0ZXApO1xuICAgIH1cbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tc3RyaW5nLWxpdGVyYWxcbiAgICB0aGlzLnNsaWRlci5uYXRpdmVFbGVtZW50Wydub1VpU2xpZGVyJ10udXBkYXRlT3B0aW9ucyhvcHRzKTtcbiAgfVxuXG4gIGZvcm1hdCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgaWYgKHRoaXMubW9kZSAhPT0gJ3RpbWVzdGFtcCcpIHtcbiAgICAgIHJldHVybiBtb21lbnQodmFsdWUpLnV0Yyh0cnVlKS5mb3JtYXQoJ1lZWVkvTU0vREQgaGg6bW06c3MnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHZhbHVlLnRvU3RyaW5nKCk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIGdldEZvcm1hdCgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdG86IHZhbHVlID0+IHRoaXMuZm9ybWF0KHZhbHVlKSxcbiAgICAgIGZyb206IHZhbHVlID0+IHZhbHVlLnJlcGxhY2UoJywtJywgJycpXG4gICAgfTtcbiAgfVxufVxuIl19