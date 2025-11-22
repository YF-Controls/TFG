// System
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import { LanguageSwitcherComponent } from '@shared/components';


@Component({
  standalone : true,
  selector: 'app-auth-layout',
  imports: [RouterOutlet, TranslateModule, LanguageSwitcherComponent],
  templateUrl: './auth-layout.html',
})
export class AuthLayout {}
