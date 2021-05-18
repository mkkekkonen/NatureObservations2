import moment from 'moment';

import { ImgData } from './img-data.entity';
import { MapLocation } from './map-location.entity';
import { ObservationType } from './observation-type.entity';

export class Observation {
  id: number;

  title: string;

  description: string | null;

  date: moment.Moment;

  type: ObservationType;

  mapLocation: MapLocation | null;

  imgData: ImgData | null;

  constructor(
    title: string,
    description: string | null,
    date: moment.Moment,
    type: ObservationType,
    mapLocation: MapLocation | null,
    imgData: ImgData | null,
    id?: number,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.date = date;
    this.type = type;
    this.mapLocation = mapLocation;
    this.imgData = imgData;
  }

  toString = () =>  `${this.title}: ${this.description}; ${this.date}; ${this.type && this.type.name}`;
}
