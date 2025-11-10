import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../../auth/services/auth-service';
import { User } from '../../../auth/interfaces';
import { LinkButtonComponent } from '../../components/link-button/link-button-component';

@Component({
  standalone : true,
  selector: 'app-admin-dashboard-layout',
  imports: [RouterOutlet, LinkButtonComponent ],
  templateUrl: './admin-dashboard-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
