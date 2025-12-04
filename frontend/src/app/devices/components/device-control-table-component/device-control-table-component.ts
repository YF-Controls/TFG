// System
import { Component, computed, HostListener, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import { LanguageService } from '@shared/services';
import { SvgIconComponent } from '@shared/components';
import { BlindDeviceControlComponent, CommonDeviceControlComponent } from '@devices/components';
import { Device } from '@devices/interfaces';
import { DeviceApi, DeviceWebSocketService } from '@devices/services';
import { DeviceTypeApi } from '@device-types/services';
import { DeviceType } from '@device-types/interfaces';
import { DeviceAreaApi } from '@device-areas/services';
import { DeviceArea } from '@device-areas/interfaces';


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

  // Properties
  protected  isConnected = computed<boolean>(() => this.deviceWebSocketService.isConnected());
  protected showMenu = signal<boolean>(true);
  protected orderBy = signal<string>('number');
  protected filterByTypeId = signal<string | null>(null);
  protected filterByAreaId = signal<string | null>(null);
  
  protected devicesResource = rxResource<Device[], { 
    orderBy: string, filterByTypeId: string | null, filterByAreaId: string | null }>
    ({
      params: () => ({ orderBy: this.orderBy(), filterByAreaId: this.filterByAreaId(), filterByTypeId: this.filterByTypeId() }),
    stream: ({ params }) => this.deviceApi.getAll({
      orderBy: params.orderBy,
      filterBy: ['isActive', ...(params.filterByAreaId ? ['deviceAreaId'] : []), ...(params.filterByTypeId ? ['deviceTypeId'] : [])],
      filterValue: ['true', ...(params.filterByAreaId ? [params.filterByAreaId] : []), ...(params.filterByTypeId ? [params.filterByTypeId] : [])]
    }),
  });
  protected devicesTypesResource = rxResource<DeviceType[], null>({
    stream: () => this.deviceTypeApi.getAll({ orderBy: 'name', filterBy: ['isActive'], filterValue: ['true'] }),
  });
  protected devicesAreasResource = rxResource<DeviceArea[], null>({
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
  
  protected onUpdateTable() {
    this.devicesResource.reload();
    this.devicesTypesResource.reload();
    this.devicesAreasResource.reload();
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
