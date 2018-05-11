import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Loading, LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Ad } from '../../models/ad/ad.interface';
import { DataProvider } from '../../providers/data/data';

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

  @Output() previewAd: EventEmitter<Ad>;

  ads$: Observable<Ad[]>;
  offset: number = 10000;
  startLimit: number = 5;
  ads: Ad[];
  sortLabel: string = 'Toutes les annonces';
  displayedCategory: string;
  private _loadingInstance: Loading;

  constructor(
    private _dataPvd: DataProvider,
    private _loadingCtrl: LoadingController) {

    this.previewAd = new EventEmitter<Ad>();

  }

  ngOnInit(): void {

    this._loadingInstance = this._loadingCtrl.create({ content: 'Chargement des annonces...' });

    this._loadingInstance.present();

    this.getAds();

  }

  /**
   * Get ads
   * 
   * @memberof AdsListComponent
   */
  getAds() {

    this.ads$ = this._dataPvd.getAds(this.startLimit, this.displayedCategory);

    this.ads$.subscribe((ads: Ad[]) => {

      this.ads = ads;

      this._loadingInstance.dismiss();

    })

  }


  searchAd(): void {

  }


  /**
   * Get ads 
   * 
   * @param {*} category from @class HomePage
   * @memberof AdsListComponent
   */
  sortByCategories(category: any) {

    this.sortLabel = category.label;

    this.displayedCategory = category.value;

    // Trigger a new search

    this.getAds();

  }

  /**
   * Pass selected ad to @class HomePage to be displayed
   * 
   * @param {Ad} ad 
   * @memberof AdsListComponent
   */
  preview(ad: Ad): void {

    this.previewAd.emit(ad);

  }

  /**
   * Fetch more content from firestore 
   * according to sort criterias
   * 
   * @param {any} infiniteScroll 
   * @memberof AdsListComponent
   */
  displayMoreContent(infiniteScroll) {

    let limit = this.startLimit + 3;

    this._dataPvd.getAds(limit, this.displayedCategory)
      .subscribe((ad: Ad[]) => {

        ad.slice(this.startLimit, limit).forEach(ad => this.ads.push(ad));

        this.startLimit = limit;

        infiniteScroll.complete();

      });

  }


}
