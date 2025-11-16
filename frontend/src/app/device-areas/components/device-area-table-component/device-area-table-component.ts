// System
import { Component, inject, input, output } from '@angular/core';
import { NgClass } from '@angular/common';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
// Other modules
import { ConfirmComponent } from '@shared/components';
import { LanguageService } from '@shared/services';
import { DeviceAreasService } from '@device-areas/services';
// This module
import { DeviceArea } from '../../interfaces';
import { EditDeviceAreaComponent } from '../';


@Component({
  standalone: true,
  selector: 'app-device-area-table',
  imports: [NgClass],
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
  onUpdateOne (deviceArea: DeviceArea) {
    const dialogRef = this.dialog.open(EditDeviceAreaComponent, {
      disableClose: false,
      data: {deviceArea}
    });

    dialogRef.closed.subscribe((confirmed) => {
      if (confirmed) this.updateTable.emit();      
    });
  }
  
  onDeleteOne (deviceArea: DeviceArea) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      disableClose: true,
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this device area?'
      }
    });

    dialogRef.closed.subscribe((confirmed) => {
      if (!confirmed) return;
      // Delete
      this.deviceAreasService.delete(deviceArea.id)
        .subscribe( errorMessage => {
          // Error
          if (errorMessage) {
            this.toast.open(errorMessage, 'Close', { 
              duration: 3000,
              panelClass: ['toast-container-effect', 'toast-container-error'],
              horizontalPosition : 'center',
              verticalPosition : 'bottom',
            });
            return;
          }
          // Deleted!
          this.toast.open('Device area deleted successfully!', 'Close', { 
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
