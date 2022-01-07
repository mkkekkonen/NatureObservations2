import { TestBed } from '@angular/core/testing';

import { MigrationRunnerService } from './migration-runner.service';

describe('MigrationRunnerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MigrationRunnerService = TestBed.get(MigrationRunnerService);
    expect(service).toBeTruthy();
  });
});
