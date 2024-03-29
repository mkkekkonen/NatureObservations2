import { AbstractDbAdapter } from '../adapters/abstract-db-adapter';

import { AbstractGateway, TableName, IModel } from './abstract-gateway';

export const getSelectObservationDataClause = (tableName: TableName) =>
  `SELECT * FROM ${tableName} WHERE observationId = ?`;

export const getDeleteObservationDataClause = (tableName: TableName) =>
  `DELETE FROM ${tableName} WHERE observationId = ?`;

export const getUpdateObservationIdClause = (tableName: TableName) =>
  `UPDATE ${tableName} SET observationId = ? WHERE id = ?`;

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

  deleteByObservationId = async (observationId: number) => {
    return await this.sqlDeleteByObservationId(observationId);
  }

  private sqlGetByObservationId = (observationId: number) => this.db.executeSql(
    getSelectObservationDataClause(this.getTableName()),
    [observationId],
  )

  private sqlDeleteByObservationId = (observationId: number) => this.db.executeSql(
    getDeleteObservationDataClause(this.getTableName()),
    [observationId],
  )
}
