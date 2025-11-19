// System
import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Dialog } from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';
// Ohter modules
import { LanguageService } from '@shared/services';
import { SvgIconComponent } from '@shared/components';
import { DeviceTableComponent } from '@devices/components';
import { Device } from '@devices/interfaces';
import { DeviceApi } from '@devices/services';
import { DeviceArea } from '@device-areas/interfaces';
import { DeviceType } from '@device-types/interfaces';


@Component({
  standalone : true,
  selector: 'app-devices-admin-page',
  imports: [TranslateModule, DeviceTableComponent, SvgIconComponent],
  templateUrl: './devices-admin-page.html',
})
export class DevicesAdminPage {

  // Injections
  private languageService = inject(LanguageService);
  private dialog = inject(Dialog);
  deviceApi = inject(DeviceApi);

  devices = signal<Device[]>([]);
  deviceAreas = signal<DeviceArea[]>([]);
  deviceTypes = signal<DeviceType[]>([]);

  // Properties
  devicesResource = rxResource<DeviceArea[], []>({
    stream  : () => {return this.deviceApi.getAll({limit: 100, offset: 0, withInactives: true, orderBy: 'name'})},
  });

  // Methods
  protected onAdd () {
    /*
    const dialogRef = this.dialog.open(CreateDeviceComponent, {
      disableClose: true,
    });

    dialogRef.closed.subscribe((confirmed) => {
      if (confirmed) this.onUpdateTable();
    });
    */
    console.error('!DELETE device-admin-page.ts onAdd() not implemented yet!');
  }
  
  protected onUpdateTable() {
    this.devicesResource.reload();
  }


}

