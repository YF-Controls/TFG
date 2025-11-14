// System
import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
// Other modules
import { AuthService } from '@auth/services';


@Component({
  standalone: true,
  selector: 'app-main-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './main-navbar-component.html',
})
export class MainNavbarComponent {
  // Attributes
  authService = inject(AuthService);
  router = inject(Router);

  
  logout () {
    this.authService.logout();
    this.router.navigateByUrl('/auth/login');
  }

  
}
