// System
import { Component, computed, inject, input, signal } from '@angular/core';
import { NgClass } from '@angular/common';
// Other modules
import { LanguageService } from '@shared/services';


interface Language {
  code: string;
  name: string;
}

@Component({
  standalone : true,
  selector: 'app-switch-language',
  imports: [NgClass],
  templateUrl: './switch-language-component.html',
})
export class SwitchLanguageComponent { 
  
  // Injections
  protected readonly languageService = inject(LanguageService);
  
  // Properties
  isSidebarCollapsed = input<boolean>(true);
  protected readonly isOpen = signal(false);
  protected readonly languages: Language[] = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
  ];
  protected readonly currentLanguage = computed(() => 
    this.languages.find(lang => lang.code === this.languageService.currentLang()) || this.languages[0]
  );

  // Methods
  protected toggleDropdown(): void {
    this.isOpen.update(v => !v);
  }

  protected selectLanguage(lang: Language): void {
    this.languageService.setLanguage(lang.code);
    this.isOpen.set(false);
  }
}
