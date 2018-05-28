import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  MenuController
} from 'ionic-angular';
import { Profile } from '../../models/profile/profile.interface';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private toastCtrl: ToastController,
    private _menuCtrl: MenuController
  ) {
    // Disable menu swipe on this page
    _menuCtrl.swipeEnable(false);
  }

  getSignedUser(profile: Profile): void {
    if (profile.username) {
      this.toastCtrl
        .create({
          message: `Bienvenue sur Deals ${profile.name} !`,
          duration: 3000
        })
        .present();

      this.navCtrl.setRoot('HomePage', { profile });
    } else {
      this.navCtrl.setRoot('EditProfilePage', { profile });
    }
  }
}
