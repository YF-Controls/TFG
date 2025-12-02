// System
import { Component, computed, effect, inject, input, OnInit, signal } from '@angular/core';
// Other modules
import { SvgIconComponent } from '@shared/components';
// This module
import { Device, DeviceCommand, DeviceStatus } from '@devices/interfaces';
import { DeviceWebSocketService } from '@devices/services';


@Component({
  standalone : true,
  selector: 'app-blind-device-control',
  imports: [SvgIconComponent],
  templateUrl: './blind-device-control-component.html',
})
export class BlindDeviceControlComponent implements OnInit {

  // Injections
  private deviceWebSocketService = inject(DeviceWebSocketService);
  
  // IO
  device = input.required<Device>();
  deviceType = input.required<string>();
  deviceArea = input.required<string>();

  // Properties
  protected isConnected = computed<boolean>(() => this.deviceWebSocketService.isConnected());
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
    if (!this.isConnected()) return;
    this.deviceWebSocketService.sendCommand({
      hwId: this.device().hwId,
      command: DeviceCommand.getStatus});
  }

  // Methods
  setUp () {
    if (!this.isConnected()) return;
    this.deviceWebSocketService.sendCommand({
      hwId: this.device().hwId,
      command: DeviceCommand.up});
  }

  setDown () {
    if (!this.isConnected()) return;
    this.deviceWebSocketService.sendCommand({
      hwId: this.device().hwId,
      command: DeviceCommand.down});
  }
  
  setStop () {
    if (!this.isConnected()) return;
    this.deviceWebSocketService.sendCommand({
      hwId: this.device().hwId,
      command: DeviceCommand.stop});
  }
  
 }
