import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DeviceControlComponent } from '../../../devices/components';

@Component({
  selector: 'app-devices-page',
  imports: [DeviceControlComponent, ],
  templateUrl: './devices-page.component.html',
})
export class DevicesPageComponent { }
