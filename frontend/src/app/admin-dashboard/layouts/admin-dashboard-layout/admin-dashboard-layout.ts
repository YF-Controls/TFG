// System
import { Component, computed, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Dialog } from '@angular/cdk/dialog';
// Other modules
import { ConfirmComponent } from '@shared/components';
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
  
  // Injections
  private dialog = inject(Dialog);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Properties
  user = computed<User | null>(this.authService.user);
  
  // Methods
  protected logout() {

    const dialogRef = this.dialog.open(ConfirmComponent, {
      disableClose: true,
      data: {
        title: 'Confirm Logout',
        message: 'Are you sure you want to logout?'
      }
    });

    dialogRef.closed.subscribe((confirmed) => {
      if (confirmed) {
        this.authService.logout();
        this.router.navigateByUrl('/auth/login');
      };
    });
  }
 }
