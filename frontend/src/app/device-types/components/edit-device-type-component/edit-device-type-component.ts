// System
import { Component, inject, input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogRef } from '@angular/cdk/dialog';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import { LanguageService } from '@shared/services';
import { FormFieldErrorComponent, SvgIconComponent } from '@shared/components';
// This module
import { DeviceTypeApi } from '@device-types/services';
import { DeviceType } from '@device-types/interfaces';


@Component({
  standalone : true,
  selector: 'app-edit-device-type',
  imports: [TranslateModule, ReactiveFormsModule, FormFieldErrorComponent, SvgIconComponent],
  templateUrl: './edit-device-type-component.html',
})
export class EditDeviceTypeComponent implements OnInit {
  
  // Injections
  protected readonly languageService = inject(LanguageService);
  protected readonly dialogData = inject(DIALOG_DATA, { optional: true });
  protected readonly dialogRef = inject(DialogRef, { optional: true });
  protected readonly toast = inject(MatSnackBar);
  protected readonly fb = inject(FormBuilder);
  protected readonly deviceTypeApi = inject(DeviceTypeApi);
  
  // IO
  deviceTypeId = input<string>(this.dialogData.deviceTypeId);
  
  // Properties
  protected form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    hwId: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
    description: ['....', [Validators.required, Validators.minLength(4)]],
    isActive: [true, [Validators.required]],
  });

  // Methods  
  // Lifecycle
  ngOnInit(): void {

    this.deviceTypeApi.getOne(this.deviceTypeId(), {})
      .subscribe({
        next: (deviceType: DeviceType) => {
          this.form.setValue({
            name: deviceType.name,
            hwId: deviceType.hwId,
            description: deviceType.description,
            isActive: deviceType.isActive,
          });
        },
        error: (error: HttpErrorResponse) => {
          // Toast
          const message = error.message;
          const action = this.languageService.getTranslation('DEVICE_TYPES.EDIT_DEVICE_TYPE.TOAST.CLOSE');
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

  protected onSubmit() {
    // Exit with toast if invalid form
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      // Toast
      const message = this.languageService.getTranslation('DEVICE_AREAS.EDIT_DEVICE_AREA.TOAST.FORM_ERROR');
      const action = this.languageService.getTranslation('DEVICE_AREAS.EDIT_DEVICE_AREA.TOAST.CLOSE');
      this.toast.open(message, action, { 
        duration: 2000,
        panelClass: ['app-toast-container-effect', 'app-toast-container-error'],
        horizontalPosition : 'center',
        verticalPosition : 'bottom',
      });
      // Exit
      return;
    }
    // Get from data
    const { name = '', hwId = '', description = '', isActive = false} = this.form.value;
    // Send to api
    this.deviceTypeApi.updateOne(this.deviceTypeId(), { name, hwId, description, isActive })
      .subscribe( errorMessage => {
        // Error
        if (errorMessage) {
          const action = this.languageService.getTranslation('DEVICE_TYPES.EDIT_DEVICE_TYPE.TOAST.CLOSE');
          this.toast.open(errorMessage, action, { 
            duration: 2000,
            panelClass: ['app-toast-container-effect', 'app-toast-container-error'],
            horizontalPosition : 'center',
            verticalPosition : 'bottom',
          });
          return;
        }
        // Done
        const message = this.languageService.getTranslation('DEVICE_TYPES.EDIT_DEVICE_TYPE.TOAST.SUCCESS');
        const action = this.languageService.getTranslation('DEVICE_TYPES.EDIT_DEVICE_TYPE.TOAST.CLOSE');
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
}
