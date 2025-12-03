// System
import { Component, inject, input } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { SvgIconComponent } from '../svg-icon-component/svg-icon-component';


@Component({
  standalone : true,
  selector: 'app-confirm',
  imports: [SvgIconComponent],
  templateUrl: './confirm-component.html',
})
export class ConfirmComponent { 
  
  // Properties
  protected readonly dialogData = inject(DIALOG_DATA, { optional: true });
  protected readonly dialogRef = inject(DialogRef, { optional: true });
  
  // IO
  title = input<string>(this.dialogData.title || '?');
  message = input<string>(this.dialogData.message || '?');
  
  // Methods
  protected onConfirm() {
    this.dialogRef?.close(true);
  }
  
  protected onCancel() {
    this.dialogRef?.close(false);
  }
}
