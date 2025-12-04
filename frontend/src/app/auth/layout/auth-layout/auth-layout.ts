// System
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import {
  LayoutBrandNameComponent,
  LayoutLanguageSwitcherComponent,
  LayoutThemeSwitcherComponent } from '@shared/components';


@Component({
  standalone : true,
  selector: 'app-auth-layout',
  imports: [
    RouterOutlet,
    TranslateModule,
    LayoutBrandNameComponent,
    LayoutLanguageSwitcherComponent,
    LayoutThemeSwitcherComponent,
  ],
  templateUrl: './auth-layout.html',
  host: {class: 'h-screen flex flex-col overflow-hidden'}
})
export class AuthLayout {}
