// System
import { CommonModule } from '@angular/common';
import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import { LanguageSwitcherComponent, LinkButtonPrimaryComponent, LinkButtonSecondaryComponent, LogoutButtonComponent, ThemeSwitcherComponent, ToggleSidebarButtonComponent } from '@shared/components';
import { User, ValidRoles } from '@auth/interfaces';
import { UserApi } from '@auth/services';
// This module


@Component({
  standalone: true,
  selector: 'app-main-dashboard-layout',
  imports: [TranslateModule, 
            RouterOutlet,
            LinkButtonPrimaryComponent,
            LinkButtonSecondaryComponent,
            CommonModule,
            LanguageSwitcherComponent,
            LogoutButtonComponent,
            ToggleSidebarButtonComponent,
            ThemeSwitcherComponent],
  templateUrl: './main-dashboard-layout.html',
})
export class MainDashboardLayout {
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
  
  protected isAdmin (): boolean {
    const roles = this.user()?.roles || [];
    return roles.includes(ValidRoles.admin);
  }
}
