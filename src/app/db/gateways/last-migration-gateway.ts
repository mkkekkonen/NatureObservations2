import _ from 'lodash';

import { AbstractGateway, TableName } from './abstract-gateway';

export class LastMigrationGateway extends AbstractGateway {
  validationArray = [
    'number',
  ];

  getTableName = (): TableName => 'lastMigration';

  getValueNames = () => ['lastMigrationId'];

  validateValues = (data: any[]) => {
    if (data.length !== this.getPlaceholderCount()) {
      throw new Error('Invalid data');
    }

    const validationArray = _.zip(this.getValueNames(), data, this.validationArray);

    for (let entry of validationArray) {
      const [valueName, value, validator] = entry;

      if (typeof value !== validator) {
        throw new Error(`Invalid ${valueName}: ${value}`);
      }
    }
  }
}
