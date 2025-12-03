// System
import { ChangeDetectorRef, Component, effect, inject, input } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { merge } from 'rxjs';
// Other modules
import { FormUtils } from '@utils/index';
// This module
import { LanguageService } from '../../services/language.service';


@Component({
  standalone : true,
  selector: 'app-form-field-error',
  imports: [],
  templateUrl: './form-field-error-component.html',
})
export class FormFieldErrorComponent { 

  // Injections
  protected readonly cdr = inject(ChangeDetectorRef);
  protected readonly languageService = inject(LanguageService);

  // IO
  control = input.required<AbstractControl>();
  
  // Methods
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
      ? FormUtils.getErrorTextFromFormField(errors, this.languageService)
      : null;
  }
  
}