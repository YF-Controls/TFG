// System
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { NgClass } from '@angular/common';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import { ConfirmComponent } from '@shared/components';
import { LanguageService } from '@shared/services';
// This module
import { AuthApi } from '../../services';
import { User } from '../../interfaces';
import { EditUserComponent } from '../';


@Component({
  standalone: true,
  selector: 'app-user-table',
  imports: [NgClass, TranslateModule],
  templateUrl: './user-table-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserTableComponent { 

  // Injections
  protected languageSerivce = inject(LanguageService);
  private dialog = inject(Dialog);
  private toast = inject(MatSnackBar);
  private authApi = inject(AuthApi);

  // Properties
  users = input.required<User[]>();
  updateTable = output();
  
  // Computed
  protected currentUserId = this.authApi.user()?.id ?? null;
  
  // Methods
  protected onUpdateOne (user: User) {
    const dialogRef = this.dialog.open(EditUserComponent, {
      disableClose: false,
      data: {user}
    });

    dialogRef.closed.subscribe((confirmed) => {
      if (confirmed) this.updateTable.emit();      
    });
  }
  
  protected onDeleteOne (user: User) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      disableClose: true,
      data: {
        title: this.languageSerivce.getTranslation('AUTH.USER_TABLE.DELETE_POPUP.TITLE'),
        message: this.languageSerivce.getTranslation('AUTH.USER_TABLE.DELETE_POPUP.MESSAGE')
      }
    });
    
    dialogRef.closed.subscribe((confirmed) => {
      if (!confirmed) return;
      // Delete
      this.authApi.deleteUser(user.id)
        .subscribe( errorMessage => {
          // Error
          if (errorMessage) {
            const action = this.languageSerivce.getTranslation('AUTH.USER_TABLE.TOAST.CLOSE');
            this.toast.open(errorMessage, action, { 
              duration: 3000,
              panelClass: ['toast-container-effect', 'toast-container-error'],
              horizontalPosition : 'center',
              verticalPosition : 'bottom',
            });
            return;
          }
          // Deleted!
          const message = this.languageSerivce.getTranslation('AUTH.USER_TABLE.TOAST.DELETED');
          const action = this.languageSerivce.getTranslation('AUTH.USER_TABLE.TOAST.CLOSE');
          this.toast.open(message, action, { 
            duration: 2000,
            panelClass: ['toast-container-effect', 'toast-container-success'],
            horizontalPosition : 'center',
            verticalPosition : 'bottom',
          });
          // Return
          this.updateTable.emit();
        });
    });
  }
  
}
