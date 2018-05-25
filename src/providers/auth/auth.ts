import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from 'firebase';
import { Observable } from 'rxjs/Observable';
import { Account } from '../../models/account/account.interface';
import { Profile } from '../../models/profile/profile.interface';
import { DataProvider } from '../data/data';
import firebase from 'firebase';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {
  constructor(
    private _afAuth: AngularFireAuth,
    private _dataPvd: DataProvider,
    private _storage: Storage
  ) {}

  /**
   * Sign in with a google account
   *
   * @returns
   * @memberof AuthProvider
   */
  async signInWithGoogle() {
    return this.oAuthSignIn(new firebase.auth.GoogleAuthProvider());
  }

  /**
   * Handle OAutg sign in
   *
   * @private
   * @param {firebase.auth.AuthProvider} provider
   * @returns {Promise<Observable<any>>}
   * @memberof AuthProvider
   */
  private async oAuthSignIn(
    provider: firebase.auth.AuthProvider
  ): Promise<Observable<any>> {
    let res;

    if (!(<any>window).cordova) {
      // If on Browser
      res = await this._afAuth.auth.signInWithPopup(provider);
    } else {
      // If on Mobile
      await this._afAuth.auth.signInWithRedirect(provider);

      res = await this._afAuth.auth.getRedirectResult();
    }

    const user = res.user;

    this.saveUid(user.uid);

    return this._dataPvd.getProfileFromUid(user.uid).map(profile => {
      if (!profile) return res;
      return profile;
    });
  }

  /**
   * Sign in with eamail and password
   *
   * @param {Account} account
   * @returns
   * @memberof AuthProvider
   */
  async signInWithEmailAndPassword(account: Account) {
    const user = await this._afAuth.auth.signInAndRetrieveDataWithEmailAndPassword(
      account.email,
      account.password
    );

    // Save uid to local storage to later profile fetch
    // on app start

    await this._storage.set('uid', user['user'].uid);

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
    const user = await this._afAuth.auth.createUserAndRetrieveDataWithEmailAndPassword(
      account.email,
      account.password
    );

    //  Send email verification mail

    await this._afAuth.auth.currentUser.sendEmailVerification();

    let userProfile = {} as Profile;

    userProfile.uid = user['user'].uid;

    userProfile.email = user['user'].email;

    // Save uid to local storage to later profile fetch
    // on app start

    this.saveUid(userProfile.uid);

    return userProfile;
  }

  /**
   * Save uid to local storage
   *
   * @private
   * @param {string} uid
   * @memberof AuthProvider
   */
  private async saveUid(uid: string) {
    await this._storage.set('uid', uid);
  }

  /**
   * REmove uid form loacl storage
   *
   * @private
   * @memberof AuthProvider
   */
  private async removeUid() {
    await this._storage.remove('uid');
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

  async logout(): Promise<void> {
    await this._afAuth.auth.signOut();
    await this.removeUid();
  }
}
