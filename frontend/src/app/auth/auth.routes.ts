import { Routes } from '@angular/router';

import { AuthLayoutComponent } from './layout';
import { LoginPageComponent, RegisterPageComponent } from './pages';


export const authRoutes: Routes = [{
  path: '',
  component: AuthLayoutComponent,
  children: [
    { path: 'login', component: LoginPageComponent, },
    { path: 'register', component: RegisterPageComponent, },
    { path: '**', component: RegisterPageComponent, },
  ],
},];

export default authRoutes;