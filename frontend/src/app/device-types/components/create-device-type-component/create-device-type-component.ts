// System
import { Component, inject, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogRef } from '@angular/cdk/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import { LanguageService } from '@shared/services';
import { FormFieldErrorComponent, SvgIconComponent } from '@shared/components';
import { DeviceTypeApi } from '@device-types/services';


@Component({
  standalone : true,
  selector: 'app-create-device-type',
  imports: [TranslateModule, ReactiveFormsModule, FormFieldErrorComponent, SvgIconComponent],
  templateUrl: './create-device-type-component.html',
})
export class CreateDeviceTypeComponent {

  // Injections
  protected readonly languageService = inject(LanguageService);
  protected readonly dialogRef = inject(DialogRef, { optional: true });
  protected readonly toast = inject(MatSnackBar);
  protected readonly deviceTypeApi = inject(DeviceTypeApi);
  protected readonly fb = inject(FormBuilder);
  
  
  // Properties
  protected form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    hwId: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
    description: ['....', [Validators.required, Validators.minLength(4)]],
    isActive: [true, [Validators.required]],
  });
  
  // Methods
  protected onSubmit() {
    // Exit with toast if invalid form
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      
      const message = this.languageService.getTranslation('DEVICE_TYPES.CREATE_DEVICE_TYPE.TOAST.FORM_ERROR');
      const action = this.languageService.getTranslation('DEVICE_TYPES.CREATE_DEVICE_TYPE.TOAST.CLOSE');
      this.toast.open(message, action, { 
        duration: 2000,
        panelClass: ['app-toast-container-effect', 'app-toast-container-error'],
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
            panelClass: ['app-toast-container-effect', 'app-toast-container-error'],
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
            panelClass: ['app-toast-container-effect', 'app-toast-container-success'],
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
