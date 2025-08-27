import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'formly-field-ckeditor',
  template: `
    <label *ngIf="props.label" class="form-label">{{ props.label }}</label>
    <!-- <ckeditor
      [editor]="Editor"
      [formControl]="formControl"
      [config]="props.config"
      [disabled]="props.disabled"
      [ngClass]="props.className"
    ></ckeditor> -->
  `,
})
export class FormlyFieldCKEditor extends FieldType implements AfterViewInit {
  // Editor = ClassicEditor;
  @ViewChild('ckeditor') ckeditor: any;

  ngAfterViewInit() {
    // Optionally, you can access the CKEditor instance here
  }
}
