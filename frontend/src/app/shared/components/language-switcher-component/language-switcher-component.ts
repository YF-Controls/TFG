// System
import { Component, computed, inject, input, signal } from '@angular/core';
// Other modules
import { Lang, LanguageService } from '@shared/services';
import { SvgIconComponent } from '@shared/components';


@Component({
  standalone : true,
  selector: 'app-language-switcher',
  imports: [SvgIconComponent ],
  templateUrl: './language-switcher-component.html',
})
export class LanguageSwitcherComponent { 
  
  // Injections
  protected languageService = inject(LanguageService);
  
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
