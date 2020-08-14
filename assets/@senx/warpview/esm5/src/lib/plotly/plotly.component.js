/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component, ElementRef, EventEmitter, Input, IterableDiffers, KeyValueDiffers, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import * as Plotlyjs from 'plotly.js/dist/plotly';
import { Plots } from 'plotly.js';
import { Logger } from '../utils/logger';
/**
 * @record
 */
export function Figure() { }
if (false) {
    /** @type {?} */
    Figure.prototype.data;
    /** @type {?} */
    Figure.prototype.layout;
    /** @type {?} */
    Figure.prototype.frames;
}
var PlotlyComponent = /** @class */ (function () {
    function PlotlyComponent(iterableDiffers, el, keyValueDiffers) {
        this.iterableDiffers = iterableDiffers;
        this.el = el;
        this.keyValueDiffers = keyValueDiffers;
        this.defaultClassName = 'js-plotly-plot';
        this.revision = 0;
        this.debug = false;
        this.useResizeHandler = false;
        this.updateOnLayoutChange = true;
        this.updateOnDataChange = true;
        this.updateOnlyWithRevision = true;
        this.initialized = new EventEmitter();
        this.update = new EventEmitter();
        this.purge = new EventEmitter();
        this.error = new EventEmitter();
        this.afterExport = new EventEmitter();
        this.afterPlot = new EventEmitter();
        this.animated = new EventEmitter();
        this.animatingFrame = new EventEmitter();
        this.animationInterrupted = new EventEmitter();
        this.autoSize = new EventEmitter();
        this.beforeExport = new EventEmitter();
        this.buttonClicked = new EventEmitter();
        this.click = new EventEmitter();
        this.plotly_click = new EventEmitter();
        this.clickAnnotation = new EventEmitter();
        this.deselect = new EventEmitter();
        this.doubleClick = new EventEmitter();
        this.framework = new EventEmitter();
        this.hover = new EventEmitter();
        this.legendClick = new EventEmitter();
        this.legendDoubleClick = new EventEmitter();
        this.relayout = new EventEmitter();
        this.restyle = new EventEmitter();
        this.redraw = new EventEmitter();
        this.selected = new EventEmitter();
        this.selecting = new EventEmitter();
        this.sliderChange = new EventEmitter();
        this.sliderEnd = new EventEmitter();
        this.sliderStart = new EventEmitter();
        this.transitioning = new EventEmitter();
        this.transitionInterrupted = new EventEmitter();
        this.unhover = new EventEmitter();
        this.relayouting = new EventEmitter();
        this.eventNames = [
            // 'afterExport',
            //   'afterPlot', // 'animated', 'animatingFrame', 'animationInterrupted', 'autoSize',
            // 'beforeExport', 'buttonClicked', 'clickAnnotation', 'deselect', 'doubleClick', 'framework',
            'hover', 'unhover',
            // 'legendClick', 'legendDoubleClick',
            'relayout',
        ];
        this.LOG = new Logger(PlotlyComponent, this.debug);
    }
    /**
     * @return {?}
     */
    PlotlyComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.createPlot().then((/**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var figure = _this.createFigure();
            _this.LOG.debug(['figure'], figure);
            _this.initialized.emit(_this.plotlyInstance);
        }));
    };
    /**
     * @return {?}
     */
    PlotlyComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        if (typeof this.resizeHandler === 'function') {
            this.getWindow().removeEventListener('resize', (/** @type {?} */ (this.resizeHandler)));
            this.resizeHandler = undefined;
        }
        /** @type {?} */
        var figure = this.createFigure();
        this.purge.emit(figure);
        this.remove(this.plotlyInstance);
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    PlotlyComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        this.LOG.debug(['ngOnChanges'], changes);
        /** @type {?} */
        var revision = changes.revision;
        if (changes.debug) {
            this.debug = changes.debug.currentValue;
        }
        if ((revision && !revision.isFirstChange()) || !!changes.layout || !!changes.data || !!changes.config) {
            this.updatePlot();
        }
        if (!!changes.debug) {
            this.LOG.setDebug(changes.debug.currentValue);
        }
        this.updateWindowResizeHandler();
        this.LOG.debug(['ngOnChanges'], changes);
    };
    /**
     * @return {?}
     */
    PlotlyComponent.prototype.ngDoCheck = /**
     * @return {?}
     */
    function () {
        if (this.updateOnlyWithRevision) {
            return false;
        }
        /** @type {?} */
        var shouldUpdate = false;
        if (this.updateOnLayoutChange) {
            if (this.layoutDiffer) {
                /** @type {?} */
                var layoutHasDiff = this.layoutDiffer.diff(this.layout);
                if (layoutHasDiff) {
                    shouldUpdate = true;
                }
            }
            else if (this.layout) {
                this.layoutDiffer = this.keyValueDiffers.find(this.layout).create();
            }
            else {
                this.layoutDiffer = undefined;
            }
        }
        if (this.updateOnDataChange) {
            if (this.dataDiffer) {
                /** @type {?} */
                var dataHasDiff = this.dataDiffer.diff(this.data);
                if (dataHasDiff) {
                    shouldUpdate = true;
                }
            }
            else if (Array.isArray(this.data)) {
                this.dataDiffer = this.iterableDiffers.find(this.data).create(this.dataDifferTrackBy);
            }
            else {
                this.dataDiffer = undefined;
            }
        }
        if (shouldUpdate && this.plotlyInstance) {
            this.updatePlot();
        }
    };
    /**
     * @return {?}
     */
    PlotlyComponent.prototype.getWindow = /**
     * @return {?}
     */
    function () {
        return window;
    };
    /**
     * @return {?}
     */
    PlotlyComponent.prototype.getBoundingClientRect = /**
     * @return {?}
     */
    function () {
        return this.rect;
    };
    /**
     * @return {?}
     */
    PlotlyComponent.prototype.getClassName = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var classes = [this.defaultClassName];
        if (Array.isArray(this.className)) {
            classes = classes.concat(this.className);
        }
        else if (this.className) {
            classes.push(this.className);
        }
        return classes.join(' ');
    };
    /**
     * @param {?} properties
     * @param {?} curves
     * @return {?}
     */
    PlotlyComponent.prototype.restyleChart = /**
     * @param {?} properties
     * @param {?} curves
     * @return {?}
     */
    function (properties, curves) {
        Plotlyjs.restyle(this.plotlyInstance, properties, curves);
    };
    /**
     * @return {?}
     */
    PlotlyComponent.prototype.createPlot = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.LOG.debug(['createPlot'], this.data, this.layout, this.config, this.plotlyInstance);
        return Plotlyjs.react(this.plotEl.nativeElement, this.data, this.layout, this.config).then((/**
         * @param {?} plotlyInstance
         * @return {?}
         */
        function (plotlyInstance) {
            _this.rect = _this.el.nativeElement.getBoundingClientRect();
            _this.plotlyInstance = plotlyInstance;
            _this.LOG.debug(['plotlyInstance'], plotlyInstance);
            _this.getWindow().gd = _this.debug ? plotlyInstance : undefined;
            _this.eventNames.forEach((/**
             * @param {?} name
             * @return {?}
             */
            function (name) {
                /** @type {?} */
                var eventName = "plotly_" + name.toLowerCase();
                // @ts-ignore
                plotlyInstance.on(eventName, (/**
                 * @param {?} data
                 * @return {?}
                 */
                function (data) {
                    _this.LOG.debug(['plotlyEvent', eventName], data);
                    ((/** @type {?} */ (_this[name]))).emit(data);
                }));
            }));
            plotlyInstance.on('plotly_click', (/**
             * @param {?} data
             * @return {?}
             */
            function (data) {
                _this.click.emit(data);
                _this.plotly_click.emit(data);
            }));
            _this.updateWindowResizeHandler();
            _this.afterPlot.emit(plotlyInstance);
        }), (/**
         * @param {?} err
         * @return {?}
         */
        function (err) {
            console.error('Error while plotting:', err);
            _this.error.emit(err);
        }));
    };
    /**
     * @return {?}
     */
    PlotlyComponent.prototype.createFigure = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var p = this.plotlyInstance;
        return {
            data: p.data,
            layout: p.layout,
            frames: p._transitionData ? p._transitionData._frames : null
        };
    };
    /**
     * @return {?}
     */
    PlotlyComponent.prototype.updatePlot = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.LOG.debug(['updatePlot'], this.data, this.layout, tslib_1.__assign({}, this.config));
        if (!this.plotlyInstance) {
            /** @type {?} */
            var error = new Error("Plotly component wasn't initialized");
            this.error.emit(error);
            return;
        }
        Plotlyjs.purge(this.plotlyInstance);
        this.createPlot().then((/**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var figure = _this.createFigure();
            _this.update.emit(figure);
        }), (/**
         * @param {?} err
         * @return {?}
         */
        function (err) {
            console.error('Error while updating plot:', err);
            _this.error.emit(err);
        }));
    };
    /**
     * @return {?}
     */
    PlotlyComponent.prototype.updateWindowResizeHandler = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (this.useResizeHandler) {
            if (this.resizeHandler === undefined) {
                this.resizeHandler = (/**
                 * @return {?}
                 */
                function () { return setTimeout((/**
                 * @return {?}
                 */
                function () { return Plots.resize(_this.plotlyInstance); })); });
                this.getWindow().addEventListener('resize', (/** @type {?} */ (this.resizeHandler)));
            }
        }
        else {
            if (typeof this.resizeHandler === 'function') {
                this.getWindow().removeEventListener('resize', (/** @type {?} */ (this.resizeHandler)));
                this.resizeHandler = undefined;
            }
        }
    };
    /**
     * @param {?} _
     * @param {?} item
     * @return {?}
     */
    PlotlyComponent.prototype.dataDifferTrackBy = /**
     * @param {?} _
     * @param {?} item
     * @return {?}
     */
    function (_, item) {
        /** @type {?} */
        var obj = Object.assign({}, item, { uid: '' });
        return JSON.stringify(obj);
    };
    /**
     * @param {?} div
     * @return {?}
     */
    PlotlyComponent.prototype.remove = /**
     * @param {?} div
     * @return {?}
     */
    function (div) {
        Plotlyjs.purge(div);
        delete this.plotlyInstance;
    };
    PlotlyComponent.decorators = [
        { type: Component, args: [{
                    selector: 'warpview-plotly',
                    template: "<div #plot [attr.id]=\"divId\" [className]=\"getClassName()\" [ngStyle]=\"style\"></div>\n\n",
                    encapsulation: ViewEncapsulation.ShadowDom,
                    styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--warp-view-chart-width:100%;--warp-view-chart-height:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-map-margin:0;--warp-view-switch-height:30px;--warp-view-switch-width:100px;--warp-view-switch-radius:18px;--warp-view-plot-chart-height:100%;--warp-view-slider-pointer-size:65px;--warp-view-resize-handle-height:10px;--warp-view-tile-width:100%;--warp-view-tile-height:100%;--warp-view-font-color:#000000;--warp-view-bar-color:#dc3545;--warp-view-datagrid-odd-bg-color:#ffffff;--warp-view-datagrid-odd-color:#404040;--warp-view-datagrid-even-bg-color:#c0c0c0;--warp-view-datagrid-even-color:#000000;--warp-view-pagination-border-color:#c0c0c0;--warp-view-pagination-bg-color:#ffffff;--warp-view-pagination-active-bg-color:#4CAF50;--warp-view-pagination-active-color:#ffffff;--warp-view-pagination-active-border-color:#4CAF50;--warp-view-pagination-hover-bg-color:#c0c0c0;--warp-view-pagination-hover-color:#000000;--warp-view-pagination-hover-border-color:#c0c0c0;--warp-view-pagination-disabled-color:#c0c0c0;--warp-view-switch-inset-color:#c0c0c0;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-handle-color:radial-gradient(#ffffff 15%, #c0c0c0 100%);--warp-view-switch-handle-checked-color:radial-gradient(#ffffff 15%, #00cd00 100%);--warp-view-resize-handle-color:#c0c0c0;--warp-view-chart-legend-bg:#ffffff;--warp-view-chart-legend-color:#404040;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19A979;--gts-attrname-font-color:#19A979;--gts-separator-font-color:#a0a0a0;--gts-labelvalue-font-color:#000000;--gts-attrvalue-font-color:#000000;--gts-stack-font-color:#000000;--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--warp-view-popup-bg-color:#ffffff;--warp-view-popup-border-color:rgba(0, 0, 0, .2);--warp-view-popup-header-bg-color:#c0c0c0;--warp-view-popup-title-color:#404040;--warp-view-popup-close-color:#404040;--warp-view-popup-body-bg-color:#ffffff;--warp-view-popup-body-color:#000000;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-annotationtooltip-font-color:#404040;--warp-view-spinner-color:#ff9900;--warp-slider-connect-color:#ff9900;--warp-slider-handle-bg-color:#ffffff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #ffffff,inset 0 1px 7px #c0c0c0,0 3px 6px -3px #a0a0a0}.noData{width:100%;text-align:center;color:var(--warp-view-chart-legend-color);position:relative}.js-plotly-plot .plotly,.js-plotly-plot .plotly div{direction:ltr;font-family:'Open Sans',verdana,arial,sans-serif;margin:0;padding:0}.js-plotly-plot .plotly button,.js-plotly-plot .plotly input{font-family:'Open Sans',verdana,arial,sans-serif}.js-plotly-plot .plotly button:focus,.js-plotly-plot .plotly input:focus{outline:0}.js-plotly-plot .plotly a,.js-plotly-plot .plotly a:hover{text-decoration:none}.js-plotly-plot .plotly .crisp{shape-rendering:crispEdges}.js-plotly-plot .plotly .user-select-none{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;-o-user-select:none;user-select:none}.js-plotly-plot .plotly svg{overflow:hidden}.js-plotly-plot .plotly svg a{fill:#447adb}.js-plotly-plot .plotly svg a:hover{fill:#3c6dc5}.js-plotly-plot .plotly .main-svg{position:absolute;top:0;left:0;pointer-events:none}.js-plotly-plot .plotly .main-svg .draglayer{pointer-events:all}.js-plotly-plot .plotly .cursor-default{cursor:default}.js-plotly-plot .plotly .cursor-pointer{cursor:pointer}.js-plotly-plot .plotly .cursor-crosshair{cursor:crosshair}.js-plotly-plot .plotly .cursor-move{cursor:move}.js-plotly-plot .plotly .cursor-col-resize{cursor:col-resize}.js-plotly-plot .plotly .cursor-row-resize{cursor:row-resize}.js-plotly-plot .plotly .cursor-ns-resize{cursor:ns-resize}.js-plotly-plot .plotly .cursor-ew-resize{cursor:ew-resize}.js-plotly-plot .plotly .cursor-sw-resize{cursor:sw-resize}.js-plotly-plot .plotly .cursor-s-resize{cursor:s-resize}.js-plotly-plot .plotly .cursor-se-resize{cursor:se-resize}.js-plotly-plot .plotly .cursor-w-resize{cursor:w-resize}.js-plotly-plot .plotly .cursor-e-resize{cursor:e-resize}.js-plotly-plot .plotly .cursor-nw-resize{cursor:nw-resize}.js-plotly-plot .plotly .cursor-n-resize{cursor:n-resize}.js-plotly-plot .plotly .cursor-ne-resize{cursor:ne-resize}.js-plotly-plot .plotly .cursor-grab{cursor:-webkit-grab;cursor:grab}.js-plotly-plot .plotly .modebar{position:absolute;top:2px;right:2px}.js-plotly-plot .plotly .ease-bg{-webkit-transition:background-color .3s;transition:background-color .3s}.js-plotly-plot .plotly .modebar--hover>:not(.watermark){opacity:0;-webkit-transition:opacity .3s;transition:opacity .3s}.js-plotly-plot .plotly:hover .modebar--hover .modebar-group{opacity:1}.js-plotly-plot .plotly .modebar-group{float:left;display:inline-block;box-sizing:border-box;padding-left:8px;position:relative;vertical-align:middle;white-space:nowrap}.js-plotly-plot .plotly .modebar-btn{position:relative;font-size:16px;padding:3px 4px;height:22px;cursor:pointer;line-height:normal;box-sizing:border-box}.js-plotly-plot .plotly .modebar-btn svg{position:relative;top:2px}.js-plotly-plot .plotly .modebar.vertical{display:-webkit-box;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;flex-direction:column;flex-wrap:wrap;align-content:flex-end;max-height:100%}.js-plotly-plot .plotly .modebar.vertical svg{top:-1px}.js-plotly-plot .plotly .modebar.vertical .modebar-group{display:block;float:none;padding-left:0;padding-bottom:8px}.js-plotly-plot .plotly .modebar.vertical .modebar-group .modebar-btn{display:block;text-align:center}.js-plotly-plot .plotly [data-title]:after,.js-plotly-plot .plotly [data-title]:before{position:absolute;-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0);display:none;opacity:0;z-index:1001;pointer-events:none;top:110%;right:50%}.js-plotly-plot .plotly [data-title]:hover:after,.js-plotly-plot .plotly [data-title]:hover:before{display:block;opacity:1}.js-plotly-plot .plotly [data-title]:before{content:'';position:absolute;background:0 0;border:6px solid transparent;z-index:1002;margin-top:-12px;border-bottom-color:#69738a;margin-right:-6px}.js-plotly-plot .plotly [data-title]:after{content:attr(data-title);background:#69738a;color:#fff;padding:8px 10px;font-size:12px;line-height:12px;white-space:nowrap;margin-right:-18px;border-radius:2px}.js-plotly-plot .plotly .vertical [data-title]:after,.js-plotly-plot .plotly .vertical [data-title]:before{top:0;right:200%}.js-plotly-plot .plotly .vertical [data-title]:before{border:6px solid transparent;border-left-color:#69738a;margin-top:8px;margin-right:-30px}.js-plotly-plot .plotly .select-outline{fill:none;stroke-width:1;shape-rendering:crispEdges}.js-plotly-plot .plotly .select-outline-1{stroke:#fff}.js-plotly-plot .plotly .select-outline-2{stroke:#000;stroke-dasharray:2px 2px}.plotly-notifier{font-family:'Open Sans',verdana,arial,sans-serif;position:fixed;top:50px;right:20px;z-index:10000;font-size:10pt;max-width:180px}.plotly-notifier p{margin:0}.plotly-notifier .notifier-note{min-width:180px;max-width:250px;border:1px solid #fff;z-index:3000;margin:0;background-color:rgba(140,151,175,.9);color:#fff;padding:10px;overflow-wrap:break-word;word-wrap:break-word;-ms-hyphens:auto;-webkit-hyphens:auto;hyphens:auto}.plotly-notifier .notifier-close{color:#fff;opacity:.8;float:right;padding:0 5px;background:0 0;border:none;font-size:20px;font-weight:700;line-height:20px}.plotly-notifier .notifier-close:hover{color:#444;text-decoration:none;cursor:pointer}:host .ylines-above{stroke:var(--warp-view-chart-grid-color)!important}:host .xtick>text,:host .ytick>text{fill:var(--warp-view-font-color)!important}:host .modebar-btn path{fill:var(--warp-view-font-color)!important}"]
                }] }
    ];
    /** @nocollapse */
    PlotlyComponent.ctorParameters = function () { return [
        { type: IterableDiffers },
        { type: ElementRef },
        { type: KeyValueDiffers }
    ]; };
    PlotlyComponent.propDecorators = {
        plotEl: [{ type: ViewChild, args: ['plot', { static: true },] }],
        data: [{ type: Input }],
        layout: [{ type: Input }],
        config: [{ type: Input }],
        frames: [{ type: Input }],
        style: [{ type: Input }],
        divId: [{ type: Input }],
        revision: [{ type: Input }],
        className: [{ type: Input }],
        debug: [{ type: Input }],
        useResizeHandler: [{ type: Input }],
        updateOnLayoutChange: [{ type: Input }],
        updateOnDataChange: [{ type: Input }],
        updateOnlyWithRevision: [{ type: Input }],
        initialized: [{ type: Output }],
        update: [{ type: Output }],
        purge: [{ type: Output }],
        error: [{ type: Output }],
        afterExport: [{ type: Output }],
        afterPlot: [{ type: Output }],
        animated: [{ type: Output }],
        animatingFrame: [{ type: Output }],
        animationInterrupted: [{ type: Output }],
        autoSize: [{ type: Output }],
        beforeExport: [{ type: Output }],
        buttonClicked: [{ type: Output }],
        click: [{ type: Output }],
        plotly_click: [{ type: Output }],
        clickAnnotation: [{ type: Output }],
        deselect: [{ type: Output }],
        doubleClick: [{ type: Output }],
        framework: [{ type: Output }],
        hover: [{ type: Output }],
        legendClick: [{ type: Output }],
        legendDoubleClick: [{ type: Output }],
        relayout: [{ type: Output }],
        restyle: [{ type: Output }],
        redraw: [{ type: Output }],
        selected: [{ type: Output }],
        selecting: [{ type: Output }],
        sliderChange: [{ type: Output }],
        sliderEnd: [{ type: Output }],
        sliderStart: [{ type: Output }],
        transitioning: [{ type: Output }],
        transitionInterrupted: [{ type: Output }],
        unhover: [{ type: Output }],
        relayouting: [{ type: Output }]
    };
    return PlotlyComponent;
}());
export { PlotlyComponent };
if (false) {
    /**
     * @type {?}
     * @protected
     */
    PlotlyComponent.prototype.defaultClassName;
    /**
     * @type {?}
     * @protected
     */
    PlotlyComponent.prototype.LOG;
    /** @type {?} */
    PlotlyComponent.prototype.plotlyInstance;
    /** @type {?} */
    PlotlyComponent.prototype.resizeHandler;
    /** @type {?} */
    PlotlyComponent.prototype.layoutDiffer;
    /** @type {?} */
    PlotlyComponent.prototype.dataDiffer;
    /** @type {?} */
    PlotlyComponent.prototype.plotEl;
    /** @type {?} */
    PlotlyComponent.prototype.data;
    /** @type {?} */
    PlotlyComponent.prototype.layout;
    /** @type {?} */
    PlotlyComponent.prototype.config;
    /** @type {?} */
    PlotlyComponent.prototype.frames;
    /** @type {?} */
    PlotlyComponent.prototype.style;
    /** @type {?} */
    PlotlyComponent.prototype.divId;
    /** @type {?} */
    PlotlyComponent.prototype.revision;
    /** @type {?} */
    PlotlyComponent.prototype.className;
    /** @type {?} */
    PlotlyComponent.prototype.debug;
    /** @type {?} */
    PlotlyComponent.prototype.useResizeHandler;
    /** @type {?} */
    PlotlyComponent.prototype.updateOnLayoutChange;
    /** @type {?} */
    PlotlyComponent.prototype.updateOnDataChange;
    /** @type {?} */
    PlotlyComponent.prototype.updateOnlyWithRevision;
    /** @type {?} */
    PlotlyComponent.prototype.initialized;
    /** @type {?} */
    PlotlyComponent.prototype.update;
    /** @type {?} */
    PlotlyComponent.prototype.purge;
    /** @type {?} */
    PlotlyComponent.prototype.error;
    /** @type {?} */
    PlotlyComponent.prototype.afterExport;
    /** @type {?} */
    PlotlyComponent.prototype.afterPlot;
    /** @type {?} */
    PlotlyComponent.prototype.animated;
    /** @type {?} */
    PlotlyComponent.prototype.animatingFrame;
    /** @type {?} */
    PlotlyComponent.prototype.animationInterrupted;
    /** @type {?} */
    PlotlyComponent.prototype.autoSize;
    /** @type {?} */
    PlotlyComponent.prototype.beforeExport;
    /** @type {?} */
    PlotlyComponent.prototype.buttonClicked;
    /** @type {?} */
    PlotlyComponent.prototype.click;
    /** @type {?} */
    PlotlyComponent.prototype.plotly_click;
    /** @type {?} */
    PlotlyComponent.prototype.clickAnnotation;
    /** @type {?} */
    PlotlyComponent.prototype.deselect;
    /** @type {?} */
    PlotlyComponent.prototype.doubleClick;
    /** @type {?} */
    PlotlyComponent.prototype.framework;
    /** @type {?} */
    PlotlyComponent.prototype.hover;
    /** @type {?} */
    PlotlyComponent.prototype.legendClick;
    /** @type {?} */
    PlotlyComponent.prototype.legendDoubleClick;
    /** @type {?} */
    PlotlyComponent.prototype.relayout;
    /** @type {?} */
    PlotlyComponent.prototype.restyle;
    /** @type {?} */
    PlotlyComponent.prototype.redraw;
    /** @type {?} */
    PlotlyComponent.prototype.selected;
    /** @type {?} */
    PlotlyComponent.prototype.selecting;
    /** @type {?} */
    PlotlyComponent.prototype.sliderChange;
    /** @type {?} */
    PlotlyComponent.prototype.sliderEnd;
    /** @type {?} */
    PlotlyComponent.prototype.sliderStart;
    /** @type {?} */
    PlotlyComponent.prototype.transitioning;
    /** @type {?} */
    PlotlyComponent.prototype.transitionInterrupted;
    /** @type {?} */
    PlotlyComponent.prototype.unhover;
    /** @type {?} */
    PlotlyComponent.prototype.relayouting;
    /** @type {?} */
    PlotlyComponent.prototype.eventNames;
    /** @type {?} */
    PlotlyComponent.prototype.rect;
    /** @type {?} */
    PlotlyComponent.prototype.iterableDiffers;
    /** @type {?} */
    PlotlyComponent.prototype.el;
    /** @type {?} */
    PlotlyComponent.prototype.keyValueDiffers;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxvdGx5LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzZW54L3dhcnB2aWV3LyIsInNvdXJjZXMiOlsic3JjL2xpYi9wbG90bHkvcGxvdGx5LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFDTCxTQUFTLEVBRVQsVUFBVSxFQUNWLFlBQVksRUFDWixLQUFLLEVBRUwsZUFBZSxFQUVmLGVBQWUsRUFJZixNQUFNLEVBR04sU0FBUyxFQUNULGlCQUFpQixFQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEtBQUssUUFBUSxNQUFNLHVCQUF1QixDQUFDO0FBQ2xELE9BQU8sRUFBMEMsS0FBSyxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ3pFLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQzs7OztBQUV2Qyw0QkFJQzs7O0lBSEMsc0JBQWE7O0lBQ2Isd0JBQXdCOztJQUN4Qix3QkFBd0I7O0FBRzFCO0lBZ0ZFLHlCQUNTLGVBQWdDLEVBQ2hDLEVBQWMsRUFDZCxlQUFnQztRQUZoQyxvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7UUFDaEMsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUNkLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQTVFL0IscUJBQWdCLEdBQUcsZ0JBQWdCLENBQUM7UUFpQnJDLGFBQVEsR0FBRyxDQUFDLENBQUM7UUFFYixVQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ2QscUJBQWdCLEdBQUcsS0FBSyxDQUFDO1FBRXpCLHlCQUFvQixHQUFHLElBQUksQ0FBQztRQUM1Qix1QkFBa0IsR0FBRyxJQUFJLENBQUM7UUFDMUIsMkJBQXNCLEdBQUcsSUFBSSxDQUFDO1FBRTdCLGdCQUFXLEdBQUcsSUFBSSxZQUFZLEVBQXFCLENBQUM7UUFDcEQsV0FBTSxHQUFHLElBQUksWUFBWSxFQUFVLENBQUM7UUFDcEMsVUFBSyxHQUFHLElBQUksWUFBWSxFQUFVLENBQUM7UUFDbkMsVUFBSyxH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Qjs7SUFDL0IsaUNBQWtDOztJQUNsQyxpQ0FBaUM7O0lBQ2pDLGdDQUEyQzs7SUFFM0MsZ0NBQXdCOztJQUN4QixtQ0FBc0I7O0lBQ3RCLG9DQUF1Qzs7SUFDdkMsZ0NBQXVCOztJQUN2QiwyQ0FBa0M7O0lBRWxDLCtDQUFxQzs7SUFDckMsNkNBQW1DOztJQUNuQyxpREFBdUM7O0lBRXZDLHNDQUE4RDs7SUFDOUQsaUNBQThDOztJQUM5QyxnQ0FBNkM7O0lBQzdDLGdDQUE0Qzs7SUFFNUMsc0NBQTJDOztJQUMzQyxvQ0FBeUM7O0lBQ3pDLG1DQUF3Qzs7SUFDeEMseUNBQThDOztJQUM5QywrQ0FBb0Q7O0lBQ3BELG1DQUF3Qzs7SUFDeEMsdUNBQTRDOztJQUM1Qyx3Q0FBNkM7O0lBQzdDLGdDQUFxQzs7SUFDckMsdUNBQTRDOztJQUM1QywwQ0FBK0M7O0lBQy9DLG1DQUF3Qzs7SUFDeEMsc0NBQTJDOztJQUMzQyxvQ0FBeUM7O0lBQ3pDLGdDQUFxQzs7SUFDckMsc0NBQTJDOztJQUMzQyw0Q0FBaUQ7O0lBQ2pELG1DQUF3Qzs7SUFDeEMsa0NBQXVDOztJQUN2QyxpQ0FBc0M7O0lBQ3RDLG1DQUF3Qzs7SUFDeEMsb0NBQXlDOztJQUN6Qyx1Q0FBNEM7O0lBQzVDLG9DQUF5Qzs7SUFDekMsc0NBQTJDOztJQUMzQyx3Q0FBNkM7O0lBQzdDLGdEQUFxRDs7SUFDckQsa0NBQXVDOztJQUN2QyxzQ0FBMkM7O0lBRTNDLHFDQVNFOztJQUNGLCtCQUFVOztJQUdSLDBDQUF1Qzs7SUFDdkMsNkJBQXFCOztJQUNyQiwwQ0FBdUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIERvQ2hlY2ssXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIEl0ZXJhYmxlRGlmZmVyLFxuICBJdGVyYWJsZURpZmZlcnMsXG4gIEtleVZhbHVlRGlmZmVyLFxuICBLZXlWYWx1ZURpZmZlcnMsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgU2ltcGxlQ2hhbmdlLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0ICogYXMgUGxvdGx5anMgZnJvbSAncGxvdGx5LmpzL2Rpc3QvcGxvdGx5JztcbmltcG9ydCB7Q29uZmlnLCBEYXRhLCBMYXlvdXQsIFBsb3RseUhUTUxFbGVtZW50LCBQbG90c30gZnJvbSAncGxvdGx5LmpzJztcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICcuLi91dGlscy9sb2dnZXInO1xuXG5leHBvcnQgaW50ZXJmYWNlIEZpZ3VyZSB7XG4gIGRhdGE6IERhdGFbXTtcbiAgbGF5b3V0OiBQYXJ0aWFsPExheW91dD47XG4gIGZyYW1lczogUGFydGlhbDxDb25maWc+O1xufVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICd3YXJwdmlldy1wbG90bHknLFxuICB0ZW1wbGF0ZVVybDogJy4vcGxvdGx5LmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vcGxvdGx5LmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLlNoYWRvd0RvbVxufSlcbmV4cG9ydCBjbGFzcyBQbG90bHlDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95LCBEb0NoZWNrIHtcbiAgcHJvdGVjdGVkIGRlZmF1bHRDbGFzc05hbWUgPSAnanMtcGxvdGx5LXBsb3QnO1xuICBwcm90ZWN0ZWQgTE9HOiBMb2dnZXI7XG5cbiAgcHVibGljIHBsb3RseUluc3RhbmNlOiBQbG90bHlIVE1MRWxlbWVudDtcbiAgcHVibGljIHJlc2l6ZUhhbmRsZXI/OiAoaW5zdGFuY2U6IFBsb3RseUhUTUxFbGVtZW50KSA9PiB2b2lkO1xuICBwdWJsaWMgbGF5b3V0RGlmZmVyOiBLZXlWYWx1ZURpZmZlcjxzdHJpbmcsIGFueT47XG4gIHB1YmxpYyBkYXRhRGlmZmVyOiBJdGVyYWJsZURpZmZlcjxQYXJ0aWFsPGFueT4+O1xuXG4gIEBWaWV3Q2hpbGQoJ3Bsb3QnLCB7c3RhdGljOiB0cnVlfSkgcGxvdEVsOiBFbGVtZW50UmVmO1xuXG4gIEBJbnB1dCgpIGRhdGE/OiBQYXJ0aWFsPGFueT5bXTtcbiAgQElucHV0KCkgbGF5b3V0PzogUGFydGlhbDxhbnk+O1xuICBASW5wdXQoKSBjb25maWc/OiBQYXJ0aWFsPENvbmZpZz47XG4gIEBJbnB1dCgpIGZyYW1lcz86IFBhcnRpYWw8YW55PltdO1xuICBASW5wdXQoKSBzdHlsZT86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH07XG5cbiAgQElucHV0KCkgZGl2SWQ/OiBzdHJpbmc7XG4gIEBJbnB1dCgpIHJldmlzaW9uID0gMDtcbiAgQElucHV0KCkgY2xhc3NOYW1lPzogc3RyaW5nIHwgc3RyaW5nW107XG4gIEBJbnB1dCgpIGRlYnVnID0gZmFsc2U7XG4gIEBJbnB1dCgpIHVzZVJlc2l6ZUhhbmRsZXIgPSBmYWxzZTtcblxuICBASW5wdXQoKSB1cGRhdGVPbkxheW91dENoYW5nZSA9IHRydWU7XG4gIEBJbnB1dCgpIHVwZGF0ZU9uRGF0YUNoYW5nZSA9IHRydWU7XG4gIEBJbnB1dCgpIHVwZGF0ZU9ubHlXaXRoUmV2aXNpb24gPSB0cnVlO1xuXG4gIEBPdXRwdXQoKSBpbml0aWFsaXplZCA9IG5ldyBFdmVudEVtaXR0ZXI8UGxvdGx5SFRNTEVsZW1lbnQ+KCk7XG4gIEBPdXRwdXQoKSB1cGRhdGUgPSBuZXcgRXZlbnRFbWl0dGVyPEZpZ3VyZT4oKTtcbiAgQE91dHB1dCgpIHB1cmdlID0gbmV3IEV2ZW50RW1pdHRlcjxGaWd1cmU+KCk7XG4gIEBPdXRwdXQoKSBlcnJvciA9IG5ldyBFdmVudEVtaXR0ZXI8RXJyb3I+KCk7XG5cbiAgQE91dHB1dCgpIGFmdGVyRXhwb3J0ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgYWZ0ZXJQbG90ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgYW5pbWF0ZWQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBhbmltYXRpbmdGcmFtZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIGFuaW1hdGlvbkludGVycnVwdGVkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgYXV0b1NpemUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBiZWZvcmVFeHBvcnQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBidXR0b25DbGlja2VkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgY2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBwbG90bHlfY2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBjbGlja0Fubm90YXRpb24gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBkZXNlbGVjdCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIGRvdWJsZUNsaWNrID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgZnJhbWV3b3JrID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgaG92ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBsZWdlbmRDbGljayA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIGxlZ2VuZERvdWJsZUNsaWNrID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgcmVsYXlvdXQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSByZXN0eWxlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgcmVkcmF3ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgc2VsZWN0ZWQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBzZWxlY3RpbmcgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBzbGlkZXJDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBzbGlkZXJFbmQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBzbGlkZXJTdGFydCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIHRyYW5zaXRpb25pbmcgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSB0cmFuc2l0aW9uSW50ZXJydXB0ZWQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSB1bmhvdmVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgcmVsYXlvdXRpbmcgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgcHVibGljIGV2ZW50TmFtZXMgPSBbXG4gICAgLy8gJ2FmdGVyRXhwb3J0JyxcbiAgICAvLyAgICdhZnRlclBsb3QnLCAvLyAnYW5pbWF0ZWQnLCAnYW5pbWF0aW5nRnJhbWUnLCAnYW5pbWF0aW9uSW50ZXJydXB0ZWQnLCAnYXV0b1NpemUnLFxuICAgIC8vICdiZWZvcmVFeHBvcnQnLCAnYnV0dG9uQ2xpY2tlZCcsICdjbGlja0Fubm90YXRpb24nLCAnZGVzZWxlY3QnLCAnZG91YmxlQ2xpY2snLCAnZnJhbWV3b3JrJyxcbiAgICAnaG92ZXInLCAndW5ob3ZlcicsXG4gICAgLy8gJ2xlZ2VuZENsaWNrJywgJ2xlZ2VuZERvdWJsZUNsaWNrJyxcbiAgICAncmVsYXlvdXQnLFxuICAgIC8vICdyZXN0eWxlJywgJ3JlZHJhdycsICdzZWxlY3RlZCcsICdzZWxlY3RpbmcnLCAnc2xpZGVyQ2hhbmdlJyxcbiAgICAvLyAnc2xpZGVyRW5kJywgJ3NsaWRlclN0YXJ0JywgJ3RyYW5zaXRpb25pbmcnLCAndHJhbnNpdGlvbkludGVycnVwdGVkJywgJ3JlbGF5b3V0aW5nJ1xuICBdO1xuICByZWN0OiBhbnk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGl0ZXJhYmxlRGlmZmVyczogSXRlcmFibGVEaWZmZXJzLFxuICAgIHB1YmxpYyBlbDogRWxlbWVudFJlZixcbiAgICBwdWJsaWMga2V5VmFsdWVEaWZmZXJzOiBLZXlWYWx1ZURpZmZlcnNcbiAgKSB7XG4gICAgdGhpcy5MT0cgPSBuZXcgTG9nZ2VyKFBsb3RseUNvbXBvbmVudCwgdGhpcy5kZWJ1Zyk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmNyZWF0ZVBsb3QoKS50aGVuKCgpID0+IHtcbiAgICAgIGNvbnN0IGZpZ3VyZSA9IHRoaXMuY3JlYXRlRmlndXJlKCk7XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2ZpZ3VyZSddLCBmaWd1cmUpO1xuICAgICAgdGhpcy5pbml0aWFsaXplZC5lbWl0KHRoaXMucGxvdGx5SW5zdGFuY2UpO1xuICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLnJlc2l6ZUhhbmRsZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMuZ2V0V2luZG93KCkucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5yZXNpemVIYW5kbGVyIGFzIGFueSk7XG4gICAgICB0aGlzLnJlc2l6ZUhhbmRsZXIgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgY29uc3QgZmlndXJlID0gdGhpcy5jcmVhdGVGaWd1cmUoKTtcbiAgICB0aGlzLnB1cmdlLmVtaXQoZmlndXJlKTtcbiAgICB0aGlzLnJlbW92ZSh0aGlzLnBsb3RseUluc3RhbmNlKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ25nT25DaGFuZ2VzJ10sIGNoYW5nZXMpO1xuICAgIGNvbnN0IHJldmlzaW9uOiBTaW1wbGVDaGFuZ2UgPSBjaGFuZ2VzLnJldmlzaW9uO1xuICAgIGlmIChjaGFuZ2VzLmRlYnVnKSB7XG4gICAgICB0aGlzLmRlYnVnID0gY2hhbmdlcy5kZWJ1Zy5jdXJyZW50VmFsdWU7XG4gICAgfVxuICAgIGlmICgocmV2aXNpb24gJiYgIXJldmlzaW9uLmlzRmlyc3RDaGFuZ2UoKSkgfHwgISFjaGFuZ2VzLmxheW91dCB8fCAhIWNoYW5nZXMuZGF0YSB8fCAhIWNoYW5nZXMuY29uZmlnKSB7XG4gICAgICB0aGlzLnVwZGF0ZVBsb3QoKTtcbiAgICB9XG4gICAgaWYgKCEhY2hhbmdlcy5kZWJ1Zykge1xuICAgICAgdGhpcy5MT0cuc2V0RGVidWcoY2hhbmdlcy5kZWJ1Zy5jdXJyZW50VmFsdWUpO1xuICAgIH1cbiAgICB0aGlzLnVwZGF0ZVdpbmRvd1Jlc2l6ZUhhbmRsZXIoKTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ25nT25DaGFuZ2VzJ10sIGNoYW5nZXMpO1xuICB9XG5cbiAgbmdEb0NoZWNrKCkge1xuICAgIGlmICh0aGlzLnVwZGF0ZU9ubHlXaXRoUmV2aXNpb24pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgbGV0IHNob3VsZFVwZGF0ZSA9IGZhbHNlO1xuICAgIGlmICh0aGlzLnVwZGF0ZU9uTGF5b3V0Q2hhbmdlKSB7XG4gICAgICBpZiAodGhpcy5sYXlvdXREaWZmZXIpIHtcbiAgICAgICAgY29uc3QgbGF5b3V0SGFzRGlmZiA9IHRoaXMubGF5b3V0RGlmZmVyLmRpZmYodGhpcy5sYXlvdXQpO1xuICAgICAgICBpZiAobGF5b3V0SGFzRGlmZikge1xuICAgICAgICAgIHNob3VsZFVwZGF0ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5sYXlvdXQpIHtcbiAgICAgICAgdGhpcy5sYXlvdXREaWZmZXIgPSB0aGlzLmtleVZhbHVlRGlmZmVycy5maW5kKHRoaXMubGF5b3V0KS5jcmVhdGUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubGF5b3V0RGlmZmVyID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLnVwZGF0ZU9uRGF0YUNoYW5nZSkge1xuICAgICAgaWYgKHRoaXMuZGF0YURpZmZlcikge1xuICAgICAgICBjb25zdCBkYXRhSGFzRGlmZiA9IHRoaXMuZGF0YURpZmZlci5kaWZmKHRoaXMuZGF0YSk7XG4gICAgICAgIGlmIChkYXRhSGFzRGlmZikge1xuICAgICAgICAgIHNob3VsZFVwZGF0ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLmRhdGEpKSB7XG4gICAgICAgIHRoaXMuZGF0YURpZmZlciA9IHRoaXMuaXRlcmFibGVEaWZmZXJzLmZpbmQodGhpcy5kYXRhKS5jcmVhdGUodGhpcy5kYXRhRGlmZmVyVHJhY2tCeSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRhdGFEaWZmZXIgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChzaG91bGRVcGRhdGUgJiYgdGhpcy5wbG90bHlJbnN0YW5jZSkge1xuICAgICAgdGhpcy51cGRhdGVQbG90KCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0V2luZG93KCk6IGFueSB7XG4gICAgcmV0dXJuIHdpbmRvdztcbiAgfVxuXG4gIGdldEJvdW5kaW5nQ2xpZW50UmVjdCgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWN0O1xuICB9XG5cbiAgZ2V0Q2xhc3NOYW1lKCk6IHN0cmluZyB7XG4gICAgbGV0IGNsYXNzZXMgPSBbdGhpcy5kZWZhdWx0Q2xhc3NOYW1lXTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLmNsYXNzTmFtZSkpIHtcbiAgICAgIGNsYXNzZXMgPSBjbGFzc2VzLmNvbmNhdCh0aGlzLmNsYXNzTmFtZSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmNsYXNzTmFtZSkge1xuICAgICAgY2xhc3Nlcy5wdXNoKHRoaXMuY2xhc3NOYW1lKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY2xhc3Nlcy5qb2luKCcgJyk7XG4gIH1cblxuICByZXN0eWxlQ2hhcnQocHJvcGVydGllczogYW55LCBjdXJ2ZXM6IGFueVtdKSB7XG4gICAgUGxvdGx5anMucmVzdHlsZSh0aGlzLnBsb3RseUluc3RhbmNlLCBwcm9wZXJ0aWVzLCBjdXJ2ZXMpO1xuICB9XG5cbiAgY3JlYXRlUGxvdCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2NyZWF0ZVBsb3QnXSwgdGhpcy5kYXRhLCB0aGlzLmxheW91dCwgdGhpcy5jb25maWcsIHRoaXMucGxvdGx5SW5zdGFuY2UpO1xuICAgIHJldHVybiBQbG90bHlqcy5yZWFjdCh0aGlzLnBsb3RFbC5uYXRpdmVFbGVtZW50LCB0aGlzLmRhdGEsIHRoaXMubGF5b3V0LCB0aGlzLmNvbmZpZykudGhlbihwbG90bHlJbnN0YW5jZSA9PiB7XG4gICAgICB0aGlzLnJlY3QgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICB0aGlzLnBsb3RseUluc3RhbmNlID0gcGxvdGx5SW5zdGFuY2U7XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3Bsb3RseUluc3RhbmNlJ10sIHBsb3RseUluc3RhbmNlKTtcbiAgICAgIHRoaXMuZ2V0V2luZG93KCkuZ2QgPSB0aGlzLmRlYnVnID8gcGxvdGx5SW5zdGFuY2UgOiB1bmRlZmluZWQ7XG5cbiAgICAgIHRoaXMuZXZlbnROYW1lcy5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgICBjb25zdCBldmVudE5hbWUgPSBgcGxvdGx5XyR7bmFtZS50b0xvd2VyQ2FzZSgpfWA7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgcGxvdGx5SW5zdGFuY2Uub24oZXZlbnROYW1lLCAoZGF0YTogYW55KSA9PiB7XG4gICAgICAgICAgdGhpcy5MT0cuZGVidWcoWydwbG90bHlFdmVudCcsIGV2ZW50TmFtZV0sIGRhdGEpO1xuICAgICAgICAgICh0aGlzW25hbWVdIGFzIEV2ZW50RW1pdHRlcjxhbnk+KS5lbWl0KGRhdGEpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBwbG90bHlJbnN0YW5jZS5vbigncGxvdGx5X2NsaWNrJywgKGRhdGE6IGFueSkgPT4ge1xuICAgICAgICB0aGlzLmNsaWNrLmVtaXQoZGF0YSk7XG4gICAgICAgIHRoaXMucGxvdGx5X2NsaWNrLmVtaXQoZGF0YSk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy51cGRhdGVXaW5kb3dSZXNpemVIYW5kbGVyKCk7XG4gICAgICB0aGlzLmFmdGVyUGxvdC5lbWl0KHBsb3RseUluc3RhbmNlKTtcbiAgICB9LCBlcnIgPT4ge1xuICAgICAgY29uc29sZS5lcnJvcignRXJyb3Igd2hpbGUgcGxvdHRpbmc6JywgZXJyKTtcbiAgICAgIHRoaXMuZXJyb3IuZW1pdChlcnIpO1xuICAgIH0pO1xuICB9XG5cbiAgY3JlYXRlRmlndXJlKCk6IEZpZ3VyZSB7XG4gICAgY29uc3QgcDogYW55ID0gdGhpcy5wbG90bHlJbnN0YW5jZTtcbiAgICByZXR1cm4ge1xuICAgICAgZGF0YTogcC5kYXRhLFxuICAgICAgbGF5b3V0OiBwLmxheW91dCxcbiAgICAgIGZyYW1lczogcC5fdHJhbnNpdGlvbkRhdGEgPyBwLl90cmFuc2l0aW9uRGF0YS5fZnJhbWVzIDogbnVsbFxuICAgIH07XG4gIH1cblxuICB1cGRhdGVQbG90KCkge1xuICAgIHRoaXMuTE9HLmRlYnVnKFsndXBkYXRlUGxvdCddLCB0aGlzLmRhdGEsIHRoaXMubGF5b3V0LCB7Li4udGhpcy5jb25maWd9KTtcbiAgICBpZiAoIXRoaXMucGxvdGx5SW5zdGFuY2UpIHtcbiAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKGBQbG90bHkgY29tcG9uZW50IHdhc24ndCBpbml0aWFsaXplZGApO1xuICAgICAgdGhpcy5lcnJvci5lbWl0KGVycm9yKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgUGxvdGx5anMucHVyZ2UodGhpcy5wbG90bHlJbnN0YW5jZSk7XG4gICAgdGhpcy5jcmVhdGVQbG90KCkudGhlbigoKSA9PiB7XG4gICAgICBjb25zdCBmaWd1cmUgPSB0aGlzLmNyZWF0ZUZpZ3VyZSgpO1xuICAgICAgdGhpcy51cGRhdGUuZW1pdChmaWd1cmUpO1xuICAgIH0sIGVyciA9PiB7XG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvciB3aGlsZSB1cGRhdGluZyBwbG90OicsIGVycik7XG4gICAgICB0aGlzLmVycm9yLmVtaXQoZXJyKTtcbiAgICB9KTtcbiAgfVxuXG4gIHVwZGF0ZVdpbmRvd1Jlc2l6ZUhhbmRsZXIoKSB7XG4gICAgaWYgKHRoaXMudXNlUmVzaXplSGFuZGxlcikge1xuICAgICAgaWYgKHRoaXMucmVzaXplSGFuZGxlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMucmVzaXplSGFuZGxlciA9ICgpID0+IHNldFRpbWVvdXQoKCkgPT4gUGxvdHMucmVzaXplKHRoaXMucGxvdGx5SW5zdGFuY2UpKTtcbiAgICAgICAgdGhpcy5nZXRXaW5kb3coKS5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLnJlc2l6ZUhhbmRsZXIgYXMgYW55KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHR5cGVvZiB0aGlzLnJlc2l6ZUhhbmRsZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhpcy5nZXRXaW5kb3coKS5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLnJlc2l6ZUhhbmRsZXIgYXMgYW55KTtcbiAgICAgICAgdGhpcy5yZXNpemVIYW5kbGVyID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGRhdGFEaWZmZXJUcmFja0J5KF86IG51bWJlciwgaXRlbTogYW55KTogYW55IHtcbiAgICBjb25zdCBvYmogPSBPYmplY3QuYXNzaWduKHt9LCBpdGVtLCB7dWlkOiAnJ30pO1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmopO1xuICB9XG5cblxuICByZW1vdmUoZGl2OiBQbG90bHlIVE1MRWxlbWVudCkge1xuICAgIFBsb3RseWpzLnB1cmdlKGRpdik7XG4gICAgZGVsZXRlIHRoaXMucGxvdGx5SW5zdGFuY2U7XG4gIH1cbn1cbiJdfQ==