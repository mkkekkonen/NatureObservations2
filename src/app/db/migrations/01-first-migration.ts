import { IMigration } from './migrations';
import { AbstractDbAdapter } from '../adapters/abstract-db-adapter';

const mig: IMigration = {
  id: 1,
  forwards: (adapter: AbstractDbAdapter) => {
    const sql = 'CREATE TABLE IF NOT EXISTS lastMigration (id INTEGER PRIMARY KEY AUTOINCREMENT, lastMigrationId INTEGER);'
      + 'CREATE TABLE IF NOT EXISTS imgData (id INTEGER PRIMARY KEY AUTOINCREMENT, fileUri TEXT, debugDataUri TEXT);'
      + 'CREATE TABLE IF NOT EXISTS mapLocation (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, latitude REAL, longitude REAL);'
      + 'CREATE TABLE IF NOT EXISTS observationType (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, imageFileName TEXT NOT NULL);'
      + 'CREATE TABLE IF NOT EXISTS observation (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, date TEXT, typeId INTEGER NOT NULL, mapLocationId INTEGER, imgDataId INTEGER, '
      + 'FOREIGN KEY (typeId) REFERENCES observationType (id), '
      + 'FOREIGN KEY (mapLocationId) REFERENCES mapLocation (id) ON DELETE CASCADE, '
      + 'FOREIGN KEY (imgDataId) REFERENCES imgData (id) ON DELETE CASCADE);';
    adapter.executeSql(sql);
  },
  backwards: (adapter: AbstractDbAdapter) => {
    const sql = 'DROP TABLE observation; DROP TABLE imgData; DROP TABLE mapLocation; DROP TABLE observationType; DROP TABLE lastMigration;';
    adapter.executeSql(sql);
  },
};

export default mig;
