// System
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from "@angular/router";
// Other modules
import { Device } from '@devices/interfaces';


@Component({
  standalone: true,
  selector: 'app-device-table',
  imports: [NgClass, RouterLink],
  templateUrl: './device-table-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceTableComponent { 

  devices = input.required<Device[]>();
  
}
