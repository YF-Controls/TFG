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
import { AuthService } from '../../services';


@Component({
  standalone : true,
  selector: 'app-register-page',
  imports: [RouterLink, ReactiveFormsModule, TranslateModule, FormFieldErrorComponent],
  templateUrl: './register-page.html',
})
export class RegisterPage { 
  
  // Injections
  protected languageService = inject(LanguageService);
  private toast = inject(MatSnackBar);

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  router = inject(Router);

  // Properties
  protected form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email ]],
    fullname: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
    password1: ['', [Validators.required, Validators.minLength(6)]],
    password2: ['', [Validators.required, Validators.minLength(6)]],
  });
  showPassword1 = signal<boolean>(false);
  showPassword2 = signal<boolean>(false);
  
  // Methods
  onSubmit () {
    // Check form and show toast
    if (this.form.invalid) {
      
      const message = this.languageService.getTranslation('REGISTER_COMPONENT.TOAST.FORM_ERROR');
      const action = this.languageService.getTranslation('REGISTER_COMPONENT.TOAST.CLOSE');

      this.toast.open(message, action, { 
        duration: 2000,
        panelClass: ['toast-container-effect', 'toast-container-error'],
        horizontalPosition : 'center',
        verticalPosition : 'bottom',
      });
      return;
    }
    
    // Get form data
    const {email = '', fullname = '', password1 = '', password2 = ''} = this.form.value;

    if (password1 !== password2) {
      const message = this.languageService.getTranslation('REGISTER_COMPONENT.TOAST.PASSWORD_MISMATCH');
      const action = this.languageService.getTranslation('REGISTER_COMPONENT.TOAST.CLOSE');

      this.toast.open(message, action, { 
        duration: 2000,
        panelClass: ['toast-container-effect', 'toast-container-error'],
        horizontalPosition : 'center',
        verticalPosition : 'bottom',
      });
      return;
    }
    
    // Send to api
    this.authService.register({email, fullname, password: password1})
      .subscribe(errorMessage => {
        if (errorMessage) {
          
          const action = this.languageService.getTranslation('REGISTER_COMPONENT.TOAST.CLOSE');

          this.toast.open(errorMessage, action, { 
            duration: 2000,
            panelClass: ['toast-container-effect', 'toast-container-error'],
            horizontalPosition : 'center',
            verticalPosition : 'bottom',
          });  
          return;
        }
        // Done
        const message = this.languageService.getTranslation('REGISTER_COMPONENT.TOAST.REGISTER_SUCCESS');
        const action = this.languageService.getTranslation('REGISTER_COMPONENT.TOAST.CLOSE');
        this.toast.open(message, action, { 
            duration: 2000,
            panelClass: ['toast-container-effect', 'toast-container-success'],
            horizontalPosition : 'center',
            verticalPosition : 'bottom',
          });
        
        this.router.navigateByUrl('/auth/login');
      });
  }
  
  toggleShowPassword1 () {
    this.showPassword1.update(v => !v);
  }

  toggleShowPassword2 () {
    this.showPassword2.update(v => !v);
  }
      
}
