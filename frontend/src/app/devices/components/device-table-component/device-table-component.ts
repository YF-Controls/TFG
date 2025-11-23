// System
import { Component, inject, input, output } from '@angular/core';
import { NgClass } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import { ConfirmComponent, SvgIconComponent } from '@shared/components';
import { LanguageService } from '@shared/services';
import { DeviceAreaApi } from '@device-areas/services';
import { DeviceArea } from '@device-areas/interfaces';
import { DeviceTypeApi } from '@device-types/services';
import { DeviceType } from '@device-types/interfaces';
// This modules
import { EditDeviceComponent } from '@devices/components';
import { Device } from '@devices/interfaces';
import { DeviceApi } from '@devices/services';


@Component({
  standalone: true,
  selector: 'app-device-table',
  imports: [NgClass, TranslateModule, SvgIconComponent],
  templateUrl: './device-table-component.html',
})
export class DeviceTableComponent { 

  // Injections
  protected languageSerivce = inject(LanguageService);
  private dialog = inject(Dialog);
  private toast = inject(MatSnackBar);
  private deviceApi = inject(DeviceApi);
  private deviceAreaApi = inject(DeviceAreaApi);
  private deviceTypeApi = inject(DeviceTypeApi);

  // Properties
  devices = input.required<Device[]>();
  deviceTypes = input.required<DeviceType[]>();
  deviceAreas = input.required<DeviceArea[]>();
  updateTable = output();
 
  // Methods
  protected onUpdateOne (device: Device) {
    const dialogRef = this.dialog.open(EditDeviceComponent, {
      disableClose: false,
      data: {device}
    });

    dialogRef.closed.subscribe((confirmed) => {
      if (confirmed) this.updateTable.emit();      
    });
  }
  
  protected onDeleteOne (device: Device) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      disableClose: true,
      data: {
        title: this.languageSerivce.getTranslation('DEVICES.DEVICE_TABLE.DELETE_POPUP.TITLE'),
        message: this.languageSerivce.getTranslation('DEVICES.DEVICE_TABLE.DELETE_POPUP.MESSAGE')
      }
    });
    
    dialogRef.closed.subscribe((confirmed) => {
      if (!confirmed) return;
      // Delete
      this.deviceApi.delete(device.id)
        .subscribe( errorMessage => {
          // Error
          if (errorMessage) {
            const action = this.languageSerivce.getTranslation('DEVICES.DEVICE_TABLE.TOAST.CLOSE');
            this.toast.open(errorMessage, action, { 
              duration: 3000,
              panelClass: ['app-toast-container-effect', 'app-toast-container-error'],
              horizontalPosition : 'center',
              verticalPosition : 'bottom',
            });
            return;
          }
          // Deleted!
          const message = this.languageSerivce.getTranslation('DEVICES.DEVICE_TABLE.TOAST.DELETED');
          const action = this.languageSerivce.getTranslation('DEVICES.DEVICE_TABLE.TOAST.CLOSE');
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
  
  protected getDeviceTypeName (id: string): string {
    const deviceType = this.deviceTypes().find(dt => dt.id === id);
    return deviceType ? deviceType.name : '?';
  }

  protected getDeviceAreaName (id: string): string {
    const deviceArea = this.deviceAreas().find(da => da.id === id);
    return deviceArea ? deviceArea.name : '?';
  }
}


