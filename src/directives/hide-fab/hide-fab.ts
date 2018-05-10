import { AfterViewInit, Directive, ElementRef, Renderer2 } from '@angular/core';
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
    '(ionScroll)': 'handleScroll($event)',
  }
})
export class HideFabDirective implements AfterViewInit {

  private _fabRef: any;
  private _storedScroll: number = 0;
  private _threshold: number = 10;

  constructor(
    private _element: ElementRef,
    private _renderer: Renderer2) {

  }

  ngAfterViewInit() {

    this._fabRef = this._element.nativeElement.getElementsByClassName('fab')[0];
    this._renderer.setStyle(this._fabRef, 'transition', 'transform 500ms, top 500ms');

  }


  /**
   * Automatically hide fab when scrolling
   * 
   * @param {Content} event 
   * @memberof HideFabDirective
   */
  handleScroll(event: Content) {


    if ((event.scrollTop - this._storedScroll) > 0) {
      this._renderer.setStyle(this._fabRef, 'right', '-70px');
      this._renderer.setStyle(this._fabRef, 'transition', 'right .5s');
    } else if (event.scrollTop - this._storedScroll < 0) {
      this._renderer.setStyle(this._fabRef, 'right', '0');
      this._renderer.setStyle(this._fabRef, 'transition', 'right .5s');
    }

    // We store the last scroll position
    this._storedScroll = event.scrollTop;
  }

}
