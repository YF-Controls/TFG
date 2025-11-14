// System
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
// Other modules
import { DeviceTypeTableComponent } from '@devices-types/components';
import { DeviceType } from '@devices-types/interfaces';


@Component({
  standalone : true,
  selector: 'app-device-types-admin-page',
  imports: [DeviceTypeTableComponent],
  templateUrl: './device-types-admin-page.html',
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceTypesAdminPage { 

  deviceTypes = signal<DeviceType[]>([]);  


}
