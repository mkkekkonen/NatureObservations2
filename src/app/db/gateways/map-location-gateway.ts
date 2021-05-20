import _ from 'lodash';

import { MapLocation } from '../../models/map-location.entity';

import { AbstractGateway, TableName } from './abstract-gateway';

export class MapLocationGateway extends AbstractGateway<MapLocation> {
  validationArray = [
    (data: any) => data === null || typeof data === 'string',
    'number',
    'number',
  ];

  getTableName = (): TableName => 'mapLocation';

  getValueNames = () => ['name', 'latitude', 'longitude'];

  validateValues = (data: any[]) => {
    if (data.length !== this.getPlaceholderCount()) {
      throw new Error('Invalid data');
    }

    const validationArray = _.zip(this.getValueNames(), data, this.validationArray);

    for (let entry of validationArray) {
      const [valueName, value, validator] = entry;

      if (typeof validator === 'function') {
        if (!validator(value)) {
          throw new Error(`Invalid ${valueName}: ${value}`);
        }
      } else {
        if (typeof value !== validator) {
          throw new Error(`Invalid ${valueName}: ${value}`);
        }
      }
    }
  }

  getValues = (obj: MapLocation) => [obj.name, obj.coords.latitude, obj.coords.longitude];

  getObjectFromRowData = (data: any) => Promise.resolve(new MapLocation(data.name, data.latitude, data.longitude, data.id));
}
