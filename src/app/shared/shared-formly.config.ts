import { ConfigOption } from '@ngx-formly/core';
import { FormlyFieldRichEditor } from './rich-editor.type';

export const FORMLY_CONFIG_SHARED: ConfigOption = {
  types: [
    {
      name: 'rich-editor',
      component: FormlyFieldRichEditor,
    },
  ],
};
