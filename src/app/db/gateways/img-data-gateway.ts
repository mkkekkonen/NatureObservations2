import _ from 'lodash';

import { ImgData } from '../../models/img-data.entity';

import { AbstractGateway, TableName } from './abstract-gateway';

const getData = (obj: ImgData) => [obj.fileUri, obj.debugDataUri];

const getObj = (row: any) => new ImgData(row.id, row.fileUri, row.debugDataUri);

export class ImgDataGateway extends AbstractGateway<ImgData> {
  validationArray = ['string', 'string'];

  getTableName = (): TableName => 'imgData';

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

  getValues = (obj: ImgData) => [obj.fileUri, obj.debugDataUri];

  getObjectFromRowData = (data: any) => Promise.resolve(new ImgData(data.id, data.fileUri, data.debugDataUri));
}
