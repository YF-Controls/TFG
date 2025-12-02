// System
import { Component, inject, OnInit, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Dialog } from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import { LanguageService } from '@shared/services';
import { SvgIconComponent } from '@shared/components';
import { CreateDeviceComponent, DeviceAdminTableComponent } from '@devices/components';
import { DeviceApi } from '@devices/services';
import { Device } from '@devices/interfaces';
import { DeviceAreaApi } from '@device-areas/services';
import { DeviceArea } from '@device-areas/interfaces';
import { DeviceTypeApi } from '@device-types/services';
import { DeviceType } from '@device-types/interfaces';


@Component({
  standalone : true,
  selector: 'app-devices-admin-page',
  imports: [TranslateModule, DeviceAdminTableComponent, SvgIconComponent ],
  templateUrl: './devices-admin-page.html',
})
export class DevicesAdminPage {

  // Injections
  private languageService = inject(LanguageService);
  private dialog = inject(Dialog);
  private deviceApi = inject(DeviceApi);
  private deviceAreaApi = inject(DeviceAreaApi);
  private deviceTypeApi = inject(DeviceTypeApi);
  
  
  // Properties
  devicesResource = rxResource<Device[], []>({
    stream  : () => this.deviceApi.getAll({ withInactives: true, orderBy: 'number'}),
  });
  
  // Methods
  protected onAdd () {
     
    const dialogRef = this.dialog.open(CreateDeviceComponent, {
      disableClose: true,
    });

    dialogRef.closed.subscribe((confirmed) => {
      if (confirmed) this.onUpdateTable();
    });
  }
    
  protected onUpdateTable() {
    this.devicesResource.reload();
  }


}

