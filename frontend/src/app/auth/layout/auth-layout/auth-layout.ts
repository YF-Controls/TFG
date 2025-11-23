// System
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import { LanguageSwitcherComponent, ThemeSwitcherComponent } from '@shared/components';



@Component({
  standalone : true,
  selector: 'app-auth-layout',
  imports: [RouterOutlet, TranslateModule, LanguageSwitcherComponent, ThemeSwitcherComponent ],
  templateUrl: './auth-layout.html',
})
export class AuthLayout {
  
}
