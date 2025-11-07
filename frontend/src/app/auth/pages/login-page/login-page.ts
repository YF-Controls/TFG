import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../../services';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login-page.html',
})
export class LoginPage {

  // Public Attributes/Properties
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  hasError = signal<boolean>(false);
  errorMessage = signal<string>('');
  isPosting = signal<boolean>(false);
  showPassword = signal<boolean>(false);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email ]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  // Constructor
  

  // Public Methods
  onSubmit () {
    // Check form and show toast
    if (this.loginForm.invalid) {
      this.errorToast('Not valid data!');
      return;
    }
    
    // Get form data
    const {email = '', password = ''} = this.loginForm.value;
    
    // Send to api
    this.authService.login({email, password})
      .subscribe(errorMessage => {
        if (!errorMessage) {
          this.router.navigateByUrl('/devices/all');
          return;
        }
        this.errorToast(`Login error: ${errorMessage}`);
      });
  }
  
  toggleShowPassword () {
    this.showPassword.update(v => !v);
  }

  isNotValidField (fieldName: string): boolean | null {
    return (this.loginForm.controls[fieldName] &&
           this.loginForm.controls[fieldName].touched); 
  }

  getFieldError (fieldName: string): string | null {

    if (!this.loginForm.controls[fieldName]) return null;

    const errors = this.loginForm.controls[fieldName].errors ?? {};

    for (const key of Object.keys(errors)) {
      
      switch(key) {
        case 'email':
          return 'Email required!';

        case 'required':
          return 'Required field!';

        case 'minlength':
          return `Min. length is ${errors['minlength'].requiredLength} chars!`;
      }
    }
    // Default
    return null;
  }

  errorToast(message: string) {
    this.errorMessage.set(message);
    this.hasError.set(true);
    setTimeout(()=> {this.hasError.set(false);}, 3000);
  }


}
