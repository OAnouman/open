import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Profile } from '../../models/profile/profile.interface';
import { User } from 'firebase';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the DataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataProvider {

  constructor(
    private afs: AngularFirestore) {
  }


  async createUserProfile(profile: Profile) {

    await this.afs.doc<Profile>(`profiles/${profile.uid}`).set(profile);

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
