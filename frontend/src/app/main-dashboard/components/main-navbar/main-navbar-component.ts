// System
import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
// Other modules
import { AuthApi } from '@auth/services';


@Component({
  standalone: true,
  selector: 'app-main-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './main-navbar-component.html',
})
export class MainNavbarComponent {
  // Attributes
  authApi = inject(AuthApi);
  router = inject(Router);

  
  logout () {
    this.authApi.logoutUser();
    this.router.navigateByUrl('/auth/login');
  }

  
}
