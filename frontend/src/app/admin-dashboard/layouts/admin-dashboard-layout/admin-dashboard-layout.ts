// System
import { Component, computed, HostListener, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import { 
  LayoutBrandNameComponent,
  LayoutLanguageSwitcherComponent,
  LayoutLinkButtonPrimaryComponent,
  LayoutLinkButtonSecondaryComponent,
  LayoutLogoutButtonComponent,
  LayoutSubtitleComponent,
  LayoutThemeSwitcherComponent,
  LayoutToggleSidebarButtonComponent,
  LayoutUserNameComponent, } from '@shared/components';
import { UserApi } from '@auth/services';
import { User } from '@auth/interfaces';
// This module


@Component({
  standalone : true,
  selector: 'app-admin-dashboard-layout',
  imports: [
    CommonModule,
    TranslateModule, 
    RouterOutlet,
    LayoutBrandNameComponent,
    LayoutLanguageSwitcherComponent,
    LayoutLinkButtonPrimaryComponent,
    LayoutLinkButtonSecondaryComponent,
    LayoutLogoutButtonComponent,
    LayoutSubtitleComponent,
    LayoutThemeSwitcherComponent,
    LayoutToggleSidebarButtonComponent,
    LayoutUserNameComponent,
  ],
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

}
