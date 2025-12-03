// System
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogRef } from '@angular/cdk/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import { LanguageService } from '@shared/services';
import { FormFieldErrorComponent, SvgIconComponent } from '@shared/components';
import { DeviceAreaApi } from '@device-areas/services';


@Component({
  standalone : true,
  selector: 'app-create-device-area',
  imports: [TranslateModule, SvgIconComponent, ReactiveFormsModule, FormFieldErrorComponent],
  templateUrl: './create-device-area-component.html',
})
export class CreateDeviceAreaComponent {

  // Injections
  protected readonly languageService = inject(LanguageService);
  protected readonly dialogRef = inject(DialogRef, { optional: true });
  protected readonly toast = inject(MatSnackBar);
  protected readonly deviceAreaApi = inject(DeviceAreaApi);
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
      
      const message = this.languageService.getTranslation('DEVICE_AREAS.CREATE_DEVICE_AREA.TOAST.FORM_ERROR');
      const action = this.languageService.getTranslation('DEVICE_AREAS.CREATE_DEVICE_AREA.TOAST.CLOSE');
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
    this.deviceAreaApi.createOne({ name, hwId, description, isActive })
      .subscribe( errorMessage => {
        // Error
        if (errorMessage) {
          const action = this.languageService.getTranslation('DEVICE_AREAS.CREATE_DEVICE_AREA.TOAST.CLOSE');
          this.toast.open(errorMessage, action, { 
            duration: 2000,
            panelClass: ['app-toast-container-effect', 'app-toast-container-error'],
            horizontalPosition : 'center',
            verticalPosition : 'bottom',
          });
          return;
        }
        // created!
        const message = this.languageService.getTranslation('DEVICE_AREAS.CREATE_DEVICE_AREA.TOAST.SUCCESS');
        const action = this.languageService.getTranslation('DEVICE_AREAS.CREATE_DEVICE_AREA.TOAST.CLOSE');
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
