import { ElementRef, NgZone, OnInit, Renderer2 } from '@angular/core';
import { WarpViewComponent } from '../warp-view-component';
import { SizeService } from '../../services/resize.service';
import { Param } from '../../model/param';
import { DataModel } from '../../model/dataModel';
export declare class WarpViewGlobeComponent extends WarpViewComponent implements OnInit {
    el: ElementRef;
    renderer: Renderer2;
    sizeService: SizeService;
    ngZone: NgZone;
    type: string;
    layout: Partial<any>;
    private _type;
    private geoData;
    constructor(el: ElementRef, renderer: Renderer2, sizeService: SizeService, ngZone: NgZone);
    ngOnInit(): void;
    update(options: Param): void;
    private drawChart;
    protected convert(data: DataModel): Partial<any>[];
    private buildGraph;
}
