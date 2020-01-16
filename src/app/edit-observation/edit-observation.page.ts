import { Component, OnInit } from '@angular/core';
import { Platform, ModalController } from '@ionic/angular';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';

import { Observation, ImgData } from '../models';
import { ObservationTypeModalPage } from '../observation-type-modal/observation-type-modal.page';

const PHOTO_DEBUG = true;

@Component({
  selector: 'app-edit-observation',
  templateUrl: './edit-observation.page.html',
  styleUrls: ['./edit-observation.page.scss'],
})
export class EditObservationPage implements OnInit {
  observation = new Observation();

  cameraOptions: CameraOptions;
  photoLibraryOptions: CameraOptions;

  modal: any;

  constructor(
    private platform: Platform,
    private camera: Camera,
    private filePath: FilePath,
    private modalController: ModalController,
  ) {
    const commonCameraOptions: CameraOptions = {
      quality: 100,
      destinationType: !PHOTO_DEBUG ? this.camera.DestinationType.FILE_URI : this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
    };

    this.cameraOptions = {
      ...commonCameraOptions,
      sourceType: this.camera.PictureSourceType.CAMERA,
    };

    this.photoLibraryOptions = {
      ...commonCameraOptions,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    };
  }

  ngOnInit() {
  }

  get title() {
    return this.observation.id ? 'NEWOBS.EDITOBS' : 'NEWOBS.NEWOBS';
  }

  get imageUrl() {
    if (this.observation.imgData) {
      if (PHOTO_DEBUG && this.observation.imgData.debugDataUri) {
        return this.observation.imgData.debugDataUri;
      } else if (!PHOTO_DEBUG && this.observation.imgData.fileUri) {
        return this.observation.imgData.fileUri;
      }
    }

    return undefined;
  }

  async takePicture(usePhotoLibrary?: 'photoLibrary') {
    await this.platform.ready();

    const imageUrl = await this.camera.getPicture(!usePhotoLibrary ? this.cameraOptions : this.photoLibraryOptions);

    try {
      this.observation.imgData = new ImgData();
      if (!PHOTO_DEBUG) {
        const path = await this.filePath.resolveNativePath(imageUrl);
        this.observation.imgData.fileUri = path;
      } else {
        this.observation.imgData.debugDataUri = `data:image/png;base64,${imageUrl}`;
      }
      this.observation.imgData.observation = this.observation;
    } catch(e) {
      window.alert(e.message);
    }
  }

  async openTypeModal() {
    const modal = await this.modalController.create({
      component: ObservationTypeModalPage,
    });
    modal.onDidDismiss().then(event => {
      const { observationType } = event.data;
      this.observation.type = observationType;
    });
    await modal.present();
  }
}
