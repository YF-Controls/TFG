// System
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogRef } from '@angular/cdk/dialog';
// Ohter modules
import { DeviceAreasService } from '@device-areas/services';


@Component({
  standalone : true,
  selector: 'app-create-device-area',
  imports: [ReactiveFormsModule],
  templateUrl: './create-device-area-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateDeviceAreaComponent {

  // Injections
  private dialogRef = inject(DialogRef, { optional: true });
  private fb = inject(FormBuilder);
  private deviceAreasService = inject(DeviceAreasService);

  // Properties
  protected form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    hwId: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(8)]],
    description: ['....', [Validators.required, Validators.minLength(4)]],
    isActive: [true, [Validators.required]],
  });

  protected hasError = signal<boolean>(false);
  errorMessage = signal<string>('');

  // Methods


  protected onSubmit() {
    if (this.form.invalid) {
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



  protected isNotValidField (fieldName: string): boolean | null {
    return (this.form.controls[fieldName] &&
           this.form.controls[fieldName].touched); 
  }

  protected getFieldError (fieldName: string): string | null {

    if (!this.form.controls[fieldName]) return null;

    const errors = this.form.controls[fieldName].errors ?? {};

    for (const key of Object.keys(errors)) {
      
      switch(key) {
        
        case 'required':
          return 'Required field!';

        case 'minlength':
          return `Min. length is ${errors['minlength'].requiredLength} chars!`;
        
        case 'maxlength':
          return `Max. length is ${errors['maxlength'].requiredLength} chars!`;
      }
    }
    // Default
    return null;
  }
  
  errorToast(message: string) {
    this.errorMessage.set(message);
    this.hasError.set(true);
    setTimeout(()=> {this.hasError.set(false);}, 13000);
  }
 }
