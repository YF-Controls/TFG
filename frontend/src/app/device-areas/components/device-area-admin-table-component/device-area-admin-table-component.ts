// System
import { Component, inject, input, output } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs/internal/operators/tap';
// Other modules
import { ConfirmComponent, SvgIconComponent } from '@shared/components';
import { LanguageService } from '@shared/services';
// This module
import { EditDeviceAreaComponent } from '@device-areas/components';
import { DeviceAreaApi } from '@device-areas/services';
import { DeviceArea } from '@device-areas/interfaces';


@Component({
  standalone: true,
  selector: 'app-device-area-admin-table',
  imports: [TranslateModule, SvgIconComponent],
  templateUrl: './device-area-admin-table-component.html',
})
export class DeviceAreaAdminTableComponent { 

  // Injections
  protected readonly languageService = inject(LanguageService);
  protected readonly dialog = inject(Dialog);
  protected readonly toast = inject(MatSnackBar);
  protected readonly deviceAreaApi = inject(DeviceAreaApi);

  // IO
  totalChanged = output<number>();

    // Properties
  public deviceAreas = rxResource<DeviceArea[], []>({
    stream: () => {
      
      return this.deviceAreaApi.getAll({
        orderBy: 'name',
        //limit: null,
        offset: 0
      }).pipe(tap(deviceAreas => this.totalChanged.emit(deviceAreas.length)));
    },
  });
  
  // Methods
  public onUpdateTable(): void {
    this.deviceAreas.reload();
  }

  protected onUpdateOne (deviceArea: DeviceArea) {
    const dialogRef = this.dialog.open(EditDeviceAreaComponent, {
      disableClose: false,
      data: { isPopup: true, deviceAreaId: deviceArea.id},
    });

    dialogRef.closed.subscribe((confirmed) => {
      if (confirmed) this.onUpdateTable();      
    });
  }
  
  protected onDeleteOne (deviceArea: DeviceArea) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      disableClose: false,
      data: {
        isPopup: true,
        title: this.languageService.translate('DEVICE_AREAS.DEVICE_AREA_ADMIN_TABLE.DELETE_POPUP.TITLE'),
        message: this.languageService.translate('DEVICE_AREAS.DEVICE_AREA_ADMIN_TABLE.DELETE_POPUP.MESSAGE')
      }
    });
    
    dialogRef.closed.subscribe((confirmed) => {
      if (!confirmed) return;
      // Delete
      this.deviceAreaApi.deleteOne(deviceArea.id)
        .subscribe( errorMessage => {
          // Error
          if (errorMessage) {
            const action = this.languageService.translate('DEVICE_AREAS.DEVICE_AREA_ADMIN_TABLE.TOAST.CLOSE');
            this.toast.open(errorMessage, action, { 
              duration: 3000,
              panelClass: ['app-toast-container-effect', 'app-toast-container-error'],
              horizontalPosition : 'center',
              verticalPosition : 'bottom',
            });
            return;
          }
          // Deleted!
          const message = this.languageService.translate('DEVICE_AREAS.DEVICE_AREA_ADMIN_TABLE.TOAST.DELETED');
          const action = this.languageService.translate('DEVICE_AREAS.DEVICE_AREA_ADMIN_TABLE.TOAST.CLOSE');
          this.toast.open(message, action, { 
            duration: 2000,
            panelClass: ['app-toast-container-effect', 'app-toast-container-success'],
            horizontalPosition : 'center',
            verticalPosition : 'bottom',
          });
          // Return
          this.onUpdateTable();
        });
    });
  }
}
