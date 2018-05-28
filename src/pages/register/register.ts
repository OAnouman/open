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
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  constructor(
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _toastCtrl: ToastController,
    private _menuCtrl: MenuController
  ) {
    //DIsable menu swipe
    _menuCtrl.swipeEnable(false);
  }

  userSignedUp(profile: Profile) {
    if (profile) {
      this._toastCtrl
        .create({
          message: `Un mail de confirmation a été envoyé à ${profile.email}.`,
          duration: 5000
        })
        .present();

      this._navCtrl.setRoot('EditProfilePage', { profile });
    }
  }
}
