// System
import { Component, inject, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogRef } from '@angular/cdk/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
// OtHer modules
import { LanguageService } from '@shared/services';
import { FormFieldErrorComponent } from '@shared/components';
import { DeviceTypeApi } from '@device-types/services';


@Component({
  standalone : true,
  selector: 'app-create-device-type',
  imports: [TranslateModule, ReactiveFormsModule, FormFieldErrorComponent],
  templateUrl: './create-device-type-component.html',
})
export class CreateDeviceTypeComponent {

  // Injections
  protected languageService = inject(LanguageService);
  private dialogRef = inject(DialogRef, { optional: true });
  private toast = inject(MatSnackBar);
  private deviceTypeApi = inject(DeviceTypeApi);
  private fb = inject(FormBuilder);
  
  
  // Properties
  protected form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    hwId: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(8)]],
    description: ['....', [Validators.required, Validators.minLength(4)]],
    isActive: [true, [Validators.required]],
  });
  
  // Methods
  protected onSubmit() {
    // Exit with toast if invalid form
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      
      const message = this.languageService.getTranslation('DEVICE_AREAS.CREATE_DEVICE_AREA.TOAST.FORM_ERROR');
      const action = this.languageService.getTranslation('DEVICE_AREAS.CREATE_DEVICE_AREA.TOAST.CLOSE');
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
    this.deviceTypeApi.create({ name, hwId, description, isActive })
      .subscribe( errorMessage => {
        // Error
        if (errorMessage) {
          const action = this.languageService.getTranslation('DEVICE_TYPES.CREATE_DEVICE_TYPE.TOAST.CLOSE');
          this.toast.open(errorMessage, action, { 
            duration: 2000,
            panelClass: ['toast-container-effect', 'toast-container-error'],
            horizontalPosition : 'center',
            verticalPosition : 'bottom',
          });
          return;
        }
        // created!
        const message = this.languageService.getTranslation('DEVICE_TYPES.CREATE_DEVICE_TYPE.TOAST.SUCCESS');
        const action = this.languageService.getTranslation('DEVICE_TYPES.CREATE_DEVICE_TYPE.TOAST.CLOSE');
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
