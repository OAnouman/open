import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { AngularFirestore } from 'angularfire2/firestore';
import { User } from 'firebase';
import firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Ad } from '../../models/ad/ad.interface';
import { Profile } from '../../models/profile/profile.interface';
import { Utils } from '../../utils/Utils';
import { StorageProvider } from '../storage/storage';


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
    private _storage: Storage) {

  }


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
      if (profile.picture.startsWith('https://')) {

        await this._afs.doc<Profile>(`profiles/${profile.uid}`).set(profile);

      } else if (profile.picture.startsWith('data:image')) {
        // Picture sets for first time or new picture selected
        (await this._storagePvd.createImageUploadTask(profile.picture, `profiles/${profile.uid}`)).subscribe(async (downloadLink: string) => {
          profile.picture = downloadLink;
          await this._afs.doc<Profile>(`profiles/${profile.uid}`).set(profile);
        })

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
    return this._afs.doc<Profile>(`profiles/${user.uid}`).valueChanges();
  }

  getProfileFromUid(uid: string) {
    return this._afs.doc<Profile>(`profiles/${uid}`).valueChanges();
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

    const uid = await this._storage.get('uid');

    ad.uid = uid;
    ad.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    ad.lastUpdatedAt = firebase.firestore.FieldValue.serverTimestamp();
    ad.price = Number(ad.price);
    ad.published = false;

    const adRef$ = await this._afs.collection<Ad>('ads').add(ad)

    // ...store imgs and update ad with img downloadLink

    this.saveAdPictures(ad, adRef$);


  }


  /**
   * Save ads pictures
   * 
   * @param {Ad} ad 
   * @param {firebase.firestore.DocumentReference} adRef$ 
   * @memberof DataProvider
   */
  private saveAdPictures(ad: Ad, adRef$: firebase.firestore.DocumentReference): void {

    // ...store imgs and update ad with img downloadLink

    // Will store ad picture downloadLinks
    let pictures: string[] = [];

    // Get ad pictures count
    const picturesCount: number = ad.pictures.length;

    ad.pictures.forEach(async (pic, index) => {

      (await this._storagePvd.createImageUploadTask(pic, `ads_pictures/${Utils.randomString(28)}`))
        .subscribe(async (downloadLink: string) => {
          pictures.push(downloadLink);

          // After the last img has been uploaded, 
          // We update ad with downlaodLinks

          if ((index + 1) === picturesCount) {
            await adRef$.update({ pictures, published: true });
          }

        })

    })

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
      return this.getAdsByUpdatedAtDesc(count)
    } else if (category) {
      return this.getAdsByCategory(count, category)
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
  getAdsByUpdatedAtDesc(count): Observable<Ad[]> {

    return this._afs.collection<Ad>('ads', ref => ref.where('published', '==', true).orderBy('lastUpdatedAt', 'desc').limit(count)).valueChanges()
      .map((ads: Ad[]) => {

        return ads.map((ad: Ad) => {

          ad.userProfile = this.getProfileFromUid(ad.uid)

          return ad;

        })

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
  getAdsByCategory(count: number = this._AD_FETCH_STEP, category: string): Observable<Ad[]> {

    return this._afs.collection<Ad>('ads', ref =>
      ref.where('published', '==', true)
        .where('category', '==', category).orderBy('lastUpdatedAt', 'desc').limit(count)).valueChanges()
      .map((ads: Ad[]) => {

        return ads.map((ad: Ad) => {

          ad.userProfile = this.getProfileFromUid(ad.uid)

          return ad;

        })

      });

  }


}
