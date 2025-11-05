import { Routes } from "@angular/router";
import { MainFrontLayoutComponent } from "./layouts";
import { DevicesPageComponent, HomePageComponent, NotFoundPageComponent } from "./pages";
import { CheckAuthenticationOnDevicesGuard } from '../devices/guards';

export const systemFrontRoutes: Routes = [
  {
    path : '',
    component: MainFrontLayoutComponent,
    children : [
      {path: '', component: HomePageComponent},
      {path: 'devices/:type', component: DevicesPageComponent, canMatch : [CheckAuthenticationOnDevicesGuard],},
      {path: '**', component: NotFoundPageComponent},
    ],
  },
  {
    path : '**',
    redirectTo: '',
  },
];

export default systemFrontRoutes;