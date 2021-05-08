import { Injectable } from '@angular/core';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

import _, { last } from 'lodash';

import { migrations } from './migrations/migrations';
import { CordovaSqliteAdapter } from './adapters/cordova-sqlite-adapter';

@Injectable({
  providedIn: 'root'
})
export class MigrationRunnerService {

  constructor(private sqlite: SQLite) { }

  runMigrations = async () => {
    const db = await this.sqlite.create({ name: 'nobs2.db', location: 'default' });
    const adapter = new CordovaSqliteAdapter(db);

    let runAllMigrations = false;
    let lastMigration = 0;
    let res;

    try {
      res = await adapter.executeSql('SELECT * FROM lastMigration');
      if (res.rows.length === 0) {
        runAllMigrations = true;
      }
    } catch (e) {
      runAllMigrations = true;
    }

    if (runAllMigrations) {
      migrations.forEach(migration => migration.forwards(adapter));
      if (res.rows.length === 0) {
        await adapter.executeSql('INSERT INTO lastMigration (lastMigrationId) VALUES (?)', [_.last(migrations).id]);
      }
    } else if (res.rows.length > 0) {
      const lastId = res.rows.item(res.rows.length - 1).id;
      const lastIndex = migrations.findIndex(migration => migration.id === lastId);
      if (lastIndex !== -1) {
        migrations.slice(lastIndex + 1).forEach(migration => migration.forwards(adapter));
      }
    }
  }

  reverseMigrations = async () => {
    const db = await this.sqlite.create({ name: 'nobs2.db', location: 'default' });
    const adapter = new CordovaSqliteAdapter(db);

    let res;

    try {
      res = await adapter.executeSql('SELECT * FROM lastMigration');
      if (res.rows.length === 0) {
        return;
      }
    } catch (e) {
      return;
    }

    const lastId = res.rows.item(res.rows.length - 1).id;
    if (!lastId) {
      return;
    }

    const lastIndex = migrations.findIndex(migration => migration.id === lastId);
    for (let i = lastIndex; i >= 0; i--) {
      migrations[i].backwards(adapter);
    }
  }
}
