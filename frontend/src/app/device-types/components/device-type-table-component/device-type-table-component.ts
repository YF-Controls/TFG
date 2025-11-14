// System
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
// This module
import { DeviceType } from '../../interfaces';


@Component({
  standalone: true,
  selector: 'app-device-type-table',
  imports: [NgClass, RouterLink],
  templateUrl: './device-type-table-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceTypeTableComponent { 

  deviceTypes = input.required<DeviceType[]>();
  

}
