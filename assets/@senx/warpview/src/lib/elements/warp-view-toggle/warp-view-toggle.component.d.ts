import { ElementRef, EventEmitter, OnInit } from '@angular/core';
/**
 *
 */
export declare class WarpViewToggleComponent implements OnInit {
    el: ElementRef;
    checked: boolean;
    text1: string;
    text2: string;
    stateChange: EventEmitter<any>;
    state: boolean;
    constructor(el: ElementRef);
    ngOnInit(): void;
    switched(): void;
}
