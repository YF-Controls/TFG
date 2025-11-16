// System
import { Component, inject, input } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { DIALOG_DATA } from '@angular/cdk/dialog';


@Component({
  standalone : true,
  selector: 'app-confirm',
  imports: [],
  templateUrl: './confirm-component.html',
})
export class ConfirmComponent { 
  
  // Properties
  private dialogData = inject(DIALOG_DATA);
  private dialogRef = inject(DialogRef, { optional: true });
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
