// System
import { Component, computed, inject, signal, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Dialog } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
// Other modules
import { ConfirmComponent } from '@shared/components';
import { AuthService } from '@auth/services';
import { User } from '@auth/interfaces';
// This module
import { LinkButtonComponent } from '../../components';
import { ɵInternalFormsSharedModule } from "@angular/forms";



@Component({
  standalone : true,
  selector: 'app-admin-dashboard-layout',
  imports: [RouterOutlet, LinkButtonComponent, CommonModule, ɵInternalFormsSharedModule],
  templateUrl: './admin-dashboard-layout.html',
})
export class AdminDashboardLayout implements OnInit {
  
  // Injections
  private dialog = inject(Dialog);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Properties
  user = computed<User | null>(this.authService.user);
  isSidebarCollapsed = signal<boolean>(true);

  // Lifecycle
  ngOnInit() {
    this.checkScreenSize();
  }

  // Listen to window resize events
  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  // Check screen size and auto-collapse on tablet and below
  private checkScreenSize() {
    const width = window.innerWidth;
    // Tablet breakpoint: 1024px (Tailwind's lg breakpoint)
    if (width < 1024) {
      this.isSidebarCollapsed.set(true);
    }
  }
  
  // Methods
  protected toggleSidebar() {
    this.isSidebarCollapsed.set(!this.isSidebarCollapsed());
  }
  
  protected get fullNameInitials(): string {
    const fullname = this.user()?.fullname || '';
    return fullname
      .split(' ')
      .map(namePart => namePart.charAt(0).toUpperCase())
      .join('');
  }


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
