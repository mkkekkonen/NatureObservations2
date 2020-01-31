import { Injectable } from '@angular/core';

import { get } from 'lodash';
import * as moment from 'moment';

import { Observation } from './models';

export type SortBy = 'title' | 'type' | 'date';
export type Order = 'ascending' | 'descending';

export const TITLE = 'title';
export const TYPE = 'type';
export const DATE = 'date';

export const ASC = 'ascending';
export const DESC = 'descending';

const dbDateFormat = 'YYYY-MM-DD HH:mm';
const componentDateFormat = 'YYYY-MM-DDTHH:mm:ss';

const getPropertyKey = (sortBy: SortBy) => {
  switch (sortBy) {
    case TITLE:
      return 'title';
    case TYPE:
      return 'type.name';
    case DATE:
    default:
      return 'date';
  }
};

@Injectable({
  providedIn: 'root'
})
export class SearchSortService {
  constructor() { }

  searchObservations = (observations: Observation[], searchString?: string, observationTypeName?: string, startDateString?: string, endDateString?: string) => {
    let filteredObservations = [...observations];

    if (searchString) {
      const searchStringLowercase = searchString.toLocaleLowerCase();
      filteredObservations = filteredObservations.filter(observation => (
        observation.title.toLocaleLowerCase().includes(searchStringLowercase)
          || (observation.description && observation.description.toLocaleLowerCase().includes(searchStringLowercase))
      ));
    }

    if (observationTypeName) {
      filteredObservations = filteredObservations.filter(observation => observation.type.name === observationTypeName);
    }

    if (startDateString) {
      const startDate = moment.default(startDateString, componentDateFormat);
      filteredObservations = filteredObservations.filter(observation => {
        const observationDate = moment.default(observation.date, dbDateFormat);
        return observationDate.isSameOrAfter(startDate);
      });
    }

    if (endDateString) {
      const endDate = moment.default(endDateString, componentDateFormat);
      filteredObservations = filteredObservations.filter(observation => {
        const observationDate = moment.default(observation.date, dbDateFormat);
        return observationDate.isSameOrBefore(endDate);
      });
    }

    return filteredObservations;
  }

  sortObservations = (observations: Observation[], sortBy: SortBy, order: Order = ASC) => {
    const propertyKey = getPropertyKey(sortBy);

    observations.sort((a, b) => {
      const propertyA = get(a, propertyKey);
      const propertyB = get(b, propertyKey);

      if (!propertyA || !propertyB) {
        return 0;
      }

      if (sortBy === TITLE || sortBy === TYPE) {
        const aStr = propertyA as string;
        const bStr = propertyB as string;
        return aStr.localeCompare(bStr);
      }

      if (sortBy === DATE) {
        const aDate = moment.default(propertyA, dbDateFormat);
        const bDate = moment.default(propertyB, dbDateFormat);

        if (aDate.isBefore(bDate)) {
          return -1;
        }
        if (aDate.isSame(bDate)) {
          return 0;
        }
        if (aDate.isAfter(bDate)) {
          return 1;
        }
      }

      return 0;
    });

    if (order === DESC) {
      observations.reverse();
    }
  }
}
