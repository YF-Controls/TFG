import { inject } from "@angular/core";
import { CanMatchFn, Route, Router, UrlSegment } from "@angular/router";


import { AuthService } from '../../auth/services';
import { firstValueFrom } from "rxjs";

export const CheckAuthenticationOnDevicesGuard: CanMatchFn = async (
  route: Route,
  segements: UrlSegment[]
) => {

  const authService = inject(AuthService);
  const router = inject(Router);
  const status = await firstValueFrom(authService.checkStatus());
  
  console.log('!DELETE status >', {status});

  // If logged in, return to device/all
  if (status) {
    router.navigateByUrl('/auth/login');
    return false;
  }
  
  // Can go to login
  return true;
}