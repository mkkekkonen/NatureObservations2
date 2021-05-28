import { SQLiteObject as CordovaSqliteObject } from '@ionic-native/sqlite/ngx';
import { Database as SqlJsDatabase } from 'sql.js';

type DatabaseType = CordovaSqliteObject | SqlJsDatabase;

export abstract class AbstractDbAdapter {
  database?: DatabaseType;

  constructor(db?: DatabaseType) {
    this.database = db;
  }

  abstract executeSql: (sql: string, values?: any[]) => Promise<any>;

  abstract executeTransaction: (sql: string[], values?: any[][]) => Promise<any>;

  abstract getNumberOfResultRows: (res: any) => number;

  abstract getRowFromResult: (res: any, rowIndex: number) => any;

  abstract getLastIdFromResult: (res: any) => number;

  getRowsFromResult = (res: any) => {
    const numberOfRows = this.getNumberOfResultRows(res);
    const rows = [];
    for (let i = 0; i < numberOfRows; i++) {
      rows.push(this.getRowFromResult(res, i));
    }
    return rows;
  }
}
