// System
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogRef } from '@angular/cdk/dialog';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import { LanguageService, ToastService } from '@shared/services';
import { FormFieldErrorComponent, SvgIconComponent } from '@shared/components';
// This module
import { UserApi } from '@auth/services';
import { User } from '@auth/interfaces';


@Component({
  standalone : true,
  selector: 'app-edit-user',
  imports: [TranslateModule, ReactiveFormsModule, FormFieldErrorComponent, SvgIconComponent],
  templateUrl: './edit-user-component.html',
})
export class EditUserComponent implements OnInit { 
  
  // Injections
  protected readonly languageService = inject(LanguageService);
  protected readonly dialogData = inject(DIALOG_DATA, { optional: true });
  protected readonly dialogRef = inject(DialogRef, { optional: true });
  protected readonly toast = inject(ToastService);
  protected readonly fb = inject(FormBuilder);
  protected readonly userApi = inject(UserApi);
  
  // IO
  userId = input<string>(this.dialogData.userId);

  // Properties
  protected readonly availableRoles = [
    { value: 'user', label: 'User' },
    { value: 'admin', label: 'Admin' }
  ];
  
  protected form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email ]],
    fullname: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
    roles: [[], [Validators.required, Validators.minLength(1)]],
    isActive: [true, [Validators.required]],
  });
  
  // Methods
  // Lifecycle
  ngOnInit(): void {

    this.userApi.getOne(this.userId(), {})
      .subscribe({
        next: (user: User) => {
          this.form.setValue({
            email: user.email,
            fullname: user.fullname,
            roles: user.roles,
            isActive: user.isActive,
          });
        },
        error: (error: HttpErrorResponse) => {
          // Toast & close
          this.toast.error(error.message, false);
          this.dialogRef?.close(true);
        }
      });
  }

  protected onSubmit () {
    // Exit with toast if invalid form
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.error('AUTH.EDIT_USER.TOAST.FORM_ERROR');
      return;
    }
    // Get form data
    const {email = '', fullname = '', roles = ['ROLE_USER'], isActive = false} = this.form.value;
    // Send to api
    this.userApi.updateOne(this.userId(), {email, fullname, roles, isActive})
      .subscribe(errorMessage => {
        // Error
        if (errorMessage) {
          this.toast.error(errorMessage, false);
          return;
        }
        // Success & close
        this.toast.success('AUTH.EDIT_USER.TOAST.SUCCESS');
        this.dialogRef?.close(true);
      });
  }
  
  protected onCancel() {
    this.dialogRef?.close(false);
  }

  protected toggleRole(role: string): void {
    const roles = this.form.get('roles')?.value || [];
    const index = roles.indexOf(role);
    
    if (index === -1) {
      roles.push(role);
    } else {
      roles.splice(index, 1);
    }
    
    this.form.patchValue({ roles });
    this.form.get('roles')?.markAsTouched();
  }

  protected hasRole(role: string): boolean {
    const roles = this.form.get('roles')?.value || [];
    return roles.includes(role);
  }
}
