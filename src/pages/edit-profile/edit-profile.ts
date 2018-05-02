import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Profile } from '../../models/profile/profile.interface';
import { StatusBar } from '@ionic-native/status-bar';

/**
 * Generated class for the EditProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

  profile: Profile;

  constructor(
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _toastCtrl: ToastController,
    private _statusBar: StatusBar) {
  }


  ionViewWillLoad() {
    this.profile = this._navParams.get('profile');
  }

  /**
   * Handle profileCreated event emitted 
   * by Edit profile form page
   * 
   * @param {Profile} profile 
   * @memberof EditProfilePage
   */
  profileSaved(profile: Profile): void {

    if (profile) {

      let goBack: boolean = this._navParams.get('goBack');

      goBack ?
        this._navCtrl.pop()
        : this._navCtrl.setRoot('HomePage', profile);

    }

  }

  ionViewDidEnter() {
    this._statusBar.backgroundColorByHexString('#2196F3');
  }

}
