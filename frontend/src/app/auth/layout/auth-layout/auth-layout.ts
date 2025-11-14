// System
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import { SwitchLanguageComponent } from '@shared/components';


@Component({
  standalone : true,
  selector: 'app-auth-layout',
  imports: [RouterOutlet, TranslateModule, SwitchLanguageComponent, ],
  templateUrl: './auth-layout.html',
})
export class AuthLayout {}
