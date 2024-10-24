import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { SupabaseService } from './supabase.service';
import { of, throwError } from 'rxjs';
import { User } from '@supabase/supabase-js';
import { SupabaseClient } from '@supabase/supabase-js';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    
    TestBed.configureTestingModule({

    });
    authService = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

});
