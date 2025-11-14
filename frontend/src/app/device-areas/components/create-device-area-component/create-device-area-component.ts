// System
import { Component, inject, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogRef } from '@angular/cdk/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
// Ohter modules
import { DeviceAreasService } from '@device-areas/services';
import { FormFieldErrorComponent } from '@shared/components';


@Component({
  standalone : true,
  selector: 'app-create-device-area',
  imports: [ReactiveFormsModule, FormFieldErrorComponent],
  templateUrl: './create-device-area-component.html',
})
export class CreateDeviceAreaComponent {

  // Injections
  private dialogRef = inject(DialogRef, { optional: true });
  private fb = inject(FormBuilder);
  private deviceAreasService = inject(DeviceAreasService);
  private toast = inject(MatSnackBar);

  // Properties
  protected form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    hwId: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(8)]],
    description: ['....', [Validators.required, Validators.minLength(4)]],
    isActive: [true, [Validators.required]],
  });
  
  // Methods
  protected onSubmit() {
    // Exit with toast if invalid form
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      
      this.toast.open('Form not valid data!', 'Close', { 
        duration: 2000,
        panelClass: ['toast-container-effect', 'toast-container-error'],
        horizontalPosition : 'center',
        verticalPosition : 'bottom',
      });

      return;
    }

    // Get from data
    const { name = '', hwId = '', description = '', isActive = false} = this.form.value;
    
    // Send to api
    this.deviceAreasService.create({ name, hwId, description, isActive })
      .subscribe( errorMessage => {
        // Error
        if (errorMessage) {
          this.toast.open(errorMessage, 'Close', { 
            duration: 2000,
            panelClass: ['toast-container-effect', 'toast-container-error'],
            horizontalPosition : 'center',
            verticalPosition : 'bottom',
          });
          return;
        }
        // created!
        this.toast.open('Device area created successfully!', 'Close', { 
            duration: 2000,
            panelClass: ['toast-container-effect', 'toast-container-success'],
            horizontalPosition : 'center',
            verticalPosition : 'bottom',
          });
        
        this.dialogRef?.close(true);
    });
  }

  protected onCancel() {
    this.dialogRef?.close(false);
  }

}
