import _ from 'lodash';

import { ImgData } from '../../models/img-data.entity';

import { TableName } from './abstract-gateway';
import { AbstractObservationDataGateway } from './abstract-observation-data-gateway';

export class ImgDataGateway extends AbstractObservationDataGateway<ImgData> {
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
