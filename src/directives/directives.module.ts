import { NgModule } from '@angular/core';
import { HideFabDirective } from './hide-fab/hide-fab';
import { AutoResizeTextAreaDirective } from './auto-resize-text-area/auto-resize-text-area';
import { ParallaxHeaderDirective } from './parallax-header/parallax-header';
@NgModule({
	declarations: [HideFabDirective,
    AutoResizeTextAreaDirective,
    ParallaxHeaderDirective],
	imports: [],
	exports: [HideFabDirective,
    AutoResizeTextAreaDirective,
    ParallaxHeaderDirective]
})
export class DirectivesModule {}
