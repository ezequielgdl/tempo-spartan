import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteClientComponent } from './delete-client.component';
import { ClientService } from '../../services/clients.service';
import { of } from 'rxjs';
import { Client } from '../../interface';

describe('DeleteClientComponent', () => {
  let component: DeleteClientComponent;
  let fixture: ComponentFixture<DeleteClientComponent>;
  let clientService: ClientService;
  const mockClient: Client = {
    id: '1',
    name: 'John Doe',
    address: '123 Main St',
    pricePerHour: 100
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteClientComponent],
      providers: [ClientService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteClientComponent);
    component = fixture.componentInstance;
    clientService = TestBed.inject(ClientService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call delete client', () => {
    spyOn(clientService, 'deleteClient').and.returnValue(of(undefined));
    component.onDelete(mockClient.id);
    expect(clientService.deleteClient).toHaveBeenCalledWith(mockClient.id);
  });
});
