import _ from 'lodash';

import { AbstractGateway } from './abstract-gateway';

export class ImgDataGateway extends AbstractGateway {
  validationArray = ['string', 'string'];

  getTableName = () => 'imgData';

  getValueNames = () => ['fileUri', 'debugDataUri'];

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
