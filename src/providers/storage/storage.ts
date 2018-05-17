import { Injectable } from '@angular/core';
import { AngularFireStorage } from 'angularfire2/storage';
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

  async createImageUploadTask(image: string, path: string): Promise<Observable<string>> {

    const task = this._afStorage.ref(path).putString(image, 'data_url')

    return task.downloadURL();

  }

  async deleteFiles(urls: string[]) {

    urls.forEach(async url =>
      await this._afStorage.storage.refFromURL(url).delete())

  }


}
