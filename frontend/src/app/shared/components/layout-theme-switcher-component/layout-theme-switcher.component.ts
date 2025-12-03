// System
import { Component, computed, inject, input, signal } from '@angular/core';
// This module
import { Theme, ThemeService } from '@shared/services';
import { SvgIconComponent } from '../svg-icon-component/svg-icon-component';


@Component({
  standalone: true,
  selector: 'app-layout-theme-switcher',
  imports: [SvgIconComponent],
  templateUrl: './layout-theme-switcher.component.html',
  //styles: [`:host {display: contents;}`],
})
export class LayoutThemeSwitcherComponent {
  
  // Injections
  protected readonly themeService = inject(ThemeService);
  
  // IO
  isSidebarCollapsed = input.required<boolean>();
  
  // Properties
  protected isOpen = signal(false);
  
  // Methods
  protected toggleMenu(): void {
    this.isOpen.update(value => !value);
  }

  protected selectTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
    this.isOpen.set(false);
  }
}
