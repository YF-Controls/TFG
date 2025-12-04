// System
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DialogRef } from '@angular/cdk/dialog';
import { DIALOG_DATA } from '@angular/cdk/dialog';
// This module
import { LanguageService } from '@shared/services';
// This path
import { SvgIconComponent } from '../svg-icon-component/svg-icon-component';


@Component({
  standalone : true,
  selector: 'app-confirm',
  imports: [TranslateModule, SvgIconComponent],
  templateUrl: './confirm-component.html',
})
export class ConfirmComponent implements OnInit {
  
  // Properties
  protected readonly languageService = inject(LanguageService);
  protected readonly dialogData = inject(DIALOG_DATA, { optional: true });
  protected readonly dialogRef = inject(DialogRef, { optional: true });
  
  // IO
  translate = input<boolean>(false);
  title = input<string>('');
  message = input<string>('');
  
  protected _title =signal<string>('');
  protected _message =signal<string>('');

  // Methods
  ngOnInit(): void {
    if (this.dialogData?.isPopup) this.handleDialogData();
    else this.handleInputs();
  } 
  
  protected handleInputs() {
    this._message.set(this.translate() ? this.languageService.translation(this.message()) : this.message());
    this._title.set(this.translate() ? this.languageService.translation(this.title()) : this.title());
  }

  protected handleDialogData() {
    this._message.set(this.dialogData.translate ? this.languageService.translation(this.dialogData.message) : this.dialogData.message);
    this._title.set(this.dialogData.translate ? this.languageService.translation(this.dialogData.title) : this.dialogData.title);
  }
  
  protected onConfirm() {
    this.dialogRef?.close(true);
  }
  
  protected onCancel() {
    this.dialogRef?.close(false);
  }
}
