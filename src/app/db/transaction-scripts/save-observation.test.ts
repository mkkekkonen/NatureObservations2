import { Observation, ImgData, MapLocation } from '../../models';

import { createSqlJsAdapterWithDb } from '../test-fns';
import { SqlJsAdapter } from '../adapters/sql-js-adapter';
import { migrations } from '../migrations/migrations';

import { saveNewObservation } from './save-observation';

let adapter: SqlJsAdapter;

beforeEach(async () => {
  adapter = await createSqlJsAdapterWithDb();
  for (const migration of migrations) {
    await migration.forwards(adapter);
  }
});

describe('saveNewObservation', () => {
  it('saves observation with related data', async () => {
    const observation = new Observation('Asd', 'Fgh', null, 'LANDSCAPE');
    const imgData = new ImgData('file:///', 'asdfgh', null);
    const mapLocation = new MapLocation('Tesoma', 1.234, 5.678, null);

    await saveNewObservation(adapter, observation, imgData, mapLocation);

    expect(observation.id).toEqual(1);
    expect(imgData.id).toEqual(1);
    expect(mapLocation.id).toEqual(1);

    adapter.writeDatabase('testdb/saveNewObservation.sqlite');
  });
});
