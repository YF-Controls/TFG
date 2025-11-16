// System
import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Dialog } from '@angular/cdk/dialog';
// Other modules
import { CreateDeviceAreaComponent, DeviceAreaTableComponent } from '@device-areas/components';
import { DeviceArea } from '@device-areas/interfaces';
import { DeviceAreasService } from '@device-areas/services';



@Component({
  standalone : true,
  selector: 'app-device-areas-admin-page',
  imports: [DeviceAreaTableComponent],
  templateUrl: './device-areas-admin-page.html',
})
export class DeviceAreasAdminPage { 

  // Injections
  private dialog = inject(Dialog);
  private deviceAreasService = inject(DeviceAreasService);
  
  // Properties
  deviceAreasResource = rxResource<DeviceArea[], []>({
    stream  : () => {return this.deviceAreasService.getAll({limit: 100, offset: 0, withInactives: true, orderBy: 'name'})},
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
