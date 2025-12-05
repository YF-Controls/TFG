// System
import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import { SvgIconComponent } from '@shared/components';
import { DeviceControlTableComponent } from '@devices/components';
import { DeviceApi, DeviceWebSocketService } from '@devices/services';
// This module


@Component({
  standalone : true,
  selector: 'app-devices-control-page',
  imports: [TranslateModule, DeviceControlTableComponent, SvgIconComponent],
  templateUrl: './devices-control-page.html',
})
export class DevicesControlPage { 

  // Injections
  protected readonly deviceApi = inject(DeviceApi);
  protected readonly deviceWebSocketService = inject(DeviceWebSocketService);
  
  // ViewChild
  @ViewChild(DeviceControlTableComponent) table!: DeviceControlTableComponent;

  // IO
  protected total = signal<number>(0);
  
  // Properties
  wsIsConnected = computed<boolean>(() => this.deviceWebSocketService.wsIsConnected());
  wsMessage =  computed<string | null>(() => this.deviceWebSocketService.wsMessage());
  ioSystemIsConnected = computed<boolean>(() => this.deviceWebSocketService.ioSystemIsConnected());
  ioSystemMessage = computed<string | null>(() => this.deviceWebSocketService.ioSystemMessage());
  
  // Methods
  protected onUpdateTable() {
    this.table?.onUpdateTable();
  }
  
}
