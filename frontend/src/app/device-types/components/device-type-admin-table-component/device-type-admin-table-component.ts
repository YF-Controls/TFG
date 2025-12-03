// System
import { Component, inject, input, output } from '@angular/core';
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
  selector: 'app-device-type-admin-table',
  imports: [TranslateModule, SvgIconComponent],
  templateUrl: './device-type-admin-table-component.html',
})
export class DeviceTypeAdminTableComponent { 

  // Injections
  protected readonly languageService = inject(LanguageService);
  protected readonly dialog = inject(Dialog);
  protected readonly toast = inject(MatSnackBar);
  protected readonly deviceTypeApi = inject(DeviceTypeApi);

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
        title: this.languageService.getTranslation('DEVICE_TYPES.DEVICE_TYPE_TABLE.DELETE_POPUP.TITLE'),
        message: this.languageService.getTranslation('DEVICE_TYPES.DEVICE_TYPE_TABLE.DELETE_POPUP.MESSAGE')
      }
    });
    
    dialogRef.closed.subscribe((confirmed) => {
      if (!confirmed) return;
      // Delete
      this.deviceTypeApi.delete(deviceType.id)
        .subscribe( errorMessage => {
          // Error
          if (errorMessage) {
            const action = this.languageService.getTranslation('DEVICE_TYPES.DEVICE_TYPE_TABLE.TOAST.CLOSE');
            this.toast.open(errorMessage, action, { 
              duration: 3000,
              panelClass: ['app-toast-container-effect', 'app-toast-container-error'],
              horizontalPosition : 'center',
              verticalPosition : 'bottom',
            });
            return;
          }
          // Deleted!
          const message = this.languageService.getTranslation('DEVICE_TYPES.DEVICE_TYPE_TABLE.TOAST.DELETED');
          const action = this.languageService.getTranslation('DEVICE_TYPES.DEVICE_TYPE_TABLE.TOAST.CLOSE');
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
