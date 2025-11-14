// System
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogRef } from '@angular/cdk/dialog';
// Ohter modules
import { DeviceAreasService } from '@device-areas/services';
import { FormFieldErrorComponent } from '@shared/components';
import { JsonPipe } from '@angular/common';


@Component({
  standalone : true,
  selector: 'app-create-device-area',
  imports: [ReactiveFormsModule, FormFieldErrorComponent, JsonPipe],
  templateUrl: './create-device-area-component.html',
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateDeviceAreaComponent {

  // Injections
  private dialogRef = inject(DialogRef, { optional: true });
  private fb = inject(FormBuilder);
  private deviceAreasService = inject(DeviceAreasService);

  // Properties
  protected hasError = signal<boolean>(false);
  protected errorMessage = signal<string>('');
  protected form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    hwId: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(8)]],
    description: ['....', [Validators.required, Validators.minLength(4)]],
    isActive: [true, [Validators.required]],
  });

  
  // Methods
  protected onSubmit() {

    if (this.form.invalid) {
      // Mark all fields as touched to show errors
      this.form.markAllAsTouched();
      this.errorToast('Not valid data!');
      return;
    }

    // Get from data
    const { name = '', hwId = '', description = '', isActive = false} = this.form.value;
    
    // Send to api
    this.deviceAreasService.create({ name, hwId, description, isActive })
      .subscribe( errorMessage => {
        if (errorMessage) {
          this.errorToast(`Create device area error: ${errorMessage}`);
          return;
        }
        
        this.dialogRef?.close(true);
    });
  }
  

  protected onCancel() {
    this.dialogRef?.close(false);
  }
  

  errorToast(message: string) {
    this.errorMessage.set(message);
    this.hasError.set(true);
    setTimeout(()=> {this.hasError.set(false);}, 13000);
  }
 }
