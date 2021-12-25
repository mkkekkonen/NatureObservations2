import {
  getSelectObservationDataClause,
  getDeleteObservationDataClause,
  getUpdateObservationIdClause,
} from './abstract-observation-data-gateway';

describe('clause functions', () => {
  it('correctly generates select clause', () => {
    const tableName = 'imgData';
    expect(getSelectObservationDataClause(tableName))
      .toEqual('SELECT * FROM imgData WHERE observationId = ?');
  });

  it('correctly generates delete clause', () => {
    const tableName = 'mapLocation';
    expect(getDeleteObservationDataClause(tableName))
      .toEqual('DELETE FROM mapLocation WHERE observationId = ?');
  });

  it('correctly generates update clause', () => {
    const tableName = 'imgData';
    expect(getUpdateObservationIdClause(tableName))
      .toEqual('UPDATE imgData SET observationId = ? WHERE id = ?');
  });
});
