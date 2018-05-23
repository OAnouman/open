import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Storage } from '@ionic/storage';
import firebase from 'firebase/app';
import { Nav, Platform } from 'ionic-angular';
import { Profile } from '../models/profile/profile.interface';
import { AuthProvider } from '../providers/auth/auth';
import { DataProvider } from '../providers/data/data';
import { ImageLoaderConfig } from 'ionic-image-loader';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: string;

  userProfile: Profile;
  private _uid: string;
  avatarPlaceholder: string = '../assets/imgs/avatar.png';

  pages: Array<{ title: string; component: any }>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private _authPvd: AuthProvider,
    private _dataPvd: DataProvider,
    private _storage: Storage,
    private _imageLoaderConfig: ImageLoaderConfig
  ) {
    this.initializeApp();

    this.setRootPage();

    this.initImageLoaderConfig();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#a20019');
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  async setRootPage() {
    // Set auth persistance
    // All future login will be indefinity kept
    // REVIEW
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

    // Set root page

    // Try to get the uid from local storage (SQLite).
    // if null no user is logged in on this device, else
    // we fetch firebase for the user profile

    this._uid = await this.getUid();

    if (!this._uid) {
      this.rootPage = 'LoginPage';
    } else {
      this.rootPage = 'HomePage';
    }
  }

  private initImageLoaderConfig() {
    this._imageLoaderConfig.enableSpinner(true);
    this._imageLoaderConfig.setConcurrency(5);
    this._imageLoaderConfig.setMaximumCacheSize(10 * 1024 * 1024);
    this._imageLoaderConfig.setMaximumCacheAge(15 * 24 * 60 * 60 * 1000);
  }

  private async getUid(): Promise<string> {
    return await this._storage.get('uid');
  }

  openProfilePage(): void {
    this.nav.setRoot('ProfilePage');
  }

  openHomePage(): void {
    this.nav.setRoot('HomePage');
  }

  openMyAdsPage(): void {
    this.nav.setRoot('MyAdsPage');
  }

  /**
   * Triggered when sidemenu is shown
   *
   * @memberof MyApp
   */
  async onSidemenuOpen(): Promise<void> {
    if (!this._uid) {
      // The user has just connected to the app
      // So we try again to retrieve the uid
      this._uid = await this.getUid();
    }

    this._dataPvd
      .getProfileFromUid(this._uid)
      .subscribe(profile => (this.userProfile = profile));
  }
}
