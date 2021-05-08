import {
  getInsertClause,
  getUpdateClause,
  getFetchAllClause,
  getFetchOneClause,
} from './abstract-gateway';

describe('clause functions', () => {
  it('correctly generates insert clause', () => {
    const tableName = 'observation';
    const valueNames = ['id', 'title', 'description', 'date', 'type']
    expect(getInsertClause(tableName, valueNames))
      .toEqual('INSERT INTO observation (id, title, description, date, type) VALUES (?, ?, ?, ?, ?)');
  });

  it('correctly generates update clause', () => {
    const tableName = 'observation';
    const id = 15;
    const valueNames = ['id', 'title', 'description', 'date', 'type'];
    expect(getUpdateClause(tableName, id, valueNames))
      .toEqual('UPDATE observation SET id = ?, title = ?, description = ?, date = ?, type = ? WHERE id = ?');
  });

  it('correctly generates fetch all clause', () => {
    const tableName = 'observation';
    expect(getFetchAllClause(tableName))
      .toEqual('SELECT * FROM observation');
  });

  it('correctly generates fetch one clause', () => {
    const tableName = 'observation';
    const id = 21;
    expect(getFetchOneClause(tableName))
      .toEqual('SELECT * FROM observation WHERE id = ?');
  });
});
