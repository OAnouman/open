import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Profile } from '../../models/profile/profile.interface';
import { Account } from '../../models/account/account.interface';
import { DataProvider } from '../data/data';
import { User } from 'firebase';
import { IfObservable } from 'rxjs/observable/IfObservable';
import { Observable } from 'rxjs/Observable';


/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

  constructor(
    private _afAuth: AngularFireAuth,
    private _dataPvd: DataProvider) {
  }

  async signInWithEmailAndPassword(account: Account) {

    const user = await this._afAuth.auth.signInAndRetrieveDataWithEmailAndPassword(account.email, account.password);

    return this._dataPvd.getUserProfile(user['user']);

  }

  /**
   * Create user with email and password
   * 
   * @param {Account} account 
   * @returns {Promise<Profile>} 
   * @throws {Error} if any
   * @memberof AuthProvider
   */
  async signUpWithEmailAndPassword(account: Account): Promise<Profile> {

    const user = await this._afAuth.auth.createUserAndRetrieveDataWithEmailAndPassword(account.email, account.password);

    //  Send email verification mail

    await this._afAuth.auth.currentUser.sendEmailVerification();

    let userProfile = {} as Profile;

    userProfile.uid = user['user'].uid

    userProfile.email = user['user'].email;

    return userProfile;

  }


  /**
   * Get current authenticated user
   * 
   * @returns {User} 
   * @memberof AuthProvider
   */
  getCurrentUser(): User {

    return this._afAuth.auth.currentUser;

  }

  getAuthenticatedUser(): Observable<User> {

    return this._afAuth.authState;

  }


}