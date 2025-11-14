// System
import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
// Other modules
import { AuthService } from '@auth/services';
import { User } from '@auth/interfaces';
// This module
import { LinkButtonComponent } from '../../components';

@Component({
  standalone : true,
  selector: 'app-admin-dashboard-layout',
  imports: [RouterOutlet, LinkButtonComponent ],
  templateUrl: './admin-dashboard-layout.html',
})
export class AdminDashboardLayout {
  
  // Private attributes
  private authService = inject(AuthService);
  private router = inject(Router);

  // Protected attributes
  

  // Public attributes
  user = computed<User | null>(this.authService.user);
   

  // Constructor

  // Methods
  //ngOnInit(): void {
    
  //}

  logout() {
    this.authService.logout();
    //this.router.navigateByUrl('/auth/login');
  }
  

 }
