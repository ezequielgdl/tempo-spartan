import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { SupabaseService } from './supabase.service';
import { BehaviorSubject, of } from 'rxjs';
import { SupabaseClient, User } from '@supabase/supabase-js';

describe('AuthService', () => {
  let authService: AuthService;
  let mockSupabaseService: jasmine.SpyObj<SupabaseService>;
  let mockSupabaseClient: any;

  beforeEach(() => {
    mockSupabaseClient = {
      auth: {
        getSession: jasmine.createSpy('getSession').and.returnValue(Promise.resolve({ data: { session: null }, error: null })),
        onAuthStateChange: jasmine.createSpy('onAuthStateChange').and.returnValue({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: jasmine.createSpy('signInWithPassword'),
        signUp: jasmine.createSpy('signUp'),
        signOut: jasmine.createSpy('signOut'),
        resetPasswordForEmail: jasmine.createSpy('resetPasswordForEmail'),
        updateUser: jasmine.createSpy('updateUser')
      }
    };

    mockSupabaseService = jasmine.createSpyObj('SupabaseService', ['getClient']);
    mockSupabaseService.getClient.and.returnValue(mockSupabaseClient);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: SupabaseService, useValue: mockSupabaseService }
      ]
    });

    authService = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

});
