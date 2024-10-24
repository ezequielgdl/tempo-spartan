import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, from, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service'
import { ErrorHandlerService } from '../../../shared/services/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  private currentUserSubject: BehaviorSubject<User | null | undefined>;
  public currentUser$: Observable<User | null | undefined>;

  constructor(private supabaseService: SupabaseService, private errorHandlerService: ErrorHandlerService) {
    this.supabase = this.supabaseService.getClient();
    this.currentUserSubject = new BehaviorSubject<User | null | undefined>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    from(this.supabase.auth.getSession()).pipe(
      map(({ data }) => data?.session?.user ?? null),
      catchError(() => of(null))
    ).subscribe(user => this.currentUserSubject.next(user));

    this.supabase.auth.onAuthStateChange((_, session) => {
      this.currentUserSubject.next(session?.user ?? null);
    });
  }

  getCurrentUser(): Observable<User | null | undefined> {
    return this.currentUser$;
  }

  login(email: string, password: string): Observable<User | null> {
    return from(this.supabase.auth.signInWithPassword({ email, password })).pipe(
      map(({ data }) => data.user),
      tap(user => this.currentUserSubject.next(user)),
      catchError(this.errorHandlerService.handleError<User | null>('login', null))
    );
  }

  signUp(email: string, password: string): Observable<User | null> {
    return from(this.supabase.auth.signUp({ email, password })).pipe(
      map(({ data }) => data.user),
      tap(user => this.currentUserSubject.next(user)),
      catchError(this.errorHandlerService.handleError<User | null>('signUp', null))
    );
  }

  logout(): Observable<void> {
    return from(this.supabase.auth.signOut()).pipe(
      tap(() => {
        this.currentUserSubject.next(null);
        this.supabase.auth.onAuthStateChange((_, session) => {
          this.currentUserSubject.next(session?.user ?? null);
        });
      }),
      catchError(this.errorHandlerService.handleError<void>('logout', void 0)),
      map(() => void 0)
    );
  }

  resetPassword(email: string): Observable<any> {
    return from(this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    }));
  }

  updatePasswordWithToken(newPassword: string): Observable<User | null> {
    return from(this.supabase.auth.updateUser({ 
      password: newPassword 
    })).pipe(
      map(({ data }) => data.user),
      tap(user => {
        if (user) {
          this.currentUserSubject.next(user);
        }
      }),
      catchError(this.errorHandlerService.handleError<User | null>('updatePasswordWithToken', null))
    );
  }
}
