// System modules
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogRef } from '@angular/cdk/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import { LanguageService } from '@shared/services';
import { FormFieldErrorComponent, SvgIconComponent } from '@shared/components';
import { FormUtils } from '@utils/form-utils';
import { DeviceAreaApi } from '@device-areas/services';
import { DeviceTypeApi } from '@device-types/services';
import { DeviceArea } from '@device-areas/interfaces';
import { DeviceType } from '@device-types/interfaces';
// This module
import { DeviceApi } from '@devices/services';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  standalone: true,
  selector: 'app-create-device-component',
  imports: [TranslateModule, SvgIconComponent, ReactiveFormsModule, FormFieldErrorComponent],
  templateUrl: './create-device-component.html',
})
export class CreateDeviceComponent implements OnInit {

  // Injections
  protected readonly languageService = inject(LanguageService);
  protected readonly dialogRef = inject(DialogRef, { optional: true });
  protected readonly toast = inject(MatSnackBar);
  protected readonly deviceApi = inject(DeviceApi);
  protected readonly deviceAreaApi = inject(DeviceAreaApi);
  protected readonly deviceTypeApi = inject(DeviceTypeApi);
  protected readonly fb = inject(FormBuilder);
  
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
  }

  // Methods
  protected onSubmit () {
    // Exit with toast if invalid form
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      
      const message = this.languageService.translate('DEVICES.CREATE_DEVICE.TOAST.FORM_ERROR');
      const action = this.languageService.translate('DEVICES.CREATE_DEVICE.TOAST.CLOSE');
      this.toast.open(message, action, { 
        duration: 2000,
        panelClass: ['app-toast-container-effect', 'app-toast-container-error'],
        horizontalPosition : 'center',
        verticalPosition : 'bottom',
      });

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
          const action = this.languageService.translate('DEVICES.CREATE_DEVICE.TOAST.CLOSE');
          this.toast.open(errorMessage, action, { 
            duration: 10000,
            panelClass: ['app-toast-container-effect', 'app-toast-container-error'],
            horizontalPosition : 'right',
            verticalPosition : 'bottom',
          });
          return;
        }
        // created!
        const message = this.languageService.translate('DEVICES.CREATE_DEVICE.TOAST.SUCCESS');
        const action = this.languageService.translate('DEVICES.CREATE_DEVICE.TOAST.CLOSE');
        this.toast.open(message, action, { 
            duration: 2000,
            panelClass: ['app-toast-container-effect', 'app-toast-container-success'],
            horizontalPosition : 'center',
            verticalPosition : 'bottom',
          });
        
        this.dialogRef?.close(true);
    });
  }

  protected onCancel () {
    this.dialogRef?.close(false);
  }

  private loadDeviceAreas(): void {
    this.deviceAreaApi.getAll({filterBy: ['isActive'], filterValue: ['true'], orderBy: 'name'})
      .subscribe({
        next: (areas) => this.deviceAreas.set(areas),
        error: (error: HttpErrorResponse) => {

          const message = error.message;
          const action = this.languageService.translate('DEVICES.CREATE_DEVICE.TOAST.CLOSE');

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
    this.deviceTypeApi.getAll({filterBy: ['isActive'], filterValue: ['true'], orderBy: 'name' })
      .subscribe({
        next: (types) => this.deviceTypes.set(types),
        error: (error : HttpErrorResponse) => {
          const message = error.message;
          const action = this.languageService.translate('DEVICES.CREATE_DEVICE.TOAST.CLOSE');
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
