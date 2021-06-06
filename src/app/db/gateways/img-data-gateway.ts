import _ from 'lodash';

import { ImgData } from '../../models/img-data.entity';

import { AbstractGateway, TableName } from './abstract-gateway';

const getData = (obj: ImgData) => [obj.fileUri, obj.debugDataUri];

const getObj = (row: any) => new ImgData(row.id, row.fileUri, row.debugDataUri);

export class ImgDataGateway extends AbstractGateway<ImgData> {
  getValidationArray = () => [
    'string',
    (data: any) => (typeof data === 'string') || data === null,
    'number',
  ];

  getTableName = (): TableName => 'imgData';

  getValueNames = () => ['fileUri', 'debugDataUri', 'observationId'];

  getValues = (obj: ImgData) => [obj.fileUri, obj.debugDataUri, obj.observationId];

  getObjectFromRowData = (data: any) => new ImgData(data.fileUri, data.debugDataUri, data.observationId, data.id);
}
