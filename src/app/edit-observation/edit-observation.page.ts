import { Component, OnInit } from '@angular/core';
import { Platform, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import * as L from 'leaflet';
import 'leaflet-providers';
import { TranslateService } from '@ngx-translate/core';
import { Repository } from 'typeorm';
import * as moment from 'moment';

import { Observation, ImgData, MapLocation } from '../models';
import { ObservationTypeModalPage } from '../observation-type-modal/observation-type-modal.page';
import { MapModalPage } from '../map-modal/map-modal.page';
import { DebugService } from '../debug.service';
import { DbService } from '../db.service';
import { thunderforestApiKey } from '../secrets.json';

const componentDateFormat = 'YYYY-MM-DDTHH:mm:ss';

@Component({
  selector: 'app-edit-observation',
  templateUrl: './edit-observation.page.html',
  styleUrls: ['./edit-observation.page.scss'],
})
export class EditObservationPage implements OnInit {
  observation = new Observation();
  time = moment.default().format(componentDateFormat);

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
    private translateService: TranslateService,
    private router: Router,
    private debugService: DebugService,
    private dbService: DbService,
  ) {
    const commonCameraOptions: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
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
      if (this.debugService.debugMode) {
        return (window as any).Ionic.WebView.convertFileSrc(this.observation.imgData.fileUri);
      } else {
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
      const path = await this.filePath.resolveNativePath(`file://${imageUrl}`);
      this.observation.imgData.fileUri = path;
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
        this.observation.mapLocation.observation = this.observation;
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

  async save() {
    if (!this.observation.type) {
      window.alert(this.translateService.instant('NEWOBS.SELECTTYPEEXCL'));
      return;
    }

    if (!this.time) {
      window.alert(this.translateService.instant('NEWOBS.SELECTDATE'));
      return;
    }

    try {
      const connection = await this.dbService.getConnection();

      connection.transaction(async entityManager => {
        this.observation.date = moment.default(this.time, componentDateFormat).format('YYYY-MM-DD HH:mm');
        await entityManager.save(this.observation);

        if (this.observation.imgData) {
          if (!this.observation.imgData.id) {
            await entityManager.delete(ImgData, { observation: this.observation });
          }
          await entityManager.save(this.observation.imgData);
        }

        if (this.observation.mapLocation) {
          if (!this.observation.mapLocation.id) {
            await entityManager.delete(MapLocation, { observation: this.observation });
          }
          await entityManager.save(this.observation.mapLocation);
        }
      });
    } catch(e) {
      window.alert(`Virhe: ${e.message}`);
      return;
    }

    await this.router.navigate(['/home'])
  }
}
