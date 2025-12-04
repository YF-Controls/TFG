// System
import { Component, inject, signal, ViewChild } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import { SvgIconComponent } from '@shared/components';
import { CreateDeviceTypeComponent, DeviceTypeAdminTableComponent } from '@device-types/components';



@Component({
  standalone : true,
  selector: 'app-device-types-admin-page',
  imports: [TranslateModule, DeviceTypeAdminTableComponent, SvgIconComponent],
  templateUrl: './device-types-admin-page.html',
})
export class DeviceTypesAdminPage { 

  // Injections
  protected readonly dialog = inject(Dialog);
  
  // ViewChild
  @ViewChild(DeviceTypeAdminTableComponent) table!: DeviceTypeAdminTableComponent;
  
  // IO
  protected total = signal<number>(0);
  
  // Methods
  protected onAdd () {
    // Open popup
    const dialogRef = this.dialog.open(CreateDeviceTypeComponent, {
      disableClose: false,
      data: { isPopup: true }
    });
    // After closed
    dialogRef.closed.subscribe((confirmed) => {
      if (confirmed) this.table?.onUpdateTable();
    });
  }
}
