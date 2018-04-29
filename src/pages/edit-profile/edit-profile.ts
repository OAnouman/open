import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Profile } from '../../models/profile/profile.interface';

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
    private navCtrl: NavController,
    private navParams: NavParams,
    private toastCtrl: ToastController) {
  }


  ionViewWillLoad() {
    this.profile = this.navParams.get('profile');
  }

  /**
   * Handle profileCreated event emitted 
   * by Edit profile form page
   * 
   * @param {Profile} profile 
   * @memberof EditProfilePage
   */
  profileCreated(profile: Profile): void {

    if (profile) {

      this.toastCtrl.create({
        message: `Bienvenu(e) sur Open ${profile.name} !`,
        duration: 3000,
      }).present();

      this.navCtrl.setRoot('HomePage', profile);

    }

  }


}
