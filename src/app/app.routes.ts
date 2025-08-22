import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'dashboard',
        canActivate: [authGuard],
        loadChildren: () => import('./pages/dashboard/dashboard.routes').then(m => m.routes)
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];
