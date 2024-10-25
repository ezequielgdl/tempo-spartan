import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Validators } from '@angular/forms';
import { NewClientComponent } from './new-client.component';
import { ClientService } from '../../services/clients.service'
import { of } from 'rxjs';
import { Client } from '../../interface';

describe('NewClientComponent', () => {
  let component: NewClientComponent;
  let fixture: ComponentFixture<NewClientComponent>;
  let clientService: ClientService;
  const mockClient: Client = {
    id: '1',
    name: 'John Doe',
    address: '123 Main St',
    pricePerHour: 100
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewClientComponent],
      providers: [ClientService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewClientComponent);
    component = fixture.componentInstance;
    clientService = TestBed.inject(ClientService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize fields', () => {
    component.ngOnInit();
    expect(component.fields.length).toBe(6);
    expect(component.fields[0].id).toBe('name');
    expect(component.fields[0].label).toBe('Name');
    expect(component.fields[0].value).toBe('');
    expect(component.fields[0].validators).toEqual([Validators.required]);
  });

  it('should call save client', () => {
    spyOn(clientService, 'createClient').and.returnValue(of(mockClient));
    component.onSave(mockClient);
    expect(clientService.createClient).toHaveBeenCalledWith(mockClient);
  });
});
