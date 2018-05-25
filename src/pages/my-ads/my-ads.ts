import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Ad } from '../../models/ad/ad.interface';
import { MyAdsListComponent } from '../../components/my-ads-list/my-ads-list';
import { StatusBar } from '@ionic-native/status-bar';
import {
  trigger,
  state,
  transition,
  style,
  animate,
  keyframes
} from '@angular/animations';
import { Network } from '@ionic-native/network';
import { Subscription } from 'rxjs/Subscription';

/**
 * Generated class for the MyAdsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-ads',
  templateUrl: 'my-ads.html',
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
            style({ transform: 'translateY(5px)', offset: 1 })
          ])
        )
      ])
    ])
  ]
})
export class MyAdsPage {
  @ViewChild(MyAdsListComponent)
  set form(myAdList: MyAdsListComponent) {
    this._myAdsComponent = myAdList;
  }

  private OFFLINE_STATE_LABEL: string = 'Vous êtes hors ligne';
  private ONLINE_STATE_LABEL: string = 'Connexion rétablie';
  private _myAdsComponent: MyAdsListComponent;
  private _disconnectNetworkSub: Subscription;
  private _connectNetworkSub: Subscription;
  navBarColor: string;
  NAVBAR_COLOR_NORMAL: string = 'primary';
  NAVBAR_COLOR_EDIT: string = 'secondary';
  isInEditMode: boolean = false;
  title: string;
  networkState: string;
  networkStateLabel: string;
  canCreateNewAd: boolean;
  TITLE_NORMAL = 'Mes annonces';
  TITLE_EDIT_SINGULAR: string = 'sélectionné';
  TITLE_EDIT_PLURAL: string = 'sélectionnés';
  constructor(
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _statusBar: StatusBar,
    private _network: Network
  ) {
    this.navBarColor = this.NAVBAR_COLOR_NORMAL;
    this.title = this.TITLE_NORMAL;
  }

  onEditAd(ad: Ad): void {
    this._navCtrl.push('EditAdPage', { ad });
  }

  sort(event) {}

  openNewAdPage() {
    this._navCtrl.push('NewAdPage');
  }

  /**
   * Get Edit mode status
   *
   * @param {boolean} isInEditMode
   * @memberof MyAdsPage
   */
  onEditMode(isInEditMode: boolean): void {
    this.isInEditMode = isInEditMode;

    if (isInEditMode) {
      this.navBarColor = this.NAVBAR_COLOR_EDIT;
      this._statusBar.backgroundColorByHexString('#b18800');
    } else {
      this.navBarColor = this.NAVBAR_COLOR_NORMAL;
      this._statusBar.backgroundColorByHexString('#a20019');
    }
  }

  /**
   * Get selected ads count
   *
   * @param {number} count
   * @memberof MyAdsPage
   */
  onSelect(count: number): void {
    if (!this.isInEditMode) {
      this.title = this.TITLE_NORMAL;
    } else {
      if (count > 1) {
        // Plural
        this.title = `${count} ${this.TITLE_EDIT_PLURAL}`;
      } else {
        // Singular
        this.title = `${count} ${this.TITLE_EDIT_SINGULAR}`;
      }
    }
  }

  /**
   * Trigger bulk delete on @class MyAdsListComponent
   *
   * @memberof MyAdsPage
   */
  deleteBulk(): void {
    this._myAdsComponent.deleteAd();
  }

  selectAllAds(): void {
    this._myAdsComponent.selectAllAds();
  }

  deselectAll(): void {
    this._myAdsComponent.deseletctAll();
  }

  ionViewWillLeave() {
    // Reset status bar color
    this._statusBar.backgroundColorByHexString('#a20019');
  }

  ionViewWillLoad() {
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
    this.canCreateNewAd = true;
    this._myAdsComponent.canEdit = true;
  }

  setOffline() {
    this.networkState = 'offline';
    this.networkStateLabel = this.OFFLINE_STATE_LABEL;
    this.canCreateNewAd = false;
    this._myAdsComponent.canEdit = false;
  }

  ionViewDidLeave() {
    this._connectNetworkSub.unsubscribe();
    this._disconnectNetworkSub.unsubscribe();
  }
}
