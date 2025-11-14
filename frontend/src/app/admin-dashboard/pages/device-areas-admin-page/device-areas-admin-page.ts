// System
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
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

  private dialog = inject(Dialog);
  private deviceAreasService = inject(DeviceAreasService);

  deviceAreasResource = rxResource<DeviceArea[], []>({
    stream  : () => {return this.deviceAreasService.getAll({limit: 100, offset: 0, withInactives: true})},
  });
  
  OnAdd () {
    const dialogRef = this.dialog.open(CreateDeviceAreaComponent, {
      disableClose: true,
    });
    
    dialogRef.closed.subscribe((result) => {
      if (result) {
        console.log('!DELETE device-areas-admin-page.ts Device area added, reloading list.');
        this.deviceAreasResource.reload();
      }
      else
        console.log('!DELETE device-areas-admin-page.ts Add device area cancelled.');
    });
  }

}
