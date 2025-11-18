// System
import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Dialog } from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import { LanguageService } from '@shared/services';
import { UserTableComponent } from '@auth/components';
import { User } from '@auth/interfaces';
import { AuthApi } from '@auth/services';


@Component({
  standalone : true,
  selector: 'app-users-admin-page',
  imports: [TranslateModule, UserTableComponent],
  templateUrl: './users-admin-page.html',
})
export class UsersAdminPage {

  // Injections
  private languageService = inject(LanguageService);
  private dialog = inject(Dialog);
  private authApi = inject(AuthApi);

  // Properties
  usersResource = rxResource<User[], []>({
    stream  : () => {return this.authApi.getUsers({limit: 100, offset: 0, withInactives: true, orderBy: 'fullname'})},
  });

  // Methods
  protected onAdd () {
    console.error('!DELETE onAdd in users-admin-page.ts and implement user creation logic!');
  }
  /*
    const dialogRef = this.dialog.open(RegisterComponent, {
      disableClose: true,
    });

    dialogRef.closed.subscribe((confirmed) => {
      if (confirmed) this.onUpdateTable();
    });
  }
  */
  protected onUpdateTable() {
    this.usersResource.reload();
  }
  

}
