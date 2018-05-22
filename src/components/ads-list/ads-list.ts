import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  OnDestroy
} from "@angular/core";
import { Storage } from "@ionic/storage";
import { Loading, LoadingController, ToastController } from "ionic-angular";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/forkJoin";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import { Ad } from "../../models/ad/ad.interface";
import { Profile } from "../../models/profile/profile.interface";
import { DataProvider } from "../../providers/data/data";
import { Subscription } from "rxjs/Subscription";

// import { ADS_LIST } from "../../mocks/ads/ad.mocks";

/**
 * Generated class for the AdsListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: "ads-list",
  templateUrl: "ads-list.html"
})
export class AdsListComponent implements OnInit, OnDestroy {
  @Output() previewAd: EventEmitter<Ad>;

  ads$: Observable<Ad[]>;
  private _adsSubscription: Subscription;
  offset: number = 10000;
  startLimit: number = 5;
  ads: Ad[];
  sortLabel: string = "Toutes les annonces";
  displayedCategory: string;
  notFavorite: string = "heart-outline";
  favorite: string = "heart";
  private _uid: string;
  private _loadingInstance: Loading;
  private _userProfile: Profile;
  constructor(
    private _dataPvd: DataProvider,
    private _loadingCtrl: LoadingController,
    private _storage: Storage,
    private _toastCtrl: ToastController
  ) {
    this.previewAd = new EventEmitter<Ad>();
  }

  ngOnInit(): void {
    this._loadingInstance = this._loadingCtrl.create({
      content: "Chargement des annonces..."
    });

    this._loadingInstance.present();

    this._storage.get("uid").then(uid => {
      this._uid = uid;
      this._dataPvd
        .getProfileFromUid(uid)
        .take(1)
        .subscribe(profile => {
          this._userProfile = profile;
          this._userProfile.favoritesAds$ = this._dataPvd.getFavoritesAds(uid);
          this.getAds();
        });
    });
  }

  ngOnDestroy(): void {
    this._adsSubscription.unsubscribe();
  }

  /**
   * Get ads
   *
   * @memberof AdsListComponent
   */
  getAds() {
    this.ads$ = this._dataPvd.getAds(this.startLimit, this.displayedCategory);

    this._adsSubscription = this.ads$
      .map((ads: Ad[]) => ads)
      .mergeMap(ads => {
        return this._userProfile.favoritesAds$.map(favAds => {
          let adsWithFavIcon: Ad[] = [];

          // For each ad we check if it is in user favorites
          ads.forEach(ad => {
            const res = favAds.find(favAd => ad.id === favAd.id);

            // Set fav icon
            if (res) {
              ad.favIcon = this.favorite;
            } else {
              ad.favIcon = this.notFavorite;
            }

            adsWithFavIcon.push(ad);
          });

          return adsWithFavIcon;
        });
      })
      .subscribe(ads => {
        this.ads = ads;
        this._loadingInstance.dismiss();
      });
  }

  searchAd(): void {}

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
  displayMoreContent(infiniteScroll: any): void {
    let limit = this.startLimit + 3;

    this._userProfile.favoritesAds$ = this._dataPvd.getFavoritesAds(this._uid);

    const sub = this._dataPvd
      .getAds(limit, this.displayedCategory)
      .map((ads: Ad[]) => {
        return ads.slice(this.startLimit, limit);
      })
      .mergeMap((slicedAds: Ad[]) => {
        return this._userProfile.favoritesAds$.map(favAds => {
          let adsWithFavIcon: Ad[] = [];

          // For each ad we check if it is in user favorites
          slicedAds.forEach(ad => {
            const res = favAds.find(favAd => ad.id === favAd.id);

            // Set fav icon
            if (res) {
              ad.favIcon = this.favorite;
            } else {
              ad.favIcon = this.notFavorite;
            }

            adsWithFavIcon.push(ad);
          });

          return adsWithFavIcon;
        });
      })
      .subscribe((ads: Ad[]) => {
        ads.forEach(ad => this.ads.push(ad));
        this.startLimit = limit;

        infiniteScroll.complete();
      });
  }

  async favoriteAd(ad: Ad) {
    const prevIcon = ad.favIcon;

    try {
      if (ad.favIcon === this.notFavorite) {
        ad.favIcon = this.favorite;
        this._dataPvd.addFavoriteAd(this._uid, ad.id);
      } else if (ad.favIcon === this.favorite) {
        ad.favIcon = this.notFavorite;
        await this._dataPvd.removeFavoriteAd(this._uid, ad.id);
      }
    } catch (e) {
      // Revert change
      ad.favIcon = prevIcon;

      this._toastCtrl
        .create({
          message: e.message,
          duration: 5000,
          cssClass: "globals__toast-error"
        })
        .present();
    }
  }
}
