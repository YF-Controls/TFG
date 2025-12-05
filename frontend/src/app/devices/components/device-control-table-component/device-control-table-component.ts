// System
import { Component, inject, OnDestroy, OnInit, output, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import { ToastService } from '@shared/services';
import { SvgIconComponent } from '@shared/components';
import { DeviceTypeApi } from '@device-types/services';
import { DeviceType } from '@device-types/interfaces';
import { DeviceAreaApi } from '@device-areas/services';
import { DeviceArea } from '@device-areas/interfaces';
// This module
import { Device } from '@devices/interfaces';
import { DeviceApi, DeviceWebSocketService } from '@devices/services';
// This paths
import { CommonDeviceControlComponent } from '../';
import { FilterListComponent, FilterListItemComponent } from './components';


const Popup = {
  off : 'off',
  typeId : 'typesId',
  areasId : 'areasId'
} as const;
type Popups = typeof Popup[keyof typeof Popup];


@Component({
  standalone: true,
  selector: 'app-device-control-table',
  imports: [TranslateModule, SvgIconComponent, CommonDeviceControlComponent, FilterListComponent],
  templateUrl: './device-control-table-component.html',
})
export class DeviceControlTableComponent implements OnInit, OnDestroy {
   
  // Injections
  protected readonly toast = inject(ToastService);
  protected readonly deviceWebSocketService = inject(DeviceWebSocketService);
  protected readonly deviceApi = inject(DeviceApi);
  protected readonly deviceTypeApi = inject(DeviceTypeApi);
  protected readonly deviceAreaApi = inject(DeviceAreaApi);

  // IO 
  totalChanged = output<number>();
   
  // Properties
  protected filterByTypeId = signal<string | null>(null);
  protected filterByAreaId = signal<string | null>(null);
  
  protected devices = rxResource<Device[], { filterByTypeId: string | null, filterByAreaId: string | null }>({
    params: () => ({ filterByAreaId: this.filterByAreaId(), filterByTypeId: this.filterByTypeId() }),
    stream: ({ params }) => this.deviceApi.getAll({
      orderBy: 'number',
      filterBy: ['isActive', ...(params.filterByAreaId ? ['deviceAreaId'] : []), ...(params.filterByTypeId ? ['deviceTypeId'] : [])],
      filterValue: ['true', ...(params.filterByAreaId ? [params.filterByAreaId] : []), ...(params.filterByTypeId ? [params.filterByTypeId] : [])]
    }).pipe(tap(devices => {
      this.totalChanged.emit(devices.length);
      this.toast.success('DEVICES.DEVICE_CONTROL_TABLE.TOAST.MESSAGE');})),
  });
  protected deviceTypes = rxResource<DeviceType[], null>({
    stream: () => this.deviceTypeApi.getAll({ orderBy: 'name', filterBy: ['isActive'], filterValue: ['true']}),
  });
  protected deviceAreas = rxResource<DeviceArea[], null>({
    stream  : () => this.deviceAreaApi.getAll({orderBy: 'name', filterBy: ['isActive'], filterValue: ['true']}),
  });
  
  // Methods
  // Lifecycle
  ngOnInit(): void {
    this.deviceWebSocketService.connect();
  }
  
  // On destroy
  ngOnDestroy(): void {
    this.deviceWebSocketService.disconnect();
  }

  public onUpdateTable() {
    this.devices.reload();
    this.deviceTypes.reload();
    this.deviceAreas.reload();
  }

  protected setFilterByTypeId(deviceTypeId: string | null): void {
    this.filterByTypeId.set(deviceTypeId);
  }

  protected setFilterByAreaId(deviceAreaId: string | null): void {
    this.filterByAreaId.set(deviceAreaId);
  }

}
