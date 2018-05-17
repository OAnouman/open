import { Component, ViewChild } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Ad } from "../../models/ad/ad.interface";
import { MyAdsListComponent } from "../../components/my-ads-list/my-ads-list";
import { StatusBar } from "@ionic-native/status-bar";

/**
 * Generated class for the MyAdsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-my-ads",
  templateUrl: "my-ads.html"
})
export class MyAdsPage {
  @ViewChild(MyAdsListComponent)
  set form(myAdList: MyAdsListComponent) {
    this._myAdsComponent = myAdList;
  }
  private _myAdsComponent: MyAdsListComponent;
  navBarColor: string;
  NAVBAR_COLOR_NORMAL: string = "primary";
  NAVBAR_COLOR_EDIT: string = "secondary";
  isInEditMode: boolean = false;
  title: string;
  TITLE_NORMAL = "Mes annonces";
  TITLE_EDIT_SINGULAR: string = "sélectionné";
  TITLE_EDIT_PLURAL: string = "sélectionnés";
  constructor(
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _statusBar: StatusBar
  ) {
    this.navBarColor = this.NAVBAR_COLOR_NORMAL;
    this.title = this.TITLE_NORMAL;
  }

  onEditAd(ad: Ad): void {
    this._navCtrl.push("EditAdPage", { ad });
  }

  sort(event) {}

  openNewAdPage() {
    this._navCtrl.push("NewAdPage");
  }

  /**
   * Get Edit mode status
   *
   * @param {boolean} isInEditMode
   * @memberof MyAdsPage
   */
  onEditMode(isInEditMode: boolean): void {
    this.isInEditMode = isInEditMode;

    if (isInEditMode) {
      this.navBarColor = this.NAVBAR_COLOR_EDIT;
      this._statusBar.backgroundColorByHexString("#b18800");
    } else {
      this.navBarColor = this.NAVBAR_COLOR_NORMAL;
      this._statusBar.backgroundColorByHexString("#a20019");
    }
  }

  /**
   * Get selected ads count
   *
   * @param {number} count
   * @memberof MyAdsPage
   */
  onSelect(count: number): void {
    if (!this.isInEditMode) {
      this.title = this.TITLE_NORMAL;
    } else {
      if (count > 1) {
        // Plural
        this.title = `${count} ${this.TITLE_EDIT_PLURAL}`;
      } else {
        // Singular
        this.title = `${count} ${this.TITLE_EDIT_SINGULAR}`;
      }
    }
  }

  /**
   * Trigger bulk delete on @class MyAdsListComponent
   *
   * @memberof MyAdsPage
   */
  deleteBulk(): void {
    this._myAdsComponent.deleteAd();
  }

  ionViewWillLeave() {
    // Reset status bar color
    this._statusBar.backgroundColorByHexString("#a20019");
  }
}
