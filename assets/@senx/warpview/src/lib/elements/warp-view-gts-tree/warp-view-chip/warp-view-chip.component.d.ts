import { AfterViewInit, ElementRef, EventEmitter, OnInit } from '@angular/core';
import { Param } from '../../../model/param';
/**
 *
 */
export declare class WarpViewChipComponent implements OnInit, AfterViewInit {
    chip: ElementRef;
    name: string;
    node: any;
    param: Param;
    options: Param;
    debug: boolean;
    hiddenData: number[];
    gtsFilter: string;
    kbdLastKeyPressed: string[];
    warpViewSelectedGTS: EventEmitter<any>;
    private LOG;
    private refreshCounter;
    private _gtsFilter;
    private _debug;
    private _kbdLastKeyPressed;
    private _hiddenData;
    _node: any;
    constructor();
    ngOnInit(): void;
    ngAfterViewInit(): void;
    private colorizeChip;
    toArray(obj: any): {
        name: string;
        value: any;
    }[];
    switchPlotState(event: UIEvent): boolean;
    private setState;
}
