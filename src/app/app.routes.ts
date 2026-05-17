import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Home } from './pages/home/home';
import { Dashboard } from './pages/dashboard/dashboard';
import { Convenios } from './pages/dashboard/convenios/convenios';
import { Empresas } from './pages/dashboard/empresas/empresas';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'convenios', pathMatch: 'full' },
      { path: 'convenios', component: Convenios },
      { path: 'empresas', component: Empresas },
    ],
  },
  { path: '**', redirectTo: '' },
];
