// System
import { Component, inject, input } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
// Other modules
import { ToastService } from '@shared/services';
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
export class EditDeviceTypeComponent {
  
  // Injections
  protected readonly dialogData = inject(DIALOG_DATA, { optional: true });
  protected readonly dialogRef = inject(DialogRef, { optional: true });
  protected readonly toast = inject(ToastService);
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

  protected deviceType = rxResource<DeviceType, {deviceTypeId: string}> ({
    params: () => ({ deviceTypeId: this.deviceTypeId() }),
    stream: ({params}) => {
      // Disable form while loading
      this.form.disable();
      // Get
      return this.deviceTypeApi.getOne(params.deviceTypeId, {})
        .pipe(
          tap({
            next: (deviceType: DeviceType) => {
              this.form.setValue({
                name: deviceType.name,
                hwId: deviceType.hwId,
                description: deviceType.description,
                isActive: deviceType.isActive,
              });
              this.form.enable();
            },
            error: (error: HttpErrorResponse) => {
              this.toast.error(error.message, false);
              this.dialogRef?.close(false);
            }
          })
        );
    },
  });

  // Methods  
  protected onSubmit() {
    // Exit with toast if invalid form
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      // Toast
      this.toast.error('DEVICE_AREAS.EDIT_DEVICE_AREA.TOAST.FORM_ERROR');
      return;
    }
    // Get from data
    const { name = '', hwId = '', description = '', isActive = false} = this.form.value;
    // Send to api
    this.deviceTypeApi.updateOne(this.deviceTypeId(), { name, hwId, description, isActive })
      .subscribe( errorMessage => {
        // Error
        if (errorMessage) {
          this.toast.error(errorMessage, false);
          return;
        }
        // Done
        this.toast.success('DEVICE_TYPES.EDIT_DEVICE_TYPE.TOAST.SUCCESS');
        this.dialogRef?.close(true);
    });
  }

  protected onCancel() {
    this.dialogRef?.close(false);
  }
}
