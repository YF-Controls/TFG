import { Routes } from "@angular/router";
import { MainFrontLayoutComponent } from "./layouts";
import { DevicesPageComponent, DevicePageComponent, HomePageComponent, NotFoundPageComponent } from "./pages";


export const systemFrontRoutes: Routes = [
  {
    path : '',
    component: MainFrontLayoutComponent,
    children : [
      {path: '', component: HomePageComponent},
      {path: 'devices/:type', component: DevicesPageComponent},
      {path: 'device/:id', component: DevicePageComponent},
      {path: '**', component: NotFoundPageComponent},
    ],
  },
  {
    path : '**',
    redirectTo: '',
  },
];

export default systemFrontRoutes;