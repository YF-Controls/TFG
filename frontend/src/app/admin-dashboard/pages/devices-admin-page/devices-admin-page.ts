// System
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
// Ohter modules
import { DeviceTableComponent } from '@devices/components';
import { Device } from '@devices/interfaces';
import { DevicesService } from '@devices/services';


@Component({
  standalone : true,
  selector: 'app-devices-admin-page',
  imports: [DeviceTableComponent],
  templateUrl: './devices-admin-page.html',
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevicesAdminPage {

  devicesService = inject(DevicesService);

  devices = signal<Device[]>([]);

  devicesResource = rxResource(
    {
      //request : () => ({}),
      stream  : () => {
        return this.devicesService.getDevices()},
      defaultValue: [],
    }
  );

}

