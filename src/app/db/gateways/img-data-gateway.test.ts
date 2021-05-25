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
  migrations.forEach(migration => migration.forwards(adapter));
});

describe('ImgData', () => {
  it('inserts image data', async () => {
    const obj = new ImgData('file:///asd/fgh', 'abcdef');

    gateway.insert(obj);

    const all = await gateway.getAll();

    expect(all.length).toEqual(1);
  });

  it('updates image data', async () => {
    const obj = new ImgData('file:///foo/bar', 'abcdef', 1);
    await gateway.update(obj);

    const all = await gateway.getAll()
    expect(all.length).toEqual(1);

    const [fromDb] = all;
    expect(fromDb.id).toEqual(1);
    expect(fromDb.fileUri).toEqual('file:///foo/bar');
  });

  it('gets image data by ID', async () => {
    const obj = await gateway.getById(1);
    expect(obj).toEqual(new ImgData('file:///foo/bar', 'abcdef', 1));
  });
});
