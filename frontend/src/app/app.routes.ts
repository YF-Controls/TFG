import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path : '',
    loadChildren: () => import('./main-front/main-front.routes'),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    // TODO: Guards
  },
  
];
