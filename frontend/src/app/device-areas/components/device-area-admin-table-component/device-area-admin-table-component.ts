// System
import { Component, inject, output } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs/internal/operators/tap';
// Other modules
import { ConfirmComponent, SvgIconComponent } from '@shared/components';
import { ToastService } from '@shared/services';
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
  protected readonly dialog = inject(Dialog);
  protected readonly toast = inject(ToastService);
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
        isPopup: true, translate: true,
        title: 'DEVICE_AREAS.DEVICE_AREA_ADMIN_TABLE.DELETE_POPUP.TITLE',
        message: 'DEVICE_AREAS.DEVICE_AREA_ADMIN_TABLE.DELETE_POPUP.MESSAGE'
      }
    });
    
    dialogRef.closed.subscribe((confirmed) => {
      if (!confirmed) return;
      // Delete
      this.deviceAreaApi.deleteOne(deviceArea.id)
        .subscribe( errorMessage => {
          // Error
          if (errorMessage) {
            this.toast.error(errorMessage, false);
            return;
          }
          // Done
          this.toast.success('DEVICE_AREAS.DEVICE_AREA_ADMIN_TABLE.TOAST.DELETED');
          this.onUpdateTable();
        });
    });
  }
}
