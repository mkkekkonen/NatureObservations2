import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import * as moment from 'moment';

import { Observation, ImgData, MapLocation } from '../models';
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

  constructor(
    private router: Router,
    private debugService: DebugService,
    private dbService: DbService,
  ) { }

  ngOnInit() {
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

  // TODO: select where -metodit
  async getImgData() {
    try {
      const allImgData = await this.dbService.imgDataGateway.getAll();
      this.imgData = allImgData.find(imgData => imgData.observationId === this.observation.id) || null;
    } catch (e) {
      window.alert(`Error loading image data: ${e.message}`);
    }
  }

  async getMapLocation() {
    try {
      const allMapLocations = await this.dbService.mapLocationGateway.getAll();
      this.mapLocation = allMapLocations.find(mapLocation => mapLocation.observationId === this.observation.id);
    } catch (e) {
      window.alert(`Error loading map locations: ${e.message}`);
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
