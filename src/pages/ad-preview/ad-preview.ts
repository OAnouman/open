import { Component } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { SMS } from '@ionic-native/sms';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
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
  templateUrl: 'ad-preview.html',
})
export class AdPreviewPage {

  ad: Ad;
  headerImage: Element;
  header: any;
  scrollContent: any;

  private _userProfile: Profile;

  constructor(
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _viewCtrl: ViewController,
    private _statusBar: StatusBar,
    private _dataPvd: DataProvider,
    private _callNumber: CallNumber,
    private _sms: SMS,
    private _scrOrientation: ScreenOrientation) {
  }

  ionViewWillLoad() {
    // Get ad to Show
    this.ad = this._navParams.get('ad');

    // Get user profile
    this.ad.userProfile = this._dataPvd.getProfileFromUid(this.ad.uid);

    // Subscribe to user profile
    this.ad.userProfile.subscribe(profile => this._userProfile = profile);

  }

  dismiss(): void {

    this._viewCtrl.dismiss();

  }

  callNumber(fab) {

    fab.close();

    this._callNumber.callNumber(this._userProfile.phoneNumber, true);

  }

  sendMessage(fab) {

    fab.close();

    this._sms.send(this._userProfile.phoneNumber, `Salut ${this._userProfile.username}! Je suis intéressé par votre annonce '${this.ad.title}'.`, { android: { intent: 'INTENT' } });

  }

  zoom(event) {

    this.headerImage.setAttribute('src', event.currentTarget.getAttribute('src'));

  }

  ionViewDidEnter() {
    this._statusBar.backgroundColorByHexString('#2196F3');
    this.headerImage = document.getElementsByClassName('header-image')[0];
    this.header = document.getElementsByClassName('header-container')[0];
    this.scrollContent = document.getElementsByTagName('ion-scroll')[0];

    // Set orientation observer
    this._scrOrientation.onChange().subscribe(() => {
      if (this._scrOrientation.type === this._scrOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY) {
        this.header.style.height = `100vh`;
        this.scrollContent.style.height = '100vh';
      } else if (this._scrOrientation.type === this._scrOrientation.ORIENTATIONS.PORTRAIT_PRIMARY) {
        this.header.style.height = '50vh';
        this.scrollContent.style.height = 'auto';
      }
    })

  }



}
