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
// @dynamic
var ColorLib = /** @class */ (function () {
    function ColorLib() {
    }
    /**
     * @param {?} i
     * @param {?} scheme
     * @return {?}
     */
    ColorLib.getColor = /**
     * @param {?} i
     * @param {?} scheme
     * @return {?}
     */
    function (i, scheme) {
        return ColorLib.color[scheme][i % ColorLib.color[scheme].length];
    };
    /**
     * @param {?} id
     * @param {?} scheme
     * @return {?}
     */
    ColorLib.getColorGradient = /**
     * @param {?} id
     * @param {?} scheme
     * @return {?}
     */
    function (id, scheme) {
        return [
            [0, ColorLib.transparentize(ColorLib.getColor(id, scheme), 0)],
            [1, ColorLib.transparentize(ColorLib.getColor(id, scheme), 0.7)]
        ];
    };
    /**
     * @param {?} id
     * @param {?} scheme
     * @param {?=} bg
     * @return {?}
     */
    ColorLib.getBlendedColorGradient = /**
     * @param {?} id
     * @param {?} scheme
     * @param {?=} bg
     * @return {?}
     */
    function (id, scheme, bg) {
        if (bg === void 0) { bg = '#000000'; }
        return [
            [0, ColorLib.blend_colors(bg, ColorLib.getColor(id, scheme), 0)],
            [1, ColorLib.blend_colors(bg, ColorLib.getColor(id, scheme), 1)]
        ];
    };
    /**
     * @param {?} scheme
     * @return {?}
     */
    ColorLib.getColorScale = /**
     * @param {?} scheme
     * @return {?}
     */
    function (scheme) {
        return ColorLib.color[scheme].map((/**
         * @param {?} c
         * @param {?} i
         * @return {?}
         */
        function (c, i) { return [i, c]; }));
    };
    /**
     * @param {?} hex
     * @return {?}
     */
    ColorLib.hexToRgb = /**
     * @param {?} hex
     * @return {?}
     */
    function (hex) {
        /** @type {?} */
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : null;
    };
    /**
     * @param {?} color
     * @param {?=} alpha
     * @return {?}
     */
    ColorLib.transparentize = /**
     * @param {?} color
     * @param {?=} alpha
     * @return {?}
     */
    function (color, alpha) {
        if (alpha === void 0) { alpha = 0.5; }
        return 'rgba(' + ColorLib.hexToRgb(color).concat(alpha).join(',') + ')';
    };
    /**
     * @param {?} num
     * @param {?} scheme
     * @return {?}
     */
    ColorLib.generateColors = /**
     * @param {?} num
     * @param {?} scheme
     * @return {?}
     */
    function (num, scheme) {
        /** @type {?} */
        var color = [];
        for (var i = 0; i < num; i++) {
            color.push(ColorLib.getColor(i, scheme));
        }
        return color;
    };
    /**
     * @param {?} num
     * @param {?} scheme
     * @return {?}
     */
    ColorLib.generateTransparentColors = /**
     * @param {?} num
     * @param {?} scheme
     * @return {?}
     */
    function (num, scheme) {
        /** @type {?} */
        var color = [];
        for (var i = 0; i < num; i++) {
            color.push(ColorLib.transparentize(ColorLib.getColor(i, scheme)));
        }
        return color;
    };
    /**
     * @param {?} c1
     * @param {?} c2
     * @param {?} steps
     * @return {?}
     */
    ColorLib.hsvGradientFromRgbColors = /**
     * @param {?} c1
     * @param {?} c2
     * @param {?} steps
     * @return {?}
     */
    function (c1, c2, steps) {
        /** @type {?} */
        var c1hsv = ColorLib.rgb2hsv(c1.r, c1.g, c1.b);
        /** @type {?} */
        var c2hsv = ColorLib.rgb2hsv(c2.r, c2.g, c2.b);
        c1.h = c1hsv[0];
        c1.s = c1hsv[1];
        c1.v = c1hsv[2];
        c2.h = c2hsv[0];
        c2.s = c2hsv[1];
        c2.v = c2hsv[2];
        /** @type {?} */
        var gradient = ColorLib.hsvGradient(c1, c2, steps);
        for (var i in gradient) {
            if (gradient[i]) {
                gradient[i].rgb = ColorLib.hsv2rgb(gradient[i].h, gradient[i].s, gradient[i].v);
                gradient[i].r = Math.floor(gradient[i].rgb[0]);
                gradient[i].g = Math.floor(gradient[i].rgb[1]);
                gradient[i].b = Math.floor(gradient[i].rgb[2]);
            }
        }
        return gradient;
    };
    /**
     * @private
     * @param {?} r
     * @param {?} g
     * @param {?} b
     * @return {?}
     */
    ColorLib.rgb2hsv = /**
     * @private
     * @param {?} r
     * @param {?} g
     * @param {?} b
     * @return {?}
     */
    function (r, g, b) {
        // Normalize
        /** @type {?} */
        var normR = r / 255.0;
        /** @type {?} */
        var normG = g / 255.0;
        /** @type {?} */
        var normB = b / 255.0;
        /** @type {?} */
        var M = Math.max(normR, normG, normB);
        /** @type {?} */
        var m = Math.min(normR, normG, normB);
        /** @type {?} */
        var d = M - m;
        /** @type {?} */
        var h;
        /** @type {?} */
        var s;
        /** @type {?} */
        var v;
        v = M;
        if (d === 0) {
            h = 0;
            s = 0;
        }
        else {
            s = d / v;
            switch (M) {
                case normR:
                    h = ((normG - normB) + d * (normG < normB ? 6 : 0)) / 6 * d;
                    break;
                case normG:
                    h = ((normB - normR) + d * 2) / 6 * d;
                    break;
                case normB:
                    h = ((normR - normG) + d * 4) / 6 * d;
                    break;
            }
        }
        return [h, s, v];
    };
    /**
     * @private
     * @param {?} c1
     * @param {?} c2
     * @param {?} steps
     * @return {?}
     */
    ColorLib.hsvGradient = /**
     * @private
     * @param {?} c1
     * @param {?} c2
     * @param {?} steps
     * @return {?}
     */
    function (c1, c2, steps) {
        /** @type {?} */
        var gradient = new Array(steps);
        // determine clockwise and counter-clockwise distance between hues
        /** @type {?} */
        var distCCW = (c1.h >= c2.h) ? c1.h - c2.h : 1 + c1.h - c2.h;
        /** @type {?} */
        var distCW = (c1.h >= c2.h) ? 1 + c2.h - c1.h : c2.h - c1.h;
        // make gradient for this part
        for (var i = 0; i < steps; i++) {
            // interpolate h, s, b
            /** @type {?} */
            var h = (distCW <= distCCW) ? c1.h + (distCW * i / (steps - 1)) : c1.h - (distCCW * i / (steps - 1));
            if (h < 0) {
                h = 1 + h;
            }
            if (h > 1) {
                h = h - 1;
            }
            /** @type {?} */
            var s = (1 - i / (steps - 1)) * c1.s + i / (steps - 1) * c2.s;
            /** @type {?} */
            var v = (1 - i / (steps - 1)) * c1.v + i / (steps - 1) * c2.v;
            // add to gradient array
            gradient[i] = { h: h, s: s, v: v };
        }
        return gradient;
    };
    /**
     * @private
     * @param {?} h
     * @param {?} s
     * @param {?} v
     * @return {?}
     */
    ColorLib.hsv2rgb = /**
     * @private
     * @param {?} h
     * @param {?} s
     * @param {?} v
     * @return {?}
     */
    function (h, s, v) {
        /** @type {?} */
        var r;
        /** @type {?} */
        var g;
        /** @type {?} */
        var b;
        /** @type {?} */
        var i = Math.floor(h * 6);
        /** @type {?} */
        var f = h * 6 - i;
        /** @type {?} */
        var p = v * (1 - s);
        /** @type {?} */
        var q = v * (1 - f * s);
        /** @type {?} */
        var t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0:
                r = v;
                g = t;
                b = p;
                break;
            case 1:
                r = q;
                g = v;
                b = p;
                break;
            case 2:
                r = p;
                g = v;
                b = t;
                break;
            case 3:
                r = p;
                g = q;
                b = v;
                break;
            case 4:
                r = t;
                g = p;
                b = v;
                break;
            case 5:
                r = v;
                g = p;
                b = q;
                break;
        }
        return [r * 255, g * 255, b * 255];
    };
    /**
     * @param {?} r
     * @param {?} g
     * @param {?} b
     * @return {?}
     */
    ColorLib.rgb2hex = /**
     * @param {?} r
     * @param {?} g
     * @param {?} b
     * @return {?}
     */
    function (r, g, b) {
        /**
         * @param {?} c
         * @return {?}
         */
        function componentToHex(c) {
            /** @type {?} */
            var hex = c.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }
        return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
    };
    /**
     * @param {?} color1
     * @param {?} color2
     * @param {?} percentage
     * @return {?}
     */
    ColorLib.blend_colors = /**
     * @param {?} color1
     * @param {?} color2
     * @param {?} percentage
     * @return {?}
     */
    function (color1, color2, percentage) {
        // check input
        color1 = color1 || '#000000';
        color2 = color2 || '#ffffff';
        percentage = percentage || 0.5;
        // 1: validate input, make sure we have provided a valid hex
        if (color1.length !== 4 && color1.length !== 7) {
            throw new Error('colors must be provided as hexes');
        }
        if (color2.length !== 4 && color2.length !== 7) {
            throw new Error('colors must be provided as hexes');
        }
        if (percentage > 1 || percentage < 0) {
            throw new Error('percentage must be between 0 and 1');
        }
        // 2: check to see if we need to convert 3 char hex to 6 char hex, else slice off hash
        //      the three character hex is just a representation of the 6 hex where each character is repeated
        //      ie: #060 => #006600 (green)
        if (color1.length === 4) {
            color1 = color1[1] + color1[1] + color1[2] + color1[2] + color1[3] + color1[3];
        }
        else {
            color1 = color1.substring(1);
        }
        if (color2.length === 4) {
            color2 = color2[1] + color2[1] + color2[2] + color2[2] + color2[3] + color2[3];
        }
        else {
            color2 = color2.substring(1);
        }
        console.log('valid: c1 => ' + color1 + ', c2 => ' + color2);
        // 3: we have valid input, convert colors to rgb
        color1 = [parseInt(color1[0] + color1[1], 16), parseInt(color1[2] + color1[3], 16), parseInt(color1[4] + color1[5], 16)];
        color2 = [parseInt(color2[0] + color2[1], 16), parseInt(color2[2] + color2[3], 16), parseInt(color2[4] + color2[5], 16)];
        console.log('hex -> rgba: c1 => [' + color1.join(', ') + '], c2 => [' + color2.join(', ') + ']');
        // 4: blend
        /** @type {?} */
        var color3 = [
            (1 - percentage) * color1[0] + percentage * color2[0],
            (1 - percentage) * color1[1] + percentage * color2[1],
            (1 - percentage) * color1[2] + percentage * color2[2]
        ];
        /** @type {?} */
        var color3Str = '#' + ColorLib.int_to_hex(color3[0]) + ColorLib.int_to_hex(color3[1]) + ColorLib.int_to_hex(color3[2]);
        console.log(color3Str);
        // return hex
        return color3Str;
    };
    /*
        convert a Number to a two character hex string
        must round, or we will end up with more digits than expected (2)
        note: can also result in single digit, which will need to be padded with a 0 to the left
        @param: num         => the number to conver to hex
        @returns: string    => the hex representation of the provided number
    */
    /*
          convert a Number to a two character hex string
          must round, or we will end up with more digits than expected (2)
          note: can also result in single digit, which will need to be padded with a 0 to the left
          @param: num         => the number to conver to hex
          @returns: string    => the hex representation of the provided number
      */
    /**
     * @param {?} num
     * @return {?}
     */
    ColorLib.int_to_hex = /*
          convert a Number to a two character hex string
          must round, or we will end up with more digits than expected (2)
          note: can also result in single digit, which will need to be padded with a 0 to the left
          @param: num         => the number to conver to hex
          @returns: string    => the hex representation of the provided number
      */
    /**
     * @param {?} num
     * @return {?}
     */
    function (num) {
        /** @type {?} */
        var hex = Math.round(num).toString(16);
        if (hex.length === 1) {
            hex = '0' + hex;
        }
        return hex;
    };
    ColorLib.color = {
        COHESIVE: [
            '#F2D354',
            '#E4612F',
            '#D32C2E',
            '#6D2627',
            '#6C7F55',
            '#934FC6',
            '#F07A5D',
            '#ED8371',
            '#94E751',
            '#C457F7',
            '#973AF7',
            '#B6FF7A',
            '#C7FFD5',
            '#90E4D0',
            '#E09234',
            '#D2FF91',
            '#17B201'
        ],
        COHESIVE_2: [
            '#6F694E',
            '#65D0B2',
            '#D8F546',
            '#FF724B',
            '#D6523E',
            '#F9F470',
            '#F4BC78',
            '#B1D637',
            '#FFCFC8',
            '#56CDAB',
            '#CFDD22',
            '#B3F5D2',
            '#97DB29',
            '#9DC5EE',
            '#CFC0F5',
            '#EDEA29',
            '#5EC027',
            '#386C94'
        ],
        BELIZE: [
            '#5899DA',
            '#E8743B',
            '#19A979',
            '#ED4A7B',
            '#945ECF',
            '#13A4B4',
            '#525DF4',
            '#BF399E',
            '#6C8893',
            '#EE6868',
            '#2F6497'
        ],
        VIRIDIS: [
            '#440154',
            '#481f70',
            '#443983',
            '#3b528b',
            '#31688e',
            '#287c8e',
            '#21918c',
            '#20a486',
            '#35b779',
            '#5ec962',
            '#90d743',
            '#c8e020',
        ],
        MAGMA: [
            '#000004',
            '#100b2d',
            '#2c115f',
            '#51127c',
            '#721f81',
            '#932b80',
            '#b73779',
            '#d8456c',
            '#f1605d',
            '#fc8961',
            '#feb078',
            '#fed799',
        ],
        INFERNO: [
            '#000004',
            '#110a30',
            '#320a5e',
            '#57106e',
            '#781c6d',
            '#9a2865',
            '#bc3754',
            '#d84c3e',
            '#ed6925',
            '#f98e09',
            '#fbb61a',
            '#f4df53',
        ],
        PLASMA: [
            '#0d0887',
            '#3a049a',
            '#5c01a6',
            '#7e03a8',
            '#9c179e',
            '#b52f8c',
            '#cc4778',
            '#de5f65',
            '#ed7953',
            '#f89540',
            '#fdb42f',
            '#fbd524',
        ],
        YL_OR_RD: [
            '#ffffcc',
            '#ffeda0',
            '#fed976',
            '#feb24c',
            '#fd8d3c',
            '#fc4e2a',
            '#e31a1c',
            '#bd0026',
            '#800026',
        ],
        YL_GN_BU: [
            '#ffffd9',
            '#edf8b1',
            '#c7e9b4',
            '#7fcdbb',
            '#41b6c4',
            '#1d91c0',
            '#225ea8',
            '#253494',
            '#081d58',
        ],
        BU_GN: [
            '#f7fcfd',
            '#ebf7fa',
            '#dcf2f2',
            '#c8eae4',
            '#aadfd2',
            '#88d1bc',
            '#68c2a3',
            '#4eb485',
            '#37a266',
            '#228c49',
            '#0d7635',
            '#025f27',
        ],
        WARP10: [
            '#ff9900',
            '#004eff',
            '#E53935',
            '#7CB342',
            '#F4511E',
            '#039BE5',
            '#D81B60',
            '#C0CA33',
            '#6D4C41',
            '#8E24AA',
            '#00ACC1',
            '#FDD835',
            '#5E35B1',
            '#00897B',
            '#FFB300',
            '#3949AB',
            '#43A047',
            '#1E88E5',
        ],
        NINETEEN_EIGHTY_FOUR: ['#31C0F6', '#A500A5', '#FF7E27'],
        ATLANTIS: ['#74D495', '#3F3FBA', '#FF4D9E'],
        DO_ANDROIDS_DREAM: ['#8F8AF4', '#A51414', '#F4CF31'],
        DELOREAN: ['#FD7A5D', '#5F1CF2', '#4CE09A'],
        CTHULHU: ['#FDC44F', '#007C76', '#8983FF'],
        ECTOPLASM: ['#DA6FF1', '#00717A', '#ACFF76'],
        T_MAX_400_FILM: ['#F6F6F8', '#A4A8B6', '#545667']
    };
    return ColorLib;
}());
export { ColorLib };
if (false) {
    /** @type {?} */
    ColorLib.color;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3ItbGliLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHNlbngvd2FycHZpZXcvIiwic291cmNlcyI6WyJzcmMvbGliL3V0aWxzL2NvbG9yLWxpYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkE7SUFBQTtJQThaQSxDQUFDOzs7Ozs7SUEvT1EsaUJBQVE7Ozs7O0lBQWYsVUFBZ0IsQ0FBUyxFQUFFLE1BQWM7UUFDdkMsT0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ25FLENBQUM7Ozs7OztJQUVNLHlCQUFnQjs7Ozs7SUFBdkIsVUFBd0IsRUFBVSxFQUFFLE1BQWM7UUFDaEQsT0FBTztZQUNMLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDOUQsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztTQUNqRSxDQUFDO0lBQ0osQ0FBQzs7Ozs7OztJQUVNLGdDQUF1Qjs7Ozs7O0lBQTlCLFVBQStCLEVBQVUsRUFBRSxNQUFjLEVBQUUsRUFBYztRQUFkLG1CQUFBLEVBQUEsY0FBYztRQUN2RSxPQUFPO1lBQ0wsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLFlBQVksQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDaEUsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLFlBQVksQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFF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LENBQUMsQ0FBQyxDQUFDO1NBQzlCO1FBQ0QsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUN2QixNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDaEY7YUFBTTtZQUNMLE1BQU0sR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzlCO1FBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEdBQUcsTUFBTSxHQUFHLFVBQVUsR0FBRyxNQUFNLENBQUMsQ0FBQztRQUM1RCxnREFBZ0Q7UUFDaEQsTUFBTSxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN6SCxNQUFNLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3pILE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxZQUFZLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQzs7O1lBRTNGLE1BQU0sR0FBRztZQUNiLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNyRCxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDckQsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO1NBQ3REOztZQUNLLFNBQVMsR0FBRyxHQUFHLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hILE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdkIsYUFBYTtRQUNiLE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFFRDs7Ozs7O01BTUU7Ozs7Ozs7Ozs7OztJQUNLLG1CQUFVOzs7Ozs7Ozs7OztJQUFqQixVQUFrQixHQUFXOztZQUN2QixHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO1FBQ3RDLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDcEIsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7U0FDakI7UUFDRCxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7SUE1Wk0sY0FBSyxHQUFHO1FBQ2IsUUFBUSxFQUFFO1lBQ1IsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7U0FDVjtRQUNELFVBQVUsRUFBRTtZQUNWLFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztTQUNWO1FBQ0QsTUFBTSxFQUFFO1lBQ04sU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7U0FDVjtRQUNELE9BQU8sRUFBRTtZQUNQLFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztTQUNWO1FBQ0QsS0FBSyxFQUFFO1lBQ0wsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1NBQ1Y7UUFDRCxPQUFPLEVBQUU7WUFDUCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7U0FDVjtRQUNELE1BQU0sRUFBRTtZQUNOLFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztTQUNWO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1NBQ1Y7UUFDRCxRQUFRLEVBQUU7WUFDUixTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7U0FDVjtRQUNELEtBQUssRUFBRTtZQUNMLFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztTQUNWO1FBQ0QsTUFBTSxFQUFFO1lBQ04sU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1NBQ1Y7UUFDRCxvQkFBb0IsRUFBRSxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDO1FBQ3ZELFFBQVEsRUFBRSxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDO1FBQzNDLGlCQUFpQixFQUFFLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUM7UUFDcEQsUUFBUSxFQUFFLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUM7UUFDM0MsT0FBTyxFQUFFLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUM7UUFDMUMsU0FBUyxFQUFFLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUM7UUFDNUMsY0FBYyxFQUFFLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUM7S0FDbEQsQ0FBQztJQWlQSixlQUFDO0NBQUEsQUE5WkQsSUE4WkM7U0E5WlksUUFBUTs7O0lBQ25CLGVBNEtFIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqICBDb3B5cmlnaHQgMjAyMCAgU2VuWCBTLkEuUy5cbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqL1xuLy8gQGR5bmFtaWNcbmV4cG9ydCBjbGFzcyBDb2xvckxpYiB7XG4gIHN0YXRpYyBjb2xvciA9IHtcbiAgICBDT0hFU0lWRTogW1xuICAgICAgJyNGMkQzNTQnLFxuICAgICAgJyNFNDYxMkYnLFxuICAgICAgJyNEMzJDMkUnLFxuICAgICAgJyM2RDI2MjcnLFxuICAgICAgJyM2QzdGNTUnLFxuICAgICAgJyM5MzRGQzYnLFxuICAgICAgJyNGMDdBNUQnLFxuICAgICAgJyNFRDgzNzEnLFxuICAgICAgJyM5NEU3NTEnLFxuICAgICAgJyNDNDU3RjcnLFxuICAgICAgJyM5NzNBRjcnLFxuICAgICAgJyNCNkZGN0EnLFxuICAgICAgJyNDN0ZGRDUnLFxuICAgICAgJyM5MEU0RDAnLFxuICAgICAgJyNFMDkyMzQnLFxuICAgICAgJyNEMkZGOTEnLFxuICAgICAgJyMxN0IyMDEnXG4gICAgXSxcbiAgICBDT0hFU0lWRV8yOiBbXG4gICAgICAnIzZGNjk0RScsXG4gICAgICAnIzY1RDBCMicsXG4gICAgICAnI0Q4RjU0NicsXG4gICAgICAnI0ZGNzI0QicsXG4gICAgICAnI0Q2NTIzRScsXG4gICAgICAnI0Y5RjQ3MCcsXG4gICAgICAnI0Y0QkM3OCcsXG4gICAgICAnI0IxRDYzNycsXG4gICAgICAnI0ZGQ0ZDOCcsXG4gICAgICAnIzU2Q0RBQicsXG4gICAgICAnI0NGREQyMicsXG4gICAgICAnI0IzRjVEMicsXG4gICAgICAnIzk3REIyOScsXG4gICAgICAnIzlEQzVFRScsXG4gICAgICAnI0NGQzBGNScsXG4gICAgICAnI0VERUEyOScsXG4gICAgICAnIzVFQzAyNycsXG4gICAgICAnIzM4NkM5NCdcbiAgICBdLFxuICAgIEJFTElaRTogW1xuICAgICAgJyM1ODk5REEnLFxuICAgICAgJyNFODc0M0InLFxuICAgICAgJyMxOUE5NzknLFxuICAgICAgJyNFRDRBN0InLFxuICAgICAgJyM5NDVFQ0YnLFxuICAgICAgJyMxM0E0QjQnLFxuICAgICAgJyM1MjVERjQnLFxuICAgICAgJyNCRjM5OUUnLFxuICAgICAgJyM2Qzg4OTMnLFxuICAgICAgJyNFRTY4NjgnLFxuICAgICAgJyMyRjY0OTcnXG4gICAgXSxcbiAgICBWSVJJRElTOiBbXG4gICAgICAnIzQ0MDE1NCcsXG4gICAgICAnIzQ4MWY3MCcsXG4gICAgICAnIzQ0Mzk4MycsXG4gICAgICAnIzNiNTI4YicsXG4gICAgICAnIzMxNjg4ZScsXG4gICAgICAnIzI4N2M4ZScsXG4gICAgICAnIzIxOTE4YycsXG4gICAgICAnIzIwYTQ4NicsXG4gICAgICAnIzM1Yjc3OScsXG4gICAgICAnIzVlYzk2MicsXG4gICAgICAnIzkwZDc0MycsXG4gICAgICAnI2M4ZTAyMCcsXG4gICAgXSxcbiAgICBNQUdNQTogW1xuICAgICAgJyMwMDAwMDQnLFxuICAgICAgJyMxMDBiMmQnLFxuICAgICAgJyMyYzExNWYnLFxuICAgICAgJyM1MTEyN2MnLFxuICAgICAgJyM3MjFmODEnLFxuICAgICAgJyM5MzJiODAnLFxuICAgICAgJyNiNzM3NzknLFxuICAgICAgJyNkODQ1NmMnLFxuICAgICAgJyNmMTYwNWQnLFxuICAgICAgJyNmYzg5NjEnLFxuICAgICAgJyNmZWIwNzgnLFxuICAgICAgJyNmZWQ3OTknLFxuICAgIF0sXG4gICAgSU5GRVJOTzogW1xuICAgICAgJyMwMDAwMDQnLFxuICAgICAgJyMxMTBhMzAnLFxuICAgICAgJyMzMjBhNWUnLFxuICAgICAgJyM1NzEwNmUnLFxuICAgICAgJyM3ODFjNmQnLFxuICAgICAgJyM5YTI4NjUnLFxuICAgICAgJyNiYzM3NTQnLFxuICAgICAgJyNkODRjM2UnLFxuICAgICAgJyNlZDY5MjUnLFxuICAgICAgJyNmOThlMDknLFxuICAgICAgJyNmYmI2MWEnLFxuICAgICAgJyNmNGRmNTMnLFxuICAgIF0sXG4gICAgUExBU01BOiBbXG4gICAgICAnIzBkMDg4NycsXG4gICAgICAnIzNhMDQ5YScsXG4gICAgICAnIzVjMDFhNicsXG4gICAgICAnIzdlMDNhOCcsXG4gICAgICAnIzljMTc5ZScsXG4gICAgICAnI2I1MmY4YycsXG4gICAgICAnI2NjNDc3OCcsXG4gICAgICAnI2RlNWY2NScsXG4gICAgICAnI2VkNzk1MycsXG4gICAgICAnI2Y4OTU0MCcsXG4gICAgICAnI2ZkYjQyZicsXG4gICAgICAnI2ZiZDUyNCcsXG4gICAgXSxcbiAgICBZTF9PUl9SRDogW1xuICAgICAgJyNmZmZmY2MnLFxuICAgICAgJyNmZmVkYTAnLFxuICAgICAgJyNmZWQ5NzYnLFxuICAgICAgJyNmZWIyNGMnLFxuICAgICAgJyNmZDhkM2MnLFxuICAgICAgJyNmYzRlMmEnLFxuICAgICAgJyNlMzFhMWMnLFxuICAgICAgJyNiZDAwMjYnLFxuICAgICAgJyM4MDAwMjYnLFxuICAgIF0sXG4gICAgWUxfR05fQlU6IFtcbiAgICAgICcjZmZmZmQ5JyxcbiAgICAgICcjZWRmOGIxJyxcbiAgICAgICcjYzdlOWI0JyxcbiAgICAgICcjN2ZjZGJiJyxcbiAgICAgICcjNDFiNmM0JyxcbiAgICAgICcjMWQ5MWMwJyxcbiAgICAgICcjMjI1ZWE4JyxcbiAgICAgICcjMjUzNDk0JyxcbiAgICAgICcjMDgxZDU4JyxcbiAgICBdLFxuICAgIEJVX0dOOiBbXG4gICAgICAnI2Y3ZmNmZCcsXG4gICAgICAnI2ViZjdmYScsXG4gICAgICAnI2RjZjJmMicsXG4gICAgICAnI2M4ZWFlNCcsXG4gICAgICAnI2FhZGZkMicsXG4gICAgICAnIzg4ZDFiYycsXG4gICAgICAnIzY4YzJhMycsXG4gICAgICAnIzRlYjQ4NScsXG4gICAgICAnIzM3YTI2NicsXG4gICAgICAnIzIyOGM0OScsXG4gICAgICAnIzBkNzYzNScsXG4gICAgICAnIzAyNWYyNycsXG4gICAgXSxcbiAgICBXQVJQMTA6IFtcbiAgICAgICcjZmY5OTAwJyxcbiAgICAgICcjMDA0ZWZmJyxcbiAgICAgICcjRTUzOTM1JyxcbiAgICAgICcjN0NCMzQyJyxcbiAgICAgICcjRjQ1MTFFJyxcbiAgICAgICcjMDM5QkU1JyxcbiAgICAgICcjRDgxQjYwJyxcbiAgICAgICcjQzBDQTMzJyxcbiAgICAgICcjNkQ0QzQxJyxcbiAgICAgICcjOEUyNEFBJyxcbiAgICAgICcjMDBBQ0MxJyxcbiAgICAgICcjRkREODM1JyxcbiAgICAgICcjNUUzNUIxJyxcbiAgICAgICcjMDA4OTdCJyxcbiAgICAgICcjRkZCMzAwJyxcbiAgICAgICcjMzk0OUFCJyxcbiAgICAgICcjNDNBMDQ3JyxcbiAgICAgICcjMUU4OEU1JyxcbiAgICBdLFxuICAgIE5JTkVURUVOX0VJR0hUWV9GT1VSOiBbJyMzMUMwRjYnLCAnI0E1MDBBNScsICcjRkY3RTI3J10sXG4gICAgQVRMQU5USVM6IFsnIzc0RDQ5NScsICcjM0YzRkJBJywgJyNGRjREOUUnXSxcbiAgICBET19BTkRST0lEU19EUkVBTTogWycjOEY4QUY0JywgJyNBNTE0MTQnLCAnI0Y0Q0YzMSddLFxuICAgIERFTE9SRUFOOiBbJyNGRDdBNUQnLCAnIzVGMUNGMicsICcjNENFMDlBJ10sXG4gICAgQ1RIVUxIVTogWycjRkRDNDRGJywgJyMwMDdDNzYnLCAnIzg5ODNGRiddLFxuICAgIEVDVE9QTEFTTTogWycjREE2RkYxJywgJyMwMDcxN0EnLCAnI0FDRkY3NiddLFxuICAgIFRfTUFYXzQwMF9GSUxNOiBbJyNGNkY2RjgnLCAnI0E0QThCNicsICcjNTQ1NjY3J11cbiAgfTtcblxuICBzdGF0aWMgZ2V0Q29sb3IoaTogbnVtYmVyLCBzY2hlbWU6IHN0cmluZykge1xuICAgIHJldHVybiBDb2xvckxpYi5jb2xvcltzY2hlbWVdW2kgJSBDb2xvckxpYi5jb2xvcltzY2hlbWVdLmxlbmd0aF07XG4gIH1cblxuICBzdGF0aWMgZ2V0Q29sb3JHcmFkaWVudChpZDogbnVtYmVyLCBzY2hlbWU6IHN0cmluZykge1xuICAgIHJldHVybiBbXG4gICAgICBbMCwgQ29sb3JMaWIudHJhbnNwYXJlbnRpemUoQ29sb3JMaWIuZ2V0Q29sb3IoaWQsIHNjaGVtZSksIDApXSxcbiAgICAgIFsxLCBDb2xvckxpYi50cmFuc3BhcmVudGl6ZShDb2xvckxpYi5nZXRDb2xvcihpZCwgc2NoZW1lKSwgMC43KV1cbiAgICBdO1xuICB9XG5cbiAgc3RhdGljIGdldEJsZW5kZWRDb2xvckdyYWRpZW50KGlkOiBudW1iZXIsIHNjaGVtZTogc3RyaW5nLCBiZyA9ICcjMDAwMDAwJykge1xuICAgIHJldHVybiBbXG4gICAgICBbMCwgQ29sb3JMaWIuYmxlbmRfY29sb3JzKGJnLCBDb2xvckxpYi5nZXRDb2xvcihpZCwgc2NoZW1lKSwgMCldLFxuICAgICAgWzEsIENvbG9yTGliLmJsZW5kX2NvbG9ycyhiZywgQ29sb3JMaWIuZ2V0Q29sb3IoaWQsIHNjaGVtZSksIDEpXVxuICAgIF07XG4gIH1cblxuICBzdGF0aWMgZ2V0Q29sb3JTY2FsZShzY2hlbWU6IHN0cmluZykge1xuICAgIHJldHVybiBDb2xvckxpYi5jb2xvcltzY2hlbWVdLm1hcCgoYywgaSkgPT4gW2ksIGNdKTtcbiAgfVxuXG4gIHN0YXRpYyBoZXhUb1JnYihoZXgpIHtcbiAgICBjb25zdCByZXN1bHQgPSAvXiM/KFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pJC9pLmV4ZWMoaGV4KTtcbiAgICByZXR1cm4gcmVzdWx0ID8gW1xuICAgICAgcGFyc2VJbnQocmVzdWx0WzFdLCAxNiksXG4gICAgICBwYXJzZUludChyZXN1bHRbMl0sIDE2KSxcbiAgICAgIHBhcnNlSW50KHJlc3VsdFszXSwgMTYpXG4gICAgXSA6IG51bGw7XG4gIH1cblxuICBzdGF0aWMgdHJhbnNwYXJlbnRpemUoY29sb3IsIGFscGhhID0gMC41KTogc3RyaW5nIHtcbiAgICByZXR1cm4gJ3JnYmEoJyArIENvbG9yTGliLmhleFRvUmdiKGNvbG9yKS5jb25jYXQoYWxwaGEpLmpvaW4oJywnKSArICcpJztcbiAgfVxuXG4gIHN0YXRpYyBnZW5lcmF0ZUNvbG9ycyhudW0sIHNjaGVtZSkge1xuICAgIGNvbnN0IGNvbG9yID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW07IGkrKykge1xuICAgICAgY29sb3IucHVzaChDb2xvckxpYi5nZXRDb2xvcihpLCBzY2hlbWUpKTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbG9yO1xuICB9XG5cbiAgc3RhdGljIGdlbmVyYXRlVHJhbnNwYXJlbnRDb2xvcnMobnVtLCBzY2hlbWUpIHtcbiAgICBjb25zdCBjb2xvciA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtOyBpKyspIHtcbiAgICAgIGNvbG9yLnB1c2goQ29sb3JMaWIudHJhbnNwYXJlbnRpemUoQ29sb3JMaWIuZ2V0Q29sb3IoaSwgc2NoZW1lKSkpO1xuICAgIH1cbiAgICByZXR1cm4gY29sb3I7XG4gIH1cblxuICBzdGF0aWMgaHN2R3JhZGllbnRGcm9tUmdiQ29sb3JzKGMxLCBjMiwgc3RlcHMpIHtcbiAgICBjb25zdCBjMWhzdiA9IENvbG9yTGliLnJnYjJoc3YoYzEuciwgYzEuZywgYzEuYik7XG4gICAgY29uc3QgYzJoc3YgPSBDb2xvckxpYi5yZ2IyaHN2KGMyLnIsIGMyLmcsIGMyLmIpO1xuICAgIGMxLmggPSBjMWhzdlswXTtcbiAgICBjMS5zID0gYzFoc3ZbMV07XG4gICAgYzEudiA9IGMxaHN2WzJdO1xuICAgIGMyLmggPSBjMmhzdlswXTtcbiAgICBjMi5zID0gYzJoc3ZbMV07XG4gICAgYzIudiA9IGMyaHN2WzJdO1xuICAgIGNvbnN0IGdyYWRpZW50ID0gQ29sb3JMaWIuaHN2R3JhZGllbnQoYzEsIGMyLCBzdGVwcyk7XG4gICAgZm9yIChjb25zdCBpIGluIGdyYWRpZW50KSB7XG4gICAgICBpZiAoZ3JhZGllbnRbaV0pIHtcbiAgICAgICAgZ3JhZGllbnRbaV0ucmdiID0gQ29sb3JMaWIuaHN2MnJnYihncmFkaWVudFtpXS5oLCBncmFkaWVudFtpXS5zLCBncmFkaWVudFtpXS52KTtcbiAgICAgICAgZ3JhZGllbnRbaV0uciA9IE1hdGguZmxvb3IoZ3JhZGllbnRbaV0ucmdiWzBdKTtcbiAgICAgICAgZ3JhZGllbnRbaV0uZyA9IE1hdGguZmxvb3IoZ3JhZGllbnRbaV0ucmdiWzFdKTtcbiAgICAgICAgZ3JhZGllbnRbaV0uYiA9IE1hdGguZmxvb3IoZ3JhZGllbnRbaV0ucmdiWzJdKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGdyYWRpZW50O1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgcmdiMmhzdihyOiBudW1iZXIsIGc6IG51bWJlciwgYjogbnVtYmVyKSB7XG4gICAgLy8gTm9ybWFsaXplXG4gICAgY29uc3Qgbm9ybVIgPSByIC8gMjU1LjA7XG4gICAgY29uc3Qgbm9ybUcgPSBnIC8gMjU1LjA7XG4gICAgY29uc3Qgbm9ybUIgPSBiIC8gMjU1LjA7XG4gICAgY29uc3QgTSA9IE1hdGgubWF4KG5vcm1SLCBub3JtRywgbm9ybUIpO1xuICAgIGNvbnN0IG0gPSBNYXRoLm1pbihub3JtUiwgbm9ybUcsIG5vcm1CKTtcbiAgICBjb25zdCBkID0gTSAtIG07XG4gICAgbGV0IGg7XG4gICAgbGV0IHM7XG4gICAgbGV0IHY7XG4gICAgdiA9IE07XG4gICAgaWYgKGQgPT09IDApIHtcbiAgICAgIGggPSAwO1xuICAgICAgcyA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHMgPSBkIC8gdjtcbiAgICAgIHN3aXRjaCAoTSkge1xuICAgICAgICBjYXNlIG5vcm1SOlxuICAgICAgICAgIGggPSAoKG5vcm1HIC0gbm9ybUIpICsgZCAqIChub3JtRyA8IG5vcm1CID8gNiA6IDApKSAvIDYgKiBkO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIG5vcm1HOlxuICAgICAgICAgIGggPSAoKG5vcm1CIC0gbm9ybVIpICsgZCAqIDIpIC8gNiAqIGQ7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2Ugbm9ybUI6XG4gICAgICAgICAgaCA9ICgobm9ybVIgLSBub3JtRykgKyBkICogNCkgLyA2ICogZDtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFtoLCBzLCB2XTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIGhzdkdyYWRpZW50KGMxOiBhbnksIGMyOiBhbnksIHN0ZXBzOiBhbnkpIHtcbiAgICBjb25zdCBncmFkaWVudCA9IG5ldyBBcnJheShzdGVwcyk7XG4gICAgLy8gZGV0ZXJtaW5lIGNsb2Nrd2lzZSBhbmQgY291bnRlci1jbG9ja3dpc2UgZGlzdGFuY2UgYmV0d2VlbiBodWVzXG4gICAgY29uc3QgZGlzdENDVyA9IChjMS5oID49IGMyLmgpID8gYzEuaCAtIGMyLmggOiAxICsgYzEuaCAtIGMyLmg7XG4gICAgY29uc3QgZGlzdENXID0gKGMxLmggPj0gYzIuaCkgPyAxICsgYzIuaCAtIGMxLmggOiBjMi5oIC0gYzEuaDtcbiAgICAvLyBtYWtlIGdyYWRpZW50IGZvciB0aGlzIHBhcnRcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ZXBzOyBpKyspIHtcbiAgICAgIC8vIGludGVycG9sYXRlIGgsIHMsIGJcbiAgICAgIGxldCBoID0gKGRpc3RDVyA8PSBkaXN0Q0NXKSA/IGMxLmggKyAoZGlzdENXICogaSAvIChzdGVwcyAtIDEpKSA6IGMxLmggLSAoZGlzdENDVyAqIGkgLyAoc3RlcHMgLSAxKSk7XG4gICAgICBpZiAoaCA8IDApIHtcbiAgICAgICAgaCA9IDEgKyBoO1xuICAgICAgfVxuICAgICAgaWYgKGggPiAxKSB7XG4gICAgICAgIGggPSBoIC0gMTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHMgPSAoMSAtIGkgLyAoc3RlcHMgLSAxKSkgKiBjMS5zICsgaSAvIChzdGVwcyAtIDEpICogYzIucztcbiAgICAgIGNvbnN0IHYgPSAoMSAtIGkgLyAoc3RlcHMgLSAxKSkgKiBjMS52ICsgaSAvIChzdGVwcyAtIDEpICogYzIudjtcbiAgICAgIC8vIGFkZCB0byBncmFkaWVudCBhcnJheVxuICAgICAgZ3JhZGllbnRbaV0gPSB7aCwgcywgdn07XG4gICAgfVxuICAgIHJldHVybiBncmFkaWVudDtcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIGhzdjJyZ2IoaDogYW55LCBzOiBhbnksIHY6IGFueSkge1xuICAgIGxldCByO1xuICAgIGxldCBnO1xuICAgIGxldCBiO1xuICAgIGNvbnN0IGkgPSBNYXRoLmZsb29yKGggKiA2KTtcbiAgICBjb25zdCBmID0gaCAqIDYgLSBpO1xuICAgIGNvbnN0IHAgPSB2ICogKDEgLSBzKTtcbiAgICBjb25zdCBxID0gdiAqICgxIC0gZiAqIHMpO1xuICAgIGNvbnN0IHQgPSB2ICogKDEgLSAoMSAtIGYpICogcyk7XG4gICAgc3dpdGNoIChpICUgNikge1xuICAgICAgY2FzZSAwOlxuICAgICAgICByID0gdjtcbiAgICAgICAgZyA9IHQ7XG4gICAgICAgIGIgPSBwO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgciA9IHE7XG4gICAgICAgIGcgPSB2O1xuICAgICAgICBiID0gcDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIHIgPSBwO1xuICAgICAgICBnID0gdjtcbiAgICAgICAgYiA9IHQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICByID0gcDtcbiAgICAgICAgZyA9IHE7XG4gICAgICAgIGIgPSB2O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgNDpcbiAgICAgICAgciA9IHQ7XG4gICAgICAgIGcgPSBwO1xuICAgICAgICBiID0gdjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDU6XG4gICAgICAgIHIgPSB2O1xuICAgICAgICBnID0gcDtcbiAgICAgICAgYiA9IHE7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gW3IgKiAyNTUsIGcgKiAyNTUsIGIgKiAyNTVdO1xuICB9XG5cbiAgc3RhdGljIHJnYjJoZXgociwgZywgYikge1xuICAgIGZ1bmN0aW9uIGNvbXBvbmVudFRvSGV4KGMpIHtcbiAgICAgIGNvbnN0IGhleCA9IGMudG9TdHJpbmcoMTYpO1xuICAgICAgcmV0dXJuIGhleC5sZW5ndGggPT09IDEgPyAnMCcgKyBoZXggOiBoZXg7XG4gICAgfVxuXG4gICAgcmV0dXJuICcjJyArIGNvbXBvbmVudFRvSGV4KHIpICsgY29tcG9uZW50VG9IZXgoZykgKyBjb21wb25lbnRUb0hleChiKTtcbiAgfVxuXG4gIHN0YXRpYyBibGVuZF9jb2xvcnMoY29sb3IxLCBjb2xvcjIsIHBlcmNlbnRhZ2UpIHtcbiAgICAvLyBjaGVjayBpbnB1dFxuICAgIGNvbG9yMSA9IGNvbG9yMSB8fCAnIzAwMDAwMCc7XG4gICAgY29sb3IyID0gY29sb3IyIHx8ICcjZmZmZmZmJztcbiAgICBwZXJjZW50YWdlID0gcGVyY2VudGFnZSB8fCAwLjU7XG4gICAgLy8gMTogdmFsaWRhdGUgaW5wdXQsIG1ha2Ugc3VyZSB3ZSBoYXZlIHByb3ZpZGVkIGEgdmFsaWQgaGV4XG4gICAgaWYgKGNvbG9yMS5sZW5ndGggIT09IDQgJiYgY29sb3IxLmxlbmd0aCAhPT0gNykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb2xvcnMgbXVzdCBiZSBwcm92aWRlZCBhcyBoZXhlcycpO1xuICAgIH1cbiAgICBpZiAoY29sb3IyLmxlbmd0aCAhPT0gNCAmJiBjb2xvcjIubGVuZ3RoICE9PSA3KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvbG9ycyBtdXN0IGJlIHByb3ZpZGVkIGFzIGhleGVzJyk7XG4gICAgfVxuICAgIGlmIChwZXJjZW50YWdlID4gMSB8fCBwZXJjZW50YWdlIDwgMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdwZXJjZW50YWdlIG11c3QgYmUgYmV0d2VlbiAwIGFuZCAxJyk7XG4gICAgfVxuICAgIC8vIDI6IGNoZWNrIHRvIHNlZSBpZiB3ZSBuZWVkIHRvIGNvbnZlcnQgMyBjaGFyIGhleCB0byA2IGNoYXIgaGV4LCBlbHNlIHNsaWNlIG9mZiBoYXNoXG4gICAgLy8gICAgICB0aGUgdGhyZWUgY2hhcmFjdGVyIGhleCBpcyBqdXN0IGEgcmVwcmVzZW50YXRpb24gb2YgdGhlIDYgaGV4IHdoZXJlIGVhY2ggY2hhcmFjdGVyIGlzIHJlcGVhdGVkXG4gICAgLy8gICAgICBpZTogIzA2MCA9PiAjMDA2NjAwIChncmVlbilcbiAgICBpZiAoY29sb3IxLmxlbmd0aCA9PT0gNCkge1xuICAgICAgY29sb3IxID0gY29sb3IxWzFdICsgY29sb3IxWzFdICsgY29sb3IxWzJdICsgY29sb3IxWzJdICsgY29sb3IxWzNdICsgY29sb3IxWzNdO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb2xvcjEgPSBjb2xvcjEuc3Vic3RyaW5nKDEpO1xuICAgIH1cbiAgICBpZiAoY29sb3IyLmxlbmd0aCA9PT0gNCkge1xuICAgICAgY29sb3IyID0gY29sb3IyWzFdICsgY29sb3IyWzFdICsgY29sb3IyWzJdICsgY29sb3IyWzJdICsgY29sb3IyWzNdICsgY29sb3IyWzNdO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb2xvcjIgPSBjb2xvcjIuc3Vic3RyaW5nKDEpO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZygndmFsaWQ6IGMxID0+ICcgKyBjb2xvcjEgKyAnLCBjMiA9PiAnICsgY29sb3IyKTtcbiAgICAvLyAzOiB3ZSBoYXZlIHZhbGlkIGlucHV0LCBjb252ZXJ0IGNvbG9ycyB0byByZ2JcbiAgICBjb2xvcjEgPSBbcGFyc2VJbnQoY29sb3IxWzBdICsgY29sb3IxWzFdLCAxNiksIHBhcnNlSW50KGNvbG9yMVsyXSArIGNvbG9yMVszXSwgMTYpLCBwYXJzZUludChjb2xvcjFbNF0gKyBjb2xvcjFbNV0sIDE2KV07XG4gICAgY29sb3IyID0gW3BhcnNlSW50KGNvbG9yMlswXSArIGNvbG9yMlsxXSwgMTYpLCBwYXJzZUludChjb2xvcjJbMl0gKyBjb2xvcjJbM10sIDE2KSwgcGFyc2VJbnQoY29sb3IyWzRdICsgY29sb3IyWzVdLCAxNildO1xuICAgIGNvbnNvbGUubG9nKCdoZXggLT4gcmdiYTogYzEgPT4gWycgKyBjb2xvcjEuam9pbignLCAnKSArICddLCBjMiA9PiBbJyArIGNvbG9yMi5qb2luKCcsICcpICsgJ10nKTtcbiAgICAvLyA0OiBibGVuZFxuICAgIGNvbnN0IGNvbG9yMyA9IFtcbiAgICAgICgxIC0gcGVyY2VudGFnZSkgKiBjb2xvcjFbMF0gKyBwZXJjZW50YWdlICogY29sb3IyWzBdLFxuICAgICAgKDEgLSBwZXJjZW50YWdlKSAqIGNvbG9yMVsxXSArIHBlcmNlbnRhZ2UgKiBjb2xvcjJbMV0sXG4gICAgICAoMSAtIHBlcmNlbnRhZ2UpICogY29sb3IxWzJdICsgcGVyY2VudGFnZSAqIGNvbG9yMlsyXVxuICAgIF07XG4gICAgY29uc3QgY29sb3IzU3RyID0gJyMnICsgQ29sb3JMaWIuaW50X3RvX2hleChjb2xvcjNbMF0pICsgQ29sb3JMaWIuaW50X3RvX2hleChjb2xvcjNbMV0pICsgQ29sb3JMaWIuaW50X3RvX2hleChjb2xvcjNbMl0pO1xuICAgIGNvbnNvbGUubG9nKGNvbG9yM1N0cik7XG4gICAgLy8gcmV0dXJuIGhleFxuICAgIHJldHVybiBjb2xvcjNTdHI7XG4gIH1cblxuICAvKlxuICAgICAgY29udmVydCBhIE51bWJlciB0byBhIHR3byBjaGFyYWN0ZXIgaGV4IHN0cmluZ1xuICAgICAgbXVzdCByb3VuZCwgb3Igd2Ugd2lsbCBlbmQgdXAgd2l0aCBtb3JlIGRpZ2l0cyB0aGFuIGV4cGVjdGVkICgyKVxuICAgICAgbm90ZTogY2FuIGFsc28gcmVzdWx0IGluIHNpbmdsZSBkaWdpdCwgd2hpY2ggd2lsbCBuZWVkIHRvIGJlIHBhZGRlZCB3aXRoIGEgMCB0byB0aGUgbGVmdFxuICAgICAgQHBhcmFtOiBudW0gICAgICAgICA9PiB0aGUgbnVtYmVyIHRvIGNvbnZlciB0byBoZXhcbiAgICAgIEByZXR1cm5zOiBzdHJpbmcgICAgPT4gdGhlIGhleCByZXByZXNlbnRhdGlvbiBvZiB0aGUgcHJvdmlkZWQgbnVtYmVyXG4gICovXG4gIHN0YXRpYyBpbnRfdG9faGV4KG51bTogbnVtYmVyKSB7XG4gICAgbGV0IGhleCA9IE1hdGgucm91bmQobnVtKS50b1N0cmluZygxNik7XG4gICAgaWYgKGhleC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGhleCA9ICcwJyArIGhleDtcbiAgICB9XG4gICAgcmV0dXJuIGhleDtcbiAgfVxufVxuIl19