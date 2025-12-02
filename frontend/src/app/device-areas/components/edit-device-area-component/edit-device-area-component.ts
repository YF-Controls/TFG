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
import { DeviceAreaApi } from '@device-areas/services';
import { DeviceArea } from '@device-areas/interfaces';


@Component({
  standalone : true,
  selector: 'app-edit-device-area',
  imports: [TranslateModule, SvgIconComponent ,ReactiveFormsModule, FormFieldErrorComponent],
  templateUrl: './edit-device-area-component.html',
})
export class EditDeviceAreaComponent implements OnInit {
  
  // Injections
  protected languageService = inject(LanguageService);
  private dialogData = inject(DIALOG_DATA, { optional: true });
  private dialogRef = inject(DialogRef, { optional: true });
  private toast = inject(MatSnackBar);
  private fb = inject(FormBuilder);
  private deviceAreaApi = inject(DeviceAreaApi);
  
  // IO
  deviceAreaId = input<string>(this.dialogData.deviceAreaId);
  
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

    this.deviceAreaApi.getOne(this.deviceAreaId(), { withInactives: true })
      .subscribe(
        {
          next: (deviceArea: DeviceArea) => {
            this.form.setValue({
              name: deviceArea.name,
              hwId: deviceArea.hwId,
              description: deviceArea.description,
              isActive: deviceArea.isActive,
            });
          },
          error: (error: HttpErrorResponse) => {
            // Toast
            const message = error.message;
            const action = this.languageService.getTranslation('DEVICE_AREAS.EDIT_DEVICE_AREA.TOAST.CLOSE');
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
        }
      );
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
    // Get form data
    const { name = '', hwId = '', description = '', isActive = false} = this.form.value;
    // Send to api
    this.deviceAreaApi.updateOne(this.deviceAreaId(), { name, hwId, description, isActive })
      .subscribe( errorMessage => {
        // Error
        if (errorMessage) {
          const action = this.languageService.getTranslation('DEVICE_AREAS.EDIT_DEVICE_AREA.TOAST.CLOSE');
          this.toast.open(errorMessage, action, { 
            duration: 2000,
            panelClass: ['app-toast-container-effect', 'app-toast-container-error'],
            horizontalPosition : 'center',
            verticalPosition : 'bottom',
          });
          return;
        }
        // Done
        const message = this.languageService.getTranslation('DEVICE_AREAS.EDIT_DEVICE_AREA.TOAST.SUCCESS');
        const action = this.languageService.getTranslation('DEVICE_AREAS.EDIT_DEVICE_AREA.TOAST.CLOSE');
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
