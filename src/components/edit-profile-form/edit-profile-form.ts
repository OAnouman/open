import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Profile } from '../../models/profile/profile.interface';
import { DataProvider } from '../../providers/data/data';
import { Loading, LoadingController, ToastController } from 'ionic-angular';


/**
 * Generated class for the EditProfileFormComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'edit-profile-form',
  templateUrl: 'edit-profile-form.html'
})
export class EditProfileFormComponent {


  @Input() userProfile: Profile;

  @Output() userProfileCreated: EventEmitter<Profile>;

  /**
   * Reference to profile frm
   * 
   * @type {FormGroup}
   * @memberof EditProfileFormComponent
   */
  profile: FormGroup;

  /**
   * Custom errors mesasge.
   * Handle errors messages for form validation 
   * 
   * @memberof EditProfileFormComponent
   */
  errorMessages;

  private loadingInstance: Loading;

  // Inputs mask
  masks: any;

  // (0 4 5 6 7 8) d - dd-dd-dd

  constructor(
    private formBuilder: FormBuilder,
    private dataPvd: DataProvider,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController) {

    // Profile form form group
    this.profile = this.formBuilder.group({
      name: ['', Validators.compose([Validators.minLength(3), Validators.pattern('[a-zA-Z -]*'), Validators.required])],

      username: ['', Validators.compose([Validators.required, Validators.pattern('[a-z0-9_]*'), Validators.minLength(3)])],

      email: ['', Validators.compose([Validators.email, Validators.required])],

      phoneNumber: ['', Validators.compose([Validators.maxLength(8), Validators.required, Validators.minLength(8)])],

      city: ['', Validators.compose([Validators.required])]
    })


    this.errorMessages = {

      name: [
        {
          type: 'minlength', message: 'Le nom doit contenir au moins 3 caractères.'
        },
        {
          type: 'pattern', message: 'Le nom ne peut contenir que des lettres et des tirets.'
        },
        {
          type: 'required', message: 'Le nom est requis.'
        }
      ],

      username: [
        {
          type: 'minlength', message: 'Le nom d\'utilisateur doit contenir au moins 3 caractères.'
        },
        {
          type: 'pattern', message: 'Le nom d\'utilidateur ne peut contenir que des lettres minuscules et le caratère (_).'
        },
        {
          type: 'required', message: 'Le nom d\'utilisateur est requis.'
        }
      ],

      email: [
        {
          type: 'email', message: 'L\'adresse email doit être valide.'
        },
        {
          type: 'required', message: 'L\'adresse email est requise.'
        }
      ],
      phoneNumber: [
        {
          type: 'maxlength', message: 'Le numéro mobile doit contenir au plus 8 caractères.'
        },
        {
          type: 'minlength', message: 'Le numéro mobile doit contenir au moins 8 caractères.'
        },
        {
          type: 'required', message: 'Le numéro mobile est requis.'
        }
      ],
      city: [
        {
          type: 'required', message: 'La ville est requise.'
        }
      ]

    }

    this.userProfileCreated = new EventEmitter<Profile>();

    this.masks = {
      phoneNumber: [/[0-8]/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/],
      username: ['@', /[a-zA-Z_]/]
    };

  }


  /**
   * Create usere profile and :mit event with profile
   * 
   * @memberof EditProfileFormComponent
   */
  async createProfile() {

    this.loadingInstance = this.loadingCtrl.create({
      content: 'Creation du profil...'
    })

    try {

      this.loadingInstance.present();

      // sanitize phoneNumber
      this.userProfile.phoneNumber = this.userProfile.phoneNumber.replace(/\D+/g, '');

      const docRef = await this.dataPvd.createUserProfile(this.userProfile);

      this.userProfileCreated.emit(this.userProfile);

      this.loadingInstance.dismiss();

    } catch (e) {

      this.loadingInstance.dismiss();

      this.toastCtrl.create({
        message: e.message,
        duration: 5000,
        cssClass: 'globals__toast-error'
      }).present();

    }

  }

}
