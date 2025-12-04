// System
import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
// Other modules
import { AppPaths } from 'src/app/app.paths';
import { ToastService } from '@shared/services';
import { FormFieldErrorComponent, SvgIconComponent } from '@shared/components';
// This module
import { UserApi } from '@auth/services';


@Component({
  standalone : true,
  selector: 'app-register-user',
  imports: [RouterLink, ReactiveFormsModule, TranslateModule, FormFieldErrorComponent, SvgIconComponent],
  templateUrl: './register-user-component.html',
})
export class RegisterUserComponent { 
  
  // Injections
  protected readonly dialogData = inject(DIALOG_DATA, { optional: true });
  protected readonly dialogRef = inject(DialogRef, { optional: true });
  protected readonly toast = inject(ToastService);
  protected readonly fb = inject(FormBuilder);
  protected readonly userApi = inject(UserApi);
  protected readonly router = inject(Router);
  
  // Properties
  protected form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email ]],
    fullname: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
    password1: ['', [Validators.required, Validators.minLength(6)]],
    password2: ['', [Validators.required, Validators.minLength(6)]],
  });
  showPassword1 = signal<boolean>(false);
  showPassword2 = signal<boolean>(false);
  protected isPopup = signal<boolean>(!!this.dialogData?.isPopup);

  // Methods
  onSubmit () {
    // Check form and show toast
    if (this.form.invalid) {
      //this.form.markAllAsTouched();
      this.toast.error('AUTH.REGISTER_USER.TOAST.FORM_ERROR');
      return;
    }
    
    // Get form data
    const {email = '', fullname = '', password1 = '', password2 = ''} = this.form.value;

    if (password1 !== password2) {
      this.toast.error('AUTH.REGISTER_USER.TOAST.PASSWORD_MISMATCH');
      return;
    }
    
    // Send to api
    this.userApi.createOne({email, fullname, password: password1})
      .subscribe(errorMessage => {
        // Error
        if (errorMessage) {
          this.toast.error(errorMessage, false);
          return;
        }
        // Done
        this.toast.success('AUTH.REGISTER_USER.TOAST.SUCCESS');
        // Check if popup or full page
        if (this.isPopup()) {
          this.dialogRef?.close(true);
          return;
        }
        this.router.navigateByUrl(AppPaths.FULL_LOGIN);
      });
  }
  
  protected onCancel() {
    this.dialogRef?.close(false);
  }
  
  protected toggleShowPassword1 () {
    this.showPassword1.update(v => !v);
  }

  protected toggleShowPassword2 () {
    this.showPassword2.update(v => !v);
  }
      
}
