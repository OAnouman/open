import { Component, OnInit, OnDestroy } from '@angular/core';
import { Utils } from '../../utils/Utils';
import { AlertController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { Profile } from '../../models/profile/profile.interface';
import {
  transition,
  trigger,
  style,
  animate,
  state,
  group,
  query,
  stagger,
  animateChild
} from '@angular/animations';

/**
 * Generated class for the AlertsListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'alerts-list',
  templateUrl: 'alerts-list.html',
  animations: [
    trigger('items', [
      transition(':enter', [
        style({ transform: 'scale(2)', opacity: 0 }),
        animate(
          '.5s cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({ transform: 'scale(1)', opacity: 1 })
        )
      ]),
      transition(':leave', [
        style({ transform: 'scale(1)', height: '*', margin: '*' }),
        animate(
          '.5s cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({ transform: 'scale(0.5)', opacity: 0.5, height: 0, margin: 0 })
        )
      ])
    ]),
    trigger('list', [
      transition(':increment', [query('@items', stagger(100, animateChild()))]),
      transition(':decrement', [query('@items', stagger(100, animateChild()))])
    ])
  ]
})
export class AlertsListComponent implements OnInit, OnDestroy {
  private _categories = Utils.CATEGORIES;
  private _oldUserAlerts: any[] = [];

  CATEGORY_ALERT_TAG = 'category';
  USER_ALERT_TAG = 'user';
  categoriesRadiosInputs: {}[] = [];
  userAlerts: any[] = [];
  alertsToDisplay: string;

  constructor(
    private _alertCtrl: AlertController,
    private _dataPvd: DataProvider
  ) {
    this.alertsToDisplay = this.CATEGORY_ALERT_TAG;
  }

  ngOnInit(): void {
    //Get user categories alerts
    this._dataPvd.getCurrentUserProfile().then(profile$ => {
      profile$.take(1).subscribe((profile: Profile) => {
        this.userAlerts = profile.alerts;
        this._oldUserAlerts = this.userAlerts;
        console.log(this.userAlerts);
      });
    });

    // Set up inputs list for alert controller
    this._categories.forEach((cat: { text: string; value: string }) => {
      this.categoriesRadiosInputs.push({
        type: 'checkbox',
        value: cat,
        label: cat.text
      });
    });
  }

  ngOnDestroy(): void {
    try {
      this._dataPvd.saveAlertsSubscription(
        this._oldUserAlerts,
        this.userAlerts
      );
    } catch (e) {
      //IMPLEMENT Add toast here
      console.log(e);
    }
  }

  openCategoriesAlertList(): void {
    this._alertCtrl
      .create({
        title: "S'abonner à des catégories",
        buttons: [
          {
            text: 'Annuler',
            role: 'cancel'
          },
          {
            text: 'OK',
            handler: (data: string[]) => {
              // Add newly selected categories
              data.forEach((selectedCat: any) => {
                if (
                  !this.userAlerts.find(cat => cat.value === selectedCat.value)
                ) {
                  this.userAlerts.push(selectedCat);
                }
              });
            }
          }
        ],
        inputs: this.categoriesRadiosInputs
      })
      .present();
  }

  deleteAlert(alert: any) {
    this.userAlerts = this.userAlerts.filter(
      userAlert => userAlert.value !== alert.value
    );
  }
}
