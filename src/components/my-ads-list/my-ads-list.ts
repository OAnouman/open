import {
  animate,
  group,
  state,
  style,
  transition,
  trigger,
  query,
  stagger,
  animateChild
} from '@angular/animations';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  Checkbox,
  ItemSliding,
  Loading,
  LoadingController,
  Toast,
  ToastController
} from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Ad } from '../../models/ad/ad.interface';
import { DataProvider } from '../../providers/data/data';
import { StylesCompileDependency } from '@angular/compiler';

/**
 * Generated class for the MyAdsListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */

@Component({
  selector: 'my-ads-list',
  templateUrl: 'my-ads-list.html',
  animations: [
    trigger('deleteButtonState', [
      state(
        'inactive',
        style({
          transform: 'scale(1)'
        })
      ),
      state(
        'active',
        style({
          transform: 'scale(1.5)'
        })
      ),
      transition('inactive => active', animate('50ms ease-in')),
      transition('active => inactive', animate('500ms ease-out'))
    ]),
    trigger('editMode', [
      state(
        'normal',
        style({
          opacity: '0',
          display: 'none'
        })
      ),
      state(
        'edit',
        style({
          opacity: '1',
          display: 'flex'
        })
      ),
      transition('normal => edit', [
        group([
          animate('.3s .2s ease', style({ opacity: '1' })),
          animate('.3s ease', style({ display: 'flex' }))
        ])
      ]),
      transition('edit => normal', [
        group([
          animate('.3s ease', style({ opacity: '0' })),
          animate('.3s .2s ease', style({ display: 'none' }))
        ])
      ])
    ]),
    // trigger('flyIn', [
    //   state('in', style({ transform: 'translateX(0)', opacity: 1 })),
    //   transition(':enter', [
    //     style({ opacity: 0, transform: 'translateX(-100%)' }),
    //     animate(500)
    //   ])
    // ]),
    // trigger('flyOut', [
    //   state('out', style({ transform: 'translateX(100%)', opacity: 0 })),
    //   transition(':leave', [
    //     group([
    //       animate('.3s .3s ease', style({ opacity: 0 })),
    //       animate('.4s ease', style({ transform: 'translateX(200%)' }))
    //     ])
    //   ])
    // ]),
    trigger('items', [
      transition(':enter', [
        style({ transform: 'scale(2)', opacity: 0 }),
        animate(
          '.3s cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({ transform: 'scale(1)', opacity: 1 })
        )
      ]),
      transition(':leave', [
        style({ transform: 'scale(1)', height: '*', margin: '*' }),
        animate(
          '.3s cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({ transform: 'scale(.5)', opacity: 0.5, height: 0, margin: 0 })
        )
      ])
    ]),
    trigger('list', [
      transition(':increment', [query('@items', stagger(100, animateChild()))]),
      transition(':decrement', [query('@items', stagger(100, animateChild()))])
    ])
  ]
})
export class MyAdsListComponent implements OnInit {
  @Output() onEditAd: EventEmitter<Ad>;
  @Output() onEditMode: EventEmitter<boolean>;
  @Output() onSelect: EventEmitter<number>;
  private _selectedItemCount: number = 0;
  private _selectedAdForDeletion: Ad[];
  private _loadingInstance: Loading;
  private _toastInstance: Toast;
  private queryLimit: number = 10;

  myAds$: Observable<Ad[]>;
  deleteTapCount: number = 0;
  deleteIconState: string = 'inactive';
  editMode: string = 'normal';
  myAds: Ad[] = [];
  canEditAd: boolean;
  hasAds: boolean = true;

  constructor(
    private _dataPvd: DataProvider,
    private _toastCtrl: ToastController,
    private _loadingCtrl: LoadingController
  ) {
    this.onEditAd = new EventEmitter<Ad>();
    this.onEditMode = new EventEmitter<boolean>();
    this.onSelect = new EventEmitter<number>();
    this._selectedAdForDeletion = [];
  }

  ngOnInit(): void {
    this.getMyAds();
  }

  async getMyAds(): Promise<void> {
    try {
      this._loadingInstance = this._loadingCtrl.create({
        content: 'Chargement de mes annonces...'
      });

      this._loadingInstance.present();

      this.myAds$ = await this._dataPvd.getMyAds(this.queryLimit);

      this.myAds$.take(1).subscribe(ads => {
        if (ads.length === 0) {
          this.hasAds = false;
          return;
        }
        ads.forEach(ad => this.myAds.push(ad));
      });

      this._loadingInstance.dismiss();
    } catch (e) {
      this._toastCtrl.create({
        message: e.message,
        duration: 5000,
        cssClass: 'globals__toast-error'
      });
    }
  }

  editAd(ad: Ad): void {
    this.onEditAd.emit(ad);
  }

