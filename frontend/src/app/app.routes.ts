import { Routes } from '@angular/router';
import { MyNotAuthenticatedGuard } from './auth/guards';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    canMatch : [MyNotAuthenticatedGuard,],
  },
  {
    path : '',
    loadChildren: () => import('./main-front/main-front.routes'),
  },

  
];
