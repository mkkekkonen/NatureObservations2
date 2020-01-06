import { Component, OnInit } from '@angular/core';

import { ObservationType } from '../models';

@Component({
  selector: 'app-my-observations',
  templateUrl: './my-observations.page.html',
  styleUrls: ['./my-observations.page.scss'],
})
export class MyObservationsPage implements OnInit {
  searchCriteriaOpen: boolean = false;

  searchObservationType: ObservationType = null;
  searchStartDateString: string = null;
  searchEndDateString: string = null;

  constructor() { }

  ngOnInit() {
  }

  get searchSortIcon() {
    return this.searchCriteriaOpen ? 'arrow-up' : 'arrow-down';
  }

  toggleSearchCriteria() {
    this.searchCriteriaOpen = !this.searchCriteriaOpen;
  }

  openTypeModal() {
    window.alert('Opening modal');
    // TODO: type modal
  }

  search() {
    window.alert('Searching');
    // TODO: search
  }

  showAll() {
    window.alert('Showing all');
    // TODO: show all
  }

  resetForm() {
    this.searchObservationType = null;
    this.searchStartDateString = null;
    this.searchEndDateString = null;
  }
}
