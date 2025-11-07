import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone : true,
  selector: 'app-device-admin-page',
  imports: [],
  templateUrl: './device-admin-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceAdminPage { }
