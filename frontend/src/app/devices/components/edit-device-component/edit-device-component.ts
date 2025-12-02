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
import { Device } from '@devices/interfaces';



@Component({
  standalone : true,
  selector: 'app-edit-device-component',
  imports: [TranslateModule, SvgIconComponent, ReactiveFormsModule, FormFieldErrorComponent],
  templateUrl: './edit-device-component.html',
})
export class EditDeviceComponent implements OnInit {

  // Injections
  protected languageService = inject(LanguageService);
  private dialogData = inject(DIALOG_DATA, { optional: true });
  private dialogRef = inject(DialogRef, { optional: true });
  private toast = inject(MatSnackBar);
  private fb = inject(FormBuilder);
  private deviceApi = inject(DeviceApi);
  private deviceAreaApi = inject(DeviceAreaApi);
  private deviceTypeApi = inject(DeviceTypeApi);

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
  
  // Lifecycle
  ngOnInit(): void {

    this.loadDeviceAreas();
    this.loadDeviceTypes();
    this.deviceApi.getOne(this.deviceId(), { withInactives: true })
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
            // Close dialog
            this.dialogRef?.close(true);
          },
        }
      );
  }

  // Methods
  protected onSubmit() {
    // Exit with toast if invalid form
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      // Toast
      const message = this.languageService.getTranslation('DEVICES.EDIT_DEVICE.TOAST.FORM_ERROR');
      const action = this.languageService.getTranslation('DEVICES.EDIT_DEVICE.TOAST.CLOSE');
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
    this.deviceApi.update(this.deviceId(), { name, number: numericNumber, description, isActive, deviceTypeId,  deviceAreaId })
      .subscribe( errorMessage => {
        // Error
        if (errorMessage) {
          const action = this.languageService.getTranslation('DEVICES.EDIT_DEVICE.TOAST.CLOSE');
          this.toast.open(errorMessage, action, { 
            duration: 2000,
            panelClass: ['app-toast-container-effect', 'app-toast-container-error'],
            horizontalPosition : 'center',
            verticalPosition : 'bottom',
          });
          return;
        }
        // Success
        const message = this.languageService.getTranslation('DEVICES.EDIT_DEVICE.TOAST.SUCCESS');
        const action = this.languageService.getTranslation('DEVICES.EDIT_DEVICE.TOAST.CLOSE');
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
          const action = this.languageService.getTranslation('DEVICES.EDIT_DEVICE.TOAST.CLOSE');

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
          const action = this.languageService.getTranslation('DEVICES.EDIT_DEVICE.TOAST.CLOSE');
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
