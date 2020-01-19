import { Component, OnInit } from '@angular/core';
import { Platform, ModalController } from '@ionic/angular';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import * as L from 'leaflet';
import 'leaflet-providers';

import { Observation, ImgData } from '../models';
import { ObservationTypeModalPage } from '../observation-type-modal/observation-type-modal.page';
import { MapModalPage } from '../map-modal/map-modal.page';
import { DebugService } from '../debug.service';
import { thunderforestApiKey } from '../secrets.json';

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

  map: L.Map;
  marker: L.Marker;

  constructor(
    private platform: Platform,
    private camera: Camera,
    private filePath: FilePath,
    private modalController: ModalController,
    private geolocation: Geolocation,
    private debugService: DebugService,
  ) {
    const commonCameraOptions: CameraOptions = {
      quality: 100,
      destinationType: !debugService ? this.camera.DestinationType.FILE_URI : this.camera.DestinationType.DATA_URL,
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
    this.platform.ready().then(() => {
      this.initLeafletMap();
    });
  }

  get title() {
    return this.observation.id ? 'NEWOBS.EDITOBS' : 'NEWOBS.NEWOBS';
  }

  get imageUrl() {
    if (this.observation.imgData) {
      if (this.debugService.debugMode && this.observation.imgData.debugDataUri) {
        return this.observation.imgData.debugDataUri;
      } else if (!this.debugService.debugMode && this.observation.imgData.fileUri) {
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
      if (!this.debugService.debugMode) {
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

  async initLeafletMap() {
    if (!this.debugService.debugMode) {
      const currentPosition = await this.geolocation.getCurrentPosition();
      const latLng = L.latLng(currentPosition.coords.latitude, currentPosition.coords.longitude);
      this.createLeafletMap(latLng);
    } else {
      const latLng =  L.latLng(61.497, 23.760);
      this.createLeafletMap(latLng);
    }
  }

  createLeafletMap(latLng: L.LatLng) {
    this.map = L.map(
      'map',
      {
        zoomControl: false,
        touchZoom: false,
        doubleClickZoom: false,
        dragging: false,
      }
    ).setView(latLng, 15);
    L.tileLayer.provider('Thunderforest.Outdoors', { apikey: thunderforestApiKey }).addTo(this.map);
    setTimeout(() => {
      this.map.invalidateSize();
    }, 1000);
  }

  async openMapModal() {
    const modal = await this.modalController.create({
      component: MapModalPage,
    });
    modal.onDidDismiss().then(event => {
      if (event.data && event.data.mapLocation) {
        this.observation.mapLocation = event.data.mapLocation;
        const { latitude, longitude } = this.observation.mapLocation;
        this.setLeafletMarkerAndPan(new L.LatLng(latitude, longitude));
      }
    });
    await modal.present();
  }

  setLeafletMarkerAndPan(latLng: L.LatLng) {
    if (!this.marker) {
      this.marker = L.marker(latLng).addTo(this.map);
    } else {
      this.marker.setLatLng(latLng);
    }
    this.map.panTo(latLng);
  }
}
