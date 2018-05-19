import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { AngularFirestore, DocumentChangeAction } from "angularfire2/firestore";
import { User } from "firebase";
import firebase from "firebase/app";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/count";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import "rxjs/add/operator/take";
import { Ad } from "../../models/ad/ad.interface";
import { AdView } from "../../models/adview/adView.interface";
import { Profile } from "../../models/profile/profile.interface";
import { Utils } from "../../utils/Utils";
import { StorageProvider } from "../storage/storage";

/*
  Generated class for the DataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataProvider {
  private _ADS_INIT_FETCH_COUNT: number = 5;
  private _AD_FETCH_STEP: number = 3;

  constructor(
    private _afs: AngularFirestore,
    private _storagePvd: StorageProvider,
    private _storage: Storage
  ) {}

  /********************************************************************
   *                                PROFILE
   ********************************************************************/

  /**
   * Create a new user profile
   *
   * @param {Profile} profile
   * @memberof DataProvider
   */
  async saveUserProfile(profile: Profile) {
    // If avatar selected, upload then save profile with
    // avatar url

    if (profile.picture) {
      // If picture is already online we just save
      // profile infos
      if (profile.picture.startsWith("https://")) {
        await this._afs.doc<Profile>(`profiles/${profile.uid}`).set(profile);
      } else if (profile.picture.startsWith("data:image")) {
        // Picture sets for first time or new picture selected
        (await this._storagePvd.createImageUploadTask(
          profile.picture,
          `profiles/${profile.uid}`
        )).subscribe(async (downloadLink: string) => {
          profile.picture = downloadLink;
          await this._afs.doc<Profile>(`profiles/${profile.uid}`).set(profile);
        });
      }
    } else {
      await this._afs.doc<Profile>(`profiles/${profile.uid}`).set(profile);
    }
  }

  /**
   * Get profile matching the given user
   *
   * @param {User} user
   * @returns {Observable<Profile>}
   * @memberof DataProvider
   */
  getUserProfile(user: User): Observable<Profile> {
    return this._afs
      .doc<Profile>(`profiles/${user.uid}`)
      .valueChanges()
      .take(1);
  }

  getProfileFromUid(uid: string) {
    return this._afs
      .doc<Profile>(`profiles/${uid}`)
      .valueChanges()
      .take(1);
  }

  /**
   * Add ad to user favorites
   *
   * @param {string} uid
   * @param {string} adId
   * @memberof DataProvider
   */
  addFavoriteAd(uid: string, adId: string) {
    this._afs
      .doc<Profile>(`profiles/${uid}`)
      .collection("favorites-ads")
      .doc(adId)
      .set({ fav: true });
  }

  /**
   * Remove ad from user favorites
   *
   * @param {string} uid
   * @param {string} adId
   * @memberof DataProvider
   */
  async removeFavoriteAd(uid: string, adId: string) {
    await this._afs
      .doc<Profile>(`profiles/${uid}`)
      .collection("favorites-ads")
      .doc(adId)
      .delete();
  }

  /**
   * Get all user favorttes ads
   *
   * @param {string} uid
   * @returns {Observable<{id?: string, fav: boolean}[]>}
   * @memberof DataProvider
   */
  getFavoritesAds(uid: string): Observable<{ id?: string; fav: boolean }[]> {
    return this._afs
      .doc<Profile>(`profiles/${uid}`)
      .collection("favorites-ads")
      .snapshotChanges()
      .map((actions: DocumentChangeAction[]) => {
        return actions.map((action: DocumentChangeAction) => {
          return <{ id?: string; fav: boolean }>{
            id: action.payload.doc.id,
            fav: action.payload.doc.data().fav
          };
        });
      })
      .take(1);
  }

  /**
   * Check if an ad is iin uer favorites
   *
   * @param {string} uid
   * @param {string} adId
   * @returns
   * @memberof DataProvider
   */
  isFavoriteAd(uid: string, adId: string) {
    return this._afs
      .doc<Profile>(`profiles/${uid}`)
      .collection("favorites-ads")
      .doc<{ fav: boolean }>(adId)
      .valueChanges()
      .map(favAd => favAd.fav);
  }

  /********************************************************************
   *                                ADS
   ********************************************************************/

  /**
   * This function saves ad and their pictures
   *
   * @param {Ad} ad
   * @memberof DataProvider
   */
  async saveAd(ad: Ad): Promise<void> {
    // we save first...

    const uid = await this._storage.get("uid");

    ad.uid = uid;
    ad.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    ad.lastUpdatedAt = firebase.firestore.FieldValue.serverTimestamp();
    ad.price = Number(ad.price);
    ad.published = false;

    const adRef$ = await this._afs.collection<Ad>("ads").add(ad);

    // ...store imgs and update ad with img downloadLink

    this.saveAdPictures(ad, adRef$);
  }

  /**
   * Update ad and picture
   *
   * @param {Ad} oldAd
   * @param {Ad} ad
   * @memberof DataProvider
   */
  async updateAd(oldAd: Ad, ad: Ad) {
    // Unpublish the ad
    ad.published = false;
    // Set update time
    ad.lastUpdatedAt = firebase.firestore.FieldValue.serverTimestamp();

    const deletedPics = oldAd.pictures.filter(
      oldPic => (ad.pictures.find(pic => oldPic === pic) ? false : true)
    );

    // Remove delete pics from storage

    await this._storagePvd.deleteFiles(deletedPics);

    await this._afs.doc<Ad>(`ads/${ad.id}`).update({
      body: ad.body,
      category: ad.category,
      lastUpdatedAt: ad.lastUpdatedAt,
      pictures: ad.pictures,
      price: ad.price,
      published: ad.published,
      tags: ad.tags,
      title: ad.title
    });

    const adRef$ = this._afs.doc<Ad>(`ads/${ad.id}`).ref;

    this.saveAdPictures(ad, adRef$);
  }

  /**
   * Delete single ad
   *
   * @param {Ad} ad
   * @memberof DataProvider
   */
  async deleteAd(ad: Ad) {
    // Delete images

    await this._storagePvd.deleteFiles(ad.pictures);

    await this._afs.doc<Ad>(`ads/${ad.id}`).delete();
  }

  /**
   * Bulk delete ads.
   * Delete all ads inside @field ads
   *
   * @param {Ad[]} ads
   * @memberof DataProvider
   */
  async bulkDeleteAd(ads: Ad[]) {
    if (!ads || ads.length === 0) return;

    ads.forEach(async ad => {
      await this._storagePvd.deleteFiles(ad.pictures);
      await this._afs.doc<Ad>(`ads/${ad.id}`).delete();
    });
  }

  /**
   * Save ads pictures
   *
   * @param {Ad} ad
   * @param {firebase.firestore.DocumentReference} adRef$
   * @memberof DataProvider
   */
  private saveAdPictures(
    ad: Ad,
    adRef$: firebase.firestore.DocumentReference
  ): void {
    // ...store imgs and update ad with img downloadLink

    // Will store ad picture downloadLinks
    let pictures: string[] = [];

    // Get ad pictures count
    const picturesCount: number = ad.pictures.length;

    ad.pictures.forEach(async (pic, index) => {
      // If picture is already online add to array then skip
      if (!pic.startsWith("data:image")) {
        pictures.push(pic);
        return;
      }

      (await this._storagePvd.createImageUploadTask(
        pic,
        `ads_pictures/${Utils.randomString(28)}`
      )).subscribe(async (downloadLink: string) => {
        pictures.push(downloadLink);

        // After the last img has been uploaded,
        // We update ad with downlaodLinks

        if (index + 1 === picturesCount) {
          await adRef$.update({ pictures, published: true });
        }
      });
    });
  }

  /**
   * Fetch data from firestore ads collection according to
   * sort criterias
   *
   * @param {number} [count=this._AD_FETCH_STEP]
   * @param {string} [category]
   * @returns
   * @memberof DataProvider
   */
  getAds(count: number = this._AD_FETCH_STEP, category?: string) {
    if (!category) {
      return this.getAdsByUpdatedAtDesc(count);
    } else if (category) {
      return this.getAdsByCategory(count, category);
    }
  }

  /**
   * This function retrieve all ads.
   * It returns the requested number f ads
   *
   * @param {number} [count=this._AD_FETCH_STEP] Count of ads to retrieve. If not specified, returns 5
   * @returns {Observable<Ad[]>}
   * @memberof DataProvider
   */
  private getAdsByUpdatedAtDesc(count): Observable<Ad[]> {
    return this._afs
      .collection<Ad>("ads", ref =>
        ref
          .where("published", "==", true)
          .orderBy("lastUpdatedAt", "desc")
          .limit(count)
      )
      .snapshotChanges()
      .map((actions: DocumentChangeAction[]) => {
        return actions.map((action: DocumentChangeAction) => {
          const ad = action.payload.doc.data() as Ad;
          ad.userProfile$ = this.getProfileFromUid(ad.uid);
          ad.id = action.payload.doc.id;
          ad.viewsCount = this.getAdViewsCount(action.payload.doc.id);

          return ad;
        });
      });
  }

  /**
   * Get ads sorted by category
   *
   * @param {number} [count=this._AD_FETCH_STEP] Number of ads to return
   * @param {string} category category name
   * @returns {Observable<Ad[]>}
   * @memberof DataProvider
   */
  private getAdsByCategory(
    count: number = this._AD_FETCH_STEP,
    category: string
  ): Observable<Ad[]> {
    return this._afs
      .collection<Ad>("ads", ref =>
        ref
          .where("published", "==", true)
          .where("category", "==", category)
          .orderBy("lastUpdatedAt", "desc")
          .limit(count)
      )
      .snapshotChanges()
      .map((actions: DocumentChangeAction[]) => {
        return actions.map(action => {
          const ad = action.payload.doc.data() as Ad;
          ad.userProfile$ = this.getProfileFromUid(ad.uid);
          ad.id = action.payload.doc.id;
          ad.viewsCount = this.getAdViewsCount(action.payload.doc.id);

          return ad;
        });
      });
  }

  async getMyAds(count: number): Promise<Observable<Ad[]>> {
    const uid = await this._storage.get("uid");

    return this._afs
      .collection<Ad>("ads", ref => ref.where("uid", "==", uid).limit(count))
      .snapshotChanges()
      .map((actions: DocumentChangeAction[]) => {
        return actions.map((action: DocumentChangeAction) => {
          return <Ad>{
            ...action.payload.doc.data(),
            id: action.payload.doc.id,
            viewsCount: this.getAdViewsCount(action.payload.doc.id).take(1),
            multiSelectSelected: false
          };
        });
      });
  }

  /********************************************************************
   *                                ADS VIEWS COUNT
   ********************************************************************/

  /**
   * Add user to poeple who have seen the ad
   *
   * @param {string} adId
   * @param {string} uid
   * @memberof DataProvider
   */
  async addView(adId: string) {
    const uid = await this._storage.get("uid");

    await this._afs
      .doc(`ads/${adId}`)
      .collection<AdView>(`seenBy`)
      .doc(uid)
      .set({ seen: true });
  }

  /**
   * Get ad views count
   *
   * @param {string} adId
   * @returns
   * @memberof DataProvider
   */
  private getAdViewsCount(adId: string) {
    return this._afs
      .doc<AdView>(`ads/${adId}`)
      .collection("seenBy")
      .valueChanges()
      .map(seens => {
        return seens.length;
      });
  }
}
