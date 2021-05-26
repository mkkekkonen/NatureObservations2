import moment from 'moment';
import _ from 'lodash';

import { Observation } from '../../models/observation.entity';

import { AbstractGateway, TableName } from './abstract-gateway';
import { ObservationTypeGateway, MapLocationGateway, ImgDataGateway } from '.';

const isNumberOrNull = (data: any) => data === null || !isNaN(data);

export class ObservationGateway extends AbstractGateway<Observation> {
  validationArray = [
    'string',
    'string',
    (data: any) => moment(data).isValid(),
    'string',
    isNumberOrNull,
    isNumberOrNull,
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

  getValues = (obj: Observation) => [obj.title, obj.description, obj.date.format(Observation.dateFormat), obj.type, obj.mapLocationId, obj.imgDataId];

  getObjectFromRowData = (data: any) => {
    try {
      return new Observation(data.title, data.description, moment(data.date), data.type, data.mapLocationId, data.imgDataId, data.id);
    } catch (e) {
      return null;
    }
  }
}
