// System
import { Component, inject, input, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import { DropdownControlService } from '@shared/services';
import { SvgIconComponent, SvgIconName } from '@shared/components';
// This path
import { FilterListItemComponent } from '../filter-list-item-component/filter-list-item-component';
import { DeviceArea } from '@device-areas/interfaces';
import { DeviceType } from '@device-types/interfaces';


@Component({
  standalone: true,
  selector: 'app-filter-list',
  imports: [TranslateModule, SvgIconComponent, FilterListItemComponent],
  templateUrl: './filter-list-component.html',
})
export class FilterListComponent {
  
  // Injections
  protected readonly dropdown = inject(DropdownControlService);
  
  // IO
  id = input.required<string>();
  label = input.required<string>();
  labelAll = input.required<string>();
  icon = input.required<SvgIconName>();
  items = input.required<DeviceArea[] | DeviceType[]>();
  currentFilter = input.required<string | null>();
  
  onClick = output<string | null>();
  
  // Methods
  protected selected(filterId: string | null): void {
    this.onClick.emit(filterId);
  }

  protected onToggle(isOpen: boolean) {
    if (isOpen) this.dropdown.open(this.id());
    else this.dropdown.close(this.id());
  }
  
}
