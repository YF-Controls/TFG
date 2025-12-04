// System
import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
// Other modules
import { LanguageService } from '@shared/services';
import { FormFieldErrorComponent, SvgIconComponent } from '@shared/components';
// This module
import { UserApi } from '../../services';
import { AppPaths } from 'src/app/app.paths';


@Component({
  standalone : true,
  selector: 'app-login-user',
  imports: [RouterLink, TranslateModule, ReactiveFormsModule, FormFieldErrorComponent, SvgIconComponent],
  templateUrl: './login-user-component.html',
})
export class LoginUserComponent {

  // Injections
  protected readonly languageService = inject(LanguageService);
  protected readonly toast = inject(MatSnackBar);
  protected readonly fb = inject(FormBuilder);
  protected readonly userApi = inject(UserApi);
  protected readonly router = inject(Router);
    
  // Properties
  protected form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email ]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  showPassword = signal<boolean>(false);
  
  // Public Methods
  onSubmit () {
    // Check form and show toast
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      
      const message = this.languageService.translate('AUTH.LOGIN_USER.TOAST.FORM_ERROR');
      const action = this.languageService.translate('AUTH.LOGIN_USER.TOAST.CLOSE');

      this.toast.open(message, action, { 
        duration: 2000,
        panelClass: ['app-toast-container-effect', 'app-toast-container-error'],
        horizontalPosition : 'center',
        verticalPosition : 'bottom', 
      });
      return;
    }
    
    // Get form data
    const {email = '', password = ''} = this.form.value;
    
    // Send to api
    this.userApi.login({email, password})
      .subscribe(errorMessage => {
        
        if (errorMessage) {
        
          const action = this.languageService.translate('AUTH.LOGIN_USER.TOAST.CLOSE');

          this.toast.open(errorMessage, action, { 
            duration: 2000,
            panelClass: ['app-toast-container-effect', 'app-toast-container-error'],
            horizontalPosition : 'center',
            verticalPosition : 'bottom',
          });  
          return;
        }
        // Done
        const message = this.languageService.translate('AUTH.LOGIN_USER.TOAST.SUCCESS');
        const action = this.languageService.translate('AUTH.LOGIN_USER.TOAST.CLOSE');
        this.toast.open(message, action, { 
            duration: 2000,
            panelClass: ['app-toast-container-effect', 'app-toast-container-success'],
            horizontalPosition : 'center',
            verticalPosition : 'bottom',
          });
        
        this.router.navigateByUrl(AppPaths.DEVICES);
    });
  }
    
  toggleShowPassword () {
    this.showPassword.update(v => !v);
  }

}
