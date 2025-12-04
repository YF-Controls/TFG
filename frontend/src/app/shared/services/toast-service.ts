// System
import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
// This module
import { LanguageService } from './language.service';

/*
// Toast Types
export const ToastType = {
  success: 'success',
  info: 'info',
  warning: 'warning',
  error: 'error',
} as const;
export type ToastTypes = typeof ToastType[keyof typeof ToastType];
*/

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  // Injections
  protected readonly languageService = inject(LanguageService);
  protected readonly snackbar = inject(MatSnackBar);

  // Methods
  public success(message: string, autoTranslate: boolean = true, duration: number = 3000): void {
    console.log('!DELETE ha pasado por ToastService success', message);
    if (autoTranslate) message = this.languageService.translation(message);
    this.snackbar.open(message, 'X', {
      duration,
      panelClass: ['app-toast-container-effect', 'app-toast-container-success'],
      horizontalPosition : 'center',
      verticalPosition : 'bottom',
    })
  }

  public info(message: string, autoTranslate: boolean = true, duration: number = 3000): void {
    console.log('!DELETE ha pasado por ToastService info', message);
    if (autoTranslate) message = this.languageService.translation(message);
    this.snackbar.open(message, 'X', {
      duration,
      panelClass: ['app-toast-container-effect', 'app-toast-container-info'],
      horizontalPosition : 'center',
      verticalPosition : 'bottom',
    })
  }
  
  public warning(message: string, autoTranslate: boolean = true, duration: number = 3000): void {
    console.log('!DELETE ha pasado por ToastService warning', message);
    if (autoTranslate) message = this.languageService.translation(message);
    this.snackbar.open(message, 'X', {
      duration,
      panelClass: ['app-toast-container-effect', 'app-toast-container-warning'],
      horizontalPosition : 'center',
      verticalPosition : 'bottom',
    })
  }

  public error(message: string, autoTranslate: boolean = true, duration: number = 3000): void {
    console.log('!DELETE ha pasado por ToastService error', message);
    if (autoTranslate) message = this.languageService.translation(message);
    this.snackbar.open(message, 'X', {
      duration,
      panelClass: ['app-toast-container-effect', 'app-toast-container-error'],
      horizontalPosition : 'center',
      verticalPosition : 'bottom',
    })
  }

}