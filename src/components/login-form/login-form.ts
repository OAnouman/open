import { Component, Output, EventEmitter } from '@angular/core';
import { NavController, ToastController, LoadingController, Loading } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { Profile } from '../../models/profile/profile.interface';
import { Account } from '../../models/account/account.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Observable';

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
export class LoginFormComponent {


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
  loadingInstance: Loading;

  // Manage login and register button states

  isButtonsDisabled: boolean;

  constructor(
    private authPvd: AuthProvider,
    private toastCtrl: ToastController,
    private formGroup: FormBuilder,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController) {

    this.userProfile = new EventEmitter<Profile>();

    this.isButtonsDisabled = false;

    this.loginForm = formGroup.group({
      email: ['', Validators.compose([Validators.email, Validators.required])],
      password: ['', Validators.compose([Validators.required])]
    })

    this.errorMessages = {

      email: [
        {
          type: 'email', message: 'L\'adresse mail doit être valide.'
        },
        {
          type: 'required', message: 'L\'adresse mail est requise.'
        }
      ],
      password: [
        {
          type: 'required', message: 'Le mot de passe est requis.'
        }
      ]

    }

  }


  /**
   * Login and emit profile
   * 
   * @memberof LoginFormComponent
   */
  async signInWithEmailAndPassword(event) {

    this.isButtonsDisabled = true;

    this.loadingInstance = this.loadingCtrl.create({
      content: 'Connexion...'
    });

    try {

      this.loadingInstance.present();

      const profile = await this.authPvd.signInWithEmailAndPassword(this.account);

      profile.subscribe((profile: Profile) => {

        // If user doesn't have a profile with 
        // the current user mail
        // new create one and emit it

        if (!profile) {

          profile = <Profile>{
            email: this.account.email,
            uid: this.authPvd.getAuthenticatedUser().uid
          }

        }

        this.userProfile.emit(profile);


      })

      this.loadingInstance.dismiss();

    } catch (e) {

      this.isButtonsDisabled = false;

      this.loadingInstance.dismiss();

      this.toastCtrl.create({
        message: e.message,
        duration: 5000,
        showCloseButton: true,
        cssClass: 'globals__toast-error',
      }).present();
    }

  }

  goToRegisterPage(): void {

    this.navCtrl.push('RegisterPage');

  }

}
