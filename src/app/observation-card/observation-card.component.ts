import { Component, OnInit, Input } from '@angular/core';

import * as moment from 'moment';

import { Observation } from '../models';

@Component({
  selector: 'app-observation-card',
  templateUrl: './observation-card.component.html',
  styleUrls: ['./observation-card.component.scss'],
})
export class ObservationCardComponent implements OnInit {
  @Input('observation') observation: Observation;

  constructor() { }

  ngOnInit() {}

  get formattedDate() {
    return moment.default(this.observation.date).format('D.M.YYYY HH:mm');
  }
}
