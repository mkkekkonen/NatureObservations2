import { MapLocationGateway } from './map-location-gateway';
import { createSqlJsAdapterWithDb } from '../test-fns';
import { SqlJsAdapter } from '../adapters/sql-js-adapter';
import { migrations } from '../migrations/migrations';
import { MapLocation } from '../../models/map-location.entity';

let adapter: SqlJsAdapter;
let gateway: MapLocationGateway;

it('works', () => {
  expect(true).toBe(true);
});

beforeEach(async () => {
  adapter = await createSqlJsAdapterWithDb();
  gateway = new MapLocationGateway(adapter);
  migrations.forEach(migration => migration.forwards(adapter));
});

describe('insert', () => {
  it('inserts a map location', async () => {
    const obj = new MapLocation('Tesoma', 12.3456, 78.9012);

    gateway.insert(obj);

    const all = await gateway.getAll();

    expect(all.length).toEqual(1);
  });
});
