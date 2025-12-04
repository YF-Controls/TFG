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
import { ConfirmComponent, SvgIconComponent } from '@shared/components';


@Component({
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
    // Confirm popup
    const dialogRef = this.dialog.open(ConfirmComponent, {
      disableClose: false,
      data: {
        isPopup: true,
        title: this.languageService.getTranslation('SHARED.LOGOUT_BUTTON.POPUP.TITLE'),
        message: this.languageService.getTranslation('SHARED.LOGOUT_BUTTON.POPUP.MESSAGE') 
      }
    });
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
