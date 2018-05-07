import { Component, Input, Output, EventEmitter, AfterViewInit, OnInit } from '@angular/core';
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
export class AdsListComponent implements OnInit {

  ads$: Observable<Ad[]>;
  @Output() previewAd: EventEmitter<Ad>;
  @Output() selectedAd: EventEmitter<Ad>;
  offset: number = 1000;
  startLimit: number = 5;

  ads: Ad[];

  constructor(
    private _modalCtrl: ModalController,
    private _dataPvd: DataProvider) {

    this.previewAd = new EventEmitter<Ad>();
    this.selectedAd = new EventEmitter<Ad>();

  }

  ngOnInit(): void {

    // Get ads

    this.ads$ = this._dataPvd.getAds(this.startLimit);

    this.ads$.subscribe((ads: Ad[]) => {

      this.ads = ads;

    })

  }

  searchAd(): void {

  }

  preview(ad: Ad): void {

    this.previewAd.emit(ad);

  }

  displayMoreContent(infiniteScroll) {

    let limit = this.startLimit + 3;

    this._dataPvd.getAds(limit)
      .subscribe((ad: Ad[]) => {

        ad.slice(this.startLimit, limit).forEach(ad => this.ads.push(ad));

        this.startLimit = limit;

        infiniteScroll.complete();

      });

  }


}
