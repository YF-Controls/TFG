// System
import { Component, input, output } from '@angular/core';
// Other module
import { SvgIconComponent } from '@shared/components';


@Component({
  standalone : true,
  selector: 'app-layout-toggle-sidebar-button',
  imports: [SvgIconComponent],
  templateUrl: './layout-toggle-sidebar-button-component.html',
})
export class LayoutToggleSidebarButtonComponent {
  // Injections

  // IO
  isSidebarCollapsed = input.required<boolean>();
  toggleSidebar = output();

  // Properties
  
  
  // Methods
  


 }
