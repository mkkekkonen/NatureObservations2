import { AbstractDbAdapter } from '../adapters/abstract-db-adapter';

import _ from 'lodash';

interface IModel {
  id?: number
}

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

export const getFetchLastIdClause = (tableName: TableName) =>
  `SELECT id FROM ${tableName} ORDER BY id DESC LIMIT 1`;

export abstract class AbstractGateway<T extends IModel> {
  db: AbstractDbAdapter;

  constructor(db?: AbstractDbAdapter) {
    this.db = db;
  }

  abstract getTableName: () => TableName;

  abstract getValues: (obj: T) => any[];

  abstract getValueNames: () => string[];

  abstract validateValues: (data: any[]) => void;

  abstract getObjectFromRowData: (row: any) => T;

  insert = async (obj: T) => {
    await this.sqlInsert(this.getValues(obj));
    const id = await this.getLastId();
    obj.id = id;
  }

  update = async (obj: T) => {
    if (!obj.id) {
      throw new Error('No ID provided!');
    }

    await this.sqlUpdate(obj.id, this.getValues(obj));
  }

  getAll = async () => {
    const data: T[] = [];

    const res = await this.sqlGetAll();
    for (let i = 0; i < this.db.getNumberOfResultRows(res); i++) {
      const item = this.db.getRowFromResult(res, i);
      data.push(await this.getObjectFromRowData(item));
    }

    return data;
  }

  getById = async (id: number) => {
    const res = await this.sqlGetById(id);
    if (this.db.getNumberOfResultRows(res) === 0) {
      return null;
    } else {
      const item = this.db.getRowFromResult(res, 0);
      return this.getObjectFromRowData(item);
    }
  }

  getLastId = async () => {
    const res = await this.sqlGetLastId();
    return this.db.getLastIdFromResult(res);
  }

  getPlaceholderCount = () => this.getValueNames().length;

  private sqlInsert = (data: any[]) => {
    this.validateValues(data);
    return this.db.executeSql(
      getInsertClause(this.getTableName(), this.getValueNames()),
      data,
    );
  }

  private sqlUpdate = (id: number, data: any[]) => {
    this.validateValues(data);
    data.push(id);
    return this.db.executeSql(
      getUpdateClause(this.getTableName(), id, this.getValueNames()),
      data,
    );
  }

  private sqlGetAll = () => this.db.executeSql(
    getFetchAllClause(this.getTableName())
  )

  private sqlGetById = (id: number) => this.db.executeSql(
    getFetchOneClause(this.getTableName()),
    [id],
  )

  private sqlGetLastId = () => this.db.executeSql(
    getFetchLastIdClause(this.getTableName())
  )
}
