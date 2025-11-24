// System
import { Routes } from "@angular/router";
// Other modules
import { IsUserGuard } from "@auth/guards";
// This module
import { MainDashboardLayout } from "./layouts";
import { DevicesPage, HomePage, NotFoundPage } from "./pages";


export const mainDashboardRoutes: Routes = [
  {
    path : '',
    component: MainDashboardLayout,
    children : [
      {path: '', component: HomePage},
      {path: 'devices', component: DevicesPage, canMatch : [IsUserGuard],},
      {path: '**', component: NotFoundPage},
    ],
  },
  {
    path : '**',
    redirectTo: '',
  },
];

export default mainDashboardRoutes;
