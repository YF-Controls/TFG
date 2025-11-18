// System
import { Routes } from '@angular/router';
// Other modules
import { CheckAuthenticationOnAuthdGuard } from '@auth/guards';


export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/routes'),
    canMatch : [CheckAuthenticationOnAuthdGuard,],
  },
  {
    path : 'admin',
    loadChildren : () => import('./admin-dashboard/routes'),
  },
  {
    path : '',
    loadChildren: () => import('./main-dashboard/routes'),
  },
];
