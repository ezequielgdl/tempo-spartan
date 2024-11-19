import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth/guards/auth.guard';

export const routes: Routes = [
  // Public routes
  {
    path: 'enter',
    loadComponent: () =>
      import(
        './features/auth/components/sign-in-tabs/sign-in-tabs.component'
      ).then((m) => m.SignInTabsComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/home/home.component').then(
        (m) => m.HomeComponent
      ),
  },
  // Private routes
  {
    path: 'user',
    loadComponent: () =>
      import('./features/user/user/user.component').then(
        (m) => m.UserComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'clients',
    loadComponent: () =>
      import('./features/clients/clients/clients.component').then(
        (m) => m.ClientsComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'invoices',
    loadComponent: () =>
      import('./features/invoices/invoices/invoices.component').then(
        (m) => m.InvoicesComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'invoices/new',
    loadComponent: () =>
      import(
        './features/invoices/components/new-invoice/new-invoice.component'
      ).then((m) => m.NewInvoiceComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'invoices/edit/:id',
    loadComponent: () =>
      import(
        './features/invoices/components/edit-invoice/edit-invoice.component'
      ).then((m) => m.EditInvoiceComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'invoices/:id',
    loadComponent: () =>
      import(
        './features/invoices/components/single-invoice/single-invoice.component'
      ).then((m) => m.SingleInvoiceComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'analytics',
    loadComponent: () =>
      import('./features/analytics/analytics/analytics.component').then(
        (m) => m.AnalyticsComponent
      ),
    canActivate: [AuthGuard],
  },

  // Default route
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  // Wildcard route
  { path: '**', redirectTo: '/user' },
];
