// System
import { Component } from '@angular/core';
// This module
import { RegisterUserComponent } from '@auth/components';

@Component({
  standalone: true,
  selector: 'app-register-page',
  imports: [RegisterUserComponent],
  templateUrl: './register-page.html',
})
export class RegisterPage { }
