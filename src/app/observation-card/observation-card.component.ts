import { Component, OnInit, Input } from '@angular/core';

import * as moment from 'moment';

import { Observation } from '../models';
import { DebugService } from '../debug.service';

@Component({
  selector: 'app-observation-card',
  templateUrl: './observation-card.component.html',
  styleUrls: ['./observation-card.component.scss'],
})
export class ObservationCardComponent implements OnInit {
  @Input('observation') observation: Observation;

  constructor(private debugService: DebugService) { }

  ngOnInit() {}

  get formattedDate() {
    return moment.default(this.observation.date).format('D.M.YYYY HH:mm');
  }

  get imgUrl() {
    if (this.observation.imgData) {
      if (this.debugService.debugMode) {
        return (window as any).Ionic.WebView.convertFileSrc(this.observation.imgData.fileUri);
      } else {
        return this.observation.imgData.fileUri;
      }
    }
  }
}
