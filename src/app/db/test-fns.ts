import initSqlJs from 'sql.js';

import { SqlJsAdapter } from './adapters/sql-js-adapter';

export const createSqlJsAdapterWithDb = async () => {
  const SQL = await initSqlJs();
  const db = new SQL.Database();
  return new SqlJsAdapter(db);
};
