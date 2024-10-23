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

  const client: Client = {
    id: '1',
    name: 'Test Client',
    address: '123 Test St',
    pricePerHour: 100
  };

  const mockUser = { id: 'user1', app_metadata: {}, user_metadata: {}, aud: '', created_at: '' };

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

  it('should fetch clients', (done) => {
    service.getClients().subscribe(clients => {
      expect(clients).toBeDefined();
      done();
    });
  });

  it('should fetch client by id', (done) => {
    service.getClientById('1').subscribe(client => {
      expect(client).toBeDefined();
      expect(client?.id).toBe('1');
      done();
    });
  });

  it('should create client', (done) => {
    authServiceSpy.getCurrentUser.and.returnValue(of(mockUser));
    service.createClient(client).subscribe(newClient => {
      expect(newClient).toBeDefined();
      expect(newClient?.name).toBe('Test Client');
      expect(newClient?.address).toBe('123 Test St');
      expect(newClient?.pricePerHour).toBe(100);
      done();
    });
  });

  it('should update client', (done) => {
    service.updateClient(client.id, client).subscribe(updatedClient => {
      expect(updatedClient).toBeDefined();
      done();
    });
  });

  it('should delete client', (done) => {
    service.deleteClient(client.id).subscribe(() => {
      done();
    });
  });

  it('should handle error when creating client', (done) => {
    authServiceSpy.getCurrentUser.and.returnValue(of(mockUser));
    service.createClient(client).subscribe({
      next: () => fail('expected an error, not a client'),
      error: error => {
        expect(errorHandlerSpy.handleError).toHaveBeenCalled();
        done();
      }
    });
  });

  it('should handle error when updating client', (done) => {
    service.updateClient(client.id, client).subscribe({
      next: () => fail('expected an error, not a client'),
      error: error => {
        expect(errorHandlerSpy.handleError).toHaveBeenCalled();
        done();
      }
    });
  });

  it('should handle error when deleting client', (done) => {
    service.deleteClient(client.id).subscribe({
      next: () => fail('expected an error, not a client'),
      error: error => {
        expect(errorHandlerSpy.handleError).toHaveBeenCalled();
        done();
      }
    });
  });

  it('should handle error when fetching clients', (done) => {
    service.getClients().subscribe({
      next: () => fail('expected an error, not clients'),
      error: error => {
        expect(errorHandlerSpy.handleError).toHaveBeenCalled();
        done();
      }
    });
  });
});
