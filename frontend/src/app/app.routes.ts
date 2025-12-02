// System
import { Routes } from '@angular/router';
// Other modules
import { IsAdminGuard, IsUserGuard } from '@auth/guards';


export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/routes'),
  },
  {
    path : 'admin',
    loadChildren : () => import('./admin-dashboard/routes'),
    canMatch : [IsAdminGuard],
  },
  {
    path : '',
    loadChildren: () => import('./main-dashboard/routes'),
    canMatch : [IsUserGuard],
  },
];
