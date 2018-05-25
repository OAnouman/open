import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Loading,
  LoadingController,
  NavController,
  ToastController
} from 'ionic-angular';
import 'rxjs/Observable';
import { Account } from '../../models/account/account.interface';
import { Profile } from '../../models/profile/profile.interface';
import { AuthProvider } from '../../providers/auth/auth';
import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the LoginFormComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'login-form',
  templateUrl: 'login-form.html'
})
export class LoginFormComponent implements OnInit {
  /**
   * Event emmiting user profile after sign
   *
   * @type {EventEmitter<Profile>}
   * @memberof LoginFormComponent
   */
  @Output() userProfile: EventEmitter<Profile>;

  account = {} as Account;
  loginForm: FormGroup;
  errorMessages;
  private _loadingInstance: Loading;

  // Manage login and register button states

  isButtonsDisabled: boolean;

  constructor(
    private _authPvd: AuthProvider,
    private _toastCtrl: ToastController,
    private _formGroup: FormBuilder,
    private _navCtrl: NavController,
    private _loadingCtrl: LoadingController
  ) {
    this.userProfile = new EventEmitter<Profile>();

    this.isButtonsDisabled = false;

    this.loginForm = _formGroup.group({
      email: ['', Validators.compose([Validators.email, Validators.required])],
      password: ['', Validators.compose([Validators.required])]
    });
  }

  ngOnInit(): void {
    this.errorMessages = {
      email: [
        {
          type: 'email',
          message: "L'adresse mail doit être valide."
        },
        {
          type: 'required',
          message: "L'adresse mail est requise."
        }
      ],
      password: [
        {
          type: 'required',
          message: 'Le mot de passe est requis.'
        }
      ]
    };
  }

  async signInWithGoogle() {
    this._loadingInstance = this._loadingCtrl.create({
      content: 'Connexion...',
      dismissOnPageChange: true
    });

    try {
      this._loadingInstance.present();

      const profile$ = await this._authPvd.signInWithGoogle();

      this.getProfileFromGoogleAndEmit(profile$);
    } catch (e) {
      this._loadingInstance.dismiss();

      this._toastCtrl
        .create({
          message: e.message,
          duration: 5000,
          showCloseButton: true,
          cssClass: 'globals__toast-error'
        })
        .present();
    }
  }

  /**
   * Login and emit profile
   *
   * @memberof LoginFormComponent
   */
  async signInWithEmailAndPassword(event) {
    this.isButtonsDisabled = true;

    this._loadingInstance = this._loadingCtrl.create({
      content: 'Connexion...',
      dismissOnPageChange: true
    });

    try {
      this._loadingInstance.present();

      const profile$ = await this._authPvd.signInWithEmailAndPassword(
        this.account
      );

      this.getProfileFromEmailAndPAsswordAndEmit(profile$);
    } catch (e) {
      this.isButtonsDisabled = false;

      this._loadingInstance.dismiss();

      this._toastCtrl
        .create({
          message: e.message,
          duration: 5000,
          showCloseButton: true,
          cssClass: 'globals__toast-error'
        })
        .present();
    }
  }

  goToRegisterPage(): void {
    this._navCtrl.push('RegisterPage');
  }

  private getProfileFromEmailAndPAsswordAndEmit(profile$: Observable<Profile>) {
    profile$.take(1).subscribe(profile => {
      // If user doesn't have a profile with
      // the current user mail
      // new create one and emit it

      if (!profile) {
        profile = <Profile>{
          email: this.account.email,
          uid: this._authPvd.getCurrentUser().uid
        };
      }

      // Emit to host page
      this.userProfile.emit(profile);
    });
  }

  private getProfileFromGoogleAndEmit(res$: Observable<any>) {
    res$.take(1).subscribe(res => {
      // If user doesn't have a profile with
      // the current user mail
      // we create one and emit it

      let profile = {} as Profile;

      if (!res.uid) {
        profile = <Profile>{
          email: res.additionalUserInfo.profile.email,
          uid: res.user.uid,
          picture: res.additionalUserInfo.profile.picture,
          name: res.additionalUserInfo.profile.name
        };
      } else {
        profile = res;
      }

      this.userProfile.emit(profile);
    });
  }
}
