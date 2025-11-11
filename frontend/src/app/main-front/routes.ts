// System
import { Routes } from "@angular/router";
// Other modules
import { IsUserGuard } from "@auth/guards";
// This module
import { MainFrontLayout } from "./layouts";
import { DevicesPage, HomePage, NotFoundPage } from "./pages";


export const systemFrontRoutes: Routes = [
  {
    path : '',
    component: MainFrontLayout,
    children : [
      {path: '', component: HomePage},
      {path: 'devices/:type', component: DevicesPage, canMatch : [IsUserGuard],},
      {path: '**', component: NotFoundPage},
    ],
  },
  {
    path : '**',
    redirectTo: '',
  },
];

export default systemFrontRoutes;