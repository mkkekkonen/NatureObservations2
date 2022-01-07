import _ from 'lodash';

import { ObservationType } from '../../models/observation-type.entity';

import { AbstractGateway, TableName } from './abstract-gateway';

const selectTypeClause = 'SELECT * FROM observationType WHERE name = ?';

export class ObservationTypeGateway extends AbstractGateway<ObservationType> {
  getValidationArray = () => ['string', 'string'];

  getTableName = (): TableName => 'observationType';

  getValueNames = () => ['name', 'imageFileName'];

  getValues = (obj: ObservationType) => [obj.name, obj.imageFileName];

  getObjectFromRowData = (data: any) => new ObservationType(data.name, data.imageFileName, data.id);

  getByTypeName = async (typeName: string) => {
    const res = await this.sqlGetByTypeName(typeName);
    if (this.db.getNumberOfResultRows(res) === 0) {
      return null;
    } else {
      const item = this.db.getRowFromResult(res, 0);
      return this.getObjectFromRowData(item);
    }
  }

  private sqlGetByTypeName = (typeName: string) =>
    this.db.executeSql(selectTypeClause, [typeName]);
}
