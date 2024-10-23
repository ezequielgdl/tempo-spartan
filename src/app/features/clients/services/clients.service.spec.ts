import { TestBed } from '@angular/core/testing';

import { ClientService } from './clients.service';
import { SupabaseService } from '../../../core/auth/services/supabase.service';
import { Client } from '../../clients/interface'

describe('ClientService', () => {
  let service: ClientService;
  let supabaseService: SupabaseService; 
  const client: Client = {
    id: '1',
    name: 'Test Client',
    address: '123 Test St',
    pricePerHour: 100
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch clients', () => {
    service.getClients().subscribe(clients => {
      expect(clients).toBeDefined();
    });
  });

  it('should fetch client by id', () => {
    service.getClientById('1').subscribe(client => {
      expect(client).toBeDefined();
    });
  });

  it('should create client', () => {
    service.createClient(client).subscribe(client => {
      expect(client).toBeDefined();
      expect(client?.name).toBe('Test Client');
      expect(client?.address).toBe('123 Test St');
      expect(client?.pricePerHour).toBe(100);
    });
  });

});
