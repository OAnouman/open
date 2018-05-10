import { AfterViewInit, Directive, ElementRef, Renderer2 } from '@angular/core';

/**
 * Generated class for the ParallaxHeaderDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[parallax-header]', // Attribute selector
  host: {
    '(ionScroll)': 'onContentScroll($event)',
    '(window:resize)': 'onWindowResize($event)'
  }
})
export class ParallaxHeaderDirective implements AfterViewInit {

  private _header: any;
  private _headerHeight: any;
  private _translateAmt: any;
  private _scaleAmt: any;

  constructor(
    private _elementRef: ElementRef,
    private _renderer: Renderer2) {
  }

  ngAfterViewInit() {

    const scrollContent = this._elementRef.nativeElement.getElementsByClassName('scroll-content')[0];
    const mainContent = this._elementRef.nativeElement.getElementsByClassName('main-content')[0];
    this._header = this._elementRef.nativeElement.getElementsByClassName('header-image')[0];

    this._headerHeight = this._header.clientHeight;

    this._renderer.setStyle(this._header, 'transform-origin', 'center bottom');
    this._renderer.setStyle(this._header, 'background-size', 'cover');

    this._renderer.setStyle(mainContent, 'position', 'absolute');

  }

  onWindowResize(event) {
    this._headerHeight = this._header.clientHeight;
  }

  onContentScroll(event) {

    event.domWrite(() => {
      this.updateParallaxHeader(event);
    })

  }

  updateParallaxHeader(event) {

    if (event.scrollTop >= 0) {
      this._translateAmt = event.scrollTop / 2;
      this._scaleAmt = 1;
    } else {
      this._translateAmt = 0;
      this._scaleAmt = - event.scrollTop / this._headerHeight + 1;
    }

    this._renderer.setStyle(this._header, 'transform', `translate3d(0,${this._translateAmt}px,0) scale(${this._scaleAmt},${this._scaleAmt})`);

  }

}
