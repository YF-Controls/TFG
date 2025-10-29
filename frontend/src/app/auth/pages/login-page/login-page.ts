import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './login-page.html',
})
export class LoginPageComponent { }
