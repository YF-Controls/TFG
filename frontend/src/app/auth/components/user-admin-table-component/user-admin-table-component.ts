// System
import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs/internal/operators/tap';
import { Dialog } from '@angular/cdk/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import { ConfirmComponent, SvgIconComponent } from '@shared/components';
import { LanguageService } from '@shared/services';
// This module
import { UserApi } from '../../services';
import { User } from '../../interfaces';
import { EditUserComponent } from '..';


@Component({
  standalone: true,
  selector: 'app-user-admin-table',
  imports: [TranslateModule, SvgIconComponent],
  templateUrl: './user-admin-table-component.html',
})
export class UserAdminTableComponent { 

  // Injections
  protected readonly languageService = inject(LanguageService);
  protected readonly dialog = inject(Dialog);
  protected readonly toast = inject(MatSnackBar);
  protected readonly userApi = inject(UserApi);

  // IO
  totalChanged = output<number>();
  
    // Properties
  public users = rxResource<User[], []>({
    stream: () => {
      
      return this.userApi.getAll({
        orderBy: 'fullname',
        //limit: null,
        offset: 0
      }).pipe(tap(users => this.totalChanged.emit(users.length)));
    },
  });
  protected currentUserId = signal<string>(this.userApi.user()?.id || '');
  

  // Methods
  public updateTable(): void {
    this.users.reload();
  }

  protected onUpdateOne (user: User) {
    // Open popup
    const dialogRef = this.dialog.open(EditUserComponent, {
      disableClose: false,
      data: { isPopup: true, userId : user.id}
    });
    // After closed
    dialogRef.closed.subscribe((confirmed) => {
      if (confirmed) this.updateTable();      
    });
  }
  
  protected onDeleteOne (user: User) {
    // Confirm popup
    const dialogRef = this.dialog.open(ConfirmComponent, {
      disableClose: false,
      data: {
        isPopup: true,
        title: this.languageService.getTranslation('AUTH.USER_ADMIN_TABLE.DELETE_POPUP.TITLE'),
        message: this.languageService.getTranslation('AUTH.USER_ADMIN_TABLE.DELETE_POPUP.MESSAGE')
      }
    }); 
    // After closed
    dialogRef.closed.subscribe((confirmed) => {
      if (!confirmed) return;
      // Delete
      this.userApi.deleteOne(user.id)
        .subscribe( errorMessage => {
          // Error
          if (errorMessage) {
            const action = this.languageService.getTranslation('AUTH.USER_ADMIN_TABLE.TOAST.CLOSE');
            this.toast.open(errorMessage, action, { 
              duration: 3000,
              panelClass: ['app-toast-container-effect', 'app-toast-container-error'],
              horizontalPosition : 'center',
              verticalPosition : 'bottom',
            });
            return;
          }
          // Deleted!
          const message = this.languageService.getTranslation('AUTH.USER_ADMIN_TABLE.TOAST.DELETED');
          const action = this.languageService.getTranslation('AUTH.USER_ADMIN_TABLE.TOAST.CLOSE');
          this.toast.open(message, action, { 
            duration: 2000,
            panelClass: ['app-toast-container-effect', 'app-toast-container-success'],
            horizontalPosition : 'center',
            verticalPosition : 'bottom',
          });
          // Return
          this.updateTable();
        });
    });
  }
}
