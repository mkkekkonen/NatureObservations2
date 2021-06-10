import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import * as moment from 'moment';

import { Observation, ImgData, MapLocation, ObservationType } from '../models';
import { DebugService } from '../debug.service';
import { DbService } from '../db.service';

@Component({
  selector: 'app-observation-card',
  templateUrl: './observation-card.component.html',
  styleUrls: ['./observation-card.component.scss'],
})
export class ObservationCardComponent implements OnInit {
  @Input('observation') observation: Observation;
  @Input('deleteObservation') deleteObservationCallback: (observation: Observation) => void;

  imgData: ImgData;
  mapLocation: MapLocation;
  observationType: ObservationType;

  constructor(
    private router: Router,
    private debugService: DebugService,
    private dbService: DbService,
  ) { }

  ngOnInit() {
    this.getObservationType();
    this.getImgData();
    this.getMapLocation();
  }

  get formattedDate() {
    return moment.default(this.observation.date).format('D.M.YYYY HH:mm');
  }

  get imgUrl() {
    if (this.imgData) {
      return (window as any).Ionic.WebView.convertFileSrc(this.imgData.fileUri);
    }
    return null;
  }

  async getImgData() {
    try {
      this.imgData = await this.dbService.imgDataGateway.getByObservationId(this.observation.id);
    } catch (e) {
      window.alert(`Error loading image data: ${e.message}`);
    }
  }

  async getMapLocation() {
    try {
      this.mapLocation = await this.dbService.mapLocationGateway.getByObservationId(this.observation.id);
    } catch (e) {
      window.alert(`Error loading map location: ${e.message}`);
    }
  }

  async getObservationType() {
    try {
      this.observationType = await this.dbService.observationTypeGateway.getByTypeName(this.observation.type);
    } catch (e) {
      window.alert(`Error loading observation type: ${e.message}`);
    }
  }

  deleteObservation(event: Event) {
    event.stopPropagation();

    if (this.observation && this.deleteObservationCallback) {
      this.deleteObservationCallback(this.observation);
    }
  }

  navigate() {
    this.router.navigate(['/view-observation', this.observation.id]);
  }
}
