// System
import { Component, inject, input} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, tap } from 'rxjs';
// Other modules
import { FormFieldErrorComponent, SvgIconComponent } from '@shared/components';
import { ToastService } from '@shared/services';
// This module
import { DeviceArea } from '@device-areas/interfaces';
import { DeviceAreaApi } from '@device-areas/services';


@Component({
  standalone : true,
  selector: 'app-edit-device-area',
  imports: [TranslateModule, SvgIconComponent ,ReactiveFormsModule, FormFieldErrorComponent],
  templateUrl: './edit-device-area-component.html',
})
export class EditDeviceAreaComponent {
  
  // Injections
  protected readonly dialogData = inject(DIALOG_DATA, { optional: true });
  protected readonly dialogRef = inject(DialogRef, { optional: true });
  protected readonly toast = inject(ToastService);
  protected readonly fb = inject(FormBuilder);
  protected readonly deviceAreaApi = inject(DeviceAreaApi);
  
  // IO
  deviceAreaId = input<string>(this.dialogData.deviceAreaId);
  
  // Properties
  protected form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    hwId: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
    description: ['', [Validators.required, Validators.minLength(4)]],
    isActive: [false, [Validators.required]],
  });

  protected deviceArea = rxResource<DeviceArea, {deviceAreaId: string}>({
    params: () => ({ deviceAreaId: this.deviceAreaId() }),
    stream: ({params}) => {
      this.form.disable(); // Disable form while loading
      return this.deviceAreaApi.getOne(params.deviceAreaId, {})
        .pipe(
          tap(data => {
            this.form.setValue({ // Set form values when loaded
              name: data.name,
              hwId: data.hwId,
              description: data.description,
              isActive: data.isActive,
            });
            this.form.enable(); // enable form
          }),
          catchError((error: HttpErrorResponse) => {
            this.toast.error(error.message, false); // Show toast
            this.dialogRef?.close(false); // Close dialog
            return [];
  }))}});
  
  // Methods
  protected onSubmit() {
    // Exit with toast if invalid form
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.error('DEVICE_AREAS.EDIT_DEVICE_AREA.TOAST.FORM_ERROR');
      return;
    }
    // Get form data
    const { name = '', hwId = '', description = '', isActive = false} = this.form.value;
    // Send to api
    this.deviceAreaApi.updateOne(this.deviceAreaId(), { name, hwId, description, isActive })
      .subscribe( errorMessage => {
        // Error
        if (errorMessage) {
          this.toast.error(errorMessage, false);
          return;
        }
        // Done
        this.toast.success('DEVICE_AREAS.EDIT_DEVICE_AREA.TOAST.SUCCESS');
        this.dialogRef?.close(true);
    });
  }

  protected onCancel() {
    this.dialogRef?.close(false);
  }
}
