import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { User } from 'firebase';
import { AuthProvider } from '../../providers/auth/auth';
import { ADS_LIST } from '../../mocks/ads/ad.mocks';
import { Ad } from '../../models/ad/ad.interface';
// import { AdPreviewPage } from '../ad-preview/ad-preview';

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

  ads: Ad[] = ADS_LIST;

  constructor(
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _authPvd: AuthProvider,
    private _modalCtrl: ModalController) {

    // this.currentUserSubscription = this._authPvd.getAuthenticatedUser().subscribe((user: User) => this.currentUser = user);

    this.currentUser = this._authPvd.getCurrentUser();

  }


  preview(ad: Ad) {
    this._modalCtrl.create('AdPreviewPage', { ad })
      .present();
  }

}
