import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
  templateUrl: 'register.html',
})
export class RegisterPage {

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams) {
  }


  userSignedUp(profile: Profile) {

    if (profile) {

      this.navCtrl.setRoot('EditProfilePage', { profile });

    }

  }

}
