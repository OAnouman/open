import { Directive, ElementRef, Renderer, AfterViewInit } from '@angular/core';
import { Content } from 'ionic-angular';

/**
 * Generated class for the HideFabDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[hide-fab]', // Attribute selector
  host: {
    '(ionScroll)': 'handleScroll($event)'
  }
})
export class HideFabDirective implements AfterViewInit {

  private _fabRef: any;
  private _storedScroll: number = 0;
  private _threshold: number = 10;

  constructor(
    private _element: ElementRef,
    private _renderer: Renderer) {

  }

  ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.

    this._fabRef = this._element.nativeElement.getElementsByClassName('fab')[0];
    this._renderer.setElementStyle(this._fabRef, 'transition', 'transform 500ms, top 500ms');

  }

  handleScroll(event: Content) {

    if ((event.scrollTop - this._storedScroll) > 0) {
      this._renderer.setElementStyle(this._fabRef, 'top', '70px');
      this._renderer.setElementStyle(this._fabRef, 'transition', 'top .5s');
    } else if (event.scrollTop - this._storedScroll < 0) {
      this._renderer.setElementStyle(this._fabRef, 'top', '0');
      this._renderer.setElementStyle(this._fabRef, 'transition', 'top .5s');
    }

    // We store the last scroll position
    this._storedScroll = event.scrollTop;
  }

}
