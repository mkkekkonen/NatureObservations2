import { TestBed } from '@angular/core/testing';

import { SearchSortService } from './search-sort.service';

describe('SearchSortService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SearchSortService = TestBed.get(SearchSortService);
    expect(service).toBeTruthy();
  });
});
