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
    const db = await this.sqlite.create({ name: 'nobs2.sqlite', location: 'default' });
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
      try {
        migrations.forEach(migration => migration.forwards(adapter));
      } catch (e) {
        console.error(`Error running migrations: ${e.message}`);
        console.error('Aborting');
        return;
      }

      if (!res || res.rows.length === 0) {
        await adapter.executeSql('INSERT INTO lastMigration (lastMigrationId) VALUES (?)', [_.last(migrations).id]);
      }
    } else if (res.rows.length > 0) {
      const lastEntry = res.rows.item(res.rows.length - 1);
      const lastIndex = migrations.findIndex(migration => migration.id === lastEntry.lastMigrationId);
      if (lastIndex !== -1) {
        const migrationsToRun = migrations.slice(lastIndex + 1);

        try {
          for (const migration of migrationsToRun) {
            await migration.forwards(adapter);
          }
        } catch (e) {
          console.error(`Error running migrations: ${e.message}`);
          console.error('Aborting');
          return;
        }

        await adapter.executeSql(
          'UPDATE lastMigration SET lastMigrationId = ? WHERE id = ?',
          [_.last(migrations).id, lastEntry.id],
        );
      }
    }
  }

  reverseMigrations = async () => {
    const db = await this.sqlite.create({ name: 'nobs2.sqlite', location: 'default' });
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
      await migrations[i].backwards(adapter);
    }
  }
}
