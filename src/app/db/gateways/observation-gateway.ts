import moment from 'moment';
import _ from 'lodash';

import { AbstractGateway } from './abstract-gateway';

export class ObservationGateway extends AbstractGateway {
  validationArray = [
    'string',
    'string',
    (data: any) => moment(data).isValid(),
    'number',
    'number',
    'number',
  ];

  getTableName = () => 'observation';

  getValueNames = () => ['title', 'description', 'date', 'type', 'mapLocationId', 'imgDataId'];

  getPlaceholderCount = () => this.getValueNames().length;

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
}
