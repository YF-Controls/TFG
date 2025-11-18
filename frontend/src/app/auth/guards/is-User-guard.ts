// System
import { inject } from "@angular/core";
import { CanMatchFn, Route, Router, UrlSegment } from "@angular/router";
import { firstValueFrom } from "rxjs";
// This module
import { AuthApi } from '../services';


export const IsUserGuard: CanMatchFn = async (
  route: Route,
  segements: UrlSegment[]
) => {

  const authApi = inject(AuthApi);
  
  await firstValueFrom(authApi.checkStatus());
  
  if (!authApi.isUser()) {
    const router = inject(Router);
    router.navigateByUrl('/auth/login');
    return false;
  }

  return true;
}
