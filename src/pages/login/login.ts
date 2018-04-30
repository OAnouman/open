import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
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
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private toastCtrl: ToastController) {
  }

  getSignedUser(profile: Profile): void {

    if (profile.name) {

      this.toastCtrl.create({
        message: `Bienvenue sur Open ${profile.name} !`,
        duration: 3000,
      }).present();

      this.navCtrl.setRoot('HomePage', { profile });
    } else {

      this.navCtrl.setRoot('EditProfilePage', { profile });

    }


  }

}       
