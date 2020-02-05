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
import { Observation } from '../models';
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

        const connection = await this.dbService.getConnection();
        const observationRepository = connection.getRepository('observation') as Repository<Observation>;
        try {
          const observations = await observationRepository.find({ where: { id: observationId }, relations: ['imgData', 'mapLocation', 'type'] });
          if (observations.length > 0) {
            const [first] = observations;
            return first;
          }
        } catch(e) {
          window.alert(`Error fetching observation: ${e.message}`);
        }
      })
    );

    this.observation$.subscribe({
      next: (observation) => {
        this.observation = observation;

        if (observation.mapLocation) {
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
    if (this.observation && this.observation.imgData) {
      if (this.debugService.debugMode) {
        return (window as any).Ionic.WebView.convertFileSrc(this.observation.imgData.fileUri);
      } else {
        return this.observation.imgData.fileUri;
      }
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
    const { latitude, longitude } = this.observation.mapLocation;
    const latLng = new L.LatLng(latitude, longitude);

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
