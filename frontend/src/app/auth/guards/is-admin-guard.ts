// System
import { inject } from "@angular/core";
import { CanMatchFn, Route, Router, UrlSegment } from "@angular/router";
import { firstValueFrom } from "rxjs";
// Other modules
import { AppPaths } from "src/app/app.paths";
import { ToastService } from "@shared/services";
// This module
import { UserApi, AuthStatus } from '@auth/services';


export const IsAdminGuard: CanMatchFn = async (
  route: Route,
  segements: UrlSegment[]
) => {
  // Injections
  const userApi = inject(UserApi);
  const toast = inject(ToastService);
  const router = inject(Router);
  
  // Get auth status
  try {
    await firstValueFrom(userApi.checkUser());
  } catch (error) {
    router.navigateByUrl(AppPaths.FULL_LOGIN);
    return false;
  }
  
  // Check authentication
  if (userApi.status() !== AuthStatus.authenticated) {
    router.navigateByUrl(AppPaths.FULL_LOGIN);
    return false;
  }
  
  console.log('!DELETE ME! IsAdminGuard - user roles:', userApi.user()?.roles);

  // Check admin role
  if (!userApi.isAdmin()) {
    // Show toast
    toast.error('AUTH.IS_ADMIN_GUARD.TOAST.MESSAGE');
    // Go to devices page
    setTimeout(() => {
      router.navigateByUrl(AppPaths.DEVICES);
    }, 100);
    // Return
    return false;
  }
  // All good
  return true;
};
