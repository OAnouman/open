import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Ad } from '../../models/ad/ad.interface';
import { ModalController } from 'ionic-angular';

/**
 * Generated class for the AdsListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'ads-list',
  templateUrl: 'ads-list.html'
})
export class AdsListComponent {


  @Input() ads: Ad[];

  @Output() previewAd: EventEmitter<Ad>;
  @Output() selectedAd: EventEmitter<Ad>;

  constructor(
    private _modalCtrl: ModalController
  ) {

    this.previewAd = new EventEmitter<Ad>();
    this.selectedAd = new EventEmitter<Ad>();
  }

  selected(ad: Ad): void {

  }

  searchAd(): void {

  }

  preview(ad: Ad): void {

    this.previewAd.emit(ad);

  }

}
