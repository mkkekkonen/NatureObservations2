import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Repository } from 'typeorm';

import { Observation, ObservationType } from '../models';
import { DbService } from '../db.service';
import {
  SearchSortService,
  SortBy,
  Order,
  TITLE,
  TYPE,
  DATE,
  ASC,
  DESC,
} from '../search-sort.service';
import { ObservationTypeModalPage } from '../observation-type-modal/observation-type-modal.page';

@Component({
  selector: 'app-my-observations',
  templateUrl: './my-observations.page.html',
  styleUrls: ['./my-observations.page.scss'],
})
export class MyObservationsPage implements OnInit {
  searchCriteriaOpen: boolean = false;
  sortCriteriaOpen: boolean = false;

  searchString: string = null;
  searchObservationType: ObservationType = null;
  searchStartDateString: string = null;
  searchEndDateString: string = null;

  SORT_BY_TITLE = TITLE;
  SORT_BY_TYPE = TYPE;
  SORT_BY_DATE = DATE;

  SORT_ASCENDING = ASC;
  SORT_DESCENDING = DESC;

  sortBy: SortBy = DATE;
  sortOrder: Order = DESC;

  observationTypes: ObservationType[] = null;
  allObservations: Observation[] = null;
  observations: Observation[] = null;

  newObservationUrl = ['/edit-observation'];

  constructor(
    private modalController: ModalController,
    private dbService: DbService,
    private searchSortService: SearchSortService,
  ) {}

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.dbService.getConnection().then(async connection => {
      const typeRepository = connection.getRepository('observationtype') as Repository<ObservationType>;
      const observationRepository = connection.getRepository('observation') as Repository<Observation>;

      this.observationTypes = await typeRepository.find();
      const observations = (await observationRepository.find({ relations: ['imgData', 'mapLocation', 'type'] })).reverse();
      this.allObservations = observations;
      this.observations = observations;
    });
  }

  get searchIcon() {
    return this.searchCriteriaOpen ? 'arrow-up' : 'arrow-down';
  }

  get sortIcon() {
    return this.sortCriteriaOpen ? 'arrow-up' : 'arrow-down';
  }

  get sortedObservations() {
    if (!this.observations) {
      return [];
    }
    const observations = [...this.observations];
    this.searchSortService.sortObservations(observations, this.sortBy, this.sortOrder);
    return observations;
  }

  toggleSearchCriteria() {
    this.searchCriteriaOpen = !this.searchCriteriaOpen;
  }

  toggleSortCriteria() {
    this.sortCriteriaOpen = !this.sortCriteriaOpen;
  }

  async openTypeModal() {
    const modal = await this.modalController.create({
      component: ObservationTypeModalPage,
    });
    modal.onDidDismiss().then(event => {
      if (event.data) {
        const { observationType } = event.data;
        this.searchObservationType = observationType;
      }
    });
    await modal.present();
  }

  search() {
    this.observations = this.searchSortService.searchObservations(
      this.allObservations,
      this.searchString,
      this.searchObservationType && this.searchObservationType.name,
      this.searchStartDateString,
      this.searchEndDateString,
    );
    this.searchCriteriaOpen = false;
  }

  showAll() {
    this.observations = this.allObservations;
  }

  resetForm() {
    this.searchString = null;
    this.searchObservationType = null;
    this.searchStartDateString = null;
    this.searchEndDateString = null;
  }
}
