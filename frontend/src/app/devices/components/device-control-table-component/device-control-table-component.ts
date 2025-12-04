// System
import { Component, computed, HostListener, inject, OnDestroy, OnInit, output, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import { LanguageService } from '@shared/services';
import { SvgIconComponent } from '@shared/components';
import { DeviceTypeApi } from '@device-types/services';
import { DeviceType } from '@device-types/interfaces';
import { DeviceAreaApi } from '@device-areas/services';
import { DeviceArea } from '@device-areas/interfaces';
// This module
import { BlindDeviceControlComponent, CommonDeviceControlComponent } from '@devices/components';
import { Device } from '@devices/interfaces';
import { DeviceApi, DeviceWebSocketService } from '@devices/services';


@Component({
  standalone: true,
  selector: 'app-device-control-table',
  imports: [TranslateModule, SvgIconComponent, BlindDeviceControlComponent, CommonDeviceControlComponent],
  templateUrl: './device-control-table-component.html',
})
export class DeviceControlTableComponent implements OnInit, OnDestroy {
   
  // Injections
  protected readonly languageService = inject(LanguageService);
  protected readonly deviceWebSocketService = inject(DeviceWebSocketService);
  protected readonly deviceApi = inject(DeviceApi);
  protected readonly deviceTypeApi = inject(DeviceTypeApi);
  protected readonly deviceAreaApi = inject(DeviceAreaApi);

  // IO 
  totalChanged = output<number>();
   
  // Properties
  protected  isConnected = computed<boolean>(() => this.deviceWebSocketService.isConnected());
  protected showMenu = signal<boolean>(true);
  protected orderBy = signal<string>('number');
  protected filterByTypeId = signal<string | null>(null);
  protected filterByAreaId = signal<string | null>(null);
  
  protected devices = rxResource<Device[], { 
    orderBy: string, filterByTypeId: string | null, filterByAreaId: string | null }>
    ({
      params: () => ({ orderBy: this.orderBy(), filterByAreaId: this.filterByAreaId(), filterByTypeId: this.filterByTypeId() }),
      stream: ({ params }) => this.deviceApi.getAll({
        orderBy: params.orderBy,
        filterBy: ['isActive', ...(params.filterByAreaId ? ['deviceAreaId'] : []), ...(params.filterByTypeId ? ['deviceTypeId'] : [])],
        filterValue: ['true', ...(params.filterByAreaId ? [params.filterByAreaId] : []), ...(params.filterByTypeId ? [params.filterByTypeId] : [])]
      }).pipe(tap(devices => this.totalChanged.emit(devices.length))),
  });
  protected deviceTypes = rxResource<DeviceType[], null>({
    stream: () => this.deviceTypeApi.getAll({ orderBy: 'name', filterBy: ['isActive'], filterValue: ['true'] }),
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
  
  @HostListener('window:resize')
  protected onResize() {
    this.showMenu.set(window.innerWidth >= 768);
  }
  
  public onUpdateTable() {
    this.devices.reload();
    this.deviceTypes.reload();
    this.deviceAreas.reload();
  }

  protected setFilterByType(deviceTypeId: string | null): void {
    this.filterByTypeId.set(deviceTypeId);
  }

  protected setFilterByArea(deviceAreaId: string | null): void {
    this.filterByAreaId.set(deviceAreaId);
  }
  
  protected toggleMenu(): void {
    this.showMenu.update( value => !value );
  }
}
