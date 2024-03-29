import { createSqlJsAdapterWithDb } from '../test-fns';
import { SqlJsAdapter } from '../adapters/sql-js-adapter';
import mig01 from './01-first-migration';
import mig02 from './02-observation-type-str';
import mig03 from './03-move-foreign-keys';

import obsTypes from '../../../assets/json/observation-types';

let adapter: SqlJsAdapter;

it('works', () => {
  expect(true).toBe(true);
});

beforeEach(async () => {
  adapter = await createSqlJsAdapterWithDb();
});

describe('mig01', () => {
  test('forwards', () => {
    mig01.forwards(adapter);

    adapter.writeDatabase('testdb/mig1.sqlite');
  })
});

describe('mig02', () => {
  test('forwards', async () => {
    await mig01.forwards(adapter);

    const sql = [
      'INSERT INTO observationType (name, imageFileName) VALUES '
        + obsTypes.map(type => `('${type.name}', '${type.icon}')`).join(', '),
      "INSERT INTO mapLocation (name, latitude, longitude) VALUES ('Tesoma', 1.23, 4.56)",
      "INSERT INTO imgData (fileUri, debugDataUri) VALUES ('asd', 'fgh')",
      'INSERT INTO observation (title, description, date, typeId, mapLocationId, imgDataId) VALUES '
        + "('Testi', 'Testi kuvaus', NULL, 3, 1, 1), "
        + '(NULL, NULL, NULL, 2, NULL, NULL)'
    ]

    await adapter.executeTransaction(sql);

    await mig02.forwards(adapter);

    adapter.writeDatabase('testdb/mig2.sqlite');
  });
});

describe('mig03', () => {
  test('forwards', async () => {
    await mig01.forwards(adapter);
    await mig02.forwards(adapter);

    const sql = [
      'INSERT INTO mapLocation (name, latitude, longitude) VALUES '
        + "('Tesoma', 1.23, 4.56), "
        + "('Hallila', 7.89, 0.12)",
      'INSERT INTO imgData (fileUri, debugDataUri) VALUES '
        + "('asd', 'fgh'), "
        + "('foo', 'bar')",
      'INSERT INTO observation (title, description, date, type, mapLocationId, imgDataId) VALUES '
        + "('Testi', 'Testi kuvaus', NULL, 'LANDSCAPE', 1, 1), "
        + "('Toinen testi', 'Lorem ipsum', NULL, 'PLANT', 2, 2), "
        + '(NULL, NULL, NULL, 2, NULL, NULL)'
    ];

    await adapter.executeTransaction(sql);

    await mig03.forwards(adapter);

    adapter.writeDatabase('testdb/mig3.sqlite');
  });
});
