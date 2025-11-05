import { Routes } from '@angular/router';
import { CheckAuthenticationOnAuthdGuard } from './auth/guards';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    canMatch : [CheckAuthenticationOnAuthdGuard,],
  },
  {
    path : '',
    loadChildren: () => import('./main-front/main-front.routes'),
  },

  
];
