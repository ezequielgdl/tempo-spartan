import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth/guards/auth.guard';

export const routes: Routes = [
    // Public routes
    {
        path: 'login',
        loadComponent: () => import('./features/auth/components/login/login/login.component').then(m => m.LoginComponent),
        canActivate: [AuthGuard]
    },
    // Private routes
    {
        path: 'user',
        loadComponent: () => import('./features/user/user/user.component').then(m => m.UserComponent),
        canActivate: [AuthGuard]
    },
    // Default route
    { path: '', redirectTo: '/user', pathMatch: 'full' },
    // Wildcard route
    { path: '**', redirectTo: '/user' },
];
