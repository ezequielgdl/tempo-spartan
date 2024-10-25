import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserService } from '../../services/user.service';
import { EditUserComponent } from './edit-user.component';
import { UserInfo } from '../../interface';

describe('EditUserComponent', () => {
  let component: EditUserComponent;
  let fixture: ComponentFixture<EditUserComponent>;
  let userService: UserService;
  const mockUser: UserInfo = {
    id: '1',
    name: 'John Doe',
    address: '123 Main St',
    phone: '555-1234',
    website: 'www.johndoe.com',
    nif: '123456789',
    iban: 'ES1234567890123456789012'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditUserComponent],
      providers: [UserService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditUserComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize fields', () => {
    component.user = mockUser;
    component.ngOnInit();
    expect(component.fields.length).toBe(6);
    expect(component.fields[0].value).toBe(mockUser.name);
  });
});
