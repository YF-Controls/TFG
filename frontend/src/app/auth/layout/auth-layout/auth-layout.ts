// System
import { Component, inject } from '@angular/core';
import { NgClass } from "@angular/common";
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import { LanguageService } from '@shared/services';


@Component({
  standalone : true,
  selector: 'app-auth-layout',
  imports: [RouterOutlet, TranslateModule, NgClass],
  templateUrl: './auth-layout.html',
})
export class AuthLayout {

  // Injections
  protected languageService = inject(LanguageService);
  
  // Methods
  changeLanguage(lang: string) {
    this.languageService.setLanguage(lang);
  }
  
 }
