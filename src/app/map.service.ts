import { Injectable } from '@angular/core';

import { Geolocation } from '@ionic-native/geolocation/ngx';

import * as L from 'leaflet';

import { DebugService } from './debug.service';
import { thunderforestApiKey } from './secrets.json';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  constructor(
    private geolocation: Geolocation,
    private debugService: DebugService,
  ) { }

  async initLeafletMap(setMap: Function) {
    if (!this.debugService.debugMode) {
      const currentPosition = await this.geolocation.getCurrentPosition();
      const latLng = L.latLng(currentPosition.coords.latitude, currentPosition.coords.longitude);
      this.createLeafletMap(latLng, setMap);
    } else {
      const latLng =  L.latLng(61.497, 23.760);
      this.createLeafletMap(latLng, setMap);
    }
  }

  createLeafletMap(latLng: L.LatLng, setMap: Function) {
    const map = L.map(
      'map',
      {
        zoomControl: false,
        touchZoom: false,
        doubleClickZoom: false,
        dragging: false,
      }
    ).setView(latLng, 15);
    L.tileLayer.provider('Thunderforest.Outdoors', { apikey: thunderforestApiKey }).addTo(map);
    setMap(map);
    setTimeout(() => {
      map.invalidateSize();
    }, 1000);
  }

  setLeafletMarkerAndPan(latLng: L.LatLng, map: L.Map, marker: L.Marker, setMarker: Function) {
    if (!marker) {
      setMarker(L.marker(latLng).addTo(map));
    } else {
      marker.setLatLng(latLng);
    }
    map.panTo(latLng);
  }
}
