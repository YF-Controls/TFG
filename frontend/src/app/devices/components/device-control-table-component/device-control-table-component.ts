// System
import { Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
// Other modules
import { LanguageService } from '@shared/services';
import { BlindDeviceControlComponent, CommonDeviceControlComponent } from '@devices/components';
import { Device } from '@devices/interfaces';
import { DeviceApi, DeviceWebSocketService } from '@devices/services';


@Component({
  standalone: true,
  selector: 'app-device-control-table',
  imports: [BlindDeviceControlComponent, CommonDeviceControlComponent],
  templateUrl: './device-control-table-component.html',
})
export class DeviceControlTableComponent implements OnInit, OnDestroy {
  
  // Injections
  private languageService = inject(LanguageService);
  private deviceWebSocketService = inject(DeviceWebSocketService);
  protected deviceApi = inject(DeviceApi);

  // Properties
  isConnected = computed<boolean>(() => this.deviceWebSocketService.isConnected());
  protected devicesResource = rxResource<Device[], []>({
    stream  : () => this.deviceApi.getAll({orderBy: 'number', filterBy: ['isActive'], filterValue: ['true']}),
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
  
  protected onUpdateTable() {
    this.devicesResource.reload();
  }


}
