// System
import { Component, inject, output } from '@angular/core';
import { tap } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';
import { rxResource } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import { ConfirmComponent, SvgIconComponent } from '@shared/components';
import { LanguageService, ToastService } from '@shared/services';
/*import { DeviceAreaApi } from '@device-areas/services';
import { DeviceArea } from '@device-areas/interfaces';
import { DeviceTypeApi } from '@device-types/services';
import { DeviceType } from '@device-types/interfaces';*/
// This modules
import { DeviceApi } from '@devices/services';
import { Device } from '@devices/interfaces';
// This path
import { EditDeviceComponent } from '../';

/*
export const PageSize = {
  s : 10,
  m : 25,
  l : 50,
  xl: 100,
  all : null,
} as const;
export type PageSizes = typeof PageSize[keyof typeof PageSize];

type Popups = 'off' | 'pageSizes' | 'types' | 'areas';
*/

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
  protected readonly toast = inject(ToastService);
  protected readonly deviceApi = inject(DeviceApi);
  //protected readonly deviceAreaApi = inject(DeviceAreaApi);
  //protected readonly deviceTypeApi = inject(DeviceTypeApi);
  
  // IO 
  totalChanged = output<number>();
    
  // Properties
  public devices = rxResource<Device[], []>({
    stream: () => {
      
      return this.deviceApi.getAll({
        orderBy: 'number',
        //limit: null,
        offset: 0
      }).pipe(tap(devices => this.totalChanged.emit(devices.length)));
    },
  });
  /*
  protected deviceAreas = rxResource<DeviceArea[], null>({
    stream: () => this.deviceAreaApi.getAll({ orderBy: 'name', filterBy: ['isActive'], filterValue: ['true'] }),
  });
  protected deviceTypes = rxResource<DeviceType[], null>({
    stream: () => this.deviceTypeApi.getAll({ orderBy: 'name', filterBy: ['isActive'], filterValue: ['true'] }),
  });
  
  protected showPopup = signal<Popups>('off');
  protected popupX = signal<number>(0);
  protected popupY = signal<number>(0);

  protected pageSize = signal<PageSizes>(PageSize.m);
  protected readonly pageSizes = Object.values(PageSize);
  protected pages = signal<number>(1);
  protected page = signal<number>(0);
  
  protected filterByTypeId = signal<string | null>(null);
  protected filterByAreaId = signal<string | null>(null);
  */
  // Methods
  public onUpdateTable(): void {
    this.devices.reload();
  }
  
  protected onUpdateOne (device: Device) {
    // Open popup
    const dialogRef = this.dialog.open(EditDeviceComponent, {
      disableClose: false,
      data: { isPopup: true, deviceId: device.id}
    });
    // After closed
    dialogRef.closed.subscribe((confirmed) => {
      if (confirmed) this.onUpdateTable();
    });
  }
  
  protected onDeleteOne (device: Device) {
    // Confirm popup
    const dialogRef = this.dialog.open(ConfirmComponent, {
      disableClose: false,
      data: {
        isPopup: true,
        translate: true,
        title: 'DEVICES.DEVICE_ADMIN_TABLE.DELETE_POPUP.TITLE',
        message: 'DEVICES.DEVICE_ADMIN_TABLE.DELETE_POPUP.MESSAGE',
      }
    });
    // After closed
    dialogRef.closed.subscribe((confirmed) => {
      if (!confirmed) return;
      // Delete
      this.deviceApi.deleteOne(device.id)
        .subscribe( errorMessage => {
          // Error
          if (errorMessage) {
            this.toast.error(errorMessage, false);
            return;
          }
          // Done and exit
          this.toast.success('DEVICES.DEVICE_ADMIN_TABLE.TOAST.DELETED');
          this.onUpdateTable();
        });
    });
  }

  /*
  protected toggleShowPageSizes(event: MouseEvent): void {
    if (this.showPopup() === 'pageSizes') {
      this.showPopup.set('off');
      return;
    }
    const { x, y } = this.getXYPosition(event);
    this.popupX.set(x);
    this.popupY.set(y);
    this.showPopup.set('pageSizes');

  }
  
  protected toggleShowTypes(event: MouseEvent): void {
    if (this.showPopup() === 'types') {
      this.showPopup.set('off');
      return;
    }
   const { x, y } = this.getXYPosition(event);
    this.popupX.set(x);
    this.popupY.set(y);
    this.showPopup.set('types');
  }

  protected toggleShowAreas(event: MouseEvent): void {
    if (this.showPopup() === 'areas') {
      this.showPopup.set('off');
      return;
    }
    const { x, y } = this.getXYPosition(event);
    this.popupX.set(x);
    this.popupY.set(y);
    this.showPopup.set('areas');
  }
  
  protected getXYPosition(event: MouseEvent): {x: number, y: number} {
    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    const popupWidth = 80; // w-20 = 80px
    const windowWidth = window.innerWidth;
    
    // Check if popup would overflow right edge
    let leftPosition = rect.left;
    if (leftPosition + popupWidth > windowWidth) {
      leftPosition = windowWidth - popupWidth - 10; // 8px margin from edge
    }
    
    return { x: leftPosition, y: rect.bottom + 4 };
  }

  protected onChangePageSize (size: PageSizes) {
    this.pageSize.set(size);
    this.showPopup.set('off');
  }

  protected onChangeFilterByTypeId (typeId: string | null) {
    this.filterByTypeId.set(typeId);
    this.showPopup.set('off');
  } 

  protected onChangeFilterByAreaId (areaId: string | null) {
    this.filterByAreaId.set(areaId);
    this.showPopup.set('off');
  }
  */
}