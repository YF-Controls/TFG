// System modules
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { rxResource } from '@angular/core/rxjs-interop';
// Other modules
import { ToastService } from '@shared/services';
import { FormFieldErrorComponent, SvgIconComponent } from '@shared/components';
import { FormUtils } from '@utils/form-utils';
import { DeviceAreaApi } from '@device-areas/services';
import { DeviceTypeApi } from '@device-types/services';
import { DeviceArea } from '@device-areas/interfaces';
import { DeviceType } from '@device-types/interfaces';
// This module
import { DeviceApi } from '@devices/services';



@Component({
  standalone: true,
  selector: 'app-create-device-component',
  imports: [TranslateModule, SvgIconComponent, ReactiveFormsModule, FormFieldErrorComponent],
  templateUrl: './create-device-component.html',
})
export class CreateDeviceComponent {

  // Injections
  protected readonly dialogData = inject(DIALOG_DATA, { optional: true });
  protected readonly dialogRef = inject(DialogRef, { optional: true });
  protected readonly toast = inject(ToastService);
  protected readonly deviceApi = inject(DeviceApi);
  protected readonly deviceAreaApi = inject(DeviceAreaApi);
  protected readonly deviceTypeApi = inject(DeviceTypeApi);
  protected readonly fb = inject(FormBuilder);
  
  // Properties
  protected deviceAreas = rxResource<DeviceArea[], null>({
    stream  : () => this.deviceAreaApi.getAll({orderBy: 'name', filterBy: ['isActive'], filterValue: ['true']}),
  });

  protected deviceTypes = rxResource<DeviceType[], null>({
    stream: () => this.deviceTypeApi.getAll({ orderBy: 'name', filterBy: ['isActive'], filterValue: ['true'] }),
  });
  
  protected form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    number: [0, [Validators.required, Validators.min(1), Validators.max(9999), FormUtils.isInteger]],
    description: ['....', [Validators.required, Validators.minLength(4)]],
    isActive: [true, [Validators.required]],
    deviceTypeId: ['', [Validators.required]],
    deviceAreaId: ['', [Validators.required]]
  });
  
  // Methods
  protected onSubmit () {
    // Exit with toast if invalid form
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.error('DEVICES.CREATE_DEVICE.TOAST.FORM_ERROR');
      return;
    }
    // Get from data
    const { name = '', number = 0, description = '', isActive = false, deviceTypeId = '', deviceAreaId = ''} = this.form.value;
    const numericNumber = Number(number);
    // Send to api
    this.deviceApi.create({ name, number: numericNumber, description, isActive, deviceTypeId, deviceAreaId })
      .subscribe( errorMessage => {
        // Error
        if (errorMessage) {
          this.toast.error(errorMessage, false);
          return;
        }
        // Done
        this.toast.success('DEVICES.CREATE_DEVICE.TOAST.SUCCESS');
        this.dialogRef?.close(true);
    });
  }

  protected onCancel () {
    this.dialogRef?.close(false);
  }

}
