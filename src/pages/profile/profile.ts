import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { DataProvider } from '../../providers/data/data';
import { Profile } from '../../models/profile/profile.interface';
import { StatusBar } from '@ionic-native/status-bar';

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
    private _navParams: NavParams,
    private _statusBar: StatusBar) {
  }

  setPofile(profile: Profile) {
    this._profile = profile;
  }

  ionViewDidEnter() {
    this._statusBar.backgroundColorByHexString('#2196F3');
  }

  goToEditProfilePage() {
    this._navCtrl.push('EditProfilePage', { profile: this._profile, goBack: true });
  }

}
