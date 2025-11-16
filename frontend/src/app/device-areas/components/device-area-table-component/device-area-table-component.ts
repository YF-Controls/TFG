// System
import { Component, inject, input, output } from '@angular/core';
import { NgClass } from '@angular/common';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import { ConfirmComponent } from '@shared/components';
import { LanguageService } from '@shared/services';
// This module
import { DeviceAreasService } from '../../services';
import { DeviceArea } from '../../interfaces';
import { EditDeviceAreaComponent } from '../';


@Component({
  standalone: true,
  selector: 'app-device-area-table',
  imports: [NgClass, TranslateModule],
  templateUrl: './device-area-table-component.html',
})
export class DeviceAreaTableComponent { 

  // Injections
  protected languageSerivce = inject(LanguageService);
  private dialog = inject(Dialog);
  private toast = inject(MatSnackBar);
  private deviceAreasService = inject(DeviceAreasService)

  // Properties
  deviceAreas = input.required<DeviceArea[]>();
  updateTable = output();
  
  // Methods
  protected onUpdateOne (deviceArea: DeviceArea) {
    const dialogRef = this.dialog.open(EditDeviceAreaComponent, {
      disableClose: false,
      data: {deviceArea}
    });

    dialogRef.closed.subscribe((confirmed) => {
      if (confirmed) this.updateTable.emit();      
    });
  }
  
  protected onDeleteOne (deviceArea: DeviceArea) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      disableClose: true,
      data: {
        title: this.languageSerivce.getTranslation('DEVICE_AREAS.DEVICE_AREA_TABLE.DELETE_POPUP.TITLE'),
        message: this.languageSerivce.getTranslation('DEVICE_AREAS.DEVICE_AREA_TABLE.DELETE_POPUP.MESSAGE')
      }
    });
    
    dialogRef.closed.subscribe((confirmed) => {
      if (!confirmed) return;
      // Delete
      this.deviceAreasService.delete(deviceArea.id)
        .subscribe( errorMessage => {
          // Error
          if (errorMessage) {
            const action = this.languageSerivce.getTranslation('DEVICE_AREAS.DEVICE_AREA_TABLE.TOAST.CLOSE');
            this.toast.open(errorMessage, action, { 
              duration: 3000,
              panelClass: ['toast-container-effect', 'toast-container-error'],
              horizontalPosition : 'center',
              verticalPosition : 'bottom',
            });
            return;
          }
          // Deleted!
          const message = this.languageSerivce.getTranslation('DEVICE_AREAS.DEVICE_AREA_TABLE.TOAST.DELETED');
          const action = this.languageSerivce.getTranslation('DEVICE_AREAS.DEVICE_AREA_TABLE.TOAST.CLOSE');
          this.toast.open(message, action, { 
            duration: 2000,
            panelClass: ['toast-container-effect', 'toast-container-success'],
            horizontalPosition : 'center',
            verticalPosition : 'bottom',
          });
          // Return
          this.updateTable.emit();
        });
    });
  }

}
