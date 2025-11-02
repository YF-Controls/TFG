import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainNavbarComponent } from '../../components';

@Component({
  selector: 'app-main-front-layout',
  imports: [RouterOutlet, MainNavbarComponent],
  templateUrl: './main-front-layout.component.html',
})
export class MainFrontLayoutComponent { }
