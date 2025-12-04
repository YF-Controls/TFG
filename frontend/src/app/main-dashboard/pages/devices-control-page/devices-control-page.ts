// System
import { Component, inject, signal, ViewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import { SvgIconComponent } from '@shared/components';
// This module
import { DeviceControlTableComponent } from '@devices/components';
import { DeviceApi } from '@devices/services';



@Component({
  standalone : true,
  selector: 'app-devices-control-page',
  imports: [TranslateModule, DeviceControlTableComponent, SvgIconComponent],
  templateUrl: './devices-control-page.html',
})
export class DevicesControlPage { 

  // Injections
  protected readonly deviceApi = inject(DeviceApi);
 
  // ViewChild
  @ViewChild(DeviceControlTableComponent) table!: DeviceControlTableComponent;

  // IO
  protected total = signal<number>(0);
  
  // Methods
  protected onUpdateTable() {
    this.table?.onUpdateTable();
  }
  
}
