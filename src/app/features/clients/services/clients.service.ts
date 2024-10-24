import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { map, shareReplay, switchMap, tap, catchError } from 'rxjs/operators';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from '../../../core/auth/services/supabase.service';
import { AuthService } from '../../../core/auth/services/auth.service';
import { ErrorHandlerService } from '../../../shared/services/error-handler.service';
import { Client } from '../interface';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private supabase: SupabaseClient;
  private clientsSubject = new BehaviorSubject<Client[] | null>(null);
  private clients$: Observable<Client[]>;

  constructor(private supabaseService: SupabaseService, private authService: AuthService, private errorHandler: ErrorHandlerService) {
    this.supabase = this.supabaseService.getClient();

    this.clients$ = this.clientsSubject.pipe(
      switchMap(clients => clients ? of(clients) : this.fetchClients()),
      shareReplay(1)
    );
  }

  getClients(): Observable<Client[]> {
    return this.clients$;
  }

  getClientById(id: string): Observable<Client | null> {
    return this.clients$.pipe(
      map(clients => clients.find(client => client.id === id) ?? null),
      catchError(this.errorHandler.handleError<Client | null>('getClientById', null))
    );
  }

  getClient(id: string): Observable<Client | null> {
    return from(this.supabaseService.getClient().from('clients').select('*').eq('id', id).single()).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as Client;
      }),
      catchError(this.errorHandler.handleError<Client | null>('getClient', null))
    );
  }

  createClient(client: Omit<Client, 'id' | 'user_id'>): Observable<Client | null> {
    return this.authService.getCurrentUser().pipe(
      switchMap(user => {
        if (!user) {
          throw new Error('User not authenticated');
        }
        return from(this.supabase
          .from('clients')
          .insert({ ...client, user_id: user.id })
          .select()
          .single()
        );
      }),
      map(({ data, error }) => {
        if (error) throw error;
        return data as Client;
      }),
      tap(newClient => {
        const currentClients = this.clientsSubject.value;
        this.clientsSubject.next([...(currentClients || []), newClient]);
      }),
      catchError(this.errorHandler.handleError<Client | null>('createClient', null))
    );
  }

  updateClient(id: string, client: Partial<Client>): Observable<Client | null> {
    return from(this.supabase
      .from('clients')
      .update(client)
      .eq('id', id)
      .select()
      .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as Client;
      }),
      tap(updatedClient => {
        const currentClients = this.clientsSubject.value;
        if (currentClients) {
          const updatedClients = currentClients.map(c => 
            c.id === id ? { ...c, ...updatedClient } : c
          );
          this.clientsSubject.next(updatedClients);
        }
      }),
      catchError(this.errorHandler.handleError<Client | null>('updateClient', null))
    );
  }

  deleteClient(id: string): Observable<void> {
    return from(this.supabase.auth.getUser()).pipe(
      switchMap(({ data: { user } }) => {
        if (!user) throw new Error('No authenticated user');
        return this.supabase
          .from('clients')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);
      }),
      map(({ error }) => {
        if (error) throw error;
      }),
      tap(() => {
        const currentClients = this.clientsSubject.value;
        if (currentClients) {
          const updatedClients = currentClients.filter(c => c.id !== id);
          this.clientsSubject.next(updatedClients);
        }
      }),
      catchError(this.errorHandler.handleError<void>('deleteClient', undefined))
    );
  }

  private fetchClients(): Observable<Client[]> {
    return from(this.supabase.auth.getUser()).pipe(
      switchMap(({ data: { user } }) => {
        if (!user) return of(null);
        return this.supabase
          .from('clients')
          .select('*')
          .eq('user_id', user.id);
      }),
      map((response) => {
        if (!response) throw new Error('No response');
        const { data, error } = response;
        if (error) throw error;
        return data as Client[];
      }),
      tap(clients => {
        if (clients && !this.clientsSubject.value) {
          this.clientsSubject.next(clients);
        }
      }),
      catchError(error => {
        console.error('Error fetching clients:', error);
        return of([]);
      })
    );
  }
}
