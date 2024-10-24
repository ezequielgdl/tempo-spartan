import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserComponent } from './user.component';
import { UserService } from '../services/user.service';
import { of } from 'rxjs';
import { UserInfo } from '../interface';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('UserService', ['getUser']);

    await TestBed.configureTestingModule({
      imports: [UserComponent],
      providers: [
        { provide: UserService, useValue: spy }
      ]
    }).compileComponents();

    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set user data when initialized', () => {
    const mockUser: UserInfo = {
      id: '1',
      name: 'John Doe',
      nif: '123456789',
      address: '123 Main St',
      phone: '555-1234',
      iban: 'ES1234567890',
      website: 'www.johndoe.com'
    };
    userServiceSpy.getUser.and.returnValue(of(mockUser));

    fixture.detectChanges();

    expect(component.user()).toEqual(mockUser);
  });

  it('should compute first name correctly', () => {
    // Arrange
    const mockUser: UserInfo = {
      id: '1',
      name: 'John Doe',
      nif: '123456789',
      address: '123 Main St',
      phone: '555-1234',
      iban: 'ES1234567890',
      website: 'www.johndoe.com'
    };
    component.user.set(mockUser);

    expect(component.name()).toBe('John');
  });

});
