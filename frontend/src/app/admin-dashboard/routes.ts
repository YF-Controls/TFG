// System
import { Routes } from "@angular/router";
// Other modules
import { IsAdminGuard } from "@auth/guards";
// This module
import { AdminDashboardLayout } from "./layouts";
import {
  AdminDashboardPage,
  DeviceAreasAdminPage, 
  DevicesAdminPage,
  DeviceTypesAdminPage, 
  UsersAdminPage } from "./pages";




export const adminDeashboardRouters: Routes = [
  {
    path : '',
    component : AdminDashboardLayout,
    canMatch : [IsAdminGuard],
    children : [
      {path : 'dashboard', component : AdminDashboardPage},
      {path : 'users', component : UsersAdminPage},
      {path : 'devices', component : DevicesAdminPage},
      {path : 'device-types', component : DeviceTypesAdminPage},
      {path : 'device-areas', component : DeviceAreasAdminPage},
      {path : '**', redirectTo : 'dashboard'}
    ]
  }
];

export default adminDeashboardRouters;
