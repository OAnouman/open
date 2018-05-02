import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Profile } from '../../models/profile/profile.interface';
import { LoadingController, Loading } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the ShowProfileComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'show-profile',
  templateUrl: 'show-profile.html'
})
export class ShowProfileComponent implements OnInit {

  @Output() profileLoaded: EventEmitter<Profile>;
  profile: Profile;

  loadingInstance: Loading;

  text: string;

  constructor(
    private _storage: Storage,
    private _loadingCtrl: LoadingController,
    private _dataPvd: DataProvider) {

    this.profileLoaded = new EventEmitter<Profile>();

  }

  ngOnInit(): void {

    this.loadingInstance = this._loadingCtrl
      .create({ content: 'Chargement...' });

    this.loadingInstance.present();

    this._storage.get('uid')
      .then(uid => {
        this._dataPvd.getProfileFromUid(uid)
          .subscribe(profile => {
            this.profile = profile
            this.profileLoaded.emit(profile);
            this.loadingInstance.dismiss();
          })
      })


  }



}
