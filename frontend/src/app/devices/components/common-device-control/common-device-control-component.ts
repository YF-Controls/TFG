// System
import { Component, computed, effect, inject, input, OnInit, signal } from '@angular/core';
import { NgClass } from '@angular/common';
// This module
import { Device, DeviceCommand, DeviceStatus } from '@devices/interfaces';
import { DeviceWebSocketService } from '@devices/services';
import { SvgIconComponent } from '@shared/components';


@Component({
  standalone : true,
  selector: 'app-common-device-control',
  imports: [SvgIconComponent],
  templateUrl: './common-device-control-component.html',
})
export class CommonDeviceControlComponent implements OnInit {

  // Injections
  private deviceWebSocketService = inject(DeviceWebSocketService);
  
  // Properties
  device = input.required<Device>();
  deviceType = input.required<string>();
  deviceArea = input.required<string>();

  protected isConnected = computed<boolean>(() => this.deviceWebSocketService.isConnected());
  protected status = signal<DeviceStatus>(DeviceStatus.unknown);
  protected readonly DeviceStatus = DeviceStatus;
  
  // Constructor
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
      id: this.device().id,
      hwId: this.device().hwId,
      command: DeviceCommand.getStatus});
  }

  // Methods
  setOn () {
    if (!this.isConnected()) return;
    this.deviceWebSocketService.sendCommand({
      id: this.device().id,
      hwId: this.device().hwId,
      command: DeviceCommand.on});
  }

  setOff () {
    if (!this.isConnected()) return;
    this.deviceWebSocketService.sendCommand({
      id: this.device().id,
      hwId: this.device().hwId,
      command: DeviceCommand.off});
  }
  
 }
