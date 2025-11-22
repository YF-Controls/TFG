// System
import { Component, computed, inject, input, signal } from '@angular/core';
import { NgClass } from '@angular/common';
// Other modules
import { Lang, LanguageService } from '@shared/services';
import { SvgIconComponent } from '@shared/components';


@Component({
  standalone : true,
  selector: 'app-language-switcher',
  imports: [NgClass, SvgIconComponent ],
  templateUrl: './language-switcher-component.html',
})
export class LanguageSwitcherComponent { 
  
  // Injections
  protected languageService = inject(LanguageService);
  
  // Properties
  isSidebarCollapsed = input<boolean>(true);
  protected readonly isOpen = signal(false);
  
  // Methods
  protected toggleMenu(): void {
    this.isOpen.update(value => !value);
  }
  
  protected selectLanguage(lang: Lang): void {
    this.languageService.setLanguage(lang);
    this.isOpen.set(false);
  }
}
