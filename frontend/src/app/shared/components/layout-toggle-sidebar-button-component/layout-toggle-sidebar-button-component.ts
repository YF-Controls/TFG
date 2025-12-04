// System
import { Component, input, output } from '@angular/core';
// This path
import { SvgIconComponent } from '../svg-icon-component/svg-icon-component';


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
