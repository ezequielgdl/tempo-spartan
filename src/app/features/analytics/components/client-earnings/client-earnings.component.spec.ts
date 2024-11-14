import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientEarningsComponent } from './client-earnings.component';

describe('ClientEarningsComponent', () => {
  let component: ClientEarningsComponent;
  let fixture: ComponentFixture<ClientEarningsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientEarningsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientEarningsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
