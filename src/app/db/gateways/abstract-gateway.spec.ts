import {
  getInsertClause,
  getUpdateClause,
  getFetchAllClause,
  getFetchOneClause,
} from './abstract-gateway';

describe('clause functions', () => {
  it('correctly generates insert clause', () => {
    const tableName = 'observations';
    const placeholderCount = 5;
    expect(getInsertClause(tableName, placeholderCount))
      .toEqual('INSERT INTO observations VALUES (?, ?, ?, ?, ?)');
  });

  it('correctly generates update clause', () => {
    const tableName = 'observations';
    const id = 15;
    const valueNames = ['id', 'title', 'description', 'date', 'type'];
    expect(getUpdateClause(tableName, id, valueNames))
      .toEqual('UPDATE observations SET id = ?, title = ?, description = ?, date = ?, type = ? WHERE id = 15');
  });

  it('correctly generates fetch all clause', () => {
    const tableName = 'observations';
    expect(getFetchAllClause(tableName))
      .toEqual('SELECT * FROM observations');
  });

  it('correctly generates fetch one clause', () => {
    const tableName = 'observations';
    const id = 21;
    expect(getFetchOneClause(tableName, id))
      .toEqual('SELECT * FROM observations WHERE id = 21');
  });
});
