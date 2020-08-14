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
import { Component, ElementRef, EventEmitter, HostListener, Input, NgZone, Output, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { WarpViewComponent } from '../warp-view-component';
import { WarpViewModalComponent } from '../warp-view-modal/warp-view-modal.component';
import { Param } from '../../model/param';
import { WarpViewChartComponent } from '../warp-view-chart/warp-view-chart.component';
import { WarpViewAnnotationComponent } from '../warp-view-annotation/warp-view-annotation.component';
import { WarpViewMapComponent } from '../warp-view-map/warp-view-map.component';
import { WarpViewGtsPopupComponent } from '../warp-view-gts-popup/warp-view-gts-popup.component';
import moment from 'moment-timezone';
import { GTSLib } from '../../utils/gts.lib';
import deepEqual from 'deep-equal';
import { Size, SizeService } from '../../services/resize.service';
import { Logger } from '../../utils/logger';
/**
 *
 */
export class WarpViewPlotComponent extends WarpViewComponent {
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
        this.showLine = false;
        this.isAlone = false;
        this.initialChartHeight = 400;
        this.initialMapHeight = 400;
        this.warpViewChartResize = new EventEmitter();
        this._options = Object.assign({}, new Param(), {
            showControls: true,
            showGTSTree: true,
            showDots: true,
            timeZone: 'UTC',
            timeUnit: 'us',
            timeMode: 'date',
            bounds: {}
        });
        this._toHide = [];
        this.showChart = true;
        this.showMap = false;
        this.timeClipValue = '';
        this.kbdLastKeyPressed = [];
        this.warningMessage = '';
        this.loading = false;
        this.gtsIdList = [];
        this.kbdCounter = 0;
        this.gtsFilterCount = 0;
        this.gtsBrowserIndex = -1;
        this._gtsFilter = 'x';
        this._type = 'line';
        this.chartBounds = {
            tsmin: Number.MAX_VALUE,
            tsmax: Number.MIN_VALUE,
            msmax: '',
            msmin: '',
            marginLeft: 0
        };
        // key event are trapped in plot component.
        // if one of this key is pressed, default action is prevented.
        this.preventDefaultKeyList = ['Escape', '/'];
        this.preventDefaultKeyListInModals = ['Escape', 'ArrowUp', 'ArrowDown', ' ', '/'];
        this.LOG = new Logger(WarpViewPlotComponent, this._debug);
    }
    /**
     * @param {?} type
     * @return {?}
     */
    set type(type) {
        this._type = type;
        this.drawChart();
    }
    /**
     * @return {?}
     */
    get type() {
        return this._type;
    }
    /**
     * @param {?} gtsFilter
     * @return {?}
     */
    set gtsFilter(gtsFilter) {
        this._gtsFilter = gtsFilter;
        this.drawChart();
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
    ngOnInit() {
        this._options = this._options || this.defOptions;
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.drawChart(true);
        this.resizeArea();
    }
    /**
     * @param {?} ev
     * @return {?}
     */
    handleKeydown(ev) {
        this.LOG.debug(['handleKeydown'], ev);
        if (!this.isAlone) {
            this.handleKeyPress(ev).then((/**
             * @return {?}
             */
            () => {
                // empty
            }));
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    stateChange(event) {
        this.LOG.debug(['stateChange'], event);
        switch (event.id) {
            case 'timeSwitch':
                if (event.state) {
                    this._options.timeMode = 'timestamp';
                }
                else {
                    this._options.timeMode = 'date';
                }
                this.drawChart();
                break;
            case 'typeSwitch':
                if (event.state) {
                    this._type = 'step';
                }
                else {
                    this._type = 'line';
                }
                this.drawChart();
                break;
            case 'chartSwitch':
                this.showChart = event.state;
                this.drawChart();
                break;
            case 'mapSwitch':
                this.showMap = event.state;
                if (this.showMap) {
                    requestAnimationFrame((/**
                     * @return {?}
                     */
                    () => this.map.resize()));
                }
                break;
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    boundsDidChange(event) {
        this.LOG.debug(['updateBounds'], event);
        this._options.bounds = this._options.bounds || {};
        if (this._options.bounds.minDate !== event.bounds.min && this._options.bounds.maxDate !== event.bounds.max) {
            this._options.bounds = this._options.bounds || {};
            this._options.bounds.minDate = event.bounds.min;
            this._options.bounds.maxDate = event.bounds.max;
            if (event.source === 'chart') {
                this.annotation.updateBounds(event.bounds.min, event.bounds.max, event.bounds.marginLeft);
            }
            else if (event.source === 'annotation') {
                this.chart.updateBounds(event.bounds.min, event.bounds.max);
            }
            this.LOG.debug(['updateBounds'], moment.tz(event.bounds.min, this._options.timeZone).toDate(), moment.tz(event.bounds.max, this._options.timeZone).toDate());
            this.line.nativeElement.style.left = '-100px';
        }
    }
    /**
     * @return {?}
     */
    onWarpViewModalClose() {
        this.mainPlotDiv.nativeElement.focus();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    warpViewSelectedGTS(event) {
        this.LOG.debug(['warpViewSelectedGTS'], event);
        if (!this._toHide.find((/**
         * @param {?} i
         * @return {?}
         */
        i => {
            return i === event.gts.id;
        })) && !event.selected) { // if not in toHide and state false, put id in toHide
            this._toHide.push(event.gts.id);
        }
        else {
            if (event.selected) { // if in toHide and state true, remove it from toHide
                this._toHide = this._toHide.filter((/**
                 * @param {?} i
                 * @return {?}
                 */
                i => {
                    return i !== event.gts.id;
                }));
            }
        }
        this.LOG.debug(['warpViewSelectedGTS', 'this._toHide'], this._toHide);
        this.ngZone.run((/**
         * @return {?}
         */
        () => {
            this._toHide = [...this._toHide];
        }));
    }
    /**
     * @param {?} evt
     * @return {?}
     */
    handleMouseMove(evt) {
        evt.preventDefault();
        if (this.showLine && this.line) {
            this.line.nativeElement.style.left = Math.max(evt.pageX - this.left, 50) + 'px';
        }
    }
    /**
     * @param {?} evt
     * @return {?}
     */
    handleMouseEnter(evt) {
        evt.preventDefault();
        this.left = this.left || this.main.nativeElement.getBoundingClientRect().left;
        this.showLine = true;
        if (this.line) {
            this.renderer.setStyle(this.line.nativeElement, 'display', 'block');
        }
    }
    /**
     * @param {?} evt
     * @return {?}
     */
    handleMouseOut(evt) {
        // evt.preventDefault();
        if (this.line) {
            this.showLine = false;
            this.renderer.setStyle(this.line.nativeElement, 'left', '-100px');
            this.renderer.setStyle(this.line.nativeElement, 'display', 'none');
        }
    }
    /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    update(options, refresh) {
        if (options) {
            /** @type {?} */
            let optionChanged = false;
            Object.keys(options).forEach((/**
             * @param {?} opt
             * @return {?}
             */
            opt => {
                if (this._options.hasOwnProperty(opt)) {
                    optionChanged = optionChanged || !deepEqual(options[opt], this._options[opt]);
                }
                else {
                    optionChanged = true; // new unknown option
                }
            }));
            if (this.LOG) {
                this.LOG.debug(['onOptions', 'optionChanged'], optionChanged);
            }
            if (optionChanged) {
                if (this.LOG) {
                    this.LOG.debug(['onOptions', 'options'], options);
                }
                this._options = options;
                this.drawChart(false);
            }
            this.drawChart(refresh);
        }
        else {
            this.drawChart(refresh);
        }
    }
    /**
     * @param {?} e
     * @return {?}
     */
    inputTextKeyboardEvents(e) {
        e.stopImmediatePropagation();
        if (e.key === 'Enter') {
            this.applyFilter();
        }
        else if (e.key === 'Escape') {
            this.pushKbdEvent('Escape');
            this.modal.close();
        }
    }
    /**
     * @return {?}
     */
    tzSelected() {
        /** @type {?} */
        const timeZone = this.tzSelector.nativeElement.value;
        this.LOG.debug(['timezone', 'tzselect'], timeZone);
        this._options.timeZone = timeZone;
        this.tzSelector.nativeElement.setAttribute('class', timeZone === 'UTC' ? 'defaulttz' : 'customtz');
        this.drawChart();
    }
    /**
     * @return {?}
     */
    getTimeClip() {
        this.LOG.debug(['getTimeClip'], this.chart.getTimeClip());
        return this.chart.getTimeClip();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    resizeChart(event) {
        this.LOG.debug(['resizeChart'], event);
        this.sizeService.change(new Size(this.width, event));
    }
    /**
     * @param {?=} firstDraw
     * @return {?}
     */
    drawChart(firstDraw = false) {
        this.LOG.debug(['drawCharts'], this._data, this._options);
        if (!this._data || !this._data.data || this._data.data.length === 0) {
            return;
        }
        if (this.timeClip) {
            this.timeClip.close();
        }
        if (this.modal) {
            this.modal.close();
        }
        this.LOG.debug(['PPts'], 'firstdraw ', firstDraw);
        if (firstDraw) { // on the first draw, we can set some default options.
            // on the first draw, we can set some default options.
            // automatically switch to timestamp mode
            // when the first tick and last tick of all the series are in the interval [-100ms 100ms]
            /** @type {?} */
            const tsLimit = 100 * GTSLib.getDivider(this._options.timeUnit);
            /** @type {?} */
            const dataList = this._data.data;
            if (dataList) {
                /** @type {?} */
                let gtsList = GTSLib.flattenGtsIdArray((/** @type {?} */ (dataList)), 0).res;
                gtsList = GTSLib.flatDeep(gtsList);
                /** @type {?} */
                let timestampMode = true;
                /** @type {?} */
                let totalDatapoints = 0;
                gtsList.forEach((/**
                 * @param {?} g
                 * @return {?}
                 */
                g => {
                    this.gtsIdList.push(g.id); // usefull for gts browse shortcut
                    if (g.v.length > 0) { // if gts not empty
                        timestampMode = timestampMode && (g.v[0][0] > -tsLimit && g.v[0][0] < tsLimit);
                        timestampMode = timestampMode && (g.v[g.v.length - 1][0] > -tsLimit && g.v[g.v.length - 1][0] < tsLimit);
                        totalDatapoints += g.v.length;
                    }
                }));
                if (timestampMode) {
                    this._options.timeMode = 'timestamp';
                }
                this.LOG.debug(['drawCharts', 'parsed', 'timestampMode'], timestampMode);
            }
        }
        this.gtsList = this._data;
        this._options = Object.assign({}, this._options);
        this.LOG.debug(['drawCharts', 'parsed'], this._data, this._options);
        this.resizeArea();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    focus(event) {
        // read the first 4 letters of id of all elements in the click tree
        /** @type {?} */
        const idListClicked = event.path.map((/**
         * @param {?} el
         * @return {?}
         */
        el => (el.id || '').slice(0, 4)));
        // if not alone on the page, and click is not on the timezone selector and not on the map, force focus.
        if (!this.isAlone && idListClicked.indexOf('tzSe') < 0 && idListClicked.indexOf('map-') < 0) {
            this.mainPlotDiv.nativeElement.focus();
        } // prevent stealing focus of the timezone selector.
    }
    /**
     * @private
     * @param {?} ev
     * @return {?}
     */
    handleKeyPress(ev) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.LOG.debug(['handleKeyPress'], ev);
            if (this.preventDefaultKeyList.indexOf(ev.key) >= 0) {
                ev.preventDefault();
            }
            if ((yield this.timeClip.isOpened()) || (yield this.modal.isOpened()) || (yield this.gtsPopupModal.isOpened())) {
                if (this.preventDefaultKeyListInModals.indexOf(ev.key) >= 0) {
                    ev.preventDefault();
                }
            }
            if (ev.key === '/') {
                this.modal.open();
                this.filterInput.nativeElement.focus();
                this.filterInput.nativeElement.select();
            }
            else if (ev.key === 't') {
                this.chart.getTimeClip().then((/**
                 * @param {?} tc
                 * @return {?}
                 */
                tc => {
                    this.timeClipValue = `<p>keep data between
          ${this._options.timeMode === 'timestamp' ? tc.tsmin : moment.tz(tc.tsmin, this._options.timeZone).toLocaleString()} and
          ${this._options.timeMode === 'timestamp' ? tc.tsmax : moment.tz(tc.tsmax, this._options.timeZone).toLocaleString()}
          ${this._options.timeUnit !== 'us' ? ' (for a ' + this._options.timeUnit + ' platform)' : ''}</p>
          <pre><code>${Math.round(tc.tsmax)} ${Math.round(tc.tsmax - tc.tsmin)} TIMECLIP</code></pre>`;
                    this.timeClip.open();
                }));
            }
            else if (ev.key === 'b' || ev.key === 'B') { // browse among all gts
                if (this.gtsBrowserIndex < 0) {
                    this.gtsBrowserIndex = 0;
                }
                if (ev.key === 'b') { // increment index
                    this.gtsBrowserIndex++;
                    if (this.gtsBrowserIndex === this.gtsIdList.length) {
                        this.gtsBrowserIndex = 0;
                    }
                }
                else { // decrement index
                    this.gtsBrowserIndex--;
                    if (this.gtsBrowserIndex < 0) {
                        this.gtsBrowserIndex = this.gtsIdList.length - 1;
                    }
                }
                this._toHide = this.gtsIdList.filter((/**
                 * @param {?} v
                 * @return {?}
                 */
                v => v !== this.gtsIdList[this.gtsBrowserIndex])); // hide all but one
            }
            else if (ev.key === 'n') {
                this._toHide = [...this.gtsIdList];
                return false;
            }
            else if (ev.key === 'a') {
                this._toHide = [];
            }
            else if (ev.key === 'Escape') {
                this.timeClip.isOpened().then((/**
                 * @param {?} r
                 * @return {?}
                 */
                r => {
                    if (r) {
                        this.timeClip.close();
                    }
                }));
                this.modal.isOpened().then((/**
                 * @param {?} r
                 * @return {?}
                 */
                r => {
                    if (r) {
                        this.modal.close();
                    }
                }));
                this.gtsPopupModal.isOpened().then((/**
                 * @param {?} r
                 * @return {?}
                 */
                r => {
                    if (r) {
                        this.gtsPopupModal.close();
                    }
                }));
            }
            else {
                this.pushKbdEvent(ev.key);
            }
            this.LOG.debug(['handleKeyPress', 'this.gtsIdList'], this._toHide, this.gtsBrowserIndex);
        });
    }
    /**
     * @return {?}
     */
    applyFilter() {
        this.gtsFilterCount++;
        this._gtsFilter = this.gtsFilterCount.toString().slice(0, 1) + this.filterInput.nativeElement.value;
        this.modal.close();
    }
    /**
     * @private
     * @param {?} key
     * @return {?}
     */
    pushKbdEvent(key) {
        this.kbdCounter++;
        this.kbdLastKeyPressed = [key, this.kbdCounter.toString()];
    }
    /**
     * @return {?}
     */
    getTZ() {
        return moment.tz.names();
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
     * @param {?} $event
     * @return {?}
     */
    onChartDraw($event) {
        if (this.chartBounds
            && $event
            && this.chartBounds.tsmin !== Math.min(this.chartBounds.tsmin, $event.tsmin)
            && this.chartBounds.tsmax !== Math.max(this.chartBounds.tsmax, $event.tsmax)) {
            this.chartBounds.tsmin = Math.min(this.chartBounds.tsmin, $event.tsmin);
            this.chartBounds.tsmax = Math.max(this.chartBounds.tsmax, $event.tsmax);
            this.annotation.setRealBounds(this.chartBounds);
            this.chart.setRealBounds(this.chartBounds);
            this.chartDraw.emit();
            this.LOG.debug(['onChartDraw', 'this.chartBounds'], this.chartBounds, $event);
        }
        this.chartDraw.emit($event);
    }
    /**
     * @private
     * @return {?}
     */
    resizeArea() {
        setTimeout((/**
         * @return {?}
         */
        () => {
            /** @type {?} */
            let h = this.el.nativeElement.getBoundingClientRect().height;
            if (h > 0) {
                if (!!this.GTSTree) {
                    h -= this.GTSTree.nativeElement.getBoundingClientRect().height;
                }
                if (!!this.controls) {
                    h -= this.controls.nativeElement.getBoundingClientRect().height;
                }
                this.initialChartHeight = h;
            }
        }));
    }
}
WarpViewPlotComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-plot',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div #mainPlotDiv tabindex=\"0\" (click)=\"focus($event)\" id=\"focusablePlotDiv\">\n  <warpview-modal [kbdLastKeyPressed]=\"kbdLastKeyPressed\" modalTitle=\"TimeClip\" #timeClip\n                  (warpViewModalClose)=\"onWarpViewModalClose()\"\n  >\n    <div #timeClipElement [innerHTML]=\"timeClipValue\"></div>\n  </warpview-modal>\n  <warpview-modal [kbdLastKeyPressed]=\"kbdLastKeyPressed\" modalTitle=\"GTS Filter\" #modal\n                  (warpViewModalClose)=\"onWarpViewModalClose()\"\n  >\n    <label for=\"filterInput\">Enter a regular expression to filter GTS.</label>\n    <br />\n    <input tabindex=\"1\" type=\"text\" (keypress)=\"inputTextKeyboardEvents($event)\" #filterInput id=\"filterInput\"\n           (keydown)=\"inputTextKeyboardEvents($event)\" (keyup)=\"inputTextKeyboardEvents($event)\"\n           [value]=\"gtsFilter.slice(1)\"/>\n    <button (click)=\"applyFilter()\" [innerHTML]=\"_options.popupButtonValidateLabel || 'Apply'\"\n            class=\"{{_options.popupButtonValidateClass}}\" tabindex=\"2\"\n            type=\"button\">\n    </button>\n  </warpview-modal>\n  <warpview-gts-popup [maxToShow]=\"5\" [hiddenData]=\"_toHide\" [gtsList]=\"gtsList\"\n                      [kbdLastKeyPressed]=\"kbdLastKeyPressed\"\n                      [options]=\"_options\" [debug]=\"debug\"\n                      (warpViewModalClose)=\"onWarpViewModalClose()\"\n                      (warpViewSelectedGTS)=\"warpViewSelectedGTS($event)\"\n                      #gtsPopupModal></warpview-gts-popup>\n  <div class=\"inline\" *ngIf=\"_options.showControls\" #controls>\n    <warpview-toggle id=\"timeSwitch\" text1=\"Date\" text2=\"Timestamp\"\n                     (stateChange)=\"stateChange($event)\"\n                     [checked]=\"_options.timeMode === 'timestamp'\"></warpview-toggle>\n    <warpview-toggle id=\"typeSwitch\" text1=\"Line\" text2=\"Step\"\n                     (stateChange)=\"stateChange($event)\"></warpview-toggle>\n    <warpview-toggle id=\"chartSwitch\" text1=\"Hide chart\" text2=\"Display chart\"\n                     (stateChange)=\"stateChange($event)\"\n                     [checked]=\"showChart\"></warpview-toggle>\n    <warpview-toggle id=\"mapSwitch\" text1=\"Hide map\" text2=\"Display map\"\n                     (stateChange)=\"stateChange($event)\" [checked]=\"showMap\"></warpview-toggle>\n    <div class=\"tzcontainer\">\n      <label for=\"tzSelector\"></label>\n      <select id=\"tzSelector\" class=\"defaulttz\" #tzSelector (change)=\"tzSelected()\">\n        <option *ngFor=\"let z of getTZ()\" [value]=\"z\" [selected]=\"z === 'UTC'\"\n                [ngClass]=\"{'defaulttz' :z === 'UTC','customtz': z !== 'UTC'}\">{{z}}</option>\n      </select>\n    </div>\n  </div>\n  <div *ngIf=\"warningMessage\" class=\"warningMessage\">{{warningMessage}}</div>\n  <warpview-gts-tree\n    *ngIf=\"_options.showGTSTree\"\n    [data]=\"gtsList\" id=\"tree\" [gtsFilter]=\"gtsFilter\" [debug]=\"debug\" #GTSTree\n    (warpViewSelectedGTS)=\"warpViewSelectedGTS($event)\"\n    [hiddenData]=\"_toHide\" [options]=\"_options\"\n    [kbdLastKeyPressed]=\"kbdLastKeyPressed\"\n  ></warpview-gts-tree>\n  <div *ngIf=\"showChart\" #main class=\"main-container\"\n       (mouseleave)=\"handleMouseOut($event)\"\n       (mousemove)=\"handleMouseMove($event)\"\n       (mouseenter)=\"handleMouseEnter($event)\">\n    <div class=\"bar\" #line></div>\n    <div class=\"annotation\">\n      <warpview-annotation #annotation\n                           [data]=\"gtsList\" [responsive]=\"true\"\n                           (boundsDidChange)=\"boundsDidChange($event)\"\n                           (chartDraw)=\"onChartDraw($event)\"\n                           [showLegend]='showLegend' [debug]=\"debug\" [standalone]=\"false\"\n                           [hiddenData]=\"_toHide\" [options]=\"_options\"\n      ></warpview-annotation>\n    </div>\n    <warpview-resize minHeight=\"100\" [initialHeight]=\"initialChartHeight\" [debug]=\"debug\"\n                     (resize)=\"resizeChart($event)\"\n    >\n      <warpview-chart [responsive]=\"true\" [standalone]=\"false\" [data]=\"gtsList\"\n                      [showLegend]=\"showLegend\"\n                      (boundsDidChange)=\"boundsDidChange($event)\"\n                      (chartDraw)=\"onChartDraw($event)\"\n                      #chart [debug]=\"debug\" [hiddenData]=\"_toHide\" [type]=\"type\" [options]=\"_options\"\n      ></warpview-chart>\n    </warpview-resize>\n  </div>\n  <warpview-resize *ngIf=\"showMap\" minHeight=\"100\" [initialHeight]=\"initialMapHeight\" [debug]=\"debug\">\n    <div class=\"map-container\">\n      <warpview-map [options]=\"_options\" #map [data]=\"gtsList\" [debug]=\"debug\" [responsive]=\"true\"\n                    [hiddenData]=\"_toHide\"\n      ></warpview-map>\n    </div>\n  </warpview-resize>\n</div>\n",
                encapsulation: ViewEncapsulation.None,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host,warp-view-plot,warpview-plot{position:relative;height:100%}:host .main-container,warp-view-plot .main-container,warpview-plot .main-container{position:relative}:host .map-container,warp-view-plot .map-container,warpview-plot .map-container{height:100%;width:100%;margin-right:20px;position:relative}:host .bar,warp-view-plot .bar,warpview-plot .bar{width:1px;left:-100px;position:absolute;background-color:transparent;-webkit-backface-visibility:hidden;backface-visibility:hidden;top:0;bottom:55px;overflow:hidden;display:none;z-index:0;pointer-events:none;border-left:dashed 2px var(--warp-view-bar-color)}:host .inline,warp-view-plot .inline,warpview-plot .inline{display:-webkit-inline-box;display:inline-flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;flex-direction:row;flex-wrap:wrap;-webkit-box-pack:space-evenly;justify-content:space-evenly;-webkit-box-align:stretch;align-items:stretch;width:100%}:host label,warp-view-plot label,warpview-plot label{display:inline-block}:host input,warp-view-plot input,warpview-plot input{display:block;width:calc(100% - 20px);padding:5px;font-size:1rem;font-weight:400;line-height:1.5}:host .annotation,warp-view-plot .annotation,warpview-plot .annotation{max-width:100%;padding-top:20px;margin-bottom:0}:host #focusablePlotDiv:focus,warp-view-plot #focusablePlotDiv:focus,warpview-plot #focusablePlotDiv:focus{outline:0}:host #tzSelector,warp-view-plot #tzSelector,warpview-plot #tzSelector{height:var(--warp-view-switch-height);border-radius:var(--warp-view-switch-radius);padding-left:calc(var(--warp-view-switch-radius)/ 2);padding-right:5px;box-shadow:inset 0 1px 2px rgba(0,0,0,.12),inset 0 0 2px rgba(0,0,0,.15);color:var(--warp-view-font-color);border:none;margin:auto}:host .defaulttz,warp-view-plot .defaulttz,warpview-plot .defaulttz{background:var(--warp-view-switch-inset-color)}:host .customtz,warp-view-plot .customtz,warpview-plot .customtz{background:var(--warp-view-switch-inset-checked-color)}:host .tzcontainer,warp-view-plot .tzcontainer,warpview-plot .tzcontainer{display:-webkit-box;display:flex}:host .chart-container,warp-view-plot .chart-container,warpview-plot .chart-container{height:var(--warp-view-plot-chart-height);width:100%}:host #bottomPlaceHolder,warp-view-plot #bottomPlaceHolder,warpview-plot #bottomPlaceHolder{height:200px;width:100%}:host .warningMessage,warp-view-plot .warningMessage,warpview-plot .warningMessage{color:orange;padding:10px;border-radius:3px;background:#faebd7;margin:1em;display:block;border:2px solid orange}"]
            }] }
];
/** @nocollapse */
WarpViewPlotComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: SizeService },
    { type: NgZone }
];
WarpViewPlotComponent.propDecorators = {
    mainPlotDiv: [{ type: ViewChild, args: ['mainPlotDiv', { static: true },] }],
    timeClip: [{ type: ViewChild, args: ['timeClip', { static: true },] }],
    modal: [{ type: ViewChild, args: ['modal', { static: true },] }],
    chart: [{ type: ViewChild, args: ['chart', { static: false },] }],
    gtsPopupModal: [{ type: ViewChild, args: ['gtsPopupModal', { static: false },] }],
    annotation: [{ type: ViewChild, args: ['annotation', { static: false },] }],
    map: [{ type: ViewChild, args: ['map', { static: false },] }],
    timeClipElement: [{ type: ViewChild, args: ['timeClipElement', { static: true },] }],
    GTSTree: [{ type: ViewChild, args: ['GTSTree', { static: true },] }],
    controls: [{ type: ViewChild, args: ['controls', { static: true },] }],
    filterInput: [{ type: ViewChild, args: ['filterInput', { static: true },] }],
    tzSelector: [{ type: ViewChild, args: ['tzSelector', { static: false },] }],
    line: [{ type: ViewChild, args: ['line', { static: false },] }],
    main: [{ type: ViewChild, args: ['main', { static: false },] }],
    type: [{ type: Input, args: ['type',] }],
    gtsFilter: [{ type: Input, args: ['gtsFilter',] }],
    isAlone: [{ type: Input, args: ['isAlone',] }],
    initialChartHeight: [{ type: Input, args: ['initialChartHeight',] }],
    initialMapHeight: [{ type: Input, args: ['initialMapHeight',] }],
    warpViewChartResize: [{ type: Output, args: ['warpViewChartResize',] }],
    handleKeydown: [{ type: HostListener, args: ['keydown', ['$event'],] }]
};
if (false) {
    /** @type {?} */
    WarpViewPlotComponent.prototype.mainPlotDiv;
    /** @type {?} */
    WarpViewPlotComponent.prototype.timeClip;
    /** @type {?} */
    WarpViewPlotComponent.prototype.modal;
    /** @type {?} */
    WarpViewPlotComponent.prototype.chart;
    /** @type {?} */
    WarpViewPlotComponent.prototype.gtsPopupModal;
    /** @type {?} */
    WarpViewPlotComponent.prototype.annotation;
    /** @type {?} */
    WarpViewPlotComponent.prototype.map;
    /** @type {?} */
    WarpViewPlotComponent.prototype.timeClipElement;
    /** @type {?} */
    WarpViewPlotComponent.prototype.GTSTree;
    /** @type {?} */
    WarpViewPlotComponent.prototype.controls;
    /** @type {?} */
    WarpViewPlotComponent.prototype.filterInput;
    /** @type {?} */
    WarpViewPlotComponent.prototype.tzSelector;
    /** @type {?} */
    WarpViewPlotComponent.prototype.line;
    /** @type {?} */
    WarpViewPlotComponent.prototype.main;
    /**
     * @type {?}
     * @private
     */
    WarpViewPlotComponent.prototype.showLine;
    /**
     * @type {?}
     * @private
     */
    WarpViewPlotComponent.prototype.left;
    /** @type {?} */
    WarpViewPlotComponent.prototype.isAlone;
    /** @type {?} */
    WarpViewPlotComponent.prototype.initialChartHeight;
    /** @type {?} */
    WarpViewPlotComponent.prototype.initialMapHeight;
    /** @type {?} */
    WarpViewPlotComponent.prototype.warpViewChartResize;
    /** @type {?} */
    WarpViewPlotComponent.prototype._options;
    /** @type {?} */
    WarpViewPlotComponent.prototype._toHide;
    /** @type {?} */
    WarpViewPlotComponent.prototype.showChart;
    /** @type {?} */
    WarpViewPlotComponent.prototype.showMap;
    /** @type {?} */
    WarpViewPlotComponent.prototype.timeClipValue;
    /** @type {?} */
    WarpViewPlotComponent.prototype.kbdLastKeyPressed;
    /** @type {?} */
    WarpViewPlotComponent.prototype.warningMessage;
    /** @type {?} */
    WarpViewPlotComponent.prototype.loading;
    /** @type {?} */
    WarpViewPlotComponent.prototype.gtsIdList;
    /**
     * @type {?}
     * @private
     */
    WarpViewPlotComponent.prototype.kbdCounter;
    /**
     * @type {?}
     * @private
     */
    WarpViewPlotComponent.prototype.gtsFilterCount;
    /**
     * @type {?}
     * @private
     */
    WarpViewPlotComponent.prototype.gtsBrowserIndex;
    /**
     * @type {?}
     * @private
     */
    WarpViewPlotComponent.prototype._gtsFilter;
    /**
     * @type {?}
     * @private
     */
    WarpViewPlotComponent.prototype._type;
    /**
     * @type {?}
     * @private
     */
    WarpViewPlotComponent.prototype.chartBounds;
    /**
     * @type {?}
     * @private
     */
    WarpViewPlotComponent.prototype.preventDefaultKeyList;
    /**
     * @type {?}
     * @private
     */
    WarpViewPlotComponent.prototype.preventDefaultKeyListInModals;
    /** @type {?} */
    WarpViewPlotComponent.prototype.gtsList;
    /** @type {?} */
    WarpViewPlotComponent.prototype.el;
    /** @type {?} */
    WarpViewPlotComponent.prototype.renderer;
    /** @type {?} */
    WarpViewPlotComponent.prototype.sizeService;
    /** @type {?} */
    WarpViewPlotComponent.prototype.ngZone;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LXBsb3QuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHNlbngvd2FycHZpZXcvIiwic291cmNlcyI6WyJzcmMvbGliL2VsZW1lbnRzL3dhcnAtdmlldy1wbG90L3dhcnAtdmlldy1wbG90LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUVMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFlBQVksRUFDWixLQUFLLEVBQ0wsTUFBTSxFQUVOLE1BQU0sRUFDTixTQUFTLEVBQ1QsU0FBUyxFQUNULGlCQUFpQixFQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN6RCxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSw4Q0FBOEMsQ0FBQztBQUNwRixPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDeEMsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0sOENBQThDLENBQUM7QUFDcEYsT0FBTyxFQUFDLDJCQUEyQixFQUFDLE1BQU0sd0RBQXdELENBQUM7QUFDbkcsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sMENBQTBDLENBQUM7QUFDOUUsT0FBTyxFQUFDLHlCQUF5QixFQUFDLE1BQU0sc0RBQXNELENBQUM7QUFFL0YsT0FBTyxNQUFNLE1BQU0saUJBQWlCLENBQUM7QUFDckMsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBRzNDLE9BQU8sU0FBUyxNQUFNLFlBQVksQ0FBQztBQUNuQyxPQUFPLEVBQUMsSUFBSSxFQUFFLFdBQVcsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBQ2hFLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQzs7OztBQVcxQyxNQUFNLE9BQU8scUJBQXNCLFNBQVEsaUJBQWlCOzs7Ozs7O0lB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OztJQUNsRCxvREFBNkU7O0lBRTdFLHlDQVVFOztJQUNGLHdDQUF1Qjs7SUFDdkIsMENBQWlCOztJQUNqQix3Q0FBZ0I7O0lBQ2hCLDhDQUFtQjs7SUFDbkIsa0RBQWlDOztJQUNqQywrQ0FBb0I7O0lBQ3BCLHdDQUFnQjs7SUFDaEIsMENBQXlCOzs7OztJQUV6QiwyQ0FBdUI7Ozs7O0lBQ3ZCLCtDQUEyQjs7Ozs7SUFDM0IsZ0RBQTZCOzs7OztJQUM3QiwyQ0FBeUI7Ozs7O0lBQ3pCLHNDQUF1Qjs7Ozs7SUFDdkIsNENBTUU7Ozs7O0lBR0Ysc0RBQTBEOzs7OztJQUMxRCw4REFBK0Y7O0lBQy9GLHdDQUFvQzs7SUFHbEMsbUNBQXFCOztJQUNyQix5Q0FBMEI7O0lBQzFCLDRDQUErQjs7SUFDL0IsdUNBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqICBDb3B5cmlnaHQgMjAyMCAgU2VuWCBTLkEuUy5cbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqL1xuXG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSG9zdExpc3RlbmVyLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgUmVuZGVyZXIyLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtXYXJwVmlld0NvbXBvbmVudH0gZnJvbSAnLi4vd2FycC12aWV3LWNvbXBvbmVudCc7XG5pbXBvcnQge1dhcnBWaWV3TW9kYWxDb21wb25lbnR9IGZyb20gJy4uL3dhcnAtdmlldy1tb2RhbC93YXJwLXZpZXctbW9kYWwuY29tcG9uZW50JztcbmltcG9ydCB7UGFyYW19IGZyb20gJy4uLy4uL21vZGVsL3BhcmFtJztcbmltcG9ydCB7V2FycFZpZXdDaGFydENvbXBvbmVudH0gZnJvbSAnLi4vd2FycC12aWV3LWNoYXJ0L3dhcnAtdmlldy1jaGFydC5jb21wb25lbnQnO1xuaW1wb3J0IHtXYXJwVmlld0Fubm90YXRpb25Db21wb25lbnR9IGZyb20gJy4uL3dhcnAtdmlldy1hbm5vdGF0aW9uL3dhcnAtdmlldy1hbm5vdGF0aW9uLmNvbXBvbmVudCc7XG5pbXBvcnQge1dhcnBWaWV3TWFwQ29tcG9uZW50fSBmcm9tICcuLi93YXJwLXZpZXctbWFwL3dhcnAtdmlldy1tYXAuY29tcG9uZW50JztcbmltcG9ydCB7V2FycFZpZXdHdHNQb3B1cENvbXBvbmVudH0gZnJvbSAnLi4vd2FycC12aWV3LWd0cy1wb3B1cC93YXJwLXZpZXctZ3RzLXBvcHVwLmNvbXBvbmVudCc7XG5pbXBvcnQge0NoYXJ0Qm91bmRzfSBmcm9tICcuLi8uLi9tb2RlbC9jaGFydEJvdW5kcyc7XG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudC10aW1lem9uZSc7XG5pbXBvcnQge0dUU0xpYn0gZnJvbSAnLi4vLi4vdXRpbHMvZ3RzLmxpYic7XG5pbXBvcnQge0dUU30gZnJvbSAnLi4vLi4vbW9kZWwvR1RTJztcbmltcG9ydCB7RGF0YU1vZGVsfSBmcm9tICcuLi8uLi9tb2RlbC9kYXRhTW9kZWwnO1xuaW1wb3J0IGRlZXBFcXVhbCBmcm9tICdkZWVwLWVxdWFsJztcbmltcG9ydCB7U2l6ZSwgU2l6ZVNlcnZpY2V9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3Jlc2l6ZS5zZXJ2aWNlJztcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICcuLi8uLi91dGlscy9sb2dnZXInO1xuXG4vKipcbiAqXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3dhcnB2aWV3LXBsb3QnLFxuICB0ZW1wbGF0ZVVybDogJy4vd2FycC12aWV3LXBsb3QuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi93YXJwLXZpZXctcGxvdC5jb21wb25lbnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXG59KVxuZXhwb3J0IGNsYXNzIFdhcnBWaWV3UGxvdENvbXBvbmVudCBleHRlbmRzIFdhcnBWaWV3Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0IHtcblxuICBAVmlld0NoaWxkKCdtYWluUGxvdERpdicsIHtzdGF0aWM6IHRydWV9KSBtYWluUGxvdERpdjogRWxlbWVudFJlZjtcbiAgQFZpZXdDaGlsZCgndGltZUNsaXAnLCB7c3RhdGljOiB0cnVlfSkgdGltZUNsaXA6IFdhcnBWaWV3TW9kYWxDb21wb25lbnQ7XG4gIEBWaWV3Q2hpbGQoJ21vZGFsJywge3N0YXRpYzogdHJ1ZX0pIG1vZGFsOiBXYXJwVmlld01vZGFsQ29tcG9uZW50O1xuICBAVmlld0NoaWxkKCdjaGFydCcsIHtzdGF0aWM6IGZhbHNlfSkgY2hhcnQ6IFdhcnBWaWV3Q2hhcnRDb21wb25lbnQ7XG4gIEBWaWV3Q2hpbGQoJ2d0c1BvcHVwTW9kYWwnLCB7c3RhdGljOiBmYWxzZX0pIGd0c1BvcHVwTW9kYWw6IFdhcnBWaWV3R3RzUG9wdXBDb21wb25lbnQ7XG4gIEBWaWV3Q2hpbGQoJ2Fubm90YXRpb24nLCB7c3RhdGljOiBmYWxzZX0pIGFubm90YXRpb246IFdhcnBWaWV3QW5ub3RhdGlvbkNvbXBvbmVudDtcbiAgQFZpZXdDaGlsZCgnbWFwJywge3N0YXRpYzogZmFsc2V9KSBtYXA6IFdhcnBWaWV3TWFwQ29tcG9uZW50O1xuICBAVmlld0NoaWxkKCd0aW1lQ2xpcEVsZW1lbnQnLCB7c3RhdGljOiB0cnVlfSkgdGltZUNsaXBFbGVtZW50OiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCdHVFNUcmVlJywge3N0YXRpYzogdHJ1ZX0pIEdUU1RyZWU6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ2NvbnRyb2xzJywge3N0YXRpYzogdHJ1ZX0pIGNvbnRyb2xzOiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCdmaWx0ZXJJbnB1dCcsIHtzdGF0aWM6IHRydWV9KSBmaWx0ZXJJbnB1dDogRWxlbWVudFJlZjtcbiAgQFZpZXdDaGlsZCgndHpTZWxlY3RvcicsIHtzdGF0aWM6IGZhbHNlfSkgdHpTZWxlY3RvcjogRWxlbWVudFJlZjtcbiAgQFZpZXdDaGlsZCgnbGluZScsIHtzdGF0aWM6IGZhbHNlfSkgbGluZTogRWxlbWVudFJlZjtcbiAgQFZpZXdDaGlsZCgnbWFpbicsIHtzdGF0aWM6IGZhbHNlfSkgbWFpbjogRWxlbWVudFJlZjtcbiAgcHJpdmF0ZSBzaG93TGluZSA9IGZhbHNlO1xuICBwcml2YXRlIGxlZnQ6IG51bWJlcjtcblxuICBASW5wdXQoJ3R5cGUnKSBzZXQgdHlwZSh0eXBlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl90eXBlID0gdHlwZTtcbiAgICB0aGlzLmRyYXdDaGFydCgpO1xuICB9XG5cbiAgZ2V0IHR5cGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3R5cGU7XG4gIH1cblxuICBASW5wdXQoJ2d0c0ZpbHRlcicpIHNldCBndHNGaWx0ZXIoZ3RzRmlsdGVyKSB7XG4gICAgdGhpcy5fZ3RzRmlsdGVyID0gZ3RzRmlsdGVyO1xuICAgIHRoaXMuZHJhd0NoYXJ0KCk7XG4gIH1cblxuICBnZXQgZ3RzRmlsdGVyKCkge1xuICAgIHJldHVybiB0aGlzLl9ndHNGaWx0ZXI7XG4gIH1cblxuICBASW5wdXQoJ2lzQWxvbmUnKSBpc0Fsb25lID0gZmFsc2U7XG4gIEBJbnB1dCgnaW5pdGlhbENoYXJ0SGVpZ2h0JykgaW5pdGlhbENoYXJ0SGVpZ2h0ID0gNDAwO1xuICBASW5wdXQoJ2luaXRpYWxNYXBIZWlnaHQnKSBpbml0aWFsTWFwSGVpZ2h0ID0gNDAwO1xuICBAT3V0cHV0KCd3YXJwVmlld0NoYXJ0UmVzaXplJykgd2FycFZpZXdDaGFydFJlc2l6ZSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIF9vcHRpb25zOiBQYXJhbSA9IHtcbiAgICAuLi5uZXcgUGFyYW0oKSwgLi4ue1xuICAgICAgc2hvd0NvbnRyb2xzOiB0cnVlLFxuICAgICAgc2hvd0dUU1RyZWU6IHRydWUsXG4gICAgICBzaG93RG90czogdHJ1ZSxcbiAgICAgIHRpbWVab25lOiAnVVRDJyxcbiAgICAgIHRpbWVVbml0OiAndXMnLFxuICAgICAgdGltZU1vZGU6ICdkYXRlJyxcbiAgICAgIGJvdW5kczoge31cbiAgICB9XG4gIH07XG4gIF90b0hpZGU6IG51bWJlcltdID0gW107XG4gIHNob3dDaGFydCA9IHRydWU7XG4gIHNob3dNYXAgPSBmYWxzZTtcbiAgdGltZUNsaXBWYWx1ZSA9ICcnO1xuICBrYmRMYXN0S2V5UHJlc3NlZDogc3RyaW5nW10gPSBbXTtcbiAgd2FybmluZ01lc3NhZ2UgPSAnJztcbiAgbG9hZGluZyA9IGZhbHNlO1xuICBndHNJZExpc3Q6IG51bWJlcltdID0gW107XG5cbiAgcHJpdmF0ZSBrYmRDb3VudGVyID0gMDtcbiAgcHJpdmF0ZSBndHNGaWx0ZXJDb3VudCA9IDA7XG4gIHByaXZhdGUgZ3RzQnJvd3NlckluZGV4ID0gLTE7XG4gIHByaXZhdGUgX2d0c0ZpbHRlciA9ICd4JztcbiAgcHJpdmF0ZSBfdHlwZSA9ICdsaW5lJztcbiAgcHJpdmF0ZSBjaGFydEJvdW5kczogQ2hhcnRCb3VuZHMgPSB7XG4gICAgdHNtaW46IE51bWJlci5NQVhfVkFMVUUsXG4gICAgdHNtYXg6IE51bWJlci5NSU5fVkFMVUUsXG4gICAgbXNtYXg6ICcnLFxuICAgIG1zbWluOiAnJyxcbiAgICBtYXJnaW5MZWZ0OiAwXG4gIH07XG4gIC8vIGtleSBldmVudCBhcmUgdHJhcHBlZCBpbiBwbG90IGNvbXBvbmVudC5cbiAgLy8gaWYgb25lIG9mIHRoaXMga2V5IGlzIHByZXNzZWQsIGRlZmF1bHQgYWN0aW9uIGlzIHByZXZlbnRlZC5cbiAgcHJpdmF0ZSBwcmV2ZW50RGVmYXVsdEtleUxpc3Q6IHN0cmluZ1tdID0gWydFc2NhcGUnLCAnLyddO1xuICBwcml2YXRlIHByZXZlbnREZWZhdWx0S2V5TGlzdEluTW9kYWxzOiBzdHJpbmdbXSA9IFsnRXNjYXBlJywgJ0Fycm93VXAnLCAnQXJyb3dEb3duJywgJyAnLCAnLyddO1xuICBndHNMaXN0OiBEYXRhTW9kZWwgfCBHVFNbXSB8IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgZWw6IEVsZW1lbnRSZWYsXG4gICAgcHVibGljIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHVibGljIHNpemVTZXJ2aWNlOiBTaXplU2VydmljZSxcbiAgICBwdWJsaWMgbmdab25lOiBOZ1pvbmVcbiAgKSB7XG4gICAgc3VwZXIoZWwsIHJlbmRlcmVyLCBzaXplU2VydmljZSwgbmdab25lKTtcbiAgICB0aGlzLkxPRyA9IG5ldyBMb2dnZXIoV2FycFZpZXdQbG90Q29tcG9uZW50LCB0aGlzLl9kZWJ1Zyk7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLl9vcHRpb25zID0gdGhpcy5fb3B0aW9ucyB8fCB0aGlzLmRlZk9wdGlvbnM7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgdGhpcy5kcmF3Q2hhcnQodHJ1ZSk7XG4gICAgdGhpcy5yZXNpemVBcmVhKCk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdrZXlkb3duJywgWyckZXZlbnQnXSlcbiAgaGFuZGxlS2V5ZG93bihldjogS2V5Ym9hcmRFdmVudCkge1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnaGFuZGxlS2V5ZG93biddLCBldik7XG4gICAgaWYgKCF0aGlzLmlzQWxvbmUpIHtcbiAgICAgIHRoaXMuaGFuZGxlS2V5UHJlc3MoZXYpLnRoZW4oKCkgPT4ge1xuICAgICAgICAvLyBlbXB0eVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgc3RhdGVDaGFuZ2UoZXZlbnQ6IGFueSkge1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnc3RhdGVDaGFuZ2UnXSwgZXZlbnQpO1xuICAgIHN3aXRjaCAoZXZlbnQuaWQpIHtcbiAgICAgIGNhc2UgJ3RpbWVTd2l0Y2gnIDpcbiAgICAgICAgaWYgKGV2ZW50LnN0YXRlKSB7XG4gICAgICAgICAgdGhpcy5fb3B0aW9ucy50aW1lTW9kZSA9ICd0aW1lc3RhbXAnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX29wdGlvbnMudGltZU1vZGUgPSAnZGF0ZSc7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kcmF3Q2hhcnQoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd0eXBlU3dpdGNoJyA6XG4gICAgICAgIGlmIChldmVudC5zdGF0ZSkge1xuICAgICAgICAgIHRoaXMuX3R5cGUgPSAnc3RlcCc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fdHlwZSA9ICdsaW5lJztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRyYXdDaGFydCgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2NoYXJ0U3dpdGNoJyA6XG4gICAgICAgIHRoaXMuc2hvd0NoYXJ0ID0gZXZlbnQuc3RhdGU7XG4gICAgICAgIHRoaXMuZHJhd0NoYXJ0KCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbWFwU3dpdGNoJyA6XG4gICAgICAgIHRoaXMuc2hvd01hcCA9IGV2ZW50LnN0YXRlO1xuICAgICAgICBpZiAodGhpcy5zaG93TWFwKSB7XG4gICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMubWFwLnJlc2l6ZSgpKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBib3VuZHNEaWRDaGFuZ2UoZXZlbnQpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3VwZGF0ZUJvdW5kcyddLCBldmVudCk7XG4gICAgdGhpcy5fb3B0aW9ucy5ib3VuZHMgPSB0aGlzLl9vcHRpb25zLmJvdW5kcyB8fCB7fTtcbiAgICBpZiAodGhpcy5fb3B0aW9ucy5ib3VuZHMubWluRGF0ZSAhPT0gZXZlbnQuYm91bmRzLm1pbiAmJiB0aGlzLl9vcHRpb25zLmJvdW5kcy5tYXhEYXRlICE9PSBldmVudC5ib3VuZHMubWF4KSB7XG4gICAgICB0aGlzLl9vcHRpb25zLmJvdW5kcyA9IHRoaXMuX29wdGlvbnMuYm91bmRzIHx8IHt9O1xuICAgICAgdGhpcy5fb3B0aW9ucy5ib3VuZHMubWluRGF0ZSA9IGV2ZW50LmJvdW5kcy5taW47XG4gICAgICB0aGlzLl9vcHRpb25zLmJvdW5kcy5tYXhEYXRlID0gZXZlbnQuYm91bmRzLm1heDtcbiAgICAgIGlmIChldmVudC5zb3VyY2UgPT09ICdjaGFydCcpIHtcbiAgICAgICAgdGhpcy5hbm5vdGF0aW9uLnVwZGF0ZUJvdW5kcyhldmVudC5ib3VuZHMubWluLCBldmVudC5ib3VuZHMubWF4LCBldmVudC5ib3VuZHMubWFyZ2luTGVmdCk7XG4gICAgICB9IGVsc2UgaWYgKGV2ZW50LnNvdXJjZSA9PT0gJ2Fubm90YXRpb24nKSB7XG4gICAgICAgIHRoaXMuY2hhcnQudXBkYXRlQm91bmRzKGV2ZW50LmJvdW5kcy5taW4sIGV2ZW50LmJvdW5kcy5tYXgpO1xuICAgICAgfVxuICAgICAgdGhpcy5MT0cuZGVidWcoWyd1cGRhdGVCb3VuZHMnXSxcbiAgICAgICAgbW9tZW50LnR6KGV2ZW50LmJvdW5kcy5taW4sIHRoaXMuX29wdGlvbnMudGltZVpvbmUpLnRvRGF0ZSgpLFxuICAgICAgICBtb21lbnQudHooZXZlbnQuYm91bmRzLm1heCwgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSkudG9EYXRlKCkpO1xuICAgICAgdGhpcy5saW5lLm5hdGl2ZUVsZW1lbnQuc3R5bGUubGVmdCA9ICctMTAwcHgnO1xuICAgIH1cbiAgfVxuXG4gIG9uV2FycFZpZXdNb2RhbENsb3NlKCkge1xuICAgIHRoaXMubWFpblBsb3REaXYubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICB9XG5cbiAgd2FycFZpZXdTZWxlY3RlZEdUUyhldmVudCkge1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnd2FycFZpZXdTZWxlY3RlZEdUUyddLCBldmVudCk7XG4gICAgaWYgKCF0aGlzLl90b0hpZGUuZmluZChpID0+IHtcbiAgICAgIHJldHVybiBpID09PSBldmVudC5ndHMuaWQ7XG4gICAgfSkgJiYgIWV2ZW50LnNlbGVjdGVkKSB7IC8vIGlmIG5vdCBpbiB0b0hpZGUgYW5kIHN0YXRlIGZhbHNlLCBwdXQgaWQgaW4gdG9IaWRlXG4gICAgICB0aGlzLl90b0hpZGUucHVzaChldmVudC5ndHMuaWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoZXZlbnQuc2VsZWN0ZWQpIHsgLy8gaWYgaW4gdG9IaWRlIGFuZCBzdGF0ZSB0cnVlLCByZW1vdmUgaXQgZnJvbSB0b0hpZGVcbiAgICAgICAgdGhpcy5fdG9IaWRlID0gdGhpcy5fdG9IaWRlLmZpbHRlcihpID0+IHtcbiAgICAgICAgICByZXR1cm4gaSAhPT0gZXZlbnQuZ3RzLmlkO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5MT0cuZGVidWcoWyd3YXJwVmlld1NlbGVjdGVkR1RTJywgJ3RoaXMuX3RvSGlkZSddLCB0aGlzLl90b0hpZGUpO1xuICAgIHRoaXMubmdab25lLnJ1bigoKSA9PiB7XG4gICAgICB0aGlzLl90b0hpZGUgPSBbLi4udGhpcy5fdG9IaWRlXTtcbiAgICB9KTtcbiAgfVxuXG4gIGhhbmRsZU1vdXNlTW92ZShldnQ6IE1vdXNlRXZlbnQpIHtcbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICBpZiAodGhpcy5zaG93TGluZSAmJiB0aGlzLmxpbmUpIHtcbiAgICAgIHRoaXMubGluZS5uYXRpdmVFbGVtZW50LnN0eWxlLmxlZnQgPSBNYXRoLm1heChldnQucGFnZVggLSB0aGlzLmxlZnQsIDUwKSArICdweCc7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlTW91c2VFbnRlcihldnQ6IE1vdXNlRXZlbnQpIHtcbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLmxlZnQgPSB0aGlzLmxlZnQgfHwgdGhpcy5tYWluLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdDtcbiAgICB0aGlzLnNob3dMaW5lID0gdHJ1ZTtcbiAgICBpZiAodGhpcy5saW5lKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMubGluZS5uYXRpdmVFbGVtZW50LCAnZGlzcGxheScsICdibG9jaycpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZU1vdXNlT3V0KGV2dDogTW91c2VFdmVudCkge1xuICAgIC8vIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGlmICh0aGlzLmxpbmUpIHtcbiAgICAgIHRoaXMuc2hvd0xpbmUgPSBmYWxzZTtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5saW5lLm5hdGl2ZUVsZW1lbnQsICdsZWZ0JywgJy0xMDBweCcpO1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmxpbmUubmF0aXZlRWxlbWVudCwgJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZShvcHRpb25zLCByZWZyZXNoKTogdm9pZCB7XG4gICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgIGxldCBvcHRpb25DaGFuZ2VkID0gZmFsc2U7XG4gICAgICBPYmplY3Qua2V5cyhvcHRpb25zKS5mb3JFYWNoKG9wdCA9PiB7XG4gICAgICAgIGlmICh0aGlzLl9vcHRpb25zLmhhc093blByb3BlcnR5KG9wdCkpIHtcbiAgICAgICAgICBvcHRpb25DaGFuZ2VkID0gb3B0aW9uQ2hhbmdlZCB8fCAhZGVlcEVxdWFsKG9wdGlvbnNbb3B0XSwgdGhpcy5fb3B0aW9uc1tvcHRdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvcHRpb25DaGFuZ2VkID0gdHJ1ZTsgLy8gbmV3IHVua25vd24gb3B0aW9uXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgaWYgKHRoaXMuTE9HKSB7XG4gICAgICAgIHRoaXMuTE9HLmRlYnVnKFsnb25PcHRpb25zJywgJ29wdGlvbkNoYW5nZWQnXSwgb3B0aW9uQ2hhbmdlZCk7XG4gICAgICB9XG4gICAgICBpZiAob3B0aW9uQ2hhbmdlZCkge1xuICAgICAgICBpZiAodGhpcy5MT0cpIHtcbiAgICAgICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ29uT3B0aW9ucycsICdvcHRpb25zJ10sIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX29wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgICB0aGlzLmRyYXdDaGFydChmYWxzZSk7XG4gICAgICB9XG4gICAgICB0aGlzLmRyYXdDaGFydChyZWZyZXNoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kcmF3Q2hhcnQocmVmcmVzaCk7XG4gICAgfVxuICB9XG5cbiAgaW5wdXRUZXh0S2V5Ym9hcmRFdmVudHMoZTogS2V5Ym9hcmRFdmVudCkge1xuICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgaWYgKGUua2V5ID09PSAnRW50ZXInKSB7XG4gICAgICB0aGlzLmFwcGx5RmlsdGVyKCk7XG4gICAgfSBlbHNlIGlmIChlLmtleSA9PT0gJ0VzY2FwZScpIHtcbiAgICAgIHRoaXMucHVzaEtiZEV2ZW50KCdFc2NhcGUnKTtcbiAgICAgIHRoaXMubW9kYWwuY2xvc2UoKTtcbiAgICB9XG4gIH1cblxuICB0elNlbGVjdGVkKCkge1xuICAgIGNvbnN0IHRpbWVab25lID0gdGhpcy50elNlbGVjdG9yLm5hdGl2ZUVsZW1lbnQudmFsdWU7XG4gICAgdGhpcy5MT0cuZGVidWcoWyd0aW1lem9uZScsICd0enNlbGVjdCddLCB0aW1lWm9uZSk7XG4gICAgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSA9IHRpbWVab25lO1xuICAgIHRoaXMudHpTZWxlY3Rvci5uYXRpdmVFbGVtZW50LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCB0aW1lWm9uZSA9PT0gJ1VUQycgPyAnZGVmYXVsdHR6JyA6ICdjdXN0b210eicpO1xuICAgIHRoaXMuZHJhd0NoYXJ0KCk7XG4gIH1cblxuICBwdWJsaWMgZ2V0VGltZUNsaXAoKTogUHJvbWlzZTxDaGFydEJvdW5kcz4ge1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZ2V0VGltZUNsaXAnXSwgdGhpcy5jaGFydC5nZXRUaW1lQ2xpcCgpKTtcbiAgICByZXR1cm4gdGhpcy5jaGFydC5nZXRUaW1lQ2xpcCgpO1xuICB9XG5cbiAgcmVzaXplQ2hhcnQoZXZlbnQpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3Jlc2l6ZUNoYXJ0J10sIGV2ZW50KTtcbiAgICB0aGlzLnNpemVTZXJ2aWNlLmNoYW5nZShuZXcgU2l6ZSh0aGlzLndpZHRoLCBldmVudCkpO1xuICB9XG5cbiAgZHJhd0NoYXJ0KGZpcnN0RHJhdzogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgdGhpcy5MT0cuZGVidWcoWydkcmF3Q2hhcnRzJ10sIHRoaXMuX2RhdGEsIHRoaXMuX29wdGlvbnMpO1xuICAgIGlmICghdGhpcy5fZGF0YSB8fCAhdGhpcy5fZGF0YS5kYXRhIHx8IHRoaXMuX2RhdGEuZGF0YS5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMudGltZUNsaXApIHtcbiAgICAgIHRoaXMudGltZUNsaXAuY2xvc2UoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubW9kYWwpIHtcbiAgICAgIHRoaXMubW9kYWwuY2xvc2UoKTtcbiAgICB9XG4gICAgdGhpcy5MT0cuZGVidWcoWydQUHRzJ10sICdmaXJzdGRyYXcgJywgZmlyc3REcmF3KTtcbiAgICBpZiAoZmlyc3REcmF3KSB7IC8vIG9uIHRoZSBmaXJzdCBkcmF3LCB3ZSBjYW4gc2V0IHNvbWUgZGVmYXVsdCBvcHRpb25zLlxuICAgICAgLy8gYXV0b21hdGljYWxseSBzd2l0Y2ggdG8gdGltZXN0YW1wIG1vZGVcbiAgICAgIC8vIHdoZW4gdGhlIGZpcnN0IHRpY2sgYW5kIGxhc3QgdGljayBvZiBhbGwgdGhlIHNlcmllcyBhcmUgaW4gdGhlIGludGVydmFsIFstMTAwbXMgMTAwbXNdXG4gICAgICBjb25zdCB0c0xpbWl0ID0gMTAwICogR1RTTGliLmdldERpdmlkZXIodGhpcy5fb3B0aW9ucy50aW1lVW5pdCk7XG4gICAgICBjb25zdCBkYXRhTGlzdCA9IHRoaXMuX2RhdGEuZGF0YTtcbiAgICAgIGlmIChkYXRhTGlzdCkge1xuICAgICAgICBsZXQgZ3RzTGlzdCA9IEdUU0xpYi5mbGF0dGVuR3RzSWRBcnJheShkYXRhTGlzdCBhcyBhbnksIDApLnJlcztcbiAgICAgICAgZ3RzTGlzdCA9IEdUU0xpYi5mbGF0RGVlcChndHNMaXN0KTtcbiAgICAgICAgbGV0IHRpbWVzdGFtcE1vZGUgPSB0cnVlO1xuICAgICAgICBsZXQgdG90YWxEYXRhcG9pbnRzID0gMDtcbiAgICAgICAgZ3RzTGlzdC5mb3JFYWNoKGcgPT4ge1xuICAgICAgICAgIHRoaXMuZ3RzSWRMaXN0LnB1c2goZy5pZCk7IC8vIHVzZWZ1bGwgZm9yIGd0cyBicm93c2Ugc2hvcnRjdXRcbiAgICAgICAgICBpZiAoZy52Lmxlbmd0aCA+IDApIHsgLy8gaWYgZ3RzIG5vdCBlbXB0eVxuICAgICAgICAgICAgdGltZXN0YW1wTW9kZSA9IHRpbWVzdGFtcE1vZGUgJiYgKGcudlswXVswXSA+IC10c0xpbWl0ICYmIGcudlswXVswXSA8IHRzTGltaXQpO1xuICAgICAgICAgICAgdGltZXN0YW1wTW9kZSA9IHRpbWVzdGFtcE1vZGUgJiYgKGcudltnLnYubGVuZ3RoIC0gMV1bMF0gPiAtdHNMaW1pdCAmJiBnLnZbZy52Lmxlbmd0aCAtIDFdWzBdIDwgdHNMaW1pdCk7XG4gICAgICAgICAgICB0b3RhbERhdGFwb2ludHMgKz0gZy52Lmxlbmd0aDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodGltZXN0YW1wTW9kZSkge1xuICAgICAgICAgIHRoaXMuX29wdGlvbnMudGltZU1vZGUgPSAndGltZXN0YW1wJztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RyYXdDaGFydHMnLCAncGFyc2VkJywgJ3RpbWVzdGFtcE1vZGUnXSwgdGltZXN0YW1wTW9kZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuZ3RzTGlzdCA9IHRoaXMuX2RhdGE7XG4gICAgdGhpcy5fb3B0aW9ucyA9IHsuLi50aGlzLl9vcHRpb25zfTtcblxuICAgIHRoaXMuTE9HLmRlYnVnKFsnZHJhd0NoYXJ0cycsICdwYXJzZWQnXSwgdGhpcy5fZGF0YSwgdGhpcy5fb3B0aW9ucyk7XG4gICAgdGhpcy5yZXNpemVBcmVhKCk7XG4gIH1cblxuICBmb2N1cyhldmVudDogYW55KSB7XG4gICAgLy8gcmVhZCB0aGUgZmlyc3QgNCBsZXR0ZXJzIG9mIGlkIG9mIGFsbCBlbGVtZW50cyBpbiB0aGUgY2xpY2sgdHJlZVxuICAgIGNvbnN0IGlkTGlzdENsaWNrZWQgPSBldmVudC5wYXRoLm1hcChlbCA9PiAoZWwuaWQgfHwgJycpLnNsaWNlKDAsIDQpKTtcbiAgICAvLyBpZiBub3QgYWxvbmUgb24gdGhlIHBhZ2UsIGFuZCBjbGljayBpcyBub3Qgb24gdGhlIHRpbWV6b25lIHNlbGVjdG9yIGFuZCBub3Qgb24gdGhlIG1hcCwgZm9yY2UgZm9jdXMuXG4gICAgaWYgKCF0aGlzLmlzQWxvbmUgJiYgaWRMaXN0Q2xpY2tlZC5pbmRleE9mKCd0elNlJykgPCAwICYmIGlkTGlzdENsaWNrZWQuaW5kZXhPZignbWFwLScpIDwgMCkge1xuICAgICAgdGhpcy5tYWluUGxvdERpdi5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgfSAvLyBwcmV2ZW50IHN0ZWFsaW5nIGZvY3VzIG9mIHRoZSB0aW1lem9uZSBzZWxlY3Rvci5cbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgaGFuZGxlS2V5UHJlc3MoZXY6IEtleWJvYXJkRXZlbnQpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2hhbmRsZUtleVByZXNzJ10sIGV2KTtcbiAgICBpZiAodGhpcy5wcmV2ZW50RGVmYXVsdEtleUxpc3QuaW5kZXhPZihldi5rZXkpID49IDApIHtcbiAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICAgIGlmIChhd2FpdCB0aGlzLnRpbWVDbGlwLmlzT3BlbmVkKCkgfHwgYXdhaXQgdGhpcy5tb2RhbC5pc09wZW5lZCgpIHx8IGF3YWl0IHRoaXMuZ3RzUG9wdXBNb2RhbC5pc09wZW5lZCgpKSB7XG4gICAgICBpZiAodGhpcy5wcmV2ZW50RGVmYXVsdEtleUxpc3RJbk1vZGFscy5pbmRleE9mKGV2LmtleSkgPj0gMCkge1xuICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZXYua2V5ID09PSAnLycpIHtcbiAgICAgIHRoaXMubW9kYWwub3BlbigpO1xuICAgICAgdGhpcy5maWx0ZXJJbnB1dC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICB0aGlzLmZpbHRlcklucHV0Lm5hdGl2ZUVsZW1lbnQuc2VsZWN0KCk7XG4gICAgfSBlbHNlIGlmIChldi5rZXkgPT09ICd0Jykge1xuICAgICAgdGhpcy5jaGFydC5nZXRUaW1lQ2xpcCgpLnRoZW4odGMgPT4ge1xuICAgICAgICB0aGlzLnRpbWVDbGlwVmFsdWUgPSBgPHA+a2VlcCBkYXRhIGJldHdlZW5cbiAgICAgICAgICAke3RoaXMuX29wdGlvbnMudGltZU1vZGUgPT09ICd0aW1lc3RhbXAnID8gdGMudHNtaW4gOiBtb21lbnQudHoodGMudHNtaW4sIHRoaXMuX29wdGlvbnMudGltZVpvbmUpLnRvTG9jYWxlU3RyaW5nKCl9IGFuZFxuICAgICAgICAgICR7dGhpcy5fb3B0aW9ucy50aW1lTW9kZSA9PT0gJ3RpbWVzdGFtcCcgPyB0Yy50c21heCA6IG1vbWVudC50eih0Yy50c21heCwgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSkudG9Mb2NhbGVTdHJpbmcoKX1cbiAgICAgICAgICAke3RoaXMuX29wdGlvbnMudGltZVVuaXQgIT09ICd1cycgPyAnIChmb3IgYSAnICsgdGhpcy5fb3B0aW9ucy50aW1lVW5pdCArICcgcGxhdGZvcm0pJyA6ICcnfTwvcD5cbiAgICAgICAgICA8cHJlPjxjb2RlPiR7TWF0aC5yb3VuZCh0Yy50c21heCl9ICR7TWF0aC5yb3VuZCh0Yy50c21heCAtIHRjLnRzbWluKX0gVElNRUNMSVA8L2NvZGU+PC9wcmU+YDtcbiAgICAgICAgdGhpcy50aW1lQ2xpcC5vcGVuKCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKGV2LmtleSA9PT0gJ2InIHx8IGV2LmtleSA9PT0gJ0InKSB7IC8vIGJyb3dzZSBhbW9uZyBhbGwgZ3RzXG4gICAgICBpZiAodGhpcy5ndHNCcm93c2VySW5kZXggPCAwKSB7XG4gICAgICAgIHRoaXMuZ3RzQnJvd3NlckluZGV4ID0gMDtcbiAgICAgIH1cbiAgICAgIGlmIChldi5rZXkgPT09ICdiJykgeyAvLyBpbmNyZW1lbnQgaW5kZXhcbiAgICAgICAgdGhpcy5ndHNCcm93c2VySW5kZXgrKztcbiAgICAgICAgaWYgKHRoaXMuZ3RzQnJvd3NlckluZGV4ID09PSB0aGlzLmd0c0lkTGlzdC5sZW5ndGgpIHtcbiAgICAgICAgICB0aGlzLmd0c0Jyb3dzZXJJbmRleCA9IDA7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7IC8vIGRlY3JlbWVudCBpbmRleFxuICAgICAgICB0aGlzLmd0c0Jyb3dzZXJJbmRleC0tO1xuICAgICAgICBpZiAodGhpcy5ndHNCcm93c2VySW5kZXggPCAwKSB7XG4gICAgICAgICAgdGhpcy5ndHNCcm93c2VySW5kZXggPSB0aGlzLmd0c0lkTGlzdC5sZW5ndGggLSAxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLl90b0hpZGUgPSB0aGlzLmd0c0lkTGlzdC5maWx0ZXIodiA9PiB2ICE9PSB0aGlzLmd0c0lkTGlzdFt0aGlzLmd0c0Jyb3dzZXJJbmRleF0pOyAvLyBoaWRlIGFsbCBidXQgb25lXG4gICAgfSBlbHNlIGlmIChldi5rZXkgPT09ICduJykge1xuICAgICAgdGhpcy5fdG9IaWRlID0gWy4uLnRoaXMuZ3RzSWRMaXN0XTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKGV2LmtleSA9PT0gJ2EnKSB7XG4gICAgICB0aGlzLl90b0hpZGUgPSBbXTtcbiAgICB9IGVsc2UgaWYgKGV2LmtleSA9PT0gJ0VzY2FwZScpIHtcbiAgICAgIHRoaXMudGltZUNsaXAuaXNPcGVuZWQoKS50aGVuKHIgPT4ge1xuICAgICAgICBpZiAocikge1xuICAgICAgICAgIHRoaXMudGltZUNsaXAuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLm1vZGFsLmlzT3BlbmVkKCkudGhlbihyID0+IHtcbiAgICAgICAgaWYgKHIpIHtcbiAgICAgICAgICB0aGlzLm1vZGFsLmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy5ndHNQb3B1cE1vZGFsLmlzT3BlbmVkKCkudGhlbihyID0+IHtcbiAgICAgICAgaWYgKHIpIHtcbiAgICAgICAgICB0aGlzLmd0c1BvcHVwTW9kYWwuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucHVzaEtiZEV2ZW50KGV2LmtleSk7XG4gICAgfVxuICAgIHRoaXMuTE9HLmRlYnVnKFsnaGFuZGxlS2V5UHJlc3MnLCAndGhpcy5ndHNJZExpc3QnXSwgdGhpcy5fdG9IaWRlLCB0aGlzLmd0c0Jyb3dzZXJJbmRleCk7XG4gIH1cblxuICBhcHBseUZpbHRlcigpIHtcbiAgICB0aGlzLmd0c0ZpbHRlckNvdW50Kys7XG4gICAgdGhpcy5fZ3RzRmlsdGVyID0gdGhpcy5ndHNGaWx0ZXJDb3VudC50b1N0cmluZygpLnNsaWNlKDAsIDEpICsgdGhpcy5maWx0ZXJJbnB1dC5uYXRpdmVFbGVtZW50LnZhbHVlO1xuICAgIHRoaXMubW9kYWwuY2xvc2UoKTtcbiAgfVxuXG4gIHByaXZhdGUgcHVzaEtiZEV2ZW50KGtleTogc3RyaW5nKSB7XG4gICAgdGhpcy5rYmRDb3VudGVyKys7XG4gICAgdGhpcy5rYmRMYXN0S2V5UHJlc3NlZCA9IFtrZXksIHRoaXMua2JkQ291bnRlci50b1N0cmluZygpXTtcbiAgfVxuXG4gIGdldFRaKCkge1xuICAgIHJldHVybiBtb21lbnQudHoubmFtZXMoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBjb252ZXJ0KGRhdGE6IERhdGFNb2RlbCk6IGFueVtdIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBvbkNoYXJ0RHJhdygkZXZlbnQ6IGFueSkge1xuICAgIGlmIChcbiAgICAgIHRoaXMuY2hhcnRCb3VuZHNcbiAgICAgICYmICRldmVudFxuICAgICAgJiYgdGhpcy5jaGFydEJvdW5kcy50c21pbiAhPT0gTWF0aC5taW4odGhpcy5jaGFydEJvdW5kcy50c21pbiwgJGV2ZW50LnRzbWluKVxuICAgICAgJiYgdGhpcy5jaGFydEJvdW5kcy50c21heCAhPT0gTWF0aC5tYXgodGhpcy5jaGFydEJvdW5kcy50c21heCwgJGV2ZW50LnRzbWF4KVxuICAgICkge1xuICAgICAgdGhpcy5jaGFydEJvdW5kcy50c21pbiA9IE1hdGgubWluKHRoaXMuY2hhcnRCb3VuZHMudHNtaW4sICRldmVudC50c21pbik7XG4gICAgICB0aGlzLmNoYXJ0Qm91bmRzLnRzbWF4ID0gTWF0aC5tYXgodGhpcy5jaGFydEJvdW5kcy50c21heCwgJGV2ZW50LnRzbWF4KTtcbiAgICAgIHRoaXMuYW5ub3RhdGlvbi5zZXRSZWFsQm91bmRzKHRoaXMuY2hhcnRCb3VuZHMpO1xuICAgICAgdGhpcy5jaGFydC5zZXRSZWFsQm91bmRzKHRoaXMuY2hhcnRCb3VuZHMpO1xuICAgICAgdGhpcy5jaGFydERyYXcuZW1pdCgpO1xuICAgICAgdGhpcy5MT0cuZGVidWcoWydvbkNoYXJ0RHJhdycsICd0aGlzLmNoYXJ0Qm91bmRzJ10sIHRoaXMuY2hhcnRCb3VuZHMsICRldmVudCk7XG4gICAgfVxuICAgIHRoaXMuY2hhcnREcmF3LmVtaXQoJGV2ZW50KTtcbiAgfVxuXG4gIHByaXZhdGUgcmVzaXplQXJlYSgpIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGxldCBoID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcbiAgICAgIGlmIChoID4gMCkge1xuICAgICAgICBpZiAoISF0aGlzLkdUU1RyZWUpIHtcbiAgICAgICAgICBoIC09IHRoaXMuR1RTVHJlZS5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoISF0aGlzLmNvbnRyb2xzKSB7XG4gICAgICAgICAgaCAtPSB0aGlzLmNvbnRyb2xzLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW5pdGlhbENoYXJ0SGVpZ2h0ID0gaDtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIl19