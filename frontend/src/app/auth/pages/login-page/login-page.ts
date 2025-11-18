// System
import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
// Other modules
import { LanguageService } from '@shared/services';
import { FormFieldErrorComponent } from '@shared/components';
// This module
import { AuthApi } from '../../services';


@Component({
  standalone : true,
  selector: 'app-login-page',
  imports: [RouterLink, TranslateModule, ReactiveFormsModule, FormFieldErrorComponent],
  templateUrl: './login-page.html',
})
export class LoginPage {

  // Injections
  protected languageService = inject(LanguageService);
  private toast = inject(MatSnackBar);

  private fb = inject(FormBuilder);
  private authApi = inject(AuthApi);
  router = inject(Router);
    
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
      
      const message = this.languageService.getTranslation('LOGIN_COMPONENT.TOAST.FORM_ERROR');
      const action = this.languageService.getTranslation('LOGIN_COMPONENT.TOAST.CLOSE');

      this.toast.open(message, action, { 
        duration: 2000,
        panelClass: ['toast-container-effect', 'toast-container-error'],
        horizontalPosition : 'center',
        verticalPosition : 'bottom',
      });
      return;
    }
    
    // Get form data
    const {email = '', password = ''} = this.form.value;
    
    // Send to api
    this.authApi.login({email, password})
      .subscribe(errorMessage => {
        
        if (errorMessage) {
        
          const action = this.languageService.getTranslation('LOGIN_COMPONENT.TOAST.CLOSE');

          this.toast.open(errorMessage, action, { 
            duration: 2000,
            panelClass: ['toast-container-effect', 'toast-container-error'],
            horizontalPosition : 'center',
            verticalPosition : 'bottom',
          });  
          return;
        }
        // Done
        const message = this.languageService.getTranslation('LOGIN_COMPONENT.TOAST.LOGIN_SUCCESS');
        const action = this.languageService.getTranslation('LOGIN_COMPONENT.TOAST.CLOSE');
        this.toast.open(message, action, { 
            duration: 2000,
            panelClass: ['toast-container-effect', 'toast-container-success'],
            horizontalPosition : 'center',
            verticalPosition : 'bottom',
          });
        
        this.router.navigateByUrl('/devices/all');
    });
  }
    
  toggleShowPassword () {
    this.showPassword.update(v => !v);
  }

}
