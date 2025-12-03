// System
import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import { DeviceControlTableComponent } from '@devices/components';
import { SvgIconComponent } from '@shared/components';
import { DeviceApi } from '@devices/services';
import { LanguageService } from '@shared/services';
import { rxResource } from '@angular/core/rxjs-interop';
import { Device } from '@devices/interfaces';


@Component({
  standalone : true,
  selector: 'app-devices-control-page',
  imports: [TranslateModule, DeviceControlTableComponent, SvgIconComponent],
  templateUrl: './devices-control-page.html',
})
export class DevicesControlPage { 

  // Injections
  private languageService = inject(LanguageService);
  private deviceApi = inject(DeviceApi);
  
    // Properties
  devicesResource = rxResource<Device[], []>({
    stream  : () => this.deviceApi.getAll({orderBy: 'number'}),
  });

  // Methods
  protected onUpdateTable() {
    this.devicesResource.reload();
  }
  
  
}
