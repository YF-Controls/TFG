// System
import { Component, computed, inject, signal, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { Dialog } from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import { ConfirmComponent, SvgIconComponent, LanguageSwitcherComponent, ThemeSwitcherComponent } from '@shared/components';
import { LanguageService } from '@shared/services';
import { AuthApi } from '@auth/services';
import { User } from '@auth/interfaces';
// This module
import { LinkButtonComponent } from '../../components';


@Component({
  standalone : true,
  selector: 'app-admin-dashboard-layout',
  imports: [TranslateModule, 
            RouterOutlet,
            LinkButtonComponent,
            CommonModule,
            LanguageSwitcherComponent,
            SvgIconComponent,
            ThemeSwitcherComponent],
  templateUrl: './admin-dashboard-layout.html',
})
export class AdminDashboardLayout implements OnInit {
  
  // Injections
  private languageService = inject(LanguageService);
  private dialog = inject(Dialog);
  private authApi = inject(AuthApi);
  private router = inject(Router);

  // Properties
  user = computed<User | null>(this.authApi.user);
  isSidebarCollapsed = signal<boolean>(false);
  

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
        title: this.languageService.getTranslation('ADMIN_DASHBOARD.LAYOUT.LOGOUT.POPUP.TITLE'),
        message: this.languageService.getTranslation('ADMIN_DASHBOARD.LAYOUT.LOGOUT.POPUP.MESSAGE') 
      }
    });

    dialogRef.closed.subscribe((confirmed) => {
      if (confirmed) {
        this.authApi.logoutUser().subscribe();
        this.router.navigateByUrl('/auth/login');
      };
    });
  }
 }
