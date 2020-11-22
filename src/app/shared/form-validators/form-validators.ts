import {
  AbstractControl,
  ValidatorFn,
} from '@angular/forms';

export class FormValidator {
  static isRequired(label: string = ''): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const isValid =
        control.value !== null &&
        control.value.toString().trim().length > 0 &&
        control.value !== undefined;
      return isValid ? null : { required: { valid: false, value: control.value, } };
    };
  }
}
