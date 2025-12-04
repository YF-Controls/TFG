// System
import { Component, inject, signal, ViewChild } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import { SvgIconComponent } from '@shared/components';
import { RegisterUserComponent, UserAdminTableComponent } from '@auth/components';


@Component({
  standalone : true,
  selector: 'app-users-admin-page',
  imports: [TranslateModule, UserAdminTableComponent, SvgIconComponent],
  templateUrl: './users-admin-page.html',
})
export class UsersAdminPage {

  // Injections
  protected readonly dialog = inject(Dialog);
  
  // ViewChild
  @ViewChild(UserAdminTableComponent) table!: UserAdminTableComponent;
  
  // IO
  protected total = signal<number>(0);

  // Methods
  protected onAdd () {
    // Open popup
    const dialogRef = this.dialog.open(RegisterUserComponent, {
      disableClose: false, 
      data: { isPopup: true }
    });
    // After closed
    dialogRef.closed.subscribe((confirmed) => {
      if (confirmed) this.table?.updateTable();
    });
  }
}
