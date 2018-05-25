import { Component } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number';
import { Network } from '@ionic-native/network';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { SMS } from '@ionic-native/sms';
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  ViewController
} from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
import { Ad } from '../../models/ad/ad.interface';
import { Profile } from '../../models/profile/profile.interface';
import { DataProvider } from '../../providers/data/data';

/**
 * Generated class for the AdPreviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ad-preview',
  templateUrl: 'ad-preview.html'
})
export class AdPreviewPage {
  ad: Ad;
  headerImage: Element;
  header: any;
  scrollContent: any;
  canEditAd: boolean = false;
  isOnline: boolean;

  private _userProfile: Profile;
  private _disconnectNetworkSub: Subscription;
  private _connectNetworkSub: Subscription;

  constructor(
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _viewCtrl: ViewController,
    private _dataPvd: DataProvider,
    private _callNumber: CallNumber,
    private _sms: SMS,
    private _scrOrientation: ScreenOrientation,
    private _toastCtrl: ToastController,
    private _network: Network
  ) {}

  ionViewWillLoad() {
    // Get ad to Show
    this.ad = this._navParams.get('ad');

    // Get user profile
    this.ad.userProfile$ = this._dataPvd.getProfileFromUid(this.ad.uid);

    // Subscribe to user profile
    this.ad.userProfile$.subscribe(async profile => {
      this._userProfile = profile;

      const currentProfile$ = await this._dataPvd.getCurrentUserProfile();

      // Set whether the user can edit ad.
      // Can edit if online and user is the creator
      currentProfile$.subscribe(cProfile => {
        this.canEditAd =
          cProfile.uid === this.ad.uid && this._network.type !== 'none';
      });
    });

    // Network state listeners
    this._disconnectNetworkSub = this._network.onDisconnect().subscribe(() => {
      this.canEditAd = false;
    });

    this._connectNetworkSub = this._network.onConnect().subscribe(() => {
      this.canEditAd = true;
    });
  }

  /**
   * Close the modal
   *
   * @memberof AdPreviewPage
   */
  dismiss(): void {
    this._viewCtrl.dismiss();
  }

  /**
   * Launch a phone call
   *
   * @param {any} fab
   * @memberof AdPreviewPage
   */
  callNumber(fab: any): void {
    fab.close();

    this._callNumber.callNumber(this._userProfile.phoneNumber, true);
  }

  /**
   * Send a message from native app
   *
   * @param {any} fab
   * @memberof AdPreviewPage
   */
  sendMessage(fab: any): void {
    fab.close();

    this._sms.send(
      this._userProfile.phoneNumber,
      `Salut ${
        this._userProfile.username
      }! Je suis intéressé par votre annonce '${this.ad.title}'.`,
      { android: { intent: 'INTENT' } }
    );
  }

  //IMPLEMENT Lightbox instead of zoom
  zoom(event) {
    this.headerImage.setAttribute(
      'src',
      event.currentTarget.getAttribute('src')
    );
  }

  ionViewDidEnter() {
    this.headerImage = document.getElementsByClassName('header-image')[0];
    this.header = document.getElementsByClassName('header-container')[0];
    this.scrollContent = document.getElementsByTagName('ion-scroll')[0];

    // Set orientation observer
    this._scrOrientation.onChange().subscribe(() => {
      if (
        this._scrOrientation.type ===
        this._scrOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY
      ) {
        this.header.style.height = `100vh`;
        this.scrollContent.style.height = '100vh';
      } else if (
        this._scrOrientation.type ===
        this._scrOrientation.ORIENTATIONS.PORTRAIT_PRIMARY
      ) {
        this.header.style.height = '50vh';
        this.scrollContent.style.height = 'auto';
      }
    });

    // Count view
    this.countViews();
  }

  /**
   * Count view for ad
   *
   * @memberof AdPreviewPage
   */
  async countViews() {
    try {
      // this._dataPvd.addView(this.ad.)
      await this._dataPvd.addView(this.ad.id);
    } catch (e) {
      this._toastCtrl
        .create({
          message: e.message,
          duration: 5000,
          cssClass: 'globasl__toast-error'
        })
        .present();
    }
  }

  /**
   * Edit ad
   *
   * @memberof AdPreviewPage
   */
  onEditAd(): void {
    this._navCtrl.push('EditAdPage', { ad: this.ad });
  }
}
