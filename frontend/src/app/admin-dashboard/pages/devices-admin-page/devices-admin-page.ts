// System
import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Dialog } from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import { LanguageService } from '@shared/services';
import { SvgIconComponent } from '@shared/components';
import { CreateDeviceComponent, DeviceAdminTableComponent } from '@devices/components';
import { DeviceApi } from '@devices/services';
import { Device } from '@devices/interfaces';


@Component({
  standalone : true,
  selector: 'app-devices-admin-page',
  imports: [TranslateModule, DeviceAdminTableComponent, SvgIconComponent ],
  templateUrl: './devices-admin-page.html',
})
export class DevicesAdminPage {

  // Injections
  protected readonly languageService = inject(LanguageService);
  protected readonly dialog = inject(Dialog);
  protected readonly deviceApi = inject(DeviceApi);
  
  // Properties
  devicesResource = rxResource<Device[], []>({
    stream  : () => this.deviceApi.getAll({orderBy: 'number'}),
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

