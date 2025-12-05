// System
import { Component, inject, input } from '@angular/core';
// This modules
import { DropdownControlService, Lang, LanguageService } from '@shared/services';
// This path
//import { SvgIconComponent } from '../svg-icon-component/svg-icon-component';


@Component({
  standalone : true,
  selector: 'app-layout-language-switcher',
  imports: [], // SvgIconComponent 
  templateUrl: './layout-language-switcher-component.html',
})
export class LayoutLanguageSwitcherComponent { 
  
  // Injections
  protected readonly languageService = inject(LanguageService);
  protected readonly dropdown = inject(DropdownControlService);
  
  // IO
  id = input.required<string>();
  isSidebarCollapsed = input.required<boolean>();
  
  // Properties

  // Methods
  protected selectLanguage(lang: Lang): void {
    this.languageService.setLanguage(lang);
  }
  
  protected onToggle(isOpen: boolean) {
    if (isOpen) this.dropdown.open(this.id());
    else this.dropdown.close(this.id());
  }
  
}

