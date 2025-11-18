// System
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// Other modules
import { MainNavbarComponent } from '@main/components';


@Component({
  standalone: true,
  selector: 'app-main-dashboard-layout',
  imports: [RouterOutlet, MainNavbarComponent],
  templateUrl: './main-dashboard-layout.html',
})
export class MainDashboardLayout { }
