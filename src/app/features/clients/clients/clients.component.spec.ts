import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsComponent } from './clients.component';
import { ClientService } from '../services/clients.service';
import { Client } from '../interface'
import { of, throwError } from 'rxjs';

describe('ClientsComponent', () => {
  let component: ClientsComponent;
  let fixture: ComponentFixture<ClientsComponent>;
  let clientServiceSpy: jasmine.SpyObj<ClientService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ClientService', ['getClients']);

    await TestBed.configureTestingModule({
      imports: [ClientsComponent],
      providers: [
        { provide: ClientService, useValue: spy }
      ]
    }).compileComponents();

    clientServiceSpy = TestBed.inject(ClientService) as jasmine.SpyObj<ClientService>;
    fixture = TestBed.createComponent(ClientsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch clients on ngOnInit', () => {
    const mockClients: Client[] = [
      { id: '1', name: 'Client 1', address: 'Address 1', pricePerHour: 100 },
      { id: '2', name: 'Client 2', address: 'Address 2', pricePerHour: 150 }
    ];
    clientServiceSpy.getClients.and.returnValue(of(mockClients));

    component.ngOnInit();

    expect(clientServiceSpy.getClients).toHaveBeenCalled();
    expect(component.clients()).toEqual(mockClients);
  });

  it('should set the signal from the clients subscription', () => {
    const mockClients: Client[] = [
      { id: '1', name: 'Client 1', address: 'Address 1', pricePerHour: 100 },
      { id: '2', name: 'Client 2', address: 'Address 2', pricePerHour: 150 }
    ];
    clientServiceSpy.getClients.and.returnValue(of(mockClients));

    component.ngOnInit();

    expect(component.clients()).toEqual(mockClients);
  });
});
