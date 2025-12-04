// System
import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
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
// This module


@Component({
  standalone: true,
  selector: 'app-main-dashboard-layout',
  imports: [
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
  templateUrl: './main-dashboard-layout.html',
})
export class MainDashboardLayout implements OnInit  {

  // Injections
  protected readonly userApi = inject(UserApi);
  
  // Properties
  protected isSidebarCollapsed = signal<boolean>(false);

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
