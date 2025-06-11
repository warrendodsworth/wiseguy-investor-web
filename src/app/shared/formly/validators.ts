import { FormControl, ValidationErrors } from '@angular/forms';

export const ipValidator = (control: FormControl): ValidationErrors =>
  !control.value || /(\d{1,3}\.){3}\d{1,3}/.test(control.value) ? null : { ip: true };

export const urlValidator = (control: FormControl): ValidationErrors => {
  return !control.value ||
    /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i.test(control.value)
    ? null
    : { url: true };
};

export const emailValidator = (control: FormControl): ValidationErrors =>
  !control.value || /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(control.value) ? null : { email: true };

// *pattern validator
// pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
// validation: { messages: { pattern: 'Please enter a valid email' } }
