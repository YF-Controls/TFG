// System
import { Component, inject, OnInit, OnDestroy, effect, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
// This module
import { DeviceWebSocketService } from '@devices/services';
import { DeviceStatusDto } from '@devices/dtos';


@Component({
  selector: 'app-device-monitor',
  imports: [JsonPipe],
  templateUrl: './device-monitor-component.html',
})
export class DeviceMonitorComponent implements OnInit, OnDestroy {
  
  // Injections
  protected wsService = inject(DeviceWebSocketService);

  // Properties
  protected receivedData = signal<DeviceStatusDto|null>(null);

  // Methods

  // Constructor
  constructor() {
    // React to device data changes
    effect(() => {
      const data = this.wsService.deviceStatus();
      /*const id = this.wsService.socketId();
      const isConnected = this.wsService.isConnected();
      const error = this.wsService.connectionError();
      */
      if (data) {
        this.receivedData.set(data);
      }
      
    });
  }

  // Lifecycle
  ngOnInit(): void {
    // Connect on init
    console.log('!DELETE DeviceMonitorComponent.ngOnInit() called');
    this.wsService.connect();
  }

  // On destroy
  ngOnDestroy(): void {
    // Disconnect on destroy
    console.log('!DELETE DeviceMonitorComponent.ngOnDestroy() called');
    this.wsService.disconnect();
  }

  connect(): void {
    console.log('!DELETE DeviceMonitorComponent.connect() called');
    this.wsService.connect();
  }
  
  disconnect(): void {
    console.log('!DELETE DeviceMonitorComponent.disconnect() called');
    this.wsService.disconnect();
  }

  sendData(): void {
    console.log('!DELETE DeviceMonitorComponent.sendData() called');
    this.wsService.sendCommand({
      id: '1f287d51-5967-4990-aef7-391b6ea050ee',
      hwId: 'room1-lamp-001',
      command: 'test command'
    });
  }
}
