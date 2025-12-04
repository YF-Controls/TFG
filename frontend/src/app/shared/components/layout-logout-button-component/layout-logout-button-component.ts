// System
import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Dialog } from '@angular/cdk/dialog';
// Other modules
import { AppPaths } from 'src/app/app.paths';
import { UserApi } from '@auth/services';
// This moudule
import { LanguageService } from '@shared/services';
// This path
import { ConfirmComponent } from '../confirm-component/confirm-component';
import { SvgIconComponent } from '../svg-icon-component/svg-icon-component';

@Component({
  standalone : true,
  selector: 'app-layout-logout-button',
  imports: [TranslateModule, SvgIconComponent],
  templateUrl: './layout-logout-button-component.html',
})
export class LayoutLogoutButtonComponent {

  // Injections
  protected readonly languageService = inject(LanguageService);
  protected readonly dialog = inject(Dialog);
  protected readonly userApi = inject(UserApi);
  protected readonly router = inject(Router);
  
  // IO
  isSidebarCollapsed = input.required<boolean>();

  // Properties

  // Methods
  protected logout() {
    console.log('!DELETE LayoutLogoutButtonComponent.logout() called');
    // Confirm popup
    const dialogRef = this.dialog.open(ConfirmComponent, {
      disableClose: false,
      data: {
        isPopup: true,
        translate: true,
        title: 'SHARED.LOGOUT_BUTTON.POPUP.TITLE',
        message: 'SHARED.LOGOUT_BUTTON.POPUP.MESSAGE' 
      }
    });
    console.log('!DELETE Dialog opened', dialogRef);
    // After closed
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
