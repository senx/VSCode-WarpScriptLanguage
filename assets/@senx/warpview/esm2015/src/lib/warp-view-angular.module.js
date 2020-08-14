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
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarpViewChartComponent } from './elements/warp-view-chart/warp-view-chart.component';
import { WarpViewTileComponent } from './elements/warp-view-tile/warp-view-tile.component';
import { WarpViewSpinnerComponent } from './elements/warp-view-spinner/warp-view-spinner.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpErrorHandler } from './services/http-error-handler.service';
import { WarpViewToggleComponent } from './elements/warp-view-toggle/warp-view-toggle.component';
import { WarpViewBarComponent } from './elements/warp-view-bar/warp-view-bar.component';
import { WarpViewBubbleComponent } from './elements/warp-view-bubble/warp-view-bubble.component';
import { WarpViewDatagridComponent } from './elements/warp-view-datagrid/warp-view-datagrid.component';
import { WarpViewPaginableComponent } from './elements/warp-view-datagrid/warp-view-paginable/warp-view-paginable.component';
import { WarpViewDisplayComponent } from './elements/warp-view-display/warp-view-display.component';
import { WarpViewDrillDownComponent } from './elements/warp-view-drill-down/warp-view-drill-down.component';
import { CalendarHeatmapComponent } from './elements/warp-view-drill-down/calendar-heatmap/calendar-heatmap.component';
import { WarpViewGtsPopupComponent } from './elements/warp-view-gts-popup/warp-view-gts-popup.component';
import { WarpViewModalComponent } from './elements/warp-view-modal/warp-view-modal.component';
import { WarpViewGtsTreeComponent } from './elements/warp-view-gts-tree/warp-view-gts-tree.component';
import { WarpViewTreeViewComponent } from './elements/warp-view-gts-tree/warp-view-tree-view/warp-view-tree-view.component';
import { WarpViewChipComponent } from './elements/warp-view-gts-tree/warp-view-chip/warp-view-chip.component';
import { WarpViewImageComponent } from './elements/warp-view-image/warp-view-image.component';
import { WarpViewMapComponent } from './elements/warp-view-map/warp-view-map.component';
import { WarpViewHeatmapSlidersComponent } from './elements/warp-view-map/warp-view-heatmap-sliders/warp-view-heatmap-sliders.component';
import { WarpViewPieComponent } from './elements/warp-view-pie/warp-view-pie.component';
import { WarpViewGaugeComponent } from './elements/warp-view-gauge/warp-view-gauge.component';
import { WarpViewAnnotationComponent } from './elements/warp-view-annotation/warp-view-annotation.component';
import { WarpViewPolarComponent } from './elements/warp-view-polar/warp-view-polar.component';
import { WarpViewRadarComponent } from './elements/warp-view-radar/warp-view-radar.component';
import { WarpViewPlotComponent } from './elements/warp-view-plot/warp-view-plot.component';
import { WarpViewResizeComponent } from './elements/warp-view-resize/warp-view-resize.component';
import { WarpViewSliderComponent } from './elements/warp-view-slider/warp-view-slider.component';
import { WarpViewRangeSliderComponent } from './elements/warp-view-range-slider/warp-view-range-slider.component';
import { FormsModule } from '@angular/forms';
import { AngularResizedEventModule } from 'angular-resize-event';
import { SizeService } from './services/resize.service';
import { WarpViewSpectrumComponent } from './elements/warp-view-spectrum/warp-view-spectrum.component';
import { PlotlyComponent } from './plotly/plotly.component';
import { WarpViewBoxComponent } from './elements/warp-view-box/warp-view-box.component';
import { WarpView3dLineComponent } from './elements/warp-view-3d-line/warp-view-3d-line.component';
import { WarpViewGlobeComponent } from './elements/warp-view-globe/warp-view-globe.component';
import { WarpViewEventDropComponent } from './elements/warp-view-event-drop/warp-view-event-drop.component';
import { WarpViewResultTileComponent } from './elements/warp-view-result-tile/warp-view-result-tile.component';
export class WarpViewAngularModule {
}
WarpViewAngularModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    WarpViewTileComponent,
                    WarpViewChartComponent,
                    WarpViewSpinnerComponent,
                    WarpViewToggleComponent,
                    WarpViewBarComponent,
                    WarpViewBubbleComponent,
                    WarpViewDatagridComponent,
                    WarpViewPaginableComponent,
                    WarpViewDisplayComponent,
                    WarpViewDrillDownComponent,
                    CalendarHeatmapComponent,
                    WarpViewGtsPopupComponent,
                    WarpViewModalComponent,
                    WarpViewGtsTreeComponent,
                    WarpViewTreeViewComponent,
                    WarpViewChipComponent,
                    WarpViewImageComponent,
                    WarpViewMapComponent,
                    WarpViewHeatmapSlidersComponent,
                    WarpViewPieComponent,
                    WarpViewGaugeComponent,
                    WarpViewAnnotationComponent,
                    WarpViewPolarComponent,
                    WarpViewRadarComponent,
                    WarpViewPlotComponent,
                    WarpViewResizeComponent,
                    WarpViewSliderComponent,
                    WarpViewRangeSliderComponent,
                    WarpViewSpectrumComponent,
                    PlotlyComponent,
                    WarpViewBoxComponent,
                    WarpView3dLineComponent,
                    WarpViewGlobeComponent,
                    WarpViewEventDropComponent,
                    WarpViewResultTileComponent
                ],
                imports: [
                    CommonModule,
                    HttpClientModule,
                    AngularResizedEventModule,
                    FormsModule
                ],
                exports: [
                    WarpViewTileComponent,
                    WarpViewChartComponent,
                    WarpViewSpinnerComponent,
                    WarpViewToggleComponent,
                    WarpViewBarComponent,
                    WarpViewBubbleComponent,
                    WarpViewDatagridComponent,
                    WarpViewPaginableComponent,
                    WarpViewDisplayComponent,
                    WarpViewDrillDownComponent,
                    CalendarHeatmapComponent,
                    WarpViewGtsPopupComponent,
                    WarpViewModalComponent,
                    WarpViewGtsTreeComponent,
                    WarpViewTreeViewComponent,
                    WarpViewChipComponent,
                    WarpViewImageComponent,
                    WarpViewMapComponent,
                    WarpViewHeatmapSlidersComponent,
                    WarpViewPieComponent,
                    WarpViewGaugeComponent,
                    WarpViewAnnotationComponent,
                    WarpViewPolarComponent,
                    WarpViewRadarComponent,
                    WarpViewPlotComponent,
                    WarpViewResizeComponent,
                    WarpViewSliderComponent,
                    WarpViewRangeSliderComponent,
                    WarpViewSpectrumComponent,
                    WarpViewBoxComponent,
                    WarpView3dLineComponent,
                    WarpViewGlobeComponent,
                    WarpViewEventDropComponent,
                    WarpViewResultTileComponent
                ],
                providers: [HttpErrorHandler, SizeService],
                entryComponents: [
                    WarpViewTileComponent,
                    WarpViewChartComponent,
                    WarpViewSpinnerComponent,
                    WarpViewToggleComponent,
                    WarpViewBarComponent,
                    WarpViewBubbleComponent,
                    WarpViewDatagridComponent,
                    WarpViewPaginableComponent,
                    WarpViewDisplayComponent,
                    WarpViewDrillDownComponent,
                    CalendarHeatmapComponent,
                    WarpViewGtsPopupComponent,
                    WarpViewModalComponent,
                    WarpViewGtsTreeComponent,
                    WarpViewTreeViewComponent,
                    WarpViewChipComponent,
                    WarpViewImageComponent,
                    WarpViewMapComponent,
                    WarpViewHeatmapSlidersComponent,
                    WarpViewPieComponent,
                    WarpViewGaugeComponent,
                    WarpViewAnnotationComponent,
                    WarpViewPolarComponent,
                    WarpViewRadarComponent,
                    WarpViewPlotComponent,
                    WarpViewResizeComponent,
                    WarpViewSliderComponent,
                    WarpViewRangeSliderComponent,
                    WarpViewSpectrumComponent,
                    PlotlyComponent,
                    WarpViewBoxComponent,
                    WarpView3dLineComponent,
                    WarpViewGlobeComponent,
                    WarpViewEventDropComponent,
                    WarpViewResultTileComponent
                ]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LWFuZ3VsYXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHNlbngvd2FycHZpZXcvIiwic291cmNlcyI6WyJzcmMvbGliL3dhcnAtdmlldy1hbmd1bGFyLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSxzREFBc0QsQ0FBQztBQUM1RixPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxvREFBb0QsQ0FBQztBQUN6RixPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSwwREFBMEQsQ0FBQztBQUNsRyxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUN0RCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSx1Q0FBdUMsQ0FBQztBQUN2RSxPQUFPLEVBQUMsdUJBQXVCLEVBQUMsTUFBTSx3REFBd0QsQ0FBQztBQUMvRixPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSxrREFBa0QsQ0FBQztBQUN0RixPQUFPLEVBQUMsdUJBQXVCLEVBQUMsTUFBTSx3REFBd0QsQ0FBQztBQUMvRixPQUFPLEVBQUMseUJBQXlCLEVBQUMsTUFBTSw0REFBNEQsQ0FBQztBQUNyRyxPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSxpRkFBaUYsQ0FBQztBQUMzSCxPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSwwREFBMEQsQ0FBQztBQUNsRyxPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSxnRUFBZ0UsQ0FBQztBQUMxRyxPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSw2RUFBNkUsQ0FBQztBQUNySCxPQUFPLEVBQUMseUJBQXlCLEVBQUMsTUFBTSw4REFBOEQsQ0FBQztBQUN2RyxP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QjtvQkFDdkIsdUJBQXVCO29CQUN2Qiw0QkFBNEI7b0JBQzVCLHlCQUF5QjtvQkFDekIsZUFBZTtvQkFDZixvQkFBb0I7b0JBQ3BCLHVCQUF1QjtvQkFDdkIsc0JBQXNCO29CQUN0QiwwQkFBMEI7b0JBQzFCLDJCQUEyQjtpQkFDNUI7YUFDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQ29weXJpZ2h0IDIwMjAgIFNlblggUy5BLlMuXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKi9cblxuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7V2FycFZpZXdDaGFydENvbXBvbmVudH0gZnJvbSAnLi9lbGVtZW50cy93YXJwLXZpZXctY2hhcnQvd2FycC12aWV3LWNoYXJ0LmNvbXBvbmVudCc7XG5pbXBvcnQge1dhcnBWaWV3VGlsZUNvbXBvbmVudH0gZnJvbSAnLi9lbGVtZW50cy93YXJwLXZpZXctdGlsZS93YXJwLXZpZXctdGlsZS5jb21wb25lbnQnO1xuaW1wb3J0IHtXYXJwVmlld1NwaW5uZXJDb21wb25lbnR9IGZyb20gJy4vZWxlbWVudHMvd2FycC12aWV3LXNwaW5uZXIvd2FycC12aWV3LXNwaW5uZXIuY29tcG9uZW50JztcbmltcG9ydCB7SHR0cENsaWVudE1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHtIdHRwRXJyb3JIYW5kbGVyfSBmcm9tICcuL3NlcnZpY2VzL2h0dHAtZXJyb3ItaGFuZGxlci5zZXJ2aWNlJztcbmltcG9ydCB7V2FycFZpZXdUb2dnbGVDb21wb25lbnR9IGZyb20gJy4vZWxlbWVudHMvd2FycC12aWV3LXRvZ2dsZS93YXJwLXZpZXctdG9nZ2xlLmNvbXBvbmVudCc7XG5pbXBvcnQge1dhcnBWaWV3QmFyQ29tcG9uZW50fSBmcm9tICcuL2VsZW1lbnRzL3dhcnAtdmlldy1iYXIvd2FycC12aWV3LWJhci5jb21wb25lbnQnO1xuaW1wb3J0IHtXYXJwVmlld0J1YmJsZUNvbXBvbmVudH0gZnJvbSAnLi9lbGVtZW50cy93YXJwLXZpZXctYnViYmxlL3dhcnAtdmlldy1idWJibGUuY29tcG9uZW50JztcbmltcG9ydCB7V2FycFZpZXdEYXRhZ3JpZENvbXBvbmVudH0gZnJvbSAnLi9lbGVtZW50cy93YXJwLXZpZXctZGF0YWdyaWQvd2FycC12aWV3LWRhdGFncmlkLmNvbXBvbmVudCc7XG5pbXBvcnQge1dhcnBWaWV3UGFnaW5hYmxlQ29tcG9uZW50fSBmcm9tICcuL2VsZW1lbnRzL3dhcnAtdmlldy1kYXRhZ3JpZC93YXJwLXZpZXctcGFnaW5hYmxlL3dhcnAtdmlldy1wYWdpbmFibGUuY29tcG9uZW50JztcbmltcG9ydCB7V2FycFZpZXdEaXNwbGF5Q29tcG9uZW50fSBmcm9tICcuL2VsZW1lbnRzL3dhcnAtdmlldy1kaXNwbGF5L3dhcnAtdmlldy1kaXNwbGF5LmNvbXBvbmVudCc7XG5pbXBvcnQge1dhcnBWaWV3RHJpbGxEb3duQ29tcG9uZW50fSBmcm9tICcuL2VsZW1lbnRzL3dhcnAtdmlldy1kcmlsbC1kb3duL3dhcnAtdmlldy1kcmlsbC1kb3duLmNvbXBvbmVudCc7XG5pbXBvcnQge0NhbGVuZGFySGVhdG1hcENvbXBvbmVudH0gZnJvbSAnLi9lbGVtZW50cy93YXJwLXZpZXctZHJpbGwtZG93bi9jYWxlbmRhci1oZWF0bWFwL2NhbGVuZGFyLWhlYXRtYXAuY29tcG9uZW50JztcbmltcG9ydCB7V2FycFZpZXdHdHNQb3B1cENvbXBvbmVudH0gZnJvbSAnLi9lbGVtZW50cy93YXJwLXZpZXctZ3RzLXBvcHVwL3dhcnAtdmlldy1ndHMtcG9wdXAuY29tcG9uZW50JztcbmltcG9ydCB7V2FycFZpZXdNb2RhbENvbXBvbmVudH0gZnJvbSAnLi9lbGVtZW50cy93YXJwLXZpZXctbW9kYWwvd2FycC12aWV3LW1vZGFsLmNvbXBvbmVudCc7XG5pbXBvcnQge1dhcnBWaWV3R3RzVHJlZUNvbXBvbmVudH0gZnJvbSAnLi9lbGVtZW50cy93YXJwLXZpZXctZ3RzLXRyZWUvd2FycC12aWV3LWd0cy10cmVlLmNvbXBvbmVudCc7XG5pbXBvcnQge1dhcnBWaWV3VHJlZVZpZXdDb21wb25lbnR9IGZyb20gJy4vZWxlbWVudHMvd2FycC12aWV3LWd0cy10cmVlL3dhcnAtdmlldy10cmVlLXZpZXcvd2FycC12aWV3LXRyZWUtdmlldy5jb21wb25lbnQnO1xuaW1wb3J0IHtXYXJwVmlld0NoaXBDb21wb25lbnR9IGZyb20gJy4vZWxlbWVudHMvd2FycC12aWV3LWd0cy10cmVlL3dhcnAtdmlldy1jaGlwL3dhcnAtdmlldy1jaGlwLmNvbXBvbmVudCc7XG5pbXBvcnQge1dhcnBWaWV3SW1hZ2VDb21wb25lbnR9IGZyb20gJy4vZWxlbWVudHMvd2FycC12aWV3LWltYWdlL3dhcnAtdmlldy1pbWFnZS5jb21wb25lbnQnO1xuaW1wb3J0IHtXYXJwVmlld01hcENvbXBvbmVudH0gZnJvbSAnLi9lbGVtZW50cy93YXJwLXZpZXctbWFwL3dhcnAtdmlldy1tYXAuY29tcG9uZW50JztcbmltcG9ydCB7V2FycFZpZXdIZWF0bWFwU2xpZGVyc0NvbXBvbmVudH0gZnJvbSAnLi9lbGVtZW50cy93YXJwLXZpZXctbWFwL3dhcnAtdmlldy1oZWF0bWFwLXNsaWRlcnMvd2FycC12aWV3LWhlYXRtYXAtc2xpZGVycy5jb21wb25lbnQnO1xuaW1wb3J0IHtXYXJwVmlld1BpZUNvbXBvbmVudH0gZnJvbSAnLi9lbGVtZW50cy93YXJwLXZpZXctcGllL3dhcnAtdmlldy1waWUuY29tcG9uZW50JztcbmltcG9ydCB7V2FycFZpZXdHYXVnZUNvbXBvbmVudH0gZnJvbSAnLi9lbGVtZW50cy93YXJwLXZpZXctZ2F1Z2Uvd2FycC12aWV3LWdhdWdlLmNvbXBvbmVudCc7XG5pbXBvcnQge1dhcnBWaWV3QW5ub3RhdGlvbkNvbXBvbmVudH0gZnJvbSAnLi9lbGVtZW50cy93YXJwLXZpZXctYW5ub3RhdGlvbi93YXJwLXZpZXctYW5ub3RhdGlvbi5jb21wb25lbnQnO1xuaW1wb3J0IHtXYXJwVmlld1BvbGFyQ29tcG9uZW50fSBmcm9tICcuL2VsZW1lbnRzL3dhcnAtdmlldy1wb2xhci93YXJwLXZpZXctcG9sYXIuY29tcG9uZW50JztcbmltcG9ydCB7V2FycFZpZXdSYWRhckNvbXBvbmVudH0gZnJvbSAnLi9lbGVtZW50cy93YXJwLXZpZXctcmFkYXIvd2FycC12aWV3LXJhZGFyLmNvbXBvbmVudCc7XG5pbXBvcnQge1dhcnBWaWV3UGxvdENvbXBvbmVudH0gZnJvbSAnLi9lbGVtZW50cy93YXJwLXZpZXctcGxvdC93YXJwLXZpZXctcGxvdC5jb21wb25lbnQnO1xuaW1wb3J0IHtXYXJwVmlld1Jlc2l6ZUNvbXBvbmVudH0gZnJvbSAnLi9lbGVtZW50cy93YXJwLXZpZXctcmVzaXplL3dhcnAtdmlldy1yZXNpemUuY29tcG9uZW50JztcbmltcG9ydCB7V2FycFZpZXdTbGlkZXJDb21wb25lbnR9IGZyb20gJy4vZWxlbWVudHMvd2FycC12aWV3LXNsaWRlci93YXJwLXZpZXctc2xpZGVyLmNvbXBvbmVudCc7XG5pbXBvcnQge1dhcnBWaWV3UmFuZ2VTbGlkZXJDb21wb25lbnR9IGZyb20gJy4vZWxlbWVudHMvd2FycC12aWV3LXJhbmdlLXNsaWRlci93YXJwLXZpZXctcmFuZ2Utc2xpZGVyLmNvbXBvbmVudCc7XG5pbXBvcnQge0Zvcm1zTW9kdWxlfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge0FuZ3VsYXJSZXNpemVkRXZlbnRNb2R1bGV9IGZyb20gJ2FuZ3VsYXItcmVzaXplLWV2ZW50JztcbmltcG9ydCB7U2l6ZVNlcnZpY2V9IGZyb20gJy4vc2VydmljZXMvcmVzaXplLnNlcnZpY2UnO1xuaW1wb3J0IHtXYXJwVmlld1NwZWN0cnVtQ29tcG9uZW50fSBmcm9tICcuL2VsZW1lbnRzL3dhcnAtdmlldy1zcGVjdHJ1bS93YXJwLXZpZXctc3BlY3RydW0uY29tcG9uZW50JztcbmltcG9ydCB7UGxvdGx5Q29tcG9uZW50fSBmcm9tICcuL3Bsb3RseS9wbG90bHkuY29tcG9uZW50JztcbmltcG9ydCB7V2FycFZpZXdCb3hDb21wb25lbnR9IGZyb20gJy4vZWxlbWVudHMvd2FycC12aWV3LWJveC93YXJwLXZpZXctYm94LmNvbXBvbmVudCc7XG5pbXBvcnQge1dhcnBWaWV3M2RMaW5lQ29tcG9uZW50fSBmcm9tICcuL2VsZW1lbnRzL3dhcnAtdmlldy0zZC1saW5lL3dhcnAtdmlldy0zZC1saW5lLmNvbXBvbmVudCc7XG5pbXBvcnQge1dhcnBWaWV3R2xvYmVDb21wb25lbnR9IGZyb20gJy4vZWxlbWVudHMvd2FycC12aWV3LWdsb2JlL3dhcnAtdmlldy1nbG9iZS5jb21wb25lbnQnO1xuaW1wb3J0IHtXYXJwVmlld0V2ZW50RHJvcENvbXBvbmVudH0gZnJvbSAnLi9lbGVtZW50cy93YXJwLXZpZXctZXZlbnQtZHJvcC93YXJwLXZpZXctZXZlbnQtZHJvcC5jb21wb25lbnQnO1xuaW1wb3J0IHtXYXJwVmlld1Jlc3VsdFRpbGVDb21wb25lbnR9IGZyb20gJy4vZWxlbWVudHMvd2FycC12aWV3LXJlc3VsdC10aWxlL3dhcnAtdmlldy1yZXN1bHQtdGlsZS5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBXYXJwVmlld1RpbGVDb21wb25lbnQsXG4gICAgV2FycFZpZXdDaGFydENvbXBvbmVudCxcbiAgICBXYXJwVmlld1NwaW5uZXJDb21wb25lbnQsXG4gICAgV2FycFZpZXdUb2dnbGVDb21wb25lbnQsXG4gICAgV2FycFZpZXdCYXJDb21wb25lbnQsXG4gICAgV2FycFZpZXdCdWJibGVDb21wb25lbnQsXG4gICAgV2FycFZpZXdEYXRhZ3JpZENvbXBvbmVudCxcbiAgICBXYXJwVmlld1BhZ2luYWJsZUNvbXBvbmVudCxcbiAgICBXYXJwVmlld0Rpc3BsYXlDb21wb25lbnQsXG4gICAgV2FycFZpZXdEcmlsbERvd25Db21wb25lbnQsXG4gICAgQ2FsZW5kYXJIZWF0bWFwQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3R3RzUG9wdXBDb21wb25lbnQsXG4gICAgV2FycFZpZXdNb2RhbENvbXBvbmVudCxcbiAgICBXYXJwVmlld0d0c1RyZWVDb21wb25lbnQsXG4gICAgV2FycFZpZXdUcmVlVmlld0NvbXBvbmVudCxcbiAgICBXYXJwVmlld0NoaXBDb21wb25lbnQsXG4gICAgV2FycFZpZXdJbWFnZUNvbXBvbmVudCxcbiAgICBXYXJwVmlld01hcENvbXBvbmVudCxcbiAgICBXYXJwVmlld0hlYXRtYXBTbGlkZXJzQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3UGllQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3R2F1Z2VDb21wb25lbnQsXG4gICAgV2FycFZpZXdBbm5vdGF0aW9uQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3UG9sYXJDb21wb25lbnQsXG4gICAgV2FycFZpZXdSYWRhckNvbXBvbmVudCxcbiAgICBXYXJwVmlld1Bsb3RDb21wb25lbnQsXG4gICAgV2FycFZpZXdSZXNpemVDb21wb25lbnQsXG4gICAgV2FycFZpZXdTbGlkZXJDb21wb25lbnQsXG4gICAgV2FycFZpZXdSYW5nZVNsaWRlckNvbXBvbmVudCxcbiAgICBXYXJwVmlld1NwZWN0cnVtQ29tcG9uZW50LFxuICAgIFBsb3RseUNvbXBvbmVudCxcbiAgICBXYXJwVmlld0JveENvbXBvbmVudCxcbiAgICBXYXJwVmlldzNkTGluZUNvbXBvbmVudCxcbiAgICBXYXJwVmlld0dsb2JlQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3RXZlbnREcm9wQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3UmVzdWx0VGlsZUNvbXBvbmVudFxuICBdLFxuICBpbXBvcnRzOiBbXG4gICAgQ29tbW9uTW9kdWxlLFxuICAgIEh0dHBDbGllbnRNb2R1bGUsXG4gICAgQW5ndWxhclJlc2l6ZWRFdmVudE1vZHVsZSxcbiAgICBGb3Jtc01vZHVsZVxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgV2FycFZpZXdUaWxlQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3Q2hhcnRDb21wb25lbnQsXG4gICAgV2FycFZpZXdTcGlubmVyQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3VG9nZ2xlQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3QmFyQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3QnViYmxlQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3RGF0YWdyaWRDb21wb25lbnQsXG4gICAgV2FycFZpZXdQYWdpbmFibGVDb21wb25lbnQsXG4gICAgV2FycFZpZXdEaXNwbGF5Q29tcG9uZW50LFxuICAgIFdhcnBWaWV3RHJpbGxEb3duQ29tcG9uZW50LFxuICAgIENhbGVuZGFySGVhdG1hcENvbXBvbmVudCxcbiAgICBXYXJwVmlld0d0c1BvcHVwQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3TW9kYWxDb21wb25lbnQsXG4gICAgV2FycFZpZXdHdHNUcmVlQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3VHJlZVZpZXdDb21wb25lbnQsXG4gICAgV2FycFZpZXdDaGlwQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3SW1hZ2VDb21wb25lbnQsXG4gICAgV2FycFZpZXdNYXBDb21wb25lbnQsXG4gICAgV2FycFZpZXdIZWF0bWFwU2xpZGVyc0NvbXBvbmVudCxcbiAgICBXYXJwVmlld1BpZUNvbXBvbmVudCxcbiAgICBXYXJwVmlld0dhdWdlQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3QW5ub3RhdGlvbkNvbXBvbmVudCxcbiAgICBXYXJwVmlld1BvbGFyQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3UmFkYXJDb21wb25lbnQsXG4gICAgV2FycFZpZXdQbG90Q29tcG9uZW50LFxuICAgIFdhcnBWaWV3UmVzaXplQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3U2xpZGVyQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3UmFuZ2VTbGlkZXJDb21wb25lbnQsXG4gICAgV2FycFZpZXdTcGVjdHJ1bUNvbXBvbmVudCxcbiAgICBXYXJwVmlld0JveENvbXBvbmVudCxcbiAgICBXYXJwVmlldzNkTGluZUNvbXBvbmVudCxcbiAgICBXYXJwVmlld0dsb2JlQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3RXZlbnREcm9wQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3UmVzdWx0VGlsZUNvbXBvbmVudFxuICBdLFxuICBwcm92aWRlcnM6IFtIdHRwRXJyb3JIYW5kbGVyLCBTaXplU2VydmljZV0sXG4gIGVudHJ5Q29tcG9uZW50czogW1xuICAgIFdhcnBWaWV3VGlsZUNvbXBvbmVudCxcbiAgICBXYXJwVmlld0NoYXJ0Q29tcG9uZW50LFxuICAgIFdhcnBWaWV3U3Bpbm5lckNvbXBvbmVudCxcbiAgICBXYXJwVmlld1RvZ2dsZUNvbXBvbmVudCxcbiAgICBXYXJwVmlld0JhckNvbXBvbmVudCxcbiAgICBXYXJwVmlld0J1YmJsZUNvbXBvbmVudCxcbiAgICBXYXJwVmlld0RhdGFncmlkQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3UGFnaW5hYmxlQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3RGlzcGxheUNvbXBvbmVudCxcbiAgICBXYXJwVmlld0RyaWxsRG93bkNvbXBvbmVudCxcbiAgICBDYWxlbmRhckhlYXRtYXBDb21wb25lbnQsXG4gICAgV2FycFZpZXdHdHNQb3B1cENvbXBvbmVudCxcbiAgICBXYXJwVmlld01vZGFsQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3R3RzVHJlZUNvbXBvbmVudCxcbiAgICBXYXJwVmlld1RyZWVWaWV3Q29tcG9uZW50LFxuICAgIFdhcnBWaWV3Q2hpcENvbXBvbmVudCxcbiAgICBXYXJwVmlld0ltYWdlQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3TWFwQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3SGVhdG1hcFNsaWRlcnNDb21wb25lbnQsXG4gICAgV2FycFZpZXdQaWVDb21wb25lbnQsXG4gICAgV2FycFZpZXdHYXVnZUNvbXBvbmVudCxcbiAgICBXYXJwVmlld0Fubm90YXRpb25Db21wb25lbnQsXG4gICAgV2FycFZpZXdQb2xhckNvbXBvbmVudCxcbiAgICBXYXJwVmlld1JhZGFyQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3UGxvdENvbXBvbmVudCxcbiAgICBXYXJwVmlld1Jlc2l6ZUNvbXBvbmVudCxcbiAgICBXYXJwVmlld1NsaWRlckNvbXBvbmVudCxcbiAgICBXYXJwVmlld1JhbmdlU2xpZGVyQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3U3BlY3RydW1Db21wb25lbnQsXG4gICAgUGxvdGx5Q29tcG9uZW50LFxuICAgIFdhcnBWaWV3Qm94Q29tcG9uZW50LFxuICAgIFdhcnBWaWV3M2RMaW5lQ29tcG9uZW50LFxuICAgIFdhcnBWaWV3R2xvYmVDb21wb25lbnQsXG4gICAgV2FycFZpZXdFdmVudERyb3BDb21wb25lbnQsXG4gICAgV2FycFZpZXdSZXN1bHRUaWxlQ29tcG9uZW50XG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgV2FycFZpZXdBbmd1bGFyTW9kdWxlIHtcbn1cbiJdfQ==