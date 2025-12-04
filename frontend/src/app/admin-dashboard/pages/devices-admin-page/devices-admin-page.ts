// System
import { Component, inject, signal, ViewChild } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import { SvgIconComponent } from '@shared/components';
import { CreateDeviceComponent, DeviceAdminTableComponent } from '@devices/components';


@Component({
  standalone : true,
  selector: 'app-devices-admin-page',
  imports: [TranslateModule, DeviceAdminTableComponent, SvgIconComponent ],
  templateUrl: './devices-admin-page.html',
})
export class DevicesAdminPage {

  // Injections
  protected readonly dialog = inject(Dialog);
  
  // ViewChild
  @ViewChild(DeviceAdminTableComponent) table!: DeviceAdminTableComponent;
  
  // IO
  protected total = signal<number>(0);

  // Methods
  protected onAdd () {
    // Open popup
    const dialogRef = this.dialog.open(CreateDeviceComponent, {
      disableClose: false,
      data: { isPopup: true }
    });
    // After closed
    dialogRef.closed.subscribe((confirmed) => {
      if (confirmed) this.table?.updateTable();
    });
  }
}
