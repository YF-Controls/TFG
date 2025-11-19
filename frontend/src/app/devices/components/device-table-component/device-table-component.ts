// System
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from "@angular/router";
// Ohter modules
import { DeviceType } from '@device-types/interfaces';
import { DeviceArea } from '@device-areas/interfaces';
// This modules
import { Device } from '../../interfaces';
import { SvgIconComponent } from '@shared/components';


@Component({
  standalone: true,
  selector: 'app-device-table',
  imports: [NgClass, RouterLink, SvgIconComponent ],
  templateUrl: './device-table-component.html',
})
export class DeviceTableComponent { 

  devices = input.required<Device[]>();
  deviceTypes = input.required<DeviceType[]>();
  deviceAreas = input.required<DeviceArea[]>();
  


  protected getDeviceTypeName (id: string): string {
    const deviceType = this.deviceTypes().find(dt => dt.id === id);
    return deviceType ? deviceType.name : '?';
  }

  protected getDeviceAreaName (id: string): string {
    const deviceArea = this.deviceAreas().find(da => da.id === id);
    return deviceArea ? deviceArea.name : '?';
  }
}


