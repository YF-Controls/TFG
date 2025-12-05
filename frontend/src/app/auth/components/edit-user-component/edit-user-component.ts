// System
import { Component, inject, input} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, tap } from 'rxjs';
// Other modules
import { FormFieldErrorComponent, SvgIconComponent } from '@shared/components';
import { ToastService } from '@shared/services';
// This module
import { User } from '@auth/interfaces';
import { UserApi } from '@auth/services';


@Component({
  standalone : true,
  selector: 'app-edit-user',
  imports: [TranslateModule, SvgIconComponent ,ReactiveFormsModule, FormFieldErrorComponent],
  templateUrl: './edit-user-component.html',
})
export class EditUserComponent { 
  
  // Injections
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
  
  protected user = rxResource<User, {userId: string}>({
    params: () => ({ userId: this.userId() }),
    stream: ({params}) => {
      this.form.disable();  
      return this.userApi.getOne(params.userId, {})
        .pipe(
          tap(user => {
            this.form.setValue({ // Set form values when loaded
              email: user.email,
              fullname: user.fullname,
              roles: user.roles,
              isActive: user.isActive,
            });
            this.form.enable(); // enable form
          }),
          catchError((error: HttpErrorResponse) => {
            this.toast.error(error.message, false); // Show toast
            this.dialogRef?.close(false); // Close dialog
            return [];
  }))}});

  // Methods
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
