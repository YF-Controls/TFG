// System
import { Component } from '@angular/core';
// Other modules
import { DeviceControlTableComponent } from '@devices/components';


@Component({
  standalone : true,
  selector: 'app-devices-page',
  imports: [DeviceControlTableComponent],
  templateUrl: './devices-page.html',
})
export class DevicesPage { 

  
}
