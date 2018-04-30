import { Injectable } from '@angular/core';
import { AngularFireStorage } from 'angularfire2/storage';
import { Profile } from '../../models/profile/profile.interface';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the StorageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StorageProvider {

  constructor(private _afStorage: AngularFireStorage) {
  }

  async createUploadTask(profile: Profile): Promise<Observable<string>> {

    const task = this._afStorage.ref(`avatar/${profile.uid}`).putString(profile.picture, 'data_url')

    return task.downloadURL();

  }

}
