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
export class WarpViewMapComponent {
    /**
     * @param {?} el
     * @param {?} sizeService
     * @param {?} renderer
     */
    constructor(el, sizeService, renderer) {
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
        () => {
            if (this._map) {
                this.resizeMe();
            }
        }));
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
     * @param {?} options
     * @return {?}
     */
    set options(options) {
        this.LOG.debug(['onOptions'], options);
        if (!deepEqual(this._options, options)) {
            /** @type {?} */
            const reZoom = options.map.startZoom !== this._options.map.startZoom
                || options.map.startLat !== this._options.map.startLat
                || options.map.startLong !== this._options.map.startLong;
            this._options = options;
            this.divider = GTSLib.getDivider(this._options.timeUnit);
            this.drawMap(reZoom);
        }
    }
    /**
     * @param {?} data
     * @return {?}
     */
    set data(data) {
        this.LOG.debug(['onData'], data);
        this.currentValuesMarkers = [];
        this.annotationsMarkers = [];
        this.positionArraysMarkers = [];
        if (!!data) {
            this._data = data;
            this.drawMap(true);
        }
    }
    /**
     * @return {?}
     */
    get data() {
        return this._data;
    }
    /**
     * @param {?} hiddenData
     * @return {?}
     */
    set hiddenData(hiddenData) {
        this._hiddenData = hiddenData;
        this.drawMap(false);
    }
    /**
     * @return {?}
     */
    get hiddenData() {
        return this._hiddenData;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this._options = (/** @type {?} */ (ChartLib.mergeDeep(this._options, this.defOptions)));
    }
    /**
     * @return {?}
     */
    resizeMe() {
        this.LOG.debug(['resizeMe'], this.wrapper.nativeElement.parentElement.getBoundingClientRect());
        /** @type {?} */
        let height = this.wrapper.nativeElement.parentElement.getBoundingClientRect().height;
        /** @type {?} */
        const width = this.wrapper.nativeElement.parentElement.getBoundingClientRect().width;
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
            () => this._map.invalidateSize()));
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    heatRadiusDidChange(event) {
        this._heatLayer.setOptions({ radius: event.detail.valueAsNumber });
        this.LOG.debug(['heatRadiusDidChange'], event.detail.valueAsNumber);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    heatBlurDidChange(event) {
        this._heatLayer.setOptions({ blur: event.detail.valueAsNumber });
        this.LOG.debug(['heatBlurDidChange'], event.detail.valueAsNumber);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    heatOpacityDidChange(event) {
        /** @type {?} */
        const minOpacity = event.detail.valueAsNumber / 100;
        this._heatLayer.setOptions({ minOpacity });
        this.LOG.debug(['heatOpacityDidChange'], event.detail.valueAsNumber);
    }
    /**
     * @private
     * @param {?} reZoom
     * @return {?}
     */
    drawMap(reZoom) {
        this.LOG.debug(['drawMap'], this._data);
        this._options = ChartLib.mergeDeep(this._options, this.defOptions);
        this.timeStart = this._options.map.timeStart;
        moment.tz.setDefault(this._options.timeZone);
        /** @type {?} */
        let gts = this._data;
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
        let dataList;
        /** @type {?} */
        let params;
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
        const flattenGTS = GTSLib.flatDeep(dataList);
        /** @type {?} */
        const size = flattenGTS.length;
        for (let i = 0; i < size; i++) {
            /** @type {?} */
            const item = flattenGTS[i];
            if (item.v) {
                Timsort.sort(item.v, (/**
                 * @param {?} a
                 * @param {?} b
                 * @return {?}
                 */
                (a, b) => a[0] - b[0]));
                item.i = i;
                i++;
            }
        }
        this.LOG.debug(['GTSLib.flatDeep(dataList)'], flattenGTS);
        this.displayMap({ gts: flattenGTS, params }, reZoom);
    }
    /**
     * @private
     * @param {?} color
     * @param {?=} marker
     * @return {?}
     */
    icon(color, marker = '') {
        /** @type {?} */
        const c = `${color.slice(1)}`;
        /** @type {?} */
        const m = marker !== '' ? marker : 'circle';
        return Leaflet.icon({
            iconUrl: `https://cdn.mapmarker.io/api/v1/font-awesome/v4/pin?icon=fa-${m}&iconSize=17&size=40&hoffset=${m === 'circle' ? 0 : -1}&voffset=-4&color=fff&background=${c}`,
            iconAnchor: this._iconAnchor,
            popupAnchor: this._popupAnchor
        });
    }
    /**
     * @private
     * @return {?}
     */
    patchMapTileGapBug() {
        // Workaround for 1px lines appearing in some browsers due to fractional transforms
        // and resulting anti-aliasing. adapted from @cmulders' solution:
        // https://github.com/Leaflet/Leaflet/issues/3575#issuecomment-150544739
        // @ts-ignore
        /** @type {?} */
        const originalInitTile = Leaflet.GridLayer.prototype._initTile;
        if (originalInitTile.isPatched) {
            return;
        }
        Leaflet.GridLayer.include({
            /**
             * @param {?} tile
             * @return {?}
             */
            _initTile(tile) {
                originalInitTile.call(this, tile);
                /** @type {?} */
                const tileSize = this.getTileSize();
                tile.style.width = tileSize.x + 1.5 + 'px';
                tile.style.height = tileSize.y + 1 + 'px';
            }
        });
        // @ts-ignore
        Leaflet.GridLayer.prototype._initTile.isPatched = true;
    }
    /**
     * @private
     * @param {?} data
     * @param {?=} reDraw
     * @return {?}
     */
    displayMap(data, reDraw = false) {
        this.currentValuesMarkers = [];
        this.LOG.debug(['drawMap'], data, this._options, this._hiddenData || []);
        if (!this.lowerTimeBound) {
            this.lowerTimeBound = this._options.map.timeSliderMin / this.divider;
            this.upperTimeBound = this._options.map.timeSliderMax / this.divider;
        }
        /** @type {?} */
        let height = this.height || ChartLib.DEFAULT_HEIGHT;
        /** @type {?} */
        const width = this.width || ChartLib.DEFAULT_WIDTH;
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
            const map = MapLib.mapTypes[this._options.map.mapType || 'DEFAULT'];
            /** @type {?} */
            const mapOpts = {
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
            () => this.LOG.debug(['displayMap', 'load'], this._map.getCenter().lng, this.currentLong, this._map.getZoom())));
            this._map.on('zoomend', (/**
             * @return {?}
             */
            () => {
                if (!this.firstDraw) {
                    this.LOG.debug(['moveend'], this._map.getCenter());
                    this.currentZoom = this._map.getZoom();
                }
            }));
            this._map.on('moveend', (/**
             * @return {?}
             */
            () => {
                if (!this.firstDraw) {
                    this.LOG.debug(['moveend'], this._map.getCenter());
                    this.currentLat = this._map.getCenter().lat;
                    this.currentLong = this._map.getCenter().lng;
                }
            }));
        }
        /** @type {?} */
        let size = (this.pathData || []).length;
        this.LOG.debug(['displayMap'], 'build map done', size);
        for (let i = 0; i < size; i++) {
            /** @type {?} */
            const d = this.pathData[i];
            if (!!d) {
                /** @type {?} */
                const plottedGts = this.updateGtsPath(d);
                if (!!plottedGts) {
                    this.currentValuesMarkers.push(plottedGts.beforeCurrentValue);
                    this.currentValuesMarkers.push(plottedGts.afterCurrentValue);
                    this.currentValuesMarkers.push(plottedGts.currentValue);
                }
            }
        }
        this.LOG.debug(['displayMap'], 'this.pathData', this.pathData);
        size = (this.annotationsData || []).length;
        for (let i = 0; i < size; i++) {
            /** @type {?} */
            const d = this.annotationsData[i];
            /** @type {?} */
            const plottedGts = this.updateGtsPath(d);
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
        for (let i = 0; i < size; i++) {
            /** @type {?} */
            const d = this.positionData[i];
            this.positionArraysMarkers = this.positionArraysMarkers.concat(this.updatePositionArray(d));
        }
        this.LOG.debug(['displayMap'], 'this.po sitionData');
        size = (this.annotationsData || []).length;
        for (let i = 0; i < size; i++) {
            /** @type {?} */
            const d = this.annotationsData[i];
            this.positionArraysMarkers = this.positionArraysMarkers.concat(this.updateAnnotation(d));
        }
        this.LOG.debug(['displayMap'], 'this.annotationsData');
        (this._options.map.tiles || []).forEach((/**
         * @param {?} t
         * @return {?}
         */
        (t) => {
            this.LOG.debug(['displayMap'], t);
            if (this._options.map.showTimeRange) {
                this.tileLayerGroup.addLayer(Leaflet.tileLayer(t
                    .replace('{start}', moment(this.timeStart).toISOString())
                    .replace('{end}', moment(this.timeEnd).toISOString()), {
                    subdomains: 'abcd',
                    maxNativeZoom: 19,
                    maxZoom: 40
                }));
            }
            else {
                this.tileLayerGroup.addLayer(Leaflet.tileLayer(t, {
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
        for (let i = 0; i < size; i++) {
            /** @type {?} */
            const m = this.positionArraysMarkers[i];
            m.addTo(this.positionDataLayer);
        }
        size = (this.annotationsMarkers || []).length;
        for (let i = 0; i < size; i++) {
            /** @type {?} */
            const m = this.annotationsMarkers[i];
            m.addTo(this.annotationsDataLayer);
        }
        this.LOG.debug(['displayMap', 'geoJson'], this.geoJson);
        size = (this.geoJson || []).length;
        for (let i = 0; i < size; i++) {
            /** @type {?} */
            const m = this.geoJson[i];
            /** @type {?} */
            const color = ColorLib.getColor(i, this._options.scheme);
            /** @type {?} */
            const opts = (/** @type {?} */ ({
                style: (/**
                 * @return {?}
                 */
                () => ({
                    color: (data.params && data.params[i]) ? data.params[i].color || color : color,
                    fillColor: (data.params && data.params[i])
                        ? ColorLib.transparentize(data.params[i].fillColor || color)
                        : ColorLib.transparentize(color),
                }))
            }));
            if (m.geometry.type === 'Point') {
                opts.pointToLayer = (/**
                 * @param {?} geoJsonPoint
                 * @param {?} latlng
                 * @return {?}
                 */
                (geoJsonPoint, latlng) => Leaflet.marker(latlng, {
                    icon: this.icon(color, (data.params && data.params[i]) ? data.params[i].marker : 'circle'),
                    opacity: 1,
                }));
            }
            /** @type {?} */
            let display = '';
            /** @type {?} */
            const geoShape = Leaflet.geoJSON(m, opts);
            if (m.properties) {
                Object.keys(m.properties).forEach((/**
                 * @param {?} k
                 * @return {?}
                 */
                k => display += `<b>${k}</b>: ${m.properties[k]}<br />`));
                geoShape.bindPopup(display);
            }
            geoShape.addTo(this.geoJsonLayer);
        }
        if (this.pathData.length > 0 || this.positionData.length > 0 || this.annotationsData.length > 0 || this.geoJson.length > 0) {
            // Fit map to curves
            /** @type {?} */
            const group = Leaflet.featureGroup([this.geoJsonLayer, this.annotationsDataLayer, this.positionDataLayer, this.pathDataLayer]);
            this.LOG.debug(['displayMap', 'setView'], 'fitBounds', group.getBounds());
            this.LOG.debug(['displayMap', 'setView'], { lat: this.currentLat, lng: this.currentLong }, {
                lat: this._options.map.startLat,
                lng: this._options.map.startLong
            });
            this.bounds = group.getBounds();
            setTimeout((/**
             * @return {?}
             */
            () => {
                if (!!this.bounds && this.bounds.isValid()) {
                    if ((this.currentLat || this._options.map.startLat) && (this.currentLong || this._options.map.startLong)) {
                        this._map.setView({
                            lat: this.currentLat || this._options.map.startLat || 0,
                            lng: this.currentLong || this._options.map.startLong || 0
                        }, this.currentZoom || this._options.map.startZoom || 10, { animate: false, duration: 500 });
                    }
                    else {
                        this._map.fitBounds(this.bounds, { padding: [1, 1], animate: false, duration: 0 });
                        //   this.currentZoom = this._map.getBoundsZoom(this.bounds, false);
                    }
                    this.currentLat = this._map.getCenter().lat;
                    this.currentLong = this._map.getCenter().lng;
                    //  this.currentZoom = this._map.getZoom();
                }
                else {
                    this.LOG.debug(['displayMap', 'setView'], { lat: this.currentLat, lng: this.currentLong });
                    this._map.setView({
                        lat: this.currentLat || this._options.map.startLat || 0,
                        lng: this.currentLong || this._options.map.startLong || 0
                    }, this.currentZoom || this._options.map.startZoom || 10, {
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
    }
    /**
     * @param {?} gts
     * @return {?}
     */
    updateAnnotation(gts) {
        /** @type {?} */
        const positions = [];
        /** @type {?} */
        let icon;
        /** @type {?} */
        let size;
        switch (gts.render) {
            case 'marker':
                icon = this.icon(gts.color, gts.marker);
                size = (gts.path || []).length;
                for (let i = 0; i < size; i++) {
                    /** @type {?} */
                    const g = gts.path[i];
                    /** @type {?} */
                    const marker = Leaflet.marker(g, { icon, opacity: 1 });
                    marker.bindPopup(g.val.toString());
                    positions.push(marker);
                }
                break;
            case 'weightedDots':
                size = (gts.path || []).length;
                for (let i = 0; i < size; i++) {
                    /** @type {?} */
                    const p = gts.path[i];
                    if ((this._hiddenData || []).filter((/**
                     * @param {?} h
                     * @return {?}
                     */
                    h => h === gts.key)).length === 0) {
                        /** @type {?} */
                        let v = parseInt(p.val, 10);
                        if (isNaN(v)) {
                            v = 0;
                        }
                        /** @type {?} */
                        const radius = (v - (gts.minValue || 0)) * 50 / (gts.maxValue || 50);
                        /** @type {?} */
                        const marker = Leaflet.circleMarker(p, {
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
                for (let i = 0; i < size; i++) {
                    /** @type {?} */
                    const g = gts.path[i];
                    /** @type {?} */
                    const marker = Leaflet.circleMarker(g, {
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
    }
    /**
     * @private
     * @param {?} gts
     * @return {?}
     */
    updateGtsPath(gts) {
        /** @type {?} */
        const beforeCurrentValue = Leaflet.polyline(MapLib.pathDataToLeaflet(gts.path, { to: 0 }), {
            color: gts.color,
            opacity: 1,
        });
        /** @type {?} */
        const afterCurrentValue = Leaflet.polyline(MapLib.pathDataToLeaflet(gts.path, { from: 0 }), {
            color: gts.color,
            opacity: 0.7,
        });
        /** @type {?} */
        let currentValue;
        // Let's verify we have a path... No path, no marker
        /** @type {?} */
        const size = (gts.path || []).length;
        for (let i = 0; i < size; i++) {
            /** @type {?} */
            const p = gts.path[i];
            /** @type {?} */
            let date;
            if (this._options.timeMode && this._options.timeMode === 'timestamp') {
                date = parseInt(p.ts, 10);
            }
            else {
                date = (moment(parseInt(p.ts, 10))
                    .utc(true).toISOString() || '')
                    .replace('Z', this._options.timeZone === 'UTC' ? 'Z' : '');
            }
            currentValue = Leaflet.circleMarker([p.lat, p.lon], { radius: MapLib.BASE_RADIUS, color: gts.color, fillColor: gts.color, fillOpacity: 0.7 })
                .bindPopup(`<p>${date}</p><p><b>${gts.key}</b>: ${p.val.toString()}</p>`);
        }
        if (size > 0) {
            return {
                beforeCurrentValue,
                afterCurrentValue,
                currentValue,
            };
        }
        else {
            return undefined;
        }
    }
    /**
     * @private
     * @param {?} positionData
     * @param {?} value
     * @param {?} marker
     * @return {?}
     */
    addPopup(positionData, value, marker) {
        if (!!positionData) {
            /** @type {?} */
            let content = '';
            if (positionData.key) {
                content = `<p><b>${positionData.key}</b>: ${value || 'na'}</p>`;
            }
            Object.keys(positionData.properties || []).forEach((/**
             * @param {?} k
             * @return {?}
             */
            k => content += `<b>${k}</b>: ${positionData.properties[k]}<br />`));
            marker.bindPopup(content);
        }
    }
    /**
     * @private
     * @param {?} positionData
     * @return {?}
     */
    updatePositionArray(positionData) {
        /** @type {?} */
        const positions = [];
        /** @type {?} */
        let polyline;
        /** @type {?} */
        let icon;
        /** @type {?} */
        let result;
        /** @type {?} */
        let inStep;
        /** @type {?} */
        let size;
        this.LOG.debug(['updatePositionArray'], positionData);
        switch (positionData.render) {
            case 'path':
                polyline = Leaflet.polyline(positionData.positions, { color: positionData.color, opacity: 1 });
                positions.push(polyline);
                break;
            case 'marker':
                icon = this.icon(positionData.color, positionData.marker);
                size = (positionData.positions || []).length;
                for (let i = 0; i < size; i++) {
                    /** @type {?} */
                    const p = positionData.positions[i];
                    if ((this.hiddenData || []).filter((/**
                     * @param {?} h
                     * @return {?}
                     */
                    h => h === positionData.key)).length === 0) {
                        /** @type {?} */
                        const marker = Leaflet.marker({ lat: p[0], lng: p[1] }, { icon, opacity: 1 });
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
                for (let j = 0; j < positionData.numColorSteps; j++) {
                    result[j] = 0;
                    inStep[j] = 0;
                }
                size = (positionData.positions || []).length;
                for (let i = 0; i < size; i++) {
                    /** @type {?} */
                    const p = positionData.positions[i];
                    if ((this._hiddenData || []).filter((/**
                     * @param {?} h
                     * @return {?}
                     */
                    h => h === positionData.key)).length === 0) {
                        this.LOG.debug(['updatePositionArray', 'coloredWeightedDots', 'radius'], positionData.baseRadius * p[4]);
                        /** @type {?} */
                        const marker = Leaflet.circleMarker({ lat: p[0], lng: p[1] }, {
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
                for (let i = 0; i < size; i++) {
                    /** @type {?} */
                    const p = positionData.positions[i];
                    if ((this._hiddenData || []).filter((/**
                     * @param {?} h
                     * @return {?}
                     */
                    h => h === positionData.key)).length === 0) {
                        /** @type {?} */
                        const marker = Leaflet.circleMarker({ lat: p[0], lng: p[1] }, {
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
                for (let i = 0; i < size; i++) {
                    /** @type {?} */
                    const p = positionData.positions[i];
                    if ((this._hiddenData || []).filter((/**
                     * @param {?} h
                     * @return {?}
                     */
                    h => h === positionData.key)).length === 0) {
                        /** @type {?} */
                        const marker = Leaflet.circleMarker({ lat: p[0], lng: p[1] }, {
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
    }
    /**
     * @return {?}
     */
    resize() {
        return new Promise((/**
         * @param {?} resolve
         * @return {?}
         */
        resolve => {
            this.resizeMe();
            resolve(true);
        }));
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onRangeSliderChange(event) {
        this.LOG.debug(['onRangeSliderChange'], event);
        this.timeStart = event.value || moment().valueOf();
        this.timeEnd = event.highValue || moment().valueOf();
        this.drawMap(true);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onRangeSliderWindowChange(event) {
        this.LOG.debug(['onRangeSliderWindowChange'], event);
        if (this.lowerTimeBound !== event.min || this.upperTimeBound !== event.max) {
            this.lowerTimeBound = event.min;
            this.upperTimeBound = event.max;
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onSliderChange(event) {
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
    }
    /**
     * @param {?} event
     * @return {?}
     */
    updateTimeSpan(event) {
        this.LOG.debug(['updateTimeSpan'], event.target.value);
        if (this.timeSpan !== event.target.value) {
            this.timeSpan = event.target.value;
            this.timeStart = (this.timeEnd || moment().valueOf()) - this.timeSpan / this.divider;
            this.drawMap(true);
        }
    }
}
WarpViewMapComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-map',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"wrapper\" #wrapper (resized)=\"resizeMe()\">\n  <div class=\"map-container\">\n    <div #mapDiv></div>\n    <div *ngIf=\"_options.map.showTimeSlider && !_options.map.showTimeRange\" #timeSlider>\n      <warpview-slider\n        [min]=\"_options.map.timeSliderMin / divider\" [max]=\"_options.map.timeSliderMax / divider\"\n        [value]=\"minTimeValue / divider\"\n        [step]=\"_options.map.timeSliderStep\" [mode]=\"_options.map.timeSliderMode\"\n        (change)=\"onSliderChange($event)\"\n        [debug]=\"debug\"\n      ></warpview-slider>\n    </div>\n    <div *ngIf=\"_options.map.showTimeSlider && _options.map.showTimeRange\" #timeRangeSlider>\n      <!--    <warpview-range-slider *ngIf=\"!_options.map.timeSpan && lowerTimeBound\"\n                                  [min]=\"lowerTimeBound\" [max]=\"upperTimeBound\"\n                                  [minValue]=\"minTimeValue / divider\"\n                                  [maxValue]=\"maxTimeValue / divider\"\n                                  [step]=\"_options.map.timeSliderStep\"\n                                  [mode]=\"_options.map.timeSliderMode\"\n                                  [debug]=\"_debug\"\n                                  (change)=\"onRangeSliderChange($event)\"\n           ></warpview-range-slider>-->\n\n      <warpview-range-slider\n        [min]=\"(_options.map.timeSliderMin / divider)\" [max]=\"(_options.map.timeSliderMax / divider)\"\n        [minValue]=\"minTimeValue / divider\"\n        [maxValue]=\"maxTimeValue / divider\"\n        [mode]=\"_options.map.timeSliderMode\"\n        [debug]=\"debug\"\n        (change)=\"onRangeSliderWindowChange($event)\"\n      ></warpview-range-slider>\n      <warpview-slider *ngIf=\"_options.map.timeSpan && lowerTimeBound\"\n                       [min]=\"lowerTimeBound\" [max]=\"upperTimeBound\"\n                       [step]=\"(this.timeSpan || this._options.map.timeSpan) / divider\"\n                       [mode]=\"_options.map.timeSliderMode\"\n                       [debug]=\"debug\"\n                       (change)=\"onSliderChange($event)\"\n      ></warpview-slider>\n      <div *ngIf=\"_options.map?.timeSpan\">\n        <label for=\"timeSpan\">Timespan: </label>\n        <select id=\"timeSpan\" (change)=\"updateTimeSpan($event)\">\n          <option *ngFor=\"let ts of _options.map.timeSpanList\" [value]=\"ts.value\">{{ts.label}}</option>\n        </select>\n      </div>\n    </div>\n    <warpview-heatmap-sliders\n      *ngIf=\"_options.map.heatControls\"\n      (heatRadiusDidChange)=\"heatRadiusDidChange($event)\"\n      (heatBlurDidChange)=\"heatBlurDidChange($event)\"\n      (heatOpacityDidChange)=\"heatOpacityDidChange($event)\"\n    ></warpview-heatmap-sliders>\n  </div>\n\n</div>\n",
                encapsulation: ViewEncapsulation.None,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}:host,warp-view-map,warpview-map{width:100%;height:100%;min-height:100px}:host div.wrapper,warp-view-map div.wrapper,warpview-map div.wrapper{width:100%;height:100%;min-height:100px;padding:var(--warp-view-map-margin);overflow:hidden}:host div.wrapper div.leaflet-container,:host div.wrapper div.map-container,warp-view-map div.wrapper div.leaflet-container,warp-view-map div.wrapper div.map-container,warpview-map div.wrapper div.leaflet-container,warpview-map div.wrapper div.map-container{min-width:100%;min-height:100px;width:100%;height:100%;position:relative;overflow:hidden}:host div.wrapper .leaflet-container,warp-view-map div.wrapper .leaflet-container,warpview-map div.wrapper .leaflet-container{min-width:100%;min-height:100%;width:100%;height:100%}"]
            }] }
];
/** @nocollapse */
WarpViewMapComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: SizeService },
    { type: Renderer2 }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LW1hcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VueC93YXJwdmlldy8iLCJzb3VyY2VzIjpbInNyYy9saWIvZWxlbWVudHMvd2FycC12aWV3LW1hcC93YXJwLXZpZXctbWFwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFVLE1BQU0sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ2xJLE9BQU8sRUFBQyxLQUFLLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUN4QyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDMUMsT0FBTyxPQUEyQixNQUFNLFNBQVMsQ0FBQztBQUNsRCxPQUFPLGNBQWMsQ0FBQztBQUN0QixPQUFPLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDL0MsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ2hELE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUMzQyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDM0MsT0FBTyxNQUFNLE1BQU0saUJBQWlCLENBQUM7QUFDckMsT0FBTyxTQUFTLE1BQU0sWUFBWSxDQUFDO0FBQ25DLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSwrQkFBK0IsQ0FBQztBQUMxRCxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0scUJBQXFCLENBQUM7Ozs7QUFXNUMsTUFBTSxPQUFPLG9CQUFvQjs7Ozs7O0lBc0gvQixZQUFtQixFQUFjLEVBQVMsV0FBd0Is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c0M7O0lBRTFCLGtDQUFxQjs7SUFBRSwyQ0FBK0I7Ozs7O0lBQUUsd0NBQTJCIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqICBDb3B5cmlnaHQgMjAyMCAgU2VuWCBTLkEuUy5cbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudCwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25Jbml0LCBPdXRwdXQsIFJlbmRlcmVyMiwgVmlld0NoaWxkLCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1BhcmFtfSBmcm9tICcuLi8uLi9tb2RlbC9wYXJhbSc7XG5pbXBvcnQge0xvZ2dlcn0gZnJvbSAnLi4vLi4vdXRpbHMvbG9nZ2VyJztcbmltcG9ydCBMZWFmbGV0LCB7VGlsZUxheWVyT3B0aW9uc30gZnJvbSAnbGVhZmxldCc7XG5pbXBvcnQgJ2xlYWZsZXQuaGVhdCc7XG5pbXBvcnQgJ2xlYWZsZXQubWFya2VyY2x1c3Rlcic7XG5pbXBvcnQge0NvbG9yTGlifSBmcm9tICcuLi8uLi91dGlscy9jb2xvci1saWInO1xuaW1wb3J0IHtDaGFydExpYn0gZnJvbSAnLi4vLi4vdXRpbHMvY2hhcnQtbGliJztcbmltcG9ydCB7RGF0YU1vZGVsfSBmcm9tICcuLi8uLi9tb2RlbC9kYXRhTW9kZWwnO1xuaW1wb3J0IHtNYXBMaWJ9IGZyb20gJy4uLy4uL3V0aWxzL21hcC1saWInO1xuaW1wb3J0IHtHVFNMaWJ9IGZyb20gJy4uLy4uL3V0aWxzL2d0cy5saWInO1xuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQtdGltZXpvbmUnO1xuaW1wb3J0IGRlZXBFcXVhbCBmcm9tICdkZWVwLWVxdWFsJztcbmltcG9ydCB7U2l6ZVNlcnZpY2V9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3Jlc2l6ZS5zZXJ2aWNlJztcbmltcG9ydCB7VGltc29ydH0gZnJvbSAnLi4vLi4vdXRpbHMvdGltc29ydCc7XG5cbi8qKlxuICpcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnd2FycHZpZXctbWFwJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3dhcnAtdmlldy1tYXAuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi93YXJwLXZpZXctbWFwLmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgV2FycFZpZXdNYXBDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIEBWaWV3Q2hpbGQoJ21hcERpdicsIHtzdGF0aWM6IHRydWV9KSBtYXBEaXY6IEVsZW1lbnRSZWY8SFRNTERpdkVsZW1lbnQ+O1xuICBAVmlld0NoaWxkKCd3cmFwcGVyJywge3N0YXRpYzogdHJ1ZX0pIHdyYXBwZXI6IEVsZW1lbnRSZWY8SFRNTERpdkVsZW1lbnQ+O1xuICBAVmlld0NoaWxkKCd0aW1lU2xpZGVyJywge3N0YXRpYzogZmFsc2V9KSB0aW1lU2xpZGVyOiBFbGVtZW50UmVmPEhUTUxEaXZFbGVtZW50PjtcbiAgQFZpZXdDaGlsZCgndGltZVJhbmdlU2xpZGVyJywge3N0YXRpYzogZmFsc2V9KSB0aW1lUmFuZ2VTbGlkZXI6IEVsZW1lbnRSZWY8SFRNTERpdkVsZW1lbnQ+O1xuXG4gIEBJbnB1dCgnaGVhdERhdGEnKSBoZWF0RGF0YTogYW55W10gPSBbXTtcbiAgQElucHV0KCdyZXNwb25zaXZlJykgcmVzcG9uc2l2ZSA9IGZhbHNlO1xuICBASW5wdXQoJ3Nob3dMZWdlbmQnKSBzaG93TGVnZW5kID0gdHJ1ZTtcbiAgQElucHV0KCd3aWR0aCcpIHdpZHRoID0gQ2hhcnRMaWIuREVGQVVMVF9XSURUSDtcbiAgQElucHV0KCdoZWlnaHQnKSBoZWlnaHQgPSBDaGFydExpYi5ERUZBVUxUX0hFSUdIVDtcbiAgcHJpdmF0ZSBib3VuZHM6IExlYWZsZXQuTGF0TG5nQm91bmRzO1xuXG4gIEBJbnB1dCgnZGVidWcnKSBzZXQgZGVidWcoZGVidWc6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9kZWJ1ZyA9IGRlYnVnO1xuICAgIHRoaXMuTE9HLnNldERlYnVnKGRlYnVnKTtcbiAgfVxuXG4gIGdldCBkZWJ1ZygpIHtcbiAgICByZXR1cm4gdGhpcy5fZGVidWc7XG4gIH1cblxuICBASW5wdXQoJ29wdGlvbnMnKSBzZXQgb3B0aW9ucyhvcHRpb25zOiBQYXJhbSkge1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnb25PcHRpb25zJ10sIG9wdGlvbnMpO1xuICAgIGlmICghZGVlcEVxdWFsKHRoaXMuX29wdGlvbnMsIG9wdGlvbnMpKSB7XG4gICAgICBjb25zdCByZVpvb20gPVxuICAgICAgICBvcHRpb25zLm1hcC5zdGFydFpvb20gIT09IHRoaXMuX29wdGlvbnMubWFwLnN0YXJ0Wm9vbVxuICAgICAgICB8fCBvcHRpb25zLm1hcC5zdGFydExhdCAhPT0gdGhpcy5fb3B0aW9ucy5tYXAuc3RhcnRMYXRcbiAgICAgICAgfHwgb3B0aW9ucy5tYXAuc3RhcnRMb25nICE9PSB0aGlzLl9vcHRpb25zLm1hcC5zdGFydExvbmc7XG4gICAgICB0aGlzLl9vcHRpb25zID0gb3B0aW9ucztcbiAgICAgIHRoaXMuZGl2aWRlciA9IEdUU0xpYi5nZXREaXZpZGVyKHRoaXMuX29wdGlvbnMudGltZVVuaXQpO1xuICAgICAgdGhpcy5kcmF3TWFwKHJlWm9vbSk7XG4gICAgfVxuICB9XG5cbiAgQElucHV0KCdkYXRhJykgc2V0IGRhdGEoZGF0YTogYW55KSB7XG4gICAgdGhpcy5MT0cuZGVidWcoWydvbkRhdGEnXSwgZGF0YSk7XG4gICAgdGhpcy5jdXJyZW50VmFsdWVzTWFya2VycyA9IFtdO1xuICAgIHRoaXMuYW5ub3RhdGlvbnNNYXJrZXJzID0gW107XG4gICAgdGhpcy5wb3NpdGlvbkFycmF5c01hcmtlcnMgPSBbXTtcbiAgICBpZiAoISFkYXRhKSB7XG4gICAgICB0aGlzLl9kYXRhID0gZGF0YTtcbiAgICAgIHRoaXMuZHJhd01hcCh0cnVlKTtcbiAgICB9XG4gIH1cblxuICBnZXQgZGF0YSgpIHtcbiAgICByZXR1cm4gdGhpcy5fZGF0YTtcbiAgfVxuXG4gIEBJbnB1dCgnaGlkZGVuRGF0YScpIHNldCBoaWRkZW5EYXRhKGhpZGRlbkRhdGE6IG51bWJlcltdKSB7XG4gICAgdGhpcy5faGlkZGVuRGF0YSA9IGhpZGRlbkRhdGE7XG4gICAgdGhpcy5kcmF3TWFwKGZhbHNlKTtcbiAgfVxuXG4gIGdldCBoaWRkZW5EYXRhKCk6IG51bWJlcltdIHtcbiAgICByZXR1cm4gdGhpcy5faGlkZGVuRGF0YTtcbiAgfVxuXG4gIEBPdXRwdXQoJ2NoYW5nZScpIGNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgnY2hhcnREcmF3JykgY2hhcnREcmF3ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIGN1cnJlbnRab29tOiBudW1iZXI7XG4gIGN1cnJlbnRMYXQ6IG51bWJlcjtcbiAgY3VycmVudExvbmc6IG51bWJlcjtcbiAgbWluVGltZVZhbHVlOiBudW1iZXI7XG4gIG1heFRpbWVWYWx1ZTogbnVtYmVyO1xuICBkaXZpZGVyID0gMTtcbiAgbG93ZXJUaW1lQm91bmQ6IG51bWJlcjtcbiAgdXBwZXJUaW1lQm91bmQ6IG51bWJlcjtcbiAgdGltZVNwYW46IG51bWJlcjtcbiAgX29wdGlvbnM6IFBhcmFtID0gbmV3IFBhcmFtKCk7XG5cbiAgcHJpdmF0ZSBfZmlyc3REcmF3ID0gdHJ1ZTtcbiAgcHJpdmF0ZSBMT0c6IExvZ2dlcjtcbiAgcHJpdmF0ZSBfZGF0YTogYW55O1xuICBwcml2YXRlIF9kZWJ1ZyA9IGZhbHNlO1xuICBwcml2YXRlIGRlZk9wdGlvbnM6IFBhcmFtID0gQ2hhcnRMaWIubWVyZ2VEZWVwPFBhcmFtPihcbiAgICBuZXcgUGFyYW0oKSwge1xuICAgICAgbWFwOiB7XG4gICAgICAgIGhlYXRDb250cm9sczogZmFsc2UsXG4gICAgICAgIHRpbGVzOiBbXSxcbiAgICAgICAgZG90c0xpbWl0OiAxMDAwLFxuICAgICAgfSxcbiAgICAgIHRpbWVNb2RlOiAnZGF0ZScsXG4gICAgICBzaG93UmFuZ2VTZWxlY3RvcjogdHJ1ZSxcbiAgICAgIGdyaWRMaW5lQ29sb3I6ICcjOGU4ZThlJyxcbiAgICAgIHNob3dEb3RzOiBmYWxzZSxcbiAgICAgIHRpbWVab25lOiAnVVRDJyxcbiAgICAgIHRpbWVVbml0OiAndXMnLFxuICAgICAgYm91bmRzOiB7fVxuICAgIH0pO1xuXG4gIHByaXZhdGUgX21hcDogTGVhZmxldC5NYXA7XG4gIHByaXZhdGUgX2hpZGRlbkRhdGE6IG51bWJlcltdO1xuICBwcml2YXRlIGN1cnJlbnRWYWx1ZXNNYXJrZXJzID0gW107XG4gIHByaXZhdGUgYW5ub3RhdGlvbnNNYXJrZXJzID0gW107XG4gIHByaXZhdGUgcG9zaXRpb25BcnJheXNNYXJrZXJzID0gW107XG4gIHByaXZhdGUgX2ljb25BbmNob3I6IExlYWZsZXQuUG9pbnRFeHByZXNzaW9uID0gWzIwLCA1Ml07XG4gIHByaXZhdGUgX3BvcHVwQW5jaG9yOiBMZWFmbGV0LlBvaW50RXhwcmVzc2lvbiA9IFswLCAtNTBdO1xuICBwcml2YXRlIF9oZWF0TGF5ZXI6IGFueTtcbiAgcHJpdmF0ZSBwYXRoRGF0YTogYW55W10gPSBbXTtcbiAgcHJpdmF0ZSBhbm5vdGF0aW9uc0RhdGE6IGFueVtdID0gW107XG4gIHByaXZhdGUgcG9zaXRpb25EYXRhOiBhbnlbXSA9IFtdO1xuICBwcml2YXRlIGdlb0pzb246IGFueVtdID0gW107XG4gIHByaXZhdGUgdGltZVN0YXJ0OiBudW1iZXI7XG4gIHByaXZhdGUgdGltZUVuZDogbnVtYmVyO1xuICBwcml2YXRlIGZpcnN0RHJhdyA9IHRydWU7XG4gIHByaXZhdGUgZmluYWxIZWlnaHQgPSAwO1xuICAvLyBMYXllcnNcbiAgcHJpdmF0ZSBwYXRoRGF0YUxheWVyID0gTGVhZmxldC5mZWF0dXJlR3JvdXAoKTtcbiAgcHJpdmF0ZSBhbm5vdGF0aW9uc0RhdGFMYXllciA9IExlYWZsZXQuZmVhdHVyZUdyb3VwKCk7XG4gIHByaXZhdGUgcG9zaXRpb25EYXRhTGF5ZXIgPSBMZWFmbGV0LmZlYXR1cmVHcm91cCgpO1xuICBwcml2YXRlIHRpbGVMYXllckdyb3VwID0gTGVhZmxldC5mZWF0dXJlR3JvdXAoKTtcbiAgcHJpdmF0ZSBnZW9Kc29uTGF5ZXIgPSBMZWFmbGV0LmZlYXR1cmVHcm91cCgpO1xuICBwcml2YXRlIHRpbGVzTGF5ZXI6IExlYWZsZXQuVGlsZUxheWVyO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBlbDogRWxlbWVudFJlZiwgcHVibGljIHNpemVTZXJ2aWNlOiBTaXplU2VydmljZSwgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyKSB7XG4gICAgdGhpcy5MT0cgPSBuZXcgTG9nZ2VyKFdhcnBWaWV3TWFwQ29tcG9uZW50LCB0aGlzLmRlYnVnKTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2NvbnN0cnVjdG9yJ10sIHRoaXMuZGVidWcpO1xuICAgIHRoaXMuc2l6ZVNlcnZpY2Uuc2l6ZUNoYW5nZWQkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5fbWFwKSB7XG4gICAgICAgIHRoaXMucmVzaXplTWUoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuX29wdGlvbnMgPSBDaGFydExpYi5tZXJnZURlZXAodGhpcy5fb3B0aW9ucywgdGhpcy5kZWZPcHRpb25zKSBhcyBQYXJhbTtcbiAgfVxuXG4gIHJlc2l6ZU1lKCkge1xuICAgIHRoaXMuTE9HLmRlYnVnKFsncmVzaXplTWUnXSwgdGhpcy53cmFwcGVyLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSk7XG4gICAgbGV0IGhlaWdodCA9IHRoaXMud3JhcHBlci5uYXRpdmVFbGVtZW50LnBhcmVudEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xuICAgIGNvbnN0IHdpZHRoID0gdGhpcy53cmFwcGVyLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcbiAgICBpZiAodGhpcy5fb3B0aW9ucy5tYXAuc2hvd1RpbWVTbGlkZXIgJiYgdGhpcy50aW1lU2xpZGVyICYmIHRoaXMudGltZVNsaWRlci5uYXRpdmVFbGVtZW50KSB7XG4gICAgICBoZWlnaHQgLT0gdGhpcy50aW1lU2xpZGVyLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xuICAgIH1cbiAgICBpZiAodGhpcy5fb3B0aW9ucy5tYXAuc2hvd1RpbWVSYW5nZSAmJiB0aGlzLnRpbWVSYW5nZVNsaWRlciAmJiB0aGlzLnRpbWVSYW5nZVNsaWRlci5uYXRpdmVFbGVtZW50KSB7XG4gICAgICBoZWlnaHQgLT0gdGhpcy50aW1lUmFuZ2VTbGlkZXIubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XG4gICAgfVxuICAgIHRoaXMuZmluYWxIZWlnaHQgPSBoZWlnaHQ7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLm1hcERpdi5uYXRpdmVFbGVtZW50LCAnd2lkdGgnLCAnY2FsYygnICsgd2lkdGggKyAncHggLSAnXG4gICAgICArIGdldENvbXB1dGVkU3R5bGUodGhpcy53cmFwcGVyLm5hdGl2ZUVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUoJy0td2FycC12aWV3LW1hcC1tYXJnaW4nKS50cmltKClcbiAgICAgICsgJyAtICdcbiAgICAgICsgZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLndyYXBwZXIubmF0aXZlRWxlbWVudCkuZ2V0UHJvcGVydHlWYWx1ZSgnLS13YXJwLXZpZXctbWFwLW1hcmdpbicpLnRyaW0oKVxuICAgICAgKyAnKScpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5tYXBEaXYubmF0aXZlRWxlbWVudCwgJ2hlaWdodCcsICdjYWxjKCcgKyBoZWlnaHQgKyAncHggLSAnXG4gICAgICArIGdldENvbXB1dGVkU3R5bGUodGhpcy53cmFwcGVyLm5hdGl2ZUVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUoJy0td2FycC12aWV3LW1hcC1tYXJnaW4nKS50cmltKClcbiAgICAgICsgJyAtICdcbiAgICAgICsgZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLndyYXBwZXIubmF0aXZlRWxlbWVudCkuZ2V0UHJvcGVydHlWYWx1ZSgnLS13YXJwLXZpZXctbWFwLW1hcmdpbicpLnRyaW0oKVxuICAgICAgKyAnKScpO1xuICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcbiAgICBpZiAoISF0aGlzLl9tYXApIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5fbWFwLmludmFsaWRhdGVTaXplKCkpO1xuICAgIH1cbiAgfVxuXG4gIGhlYXRSYWRpdXNEaWRDaGFuZ2UoZXZlbnQpIHtcbiAgICB0aGlzLl9oZWF0TGF5ZXIuc2V0T3B0aW9ucyh7cmFkaXVzOiBldmVudC5kZXRhaWwudmFsdWVBc051bWJlcn0pO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnaGVhdFJhZGl1c0RpZENoYW5nZSddLCBldmVudC5kZXRhaWwudmFsdWVBc051bWJlcik7XG4gIH1cblxuICBoZWF0Qmx1ckRpZENoYW5nZShldmVudCkge1xuICAgIHRoaXMuX2hlYXRMYXllci5zZXRPcHRpb25zKHtibHVyOiBldmVudC5kZXRhaWwudmFsdWVBc051bWJlcn0pO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnaGVhdEJsdXJEaWRDaGFuZ2UnXSwgZXZlbnQuZGV0YWlsLnZhbHVlQXNOdW1iZXIpO1xuICB9XG5cbiAgaGVhdE9wYWNpdHlEaWRDaGFuZ2UoZXZlbnQpIHtcbiAgICBjb25zdCBtaW5PcGFjaXR5ID0gZXZlbnQuZGV0YWlsLnZhbHVlQXNOdW1iZXIgLyAxMDA7XG4gICAgdGhpcy5faGVhdExheWVyLnNldE9wdGlvbnMoe21pbk9wYWNpdHl9KTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2hlYXRPcGFjaXR5RGlkQ2hhbmdlJ10sIGV2ZW50LmRldGFpbC52YWx1ZUFzTnVtYmVyKTtcbiAgfVxuXG4gIHByaXZhdGUgZHJhd01hcChyZVpvb206IGJvb2xlYW4pIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RyYXdNYXAnXSwgdGhpcy5fZGF0YSk7XG4gICAgdGhpcy5fb3B0aW9ucyA9IENoYXJ0TGliLm1lcmdlRGVlcDxQYXJhbT4odGhpcy5fb3B0aW9ucywgdGhpcy5kZWZPcHRpb25zKTtcbiAgICB0aGlzLnRpbWVTdGFydCA9IHRoaXMuX29wdGlvbnMubWFwLnRpbWVTdGFydDtcbiAgICBtb21lbnQudHouc2V0RGVmYXVsdCh0aGlzLl9vcHRpb25zLnRpbWVab25lKTtcbiAgICBsZXQgZ3RzOiBhbnkgPSB0aGlzLl9kYXRhO1xuICAgIGlmICghZ3RzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0eXBlb2YgZ3RzID09PSAnc3RyaW5nJykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZ3RzID0gSlNPTi5wYXJzZShndHMgYXMgc3RyaW5nKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKEdUU0xpYi5pc0FycmF5KGd0cykgJiYgZ3RzWzBdICYmIChndHNbMF0gaW5zdGFuY2VvZiBEYXRhTW9kZWwgfHwgZ3RzWzBdLmhhc093blByb3BlcnR5KCdkYXRhJykpKSB7XG4gICAgICBndHMgPSBndHNbMF07XG4gICAgfVxuICAgIGlmICghIXRoaXMuX21hcCkge1xuICAgICAgdGhpcy5fbWFwLmludmFsaWRhdGVTaXplKHRydWUpO1xuICAgIH1cbiAgICBsZXQgZGF0YUxpc3Q6IGFueVtdO1xuICAgIGxldCBwYXJhbXM6IGFueVtdO1xuICAgIGlmIChndHMuZGF0YSkge1xuICAgICAgZGF0YUxpc3QgPSBndHMuZGF0YSBhcyBhbnlbXTtcbiAgICAgIHRoaXMuX29wdGlvbnMgPSBDaGFydExpYi5tZXJnZURlZXA8UGFyYW0+KGd0cy5nbG9iYWxQYXJhbXMgfHwge30sIHRoaXMuX29wdGlvbnMpO1xuICAgICAgdGhpcy50aW1lU3BhbiA9IHRoaXMudGltZVNwYW4gfHwgdGhpcy5fb3B0aW9ucy5tYXAudGltZVNwYW47XG4gICAgICBwYXJhbXMgPSBndHMucGFyYW1zO1xuICAgIH0gZWxzZSB7XG4gICAgICBkYXRhTGlzdCA9IGd0cztcbiAgICAgIHBhcmFtcyA9IFtdO1xuICAgIH1cbiAgICB0aGlzLmRpdmlkZXIgPSBHVFNMaWIuZ2V0RGl2aWRlcih0aGlzLl9vcHRpb25zLnRpbWVVbml0KTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RyYXdNYXAnXSwgZGF0YUxpc3QsIHRoaXMuX29wdGlvbnMsIGd0cy5nbG9iYWxQYXJhbXMpO1xuICAgIGNvbnN0IGZsYXR0ZW5HVFMgPSBHVFNMaWIuZmxhdERlZXAoZGF0YUxpc3QpO1xuXG4gICAgY29uc3Qgc2l6ZSA9IGZsYXR0ZW5HVFMubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICBjb25zdCBpdGVtID0gZmxhdHRlbkdUU1tpXTtcbiAgICAgIGlmIChpdGVtLnYpIHtcbiAgICAgICAgVGltc29ydC5zb3J0KGl0ZW0udiwgKGEsIGIpID0+IGFbMF0gLSBiWzBdKTtcbiAgICAgICAgaXRlbS5pID0gaTtcbiAgICAgICAgaSsrO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ0dUU0xpYi5mbGF0RGVlcChkYXRhTGlzdCknXSwgZmxhdHRlbkdUUyk7XG4gICAgdGhpcy5kaXNwbGF5TWFwKHtndHM6IGZsYXR0ZW5HVFMsIHBhcmFtc30sIHJlWm9vbSk7XG4gIH1cblxuICBwcml2YXRlIGljb24oY29sb3I6IHN0cmluZywgbWFya2VyID0gJycpIHtcbiAgICBjb25zdCBjID0gYCR7Y29sb3Iuc2xpY2UoMSl9YDtcbiAgICBjb25zdCBtID0gbWFya2VyICE9PSAnJyA/IG1hcmtlciA6ICdjaXJjbGUnO1xuICAgIHJldHVybiBMZWFmbGV0Lmljb24oe1xuICAgICAgaWNvblVybDogYGh0dHBzOi8vY2RuLm1hcG1hcmtlci5pby9hcGkvdjEvZm9udC1hd2Vzb21lL3Y0L3Bpbj9pY29uPWZhLSR7bX0maWNvblNpemU9MTcmc2l6ZT00MCZob2Zmc2V0PSR7bSA9PT0gJ2NpcmNsZScgPyAwIDogLTF9JnZvZmZzZXQ9LTQmY29sb3I9ZmZmJmJhY2tncm91bmQ9JHtjfWAsXG4gICAgICBpY29uQW5jaG9yOiB0aGlzLl9pY29uQW5jaG9yLFxuICAgICAgcG9wdXBBbmNob3I6IHRoaXMuX3BvcHVwQW5jaG9yXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHBhdGNoTWFwVGlsZUdhcEJ1ZygpIHtcbiAgICAvLyBXb3JrYXJvdW5kIGZvciAxcHggbGluZXMgYXBwZWFyaW5nIGluIHNvbWUgYnJvd3NlcnMgZHVlIHRvIGZyYWN0aW9uYWwgdHJhbnNmb3Jtc1xuICAgIC8vIGFuZCByZXN1bHRpbmcgYW50aS1hbGlhc2luZy4gYWRhcHRlZCBmcm9tIEBjbXVsZGVycycgc29sdXRpb246XG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL0xlYWZsZXQvTGVhZmxldC9pc3N1ZXMvMzU3NSNpc3N1ZWNvbW1lbnQtMTUwNTQ0NzM5XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IG9yaWdpbmFsSW5pdFRpbGUgPSBMZWFmbGV0LkdyaWRMYXllci5wcm90b3R5cGUuX2luaXRUaWxlO1xuICAgIGlmIChvcmlnaW5hbEluaXRUaWxlLmlzUGF0Y2hlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBMZWFmbGV0LkdyaWRMYXllci5pbmNsdWRlKHtcbiAgICAgIF9pbml0VGlsZSh0aWxlKSB7XG4gICAgICAgIG9yaWdpbmFsSW5pdFRpbGUuY2FsbCh0aGlzLCB0aWxlKTtcbiAgICAgICAgY29uc3QgdGlsZVNpemUgPSB0aGlzLmdldFRpbGVTaXplKCk7XG4gICAgICAgIHRpbGUuc3R5bGUud2lkdGggPSB0aWxlU2l6ZS54ICsgMS41ICsgJ3B4JztcbiAgICAgICAgdGlsZS5zdHlsZS5oZWlnaHQgPSB0aWxlU2l6ZS55ICsgMSArICdweCc7XG4gICAgICB9XG4gICAgfSk7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIExlYWZsZXQuR3JpZExheWVyLnByb3RvdHlwZS5faW5pdFRpbGUuaXNQYXRjaGVkID0gdHJ1ZTtcbiAgfVxuXG4gIHByaXZhdGUgZGlzcGxheU1hcChkYXRhOiB7IGd0czogYW55W10sIHBhcmFtczogYW55W10gfSwgcmVEcmF3ID0gZmFsc2UpIHtcbiAgICB0aGlzLmN1cnJlbnRWYWx1ZXNNYXJrZXJzID0gW107XG4gICAgdGhpcy5MT0cuZGVidWcoWydkcmF3TWFwJ10sIGRhdGEsIHRoaXMuX29wdGlvbnMsIHRoaXMuX2hpZGRlbkRhdGEgfHwgW10pO1xuICAgIGlmICghdGhpcy5sb3dlclRpbWVCb3VuZCkge1xuICAgICAgdGhpcy5sb3dlclRpbWVCb3VuZCA9IHRoaXMuX29wdGlvbnMubWFwLnRpbWVTbGlkZXJNaW4gLyB0aGlzLmRpdmlkZXI7XG4gICAgICB0aGlzLnVwcGVyVGltZUJvdW5kID0gdGhpcy5fb3B0aW9ucy5tYXAudGltZVNsaWRlck1heCAvIHRoaXMuZGl2aWRlcjtcbiAgICB9XG4gICAgbGV0IGhlaWdodCA9IHRoaXMuaGVpZ2h0IHx8IENoYXJ0TGliLkRFRkFVTFRfSEVJR0hUO1xuICAgIGNvbnN0IHdpZHRoID0gdGhpcy53aWR0aCB8fCBDaGFydExpYi5ERUZBVUxUX1dJRFRIO1xuICAgIGlmICh0aGlzLnJlc3BvbnNpdmUgJiYgdGhpcy5maW5hbEhlaWdodCA9PT0gMCkge1xuICAgICAgdGhpcy5yZXNpemVNZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5fb3B0aW9ucy5tYXAuc2hvd1RpbWVTbGlkZXIgJiYgdGhpcy50aW1lU2xpZGVyICYmIHRoaXMudGltZVNsaWRlci5uYXRpdmVFbGVtZW50KSB7XG4gICAgICAgIGhlaWdodCAtPSB0aGlzLnRpbWVTbGlkZXIubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5fb3B0aW9ucy5tYXAuc2hvd1RpbWVSYW5nZSAmJiB0aGlzLnRpbWVSYW5nZVNsaWRlciAmJiB0aGlzLnRpbWVSYW5nZVNsaWRlci5uYXRpdmVFbGVtZW50KSB7XG4gICAgICAgIGhlaWdodCAtPSB0aGlzLnRpbWVSYW5nZVNsaWRlci5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy53aWR0aCA9IHdpZHRoO1xuICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgIGlmIChkYXRhLmd0cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5wYXRoRGF0YSA9IE1hcExpYi50b0xlYWZsZXRNYXBQYXRocyhkYXRhLCB0aGlzLl9oaWRkZW5EYXRhIHx8IFtdLCB0aGlzLmRpdmlkZXIsIHRoaXMuX29wdGlvbnMuc2NoZW1lKSB8fCBbXTtcbiAgICB0aGlzLmFubm90YXRpb25zRGF0YSA9IE1hcExpYi5hbm5vdGF0aW9uc1RvTGVhZmxldFBvc2l0aW9ucyhkYXRhLCB0aGlzLl9oaWRkZW5EYXRhLCB0aGlzLmRpdmlkZXIsIHRoaXMuX29wdGlvbnMuc2NoZW1lKSB8fCBbXTtcbiAgICB0aGlzLnBvc2l0aW9uRGF0YSA9IE1hcExpYi50b0xlYWZsZXRNYXBQb3NpdGlvbkFycmF5KGRhdGEsIHRoaXMuX2hpZGRlbkRhdGEgfHwgW10sIHRoaXMuX29wdGlvbnMuc2NoZW1lKSB8fCBbXTtcbiAgICB0aGlzLmdlb0pzb24gPSBNYXBMaWIudG9HZW9KU09OKGRhdGEpO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZGlzcGxheU1hcCddLCB0aGlzLnBhdGhEYXRhLCB0aGlzLmFubm90YXRpb25zRGF0YSwgdGhpcy5wb3NpdGlvbkRhdGEpO1xuXG4gICAgaWYgKHRoaXMuX29wdGlvbnMubWFwLm1hcFR5cGUgIT09ICdOT05FJykge1xuICAgICAgY29uc3QgbWFwID0gTWFwTGliLm1hcFR5cGVzW3RoaXMuX29wdGlvbnMubWFwLm1hcFR5cGUgfHwgJ0RFRkFVTFQnXTtcbiAgICAgIGNvbnN0IG1hcE9wdHM6IFRpbGVMYXllck9wdGlvbnMgPSB7XG4gICAgICAgIG1heFpvb206IDI0LFxuICAgICAgICBtYXhOYXRpdmVab29tOiAxOSxcbiAgICAgIH07XG4gICAgICBpZiAobWFwLmF0dHJpYnV0aW9uKSB7XG4gICAgICAgIG1hcE9wdHMuYXR0cmlidXRpb24gPSBtYXAuYXR0cmlidXRpb247XG4gICAgICB9XG4gICAgICBpZiAobWFwLnN1YmRvbWFpbnMpIHtcbiAgICAgICAgbWFwT3B0cy5zdWJkb21haW5zID0gbWFwLnN1YmRvbWFpbnM7XG4gICAgICB9XG4gICAgICB0aGlzLnRpbGVzTGF5ZXIgPSBMZWFmbGV0LnRpbGVMYXllcihtYXAubGluaywgbWFwT3B0cyk7XG4gICAgfVxuXG4gICAgaWYgKCEhdGhpcy5fbWFwKSB7XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2Rpc3BsYXlNYXAnXSwgJ21hcCBleGlzdHMnKTtcbiAgICAgIHRoaXMucGF0aERhdGFMYXllci5jbGVhckxheWVycygpO1xuICAgICAgdGhpcy5hbm5vdGF0aW9uc0RhdGFMYXllci5jbGVhckxheWVycygpO1xuICAgICAgdGhpcy5wb3NpdGlvbkRhdGFMYXllci5jbGVhckxheWVycygpO1xuICAgICAgdGhpcy5nZW9Kc29uTGF5ZXIuY2xlYXJMYXllcnMoKTtcbiAgICAgIHRoaXMudGlsZUxheWVyR3JvdXAuY2xlYXJMYXllcnMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5MT0cuZGVidWcoWydkaXNwbGF5TWFwJ10sICdidWlsZCBtYXAnKTtcbiAgICAgIHRoaXMuX21hcCA9IExlYWZsZXQubWFwKHRoaXMubWFwRGl2Lm5hdGl2ZUVsZW1lbnQsIHtcbiAgICAgICAgcHJlZmVyQ2FudmFzOiB0cnVlLFxuICAgICAgICBsYXllcnM6IFt0aGlzLnRpbGVMYXllckdyb3VwLCB0aGlzLmdlb0pzb25MYXllciwgdGhpcy5wYXRoRGF0YUxheWVyLCB0aGlzLmFubm90YXRpb25zRGF0YUxheWVyLCB0aGlzLnBvc2l0aW9uRGF0YUxheWVyXSxcbiAgICAgICAgem9vbUFuaW1hdGlvbjogdHJ1ZSxcbiAgICAgICAgbWF4Wm9vbTogMjRcbiAgICAgIH0pO1xuICAgICAgdGhpcy50aWxlc0xheWVyLmFkZFRvKHRoaXMuX21hcCk7XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2Rpc3BsYXlNYXAnXSwgJ2J1aWxkIG1hcCcsIHRoaXMudGlsZXNMYXllcik7XG4gICAgICB0aGlzLmdlb0pzb25MYXllci5icmluZ1RvQmFjaygpO1xuICAgICAgdGhpcy50aWxlc0xheWVyLmJyaW5nVG9CYWNrKCk7IC8vIFRPRE86IHRlc3RlclxuICAgICAgdGhpcy5fbWFwLm9uKCdsb2FkJywgKCkgPT4gdGhpcy5MT0cuZGVidWcoWydkaXNwbGF5TWFwJywgJ2xvYWQnXSwgdGhpcy5fbWFwLmdldENlbnRlcigpLmxuZywgdGhpcy5jdXJyZW50TG9uZywgdGhpcy5fbWFwLmdldFpvb20oKSkpO1xuICAgICAgdGhpcy5fbWFwLm9uKCd6b29tZW5kJywgKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuZmlyc3REcmF3KSB7XG4gICAgICAgICAgdGhpcy5MT0cuZGVidWcoWydtb3ZlZW5kJ10sIHRoaXMuX21hcC5nZXRDZW50ZXIoKSk7XG4gICAgICAgICAgdGhpcy5jdXJyZW50Wm9vbSA9IHRoaXMuX21hcC5nZXRab29tKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy5fbWFwLm9uKCdtb3ZlZW5kJywgKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuZmlyc3REcmF3KSB7XG4gICAgICAgICAgdGhpcy5MT0cuZGVidWcoWydtb3ZlZW5kJ10sIHRoaXMuX21hcC5nZXRDZW50ZXIoKSk7XG4gICAgICAgICAgdGhpcy5jdXJyZW50TGF0ID0gdGhpcy5fbWFwLmdldENlbnRlcigpLmxhdDtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRMb25nID0gdGhpcy5fbWFwLmdldENlbnRlcigpLmxuZztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgbGV0IHNpemUgPSAodGhpcy5wYXRoRGF0YSB8fCBbXSkubGVuZ3RoO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZGlzcGxheU1hcCddLCAnYnVpbGQgbWFwIGRvbmUnLCBzaXplKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgY29uc3QgZCA9IHRoaXMucGF0aERhdGFbaV07XG4gICAgICBpZiAoISFkKSB7XG4gICAgICAgIGNvbnN0IHBsb3R0ZWRHdHM6IGFueSA9IHRoaXMudXBkYXRlR3RzUGF0aChkKTtcbiAgICAgICAgaWYgKCEhcGxvdHRlZEd0cykge1xuICAgICAgICAgIHRoaXMuY3VycmVudFZhbHVlc01hcmtlcnMucHVzaChwbG90dGVkR3RzLmJlZm9yZUN1cnJlbnRWYWx1ZSk7XG4gICAgICAgICAgdGhpcy5jdXJyZW50VmFsdWVzTWFya2Vycy5wdXNoKHBsb3R0ZWRHdHMuYWZ0ZXJDdXJyZW50VmFsdWUpO1xuICAgICAgICAgIHRoaXMuY3VycmVudFZhbHVlc01hcmtlcnMucHVzaChwbG90dGVkR3RzLmN1cnJlbnRWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5MT0cuZGVidWcoWydkaXNwbGF5TWFwJ10sICd0aGlzLnBhdGhEYXRhJywgdGhpcy5wYXRoRGF0YSk7XG4gICAgc2l6ZSA9ICh0aGlzLmFubm90YXRpb25zRGF0YSB8fCBbXSkubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICBjb25zdCBkID0gdGhpcy5hbm5vdGF0aW9uc0RhdGFbaV07XG4gICAgICBjb25zdCBwbG90dGVkR3RzOiBhbnkgPSB0aGlzLnVwZGF0ZUd0c1BhdGgoZCk7XG4gICAgICBpZiAoISFwbG90dGVkR3RzKSB7XG4gICAgICAgIGlmIChkLnJlbmRlciA9PT0gJ2xpbmUnKSB7XG4gICAgICAgICAgdGhpcy5jdXJyZW50VmFsdWVzTWFya2Vycy5wdXNoKHBsb3R0ZWRHdHMuYmVmb3JlQ3VycmVudFZhbHVlKTtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRWYWx1ZXNNYXJrZXJzLnB1c2gocGxvdHRlZEd0cy5hZnRlckN1cnJlbnRWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdXJyZW50VmFsdWVzTWFya2Vycy5wdXNoKHBsb3R0ZWRHdHMuY3VycmVudFZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCEhdGhpcy5fbWFwKSB7XG4gICAgICB0aGlzLnBhdGhEYXRhTGF5ZXIgPSBMZWFmbGV0LmZlYXR1cmVHcm91cCh0aGlzLmN1cnJlbnRWYWx1ZXNNYXJrZXJzIHx8IFtdKS5hZGRUbyh0aGlzLl9tYXApO1xuICAgIH1cbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2Rpc3BsYXlNYXAnLCAnYW5ub3RhdGlvbnNNYXJrZXJzJ10sIHRoaXMuYW5ub3RhdGlvbnNNYXJrZXJzKTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2Rpc3BsYXlNYXAnLCAndGhpcy5oaWRkZW5EYXRhJ10sIHRoaXMuaGlkZGVuRGF0YSk7XG4gICAgdGhpcy5MT0cuZGVidWcoWydkaXNwbGF5TWFwJywgJ3RoaXMucG9zaXRpb25EYXRhJ10sIHRoaXMucG9zaXRpb25EYXRhKTtcbiAgICAvLyBDcmVhdGUgdGhlIHBvc2l0aW9ucyBhcnJheXNcbiAgICBzaXplID0gKHRoaXMucG9zaXRpb25EYXRhIHx8IFtdKS5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIGNvbnN0IGQgPSB0aGlzLnBvc2l0aW9uRGF0YVtpXTtcbiAgICAgIHRoaXMucG9zaXRpb25BcnJheXNNYXJrZXJzID0gdGhpcy5wb3NpdGlvbkFycmF5c01hcmtlcnMuY29uY2F0KHRoaXMudXBkYXRlUG9zaXRpb25BcnJheShkKSk7XG4gICAgfVxuICAgIHRoaXMuTE9HLmRlYnVnKFsnZGlzcGxheU1hcCddLCAndGhpcy5wbyBzaXRpb25EYXRhJyk7XG4gICAgc2l6ZSA9ICh0aGlzLmFubm90YXRpb25zRGF0YSB8fCBbXSkubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICBjb25zdCBkID0gdGhpcy5hbm5vdGF0aW9uc0RhdGFbaV07XG4gICAgICB0aGlzLnBvc2l0aW9uQXJyYXlzTWFya2VycyA9IHRoaXMucG9zaXRpb25BcnJheXNNYXJrZXJzLmNvbmNhdCh0aGlzLnVwZGF0ZUFubm90YXRpb24oZCkpO1xuICAgIH1cbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2Rpc3BsYXlNYXAnXSwgJ3RoaXMuYW5ub3RhdGlvbnNEYXRhJyk7XG5cbiAgICAodGhpcy5fb3B0aW9ucy5tYXAudGlsZXMgfHwgW10pLmZvckVhY2goKHQpID0+IHsgLy8gVE9ETyB0byB0ZXN0XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2Rpc3BsYXlNYXAnXSwgdCk7XG4gICAgICBpZiAodGhpcy5fb3B0aW9ucy5tYXAuc2hvd1RpbWVSYW5nZSkge1xuICAgICAgICB0aGlzLnRpbGVMYXllckdyb3VwLmFkZExheWVyKExlYWZsZXQudGlsZUxheWVyKHRcbiAgICAgICAgICAgIC5yZXBsYWNlKCd7c3RhcnR9JywgbW9tZW50KHRoaXMudGltZVN0YXJ0KS50b0lTT1N0cmluZygpKVxuICAgICAgICAgICAgLnJlcGxhY2UoJ3tlbmR9JywgbW9tZW50KHRoaXMudGltZUVuZCkudG9JU09TdHJpbmcoKSksIHtcbiAgICAgICAgICAgIHN1YmRvbWFpbnM6ICdhYmNkJyxcbiAgICAgICAgICAgIG1heE5hdGl2ZVpvb206IDE5LFxuICAgICAgICAgICAgbWF4Wm9vbTogNDBcbiAgICAgICAgICB9XG4gICAgICAgICkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy50aWxlTGF5ZXJHcm91cC5hZGRMYXllcihMZWFmbGV0LnRpbGVMYXllcih0LCB7XG4gICAgICAgICAgc3ViZG9tYWluczogJ2FiY2QnLFxuICAgICAgICAgIG1heE5hdGl2ZVpvb206IDE5LFxuICAgICAgICAgIG1heFpvb206IDQwXG4gICAgICAgIH0pKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2Rpc3BsYXlNYXAnXSwgJ3RoaXMudGlsZXMnKTtcblxuICAgIHRoaXMuTE9HLmRlYnVnKFsnZGlzcGxheU1hcCcsICdwb3NpdGlvbkFycmF5c01hcmtlcnMnXSwgdGhpcy5wb3NpdGlvbkFycmF5c01hcmtlcnMpO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZGlzcGxheU1hcCcsICdhbm5vdGF0aW9uc01hcmtlcnMnXSwgdGhpcy5hbm5vdGF0aW9uc01hcmtlcnMpO1xuXG4gICAgc2l6ZSA9ICh0aGlzLnBvc2l0aW9uQXJyYXlzTWFya2VycyB8fCBbXSkubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICBjb25zdCBtID0gdGhpcy5wb3NpdGlvbkFycmF5c01hcmtlcnNbaV07XG4gICAgICBtLmFkZFRvKHRoaXMucG9zaXRpb25EYXRhTGF5ZXIpO1xuICAgIH1cbiAgICBzaXplID0gKHRoaXMuYW5ub3RhdGlvbnNNYXJrZXJzIHx8IFtdKS5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIGNvbnN0IG0gPSB0aGlzLmFubm90YXRpb25zTWFya2Vyc1tpXTtcbiAgICAgIG0uYWRkVG8odGhpcy5hbm5vdGF0aW9uc0RhdGFMYXllcik7XG4gICAgfVxuXG4gICAgdGhpcy5MT0cuZGVidWcoWydkaXNwbGF5TWFwJywgJ2dlb0pzb24nXSwgdGhpcy5nZW9Kc29uKTtcbiAgICBzaXplID0gKHRoaXMuZ2VvSnNvbiB8fCBbXSkubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICBjb25zdCBtID0gdGhpcy5nZW9Kc29uW2ldO1xuICAgICAgY29uc3QgY29sb3IgPSBDb2xvckxpYi5nZXRDb2xvcihpLCB0aGlzLl9vcHRpb25zLnNjaGVtZSk7XG4gICAgICBjb25zdCBvcHRzID0ge1xuICAgICAgICBzdHlsZTogKCkgPT4gKHtcbiAgICAgICAgICBjb2xvcjogKGRhdGEucGFyYW1zICYmIGRhdGEucGFyYW1zW2ldKSA/IGRhdGEucGFyYW1zW2ldLmNvbG9yIHx8IGNvbG9yIDogY29sb3IsXG4gICAgICAgICAgZmlsbENvbG9yOiAoZGF0YS5wYXJhbXMgJiYgZGF0YS5wYXJhbXNbaV0pXG4gICAgICAgICAgICA/IENvbG9yTGliLnRyYW5zcGFyZW50aXplKGRhdGEucGFyYW1zW2ldLmZpbGxDb2xvciB8fCBjb2xvcilcbiAgICAgICAgICAgIDogQ29sb3JMaWIudHJhbnNwYXJlbnRpemUoY29sb3IpLFxuICAgICAgICB9KVxuICAgICAgfSBhcyBhbnk7XG4gICAgICBpZiAobS5nZW9tZXRyeS50eXBlID09PSAnUG9pbnQnKSB7XG4gICAgICAgIG9wdHMucG9pbnRUb0xheWVyID0gKGdlb0pzb25Qb2ludCwgbGF0bG5nKSA9PiBMZWFmbGV0Lm1hcmtlcihsYXRsbmcsIHtcbiAgICAgICAgICBpY29uOiB0aGlzLmljb24oY29sb3IsIChkYXRhLnBhcmFtcyAmJiBkYXRhLnBhcmFtc1tpXSkgPyBkYXRhLnBhcmFtc1tpXS5tYXJrZXIgOiAnY2lyY2xlJyksXG4gICAgICAgICAgb3BhY2l0eTogMSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBsZXQgZGlzcGxheSA9ICcnO1xuICAgICAgY29uc3QgZ2VvU2hhcGUgPSBMZWFmbGV0Lmdlb0pTT04obSwgb3B0cyk7XG4gICAgICBpZiAobS5wcm9wZXJ0aWVzKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKG0ucHJvcGVydGllcykuZm9yRWFjaChrID0+IGRpc3BsYXkgKz0gYDxiPiR7a308L2I+OiAke20ucHJvcGVydGllc1trXX08YnIgLz5gKTtcbiAgICAgICAgZ2VvU2hhcGUuYmluZFBvcHVwKGRpc3BsYXkpO1xuICAgICAgfVxuICAgICAgZ2VvU2hhcGUuYWRkVG8odGhpcy5nZW9Kc29uTGF5ZXIpO1xuICAgIH1cbiAgICBpZiAodGhpcy5wYXRoRGF0YS5sZW5ndGggPiAwIHx8IHRoaXMucG9zaXRpb25EYXRhLmxlbmd0aCA+IDAgfHwgdGhpcy5hbm5vdGF0aW9uc0RhdGEubGVuZ3RoID4gMCB8fCB0aGlzLmdlb0pzb24ubGVuZ3RoID4gMCkge1xuICAgICAgLy8gRml0IG1hcCB0byBjdXJ2ZXNcbiAgICAgIGNvbnN0IGdyb3VwID0gTGVhZmxldC5mZWF0dXJlR3JvdXAoW3RoaXMuZ2VvSnNvbkxheWVyLCB0aGlzLmFubm90YXRpb25zRGF0YUxheWVyLCB0aGlzLnBvc2l0aW9uRGF0YUxheWVyLCB0aGlzLnBhdGhEYXRhTGF5ZXJdKTtcbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsnZGlzcGxheU1hcCcsICdzZXRWaWV3J10sICdmaXRCb3VuZHMnLCBncm91cC5nZXRCb3VuZHMoKSk7XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2Rpc3BsYXlNYXAnLCAnc2V0VmlldyddLCB7bGF0OiB0aGlzLmN1cnJlbnRMYXQsIGxuZzogdGhpcy5jdXJyZW50TG9uZ30sIHtcbiAgICAgICAgbGF0OiB0aGlzLl9vcHRpb25zLm1hcC5zdGFydExhdCxcbiAgICAgICAgbG5nOiB0aGlzLl9vcHRpb25zLm1hcC5zdGFydExvbmdcbiAgICAgIH0pO1xuICAgICAgdGhpcy5ib3VuZHMgPSBncm91cC5nZXRCb3VuZHMoKTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBpZiAoISF0aGlzLmJvdW5kcyAmJiB0aGlzLmJvdW5kcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICBpZiAoKHRoaXMuY3VycmVudExhdCB8fCB0aGlzLl9vcHRpb25zLm1hcC5zdGFydExhdCkgJiYgKHRoaXMuY3VycmVudExvbmcgfHwgdGhpcy5fb3B0aW9ucy5tYXAuc3RhcnRMb25nKSkge1xuICAgICAgICAgICAgdGhpcy5fbWFwLnNldFZpZXcoe1xuICAgICAgICAgICAgICAgIGxhdDogdGhpcy5jdXJyZW50TGF0IHx8IHRoaXMuX29wdGlvbnMubWFwLnN0YXJ0TGF0IHx8IDAsXG4gICAgICAgICAgICAgICAgbG5nOiB0aGlzLmN1cnJlbnRMb25nIHx8IHRoaXMuX29wdGlvbnMubWFwLnN0YXJ0TG9uZyB8fCAwXG4gICAgICAgICAgICAgIH0sIHRoaXMuY3VycmVudFpvb20gfHwgdGhpcy5fb3B0aW9ucy5tYXAuc3RhcnRab29tIHx8IDEwLFxuICAgICAgICAgICAgICB7YW5pbWF0ZTogZmFsc2UsIGR1cmF0aW9uOiA1MDB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fbWFwLmZpdEJvdW5kcyh0aGlzLmJvdW5kcywge3BhZGRpbmc6IFsxLCAxXSwgYW5pbWF0ZTogZmFsc2UsIGR1cmF0aW9uOiAwfSk7XG4gICAgICAgICAgICAvLyAgIHRoaXMuY3VycmVudFpvb20gPSB0aGlzLl9tYXAuZ2V0Qm91bmRzWm9vbSh0aGlzLmJvdW5kcywgZmFsc2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmN1cnJlbnRMYXQgPSB0aGlzLl9tYXAuZ2V0Q2VudGVyKCkubGF0O1xuICAgICAgICAgIHRoaXMuY3VycmVudExvbmcgPSB0aGlzLl9tYXAuZ2V0Q2VudGVyKCkubG5nO1xuICAgICAgICAgIC8vICB0aGlzLmN1cnJlbnRab29tID0gdGhpcy5fbWFwLmdldFpvb20oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2Rpc3BsYXlNYXAnLCAnc2V0VmlldyddLCB7bGF0OiB0aGlzLmN1cnJlbnRMYXQsIGxuZzogdGhpcy5jdXJyZW50TG9uZ30pO1xuICAgICAgICAgIHRoaXMuX21hcC5zZXRWaWV3KHtcbiAgICAgICAgICAgICAgbGF0OiB0aGlzLmN1cnJlbnRMYXQgfHwgdGhpcy5fb3B0aW9ucy5tYXAuc3RhcnRMYXQgfHwgMCxcbiAgICAgICAgICAgICAgbG5nOiB0aGlzLmN1cnJlbnRMb25nIHx8IHRoaXMuX29wdGlvbnMubWFwLnN0YXJ0TG9uZyB8fCAwXG4gICAgICAgICAgICB9LCB0aGlzLmN1cnJlbnRab29tIHx8IHRoaXMuX29wdGlvbnMubWFwLnN0YXJ0Wm9vbSB8fCAxMCxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgYW5pbWF0ZTogZmFsc2UsXG4gICAgICAgICAgICAgIGR1cmF0aW9uOiA1MDBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9LCAxMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsnZGlzcGxheU1hcCcsICdsb3N0J10sICdsb3N0JywgdGhpcy5jdXJyZW50Wm9vbSwgdGhpcy5fb3B0aW9ucy5tYXAuc3RhcnRab29tKTtcbiAgICAgIHRoaXMuX21hcC5zZXRWaWV3KFxuICAgICAgICBbXG4gICAgICAgICAgdGhpcy5jdXJyZW50TGF0IHx8IHRoaXMuX29wdGlvbnMubWFwLnN0YXJ0TGF0IHx8IDAsXG4gICAgICAgICAgdGhpcy5jdXJyZW50TG9uZyB8fCB0aGlzLl9vcHRpb25zLm1hcC5zdGFydExvbmcgfHwgMFxuICAgICAgICBdLFxuICAgICAgICB0aGlzLmN1cnJlbnRab29tIHx8IHRoaXMuX29wdGlvbnMubWFwLnN0YXJ0Wm9vbSB8fCAyLFxuICAgICAgICB7XG4gICAgICAgICAgYW5pbWF0ZTogZmFsc2UsXG4gICAgICAgICAgZHVyYXRpb246IDBcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuaGVhdERhdGEgJiYgdGhpcy5oZWF0RGF0YS5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLl9oZWF0TGF5ZXIgPSAoTGVhZmxldCBhcyBhbnkpLmhlYXRMYXllcih0aGlzLmhlYXREYXRhLCB7XG4gICAgICAgIHJhZGl1czogdGhpcy5fb3B0aW9ucy5tYXAuaGVhdFJhZGl1cyxcbiAgICAgICAgYmx1cjogdGhpcy5fb3B0aW9ucy5tYXAuaGVhdEJsdXIsXG4gICAgICAgIG1pbk9wYWNpdHk6IHRoaXMuX29wdGlvbnMubWFwLmhlYXRPcGFjaXR5XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX2hlYXRMYXllci5hZGRUbyh0aGlzLl9tYXApO1xuICAgIH1cbiAgICB0aGlzLmZpcnN0RHJhdyA9IGZhbHNlO1xuICAgIHRoaXMucmVzaXplTWUoKTtcbiAgICB0aGlzLnBhdGNoTWFwVGlsZUdhcEJ1ZygpO1xuICAgIHRoaXMuY2hhcnREcmF3LmVtaXQodHJ1ZSk7XG4gIH1cblxuICB1cGRhdGVBbm5vdGF0aW9uKGd0cykge1xuICAgIGNvbnN0IHBvc2l0aW9ucyA9IFtdO1xuICAgIGxldCBpY29uO1xuICAgIGxldCBzaXplO1xuICAgIHN3aXRjaCAoZ3RzLnJlbmRlcikge1xuICAgICAgY2FzZSAnbWFya2VyJzpcbiAgICAgICAgaWNvbiA9IHRoaXMuaWNvbihndHMuY29sb3IsIGd0cy5tYXJrZXIpO1xuICAgICAgICBzaXplID0gKGd0cy5wYXRoIHx8IFtdKS5sZW5ndGg7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgZyA9IGd0cy5wYXRoW2ldO1xuICAgICAgICAgIGNvbnN0IG1hcmtlciA9IExlYWZsZXQubWFya2VyKGcsIHtpY29uLCBvcGFjaXR5OiAxfSk7XG4gICAgICAgICAgbWFya2VyLmJpbmRQb3B1cChnLnZhbC50b1N0cmluZygpKTtcbiAgICAgICAgICBwb3NpdGlvbnMucHVzaChtYXJrZXIpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnd2VpZ2h0ZWREb3RzJzpcbiAgICAgICAgc2l6ZSA9IChndHMucGF0aCB8fCBbXSkubGVuZ3RoO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgICAgIGNvbnN0IHAgPSBndHMucGF0aFtpXTtcbiAgICAgICAgICBpZiAoKHRoaXMuX2hpZGRlbkRhdGEgfHwgW10pLmZpbHRlcihoID0+IGggPT09IGd0cy5rZXkpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgbGV0IHYgPSBwYXJzZUludChwLnZhbCwgMTApO1xuICAgICAgICAgICAgaWYgKGlzTmFOKHYpKSB7XG4gICAgICAgICAgICAgIHYgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcmFkaXVzID0gKHYgLSAoZ3RzLm1pblZhbHVlIHx8IDApKSAqIDUwIC8gKGd0cy5tYXhWYWx1ZSB8fCA1MCk7XG4gICAgICAgICAgICBjb25zdCBtYXJrZXIgPSBMZWFmbGV0LmNpcmNsZU1hcmtlcihcbiAgICAgICAgICAgICAgcCwge1xuICAgICAgICAgICAgICAgIHJhZGl1czogcmFkaXVzID09PSAwID8gMSA6IHJhZGl1cyxcbiAgICAgICAgICAgICAgICBjb2xvcjogZ3RzLmJvcmRlckNvbG9yLFxuICAgICAgICAgICAgICAgIGZpbGxDb2xvcjogZ3RzLmNvbG9yLCBmaWxsT3BhY2l0eTogMC41LFxuICAgICAgICAgICAgICAgIHdlaWdodDogMVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuYWRkUG9wdXAoZ3RzLCBwLnZhbCwgbWFya2VyKTtcbiAgICAgICAgICAgIHBvc2l0aW9ucy5wdXNoKG1hcmtlcik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZG90cyc6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBzaXplID0gKGd0cy5wYXRoIHx8IFtdKS5sZW5ndGg7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgZyA9IGd0cy5wYXRoW2ldO1xuICAgICAgICAgIGNvbnN0IG1hcmtlciA9IExlYWZsZXQuY2lyY2xlTWFya2VyKFxuICAgICAgICAgICAgZywge1xuICAgICAgICAgICAgICByYWRpdXM6IGd0cy5iYXNlUmFkaXVzLFxuICAgICAgICAgICAgICBjb2xvcjogZ3RzLmNvbG9yLFxuICAgICAgICAgICAgICBmaWxsQ29sb3I6IGd0cy5jb2xvcixcbiAgICAgICAgICAgICAgZmlsbE9wYWNpdHk6IDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApO1xuICAgICAgICAgIG1hcmtlci5iaW5kUG9wdXAoZy52YWwudG9TdHJpbmcoKSk7XG4gICAgICAgICAgcG9zaXRpb25zLnB1c2gobWFya2VyKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIHBvc2l0aW9ucztcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlR3RzUGF0aChndHM6IGFueSkge1xuICAgIGNvbnN0IGJlZm9yZUN1cnJlbnRWYWx1ZSA9IExlYWZsZXQucG9seWxpbmUoXG4gICAgICBNYXBMaWIucGF0aERhdGFUb0xlYWZsZXQoZ3RzLnBhdGgsIHt0bzogMH0pLCB7XG4gICAgICAgIGNvbG9yOiBndHMuY29sb3IsXG4gICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICB9KTtcbiAgICBjb25zdCBhZnRlckN1cnJlbnRWYWx1ZSA9IExlYWZsZXQucG9seWxpbmUoXG4gICAgICBNYXBMaWIucGF0aERhdGFUb0xlYWZsZXQoZ3RzLnBhdGgsIHtmcm9tOiAwfSksIHtcbiAgICAgICAgY29sb3I6IGd0cy5jb2xvcixcbiAgICAgICAgb3BhY2l0eTogMC43LFxuICAgICAgfSk7XG4gICAgbGV0IGN1cnJlbnRWYWx1ZTtcbiAgICAvLyBMZXQncyB2ZXJpZnkgd2UgaGF2ZSBhIHBhdGguLi4gTm8gcGF0aCwgbm8gbWFya2VyXG4gICAgY29uc3Qgc2l6ZSA9IChndHMucGF0aCB8fCBbXSkubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICBjb25zdCBwID0gZ3RzLnBhdGhbaV07XG4gICAgICBsZXQgZGF0ZTtcbiAgICAgIGlmICh0aGlzLl9vcHRpb25zLnRpbWVNb2RlICYmIHRoaXMuX29wdGlvbnMudGltZU1vZGUgPT09ICd0aW1lc3RhbXAnKSB7XG4gICAgICAgIGRhdGUgPSBwYXJzZUludChwLnRzLCAxMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkYXRlID0gKG1vbWVudChwYXJzZUludChwLnRzLCAxMCkpXG4gICAgICAgICAgLnV0Yyh0cnVlKS50b0lTT1N0cmluZygpIHx8ICcnKVxuICAgICAgICAgIC5yZXBsYWNlKCdaJywgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSA9PT0gJ1VUQycgPyAnWicgOiAnJyk7XG4gICAgICB9XG4gICAgICBjdXJyZW50VmFsdWUgPSBMZWFmbGV0LmNpcmNsZU1hcmtlcihbcC5sYXQsIHAubG9uXSxcbiAgICAgICAge3JhZGl1czogTWFwTGliLkJBU0VfUkFESVVTLCBjb2xvcjogZ3RzLmNvbG9yLCBmaWxsQ29sb3I6IGd0cy5jb2xvciwgZmlsbE9wYWNpdHk6IDAuN30pXG4gICAgICAgIC5iaW5kUG9wdXAoYDxwPiR7ZGF0ZX08L3A+PHA+PGI+JHtndHMua2V5fTwvYj46ICR7cC52YWwudG9TdHJpbmcoKX08L3A+YCk7XG4gICAgfVxuICAgIGlmIChzaXplID4gMCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgYmVmb3JlQ3VycmVudFZhbHVlLFxuICAgICAgICBhZnRlckN1cnJlbnRWYWx1ZSxcbiAgICAgICAgY3VycmVudFZhbHVlLFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFkZFBvcHVwKHBvc2l0aW9uRGF0YTogYW55LCB2YWx1ZTogYW55LCBtYXJrZXI6IGFueSkge1xuICAgIGlmICghIXBvc2l0aW9uRGF0YSkge1xuICAgICAgbGV0IGNvbnRlbnQgPSAnJztcbiAgICAgIGlmIChwb3NpdGlvbkRhdGEua2V5KSB7XG4gICAgICAgIGNvbnRlbnQgPSBgPHA+PGI+JHtwb3NpdGlvbkRhdGEua2V5fTwvYj46ICR7dmFsdWUgfHwgJ25hJ308L3A+YDtcbiAgICAgIH1cbiAgICAgIE9iamVjdC5rZXlzKHBvc2l0aW9uRGF0YS5wcm9wZXJ0aWVzIHx8IFtdKS5mb3JFYWNoKGsgPT4gY29udGVudCArPSBgPGI+JHtrfTwvYj46ICR7cG9zaXRpb25EYXRhLnByb3BlcnRpZXNba119PGJyIC8+YCk7XG4gICAgICBtYXJrZXIuYmluZFBvcHVwKGNvbnRlbnQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlUG9zaXRpb25BcnJheShwb3NpdGlvbkRhdGE6IGFueSkge1xuICAgIGNvbnN0IHBvc2l0aW9ucyA9IFtdO1xuICAgIGxldCBwb2x5bGluZTtcbiAgICBsZXQgaWNvbjtcbiAgICBsZXQgcmVzdWx0O1xuICAgIGxldCBpblN0ZXA7XG4gICAgbGV0IHNpemU7XG4gICAgdGhpcy5MT0cuZGVidWcoWyd1cGRhdGVQb3NpdGlvbkFycmF5J10sIHBvc2l0aW9uRGF0YSk7XG4gICAgc3dpdGNoIChwb3NpdGlvbkRhdGEucmVuZGVyKSB7XG4gICAgICBjYXNlICdwYXRoJzpcbiAgICAgICAgcG9seWxpbmUgPSBMZWFmbGV0LnBvbHlsaW5lKHBvc2l0aW9uRGF0YS5wb3NpdGlvbnMsIHtjb2xvcjogcG9zaXRpb25EYXRhLmNvbG9yLCBvcGFjaXR5OiAxfSk7XG4gICAgICAgIHBvc2l0aW9ucy5wdXNoKHBvbHlsaW5lKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtYXJrZXInOlxuICAgICAgICBpY29uID0gdGhpcy5pY29uKHBvc2l0aW9uRGF0YS5jb2xvciwgcG9zaXRpb25EYXRhLm1hcmtlcik7XG4gICAgICAgIHNpemUgPSAocG9zaXRpb25EYXRhLnBvc2l0aW9ucyB8fCBbXSkubGVuZ3RoO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgICAgIGNvbnN0IHAgPSBwb3NpdGlvbkRhdGEucG9zaXRpb25zW2ldO1xuICAgICAgICAgIGlmICgodGhpcy5oaWRkZW5EYXRhIHx8IFtdKS5maWx0ZXIoaCA9PiBoID09PSBwb3NpdGlvbkRhdGEua2V5KS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGNvbnN0IG1hcmtlciA9IExlYWZsZXQubWFya2VyKHtsYXQ6IHBbMF0sIGxuZzogcFsxXX0sIHtpY29uLCBvcGFjaXR5OiAxfSk7XG4gICAgICAgICAgICB0aGlzLmFkZFBvcHVwKHBvc2l0aW9uRGF0YSwgcFsyXSwgbWFya2VyKTtcbiAgICAgICAgICAgIHBvc2l0aW9ucy5wdXNoKG1hcmtlcik7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuTE9HLmRlYnVnKFsndXBkYXRlUG9zaXRpb25BcnJheScsICdidWlsZCBtYXJrZXInXSwgaWNvbik7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjb2xvcmVkV2VpZ2h0ZWREb3RzJzpcbiAgICAgICAgdGhpcy5MT0cuZGVidWcoWyd1cGRhdGVQb3NpdGlvbkFycmF5JywgJ2NvbG9yZWRXZWlnaHRlZERvdHMnXSwgcG9zaXRpb25EYXRhKTtcbiAgICAgICAgcmVzdWx0ID0gW107XG4gICAgICAgIGluU3RlcCA9IFtdO1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHBvc2l0aW9uRGF0YS5udW1Db2xvclN0ZXBzOyBqKyspIHtcbiAgICAgICAgICByZXN1bHRbal0gPSAwO1xuICAgICAgICAgIGluU3RlcFtqXSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgc2l6ZSA9IChwb3NpdGlvbkRhdGEucG9zaXRpb25zIHx8IFtdKS5sZW5ndGg7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgcCA9IHBvc2l0aW9uRGF0YS5wb3NpdGlvbnNbaV07XG4gICAgICAgICAgaWYgKCh0aGlzLl9oaWRkZW5EYXRhIHx8IFtdKS5maWx0ZXIoaCA9PiBoID09PSBwb3NpdGlvbkRhdGEua2V5KS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuTE9HLmRlYnVnKFsndXBkYXRlUG9zaXRpb25BcnJheScsICdjb2xvcmVkV2VpZ2h0ZWREb3RzJywgJ3JhZGl1cyddLCBwb3NpdGlvbkRhdGEuYmFzZVJhZGl1cyAqIHBbNF0pO1xuICAgICAgICAgICAgY29uc3QgbWFya2VyID0gTGVhZmxldC5jaXJjbGVNYXJrZXIoXG4gICAgICAgICAgICAgIHtsYXQ6IHBbMF0sIGxuZzogcFsxXX0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByYWRpdXM6IHBvc2l0aW9uRGF0YS5iYXNlUmFkaXVzICogKHBhcnNlSW50KHBbNF0sIDEwKSArIDEpLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBwb3NpdGlvbkRhdGEuYm9yZGVyQ29sb3IsXG4gICAgICAgICAgICAgICAgZmlsbENvbG9yOiBDb2xvckxpYi5yZ2IyaGV4KFxuICAgICAgICAgICAgICAgICAgcG9zaXRpb25EYXRhLmNvbG9yR3JhZGllbnRbcFs1XV0ucixcbiAgICAgICAgICAgICAgICAgIHBvc2l0aW9uRGF0YS5jb2xvckdyYWRpZW50W3BbNV1dLmcsXG4gICAgICAgICAgICAgICAgICBwb3NpdGlvbkRhdGEuY29sb3JHcmFkaWVudFtwWzVdXS5iKSxcbiAgICAgICAgICAgICAgICBmaWxsT3BhY2l0eTogMC43LFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuYWRkUG9wdXAocG9zaXRpb25EYXRhLCBwWzJdLCBtYXJrZXIpO1xuICAgICAgICAgICAgcG9zaXRpb25zLnB1c2gobWFya2VyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd3ZWlnaHRlZERvdHMnOlxuICAgICAgICBzaXplID0gKHBvc2l0aW9uRGF0YS5wb3NpdGlvbnMgfHwgW10pLmxlbmd0aDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBwID0gcG9zaXRpb25EYXRhLnBvc2l0aW9uc1tpXTtcbiAgICAgICAgICBpZiAoKHRoaXMuX2hpZGRlbkRhdGEgfHwgW10pLmZpbHRlcihoID0+IGggPT09IHBvc2l0aW9uRGF0YS5rZXkpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgY29uc3QgbWFya2VyID0gTGVhZmxldC5jaXJjbGVNYXJrZXIoXG4gICAgICAgICAgICAgIHtsYXQ6IHBbMF0sIGxuZzogcFsxXX0sIHtcbiAgICAgICAgICAgICAgICByYWRpdXM6IHBvc2l0aW9uRGF0YS5iYXNlUmFkaXVzICogKHBhcnNlSW50KHBbNF0sIDEwKSArIDEpLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBwb3NpdGlvbkRhdGEuYm9yZGVyQ29sb3IsXG4gICAgICAgICAgICAgICAgZmlsbENvbG9yOiBwb3NpdGlvbkRhdGEuY29sb3IsIGZpbGxPcGFjaXR5OiAwLjcsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5hZGRQb3B1cChwb3NpdGlvbkRhdGEsIHBbMl0sIG1hcmtlcik7XG4gICAgICAgICAgICBwb3NpdGlvbnMucHVzaChtYXJrZXIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2RvdHMnOlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgc2l6ZSA9IChwb3NpdGlvbkRhdGEucG9zaXRpb25zIHx8IFtdKS5sZW5ndGg7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgcCA9IHBvc2l0aW9uRGF0YS5wb3NpdGlvbnNbaV07XG4gICAgICAgICAgaWYgKCh0aGlzLl9oaWRkZW5EYXRhIHx8IFtdKS5maWx0ZXIoaCA9PiBoID09PSBwb3NpdGlvbkRhdGEua2V5KS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGNvbnN0IG1hcmtlciA9IExlYWZsZXQuY2lyY2xlTWFya2VyKFxuICAgICAgICAgICAgICB7bGF0OiBwWzBdLCBsbmc6IHBbMV19LCB7XG4gICAgICAgICAgICAgICAgcmFkaXVzOiBwb3NpdGlvbkRhdGEuYmFzZVJhZGl1cyxcbiAgICAgICAgICAgICAgICBjb2xvcjogcG9zaXRpb25EYXRhLmJvcmRlckNvbG9yLFxuICAgICAgICAgICAgICAgIGZpbGxDb2xvcjogcG9zaXRpb25EYXRhLmNvbG9yLFxuICAgICAgICAgICAgICAgIGZpbGxPcGFjaXR5OiAxLFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuYWRkUG9wdXAocG9zaXRpb25EYXRhLCBwWzJdLCBtYXJrZXIpO1xuICAgICAgICAgICAgcG9zaXRpb25zLnB1c2gobWFya2VyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiBwb3NpdGlvbnM7XG4gIH1cblxuICBwdWJsaWMgcmVzaXplKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZTxib29sZWFuPihyZXNvbHZlID0+IHtcbiAgICAgIHRoaXMucmVzaXplTWUoKTtcbiAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgfSk7XG4gIH1cblxuICBvblJhbmdlU2xpZGVyQ2hhbmdlKGV2ZW50KSB7XG4gICAgdGhpcy5MT0cuZGVidWcoWydvblJhbmdlU2xpZGVyQ2hhbmdlJ10sIGV2ZW50KTtcbiAgICB0aGlzLnRpbWVTdGFydCA9IGV2ZW50LnZhbHVlIHx8IG1vbWVudCgpLnZhbHVlT2YoKTtcbiAgICB0aGlzLnRpbWVFbmQgPSBldmVudC5oaWdoVmFsdWUgfHwgbW9tZW50KCkudmFsdWVPZigpO1xuICAgIHRoaXMuZHJhd01hcCh0cnVlKTtcbiAgfVxuXG4gIG9uUmFuZ2VTbGlkZXJXaW5kb3dDaGFuZ2UoZXZlbnQpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ29uUmFuZ2VTbGlkZXJXaW5kb3dDaGFuZ2UnXSwgZXZlbnQpO1xuICAgIGlmICh0aGlzLmxvd2VyVGltZUJvdW5kICE9PSBldmVudC5taW4gfHwgdGhpcy51cHBlclRpbWVCb3VuZCAhPT0gZXZlbnQubWF4KSB7XG4gICAgICB0aGlzLmxvd2VyVGltZUJvdW5kID0gZXZlbnQubWluO1xuICAgICAgdGhpcy51cHBlclRpbWVCb3VuZCA9IGV2ZW50Lm1heDtcbiAgICB9XG4gIH1cblxuICBvblNsaWRlckNoYW5nZShldmVudCkge1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnb25TbGlkZXJDaGFuZ2UnXSwgZXZlbnQsIG1vbWVudChldmVudC52YWx1ZSkudG9JU09TdHJpbmcoKSk7XG4gICAgdGhpcy5fZmlyc3REcmF3ID0gZmFsc2U7XG4gICAgaWYgKHRoaXMudGltZUVuZCAhPT0gZXZlbnQudmFsdWUpIHtcbiAgICAgIHRoaXMudGltZVNwYW4gPSB0aGlzLnRpbWVTcGFuIHx8IHRoaXMuX29wdGlvbnMubWFwLnRpbWVTcGFuO1xuICAgICAgdGhpcy50aW1lRW5kID0gZXZlbnQudmFsdWUgfHwgbW9tZW50KCkudmFsdWVPZigpO1xuICAgICAgdGhpcy50aW1lU3RhcnQgPSAoZXZlbnQudmFsdWUgfHwgbW9tZW50KCkudmFsdWVPZigpKSAtIHRoaXMudGltZVNwYW4gLyB0aGlzLmRpdmlkZXI7XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ29uU2xpZGVyQ2hhbmdlJ10sIG1vbWVudCh0aGlzLnRpbWVTdGFydCkudG9JU09TdHJpbmcoKSwgbW9tZW50KHRoaXMudGltZUVuZCkudG9JU09TdHJpbmcoKSk7XG4gICAgICB0aGlzLmNoYW5nZS5lbWl0KHRoaXMudGltZVN0YXJ0KTtcbiAgICAgIHRoaXMuZHJhd01hcCh0cnVlKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVUaW1lU3BhbihldmVudCkge1xuICAgIHRoaXMuTE9HLmRlYnVnKFsndXBkYXRlVGltZVNwYW4nXSwgZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICBpZiAodGhpcy50aW1lU3BhbiAhPT0gZXZlbnQudGFyZ2V0LnZhbHVlKSB7XG4gICAgICB0aGlzLnRpbWVTcGFuID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgICAgdGhpcy50aW1lU3RhcnQgPSAodGhpcy50aW1lRW5kIHx8IG1vbWVudCgpLnZhbHVlT2YoKSkgLSB0aGlzLnRpbWVTcGFuIC8gdGhpcy5kaXZpZGVyO1xuICAgICAgdGhpcy5kcmF3TWFwKHRydWUpO1xuICAgIH1cbiAgfVxufVxuIl19