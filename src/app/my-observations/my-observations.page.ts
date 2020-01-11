import { Component, OnInit } from '@angular/core';

import { ObservationType } from '../models';

@Component({
  selector: 'app-my-observations',
  templateUrl: './my-observations.page.html',
  styleUrls: ['./my-observations.page.scss'],
})
export class MyObservationsPage implements OnInit {
  searchCriteriaOpen: boolean = false;
  sortCriteriaOpen: boolean = false;

  searchObservationType: ObservationType = null;
  searchStartDateString: string = null;
  searchEndDateString: string = null;

  SORT_BY_TITLE = 'title';
  SORT_BY_TYPE = 'type';
  SORT_BY_DATE = 'date';

  SORT_ASCENDING = 'ascending';
  SORT_DESCENDING = 'descending';

  sortBy = this.SORT_BY_DATE;
  sortOrder = this.SORT_DESCENDING;

  constructor() { }

  ngOnInit() {
  }

  get searchIcon() {
    return this.searchCriteriaOpen ? 'arrow-up' : 'arrow-down';
  }

  get sortIcon() {
    return this.sortCriteriaOpen ? 'arrow-up' : 'arrow-down';
  }

  toggleSearchCriteria() {
    this.searchCriteriaOpen = !this.searchCriteriaOpen;
  }

  toggleSortCriteria() {
    this.sortCriteriaOpen = !this.sortCriteriaOpen;
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
