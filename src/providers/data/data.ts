import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import { Profile } from '../../models/profile/profile.interface';
import { StorageProvider } from '../storage/storage';
import { User } from 'firebase';
import { Storage } from "@ionic/storage";


/*
  Generated class for the DataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataProvider {


  constructor(
    private afs: AngularFirestore,
    private _storagePvd: StorageProvider) {

  }

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

        await this.afs.doc<Profile>(`profiles/${profile.uid}`).set(profile);

      } else if (profile.picture.startsWith('data:image')) {
        // Picture sets for first time or new picture selected
        (await this._storagePvd.createUploadTask(profile)).subscribe(async (downloadLink: string) => {
          profile.picture = downloadLink;
          await this.afs.doc<Profile>(`profiles/${profile.uid}`).set(profile);
        })

      }
    } else {
      await this.afs.doc<Profile>(`profiles/${profile.uid}`).set(profile);
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
    return this.afs.doc<Profile>(`profiles/${user.uid}`).valueChanges();
  }

  getProfileFromUid(uid: string) {
    return this.afs.doc<Profile>(`profiles/${uid}`).valueChanges();
  }


}
