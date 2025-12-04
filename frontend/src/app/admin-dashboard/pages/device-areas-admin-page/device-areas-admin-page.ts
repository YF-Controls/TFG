// System
import { Component, inject, signal, ViewChild } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import { SvgIconComponent } from '@shared/components';
import { CreateDeviceAreaComponent, DeviceAreaAdminTableComponent } from '@device-areas/components';


@Component({
  standalone : true,
  selector: 'app-device-areas-admin-page',
  imports: [TranslateModule, DeviceAreaAdminTableComponent, SvgIconComponent],
  templateUrl: './device-areas-admin-page.html',
})
export class DeviceAreasAdminPage { 
 
  // Injections
  protected readonly dialog = inject(Dialog);

  // ViewChild
  @ViewChild(DeviceAreaAdminTableComponent) table!: DeviceAreaAdminTableComponent;
  
  // IO
  protected total = signal<number>(0);
  
  // Methods
  protected onAdd () {
    // Open popup
    const dialogRef = this.dialog.open(CreateDeviceAreaComponent, {
      disableClose: false,
      data: { isPopup: true }
    });
    // After closed
    dialogRef.closed.subscribe((confirmed) => {
      if (confirmed) this.table?.onUpdateTable();
    });
  }
}
