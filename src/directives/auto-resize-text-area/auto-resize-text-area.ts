import { Directive, HostListener, OnInit, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { Content } from 'ionic-angular';

/**
 * Generated class for the AutoResizeTextAreaDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 * 
 * Inspired by 'Elastic text area component in Ionic Framework' article.
 * See https://competenepal.com/elastic-text-area-component-in-ionic-framework/
 * 
 * @author Martial Anouman 
 *  
 */
@Directive({
  selector: '[auto-resize]', // Attribute selector
  host: {
    '(ionChange)': 'resize($event)'
  }
})
export class AutoResizeTextAreaDirective implements AfterViewInit {

  private _textArea: any;

  constructor(
    private _element: ElementRef,
    private _renderer: Renderer2) {

  }

  ngAfterViewInit() {

    // We get textarea ref after view init to avoid multipe dom browering
    this._textArea = this._element.nativeElement.getElementsByTagName('textarea')[0];
    this._renderer.setStyle(this._textArea, 'overflow', 'hidden');

  }

  /**
   * Auto resizes text area to fit content
   * 
   * @param {Content} event 
   * @memberof AutoResizeTextAreaDirective
   */
  resize(event: Content) {

    this._renderer.setStyle(this._textArea, 'height', 'auto');

    this._renderer.setStyle(this._textArea, 'height', `${this._textArea.scrollHeight}px`)

    this._renderer.setStyle(this._textArea, 'transition', 'height .5s');

  }


}
