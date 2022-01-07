import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Platform } from '@ionic/angular';

import { Repository } from 'typeorm';
import * as moment from 'moment';
import * as L from 'leaflet';

import { DbService } from '../db.service';
import { DebugService } from '../debug.service';
import { Observation, MapLocation, ImgData, ObservationType } from '../models';
import { thunderforestApiKey } from '../secrets.json';

const dbDateFormat = 'YYYY-MM-DD HH:mm';

@Component({
  selector: 'app-view-observation',
  templateUrl: './view-observation.page.html',
  styleUrls: ['./view-observation.page.scss'],
})
export class ViewObservationPage implements OnInit, AfterViewInit {
  @ViewChild('viewMap', { static: false }) mapElement: ElementRef;

  observation$: Observable<Observation>;
  
  observation: Observation;
  mapLocation: MapLocation;
  imgData: ImgData;
  observationType: ObservationType;

  map: L.Map;
  marker: L.Marker;

  constructor(
    private route: ActivatedRoute,
    private platform: Platform,
    private dbService: DbService,
    private debugService: DebugService,
  ) { }

  ngOnInit() {
    this.observation$ = this.route.paramMap.pipe(
      switchMap(async params => {
        const observationId = +params.get('id');
        try {
          const observation = await this.dbService.observationGateway.getById(observationId);
          return observation;
        } catch(e) {
          window.alert(`Error fetching observation: ${e.message}`);
        }
      })
    );

    this.observation$.subscribe({
      next: async (observation) => {
        this.observation = observation;
        this.mapLocation = await this.dbService.mapLocationGateway.getByObservationId(observation.id);
        this.imgData = await this.dbService.imgDataGateway.getByObservationId(observation.id);
        this.observationType = await this.dbService.observationTypeGateway.getByTypeName(observation.type);

        if (this.mapLocation) {
          this.platform.ready().then(() => {
            this.createLeafletMap();
          });
        }
      },
    });
  }

  ngAfterViewInit() {
  }

  get imgUrl() {
    if (this.imgData) {
      return (window as any).Ionic.WebView.convertFileSrc(this.imgData.fileUri);
    }
  }

  get formattedDate() {
    if (this.observation && this.observation.date) {
      return moment.default(this.observation.date, dbDateFormat).format('D.M.YYYY HH:mm');
    }
  }

  get editRoute() {
    if (this.observation) {
      return ['/edit-observation', this.observation.id];
    }

    return undefined;
  }

  createLeafletMap() {
    const { coords } = this.mapLocation;
    const latLng = new L.LatLng(coords.latitude, coords.longitude);

    if (this.map) {
      this.map.remove();
    }

    this.map = L.map(
      'viewMap',
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
}
