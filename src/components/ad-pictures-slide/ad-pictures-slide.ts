import { Component, Input } from '@angular/core';

/**
 * Generated class for the AdPicturesSlideComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'ad-pictures-slide',
  templateUrl: 'ad-pictures-slide.html'
})
export class AdPicturesSlideComponent {
  @Input() picturesUrls: string[];

  constructor() {}
}
