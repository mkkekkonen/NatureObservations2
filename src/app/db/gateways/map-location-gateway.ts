import _ from 'lodash';

import { MapLocation } from '../../models/map-location.entity';

import { AbstractGateway, TableName } from './abstract-gateway';

export class MapLocationGateway extends AbstractGateway<MapLocation> {
  getValidationArray = () => [
    (data: any) => data === null || typeof data === 'string',
    'number',
    'number',
    'number'
  ];

  getTableName = (): TableName => 'mapLocation';

  getValueNames = () => ['name', 'latitude', 'longitude', 'observationId'];

  getValues = (obj: MapLocation) => [obj.name, obj.coords.latitude, obj.coords.longitude, obj.observationId];

  getObjectFromRowData = (data: any) => new MapLocation(data.name, data.latitude, data.longitude, data.observationId, data.id);
}
