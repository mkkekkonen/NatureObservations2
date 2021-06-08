import { AbstractDbAdapter } from '../adapters/abstract-db-adapter';

import { AbstractGateway, TableName, IModel } from './abstract-gateway';

export const getSelectObservationDataClause = (tableName: TableName) =>
  `SELECT * FROM ${tableName} WHERE observationId = ?`;

export abstract class AbstractObservationDataGateway<T extends IModel> extends AbstractGateway<T> {
  constructor(db?: AbstractDbAdapter) {
    super(db);
  }

  getByObservationId = async (observationId: number) => {
    const res = await this.sqlGetByObservationId(observationId);
    if (this.db.getNumberOfResultRows(res) === 0) {
      return null;
    } else {
      const item = this.db.getRowFromResult(res, 0);
      return this.getObjectFromRowData(item);
    }
  }

  private sqlGetByObservationId = (observationId: number) => this.db.executeSql(
    getSelectObservationDataClause(this.getTableName()),
    [observationId],
  )
}
