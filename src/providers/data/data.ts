import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Profile } from '../../models/profile/profile.interface';
import { StorageProvider } from '../storage/storage';
import { User } from 'firebase';


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
  async createUserProfile(profile: Profile) {

    // If avatar selected, upload then save profile with 
    // avatar url

    if (profile.picture) {

      (await this._storagePvd.createUploadTask(profile)).subscribe(async (downloadLink: string) => {

        profile.picture = downloadLink;

        await this.afs.doc<Profile>(`profiles/${profile.uid}`).set(profile);

      })

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

}
