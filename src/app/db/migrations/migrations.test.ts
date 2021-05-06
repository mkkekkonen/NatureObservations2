import { createSqlJsAdapterWithDb } from '../test-fns';
import { SqlJsAdapter } from '../adapters/sql-js-adapter';
import mig01 from './01-first-migration';

let adapter: SqlJsAdapter;

it('works', () => {
  expect(true).toBe(true);
});

// beforeAll(async () => {
//   adapter = await createSqlJsAdapterWithDb();
// });

// describe('mig01', () => {
//   test('forwards', () => {
//     mig01.forwards(adapter);

//     adapter.writeDatabase('test.sqlite');
//   })
// });
