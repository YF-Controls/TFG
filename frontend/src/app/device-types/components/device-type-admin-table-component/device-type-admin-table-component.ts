// System
import { Component, inject, output } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs/internal/operators/tap';
import { Dialog } from '@angular/cdk/dialog';
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
  totalChanged = output<number>();
  
    // Properties
  public deviceTypes = rxResource<DeviceType[], []>({
    stream: () => {
      
      return this.deviceTypeApi.getAll({
        orderBy: 'name',
        //limit: null,
        offset: 0
      }).pipe(tap(deviceTypes => this.totalChanged.emit(deviceTypes.length)));
    },
  });

  // Methods
  public updateTable(): void {
    this.deviceTypes.reload();
  }

  protected onUpdateOne (deviceType: DeviceType) {
    // Open popup
    const dialogRef = this.dialog.open(EditDeviceTypeComponent, {
      disableClose: false,
      data: { isPopup: true, deviceTypeId: deviceType.id}
    });
    // After closed
    dialogRef.closed.subscribe((confirmed) => {
      if (confirmed) this.updateTable();      
    });
  }
  
  protected onDeleteOne (deviceType: DeviceType) {
    // Confirm popup
    const dialogRef = this.dialog.open(ConfirmComponent, {
      disableClose: false,
      data: {
        isPopup: true,
        title: this.languageService.getTranslation('DEVICE_TYPES.DEVICE_TYPE_ADMIN_TABLE.DELETE_POPUP.TITLE'),
        message: this.languageService.getTranslation('DEVICE_TYPES.DEVICE_TYPE_ADMIN_TABLE.DELETE_POPUP.MESSAGE')
      }
    });
    // After closed
    dialogRef.closed.subscribe((confirmed) => {
      if (!confirmed) return;
      // Delete
      this.deviceTypeApi.delete(deviceType.id)
        .subscribe( errorMessage => {
          // Error
          if (errorMessage) {
            const action = this.languageService.getTranslation('DEVICE_TYPES.DEVICE_TYPE_ADMIN_TABLE.TOAST.CLOSE');
            this.toast.open(errorMessage, action, { 
              duration: 3000,
              panelClass: ['app-toast-container-effect', 'app-toast-container-error'],
              horizontalPosition : 'center',
              verticalPosition : 'bottom',
            });
            return;
          }
          // Deleted!
          const message = this.languageService.getTranslation('DEVICE_TYPES.DEVICE_TYPE_ADMIN_TABLE.TOAST.DELETED');
          const action = this.languageService.getTranslation('DEVICE_TYPES.DEVICE_TYPE_ADMIN_TABLE.TOAST.CLOSE');
          this.toast.open(message, action, { 
            duration: 2000,
            panelClass: ['app-toast-container-effect', 'app-toast-container-success'],
            horizontalPosition : 'center',
            verticalPosition : 'bottom',
          });
          // Return
          this.updateTable();
        });
    });
  }
}
