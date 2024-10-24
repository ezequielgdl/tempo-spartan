import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../../core/auth/services/auth.service';
import { ThemeService } from '../../../core/theme/theme.service';
import { of } from 'rxjs';
import { UserInfo } from '../../../features/user/interface';
import { User } from '@supabase/supabase-js';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let themeServiceSpy: jasmine.SpyObj<ThemeService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'logout']);
    themeServiceSpy = jasmine.createSpyObj('ThemeService', ['toggleDarkMode']);

    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ThemeService, useValue: themeServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set currentUser on init', () => {
    const mockUser: User = {
      id: '1',
      email: 'test@example.com',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: '2021-01-01',
    };
    authServiceSpy.getCurrentUser.and.returnValue(of(mockUser));
    fixture.detectChanges();
    expect(component.currentUser).toEqual(mockUser);
  });

  it('should call authService.logout when logout is called', () => {
    component.logout();

    expect(authServiceSpy.logout).toHaveBeenCalled();
  });

  it('should call themeService.toggleDarkMode when toggleTheme is called', () => {
    component.toggleTheme();

    expect(themeServiceSpy.toggleDarkMode).toHaveBeenCalled();
  });

  it('should not display menu when currentUser is null', () => {
    authServiceSpy.getCurrentUser.and.returnValue(of(null));

    fixture.detectChanges();

    const menuTrigger = fixture.nativeElement.querySelector('#menu-trigger');
    expect(menuTrigger).toBeFalsy();
  });

  it('should display menu when currentUser is not null', () => {
    const mockUser: User = {
      id: '1',
      email: 'test@example.com',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: '2021-01-01',
    };
    authServiceSpy.getCurrentUser.and.returnValue(of(mockUser));

    fixture.detectChanges();

    const menuTrigger = fixture.nativeElement.querySelector('#menu-trigger');
    expect(menuTrigger).toBeTruthy();
  });
});
