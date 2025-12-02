// System
import { Component, inject, input, output } from '@angular/core';
import { NgClass } from '@angular/common';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import { ConfirmComponent, SvgIconComponent } from '@shared/components';
import { LanguageService } from '@shared/services';
// This module
import { DeviceTypeApi } from '../../services';
import { DeviceType } from '../../interfaces';
import { EditDeviceTypeComponent } from '..';


@Component({
  standalone: true,
  selector: 'app-device-type-table',
  imports: [TranslateModule, SvgIconComponent],
  templateUrl: './device-type-table-component.html',
})
export class DeviceTypeTableComponent { 

  // Injections
  protected languageSerivce = inject(LanguageService);
  private dialog = inject(Dialog);
  private toast = inject(MatSnackBar);
  private deviceTypeApi = inject(DeviceTypeApi);

  // IO
  deviceTypes = input.required<DeviceType[]>();
  updateTable = output();
  
  // Methods
  protected onUpdateOne (deviceType: DeviceType) {
    const dialogRef = this.dialog.open(EditDeviceTypeComponent, {
      disableClose: false,
      data: {deviceTypeId: deviceType.id}
    });

    dialogRef.closed.subscribe((confirmed) => {
      if (confirmed) this.updateTable.emit();      
    });
  }
  
  protected onDeleteOne (deviceType: DeviceType) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      disableClose: true,
      data: {
        title: this.languageSerivce.getTranslation('DEVICE_TYPES.DEVICE_TYPE_TABLE.DELETE_POPUP.TITLE'),
        message: this.languageSerivce.getTranslation('DEVICE_TYPES.DEVICE_TYPE_TABLE.DELETE_POPUP.MESSAGE')
      }
    });
    
    dialogRef.closed.subscribe((confirmed) => {
      if (!confirmed) return;
      // Delete
      this.deviceTypeApi.delete(deviceType.id)
        .subscribe( errorMessage => {
          // Error
          if (errorMessage) {
            const action = this.languageSerivce.getTranslation('DEVICE_TYPES.DEVICE_TYPE_TABLE.TOAST.CLOSE');
            this.toast.open(errorMessage, action, { 
              duration: 3000,
              panelClass: ['app-toast-container-effect', 'app-toast-container-error'],
              horizontalPosition : 'center',
              verticalPosition : 'bottom',
            });
            return;
          }
          // Deleted!
          const message = this.languageSerivce.getTranslation('DEVICE_TYPES.DEVICE_TYPE_TABLE.TOAST.DELETED');
          const action = this.languageSerivce.getTranslation('DEVICE_TYPES.DEVICE_TYPE_TABLE.TOAST.CLOSE');
          this.toast.open(message, action, { 
            duration: 2000,
            panelClass: ['app-toast-container-effect', 'app-toast-container-success'],
            horizontalPosition : 'center',
            verticalPosition : 'bottom',
          });
          // Return
          this.updateTable.emit();
        });
    });
  }

}
