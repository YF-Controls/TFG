// System
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import { ToastService } from '@shared/services';
import { FormFieldErrorComponent, SvgIconComponent } from '@shared/components';
// This module
import { DeviceAreaApi } from '@device-areas/services';


@Component({
  standalone : true,
  selector: 'app-create-device-area',
  imports: [TranslateModule, SvgIconComponent, ReactiveFormsModule, FormFieldErrorComponent],
  templateUrl: './create-device-area-component.html',
})
export class CreateDeviceAreaComponent {

  // Injections
  protected readonly dialogData = inject(DIALOG_DATA, { optional: true });
  protected readonly dialogRef = inject(DialogRef, { optional: true });
  protected readonly toast = inject(ToastService);
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
      this.toast.error('DEVICE_AREAS.CREATE_DEVICE_AREA.TOAST.FORM_ERROR');
      return;
    }
    // Get from data
    const { name = '', hwId = '', description = '', isActive = false} = this.form.value;
    // Send to api
    this.deviceAreaApi.createOne({ name, hwId, description, isActive })
      .subscribe( errorMessage => {
        // Error
        if (errorMessage) {
          this.toast.error(errorMessage, false);
          return;
        }
        // Done
        this.toast.success('DEVICE_AREAS.CREATE_DEVICE_AREA.TOAST.SUCCESS');
        this.dialogRef?.close(true);
    });
  }

  protected onCancel() {
    this.dialogRef?.close(false);
  }
}
