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
import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { Logger } from '../../../utils/logger';
import { Datum } from '../model/datum';
import { ChartLib } from '../../../utils/chart-lib';
import { easeLinear, max, range, scaleBand, scaleLinear, sum, timeDays } from 'd3';
import { event, select } from 'd3-selection';
import { ColorLib } from '../../../utils/color-lib';
import { GTSLib } from '../../../utils/gts.lib';
import moment from 'moment';
var CalendarHeatmapComponent = /** @class */ (function () {
    function CalendarHeatmapComponent(el) {
        this.el = el;
        this.width = ChartLib.DEFAULT_WIDTH;
        this.height = ChartLib.DEFAULT_HEIGHT;
        this.overview = 'global';
        this.handler = new EventEmitter();
        this.change = new EventEmitter();
        // tslint:disable-next-line:variable-name
        this._debug = false;
        // tslint:disable-next-line:variable-name
        this._minColor = CalendarHeatmapComponent.DEF_MIN_COLOR;
        // tslint:disable-next-line:variable-name
        this._maxColor = CalendarHeatmapComponent.DEF_MAX_COLOR;
        // Defaults
        this.gutter = 5;
        this.gWidth = 1000;
        this.gHeight = 200;
        this.itemSize = 10;
        this.labelPadding = 40;
        this.transitionDuration = 250;
        this.inTransition = false;
        // Tooltip defaults
        this.tooltipWidth = 450;
        this.tooltipPadding = 15;
        // Overview defaults
        this.history = ['global'];
        this.selected = new Datum();
        this.parentWidth = -1;
        this.getTooltip = (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            /** @type {?} */
            var tooltipHtml = '<div class="header"><strong>' + d.date.format('dddd, MMM Do YYYY HH:mm') + '</strong></div><ul>';
            (d.summary || []).forEach((/**
             * @param {?} s
             * @return {?}
             */
            function (s) {
                tooltipHtml += "<li>\n  <div class=\"round\" style=\"background-color:" + ColorLib.transparentize(s.color) + "; border-color:" + s.color + "\"></div>\n" + GTSLib.formatLabel(s.name) + ": " + s.total + "</li>";
            }));
            if (d.total !== undefined && d.name) {
                tooltipHtml += "<li><div class=\"round\"\nstyle=\"background-color: " + ColorLib.transparentize(d.color) + "; border-color: " + d.color + "\"\n></div> " + GTSLib.formatLabel(d.name) + ": " + d.total + "</li>";
            }
            tooltipHtml += '</ul>';
            return tooltipHtml;
        });
        this.LOG = new Logger(CalendarHeatmapComponent, this.debug);
    }
    Object.defineProperty(CalendarHeatmapComponent.prototype, "debug", {
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
    Object.defineProperty(CalendarHeatmapComponent.prototype, "data", {
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
            this.LOG.debug(['data'], data);
            if (data) {
                this._data = data;
                this.calculateDimensions();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CalendarHeatmapComponent.prototype, "minColor", {
        get: /**
         * @return {?}
         */
        function () {
            return this._minColor;
        },
        set: /**
         * @param {?} minColor
         * @return {?}
         */
        function (minColor) {
            this._minColor = minColor;
            this.calculateDimensions();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CalendarHeatmapComponent.prototype, "maxColor", {
        get: /**
         * @return {?}
         */
        function () {
            return this._maxColor;
        },
        set: /**
         * @param {?} maxColor
         * @return {?}
         */
        function (maxColor) {
            this._maxColor = maxColor;
            this.calculateDimensions();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    CalendarHeatmapComponent.getNumberOfWeeks = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var dayIndex = Math.round((+moment.utc() - +moment.utc().subtract(1, 'year').startOf('week')) / 86400000);
        return Math.trunc(dayIndex / 7) + 1;
    };
    /**
     * @return {?}
     */
    CalendarHeatmapComponent.prototype.onResize = /**
     * @return {?}
     */
    function () {
        if (this.el.nativeElement.parentElement.clientWidth !== this.parentWidth) {
            this.calculateDimensions();
        }
    };
    /**
     * @return {?}
     */
    CalendarHeatmapComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        this.chart = (/** @type {?} */ (this.div.nativeElement));
        // Initialize svg element
        this.svg = select(this.chart).append('svg').attr('class', 'svg');
        // Initialize main svg elements
        this.items = this.svg.append('g');
        this.labels = this.svg.append('g');
        this.buttons = this.svg.append('g');
        // Add tooltip to the same element as main svg
        this.tooltip = select(this.chart)
            .append('div')
            .attr('class', 'heatmap-tooltip')
            .style('opacity', 0);
        // Calculate chart dimensions
        this.calculateDimensions();
        //  this.drawChart();
    };
    /**
     * @return {?}
     */
    CalendarHeatmapComponent.prototype.calculateDimensions = /**
     * @return {?}
     */
    function () {
        var _this = this;
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout((/**
         * @return {?}
         */
        function () {
            if (_this.el.nativeElement.parentElement.clientWidth !== 0) {
                _this.gWidth = _this.chart.clientWidth < 1000 ? 1000 : _this.chart.clientWidth;
                _this.itemSize = ((_this.gWidth - _this.labelPadding) / CalendarHeatmapComponent.getNumberOfWeeks() - _this.gutter);
                _this.gHeight = _this.labelPadding + 7 * (_this.itemSize + _this.gutter);
                _this.svg.attr('width', _this.gWidth).attr('height', _this.gHeight);
                _this.LOG.debug(['calculateDimensions'], _this._data);
                if (!!_this._data && !!_this._data[0] && !!_this._data[0].summary) {
                    _this.drawChart();
                }
            }
            else {
                _this.calculateDimensions();
            }
        }), 250);
    };
    /**
     * @private
     * @param {?} xs
     * @param {?} key
     * @return {?}
     */
    CalendarHeatmapComponent.prototype.groupBy = /**
     * @private
     * @param {?} xs
     * @param {?} key
     * @return {?}
     */
    function (xs, key) {
        return xs.reduce((/**
         * @param {?} rv
         * @param {?} x
         * @return {?}
         */
        function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }), {});
    };
    /**
     * @return {?}
     */
    CalendarHeatmapComponent.prototype.updateDataSummary = /**
     * @return {?}
     */
    function () {
        // Get daily summary if that was not provided
        if (!this._data[0].summary) {
            this._data.map((/**
             * @param {?} d
             * @return {?}
             */
            function (d) {
                /** @type {?} */
                var summary = d.details.reduce((/**
                 * @param {?} uniques
                 * @param {?} project
                 * @return {?}
                 */
                function (uniques, project) {
                    if (!uniques[project.name]) {
                        uniques[project.name] = { value: project.value };
                    }
                    else {
                        uniques[project.name].value += project.value;
                    }
                    return uniques;
                }), {});
                /** @type {?} */
                var unsortedSummary = Object.keys(summary).map((/**
                 * @param {?} key
                 * @return {?}
                 */
                function (key) {
                    return {
                        name: key,
                        total: summary[key].value
                    };
                }));
                d.summary = unsortedSummary.sort((/**
                 * @param {?} a
                 * @param {?} b
                 * @return {?}
                 */
                function (a, b) {
                    return b.total - a.total;
                }));
                return d;
            }));
        }
    };
    /**
     * @return {?}
     */
    CalendarHeatmapComponent.prototype.drawChart = /**
     * @return {?}
     */
    function () {
        if (!this.svg || !this._data) {
            return;
        }
        this.LOG.debug(['drawChart'], [this.overview, this.selected]);
        switch (this.overview) {
            case 'global':
                this.drawGlobalOverview();
                this.change.emit({
                    overview: this.overview,
                    start: moment(this._data[0].date),
                    end: moment(this._data[this._data.length - 1].date),
                });
                break;
            case 'year':
                this.drawYearOverview();
                this.change.emit({
                    overview: this.overview,
                    start: moment(this.selected.date).startOf('year'),
                    end: moment(this.selected.date).endOf('year'),
                });
                break;
            case 'month':
                this.drawMonthOverview();
                this.change.emit({
                    overview: this.overview,
                    start: moment(this.selected.date).startOf('month'),
                    end: moment(this.selected.date).endOf('month'),
                });
                break;
            case 'week':
                this.drawWeekOverview();
                this.change.emit({
                    overview: this.overview,
                    start: moment(this.selected.date).startOf('week'),
                    end: moment(this.selected.date).endOf('week'),
                });
                break;
            case 'day':
                this.drawDayOverview();
                this.change.emit({
                    overview: this.overview,
                    start: moment(this.selected.date).startOf('day'),
                    end: moment(this.selected.date).endOf('day'),
                });
                break;
            default:
                break;
        }
    };
    /**
     * @return {?}
     */
    CalendarHeatmapComponent.prototype.drawGlobalOverview = /**
     * @return {?}
     */
    function () {
        var _this = this;
        // Add current overview to the history
        if (this.history[this.history.length - 1] !== this.overview) {
            this.history.push(this.overview);
        }
        // Define start and end of the dataset
        /** @type {?} */
        var startPeriod = moment.utc(this._data[0].date.startOf('y'));
        /** @type {?} */
        var endPeriod = moment.utc(this._data[this._data.length - 1].date.endOf('y'));
        // Define array of years and total values
        /** @type {?} */
        var yData = this._data.filter((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d.date.isBetween(startPeriod, endPeriod, null, '[]'); }));
        yData.forEach((/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            /** @type {?} */
            var summary = [];
            /** @type {?} */
            var group = _this.groupBy(d.details, 'name');
            Object.keys(group).forEach((/**
             * @param {?} k
             * @return {?}
             */
            function (k) {
                summary.push({
                    name: k,
                    total: group[k].reduce((/**
                     * @param {?} acc
                     * @param {?} o
                     * @return {?}
                     */
                    function (acc, o) {
                        return acc + o.value;
                    }), 0),
                    color: group[k][0].color,
                    id: group[k][0].id,
                });
            }));
            d.summary = summary;
        }));
        /** @type {?} */
        var duration = Math.ceil(moment.duration(endPeriod.diff(startPeriod)).asYears());
        /** @type {?} */
        var scale = [];
        for (var i = 0; i < duration; i++) {
            /** @type {?} */
            var d = moment.utc().year(startPeriod.year() + i).month(0).date(1).startOf('y');
            scale.push(d);
        }
        /** @type {?} */
        var yearData = yData.map((/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            /** @type {?} */
            var date = d.date;
            return {
                date: date,
                total: yData.reduce((/**
                 * @param {?} prev
                 * @param {?} current
                 * @return {?}
                 */
                function (prev, current) {
                    if (((/** @type {?} */ (current.date))).year() === date.year()) {
                        prev += current.total;
                    }
                    return prev;
                }), 0),
                summary: ((/**
                 * @return {?}
                 */
                function () {
                    /** @type {?} */
                    var summary = yData.reduce((/**
                     * @param {?} s
                     * @param {?} data
                     * @return {?}
                     */
                    function (s, data) {
                        if (((/** @type {?} */ (data.date))).year() === date.year()) {
                            data.summary.forEach((/**
                             * @param {?} _summary
                             * @return {?}
                             */
                            function (_summary) {
                                if (!s[_summary.name]) {
                                    s[_summary.name] = {
                                        total: _summary.total,
                                        color: _summary.color,
                                    };
                                }
                                else {
                                    s[_summary.name].total += _summary.total;
                                }
                            }));
                        }
                        return s;
                    }), {});
                    /** @type {?} */
                    var unsortedSummary = Object.keys(summary).map((/**
                     * @param {?} key
                     * @return {?}
                     */
                    function (key) {
                        return {
                            name: key,
                            total: summary[key].total,
                            color: summary[key].color,
                        };
                    }));
                    return unsortedSummary.sort((/**
                     * @param {?} a
                     * @param {?} b
                     * @return {?}
                     */
                    function (a, b) { return b.total - a.total; }));
                }))(),
            };
        }));
        // Calculate max value of all the years in the dataset
        yearData = GTSLib.cleanArray(yearData);
        /** @type {?} */
        var maxValue = max(yearData, (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d.total; }));
        // Define year labels and axis
        /** @type {?} */
        var yearLabels = scale.map((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d; }));
        /** @type {?} */
        var yearScale = scaleBand()
            .rangeRound([0, this.gWidth])
            .padding(0.05)
            .domain(yearLabels.map((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d.year().toString(); })));
        /** @type {?} */
        var color = scaleLinear()
            .range([this.minColor || CalendarHeatmapComponent.DEF_MIN_COLOR, this.maxColor || CalendarHeatmapComponent.DEF_MAX_COLOR])
            .domain([-0.15 * maxValue, maxValue]);
        // Add global data items to the overview
        this.items.selectAll('.item-block-year').remove();
        this.items.selectAll('.item-block-year')
            .data(yearData)
            .enter()
            .append('rect')
            .attr('class', 'item item-block-year')
            .attr('width', (/**
         * @return {?}
         */
        function () { return (_this.gWidth - _this.labelPadding) / yearLabels.length - _this.gutter * 5; }))
            .attr('height', (/**
         * @return {?}
         */
        function () { return _this.gHeight - _this.labelPadding; }))
            .attr('transform', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return 'translate(' + yearScale(((/** @type {?} */ (d.date))).year().toString()) + ',' + _this.tooltipPadding * 2 + ')'; }))
            .attr('fill', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return color(d.total) || CalendarHeatmapComponent.DEF_MAX_COLOR; }))
            .on('click', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            if (_this.inTransition) {
                return;
            }
            // Set in_transition flag
            _this.inTransition = true;
            // Set selected date to the one clicked on
            _this.selected = d;
            // Hide tooltip
            _this.hideTooltip();
            // Remove all global overview related items and labels
            _this.removeGlobalOverview();
            // Redraw the chart
            _this.overview = 'year';
            _this.drawChart();
        }))
            .style('opacity', 0)
            .on('mouseover', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            if (_this.inTransition) {
                return;
            }
            // Calculate tooltip position
            /** @type {?} */
            var x = yearScale(d.date.year().toString()) + _this.tooltipPadding * 2;
            while (_this.gWidth - x < (_this.tooltipWidth + _this.tooltipPadding * 5)) {
                x -= 10;
            }
            /** @type {?} */
            var y = _this.tooltipPadding * 4;
            // Show tooltip
            _this.tooltip.html(_this.getTooltip(d))
                .style('left', x + 'px')
                .style('top', y + 'px')
                .transition()
                .duration(_this.transitionDuration / 2)
                .ease(easeLinear)
                .style('opacity', 1);
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        function () {
            if (_this.inTransition) {
                return;
            }
            _this.hideTooltip();
        }))
            .transition()
            .delay((/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        function (d, i) { return _this.transitionDuration * (i + 1) / 10; }))
            .duration((/**
         * @return {?}
         */
        function () { return _this.transitionDuration; }))
            .ease(easeLinear)
            .style('opacity', 1)
            .call((/**
         * @param {?} transition
         * @param {?} callback
         * @return {?}
         */
        function (transition, callback) {
            if (transition.empty()) {
                callback();
            }
            /** @type {?} */
            var n = 0;
            transition.each((/**
             * @return {?}
             */
            function () { return ++n; })).on('end', (/**
             * @return {?}
             */
            function () {
                if (!--n) {
                    callback.apply(this, arguments);
                }
            }));
        }), (/**
         * @return {?}
         */
        function () { return _this.inTransition = false; }));
        // Add year labels
        this.labels.selectAll('.label-year').remove();
        this.labels.selectAll('.label-year')
            .data(yearLabels)
            .enter()
            .append('text')
            .attr('class', 'label label-year')
            .attr('font-size', (/**
         * @return {?}
         */
        function () { return Math.floor(_this.labelPadding / 3) + 'px'; }))
            .text((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d.year(); }))
            .attr('x', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return yearScale(d.year().toString()); }))
            .attr('y', this.labelPadding / 2)
            .on('mouseenter', (/**
         * @param {?} yearLabel
         * @return {?}
         */
        function (yearLabel) {
            if (_this.inTransition) {
                return;
            }
            _this.items.selectAll('.item-block-year')
                .transition()
                .duration(_this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) { return (d.date.year() === yearLabel.year()) ? 1 : 0.1; }));
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        function () {
            if (_this.inTransition) {
                return;
            }
            _this.items.selectAll('.item-block-year')
                .transition()
                .duration(_this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', 1);
        }))
            .on('click', (/**
         * @return {?}
         */
        function () {
            if (_this.inTransition) {
                return;
            }
            // Set in_transition flag
            _this.inTransition = true;
            // Set selected year to the one clicked on
            _this.selected = yearData[0];
            // Hide tooltip
            _this.hideTooltip();
            // Remove all global overview related items and labels
            _this.removeGlobalOverview();
            // Redraw the chart
            _this.overview = 'year';
            _this.drawChart();
        }));
    };
    /**
     * Draw year overview
     */
    /**
     * Draw year overview
     * @return {?}
     */
    CalendarHeatmapComponent.prototype.drawYearOverview = /**
     * Draw year overview
     * @return {?}
     */
    function () {
        var _this = this;
        // Add current overview to the history
        if (this.history[this.history.length - 1] !== this.overview) {
            this.history.push(this.overview);
        }
        // Define start and end date of the selected year
        /** @type {?} */
        var startOfYear = moment(this.selected.date).startOf('year');
        /** @type {?} */
        var endOfYear = moment(this.selected.date).endOf('year');
        // Filter data down to the selected year
        /** @type {?} */
        var yearData = this._data.filter((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d.date.isBetween(startOfYear, endOfYear, null, '[]'); }));
        yearData.forEach((/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            /** @type {?} */
            var summary = [];
            /** @type {?} */
            var group = _this.groupBy(d.details, 'name');
            Object.keys(group).forEach((/**
             * @param {?} k
             * @return {?}
             */
            function (k) {
                summary.push({
                    name: k,
                    total: group[k].reduce((/**
                     * @param {?} acc
                     * @param {?} o
                     * @return {?}
                     */
                    function (acc, o) {
                        return acc + o.value;
                    }), 0),
                    color: group[k][0].color,
                    id: group[k][0].id,
                });
            }));
            d.summary = summary;
        }));
        yearData = GTSLib.cleanArray(yearData);
        // Calculate max value of the year data
        /** @type {?} */
        var maxValue = max(yearData, (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d.total; }));
        /** @type {?} */
        var color = scaleLinear()
            .range([this.minColor || CalendarHeatmapComponent.DEF_MIN_COLOR, this.maxColor || CalendarHeatmapComponent.DEF_MAX_COLOR])
            .domain([-0.15 * maxValue, maxValue]);
        this.items.selectAll('.item-circle').remove();
        this.items.selectAll('.item-circle')
            .data(yearData)
            .enter()
            .append('rect')
            .attr('class', 'item item-circle').style('opacity', 0)
            .attr('x', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return _this.calcItemX(d, startOfYear) + (_this.itemSize - _this.calcItemSize(d, maxValue)) / 2; }))
            .attr('y', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return _this.calcItemY(d) + (_this.itemSize - _this.calcItemSize(d, maxValue)) / 2; }))
            .attr('rx', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return _this.calcItemSize(d, maxValue); }))
            .attr('ry', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return _this.calcItemSize(d, maxValue); }))
            .attr('width', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return _this.calcItemSize(d, maxValue); }))
            .attr('height', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return _this.calcItemSize(d, maxValue); }))
            .attr('fill', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return (d.total > 0) ? color(d.total) : 'transparent'; }))
            .on('click', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            if (_this.inTransition) {
                return;
            }
            // Don't transition if there is no data to show
            if (d.total === 0) {
                return;
            }
            _this.inTransition = true;
            // Set selected date to the one clicked on
            _this.selected = d;
            // Hide tooltip
            _this.hideTooltip();
            // Remove all year overview related items and labels
            _this.removeYearOverview();
            // Redraw the chart
            _this.overview = 'day';
            _this.drawChart();
        }))
            .on('mouseover', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            if (_this.inTransition) {
                return;
            }
            // Pulsating animation
            /** @type {?} */
            var circle = select(event.currentTarget);
            /** @type {?} */
            var repeat = (/**
             * @return {?}
             */
            function () {
                circle.transition()
                    .duration(_this.transitionDuration)
                    .ease(easeLinear)
                    .attr('x', (/**
                 * @param {?} data
                 * @return {?}
                 */
                function (data) { return _this.calcItemX(data, startOfYear) - (_this.itemSize * 1.1 - _this.itemSize) / 2; }))
                    .attr('y', (/**
                 * @param {?} data
                 * @return {?}
                 */
                function (data) { return _this.calcItemY(data) - (_this.itemSize * 1.1 - _this.itemSize) / 2; }))
                    .attr('width', _this.itemSize * 1.1)
                    .attr('height', _this.itemSize * 1.1)
                    .transition()
                    .duration(_this.transitionDuration)
                    .ease(easeLinear)
                    .attr('x', (/**
                 * @param {?} data
                 * @return {?}
                 */
                function (data) { return _this.calcItemX(data, startOfYear) + (_this.itemSize - _this.calcItemSize(data, maxValue)) / 2; }))
                    .attr('y', (/**
                 * @param {?} data
                 * @return {?}
                 */
                function (data) { return _this.calcItemY(data) + (_this.itemSize - _this.calcItemSize(data, maxValue)) / 2; }))
                    .attr('width', (/**
                 * @param {?} data
                 * @return {?}
                 */
                function (data) { return _this.calcItemSize(data, maxValue); }))
                    .attr('height', (/**
                 * @param {?} data
                 * @return {?}
                 */
                function (data) { return _this.calcItemSize(data, maxValue); }))
                    .on('end', repeat);
            });
            repeat();
            // Construct tooltip
            // Calculate tooltip position
            /** @type {?} */
            var x = _this.calcItemX(d, startOfYear) + _this.itemSize / 2;
            if (_this.gWidth - x < (_this.tooltipWidth + _this.tooltipPadding * 3)) {
                x -= _this.tooltipWidth + _this.tooltipPadding * 2;
            }
            /** @type {?} */
            var y = _this.calcItemY(d) + _this.itemSize / 2;
            // Show tooltip
            _this.tooltip.html(_this.getTooltip(d))
                .style('left', x + 'px')
                .style('top', y + 'px')
                .transition()
                .duration(_this.transitionDuration / 2)
                .ease(easeLinear)
                .style('opacity', 1);
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        function () {
            if (_this.inTransition) {
                return;
            }
            // Set circle radius back to what it's supposed to be
            select(event.currentTarget).transition()
                .duration(_this.transitionDuration / 2)
                .ease(easeLinear)
                .attr('x', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) { return _this.calcItemX(d, startOfYear) + (_this.itemSize - _this.calcItemSize(d, maxValue)) / 2; }))
                .attr('y', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) { return _this.calcItemY(d) + (_this.itemSize - _this.calcItemSize(d, maxValue)) / 2; }))
                .attr('width', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) { return _this.calcItemSize(d, maxValue); }))
                .attr('height', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) { return _this.calcItemSize(d, maxValue); }));
            // Hide tooltip
            _this.hideTooltip();
        }))
            .transition()
            .delay((/**
         * @return {?}
         */
        function () { return (Math.cos(Math.PI * Math.random()) + 1) * _this.transitionDuration; }))
            .duration((/**
         * @return {?}
         */
        function () { return _this.transitionDuration; }))
            .ease(easeLinear)
            .style('opacity', 1)
            .call((/**
         * @param {?} transition
         * @param {?} callback
         * @return {?}
         */
        function (transition, callback) {
            if (transition.empty()) {
                callback();
            }
            /** @type {?} */
            var n = 0;
            transition.each((/**
             * @return {?}
             */
            function () { return ++n; })).on('end', (/**
             * @return {?}
             */
            function () {
                if (!--n) {
                    callback.apply(this, arguments);
                }
            }));
        }), (/**
         * @return {?}
         */
        function () { return _this.inTransition = false; }));
        // Add month labels
        /** @type {?} */
        var duration = Math.ceil(moment.duration(endOfYear.diff(startOfYear)).asMonths());
        /** @type {?} */
        var monthLabels = [];
        for (var i = 1; i < duration; i++) {
            monthLabels.push(moment(this.selected.date).month((startOfYear.month() + i) % 12).startOf('month'));
        }
        /** @type {?} */
        var monthScale = scaleLinear().range([0, this.gWidth]).domain([0, monthLabels.length]);
        this.labels.selectAll('.label-month').remove();
        this.labels.selectAll('.label-month')
            .data(monthLabels)
            .enter()
            .append('text')
            .attr('class', 'label label-month')
            .attr('font-size', (/**
         * @return {?}
         */
        function () { return Math.floor(_this.labelPadding / 3) + 'px'; }))
            .text((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d.format('MMM'); }))
            .attr('x', (/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        function (d, i) { return monthScale(i) + (monthScale(i) - monthScale(i - 1)) / 2; }))
            .attr('y', this.labelPadding / 2)
            .on('mouseenter', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            if (_this.inTransition) {
                return;
            }
            /** @type {?} */
            var selectedMonth = moment(d);
            _this.items.selectAll('.item-circle')
                .transition()
                .duration(_this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', (/**
             * @param {?} data
             * @return {?}
             */
            function (data) { return moment(data.date).isSame(selectedMonth, 'month') ? 1 : 0.1; }));
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        function () {
            if (_this.inTransition) {
                return;
            }
            _this.items.selectAll('.item-circle')
                .transition()
                .duration(_this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', 1);
        }))
            .on('click', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            if (_this.inTransition) {
                return;
            }
            // Check month data
            /** @type {?} */
            var monthData = _this._data.filter((/**
             * @param {?} e
             * @return {?}
             */
            function (e) { return e.date.isBetween(moment(d).startOf('month'), moment(d).endOf('month'), null, '[]'); }));
            // Don't transition if there is no data to show
            if (!monthData.length) {
                return;
            }
            // Set selected month to the one clicked on
            _this.selected = { date: d };
            _this.inTransition = true;
            // Hide tooltip
            _this.hideTooltip();
            // Remove all year overview related items and labels
            _this.removeYearOverview();
            // Redraw the chart
            _this.overview = 'month';
            _this.drawChart();
        }));
        // Add day labels
        /** @type {?} */
        var dayLabels = timeDays(moment.utc().startOf('week').toDate(), moment.utc().endOf('week').toDate());
        /** @type {?} */
        var dayScale = scaleBand()
            .rangeRound([this.labelPadding, this.gHeight])
            .domain(dayLabels.map((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return moment.utc(d).weekday().toString(); })));
        this.labels.selectAll('.label-day').remove();
        this.labels.selectAll('.label-day')
            .data(dayLabels)
            .enter()
            .append('text')
            .attr('class', 'label label-day')
            .attr('x', this.labelPadding / 3)
            .attr('y', (/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        function (d, i) { return dayScale(i.toString()) + dayScale.bandwidth() / 1.75; }))
            .style('text-anchor', 'left')
            .attr('font-size', (/**
         * @return {?}
         */
        function () { return Math.floor(_this.labelPadding / 3) + 'px'; }))
            .text((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return moment.utc(d).format('dddd')[0]; }))
            .on('mouseenter', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            if (_this.inTransition) {
                return;
            }
            /** @type {?} */
            var selectedDay = moment.utc(d);
            _this.items.selectAll('.item-circle')
                .transition()
                .duration(_this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', (/**
             * @param {?} data
             * @return {?}
             */
            function (data) { return (moment(data.date).day() === selectedDay.day()) ? 1 : 0.1; }));
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        function () {
            if (_this.inTransition) {
                return;
            }
            _this.items.selectAll('.item-circle')
                .transition()
                .duration(_this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', 1);
        }));
        // Add button to switch back to previous overview
        this.drawButton();
    };
    /**
     * @return {?}
     */
    CalendarHeatmapComponent.prototype.drawMonthOverview = /**
     * @return {?}
     */
    function () {
        var _this = this;
        // Add current overview to the history
        if (this.history[this.history.length - 1] !== this.overview) {
            this.history.push(this.overview);
        }
        // Define beginning and end of the month
        /** @type {?} */
        var startOfMonth = moment(this.selected.date).startOf('month');
        /** @type {?} */
        var endOfMonth = moment(this.selected.date).endOf('month');
        // Filter data down to the selected month
        /** @type {?} */
        var monthData = [];
        this._data.filter((/**
         * @param {?} data
         * @return {?}
         */
        function (data) { return data.date.isBetween(startOfMonth, endOfMonth, null, '[]'); }))
            .map((/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            /** @type {?} */
            var scale = [];
            d.details.forEach((/**
             * @param {?} det
             * @return {?}
             */
            function (det) {
                /** @type {?} */
                var date = moment.utc(det.date);
                /** @type {?} */
                var i = Math.floor(date.hours() / 3);
                if (!scale[i]) {
                    scale[i] = {
                        date: date.startOf('hour'),
                        total: 0,
                        details: [],
                        summary: []
                    };
                }
                scale[i].total += det.value;
                scale[i].details.push(det);
            }));
            scale.forEach((/**
             * @param {?} s
             * @return {?}
             */
            function (s) {
                /** @type {?} */
                var group = _this.groupBy(s.details, 'name');
                Object.keys(group).forEach((/**
                 * @param {?} k
                 * @return {?}
                 */
                function (k) {
                    s.summary.push({
                        name: k,
                        total: sum(group[k], (/**
                         * @param {?} data
                         * @return {?}
                         */
                        function (data) { return data.total; })),
                        color: group[k][0].color
                    });
                }));
            }));
            monthData = monthData.concat(scale);
        }));
        monthData = GTSLib.cleanArray(monthData);
        this.LOG.debug(['drawMonthOverview'], [this.overview, this.selected, monthData]);
        /** @type {?} */
        var maxValue = max(monthData, (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d.total; }));
        // Define day labels and axis
        /** @type {?} */
        var dayLabels = timeDays(moment(this.selected.date).startOf('week').toDate(), moment(this.selected.date).endOf('week').toDate());
        /** @type {?} */
        var dayScale = scaleBand()
            .rangeRound([this.labelPadding, this.gHeight])
            .domain(dayLabels.map((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return moment.utc(d).weekday().toString(); })));
        // Define week labels and axis
        /** @type {?} */
        var weekLabels = [startOfMonth];
        /** @type {?} */
        var incWeek = moment(startOfMonth);
        while (incWeek.week() !== endOfMonth.week()) {
            weekLabels.push(moment(incWeek.add(1, 'week')));
        }
        monthData.forEach((/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            /** @type {?} */
            var summary = [];
            /** @type {?} */
            var group = _this.groupBy(d.details, 'name');
            Object.keys(group).forEach((/**
             * @param {?} k
             * @return {?}
             */
            function (k) {
                summary.push({
                    name: k,
                    total: group[k].reduce((/**
                     * @param {?} acc
                     * @param {?} o
                     * @return {?}
                     */
                    function (acc, o) { return acc + o.value; }), 0),
                    color: group[k][0].color,
                    id: group[k][0].id,
                });
            }));
            d.summary = summary;
        }));
        /** @type {?} */
        var weekScale = scaleBand()
            .rangeRound([this.labelPadding, this.gWidth])
            .padding(0.05)
            .domain(weekLabels.map((/**
         * @param {?} weekday
         * @return {?}
         */
        function (weekday) { return weekday.week() + ''; })));
        /** @type {?} */
        var color = scaleLinear()
            .range([this.minColor || CalendarHeatmapComponent.DEF_MIN_COLOR, this.maxColor || CalendarHeatmapComponent.DEF_MAX_COLOR])
            .domain([-0.15 * maxValue, maxValue]);
        // Add month data items to the overview
        this.items.selectAll('.item-block-month').remove();
        this.items.selectAll('.item-block-month')
            .data(monthData)
            .enter().append('rect')
            .style('opacity', 0)
            .attr('class', 'item item-block-month')
            .attr('y', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return _this.calcItemY(d)
            + (_this.itemSize - _this.calcItemSize(d, maxValue)) / 2; }))
            .attr('x', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return _this.calcItemXMonth(d, startOfMonth, weekScale(d.date.week().toString()))
            + (_this.itemSize - _this.calcItemSize(d, maxValue)) / 2; }))
            .attr('rx', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return _this.calcItemSize(d, maxValue); }))
            .attr('ry', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return _this.calcItemSize(d, maxValue); }))
            .attr('width', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return _this.calcItemSize(d, maxValue); }))
            .attr('height', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return _this.calcItemSize(d, maxValue); }))
            .attr('fill', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return (d.total > 0) ? color(d.total) : 'transparent'; }))
            .on('click', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            if (_this.inTransition) {
                return;
            }
            // Don't transition if there is no data to show
            if (d.total === 0) {
                return;
            }
            _this.inTransition = true;
            // Set selected date to the one clicked on
            _this.selected = d;
            // Hide tooltip
            _this.hideTooltip();
            // Remove all month overview related items and labels
            _this.removeMonthOverview();
            // Redraw the chart
            _this.overview = 'day';
            _this.drawChart();
        }))
            .on('mouseover', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            if (_this.inTransition) {
                return;
            }
            // Construct tooltip
            // Calculate tooltip position
            /** @type {?} */
            var x = weekScale(d.date.week().toString()) + _this.tooltipPadding;
            while (_this.gWidth - x < (_this.tooltipWidth + _this.tooltipPadding * 3)) {
                x -= 10;
            }
            /** @type {?} */
            var y = dayScale(d.date.weekday().toString()) + _this.tooltipPadding;
            // Show tooltip
            _this.tooltip.html(_this.getTooltip(d))
                .style('left', x + 'px')
                .style('top', y + 'px')
                .transition()
                .duration(_this.transitionDuration / 2)
                .ease(easeLinear)
                .style('opacity', 1);
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        function () {
            if (_this.inTransition) {
                return;
            }
            _this.hideTooltip();
        }))
            .transition()
            .delay((/**
         * @return {?}
         */
        function () { return (Math.cos(Math.PI * Math.random()) + 1) * _this.transitionDuration; }))
            .duration((/**
         * @return {?}
         */
        function () { return _this.transitionDuration; }))
            .ease(easeLinear)
            .style('opacity', 1)
            .call((/**
         * @param {?} transition
         * @param {?} callback
         * @return {?}
         */
        function (transition, callback) {
            if (transition.empty()) {
                callback();
            }
            /** @type {?} */
            var n = 0;
            transition.each((/**
             * @return {?}
             */
            function () { return ++n; })).on('end', (/**
             * @return {?}
             */
            function () {
                if (!--n) {
                    callback.apply(this, arguments);
                }
            }));
        }), (/**
         * @return {?}
         */
        function () { return _this.inTransition = false; }));
        // Add week labels
        this.labels.selectAll('.label-week').remove();
        this.labels.selectAll('.label-week')
            .data(weekLabels)
            .enter()
            .append('text')
            .attr('class', 'label label-week')
            .attr('font-size', (/**
         * @return {?}
         */
        function () { return Math.floor(_this.labelPadding / 3) + 'px'; }))
            .text((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return 'Week ' + d.week(); }))
            .attr('x', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return weekScale(d.week().toString()); }))
            .attr('y', this.labelPadding / 2)
            .on('mouseenter', (/**
         * @param {?} weekday
         * @return {?}
         */
        function (weekday) {
            if (_this.inTransition) {
                return;
            }
            _this.items.selectAll('.item-block-month')
                .transition()
                .duration(_this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) {
                return (moment(d.date).week() === weekday.week()) ? 1 : 0.1;
            }));
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        function () {
            if (_this.inTransition) {
                return;
            }
            _this.items.selectAll('.item-block-month')
                .transition()
                .duration(_this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', 1);
        }))
            .on('click', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            if (_this.inTransition) {
                return;
            }
            _this.inTransition = true;
            // Set selected month to the one clicked on
            _this.selected = { date: d };
            // Hide tooltip
            _this.hideTooltip();
            // Remove all year overview related items and labels
            _this.removeMonthOverview();
            // Redraw the chart
            _this.overview = 'week';
            _this.drawChart();
        }));
        // Add day labels
        this.labels.selectAll('.label-day').remove();
        this.labels.selectAll('.label-day')
            .data(dayLabels)
            .enter()
            .append('text')
            .attr('class', 'label label-day')
            .attr('x', this.labelPadding / 3)
            .attr('y', (/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        function (d, i) { return dayScale(i) + dayScale.bandwidth() / 1.75; }))
            .style('text-anchor', 'left')
            .attr('font-size', (/**
         * @return {?}
         */
        function () { return Math.floor(_this.labelPadding / 3) + 'px'; }))
            .text((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return moment.utc(d).format('dddd')[0]; }))
            .on('mouseenter', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            if (_this.inTransition) {
                return;
            }
            /** @type {?} */
            var selectedDay = moment.utc(d);
            _this.items.selectAll('.item-block-month')
                .transition()
                .duration(_this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', (/**
             * @param {?} data
             * @return {?}
             */
            function (data) { return (moment(data.date).day() === selectedDay.day()) ? 1 : 0.1; }));
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        function () {
            if (_this.inTransition) {
                return;
            }
            _this.items.selectAll('.item-block-month')
                .transition()
                .duration(_this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', 1);
        }));
        // Add button to switch back to previous overview
        this.drawButton();
    };
    /**
     * @return {?}
     */
    CalendarHeatmapComponent.prototype.drawWeekOverview = /**
     * @return {?}
     */
    function () {
        var _this = this;
        // Add current overview to the history
        if (this.history[this.history.length - 1] !== this.overview) {
            this.history.push(this.overview);
        }
        // Define beginning and end of the week
        /** @type {?} */
        var startOfWeek = moment(this.selected.date).startOf('week');
        /** @type {?} */
        var endOfWeek = moment(this.selected.date).endOf('week');
        // Filter data down to the selected week
        /** @type {?} */
        var weekData = [];
        this._data.filter((/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            return d.date.isBetween(startOfWeek, endOfWeek, null, '[]');
        })).map((/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            /** @type {?} */
            var scale = [];
            d.details.forEach((/**
             * @param {?} det
             * @return {?}
             */
            function (det) {
                /** @type {?} */
                var date = moment(det.date);
                /** @type {?} */
                var i = date.hours();
                if (!scale[i]) {
                    scale[i] = {
                        date: date.startOf('hour'),
                        total: 0,
                        details: [],
                        summary: []
                    };
                }
                scale[i].total += det.value;
                scale[i].details.push(det);
            }));
            scale.forEach((/**
             * @param {?} s
             * @return {?}
             */
            function (s) {
                /** @type {?} */
                var group = _this.groupBy(s.details, 'name');
                Object.keys(group).forEach((/**
                 * @param {?} k
                 * @return {?}
                 */
                function (k) {
                    return s.summary.push({
                        name: k,
                        total: sum(group[k], (/**
                         * @param {?} data
                         * @return {?}
                         */
                        function (data) { return data.value; })),
                        color: group[k][0].color
                    });
                }));
            }));
            weekData = weekData.concat(scale);
        }));
        weekData = GTSLib.cleanArray(weekData);
        /** @type {?} */
        var maxValue = max(weekData, (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d.total; }));
        // Define day labels and axis
        /** @type {?} */
        var dayLabels = timeDays(moment.utc().startOf('week').toDate(), moment.utc().endOf('week').toDate());
        /** @type {?} */
        var dayScale = scaleBand()
            .rangeRound([this.labelPadding, this.gHeight])
            .domain(dayLabels.map((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return moment.utc(d).weekday().toString(); })));
        // Define hours labels and axis
        /** @type {?} */
        var hoursLabels = [];
        range(0, 24).forEach((/**
         * @param {?} h
         * @return {?}
         */
        function (h) { return hoursLabels.push(moment.utc().hours(h).startOf('hour').format('HH:mm')); }));
        /** @type {?} */
        var hourScale = scaleBand().rangeRound([this.labelPadding, this.gWidth]).padding(0.01).domain(hoursLabels);
        /** @type {?} */
        var color = scaleLinear()
            .range([this.minColor || CalendarHeatmapComponent.DEF_MIN_COLOR, this.maxColor || CalendarHeatmapComponent.DEF_MAX_COLOR])
            .domain([-0.15 * maxValue, maxValue]);
        // Add week data items to the overview
        this.items.selectAll('.item-block-week').remove();
        this.items.selectAll('.item-block-week')
            .data(weekData)
            .enter()
            .append('rect')
            .style('opacity', 0)
            .attr('class', 'item item-block-week')
            .attr('y', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return _this.calcItemY(d)
            + (_this.itemSize - _this.calcItemSize(d, maxValue)) / 2; }))
            .attr('x', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return _this.gutter
            + hourScale(moment(d.date).startOf('hour').format('HH:mm'))
            + (_this.itemSize - _this.calcItemSize(d, maxValue)) / 2; }))
            .attr('rx', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return _this.calcItemSize(d, maxValue); }))
            .attr('ry', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return _this.calcItemSize(d, maxValue); }))
            .attr('width', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return _this.calcItemSize(d, maxValue); }))
            .attr('height', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return _this.calcItemSize(d, maxValue); }))
            .attr('fill', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return (d.total > 0) ? color(d.total) : 'transparent'; }))
            .on('click', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            if (_this.inTransition) {
                return;
            }
            // Don't transition if there is no data to show
            if (d.total === 0) {
                return;
            }
            _this.inTransition = true;
            // Set selected date to the one clicked on
            _this.selected = d;
            // Hide tooltip
            _this.hideTooltip();
            // Remove all week overview related items and labels
            _this.removeWeekOverview();
            // Redraw the chart
            _this.overview = 'day';
            _this.drawChart();
        })).on('mouseover', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            if (_this.inTransition) {
                return;
            }
            // Calculate tooltip position
            /** @type {?} */
            var x = hourScale(moment(d.date).startOf('hour').format('HH:mm')) + _this.tooltipPadding;
            while (_this.gWidth - x < (_this.tooltipWidth + _this.tooltipPadding * 3)) {
                x -= 10;
            }
            /** @type {?} */
            var y = dayScale(d.date.weekday().toString()) + _this.tooltipPadding;
            // Show tooltip
            _this.tooltip.html(_this.getTooltip(d))
                .style('left', x + 'px')
                .style('top', y + 'px')
                .transition()
                .duration(_this.transitionDuration / 2)
                .ease(easeLinear)
                .style('opacity', 1);
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        function () {
            if (_this.inTransition) {
                return;
            }
            _this.hideTooltip();
        }))
            .transition()
            .delay((/**
         * @return {?}
         */
        function () { return (Math.cos(Math.PI * Math.random()) + 1) * _this.transitionDuration; }))
            .duration((/**
         * @return {?}
         */
        function () { return _this.transitionDuration; }))
            .ease(easeLinear)
            .style('opacity', 1)
            .call((/**
         * @param {?} transition
         * @param {?} callback
         * @return {?}
         */
        function (transition, callback) {
            if (transition.empty()) {
                callback();
            }
            /** @type {?} */
            var n = 0;
            transition.each((/**
             * @return {?}
             */
            function () { return ++n; })).on('end', (/**
             * @return {?}
             */
            function () {
                if (!--n) {
                    callback.apply(this, arguments);
                }
            }));
        }), (/**
         * @return {?}
         */
        function () { return _this.inTransition = false; }));
        // Add week labels
        this.labels.selectAll('.label-week').remove();
        this.labels.selectAll('.label-week')
            .data(hoursLabels)
            .enter()
            .append('text')
            .attr('class', 'label label-week')
            .attr('font-size', (/**
         * @return {?}
         */
        function () { return Math.floor(_this.labelPadding / 3) + 'px'; }))
            .text((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d; }))
            .attr('x', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return hourScale(d); }))
            .attr('y', this.labelPadding / 2)
            .on('mouseenter', (/**
         * @param {?} hour
         * @return {?}
         */
        function (hour) {
            if (_this.inTransition) {
                return;
            }
            _this.items.selectAll('.item-block-week')
                .transition()
                .duration(_this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) { return (moment(d.date).startOf('hour').format('HH:mm') === hour) ? 1 : 0.1; }));
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        function () {
            if (_this.inTransition) {
                return;
            }
            _this.items.selectAll('.item-block-week')
                .transition()
                .duration(_this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', 1);
        }));
        // Add day labels
        this.labels.selectAll('.label-day').remove();
        this.labels.selectAll('.label-day')
            .data(dayLabels)
            .enter()
            .append('text')
            .attr('class', 'label label-day')
            .attr('x', this.labelPadding / 3)
            .attr('y', (/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        function (d, i) { return dayScale(i.toString()) + dayScale.bandwidth() / 1.75; }))
            .style('text-anchor', 'left')
            .attr('font-size', (/**
         * @return {?}
         */
        function () { return Math.floor(_this.labelPadding / 3) + 'px'; }))
            .text((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return moment.utc(d).format('dddd')[0]; }))
            .on('mouseenter', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            if (_this.inTransition) {
                return;
            }
            /** @type {?} */
            var selectedDay = moment.utc(d);
            _this.items.selectAll('.item-block-week')
                .transition()
                .duration(_this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', (/**
             * @param {?} data
             * @return {?}
             */
            function (data) { return (moment(data.date).day() === selectedDay.day()) ? 1 : 0.1; }));
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        function () {
            if (_this.inTransition) {
                return;
            }
            _this.items.selectAll('.item-block-week')
                .transition()
                .duration(_this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', 1);
        }));
        // Add button to switch back to previous overview
        this.drawButton();
    };
    /**
     * @return {?}
     */
    CalendarHeatmapComponent.prototype.drawDayOverview = /**
     * @return {?}
     */
    function () {
        var _this = this;
        // Add current overview to the history
        if (this.history[this.history.length - 1] !== this.overview) {
            this.history.push(this.overview);
        }
        // Initialize selected date to today if it was not set
        if (!Object.keys(this.selected).length) {
            this.selected = this._data[this._data.length - 1];
        }
        /** @type {?} */
        var startOfDay = moment(this.selected.date).startOf('day');
        /** @type {?} */
        var endOfDay = moment(this.selected.date).endOf('day');
        // Filter data down to the selected month
        /** @type {?} */
        var dayData = [];
        this._data.filter((/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            return d.date.isBetween(startOfDay, endOfDay, null, '[]');
        })).map((/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            /** @type {?} */
            var scale = [];
            d.details.forEach((/**
             * @param {?} det
             * @return {?}
             */
            function (det) {
                /** @type {?} */
                var date = moment(det.date);
                /** @type {?} */
                var i = date.hours();
                if (!scale[i]) {
                    scale[i] = {
                        date: date.startOf('hour'),
                        total: 0,
                        details: [],
                        summary: []
                    };
                }
                scale[i].total += det.value;
                scale[i].details.push(det);
            }));
            scale.forEach((/**
             * @param {?} s
             * @return {?}
             */
            function (s) {
                /** @type {?} */
                var group = _this.groupBy(s.details, 'name');
                Object.keys(group).forEach((/**
                 * @param {?} k
                 * @return {?}
                 */
                function (k) {
                    s.summary.push({
                        name: k,
                        total: sum(group[k], (/**
                         * @param {?} item
                         * @return {?}
                         */
                        function (item) { return item.value; })),
                        color: group[k][0].color
                    });
                }));
            }));
            dayData = dayData.concat(scale);
        }));
        /** @type {?} */
        var data = [];
        dayData.forEach((/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            /** @type {?} */
            var date = d.date;
            d.summary.forEach((/**
             * @param {?} s
             * @return {?}
             */
            function (s) {
                s.date = date;
                data.push(s);
            }));
        }));
        dayData = GTSLib.cleanArray(dayData);
        /** @type {?} */
        var maxValue = max(data, (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d.total; }));
        /** @type {?} */
        var gtsNames = this.selected.summary.map((/**
         * @param {?} summary
         * @return {?}
         */
        function (summary) { return summary.name; }));
        /** @type {?} */
        var gtsNameScale = scaleBand().rangeRound([this.labelPadding, this.gHeight]).domain(gtsNames);
        /** @type {?} */
        var hourLabels = [];
        range(0, 24).forEach((/**
         * @param {?} h
         * @return {?}
         */
        function (h) { return hourLabels.push(moment.utc().hours(h).startOf('hour').format('HH:mm')); }));
        /** @type {?} */
        var dayScale = scaleBand()
            .rangeRound([this.labelPadding, this.gWidth])
            .padding(0.01)
            .domain(hourLabels);
        this.items.selectAll('.item-block').remove();
        this.items.selectAll('.item-block')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'item item-block')
            .attr('x', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return _this.gutter
            + dayScale(moment(d.date).startOf('hour').format('HH:mm'))
            + (_this.itemSize - _this.calcItemSize(d, maxValue)) / 2; }))
            .attr('y', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            return (gtsNameScale(d.name) || 1) - (_this.itemSize - _this.calcItemSize(d, maxValue)) / 2;
        }))
            .attr('rx', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return _this.calcItemSize(d, maxValue); }))
            .attr('ry', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return _this.calcItemSize(d, maxValue); }))
            .attr('width', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return _this.calcItemSize(d, maxValue); }))
            .attr('height', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return _this.calcItemSize(d, maxValue); }))
            .attr('fill', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            /** @type {?} */
            var color = scaleLinear()
                .range(['#ffffff', d.color || CalendarHeatmapComponent.DEF_MIN_COLOR])
                .domain([-0.5 * maxValue, maxValue]);
            return color(d.total);
        }))
            .style('opacity', 0)
            .on('mouseover', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            if (_this.inTransition) {
                return;
            }
            // Calculate tooltip position
            /** @type {?} */
            var x = dayScale(moment(d.date).startOf('hour').format('HH:mm')) + _this.tooltipPadding;
            while (_this.gWidth - x < (_this.tooltipWidth + _this.tooltipPadding * 3)) {
                x -= 10;
            }
            /** @type {?} */
            var y = gtsNameScale(d.name) + _this.tooltipPadding;
            // Show tooltip
            _this.tooltip.html(_this.getTooltip(d))
                .style('left', x + 'px')
                .style('top', y + 'px')
                .transition()
                .duration(_this.transitionDuration / 2)
                .ease(easeLinear)
                .style('opacity', 1);
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        function () {
            if (_this.inTransition) {
                return;
            }
            _this.hideTooltip();
        }))
            .on('click', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            if (_this.handler) {
                _this.handler.emit(d);
            }
        }))
            .transition()
            .delay((/**
         * @return {?}
         */
        function () { return (Math.cos(Math.PI * Math.random()) + 1) * _this.transitionDuration; }))
            .duration((/**
         * @return {?}
         */
        function () { return _this.transitionDuration; }))
            .ease(easeLinear)
            .style('opacity', 1)
            .call((/**
         * @param {?} transition
         * @param {?} callback
         * @return {?}
         */
        function (transition, callback) {
            if (transition.empty()) {
                callback();
            }
            /** @type {?} */
            var n = 0;
            transition.each((/**
             * @return {?}
             */
            function () { return ++n; })).on('end', (/**
             * @return {?}
             */
            function () {
                if (!--n) {
                    callback.apply(this, arguments);
                }
            }));
        }), (/**
         * @return {?}
         */
        function () { return _this.inTransition = false; }));
        // Add time labels
        this.labels.selectAll('.label-time').remove();
        this.labels.selectAll('.label-time')
            .data(hourLabels)
            .enter()
            .append('text')
            .attr('class', 'label label-time')
            .attr('font-size', (/**
         * @return {?}
         */
        function () { return Math.floor(_this.labelPadding / 3) + 'px'; }))
            .text((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d; }))
            .attr('x', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return dayScale(d); }))
            .attr('y', this.labelPadding / 2)
            .on('mouseenter', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) {
            if (_this.inTransition) {
                return;
            }
            /** @type {?} */
            var selected = d;
            // const selected = itemScale(moment.utc(d));
            _this.items.selectAll('.item-block')
                .transition()
                .duration(_this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', (/**
             * @param {?} item
             * @return {?}
             */
            function (item) { return (item.date.format('HH:mm') === selected) ? 1 : 0.1; }));
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        function () {
            if (_this.inTransition) {
                return;
            }
            _this.items.selectAll('.item-block')
                .transition()
                .duration(_this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', 1);
        }));
        // Add project labels
        /** @type {?} */
        var labelPadding = this.labelPadding;
        this.labels.selectAll('.label-project').remove();
        this.labels.selectAll('.label-project')
            .data(gtsNames)
            .enter()
            .append('text')
            .attr('class', 'label label-project')
            .attr('x', this.gutter)
            .attr('y', (/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return gtsNameScale(d) + _this.itemSize / 2; }))
            .attr('min-height', (/**
         * @return {?}
         */
        function () { return gtsNameScale.bandwidth(); }))
            .style('text-anchor', 'left')
            .attr('font-size', (/**
         * @return {?}
         */
        function () { return Math.floor(_this.labelPadding / 3) + 'px'; }))
            .text((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d; }))
            .each((/**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var obj = select(this);
            /** @type {?} */
            var textLength = obj.node().getComputedTextLength();
            /** @type {?} */
            var text = obj.text();
            while (textLength > (labelPadding * 1.5) && text.length > 0) {
                text = text.slice(0, -1);
                obj.text(text + '...');
                textLength = obj.node().getComputedTextLength();
            }
        }))
            .on('mouseenter', (/**
         * @param {?} gtsName
         * @return {?}
         */
        function (gtsName) {
            if (_this.inTransition) {
                return;
            }
            _this.items.selectAll('.item-block')
                .transition()
                .duration(_this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', (/**
             * @param {?} d
             * @return {?}
             */
            function (d) { return (d.name === gtsName) ? 1 : 0.1; }));
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        function () {
            if (_this.inTransition) {
                return;
            }
            _this.items.selectAll('.item-block')
                .transition()
                .duration(_this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', 1);
        }));
        // Add button to switch back to previous overview
        this.drawButton();
    };
    /**
     * @private
     * @param {?} d
     * @param {?} startOfYear
     * @return {?}
     */
    CalendarHeatmapComponent.prototype.calcItemX = /**
     * @private
     * @param {?} d
     * @param {?} startOfYear
     * @return {?}
     */
    function (d, startOfYear) {
        /** @type {?} */
        var dayIndex = Math.round((+moment(d.date) - +startOfYear.startOf('week')) / 86400000);
        /** @type {?} */
        var colIndex = Math.trunc(dayIndex / 7);
        return colIndex * (this.itemSize + this.gutter) + this.labelPadding;
    };
    /**
     * @private
     * @param {?} d
     * @param {?} start
     * @param {?} offset
     * @return {?}
     */
    CalendarHeatmapComponent.prototype.calcItemXMonth = /**
     * @private
     * @param {?} d
     * @param {?} start
     * @param {?} offset
     * @return {?}
     */
    function (d, start, offset) {
        /** @type {?} */
        var hourIndex = moment(d.date).hours();
        /** @type {?} */
        var colIndex = Math.trunc(hourIndex / 3);
        return colIndex * (this.itemSize + this.gutter) + offset;
    };
    /**
     * @private
     * @param {?} d
     * @return {?}
     */
    CalendarHeatmapComponent.prototype.calcItemY = /**
     * @private
     * @param {?} d
     * @return {?}
     */
    function (d) {
        return this.labelPadding + d.date.weekday() * (this.itemSize + this.gutter);
    };
    /**
     * @private
     * @param {?} d
     * @param {?} m
     * @return {?}
     */
    CalendarHeatmapComponent.prototype.calcItemSize = /**
     * @private
     * @param {?} d
     * @param {?} m
     * @return {?}
     */
    function (d, m) {
        if (m <= 0) {
            return this.itemSize;
        }
        return this.itemSize * 0.75 + (this.itemSize * d.total / m) * 0.25;
    };
    /**
     * @private
     * @return {?}
     */
    CalendarHeatmapComponent.prototype.drawButton = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        this.buttons.selectAll('.button').remove();
        /** @type {?} */
        var button = this.buttons.append('g')
            .attr('class', 'button button-back')
            .style('opacity', 0)
            .on('click', (/**
         * @return {?}
         */
        function () {
            if (_this.inTransition) {
                return;
            }
            // Set transition boolean
            _this.inTransition = true;
            // Clean the canvas from whichever overview type was on
            if (_this.overview === 'year') {
                _this.removeYearOverview();
            }
            else if (_this.overview === 'month') {
                _this.removeMonthOverview();
            }
            else if (_this.overview === 'week') {
                _this.removeWeekOverview();
            }
            else if (_this.overview === 'day') {
                _this.removeDayOverview();
            }
            // Redraw the chart
            _this.history.pop();
            _this.overview = _this.history.pop();
            _this.drawChart();
        }));
        button.append('circle')
            .attr('cx', this.labelPadding / 2.25)
            .attr('cy', this.labelPadding / 2.5)
            .attr('r', this.itemSize / 2);
        button.append('text')
            .attr('x', this.labelPadding / 2.25)
            .attr('y', this.labelPadding / 2.5)
            .attr('dy', (/**
         * @return {?}
         */
        function () {
            return Math.floor(_this.gWidth / 100) / 3;
        }))
            .attr('font-size', (/**
         * @return {?}
         */
        function () {
            return Math.floor(_this.labelPadding / 3) + 'px';
        }))
            .html('&#x2190;');
        button.transition()
            .duration(this.transitionDuration)
            .ease(easeLinear)
            .style('opacity', 1);
    };
    /**
     * @private
     * @return {?}
     */
    CalendarHeatmapComponent.prototype.removeGlobalOverview = /**
     * @private
     * @return {?}
     */
    function () {
        this.items.selectAll('.item-block-year')
            .transition()
            .duration(this.transitionDuration)
            .ease(easeLinear)
            .style('opacity', 0)
            .remove();
        this.labels.selectAll('.label-year').remove();
    };
    /**
     * @private
     * @return {?}
     */
    CalendarHeatmapComponent.prototype.removeYearOverview = /**
     * @private
     * @return {?}
     */
    function () {
        this.items.selectAll('.item-circle')
            .transition()
            .duration(this.transitionDuration)
            .ease(easeLinear)
            .style('opacity', 0)
            .remove();
        this.labels.selectAll('.label-day').remove();
        this.labels.selectAll('.label-month').remove();
        this.hideBackButton();
    };
    /**
     * @private
     * @return {?}
     */
    CalendarHeatmapComponent.prototype.removeMonthOverview = /**
     * @private
     * @return {?}
     */
    function () {
        this.items.selectAll('.item-block-month')
            .transition()
            .duration(this.transitionDuration)
            .ease(easeLinear)
            .style('opacity', 0)
            .remove();
        this.labels.selectAll('.label-day').remove();
        this.labels.selectAll('.label-week').remove();
        this.hideBackButton();
    };
    /**
     * @private
     * @return {?}
     */
    CalendarHeatmapComponent.prototype.removeWeekOverview = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        this.items.selectAll('.item-block-week')
            .transition()
            .duration(this.transitionDuration)
            .ease(easeLinear)
            .style('opacity', 0)
            .attr('x', (/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        function (d, i) { return (i % 2 === 0) ? -_this.gWidth / 3 : _this.gWidth / 3; }))
            .remove();
        this.labels.selectAll('.label-day').remove();
        this.labels.selectAll('.label-week').remove();
        this.hideBackButton();
    };
    /**
     * @private
     * @return {?}
     */
    CalendarHeatmapComponent.prototype.removeDayOverview = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        this.items.selectAll('.item-block')
            .transition()
            .duration(this.transitionDuration)
            .ease(easeLinear)
            .style('opacity', 0)
            .attr('x', (/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        function (d, i) { return (i % 2 === 0) ? -_this.gWidth / 3 : _this.gWidth / 3; }))
            .remove();
        this.labels.selectAll('.label-time').remove();
        this.labels.selectAll('.label-project').remove();
        this.hideBackButton();
    };
    /**
     * @private
     * @return {?}
     */
    CalendarHeatmapComponent.prototype.hideTooltip = /**
     * @private
     * @return {?}
     */
    function () {
        this.tooltip.transition()
            .duration(this.transitionDuration / 2)
            .ease(easeLinear)
            .style('opacity', 0);
    };
    /**
     * Helper function to hide the back button
     */
    /**
     * Helper function to hide the back button
     * @private
     * @return {?}
     */
    CalendarHeatmapComponent.prototype.hideBackButton = /**
     * Helper function to hide the back button
     * @private
     * @return {?}
     */
    function () {
        this.buttons.selectAll('.button')
            .transition()
            .duration(this.transitionDuration)
            .ease(easeLinear)
            .style('opacity', 0)
            .remove();
    };
    CalendarHeatmapComponent.DEF_MIN_COLOR = '#ffffff';
    CalendarHeatmapComponent.DEF_MAX_COLOR = '#333333';
    CalendarHeatmapComponent.decorators = [
        { type: Component, args: [{
                    selector: 'calendar-heatmap',
                    template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div #chart></div>\n",
                    encapsulation: ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n *//*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}:host{position:relative;user-select:none;-ms-user-select:none;-moz-user-select:none;-webkit-user-select:none}:host .item{cursor:pointer}:host .label{cursor:pointer;fill:#aaa;font-family:Helvetica,arial,'Open Sans',sans-serif}:host .button{cursor:pointer;fill:transparent;stroke-width:2;stroke:#aaa}:host .button text{stroke-width:1;text-anchor:middle;fill:#aaa}:host .heatmap-tooltip{pointer-events:none;position:absolute;z-index:9999;width:450px;max-width:650px;overflow:hidden;padding:15px;font-size:12px;line-height:14px;color:#fff;font-family:Helvetica,arial,'Open Sans',sans-serif;background:rgba(0,0,0,.75)}:host .heatmap-tooltip ul{list-style:none;padding:0}:host .heatmap-tooltip ul li{padding:0}:host .heatmap-tooltip ul li .gtsInfo{padding-left:20px;width:auto;max-width:650px}:host .heatmap-tooltip .header strong{display:inline-block;width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}:host .heatmap-tooltip .round{border-radius:50%;background-color:#bbb;display:inline-block;width:12px;height:12px;border:2px solid #454545}"]
                }] }
    ];
    /** @nocollapse */
    CalendarHeatmapComponent.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    CalendarHeatmapComponent.propDecorators = {
        debug: [{ type: Input, args: ['debug',] }],
        data: [{ type: Input, args: ['data',] }],
        minColor: [{ type: Input, args: ['minColor',] }],
        maxColor: [{ type: Input, args: ['maxColor',] }],
        div: [{ type: ViewChild, args: ['chart', { static: true },] }],
        width: [{ type: Input, args: ['width',] }],
        height: [{ type: Input, args: ['height',] }],
        overview: [{ type: Input, args: ['overview',] }],
        handler: [{ type: Output, args: ['handler',] }],
        change: [{ type: Output, args: ['change',] }],
        onResize: [{ type: HostListener, args: ['window:resize',] }]
    };
    return CalendarHeatmapComponent;
}());
export { CalendarHeatmapComponent };
if (false) {
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.DEF_MIN_COLOR;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.DEF_MAX_COLOR;
    /** @type {?} */
    CalendarHeatmapComponent.prototype.div;
    /** @type {?} */
    CalendarHeatmapComponent.prototype.width;
    /** @type {?} */
    CalendarHeatmapComponent.prototype.height;
    /** @type {?} */
    CalendarHeatmapComponent.prototype.overview;
    /** @type {?} */
    CalendarHeatmapComponent.prototype.handler;
    /** @type {?} */
    CalendarHeatmapComponent.prototype.change;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype.LOG;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype._data;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype._debug;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype._minColor;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype._maxColor;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype.gutter;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype.gWidth;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype.gHeight;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype.itemSize;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype.labelPadding;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype.transitionDuration;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype.inTransition;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype.tooltipWidth;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype.tooltipPadding;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype.history;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype.selected;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype.svg;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype.items;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype.labels;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype.buttons;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype.tooltip;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype.parentWidth;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype.chart;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype.resizeTimer;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype.getTooltip;
    /**
     * @type {?}
     * @private
     */
    CalendarHeatmapComponent.prototype.el;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItaGVhdG1hcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VueC93YXJwdmlldy8iLCJzb3VyY2VzIjpbInNyYy9saWIvZWxlbWVudHMvd2FycC12aWV3LWRyaWxsLWRvd24vY2FsZW5kYXItaGVhdG1hcC9jYWxlbmRhci1oZWF0bWFwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWdCQSxPQUFPLEVBQWdCLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM1SSxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDN0MsT0FBTyxFQUFDLEtBQUssRUFBa0IsTUFBTSxnQkFBZ0IsQ0FBQztBQUN0RCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDbEQsT0FBTyxFQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQWEsR0FBRyxFQUFFLFFBQVEsRUFBQyxNQUFNLElBQUksQ0FBQztBQUM1RixPQUFPLEVBQUMsS0FBSyxFQUFFLE1BQU0sRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUMzQyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDbEQsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQzlDLE9BQU8sTUFBZ0IsTUFBTSxRQUFRLENBQUM7QUFFdEM7SUFrREUsa0NBQW9CLEVBQWM7UUFBZCxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBT2xCLFVBQUssR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDO1FBQzlCLFdBQU0sR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDO1FBQy9CLGFBQVEsR0FBRyxRQUFRLENBQUM7UUFFcEIsWUFB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QUF3RDs7Ozs7SUFDeEQseUNBQTBEOzs7OztJQUMxRCwwQ0FBMkQ7Ozs7O0lBQzNELDJDQUE0RDs7Ozs7SUFDNUQsMkNBQWdFOzs7OztJQUNoRSwrQ0FBeUI7Ozs7O0lBQ3pCLHlDQUEyQjs7Ozs7SUFDM0IsK0NBQW9COzs7OztJQW0yQ3BCLDhDQWNDOzs7OztJQTk1Q1csc0NBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqICBDb3B5cmlnaHQgMjAyMCAgU2VuWCBTLkEuUy5cbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqL1xuaW1wb3J0IHtBZnRlclZpZXdJbml0LCBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSG9zdExpc3RlbmVyLCBJbnB1dCwgT3V0cHV0LCBWaWV3Q2hpbGQsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICcuLi8uLi8uLi91dGlscy9sb2dnZXInO1xuaW1wb3J0IHtEYXR1bSwgRGV0YWlsLCBTdW1tYXJ5fSBmcm9tICcuLi9tb2RlbC9kYXR1bSc7XG5pbXBvcnQge0NoYXJ0TGlifSBmcm9tICcuLi8uLi8uLi91dGlscy9jaGFydC1saWInO1xuaW1wb3J0IHtlYXNlTGluZWFyLCBtYXgsIHJhbmdlLCBzY2FsZUJhbmQsIHNjYWxlTGluZWFyLCBTZWxlY3Rpb24sIHN1bSwgdGltZURheXN9IGZyb20gJ2QzJztcbmltcG9ydCB7ZXZlbnQsIHNlbGVjdH0gZnJvbSAnZDMtc2VsZWN0aW9uJztcbmltcG9ydCB7Q29sb3JMaWJ9IGZyb20gJy4uLy4uLy4uL3V0aWxzL2NvbG9yLWxpYic7XG5pbXBvcnQge0dUU0xpYn0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvZ3RzLmxpYic7XG5pbXBvcnQgbW9tZW50LCB7TW9tZW50fSBmcm9tICdtb21lbnQnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjYWxlbmRhci1oZWF0bWFwJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2NhbGVuZGFyLWhlYXRtYXAuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9jYWxlbmRhci1oZWF0bWFwLmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLlNoYWRvd0RvbVxufSlcbmV4cG9ydCBjbGFzcyBDYWxlbmRhckhlYXRtYXBDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcblxuICBASW5wdXQoJ2RlYnVnJykgc2V0IGRlYnVnKGRlYnVnOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZGVidWcgPSBkZWJ1ZztcbiAgICB0aGlzLkxPRy5zZXREZWJ1ZyhkZWJ1Zyk7XG4gIH1cblxuICBnZXQgZGVidWcoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RlYnVnO1xuICB9XG5cbiAgQElucHV0KCdkYXRhJykgc2V0IGRhdGEoZGF0YTogRGF0dW1bXSkge1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZGF0YSddLCBkYXRhKTtcbiAgICBpZiAoZGF0YSkge1xuICAgICAgdGhpcy5fZGF0YSA9IGRhdGE7XG4gICAgICB0aGlzLmNhbGN1bGF0ZURpbWVuc2lvbnMoKTtcbiAgICB9XG4gIH1cblxuICBnZXQgZGF0YSgpOiBEYXR1bVtdIHtcbiAgICByZXR1cm4gdGhpcy5fZGF0YTtcbiAgfVxuXG4gIEBJbnB1dCgnbWluQ29sb3InKSBzZXQgbWluQ29sb3IobWluQ29sb3I6IHN0cmluZykge1xuICAgIHRoaXMuX21pbkNvbG9yID0gbWluQ29sb3I7XG4gICAgdGhpcy5jYWxjdWxhdGVEaW1lbnNpb25zKCk7XG4gIH1cblxuICBnZXQgbWluQ29sb3IoKSB7XG4gICAgcmV0dXJuIHRoaXMuX21pbkNvbG9yO1xuICB9XG5cbiAgQElucHV0KCdtYXhDb2xvcicpIHNldCBtYXhDb2xvcihtYXhDb2xvcjogc3RyaW5nKSB7XG4gICAgdGhpcy5fbWF4Q29sb3IgPSBtYXhDb2xvcjtcbiAgICB0aGlzLmNhbGN1bGF0ZURpbWVuc2lvbnMoKTtcbiAgfVxuXG4gIGdldCBtYXhDb2xvcigpIHtcbiAgICByZXR1cm4gdGhpcy5fbWF4Q29sb3I7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBERUZfTUlOX0NPTE9SID0gJyNmZmZmZmYnO1xuICBwcml2YXRlIHN0YXRpYyBERUZfTUFYX0NPTE9SID0gJyMzMzMzMzMnO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZWw6IEVsZW1lbnRSZWYpIHtcbiAgICB0aGlzLkxPRyA9IG5ldyBMb2dnZXIoQ2FsZW5kYXJIZWF0bWFwQ29tcG9uZW50LCB0aGlzLmRlYnVnKTtcbiAgfVxuXG5cbiAgQFZpZXdDaGlsZCgnY2hhcnQnLCB7c3RhdGljOiB0cnVlfSkgZGl2OiBFbGVtZW50UmVmO1xuXG4gIEBJbnB1dCgnd2lkdGgnKSB3aWR0aCA9IENoYXJ0TGliLkRFRkFVTFRfV0lEVEg7XG4gIEBJbnB1dCgnaGVpZ2h0JykgaGVpZ2h0ID0gQ2hhcnRMaWIuREVGQVVMVF9IRUlHSFQ7XG4gIEBJbnB1dCgnb3ZlcnZpZXcnKSBvdmVydmlldyA9ICdnbG9iYWwnO1xuXG4gIEBPdXRwdXQoJ2hhbmRsZXInKSBoYW5kbGVyID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoJ2NoYW5nZScpIGNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIHByaXZhdGUgTE9HOiBMb2dnZXI7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lXG4gIHByaXZhdGUgX2RhdGE6IERhdHVtW107XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lXG4gIHByaXZhdGUgX2RlYnVnID0gZmFsc2U7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lXG4gIHByaXZhdGUgX21pbkNvbG9yOiBzdHJpbmcgPSBDYWxlbmRhckhlYXRtYXBDb21wb25lbnQuREVGX01JTl9DT0xPUjtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWVcbiAgcHJpdmF0ZSBfbWF4Q29sb3I6IHN0cmluZyA9IENhbGVuZGFySGVhdG1hcENvbXBvbmVudC5ERUZfTUFYX0NPTE9SO1xuLy8gRGVmYXVsdHNcbiAgcHJpdmF0ZSBndXR0ZXIgPSA1O1xuICBwcml2YXRlIGdXaWR0aCA9IDEwMDA7XG4gIHByaXZhdGUgZ0hlaWdodCA9IDIwMDtcbiAgcHJpdmF0ZSBpdGVtU2l6ZSA9IDEwO1xuICBwcml2YXRlIGxhYmVsUGFkZGluZyA9IDQwO1xuICBwcml2YXRlIHRyYW5zaXRpb25EdXJhdGlvbiA9IDI1MDtcbiAgcHJpdmF0ZSBpblRyYW5zaXRpb24gPSBmYWxzZTtcbiAgLy8gVG9vbHRpcCBkZWZhdWx0c1xuICBwcml2YXRlIHRvb2x0aXBXaWR0aCA9IDQ1MDtcbiAgcHJpdmF0ZSB0b29sdGlwUGFkZGluZyA9IDE1O1xuICAvLyBPdmVydmlldyBkZWZhdWx0c1xuICBwcml2YXRlIGhpc3RvcnkgPSBbJ2dsb2JhbCddO1xuICBwcml2YXRlIHNlbGVjdGVkOiBEYXR1bSA9IG5ldyBEYXR1bSgpO1xuICAvLyBEMyByZWxhdGVkIHZhcmlhYmxlc1xuICBwcml2YXRlIHN2ZzogU2VsZWN0aW9uPFNWR0VsZW1lbnQsIHt9LCBudWxsLCB1bmRlZmluZWQ+O1xuICBwcml2YXRlIGl0ZW1zOiBTZWxlY3Rpb248U1ZHRWxlbWVudCwge30sIG51bGwsIHVuZGVmaW5lZD47XG4gIHByaXZhdGUgbGFiZWxzOiBTZWxlY3Rpb248U1ZHRWxlbWVudCwge30sIG51bGwsIHVuZGVmaW5lZD47XG4gIHByaXZhdGUgYnV0dG9uczogU2VsZWN0aW9uPFNWR0VsZW1lbnQsIHt9LCBudWxsLCB1bmRlZmluZWQ+O1xuICBwcml2YXRlIHRvb2x0aXA6IFNlbGVjdGlvbjxIVE1MRGl2RWxlbWVudCwge30sIG51bGwsIHVuZGVmaW5lZD47XG4gIHByaXZhdGUgcGFyZW50V2lkdGggPSAtMTtcbiAgcHJpdmF0ZSBjaGFydDogSFRNTEVsZW1lbnQ7XG4gIHByaXZhdGUgcmVzaXplVGltZXI7XG5cbiAgc3RhdGljIGdldE51bWJlck9mV2Vla3MoKTogbnVtYmVyIHtcbiAgICBjb25zdCBkYXlJbmRleCA9IE1hdGgucm91bmQoKCttb21lbnQudXRjKCkgLSArbW9tZW50LnV0YygpLnN1YnRyYWN0KDEsICd5ZWFyJykuc3RhcnRPZignd2VlaycpKSAvIDg2NDAwMDAwKTtcbiAgICByZXR1cm4gTWF0aC50cnVuYyhkYXlJbmRleCAvIDcpICsgMTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzpyZXNpemUnKVxuICBvblJlc2l6ZSgpIHtcbiAgICBpZiAodGhpcy5lbC5uYXRpdmVFbGVtZW50LnBhcmVudEVsZW1lbnQuY2xpZW50V2lkdGggIT09IHRoaXMucGFyZW50V2lkdGgpIHtcbiAgICAgIHRoaXMuY2FsY3VsYXRlRGltZW5zaW9ucygpO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLmNoYXJ0ID0gdGhpcy5kaXYubmF0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudDtcbiAgICAvLyBJbml0aWFsaXplIHN2ZyBlbGVtZW50XG4gICAgdGhpcy5zdmcgPSBzZWxlY3QodGhpcy5jaGFydCkuYXBwZW5kKCdzdmcnKS5hdHRyKCdjbGFzcycsICdzdmcnKTtcbiAgICAvLyBJbml0aWFsaXplIG1haW4gc3ZnIGVsZW1lbnRzXG4gICAgdGhpcy5pdGVtcyA9IHRoaXMuc3ZnLmFwcGVuZCgnZycpO1xuICAgIHRoaXMubGFiZWxzID0gdGhpcy5zdmcuYXBwZW5kKCdnJyk7XG4gICAgdGhpcy5idXR0b25zID0gdGhpcy5zdmcuYXBwZW5kKCdnJyk7XG4gICAgLy8gQWRkIHRvb2x0aXAgdG8gdGhlIHNhbWUgZWxlbWVudCBhcyBtYWluIHN2Z1xuICAgIHRoaXMudG9vbHRpcCA9IHNlbGVjdCh0aGlzLmNoYXJ0KVxuICAgICAgLmFwcGVuZCgnZGl2JylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdoZWF0bWFwLXRvb2x0aXAnKVxuICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMCk7XG4gICAgLy8gQ2FsY3VsYXRlIGNoYXJ0IGRpbWVuc2lvbnNcbiAgICB0aGlzLmNhbGN1bGF0ZURpbWVuc2lvbnMoKTtcbiAgICAvLyAgdGhpcy5kcmF3Q2hhcnQoKTtcbiAgfVxuXG4gIGNhbGN1bGF0ZURpbWVuc2lvbnMoKSB7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMucmVzaXplVGltZXIpO1xuICAgIHRoaXMucmVzaXplVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmICh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudC5jbGllbnRXaWR0aCAhPT0gMCkge1xuICAgICAgICB0aGlzLmdXaWR0aCA9IHRoaXMuY2hhcnQuY2xpZW50V2lkdGggPCAxMDAwID8gMTAwMCA6IHRoaXMuY2hhcnQuY2xpZW50V2lkdGg7XG4gICAgICAgIHRoaXMuaXRlbVNpemUgPSAoKHRoaXMuZ1dpZHRoIC0gdGhpcy5sYWJlbFBhZGRpbmcpIC8gQ2FsZW5kYXJIZWF0bWFwQ29tcG9uZW50LmdldE51bWJlck9mV2Vla3MoKSAtIHRoaXMuZ3V0dGVyKTtcbiAgICAgICAgdGhpcy5nSGVpZ2h0ID0gdGhpcy5sYWJlbFBhZGRpbmcgKyA3ICogKHRoaXMuaXRlbVNpemUgKyB0aGlzLmd1dHRlcik7XG4gICAgICAgIHRoaXMuc3ZnLmF0dHIoJ3dpZHRoJywgdGhpcy5nV2lkdGgpLmF0dHIoJ2hlaWdodCcsIHRoaXMuZ0hlaWdodCk7XG4gICAgICAgIHRoaXMuTE9HLmRlYnVnKFsnY2FsY3VsYXRlRGltZW5zaW9ucyddLCB0aGlzLl9kYXRhKTtcbiAgICAgICAgaWYgKCEhdGhpcy5fZGF0YSAmJiAhIXRoaXMuX2RhdGFbMF0gJiYgISF0aGlzLl9kYXRhWzBdLnN1bW1hcnkpIHtcbiAgICAgICAgICB0aGlzLmRyYXdDaGFydCgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZURpbWVuc2lvbnMoKTtcbiAgICAgIH1cbiAgICB9LCAyNTApO1xuICB9XG5cblxuICBwcml2YXRlIGdyb3VwQnkoeHMsIGtleSkge1xuICAgIHJldHVybiB4cy5yZWR1Y2UoKHJ2LCB4KSA9PiB7XG4gICAgICAocnZbeFtrZXldXSA9IHJ2W3hba2V5XV0gfHwgW10pLnB1c2goeCk7XG4gICAgICByZXR1cm4gcnY7XG4gICAgfSwge30pO1xuICB9XG5cbiAgdXBkYXRlRGF0YVN1bW1hcnkoKSB7XG4gICAgLy8gR2V0IGRhaWx5IHN1bW1hcnkgaWYgdGhhdCB3YXMgbm90IHByb3ZpZGVkXG4gICAgaWYgKCF0aGlzLl9kYXRhWzBdLnN1bW1hcnkpIHtcbiAgICAgIHRoaXMuX2RhdGEubWFwKChkOiBEYXR1bSkgPT4ge1xuICAgICAgICBjb25zdCBzdW1tYXJ5ID0gZC5kZXRhaWxzLnJlZHVjZSgodW5pcXVlczogYW55LCBwcm9qZWN0OiBhbnkpID0+IHtcbiAgICAgICAgICBpZiAoIXVuaXF1ZXNbcHJvamVjdC5uYW1lXSkge1xuICAgICAgICAgICAgdW5pcXVlc1twcm9qZWN0Lm5hbWVdID0ge3ZhbHVlOiBwcm9qZWN0LnZhbHVlfTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdW5pcXVlc1twcm9qZWN0Lm5hbWVdLnZhbHVlICs9IHByb2plY3QudmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB1bmlxdWVzO1xuICAgICAgICB9LCB7fSk7XG4gICAgICAgIGNvbnN0IHVuc29ydGVkU3VtbWFyeSA9IE9iamVjdC5rZXlzKHN1bW1hcnkpLm1hcCgoa2V5KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5hbWU6IGtleSxcbiAgICAgICAgICAgIHRvdGFsOiBzdW1tYXJ5W2tleV0udmFsdWVcbiAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICAgICAgZC5zdW1tYXJ5ID0gdW5zb3J0ZWRTdW1tYXJ5LnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICByZXR1cm4gYi50b3RhbCAtIGEudG90YWw7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZDtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGRyYXdDaGFydCgpIHtcbiAgICBpZiAoIXRoaXMuc3ZnIHx8ICF0aGlzLl9kYXRhKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuTE9HLmRlYnVnKFsnZHJhd0NoYXJ0J10sIFt0aGlzLm92ZXJ2aWV3LCB0aGlzLnNlbGVjdGVkXSk7XG4gICAgc3dpdGNoICh0aGlzLm92ZXJ2aWV3KSB7XG4gICAgICBjYXNlICdnbG9iYWwnOlxuICAgICAgICB0aGlzLmRyYXdHbG9iYWxPdmVydmlldygpO1xuICAgICAgICB0aGlzLmNoYW5nZS5lbWl0KHtcbiAgICAgICAgICBvdmVydmlldzogdGhpcy5vdmVydmlldyxcbiAgICAgICAgICBzdGFydDogbW9tZW50KHRoaXMuX2RhdGFbMF0uZGF0ZSksXG4gICAgICAgICAgZW5kOiBtb21lbnQodGhpcy5fZGF0YVt0aGlzLl9kYXRhLmxlbmd0aCAtIDFdLmRhdGUpLFxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd5ZWFyJzpcbiAgICAgICAgdGhpcy5kcmF3WWVhck92ZXJ2aWV3KCk7XG4gICAgICAgIHRoaXMuY2hhbmdlLmVtaXQoe1xuICAgICAgICAgIG92ZXJ2aWV3OiB0aGlzLm92ZXJ2aWV3LFxuICAgICAgICAgIHN0YXJ0OiBtb21lbnQodGhpcy5zZWxlY3RlZC5kYXRlKS5zdGFydE9mKCd5ZWFyJyksXG4gICAgICAgICAgZW5kOiBtb21lbnQodGhpcy5zZWxlY3RlZC5kYXRlKS5lbmRPZigneWVhcicpLFxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb250aCc6XG4gICAgICAgIHRoaXMuZHJhd01vbnRoT3ZlcnZpZXcoKTtcbiAgICAgICAgdGhpcy5jaGFuZ2UuZW1pdCh7XG4gICAgICAgICAgb3ZlcnZpZXc6IHRoaXMub3ZlcnZpZXcsXG4gICAgICAgICAgc3RhcnQ6IG1vbWVudCh0aGlzLnNlbGVjdGVkLmRhdGUpLnN0YXJ0T2YoJ21vbnRoJyksXG4gICAgICAgICAgZW5kOiBtb21lbnQodGhpcy5zZWxlY3RlZC5kYXRlKS5lbmRPZignbW9udGgnKSxcbiAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnd2Vlayc6XG4gICAgICAgIHRoaXMuZHJhd1dlZWtPdmVydmlldygpO1xuICAgICAgICB0aGlzLmNoYW5nZS5lbWl0KHtcbiAgICAgICAgICBvdmVydmlldzogdGhpcy5vdmVydmlldyxcbiAgICAgICAgICBzdGFydDogbW9tZW50KHRoaXMuc2VsZWN0ZWQuZGF0ZSkuc3RhcnRPZignd2VlaycpLFxuICAgICAgICAgIGVuZDogbW9tZW50KHRoaXMuc2VsZWN0ZWQuZGF0ZSkuZW5kT2YoJ3dlZWsnKSxcbiAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZGF5JzpcbiAgICAgICAgdGhpcy5kcmF3RGF5T3ZlcnZpZXcoKTtcbiAgICAgICAgdGhpcy5jaGFuZ2UuZW1pdCh7XG4gICAgICAgICAgb3ZlcnZpZXc6IHRoaXMub3ZlcnZpZXcsXG4gICAgICAgICAgc3RhcnQ6IG1vbWVudCh0aGlzLnNlbGVjdGVkLmRhdGUpLnN0YXJ0T2YoJ2RheScpLFxuICAgICAgICAgIGVuZDogbW9tZW50KHRoaXMuc2VsZWN0ZWQuZGF0ZSkuZW5kT2YoJ2RheScpLFxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBkcmF3R2xvYmFsT3ZlcnZpZXcoKSB7XG4gICAgLy8gQWRkIGN1cnJlbnQgb3ZlcnZpZXcgdG8gdGhlIGhpc3RvcnlcbiAgICBpZiAodGhpcy5oaXN0b3J5W3RoaXMuaGlzdG9yeS5sZW5ndGggLSAxXSAhPT0gdGhpcy5vdmVydmlldykge1xuICAgICAgdGhpcy5oaXN0b3J5LnB1c2godGhpcy5vdmVydmlldyk7XG4gICAgfVxuICAgIC8vIERlZmluZSBzdGFydCBhbmQgZW5kIG9mIHRoZSBkYXRhc2V0XG4gICAgY29uc3Qgc3RhcnRQZXJpb2Q6IE1vbWVudCA9IG1vbWVudC51dGModGhpcy5fZGF0YVswXS5kYXRlLnN0YXJ0T2YoJ3knKSk7XG4gICAgY29uc3QgZW5kUGVyaW9kOiBNb21lbnQgPSBtb21lbnQudXRjKHRoaXMuX2RhdGFbdGhpcy5fZGF0YS5sZW5ndGggLSAxXS5kYXRlLmVuZE9mKCd5JykpO1xuICAgIC8vIERlZmluZSBhcnJheSBvZiB5ZWFycyBhbmQgdG90YWwgdmFsdWVzXG4gICAgY29uc3QgeURhdGE6IERhdHVtW10gPSB0aGlzLl9kYXRhLmZpbHRlcigoZDogRGF0dW0pID0+IGQuZGF0ZS5pc0JldHdlZW4oc3RhcnRQZXJpb2QsIGVuZFBlcmlvZCwgbnVsbCwgJ1tdJykpO1xuICAgIHlEYXRhLmZvckVhY2goKGQ6IERhdHVtKSA9PiB7XG4gICAgICBjb25zdCBzdW1tYXJ5OiBTdW1tYXJ5W10gPSBbXTtcbiAgICAgIGNvbnN0IGdyb3VwID0gdGhpcy5ncm91cEJ5KGQuZGV0YWlscywgJ25hbWUnKTtcbiAgICAgIE9iamVjdC5rZXlzKGdyb3VwKS5mb3JFYWNoKGsgPT4ge1xuICAgICAgICBzdW1tYXJ5LnB1c2goe1xuICAgICAgICAgIG5hbWU6IGssXG4gICAgICAgICAgdG90YWw6IGdyb3VwW2tdLnJlZHVjZSgoYWNjLCBvKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gYWNjICsgby52YWx1ZTtcbiAgICAgICAgICB9LCAwKSxcbiAgICAgICAgICBjb2xvcjogZ3JvdXBba11bMF0uY29sb3IsXG4gICAgICAgICAgaWQ6IGdyb3VwW2tdWzBdLmlkLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgZC5zdW1tYXJ5ID0gc3VtbWFyeTtcbiAgICB9KTtcbiAgICBjb25zdCBkdXJhdGlvbiA9IE1hdGguY2VpbChtb21lbnQuZHVyYXRpb24oZW5kUGVyaW9kLmRpZmYoc3RhcnRQZXJpb2QpKS5hc1llYXJzKCkpO1xuICAgIGNvbnN0IHNjYWxlID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkdXJhdGlvbjsgaSsrKSB7XG4gICAgICBjb25zdCBkID0gbW9tZW50LnV0YygpLnllYXIoc3RhcnRQZXJpb2QueWVhcigpICsgaSkubW9udGgoMCkuZGF0ZSgxKS5zdGFydE9mKCd5Jyk7XG4gICAgICBzY2FsZS5wdXNoKGQpO1xuICAgIH1cbiAgICBsZXQgeWVhckRhdGE6IERhdHVtW10gPSB5RGF0YS5tYXAoKGQ6IERhdHVtKSA9PiB7XG4gICAgICBjb25zdCBkYXRlOiBNb21lbnQgPSBkLmRhdGU7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBkYXRlLFxuICAgICAgICB0b3RhbDogeURhdGEucmVkdWNlKChwcmV2OiBudW1iZXIsIGN1cnJlbnQ6IGFueSkgPT4ge1xuICAgICAgICAgIGlmICgoY3VycmVudC5kYXRlIGFzIE1vbWVudCkueWVhcigpID09PSBkYXRlLnllYXIoKSkge1xuICAgICAgICAgICAgcHJldiArPSBjdXJyZW50LnRvdGFsO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcHJldjtcbiAgICAgICAgfSwgMCksXG4gICAgICAgIHN1bW1hcnk6ICgoKSA9PiB7XG4gICAgICAgICAgY29uc3Qgc3VtbWFyeTogU3VtbWFyeSA9IHlEYXRhLnJlZHVjZSgoczogYW55LCBkYXRhOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGlmICgoZGF0YS5kYXRlIGFzIE1vbWVudCkueWVhcigpID09PSBkYXRlLnllYXIoKSkge1xuICAgICAgICAgICAgICBkYXRhLnN1bW1hcnkuZm9yRWFjaChfc3VtbWFyeSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFzW19zdW1tYXJ5Lm5hbWVdKSB7XG4gICAgICAgICAgICAgICAgICBzW19zdW1tYXJ5Lm5hbWVdID0ge1xuICAgICAgICAgICAgICAgICAgICB0b3RhbDogX3N1bW1hcnkudG90YWwsXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBfc3VtbWFyeS5jb2xvcixcbiAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHNbX3N1bW1hcnkubmFtZV0udG90YWwgKz0gX3N1bW1hcnkudG90YWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzO1xuICAgICAgICAgIH0sIHt9KTtcbiAgICAgICAgICBjb25zdCB1bnNvcnRlZFN1bW1hcnk6IFN1bW1hcnlbXSA9IE9iamVjdC5rZXlzKHN1bW1hcnkpLm1hcCgoa2V5KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBuYW1lOiBrZXksXG4gICAgICAgICAgICAgIHRvdGFsOiBzdW1tYXJ5W2tleV0udG90YWwsXG4gICAgICAgICAgICAgIGNvbG9yOiBzdW1tYXJ5W2tleV0uY29sb3IsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiB1bnNvcnRlZFN1bW1hcnkuc29ydCgoYSwgYikgPT4gYi50b3RhbCAtIGEudG90YWwpO1xuICAgICAgICB9KSgpLFxuICAgICAgfTtcbiAgICB9KTtcbiAgICAvLyBDYWxjdWxhdGUgbWF4IHZhbHVlIG9mIGFsbCB0aGUgeWVhcnMgaW4gdGhlIGRhdGFzZXRcbiAgICB5ZWFyRGF0YSA9IEdUU0xpYi5jbGVhbkFycmF5KHllYXJEYXRhKTtcbiAgICBjb25zdCBtYXhWYWx1ZSA9IG1heCh5ZWFyRGF0YSwgKGQ6IERhdHVtKSA9PiBkLnRvdGFsKTtcbiAgICAvLyBEZWZpbmUgeWVhciBsYWJlbHMgYW5kIGF4aXNcbiAgICBjb25zdCB5ZWFyTGFiZWxzID0gc2NhbGUubWFwKChkOiBNb21lbnQpID0+IGQpO1xuICAgIGNvbnN0IHllYXJTY2FsZSA9IHNjYWxlQmFuZCgpXG4gICAgICAucmFuZ2VSb3VuZChbMCwgdGhpcy5nV2lkdGhdKVxuICAgICAgLnBhZGRpbmcoMC4wNSlcbiAgICAgIC5kb21haW4oeWVhckxhYmVscy5tYXAoKGQ6IE1vbWVudCkgPT4gZC55ZWFyKCkudG9TdHJpbmcoKSkpO1xuXG4gICAgY29uc3QgY29sb3IgPSBzY2FsZUxpbmVhcjxzdHJpbmc+KClcbiAgICAgIC5yYW5nZShbdGhpcy5taW5Db2xvciB8fCBDYWxlbmRhckhlYXRtYXBDb21wb25lbnQuREVGX01JTl9DT0xPUiwgdGhpcy5tYXhDb2xvciB8fCBDYWxlbmRhckhlYXRtYXBDb21wb25lbnQuREVGX01BWF9DT0xPUl0pXG4gICAgICAuZG9tYWluKFstMC4xNSAqIG1heFZhbHVlLCBtYXhWYWx1ZV0pO1xuICAgIC8vIEFkZCBnbG9iYWwgZGF0YSBpdGVtcyB0byB0aGUgb3ZlcnZpZXdcbiAgICB0aGlzLml0ZW1zLnNlbGVjdEFsbCgnLml0ZW0tYmxvY2steWVhcicpLnJlbW92ZSgpO1xuICAgIHRoaXMuaXRlbXMuc2VsZWN0QWxsKCcuaXRlbS1ibG9jay15ZWFyJylcbiAgICAgIC5kYXRhKHllYXJEYXRhKVxuICAgICAgLmVudGVyKClcbiAgICAgIC5hcHBlbmQoJ3JlY3QnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2l0ZW0gaXRlbS1ibG9jay15ZWFyJylcbiAgICAgIC5hdHRyKCd3aWR0aCcsICgpID0+ICh0aGlzLmdXaWR0aCAtIHRoaXMubGFiZWxQYWRkaW5nKSAvIHllYXJMYWJlbHMubGVuZ3RoIC0gdGhpcy5ndXR0ZXIgKiA1KVxuICAgICAgLmF0dHIoJ2hlaWdodCcsICgpID0+IHRoaXMuZ0hlaWdodCAtIHRoaXMubGFiZWxQYWRkaW5nKVxuICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkOiBEYXR1bSkgPT4gJ3RyYW5zbGF0ZSgnICsgeWVhclNjYWxlKChkLmRhdGUgYXMgTW9tZW50KS55ZWFyKCkudG9TdHJpbmcoKSkgKyAnLCcgKyB0aGlzLnRvb2x0aXBQYWRkaW5nICogMiArICcpJylcbiAgICAgIC5hdHRyKCdmaWxsJywgKGQ6IERhdHVtKSA9PiBjb2xvcihkLnRvdGFsKSB8fCBDYWxlbmRhckhlYXRtYXBDb21wb25lbnQuREVGX01BWF9DT0xPUilcbiAgICAgIC5vbignY2xpY2snLCAoZDogRGF0dW0pID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaW5UcmFuc2l0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIFNldCBpbl90cmFuc2l0aW9uIGZsYWdcbiAgICAgICAgdGhpcy5pblRyYW5zaXRpb24gPSB0cnVlO1xuICAgICAgICAvLyBTZXQgc2VsZWN0ZWQgZGF0ZSB0byB0aGUgb25lIGNsaWNrZWQgb25cbiAgICAgICAgdGhpcy5zZWxlY3RlZCA9IGQ7XG4gICAgICAgIC8vIEhpZGUgdG9vbHRpcFxuICAgICAgICB0aGlzLmhpZGVUb29sdGlwKCk7XG4gICAgICAgIC8vIFJlbW92ZSBhbGwgZ2xvYmFsIG92ZXJ2aWV3IHJlbGF0ZWQgaXRlbXMgYW5kIGxhYmVsc1xuICAgICAgICB0aGlzLnJlbW92ZUdsb2JhbE92ZXJ2aWV3KCk7XG4gICAgICAgIC8vIFJlZHJhdyB0aGUgY2hhcnRcbiAgICAgICAgdGhpcy5vdmVydmlldyA9ICd5ZWFyJztcbiAgICAgICAgdGhpcy5kcmF3Q2hhcnQoKTtcbiAgICAgIH0pXG4gICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgLm9uKCdtb3VzZW92ZXInLCAoZDogRGF0dW0pID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaW5UcmFuc2l0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIENhbGN1bGF0ZSB0b29sdGlwIHBvc2l0aW9uXG4gICAgICAgIGxldCB4ID0geWVhclNjYWxlKGQuZGF0ZS55ZWFyKCkudG9TdHJpbmcoKSkgKyB0aGlzLnRvb2x0aXBQYWRkaW5nICogMjtcbiAgICAgICAgd2hpbGUgKHRoaXMuZ1dpZHRoIC0geCA8ICh0aGlzLnRvb2x0aXBXaWR0aCArIHRoaXMudG9vbHRpcFBhZGRpbmcgKiA1KSkge1xuICAgICAgICAgIHggLT0gMTA7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgeSA9IHRoaXMudG9vbHRpcFBhZGRpbmcgKiA0O1xuICAgICAgICAvLyBTaG93IHRvb2x0aXBcbiAgICAgICAgdGhpcy50b29sdGlwLmh0bWwodGhpcy5nZXRUb29sdGlwKGQpKVxuICAgICAgICAgIC5zdHlsZSgnbGVmdCcsIHggKyAncHgnKVxuICAgICAgICAgIC5zdHlsZSgndG9wJywgeSArICdweCcpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgIC5kdXJhdGlvbih0aGlzLnRyYW5zaXRpb25EdXJhdGlvbiAvIDIpXG4gICAgICAgICAgLmVhc2UoZWFzZUxpbmVhcilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKTtcbiAgICAgIH0pXG4gICAgICAub24oJ21vdXNlb3V0JywgKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5pblRyYW5zaXRpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5oaWRlVG9vbHRpcCgpO1xuICAgICAgfSlcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgIC5kZWxheSgoZDogYW55LCBpOiBudW1iZXIpID0+IHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uICogKGkgKyAxKSAvIDEwKVxuICAgICAgLmR1cmF0aW9uKCgpID0+IHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uKVxuICAgICAgLmVhc2UoZWFzZUxpbmVhcilcbiAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpXG4gICAgICAuY2FsbCgodHJhbnNpdGlvbjogYW55LCBjYWxsYmFjazogYW55KSA9PiB7XG4gICAgICAgIGlmICh0cmFuc2l0aW9uLmVtcHR5KCkpIHtcbiAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBuID0gMDtcbiAgICAgICAgdHJhbnNpdGlvbi5lYWNoKCgpID0+ICsrbikub24oJ2VuZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmICghLS1uKSB7XG4gICAgICAgICAgICBjYWxsYmFjay5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9LCAoKSA9PiB0aGlzLmluVHJhbnNpdGlvbiA9IGZhbHNlKTtcbiAgICAvLyBBZGQgeWVhciBsYWJlbHNcbiAgICB0aGlzLmxhYmVscy5zZWxlY3RBbGwoJy5sYWJlbC15ZWFyJykucmVtb3ZlKCk7XG4gICAgdGhpcy5sYWJlbHMuc2VsZWN0QWxsKCcubGFiZWwteWVhcicpXG4gICAgICAuZGF0YSh5ZWFyTGFiZWxzKVxuICAgICAgLmVudGVyKClcbiAgICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xhYmVsIGxhYmVsLXllYXInKVxuICAgICAgLmF0dHIoJ2ZvbnQtc2l6ZScsICgpID0+IE1hdGguZmxvb3IodGhpcy5sYWJlbFBhZGRpbmcgLyAzKSArICdweCcpXG4gICAgICAudGV4dCgoZDogTW9tZW50KSA9PiBkLnllYXIoKSlcbiAgICAgIC5hdHRyKCd4JywgKGQ6IE1vbWVudCkgPT4geWVhclNjYWxlKGQueWVhcigpLnRvU3RyaW5nKCkpKVxuICAgICAgLmF0dHIoJ3knLCB0aGlzLmxhYmVsUGFkZGluZyAvIDIpXG4gICAgICAub24oJ21vdXNlZW50ZXInLCAoeWVhckxhYmVsOiBNb21lbnQpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaW5UcmFuc2l0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaXRlbXMuc2VsZWN0QWxsKCcuaXRlbS1ibG9jay15ZWFyJylcbiAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgLmR1cmF0aW9uKHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uKVxuICAgICAgICAgIC5lYXNlKGVhc2VMaW5lYXIpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgKGQ6IERhdHVtKSA9PiAoZC5kYXRlLnllYXIoKSA9PT0geWVhckxhYmVsLnllYXIoKSkgPyAxIDogMC4xKTtcbiAgICAgIH0pXG4gICAgICAub24oJ21vdXNlb3V0JywgKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5pblRyYW5zaXRpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pdGVtcy5zZWxlY3RBbGwoJy5pdGVtLWJsb2NrLXllYXInKVxuICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAuZHVyYXRpb24odGhpcy50cmFuc2l0aW9uRHVyYXRpb24pXG4gICAgICAgICAgLmVhc2UoZWFzZUxpbmVhcilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKTtcbiAgICAgIH0pXG4gICAgICAub24oJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5pblRyYW5zaXRpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gU2V0IGluX3RyYW5zaXRpb24gZmxhZ1xuICAgICAgICB0aGlzLmluVHJhbnNpdGlvbiA9IHRydWU7XG4gICAgICAgIC8vIFNldCBzZWxlY3RlZCB5ZWFyIHRvIHRoZSBvbmUgY2xpY2tlZCBvblxuICAgICAgICB0aGlzLnNlbGVjdGVkID0geWVhckRhdGFbMF07XG4gICAgICAgIC8vIEhpZGUgdG9vbHRpcFxuICAgICAgICB0aGlzLmhpZGVUb29sdGlwKCk7XG4gICAgICAgIC8vIFJlbW92ZSBhbGwgZ2xvYmFsIG92ZXJ2aWV3IHJlbGF0ZWQgaXRlbXMgYW5kIGxhYmVsc1xuICAgICAgICB0aGlzLnJlbW92ZUdsb2JhbE92ZXJ2aWV3KCk7XG4gICAgICAgIC8vIFJlZHJhdyB0aGUgY2hhcnRcbiAgICAgICAgdGhpcy5vdmVydmlldyA9ICd5ZWFyJztcbiAgICAgICAgdGhpcy5kcmF3Q2hhcnQoKTtcbiAgICAgIH0pO1xuICB9XG5cblxuICAvKipcbiAgICogRHJhdyB5ZWFyIG92ZXJ2aWV3XG4gICAqL1xuICBkcmF3WWVhck92ZXJ2aWV3KCkge1xuICAgIC8vIEFkZCBjdXJyZW50IG92ZXJ2aWV3IHRvIHRoZSBoaXN0b3J5XG4gICAgaWYgKHRoaXMuaGlzdG9yeVt0aGlzLmhpc3RvcnkubGVuZ3RoIC0gMV0gIT09IHRoaXMub3ZlcnZpZXcpIHtcbiAgICAgIHRoaXMuaGlzdG9yeS5wdXNoKHRoaXMub3ZlcnZpZXcpO1xuICAgIH1cbiAgICAvLyBEZWZpbmUgc3RhcnQgYW5kIGVuZCBkYXRlIG9mIHRoZSBzZWxlY3RlZCB5ZWFyXG4gICAgY29uc3Qgc3RhcnRPZlllYXI6IE1vbWVudCA9IG1vbWVudCh0aGlzLnNlbGVjdGVkLmRhdGUpLnN0YXJ0T2YoJ3llYXInKTtcbiAgICBjb25zdCBlbmRPZlllYXI6IE1vbWVudCA9IG1vbWVudCh0aGlzLnNlbGVjdGVkLmRhdGUpLmVuZE9mKCd5ZWFyJyk7XG4gICAgLy8gRmlsdGVyIGRhdGEgZG93biB0byB0aGUgc2VsZWN0ZWQgeWVhclxuICAgIGxldCB5ZWFyRGF0YTogRGF0dW1bXSA9IHRoaXMuX2RhdGEuZmlsdGVyKChkOiBEYXR1bSkgPT4gZC5kYXRlLmlzQmV0d2VlbihzdGFydE9mWWVhciwgZW5kT2ZZZWFyLCBudWxsLCAnW10nKSk7XG4gICAgeWVhckRhdGEuZm9yRWFjaCgoZDogRGF0dW0pID0+IHtcbiAgICAgIGNvbnN0IHN1bW1hcnk6IFN1bW1hcnlbXSA9IFtdO1xuICAgICAgY29uc3QgZ3JvdXAgPSB0aGlzLmdyb3VwQnkoZC5kZXRhaWxzLCAnbmFtZScpO1xuICAgICAgT2JqZWN0LmtleXMoZ3JvdXApLmZvckVhY2goayA9PiB7XG4gICAgICAgIHN1bW1hcnkucHVzaCh7XG4gICAgICAgICAgbmFtZTogayxcbiAgICAgICAgICB0b3RhbDogZ3JvdXBba10ucmVkdWNlKChhY2MsIG8pID0+IHtcbiAgICAgICAgICAgIHJldHVybiBhY2MgKyBvLnZhbHVlO1xuICAgICAgICAgIH0sIDApLFxuICAgICAgICAgIGNvbG9yOiBncm91cFtrXVswXS5jb2xvcixcbiAgICAgICAgICBpZDogZ3JvdXBba11bMF0uaWQsXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBkLnN1bW1hcnkgPSBzdW1tYXJ5O1xuICAgIH0pO1xuICAgIHllYXJEYXRhID0gR1RTTGliLmNsZWFuQXJyYXkoeWVhckRhdGEpO1xuICAgIC8vIENhbGN1bGF0ZSBtYXggdmFsdWUgb2YgdGhlIHllYXIgZGF0YVxuICAgIGNvbnN0IG1heFZhbHVlID0gbWF4KHllYXJEYXRhLCAoZDogRGF0dW0pID0+IGQudG90YWwpO1xuICAgIGNvbnN0IGNvbG9yID0gc2NhbGVMaW5lYXI8c3RyaW5nPigpXG4gICAgICAucmFuZ2UoW3RoaXMubWluQ29sb3IgfHwgQ2FsZW5kYXJIZWF0bWFwQ29tcG9uZW50LkRFRl9NSU5fQ09MT1IsIHRoaXMubWF4Q29sb3IgfHwgQ2FsZW5kYXJIZWF0bWFwQ29tcG9uZW50LkRFRl9NQVhfQ09MT1JdKVxuICAgICAgLmRvbWFpbihbLTAuMTUgKiBtYXhWYWx1ZSwgbWF4VmFsdWVdKTtcbiAgICB0aGlzLml0ZW1zLnNlbGVjdEFsbCgnLml0ZW0tY2lyY2xlJykucmVtb3ZlKCk7XG4gICAgdGhpcy5pdGVtcy5zZWxlY3RBbGwoJy5pdGVtLWNpcmNsZScpXG4gICAgICAuZGF0YSh5ZWFyRGF0YSlcbiAgICAgIC5lbnRlcigpXG4gICAgICAuYXBwZW5kKCdyZWN0JylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdpdGVtIGl0ZW0tY2lyY2xlJykuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgLmF0dHIoJ3gnLCAoZDogRGF0dW0pID0+IHRoaXMuY2FsY0l0ZW1YKGQsIHN0YXJ0T2ZZZWFyKSArICh0aGlzLml0ZW1TaXplIC0gdGhpcy5jYWxjSXRlbVNpemUoZCwgbWF4VmFsdWUpKSAvIDIpXG4gICAgICAuYXR0cigneScsIChkOiBEYXR1bSkgPT4gdGhpcy5jYWxjSXRlbVkoZCkgKyAodGhpcy5pdGVtU2l6ZSAtIHRoaXMuY2FsY0l0ZW1TaXplKGQsIG1heFZhbHVlKSkgLyAyKVxuICAgICAgLmF0dHIoJ3J4JywgKGQ6IERhdHVtKSA9PiB0aGlzLmNhbGNJdGVtU2l6ZShkLCBtYXhWYWx1ZSkpXG4gICAgICAuYXR0cigncnknLCAoZDogRGF0dW0pID0+IHRoaXMuY2FsY0l0ZW1TaXplKGQsIG1heFZhbHVlKSlcbiAgICAgIC5hdHRyKCd3aWR0aCcsIChkOiBEYXR1bSkgPT4gdGhpcy5jYWxjSXRlbVNpemUoZCwgbWF4VmFsdWUpKVxuICAgICAgLmF0dHIoJ2hlaWdodCcsIChkOiBEYXR1bSkgPT4gdGhpcy5jYWxjSXRlbVNpemUoZCwgbWF4VmFsdWUpKVxuICAgICAgLmF0dHIoJ2ZpbGwnLCAoZDogRGF0dW0pID0+IChkLnRvdGFsID4gMCkgPyBjb2xvcihkLnRvdGFsKSA6ICd0cmFuc3BhcmVudCcpXG4gICAgICAub24oJ2NsaWNrJywgKGQ6IERhdHVtKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmluVHJhbnNpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBEb24ndCB0cmFuc2l0aW9uIGlmIHRoZXJlIGlzIG5vIGRhdGEgdG8gc2hvd1xuICAgICAgICBpZiAoZC50b3RhbCA9PT0gMCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmluVHJhbnNpdGlvbiA9IHRydWU7XG4gICAgICAgIC8vIFNldCBzZWxlY3RlZCBkYXRlIHRvIHRoZSBvbmUgY2xpY2tlZCBvblxuICAgICAgICB0aGlzLnNlbGVjdGVkID0gZDtcbiAgICAgICAgLy8gSGlkZSB0b29sdGlwXG4gICAgICAgIHRoaXMuaGlkZVRvb2x0aXAoKTtcbiAgICAgICAgLy8gUmVtb3ZlIGFsbCB5ZWFyIG92ZXJ2aWV3IHJlbGF0ZWQgaXRlbXMgYW5kIGxhYmVsc1xuICAgICAgICB0aGlzLnJlbW92ZVllYXJPdmVydmlldygpO1xuICAgICAgICAvLyBSZWRyYXcgdGhlIGNoYXJ0XG4gICAgICAgIHRoaXMub3ZlcnZpZXcgPSAnZGF5JztcbiAgICAgICAgdGhpcy5kcmF3Q2hhcnQoKTtcbiAgICAgIH0pXG4gICAgICAub24oJ21vdXNlb3ZlcicsIChkOiBEYXR1bSkgPT4ge1xuICAgICAgICBpZiAodGhpcy5pblRyYW5zaXRpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gUHVsc2F0aW5nIGFuaW1hdGlvblxuICAgICAgICBjb25zdCBjaXJjbGUgPSBzZWxlY3QoZXZlbnQuY3VycmVudFRhcmdldCk7XG4gICAgICAgIGNvbnN0IHJlcGVhdCA9ICgpID0+IHtcbiAgICAgICAgICBjaXJjbGUudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAuZHVyYXRpb24odGhpcy50cmFuc2l0aW9uRHVyYXRpb24pXG4gICAgICAgICAgICAuZWFzZShlYXNlTGluZWFyKVxuICAgICAgICAgICAgLmF0dHIoJ3gnLCAoZGF0YTogRGF0dW0pID0+IHRoaXMuY2FsY0l0ZW1YKGRhdGEsIHN0YXJ0T2ZZZWFyKSAtICh0aGlzLml0ZW1TaXplICogMS4xIC0gdGhpcy5pdGVtU2l6ZSkgLyAyKVxuICAgICAgICAgICAgLmF0dHIoJ3knLCAoZGF0YTogRGF0dW0pID0+IHRoaXMuY2FsY0l0ZW1ZKGRhdGEpIC0gKHRoaXMuaXRlbVNpemUgKiAxLjEgLSB0aGlzLml0ZW1TaXplKSAvIDIpXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCB0aGlzLml0ZW1TaXplICogMS4xKVxuICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIHRoaXMuaXRlbVNpemUgKiAxLjEpXG4gICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAuZHVyYXRpb24odGhpcy50cmFuc2l0aW9uRHVyYXRpb24pXG4gICAgICAgICAgICAuZWFzZShlYXNlTGluZWFyKVxuICAgICAgICAgICAgLmF0dHIoJ3gnLCAoZGF0YTogRGF0dW0pID0+IHRoaXMuY2FsY0l0ZW1YKGRhdGEsIHN0YXJ0T2ZZZWFyKSArICh0aGlzLml0ZW1TaXplIC0gdGhpcy5jYWxjSXRlbVNpemUoZGF0YSwgbWF4VmFsdWUpKSAvIDIpXG4gICAgICAgICAgICAuYXR0cigneScsIChkYXRhOiBEYXR1bSkgPT4gdGhpcy5jYWxjSXRlbVkoZGF0YSkgKyAodGhpcy5pdGVtU2l6ZSAtIHRoaXMuY2FsY0l0ZW1TaXplKGRhdGEsIG1heFZhbHVlKSkgLyAyKVxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgKGRhdGE6IERhdHVtKSA9PiB0aGlzLmNhbGNJdGVtU2l6ZShkYXRhLCBtYXhWYWx1ZSkpXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgKGRhdGE6IERhdHVtKSA9PiB0aGlzLmNhbGNJdGVtU2l6ZShkYXRhLCBtYXhWYWx1ZSkpXG4gICAgICAgICAgICAub24oJ2VuZCcsIHJlcGVhdCk7XG4gICAgICAgIH07XG4gICAgICAgIHJlcGVhdCgpO1xuICAgICAgICAvLyBDb25zdHJ1Y3QgdG9vbHRpcFxuICAgICAgICAvLyBDYWxjdWxhdGUgdG9vbHRpcCBwb3NpdGlvblxuICAgICAgICBsZXQgeCA9IHRoaXMuY2FsY0l0ZW1YKGQsIHN0YXJ0T2ZZZWFyKSArIHRoaXMuaXRlbVNpemUgLyAyO1xuICAgICAgICBpZiAodGhpcy5nV2lkdGggLSB4IDwgKHRoaXMudG9vbHRpcFdpZHRoICsgdGhpcy50b29sdGlwUGFkZGluZyAqIDMpKSB7XG4gICAgICAgICAgeCAtPSB0aGlzLnRvb2x0aXBXaWR0aCArIHRoaXMudG9vbHRpcFBhZGRpbmcgKiAyO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHkgPSB0aGlzLmNhbGNJdGVtWShkKSArIHRoaXMuaXRlbVNpemUgLyAyO1xuICAgICAgICAvLyBTaG93IHRvb2x0aXBcbiAgICAgICAgdGhpcy50b29sdGlwLmh0bWwodGhpcy5nZXRUb29sdGlwKGQpKVxuICAgICAgICAgIC5zdHlsZSgnbGVmdCcsIHggKyAncHgnKVxuICAgICAgICAgIC5zdHlsZSgndG9wJywgeSArICdweCcpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgIC5kdXJhdGlvbih0aGlzLnRyYW5zaXRpb25EdXJhdGlvbiAvIDIpXG4gICAgICAgICAgLmVhc2UoZWFzZUxpbmVhcilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKTtcbiAgICAgIH0pXG4gICAgICAub24oJ21vdXNlb3V0JywgKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5pblRyYW5zaXRpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gU2V0IGNpcmNsZSByYWRpdXMgYmFjayB0byB3aGF0IGl0J3Mgc3VwcG9zZWQgdG8gYmVcbiAgICAgICAgc2VsZWN0KGV2ZW50LmN1cnJlbnRUYXJnZXQpLnRyYW5zaXRpb24oKVxuICAgICAgICAgIC5kdXJhdGlvbih0aGlzLnRyYW5zaXRpb25EdXJhdGlvbiAvIDIpXG4gICAgICAgICAgLmVhc2UoZWFzZUxpbmVhcilcbiAgICAgICAgICAuYXR0cigneCcsIChkOiBEYXR1bSkgPT4gdGhpcy5jYWxjSXRlbVgoZCwgc3RhcnRPZlllYXIpICsgKHRoaXMuaXRlbVNpemUgLSB0aGlzLmNhbGNJdGVtU2l6ZShkLCBtYXhWYWx1ZSkpIC8gMilcbiAgICAgICAgICAuYXR0cigneScsIChkOiBEYXR1bSkgPT4gdGhpcy5jYWxjSXRlbVkoZCkgKyAodGhpcy5pdGVtU2l6ZSAtIHRoaXMuY2FsY0l0ZW1TaXplKGQsIG1heFZhbHVlKSkgLyAyKVxuICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIChkOiBEYXR1bSkgPT4gdGhpcy5jYWxjSXRlbVNpemUoZCwgbWF4VmFsdWUpKVxuICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCAoZDogRGF0dW0pID0+IHRoaXMuY2FsY0l0ZW1TaXplKGQsIG1heFZhbHVlKSk7XG4gICAgICAgIC8vIEhpZGUgdG9vbHRpcFxuICAgICAgICB0aGlzLmhpZGVUb29sdGlwKCk7XG4gICAgICB9KVxuICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgLmRlbGF5KCgpID0+IChNYXRoLmNvcyhNYXRoLlBJICogTWF0aC5yYW5kb20oKSkgKyAxKSAqIHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uKVxuICAgICAgLmR1cmF0aW9uKCgpID0+IHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uKVxuICAgICAgLmVhc2UoZWFzZUxpbmVhcilcbiAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpXG4gICAgICAuY2FsbCgodHJhbnNpdGlvbjogYW55LCBjYWxsYmFjazogYW55KSA9PiB7XG4gICAgICAgIGlmICh0cmFuc2l0aW9uLmVtcHR5KCkpIHtcbiAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBuID0gMDtcbiAgICAgICAgdHJhbnNpdGlvbi5lYWNoKCgpID0+ICsrbikub24oJ2VuZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmICghLS1uKSB7XG4gICAgICAgICAgICBjYWxsYmFjay5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9LCAoKSA9PiB0aGlzLmluVHJhbnNpdGlvbiA9IGZhbHNlKTtcbiAgICAvLyBBZGQgbW9udGggbGFiZWxzXG4gICAgY29uc3QgZHVyYXRpb24gPSBNYXRoLmNlaWwobW9tZW50LmR1cmF0aW9uKGVuZE9mWWVhci5kaWZmKHN0YXJ0T2ZZZWFyKSkuYXNNb250aHMoKSk7XG4gICAgY29uc3QgbW9udGhMYWJlbHM6IE1vbWVudFtdID0gW107XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBkdXJhdGlvbjsgaSsrKSB7XG4gICAgICBtb250aExhYmVscy5wdXNoKG1vbWVudCh0aGlzLnNlbGVjdGVkLmRhdGUpLm1vbnRoKChzdGFydE9mWWVhci5tb250aCgpICsgaSkgJSAxMikuc3RhcnRPZignbW9udGgnKSk7XG4gICAgfVxuICAgIGNvbnN0IG1vbnRoU2NhbGUgPSBzY2FsZUxpbmVhcigpLnJhbmdlKFswLCB0aGlzLmdXaWR0aF0pLmRvbWFpbihbMCwgbW9udGhMYWJlbHMubGVuZ3RoXSk7XG4gICAgdGhpcy5sYWJlbHMuc2VsZWN0QWxsKCcubGFiZWwtbW9udGgnKS5yZW1vdmUoKTtcbiAgICB0aGlzLmxhYmVscy5zZWxlY3RBbGwoJy5sYWJlbC1tb250aCcpXG4gICAgICAuZGF0YShtb250aExhYmVscylcbiAgICAgIC5lbnRlcigpXG4gICAgICAuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdsYWJlbCBsYWJlbC1tb250aCcpXG4gICAgICAuYXR0cignZm9udC1zaXplJywgKCkgPT4gTWF0aC5mbG9vcih0aGlzLmxhYmVsUGFkZGluZyAvIDMpICsgJ3B4JylcbiAgICAgIC50ZXh0KChkOiBNb21lbnQpID0+IGQuZm9ybWF0KCdNTU0nKSlcbiAgICAgIC5hdHRyKCd4JywgKGQ6IE1vbWVudCwgaTogbnVtYmVyKSA9PiBtb250aFNjYWxlKGkpICsgKG1vbnRoU2NhbGUoaSkgLSBtb250aFNjYWxlKGkgLSAxKSkgLyAyKVxuICAgICAgLmF0dHIoJ3knLCB0aGlzLmxhYmVsUGFkZGluZyAvIDIpXG4gICAgICAub24oJ21vdXNlZW50ZXInLCAoZDogTW9tZW50KSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmluVHJhbnNpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzZWxlY3RlZE1vbnRoID0gbW9tZW50KGQpO1xuICAgICAgICB0aGlzLml0ZW1zLnNlbGVjdEFsbCgnLml0ZW0tY2lyY2xlJylcbiAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgLmR1cmF0aW9uKHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uKVxuICAgICAgICAgIC5lYXNlKGVhc2VMaW5lYXIpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgKGRhdGE6IERhdHVtKSA9PiBtb21lbnQoZGF0YS5kYXRlKS5pc1NhbWUoc2VsZWN0ZWRNb250aCwgJ21vbnRoJykgPyAxIDogMC4xKTtcbiAgICAgIH0pXG4gICAgICAub24oJ21vdXNlb3V0JywgKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5pblRyYW5zaXRpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pdGVtcy5zZWxlY3RBbGwoJy5pdGVtLWNpcmNsZScpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgIC5kdXJhdGlvbih0aGlzLnRyYW5zaXRpb25EdXJhdGlvbilcbiAgICAgICAgICAuZWFzZShlYXNlTGluZWFyKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpO1xuICAgICAgfSlcbiAgICAgIC5vbignY2xpY2snLCAoZDogTW9tZW50KSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmluVHJhbnNpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBDaGVjayBtb250aCBkYXRhXG4gICAgICAgIGNvbnN0IG1vbnRoRGF0YSA9IHRoaXMuX2RhdGEuZmlsdGVyKChlOiBEYXR1bSkgPT4gZS5kYXRlLmlzQmV0d2VlbihcbiAgICAgICAgICBtb21lbnQoZCkuc3RhcnRPZignbW9udGgnKSxcbiAgICAgICAgICBtb21lbnQoZCkuZW5kT2YoJ21vbnRoJyksXG4gICAgICAgICAgbnVsbCwgJ1tdJ1xuICAgICAgICApKTtcbiAgICAgICAgLy8gRG9uJ3QgdHJhbnNpdGlvbiBpZiB0aGVyZSBpcyBubyBkYXRhIHRvIHNob3dcbiAgICAgICAgaWYgKCFtb250aERhdGEubGVuZ3RoKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIFNldCBzZWxlY3RlZCBtb250aCB0byB0aGUgb25lIGNsaWNrZWQgb25cbiAgICAgICAgdGhpcy5zZWxlY3RlZCA9IHtkYXRlOiBkfTtcbiAgICAgICAgdGhpcy5pblRyYW5zaXRpb24gPSB0cnVlO1xuICAgICAgICAvLyBIaWRlIHRvb2x0aXBcbiAgICAgICAgdGhpcy5oaWRlVG9vbHRpcCgpO1xuICAgICAgICAvLyBSZW1vdmUgYWxsIHllYXIgb3ZlcnZpZXcgcmVsYXRlZCBpdGVtcyBhbmQgbGFiZWxzXG4gICAgICAgIHRoaXMucmVtb3ZlWWVhck92ZXJ2aWV3KCk7XG4gICAgICAgIC8vIFJlZHJhdyB0aGUgY2hhcnRcbiAgICAgICAgdGhpcy5vdmVydmlldyA9ICdtb250aCc7XG4gICAgICAgIHRoaXMuZHJhd0NoYXJ0KCk7XG4gICAgICB9KTtcblxuICAgIC8vIEFkZCBkYXkgbGFiZWxzXG4gICAgY29uc3QgZGF5TGFiZWxzOiBEYXRlW10gPSB0aW1lRGF5cyhcbiAgICAgIG1vbWVudC51dGMoKS5zdGFydE9mKCd3ZWVrJykudG9EYXRlKCksXG4gICAgICBtb21lbnQudXRjKCkuZW5kT2YoJ3dlZWsnKS50b0RhdGUoKVxuICAgICk7XG4gICAgY29uc3QgZGF5U2NhbGUgPSBzY2FsZUJhbmQoKVxuICAgICAgLnJhbmdlUm91bmQoW3RoaXMubGFiZWxQYWRkaW5nLCB0aGlzLmdIZWlnaHRdKVxuICAgICAgLmRvbWFpbihkYXlMYWJlbHMubWFwKChkOiBEYXRlKSA9PiBtb21lbnQudXRjKGQpLndlZWtkYXkoKS50b1N0cmluZygpKSk7XG4gICAgdGhpcy5sYWJlbHMuc2VsZWN0QWxsKCcubGFiZWwtZGF5JykucmVtb3ZlKCk7XG4gICAgdGhpcy5sYWJlbHMuc2VsZWN0QWxsKCcubGFiZWwtZGF5JylcbiAgICAgIC5kYXRhKGRheUxhYmVscylcbiAgICAgIC5lbnRlcigpXG4gICAgICAuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdsYWJlbCBsYWJlbC1kYXknKVxuICAgICAgLmF0dHIoJ3gnLCB0aGlzLmxhYmVsUGFkZGluZyAvIDMpXG4gICAgICAuYXR0cigneScsIChkOiBEYXRlLCBpOiBudW1iZXIpID0+IGRheVNjYWxlKGkudG9TdHJpbmcoKSkgKyBkYXlTY2FsZS5iYW5kd2lkdGgoKSAvIDEuNzUpXG4gICAgICAuc3R5bGUoJ3RleHQtYW5jaG9yJywgJ2xlZnQnKVxuICAgICAgLmF0dHIoJ2ZvbnQtc2l6ZScsICgpID0+IE1hdGguZmxvb3IodGhpcy5sYWJlbFBhZGRpbmcgLyAzKSArICdweCcpXG4gICAgICAudGV4dCgoZDogRGF0ZSkgPT4gbW9tZW50LnV0YyhkKS5mb3JtYXQoJ2RkZGQnKVswXSlcbiAgICAgIC5vbignbW91c2VlbnRlcicsIChkOiBEYXRlKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmluVHJhbnNpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzZWxlY3RlZERheSA9IG1vbWVudC51dGMoZCk7XG4gICAgICAgIHRoaXMuaXRlbXMuc2VsZWN0QWxsKCcuaXRlbS1jaXJjbGUnKVxuICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAuZHVyYXRpb24odGhpcy50cmFuc2l0aW9uRHVyYXRpb24pXG4gICAgICAgICAgLmVhc2UoZWFzZUxpbmVhcilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAoZGF0YTogRGF0dW0pID0+IChtb21lbnQoZGF0YS5kYXRlKS5kYXkoKSA9PT0gc2VsZWN0ZWREYXkuZGF5KCkpID8gMSA6IDAuMSk7XG4gICAgICB9KVxuICAgICAgLm9uKCdtb3VzZW91dCcsICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaW5UcmFuc2l0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaXRlbXMuc2VsZWN0QWxsKCcuaXRlbS1jaXJjbGUnKVxuICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAuZHVyYXRpb24odGhpcy50cmFuc2l0aW9uRHVyYXRpb24pXG4gICAgICAgICAgLmVhc2UoZWFzZUxpbmVhcilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKTtcbiAgICAgIH0pO1xuICAgIC8vIEFkZCBidXR0b24gdG8gc3dpdGNoIGJhY2sgdG8gcHJldmlvdXMgb3ZlcnZpZXdcbiAgICB0aGlzLmRyYXdCdXR0b24oKTtcbiAgfVxuXG4gIGRyYXdNb250aE92ZXJ2aWV3KCkge1xuICAgIC8vIEFkZCBjdXJyZW50IG92ZXJ2aWV3IHRvIHRoZSBoaXN0b3J5XG4gICAgaWYgKHRoaXMuaGlzdG9yeVt0aGlzLmhpc3RvcnkubGVuZ3RoIC0gMV0gIT09IHRoaXMub3ZlcnZpZXcpIHtcbiAgICAgIHRoaXMuaGlzdG9yeS5wdXNoKHRoaXMub3ZlcnZpZXcpO1xuICAgIH1cbiAgICAvLyBEZWZpbmUgYmVnaW5uaW5nIGFuZCBlbmQgb2YgdGhlIG1vbnRoXG4gICAgY29uc3Qgc3RhcnRPZk1vbnRoOiBNb21lbnQgPSBtb21lbnQodGhpcy5zZWxlY3RlZC5kYXRlKS5zdGFydE9mKCdtb250aCcpO1xuICAgIGNvbnN0IGVuZE9mTW9udGg6IE1vbWVudCA9IG1vbWVudCh0aGlzLnNlbGVjdGVkLmRhdGUpLmVuZE9mKCdtb250aCcpO1xuICAgIC8vIEZpbHRlciBkYXRhIGRvd24gdG8gdGhlIHNlbGVjdGVkIG1vbnRoXG4gICAgbGV0IG1vbnRoRGF0YTogRGF0dW1bXSA9IFtdO1xuICAgIHRoaXMuX2RhdGEuZmlsdGVyKChkYXRhOiBEYXR1bSkgPT4gZGF0YS5kYXRlLmlzQmV0d2VlbihzdGFydE9mTW9udGgsIGVuZE9mTW9udGgsIG51bGwsICdbXScpKVxuICAgICAgLm1hcCgoZDogRGF0dW0pID0+IHtcbiAgICAgICAgY29uc3Qgc2NhbGU6IERhdHVtW10gPSBbXTtcbiAgICAgICAgZC5kZXRhaWxzLmZvckVhY2goKGRldDogRGV0YWlsKSA9PiB7XG4gICAgICAgICAgY29uc3QgZGF0ZTogTW9tZW50ID0gbW9tZW50LnV0YyhkZXQuZGF0ZSk7XG4gICAgICAgICAgY29uc3QgaSA9IE1hdGguZmxvb3IoZGF0ZS5ob3VycygpIC8gMyk7XG4gICAgICAgICAgaWYgKCFzY2FsZVtpXSkge1xuICAgICAgICAgICAgc2NhbGVbaV0gPSB7XG4gICAgICAgICAgICAgIGRhdGU6IGRhdGUuc3RhcnRPZignaG91cicpLFxuICAgICAgICAgICAgICB0b3RhbDogMCxcbiAgICAgICAgICAgICAgZGV0YWlsczogW10sXG4gICAgICAgICAgICAgIHN1bW1hcnk6IFtdXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgICBzY2FsZVtpXS50b3RhbCArPSBkZXQudmFsdWU7XG4gICAgICAgICAgc2NhbGVbaV0uZGV0YWlscy5wdXNoKGRldCk7XG4gICAgICAgIH0pO1xuICAgICAgICBzY2FsZS5mb3JFYWNoKChzOiBEYXR1bSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGdyb3VwID0gdGhpcy5ncm91cEJ5KHMuZGV0YWlscywgJ25hbWUnKTtcbiAgICAgICAgICBPYmplY3Qua2V5cyhncm91cCkuZm9yRWFjaCgoazogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBzLnN1bW1hcnkucHVzaCh7XG4gICAgICAgICAgICAgIG5hbWU6IGssXG4gICAgICAgICAgICAgIHRvdGFsOiBzdW0oZ3JvdXBba10sIChkYXRhOiBhbnkpID0+IGRhdGEudG90YWwpLFxuICAgICAgICAgICAgICBjb2xvcjogZ3JvdXBba11bMF0uY29sb3JcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgbW9udGhEYXRhID0gbW9udGhEYXRhLmNvbmNhdChzY2FsZSk7XG4gICAgICB9KTtcbiAgICBtb250aERhdGEgPSBHVFNMaWIuY2xlYW5BcnJheShtb250aERhdGEpO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZHJhd01vbnRoT3ZlcnZpZXcnXSwgW3RoaXMub3ZlcnZpZXcsIHRoaXMuc2VsZWN0ZWQsIG1vbnRoRGF0YV0pO1xuICAgIGNvbnN0IG1heFZhbHVlOiBudW1iZXIgPSBtYXgobW9udGhEYXRhLCAoZDogYW55KSA9PiBkLnRvdGFsKTtcbiAgICAvLyBEZWZpbmUgZGF5IGxhYmVscyBhbmQgYXhpc1xuICAgIGNvbnN0IGRheUxhYmVsczogRGF0ZVtdID0gdGltZURheXMoXG4gICAgICBtb21lbnQodGhpcy5zZWxlY3RlZC5kYXRlKS5zdGFydE9mKCd3ZWVrJykudG9EYXRlKCksXG4gICAgICBtb21lbnQodGhpcy5zZWxlY3RlZC5kYXRlKS5lbmRPZignd2VlaycpLnRvRGF0ZSgpXG4gICAgKTtcbiAgICBjb25zdCBkYXlTY2FsZSA9IHNjYWxlQmFuZCgpXG4gICAgICAucmFuZ2VSb3VuZChbdGhpcy5sYWJlbFBhZGRpbmcsIHRoaXMuZ0hlaWdodF0pXG4gICAgICAuZG9tYWluKGRheUxhYmVscy5tYXAoKGQ6IERhdGUpID0+IG1vbWVudC51dGMoZCkud2Vla2RheSgpLnRvU3RyaW5nKCkpKTtcblxuICAgIC8vIERlZmluZSB3ZWVrIGxhYmVscyBhbmQgYXhpc1xuICAgIGNvbnN0IHdlZWtMYWJlbHM6IE1vbWVudFtdID0gW3N0YXJ0T2ZNb250aF07XG4gICAgY29uc3QgaW5jV2VlayA9IG1vbWVudChzdGFydE9mTW9udGgpO1xuICAgIHdoaWxlIChpbmNXZWVrLndlZWsoKSAhPT0gZW5kT2ZNb250aC53ZWVrKCkpIHtcbiAgICAgIHdlZWtMYWJlbHMucHVzaChtb21lbnQoaW5jV2Vlay5hZGQoMSwgJ3dlZWsnKSkpO1xuICAgIH1cbiAgICBtb250aERhdGEuZm9yRWFjaCgoZDogRGF0dW0pID0+IHtcbiAgICAgIGNvbnN0IHN1bW1hcnkgPSBbXTtcbiAgICAgIGNvbnN0IGdyb3VwID0gdGhpcy5ncm91cEJ5KGQuZGV0YWlscywgJ25hbWUnKTtcbiAgICAgIE9iamVjdC5rZXlzKGdyb3VwKS5mb3JFYWNoKChrOiBzdHJpbmcpID0+IHtcbiAgICAgICAgc3VtbWFyeS5wdXNoKHtcbiAgICAgICAgICBuYW1lOiBrLFxuICAgICAgICAgIHRvdGFsOiBncm91cFtrXS5yZWR1Y2UoKGFjYywgbykgPT4gYWNjICsgby52YWx1ZSwgMCksXG4gICAgICAgICAgY29sb3I6IGdyb3VwW2tdWzBdLmNvbG9yLFxuICAgICAgICAgIGlkOiBncm91cFtrXVswXS5pZCxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGQuc3VtbWFyeSA9IHN1bW1hcnk7XG4gICAgfSk7XG4gICAgY29uc3Qgd2Vla1NjYWxlID0gc2NhbGVCYW5kKClcbiAgICAgIC5yYW5nZVJvdW5kKFt0aGlzLmxhYmVsUGFkZGluZywgdGhpcy5nV2lkdGhdKVxuICAgICAgLnBhZGRpbmcoMC4wNSlcbiAgICAgIC5kb21haW4od2Vla0xhYmVscy5tYXAoKHdlZWtkYXkpID0+IHdlZWtkYXkud2VlaygpICsgJycpKTtcbiAgICBjb25zdCBjb2xvciA9IHNjYWxlTGluZWFyPHN0cmluZz4oKVxuICAgICAgLnJhbmdlKFt0aGlzLm1pbkNvbG9yIHx8IENhbGVuZGFySGVhdG1hcENvbXBvbmVudC5ERUZfTUlOX0NPTE9SLCB0aGlzLm1heENvbG9yIHx8IENhbGVuZGFySGVhdG1hcENvbXBvbmVudC5ERUZfTUFYX0NPTE9SXSlcbiAgICAgIC5kb21haW4oWy0wLjE1ICogbWF4VmFsdWUsIG1heFZhbHVlXSk7XG4gICAgLy8gQWRkIG1vbnRoIGRhdGEgaXRlbXMgdG8gdGhlIG92ZXJ2aWV3XG4gICAgdGhpcy5pdGVtcy5zZWxlY3RBbGwoJy5pdGVtLWJsb2NrLW1vbnRoJykucmVtb3ZlKCk7XG4gICAgdGhpcy5pdGVtcy5zZWxlY3RBbGwoJy5pdGVtLWJsb2NrLW1vbnRoJylcbiAgICAgIC5kYXRhKG1vbnRoRGF0YSlcbiAgICAgIC5lbnRlcigpLmFwcGVuZCgncmVjdCcpXG4gICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2l0ZW0gaXRlbS1ibG9jay1tb250aCcpXG4gICAgICAuYXR0cigneScsIChkOiBEYXR1bSkgPT4gdGhpcy5jYWxjSXRlbVkoZClcbiAgICAgICAgKyAodGhpcy5pdGVtU2l6ZSAtIHRoaXMuY2FsY0l0ZW1TaXplKGQsIG1heFZhbHVlKSkgLyAyKVxuICAgICAgLmF0dHIoJ3gnLCAoZDogRGF0dW0pID0+IHRoaXMuY2FsY0l0ZW1YTW9udGgoZCwgc3RhcnRPZk1vbnRoLCB3ZWVrU2NhbGUoZC5kYXRlLndlZWsoKS50b1N0cmluZygpKSlcbiAgICAgICAgKyAodGhpcy5pdGVtU2l6ZSAtIHRoaXMuY2FsY0l0ZW1TaXplKGQsIG1heFZhbHVlKSkgLyAyKVxuICAgICAgLmF0dHIoJ3J4JywgKGQ6IERhdHVtKSA9PiB0aGlzLmNhbGNJdGVtU2l6ZShkLCBtYXhWYWx1ZSkpXG4gICAgICAuYXR0cigncnknLCAoZDogRGF0dW0pID0+IHRoaXMuY2FsY0l0ZW1TaXplKGQsIG1heFZhbHVlKSlcbiAgICAgIC5hdHRyKCd3aWR0aCcsIChkOiBEYXR1bSkgPT4gdGhpcy5jYWxjSXRlbVNpemUoZCwgbWF4VmFsdWUpKVxuICAgICAgLmF0dHIoJ2hlaWdodCcsIChkOiBEYXR1bSkgPT4gdGhpcy5jYWxjSXRlbVNpemUoZCwgbWF4VmFsdWUpKVxuICAgICAgLmF0dHIoJ2ZpbGwnLCAoZDogRGF0dW0pID0+IChkLnRvdGFsID4gMCkgPyBjb2xvcihkLnRvdGFsKSA6ICd0cmFuc3BhcmVudCcpXG4gICAgICAub24oJ2NsaWNrJywgKGQ6IERhdHVtKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmluVHJhbnNpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBEb24ndCB0cmFuc2l0aW9uIGlmIHRoZXJlIGlzIG5vIGRhdGEgdG8gc2hvd1xuICAgICAgICBpZiAoZC50b3RhbCA9PT0gMCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmluVHJhbnNpdGlvbiA9IHRydWU7XG4gICAgICAgIC8vIFNldCBzZWxlY3RlZCBkYXRlIHRvIHRoZSBvbmUgY2xpY2tlZCBvblxuICAgICAgICB0aGlzLnNlbGVjdGVkID0gZDtcbiAgICAgICAgLy8gSGlkZSB0b29sdGlwXG4gICAgICAgIHRoaXMuaGlkZVRvb2x0aXAoKTtcbiAgICAgICAgLy8gUmVtb3ZlIGFsbCBtb250aCBvdmVydmlldyByZWxhdGVkIGl0ZW1zIGFuZCBsYWJlbHNcbiAgICAgICAgdGhpcy5yZW1vdmVNb250aE92ZXJ2aWV3KCk7XG4gICAgICAgIC8vIFJlZHJhdyB0aGUgY2hhcnRcbiAgICAgICAgdGhpcy5vdmVydmlldyA9ICdkYXknO1xuICAgICAgICB0aGlzLmRyYXdDaGFydCgpO1xuICAgICAgfSlcbiAgICAgIC5vbignbW91c2VvdmVyJywgKGQ6IERhdHVtKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmluVHJhbnNpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBDb25zdHJ1Y3QgdG9vbHRpcFxuICAgICAgICAvLyBDYWxjdWxhdGUgdG9vbHRpcCBwb3NpdGlvblxuICAgICAgICBsZXQgeCA9IHdlZWtTY2FsZShkLmRhdGUud2VlaygpLnRvU3RyaW5nKCkpICsgdGhpcy50b29sdGlwUGFkZGluZztcbiAgICAgICAgd2hpbGUgKHRoaXMuZ1dpZHRoIC0geCA8ICh0aGlzLnRvb2x0aXBXaWR0aCArIHRoaXMudG9vbHRpcFBhZGRpbmcgKiAzKSkge1xuICAgICAgICAgIHggLT0gMTA7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgeSA9IGRheVNjYWxlKGQuZGF0ZS53ZWVrZGF5KCkudG9TdHJpbmcoKSkgKyB0aGlzLnRvb2x0aXBQYWRkaW5nO1xuICAgICAgICAvLyBTaG93IHRvb2x0aXBcbiAgICAgICAgdGhpcy50b29sdGlwLmh0bWwodGhpcy5nZXRUb29sdGlwKGQpKVxuICAgICAgICAgIC5zdHlsZSgnbGVmdCcsIHggKyAncHgnKVxuICAgICAgICAgIC5zdHlsZSgndG9wJywgeSArICdweCcpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgIC5kdXJhdGlvbih0aGlzLnRyYW5zaXRpb25EdXJhdGlvbiAvIDIpXG4gICAgICAgICAgLmVhc2UoZWFzZUxpbmVhcilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKTtcbiAgICAgIH0pXG4gICAgICAub24oJ21vdXNlb3V0JywgKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5pblRyYW5zaXRpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5oaWRlVG9vbHRpcCgpO1xuICAgICAgfSlcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgIC5kZWxheSgoKSA9PiAoTWF0aC5jb3MoTWF0aC5QSSAqIE1hdGgucmFuZG9tKCkpICsgMSkgKiB0aGlzLnRyYW5zaXRpb25EdXJhdGlvbilcbiAgICAgIC5kdXJhdGlvbigoKSA9PiB0aGlzLnRyYW5zaXRpb25EdXJhdGlvbilcbiAgICAgIC5lYXNlKGVhc2VMaW5lYXIpXG4gICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKVxuICAgICAgLmNhbGwoKHRyYW5zaXRpb246IGFueSwgY2FsbGJhY2s6IGFueSkgPT4ge1xuICAgICAgICBpZiAodHJhbnNpdGlvbi5lbXB0eSgpKSB7XG4gICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbiA9IDA7XG4gICAgICAgIHRyYW5zaXRpb24uZWFjaCgoKSA9PiArK24pLm9uKCdlbmQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoIS0tbikge1xuICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSwgKCkgPT4gdGhpcy5pblRyYW5zaXRpb24gPSBmYWxzZSk7XG4gICAgLy8gQWRkIHdlZWsgbGFiZWxzXG4gICAgdGhpcy5sYWJlbHMuc2VsZWN0QWxsKCcubGFiZWwtd2VlaycpLnJlbW92ZSgpO1xuICAgIHRoaXMubGFiZWxzLnNlbGVjdEFsbCgnLmxhYmVsLXdlZWsnKVxuICAgICAgLmRhdGEod2Vla0xhYmVscylcbiAgICAgIC5lbnRlcigpXG4gICAgICAuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdsYWJlbCBsYWJlbC13ZWVrJylcbiAgICAgIC5hdHRyKCdmb250LXNpemUnLCAoKSA9PiBNYXRoLmZsb29yKHRoaXMubGFiZWxQYWRkaW5nIC8gMykgKyAncHgnKVxuICAgICAgLnRleHQoKGQ6IE1vbWVudCkgPT4gJ1dlZWsgJyArIGQud2VlaygpKVxuICAgICAgLmF0dHIoJ3gnLCAoZDogTW9tZW50KSA9PiB3ZWVrU2NhbGUoZC53ZWVrKCkudG9TdHJpbmcoKSkpXG4gICAgICAuYXR0cigneScsIHRoaXMubGFiZWxQYWRkaW5nIC8gMilcbiAgICAgIC5vbignbW91c2VlbnRlcicsICh3ZWVrZGF5OiBNb21lbnQpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaW5UcmFuc2l0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaXRlbXMuc2VsZWN0QWxsKCcuaXRlbS1ibG9jay1tb250aCcpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgIC5kdXJhdGlvbih0aGlzLnRyYW5zaXRpb25EdXJhdGlvbilcbiAgICAgICAgICAuZWFzZShlYXNlTGluZWFyKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIChkOiBEYXR1bSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChtb21lbnQoZC5kYXRlKS53ZWVrKCkgPT09IHdlZWtkYXkud2VlaygpKSA/IDEgOiAwLjE7XG4gICAgICAgICAgfSk7XG4gICAgICB9KVxuICAgICAgLm9uKCdtb3VzZW91dCcsICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaW5UcmFuc2l0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaXRlbXMuc2VsZWN0QWxsKCcuaXRlbS1ibG9jay1tb250aCcpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgIC5kdXJhdGlvbih0aGlzLnRyYW5zaXRpb25EdXJhdGlvbilcbiAgICAgICAgICAuZWFzZShlYXNlTGluZWFyKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpO1xuICAgICAgfSlcbiAgICAgIC5vbignY2xpY2snLCAoZDogTW9tZW50KSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmluVHJhbnNpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmluVHJhbnNpdGlvbiA9IHRydWU7XG4gICAgICAgIC8vIFNldCBzZWxlY3RlZCBtb250aCB0byB0aGUgb25lIGNsaWNrZWQgb25cbiAgICAgICAgdGhpcy5zZWxlY3RlZCA9IHtkYXRlOiBkfTtcbiAgICAgICAgLy8gSGlkZSB0b29sdGlwXG4gICAgICAgIHRoaXMuaGlkZVRvb2x0aXAoKTtcbiAgICAgICAgLy8gUmVtb3ZlIGFsbCB5ZWFyIG92ZXJ2aWV3IHJlbGF0ZWQgaXRlbXMgYW5kIGxhYmVsc1xuICAgICAgICB0aGlzLnJlbW92ZU1vbnRoT3ZlcnZpZXcoKTtcbiAgICAgICAgLy8gUmVkcmF3IHRoZSBjaGFydFxuICAgICAgICB0aGlzLm92ZXJ2aWV3ID0gJ3dlZWsnO1xuICAgICAgICB0aGlzLmRyYXdDaGFydCgpO1xuICAgICAgfSk7XG4gICAgLy8gQWRkIGRheSBsYWJlbHNcbiAgICB0aGlzLmxhYmVscy5zZWxlY3RBbGwoJy5sYWJlbC1kYXknKS5yZW1vdmUoKTtcbiAgICB0aGlzLmxhYmVscy5zZWxlY3RBbGwoJy5sYWJlbC1kYXknKVxuICAgICAgLmRhdGEoZGF5TGFiZWxzKVxuICAgICAgLmVudGVyKClcbiAgICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xhYmVsIGxhYmVsLWRheScpXG4gICAgICAuYXR0cigneCcsIHRoaXMubGFiZWxQYWRkaW5nIC8gMylcbiAgICAgIC5hdHRyKCd5JywgKGQ6IERhdGUsIGk6IGFueSkgPT4gZGF5U2NhbGUoaSkgKyBkYXlTY2FsZS5iYW5kd2lkdGgoKSAvIDEuNzUpXG4gICAgICAuc3R5bGUoJ3RleHQtYW5jaG9yJywgJ2xlZnQnKVxuICAgICAgLmF0dHIoJ2ZvbnQtc2l6ZScsICgpID0+IE1hdGguZmxvb3IodGhpcy5sYWJlbFBhZGRpbmcgLyAzKSArICdweCcpXG4gICAgICAudGV4dCgoZDogRGF0ZSkgPT4gbW9tZW50LnV0YyhkKS5mb3JtYXQoJ2RkZGQnKVswXSlcbiAgICAgIC5vbignbW91c2VlbnRlcicsIChkOiBEYXRlKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmluVHJhbnNpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzZWxlY3RlZERheSA9IG1vbWVudC51dGMoZCk7XG4gICAgICAgIHRoaXMuaXRlbXMuc2VsZWN0QWxsKCcuaXRlbS1ibG9jay1tb250aCcpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgIC5kdXJhdGlvbih0aGlzLnRyYW5zaXRpb25EdXJhdGlvbilcbiAgICAgICAgICAuZWFzZShlYXNlTGluZWFyKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIChkYXRhOiBEYXR1bSkgPT4gKG1vbWVudChkYXRhLmRhdGUpLmRheSgpID09PSBzZWxlY3RlZERheS5kYXkoKSkgPyAxIDogMC4xKTtcbiAgICAgIH0pXG4gICAgICAub24oJ21vdXNlb3V0JywgKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5pblRyYW5zaXRpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pdGVtcy5zZWxlY3RBbGwoJy5pdGVtLWJsb2NrLW1vbnRoJylcbiAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgLmR1cmF0aW9uKHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uKVxuICAgICAgICAgIC5lYXNlKGVhc2VMaW5lYXIpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMSk7XG4gICAgICB9KTtcbiAgICAvLyBBZGQgYnV0dG9uIHRvIHN3aXRjaCBiYWNrIHRvIHByZXZpb3VzIG92ZXJ2aWV3XG4gICAgdGhpcy5kcmF3QnV0dG9uKCk7XG4gIH1cblxuICBkcmF3V2Vla092ZXJ2aWV3KCkge1xuICAgIC8vIEFkZCBjdXJyZW50IG92ZXJ2aWV3IHRvIHRoZSBoaXN0b3J5XG4gICAgaWYgKHRoaXMuaGlzdG9yeVt0aGlzLmhpc3RvcnkubGVuZ3RoIC0gMV0gIT09IHRoaXMub3ZlcnZpZXcpIHtcbiAgICAgIHRoaXMuaGlzdG9yeS5wdXNoKHRoaXMub3ZlcnZpZXcpO1xuICAgIH1cbiAgICAvLyBEZWZpbmUgYmVnaW5uaW5nIGFuZCBlbmQgb2YgdGhlIHdlZWtcbiAgICBjb25zdCBzdGFydE9mV2VlazogTW9tZW50ID0gbW9tZW50KHRoaXMuc2VsZWN0ZWQuZGF0ZSkuc3RhcnRPZignd2VlaycpO1xuICAgIGNvbnN0IGVuZE9mV2VlazogTW9tZW50ID0gbW9tZW50KHRoaXMuc2VsZWN0ZWQuZGF0ZSkuZW5kT2YoJ3dlZWsnKTtcbiAgICAvLyBGaWx0ZXIgZGF0YSBkb3duIHRvIHRoZSBzZWxlY3RlZCB3ZWVrXG4gICAgbGV0IHdlZWtEYXRhOiBEYXR1bVtdID0gW107XG4gICAgdGhpcy5fZGF0YS5maWx0ZXIoKGQ6IERhdHVtKSA9PiB7XG4gICAgICByZXR1cm4gZC5kYXRlLmlzQmV0d2VlbihzdGFydE9mV2VlaywgZW5kT2ZXZWVrLCBudWxsLCAnW10nKTtcbiAgICB9KS5tYXAoKGQ6IERhdHVtKSA9PiB7XG4gICAgICBjb25zdCBzY2FsZTogRGF0dW1bXSA9IFtdO1xuICAgICAgZC5kZXRhaWxzLmZvckVhY2goKGRldDogRGV0YWlsKSA9PiB7XG4gICAgICAgIGNvbnN0IGRhdGU6IE1vbWVudCA9IG1vbWVudChkZXQuZGF0ZSk7XG4gICAgICAgIGNvbnN0IGkgPSBkYXRlLmhvdXJzKCk7XG4gICAgICAgIGlmICghc2NhbGVbaV0pIHtcbiAgICAgICAgICBzY2FsZVtpXSA9IHtcbiAgICAgICAgICAgIGRhdGU6IGRhdGUuc3RhcnRPZignaG91cicpLFxuICAgICAgICAgICAgdG90YWw6IDAsXG4gICAgICAgICAgICBkZXRhaWxzOiBbXSxcbiAgICAgICAgICAgIHN1bW1hcnk6IFtdXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBzY2FsZVtpXS50b3RhbCArPSBkZXQudmFsdWU7XG4gICAgICAgIHNjYWxlW2ldLmRldGFpbHMucHVzaChkZXQpO1xuICAgICAgfSk7XG4gICAgICBzY2FsZS5mb3JFYWNoKHMgPT4ge1xuICAgICAgICBjb25zdCBncm91cCA9IHRoaXMuZ3JvdXBCeShzLmRldGFpbHMsICduYW1lJyk7XG4gICAgICAgIE9iamVjdC5rZXlzKGdyb3VwKS5mb3JFYWNoKGsgPT5cbiAgICAgICAgICBzLnN1bW1hcnkucHVzaCh7XG4gICAgICAgICAgICBuYW1lOiBrLFxuICAgICAgICAgICAgdG90YWw6IHN1bShncm91cFtrXSwgKGRhdGE6IGFueSkgPT4gZGF0YS52YWx1ZSksXG4gICAgICAgICAgICBjb2xvcjogZ3JvdXBba11bMF0uY29sb3JcbiAgICAgICAgICB9KSk7XG4gICAgICB9KTtcbiAgICAgIHdlZWtEYXRhID0gd2Vla0RhdGEuY29uY2F0KHNjYWxlKTtcbiAgICB9KTtcbiAgICB3ZWVrRGF0YSA9IEdUU0xpYi5jbGVhbkFycmF5KHdlZWtEYXRhKTtcbiAgICBjb25zdCBtYXhWYWx1ZTogbnVtYmVyID0gbWF4KHdlZWtEYXRhLCAoZDogRGF0dW0pID0+IGQudG90YWwpO1xuICAgIC8vIERlZmluZSBkYXkgbGFiZWxzIGFuZCBheGlzXG4gICAgY29uc3QgZGF5TGFiZWxzID0gdGltZURheXMobW9tZW50LnV0YygpLnN0YXJ0T2YoJ3dlZWsnKS50b0RhdGUoKSwgbW9tZW50LnV0YygpLmVuZE9mKCd3ZWVrJykudG9EYXRlKCkpO1xuICAgIGNvbnN0IGRheVNjYWxlID0gc2NhbGVCYW5kKClcbiAgICAgIC5yYW5nZVJvdW5kKFt0aGlzLmxhYmVsUGFkZGluZywgdGhpcy5nSGVpZ2h0XSlcbiAgICAgIC5kb21haW4oZGF5TGFiZWxzLm1hcCgoZDogRGF0ZSkgPT4gbW9tZW50LnV0YyhkKS53ZWVrZGF5KCkudG9TdHJpbmcoKSkpO1xuICAgIC8vIERlZmluZSBob3VycyBsYWJlbHMgYW5kIGF4aXNcbiAgICBjb25zdCBob3Vyc0xhYmVsczogc3RyaW5nW10gPSBbXTtcbiAgICByYW5nZSgwLCAyNCkuZm9yRWFjaChoID0+IGhvdXJzTGFiZWxzLnB1c2gobW9tZW50LnV0YygpLmhvdXJzKGgpLnN0YXJ0T2YoJ2hvdXInKS5mb3JtYXQoJ0hIOm1tJykpKTtcbiAgICBjb25zdCBob3VyU2NhbGUgPSBzY2FsZUJhbmQoKS5yYW5nZVJvdW5kKFt0aGlzLmxhYmVsUGFkZGluZywgdGhpcy5nV2lkdGhdKS5wYWRkaW5nKDAuMDEpLmRvbWFpbihob3Vyc0xhYmVscyk7XG4gICAgY29uc3QgY29sb3IgPSBzY2FsZUxpbmVhcjxzdHJpbmc+KClcbiAgICAgIC5yYW5nZShbdGhpcy5taW5Db2xvciB8fCBDYWxlbmRhckhlYXRtYXBDb21wb25lbnQuREVGX01JTl9DT0xPUiwgdGhpcy5tYXhDb2xvciB8fCBDYWxlbmRhckhlYXRtYXBDb21wb25lbnQuREVGX01BWF9DT0xPUl0pXG4gICAgICAuZG9tYWluKFstMC4xNSAqIG1heFZhbHVlLCBtYXhWYWx1ZV0pO1xuICAgIC8vIEFkZCB3ZWVrIGRhdGEgaXRlbXMgdG8gdGhlIG92ZXJ2aWV3XG4gICAgdGhpcy5pdGVtcy5zZWxlY3RBbGwoJy5pdGVtLWJsb2NrLXdlZWsnKS5yZW1vdmUoKTtcbiAgICB0aGlzLml0ZW1zLnNlbGVjdEFsbCgnLml0ZW0tYmxvY2std2VlaycpXG4gICAgICAuZGF0YSh3ZWVrRGF0YSlcbiAgICAgIC5lbnRlcigpXG4gICAgICAuYXBwZW5kKCdyZWN0JylcbiAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAuYXR0cignY2xhc3MnLCAnaXRlbSBpdGVtLWJsb2NrLXdlZWsnKVxuICAgICAgLmF0dHIoJ3knLCAoZDogRGF0dW0pID0+IHRoaXMuY2FsY0l0ZW1ZKGQpXG4gICAgICAgICsgKHRoaXMuaXRlbVNpemUgLSB0aGlzLmNhbGNJdGVtU2l6ZShkLCBtYXhWYWx1ZSkpIC8gMilcbiAgICAgIC5hdHRyKCd4JywgKGQ6IERhdHVtKSA9PiB0aGlzLmd1dHRlclxuICAgICAgICArIGhvdXJTY2FsZShtb21lbnQoZC5kYXRlKS5zdGFydE9mKCdob3VyJykuZm9ybWF0KCdISDptbScpKVxuICAgICAgICArICh0aGlzLml0ZW1TaXplIC0gdGhpcy5jYWxjSXRlbVNpemUoZCwgbWF4VmFsdWUpKSAvIDIpXG4gICAgICAuYXR0cigncngnLCAoZDogRGF0dW0pID0+IHRoaXMuY2FsY0l0ZW1TaXplKGQsIG1heFZhbHVlKSlcbiAgICAgIC5hdHRyKCdyeScsIChkOiBEYXR1bSkgPT4gdGhpcy5jYWxjSXRlbVNpemUoZCwgbWF4VmFsdWUpKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgKGQ6IERhdHVtKSA9PiB0aGlzLmNhbGNJdGVtU2l6ZShkLCBtYXhWYWx1ZSkpXG4gICAgICAuYXR0cignaGVpZ2h0JywgKGQ6IERhdHVtKSA9PiB0aGlzLmNhbGNJdGVtU2l6ZShkLCBtYXhWYWx1ZSkpXG4gICAgICAuYXR0cignZmlsbCcsIChkOiBEYXR1bSkgPT4gKGQudG90YWwgPiAwKSA/IGNvbG9yKGQudG90YWwpIDogJ3RyYW5zcGFyZW50JylcbiAgICAgIC5vbignY2xpY2snLCAoZDogRGF0dW0pID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaW5UcmFuc2l0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIERvbid0IHRyYW5zaXRpb24gaWYgdGhlcmUgaXMgbm8gZGF0YSB0byBzaG93XG4gICAgICAgIGlmIChkLnRvdGFsID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW5UcmFuc2l0aW9uID0gdHJ1ZTtcbiAgICAgICAgLy8gU2V0IHNlbGVjdGVkIGRhdGUgdG8gdGhlIG9uZSBjbGlja2VkIG9uXG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBkO1xuICAgICAgICAvLyBIaWRlIHRvb2x0aXBcbiAgICAgICAgdGhpcy5oaWRlVG9vbHRpcCgpO1xuICAgICAgICAvLyBSZW1vdmUgYWxsIHdlZWsgb3ZlcnZpZXcgcmVsYXRlZCBpdGVtcyBhbmQgbGFiZWxzXG4gICAgICAgIHRoaXMucmVtb3ZlV2Vla092ZXJ2aWV3KCk7XG4gICAgICAgIC8vIFJlZHJhdyB0aGUgY2hhcnRcbiAgICAgICAgdGhpcy5vdmVydmlldyA9ICdkYXknO1xuICAgICAgICB0aGlzLmRyYXdDaGFydCgpO1xuICAgICAgfSkub24oJ21vdXNlb3ZlcicsIChkOiBEYXR1bSkgPT4ge1xuICAgICAgaWYgKHRoaXMuaW5UcmFuc2l0aW9uKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vIENhbGN1bGF0ZSB0b29sdGlwIHBvc2l0aW9uXG4gICAgICBsZXQgeCA9IGhvdXJTY2FsZShtb21lbnQoZC5kYXRlKS5zdGFydE9mKCdob3VyJykuZm9ybWF0KCdISDptbScpKSArIHRoaXMudG9vbHRpcFBhZGRpbmc7XG4gICAgICB3aGlsZSAodGhpcy5nV2lkdGggLSB4IDwgKHRoaXMudG9vbHRpcFdpZHRoICsgdGhpcy50b29sdGlwUGFkZGluZyAqIDMpKSB7XG4gICAgICAgIHggLT0gMTA7XG4gICAgICB9XG4gICAgICBjb25zdCB5ID0gZGF5U2NhbGUoZC5kYXRlLndlZWtkYXkoKS50b1N0cmluZygpKSArIHRoaXMudG9vbHRpcFBhZGRpbmc7XG4gICAgICAvLyBTaG93IHRvb2x0aXBcbiAgICAgIHRoaXMudG9vbHRpcC5odG1sKHRoaXMuZ2V0VG9vbHRpcChkKSlcbiAgICAgICAgLnN0eWxlKCdsZWZ0JywgeCArICdweCcpXG4gICAgICAgIC5zdHlsZSgndG9wJywgeSArICdweCcpXG4gICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgLmR1cmF0aW9uKHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uIC8gMilcbiAgICAgICAgLmVhc2UoZWFzZUxpbmVhcilcbiAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMSk7XG4gICAgfSlcbiAgICAgIC5vbignbW91c2VvdXQnLCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmluVHJhbnNpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmhpZGVUb29sdGlwKCk7XG4gICAgICB9KVxuICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgLmRlbGF5KCgpID0+IChNYXRoLmNvcyhNYXRoLlBJICogTWF0aC5yYW5kb20oKSkgKyAxKSAqIHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uKVxuICAgICAgLmR1cmF0aW9uKCgpID0+IHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uKVxuICAgICAgLmVhc2UoZWFzZUxpbmVhcilcbiAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpXG4gICAgICAuY2FsbCgodHJhbnNpdGlvbjogYW55LCBjYWxsYmFjazogYW55KSA9PiB7XG4gICAgICAgIGlmICh0cmFuc2l0aW9uLmVtcHR5KCkpIHtcbiAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBuID0gMDtcbiAgICAgICAgdHJhbnNpdGlvbi5lYWNoKCgpID0+ICsrbikub24oJ2VuZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmICghLS1uKSB7XG4gICAgICAgICAgICBjYWxsYmFjay5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9LCAoKSA9PiB0aGlzLmluVHJhbnNpdGlvbiA9IGZhbHNlKTtcblxuICAgIC8vIEFkZCB3ZWVrIGxhYmVsc1xuICAgIHRoaXMubGFiZWxzLnNlbGVjdEFsbCgnLmxhYmVsLXdlZWsnKS5yZW1vdmUoKTtcbiAgICB0aGlzLmxhYmVscy5zZWxlY3RBbGwoJy5sYWJlbC13ZWVrJylcbiAgICAgIC5kYXRhKGhvdXJzTGFiZWxzKVxuICAgICAgLmVudGVyKClcbiAgICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xhYmVsIGxhYmVsLXdlZWsnKVxuICAgICAgLmF0dHIoJ2ZvbnQtc2l6ZScsICgpID0+IE1hdGguZmxvb3IodGhpcy5sYWJlbFBhZGRpbmcgLyAzKSArICdweCcpXG4gICAgICAudGV4dCgoZDogc3RyaW5nKSA9PiBkKVxuICAgICAgLmF0dHIoJ3gnLCAoZDogc3RyaW5nKSA9PiBob3VyU2NhbGUoZCkpXG4gICAgICAuYXR0cigneScsIHRoaXMubGFiZWxQYWRkaW5nIC8gMilcbiAgICAgIC5vbignbW91c2VlbnRlcicsIChob3VyOiBzdHJpbmcpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaW5UcmFuc2l0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaXRlbXMuc2VsZWN0QWxsKCcuaXRlbS1ibG9jay13ZWVrJylcbiAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgLmR1cmF0aW9uKHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uKVxuICAgICAgICAgIC5lYXNlKGVhc2VMaW5lYXIpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgKGQ6IERhdHVtKSA9PiAobW9tZW50KGQuZGF0ZSkuc3RhcnRPZignaG91cicpLmZvcm1hdCgnSEg6bW0nKSA9PT0gaG91cikgPyAxIDogMC4xKTtcbiAgICAgIH0pXG4gICAgICAub24oJ21vdXNlb3V0JywgKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5pblRyYW5zaXRpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pdGVtcy5zZWxlY3RBbGwoJy5pdGVtLWJsb2NrLXdlZWsnKVxuICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAuZHVyYXRpb24odGhpcy50cmFuc2l0aW9uRHVyYXRpb24pXG4gICAgICAgICAgLmVhc2UoZWFzZUxpbmVhcilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKTtcbiAgICAgIH0pO1xuICAgIC8vIEFkZCBkYXkgbGFiZWxzXG4gICAgdGhpcy5sYWJlbHMuc2VsZWN0QWxsKCcubGFiZWwtZGF5JykucmVtb3ZlKCk7XG4gICAgdGhpcy5sYWJlbHMuc2VsZWN0QWxsKCcubGFiZWwtZGF5JylcbiAgICAgIC5kYXRhKGRheUxhYmVscylcbiAgICAgIC5lbnRlcigpXG4gICAgICAuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdsYWJlbCBsYWJlbC1kYXknKVxuICAgICAgLmF0dHIoJ3gnLCB0aGlzLmxhYmVsUGFkZGluZyAvIDMpXG4gICAgICAuYXR0cigneScsIChkOiBEYXRlLCBpOiBudW1iZXIpID0+IGRheVNjYWxlKGkudG9TdHJpbmcoKSkgKyBkYXlTY2FsZS5iYW5kd2lkdGgoKSAvIDEuNzUpXG4gICAgICAuc3R5bGUoJ3RleHQtYW5jaG9yJywgJ2xlZnQnKVxuICAgICAgLmF0dHIoJ2ZvbnQtc2l6ZScsICgpID0+IE1hdGguZmxvb3IodGhpcy5sYWJlbFBhZGRpbmcgLyAzKSArICdweCcpXG4gICAgICAudGV4dCgoZDogRGF0ZSkgPT4gbW9tZW50LnV0YyhkKS5mb3JtYXQoJ2RkZGQnKVswXSlcbiAgICAgIC5vbignbW91c2VlbnRlcicsIChkOiBEYXRlKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmluVHJhbnNpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzZWxlY3RlZERheSA9IG1vbWVudC51dGMoZCk7XG4gICAgICAgIHRoaXMuaXRlbXMuc2VsZWN0QWxsKCcuaXRlbS1ibG9jay13ZWVrJylcbiAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgLmR1cmF0aW9uKHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uKVxuICAgICAgICAgIC5lYXNlKGVhc2VMaW5lYXIpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgKGRhdGE6IERhdHVtKSA9PiAobW9tZW50KGRhdGEuZGF0ZSkuZGF5KCkgPT09IHNlbGVjdGVkRGF5LmRheSgpKSA/IDEgOiAwLjEpO1xuICAgICAgfSlcbiAgICAgIC5vbignbW91c2VvdXQnLCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmluVHJhbnNpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLml0ZW1zLnNlbGVjdEFsbCgnLml0ZW0tYmxvY2std2VlaycpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgIC5kdXJhdGlvbih0aGlzLnRyYW5zaXRpb25EdXJhdGlvbilcbiAgICAgICAgICAuZWFzZShlYXNlTGluZWFyKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpO1xuICAgICAgfSk7XG5cbiAgICAvLyBBZGQgYnV0dG9uIHRvIHN3aXRjaCBiYWNrIHRvIHByZXZpb3VzIG92ZXJ2aWV3XG4gICAgdGhpcy5kcmF3QnV0dG9uKCk7XG4gIH1cblxuICBkcmF3RGF5T3ZlcnZpZXcoKSB7XG4gICAgLy8gQWRkIGN1cnJlbnQgb3ZlcnZpZXcgdG8gdGhlIGhpc3RvcnlcbiAgICBpZiAodGhpcy5oaXN0b3J5W3RoaXMuaGlzdG9yeS5sZW5ndGggLSAxXSAhPT0gdGhpcy5vdmVydmlldykge1xuICAgICAgdGhpcy5oaXN0b3J5LnB1c2godGhpcy5vdmVydmlldyk7XG4gICAgfVxuICAgIC8vIEluaXRpYWxpemUgc2VsZWN0ZWQgZGF0ZSB0byB0b2RheSBpZiBpdCB3YXMgbm90IHNldFxuICAgIGlmICghT2JqZWN0LmtleXModGhpcy5zZWxlY3RlZCkubGVuZ3RoKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkID0gdGhpcy5fZGF0YVt0aGlzLl9kYXRhLmxlbmd0aCAtIDFdO1xuICAgIH1cbiAgICBjb25zdCBzdGFydE9mRGF5OiBNb21lbnQgPSBtb21lbnQodGhpcy5zZWxlY3RlZC5kYXRlKS5zdGFydE9mKCdkYXknKTtcbiAgICBjb25zdCBlbmRPZkRheTogTW9tZW50ID0gbW9tZW50KHRoaXMuc2VsZWN0ZWQuZGF0ZSkuZW5kT2YoJ2RheScpO1xuICAgIC8vIEZpbHRlciBkYXRhIGRvd24gdG8gdGhlIHNlbGVjdGVkIG1vbnRoXG4gICAgbGV0IGRheURhdGE6IERhdHVtW10gPSBbXTtcbiAgICB0aGlzLl9kYXRhLmZpbHRlcigoZDogRGF0dW0pID0+IHtcbiAgICAgIHJldHVybiBkLmRhdGUuaXNCZXR3ZWVuKHN0YXJ0T2ZEYXksIGVuZE9mRGF5LCBudWxsLCAnW10nKTtcbiAgICB9KS5tYXAoKGQ6IERhdHVtKSA9PiB7XG4gICAgICBjb25zdCBzY2FsZSA9IFtdO1xuICAgICAgZC5kZXRhaWxzLmZvckVhY2goKGRldDogRGV0YWlsKSA9PiB7XG4gICAgICAgIGNvbnN0IGRhdGU6IE1vbWVudCA9IG1vbWVudChkZXQuZGF0ZSk7XG4gICAgICAgIGNvbnN0IGkgPSBkYXRlLmhvdXJzKCk7XG4gICAgICAgIGlmICghc2NhbGVbaV0pIHtcbiAgICAgICAgICBzY2FsZVtpXSA9IHtcbiAgICAgICAgICAgIGRhdGU6IGRhdGUuc3RhcnRPZignaG91cicpLFxuICAgICAgICAgICAgdG90YWw6IDAsXG4gICAgICAgICAgICBkZXRhaWxzOiBbXSxcbiAgICAgICAgICAgIHN1bW1hcnk6IFtdXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBzY2FsZVtpXS50b3RhbCArPSBkZXQudmFsdWU7XG4gICAgICAgIHNjYWxlW2ldLmRldGFpbHMucHVzaChkZXQpO1xuICAgICAgfSk7XG4gICAgICBzY2FsZS5mb3JFYWNoKHMgPT4ge1xuICAgICAgICBjb25zdCBncm91cCA9IHRoaXMuZ3JvdXBCeShzLmRldGFpbHMsICduYW1lJyk7XG4gICAgICAgIE9iamVjdC5rZXlzKGdyb3VwKS5mb3JFYWNoKGsgPT4ge1xuICAgICAgICAgIHMuc3VtbWFyeS5wdXNoKHtcbiAgICAgICAgICAgIG5hbWU6IGssXG4gICAgICAgICAgICB0b3RhbDogc3VtKGdyb3VwW2tdLCAoaXRlbTogYW55KSA9PiBpdGVtLnZhbHVlKSxcbiAgICAgICAgICAgIGNvbG9yOiBncm91cFtrXVswXS5jb2xvclxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgZGF5RGF0YSA9IGRheURhdGEuY29uY2F0KHNjYWxlKTtcbiAgICB9KTtcbiAgICBjb25zdCBkYXRhOiBTdW1tYXJ5W10gPSBbXTtcbiAgICBkYXlEYXRhLmZvckVhY2goKGQ6IERhdHVtKSA9PiB7XG4gICAgICBjb25zdCBkYXRlID0gZC5kYXRlO1xuICAgICAgZC5zdW1tYXJ5LmZvckVhY2goKHM6IFN1bW1hcnkpID0+IHtcbiAgICAgICAgcy5kYXRlID0gZGF0ZTtcbiAgICAgICAgZGF0YS5wdXNoKHMpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgZGF5RGF0YSA9IEdUU0xpYi5jbGVhbkFycmF5KGRheURhdGEpO1xuICAgIGNvbnN0IG1heFZhbHVlOiBudW1iZXIgPSBtYXgoZGF0YSwgKGQ6IFN1bW1hcnkpID0+IGQudG90YWwpO1xuICAgIGNvbnN0IGd0c05hbWVzID0gdGhpcy5zZWxlY3RlZC5zdW1tYXJ5Lm1hcCgoc3VtbWFyeTogU3VtbWFyeSkgPT4gc3VtbWFyeS5uYW1lKTtcbiAgICBjb25zdCBndHNOYW1lU2NhbGUgPSBzY2FsZUJhbmQoKS5yYW5nZVJvdW5kKFt0aGlzLmxhYmVsUGFkZGluZywgdGhpcy5nSGVpZ2h0XSkuZG9tYWluKGd0c05hbWVzKTtcbiAgICBjb25zdCBob3VyTGFiZWxzOiBzdHJpbmdbXSA9IFtdO1xuICAgIHJhbmdlKDAsIDI0KS5mb3JFYWNoKGggPT4gaG91ckxhYmVscy5wdXNoKG1vbWVudC51dGMoKS5ob3VycyhoKS5zdGFydE9mKCdob3VyJykuZm9ybWF0KCdISDptbScpKSk7XG4gICAgY29uc3QgZGF5U2NhbGUgPSBzY2FsZUJhbmQoKVxuICAgICAgLnJhbmdlUm91bmQoW3RoaXMubGFiZWxQYWRkaW5nLCB0aGlzLmdXaWR0aF0pXG4gICAgICAucGFkZGluZygwLjAxKVxuICAgICAgLmRvbWFpbihob3VyTGFiZWxzKTtcbiAgICB0aGlzLml0ZW1zLnNlbGVjdEFsbCgnLml0ZW0tYmxvY2snKS5yZW1vdmUoKTtcbiAgICB0aGlzLml0ZW1zLnNlbGVjdEFsbCgnLml0ZW0tYmxvY2snKVxuICAgICAgLmRhdGEoZGF0YSlcbiAgICAgIC5lbnRlcigpXG4gICAgICAuYXBwZW5kKCdyZWN0JylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdpdGVtIGl0ZW0tYmxvY2snKVxuICAgICAgLmF0dHIoJ3gnLCAoZDogU3VtbWFyeSkgPT4gdGhpcy5ndXR0ZXJcbiAgICAgICAgKyBkYXlTY2FsZShtb21lbnQoZC5kYXRlKS5zdGFydE9mKCdob3VyJykuZm9ybWF0KCdISDptbScpKVxuICAgICAgICArICh0aGlzLml0ZW1TaXplIC0gdGhpcy5jYWxjSXRlbVNpemUoZCwgbWF4VmFsdWUpKSAvIDIpXG4gICAgICAuYXR0cigneScsIChkOiBTdW1tYXJ5KSA9PiB7XG4gICAgICAgIHJldHVybiAoZ3RzTmFtZVNjYWxlKGQubmFtZSkgfHwgMSkgLSAodGhpcy5pdGVtU2l6ZSAtIHRoaXMuY2FsY0l0ZW1TaXplKGQsIG1heFZhbHVlKSkgLyAyO1xuICAgICAgfSlcbiAgICAgIC5hdHRyKCdyeCcsIChkOiBTdW1tYXJ5KSA9PiB0aGlzLmNhbGNJdGVtU2l6ZShkLCBtYXhWYWx1ZSkpXG4gICAgICAuYXR0cigncnknLCAoZDogU3VtbWFyeSkgPT4gdGhpcy5jYWxjSXRlbVNpemUoZCwgbWF4VmFsdWUpKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgKGQ6IFN1bW1hcnkpID0+IHRoaXMuY2FsY0l0ZW1TaXplKGQsIG1heFZhbHVlKSlcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCAoZDogU3VtbWFyeSkgPT4gdGhpcy5jYWxjSXRlbVNpemUoZCwgbWF4VmFsdWUpKVxuICAgICAgLmF0dHIoJ2ZpbGwnLCAoZDogU3VtbWFyeSkgPT4ge1xuICAgICAgICBjb25zdCBjb2xvciA9IHNjYWxlTGluZWFyPHN0cmluZz4oKVxuICAgICAgICAgIC5yYW5nZShbJyNmZmZmZmYnLCBkLmNvbG9yIHx8IENhbGVuZGFySGVhdG1hcENvbXBvbmVudC5ERUZfTUlOX0NPTE9SXSlcbiAgICAgICAgICAuZG9tYWluKFstMC41ICogbWF4VmFsdWUsIG1heFZhbHVlXSk7XG4gICAgICAgIHJldHVybiBjb2xvcihkLnRvdGFsKTtcbiAgICAgIH0pXG4gICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgLm9uKCdtb3VzZW92ZXInLCAoZDogU3VtbWFyeSkgPT4ge1xuICAgICAgICBpZiAodGhpcy5pblRyYW5zaXRpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRvb2x0aXAgcG9zaXRpb25cbiAgICAgICAgbGV0IHggPSBkYXlTY2FsZShtb21lbnQoZC5kYXRlKS5zdGFydE9mKCdob3VyJykuZm9ybWF0KCdISDptbScpKSArIHRoaXMudG9vbHRpcFBhZGRpbmc7XG4gICAgICAgIHdoaWxlICh0aGlzLmdXaWR0aCAtIHggPCAodGhpcy50b29sdGlwV2lkdGggKyB0aGlzLnRvb2x0aXBQYWRkaW5nICogMykpIHtcbiAgICAgICAgICB4IC09IDEwO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHkgPSBndHNOYW1lU2NhbGUoZC5uYW1lKSArIHRoaXMudG9vbHRpcFBhZGRpbmc7XG4gICAgICAgIC8vIFNob3cgdG9vbHRpcFxuICAgICAgICB0aGlzLnRvb2x0aXAuaHRtbCh0aGlzLmdldFRvb2x0aXAoZCkpXG4gICAgICAgICAgLnN0eWxlKCdsZWZ0JywgeCArICdweCcpXG4gICAgICAgICAgLnN0eWxlKCd0b3AnLCB5ICsgJ3B4JylcbiAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgLmR1cmF0aW9uKHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uIC8gMilcbiAgICAgICAgICAuZWFzZShlYXNlTGluZWFyKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpO1xuICAgICAgfSlcbiAgICAgIC5vbignbW91c2VvdXQnLCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmluVHJhbnNpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmhpZGVUb29sdGlwKCk7XG4gICAgICB9KVxuICAgICAgLm9uKCdjbGljaycsIChkOiBTdW1tYXJ5KSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmhhbmRsZXIpIHtcbiAgICAgICAgICB0aGlzLmhhbmRsZXIuZW1pdChkKTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgIC5kZWxheSgoKSA9PiAoTWF0aC5jb3MoTWF0aC5QSSAqIE1hdGgucmFuZG9tKCkpICsgMSkgKiB0aGlzLnRyYW5zaXRpb25EdXJhdGlvbilcbiAgICAgIC5kdXJhdGlvbigoKSA9PiB0aGlzLnRyYW5zaXRpb25EdXJhdGlvbilcbiAgICAgIC5lYXNlKGVhc2VMaW5lYXIpXG4gICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKVxuICAgICAgLmNhbGwoKHRyYW5zaXRpb246IGFueSwgY2FsbGJhY2s6IGFueSkgPT4ge1xuICAgICAgICBpZiAodHJhbnNpdGlvbi5lbXB0eSgpKSB7XG4gICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbiA9IDA7XG4gICAgICAgIHRyYW5zaXRpb24uZWFjaCgoKSA9PiArK24pLm9uKCdlbmQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoIS0tbikge1xuICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSwgKCkgPT4gdGhpcy5pblRyYW5zaXRpb24gPSBmYWxzZSk7XG5cbiAgICAvLyBBZGQgdGltZSBsYWJlbHNcbiAgICB0aGlzLmxhYmVscy5zZWxlY3RBbGwoJy5sYWJlbC10aW1lJykucmVtb3ZlKCk7XG4gICAgdGhpcy5sYWJlbHMuc2VsZWN0QWxsKCcubGFiZWwtdGltZScpXG4gICAgICAuZGF0YShob3VyTGFiZWxzKVxuICAgICAgLmVudGVyKClcbiAgICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xhYmVsIGxhYmVsLXRpbWUnKVxuICAgICAgLmF0dHIoJ2ZvbnQtc2l6ZScsICgpID0+IE1hdGguZmxvb3IodGhpcy5sYWJlbFBhZGRpbmcgLyAzKSArICdweCcpXG4gICAgICAudGV4dCgoZDogc3RyaW5nKSA9PiBkKVxuICAgICAgLmF0dHIoJ3gnLCAoZDogc3RyaW5nKSA9PiBkYXlTY2FsZShkKSlcbiAgICAgIC5hdHRyKCd5JywgdGhpcy5sYWJlbFBhZGRpbmcgLyAyKVxuICAgICAgLm9uKCdtb3VzZWVudGVyJywgKGQ6IHN0cmluZykgPT4ge1xuICAgICAgICBpZiAodGhpcy5pblRyYW5zaXRpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc2VsZWN0ZWQgPSBkO1xuICAgICAgICAvLyBjb25zdCBzZWxlY3RlZCA9IGl0ZW1TY2FsZShtb21lbnQudXRjKGQpKTtcbiAgICAgICAgdGhpcy5pdGVtcy5zZWxlY3RBbGwoJy5pdGVtLWJsb2NrJylcbiAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgLmR1cmF0aW9uKHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uKVxuICAgICAgICAgIC5lYXNlKGVhc2VMaW5lYXIpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgKGl0ZW06IGFueSkgPT4gKGl0ZW0uZGF0ZS5mb3JtYXQoJ0hIOm1tJykgPT09IHNlbGVjdGVkKSA/IDEgOiAwLjEpO1xuICAgICAgfSlcbiAgICAgIC5vbignbW91c2VvdXQnLCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmluVHJhbnNpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLml0ZW1zLnNlbGVjdEFsbCgnLml0ZW0tYmxvY2snKVxuICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAuZHVyYXRpb24odGhpcy50cmFuc2l0aW9uRHVyYXRpb24pXG4gICAgICAgICAgLmVhc2UoZWFzZUxpbmVhcilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKTtcbiAgICAgIH0pO1xuICAgIC8vIEFkZCBwcm9qZWN0IGxhYmVsc1xuICAgIGNvbnN0IGxhYmVsUGFkZGluZyA9IHRoaXMubGFiZWxQYWRkaW5nO1xuICAgIHRoaXMubGFiZWxzLnNlbGVjdEFsbCgnLmxhYmVsLXByb2plY3QnKS5yZW1vdmUoKTtcbiAgICB0aGlzLmxhYmVscy5zZWxlY3RBbGwoJy5sYWJlbC1wcm9qZWN0JylcbiAgICAgIC5kYXRhKGd0c05hbWVzKVxuICAgICAgLmVudGVyKClcbiAgICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xhYmVsIGxhYmVsLXByb2plY3QnKVxuICAgICAgLmF0dHIoJ3gnLCB0aGlzLmd1dHRlcilcbiAgICAgIC5hdHRyKCd5JywgKGQ6IHN0cmluZykgPT4gZ3RzTmFtZVNjYWxlKGQpICsgdGhpcy5pdGVtU2l6ZSAvIDIpXG4gICAgICAuYXR0cignbWluLWhlaWdodCcsICgpID0+IGd0c05hbWVTY2FsZS5iYW5kd2lkdGgoKSlcbiAgICAgIC5zdHlsZSgndGV4dC1hbmNob3InLCAnbGVmdCcpXG4gICAgICAuYXR0cignZm9udC1zaXplJywgKCkgPT4gTWF0aC5mbG9vcih0aGlzLmxhYmVsUGFkZGluZyAvIDMpICsgJ3B4JylcbiAgICAgIC50ZXh0KChkOiBzdHJpbmcpID0+IGQpXG4gICAgICAuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3Qgb2JqID0gc2VsZWN0KHRoaXMpO1xuICAgICAgICBsZXQgdGV4dExlbmd0aCA9IG9iai5ub2RlKCkuZ2V0Q29tcHV0ZWRUZXh0TGVuZ3RoKCk7XG4gICAgICAgIGxldCB0ZXh0ID0gb2JqLnRleHQoKTtcbiAgICAgICAgd2hpbGUgKHRleHRMZW5ndGggPiAobGFiZWxQYWRkaW5nICogMS41KSAmJiB0ZXh0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0ZXh0ID0gdGV4dC5zbGljZSgwLCAtMSk7XG4gICAgICAgICAgb2JqLnRleHQodGV4dCArICcuLi4nKTtcbiAgICAgICAgICB0ZXh0TGVuZ3RoID0gb2JqLm5vZGUoKS5nZXRDb21wdXRlZFRleHRMZW5ndGgoKTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC5vbignbW91c2VlbnRlcicsIChndHNOYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaW5UcmFuc2l0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaXRlbXMuc2VsZWN0QWxsKCcuaXRlbS1ibG9jaycpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgIC5kdXJhdGlvbih0aGlzLnRyYW5zaXRpb25EdXJhdGlvbilcbiAgICAgICAgICAuZWFzZShlYXNlTGluZWFyKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIChkOiBTdW1tYXJ5KSA9PiAoZC5uYW1lID09PSBndHNOYW1lKSA/IDEgOiAwLjEpO1xuICAgICAgfSlcbiAgICAgIC5vbignbW91c2VvdXQnLCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmluVHJhbnNpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLml0ZW1zLnNlbGVjdEFsbCgnLml0ZW0tYmxvY2snKVxuICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAuZHVyYXRpb24odGhpcy50cmFuc2l0aW9uRHVyYXRpb24pXG4gICAgICAgICAgLmVhc2UoZWFzZUxpbmVhcilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKTtcbiAgICAgIH0pO1xuICAgIC8vIEFkZCBidXR0b24gdG8gc3dpdGNoIGJhY2sgdG8gcHJldmlvdXMgb3ZlcnZpZXdcbiAgICB0aGlzLmRyYXdCdXR0b24oKTtcbiAgfVxuXG4gIHByaXZhdGUgY2FsY0l0ZW1YKGQ6IERhdHVtLCBzdGFydE9mWWVhcjogTW9tZW50KSB7XG4gICAgY29uc3QgZGF5SW5kZXggPSBNYXRoLnJvdW5kKCgrbW9tZW50KGQuZGF0ZSkgLSArc3RhcnRPZlllYXIuc3RhcnRPZignd2VlaycpKSAvIDg2NDAwMDAwKTtcbiAgICBjb25zdCBjb2xJbmRleCA9IE1hdGgudHJ1bmMoZGF5SW5kZXggLyA3KTtcbiAgICByZXR1cm4gY29sSW5kZXggKiAodGhpcy5pdGVtU2l6ZSArIHRoaXMuZ3V0dGVyKSArIHRoaXMubGFiZWxQYWRkaW5nO1xuICB9XG5cbiAgcHJpdmF0ZSBjYWxjSXRlbVhNb250aChkOiBEYXR1bSwgc3RhcnQ6IE1vbWVudCwgb2Zmc2V0OiBudW1iZXIpIHtcbiAgICBjb25zdCBob3VySW5kZXggPSBtb21lbnQoZC5kYXRlKS5ob3VycygpO1xuICAgIGNvbnN0IGNvbEluZGV4ID0gTWF0aC50cnVuYyhob3VySW5kZXggLyAzKTtcbiAgICByZXR1cm4gY29sSW5kZXggKiAodGhpcy5pdGVtU2l6ZSArIHRoaXMuZ3V0dGVyKSArIG9mZnNldDtcbiAgfVxuXG4gIHByaXZhdGUgY2FsY0l0ZW1ZKGQ6IERhdHVtKSB7XG4gICAgcmV0dXJuIHRoaXMubGFiZWxQYWRkaW5nICsgZC5kYXRlLndlZWtkYXkoKSAqICh0aGlzLml0ZW1TaXplICsgdGhpcy5ndXR0ZXIpO1xuICB9XG5cbiAgcHJpdmF0ZSBjYWxjSXRlbVNpemUoZDogRGF0dW0gfCBTdW1tYXJ5LCBtOiBudW1iZXIpIHtcbiAgICBpZiAobSA8PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcy5pdGVtU2l6ZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuaXRlbVNpemUgKiAwLjc1ICsgKHRoaXMuaXRlbVNpemUgKiBkLnRvdGFsIC8gbSkgKiAwLjI1O1xuICB9XG5cbiAgcHJpdmF0ZSBkcmF3QnV0dG9uKCkge1xuICAgIHRoaXMuYnV0dG9ucy5zZWxlY3RBbGwoJy5idXR0b24nKS5yZW1vdmUoKTtcbiAgICBjb25zdCBidXR0b24gPSB0aGlzLmJ1dHRvbnMuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdidXR0b24gYnV0dG9uLWJhY2snKVxuICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgIC5vbignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmluVHJhbnNpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBTZXQgdHJhbnNpdGlvbiBib29sZWFuXG4gICAgICAgIHRoaXMuaW5UcmFuc2l0aW9uID0gdHJ1ZTtcbiAgICAgICAgLy8gQ2xlYW4gdGhlIGNhbnZhcyBmcm9tIHdoaWNoZXZlciBvdmVydmlldyB0eXBlIHdhcyBvblxuICAgICAgICBpZiAodGhpcy5vdmVydmlldyA9PT0gJ3llYXInKSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVZZWFyT3ZlcnZpZXcoKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm92ZXJ2aWV3ID09PSAnbW9udGgnKSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVNb250aE92ZXJ2aWV3KCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5vdmVydmlldyA9PT0gJ3dlZWsnKSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVXZWVrT3ZlcnZpZXcoKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm92ZXJ2aWV3ID09PSAnZGF5Jykge1xuICAgICAgICAgIHRoaXMucmVtb3ZlRGF5T3ZlcnZpZXcoKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBSZWRyYXcgdGhlIGNoYXJ0XG4gICAgICAgIHRoaXMuaGlzdG9yeS5wb3AoKTtcbiAgICAgICAgdGhpcy5vdmVydmlldyA9IHRoaXMuaGlzdG9yeS5wb3AoKTtcbiAgICAgICAgdGhpcy5kcmF3Q2hhcnQoKTtcbiAgICAgIH0pO1xuICAgIGJ1dHRvbi5hcHBlbmQoJ2NpcmNsZScpXG4gICAgICAuYXR0cignY3gnLCB0aGlzLmxhYmVsUGFkZGluZyAvIDIuMjUpXG4gICAgICAuYXR0cignY3knLCB0aGlzLmxhYmVsUGFkZGluZyAvIDIuNSlcbiAgICAgIC5hdHRyKCdyJywgdGhpcy5pdGVtU2l6ZSAvIDIpO1xuICAgIGJ1dHRvbi5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIoJ3gnLCB0aGlzLmxhYmVsUGFkZGluZyAvIDIuMjUpXG4gICAgICAuYXR0cigneScsIHRoaXMubGFiZWxQYWRkaW5nIC8gMi41KVxuICAgICAgLmF0dHIoJ2R5JywgKCkgPT4ge1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcih0aGlzLmdXaWR0aCAvIDEwMCkgLyAzO1xuICAgICAgfSlcbiAgICAgIC5hdHRyKCdmb250LXNpemUnLCAoKSA9PiB7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKHRoaXMubGFiZWxQYWRkaW5nIC8gMykgKyAncHgnO1xuICAgICAgfSlcbiAgICAgIC5odG1sKCcmI3gyMTkwOycpO1xuICAgIGJ1dHRvbi50cmFuc2l0aW9uKClcbiAgICAgIC5kdXJhdGlvbih0aGlzLnRyYW5zaXRpb25EdXJhdGlvbilcbiAgICAgIC5lYXNlKGVhc2VMaW5lYXIpXG4gICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVtb3ZlR2xvYmFsT3ZlcnZpZXcoKSB7XG4gICAgdGhpcy5pdGVtcy5zZWxlY3RBbGwoJy5pdGVtLWJsb2NrLXllYXInKVxuICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgLmR1cmF0aW9uKHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uKVxuICAgICAgLmVhc2UoZWFzZUxpbmVhcilcbiAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAucmVtb3ZlKCk7XG4gICAgdGhpcy5sYWJlbHMuc2VsZWN0QWxsKCcubGFiZWwteWVhcicpLnJlbW92ZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSByZW1vdmVZZWFyT3ZlcnZpZXcoKSB7XG4gICAgdGhpcy5pdGVtcy5zZWxlY3RBbGwoJy5pdGVtLWNpcmNsZScpXG4gICAgICAudHJhbnNpdGlvbigpXG4gICAgICAuZHVyYXRpb24odGhpcy50cmFuc2l0aW9uRHVyYXRpb24pXG4gICAgICAuZWFzZShlYXNlTGluZWFyKVxuICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgIC5yZW1vdmUoKTtcbiAgICB0aGlzLmxhYmVscy5zZWxlY3RBbGwoJy5sYWJlbC1kYXknKS5yZW1vdmUoKTtcbiAgICB0aGlzLmxhYmVscy5zZWxlY3RBbGwoJy5sYWJlbC1tb250aCcpLnJlbW92ZSgpO1xuICAgIHRoaXMuaGlkZUJhY2tCdXR0b24oKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVtb3ZlTW9udGhPdmVydmlldygpIHtcbiAgICB0aGlzLml0ZW1zLnNlbGVjdEFsbCgnLml0ZW0tYmxvY2stbW9udGgnKVxuICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgLmR1cmF0aW9uKHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uKVxuICAgICAgLmVhc2UoZWFzZUxpbmVhcilcbiAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAucmVtb3ZlKCk7XG4gICAgdGhpcy5sYWJlbHMuc2VsZWN0QWxsKCcubGFiZWwtZGF5JykucmVtb3ZlKCk7XG4gICAgdGhpcy5sYWJlbHMuc2VsZWN0QWxsKCcubGFiZWwtd2VlaycpLnJlbW92ZSgpO1xuICAgIHRoaXMuaGlkZUJhY2tCdXR0b24oKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVtb3ZlV2Vla092ZXJ2aWV3KCkge1xuICAgIHRoaXMuaXRlbXMuc2VsZWN0QWxsKCcuaXRlbS1ibG9jay13ZWVrJylcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgIC5kdXJhdGlvbih0aGlzLnRyYW5zaXRpb25EdXJhdGlvbilcbiAgICAgIC5lYXNlKGVhc2VMaW5lYXIpXG4gICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgLmF0dHIoJ3gnLCAoZDogYW55LCBpOiBudW1iZXIpID0+IChpICUgMiA9PT0gMCkgPyAtdGhpcy5nV2lkdGggLyAzIDogdGhpcy5nV2lkdGggLyAzKVxuICAgICAgLnJlbW92ZSgpO1xuICAgIHRoaXMubGFiZWxzLnNlbGVjdEFsbCgnLmxhYmVsLWRheScpLnJlbW92ZSgpO1xuICAgIHRoaXMubGFiZWxzLnNlbGVjdEFsbCgnLmxhYmVsLXdlZWsnKS5yZW1vdmUoKTtcbiAgICB0aGlzLmhpZGVCYWNrQnV0dG9uKCk7XG4gIH1cblxuICBwcml2YXRlIHJlbW92ZURheU92ZXJ2aWV3KCkge1xuICAgIHRoaXMuaXRlbXMuc2VsZWN0QWxsKCcuaXRlbS1ibG9jaycpXG4gICAgICAudHJhbnNpdGlvbigpXG4gICAgICAuZHVyYXRpb24odGhpcy50cmFuc2l0aW9uRHVyYXRpb24pXG4gICAgICAuZWFzZShlYXNlTGluZWFyKVxuICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgIC5hdHRyKCd4JywgKGQ6IGFueSwgaTogbnVtYmVyKSA9PiAoaSAlIDIgPT09IDApID8gLXRoaXMuZ1dpZHRoIC8gMyA6IHRoaXMuZ1dpZHRoIC8gMylcbiAgICAgIC5yZW1vdmUoKTtcbiAgICB0aGlzLmxhYmVscy5zZWxlY3RBbGwoJy5sYWJlbC10aW1lJykucmVtb3ZlKCk7XG4gICAgdGhpcy5sYWJlbHMuc2VsZWN0QWxsKCcubGFiZWwtcHJvamVjdCcpLnJlbW92ZSgpO1xuICAgIHRoaXMuaGlkZUJhY2tCdXR0b24oKTtcbiAgfVxuXG4gIHByaXZhdGUgaGlkZVRvb2x0aXAoKSB7XG4gICAgdGhpcy50b29sdGlwLnRyYW5zaXRpb24oKVxuICAgICAgLmR1cmF0aW9uKHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uIC8gMilcbiAgICAgIC5lYXNlKGVhc2VMaW5lYXIpXG4gICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIZWxwZXIgZnVuY3Rpb24gdG8gaGlkZSB0aGUgYmFjayBidXR0b25cbiAgICovXG4gIHByaXZhdGUgaGlkZUJhY2tCdXR0b24oKSB7XG4gICAgdGhpcy5idXR0b25zLnNlbGVjdEFsbCgnLmJ1dHRvbicpXG4gICAgICAudHJhbnNpdGlvbigpXG4gICAgICAuZHVyYXRpb24odGhpcy50cmFuc2l0aW9uRHVyYXRpb24pXG4gICAgICAuZWFzZShlYXNlTGluZWFyKVxuICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgIC5yZW1vdmUoKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0VG9vbHRpcCA9IChkOiBhbnkpID0+IHtcbiAgICBsZXQgdG9vbHRpcEh0bWwgPSAnPGRpdiBjbGFzcz1cImhlYWRlclwiPjxzdHJvbmc+JyArIGQuZGF0ZS5mb3JtYXQoJ2RkZGQsIE1NTSBEbyBZWVlZIEhIOm1tJykgKyAnPC9zdHJvbmc+PC9kaXY+PHVsPic7XG4gICAgKGQuc3VtbWFyeSB8fCBbXSkuZm9yRWFjaChzID0+IHtcbiAgICAgIHRvb2x0aXBIdG1sICs9IGA8bGk+XG4gIDxkaXYgY2xhc3M9XCJyb3VuZFwiIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjoke0NvbG9yTGliLnRyYW5zcGFyZW50aXplKHMuY29sb3IpfTsgYm9yZGVyLWNvbG9yOiR7cy5jb2xvcn1cIj48L2Rpdj5cbiR7R1RTTGliLmZvcm1hdExhYmVsKHMubmFtZSl9OiAke3MudG90YWx9PC9saT5gO1xuICAgIH0pO1xuICAgIGlmIChkLnRvdGFsICE9PSB1bmRlZmluZWQgJiYgZC5uYW1lKSB7XG4gICAgICB0b29sdGlwSHRtbCArPSBgPGxpPjxkaXYgY2xhc3M9XCJyb3VuZFwiXG5zdHlsZT1cImJhY2tncm91bmQtY29sb3I6ICR7Q29sb3JMaWIudHJhbnNwYXJlbnRpemUoZC5jb2xvcil9OyBib3JkZXItY29sb3I6ICR7ZC5jb2xvcn1cIlxuPjwvZGl2PiAke0dUU0xpYi5mb3JtYXRMYWJlbChkLm5hbWUpfTogJHtkLnRvdGFsfTwvbGk+YDtcbiAgICB9XG4gICAgdG9vbHRpcEh0bWwgKz0gJzwvdWw+JztcbiAgICByZXR1cm4gdG9vbHRpcEh0bWw7XG4gIH1cbn1cbiJdfQ==