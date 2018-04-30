import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, AlertController, Loading, LoadingController, ToastController } from 'ionic-angular';
import { Profile } from '../../models/profile/profile.interface';
import { DataProvider } from '../../providers/data/data';
import { Camera, CameraOptions } from "@ionic-native/camera";


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
export class EditProfileFormComponent implements OnInit {


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

  constructor(
    private formBuilder: FormBuilder,
    private dataPvd: DataProvider,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private actShtCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private camera: Camera) {

    // Profile form form group
    this.profile = this.formBuilder.group({
      name: ['', Validators.compose([Validators.minLength(3), Validators.pattern('[a-zA-Z -]*'), Validators.required])],

      username: ['', Validators.compose([Validators.required, Validators.pattern('[a-z0-9_]*'), Validators.minLength(3)])],

      email: ['', Validators.compose([Validators.email, Validators.required])],

      phoneNumber: ['', Validators.compose([Validators.maxLength(8), Validators.required, Validators.minLength(8)])],

      city: ['', Validators.compose([Validators.required])]
    })

    this.userProfileCreated = new EventEmitter<Profile>();

  }

  ngOnInit(): void {

    // Define error messages for input fields

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

      await this.dataPvd.createUserProfile(this.userProfile);

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

  showActionSheet() {

    this.actShtCtrl.create({
      title: 'Image de profil',
      buttons: [
        {
          text: 'Galérie',
          handler: () => {
            this.handleCamera(this.camera.PictureSourceType.PHOTOLIBRARY);
          },
          icon: 'image'
        },
        {
          text: 'Caméra',
          handler: () => {
            this.handleCamera(this.camera.PictureSourceType.CAMERA);
          },
          icon: 'camera'
        }
      ]
    }).present();

  }

  /**
   * This function capture image from either the
   * device camera or gallery
   * 
   * @private
   * @param {number} sourceType Picture source. Use Camera["PictureSourceType"] property
   * @memberof EditProfileFormComponent
   */
  private async handleCamera(sourceType: number) {

    try {

      const srcTypeRef = this.camera.PictureSourceType;

      if (sourceType !== srcTypeRef.CAMERA && sourceType !== srcTypeRef.PHOTOLIBRARY && sourceType !== srcTypeRef.SAVEDPHOTOALBUM) {
        throw new Error('La source spécifiée est invalide');
      }

      const cameraOptions: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: sourceType,
        targetHeight: 500,
        targetWidth: 500,
        saveToPhotoAlbum: false,
        allowEdit: true,
      };

      const imageData = await this.camera.getPicture(cameraOptions);

      this.userProfile.picture = `data:image/jpeg;base64,${imageData}`

      this.camera.cleanup();

    } catch (e) {

      this.toastCtrl.create({
        message: e.message,
        duration: 5000,
      }).present();

    }

  }

}
