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
var WarpViewPlotComponent = /** @class */ (function (_super) {
    tslib_1.__extends(WarpViewPlotComponent, _super);
    function WarpViewPlotComponent(el, renderer, sizeService, ngZone) {
        var _this = _super.call(this, el, renderer, sizeService, ngZone) || this;
        _this.el = el;
        _this.renderer = renderer;
        _this.sizeService = sizeService;
        _this.ngZone = ngZone;
        _this.showLine = false;
        _this.isAlone = false;
        _this.initialChartHeight = 400;
        _this.initialMapHeight = 400;
        _this.warpViewChartResize = new EventEmitter();
        _this._options = tslib_1.__assign({}, new Param(), {
            showControls: true,
            showGTSTree: true,
            showDots: true,
            timeZone: 'UTC',
            timeUnit: 'us',
            timeMode: 'date',
            bounds: {}
        });
        _this._toHide = [];
        _this.showChart = true;
        _this.showMap = false;
        _this.timeClipValue = '';
        _this.kbdLastKeyPressed = [];
        _this.warningMessage = '';
        _this.loading = false;
        _this.gtsIdList = [];
        _this.kbdCounter = 0;
        _this.gtsFilterCount = 0;
        _this.gtsBrowserIndex = -1;
        _this._gtsFilter = 'x';
        _this._type = 'line';
        _this.chartBounds = {
            tsmin: Number.MAX_VALUE,
            tsmax: Number.MIN_VALUE,
            msmax: '',
            msmin: '',
            marginLeft: 0
        };
        // key event are trapped in plot component.
        // if one of this key is pressed, default action is prevented.
        _this.preventDefaultKeyList = ['Escape', '/'];
        _this.preventDefaultKeyListInModals = ['Escape', 'ArrowUp', 'ArrowDown', ' ', '/'];
        _this.LOG = new Logger(WarpViewPlotComponent, _this._debug);
        return _this;
    }
    Object.defineProperty(WarpViewPlotComponent.prototype, "type", {
        get: /**
         * @return {?}
         */
        function () {
            return this._type;
        },
        set: /**
         * @param {?} type
         * @return {?}
         */
        function (type) {
            this._type = type;
            this.drawChart();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarpViewPlotComponent.prototype, "gtsFilter", {
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
            this.drawChart();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    WarpViewPlotComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this._options = this._options || this.defOptions;
    };
    /**
     * @return {?}
     */
    WarpViewPlotComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        this.drawChart(true);
        this.resizeArea();
    };
    /**
     * @param {?} ev
     * @return {?}
     */
    WarpViewPlotComponent.prototype.handleKeydown = /**
     * @param {?} ev
     * @return {?}
     */
    function (ev) {
        this.LOG.debug(['handleKeydown'], ev);
        if (!this.isAlone) {
            this.handleKeyPress(ev).then((/**
             * @return {?}
             */
            function () {
                // empty
            }));
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    WarpViewPlotComponent.prototype.stateChange = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        var _this = this;
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
                    function () { return _this.map.resize(); }));
                }
                break;
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    WarpViewPlotComponent.prototype.boundsDidChange = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
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
    };
    /**
     * @return {?}
     */
    WarpViewPlotComponent.prototype.onWarpViewModalClose = /**
     * @return {?}
     */
    function () {
        this.mainPlotDiv.nativeElement.focus();
    };
    /**
     * @param {?} event
     * @return {?}
     */
    WarpViewPlotComponent.prototype.warpViewSelectedGTS = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        var _this = this;
        this.LOG.debug(['warpViewSelectedGTS'], event);
        if (!this._toHide.find((/**
         * @param {?} i
         * @return {?}
         */
        function (i) {
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
                function (i) {
                    return i !== event.gts.id;
                }));
            }
        }
        this.LOG.debug(['warpViewSelectedGTS', 'this._toHide'], this._toHide);
        this.ngZone.run((/**
         * @return {?}
         */
        function () {
            _this._toHide = tslib_1.__spread(_this._toHide);
        }));
    };
    /**
     * @param {?} evt
     * @return {?}
     */
    WarpViewPlotComponent.prototype.handleMouseMove = /**
     * @param {?} evt
     * @return {?}
     */
    function (evt) {
        evt.preventDefault();
        if (this.showLine && this.line) {
            this.line.nativeElement.style.left = Math.max(evt.pageX - this.left, 50) + 'px';
        }
    };
    /**
     * @param {?} evt
     * @return {?}
     */
    WarpViewPlotComponent.prototype.handleMouseEnter = /**
     * @param {?} evt
     * @return {?}
     */
    function (evt) {
        evt.preventDefault();
        this.left = this.left || this.main.nativeElement.getBoundingClientRect().left;
        this.showLine = true;
        if (this.line) {
            this.renderer.setStyle(this.line.nativeElement, 'display', 'block');
        }
    };
    /**
     * @param {?} evt
     * @return {?}
     */
    WarpViewPlotComponent.prototype.handleMouseOut = /**
     * @param {?} evt
     * @return {?}
     */
    function (evt) {
        // evt.preventDefault();
        if (this.line) {
            this.showLine = false;
            this.renderer.setStyle(this.line.nativeElement, 'left', '-100px');
            this.renderer.setStyle(this.line.nativeElement, 'display', 'none');
        }
    };
    /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    WarpViewPlotComponent.prototype.update = /**
     * @param {?} options
     * @param {?} refresh
     * @return {?}
     */
    function (options, refresh) {
        var _this = this;
        if (options) {
            /** @type {?} */
            var optionChanged_1 = false;
            Object.keys(options).forEach((/**
             * @param {?} opt
             * @return {?}
             */
            function (opt) {
                if (_this._options.hasOwnProperty(opt)) {
                    optionChanged_1 = optionChanged_1 || !deepEqual(options[opt], _this._options[opt]);
                }
                else {
                    optionChanged_1 = true; // new unknown option
                }
            }));
            if (this.LOG) {
                this.LOG.debug(['onOptions', 'optionChanged'], optionChanged_1);
            }
            if (optionChanged_1) {
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
    };
    /**
     * @param {?} e
     * @return {?}
     */
    WarpViewPlotComponent.prototype.inputTextKeyboardEvents = /**
     * @param {?} e
     * @return {?}
     */
    function (e) {
        e.stopImmediatePropagation();
        if (e.key === 'Enter') {
            this.applyFilter();
        }
        else if (e.key === 'Escape') {
            this.pushKbdEvent('Escape');
            this.modal.close();
        }
    };
    /**
     * @return {?}
     */
    WarpViewPlotComponent.prototype.tzSelected = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var timeZone = this.tzSelector.nativeElement.value;
        this.LOG.debug(['timezone', 'tzselect'], timeZone);
        this._options.timeZone = timeZone;
        this.tzSelector.nativeElement.setAttribute('class', timeZone === 'UTC' ? 'defaulttz' : 'customtz');
        this.drawChart();
    };
    /**
     * @return {?}
     */
    WarpViewPlotComponent.prototype.getTimeClip = /**
     * @return {?}
     */
    function () {
        this.LOG.debug(['getTimeClip'], this.chart.getTimeClip());
        return this.chart.getTimeClip();
    };
    /**
     * @param {?} event
     * @return {?}
     */
    WarpViewPlotComponent.prototype.resizeChart = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.LOG.debug(['resizeChart'], event);
        this.sizeService.change(new Size(this.width, event));
    };
    /**
     * @param {?=} firstDraw
     * @return {?}
     */
    WarpViewPlotComponent.prototype.drawChart = /**
     * @param {?=} firstDraw
     * @return {?}
     */
    function (firstDraw) {
        var _this = this;
        if (firstDraw === void 0) { firstDraw = false; }
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
            var tsLimit_1 = 100 * GTSLib.getDivider(this._options.timeUnit);
            /** @type {?} */
            var dataList = this._data.data;
            if (dataList) {
                /** @type {?} */
                var gtsList = GTSLib.flattenGtsIdArray((/** @type {?} */ (dataList)), 0).res;
                gtsList = GTSLib.flatDeep(gtsList);
                /** @type {?} */
                var timestampMode_1 = true;
                /** @type {?} */
                var totalDatapoints_1 = 0;
                gtsList.forEach((/**
                 * @param {?} g
                 * @return {?}
                 */
                function (g) {
                    _this.gtsIdList.push(g.id); // usefull for gts browse shortcut
                    if (g.v.length > 0) { // if gts not empty
                        timestampMode_1 = timestampMode_1 && (g.v[0][0] > -tsLimit_1 && g.v[0][0] < tsLimit_1);
                        timestampMode_1 = timestampMode_1 && (g.v[g.v.length - 1][0] > -tsLimit_1 && g.v[g.v.length - 1][0] < tsLimit_1);
                        totalDatapoints_1 += g.v.length;
                    }
                }));
                if (timestampMode_1) {
                    this._options.timeMode = 'timestamp';
                }
                this.LOG.debug(['drawCharts', 'parsed', 'timestampMode'], timestampMode_1);
            }
        }
        this.gtsList = this._data;
        this._options = tslib_1.__assign({}, this._options);
        this.LOG.debug(['drawCharts', 'parsed'], this._data, this._options);
        this.resizeArea();
    };
    /**
     * @param {?} event
     * @return {?}
     */
    WarpViewPlotComponent.prototype.focus = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        // read the first 4 letters of id of all elements in the click tree
        /** @type {?} */
        var idListClicked = event.path.map((/**
         * @param {?} el
         * @return {?}
         */
        function (el) { return (el.id || '').slice(0, 4); }));
        // if not alone on the page, and click is not on the timezone selector and not on the map, force focus.
        if (!this.isAlone && idListClicked.indexOf('tzSe') < 0 && idListClicked.indexOf('map-') < 0) {
            this.mainPlotDiv.nativeElement.focus();
        } // prevent stealing focus of the timezone selector.
    };
    /**
     * @private
     * @param {?} ev
     * @return {?}
     */
    WarpViewPlotComponent.prototype.handleKeyPress = /**
     * @private
     * @param {?} ev
     * @return {?}
     */
    function (ev) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, _b;
            var _this = this;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.LOG.debug(['handleKeyPress'], ev);
                        if (this.preventDefaultKeyList.indexOf(ev.key) >= 0) {
                            ev.preventDefault();
                        }
                        return [4 /*yield*/, this.timeClip.isOpened()];
                    case 1:
                        _b = (_c.sent());
                        if (_b) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.modal.isOpened()];
                    case 2:
                        _b = (_c.sent());
                        _c.label = 3;
                    case 3:
                        _a = _b;
                        if (_a) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.gtsPopupModal.isOpened()];
                    case 4:
                        _a = (_c.sent());
                        _c.label = 5;
                    case 5:
                        if (_a) {
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
                            function (tc) {
                                _this.timeClipValue = "<p>keep data between\n          " + (_this._options.timeMode === 'timestamp' ? tc.tsmin : moment.tz(tc.tsmin, _this._options.timeZone).toLocaleString()) + " and\n          " + (_this._options.timeMode === 'timestamp' ? tc.tsmax : moment.tz(tc.tsmax, _this._options.timeZone).toLocaleString()) + "\n          " + (_this._options.timeUnit !== 'us' ? ' (for a ' + _this._options.timeUnit + ' platform)' : '') + "</p>\n          <pre><code>" + Math.round(tc.tsmax) + " " + Math.round(tc.tsmax - tc.tsmin) + " TIMECLIP</code></pre>";
                                _this.timeClip.open();
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
                            function (v) { return v !== _this.gtsIdList[_this.gtsBrowserIndex]; })); // hide all but one
                        }
                        else if (ev.key === 'n') {
                            this._toHide = tslib_1.__spread(this.gtsIdList);
                            return [2 /*return*/, false];
                        }
                        else if (ev.key === 'a') {
                            this._toHide = [];
                        }
                        else if (ev.key === 'Escape') {
                            this.timeClip.isOpened().then((/**
                             * @param {?} r
                             * @return {?}
                             */
                            function (r) {
                                if (r) {
                                    _this.timeClip.close();
                                }
                            }));
                            this.modal.isOpened().then((/**
                             * @param {?} r
                             * @return {?}
                             */
                            function (r) {
                                if (r) {
                                    _this.modal.close();
                                }
                            }));
                            this.gtsPopupModal.isOpened().then((/**
                             * @param {?} r
                             * @return {?}
                             */
                            function (r) {
                                if (r) {
                                    _this.gtsPopupModal.close();
                                }
                            }));
                        }
                        else {
                            this.pushKbdEvent(ev.key);
                        }
                        this.LOG.debug(['handleKeyPress', 'this.gtsIdList'], this._toHide, this.gtsBrowserIndex);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @return {?}
     */
    WarpViewPlotComponent.prototype.applyFilter = /**
     * @return {?}
     */
    function () {
        this.gtsFilterCount++;
        this._gtsFilter = this.gtsFilterCount.toString().slice(0, 1) + this.filterInput.nativeElement.value;
        this.modal.close();
    };
    /**
     * @private
     * @param {?} key
     * @return {?}
     */
    WarpViewPlotComponent.prototype.pushKbdEvent = /**
     * @private
     * @param {?} key
     * @return {?}
     */
    function (key) {
        this.kbdCounter++;
        this.kbdLastKeyPressed = [key, this.kbdCounter.toString()];
    };
    /**
     * @return {?}
     */
    WarpViewPlotComponent.prototype.getTZ = /**
     * @return {?}
     */
    function () {
        return moment.tz.names();
    };
    /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    WarpViewPlotComponent.prototype.convert = /**
     * @protected
     * @param {?} data
     * @return {?}
     */
    function (data) {
        return [];
    };
    /**
     * @param {?} $event
     * @return {?}
     */
    WarpViewPlotComponent.prototype.onChartDraw = /**
     * @param {?} $event
     * @return {?}
     */
    function ($event) {
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
    };
    /**
     * @private
     * @return {?}
     */
    WarpViewPlotComponent.prototype.resizeArea = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        setTimeout((/**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var h = _this.el.nativeElement.getBoundingClientRect().height;
            if (h > 0) {
                if (!!_this.GTSTree) {
                    h -= _this.GTSTree.nativeElement.getBoundingClientRect().height;
                }
                if (!!_this.controls) {
                    h -= _this.controls.nativeElement.getBoundingClientRect().height;
                }
                _this.initialChartHeight = h;
            }
        }));
    };
    WarpViewPlotComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-plot',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div #mainPlotDiv tabindex=\"0\" (click)=\"focus($event)\" id=\"focusablePlotDiv\">\n  <warpview-modal [kbdLastKeyPressed]=\"kbdLastKeyPressed\" modalTitle=\"TimeClip\" #timeClip\n                  (warpViewModalClose)=\"onWarpViewModalClose()\"\n  >\n    <div #timeClipElement [innerHTML]=\"timeClipValue\"></div>\n  </warpview-modal>\n  <warpview-modal [kbdLastKeyPressed]=\"kbdLastKeyPressed\" modalTitle=\"GTS Filter\" #modal\n                  (warpViewModalClose)=\"onWarpViewModalClose()\"\n  >\n    <label for=\"filterInput\">Enter a regular expression to filter GTS.</label>\n    <br />\n    <input tabindex=\"1\" type=\"text\" (keypress)=\"inputTextKeyboardEvents($event)\" #filterInput id=\"filterInput\"\n           (keydown)=\"inputTextKeyboardEvents($event)\" (keyup)=\"inputTextKeyboardEvents($event)\"\n           [value]=\"gtsFilter.slice(1)\"/>\n    <button (click)=\"applyFilter()\" [innerHTML]=\"_options.popupButtonValidateLabel || 'Apply'\"\n            class=\"{{_options.popupButtonValidateClass}}\" tabindex=\"2\"\n            type=\"button\">\n    </button>\n  </warpview-modal>\n  <warpview-gts-popup [maxToShow]=\"5\" [hiddenData]=\"_toHide\" [gtsList]=\"gtsList\"\n                      [kbdLastKeyPressed]=\"kbdLastKeyPressed\"\n                      [options]=\"_options\" [debug]=\"debug\"\n                      (warpViewModalClose)=\"onWarpViewModalClose()\"\n                      (warpViewSelectedGTS)=\"warpViewSelectedGTS($event)\"\n                      #gtsPopupModal></warpview-gts-popup>\n  <div class=\"inline\" *ngIf=\"_options.showControls\" #controls>\n    <warpview-toggle id=\"timeSwitch\" text1=\"Date\" text2=\"Timestamp\"\n                     (stateChange)=\"stateChange($event)\"\n                     [checked]=\"_options.timeMode === 'timestamp'\"></warpview-toggle>\n    <warpview-toggle id=\"typeSwitch\" text1=\"Line\" text2=\"Step\"\n                     (stateChange)=\"stateChange($event)\"></warpview-toggle>\n    <warpview-toggle id=\"chartSwitch\" text1=\"Hide chart\" text2=\"Display chart\"\n                     (stateChange)=\"stateChange($event)\"\n                     [checked]=\"showChart\"></warpview-toggle>\n    <warpview-toggle id=\"mapSwitch\" text1=\"Hide map\" text2=\"Display map\"\n                     (stateChange)=\"stateChange($event)\" [checked]=\"showMap\"></warpview-toggle>\n    <div class=\"tzcontainer\">\n      <label for=\"tzSelector\"></label>\n      <select id=\"tzSelector\" class=\"defaulttz\" #tzSelector (change)=\"tzSelected()\">\n        <option *ngFor=\"let z of getTZ()\" [value]=\"z\" [selected]=\"z === 'UTC'\"\n                [ngClass]=\"{'defaulttz' :z === 'UTC','customtz': z !== 'UTC'}\">{{z}}</option>\n      </select>\n    </div>\n  </div>\n  <div *ngIf=\"warningMessage\" class=\"warningMessage\">{{warningMessage}}</div>\n  <warpview-gts-tree\n    *ngIf=\"_options.showGTSTree\"\n    [data]=\"gtsList\" id=\"tree\" [gtsFilter]=\"gtsFilter\" [debug]=\"debug\" #GTSTree\n    (warpViewSelectedGTS)=\"warpViewSelectedGTS($event)\"\n    [hiddenData]=\"_toHide\" [options]=\"_options\"\n    [kbdLastKeyPressed]=\"kbdLastKeyPressed\"\n  ></warpview-gts-tree>\n  <div *ngIf=\"showChart\" #main class=\"main-container\"\n       (mouseleave)=\"handleMouseOut($event)\"\n       (mousemove)=\"handleMouseMove($event)\"\n       (mouseenter)=\"handleMouseEnter($event)\">\n    <div class=\"bar\" #line></div>\n    <div class=\"annotation\">\n      <warpview-annotation #annotation\n                           [data]=\"gtsList\" [responsive]=\"true\"\n                           (boundsDidChange)=\"boundsDidChange($event)\"\n                           (chartDraw)=\"onChartDraw($event)\"\n                           [showLegend]='showLegend' [debug]=\"debug\" [standalone]=\"false\"\n                           [hiddenData]=\"_toHide\" [options]=\"_options\"\n      ></warpview-annotation>\n    </div>\n    <warpview-resize minHeight=\"100\" [initialHeight]=\"initialChartHeight\" [debug]=\"debug\"\n                     (resize)=\"resizeChart($event)\"\n    >\n      <warpview-chart [responsive]=\"true\" [standalone]=\"false\" [data]=\"gtsList\"\n                      [showLegend]=\"showLegend\"\n                      (boundsDidChange)=\"boundsDidChange($event)\"\n                      (chartDraw)=\"onChartDraw($event)\"\n                      #chart [debug]=\"debug\" [hiddenData]=\"_toHide\" [type]=\"type\" [options]=\"_options\"\n      ></warpview-chart>\n    </warpview-resize>\n  </div>\n  <warpview-resize *ngIf=\"showMap\" minHeight=\"100\" [initialHeight]=\"initialMapHeight\" [debug]=\"debug\">\n    <div class=\"map-container\">\n      <warpview-map [options]=\"_options\" #map [data]=\"gtsList\" [debug]=\"debug\" [responsive]=\"true\"\n                    [hiddenData]=\"_toHide\"\n      ></warpview-map>\n    </div>\n  </warpview-resize>\n</div>\n",
                    encapsulation: ViewEncapsulation.None,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host,warp-view-plot,warpview-plot{position:relative;height:100%}:host .main-container,warp-view-plot .main-container,warpview-plot .main-container{position:relative}:host .map-container,warp-view-plot .map-container,warpview-plot .map-container{height:100%;width:100%;margin-right:20px;position:relative}:host .bar,warp-view-plot .bar,warpview-plot .bar{width:1px;left:-100px;position:absolute;background-color:transparent;-webkit-backface-visibility:hidden;backface-visibility:hidden;top:0;bottom:55px;overflow:hidden;display:none;z-index:0;pointer-events:none;border-left:dashed 2px var(--warp-view-bar-color)}:host .inline,warp-view-plot .inline,warpview-plot .inline{display:-webkit-inline-box;display:inline-flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;flex-direction:row;flex-wrap:wrap;-webkit-box-pack:space-evenly;justify-content:space-evenly;-webkit-box-align:stretch;align-items:stretch;width:100%}:host label,warp-view-plot label,warpview-plot label{display:inline-block}:host input,warp-view-plot input,warpview-plot input{display:block;width:calc(100% - 20px);padding:5px;font-size:1rem;font-weight:400;line-height:1.5}:host .annotation,warp-view-plot .annotation,warpview-plot .annotation{max-width:100%;padding-top:20px;margin-bottom:0}:host #focusablePlotDiv:focus,warp-view-plot #focusablePlotDiv:focus,warpview-plot #focusablePlotDiv:focus{outline:0}:host #tzSelector,warp-view-plot #tzSelector,warpview-plot #tzSelector{height:var(--warp-view-switch-height);border-radius:var(--warp-view-switch-radius);padding-left:calc(var(--warp-view-switch-radius)/ 2);padding-right:5px;box-shadow:inset 0 1px 2px rgba(0,0,0,.12),inset 0 0 2px rgba(0,0,0,.15);color:var(--warp-view-font-color);border:none;margin:auto}:host .defaulttz,warp-view-plot .defaulttz,warpview-plot .defaulttz{background:var(--warp-view-switch-inset-color)}:host .customtz,warp-view-plot .customtz,warpview-plot .customtz{background:var(--warp-view-switch-inset-checked-color)}:host .tzcontainer,warp-view-plot .tzcontainer,warpview-plot .tzcontainer{display:-webkit-box;display:flex}:host .chart-container,warp-view-plot .chart-container,warpview-plot .chart-container{height:var(--warp-view-plot-chart-height);width:100%}:host #bottomPlaceHolder,warp-view-plot #bottomPlaceHolder,warpview-plot #bottomPlaceHolder{height:200px;width:100%}:host .warningMessage,warp-view-plot .warningMessage,warpview-plot .warningMessage{color:orange;padding:10px;border-radius:3px;background:#faebd7;margin:1em;display:block;border:2px solid orange}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewPlotComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: SizeService },
        { type: NgZone }
    ]; };
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
    return WarpViewPlotComponent;
}(WarpViewComponent));
export { WarpViewPlotComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LXBsb3QuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHNlbngvd2FycHZpZXcvIiwic291cmNlcyI6WyJzcmMvbGliL2VsZW1lbnRzL3dhcnAtdmlldy1wbG90L3dhcnAtdmlldy1wbG90LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUVMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFlBQVksRUFDWixLQUFLLEVBQ0wsTUFBTSxFQUVOLE1BQU0sRUFDTixTQUFTLEVBQ1QsU0FBUyxFQUNULGlCQUFpQixFQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN6RCxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSw4Q0FBOEMsQ0FBQztBQUNwRixPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDeEMsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0sOENBQThDLENBQUM7QUFDcEYsT0FBTyxFQUFDLDJCQUEyQixFQUFDLE1BQU0sd0RBQXdELENBQUM7QUFDbkcsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sMENBQTBDLENBQUM7QUFDOUUsT0FBTyxFQUFDLHlCQUF5QixFQUFDLE1BQU0sc0RBQXNELENBQUM7QUFFL0YsT0FBTyxNQUFNLE1BQU0saUJBQWlCLENBQUM7QUFDckMsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBRzNDLE9BQU8sU0FBUyxNQUFNLFlBQVksQ0FBQztBQUNuQyxPQUFPLEVBQUMsSUFBSSxFQUFFLFdBQVcsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBQ2hFLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQzs7OztBQUsxQztJQU0yQyxpREFBaUI7SUFnRjFELCtCQUNTLEVBQWMsRUFDZCxR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QUFrQjtzQ0FDeEIsTUFBTSxTQUFDLHFCQUFxQjtnQ0EyRDVCLFlBQVksU0FBQyxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUM7O0lBMlVyQyw0QkFBQztDQUFBLEFBcGJELENBTTJDLGlCQUFpQixHQThhM0Q7U0E5YVkscUJBQXFCOzs7SUFFaEMsNENBQWtFOztJQUNsRSx5Q0FBd0U7O0lBQ3hFLHNDQUFrRTs7SUFDbEUsc0NBQW1FOztJQUNuRSw4Q0FBc0Y7O0lBQ3RGLDJDQUFrRjs7SUFDbEYsb0NBQTZEOztJQUM3RCxnREFBMEU7O0lBQzFFLHdDQUEwRDs7SUFDMUQseUNBQTREOztJQUM1RCw0Q0FBa0U7O0lBQ2xFLDJDQUFpRTs7SUFDakUscUNBQXFEOztJQUNyRCxxQ0FBcUQ7Ozs7O0lBQ3JELHlDQUF5Qjs7Ozs7SUFDekIscUNBQXFCOztJQW9CckIsd0NBQWtDOztJQUNsQyxtREFBc0Q7O0lBQ3RELGlEQUFrRDs7SUFDbEQsb0RBQTZFOztJQUU3RSx5Q0FVRTs7SUFDRix3Q0FBdUI7O0lBQ3ZCLDBDQUFpQjs7SUFDakIsd0NBQWdCOztJQUNoQiw4Q0FBbUI7O0lBQ25CLGtEQUFpQzs7SUFDakMsK0NBQW9COztJQUNwQix3Q0FBZ0I7O0lBQ2hCLDBDQUF5Qjs7Ozs7SUFFekIsMkNBQXVCOzs7OztJQUN2QiwrQ0FBMkI7Ozs7O0lBQzNCLGdEQUE2Qjs7Ozs7SUFDN0IsMkNBQXlCOzs7OztJQUN6QixzQ0FBdUI7Ozs7O0lBQ3ZCLDRDQU1FOzs7OztJQUdGLHNEQUEwRDs7Ozs7SUFDMUQsOERBQStGOztJQUMvRix3Q0FBb0M7O0lBR2xDLG1DQUFxQjs7SUFDckIseUNBQTBCOztJQUMxQiw0Q0FBK0I7O0lBQy9CLHVDQUFxQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQ29weXJpZ2h0IDIwMjAgIFNlblggUy5BLlMuXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKi9cblxuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEhvc3RMaXN0ZW5lcixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFJlbmRlcmVyMixcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7V2FycFZpZXdDb21wb25lbnR9IGZyb20gJy4uL3dhcnAtdmlldy1jb21wb25lbnQnO1xuaW1wb3J0IHtXYXJwVmlld01vZGFsQ29tcG9uZW50fSBmcm9tICcuLi93YXJwLXZpZXctbW9kYWwvd2FycC12aWV3LW1vZGFsLmNvbXBvbmVudCc7XG5pbXBvcnQge1BhcmFtfSBmcm9tICcuLi8uLi9tb2RlbC9wYXJhbSc7XG5pbXBvcnQge1dhcnBWaWV3Q2hhcnRDb21wb25lbnR9IGZyb20gJy4uL3dhcnAtdmlldy1jaGFydC93YXJwLXZpZXctY2hhcnQuY29tcG9uZW50JztcbmltcG9ydCB7V2FycFZpZXdBbm5vdGF0aW9uQ29tcG9uZW50fSBmcm9tICcuLi93YXJwLXZpZXctYW5ub3RhdGlvbi93YXJwLXZpZXctYW5ub3RhdGlvbi5jb21wb25lbnQnO1xuaW1wb3J0IHtXYXJwVmlld01hcENvbXBvbmVudH0gZnJvbSAnLi4vd2FycC12aWV3LW1hcC93YXJwLXZpZXctbWFwLmNvbXBvbmVudCc7XG5pbXBvcnQge1dhcnBWaWV3R3RzUG9wdXBDb21wb25lbnR9IGZyb20gJy4uL3dhcnAtdmlldy1ndHMtcG9wdXAvd2FycC12aWV3LWd0cy1wb3B1cC5jb21wb25lbnQnO1xuaW1wb3J0IHtDaGFydEJvdW5kc30gZnJvbSAnLi4vLi4vbW9kZWwvY2hhcnRCb3VuZHMnO1xuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQtdGltZXpvbmUnO1xuaW1wb3J0IHtHVFNMaWJ9IGZyb20gJy4uLy4uL3V0aWxzL2d0cy5saWInO1xuaW1wb3J0IHtHVFN9IGZyb20gJy4uLy4uL21vZGVsL0dUUyc7XG5pbXBvcnQge0RhdGFNb2RlbH0gZnJvbSAnLi4vLi4vbW9kZWwvZGF0YU1vZGVsJztcbmltcG9ydCBkZWVwRXF1YWwgZnJvbSAnZGVlcC1lcXVhbCc7XG5pbXBvcnQge1NpemUsIFNpemVTZXJ2aWNlfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9yZXNpemUuc2VydmljZSc7XG5pbXBvcnQge0xvZ2dlcn0gZnJvbSAnLi4vLi4vdXRpbHMvbG9nZ2VyJztcblxuLyoqXG4gKlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICd3YXJwdmlldy1wbG90JyxcbiAgdGVtcGxhdGVVcmw6ICcuL3dhcnAtdmlldy1wbG90LmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vd2FycC12aWV3LXBsb3QuY29tcG9uZW50LnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcbmV4cG9ydCBjbGFzcyBXYXJwVmlld1Bsb3RDb21wb25lbnQgZXh0ZW5kcyBXYXJwVmlld0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCB7XG5cbiAgQFZpZXdDaGlsZCgnbWFpblBsb3REaXYnLCB7c3RhdGljOiB0cnVlfSkgbWFpblBsb3REaXY6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ3RpbWVDbGlwJywge3N0YXRpYzogdHJ1ZX0pIHRpbWVDbGlwOiBXYXJwVmlld01vZGFsQ29tcG9uZW50O1xuICBAVmlld0NoaWxkKCdtb2RhbCcsIHtzdGF0aWM6IHRydWV9KSBtb2RhbDogV2FycFZpZXdNb2RhbENvbXBvbmVudDtcbiAgQFZpZXdDaGlsZCgnY2hhcnQnLCB7c3RhdGljOiBmYWxzZX0pIGNoYXJ0OiBXYXJwVmlld0NoYXJ0Q29tcG9uZW50O1xuICBAVmlld0NoaWxkKCdndHNQb3B1cE1vZGFsJywge3N0YXRpYzogZmFsc2V9KSBndHNQb3B1cE1vZGFsOiBXYXJwVmlld0d0c1BvcHVwQ29tcG9uZW50O1xuICBAVmlld0NoaWxkKCdhbm5vdGF0aW9uJywge3N0YXRpYzogZmFsc2V9KSBhbm5vdGF0aW9uOiBXYXJwVmlld0Fubm90YXRpb25Db21wb25lbnQ7XG4gIEBWaWV3Q2hpbGQoJ21hcCcsIHtzdGF0aWM6IGZhbHNlfSkgbWFwOiBXYXJwVmlld01hcENvbXBvbmVudDtcbiAgQFZpZXdDaGlsZCgndGltZUNsaXBFbGVtZW50Jywge3N0YXRpYzogdHJ1ZX0pIHRpbWVDbGlwRWxlbWVudDogRWxlbWVudFJlZjtcbiAgQFZpZXdDaGlsZCgnR1RTVHJlZScsIHtzdGF0aWM6IHRydWV9KSBHVFNUcmVlOiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCdjb250cm9scycsIHtzdGF0aWM6IHRydWV9KSBjb250cm9sczogRWxlbWVudFJlZjtcbiAgQFZpZXdDaGlsZCgnZmlsdGVySW5wdXQnLCB7c3RhdGljOiB0cnVlfSkgZmlsdGVySW5wdXQ6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ3R6U2VsZWN0b3InLCB7c3RhdGljOiBmYWxzZX0pIHR6U2VsZWN0b3I6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ2xpbmUnLCB7c3RhdGljOiBmYWxzZX0pIGxpbmU6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ21haW4nLCB7c3RhdGljOiBmYWxzZX0pIG1haW46IEVsZW1lbnRSZWY7XG4gIHByaXZhdGUgc2hvd0xpbmUgPSBmYWxzZTtcbiAgcHJpdmF0ZSBsZWZ0OiBudW1iZXI7XG5cbiAgQElucHV0KCd0eXBlJykgc2V0IHR5cGUodHlwZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdHlwZSA9IHR5cGU7XG4gICAgdGhpcy5kcmF3Q2hhcnQoKTtcbiAgfVxuXG4gIGdldCB0eXBlKCkge1xuICAgIHJldHVybiB0aGlzLl90eXBlO1xuICB9XG5cbiAgQElucHV0KCdndHNGaWx0ZXInKSBzZXQgZ3RzRmlsdGVyKGd0c0ZpbHRlcikge1xuICAgIHRoaXMuX2d0c0ZpbHRlciA9IGd0c0ZpbHRlcjtcbiAgICB0aGlzLmRyYXdDaGFydCgpO1xuICB9XG5cbiAgZ2V0IGd0c0ZpbHRlcigpIHtcbiAgICByZXR1cm4gdGhpcy5fZ3RzRmlsdGVyO1xuICB9XG5cbiAgQElucHV0KCdpc0Fsb25lJykgaXNBbG9uZSA9IGZhbHNlO1xuICBASW5wdXQoJ2luaXRpYWxDaGFydEhlaWdodCcpIGluaXRpYWxDaGFydEhlaWdodCA9IDQwMDtcbiAgQElucHV0KCdpbml0aWFsTWFwSGVpZ2h0JykgaW5pdGlhbE1hcEhlaWdodCA9IDQwMDtcbiAgQE91dHB1dCgnd2FycFZpZXdDaGFydFJlc2l6ZScpIHdhcnBWaWV3Q2hhcnRSZXNpemUgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBfb3B0aW9uczogUGFyYW0gPSB7XG4gICAgLi4ubmV3IFBhcmFtKCksIC4uLntcbiAgICAgIHNob3dDb250cm9sczogdHJ1ZSxcbiAgICAgIHNob3dHVFNUcmVlOiB0cnVlLFxuICAgICAgc2hvd0RvdHM6IHRydWUsXG4gICAgICB0aW1lWm9uZTogJ1VUQycsXG4gICAgICB0aW1lVW5pdDogJ3VzJyxcbiAgICAgIHRpbWVNb2RlOiAnZGF0ZScsXG4gICAgICBib3VuZHM6IHt9XG4gICAgfVxuICB9O1xuICBfdG9IaWRlOiBudW1iZXJbXSA9IFtdO1xuICBzaG93Q2hhcnQgPSB0cnVlO1xuICBzaG93TWFwID0gZmFsc2U7XG4gIHRpbWVDbGlwVmFsdWUgPSAnJztcbiAga2JkTGFzdEtleVByZXNzZWQ6IHN0cmluZ1tdID0gW107XG4gIHdhcm5pbmdNZXNzYWdlID0gJyc7XG4gIGxvYWRpbmcgPSBmYWxzZTtcbiAgZ3RzSWRMaXN0OiBudW1iZXJbXSA9IFtdO1xuXG4gIHByaXZhdGUga2JkQ291bnRlciA9IDA7XG4gIHByaXZhdGUgZ3RzRmlsdGVyQ291bnQgPSAwO1xuICBwcml2YXRlIGd0c0Jyb3dzZXJJbmRleCA9IC0xO1xuICBwcml2YXRlIF9ndHNGaWx0ZXIgPSAneCc7XG4gIHByaXZhdGUgX3R5cGUgPSAnbGluZSc7XG4gIHByaXZhdGUgY2hhcnRCb3VuZHM6IENoYXJ0Qm91bmRzID0ge1xuICAgIHRzbWluOiBOdW1iZXIuTUFYX1ZBTFVFLFxuICAgIHRzbWF4OiBOdW1iZXIuTUlOX1ZBTFVFLFxuICAgIG1zbWF4OiAnJyxcbiAgICBtc21pbjogJycsXG4gICAgbWFyZ2luTGVmdDogMFxuICB9O1xuICAvLyBrZXkgZXZlbnQgYXJlIHRyYXBwZWQgaW4gcGxvdCBjb21wb25lbnQuXG4gIC8vIGlmIG9uZSBvZiB0aGlzIGtleSBpcyBwcmVzc2VkLCBkZWZhdWx0IGFjdGlvbiBpcyBwcmV2ZW50ZWQuXG4gIHByaXZhdGUgcHJldmVudERlZmF1bHRLZXlMaXN0OiBzdHJpbmdbXSA9IFsnRXNjYXBlJywgJy8nXTtcbiAgcHJpdmF0ZSBwcmV2ZW50RGVmYXVsdEtleUxpc3RJbk1vZGFsczogc3RyaW5nW10gPSBbJ0VzY2FwZScsICdBcnJvd1VwJywgJ0Fycm93RG93bicsICcgJywgJy8nXTtcbiAgZ3RzTGlzdDogRGF0YU1vZGVsIHwgR1RTW10gfCBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGVsOiBFbGVtZW50UmVmLFxuICAgIHB1YmxpYyByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHB1YmxpYyBzaXplU2VydmljZTogU2l6ZVNlcnZpY2UsXG4gICAgcHVibGljIG5nWm9uZTogTmdab25lXG4gICkge1xuICAgIHN1cGVyKGVsLCByZW5kZXJlciwgc2l6ZVNlcnZpY2UsIG5nWm9uZSk7XG4gICAgdGhpcy5MT0cgPSBuZXcgTG9nZ2VyKFdhcnBWaWV3UGxvdENvbXBvbmVudCwgdGhpcy5fZGVidWcpO1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5fb3B0aW9ucyA9IHRoaXMuX29wdGlvbnMgfHwgdGhpcy5kZWZPcHRpb25zO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHRoaXMuZHJhd0NoYXJ0KHRydWUpO1xuICAgIHRoaXMucmVzaXplQXJlYSgpO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcigna2V5ZG93bicsIFsnJGV2ZW50J10pXG4gIGhhbmRsZUtleWRvd24oZXY6IEtleWJvYXJkRXZlbnQpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2hhbmRsZUtleWRvd24nXSwgZXYpO1xuICAgIGlmICghdGhpcy5pc0Fsb25lKSB7XG4gICAgICB0aGlzLmhhbmRsZUtleVByZXNzKGV2KS50aGVuKCgpID0+IHtcbiAgICAgICAgLy8gZW1wdHlcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRlQ2hhbmdlKGV2ZW50OiBhbnkpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3N0YXRlQ2hhbmdlJ10sIGV2ZW50KTtcbiAgICBzd2l0Y2ggKGV2ZW50LmlkKSB7XG4gICAgICBjYXNlICd0aW1lU3dpdGNoJyA6XG4gICAgICAgIGlmIChldmVudC5zdGF0ZSkge1xuICAgICAgICAgIHRoaXMuX29wdGlvbnMudGltZU1vZGUgPSAndGltZXN0YW1wJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9vcHRpb25zLnRpbWVNb2RlID0gJ2RhdGUnO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZHJhd0NoYXJ0KCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndHlwZVN3aXRjaCcgOlxuICAgICAgICBpZiAoZXZlbnQuc3RhdGUpIHtcbiAgICAgICAgICB0aGlzLl90eXBlID0gJ3N0ZXAnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3R5cGUgPSAnbGluZSc7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kcmF3Q2hhcnQoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjaGFydFN3aXRjaCcgOlxuICAgICAgICB0aGlzLnNob3dDaGFydCA9IGV2ZW50LnN0YXRlO1xuICAgICAgICB0aGlzLmRyYXdDaGFydCgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21hcFN3aXRjaCcgOlxuICAgICAgICB0aGlzLnNob3dNYXAgPSBldmVudC5zdGF0ZTtcbiAgICAgICAgaWYgKHRoaXMuc2hvd01hcCkge1xuICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLm1hcC5yZXNpemUoKSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgYm91bmRzRGlkQ2hhbmdlKGV2ZW50KSB7XG4gICAgdGhpcy5MT0cuZGVidWcoWyd1cGRhdGVCb3VuZHMnXSwgZXZlbnQpO1xuICAgIHRoaXMuX29wdGlvbnMuYm91bmRzID0gdGhpcy5fb3B0aW9ucy5ib3VuZHMgfHwge307XG4gICAgaWYgKHRoaXMuX29wdGlvbnMuYm91bmRzLm1pbkRhdGUgIT09IGV2ZW50LmJvdW5kcy5taW4gJiYgdGhpcy5fb3B0aW9ucy5ib3VuZHMubWF4RGF0ZSAhPT0gZXZlbnQuYm91bmRzLm1heCkge1xuICAgICAgdGhpcy5fb3B0aW9ucy5ib3VuZHMgPSB0aGlzLl9vcHRpb25zLmJvdW5kcyB8fCB7fTtcbiAgICAgIHRoaXMuX29wdGlvbnMuYm91bmRzLm1pbkRhdGUgPSBldmVudC5ib3VuZHMubWluO1xuICAgICAgdGhpcy5fb3B0aW9ucy5ib3VuZHMubWF4RGF0ZSA9IGV2ZW50LmJvdW5kcy5tYXg7XG4gICAgICBpZiAoZXZlbnQuc291cmNlID09PSAnY2hhcnQnKSB7XG4gICAgICAgIHRoaXMuYW5ub3RhdGlvbi51cGRhdGVCb3VuZHMoZXZlbnQuYm91bmRzLm1pbiwgZXZlbnQuYm91bmRzLm1heCwgZXZlbnQuYm91bmRzLm1hcmdpbkxlZnQpO1xuICAgICAgfSBlbHNlIGlmIChldmVudC5zb3VyY2UgPT09ICdhbm5vdGF0aW9uJykge1xuICAgICAgICB0aGlzLmNoYXJ0LnVwZGF0ZUJvdW5kcyhldmVudC5ib3VuZHMubWluLCBldmVudC5ib3VuZHMubWF4KTtcbiAgICAgIH1cbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsndXBkYXRlQm91bmRzJ10sXG4gICAgICAgIG1vbWVudC50eihldmVudC5ib3VuZHMubWluLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKS50b0RhdGUoKSxcbiAgICAgICAgbW9tZW50LnR6KGV2ZW50LmJvdW5kcy5tYXgsIHRoaXMuX29wdGlvbnMudGltZVpvbmUpLnRvRGF0ZSgpKTtcbiAgICAgIHRoaXMubGluZS5uYXRpdmVFbGVtZW50LnN0eWxlLmxlZnQgPSAnLTEwMHB4JztcbiAgICB9XG4gIH1cblxuICBvbldhcnBWaWV3TW9kYWxDbG9zZSgpIHtcbiAgICB0aGlzLm1haW5QbG90RGl2Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgfVxuXG4gIHdhcnBWaWV3U2VsZWN0ZWRHVFMoZXZlbnQpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3dhcnBWaWV3U2VsZWN0ZWRHVFMnXSwgZXZlbnQpO1xuICAgIGlmICghdGhpcy5fdG9IaWRlLmZpbmQoaSA9PiB7XG4gICAgICByZXR1cm4gaSA9PT0gZXZlbnQuZ3RzLmlkO1xuICAgIH0pICYmICFldmVudC5zZWxlY3RlZCkgeyAvLyBpZiBub3QgaW4gdG9IaWRlIGFuZCBzdGF0ZSBmYWxzZSwgcHV0IGlkIGluIHRvSGlkZVxuICAgICAgdGhpcy5fdG9IaWRlLnB1c2goZXZlbnQuZ3RzLmlkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGV2ZW50LnNlbGVjdGVkKSB7IC8vIGlmIGluIHRvSGlkZSBhbmQgc3RhdGUgdHJ1ZSwgcmVtb3ZlIGl0IGZyb20gdG9IaWRlXG4gICAgICAgIHRoaXMuX3RvSGlkZSA9IHRoaXMuX3RvSGlkZS5maWx0ZXIoaSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGkgIT09IGV2ZW50Lmd0cy5pZDtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuTE9HLmRlYnVnKFsnd2FycFZpZXdTZWxlY3RlZEdUUycsICd0aGlzLl90b0hpZGUnXSwgdGhpcy5fdG9IaWRlKTtcbiAgICB0aGlzLm5nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgdGhpcy5fdG9IaWRlID0gWy4uLnRoaXMuX3RvSGlkZV07XG4gICAgfSk7XG4gIH1cblxuICBoYW5kbGVNb3VzZU1vdmUoZXZ0OiBNb3VzZUV2ZW50KSB7XG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgaWYgKHRoaXMuc2hvd0xpbmUgJiYgdGhpcy5saW5lKSB7XG4gICAgICB0aGlzLmxpbmUubmF0aXZlRWxlbWVudC5zdHlsZS5sZWZ0ID0gTWF0aC5tYXgoZXZ0LnBhZ2VYIC0gdGhpcy5sZWZ0LCA1MCkgKyAncHgnO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZU1vdXNlRW50ZXIoZXZ0OiBNb3VzZUV2ZW50KSB7XG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5sZWZ0ID0gdGhpcy5sZWZ0IHx8IHRoaXMubWFpbi5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQ7XG4gICAgdGhpcy5zaG93TGluZSA9IHRydWU7XG4gICAgaWYgKHRoaXMubGluZSkge1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmxpbmUubmF0aXZlRWxlbWVudCwgJ2Rpc3BsYXknLCAnYmxvY2snKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVNb3VzZU91dChldnQ6IE1vdXNlRXZlbnQpIHtcbiAgICAvLyBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICBpZiAodGhpcy5saW5lKSB7XG4gICAgICB0aGlzLnNob3dMaW5lID0gZmFsc2U7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMubGluZS5uYXRpdmVFbGVtZW50LCAnbGVmdCcsICctMTAwcHgnKTtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5saW5lLm5hdGl2ZUVsZW1lbnQsICdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGUob3B0aW9ucywgcmVmcmVzaCk6IHZvaWQge1xuICAgIGlmIChvcHRpb25zKSB7XG4gICAgICBsZXQgb3B0aW9uQ2hhbmdlZCA9IGZhbHNlO1xuICAgICAgT2JqZWN0LmtleXMob3B0aW9ucykuZm9yRWFjaChvcHQgPT4ge1xuICAgICAgICBpZiAodGhpcy5fb3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShvcHQpKSB7XG4gICAgICAgICAgb3B0aW9uQ2hhbmdlZCA9IG9wdGlvbkNoYW5nZWQgfHwgIWRlZXBFcXVhbChvcHRpb25zW29wdF0sIHRoaXMuX29wdGlvbnNbb3B0XSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb3B0aW9uQ2hhbmdlZCA9IHRydWU7IC8vIG5ldyB1bmtub3duIG9wdGlvblxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGlmICh0aGlzLkxPRykge1xuICAgICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ29uT3B0aW9ucycsICdvcHRpb25DaGFuZ2VkJ10sIG9wdGlvbkNoYW5nZWQpO1xuICAgICAgfVxuICAgICAgaWYgKG9wdGlvbkNoYW5nZWQpIHtcbiAgICAgICAgaWYgKHRoaXMuTE9HKSB7XG4gICAgICAgICAgdGhpcy5MT0cuZGVidWcoWydvbk9wdGlvbnMnLCAnb3B0aW9ucyddLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9vcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgdGhpcy5kcmF3Q2hhcnQoZmFsc2UpO1xuICAgICAgfVxuICAgICAgdGhpcy5kcmF3Q2hhcnQocmVmcmVzaCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZHJhd0NoYXJ0KHJlZnJlc2gpO1xuICAgIH1cbiAgfVxuXG4gIGlucHV0VGV4dEtleWJvYXJkRXZlbnRzKGU6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJykge1xuICAgICAgdGhpcy5hcHBseUZpbHRlcigpO1xuICAgIH0gZWxzZSBpZiAoZS5rZXkgPT09ICdFc2NhcGUnKSB7XG4gICAgICB0aGlzLnB1c2hLYmRFdmVudCgnRXNjYXBlJyk7XG4gICAgICB0aGlzLm1vZGFsLmNsb3NlKCk7XG4gICAgfVxuICB9XG5cbiAgdHpTZWxlY3RlZCgpIHtcbiAgICBjb25zdCB0aW1lWm9uZSA9IHRoaXMudHpTZWxlY3Rvci5uYXRpdmVFbGVtZW50LnZhbHVlO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsndGltZXpvbmUnLCAndHpzZWxlY3QnXSwgdGltZVpvbmUpO1xuICAgIHRoaXMuX29wdGlvbnMudGltZVpvbmUgPSB0aW1lWm9uZTtcbiAgICB0aGlzLnR6U2VsZWN0b3IubmF0aXZlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgdGltZVpvbmUgPT09ICdVVEMnID8gJ2RlZmF1bHR0eicgOiAnY3VzdG9tdHonKTtcbiAgICB0aGlzLmRyYXdDaGFydCgpO1xuICB9XG5cbiAgcHVibGljIGdldFRpbWVDbGlwKCk6IFByb21pc2U8Q2hhcnRCb3VuZHM+IHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2dldFRpbWVDbGlwJ10sIHRoaXMuY2hhcnQuZ2V0VGltZUNsaXAoKSk7XG4gICAgcmV0dXJuIHRoaXMuY2hhcnQuZ2V0VGltZUNsaXAoKTtcbiAgfVxuXG4gIHJlc2l6ZUNoYXJ0KGV2ZW50KSB7XG4gICAgdGhpcy5MT0cuZGVidWcoWydyZXNpemVDaGFydCddLCBldmVudCk7XG4gICAgdGhpcy5zaXplU2VydmljZS5jaGFuZ2UobmV3IFNpemUodGhpcy53aWR0aCwgZXZlbnQpKTtcbiAgfVxuXG4gIGRyYXdDaGFydChmaXJzdERyYXc6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZHJhd0NoYXJ0cyddLCB0aGlzLl9kYXRhLCB0aGlzLl9vcHRpb25zKTtcbiAgICBpZiAoIXRoaXMuX2RhdGEgfHwgIXRoaXMuX2RhdGEuZGF0YSB8fCB0aGlzLl9kYXRhLmRhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLnRpbWVDbGlwKSB7XG4gICAgICB0aGlzLnRpbWVDbGlwLmNsb3NlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLm1vZGFsKSB7XG4gICAgICB0aGlzLm1vZGFsLmNsb3NlKCk7XG4gICAgfVxuICAgIHRoaXMuTE9HLmRlYnVnKFsnUFB0cyddLCAnZmlyc3RkcmF3ICcsIGZpcnN0RHJhdyk7XG4gICAgaWYgKGZpcnN0RHJhdykgeyAvLyBvbiB0aGUgZmlyc3QgZHJhdywgd2UgY2FuIHNldCBzb21lIGRlZmF1bHQgb3B0aW9ucy5cbiAgICAgIC8vIGF1dG9tYXRpY2FsbHkgc3dpdGNoIHRvIHRpbWVzdGFtcCBtb2RlXG4gICAgICAvLyB3aGVuIHRoZSBmaXJzdCB0aWNrIGFuZCBsYXN0IHRpY2sgb2YgYWxsIHRoZSBzZXJpZXMgYXJlIGluIHRoZSBpbnRlcnZhbCBbLTEwMG1zIDEwMG1zXVxuICAgICAgY29uc3QgdHNMaW1pdCA9IDEwMCAqIEdUU0xpYi5nZXREaXZpZGVyKHRoaXMuX29wdGlvbnMudGltZVVuaXQpO1xuICAgICAgY29uc3QgZGF0YUxpc3QgPSB0aGlzLl9kYXRhLmRhdGE7XG4gICAgICBpZiAoZGF0YUxpc3QpIHtcbiAgICAgICAgbGV0IGd0c0xpc3QgPSBHVFNMaWIuZmxhdHRlbkd0c0lkQXJyYXkoZGF0YUxpc3QgYXMgYW55LCAwKS5yZXM7XG4gICAgICAgIGd0c0xpc3QgPSBHVFNMaWIuZmxhdERlZXAoZ3RzTGlzdCk7XG4gICAgICAgIGxldCB0aW1lc3RhbXBNb2RlID0gdHJ1ZTtcbiAgICAgICAgbGV0IHRvdGFsRGF0YXBvaW50cyA9IDA7XG4gICAgICAgIGd0c0xpc3QuZm9yRWFjaChnID0+IHtcbiAgICAgICAgICB0aGlzLmd0c0lkTGlzdC5wdXNoKGcuaWQpOyAvLyB1c2VmdWxsIGZvciBndHMgYnJvd3NlIHNob3J0Y3V0XG4gICAgICAgICAgaWYgKGcudi5sZW5ndGggPiAwKSB7IC8vIGlmIGd0cyBub3QgZW1wdHlcbiAgICAgICAgICAgIHRpbWVzdGFtcE1vZGUgPSB0aW1lc3RhbXBNb2RlICYmIChnLnZbMF1bMF0gPiAtdHNMaW1pdCAmJiBnLnZbMF1bMF0gPCB0c0xpbWl0KTtcbiAgICAgICAgICAgIHRpbWVzdGFtcE1vZGUgPSB0aW1lc3RhbXBNb2RlICYmIChnLnZbZy52Lmxlbmd0aCAtIDFdWzBdID4gLXRzTGltaXQgJiYgZy52W2cudi5sZW5ndGggLSAxXVswXSA8IHRzTGltaXQpO1xuICAgICAgICAgICAgdG90YWxEYXRhcG9pbnRzICs9IGcudi5sZW5ndGg7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHRpbWVzdGFtcE1vZGUpIHtcbiAgICAgICAgICB0aGlzLl9vcHRpb25zLnRpbWVNb2RlID0gJ3RpbWVzdGFtcCc7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5MT0cuZGVidWcoWydkcmF3Q2hhcnRzJywgJ3BhcnNlZCcsICd0aW1lc3RhbXBNb2RlJ10sIHRpbWVzdGFtcE1vZGUpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmd0c0xpc3QgPSB0aGlzLl9kYXRhO1xuICAgIHRoaXMuX29wdGlvbnMgPSB7Li4udGhpcy5fb3B0aW9uc307XG5cbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RyYXdDaGFydHMnLCAncGFyc2VkJ10sIHRoaXMuX2RhdGEsIHRoaXMuX29wdGlvbnMpO1xuICAgIHRoaXMucmVzaXplQXJlYSgpO1xuICB9XG5cbiAgZm9jdXMoZXZlbnQ6IGFueSkge1xuICAgIC8vIHJlYWQgdGhlIGZpcnN0IDQgbGV0dGVycyBvZiBpZCBvZiBhbGwgZWxlbWVudHMgaW4gdGhlIGNsaWNrIHRyZWVcbiAgICBjb25zdCBpZExpc3RDbGlja2VkID0gZXZlbnQucGF0aC5tYXAoZWwgPT4gKGVsLmlkIHx8ICcnKS5zbGljZSgwLCA0KSk7XG4gICAgLy8gaWYgbm90IGFsb25lIG9uIHRoZSBwYWdlLCBhbmQgY2xpY2sgaXMgbm90IG9uIHRoZSB0aW1lem9uZSBzZWxlY3RvciBhbmQgbm90IG9uIHRoZSBtYXAsIGZvcmNlIGZvY3VzLlxuICAgIGlmICghdGhpcy5pc0Fsb25lICYmIGlkTGlzdENsaWNrZWQuaW5kZXhPZigndHpTZScpIDwgMCAmJiBpZExpc3RDbGlja2VkLmluZGV4T2YoJ21hcC0nKSA8IDApIHtcbiAgICAgIHRoaXMubWFpblBsb3REaXYubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgIH0gLy8gcHJldmVudCBzdGVhbGluZyBmb2N1cyBvZiB0aGUgdGltZXpvbmUgc2VsZWN0b3IuXG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGhhbmRsZUtleVByZXNzKGV2OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgdGhpcy5MT0cuZGVidWcoWydoYW5kbGVLZXlQcmVzcyddLCBldik7XG4gICAgaWYgKHRoaXMucHJldmVudERlZmF1bHRLZXlMaXN0LmluZGV4T2YoZXYua2V5KSA+PSAwKSB7XG4gICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgICBpZiAoYXdhaXQgdGhpcy50aW1lQ2xpcC5pc09wZW5lZCgpIHx8IGF3YWl0IHRoaXMubW9kYWwuaXNPcGVuZWQoKSB8fCBhd2FpdCB0aGlzLmd0c1BvcHVwTW9kYWwuaXNPcGVuZWQoKSkge1xuICAgICAgaWYgKHRoaXMucHJldmVudERlZmF1bHRLZXlMaXN0SW5Nb2RhbHMuaW5kZXhPZihldi5rZXkpID49IDApIHtcbiAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGV2LmtleSA9PT0gJy8nKSB7XG4gICAgICB0aGlzLm1vZGFsLm9wZW4oKTtcbiAgICAgIHRoaXMuZmlsdGVySW5wdXQubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgdGhpcy5maWx0ZXJJbnB1dC5uYXRpdmVFbGVtZW50LnNlbGVjdCgpO1xuICAgIH0gZWxzZSBpZiAoZXYua2V5ID09PSAndCcpIHtcbiAgICAgIHRoaXMuY2hhcnQuZ2V0VGltZUNsaXAoKS50aGVuKHRjID0+IHtcbiAgICAgICAgdGhpcy50aW1lQ2xpcFZhbHVlID0gYDxwPmtlZXAgZGF0YSBiZXR3ZWVuXG4gICAgICAgICAgJHt0aGlzLl9vcHRpb25zLnRpbWVNb2RlID09PSAndGltZXN0YW1wJyA/IHRjLnRzbWluIDogbW9tZW50LnR6KHRjLnRzbWluLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKS50b0xvY2FsZVN0cmluZygpfSBhbmRcbiAgICAgICAgICAke3RoaXMuX29wdGlvbnMudGltZU1vZGUgPT09ICd0aW1lc3RhbXAnID8gdGMudHNtYXggOiBtb21lbnQudHoodGMudHNtYXgsIHRoaXMuX29wdGlvbnMudGltZVpvbmUpLnRvTG9jYWxlU3RyaW5nKCl9XG4gICAgICAgICAgJHt0aGlzLl9vcHRpb25zLnRpbWVVbml0ICE9PSAndXMnID8gJyAoZm9yIGEgJyArIHRoaXMuX29wdGlvbnMudGltZVVuaXQgKyAnIHBsYXRmb3JtKScgOiAnJ308L3A+XG4gICAgICAgICAgPHByZT48Y29kZT4ke01hdGgucm91bmQodGMudHNtYXgpfSAke01hdGgucm91bmQodGMudHNtYXggLSB0Yy50c21pbil9IFRJTUVDTElQPC9jb2RlPjwvcHJlPmA7XG4gICAgICAgIHRoaXMudGltZUNsaXAub3BlbigpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChldi5rZXkgPT09ICdiJyB8fCBldi5rZXkgPT09ICdCJykgeyAvLyBicm93c2UgYW1vbmcgYWxsIGd0c1xuICAgICAgaWYgKHRoaXMuZ3RzQnJvd3NlckluZGV4IDwgMCkge1xuICAgICAgICB0aGlzLmd0c0Jyb3dzZXJJbmRleCA9IDA7XG4gICAgICB9XG4gICAgICBpZiAoZXYua2V5ID09PSAnYicpIHsgLy8gaW5jcmVtZW50IGluZGV4XG4gICAgICAgIHRoaXMuZ3RzQnJvd3NlckluZGV4Kys7XG4gICAgICAgIGlmICh0aGlzLmd0c0Jyb3dzZXJJbmRleCA9PT0gdGhpcy5ndHNJZExpc3QubGVuZ3RoKSB7XG4gICAgICAgICAgdGhpcy5ndHNCcm93c2VySW5kZXggPSAwO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgeyAvLyBkZWNyZW1lbnQgaW5kZXhcbiAgICAgICAgdGhpcy5ndHNCcm93c2VySW5kZXgtLTtcbiAgICAgICAgaWYgKHRoaXMuZ3RzQnJvd3NlckluZGV4IDwgMCkge1xuICAgICAgICAgIHRoaXMuZ3RzQnJvd3NlckluZGV4ID0gdGhpcy5ndHNJZExpc3QubGVuZ3RoIC0gMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5fdG9IaWRlID0gdGhpcy5ndHNJZExpc3QuZmlsdGVyKHYgPT4gdiAhPT0gdGhpcy5ndHNJZExpc3RbdGhpcy5ndHNCcm93c2VySW5kZXhdKTsgLy8gaGlkZSBhbGwgYnV0IG9uZVxuICAgIH0gZWxzZSBpZiAoZXYua2V5ID09PSAnbicpIHtcbiAgICAgIHRoaXMuX3RvSGlkZSA9IFsuLi50aGlzLmd0c0lkTGlzdF07XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIGlmIChldi5rZXkgPT09ICdhJykge1xuICAgICAgdGhpcy5fdG9IaWRlID0gW107XG4gICAgfSBlbHNlIGlmIChldi5rZXkgPT09ICdFc2NhcGUnKSB7XG4gICAgICB0aGlzLnRpbWVDbGlwLmlzT3BlbmVkKCkudGhlbihyID0+IHtcbiAgICAgICAgaWYgKHIpIHtcbiAgICAgICAgICB0aGlzLnRpbWVDbGlwLmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy5tb2RhbC5pc09wZW5lZCgpLnRoZW4ociA9PiB7XG4gICAgICAgIGlmIChyKSB7XG4gICAgICAgICAgdGhpcy5tb2RhbC5jbG9zZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMuZ3RzUG9wdXBNb2RhbC5pc09wZW5lZCgpLnRoZW4ociA9PiB7XG4gICAgICAgIGlmIChyKSB7XG4gICAgICAgICAgdGhpcy5ndHNQb3B1cE1vZGFsLmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnB1c2hLYmRFdmVudChldi5rZXkpO1xuICAgIH1cbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2hhbmRsZUtleVByZXNzJywgJ3RoaXMuZ3RzSWRMaXN0J10sIHRoaXMuX3RvSGlkZSwgdGhpcy5ndHNCcm93c2VySW5kZXgpO1xuICB9XG5cbiAgYXBwbHlGaWx0ZXIoKSB7XG4gICAgdGhpcy5ndHNGaWx0ZXJDb3VudCsrO1xuICAgIHRoaXMuX2d0c0ZpbHRlciA9IHRoaXMuZ3RzRmlsdGVyQ291bnQudG9TdHJpbmcoKS5zbGljZSgwLCAxKSArIHRoaXMuZmlsdGVySW5wdXQubmF0aXZlRWxlbWVudC52YWx1ZTtcbiAgICB0aGlzLm1vZGFsLmNsb3NlKCk7XG4gIH1cblxuICBwcml2YXRlIHB1c2hLYmRFdmVudChrZXk6IHN0cmluZykge1xuICAgIHRoaXMua2JkQ291bnRlcisrO1xuICAgIHRoaXMua2JkTGFzdEtleVByZXNzZWQgPSBba2V5LCB0aGlzLmtiZENvdW50ZXIudG9TdHJpbmcoKV07XG4gIH1cblxuICBnZXRUWigpIHtcbiAgICByZXR1cm4gbW9tZW50LnR6Lm5hbWVzKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgY29udmVydChkYXRhOiBEYXRhTW9kZWwpOiBhbnlbXSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgb25DaGFydERyYXcoJGV2ZW50OiBhbnkpIHtcbiAgICBpZiAoXG4gICAgICB0aGlzLmNoYXJ0Qm91bmRzXG4gICAgICAmJiAkZXZlbnRcbiAgICAgICYmIHRoaXMuY2hhcnRCb3VuZHMudHNtaW4gIT09IE1hdGgubWluKHRoaXMuY2hhcnRCb3VuZHMudHNtaW4sICRldmVudC50c21pbilcbiAgICAgICYmIHRoaXMuY2hhcnRCb3VuZHMudHNtYXggIT09IE1hdGgubWF4KHRoaXMuY2hhcnRCb3VuZHMudHNtYXgsICRldmVudC50c21heClcbiAgICApIHtcbiAgICAgIHRoaXMuY2hhcnRCb3VuZHMudHNtaW4gPSBNYXRoLm1pbih0aGlzLmNoYXJ0Qm91bmRzLnRzbWluLCAkZXZlbnQudHNtaW4pO1xuICAgICAgdGhpcy5jaGFydEJvdW5kcy50c21heCA9IE1hdGgubWF4KHRoaXMuY2hhcnRCb3VuZHMudHNtYXgsICRldmVudC50c21heCk7XG4gICAgICB0aGlzLmFubm90YXRpb24uc2V0UmVhbEJvdW5kcyh0aGlzLmNoYXJ0Qm91bmRzKTtcbiAgICAgIHRoaXMuY2hhcnQuc2V0UmVhbEJvdW5kcyh0aGlzLmNoYXJ0Qm91bmRzKTtcbiAgICAgIHRoaXMuY2hhcnREcmF3LmVtaXQoKTtcbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsnb25DaGFydERyYXcnLCAndGhpcy5jaGFydEJvdW5kcyddLCB0aGlzLmNoYXJ0Qm91bmRzLCAkZXZlbnQpO1xuICAgIH1cbiAgICB0aGlzLmNoYXJ0RHJhdy5lbWl0KCRldmVudCk7XG4gIH1cblxuICBwcml2YXRlIHJlc2l6ZUFyZWEoKSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBsZXQgaCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XG4gICAgICBpZiAoaCA+IDApIHtcbiAgICAgICAgaWYgKCEhdGhpcy5HVFNUcmVlKSB7XG4gICAgICAgICAgaCAtPSB0aGlzLkdUU1RyZWUubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEhdGhpcy5jb250cm9scykge1xuICAgICAgICAgIGggLT0gdGhpcy5jb250cm9scy5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmluaXRpYWxDaGFydEhlaWdodCA9IGg7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==