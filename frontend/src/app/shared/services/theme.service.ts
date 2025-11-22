// System
import { Injectable, signal, effect, computed, inject } from '@angular/core';
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
  readonly availableThemes: Theme[] = [
    { code: 'light', icon: '☀️', name: this.languageService.getTranslation('SHARED.THEME_SERVICE.THEME.LIGHT') },
    { code: 'dark', icon: '🌙', name: this.languageService.getTranslation('SHARED.THEME_SERVICE.THEME.DARK') },
    { code: 'halloween', icon: '🎃', name: this.languageService.getTranslation('SHARED.THEME_SERVICE.THEME.HALLOWEEN') }
  ];
  
  private _currentTheme = signal<Theme>(this.getInitialTheme());
  currentTheme = computed<Theme>(() => this._currentTheme());
  
  // Constructor
  constructor() {
    // Set theme
    effect(() => {
      const theme = this._currentTheme();
      this.setTheme(theme);
    });
  }
  
  // Methods
  setTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme.code);
    this._currentTheme.set(theme);
    console.log('!DELETE Setting theme to:', theme);
    localStorage.setItem('theme', JSON.stringify(theme));
  }
   
  setDefaultTheme(): Theme {
    const defaultTheme = this.availableThemes[0];
    this.setTheme(defaultTheme);
    return defaultTheme;
  }

  private getInitialTheme(): Theme {
    // Get theme from localStorage
    const savedThemeCode = localStorage.getItem('theme');
    // Return if does not exist
    if (!savedThemeCode) return this.setDefaultTheme();
    // Parse saved theme
    try {
      const theme: Theme = JSON.parse(savedThemeCode) as Theme;
      return this.availableThemes.find(t => t.code === theme.code) || this.setDefaultTheme();
    } catch (error) {
      return this.setDefaultTheme();
    }
  }

}
