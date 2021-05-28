import { SQLiteObject } from '@ionic-native/sqlite/ngx';

import _ from 'lodash';

import { AbstractDbAdapter } from './abstract-db-adapter';

export class CordovaSqliteAdapter extends AbstractDbAdapter {
  constructor(db?: SQLiteObject) {
    super(db);
  }

  private getDb = () => (this.database as SQLiteObject);

  executeSql = (sql: string, values?: any[]) => {
    return this.getDb().executeSql(sql, values);
  }

  executeTransaction = (sql: string[], values?: any[][]) => {
    return this.getDb().transaction(tx => {
      for(const entry of _.zip(sql, values)) {
        const [sqlRow, rowValues] = entry;
        tx.executeSql(sqlRow, rowValues);
      }
    });
  };

  getNumberOfResultRows = (res: any) => res.rows.length;

  getRowFromResult = (res: any, rowIndex: number) => res.rows.item(rowIndex);

  getLastIdFromResult = (res: any) => res.rows.item(0).id;
}
