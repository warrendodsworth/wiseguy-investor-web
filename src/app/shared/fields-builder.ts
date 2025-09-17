import { FormlyFieldConfig } from '@ngx-formly/core';

/**
 * form builder fields
 */
export const ionFieldTypeSelect: FormlyFieldConfig = {
  key: 'type',
  type: 'select',
  defaultValue: 'input',
  props: {
    label: 'Field Type',
    interface: 'action-sheet',
    options: [
      { label: 'input', value: 'input' },
      { label: 'checkbox', value: 'checkbox' },
      { label: 'radio', value: 'radio-emojis' },
      // { label: 'slides', value: 'slides' }
    ],
  },
};
export const ionFieldLabelPositonSelect: FormlyFieldConfig = {
  key: 'props.labelPosition',
  type: 'select',
  defaultValue: 'stacked',
  props: {
    label: 'Field Label Position',
    interface: 'action-sheet',
    options: [
      { label: 'default', value: '' },
      { label: 'floating', value: 'floating' },
      { label: 'stacked', value: 'stacked' },
      { label: 'fixed', value: 'fixed' },
    ],
  },
};
