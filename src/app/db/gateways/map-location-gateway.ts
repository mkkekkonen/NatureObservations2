import _ from 'lodash';

import { MapLocation } from '../../models/map-location.entity';

import { TableName } from './abstract-gateway';
import { AbstractObservationDataGateway } from './abstract-observation-data-gateway';

export const valueNames = ['name', 'latitude', 'longitude', 'observationId'];

export class MapLocationGateway extends AbstractObservationDataGateway<MapLocation> {
  getValidationArray = () => [
    (data: any) => data === null || typeof data === 'string',
    'number',
    'number',
    'number'
  ];

  getTableName = (): TableName => 'mapLocation';

  getValueNames = () => valueNames;

  getValues = (obj: MapLocation) => [obj.name, obj.coords.latitude, obj.coords.longitude, obj.observationId];

  getObjectFromRowData = (data: any) => new MapLocation(data.name, data.latitude, data.longitude, data.observationId, data.id);
}
