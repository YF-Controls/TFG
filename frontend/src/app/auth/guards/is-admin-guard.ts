// System
import { inject } from "@angular/core";
import { CanMatchFn, Route, Router, UrlSegment } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TranslateService } from "@ngx-translate/core";
// This module
import { UserApi, AuthStatus } from '@auth/services';
import { AppPaths } from "src/app/app.paths";


export const IsAdminGuard: CanMatchFn = async (
  route: Route,
  segements: UrlSegment[]
) => {
  // Injections
  const userApi = inject(UserApi);
  const toast = inject(MatSnackBar);
  const router = inject(Router);
  const translate = inject(TranslateService);

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
  
  // Check admin role
  if (!userApi.isAdmin()) {
    // Show toast
    const message = translate.instant('AUTH.IS_ADMIN_GUARD.TOAST.MESSAGE');
    const action = translate.instant('AUTH.IS_ADMIN_GUARD.TOAST.CLOSE');
    toast.open(message, action, { 
      duration: 3000,
      panelClass: ['app-toast-container-effect', 'app-toast-container-error'],
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
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