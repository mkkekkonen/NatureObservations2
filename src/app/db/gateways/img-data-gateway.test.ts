import { ImgDataGateway } from './img-data-gateway';
import { createSqlJsAdapterWithDb } from '../test-fns';
import { SqlJsAdapter } from '../adapters/sql-js-adapter';
import { migrations } from '../migrations/migrations';
import { ImgData } from '../../models/img-data.entity';

let adapter: SqlJsAdapter;
let gateway: ImgDataGateway;

beforeAll(async () => {
  adapter = await createSqlJsAdapterWithDb();
  gateway = new ImgDataGateway(adapter);
  for(const migration of migrations) {
    await migration.forwards(adapter);
  }
});

describe('ImgData', () => {
  describe('validateValues', () => {
    it('throws on invalid data length', () => {
      const gateway = new ImgDataGateway();

      const data = ['foo', 'bar', 'baz'];

      expect(() => gateway.validateValues(data)).toThrow();
    });

    it('passes', () => {
      const gateway = new ImgDataGateway();

      const data = ['file://asd', 'data:image/gif;base64,R0lG', 1];

      expect(() => gateway.validateValues(data)).not.toThrow();
    });

    it('throws on invalid file URI', () => {
      const gateway = new ImgDataGateway();

      const data = [123, 'data:image/gif;base64,R0lG', 1];

      expect(() => gateway.validateValues(data)).toThrow();
    });

    it('throws on invalid debug data URI', () => {
      const gateway = new ImgDataGateway();

      const data = ['file://asd', 123, 1];

      expect(() => gateway.validateValues(data)).toThrow();
    });
  });

  describe('DB functions', () => {
    it('inserts image data', async () => {
      const obj = new ImgData('file:///asd/fgh', null, 1);

      try {
        gateway.insert(obj);
      } catch (e) {
        console.log(e.message);
      }

      const all = await gateway.getAll();

      expect(all.length).toEqual(1);
    });

    it('updates image data', async () => {
      const obj = new ImgData('file:///foo/bar', null, 2, 1);
      await gateway.update(obj);

      const all = await gateway.getAll();
      expect(all.length).toEqual(1);

      const [fromDb] = all;
      expect(fromDb.id).toEqual(1);
      expect(fromDb.observationId).toEqual(2);
      expect(fromDb.fileUri).toEqual('file:///foo/bar');
    });

    it('gets image data by ID', async () => {
      const obj = await gateway.getById(1);
      expect(obj).toEqual(new ImgData('file:///foo/bar', null, 2, 1));
    });

    it('deletes image data by ID', async () => {
      await gateway.delete(1);

      const all = await gateway.getAll();
      expect(all.length).toEqual(0);
    });
  });

  describe('observation data DB functions', () => {
    it('gets image data by observation ID', async () => {
      const obj = new ImgData('file:///asd/fgh', null, 3);

      try {
        gateway.insert(obj);
      } catch (e) {
        console.log(e.message);
      }

      const obj2 = await gateway.getByObservationId(3);
      expect(obj2).toEqual(new ImgData('file:///asd/fgh', null, 3, 2));
    });
  });

  it('deletes image data by observation ID', async () => {
    await gateway.deleteByObservationId(3);

    const all = await gateway.getAll();
    expect(all.length).toEqual(0);
  });
});
