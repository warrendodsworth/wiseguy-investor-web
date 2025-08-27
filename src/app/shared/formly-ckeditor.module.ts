import { NgModule } from '@angular/core';
import { FormlyModule } from '@ngx-formly/core';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CommonModule } from '@angular/common';
import { FormlyFieldCKEditor } from './ckeditor.type';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [FormlyFieldCKEditor],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    CKEditorModule,
    FormlyModule.forChild({
      types: [{ name: 'ckeditor', component: FormlyFieldCKEditor }],
    }),
  ],
  exports: [FormlyFieldCKEditor],
})
export class FormlyCKEditorModule {}
