import { SQLiteObject } from '@ionic-native/sqlite/ngx';

import _ from 'lodash';

export const getInsertClause = (tableName: string, placeholderCount: number) => {
  const placeholderArr = [];
  for (let i = 0; i < placeholderCount; i++) {
    placeholderArr.push('?');
  }
  const placeholders = `(${placeholderArr.join(', ')})`;

  return `INSERT INTO ${tableName} VALUES ${placeholders}`;
};

export const getUpdateClause = (tableName: string, id: number, valueNames: string[]) => {
  const namedPlaceholders = valueNames.map(name => `${name} = ?`).join(', ');
  return `UPDATE ${tableName} SET ${namedPlaceholders} WHERE id = ${id}`;
};

export const getFetchAllClause = (tableName: string) => `SELECT * FROM ${tableName}`;

export const getFetchOneClause = (tableName: string, id: number) =>
  `SELECT * FROM ${tableName} WHERE id = ${id}`;

export abstract class AbstractGateway {
  db: SQLiteObject;

  constructor(db: SQLiteObject) {
    this.db = db;
  }

  abstract getTableName: () => string;

  abstract getValueNames: () => string[];

  abstract getPlaceholderCount: () => number;

  abstract validateValues: (data: any[]) => void;

  insert = (data: any[]) => {
    this.validateValues(data);
    return this.db.executeSql(
      getInsertClause(this.getTableName(), this.getPlaceholderCount()),
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
    getFetchOneClause(this.getTableName(), id)
  )
}
