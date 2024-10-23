import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { ClientService } from './clients.service';
import { SupabaseService } from '../../../core/auth/services/supabase.service';
import { AuthService } from '../../../core/auth/services/auth.service';
import { ErrorHandlerService } from '../../../shared/services/error-handler.service';
import { Client } from '../../clients/interface';

describe('ClientService', () => {
  let service: ClientService;
  let supabaseServiceSpy: jasmine.SpyObj<SupabaseService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let errorHandlerSpy: jasmine.SpyObj<ErrorHandlerService>;

  beforeEach(() => {
    const supabaseSpy = jasmine.createSpyObj('SupabaseService', ['getClient']);
    const authSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    const errorSpy = jasmine.createSpyObj('ErrorHandlerService', ['handleError']);

    TestBed.configureTestingModule({
      providers: [
        ClientService,
        { provide: SupabaseService, useValue: supabaseSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: ErrorHandlerService, useValue: errorSpy }
      ]
    });

    service = TestBed.inject(ClientService);
    supabaseServiceSpy = TestBed.inject(SupabaseService) as jasmine.SpyObj<SupabaseService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    errorHandlerSpy = TestBed.inject(ErrorHandlerService) as jasmine.SpyObj<ErrorHandlerService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
