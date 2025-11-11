// System
import { inject } from "@angular/core";
import { CanMatchFn, Route, Router, UrlSegment } from "@angular/router";
import { firstValueFrom } from "rxjs";
// This module
import { AuthService } from '../services';


export const IsUserGuard: CanMatchFn = async (
  route: Route,
  segements: UrlSegment[]
) => {

  const authService = inject(AuthService);
  
  await firstValueFrom(authService.checkStatus());
  
  if (!authService.isUser()) {
    const router = inject(Router);
    router.navigateByUrl('/auth/login');
    return false;
  }

  return true;
}
