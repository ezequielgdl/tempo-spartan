import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'user',
        loadComponent: () => import('./features/user/user/user.component').then(m => m.UserComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/components/login/login/login.component').then(m => m.LoginComponent)
    },
    { path: '**', redirectTo: '' }
];
