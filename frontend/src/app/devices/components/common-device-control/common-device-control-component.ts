// System
import { Component, computed, effect, inject, input, OnInit, signal } from '@angular/core';
// Other modules
import { SvgIconComponent } from '@shared/components';
// This module
import { Device, DeviceCommand, DeviceStatus } from '@devices/interfaces';
import { DeviceWebSocketService } from '@devices/services';
// This path



@Component({
  standalone : true,
  selector: 'app-common-device-control',
  imports: [SvgIconComponent],
  templateUrl: './common-device-control-component.html',
})
export class CommonDeviceControlComponent implements OnInit {

  // Injections
  protected readonly deviceWebSocketService = inject(DeviceWebSocketService);
  
  // IO
  device = input.required<Device>();
  deviceType = input.required<string>();
  deviceArea = input.required<string>();

  // Properties
  protected wsIsConnected = computed<boolean>(() => this.deviceWebSocketService.wsIsConnected());
  protected ioSystemIsConnected = computed<boolean>(() => this.deviceWebSocketService.ioSystemIsConnected());
  protected status = signal<DeviceStatus>(DeviceStatus.unknown);
  protected readonly DeviceStatus = DeviceStatus;
  
  // Methods
  constructor () {
    effect(() => {
      
      const data = this.deviceWebSocketService.deviceStatus();
      
      if (!data) return;
      if (data.hwId !== this.device().hwId) return;

      this.status.set(data.status);
      
    });
    
  }

  ngOnInit(): void {
    if (!this.wsIsConnected()) return;
    this.deviceWebSocketService.sendCommand({
      hwId: this.device().hwId,
      command: DeviceCommand.getStatus});
  }

  // Methods
  setOn () {
    if (!this.wsIsConnected()) return;
    this.deviceWebSocketService.sendCommand({
      hwId: this.device().hwId,
      command: DeviceCommand.on});
  }

  setOff () {
    if (!this.wsIsConnected()) return;
    this.deviceWebSocketService.sendCommand({
      hwId: this.device().hwId,
      command: DeviceCommand.off});
  }
  
 }
