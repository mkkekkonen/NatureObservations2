import _ from 'lodash';

import { ObservationType } from '../../models/observation-type.entity';

import { AbstractGateway, TableName } from './abstract-gateway';

export class ObservationTypeGateway extends AbstractGateway<ObservationType> {
  validationArray = ['string', 'string'];

  getTableName = (): TableName => 'observationType';

  getValueNames = () => ['name', 'imageFileName'];

  validateValues = (data: any[]) => {
    if (data.length !== this.getPlaceholderCount()) {
      throw new Error('Invalid data');
    }

    const validationArray = _.zip(this.getValueNames(), data, this.validationArray);

    for (let i = 0; i < validationArray.length; i++) {
      const entry = validationArray[i];

      const [valueName, value, validator] = entry;

      if (typeof value !== validator) {
        throw new Error(`Invalid ${valueName}: ${value}`)
      }
    }
  }

  getValues = (obj: ObservationType) => [obj.name, obj.imageFileName];

  getObjectFromRowData = (data: any) => new ObservationType(data.id, data.name, data.imageFileName);
}
