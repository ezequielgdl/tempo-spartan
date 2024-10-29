import { Injectable } from '@angular/core';
import { SupabaseService } from '../../../core/auth/services/supabase.service';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { AuthService } from '../../../core/auth/services/auth.service';
import { ErrorHandlerService } from '../../../shared/services/error-handler.service';
import { Invoice } from '../interface';
import { BehaviorSubject, catchError, from, map, Observable, of, shareReplay, switchMap, tap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class InvoicesServiceService {
  private supabase: SupabaseClient;
  private invoicesSubject = new BehaviorSubject<Invoice[] | null>(null);
  public invoices$: Observable<Invoice[] | null>;

  constructor(private supabaseService: SupabaseService, private authService: AuthService, private errorHandler: ErrorHandlerService) {
    this.supabase = supabaseService.getClient();
    this.invoices$ = this.invoicesSubject.asObservable().pipe(
      switchMap(invoices => {
        if (invoices === null) {
          return this.fetchInvoices();
        }
        return of(invoices);
      }),
      shareReplay(1)
    );
   }

   public fetchInvoices(): Observable<Invoice[] | null> {
    return from(this.supabase.auth.getUser()).pipe(
      switchMap(({ data: { user } }) => {
        if (!user) return of(null);
        return this.supabase
          .from('invoices')
          .select('*')
          .eq('user_id', user.id);
      }),
      map((response) => {
        if (!response) throw new Error('No response');
        const { data, error } = response;
        if (error) throw error;
        return data as Invoice[];
      }),
      tap(invoices => {
        if (invoices && !this.invoicesSubject.value) {
          this.invoicesSubject.next(invoices);
        }
      }),
      catchError(this.errorHandler.handleError<Invoice[] | null>('fetchInvoices', null))
    );
  }

  getInvoiceById(id: string): Observable<Invoice | null> {
    return this.invoices$.pipe(
      map(invoices => invoices?.find(invoice => invoice.id === id) ?? null),
      catchError(this.errorHandler.handleError<Invoice | null>('getInvoiceById', null))
    );
  }

  createInvoice(invoice: Omit<Invoice, 'id' | 'user_id'>): Observable<Invoice | null> {
    return this.authService.getCurrentUser().pipe(
      switchMap(user => {
        if (!user) {
          throw new Error('User not authenticated');
        }
        return from(this.supabase
          .from('invoices')
          .insert({ ...invoice, user_id: user.id })
          .select('*')
          .single()
        );
      }),
      map(({ data, error }) => {
        if (error) throw error;
        return data as Invoice;
      }),
      tap(newInvoice => {
        if (this.invoicesSubject.value === null) {
          this.fetchInvoices().subscribe();
        } else {
          const currentInvoices = this.invoicesSubject.value;
          this.invoicesSubject.next([...currentInvoices, newInvoice]);
        }
      }),
      catchError(this.errorHandler.handleError<Invoice | null>('createInvoice', null))
    );
  }

  updateInvoice(invoice: Invoice): Observable<Invoice | null> {
    return this.authService.getCurrentUser().pipe(
      switchMap(user => {
        if (!user) throw new Error('User not authenticated');
        return from(this.supabase
          .from('invoices')
          .update(invoice)
          .eq('id', invoice.id)
          .eq('user_id', user.id)
        );
      }),
      map(({ data, error }) => {
        if (error) throw error;
        return data as Invoice | null;
      }),
      tap(updatedInvoice => {
        if (updatedInvoice === null) return;
        const currentInvoices = this.invoicesSubject.value;
        if (currentInvoices) {
          const updatedInvoices = currentInvoices.map(i => i.id === updatedInvoice.id ? updatedInvoice : i);
          this.invoicesSubject.next(updatedInvoices);
        }
      }),
      catchError(this.errorHandler.handleError<Invoice | null>('updateInvoice', null))
    );
  }

  deleteInvoice(id: string): Observable<void> {
    return from(this.supabase.auth.getUser()).pipe(
      switchMap(({ data: { user } }) => {
        if (!user) throw new Error('No authenticated user');
        return this.supabase
          .from('invoices')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);
      }),
      map(({ error }) => {
        if (error) throw error;
      }),
      tap(() => {
        const currentInvoices = this.invoicesSubject.value;
        if (currentInvoices) {
          const updatedInvoices = currentInvoices.filter(i => i.id !== id);
          this.invoicesSubject.next(updatedInvoices);
        }
      }),
      catchError(this.errorHandler.handleError<void>('deleteInvoice', undefined))
    );
  }
}
