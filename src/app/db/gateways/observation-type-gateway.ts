import _ from 'lodash';

import { AbstractGateway, TableName } from "./abstract-gateway";

export class ObservationTypeGateway extends AbstractGateway {
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
}
