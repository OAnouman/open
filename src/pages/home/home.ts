import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController } from 'ionic-angular';
import { User } from 'firebase';
import { AuthProvider } from '../../providers/auth/auth';
import { ADS_LIST } from '../../mocks/ads/ad.mocks';
import { Ad } from '../../models/ad/ad.interface';
import { DataProvider } from '../../providers/data/data';
import { Profile } from '../../models/profile/profile.interface';
import { Storage } from "@ionic/storage";
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

  ads: Ad[] = ADS_LIST;

  userLoadFinished: boolean = false;

  constructor(
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _authPvd: AuthProvider,
    private _modalCtrl: ModalController,
    private _toastCtrl: ToastController,
    private _dataPvd: DataProvider,
    private _storage: Storage) {


  }

  ionViewWillLoad() {

    this._authPvd.getAuthenticatedUser()
      .subscribe(user => {
        this.currentUser = user;
        this.userLoadFinished = true;
      });

    this._storage.get('uid')
      .then(uid => this._dataPvd.getProfileFromUid(uid)
        .subscribe(profile => this.currentUserProfile = profile));

  }


  preview(ad: Ad) {
    this._modalCtrl.create('AdPreviewPage', { ad })
      .present();
  }

}
