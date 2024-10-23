import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { AuthGuard } from './auth.guard';
import { User } from '@supabase/supabase-js';

describe('authGuard', () => {
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;
  let authGuard: AuthGuard;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'isAuthenticated']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    authGuard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(new AuthGuard(authServiceMock, routerMock)).toBeTruthy();
  });

  it('should redirect to /enter if user is not authenticated', () => {
    authServiceMock.getCurrentUser.and.returnValue(of(undefined));
    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/protected' } as RouterStateSnapshot;

    authGuard.canActivate(route, state).subscribe(canActivate => {
      expect(canActivate).toBeFalse();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/enter']);
    });
  });

  fit('should allow access to protected route if user is authenticated', () => {
    const mockUser: User = {
      id: '1',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString()
    };
    authServiceMock.getCurrentUser.and.returnValue(of(mockUser));
    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/protected' } as RouterStateSnapshot;

    authGuard.canActivate(route, state).subscribe(canActivate => {
      expect(canActivate).toBeTrue();
    });
  });
});
