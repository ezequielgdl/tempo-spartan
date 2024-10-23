import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsTableComponent } from './clients-table.component';

describe('ClientsTableComponent', () => {
  let component: ClientsTableComponent;
  let fixture: ComponentFixture<ClientsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the clients signal', () => {
    component.clients = [
      { id: '1', name: 'Client 1', address: 'Address 1', pricePerHour: 100 }
    ];
    expect(component.clients).toEqual([{ id: '1', name: 'Client 1', address: 'Address 1', pricePerHour: 100 }]);
  });

  it('should render the clients', () => {
    component.clients = [
      { id: '1', name: 'Client 1', address: 'Address 1', pricePerHour: 100 }
    ];
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Client 1');
  });

  it('should render several clients', () => {
    component.clients = [
      { id: '1', name: 'Client 1', address: 'Address 1', pricePerHour: 100 },
      { id: '2', name: 'Client 2', address: 'Address 2', pricePerHour: 150 }
    ];
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Client 1');
    expect(fixture.nativeElement.textContent).toContain('Client 2');
  });
});
