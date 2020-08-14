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
import { GTSLib } from './gts.lib';
import { ColorLib } from './color-lib';
import { Logger } from './logger';
var MapLib = /** @class */ (function () {
    function MapLib() {
    }
    /**
     * @param {?} data
     * @param {?} hiddenData
     * @param {?=} divider
     * @param {?=} scheme
     * @return {?}
     */
    MapLib.toLeafletMapPaths = /**
     * @param {?} data
     * @param {?} hiddenData
     * @param {?=} divider
     * @param {?=} scheme
     * @return {?}
     */
    function (data, hiddenData, divider, scheme) {
        if (divider === void 0) { divider = 1000; }
        /** @type {?} */
        var paths = [];
        /** @type {?} */
        var size = (data.gts || []).length;
        var _loop_1 = function (i) {
            /** @type {?} */
            var gts = data.gts[i];
            if (GTSLib.isGtsToPlotOnMap(gts) && (hiddenData || []).filter((/**
             * @param {?} id
             * @return {?}
             */
            function (id) { return id === gts.id; })).length === 0) {
                /** @type {?} */
                var path = {};
                path.path = MapLib.gtsToPath(gts, divider);
                if (data.params && data.params[i] && data.params[i].key) {
                    path.key = data.params[i].key;
                }
                else {
                    path.key = GTSLib.serializeGtsMetadata(gts);
                }
                if (data.params && data.params[i] && data.params[i].color) {
                    path.color = data.params[i].color;
                }
                else {
                    path.color = ColorLib.getColor(i, scheme);
                }
                paths.push(path);
            }
        };
        for (var i = 0; i < size; i++) {
            _loop_1(i);
        }
        return paths;
    };
    /**
     * @param {?} gts
     * @param {?=} divider
     * @return {?}
     */
    MapLib.gtsToPath = /**
     * @param {?} gts
     * @param {?=} divider
     * @return {?}
     */
    function (gts, divider) {
        if (divider === void 0) { divider = 1000; }
        /** @type {?} */
        var path = [];
        /** @type {?} */
        var size = (gts.v || []).length;
        for (var i = 0; i < size; i++) {
            /** @type {?} */
            var v = gts.v[i];
            /** @type {?} */
            var l = v.length;
            if (l >= 4) {
                // timestamp, lat, lon, elev?, value
                path.push({ ts: Math.floor(v[0] / divider), lat: v[1], lon: v[2], val: v[l - 1] });
            }
        }
        return path;
    };
    /**
     * @param {?} data
     * @param {?} hiddenData
     * @param {?=} divider
     * @param {?=} scheme
     * @return {?}
     */
    MapLib.annotationsToLeafletPositions = /**
     * @param {?} data
     * @param {?} hiddenData
     * @param {?=} divider
     * @param {?=} scheme
     * @return {?}
     */
    function (data, hiddenData, divider, scheme) {
        if (divider === void 0) { divider = 1000; }
        /** @type {?} */
        var annotations = [];
        /** @type {?} */
        var size = (data.gts || []).length;
        var _loop_2 = function (i) {
            /** @type {?} */
            var gts = data.gts[i];
            if (GTSLib.isGtsToAnnotate(gts) && (hiddenData || []).filter((/**
             * @param {?} id
             * @return {?}
             */
            function (id) { return id === gts.id; })).length === 0) {
                this_1.LOG.debug(['annotationsToLeafletPositions'], gts);
                /** @type {?} */
                var annotation = {};
                /** @type {?} */
                var params = (data.params || [])[i];
                if (!params) {
                    params = {};
                }
                annotation.path = MapLib.gtsToPath(gts, divider);
                MapLib.extractCommonParameters(annotation, params, i, scheme);
                if (params.render) {
                    annotation.render = params.render;
                }
                if (annotation.render === 'marker') {
                    annotation.marker = (data.params && data.params[i]) ? data.params[i].marker : 'circle';
                }
                if (annotation.render === 'weightedDots') {
                    MapLib.validateWeightedDotsPositionArray(annotation, params);
                }
                this_1.LOG.debug(['annotationsToLeafletPositions', 'annotations'], annotation);
                annotations.push(annotation);
            }
        };
        var this_1 = this;
        for (var i = 0; i < size; i++) {
            _loop_2(i);
        }
        return annotations;
    };
    /**
     * @private
     * @param {?} obj
     * @param {?} params
     * @param {?} index
     * @param {?} scheme
     * @return {?}
     */
    MapLib.extractCommonParameters = /**
     * @private
     * @param {?} obj
     * @param {?} params
     * @param {?} index
     * @param {?} scheme
     * @return {?}
     */
    function (obj, params, index, scheme) {
        params = params || {};
        obj.key = params.key || '';
        obj.color = params.color || ColorLib.getColor(index, scheme);
        obj.borderColor = params.borderColor || '#000';
        obj.properties = params.properties || {};
        if (params.baseRadius === undefined
            || isNaN(parseInt(params.baseRadius, 10))
            || parseInt(params.baseRadius, 10) < 0) {
            obj.baseRadius = MapLib.BASE_RADIUS;
        }
        else {
            obj.baseRadius = params.baseRadius;
        }
    };
    /**
     * @private
     * @param {?} posArray
     * @param {?} params
     * @return {?}
     */
    MapLib.validateWeightedDotsPositionArray = /**
     * @private
     * @param {?} posArray
     * @param {?} params
     * @return {?}
     */
    function (posArray, params) {
        if (params.minValue === undefined || params.maxValue === undefined) {
            MapLib.LOG.error(['validateWeightedDotsPositionArray'], 'When using \'weightedDots\' or ' +
                '\'weightedColoredDots\' rendering, \'maxValue\' and \'minValue\' parameters are compulsory');
            posArray.render = undefined;
            return;
        }
        posArray.maxValue = params.maxValue;
        posArray.minValue = params.minValue;
        if (typeof posArray.minValue !== 'number' ||
            typeof posArray.maxValue !== 'number' ||
            posArray.minValue >= posArray.maxValue) {
            MapLib.LOG.error(['validateWeightedDotsPositionArray'], 'When using \'weightedDots\' or ' +
                '\'weightedColoredDots\' rendering, \'maxValue\' and \'minValue\' must be numbers and \'maxValue\' ' +
                'must be greater than \'minValue\'');
            posArray.render = undefined;
            return;
        }
        if (!GTSLib.isPositionsArrayWithValues(posArray) && !GTSLib.isPositionsArrayWithTwoValues(posArray)) {
            MapLib.LOG.error(['validateWeightedDotsPositionArray'], 'When using \'weightedDots\' or ' +
                '\'weightedColoredDots\' rendering, positions must have an associated value');
            posArray.render = undefined;
            return;
        }
        if (params.numSteps === undefined || isNaN(parseInt(params.numSteps, 10)) || parseInt(params.numSteps, 10) < 0) {
            posArray.numSteps = 5;
        }
        else {
            posArray.numSteps = params.numSteps;
        }
        /** @type {?} */
        var step = (posArray.maxValue - posArray.minValue) / posArray.numSteps;
        /** @type {?} */
        var steps = [];
        for (var i = 0; i < posArray.numSteps - 1; i++) {
            steps[i] = posArray.minValue + (i + 1) * step;
        }
        steps[posArray.numSteps - 1] = posArray.maxValue;
        /** @type {?} */
        var size = (posArray || []).length;
        for (var i = 0; i < size; i++) {
            /** @type {?} */
            var pos = posArray[i];
            /** @type {?} */
            var value = pos[2];
            pos[4] = posArray.numSteps - 1;
            for (var k in steps) {
                if (value <= steps[k]) {
                    pos[4] = k;
                    break;
                }
            }
        }
        return true;
    };
    /**
     * @param {?} data
     * @param {?} hiddenData
     * @param {?} scheme
     * @return {?}
     */
    MapLib.toLeafletMapPositionArray = /**
     * @param {?} data
     * @param {?} hiddenData
     * @param {?} scheme
     * @return {?}
     */
    function (data, hiddenData, scheme) {
        /** @type {?} */
        var positions = [];
        /** @type {?} */
        var size = (data.gts || []).length;
        var _loop_3 = function (i) {
            /** @type {?} */
            var gts = data.gts[i];
            if (GTSLib.isPositionArray(gts) && (hiddenData || []).filter((/**
             * @param {?} id
             * @return {?}
             */
            function (id) { return id === gts.id; })).length === 0) {
                this_2.LOG.debug(['toLeafletMapPositionArray'], gts, data.params[i]);
                /** @type {?} */
                var posArray = gts;
                /** @type {?} */
                var params = data.params[i] || {};
                MapLib.extractCommonParameters(posArray, params, i, scheme);
                if (params.render !== undefined) {
                    posArray.render = params.render;
                }
                if (posArray.render === 'weightedDots') {
                    MapLib.validateWeightedDotsPositionArray(posArray, params);
                }
                if (posArray.render === 'coloredWeightedDots') {
                    MapLib.validateWeightedColoredDotsPositionArray(posArray, params);
                }
                if (posArray.render === 'marker') {
                    posArray.marker = params.marker;
                }
                this_2.LOG.debug(['toLeafletMapPositionArray', 'posArray'], posArray);
                positions.push(posArray);
            }
        };
        var this_2 = this;
        for (var i = 0; i < size; i++) {
            _loop_3(i);
        }
        return positions;
    };
    /**
     * @private
     * @param {?} posArray
     * @param {?} params
     * @return {?}
     */
    MapLib.validateWeightedColoredDotsPositionArray = /**
     * @private
     * @param {?} posArray
     * @param {?} params
     * @return {?}
     */
    function (posArray, params) {
        if (!MapLib.validateWeightedDotsPositionArray(posArray, params)) {
            return;
        }
        if (params.minColorValue === undefined ||
            params.maxColorValue === undefined ||
            params.startColor === undefined ||
            params.endColor === undefined) {
            MapLib.LOG.error(['validateWeightedColoredDotsPositionArray'], 'When using ' +
                '\'weightedColoredDots\' rendering, \'maxColorValue\', \'minColorValue\', \'startColor\' ' +
                'and \'endColor\' parameters are compulsory');
            posArray.render = undefined;
            return;
        }
        posArray.maxColorValue = params.maxColorValue;
        posArray.minColorValue = params.minColorValue;
        if (typeof posArray.minColorValue !== 'number' ||
            typeof posArray.maxColorValue !== 'number' ||
            posArray.minColorValue >= posArray.maxColorValue) {
            MapLib.LOG.error(['validateWeightedColoredDotsPositionArray'], ['When using ' +
                    'weightedColoredDots\' rendering, \'maxColorValue\' and \'minColorValue\' must be numbers ' +
                    'and \'maxColorValue\' must be greater than \'minColorValue\'', {
                    maxColorValue: posArray.maxColorValue,
                    minColorValue: posArray.minColorValue,
                }]);
            posArray.render = undefined;
            return;
        }
        /** @type {?} */
        var re = /^#(?:[0-9a-f]{3}){1,2}$/i;
        if (typeof params.startColor !== 'string'
            || typeof params.endColor !== 'string'
            || !re.test(params.startColor)
            || !re.test(params.endColor)) {
            MapLib.LOG.error(['validateWeightedColoredDotsPositionArray'], ['When using ' +
                    'weightedColoredDots\' rendering, \'startColor\' and \'endColor\' parameters must be RGB ' +
                    'colors in #rrggbb format', {
                    startColor: params.startColor,
                    endColor: params.endColor,
                    tests: [
                        typeof params.startColor,
                        typeof params.endColor,
                        re.test(params.startColor),
                        re.test(params.endColor),
                        re.test(params.startColor),
                    ],
                }]);
            posArray.render = undefined;
            return;
        }
        posArray.startColor = {
            r: parseInt(params.startColor.substring(1, 3), 16),
            g: parseInt(params.startColor.substring(3, 5), 16),
            b: parseInt(params.startColor.substring(5, 7), 16),
        };
        posArray.endColor = {
            r: parseInt(params.endColor.substring(1, 3), 16),
            g: parseInt(params.endColor.substring(3, 5), 16),
            b: parseInt(params.endColor.substring(5, 7), 16),
        };
        if (params.numColorSteps === undefined ||
            isNaN(parseInt(params.numColorSteps, 10)) ||
            parseInt(params.numColorSteps, 10) < 0) {
            posArray.numColorSteps = 5;
        }
        else {
            posArray.numColorSteps = params.numColorSteps;
        }
        posArray.colorGradient = ColorLib.hsvGradientFromRgbColors(posArray.startColor, posArray.endColor, posArray.numColorSteps);
        /** @type {?} */
        var step = (posArray.maxColorValue - posArray.minColorValue) / posArray.numColorSteps;
        /** @type {?} */
        var steps = [];
        for (var j = 0; j < posArray.numColorSteps; j++) {
            steps[j] = posArray.minColorValue + (j + 1) * step;
        }
        posArray.steps = steps;
        posArray.positions.forEach((/**
         * @param {?} pos
         * @return {?}
         */
        function (pos) {
            /** @type {?} */
            var colorValue = pos[3];
            pos[5] = posArray.numColorSteps - 1;
            for (var k = 0; k < steps.length - 1; k++) {
                if (colorValue < steps[k]) {
                    pos[5] = k;
                    break;
                }
            }
        }));
    };
    /**
     * @param {?} paths
     * @param {?} positionsData
     * @param {?} annotationsData
     * @param {?} geoJson
     * @return {?}
     */
    MapLib.getBoundsArray = /**
     * @param {?} paths
     * @param {?} positionsData
     * @param {?} annotationsData
     * @param {?} geoJson
     * @return {?}
     */
    function (paths, positionsData, annotationsData, geoJson) {
        /** @type {?} */
        var pointsArray = [];
        /** @type {?} */
        var size;
        this.LOG.debug(['getBoundsArray', 'paths'], paths);
        size = (paths || []).length;
        for (var i = 0; i < size; i++) {
            /** @type {?} */
            var path = paths[i];
            /** @type {?} */
            var s = (path.path || []).length;
            for (var j = 0; j < s; j++) {
                /** @type {?} */
                var p = path.path[j];
                pointsArray.push([p.lat, p.lon]);
            }
        }
        this.LOG.debug(['getBoundsArray', 'positionsData'], positionsData);
        size = (positionsData || []).length;
        for (var i = 0; i < size; i++) {
            /** @type {?} */
            var position = positionsData[i];
            /** @type {?} */
            var s = (position.positions || []).length;
            for (var j = 0; j < s; j++) {
                /** @type {?} */
                var p = position.positions[j];
                pointsArray.push([p[0], p[1]]);
            }
        }
        this.LOG.debug(['getBoundsArray', 'annotationsData'], annotationsData);
        size = (annotationsData || []).length;
        for (var i = 0; i < size; i++) {
            /** @type {?} */
            var annotation = annotationsData[i];
            /** @type {?} */
            var s = (annotation.path || []).length;
            for (var j = 0; j < s; j++) {
                /** @type {?} */
                var p = annotation.path[j];
                pointsArray.push([p.lat, p.lon]);
            }
        }
        size = (geoJson || []).length;
        for (var i = 0; i < size; i++) {
            /** @type {?} */
            var g = geoJson[i];
            switch (g.geometry.type) {
                case 'MultiPolygon':
                    g.geometry.coordinates.forEach((/**
                     * @param {?} c
                     * @return {?}
                     */
                    function (c) { return c.forEach((/**
                     * @param {?} m
                     * @return {?}
                     */
                    function (m) { return m.forEach((/**
                     * @param {?} p
                     * @return {?}
                     */
                    function (p) { return pointsArray.push([p[1], p[0]]); })); })); }));
                    break;
                case 'Polygon':
                    g.geometry.coordinates.forEach((/**
                     * @param {?} c
                     * @return {?}
                     */
                    function (c) { return c.forEach((/**
                     * @param {?} p
                     * @return {?}
                     */
                    function (p) { return pointsArray.push([p[1], p[0]]); })); }));
                    break;
                case 'LineString':
                    g.geometry.coordinates.forEach((/**
                     * @param {?} p
                     * @return {?}
                     */
                    function (p) { return pointsArray.push([p[1], p[0]]); }));
                    break;
                case 'Point':
                    pointsArray.push([g.geometry.coordinates[1], g.geometry.coordinates[0]]);
                    break;
            }
        }
        if (pointsArray.length === 1) {
            return pointsArray;
        }
        /** @type {?} */
        var south = 90;
        /** @type {?} */
        var west = -180;
        /** @type {?} */
        var north = -90;
        /** @type {?} */
        var east = 180;
        this.LOG.debug(['getBoundsArray'], pointsArray);
        size = (pointsArray || []).length;
        for (var i = 0; i < size; i++) {
            /** @type {?} */
            var point = pointsArray[i];
            if (point[0] > north) {
                north = point[0];
            }
            if (point[0] < south) {
                south = point[0];
            }
            if (point[1] > west) {
                west = point[1];
            }
            if (point[1] < east) {
                east = point[1];
            }
        }
        return [[south, west], [north, east]];
    };
    /**
     * @param {?} pathData
     * @param {?} options
     * @return {?}
     */
    MapLib.pathDataToLeaflet = /**
     * @param {?} pathData
     * @param {?} options
     * @return {?}
     */
    function (pathData, options) {
        /** @type {?} */
        var path = [];
        /** @type {?} */
        var firstIndex = ((options === undefined) ||
            (options.from === undefined) ||
            (options.from < 0)) ? 0 : options.from;
        /** @type {?} */
        var lastIndex = ((options === undefined) || (options.to === undefined) || (options.to >= pathData.length)) ?
            pathData.length - 1 : options.to;
        for (var i = firstIndex; i <= lastIndex; i++) {
            path.push([pathData[i].lat, pathData[i].lon]);
        }
        return path;
    };
    /**
     * @param {?} data
     * @return {?}
     */
    MapLib.toGeoJSON = /**
     * @param {?} data
     * @return {?}
     */
    function (data) {
        /** @type {?} */
        var defShapes = ['Point', 'LineString', 'Polygon', 'MultiPolygon'];
        /** @type {?} */
        var geoJsons = [];
        data.gts.forEach((/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            if (d.type && d.type === 'Feature' && d.geometry && d.geometry.type && defShapes.indexOf(d.geometry.type) > -1) {
                geoJsons.push(d);
            }
            else if (d.type && defShapes.indexOf(d.type) > -1) {
                geoJsons.push({ type: 'Feature', geometry: d });
            }
        }));
        return geoJsons;
    };
    MapLib.BASE_RADIUS = 2;
    MapLib.LOG = new Logger(MapLib, true);
    MapLib.mapTypes = {
        NONE: undefined,
        DEFAULT: {
            link: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        },
        HOT: {
            link: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
            attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors, Tiles\n style by <a href=\"https://www.hotosm.org/\" target=\"_blank\">Humanitarian OpenStreetMap Team</a> hosted by\n <a href=\"https://openstreetmap.fr/\" target=\"_blank\">OpenStreetMap France</a>"
        },
        TOPO: {
            link: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
            attribution: "Map data: &copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors,\n <a href=\"http://viewfinderpanoramas.org\">SRTM</a> | Map style: &copy; <a href=\"https://opentopomap.org\">OpenTopoMap</a>\n  (<a href=\"https://creativecommons.org/licenses/by-sa/3.0/\">CC-BY-SA</a>)"
        },
        TOPO2: {
            link: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
            attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN,\n       GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community"
        },
        SURFER: {
            link: 'https://maps.heigit.org/openmapsurfer/tiles/roads/webmercator/{z}/{x}/{y}.png',
            attribution: "Imagery from <a href=\"http://giscience.uni-hd.de/\">GIScience Research Group @ University of\n Heidelberg</a> | Map data &copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors"
        },
        HYDRA: {
            link: 'https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png',
            attribution: "Tiles courtesy of <a href=\"http://openstreetmap.se/\" target=\"_blank\">OpenStreetMap Sweden</a>\n &mdash; Map data &copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors"
        },
        HYDRA2: {
            link: 'https://{s}.tile.openstreetmap.se/hydda/base/{z}/{x}/{y}.png',
            attribution: "Tiles courtesy of <a href=\"http://openstreetmap.se/\" target=\"_blank\">OpenStreetMap Sweden</a>\n &mdash; Map data &copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors"
        },
        TONER: {
            link: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png',
            attribution: "Map tiles by <a href=\"http://stamen.com\">Stamen Design</a>,\n <a href=\"http://creativecommons.org/licenses/by/3.0\">CC BY 3.0</a> &mdash; Map data &copy;\n  <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
            subdomains: 'abcd'
        },
        TONER_LITE: {
            link: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.png',
            attribution: "Map tiles by <a href=\"http://stamen.com\">Stamen Design</a>,\n <a href=\"http://creativecommons.org/licenses/by/3.0\">CC BY 3.0</a> &mdash; Map data &copy;\n  <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
            subdomains: 'abcd',
        },
        TERRAIN: {
            link: 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png',
            attribution: "Map tiles by <a href=\"http://stamen.com\">Stamen Design</a>,\n <a href=\"http://creativecommons.org/licenses/by/3.0\">CC BY 3.0</a> &mdash; Map data &copy;\n <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
            subdomains: 'abcd',
        },
        ESRI: {
            link: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
            attribution: "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan,\n METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
        },
        SATELLITE: {
            link: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN,\n IGP, UPR-EGP, and the GIS User Community"
        },
        OCEANS: {
            link: 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}',
            attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri',
        },
        GRAY: {
            link: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
            attibs: ''
        },
        GRAYSCALE: {
            link: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
            attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
        },
        WATERCOLOR: {
            link: 'https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg',
            attribution: "Map tiles by <a href=\"http://stamen.com\">Stamen Design</a>,\n <a href=\"http://creativecommons.org/licenses/by/3.0\">CC BY 3.0</a> &mdash; Map data &copy;\n  <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
            subdomains: 'abcd',
        },
        CARTODB: {
            link: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
            attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors &copy;\n <a href=\"https://carto.com/attributions\">CartoDB</a>",
            subdomains: 'abcd',
        },
        CARTODB_DARK: {
            link: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
            attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors &copy;\n <a href=\"https://carto.com/attributions\">CartoDB</a>",
            subdomains: 'abcd',
        },
    };
    return MapLib;
}());
export { MapLib };
if (false) {
    /** @type {?} */
    MapLib.BASE_RADIUS;
    /**
     * @type {?}
     * @private
     */
    MapLib.LOG;
    /** @type {?} */
    MapLib.mapTypes;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWxpYi5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzZW54L3dhcnB2aWV3LyIsInNvdXJjZXMiOlsic3JjL2xpYi91dGlscy9tYXAtbGliLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDakMsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUNyQyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBRWhDO0lBQUE7SUFzZEEsQ0FBQzs7Ozs7Ozs7SUE1V1Esd0JBQWlCOzs7Ozs7O0lBQXhCLFVBQXlCLElBQW1DLEVBQUUsVUFBb0IsRUFBRSxPQUFzQixFQUFFLE1BQWM7UUFBdEMsd0JBQUEsRUFBQSxjQUFzQjs7WUFDbEcsS0FBSyxHQUFHLEVBQUU7O1lBQ1YsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxNQUFNO2dDQUMzQixDQUFDOztnQkFDRixHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDdkIsSUFBSSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksRUFBRSxDQUFDLENBQUMsTUFBTTs7OztZQUFDLFVBQUEsRUFBRSxJQUFJLE9BQUEsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEVBQWIsQ0FBYSxFQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTs7b0JBQ3pGLElBQUksR0FBUSxFQUFFO2dCQUNwQixJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUMzQyxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMs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dGRZLE1BQU07OztJQUNqQixtQkFBdUI7Ozs7O0lBQ3ZCLFdBQXNEOztJQUV0RCxnQkFvR0UiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogIENvcHlyaWdodCAyMDIwICBTZW5YIFMuQS5TLlxuICpcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICovXG5cbmltcG9ydCB7R1RTTGlifSBmcm9tICcuL2d0cy5saWInO1xuaW1wb3J0IHtDb2xvckxpYn0gZnJvbSAnLi9jb2xvci1saWInO1xuaW1wb3J0IHtMb2dnZXJ9IGZyb20gJy4vbG9nZ2VyJztcblxuZXhwb3J0IGNsYXNzIE1hcExpYiB7XG4gIHN0YXRpYyBCQVNFX1JBRElVUyA9IDI7XG4gIHByaXZhdGUgc3RhdGljIExPRzogTG9nZ2VyID0gbmV3IExvZ2dlcihNYXBMaWIsIHRydWUpO1xuXG4gIHN0YXRpYyBtYXBUeXBlczogYW55ID0ge1xuICAgIE5PTkU6IHVuZGVmaW5lZCxcbiAgICBERUZBVUxUOiB7XG4gICAgICBsaW5rOiAnaHR0cHM6Ly97c30udGlsZS5vcGVuc3RyZWV0bWFwLm9yZy97en0ve3h9L3t5fS5wbmcnLFxuICAgICAgYXR0cmlidXRpb246ICcmY29weTsgPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm9wZW5zdHJlZXRtYXAub3JnL2NvcHlyaWdodFwiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9ycydcbiAgICB9LFxuICAgIEhPVDoge1xuICAgICAgbGluazogJ2h0dHBzOi8ve3N9LnRpbGUub3BlbnN0cmVldG1hcC5mci9ob3Qve3p9L3t4fS97eX0ucG5nJyxcbiAgICAgIGF0dHJpYnV0aW9uOiBgJmNvcHk7IDxhIGhyZWY9XCJodHRwczovL3d3dy5vcGVuc3RyZWV0bWFwLm9yZy9jb3B5cmlnaHRcIj5PcGVuU3RyZWV0TWFwPC9hPiBjb250cmlidXRvcnMsIFRpbGVzXG4gc3R5bGUgYnkgPGEgaHJlZj1cImh0dHBzOi8vd3d3LmhvdG9zbS5vcmcvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+SHVtYW5pdGFyaWFuIE9wZW5TdHJlZXRNYXAgVGVhbTwvYT4gaG9zdGVkIGJ5XG4gPGEgaHJlZj1cImh0dHBzOi8vb3BlbnN0cmVldG1hcC5mci9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5PcGVuU3RyZWV0TWFwIEZyYW5jZTwvYT5gXG4gICAgfSxcbiAgICBUT1BPOiB7XG4gICAgICBsaW5rOiAnaHR0cHM6Ly97c30udGlsZS5vcGVudG9wb21hcC5vcmcve3p9L3t4fS97eX0ucG5nJyxcbiAgICAgIGF0dHJpYnV0aW9uOiBgTWFwIGRhdGE6ICZjb3B5OyA8YSBocmVmPVwiaHR0cHM6Ly93d3cub3BlbnN0cmVldG1hcC5vcmcvY29weXJpZ2h0XCI+T3BlblN0cmVldE1hcDwvYT4gY29udHJpYnV0b3JzLFxuIDxhIGhyZWY9XCJodHRwOi8vdmlld2ZpbmRlcnBhbm9yYW1hcy5vcmdcIj5TUlRNPC9hPiB8IE1hcCBzdHlsZTogJmNvcHk7IDxhIGhyZWY9XCJodHRwczovL29wZW50b3BvbWFwLm9yZ1wiPk9wZW5Ub3BvTWFwPC9hPlxuICAoPGEgaHJlZj1cImh0dHBzOi8vY3JlYXRpdmVjb21tb25zLm9yZy9saWNlbnNlcy9ieS1zYS8zLjAvXCI+Q0MtQlktU0E8L2E+KWBcbiAgICB9LFxuICAgIFRPUE8yOiB7XG4gICAgICBsaW5rOiAnaHR0cHM6Ly9zZXJ2ZXIuYXJjZ2lzb25saW5lLmNvbS9BcmNHSVMvcmVzdC9zZXJ2aWNlcy9Xb3JsZF9Ub3BvX01hcC9NYXBTZXJ2ZXIvdGlsZS97en0ve3l9L3t4fScsXG4gICAgICBhdHRyaWJ1dGlvbjogYFRpbGVzICZjb3B5OyBFc3JpICZtZGFzaDsgRXNyaSwgRGVMb3JtZSwgTkFWVEVRLCBUb21Ub20sIEludGVybWFwLCBpUEMsIFVTR1MsIEZBTywgTlBTLCBOUkNBTixcbiAgICAgICBHZW9CYXNlLCBLYWRhc3RlciBOTCwgT3JkbmFuY2UgU3VydmV5LCBFc3JpIEphcGFuLCBNRVRJLCBFc3JpIENoaW5hIChIb25nIEtvbmcpLCBhbmQgdGhlIEdJUyBVc2VyIENvbW11bml0eWBcbiAgICB9LFxuICAgIFNVUkZFUjoge1xuICAgICAgbGluazogJ2h0dHBzOi8vbWFwcy5oZWlnaXQub3JnL29wZW5tYXBzdXJmZXIvdGlsZXMvcm9hZHMvd2VibWVyY2F0b3Ive3p9L3t4fS97eX0ucG5nJyxcbiAgICAgIGF0dHJpYnV0aW9uOiBgSW1hZ2VyeSBmcm9tIDxhIGhyZWY9XCJodHRwOi8vZ2lzY2llbmNlLnVuaS1oZC5kZS9cIj5HSVNjaWVuY2UgUmVzZWFyY2ggR3JvdXAgQCBVbml2ZXJzaXR5IG9mXG4gSGVpZGVsYmVyZzwvYT4gfCBNYXAgZGF0YSAmY29weTsgPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm9wZW5zdHJlZXRtYXAub3JnL2NvcHlyaWdodFwiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9yc2BcbiAgICB9LFxuICAgIEhZRFJBOiB7XG4gICAgICBsaW5rOiAnaHR0cHM6Ly97c30udGlsZS5vcGVuc3RyZWV0bWFwLnNlL2h5ZGRhL2Z1bGwve3p9L3t4fS97eX0ucG5nJyxcbiAgICAgIGF0dHJpYnV0aW9uOiBgVGlsZXMgY291cnRlc3kgb2YgPGEgaHJlZj1cImh0dHA6Ly9vcGVuc3RyZWV0bWFwLnNlL1wiIHRhcmdldD1cIl9ibGFua1wiPk9wZW5TdHJlZXRNYXAgU3dlZGVuPC9hPlxuICZtZGFzaDsgTWFwIGRhdGEgJmNvcHk7IDxhIGhyZWY9XCJodHRwczovL3d3dy5vcGVuc3RyZWV0bWFwLm9yZy9jb3B5cmlnaHRcIj5PcGVuU3RyZWV0TWFwPC9hPiBjb250cmlidXRvcnNgXG4gICAgfSxcbiAgICBIWURSQTI6IHtcbiAgICAgIGxpbms6ICdodHRwczovL3tzfS50aWxlLm9wZW5zdHJlZXRtYXAuc2UvaHlkZGEvYmFzZS97en0ve3h9L3t5fS5wbmcnLFxuICAgICAgYXR0cmlidXRpb246IGBUaWxlcyBjb3VydGVzeSBvZiA8YSBocmVmPVwiaHR0cDovL29wZW5zdHJlZXRtYXAuc2UvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+T3BlblN0cmVldE1hcCBTd2VkZW48L2E+XG4gJm1kYXNoOyBNYXAgZGF0YSAmY29weTsgPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm9wZW5zdHJlZXRtYXAub3JnL2NvcHlyaWdodFwiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9yc2BcbiAgICB9LFxuICAgIFRPTkVSOiB7XG4gICAgICBsaW5rOiAnaHR0cHM6Ly9zdGFtZW4tdGlsZXMte3N9LmEuc3NsLmZhc3RseS5uZXQvdG9uZXIve3p9L3t4fS97eX17cn0ucG5nJyxcbiAgICAgIGF0dHJpYnV0aW9uOiBgTWFwIHRpbGVzIGJ5IDxhIGhyZWY9XCJodHRwOi8vc3RhbWVuLmNvbVwiPlN0YW1lbiBEZXNpZ248L2E+LFxuIDxhIGhyZWY9XCJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9saWNlbnNlcy9ieS8zLjBcIj5DQyBCWSAzLjA8L2E+ICZtZGFzaDsgTWFwIGRhdGEgJmNvcHk7XG4gIDxhIGhyZWY9XCJodHRwczovL3d3dy5vcGVuc3RyZWV0bWFwLm9yZy9jb3B5cmlnaHRcIj5PcGVuU3RyZWV0TWFwPC9hPiBjb250cmlidXRvcnNgLFxuICAgICAgc3ViZG9tYWluczogJ2FiY2QnXG4gICAgfSxcbiAgICBUT05FUl9MSVRFOiB7XG4gICAgICBsaW5rOiAnaHR0cHM6Ly9zdGFtZW4tdGlsZXMte3N9LmEuc3NsLmZhc3RseS5uZXQvdG9uZXItbGl0ZS97en0ve3h9L3t5fXtyfS5wbmcnLFxuICAgICAgYXR0cmlidXRpb246IGBNYXAgdGlsZXMgYnkgPGEgaHJlZj1cImh0dHA6Ly9zdGFtZW4uY29tXCI+U3RhbWVuIERlc2lnbjwvYT4sXG4gPGEgaHJlZj1cImh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL2J5LzMuMFwiPkNDIEJZIDMuMDwvYT4gJm1kYXNoOyBNYXAgZGF0YSAmY29weTtcbiAgPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm9wZW5zdHJlZXRtYXAub3JnL2NvcHlyaWdodFwiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9yc2AsXG4gICAgICBzdWJkb21haW5zOiAnYWJjZCcsXG4gICAgfSxcbiAgICBURVJSQUlOOiB7XG4gICAgICBsaW5rOiAnaHR0cHM6Ly9zdGFtZW4tdGlsZXMte3N9LmEuc3NsLmZhc3RseS5uZXQvdGVycmFpbi97en0ve3h9L3t5fXtyfS5wbmcnLFxuICAgICAgYXR0cmlidXRpb246IGBNYXAgdGlsZXMgYnkgPGEgaHJlZj1cImh0dHA6Ly9zdGFtZW4uY29tXCI+U3RhbWVuIERlc2lnbjwvYT4sXG4gPGEgaHJlZj1cImh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL2J5LzMuMFwiPkNDIEJZIDMuMDwvYT4gJm1kYXNoOyBNYXAgZGF0YSAmY29weTtcbiA8YSBocmVmPVwiaHR0cHM6Ly93d3cub3BlbnN0cmVldG1hcC5vcmcvY29weXJpZ2h0XCI+T3BlblN0cmVldE1hcDwvYT4gY29udHJpYnV0b3JzYCxcbiAgICAgIHN1YmRvbWFpbnM6ICdhYmNkJyxcbiAgICB9LFxuICAgIEVTUkk6IHtcbiAgICAgIGxpbms6ICdodHRwczovL3NlcnZlci5hcmNnaXNvbmxpbmUuY29tL0FyY0dJUy9yZXN0L3NlcnZpY2VzL1dvcmxkX1N0cmVldF9NYXAvTWFwU2VydmVyL3RpbGUve3p9L3t5fS97eH0nLFxuICAgICAgYXR0cmlidXRpb246IGBUaWxlcyAmY29weTsgRXNyaSAmbWRhc2g7IFNvdXJjZTogRXNyaSwgRGVMb3JtZSwgTkFWVEVRLCBVU0dTLCBJbnRlcm1hcCwgaVBDLCBOUkNBTiwgRXNyaSBKYXBhbixcbiBNRVRJLCBFc3JpIENoaW5hIChIb25nIEtvbmcpLCBFc3JpIChUaGFpbGFuZCksIFRvbVRvbSwgMjAxMmBcbiAgICB9LFxuICAgIFNBVEVMTElURToge1xuICAgICAgbGluazogJ2h0dHBzOi8vc2VydmVyLmFyY2dpc29ubGluZS5jb20vQXJjR0lTL3Jlc3Qvc2VydmljZXMvV29ybGRfSW1hZ2VyeS9NYXBTZXJ2ZXIvdGlsZS97en0ve3l9L3t4fScsXG4gICAgICBhdHRyaWJ1dGlvbjogYFRpbGVzICZjb3B5OyBFc3JpICZtZGFzaDsgU291cmNlOiBFc3JpLCBpLWN1YmVkLCBVU0RBLCBVU0dTLCBBRVgsIEdlb0V5ZSwgR2V0bWFwcGluZywgQWVyb2dyaWQsIElHTixcbiBJR1AsIFVQUi1FR1AsIGFuZCB0aGUgR0lTIFVzZXIgQ29tbXVuaXR5YFxuICAgIH0sXG4gICAgT0NFQU5TOiB7XG4gICAgICBsaW5rOiAnaHR0cHM6Ly9zZXJ2ZXIuYXJjZ2lzb25saW5lLmNvbS9BcmNHSVMvcmVzdC9zZXJ2aWNlcy9PY2Vhbl9CYXNlbWFwL01hcFNlcnZlci90aWxlL3t6fS97eX0ve3h9JyxcbiAgICAgIGF0dHJpYnV0aW9uOiAnVGlsZXMgJmNvcHk7IEVzcmkgJm1kYXNoOyBTb3VyY2VzOiBHRUJDTywgTk9BQSwgQ0hTLCBPU1UsIFVOSCwgQ1NVTUIsIE5hdGlvbmFsIEdlb2dyYXBoaWMsIERlTG9ybWUsIE5BVlRFUSwgYW5kIEVzcmknLFxuICAgIH0sXG4gICAgR1JBWToge1xuICAgICAgbGluazogJ2h0dHBzOi8vc2VydmVyLmFyY2dpc29ubGluZS5jb20vQXJjR0lTL3Jlc3Qvc2VydmljZXMvQ2FudmFzL1dvcmxkX0xpZ2h0X0dyYXlfQmFzZS9NYXBTZXJ2ZXIvdGlsZS97en0ve3l9L3t4fScsXG4gICAgICBhdHRpYnM6ICcnXG4gICAgfSxcbiAgICBHUkFZU0NBTEU6IHtcbiAgICAgIGxpbms6ICdodHRwczovL3NlcnZlci5hcmNnaXNvbmxpbmUuY29tL0FyY0dJUy9yZXN0L3NlcnZpY2VzL0NhbnZhcy9Xb3JsZF9MaWdodF9HcmF5X0Jhc2UvTWFwU2VydmVyL3RpbGUve3p9L3t5fS97eH0nLFxuICAgICAgYXR0cmlidXRpb246ICdUaWxlcyAmY29weTsgRXNyaSAmbWRhc2g7IEVzcmksIERlTG9ybWUsIE5BVlRFUScsXG4gICAgfSxcbiAgICBXQVRFUkNPTE9SOiB7XG4gICAgICBsaW5rOiAnaHR0cHM6Ly9zdGFtZW4tdGlsZXMte3N9LmEuc3NsLmZhc3RseS5uZXQvd2F0ZXJjb2xvci97en0ve3h9L3t5fS5qcGcnLFxuICAgICAgYXR0cmlidXRpb246IGBNYXAgdGlsZXMgYnkgPGEgaHJlZj1cImh0dHA6Ly9zdGFtZW4uY29tXCI+U3RhbWVuIERlc2lnbjwvYT4sXG4gPGEgaHJlZj1cImh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL2J5LzMuMFwiPkNDIEJZIDMuMDwvYT4gJm1kYXNoOyBNYXAgZGF0YSAmY29weTtcbiAgPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm9wZW5zdHJlZXRtYXAub3JnL2NvcHlyaWdodFwiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9yc2AsXG4gICAgICBzdWJkb21haW5zOiAnYWJjZCcsXG4gICAgfSxcbiAgICBDQVJUT0RCOiB7XG4gICAgICBsaW5rOiAnaHR0cHM6Ly97c30uYmFzZW1hcHMuY2FydG9jZG4uY29tL2xpZ2h0X2FsbC97en0ve3h9L3t5fXtyfS5wbmcnLFxuICAgICAgYXR0cmlidXRpb246IGAmY29weTsgPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm9wZW5zdHJlZXRtYXAub3JnL2NvcHlyaWdodFwiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9ycyAmY29weTtcbiA8YSBocmVmPVwiaHR0cHM6Ly9jYXJ0by5jb20vYXR0cmlidXRpb25zXCI+Q2FydG9EQjwvYT5gLFxuICAgICAgc3ViZG9tYWluczogJ2FiY2QnLFxuICAgIH0sXG4gICAgQ0FSVE9EQl9EQVJLOiB7XG4gICAgICBsaW5rOiAnaHR0cHM6Ly9jYXJ0b2RiLWJhc2VtYXBzLXtzfS5nbG9iYWwuc3NsLmZhc3RseS5uZXQvZGFya19hbGwve3p9L3t4fS97eX0ucG5nJyxcbiAgICAgIGF0dHJpYnV0aW9uOiBgJmNvcHk7IDxhIGhyZWY9XCJodHRwczovL3d3dy5vcGVuc3RyZWV0bWFwLm9yZy9jb3B5cmlnaHRcIj5PcGVuU3RyZWV0TWFwPC9hPiBjb250cmlidXRvcnMgJmNvcHk7XG4gPGEgaHJlZj1cImh0dHBzOi8vY2FydG8uY29tL2F0dHJpYnV0aW9uc1wiPkNhcnRvREI8L2E+YCxcbiAgICAgIHN1YmRvbWFpbnM6ICdhYmNkJyxcbiAgICB9LFxuICB9O1xuXG4gIHN0YXRpYyB0b0xlYWZsZXRNYXBQYXRocyhkYXRhOiB7IGd0czogYW55W107IHBhcmFtczogYW55W10gfSwgaGlkZGVuRGF0YTogbnVtYmVyW10sIGRpdmlkZXI6IG51bWJlciA9IDEwMDAsIHNjaGVtZTogc3RyaW5nKSB7XG4gICAgY29uc3QgcGF0aHMgPSBbXTtcbiAgICBjb25zdCBzaXplID0gKGRhdGEuZ3RzIHx8IFtdKS5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIGNvbnN0IGd0cyA9IGRhdGEuZ3RzW2ldO1xuICAgICAgaWYgKEdUU0xpYi5pc0d0c1RvUGxvdE9uTWFwKGd0cykgJiYgKGhpZGRlbkRhdGEgfHwgW10pLmZpbHRlcihpZCA9PiBpZCA9PT0gZ3RzLmlkKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgY29uc3QgcGF0aDogYW55ID0ge307XG4gICAgICAgIHBhdGgucGF0aCA9IE1hcExpYi5ndHNUb1BhdGgoZ3RzLCBkaXZpZGVyKTtcbiAgICAgICAgaWYgKGRhdGEucGFyYW1zICYmIGRhdGEucGFyYW1zW2ldICYmIGRhdGEucGFyYW1zW2ldLmtleSkge1xuICAgICAgICAgIHBhdGgua2V5ID0gZGF0YS5wYXJhbXNbaV0ua2V5O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBhdGgua2V5ID0gR1RTTGliLnNlcmlhbGl6ZUd0c01ldGFkYXRhKGd0cyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRhdGEucGFyYW1zICYmIGRhdGEucGFyYW1zW2ldICYmIGRhdGEucGFyYW1zW2ldLmNvbG9yKSB7XG4gICAgICAgICAgcGF0aC5jb2xvciA9IGRhdGEucGFyYW1zW2ldLmNvbG9yO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBhdGguY29sb3IgPSBDb2xvckxpYi5nZXRDb2xvcihpLCBzY2hlbWUpO1xuICAgICAgICB9XG4gICAgICAgIHBhdGhzLnB1c2gocGF0aCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwYXRocztcbiAgfVxuXG4gIHN0YXRpYyBndHNUb1BhdGgoZ3RzLCBkaXZpZGVyOiBudW1iZXIgPSAxMDAwKSB7XG4gICAgY29uc3QgcGF0aCA9IFtdO1xuICAgIGNvbnN0IHNpemUgPSAoZ3RzLnYgfHwgW10pLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgY29uc3QgdiA9IGd0cy52W2ldO1xuICAgICAgY29uc3QgbCA9IHYubGVuZ3RoO1xuICAgICAgaWYgKGwgPj0gNCkge1xuICAgICAgICAvLyB0aW1lc3RhbXAsIGxhdCwgbG9uLCBlbGV2PywgdmFsdWVcbiAgICAgICAgcGF0aC5wdXNoKHt0czogTWF0aC5mbG9vcih2WzBdIC8gZGl2aWRlciksIGxhdDogdlsxXSwgbG9uOiB2WzJdLCB2YWw6IHZbbCAtIDFdfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwYXRoO1xuICB9XG5cbiAgc3RhdGljIGFubm90YXRpb25zVG9MZWFmbGV0UG9zaXRpb25zKGRhdGE6IHsgZ3RzOiBhbnlbXTsgcGFyYW1zOiBhbnlbXSB9LCBoaWRkZW5EYXRhOiBudW1iZXJbXSwgZGl2aWRlcjogbnVtYmVyID0gMTAwMCwgc2NoZW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBhbm5vdGF0aW9ucyA9IFtdO1xuICAgIGNvbnN0IHNpemUgPSAoZGF0YS5ndHMgfHwgW10pLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgY29uc3QgZ3RzID0gZGF0YS5ndHNbaV07XG4gICAgICBpZiAoR1RTTGliLmlzR3RzVG9Bbm5vdGF0ZShndHMpICYmIChoaWRkZW5EYXRhIHx8IFtdKS5maWx0ZXIoaWQgPT4gaWQgPT09IGd0cy5pZCkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRoaXMuTE9HLmRlYnVnKFsnYW5ub3RhdGlvbnNUb0xlYWZsZXRQb3NpdGlvbnMnXSwgZ3RzKTtcbiAgICAgICAgY29uc3QgYW5ub3RhdGlvbjogYW55ID0ge307XG4gICAgICAgIGxldCBwYXJhbXMgPSAoZGF0YS5wYXJhbXMgfHwgW10pW2ldO1xuICAgICAgICBpZiAoIXBhcmFtcykge1xuICAgICAgICAgIHBhcmFtcyA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIGFubm90YXRpb24ucGF0aCA9IE1hcExpYi5ndHNUb1BhdGgoZ3RzLCBkaXZpZGVyKTtcbiAgICAgICAgTWFwTGliLmV4dHJhY3RDb21tb25QYXJhbWV0ZXJzKGFubm90YXRpb24sIHBhcmFtcywgaSwgc2NoZW1lKTtcbiAgICAgICAgaWYgKHBhcmFtcy5yZW5kZXIpIHtcbiAgICAgICAgICBhbm5vdGF0aW9uLnJlbmRlciA9IHBhcmFtcy5yZW5kZXI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFubm90YXRpb24ucmVuZGVyID09PSAnbWFya2VyJykge1xuICAgICAgICAgIGFubm90YXRpb24ubWFya2VyID0gKGRhdGEucGFyYW1zICYmIGRhdGEucGFyYW1zW2ldKSA/IGRhdGEucGFyYW1zW2ldLm1hcmtlciA6ICdjaXJjbGUnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhbm5vdGF0aW9uLnJlbmRlciA9PT0gJ3dlaWdodGVkRG90cycpIHtcbiAgICAgICAgICBNYXBMaWIudmFsaWRhdGVXZWlnaHRlZERvdHNQb3NpdGlvbkFycmF5KGFubm90YXRpb24sIHBhcmFtcyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5MT0cuZGVidWcoWydhbm5vdGF0aW9uc1RvTGVhZmxldFBvc2l0aW9ucycsICdhbm5vdGF0aW9ucyddLCBhbm5vdGF0aW9uKTtcbiAgICAgICAgYW5ub3RhdGlvbnMucHVzaChhbm5vdGF0aW9uKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFubm90YXRpb25zO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgZXh0cmFjdENvbW1vblBhcmFtZXRlcnMob2JqLCBwYXJhbXMsIGluZGV4LCBzY2hlbWU6IHN0cmluZykge1xuICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcbiAgICBvYmoua2V5ID0gcGFyYW1zLmtleSB8fCAnJztcbiAgICBvYmouY29sb3IgPSBwYXJhbXMuY29sb3IgfHwgQ29sb3JMaWIuZ2V0Q29sb3IoaW5kZXgsIHNjaGVtZSk7XG4gICAgb2JqLmJvcmRlckNvbG9yID0gcGFyYW1zLmJvcmRlckNvbG9yIHx8ICcjMDAwJztcbiAgICBvYmoucHJvcGVydGllcyA9IHBhcmFtcy5wcm9wZXJ0aWVzIHx8IHt9O1xuICAgIGlmIChwYXJhbXMuYmFzZVJhZGl1cyA9PT0gdW5kZWZpbmVkXG4gICAgICB8fCBpc05hTihwYXJzZUludChwYXJhbXMuYmFzZVJhZGl1cywgMTApKVxuICAgICAgfHwgcGFyc2VJbnQocGFyYW1zLmJhc2VSYWRpdXMsIDEwKSA8IDApIHtcbiAgICAgIG9iai5iYXNlUmFkaXVzID0gTWFwTGliLkJBU0VfUkFESVVTO1xuICAgIH0gZWxzZSB7XG4gICAgICBvYmouYmFzZVJhZGl1cyA9IHBhcmFtcy5iYXNlUmFkaXVzO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIHZhbGlkYXRlV2VpZ2h0ZWREb3RzUG9zaXRpb25BcnJheShwb3NBcnJheSwgcGFyYW1zKSB7XG4gICAgaWYgKHBhcmFtcy5taW5WYWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHBhcmFtcy5tYXhWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBNYXBMaWIuTE9HLmVycm9yKFsndmFsaWRhdGVXZWlnaHRlZERvdHNQb3NpdGlvbkFycmF5J10sICdXaGVuIHVzaW5nIFxcJ3dlaWdodGVkRG90c1xcJyBvciAnICtcbiAgICAgICAgJ1xcJ3dlaWdodGVkQ29sb3JlZERvdHNcXCcgcmVuZGVyaW5nLCBcXCdtYXhWYWx1ZVxcJyBhbmQgXFwnbWluVmFsdWVcXCcgcGFyYW1ldGVycyBhcmUgY29tcHVsc29yeScpO1xuICAgICAgcG9zQXJyYXkucmVuZGVyID0gdW5kZWZpbmVkO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBwb3NBcnJheS5tYXhWYWx1ZSA9IHBhcmFtcy5tYXhWYWx1ZTtcbiAgICBwb3NBcnJheS5taW5WYWx1ZSA9IHBhcmFtcy5taW5WYWx1ZTtcbiAgICBpZiAodHlwZW9mIHBvc0FycmF5Lm1pblZhbHVlICE9PSAnbnVtYmVyJyB8fFxuICAgICAgdHlwZW9mIHBvc0FycmF5Lm1heFZhbHVlICE9PSAnbnVtYmVyJyB8fFxuICAgICAgcG9zQXJyYXkubWluVmFsdWUgPj0gcG9zQXJyYXkubWF4VmFsdWUpIHtcbiAgICAgIE1hcExpYi5MT0cuZXJyb3IoWyd2YWxpZGF0ZVdlaWdodGVkRG90c1Bvc2l0aW9uQXJyYXknXSwgJ1doZW4gdXNpbmcgXFwnd2VpZ2h0ZWREb3RzXFwnIG9yICcgK1xuICAgICAgICAnXFwnd2VpZ2h0ZWRDb2xvcmVkRG90c1xcJyByZW5kZXJpbmcsIFxcJ21heFZhbHVlXFwnIGFuZCBcXCdtaW5WYWx1ZVxcJyBtdXN0IGJlIG51bWJlcnMgYW5kIFxcJ21heFZhbHVlXFwnICcgK1xuICAgICAgICAnbXVzdCBiZSBncmVhdGVyIHRoYW4gXFwnbWluVmFsdWVcXCcnKTtcbiAgICAgIHBvc0FycmF5LnJlbmRlciA9IHVuZGVmaW5lZDtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFHVFNMaWIuaXNQb3NpdGlvbnNBcnJheVdpdGhWYWx1ZXMocG9zQXJyYXkpICYmICFHVFNMaWIuaXNQb3NpdGlvbnNBcnJheVdpdGhUd29WYWx1ZXMocG9zQXJyYXkpKSB7XG4gICAgICBNYXBMaWIuTE9HLmVycm9yKFsndmFsaWRhdGVXZWlnaHRlZERvdHNQb3NpdGlvbkFycmF5J10sICdXaGVuIHVzaW5nIFxcJ3dlaWdodGVkRG90c1xcJyBvciAnICtcbiAgICAgICAgJ1xcJ3dlaWdodGVkQ29sb3JlZERvdHNcXCcgcmVuZGVyaW5nLCBwb3NpdGlvbnMgbXVzdCBoYXZlIGFuIGFzc29jaWF0ZWQgdmFsdWUnKTtcbiAgICAgIHBvc0FycmF5LnJlbmRlciA9IHVuZGVmaW5lZDtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAocGFyYW1zLm51bVN0ZXBzID09PSB1bmRlZmluZWQgfHwgaXNOYU4ocGFyc2VJbnQocGFyYW1zLm51bVN0ZXBzLCAxMCkpIHx8IHBhcnNlSW50KHBhcmFtcy5udW1TdGVwcywgMTApIDwgMCkge1xuICAgICAgcG9zQXJyYXkubnVtU3RlcHMgPSA1O1xuICAgIH0gZWxzZSB7XG4gICAgICBwb3NBcnJheS5udW1TdGVwcyA9IHBhcmFtcy5udW1TdGVwcztcbiAgICB9XG4gICAgY29uc3Qgc3RlcCA9IChwb3NBcnJheS5tYXhWYWx1ZSAtIHBvc0FycmF5Lm1pblZhbHVlKSAvIHBvc0FycmF5Lm51bVN0ZXBzO1xuICAgIGNvbnN0IHN0ZXBzID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb3NBcnJheS5udW1TdGVwcyAtIDE7IGkrKykge1xuICAgICAgc3RlcHNbaV0gPSBwb3NBcnJheS5taW5WYWx1ZSArIChpICsgMSkgKiBzdGVwO1xuICAgIH1cbiAgICBzdGVwc1twb3NBcnJheS5udW1TdGVwcyAtIDFdID0gcG9zQXJyYXkubWF4VmFsdWU7XG5cbiAgICBjb25zdCBzaXplID0gKHBvc0FycmF5IHx8IFtdKS5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIGNvbnN0IHBvcyA9IHBvc0FycmF5W2ldO1xuICAgICAgY29uc3QgdmFsdWUgPSBwb3NbMl07XG4gICAgICBwb3NbNF0gPSBwb3NBcnJheS5udW1TdGVwcyAtIDE7XG4gICAgICBmb3IgKGNvbnN0IGsgaW4gc3RlcHMpIHtcbiAgICAgICAgaWYgKHZhbHVlIDw9IHN0ZXBzW2tdKSB7XG4gICAgICAgICAgcG9zWzRdID0gaztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHN0YXRpYyB0b0xlYWZsZXRNYXBQb3NpdGlvbkFycmF5KGRhdGE6IHsgZ3RzOiBhbnlbXTsgcGFyYW1zOiBhbnlbXSB9LCBoaWRkZW5EYXRhOiBudW1iZXJbXSwgc2NoZW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBwb3NpdGlvbnMgPSBbXTtcbiAgICBjb25zdCBzaXplID0gKGRhdGEuZ3RzIHx8IFtdKS5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIGNvbnN0IGd0cyA9IGRhdGEuZ3RzW2ldO1xuICAgICAgaWYgKEdUU0xpYi5pc1Bvc2l0aW9uQXJyYXkoZ3RzKSAmJiAoaGlkZGVuRGF0YSB8fCBbXSkuZmlsdGVyKGlkID0+IGlkID09PSBndHMuaWQpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3RvTGVhZmxldE1hcFBvc2l0aW9uQXJyYXknXSwgZ3RzLCBkYXRhLnBhcmFtc1tpXSk7XG4gICAgICAgIGNvbnN0IHBvc0FycmF5ID0gZ3RzO1xuICAgICAgICBjb25zdCBwYXJhbXMgPSBkYXRhLnBhcmFtc1tpXSB8fCB7fTtcbiAgICAgICAgTWFwTGliLmV4dHJhY3RDb21tb25QYXJhbWV0ZXJzKHBvc0FycmF5LCBwYXJhbXMsIGksIHNjaGVtZSk7XG4gICAgICAgIGlmIChwYXJhbXMucmVuZGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBwb3NBcnJheS5yZW5kZXIgPSBwYXJhbXMucmVuZGVyO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwb3NBcnJheS5yZW5kZXIgPT09ICd3ZWlnaHRlZERvdHMnKSB7XG4gICAgICAgICAgTWFwTGliLnZhbGlkYXRlV2VpZ2h0ZWREb3RzUG9zaXRpb25BcnJheShwb3NBcnJheSwgcGFyYW1zKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG9zQXJyYXkucmVuZGVyID09PSAnY29sb3JlZFdlaWdodGVkRG90cycpIHtcbiAgICAgICAgICBNYXBMaWIudmFsaWRhdGVXZWlnaHRlZENvbG9yZWREb3RzUG9zaXRpb25BcnJheShwb3NBcnJheSwgcGFyYW1zKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG9zQXJyYXkucmVuZGVyID09PSAnbWFya2VyJykge1xuICAgICAgICAgIHBvc0FycmF5Lm1hcmtlciA9IHBhcmFtcy5tYXJrZXI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5MT0cuZGVidWcoWyd0b0xlYWZsZXRNYXBQb3NpdGlvbkFycmF5JywgJ3Bvc0FycmF5J10sIHBvc0FycmF5KTtcbiAgICAgICAgcG9zaXRpb25zLnB1c2gocG9zQXJyYXkpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcG9zaXRpb25zO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgdmFsaWRhdGVXZWlnaHRlZENvbG9yZWREb3RzUG9zaXRpb25BcnJheShwb3NBcnJheTogYW55LCBwYXJhbXM6IGFueSkge1xuICAgIGlmICghTWFwTGliLnZhbGlkYXRlV2VpZ2h0ZWREb3RzUG9zaXRpb25BcnJheShwb3NBcnJheSwgcGFyYW1zKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAocGFyYW1zLm1pbkNvbG9yVmFsdWUgPT09IHVuZGVmaW5lZCB8fFxuICAgICAgcGFyYW1zLm1heENvbG9yVmFsdWUgPT09IHVuZGVmaW5lZCB8fFxuICAgICAgcGFyYW1zLnN0YXJ0Q29sb3IgPT09IHVuZGVmaW5lZCB8fFxuICAgICAgcGFyYW1zLmVuZENvbG9yID09PSB1bmRlZmluZWQpIHtcbiAgICAgIE1hcExpYi5MT0cuZXJyb3IoWyd2YWxpZGF0ZVdlaWdodGVkQ29sb3JlZERvdHNQb3NpdGlvbkFycmF5J10sICdXaGVuIHVzaW5nICcgK1xuICAgICAgICAnXFwnd2VpZ2h0ZWRDb2xvcmVkRG90c1xcJyByZW5kZXJpbmcsIFxcJ21heENvbG9yVmFsdWVcXCcsIFxcJ21pbkNvbG9yVmFsdWVcXCcsIFxcJ3N0YXJ0Q29sb3JcXCcgJyArXG4gICAgICAgICdhbmQgXFwnZW5kQ29sb3JcXCcgcGFyYW1ldGVycyBhcmUgY29tcHVsc29yeScpO1xuICAgICAgcG9zQXJyYXkucmVuZGVyID0gdW5kZWZpbmVkO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHBvc0FycmF5Lm1heENvbG9yVmFsdWUgPSBwYXJhbXMubWF4Q29sb3JWYWx1ZTtcbiAgICBwb3NBcnJheS5taW5Db2xvclZhbHVlID0gcGFyYW1zLm1pbkNvbG9yVmFsdWU7XG5cbiAgICBpZiAodHlwZW9mIHBvc0FycmF5Lm1pbkNvbG9yVmFsdWUgIT09ICdudW1iZXInIHx8XG4gICAgICB0eXBlb2YgcG9zQXJyYXkubWF4Q29sb3JWYWx1ZSAhPT0gJ251bWJlcicgfHxcbiAgICAgIHBvc0FycmF5Lm1pbkNvbG9yVmFsdWUgPj0gcG9zQXJyYXkubWF4Q29sb3JWYWx1ZSkge1xuICAgICAgTWFwTGliLkxPRy5lcnJvcihbJ3ZhbGlkYXRlV2VpZ2h0ZWRDb2xvcmVkRG90c1Bvc2l0aW9uQXJyYXknXSwgWydXaGVuIHVzaW5nICcgK1xuICAgICAgJ3dlaWdodGVkQ29sb3JlZERvdHNcXCcgcmVuZGVyaW5nLCBcXCdtYXhDb2xvclZhbHVlXFwnIGFuZCBcXCdtaW5Db2xvclZhbHVlXFwnIG11c3QgYmUgbnVtYmVycyAnICtcbiAgICAgICdhbmQgXFwnbWF4Q29sb3JWYWx1ZVxcJyBtdXN0IGJlIGdyZWF0ZXIgdGhhbiBcXCdtaW5Db2xvclZhbHVlXFwnJywge1xuICAgICAgICBtYXhDb2xvclZhbHVlOiBwb3NBcnJheS5tYXhDb2xvclZhbHVlLFxuICAgICAgICBtaW5Db2xvclZhbHVlOiBwb3NBcnJheS5taW5Db2xvclZhbHVlLFxuICAgICAgfV0pO1xuICAgICAgcG9zQXJyYXkucmVuZGVyID0gdW5kZWZpbmVkO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCByZSA9IC9eIyg/OlswLTlhLWZdezN9KXsxLDJ9JC9pO1xuICAgIGlmICh0eXBlb2YgcGFyYW1zLnN0YXJ0Q29sb3IgIT09ICdzdHJpbmcnXG4gICAgICB8fCB0eXBlb2YgcGFyYW1zLmVuZENvbG9yICE9PSAnc3RyaW5nJ1xuICAgICAgfHwgIXJlLnRlc3QocGFyYW1zLnN0YXJ0Q29sb3IpXG4gICAgICB8fCAhcmUudGVzdChwYXJhbXMuZW5kQ29sb3IpKSB7XG4gICAgICBNYXBMaWIuTE9HLmVycm9yKFsndmFsaWRhdGVXZWlnaHRlZENvbG9yZWREb3RzUG9zaXRpb25BcnJheSddLCBbJ1doZW4gdXNpbmcgJyArXG4gICAgICAnd2VpZ2h0ZWRDb2xvcmVkRG90c1xcJyByZW5kZXJpbmcsIFxcJ3N0YXJ0Q29sb3JcXCcgYW5kIFxcJ2VuZENvbG9yXFwnIHBhcmFtZXRlcnMgbXVzdCBiZSBSR0IgJyArXG4gICAgICAnY29sb3JzIGluICNycmdnYmIgZm9ybWF0Jywge1xuICAgICAgICBzdGFydENvbG9yOiBwYXJhbXMuc3RhcnRDb2xvcixcbiAgICAgICAgZW5kQ29sb3I6IHBhcmFtcy5lbmRDb2xvcixcbiAgICAgICAgdGVzdHM6IFtcbiAgICAgICAgICB0eXBlb2YgcGFyYW1zLnN0YXJ0Q29sb3IsXG4gICAgICAgICAgdHlwZW9mIHBhcmFtcy5lbmRDb2xvcixcbiAgICAgICAgICByZS50ZXN0KHBhcmFtcy5zdGFydENvbG9yKSxcbiAgICAgICAgICByZS50ZXN0KHBhcmFtcy5lbmRDb2xvciksXG4gICAgICAgICAgcmUudGVzdChwYXJhbXMuc3RhcnRDb2xvciksXG4gICAgICAgIF0sXG4gICAgICB9XSk7XG4gICAgICBwb3NBcnJheS5yZW5kZXIgPSB1bmRlZmluZWQ7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcG9zQXJyYXkuc3RhcnRDb2xvciA9IHtcbiAgICAgIHI6IHBhcnNlSW50KHBhcmFtcy5zdGFydENvbG9yLnN1YnN0cmluZygxLCAzKSwgMTYpLFxuICAgICAgZzogcGFyc2VJbnQocGFyYW1zLnN0YXJ0Q29sb3Iuc3Vic3RyaW5nKDMsIDUpLCAxNiksXG4gICAgICBiOiBwYXJzZUludChwYXJhbXMuc3RhcnRDb2xvci5zdWJzdHJpbmcoNSwgNyksIDE2KSxcbiAgICB9O1xuXG4gICAgcG9zQXJyYXkuZW5kQ29sb3IgPSB7XG4gICAgICByOiBwYXJzZUludChwYXJhbXMuZW5kQ29sb3Iuc3Vic3RyaW5nKDEsIDMpLCAxNiksXG4gICAgICBnOiBwYXJzZUludChwYXJhbXMuZW5kQ29sb3Iuc3Vic3RyaW5nKDMsIDUpLCAxNiksXG4gICAgICBiOiBwYXJzZUludChwYXJhbXMuZW5kQ29sb3Iuc3Vic3RyaW5nKDUsIDcpLCAxNiksXG4gICAgfTtcblxuICAgIGlmIChwYXJhbXMubnVtQ29sb3JTdGVwcyA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICBpc05hTihwYXJzZUludChwYXJhbXMubnVtQ29sb3JTdGVwcywgMTApKSB8fFxuICAgICAgcGFyc2VJbnQocGFyYW1zLm51bUNvbG9yU3RlcHMsIDEwKSA8IDApIHtcbiAgICAgIHBvc0FycmF5Lm51bUNvbG9yU3RlcHMgPSA1O1xuICAgIH0gZWxzZSB7XG4gICAgICBwb3NBcnJheS5udW1Db2xvclN0ZXBzID0gcGFyYW1zLm51bUNvbG9yU3RlcHM7XG4gICAgfVxuXG4gICAgcG9zQXJyYXkuY29sb3JHcmFkaWVudCA9IENvbG9yTGliLmhzdkdyYWRpZW50RnJvbVJnYkNvbG9ycyhcbiAgICAgIHBvc0FycmF5LnN0YXJ0Q29sb3IsXG4gICAgICBwb3NBcnJheS5lbmRDb2xvcixcbiAgICAgIHBvc0FycmF5Lm51bUNvbG9yU3RlcHMpO1xuXG4gICAgY29uc3Qgc3RlcCA9IChwb3NBcnJheS5tYXhDb2xvclZhbHVlIC0gcG9zQXJyYXkubWluQ29sb3JWYWx1ZSkgLyBwb3NBcnJheS5udW1Db2xvclN0ZXBzO1xuICAgIGNvbnN0IHN0ZXBzID0gW107XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBwb3NBcnJheS5udW1Db2xvclN0ZXBzOyBqKyspIHtcbiAgICAgIHN0ZXBzW2pdID0gcG9zQXJyYXkubWluQ29sb3JWYWx1ZSArIChqICsgMSkgKiBzdGVwO1xuICAgIH1cblxuICAgIHBvc0FycmF5LnN0ZXBzID0gc3RlcHM7XG5cbiAgICBwb3NBcnJheS5wb3NpdGlvbnMuZm9yRWFjaChwb3MgPT4ge1xuICAgICAgY29uc3QgY29sb3JWYWx1ZSA9IHBvc1szXTtcbiAgICAgIHBvc1s1XSA9IHBvc0FycmF5Lm51bUNvbG9yU3RlcHMgLSAxO1xuICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBzdGVwcy5sZW5ndGggLSAxOyBrKyspIHtcbiAgICAgICAgaWYgKGNvbG9yVmFsdWUgPCBzdGVwc1trXSkge1xuICAgICAgICAgIHBvc1s1XSA9IGs7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBnZXRCb3VuZHNBcnJheShwYXRocywgcG9zaXRpb25zRGF0YSwgYW5ub3RhdGlvbnNEYXRhLCBnZW9Kc29uKSB7XG4gICAgY29uc3QgcG9pbnRzQXJyYXkgPSBbXTtcbiAgICBsZXQgc2l6ZTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2dldEJvdW5kc0FycmF5JywgJ3BhdGhzJ10sIHBhdGhzKTtcbiAgICBzaXplID0gKHBhdGhzIHx8IFtdKS5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIGNvbnN0IHBhdGggPSBwYXRoc1tpXTtcbiAgICAgIGNvbnN0IHMgPSAocGF0aC5wYXRoIHx8IFtdKS5sZW5ndGg7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHM7IGorKykge1xuICAgICAgICBjb25zdCBwID0gcGF0aC5wYXRoW2pdO1xuICAgICAgICBwb2ludHNBcnJheS5wdXNoKFtwLmxhdCwgcC5sb25dKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5MT0cuZGVidWcoWydnZXRCb3VuZHNBcnJheScsICdwb3NpdGlvbnNEYXRhJ10sIHBvc2l0aW9uc0RhdGEpO1xuICAgIHNpemUgPSAocG9zaXRpb25zRGF0YSB8fCBbXSkubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHBvc2l0aW9uc0RhdGFbaV07XG4gICAgICBjb25zdCBzID0gKHBvc2l0aW9uLnBvc2l0aW9ucyB8fCBbXSkubGVuZ3RoO1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzOyBqKyspIHtcbiAgICAgICAgY29uc3QgcCA9IHBvc2l0aW9uLnBvc2l0aW9uc1tqXTtcbiAgICAgICAgcG9pbnRzQXJyYXkucHVzaChbcFswXSwgcFsxXV0pO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2dldEJvdW5kc0FycmF5JywgJ2Fubm90YXRpb25zRGF0YSddLCBhbm5vdGF0aW9uc0RhdGEpO1xuICAgIHNpemUgPSAoYW5ub3RhdGlvbnNEYXRhIHx8IFtdKS5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIGNvbnN0IGFubm90YXRpb24gPSBhbm5vdGF0aW9uc0RhdGFbaV07XG4gICAgICBjb25zdCBzID0gKGFubm90YXRpb24ucGF0aCB8fCBbXSkubGVuZ3RoO1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzOyBqKyspIHtcbiAgICAgICAgY29uc3QgcCA9IGFubm90YXRpb24ucGF0aFtqXTtcbiAgICAgICAgcG9pbnRzQXJyYXkucHVzaChbcC5sYXQsIHAubG9uXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHNpemUgPSAoZ2VvSnNvbiB8fCBbXSkubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICBjb25zdCBnID0gZ2VvSnNvbltpXTtcbiAgICAgIHN3aXRjaCAoZy5nZW9tZXRyeS50eXBlKSB7XG4gICAgICAgIGNhc2UgJ011bHRpUG9seWdvbic6XG4gICAgICAgICAgZy5nZW9tZXRyeS5jb29yZGluYXRlcy5mb3JFYWNoKGMgPT4gYy5mb3JFYWNoKG0gPT4gbS5mb3JFYWNoKHAgPT4gcG9pbnRzQXJyYXkucHVzaChbcFsxXSwgcFswXV0pKSkpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdQb2x5Z29uJzpcbiAgICAgICAgICBnLmdlb21ldHJ5LmNvb3JkaW5hdGVzLmZvckVhY2goYyA9PiBjLmZvckVhY2gocCA9PiBwb2ludHNBcnJheS5wdXNoKFtwWzFdLCBwWzBdXSkpKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnTGluZVN0cmluZyc6XG4gICAgICAgICAgZy5nZW9tZXRyeS5jb29yZGluYXRlcy5mb3JFYWNoKHAgPT4gcG9pbnRzQXJyYXkucHVzaChbcFsxXSwgcFswXV0pKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnUG9pbnQnOlxuICAgICAgICAgIHBvaW50c0FycmF5LnB1c2goW2cuZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMV0sIGcuZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMF1dKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHBvaW50c0FycmF5Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgcmV0dXJuIHBvaW50c0FycmF5O1xuICAgIH1cbiAgICBsZXQgc291dGggPSA5MDtcbiAgICBsZXQgd2VzdCA9IC0xODA7XG4gICAgbGV0IG5vcnRoID0gLTkwO1xuICAgIGxldCBlYXN0ID0gMTgwO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZ2V0Qm91bmRzQXJyYXknXSwgcG9pbnRzQXJyYXkpO1xuICAgIHNpemUgPSAocG9pbnRzQXJyYXkgfHwgW10pLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgY29uc3QgcG9pbnQgPSBwb2ludHNBcnJheVtpXTtcbiAgICAgIGlmIChwb2ludFswXSA+IG5vcnRoKSB7XG4gICAgICAgIG5vcnRoID0gcG9pbnRbMF07XG4gICAgICB9XG4gICAgICBpZiAocG9pbnRbMF0gPCBzb3V0aCkge1xuICAgICAgICBzb3V0aCA9IHBvaW50WzBdO1xuICAgICAgfVxuICAgICAgaWYgKHBvaW50WzFdID4gd2VzdCkge1xuICAgICAgICB3ZXN0ID0gcG9pbnRbMV07XG4gICAgICB9XG4gICAgICBpZiAocG9pbnRbMV0gPCBlYXN0KSB7XG4gICAgICAgIGVhc3QgPSBwb2ludFsxXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFtbc291dGgsIHdlc3RdLCBbbm9ydGgsIGVhc3RdXTtcbiAgfVxuXG4gIHN0YXRpYyBwYXRoRGF0YVRvTGVhZmxldChwYXRoRGF0YSwgb3B0aW9ucykge1xuICAgIGNvbnN0IHBhdGggPSBbXTtcbiAgICBjb25zdCBmaXJzdEluZGV4ID0gKChvcHRpb25zID09PSB1bmRlZmluZWQpIHx8XG4gICAgICAob3B0aW9ucy5mcm9tID09PSB1bmRlZmluZWQpIHx8XG4gICAgICAob3B0aW9ucy5mcm9tIDwgMCkpID8gMCA6IG9wdGlvbnMuZnJvbTtcbiAgICBjb25zdCBsYXN0SW5kZXggPSAoKG9wdGlvbnMgPT09IHVuZGVmaW5lZCkgfHwgKG9wdGlvbnMudG8gPT09IHVuZGVmaW5lZCkgfHwgKG9wdGlvbnMudG8gPj0gcGF0aERhdGEubGVuZ3RoKSkgP1xuICAgICAgcGF0aERhdGEubGVuZ3RoIC0gMSA6IG9wdGlvbnMudG87XG4gICAgZm9yIChsZXQgaSA9IGZpcnN0SW5kZXg7IGkgPD0gbGFzdEluZGV4OyBpKyspIHtcbiAgICAgIHBhdGgucHVzaChbcGF0aERhdGFbaV0ubGF0LCBwYXRoRGF0YVtpXS5sb25dKTtcbiAgICB9XG4gICAgcmV0dXJuIHBhdGg7XG4gIH1cblxuICBzdGF0aWMgdG9HZW9KU09OKGRhdGE6IHsgZ3RzOiBhbnlbXTsgcGFyYW1zOiBhbnlbXSB9KSB7XG4gICAgY29uc3QgZGVmU2hhcGVzID0gWydQb2ludCcsICdMaW5lU3RyaW5nJywgJ1BvbHlnb24nLCAnTXVsdGlQb2x5Z29uJ107XG4gICAgY29uc3QgZ2VvSnNvbnMgPSBbXTtcbiAgICBkYXRhLmd0cy5mb3JFYWNoKGQgPT4ge1xuICAgICAgaWYgKGQudHlwZSAmJiBkLnR5cGUgPT09ICdGZWF0dXJlJyAmJiBkLmdlb21ldHJ5ICYmIGQuZ2VvbWV0cnkudHlwZSAmJiBkZWZTaGFwZXMuaW5kZXhPZihkLmdlb21ldHJ5LnR5cGUpID4gLTEpIHtcbiAgICAgICAgZ2VvSnNvbnMucHVzaChkKTtcbiAgICAgIH0gZWxzZSBpZiAoZC50eXBlICYmIGRlZlNoYXBlcy5pbmRleE9mKGQudHlwZSkgPiAtMSkge1xuICAgICAgICBnZW9Kc29ucy5wdXNoKHt0eXBlOiAnRmVhdHVyZScsIGdlb21ldHJ5OiBkfSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGdlb0pzb25zO1xuICB9XG59XG4iXX0=