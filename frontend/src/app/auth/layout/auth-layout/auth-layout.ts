// System
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';


@Component({
  standalone : true,
  selector: 'app-auth-layout',
  imports: [RouterOutlet ],
  templateUrl: './auth-layout.html',
})
export class AuthLayout { }
