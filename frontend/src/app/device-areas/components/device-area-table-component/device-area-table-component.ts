// System
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
// This module
import { DeviceArea } from '../../interfaces';


@Component({
  standalone: true,
  selector: 'app-device-area-table',
  imports: [NgClass, RouterLink],
  templateUrl: './device-area-table-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceAreaTableComponent { 

  deviceAreas = input.required<DeviceArea[]>();
  

}
