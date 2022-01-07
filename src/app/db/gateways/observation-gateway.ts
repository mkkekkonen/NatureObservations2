import moment from 'moment';
import _ from 'lodash';

import { Observation } from '../../models/observation.entity';

import { AbstractGateway, TableName } from './abstract-gateway';

export const valueNames = ['title', 'description', 'date', 'type'];

const isNumberOrNull = (data: any) => data === null || !isNaN(data);

export class ObservationGateway extends AbstractGateway<Observation> {
  getValidationArray = () => [
    'string',
    'string',
    (data: any) => moment(data).isValid(),
    'string',
  ];

  getTableName = (): TableName => 'observation';

  getValueNames = () => valueNames;

  getValues = (obj: Observation) => [obj.title, obj.description, obj.date.format(Observation.dateFormat), obj.type];

  getObjectFromRowData = (data: any) => {
    try {
      return new Observation(data.title, data.description, moment(data.date), data.type, data.id);
    } catch (e) {
      return null;
    }
  }
}
