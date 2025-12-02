// System
import { CommonModule } from '@angular/common';
import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Dialog } from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import { ConfirmComponent, LanguageSwitcherComponent, LinkButtonComponent, SvgIconComponent, ThemeSwitcherComponent } from '@shared/components';
import { LanguageService } from '@shared/services';
import { User, ValidRoles } from '@auth/interfaces';
import { UserApi } from '@auth/services';
import { AppPaths } from 'src/app/app.paths';


@Component({
  standalone: true,
  selector: 'app-main-dashboard-layout',
  imports: [TranslateModule, 
            RouterOutlet,
            LinkButtonComponent,
            CommonModule,
            LanguageSwitcherComponent,
            SvgIconComponent,
            ThemeSwitcherComponent],
  templateUrl: './main-dashboard-layout.html',
})
export class MainDashboardLayout {
  // Injections
  private languageService = inject(LanguageService);
  private dialog = inject(Dialog);
  private userApi = inject(UserApi);
  private router = inject(Router);

    // Properties
  user = computed<User | null>(this.userApi.user);
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


  protected isAdmin (): boolean {
    const roles = this.user()?.roles || [];
    return roles.includes(ValidRoles.admin);
  }


  // Methods
  protected logout() {

    const dialogRef = this.dialog.open(ConfirmComponent, {
      disableClose: true,
      data: {
        title: this.languageService.getTranslation('MAIN_DASHBOARD.LAYOUT.LOGOUT.POPUP.TITLE'),
        message: this.languageService.getTranslation('MAIN_DASHBOARD.LAYOUT.LOGOUT.POPUP.MESSAGE') 
      }
    });

    dialogRef.closed.subscribe((confirmed) => {
      if (confirmed) {
        this.userApi.logout()
          .subscribe(() => {
            this.router.navigateByUrl(AppPaths.FULL_LOGIN);
          });
      };
    });
  }
  

  
 }
