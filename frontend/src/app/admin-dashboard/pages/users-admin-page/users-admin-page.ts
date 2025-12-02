// System
import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Dialog } from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import { LanguageService } from '@shared/services';
import { RegisterUserComponent, UserTableComponent } from '@auth/components';
import { User } from '@auth/interfaces';
import { UserApi } from '@auth/services';
import { SvgIconComponent } from '@shared/components';


@Component({
  standalone : true,
  selector: 'app-users-admin-page',
  imports: [TranslateModule, UserTableComponent, SvgIconComponent],
  templateUrl: './users-admin-page.html',
})
export class UsersAdminPage {

  // Injections
  private languageService = inject(LanguageService);
  private dialog = inject(Dialog);
  private userApi = inject(UserApi);

  // Properties
  usersResource = rxResource<User[], []>({
    stream  : () => this.userApi.getAll({withInactives: true, orderBy: 'fullname'}),
  });

  // Methods
  protected onAdd () {
    
    const dialogRef = this.dialog.open(RegisterUserComponent, {
      disableClose: true, 
      data: { isPopup: true }
    });

    dialogRef.closed.subscribe((confirmed) => {
      if (confirmed) this.onUpdateTable();
    });
  }
  
  protected onUpdateTable() {
    this.usersResource.reload();
  }
  

}
