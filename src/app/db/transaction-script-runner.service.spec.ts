import { TestBed } from '@angular/core/testing';

import { TransactionScriptRunnerService } from './transaction-script-runner.service';

describe('TransactionScriptRunnerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TransactionScriptRunnerService = TestBed.get(TransactionScriptRunnerService);
    expect(service).toBeTruthy();
  });
});
