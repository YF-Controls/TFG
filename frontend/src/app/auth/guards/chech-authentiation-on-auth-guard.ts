// System
import { inject } from "@angular/core";
import { CanMatchFn, Route, Router, UrlSegment } from "@angular/router";
import { firstValueFrom } from "rxjs";
// This module
import { AuthApi } from '../services';


export const CheckAuthenticationOnAuthdGuard: CanMatchFn = async (
  route: Route,
  segements: UrlSegment[]
) => {

  const authApi = inject(AuthApi);
  const router = inject(Router);
  const status = await firstValueFrom(authApi.checkStatus());
  
  // If logged in, return to device/all
  if (!status) {
    router.navigateByUrl('/devices/all');
    return false;
  }

  // Can go to login
  return true;
}