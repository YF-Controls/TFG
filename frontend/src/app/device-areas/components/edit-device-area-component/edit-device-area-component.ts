// System
import { Component, inject, input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogRef } from '@angular/cdk/dialog';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
// OtHer modules
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
  private dialogData = inject(DIALOG_DATA);
  private dialogRef = inject(DialogRef, { optional: true });
  private toast = inject(MatSnackBar);

  private fb = inject(FormBuilder);
  private deviceAreaApi = inject(DeviceAreaApi);
  
  // Properties
  protected form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    hwId: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(8)]],
    description: ['....', [Validators.required, Validators.minLength(4)]],
    isActive: [true, [Validators.required]],
  });

  deviceArea = input<DeviceArea>(this.dialogData.deviceArea);
  
  // Lifecycle
  ngOnInit(): void {
    this.form.setValue({
      name: this.deviceArea().name,
      hwId: this.deviceArea().hwId,
      description: this.deviceArea().description,
      isActive: this.deviceArea().isActive,
    });
  }

  // Methods
  protected onSubmit() {
    // Exit with toast if invalid form
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      // Toast
      const message = this.languageService.getTranslation('DEVICE_AREAS.EDIT_DEVICE_AREA.TOAST.FORM_ERROR');
      const action = this.languageService.getTranslation('DEVICE_AREAS.EDIT_DEVICE_AREA.TOAST.CLOSE');
      this.toast.open(message, action, { 
        duration: 2000,
        panelClass: ['toast-container-effect', 'toast-container-error'],
        horizontalPosition : 'center',
        verticalPosition : 'bottom',
      });
      // Exit
      return;
    }
    // Get form data
    const { name = '', hwId = '', description = '', isActive = false} = this.form.value;
    // Send to api
    this.deviceAreaApi.update(this.deviceArea().id, { name, hwId, description, isActive })
      .subscribe( errorMessage => {
        // Error
        if (errorMessage) {
          const action = this.languageService.getTranslation('DEVICE_AREAS.EDIT_DEVICE_AREA.TOAST.CLOSE');
          this.toast.open(errorMessage, action, { 
            duration: 2000,
            panelClass: ['toast-container-effect', 'toast-container-error'],
            horizontalPosition : 'center',
            verticalPosition : 'bottom',
          });
          return;
        }
        // Success
        const message = this.languageService.getTranslation('DEVICE_AREAS.EDIT_DEVICE_AREA.TOAST.SUCCESS');
        const action = this.languageService.getTranslation('DEVICE_AREAS.EDIT_DEVICE_AREA.TOAST.CLOSE');
        this.toast.open(message, action, { 
            duration: 2000,
            panelClass: ['toast-container-effect', 'toast-container-success'],
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
