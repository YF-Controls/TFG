import { Routes } from '@angular/router';

import { AuthLayout } from './layout';
import { LoginPage, RegisterPage } from './pages';


export const authRoutes: Routes = [
  {
    path: '',
    component: AuthLayout,
    children: [
      { path: 'login', component: LoginPage, },
      { path: 'register', component: RegisterPage, },
      { path: '**', component: RegisterPage, },
    ],
  },
];

export default authRoutes;