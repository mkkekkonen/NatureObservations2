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
  for (const migration of migrations) {
    await migration.forwards(adapter);
  }
});

describe('MapLocation', () => {
  describe('validateValues', () => {
    it('throws on invalid data length', () => {
      const gateway = new MapLocationGateway();

      const data = ['foo', 'bar', 'baz'];

      expect(() => gateway.validateValues(data)).toThrow();
    });

    it('passes', () => {
      const gateway = new MapLocationGateway();

      const data = ['Tesoma', 12.3456, 78.9012, 1];

      expect(() => gateway.validateValues(data)).not.toThrow();
    });

    it('passes - name is null', () => {
      const gateway = new MapLocationGateway();

      const data = [null, 12.3456, 78.9012, 1]

      expect(() => gateway.validateValues(data)).not.toThrow();
    });

    it('throws on invalid name', () => {
      const gateway = new MapLocationGateway();

      const data = [123, 12.3456, 78.9012, 1];

      expect(() => gateway.validateValues(data)).toThrow();
    });

    it('throws on invalid latitude', () => {
      const gateway = new MapLocationGateway();

      const data = ['Tesoma', 'asd', 78.9012, 1];

      expect(() => gateway.validateValues(data)).toThrow();
    });

    it('throws on invalid longitude', () => {
      const gateway = new MapLocationGateway();

      const data = ['Tesoma', 12.3456, 'asd', 1];

      expect(() => gateway.validateValues(data)).toThrow();
    });
  });

  describe('DB functions', () => {
    it('inserts a map location', async () => {
      const obj = new MapLocation('Tesoma', 12.3456, 78.9012, 1);
      await gateway.insert(obj);
      expect(obj.id).toEqual(1);

      const all = await gateway.getAll();
      expect(all.length).toEqual(1);
    });

    it('updates the map location', async () => {
      const obj = new MapLocation('Hallila', 12.3456, 78.9012, 1, 1);
      await gateway.update(obj);

      const all = await gateway.getAll();
      expect(all.length).toEqual(1);
      const [fromDb] = all;
      expect(fromDb.id).toEqual(1);
      expect(fromDb.name).toEqual('Hallila');
    });

    it('gets the map location by ID', async () => {
      const obj = await gateway.getById(1);
      expect(obj).toEqual(new MapLocation('Hallila', 12.3456, 78.9012, 1, 1));
    });

    it('deletes the map location by ID', async () => {
      await gateway.delete(1);
      
      const all = await gateway.getAll();
      expect(all.length).toEqual(0);
    });
  });
});
