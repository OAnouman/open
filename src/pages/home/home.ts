import { Component, ViewChild } from '@angular/core';
import {
  trigger,
  state,
  animate,
  transition,
  style,
  group,
  keyframes
} from '@angular/animations';
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
import { Subscription } from 'rxjs/Subscription';
import { Network } from '@ionic-native/network';
/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  animations: [
    trigger('network', [
      state(
        'online',
        style({
          position: 'relative',
          transform: 'translateY(-30px)',
          display: 'none'
        })
      ),
      state(
        'offline',
        style({
          position: 'sticky',
          transform: 'translateY(0)',
          display: 'block',
          top: 0
        })
      ),
      transition('offline => online', [
        animate(
          3000,
          keyframes([
            style({
              display: 'flex',
              background: 'rgba(32, 160, 86,.9)',
              offset: 0
            }),
            style({ transform: 'translateY(0)', offset: 0.9 }),
            style({ transform: 'translateY(-30px)', offset: 1 })
          ])
        )
      ]),
      transition('online => offline', [
        animate(
          300,
          keyframes([
            style({
              transform: 'translateY(-30px)',
              offset: 0
            }),
            // style({ transform: 'translateY(5px)', offset: 0.5 }),
            style({ transform: 'translateY(5px)', offset: 1 })
          ])
        )
      ])
    ]),
    trigger('offlineHideFab', [
      state('online', style({ opacity: 1 })),
      state('offline', style({ opacity: 0 })),
      transition('online <=> offline', animate(200))
    ])
  ]
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
  networkState: string;
  networkStateLabel: string;

  private OFFLINE_STATE_LABEL: string = 'Vous êtes hors ligne';
  private ONLINE_STATE_LABEL: string = 'Connexion rétablie';
  private _loadingInstance: Loading;
  private _selectedCategory: { value: string; label: string };
  private _defaultSortLabel: string = 'Toutes les annonces';
  private _disconnectNetworkSub: Subscription;
  private _connectNetworkSub: Subscription;

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
    private _alertCtrl: AlertController,
    private _network: Network
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

    // Network listener

    if (this._network.type === 'none') {
      this.setOffline();
    } else {
      this.setOnline();
    }

    this._disconnectNetworkSub = this._network.onDisconnect().subscribe(() => {
      this.setOffline();
    });

    this._connectNetworkSub = this._network.onConnect().subscribe(() => {
      this.setOnline();
    });
  }

  private setOnline() {
    this.networkState = 'online';
    this.networkStateLabel = this.ONLINE_STATE_LABEL;
  }
  private setOffline() {
    this.networkState = 'offline';
    this.networkStateLabel = this.OFFLINE_STATE_LABEL;
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
      radio.value === this._selectedCategory.value
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

  ionViewDidLeave() {
    this._connectNetworkSub.unsubscribe();
    this._disconnectNetworkSub.unsubscribe();
  }

  toggleSearchbar(): void {
    this.adList.toggleSearchbar();
  }
}
