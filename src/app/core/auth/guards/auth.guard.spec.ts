import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { of } from 'rxjs';

import { AuthGuard } from './auth.guard';

describe('authGuard', () => {
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) }
      ]
    });

    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(new AuthGuard(authServiceMock, router)).toBeTruthy();
  });
});
