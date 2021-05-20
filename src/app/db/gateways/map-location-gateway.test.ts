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

beforeAll(async () => {
  adapter = await createSqlJsAdapterWithDb();
  gateway = new MapLocationGateway(adapter);
  migrations.forEach(migration => migration.forwards(adapter));
});

describe('insert', () => {
  it('inserts a map location', async () => {
    const obj = new MapLocation('Tesoma', 12.3456, 78.9012);
    await gateway.insert(obj);
    expect(obj.id).toEqual(1);

    const all = await gateway.getAll();
    expect(all.length).toEqual(1);
  });

  it('updates the map location', async () => {
    const obj = new MapLocation('Hallila', 12.3456, 78.9012, 1);
    await gateway.update(obj);

    const all = await gateway.getAll();
    expect(all.length).toEqual(1);
    const [fromDb] = all;
    expect(fromDb.id).toEqual(1);
    expect(fromDb.name).toEqual('Hallila');
  });

  it('gets the map location by ID', async () => {
    const obj = await gateway.getById(1);
    expect(obj).toEqual(new MapLocation('Hallila', 12.3456, 78.9012, 1));
  });
});
