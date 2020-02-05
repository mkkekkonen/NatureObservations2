import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Repository } from 'typeorm';
import * as moment from 'moment';

import { DbService } from '../db.service';
import { DebugService } from '../debug.service';
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

  constructor(
    private route: ActivatedRoute,
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
      next: (observation) => { this.observation = observation; }
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
}
