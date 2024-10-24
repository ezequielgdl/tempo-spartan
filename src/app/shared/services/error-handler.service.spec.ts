import { TestBed } from '@angular/core/testing';

import { ErrorHandlerService } from './error-handler.service';

describe('ErrorHandlerService', () => {
  let service: ErrorHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an Observable with the provided result', () => {
    const result = { data: 'test' };
    const errorHandler = service.handleError('testOperation', result);
    const error = new Error('Test error');

    errorHandler(error).subscribe(data => {
      expect(data).toEqual(result);
    });
  });

  it('should log the error message to console', () => {
    const consoleSpy = spyOn(console, 'error');
    const errorHandler = service.handleError('testOperation');
    const error = new Error('Test error');

    errorHandler(error).subscribe();

    expect(consoleSpy).toHaveBeenCalledWith('testOperation failed: Test error');
  });
});
