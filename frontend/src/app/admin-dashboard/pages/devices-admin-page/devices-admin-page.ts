// System
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
// Ohter modules
import { DeviceTableComponent } from '@devices/components';


@Component({
  selector: 'app-devices-admin-page',
  imports: [DeviceTableComponent],
  templateUrl: './devices-admin-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevicesAdminPage {

  //productService = inject(ProductsService);
  //paginationService = inject(PaginationService);
  

}
