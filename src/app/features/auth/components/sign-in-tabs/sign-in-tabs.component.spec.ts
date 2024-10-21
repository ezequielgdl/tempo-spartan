import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInTabsComponent } from './sign-in-tabs.component';

describe('SignInTabsComponent', () => {
  let component: SignInTabsComponent;
  let fixture: ComponentFixture<SignInTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignInTabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignInTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
