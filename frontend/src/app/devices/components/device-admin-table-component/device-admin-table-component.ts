// System
import { Component, inject, input, output } from '@angular/core';
import { NgClass } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import { ConfirmComponent, SvgIconComponent } from '@shared/components';
import { LanguageService } from '@shared/services';
// This modules
import { EditDeviceComponent } from '@devices/components';
import { Device } from '@devices/interfaces';
import { DeviceApi } from '@devices/services';


@Component({
  standalone: true,
  selector: 'app-device-admin-table',
  imports: [TranslateModule, SvgIconComponent],
  templateUrl: './device-admin-table-component.html',
})
export class DeviceAdminTableComponent { 

  // Injections
  protected readonly languageService = inject(LanguageService);
  protected readonly dialog = inject(Dialog);
  protected readonly toast = inject(MatSnackBar);
  protected readonly deviceApi = inject(DeviceApi);
  
  // IO
  devices = input.required<Device[]>();
  updateTable = output();
  
  // Methods
  protected onUpdateOne (device: Device) {
    const dialogRef = this.dialog.open(EditDeviceComponent, {
      disableClose: false,
      data: {deviceId: device.id}
    });

    dialogRef.closed.subscribe((confirmed) => {
      if (confirmed) this.updateTable.emit();      
    });
  }
  
  protected onDeleteOne (device: Device) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      disableClose: true,
      data: {
        title: this.languageService.getTranslation('DEVICES.DEVICE_ADMIN_TABLE.DELETE_POPUP.TITLE'),
        message: this.languageService.getTranslation('DEVICES.DEVICE_ADMIN_TABLE.DELETE_POPUP.MESSAGE')
      }
    });
    
    dialogRef.closed.subscribe((confirmed) => {
      if (!confirmed) return;
      // Delete
      this.deviceApi.deleteOne(device.id)
        .subscribe( errorMessage => {
          // Error
          if (errorMessage) {
            const action = this.languageService.getTranslation('DEVICES.DEVICE_ADMIN_TABLE.TOAST.CLOSE');
            this.toast.open(errorMessage, action, { 
              duration: 3000,
              panelClass: ['app-toast-container-effect', 'app-toast-container-error'],
              horizontalPosition : 'center',
              verticalPosition : 'bottom',
            });
            return;
          }
          // Deleted!
          const message = this.languageService.getTranslation('DEVICES.DEVICE_ADMIN_TABLE.TOAST.DELETED');
          const action = this.languageService.getTranslation('DEVICES.DEVICE_ADMIN_TABLE.TOAST.CLOSE');
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
