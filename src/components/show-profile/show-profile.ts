import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Loading, LoadingController } from 'ionic-angular';
import { Profile } from '../../models/profile/profile.interface';
import { AuthProvider } from '../../providers/auth/auth';
import { DataProvider } from '../../providers/data/data';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';

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
  @Output() loggedOut: EventEmitter<null>;
  profile: Profile;

  loadingInstance: Loading;

  text: string;

  constructor(
    private _localStrgPvd: LocalStorageProvider,
    private _loadingCtrl: LoadingController,
    private _dataPvd: DataProvider,
    private _authPvd: AuthProvider
  ) {
    this.profileLoaded = new EventEmitter<Profile>();

    this.loggedOut = new EventEmitter();
  }

  ngOnInit(): void {
    this.loadingInstance = this._loadingCtrl.create({
      content: 'Chargement...'
    });

    this.loadingInstance.present();

    this._localStrgPvd.get('uid').then(uid => {
      this._dataPvd.getProfileFromUid(uid).subscribe(profile => {
        this.profile = profile;
        this.profileLoaded.emit(profile);
        this.loadingInstance.dismiss();
      });
    });
  }

  async logOut() {
    await this._authPvd.logout();

    this.loggedOut.emit();
  }
}
