// System
import { Component, computed, inject, input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { tap } from 'rxjs';
import { DialogRef } from '@angular/cdk/dialog';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { rxResource } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
// Other modules
import { ToastService } from '@shared/services';
import { FormFieldErrorComponent, SvgIconComponent } from '@shared/components';
// This module
import { DeviceAreaApi } from '@device-areas/services';
import { DeviceArea } from '@device-areas/interfaces';


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
  deviceAreaId = input<string>(this.dialogData.deviceAreaId); // 
  
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
      
      this.form.disable();
      
      return this.deviceAreaApi.getOne(params.deviceAreaId, {})
      .pipe(tap(data => {
        this.form.setValue({ // Set form values when loaded
          name: data.name,
          hwId: data.hwId,
          description: data.description,
          isActive: data.isActive,
        });
        this.form.enable(); 
      }))}
  });
  
  protected loading = computed<boolean>(() => {
    
    console.log('!DELETE -- CHECK LOADING --!');

    if (this.deviceArea.isLoading()) {
      this.form.disable();
    }

    if (this.deviceArea.hasValue()) {
      this.form.enable();
    }
    this.form.disable();
    return this.deviceArea.isLoading()});
  
  
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
