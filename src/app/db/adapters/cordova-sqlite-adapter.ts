import { SQLiteObject } from '@ionic-native/sqlite/ngx';

import { AbstractDbAdapter } from './abstract-db-adapter';

export class CordovaSqliteAdapter extends AbstractDbAdapter {
  constructor(db?: SQLiteObject) {
    super(db);
  }

  private getDb = () => (this.database as SQLiteObject);

  executeSql = (sql: string, values?: any[]) => {
    return this.getDb().executeSql(sql, values);
  }

  getNumberOfResultRows = (res: any) => res.rows.length;

  getRowFromResult = (res: any, rowIndex: number) => res.rows.item(rowIndex);
}
