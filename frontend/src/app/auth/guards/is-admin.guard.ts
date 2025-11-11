// System
import { inject } from "@angular/core";
import { CanMatchFn, Route, Router, UrlSegment } from "@angular/router";
import { firstValueFrom } from "rxjs";
// This module
import { AuthService } from '../services';


export const IsAdminGuard: CanMatchFn = async (
  route: Route,
  segements: UrlSegment[]
) => {

  console.log('IsAdminGuard invoked');

  const authService = inject(AuthService);
  const router = inject(Router);

  const status = await firstValueFrom(authService.checkStatus());
  
  console.log('Auth status checked:', {status});

  if (!authService.isAdmin()) {
    router.navigateByUrl('/auth/login');
    return false;
  }
  
  return true;

}