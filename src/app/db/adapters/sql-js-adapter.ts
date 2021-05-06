import fs from 'fs';

import { Database } from 'sql.js';

import { AbstractDbAdapter } from './abstract-db-adapter';

export class SqlJsAdapter extends AbstractDbAdapter {
  constructor(db?: Database) {
    super(db);
  }

  private getDb = () => (this.database as Database);

  executeSql = (sql: string, values?: any[]) => {
    return Promise.resolve(this.getDb().exec(sql, values));
  }

  writeDatabase = (filename: string = 'testDb.sqlite') => {
    const data = this.getDb().export();
    const buf = Buffer.from(data);
    fs.writeFileSync(filename, buf);
  }
}
