import moment from 'moment';

import { ObservationGateway } from './observation-gateway';
import { createSqlJsAdapterWithDb } from '../test-fns';
import { SqlJsAdapter } from '../adapters/sql-js-adapter';
import { migrations } from '../migrations/migrations';
import { Observation } from '../../models/observation.entity';

let adapter: SqlJsAdapter;
let gateway: ObservationGateway;

beforeAll(async () => {
  adapter = await createSqlJsAdapterWithDb();
  gateway = new ObservationGateway(adapter);
  for (const migration of migrations) {
    await migration.forwards(adapter);
  }
});

describe('Observation', () => {
  describe('validateValues', () => {
    it('throws on invalid data length', () => {
      const gateway = new ObservationGateway();

      const data = ['foo', 'bar', 'baz'];

      expect(() => gateway.validateValues(data)).toThrow();
    });

    it('passes', () => {
      const gateway = new ObservationGateway();

      const data = ['Voikukka', 'Lorem ipsum', '2021-04-25', 'PLANT'];

      expect(() => gateway.validateValues(data)).not.toThrow();
    });

    it('throws on invalid title', () => {
      const gateway = new ObservationGateway();

      const data = [123, 'Lorem ipsum', '2021-04-25', 'PLANT'];

      expect(() => gateway.validateValues(data)).toThrow();
    });

    it('throws on invalid description', () => {
      const gateway = new ObservationGateway();

      const data = ['Voikukka', 123, '2021-04-25', 'PLANT'];

      expect(() => gateway.validateValues(data)).toThrow();
    });

    it('throws on invalid date', () => {
      const gateway = new ObservationGateway();

      const data = ['Voikukka', 'Lorem ipsum', '2021-20-60', 'PLANT'];

      expect(() => gateway.validateValues(data)).toThrow();
    });

    it('throws on invalid type', () => {
      const gateway = new ObservationGateway();

      const data = ['Voikukka', 'Lorem ipsum', '2021-04-25', 3.14];

      expect(() => gateway.validateValues(data)).toThrow();
    });
  });

  describe('DB functions', () => {
    it('inserts an observation', async () => {
      const obj = new Observation('Voikukka', 'Lorem ipsum', moment('2021-05-27'), 'PLANT');
      await gateway.insert(obj);
      expect(obj.id).toEqual(1);

      const all = await gateway.getAll();
      expect(all.length).toEqual(1);
    });

    it('updates the observation', async () => {
      const obj = new Observation('Kissankello', 'Dolor sit amet', moment('2021-05-27'), 'PLANT', 1);
      await gateway.update(obj);

      const all = await gateway.getAll();
      expect(all.length).toEqual(1);

      const [fromDb] = all;
      expect(fromDb.id).toEqual(1);
      expect(fromDb.title).toEqual('Kissankello'),
      expect(fromDb.description).toEqual('Dolor sit amet');
    });

    it('gets the observation by ID', async () => {
      const obj = await gateway.getById(1);
      expect(obj.id).toEqual(1);
      expect(obj.title).toEqual('Kissankello');
      expect(obj.date.isSame(moment('2021-05-27'))).toBe(true);
      expect(obj.type).toEqual('PLANT');
    });
  });
});
