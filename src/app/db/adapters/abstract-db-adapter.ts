import { SQLiteObject as CordovaSqliteObject } from '@ionic-native/sqlite/ngx';
import { Database as SqlJsDatabase } from 'sql.js';

type DatabaseType = CordovaSqliteObject | SqlJsDatabase;

export abstract class AbstractDbAdapter {
  database?: DatabaseType;

  constructor(db?: DatabaseType) {
    this.database = db;
  }

  abstract executeSql: (sql: string, values?: any[]) => Promise<any>;

  abstract getNumberOfResultRows: (res: any) => number;

  abstract getRowFromResult: (res: any, rowIndex: number) => any;

  abstract getLastIdFromResult: (res: any) => number;
}
