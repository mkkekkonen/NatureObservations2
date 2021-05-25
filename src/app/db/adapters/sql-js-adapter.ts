import fs from 'fs';

import { Database } from 'sql.js';
import _ from 'lodash';

import { AbstractDbAdapter } from './abstract-db-adapter';

export class SqlJsAdapter extends AbstractDbAdapter {
  constructor(db?: Database) {
    super(db);
  }

  private getDb = () => (this.database as Database);

  executeSql = (sql: string, values?: any[]) => {
    return Promise.resolve(this.getDb().exec(sql, values));
  }

  /* 
    See https://sql.js.org/documentation/Database.html#%255B%2522exec%2522%255D
    "If you use the params argument as an array, you cannot provide an sql
    string that contains several statements (separated by ;). This limitation
    does not apply to params as an object."
  */
  executeTransaction = (sql: string, values: any) => {
    return Promise.resolve(this.getDb().exec(sql, values));
  }

  writeDatabase = (filename: string = 'testDb.sqlite') => {
    const data = this.getDb().export();
    const buf = Buffer.from(data);
    fs.writeFileSync(filename, buf);
  }

  getNumberOfResultRows = (res: any) => {
    const [firstCols] = res;
    if (!firstCols) {
      return 0;
    }
    return firstCols.values.length;
  }

  getRowFromResult = (res: any, rowIndex: number) => {
    const [firstCols] = res;
    if (!firstCols || !firstCols.values[rowIndex]) {
      return null;
    }
    return _.zipObject(firstCols.columns, firstCols.values[rowIndex]);
  }

  getLastIdFromResult = (res: any) => {
    const [firstCols] = res;
    const [firstValues] = firstCols.values;
    const [id] = firstValues;
    return id;
  }
}
