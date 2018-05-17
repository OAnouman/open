import {
  animate,
  group,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import {
  Loading,
  LoadingController,
  Toast,
  ToastController
} from "ionic-angular";
import { Observable } from "rxjs/Observable";
import { Ad } from "../../models/ad/ad.interface";
import { DataProvider } from "../../providers/data/data";

/**
 * Generated class for the MyAdsListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */

@Component({
  selector: "my-ads-list",
  templateUrl: "my-ads-list.html",
  animations: [
    trigger("deleteButtonState", [
      state(
        "inactive",
        style({
          transform: "scale(1)"
        })
      ),
      state(
        "active",
        style({
          transform: "scale(1.5)"
        })
      ),
      transition("inactive => active", animate("50ms ease-in")),
      transition("active => inactive", animate("500ms ease-out"))
    ]),
    trigger("editMode", [
      state(
        "normal",
        style({
          opacity: "0",
          display: "none"
        })
      ),
      state(
        "edit",
        style({
          opacity: "1",
          display: "flex"
        })
      ),
      transition("normal => edit", [
        group([
          animate(".3s .2s ease", style({ opacity: "1" })),
          animate(".3s ease", style({ display: "flex" }))
        ])
      ]),
      transition("edit => normal", [
        group([
          animate(".3s ease", style({ opacity: "0" })),
          animate(".3s .2s ease", style({ display: "none" }))
        ])
      ])
    ])
  ]
})
export class MyAdsListComponent implements OnInit {
  @Output() onEditAd: EventEmitter<Ad>;
  @Output() onEditMode: EventEmitter<boolean>;
  @Output() onSelect: EventEmitter<number>;
  myAds: Observable<Ad[]>;
  deleteTapCount: number = 0;
  private _loadingInstance: Loading;
  deleteIconState: string = "inactive";
  private _toastInstance: Toast;
  editMode: string = "normal";
  private _selectedItemCount: number = 0;
  private _selectedAdForDeletion: Ad[];

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
        content: "Chargement de mes annonces..."
      });

      this._loadingInstance.present();

      this.myAds = await this._dataPvd.getMyAds();

      this._loadingInstance.dismiss();
    } catch (e) {
      this._toastCtrl.create({
        message: e.message,
        duration: 5000,
        cssClass: "globals__toast-error"
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
  deleteAd(ad?: Ad): void {
    this.deleteTapCount++;

    if (this.deleteTapCount <= 1) {
      this.toggleDeleteIconState();

      this._toastInstance = this._toastCtrl.create({
        message: "Appuyer encore une fois pour supprimer",
        duration: 3000,
        cssClass: "globals__toast-confirm",
        closeButtonText: "Annuler",
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
      this._loadingInstance = this._loadingCtrl.create({
        content: "Suppression en cours..."
      });

      this._loadingInstance.present();

      ad
        ? this._dataPvd.deleteAd(ad)
        : this._dataPvd.bulkDeleteAd(this._selectedAdForDeletion);

      this._loadingInstance.dismiss();
    }
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
      this.deleteIconState === "active" ? "inactive" : "active";
  }

  /**
   * Triggered when and ttem is dragged.
   * Get drag  direction
   *
   * @param {any} event
   * @memberof MyAdsListComponent
   */
  itemSwipe(event) {
    const slidingPercent = event.getSlidingPercent();

    if (slidingPercent <= 0) {
      // To the left
      this.deleteIconState = "inactive";
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
  toggleEditMode(checkbox: any, ad: Ad): void {
    this.editMode = "edit";
    this.onEditMode.emit(true);

    if (!checkbox.checked) checkbox.checked = true;
    this._selectedAdForDeletion.push(ad);

    this._selectedItemCount = 1;

    this.onSelect.emit(this._selectedItemCount);
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
  onChecked(checkbox: any, ad: Ad): void {
    if (checkbox.checkbox) {
      this._selectedItemCount++;
      this._selectedAdForDeletion.push(ad);
    } else {
      this._selectedItemCount--;
      this._selectedAdForDeletion = this._selectedAdForDeletion.filter(
        ad => ad.id !== ad.id
      );
    }
    if (this._selectedItemCount === 0) {
      this.editMode = "normal";
      this.onEditMode.emit(false);
    }

    this.onSelect.emit(this._selectedItemCount);
  }
}
