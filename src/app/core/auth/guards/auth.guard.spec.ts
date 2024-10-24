import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { AuthGuard } from './auth.guard';
import { User } from '@supabase/supabase-js';
import { fakeAsync, tick } from '@angular/core/testing';

describe('authGuard', () => {
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;
  let authGuard: AuthGuard;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'isLoggedIn']);
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

  it('should allow access to protected route if user is authenticated and navigate to user', fakeAsync(() => {
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
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    tick();

    // Test navigation to /user when trying to access /enter
    state.url = '/enter';
    authGuard.canActivate(route, state).subscribe(canActivate => {
      expect(canActivate).toBeFalse();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/user']);
    });

    tick();
  }));

  it('should redirect to enter if the user is not authenticated', fakeAsync(() => {
    authServiceMock.getCurrentUser.and.returnValue(of(null));
    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/protected' } as RouterStateSnapshot;

    authGuard.canActivate(route, state).subscribe(canActivate => {
      expect(canActivate).toBeFalse();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/enter']);
    });

    tick();
  }));
});
