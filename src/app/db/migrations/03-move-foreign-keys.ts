import { IMigration } from './migrations';
import { AbstractDbAdapter } from '../adapters/abstract-db-adapter';

interface IObservationOld {
  id: number
  title?: string
  description?: string
  date?: string
  type: string
  mapLocationId?: number
  imgDataId?: number
}

const migration: IMigration = {
  id: 3,
  forwards: async (adapter: AbstractDbAdapter) => {
    const getAllObsSql = 'SELECT * FROM observation';
    const getAllImgDataSql = 'SELECT * FROM imgData';
    const getAllMapLocationsSql = 'SELECT * FROM mapLocation';

    const observationsResult = await adapter.executeSql(getAllObsSql);
    const imgDataResult = await adapter.executeSql(getAllImgDataSql);
    const mapLocationsResult = await adapter.executeSql(getAllMapLocationsSql);

    const observations: IObservationOld[] = adapter.getRowsFromResult(observationsResult);

    const sql = [];
    const values = [];

    const addSqlRow = (sqlRow: string) => {
      sql.push(sqlRow);
      values.push([]);
    }

    addSqlRow('ALTER TABLE imgData ADD COLUMN observationId INTEGER '
      + 'REFERENCES observation (id) ON DELETE CASCADE');
    addSqlRow('ALTER TABLE mapLocation ADD COLUMN observationId INTEGER '
      + 'REFERENCES observation (id) ON DELETE CASCADE');

    observations.forEach(observation => {
      if (observation.imgDataId) {
        sql.push('UPDATE imgData SET observationId = ? WHERE id = ?');
        values.push([observation.id, observation.imgDataId]);
      }
      if (observation.mapLocationId) {
        sql.push('UPDATE mapLocation SET observationId = ? WHERE id = ?');
        values.push([observation.id, observation.mapLocationId]);
      }
    });

    addSqlRow('CREATE TABLE IF NOT EXISTS observation_new (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, date TEXT, type TEXT NOT NULL, mapLocationId INTEGER, imgDataId INTEGER)');
    addSqlRow('INSERT INTO observation_new SELECT * FROM observation');
    addSqlRow('DROP TABLE IF EXISTS observation');
    addSqlRow('ALTER TABLE observation_new RENAME TO observation');

    addSqlRow('ALTER TABLE observation DROP COLUMN mapLocationId');
    addSqlRow('ALTER TABLE observation DROP COLUMN imgDataId');

    await adapter.executeTransaction(sql, values);
  },
  backwards: async (adapter: AbstractDbAdapter) => {

  }
}

export default migration;
