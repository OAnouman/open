import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AdFormComponent } from '../../components/ad-form/ad-form';
import { Ad } from '../../models/ad/ad.interface';

/**
 * Generated class for the EditAdPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-ad',
  templateUrl: 'edit-ad.html',
})
export class EditAdPage {

  @ViewChild(AdFormComponent)
  set form(form: AdFormComponent) {
    this.adForm = form;
  }
  // Ref to child Ad form component
  adForm;
  ad: Ad;

  constructor(
    private _navCtrl: NavController,
    private _navParams: NavParams) {

    this.ad = this._navParams.get('ad');

  }

  async updateAd() {
    await this.adForm.saveAd();
  }

  adUpdated(ad: Ad): void {
    this._navCtrl.pop();
  }


}
