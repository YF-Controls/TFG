// System
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogRef } from '@angular/cdk/dialog';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import { LanguageService } from '@shared/services';
import { FormFieldErrorComponent, SvgIconComponent } from '@shared/components';
// This module
import { UserApi } from '../../services';
import { User } from '@auth/interfaces';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  standalone : true,
  selector: 'app-edit-user',
  imports: [TranslateModule, ReactiveFormsModule, FormFieldErrorComponent, SvgIconComponent, SvgIconComponent],
  templateUrl: './edit-user-component.html',
})
export class EditUserComponent implements OnInit { 
  
  // Injections
  protected languageService = inject(LanguageService);
  private dialogData = inject(DIALOG_DATA, { optional: true });
  private dialogRef = inject(DialogRef, { optional: true });
  private toast = inject(MatSnackBar);
  private fb = inject(FormBuilder);
  private userApi = inject(UserApi);
  
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

    this.userApi.getOne(this.userId(), { withInactives: true })
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
          // Toast
          const message = error.message;
          const action = this.languageService.getTranslation('AUTH.EDIT_USER.TOAST.CLOSE');
          this.toast.open(message, action, { 
            duration: 2000,
            panelClass: ['app-toast-container-effect', 'app-toast-container-error'],
            horizontalPosition : 'center',
            verticalPosition : 'bottom',
          });
        
          // Close dialog
          if (this.dialogRef)
            this.dialogRef.close(true);
        }
      });
  }

  protected onSubmit () {
    // Exit with toast if invalid form
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      // Toast
      const message = this.languageService.getTranslation('AUTH.EDIT_USER.TOAST.FORM_ERROR');
      const action = this.languageService.getTranslation('AUTH.EDIT_USER.TOAST.CLOSE');
      this.toast.open(message, action, { 
        duration: 2000,
        panelClass: ['app-toast-container-effect', 'app-toast-container-error'],
        horizontalPosition : 'center',
        verticalPosition : 'bottom',
      });
      // Exit
      return;
    }
    // Get form data
    const {email = '', fullname = '', roles = ['ROLE_USER'], isActive = false} = this.form.value;
    // Send to api
    this.userApi.updateOne(this.userId(), {email, fullname, roles, isActive})
      .subscribe(errorMessage => {
        // Error
        if (errorMessage) {
          const action = this.languageService.getTranslation('AUTH.EDIT_USER.TOAST.CLOSE');
          this.toast.open(errorMessage, action, { 
            duration: 2000,
            panelClass: ['app-toast-container-effect', 'app-toast-container-error'],
            horizontalPosition : 'center',
            verticalPosition : 'bottom',
          });  
          return;
        }
        // Success
        const message = this.languageService.getTranslation('AUTH.EDIT_USER.TOAST.SUCCESS');
        const action = this.languageService.getTranslation('AUTH.EDIT_USER.TOAST.CLOSE');
        this.toast.open(message, action, { 
            duration: 2000,
            panelClass: ['app-toast-container-effect', 'app-toast-container-success'],
            horizontalPosition : 'center',
            verticalPosition : 'bottom',
          });
        // Close dialog
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
