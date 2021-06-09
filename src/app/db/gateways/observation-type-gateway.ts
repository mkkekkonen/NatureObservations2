import _ from 'lodash';

import { ObservationType } from '../../models/observation-type.entity';

import { AbstractGateway, TableName } from './abstract-gateway';

export class ObservationTypeGateway extends AbstractGateway<ObservationType> {
  getValidationArray = () => ['string', 'string'];

  getTableName = (): TableName => 'observationType';

  getValueNames = () => ['name', 'imageFileName'];

  getValues = (obj: ObservationType) => [obj.name, obj.imageFileName];

  getObjectFromRowData = (data: any) => new ObservationType(data.name, data.imageFileName, data.id);
}
