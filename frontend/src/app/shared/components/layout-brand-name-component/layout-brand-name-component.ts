// System
import { Component, input } from '@angular/core';
// Other modules

// This module


@Component({
  standalone: true,
  selector: 'app-layout-brand-name',
  imports: [],
  templateUrl: './layout-brand-name-component.html',
})
export class LayoutBrandNameComponent { 

  // IO
  isSidebarCollapsed = input.required<boolean>();
  

}
