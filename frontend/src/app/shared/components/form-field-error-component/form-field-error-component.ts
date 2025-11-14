// System
import { ChangeDetectorRef, Component, effect, inject, input } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { merge } from 'rxjs';
// Other modules
import { FormUtils } from '@utils/index';


@Component({
  standalone : true,
  selector: 'app-form-field-error',
  imports: [],
  templateUrl: './form-field-error-component.html',
})
export class FormFieldErrorComponent { 

  // Injections
  private cdr = inject(ChangeDetectorRef);

  // Properties
  control = input.required<AbstractControl>();
  
  constructor() {
    // Subscribe to control changes
    effect(() => {
      const ctrl = this.control();
      
      // Subscribe to value, status changes and touch events
      merge(
        ctrl.valueChanges,
        ctrl.statusChanges
      ).subscribe(() => {
        this.cdr.markForCheck();
      });
    });
  }

  get errorMessage() {
    const errors: ValidationErrors = this.control().errors || {};

    return this.control().touched && Object.keys(errors).length > 0
      ? FormUtils.getTextError(errors)
      : null;
  }
  
}