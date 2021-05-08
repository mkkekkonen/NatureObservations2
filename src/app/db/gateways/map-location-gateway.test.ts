import { MapLocationGateway } from './map-location-gateway';
import { createSqlJsAdapterWithDb } from '../test-fns';
import { SqlJsAdapter } from '../adapters/sql-js-adapter';
import { migrations } from '../migrations/migrations';

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
    gateway.insert(['Tesoma', 12.3456, 78.9012]);

    adapter.writeDatabase('test.sqlite');
  });
});
