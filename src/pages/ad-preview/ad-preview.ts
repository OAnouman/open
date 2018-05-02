import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Ad } from '../../models/ad/ad.interface';
import { StatusBar } from '@ionic-native/status-bar';

/**
 * Generated class for the AdPreviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ad-preview',
  templateUrl: 'ad-preview.html',
})
export class AdPreviewPage {

  ad: Ad;

  constructor(
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _viewCtrl: ViewController,
    private _statusBar: StatusBar) {
  }

  ionViewWillLoad() {
    this.ad = this._navParams.get('ad');
  }

  dismiss(): void {

    this._viewCtrl.dismiss();

  }

  showContactActionSheet() {

    // TODO: Implements this

  }

  ionViewDidEnter() {
    this._statusBar.backgroundColorByHexString('#2196F3');
  }



}
