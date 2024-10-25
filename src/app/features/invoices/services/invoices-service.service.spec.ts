import { TestBed } from '@angular/core/testing';

import { InvoicesServiceService } from './invoices-service.service';

describe('InvoicesServiceService', () => {
  let service: InvoicesServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoicesServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
