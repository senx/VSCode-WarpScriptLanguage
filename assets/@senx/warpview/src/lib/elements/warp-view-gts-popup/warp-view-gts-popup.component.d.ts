import { AfterViewInit, EventEmitter } from '@angular/core';
import { DataModel } from '../../model/dataModel';
import { WarpViewModalComponent } from '../warp-view-modal/warp-view-modal.component';
import { Param } from '../../model/param';
/**
 *
 */
export declare class WarpViewGtsPopupComponent implements AfterViewInit {
    modal: WarpViewModalComponent;
    options: Param | string;
    gtsList: DataModel;
    readonly gtslist: DataModel;
    debug: boolean;
    data: DataModel;
    hiddenData: number[];
    maxToShow: number;
    kbdLastKeyPressed: string[];
    warpViewSelectedGTS: EventEmitter<any>;
    warpViewModalOpen: EventEmitter<any>;
    warpViewModalClose: EventEmitter<any>;
    current: number;
    _gts: any[];
    _options: Param;
    private _kbdLastKeyPressed;
    private _hiddenData;
    private _debug;
    private _gtsList;
    private _data;
    private displayed;
    private modalOpenned;
    private LOG;
    constructor();
    ngAfterViewInit(): void;
    onWarpViewModalOpen(): void;
    onWarpViewModalClose(): void;
    isOpened(): Promise<boolean>;
    private showPopup;
    close(): void;
    private prepareData;
    isHidden(gts: any): boolean;
}
