import { Component, OnInit } from '@angular/core';
import { PopoverController, ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Ad } from '../../models/ad/ad.interface';
import { DataProvider } from '../../providers/data/data';

/**
 * Generated class for the MyAdsListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'my-ads-list',
  templateUrl: 'my-ads-list.html'
})
export class MyAdsListComponent implements OnInit {

  myAds: Observable<Ad[]>;

  constructor(
    private _dataPvd: DataProvider,
    private _toastCtrl: ToastController,
    private _popOverCtrl: PopoverController) {

  }

  ngOnInit(): void {

    this.getMyAds();

  }

  async getMyAds() {

    try {

      this.myAds = await this._dataPvd.getMyAds();

    } catch (e) {

      this._toastCtrl.create({
        message: e.message,
        duration: 5000,
        cssClass: 'globals__toast-error',
      }).present();

    }

  }


}
