import { ObservationType } from '../../models';
import { SqlJsAdapter } from '../adapters/sql-js-adapter';
import { createSqlJsAdapterWithDb } from '../test-fns';
import { migrations } from '../migrations/migrations';

import { ObservationTypeGateway } from './observation-type-gateway';

let adapter: SqlJsAdapter;
let gateway: ObservationTypeGateway;

beforeAll(async () => {
  adapter = await createSqlJsAdapterWithDb();
  gateway = new ObservationTypeGateway(adapter);
  for (const migration of migrations) {
    await migration.forwards(adapter);
  }
});

describe('ObservationTypeGateway', () => {
  describe('validateValues', () => {
    it('throws on invalid data length', () => {
      const data = ['foo', 'bar', 'baz'];
      expect(() => gateway.validateValues(data)).toThrow();
    });

    it('passes', () => {
      const data = ['LANDSCAPE', 'landscape.svg'];
      expect(() => gateway.validateValues(data)).not.toThrow();
    });

    it('throws on invalid name', () => {
      const data = [123, 'landscape.svg'];
      expect(() => gateway.validateValues(data)).toThrow();
    });

    it('throws on invalid file name', () => {
      const data = ['LANDSCAPE', 123];
      expect(() => gateway.validateValues(data)).toThrow();
    });
  });

  describe('DB functions', () => {
    it('inserts an observation type', async () => {
      const obj = new ObservationType('LANDSCAPE', 'image.png');
      await gateway.insert(obj);
      expect(obj.id).toEqual(1);

      const all = await gateway.getAll();
      expect(all.length).toEqual(1);
    });

    it('updates the observation type', async () => {
      const obj = new ObservationType('PLANT', 'picture.svg', 1);
      await gateway.update(obj);

      const all = await gateway.getAll();
      const [fromDb] = all;
      expect(fromDb).toEqual(obj);
    });

    it('gets the observation type by ID', async () => {
      const obj = await gateway.getById(1);

      expect(obj.id).toEqual(1);
      expect(obj.name).toEqual('PLANT');
      expect(obj.imageFileName).toEqual('picture.svg');
    });

    it('gets the observation type by name', async () => {
      const obj = await gateway.getByTypeName('PLANT');

      expect(obj.id).toEqual(1);
      expect(obj.name).toEqual('PLANT');
      expect(obj.imageFileName).toEqual('picture.svg');
    });

    it('deletes the observation type by id', async () => {
      await gateway.delete(1);

      const all = await gateway.getAll();
      expect(all.length).toEqual(0);
    });
  });
});
