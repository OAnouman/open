import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/*
  Generated class for the LocalStorageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocalStorageProvider {
  constructor(private _storage: Storage) {}

  async set(key: string, value: any): Promise<void> {
    await this._storage.set(key, value);
  }

  async get(key: string): Promise<any> {
    return await this._storage.get(key);
  }

  async remove(key: string) {
    return await this._storage.remove(key);
  }

  public get storageType() {
    return this._storage.driver;
  }
}
