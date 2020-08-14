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
export class MapLib {
    /**
     * @param {?} data
     * @param {?} hiddenData
     * @param {?=} divider
     * @param {?=} scheme
     * @return {?}
     */
    static toLeafletMapPaths(data, hiddenData, divider = 1000, scheme) {
        /** @type {?} */
        const paths = [];
        /** @type {?} */
        const size = (data.gts || []).length;
        for (let i = 0; i < size; i++) {
            /** @type {?} */
            const gts = data.gts[i];
            if (GTSLib.isGtsToPlotOnMap(gts) && (hiddenData || []).filter((/**
             * @param {?} id
             * @return {?}
             */
            id => id === gts.id)).length === 0) {
                /** @type {?} */
                const path = {};
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
        }
        return paths;
    }
    /**
     * @param {?} gts
     * @param {?=} divider
     * @return {?}
     */
    static gtsToPath(gts, divider = 1000) {
        /** @type {?} */
        const path = [];
        /** @type {?} */
        const size = (gts.v || []).length;
        for (let i = 0; i < size; i++) {
            /** @type {?} */
            const v = gts.v[i];
            /** @type {?} */
            const l = v.length;
            if (l >= 4) {
                // timestamp, lat, lon, elev?, value
                path.push({ ts: Math.floor(v[0] / divider), lat: v[1], lon: v[2], val: v[l - 1] });
            }
        }
        return path;
    }
    /**
     * @param {?} data
     * @param {?} hiddenData
     * @param {?=} divider
     * @param {?=} scheme
     * @return {?}
     */
    static annotationsToLeafletPositions(data, hiddenData, divider = 1000, scheme) {
        /** @type {?} */
        const annotations = [];
        /** @type {?} */
        const size = (data.gts || []).length;
        for (let i = 0; i < size; i++) {
            /** @type {?} */
            const gts = data.gts[i];
            if (GTSLib.isGtsToAnnotate(gts) && (hiddenData || []).filter((/**
             * @param {?} id
             * @return {?}
             */
            id => id === gts.id)).length === 0) {
                this.LOG.debug(['annotationsToLeafletPositions'], gts);
                /** @type {?} */
                const annotation = {};
                /** @type {?} */
                let params = (data.params || [])[i];
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
                this.LOG.debug(['annotationsToLeafletPositions', 'annotations'], annotation);
                annotations.push(annotation);
            }
        }
        return annotations;
    }
    /**
     * @private
     * @param {?} obj
     * @param {?} params
     * @param {?} index
     * @param {?} scheme
     * @return {?}
     */
    static extractCommonParameters(obj, params, index, scheme) {
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
    }
    /**
     * @private
     * @param {?} posArray
     * @param {?} params
     * @return {?}
     */
    static validateWeightedDotsPositionArray(posArray, params) {
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
        const step = (posArray.maxValue - posArray.minValue) / posArray.numSteps;
        /** @type {?} */
        const steps = [];
        for (let i = 0; i < posArray.numSteps - 1; i++) {
            steps[i] = posArray.minValue + (i + 1) * step;
        }
        steps[posArray.numSteps - 1] = posArray.maxValue;
        /** @type {?} */
        const size = (posArray || []).length;
        for (let i = 0; i < size; i++) {
            /** @type {?} */
            const pos = posArray[i];
            /** @type {?} */
            const value = pos[2];
            pos[4] = posArray.numSteps - 1;
            for (const k in steps) {
                if (value <= steps[k]) {
                    pos[4] = k;
                    break;
                }
            }
        }
        return true;
    }
    /**
     * @param {?} data
     * @param {?} hiddenData
     * @param {?} scheme
     * @return {?}
     */
    static toLeafletMapPositionArray(data, hiddenData, scheme) {
        /** @type {?} */
        const positions = [];
        /** @type {?} */
        const size = (data.gts || []).length;
        for (let i = 0; i < size; i++) {
            /** @type {?} */
            const gts = data.gts[i];
            if (GTSLib.isPositionArray(gts) && (hiddenData || []).filter((/**
             * @param {?} id
             * @return {?}
             */
            id => id === gts.id)).length === 0) {
                this.LOG.debug(['toLeafletMapPositionArray'], gts, data.params[i]);
                /** @type {?} */
                const posArray = gts;
                /** @type {?} */
                const params = data.params[i] || {};
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
                this.LOG.debug(['toLeafletMapPositionArray', 'posArray'], posArray);
                positions.push(posArray);
            }
        }
        return positions;
    }
    /**
     * @private
     * @param {?} posArray
     * @param {?} params
     * @return {?}
     */
    static validateWeightedColoredDotsPositionArray(posArray, params) {
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
        const re = /^#(?:[0-9a-f]{3}){1,2}$/i;
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
        const step = (posArray.maxColorValue - posArray.minColorValue) / posArray.numColorSteps;
        /** @type {?} */
        const steps = [];
        for (let j = 0; j < posArray.numColorSteps; j++) {
            steps[j] = posArray.minColorValue + (j + 1) * step;
        }
        posArray.steps = steps;
        posArray.positions.forEach((/**
         * @param {?} pos
         * @return {?}
         */
        pos => {
            /** @type {?} */
            const colorValue = pos[3];
            pos[5] = posArray.numColorSteps - 1;
            for (let k = 0; k < steps.length - 1; k++) {
                if (colorValue < steps[k]) {
                    pos[5] = k;
                    break;
                }
            }
        }));
    }
    /**
     * @param {?} paths
     * @param {?} positionsData
     * @param {?} annotationsData
     * @param {?} geoJson
     * @return {?}
     */
    static getBoundsArray(paths, positionsData, annotationsData, geoJson) {
        /** @type {?} */
        const pointsArray = [];
        /** @type {?} */
        let size;
        this.LOG.debug(['getBoundsArray', 'paths'], paths);
        size = (paths || []).length;
        for (let i = 0; i < size; i++) {
            /** @type {?} */
            const path = paths[i];
            /** @type {?} */
            const s = (path.path || []).length;
            for (let j = 0; j < s; j++) {
                /** @type {?} */
                const p = path.path[j];
                pointsArray.push([p.lat, p.lon]);
            }
        }
        this.LOG.debug(['getBoundsArray', 'positionsData'], positionsData);
        size = (positionsData || []).length;
        for (let i = 0; i < size; i++) {
            /** @type {?} */
            const position = positionsData[i];
            /** @type {?} */
            const s = (position.positions || []).length;
            for (let j = 0; j < s; j++) {
                /** @type {?} */
                const p = position.positions[j];
                pointsArray.push([p[0], p[1]]);
            }
        }
        this.LOG.debug(['getBoundsArray', 'annotationsData'], annotationsData);
        size = (annotationsData || []).length;
        for (let i = 0; i < size; i++) {
            /** @type {?} */
            const annotation = annotationsData[i];
            /** @type {?} */
            const s = (annotation.path || []).length;
            for (let j = 0; j < s; j++) {
                /** @type {?} */
                const p = annotation.path[j];
                pointsArray.push([p.lat, p.lon]);
            }
        }
        size = (geoJson || []).length;
        for (let i = 0; i < size; i++) {
            /** @type {?} */
            const g = geoJson[i];
            switch (g.geometry.type) {
                case 'MultiPolygon':
                    g.geometry.coordinates.forEach((/**
                     * @param {?} c
                     * @return {?}
                     */
                    c => c.forEach((/**
                     * @param {?} m
                     * @return {?}
                     */
                    m => m.forEach((/**
                     * @param {?} p
                     * @return {?}
                     */
                    p => pointsArray.push([p[1], p[0]])))))));
                    break;
                case 'Polygon':
                    g.geometry.coordinates.forEach((/**
                     * @param {?} c
                     * @return {?}
                     */
                    c => c.forEach((/**
                     * @param {?} p
                     * @return {?}
                     */
                    p => pointsArray.push([p[1], p[0]])))));
                    break;
                case 'LineString':
                    g.geometry.coordinates.forEach((/**
                     * @param {?} p
                     * @return {?}
                     */
                    p => pointsArray.push([p[1], p[0]])));
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
        let south = 90;
        /** @type {?} */
        let west = -180;
        /** @type {?} */
        let north = -90;
        /** @type {?} */
        let east = 180;
        this.LOG.debug(['getBoundsArray'], pointsArray);
        size = (pointsArray || []).length;
        for (let i = 0; i < size; i++) {
            /** @type {?} */
            const point = pointsArray[i];
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
    }
    /**
     * @param {?} pathData
     * @param {?} options
     * @return {?}
     */
    static pathDataToLeaflet(pathData, options) {
        /** @type {?} */
        const path = [];
        /** @type {?} */
        const firstIndex = ((options === undefined) ||
            (options.from === undefined) ||
            (options.from < 0)) ? 0 : options.from;
        /** @type {?} */
        const lastIndex = ((options === undefined) || (options.to === undefined) || (options.to >= pathData.length)) ?
            pathData.length - 1 : options.to;
        for (let i = firstIndex; i <= lastIndex; i++) {
            path.push([pathData[i].lat, pathData[i].lon]);
        }
        return path;
    }
    /**
     * @param {?} data
     * @return {?}
     */
    static toGeoJSON(data) {
        /** @type {?} */
        const defShapes = ['Point', 'LineString', 'Polygon', 'MultiPolygon'];
        /** @type {?} */
        const geoJsons = [];
        data.gts.forEach((/**
         * @param {?} d
         * @return {?}
         */
        d => {
            if (d.type && d.type === 'Feature' && d.geometry && d.geometry.type && defShapes.indexOf(d.geometry.type) > -1) {
                geoJsons.push(d);
            }
            else if (d.type && defShapes.indexOf(d.type) > -1) {
                geoJsons.push({ type: 'Feature', geometry: d });
            }
        }));
        return geoJsons;
    }
}
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
        attribution: `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles
 style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by
 <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>`
    },
    TOPO: {
        link: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        attribution: `Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors,
 <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>
  (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)`
    },
    TOPO2: {
        link: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        attribution: `Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN,
       GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community`
    },
    SURFER: {
        link: 'https://maps.heigit.org/openmapsurfer/tiles/roads/webmercator/{z}/{x}/{y}.png',
        attribution: `Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of
 Heidelberg</a> | Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`
    },
    HYDRA: {
        link: 'https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png',
        attribution: `Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a>
 &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`
    },
    HYDRA2: {
        link: 'https://{s}.tile.openstreetmap.se/hydda/base/{z}/{x}/{y}.png',
        attribution: `Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a>
 &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`
    },
    TONER: {
        link: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png',
        attribution: `Map tiles by <a href="http://stamen.com">Stamen Design</a>,
 <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy;
  <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`,
        subdomains: 'abcd'
    },
    TONER_LITE: {
        link: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.png',
        attribution: `Map tiles by <a href="http://stamen.com">Stamen Design</a>,
 <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy;
  <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`,
        subdomains: 'abcd',
    },
    TERRAIN: {
        link: 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png',
        attribution: `Map tiles by <a href="http://stamen.com">Stamen Design</a>,
 <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy;
 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`,
        subdomains: 'abcd',
    },
    ESRI: {
        link: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
        attribution: `Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan,
 METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012`
    },
    SATELLITE: {
        link: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: `Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN,
 IGP, UPR-EGP, and the GIS User Community`
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
        attribution: `Map tiles by <a href="http://stamen.com">Stamen Design</a>,
 <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy;
  <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`,
        subdomains: 'abcd',
    },
    CARTODB: {
        link: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        attribution: `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy;
 <a href="https://carto.com/attributions">CartoDB</a>`,
        subdomains: 'abcd',
    },
    CARTODB_DARK: {
        link: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
        attribution: `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy;
 <a href="https://carto.com/attributions">CartoDB</a>`,
        subdomains: 'abcd',
    },
};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWxpYi5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzZW54L3dhcnB2aWV3LyIsInNvdXJjZXMiOlsic3JjL2xpYi91dGlscy9tYXAtbGliLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDakMsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUNyQyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBRWhDLE1BQU0sT0FBTyxNQUFNOzs7Ozs7OztJQTBHakIsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQW1DLEVBQUUsVUFBb0IsRUFBRSxVQUFrQixJQUFJLEVBQUUsTUFBYzs7Y0FDbEgsS0FBSyxHQUFHLEVBQUU7O2NBQ1YsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxNQUFNO1FBQ3BDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUU7O2tCQUN2QixHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDdkIsSUFBSSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksRUFBRSxDQUFDLENBQUMsTUFBTTs7OztZQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFOztzQkFDekYsSUFBSSxHQUFRLEVBQUU7Z0JBQ3BCLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQzNDLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJ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QUksRUFBRSxzRUFBc0U7UUFDNUUsV0FBVyxFQUFFOztrRkFFK0Q7UUFDNUUsVUFBVSxFQUFFLE1BQU07S0FDbkI7SUFDRCxJQUFJLEVBQUU7UUFDSixJQUFJLEVBQUUsa0dBQWtHO1FBQ3hHLFdBQVcsRUFBRTs2REFDMEM7S0FDeEQ7SUFDRCxTQUFTLEVBQUU7UUFDVCxJQUFJLEVBQUUsK0ZBQStGO1FBQ3JHLFdBQVcsRUFBRTswQ0FDdUI7S0FDckM7SUFDRCxNQUFNLEVBQUU7UUFDTixJQUFJLEVBQUUsK0ZBQStGO1FBQ3JHLFdBQVcsRUFBRSxzSEFBc0g7S0FDcEk7SUFDRCxJQUFJLEVBQUU7UUFDSixJQUFJLEVBQUUsOEdBQThHO1FBQ3BILE1BQU0sRUFBRSxFQUFFO0tBQ1g7SUFDRCxTQUFTLEVBQUU7UUFDVCxJQUFJLEVBQUUsOEdBQThHO1FBQ3BILFdBQVcsRUFBRSxpREFBaUQ7S0FDL0Q7SUFDRCxVQUFVLEVBQUU7UUFDVixJQUFJLEVBQUUsc0VBQXNFO1FBQzVFLFdBQVcsRUFBRTs7bUZBRWdFO1FBQzdFLFVBQVUsRUFBRSxNQUFNO0tBQ25CO0lBQ0QsT0FBTyxFQUFFO1FBQ1AsSUFBSSxFQUFFLGdFQUFnRTtRQUN0RSxXQUFXLEVBQUU7c0RBQ21DO1FBQ2hELFVBQVUsRUFBRSxNQUFNO0tBQ25CO0lBQ0QsWUFBWSxFQUFFO1FBQ1osSUFBSSxFQUFFLDZFQUE2RTtRQUNuRixXQUFXLEVBQUU7c0RBQ21DO1FBQ2hELFVBQVUsRUFBRSxNQUFNO0tBQ25CO0NBQ0YsQ0FBQzs7O0lBdkdGLG1CQUF1Qjs7Ozs7SUFDdkIsV0FBc0Q7O0lBRXRELGdCQW9HRSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQ29weXJpZ2h0IDIwMjAgIFNlblggUy5BLlMuXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKi9cblxuaW1wb3J0IHtHVFNMaWJ9IGZyb20gJy4vZ3RzLmxpYic7XG5pbXBvcnQge0NvbG9yTGlifSBmcm9tICcuL2NvbG9yLWxpYic7XG5pbXBvcnQge0xvZ2dlcn0gZnJvbSAnLi9sb2dnZXInO1xuXG5leHBvcnQgY2xhc3MgTWFwTGliIHtcbiAgc3RhdGljIEJBU0VfUkFESVVTID0gMjtcbiAgcHJpdmF0ZSBzdGF0aWMgTE9HOiBMb2dnZXIgPSBuZXcgTG9nZ2VyKE1hcExpYiwgdHJ1ZSk7XG5cbiAgc3RhdGljIG1hcFR5cGVzOiBhbnkgPSB7XG4gICAgTk9ORTogdW5kZWZpbmVkLFxuICAgIERFRkFVTFQ6IHtcbiAgICAgIGxpbms6ICdodHRwczovL3tzfS50aWxlLm9wZW5zdHJlZXRtYXAub3JnL3t6fS97eH0ve3l9LnBuZycsXG4gICAgICBhdHRyaWJ1dGlvbjogJyZjb3B5OyA8YSBocmVmPVwiaHR0cHM6Ly93d3cub3BlbnN0cmVldG1hcC5vcmcvY29weXJpZ2h0XCI+T3BlblN0cmVldE1hcDwvYT4gY29udHJpYnV0b3JzJ1xuICAgIH0sXG4gICAgSE9UOiB7XG4gICAgICBsaW5rOiAnaHR0cHM6Ly97c30udGlsZS5vcGVuc3RyZWV0bWFwLmZyL2hvdC97en0ve3h9L3t5fS5wbmcnLFxuICAgICAgYXR0cmlidXRpb246IGAmY29weTsgPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm9wZW5zdHJlZXRtYXAub3JnL2NvcHlyaWdodFwiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9ycywgVGlsZXNcbiBzdHlsZSBieSA8YSBocmVmPVwiaHR0cHM6Ly93d3cuaG90b3NtLm9yZy9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5IdW1hbml0YXJpYW4gT3BlblN0cmVldE1hcCBUZWFtPC9hPiBob3N0ZWQgYnlcbiA8YSBocmVmPVwiaHR0cHM6Ly9vcGVuc3RyZWV0bWFwLmZyL1wiIHRhcmdldD1cIl9ibGFua1wiPk9wZW5TdHJlZXRNYXAgRnJhbmNlPC9hPmBcbiAgICB9LFxuICAgIFRPUE86IHtcbiAgICAgIGxpbms6ICdodHRwczovL3tzfS50aWxlLm9wZW50b3BvbWFwLm9yZy97en0ve3h9L3t5fS5wbmcnLFxuICAgICAgYXR0cmlidXRpb246IGBNYXAgZGF0YTogJmNvcHk7IDxhIGhyZWY9XCJodHRwczovL3d3dy5vcGVuc3RyZWV0bWFwLm9yZy9jb3B5cmlnaHRcIj5PcGVuU3RyZWV0TWFwPC9hPiBjb250cmlidXRvcnMsXG4gPGEgaHJlZj1cImh0dHA6Ly92aWV3ZmluZGVycGFub3JhbWFzLm9yZ1wiPlNSVE08L2E+IHwgTWFwIHN0eWxlOiAmY29weTsgPGEgaHJlZj1cImh0dHBzOi8vb3BlbnRvcG9tYXAub3JnXCI+T3BlblRvcG9NYXA8L2E+XG4gICg8YSBocmVmPVwiaHR0cHM6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL2J5LXNhLzMuMC9cIj5DQy1CWS1TQTwvYT4pYFxuICAgIH0sXG4gICAgVE9QTzI6IHtcbiAgICAgIGxpbms6ICdodHRwczovL3NlcnZlci5hcmNnaXNvbmxpbmUuY29tL0FyY0dJUy9yZXN0L3NlcnZpY2VzL1dvcmxkX1RvcG9fTWFwL01hcFNlcnZlci90aWxlL3t6fS97eX0ve3h9JyxcbiAgICAgIGF0dHJpYnV0aW9uOiBgVGlsZXMgJmNvcHk7IEVzcmkgJm1kYXNoOyBFc3JpLCBEZUxvcm1lLCBOQVZURVEsIFRvbVRvbSwgSW50ZXJtYXAsIGlQQywgVVNHUywgRkFPLCBOUFMsIE5SQ0FOLFxuICAgICAgIEdlb0Jhc2UsIEthZGFzdGVyIE5MLCBPcmRuYW5jZSBTdXJ2ZXksIEVzcmkgSmFwYW4sIE1FVEksIEVzcmkgQ2hpbmEgKEhvbmcgS29uZyksIGFuZCB0aGUgR0lTIFVzZXIgQ29tbXVuaXR5YFxuICAgIH0sXG4gICAgU1VSRkVSOiB7XG4gICAgICBsaW5rOiAnaHR0cHM6Ly9tYXBzLmhlaWdpdC5vcmcvb3Blbm1hcHN1cmZlci90aWxlcy9yb2Fkcy93ZWJtZXJjYXRvci97en0ve3h9L3t5fS5wbmcnLFxuICAgICAgYXR0cmlidXRpb246IGBJbWFnZXJ5IGZyb20gPGEgaHJlZj1cImh0dHA6Ly9naXNjaWVuY2UudW5pLWhkLmRlL1wiPkdJU2NpZW5jZSBSZXNlYXJjaCBHcm91cCBAIFVuaXZlcnNpdHkgb2ZcbiBIZWlkZWxiZXJnPC9hPiB8IE1hcCBkYXRhICZjb3B5OyA8YSBocmVmPVwiaHR0cHM6Ly93d3cub3BlbnN0cmVldG1hcC5vcmcvY29weXJpZ2h0XCI+T3BlblN0cmVldE1hcDwvYT4gY29udHJpYnV0b3JzYFxuICAgIH0sXG4gICAgSFlEUkE6IHtcbiAgICAgIGxpbms6ICdodHRwczovL3tzfS50aWxlLm9wZW5zdHJlZXRtYXAuc2UvaHlkZGEvZnVsbC97en0ve3h9L3t5fS5wbmcnLFxuICAgICAgYXR0cmlidXRpb246IGBUaWxlcyBjb3VydGVzeSBvZiA8YSBocmVmPVwiaHR0cDovL29wZW5zdHJlZXRtYXAuc2UvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+T3BlblN0cmVldE1hcCBTd2VkZW48L2E+XG4gJm1kYXNoOyBNYXAgZGF0YSAmY29weTsgPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm9wZW5zdHJlZXRtYXAub3JnL2NvcHlyaWdodFwiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9yc2BcbiAgICB9LFxuICAgIEhZRFJBMjoge1xuICAgICAgbGluazogJ2h0dHBzOi8ve3N9LnRpbGUub3BlbnN0cmVldG1hcC5zZS9oeWRkYS9iYXNlL3t6fS97eH0ve3l9LnBuZycsXG4gICAgICBhdHRyaWJ1dGlvbjogYFRpbGVzIGNvdXJ0ZXN5IG9mIDxhIGhyZWY9XCJodHRwOi8vb3BlbnN0cmVldG1hcC5zZS9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5PcGVuU3RyZWV0TWFwIFN3ZWRlbjwvYT5cbiAmbWRhc2g7IE1hcCBkYXRhICZjb3B5OyA8YSBocmVmPVwiaHR0cHM6Ly93d3cub3BlbnN0cmVldG1hcC5vcmcvY29weXJpZ2h0XCI+T3BlblN0cmVldE1hcDwvYT4gY29udHJpYnV0b3JzYFxuICAgIH0sXG4gICAgVE9ORVI6IHtcbiAgICAgIGxpbms6ICdodHRwczovL3N0YW1lbi10aWxlcy17c30uYS5zc2wuZmFzdGx5Lm5ldC90b25lci97en0ve3h9L3t5fXtyfS5wbmcnLFxuICAgICAgYXR0cmlidXRpb246IGBNYXAgdGlsZXMgYnkgPGEgaHJlZj1cImh0dHA6Ly9zdGFtZW4uY29tXCI+U3RhbWVuIERlc2lnbjwvYT4sXG4gPGEgaHJlZj1cImh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL2J5LzMuMFwiPkNDIEJZIDMuMDwvYT4gJm1kYXNoOyBNYXAgZGF0YSAmY29weTtcbiAgPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm9wZW5zdHJlZXRtYXAub3JnL2NvcHlyaWdodFwiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9yc2AsXG4gICAgICBzdWJkb21haW5zOiAnYWJjZCdcbiAgICB9LFxuICAgIFRPTkVSX0xJVEU6IHtcbiAgICAgIGxpbms6ICdodHRwczovL3N0YW1lbi10aWxlcy17c30uYS5zc2wuZmFzdGx5Lm5ldC90b25lci1saXRlL3t6fS97eH0ve3l9e3J9LnBuZycsXG4gICAgICBhdHRyaWJ1dGlvbjogYE1hcCB0aWxlcyBieSA8YSBocmVmPVwiaHR0cDovL3N0YW1lbi5jb21cIj5TdGFtZW4gRGVzaWduPC9hPixcbiA8YSBocmVmPVwiaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbGljZW5zZXMvYnkvMy4wXCI+Q0MgQlkgMy4wPC9hPiAmbWRhc2g7IE1hcCBkYXRhICZjb3B5O1xuICA8YSBocmVmPVwiaHR0cHM6Ly93d3cub3BlbnN0cmVldG1hcC5vcmcvY29weXJpZ2h0XCI+T3BlblN0cmVldE1hcDwvYT4gY29udHJpYnV0b3JzYCxcbiAgICAgIHN1YmRvbWFpbnM6ICdhYmNkJyxcbiAgICB9LFxuICAgIFRFUlJBSU46IHtcbiAgICAgIGxpbms6ICdodHRwczovL3N0YW1lbi10aWxlcy17c30uYS5zc2wuZmFzdGx5Lm5ldC90ZXJyYWluL3t6fS97eH0ve3l9e3J9LnBuZycsXG4gICAgICBhdHRyaWJ1dGlvbjogYE1hcCB0aWxlcyBieSA8YSBocmVmPVwiaHR0cDovL3N0YW1lbi5jb21cIj5TdGFtZW4gRGVzaWduPC9hPixcbiA8YSBocmVmPVwiaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbGljZW5zZXMvYnkvMy4wXCI+Q0MgQlkgMy4wPC9hPiAmbWRhc2g7IE1hcCBkYXRhICZjb3B5O1xuIDxhIGhyZWY9XCJodHRwczovL3d3dy5vcGVuc3RyZWV0bWFwLm9yZy9jb3B5cmlnaHRcIj5PcGVuU3RyZWV0TWFwPC9hPiBjb250cmlidXRvcnNgLFxuICAgICAgc3ViZG9tYWluczogJ2FiY2QnLFxuICAgIH0sXG4gICAgRVNSSToge1xuICAgICAgbGluazogJ2h0dHBzOi8vc2VydmVyLmFyY2dpc29ubGluZS5jb20vQXJjR0lTL3Jlc3Qvc2VydmljZXMvV29ybGRfU3RyZWV0X01hcC9NYXBTZXJ2ZXIvdGlsZS97en0ve3l9L3t4fScsXG4gICAgICBhdHRyaWJ1dGlvbjogYFRpbGVzICZjb3B5OyBFc3JpICZtZGFzaDsgU291cmNlOiBFc3JpLCBEZUxvcm1lLCBOQVZURVEsIFVTR1MsIEludGVybWFwLCBpUEMsIE5SQ0FOLCBFc3JpIEphcGFuLFxuIE1FVEksIEVzcmkgQ2hpbmEgKEhvbmcgS29uZyksIEVzcmkgKFRoYWlsYW5kKSwgVG9tVG9tLCAyMDEyYFxuICAgIH0sXG4gICAgU0FURUxMSVRFOiB7XG4gICAgICBsaW5rOiAnaHR0cHM6Ly9zZXJ2ZXIuYXJjZ2lzb25saW5lLmNvbS9BcmNHSVMvcmVzdC9zZXJ2aWNlcy9Xb3JsZF9JbWFnZXJ5L01hcFNlcnZlci90aWxlL3t6fS97eX0ve3h9JyxcbiAgICAgIGF0dHJpYnV0aW9uOiBgVGlsZXMgJmNvcHk7IEVzcmkgJm1kYXNoOyBTb3VyY2U6IEVzcmksIGktY3ViZWQsIFVTREEsIFVTR1MsIEFFWCwgR2VvRXllLCBHZXRtYXBwaW5nLCBBZXJvZ3JpZCwgSUdOLFxuIElHUCwgVVBSLUVHUCwgYW5kIHRoZSBHSVMgVXNlciBDb21tdW5pdHlgXG4gICAgfSxcbiAgICBPQ0VBTlM6IHtcbiAgICAgIGxpbms6ICdodHRwczovL3NlcnZlci5hcmNnaXNvbmxpbmUuY29tL0FyY0dJUy9yZXN0L3NlcnZpY2VzL09jZWFuX0Jhc2VtYXAvTWFwU2VydmVyL3RpbGUve3p9L3t5fS97eH0nLFxuICAgICAgYXR0cmlidXRpb246ICdUaWxlcyAmY29weTsgRXNyaSAmbWRhc2g7IFNvdXJjZXM6IEdFQkNPLCBOT0FBLCBDSFMsIE9TVSwgVU5ILCBDU1VNQiwgTmF0aW9uYWwgR2VvZ3JhcGhpYywgRGVMb3JtZSwgTkFWVEVRLCBhbmQgRXNyaScsXG4gICAgfSxcbiAgICBHUkFZOiB7XG4gICAgICBsaW5rOiAnaHR0cHM6Ly9zZXJ2ZXIuYXJjZ2lzb25saW5lLmNvbS9BcmNHSVMvcmVzdC9zZXJ2aWNlcy9DYW52YXMvV29ybGRfTGlnaHRfR3JheV9CYXNlL01hcFNlcnZlci90aWxlL3t6fS97eX0ve3h9JyxcbiAgICAgIGF0dGliczogJydcbiAgICB9LFxuICAgIEdSQVlTQ0FMRToge1xuICAgICAgbGluazogJ2h0dHBzOi8vc2VydmVyLmFyY2dpc29ubGluZS5jb20vQXJjR0lTL3Jlc3Qvc2VydmljZXMvQ2FudmFzL1dvcmxkX0xpZ2h0X0dyYXlfQmFzZS9NYXBTZXJ2ZXIvdGlsZS97en0ve3l9L3t4fScsXG4gICAgICBhdHRyaWJ1dGlvbjogJ1RpbGVzICZjb3B5OyBFc3JpICZtZGFzaDsgRXNyaSwgRGVMb3JtZSwgTkFWVEVRJyxcbiAgICB9LFxuICAgIFdBVEVSQ09MT1I6IHtcbiAgICAgIGxpbms6ICdodHRwczovL3N0YW1lbi10aWxlcy17c30uYS5zc2wuZmFzdGx5Lm5ldC93YXRlcmNvbG9yL3t6fS97eH0ve3l9LmpwZycsXG4gICAgICBhdHRyaWJ1dGlvbjogYE1hcCB0aWxlcyBieSA8YSBocmVmPVwiaHR0cDovL3N0YW1lbi5jb21cIj5TdGFtZW4gRGVzaWduPC9hPixcbiA8YSBocmVmPVwiaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbGljZW5zZXMvYnkvMy4wXCI+Q0MgQlkgMy4wPC9hPiAmbWRhc2g7IE1hcCBkYXRhICZjb3B5O1xuICA8YSBocmVmPVwiaHR0cHM6Ly93d3cub3BlbnN0cmVldG1hcC5vcmcvY29weXJpZ2h0XCI+T3BlblN0cmVldE1hcDwvYT4gY29udHJpYnV0b3JzYCxcbiAgICAgIHN1YmRvbWFpbnM6ICdhYmNkJyxcbiAgICB9LFxuICAgIENBUlRPREI6IHtcbiAgICAgIGxpbms6ICdodHRwczovL3tzfS5iYXNlbWFwcy5jYXJ0b2Nkbi5jb20vbGlnaHRfYWxsL3t6fS97eH0ve3l9e3J9LnBuZycsXG4gICAgICBhdHRyaWJ1dGlvbjogYCZjb3B5OyA8YSBocmVmPVwiaHR0cHM6Ly93d3cub3BlbnN0cmVldG1hcC5vcmcvY29weXJpZ2h0XCI+T3BlblN0cmVldE1hcDwvYT4gY29udHJpYnV0b3JzICZjb3B5O1xuIDxhIGhyZWY9XCJodHRwczovL2NhcnRvLmNvbS9hdHRyaWJ1dGlvbnNcIj5DYXJ0b0RCPC9hPmAsXG4gICAgICBzdWJkb21haW5zOiAnYWJjZCcsXG4gICAgfSxcbiAgICBDQVJUT0RCX0RBUks6IHtcbiAgICAgIGxpbms6ICdodHRwczovL2NhcnRvZGItYmFzZW1hcHMte3N9Lmdsb2JhbC5zc2wuZmFzdGx5Lm5ldC9kYXJrX2FsbC97en0ve3h9L3t5fS5wbmcnLFxuICAgICAgYXR0cmlidXRpb246IGAmY29weTsgPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm9wZW5zdHJlZXRtYXAub3JnL2NvcHlyaWdodFwiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9ycyAmY29weTtcbiA8YSBocmVmPVwiaHR0cHM6Ly9jYXJ0by5jb20vYXR0cmlidXRpb25zXCI+Q2FydG9EQjwvYT5gLFxuICAgICAgc3ViZG9tYWluczogJ2FiY2QnLFxuICAgIH0sXG4gIH07XG5cbiAgc3RhdGljIHRvTGVhZmxldE1hcFBhdGhzKGRhdGE6IHsgZ3RzOiBhbnlbXTsgcGFyYW1zOiBhbnlbXSB9LCBoaWRkZW5EYXRhOiBudW1iZXJbXSwgZGl2aWRlcjogbnVtYmVyID0gMTAwMCwgc2NoZW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBwYXRocyA9IFtdO1xuICAgIGNvbnN0IHNpemUgPSAoZGF0YS5ndHMgfHwgW10pLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgY29uc3QgZ3RzID0gZGF0YS5ndHNbaV07XG4gICAgICBpZiAoR1RTTGliLmlzR3RzVG9QbG90T25NYXAoZ3RzKSAmJiAoaGlkZGVuRGF0YSB8fCBbXSkuZmlsdGVyKGlkID0+IGlkID09PSBndHMuaWQpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBjb25zdCBwYXRoOiBhbnkgPSB7fTtcbiAgICAgICAgcGF0aC5wYXRoID0gTWFwTGliLmd0c1RvUGF0aChndHMsIGRpdmlkZXIpO1xuICAgICAgICBpZiAoZGF0YS5wYXJhbXMgJiYgZGF0YS5wYXJhbXNbaV0gJiYgZGF0YS5wYXJhbXNbaV0ua2V5KSB7XG4gICAgICAgICAgcGF0aC5rZXkgPSBkYXRhLnBhcmFtc1tpXS5rZXk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGF0aC5rZXkgPSBHVFNMaWIuc2VyaWFsaXplR3RzTWV0YWRhdGEoZ3RzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGF0YS5wYXJhbXMgJiYgZGF0YS5wYXJhbXNbaV0gJiYgZGF0YS5wYXJhbXNbaV0uY29sb3IpIHtcbiAgICAgICAgICBwYXRoLmNvbG9yID0gZGF0YS5wYXJhbXNbaV0uY29sb3I7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGF0aC5jb2xvciA9IENvbG9yTGliLmdldENvbG9yKGksIHNjaGVtZSk7XG4gICAgICAgIH1cbiAgICAgICAgcGF0aHMucHVzaChwYXRoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHBhdGhzO1xuICB9XG5cbiAgc3RhdGljIGd0c1RvUGF0aChndHMsIGRpdmlkZXI6IG51bWJlciA9IDEwMDApIHtcbiAgICBjb25zdCBwYXRoID0gW107XG4gICAgY29uc3Qgc2l6ZSA9IChndHMudiB8fCBbXSkubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICBjb25zdCB2ID0gZ3RzLnZbaV07XG4gICAgICBjb25zdCBsID0gdi5sZW5ndGg7XG4gICAgICBpZiAobCA+PSA0KSB7XG4gICAgICAgIC8vIHRpbWVzdGFtcCwgbGF0LCBsb24sIGVsZXY/LCB2YWx1ZVxuICAgICAgICBwYXRoLnB1c2goe3RzOiBNYXRoLmZsb29yKHZbMF0gLyBkaXZpZGVyKSwgbGF0OiB2WzFdLCBsb246IHZbMl0sIHZhbDogdltsIC0gMV19KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHBhdGg7XG4gIH1cblxuICBzdGF0aWMgYW5ub3RhdGlvbnNUb0xlYWZsZXRQb3NpdGlvbnMoZGF0YTogeyBndHM6IGFueVtdOyBwYXJhbXM6IGFueVtdIH0sIGhpZGRlbkRhdGE6IG51bWJlcltdLCBkaXZpZGVyOiBudW1iZXIgPSAxMDAwLCBzY2hlbWU6IHN0cmluZykge1xuICAgIGNvbnN0IGFubm90YXRpb25zID0gW107XG4gICAgY29uc3Qgc2l6ZSA9IChkYXRhLmd0cyB8fCBbXSkubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICBjb25zdCBndHMgPSBkYXRhLmd0c1tpXTtcbiAgICAgIGlmIChHVFNMaWIuaXNHdHNUb0Fubm90YXRlKGd0cykgJiYgKGhpZGRlbkRhdGEgfHwgW10pLmZpbHRlcihpZCA9PiBpZCA9PT0gZ3RzLmlkKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhpcy5MT0cuZGVidWcoWydhbm5vdGF0aW9uc1RvTGVhZmxldFBvc2l0aW9ucyddLCBndHMpO1xuICAgICAgICBjb25zdCBhbm5vdGF0aW9uOiBhbnkgPSB7fTtcbiAgICAgICAgbGV0IHBhcmFtcyA9IChkYXRhLnBhcmFtcyB8fCBbXSlbaV07XG4gICAgICAgIGlmICghcGFyYW1zKSB7XG4gICAgICAgICAgcGFyYW1zID0ge307XG4gICAgICAgIH1cbiAgICAgICAgYW5ub3RhdGlvbi5wYXRoID0gTWFwTGliLmd0c1RvUGF0aChndHMsIGRpdmlkZXIpO1xuICAgICAgICBNYXBMaWIuZXh0cmFjdENvbW1vblBhcmFtZXRlcnMoYW5ub3RhdGlvbiwgcGFyYW1zLCBpLCBzY2hlbWUpO1xuICAgICAgICBpZiAocGFyYW1zLnJlbmRlcikge1xuICAgICAgICAgIGFubm90YXRpb24ucmVuZGVyID0gcGFyYW1zLnJlbmRlcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYW5ub3RhdGlvbi5yZW5kZXIgPT09ICdtYXJrZXInKSB7XG4gICAgICAgICAgYW5ub3RhdGlvbi5tYXJrZXIgPSAoZGF0YS5wYXJhbXMgJiYgZGF0YS5wYXJhbXNbaV0pID8gZGF0YS5wYXJhbXNbaV0ubWFya2VyIDogJ2NpcmNsZSc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFubm90YXRpb24ucmVuZGVyID09PSAnd2VpZ2h0ZWREb3RzJykge1xuICAgICAgICAgIE1hcExpYi52YWxpZGF0ZVdlaWdodGVkRG90c1Bvc2l0aW9uQXJyYXkoYW5ub3RhdGlvbiwgcGFyYW1zKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2Fubm90YXRpb25zVG9MZWFmbGV0UG9zaXRpb25zJywgJ2Fubm90YXRpb25zJ10sIGFubm90YXRpb24pO1xuICAgICAgICBhbm5vdGF0aW9ucy5wdXNoKGFubm90YXRpb24pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYW5ub3RhdGlvbnM7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBleHRyYWN0Q29tbW9uUGFyYW1ldGVycyhvYmosIHBhcmFtcywgaW5kZXgsIHNjaGVtZTogc3RyaW5nKSB7XG4gICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuICAgIG9iai5rZXkgPSBwYXJhbXMua2V5IHx8ICcnO1xuICAgIG9iai5jb2xvciA9IHBhcmFtcy5jb2xvciB8fCBDb2xvckxpYi5nZXRDb2xvcihpbmRleCwgc2NoZW1lKTtcbiAgICBvYmouYm9yZGVyQ29sb3IgPSBwYXJhbXMuYm9yZGVyQ29sb3IgfHwgJyMwMDAnO1xuICAgIG9iai5wcm9wZXJ0aWVzID0gcGFyYW1zLnByb3BlcnRpZXMgfHwge307XG4gICAgaWYgKHBhcmFtcy5iYXNlUmFkaXVzID09PSB1bmRlZmluZWRcbiAgICAgIHx8IGlzTmFOKHBhcnNlSW50KHBhcmFtcy5iYXNlUmFkaXVzLCAxMCkpXG4gICAgICB8fCBwYXJzZUludChwYXJhbXMuYmFzZVJhZGl1cywgMTApIDwgMCkge1xuICAgICAgb2JqLmJhc2VSYWRpdXMgPSBNYXBMaWIuQkFTRV9SQURJVVM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9iai5iYXNlUmFkaXVzID0gcGFyYW1zLmJhc2VSYWRpdXM7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgdmFsaWRhdGVXZWlnaHRlZERvdHNQb3NpdGlvbkFycmF5KHBvc0FycmF5LCBwYXJhbXMpIHtcbiAgICBpZiAocGFyYW1zLm1pblZhbHVlID09PSB1bmRlZmluZWQgfHwgcGFyYW1zLm1heFZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIE1hcExpYi5MT0cuZXJyb3IoWyd2YWxpZGF0ZVdlaWdodGVkRG90c1Bvc2l0aW9uQXJyYXknXSwgJ1doZW4gdXNpbmcgXFwnd2VpZ2h0ZWREb3RzXFwnIG9yICcgK1xuICAgICAgICAnXFwnd2VpZ2h0ZWRDb2xvcmVkRG90c1xcJyByZW5kZXJpbmcsIFxcJ21heFZhbHVlXFwnIGFuZCBcXCdtaW5WYWx1ZVxcJyBwYXJhbWV0ZXJzIGFyZSBjb21wdWxzb3J5Jyk7XG4gICAgICBwb3NBcnJheS5yZW5kZXIgPSB1bmRlZmluZWQ7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHBvc0FycmF5Lm1heFZhbHVlID0gcGFyYW1zLm1heFZhbHVlO1xuICAgIHBvc0FycmF5Lm1pblZhbHVlID0gcGFyYW1zLm1pblZhbHVlO1xuICAgIGlmICh0eXBlb2YgcG9zQXJyYXkubWluVmFsdWUgIT09ICdudW1iZXInIHx8XG4gICAgICB0eXBlb2YgcG9zQXJyYXkubWF4VmFsdWUgIT09ICdudW1iZXInIHx8XG4gICAgICBwb3NBcnJheS5taW5WYWx1ZSA+PSBwb3NBcnJheS5tYXhWYWx1ZSkge1xuICAgICAgTWFwTGliLkxPRy5lcnJvcihbJ3ZhbGlkYXRlV2VpZ2h0ZWREb3RzUG9zaXRpb25BcnJheSddLCAnV2hlbiB1c2luZyBcXCd3ZWlnaHRlZERvdHNcXCcgb3IgJyArXG4gICAgICAgICdcXCd3ZWlnaHRlZENvbG9yZWREb3RzXFwnIHJlbmRlcmluZywgXFwnbWF4VmFsdWVcXCcgYW5kIFxcJ21pblZhbHVlXFwnIG11c3QgYmUgbnVtYmVycyBhbmQgXFwnbWF4VmFsdWVcXCcgJyArXG4gICAgICAgICdtdXN0IGJlIGdyZWF0ZXIgdGhhbiBcXCdtaW5WYWx1ZVxcJycpO1xuICAgICAgcG9zQXJyYXkucmVuZGVyID0gdW5kZWZpbmVkO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIUdUU0xpYi5pc1Bvc2l0aW9uc0FycmF5V2l0aFZhbHVlcyhwb3NBcnJheSkgJiYgIUdUU0xpYi5pc1Bvc2l0aW9uc0FycmF5V2l0aFR3b1ZhbHVlcyhwb3NBcnJheSkpIHtcbiAgICAgIE1hcExpYi5MT0cuZXJyb3IoWyd2YWxpZGF0ZVdlaWdodGVkRG90c1Bvc2l0aW9uQXJyYXknXSwgJ1doZW4gdXNpbmcgXFwnd2VpZ2h0ZWREb3RzXFwnIG9yICcgK1xuICAgICAgICAnXFwnd2VpZ2h0ZWRDb2xvcmVkRG90c1xcJyByZW5kZXJpbmcsIHBvc2l0aW9ucyBtdXN0IGhhdmUgYW4gYXNzb2NpYXRlZCB2YWx1ZScpO1xuICAgICAgcG9zQXJyYXkucmVuZGVyID0gdW5kZWZpbmVkO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChwYXJhbXMubnVtU3RlcHMgPT09IHVuZGVmaW5lZCB8fCBpc05hTihwYXJzZUludChwYXJhbXMubnVtU3RlcHMsIDEwKSkgfHwgcGFyc2VJbnQocGFyYW1zLm51bVN0ZXBzLCAxMCkgPCAwKSB7XG4gICAgICBwb3NBcnJheS5udW1TdGVwcyA9IDU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBvc0FycmF5Lm51bVN0ZXBzID0gcGFyYW1zLm51bVN0ZXBzO1xuICAgIH1cbiAgICBjb25zdCBzdGVwID0gKHBvc0FycmF5Lm1heFZhbHVlIC0gcG9zQXJyYXkubWluVmFsdWUpIC8gcG9zQXJyYXkubnVtU3RlcHM7XG4gICAgY29uc3Qgc3RlcHMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvc0FycmF5Lm51bVN0ZXBzIC0gMTsgaSsrKSB7XG4gICAgICBzdGVwc1tpXSA9IHBvc0FycmF5Lm1pblZhbHVlICsgKGkgKyAxKSAqIHN0ZXA7XG4gICAgfVxuICAgIHN0ZXBzW3Bvc0FycmF5Lm51bVN0ZXBzIC0gMV0gPSBwb3NBcnJheS5tYXhWYWx1ZTtcblxuICAgIGNvbnN0IHNpemUgPSAocG9zQXJyYXkgfHwgW10pLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgY29uc3QgcG9zID0gcG9zQXJyYXlbaV07XG4gICAgICBjb25zdCB2YWx1ZSA9IHBvc1syXTtcbiAgICAgIHBvc1s0XSA9IHBvc0FycmF5Lm51bVN0ZXBzIC0gMTtcbiAgICAgIGZvciAoY29uc3QgayBpbiBzdGVwcykge1xuICAgICAgICBpZiAodmFsdWUgPD0gc3RlcHNba10pIHtcbiAgICAgICAgICBwb3NbNF0gPSBrO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgc3RhdGljIHRvTGVhZmxldE1hcFBvc2l0aW9uQXJyYXkoZGF0YTogeyBndHM6IGFueVtdOyBwYXJhbXM6IGFueVtdIH0sIGhpZGRlbkRhdGE6IG51bWJlcltdLCBzY2hlbWU6IHN0cmluZykge1xuICAgIGNvbnN0IHBvc2l0aW9ucyA9IFtdO1xuICAgIGNvbnN0IHNpemUgPSAoZGF0YS5ndHMgfHwgW10pLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgY29uc3QgZ3RzID0gZGF0YS5ndHNbaV07XG4gICAgICBpZiAoR1RTTGliLmlzUG9zaXRpb25BcnJheShndHMpICYmIChoaWRkZW5EYXRhIHx8IFtdKS5maWx0ZXIoaWQgPT4gaWQgPT09IGd0cy5pZCkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRoaXMuTE9HLmRlYnVnKFsndG9MZWFmbGV0TWFwUG9zaXRpb25BcnJheSddLCBndHMsIGRhdGEucGFyYW1zW2ldKTtcbiAgICAgICAgY29uc3QgcG9zQXJyYXkgPSBndHM7XG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IGRhdGEucGFyYW1zW2ldIHx8IHt9O1xuICAgICAgICBNYXBMaWIuZXh0cmFjdENvbW1vblBhcmFtZXRlcnMocG9zQXJyYXksIHBhcmFtcywgaSwgc2NoZW1lKTtcbiAgICAgICAgaWYgKHBhcmFtcy5yZW5kZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHBvc0FycmF5LnJlbmRlciA9IHBhcmFtcy5yZW5kZXI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvc0FycmF5LnJlbmRlciA9PT0gJ3dlaWdodGVkRG90cycpIHtcbiAgICAgICAgICBNYXBMaWIudmFsaWRhdGVXZWlnaHRlZERvdHNQb3NpdGlvbkFycmF5KHBvc0FycmF5LCBwYXJhbXMpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwb3NBcnJheS5yZW5kZXIgPT09ICdjb2xvcmVkV2VpZ2h0ZWREb3RzJykge1xuICAgICAgICAgIE1hcExpYi52YWxpZGF0ZVdlaWdodGVkQ29sb3JlZERvdHNQb3NpdGlvbkFycmF5KHBvc0FycmF5LCBwYXJhbXMpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwb3NBcnJheS5yZW5kZXIgPT09ICdtYXJrZXInKSB7XG4gICAgICAgICAgcG9zQXJyYXkubWFya2VyID0gcGFyYW1zLm1hcmtlcjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3RvTGVhZmxldE1hcFBvc2l0aW9uQXJyYXknLCAncG9zQXJyYXknXSwgcG9zQXJyYXkpO1xuICAgICAgICBwb3NpdGlvbnMucHVzaChwb3NBcnJheSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwb3NpdGlvbnM7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyB2YWxpZGF0ZVdlaWdodGVkQ29sb3JlZERvdHNQb3NpdGlvbkFycmF5KHBvc0FycmF5OiBhbnksIHBhcmFtczogYW55KSB7XG4gICAgaWYgKCFNYXBMaWIudmFsaWRhdGVXZWlnaHRlZERvdHNQb3NpdGlvbkFycmF5KHBvc0FycmF5LCBwYXJhbXMpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChwYXJhbXMubWluQ29sb3JWYWx1ZSA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICBwYXJhbXMubWF4Q29sb3JWYWx1ZSA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICBwYXJhbXMuc3RhcnRDb2xvciA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICBwYXJhbXMuZW5kQ29sb3IgPT09IHVuZGVmaW5lZCkge1xuICAgICAgTWFwTGliLkxPRy5lcnJvcihbJ3ZhbGlkYXRlV2VpZ2h0ZWRDb2xvcmVkRG90c1Bvc2l0aW9uQXJyYXknXSwgJ1doZW4gdXNpbmcgJyArXG4gICAgICAgICdcXCd3ZWlnaHRlZENvbG9yZWREb3RzXFwnIHJlbmRlcmluZywgXFwnbWF4Q29sb3JWYWx1ZVxcJywgXFwnbWluQ29sb3JWYWx1ZVxcJywgXFwnc3RhcnRDb2xvclxcJyAnICtcbiAgICAgICAgJ2FuZCBcXCdlbmRDb2xvclxcJyBwYXJhbWV0ZXJzIGFyZSBjb21wdWxzb3J5Jyk7XG4gICAgICBwb3NBcnJheS5yZW5kZXIgPSB1bmRlZmluZWQ7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcG9zQXJyYXkubWF4Q29sb3JWYWx1ZSA9IHBhcmFtcy5tYXhDb2xvclZhbHVlO1xuICAgIHBvc0FycmF5Lm1pbkNvbG9yVmFsdWUgPSBwYXJhbXMubWluQ29sb3JWYWx1ZTtcblxuICAgIGlmICh0eXBlb2YgcG9zQXJyYXkubWluQ29sb3JWYWx1ZSAhPT0gJ251bWJlcicgfHxcbiAgICAgIHR5cGVvZiBwb3NBcnJheS5tYXhDb2xvclZhbHVlICE9PSAnbnVtYmVyJyB8fFxuICAgICAgcG9zQXJyYXkubWluQ29sb3JWYWx1ZSA+PSBwb3NBcnJheS5tYXhDb2xvclZhbHVlKSB7XG4gICAgICBNYXBMaWIuTE9HLmVycm9yKFsndmFsaWRhdGVXZWlnaHRlZENvbG9yZWREb3RzUG9zaXRpb25BcnJheSddLCBbJ1doZW4gdXNpbmcgJyArXG4gICAgICAnd2VpZ2h0ZWRDb2xvcmVkRG90c1xcJyByZW5kZXJpbmcsIFxcJ21heENvbG9yVmFsdWVcXCcgYW5kIFxcJ21pbkNvbG9yVmFsdWVcXCcgbXVzdCBiZSBudW1iZXJzICcgK1xuICAgICAgJ2FuZCBcXCdtYXhDb2xvclZhbHVlXFwnIG11c3QgYmUgZ3JlYXRlciB0aGFuIFxcJ21pbkNvbG9yVmFsdWVcXCcnLCB7XG4gICAgICAgIG1heENvbG9yVmFsdWU6IHBvc0FycmF5Lm1heENvbG9yVmFsdWUsXG4gICAgICAgIG1pbkNvbG9yVmFsdWU6IHBvc0FycmF5Lm1pbkNvbG9yVmFsdWUsXG4gICAgICB9XSk7XG4gICAgICBwb3NBcnJheS5yZW5kZXIgPSB1bmRlZmluZWQ7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHJlID0gL14jKD86WzAtOWEtZl17M30pezEsMn0kL2k7XG4gICAgaWYgKHR5cGVvZiBwYXJhbXMuc3RhcnRDb2xvciAhPT0gJ3N0cmluZydcbiAgICAgIHx8IHR5cGVvZiBwYXJhbXMuZW5kQ29sb3IgIT09ICdzdHJpbmcnXG4gICAgICB8fCAhcmUudGVzdChwYXJhbXMuc3RhcnRDb2xvcilcbiAgICAgIHx8ICFyZS50ZXN0KHBhcmFtcy5lbmRDb2xvcikpIHtcbiAgICAgIE1hcExpYi5MT0cuZXJyb3IoWyd2YWxpZGF0ZVdlaWdodGVkQ29sb3JlZERvdHNQb3NpdGlvbkFycmF5J10sIFsnV2hlbiB1c2luZyAnICtcbiAgICAgICd3ZWlnaHRlZENvbG9yZWREb3RzXFwnIHJlbmRlcmluZywgXFwnc3RhcnRDb2xvclxcJyBhbmQgXFwnZW5kQ29sb3JcXCcgcGFyYW1ldGVycyBtdXN0IGJlIFJHQiAnICtcbiAgICAgICdjb2xvcnMgaW4gI3JyZ2diYiBmb3JtYXQnLCB7XG4gICAgICAgIHN0YXJ0Q29sb3I6IHBhcmFtcy5zdGFydENvbG9yLFxuICAgICAgICBlbmRDb2xvcjogcGFyYW1zLmVuZENvbG9yLFxuICAgICAgICB0ZXN0czogW1xuICAgICAgICAgIHR5cGVvZiBwYXJhbXMuc3RhcnRDb2xvcixcbiAgICAgICAgICB0eXBlb2YgcGFyYW1zLmVuZENvbG9yLFxuICAgICAgICAgIHJlLnRlc3QocGFyYW1zLnN0YXJ0Q29sb3IpLFxuICAgICAgICAgIHJlLnRlc3QocGFyYW1zLmVuZENvbG9yKSxcbiAgICAgICAgICByZS50ZXN0KHBhcmFtcy5zdGFydENvbG9yKSxcbiAgICAgICAgXSxcbiAgICAgIH1dKTtcbiAgICAgIHBvc0FycmF5LnJlbmRlciA9IHVuZGVmaW5lZDtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBwb3NBcnJheS5zdGFydENvbG9yID0ge1xuICAgICAgcjogcGFyc2VJbnQocGFyYW1zLnN0YXJ0Q29sb3Iuc3Vic3RyaW5nKDEsIDMpLCAxNiksXG4gICAgICBnOiBwYXJzZUludChwYXJhbXMuc3RhcnRDb2xvci5zdWJzdHJpbmcoMywgNSksIDE2KSxcbiAgICAgIGI6IHBhcnNlSW50KHBhcmFtcy5zdGFydENvbG9yLnN1YnN0cmluZyg1LCA3KSwgMTYpLFxuICAgIH07XG5cbiAgICBwb3NBcnJheS5lbmRDb2xvciA9IHtcbiAgICAgIHI6IHBhcnNlSW50KHBhcmFtcy5lbmRDb2xvci5zdWJzdHJpbmcoMSwgMyksIDE2KSxcbiAgICAgIGc6IHBhcnNlSW50KHBhcmFtcy5lbmRDb2xvci5zdWJzdHJpbmcoMywgNSksIDE2KSxcbiAgICAgIGI6IHBhcnNlSW50KHBhcmFtcy5lbmRDb2xvci5zdWJzdHJpbmcoNSwgNyksIDE2KSxcbiAgICB9O1xuXG4gICAgaWYgKHBhcmFtcy5udW1Db2xvclN0ZXBzID09PSB1bmRlZmluZWQgfHxcbiAgICAgIGlzTmFOKHBhcnNlSW50KHBhcmFtcy5udW1Db2xvclN0ZXBzLCAxMCkpIHx8XG4gICAgICBwYXJzZUludChwYXJhbXMubnVtQ29sb3JTdGVwcywgMTApIDwgMCkge1xuICAgICAgcG9zQXJyYXkubnVtQ29sb3JTdGVwcyA9IDU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBvc0FycmF5Lm51bUNvbG9yU3RlcHMgPSBwYXJhbXMubnVtQ29sb3JTdGVwcztcbiAgICB9XG5cbiAgICBwb3NBcnJheS5jb2xvckdyYWRpZW50ID0gQ29sb3JMaWIuaHN2R3JhZGllbnRGcm9tUmdiQ29sb3JzKFxuICAgICAgcG9zQXJyYXkuc3RhcnRDb2xvcixcbiAgICAgIHBvc0FycmF5LmVuZENvbG9yLFxuICAgICAgcG9zQXJyYXkubnVtQ29sb3JTdGVwcyk7XG5cbiAgICBjb25zdCBzdGVwID0gKHBvc0FycmF5Lm1heENvbG9yVmFsdWUgLSBwb3NBcnJheS5taW5Db2xvclZhbHVlKSAvIHBvc0FycmF5Lm51bUNvbG9yU3RlcHM7XG4gICAgY29uc3Qgc3RlcHMgPSBbXTtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IHBvc0FycmF5Lm51bUNvbG9yU3RlcHM7IGorKykge1xuICAgICAgc3RlcHNbal0gPSBwb3NBcnJheS5taW5Db2xvclZhbHVlICsgKGogKyAxKSAqIHN0ZXA7XG4gICAgfVxuXG4gICAgcG9zQXJyYXkuc3RlcHMgPSBzdGVwcztcblxuICAgIHBvc0FycmF5LnBvc2l0aW9ucy5mb3JFYWNoKHBvcyA9PiB7XG4gICAgICBjb25zdCBjb2xvclZhbHVlID0gcG9zWzNdO1xuICAgICAgcG9zWzVdID0gcG9zQXJyYXkubnVtQ29sb3JTdGVwcyAtIDE7XG4gICAgICBmb3IgKGxldCBrID0gMDsgayA8IHN0ZXBzLmxlbmd0aCAtIDE7IGsrKykge1xuICAgICAgICBpZiAoY29sb3JWYWx1ZSA8IHN0ZXBzW2tdKSB7XG4gICAgICAgICAgcG9zWzVdID0gaztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIGdldEJvdW5kc0FycmF5KHBhdGhzLCBwb3NpdGlvbnNEYXRhLCBhbm5vdGF0aW9uc0RhdGEsIGdlb0pzb24pIHtcbiAgICBjb25zdCBwb2ludHNBcnJheSA9IFtdO1xuICAgIGxldCBzaXplO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZ2V0Qm91bmRzQXJyYXknLCAncGF0aHMnXSwgcGF0aHMpO1xuICAgIHNpemUgPSAocGF0aHMgfHwgW10pLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgY29uc3QgcGF0aCA9IHBhdGhzW2ldO1xuICAgICAgY29uc3QgcyA9IChwYXRoLnBhdGggfHwgW10pLmxlbmd0aDtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgczsgaisrKSB7XG4gICAgICAgIGNvbnN0IHAgPSBwYXRoLnBhdGhbal07XG4gICAgICAgIHBvaW50c0FycmF5LnB1c2goW3AubGF0LCBwLmxvbl0pO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2dldEJvdW5kc0FycmF5JywgJ3Bvc2l0aW9uc0RhdGEnXSwgcG9zaXRpb25zRGF0YSk7XG4gICAgc2l6ZSA9IChwb3NpdGlvbnNEYXRhIHx8IFtdKS5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gcG9zaXRpb25zRGF0YVtpXTtcbiAgICAgIGNvbnN0IHMgPSAocG9zaXRpb24ucG9zaXRpb25zIHx8IFtdKS5sZW5ndGg7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHM7IGorKykge1xuICAgICAgICBjb25zdCBwID0gcG9zaXRpb24ucG9zaXRpb25zW2pdO1xuICAgICAgICBwb2ludHNBcnJheS5wdXNoKFtwWzBdLCBwWzFdXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuTE9HLmRlYnVnKFsnZ2V0Qm91bmRzQXJyYXknLCAnYW5ub3RhdGlvbnNEYXRhJ10sIGFubm90YXRpb25zRGF0YSk7XG4gICAgc2l6ZSA9IChhbm5vdGF0aW9uc0RhdGEgfHwgW10pLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgY29uc3QgYW5ub3RhdGlvbiA9IGFubm90YXRpb25zRGF0YVtpXTtcbiAgICAgIGNvbnN0IHMgPSAoYW5ub3RhdGlvbi5wYXRoIHx8IFtdKS5sZW5ndGg7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHM7IGorKykge1xuICAgICAgICBjb25zdCBwID0gYW5ub3RhdGlvbi5wYXRoW2pdO1xuICAgICAgICBwb2ludHNBcnJheS5wdXNoKFtwLmxhdCwgcC5sb25dKTtcbiAgICAgIH1cbiAgICB9XG4gICAgc2l6ZSA9IChnZW9Kc29uIHx8IFtdKS5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIGNvbnN0IGcgPSBnZW9Kc29uW2ldO1xuICAgICAgc3dpdGNoIChnLmdlb21ldHJ5LnR5cGUpIHtcbiAgICAgICAgY2FzZSAnTXVsdGlQb2x5Z29uJzpcbiAgICAgICAgICBnLmdlb21ldHJ5LmNvb3JkaW5hdGVzLmZvckVhY2goYyA9PiBjLmZvckVhY2gobSA9PiBtLmZvckVhY2gocCA9PiBwb2ludHNBcnJheS5wdXNoKFtwWzFdLCBwWzBdXSkpKSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ1BvbHlnb24nOlxuICAgICAgICAgIGcuZ2VvbWV0cnkuY29vcmRpbmF0ZXMuZm9yRWFjaChjID0+IGMuZm9yRWFjaChwID0+IHBvaW50c0FycmF5LnB1c2goW3BbMV0sIHBbMF1dKSkpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdMaW5lU3RyaW5nJzpcbiAgICAgICAgICBnLmdlb21ldHJ5LmNvb3JkaW5hdGVzLmZvckVhY2gocCA9PiBwb2ludHNBcnJheS5wdXNoKFtwWzFdLCBwWzBdXSkpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdQb2ludCc6XG4gICAgICAgICAgcG9pbnRzQXJyYXkucHVzaChbZy5nZW9tZXRyeS5jb29yZGluYXRlc1sxXSwgZy5nZW9tZXRyeS5jb29yZGluYXRlc1swXV0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAocG9pbnRzQXJyYXkubGVuZ3RoID09PSAxKSB7XG4gICAgICByZXR1cm4gcG9pbnRzQXJyYXk7XG4gICAgfVxuICAgIGxldCBzb3V0aCA9IDkwO1xuICAgIGxldCB3ZXN0ID0gLTE4MDtcbiAgICBsZXQgbm9ydGggPSAtOTA7XG4gICAgbGV0IGVhc3QgPSAxODA7XG4gICAgdGhpcy5MT0cuZGVidWcoWydnZXRCb3VuZHNBcnJheSddLCBwb2ludHNBcnJheSk7XG4gICAgc2l6ZSA9IChwb2ludHNBcnJheSB8fCBbXSkubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICBjb25zdCBwb2ludCA9IHBvaW50c0FycmF5W2ldO1xuICAgICAgaWYgKHBvaW50WzBdID4gbm9ydGgpIHtcbiAgICAgICAgbm9ydGggPSBwb2ludFswXTtcbiAgICAgIH1cbiAgICAgIGlmIChwb2ludFswXSA8IHNvdXRoKSB7XG4gICAgICAgIHNvdXRoID0gcG9pbnRbMF07XG4gICAgICB9XG4gICAgICBpZiAocG9pbnRbMV0gPiB3ZXN0KSB7XG4gICAgICAgIHdlc3QgPSBwb2ludFsxXTtcbiAgICAgIH1cbiAgICAgIGlmIChwb2ludFsxXSA8IGVhc3QpIHtcbiAgICAgICAgZWFzdCA9IHBvaW50WzFdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gW1tzb3V0aCwgd2VzdF0sIFtub3J0aCwgZWFzdF1dO1xuICB9XG5cbiAgc3RhdGljIHBhdGhEYXRhVG9MZWFmbGV0KHBhdGhEYXRhLCBvcHRpb25zKSB7XG4gICAgY29uc3QgcGF0aCA9IFtdO1xuICAgIGNvbnN0IGZpcnN0SW5kZXggPSAoKG9wdGlvbnMgPT09IHVuZGVmaW5lZCkgfHxcbiAgICAgIChvcHRpb25zLmZyb20gPT09IHVuZGVmaW5lZCkgfHxcbiAgICAgIChvcHRpb25zLmZyb20gPCAwKSkgPyAwIDogb3B0aW9ucy5mcm9tO1xuICAgIGNvbnN0IGxhc3RJbmRleCA9ICgob3B0aW9ucyA9PT0gdW5kZWZpbmVkKSB8fCAob3B0aW9ucy50byA9PT0gdW5kZWZpbmVkKSB8fCAob3B0aW9ucy50byA+PSBwYXRoRGF0YS5sZW5ndGgpKSA/XG4gICAgICBwYXRoRGF0YS5sZW5ndGggLSAxIDogb3B0aW9ucy50bztcbiAgICBmb3IgKGxldCBpID0gZmlyc3RJbmRleDsgaSA8PSBsYXN0SW5kZXg7IGkrKykge1xuICAgICAgcGF0aC5wdXNoKFtwYXRoRGF0YVtpXS5sYXQsIHBhdGhEYXRhW2ldLmxvbl0pO1xuICAgIH1cbiAgICByZXR1cm4gcGF0aDtcbiAgfVxuXG4gIHN0YXRpYyB0b0dlb0pTT04oZGF0YTogeyBndHM6IGFueVtdOyBwYXJhbXM6IGFueVtdIH0pIHtcbiAgICBjb25zdCBkZWZTaGFwZXMgPSBbJ1BvaW50JywgJ0xpbmVTdHJpbmcnLCAnUG9seWdvbicsICdNdWx0aVBvbHlnb24nXTtcbiAgICBjb25zdCBnZW9Kc29ucyA9IFtdO1xuICAgIGRhdGEuZ3RzLmZvckVhY2goZCA9PiB7XG4gICAgICBpZiAoZC50eXBlICYmIGQudHlwZSA9PT0gJ0ZlYXR1cmUnICYmIGQuZ2VvbWV0cnkgJiYgZC5nZW9tZXRyeS50eXBlICYmIGRlZlNoYXBlcy5pbmRleE9mKGQuZ2VvbWV0cnkudHlwZSkgPiAtMSkge1xuICAgICAgICBnZW9Kc29ucy5wdXNoKGQpO1xuICAgICAgfSBlbHNlIGlmIChkLnR5cGUgJiYgZGVmU2hhcGVzLmluZGV4T2YoZC50eXBlKSA+IC0xKSB7XG4gICAgICAgIGdlb0pzb25zLnB1c2goe3R5cGU6ICdGZWF0dXJlJywgZ2VvbWV0cnk6IGR9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZ2VvSnNvbnM7XG4gIH1cbn1cbiJdfQ==