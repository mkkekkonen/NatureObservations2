import { getSelectObservationDataClause } from './abstract-observation-data-gateway';

describe('clause functions', () => {
  it('correctly generates select clause', () => {
    const tableName = 'imgData';
    expect(getSelectObservationDataClause(tableName))
      .toEqual('SELECT * FROM imgData WHERE observationId = ?');
  });
});
