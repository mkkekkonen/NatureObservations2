import { IMigration } from './migrations';
import { AbstractDbAdapter } from '../adapters/abstract-db-adapter';

interface IObservationType {
  id: number
  name: string
  imageFileName: string
}

interface IObservationOld {
  id: number
  title?: string
  description?: string
  date?: string
  typeId: number
  mapLocationId?: number
  imgDataId?: number
}

const createObsTypeMapper = (obsTypes: IObservationType[]) =>
  (id: number) => obsTypes.find(type => type.id === id).name;

// wrap in single quotes or return NULL
const w = (value: any) => value ? `'${value}'` : 'NULL';

const migration: IMigration = {
  id: 2,
  forwards: async (adapter: AbstractDbAdapter) => {
    const obsTypeSql = 'SELECT * FROM observationType';
    const obsTypeResult = await adapter.executeSql(obsTypeSql);
    const obsTypes = adapter.getRowsFromResult(obsTypeResult);

    const typeMapper = createObsTypeMapper(obsTypes);

    const observationsSql = 'SELECT * FROM observation';
    const observationsResult = await adapter.executeSql(observationsSql);
    const observations = adapter.getRowsFromResult(observationsResult);

    const observationValues = observations.map((obs: IObservationOld) => `(${w(obs.title)}, ${w(obs.description)}, ${w(obs.date)}, ${w(typeMapper(obs.typeId))}, ${obs.mapLocationId || 'NULL'}, ${obs.imgDataId || 'NULL'})`)
      .join(', ');

    let sql = 'CREATE TABLE IF NOT EXISTS observation_new (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, date TEXT, type TEXT NOT NULL, mapLocationId INTEGER, imgDataId INTEGER, '
        + 'FOREIGN KEY (mapLocationId) REFERENCES mapLocation (id) ON DELETE CASCADE, '
        + 'FOREIGN KEY (imgDataId) REFERENCES imgData (id) ON DELETE CASCADE);'
      + 'INSERT INTO observation_new (title, description, date, type, mapLocationId, imgDataId) VALUES '
        + observationValues + ';'
      + 'DROP TABLE IF EXISTS observation;'
      + 'ALTER TABLE observation_new RENAME TO observation;';

    await adapter.executeTransaction(sql);
  },
  backwards: (adapter: AbstractDbAdapter) => {
    // TODO
  }
};

export default migration;
