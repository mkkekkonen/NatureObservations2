import {
  getInsertClause,
  getUpdateClause,
  getFetchAllClause,
  getFetchOneClause,
  getDeleteOneClause,
  getFetchLastIdClause,
} from './abstract-gateway';

describe('clause functions', () => {
  it('correctly generates insert clause', () => {
    const tableName = 'observation';
    const valueNames = ['title', 'description', 'date', 'type'];
    expect(getInsertClause(tableName, valueNames))
      .toEqual('INSERT INTO observation (title, description, date, type) VALUES (?, ?, ?, ?)');
  });

  it('correctly generates update clause', () => {
    const tableName = 'observation';
    const valueNames = ['title', 'description', 'date', 'type'];
    expect(getUpdateClause(tableName, valueNames))
      .toEqual('UPDATE observation SET title = ?, description = ?, date = ?, type = ? WHERE id = ?');
  });

  it('correctly generates fetch all clause', () => {
    const tableName = 'observation';
    expect(getFetchAllClause(tableName))
      .toEqual('SELECT * FROM observation');
  });

  it('correctly generates fetch one clause', () => {
    const tableName = 'observation';
    expect(getFetchOneClause(tableName))
      .toEqual('SELECT * FROM observation WHERE id = ?');
  });

  it('correctly generates delete one clause', () => {
    const tableName = 'observation';
    expect(getDeleteOneClause(tableName))
      .toEqual('DELETE FROM observation WHERE id = ?');
  });

  it('correctly generates fetch last ID clause', () => {
    const tableName = 'observation';
    expect(getFetchLastIdClause(tableName))
      .toEqual('SELECT id FROM observation ORDER BY id DESC LIMIT 1');
  });
});
