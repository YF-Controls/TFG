// System
import {
  AbstractControl,
  FormArray,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';
// Other modules
import { LanguageService } from '@shared/services';


// Function
async function sleep() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 2500);
  });
}


// Class
export class FormUtils {

  // Class properties
  static namePattern = '([a-zA-Z]+) ([a-zA-Z]+)';
  static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  static notOnlySpacesPattern = '^[a-zA-Z0-9]+$';
  static slugPattern = '^[a-z0-9_]+(?:-[a-z0-9_]+)*$';

  // Class methods
  static getErrorTextFromFormField(errors: ValidationErrors, languageService: LanguageService) {
    
    for (const key of Object.keys(errors)) {
      switch (key) {
        
        case 'required':
         return languageService.getTranslation('UTILS.GET_ERROR_TEXT_FROM_FORM_FIELD.REQUIRED');
        
        case 'email':
          return languageService.getTranslation('UTILS.GET_ERROR_TEXT_FROM_FORM_FIELD.EMAIL');
        
        case 'minlength':
          return languageService.getTranslation('UTILS.GET_ERROR_TEXT_FROM_FORM_FIELD.MIN_LENGTH') +
                 errors['minlength'].requiredLength + 
                 languageService.getTranslation('UTILS.GET_ERROR_TEXT_FROM_FORM_FIELD.CHRARACTERS');
        
        case 'maxlength':
          return languageService.getTranslation('UTILS.GET_ERROR_TEXT_FROM_FORM_FIELD.MAX_LENGTH') +
                 errors['maxlength'].requiredLength + 
                 languageService.getTranslation('UTILS.GET_ERROR_TEXT_FROM_FORM_FIELD.CHRARACTERS');

        case 'min':
          return languageService.getTranslation('UTILS.GET_ERROR_TEXT_FROM_FORM_FIELD.MIN') +
                 errors['min'].requiredMin;
          
        case 'max':
          return languageService.getTranslation('UTILS.GET_ERROR_TEXT_FROM_FORM_FIELD.MAX') +
                 errors['max'].requiredMax;

        case 'emailTaken':
          return languageService.getTranslation('UTILS.GET_ERROR_TEXT_FROM_FORM_FIELD.EMAIL_TAKEN');
        case 'noStrider':
          return languageService.getTranslation('UTILS.GET_ERROR_TEXT_FROM_FORM_FIELD.NO_STRIDER');
          
        case 'pattern':
          if (errors['pattern'].requiredPattern === FormUtils.emailPattern) {
            return languageService.getTranslation('UTILS.GET_ERROR_TEXT_FROM_FORM_FIELD.EMAIL_PATTERN');
          }
          return languageService.getTranslation('UTILS.GET_ERROR_TEXT_FROM_FORM_FIELD.PATTERN');
          
        default:
          return languageService.getTranslation('UTILS.GET_ERROR_TEXT_FROM_FORM_FIELD.DEFAULT');
      }
    }

    return null;
  }

  static isValidField(form: FormGroup, fieldName: string): boolean | null {
    return (
      !!form.controls[fieldName].errors && form.controls[fieldName].touched
    );
  }

  static getFieldError(form: FormGroup, fieldName: string, languageService: LanguageService): string | null {
    if (!form.controls[fieldName]) return null;

    const errors = form.controls[fieldName].errors ?? {};

    return FormUtils.getErrorTextFromFormField(errors, languageService);
  }

  static isValidFieldInArray(formArray: FormArray, index: number) {
    return (
      formArray.controls[index].errors && formArray.controls[index].touched
    );
  }

  static getFieldErrorInArray(
    formArray: FormArray,
    index: number,
    languageService: LanguageService
  ): string | null {
    if (formArray.controls.length === 0) return null;

    const errors = formArray.controls[index].errors ?? {};

    return FormUtils.getErrorTextFromFormField(errors, languageService);
  }

  static isFieldOneEqualFieldTwo(field1: string, field2: string) {
    return (formGroup: AbstractControl) => {
      const field1Value = formGroup.get(field1)?.value;
      const field2Value = formGroup.get(field2)?.value;

      return field1Value === field2Value ? null : { passwordsNotEqual: true };
    };
  }

  /*
  static async checkingServerResponse(
    control: AbstractControl
  ): Promise<ValidationErrors | null> {
    
    await sleep(); // 2 segundos y medio

    const formValue = control.value;

    if (formValue === 'hola@mundo.com') {
      return {
        emailTaken: true,
      };
    }

    return null;
  }
  */

  static notStrider(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    return value === 'strider' ? { noStrider: true } : null;
  }
}