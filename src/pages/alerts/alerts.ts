import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import {
  trigger,
  state,
  animate,
  style,
  keyframes,
  transition,
  group
} from '@angular/animations';
import { AlertsListComponent } from '../../components/alerts-list/alerts-list';
/**
 * Generated class for the AlertsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-alerts',
  templateUrl: 'alerts.html',
  animations: [
    trigger('flyOut', [
      transition(':leave', [
        group([
          animate('.5s ease-out', style({ transform: 'translateY(-20%)' })),
          animate('.4s .1s ease-in', style({ opacity: 0 }))
        ])
      ])
    ])
  ]
})
export class AlertsPage {
  @ViewChild(AlertsListComponent) alertList: AlertsListComponent;
  showInfoBlock = true;
  SHOW_INFO_BLOCK_STORAGE_KEY = 'showInfoBlock';

  constructor(
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _localStrgPvd: LocalStorageProvider
  ) {}

  ionViewWillLoad() {
    this._localStrgPvd
      .get(this.SHOW_INFO_BLOCK_STORAGE_KEY)
      .then((value: boolean) => {
        if (value) this.showInfoBlock = value;
      });
  }

  async closeInfo() {
    this.showInfoBlock = false;
    await this._localStrgPvd.set(
      this.SHOW_INFO_BLOCK_STORAGE_KEY,
      this.showInfoBlock
    );
  }

  openCategoriesAlertList(): void {
    this.alertList.openCategoriesAlertList();
  }
}
