import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth/guards/auth.guard';

export const routes: Routes = [
    // Public routes
    {
        path: 'enter',
        loadComponent: () => import('./features/auth/components/sign-in-tabs/sign-in-tabs.component').then(m => m.SignInTabsComponent),
        canActivate: [AuthGuard]
    },
    // Private routes
    {
        path: 'user',
        loadComponent: () => import('./features/user/user/user.component').then(m => m.UserComponent),
        canActivate: [AuthGuard]
    },
    {
        path: 'clients',
        loadComponent: () => import('./features/clients/clients/clients.component').then(m => m.ClientsComponent),
        canActivate: [AuthGuard]
    },
    // Default route
    { path: '', redirectTo: '/enter', pathMatch: 'full' },
    // Wildcard route
    { path: '**', redirectTo: '/user' },
];
