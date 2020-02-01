import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Repository } from 'typeorm';

import { DbService } from '../db.service';
import { Observation } from '../models';

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
  ) { }

  ngOnInit() {
    this.observation$ = this.route.paramMap.pipe(
      switchMap(async params => {
        const observationId = +params.get('id');

        const connection = await this.dbService.getConnection();
        const observationRepository = connection.getRepository('observation') as Repository<Observation>;
        try {
          const observations = await observationRepository.find({ id: observationId });
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
}
