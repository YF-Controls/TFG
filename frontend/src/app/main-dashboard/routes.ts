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
      {path: '', pathMatch: 'full', redirectTo: 'devices'},
      {path: 'devices', component: DevicesPage},
      {path: '**', redirectTo: 'devices'},
    ],
  },
];

export default mainDashboardRoutes;
