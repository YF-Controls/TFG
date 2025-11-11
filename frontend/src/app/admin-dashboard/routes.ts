// System
import { Routes } from "@angular/router";
// Ohter modules
import { IsAdminGuard } from "@auth/guards";
// This module
import { AdminDashboardLayout } from "./layouts";
import {
  AdminDashboardPage,
  DeviceAdminPage, 
  DeviceAreaAdminPage,
  DeviceAreasAdminPage, 
  DevicesAdminPage,
  DeviceTypeAdminPage, 
  DeviceTypesAdminPage, 
  UserAdminPage, 
  UsersAdminPage } from "./pages";




export const adminDeashboardRouters: Routes = [
  {
    path : '',
    component : AdminDashboardLayout,
    canMatch : [IsAdminGuard],
    children : [
      {path : 'dashboard', component : AdminDashboardPage},
      {path : 'users', component : UsersAdminPage},
      {path : 'user/:id', component: UserAdminPage},
      {path : 'devices', component : DevicesAdminPage},
      {path : 'device/:id', component : DeviceAdminPage},
      {path : 'device-types', component : DeviceTypesAdminPage},
      {path : 'device-type/:id', component : DeviceTypeAdminPage},
      {path : 'device-areas', component : DeviceAreasAdminPage},
      {path : 'device-area/:id', component : DeviceAreaAdminPage},
      {path : '**', redirectTo : 'dashboard'}
    ]
  }
];

export default adminDeashboardRouters;
