import { AbstractDbAdapter } from '../adapters/abstract-db-adapter';

import _ from 'lodash';

export type TableName = 'observation' | 'imgData' | 'mapLocation' | 'observationType' | 'lastMigration';

export const getInsertClause = (tableName: TableName, valueNames: string[]) => {
  const valueNamesStr = valueNames.join(', ')

  const placeholderArr = [];
  for (let i = 0; i < valueNames.length; i++) {
    placeholderArr.push('?');
  }
  const placeholders = `(${placeholderArr.join(', ')})`;

  return `INSERT INTO ${tableName} (${valueNamesStr}) VALUES ${placeholders}`;
};

export const getUpdateClause = (tableName: TableName, id: number, valueNames: string[]) => {
  const namedPlaceholders = valueNames.map(name => `${name} = ?`).join(', ');
  return `UPDATE ${tableName} SET ${namedPlaceholders} WHERE id = ?`;
};

export const getFetchAllClause = (tableName: TableName) => `SELECT * FROM ${tableName}`;

export const getFetchOneClause = (tableName: TableName) =>
  `SELECT * FROM ${tableName} WHERE id = ?`;

export abstract class AbstractGateway {
  db: AbstractDbAdapter;

  constructor(db?: AbstractDbAdapter) {
    this.db = db;
  }

  abstract getTableName: () => TableName;

  abstract getValueNames: () => string[];

  getPlaceholderCount = () => this.getValueNames().length;

  abstract validateValues: (data: any[]) => void;

  insert = (data: any[]) => {
    this.validateValues(data);
    return this.db.executeSql(
      getInsertClause(this.getTableName(), this.getValueNames()),
      data,
    );
  }

  update = (id: number, data: any[]) => {
    this.validateValues(data);
    return this.db.executeSql(
      getUpdateClause(this.getTableName(), id, this.getValueNames()),
      data,
    );
  }

  getAll = () => this.db.executeSql(
    getFetchAllClause(this.getTableName())
  )

  getById = (id: number) => this.db.executeSql(
    getFetchOneClause(this.getTableName())
  )
}
