// System
import { Component } from '@angular/core';
// Other modules
import { DeviceControlComponent, DeviceMonitorComponent } from '@devices/components';

@Component({
  standalone : true,
  selector: 'app-devices-page',
  imports: [DeviceMonitorComponent],
  templateUrl: './devices-page.html',
})
export class DevicesPage { }
