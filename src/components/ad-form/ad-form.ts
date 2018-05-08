import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ActionSheetController, AlertController, Loading, LoadingController, ToastController } from 'ionic-angular';
import { TAGS } from '../../enums/tags.enum'; //FIXME:
import { Ad } from '../../models/ad/ad.interface';
import { DataProvider } from '../../providers/data/data';

/**
 * Generated class for the AdFormComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'ad-form',
  templateUrl: 'ad-form.html'
})
export class AdFormComponent implements OnInit {


  @Output() adCreated: EventEmitter<Ad>;
  tags = TAGS;

  selectOptions: {};

  ad = {} as Ad;
  adForm: FormGroup;

  errorMessages;

  loadingInstance: Loading;

  selectedText: string;

  constructor(
    private _formBuilder: FormBuilder,
    private _alertCtrl: AlertController,
    private _dataPvd: DataProvider,
    private _camera: Camera,
    private _actShtCtrl: ActionSheetController,
    private _toastCtrl: ToastController,
    private _loadingCtrl: LoadingController) {

    this.adCreated = new EventEmitter<Ad>();

    this.adForm = _formBuilder.group({
      title: ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
      price: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]*')])],
      tags: ['', Validators.compose([Validators.required])],
      body: ['', Validators.compose([Validators.required, Validators.minLength(30)])]
    })

    this.selectOptions = {
      title: 'Etiquettes',
      subTitle: 'Selectionnez les étiquettes correspondantes à votre annonce',
    };

  }

  ngOnInit(): void {

    this.errorMessages = {

      title: [
        {
          type: 'required', message: 'Le titre est requis.'
        },
        {
          type: 'maxlength', message: 'Le titre doit contenir au plus 30 caractères.'
        }
      ],

      price: [
        {
          type: 'required', message: 'Le prix est requis.'
        },
        {
          type: 'pattern', message: 'Le prix ne doit contenir que des chiffres entre 0 et 9.'
        }
      ],

      tags: [
        {
          type: 'required', message: 'Vous devez selectionnre au moins une étiquette.'
        }
      ],

      body: [
        {
          type: 'required', message: 'La description est requise.'
        },
        {
          type: 'minlength', message: 'La description doit contenir au moins 30 caractères.'
        }
      ],

      pictures: [{
        type: 'required', message: 'Ajoutez au moins une image'
      }]

    }

  }

  tagsSelectionChange() {

    this.selectedText = this.ad.tags.map(tag => tag.name).join(', ');

  }

  /** 
   * Delete selected ad image
   * 
   * @param {string} imageToDelete 
   * @memberof AdFormComponent
   */
  deleteImg(imageToDelete: string) {

    this._actShtCtrl.create({
      title: 'Supprimer image',
      buttons: [
        {
          text: 'Supprimer',
          icon: 'trash',
          role: 'destructive',
          handler: () => {
            this.ad.pictures = this.ad.pictures.filter(pic => pic !== imageToDelete)
          }
        },
        {
          text: 'Annuler',
          role: 'cancel',
          icon: 'close'
        }
      ]
    }).present();

  }


  /**
   * Save ad to firestore cloud
   * 
   * @memberof AdFormComponent
   */
  async saveAd(): Promise<void> {

    if (this.adForm.valid && this.ad.pictures.length > 0) {

      try {

        this.loadingInstance = this._loadingCtrl.create({ content: 'Publication de l\'annonce...', dismissOnPageChange: true });

        this.loadingInstance.present();

        await this._dataPvd.saveAd(this.ad)

        // Send created ad to New ad page

        this.adCreated.emit(this.ad);

      } catch (e) {

        this._toastCtrl.create({
          message: e.message,
          duration: 5000,
          cssClass: 'globals__toast-error'
        })
      }

    } else {
      this._alertCtrl.create({
        message: 'Veuillez fournir les informations requises pour pouvoir publier votre annonce.',
        title: 'Formulaire incomplet',
        buttons: [
          {
            text: 'Retourner au formulaire',
            role: 'cancel'
          }
        ]
      }).present();
    }
  }

  showActionSheet() {

    this._actShtCtrl.create({
      title: 'Ajouter une image',
      cssClass: 'action-sheet-buttons__image-delete',
      buttons: [
        {
          text: 'Galerie',
          handler: () => {
            this.handleCamera(this._camera.PictureSourceType.PHOTOLIBRARY);
          },
          icon: 'image'
        },
        {
          text: 'Caméra',
          handler: () => {
            this.handleCamera(this._camera.PictureSourceType.CAMERA);
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

      const srcTypeRef = this._camera.PictureSourceType;

      if (sourceType !== srcTypeRef.CAMERA && sourceType !== srcTypeRef.PHOTOLIBRARY && sourceType !== srcTypeRef.SAVEDPHOTOALBUM) {
        throw new Error('La source spécifiée est invalide');
      }

      const cameraOptions: CameraOptions = {
        quality: 100,
        destinationType: this._camera.DestinationType.DATA_URL,
        encodingType: this._camera.EncodingType.JPEG,
        mediaType: this._camera.MediaType.PICTURE,
        sourceType: sourceType,
        targetHeight: 500,
        targetWidth: 500,
        saveToPhotoAlbum: false,
        allowEdit: true,
      };

      const imageData = await this._camera.getPicture(cameraOptions);

      if (this.ad.pictures === undefined) this.ad.pictures = [];

      this.ad.pictures.push(`data:image/jpeg;base64,${imageData}`)

      this._camera.cleanup();

    } catch (e) {

      this._toastCtrl.create({
        message: e.message,
        duration: 5000,
      }).present();

    }

  }

}
