// System
import { Component, computed, inject, signal, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import { LanguageSwitcherComponent, ThemeSwitcherComponent, LinkButtonPrimaryComponent, LinkButtonSecondaryComponent, LogoutButtonComponent, ToggleSidebarButtonComponent } from '@shared/components';
import { UserApi } from '@auth/services';
import { User } from '@auth/interfaces';
// This module



@Component({
  standalone : true,
  selector: 'app-admin-dashboard-layout',
  imports: [TranslateModule, 
            RouterOutlet,
            LinkButtonPrimaryComponent,
            LinkButtonSecondaryComponent,
            CommonModule,
            LanguageSwitcherComponent,
            LogoutButtonComponent,
            ToggleSidebarButtonComponent,
            ThemeSwitcherComponent],
  templateUrl: './admin-dashboard-layout.html',
})
export class AdminDashboardLayout implements OnInit {
  
  // Injections
  private userApi = inject(UserApi);
  
  // Properties
  user = computed<User | null>(this.userApi.user);
  isSidebarCollapsed = signal<boolean>(false);
  
  // Methods
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
}
