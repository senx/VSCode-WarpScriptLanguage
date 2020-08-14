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
export class CalendarHeatmapComponent {
    /**
     * @param {?} el
     */
    constructor(el) {
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
        (d) => {
            /** @type {?} */
            let tooltipHtml = '<div class="header"><strong>' + d.date.format('dddd, MMM Do YYYY HH:mm') + '</strong></div><ul>';
            (d.summary || []).forEach((/**
             * @param {?} s
             * @return {?}
             */
            s => {
                tooltipHtml += `<li>
  <div class="round" style="background-color:${ColorLib.transparentize(s.color)}; border-color:${s.color}"></div>
${GTSLib.formatLabel(s.name)}: ${s.total}</li>`;
            }));
            if (d.total !== undefined && d.name) {
                tooltipHtml += `<li><div class="round"
style="background-color: ${ColorLib.transparentize(d.color)}; border-color: ${d.color}"
></div> ${GTSLib.formatLabel(d.name)}: ${d.total}</li>`;
            }
            tooltipHtml += '</ul>';
            return tooltipHtml;
        });
        this.LOG = new Logger(CalendarHeatmapComponent, this.debug);
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
     * @param {?} data
     * @return {?}
     */
    set data(data) {
        this.LOG.debug(['data'], data);
        if (data) {
            this._data = data;
            this.calculateDimensions();
        }
    }
    /**
     * @return {?}
     */
    get data() {
        return this._data;
    }
    /**
     * @param {?} minColor
     * @return {?}
     */
    set minColor(minColor) {
        this._minColor = minColor;
        this.calculateDimensions();
    }
    /**
     * @return {?}
     */
    get minColor() {
        return this._minColor;
    }
    /**
     * @param {?} maxColor
     * @return {?}
     */
    set maxColor(maxColor) {
        this._maxColor = maxColor;
        this.calculateDimensions();
    }
    /**
     * @return {?}
     */
    get maxColor() {
        return this._maxColor;
    }
    /**
     * @return {?}
     */
    static getNumberOfWeeks() {
        /** @type {?} */
        const dayIndex = Math.round((+moment.utc() - +moment.utc().subtract(1, 'year').startOf('week')) / 86400000);
        return Math.trunc(dayIndex / 7) + 1;
    }
    /**
     * @return {?}
     */
    onResize() {
        if (this.el.nativeElement.parentElement.clientWidth !== this.parentWidth) {
            this.calculateDimensions();
        }
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
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
    }
    /**
     * @return {?}
     */
    calculateDimensions() {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout((/**
         * @return {?}
         */
        () => {
            if (this.el.nativeElement.parentElement.clientWidth !== 0) {
                this.gWidth = this.chart.clientWidth < 1000 ? 1000 : this.chart.clientWidth;
                this.itemSize = ((this.gWidth - this.labelPadding) / CalendarHeatmapComponent.getNumberOfWeeks() - this.gutter);
                this.gHeight = this.labelPadding + 7 * (this.itemSize + this.gutter);
                this.svg.attr('width', this.gWidth).attr('height', this.gHeight);
                this.LOG.debug(['calculateDimensions'], this._data);
                if (!!this._data && !!this._data[0] && !!this._data[0].summary) {
                    this.drawChart();
                }
            }
            else {
                this.calculateDimensions();
            }
        }), 250);
    }
    /**
     * @private
     * @param {?} xs
     * @param {?} key
     * @return {?}
     */
    groupBy(xs, key) {
        return xs.reduce((/**
         * @param {?} rv
         * @param {?} x
         * @return {?}
         */
        (rv, x) => {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }), {});
    }
    /**
     * @return {?}
     */
    updateDataSummary() {
        // Get daily summary if that was not provided
        if (!this._data[0].summary) {
            this._data.map((/**
             * @param {?} d
             * @return {?}
             */
            (d) => {
                /** @type {?} */
                const summary = d.details.reduce((/**
                 * @param {?} uniques
                 * @param {?} project
                 * @return {?}
                 */
                (uniques, project) => {
                    if (!uniques[project.name]) {
                        uniques[project.name] = { value: project.value };
                    }
                    else {
                        uniques[project.name].value += project.value;
                    }
                    return uniques;
                }), {});
                /** @type {?} */
                const unsortedSummary = Object.keys(summary).map((/**
                 * @param {?} key
                 * @return {?}
                 */
                (key) => {
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
                (a, b) => {
                    return b.total - a.total;
                }));
                return d;
            }));
        }
    }
    /**
     * @return {?}
     */
    drawChart() {
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
    }
    /**
     * @return {?}
     */
    drawGlobalOverview() {
        // Add current overview to the history
        if (this.history[this.history.length - 1] !== this.overview) {
            this.history.push(this.overview);
        }
        // Define start and end of the dataset
        /** @type {?} */
        const startPeriod = moment.utc(this._data[0].date.startOf('y'));
        /** @type {?} */
        const endPeriod = moment.utc(this._data[this._data.length - 1].date.endOf('y'));
        // Define array of years and total values
        /** @type {?} */
        const yData = this._data.filter((/**
         * @param {?} d
         * @return {?}
         */
        (d) => d.date.isBetween(startPeriod, endPeriod, null, '[]')));
        yData.forEach((/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            /** @type {?} */
            const summary = [];
            /** @type {?} */
            const group = this.groupBy(d.details, 'name');
            Object.keys(group).forEach((/**
             * @param {?} k
             * @return {?}
             */
            k => {
                summary.push({
                    name: k,
                    total: group[k].reduce((/**
                     * @param {?} acc
                     * @param {?} o
                     * @return {?}
                     */
                    (acc, o) => {
                        return acc + o.value;
                    }), 0),
                    color: group[k][0].color,
                    id: group[k][0].id,
                });
            }));
            d.summary = summary;
        }));
        /** @type {?} */
        const duration = Math.ceil(moment.duration(endPeriod.diff(startPeriod)).asYears());
        /** @type {?} */
        const scale = [];
        for (let i = 0; i < duration; i++) {
            /** @type {?} */
            const d = moment.utc().year(startPeriod.year() + i).month(0).date(1).startOf('y');
            scale.push(d);
        }
        /** @type {?} */
        let yearData = yData.map((/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            /** @type {?} */
            const date = d.date;
            return {
                date,
                total: yData.reduce((/**
                 * @param {?} prev
                 * @param {?} current
                 * @return {?}
                 */
                (prev, current) => {
                    if (((/** @type {?} */ (current.date))).year() === date.year()) {
                        prev += current.total;
                    }
                    return prev;
                }), 0),
                summary: ((/**
                 * @return {?}
                 */
                () => {
                    /** @type {?} */
                    const summary = yData.reduce((/**
                     * @param {?} s
                     * @param {?} data
                     * @return {?}
                     */
                    (s, data) => {
                        if (((/** @type {?} */ (data.date))).year() === date.year()) {
                            data.summary.forEach((/**
                             * @param {?} _summary
                             * @return {?}
                             */
                            _summary => {
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
                    const unsortedSummary = Object.keys(summary).map((/**
                     * @param {?} key
                     * @return {?}
                     */
                    (key) => {
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
                    (a, b) => b.total - a.total));
                }))(),
            };
        }));
        // Calculate max value of all the years in the dataset
        yearData = GTSLib.cleanArray(yearData);
        /** @type {?} */
        const maxValue = max(yearData, (/**
         * @param {?} d
         * @return {?}
         */
        (d) => d.total));
        // Define year labels and axis
        /** @type {?} */
        const yearLabels = scale.map((/**
         * @param {?} d
         * @return {?}
         */
        (d) => d));
        /** @type {?} */
        const yearScale = scaleBand()
            .rangeRound([0, this.gWidth])
            .padding(0.05)
            .domain(yearLabels.map((/**
         * @param {?} d
         * @return {?}
         */
        (d) => d.year().toString())));
        /** @type {?} */
        const color = scaleLinear()
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
        () => (this.gWidth - this.labelPadding) / yearLabels.length - this.gutter * 5))
            .attr('height', (/**
         * @return {?}
         */
        () => this.gHeight - this.labelPadding))
            .attr('transform', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => 'translate(' + yearScale(((/** @type {?} */ (d.date))).year().toString()) + ',' + this.tooltipPadding * 2 + ')'))
            .attr('fill', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => color(d.total) || CalendarHeatmapComponent.DEF_MAX_COLOR))
            .on('click', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            if (this.inTransition) {
                return;
            }
            // Set in_transition flag
            this.inTransition = true;
            // Set selected date to the one clicked on
            this.selected = d;
            // Hide tooltip
            this.hideTooltip();
            // Remove all global overview related items and labels
            this.removeGlobalOverview();
            // Redraw the chart
            this.overview = 'year';
            this.drawChart();
        }))
            .style('opacity', 0)
            .on('mouseover', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            if (this.inTransition) {
                return;
            }
            // Calculate tooltip position
            /** @type {?} */
            let x = yearScale(d.date.year().toString()) + this.tooltipPadding * 2;
            while (this.gWidth - x < (this.tooltipWidth + this.tooltipPadding * 5)) {
                x -= 10;
            }
            /** @type {?} */
            const y = this.tooltipPadding * 4;
            // Show tooltip
            this.tooltip.html(this.getTooltip(d))
                .style('left', x + 'px')
                .style('top', y + 'px')
                .transition()
                .duration(this.transitionDuration / 2)
                .ease(easeLinear)
                .style('opacity', 1);
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        () => {
            if (this.inTransition) {
                return;
            }
            this.hideTooltip();
        }))
            .transition()
            .delay((/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        (d, i) => this.transitionDuration * (i + 1) / 10))
            .duration((/**
         * @return {?}
         */
        () => this.transitionDuration))
            .ease(easeLinear)
            .style('opacity', 1)
            .call((/**
         * @param {?} transition
         * @param {?} callback
         * @return {?}
         */
        (transition, callback) => {
            if (transition.empty()) {
                callback();
            }
            /** @type {?} */
            let n = 0;
            transition.each((/**
             * @return {?}
             */
            () => ++n)).on('end', (/**
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
        () => this.inTransition = false));
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
        () => Math.floor(this.labelPadding / 3) + 'px'))
            .text((/**
         * @param {?} d
         * @return {?}
         */
        (d) => d.year()))
            .attr('x', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => yearScale(d.year().toString())))
            .attr('y', this.labelPadding / 2)
            .on('mouseenter', (/**
         * @param {?} yearLabel
         * @return {?}
         */
        (yearLabel) => {
            if (this.inTransition) {
                return;
            }
            this.items.selectAll('.item-block-year')
                .transition()
                .duration(this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', (/**
             * @param {?} d
             * @return {?}
             */
            (d) => (d.date.year() === yearLabel.year()) ? 1 : 0.1));
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        () => {
            if (this.inTransition) {
                return;
            }
            this.items.selectAll('.item-block-year')
                .transition()
                .duration(this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', 1);
        }))
            .on('click', (/**
         * @return {?}
         */
        () => {
            if (this.inTransition) {
                return;
            }
            // Set in_transition flag
            this.inTransition = true;
            // Set selected year to the one clicked on
            this.selected = yearData[0];
            // Hide tooltip
            this.hideTooltip();
            // Remove all global overview related items and labels
            this.removeGlobalOverview();
            // Redraw the chart
            this.overview = 'year';
            this.drawChart();
        }));
    }
    /**
     * Draw year overview
     * @return {?}
     */
    drawYearOverview() {
        // Add current overview to the history
        if (this.history[this.history.length - 1] !== this.overview) {
            this.history.push(this.overview);
        }
        // Define start and end date of the selected year
        /** @type {?} */
        const startOfYear = moment(this.selected.date).startOf('year');
        /** @type {?} */
        const endOfYear = moment(this.selected.date).endOf('year');
        // Filter data down to the selected year
        /** @type {?} */
        let yearData = this._data.filter((/**
         * @param {?} d
         * @return {?}
         */
        (d) => d.date.isBetween(startOfYear, endOfYear, null, '[]')));
        yearData.forEach((/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            /** @type {?} */
            const summary = [];
            /** @type {?} */
            const group = this.groupBy(d.details, 'name');
            Object.keys(group).forEach((/**
             * @param {?} k
             * @return {?}
             */
            k => {
                summary.push({
                    name: k,
                    total: group[k].reduce((/**
                     * @param {?} acc
                     * @param {?} o
                     * @return {?}
                     */
                    (acc, o) => {
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
        const maxValue = max(yearData, (/**
         * @param {?} d
         * @return {?}
         */
        (d) => d.total));
        /** @type {?} */
        const color = scaleLinear()
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
        (d) => this.calcItemX(d, startOfYear) + (this.itemSize - this.calcItemSize(d, maxValue)) / 2))
            .attr('y', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => this.calcItemY(d) + (this.itemSize - this.calcItemSize(d, maxValue)) / 2))
            .attr('rx', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => this.calcItemSize(d, maxValue)))
            .attr('ry', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => this.calcItemSize(d, maxValue)))
            .attr('width', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => this.calcItemSize(d, maxValue)))
            .attr('height', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => this.calcItemSize(d, maxValue)))
            .attr('fill', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => (d.total > 0) ? color(d.total) : 'transparent'))
            .on('click', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            if (this.inTransition) {
                return;
            }
            // Don't transition if there is no data to show
            if (d.total === 0) {
                return;
            }
            this.inTransition = true;
            // Set selected date to the one clicked on
            this.selected = d;
            // Hide tooltip
            this.hideTooltip();
            // Remove all year overview related items and labels
            this.removeYearOverview();
            // Redraw the chart
            this.overview = 'day';
            this.drawChart();
        }))
            .on('mouseover', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            if (this.inTransition) {
                return;
            }
            // Pulsating animation
            /** @type {?} */
            const circle = select(event.currentTarget);
            /** @type {?} */
            const repeat = (/**
             * @return {?}
             */
            () => {
                circle.transition()
                    .duration(this.transitionDuration)
                    .ease(easeLinear)
                    .attr('x', (/**
                 * @param {?} data
                 * @return {?}
                 */
                (data) => this.calcItemX(data, startOfYear) - (this.itemSize * 1.1 - this.itemSize) / 2))
                    .attr('y', (/**
                 * @param {?} data
                 * @return {?}
                 */
                (data) => this.calcItemY(data) - (this.itemSize * 1.1 - this.itemSize) / 2))
                    .attr('width', this.itemSize * 1.1)
                    .attr('height', this.itemSize * 1.1)
                    .transition()
                    .duration(this.transitionDuration)
                    .ease(easeLinear)
                    .attr('x', (/**
                 * @param {?} data
                 * @return {?}
                 */
                (data) => this.calcItemX(data, startOfYear) + (this.itemSize - this.calcItemSize(data, maxValue)) / 2))
                    .attr('y', (/**
                 * @param {?} data
                 * @return {?}
                 */
                (data) => this.calcItemY(data) + (this.itemSize - this.calcItemSize(data, maxValue)) / 2))
                    .attr('width', (/**
                 * @param {?} data
                 * @return {?}
                 */
                (data) => this.calcItemSize(data, maxValue)))
                    .attr('height', (/**
                 * @param {?} data
                 * @return {?}
                 */
                (data) => this.calcItemSize(data, maxValue)))
                    .on('end', repeat);
            });
            repeat();
            // Construct tooltip
            // Calculate tooltip position
            /** @type {?} */
            let x = this.calcItemX(d, startOfYear) + this.itemSize / 2;
            if (this.gWidth - x < (this.tooltipWidth + this.tooltipPadding * 3)) {
                x -= this.tooltipWidth + this.tooltipPadding * 2;
            }
            /** @type {?} */
            const y = this.calcItemY(d) + this.itemSize / 2;
            // Show tooltip
            this.tooltip.html(this.getTooltip(d))
                .style('left', x + 'px')
                .style('top', y + 'px')
                .transition()
                .duration(this.transitionDuration / 2)
                .ease(easeLinear)
                .style('opacity', 1);
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        () => {
            if (this.inTransition) {
                return;
            }
            // Set circle radius back to what it's supposed to be
            select(event.currentTarget).transition()
                .duration(this.transitionDuration / 2)
                .ease(easeLinear)
                .attr('x', (/**
             * @param {?} d
             * @return {?}
             */
            (d) => this.calcItemX(d, startOfYear) + (this.itemSize - this.calcItemSize(d, maxValue)) / 2))
                .attr('y', (/**
             * @param {?} d
             * @return {?}
             */
            (d) => this.calcItemY(d) + (this.itemSize - this.calcItemSize(d, maxValue)) / 2))
                .attr('width', (/**
             * @param {?} d
             * @return {?}
             */
            (d) => this.calcItemSize(d, maxValue)))
                .attr('height', (/**
             * @param {?} d
             * @return {?}
             */
            (d) => this.calcItemSize(d, maxValue)));
            // Hide tooltip
            this.hideTooltip();
        }))
            .transition()
            .delay((/**
         * @return {?}
         */
        () => (Math.cos(Math.PI * Math.random()) + 1) * this.transitionDuration))
            .duration((/**
         * @return {?}
         */
        () => this.transitionDuration))
            .ease(easeLinear)
            .style('opacity', 1)
            .call((/**
         * @param {?} transition
         * @param {?} callback
         * @return {?}
         */
        (transition, callback) => {
            if (transition.empty()) {
                callback();
            }
            /** @type {?} */
            let n = 0;
            transition.each((/**
             * @return {?}
             */
            () => ++n)).on('end', (/**
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
        () => this.inTransition = false));
        // Add month labels
        /** @type {?} */
        const duration = Math.ceil(moment.duration(endOfYear.diff(startOfYear)).asMonths());
        /** @type {?} */
        const monthLabels = [];
        for (let i = 1; i < duration; i++) {
            monthLabels.push(moment(this.selected.date).month((startOfYear.month() + i) % 12).startOf('month'));
        }
        /** @type {?} */
        const monthScale = scaleLinear().range([0, this.gWidth]).domain([0, monthLabels.length]);
        this.labels.selectAll('.label-month').remove();
        this.labels.selectAll('.label-month')
            .data(monthLabels)
            .enter()
            .append('text')
            .attr('class', 'label label-month')
            .attr('font-size', (/**
         * @return {?}
         */
        () => Math.floor(this.labelPadding / 3) + 'px'))
            .text((/**
         * @param {?} d
         * @return {?}
         */
        (d) => d.format('MMM')))
            .attr('x', (/**
         * @param {?} d
         * @param {?} i
         * @return {?}
         */
        (d, i) => monthScale(i) + (monthScale(i) - monthScale(i - 1)) / 2))
            .attr('y', this.labelPadding / 2)
            .on('mouseenter', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            if (this.inTransition) {
                return;
            }
            /** @type {?} */
            const selectedMonth = moment(d);
            this.items.selectAll('.item-circle')
                .transition()
                .duration(this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', (/**
             * @param {?} data
             * @return {?}
             */
            (data) => moment(data.date).isSame(selectedMonth, 'month') ? 1 : 0.1));
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        () => {
            if (this.inTransition) {
                return;
            }
            this.items.selectAll('.item-circle')
                .transition()
                .duration(this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', 1);
        }))
            .on('click', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            if (this.inTransition) {
                return;
            }
            // Check month data
            /** @type {?} */
            const monthData = this._data.filter((/**
             * @param {?} e
             * @return {?}
             */
            (e) => e.date.isBetween(moment(d).startOf('month'), moment(d).endOf('month'), null, '[]')));
            // Don't transition if there is no data to show
            if (!monthData.length) {
                return;
            }
            // Set selected month to the one clicked on
            this.selected = { date: d };
            this.inTransition = true;
            // Hide tooltip
            this.hideTooltip();
            // Remove all year overview related items and labels
            this.removeYearOverview();
            // Redraw the chart
            this.overview = 'month';
            this.drawChart();
        }));
        // Add day labels
        /** @type {?} */
        const dayLabels = timeDays(moment.utc().startOf('week').toDate(), moment.utc().endOf('week').toDate());
        /** @type {?} */
        const dayScale = scaleBand()
            .rangeRound([this.labelPadding, this.gHeight])
            .domain(dayLabels.map((/**
         * @param {?} d
         * @return {?}
         */
        (d) => moment.utc(d).weekday().toString())));
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
        (d, i) => dayScale(i.toString()) + dayScale.bandwidth() / 1.75))
            .style('text-anchor', 'left')
            .attr('font-size', (/**
         * @return {?}
         */
        () => Math.floor(this.labelPadding / 3) + 'px'))
            .text((/**
         * @param {?} d
         * @return {?}
         */
        (d) => moment.utc(d).format('dddd')[0]))
            .on('mouseenter', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            if (this.inTransition) {
                return;
            }
            /** @type {?} */
            const selectedDay = moment.utc(d);
            this.items.selectAll('.item-circle')
                .transition()
                .duration(this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', (/**
             * @param {?} data
             * @return {?}
             */
            (data) => (moment(data.date).day() === selectedDay.day()) ? 1 : 0.1));
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        () => {
            if (this.inTransition) {
                return;
            }
            this.items.selectAll('.item-circle')
                .transition()
                .duration(this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', 1);
        }));
        // Add button to switch back to previous overview
        this.drawButton();
    }
    /**
     * @return {?}
     */
    drawMonthOverview() {
        // Add current overview to the history
        if (this.history[this.history.length - 1] !== this.overview) {
            this.history.push(this.overview);
        }
        // Define beginning and end of the month
        /** @type {?} */
        const startOfMonth = moment(this.selected.date).startOf('month');
        /** @type {?} */
        const endOfMonth = moment(this.selected.date).endOf('month');
        // Filter data down to the selected month
        /** @type {?} */
        let monthData = [];
        this._data.filter((/**
         * @param {?} data
         * @return {?}
         */
        (data) => data.date.isBetween(startOfMonth, endOfMonth, null, '[]')))
            .map((/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            /** @type {?} */
            const scale = [];
            d.details.forEach((/**
             * @param {?} det
             * @return {?}
             */
            (det) => {
                /** @type {?} */
                const date = moment.utc(det.date);
                /** @type {?} */
                const i = Math.floor(date.hours() / 3);
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
            (s) => {
                /** @type {?} */
                const group = this.groupBy(s.details, 'name');
                Object.keys(group).forEach((/**
                 * @param {?} k
                 * @return {?}
                 */
                (k) => {
                    s.summary.push({
                        name: k,
                        total: sum(group[k], (/**
                         * @param {?} data
                         * @return {?}
                         */
                        (data) => data.total)),
                        color: group[k][0].color
                    });
                }));
            }));
            monthData = monthData.concat(scale);
        }));
        monthData = GTSLib.cleanArray(monthData);
        this.LOG.debug(['drawMonthOverview'], [this.overview, this.selected, monthData]);
        /** @type {?} */
        const maxValue = max(monthData, (/**
         * @param {?} d
         * @return {?}
         */
        (d) => d.total));
        // Define day labels and axis
        /** @type {?} */
        const dayLabels = timeDays(moment(this.selected.date).startOf('week').toDate(), moment(this.selected.date).endOf('week').toDate());
        /** @type {?} */
        const dayScale = scaleBand()
            .rangeRound([this.labelPadding, this.gHeight])
            .domain(dayLabels.map((/**
         * @param {?} d
         * @return {?}
         */
        (d) => moment.utc(d).weekday().toString())));
        // Define week labels and axis
        /** @type {?} */
        const weekLabels = [startOfMonth];
        /** @type {?} */
        const incWeek = moment(startOfMonth);
        while (incWeek.week() !== endOfMonth.week()) {
            weekLabels.push(moment(incWeek.add(1, 'week')));
        }
        monthData.forEach((/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            /** @type {?} */
            const summary = [];
            /** @type {?} */
            const group = this.groupBy(d.details, 'name');
            Object.keys(group).forEach((/**
             * @param {?} k
             * @return {?}
             */
            (k) => {
                summary.push({
                    name: k,
                    total: group[k].reduce((/**
                     * @param {?} acc
                     * @param {?} o
                     * @return {?}
                     */
                    (acc, o) => acc + o.value), 0),
                    color: group[k][0].color,
                    id: group[k][0].id,
                });
            }));
            d.summary = summary;
        }));
        /** @type {?} */
        const weekScale = scaleBand()
            .rangeRound([this.labelPadding, this.gWidth])
            .padding(0.05)
            .domain(weekLabels.map((/**
         * @param {?} weekday
         * @return {?}
         */
        (weekday) => weekday.week() + '')));
        /** @type {?} */
        const color = scaleLinear()
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
        (d) => this.calcItemY(d)
            + (this.itemSize - this.calcItemSize(d, maxValue)) / 2))
            .attr('x', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => this.calcItemXMonth(d, startOfMonth, weekScale(d.date.week().toString()))
            + (this.itemSize - this.calcItemSize(d, maxValue)) / 2))
            .attr('rx', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => this.calcItemSize(d, maxValue)))
            .attr('ry', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => this.calcItemSize(d, maxValue)))
            .attr('width', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => this.calcItemSize(d, maxValue)))
            .attr('height', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => this.calcItemSize(d, maxValue)))
            .attr('fill', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => (d.total > 0) ? color(d.total) : 'transparent'))
            .on('click', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            if (this.inTransition) {
                return;
            }
            // Don't transition if there is no data to show
            if (d.total === 0) {
                return;
            }
            this.inTransition = true;
            // Set selected date to the one clicked on
            this.selected = d;
            // Hide tooltip
            this.hideTooltip();
            // Remove all month overview related items and labels
            this.removeMonthOverview();
            // Redraw the chart
            this.overview = 'day';
            this.drawChart();
        }))
            .on('mouseover', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            if (this.inTransition) {
                return;
            }
            // Construct tooltip
            // Calculate tooltip position
            /** @type {?} */
            let x = weekScale(d.date.week().toString()) + this.tooltipPadding;
            while (this.gWidth - x < (this.tooltipWidth + this.tooltipPadding * 3)) {
                x -= 10;
            }
            /** @type {?} */
            const y = dayScale(d.date.weekday().toString()) + this.tooltipPadding;
            // Show tooltip
            this.tooltip.html(this.getTooltip(d))
                .style('left', x + 'px')
                .style('top', y + 'px')
                .transition()
                .duration(this.transitionDuration / 2)
                .ease(easeLinear)
                .style('opacity', 1);
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        () => {
            if (this.inTransition) {
                return;
            }
            this.hideTooltip();
        }))
            .transition()
            .delay((/**
         * @return {?}
         */
        () => (Math.cos(Math.PI * Math.random()) + 1) * this.transitionDuration))
            .duration((/**
         * @return {?}
         */
        () => this.transitionDuration))
            .ease(easeLinear)
            .style('opacity', 1)
            .call((/**
         * @param {?} transition
         * @param {?} callback
         * @return {?}
         */
        (transition, callback) => {
            if (transition.empty()) {
                callback();
            }
            /** @type {?} */
            let n = 0;
            transition.each((/**
             * @return {?}
             */
            () => ++n)).on('end', (/**
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
        () => this.inTransition = false));
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
        () => Math.floor(this.labelPadding / 3) + 'px'))
            .text((/**
         * @param {?} d
         * @return {?}
         */
        (d) => 'Week ' + d.week()))
            .attr('x', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => weekScale(d.week().toString())))
            .attr('y', this.labelPadding / 2)
            .on('mouseenter', (/**
         * @param {?} weekday
         * @return {?}
         */
        (weekday) => {
            if (this.inTransition) {
                return;
            }
            this.items.selectAll('.item-block-month')
                .transition()
                .duration(this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', (/**
             * @param {?} d
             * @return {?}
             */
            (d) => {
                return (moment(d.date).week() === weekday.week()) ? 1 : 0.1;
            }));
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        () => {
            if (this.inTransition) {
                return;
            }
            this.items.selectAll('.item-block-month')
                .transition()
                .duration(this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', 1);
        }))
            .on('click', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            if (this.inTransition) {
                return;
            }
            this.inTransition = true;
            // Set selected month to the one clicked on
            this.selected = { date: d };
            // Hide tooltip
            this.hideTooltip();
            // Remove all year overview related items and labels
            this.removeMonthOverview();
            // Redraw the chart
            this.overview = 'week';
            this.drawChart();
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
        (d, i) => dayScale(i) + dayScale.bandwidth() / 1.75))
            .style('text-anchor', 'left')
            .attr('font-size', (/**
         * @return {?}
         */
        () => Math.floor(this.labelPadding / 3) + 'px'))
            .text((/**
         * @param {?} d
         * @return {?}
         */
        (d) => moment.utc(d).format('dddd')[0]))
            .on('mouseenter', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            if (this.inTransition) {
                return;
            }
            /** @type {?} */
            const selectedDay = moment.utc(d);
            this.items.selectAll('.item-block-month')
                .transition()
                .duration(this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', (/**
             * @param {?} data
             * @return {?}
             */
            (data) => (moment(data.date).day() === selectedDay.day()) ? 1 : 0.1));
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        () => {
            if (this.inTransition) {
                return;
            }
            this.items.selectAll('.item-block-month')
                .transition()
                .duration(this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', 1);
        }));
        // Add button to switch back to previous overview
        this.drawButton();
    }
    /**
     * @return {?}
     */
    drawWeekOverview() {
        // Add current overview to the history
        if (this.history[this.history.length - 1] !== this.overview) {
            this.history.push(this.overview);
        }
        // Define beginning and end of the week
        /** @type {?} */
        const startOfWeek = moment(this.selected.date).startOf('week');
        /** @type {?} */
        const endOfWeek = moment(this.selected.date).endOf('week');
        // Filter data down to the selected week
        /** @type {?} */
        let weekData = [];
        this._data.filter((/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            return d.date.isBetween(startOfWeek, endOfWeek, null, '[]');
        })).map((/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            /** @type {?} */
            const scale = [];
            d.details.forEach((/**
             * @param {?} det
             * @return {?}
             */
            (det) => {
                /** @type {?} */
                const date = moment(det.date);
                /** @type {?} */
                const i = date.hours();
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
            s => {
                /** @type {?} */
                const group = this.groupBy(s.details, 'name');
                Object.keys(group).forEach((/**
                 * @param {?} k
                 * @return {?}
                 */
                k => s.summary.push({
                    name: k,
                    total: sum(group[k], (/**
                     * @param {?} data
                     * @return {?}
                     */
                    (data) => data.value)),
                    color: group[k][0].color
                })));
            }));
            weekData = weekData.concat(scale);
        }));
        weekData = GTSLib.cleanArray(weekData);
        /** @type {?} */
        const maxValue = max(weekData, (/**
         * @param {?} d
         * @return {?}
         */
        (d) => d.total));
        // Define day labels and axis
        /** @type {?} */
        const dayLabels = timeDays(moment.utc().startOf('week').toDate(), moment.utc().endOf('week').toDate());
        /** @type {?} */
        const dayScale = scaleBand()
            .rangeRound([this.labelPadding, this.gHeight])
            .domain(dayLabels.map((/**
         * @param {?} d
         * @return {?}
         */
        (d) => moment.utc(d).weekday().toString())));
        // Define hours labels and axis
        /** @type {?} */
        const hoursLabels = [];
        range(0, 24).forEach((/**
         * @param {?} h
         * @return {?}
         */
        h => hoursLabels.push(moment.utc().hours(h).startOf('hour').format('HH:mm'))));
        /** @type {?} */
        const hourScale = scaleBand().rangeRound([this.labelPadding, this.gWidth]).padding(0.01).domain(hoursLabels);
        /** @type {?} */
        const color = scaleLinear()
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
        (d) => this.calcItemY(d)
            + (this.itemSize - this.calcItemSize(d, maxValue)) / 2))
            .attr('x', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => this.gutter
            + hourScale(moment(d.date).startOf('hour').format('HH:mm'))
            + (this.itemSize - this.calcItemSize(d, maxValue)) / 2))
            .attr('rx', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => this.calcItemSize(d, maxValue)))
            .attr('ry', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => this.calcItemSize(d, maxValue)))
            .attr('width', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => this.calcItemSize(d, maxValue)))
            .attr('height', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => this.calcItemSize(d, maxValue)))
            .attr('fill', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => (d.total > 0) ? color(d.total) : 'transparent'))
            .on('click', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            if (this.inTransition) {
                return;
            }
            // Don't transition if there is no data to show
            if (d.total === 0) {
                return;
            }
            this.inTransition = true;
            // Set selected date to the one clicked on
            this.selected = d;
            // Hide tooltip
            this.hideTooltip();
            // Remove all week overview related items and labels
            this.removeWeekOverview();
            // Redraw the chart
            this.overview = 'day';
            this.drawChart();
        })).on('mouseover', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            if (this.inTransition) {
                return;
            }
            // Calculate tooltip position
            /** @type {?} */
            let x = hourScale(moment(d.date).startOf('hour').format('HH:mm')) + this.tooltipPadding;
            while (this.gWidth - x < (this.tooltipWidth + this.tooltipPadding * 3)) {
                x -= 10;
            }
            /** @type {?} */
            const y = dayScale(d.date.weekday().toString()) + this.tooltipPadding;
            // Show tooltip
            this.tooltip.html(this.getTooltip(d))
                .style('left', x + 'px')
                .style('top', y + 'px')
                .transition()
                .duration(this.transitionDuration / 2)
                .ease(easeLinear)
                .style('opacity', 1);
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        () => {
            if (this.inTransition) {
                return;
            }
            this.hideTooltip();
        }))
            .transition()
            .delay((/**
         * @return {?}
         */
        () => (Math.cos(Math.PI * Math.random()) + 1) * this.transitionDuration))
            .duration((/**
         * @return {?}
         */
        () => this.transitionDuration))
            .ease(easeLinear)
            .style('opacity', 1)
            .call((/**
         * @param {?} transition
         * @param {?} callback
         * @return {?}
         */
        (transition, callback) => {
            if (transition.empty()) {
                callback();
            }
            /** @type {?} */
            let n = 0;
            transition.each((/**
             * @return {?}
             */
            () => ++n)).on('end', (/**
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
        () => this.inTransition = false));
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
        () => Math.floor(this.labelPadding / 3) + 'px'))
            .text((/**
         * @param {?} d
         * @return {?}
         */
        (d) => d))
            .attr('x', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => hourScale(d)))
            .attr('y', this.labelPadding / 2)
            .on('mouseenter', (/**
         * @param {?} hour
         * @return {?}
         */
        (hour) => {
            if (this.inTransition) {
                return;
            }
            this.items.selectAll('.item-block-week')
                .transition()
                .duration(this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', (/**
             * @param {?} d
             * @return {?}
             */
            (d) => (moment(d.date).startOf('hour').format('HH:mm') === hour) ? 1 : 0.1));
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        () => {
            if (this.inTransition) {
                return;
            }
            this.items.selectAll('.item-block-week')
                .transition()
                .duration(this.transitionDuration)
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
        (d, i) => dayScale(i.toString()) + dayScale.bandwidth() / 1.75))
            .style('text-anchor', 'left')
            .attr('font-size', (/**
         * @return {?}
         */
        () => Math.floor(this.labelPadding / 3) + 'px'))
            .text((/**
         * @param {?} d
         * @return {?}
         */
        (d) => moment.utc(d).format('dddd')[0]))
            .on('mouseenter', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            if (this.inTransition) {
                return;
            }
            /** @type {?} */
            const selectedDay = moment.utc(d);
            this.items.selectAll('.item-block-week')
                .transition()
                .duration(this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', (/**
             * @param {?} data
             * @return {?}
             */
            (data) => (moment(data.date).day() === selectedDay.day()) ? 1 : 0.1));
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        () => {
            if (this.inTransition) {
                return;
            }
            this.items.selectAll('.item-block-week')
                .transition()
                .duration(this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', 1);
        }));
        // Add button to switch back to previous overview
        this.drawButton();
    }
    /**
     * @return {?}
     */
    drawDayOverview() {
        // Add current overview to the history
        if (this.history[this.history.length - 1] !== this.overview) {
            this.history.push(this.overview);
        }
        // Initialize selected date to today if it was not set
        if (!Object.keys(this.selected).length) {
            this.selected = this._data[this._data.length - 1];
        }
        /** @type {?} */
        const startOfDay = moment(this.selected.date).startOf('day');
        /** @type {?} */
        const endOfDay = moment(this.selected.date).endOf('day');
        // Filter data down to the selected month
        /** @type {?} */
        let dayData = [];
        this._data.filter((/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            return d.date.isBetween(startOfDay, endOfDay, null, '[]');
        })).map((/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            /** @type {?} */
            const scale = [];
            d.details.forEach((/**
             * @param {?} det
             * @return {?}
             */
            (det) => {
                /** @type {?} */
                const date = moment(det.date);
                /** @type {?} */
                const i = date.hours();
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
            s => {
                /** @type {?} */
                const group = this.groupBy(s.details, 'name');
                Object.keys(group).forEach((/**
                 * @param {?} k
                 * @return {?}
                 */
                k => {
                    s.summary.push({
                        name: k,
                        total: sum(group[k], (/**
                         * @param {?} item
                         * @return {?}
                         */
                        (item) => item.value)),
                        color: group[k][0].color
                    });
                }));
            }));
            dayData = dayData.concat(scale);
        }));
        /** @type {?} */
        const data = [];
        dayData.forEach((/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            /** @type {?} */
            const date = d.date;
            d.summary.forEach((/**
             * @param {?} s
             * @return {?}
             */
            (s) => {
                s.date = date;
                data.push(s);
            }));
        }));
        dayData = GTSLib.cleanArray(dayData);
        /** @type {?} */
        const maxValue = max(data, (/**
         * @param {?} d
         * @return {?}
         */
        (d) => d.total));
        /** @type {?} */
        const gtsNames = this.selected.summary.map((/**
         * @param {?} summary
         * @return {?}
         */
        (summary) => summary.name));
        /** @type {?} */
        const gtsNameScale = scaleBand().rangeRound([this.labelPadding, this.gHeight]).domain(gtsNames);
        /** @type {?} */
        const hourLabels = [];
        range(0, 24).forEach((/**
         * @param {?} h
         * @return {?}
         */
        h => hourLabels.push(moment.utc().hours(h).startOf('hour').format('HH:mm'))));
        /** @type {?} */
        const dayScale = scaleBand()
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
        (d) => this.gutter
            + dayScale(moment(d.date).startOf('hour').format('HH:mm'))
            + (this.itemSize - this.calcItemSize(d, maxValue)) / 2))
            .attr('y', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            return (gtsNameScale(d.name) || 1) - (this.itemSize - this.calcItemSize(d, maxValue)) / 2;
        }))
            .attr('rx', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => this.calcItemSize(d, maxValue)))
            .attr('ry', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => this.calcItemSize(d, maxValue)))
            .attr('width', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => this.calcItemSize(d, maxValue)))
            .attr('height', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => this.calcItemSize(d, maxValue)))
            .attr('fill', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            /** @type {?} */
            const color = scaleLinear()
                .range(['#ffffff', d.color || CalendarHeatmapComponent.DEF_MIN_COLOR])
                .domain([-0.5 * maxValue, maxValue]);
            return color(d.total);
        }))
            .style('opacity', 0)
            .on('mouseover', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            if (this.inTransition) {
                return;
            }
            // Calculate tooltip position
            /** @type {?} */
            let x = dayScale(moment(d.date).startOf('hour').format('HH:mm')) + this.tooltipPadding;
            while (this.gWidth - x < (this.tooltipWidth + this.tooltipPadding * 3)) {
                x -= 10;
            }
            /** @type {?} */
            const y = gtsNameScale(d.name) + this.tooltipPadding;
            // Show tooltip
            this.tooltip.html(this.getTooltip(d))
                .style('left', x + 'px')
                .style('top', y + 'px')
                .transition()
                .duration(this.transitionDuration / 2)
                .ease(easeLinear)
                .style('opacity', 1);
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        () => {
            if (this.inTransition) {
                return;
            }
            this.hideTooltip();
        }))
            .on('click', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            if (this.handler) {
                this.handler.emit(d);
            }
        }))
            .transition()
            .delay((/**
         * @return {?}
         */
        () => (Math.cos(Math.PI * Math.random()) + 1) * this.transitionDuration))
            .duration((/**
         * @return {?}
         */
        () => this.transitionDuration))
            .ease(easeLinear)
            .style('opacity', 1)
            .call((/**
         * @param {?} transition
         * @param {?} callback
         * @return {?}
         */
        (transition, callback) => {
            if (transition.empty()) {
                callback();
            }
            /** @type {?} */
            let n = 0;
            transition.each((/**
             * @return {?}
             */
            () => ++n)).on('end', (/**
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
        () => this.inTransition = false));
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
        () => Math.floor(this.labelPadding / 3) + 'px'))
            .text((/**
         * @param {?} d
         * @return {?}
         */
        (d) => d))
            .attr('x', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => dayScale(d)))
            .attr('y', this.labelPadding / 2)
            .on('mouseenter', (/**
         * @param {?} d
         * @return {?}
         */
        (d) => {
            if (this.inTransition) {
                return;
            }
            /** @type {?} */
            const selected = d;
            // const selected = itemScale(moment.utc(d));
            this.items.selectAll('.item-block')
                .transition()
                .duration(this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', (/**
             * @param {?} item
             * @return {?}
             */
            (item) => (item.date.format('HH:mm') === selected) ? 1 : 0.1));
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        () => {
            if (this.inTransition) {
                return;
            }
            this.items.selectAll('.item-block')
                .transition()
                .duration(this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', 1);
        }));
        // Add project labels
        /** @type {?} */
        const labelPadding = this.labelPadding;
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
        (d) => gtsNameScale(d) + this.itemSize / 2))
            .attr('min-height', (/**
         * @return {?}
         */
        () => gtsNameScale.bandwidth()))
            .style('text-anchor', 'left')
            .attr('font-size', (/**
         * @return {?}
         */
        () => Math.floor(this.labelPadding / 3) + 'px'))
            .text((/**
         * @param {?} d
         * @return {?}
         */
        (d) => d))
            .each((/**
         * @return {?}
         */
        function () {
            /** @type {?} */
            const obj = select(this);
            /** @type {?} */
            let textLength = obj.node().getComputedTextLength();
            /** @type {?} */
            let text = obj.text();
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
        (gtsName) => {
            if (this.inTransition) {
                return;
            }
            this.items.selectAll('.item-block')
                .transition()
                .duration(this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', (/**
             * @param {?} d
             * @return {?}
             */
            (d) => (d.name === gtsName) ? 1 : 0.1));
        }))
            .on('mouseout', (/**
         * @return {?}
         */
        () => {
            if (this.inTransition) {
                return;
            }
            this.items.selectAll('.item-block')
                .transition()
                .duration(this.transitionDuration)
                .ease(easeLinear)
                .style('opacity', 1);
        }));
        // Add button to switch back to previous overview
        this.drawButton();
    }
    /**
     * @private
     * @param {?} d
     * @param {?} startOfYear
     * @return {?}
     */
    calcItemX(d, startOfYear) {
        /** @type {?} */
        const dayIndex = Math.round((+moment(d.date) - +startOfYear.startOf('week')) / 86400000);
        /** @type {?} */
        const colIndex = Math.trunc(dayIndex / 7);
        return colIndex * (this.itemSize + this.gutter) + this.labelPadding;
    }
    /**
     * @private
     * @param {?} d
     * @param {?} start
     * @param {?} offset
     * @return {?}
     */
    calcItemXMonth(d, start, offset) {
        /** @type {?} */
        const hourIndex = moment(d.date).hours();
        /** @type {?} */
        const colIndex = Math.trunc(hourIndex / 3);
        return colIndex * (this.itemSize + this.gutter) + offset;
    }
    /**
     * @private
     * @param {?} d
     * @return {?}
     */
    calcItemY(d) {
        return this.labelPadding + d.date.weekday() * (this.itemSize + this.gutter);
    }
    /**
     * @private
     * @param {?} d
     * @param {?} m
     * @return {?}
     */
    calcItemSize(d, m) {
        if (m <= 0) {
            return this.itemSize;
        }
        return this.itemSize * 0.75 + (this.itemSize * d.total / m) * 0.25;
    }
    /**
     * @private
     * @return {?}
     */
    drawButton() {
        this.buttons.selectAll('.button').remove();
        /** @type {?} */
        const button = this.buttons.append('g')
            .attr('class', 'button button-back')
            .style('opacity', 0)
            .on('click', (/**
         * @return {?}
         */
        () => {
            if (this.inTransition) {
                return;
            }
            // Set transition boolean
            this.inTransition = true;
            // Clean the canvas from whichever overview type was on
            if (this.overview === 'year') {
                this.removeYearOverview();
            }
            else if (this.overview === 'month') {
                this.removeMonthOverview();
            }
            else if (this.overview === 'week') {
                this.removeWeekOverview();
            }
            else if (this.overview === 'day') {
                this.removeDayOverview();
            }
            // Redraw the chart
            this.history.pop();
            this.overview = this.history.pop();
            this.drawChart();
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
        () => {
            return Math.floor(this.gWidth / 100) / 3;
        }))
            .attr('font-size', (/**
         * @return {?}
         */
        () => {
            return Math.floor(this.labelPadding / 3) + 'px';
        }))
            .html('&#x2190;');
        button.transition()
            .duration(this.transitionDuration)
            .ease(easeLinear)
            .style('opacity', 1);
    }
    /**
     * @private
     * @return {?}
     */
    removeGlobalOverview() {
        this.items.selectAll('.item-block-year')
            .transition()
            .duration(this.transitionDuration)
            .ease(easeLinear)
            .style('opacity', 0)
            .remove();
        this.labels.selectAll('.label-year').remove();
    }
    /**
     * @private
     * @return {?}
     */
    removeYearOverview() {
        this.items.selectAll('.item-circle')
            .transition()
            .duration(this.transitionDuration)
            .ease(easeLinear)
            .style('opacity', 0)
            .remove();
        this.labels.selectAll('.label-day').remove();
        this.labels.selectAll('.label-month').remove();
        this.hideBackButton();
    }
    /**
     * @private
     * @return {?}
     */
    removeMonthOverview() {
        this.items.selectAll('.item-block-month')
            .transition()
            .duration(this.transitionDuration)
            .ease(easeLinear)
            .style('opacity', 0)
            .remove();
        this.labels.selectAll('.label-day').remove();
        this.labels.selectAll('.label-week').remove();
        this.hideBackButton();
    }
    /**
     * @private
     * @return {?}
     */
    removeWeekOverview() {
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
        (d, i) => (i % 2 === 0) ? -this.gWidth / 3 : this.gWidth / 3))
            .remove();
        this.labels.selectAll('.label-day').remove();
        this.labels.selectAll('.label-week').remove();
        this.hideBackButton();
    }
    /**
     * @private
     * @return {?}
     */
    removeDayOverview() {
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
        (d, i) => (i % 2 === 0) ? -this.gWidth / 3 : this.gWidth / 3))
            .remove();
        this.labels.selectAll('.label-time').remove();
        this.labels.selectAll('.label-project').remove();
        this.hideBackButton();
    }
    /**
     * @private
     * @return {?}
     */
    hideTooltip() {
        this.tooltip.transition()
            .duration(this.transitionDuration / 2)
            .ease(easeLinear)
            .style('opacity', 0);
    }
    /**
     * Helper function to hide the back button
     * @private
     * @return {?}
     */
    hideBackButton() {
        this.buttons.selectAll('.button')
            .transition()
            .duration(this.transitionDuration)
            .ease(easeLinear)
            .style('opacity', 0)
            .remove();
    }
}
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
CalendarHeatmapComponent.ctorParameters = () => [
    { type: ElementRef }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItaGVhdG1hcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VueC93YXJwdmlldy8iLCJzb3VyY2VzIjpbInNyYy9saWIvZWxlbWVudHMvd2FycC12aWV3LWRyaWxsLWRvd24vY2FsZW5kYXItaGVhdG1hcC9jYWxlbmRhci1oZWF0bWFwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWdCQSxPQUFPLEVBQWdCLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM1SSxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDN0MsT0FBTyxFQUFDLEtBQUssRUFBa0IsTUFBTSxnQkFBZ0IsQ0FBQztBQUN0RCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDbEQsT0FBTyxFQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQWEsR0FBRyxFQUFFLFFBQVEsRUFBQyxNQUFNLElBQUksQ0FBQztBQUM1RixPQUFPLEVBQUMsS0FBSyxFQUFFLE1BQU0sRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUMzQyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDbEQsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQzlDLE9BQU8sTUFBZ0IsTUFBTSxRQUFRLENBQUM7QUFRdEMsTUFBTSxPQUFPLHdCQUF3Qjs7OztJQTRDbkMsWUFBb0IsRUFBYztRQUFkLE9BQUUsR0FBRixFQUFFLENBQVk7UUFPbEIsVUFBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUM7UUFDOUIsV0FBTSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUM7UUFDL0IsYUFBUSxHQUFH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QUFLLFNBQUMsUUFBUTt1QkFDZCxLQUFLLFNBQUMsVUFBVTtzQkFFaEIsTUFBTSxTQUFDLFNBQVM7cUJBQ2hCLE1BQU0sU0FBQyxRQUFRO3VCQXdDZixZQUFZLFNBQUMsZUFBZTs7Ozs7OztJQXZEN0IsdUNBQXlDOzs7OztJQUN6Qyx1Q0FBeUM7O0lBT3pDLHVDQUFvRDs7SUFFcEQseUNBQStDOztJQUMvQywwQ0FBa0Q7O0lBQ2xELDRDQUF1Qzs7SUFFdkMsMkNBQXFEOztJQUNyRCwwQ0FBbUQ7Ozs7O0lBRW5ELHVDQUFvQjs7Ozs7SUFFcEIseUNBQXVCOzs7OztJQUV2QiwwQ0FBdUI7Ozs7O0lBRXZCLDZDQUFtRTs7Ozs7SUFFbkUsNkNBQW1FOzs7OztJQUVuRSwwQ0FBbUI7Ozs7O0lBQ25CLDBDQUFzQjs7Ozs7SUFDdEIsMkNBQXNCOzs7OztJQUN0Qiw0Q0FBc0I7Ozs7O0lBQ3RCLGdEQUEwQjs7Ozs7SUFDMUIsc0RBQWlDOzs7OztJQUNqQyxnREFBNkI7Ozs7O0lBRTdCLGdEQUEyQjs7Ozs7SUFDM0Isa0RBQTRCOzs7OztJQUU1QiwyQ0FBNkI7Ozs7O0lBQzdCLDRDQUFzQzs7Ozs7SUFFdEMsdUNBQXdEOzs7OztJQUN4RCx5Q0FBMEQ7Ozs7O0lBQzFELDBDQUEyRDs7Ozs7SUFDM0QsMkNBQTREOzs7OztJQUM1RCwyQ0FBZ0U7Ozs7O0lBQ2hFLCtDQUF5Qjs7Ozs7SUFDekIseUNBQTJCOzs7OztJQUMzQiwrQ0FBb0I7Ozs7O0lBbTJDcEIsOENBY0M7Ozs7O0lBOTVDVyxzQ0FBc0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogIENvcHlyaWdodCAyMDIwICBTZW5YIFMuQS5TLlxuICpcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICovXG5pbXBvcnQge0FmdGVyVmlld0luaXQsIENvbXBvbmVudCwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBIb3N0TGlzdGVuZXIsIElucHV0LCBPdXRwdXQsIFZpZXdDaGlsZCwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtMb2dnZXJ9IGZyb20gJy4uLy4uLy4uL3V0aWxzL2xvZ2dlcic7XG5pbXBvcnQge0RhdHVtLCBEZXRhaWwsIFN1bW1hcnl9IGZyb20gJy4uL21vZGVsL2RhdHVtJztcbmltcG9ydCB7Q2hhcnRMaWJ9IGZyb20gJy4uLy4uLy4uL3V0aWxzL2NoYXJ0LWxpYic7XG5pbXBvcnQge2Vhc2VMaW5lYXIsIG1heCwgcmFuZ2UsIHNjYWxlQmFuZCwgc2NhbGVMaW5lYXIsIFNlbGVjdGlvbiwgc3VtLCB0aW1lRGF5c30gZnJvbSAnZDMnO1xuaW1wb3J0IHtldmVudCwgc2VsZWN0fSBmcm9tICdkMy1zZWxlY3Rpb24nO1xuaW1wb3J0IHtDb2xvckxpYn0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvY29sb3ItbGliJztcbmltcG9ydCB7R1RTTGlifSBmcm9tICcuLi8uLi8uLi91dGlscy9ndHMubGliJztcbmltcG9ydCBtb21lbnQsIHtNb21lbnR9IGZyb20gJ21vbWVudCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2NhbGVuZGFyLWhlYXRtYXAnLFxuICB0ZW1wbGF0ZVVybDogJy4vY2FsZW5kYXItaGVhdG1hcC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2NhbGVuZGFyLWhlYXRtYXAuY29tcG9uZW50LnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uU2hhZG93RG9tXG59KVxuZXhwb3J0IGNsYXNzIENhbGVuZGFySGVhdG1hcENvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xuXG4gIEBJbnB1dCgnZGVidWcnKSBzZXQgZGVidWcoZGVidWc6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9kZWJ1ZyA9IGRlYnVnO1xuICAgIHRoaXMuTE9HLnNldERlYnVnKGRlYnVnKTtcbiAgfVxuXG4gIGdldCBkZWJ1ZygpIHtcbiAgICByZXR1cm4gdGhpcy5fZGVidWc7XG4gIH1cblxuICBASW5wdXQoJ2RhdGEnKSBzZXQgZGF0YShkYXRhOiBEYXR1bVtdKSB7XG4gICAgdGhpcy5MT0cuZGVidWcoWydkYXRhJ10sIGRhdGEpO1xuICAgIGlmIChkYXRhKSB7XG4gICAgICB0aGlzLl9kYXRhID0gZGF0YTtcbiAgICAgIHRoaXMuY2FsY3VsYXRlRGltZW5zaW9ucygpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBkYXRhKCk6IERhdHVtW10ge1xuICAgIHJldHVybiB0aGlzLl9kYXRhO1xuICB9XG5cbiAgQElucHV0KCdtaW5Db2xvcicpIHNldCBtaW5Db2xvcihtaW5Db2xvcjogc3RyaW5nKSB7XG4gICAgdGhpcy5fbWluQ29sb3IgPSBtaW5Db2xvcjtcbiAgICB0aGlzLmNhbGN1bGF0ZURpbWVuc2lvbnMoKTtcbiAgfVxuXG4gIGdldCBtaW5Db2xvcigpIHtcbiAgICByZXR1cm4gdGhpcy5fbWluQ29sb3I7XG4gIH1cblxuICBASW5wdXQoJ21heENvbG9yJykgc2V0IG1heENvbG9yKG1heENvbG9yOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9tYXhDb2xvciA9IG1heENvbG9yO1xuICAgIHRoaXMuY2FsY3VsYXRlRGltZW5zaW9ucygpO1xuICB9XG5cbiAgZ2V0IG1heENvbG9yKCkge1xuICAgIHJldHVybiB0aGlzLl9tYXhDb2xvcjtcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIERFRl9NSU5fQ09MT1IgPSAnI2ZmZmZmZic7XG4gIHByaXZhdGUgc3RhdGljIERFRl9NQVhfQ09MT1IgPSAnIzMzMzMzMyc7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbDogRWxlbWVudFJlZikge1xuICAgIHRoaXMuTE9HID0gbmV3IExvZ2dlcihDYWxlbmRhckhlYXRtYXBDb21wb25lbnQsIHRoaXMuZGVidWcpO1xuICB9XG5cblxuICBAVmlld0NoaWxkKCdjaGFydCcsIHtzdGF0aWM6IHRydWV9KSBkaXY6IEVsZW1lbnRSZWY7XG5cbiAgQElucHV0KCd3aWR0aCcpIHdpZHRoID0gQ2hhcnRMaWIuREVGQVVMVF9XSURUSDtcbiAgQElucHV0KCdoZWlnaHQnKSBoZWlnaHQgPSBDaGFydExpYi5ERUZBVUxUX0hFSUdIVDtcbiAgQElucHV0KCdvdmVydmlldycpIG92ZXJ2aWV3ID0gJ2dsb2JhbCc7XG5cbiAgQE91dHB1dCgnaGFuZGxlcicpIGhhbmRsZXIgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgnY2hhbmdlJykgY2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgcHJpdmF0ZSBMT0c6IExvZ2dlcjtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWVcbiAgcHJpdmF0ZSBfZGF0YTogRGF0dW1bXTtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWVcbiAgcHJpdmF0ZSBfZGVidWcgPSBmYWxzZTtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWVcbiAgcHJpdmF0ZSBfbWluQ29sb3I6IHN0cmluZyA9IENhbGVuZGFySGVhdG1hcENvbXBvbmVudC5ERUZfTUlOX0NPTE9SO1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZVxuICBwcml2YXRlIF9tYXhDb2xvcjogc3RyaW5nID0gQ2FsZW5kYXJIZWF0bWFwQ29tcG9uZW50LkRFRl9NQVhfQ09MT1I7XG4vLyBEZWZhdWx0c1xuICBwcml2YXRlIGd1dHRlciA9IDU7XG4gIHByaXZhdGUgZ1dpZHRoID0gMTAwMDtcbiAgcHJpdmF0ZSBnSGVpZ2h0ID0gMjAwO1xuICBwcml2YXRlIGl0ZW1TaXplID0gMTA7XG4gIHByaXZhdGUgbGFiZWxQYWRkaW5nID0gNDA7XG4gIHByaXZhdGUgdHJhbnNpdGlvbkR1cmF0aW9uID0gMjUwO1xuICBwcml2YXRlIGluVHJhbnNpdGlvbiA9IGZhbHNlO1xuICAvLyBUb29sdGlwIGRlZmF1bHRzXG4gIHByaXZhdGUgdG9vbHRpcFdpZHRoID0gNDUwO1xuICBwcml2YXRlIHRvb2x0aXBQYWRkaW5nID0gMTU7XG4gIC8vIE92ZXJ2aWV3IGRlZmF1bHRzXG4gIHByaXZhdGUgaGlzdG9yeSA9IFsnZ2xvYmFsJ107XG4gIHByaXZhdGUgc2VsZWN0ZWQ6IERhdHVtID0gbmV3IERhdHVtKCk7XG4gIC8vIEQzIHJlbGF0ZWQgdmFyaWFibGVzXG4gIHByaXZhdGUgc3ZnOiBTZWxlY3Rpb248U1ZHRWxlbWVudCwge30sIG51bGwsIHVuZGVmaW5lZD47XG4gIHByaXZhdGUgaXRlbXM6IFNlbGVjdGlvbjxTVkdFbGVtZW50LCB7fSwgbnVsbCwgdW5kZWZpbmVkPjtcbiAgcHJpdmF0ZSBsYWJlbHM6IFNlbGVjdGlvbjxTVkdFbGVtZW50LCB7fSwgbnVsbCwgdW5kZWZpbmVkPjtcbiAgcHJpdmF0ZSBidXR0b25zOiBTZWxlY3Rpb248U1ZHRWxlbWVudCwge30sIG51bGwsIHVuZGVmaW5lZD47XG4gIHByaXZhdGUgdG9vbHRpcDogU2VsZWN0aW9uPEhUTUxEaXZFbGVtZW50LCB7fSwgbnVsbCwgdW5kZWZpbmVkPjtcbiAgcHJpdmF0ZSBwYXJlbnRXaWR0aCA9IC0xO1xuICBwcml2YXRlIGNoYXJ0OiBIVE1MRWxlbWVudDtcbiAgcHJpdmF0ZSByZXNpemVUaW1lcjtcblxuICBzdGF0aWMgZ2V0TnVtYmVyT2ZXZWVrcygpOiBudW1iZXIge1xuICAgIGNvbnN0IGRheUluZGV4ID0gTWF0aC5yb3VuZCgoK21vbWVudC51dGMoKSAtICttb21lbnQudXRjKCkuc3VidHJhY3QoMSwgJ3llYXInKS5zdGFydE9mKCd3ZWVrJykpIC8gODY0MDAwMDApO1xuICAgIHJldHVybiBNYXRoLnRydW5jKGRheUluZGV4IC8gNykgKyAxO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignd2luZG93OnJlc2l6ZScpXG4gIG9uUmVzaXplKCkge1xuICAgIGlmICh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudC5jbGllbnRXaWR0aCAhPT0gdGhpcy5wYXJlbnRXaWR0aCkge1xuICAgICAgdGhpcy5jYWxjdWxhdGVEaW1lbnNpb25zKCk7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuY2hhcnQgPSB0aGlzLmRpdi5uYXRpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50O1xuICAgIC8vIEluaXRpYWxpemUgc3ZnIGVsZW1lbnRcbiAgICB0aGlzLnN2ZyA9IHNlbGVjdCh0aGlzLmNoYXJ0KS5hcHBlbmQoJ3N2ZycpLmF0dHIoJ2NsYXNzJywgJ3N2ZycpO1xuICAgIC8vIEluaXRpYWxpemUgbWFpbiBzdmcgZWxlbWVudHNcbiAgICB0aGlzLml0ZW1zID0gdGhpcy5zdmcuYXBwZW5kKCdnJyk7XG4gICAgdGhpcy5sYWJlbHMgPSB0aGlzLnN2Zy5hcHBlbmQoJ2cnKTtcbiAgICB0aGlzLmJ1dHRvbnMgPSB0aGlzLnN2Zy5hcHBlbmQoJ2cnKTtcbiAgICAvLyBBZGQgdG9vbHRpcCB0byB0aGUgc2FtZSBlbGVtZW50IGFzIG1haW4gc3ZnXG4gICAgdGhpcy50b29sdGlwID0gc2VsZWN0KHRoaXMuY2hhcnQpXG4gICAgICAuYXBwZW5kKCdkaXYnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2hlYXRtYXAtdG9vbHRpcCcpXG4gICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKTtcbiAgICAvLyBDYWxjdWxhdGUgY2hhcnQgZGltZW5zaW9uc1xuICAgIHRoaXMuY2FsY3VsYXRlRGltZW5zaW9ucygpO1xuICAgIC8vICB0aGlzLmRyYXdDaGFydCgpO1xuICB9XG5cbiAgY2FsY3VsYXRlRGltZW5zaW9ucygpIHtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5yZXNpemVUaW1lcik7XG4gICAgdGhpcy5yZXNpemVUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuZWwubmF0aXZlRWxlbWVudC5wYXJlbnRFbGVtZW50LmNsaWVudFdpZHRoICE9PSAwKSB7XG4gICAgICAgIHRoaXMuZ1dpZHRoID0gdGhpcy5jaGFydC5jbGllbnRXaWR0aCA8IDEwMDAgPyAxMDAwIDogdGhpcy5jaGFydC5jbGllbnRXaWR0aDtcbiAgICAgICAgdGhpcy5pdGVtU2l6ZSA9ICgodGhpcy5nV2lkdGggLSB0aGlzLmxhYmVsUGFkZGluZykgLyBDYWxlbmRhckhlYXRtYXBDb21wb25lbnQuZ2V0TnVtYmVyT2ZXZWVrcygpIC0gdGhpcy5ndXR0ZXIpO1xuICAgICAgICB0aGlzLmdIZWlnaHQgPSB0aGlzLmxhYmVsUGFkZGluZyArIDcgKiAodGhpcy5pdGVtU2l6ZSArIHRoaXMuZ3V0dGVyKTtcbiAgICAgICAgdGhpcy5zdmcuYXR0cignd2lkdGgnLCB0aGlzLmdXaWR0aCkuYXR0cignaGVpZ2h0JywgdGhpcy5nSGVpZ2h0KTtcbiAgICAgICAgdGhpcy5MT0cuZGVidWcoWydjYWxjdWxhdGVEaW1lbnNpb25zJ10sIHRoaXMuX2RhdGEpO1xuICAgICAgICBpZiAoISF0aGlzLl9kYXRhICYmICEhdGhpcy5fZGF0YVswXSAmJiAhIXRoaXMuX2RhdGFbMF0uc3VtbWFyeSkge1xuICAgICAgICAgIHRoaXMuZHJhd0NoYXJ0KCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlRGltZW5zaW9ucygpO1xuICAgICAgfVxuICAgIH0sIDI1MCk7XG4gIH1cblxuXG4gIHByaXZhdGUgZ3JvdXBCeSh4cywga2V5KSB7XG4gICAgcmV0dXJuIHhzLnJlZHVjZSgocnYsIHgpID0+IHtcbiAgICAgIChydlt4W2tleV1dID0gcnZbeFtrZXldXSB8fCBbXSkucHVzaCh4KTtcbiAgICAgIHJldHVybiBydjtcbiAgICB9LCB7fSk7XG4gIH1cblxuICB1cGRhdGVEYXRhU3VtbWFyeSgpIHtcbiAgICAvLyBHZXQgZGFpbHkgc3VtbWFyeSBpZiB0aGF0IHdhcyBub3QgcHJvdmlkZWRcbiAgICBpZiAoIXRoaXMuX2RhdGFbMF0uc3VtbWFyeSkge1xuICAgICAgdGhpcy5fZGF0YS5tYXAoKGQ6IERhdHVtKSA9PiB7XG4gICAgICAgIGNvbnN0IHN1bW1hcnkgPSBkLmRldGFpbHMucmVkdWNlKCh1bmlxdWVzOiBhbnksIHByb2plY3Q6IGFueSkgPT4ge1xuICAgICAgICAgIGlmICghdW5pcXVlc1twcm9qZWN0Lm5hbWVdKSB7XG4gICAgICAgICAgICB1bmlxdWVzW3Byb2plY3QubmFtZV0gPSB7dmFsdWU6IHByb2plY3QudmFsdWV9O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1bmlxdWVzW3Byb2plY3QubmFtZV0udmFsdWUgKz0gcHJvamVjdC52YWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHVuaXF1ZXM7XG4gICAgICAgIH0sIHt9KTtcbiAgICAgICAgY29uc3QgdW5zb3J0ZWRTdW1tYXJ5ID0gT2JqZWN0LmtleXMoc3VtbWFyeSkubWFwKChrZXkpID0+IHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbmFtZToga2V5LFxuICAgICAgICAgICAgdG90YWw6IHN1bW1hcnlba2V5XS52YWx1ZVxuICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgICAgICBkLnN1bW1hcnkgPSB1bnNvcnRlZFN1bW1hcnkuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgIHJldHVybiBiLnRvdGFsIC0gYS50b3RhbDtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBkO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZHJhd0NoYXJ0KCkge1xuICAgIGlmICghdGhpcy5zdmcgfHwgIXRoaXMuX2RhdGEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5MT0cuZGVidWcoWydkcmF3Q2hhcnQnXSwgW3RoaXMub3ZlcnZpZXcsIHRoaXMuc2VsZWN0ZWRdKTtcbiAgICBzd2l0Y2ggKHRoaXMub3ZlcnZpZXcpIHtcbiAgICAgIGNhc2UgJ2dsb2JhbCc6XG4gICAgICAgIHRoaXMuZHJhd0dsb2JhbE92ZXJ2aWV3KCk7XG4gICAgICAgIHRoaXMuY2hhbmdlLmVtaXQoe1xuICAgICAgICAgIG92ZXJ2aWV3OiB0aGlzLm92ZXJ2aWV3LFxuICAgICAgICAgIHN0YXJ0OiBtb21lbnQodGhpcy5fZGF0YVswXS5kYXRlKSxcbiAgICAgICAgICBlbmQ6IG1vbWVudCh0aGlzLl9kYXRhW3RoaXMuX2RhdGEubGVuZ3RoIC0gMV0uZGF0ZSksXG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3llYXInOlxuICAgICAgICB0aGlzLmRyYXdZZWFyT3ZlcnZpZXcoKTtcbiAgICAgICAgdGhpcy5jaGFuZ2UuZW1pdCh7XG4gICAgICAgICAgb3ZlcnZpZXc6IHRoaXMub3ZlcnZpZXcsXG4gICAgICAgICAgc3RhcnQ6IG1vbWVudCh0aGlzLnNlbGVjdGVkLmRhdGUpLnN0YXJ0T2YoJ3llYXInKSxcbiAgICAgICAgICBlbmQ6IG1vbWVudCh0aGlzLnNlbGVjdGVkLmRhdGUpLmVuZE9mKCd5ZWFyJyksXG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21vbnRoJzpcbiAgICAgICAgdGhpcy5kcmF3TW9udGhPdmVydmlldygpO1xuICAgICAgICB0aGlzLmNoYW5nZS5lbWl0KHtcbiAgICAgICAgICBvdmVydmlldzogdGhpcy5vdmVydmlldyxcbiAgICAgICAgICBzdGFydDogbW9tZW50KHRoaXMuc2VsZWN0ZWQuZGF0ZSkuc3RhcnRPZignbW9udGgnKSxcbiAgICAgICAgICBlbmQ6IG1vbWVudCh0aGlzLnNlbGVjdGVkLmRhdGUpLmVuZE9mKCdtb250aCcpLFxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd3ZWVrJzpcbiAgICAgICAgdGhpcy5kcmF3V2Vla092ZXJ2aWV3KCk7XG4gICAgICAgIHRoaXMuY2hhbmdlLmVtaXQoe1xuICAgICAgICAgIG92ZXJ2aWV3OiB0aGlzLm92ZXJ2aWV3LFxuICAgICAgICAgIHN0YXJ0OiBtb21lbnQodGhpcy5zZWxlY3RlZC5kYXRlKS5zdGFydE9mKCd3ZWVrJyksXG4gICAgICAgICAgZW5kOiBtb21lbnQodGhpcy5zZWxlY3RlZC5kYXRlKS5lbmRPZignd2VlaycpLFxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdkYXknOlxuICAgICAgICB0aGlzLmRyYXdEYXlPdmVydmlldygpO1xuICAgICAgICB0aGlzLmNoYW5nZS5lbWl0KHtcbiAgICAgICAgICBvdmVydmlldzogdGhpcy5vdmVydmlldyxcbiAgICAgICAgICBzdGFydDogbW9tZW50KHRoaXMuc2VsZWN0ZWQuZGF0ZSkuc3RhcnRPZignZGF5JyksXG4gICAgICAgICAgZW5kOiBtb21lbnQodGhpcy5zZWxlY3RlZC5kYXRlKS5lbmRPZignZGF5JyksXG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGRyYXdHbG9iYWxPdmVydmlldygpIHtcbiAgICAvLyBBZGQgY3VycmVudCBvdmVydmlldyB0byB0aGUgaGlzdG9yeVxuICAgIGlmICh0aGlzLmhpc3RvcnlbdGhpcy5oaXN0b3J5Lmxlbmd0aCAtIDFdICE9PSB0aGlzLm92ZXJ2aWV3KSB7XG4gICAgICB0aGlzLmhpc3RvcnkucHVzaCh0aGlzLm92ZXJ2aWV3KTtcbiAgICB9XG4gICAgLy8gRGVmaW5lIHN0YXJ0IGFuZCBlbmQgb2YgdGhlIGRhdGFzZXRcbiAgICBjb25zdCBzdGFydFBlcmlvZDogTW9tZW50ID0gbW9tZW50LnV0Yyh0aGlzLl9kYXRhWzBdLmRhdGUuc3RhcnRPZigneScpKTtcbiAgICBjb25zdCBlbmRQZXJpb2Q6IE1vbWVudCA9IG1vbWVudC51dGModGhpcy5fZGF0YVt0aGlzLl9kYXRhLmxlbmd0aCAtIDFdLmRhdGUuZW5kT2YoJ3knKSk7XG4gICAgLy8gRGVmaW5lIGFycmF5IG9mIHllYXJzIGFuZCB0b3RhbCB2YWx1ZXNcbiAgICBjb25zdCB5RGF0YTogRGF0dW1bXSA9IHRoaXMuX2RhdGEuZmlsdGVyKChkOiBEYXR1bSkgPT4gZC5kYXRlLmlzQmV0d2VlbihzdGFydFBlcmlvZCwgZW5kUGVyaW9kLCBudWxsLCAnW10nKSk7XG4gICAgeURhdGEuZm9yRWFjaCgoZDogRGF0dW0pID0+IHtcbiAgICAgIGNvbnN0IHN1bW1hcnk6IFN1bW1hcnlbXSA9IFtdO1xuICAgICAgY29uc3QgZ3JvdXAgPSB0aGlzLmdyb3VwQnkoZC5kZXRhaWxzLCAnbmFtZScpO1xuICAgICAgT2JqZWN0LmtleXMoZ3JvdXApLmZvckVhY2goayA9PiB7XG4gICAgICAgIHN1bW1hcnkucHVzaCh7XG4gICAgICAgICAgbmFtZTogayxcbiAgICAgICAgICB0b3RhbDogZ3JvdXBba10ucmVkdWNlKChhY2MsIG8pID0+IHtcbiAgICAgICAgICAgIHJldHVybiBhY2MgKyBvLnZhbHVlO1xuICAgICAgICAgIH0sIDApLFxuICAgICAgICAgIGNvbG9yOiBncm91cFtrXVswXS5jb2xvcixcbiAgICAgICAgICBpZDogZ3JvdXBba11bMF0uaWQsXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBkLnN1bW1hcnkgPSBzdW1tYXJ5O1xuICAgIH0pO1xuICAgIGNvbnN0IGR1cmF0aW9uID0gTWF0aC5jZWlsKG1vbWVudC5kdXJhdGlvbihlbmRQZXJpb2QuZGlmZihzdGFydFBlcmlvZCkpLmFzWWVhcnMoKSk7XG4gICAgY29uc3Qgc2NhbGUgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGR1cmF0aW9uOyBpKyspIHtcbiAgICAgIGNvbnN0IGQgPSBtb21lbnQudXRjKCkueWVhcihzdGFydFBlcmlvZC55ZWFyKCkgKyBpKS5tb250aCgwKS5kYXRlKDEpLnN0YXJ0T2YoJ3knKTtcbiAgICAgIHNjYWxlLnB1c2goZCk7XG4gICAgfVxuICAgIGxldCB5ZWFyRGF0YTogRGF0dW1bXSA9IHlEYXRhLm1hcCgoZDogRGF0dW0pID0+IHtcbiAgICAgIGNvbnN0IGRhdGU6IE1vbWVudCA9IGQuZGF0ZTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGRhdGUsXG4gICAgICAgIHRvdGFsOiB5RGF0YS5yZWR1Y2UoKHByZXY6IG51bWJlciwgY3VycmVudDogYW55KSA9PiB7XG4gICAgICAgICAgaWYgKChjdXJyZW50LmRhdGUgYXMgTW9tZW50KS55ZWFyKCkgPT09IGRhdGUueWVhcigpKSB7XG4gICAgICAgICAgICBwcmV2ICs9IGN1cnJlbnQudG90YWw7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBwcmV2O1xuICAgICAgICB9LCAwKSxcbiAgICAgICAgc3VtbWFyeTogKCgpID0+IHtcbiAgICAgICAgICBjb25zdCBzdW1tYXJ5OiBTdW1tYXJ5ID0geURhdGEucmVkdWNlKChzOiBhbnksIGRhdGE6IGFueSkgPT4ge1xuICAgICAgICAgICAgaWYgKChkYXRhLmRhdGUgYXMgTW9tZW50KS55ZWFyKCkgPT09IGRhdGUueWVhcigpKSB7XG4gICAgICAgICAgICAgIGRhdGEuc3VtbWFyeS5mb3JFYWNoKF9zdW1tYXJ5ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXNbX3N1bW1hcnkubmFtZV0pIHtcbiAgICAgICAgICAgICAgICAgIHNbX3N1bW1hcnkubmFtZV0gPSB7XG4gICAgICAgICAgICAgICAgICAgIHRvdGFsOiBfc3VtbWFyeS50b3RhbCxcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IF9zdW1tYXJ5LmNvbG9yLFxuICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgc1tfc3VtbWFyeS5uYW1lXS50b3RhbCArPSBfc3VtbWFyeS50b3RhbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHM7XG4gICAgICAgICAgfSwge30pO1xuICAgICAgICAgIGNvbnN0IHVuc29ydGVkU3VtbWFyeTogU3VtbWFyeVtdID0gT2JqZWN0LmtleXMoc3VtbWFyeSkubWFwKChrZXkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIG5hbWU6IGtleSxcbiAgICAgICAgICAgICAgdG90YWw6IHN1bW1hcnlba2V5XS50b3RhbCxcbiAgICAgICAgICAgICAgY29sb3I6IHN1bW1hcnlba2V5XS5jb2xvcixcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIHVuc29ydGVkU3VtbWFyeS5zb3J0KChhLCBiKSA9PiBiLnRvdGFsIC0gYS50b3RhbCk7XG4gICAgICAgIH0pKCksXG4gICAgICB9O1xuICAgIH0pO1xuICAgIC8vIENhbGN1bGF0ZSBtYXggdmFsdWUgb2YgYWxsIHRoZSB5ZWFycyBpbiB0aGUgZGF0YXNldFxuICAgIHllYXJEYXRhID0gR1RTTGliLmNsZWFuQXJyYXkoeWVhckRhdGEpO1xuICAgIGNvbnN0IG1heFZhbHVlID0gbWF4KHllYXJEYXRhLCAoZDogRGF0dW0pID0+IGQudG90YWwpO1xuICAgIC8vIERlZmluZSB5ZWFyIGxhYmVscyBhbmQgYXhpc1xuICAgIGNvbnN0IHllYXJMYWJlbHMgPSBzY2FsZS5tYXAoKGQ6IE1vbWVudCkgPT4gZCk7XG4gICAgY29uc3QgeWVhclNjYWxlID0gc2NhbGVCYW5kKClcbiAgICAgIC5yYW5nZVJvdW5kKFswLCB0aGlzLmdXaWR0aF0pXG4gICAgICAucGFkZGluZygwLjA1KVxuICAgICAgLmRvbWFpbih5ZWFyTGFiZWxzLm1hcCgoZDogTW9tZW50KSA9PiBkLnllYXIoKS50b1N0cmluZygpKSk7XG5cbiAgICBjb25zdCBjb2xvciA9IHNjYWxlTGluZWFyPHN0cmluZz4oKVxuICAgICAgLnJhbmdlKFt0aGlzLm1pbkNvbG9yIHx8IENhbGVuZGFySGVhdG1hcENvbXBvbmVudC5ERUZfTUlOX0NPTE9SLCB0aGlzLm1heENvbG9yIHx8IENhbGVuZGFySGVhdG1hcENvbXBvbmVudC5ERUZfTUFYX0NPTE9SXSlcbiAgICAgIC5kb21haW4oWy0wLjE1ICogbWF4VmFsdWUsIG1heFZhbHVlXSk7XG4gICAgLy8gQWRkIGdsb2JhbCBkYXRhIGl0ZW1zIHRvIHRoZSBvdmVydmlld1xuICAgIHRoaXMuaXRlbXMuc2VsZWN0QWxsKCcuaXRlbS1ibG9jay15ZWFyJykucmVtb3ZlKCk7XG4gICAgdGhpcy5pdGVtcy5zZWxlY3RBbGwoJy5pdGVtLWJsb2NrLXllYXInKVxuICAgICAgLmRhdGEoeWVhckRhdGEpXG4gICAgICAuZW50ZXIoKVxuICAgICAgLmFwcGVuZCgncmVjdCcpXG4gICAgICAuYXR0cignY2xhc3MnLCAnaXRlbSBpdGVtLWJsb2NrLXllYXInKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgKCkgPT4gKHRoaXMuZ1dpZHRoIC0gdGhpcy5sYWJlbFBhZGRpbmcpIC8geWVhckxhYmVscy5sZW5ndGggLSB0aGlzLmd1dHRlciAqIDUpXG4gICAgICAuYXR0cignaGVpZ2h0JywgKCkgPT4gdGhpcy5nSGVpZ2h0IC0gdGhpcy5sYWJlbFBhZGRpbmcpXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgKGQ6IERhdHVtKSA9PiAndHJhbnNsYXRlKCcgKyB5ZWFyU2NhbGUoKGQuZGF0ZSBhcyBNb21lbnQpLnllYXIoKS50b1N0cmluZygpKSArICcsJyArIHRoaXMudG9vbHRpcFBhZGRpbmcgKiAyICsgJyknKVxuICAgICAgLmF0dHIoJ2ZpbGwnLCAoZDogRGF0dW0pID0+IGNvbG9yKGQudG90YWwpIHx8IENhbGVuZGFySGVhdG1hcENvbXBvbmVudC5ERUZfTUFYX0NPTE9SKVxuICAgICAgLm9uKCdjbGljaycsIChkOiBEYXR1bSkgPT4ge1xuICAgICAgICBpZiAodGhpcy5pblRyYW5zaXRpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gU2V0IGluX3RyYW5zaXRpb24gZmxhZ1xuICAgICAgICB0aGlzLmluVHJhbnNpdGlvbiA9IHRydWU7XG4gICAgICAgIC8vIFNldCBzZWxlY3RlZCBkYXRlIHRvIHRoZSBvbmUgY2xpY2tlZCBvblxuICAgICAgICB0aGlzLnNlbGVjdGVkID0gZDtcbiAgICAgICAgLy8gSGlkZSB0b29sdGlwXG4gICAgICAgIHRoaXMuaGlkZVRvb2x0aXAoKTtcbiAgICAgICAgLy8gUmVtb3ZlIGFsbCBnbG9iYWwgb3ZlcnZpZXcgcmVsYXRlZCBpdGVtcyBhbmQgbGFiZWxzXG4gICAgICAgIHRoaXMucmVtb3ZlR2xvYmFsT3ZlcnZpZXcoKTtcbiAgICAgICAgLy8gUmVkcmF3IHRoZSBjaGFydFxuICAgICAgICB0aGlzLm92ZXJ2aWV3ID0gJ3llYXInO1xuICAgICAgICB0aGlzLmRyYXdDaGFydCgpO1xuICAgICAgfSlcbiAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAub24oJ21vdXNlb3ZlcicsIChkOiBEYXR1bSkgPT4ge1xuICAgICAgICBpZiAodGhpcy5pblRyYW5zaXRpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRvb2x0aXAgcG9zaXRpb25cbiAgICAgICAgbGV0IHggPSB5ZWFyU2NhbGUoZC5kYXRlLnllYXIoKS50b1N0cmluZygpKSArIHRoaXMudG9vbHRpcFBhZGRpbmcgKiAyO1xuICAgICAgICB3aGlsZSAodGhpcy5nV2lkdGggLSB4IDwgKHRoaXMudG9vbHRpcFdpZHRoICsgdGhpcy50b29sdGlwUGFkZGluZyAqIDUpKSB7XG4gICAgICAgICAgeCAtPSAxMDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB5ID0gdGhpcy50b29sdGlwUGFkZGluZyAqIDQ7XG4gICAgICAgIC8vIFNob3cgdG9vbHRpcFxuICAgICAgICB0aGlzLnRvb2x0aXAuaHRtbCh0aGlzLmdldFRvb2x0aXAoZCkpXG4gICAgICAgICAgLnN0eWxlKCdsZWZ0JywgeCArICdweCcpXG4gICAgICAgICAgLnN0eWxlKCd0b3AnLCB5ICsgJ3B4JylcbiAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgLmR1cmF0aW9uKHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uIC8gMilcbiAgICAgICAgICAuZWFzZShlYXNlTGluZWFyKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpO1xuICAgICAgfSlcbiAgICAgIC5vbignbW91c2VvdXQnLCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmluVHJhbnNpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmhpZGVUb29sdGlwKCk7XG4gICAgICB9KVxuICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgLmRlbGF5KChkOiBhbnksIGk6IG51bWJlcikgPT4gdGhpcy50cmFuc2l0aW9uRHVyYXRpb24gKiAoaSArIDEpIC8gMTApXG4gICAgICAuZHVyYXRpb24oKCkgPT4gdGhpcy50cmFuc2l0aW9uRHVyYXRpb24pXG4gICAgICAuZWFzZShlYXNlTGluZWFyKVxuICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMSlcbiAgICAgIC5jYWxsKCh0cmFuc2l0aW9uOiBhbnksIGNhbGxiYWNrOiBhbnkpID0+IHtcbiAgICAgICAgaWYgKHRyYW5zaXRpb24uZW1wdHkoKSkge1xuICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IG4gPSAwO1xuICAgICAgICB0cmFuc2l0aW9uLmVhY2goKCkgPT4gKytuKS5vbignZW5kJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKCEtLW4pIHtcbiAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0sICgpID0+IHRoaXMuaW5UcmFuc2l0aW9uID0gZmFsc2UpO1xuICAgIC8vIEFkZCB5ZWFyIGxhYmVsc1xuICAgIHRoaXMubGFiZWxzLnNlbGVjdEFsbCgnLmxhYmVsLXllYXInKS5yZW1vdmUoKTtcbiAgICB0aGlzLmxhYmVscy5zZWxlY3RBbGwoJy5sYWJlbC15ZWFyJylcbiAgICAgIC5kYXRhKHllYXJMYWJlbHMpXG4gICAgICAuZW50ZXIoKVxuICAgICAgLmFwcGVuZCgndGV4dCcpXG4gICAgICAuYXR0cignY2xhc3MnLCAnbGFiZWwgbGFiZWwteWVhcicpXG4gICAgICAuYXR0cignZm9udC1zaXplJywgKCkgPT4gTWF0aC5mbG9vcih0aGlzLmxhYmVsUGFkZGluZyAvIDMpICsgJ3B4JylcbiAgICAgIC50ZXh0KChkOiBNb21lbnQpID0+IGQueWVhcigpKVxuICAgICAgLmF0dHIoJ3gnLCAoZDogTW9tZW50KSA9PiB5ZWFyU2NhbGUoZC55ZWFyKCkudG9TdHJpbmcoKSkpXG4gICAgICAuYXR0cigneScsIHRoaXMubGFiZWxQYWRkaW5nIC8gMilcbiAgICAgIC5vbignbW91c2VlbnRlcicsICh5ZWFyTGFiZWw6IE1vbWVudCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5pblRyYW5zaXRpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pdGVtcy5zZWxlY3RBbGwoJy5pdGVtLWJsb2NrLXllYXInKVxuICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAuZHVyYXRpb24odGhpcy50cmFuc2l0aW9uRHVyYXRpb24pXG4gICAgICAgICAgLmVhc2UoZWFzZUxpbmVhcilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAoZDogRGF0dW0pID0+IChkLmRhdGUueWVhcigpID09PSB5ZWFyTGFiZWwueWVhcigpKSA/IDEgOiAwLjEpO1xuICAgICAgfSlcbiAgICAgIC5vbignbW91c2VvdXQnLCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmluVHJhbnNpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLml0ZW1zLnNlbGVjdEFsbCgnLml0ZW0tYmxvY2steWVhcicpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgIC5kdXJhdGlvbih0aGlzLnRyYW5zaXRpb25EdXJhdGlvbilcbiAgICAgICAgICAuZWFzZShlYXNlTGluZWFyKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpO1xuICAgICAgfSlcbiAgICAgIC5vbignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmluVHJhbnNpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBTZXQgaW5fdHJhbnNpdGlvbiBmbGFnXG4gICAgICAgIHRoaXMuaW5UcmFuc2l0aW9uID0gdHJ1ZTtcbiAgICAgICAgLy8gU2V0IHNlbGVjdGVkIHllYXIgdG8gdGhlIG9uZSBjbGlja2VkIG9uXG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSB5ZWFyRGF0YVswXTtcbiAgICAgICAgLy8gSGlkZSB0b29sdGlwXG4gICAgICAgIHRoaXMuaGlkZVRvb2x0aXAoKTtcbiAgICAgICAgLy8gUmVtb3ZlIGFsbCBnbG9iYWwgb3ZlcnZpZXcgcmVsYXRlZCBpdGVtcyBhbmQgbGFiZWxzXG4gICAgICAgIHRoaXMucmVtb3ZlR2xvYmFsT3ZlcnZpZXcoKTtcbiAgICAgICAgLy8gUmVkcmF3IHRoZSBjaGFydFxuICAgICAgICB0aGlzLm92ZXJ2aWV3ID0gJ3llYXInO1xuICAgICAgICB0aGlzLmRyYXdDaGFydCgpO1xuICAgICAgfSk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBEcmF3IHllYXIgb3ZlcnZpZXdcbiAgICovXG4gIGRyYXdZZWFyT3ZlcnZpZXcoKSB7XG4gICAgLy8gQWRkIGN1cnJlbnQgb3ZlcnZpZXcgdG8gdGhlIGhpc3RvcnlcbiAgICBpZiAodGhpcy5oaXN0b3J5W3RoaXMuaGlzdG9yeS5sZW5ndGggLSAxXSAhPT0gdGhpcy5vdmVydmlldykge1xuICAgICAgdGhpcy5oaXN0b3J5LnB1c2godGhpcy5vdmVydmlldyk7XG4gICAgfVxuICAgIC8vIERlZmluZSBzdGFydCBhbmQgZW5kIGRhdGUgb2YgdGhlIHNlbGVjdGVkIHllYXJcbiAgICBjb25zdCBzdGFydE9mWWVhcjogTW9tZW50ID0gbW9tZW50KHRoaXMuc2VsZWN0ZWQuZGF0ZSkuc3RhcnRPZigneWVhcicpO1xuICAgIGNvbnN0IGVuZE9mWWVhcjogTW9tZW50ID0gbW9tZW50KHRoaXMuc2VsZWN0ZWQuZGF0ZSkuZW5kT2YoJ3llYXInKTtcbiAgICAvLyBGaWx0ZXIgZGF0YSBkb3duIHRvIHRoZSBzZWxlY3RlZCB5ZWFyXG4gICAgbGV0IHllYXJEYXRhOiBEYXR1bVtdID0gdGhpcy5fZGF0YS5maWx0ZXIoKGQ6IERhdHVtKSA9PiBkLmRhdGUuaXNCZXR3ZWVuKHN0YXJ0T2ZZZWFyLCBlbmRPZlllYXIsIG51bGwsICdbXScpKTtcbiAgICB5ZWFyRGF0YS5mb3JFYWNoKChkOiBEYXR1bSkgPT4ge1xuICAgICAgY29uc3Qgc3VtbWFyeTogU3VtbWFyeVtdID0gW107XG4gICAgICBjb25zdCBncm91cCA9IHRoaXMuZ3JvdXBCeShkLmRldGFpbHMsICduYW1lJyk7XG4gICAgICBPYmplY3Qua2V5cyhncm91cCkuZm9yRWFjaChrID0+IHtcbiAgICAgICAgc3VtbWFyeS5wdXNoKHtcbiAgICAgICAgICBuYW1lOiBrLFxuICAgICAgICAgIHRvdGFsOiBncm91cFtrXS5yZWR1Y2UoKGFjYywgbykgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGFjYyArIG8udmFsdWU7XG4gICAgICAgICAgfSwgMCksXG4gICAgICAgICAgY29sb3I6IGdyb3VwW2tdWzBdLmNvbG9yLFxuICAgICAgICAgIGlkOiBncm91cFtrXVswXS5pZCxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGQuc3VtbWFyeSA9IHN1bW1hcnk7XG4gICAgfSk7XG4gICAgeWVhckRhdGEgPSBHVFNMaWIuY2xlYW5BcnJheSh5ZWFyRGF0YSk7XG4gICAgLy8gQ2FsY3VsYXRlIG1heCB2YWx1ZSBvZiB0aGUgeWVhciBkYXRhXG4gICAgY29uc3QgbWF4VmFsdWUgPSBtYXgoeWVhckRhdGEsIChkOiBEYXR1bSkgPT4gZC50b3RhbCk7XG4gICAgY29uc3QgY29sb3IgPSBzY2FsZUxpbmVhcjxzdHJpbmc+KClcbiAgICAgIC5yYW5nZShbdGhpcy5taW5Db2xvciB8fCBDYWxlbmRhckhlYXRtYXBDb21wb25lbnQuREVGX01JTl9DT0xPUiwgdGhpcy5tYXhDb2xvciB8fCBDYWxlbmRhckhlYXRtYXBDb21wb25lbnQuREVGX01BWF9DT0xPUl0pXG4gICAgICAuZG9tYWluKFstMC4xNSAqIG1heFZhbHVlLCBtYXhWYWx1ZV0pO1xuICAgIHRoaXMuaXRlbXMuc2VsZWN0QWxsKCcuaXRlbS1jaXJjbGUnKS5yZW1vdmUoKTtcbiAgICB0aGlzLml0ZW1zLnNlbGVjdEFsbCgnLml0ZW0tY2lyY2xlJylcbiAgICAgIC5kYXRhKHllYXJEYXRhKVxuICAgICAgLmVudGVyKClcbiAgICAgIC5hcHBlbmQoJ3JlY3QnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2l0ZW0gaXRlbS1jaXJjbGUnKS5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAuYXR0cigneCcsIChkOiBEYXR1bSkgPT4gdGhpcy5jYWxjSXRlbVgoZCwgc3RhcnRPZlllYXIpICsgKHRoaXMuaXRlbVNpemUgLSB0aGlzLmNhbGNJdGVtU2l6ZShkLCBtYXhWYWx1ZSkpIC8gMilcbiAgICAgIC5hdHRyKCd5JywgKGQ6IERhdHVtKSA9PiB0aGlzLmNhbGNJdGVtWShkKSArICh0aGlzLml0ZW1TaXplIC0gdGhpcy5jYWxjSXRlbVNpemUoZCwgbWF4VmFsdWUpKSAvIDIpXG4gICAgICAuYXR0cigncngnLCAoZDogRGF0dW0pID0+IHRoaXMuY2FsY0l0ZW1TaXplKGQsIG1heFZhbHVlKSlcbiAgICAgIC5hdHRyKCdyeScsIChkOiBEYXR1bSkgPT4gdGhpcy5jYWxjSXRlbVNpemUoZCwgbWF4VmFsdWUpKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgKGQ6IERhdHVtKSA9PiB0aGlzLmNhbGNJdGVtU2l6ZShkLCBtYXhWYWx1ZSkpXG4gICAgICAuYXR0cignaGVpZ2h0JywgKGQ6IERhdHVtKSA9PiB0aGlzLmNhbGNJdGVtU2l6ZShkLCBtYXhWYWx1ZSkpXG4gICAgICAuYXR0cignZmlsbCcsIChkOiBEYXR1bSkgPT4gKGQudG90YWwgPiAwKSA/IGNvbG9yKGQudG90YWwpIDogJ3RyYW5zcGFyZW50JylcbiAgICAgIC5vbignY2xpY2snLCAoZDogRGF0dW0pID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaW5UcmFuc2l0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIERvbid0IHRyYW5zaXRpb24gaWYgdGhlcmUgaXMgbm8gZGF0YSB0byBzaG93XG4gICAgICAgIGlmIChkLnRvdGFsID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW5UcmFuc2l0aW9uID0gdHJ1ZTtcbiAgICAgICAgLy8gU2V0IHNlbGVjdGVkIGRhdGUgdG8gdGhlIG9uZSBjbGlja2VkIG9uXG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBkO1xuICAgICAgICAvLyBIaWRlIHRvb2x0aXBcbiAgICAgICAgdGhpcy5oaWRlVG9vbHRpcCgpO1xuICAgICAgICAvLyBSZW1vdmUgYWxsIHllYXIgb3ZlcnZpZXcgcmVsYXRlZCBpdGVtcyBhbmQgbGFiZWxzXG4gICAgICAgIHRoaXMucmVtb3ZlWWVhck92ZXJ2aWV3KCk7XG4gICAgICAgIC8vIFJlZHJhdyB0aGUgY2hhcnRcbiAgICAgICAgdGhpcy5vdmVydmlldyA9ICdkYXknO1xuICAgICAgICB0aGlzLmRyYXdDaGFydCgpO1xuICAgICAgfSlcbiAgICAgIC5vbignbW91c2VvdmVyJywgKGQ6IERhdHVtKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmluVHJhbnNpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBQdWxzYXRpbmcgYW5pbWF0aW9uXG4gICAgICAgIGNvbnN0IGNpcmNsZSA9IHNlbGVjdChldmVudC5jdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgY29uc3QgcmVwZWF0ID0gKCkgPT4ge1xuICAgICAgICAgIGNpcmNsZS50cmFuc2l0aW9uKClcbiAgICAgICAgICAgIC5kdXJhdGlvbih0aGlzLnRyYW5zaXRpb25EdXJhdGlvbilcbiAgICAgICAgICAgIC5lYXNlKGVhc2VMaW5lYXIpXG4gICAgICAgICAgICAuYXR0cigneCcsIChkYXRhOiBEYXR1bSkgPT4gdGhpcy5jYWxjSXRlbVgoZGF0YSwgc3RhcnRPZlllYXIpIC0gKHRoaXMuaXRlbVNpemUgKiAxLjEgLSB0aGlzLml0ZW1TaXplKSAvIDIpXG4gICAgICAgICAgICAuYXR0cigneScsIChkYXRhOiBEYXR1bSkgPT4gdGhpcy5jYWxjSXRlbVkoZGF0YSkgLSAodGhpcy5pdGVtU2l6ZSAqIDEuMSAtIHRoaXMuaXRlbVNpemUpIC8gMilcbiAgICAgICAgICAgIC5hdHRyKCd3aWR0aCcsIHRoaXMuaXRlbVNpemUgKiAxLjEpXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgdGhpcy5pdGVtU2l6ZSAqIDEuMSlcbiAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgIC5kdXJhdGlvbih0aGlzLnRyYW5zaXRpb25EdXJhdGlvbilcbiAgICAgICAgICAgIC5lYXNlKGVhc2VMaW5lYXIpXG4gICAgICAgICAgICAuYXR0cigneCcsIChkYXRhOiBEYXR1bSkgPT4gdGhpcy5jYWxjSXRlbVgoZGF0YSwgc3RhcnRPZlllYXIpICsgKHRoaXMuaXRlbVNpemUgLSB0aGlzLmNhbGNJdGVtU2l6ZShkYXRhLCBtYXhWYWx1ZSkpIC8gMilcbiAgICAgICAgICAgIC5hdHRyKCd5JywgKGRhdGE6IERhdHVtKSA9PiB0aGlzLmNhbGNJdGVtWShkYXRhKSArICh0aGlzLml0ZW1TaXplIC0gdGhpcy5jYWxjSXRlbVNpemUoZGF0YSwgbWF4VmFsdWUpKSAvIDIpXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCAoZGF0YTogRGF0dW0pID0+IHRoaXMuY2FsY0l0ZW1TaXplKGRhdGEsIG1heFZhbHVlKSlcbiAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCAoZGF0YTogRGF0dW0pID0+IHRoaXMuY2FsY0l0ZW1TaXplKGRhdGEsIG1heFZhbHVlKSlcbiAgICAgICAgICAgIC5vbignZW5kJywgcmVwZWF0KTtcbiAgICAgICAgfTtcbiAgICAgICAgcmVwZWF0KCk7XG4gICAgICAgIC8vIENvbnN0cnVjdCB0b29sdGlwXG4gICAgICAgIC8vIENhbGN1bGF0ZSB0b29sdGlwIHBvc2l0aW9uXG4gICAgICAgIGxldCB4ID0gdGhpcy5jYWxjSXRlbVgoZCwgc3RhcnRPZlllYXIpICsgdGhpcy5pdGVtU2l6ZSAvIDI7XG4gICAgICAgIGlmICh0aGlzLmdXaWR0aCAtIHggPCAodGhpcy50b29sdGlwV2lkdGggKyB0aGlzLnRvb2x0aXBQYWRkaW5nICogMykpIHtcbiAgICAgICAgICB4IC09IHRoaXMudG9vbHRpcFdpZHRoICsgdGhpcy50b29sdGlwUGFkZGluZyAqIDI7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgeSA9IHRoaXMuY2FsY0l0ZW1ZKGQpICsgdGhpcy5pdGVtU2l6ZSAvIDI7XG4gICAgICAgIC8vIFNob3cgdG9vbHRpcFxuICAgICAgICB0aGlzLnRvb2x0aXAuaHRtbCh0aGlzLmdldFRvb2x0aXAoZCkpXG4gICAgICAgICAgLnN0eWxlKCdsZWZ0JywgeCArICdweCcpXG4gICAgICAgICAgLnN0eWxlKCd0b3AnLCB5ICsgJ3B4JylcbiAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgLmR1cmF0aW9uKHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uIC8gMilcbiAgICAgICAgICAuZWFzZShlYXNlTGluZWFyKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpO1xuICAgICAgfSlcbiAgICAgIC5vbignbW91c2VvdXQnLCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmluVHJhbnNpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBTZXQgY2lyY2xlIHJhZGl1cyBiYWNrIHRvIHdoYXQgaXQncyBzdXBwb3NlZCB0byBiZVxuICAgICAgICBzZWxlY3QoZXZlbnQuY3VycmVudFRhcmdldCkudHJhbnNpdGlvbigpXG4gICAgICAgICAgLmR1cmF0aW9uKHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uIC8gMilcbiAgICAgICAgICAuZWFzZShlYXNlTGluZWFyKVxuICAgICAgICAgIC5hdHRyKCd4JywgKGQ6IERhdHVtKSA9PiB0aGlzLmNhbGNJdGVtWChkLCBzdGFydE9mWWVhcikgKyAodGhpcy5pdGVtU2l6ZSAtIHRoaXMuY2FsY0l0ZW1TaXplKGQsIG1heFZhbHVlKSkgLyAyKVxuICAgICAgICAgIC5hdHRyKCd5JywgKGQ6IERhdHVtKSA9PiB0aGlzLmNhbGNJdGVtWShkKSArICh0aGlzLml0ZW1TaXplIC0gdGhpcy5jYWxjSXRlbVNpemUoZCwgbWF4VmFsdWUpKSAvIDIpXG4gICAgICAgICAgLmF0dHIoJ3dpZHRoJywgKGQ6IERhdHVtKSA9PiB0aGlzLmNhbGNJdGVtU2l6ZShkLCBtYXhWYWx1ZSkpXG4gICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIChkOiBEYXR1bSkgPT4gdGhpcy5jYWxjSXRlbVNpemUoZCwgbWF4VmFsdWUpKTtcbiAgICAgICAgLy8gSGlkZSB0b29sdGlwXG4gICAgICAgIHRoaXMuaGlkZVRvb2x0aXAoKTtcbiAgICAgIH0pXG4gICAgICAudHJhbnNpdGlvbigpXG4gICAgICAuZGVsYXkoKCkgPT4gKE1hdGguY29zKE1hdGguUEkgKiBNYXRoLnJhbmRvbSgpKSArIDEpICogdGhpcy50cmFuc2l0aW9uRHVyYXRpb24pXG4gICAgICAuZHVyYXRpb24oKCkgPT4gdGhpcy50cmFuc2l0aW9uRHVyYXRpb24pXG4gICAgICAuZWFzZShlYXNlTGluZWFyKVxuICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMSlcbiAgICAgIC5jYWxsKCh0cmFuc2l0aW9uOiBhbnksIGNhbGxiYWNrOiBhbnkpID0+IHtcbiAgICAgICAgaWYgKHRyYW5zaXRpb24uZW1wdHkoKSkge1xuICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IG4gPSAwO1xuICAgICAgICB0cmFuc2l0aW9uLmVhY2goKCkgPT4gKytuKS5vbignZW5kJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKCEtLW4pIHtcbiAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0sICgpID0+IHRoaXMuaW5UcmFuc2l0aW9uID0gZmFsc2UpO1xuICAgIC8vIEFkZCBtb250aCBsYWJlbHNcbiAgICBjb25zdCBkdXJhdGlvbiA9IE1hdGguY2VpbChtb21lbnQuZHVyYXRpb24oZW5kT2ZZZWFyLmRpZmYoc3RhcnRPZlllYXIpKS5hc01vbnRocygpKTtcbiAgICBjb25zdCBtb250aExhYmVsczogTW9tZW50W10gPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IGR1cmF0aW9uOyBpKyspIHtcbiAgICAgIG1vbnRoTGFiZWxzLnB1c2gobW9tZW50KHRoaXMuc2VsZWN0ZWQuZGF0ZSkubW9udGgoKHN0YXJ0T2ZZZWFyLm1vbnRoKCkgKyBpKSAlIDEyKS5zdGFydE9mKCdtb250aCcpKTtcbiAgICB9XG4gICAgY29uc3QgbW9udGhTY2FsZSA9IHNjYWxlTGluZWFyKCkucmFuZ2UoWzAsIHRoaXMuZ1dpZHRoXSkuZG9tYWluKFswLCBtb250aExhYmVscy5sZW5ndGhdKTtcbiAgICB0aGlzLmxhYmVscy5zZWxlY3RBbGwoJy5sYWJlbC1tb250aCcpLnJlbW92ZSgpO1xuICAgIHRoaXMubGFiZWxzLnNlbGVjdEFsbCgnLmxhYmVsLW1vbnRoJylcbiAgICAgIC5kYXRhKG1vbnRoTGFiZWxzKVxuICAgICAgLmVudGVyKClcbiAgICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xhYmVsIGxhYmVsLW1vbnRoJylcbiAgICAgIC5hdHRyKCdmb250LXNpemUnLCAoKSA9PiBNYXRoLmZsb29yKHRoaXMubGFiZWxQYWRkaW5nIC8gMykgKyAncHgnKVxuICAgICAgLnRleHQoKGQ6IE1vbWVudCkgPT4gZC5mb3JtYXQoJ01NTScpKVxuICAgICAgLmF0dHIoJ3gnLCAoZDogTW9tZW50LCBpOiBudW1iZXIpID0+IG1vbnRoU2NhbGUoaSkgKyAobW9udGhTY2FsZShpKSAtIG1vbnRoU2NhbGUoaSAtIDEpKSAvIDIpXG4gICAgICAuYXR0cigneScsIHRoaXMubGFiZWxQYWRkaW5nIC8gMilcbiAgICAgIC5vbignbW91c2VlbnRlcicsIChkOiBNb21lbnQpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaW5UcmFuc2l0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNlbGVjdGVkTW9udGggPSBtb21lbnQoZCk7XG4gICAgICAgIHRoaXMuaXRlbXMuc2VsZWN0QWxsKCcuaXRlbS1jaXJjbGUnKVxuICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAuZHVyYXRpb24odGhpcy50cmFuc2l0aW9uRHVyYXRpb24pXG4gICAgICAgICAgLmVhc2UoZWFzZUxpbmVhcilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAoZGF0YTogRGF0dW0pID0+IG1vbWVudChkYXRhLmRhdGUpLmlzU2FtZShzZWxlY3RlZE1vbnRoLCAnbW9udGgnKSA/IDEgOiAwLjEpO1xuICAgICAgfSlcbiAgICAgIC5vbignbW91c2VvdXQnLCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmluVHJhbnNpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLml0ZW1zLnNlbGVjdEFsbCgnLml0ZW0tY2lyY2xlJylcbiAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgLmR1cmF0aW9uKHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uKVxuICAgICAgICAgIC5lYXNlKGVhc2VMaW5lYXIpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMSk7XG4gICAgICB9KVxuICAgICAgLm9uKCdjbGljaycsIChkOiBNb21lbnQpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaW5UcmFuc2l0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIENoZWNrIG1vbnRoIGRhdGFcbiAgICAgICAgY29uc3QgbW9udGhEYXRhID0gdGhpcy5fZGF0YS5maWx0ZXIoKGU6IERhdHVtKSA9PiBlLmRhdGUuaXNCZXR3ZWVuKFxuICAgICAgICAgIG1vbWVudChkKS5zdGFydE9mKCdtb250aCcpLFxuICAgICAgICAgIG1vbWVudChkKS5lbmRPZignbW9udGgnKSxcbiAgICAgICAgICBudWxsLCAnW10nXG4gICAgICAgICkpO1xuICAgICAgICAvLyBEb24ndCB0cmFuc2l0aW9uIGlmIHRoZXJlIGlzIG5vIGRhdGEgdG8gc2hvd1xuICAgICAgICBpZiAoIW1vbnRoRGF0YS5sZW5ndGgpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gU2V0IHNlbGVjdGVkIG1vbnRoIHRvIHRoZSBvbmUgY2xpY2tlZCBvblxuICAgICAgICB0aGlzLnNlbGVjdGVkID0ge2RhdGU6IGR9O1xuICAgICAgICB0aGlzLmluVHJhbnNpdGlvbiA9IHRydWU7XG4gICAgICAgIC8vIEhpZGUgdG9vbHRpcFxuICAgICAgICB0aGlzLmhpZGVUb29sdGlwKCk7XG4gICAgICAgIC8vIFJlbW92ZSBhbGwgeWVhciBvdmVydmlldyByZWxhdGVkIGl0ZW1zIGFuZCBsYWJlbHNcbiAgICAgICAgdGhpcy5yZW1vdmVZZWFyT3ZlcnZpZXcoKTtcbiAgICAgICAgLy8gUmVkcmF3IHRoZSBjaGFydFxuICAgICAgICB0aGlzLm92ZXJ2aWV3ID0gJ21vbnRoJztcbiAgICAgICAgdGhpcy5kcmF3Q2hhcnQoKTtcbiAgICAgIH0pO1xuXG4gICAgLy8gQWRkIGRheSBsYWJlbHNcbiAgICBjb25zdCBkYXlMYWJlbHM6IERhdGVbXSA9IHRpbWVEYXlzKFxuICAgICAgbW9tZW50LnV0YygpLnN0YXJ0T2YoJ3dlZWsnKS50b0RhdGUoKSxcbiAgICAgIG1vbWVudC51dGMoKS5lbmRPZignd2VlaycpLnRvRGF0ZSgpXG4gICAgKTtcbiAgICBjb25zdCBkYXlTY2FsZSA9IHNjYWxlQmFuZCgpXG4gICAgICAucmFuZ2VSb3VuZChbdGhpcy5sYWJlbFBhZGRpbmcsIHRoaXMuZ0hlaWdodF0pXG4gICAgICAuZG9tYWluKGRheUxhYmVscy5tYXAoKGQ6IERhdGUpID0+IG1vbWVudC51dGMoZCkud2Vla2RheSgpLnRvU3RyaW5nKCkpKTtcbiAgICB0aGlzLmxhYmVscy5zZWxlY3RBbGwoJy5sYWJlbC1kYXknKS5yZW1vdmUoKTtcbiAgICB0aGlzLmxhYmVscy5zZWxlY3RBbGwoJy5sYWJlbC1kYXknKVxuICAgICAgLmRhdGEoZGF5TGFiZWxzKVxuICAgICAgLmVudGVyKClcbiAgICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xhYmVsIGxhYmVsLWRheScpXG4gICAgICAuYXR0cigneCcsIHRoaXMubGFiZWxQYWRkaW5nIC8gMylcbiAgICAgIC5hdHRyKCd5JywgKGQ6IERhdGUsIGk6IG51bWJlcikgPT4gZGF5U2NhbGUoaS50b1N0cmluZygpKSArIGRheVNjYWxlLmJhbmR3aWR0aCgpIC8gMS43NSlcbiAgICAgIC5zdHlsZSgndGV4dC1hbmNob3InLCAnbGVmdCcpXG4gICAgICAuYXR0cignZm9udC1zaXplJywgKCkgPT4gTWF0aC5mbG9vcih0aGlzLmxhYmVsUGFkZGluZyAvIDMpICsgJ3B4JylcbiAgICAgIC50ZXh0KChkOiBEYXRlKSA9PiBtb21lbnQudXRjKGQpLmZvcm1hdCgnZGRkZCcpWzBdKVxuICAgICAgLm9uKCdtb3VzZWVudGVyJywgKGQ6IERhdGUpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaW5UcmFuc2l0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNlbGVjdGVkRGF5ID0gbW9tZW50LnV0YyhkKTtcbiAgICAgICAgdGhpcy5pdGVtcy5zZWxlY3RBbGwoJy5pdGVtLWNpcmNsZScpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgIC5kdXJhdGlvbih0aGlzLnRyYW5zaXRpb25EdXJhdGlvbilcbiAgICAgICAgICAuZWFzZShlYXNlTGluZWFyKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIChkYXRhOiBEYXR1bSkgPT4gKG1vbWVudChkYXRhLmRhdGUpLmRheSgpID09PSBzZWxlY3RlZERheS5kYXkoKSkgPyAxIDogMC4xKTtcbiAgICAgIH0pXG4gICAgICAub24oJ21vdXNlb3V0JywgKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5pblRyYW5zaXRpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pdGVtcy5zZWxlY3RBbGwoJy5pdGVtLWNpcmNsZScpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgIC5kdXJhdGlvbih0aGlzLnRyYW5zaXRpb25EdXJhdGlvbilcbiAgICAgICAgICAuZWFzZShlYXNlTGluZWFyKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpO1xuICAgICAgfSk7XG4gICAgLy8gQWRkIGJ1dHRvbiB0byBzd2l0Y2ggYmFjayB0byBwcmV2aW91cyBvdmVydmlld1xuICAgIHRoaXMuZHJhd0J1dHRvbigpO1xuICB9XG5cbiAgZHJhd01vbnRoT3ZlcnZpZXcoKSB7XG4gICAgLy8gQWRkIGN1cnJlbnQgb3ZlcnZpZXcgdG8gdGhlIGhpc3RvcnlcbiAgICBpZiAodGhpcy5oaXN0b3J5W3RoaXMuaGlzdG9yeS5sZW5ndGggLSAxXSAhPT0gdGhpcy5vdmVydmlldykge1xuICAgICAgdGhpcy5oaXN0b3J5LnB1c2godGhpcy5vdmVydmlldyk7XG4gICAgfVxuICAgIC8vIERlZmluZSBiZWdpbm5pbmcgYW5kIGVuZCBvZiB0aGUgbW9udGhcbiAgICBjb25zdCBzdGFydE9mTW9udGg6IE1vbWVudCA9IG1vbWVudCh0aGlzLnNlbGVjdGVkLmRhdGUpLnN0YXJ0T2YoJ21vbnRoJyk7XG4gICAgY29uc3QgZW5kT2ZNb250aDogTW9tZW50ID0gbW9tZW50KHRoaXMuc2VsZWN0ZWQuZGF0ZSkuZW5kT2YoJ21vbnRoJyk7XG4gICAgLy8gRmlsdGVyIGRhdGEgZG93biB0byB0aGUgc2VsZWN0ZWQgbW9udGhcbiAgICBsZXQgbW9udGhEYXRhOiBEYXR1bVtdID0gW107XG4gICAgdGhpcy5fZGF0YS5maWx0ZXIoKGRhdGE6IERhdHVtKSA9PiBkYXRhLmRhdGUuaXNCZXR3ZWVuKHN0YXJ0T2ZNb250aCwgZW5kT2ZNb250aCwgbnVsbCwgJ1tdJykpXG4gICAgICAubWFwKChkOiBEYXR1bSkgPT4ge1xuICAgICAgICBjb25zdCBzY2FsZTogRGF0dW1bXSA9IFtdO1xuICAgICAgICBkLmRldGFpbHMuZm9yRWFjaCgoZGV0OiBEZXRhaWwpID0+IHtcbiAgICAgICAgICBjb25zdCBkYXRlOiBNb21lbnQgPSBtb21lbnQudXRjKGRldC5kYXRlKTtcbiAgICAgICAgICBjb25zdCBpID0gTWF0aC5mbG9vcihkYXRlLmhvdXJzKCkgLyAzKTtcbiAgICAgICAgICBpZiAoIXNjYWxlW2ldKSB7XG4gICAgICAgICAgICBzY2FsZVtpXSA9IHtcbiAgICAgICAgICAgICAgZGF0ZTogZGF0ZS5zdGFydE9mKCdob3VyJyksXG4gICAgICAgICAgICAgIHRvdGFsOiAwLFxuICAgICAgICAgICAgICBkZXRhaWxzOiBbXSxcbiAgICAgICAgICAgICAgc3VtbWFyeTogW11cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICAgIHNjYWxlW2ldLnRvdGFsICs9IGRldC52YWx1ZTtcbiAgICAgICAgICBzY2FsZVtpXS5kZXRhaWxzLnB1c2goZGV0KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHNjYWxlLmZvckVhY2goKHM6IERhdHVtKSA9PiB7XG4gICAgICAgICAgY29uc3QgZ3JvdXAgPSB0aGlzLmdyb3VwQnkocy5kZXRhaWxzLCAnbmFtZScpO1xuICAgICAgICAgIE9iamVjdC5rZXlzKGdyb3VwKS5mb3JFYWNoKChrOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIHMuc3VtbWFyeS5wdXNoKHtcbiAgICAgICAgICAgICAgbmFtZTogayxcbiAgICAgICAgICAgICAgdG90YWw6IHN1bShncm91cFtrXSwgKGRhdGE6IGFueSkgPT4gZGF0YS50b3RhbCksXG4gICAgICAgICAgICAgIGNvbG9yOiBncm91cFtrXVswXS5jb2xvclxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBtb250aERhdGEgPSBtb250aERhdGEuY29uY2F0KHNjYWxlKTtcbiAgICAgIH0pO1xuICAgIG1vbnRoRGF0YSA9IEdUU0xpYi5jbGVhbkFycmF5KG1vbnRoRGF0YSk7XG4gICAgdGhpcy5MT0cuZGVidWcoWydkcmF3TW9udGhPdmVydmlldyddLCBbdGhpcy5vdmVydmlldywgdGhpcy5zZWxlY3RlZCwgbW9udGhEYXRhXSk7XG4gICAgY29uc3QgbWF4VmFsdWU6IG51bWJlciA9IG1heChtb250aERhdGEsIChkOiBhbnkpID0+IGQudG90YWwpO1xuICAgIC8vIERlZmluZSBkYXkgbGFiZWxzIGFuZCBheGlzXG4gICAgY29uc3QgZGF5TGFiZWxzOiBEYXRlW10gPSB0aW1lRGF5cyhcbiAgICAgIG1vbWVudCh0aGlzLnNlbGVjdGVkLmRhdGUpLnN0YXJ0T2YoJ3dlZWsnKS50b0RhdGUoKSxcbiAgICAgIG1vbWVudCh0aGlzLnNlbGVjdGVkLmRhdGUpLmVuZE9mKCd3ZWVrJykudG9EYXRlKClcbiAgICApO1xuICAgIGNvbnN0IGRheVNjYWxlID0gc2NhbGVCYW5kKClcbiAgICAgIC5yYW5nZVJvdW5kKFt0aGlzLmxhYmVsUGFkZGluZywgdGhpcy5nSGVpZ2h0XSlcbiAgICAgIC5kb21haW4oZGF5TGFiZWxzLm1hcCgoZDogRGF0ZSkgPT4gbW9tZW50LnV0YyhkKS53ZWVrZGF5KCkudG9TdHJpbmcoKSkpO1xuXG4gICAgLy8gRGVmaW5lIHdlZWsgbGFiZWxzIGFuZCBheGlzXG4gICAgY29uc3Qgd2Vla0xhYmVsczogTW9tZW50W10gPSBbc3RhcnRPZk1vbnRoXTtcbiAgICBjb25zdCBpbmNXZWVrID0gbW9tZW50KHN0YXJ0T2ZNb250aCk7XG4gICAgd2hpbGUgKGluY1dlZWsud2VlaygpICE9PSBlbmRPZk1vbnRoLndlZWsoKSkge1xuICAgICAgd2Vla0xhYmVscy5wdXNoKG1vbWVudChpbmNXZWVrLmFkZCgxLCAnd2VlaycpKSk7XG4gICAgfVxuICAgIG1vbnRoRGF0YS5mb3JFYWNoKChkOiBEYXR1bSkgPT4ge1xuICAgICAgY29uc3Qgc3VtbWFyeSA9IFtdO1xuICAgICAgY29uc3QgZ3JvdXAgPSB0aGlzLmdyb3VwQnkoZC5kZXRhaWxzLCAnbmFtZScpO1xuICAgICAgT2JqZWN0LmtleXMoZ3JvdXApLmZvckVhY2goKGs6IHN0cmluZykgPT4ge1xuICAgICAgICBzdW1tYXJ5LnB1c2goe1xuICAgICAgICAgIG5hbWU6IGssXG4gICAgICAgICAgdG90YWw6IGdyb3VwW2tdLnJlZHVjZSgoYWNjLCBvKSA9PiBhY2MgKyBvLnZhbHVlLCAwKSxcbiAgICAgICAgICBjb2xvcjogZ3JvdXBba11bMF0uY29sb3IsXG4gICAgICAgICAgaWQ6IGdyb3VwW2tdWzBdLmlkLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgZC5zdW1tYXJ5ID0gc3VtbWFyeTtcbiAgICB9KTtcbiAgICBjb25zdCB3ZWVrU2NhbGUgPSBzY2FsZUJhbmQoKVxuICAgICAgLnJhbmdlUm91bmQoW3RoaXMubGFiZWxQYWRkaW5nLCB0aGlzLmdXaWR0aF0pXG4gICAgICAucGFkZGluZygwLjA1KVxuICAgICAgLmRvbWFpbih3ZWVrTGFiZWxzLm1hcCgod2Vla2RheSkgPT4gd2Vla2RheS53ZWVrKCkgKyAnJykpO1xuICAgIGNvbnN0IGNvbG9yID0gc2NhbGVMaW5lYXI8c3RyaW5nPigpXG4gICAgICAucmFuZ2UoW3RoaXMubWluQ29sb3IgfHwgQ2FsZW5kYXJIZWF0bWFwQ29tcG9uZW50LkRFRl9NSU5fQ09MT1IsIHRoaXMubWF4Q29sb3IgfHwgQ2FsZW5kYXJIZWF0bWFwQ29tcG9uZW50LkRFRl9NQVhfQ09MT1JdKVxuICAgICAgLmRvbWFpbihbLTAuMTUgKiBtYXhWYWx1ZSwgbWF4VmFsdWVdKTtcbiAgICAvLyBBZGQgbW9udGggZGF0YSBpdGVtcyB0byB0aGUgb3ZlcnZpZXdcbiAgICB0aGlzLml0ZW1zLnNlbGVjdEFsbCgnLml0ZW0tYmxvY2stbW9udGgnKS5yZW1vdmUoKTtcbiAgICB0aGlzLml0ZW1zLnNlbGVjdEFsbCgnLml0ZW0tYmxvY2stbW9udGgnKVxuICAgICAgLmRhdGEobW9udGhEYXRhKVxuICAgICAgLmVudGVyKCkuYXBwZW5kKCdyZWN0JylcbiAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAuYXR0cignY2xhc3MnLCAnaXRlbSBpdGVtLWJsb2NrLW1vbnRoJylcbiAgICAgIC5hdHRyKCd5JywgKGQ6IERhdHVtKSA9PiB0aGlzLmNhbGNJdGVtWShkKVxuICAgICAgICArICh0aGlzLml0ZW1TaXplIC0gdGhpcy5jYWxjSXRlbVNpemUoZCwgbWF4VmFsdWUpKSAvIDIpXG4gICAgICAuYXR0cigneCcsIChkOiBEYXR1bSkgPT4gdGhpcy5jYWxjSXRlbVhNb250aChkLCBzdGFydE9mTW9udGgsIHdlZWtTY2FsZShkLmRhdGUud2VlaygpLnRvU3RyaW5nKCkpKVxuICAgICAgICArICh0aGlzLml0ZW1TaXplIC0gdGhpcy5jYWxjSXRlbVNpemUoZCwgbWF4VmFsdWUpKSAvIDIpXG4gICAgICAuYXR0cigncngnLCAoZDogRGF0dW0pID0+IHRoaXMuY2FsY0l0ZW1TaXplKGQsIG1heFZhbHVlKSlcbiAgICAgIC5hdHRyKCdyeScsIChkOiBEYXR1bSkgPT4gdGhpcy5jYWxjSXRlbVNpemUoZCwgbWF4VmFsdWUpKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgKGQ6IERhdHVtKSA9PiB0aGlzLmNhbGNJdGVtU2l6ZShkLCBtYXhWYWx1ZSkpXG4gICAgICAuYXR0cignaGVpZ2h0JywgKGQ6IERhdHVtKSA9PiB0aGlzLmNhbGNJdGVtU2l6ZShkLCBtYXhWYWx1ZSkpXG4gICAgICAuYXR0cignZmlsbCcsIChkOiBEYXR1bSkgPT4gKGQudG90YWwgPiAwKSA/IGNvbG9yKGQudG90YWwpIDogJ3RyYW5zcGFyZW50JylcbiAgICAgIC5vbignY2xpY2snLCAoZDogRGF0dW0pID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaW5UcmFuc2l0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIERvbid0IHRyYW5zaXRpb24gaWYgdGhlcmUgaXMgbm8gZGF0YSB0byBzaG93XG4gICAgICAgIGlmIChkLnRvdGFsID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW5UcmFuc2l0aW9uID0gdHJ1ZTtcbiAgICAgICAgLy8gU2V0IHNlbGVjdGVkIGRhdGUgdG8gdGhlIG9uZSBjbGlja2VkIG9uXG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBkO1xuICAgICAgICAvLyBIaWRlIHRvb2x0aXBcbiAgICAgICAgdGhpcy5oaWRlVG9vbHRpcCgpO1xuICAgICAgICAvLyBSZW1vdmUgYWxsIG1vbnRoIG92ZXJ2aWV3IHJlbGF0ZWQgaXRlbXMgYW5kIGxhYmVsc1xuICAgICAgICB0aGlzLnJlbW92ZU1vbnRoT3ZlcnZpZXcoKTtcbiAgICAgICAgLy8gUmVkcmF3IHRoZSBjaGFydFxuICAgICAgICB0aGlzLm92ZXJ2aWV3ID0gJ2RheSc7XG4gICAgICAgIHRoaXMuZHJhd0NoYXJ0KCk7XG4gICAgICB9KVxuICAgICAgLm9uKCdtb3VzZW92ZXInLCAoZDogRGF0dW0pID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaW5UcmFuc2l0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIENvbnN0cnVjdCB0b29sdGlwXG4gICAgICAgIC8vIENhbGN1bGF0ZSB0b29sdGlwIHBvc2l0aW9uXG4gICAgICAgIGxldCB4ID0gd2Vla1NjYWxlKGQuZGF0ZS53ZWVrKCkudG9TdHJpbmcoKSkgKyB0aGlzLnRvb2x0aXBQYWRkaW5nO1xuICAgICAgICB3aGlsZSAodGhpcy5nV2lkdGggLSB4IDwgKHRoaXMudG9vbHRpcFdpZHRoICsgdGhpcy50b29sdGlwUGFkZGluZyAqIDMpKSB7XG4gICAgICAgICAgeCAtPSAxMDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB5ID0gZGF5U2NhbGUoZC5kYXRlLndlZWtkYXkoKS50b1N0cmluZygpKSArIHRoaXMudG9vbHRpcFBhZGRpbmc7XG4gICAgICAgIC8vIFNob3cgdG9vbHRpcFxuICAgICAgICB0aGlzLnRvb2x0aXAuaHRtbCh0aGlzLmdldFRvb2x0aXAoZCkpXG4gICAgICAgICAgLnN0eWxlKCdsZWZ0JywgeCArICdweCcpXG4gICAgICAgICAgLnN0eWxlKCd0b3AnLCB5ICsgJ3B4JylcbiAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgLmR1cmF0aW9uKHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uIC8gMilcbiAgICAgICAgICAuZWFzZShlYXNlTGluZWFyKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpO1xuICAgICAgfSlcbiAgICAgIC5vbignbW91c2VvdXQnLCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmluVHJhbnNpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmhpZGVUb29sdGlwKCk7XG4gICAgICB9KVxuICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgLmRlbGF5KCgpID0+IChNYXRoLmNvcyhNYXRoLlBJICogTWF0aC5yYW5kb20oKSkgKyAxKSAqIHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uKVxuICAgICAgLmR1cmF0aW9uKCgpID0+IHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uKVxuICAgICAgLmVhc2UoZWFzZUxpbmVhcilcbiAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpXG4gICAgICAuY2FsbCgodHJhbnNpdGlvbjogYW55LCBjYWxsYmFjazogYW55KSA9PiB7XG4gICAgICAgIGlmICh0cmFuc2l0aW9uLmVtcHR5KCkpIHtcbiAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBuID0gMDtcbiAgICAgICAgdHJhbnNpdGlvbi5lYWNoKCgpID0+ICsrbikub24oJ2VuZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmICghLS1uKSB7XG4gICAgICAgICAgICBjYWxsYmFjay5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9LCAoKSA9PiB0aGlzLmluVHJhbnNpdGlvbiA9IGZhbHNlKTtcbiAgICAvLyBBZGQgd2VlayBsYWJlbHNcbiAgICB0aGlzLmxhYmVscy5zZWxlY3RBbGwoJy5sYWJlbC13ZWVrJykucmVtb3ZlKCk7XG4gICAgdGhpcy5sYWJlbHMuc2VsZWN0QWxsKCcubGFiZWwtd2VlaycpXG4gICAgICAuZGF0YSh3ZWVrTGFiZWxzKVxuICAgICAgLmVudGVyKClcbiAgICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xhYmVsIGxhYmVsLXdlZWsnKVxuICAgICAgLmF0dHIoJ2ZvbnQtc2l6ZScsICgpID0+IE1hdGguZmxvb3IodGhpcy5sYWJlbFBhZGRpbmcgLyAzKSArICdweCcpXG4gICAgICAudGV4dCgoZDogTW9tZW50KSA9PiAnV2VlayAnICsgZC53ZWVrKCkpXG4gICAgICAuYXR0cigneCcsIChkOiBNb21lbnQpID0+IHdlZWtTY2FsZShkLndlZWsoKS50b1N0cmluZygpKSlcbiAgICAgIC5hdHRyKCd5JywgdGhpcy5sYWJlbFBhZGRpbmcgLyAyKVxuICAgICAgLm9uKCdtb3VzZWVudGVyJywgKHdlZWtkYXk6IE1vbWVudCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5pblRyYW5zaXRpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pdGVtcy5zZWxlY3RBbGwoJy5pdGVtLWJsb2NrLW1vbnRoJylcbiAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgLmR1cmF0aW9uKHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uKVxuICAgICAgICAgIC5lYXNlKGVhc2VMaW5lYXIpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgKGQ6IERhdHVtKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKG1vbWVudChkLmRhdGUpLndlZWsoKSA9PT0gd2Vla2RheS53ZWVrKCkpID8gMSA6IDAuMTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pXG4gICAgICAub24oJ21vdXNlb3V0JywgKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5pblRyYW5zaXRpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pdGVtcy5zZWxlY3RBbGwoJy5pdGVtLWJsb2NrLW1vbnRoJylcbiAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgLmR1cmF0aW9uKHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uKVxuICAgICAgICAgIC5lYXNlKGVhc2VMaW5lYXIpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMSk7XG4gICAgICB9KVxuICAgICAgLm9uKCdjbGljaycsIChkOiBNb21lbnQpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaW5UcmFuc2l0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW5UcmFuc2l0aW9uID0gdHJ1ZTtcbiAgICAgICAgLy8gU2V0IHNlbGVjdGVkIG1vbnRoIHRvIHRoZSBvbmUgY2xpY2tlZCBvblxuICAgICAgICB0aGlzLnNlbGVjdGVkID0ge2RhdGU6IGR9O1xuICAgICAgICAvLyBIaWRlIHRvb2x0aXBcbiAgICAgICAgdGhpcy5oaWRlVG9vbHRpcCgpO1xuICAgICAgICAvLyBSZW1vdmUgYWxsIHllYXIgb3ZlcnZpZXcgcmVsYXRlZCBpdGVtcyBhbmQgbGFiZWxzXG4gICAgICAgIHRoaXMucmVtb3ZlTW9udGhPdmVydmlldygpO1xuICAgICAgICAvLyBSZWRyYXcgdGhlIGNoYXJ0XG4gICAgICAgIHRoaXMub3ZlcnZpZXcgPSAnd2Vlayc7XG4gICAgICAgIHRoaXMuZHJhd0NoYXJ0KCk7XG4gICAgICB9KTtcbiAgICAvLyBBZGQgZGF5IGxhYmVsc1xuICAgIHRoaXMubGFiZWxzLnNlbGVjdEFsbCgnLmxhYmVsLWRheScpLnJlbW92ZSgpO1xuICAgIHRoaXMubGFiZWxzLnNlbGVjdEFsbCgnLmxhYmVsLWRheScpXG4gICAgICAuZGF0YShkYXlMYWJlbHMpXG4gICAgICAuZW50ZXIoKVxuICAgICAgLmFwcGVuZCgndGV4dCcpXG4gICAgICAuYXR0cignY2xhc3MnLCAnbGFiZWwgbGFiZWwtZGF5JylcbiAgICAgIC5hdHRyKCd4JywgdGhpcy5sYWJlbFBhZGRpbmcgLyAzKVxuICAgICAgLmF0dHIoJ3knLCAoZDogRGF0ZSwgaTogYW55KSA9PiBkYXlTY2FsZShpKSArIGRheVNjYWxlLmJhbmR3aWR0aCgpIC8gMS43NSlcbiAgICAgIC5zdHlsZSgndGV4dC1hbmNob3InLCAnbGVmdCcpXG4gICAgICAuYXR0cignZm9udC1zaXplJywgKCkgPT4gTWF0aC5mbG9vcih0aGlzLmxhYmVsUGFkZGluZyAvIDMpICsgJ3B4JylcbiAgICAgIC50ZXh0KChkOiBEYXRlKSA9PiBtb21lbnQudXRjKGQpLmZvcm1hdCgnZGRkZCcpWzBdKVxuICAgICAgLm9uKCdtb3VzZWVudGVyJywgKGQ6IERhdGUpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaW5UcmFuc2l0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNlbGVjdGVkRGF5ID0gbW9tZW50LnV0YyhkKTtcbiAgICAgICAgdGhpcy5pdGVtcy5zZWxlY3RBbGwoJy5pdGVtLWJsb2NrLW1vbnRoJylcbiAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgLmR1cmF0aW9uKHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uKVxuICAgICAgICAgIC5lYXNlKGVhc2VMaW5lYXIpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgKGRhdGE6IERhdHVtKSA9PiAobW9tZW50KGRhdGEuZGF0ZSkuZGF5KCkgPT09IHNlbGVjdGVkRGF5LmRheSgpKSA/IDEgOiAwLjEpO1xuICAgICAgfSlcbiAgICAgIC5vbignbW91c2VvdXQnLCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmluVHJhbnNpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLml0ZW1zLnNlbGVjdEFsbCgnLml0ZW0tYmxvY2stbW9udGgnKVxuICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAuZHVyYXRpb24odGhpcy50cmFuc2l0aW9uRHVyYXRpb24pXG4gICAgICAgICAgLmVhc2UoZWFzZUxpbmVhcilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKTtcbiAgICAgIH0pO1xuICAgIC8vIEFkZCBidXR0b24gdG8gc3dpdGNoIGJhY2sgdG8gcHJldmlvdXMgb3ZlcnZpZXdcbiAgICB0aGlzLmRyYXdCdXR0b24oKTtcbiAgfVxuXG4gIGRyYXdXZWVrT3ZlcnZpZXcoKSB7XG4gICAgLy8gQWRkIGN1cnJlbnQgb3ZlcnZpZXcgdG8gdGhlIGhpc3RvcnlcbiAgICBpZiAodGhpcy5oaXN0b3J5W3RoaXMuaGlzdG9yeS5sZW5ndGggLSAxXSAhPT0gdGhpcy5vdmVydmlldykge1xuICAgICAgdGhpcy5oaXN0b3J5LnB1c2godGhpcy5vdmVydmlldyk7XG4gICAgfVxuICAgIC8vIERlZmluZSBiZWdpbm5pbmcgYW5kIGVuZCBvZiB0aGUgd2Vla1xuICAgIGNvbnN0IHN0YXJ0T2ZXZWVrOiBNb21lbnQgPSBtb21lbnQodGhpcy5zZWxlY3RlZC5kYXRlKS5zdGFydE9mKCd3ZWVrJyk7XG4gICAgY29uc3QgZW5kT2ZXZWVrOiBNb21lbnQgPSBtb21lbnQodGhpcy5zZWxlY3RlZC5kYXRlKS5lbmRPZignd2VlaycpO1xuICAgIC8vIEZpbHRlciBkYXRhIGRvd24gdG8gdGhlIHNlbGVjdGVkIHdlZWtcbiAgICBsZXQgd2Vla0RhdGE6IERhdHVtW10gPSBbXTtcbiAgICB0aGlzLl9kYXRhLmZpbHRlcigoZDogRGF0dW0pID0+IHtcbiAgICAgIHJldHVybiBkLmRhdGUuaXNCZXR3ZWVuKHN0YXJ0T2ZXZWVrLCBlbmRPZldlZWssIG51bGwsICdbXScpO1xuICAgIH0pLm1hcCgoZDogRGF0dW0pID0+IHtcbiAgICAgIGNvbnN0IHNjYWxlOiBEYXR1bVtdID0gW107XG4gICAgICBkLmRldGFpbHMuZm9yRWFjaCgoZGV0OiBEZXRhaWwpID0+IHtcbiAgICAgICAgY29uc3QgZGF0ZTogTW9tZW50ID0gbW9tZW50KGRldC5kYXRlKTtcbiAgICAgICAgY29uc3QgaSA9IGRhdGUuaG91cnMoKTtcbiAgICAgICAgaWYgKCFzY2FsZVtpXSkge1xuICAgICAgICAgIHNjYWxlW2ldID0ge1xuICAgICAgICAgICAgZGF0ZTogZGF0ZS5zdGFydE9mKCdob3VyJyksXG4gICAgICAgICAgICB0b3RhbDogMCxcbiAgICAgICAgICAgIGRldGFpbHM6IFtdLFxuICAgICAgICAgICAgc3VtbWFyeTogW11cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHNjYWxlW2ldLnRvdGFsICs9IGRldC52YWx1ZTtcbiAgICAgICAgc2NhbGVbaV0uZGV0YWlscy5wdXNoKGRldCk7XG4gICAgICB9KTtcbiAgICAgIHNjYWxlLmZvckVhY2gocyA9PiB7XG4gICAgICAgIGNvbnN0IGdyb3VwID0gdGhpcy5ncm91cEJ5KHMuZGV0YWlscywgJ25hbWUnKTtcbiAgICAgICAgT2JqZWN0LmtleXMoZ3JvdXApLmZvckVhY2goayA9PlxuICAgICAgICAgIHMuc3VtbWFyeS5wdXNoKHtcbiAgICAgICAgICAgIG5hbWU6IGssXG4gICAgICAgICAgICB0b3RhbDogc3VtKGdyb3VwW2tdLCAoZGF0YTogYW55KSA9PiBkYXRhLnZhbHVlKSxcbiAgICAgICAgICAgIGNvbG9yOiBncm91cFtrXVswXS5jb2xvclxuICAgICAgICAgIH0pKTtcbiAgICAgIH0pO1xuICAgICAgd2Vla0RhdGEgPSB3ZWVrRGF0YS5jb25jYXQoc2NhbGUpO1xuICAgIH0pO1xuICAgIHdlZWtEYXRhID0gR1RTTGliLmNsZWFuQXJyYXkod2Vla0RhdGEpO1xuICAgIGNvbnN0IG1heFZhbHVlOiBudW1iZXIgPSBtYXgod2Vla0RhdGEsIChkOiBEYXR1bSkgPT4gZC50b3RhbCk7XG4gICAgLy8gRGVmaW5lIGRheSBsYWJlbHMgYW5kIGF4aXNcbiAgICBjb25zdCBkYXlMYWJlbHMgPSB0aW1lRGF5cyhtb21lbnQudXRjKCkuc3RhcnRPZignd2VlaycpLnRvRGF0ZSgpLCBtb21lbnQudXRjKCkuZW5kT2YoJ3dlZWsnKS50b0RhdGUoKSk7XG4gICAgY29uc3QgZGF5U2NhbGUgPSBzY2FsZUJhbmQoKVxuICAgICAgLnJhbmdlUm91bmQoW3RoaXMubGFiZWxQYWRkaW5nLCB0aGlzLmdIZWlnaHRdKVxuICAgICAgLmRvbWFpbihkYXlMYWJlbHMubWFwKChkOiBEYXRlKSA9PiBtb21lbnQudXRjKGQpLndlZWtkYXkoKS50b1N0cmluZygpKSk7XG4gICAgLy8gRGVmaW5lIGhvdXJzIGxhYmVscyBhbmQgYXhpc1xuICAgIGNvbnN0IGhvdXJzTGFiZWxzOiBzdHJpbmdbXSA9IFtdO1xuICAgIHJhbmdlKDAsIDI0KS5mb3JFYWNoKGggPT4gaG91cnNMYWJlbHMucHVzaChtb21lbnQudXRjKCkuaG91cnMoaCkuc3RhcnRPZignaG91cicpLmZvcm1hdCgnSEg6bW0nKSkpO1xuICAgIGNvbnN0IGhvdXJTY2FsZSA9IHNjYWxlQmFuZCgpLnJhbmdlUm91bmQoW3RoaXMubGFiZWxQYWRkaW5nLCB0aGlzLmdXaWR0aF0pLnBhZGRpbmcoMC4wMSkuZG9tYWluKGhvdXJzTGFiZWxzKTtcbiAgICBjb25zdCBjb2xvciA9IHNjYWxlTGluZWFyPHN0cmluZz4oKVxuICAgICAgLnJhbmdlKFt0aGlzLm1pbkNvbG9yIHx8IENhbGVuZGFySGVhdG1hcENvbXBvbmVudC5ERUZfTUlOX0NPTE9SLCB0aGlzLm1heENvbG9yIHx8IENhbGVuZGFySGVhdG1hcENvbXBvbmVudC5ERUZfTUFYX0NPTE9SXSlcbiAgICAgIC5kb21haW4oWy0wLjE1ICogbWF4VmFsdWUsIG1heFZhbHVlXSk7XG4gICAgLy8gQWRkIHdlZWsgZGF0YSBpdGVtcyB0byB0aGUgb3ZlcnZpZXdcbiAgICB0aGlzLml0ZW1zLnNlbGVjdEFsbCgnLml0ZW0tYmxvY2std2VlaycpLnJlbW92ZSgpO1xuICAgIHRoaXMuaXRlbXMuc2VsZWN0QWxsKCcuaXRlbS1ibG9jay13ZWVrJylcbiAgICAgIC5kYXRhKHdlZWtEYXRhKVxuICAgICAgLmVudGVyKClcbiAgICAgIC5hcHBlbmQoJ3JlY3QnKVxuICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgIC5hdHRyKCdjbGFzcycsICdpdGVtIGl0ZW0tYmxvY2std2VlaycpXG4gICAgICAuYXR0cigneScsIChkOiBEYXR1bSkgPT4gdGhpcy5jYWxjSXRlbVkoZClcbiAgICAgICAgKyAodGhpcy5pdGVtU2l6ZSAtIHRoaXMuY2FsY0l0ZW1TaXplKGQsIG1heFZhbHVlKSkgLyAyKVxuICAgICAgLmF0dHIoJ3gnLCAoZDogRGF0dW0pID0+IHRoaXMuZ3V0dGVyXG4gICAgICAgICsgaG91clNjYWxlKG1vbWVudChkLmRhdGUpLnN0YXJ0T2YoJ2hvdXInKS5mb3JtYXQoJ0hIOm1tJykpXG4gICAgICAgICsgKHRoaXMuaXRlbVNpemUgLSB0aGlzLmNhbGNJdGVtU2l6ZShkLCBtYXhWYWx1ZSkpIC8gMilcbiAgICAgIC5hdHRyKCdyeCcsIChkOiBEYXR1bSkgPT4gdGhpcy5jYWxjSXRlbVNpemUoZCwgbWF4VmFsdWUpKVxuICAgICAgLmF0dHIoJ3J5JywgKGQ6IERhdHVtKSA9PiB0aGlzLmNhbGNJdGVtU2l6ZShkLCBtYXhWYWx1ZSkpXG4gICAgICAuYXR0cignd2lkdGgnLCAoZDogRGF0dW0pID0+IHRoaXMuY2FsY0l0ZW1TaXplKGQsIG1heFZhbHVlKSlcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCAoZDogRGF0dW0pID0+IHRoaXMuY2FsY0l0ZW1TaXplKGQsIG1heFZhbHVlKSlcbiAgICAgIC5hdHRyKCdmaWxsJywgKGQ6IERhdHVtKSA9PiAoZC50b3RhbCA+IDApID8gY29sb3IoZC50b3RhbCkgOiAndHJhbnNwYXJlbnQnKVxuICAgICAgLm9uKCdjbGljaycsIChkOiBEYXR1bSkgPT4ge1xuICAgICAgICBpZiAodGhpcy5pblRyYW5zaXRpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gRG9uJ3QgdHJhbnNpdGlvbiBpZiB0aGVyZSBpcyBubyBkYXRhIHRvIHNob3dcbiAgICAgICAgaWYgKGQudG90YWwgPT09IDApIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pblRyYW5zaXRpb24gPSB0cnVlO1xuICAgICAgICAvLyBTZXQgc2VsZWN0ZWQgZGF0ZSB0byB0aGUgb25lIGNsaWNrZWQgb25cbiAgICAgICAgdGhpcy5zZWxlY3RlZCA9IGQ7XG4gICAgICAgIC8vIEhpZGUgdG9vbHRpcFxuICAgICAgICB0aGlzLmhpZGVUb29sdGlwKCk7XG4gICAgICAgIC8vIFJlbW92ZSBhbGwgd2VlayBvdmVydmlldyByZWxhdGVkIGl0ZW1zIGFuZCBsYWJlbHNcbiAgICAgICAgdGhpcy5yZW1vdmVXZWVrT3ZlcnZpZXcoKTtcbiAgICAgICAgLy8gUmVkcmF3IHRoZSBjaGFydFxuICAgICAgICB0aGlzLm92ZXJ2aWV3ID0gJ2RheSc7XG4gICAgICAgIHRoaXMuZHJhd0NoYXJ0KCk7XG4gICAgICB9KS5vbignbW91c2VvdmVyJywgKGQ6IERhdHVtKSA9PiB7XG4gICAgICBpZiAodGhpcy5pblRyYW5zaXRpb24pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gQ2FsY3VsYXRlIHRvb2x0aXAgcG9zaXRpb25cbiAgICAgIGxldCB4ID0gaG91clNjYWxlKG1vbWVudChkLmRhdGUpLnN0YXJ0T2YoJ2hvdXInKS5mb3JtYXQoJ0hIOm1tJykpICsgdGhpcy50b29sdGlwUGFkZGluZztcbiAgICAgIHdoaWxlICh0aGlzLmdXaWR0aCAtIHggPCAodGhpcy50b29sdGlwV2lkdGggKyB0aGlzLnRvb2x0aXBQYWRkaW5nICogMykpIHtcbiAgICAgICAgeCAtPSAxMDtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHkgPSBkYXlTY2FsZShkLmRhdGUud2Vla2RheSgpLnRvU3RyaW5nKCkpICsgdGhpcy50b29sdGlwUGFkZGluZztcbiAgICAgIC8vIFNob3cgdG9vbHRpcFxuICAgICAgdGhpcy50b29sdGlwLmh0bWwodGhpcy5nZXRUb29sdGlwKGQpKVxuICAgICAgICAuc3R5bGUoJ2xlZnQnLCB4ICsgJ3B4JylcbiAgICAgICAgLnN0eWxlKCd0b3AnLCB5ICsgJ3B4JylcbiAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAuZHVyYXRpb24odGhpcy50cmFuc2l0aW9uRHVyYXRpb24gLyAyKVxuICAgICAgICAuZWFzZShlYXNlTGluZWFyKVxuICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAxKTtcbiAgICB9KVxuICAgICAgLm9uKCdtb3VzZW91dCcsICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaW5UcmFuc2l0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaGlkZVRvb2x0aXAoKTtcbiAgICAgIH0pXG4gICAgICAudHJhbnNpdGlvbigpXG4gICAgICAuZGVsYXkoKCkgPT4gKE1hdGguY29zKE1hdGguUEkgKiBNYXRoLnJhbmRvbSgpKSArIDEpICogdGhpcy50cmFuc2l0aW9uRHVyYXRpb24pXG4gICAgICAuZHVyYXRpb24oKCkgPT4gdGhpcy50cmFuc2l0aW9uRHVyYXRpb24pXG4gICAgICAuZWFzZShlYXNlTGluZWFyKVxuICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMSlcbiAgICAgIC5jYWxsKCh0cmFuc2l0aW9uOiBhbnksIGNhbGxiYWNrOiBhbnkpID0+IHtcbiAgICAgICAgaWYgKHRyYW5zaXRpb24uZW1wdHkoKSkge1xuICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IG4gPSAwO1xuICAgICAgICB0cmFuc2l0aW9uLmVhY2goKCkgPT4gKytuKS5vbignZW5kJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKCEtLW4pIHtcbiAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0sICgpID0+IHRoaXMuaW5UcmFuc2l0aW9uID0gZmFsc2UpO1xuXG4gICAgLy8gQWRkIHdlZWsgbGFiZWxzXG4gICAgdGhpcy5sYWJlbHMuc2VsZWN0QWxsKCcubGFiZWwtd2VlaycpLnJlbW92ZSgpO1xuICAgIHRoaXMubGFiZWxzLnNlbGVjdEFsbCgnLmxhYmVsLXdlZWsnKVxuICAgICAgLmRhdGEoaG91cnNMYWJlbHMpXG4gICAgICAuZW50ZXIoKVxuICAgICAgLmFwcGVuZCgndGV4dCcpXG4gICAgICAuYXR0cignY2xhc3MnLCAnbGFiZWwgbGFiZWwtd2VlaycpXG4gICAgICAuYXR0cignZm9udC1zaXplJywgKCkgPT4gTWF0aC5mbG9vcih0aGlzLmxhYmVsUGFkZGluZyAvIDMpICsgJ3B4JylcbiAgICAgIC50ZXh0KChkOiBzdHJpbmcpID0+IGQpXG4gICAgICAuYXR0cigneCcsIChkOiBzdHJpbmcpID0+IGhvdXJTY2FsZShkKSlcbiAgICAgIC5hdHRyKCd5JywgdGhpcy5sYWJlbFBhZGRpbmcgLyAyKVxuICAgICAgLm9uKCdtb3VzZWVudGVyJywgKGhvdXI6IHN0cmluZykgPT4ge1xuICAgICAgICBpZiAodGhpcy5pblRyYW5zaXRpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pdGVtcy5zZWxlY3RBbGwoJy5pdGVtLWJsb2NrLXdlZWsnKVxuICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAuZHVyYXRpb24odGhpcy50cmFuc2l0aW9uRHVyYXRpb24pXG4gICAgICAgICAgLmVhc2UoZWFzZUxpbmVhcilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAoZDogRGF0dW0pID0+IChtb21lbnQoZC5kYXRlKS5zdGFydE9mKCdob3VyJykuZm9ybWF0KCdISDptbScpID09PSBob3VyKSA/IDEgOiAwLjEpO1xuICAgICAgfSlcbiAgICAgIC5vbignbW91c2VvdXQnLCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmluVHJhbnNpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLml0ZW1zLnNlbGVjdEFsbCgnLml0ZW0tYmxvY2std2VlaycpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgIC5kdXJhdGlvbih0aGlzLnRyYW5zaXRpb25EdXJhdGlvbilcbiAgICAgICAgICAuZWFzZShlYXNlTGluZWFyKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpO1xuICAgICAgfSk7XG4gICAgLy8gQWRkIGRheSBsYWJlbHNcbiAgICB0aGlzLmxhYmVscy5zZWxlY3RBbGwoJy5sYWJlbC1kYXknKS5yZW1vdmUoKTtcbiAgICB0aGlzLmxhYmVscy5zZWxlY3RBbGwoJy5sYWJlbC1kYXknKVxuICAgICAgLmRhdGEoZGF5TGFiZWxzKVxuICAgICAgLmVudGVyKClcbiAgICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2xhYmVsIGxhYmVsLWRheScpXG4gICAgICAuYXR0cigneCcsIHRoaXMubGFiZWxQYWRkaW5nIC8gMylcbiAgICAgIC5hdHRyKCd5JywgKGQ6IERhdGUsIGk6IG51bWJlcikgPT4gZGF5U2NhbGUoaS50b1N0cmluZygpKSArIGRheVNjYWxlLmJhbmR3aWR0aCgpIC8gMS43NSlcbiAgICAgIC5zdHlsZSgndGV4dC1hbmNob3InLCAnbGVmdCcpXG4gICAgICAuYXR0cignZm9udC1zaXplJywgKCkgPT4gTWF0aC5mbG9vcih0aGlzLmxhYmVsUGFkZGluZyAvIDMpICsgJ3B4JylcbiAgICAgIC50ZXh0KChkOiBEYXRlKSA9PiBtb21lbnQudXRjKGQpLmZvcm1hdCgnZGRkZCcpWzBdKVxuICAgICAgLm9uKCdtb3VzZWVudGVyJywgKGQ6IERhdGUpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaW5UcmFuc2l0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNlbGVjdGVkRGF5ID0gbW9tZW50LnV0YyhkKTtcbiAgICAgICAgdGhpcy5pdGVtcy5zZWxlY3RBbGwoJy5pdGVtLWJsb2NrLXdlZWsnKVxuICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAuZHVyYXRpb24odGhpcy50cmFuc2l0aW9uRHVyYXRpb24pXG4gICAgICAgICAgLmVhc2UoZWFzZUxpbmVhcilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAoZGF0YTogRGF0dW0pID0+IChtb21lbnQoZGF0YS5kYXRlKS5kYXkoKSA9PT0gc2VsZWN0ZWREYXkuZGF5KCkpID8gMSA6IDAuMSk7XG4gICAgICB9KVxuICAgICAgLm9uKCdtb3VzZW91dCcsICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaW5UcmFuc2l0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaXRlbXMuc2VsZWN0QWxsKCcuaXRlbS1ibG9jay13ZWVrJylcbiAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgLmR1cmF0aW9uKHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uKVxuICAgICAgICAgIC5lYXNlKGVhc2VMaW5lYXIpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMSk7XG4gICAgICB9KTtcblxuICAgIC8vIEFkZCBidXR0b24gdG8gc3dpdGNoIGJhY2sgdG8gcHJldmlvdXMgb3ZlcnZpZXdcbiAgICB0aGlzLmRyYXdCdXR0b24oKTtcbiAgfVxuXG4gIGRyYXdEYXlPdmVydmlldygpIHtcbiAgICAvLyBBZGQgY3VycmVudCBvdmVydmlldyB0byB0aGUgaGlzdG9yeVxuICAgIGlmICh0aGlzLmhpc3RvcnlbdGhpcy5oaXN0b3J5Lmxlbmd0aCAtIDFdICE9PSB0aGlzLm92ZXJ2aWV3KSB7XG4gICAgICB0aGlzLmhpc3RvcnkucHVzaCh0aGlzLm92ZXJ2aWV3KTtcbiAgICB9XG4gICAgLy8gSW5pdGlhbGl6ZSBzZWxlY3RlZCBkYXRlIHRvIHRvZGF5IGlmIGl0IHdhcyBub3Qgc2V0XG4gICAgaWYgKCFPYmplY3Qua2V5cyh0aGlzLnNlbGVjdGVkKS5sZW5ndGgpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWQgPSB0aGlzLl9kYXRhW3RoaXMuX2RhdGEubGVuZ3RoIC0gMV07XG4gICAgfVxuICAgIGNvbnN0IHN0YXJ0T2ZEYXk6IE1vbWVudCA9IG1vbWVudCh0aGlzLnNlbGVjdGVkLmRhdGUpLnN0YXJ0T2YoJ2RheScpO1xuICAgIGNvbnN0IGVuZE9mRGF5OiBNb21lbnQgPSBtb21lbnQodGhpcy5zZWxlY3RlZC5kYXRlKS5lbmRPZignZGF5Jyk7XG4gICAgLy8gRmlsdGVyIGRhdGEgZG93biB0byB0aGUgc2VsZWN0ZWQgbW9udGhcbiAgICBsZXQgZGF5RGF0YTogRGF0dW1bXSA9IFtdO1xuICAgIHRoaXMuX2RhdGEuZmlsdGVyKChkOiBEYXR1bSkgPT4ge1xuICAgICAgcmV0dXJuIGQuZGF0ZS5pc0JldHdlZW4oc3RhcnRPZkRheSwgZW5kT2ZEYXksIG51bGwsICdbXScpO1xuICAgIH0pLm1hcCgoZDogRGF0dW0pID0+IHtcbiAgICAgIGNvbnN0IHNjYWxlID0gW107XG4gICAgICBkLmRldGFpbHMuZm9yRWFjaCgoZGV0OiBEZXRhaWwpID0+IHtcbiAgICAgICAgY29uc3QgZGF0ZTogTW9tZW50ID0gbW9tZW50KGRldC5kYXRlKTtcbiAgICAgICAgY29uc3QgaSA9IGRhdGUuaG91cnMoKTtcbiAgICAgICAgaWYgKCFzY2FsZVtpXSkge1xuICAgICAgICAgIHNjYWxlW2ldID0ge1xuICAgICAgICAgICAgZGF0ZTogZGF0ZS5zdGFydE9mKCdob3VyJyksXG4gICAgICAgICAgICB0b3RhbDogMCxcbiAgICAgICAgICAgIGRldGFpbHM6IFtdLFxuICAgICAgICAgICAgc3VtbWFyeTogW11cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHNjYWxlW2ldLnRvdGFsICs9IGRldC52YWx1ZTtcbiAgICAgICAgc2NhbGVbaV0uZGV0YWlscy5wdXNoKGRldCk7XG4gICAgICB9KTtcbiAgICAgIHNjYWxlLmZvckVhY2gocyA9PiB7XG4gICAgICAgIGNvbnN0IGdyb3VwID0gdGhpcy5ncm91cEJ5KHMuZGV0YWlscywgJ25hbWUnKTtcbiAgICAgICAgT2JqZWN0LmtleXMoZ3JvdXApLmZvckVhY2goayA9PiB7XG4gICAgICAgICAgcy5zdW1tYXJ5LnB1c2goe1xuICAgICAgICAgICAgbmFtZTogayxcbiAgICAgICAgICAgIHRvdGFsOiBzdW0oZ3JvdXBba10sIChpdGVtOiBhbnkpID0+IGl0ZW0udmFsdWUpLFxuICAgICAgICAgICAgY29sb3I6IGdyb3VwW2tdWzBdLmNvbG9yXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBkYXlEYXRhID0gZGF5RGF0YS5jb25jYXQoc2NhbGUpO1xuICAgIH0pO1xuICAgIGNvbnN0IGRhdGE6IFN1bW1hcnlbXSA9IFtdO1xuICAgIGRheURhdGEuZm9yRWFjaCgoZDogRGF0dW0pID0+IHtcbiAgICAgIGNvbnN0IGRhdGUgPSBkLmRhdGU7XG4gICAgICBkLnN1bW1hcnkuZm9yRWFjaCgoczogU3VtbWFyeSkgPT4ge1xuICAgICAgICBzLmRhdGUgPSBkYXRlO1xuICAgICAgICBkYXRhLnB1c2gocyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBkYXlEYXRhID0gR1RTTGliLmNsZWFuQXJyYXkoZGF5RGF0YSk7XG4gICAgY29uc3QgbWF4VmFsdWU6IG51bWJlciA9IG1heChkYXRhLCAoZDogU3VtbWFyeSkgPT4gZC50b3RhbCk7XG4gICAgY29uc3QgZ3RzTmFtZXMgPSB0aGlzLnNlbGVjdGVkLnN1bW1hcnkubWFwKChzdW1tYXJ5OiBTdW1tYXJ5KSA9PiBzdW1tYXJ5Lm5hbWUpO1xuICAgIGNvbnN0IGd0c05hbWVTY2FsZSA9IHNjYWxlQmFuZCgpLnJhbmdlUm91bmQoW3RoaXMubGFiZWxQYWRkaW5nLCB0aGlzLmdIZWlnaHRdKS5kb21haW4oZ3RzTmFtZXMpO1xuICAgIGNvbnN0IGhvdXJMYWJlbHM6IHN0cmluZ1tdID0gW107XG4gICAgcmFuZ2UoMCwgMjQpLmZvckVhY2goaCA9PiBob3VyTGFiZWxzLnB1c2gobW9tZW50LnV0YygpLmhvdXJzKGgpLnN0YXJ0T2YoJ2hvdXInKS5mb3JtYXQoJ0hIOm1tJykpKTtcbiAgICBjb25zdCBkYXlTY2FsZSA9IHNjYWxlQmFuZCgpXG4gICAgICAucmFuZ2VSb3VuZChbdGhpcy5sYWJlbFBhZGRpbmcsIHRoaXMuZ1dpZHRoXSlcbiAgICAgIC5wYWRkaW5nKDAuMDEpXG4gICAgICAuZG9tYWluKGhvdXJMYWJlbHMpO1xuICAgIHRoaXMuaXRlbXMuc2VsZWN0QWxsKCcuaXRlbS1ibG9jaycpLnJlbW92ZSgpO1xuICAgIHRoaXMuaXRlbXMuc2VsZWN0QWxsKCcuaXRlbS1ibG9jaycpXG4gICAgICAuZGF0YShkYXRhKVxuICAgICAgLmVudGVyKClcbiAgICAgIC5hcHBlbmQoJ3JlY3QnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2l0ZW0gaXRlbS1ibG9jaycpXG4gICAgICAuYXR0cigneCcsIChkOiBTdW1tYXJ5KSA9PiB0aGlzLmd1dHRlclxuICAgICAgICArIGRheVNjYWxlKG1vbWVudChkLmRhdGUpLnN0YXJ0T2YoJ2hvdXInKS5mb3JtYXQoJ0hIOm1tJykpXG4gICAgICAgICsgKHRoaXMuaXRlbVNpemUgLSB0aGlzLmNhbGNJdGVtU2l6ZShkLCBtYXhWYWx1ZSkpIC8gMilcbiAgICAgIC5hdHRyKCd5JywgKGQ6IFN1bW1hcnkpID0+IHtcbiAgICAgICAgcmV0dXJuIChndHNOYW1lU2NhbGUoZC5uYW1lKSB8fCAxKSAtICh0aGlzLml0ZW1TaXplIC0gdGhpcy5jYWxjSXRlbVNpemUoZCwgbWF4VmFsdWUpKSAvIDI7XG4gICAgICB9KVxuICAgICAgLmF0dHIoJ3J4JywgKGQ6IFN1bW1hcnkpID0+IHRoaXMuY2FsY0l0ZW1TaXplKGQsIG1heFZhbHVlKSlcbiAgICAgIC5hdHRyKCdyeScsIChkOiBTdW1tYXJ5KSA9PiB0aGlzLmNhbGNJdGVtU2l6ZShkLCBtYXhWYWx1ZSkpXG4gICAgICAuYXR0cignd2lkdGgnLCAoZDogU3VtbWFyeSkgPT4gdGhpcy5jYWxjSXRlbVNpemUoZCwgbWF4VmFsdWUpKVxuICAgICAgLmF0dHIoJ2hlaWdodCcsIChkOiBTdW1tYXJ5KSA9PiB0aGlzLmNhbGNJdGVtU2l6ZShkLCBtYXhWYWx1ZSkpXG4gICAgICAuYXR0cignZmlsbCcsIChkOiBTdW1tYXJ5KSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbG9yID0gc2NhbGVMaW5lYXI8c3RyaW5nPigpXG4gICAgICAgICAgLnJhbmdlKFsnI2ZmZmZmZicsIGQuY29sb3IgfHwgQ2FsZW5kYXJIZWF0bWFwQ29tcG9uZW50LkRFRl9NSU5fQ09MT1JdKVxuICAgICAgICAgIC5kb21haW4oWy0wLjUgKiBtYXhWYWx1ZSwgbWF4VmFsdWVdKTtcbiAgICAgICAgcmV0dXJuIGNvbG9yKGQudG90YWwpO1xuICAgICAgfSlcbiAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAub24oJ21vdXNlb3ZlcicsIChkOiBTdW1tYXJ5KSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmluVHJhbnNpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBDYWxjdWxhdGUgdG9vbHRpcCBwb3NpdGlvblxuICAgICAgICBsZXQgeCA9IGRheVNjYWxlKG1vbWVudChkLmRhdGUpLnN0YXJ0T2YoJ2hvdXInKS5mb3JtYXQoJ0hIOm1tJykpICsgdGhpcy50b29sdGlwUGFkZGluZztcbiAgICAgICAgd2hpbGUgKHRoaXMuZ1dpZHRoIC0geCA8ICh0aGlzLnRvb2x0aXBXaWR0aCArIHRoaXMudG9vbHRpcFBhZGRpbmcgKiAzKSkge1xuICAgICAgICAgIHggLT0gMTA7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgeSA9IGd0c05hbWVTY2FsZShkLm5hbWUpICsgdGhpcy50b29sdGlwUGFkZGluZztcbiAgICAgICAgLy8gU2hvdyB0b29sdGlwXG4gICAgICAgIHRoaXMudG9vbHRpcC5odG1sKHRoaXMuZ2V0VG9vbHRpcChkKSlcbiAgICAgICAgICAuc3R5bGUoJ2xlZnQnLCB4ICsgJ3B4JylcbiAgICAgICAgICAuc3R5bGUoJ3RvcCcsIHkgKyAncHgnKVxuICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAuZHVyYXRpb24odGhpcy50cmFuc2l0aW9uRHVyYXRpb24gLyAyKVxuICAgICAgICAgIC5lYXNlKGVhc2VMaW5lYXIpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMSk7XG4gICAgICB9KVxuICAgICAgLm9uKCdtb3VzZW91dCcsICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaW5UcmFuc2l0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaGlkZVRvb2x0aXAoKTtcbiAgICAgIH0pXG4gICAgICAub24oJ2NsaWNrJywgKGQ6IFN1bW1hcnkpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaGFuZGxlcikge1xuICAgICAgICAgIHRoaXMuaGFuZGxlci5lbWl0KGQpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgLmRlbGF5KCgpID0+IChNYXRoLmNvcyhNYXRoLlBJICogTWF0aC5yYW5kb20oKSkgKyAxKSAqIHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uKVxuICAgICAgLmR1cmF0aW9uKCgpID0+IHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uKVxuICAgICAgLmVhc2UoZWFzZUxpbmVhcilcbiAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpXG4gICAgICAuY2FsbCgodHJhbnNpdGlvbjogYW55LCBjYWxsYmFjazogYW55KSA9PiB7XG4gICAgICAgIGlmICh0cmFuc2l0aW9uLmVtcHR5KCkpIHtcbiAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBuID0gMDtcbiAgICAgICAgdHJhbnNpdGlvbi5lYWNoKCgpID0+ICsrbikub24oJ2VuZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmICghLS1uKSB7XG4gICAgICAgICAgICBjYWxsYmFjay5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9LCAoKSA9PiB0aGlzLmluVHJhbnNpdGlvbiA9IGZhbHNlKTtcblxuICAgIC8vIEFkZCB0aW1lIGxhYmVsc1xuICAgIHRoaXMubGFiZWxzLnNlbGVjdEFsbCgnLmxhYmVsLXRpbWUnKS5yZW1vdmUoKTtcbiAgICB0aGlzLmxhYmVscy5zZWxlY3RBbGwoJy5sYWJlbC10aW1lJylcbiAgICAgIC5kYXRhKGhvdXJMYWJlbHMpXG4gICAgICAuZW50ZXIoKVxuICAgICAgLmFwcGVuZCgndGV4dCcpXG4gICAgICAuYXR0cignY2xhc3MnLCAnbGFiZWwgbGFiZWwtdGltZScpXG4gICAgICAuYXR0cignZm9udC1zaXplJywgKCkgPT4gTWF0aC5mbG9vcih0aGlzLmxhYmVsUGFkZGluZyAvIDMpICsgJ3B4JylcbiAgICAgIC50ZXh0KChkOiBzdHJpbmcpID0+IGQpXG4gICAgICAuYXR0cigneCcsIChkOiBzdHJpbmcpID0+IGRheVNjYWxlKGQpKVxuICAgICAgLmF0dHIoJ3knLCB0aGlzLmxhYmVsUGFkZGluZyAvIDIpXG4gICAgICAub24oJ21vdXNlZW50ZXInLCAoZDogc3RyaW5nKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmluVHJhbnNpdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzZWxlY3RlZCA9IGQ7XG4gICAgICAgIC8vIGNvbnN0IHNlbGVjdGVkID0gaXRlbVNjYWxlKG1vbWVudC51dGMoZCkpO1xuICAgICAgICB0aGlzLml0ZW1zLnNlbGVjdEFsbCgnLml0ZW0tYmxvY2snKVxuICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAuZHVyYXRpb24odGhpcy50cmFuc2l0aW9uRHVyYXRpb24pXG4gICAgICAgICAgLmVhc2UoZWFzZUxpbmVhcilcbiAgICAgICAgICAuc3R5bGUoJ29wYWNpdHknLCAoaXRlbTogYW55KSA9PiAoaXRlbS5kYXRlLmZvcm1hdCgnSEg6bW0nKSA9PT0gc2VsZWN0ZWQpID8gMSA6IDAuMSk7XG4gICAgICB9KVxuICAgICAgLm9uKCdtb3VzZW91dCcsICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaW5UcmFuc2l0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaXRlbXMuc2VsZWN0QWxsKCcuaXRlbS1ibG9jaycpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgIC5kdXJhdGlvbih0aGlzLnRyYW5zaXRpb25EdXJhdGlvbilcbiAgICAgICAgICAuZWFzZShlYXNlTGluZWFyKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpO1xuICAgICAgfSk7XG4gICAgLy8gQWRkIHByb2plY3QgbGFiZWxzXG4gICAgY29uc3QgbGFiZWxQYWRkaW5nID0gdGhpcy5sYWJlbFBhZGRpbmc7XG4gICAgdGhpcy5sYWJlbHMuc2VsZWN0QWxsKCcubGFiZWwtcHJvamVjdCcpLnJlbW92ZSgpO1xuICAgIHRoaXMubGFiZWxzLnNlbGVjdEFsbCgnLmxhYmVsLXByb2plY3QnKVxuICAgICAgLmRhdGEoZ3RzTmFtZXMpXG4gICAgICAuZW50ZXIoKVxuICAgICAgLmFwcGVuZCgndGV4dCcpXG4gICAgICAuYXR0cignY2xhc3MnLCAnbGFiZWwgbGFiZWwtcHJvamVjdCcpXG4gICAgICAuYXR0cigneCcsIHRoaXMuZ3V0dGVyKVxuICAgICAgLmF0dHIoJ3knLCAoZDogc3RyaW5nKSA9PiBndHNOYW1lU2NhbGUoZCkgKyB0aGlzLml0ZW1TaXplIC8gMilcbiAgICAgIC5hdHRyKCdtaW4taGVpZ2h0JywgKCkgPT4gZ3RzTmFtZVNjYWxlLmJhbmR3aWR0aCgpKVxuICAgICAgLnN0eWxlKCd0ZXh0LWFuY2hvcicsICdsZWZ0JylcbiAgICAgIC5hdHRyKCdmb250LXNpemUnLCAoKSA9PiBNYXRoLmZsb29yKHRoaXMubGFiZWxQYWRkaW5nIC8gMykgKyAncHgnKVxuICAgICAgLnRleHQoKGQ6IHN0cmluZykgPT4gZClcbiAgICAgIC5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCBvYmogPSBzZWxlY3QodGhpcyk7XG4gICAgICAgIGxldCB0ZXh0TGVuZ3RoID0gb2JqLm5vZGUoKS5nZXRDb21wdXRlZFRleHRMZW5ndGgoKTtcbiAgICAgICAgbGV0IHRleHQgPSBvYmoudGV4dCgpO1xuICAgICAgICB3aGlsZSAodGV4dExlbmd0aCA+IChsYWJlbFBhZGRpbmcgKiAxLjUpICYmIHRleHQubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHRleHQgPSB0ZXh0LnNsaWNlKDAsIC0xKTtcbiAgICAgICAgICBvYmoudGV4dCh0ZXh0ICsgJy4uLicpO1xuICAgICAgICAgIHRleHRMZW5ndGggPSBvYmoubm9kZSgpLmdldENvbXB1dGVkVGV4dExlbmd0aCgpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLm9uKCdtb3VzZWVudGVyJywgKGd0c05hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICBpZiAodGhpcy5pblRyYW5zaXRpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pdGVtcy5zZWxlY3RBbGwoJy5pdGVtLWJsb2NrJylcbiAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgLmR1cmF0aW9uKHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uKVxuICAgICAgICAgIC5lYXNlKGVhc2VMaW5lYXIpXG4gICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgKGQ6IFN1bW1hcnkpID0+IChkLm5hbWUgPT09IGd0c05hbWUpID8gMSA6IDAuMSk7XG4gICAgICB9KVxuICAgICAgLm9uKCdtb3VzZW91dCcsICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaW5UcmFuc2l0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaXRlbXMuc2VsZWN0QWxsKCcuaXRlbS1ibG9jaycpXG4gICAgICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgICAgIC5kdXJhdGlvbih0aGlzLnRyYW5zaXRpb25EdXJhdGlvbilcbiAgICAgICAgICAuZWFzZShlYXNlTGluZWFyKVxuICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpO1xuICAgICAgfSk7XG4gICAgLy8gQWRkIGJ1dHRvbiB0byBzd2l0Y2ggYmFjayB0byBwcmV2aW91cyBvdmVydmlld1xuICAgIHRoaXMuZHJhd0J1dHRvbigpO1xuICB9XG5cbiAgcHJpdmF0ZSBjYWxjSXRlbVgoZDogRGF0dW0sIHN0YXJ0T2ZZZWFyOiBNb21lbnQpIHtcbiAgICBjb25zdCBkYXlJbmRleCA9IE1hdGgucm91bmQoKCttb21lbnQoZC5kYXRlKSAtICtzdGFydE9mWWVhci5zdGFydE9mKCd3ZWVrJykpIC8gODY0MDAwMDApO1xuICAgIGNvbnN0IGNvbEluZGV4ID0gTWF0aC50cnVuYyhkYXlJbmRleCAvIDcpO1xuICAgIHJldHVybiBjb2xJbmRleCAqICh0aGlzLml0ZW1TaXplICsgdGhpcy5ndXR0ZXIpICsgdGhpcy5sYWJlbFBhZGRpbmc7XG4gIH1cblxuICBwcml2YXRlIGNhbGNJdGVtWE1vbnRoKGQ6IERhdHVtLCBzdGFydDogTW9tZW50LCBvZmZzZXQ6IG51bWJlcikge1xuICAgIGNvbnN0IGhvdXJJbmRleCA9IG1vbWVudChkLmRhdGUpLmhvdXJzKCk7XG4gICAgY29uc3QgY29sSW5kZXggPSBNYXRoLnRydW5jKGhvdXJJbmRleCAvIDMpO1xuICAgIHJldHVybiBjb2xJbmRleCAqICh0aGlzLml0ZW1TaXplICsgdGhpcy5ndXR0ZXIpICsgb2Zmc2V0O1xuICB9XG5cbiAgcHJpdmF0ZSBjYWxjSXRlbVkoZDogRGF0dW0pIHtcbiAgICByZXR1cm4gdGhpcy5sYWJlbFBhZGRpbmcgKyBkLmRhdGUud2Vla2RheSgpICogKHRoaXMuaXRlbVNpemUgKyB0aGlzLmd1dHRlcik7XG4gIH1cblxuICBwcml2YXRlIGNhbGNJdGVtU2l6ZShkOiBEYXR1bSB8IFN1bW1hcnksIG06IG51bWJlcikge1xuICAgIGlmIChtIDw9IDApIHtcbiAgICAgIHJldHVybiB0aGlzLml0ZW1TaXplO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5pdGVtU2l6ZSAqIDAuNzUgKyAodGhpcy5pdGVtU2l6ZSAqIGQudG90YWwgLyBtKSAqIDAuMjU7XG4gIH1cblxuICBwcml2YXRlIGRyYXdCdXR0b24oKSB7XG4gICAgdGhpcy5idXR0b25zLnNlbGVjdEFsbCgnLmJ1dHRvbicpLnJlbW92ZSgpO1xuICAgIGNvbnN0IGJ1dHRvbiA9IHRoaXMuYnV0dG9ucy5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2J1dHRvbiBidXR0b24tYmFjaycpXG4gICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgLm9uKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaW5UcmFuc2l0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIFNldCB0cmFuc2l0aW9uIGJvb2xlYW5cbiAgICAgICAgdGhpcy5pblRyYW5zaXRpb24gPSB0cnVlO1xuICAgICAgICAvLyBDbGVhbiB0aGUgY2FudmFzIGZyb20gd2hpY2hldmVyIG92ZXJ2aWV3IHR5cGUgd2FzIG9uXG4gICAgICAgIGlmICh0aGlzLm92ZXJ2aWV3ID09PSAneWVhcicpIHtcbiAgICAgICAgICB0aGlzLnJlbW92ZVllYXJPdmVydmlldygpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMub3ZlcnZpZXcgPT09ICdtb250aCcpIHtcbiAgICAgICAgICB0aGlzLnJlbW92ZU1vbnRoT3ZlcnZpZXcoKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm92ZXJ2aWV3ID09PSAnd2VlaycpIHtcbiAgICAgICAgICB0aGlzLnJlbW92ZVdlZWtPdmVydmlldygpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMub3ZlcnZpZXcgPT09ICdkYXknKSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVEYXlPdmVydmlldygpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFJlZHJhdyB0aGUgY2hhcnRcbiAgICAgICAgdGhpcy5oaXN0b3J5LnBvcCgpO1xuICAgICAgICB0aGlzLm92ZXJ2aWV3ID0gdGhpcy5oaXN0b3J5LnBvcCgpO1xuICAgICAgICB0aGlzLmRyYXdDaGFydCgpO1xuICAgICAgfSk7XG4gICAgYnV0dG9uLmFwcGVuZCgnY2lyY2xlJylcbiAgICAgIC5hdHRyKCdjeCcsIHRoaXMubGFiZWxQYWRkaW5nIC8gMi4yNSlcbiAgICAgIC5hdHRyKCdjeScsIHRoaXMubGFiZWxQYWRkaW5nIC8gMi41KVxuICAgICAgLmF0dHIoJ3InLCB0aGlzLml0ZW1TaXplIC8gMik7XG4gICAgYnV0dG9uLmFwcGVuZCgndGV4dCcpXG4gICAgICAuYXR0cigneCcsIHRoaXMubGFiZWxQYWRkaW5nIC8gMi4yNSlcbiAgICAgIC5hdHRyKCd5JywgdGhpcy5sYWJlbFBhZGRpbmcgLyAyLjUpXG4gICAgICAuYXR0cignZHknLCAoKSA9PiB7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKHRoaXMuZ1dpZHRoIC8gMTAwKSAvIDM7XG4gICAgICB9KVxuICAgICAgLmF0dHIoJ2ZvbnQtc2l6ZScsICgpID0+IHtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IodGhpcy5sYWJlbFBhZGRpbmcgLyAzKSArICdweCc7XG4gICAgICB9KVxuICAgICAgLmh0bWwoJyYjeDIxOTA7Jyk7XG4gICAgYnV0dG9uLnRyYW5zaXRpb24oKVxuICAgICAgLmR1cmF0aW9uKHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uKVxuICAgICAgLmVhc2UoZWFzZUxpbmVhcilcbiAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpO1xuICB9XG5cbiAgcHJpdmF0ZSByZW1vdmVHbG9iYWxPdmVydmlldygpIHtcbiAgICB0aGlzLml0ZW1zLnNlbGVjdEFsbCgnLml0ZW0tYmxvY2steWVhcicpXG4gICAgICAudHJhbnNpdGlvbigpXG4gICAgICAuZHVyYXRpb24odGhpcy50cmFuc2l0aW9uRHVyYXRpb24pXG4gICAgICAuZWFzZShlYXNlTGluZWFyKVxuICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgIC5yZW1vdmUoKTtcbiAgICB0aGlzLmxhYmVscy5zZWxlY3RBbGwoJy5sYWJlbC15ZWFyJykucmVtb3ZlKCk7XG4gIH1cblxuICBwcml2YXRlIHJlbW92ZVllYXJPdmVydmlldygpIHtcbiAgICB0aGlzLml0ZW1zLnNlbGVjdEFsbCgnLml0ZW0tY2lyY2xlJylcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgIC5kdXJhdGlvbih0aGlzLnRyYW5zaXRpb25EdXJhdGlvbilcbiAgICAgIC5lYXNlKGVhc2VMaW5lYXIpXG4gICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgLnJlbW92ZSgpO1xuICAgIHRoaXMubGFiZWxzLnNlbGVjdEFsbCgnLmxhYmVsLWRheScpLnJlbW92ZSgpO1xuICAgIHRoaXMubGFiZWxzLnNlbGVjdEFsbCgnLmxhYmVsLW1vbnRoJykucmVtb3ZlKCk7XG4gICAgdGhpcy5oaWRlQmFja0J1dHRvbigpO1xuICB9XG5cbiAgcHJpdmF0ZSByZW1vdmVNb250aE92ZXJ2aWV3KCkge1xuICAgIHRoaXMuaXRlbXMuc2VsZWN0QWxsKCcuaXRlbS1ibG9jay1tb250aCcpXG4gICAgICAudHJhbnNpdGlvbigpXG4gICAgICAuZHVyYXRpb24odGhpcy50cmFuc2l0aW9uRHVyYXRpb24pXG4gICAgICAuZWFzZShlYXNlTGluZWFyKVxuICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMClcbiAgICAgIC5yZW1vdmUoKTtcbiAgICB0aGlzLmxhYmVscy5zZWxlY3RBbGwoJy5sYWJlbC1kYXknKS5yZW1vdmUoKTtcbiAgICB0aGlzLmxhYmVscy5zZWxlY3RBbGwoJy5sYWJlbC13ZWVrJykucmVtb3ZlKCk7XG4gICAgdGhpcy5oaWRlQmFja0J1dHRvbigpO1xuICB9XG5cbiAgcHJpdmF0ZSByZW1vdmVXZWVrT3ZlcnZpZXcoKSB7XG4gICAgdGhpcy5pdGVtcy5zZWxlY3RBbGwoJy5pdGVtLWJsb2NrLXdlZWsnKVxuICAgICAgLnRyYW5zaXRpb24oKVxuICAgICAgLmR1cmF0aW9uKHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uKVxuICAgICAgLmVhc2UoZWFzZUxpbmVhcilcbiAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXG4gICAgICAuYXR0cigneCcsIChkOiBhbnksIGk6IG51bWJlcikgPT4gKGkgJSAyID09PSAwKSA/IC10aGlzLmdXaWR0aCAvIDMgOiB0aGlzLmdXaWR0aCAvIDMpXG4gICAgICAucmVtb3ZlKCk7XG4gICAgdGhpcy5sYWJlbHMuc2VsZWN0QWxsKCcubGFiZWwtZGF5JykucmVtb3ZlKCk7XG4gICAgdGhpcy5sYWJlbHMuc2VsZWN0QWxsKCcubGFiZWwtd2VlaycpLnJlbW92ZSgpO1xuICAgIHRoaXMuaGlkZUJhY2tCdXR0b24oKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVtb3ZlRGF5T3ZlcnZpZXcoKSB7XG4gICAgdGhpcy5pdGVtcy5zZWxlY3RBbGwoJy5pdGVtLWJsb2NrJylcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgIC5kdXJhdGlvbih0aGlzLnRyYW5zaXRpb25EdXJhdGlvbilcbiAgICAgIC5lYXNlKGVhc2VMaW5lYXIpXG4gICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgLmF0dHIoJ3gnLCAoZDogYW55LCBpOiBudW1iZXIpID0+IChpICUgMiA9PT0gMCkgPyAtdGhpcy5nV2lkdGggLyAzIDogdGhpcy5nV2lkdGggLyAzKVxuICAgICAgLnJlbW92ZSgpO1xuICAgIHRoaXMubGFiZWxzLnNlbGVjdEFsbCgnLmxhYmVsLXRpbWUnKS5yZW1vdmUoKTtcbiAgICB0aGlzLmxhYmVscy5zZWxlY3RBbGwoJy5sYWJlbC1wcm9qZWN0JykucmVtb3ZlKCk7XG4gICAgdGhpcy5oaWRlQmFja0J1dHRvbigpO1xuICB9XG5cbiAgcHJpdmF0ZSBoaWRlVG9vbHRpcCgpIHtcbiAgICB0aGlzLnRvb2x0aXAudHJhbnNpdGlvbigpXG4gICAgICAuZHVyYXRpb24odGhpcy50cmFuc2l0aW9uRHVyYXRpb24gLyAyKVxuICAgICAgLmVhc2UoZWFzZUxpbmVhcilcbiAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApO1xuICB9XG5cbiAgLyoqXG4gICAqIEhlbHBlciBmdW5jdGlvbiB0byBoaWRlIHRoZSBiYWNrIGJ1dHRvblxuICAgKi9cbiAgcHJpdmF0ZSBoaWRlQmFja0J1dHRvbigpIHtcbiAgICB0aGlzLmJ1dHRvbnMuc2VsZWN0QWxsKCcuYnV0dG9uJylcbiAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgIC5kdXJhdGlvbih0aGlzLnRyYW5zaXRpb25EdXJhdGlvbilcbiAgICAgIC5lYXNlKGVhc2VMaW5lYXIpXG4gICAgICAuc3R5bGUoJ29wYWNpdHknLCAwKVxuICAgICAgLnJlbW92ZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRUb29sdGlwID0gKGQ6IGFueSkgPT4ge1xuICAgIGxldCB0b29sdGlwSHRtbCA9ICc8ZGl2IGNsYXNzPVwiaGVhZGVyXCI+PHN0cm9uZz4nICsgZC5kYXRlLmZvcm1hdCgnZGRkZCwgTU1NIERvIFlZWVkgSEg6bW0nKSArICc8L3N0cm9uZz48L2Rpdj48dWw+JztcbiAgICAoZC5zdW1tYXJ5IHx8IFtdKS5mb3JFYWNoKHMgPT4ge1xuICAgICAgdG9vbHRpcEh0bWwgKz0gYDxsaT5cbiAgPGRpdiBjbGFzcz1cInJvdW5kXCIgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOiR7Q29sb3JMaWIudHJhbnNwYXJlbnRpemUocy5jb2xvcil9OyBib3JkZXItY29sb3I6JHtzLmNvbG9yfVwiPjwvZGl2PlxuJHtHVFNMaWIuZm9ybWF0TGFiZWwocy5uYW1lKX06ICR7cy50b3RhbH08L2xpPmA7XG4gICAgfSk7XG4gICAgaWYgKGQudG90YWwgIT09IHVuZGVmaW5lZCAmJiBkLm5hbWUpIHtcbiAgICAgIHRvb2x0aXBIdG1sICs9IGA8bGk+PGRpdiBjbGFzcz1cInJvdW5kXCJcbnN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjogJHtDb2xvckxpYi50cmFuc3BhcmVudGl6ZShkLmNvbG9yKX07IGJvcmRlci1jb2xvcjogJHtkLmNvbG9yfVwiXG4+PC9kaXY+ICR7R1RTTGliLmZvcm1hdExhYmVsKGQubmFtZSl9OiAke2QudG90YWx9PC9saT5gO1xuICAgIH1cbiAgICB0b29sdGlwSHRtbCArPSAnPC91bD4nO1xuICAgIHJldHVybiB0b29sdGlwSHRtbDtcbiAgfVxufVxuIl19