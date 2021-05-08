import { IMigration } from './migrations';
import { AbstractDbAdapter } from '../adapters/abstract-db-adapter';

const mig: IMigration = {
  id: 1,
  forwards: (adapter: AbstractDbAdapter) => {
    const sql = [];
    sql.push('CREATE TABLE IF NOT EXISTS lastMigration (id INTEGER PRIMARY KEY AUTOINCREMENT, lastMigrationId INTEGER)');
    sql.push('CREATE TABLE IF NOT EXISTS imgData (id INTEGER PRIMARY KEY AUTOINCREMENT, fileUri TEXT, debugDataUri TEXT)');
    sql.push('CREATE TABLE IF NOT EXISTS mapLocation (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, latitude REAL, longitude REAL);');
    sql.push('CREATE TABLE IF NOT EXISTS observationType (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, imageFileName TEXT NOT NULL);');
    sql.push('CREATE TABLE IF NOT EXISTS observation (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, date TEXT, typeId INTEGER NOT NULL, mapLocationId INTEGER, imgDataId INTEGER, '
      + 'FOREIGN KEY (typeId) REFERENCES observationType (id), '
      + 'FOREIGN KEY (mapLocationId) REFERENCES mapLocation (id) ON DELETE CASCADE, '
      + 'FOREIGN KEY (imgDataId) REFERENCES imgData (id) ON DELETE CASCADE);');
    sql.forEach(async statement => {
      try {
        await adapter.executeSql(statement)
      } catch (e) {
        console.log(e.message);
      }
    });
  },
  backwards: (adapter: AbstractDbAdapter) => {
    const sql = [];
    sql.push('DROP TABLE IF EXISTS observation');
    sql.push('DROP TABLE IF EXISTS imgData');
    sql.push('DROP TABLE IF EXISTS mapLocation');
    sql.push('DROP TABLE IF EXISTS observationType');
    sql.push('DROP TABLE IF EXISTS lastMigration');
    sql.forEach(statement => adapter.executeSql(statement));
  },
};

export default mig;
