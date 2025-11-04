import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../../services';

@Component({
  selector: 'register-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent { 
  
  // Public Attributes/Properties
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  hasError = signal<boolean>(false);
  errorMessage = signal<string>('');
  isPosting = signal<boolean>(false);
  showPassword1 = signal<boolean>(false);
  showPassword2 = signal<boolean>(false);

  registerForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email ]],
    fullname: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
    password1: ['', [Validators.required, Validators.minLength(6)]],
    password2: ['', [Validators.required, Validators.minLength(6)]],
  });

  // Constructor


  // Public Methods
  onSubmit () {
    // Check form and show toast
    if (this.registerForm.invalid) {
      this.errorToast('Not valid data!');
      return;
    }
    
    // Get form data
    const {email = '', password = '', fullname = ''} = this.registerForm.value;
    // Send to api
    this.authService.register(email, fullname, password)
      .subscribe(isAuthenticated => {
        if (isAuthenticated) {
          this.router.navigateByUrl('/auth/login');
          return;
        }
        this.errorToast('Register error');
      });
  }
  
  toggleShowPassword1 () {
    const v: boolean = this.showPassword1();
    this.showPassword1.set(!v);
  }

  toggleShowPassword2 () {
    const v: boolean = this.showPassword2();
    this.showPassword2.set(!v);
  }

  isNotValidField (fieldName: string): boolean | null {
    return (this.registerForm.controls[fieldName] &&
           this.registerForm.controls[fieldName].touched); 
  }

  getFieldError (fieldName: string): string | null {

    if (!this.registerForm.controls[fieldName]) return null;

    const errors = this.registerForm.controls[fieldName].errors ?? {};

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
