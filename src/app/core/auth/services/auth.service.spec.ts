import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { SupabaseService } from './supabase.service';
import { SupabaseClient } from '@supabase/supabase-js';
import { of } from 'rxjs';

describe('AuthService', () => {
  let authService: AuthService;
  let mockSupabaseService: jasmine.SpyObj<SupabaseService>;
  let mockSupabaseClient: any; // Using 'any' to avoid TypeScript errors with our mock

  beforeEach(() => {
    // Create a more comprehensive mock for SupabaseClient
    mockSupabaseClient = {
      auth: jasmine.createSpyObj('auth', [
        'getSession',
        'signInWithPassword',
        'signUp',
        'signOut',
        'onAuthStateChange',
        'resetPasswordForEmail',
        'updateUser'
      ])
    };

    // Set up default responses for the auth methods
    mockSupabaseClient.auth.getSession.and.returnValue(Promise.resolve({ data: { session: null }, error: null }));
    mockSupabaseClient.auth.signInWithPassword.and.returnValue(Promise.resolve({ data: { user: null }, error: null }));
    mockSupabaseClient.auth.signUp.and.returnValue(Promise.resolve({ data: { user: null }, error: null }));
    mockSupabaseClient.auth.signOut.and.returnValue(Promise.resolve({ error: null }));
    mockSupabaseClient.auth.onAuthStateChange.and.callFake((callback: any) => {
      // Simulate the callback being called
      callback('SIGNED_IN', { user: null });
      // Return a mock unsubscribe function
      return { data: { subscription: { unsubscribe: () => {} } } };
    });

    // Create mock for SupabaseService
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

  // Add more tests here
});
