// System
import { Component, inject, output } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs/internal/operators/tap';
import { Dialog } from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import { ConfirmComponent, SvgIconComponent } from '@shared/components';
import { ToastService } from '@shared/services';
// This module
import { DeviceTypeApi } from '@device-types/services';
import { DeviceType } from '@device-types/interfaces';
// This path
import { EditDeviceTypeComponent } from '../';


@Component({
  standalone: true,
  selector: 'app-device-type-admin-table',
  imports: [TranslateModule, SvgIconComponent],
  templateUrl: './device-type-admin-table-component.html',
})
export class DeviceTypeAdminTableComponent { 

  // Injections
  protected readonly dialog = inject(Dialog);
  protected readonly toast = inject(ToastService);
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
  public onUpdateTable(): void {
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
      if (confirmed) this.onUpdateTable();      
    });
  }
  
  protected onDeleteOne (deviceType: DeviceType) {
    // Confirm popup
    const dialogRef = this.dialog.open(ConfirmComponent, {
      disableClose: false,
      data: {
        isPopup: true, translate: true,
        title: 'DEVICE_TYPES.DEVICE_TYPE_ADMIN_TABLE.DELETE_POPUP.TITLE',
        message: 'DEVICE_TYPES.DEVICE_TYPE_ADMIN_TABLE.DELETE_POPUP.MESSAGE'
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
            this.toast.error(errorMessage, false);
            return;
          }
          // Done
          this.toast.success('DEVICE_TYPES.DEVICE_TYPE_ADMIN_TABLE.TOAST.DELETED');
          this.onUpdateTable();
        });
    });
  }
}
