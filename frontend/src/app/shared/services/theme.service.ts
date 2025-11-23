// System
import { computed, effect, inject, Injectable, signal } from "@angular/core";
// This module
import { LanguageService } from './';

export type ThemeCode = 'light' | 'dark' | 'halloween';

export interface Theme {
  code :  ThemeCode;
  icon: string;
  name: string;
}

const THEME_KEY = 'theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  
  // Injections
  private languageService = inject(LanguageService);

  // Properties
  availableThemes = computed<Theme[]>(() => {
    // Trigger recomputation when language changes
    this.languageService.currentLang();
    this.languageService.translationsLoaded();

    return [
      { code: 'light', icon: '☀️', name: this.languageService.getTranslation('SHARED.THEME_SERVICE.THEME.LIGHT') },
      { code: 'dark', icon: '🌙', name: this.languageService.getTranslation('SHARED.THEME_SERVICE.THEME.DARK') },
      { code: 'halloween', icon: '🎃', name: this.languageService.getTranslation('SHARED.THEME_SERVICE.THEME.HALLOWEEN') }
    ];
  });
  
  private _currentTheme = signal<Theme>(this.getThemeFromLocalStorage());
  currentTheme = computed<Theme>(() => this._currentTheme());
  
  // Constructor
  constructor() {
    // Set theme
    effect(() => {
      this.languageService.currentLang();
      const theme = this._currentTheme();
      this.setTheme(theme);
    });
  }
  
  // Methods
  setTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme.code);
    this._currentTheme.set(theme);
    localStorage.setItem('theme', JSON.stringify(theme));
  }
   
  setDefaultTheme(): Theme {
    const defaultTheme = this.availableThemes()[0];
    this.setTheme(defaultTheme);
    return defaultTheme;
  }

  private getThemeFromLocalStorage(): Theme {
    // Get theme from localStorage
    const savedThemeCode = localStorage.getItem(THEME_KEY);
    // Return if does not exist
    if (!savedThemeCode) return this.setDefaultThemeInLocalStorage();
    // Parse saved theme
    try {
      const savedTheme = JSON.parse(savedThemeCode) as Theme;
      const foundTheme = this.availableThemes().find(theme => theme.code === savedTheme.code);
      if (!foundTheme) return this.setDefaultThemeInLocalStorage();
      return foundTheme;
    } catch (error) {
      return this.setDefaultThemeInLocalStorage();
    }
  }

  private setDefaultThemeInLocalStorage(): Theme {
    localStorage.setItem(THEME_KEY, JSON.stringify(this.availableThemes()[0]));
    return this.availableThemes()[0];
  }
}
