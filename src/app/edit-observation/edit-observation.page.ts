import { Component, OnInit } from '@angular/core';
import { Platform, ModalController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Capacitor } from '@capacitor/core';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import * as L from 'leaflet';
import 'leaflet-providers';
import { TranslateService } from '@ngx-translate/core';
import { Repository } from 'typeorm';
import * as moment from 'moment';

import { Observation, ImgData, MapLocation, ObservationType } from '../models';
import { ObservationTypeModalPage } from '../observation-type-modal/observation-type-modal.page';
import { MapModalPage } from '../map-modal/map-modal.page';
import { DebugService } from '../debug.service';
import { DbService } from '../db.service';
import { TransactionScriptRunnerService } from '../db/transaction-script-runner.service';
import { thunderforestApiKey } from '../secrets.json';

const componentDateFormat = 'YYYY-MM-DDTHH:mm:ss';

@Component({
  selector: 'app-edit-observation',
  templateUrl: './edit-observation.page.html',
  styleUrls: ['./edit-observation.page.scss'],
})
export class EditObservationPage implements OnInit {
  observation$: Observable<Observation>;

  observation: Observation;
  imgData: ImgData;
  mapLocation: MapLocation;
  type: ObservationType;

  time = moment.default().format(componentDateFormat);

  cameraOptions: CameraOptions;
  photoLibraryOptions: CameraOptions;
  showImageSpinner = false;

  modal: any;

  map: L.Map;
  marker: L.Marker;

  constructor(
    private platform: Platform,
    private route: ActivatedRoute,
    private camera: Camera,
    private filePath: FilePath,
    private modalController: ModalController,
    private geolocation: Geolocation,
    private translateService: TranslateService,
    private router: Router,
    private debugService: DebugService,
    private dbService: DbService,
    private transactionScriptRunner: TransactionScriptRunnerService,
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
    this.observation$ = this.route.paramMap.pipe(
      switchMap(async params => {
        const observationId = +params.get('id');

        if (!observationId) {
          return undefined;
        }

        try {
          const observation = await this.dbService.observationGateway.getById(observationId);
          return observation;
        } catch (e) {
          window.alert(`Error fetching observation: ${e.message}`);
        }
      })
    );

    this.observation$.subscribe({
      next: async (observation) => {
        this.observation = observation || new Observation();

        if (observation && observation.id) {
          try {
            this.imgData = await this.dbService.imgDataGateway.getByObservationId(observation.id);
          } catch (e) {
            window.alert(`Error fetching image data: ${e.message}`);
          }
          try {
            this.mapLocation = await this.dbService.mapLocationGateway.getByObservationId(observation.id);
          } catch (e) {
            window.alert(`Error fetching map location: ${e.message}`);
          }
          try {
            this.type = await this.dbService.observationTypeGateway.getByTypeName(observation.type);
          } catch (e) {
            window.alert(`Error fetching observation type: ${e.message}`);
          }
        }
      },
    });
  }

  ionViewDidEnter() {
    this.platform.ready().then(() => {
      this.initLeafletMap();
    });
  }

  get title() {
    return this.observation && this.observation.id ? 'NEWOBS.EDITOBS' : 'NEWOBS.NEWOBS';
  }

  get imageUrl() {
    if (this.imgData) {
      return Capacitor.convertFileSrc(this.imgData.fileUri);
    }

    return undefined;
  }

  async takePicture(usePhotoLibrary?: 'photoLibrary') {
    await this.platform.ready();

    this.showImageSpinner = true;

    const imageUrl = await this.camera.getPicture(!usePhotoLibrary ? this.cameraOptions : this.photoLibraryOptions);

    try {
      const path = await this.filePath.resolveNativePath(`file://${imageUrl}`);
      // const dataUrl = this.debugService.debugMode ? await this.imageToDataUrl(Capacitor.convertFileSrc(imageUrl)) : null;
      if (this.imgData) {
        this.imgData.fileUri = path;
        this.imgData.debugDataUri = null;
      } else {
        this.imgData = new ImgData(path, null, null);
      }
    } catch(e) {
      window.alert(e.message);
    }

    this.showImageSpinner = false;
  }

  imageToDataUrl(url): Promise<string> {
    const xhr = new XMLHttpRequest();
    return new Promise((resolve, reject) => {
      xhr.onload = () => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        }
        reader.onerror = reject;
        reader.readAsDataURL(xhr.response);
      }
      xhr.open('GET', url);
      xhr.responseType = 'blob';
      xhr.send();
    });
  }

  async openTypeModal() {
    const modal = await this.modalController.create({
      component: ObservationTypeModalPage,
    });

    modal.onDidDismiss().then(event => {
      if (event.data) {
        const { observationType } = event.data;
        if (observationType) {
          this.type = observationType;
          this.observation.type = observationType && observationType.name;
        }
      }
    });

    await modal.present();
  }

  async initLeafletMap() {
    if (this.mapLocation && this.mapLocation.id) {
      const { latitude, longitude } = this.mapLocation.coords;
      const latLng = L.latLng(latitude, longitude);
      this.createLeafletMap(latLng);
      return;
    }

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
    this.setLeafletMarkerAndPan(latLng);
    setTimeout(() => {
      this.map.invalidateSize();
    }, 1500);
  }

  async openMapModal() {
    const modal = await this.modalController.create({
      component: MapModalPage,
    });
    modal.onDidDismiss().then(event => {
      if (event.data && event.data.mapLocation) {
        if (!this.mapLocation) {
          this.mapLocation = event.data.mapLocation;
        } else {
          const { name, coords } = event.data.mapLocation;
          this.mapLocation.name = name;
          this.mapLocation.coords = coords;
        }
        const { latitude, longitude } = this.mapLocation.coords;
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
    if (!this.observation.title) {
      window.alert(this.translateService.instant('NEWOBS.ADDTITLE'));
      return;
    }

    if (!this.observation.type) {
      window.alert(this.translateService.instant('NEWOBS.SELECTTYPEEXCL'));
      return;
    }

    if (!this.time) {
      window.alert(this.translateService.instant('NEWOBS.SELECTDATE'));
      return;
    }

    this.observation.date = moment.default(this.time);

    if (this.observation && !this.observation.id) {
      const res = await this.transactionScriptRunner.saveNewObservation(this.observation, this.imgData, this.mapLocation);
      if (!res) {
        return;
      }
    }

    await this.router.navigate(['/home'])
  }
}
