// System
import { Component, inject, input} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, tap } from 'rxjs';
// Other modules
import { FormFieldErrorComponent, SvgIconComponent } from '@shared/components';
import { ToastService } from '@shared/services';
import { FormUtils } from '@utils/form-utils';
import { DeviceArea } from '@device-areas/interfaces';
import { DeviceAreaApi } from '@device-areas/services';
import { DeviceType } from '@device-types/interfaces';
import { DeviceTypeApi } from '@device-types/services';
// This module
import { Device } from '@devices/interfaces';
import { DeviceApi } from '@devices/services';



@Component({
  standalone : true,
  selector: 'app-edit-device-component',
  imports: [TranslateModule, SvgIconComponent, ReactiveFormsModule, FormFieldErrorComponent],
  templateUrl: './edit-device-component.html',
})
export class EditDeviceComponent {

  // Injections
  protected readonly dialogData = inject(DIALOG_DATA, { optional: true });
  protected readonly dialogRef = inject(DialogRef, { optional: true });
  protected readonly toast = inject(ToastService);
  protected readonly fb = inject(FormBuilder);
  protected readonly deviceApi = inject(DeviceApi);
  protected readonly deviceAreaApi = inject(DeviceAreaApi);
  protected readonly deviceTypeApi = inject(DeviceTypeApi);
  
  // IO
  deviceId = input<string>(this.dialogData.deviceId);

  // Properties
  protected form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    number: ['', [Validators.required, Validators.min(1), Validators.max(9999), FormUtils.isInteger]],
    description: ['', [Validators.required, Validators.minLength(4)]],
    isActive: [false, [Validators.required]],
    deviceTypeId: ['', [Validators.required]],
    deviceAreaId: ['', [Validators.required]]
  }); 
  
  protected deviceAreas = rxResource<DeviceArea[], null>({
    stream  : () => this.deviceAreaApi.getAll({orderBy: 'name', filterBy: ['isActive'], filterValue: ['true']})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.toast.error(error.message, false); // Show toast
          this.dialogRef?.close(false); // Close dialog
          return [];
        })
      )
  });

  protected deviceTypes = rxResource<DeviceType[], null>({
    stream: () => this.deviceTypeApi.getAll({ orderBy: 'name', filterBy: ['isActive'], filterValue: ['true'] })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.toast.error(error.message, false); // Show toast
          this.dialogRef?.close(false); // Close dialog
          return [];
        })
      )
  });
  
  protected device = rxResource<Device, {deviceId: string}> ({
    params: () => ({ deviceId: this.deviceId() }),
    stream: ({params}) => {
      this.form.disable(); // Disable form while loading
      return this.deviceApi.getOne(params.deviceId, {})
        .pipe(
          tap((device: Device) => {
            this.form.setValue({ // Set form values when loaded
              name: device.name,
              number: device.number,
              description: device.description,
              isActive: device.isActive,
              deviceTypeId: device.deviceTypeId,
              deviceAreaId: device.deviceAreaId
            });
            this.form.enable(); // enable form
          }),
          catchError((error: HttpErrorResponse) => {
            this.toast.error(error.message, false); // Show toast
            this.dialogRef?.close(false); // Close dialog
            return [];
  }))}});

  // Methods
  protected onSubmit() {
    // Exit with toast if invalid form
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.error('DEVICES.EDIT_DEVICE.TOAST.FORM_ERROR');
      return;
    }
    // Get form data
    const { name = '', number = 0, description = '', isActive = false, deviceTypeId = '', deviceAreaId = ''} = this.form.value;
    const numericNumber = Number(number);
    // Send to api
    this.deviceApi.updateOne(this.deviceId(), { name, number: numericNumber, description, isActive, deviceTypeId,  deviceAreaId })
      .subscribe( errorMessage => {
        // Error
        if (errorMessage) {
          this.toast.error(errorMessage, false);
          return;
        }
        // Done
        this.toast.success('DEVICES.EDIT_DEVICE.TOAST.SUCCESS');
        this.dialogRef?.close(true);
    });
  }

  protected onCancel() {
    this.dialogRef?.close(false);
  }

}
