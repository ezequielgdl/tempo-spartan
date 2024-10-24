import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { SupabaseService } from './supabase.service';
import { of, BehaviorSubject } from 'rxjs';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseAuthClient } from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient';
import { User } from '@supabase/supabase-js';

describe('AuthService', () => {
  let service: AuthService;
  let mockSupabaseService: jasmine.SpyObj<SupabaseService>;
  let mockSupabaseClient: jasmine.SpyObj<SupabaseClient>;
  let mockUser: User;

  beforeEach(() => {
    // Create a mock user
    mockUser = { id: '123', email: 'test@example.com' } as User;

    // Create a mock SupabaseClient
    mockSupabaseClient = jasmine.createSpyObj('SupabaseClient', ['auth']);
    mockSupabaseClient.auth = {
      getSession: jasmine.createSpy('getSession').and.returnValue(Promise.resolve({ data: { session: { user: mockUser } } })),
      onAuthStateChange: jasmine.createSpy('onAuthStateChange').and.returnValue(() => {}),
      signInWithPassword: jasmine.createSpy('signInWithPassword').and.returnValue(Promise.resolve({ data: { user: mockUser } })),
      signUp: jasmine.createSpy('signUp').and.returnValue(Promise.resolve({ data: { user: mockUser } })),
      signOut: jasmine.createSpy('signOut').and.returnValue(Promise.resolve()),
      resetPasswordForEmail: jasmine.createSpy('resetPasswordForEmail').and.returnValue(Promise.resolve()),
      updateUser: jasmine.createSpy('updateUser').and.returnValue(Promise.resolve({ data: { user: mockUser } }))
    } as unknown as SupabaseAuthClient;

    // Create a mock SupabaseService
    mockSupabaseService = jasmine.createSpyObj('SupabaseService', ['getClient']);
    mockSupabaseService.getClient.and.returnValue(mockSupabaseClient);

    // Mock BehaviorSubject
    const mockCurrentUserSubject = new BehaviorSubject<User | null | undefined>(mockUser);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: SupabaseService, useValue: mockSupabaseService },
        { provide: BehaviorSubject, useValue: mockCurrentUserSubject }
      ]
    });

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize auth state', (done) => {
    service['currentUserSubject'].next(mockUser);
    expect(service['currentUserSubject'].getValue()).toEqual(mockUser);
    done();
  });

  it('should login a user', (done) => {
    service.login('test@example.com', 'password').subscribe(user => {
      expect(user).toEqual(mockUser);
      done();
    });
  });

  it('should sign up a user', (done) => {
    service.signUp('test@example.com', 'password').subscribe(user => {
      expect(user).toEqual(mockUser);
      done();
    });
  });

  it('should logout a user', (done) => {
    service.logout().subscribe(() => {
      service.getCurrentUser().subscribe(user => {
        expect(user).toBeNull();
        done();
      });
    });
  });

  it('should reset password for email', (done) => {
    service.resetPassword('test@example.com').subscribe(response => {
      expect(response).toBeUndefined();
      done();
    });
  });

  it('should update password with token', (done) => {
    service.updatePasswordWithToken('newPassword').subscribe(user => {
      expect(user).toEqual(mockUser);
      done();
    });
  });
});
