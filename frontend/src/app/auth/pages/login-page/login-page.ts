// System
import { Component } from '@angular/core';
// Auth
import { LoginUserComponent } from '@auth/components';

@Component({
  standalone: true,
  selector: 'app-login-page',
  imports: [LoginUserComponent],
  templateUrl: './login-page.html',
})
export class LoginPage { }
