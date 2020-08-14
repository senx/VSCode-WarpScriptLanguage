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
import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { Param } from '../../model/param';
import { Logger } from '../../utils/logger';
import Leaflet from 'leaflet';
import 'leaflet.heat';
import 'leaflet.markercluster';
import { ColorLib } from '../../utils/color-lib';
import { ChartLib } from '../../utils/chart-lib';
import { DataModel } from '../../model/dataModel';
import { MapLib } from '../../utils/map-lib';
import { GTSLib } from '../../utils/gts.lib';
import moment from 'moment-timezone';
import deepEqual from 'deep-equal';
import { SizeService } from '../../services/resize.service';
import { Timsort } from '../../utils/timsort';
/**
 *
 */
var WarpViewMapComponent = /** @class */ (function () {
    function WarpViewMapComponent(el, sizeService, renderer) {
        var _this = this;
        this.el = el;
        this.sizeService = sizeService;
        this.renderer = renderer;
        this.heatData = [];
        this.responsive = false;
        this.showLegend = true;
        this.width = ChartLib.DEFAULT_WIDTH;
        this.height = ChartLib.DEFAULT_HEIGHT;
        this.change = new EventEmitter();
        this.chartDraw = new EventEmitter();
        this.divider = 1;
        this._options = new Param();
        this._firstDraw = true;
        this._debug = false;
        this.defOptions = ChartLib.mergeDeep(new Param(), {
            map: {
                heatControls: false,
                tiles: [],
                dotsLimit: 1000,
            },
            timeMode: 'date',
            showRangeSelector: true,
            gridLineColor: '#8e8e8e',
            showDots: false,
            timeZone: 'UTC',
            timeUnit: 'us',
            bounds: {}
        });
        this.currentValuesMarkers = [];
        this.annotationsMarkers = [];
        this.positionArraysMarkers = [];
        this._iconAnchor = [20, 52];
        this._popupAnchor = [0, -50];
        this.pathData = [];
        this.annotationsData = [];
        this.positionData = [];
        this.geoJson = [];
        this.firstDraw = true;
        this.finalHeight = 0;
        // Layers
        this.pathDataLayer = Leaflet.featureGroup();
        this.annotationsDataLayer = Leaflet.featureGroup();
        this.positionDataLayer = Leaflet.featureGroup();
        this.tileLayerGroup = Leaflet.featureGroup();
        this.geoJsonLayer = Leaflet.featureGroup();
        this.LOG = new Logger(WarpViewMapComponent, this.debug);
        this.LOG.debug(['constructor'], this.debug);
        this.sizeService.sizeChanged$.subscribe((/**
         * @return {?}
         */
        function () {
            if (_this._map) {
                _this.resizeMe();
            }
        }));
    }
    Object.defineProperty(WarpViewMapComponent.prototype, "debug", {
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
    Object.defineProperty(WarpViewMapComponent.prototype, "options", {
        set: /**
         * @param {?} options
         * @return {?}
         */
        function (options) {
            this.LOG.debug(['onOptions'], options);
            if (!deepEqual(this._options, options)) {
                /** @type {?} */
                var reZoom = options.map.startZoom !== this._options.map.startZoom
                    || options.map.startLat !== this._options.map.startLat
                    || options.map.startLong !== this._options.map.startLong;
                this._options = options;
                this.divider = GTSLib.getDivider(this._options.timeUnit);
                this.drawMap(reZoom);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarpViewMapComponent.prototype, "data", {
        get: /**
         * @return {?}
         */
        function () {
            return this._data;
        },
        set: /**
         * @param {?} data
         * @return {?}
         */
        function (data) {
            this.LOG.debug(['onData'], data);
            this.currentValuesMarkers = [];
            this.annotationsMarkers = [];
            this.positionArraysMarkers = [];
            if (!!data) {
                this._data = data;
                this.drawMap(true);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarpViewMapComponent.prototype, "hiddenData", {
        get: /**
         * @return {?}
         */
        function () {
            return this._hiddenData;
        },
        set: /**
         * @param {?} hiddenData
         * @return {?}
         */
        function (hiddenData) {
            this._hiddenData = hiddenData;
            this.drawMap(false);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    WarpViewMapComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this._options = (/** @type {?} */ (ChartLib.mergeDeep(this._options, this.defOptions)));
    };
    /**
     * @return {?}
     */
    WarpViewMapComponent.prototype.resizeMe = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.LOG.debug(['resizeMe'], this.wrapper.nativeElement.parentElement.getBoundingClientRect());
        /** @type {?} */
        var height = this.wrapper.nativeElement.parentElement.getBoundingClientRect().height;
        /** @type {?} */
        var width = this.wrapper.nativeElement.parentElement.getBoundingClientRect().width;
        if (this._options.map.showTimeSlider && this.timeSlider && this.timeSlider.nativeElement) {
            height -= this.timeSlider.nativeElement.getBoundingClientRect().height;
        }
        if (this._options.map.showTimeRange && this.timeRangeSlider && this.timeRangeSlider.nativeElement) {
            height -= this.timeRangeSlider.nativeElement.getBoundingClientRect().height;
        }
        this.finalHeight = height;
        this.renderer.setStyle(this.mapDiv.nativeElement, 'width', 'calc(' + width + 'px - '
            + getComputedStyle(this.wrapper.nativeElement).getPropertyValue('--warp-view-map-margin').trim()
            + ' - '
            + getComputedStyle(this.wrapper.nativeElement).getPropertyValue('--warp-view-map-margin').trim()
            + ')');
        this.renderer.setStyle(this.mapDiv.nativeElement, 'height', 'calc(' + height + 'px - '
            + getComputedStyle(this.wrapper.nativeElement).getPropertyValue('--warp-view-map-margin').trim()
            + ' - '
            + getComputedStyle(this.wrapper.nativeElement).getPropertyValue('--warp-view-map-margin').trim()
            + ')');
        this.width = width;
        this.height = height;
        if (!!this._map) {
            setTimeout((/**
             * @return {?}
             */
            function () { return _this._map.invalidateSize(); }));
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    WarpViewMapComponent.prototype.heatRadiusDidChange = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this._heatLayer.setOptions({ radius: event.detail.valueAsNumber });
        this.LOG.debug(['heatRadiusDidChange'], event.detail.valueAsNumber);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    WarpViewMapComponent.prototype.heatBlurDidChange = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this._heatLayer.setOptions({ blur: event.detail.valueAsNumber });
        this.LOG.debug(['heatBlurDidChange'], event.detail.valueAsNumber);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    WarpViewMapComponent.prototype.heatOpacityDidChange = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        /** @type {?} */
        var minOpacity = event.detail.valueAsNumber / 100;
        this._heatLayer.setOptions({ minOpacity: minOpacity });
        this.LOG.debug(['heatOpacityDidChange'], event.detail.valueAsNumber);
    };
    /**
     * @private
     * @param {?} reZoom
     * @return {?}
     */
    WarpViewMapComponent.prototype.drawMap = /**
     * @private
     * @param {?} reZoom
     * @return {?}
     */
    function (reZoom) {
        this.LOG.debug(['drawMap'], this._data);
        this._options = ChartLib.mergeDeep(this._options, this.defOptions);
        this.timeStart = this._options.map.timeStart;
        moment.tz.setDefault(this._options.timeZone);
        /** @type {?} */
        var gts = this._data;
        if (!gts) {
            return;
        }
        if (typeof gts === 'string') {
            try {
                gts = JSON.parse((/** @type {?} */ (gts)));
            }
            catch (error) {
                return;
            }
        }
        if (GTSLib.isArray(gts) && gts[0] && (gts[0] instanceof DataModel || gts[0].hasOwnProperty('data'))) {
            gts = gts[0];
        }
        if (!!this._map) {
            this._map.invalidateSize(true);
        }
        /** @type {?} */
        var dataList;
        /** @type {?} */
        var params;
        if (gts.data) {
            dataList = (/** @type {?} */ (gts.data));
            this._options = ChartLib.mergeDeep(gts.globalParams || {}, this._options);
            this.timeSpan = this.timeSpan || this._options.map.timeSpan;
            params = gts.params;
        }
        else {
            dataList = gts;
            params = [];
        }
        this.divider = GTSLib.getDivider(this._options.timeUnit);
        this.LOG.debug(['drawMap'], dataList, this._options, gts.globalParams);
        /** @type {?} */
        var flattenGTS = GTSLib.flatDeep(dataList);
        /** @type {?} */
        var size = flattenGTS.length;
        for (var i = 0; i < size; i++) {
            /** @type {?} */
            var item = flattenGTS[i];
            if (item.v) {
                Timsort.sort(item.v, (/**
                 * @param {?} a
                 * @param {?} b
                 * @return {?}
                 */
                function (a, b) { return a[0] - b[0]; }));
                item.i = i;
                i++;
            }
        }
        this.LOG.debug(['GTSLib.flatDeep(dataList)'], flattenGTS);
        this.displayMap({ gts: flattenGTS, params: params }, reZoom);
    };
    /**
     * @private
     * @param {?} color
     * @param {?=} marker
     * @return {?}
     */
    WarpViewMapComponent.prototype.icon = /**
     * @private
     * @param {?} color
     * @param {?=} marker
     * @return {?}
     */
    function (color, marker) {
        if (marker === void 0) { marker = ''; }
        /** @type {?} */
        var c = "" + color.slice(1);
        /** @type {?} */
        var m = marker !== '' ? marker : 'circle';
        return Leaflet.icon({
            iconUrl: "https://cdn.mapmarker.io/api/v1/font-awesome/v4/pin?icon=fa-" + m + "&iconSize=17&size=40&hoffset=" + (m === 'circle' ? 0 : -1) + "&voffset=-4&color=fff&background=" + c,
            iconAnchor: this._iconAnchor,
            popupAnchor: this._popupAnchor
        });
    };
    /**
     * @private
     * @return {?}
     */
    WarpViewMapComponent.prototype.patchMapTileGapBug = /**
     * @private
     * @return {?}
     */
    function () {
        // Workaround for 1px lines appearing in some browsers due to fractional transforms
        // and resulting anti-aliasing. adapted from @cmulders' solution:
        // https://github.com/Leaflet/Leaflet/issues/3575#issuecomment-150544739
        // @ts-ignore
        /** @type {?} */
        var originalInitTile = Leaflet.GridLayer.prototype._initTile;
        if (originalInitTile.isPatched) {
            return;
        }
        Leaflet.GridLayer.include({
            _initTile: /**
             * @param {?} tile
             * @return {?}
             */
            function (tile) {
                originalInitTile.call(this, tile);
                /** @type {?} */
                var tileSize = this.getTileSize();
                tile.style.width = tileSize.x + 1.5 + 'px';
                tile.style.height = tileSize.y + 1 + 'px';
            }
        });
        // @ts-ignore
        Leaflet.GridLayer.prototype._initTile.isPatched = true;
    };
    /**
     * @private
     * @param {?} data
     * @param {?=} reDraw
     * @return {?}
     */
    WarpViewMapComponent.prototype.displayMap = /**
     * @private
     * @param {?} data
     * @param {?=} reDraw
     * @return {?}
     */
    function (data, reDraw) {
        var _this = this;
        if (reDraw === void 0) { reDraw = false; }
        this.currentValuesMarkers = [];
        this.LOG.debug(['drawMap'], data, this._options, this._hiddenData || []);
        if (!this.lowerTimeBound) {
            this.lowerTimeBound = this._options.map.timeSliderMin / this.divider;
            this.upperTimeBound = this._options.map.timeSliderMax / this.divider;
        }
        /** @type {?} */
        var height = this.height || ChartLib.DEFAULT_HEIGHT;
        /** @type {?} */
        var width = this.width || ChartLib.DEFAULT_WIDTH;
        if (this.responsive && this.finalHeight === 0) {
            this.resizeMe();
        }
        else {
            if (this._options.map.showTimeSlider && this.timeSlider && this.timeSlider.nativeElement) {
                height -= this.timeSlider.nativeElement.getBoundingClientRect().height;
            }
            if (this._options.map.showTimeRange && this.timeRangeSlider && this.timeRangeSlider.nativeElement) {
                height -= this.timeRangeSlider.nativeElement.getBoundingClientRect().height;
            }
        }
        this.width = width;
        this.height = height;
        if (data.gts.length === 0) {
            return;
        }
        this.pathData = MapLib.toLeafletMapPaths(data, this._hiddenData || [], this.divider, this._options.scheme) || [];
        this.annotationsData = MapLib.annotationsToLeafletPositions(data, this._hiddenData, this.divider, this._options.scheme) || [];
        this.positionData = MapLib.toLeafletMapPositionArray(data, this._hiddenData || [], this._options.scheme) || [];
        this.geoJson = MapLib.toGeoJSON(data);
        this.LOG.debug(['displayMap'], this.pathData, this.annotationsData, this.positionData);
        if (this._options.map.mapType !== 'NONE') {
            /** @type {?} */
            var map = MapLib.mapTypes[this._options.map.mapType || 'DEFAULT'];
            /** @type {?} */
            var mapOpts = {
                maxZoom: 24,
                maxNativeZoom: 19,
            };
            if (map.attribution) {
                mapOpts.attribution = map.attribution;
            }
            if (map.subdomains) {
                mapOpts.subdomains = map.subdomains;
            }
            this.tilesLayer = Leaflet.tileLayer(map.link, mapOpts);
        }
        if (!!this._map) {
            this.LOG.debug(['displayMap'], 'map exists');
            this.pathDataLayer.clearLayers();
            this.annotationsDataLayer.clearLayers();
            this.positionDataLayer.clearLayers();
            this.geoJsonLayer.clearLayers();
            this.tileLayerGroup.clearLayers();
        }
        else {
            this.LOG.debug(['displayMap'], 'build map');
            this._map = Leaflet.map(this.mapDiv.nativeElement, {
                preferCanvas: true,
                layers: [this.tileLayerGroup, this.geoJsonLayer, this.pathDataLayer, this.annotationsDataLayer, this.positionDataLayer],
                zoomAnimation: true,
                maxZoom: 24
            });
            this.tilesLayer.addTo(this._map);
            this.LOG.debug(['displayMap'], 'build map', this.tilesLayer);
            this.geoJsonLayer.bringToBack();
            this.tilesLayer.bringToBack(); // TODO: tester
            this._map.on('load', (/**
             * @return {?}
             */
            function () { return _this.LOG.debug(['displayMap', 'load'], _this._map.getCenter().lng, _this.currentLong, _this._map.getZoom()); }));
            this._map.on('zoomend', (/**
             * @return {?}
             */
            function () {
                if (!_this.firstDraw) {
                    _this.LOG.debug(['moveend'], _this._map.getCenter());
                    _this.currentZoom = _this._map.getZoom();
                }
            }));
            this._map.on('moveend', (/**
             * @return {?}
             */
            function () {
                if (!_this.firstDraw) {
                    _this.LOG.debug(['moveend'], _this._map.getCenter());
                    _this.currentLat = _this._map.getCenter().lat;
                    _this.currentLong = _this._map.getCenter().lng;
                }
            }));
        }
        /** @type {?} */
        var size = (this.pathData || []).length;
        this.LOG.debug(['displayMap'], 'build map done', size);
        for (var i = 0; i < size; i++) {
            /** @type {?} */
            var d = this.pathData[i];
            if (!!d) {
                /** @type {?} */
                var plottedGts = this.updateGtsPath(d);
                if (!!plottedGts) {
                    this.currentValuesMarkers.push(plottedGts.beforeCurrentValue);
                    this.currentValuesMarkers.push(plottedGts.afterCurrentValue);
                    this.currentValuesMarkers.push(plottedGts.currentValue);
                }
            }
        }
        this.LOG.debug(['displayMap'], 'this.pathData', this.pathData);
        size = (this.annotationsData || []).length;
        for (var i = 0; i < size; i++) {
            /** @type {?} */
            var d = this.annotationsData[i];
            /** @type {?} */
            var plottedGts = this.updateGtsPath(d);
            if (!!plottedGts) {
                if (d.render === 'line') {
                    this.currentValuesMarkers.push(plottedGts.beforeCurrentValue);
                    this.currentValuesMarkers.push(plottedGts.afterCurrentValue);
                }
                this.currentValuesMarkers.push(plottedGts.currentValue);
            }
        }
        if (!!this._map) {
            this.pathDataLayer = Leaflet.featureGroup(this.currentValuesMarkers || []).addTo(this._map);
        }
        this.LOG.debug(['displayMap', 'annotationsMarkers'], this.annotationsMarkers);
        this.LOG.debug(['displayMap', 'this.hiddenData'], this.hiddenData);
        this.LOG.debug(['displayMap', 'this.positionData'], this.positionData);
        // Create the positions arrays
        size = (this.positionData || []).length;
        for (var i = 0; i < size; i++) {
            /** @type {?} */
            var d = this.positionData[i];
            this.positionArraysMarkers = this.positionArraysMarkers.concat(this.updatePositionArray(d));
        }
        this.LOG.debug(['displayMap'], 'this.po sitionData');
        size = (this.annotationsData || []).length;
        for (var i = 0; i < size; i++) {
            /** @type {?} */
            var d = this.annotationsData[i];
            this.positionArraysMarkers = this.positionArraysMarkers.concat(this.updateAnnotation(d));
        }
        this.LOG.debug(['displayMap'], 'this.annotationsData');
        (this._options.map.tiles || []).forEach((/**
         * @param {?} t
         * @return {?}
         */
        function (t) {
            _this.LOG.debug(['displayMap'], t);
            if (_this._options.map.showTimeRange) {
                _this.tileLayerGroup.addLayer(Leaflet.tileLayer(t
                    .replace('{start}', moment(_this.timeStart).toISOString())
                    .replace('{end}', moment(_this.timeEnd).toISOString()), {
                    subdomains: 'abcd',
                    maxNativeZoom: 19,
                    maxZoom: 40
                }));
            }
            else {
                _this.tileLayerGroup.addLayer(Leaflet.tileLayer(t, {
                    subdomains: 'abcd',
                    maxNativeZoom: 19,
                    maxZoom: 40
                }));
            }
        }));
        this.LOG.debug(['displayMap'], 'this.tiles');
        this.LOG.debug(['displayMap', 'positionArraysMarkers'], this.positionArraysMarkers);
        this.LOG.debug(['displayMap', 'annotationsMarkers'], this.annotationsMarkers);
        size = (this.positionArraysMarkers || []).length;
        for (var i = 0; i < size; i++) {
            /** @type {?} */
            var m = this.positionArraysMarkers[i];
            m.addTo(this.positionDataLayer);
        }
        size = (this.annotationsMarkers || []).length;
        for (var i = 0; i < size; i++) {
            /** @type {?} */
            var m = this.annotationsMarkers[i];
            m.addTo(this.annotationsDataLayer);
        }
        this.LOG.debug(['displayMap', 'geoJson'], this.geoJson);
        size = (this.geoJson || []).length;
        var _loop_1 = function (i) {
            /** @type {?} */
            var m = this_1.geoJson[i];
            /** @type {?} */
            var color = ColorLib.getColor(i, this_1._options.scheme);
            /** @type {?} */
            var opts = (/** @type {?} */ ({
                style: (/**
                 * @return {?}
                 */
                function () { return ({
                    color: (data.params && data.params[i]) ? data.params[i].color || color : color,
                    fillColor: (data.params && data.params[i])
                        ? ColorLib.transparentize(data.params[i].fillColor || color)
                        : ColorLib.transparentize(color),
                }); })
            }));
            if (m.geometry.type === 'Point') {
                opts.pointToLayer = (/**
                 * @param {?} geoJsonPoint
                 * @param {?} latlng
                 * @return {?}
                 */
                function (geoJsonPoint, latlng) { return Leaflet.marker(latlng, {
                    icon: _this.icon(color, (data.params && data.params[i]) ? data.params[i].marker : 'circle'),
                    opacity: 1,
                }); });
            }
            /** @type {?} */
            var display = '';
            /** @type {?} */
            var geoShape = Leaflet.geoJSON(m, opts);
            if (m.properties) {
                Object.keys(m.properties).forEach((/**
                 * @param {?} k
                 * @return {?}
                 */
                function (k) { return display += "<b>" + k + "</b>: " + m.properties[k] + "<br />"; }));
                geoShape.bindPopup(display);
            }
            geoShape.addTo(this_1.geoJsonLayer);
        };
        var this_1 = this;
        for (var i = 0; i < size; i++) {
            _loop_1(i);
        }
        if (this.pathData.length > 0 || this.positionData.length > 0 || this.annotationsData.length > 0 || this.geoJson.length > 0) {
            // Fit map to curves
            /** @type {?} */
            var group = Leaflet.featureGroup([this.geoJsonLayer, this.annotationsDataLayer, this.positionDataLayer, this.pathDataLayer]);
            this.LOG.debug(['displayMap', 'setView'], 'fitBounds', group.getBounds());
            this.LOG.debug(['displayMap', 'setView'], { lat: this.currentLat, lng: this.currentLong }, {
                lat: this._options.map.startLat,
                lng: this._options.map.startLong
            });
            this.bounds = group.getBounds();
            setTimeout((/**
             * @return {?}
             */
            function () {
                if (!!_this.bounds && _this.bounds.isValid()) {
                    if ((_this.currentLat || _this._options.map.startLat) && (_this.currentLong || _this._options.map.startLong)) {
                        _this._map.setView({
                            lat: _this.currentLat || _this._options.map.startLat || 0,
                            lng: _this.currentLong || _this._options.map.startLong || 0
                        }, _this.currentZoom || _this._options.map.startZoom || 10, { animate: false, duration: 500 });
                    }
                    else {
                        _this._map.fitBounds(_this.bounds, { padding: [1, 1], animate: false, duration: 0 });
                        //   this.currentZoom = this._map.getBoundsZoom(this.bounds, false);
                    }
                    _this.currentLat = _this._map.getCenter().lat;
                    _this.currentLong = _this._map.getCenter().lng;
                    //  this.currentZoom = this._map.getZoom();
                }
                else {
                    _this.LOG.debug(['displayMap', 'setView'], { lat: _this.currentLat, lng: _this.currentLong });
                    _this._map.setView({
                        lat: _this.currentLat || _this._options.map.startLat || 0,
                        lng: _this.currentLong || _this._options.map.startLong || 0
                    }, _this.currentZoom || _this._options.map.startZoom || 10, {
                        animate: false,
                        duration: 500
                    });
                }
            }), 10);
        }
        else {
            this.LOG.debug(['displayMap', 'lost'], 'lost', this.currentZoom, this._options.map.startZoom);
            this._map.setView([
                this.currentLat || this._options.map.startLat || 0,
                this.currentLong || this._options.map.startLong || 0
            ], this.currentZoom || this._options.map.startZoom || 2, {
                animate: false,
                duration: 0
            });
        }
        if (this.heatData && this.heatData.length > 0) {
            this._heatLayer = ((/** @type {?} */ (Leaflet))).heatLayer(this.heatData, {
                radius: this._options.map.heatRadius,
                blur: this._options.map.heatBlur,
                minOpacity: this._options.map.heatOpacity
            });
            this._heatLayer.addTo(this._map);
        }
        this.firstDraw = false;
        this.resizeMe();
        this.patchMapTileGapBug();
        this.chartDraw.emit(true);
    };
    /**
     * @param {?} gts
     * @return {?}
     */
    WarpViewMapComponent.prototype.updateAnnotation = /**
     * @param {?} gts
     * @return {?}
     */
    function (gts) {
        /** @type {?} */
        var positions = [];
        /** @type {?} */
        var icon;
        /** @type {?} */
        var size;
        switch (gts.render) {
            case 'marker':
                icon = this.icon(gts.color, gts.marker);
                size = (gts.path || []).length;
                for (var i = 0; i < size; i++) {
                    /** @type {?} */
                    var g = gts.path[i];
                    /** @type {?} */
                    var marker = Leaflet.marker(g, { icon: icon, opacity: 1 });
                    marker.bindPopup(g.val.toString());
                    positions.push(marker);
                }
                break;
            case 'weightedDots':
                size = (gts.path || []).length;
                for (var i = 0; i < size; i++) {
                    /** @type {?} */
                    var p = gts.path[i];
                    if ((this._hiddenData || []).filter((/**
                     * @param {?} h
                     * @return {?}
                     */
                    function (h) { return h === gts.key; })).length === 0) {
                        /** @type {?} */
                        var v = parseInt(p.val, 10);
                        if (isNaN(v)) {
                            v = 0;
                        }
                        /** @type {?} */
                        var radius = (v - (gts.minValue || 0)) * 50 / (gts.maxValue || 50);
                        /** @type {?} */
                        var marker = Leaflet.circleMarker(p, {
                            radius: radius === 0 ? 1 : radius,
                            color: gts.borderColor,
                            fillColor: gts.color, fillOpacity: 0.5,
                            weight: 1
                        });
                        this.addPopup(gts, p.val, marker);
                        positions.push(marker);
                    }
                }
                break;
            case 'dots':
            default:
                size = (gts.path || []).length;
                for (var i = 0; i < size; i++) {
                    /** @type {?} */
                    var g = gts.path[i];
                    /** @type {?} */
                    var marker = Leaflet.circleMarker(g, {
                        radius: gts.baseRadius,
                        color: gts.color,
                        fillColor: gts.color,
                        fillOpacity: 1
                    });
                    marker.bindPopup(g.val.toString());
                    positions.push(marker);
                }
                break;
        }
        return positions;
    };
    /**
     * @private
     * @param {?} gts
     * @return {?}
     */
    WarpViewMapComponent.prototype.updateGtsPath = /**
     * @private
     * @param {?} gts
     * @return {?}
     */
    function (gts) {
        /** @type {?} */
        var beforeCurrentValue = Leaflet.polyline(MapLib.pathDataToLeaflet(gts.path, { to: 0 }), {
            color: gts.color,
            opacity: 1,
        });
        /** @type {?} */
        var afterCurrentValue = Leaflet.polyline(MapLib.pathDataToLeaflet(gts.path, { from: 0 }), {
            color: gts.color,
            opacity: 0.7,
        });
        /** @type {?} */
        var currentValue;
        // Let's verify we have a path... No path, no marker
        /** @type {?} */
        var size = (gts.path || []).length;
        for (var i = 0; i < size; i++) {
            /** @type {?} */
            var p = gts.path[i];
            /** @type {?} */
            var date = void 0;
            if (this._options.timeMode && this._options.timeMode === 'timestamp') {
                date = parseInt(p.ts, 10);
            }
            else {
                date = (moment(parseInt(p.ts, 10))
                    .utc(true).toISOString() || '')
                    .replace('Z', this._options.timeZone === 'UTC' ? 'Z' : '');
            }
            currentValue = Leaflet.circleMarker([p.lat, p.lon], { radius: MapLib.BASE_RADIUS, color: gts.color, fillColor: gts.color, fillOpacity: 0.7 })
                .bindPopup("<p>" + date + "</p><p><b>" + gts.key + "</b>: " + p.val.toString() + "</p>");
        }
        if (size > 0) {
            return {
                beforeCurrentValue: beforeCurrentValue,
                afterCurrentValue: afterCurrentValue,
                currentValue: currentValue,
            };
        }
        else {
            return undefined;
        }
    };
    /**
     * @private
     * @param {?} positionData
     * @param {?} value
     * @param {?} marker
     * @return {?}
     */
    WarpViewMapComponent.prototype.addPopup = /**
     * @private
     * @param {?} positionData
     * @param {?} value
     * @param {?} marker
     * @return {?}
     */
    function (positionData, value, marker) {
        if (!!positionData) {
            /** @type {?} */
            var content_1 = '';
            if (positionData.key) {
                content_1 = "<p><b>" + positionData.key + "</b>: " + (value || 'na') + "</p>";
            }
            Object.keys(positionData.properties || []).forEach((/**
             * @param {?} k
             * @return {?}
             */
            function (k) { return content_1 += "<b>" + k + "</b>: " + positionData.properties[k] + "<br />"; }));
            marker.bindPopup(content_1);
        }
    };
    /**
     * @private
     * @param {?} positionData
     * @return {?}
     */
    WarpViewMapComponent.prototype.updatePositionArray = /**
     * @private
     * @param {?} positionData
     * @return {?}
     */
    function (positionData) {
        /** @type {?} */
        var positions = [];
        /** @type {?} */
        var polyline;
        /** @type {?} */
        var icon;
        /** @type {?} */
        var result;
        /** @type {?} */
        var inStep;
        /** @type {?} */
        var size;
        this.LOG.debug(['updatePositionArray'], positionData);
        switch (positionData.render) {
            case 'path':
                polyline = Leaflet.polyline(positionData.positions, { color: positionData.color, opacity: 1 });
                positions.push(polyline);
                break;
            case 'marker':
                icon = this.icon(positionData.color, positionData.marker);
                size = (positionData.positions || []).length;
                for (var i = 0; i < size; i++) {
                    /** @type {?} */
                    var p = positionData.positions[i];
                    if ((this.hiddenData || []).filter((/**
                     * @param {?} h
                     * @return {?}
                     */
                    function (h) { return h === positionData.key; })).length === 0) {
                        /** @type {?} */
                        var marker = Leaflet.marker({ lat: p[0], lng: p[1] }, { icon: icon, opacity: 1 });
                        this.addPopup(positionData, p[2], marker);
                        positions.push(marker);
                    }
                    this.LOG.debug(['updatePositionArray', 'build marker'], icon);
                }
                break;
            case 'coloredWeightedDots':
                this.LOG.debug(['updatePositionArray', 'coloredWeightedDots'], positionData);
                result = [];
                inStep = [];
                for (var j = 0; j < positionData.numColorSteps; j++) {
                    result[j] = 0;
                    inStep[j] = 0;
                }
                size = (positionData.positions || []).length;
                for (var i = 0; i < size; i++) {
                    /** @type {?} */
                    var p = positionData.positions[i];
                    if ((this._hiddenData || []).filter((/**
                     * @param {?} h
                     * @return {?}
                     */
                    function (h) { return h === positionData.key; })).length === 0) {
                        this.LOG.debug(['updatePositionArray', 'coloredWeightedDots', 'radius'], positionData.baseRadius * p[4]);
                        /** @type {?} */
                        var marker = Leaflet.circleMarker({ lat: p[0], lng: p[1] }, {
                            radius: positionData.baseRadius * (parseInt(p[4], 10) + 1),
                            color: positionData.borderColor,
                            fillColor: ColorLib.rgb2hex(positionData.colorGradient[p[5]].r, positionData.colorGradient[p[5]].g, positionData.colorGradient[p[5]].b),
                            fillOpacity: 0.7,
                        });
                        this.addPopup(positionData, p[2], marker);
                        positions.push(marker);
                    }
                }
                break;
            case 'weightedDots':
                size = (positionData.positions || []).length;
                for (var i = 0; i < size; i++) {
                    /** @type {?} */
                    var p = positionData.positions[i];
                    if ((this._hiddenData || []).filter((/**
                     * @param {?} h
                     * @return {?}
                     */
                    function (h) { return h === positionData.key; })).length === 0) {
                        /** @type {?} */
                        var marker = Leaflet.circleMarker({ lat: p[0], lng: p[1] }, {
                            radius: positionData.baseRadius * (parseInt(p[4], 10) + 1),
                            color: positionData.borderColor,
                            fillColor: positionData.color, fillOpacity: 0.7,
                        });
                        this.addPopup(positionData, p[2], marker);
                        positions.push(marker);
                    }
                }
                break;
            case 'dots':
            default:
                size = (positionData.positions || []).length;
                for (var i = 0; i < size; i++) {
                    /** @type {?} */
                    var p = positionData.positions[i];
                    if ((this._hiddenData || []).filter((/**
                     * @param {?} h
                     * @return {?}
                     */
                    function (h) { return h === positionData.key; })).length === 0) {
                        /** @type {?} */
                        var marker = Leaflet.circleMarker({ lat: p[0], lng: p[1] }, {
                            radius: positionData.baseRadius,
                            color: positionData.borderColor,
                            fillColor: positionData.color,
                            fillOpacity: 1,
                        });
                        this.addPopup(positionData, p[2], marker);
                        positions.push(marker);
                    }
                }
                break;
        }
        return positions;
    };
    /**
     * @return {?}
     */
    WarpViewMapComponent.prototype.resize = /**
     * @return {?}
     */
    function () {
        var _this = this;
        return new Promise((/**
         * @param {?} resolve
         * @return {?}
         */
        function (resolve) {
            _this.resizeMe();
            resolve(true);
        }));
    };
    /**
     * @param {?} event
     * @return {?}
     */
    WarpViewMapComponent.prototype.onRangeSliderChange = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.LOG.debug(['onRangeSliderChange'], event);
        this.timeStart = event.value || moment().valueOf();
        this.timeEnd = event.highValue || moment().valueOf();
        this.drawMap(true);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    WarpViewMapComponent.prototype.onRangeSliderWindowChange = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.LOG.debug(['onRangeSliderWindowChange'], event);
        if (this.lowerTimeBound !== event.min || this.upperTimeBound !== event.max) {
            this.lowerTimeBound = event.min;
            this.upperTimeBound = event.max;
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    WarpViewMapComponent.prototype.onSliderChange = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.LOG.debug(['onSliderChange'], event, moment(event.value).toISOString());
        this._firstDraw = false;
        if (this.timeEnd !== event.value) {
            this.timeSpan = this.timeSpan || this._options.map.timeSpan;
            this.timeEnd = event.value || moment().valueOf();
            this.timeStart = (event.value || moment().valueOf()) - this.timeSpan / this.divider;
            this.LOG.debug(['onSliderChange'], moment(this.timeStart).toISOString(), moment(this.timeEnd).toISOString());
            this.change.emit(this.timeStart);
            this.drawMap(true);
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    WarpViewMapComponent.prototype.updateTimeSpan = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.LOG.debug(['updateTimeSpan'], event.target.value);
        if (this.timeSpan !== event.target.value) {
            this.timeSpan = event.target.value;
            this.timeStart = (this.timeEnd || moment().valueOf()) - this.timeSpan / this.divider;
            this.drawMap(true);
        }
    };
    WarpViewMapComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-map',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"wrapper\" #wrapper (resized)=\"resizeMe()\">\n  <div class=\"map-container\">\n    <div #mapDiv></div>\n    <div *ngIf=\"_options.map.showTimeSlider && !_options.map.showTimeRange\" #timeSlider>\n      <warpview-slider\n        [min]=\"_options.map.timeSliderMin / divider\" [max]=\"_options.map.timeSliderMax / divider\"\n        [value]=\"minTimeValue / divider\"\n        [step]=\"_options.map.timeSliderStep\" [mode]=\"_options.map.timeSliderMode\"\n        (change)=\"onSliderChange($event)\"\n        [debug]=\"debug\"\n      ></warpview-slider>\n    </div>\n    <div *ngIf=\"_options.map.showTimeSlider && _options.map.showTimeRange\" #timeRangeSlider>\n      <!--    <warpview-range-slider *ngIf=\"!_options.map.timeSpan && lowerTimeBound\"\n                                  [min]=\"lowerTimeBound\" [max]=\"upperTimeBound\"\n                                  [minValue]=\"minTimeValue / divider\"\n                                  [maxValue]=\"maxTimeValue / divider\"\n                                  [step]=\"_options.map.timeSliderStep\"\n                                  [mode]=\"_options.map.timeSliderMode\"\n                                  [debug]=\"_debug\"\n                                  (change)=\"onRangeSliderChange($event)\"\n           ></warpview-range-slider>-->\n\n      <warpview-range-slider\n        [min]=\"(_options.map.timeSliderMin / divider)\" [max]=\"(_options.map.timeSliderMax / divider)\"\n        [minValue]=\"minTimeValue / divider\"\n        [maxValue]=\"maxTimeValue / divider\"\n        [mode]=\"_options.map.timeSliderMode\"\n        [debug]=\"debug\"\n        (change)=\"onRangeSliderWindowChange($event)\"\n      ></warpview-range-slider>\n      <warpview-slider *ngIf=\"_options.map.timeSpan && lowerTimeBound\"\n                       [min]=\"lowerTimeBound\" [max]=\"upperTimeBound\"\n                       [step]=\"(this.timeSpan || this._options.map.timeSpan) / divider\"\n                       [mode]=\"_options.map.timeSliderMode\"\n                       [debug]=\"debug\"\n                       (change)=\"onSliderChange($event)\"\n      ></warpview-slider>\n      <div *ngIf=\"_options.map?.timeSpan\">\n        <label for=\"timeSpan\">Timespan: </label>\n        <select id=\"timeSpan\" (change)=\"updateTimeSpan($event)\">\n          <option *ngFor=\"let ts of _options.map.timeSpanList\" [value]=\"ts.value\">{{ts.label}}</option>\n        </select>\n      </div>\n    </div>\n    <warpview-heatmap-sliders\n      *ngIf=\"_options.map.heatControls\"\n      (heatRadiusDidChange)=\"heatRadiusDidChange($event)\"\n      (heatBlurDidChange)=\"heatBlurDidChange($event)\"\n      (heatOpacityDidChange)=\"heatOpacityDidChange($event)\"\n    ></warpview-heatmap-sliders>\n  </div>\n\n</div>\n",
                    encapsulation: ViewEncapsulation.None,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host,warp-view-map,warpview-map{width:100%;height:100%;min-height:100px}:host div.wrapper,warp-view-map div.wrapper,warpview-map div.wrapper{width:100%;height:100%;min-height:100px;padding:var(--warp-view-map-margin);overflow:hidden}:host div.wrapper div.leaflet-container,:host div.wrapper div.map-container,warp-view-map div.wrapper div.leaflet-container,warp-view-map div.wrapper div.map-container,warpview-map div.wrapper div.leaflet-container,warpview-map div.wrapper div.map-container{min-width:100%;min-height:100px;width:100%;height:100%;position:relative;overflow:hidden}:host div.wrapper .leaflet-container,warp-view-map div.wrapper .leaflet-container,warpview-map div.wrapper .leaflet-container{min-width:100%;min-height:100%;width:100%;height:100%}"]
                }] }
    ];
    /** @nocollapse */
    WarpViewMapComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: SizeService },
        { type: Renderer2 }
    ]; };
    WarpViewMapComponent.propDecorators = {
        mapDiv: [{ type: ViewChild, args: ['mapDiv', { static: true },] }],
        wrapper: [{ type: ViewChild, args: ['wrapper', { static: true },] }],
        timeSlider: [{ type: ViewChild, args: ['timeSlider', { static: false },] }],
        timeRangeSlider: [{ type: ViewChild, args: ['timeRangeSlider', { static: false },] }],
        heatData: [{ type: Input, args: ['heatData',] }],
        responsive: [{ type: Input, args: ['responsive',] }],
        showLegend: [{ type: Input, args: ['showLegend',] }],
        width: [{ type: Input, args: ['width',] }],
        height: [{ type: Input, args: ['height',] }],
        debug: [{ type: Input, args: ['debug',] }],
        options: [{ type: Input, args: ['options',] }],
        data: [{ type: Input, args: ['data',] }],
        hiddenData: [{ type: Input, args: ['hiddenData',] }],
        change: [{ type: Output, args: ['change',] }],
        chartDraw: [{ type: Output, args: ['chartDraw',] }]
    };
    return WarpViewMapComponent;
}());
export { WarpViewMapComponent };
if (false) {
    /** @type {?} */
    WarpViewMapComponent.prototype.mapDiv;
    /** @type {?} */
    WarpViewMapComponent.prototype.wrapper;
    /** @type {?} */
    WarpViewMapComponent.prototype.timeSlider;
    /** @type {?} */
    WarpViewMapComponent.prototype.timeRangeSlider;
    /** @type {?} */
    WarpViewMapComponent.prototype.heatData;
    /** @type {?} */
    WarpViewMapComponent.prototype.responsive;
    /** @type {?} */
    WarpViewMapComponent.prototype.showLegend;
    /** @type {?} */
    WarpViewMapComponent.prototype.width;
    /** @type {?} */
    WarpViewMapComponent.prototype.height;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype.bounds;
    /** @type {?} */
    WarpViewMapComponent.prototype.change;
    /** @type {?} */
    WarpViewMapComponent.prototype.chartDraw;
    /** @type {?} */
    WarpViewMapComponent.prototype.currentZoom;
    /** @type {?} */
    WarpViewMapComponent.prototype.currentLat;
    /** @type {?} */
    WarpViewMapComponent.prototype.currentLong;
    /** @type {?} */
    WarpViewMapComponent.prototype.minTimeValue;
    /** @type {?} */
    WarpViewMapComponent.prototype.maxTimeValue;
    /** @type {?} */
    WarpViewMapComponent.prototype.divider;
    /** @type {?} */
    WarpViewMapComponent.prototype.lowerTimeBound;
    /** @type {?} */
    WarpViewMapComponent.prototype.upperTimeBound;
    /** @type {?} */
    WarpViewMapComponent.prototype.timeSpan;
    /** @type {?} */
    WarpViewMapComponent.prototype._options;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype._firstDraw;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype.LOG;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype._data;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype._debug;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype.defOptions;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype._map;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype._hiddenData;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype.currentValuesMarkers;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype.annotationsMarkers;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype.positionArraysMarkers;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype._iconAnchor;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype._popupAnchor;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype._heatLayer;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype.pathData;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype.annotationsData;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype.positionData;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype.geoJson;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype.timeStart;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype.timeEnd;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype.firstDraw;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype.finalHeight;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype.pathDataLayer;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype.annotationsDataLayer;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype.positionDataLayer;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype.tileLayerGroup;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype.geoJsonLayer;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype.tilesLayer;
    /** @type {?} */
    WarpViewMapComponent.prototype.el;
    /** @type {?} */
    WarpViewMapComponent.prototype.sizeService;
    /**
     * @type {?}
     * @private
     */
    WarpViewMapComponent.prototype.renderer;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LW1hcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VueC93YXJwdmlldy8iLCJzb3VyY2VzIjpbInNyYy9saWIvZWxlbWVudHMvd2FycC12aWV3LW1hcC93YXJwLXZpZXctbWFwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFVLE1BQU0sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ2xJLE9BQU8sRUFBQyxLQUFLLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUN4QyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDMUMsT0FBTyxPQUEyQixNQUFNLFNBQVMsQ0FBQztBQUNsRCxPQUFPLGNBQWMsQ0FBQztBQUN0QixPQUFPLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDL0MsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ2hELE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUMzQyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDM0MsT0FBTyxNQUFNLE1BQU0saUJBQWlCLENBQUM7QUFDckMsT0FBTyxTQUFTLE1BQU0sWUFBWSxDQUFDO0FBQ25DLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSwrQkFBK0IsQ0FBQztBQUMxRCxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0scUJBQXFCLENBQUM7Ozs7QUFLNUM7SUE0SEUsOEJBQW1CLEVBQWMsRUFBUyxXQUF3QixFQUFVLFFBQW1CO1FBQS9GLGlCQVFD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Ozs7SUFDcEIscUNBQW1COzs7OztJQUNuQixzQ0FBdUI7Ozs7O0lBQ3ZCLDBDQWNLOzs7OztJQUVMLG9DQUEwQjs7Ozs7SUFDMUIsMkNBQThCOzs7OztJQUM5QixvREFBa0M7Ozs7O0lBQ2xDLGtEQUFnQzs7Ozs7SUFDaEMscURBQW1DOzs7OztJQUNuQywyQ0FBd0Q7Ozs7O0lBQ3hELDRDQUF5RDs7Ozs7SUFDekQsMENBQXdCOzs7OztJQUN4Qix3Q0FBNkI7Ozs7O0lBQzdCLCtDQUFvQzs7Ozs7SUFDcEMsNENBQWlDOzs7OztJQUNqQyx1Q0FBNEI7Ozs7O0lBQzVCLHlDQUEwQjs7Ozs7SUFDMUIsdUNBQXdCOzs7OztJQUN4Qix5Q0FBeUI7Ozs7O0lBQ3pCLDJDQUF3Qjs7Ozs7SUFFeEIsNkNBQStDOzs7OztJQUMvQyxvREFBc0Q7Ozs7O0lBQ3RELGlEQUFtRDs7Ozs7SUFDbkQsOENBQWdEOzs7OztJQUNoRCw0Q0FBOEM7Ozs7O0lBQzlDLDBDQUFzQzs7SUFFMUIsa0NBQXFCOztJQUFFLDJDQUErQjs7Ozs7SUFBRSx3Q0FBMkIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogIENvcHlyaWdodCAyMDIwICBTZW5YIFMuQS5TLlxuICpcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50LCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkluaXQsIE91dHB1dCwgUmVuZGVyZXIyLCBWaWV3Q2hpbGQsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7UGFyYW19IGZyb20gJy4uLy4uL21vZGVsL3BhcmFtJztcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICcuLi8uLi91dGlscy9sb2dnZXInO1xuaW1wb3J0IExlYWZsZXQsIHtUaWxlTGF5ZXJPcHRpb25zfSBmcm9tICdsZWFmbGV0JztcbmltcG9ydCAnbGVhZmxldC5oZWF0JztcbmltcG9ydCAnbGVhZmxldC5tYXJrZXJjbHVzdGVyJztcbmltcG9ydCB7Q29sb3JMaWJ9IGZyb20gJy4uLy4uL3V0aWxzL2NvbG9yLWxpYic7XG5pbXBvcnQge0NoYXJ0TGlifSBmcm9tICcuLi8uLi91dGlscy9jaGFydC1saWInO1xuaW1wb3J0IHtEYXRhTW9kZWx9IGZyb20gJy4uLy4uL21vZGVsL2RhdGFNb2RlbCc7XG5pbXBvcnQge01hcExpYn0gZnJvbSAnLi4vLi4vdXRpbHMvbWFwLWxpYic7XG5pbXBvcnQge0dUU0xpYn0gZnJvbSAnLi4vLi4vdXRpbHMvZ3RzLmxpYic7XG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudC10aW1lem9uZSc7XG5pbXBvcnQgZGVlcEVxdWFsIGZyb20gJ2RlZXAtZXF1YWwnO1xuaW1wb3J0IHtTaXplU2VydmljZX0gZnJvbSAnLi4vLi4vc2VydmljZXMvcmVzaXplLnNlcnZpY2UnO1xuaW1wb3J0IHtUaW1zb3J0fSBmcm9tICcuLi8uLi91dGlscy90aW1zb3J0JztcblxuLyoqXG4gKlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICd3YXJwdmlldy1tYXAnLFxuICB0ZW1wbGF0ZVVybDogJy4vd2FycC12aWV3LW1hcC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3dhcnAtdmlldy1tYXAuY29tcG9uZW50LnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcbmV4cG9ydCBjbGFzcyBXYXJwVmlld01hcENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgQFZpZXdDaGlsZCgnbWFwRGl2Jywge3N0YXRpYzogdHJ1ZX0pIG1hcERpdjogRWxlbWVudFJlZjxIVE1MRGl2RWxlbWVudD47XG4gIEBWaWV3Q2hpbGQoJ3dyYXBwZXInLCB7c3RhdGljOiB0cnVlfSkgd3JhcHBlcjogRWxlbWVudFJlZjxIVE1MRGl2RWxlbWVudD47XG4gIEBWaWV3Q2hpbGQoJ3RpbWVTbGlkZXInLCB7c3RhdGljOiBmYWxzZX0pIHRpbWVTbGlkZXI6IEVsZW1lbnRSZWY8SFRNTERpdkVsZW1lbnQ+O1xuICBAVmlld0NoaWxkKCd0aW1lUmFuZ2VTbGlkZXInLCB7c3RhdGljOiBmYWxzZX0pIHRpbWVSYW5nZVNsaWRlcjogRWxlbWVudFJlZjxIVE1MRGl2RWxlbWVudD47XG5cbiAgQElucHV0KCdoZWF0RGF0YScpIGhlYXREYXRhOiBhbnlbXSA9IFtdO1xuICBASW5wdXQoJ3Jlc3BvbnNpdmUnKSByZXNwb25zaXZlID0gZmFsc2U7XG4gIEBJbnB1dCgnc2hvd0xlZ2VuZCcpIHNob3dMZWdlbmQgPSB0cnVlO1xuICBASW5wdXQoJ3dpZHRoJykgd2lkdGggPSBDaGFydExpYi5ERUZBVUxUX1dJRFRIO1xuICBASW5wdXQoJ2hlaWdodCcpIGhlaWdodCA9IENoYXJ0TGliLkRFRkFVTFRfSEVJR0hUO1xuICBwcml2YXRlIGJvdW5kczogTGVhZmxldC5MYXRMbmdCb3VuZHM7XG5cbiAgQElucHV0KCdkZWJ1ZycpIHNldCBkZWJ1ZyhkZWJ1ZzogYm9vbGVhbikge1xuICAgIHRoaXMuX2RlYnVnID0gZGVidWc7XG4gICAgdGhpcy5MT0cuc2V0RGVidWcoZGVidWcpO1xuICB9XG5cbiAgZ2V0IGRlYnVnKCkge1xuICAgIHJldHVybiB0aGlzLl9kZWJ1ZztcbiAgfVxuXG4gIEBJbnB1dCgnb3B0aW9ucycpIHNldCBvcHRpb25zKG9wdGlvbnM6IFBhcmFtKSB7XG4gICAgdGhpcy5MT0cuZGVidWcoWydvbk9wdGlvbnMnXSwgb3B0aW9ucyk7XG4gICAgaWYgKCFkZWVwRXF1YWwodGhpcy5fb3B0aW9ucywgb3B0aW9ucykpIHtcbiAgICAgIGNvbnN0IHJlWm9vbSA9XG4gICAgICAgIG9wdGlvbnMubWFwLnN0YXJ0Wm9vbSAhPT0gdGhpcy5fb3B0aW9ucy5tYXAuc3RhcnRab29tXG4gICAgICAgIHx8IG9wdGlvbnMubWFwLnN0YXJ0TGF0ICE9PSB0aGlzLl9vcHRpb25zLm1hcC5zdGFydExhdFxuICAgICAgICB8fCBvcHRpb25zLm1hcC5zdGFydExvbmcgIT09IHRoaXMuX29wdGlvbnMubWFwLnN0YXJ0TG9uZztcbiAgICAgIHRoaXMuX29wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgdGhpcy5kaXZpZGVyID0gR1RTTGliLmdldERpdmlkZXIodGhpcy5fb3B0aW9ucy50aW1lVW5pdCk7XG4gICAgICB0aGlzLmRyYXdNYXAocmVab29tKTtcbiAgICB9XG4gIH1cblxuICBASW5wdXQoJ2RhdGEnKSBzZXQgZGF0YShkYXRhOiBhbnkpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ29uRGF0YSddLCBkYXRhKTtcbiAgICB0aGlzLmN1cnJlbnRWYWx1ZXNNYXJrZXJzID0gW107XG4gICAgdGhpcy5hbm5vdGF0aW9uc01hcmtlcnMgPSBbXTtcbiAgICB0aGlzLnBvc2l0aW9uQXJyYXlzTWFya2VycyA9IFtdO1xuICAgIGlmICghIWRhdGEpIHtcbiAgICAgIHRoaXMuX2RhdGEgPSBkYXRhO1xuICAgICAgdGhpcy5kcmF3TWFwKHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBkYXRhKCkge1xuICAgIHJldHVybiB0aGlzLl9kYXRhO1xuICB9XG5cbiAgQElucHV0KCdoaWRkZW5EYXRhJykgc2V0IGhpZGRlbkRhdGEoaGlkZGVuRGF0YTogbnVtYmVyW10pIHtcbiAgICB0aGlzLl9oaWRkZW5EYXRhID0gaGlkZGVuRGF0YTtcbiAgICB0aGlzLmRyYXdNYXAoZmFsc2UpO1xuICB9XG5cbiAgZ2V0IGhpZGRlbkRhdGEoKTogbnVtYmVyW10ge1xuICAgIHJldHVybiB0aGlzLl9oaWRkZW5EYXRhO1xuICB9XG5cbiAgQE91dHB1dCgnY2hhbmdlJykgY2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCdjaGFydERyYXcnKSBjaGFydERyYXcgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgY3VycmVudFpvb206IG51bWJlcjtcbiAgY3VycmVudExhdDogbnVtYmVyO1xuICBjdXJyZW50TG9uZzogbnVtYmVyO1xuICBtaW5UaW1lVmFsdWU6IG51bWJlcjtcbiAgbWF4VGltZVZhbHVlOiBudW1iZXI7XG4gIGRpdmlkZXIgPSAxO1xuICBsb3dlclRpbWVCb3VuZDogbnVtYmVyO1xuICB1cHBlclRpbWVCb3VuZDogbnVtYmVyO1xuICB0aW1lU3BhbjogbnVtYmVyO1xuICBfb3B0aW9uczogUGFyYW0gPSBuZXcgUGFyYW0oKTtcblxuICBwcml2YXRlIF9maXJzdERyYXcgPSB0cnVlO1xuICBwcml2YXRlIExPRzogTG9nZ2VyO1xuICBwcml2YXRlIF9kYXRhOiBhbnk7XG4gIHByaXZhdGUgX2RlYnVnID0gZmFsc2U7XG4gIHByaXZhdGUgZGVmT3B0aW9uczogUGFyYW0gPSBDaGFydExpYi5tZXJnZURlZXA8UGFyYW0+KFxuICAgIG5ldyBQYXJhbSgpLCB7XG4gICAgICBtYXA6IHtcbiAgICAgICAgaGVhdENvbnRyb2xzOiBmYWxzZSxcbiAgICAgICAgdGlsZXM6IFtdLFxuICAgICAgICBkb3RzTGltaXQ6IDEwMDAsXG4gICAgICB9LFxuICAgICAgdGltZU1vZGU6ICdkYXRlJyxcbiAgICAgIHNob3dSYW5nZVNlbGVjdG9yOiB0cnVlLFxuICAgICAgZ3JpZExpbmVDb2xvcjogJyM4ZThlOGUnLFxuICAgICAgc2hvd0RvdHM6IGZhbHNlLFxuICAgICAgdGltZVpvbmU6ICdVVEMnLFxuICAgICAgdGltZVVuaXQ6ICd1cycsXG4gICAgICBib3VuZHM6IHt9XG4gICAgfSk7XG5cbiAgcHJpdmF0ZSBfbWFwOiBMZWFmbGV0Lk1hcDtcbiAgcHJpdmF0ZSBfaGlkZGVuRGF0YTogbnVtYmVyW107XG4gIHByaXZhdGUgY3VycmVudFZhbHVlc01hcmtlcnMgPSBbXTtcbiAgcHJpdmF0ZSBhbm5vdGF0aW9uc01hcmtlcnMgPSBbXTtcbiAgcHJpdmF0ZSBwb3NpdGlvbkFycmF5c01hcmtlcnMgPSBbXTtcbiAgcHJpdmF0ZSBfaWNvbkFuY2hvcjogTGVhZmxldC5Qb2ludEV4cHJlc3Npb24gPSBbMjAsIDUyXTtcbiAgcHJpdmF0ZSBfcG9wdXBBbmNob3I6IExlYWZsZXQuUG9pbnRFeHByZXNzaW9uID0gWzAsIC01MF07XG4gIHByaXZhdGUgX2hlYXRMYXllcjogYW55O1xuICBwcml2YXRlIHBhdGhEYXRhOiBhbnlbXSA9IFtdO1xuICBwcml2YXRlIGFubm90YXRpb25zRGF0YTogYW55W10gPSBbXTtcbiAgcHJpdmF0ZSBwb3NpdGlvbkRhdGE6IGFueVtdID0gW107XG4gIHByaXZhdGUgZ2VvSnNvbjogYW55W10gPSBbXTtcbiAgcHJpdmF0ZSB0aW1lU3RhcnQ6IG51bWJlcjtcbiAgcHJpdmF0ZSB0aW1lRW5kOiBudW1iZXI7XG4gIHByaXZhdGUgZmlyc3REcmF3ID0gdHJ1ZTtcbiAgcHJpdmF0ZSBmaW5hbEhlaWdodCA9IDA7XG4gIC8vIExheWVyc1xuICBwcml2YXRlIHBhdGhEYXRhTGF5ZXIgPSBMZWFmbGV0LmZlYXR1cmVHcm91cCgpO1xuICBwcml2YXRlIGFubm90YXRpb25zRGF0YUxheWVyID0gTGVhZmxldC5mZWF0dXJlR3JvdXAoKTtcbiAgcHJpdmF0ZSBwb3NpdGlvbkRhdGFMYXllciA9IExlYWZsZXQuZmVhdHVyZUdyb3VwKCk7XG4gIHByaXZhdGUgdGlsZUxheWVyR3JvdXAgPSBMZWFmbGV0LmZlYXR1cmVHcm91cCgpO1xuICBwcml2YXRlIGdlb0pzb25MYXllciA9IExlYWZsZXQuZmVhdHVyZUdyb3VwKCk7XG4gIHByaXZhdGUgdGlsZXNMYXllcjogTGVhZmxldC5UaWxlTGF5ZXI7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGVsOiBFbGVtZW50UmVmLCBwdWJsaWMgc2l6ZVNlcnZpY2U6IFNpemVTZXJ2aWNlLCBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIpIHtcbiAgICB0aGlzLkxPRyA9IG5ldyBMb2dnZXIoV2FycFZpZXdNYXBDb21wb25lbnQsIHRoaXMuZGVidWcpO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnY29uc3RydWN0b3InXSwgdGhpcy5kZWJ1Zyk7XG4gICAgdGhpcy5zaXplU2VydmljZS5zaXplQ2hhbmdlZCQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLl9tYXApIHtcbiAgICAgICAgdGhpcy5yZXNpemVNZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5fb3B0aW9ucyA9IENoYXJ0TGliLm1lcmdlRGVlcCh0aGlzLl9vcHRpb25zLCB0aGlzLmRlZk9wdGlvbnMpIGFzIFBhcmFtO1xuICB9XG5cbiAgcmVzaXplTWUoKSB7XG4gICAgdGhpcy5MT0cuZGVidWcoWydyZXNpemVNZSddLCB0aGlzLndyYXBwZXIubmF0aXZlRWxlbWVudC5wYXJlbnRFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpKTtcbiAgICBsZXQgaGVpZ2h0ID0gdGhpcy53cmFwcGVyLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XG4gICAgY29uc3Qgd2lkdGggPSB0aGlzLndyYXBwZXIubmF0aXZlRWxlbWVudC5wYXJlbnRFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuICAgIGlmICh0aGlzLl9vcHRpb25zLm1hcC5zaG93VGltZVNsaWRlciAmJiB0aGlzLnRpbWVTbGlkZXIgJiYgdGhpcy50aW1lU2xpZGVyLm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgIGhlaWdodCAtPSB0aGlzLnRpbWVTbGlkZXIubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XG4gICAgfVxuICAgIGlmICh0aGlzLl9vcHRpb25zLm1hcC5zaG93VGltZVJhbmdlICYmIHRoaXMudGltZVJhbmdlU2xpZGVyICYmIHRoaXMudGltZVJhbmdlU2xpZGVyLm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgIGhlaWdodCAtPSB0aGlzLnRpbWVSYW5nZVNsaWRlci5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcbiAgICB9XG4gICAgdGhpcy5maW5hbEhlaWdodCA9IGhlaWdodDtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMubWFwRGl2Lm5hdGl2ZUVsZW1lbnQsICd3aWR0aCcsICdjYWxjKCcgKyB3aWR0aCArICdweCAtICdcbiAgICAgICsgZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLndyYXBwZXIubmF0aXZlRWxlbWVudCkuZ2V0UHJvcGVydHlWYWx1ZSgnLS13YXJwLXZpZXctbWFwLW1hcmdpbicpLnRyaW0oKVxuICAgICAgKyAnIC0gJ1xuICAgICAgKyBnZXRDb21wdXRlZFN0eWxlKHRoaXMud3JhcHBlci5uYXRpdmVFbGVtZW50KS5nZXRQcm9wZXJ0eVZhbHVlKCctLXdhcnAtdmlldy1tYXAtbWFyZ2luJykudHJpbSgpXG4gICAgICArICcpJyk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLm1hcERpdi5uYXRpdmVFbGVtZW50LCAnaGVpZ2h0JywgJ2NhbGMoJyArIGhlaWdodCArICdweCAtICdcbiAgICAgICsgZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLndyYXBwZXIubmF0aXZlRWxlbWVudCkuZ2V0UHJvcGVydHlWYWx1ZSgnLS13YXJwLXZpZXctbWFwLW1hcmdpbicpLnRyaW0oKVxuICAgICAgKyAnIC0gJ1xuICAgICAgKyBnZXRDb21wdXRlZFN0eWxlKHRoaXMud3JhcHBlci5uYXRpdmVFbGVtZW50KS5nZXRQcm9wZXJ0eVZhbHVlKCctLXdhcnAtdmlldy1tYXAtbWFyZ2luJykudHJpbSgpXG4gICAgICArICcpJyk7XG4gICAgdGhpcy53aWR0aCA9IHdpZHRoO1xuICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgIGlmICghIXRoaXMuX21hcCkge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLl9tYXAuaW52YWxpZGF0ZVNpemUoKSk7XG4gICAgfVxuICB9XG5cbiAgaGVhdFJhZGl1c0RpZENoYW5nZShldmVudCkge1xuICAgIHRoaXMuX2hlYXRMYXllci5zZXRPcHRpb25zKHtyYWRpdXM6IGV2ZW50LmRldGFpbC52YWx1ZUFzTnVtYmVyfSk7XG4gICAgdGhpcy5MT0cuZGVidWcoWydoZWF0UmFkaXVzRGlkQ2hhbmdlJ10sIGV2ZW50LmRldGFpbC52YWx1ZUFzTnVtYmVyKTtcbiAgfVxuXG4gIGhlYXRCbHVyRGlkQ2hhbmdlKGV2ZW50KSB7XG4gICAgdGhpcy5faGVhdExheWVyLnNldE9wdGlvbnMoe2JsdXI6IGV2ZW50LmRldGFpbC52YWx1ZUFzTnVtYmVyfSk7XG4gICAgdGhpcy5MT0cuZGVidWcoWydoZWF0Qmx1ckRpZENoYW5nZSddLCBldmVudC5kZXRhaWwudmFsdWVBc051bWJlcik7XG4gIH1cblxuICBoZWF0T3BhY2l0eURpZENoYW5nZShldmVudCkge1xuICAgIGNvbnN0IG1pbk9wYWNpdHkgPSBldmVudC5kZXRhaWwudmFsdWVBc051bWJlciAvIDEwMDtcbiAgICB0aGlzLl9oZWF0TGF5ZXIuc2V0T3B0aW9ucyh7bWluT3BhY2l0eX0pO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnaGVhdE9wYWNpdHlEaWRDaGFuZ2UnXSwgZXZlbnQuZGV0YWlsLnZhbHVlQXNOdW1iZXIpO1xuICB9XG5cbiAgcHJpdmF0ZSBkcmF3TWFwKHJlWm9vbTogYm9vbGVhbikge1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZHJhd01hcCddLCB0aGlzLl9kYXRhKTtcbiAgICB0aGlzLl9vcHRpb25zID0gQ2hhcnRMaWIubWVyZ2VEZWVwPFBhcmFtPih0aGlzLl9vcHRpb25zLCB0aGlzLmRlZk9wdGlvbnMpO1xuICAgIHRoaXMudGltZVN0YXJ0ID0gdGhpcy5fb3B0aW9ucy5tYXAudGltZVN0YXJ0O1xuICAgIG1vbWVudC50ei5zZXREZWZhdWx0KHRoaXMuX29wdGlvbnMudGltZVpvbmUpO1xuICAgIGxldCBndHM6IGFueSA9IHRoaXMuX2RhdGE7XG4gICAgaWYgKCFndHMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBndHMgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0cnkge1xuICAgICAgICBndHMgPSBKU09OLnBhcnNlKGd0cyBhcyBzdHJpbmcpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoR1RTTGliLmlzQXJyYXkoZ3RzKSAmJiBndHNbMF0gJiYgKGd0c1swXSBpbnN0YW5jZW9mIERhdGFNb2RlbCB8fCBndHNbMF0uaGFzT3duUHJvcGVydHkoJ2RhdGEnKSkpIHtcbiAgICAgIGd0cyA9IGd0c1swXTtcbiAgICB9XG4gICAgaWYgKCEhdGhpcy5fbWFwKSB7XG4gICAgICB0aGlzLl9tYXAuaW52YWxpZGF0ZVNpemUodHJ1ZSk7XG4gICAgfVxuICAgIGxldCBkYXRhTGlzdDogYW55W107XG4gICAgbGV0IHBhcmFtczogYW55W107XG4gICAgaWYgKGd0cy5kYXRhKSB7XG4gICAgICBkYXRhTGlzdCA9IGd0cy5kYXRhIGFzIGFueVtdO1xuICAgICAgdGhpcy5fb3B0aW9ucyA9IENoYXJ0TGliLm1lcmdlRGVlcDxQYXJhbT4oZ3RzLmdsb2JhbFBhcmFtcyB8fCB7fSwgdGhpcy5fb3B0aW9ucyk7XG4gICAgICB0aGlzLnRpbWVTcGFuID0gdGhpcy50aW1lU3BhbiB8fCB0aGlzLl9vcHRpb25zLm1hcC50aW1lU3BhbjtcbiAgICAgIHBhcmFtcyA9IGd0cy5wYXJhbXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGFMaXN0ID0gZ3RzO1xuICAgICAgcGFyYW1zID0gW107XG4gICAgfVxuICAgIHRoaXMuZGl2aWRlciA9IEdUU0xpYi5nZXREaXZpZGVyKHRoaXMuX29wdGlvbnMudGltZVVuaXQpO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZHJhd01hcCddLCBkYXRhTGlzdCwgdGhpcy5fb3B0aW9ucywgZ3RzLmdsb2JhbFBhcmFtcyk7XG4gICAgY29uc3QgZmxhdHRlbkdUUyA9IEdUU0xpYi5mbGF0RGVlcChkYXRhTGlzdCk7XG5cbiAgICBjb25zdCBzaXplID0gZmxhdHRlbkdUUy5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIGNvbnN0IGl0ZW0gPSBmbGF0dGVuR1RTW2ldO1xuICAgICAgaWYgKGl0ZW0udikge1xuICAgICAgICBUaW1zb3J0LnNvcnQoaXRlbS52LCAoYSwgYikgPT4gYVswXSAtIGJbMF0pO1xuICAgICAgICBpdGVtLmkgPSBpO1xuICAgICAgICBpKys7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuTE9HLmRlYnVnKFsnR1RTTGliLmZsYXREZWVwKGRhdGFMaXN0KSddLCBmbGF0dGVuR1RTKTtcbiAgICB0aGlzLmRpc3BsYXlNYXAoe2d0czogZmxhdHRlbkdUUywgcGFyYW1zfSwgcmVab29tKTtcbiAgfVxuXG4gIHByaXZhdGUgaWNvbihjb2xvcjogc3RyaW5nLCBtYXJrZXIgPSAnJykge1xuICAgIGNvbnN0IGMgPSBgJHtjb2xvci5zbGljZSgxKX1gO1xuICAgIGNvbnN0IG0gPSBtYXJrZXIgIT09ICcnID8gbWFya2VyIDogJ2NpcmNsZSc7XG4gICAgcmV0dXJuIExlYWZsZXQuaWNvbih7XG4gICAgICBpY29uVXJsOiBgaHR0cHM6Ly9jZG4ubWFwbWFya2VyLmlvL2FwaS92MS9mb250LWF3ZXNvbWUvdjQvcGluP2ljb249ZmEtJHttfSZpY29uU2l6ZT0xNyZzaXplPTQwJmhvZmZzZXQ9JHttID09PSAnY2lyY2xlJyA/IDAgOiAtMX0mdm9mZnNldD0tNCZjb2xvcj1mZmYmYmFja2dyb3VuZD0ke2N9YCxcbiAgICAgIGljb25BbmNob3I6IHRoaXMuX2ljb25BbmNob3IsXG4gICAgICBwb3B1cEFuY2hvcjogdGhpcy5fcG9wdXBBbmNob3JcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgcGF0Y2hNYXBUaWxlR2FwQnVnKCkge1xuICAgIC8vIFdvcmthcm91bmQgZm9yIDFweCBsaW5lcyBhcHBlYXJpbmcgaW4gc29tZSBicm93c2VycyBkdWUgdG8gZnJhY3Rpb25hbCB0cmFuc2Zvcm1zXG4gICAgLy8gYW5kIHJlc3VsdGluZyBhbnRpLWFsaWFzaW5nLiBhZGFwdGVkIGZyb20gQGNtdWxkZXJzJyBzb2x1dGlvbjpcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vTGVhZmxldC9MZWFmbGV0L2lzc3Vlcy8zNTc1I2lzc3VlY29tbWVudC0xNTA1NDQ3MzlcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgY29uc3Qgb3JpZ2luYWxJbml0VGlsZSA9IExlYWZsZXQuR3JpZExheWVyLnByb3RvdHlwZS5faW5pdFRpbGU7XG4gICAgaWYgKG9yaWdpbmFsSW5pdFRpbGUuaXNQYXRjaGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIExlYWZsZXQuR3JpZExheWVyLmluY2x1ZGUoe1xuICAgICAgX2luaXRUaWxlKHRpbGUpIHtcbiAgICAgICAgb3JpZ2luYWxJbml0VGlsZS5jYWxsKHRoaXMsIHRpbGUpO1xuICAgICAgICBjb25zdCB0aWxlU2l6ZSA9IHRoaXMuZ2V0VGlsZVNpemUoKTtcbiAgICAgICAgdGlsZS5zdHlsZS53aWR0aCA9IHRpbGVTaXplLnggKyAxLjUgKyAncHgnO1xuICAgICAgICB0aWxlLnN0eWxlLmhlaWdodCA9IHRpbGVTaXplLnkgKyAxICsgJ3B4JztcbiAgICAgIH1cbiAgICB9KTtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgTGVhZmxldC5HcmlkTGF5ZXIucHJvdG90eXBlLl9pbml0VGlsZS5pc1BhdGNoZWQgPSB0cnVlO1xuICB9XG5cbiAgcHJpdmF0ZSBkaXNwbGF5TWFwKGRhdGE6IHsgZ3RzOiBhbnlbXSwgcGFyYW1zOiBhbnlbXSB9LCByZURyYXcgPSBmYWxzZSkge1xuICAgIHRoaXMuY3VycmVudFZhbHVlc01hcmtlcnMgPSBbXTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RyYXdNYXAnXSwgZGF0YSwgdGhpcy5fb3B0aW9ucywgdGhpcy5faGlkZGVuRGF0YSB8fCBbXSk7XG4gICAgaWYgKCF0aGlzLmxvd2VyVGltZUJvdW5kKSB7XG4gICAgICB0aGlzLmxvd2VyVGltZUJvdW5kID0gdGhpcy5fb3B0aW9ucy5tYXAudGltZVNsaWRlck1pbiAvIHRoaXMuZGl2aWRlcjtcbiAgICAgIHRoaXMudXBwZXJUaW1lQm91bmQgPSB0aGlzLl9vcHRpb25zLm1hcC50aW1lU2xpZGVyTWF4IC8gdGhpcy5kaXZpZGVyO1xuICAgIH1cbiAgICBsZXQgaGVpZ2h0ID0gdGhpcy5oZWlnaHQgfHwgQ2hhcnRMaWIuREVGQVVMVF9IRUlHSFQ7XG4gICAgY29uc3Qgd2lkdGggPSB0aGlzLndpZHRoIHx8IENoYXJ0TGliLkRFRkFVTFRfV0lEVEg7XG4gICAgaWYgKHRoaXMucmVzcG9uc2l2ZSAmJiB0aGlzLmZpbmFsSGVpZ2h0ID09PSAwKSB7XG4gICAgICB0aGlzLnJlc2l6ZU1lKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLl9vcHRpb25zLm1hcC5zaG93VGltZVNsaWRlciAmJiB0aGlzLnRpbWVTbGlkZXIgJiYgdGhpcy50aW1lU2xpZGVyLm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgaGVpZ2h0IC09IHRoaXMudGltZVNsaWRlci5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl9vcHRpb25zLm1hcC5zaG93VGltZVJhbmdlICYmIHRoaXMudGltZVJhbmdlU2xpZGVyICYmIHRoaXMudGltZVJhbmdlU2xpZGVyLm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgaGVpZ2h0IC09IHRoaXMudGltZVJhbmdlU2xpZGVyLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLndpZHRoID0gd2lkdGg7XG4gICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgaWYgKGRhdGEuZ3RzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnBhdGhEYXRhID0gTWFwTGliLnRvTGVhZmxldE1hcFBhdGhzKGRhdGEsIHRoaXMuX2hpZGRlbkRhdGEgfHwgW10sIHRoaXMuZGl2aWRlciwgdGhpcy5fb3B0aW9ucy5zY2hlbWUpIHx8IFtdO1xuICAgIHRoaXMuYW5ub3RhdGlvbnNEYXRhID0gTWFwTGliLmFubm90YXRpb25zVG9MZWFmbGV0UG9zaXRpb25zKGRhdGEsIHRoaXMuX2hpZGRlbkRhdGEsIHRoaXMuZGl2aWRlciwgdGhpcy5fb3B0aW9ucy5zY2hlbWUpIHx8IFtdO1xuICAgIHRoaXMucG9zaXRpb25EYXRhID0gTWFwTGliLnRvTGVhZmxldE1hcFBvc2l0aW9uQXJyYXkoZGF0YSwgdGhpcy5faGlkZGVuRGF0YSB8fCBbXSwgdGhpcy5fb3B0aW9ucy5zY2hlbWUpIHx8IFtdO1xuICAgIHRoaXMuZ2VvSnNvbiA9IE1hcExpYi50b0dlb0pTT04oZGF0YSk7XG4gICAgdGhpcy5MT0cuZGVidWcoWydkaXNwbGF5TWFwJ10sIHRoaXMucGF0aERhdGEsIHRoaXMuYW5ub3RhdGlvbnNEYXRhLCB0aGlzLnBvc2l0aW9uRGF0YSk7XG5cbiAgICBpZiAodGhpcy5fb3B0aW9ucy5tYXAubWFwVHlwZSAhPT0gJ05PTkUnKSB7XG4gICAgICBjb25zdCBtYXAgPSBNYXBMaWIubWFwVHlwZXNbdGhpcy5fb3B0aW9ucy5tYXAubWFwVHlwZSB8fCAnREVGQVVMVCddO1xuICAgICAgY29uc3QgbWFwT3B0czogVGlsZUxheWVyT3B0aW9ucyA9IHtcbiAgICAgICAgbWF4Wm9vbTogMjQsXG4gICAgICAgIG1heE5hdGl2ZVpvb206IDE5LFxuICAgICAgfTtcbiAgICAgIGlmIChtYXAuYXR0cmlidXRpb24pIHtcbiAgICAgICAgbWFwT3B0cy5hdHRyaWJ1dGlvbiA9IG1hcC5hdHRyaWJ1dGlvbjtcbiAgICAgIH1cbiAgICAgIGlmIChtYXAuc3ViZG9tYWlucykge1xuICAgICAgICBtYXBPcHRzLnN1YmRvbWFpbnMgPSBtYXAuc3ViZG9tYWlucztcbiAgICAgIH1cbiAgICAgIHRoaXMudGlsZXNMYXllciA9IExlYWZsZXQudGlsZUxheWVyKG1hcC5saW5rLCBtYXBPcHRzKTtcbiAgICB9XG5cbiAgICBpZiAoISF0aGlzLl9tYXApIHtcbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsnZGlzcGxheU1hcCddLCAnbWFwIGV4aXN0cycpO1xuICAgICAgdGhpcy5wYXRoRGF0YUxheWVyLmNsZWFyTGF5ZXJzKCk7XG4gICAgICB0aGlzLmFubm90YXRpb25zRGF0YUxheWVyLmNsZWFyTGF5ZXJzKCk7XG4gICAgICB0aGlzLnBvc2l0aW9uRGF0YUxheWVyLmNsZWFyTGF5ZXJzKCk7XG4gICAgICB0aGlzLmdlb0pzb25MYXllci5jbGVhckxheWVycygpO1xuICAgICAgdGhpcy50aWxlTGF5ZXJHcm91cC5jbGVhckxheWVycygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2Rpc3BsYXlNYXAnXSwgJ2J1aWxkIG1hcCcpO1xuICAgICAgdGhpcy5fbWFwID0gTGVhZmxldC5tYXAodGhpcy5tYXBEaXYubmF0aXZlRWxlbWVudCwge1xuICAgICAgICBwcmVmZXJDYW52YXM6IHRydWUsXG4gICAgICAgIGxheWVyczogW3RoaXMudGlsZUxheWVyR3JvdXAsIHRoaXMuZ2VvSnNvbkxheWVyLCB0aGlzLnBhdGhEYXRhTGF5ZXIsIHRoaXMuYW5ub3RhdGlvbnNEYXRhTGF5ZXIsIHRoaXMucG9zaXRpb25EYXRhTGF5ZXJdLFxuICAgICAgICB6b29tQW5pbWF0aW9uOiB0cnVlLFxuICAgICAgICBtYXhab29tOiAyNFxuICAgICAgfSk7XG4gICAgICB0aGlzLnRpbGVzTGF5ZXIuYWRkVG8odGhpcy5fbWFwKTtcbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsnZGlzcGxheU1hcCddLCAnYnVpbGQgbWFwJywgdGhpcy50aWxlc0xheWVyKTtcbiAgICAgIHRoaXMuZ2VvSnNvbkxheWVyLmJyaW5nVG9CYWNrKCk7XG4gICAgICB0aGlzLnRpbGVzTGF5ZXIuYnJpbmdUb0JhY2soKTsgLy8gVE9ETzogdGVzdGVyXG4gICAgICB0aGlzLl9tYXAub24oJ2xvYWQnLCAoKSA9PiB0aGlzLkxPRy5kZWJ1ZyhbJ2Rpc3BsYXlNYXAnLCAnbG9hZCddLCB0aGlzLl9tYXAuZ2V0Q2VudGVyKCkubG5nLCB0aGlzLmN1cnJlbnRMb25nLCB0aGlzLl9tYXAuZ2V0Wm9vbSgpKSk7XG4gICAgICB0aGlzLl9tYXAub24oJ3pvb21lbmQnLCAoKSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5maXJzdERyYXcpIHtcbiAgICAgICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ21vdmVlbmQnXSwgdGhpcy5fbWFwLmdldENlbnRlcigpKTtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRab29tID0gdGhpcy5fbWFwLmdldFpvb20oKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLl9tYXAub24oJ21vdmVlbmQnLCAoKSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5maXJzdERyYXcpIHtcbiAgICAgICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ21vdmVlbmQnXSwgdGhpcy5fbWFwLmdldENlbnRlcigpKTtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRMYXQgPSB0aGlzLl9tYXAuZ2V0Q2VudGVyKCkubGF0O1xuICAgICAgICAgIHRoaXMuY3VycmVudExvbmcgPSB0aGlzLl9tYXAuZ2V0Q2VudGVyKCkubG5nO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBsZXQgc2l6ZSA9ICh0aGlzLnBhdGhEYXRhIHx8IFtdKS5sZW5ndGg7XG4gICAgdGhpcy5MT0cuZGVidWcoWydkaXNwbGF5TWFwJ10sICdidWlsZCBtYXAgZG9uZScsIHNpemUpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICBjb25zdCBkID0gdGhpcy5wYXRoRGF0YVtpXTtcbiAgICAgIGlmICghIWQpIHtcbiAgICAgICAgY29uc3QgcGxvdHRlZEd0czogYW55ID0gdGhpcy51cGRhdGVHdHNQYXRoKGQpO1xuICAgICAgICBpZiAoISFwbG90dGVkR3RzKSB7XG4gICAgICAgICAgdGhpcy5jdXJyZW50VmFsdWVzTWFya2Vycy5wdXNoKHBsb3R0ZWRHdHMuYmVmb3JlQ3VycmVudFZhbHVlKTtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRWYWx1ZXNNYXJrZXJzLnB1c2gocGxvdHRlZEd0cy5hZnRlckN1cnJlbnRWYWx1ZSk7XG4gICAgICAgICAgdGhpcy5jdXJyZW50VmFsdWVzTWFya2Vycy5wdXNoKHBsb3R0ZWRHdHMuY3VycmVudFZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2Rpc3BsYXlNYXAnXSwgJ3RoaXMucGF0aERhdGEnLCB0aGlzLnBhdGhEYXRhKTtcbiAgICBzaXplID0gKHRoaXMuYW5ub3RhdGlvbnNEYXRhIHx8IFtdKS5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIGNvbnN0IGQgPSB0aGlzLmFubm90YXRpb25zRGF0YVtpXTtcbiAgICAgIGNvbnN0IHBsb3R0ZWRHdHM6IGFueSA9IHRoaXMudXBkYXRlR3RzUGF0aChkKTtcbiAgICAgIGlmICghIXBsb3R0ZWRHdHMpIHtcbiAgICAgICAgaWYgKGQucmVuZGVyID09PSAnbGluZScpIHtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRWYWx1ZXNNYXJrZXJzLnB1c2gocGxvdHRlZEd0cy5iZWZvcmVDdXJyZW50VmFsdWUpO1xuICAgICAgICAgIHRoaXMuY3VycmVudFZhbHVlc01hcmtlcnMucHVzaChwbG90dGVkR3RzLmFmdGVyQ3VycmVudFZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmN1cnJlbnRWYWx1ZXNNYXJrZXJzLnB1c2gocGxvdHRlZEd0cy5jdXJyZW50VmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoISF0aGlzLl9tYXApIHtcbiAgICAgIHRoaXMucGF0aERhdGFMYXllciA9IExlYWZsZXQuZmVhdHVyZUdyb3VwKHRoaXMuY3VycmVudFZhbHVlc01hcmtlcnMgfHwgW10pLmFkZFRvKHRoaXMuX21hcCk7XG4gICAgfVxuICAgIHRoaXMuTE9HLmRlYnVnKFsnZGlzcGxheU1hcCcsICdhbm5vdGF0aW9uc01hcmtlcnMnXSwgdGhpcy5hbm5vdGF0aW9uc01hcmtlcnMpO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZGlzcGxheU1hcCcsICd0aGlzLmhpZGRlbkRhdGEnXSwgdGhpcy5oaWRkZW5EYXRhKTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2Rpc3BsYXlNYXAnLCAndGhpcy5wb3NpdGlvbkRhdGEnXSwgdGhpcy5wb3NpdGlvbkRhdGEpO1xuICAgIC8vIENyZWF0ZSB0aGUgcG9zaXRpb25zIGFycmF5c1xuICAgIHNpemUgPSAodGhpcy5wb3NpdGlvbkRhdGEgfHwgW10pLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgY29uc3QgZCA9IHRoaXMucG9zaXRpb25EYXRhW2ldO1xuICAgICAgdGhpcy5wb3NpdGlvbkFycmF5c01hcmtlcnMgPSB0aGlzLnBvc2l0aW9uQXJyYXlzTWFya2Vycy5jb25jYXQodGhpcy51cGRhdGVQb3NpdGlvbkFycmF5KGQpKTtcbiAgICB9XG4gICAgdGhpcy5MT0cuZGVidWcoWydkaXNwbGF5TWFwJ10sICd0aGlzLnBvIHNpdGlvbkRhdGEnKTtcbiAgICBzaXplID0gKHRoaXMuYW5ub3RhdGlvbnNEYXRhIHx8IFtdKS5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIGNvbnN0IGQgPSB0aGlzLmFubm90YXRpb25zRGF0YVtpXTtcbiAgICAgIHRoaXMucG9zaXRpb25BcnJheXNNYXJrZXJzID0gdGhpcy5wb3NpdGlvbkFycmF5c01hcmtlcnMuY29uY2F0KHRoaXMudXBkYXRlQW5ub3RhdGlvbihkKSk7XG4gICAgfVxuICAgIHRoaXMuTE9HLmRlYnVnKFsnZGlzcGxheU1hcCddLCAndGhpcy5hbm5vdGF0aW9uc0RhdGEnKTtcblxuICAgICh0aGlzLl9vcHRpb25zLm1hcC50aWxlcyB8fCBbXSkuZm9yRWFjaCgodCkgPT4geyAvLyBUT0RPIHRvIHRlc3RcbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsnZGlzcGxheU1hcCddLCB0KTtcbiAgICAgIGlmICh0aGlzLl9vcHRpb25zLm1hcC5zaG93VGltZVJhbmdlKSB7XG4gICAgICAgIHRoaXMudGlsZUxheWVyR3JvdXAuYWRkTGF5ZXIoTGVhZmxldC50aWxlTGF5ZXIodFxuICAgICAgICAgICAgLnJlcGxhY2UoJ3tzdGFydH0nLCBtb21lbnQodGhpcy50aW1lU3RhcnQpLnRvSVNPU3RyaW5nKCkpXG4gICAgICAgICAgICAucmVwbGFjZSgne2VuZH0nLCBtb21lbnQodGhpcy50aW1lRW5kKS50b0lTT1N0cmluZygpKSwge1xuICAgICAgICAgICAgc3ViZG9tYWluczogJ2FiY2QnLFxuICAgICAgICAgICAgbWF4TmF0aXZlWm9vbTogMTksXG4gICAgICAgICAgICBtYXhab29tOiA0MFxuICAgICAgICAgIH1cbiAgICAgICAgKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnRpbGVMYXllckdyb3VwLmFkZExheWVyKExlYWZsZXQudGlsZUxheWVyKHQsIHtcbiAgICAgICAgICBzdWJkb21haW5zOiAnYWJjZCcsXG4gICAgICAgICAgbWF4TmF0aXZlWm9vbTogMTksXG4gICAgICAgICAgbWF4Wm9vbTogNDBcbiAgICAgICAgfSkpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZGlzcGxheU1hcCddLCAndGhpcy50aWxlcycpO1xuXG4gICAgdGhpcy5MT0cuZGVidWcoWydkaXNwbGF5TWFwJywgJ3Bvc2l0aW9uQXJyYXlzTWFya2VycyddLCB0aGlzLnBvc2l0aW9uQXJyYXlzTWFya2Vycyk7XG4gICAgdGhpcy5MT0cuZGVidWcoWydkaXNwbGF5TWFwJywgJ2Fubm90YXRpb25zTWFya2VycyddLCB0aGlzLmFubm90YXRpb25zTWFya2Vycyk7XG5cbiAgICBzaXplID0gKHRoaXMucG9zaXRpb25BcnJheXNNYXJrZXJzIHx8IFtdKS5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIGNvbnN0IG0gPSB0aGlzLnBvc2l0aW9uQXJyYXlzTWFya2Vyc1tpXTtcbiAgICAgIG0uYWRkVG8odGhpcy5wb3NpdGlvbkRhdGFMYXllcik7XG4gICAgfVxuICAgIHNpemUgPSAodGhpcy5hbm5vdGF0aW9uc01hcmtlcnMgfHwgW10pLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgY29uc3QgbSA9IHRoaXMuYW5ub3RhdGlvbnNNYXJrZXJzW2ldO1xuICAgICAgbS5hZGRUbyh0aGlzLmFubm90YXRpb25zRGF0YUxheWVyKTtcbiAgICB9XG5cbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2Rpc3BsYXlNYXAnLCAnZ2VvSnNvbiddLCB0aGlzLmdlb0pzb24pO1xuICAgIHNpemUgPSAodGhpcy5nZW9Kc29uIHx8IFtdKS5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIGNvbnN0IG0gPSB0aGlzLmdlb0pzb25baV07XG4gICAgICBjb25zdCBjb2xvciA9IENvbG9yTGliLmdldENvbG9yKGksIHRoaXMuX29wdGlvbnMuc2NoZW1lKTtcbiAgICAgIGNvbnN0IG9wdHMgPSB7XG4gICAgICAgIHN0eWxlOiAoKSA9PiAoe1xuICAgICAgICAgIGNvbG9yOiAoZGF0YS5wYXJhbXMgJiYgZGF0YS5wYXJhbXNbaV0pID8gZGF0YS5wYXJhbXNbaV0uY29sb3IgfHwgY29sb3IgOiBjb2xvcixcbiAgICAgICAgICBmaWxsQ29sb3I6IChkYXRhLnBhcmFtcyAmJiBkYXRhLnBhcmFtc1tpXSlcbiAgICAgICAgICAgID8gQ29sb3JMaWIudHJhbnNwYXJlbnRpemUoZGF0YS5wYXJhbXNbaV0uZmlsbENvbG9yIHx8IGNvbG9yKVxuICAgICAgICAgICAgOiBDb2xvckxpYi50cmFuc3BhcmVudGl6ZShjb2xvciksXG4gICAgICAgIH0pXG4gICAgICB9IGFzIGFueTtcbiAgICAgIGlmIChtLmdlb21ldHJ5LnR5cGUgPT09ICdQb2ludCcpIHtcbiAgICAgICAgb3B0cy5wb2ludFRvTGF5ZXIgPSAoZ2VvSnNvblBvaW50LCBsYXRsbmcpID0+IExlYWZsZXQubWFya2VyKGxhdGxuZywge1xuICAgICAgICAgIGljb246IHRoaXMuaWNvbihjb2xvciwgKGRhdGEucGFyYW1zICYmIGRhdGEucGFyYW1zW2ldKSA/IGRhdGEucGFyYW1zW2ldLm1hcmtlciA6ICdjaXJjbGUnKSxcbiAgICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGxldCBkaXNwbGF5ID0gJyc7XG4gICAgICBjb25zdCBnZW9TaGFwZSA9IExlYWZsZXQuZ2VvSlNPTihtLCBvcHRzKTtcbiAgICAgIGlmIChtLnByb3BlcnRpZXMpIHtcbiAgICAgICAgT2JqZWN0LmtleXMobS5wcm9wZXJ0aWVzKS5mb3JFYWNoKGsgPT4gZGlzcGxheSArPSBgPGI+JHtrfTwvYj46ICR7bS5wcm9wZXJ0aWVzW2tdfTxiciAvPmApO1xuICAgICAgICBnZW9TaGFwZS5iaW5kUG9wdXAoZGlzcGxheSk7XG4gICAgICB9XG4gICAgICBnZW9TaGFwZS5hZGRUbyh0aGlzLmdlb0pzb25MYXllcik7XG4gICAgfVxuICAgIGlmICh0aGlzLnBhdGhEYXRhLmxlbmd0aCA+IDAgfHwgdGhpcy5wb3NpdGlvbkRhdGEubGVuZ3RoID4gMCB8fCB0aGlzLmFubm90YXRpb25zRGF0YS5sZW5ndGggPiAwIHx8IHRoaXMuZ2VvSnNvbi5sZW5ndGggPiAwKSB7XG4gICAgICAvLyBGaXQgbWFwIHRvIGN1cnZlc1xuICAgICAgY29uc3QgZ3JvdXAgPSBMZWFmbGV0LmZlYXR1cmVHcm91cChbdGhpcy5nZW9Kc29uTGF5ZXIsIHRoaXMuYW5ub3RhdGlvbnNEYXRhTGF5ZXIsIHRoaXMucG9zaXRpb25EYXRhTGF5ZXIsIHRoaXMucGF0aERhdGFMYXllcl0pO1xuICAgICAgdGhpcy5MT0cuZGVidWcoWydkaXNwbGF5TWFwJywgJ3NldFZpZXcnXSwgJ2ZpdEJvdW5kcycsIGdyb3VwLmdldEJvdW5kcygpKTtcbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsnZGlzcGxheU1hcCcsICdzZXRWaWV3J10sIHtsYXQ6IHRoaXMuY3VycmVudExhdCwgbG5nOiB0aGlzLmN1cnJlbnRMb25nfSwge1xuICAgICAgICBsYXQ6IHRoaXMuX29wdGlvbnMubWFwLnN0YXJ0TGF0LFxuICAgICAgICBsbmc6IHRoaXMuX29wdGlvbnMubWFwLnN0YXJ0TG9uZ1xuICAgICAgfSk7XG4gICAgICB0aGlzLmJvdW5kcyA9IGdyb3VwLmdldEJvdW5kcygpO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGlmICghIXRoaXMuYm91bmRzICYmIHRoaXMuYm91bmRzLmlzVmFsaWQoKSkge1xuICAgICAgICAgIGlmICgodGhpcy5jdXJyZW50TGF0IHx8IHRoaXMuX29wdGlvbnMubWFwLnN0YXJ0TGF0KSAmJiAodGhpcy5jdXJyZW50TG9uZyB8fCB0aGlzLl9vcHRpb25zLm1hcC5zdGFydExvbmcpKSB7XG4gICAgICAgICAgICB0aGlzLl9tYXAuc2V0Vmlldyh7XG4gICAgICAgICAgICAgICAgbGF0OiB0aGlzLmN1cnJlbnRMYXQgfHwgdGhpcy5fb3B0aW9ucy5tYXAuc3RhcnRMYXQgfHwgMCxcbiAgICAgICAgICAgICAgICBsbmc6IHRoaXMuY3VycmVudExvbmcgfHwgdGhpcy5fb3B0aW9ucy5tYXAuc3RhcnRMb25nIHx8IDBcbiAgICAgICAgICAgICAgfSwgdGhpcy5jdXJyZW50Wm9vbSB8fCB0aGlzLl9vcHRpb25zLm1hcC5zdGFydFpvb20gfHwgMTAsXG4gICAgICAgICAgICAgIHthbmltYXRlOiBmYWxzZSwgZHVyYXRpb246IDUwMH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9tYXAuZml0Qm91bmRzKHRoaXMuYm91bmRzLCB7cGFkZGluZzogWzEsIDFdLCBhbmltYXRlOiBmYWxzZSwgZHVyYXRpb246IDB9KTtcbiAgICAgICAgICAgIC8vICAgdGhpcy5jdXJyZW50Wm9vbSA9IHRoaXMuX21hcC5nZXRCb3VuZHNab29tKHRoaXMuYm91bmRzLCBmYWxzZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuY3VycmVudExhdCA9IHRoaXMuX21hcC5nZXRDZW50ZXIoKS5sYXQ7XG4gICAgICAgICAgdGhpcy5jdXJyZW50TG9uZyA9IHRoaXMuX21hcC5nZXRDZW50ZXIoKS5sbmc7XG4gICAgICAgICAgLy8gIHRoaXMuY3VycmVudFpvb20gPSB0aGlzLl9tYXAuZ2V0Wm9vbSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuTE9HLmRlYnVnKFsnZGlzcGxheU1hcCcsICdzZXRWaWV3J10sIHtsYXQ6IHRoaXMuY3VycmVudExhdCwgbG5nOiB0aGlzLmN1cnJlbnRMb25nfSk7XG4gICAgICAgICAgdGhpcy5fbWFwLnNldFZpZXcoe1xuICAgICAgICAgICAgICBsYXQ6IHRoaXMuY3VycmVudExhdCB8fCB0aGlzLl9vcHRpb25zLm1hcC5zdGFydExhdCB8fCAwLFxuICAgICAgICAgICAgICBsbmc6IHRoaXMuY3VycmVudExvbmcgfHwgdGhpcy5fb3B0aW9ucy5tYXAuc3RhcnRMb25nIHx8IDBcbiAgICAgICAgICAgIH0sIHRoaXMuY3VycmVudFpvb20gfHwgdGhpcy5fb3B0aW9ucy5tYXAuc3RhcnRab29tIHx8IDEwLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBhbmltYXRlOiBmYWxzZSxcbiAgICAgICAgICAgICAgZHVyYXRpb246IDUwMFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0sIDEwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5MT0cuZGVidWcoWydkaXNwbGF5TWFwJywgJ2xvc3QnXSwgJ2xvc3QnLCB0aGlzLmN1cnJlbnRab29tLCB0aGlzLl9vcHRpb25zLm1hcC5zdGFydFpvb20pO1xuICAgICAgdGhpcy5fbWFwLnNldFZpZXcoXG4gICAgICAgIFtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRMYXQgfHwgdGhpcy5fb3B0aW9ucy5tYXAuc3RhcnRMYXQgfHwgMCxcbiAgICAgICAgICB0aGlzLmN1cnJlbnRMb25nIHx8IHRoaXMuX29wdGlvbnMubWFwLnN0YXJ0TG9uZyB8fCAwXG4gICAgICAgIF0sXG4gICAgICAgIHRoaXMuY3VycmVudFpvb20gfHwgdGhpcy5fb3B0aW9ucy5tYXAuc3RhcnRab29tIHx8IDIsXG4gICAgICAgIHtcbiAgICAgICAgICBhbmltYXRlOiBmYWxzZSxcbiAgICAgICAgICBkdXJhdGlvbjogMFxuICAgICAgICB9XG4gICAgICApO1xuICAgIH1cbiAgICBpZiAodGhpcy5oZWF0RGF0YSAmJiB0aGlzLmhlYXREYXRhLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuX2hlYXRMYXllciA9IChMZWFmbGV0IGFzIGFueSkuaGVhdExheWVyKHRoaXMuaGVhdERhdGEsIHtcbiAgICAgICAgcmFkaXVzOiB0aGlzLl9vcHRpb25zLm1hcC5oZWF0UmFkaXVzLFxuICAgICAgICBibHVyOiB0aGlzLl9vcHRpb25zLm1hcC5oZWF0Qmx1cixcbiAgICAgICAgbWluT3BhY2l0eTogdGhpcy5fb3B0aW9ucy5tYXAuaGVhdE9wYWNpdHlcbiAgICAgIH0pO1xuICAgICAgdGhpcy5faGVhdExheWVyLmFkZFRvKHRoaXMuX21hcCk7XG4gICAgfVxuICAgIHRoaXMuZmlyc3REcmF3ID0gZmFsc2U7XG4gICAgdGhpcy5yZXNpemVNZSgpO1xuICAgIHRoaXMucGF0Y2hNYXBUaWxlR2FwQnVnKCk7XG4gICAgdGhpcy5jaGFydERyYXcuZW1pdCh0cnVlKTtcbiAgfVxuXG4gIHVwZGF0ZUFubm90YXRpb24oZ3RzKSB7XG4gICAgY29uc3QgcG9zaXRpb25zID0gW107XG4gICAgbGV0IGljb247XG4gICAgbGV0IHNpemU7XG4gICAgc3dpdGNoIChndHMucmVuZGVyKSB7XG4gICAgICBjYXNlICdtYXJrZXInOlxuICAgICAgICBpY29uID0gdGhpcy5pY29uKGd0cy5jb2xvciwgZ3RzLm1hcmtlcik7XG4gICAgICAgIHNpemUgPSAoZ3RzLnBhdGggfHwgW10pLmxlbmd0aDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBnID0gZ3RzLnBhdGhbaV07XG4gICAgICAgICAgY29uc3QgbWFya2VyID0gTGVhZmxldC5tYXJrZXIoZywge2ljb24sIG9wYWNpdHk6IDF9KTtcbiAgICAgICAgICBtYXJrZXIuYmluZFBvcHVwKGcudmFsLnRvU3RyaW5nKCkpO1xuICAgICAgICAgIHBvc2l0aW9ucy5wdXNoKG1hcmtlcik7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd3ZWlnaHRlZERvdHMnOlxuICAgICAgICBzaXplID0gKGd0cy5wYXRoIHx8IFtdKS5sZW5ndGg7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgcCA9IGd0cy5wYXRoW2ldO1xuICAgICAgICAgIGlmICgodGhpcy5faGlkZGVuRGF0YSB8fCBbXSkuZmlsdGVyKGggPT4gaCA9PT0gZ3RzLmtleSkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBsZXQgdiA9IHBhcnNlSW50KHAudmFsLCAxMCk7XG4gICAgICAgICAgICBpZiAoaXNOYU4odikpIHtcbiAgICAgICAgICAgICAgdiA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCByYWRpdXMgPSAodiAtIChndHMubWluVmFsdWUgfHwgMCkpICogNTAgLyAoZ3RzLm1heFZhbHVlIHx8IDUwKTtcbiAgICAgICAgICAgIGNvbnN0IG1hcmtlciA9IExlYWZsZXQuY2lyY2xlTWFya2VyKFxuICAgICAgICAgICAgICBwLCB7XG4gICAgICAgICAgICAgICAgcmFkaXVzOiByYWRpdXMgPT09IDAgPyAxIDogcmFkaXVzLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBndHMuYm9yZGVyQ29sb3IsXG4gICAgICAgICAgICAgICAgZmlsbENvbG9yOiBndHMuY29sb3IsIGZpbGxPcGFjaXR5OiAwLjUsXG4gICAgICAgICAgICAgICAgd2VpZ2h0OiAxXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5hZGRQb3B1cChndHMsIHAudmFsLCBtYXJrZXIpO1xuICAgICAgICAgICAgcG9zaXRpb25zLnB1c2gobWFya2VyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdkb3RzJzpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHNpemUgPSAoZ3RzLnBhdGggfHwgW10pLmxlbmd0aDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBnID0gZ3RzLnBhdGhbaV07XG4gICAgICAgICAgY29uc3QgbWFya2VyID0gTGVhZmxldC5jaXJjbGVNYXJrZXIoXG4gICAgICAgICAgICBnLCB7XG4gICAgICAgICAgICAgIHJhZGl1czogZ3RzLmJhc2VSYWRpdXMsXG4gICAgICAgICAgICAgIGNvbG9yOiBndHMuY29sb3IsXG4gICAgICAgICAgICAgIGZpbGxDb2xvcjogZ3RzLmNvbG9yLFxuICAgICAgICAgICAgICBmaWxsT3BhY2l0eTogMVxuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG4gICAgICAgICAgbWFya2VyLmJpbmRQb3B1cChnLnZhbC50b1N0cmluZygpKTtcbiAgICAgICAgICBwb3NpdGlvbnMucHVzaChtYXJrZXIpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gcG9zaXRpb25zO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVHdHNQYXRoKGd0czogYW55KSB7XG4gICAgY29uc3QgYmVmb3JlQ3VycmVudFZhbHVlID0gTGVhZmxldC5wb2x5bGluZShcbiAgICAgIE1hcExpYi5wYXRoRGF0YVRvTGVhZmxldChndHMucGF0aCwge3RvOiAwfSksIHtcbiAgICAgICAgY29sb3I6IGd0cy5jb2xvcixcbiAgICAgICAgb3BhY2l0eTogMSxcbiAgICAgIH0pO1xuICAgIGNvbnN0IGFmdGVyQ3VycmVudFZhbHVlID0gTGVhZmxldC5wb2x5bGluZShcbiAgICAgIE1hcExpYi5wYXRoRGF0YVRvTGVhZmxldChndHMucGF0aCwge2Zyb206IDB9KSwge1xuICAgICAgICBjb2xvcjogZ3RzLmNvbG9yLFxuICAgICAgICBvcGFjaXR5OiAwLjcsXG4gICAgICB9KTtcbiAgICBsZXQgY3VycmVudFZhbHVlO1xuICAgIC8vIExldCdzIHZlcmlmeSB3ZSBoYXZlIGEgcGF0aC4uLiBObyBwYXRoLCBubyBtYXJrZXJcbiAgICBjb25zdCBzaXplID0gKGd0cy5wYXRoIHx8IFtdKS5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIGNvbnN0IHAgPSBndHMucGF0aFtpXTtcbiAgICAgIGxldCBkYXRlO1xuICAgICAgaWYgKHRoaXMuX29wdGlvbnMudGltZU1vZGUgJiYgdGhpcy5fb3B0aW9ucy50aW1lTW9kZSA9PT0gJ3RpbWVzdGFtcCcpIHtcbiAgICAgICAgZGF0ZSA9IHBhcnNlSW50KHAudHMsIDEwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRhdGUgPSAobW9tZW50KHBhcnNlSW50KHAudHMsIDEwKSlcbiAgICAgICAgICAudXRjKHRydWUpLnRvSVNPU3RyaW5nKCkgfHwgJycpXG4gICAgICAgICAgLnJlcGxhY2UoJ1onLCB0aGlzLl9vcHRpb25zLnRpbWVab25lID09PSAnVVRDJyA/ICdaJyA6ICcnKTtcbiAgICAgIH1cbiAgICAgIGN1cnJlbnRWYWx1ZSA9IExlYWZsZXQuY2lyY2xlTWFya2VyKFtwLmxhdCwgcC5sb25dLFxuICAgICAgICB7cmFkaXVzOiBNYXBMaWIuQkFTRV9SQURJVVMsIGNvbG9yOiBndHMuY29sb3IsIGZpbGxDb2xvcjogZ3RzLmNvbG9yLCBmaWxsT3BhY2l0eTogMC43fSlcbiAgICAgICAgLmJpbmRQb3B1cChgPHA+JHtkYXRlfTwvcD48cD48Yj4ke2d0cy5rZXl9PC9iPjogJHtwLnZhbC50b1N0cmluZygpfTwvcD5gKTtcbiAgICB9XG4gICAgaWYgKHNpemUgPiAwKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBiZWZvcmVDdXJyZW50VmFsdWUsXG4gICAgICAgIGFmdGVyQ3VycmVudFZhbHVlLFxuICAgICAgICBjdXJyZW50VmFsdWUsXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYWRkUG9wdXAocG9zaXRpb25EYXRhOiBhbnksIHZhbHVlOiBhbnksIG1hcmtlcjogYW55KSB7XG4gICAgaWYgKCEhcG9zaXRpb25EYXRhKSB7XG4gICAgICBsZXQgY29udGVudCA9ICcnO1xuICAgICAgaWYgKHBvc2l0aW9uRGF0YS5rZXkpIHtcbiAgICAgICAgY29udGVudCA9IGA8cD48Yj4ke3Bvc2l0aW9uRGF0YS5rZXl9PC9iPjogJHt2YWx1ZSB8fCAnbmEnfTwvcD5gO1xuICAgICAgfVxuICAgICAgT2JqZWN0LmtleXMocG9zaXRpb25EYXRhLnByb3BlcnRpZXMgfHwgW10pLmZvckVhY2goayA9PiBjb250ZW50ICs9IGA8Yj4ke2t9PC9iPjogJHtwb3NpdGlvbkRhdGEucHJvcGVydGllc1trXX08YnIgLz5gKTtcbiAgICAgIG1hcmtlci5iaW5kUG9wdXAoY29udGVudCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVQb3NpdGlvbkFycmF5KHBvc2l0aW9uRGF0YTogYW55KSB7XG4gICAgY29uc3QgcG9zaXRpb25zID0gW107XG4gICAgbGV0IHBvbHlsaW5lO1xuICAgIGxldCBpY29uO1xuICAgIGxldCByZXN1bHQ7XG4gICAgbGV0IGluU3RlcDtcbiAgICBsZXQgc2l6ZTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3VwZGF0ZVBvc2l0aW9uQXJyYXknXSwgcG9zaXRpb25EYXRhKTtcbiAgICBzd2l0Y2ggKHBvc2l0aW9uRGF0YS5yZW5kZXIpIHtcbiAgICAgIGNhc2UgJ3BhdGgnOlxuICAgICAgICBwb2x5bGluZSA9IExlYWZsZXQucG9seWxpbmUocG9zaXRpb25EYXRhLnBvc2l0aW9ucywge2NvbG9yOiBwb3NpdGlvbkRhdGEuY29sb3IsIG9wYWNpdHk6IDF9KTtcbiAgICAgICAgcG9zaXRpb25zLnB1c2gocG9seWxpbmUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21hcmtlcic6XG4gICAgICAgIGljb24gPSB0aGlzLmljb24ocG9zaXRpb25EYXRhLmNvbG9yLCBwb3NpdGlvbkRhdGEubWFya2VyKTtcbiAgICAgICAgc2l6ZSA9IChwb3NpdGlvbkRhdGEucG9zaXRpb25zIHx8IFtdKS5sZW5ndGg7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgcCA9IHBvc2l0aW9uRGF0YS5wb3NpdGlvbnNbaV07XG4gICAgICAgICAgaWYgKCh0aGlzLmhpZGRlbkRhdGEgfHwgW10pLmZpbHRlcihoID0+IGggPT09IHBvc2l0aW9uRGF0YS5rZXkpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgY29uc3QgbWFya2VyID0gTGVhZmxldC5tYXJrZXIoe2xhdDogcFswXSwgbG5nOiBwWzFdfSwge2ljb24sIG9wYWNpdHk6IDF9KTtcbiAgICAgICAgICAgIHRoaXMuYWRkUG9wdXAocG9zaXRpb25EYXRhLCBwWzJdLCBtYXJrZXIpO1xuICAgICAgICAgICAgcG9zaXRpb25zLnB1c2gobWFya2VyKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5MT0cuZGVidWcoWyd1cGRhdGVQb3NpdGlvbkFycmF5JywgJ2J1aWxkIG1hcmtlciddLCBpY29uKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2NvbG9yZWRXZWlnaHRlZERvdHMnOlxuICAgICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3VwZGF0ZVBvc2l0aW9uQXJyYXknLCAnY29sb3JlZFdlaWdodGVkRG90cyddLCBwb3NpdGlvbkRhdGEpO1xuICAgICAgICByZXN1bHQgPSBbXTtcbiAgICAgICAgaW5TdGVwID0gW107XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgcG9zaXRpb25EYXRhLm51bUNvbG9yU3RlcHM7IGorKykge1xuICAgICAgICAgIHJlc3VsdFtqXSA9IDA7XG4gICAgICAgICAgaW5TdGVwW2pdID0gMDtcbiAgICAgICAgfVxuICAgICAgICBzaXplID0gKHBvc2l0aW9uRGF0YS5wb3NpdGlvbnMgfHwgW10pLmxlbmd0aDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBwID0gcG9zaXRpb25EYXRhLnBvc2l0aW9uc1tpXTtcbiAgICAgICAgICBpZiAoKHRoaXMuX2hpZGRlbkRhdGEgfHwgW10pLmZpbHRlcihoID0+IGggPT09IHBvc2l0aW9uRGF0YS5rZXkpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5MT0cuZGVidWcoWyd1cGRhdGVQb3NpdGlvbkFycmF5JywgJ2NvbG9yZWRXZWlnaHRlZERvdHMnLCAncmFkaXVzJ10sIHBvc2l0aW9uRGF0YS5iYXNlUmFkaXVzICogcFs0XSk7XG4gICAgICAgICAgICBjb25zdCBtYXJrZXIgPSBMZWFmbGV0LmNpcmNsZU1hcmtlcihcbiAgICAgICAgICAgICAge2xhdDogcFswXSwgbG5nOiBwWzFdfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJhZGl1czogcG9zaXRpb25EYXRhLmJhc2VSYWRpdXMgKiAocGFyc2VJbnQocFs0XSwgMTApICsgMSksXG4gICAgICAgICAgICAgICAgY29sb3I6IHBvc2l0aW9uRGF0YS5ib3JkZXJDb2xvcixcbiAgICAgICAgICAgICAgICBmaWxsQ29sb3I6IENvbG9yTGliLnJnYjJoZXgoXG4gICAgICAgICAgICAgICAgICBwb3NpdGlvbkRhdGEuY29sb3JHcmFkaWVudFtwWzVdXS5yLFxuICAgICAgICAgICAgICAgICAgcG9zaXRpb25EYXRhLmNvbG9yR3JhZGllbnRbcFs1XV0uZyxcbiAgICAgICAgICAgICAgICAgIHBvc2l0aW9uRGF0YS5jb2xvckdyYWRpZW50W3BbNV1dLmIpLFxuICAgICAgICAgICAgICAgIGZpbGxPcGFjaXR5OiAwLjcsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5hZGRQb3B1cChwb3NpdGlvbkRhdGEsIHBbMl0sIG1hcmtlcik7XG4gICAgICAgICAgICBwb3NpdGlvbnMucHVzaChtYXJrZXIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3dlaWdodGVkRG90cyc6XG4gICAgICAgIHNpemUgPSAocG9zaXRpb25EYXRhLnBvc2l0aW9ucyB8fCBbXSkubGVuZ3RoO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgICAgIGNvbnN0IHAgPSBwb3NpdGlvbkRhdGEucG9zaXRpb25zW2ldO1xuICAgICAgICAgIGlmICgodGhpcy5faGlkZGVuRGF0YSB8fCBbXSkuZmlsdGVyKGggPT4gaCA9PT0gcG9zaXRpb25EYXRhLmtleSkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBjb25zdCBtYXJrZXIgPSBMZWFmbGV0LmNpcmNsZU1hcmtlcihcbiAgICAgICAgICAgICAge2xhdDogcFswXSwgbG5nOiBwWzFdfSwge1xuICAgICAgICAgICAgICAgIHJhZGl1czogcG9zaXRpb25EYXRhLmJhc2VSYWRpdXMgKiAocGFyc2VJbnQocFs0XSwgMTApICsgMSksXG4gICAgICAgICAgICAgICAgY29sb3I6IHBvc2l0aW9uRGF0YS5ib3JkZXJDb2xvcixcbiAgICAgICAgICAgICAgICBmaWxsQ29sb3I6IHBvc2l0aW9uRGF0YS5jb2xvciwgZmlsbE9wYWNpdHk6IDAuNyxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmFkZFBvcHVwKHBvc2l0aW9uRGF0YSwgcFsyXSwgbWFya2VyKTtcbiAgICAgICAgICAgIHBvc2l0aW9ucy5wdXNoKG1hcmtlcik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZG90cyc6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBzaXplID0gKHBvc2l0aW9uRGF0YS5wb3NpdGlvbnMgfHwgW10pLmxlbmd0aDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBwID0gcG9zaXRpb25EYXRhLnBvc2l0aW9uc1tpXTtcbiAgICAgICAgICBpZiAoKHRoaXMuX2hpZGRlbkRhdGEgfHwgW10pLmZpbHRlcihoID0+IGggPT09IHBvc2l0aW9uRGF0YS5rZXkpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgY29uc3QgbWFya2VyID0gTGVhZmxldC5jaXJjbGVNYXJrZXIoXG4gICAgICAgICAgICAgIHtsYXQ6IHBbMF0sIGxuZzogcFsxXX0sIHtcbiAgICAgICAgICAgICAgICByYWRpdXM6IHBvc2l0aW9uRGF0YS5iYXNlUmFkaXVzLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBwb3NpdGlvbkRhdGEuYm9yZGVyQ29sb3IsXG4gICAgICAgICAgICAgICAgZmlsbENvbG9yOiBwb3NpdGlvbkRhdGEuY29sb3IsXG4gICAgICAgICAgICAgICAgZmlsbE9wYWNpdHk6IDEsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5hZGRQb3B1cChwb3NpdGlvbkRhdGEsIHBbMl0sIG1hcmtlcik7XG4gICAgICAgICAgICBwb3NpdGlvbnMucHVzaChtYXJrZXIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIHBvc2l0aW9ucztcbiAgfVxuXG4gIHB1YmxpYyByZXNpemUoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPGJvb2xlYW4+KHJlc29sdmUgPT4ge1xuICAgICAgdGhpcy5yZXNpemVNZSgpO1xuICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICB9KTtcbiAgfVxuXG4gIG9uUmFuZ2VTbGlkZXJDaGFuZ2UoZXZlbnQpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ29uUmFuZ2VTbGlkZXJDaGFuZ2UnXSwgZXZlbnQpO1xuICAgIHRoaXMudGltZVN0YXJ0ID0gZXZlbnQudmFsdWUgfHwgbW9tZW50KCkudmFsdWVPZigpO1xuICAgIHRoaXMudGltZUVuZCA9IGV2ZW50LmhpZ2hWYWx1ZSB8fCBtb21lbnQoKS52YWx1ZU9mKCk7XG4gICAgdGhpcy5kcmF3TWFwKHRydWUpO1xuICB9XG5cbiAgb25SYW5nZVNsaWRlcldpbmRvd0NoYW5nZShldmVudCkge1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnb25SYW5nZVNsaWRlcldpbmRvd0NoYW5nZSddLCBldmVudCk7XG4gICAgaWYgKHRoaXMubG93ZXJUaW1lQm91bmQgIT09IGV2ZW50Lm1pbiB8fCB0aGlzLnVwcGVyVGltZUJvdW5kICE9PSBldmVudC5tYXgpIHtcbiAgICAgIHRoaXMubG93ZXJUaW1lQm91bmQgPSBldmVudC5taW47XG4gICAgICB0aGlzLnVwcGVyVGltZUJvdW5kID0gZXZlbnQubWF4O1xuICAgIH1cbiAgfVxuXG4gIG9uU2xpZGVyQ2hhbmdlKGV2ZW50KSB7XG4gICAgdGhpcy5MT0cuZGVidWcoWydvblNsaWRlckNoYW5nZSddLCBldmVudCwgbW9tZW50KGV2ZW50LnZhbHVlKS50b0lTT1N0cmluZygpKTtcbiAgICB0aGlzLl9maXJzdERyYXcgPSBmYWxzZTtcbiAgICBpZiAodGhpcy50aW1lRW5kICE9PSBldmVudC52YWx1ZSkge1xuICAgICAgdGhpcy50aW1lU3BhbiA9IHRoaXMudGltZVNwYW4gfHwgdGhpcy5fb3B0aW9ucy5tYXAudGltZVNwYW47XG4gICAgICB0aGlzLnRpbWVFbmQgPSBldmVudC52YWx1ZSB8fCBtb21lbnQoKS52YWx1ZU9mKCk7XG4gICAgICB0aGlzLnRpbWVTdGFydCA9IChldmVudC52YWx1ZSB8fCBtb21lbnQoKS52YWx1ZU9mKCkpIC0gdGhpcy50aW1lU3BhbiAvIHRoaXMuZGl2aWRlcjtcbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsnb25TbGlkZXJDaGFuZ2UnXSwgbW9tZW50KHRoaXMudGltZVN0YXJ0KS50b0lTT1N0cmluZygpLCBtb21lbnQodGhpcy50aW1lRW5kKS50b0lTT1N0cmluZygpKTtcbiAgICAgIHRoaXMuY2hhbmdlLmVtaXQodGhpcy50aW1lU3RhcnQpO1xuICAgICAgdGhpcy5kcmF3TWFwKHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZVRpbWVTcGFuKGV2ZW50KSB7XG4gICAgdGhpcy5MT0cuZGVidWcoWyd1cGRhdGVUaW1lU3BhbiddLCBldmVudC50YXJnZXQudmFsdWUpO1xuICAgIGlmICh0aGlzLnRpbWVTcGFuICE9PSBldmVudC50YXJnZXQudmFsdWUpIHtcbiAgICAgIHRoaXMudGltZVNwYW4gPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICB0aGlzLnRpbWVTdGFydCA9ICh0aGlzLnRpbWVFbmQgfHwgbW9tZW50KCkudmFsdWVPZigpKSAtIHRoaXMudGltZVNwYW4gLyB0aGlzLmRpdmlkZXI7XG4gICAgICB0aGlzLmRyYXdNYXAodHJ1ZSk7XG4gICAgfVxuICB9XG59XG4iXX0=