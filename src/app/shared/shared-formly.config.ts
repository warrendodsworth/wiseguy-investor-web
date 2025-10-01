import { ConfigOption, provideFormlyConfig } from '@ngx-formly/core';
import { FormlyFieldRichEditor } from './rich-editor.type';
import { NgModule } from '@angular/core';

export const FORMLY_CONFIG_SHARED: ConfigOption = {
  types: [
    {
      name: 'rich-editor',
      component: FormlyFieldRichEditor,
    },
  ],
};

@NgModule({
  providers: [provideFormlyConfig(FORMLY_CONFIG_SHARED)],
})
export class FormlyChildModule {}
