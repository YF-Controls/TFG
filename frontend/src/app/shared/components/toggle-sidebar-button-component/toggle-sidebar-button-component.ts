// System
import { Component, input, output } from '@angular/core';
// Other module
import { SvgIconComponent } from '@shared/components';


@Component({
  standalone : true,
  selector: 'app-toggle-sidebar-button',
  imports: [SvgIconComponent],
  templateUrl: './toggle-sidebar-button-component.html',
})
export class ToggleSidebarButtonComponent {

  // Injections

  // IO
  isSidebarCollapsed = input.required<boolean>();
  toggleSidebar = output();

  // Properties
  
  
  // Methods
  


 }
