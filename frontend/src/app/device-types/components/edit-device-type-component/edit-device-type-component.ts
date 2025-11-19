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
  protected languageService = inject(LanguageService);
  private dialogData = inject(DIALOG_DATA);
  private dialogRef = inject(DialogRef, { optional: true });
  private toast = inject(MatSnackBar);

  private fb = inject(FormBuilder);
  private deviceTypeApi = inject(DeviceTypeApi);
  
  // Properties
  protected form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    hwId: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(8)]],
    description: ['....', [Validators.required, Validators.minLength(4)]],
    isActive: [true, [Validators.required]],
  });

  deviceType = input<DeviceType>(this.dialogData.deviceType);
  
  // Lifecycle
  ngOnInit(): void {
    this.form.setValue({
      name: this.deviceType().name,
      hwId: this.deviceType().hwId,
      description: this.deviceType().description,
      isActive: this.deviceType().isActive,
    });
  }

  // Methods
  protected onSubmit() {
    // Exit with toast if invalid form
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      
      const message = this.languageService.getTranslation('DEVICE_AREAS.EDIT_DEVICE_AREA.TOAST.FORM_ERROR');
      const action = this.languageService.getTranslation('DEVICE_AREAS.EDIT_DEVICE_AREA.TOAST.CLOSE');
      this.toast.open(message, action, { 
        duration: 2000,
        panelClass: ['toast-container-effect', 'toast-container-error'],
        horizontalPosition : 'center',
        verticalPosition : 'bottom',
      });

      return;
    }

    // Get from data
    const { name = '', hwId = '', description = '', isActive = false} = this.form.value;
    
    // Send to api
    this.deviceTypeApi.update(this.deviceType().id, { name, hwId, description, isActive })
      .subscribe( errorMessage => {
        // Error
        if (errorMessage) {
          const action = this.languageService.getTranslation('DEVICE_TYPES.EDIT_DEVICE_TYPE.TOAST.CLOSE');
          this.toast.open(errorMessage, action, { 
            duration: 2000,
            panelClass: ['toast-container-effect', 'toast-container-error'],
            horizontalPosition : 'center',
            verticalPosition : 'bottom',
          });
          return;
        }
        // created!
        const message = this.languageService.getTranslation('DEVICE_TYPES.EDIT_DEVICE_TYPE.TOAST.SUCCESS');
        const action = this.languageService.getTranslation('DEVICE_TYPES.EDIT_DEVICE_TYPE.TOAST.CLOSE');
        this.toast.open(message, action, { 
            duration: 2000,
            panelClass: ['toast-container-effect', 'toast-container-success'],
            horizontalPosition : 'center',
            verticalPosition : 'bottom',
          });
        
        this.dialogRef?.close(true);
    });
  }

  protected onCancel() {
    this.dialogRef?.close(false);
  }

}
