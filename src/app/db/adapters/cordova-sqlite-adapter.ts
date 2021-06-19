import { SQLiteObject } from '@ionic-native/sqlite/ngx';

import _, { reject } from 'lodash';

import { AbstractDbAdapter, GetValuesFn, EditContextFn } from './abstract-db-adapter';

export class CordovaSqliteAdapter extends AbstractDbAdapter {
  constructor(db?: SQLiteObject) {
    super(db);
  }

  private get db() {
    return this.database as SQLiteObject;
  }

  executeSql = (sql: string, values?: any[]) => {
    return this.db.executeSql(sql, values);
  }

  executeTransaction = (sql: string[], values?: any[][]) => {
    return new Promise(async (resolve, reject) => {
      const res = await this.db.transaction(tx => {
        for(const entry of _.zip(sql, values || [])) {
          const [sqlRow, rowValues] = entry;
          tx.executeSql(
            sqlRow,
            rowValues,
            () => console.log('success'),
            (tx, error) => {
              reject(error);
              return false;
            },
          );
        }
      });
      resolve(res);
    });
  };

  executeTransactionWithContext = (sql: string[], getValuesFns?: GetValuesFn[], editContextFns?: EditContextFn[]) => {
    const context = {};
    return new Promise(async (resolve, reject) => {
      const res = await this.db.transaction(tx => {
        let breakFlag = false;
        for(const entry of _.zip(sql, getValuesFns || [], editContextFns || [])) {
          const [sqlRow, getValues, editContext] = entry;
          tx.executeSql(
            sqlRow,
            getValues(context),
            (tx, result) => {
              const resultObj = this.getRowsFromResult(result);
              editContext(resultObj, context);
            },
            (tx, error) => {
              reject(error);
              breakFlag = true;
              return false;
            }
          )
          if (breakFlag) {
            break;
          }
        }
      });
      resolve(res);
    });
  }

  getNumberOfResultRows = (res: any) => res.rows.length;

  getRowFromResult = (res: any, rowIndex: number) => res.rows.item(rowIndex);

  getLastIdFromResult = (res: any) => res.rows.item(0).id;
}
