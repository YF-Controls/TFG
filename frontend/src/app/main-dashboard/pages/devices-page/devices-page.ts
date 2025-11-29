// System
import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
// Other modules
import { LanguageService } from '@shared/services';
import { BlindDeviceControlComponent, CommonDeviceControlComponent } from '@devices/components';
import { DeviceApi, DeviceWebSocketService } from '@devices/services';
import { Device } from '@devices/interfaces';
import { DeviceTypeApi } from '@device-types/services';
import { DeviceAreaApi } from '@device-areas/services';
import { DeviceType } from '@device-types/interfaces';
import { DeviceArea } from '@device-areas/interfaces';


@Component({
  standalone : true,
  selector: 'app-devices-page',
  imports: [BlindDeviceControlComponent, CommonDeviceControlComponent],
  templateUrl: './devices-page.html',
})
export class DevicesPage implements OnInit, OnDestroy { 

  // Injections
  private languageService = inject(LanguageService);
  private deviceWebSocketService = inject(DeviceWebSocketService);
  protected deviceApi = inject(DeviceApi);
  protected deviceTypeApi = inject(DeviceTypeApi);
  protected deviceAreaApi = inject(DeviceAreaApi);

  // Properties
  isConnected = computed<boolean>(() => this.deviceWebSocketService.isConnected());
  protected devicesResource = rxResource<Device[], []>({
    stream  : () => {return this.deviceApi.getAll({limit: 100, offset: 0, orderBy: 'number'})},
  });
  protected devicesTypeResource = rxResource<DeviceType[], []>({
    stream  : () => {return this.deviceTypeApi.getAll({limit: 100})},
  });
  protected devicesAreaResource = rxResource<DeviceArea[], []>({
    stream  : () => {return this.deviceAreaApi.getAll({limit: 100})},
  });
  
  // Constructor
  constructor() {

  }
  
  // Lifecycle
  ngOnInit(): void {
    this.deviceWebSocketService.connect();
  }

  // On destroy
  ngOnDestroy(): void {
    this.deviceWebSocketService.disconnect();
  }


  protected onUpdateTable() {
    this.devicesResource.reload();
  }

  protected getDeviceTypeName(deviceTypeId: string): string {
    const deviceType = this.devicesTypeResource.value()?.find(dt => dt.id === deviceTypeId);
    return deviceType ? deviceType.name : '?';
  }
  
  protected getDeviceAreaName(deviceAreaId: string): string {
    const deviceArea = this.devicesAreaResource.value()?.find(da => da.id === deviceAreaId);
    return deviceArea ? deviceArea.name : '?';
  }

  protected getDeviceTypeHwId(deviceTypeId: string): string {
    const deviceType = this.devicesTypeResource.value()?.find(dt => dt.id === deviceTypeId);
    return deviceType ? deviceType.hwId : '?';
  }

}
