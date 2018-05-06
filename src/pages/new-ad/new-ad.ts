import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AdFormComponent } from '../../components/ad-form/ad-form';
import { Ad } from '../../models/ad/ad.interface';

/**
 * Generated class for the NewAdPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-ad',
  templateUrl: 'new-ad.html',
})
export class NewAdPage {

  @ViewChild(AdFormComponent)
  set form(form: AdFormComponent) {
    this.adForm = form;
  }

  // Ref to child Ad form component
  adForm;
  constructor(
    private _navCtrl: NavController,
    private _navParams: NavParams) {
  }


  /**
   * Saee t,the ad to firestore
   * 
   * @memberof NewAdPage
   */
  async saveAd(): Promise<void> {
    await this.adForm.saveAd();
  }


  adCreated(ad: Ad): void {

    this._navCtrl.setRoot('HomePage');

  }


}
