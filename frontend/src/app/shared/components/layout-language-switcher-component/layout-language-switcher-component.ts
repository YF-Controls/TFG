// System
import { Component, inject, input, signal } from '@angular/core';
// This modules
import { Lang, LanguageService } from '@shared/services';
// This path
import { SvgIconComponent } from '../svg-icon-component/svg-icon-component';


@Component({
  standalone : true,
  selector: 'app-layout-language-switcher',
  imports: [SvgIconComponent ],
  templateUrl: './layout-language-switcher-component.html',
})
export class LayoutLanguageSwitcherComponent { 
  
  // Injections
  protected readonly languageService = inject(LanguageService);
  
  // IO
  isSidebarCollapsed = input.required<boolean>();
  
  // Properties
  protected isOpen = signal(false);
  
  // Methods
  protected toggleMenu(): void {
    this.isOpen.update(value => !value);
  }
  
  protected selectLanguage(lang: Lang): void {
    this.languageService.setLanguage(lang);
    this.isOpen.set(false);
  }
}
