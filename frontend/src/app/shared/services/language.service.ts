// System
import { inject, Injectable, signal } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";


@Injectable({ providedIn: 'root' })
export class LanguageService {
  
  // Injections
  private translate = inject(TranslateService);
  
  // Properties
  currentLang = signal('en');

  // Constructor
  constructor() {
    const savedLang = localStorage.getItem('language') || 'en';
    this.setLanguage(savedLang);
  }

  // Methods
  setLanguage(lang: string) {
    this.translate.use(lang);
    this.currentLang.set(lang);
    localStorage.setItem('language', lang);
  }
  
  getTranslation(key: string, params?: any): string {
    return this.translate.instant(key, params);
  }

  
}