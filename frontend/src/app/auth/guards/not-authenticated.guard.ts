import { inject } from "@angular/core";
import { CanMatchFn, Route, Router, UrlSegment } from "@angular/router";


import { AuthService } from '../services';
import { firstValueFrom } from "rxjs";

export const MyNotAuthenticatedGuard: CanMatchFn = async (
  route: Route,
  segements: UrlSegment[]
) => {

  const authService = inject(AuthService);
  const router = inject(Router);
  const isAuth = await firstValueFrom(authService.checkStatus());
  
  // If logged in, return to device/all
  if (isAuth) {
    router.navigateByUrl('/devices/all');
    return false;
  }

  // Can go to login
  return true;
}