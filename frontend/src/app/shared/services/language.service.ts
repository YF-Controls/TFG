// System
import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

export type LangCode = 'es' | 'en';

export interface Lang {
  code :  LangCode;
  icon : string;
  name: string;
}

const LANG_KEY = 'lang';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  
  // Injections
  private translate = inject(TranslateService);
  
  // Properties - availableLanguages debe estar ANTES de _currentLang
  readonly availableLanguages: Lang[] = [
    { code: 'en', icon: 'en', name: 'English' },
    { code: 'es', icon: 'es', name: 'Español' },
  ];
  
  private _currentLang = signal<Lang>(this.getLangFromLocalStorage());
  currentLang = computed<Lang>(() => {
    console.log('!DELETE pasa por _currentLang computation:' , this._currentLang());
    return this._currentLang()});

  // Constructor
  constructor() {
    // Set language
    effect(() => {
      console.log('!DELETE pasa por constructor effect');
      const lang = this._currentLang();
      this.setLanguage(lang);
    });
  }

  // Methods
  setLanguage(lang: Lang) {
    console.log('!DELETE pasa por setLanguage:', {lang});
    this.translate.use(lang.code);
    this._currentLang.set(lang);
    localStorage.setItem(LANG_KEY, JSON.stringify(lang));
  }

  setDefaultLanguage(): Lang {
    console.log('!DELETE pasa por setDefaultLanguage');
    const defaultLang = this.availableLanguages[0];
    this.setLanguage(defaultLang);
    return defaultLang;
  }
  /*
  private getLang(): Lang {
    console.log('!DELETE pasa por getLang');
    // Get language from localStorage
    const savedLangString = localStorage.getItem(LANG_KEY);
    // Return if does not exist
    if (!savedLangString) return this.setDefaultLanguage();
    // Parse saved language
    try {
      const savedLang = JSON.parse(savedLangString) as Lang;
      return this.availableLanguages.find(lang => lang.code === savedLang.code) || this.setDefaultLanguage();
    } catch (error) {
      return this.setDefaultLanguage();   
    }
  }
  */
 
  private getLangFromLocalStorage(): Lang {
    // Read from localStorage
    const savedLangString = localStorage.getItem(LANG_KEY);
    // Save if does not exist and return
    if (!savedLangString) return this.setDefaultLangToLocalStorage();
    // Parse saved language
    try {
      const savedLang = JSON.parse(savedLangString) as Lang;
      const foundLang = this.availableLanguages.find(lang => lang.code === savedLang.code);
      if (!foundLang) return this.setDefaultLangToLocalStorage();
      return foundLang;
    } catch (error) {
      return this.setDefaultLangToLocalStorage();
    }
  }

  private setDefaultLangToLocalStorage(): Lang {
    localStorage.setItem(LANG_KEY, JSON.stringify(this.availableLanguages[0]));
    return this.availableLanguages[0];
  }
  
  getTranslation(key: string, params?: any): string {
    return this.translate.instant(key, params);
  }
  
}