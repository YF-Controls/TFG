import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
// App modules
import { AuthService } from '../../../auth/services';



@Component({
  selector: 'app-main-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './main-navbar.component.html',
  standalone: true,
})
export class MainNavbarComponent {
  // Attributes
  authService = inject(AuthService);
}
