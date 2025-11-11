// System
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// Other modules
import { MainNavbarComponent } from '@main-front/components';


@Component({
  standalone: true,
  selector: 'app-main-front-layout',
  imports: [RouterOutlet, MainNavbarComponent],
  templateUrl: './main-front-layout.html',
})
export class MainFrontLayout { }
