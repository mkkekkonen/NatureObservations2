import { ImgDataGateway } from './img-data-gateway';
import { createSqlJsAdapterWithDb } from '../test-fns';
import { SqlJsAdapter } from '../adapters/sql-js-adapter';
import { migrations } from '../migrations/migrations';
import { ImgData } from '../../models/img-data.entity';

let adapter: SqlJsAdapter;
let gateway: ImgDataGateway;

beforeEach(async () => {
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
});
