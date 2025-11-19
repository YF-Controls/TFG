// System
import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Dialog } from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import { LanguageService } from '@shared/services';
import { CreateDeviceTypeComponent, DeviceTypeTableComponent } from '@device-types/components';
import { DeviceType } from '@device-types/interfaces';
import { DeviceTypeApi } from '@device-types/services';
import { SvgIconComponent } from '@shared/components';



@Component({
  standalone : true,
  selector: 'app-device-types-admin-page',
  imports: [TranslateModule, DeviceTypeTableComponent, SvgIconComponent],
  templateUrl: './device-types-admin-page.html',
})
export class DeviceTypesAdminPage { 

  // Injections
  private languageService = inject(LanguageService);
  private dialog = inject(Dialog);
  private deviceTypeApi = inject(DeviceTypeApi);

  // Properties
  deviceTypesResource = rxResource<DeviceType[], []>({
    stream  : () => {return this.deviceTypeApi.getAll({limit: 100, offset: 0, withInactives: true, orderBy: 'name'})},
  });
  
  // Methods
  protected onAdd () {
    const dialogRef = this.dialog.open(CreateDeviceTypeComponent, {
      disableClose: true,
    });

    dialogRef.closed.subscribe((confirmed) => {
      if (confirmed) this.onUpdateTable();
    });
  }
  
  protected onUpdateTable() {
    this.deviceTypesResource.reload();
  }

}
