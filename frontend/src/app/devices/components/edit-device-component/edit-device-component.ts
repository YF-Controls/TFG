// System
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogRef } from '@angular/cdk/dialog';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import { LanguageService } from '@shared/services';
import { FormFieldErrorComponent, SvgIconComponent } from '@shared/components';
import { FormUtils } from '@utils/form-utils';
import { DeviceArea } from '@device-areas/interfaces';
import { DeviceAreaApi } from '@device-areas/services';
import { DeviceType } from '@device-types/interfaces';
import { DeviceTypeApi } from '@device-types/services';
// This module
import { DeviceApi } from '@devices/services';


@Component({
  standalone : true,
  selector: 'app-edit-device-component',
  imports: [TranslateModule, SvgIconComponent, ReactiveFormsModule, FormFieldErrorComponent],
  templateUrl: './edit-device-component.html',
})
export class EditDeviceComponent implements OnInit {

  // Injections
  protected readonly languageService = inject(LanguageService);
  protected readonly dialogData = inject(DIALOG_DATA, { optional: true });
  protected readonly dialogRef = inject(DialogRef, { optional: true });
  protected readonly toast = inject(MatSnackBar);
  protected readonly fb = inject(FormBuilder);
  protected readonly deviceApi = inject(DeviceApi);
  protected readonly deviceAreaApi = inject(DeviceAreaApi);
  protected readonly deviceTypeApi = inject(DeviceTypeApi);
  
  // IO
  deviceId = input<string>(this.dialogData.deviceId);

  // Properties
  protected deviceAreas = signal<DeviceArea[]>([]);
  protected deviceTypes = signal<DeviceType[]>([]);
  
  protected form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    number: [0, [Validators.required, Validators.min(1), Validators.max(9999), FormUtils.isInteger]],
    description: ['....', [Validators.required, Validators.minLength(4)]],
    isActive: [true, [Validators.required]],
    deviceTypeId: ['', [Validators.required]],
    deviceAreaId: ['', [Validators.required]]
  }); 
  
  // Methods
  // Lifecycle
  ngOnInit(): void {

    this.loadDeviceAreas();
    this.loadDeviceTypes();
    this.deviceApi.getOne(this.deviceId(), {})
      .subscribe(
        {
          next: (device) => {
            this.form.setValue({
              name: device.name,
              number: device.number,
              description: device.description,
              isActive: device.isActive,
              deviceTypeId: device.deviceTypeId,
              deviceAreaId: device.deviceAreaId,
            });
          },
          error: (error: HttpErrorResponse) => {
            // Toast
            const message = error.message;
            const action = this.languageService.translate('DEVICES.EDIT_DEVICE.TOAST.CLOSE');
            this.toast.open(message, action, { 
              duration: 2000,
              panelClass: ['app-toast-container-effect', 'app-toast-container-error'],
              horizontalPosition : 'center',
              verticalPosition : 'bottom',
            });
            // Close dialog
            if (this.dialogRef)
              this.dialogRef.close(true);
          },
        }
      );
  }
  
  protected onSubmit() {
    // Exit with toast if invalid form
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      // Toast
      const message = this.languageService.translate('DEVICES.EDIT_DEVICE.TOAST.FORM_ERROR');
      const action = this.languageService.translate('DEVICES.EDIT_DEVICE.TOAST.CLOSE');
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
    const { name = '', number = 0, description = '', isActive = false, deviceTypeId = '', deviceAreaId = ''} = this.form.value;
    const numericNumber = Number(number);
    
    // Send to api
    this.deviceApi.updateOne(this.deviceId(), { name, number: numericNumber, description, isActive, deviceTypeId,  deviceAreaId })
      .subscribe( errorMessage => {
        // Error
        if (errorMessage) {
          const action = this.languageService.translate('DEVICES.EDIT_DEVICE.TOAST.CLOSE');
          this.toast.open(errorMessage, action, { 
            duration: 2000,
            panelClass: ['app-toast-container-effect', 'app-toast-container-error'],
            horizontalPosition : 'center',
            verticalPosition : 'bottom',
          });
          return;
        }
        // Success
        const message = this.languageService.translate('DEVICES.EDIT_DEVICE.TOAST.SUCCESS');
        const action = this.languageService.translate('DEVICES.EDIT_DEVICE.TOAST.CLOSE');
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

  private loadDeviceAreas(): void {
    this.deviceAreaApi.getAll({})
      .subscribe({
        next: (areas) => this.deviceAreas.set(areas),
        error: (error: HttpErrorResponse) => {

          const message = error.message;
          const action = this.languageService.translate('DEVICES.EDIT_DEVICE.TOAST.CLOSE');

          this.toast.open(message, action, {
            duration: 2000,
            panelClass: ['app-toast-container-effect', 'app-toast-container-error'],
            horizontalPosition : 'center',
            verticalPosition : 'bottom',
          });
        }
      });
  }

  private loadDeviceTypes(): void {
    this.deviceTypeApi.getAll({})
      .subscribe({
        next: (types) => this.deviceTypes.set(types),
        error: (error : HttpErrorResponse) => {
          const message = error.message;
          const action = this.languageService.translate('DEVICES.EDIT_DEVICE.TOAST.CLOSE');
          this.toast.open(message, action, {
            duration: 2000,
            panelClass: ['app-toast-container-effect', 'app-toast-container-error'],
            horizontalPosition : 'center',
            verticalPosition : 'bottom',
          });
        }
      });
  }
}
