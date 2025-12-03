// System
import { Routes } from "@angular/router";
// Other modules
import { IsUserGuard } from "@auth/guards";
// This module
import { MainDashboardLayout } from "./layouts";
import { DevicesControlPage } from "./pages";


export const mainDashboardRoutes: Routes = [
  {
    path : '',
    component: MainDashboardLayout,
    children : [
      {path: '', pathMatch: 'full', redirectTo: 'devices'},
      {path: 'devices', component: DevicesControlPage},
      {path: '**', redirectTo: 'devices'},
    ],
  },
];

export default mainDashboardRoutes;
