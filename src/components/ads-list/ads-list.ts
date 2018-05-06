import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Ad } from '../../models/ad/ad.interface';
import { ModalController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { Observable } from 'rxjs/Observable';
// import { ADS_LIST } from "../../mocks/ads/ad.mocks";

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


  @Input() ads: Observable<Ad[]>;

  @Output() previewAd: EventEmitter<Ad>;
  @Output() selectedAd: EventEmitter<Ad>;

  constructor(
    private _modalCtrl: ModalController,
    private _dataPvd: DataProvider) {

    this.previewAd = new EventEmitter<Ad>();
    this.selectedAd = new EventEmitter<Ad>();
  }

  searchAd(): void {

  }

  preview(ad: Ad): void {

    this.previewAd.emit(ad);

  }

  displayMoreContent(infiniteScroll) {



    infiniteScroll.complete();
  }

}
