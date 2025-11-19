// System
import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Dialog } from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import { LanguageService } from '@shared/services';
import { SvgIconComponent } from '@shared/components';
import { CreateDeviceAreaComponent, DeviceAreaTableComponent } from '@device-areas/components';
import { DeviceArea } from '@device-areas/interfaces';
import { DeviceAreaApi } from '@device-areas/services';


@Component({
  standalone : true,
  selector: 'app-device-areas-admin-page',
  imports: [TranslateModule, DeviceAreaTableComponent, SvgIconComponent],
  templateUrl: './device-areas-admin-page.html',
})
export class DeviceAreasAdminPage { 

  // Injections
  private languageService = inject(LanguageService);
  private dialog = inject(Dialog);
  private deviceAreaApi = inject(DeviceAreaApi);

  // Properties
  deviceAreasResource = rxResource<DeviceArea[], []>({
    stream  : () => {return this.deviceAreaApi.getAll({limit: 100, offset: 0, withInactives: true, orderBy: 'name'})},
  });
  
  // Methods
  protected onAdd () {
    const dialogRef = this.dialog.open(CreateDeviceAreaComponent, {
      disableClose: true,
    });

    dialogRef.closed.subscribe((confirmed) => {
      if (confirmed) this.onUpdateTable();
    });
  }
  
  protected onUpdateTable() {
    this.deviceAreasResource.reload();
  }

}
