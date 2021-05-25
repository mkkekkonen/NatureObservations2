import moment from 'moment';

import { ImgData } from './img-data.entity';
import { MapLocation } from './map-location.entity';
import { ObservationType } from './observation-type.entity';

export class Observation {
  id: number;

  title: string;

  description: string | null;

  date: moment.Moment;

  type: string;

  mapLocationId: number | null;

  imgDataId: number | null;

  constructor(
    title: string,
    description: string | null,
    date: moment.Moment,
    type: string,
    mapLocationId: number | null,
    imgDataId: number | null,
    id?: number,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.date = date;
    this.type = type;
    this.mapLocationId = mapLocationId;
    this.imgDataId = imgDataId;
  }

  toString = () =>  `${this.title}: ${this.description}; ${this.date}; ${this.type}`;
}
