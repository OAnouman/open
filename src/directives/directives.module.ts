import { NgModule } from '@angular/core';
import { HideFabDirective } from './hide-fab/hide-fab';
import { AutoResizeTextAreaDirective } from './auto-resize-text-area/auto-resize-text-area';
@NgModule({
	declarations: [HideFabDirective,
    AutoResizeTextAreaDirective],
	imports: [],
	exports: [HideFabDirective,
    AutoResizeTextAreaDirective]
})
export class DirectivesModule {}
