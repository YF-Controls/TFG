// System
import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
// Other modules
import { LanguageService } from '@shared/services';
import { DeviceControlComponent } from '@devices/components';
import { DeviceApi, DeviceWebSocketService } from '@devices/services';
import { Device } from '@devices/interfaces';


@Component({
  standalone : true,
  selector: 'app-devices-page',
  imports: [DeviceControlComponent],
  templateUrl: './devices-page.html',
})
export class DevicesPage implements OnInit, OnDestroy { 

  // Injections
  private languageService = inject(LanguageService);
  private deviceWebSocketService = inject(DeviceWebSocketService);
  protected deviceApi = inject(DeviceApi);
  
  // Properties
  isConnected = computed<boolean>(() => this.deviceWebSocketService.isConnected());
  devicesResource = rxResource<Device[], []>({
    stream  : () => {return this.deviceApi.getAll({limit: 100, offset: 0, withInactives: true, orderBy: 'name'})},
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

}
