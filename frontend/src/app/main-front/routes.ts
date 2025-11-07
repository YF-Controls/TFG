import { Routes } from "@angular/router";
import { MainFrontLayout } from "./layouts";
import { DevicesPage, HomePage, NotFoundPage } from "./pages";
import { CheckAuthenticationOnDevicesGuard } from '../devices/guards';

export const systemFrontRoutes: Routes = [
  {
    path : '',
    component: MainFrontLayout,
    children : [
      {path: '', component: HomePage},
      {path: 'devices/:type', component: DevicesPage, canMatch : [CheckAuthenticationOnDevicesGuard],},
      {path: '**', component: NotFoundPage},
    ],
  },
  {
    path : '**',
    redirectTo: '',
  },
];

export default systemFrontRoutes;