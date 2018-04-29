import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Account } from '../../models/account/account.interface';
import { NavController, ToastController, LoadingController, Loading } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { Profile } from '../../models/profile/profile.interface';

/**
 * Generated class for the RegisterFormComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'register-form',
  templateUrl: 'register-form.html'
})
export class RegisterFormComponent {

  @Output() userCreated: EventEmitter<Profile>;

  registerForm: FormGroup;
  errorMessages;
  account = {} as Account;
  loadingInstance: Loading;


  constructor(
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private authPvd: AuthProvider,
    private toastCtrl: ToastController,
    private loadCtrl: LoadingController) {

    this.registerForm = formBuilder.group({
      email: ['', Validators.compose([Validators.email, Validators.required])],
      password: ['', Validators.compose([Validators.required, Validators.pattern('(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$')])]
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
        },
        {
          type: 'pattern', message: 'Le mot de passe doit contenir au moins 6 caractères dont une majuscule, une minuscule, un chiffre et un caractère spécial (!@#$%^&*)'
        }
      ]

    }

    this.userCreated = new EventEmitter<Profile>();

  }

  goBackToLoginPage(): void {

    this.navCtrl.pop();

  }

  async signUpWithEmailAndCredential() {

    this.loadingInstance = this.loadCtrl.create({
      content: 'Creation du compte...',
    });

    try {
      // Show loading dialog...
      this.loadingInstance.present();

      const profile = <Profile>await this.authPvd.signUpWithEmailAndPassword(this.account);

      this.loadingInstance.dismiss();

      this.userCreated.emit(profile);


    } catch (e) {

      this.loadingInstance.dismiss();

      this.toastCtrl.create({
        message: e.message,
        duration: 5000,
        showCloseButton: true,
        cssClass: 'globals__toast-error'
      }).present();

    }

  }

}
