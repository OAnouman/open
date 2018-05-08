import { Component } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';
import { Storage } from "@ionic/storage";
import { User } from 'firebase';
import { IonicPage, Loading, LoadingController, ModalController, NavController, NavParams, ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Ad } from '../../models/ad/ad.interface';
import { Profile } from '../../models/profile/profile.interface';
import { AuthProvider } from '../../providers/auth/auth';
import { DataProvider } from '../../providers/data/data';
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
})
export class HomePage {

  currentUser: User;

  currentUserProfile: Profile;

  ads: Observable<Ad[]>;

  userLoadFinished: boolean = false;

  private _loadingInstance: Loading;

  constructor(
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _authPvd: AuthProvider,
    private _modalCtrl: ModalController,
    private _toastCtrl: ToastController,
    private _dataPvd: DataProvider,
    private _storage: Storage,
    private _statusBar: StatusBar,
    private _loadingCtrl: LoadingController) {

    // FIXME: Doesn't always get user
    this._authPvd.getAuthenticatedUser()
      .subscribe(user => {
        this.currentUser = user;
        this.userLoadFinished = true;
      });

  }

  ionViewWillLoad() {

    // Get uer profile

    this._storage.get('uid')
      .then(uid => this._dataPvd.getProfileFromUid(uid)
        .subscribe(profile => this.currentUserProfile = profile));

  }

  preview(ad: Ad) {
    this._modalCtrl.create('AdPreviewPage', { ad })
      .present();
  }

  ionViewDidEnter() {
    //FIXME: 
    this._statusBar.overlaysWebView(false);
    this._statusBar.backgroundColorByHexString('#2196F3');

  }

  goToNewAdPage(): void {
    this._navCtrl.push('NewAdPage');
  }


  //IMPLEMENT: Unsubscribe when view (activity) destroyed or unload

}
