import { Component, OnInit } from '@angular/core';
import { Platform, ModalController } from '@ionic/angular';

import { Geolocation } from '@ionic-native/geolocation/ngx';

import * as L from 'leaflet';
import * as esri from 'esri-leaflet';
import * as Geocoding from 'esri-leaflet-geocoder';
import { TranslateService } from '@ngx-translate/core';

import { DebugService } from '../debug.service';
import { MapLocation } from '../models';
import { thunderforestApiKey } from '../secrets.json';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.page.html',
  styleUrls: ['./map-modal.page.scss'],
})
export class MapModalPage implements OnInit {
  map?: L.Map;
  marker?: L.Marker;
  searchControl?: L.esri.Geocoding.Geosearch;

  mapLocation?: MapLocation;

  constructor(
    private platform: Platform,
    private geolocation: Geolocation,
    private modalController: ModalController,
    private translateService: TranslateService,
    private debugService: DebugService,
  ) { }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.initLeafletMap();
    });
  }

  async initLeafletMap() {
    if (!this.debugService.debugMode) {
      const currentPosition = await this.geolocation.getCurrentPosition();
      const { latitude, longitude } = currentPosition.coords;
      const latLng = new L.LatLng(latitude, longitude);
      this.createLeafletMap(latLng);
    } else {
      const latLng = new L.LatLng(61.497, 23.760);
      this.createLeafletMap(latLng);
    }
  }

  createLeafletMap(latLng: L.LatLng) {
    this.map = L.map('modalMap').setView(latLng, 15);
    L.tileLayer.provider('Thunderforest.Outdoors', { apikey: thunderforestApiKey }).addTo(this.map);

    setTimeout(() => {
      this.map.invalidateSize();
    }, 1000);

    const geocodeService = (Geocoding as any).geocodeServiceProvider({
      label: 'ArcGIS',
      url: 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer',
    });

    this.searchControl = new (Geocoding as any).Geosearch({
      providers: [geocodeService],
      useMapBounds: false,
    });
    this.searchControl.addTo(this.map);

    this.map.on('click', event => {
      this.setMapLocation('', (event as any).latlng);
    });

    this.searchControl.on('results', event => {
      const results = (event as any).results;
      if (results.length > 0) {
        const [firstResult] = results;
        this.setMapLocation(firstResult.text, firstResult.latlng as L.LatLng);
      }
    });
  }

  setMapLocation(name: string, latLng: L.LatLng) {
    this.mapLocation = new MapLocation();
    this.mapLocation.latitude = latLng.lat;
    this.mapLocation.longitude = latLng.lng;
    this.mapLocation.name = name;

    this.setLeafletMarkerAndPan(latLng);
  }

  setLeafletMarkerAndPan(latLng: L.LatLng) {
    if (!this.marker) {
      this.marker = L.marker(latLng).addTo(this.map);
    } else {
      this.marker.setLatLng(latLng);
    }

    this.map.panTo(latLng);
  }

  async getMyLocation() {
    if (!this.debugService.debugMode) {
      const currentPosition = await this.geolocation.getCurrentPosition();
      this.setMapLocation('', new L.LatLng(currentPosition.coords.latitude, currentPosition.coords.longitude));
    } else {
      this.setMapLocation('', new L.LatLng(61.497, 23.760));
    }
  }

  confirm() {
    if (!this.mapLocation) {
      window.alert(this.translateService.instant('MAP.PICKLOC'));
      return;
    }

    this.modalController.dismiss({
      mapLocation: this.mapLocation,
    });
  }

  cancel() {
    this.modalController.dismiss();
  }
}
