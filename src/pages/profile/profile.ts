import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Profile } from '../../models/profile/profile.interface';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  private _profile: Profile;

  constructor(
    private _navCtrl: NavController,
    private _navParams: NavParams) {
  }

  setPofile(profile: Profile) {
    this._profile = profile;
  }


  goToEditProfilePage() {
    this._navCtrl.push('EditProfilePage', { profile: this._profile, goBack: true });
  }

  loggedOut(event) {
    this._navCtrl.setRoot('LoginPage');
  }

}
