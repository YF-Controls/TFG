// System
import { inject } from "@angular/core";
import { CanMatchFn, Route, Router, UrlSegment } from "@angular/router";
import { firstValueFrom } from "rxjs";
// This module
import { AuthApi } from '../services';


export const IsAdminGuard: CanMatchFn = async (
  route: Route,
  segements: UrlSegment[]
) => {

  const authApi = inject(AuthApi);
  const router = inject(Router);
  await firstValueFrom(authApi.checkStatus());
  
  if (!authApi.isAdmin()) {
    router.navigateByUrl('/auth/login');
    return false;
  }
  
  return true;

}