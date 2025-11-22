// System
import { Component, computed, inject, input, signal } from '@angular/core';
import { NgClass } from '@angular/common';
// This module
import { Theme, ThemeService } from '@shared/services';
import { SvgIconComponent } from '../svg-icon-component/svg-icon-component';


@Component({
  standalone: true,
  selector: 'app-theme-switcher',
  imports: [NgClass, SvgIconComponent],
  templateUrl: './theme-switcher.component.html',
  styles: [`:host {display: contents;}`],
})
export class ThemeSwitcherComponent {
  
  // Injections
  protected themeService = inject(ThemeService);
  
  // Properties
  isSidebarCollapsed = input<boolean>(true);
  protected readonly isOpen = signal(false);
  
  // Methods
  protected toggleMenu(): void {
    this.isOpen.update(value => !value);
  }

  protected selectTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
    this.isOpen.set(false);
  }
}
