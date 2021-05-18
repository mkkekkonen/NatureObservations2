import moment from 'moment';
import _ from 'lodash';

import { Observation } from '../../models/observation.entity';

import { AbstractGateway, TableName } from './abstract-gateway';
import { ObservationTypeGateway, MapLocationGateway, ImgDataGateway } from '.';

export class ObservationGateway extends AbstractGateway<Observation> {
  validationArray = [
    'string',
    'string',
    (data: any) => moment(data).isValid(),
    'number',
    'number',
    'number',
  ];

  getTableName = (): TableName => 'observation';

  getValueNames = () => ['title', 'description', 'date', 'type', 'mapLocationId', 'imgDataId'];

  validateValues = (data: any[]) => {
    if (data.length !== this.getPlaceholderCount()) {
      throw new Error('Invalid data');
    }

    const validationArray = _.zip(this.getValueNames(), data, this.validationArray);

    for (let i = 0; i < validationArray.length; i++) {
      const entry = validationArray[i];

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

  getValues = (obj: Observation) => [obj.title, obj.description, obj.date, obj.type.id, obj.mapLocation.id, obj.imgData.id];

  getObjectFromRowData = async (data: any) => {
    const observationTypeGateway = new ObservationTypeGateway(this.db);
    const mapLocationGateway = new MapLocationGateway(this.db);
    const imgDataGateway = new ImgDataGateway(this.db);

    try {
      const types = await observationTypeGateway.getAll();
      const type = types.find(t => t.name === data.type);

      const mapLocation = data.mapLocationId ? await mapLocationGateway.getById(data.mapLocationId) : null;
      const imgData = data.imgDataId ? await imgDataGateway.getById(data.imgDataId) : null;

      return new Observation(data.id, data.title, data.description, moment(data.date), type, mapLocation, imgData);
    } catch (e) {
      return null;
    }
  }
}
