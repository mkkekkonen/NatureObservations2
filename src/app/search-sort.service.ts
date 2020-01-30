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
