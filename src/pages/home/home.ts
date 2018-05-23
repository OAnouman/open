import { Component, ViewChild } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';
import { Storage } from '@ionic/storage';
import { User } from 'firebase';
import {
  Alert,
  AlertController,
  IonicPage,
  Loading,
  LoadingController,
  ModalController,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { AdsListComponent } from '../../components/ads-list/ads-list';
import { Ad } from '../../models/ad/ad.interface';
import { Profile } from '../../models/profile/profile.interface';
import { AuthProvider } from '../../providers/auth/auth';
import { DataProvider } from '../../providers/data/data';
import { Utils } from '../../utils/Utils';
/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(AdsListComponent)
  set form(form: AdsListComponent) {
    this.adList = form;
  }

  adList: AdsListComponent;
  currentUser: User;
  currentUserProfile: Profile;
  ads$: Observable<Ad[]>;
  userLoadFinished: boolean = false;
  categories;
  categoriesRadiosInputs = [];
  categoriesAlertList: Alert;
  private _loadingInstance: Loading;
  private _selectedCategory: { value: string; label: string };
  private _defaultSortLabel: string = 'Toutes les annonces';

  constructor(
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _authPvd: AuthProvider,
    private _modalCtrl: ModalController,
    private _toastCtrl: ToastController,
    private _dataPvd: DataProvider,
    private _storage: Storage,
    private _statusBar: StatusBar,
    private _loadingCtrl: LoadingController,
    private _alertCtrl: AlertController
  ) {
    //Set default sort

    this._selectedCategory = { value: '', label: this._defaultSortLabel };
  }

  ionViewWillLoad() {
    // FIXME: Doesn't always get user
    this._authPvd
      .getAuthenticatedUser()
      .take(1)
      .subscribe(user => {
        this.currentUser = user;
        this.userLoadFinished = true;
      });

    // Get uer profile

    this._storage.get('uid').then(uid =>
      this._dataPvd
        .getProfileFromUid(uid)
        .take(1)
        .subscribe(profile => (this.currentUserProfile = profile))
    );

    // Get all categories

    this.categories = Utils.CATEGORIES;

    // Add All

    this.categoriesRadiosInputs.push({
      type: 'radio',
      value: '',
      handler: data => this.sortByCategory(data),
      label: 'Toutes les annonces',
      checked: false
    });

    this.categories.forEach((cat: { text: string; value: string }) => {
      this.categoriesRadiosInputs.push({
        type: 'radio',
        value: cat.value,
        handler: data => this.sortByCategory(data),
        label: cat.text,
        checked: this._selectedCategory.value === cat.value ? true : false
      });
    });
  }

  preview(ad: Ad) {
    this._modalCtrl.create('AdPreviewPage', { ad }).present();
  }

  goToNewAdPage(): void {
    this._navCtrl.push('NewAdPage');
  }

  /**
   * Display alert which contains categories list.
   * When a categpry is selected pass it to @function sortByCategory
   *
   * @memberof HomePage
   */
  showCategoriesList() {
    this.categoriesRadiosInputs = this.categoriesRadiosInputs.map(radio => {
      radio.value === this._selectedCategory
        ? (radio.checked = true)
        : (radio.checked = false);

      return radio;
    });

    this.categoriesAlertList = this._alertCtrl.create({
      title: 'Trier par catégorie',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        }
      ],
      inputs: this.categoriesRadiosInputs
    });

    this.categoriesAlertList.present();
  }

  /**
   * When a categpry is selected pass it to ads list
   * component to update displayed ads list.
   * See @function AdsListComponent.sortByCategories
   *
   * @param {*} category
   * @memberof HomePage
   */
  sortByCategory(category: any, event?: any) {
    this.adList.sortByCategories(category, event);
    this._selectedCategory = category;

    if (this.categoriesAlertList) this.categoriesAlertList.dismiss();
  }

  /**
   * Trigger ads list refreshing
   *
   * @param {any} event
   * @memberof HomePage
   */
  pullToRefresh(event: any) {
    // IMPROVE:
    this.sortByCategory(this._selectedCategory, event);
  }
}
