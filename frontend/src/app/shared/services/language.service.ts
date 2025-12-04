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
  protected readonly translateService = inject(TranslateService);
  
  // Properties - availableLanguages debe estar ANTES de _currentLang
  readonly availableLanguages: Lang[] = [
    { code: 'en', icon: 'en', name: 'English' },
    { code: 'es', icon: 'es', name: 'Español' },
  ];
  
  private _currentLang = signal<Lang>(this.getLangFromLocalStorage());
  currentLang = computed<Lang>(() => this._currentLang());
  
  private _translationsLoaded = signal<boolean>(false);
  translationsLoaded = computed<boolean>(() => this._translationsLoaded());

  // Constructor
  constructor() {
    // Set language
    effect(() => {
      const lang = this._currentLang();
      this.setLanguage(lang);
    });
  }

  // Methods
  setLanguage(lang: Lang) {
    this.translateService.use(lang.code).subscribe(() => {
      this._translationsLoaded.set(true);
    });
    this._currentLang.set(lang);
    localStorage.setItem(LANG_KEY, JSON.stringify(lang));
  }

  setDefaultLanguage(): Lang {
    const defaultLang = this.availableLanguages[0];
    this.setLanguage(defaultLang);
    return defaultLang;
  }
  
  private getLangFromLocalStorage(): Lang {
    // Read from localStorage
    const savedLangString = localStorage.getItem(LANG_KEY);
    // Return if does not exist
    if (!savedLangString) return this.setDefaultLangInLocalStorage();
    // Parse saved language
    try {
      const savedLang = JSON.parse(savedLangString) as Lang;
      const foundLang = this.availableLanguages.find(lang => lang.code === savedLang.code);
      if (!foundLang) return this.setDefaultLangInLocalStorage();
      return foundLang;
    } catch (error) {
      return this.setDefaultLangInLocalStorage();
    }
  }

  private setDefaultLangInLocalStorage(): Lang {
    localStorage.setItem(LANG_KEY, JSON.stringify(this.availableLanguages[0]));
    return this.availableLanguages[0];
  }
  
  public translate(key: string, params?: any): string {
    return this.translateService.instant(key, params);
  }
  
}