import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from 'firebase';
import { AuthProvider } from '../../providers/auth/auth';

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

  constructor(
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _authPvd: AuthProvider) {

    this.currentUser = this._authPvd.getAuthenticatedUser();
  }



}
