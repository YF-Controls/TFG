// System
import { Component, computed, inject, input, signal } from '@angular/core';
// This module
import { DropdownControlService, Theme, ThemeService } from '@shared/services';
// This path


@Component({
  standalone: true,
  selector: 'app-layout-theme-switcher',
  imports: [],
  templateUrl: './layout-theme-switcher.component.html',
  //styles: [`:host {display: contents;}`],
})
export class LayoutThemeSwitcherComponent {
  
  // Injections
  protected readonly themeService = inject(ThemeService);
  protected readonly dropdown = inject(DropdownControlService);
  
  // IO
  id = input.required<string>();
  isSidebarCollapsed = input.required<boolean>();
  
  // Properties
  
  // Methods
  protected selectTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
  }

  protected onToggle(isOpen: boolean) {
    if (isOpen) this.dropdown.open(this.id());
    else this.dropdown.close(this.id());
  }
}