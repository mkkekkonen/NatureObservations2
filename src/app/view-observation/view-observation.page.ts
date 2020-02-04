import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Platform } from '@ionic/angular';

import { Repository } from 'typeorm';
import * as moment from 'moment';
import * as L from 'leaflet';

import { DbService } from '../db.service';
import { DebugService } from '../debug.service';
import { MapService } from '../map.service';
import { Observation } from '../models';

const dbDateFormat = 'YYYY-MM-DD HH:mm';

@Component({
  selector: 'app-view-observation',
  templateUrl: './view-observation.page.html',
  styleUrls: ['./view-observation.page.scss'],
})
export class ViewObservationPage implements OnInit {
  observation$: Observable<Observation>;
  observation: Observation;

  map: L.Map;
  marker: L.Marker;

  constructor(
    private route: ActivatedRoute,
    private platform: Platform,
    private dbService: DbService,
    private debugService: DebugService,
    private mapService: MapService,
  ) {
    this.setMap = this.setMap.bind(this);
    this.setMarker = this.setMarker.bind(this);
  }

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
      next: (observation) => { this.observation = observation; }
    });

    this.platform.ready().then(async () => {
      await this.mapService.initLeafletMap(this.setMap);
      if (this.observation.mapLocation) {
        const { latitude, longitude } = this.observation.mapLocation;
        const latLng = new L.LatLng(latitude, longitude);
        this.mapService.setLeafletMarkerAndPan(latLng, this.map, this.marker, this.setMarker);
      }
    });
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

  setMap(map: L.Map) {
    this.map = map;
  }

  setMarker(marker: L.Marker) {
    this.marker = marker;
  }
}
