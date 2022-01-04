import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';

// import { Repository } from 'typeorm';
import { TranslateService } from '@ngx-translate/core';

import { Observation, ObservationType, ImgData, MapLocation } from '../models';
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
  debugUrl = ['/debug'];

  constructor(
    private modalController: ModalController,
    private translateService: TranslateService,
    private dbService: DbService,
    private searchSortService: SearchSortService,
    private platform: Platform,
  ) {
    this.deleteObservation = this.deleteObservation.bind(this);
    this.loadObservations = this.loadObservations.bind(this);
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.platform.ready().then(() => this.loadObservations());
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

  loadObservations() {
    window.setTimeout(async () => {
      try {
        this.observationTypes = await this.dbService.observationTypeGateway.getAll();
        const observations = (await this.dbService.observationGateway.getAll()).reverse();
        this.allObservations = [...observations];
        this.observations = [...observations];
      } catch (e) {
        window.alert(`Error loading observations: ${e.message}`)
      }
    }, 500);
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

  clearType() {
    this.searchObservationType = null;
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
    this.observations = [...this.allObservations];
    this.searchCriteriaOpen = false;
  }

  resetForm() {
    this.searchString = null;
    this.searchObservationType = null;
    this.searchStartDateString = null;
    this.searchEndDateString = null;
  }

  async deleteObservation(observation: Observation) {
    if (!window.confirm(this.translateService.instant('MYOBS.AREUSURE'))) {
      return;
    }

    const indexInObservations = this.observations.findIndex(listObservation => listObservation.id === observation.id);
    const indexInAllObservations = this.allObservations.findIndex(listObservation => listObservation.id === observation.id);

    try {
      await this.dbService.observationGateway.delete(observation.id);
    } catch (e) {
      window.alert(`Error deleting observation: ${e.message}`);
    }

    if (indexInObservations > -1) {
      this.observations.splice(indexInObservations, 1);
    }
    if (indexInAllObservations > -1) {
      this.allObservations.splice(indexInAllObservations, 1);
    }
  }

  reload() {
    window.location.reload();
  }
}
