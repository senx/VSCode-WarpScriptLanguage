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
import { Component, ElementRef, Input, NgZone, Renderer2, ViewEncapsulation } from '@angular/core';
import { WarpViewComponent } from '../warp-view-component';
import { GTSLib } from '../../utils/gts.lib';
import { SizeService } from '../../services/resize.service';
import { Logger } from '../../utils/logger';
import moment from 'moment-timezone';
export class WarpViewDatagridComponent extends WarpViewComponent {
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
        this.elemsCount = 15;
        // tslint:disable-next-line:variable-name
        this._tabularData = [];
        this.LOG = new Logger(WarpViewDatagridComponent, this._debug);
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.drawChart();
    }
    /**
     * @param {?} options
     * @return {?}
     */
    update(options) {
        this.drawChart();
    }
    /**
     * @private
     * @return {?}
     */
    drawChart() {
        this.loading = false;
        this.chartDraw.emit();
        if (!this.initChart(this.el)) {
            return;
        }
    }
    /**
     * @private
     * @param {?} i
     * @param {?} j
     * @param {?} key
     * @param {?} def
     * @return {?}
     */
    getHeaderParam(i, j, key, def) {
        return this._data.params && this._data.params[i] && this._data.params[i][key] && this._data.params[i][key][j]
            ? this._data.params[i][key][j]
            : this._data.globalParams && this._data.globalParams[key] && this._data.globalParams[key][j]
                ? this._data.globalParams[key][j]
                : def;
    }
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    convert(data) {
        if (GTSLib.isArray(data.data)) {
            /** @type {?} */
            const dataList = GTSLib.flatDeep((/** @type {?} */ (this._data.data)));
            this.LOG.debug(['convert', 'isArray'], dataList);
            if (data.data.length > 0 && GTSLib.isGts(dataList[0])) {
                this._tabularData = this.parseData(dataList);
            }
            else {
                this._tabularData = this.parseCustomData(dataList);
            }
        }
        else {
            this._tabularData = this.parseCustomData([(/** @type {?} */ (data.data))]);
        }
        return [];
    }
    /**
     * @private
     * @param {?} data
     * @return {?}
     */
    parseCustomData(data) {
        /** @type {?} */
        const flatData = [];
        data.forEach((/**
         * @param {?} d
         * @return {?}
         */
        d => {
            /** @type {?} */
            const dataSet = {
                name: d.title || '',
                values: d.rows,
                headers: d.columns,
            };
            flatData.push(dataSet);
        }));
        this.LOG.debug(['parseCustomData', 'flatData'], flatData);
        return flatData;
    }
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    parseData(data) {
        /** @type {?} */
        const flatData = [];
        this.LOG.debug(['parseData'], data);
        data.forEach((/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        (d, i) => {
            /** @type {?} */
            const dataSet = {
                name: '',
                values: [],
                headers: []
            };
            if (GTSLib.isGts(d)) {
                this.LOG.debug(['parseData', 'isGts'], d);
                dataSet.name = GTSLib.serializeGtsMetadata(d);
                dataSet.values = d.v.map((/**
                 * @param {?} v
                 * @return {?}
                 */
                v => [this.formatDate(v[0])].concat(v.slice(1, v.length))));
            }
            else {
                this.LOG.debug(['parseData', 'is not a Gts'], d);
                dataSet.values = GTSLib.isArray(d) ? d : [d];
            }
            dataSet.headers = [this.getHeaderParam(i, 0, 'headers', 'Date')];
            if (d.v && d.v.length > 0 && d.v[0].length > 2) {
                dataSet.headers.push(this.getHeaderParam(i, 1, 'headers', 'Latitude'));
            }
            if (d.v && d.v.length > 0 && d.v[0].length > 3) {
                dataSet.headers.push(this.getHeaderParam(i, 2, 'headers', 'Longitude'));
            }
            if (d.v && d.v.length > 0 && d.v[0].length > 4) {
                dataSet.headers.push(this.getHeaderParam(i, 3, 'headers', 'Elevation'));
            }
            if (d.v && d.v.length > 0) {
                dataSet.headers.push(this.getHeaderParam(i, d.v[0].length - 1, 'headers', 'Value'));
            }
            if (dataSet.values.length > 0) {
                flatData.push(dataSet);
            }
        }));
        this.LOG.debug(['parseData', 'flatData'], flatData, this._options.timeMode);
        return flatData;
    }
    /**
     * @param {?} date
     * @return {?}
     */
    formatDate(date) {
        return this._options.timeMode === 'date' ? moment.tz(date / this.divider, this._options.timeZone).toISOString() : date.toString();
    }
}
WarpViewDatagridComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-datagrid',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"wrapper\" style=\"overflow: auto; height: 100%\">\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-paginable\n      *ngFor=\"let data of _tabularData\"\n      [data]=\"data\" [options]=\"_options\"\n      [debug]=\"debug\"></warpview-paginable>\n  </div>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}"]
            }] }
];
/** @nocollapse */
WarpViewDatagridComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: SizeService },
    { type: NgZone }
];
WarpViewDatagridComponent.propDecorators = {
    elemsCount: [{ type: Input, args: ['elemsCount',] }]
};
if (false) {
    /** @type {?} */
    WarpViewDatagridComponent.prototype.elemsCount;
    /** @type {?} */
    WarpViewDatagridComponent.prototype._tabularData;
    /** @type {?} */
    WarpViewDatagridComponent.prototype.el;
    /** @type {?} */
    WarpViewDatagridComponent.prototype.renderer;
    /** @type {?} */
    WarpViewDatagridComponent.prototype.sizeService;
    /** @type {?} */
    WarpViewDatagridComponent.prototype.ngZone;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LWRhdGFncmlkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzZW54L3dhcnB2aWV3LyIsInNvdXJjZXMiOlsic3JjL2xpYi9lbGVtZW50cy93YXJwLXZpZXctZGF0YWdyaWQvd2FycC12aWV3LWRhdGFncmlkLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFVLFNBQVMsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN6RyxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUV6RCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFFM0MsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBQzFELE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUMxQyxPQUFPLE1BQU0sTUFBTSxpQkFBaUIsQ0FBQztBQVFyQyxNQUFNLE9BQU8seUJBQTBCLFNBQVEsaUJBQWlCOzs7Ozs7O0lBUTlELFlBQ1MsRUFBYyxFQUNkLFFBQW1CLEVBQ25CLFdBQXdCLEVBQ3hCLE1BQWM7UUFFckIsS0FBSyxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBTGxDLE9BQUUsR0FBRixFQUFFLENBQVk7UUFDZCxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ25CLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLFdBQU0sR0FBTixNQUFNLENBQVE7UUFURixlQUFVLEdBQUcsRUFBRSxDQUFDOztRQUdyQyxpQkFBWSxHQUF5RCxFQUFFLENBQUM7UUFTdEUsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLE1BQU0sQ0FBQyx5QkFBeUIsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENB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QUFNOzs7eUJBa0J6QyxLQUFLLFNBQUMsWUFBWTs7OztJQUFuQiwrQ0FBcUM7O0lBR3JDLGlEQUF3RTs7SUFHdEUsdUNBQXFCOztJQUNyQiw2Q0FBMEI7O0lBQzFCLGdEQUErQjs7SUFDL0IsMkNBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqICBDb3B5cmlnaHQgMjAyMCAgU2VuWCBTLkEuUy5cbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudCwgRWxlbWVudFJlZiwgSW5wdXQsIE5nWm9uZSwgT25Jbml0LCBSZW5kZXJlcjIsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7V2FycFZpZXdDb21wb25lbnR9IGZyb20gJy4uL3dhcnAtdmlldy1jb21wb25lbnQnO1xuaW1wb3J0IHtQYXJhbX0gZnJvbSAnLi4vLi4vbW9kZWwvcGFyYW0nO1xuaW1wb3J0IHtHVFNMaWJ9IGZyb20gJy4uLy4uL3V0aWxzL2d0cy5saWInO1xuaW1wb3J0IHtEYXRhTW9kZWx9IGZyb20gJy4uLy4uL21vZGVsL2RhdGFNb2RlbCc7XG5pbXBvcnQge1NpemVTZXJ2aWNlfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9yZXNpemUuc2VydmljZSc7XG5pbXBvcnQge0xvZ2dlcn0gZnJvbSAnLi4vLi4vdXRpbHMvbG9nZ2VyJztcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50LXRpbWV6b25lJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnd2FycHZpZXctZGF0YWdyaWQnLFxuICB0ZW1wbGF0ZVVybDogJy4vd2FycC12aWV3LWRhdGFncmlkLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vd2FycC12aWV3LWRhdGFncmlkLmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLlNoYWRvd0RvbVxufSlcbmV4cG9ydCBjbGFzcyBXYXJwVmlld0RhdGFncmlkQ29tcG9uZW50IGV4dGVuZHMgV2FycFZpZXdDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG5cbiAgQElucHV0KCdlbGVtc0NvdW50JykgZWxlbXNDb3VudCA9IDE1O1xuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lXG4gIF90YWJ1bGFyRGF0YTogeyBuYW1lOiBzdHJpbmcsIHZhbHVlczogYW55W10sIGhlYWRlcnM6IHN0cmluZ1tdIH1bXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBlbDogRWxlbWVudFJlZixcbiAgICBwdWJsaWMgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwdWJsaWMgc2l6ZVNlcnZpY2U6IFNpemVTZXJ2aWNlLFxuICAgIHB1YmxpYyBuZ1pvbmU6IE5nWm9uZVxuICApIHtcbiAgICBzdXBlcihlbCwgcmVuZGVyZXIsIHNpemVTZXJ2aWNlLCBuZ1pvbmUpO1xuICAgIHRoaXMuTE9HID0gbmV3IExvZ2dlcihXYXJwVmlld0RhdGFncmlkQ29tcG9uZW50LCB0aGlzLl9kZWJ1Zyk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmRyYXdDaGFydCgpO1xuICB9XG5cbiAgdXBkYXRlKG9wdGlvbnM6IFBhcmFtKTogdm9pZCB7XG4gICAgdGhpcy5kcmF3Q2hhcnQoKTtcbiAgfVxuXG4gIHByaXZhdGUgZHJhd0NoYXJ0KCkge1xuICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgIHRoaXMuY2hhcnREcmF3LmVtaXQoKTtcbiAgICBpZiAoIXRoaXMuaW5pdENoYXJ0KHRoaXMuZWwpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRIZWFkZXJQYXJhbShpOiBudW1iZXIsIGo6IG51bWJlciwga2V5OiBzdHJpbmcsIGRlZjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fZGF0YS5wYXJhbXMgJiYgdGhpcy5fZGF0YS5wYXJhbXNbaV0gJiYgdGhpcy5fZGF0YS5wYXJhbXNbaV1ba2V5XSAmJiB0aGlzLl9kYXRhLnBhcmFtc1tpXVtrZXldW2pdXG4gICAgICA/IHRoaXMuX2RhdGEucGFyYW1zW2ldW2tleV1bal1cbiAgICAgIDogdGhpcy5fZGF0YS5nbG9iYWxQYXJhbXMgJiYgdGhpcy5fZGF0YS5nbG9iYWxQYXJhbXNba2V5XSAmJiB0aGlzLl9kYXRhLmdsb2JhbFBhcmFtc1trZXldW2pdXG4gICAgICAgID8gdGhpcy5fZGF0YS5nbG9iYWxQYXJhbXNba2V5XVtqXVxuICAgICAgICA6IGRlZjtcbiAgfVxuXG4gIHByb3RlY3RlZCBjb252ZXJ0KGRhdGE6IERhdGFNb2RlbCk6IGFueVtdIHtcbiAgICBpZiAoR1RTTGliLmlzQXJyYXkoZGF0YS5kYXRhKSkge1xuICAgICAgY29uc3QgZGF0YUxpc3QgPSBHVFNMaWIuZmxhdERlZXAodGhpcy5fZGF0YS5kYXRhIGFzIGFueVtdKTtcbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsnY29udmVydCcsICdpc0FycmF5J10sIGRhdGFMaXN0KTtcbiAgICAgIGlmIChkYXRhLmRhdGEubGVuZ3RoID4gMCAmJiBHVFNMaWIuaXNHdHMoZGF0YUxpc3RbMF0pKSB7XG4gICAgICAgIHRoaXMuX3RhYnVsYXJEYXRhID0gdGhpcy5wYXJzZURhdGEoZGF0YUxpc3QpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fdGFidWxhckRhdGEgPSB0aGlzLnBhcnNlQ3VzdG9tRGF0YShkYXRhTGlzdCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3RhYnVsYXJEYXRhID0gdGhpcy5wYXJzZUN1c3RvbURhdGEoW2RhdGEuZGF0YSBhcyBhbnldKTtcbiAgICB9XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgcHJpdmF0ZSBwYXJzZUN1c3RvbURhdGEoZGF0YTogYW55W10pOiB7IG5hbWU6IHN0cmluZywgdmFsdWVzOiBhbnlbXSwgaGVhZGVyczogc3RyaW5nW10gfVtdIHtcbiAgICBjb25zdCBmbGF0RGF0YTogeyBuYW1lOiBzdHJpbmcsIHZhbHVlczogYW55W10sIGhlYWRlcnM6IHN0cmluZ1tdIH1bXSA9IFtdO1xuICAgIGRhdGEuZm9yRWFjaChkID0+IHtcbiAgICAgIGNvbnN0IGRhdGFTZXQ6IHsgbmFtZTogc3RyaW5nLCB2YWx1ZXM6IGFueVtdLCBoZWFkZXJzOiBzdHJpbmdbXSB9ID0ge1xuICAgICAgICBuYW1lOiBkLnRpdGxlIHx8ICcnLFxuICAgICAgICB2YWx1ZXM6IGQucm93cyxcbiAgICAgICAgaGVhZGVyczogZC5jb2x1bW5zLFxuICAgICAgfTtcbiAgICAgIGZsYXREYXRhLnB1c2goZGF0YVNldCk7XG4gICAgfSk7XG4gICAgdGhpcy5MT0cuZGVidWcoWydwYXJzZUN1c3RvbURhdGEnLCAnZmxhdERhdGEnXSwgZmxhdERhdGEpO1xuICAgIHJldHVybiBmbGF0RGF0YTtcbiAgfVxuXG4gIHByb3RlY3RlZCBwYXJzZURhdGEoZGF0YTogYW55W10pOiB7IG5hbWU6IHN0cmluZywgdmFsdWVzOiBhbnlbXSwgaGVhZGVyczogc3RyaW5nW10gfVtdIHtcbiAgICBjb25zdCBmbGF0RGF0YTogeyBuYW1lOiBzdHJpbmcsIHZhbHVlczogYW55W10sIGhlYWRlcnM6IHN0cmluZ1tdIH1bXSA9IFtdO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsncGFyc2VEYXRhJ10sIGRhdGEpO1xuICAgIGRhdGEuZm9yRWFjaCgoZCwgaSkgPT4ge1xuICAgICAgY29uc3QgZGF0YVNldDogeyBuYW1lOiBzdHJpbmcsIHZhbHVlczogYW55W10sIGhlYWRlcnM6IHN0cmluZ1tdIH0gPSB7XG4gICAgICAgIG5hbWU6ICcnLFxuICAgICAgICB2YWx1ZXM6IFtdLFxuICAgICAgICBoZWFkZXJzOiBbXVxuICAgICAgfTtcbiAgICAgIGlmIChHVFNMaWIuaXNHdHMoZCkpIHtcbiAgICAgICAgdGhpcy5MT0cuZGVidWcoWydwYXJzZURhdGEnLCAnaXNHdHMnXSwgZCk7XG4gICAgICAgIGRhdGFTZXQubmFtZSA9IEdUU0xpYi5zZXJpYWxpemVHdHNNZXRhZGF0YShkKTtcbiAgICAgICAgZGF0YVNldC52YWx1ZXMgPSBkLnYubWFwKHYgPT4gW3RoaXMuZm9ybWF0RGF0ZSh2WzBdKV0uY29uY2F0KHYuc2xpY2UoMSwgdi5sZW5ndGgpKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3BhcnNlRGF0YScsICdpcyBub3QgYSBHdHMnXSwgZCk7XG4gICAgICAgIGRhdGFTZXQudmFsdWVzID0gR1RTTGliLmlzQXJyYXkoZCkgPyBkIDogW2RdO1xuICAgICAgfVxuICAgICAgZGF0YVNldC5oZWFkZXJzID0gW3RoaXMuZ2V0SGVhZGVyUGFyYW0oaSwgMCwgJ2hlYWRlcnMnLCAnRGF0ZScpXTtcbiAgICAgIGlmIChkLnYgJiYgZC52Lmxlbmd0aCA+IDAgJiYgZC52WzBdLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgZGF0YVNldC5oZWFkZXJzLnB1c2godGhpcy5nZXRIZWFkZXJQYXJhbShpLCAxLCAnaGVhZGVycycsICdMYXRpdHVkZScpKTtcbiAgICAgIH1cbiAgICAgIGlmIChkLnYgJiYgZC52Lmxlbmd0aCA+IDAgJiYgZC52WzBdLmxlbmd0aCA+IDMpIHtcbiAgICAgICAgZGF0YVNldC5oZWFkZXJzLnB1c2godGhpcy5nZXRIZWFkZXJQYXJhbShpLCAyLCAnaGVhZGVycycsICdMb25naXR1ZGUnKSk7XG4gICAgICB9XG4gICAgICBpZiAoZC52ICYmIGQudi5sZW5ndGggPiAwICYmIGQudlswXS5sZW5ndGggPiA0KSB7XG4gICAgICAgIGRhdGFTZXQuaGVhZGVycy5wdXNoKHRoaXMuZ2V0SGVhZGVyUGFyYW0oaSwgMywgJ2hlYWRlcnMnLCAnRWxldmF0aW9uJykpO1xuICAgICAgfVxuICAgICAgaWYgKGQudiAmJiBkLnYubGVuZ3RoID4gMCkge1xuICAgICAgICBkYXRhU2V0LmhlYWRlcnMucHVzaCh0aGlzLmdldEhlYWRlclBhcmFtKGksIGQudlswXS5sZW5ndGggLSAxLCAnaGVhZGVycycsICdWYWx1ZScpKTtcbiAgICAgIH1cbiAgICAgIGlmIChkYXRhU2V0LnZhbHVlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGZsYXREYXRhLnB1c2goZGF0YVNldCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5MT0cuZGVidWcoWydwYXJzZURhdGEnLCAnZmxhdERhdGEnXSwgZmxhdERhdGEsIHRoaXMuX29wdGlvbnMudGltZU1vZGUpO1xuICAgIHJldHVybiBmbGF0RGF0YTtcbiAgfVxuXG4gIGZvcm1hdERhdGUoZGF0ZTogbnVtYmVyKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fb3B0aW9ucy50aW1lTW9kZSA9PT0gJ2RhdGUnID8gbW9tZW50LnR6KGRhdGUgLyB0aGlzLmRpdmlkZXIsIHRoaXMuX29wdGlvbnMudGltZVpvbmUpLnRvSVNPU3RyaW5nKCkgOiBkYXRlLnRvU3RyaW5nKCk7XG4gIH1cbn1cbiJdfQ==