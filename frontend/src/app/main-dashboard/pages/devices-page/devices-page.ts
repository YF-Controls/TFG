// System
import { Component } from '@angular/core';
// Other modules
import { DeviceControlComponent } from '@devices/components';

@Component({
  standalone : true,
  selector: 'app-devices-page',
  imports: [DeviceControlComponent, ],
  templateUrl: './devices-page.html',
})
export class DevicesPage { }