  /**
   * Deletes selected ad(s).
   * 1f ad is not specified deletes all ads inside @field
   * this._selectedAdForDeletion
   *
   * @param {Ad} ad
   * @memberof MyAdsListComponent
   */
  deleteAd(ad?: Ad, slidingItem?: ItemSliding): void {
    this.deleteTapCount++;

    if (this.deleteTapCount <= 1) {
      this.toggleDeleteIconState();

      this._toastInstance = this._toastCtrl.create({
        message: 'Appuyer encore une fois pour supprimer',
        duration: 3000,
        cssClass: 'globals__toast-confirm',
        closeButtonText: 'Annuler',
        showCloseButton: true
      });

      this._toastInstance.onDidDismiss((data: any, role: any) => {
        this.deleteTapCount = 0;
      });

      this._toastInstance.onWillDismiss((data: any, role: string) => {
        this.toggleDeleteIconState();
      });

      this._toastInstance.present();
    } else {
      if (ad) {
        this._dataPvd.deleteAd(ad);
        slidingItem.close();
        this.myAds = this.myAds.filter(myAd => myAd.id !== ad.id);
      } else {
        this._dataPvd.bulkDeleteAd(this._selectedAdForDeletion);

        // Update myAds
        this.myAds = this.myAds.filter(
          ad =>
            this._selectedAdForDeletion.find(delAd => delAd.id === ad.id)
              ? false
              : true
        );

        // Empty ads to delete array
        this._selectedAdForDeletion = [];

        // Set normal mode
        this.editMode = 'normal';
      }

      // this._loadingInstance.dismiss();
    }
  }

  async displayMoreContent(infiniteScroll) {
    const limit = this.queryLimit + 3;

    this.myAds$ = await this._dataPvd.getMyAds(limit);

    this.myAds$
      .take(1)
      .map((ads: Ad[]) => {
        return ads.slice(this.queryLimit, limit);
      })
      .subscribe(ads => {
        ads.forEach(ad => this.myAds.push(ad));
        this.queryLimit = limit;
        infiniteScroll.complete();
      });
  }

  /**
   * Add selected ad to ads deleteion list
   * and increments selected ads count.
   * If count is equal to 0 then set edit mode state to normal
   *
   * @param {any} checkbox
   * @param {Ad} ad
   * @memberof MyAdsListComponent
   */
  onChecked(checkbox: Checkbox, ad: Ad): void {
    if (checkbox.checked) {
      this._selectedItemCount++;
      this._selectedAdForDeletion.push(ad);
    } else {
      this._selectedItemCount--;
      ad.multiSelectSelected = false;
      this._selectedAdForDeletion = this._selectedAdForDeletion.filter(
        ad => ad.id !== ad.id
      );
    }
    if (this._selectedItemCount === 0) {
      this.editMode = 'normal';
      this.onEditMode.emit(false);
    }

    this.onSelect.emit(this._selectedItemCount);
  }

  selectAllAds(): void {
    this.myAds.forEach(ad => {
      if (ad.multiSelectSelected === true) return;
      ad.multiSelectSelected = true;
    });
  }

  deseletctAll() {
    this.myAds.forEach(ad => {
      if (ad.multiSelectSelected === false) return;
      ad.multiSelectSelected = false;
      this.editMode = 'normal';
    });
  }

  public set canEdit(state: boolean) {
    this.canEditAd = state;
  }

  /**************************************
   *              ANIMATIONS
   **************************************/

  /**
   * Set delete icon state
   *
   * @memberof MyAdsListComponent
   */
  toggleDeleteIconState(): void {
    this.deleteIconState =
      this.deleteIconState === 'active' ? 'inactive' : 'active';
  }

  /**
   * Triggered when and ttem is dragged.
   * Get drag  direction
   *
   * @param {any} event
   * @memberof MyAdsListComponent
   */
  itemSwipe(event: any) {
    const slidingPercent = event.getSlidingPercent();

    if (slidingPercent <= 0) {
      // To the left
      this.deleteIconState = 'inactive';
      if (this._toastInstance) this._toastInstance.dismiss();
    } else if (slidingPercent <= -2) {
      // To the right
    }
  }

  /**
   * Set edit mode state
   *
   * @param {*} checkbox
   * @param {Ad} ad
   * @memberof MyAdsListComponent
   */
  toggleEditMode(checkbox: Checkbox, ad: Ad): void {
    this.editMode = 'edit';
    this.onEditMode.emit(true);

    if (!ad.multiSelectSelected) {
      ad.multiSelectSelected = true;
      this._selectedAdForDeletion.push(ad);
      // this._selectedItemCount = 1;
    }

    this.onSelect.emit(this._selectedItemCount);
  }
}
