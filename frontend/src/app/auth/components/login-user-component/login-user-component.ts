// System
import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import { AppPaths } from 'src/app/app.paths';
import { LanguageService, ToastService } from '@shared/services';
import { FormFieldErrorComponent, SvgIconComponent } from '@shared/components';
// This module
import { UserApi } from '@auth/services';


@Component({
  standalone : true,
  selector: 'app-login-user',
  imports: [RouterLink, TranslateModule, ReactiveFormsModule, FormFieldErrorComponent, SvgIconComponent],
  templateUrl: './login-user-component.html',
})
export class LoginUserComponent {

  // Injections
  protected readonly languageService = inject(LanguageService);
  protected readonly toast = inject(ToastService);
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
      this.toast.error('AUTH.LOGIN_USER.TOAST.FORM_ERROR');
      return;
    }
    
    // Get form data
    const {email = '', password = ''} = this.form.value;
    
    // Send to api
    this.userApi.login({email, password})
      .subscribe(errorMessage => {
        // Error          
        if (errorMessage) {
          this.toast.error(errorMessage, false);
          return;
        }
        // Done
        this.toast.success('AUTH.LOGIN_USER.TOAST.SUCCESS');
        this.router.navigateByUrl(AppPaths.DEVICES);
    });
  }
    
  toggleShowPassword () {
    this.showPassword.update(value => !value);
  }

}
