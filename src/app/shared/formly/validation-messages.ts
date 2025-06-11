import { FormlyFieldConfig } from '@ngx-formly/core';

/**
 * Validation messages
 */
export const basicValidationMsgs = [
  { name: 'required', message: 'This field is required' },
  {
    name: 'minLength',
    message: (err: any, field: FormlyFieldConfig) => `Should have atleast ${field.templateOptions.minLength} characters`,
  },
  {
    name: 'maxLength',
    message: (err: any, field: FormlyFieldConfig) => `This value should be less than ${field.templateOptions.maxLength} characters`,
  },
  {
    name: 'min',
    message: (err: any, field: FormlyFieldConfig) => `This value should be more than ${field.templateOptions.min}`,
  },
  { name: 'max', message: (err: any, field: FormlyFieldConfig) => `This value should be less than ${field.templateOptions.max}` },

  { name: 'ip', message: (err: any, field: FormlyFieldConfig) => `"${field.formControl.value}" is not a valid IP Address` },

  { name: 'url', message: (err: any, field: FormlyFieldConfig) => `"${field.formControl.value}" is not a valid URL` },

  { name: 'email', message: (err: any, field: FormlyFieldConfig) => `Please enter a valid email` },
];
