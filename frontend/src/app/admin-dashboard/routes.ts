import { Routes } from "@angular/router";
import { AdminDashboardLayout } from "./layouts";
import { DeviceAdminPage, DeviceAreaAdminPage, DeviceAreasAdminPage, DevicesAdminPage, DeviceTypeAdminPage, DeviceTypesAdminPage, UserAdminPage, UsersAdminPage } from "./pages";


export const adminDeashboardRouters: Routes = [
  {
    path : '',
    component : AdminDashboardLayout,
    children : [
      {path : 'users', component : UsersAdminPage},
      {path : 'user/:id', component: UserAdminPage},
      {path : 'devices', component : DevicesAdminPage},
      {path : 'device/:id', component : DeviceAdminPage},
      {path : 'device-types', component : DeviceTypesAdminPage},
      {path : 'device-type/:id', component : DeviceTypeAdminPage},
      {path : 'device-areas', component : DeviceAreasAdminPage},
      {path : 'device-area/:id', component : DeviceAreaAdminPage},
      {path : '**', redirectTo : 'devices'}
    ]
  }
];

export default adminDeashboardRouters;
