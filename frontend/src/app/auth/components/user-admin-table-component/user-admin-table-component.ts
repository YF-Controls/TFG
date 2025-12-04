// System
import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs/internal/operators/tap';
import { Dialog, DIALOG_DATA } from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import { ConfirmComponent, SvgIconComponent } from '@shared/components';
import { ToastService } from '@shared/services';
// This module
import { UserApi } from '@auth/services';
import { User } from '@auth/interfaces';
// This path
import { EditUserComponent } from '../';


@Component({
  standalone: true,
  selector: 'app-user-admin-table',
  imports: [TranslateModule, SvgIconComponent],
  templateUrl: './user-admin-table-component.html',
})
export class UserAdminTableComponent { 

  // Injections
  protected readonly dialogData = inject(DIALOG_DATA, { optional: true });
  protected readonly dialog = inject(Dialog);
  protected readonly toast = inject(ToastService);
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
  public onUpdateTable(): void {
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
      if (confirmed) this.onUpdateTable();      
    });
  }
  
  protected onDeleteOne (user: User) {
    // Confirm popup
    const dialogRef = this.dialog.open(ConfirmComponent, {
      disableClose: false,
      data: {
        isPopup: true, translate: true,
        title: 'AUTH.USER_ADMIN_TABLE.DELETE_POPUP.TITLE',
        message: 'AUTH.USER_ADMIN_TABLE.DELETE_POPUP.MESSAGE'
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
            this.toast.error(errorMessage, false);
            return;
          }
          // Done
          this.toast.success('AUTH.USER_ADMIN_TABLE.TOAST.DELETED');
          this.onUpdateTable();
        });
    });
  }
}
